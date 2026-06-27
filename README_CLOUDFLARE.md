# SitePulseAi Cloudflare Phase 2

## Resources

- Pages project: `sitepulseai`
- D1 database: `sitepulseai-db`
- R2 bucket: `sitepulseai-documents`
- Worker API name: `sitepulseai-api`

## Wrangler configs

The project uses two Wrangler configurations:

- `wrangler.jsonc`: frontend static PWA deploy from `dist/`;
- local `wrangler.toml`: backend API Worker with D1 and R2 bindings.

Create the local backend config from the tracked example:

```powershell
Copy-Item -Path wrangler.toml.example -Destination wrangler.toml -Force
```

`wrangler.toml` is intentionally ignored by Git because it contains environment-specific IDs.

## Cloudflare resources

Create the D1 database and R2 bucket if they do not already exist:

```powershell
npx wrangler d1 create sitepulseai-db
npx wrangler r2 bucket create sitepulseai-documents
```

Copy the returned D1 `database_id` into local `wrangler.toml`.

## D1 setup

Run `schema.sql` in the D1 console first.

Optional demo data:

```sql
-- Paste and execute seed.sql in the D1 console after schema.sql.
```

For an existing Phase 2 database, run migrations in order:

```text
migrations/0002_security_offline_backend.sql
migrations/0003_finish_security_offline_backend.sql
migrations/0003_operational_write_permissions.sql
```

Equivalent Wrangler commands:

```powershell
npx wrangler d1 execute sitepulseai-db --file=schema.sql
npx wrangler d1 execute sitepulseai-db --file=migrations/0002_security_offline_backend.sql
npx wrangler d1 execute sitepulseai-db --file=migrations/0003_finish_security_offline_backend.sql
npx wrangler d1 execute sitepulseai-db --file=migrations/0003_operational_write_permissions.sql
npx wrangler d1 execute sitepulseai-db --file=migrations/0004_mobile_upload_and_sync_permissions.sql
npx wrangler d1 execute sitepulseai-db --file=migrations/0005_cloudflare_access_users.sql
npx wrangler d1 execute sitepulseai-db --file=seed.sql
```

## Worker bindings

Create a Worker named `sitepulseai-api` and bind:

- D1 binding name: `DB`
- D1 database: `sitepulseai-db`
- R2 binding name: `DOCUMENTS`
- R2 bucket: `sitepulseai-documents`
- Variable: `ALLOWED_ORIGIN=https://sitepulseai.pages.dev`
- Variable: `REQUIRE_ACCESS_AUTH=true`
- Variable: `MAX_MEDIA_UPLOAD_BYTES=50000000`
- Variable: `AI_PROVIDER=openai`
- Variable: `OPENAI_MODEL=gpt-4.1-mini`
- Secret: `OPENAI_API_KEY`

Set the AI secret with:

```powershell
npx wrangler secret put OPENAI_API_KEY
```

If `OPENAI_API_KEY` is not configured, `/api/ai/analyze` returns a clearly marked `demo_fallback` response. This keeps the UI testable but avoids presenting simulated analysis as production AI.

## Frontend API base

The frontend reads the API URL from:

1. `window.SITEPULSE_CONFIG.apiBase` in `index.html`;
2. `localStorage.sitepulse_api_base`;
3. fallback `https://sitepulseai-api.benetti1967.workers.dev`.

For production, change the value in `index.html` or serve a custom domain for the API Worker and set it there.

## Build and deploy

```powershell
npm.cmd run build
npx wrangler deploy --config wrangler.toml
npx wrangler deploy --config wrangler.jsonc
```

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
POST /api/media/upload
GET /api/documents
GET /api/documents/:documentId/versions
POST /api/documents
POST /api/documents/:documentId/versions
POST /api/offline-events
POST /api/ai/analyze
```

Document and media upload endpoints accept either metadata-only payloads or an optional `content_base64` field. When `content_base64` is present, the Worker writes the object to the `DOCUMENTS` R2 bucket and records the D1 metadata/version/audit rows.

`POST /api/media/upload` is the preferred mobile endpoint. It accepts
`multipart/form-data` with `file`, `site_id`, `area`, `wbs`, `note`,
`captured_at`, `device_id` and `client_event_id`. The binary is streamed to R2,
the metadata is written to D1 and the same client event is recorded for audit.
The pair `device_id` + `client_event_id` makes retries idempotent.

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

The Worker rejects unauthenticated private requests by default. For a strictly
local `wrangler dev` session only, use:

```toml
ALLOWED_ORIGIN = "http://127.0.0.1:3000"
REQUIRE_ACCESS_AUTH = "false"
ALLOW_DEMO_AUTH = "true"
LOCAL_DEMO_USER_EMAIL = "pm.demo@sitepulseai.com"
```

Do not deploy those development values to production.
