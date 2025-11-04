const CACHE_NAME = 'cuaderno-digital-v2.1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/core/storage.js',
  '/core/utils.js',
  '/core/navigation.js',
  '/views/sections.js',
  '/views/pages.js',
  '/views/entries.js',
  '/pwa-installer.js',
  '/public/favicon/favicon.svg',
  '/public/icons/icon-72x72.png',
  '/public/icons/icon-96x96.png',
  '/public/icons/icon-128x128.png',
  '/public/icons/icon-144x144.png',
  '/public/icons/icon-152x152.png',
  '/public/icons/icon-192x192.png',
  '/public/icons/icon-384x384.png',
  '/public/icons/icon-512x512.png'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache.map(url => {
          return new Request(url, {cache: 'reload'});
        }));
      })
      .catch((error) => {
        console.log('Error al cachear archivos:', error);
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de Cache First, falling back to Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - devolver respuesta del cache
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Verificar si es una respuesta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clonar la respuesta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Si falla, devolver página offline personalizada si existe
        return caches.match('/index.html');
      })
  );
});

