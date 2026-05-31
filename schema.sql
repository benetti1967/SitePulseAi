PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_by_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (organization_id, email),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  permissions_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (organization_id, name),
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS sites (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  name TEXT NOT NULL,
  location TEXT,
  phase TEXT,
  budget_total REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS user_site_roles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  site_id TEXT,
  role_id TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'site',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, site_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  priority TEXT NOT NULL DEFAULT 'medium',
  created_by_user_id TEXT,
  assigned_to_user_id TEXT,
  source_type TEXT,
  due_at TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  task_id TEXT,
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  created_by_user_id TEXT,
  assigned_to_user_id TEXT,
  due_at TEXT,
  closed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (task_id) REFERENCES tasks(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id),
  FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS inspections (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  title TEXT NOT NULL,
  phase TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  scheduled_at TEXT,
  completed_at TEXT,
  created_by_user_id TEXT,
  ai_summary TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  title TEXT NOT NULL,
  document_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  current_version_id TEXT,
  created_by_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (created_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS document_versions (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  version_label TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size_bytes INTEGER,
  uploaded_by_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (document_id, version_label),
  FOREIGN KEY (document_id) REFERENCES documents(id),
  FOREIGN KEY (uploaded_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS document_audit_events (
  id TEXT PRIMARY KEY,
  document_id TEXT NOT NULL,
  version_id TEXT,
  user_id TEXT,
  action TEXT NOT NULL,
  note TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id),
  FOREIGN KEY (version_id) REFERENCES document_versions(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  parent_id TEXT,
  wbs_code TEXT,
  title TEXT NOT NULL,
  description TEXT,
  planned_start TEXT,
  planned_end TEXT,
  actual_start TEXT,
  actual_end TEXT,
  progress_percent REAL NOT NULL DEFAULT 0,
  budget_amount REAL NOT NULL DEFAULT 0,
  forecast_amount REAL NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_by_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (parent_id) REFERENCES schedule_items(id),
  FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS budget_items (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT NOT NULL,
  schedule_item_id TEXT,
  cost_code TEXT,
  description TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  unit TEXT,
  unit_price REAL NOT NULL DEFAULT 0,
  budget_amount REAL NOT NULL DEFAULT 0,
  committed_amount REAL NOT NULL DEFAULT 0,
  actual_amount REAL NOT NULL DEFAULT 0,
  forecast_amount REAL NOT NULL DEFAULT 0,
  source_document_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (schedule_item_id) REFERENCES schedule_items(id),
  FOREIGN KEY (source_document_id) REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  channel_name TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'mobile',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  user_id TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  body TEXT,
  ai_classification_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  message_id TEXT,
  storage_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size_bytes INTEGER,
  ai_summary TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id),
  FOREIGN KEY (message_id) REFERENCES messages(id)
);

CREATE TABLE IF NOT EXISTS ai_events (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL,
  site_id TEXT,
  source_type TEXT NOT NULL,
  source_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  confidence REAL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organization_id) REFERENCES organizations(id),
  FOREIGN KEY (site_id) REFERENCES sites(id)
);

CREATE INDEX IF NOT EXISTS idx_sites_org ON sites(organization_id);
CREATE INDEX IF NOT EXISTS idx_tasks_site_status ON tasks(site_id, status);
CREATE INDEX IF NOT EXISTS idx_issues_site_status ON issues(site_id, status);
CREATE INDEX IF NOT EXISTS idx_inspections_site_status ON inspections(site_id, status);
CREATE INDEX IF NOT EXISTS idx_documents_site_status ON documents(site_id, status);
CREATE INDEX IF NOT EXISTS idx_document_versions_document ON document_versions(document_id);
CREATE INDEX IF NOT EXISTS idx_document_audit_document ON document_audit_events(document_id);
CREATE INDEX IF NOT EXISTS idx_schedule_site_parent ON schedule_items(site_id, parent_id);
CREATE INDEX IF NOT EXISTS idx_budget_site ON budget_items(site_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_site ON media_assets(site_id);
CREATE INDEX IF NOT EXISTS idx_ai_events_source ON ai_events(source_type, source_id);
