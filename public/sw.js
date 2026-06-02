// ═══════════════════════════════════════════════════════
// Sirr al-Huruf — Service Worker
// Strategy:
//   Navigation  → Network-first, fallback to cache, fallback to shell
//   JS/CSS/fonts → Cache-first, update in background (stale-while-revalidate)
//   Images       → Cache-first with long TTL
//   API/external → Network-only with graceful failure
// ═══════════════════════════════════════════════════════

const CACHE_VERSION = 'sirr-v3';
const SHELL_CACHE   = `${CACHE_VERSION}-shell`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE   = `${CACHE_VERSION}-images`;

// App shell — always cache on install
const SHELL_ASSETS = [
  '/',
  '/manifest.json',
];

// Google Fonts origins to cache
const FONT_ORIGINS = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

// ── Install: precache shell ──────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      cache.addAll(SHELL_ASSETS).catch(() => {})
    ).then(() => self.skipWaiting())
  );
});

// ── Activate: clean old caches ───────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('sirr-') && k !== SHELL_CACHE && k !== DYNAMIC_CACHE && k !== IMAGE_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Helpers ──────────────────────────────────────────────
function isNavigation(request) {
  return request.mode === 'navigate';
}

function isStaticAsset(url) {
  return /\.(js|jsx|ts|tsx|css|woff2?|ttf|otf|eot)(\?.*)?$/.test(url.pathname);
}

function isImage(url) {
  return /\.(png|jpg|jpeg|svg|gif|webp|ico)(\?.*)?$/.test(url.pathname) ||
    url.hostname === 'media.base44.com';
}

function isFontRequest(url) {
  return FONT_ORIGINS.some((o) => url.origin === new URL(o).origin) ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'fonts.googleapis.com';
}

function isExternal(url) {
  return url.origin !== self.location.origin &&
    !isFontRequest(url) &&
    url.hostname !== 'media.base44.com';
}

// Offline fallback HTML — shown when navigation fails and no cache exists
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>سرّ الحروف — غير متصل</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{
      min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(180deg,#020710 0%,#050d1a 50%,#0b1326 100%);
      font-family:'Amiri',serif;color:#f5ecd4;text-align:center;padding:24px;
    }
    .card{
      border:1px solid rgba(212,175,55,0.22);border-radius:16px;padding:36px 28px;
      background:rgba(10,20,50,0.80);max-width:340px;
      box-shadow:0 0 48px rgba(212,175,55,0.10);
    }
    .icon{font-size:3rem;margin-bottom:16px;opacity:0.75}
    h1{font-size:1.7rem;color:#D4AF37;margin-bottom:10px}
    p{font-size:1rem;color:rgba(245,230,180,0.65);line-height:1.8}
    small{display:block;margin-top:18px;font-size:0.75rem;color:rgba(255,255,255,0.25);letter-spacing:0.1em}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">☽</div>
    <h1>غير متصل بالإنترنت</h1>
    <p>تحقق من اتصالك بالإنترنت وحاول مرة أخرى</p>
    <p style="margin-top:10px;font-size:0.9rem;color:rgba(212,175,55,0.55)">
      You are offline. Connect to internet and retry.
    </p>
    <small>سرّ الحروف — Sirr al-Huruf</small>
  </div>
</body>
</html>`;

// ── Fetch handler ─────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and chrome-extension requests
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.protocol === 'data:') return;

  // External APIs (base44 backend, etc.) — network only, no caching
  if (isExternal(url)) {
    event.respondWith(fetch(request).catch(() =>
      new Response(JSON.stringify({ error: 'offline', offline: true }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      })
    ));
    return;
  }

  // Images — cache-first with background refresh
  if (isImage(url)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Fonts — cache-first (long-lived)
  if (isFontRequest(url)) {
    event.respondWith(cacheFirst(request, DYNAMIC_CACHE));
    return;
  }

  // Static assets (JS, CSS, woff) — stale-while-revalidate
  if (isStaticAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    return;
  }

  // Navigation requests — network-first, fallback to cached shell or offline page
  if (isNavigation(request)) {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  // Everything else — stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
});

// ── Strategies ────────────────────────────────────────────

// Cache-first: serve from cache, fallback to network + store
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    return new Response('', { status: 408 });
  }
}

// Stale-while-revalidate: return cache immediately, update in background
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response && response.ok) {
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  }).catch(() => null);

  return cached || fetchPromise || new Response('', { status: 408 });
}

// Network-first for navigation: try network, fallback to cached page, fallback to offline HTML
async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      // Cache the shell document for offline use
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  } catch {
    // Try cached version of this exact URL
    const cached = await caches.match(request);
    if (cached) return cached;

    // Try the root shell (SPA — any route renders via React Router)
    const shell = await caches.match('/');
    if (shell) return shell;

    // Final fallback: friendly offline page
    return new Response(OFFLINE_HTML, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

// ── Background sync: notify clients when back online ──────
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
