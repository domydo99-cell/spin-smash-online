const CACHE_NAME = 'spin-smash-shell-v7';
const SHELL_FILES = [
  '/',
  '/duel.html',
  '/duel.css?v=20260321-1',
  '/duel.js?v=20260321-1',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key)),
      ))
      .then(() => self.clients.claim()),
  );
});

function canCache(request) {
  if (request.method !== 'GET') return false;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return false;
  if (url.pathname.startsWith('/socket.io/')) return false;
  return true;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  return cached || networkPromise || Response.error();
}

async function networkFirstAsset(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (_err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return Response.error();
  }
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (_err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    return cache.match('/duel.html') || cache.match('/');
  }
}

self.addEventListener('fetch', (event) => {
  if (!canCache(event.request)) return;

  const url = new URL(event.request.url);
  const isStaticAsset = /\.(?:js|css|png|jpg|jpeg|webp|svg|gif|ico|woff2?)$/i.test(url.pathname);

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event.request));
    return;
  }

  if (isStaticAsset) {
    if (/\.(?:js|css)$/i.test(url.pathname)) {
      event.respondWith(networkFirstAsset(event.request));
      return;
    }
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
