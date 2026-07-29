/* Liga TFLA — service worker minimo.
   Su unico proposito hoy es habilitar la instalacion en la pantalla de inicio.
   Estrategia deliberada: pasa todo a la red (network-first) y NO cachea el shell,
   para que mientras la app este en desarrollo activo nunca sirva una version vieja.
   Cuando el torneo este estable y quieras modo offline, avisame y lo cambiamos
   a cache-first con versionado. */

const VERSION = 'liga-tfla-v1';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== VERSION).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Pass-through: siempre red. Requerido para que la app sea instalable.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
