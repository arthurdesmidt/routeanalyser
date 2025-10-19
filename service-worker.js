// Very small service worker for caching app shell
const CACHE_NAME = 'routeteller-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js',
  'https://cdn.jsdelivr.net/npm/@turf/turf@6/turf.min.js'
];

self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', evt => {
  evt.waitUntil(clients.claim());
});

self.addEventListener('fetch', evt => {
  const req = evt.request;
  if(req.url.includes('overpass-api.de') || req.url.includes('router.project-osrm.org') || req.url.includes('nominatim.openstreetmap.org')){
    return evt.respondWith(fetch(req).catch(()=>caches.match(req)));
  }
  evt.respondWith(caches.match(req).then(r => r || fetch(req)));
});
