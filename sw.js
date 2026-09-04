/* Vườn Xanh PWA service worker */
const CACHE_VERSION = 'vuon-xanh-v1.9.119';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/firebase-config.js',
  './js/data.js',
  './js/fa-icons.js',
  './js/game.js',
  './js/features.js',
  './js/app.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

function isFirebaseOrApi(url) {
  try {
    const u = new URL(url);
    return (
      u.hostname.includes('googleapis.com') ||
      u.hostname.includes('firebaseio.com') ||
      u.hostname.includes('firebase') ||
      u.hostname.includes('gstatic.com') ||
      u.hostname.includes('google.com') ||
      u.hostname.includes('fontawesome.com') ||
      u.hostname.includes('googleapis.com') ||
      u.pathname.includes('/api/')
    );
  } catch (_) {
    return false;
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = req.url;
  // Không cache request Firebase / API / cross-origin auth
  if (isFirebaseOrApi(url)) return;

  const dest = req.destination;
  const isNav = req.mode === 'navigate' || dest === 'document';

  if (isNav) {
    // Network first cho HTML — fallback cache / index
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then((cached) => cached || caches.match('./index.html'))
        )
    );
    return;
  }

  // Cache first cho static; cập nhật nền
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
