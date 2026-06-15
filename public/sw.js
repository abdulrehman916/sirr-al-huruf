// ═══════════════════════════════════════════════════════════════
// SERVICE WORKER — Enterprise PWA Offline Support
// Network-first for HTML, Cache-first for static assets
// ═══════════════════════════════════════════════════════════════

const CACHE_VERSION = 'sah-v3';
const STATIC_CACHE = CACHE_VERSION + '-static';
const DYNAMIC_CACHE = CACHE_VERSION + '-dynamic';

// Static assets to precache on install
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Extensions that are safe to cache aggressively (immutable-ish)
const STATIC_EXTENSIONS = /\.(js|css|woff2?|ttf|eot|png|jpg|jpeg|gif|svg|ico|webp|avif)$/i;

// ── Install: precache static shell ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// ── Activate: purge old caches ──────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// ── Fetch: smart strategy ───────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip cross-origin (except CDN/fonts)
  const isSameOrigin = url.origin === self.location.origin;
  const isCdnOrFont = /(fonts\.gstatic\.com|cdnjs|unpkg|jsdelivr)/.test(url.hostname);
  if (!isSameOrigin && !isCdnOrFont) return;

  // Skip Base44 API calls — don't cache dynamic data
  if (url.pathname.includes('/api/') || url.pathname.includes('/functions/')) {
    return; // Let them pass through to network
  }

  // Strategy: Cache-first for static assets, Network-first for HTML
  const isStatic = STATIC_EXTENSIONS.test(url.pathname);
  const isHtml = request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/';

  if (isStatic) {
    // Cache-first: serve instantly, update cache in background
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const clone = networkResponse.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => cached);

        return cached || fetchPromise;
      })
    );
  } else if (isHtml) {
    // Network-first for HTML: always try network, fall back to cache
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/index.html');
        });
      })
    );
  } else {
    // Default: network-first
    event.respondWith(
      fetch(request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => caches.match(request))
    );
  }
});

// ── Message: cache warming from main thread ─────────────────────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls || [];
    caches.open(STATIC_CACHE).then((cache) => {
      urls.forEach((url) => {
        cache.add(url).catch(() => {});
      });
    });
  }

  // Clear dynamic cache on request
  if (event.data && event.data.type === 'CLEAR_DYNAMIC') {
    caches.delete(DYNAMIC_CACHE).then(() => {
      caches.open(DYNAMIC_CACHE); // recreate
    });
  }
});
