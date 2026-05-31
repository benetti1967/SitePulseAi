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
```

## Worker bindings

Create a Worker named `sitepulseai-api` and bind:

- D1 binding name: `DB`
- D1 database: `sitepulseai-db`
- R2 binding name: `DOCUMENTS`
- R2 bucket: `sitepulseai-documents`
- Variable: `ALLOWED_ORIGIN=https://sitepulseai.pages.dev`

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
GET /api/tasks
GET /api/issues
GET /api/inspections
GET /api/media
GET /api/documents
GET /api/documents/:documentId/versions
POST /api/offline-events
```

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
