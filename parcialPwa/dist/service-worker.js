const CACHE_NAME = "medicare-pwa-v1";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo.png"
];

self.addEventListener("install", (event) => {

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {

  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.pathname.includes("/api")) {
    event.respondWith(NetworkFirst(event.request));
    return;
  }

  if (event.request.destination === "image") {
    event.respondWith(CacheFirst(event.request));
    return;
  }

  if (event.request.destination === "style") {
    event.respondWith(CacheFirst(event.request));
    return;
  }

  if (event.request.destination === "script") {
    event.respondWith(CacheFirst(event.request));
    return;
  }

  if (event.request.destination === "document") {
    event.respondWith(StaleWhileRevalidate(event.request));
    return;
  }

});

/*
Cache First Strategy

La estrategia "Cache First" intenta obtener primero el recurso desde la caché del navegador.
Si el recurso ya está guardado, se devuelve inmediatamente sin hacer una petición a la red.
Si no existe en la caché, entonces se solicita a internet y se guarda en caché para usos futuros.

En una aplicación médica como MediCare+, esta estrategia es útil para recursos estáticos
como imágenes, hojas de estilo o scripts, porque estos archivos cambian muy poco y
permiten que la aplicación cargue mucho más rápido incluso si la conexión a internet es lenta
o inestable dentro de una clínica u hospital.
*/

function NetworkFirst(request) {

  return fetch(request)
    .then(response => {

      return caches.open(CACHE_NAME).then(cache => {
        cache.put(request, response.clone());
        return response;
      });

    })
    .catch(() => caches.match(request));

}

function CacheFirst(request) {

  return caches.match(request)
    .then(cachedResponse => {

      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(response => {

        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, response.clone());
          return response;
        });

      });

    });

}

function StaleWhileRevalidate(request) {

  return caches.open(CACHE_NAME).then(cache => {

    return cache.match(request).then(cachedResponse => {

      const networkFetch = fetch(request).then(response => {

        cache.put(request, response.clone());
        return response;

      });

      return cachedResponse || networkFetch;

    });

  });

}
