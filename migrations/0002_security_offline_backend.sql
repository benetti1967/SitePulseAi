CREATE TABLE IF NOT EXISTS security_audit_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT,
  site_id TEXT,
  actor_user_id TEXT,
  actor_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  outcome TEXT NOT NULL DEFAULT 'success',
  ip_hash TEXT,
  user_agent TEXT,
  request_id TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (actor_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS offline_sync_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  user_id TEXT,
  device_id TEXT NOT NULL,
  client_event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  sync_status TEXT NOT NULL DEFAULT 'received',
  conflict_status TEXT NOT NULL DEFAULT 'none',
  captured_at TEXT,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (device_id, client_event_id),
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

ALTER TABLE media_assets ADD COLUMN inspection_id TEXT;
ALTER TABLE media_assets ADD COLUMN sync_status TEXT NOT NULL DEFAULT 'synced';
ALTER TABLE media_assets ADD COLUMN device_id TEXT;
ALTER TABLE media_assets ADD COLUMN captured_at TEXT;
ALTER TABLE media_assets ADD COLUMN captured_by_user_id TEXT;

CREATE INDEX IF NOT EXISTS idx_security_audit_org_actor ON security_audit_events(organization_id, actor_user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_media_assets_inspection ON media_assets(inspection_id);
CREATE INDEX IF NOT EXISTS idx_offline_sync_device ON offline_sync_events(device_id, received_at);

UPDATE roles
SET permissions_json = '{"dashboard":"read","schedule":"write","budget":"read","documents":"approve","media":"read","inspections":"write","offline_sync":"read","tasks":"write","issues":"write"}'
WHERE id = 'role_pm';

UPDATE roles
SET permissions_json = '{"dashboard":"read","tasks":"write","issues":"write","schedule":"write","documents":"read","media":"read","inspections":"write","offline_sync":"write"}'
WHERE id = 'role_site_manager';

UPDATE roles
SET permissions_json = '{"documents":"upload","media":"upload","tasks":"read","inspections":"comment","offline_sync":"write"}'
WHERE id = 'role_supplier';

UPDATE roles
SET permissions_json = '{"dashboard":"read","documents":"read","media":"read","inspections":"write","issues":"comment","offline_sync":"write"}'
WHERE id = 'role_consultant';

UPDATE roles
SET permissions_json = '{"dashboard":"read","reports":"read","budget":"read","documents":"read","media":"read","inspections":"read"}'
WHERE id = 'role_developer';
