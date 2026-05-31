INSERT OR IGNORE INTO organizations (id, name, slug)
VALUES ('org_urbanbuild', 'UrbanBuild Group', 'urbanbuild');

INSERT OR IGNORE INTO roles (id, organization_id, name, permissions_json)
VALUES
  ('role_admin', 'org_urbanbuild', 'Administrator', '{"all":true}'),
  ('role_pm', 'org_urbanbuild', 'Project Manager', '{"schedule":"write","budget":"read","documents":"approve"}'),
  ('role_site_manager', 'org_urbanbuild', 'Site Manager', '{"tasks":"write","issues":"write","schedule":"write"}'),
  ('role_supplier', 'org_urbanbuild', 'Supplier', '{"documents":"upload","tasks":"read"}'),
  ('role_consultant', 'org_urbanbuild', 'Consultant', '{"documents":"read","inspections":"write","issues":"comment"}'),
  ('role_developer', 'org_urbanbuild', 'Developer', '{"dashboard":"portfolio","reports":"read","budget":"read"}');

INSERT OR IGNORE INTO users (id, organization_id, email, full_name)
VALUES
  ('user_admin', 'org_urbanbuild', 'admin@example.com', 'Admin SitePulseAi'),
  ('user_luca', 'org_urbanbuild', 'luca@example.com', 'Luca Ferri'),
  ('user_anna', 'org_urbanbuild', 'anna@example.com', 'Anna Sarti'),
  ('user_marco', 'org_urbanbuild', 'marco@example.com', 'Marco Riva'),
  ('user_sara', 'org_urbanbuild', 'sara@example.com', 'Sara Monti'),
  ('user_termo', 'org_urbanbuild', 'termocasa@example.com', 'TermoCasa Supplier'),
  ('user_dev', 'org_urbanbuild', 'developer@example.com', 'Real Estate Developer');

INSERT OR IGNORE INTO sites (id, organization_id, name, location, phase, budget_total, status)
VALUES
  ('site_porta_nuova', 'org_urbanbuild', 'Residenza Porta Nuova', 'Milano', 'Esecuzione impianti', 4800000, 'active'),
  ('site_lambrate', 'org_urbanbuild', 'Green Offices Lambrate', 'Milano', 'Strutture e facciate', 6200000, 'active'),
  ('site_aurora', 'org_urbanbuild', 'Hotel Aurora Renovation', 'Roma', 'Finiture e collaudi', 3900000, 'active'),
  ('site_nord_hub', 'org_urbanbuild', 'Logistica Nord Hub', 'Monza', 'Avvio cantiere', 3800000, 'active');

INSERT OR IGNORE INTO user_site_roles (id, user_id, site_id, role_id, scope)
VALUES
  ('usr_admin_org', 'user_admin', NULL, 'role_admin', 'organization'),
  ('usr_anna_porta', 'user_anna', 'site_porta_nuova', 'role_pm', 'site'),
  ('usr_anna_lambrate', 'user_anna', 'site_lambrate', 'role_pm', 'site'),
  ('usr_luca_porta', 'user_luca', 'site_porta_nuova', 'role_site_manager', 'site'),
  ('usr_luca_hub', 'user_luca', 'site_nord_hub', 'role_site_manager', 'site'),
  ('usr_marco_porta', 'user_marco', 'site_porta_nuova', 'role_site_manager', 'site'),
  ('usr_sara_lambrate', 'user_sara', 'site_lambrate', 'role_consultant', 'site'),
  ('usr_termo_porta', 'user_termo', 'site_porta_nuova', 'role_supplier', 'site'),
  ('usr_dev_org', 'user_dev', NULL, 'role_developer', 'organization');

INSERT OR IGNORE INTO schedule_items (
  id, organization_id, site_id, wbs_code, title, description,
  planned_start, planned_end, progress_percent, budget_amount, forecast_amount, sort_order
)
VALUES
  ('sch_iso_b', 'org_urbanbuild', 'site_porta_nuova', '1.2.1', 'Posa isolamento Blocco B', 'Fornitore TermoCasa', '2026-05-26', '2026-06-04', 40, 15960, 17160, 10),
  ('sch_elec_p2', 'org_urbanbuild', 'site_porta_nuova', '1.3.2', 'Impianto elettrico piano 2', 'Variante in revisione', '2026-05-28', '2026-06-12', 22, 42400, 49200, 20),
  ('sch_drywall', 'org_urbanbuild', 'site_lambrate', '2.1.4', 'Chiusura cartongessi', 'Dipende da isolamento', '2026-06-05', '2026-06-14', 0, 31200, 31200, 30),
  ('sch_facade', 'org_urbanbuild', 'site_aurora', '3.4.1', 'Facciata nord', 'Avanzamento da foto mobile', '2026-05-20', '2026-06-18', 72, 86000, 86000, 40);

INSERT OR IGNORE INTO tasks (
  id, organization_id, site_id, title, description, status, priority,
  created_by_user_id, assigned_to_user_id, source_type, due_at
)
VALUES
  ('task_iso_check', 'org_urbanbuild', 'site_porta_nuova', 'Verifica isolamento mancante', 'Issue creata da foto e vocale mobile.', 'open', 'high', 'user_luca', 'user_anna', 'mobile_chat', '2026-06-01'),
  ('task_report_sign', 'org_urbanbuild', 'site_porta_nuova', 'Firmare report sopralluogo', 'Una firma mancante dal fornitore.', 'open', 'medium', 'user_luca', 'user_luca', 'inspection', '2026-06-02');

INSERT OR IGNORE INTO issues (
  id, organization_id, site_id, task_id, title, description, severity, status,
  created_by_user_id, assigned_to_user_id, due_at
)
VALUES
  ('issue_iso_b', 'org_urbanbuild', 'site_porta_nuova', 'task_iso_check', 'Isolamento mancante Blocco B', 'Materiale mancante rilevato da foto mobile.', 'high', 'open', 'user_luca', 'user_anna', '2026-06-01');

INSERT OR IGNORE INTO inspections (
  id, organization_id, site_id, title, phase, status, scheduled_at, completed_at,
  created_by_user_id, ai_summary
)
VALUES
  ('insp_porta_iso', 'org_urbanbuild', 'site_porta_nuova', 'Isolamento Blocco B piano 2', 'Esecuzione impianti', 'open', '2026-05-31T09:00:00Z', NULL, 'user_luca', 'Foto e vocali indicano isolamento incompleto e possibile impatto cartongessi.'),
  ('insp_lambrate_facade', 'org_urbanbuild', 'site_lambrate', 'Facciata sud e ponteggi', 'Strutture e facciate', 'open', '2026-06-01T08:30:00Z', NULL, 'user_sara', 'Ritardo potenziale su pannelli e accessi ponteggio.'),
  ('insp_aurora_finishes', 'org_urbanbuild', 'site_aurora', 'Finiture lobby e camere campione', 'Finiture e collaudi', 'closed', '2026-05-28T14:00:00Z', '2026-05-28T16:10:00Z', 'user_anna', 'Tre decisioni registrate e due task generati per fornitore arredi.'),
  ('insp_hub_start', 'org_urbanbuild', 'site_nord_hub', 'Avvio cantiere e aree logistiche', 'Avvio cantiere', 'open', '2026-06-03T10:00:00Z', NULL, 'user_luca', 'Aree ingresso nord e deposito materiali da classificare su planimetria.');

INSERT OR IGNORE INTO documents (
  id, organization_id, site_id, title, document_type, status, created_by_user_id
)
VALUES
  ('doc_var_imp', 'org_urbanbuild', 'site_porta_nuova', 'Variante impianti', 'PDF', 'in_review', 'user_anna'),
  ('doc_sal_may', 'org_urbanbuild', 'site_lambrate', 'SAL Maggio', 'SAL', 'in_review', 'user_luca');

INSERT OR IGNORE INTO media_assets (
  id, organization_id, site_id, message_id, storage_key, file_name, mime_type,
  file_size_bytes, ai_summary
)
VALUES
  ('media_porta_01', 'org_urbanbuild', 'site_porta_nuova', NULL, 'media/site_porta_nuova/isolamento-blocco-b-01.jpg', 'isolamento-blocco-b-01.jpg', 'image/jpeg', 1843200, 'Foto collegata a sopralluogo isolamento Blocco B.'),
  ('media_porta_02', 'org_urbanbuild', 'site_porta_nuova', NULL, 'media/site_porta_nuova/quadro-elettrico-p2.jpg', 'quadro-elettrico-p2.jpg', 'image/jpeg', 1520100, 'Foto probabile variante impianti piano 2.'),
  ('media_lambrate_01', 'org_urbanbuild', 'site_lambrate', NULL, 'media/site_lambrate/facciata-sud-01.jpg', 'facciata-sud-01.jpg', 'image/jpeg', 2011200, 'Avanzamento facciata sud, possibile ritardo pannelli.'),
  ('media_lambrate_02', 'org_urbanbuild', 'site_lambrate', NULL, 'media/site_lambrate/ponteggio-est.jpg', 'ponteggio-est.jpg', 'image/jpeg', 1765400, 'Verifica ponteggio est e accessi di sicurezza.'),
  ('media_aurora_01', 'org_urbanbuild', 'site_aurora', NULL, 'media/site_aurora/lobby-finiture-01.jpg', 'lobby-finiture-01.jpg', 'image/jpeg', 1684500, 'Finiture lobby collegate al sopralluogo camere campione.'),
  ('media_aurora_02', 'org_urbanbuild', 'site_aurora', NULL, 'media/site_aurora/facciata-nord-video-thumb.jpg', 'facciata-nord-video-thumb.jpg', 'image/jpeg', 1412200, 'Thumbnail video facciata nord e stato avanzamento.'),
  ('media_hub_01', 'org_urbanbuild', 'site_nord_hub', NULL, 'media/site_nord_hub/ingresso-nord-01.jpg', 'ingresso-nord-01.jpg', 'image/jpeg', 1933000, 'Area logistica ingresso nord da collegare a sopralluogo avvio.'),
  ('media_hub_02', 'org_urbanbuild', 'site_nord_hub', NULL, 'media/site_nord_hub/deposito-materiali.jpg', 'deposito-materiali.jpg', 'image/jpeg', 1889000, 'Deposito materiali e area mezzi in allestimento.'),
  ('media_free_01', 'org_urbanbuild', NULL, NULL, 'media/unassigned/ddt-pannelli-01.jpg', 'ddt-pannelli-01.jpg', 'image/jpeg', 920100, 'Upload libero: AI propone collegamento a DDT pannelli isolanti.'),
  ('media_free_02', 'org_urbanbuild', NULL, NULL, 'media/unassigned/foto-generica-cantiere.jpg', 'foto-generica-cantiere.jpg', 'image/jpeg', 1320500, 'Upload libero: cantiere e sopralluogo da confermare.');
