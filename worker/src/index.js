const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

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
    "access-control-allow-headers": "content-type,cf-access-jwt-assertion",
  };
}

function getActor(request) {
  return {
    email: request.headers.get("cf-access-authenticated-user-email") || "local-demo@sitepulseai",
    name: request.headers.get("cf-access-authenticated-user-email") || "Local demo user",
  };
}

async function listSites(env) {
  const result = await env.DB.prepare(`
    SELECT id, name, location, phase, budget_total, status, updated_at
    FROM sites
    ORDER BY name
  `).all();
  return result.results || [];
}

async function listSchedule(env) {
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
    ORDER BY sites.name, schedule_items.sort_order, schedule_items.title
  `).all();
  return result.results || [];
}

async function listTasks(env) {
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
    ORDER BY tasks.due_at IS NULL, tasks.due_at, tasks.updated_at DESC
  `).all();
  return result.results || [];
}

async function listIssues(env) {
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
    ORDER BY issues.severity DESC, issues.updated_at DESC
  `).all();
  return result.results || [];
}

async function listDocuments(env) {
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
    ORDER BY documents.updated_at DESC
  `).all();
  return result.results || [];
}

async function listDocumentVersions(env, documentId) {
  const result = await env.DB.prepare(`
    SELECT
      document_versions.id,
      document_versions.version_label,
      document_versions.file_name,
      document_versions.mime_type,
      document_versions.file_size_bytes,
      document_versions.created_at
    FROM document_versions
    WHERE document_versions.document_id = ?
    ORDER BY document_versions.created_at DESC
  `).bind(documentId).all();
  return result.results || [];
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("origin");
    const cors = corsHeaders(origin, env.ALLOWED_ORIGIN);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    if (!env.DB) {
      return json({ error: "Missing D1 binding DB" }, 500, cors);
    }

    try {
      if (url.pathname === "/api/health") {
        const siteCount = await env.DB.prepare("SELECT COUNT(*) AS count FROM sites").first();
        return json({
          ok: true,
          service: "sitepulseai-api",
          actor: getActor(request),
          database: "sitepulseai-db",
          sites: siteCount?.count || 0,
        }, 200, cors);
      }

      if (url.pathname === "/api/sites") {
        return json({ data: await listSites(env) }, 200, cors);
      }

      if (url.pathname === "/api/schedule") {
        return json({ data: await listSchedule(env) }, 200, cors);
      }

      if (url.pathname === "/api/tasks") {
        return json({ data: await listTasks(env) }, 200, cors);
      }

      if (url.pathname === "/api/issues") {
        return json({ data: await listIssues(env) }, 200, cors);
      }

      if (url.pathname === "/api/documents") {
        return json({ data: await listDocuments(env) }, 200, cors);
      }

      const versionMatch = url.pathname.match(/^\/api\/documents\/([^/]+)\/versions$/);
      if (versionMatch) {
        return json({ data: await listDocumentVersions(env, versionMatch[1]) }, 200, cors);
      }

      return json({ error: "Not found" }, 404, cors);
    } catch (error) {
      return json({ error: "Worker error", message: error.message }, 500, cors);
    }
  },
};
