const VERSION = 'pocket-shop-v1.0.0';
const STATIC = ['./', './index.html', './styles.css', './app.js', './illustrations.js', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(STATIC)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('pocket-shop-') && key !== VERSION).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(caches.match(req, {ignoreSearch:true}).then(hit => {
    if (hit) return hit;
    return fetch(req).then(response => {
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(VERSION).then(cache => cache.put(req, copy));
      }
      return response;
    });
  }));
});
