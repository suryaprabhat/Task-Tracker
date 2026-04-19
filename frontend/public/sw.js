self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

// 🔴 REQUIRED FOR injectManifest
self.__WB_MANIFEST;
