self.addEventListener("install", (event) => {
  event.waitUntil(self.registration.unregister());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("sitepulseai-mobile")).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
