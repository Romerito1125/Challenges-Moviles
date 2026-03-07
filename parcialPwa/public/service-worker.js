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

La estrategia de primero la caché intenta primero buscar la información que ya existia previamente en el navegador, si está ahí
lo devolverá de una vez sin hacer la petición a la api. Si no existe, entonces hará la solicitud y luego se guardará en la caché.

Para una aplicación médica, es útil para recursos estáticos, imágenes, scripts, o archivos que cambian muy poco durante el uso de la aplicación
permitiendo que la aplicación cague más rápido, evitando que se congestione más la red buscando cosas no vitales.
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
