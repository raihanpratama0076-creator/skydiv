/* Service worker sederhana: halaman tetap bisa dibuka saat sinyal jelek.
   Network-first, jatuh ke cache jika offline. Naikkan versi C saat mengubah file. */
const C = 'fundive-bac-v4-golden-fix';
const CORE = ['./', 'index.html', 'css/style.css', 'css/catalog.css', 'js/catalog-data.js', 'js/main.js', 'js/catalog.js', 'manifest.webmanifest',
  'assets/logo-bac.webp', 'assets/logo-everydive.webp', 'assets/icon-192.png', 'assets/icon-512.png'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(C).then((c) => c.addAll(CORE)));
  self.skipWaiting();
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== C).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then((res) => {
      const copy = res.clone();
      caches.open(C).then((c) => c.put(r, copy));
      return res;
    }).catch(() => caches.match(r))
  );
});
