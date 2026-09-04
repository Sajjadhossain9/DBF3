/* Airborne Phoenix service worker — app-shell cache with offline fallback. */
const VERSION = "ap-v1";
const SHELL = ["./", "./index.html", "./offline.html", "./manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Never cache large media or cross-origin video.
  if (/\.(mp4|webm|glb)$/.test(url.pathname) || url.origin !== location.origin) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then((r) => { const copy = r.clone(); caches.open(VERSION).then((c) => c.put("./index.html", copy)); return r; }).catch(() => caches.match("./index.html").then((r) => r || caches.match("./offline.html"))));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((r) => { if (r.ok && /\.(js|css|svg|png|webp|avif|woff2?)$/.test(url.pathname)) { const copy = r.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); } return r; })));
});
