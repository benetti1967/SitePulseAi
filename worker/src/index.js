const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};

const PUBLIC_ROUTES = new Set(["/api/health"]);

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });
}

function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin, env) {
  const origins = allowedOrigins(env);
  const allowOrigin = origin && origins.includes(origin) ? origin : null;
  return {
    ...(allowOrigin ? { "access-control-allow-origin": allowOrigin } : {}),
    "access-control-allow-credentials": "true",
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": [
      "content-type",
      "cf-access-jwt-assertion",
      "cf-access-authenticated-user-email",
      "x-sitepulse-demo-user",
      "x-request-id",
    ].join(","),
    vary: "Origin",
  };
}

function securityHeaders(request, env) {
  return corsHeaders(request.headers.get("origin"), env);
}

function requestId(request) {
  return request.headers.get("x-request-id") || crypto.randomUUID();
}

function fail(message, status = 400, code = "bad_request") {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  return error;
}

function getIdentityEmail(request, env) {
  const accessEmail = request.headers.get("cf-access-authenticated-user-email");
  if (accessEmail) return { email: accessEmail.toLowerCase(), mode: "cloudflare_access" };

  const demoEmail = request.headers.get("x-sitepulse-demo-user");
  if (demoEmail && env.ALLOW_DEMO_AUTH === "true") {
    return { email: demoEmail.toLowerCase(), mode: "demo_header" };
  }

  if (env.REQUIRE_ACCESS_AUTH === "false") {
    return { email: (env.LOCAL_DEMO_USER_EMAIL || "admin@example.com").toLowerCase(), mode: "local_demo" };
  }

  throw fail("Cloudflare Access authentication required", 401, "authentication_required");
}

function parsePermissions(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return {};
  }
}

function roleAllows(permissions, resource, action) {
  if (permissions.all === true) return true;
  const granted = permissions[resource];
  if (!granted) return false;
  if (granted === true || granted === action) return true;
  if (action === "read" && ["write", "approve", "upload", "comment"].includes(granted)) return true;
  if (action === "upload" && ["write", "approve"].includes(granted)) return true;
  if (action === "comment" && ["write", "approve"].includes(granted)) return true;
  if (action === "write" && granted === "approve") return true;
  return false;
}

function hasOrgAccess(context) {
  return context.roles.some((role) => role.scope === "organization" || role.permissions.all === true);
}

function hasPermission(context, resource, action = "read") {
  return context.roles.some((role) => roleAllows(role.permissions, resource, action));
}

function allowedSiteIds(context) {
  if (hasOrgAccess(context)) return null;
  return [...new Set(context.roles.map((role) => role.site_id).filter(Boolean))];
}

function siteFilterSql(context, tableAlias = "sites") {
  const sites = allowedSiteIds(context);
  if (sites === null) return { clause: "", params: [] };
  if (sites.length === 0) return { clause: " AND 1 = 0", params: [] };
  return {
    clause: ` AND ${tableAlias}.id IN (${sites.map(() => "?").join(",")})`,
    params: sites,
  };
}

function resourceSiteFilterSql(context, column = "site_id") {
  const sites = allowedSiteIds(context);
  if (sites === null) return { clause: "", params: [] };
  if (sites.length === 0) return { clause: " AND 1 = 0", params: [] };
  return {
    clause: ` AND (${column} IS NULL OR ${column} IN (${sites.map(() => "?").join(",")}))`,
    params: sites,
  };
}

async function getSecurityContext(env, request) {
  const identity = getIdentityEmail(request, env);
  const user = await env.DB.prepare(`
    SELECT id, organization_id, email, full_name, status
    FROM users
    WHERE lower(email) = ? AND status = 'active'
    LIMIT 1
  `).bind(identity.email).first();

  if (!user) throw fail("Authenticated user is not provisioned", 403, "user_not_provisioned");

  const roleRows = await env.DB.prepare(`
    SELECT
      user_site_roles.site_id,
      user_site_roles.scope,
      roles.id AS role_id,
      roles.name AS role_name,
      roles.permissions_json
    FROM user_site_roles
    INNER JOIN roles ON roles.id = user_site_roles.role_id
    WHERE user_site_roles.user_id = ?
  `).bind(user.id).all();

  const roles = (roleRows.results || []).map((role) => ({
    ...role,
    permissions: parsePermissions(role.permissions_json),
  }));

  if (roles.length === 0) throw fail("Authenticated user has no assigned roles", 403, "roles_missing");

  return {
    auth_mode: identity.mode,
    user,
    organization_id: user.organization_id,
    roles,
  };
}

async function audit(env, context, request, event) {
  try {
    await env.DB.prepare(`
      INSERT INTO security_audit_events (
        id, organization_id, site_id, actor_user_id, actor_email, action,
        resource_type, resource_id, outcome, user_agent, request_id, metadata_json
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      context?.organization_id || null,
      event.site_id || null,
      context?.user?.id || null,
      context?.user?.email || null,
      event.action,
      event.resource_type,
      event.resource_id || null,
      event.outcome || "success",
      request.headers.get("user-agent") || null,
      event.request_id || null,
      JSON.stringify(event.metadata || {}),
    ).run();
  } catch (error) {
    console.warn("audit event failed", error);
  }
}

function requirePermission(context, resource, action = "read") {
  if (!hasPermission(context, resource, action)) {
    throw fail("Permission denied", 403, "permission_denied");
  }
}

async function jsonBody(request) {
  return await request.json().catch(() => {
    throw fail("Invalid JSON body", 400, "invalid_json");
  });
}

function cleanText(value, fallback = "", max = 500) {
  const text = value === undefined || value === null ? fallback : String(value);
  return text.trim().slice(0, max);
}

function safeStorageSegment(value, fallback = "file") {
  return cleanText(value, fallback, 180)
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim() || fallback;
}

function clampPercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw fail("progress_percent must be a number", 422, "validation_error");
  return Math.max(0, Math.min(100, number));
}

function ensureSiteAllowed(context, siteId) {
  if (!siteId) return;
  const sites = allowedSiteIds(context);
  if (sites !== null && !sites.includes(siteId)) {
    throw fail("Permission denied for site", 403, "permission_denied");
  }
}

async function assertOrgSite(env, context, siteId, required = true) {
  if (!siteId) {
    if (required) throw fail("site_id is required", 422, "validation_error");
    return null;
  }
  ensureSiteAllowed(context, siteId);
  const site = await env.DB.prepare(`
    SELECT id, name
    FROM sites
    WHERE id = ? AND organization_id = ?
    LIMIT 1
  `).bind(siteId, context.organization_id).first();
  if (!site) throw fail("Site not found", 404, "site_not_found");
  return site;
}

async function findOrgUserId(env, context, value) {
  if (!value) return null;
  const user = await env.DB.prepare(`
    SELECT id
    FROM users
    WHERE organization_id = ? AND (id = ? OR lower(email) = lower(?) OR full_name = ?)
    LIMIT 1
  `).bind(context.organization_id, value, value, value).first();
  if (!user) throw fail("Assigned user not found", 404, "user_not_found");
  return user.id;
}

async function putObjectIfProvided(env, storageKey, body) {
  if (!body.content_base64) return { stored: false, storage_key: storageKey };
  if (!env.DOCUMENTS) throw fail("Missing R2 binding DOCUMENTS", 500, "missing_storage_binding");
  const encoded = String(body.content_base64).replace(/^data:[^;]+;base64,/, "");
  if (encoded.length > 14_000_000) throw fail("File payload exceeds API upload limit", 413, "file_too_large");
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  await env.DOCUMENTS.put(storageKey, bytes, {
    httpMetadata: { contentType: body.mime_type || "application/octet-stream" },
    customMetadata: {
      uploaded_via: "sitepulseai-api",
      original_file_name: cleanText(body.file_name, "", 180),
    },
  });
  return { stored: true, storage_key: storageKey, file_size_bytes: bytes.byteLength };
}

async function assertResourceSite(env, context, table, id) {
  const row = await env.DB.prepare(`
    SELECT id, site_id
    FROM ${table}
    WHERE id = ? AND organization_id = ?
    LIMIT 1
  `).bind(id, context.organization_id).first();
  if (!row) throw fail("Resource not found", 404, "resource_not_found");
  ensureSiteAllowed(context, row.site_id);
  return row;
}

async function listSites(env, context) {
  const siteFilter = siteFilterSql(context, "sites");
  const result = await env.DB.prepare(`
    SELECT id, name, location, phase, budget_total, status, updated_at
    FROM sites
    WHERE organization_id = ?${siteFilter.clause}
    ORDER BY name
  `).bind(context.organization_id, ...siteFilter.params).all();
  return result.results || [];
}

async function listSchedule(env, context) {
  const filter = resourceSiteFilterSql(context, "schedule_items.site_id");
  const result = await env.DB.prepare(`
    SELECT
      schedule_items.id,
      sites.name AS site_name,
      schedule_items.wbs_code,
      schedule_items.title,
      schedule_items.description,
      schedule_items.planned_start,
      schedule_items.planned_end,
      schedule_items.progress_percent,
      schedule_items.budget_amount,
      schedule_items.forecast_amount
    FROM schedule_items
    INNER JOIN sites ON sites.id = schedule_items.site_id
    WHERE schedule_items.organization_id = ?${filter.clause}
    ORDER BY sites.name, schedule_items.sort_order, schedule_items.title
  `).bind(context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function listTasks(env, context) {
  const filter = resourceSiteFilterSql(context, "tasks.site_id");
  const result = await env.DB.prepare(`
    SELECT
      tasks.id,
      sites.name AS site_name,
      tasks.title,
      tasks.status,
      tasks.priority,
      tasks.due_at,
      tasks.updated_at
    FROM tasks
    LEFT JOIN sites ON sites.id = tasks.site_id
    WHERE tasks.organization_id = ?${filter.clause}
    ORDER BY tasks.due_at IS NULL, tasks.due_at, tasks.updated_at DESC
  `).bind(context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function listIssues(env, context) {
  const filter = resourceSiteFilterSql(context, "issues.site_id");
  const result = await env.DB.prepare(`
    SELECT
      issues.id,
      sites.name AS site_name,
      issues.title,
      issues.severity,
      issues.status,
      issues.due_at,
      issues.updated_at
    FROM issues
    LEFT JOIN sites ON sites.id = issues.site_id
    WHERE issues.organization_id = ?${filter.clause}
    ORDER BY issues.severity DESC, issues.updated_at DESC
  `).bind(context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function listInspections(env, context) {
  const filter = resourceSiteFilterSql(context, "inspections.site_id");
  const result = await env.DB.prepare(`
    SELECT
      inspections.id,
      sites.name AS site_name,
      inspections.title,
      inspections.phase,
      inspections.status,
      inspections.scheduled_at,
      inspections.completed_at,
      inspections.ai_summary,
      inspections.updated_at
    FROM inspections
    INNER JOIN sites ON sites.id = inspections.site_id
    WHERE inspections.organization_id = ?${filter.clause}
    ORDER BY inspections.scheduled_at DESC, inspections.updated_at DESC
  `).bind(context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function listMedia(env, context) {
  const filter = resourceSiteFilterSql(context, "media_assets.site_id");
  const result = await env.DB.prepare(`
    SELECT
      media_assets.id,
      sites.name AS site_name,
      media_assets.inspection_id,
      media_assets.sync_status,
      media_assets.file_name,
      media_assets.mime_type,
      media_assets.file_size_bytes,
      media_assets.ai_summary,
      media_assets.captured_at,
      media_assets.created_at
    FROM media_assets
    LEFT JOIN sites ON sites.id = media_assets.site_id
    WHERE media_assets.organization_id = ?${filter.clause}
    ORDER BY media_assets.created_at DESC
  `).bind(context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function listDocuments(env, context) {
  const filter = resourceSiteFilterSql(context, "documents.site_id");
  const result = await env.DB.prepare(`
    SELECT
      documents.id,
      sites.name AS site_name,
      documents.title,
      documents.document_type,
      documents.status,
      documents.updated_at
    FROM documents
    LEFT JOIN sites ON sites.id = documents.site_id
    WHERE documents.organization_id = ?${filter.clause}
    ORDER BY documents.updated_at DESC
  `).bind(context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function listDocumentVersions(env, context, documentId) {
  const filter = resourceSiteFilterSql(context, "documents.site_id");
  const result = await env.DB.prepare(`
    SELECT
      document_versions.id,
      document_versions.version_label,
      document_versions.file_name,
      document_versions.mime_type,
      document_versions.file_size_bytes,
      document_versions.created_at
    FROM document_versions
    INNER JOIN documents ON documents.id = document_versions.document_id
    WHERE document_versions.document_id = ?
      AND documents.organization_id = ?${filter.clause}
    ORDER BY document_versions.created_at DESC
  `).bind(documentId, context.organization_id, ...filter.params).all();
  return result.results || [];
}

async function createTask(env, context, request, id) {
  requirePermission(context, "tasks", "write");
  const body = await jsonBody(request);
  await assertOrgSite(env, context, body.site_id, true);
  const assignedTo = await findOrgUserId(env, context, body.assigned_to_user_id || body.assigned_to);
  const taskId = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO tasks (
      id, organization_id, site_id, title, description, status, priority,
      created_by_user_id, assigned_to_user_id, source_type, due_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    taskId,
    context.organization_id,
    body.site_id,
    cleanText(body.title, "", 240),
    cleanText(body.description, "", 2000) || null,
    cleanText(body.status, "open", 40),
    cleanText(body.priority, "medium", 40),
    context.user.id,
    assignedTo,
    cleanText(body.source_type, "web", 80),
    body.due_at || null,
  ).run();
  await audit(env, context, request, {
    action: "task.create",
    resource_type: "task",
    resource_id: taskId,
    site_id: body.site_id,
    request_id: id,
  });
  return { data: { id: taskId, status: "created" } };
}

async function updateTask(env, context, request, taskId, id) {
  requirePermission(context, "tasks", "write");
  const existing = await assertResourceSite(env, context, "tasks", taskId);
  const body = await jsonBody(request);
  const assignedTo = body.assigned_to_user_id || body.assigned_to
    ? await findOrgUserId(env, context, body.assigned_to_user_id || body.assigned_to)
    : undefined;
  const current = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(taskId).first();
  const status = cleanText(body.status, current.status, 40);
  await env.DB.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, status = ?, priority = ?, assigned_to_user_id = ?,
        due_at = ?, started_at = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND organization_id = ?
  `).bind(
    cleanText(body.title, current.title, 240),
    body.description === undefined ? current.description : cleanText(body.description, "", 2000) || null,
    status,
    cleanText(body.priority, current.priority, 40),
    assignedTo === undefined ? current.assigned_to_user_id : assignedTo,
    body.due_at === undefined ? current.due_at : body.due_at,
    body.started_at === undefined ? current.started_at : body.started_at,
    body.completed_at === undefined ? (["closed", "completed", "done"].includes(status) ? new Date().toISOString() : current.completed_at) : body.completed_at,
    taskId,
    context.organization_id,
  ).run();
  await audit(env, context, request, {
    action: "task.update",
    resource_type: "task",
    resource_id: taskId,
    site_id: existing.site_id,
    request_id: id,
    metadata: { status },
  });
  return { data: { id: taskId, status: "updated" } };
}

async function createIssue(env, context, request, id) {
  requirePermission(context, "issues", "write");
  const body = await jsonBody(request);
  await assertOrgSite(env, context, body.site_id, true);
  const assignedTo = await findOrgUserId(env, context, body.assigned_to_user_id || body.assigned_to);
  const issueId = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO issues (
      id, organization_id, site_id, task_id, title, description, severity, status,
      created_by_user_id, assigned_to_user_id, due_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    issueId,
    context.organization_id,
    body.site_id,
    body.task_id || null,
    cleanText(body.title, "", 240),
    cleanText(body.description, "", 2000) || null,
    cleanText(body.severity, "medium", 40),
    cleanText(body.status, "open", 40),
    context.user.id,
    assignedTo,
    body.due_at || null,
  ).run();
  await audit(env, context, request, {
    action: "issue.create",
    resource_type: "issue",
    resource_id: issueId,
    site_id: body.site_id,
    request_id: id,
  });
  return { data: { id: issueId, status: "created" } };
}

async function updateIssue(env, context, request, issueId, id) {
  requirePermission(context, "issues", "write");
  const existing = await assertResourceSite(env, context, "issues", issueId);
  const body = await jsonBody(request);
  const assignedTo = body.assigned_to_user_id || body.assigned_to
    ? await findOrgUserId(env, context, body.assigned_to_user_id || body.assigned_to)
    : undefined;
  const current = await env.DB.prepare("SELECT * FROM issues WHERE id = ?").bind(issueId).first();
  const status = cleanText(body.status, current.status, 40);
  await env.DB.prepare(`
    UPDATE issues
    SET title = ?, description = ?, severity = ?, status = ?, assigned_to_user_id = ?,
        due_at = ?, closed_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND organization_id = ?
  `).bind(
    cleanText(body.title, current.title, 240),
    body.description === undefined ? current.description : cleanText(body.description, "", 2000) || null,
    cleanText(body.severity, current.severity, 40),
    status,
    assignedTo === undefined ? current.assigned_to_user_id : assignedTo,
    body.due_at === undefined ? current.due_at : body.due_at,
    body.closed_at === undefined ? (["closed", "resolved"].includes(status) ? new Date().toISOString() : current.closed_at) : body.closed_at,
    issueId,
    context.organization_id,
  ).run();
  await audit(env, context, request, {
    action: "issue.update",
    resource_type: "issue",
    resource_id: issueId,
    site_id: existing.site_id,
    request_id: id,
    metadata: { status },
  });
  return { data: { id: issueId, status: "updated" } };
}

async function createInspection(env, context, request, id) {
  requirePermission(context, "inspections", "write");
  const body = await jsonBody(request);
  await assertOrgSite(env, context, body.site_id, true);
  const inspectionId = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO inspections (
      id, organization_id, site_id, title, phase, status, scheduled_at,
      created_by_user_id, ai_summary
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    inspectionId,
    context.organization_id,
    body.site_id,
    cleanText(body.title, "", 240),
    cleanText(body.phase, "", 120) || null,
    cleanText(body.status, "draft", 40),
    body.scheduled_at || null,
    context.user.id,
    cleanText(body.ai_summary, "", 2000) || null,
  ).run();
  await audit(env, context, request, {
    action: "inspection.create",
    resource_type: "inspection",
    resource_id: inspectionId,
    site_id: body.site_id,
    request_id: id,
  });
  return { data: { id: inspectionId, status: "created" } };
}

async function updateInspection(env, context, request, inspectionId, id) {
  requirePermission(context, "inspections", "write");
  const existing = await assertResourceSite(env, context, "inspections", inspectionId);
  const body = await jsonBody(request);
  const current = await env.DB.prepare("SELECT * FROM inspections WHERE id = ?").bind(inspectionId).first();
  const status = cleanText(body.status, current.status, 40);
  await env.DB.prepare(`
    UPDATE inspections
    SET title = ?, phase = ?, status = ?, scheduled_at = ?, completed_at = ?,
        ai_summary = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND organization_id = ?
  `).bind(
    cleanText(body.title, current.title, 240),
    body.phase === undefined ? current.phase : cleanText(body.phase, "", 120) || null,
    status,
    body.scheduled_at === undefined ? current.scheduled_at : body.scheduled_at,
    body.completed_at === undefined ? (["closed", "completed", "signed"].includes(status) ? new Date().toISOString() : current.completed_at) : body.completed_at,
    body.ai_summary === undefined ? current.ai_summary : cleanText(body.ai_summary, "", 2000) || null,
    inspectionId,
    context.organization_id,
  ).run();
  await audit(env, context, request, {
    action: "inspection.update",
    resource_type: "inspection",
    resource_id: inspectionId,
    site_id: existing.site_id,
    request_id: id,
    metadata: { status },
  });
  return { data: { id: inspectionId, status: "updated" } };
}

async function updateScheduleItem(env, context, request, scheduleId, id) {
  requirePermission(context, "schedule", "write");
  const existing = await assertResourceSite(env, context, "schedule_items", scheduleId);
  const body = await jsonBody(request);
  const current = await env.DB.prepare("SELECT * FROM schedule_items WHERE id = ?").bind(scheduleId).first();
  const progress = body.progress_percent === undefined ? current.progress_percent : clampPercent(body.progress_percent);
  await env.DB.prepare(`
    UPDATE schedule_items
    SET title = ?, description = ?, planned_start = ?, planned_end = ?, actual_start = ?,
        actual_end = ?, progress_percent = ?, budget_amount = ?, forecast_amount = ?,
        sort_order = ?, updated_by_user_id = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ? AND organization_id = ?
  `).bind(
    cleanText(body.title, current.title, 240),
    body.description === undefined ? current.description : cleanText(body.description, "", 2000) || null,
    body.planned_start === undefined ? current.planned_start : body.planned_start,
    body.planned_end === undefined ? current.planned_end : body.planned_end,
    body.actual_start === undefined ? current.actual_start : body.actual_start,
    body.actual_end === undefined ? current.actual_end : body.actual_end,
    progress,
    body.budget_amount === undefined ? current.budget_amount : Number(body.budget_amount || 0),
    body.forecast_amount === undefined ? current.forecast_amount : Number(body.forecast_amount || 0),
    body.sort_order === undefined ? current.sort_order : Number(body.sort_order || 0),
    context.user.id,
    scheduleId,
    context.organization_id,
  ).run();
  await audit(env, context, request, {
    action: "schedule.update",
    resource_type: "schedule_item",
    resource_id: scheduleId,
    site_id: existing.site_id,
    request_id: id,
    metadata: { progress_percent: progress },
  });
  return { data: { id: scheduleId, status: "updated" } };
}

async function createScheduleItem(env, context, request, id) {
  requirePermission(context, "schedule", "write");
  const body = await jsonBody(request);
  await assertOrgSite(env, context, body.site_id, true);
  const scheduleId = crypto.randomUUID();
  await env.DB.prepare(`
    INSERT INTO schedule_items (
      id, organization_id, site_id, parent_id, wbs_code, title, description,
      planned_start, planned_end, actual_start, actual_end, progress_percent,
      budget_amount, forecast_amount, sort_order, updated_by_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    scheduleId,
    context.organization_id,
    body.site_id,
    body.parent_id || null,
    cleanText(body.wbs_code, "", 40) || null,
    cleanText(body.title, "", 240),
    cleanText(body.description, "", 2000) || null,
    body.planned_start || null,
    body.planned_end || null,
    body.actual_start || null,
    body.actual_end || null,
    body.progress_percent === undefined ? 0 : clampPercent(body.progress_percent),
    Number(body.budget_amount || 0),
    Number(body.forecast_amount || body.budget_amount || 0),
    Number(body.sort_order || 0),
    context.user.id,
  ).run();
  await audit(env, context, request, {
    action: "schedule.create",
    resource_type: "schedule_item",
    resource_id: scheduleId,
    site_id: body.site_id,
    request_id: id,
  });
  return { data: { id: scheduleId, status: "created" } };
}

async function createDocument(env, context, request, id) {
  requirePermission(context, "documents", "upload");
  const body = await jsonBody(request);
  await assertOrgSite(env, context, body.site_id, false);
  const documentId = crypto.randomUUID();
  const versionId = crypto.randomUUID();
  const fileName = cleanText(body.file_name, `${cleanText(body.title, "documento", 80)}.pdf`, 180);
  const storageKey = cleanText(body.storage_key, `documents/${context.organization_id}/${documentId}/${fileName}`, 500);
  const stored = await putObjectIfProvided(env, storageKey, body);
  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO documents (
        id, organization_id, site_id, title, document_type, status, current_version_id, created_by_user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      documentId,
      context.organization_id,
      body.site_id || null,
      cleanText(body.title, "", 240),
      cleanText(body.document_type, "DOC", 40),
      cleanText(body.status, "draft", 40),
      versionId,
      context.user.id,
    ),
    env.DB.prepare(`
      INSERT INTO document_versions (
        id, document_id, version_label, storage_key, file_name, mime_type, file_size_bytes, uploaded_by_user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      versionId,
      documentId,
      cleanText(body.version_label, "v1", 40),
      stored.storage_key,
      fileName,
      cleanText(body.mime_type, "application/octet-stream", 100),
      Number(stored.file_size_bytes || body.file_size_bytes || 0),
      context.user.id,
    ),
    env.DB.prepare(`
      INSERT INTO document_audit_events (id, document_id, version_id, user_id, action, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      documentId,
      versionId,
      context.user.id,
      "document.create",
      cleanText(body.note, "Documento creato da API", 500),
    ),
  ]);
  await audit(env, context, request, {
    action: "document.create",
    resource_type: "document",
    resource_id: documentId,
    site_id: body.site_id || null,
    request_id: id,
    metadata: { stored_in_r2: stored.stored },
  });
  return { data: { id: documentId, version_id: versionId, status: "created", stored_in_r2: stored.stored } };
}

async function createDocumentVersion(env, context, request, documentId, id) {
  requirePermission(context, "documents", "upload");
  const document = await assertResourceSite(env, context, "documents", documentId);
  const body = await jsonBody(request);
  const versionId = crypto.randomUUID();
  const currentCount = await env.DB.prepare(`
    SELECT COUNT(*) AS count
    FROM document_versions
    WHERE document_id = ?
  `).bind(documentId).first();
  const label = cleanText(body.version_label, `v${Number(currentCount?.count || 0) + 1}`, 40);
  const fileName = cleanText(body.file_name, `${documentId}-${label}`, 180);
  const storageKey = cleanText(body.storage_key, `documents/${context.organization_id}/${documentId}/${fileName}`, 500);
  const stored = await putObjectIfProvided(env, storageKey, body);
  await env.DB.batch([
    env.DB.prepare(`
      INSERT INTO document_versions (
        id, document_id, version_label, storage_key, file_name, mime_type, file_size_bytes, uploaded_by_user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      versionId,
      documentId,
      label,
      stored.storage_key,
      fileName,
      cleanText(body.mime_type, "application/octet-stream", 100),
      Number(stored.file_size_bytes || body.file_size_bytes || 0),
      context.user.id,
    ),
    env.DB.prepare(`
      UPDATE documents
      SET current_version_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND organization_id = ?
    `).bind(versionId, cleanText(body.status, "draft", 40), documentId, context.organization_id),
    env.DB.prepare(`
      INSERT INTO document_audit_events (id, document_id, version_id, user_id, action, note)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(),
      documentId,
      versionId,
      context.user.id,
      "document.version.create",
      cleanText(body.note, "Nuova versione caricata da API", 500),
    ),
  ]);
  await audit(env, context, request, {
    action: "document.version.create",
    resource_type: "document",
    resource_id: documentId,
    site_id: document.site_id,
    request_id: id,
    metadata: { version_id: versionId, version_label: label, stored_in_r2: stored.stored },
  });
  return { data: { id: documentId, version_id: versionId, version_label: label, status: "version_created", stored_in_r2: stored.stored } };
}

async function createMediaAsset(env, context, request, id) {
  requirePermission(context, "media", "upload");
  const body = await jsonBody(request);
  await assertOrgSite(env, context, body.site_id, false);
  const mediaId = crypto.randomUUID();
  const fileName = cleanText(body.file_name, "media-file", 180);
  const storageKey = cleanText(body.storage_key, `media/${context.organization_id}/${mediaId}/${fileName}`, 500);
  const stored = await putObjectIfProvided(env, storageKey, body);
  await env.DB.prepare(`
    INSERT INTO media_assets (
      id, organization_id, site_id, message_id, storage_key, file_name, mime_type,
      file_size_bytes, ai_summary, inspection_id, sync_status, device_id, captured_at, captured_by_user_id
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    mediaId,
    context.organization_id,
    body.site_id || null,
    body.message_id || null,
    stored.storage_key,
    fileName,
    cleanText(body.mime_type, "application/octet-stream", 100),
    Number(stored.file_size_bytes || body.file_size_bytes || 0),
    cleanText(body.ai_summary, "", 2000) || null,
    body.inspection_id || null,
    cleanText(body.sync_status, "synced", 40),
    cleanText(body.device_id, "", 120) || null,
    body.captured_at || null,
    context.user.id,
  ).run();
  await audit(env, context, request, {
    action: "media.create",
    resource_type: "media",
    resource_id: mediaId,
    site_id: body.site_id || null,
    request_id: id,
    metadata: { stored_in_r2: stored.stored },
  });
  return { data: { id: mediaId, status: "created", stored_in_r2: stored.stored } };
}

async function uploadMediaAsset(env, context, request, id) {
  requirePermission(context, "media", "upload");
  if (!env.DOCUMENTS) throw fail("Missing R2 binding DOCUMENTS", 500, "missing_storage_binding");

  const form = await request.formData().catch(() => {
    throw fail("Invalid multipart form body", 400, "invalid_multipart");
  });
  const file = form.get("file");
  if (!file || typeof file.stream !== "function") {
    throw fail("file is required", 422, "validation_error");
  }

  const siteId = cleanText(form.get("site_id"), "", 120);
  await assertOrgSite(env, context, siteId, true);

  const maxBytes = Number(env.MAX_MEDIA_UPLOAD_BYTES || 50_000_000);
  if (Number(file.size || 0) > maxBytes) {
    throw fail("File payload exceeds media upload limit", 413, "file_too_large");
  }

  const deviceId = cleanText(form.get("device_id"), "", 120) || null;
  const clientEventId = cleanText(form.get("client_event_id"), "", 120) || null;
  if (deviceId && clientEventId) {
    const existingEvent = await env.DB.prepare(`
      SELECT payload_json
      FROM offline_sync_events
      WHERE organization_id = ? AND device_id = ? AND client_event_id = ?
      LIMIT 1
    `).bind(context.organization_id, deviceId, clientEventId).first();
    if (existingEvent) {
      const existingPayload = parsePermissions(existingEvent.payload_json);
      return {
        data: {
          id: existingPayload.media_id || null,
          status: "already_synced",
          stored_in_r2: true,
          storage_key: existingPayload.storage_key || null,
          file_name: existingPayload.file_name || safeStorageSegment(file.name, "media-file"),
        },
      };
    }
  }

  const mediaId = crypto.randomUUID();
  const fileName = safeStorageSegment(file.name, "media-file");
  const capturedAt = cleanText(form.get("captured_at"), new Date().toISOString(), 80);
  const date = new Date(capturedAt);
  const year = Number.isNaN(date.getTime()) ? "unknown" : String(date.getUTCFullYear());
  const month = Number.isNaN(date.getTime()) ? "unknown" : String(date.getUTCMonth() + 1).padStart(2, "0");
  const storageKey = `media/${context.organization_id}/${siteId}/${year}/${month}/${mediaId}/${fileName}`;
  await env.DOCUMENTS.put(storageKey, file.stream(), {
    httpMetadata: { contentType: file.type || "application/octet-stream" },
    customMetadata: {
      uploaded_via: "sitepulseai-mobile",
      original_file_name: fileName,
      organization_id: context.organization_id,
      site_id: siteId,
      actor_user_id: context.user.id,
      client_event_id: clientEventId || "",
    },
  });

  const statements = [
    env.DB.prepare(`
      INSERT INTO media_assets (
        id, organization_id, site_id, message_id, storage_key, file_name, mime_type,
        file_size_bytes, ai_summary, inspection_id, sync_status, device_id, captured_at, captured_by_user_id
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?, ?)
    `).bind(
      mediaId,
      context.organization_id,
      siteId,
      cleanText(form.get("message_id"), "", 120) || null,
      storageKey,
      fileName,
      file.type || "application/octet-stream",
      Number(file.size || 0),
      cleanText(form.get("ai_summary"), "", 2000) || null,
      cleanText(form.get("inspection_id"), "", 120) || null,
      deviceId,
      capturedAt,
      context.user.id,
    ),
  ];

  if (deviceId && clientEventId) {
    statements.push(
      env.DB.prepare(`
        INSERT OR IGNORE INTO offline_sync_events (
          id, organization_id, site_id, user_id, device_id, client_event_id,
          event_type, payload_json, sync_status, conflict_status, captured_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 'media_upload', ?, 'processed', 'none', ?)
      `).bind(
        crypto.randomUUID(),
        context.organization_id,
        siteId,
        context.user.id,
        deviceId,
        clientEventId,
        JSON.stringify({
          media_id: mediaId,
          file_name: fileName,
          storage_key: storageKey,
          area: cleanText(form.get("area"), "", 240) || null,
          wbs: cleanText(form.get("wbs"), "", 240) || null,
          note: cleanText(form.get("note"), "", 1000) || null,
        }),
        capturedAt,
      ),
    );
  }

  try {
    await env.DB.batch(statements);
  } catch (error) {
    await env.DOCUMENTS.delete(storageKey).catch(() => {});
    throw error;
  }

  await audit(env, context, request, {
    action: "media.upload",
    resource_type: "media",
    resource_id: mediaId,
    site_id: siteId,
    request_id: id,
    metadata: {
      storage_key: storageKey,
      file_name: fileName,
      file_size_bytes: Number(file.size || 0),
      device_id: deviceId,
      client_event_id: clientEventId,
    },
  });

  return {
    data: {
      id: mediaId,
      status: "created",
      stored_in_r2: true,
      storage_key: storageKey,
      file_name: fileName,
      file_size_bytes: Number(file.size || 0),
    },
  };
}

async function createOfflineSyncEvents(env, context, request) {
  requirePermission(context, "offline_sync", "write");
  const payload = await request.json();
  const events = Array.isArray(payload.events) ? payload.events : [];
  if (events.length === 0) throw fail("events must be a non-empty array", 422, "validation_error");
  if (events.length > 100) throw fail("events batch limit exceeded", 413, "batch_too_large");

  const accepted = [];
  for (const event of events) {
    if (!event.device_id || !event.client_event_id || !event.event_type) {
      throw fail("event device_id, client_event_id and event_type are required", 422, "validation_error");
    }

    const siteId = event.site_id || null;
    if (siteId) {
      const siteFilter = allowedSiteIds(context);
      if (siteFilter !== null && !siteFilter.includes(siteId)) {
        throw fail("Permission denied for event site", 403, "permission_denied");
      }
    }

    await env.DB.prepare(`
      INSERT OR IGNORE INTO offline_sync_events (
        id, organization_id, site_id, user_id, device_id, client_event_id,
        event_type, payload_json, sync_status, conflict_status, captured_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)
    `).bind(
      crypto.randomUUID(),
      context.organization_id,
      siteId,
      context.user.id,
      event.device_id,
      event.client_event_id,
      event.event_type,
      JSON.stringify(event.payload || {}),
      event.conflict_status || "none",
      event.captured_at || null,
    ).run();

    accepted.push({
      client_event_id: event.client_event_id,
      status: "received",
    });
  }

  return { accepted };
}

function analysisPermission(type) {
  if (type === "boq_analysis") return { resource: "schedule", action: "write" };
  if (type === "document_classification") return { resource: "documents", action: "write" };
  return { resource: "media", action: "read" };
}

function compactFiles(files = []) {
  return files.slice(0, 20).map((file) => ({
    name: String(file.name || "file").slice(0, 160),
    type: String(file.type || "application/octet-stream").slice(0, 80),
    size: Number(file.size || 0),
  }));
}

function demoAiAnalysis(payload) {
  const files = compactFiles(payload.input?.files || (payload.input?.file ? [payload.input.file] : []));
  if (payload.type === "boq_analysis") {
    return {
      provider: "demo_fallback",
      simulated: true,
      summary: "Fallback demo: computo letto come base per WBS, budget e cronoprogramma.",
      classification: "computo",
      confidence: 0.71,
      suggested_actions: [
        "Validare voci e quantita con PM",
        "Associare le voci alle WBS",
        "Generare baseline e forecast costi",
      ],
      links: [
        { type: "wbs", label: "WBS da validare" },
        { type: "budget", label: "Budget iniziale" },
      ],
      risks: [
        { driver: "quantita", level: "medium", note: "Voci importate da verificare prima della pianificazione." },
      ],
      files,
    };
  }

  return {
    provider: "demo_fallback",
    simulated: true,
    summary: "Fallback demo: media classificati con suggerimenti di collegamento.",
    classification: "media",
    confidence: 0.74,
    suggested_actions: [
      "Confermare cantiere e area",
      "Collegare a sopralluogo, task o documento",
      "Registrare audit della conferma utente",
    ],
    links: [
      { type: "inspection", label: "Sopralluogo probabile" },
      { type: "task", label: "Task o issue collegabile" },
    ],
    risks: [
      { driver: "contesto", level: "low", note: "Serve conferma manuale prima di aggiornare dati operativi." },
    ],
    files,
  };
}

function extractOpenAiText(data) {
  if (typeof data?.output_text === "string") return data.output_text;
  const chunks = [];
  for (const item of data?.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") chunks.push(content.text);
    }
  }
  return chunks.join("\n").trim();
}

async function runOpenAiAnalysis(env, payload) {
  const model = env.OPENAI_MODEL || "gpt-4.1-mini";
  const instruction = [
    "You are SitePulseAI, an AI assistant for construction operations.",
    "Return only valid JSON with keys: summary, classification, confidence, suggested_actions, links, risks.",
    "Do not invent contractual facts. Mark uncertain links as suggestions requiring PM validation.",
  ].join(" ");

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: instruction },
        { role: "user", content: JSON.stringify(payload) },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw fail(`AI provider error: ${detail || response.status}`, 502, "ai_provider_error");
  }

  const data = await response.json();
  const text = extractOpenAiText(data);
  try {
    return {
      provider: "openai",
      simulated: false,
      model,
      ...JSON.parse(text),
    };
  } catch {
    return {
      provider: "openai",
      simulated: false,
      model,
      summary: text || "AI analysis completed, but the provider did not return parseable JSON.",
      classification: payload.type,
      confidence: null,
      suggested_actions: [],
      links: [],
      risks: [],
      raw_output: text,
    };
  }
}

async function analyzeWithAi(env, context, request, id) {
  if (request.method !== "POST") throw fail("Method not allowed", 405, "method_not_allowed");
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") throw fail("Invalid JSON body", 400, "invalid_json");
  if (!payload.type) throw fail("Missing analysis type", 400, "missing_type");

  const permission = analysisPermission(payload.type);
  requirePermission(context, permission.resource, permission.action);

  const safePayload = {
    type: String(payload.type).slice(0, 80),
    input: {
      ...payload.input,
      files: compactFiles(payload.input?.files || []),
      file: payload.input?.file ? compactFiles([payload.input.file])[0] : undefined,
    },
    context: payload.context || {},
  };

  const result = env.OPENAI_API_KEY
    ? await runOpenAiAnalysis(env, safePayload)
    : demoAiAnalysis(safePayload);

  await audit(env, context, request, {
    action: "ai.analyze",
    resource_type: "ai",
    outcome: "success",
    request_id: id,
    metadata: {
      type: safePayload.type,
      provider: result.provider,
      simulated: result.simulated === true,
      model: result.model || null,
    },
  });

  return { data: result };
}

async function route(request, env, context, id) {
  const url = new URL(request.url);

  if (url.pathname === "/api/me") {
    return {
      user: context.user,
      auth_mode: context.auth_mode,
      organization_id: context.organization_id,
      roles: context.roles.map(({ permissions_json, ...role }) => role),
      site_scope: allowedSiteIds(context),
    };
  }

  if (url.pathname === "/api/sites") {
    requirePermission(context, "dashboard", "read");
    return { data: await listSites(env, context) };
  }

  if (url.pathname === "/api/schedule") {
    if (request.method === "POST") return await createScheduleItem(env, context, request, id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "schedule", "read");
    return { data: await listSchedule(env, context) };
  }

  const scheduleMatch = url.pathname.match(/^\/api\/schedule\/([^/]+)$/);
  if (scheduleMatch && request.method === "PUT") {
    return await updateScheduleItem(env, context, request, scheduleMatch[1], id);
  }

  if (url.pathname === "/api/tasks") {
    if (request.method === "POST") return await createTask(env, context, request, id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "tasks", "read");
    return { data: await listTasks(env, context) };
  }

  const taskMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)$/);
  if (taskMatch && request.method === "PUT") {
    return await updateTask(env, context, request, taskMatch[1], id);
  }

  if (url.pathname === "/api/issues") {
    if (request.method === "POST") return await createIssue(env, context, request, id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "issues", "read");
    return { data: await listIssues(env, context) };
  }

  const issueMatch = url.pathname.match(/^\/api\/issues\/([^/]+)$/);
  if (issueMatch && request.method === "PUT") {
    return await updateIssue(env, context, request, issueMatch[1], id);
  }

  if (url.pathname === "/api/inspections") {
    if (request.method === "POST") return await createInspection(env, context, request, id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "inspections", "read");
    return { data: await listInspections(env, context) };
  }

  const inspectionMatch = url.pathname.match(/^\/api\/inspections\/([^/]+)$/);
  if (inspectionMatch && request.method === "PUT") {
    return await updateInspection(env, context, request, inspectionMatch[1], id);
  }

  if (url.pathname === "/api/media/upload" && request.method === "POST") {
    return await uploadMediaAsset(env, context, request, id);
  }

  if (url.pathname === "/api/media") {
    if (request.method === "POST") return await createMediaAsset(env, context, request, id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "media", "read");
    return { data: await listMedia(env, context) };
  }

  if (url.pathname === "/api/documents") {
    if (request.method === "POST") return await createDocument(env, context, request, id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "documents", "read");
    return { data: await listDocuments(env, context) };
  }

  if (url.pathname === "/api/ai/analyze") {
    return await analyzeWithAi(env, context, request, id);
  }

  const versionMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/versions$/);
  if (versionMatch) {
    if (request.method === "POST") return await createDocumentVersion(env, context, request, versionMatch[1], id);
    if (request.method !== "GET") throw fail("Method not allowed", 405, "method_not_allowed");
    requirePermission(context, "documents", "read");
    return { data: await listDocumentVersions(env, context, versionMatch[1]) };
  }

  if (url.pathname === "/api/offline-events" && request.method === "POST") {
    return await createOfflineSyncEvents(env, context, request);
  }

  throw fail("Not found", 404, "not_found");
}

export default {
  async fetch(request, env) {
    const id = requestId(request);
    const cors = securityHeaders(request, env);
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (!env.DB) {
      return json({ error: "Missing D1 binding DB", request_id: id }, 500, cors);
    }

    let context = null;
    try {
      if (url.pathname === "/api/health") {
        const siteCount = await env.DB.prepare("SELECT COUNT(*) AS count FROM sites").first();
        return json({
          ok: true,
          service: "sitepulseai-api",
          database: "sitepulseai-db",
          sites: siteCount?.count || 0,
          request_id: id,
        }, 200, cors);
      }

      if (!PUBLIC_ROUTES.has(url.pathname)) {
        context = await getSecurityContext(env, request);
      }

      const payload = await route(request, env, context, id);
      await audit(env, context, request, {
        action: `${request.method} ${url.pathname}`,
        resource_type: "api_route",
        outcome: "success",
        request_id: id,
      });
      return json({ ...payload, request_id: id }, 200, cors);
    } catch (error) {
      await audit(env, context, request, {
        action: `${request.method} ${url.pathname}`,
        resource_type: "api_route",
        outcome: "failure",
        request_id: id,
        metadata: { code: error.code || "worker_error", status: error.status || 500 },
      });
      return json({
        error: error.code || "worker_error",
        message: error.status && error.status < 500 ? error.message : "Request failed",
        request_id: id,
      }, error.status || 500, cors);
    }
  },
};
