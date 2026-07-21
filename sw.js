// Teqanat Service Worker — sw.js
// Cache name: bump the version suffix when deploying a new build.

const CACHE_NAME = 'teqanat-sw-v1';

// Flutter app shell — cached on install for instant offline loading.
const SHELL_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/app_icon.png',
  '/icons/Icon-192.png',
  '/icons/Icon-512.png',
  '/icons/og-banner.png',
];

// ── Install: pre-cache the shell ─────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge stale caches ─────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) =>
        Promise.all(
          names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for shell, network-first for everything else ───────────
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Only handle same-origin requests.
  if (!url.startsWith(self.location.origin)) return;
  // Skip browser extension requests.
  if (url.startsWith('chrome-extension://')) return;
  // Skip non-GET requests.
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return cached response and refresh cache in background.
        fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((c) =>
                c.put(event.request, response)
              );
            }
          })
          .catch(() => {});
        return cached;
      }

      // Not cached — fetch from network and cache successful responses.
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const toCache = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(event.request, toCache));
          return response;
        })
        .catch(() =>
          new Response('Offline — please check your internet connection.', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
          })
        );
    })
  );
});
