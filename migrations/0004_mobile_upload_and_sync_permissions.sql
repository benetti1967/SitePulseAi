UPDATE roles
SET permissions_json = '{"dashboard":"read","schedule":"write","budget":"read","documents":"approve","media":"upload","inspections":"write","offline_sync":"write","tasks":"write","issues":"write"}'
WHERE id = 'role_pm';

INSERT OR IGNORE INTO users (id, organization_id, email, full_name, status)
VALUES ('user_pm_demo', 'org_urbanbuild', 'pm.demo@sitepulseai.com', 'Paola Manager', 'active');

INSERT OR IGNORE INTO user_site_roles (id, user_id, site_id, role_id, scope)
VALUES ('usr_pm_demo_org', 'user_pm_demo', NULL, 'role_pm', 'organization');
