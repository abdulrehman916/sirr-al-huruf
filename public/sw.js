// ═══════════════════════════════════════════════════════════════
// Sirr al-Huruf — Service Worker v5
//
// Caching strategies:
// Shell / HTML navigation → Network-first → cache → offline page
// JS / CSS / fonts → Stale-while-revalidate (cache + bg update)
// Images → Cache-first (long TTL)
// External APIs (base44) → Network-only, graceful failure
//
// IMPORTANT: skipWaiting is ONLY called on explicit SKIP_WAITING message.
// Auto-skipWaiting on install caused controllerchange → reload loops on iOS.
// ═══════════════════════════════════════════════════════════════

const CACHE_VER = 'sirr-v5';
const SHELL_CACHE = `${CACHE_VER}-shell`;
const ASSET_CACHE = `${CACHE_VER}-assets`;
const IMAGE_CACHE = `${CACHE_VER}-images`;

const SHELL_ASSETS = ['/', '/manifest.json'];

const BYPASS_ORIGINS = [
  'api.base44.com',
  'app.base44.com',
];

// ── Install ─────────────────────────────────────────────────────
// Do NOT call skipWaiting() here — it fires controllerchange which
// triggers window.location.reload() in older SW registrations and
// causes iOS Safari to reload the page on every visit.
// The new SW will activate when all tabs using the old SW are closed,
// or when the user explicitly triggers it via the SKIP_WAITING message.
self.addEventListener('install', (evt) => {
  evt.waitUntil(
    caches.open(SHELL_CACHE)
      .then(c => c.addAll(SHELL_ASSETS).catch(() => {}))
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
const isBypass = url => BYPASS_ORIGINS.some(o => url.hostname.includes(o));
const isNav = req => req.mode === 'navigate';
const isAsset = url => /\.(js|jsx|ts|tsx|css|woff2?|ttf|otf|eot)(\?.*)?$/.test(url.pathname);
const isImage = url => /\.(png|jpe?g|svg|gif|webp|ico)(\?.*)?$/.test(url.pathname) || url.hostname === 'media.base44.com';
const isFont = url => ['fonts.googleapis.com','fonts.gstatic.com'].includes(url.hostname);
const isExternal = url => url.origin !== self.location.origin && !isFont(url) && url.hostname !== 'media.base44.com';

const OFFLINE_PAGE = `<!DOCTYPE html><html lang="ar"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>سرّ الحروف</title><style>body{background:#020710;color:#D4AF37;font-family:serif;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;margin:0;text-align:center;gap:16px}h1{font-size:1.6rem}p{color:rgba(255,255,255,0.45);font-size:.9rem}button{background:rgba(212,175,55,0.15);border:1px solid rgba(212,175,55,0.4);color:#D4AF37;padding:10px 28px;border-radius:10px;font-size:1rem;cursor:pointer;margin-top:8px}</style></head><body><div style="font-size:2.5rem">☽</div><h1>غير متصل بالإنترنت</h1><p>تحقق من اتصالك وحاول مرة أخرى</p><p>You are offline. Connect to internet and retry.</p><button onclick="location.reload()">↺ Retry</button><p style="font-size:.7rem;opacity:.3;margin-top:32px">سرّ الحروف — Sirr al-Huruf</p></body></html>`;

// ── Fetch handler ─────────────────────────────────────────────────
self.addEventListener('fetch', (evt) => {
  const { request } = evt;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

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

  if (isImage(url)) {
    evt.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  if (isFont(url)) {
    evt.respondWith(cacheFirst(request, ASSET_CACHE));
    return;
  }

  if (isAsset(url)) {
    evt.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    return;
  }

  if (isNav(request)) {
    evt.respondWith(networkFirstNav(request));
    return;
  }

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
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fresh = fetch(request).then(res => {
    if (res && res.ok) cache.put(request, res.clone()).catch(() => {});
    return res;
  }).catch(() => null);

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
    const cached = await caches.match(request);
    if (cached) return cached;

    const shell = await caches.match('/');
    if (shell) return shell;

    return new Response(OFFLINE_PAGE, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
}

// ── Messages from main thread ──────────────────────────────────────
self.addEventListener('message', (evt) => {
  if (!evt.data) return;

  // Only skip waiting when explicitly requested (triggered by updatefound handler
  // in index.html, which only fires when a NEW worker installs while an old one
  // is already controlling the page — safe, intentional update).
  if (evt.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

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
