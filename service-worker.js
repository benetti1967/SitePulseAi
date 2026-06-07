const CACHE_VERSION = "sitepulseai-v1";
const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/assets/sitepulse.css",
  "/assets/sitepulse-app.js",
  "/assets/icon-192.svg",
  "/assets/icon-512.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  const cache = await caches.open(CACHE_VERSION);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_VERSION);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw error;
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (sameOrigin && APP_SHELL.includes(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  if (sameOrigin && request.mode === "navigate") {
    event.respondWith(networkFirst(new Request(new URL("/index.html", self.location.origin), { headers: request.headers })));
    return;
  }

  if (url.pathname.startsWith("/api/") || url.hostname.includes("workers.dev")) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (sameOrigin) event.respondWith(networkFirst(request));
});

self.addEventListener("sync", (event) => {
  if (event.tag === "sitepulseai-outbox-sync") {
    event.waitUntil(
      self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => client.postMessage({ type: "SYNC_OUTBOX" }));
      }),
    );
  }
});
