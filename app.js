const dictionaries = {
  en: {
    brandSubtitle: "Construction OS",
    navDashboard: "Dashboard",
    navTasks: "Tasks",
    navDocuments: "Documents",
    navBoq: "BoQ",
    navSchedule: "Schedule",
    navReports: "Reports",
    navHierarchy: "Hierarchy",
    navTeam: "Team & Roles",
    navSettings: "Settings",
    aiCardTitle: "AI triage online",
    aiCardText: "Classifies field media, extracts actions and updates owners in real time.",
    eyebrow: "Milano Porta Nuova - Mixed-use redevelopment",
    pageTitle: "Live site intelligence",
    moduleDashboard: "Dashboard",
    moduleTasks: "Tasks and issues",
    moduleDocuments: "Document management",
    moduleBoq: "BoQ",
    moduleSchedule: "Schedule and budget",
    moduleReports: "Reports",
    moduleHierarchy: "Hierarchy",
    moduleTeam: "Team and roles",
    moduleSettings: "Settings",
    searchTitle: "Search",
    notificationsTitle: "Notifications",
    exportReport: "Export board report",
    scopeOrganization: "Organization",
    scopeSite: "Site",
    organizationView: "Organization view",
    siteView: "Site view",
    organizationDescription: "Aggregated portfolio intelligence across all active construction sites.",
    siteDescription: "Operational intelligence filtered to the selected construction site.",
    scopeSitesLabel: "sites",
    scopeUsersLabel: "users",
    scopeModulesLabel: "modules",
    scopeBudgetLabel: "budget",
    scopeCostVarianceLabel: "costs vs budget",
    moduleContextPrefix: "Showing",
    metricTasks: "Open field tasks",
    metricTasksSub: "+3 from site chat",
    metricIssues: "High priority issues",
    metricIssuesSub: "2 blocked trades",
    metricDocs: "Documents processed",
    metricDocsSub: "18 this week",
    metricConfidence: "Schedule confidence",
    metricConfidenceSub: "Stable trend",
    timeInsightLabel: "Time performance",
    budgetInsightLabel: "Budget performance",
    forecastInsightLabel: "AI forecast",
    pulseTitle: "Operational pulse",
    pulseText: "AI summary from photos, notes, videos, checklists and site documents.",
    live: "Live",
    activityTitle: "AI activity stream",
    zonesTitle: "Site zones",
    legendUrgent: "urgent",
    legendWatch: "watch",
    legendClear: "clear",
    tasksTitle: "Tasks and issues",
    tasksText: "Actions generated from field conversations and assigned to owners.",
    kanban: "Kanban view",
    documentsTitle: "Document management",
    documentsText: "Permits, RFIs, drawings and delivery notes linked to site context.",
    reviewQueue: "Review queue",
    boqTitle: "BoQ import and analysis",
    boqText: "Import a PDF or XLS bill of quantities and let AI structure quantities, costs, trades and phases.",
    importBoq: "Import BoQ PDF/XLS",
    uploadTitle: "AI estimation intake",
    uploadText: "Reads line items, units, quantities, unit prices, categories and missing data from PDF, XLS or XLSX files.",
    boqReady: "Ready to import",
    boqProcessing: "AI is reading quantities, prices and work packages...",
    boqComplete: "BoQ imported. Schedule and budget generated.",
    scheduleTitle: "Schedule and budget",
    scheduleText: "AI converts the BoQ into phases, durations, dependencies, monthly cash flow and budget risk.",
    generateSchedule: "Generate from BoQ",
    totalBudget: "Total budget",
    duration: "Duration",
    contingency: "Contingency",
    timelineTitle: "AI cronoprogramma",
    budgetTitle: "Budget by trade",
    wbsTitle: "WBS planning",
    wbsText: "Edit WBS items and drag rows to reorder the cronoprogramma structure.",
    addWbs: "Add WBS item",
    wbsCode: "WBS",
    wbsActivity: "Activity",
    wbsDuration: "Duration",
    wbsBudget: "Budget",
    wbsOwner: "Owner",
    wbsDepends: "Depends on",
    wbsSubactions: "Sub-actions",
    addSubaction: "Add sub-action",
    docVersion: "Version",
    docStatus: "Status",
    docHistory: "Audit trail",
    docAuditUser: "User",
    docAuditRole: "Role",
    docAuditAction: "Action",
    boqCategory: "Category",
    boqDescription: "Description",
    boqQuantity: "Quantity",
    boqBudget: "Budget",
    boqZone: "Zone",
    reportsTitle: "Developer reporting",
    reportsText: "Automatically structured site updates for executives and asset owners.",
    schedulePdf: "Schedule PDF",
    hierarchyTitle: "Operating hierarchy",
    hierarchyText: "Govern the platform from global administration down to site-level role permissions.",
    registrationTitle: "Registration creates organization",
    registrationText: "The first user creates the organization during signup and chooses who will be administrator.",
    superAdminTitle: "Super Administrator",
    superAdminText: "Can manage platform-level policies and appoint organization administrators.",
    organizationTitle: "Organization",
    organizationText: "Represents a developer, contractor or asset owner with custom branding and workflows.",
    sitesTitle: "One or more construction sites",
    sitesText: "Each site has zones, teams, documents, reports, dashboards and AI processing rules.",
    rolesTitle: "Users by role",
    rolesText: "Field worker, site manager, project manager, document controller, developer and viewer permissions.",
    teamTitle: "Team and role management",
    teamText: "Administrators create construction sites, invite team members and assign permissions by role.",
    newSiteTitle: "Create construction site",
    siteNameLabel: "Site name",
    siteBudgetLabel: "Budget",
    siteAdminLabel: "Site administrator",
    createSite: "Create site",
    newMemberTitle: "Create team member",
    memberNameLabel: "Name",
    memberRoleLabel: "Role",
    memberSiteLabel: "Site",
    createMember: "Create member",
    adminRole: "Administrator",
    adminRoleText: "Creates sites, manages organization settings, users, roles and permissions.",
    siteManagerRole: "Site manager",
    siteManagerRoleText: "Manages site tasks, field team, WBS, schedule and operational reports.",
    docControllerRole: "Document controller",
    docControllerRoleText: "Controls document versions, audit trail, approvals and validation workflows.",
    fieldRole: "Field worker",
    fieldRoleText: "Uses mobile chat to upload photos, voice notes, videos and documents.",
    supplierRole: "Supplier",
    supplierRoleText: "Uploads delivery notes, certificates, product sheets and supply updates.",
    consultantRole: "Consultant",
    consultantRoleText: "Reviews specialist issues, contributes technical notes and validates recommendations.",
    designerRole: "Designer",
    designerRoleText: "Manages drawings, RFIs, design changes and technical clarifications.",
    worksDirectorRole: "Works director",
    worksDirectorRoleText: "Authorizes works, validates progress and controls compliance with contract documents.",
    developerRole: "Developer",
    developerRoleText: "Views executive dashboards, budget, schedule risk and portfolio reports.",
    viewerRole: "Viewer",
    viewerRoleText: "Read-only access to selected modules, reports and documents.",
    settingsTitle: "Settings",
    settingsText: "Configure workspace preferences for managers and field crews.",
    languageKicker: "Language",
    languageTitle: "Interface language",
    languageText: "Choose the language used across dashboard, mobile app and AI-generated updates.",
    workspaceKicker: "Workspace",
    workspaceTitle: "Milano Porta Nuova",
    workspaceText: "Project timezone, members and notification rules are ready for backend integration.",
    customKicker: "Customization",
    customTitle: "Everything is configurable",
    customText: "Organizations can customize branding, modules, fields, roles, workflows, reports, AI classification rules and notification policies.",
    customBrand: "Brand",
    customRoles: "Roles",
    customWorkflows: "Workflows",
    customAI: "AI rules",
    crewTitle: "Core A Field Crew",
    crewStatus: "12 members - AI assistant active",
    photo: "Photo",
    voice: "Voice",
    video: "Video",
    doc: "Doc",
    attachTitle: "Attach file",
    backTitle: "Back",
    sendTitle: "Send",
    messagePlaceholder: "Message the project...",
    open: "Open",
    inProgress: "In progress",
    done: "Done",
    taskCreatedBy: "Created by",
    taskAssignedTo: "Assigned to",
    taskTiming: "Timing",
    taskDue: "Due",
    high: "High",
    medium: "Medium",
    low: "Low",
    aiAuthor: "SitePulseAi AI",
    you: "You",
    siteManager: "Site manager",
    documentController: "Document controller",
    reviewFieldUpdate: "Review field update",
    generatedAction: "AI-generated action",
    newInteractionTitle: "New field interaction structured",
  },
  it: {
    brandSubtitle: "Sistema operativo di cantiere",
    navDashboard: "Dashboard",
    navTasks: "Attivita",
    navDocuments: "Documenti",
    navBoq: "Computo",
    navSchedule: "Cronoprogramma",
    navReports: "Report",
    navHierarchy: "Gerarchia",
    navTeam: "Team e Ruoli",
    navSettings: "Impostazioni",
    aiCardTitle: "Triage AI attivo",
    aiCardText: "Classifica media dal campo, estrae azioni e aggiorna i responsabili in tempo reale.",
    eyebrow: "Milano Porta Nuova - Riqualificazione mixed-use",
    pageTitle: "Dashboard",
    moduleDashboard: "Dashboard",
    moduleTasks: "Attivita e issue",
    moduleDocuments: "Gestione documentale",
    moduleBoq: "Computo",
    moduleSchedule: "Cronoprogramma e budget",
    moduleReports: "Report",
    moduleHierarchy: "Gerarchia",
    moduleTeam: "Team e ruoli",
    moduleSettings: "Impostazioni",
    searchTitle: "Cerca",
    notificationsTitle: "Notifiche",
    exportReport: "Esporta report direzione",
    scopeOrganization: "Organizzazione",
    scopeSite: "Cantiere",
    organizationView: "Vista organizzazione",
    siteView: "Vista cantiere",
    organizationDescription: "Intelligence aggregata del portfolio su tutti i cantieri attivi.",
    siteDescription: "Intelligence operativa filtrata sul cantiere selezionato.",
    scopeSitesLabel: "cantieri",
    scopeUsersLabel: "utenti",
    scopeModulesLabel: "moduli",
    scopeBudgetLabel: "budget",
    scopeCostVarianceLabel: "costi vs budget",
    moduleContextPrefix: "Vista attiva",
    metricTasks: "Attivita aperte",
    metricTasksSub: "+3 dalla chat di cantiere",
    metricIssues: "Issue ad alta priorita",
    metricIssuesSub: "2 squadre bloccate",
    metricDocs: "Documenti processati",
    metricDocsSub: "18 questa settimana",
    metricConfidence: "Affidabilita programma",
    metricConfidenceSub: "Trend stabile",
    timeInsightLabel: "Rispetto tempi",
    budgetInsightLabel: "Rispetto budget",
    forecastInsightLabel: "Forecast AI",
    pulseTitle: "Monitoraggio operativo",
    pulseText: "Sintesi AI da foto, note vocali, video, checklist e documenti di cantiere.",
    live: "Live",
    activityTitle: "Flusso attivita AI",
    zonesTitle: "Zone di cantiere",
    legendUrgent: "urgente",
    legendWatch: "attenzione",
    legendClear: "ok",
    tasksTitle: "Attivita e issue",
    tasksText: "Azioni generate dalle conversazioni sul campo e assegnate ai responsabili.",
    kanban: "Vista Kanban",
    documentsTitle: "Gestione documentale",
    documentsText: "Permessi, RFI, tavole e bolle collegati al contesto di cantiere.",
    reviewQueue: "Coda revisione",
    boqTitle: "Import e analisi computo",
    boqText: "Importa un computo PDF o XLS e lascia che l'AI strutturi quantita, costi, categorie e fasi.",
    importBoq: "Importa computo PDF/XLS",
    uploadTitle: "Acquisizione computo AI",
    uploadText: "Legge voci, unita, quantita, prezzi unitari, categorie e dati mancanti da PDF, XLS o XLSX.",
    boqReady: "Pronto per importare",
    boqProcessing: "L'AI sta leggendo quantita, prezzi e pacchetti lavori...",
    boqComplete: "Computo importato. Cronoprogramma e budget generati.",
    scheduleTitle: "Cronoprogramma e budget",
    scheduleText: "L'AI converte il computo in fasi, durate, dipendenze, cash flow mensile e rischio budget.",
    generateSchedule: "Genera da computo",
    totalBudget: "Budget totale",
    duration: "Durata",
    contingency: "Contingenza",
    timelineTitle: "Cronoprogramma AI",
    budgetTitle: "Budget per categoria",
    wbsTitle: "Pianificazione WBS",
    wbsText: "Modifica le voci WBS e trascina le righe per riordinare la struttura del cronoprogramma.",
    addWbs: "Aggiungi voce WBS",
    wbsCode: "WBS",
    wbsActivity: "Attivita",
    wbsDuration: "Durata",
    wbsBudget: "Budget",
    wbsOwner: "Responsabile",
    wbsDepends: "Dipende da",
    wbsSubactions: "Sotto-azioni",
    addSubaction: "Aggiungi sotto-azione",
    docVersion: "Versione",
    docStatus: "Stato",
    docHistory: "Audit trail",
    docAuditUser: "Utente",
    docAuditRole: "Ruolo",
    docAuditAction: "Azione",
    boqCategory: "Categoria",
    boqDescription: "Descrizione",
    boqQuantity: "Quantita",
    boqBudget: "Budget",
    boqZone: "Zona",
    reportsTitle: "Report per developer",
    reportsText: "Aggiornamenti di cantiere strutturati automaticamente per direzione e asset owner.",
    schedulePdf: "Programma PDF",
    hierarchyTitle: "Gerarchia operativa",
    hierarchyText: "Governa la piattaforma dal livello globale fino ai permessi per ruolo su ogni cantiere.",
    registrationTitle: "La registrazione crea l'organizzazione",
    registrationText: "Il primo utente crea l'organizzazione in fase di registrazione e indica chi sara amministratore.",
    superAdminTitle: "Superamministratore",
    superAdminText: "Gestisce policy di piattaforma e puo nominare gli amministratori dell'organizzazione.",
    organizationTitle: "Organizzazione",
    organizationText: "Rappresenta developer, impresa o asset owner con branding e workflow personalizzati.",
    sitesTitle: "Uno o piu cantieri",
    sitesText: "Ogni cantiere ha zone, team, documenti, report, dashboard e regole AI dedicate.",
    rolesTitle: "Utenti per ruolo",
    rolesText: "Permessi per operaio, capocantiere, project manager, document controller, developer e viewer.",
    teamTitle: "Gestione team e ruoli",
    teamText: "Gli amministratori creano cantieri, invitano membri e assegnano permessi per ruolo.",
    newSiteTitle: "Crea cantiere",
    siteNameLabel: "Nome cantiere",
    siteBudgetLabel: "Budget",
    siteAdminLabel: "Amministratore cantiere",
    createSite: "Crea cantiere",
    newMemberTitle: "Crea membro team",
    memberNameLabel: "Nome",
    memberRoleLabel: "Ruolo",
    memberSiteLabel: "Cantiere",
    createMember: "Crea membro",
    adminRole: "Amministratore",
    adminRoleText: "Crea cantieri, gestisce impostazioni organizzazione, utenti, ruoli e permessi.",
    siteManagerRole: "Capocantiere",
    siteManagerRoleText: "Gestisce task di cantiere, team campo, WBS, cronoprogramma e report operativi.",
    docControllerRole: "Document controller",
    docControllerRoleText: "Controlla versioni documenti, audit trail, approvazioni e workflow di validazione.",
    fieldRole: "Operatore campo",
    fieldRoleText: "Usa la chat mobile per caricare foto, note vocali, video e documenti.",
    supplierRole: "Fornitore",
    supplierRoleText: "Carica bolle, certificati, schede prodotto e aggiornamenti forniture.",
    consultantRole: "Consulente",
    consultantRoleText: "Revisiona issue specialistiche, aggiunge note tecniche e valida raccomandazioni.",
    designerRole: "Progettista",
    designerRoleText: "Gestisce tavole, RFI, varianti progettuali e chiarimenti tecnici.",
    worksDirectorRole: "Direzione lavori",
    worksDirectorRoleText: "Autorizza lavorazioni, valida avanzamenti e controlla conformita contrattuale.",
    developerRole: "Developer",
    developerRoleText: "Visualizza dashboard direzionali, budget, rischio tempi e report portfolio.",
    viewerRole: "Viewer",
    viewerRoleText: "Accesso in sola lettura a moduli, report e documenti selezionati.",
    settingsTitle: "Impostazioni",
    settingsText: "Configura le preferenze di workspace per manager e squadre sul campo.",
    languageKicker: "Lingua",
    languageTitle: "Lingua interfaccia",
    languageText: "Scegli la lingua usata in dashboard, app mobile e aggiornamenti generati dall'AI.",
    workspaceKicker: "Workspace",
    workspaceTitle: "Milano Porta Nuova",
    workspaceText: "Timezone progetto, membri e regole notifiche sono pronti per l'integrazione backend.",
    customKicker: "Customizzazione",
    customTitle: "Tutto e configurabile",
    customText: "Le organizzazioni possono personalizzare brand, moduli, campi, ruoli, workflow, report, regole di classificazione AI e notifiche.",
    customBrand: "Brand",
    customRoles: "Ruoli",
    customWorkflows: "Workflow",
    customAI: "Regole AI",
    crewTitle: "Squadra Core A",
    crewStatus: "12 membri - assistente AI attivo",
    photo: "Foto",
    voice: "Voce",
    video: "Video",
    doc: "Doc",
    attachTitle: "Allega file",
    backTitle: "Indietro",
    sendTitle: "Invia",
    messagePlaceholder: "Scrivi al progetto...",
    open: "Aperte",
    inProgress: "In corso",
    done: "Chiuse",
    taskCreatedBy: "Creata da",
    taskAssignedTo: "Assegnata a",
    taskTiming: "Timing",
    taskDue: "Scadenza",
    high: "Alta",
    medium: "Media",
    low: "Bassa",
    aiAuthor: "SitePulseAi AI",
    you: "Tu",
    siteManager: "Capocantiere",
    documentController: "Document controller",
    reviewFieldUpdate: "Rivedi aggiornamento dal campo",
    generatedAction: "Azione generata dall'AI",
    newInteractionTitle: "Nuova interazione strutturata",
  },
};

const datasets = {
  en: {
    activities: [
      ["PH", "Photo classified as safety issue", "Core A level 3: missing guardrail tagged high priority and assigned to Marco Conti."],
      ["VO", "Voice note converted to RFI draft", "Waterproofing conflict near garage ramp needs architect clarification before Friday."],
      ["DC", "Delivery note filed", "Concrete batch certificate linked to pour log, supplier and inspection checklist."],
      ["VI", "Video summarized", "Facade anchors complete on Tower B levels 8-10 with no visible defects."],
    ],
    tasks: [
      ["Open", "Install temporary guardrail", "Detected from field photo at Core A stair opening.", "Marco", "High", "Gianni Russo", "Marco Conti", "Today 09:40 -> 16:00", "Today 16:00"],
      ["Open", "Confirm rebar inspection", "Concrete pour blocked until QA sign-off is uploaded.", "Elena", "High", "SitePulseAi AI", "Elena Ricci", "Today 10:05 -> 14:30", "Today 14:30"],
      ["In progress", "Resolve garage waterproofing detail", "Voice note indicates scope conflict around drain connection.", "Luca", "Medium", "Rosa Bianchi", "Luca Ferri", "May 24 -> May 27", "May 27"],
      ["In progress", "Update Tower B facade photo log", "Attach video evidence to weekly developer report.", "Sara", "Low", "Sara Leone", "Sara Leone", "This week", "Friday"],
      ["Done", "File concrete delivery certificate", "Document parsed and linked to supplier package.", "AI", "Low", "Gianni Russo", "Document controller", "May 23 14:20 -> 15:10", "Completed"],
    ],
    documents: [
      ["RFI", "RFI-042 Waterproofing ramp drain", "Draft generated from voice note - Waiting for review", "RFI", "v0.3", "Draft", [["2026-05-24 09:12", "Rosa Bianchi", "Field engineer", "Uploaded", "Voice note and site photo attached"], ["2026-05-24 09:18", "SitePulseAi AI", "AI assistant", "Modified", "Generated RFI draft v0.2"], ["2026-05-24 10:05", "Luca Ferri", "Project manager", "Authorized", "Sent to design team for review"]]],
      ["PDF", "Concrete batch certificate C-1842", "Auto-indexed by supplier, date, pour zone and batch number", "Quality", "v1.0", "Approved", [["2026-05-23 14:20", "Gianni Russo", "Site supervisor", "Uploaded", "Supplier certificate uploaded from mobile"], ["2026-05-23 14:26", "SitePulseAi AI", "AI assistant", "Modified", "Extracted batch, supplier and pour zone"], ["2026-05-23 15:10", "Elena Ricci", "QA manager", "Validated", "Approved for concrete pour log"]]],
      ["DWG", "Core A structural drawing S-301 rev 6", "Linked to inspection blocker and rebar checklist", "Drawing", "rev 6", "Current", [["2026-05-20 11:40", "Studio ArchLab", "Designer", "Uploaded", "Revision 6 issued"], ["2026-05-20 12:05", "Marco Conti", "Site manager", "Authorized", "Marked as current construction revision"], ["2026-05-21 08:30", "Elena Ricci", "QA manager", "Validated", "Linked to rebar inspection checklist"]]],
      ["VID", "Tower B facade anchor walkdown", "AI summary ready for weekly asset-owner digest", "Media", "v1.1", "Published", [["2026-05-22 16:45", "Sara Leone", "Facade lead", "Uploaded", "Walkdown video uploaded"], ["2026-05-22 16:48", "SitePulseAi AI", "AI assistant", "Modified", "Added summary and tagged levels 8-10"], ["2026-05-22 17:15", "Luca Ferri", "Project manager", "Validated", "Published to weekly developer digest"]]],
    ],
    chat: [
      ["manager", "Site manager", "Morning team. Send all Core A blockers here before the 11:00 coordination call."],
      ["field", "Gianni", "Level 3 stair opening is missing the temporary guardrail. Uploading photo now.", "Site photo"],
      ["ai", "SitePulseAi AI", "Classified: safety issue. Created task for Marco Conti, priority high, due today 16:00."],
      ["field", "Rosa", "Voice note: waterproofing around garage ramp drain does not match the latest detail."],
      ["ai", "SitePulseAi AI", "Converted voice note into RFI draft and linked it to drawing S-301 rev 6."],
    ],
    reports: [
      ["Today", "Concrete pour delayed in Core A", "Root cause: missing rebar inspection sign-off. Recommended action: escalate to QA lead and city inspector."],
      ["This week", "Facade work trending 1.5 days ahead", "Three video updates confirm completed anchors on Tower B levels 8-10 with no open safety observations."],
      ["Budget risk", "Potential change order detected", "Voice notes mention out-of-scope waterproofing around garage ramp drain connection."],
    ],
    boq: [
      ["Structures", "Reinforced concrete frame", "3,420 m3", "EUR 1.42M", "Core A + Tower B"],
      ["Envelope", "Facade anchors and curtain wall", "9,850 m2", "EUR 1.18M", "Tower B"],
      ["MEP", "Rough-in and plant rooms", "1 lot", "EUR 1.05M", "Podium + tower"],
      ["External works", "Drainage, paving and ramp waterproofing", "1 lot", "EUR 0.62M", "Garage"],
    ],
    schedule: [
      ["01", "Mobilization and site setup", "2 weeks", "EUR 0.18M", 12],
      ["02", "Structures and Core A concrete", "10 weeks", "EUR 1.42M", 38],
      ["03", "Envelope and facade", "8 weeks", "EUR 1.18M", 63],
      ["04", "MEP rough-in", "9 weeks", "EUR 1.05M", 78],
      ["05", "Finishes and handover", "5 weeks", "EUR 0.99M", 100],
    ],
    wbs: [
      ["1.0", "Mobilization and site setup", "2w", "EUR 0.18M", "Site manager", "-", [["1.1", "Temporary utilities", "3d", "Site team"], ["1.2", "Site logistics plan", "2d", "Site manager"]]],
      ["2.0", "Core A structures", "10w", "EUR 1.42M", "Structural lead", "1.0", [["2.1", "Rebar installation", "4w", "Steel crew"], ["2.2", "Formwork and pours", "6w", "Concrete crew"]]],
      ["3.0", "Facade and envelope", "8w", "EUR 1.18M", "Envelope lead", "2.0", [["3.1", "Anchor survey", "1w", "Facade lead"], ["3.2", "Curtain wall installation", "7w", "Facade crew"]]],
      ["4.0", "MEP rough-in", "9w", "EUR 1.05M", "MEP lead", "2.0", [["4.1", "Plant room rough-in", "4w", "MEP team"], ["4.2", "Vertical risers", "5w", "MEP team"]]],
      ["5.0", "Finishes and handover", "5w", "EUR 0.99M", "PM", "3.0, 4.0", [["5.1", "Snagging", "2w", "QA"], ["5.2", "Handover pack", "1w", "Document controller"]]],
    ],
    budget: [
      ["Structures", "29%", "EUR 1.42M"],
      ["Envelope", "24%", "EUR 1.18M"],
      ["MEP", "22%", "EUR 1.05M"],
      ["External works", "13%", "EUR 0.62M"],
      ["Contingency", "12%", "EUR 0.55M"],
    ],
    quickCaptures: {
      photo: ["You", "Photo uploaded: exposed rebar around Core A pour edge.", "New site photo", "Detected quality issue. Created QA checklist item and added it to today's pour readiness report."],
      voice: ["You", "Voice note sent: crane access blocked by late material delivery.", "", "Transcribed voice note. Created logistics blocker, notified site manager and updated schedule risk."],
      video: ["You", "Video uploaded: completed MEP rough-in walkthrough.", "Walkthrough video", "Summarized video. Marked MEP rough-in 68% complete and attached evidence to weekly report."],
      document: ["You", "Delivery document uploaded: steel package SP-27.", "", "Parsed document. Filed certificate, matched supplier order and flagged one missing heat number."],
    },
    messageAi: "Classified message. Created task, linked context and updated the dashboard intelligence stream.",
  },
  it: {
    activities: [
      ["PH", "Foto classificata come issue sicurezza", "Core A livello 3: parapetto mancante marcato alta priorita e assegnato a Marco Conti."],
      ["VO", "Nota vocale convertita in bozza RFI", "Conflitto impermeabilizzazione presso rampa garage: serve chiarimento architetto entro venerdi."],
      ["DC", "Bolla di consegna archiviata", "Certificato lotto calcestruzzo collegato a getto, fornitore e checklist ispezione."],
      ["VI", "Video sintetizzato", "Ancoraggi facciata completati su Tower B livelli 8-10 senza difetti visibili."],
    ],
    tasks: [
      ["Open", "Installare parapetto temporaneo", "Rilevato da foto campo sulla scala Core A.", "Marco", "High", "Gianni Russo", "Marco Conti", "Oggi 09:40 -> 16:00", "Oggi 16:00"],
      ["Open", "Confermare ispezione ferri", "Getto calcestruzzo bloccato finche non viene caricato il visto QA.", "Elena", "High", "SitePulseAi AI", "Elena Ricci", "Oggi 10:05 -> 14:30", "Oggi 14:30"],
      ["In progress", "Risolvere dettaglio impermeabilizzazione garage", "Nota vocale segnala conflitto di ambito sul collegamento scarico.", "Luca", "Medium", "Rosa Bianchi", "Luca Ferri", "24 mag -> 27 mag", "27 mag"],
      ["In progress", "Aggiornare log foto facciata Tower B", "Allegare evidenza video al report settimanale developer.", "Sara", "Low", "Sara Leone", "Sara Leone", "Questa settimana", "Venerdi"],
      ["Done", "Archiviare certificato consegna calcestruzzo", "Documento letto e collegato al pacchetto fornitore.", "AI", "Low", "Gianni Russo", "Document controller", "23 mag 14:20 -> 15:10", "Completata"],
    ],
    documents: [
      ["RFI", "RFI-042 Impermeabilizzazione scarico rampa", "Bozza generata da nota vocale - In attesa di revisione", "RFI", "v0.3", "Bozza", [["2026-05-24 09:12", "Rosa Bianchi", "Field engineer", "Caricato", "Nota vocale e foto cantiere allegate"], ["2026-05-24 09:18", "SitePulseAi AI", "Assistente AI", "Modificato", "Generata bozza RFI v0.2"], ["2026-05-24 10:05", "Luca Ferri", "Project manager", "Autorizzato", "Inviata al team progettazione per revisione"]]],
      ["PDF", "Certificato lotto calcestruzzo C-1842", "Indicizzato per fornitore, data, zona getto e numero lotto", "Qualita", "v1.0", "Approvato", [["2026-05-23 14:20", "Gianni Russo", "Capocantiere", "Caricato", "Certificato fornitore caricato da mobile"], ["2026-05-23 14:26", "SitePulseAi AI", "Assistente AI", "Modificato", "Estratti lotto, fornitore e zona getto"], ["2026-05-23 15:10", "Elena Ricci", "QA manager", "Validato", "Approvato per registro getto calcestruzzo"]]],
      ["DWG", "Tavola strutturale Core A S-301 rev 6", "Collegata a blocco ispezione e checklist ferri", "Tavola", "rev 6", "Corrente", [["2026-05-20 11:40", "Studio ArchLab", "Progettista", "Caricato", "Emissione revisione 6"], ["2026-05-20 12:05", "Marco Conti", "Site manager", "Autorizzato", "Marcata come revisione corrente per costruzione"], ["2026-05-21 08:30", "Elena Ricci", "QA manager", "Validato", "Collegata alla checklist ispezione ferri"]]],
      ["VID", "Walkdown ancoraggi facciata Tower B", "Sintesi AI pronta per digest settimanale asset owner", "Media", "v1.1", "Pubblicato", [["2026-05-22 16:45", "Sara Leone", "Responsabile facciata", "Caricato", "Video walkdown caricato"], ["2026-05-22 16:48", "SitePulseAi AI", "Assistente AI", "Modificato", "Aggiunta sintesi e tag livelli 8-10"], ["2026-05-22 17:15", "Luca Ferri", "Project manager", "Validato", "Pubblicato nel digest settimanale developer"]]],
    ],
    chat: [
      ["manager", "Capocantiere", "Buongiorno team. Mandate qui tutti i blocchi Core A prima della riunione delle 11:00."],
      ["field", "Gianni", "Sul vano scala livello 3 manca il parapetto temporaneo. Carico la foto ora.", "Foto cantiere"],
      ["ai", "SitePulseAi AI", "Classificato: issue sicurezza. Creata attivita per Marco Conti, priorita alta, scadenza oggi 16:00."],
      ["field", "Rosa", "Nota vocale: impermeabilizzazione presso rampa garage non allineata all'ultimo dettaglio."],
      ["ai", "SitePulseAi AI", "Nota vocale convertita in bozza RFI e collegata alla tavola S-301 rev 6."],
    ],
    reports: [
      ["Oggi", "Getto calcestruzzo in ritardo in Core A", "Causa: manca firma ispezione ferri. Azione consigliata: escalation a QA lead e ispettore comunale."],
      ["Questa settimana", "Facciata avanti di 1,5 giorni", "Tre video confermano ancoraggi completati su Tower B livelli 8-10 senza osservazioni sicurezza aperte."],
      ["Rischio budget", "Possibile change order rilevato", "Le note vocali citano impermeabilizzazione extra-scope presso collegamento scarico rampa garage."],
    ],
    boq: [
      ["Strutture", "Telaio in calcestruzzo armato", "3.420 m3", "EUR 1,42M", "Core A + Tower B"],
      ["Involucro", "Ancoraggi facciata e curtain wall", "9.850 m2", "EUR 1,18M", "Tower B"],
      ["MEP", "Rough-in e locali tecnici", "1 lotto", "EUR 1,05M", "Podium + torre"],
      ["Opere esterne", "Drenaggi, pavimentazioni e impermeabilizzazione rampa", "1 lotto", "EUR 0,62M", "Garage"],
    ],
    schedule: [
      ["01", "Mobilizzazione e setup cantiere", "2 settimane", "EUR 0,18M", 12],
      ["02", "Strutture e getti Core A", "10 settimane", "EUR 1,42M", 38],
      ["03", "Involucro e facciata", "8 settimane", "EUR 1,18M", 63],
      ["04", "MEP rough-in", "9 settimane", "EUR 1,05M", 78],
      ["05", "Finiture e consegna", "5 settimane", "EUR 0,99M", 100],
    ],
    wbs: [
      ["1.0", "Mobilizzazione e setup cantiere", "2s", "EUR 0,18M", "Capocantiere", "-", [["1.1", "Allacci temporanei", "3g", "Squadra cantiere"], ["1.2", "Piano logistica cantiere", "2g", "Capocantiere"]]],
      ["2.0", "Strutture Core A", "10s", "EUR 1,42M", "Responsabile strutture", "1.0", [["2.1", "Posa ferri", "4s", "Squadra ferro"], ["2.2", "Casserature e getti", "6s", "Squadra calcestruzzo"]]],
      ["3.0", "Facciata e involucro", "8s", "EUR 1,18M", "Responsabile facciata", "2.0", [["3.1", "Rilievo ancoraggi", "1s", "Responsabile facciata"], ["3.2", "Installazione curtain wall", "7s", "Squadra facciata"]]],
      ["4.0", "MEP rough-in", "9s", "EUR 1,05M", "Responsabile MEP", "2.0", [["4.1", "Rough-in locali tecnici", "4s", "Team MEP"], ["4.2", "Cavedi verticali", "5s", "Team MEP"]]],
      ["5.0", "Finiture e consegna", "5s", "EUR 0,99M", "PM", "3.0, 4.0", [["5.1", "Snagging", "2s", "QA"], ["5.2", "Pacchetto consegna", "1s", "Document controller"]]],
    ],
    budget: [
      ["Strutture", "29%", "EUR 1,42M"],
      ["Involucro", "24%", "EUR 1,18M"],
      ["MEP", "22%", "EUR 1,05M"],
      ["Opere esterne", "13%", "EUR 0,62M"],
      ["Contingenza", "12%", "EUR 0,55M"],
    ],
    quickCaptures: {
      photo: ["Tu", "Foto caricata: ferri esposti sul bordo getto Core A.", "Nuova foto cantiere", "Rilevata issue qualita. Creata checklist QA e aggiunta al report prontezza getto di oggi."],
      voice: ["Tu", "Nota vocale inviata: accesso gru bloccato da consegna materiali in ritardo.", "", "Nota trascritta. Creato blocco logistica, notificato capocantiere e aggiornato rischio programma."],
      video: ["Tu", "Video caricato: walkthrough MEP rough-in completato.", "Video walkthrough", "Video sintetizzato. MEP rough-in segnato al 68% e allegato al report settimanale."],
      document: ["Tu", "Documento consegna caricato: pacchetto acciaio SP-27.", "", "Documento letto. Certificato archiviato, ordine fornitore abbinato e un heat number mancante segnalato."],
    },
    messageAi: "Messaggio classificato. Creata attivita, collegato il contesto e aggiornata l'intelligence dashboard.",
  },
};

const chatMessages = document.querySelector("#chatMessages");
const activityFeed = document.querySelector("#activityFeed");
const taskBoard = document.querySelector("#taskBoard");
const documentList = document.querySelector("#documentList");
const reportGrid = document.querySelector("#reportGrid");
const teamList = document.querySelector("#teamList");
const topbarEyebrow = document.querySelector(".eyebrow");
const pageHeading = document.querySelector("h1");
const boqTable = document.querySelector("#boqTable");
const boqStatus = document.querySelector("#boqStatus");
const scheduleTimeline = document.querySelector("#scheduleTimeline");
const budgetBreakdown = document.querySelector("#budgetBreakdown");
const wbsBoard = document.querySelector("#wbsBoard");
const totalBudget = document.querySelector("#totalBudget");
const duration = document.querySelector("#duration");
const contingency = document.querySelector("#contingency");
const siteSelector = document.querySelector("#siteSelector");
const scopeLabel = document.querySelector("#scopeLabel");
const scopeTitle = document.querySelector("#scopeTitle");
const scopeDescription = document.querySelector("#scopeDescription");
const scopeSites = document.querySelector("#scopeSites");
const scopeSitesStat = document.querySelector("#scopeSitesStat");
const scopeUsers = document.querySelector("#scopeUsers");
const scopeModules = document.querySelector("#scopeModules");
const scopeBudget = document.querySelector("#scopeBudget");
const timeInsightValue = document.querySelector("#timeInsightValue");
const timeInsightText = document.querySelector("#timeInsightText");
const timeInsightBar = document.querySelector("#timeInsightBar");
const budgetInsightValue = document.querySelector("#budgetInsightValue");
const budgetInsightText = document.querySelector("#budgetInsightText");
const budgetInsightBar = document.querySelector("#budgetInsightBar");
const forecastInsightValue = document.querySelector("#forecastInsightValue");
const forecastInsightText = document.querySelector("#forecastInsightText");
const forecastNeedle = document.querySelector("#forecastNeedle");
const taskCount = document.querySelector("#taskCount");
const riskCount = document.querySelector("#riskCount");
const docCount = document.querySelector("#docCount");
const confidence = document.querySelector("#confidence");

let currentLang = localStorage.getItem("sitepulseai-lang") || "en";
let currentScope = localStorage.getItem("sitepulseai-scope") || "organization";
let currentSite = localStorage.getItem("sitepulseai-site") || "porta-nuova";
let activeView = "dashboard";
let activities = [];
let tasks = [];
let documents = [];
let dynamicTaskCount = 24;
let dynamicRiskCount = 7;
let dynamicDocCount = 148;
let dynamicConfidence = 82;
let boqImported = false;
let wbsItems = [];
let draggedWbsIndex = null;
let draggedSubaction = null;
let teamMembers = [
  ["Luca Ferri", "Project manager", "UrbanBuild Group", "Administrator"],
  ["Marco Conti", "Site manager", "Milano Porta Nuova", "Site manager"],
  ["Elena Ricci", "QA manager", "Milano Porta Nuova", "Document validator"],
  ["Sara Leone", "Facade lead", "Torino Lingotto", "Field manager"],
];

const organizationContext = {
  title: "UrbanBuild Group",
  sites: 3,
  users: 128,
  modules: 8,
  metrics: [86, 19, 412, 78],
  budget: "EUR 18.4M",
  costVariance: "+4.6%",
  insights: {
    en: ["+9 days", "Two sites are behind baseline; Roma Ostiense carries the largest schedule variance.", "+4.6%", "MEP and waterproofing packages are above forecast across the portfolio.", "Medium-high risk", "AI recommends rebalancing procurement priorities and closing QA blockers within 7 days.", 74, 68, 72],
    it: ["+9 giorni", "Due cantieri sono oltre baseline; Roma Ostiense pesa di piu sullo scostamento tempi.", "+4,6%", "Pacchetti MEP e impermeabilizzazioni sopra forecast sul portfolio.", "Rischio medio-alto", "L'AI consiglia di riequilibrare priorita procurement e chiudere i blocchi QA entro 7 giorni.", 74, 68, 72],
  },
};

const siteContexts = {
  "porta-nuova": {
    title: "Milano Porta Nuova",
    sites: 1,
    users: 42,
    modules: 8,
    metrics: [24, 7, 148, 82],
    budget: "EUR 4.82M",
    costVariance: "+3.8%",
    insights: {
      en: ["+4 days", "Core A inspections are delaying the concrete sequence.", "+3.8%", "Waterproofing and logistics are driving forecast variance.", "Medium risk", "Recoverable if QA approvals and procurement blockers close this week.", 58, 54, 56],
      it: ["+4 giorni", "Le ispezioni Core A stanno ritardando la sequenza getti.", "+3,8%", "Impermeabilizzazioni e logistica stanno generando scostamento forecast.", "Rischio medio", "Recuperabile se approvazioni QA e blocchi procurement chiudono questa settimana.", 58, 54, 56],
    },
  },
  "torino-lingotto": {
    title: "Torino Lingotto",
    sites: 1,
    users: 31,
    modules: 8,
    metrics: [18, 4, 96, 88],
    budget: "EUR 3.65M",
    costVariance: "-1.1%",
    insights: {
      en: ["-2 days", "Facade crews are trending ahead thanks to early material release.", "-1.1%", "Buyout savings offset minor logistics costs.", "Low risk", "AI recommends preserving current crew allocation through the next milestone.", 24, 18, 22],
      it: ["-2 giorni", "Le squadre facciata sono in anticipo grazie al rilascio anticipato materiali.", "-1,1%", "Risparmi di procurement compensano piccoli costi logistici.", "Rischio basso", "L'AI consiglia di mantenere l'attuale allocazione squadre fino alla prossima milestone.", 24, 18, 22],
    },
  },
  "roma-ostiense": {
    title: "Roma Ostiense",
    sites: 1,
    users: 55,
    modules: 8,
    metrics: [44, 8, 168, 74],
    budget: "EUR 6.10M",
    costVariance: "+6.2%",
    insights: {
      en: ["+12 days", "MEP rough-in and city inspections are pushing the critical path.", "+6.2%", "Plant room redesign and site access costs exceed contingency.", "High risk", "AI recommends escalation to owner, designer and procurement lead today.", 88, 82, 90],
      it: ["+12 giorni", "MEP rough-in e ispezioni comunali stanno spostando il percorso critico.", "+6,2%", "Ridisegno locali tecnici e costi accesso cantiere superano la contingenza.", "Rischio alto", "L'AI consiglia escalation oggi a owner, progettista e procurement lead.", 88, 82, 90],
    },
  },
};

const moduleTitleKeys = {
  dashboard: "moduleDashboard",
  tasks: "moduleTasks",
  documents: "moduleDocuments",
  boq: "moduleBoq",
  schedule: "moduleSchedule",
  reports: "moduleReports",
  hierarchy: "moduleHierarchy",
  team: "moduleTeam",
  settings: "moduleSettings",
};

function t(key) {
  return dictionaries[currentLang][key] || dictionaries.en[key] || key;
}

function getDataset() {
  return datasets[currentLang];
}

function mapActivity(row) {
  return { icon: row[0], title: row[1], detail: row[2] };
}

function mapTask(row) {
  return {
    status: row[0],
    title: row[1],
    detail: row[2],
    owner: row[3],
    priority: row[4],
    createdBy: row[5],
    assignedTo: row[6],
    timing: row[7],
    due: row[8],
  };
}

function mapDocument(row) {
  return { icon: row[0], title: row[1], detail: row[2], type: row[3], version: row[4], status: row[5], history: row[6] || [] };
}

function contextTitle() {
  return getActiveContext().title;
}

function getScopedTasks() {
  if (currentScope === "organization") {
    const rows =
      currentLang === "it"
        ? [
            ["Open", "Riallineare procurement portfolio", "Tre cantieri hanno materiali critici in ritardo.", "Procurement", "High", "Superamministratore", "Responsabile procurement", "Questa settimana", "Venerdi"],
            ["Open", "Validare report costi organizzazione", "Consolidare budget e costi da tutti i cantieri attivi.", "CFO", "Medium", "SitePulseAi AI", "Direzione", "Mensile", "Fine mese"],
            ["In progress", "Standardizzare workflow QA", "Applicare lo stesso flusso validazione su Milano, Torino e Roma.", "QA", "Medium", "Elena Ricci", "QA manager", "2 settimane", "10 giu"],
            ["Done", "Sincronizzare utenti e ruoli", "Permessi organizzazione aggiornati per 128 utenti.", "Admin", "Low", "Superamministratore", "IT admin", "Completata", "Completata"],
          ]
        : [
            ["Open", "Realign portfolio procurement", "Three sites have delayed critical materials.", "Procurement", "High", "Super Administrator", "Procurement lead", "This week", "Friday"],
            ["Open", "Validate organization cost report", "Consolidate budget and actual costs from all active sites.", "CFO", "Medium", "SitePulseAi AI", "Executive team", "Monthly", "Month end"],
            ["In progress", "Standardize QA workflow", "Apply the same validation flow across Milan, Turin and Rome.", "QA", "Medium", "Elena Ricci", "QA manager", "2 weeks", "Jun 10"],
            ["Done", "Sync users and roles", "Organization permissions updated for 128 users.", "Admin", "Low", "Super Administrator", "IT admin", "Completed", "Completed"],
          ];
    return rows.map(mapTask);
  }
  return tasks.map((task) => ({ ...task, detail: `${contextTitle()} - ${task.detail}` }));
}

function getScopedDocuments() {
  if (currentScope === "organization") {
    const rows =
      currentLang === "it"
        ? [
            ["PDF", "Report portfolio cantieri maggio", "Sintesi direzionale aggregata per tutti i cantieri.", "Report", "v1.2", "Validato", [["2026-05-26 18:00", "SitePulseAi AI", "Assistente AI", "Modificato", "Aggregati KPI da 3 cantieri"], ["2026-05-26 18:30", "Luca Ferri", "Project director", "Validato", "Approvato per direzione"]]],
            ["XLS", "Budget master organizzazione", "Budget consolidato con costi previsti e consuntivi.", "Budget", "v2.0", "Corrente", [["2026-05-25 11:00", "CFO", "Direzione", "Caricato", "Aggiornato budget portfolio"], ["2026-05-25 12:15", "Superamministratore", "Admin", "Autorizzato", "Pubblicato a PM"]]],
            ["PDF", "Template QA standard", "Workflow validazione comune per tutti i cantieri.", "Procedura", "v1.0", "Approvato", [["2026-05-21 09:20", "Elena Ricci", "QA manager", "Caricato", "Creato template QA"], ["2026-05-21 10:00", "Superamministratore", "Admin", "Validato", "Abilitato a livello organizzazione"]]],
          ]
        : [
            ["PDF", "May site portfolio report", "Executive aggregate summary across all sites.", "Report", "v1.2", "Validated", [["2026-05-26 18:00", "SitePulseAi AI", "AI assistant", "Modified", "Aggregated KPIs from 3 sites"], ["2026-05-26 18:30", "Luca Ferri", "Project director", "Validated", "Approved for executives"]]],
            ["XLS", "Organization master budget", "Consolidated budget with forecast and actual costs.", "Budget", "v2.0", "Current", [["2026-05-25 11:00", "CFO", "Executive", "Uploaded", "Updated portfolio budget"], ["2026-05-25 12:15", "Super Administrator", "Admin", "Authorized", "Published to PMs"]]],
            ["PDF", "Standard QA template", "Shared validation workflow for all construction sites.", "Procedure", "v1.0", "Approved", [["2026-05-21 09:20", "Elena Ricci", "QA manager", "Uploaded", "Created QA template"], ["2026-05-21 10:00", "Super Administrator", "Admin", "Validated", "Enabled organization-wide"]]],
          ];
    return rows.map(mapDocument);
  }
  return documents.map((document) => ({ ...document, detail: `${contextTitle()} - ${document.detail}` }));
}

function getScopedBoqRows() {
  if (currentScope === "organization") {
    return currentLang === "it"
      ? [
          ["Portfolio", "Computi aggregati cantieri attivi", "3 cantieri", getActiveContext().budget, "Organizzazione"],
          ["Strutture", "Pacchetti strutturali consolidati", "3 lotti", "EUR 5,42M", "Multi-cantiere"],
          ["MEP", "Impianti e locali tecnici portfolio", "3 lotti", "EUR 4,86M", "Multi-cantiere"],
          ["Contingenza", "Fondo rischio portfolio", "1 fondo", "EUR 1,20M", "Direzione"],
        ]
      : [
          ["Portfolio", "Aggregated BoQs across active sites", "3 sites", getActiveContext().budget, "Organization"],
          ["Structures", "Consolidated structural packages", "3 lots", "EUR 5.42M", "Multi-site"],
          ["MEP", "Portfolio plant rooms and services", "3 lots", "EUR 4.86M", "Multi-site"],
          ["Contingency", "Portfolio risk allowance", "1 fund", "EUR 1.20M", "Executive"],
        ];
  }
  return getDataset().boq.map((row) => [...row.slice(0, 4), contextTitle()]);
}

function getScopedScheduleRows() {
  if (currentScope === "organization") {
    return currentLang === "it"
      ? [
          ["01", "Milano Porta Nuova - percorso critico", "34 settimane", "EUR 4,82M", 42],
          ["02", "Torino Lingotto - facciata in anticipo", "28 settimane", "EUR 3,65M", 64],
          ["03", "Roma Ostiense - MEP critico", "41 settimane", "EUR 6,10M", 86],
          ["04", "Portfolio handover forecast", "12 mesi", "EUR 18,4M", 72],
        ]
      : [
          ["01", "Milano Porta Nuova - critical path", "34 weeks", "EUR 4.82M", 42],
          ["02", "Torino Lingotto - facade ahead", "28 weeks", "EUR 3.65M", 64],
          ["03", "Roma Ostiense - MEP critical", "41 weeks", "EUR 6.10M", 86],
          ["04", "Portfolio handover forecast", "12 months", "EUR 18.4M", 72],
        ];
  }
  return getDataset().schedule.map((row) => [...row.slice(0, 4), row[4]]);
}

function statusLabel(status) {
  if (status === "Open") return t("open");
  if (status === "In progress") return t("inProgress");
  return t("done");
}

function priorityLabel(priority) {
  if (priority === "High") return t("high");
  if (priority === "Medium") return t("medium");
  return t("low");
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.title = t(node.dataset.i18nTitle);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll(".language-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
  });
  document.querySelectorAll(".scope-option").forEach((button) => {
    button.classList.toggle("active", button.dataset.scope === currentScope);
  });
}

function getActiveContext() {
  return currentScope === "organization" ? organizationContext : siteContexts[currentSite];
}

function applyScopeContext({ resetMetrics = false } = {}) {
  const context = getActiveContext();
  const insights = context.insights[currentLang] || context.insights.en;
  const severity = insights[8] >= 75 ? "high" : insights[8] >= 45 ? "medium" : "low";
  topbarEyebrow.textContent = currentLang === "it" ? "UrbanBuild Group - Organizzazione" : "UrbanBuild Group - Organization";
  pageHeading.textContent = t(moduleTitleKeys[activeView] || "moduleDashboard");
  siteSelector.value = currentSite;
  siteSelector.disabled = currentScope === "organization";
  scopeLabel.textContent = currentScope === "organization" ? t("organizationView") : t("siteView");
  scopeTitle.textContent = context.title;
  scopeDescription.textContent = currentScope === "organization" ? t("organizationDescription") : t("siteDescription");
  scopeSites.textContent = context.sites;
  scopeSitesStat.hidden = currentScope === "site";
  scopeSitesStat.style.display = currentScope === "site" ? "none" : "";
  scopeUsers.textContent = context.users;
  scopeModules.textContent = context.modules;
  scopeBudget.textContent = context.budget;
  timeInsightValue.textContent = insights[0];
  timeInsightText.textContent = insights[1];
  budgetInsightValue.textContent = insights[2];
  budgetInsightText.textContent = insights[3];
  forecastInsightValue.textContent = insights[4];
  forecastInsightText.textContent = insights[5];
  timeInsightBar.style.width = `${insights[6]}%`;
  budgetInsightBar.style.width = `${insights[7]}%`;
  forecastNeedle.style.left = `${insights[8]}%`;
  document.querySelectorAll(".insight-card").forEach((card) => {
    card.classList.remove("severity-low", "severity-medium", "severity-high");
    card.classList.add(`severity-${severity}`);
  });
  if (resetMetrics) {
    dynamicTaskCount = context.metrics[0];
    dynamicRiskCount = context.metrics[1];
    dynamicDocCount = context.metrics[2];
    dynamicConfidence = context.metrics[3];
  }
  updatePanelContextNotes();
}

function updatePanelContextNotes() {
  document.querySelectorAll(".panel-context-note").forEach((node) => node.remove());
}

function resetTranslatedData() {
  const data = getDataset();
  activities = data.activities.map(mapActivity);
  tasks = data.tasks.map(mapTask);
  documents = data.documents.map(mapDocument);
  wbsItems = data.wbs.map((item) => [...item.slice(0, 6), item[6].map((subitem) => [...subitem])]);
}

function renderActivities() {
  activityFeed.innerHTML = activities
    .map(
      (item) => `
        <div class="activity-item">
          <span class="activity-icon">${item.icon}</span>
          <div>
            <strong>${item.title}</strong>
            <span>${item.detail}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderTasks() {
  const columns = ["Open", "In progress", "Done"];
  const scopedTasks = getScopedTasks();
  taskBoard.innerHTML = columns
    .map((column) => {
      const cards = scopedTasks
        .filter((task) => task.status === column)
        .map(
          (task) => `
            <article class="task-card">
              <strong>${task.title}</strong>
              <p>${task.detail}</p>
              <div class="task-audit">
                <span><b>${t("taskCreatedBy")}</b>${task.createdBy}</span>
                <span><b>${t("taskAssignedTo")}</b>${task.assignedTo}</span>
                <span><b>${t("taskTiming")}</b>${task.timing}</span>
                <span><b>${t("taskDue")}</b>${task.due}</span>
              </div>
              <div class="task-meta">
                <span>${task.owner}</span>
                <span class="priority-pill priority-${task.priority.toLowerCase()}">${priorityLabel(task.priority)}</span>
              </div>
            </article>
          `,
        )
        .join("");

      return `
        <section class="task-column">
          <h3>${statusLabel(column)}</h3>
          ${cards}
        </section>
      `;
    })
    .join("");
}

function renderDocuments() {
  documentList.innerHTML = getScopedDocuments()
    .map(
      (document, index) => `
        <article class="doc-row">
          <span class="doc-icon">${document.icon}</span>
          <div>
            <strong>${document.title}</strong>
            <span>${document.detail}</span>
            <div class="doc-version-history">
              <button class="doc-history-toggle" type="button" data-doc-index="${index}">${t("docHistory")}</button>
              <div class="doc-history-list" data-history-index="${index}">
                ${document.history
                  .map(
                    (item) => `
                      <div class="doc-audit-item">
                        <span>${item[0]}</span>
                        <strong>${item[3]}</strong>
                        <p>${item[4]}</p>
                        <em>${t("docAuditUser")}: ${item[1]} - ${t("docAuditRole")}: ${item[2]}</em>
                      </div>
                    `,
                  )
                  .join("")}
              </div>
            </div>
          </div>
          <div class="doc-meta-stack">
            <span class="doc-type">${document.type}</span>
            <span class="doc-version">${t("docVersion")} ${document.version}</span>
            <span class="doc-status">${document.status}</span>
          </div>
        </article>
      `,
    )
    .join("");
  documentList.querySelectorAll(".doc-history-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const history = documentList.querySelector(`[data-history-index="${button.dataset.docIndex}"]`);
      history.classList.toggle("open");
    });
  });
}

function renderReports() {
  const reports =
    currentScope === "organization"
      ? currentLang === "it"
        ? [
            ["Portfolio", "Roma Ostiense richiede escalation", "Scostamento tempi e budget superiore alla soglia organizzazione."],
            ["Direzione", "Torino Lingotto compensa parte del rischio", "Cantiere in anticipo di 2 giorni e sotto budget di 1,1%."],
            ["Governance", "Standardizzare controlli QA", "Milano e Roma mostrano blocchi ricorrenti su validazioni e ispezioni."],
          ]
        : [
            ["Portfolio", "Roma Ostiense requires escalation", "Schedule and budget variance exceed organization threshold."],
            ["Executive", "Torino Lingotto offsets part of the risk", "Site is 2 days ahead and 1.1% under budget."],
            ["Governance", "Standardize QA controls", "Milan and Rome show recurring approval and inspection blockers."],
          ]
      : getDataset().reports.map((report) => [report[0], `${contextTitle()} - ${report[1]}`, report[2]]);
  reportGrid.innerHTML = reports
    .map(
      (report) => `
        <article>
          <span>${report[0]}</span>
          <strong>${report[1]}</strong>
          <p>${report[2]}</p>
        </article>
      `,
    )
    .join("");
}

function renderTeam() {
  teamList.innerHTML = teamMembers
    .map(
      (member) => `
        <article class="team-row">
          <div>
            <strong>${member[0]}</strong>
            <span>${member[1]}</span>
          </div>
          <span>${member[2]}</span>
          <em>${member[3]}</em>
        </article>
      `,
    )
    .join("");
}

function renderBoq() {
  const rows = getScopedBoqRows();
  boqTable.innerHTML = `
    <div class="boq-row boq-head">
      <span>${t("boqCategory")}</span>
      <span>${t("boqDescription")}</span>
      <span>${t("boqQuantity")}</span>
      <span>${t("boqBudget")}</span>
      <span>${t("boqZone")}</span>
    </div>
    ${rows
      .map(
        (row) => `
          <div class="boq-row">
            <strong>${row[0]}</strong>
            <span>${row[1]}</span>
            <span>${row[2]}</span>
            <span>${row[3]}</span>
            <span>${row[4]}</span>
          </div>
        `,
      )
      .join("")}
  `;
}

function renderSchedule() {
  const context = getActiveContext();
  totalBudget.textContent = context.budget;
  duration.textContent = currentScope === "organization" ? (currentLang === "it" ? "12 mesi" : "12 months") : currentLang === "it" ? "34 settimane" : "34 weeks";
  contingency.textContent = "7.5%";
  scheduleTimeline.innerHTML = getScopedScheduleRows()
    .map(
      (phase) => `
        <div class="schedule-phase">
          <div class="phase-top">
            <span>${phase[0]}</span>
            <strong>${phase[1]}</strong>
            <em>${phase[2]} - ${phase[3]}</em>
          </div>
          <div class="phase-bar"><i style="width: ${phase[4]}%"></i></div>
        </div>
      `,
    )
    .join("");
  budgetBreakdown.innerHTML = getDataset().budget
    .map(
      (item) => `
        <div class="budget-row">
          <strong>${item[0]}</strong>
          <span>${item[1]}</span>
          <em>${item[2]}</em>
        </div>
      `,
    )
    .join("");
  renderWbs();
}

function renderWbs() {
  if (currentScope === "organization") {
    wbsItems = (currentLang === "it"
      ? [
          ["1.0", "Governance portfolio", "12m", getActiveContext().budget, "Direzione", "-", [["1.1", "Milano Porta Nuova", "34s", "PM Milano"], ["1.2", "Torino Lingotto", "28s", "PM Torino"], ["1.3", "Roma Ostiense", "41s", "PM Roma"]]],
          ["2.0", "Controllo budget portfolio", "mensile", "EUR 18,4M", "CFO", "1.0", [["2.1", "Forecast costi", "1m", "CFO"], ["2.2", "Contingenza", "1m", "Direzione"]]],
        ]
      : [
          ["1.0", "Portfolio governance", "12m", getActiveContext().budget, "Executive", "-", [["1.1", "Milano Porta Nuova", "34w", "Milan PM"], ["1.2", "Torino Lingotto", "28w", "Turin PM"], ["1.3", "Roma Ostiense", "41w", "Rome PM"]]],
          ["2.0", "Portfolio budget control", "monthly", "EUR 18.4M", "CFO", "1.0", [["2.1", "Cost forecast", "1m", "CFO"], ["2.2", "Contingency", "1m", "Executive"]]],
        ]).map((item) => [...item.slice(0, 6), item[6].map((subitem) => [...subitem])]);
  }
  wbsBoard.innerHTML = `
    <div class="wbs-row wbs-head">
      <span></span>
      <span>${t("wbsCode")}</span>
      <span>${t("wbsActivity")}</span>
      <span>${t("wbsDuration")}</span>
      <span>${t("wbsBudget")}</span>
      <span>${t("wbsOwner")}</span>
      <span>${t("wbsDepends")}</span>
    </div>
    ${wbsItems
      .map(
        (item, index) => `
          <div class="wbs-group" data-index="${index}">
            <div class="wbs-row wbs-parent" draggable="true" data-index="${index}">
              <button class="drag-handle" type="button" aria-label="Drag WBS item">::</button>
              <input value="${item[0]}" data-field="0" aria-label="${t("wbsCode")}" />
              <input value="${item[1]}" data-field="1" aria-label="${t("wbsActivity")}" />
              <input value="${item[2]}" data-field="2" aria-label="${t("wbsDuration")}" />
              <input value="${item[3]}" data-field="3" aria-label="${t("wbsBudget")}" />
              <input value="${item[4]}" data-field="4" aria-label="${t("wbsOwner")}" />
              <input value="${item[5]}" data-field="5" aria-label="${t("wbsDepends")}" />
            </div>
            <div class="wbs-subactions">
              <div class="wbs-subtitle">${t("wbsSubactions")}</div>
              ${item[6]
                .map(
                  (subitem, subIndex) => `
                    <div class="wbs-subrow" draggable="true" data-index="${index}" data-sub-index="${subIndex}">
                      <button class="sub-drag-handle" type="button" aria-label="Drag sub-action">::</button>
                      <input value="${subitem[0]}" data-sub-field="0" aria-label="${t("wbsCode")}" />
                      <input value="${subitem[1]}" data-sub-field="1" aria-label="${t("wbsActivity")}" />
                      <input value="${subitem[2]}" data-sub-field="2" aria-label="${t("wbsDuration")}" />
                      <input value="${subitem[3]}" data-sub-field="3" aria-label="${t("wbsOwner")}" />
                    </div>
                  `,
                )
                .join("")}
              <button class="add-subaction-button" type="button" data-index="${index}">${t("addSubaction")}</button>
            </div>
          </div>
        `,
      )
      .join("")}
  `;
  bindWbsEvents();
}

function bindWbsEvents() {
  wbsBoard.querySelectorAll(".wbs-row:not(.wbs-head)").forEach((row) => {
    row.addEventListener("dragstart", () => {
      draggedWbsIndex = Number(row.dataset.index);
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      draggedWbsIndex = null;
      row.classList.remove("dragging");
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drag-over");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("drag-over");
      const targetIndex = Number(row.dataset.index);
      if (draggedWbsIndex === null || draggedWbsIndex === targetIndex) return;
      const [moved] = wbsItems.splice(draggedWbsIndex, 1);
      wbsItems.splice(targetIndex, 0, moved);
      renderWbs();
    });
    row.querySelectorAll("input").forEach((input) => {
      const syncInput = () => {
        wbsItems[Number(row.dataset.index)][Number(input.dataset.field)] = input.value;
      };
      input.addEventListener("input", syncInput);
      input.addEventListener("change", syncInput);
    });
  });
  wbsBoard.querySelectorAll(".wbs-subrow").forEach((row) => {
    row.addEventListener("dragstart", () => {
      draggedSubaction = {
        parentIndex: Number(row.dataset.index),
        subIndex: Number(row.dataset.subIndex),
      };
      row.classList.add("dragging");
    });
    row.addEventListener("dragend", () => {
      draggedSubaction = null;
      row.classList.remove("dragging");
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      row.classList.add("drag-over");
    });
    row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
    row.addEventListener("drop", (event) => {
      event.preventDefault();
      row.classList.remove("drag-over");
      const targetParentIndex = Number(row.dataset.index);
      const targetSubIndex = Number(row.dataset.subIndex);
      if (!draggedSubaction || draggedSubaction.parentIndex !== targetParentIndex || draggedSubaction.subIndex === targetSubIndex) return;
      const subactions = wbsItems[targetParentIndex][6];
      const [moved] = subactions.splice(draggedSubaction.subIndex, 1);
      subactions.splice(targetSubIndex, 0, moved);
      renderWbs();
    });
    row.querySelectorAll("input").forEach((input) => {
      const syncInput = () => {
        wbsItems[Number(row.dataset.index)][6][Number(row.dataset.subIndex)][Number(input.dataset.subField)] = input.value;
      };
      input.addEventListener("input", syncInput);
      input.addEventListener("change", syncInput);
    });
  });
  wbsBoard.querySelectorAll(".add-subaction-button").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const parentCode = wbsItems[index][0] || `${index + 1}.0`;
      const nextNumber = wbsItems[index][6].length + 1;
      wbsItems[index][6].push([
        `${parentCode.split(".")[0]}.${nextNumber}`,
        currentLang === "it" ? "Nuova sotto-azione" : "New sub-action",
        currentLang === "it" ? "1g" : "1d",
        currentLang === "it" ? "Da assegnare" : "Unassigned",
      ]);
      renderWbs();
    });
  });
}

function clearChat() {
  chatMessages.innerHTML = "";
  getDataset().chat.forEach((message) => {
    addMessage({ role: message[0], author: message[1], text: message[2], media: message[3] });
  });
}

function addMessage(message) {
  const bubble = document.createElement("article");
  bubble.className = `bubble ${message.role}`;
  bubble.innerHTML = `
    ${message.media ? `<div class="media-preview">${message.media}</div>` : ""}
    <strong>${message.author}</strong>
    <p>${message.text}</p>
    <small>${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</small>
  `;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderMetrics() {
  taskCount.textContent = dynamicTaskCount;
  riskCount.textContent = dynamicRiskCount;
  docCount.textContent = dynamicDocCount;
  confidence.textContent = `${dynamicConfidence}%`;
}

function bumpMetrics(kind) {
  dynamicTaskCount += 1;
  if (kind === "photo" || kind === "voice") {
    dynamicRiskCount += 1;
    dynamicConfidence -= 1;
  }
  if (kind === "document" || kind === "video") {
    dynamicDocCount += 1;
  }
  renderMetrics();
}

function processFieldUpdate(kind, text) {
  const capture = getDataset().quickCaptures[kind];
  const fieldMessage = capture
    ? { author: capture[0], text: capture[1], media: capture[2], ai: capture[3] }
    : { author: t("you"), text, ai: getDataset().messageAi };

  addMessage({ role: "field", ...fieldMessage });

  window.setTimeout(() => {
    addMessage({
      role: "ai",
      author: t("aiAuthor"),
      text: fieldMessage.ai,
    });

    activities.unshift({
      icon: kind === "photo" ? "PH" : kind === "voice" ? "VO" : kind === "video" ? "VI" : "DC",
      title: t("newInteractionTitle"),
      detail: fieldMessage.ai,
    });

    tasks.unshift({
      status: "Open",
      title: text ? t("reviewFieldUpdate") : t("generatedAction"),
      detail: fieldMessage.ai,
      owner: kind === "document" ? t("documentController") : t("siteManager"),
      priority: kind === "photo" || kind === "voice" ? "High" : "Medium",
      createdBy: fieldMessage.author,
      assignedTo: kind === "document" ? t("documentController") : t("siteManager"),
      timing: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
      due: currentLang === "it" ? "Da pianificare" : "To schedule",
    });

    if (kind === "document" || kind === "video") {
      documents.unshift({
        icon: kind === "video" ? "VID" : "PDF",
        title: kind === "video" ? (currentLang === "it" ? "Nuovo media walkthrough" : "New site walkthrough media") : currentLang === "it" ? "Nuovo documento cantiere" : "New uploaded site document",
        detail: fieldMessage.ai,
        type: kind === "video" ? "Media" : "Inbox",
        version: "v0.1",
        status: currentLang === "it" ? "Da revisionare" : "To review",
        history: [
          [
            new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
            currentLang === "it" ? "Utente campo" : "Field user",
            currentLang === "it" ? "Squadra cantiere" : "Field crew",
            currentLang === "it" ? "Caricato" : "Uploaded",
            currentLang === "it" ? "Documento creato da interazione campo" : "Document created from field interaction",
          ],
        ],
      });
    }

    bumpMetrics(kind);
    renderActivities();
    renderTasks();
    renderDocuments();
  }, 650);
}

function renderAll({ resetData = false, resetChat = false } = {}) {
  applyTranslations();
  applyScopeContext({ resetMetrics: resetData });
  if (resetData) resetTranslatedData();
  renderMetrics();
  renderActivities();
  renderTasks();
  renderDocuments();
  renderReports();
  renderTeam();
  renderBoq();
  renderSchedule();
  if (boqStatus) {
    boqStatus.textContent = boqImported ? t("boqComplete") : t("boqReady");
  }
  if (resetChat) clearChat();
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    document.querySelectorAll(".nav-item").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll(".dashboard-panel").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.panel !== button.dataset.view);
    });
    applyScopeContext();
  });
});

document.querySelectorAll(".language-option").forEach((button) => {
  button.addEventListener("click", () => {
    currentLang = button.dataset.lang;
    localStorage.setItem("sitepulseai-lang", currentLang);
    renderAll({ resetData: true, resetChat: true });
  });
});

document.querySelectorAll(".scope-option").forEach((button) => {
  button.addEventListener("click", () => {
    currentScope = button.dataset.scope;
    localStorage.setItem("sitepulseai-scope", currentScope);
    renderAll({ resetData: true, resetChat: true });
  });
});

siteSelector.addEventListener("change", () => {
  currentSite = siteSelector.value;
  currentScope = "site";
  localStorage.setItem("sitepulseai-site", currentSite);
  localStorage.setItem("sitepulseai-scope", currentScope);
  renderAll({ resetData: true, resetChat: true });
});

document.querySelectorAll(".capture-button").forEach((button) => {
  button.addEventListener("click", () => processFieldUpdate(button.dataset.kind));
});

function simulateBoqImport() {
  boqImported = false;
  boqStatus.textContent = t("boqProcessing");
  boqStatus.classList.add("processing");
  window.setTimeout(() => {
    boqImported = true;
    boqStatus.textContent = t("boqComplete");
    boqStatus.classList.remove("processing");
    boqStatus.classList.add("complete");
    activities.unshift({
      icon: "BO",
      title: currentLang === "it" ? "Computo importato e strutturato" : "BoQ imported and structured",
      detail: currentLang === "it" ? "AI ha generato cronoprogramma, budget per categoria e alert su contingenza." : "AI generated schedule, budget by trade and contingency alerts.",
    });
    dynamicDocCount += 1;
    renderMetrics();
    renderActivities();
    renderBoq();
    renderSchedule();
  }, 850);
}

document.querySelector("#importBoqButton").addEventListener("click", simulateBoqImport);
document.querySelector("#generateScheduleButton").addEventListener("click", simulateBoqImport);
document.querySelector("#addWbsButton").addEventListener("click", () => {
  wbsItems.push([
    `${wbsItems.length + 1}.0`,
    currentLang === "it" ? "Nuova attivita WBS" : "New WBS activity",
    currentLang === "it" ? "1s" : "1w",
    "EUR 0,00M",
    currentLang === "it" ? "Da assegnare" : "Unassigned",
    "-",
    [],
  ]);
  renderWbs();
});

document.querySelector("#createSiteButton").addEventListener("click", () => {
  const siteName = document.querySelector("#newSiteName").value.trim();
  const siteBudget = document.querySelector("#newSiteBudget").value.trim();
  const siteAdmin = document.querySelector("#newSiteAdmin").value.trim();
  if (!siteName) return;
  teamMembers.unshift([siteAdmin || "Admin", "Site administrator", siteName, currentLang === "it" ? "Amministratore cantiere" : "Site administrator"]);
  const option = document.createElement("option");
  option.value = siteName.toLowerCase().replaceAll(" ", "-");
  option.textContent = siteName;
  siteSelector.appendChild(option);
  activities.unshift({
    icon: "ST",
    title: currentLang === "it" ? "Nuovo cantiere creato" : "New site created",
    detail: `${siteName} - ${siteBudget}`,
  });
  renderTeam();
  renderActivities();
});

document.querySelector("#createMemberButton").addEventListener("click", () => {
  const name = document.querySelector("#newMemberName").value.trim();
  const role = document.querySelector("#newMemberRole").value;
  const site = document.querySelector("#newMemberSite").value;
  if (!name) return;
  teamMembers.unshift([name, role, site, role]);
  renderTeam();
});

document.querySelector("#chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#messageInput");
  const text = input.value.trim();
  if (!text) return;
  input.value = "";
  processFieldUpdate("message", text);
});

renderAll({ resetData: true, resetChat: true });
