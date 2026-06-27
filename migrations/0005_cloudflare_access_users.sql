INSERT OR IGNORE INTO users (id, organization_id, email, full_name, status)
VALUES ('user_benetti1967', 'org_urbanbuild', 'benetti1967@gmail.com', 'Amministratore SitePulseAi', 'active');

INSERT OR IGNORE INTO user_site_roles (id, user_id, site_id, role_id, scope)
VALUES ('usr_benetti1967_org', 'user_benetti1967', NULL, 'role_admin', 'organization');
