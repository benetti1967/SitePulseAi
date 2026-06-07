# SitePulseAi Cloudflare Phase 2

## Resources

- Pages project: `sitepulseai`
- D1 database: `sitepulseai-db`
- R2 bucket: `sitepulseai-documents`
- Worker API name: `sitepulseai-api`

## D1 setup

Run `schema.sql` in the D1 console first.

Optional demo data:

```sql
-- Paste and execute seed.sql in the D1 console after schema.sql.
```

For an existing Phase 2 database, run migrations in order:

```text
migrations/0002_security_offline_backend.sql
migrations/0003_operational_write_permissions.sql
```

## Worker bindings

Create a Worker named `sitepulseai-api` and bind:

- D1 binding name: `DB`
- D1 database: `sitepulseai-db`
- R2 binding name: `DOCUMENTS`
- R2 bucket: `sitepulseai-documents`
- Variable: `ALLOWED_ORIGIN=https://sitepulseai.pages.dev`
- Variable: `AI_PROVIDER=openai`
- Variable: `OPENAI_MODEL=gpt-4.1-mini`
- Secret: `OPENAI_API_KEY`

Set the AI secret with:

```powershell
npx wrangler secret put OPENAI_API_KEY
```

If `OPENAI_API_KEY` is not configured, `/api/ai/analyze` returns a clearly marked `demo_fallback` response. This keeps the UI testable but avoids presenting simulated analysis as production AI.

The Worker entrypoint is:

```text
worker/src/index.js
```

Initial API endpoints:

```text
GET /api/health
GET /api/me
GET /api/sites
GET /api/schedule
POST /api/schedule
PUT /api/schedule/:scheduleItemId
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:taskId
GET /api/issues
POST /api/issues
PUT /api/issues/:issueId
GET /api/inspections
POST /api/inspections
PUT /api/inspections/:inspectionId
GET /api/media
POST /api/media
GET /api/documents
GET /api/documents/:documentId/versions
POST /api/documents
POST /api/documents/:documentId/versions
POST /api/offline-events
POST /api/ai/analyze
```

Document and media upload endpoints accept either metadata-only payloads or an optional `content_base64` field. When `content_base64` is present, the Worker writes the object to the `DOCUMENTS` R2 bucket and records the D1 metadata/version/audit rows.

## Offline/PWA runtime

The web app now ships with:

- `manifest.json` for installable PWA behavior;
- `service-worker.js` for app-shell caching and network-first API caching;
- IndexedDB stores:
  - `apiCache` for the latest successful GET payloads;
  - `outbox` for POST/PUT operations created while offline;
- automatic outbox replay on `online` and Background Sync when supported by the browser.

Current offline-enabled flows:

- media metadata upload via `POST /api/media`;
- imported BoQ/WBS creation via `POST /api/schedule`;
- any future `fetchApiData` POST/PUT call, except `/api/ai/analyze`, is queued when the network is unavailable.

## Security model

The Worker enforces authorization server-side on every private endpoint:

- user identity from Cloudflare Access headers;
- local/demo fallback only for development;
- `organization_id` filtering on every query;
- site-level filtering from `user_site_roles`;
- role permissions from `roles.permissions_json`;
- generic `security_audit_events` audit trail for API access;
- no raw stack traces in API responses.

For production, protect the Worker with Cloudflare Access and disable demo auth by leaving `ALLOW_DEMO_AUTH` unset.
