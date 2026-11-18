// AAQ Dépenses – fonctionnement hors connexion.
// Pour publier une mise à jour, augmentez le numéro de VERSION.
const VERSION = "aaq-depenses-v4";
const FICHIERS = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSION).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
// Réseau d'abord (pour recevoir les mises à jour), copie locale si hors connexion.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(VERSION).then(c => c.put(e.request, copie)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
