const DB_NAME = "sitepulseai-mobile";
const DB_VERSION = 3;
const STORES = {
  queue: "offlineQueue",
  messages: "messages",
  settings: "settings",
};
const API_BASE = window.SITEPULSE_MOBILE_CONFIG?.apiBase || "";
const LEGACY_SITE_IDS = {
  "porta-nuova": "site_porta_nuova",
  "green-offices": "site_lambrate",
  "hotel-aurora": "site_aurora",
  "logistica-nord": "site_nord_hub",
};

const DEFAULT_SITES = [
  {
    id: "site_porta_nuova",
    name: "Residenza Porta Nuova",
    area: "Blocco B - piano 2",
    wbs: ["1.2 Isolamento Blocco B", "1.3 Impianto elettrico piano 2", "3.4 Facciata nord"],
  },
  {
    id: "site_lambrate",
    name: "Green Offices Lambrate",
    area: "Facciata sud",
    wbs: ["2.1 Chiusura cartongessi", "2.4 Pannelli facciata", "4.1 Collaudi"],
  },
  {
    id: "site_aurora",
    name: "Hotel Aurora Renovation",
    area: "Piano 3",
    wbs: ["1.1 Demolizioni", "3.4 Facciata nord", "5.2 Finiture camere"],
  },
  {
    id: "site_nord_hub",
    name: "Logistica Nord Hub",
    area: "Area logistica ingresso",
    wbs: ["Setup cantiere", "1.1 Tracciamenti", "2.2 Piazzali"],
  },
];

const seedMessages = [
  { siteId: "site_porta_nuova", author: "Luca F.", body: "Foto e vocale: manca isolamento termico nel piano 2. Ho lasciato i dettagli.", type: "field", time: "10:42", synced: true },
  { siteId: "site_porta_nuova", author: "SitePulseAi AI", body: "Creo issue e assegno a Marco R. con scadenza domani. Collegamento WBS: 1.2 Isolamento Blocco B.", type: "ai", time: "10:43", synced: true },
  { siteId: "site_porta_nuova", author: "Marco R.", body: "Ricevuto. Verifico con fornitore entro pranzo.", type: "field", time: "10:47", synced: true },
  { siteId: "site_lambrate", author: "Sara M.", body: "Consegna pannelli in ritardo. Allego nota vocale del fornitore.", type: "field", time: "09:18", synced: true },
];

const seedTasks = [
  { siteId: "site_porta_nuova", title: "Isolamento mancante Blocco B", meta: "Marco R. - scade domani 12:00", status: "In carico", priority: "Alta", impact: "Tempi +3g, extra costo EUR 1.200" },
  { siteId: "site_porta_nuova", title: "Validare variante impianto elettrico", meta: "Anna S. - scade 03 giu 18:00", status: "In lavorazione", priority: "Media", impact: "Budget +EUR 6.800" },
  { siteId: "site_lambrate", title: "Ritardo consegna pannelli facciata", meta: "AluSystem - scade oggi 17:00", status: "Bloccato", priority: "Alta", impact: "Forecast +4g" },
  { siteId: "site_aurora", title: "Caricare evidenze chiusura facciata nord", meta: "DL - scade 02 giu 10:00", status: "Validazione", priority: "Bassa", impact: "Nessun impatto forecast" },
];

let db;
let sites = [...DEFAULT_SITES];
let selectedFile;
let imageObjectUrl;
let currentSiteId = "site_porta_nuova";
let deviceId = "";
let apiSessionMode = "offline_demo";
let currentUser = {
  name: "Paola Manager",
  initials: "PM",
  email: "pm.demo@sitepulseai.com",
  role: "Project Manager",
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const nowTime = () => new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
const currentSite = () => sites.find((site) => site.id === currentSiteId) || sites[0];

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      Object.values(STORES).forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) {
          database.createObjectStore(storeName, { keyPath: "id" });
        }
      });

      [STORES.messages, STORES.queue].forEach((storeName) => {
        if (!database.objectStoreNames.contains(storeName)) return;
        const store = request.transaction.objectStore(storeName);
        store.openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (!cursor) return;
          const record = cursor.value;
          const migratedSiteId = LEGACY_SITE_IDS[record.siteId];
          if (migratedSiteId) cursor.update({ ...record, siteId: migratedSiteId });
          cursor.continue();
        };
      });

      if (database.objectStoreNames.contains(STORES.settings)) {
        const settings = request.transaction.objectStore(STORES.settings);
        settings.get("currentSiteId").onsuccess = (event) => {
          const record = event.target.result;
          const migratedSiteId = LEGACY_SITE_IDS[record?.value];
          if (migratedSiteId) settings.put({ id: "currentSiteId", value: migratedSiteId });
        };
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function tx(storeName, mode = "readonly") {
  return db.transaction(storeName, mode).objectStore(storeName);
}

function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function get(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName).get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function put(storeName, record) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName, "readwrite").put(record);
    request.onsuccess = () => resolve(record);
    request.onerror = () => reject(request.error);
  });
}

function remove(storeName, id) {
  return new Promise((resolve, reject) => {
    const request = tx(storeName, "readwrite").delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

async function getSetting(id) {
  return new Promise((resolve, reject) => {
    const request = tx(STORES.settings).get(id);
    request.onsuccess = () => resolve(request.result?.value);
    request.onerror = () => reject(request.error);
  });
}

function setSetting(id, value) {
  return put(STORES.settings, { id, value });
}

function isLocalPreview() {
  return ["127.0.0.1", "localhost"].includes(window.location.hostname);
}

function apiHeaders(extra = {}, demoEmail = currentUser.email) {
  const headers = { ...extra };
  if (isLocalPreview() && window.SITEPULSE_MOBILE_CONFIG?.demoAuth === true && demoEmail) {
    headers["x-sitepulse-demo-user"] = demoEmail;
  }
  return headers;
}

async function apiFetch(path, options = {}, demoEmail) {
  if (!API_BASE) throw new Error("API non configurata");
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      credentials: "include",
      ...options,
      headers: apiHeaders(options.headers || {}, demoEmail),
    });
  } catch {
    throw new Error("Backend non raggiungibile o origine non autorizzata");
  }
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.message || `API non disponibile (${response.status})`);
    error.code = payload.error || `http_${response.status}`;
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function ensureDeviceId() {
  const saved = await getSetting("deviceId");
  if (saved) return saved;
  const generated = crypto.randomUUID();
  await setSetting("deviceId", generated);
  return generated;
}

function mergeApiSites(apiSites) {
  const defaults = new Map(DEFAULT_SITES.map((site) => [site.id, site]));
  return apiSites.map((site) => ({
    ...(defaults.get(site.id) || {}),
    id: site.id,
    name: site.name,
    area: defaults.get(site.id)?.area || site.phase || site.location || "Area da selezionare",
    wbs: defaults.get(site.id)?.wbs || ["WBS da assegnare"],
  }));
}

async function loadBackendSession(email) {
  const session = await apiFetch("/api/me", {}, email);
  const sitePayload = await apiFetch("/api/sites", {}, email);
  const remoteSites = Array.isArray(sitePayload.data) ? sitePayload.data : [];
  if (remoteSites.length) sites = mergeApiSites(remoteSites);
  if (!sites.some((site) => site.id === currentSiteId)) currentSiteId = sites[0]?.id || currentSiteId;

  const roleNames = (session.roles || []).map((role) => role.role_name || role.name).filter(Boolean);
  currentUser = {
    name: session.user?.full_name || session.user?.name || email.split("@")[0],
    initials: initialsFrom(email, roleNames[0] || "Project Manager"),
    email: session.user?.email || email,
    role: roleNames.join(", ") || "Utente",
    authMode: session.auth_mode || "cloudflare_access",
  };
  apiSessionMode = "backend";
  await setSetting("currentUser", currentUser);
  await setSetting("currentSiteId", currentSiteId);
  return session;
}

async function ensureSeedData() {
  const existing = await getAll(STORES.messages);
  if (existing.length) return;
  for (const message of seedMessages) {
    await put(STORES.messages, { id: crypto.randomUUID(), createdAt: Date.now(), ...message });
  }
}

async function getQueued() {
  const items = await getAll(STORES.queue);
  return items.sort((a, b) => b.createdAt - a.createdAt);
}

async function getMessagesForSite() {
  const items = await getAll(STORES.messages);
  return items
    .filter((message) => message.siteId === currentSiteId)
    .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

function initialsFrom(email, role) {
  if (role === "Capocantiere") return "CP";
  if (role === "Fornitore") return "FO";
  if (role === "Direzione lavori") return "DL";
  return email?.slice(0, 2).toUpperCase() || "PM";
}

function setConnectionState() {
  const pill = $("#connectionState");
  const online = navigator.onLine;
  pill.textContent = !online ? "Offline" : apiSessionMode === "backend" ? "Online - backend" : "Demo locale";
  pill.classList.toggle("offline", !online);
  pill.title = apiSessionMode === "backend"
    ? "Sessione verificata dal backend SitePulseAi"
    : "I dati restano locali finche il backend non autentica la sessione";
}

function renderSiteSelectors() {
  $("#siteSelect").innerHTML = sites.map((site) => `<option value="${site.id}">${site.name}</option>`).join("");
  $("#siteSelect").value = currentSiteId;
  $(".app-header h1").textContent = currentSite().name;
  $("#drawerSite").textContent = currentSite().name;
  renderWbsOptions();
}

function renderWbsOptions() {
  const site = currentSite();
  $("#areaInput").value = site.area;
  $("#wbsInput").innerHTML = site.wbs.map((wbs) => `<option>${wbs}</option>`).join("");
}

async function renderMessages() {
  const container = $("#messages");
  const messages = await getMessagesForSite();
  container.innerHTML = messages
    .map((message) => {
      const mine = message.author === currentUser.name;
      const syncBadge = message.synced ? "" : `<span class="mini-sync">offline</span>`;
      return `
        <article class="message ${mine ? "mine" : ""} ${message.type === "ai" ? "ai" : ""}">
          <strong>${message.author} ${syncBadge}</strong>
          <p>${message.body}</p>
          <small>${currentSite().name} - ${message.time}</small>
        </article>
      `;
    })
    .join("");
  container.lastElementChild?.scrollIntoView({ block: "end" });
}

async function renderQueue() {
  const items = await getQueued();
  $("#queueCount").textContent = items.length;
  $("#drawerSync").textContent = `${items.length} elementi in coda`;
  $("#queueList").innerHTML = items.length
    ? items
        .map((item) => {
          const title = item.kind === "MESSAGE" ? "Messaggio chat" : item.fileName || item.kind;
          const detail = item.kind === "MESSAGE" ? item.payload.body : item.note || "Nessuna nota";
          const size = item.fileSize ? ` - ${(item.fileSize / 1024 / 1024).toFixed(1)} MB` : "";
          const error = item.lastError ? `<small class="sync-error">${item.lastError}</small>` : "";
          return `
            <article class="queue-item">
              <div class="row">
                <strong>${title}</strong>
                <span class="badge ${item.status === "sincronizzazione" ? "" : "warn"}">${item.status}</span>
              </div>
              <span class="muted">${item.siteName} - ${item.area || "Chat cantiere"}${size}</span>
              <span>${detail}</span>
              ${error}
              <div class="row">
                <small class="muted">${new Date(item.createdAt).toLocaleString("it-IT")}</small>
                <button class="primary" type="button" data-sync-id="${item.id}" ${item.status === "sincronizzazione" ? "disabled" : ""}>Sincronizza</button>
              </div>
            </article>
          `;
        })
        .join("")
    : `<div class="empty">Nessun elemento in coda offline.</div>`;
}

function renderTasks() {
  const tasks = seedTasks.filter((task) => task.siteId === currentSiteId);
  $("#taskList").innerHTML = tasks.length
    ? tasks
        .map(
          (task) => `
            <article class="task-item">
              <div class="row">
                <strong>${task.title}</strong>
                <span class="badge ${task.priority === "Alta" ? "danger" : "warn"}">${task.priority}</span>
              </div>
              <span class="muted">${task.meta}</span>
              <div class="row">
                <span class="badge">${task.status}</span>
                <span class="muted">${task.impact}</span>
              </div>
            </article>
          `
        )
        .join("")
    : `<div class="empty">Nessuna azione aperta per questo cantiere.</div>`;
}

function renderProfile() {
  $("#profileButton").textContent = currentUser.initials;
  $("#drawerAvatar").textContent = currentUser.initials;
  $("#drawerName").textContent = currentUser.name;
  $("#drawerRole").textContent = currentUser.role;
  $("#drawerEmail").textContent = currentUser.email;
}

function switchTab(tabName) {
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === tabName));
  $$(".view").forEach((view) => view.classList.remove("active"));
  $(`#${tabName}View`).classList.add("active");
}

function inferAiSuggestion(file) {
  const extension = file?.name?.split(".").pop()?.toLowerCase() || "";
  if (file?.type?.startsWith("image/")) return "Rilevata foto: propongo collegamento a sopralluogo e possibile issue se contiene difetto.";
  if (file?.type?.startsWith("audio/")) return "Rilevato vocale: preparo trascrizione, sintesi e proposta task.";
  if (file?.type?.startsWith("video/")) return "Rilevato video: estraggo frame chiave e proposta evidenza.";
  if (["pdf", "doc", "docx", "xls", "xlsx"].includes(extension)) return "Rilevato documento: preparo classificazione, versione e workflow PM.";
  return "Dopo l'upload propongo collegamento, task o issue.";
}

function createQueueRecord(kind, payload) {
  const eventPayload = { ...payload };
  delete eventPayload.file;
  return {
    id: crypto.randomUUID(),
    kind,
    siteId: currentSiteId,
    siteName: currentSite().name,
    user: currentUser,
    status: navigator.onLine ? "pronto sync" : "offline",
    createdAt: Date.now(),
    payload: eventPayload,
    ...payload,
  };
}

async function postOfflineEvent(item) {
  return apiFetch("/api/offline-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      events: [{
        device_id: deviceId,
        client_event_id: item.id,
        event_type: item.kind.toLowerCase(),
        site_id: item.siteId,
        payload: item.payload,
        captured_at: new Date(item.createdAt).toISOString(),
      }],
    }),
  });
}

async function uploadMedia(item) {
  if (!item.file || typeof item.file.size !== "number") {
    throw new Error("File locale non disponibile: ripeti la selezione");
  }
  const form = new FormData();
  form.append("file", item.file, item.fileName || "media-file");
  form.append("site_id", item.siteId);
  form.append("area", item.area || "");
  form.append("wbs", item.wbs || "");
  form.append("note", item.note || "");
  form.append("ai_summary", item.aiSuggestion || "");
  form.append("captured_at", new Date(item.createdAt).toISOString());
  form.append("device_id", deviceId);
  form.append("client_event_id", item.id);
  return apiFetch("/api/media/upload", {
    method: "POST",
    body: form,
  });
}

async function syncItem(id) {
  const items = await getQueued();
  const item = items.find((queued) => queued.id === id);
  if (!item) return;
  if (!navigator.onLine) {
    alert("Sei offline: l'elemento resta in coda.");
    return;
  }
  try {
    item.status = "sincronizzazione";
    item.lastError = "";
    item.attempts = Number(item.attempts || 0) + 1;
    await put(STORES.queue, item);
    await renderQueue();
    const result = item.kind === "UPLOAD" ? await uploadMedia(item) : await postOfflineEvent(item);
    await remove(STORES.queue, id);
    if (item.messageId) {
      const originalMessage = await get(STORES.messages, item.messageId);
      if (originalMessage) await put(STORES.messages, { ...originalMessage, synced: true });
    }
    await put(STORES.messages, {
      id: crypto.randomUUID(),
      siteId: item.siteId,
      author: "SitePulseAi AI",
      body: item.kind === "MESSAGE"
        ? "Messaggio sincronizzato e indicizzato."
        : `Upload salvato in archivio: ${item.fileName}. ID ${result.data?.id || "registrato"}. Propongo collegamento a ${item.wbs}.`,
      type: "ai",
      time: nowTime(),
      synced: true,
      createdAt: Date.now(),
    });
  } catch (error) {
    item.status = "da riprovare";
    item.lastError = error.status === 401
      ? "Sessione non autenticata sul backend"
      : error.status === 403
        ? "Utente non abilitato per questo cantiere"
        : error.message;
    if (!error.status) {
      apiSessionMode = "offline_demo";
      setConnectionState();
    }
    await put(STORES.queue, item);
  }
  await renderMessages();
  await renderQueue();
}

async function syncAll() {
  const items = await getQueued();
  if (!items.length) return;
  if (!navigator.onLine) {
    alert("Sei offline: sincronizzazione rimandata.");
    return;
  }
  for (const item of items) {
    await syncItem(item.id);
  }
}

function updateImagePreview(file) {
  const preview = $("#imagePreview");
  if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
  if (!file || !file.type.startsWith("image/")) {
    preview.hidden = true;
    preview.removeAttribute("src");
    return;
  }
  imageObjectUrl = URL.createObjectURL(file);
  preview.src = imageObjectUrl;
  preview.hidden = false;
}

async function refreshAll() {
  renderSiteSelectors();
  await renderMessages();
  await renderQueue();
  renderTasks();
  renderProfile();
  setConnectionState();
}

async function init() {
  db = await openDb();
  deviceId = await ensureDeviceId();
  navigator.storage?.persist?.().catch(() => {});
  await ensureSeedData();
  const savedUser = await getSetting("currentUser");
  const savedSite = await getSetting("currentSiteId");
  if (savedUser) currentUser = savedUser;
  if (savedSite) currentSiteId = savedSite;
  apiSessionMode = savedUser?.authMode && savedUser.authMode !== "offline_demo" ? "backend" : "offline_demo";
  $("#loginScreen").classList.toggle("hidden", Boolean(savedUser));
  await refreshAll();

  if (savedUser && navigator.onLine) {
    loadBackendSession(savedUser.email)
      .then(refreshAll)
      .catch(() => {
        apiSessionMode = "offline_demo";
        setConnectionState();
      });
  }

  $$(".tab").forEach((tab) => tab.addEventListener("click", () => switchTab(tab.dataset.tab)));
  $("#openCapture").addEventListener("click", () => switchTab("capture"));
  $("#syncNow").addEventListener("click", syncAll);
  $("#syncAllButton").addEventListener("click", syncAll);
  $("#profileButton").addEventListener("click", () => $("#profileDrawer").classList.add("open"));
  $("#closeProfile").addEventListener("click", () => $("#profileDrawer").classList.remove("open"));
  $("#logoutButton").addEventListener("click", async () => {
    await remove(STORES.settings, "currentUser");
    apiSessionMode = "offline_demo";
    $("#profileDrawer").classList.remove("open");
    $("#loginScreen").classList.remove("hidden");
  });

  $("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = $("#loginEmail").value.trim() || "pm.demo@sitepulseai.com";
    const role = $("#loginRole").value;
    const status = $("#loginStatus");
    status.textContent = "Verifica accesso...";
    try {
      await loadBackendSession(email);
      status.textContent = "";
    } catch (error) {
      if (!isLocalPreview() || window.SITEPULSE_MOBILE_CONFIG?.demoAuth !== true) {
        status.textContent = error.message || "Accesso non autorizzato";
        return;
      }
      currentUser = {
        name: role === "Project Manager" ? "Paola Manager" : email.split("@")[0],
        initials: initialsFrom(email, role),
        email,
        role,
        authMode: "offline_demo",
      };
      apiSessionMode = "offline_demo";
      await setSetting("currentUser", currentUser);
      status.textContent = "Modalita demo locale: i dati restano protetti sul dispositivo.";
    }
    $("#loginScreen").classList.add("hidden");
    await refreshAll();
  });

  $("#siteSelect").addEventListener("change", async (event) => {
    currentSiteId = event.target.value;
    await setSetting("currentSiteId", currentSiteId);
    await refreshAll();
  });

  $("#pickFile").addEventListener("click", () => $("#fileInput").click());
  $("#fileInput").addEventListener("change", (event) => {
    selectedFile = event.target.files?.[0];
    $("#fileName").textContent = selectedFile ? selectedFile.name : "Nessun file selezionato";
    $("#aiSuggestion").textContent = inferAiSuggestion(selectedFile);
    updateImagePreview(selectedFile);
  });

  $("#messageForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = $("#messageInput");
    const body = input.value.trim();
    if (!body) return;
    const message = {
      id: crypto.randomUUID(),
      siteId: currentSiteId,
      author: currentUser.name,
      body,
      type: "field",
      time: nowTime(),
      synced: false,
      createdAt: Date.now(),
    };
    await put(STORES.messages, message);
    await put(STORES.queue, createQueueRecord("MESSAGE", {
      body,
      area: "Chat cantiere",
      messageId: message.id,
    }));
    input.value = "";
    await renderMessages();
    await renderQueue();
  });

  $("#uploadForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Seleziona una foto, un video, un audio o un documento.");
      return;
    }
    const messageId = crypto.randomUUID();
    const record = createQueueRecord("UPLOAD", {
      file: selectedFile,
      fileName: selectedFile.name,
      fileType: selectedFile.type || "application/octet-stream",
      fileSize: selectedFile.size,
      area: $("#areaInput").value,
      wbs: $("#wbsInput").value,
      note: $("#noteInput").value.trim(),
      aiSuggestion: $("#aiSuggestion").textContent,
      messageId,
    });
    try {
      await put(STORES.queue, record);
    } catch {
      alert("Spazio offline insufficiente per questo file. Libera spazio o usa un file piu piccolo.");
      return;
    }
    await put(STORES.messages, {
      id: messageId,
      siteId: currentSiteId,
      author: currentUser.name,
      body: `Upload salvato: ${record.fileName}. ${record.note || "In attesa classificazione."}`,
      type: "field",
      time: nowTime(),
      synced: false,
      createdAt: Date.now(),
    });
    $("#noteInput").value = "";
    $("#fileInput").value = "";
    selectedFile = undefined;
    $("#fileName").textContent = "Nessun file selezionato";
    $("#aiSuggestion").textContent = "Elemento salvato in coda. Sincronizza quando torna rete.";
    updateImagePreview();
    await renderMessages();
    await renderQueue();
    switchTab("queue");
  });

  $("#queueList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-sync-id]");
    if (button) syncItem(button.dataset.syncId);
  });

  window.addEventListener("online", () => {
    setConnectionState();
    syncAll();
  });
  window.addEventListener("offline", setConnectionState);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./mobile-sw.js", { scope: "./", updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  }
}

init().catch((error) => {
  console.error(error);
  alert("Errore avvio app mobile.");
});
