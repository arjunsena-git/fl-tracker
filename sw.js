const CACHE = 'arjun-fl-v9';
const ASSETS = [
  '/fl-tracker/',
  '/fl-tracker/index.html',
  '/fl-tracker/manifest.json',
  '/fl-tracker/icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // only handle requests within our scope
  if (!e.request.url.includes('/fl-tracker/')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).catch(() => caches.match('/fl-tracker/index.html'));
    })
  );
});
