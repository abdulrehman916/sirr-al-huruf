// ═══════════════════════════════════════════════════════════════
// Sirr al-Huruf — Service Worker v4
//
// Caching strategies:
//   Shell / HTML navigation → Network-first → cache → offline page
//   JS / CSS / fonts        → Stale-while-revalidate (cache + bg update)
//   Images                  → Cache-first (long TTL)
//   External APIs (base44)  → Network-only, graceful failure
//
// All lib/*, pages/*, data files are bundled into JS chunks by Vite
// at build time — they are available offline automatically once the
// chunk that contains them has been fetched and stored here.
// ═══════════════════════════════════════════════════════════════

const CACHE_VER     = 'sirr-v4';
const SHELL_CACHE   = `${CACHE_VER}-shell`;
const ASSET_CACHE   = `${CACHE_VER}-assets`;   // JS, CSS, fonts
const IMAGE_CACHE   = `${CACHE_VER}-images`;

// Minimal shell — precached on install so the app can open offline
const SHELL_ASSETS  = ['/', '/manifest.json'];

// Origins that should never be cached (backend, analytics, CDN APIs)
const BYPASS_ORIGINS = [
  'api.base44.com',
  'app.base44.com',
];

// ── Install ─────────────────────────────────────────────────────
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: purge old cache versions ──────────────────────────
self.addEventListener('activate', (evt) => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('sirr-') && ![SHELL_CACHE, ASSET_CACHE, IMAGE_CACHE].includes(k))
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Helpers ──────────────────────────────────────────────────────
const isBypass   = url => BYPASS_ORIGINS.some(o => url.hostname.includes(o));
const isNav      = req => req.mode === 'navigate';
const isAsset    = url => /\.(js|jsx|ts|tsx|css|woff2?|ttf|otf|eot)(\?.*)?$/.test(url.pathname);
const isImage    = url => /\.(png|jpe?g|svg|gif|webp|ico)(\?.*)?$/.test(url.pathname) || url.hostname === 'media.base44.com';
const isFont     = url => ['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname);
const isExternal = url => url.origin !== self.location.origin && !isFont(url) && url.hostname !== 'media.base44.com';

// Friendly offline page (shown only if no cached shell is available)
const OFFLINE_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>سرّ الحروف</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{min-height:100vh;display:flex;align-items:center;justify-content:center;
      background:linear-gradient(180deg,#020710 0%,#050d1a 50%,#0b1326 100%);
      font-family:serif;color:#f5ecd4;text-align:center;padding:24px}
    .card{border:1px solid rgba(212,175,55,.22);border-radius:16px;padding:36px 28px;
      background:rgba(10,20,50,.80);max-width:340px;box-shadow:0 0 48px rgba(212,175,55,.10)}
    .icon{font-size:2.8rem;margin-bottom:16px}
    h1{font-size:1.6rem;color:#D4AF37;margin-bottom:10px}
    p{font-size:1rem;color:rgba(245,230,180,.65);line-height:1.9}
    small{display:block;margin-top:18px;font-size:.72rem;color:rgba(255,255,255,.22);letter-spacing:.1em}
    button{margin-top:18px;padding:10px 28px;border-radius:10px;border:1px solid rgba(212,175,55,.45);
      background:rgba(212,175,55,.10);color:#D4AF37;font-size:.85rem;cursor:pointer}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">☽</div>
    <h1>غير متصل بالإنترنت</h1>
    <p>تحقق من اتصالك وحاول مرة أخرى</p>
    <p style="margin-top:10px;font-size:.88rem;color:rgba(212,175,55,.55)">
      You are offline. Connect to internet and retry.
    </p>
    <button onclick="location.reload()">↺ Retry</button>
    <small>سرّ الحروف — Sirr al-Huruf</small>
  </div>
</body>
</html>`;

// ── Fetch handler ─────────────────────────────────────────────────
self.addEventListener('fetch', (evt) => {
  const { request } = evt;
  const url = new URL(request.url);

  // Only handle GET; skip non-http
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  // Backend / external APIs → network only, no caching
  if (isBypass(url) || (isExternal(url) && !isFont(url) && !isImage(url))) {
    evt.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'offline', offline: true }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Images (including CDN icons) → cache-first
  if (isImage(url)) {
    evt.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  // Fonts → cache-first (immutable)
  if (isFont(url)) {
    evt.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  // JS / CSS (Vite bundles containing ALL data + logic) → stale-while-revalidate
  if (isAsset(url)) {
    evt.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    return;
  }

  // HTML navigation → network-first → cached shell → offline page
  if (isNav(request)) {
    evt.respondWith(networkFirstNav(request));
    return;
  }

  // Anything else → stale-while-revalidate
  evt.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
});

// ── Cache strategies ──────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  } catch {
    return new Response('', { status: 408, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache  = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Always kick off a background refresh
  const fresh = fetch(request).then(res => {
    if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);

  // Return cached immediately if available, otherwise wait for network
  return cached ?? (await fresh) ?? new Response('', { status: 408 });
}

async function networkFirstNav(request) {
  try {
    const res = await fetch(request);
    if (res && res.ok) {
      const cache = await caches.open(SHELL_CACHE);
      cache.put(request, res.clone()).catch(() => {});
    }
    return res;
  } catch {
    // Try the exact URL cached
    const cached = await caches.match(request);
    if (cached) return cached;

    // SPA fallback: any route is served by the root index
    const shell = await caches.match('/');
    if (shell) return shell;

    // Last resort: friendly offline HTML
    return new Response(OFFLINE_PAGE, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

// ── Messages from main thread ──────────────────────────────────────
self.addEventListener('message', (evt) => {
  if (!evt.data) return;

  // Activate new SW immediately when app requests it
  if (evt.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  // Cache-warming: the app sends us all resource URLs loaded in this session
  // so everything is available offline on first visit (no second visit needed).
  if (evt.data.type === 'CACHE_URLS') {
    const urls = evt.data.urls || [];
    caches.open(ASSET_CACHE).then(cache => {
      urls.forEach(url => {
        try {
          const parsed = new URL(url);
          if (isAsset(parsed)) {
            cache.match(url).then(hit => {
              if (!hit) fetch(url).then(r => { if (r.ok) cache.put(url, r); }).catch(() => {});
            });
          } else if (isImage(parsed)) {
            caches.open(IMAGE_CACHE).then(imgCache => {
              imgCache.match(url).then(hit => {
                if (!hit) fetch(url).then(r => { if (r.ok) imgCache.put(url, r); }).catch(() => {});
              });
            });
          }
        } catch {}
      });
    });
  }
});
