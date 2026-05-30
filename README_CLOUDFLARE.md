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
GET /api/sites
GET /api/schedule
GET /api/tasks
GET /api/issues
GET /api/documents
GET /api/documents/:documentId/versions
```
