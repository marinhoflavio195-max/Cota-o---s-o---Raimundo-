const CACHE_NAME = 'cotacao-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './admin.html',
  './fornecedor.html',
  './manifest.json',
  './logo.png'
  // adicione outros arquivos necessários
];

// Instala o SW e limpa cache antigo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.delete(CACHE_NAME).then(() => 
      caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    ).then(() => self.skipWaiting())
  );
});

// Intercepta requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => caches.match(event.request))
  );
});

// Ativa e controla SW
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});
