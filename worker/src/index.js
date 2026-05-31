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

function corsHeaders(origin, allowedOrigin) {
  const allowOrigin = allowedOrigin || origin || "*";
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,PUT,OPTIONS",
    "access-control-allow-headers": [
      "content-type",
      "cf-access-jwt-assertion",
      "cf-access-authenticated-user-email",
      "x-sitepulse-demo-user",
      "x-request-id",
    ].join(","),
  };
}

function securityHeaders(request, env) {
  return corsHeaders(request.headers.get("origin"), env.ALLOWED_ORIGIN);
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

  // Local development fallback. Production should be protected by Cloudflare Access.
  return { email: (env.LOCAL_DEMO_USER_EMAIL || "admin@example.com").toLowerCase(), mode: "local_demo" };
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
    requirePermission(context, "schedule", "read");
    return { data: await listSchedule(env, context) };
  }

  if (url.pathname === "/api/tasks") {
    requirePermission(context, "tasks", "read");
    return { data: await listTasks(env, context) };
  }

  if (url.pathname === "/api/issues") {
    requirePermission(context, "issues", "read");
    return { data: await listIssues(env, context) };
  }

  if (url.pathname === "/api/inspections") {
    requirePermission(context, "inspections", "read");
    return { data: await listInspections(env, context) };
  }

  if (url.pathname === "/api/media") {
    requirePermission(context, "media", "read");
    return { data: await listMedia(env, context) };
  }

  if (url.pathname === "/api/documents") {
    requirePermission(context, "documents", "read");
    return { data: await listDocuments(env, context) };
  }

  const versionMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/versions$/);
  if (versionMatch) {
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
