const CACHE_NAME = "reaact-pwa-v2";

const APP_SHELL = [
    "/",
    "/index.html",
    "/manifest.json",
    "/logo.png",
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

    const url = new URL(event.request.url); // Se usa esto para poder "descomponer" luego la URL y así poder identificar si es una petición a la API o  qué va a hacer

    if (url.pathname.includes("/api")) { // Si tiene en la URL /api es porque estaría bhaciendo peticiones, entonces, va a usar la estrategia de primero la red.
        event.respondWith(NetworkFirst(event.request));
        return;
    }

    if (event.request.destination === "image") { // Con destination podemos saber a qué tipo de recurso apunta, así que, a través de ella, sé si va a una imagen "image"
        event.respondWith(CacheFirst(event.request));
        return;
    }

    if (event.request.destination === "document") { // Con destination podemos saber a qué tipo de recurso apunta, así que, a través de ella, sé si va a un document HTML "document"
        event.respondWith(StaleWhileRevalidate(event.request));
        return;
    }

    if (event.request.destination === "style") { // Con destination podemos saber a qué tipo de recurso apunta, así que, a través de ella, sé si va a una hoja de estilos "style"
        event.respondWith(CacheFirst(event.request));
        return;
    }

    if (event.request.destination === "script") { // Con destination podemos saber a qué tipo de recurso apunta, así que, a través de ella, sé si va a un script  JS "script"
        event.respondWith(CacheFirst(event.request));
        return;
    }
});

function NetworkFirst(request) {
    return fetch(request) // Hace la petición a la red.
        .then(response => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(request, response.clone());
                return response;
            }); // Si la petición a la red es exitosa, se guarda en caché y se devuelve la respuesta.
        })
        .catch(() => caches.match(request)); // Si no hay respuesta de red, busca en la caché y devuelve lo que encuentre, si hay lo que necesita.
}

function CacheFirst(request) {
    return caches.match(request) // Busca primero en la caché
        .then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            } // Si está en la caché, devuelve la información que hay en la caché

            return fetch(request).then(response => { // Si no hay nada en la caché de lo que necesita, va y lo busca en internet.
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(request, response.clone());
                    return response;
                });
            });
        });
}

function StaleWhileRevalidate(request) {
    return caches.open(CACHE_NAME).then(cache => { // Abre la caché para poder usarla tanto para buscar como para guardar
        return cache.match(request).then(cachedResponse => { // Busca en la caché lo que necesita, mientras tanto, busca la información en internet para poder actualizarla si es uqe lo necesita.

            const networkFetch = fetch(request).then(response => { // Hace la petición a la red, y si es exitosa, guarda la información en caché para que la próxima vez que se necesite, ya esté ahí.
                cache.put(request, response.clone());
                return response;
            });

            return cachedResponse || networkFetch; // Responde con lo que hay en caché, pero sino, responde con lo que hay en la red. Y si sí hay la información en la caché, responde eso mientras lo busca en la red.
        });
    });
}
