UPDATE roles
SET permissions_json = '{"dashboard":"read","schedule":"write","budget":"read","documents":"approve","media":"upload","inspections":"write","offline_sync":"read","tasks":"write","issues":"write"}'
WHERE id = 'role_pm';

UPDATE roles
SET permissions_json = '{"dashboard":"read","tasks":"write","issues":"write","schedule":"write","documents":"read","media":"upload","inspections":"write","offline_sync":"write"}'
WHERE id = 'role_site_manager';
