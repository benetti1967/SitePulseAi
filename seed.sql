INSERT OR IGNORE INTO organizations (id, name, slug)
VALUES ('org_urbanbuild', 'UrbanBuild Group', 'urbanbuild');

INSERT OR IGNORE INTO roles (id, organization_id, name, permissions_json)
VALUES
  ('role_admin', 'org_urbanbuild', 'Administrator', '{"all":true}'),
  ('role_pm', 'org_urbanbuild', 'Project Manager', '{"schedule":"write","budget":"read","documents":"approve"}'),
  ('role_site_manager', 'org_urbanbuild', 'Site Manager', '{"tasks":"write","issues":"write","schedule":"write"}'),
  ('role_supplier', 'org_urbanbuild', 'Supplier', '{"documents":"upload","tasks":"read"}');

INSERT OR IGNORE INTO users (id, organization_id, email, full_name)
VALUES
  ('user_admin', 'org_urbanbuild', 'admin@example.com', 'Admin SitePulseAi'),
  ('user_luca', 'org_urbanbuild', 'luca@example.com', 'Luca Ferri'),
  ('user_anna', 'org_urbanbuild', 'anna@example.com', 'Anna Sarti');

INSERT OR IGNORE INTO sites (id, organization_id, name, location, phase, budget_total, status)
VALUES
  ('site_porta_nuova', 'org_urbanbuild', 'Residenza Porta Nuova', 'Milano', 'Esecuzione impianti', 4800000, 'active'),
  ('site_lambrate', 'org_urbanbuild', 'Green Offices Lambrate', 'Milano', 'Strutture e facciate', 6200000, 'active'),
  ('site_aurora', 'org_urbanbuild', 'Hotel Aurora Renovation', 'Roma', 'Finiture e collaudi', 3900000, 'active'),
  ('site_nord_hub', 'org_urbanbuild', 'Logistica Nord Hub', 'Monza', 'Avvio cantiere', 3800000, 'active');

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

INSERT OR IGNORE INTO documents (
  id, organization_id, site_id, title, document_type, status, created_by_user_id
)
VALUES
  ('doc_var_imp', 'org_urbanbuild', 'site_porta_nuova', 'Variante impianti', 'PDF', 'in_review', 'user_anna'),
  ('doc_sal_may', 'org_urbanbuild', 'site_lambrate', 'SAL Maggio', 'SAL', 'in_review', 'user_luca');
