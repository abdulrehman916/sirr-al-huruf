// Sirr al-Huruf — Service Worker v1
// Lightweight network-first strategy with offline fallback for shell assets.

const CACHE_NAME = "sirr-al-huruf-v1";

// Core shell assets to pre-cache on install
const PRECACHE_URLS = [
  "/",
  "/manifest.json",
];

// ── Install: pre-cache shell ──────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  // Activate immediately — no waiting for old SW to die
  self.skipWaiting();
});

// ── Activate: clean up old caches ────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // Take control of all open clients immediately
  self.clients.claim();
});

// ── Fetch: network-first, fall back to cache ─────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only handle GET requests; skip chrome-extension, non-http, etc.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (!["http:", "https:"].includes(url.protocol)) return;

  // For navigation requests (HTML pages), use network-first
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a fresh copy of the page
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match("/") || caches.match(request))
    );
    return;
  }

  // For same-origin static assets (JS, CSS, fonts): cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
      )
    );
    return;
  }

  // For external resources (Google Fonts, CDN images): network-first, no cache
  // to avoid stale external content
  event.respondWith(fetch(request).catch(() => new Response("", { status: 503 })));
});
