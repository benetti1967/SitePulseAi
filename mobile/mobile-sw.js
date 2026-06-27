const CACHE_NAME = "sitepulseai-mobile-v7";
const APP_SHELL = [
  "/mobile/index.html",
  "/mobile/mobile.css",
  "/mobile/mobile.js",
  "/mobile/mobile-manifest.json",
  "/mobile/mobile-icon.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        APP_SHELL.map((url) =>
          fetch(new Request(url, { cache: "reload" })).then((response) => {
            if (!response.ok) throw new Error(`Unable to cache ${url}`);
            return cache.put(url, response);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("/mobile/index.html")))
  );
});
