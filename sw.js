const CACHE_NAME = "cotacao-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/admin.html",
  "/fornecedor.html",
  "/manifest.json",
  "/logo.png",
  "/style.css" // se tiver CSS externo
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if(key !== CACHE_NAME){
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Intercepta requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(resp => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, resp.clone());
          return resp;
        });
      })
      .catch(() => caches.match(event.request))
  );
});
