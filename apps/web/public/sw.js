// Service worker for bhimraj.com.np: offline reading, not an app shell.
// Same-origin GETs only; cross-origin requests (YouTube, giscus, PostHog,
// Google) are never intercepted. Bump VERSION when offline.html or the caching
// rules change: browsers refetch offline.html only when this file's bytes
// differ, and activation then deletes the old caches.
const VERSION = "1";
const PREFIX = "bhimraj-";
const CACHES = {
  offline: `${PREFIX}offline-v${VERSION}`,
  static: `${PREFIX}static-v${VERSION}`,
  pages: `${PREFIX}pages-v${VERSION}`,
};
const OFFLINE_URL = "/offline.html";
/** Entry caps, so caches stay small across deploys (hashed chunks pile up). */
const LIMITS = { static: 200, pages: 40 };
const STATIC_FILE = /\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?|ttf|otf)$/i;

/**
 * How a request is answered, or null to leave it to the network:
 * - "page": network first; offline, the last copy seen or the offline page.
 * - "immutable": cache first, for content-hashed build output.
 * - "static": the cached copy at once, refreshed in the background, for
 *   public files that can change under the same name.
 */
function strategyFor({ url, method, mode, origin, headers }) {
  if (method !== "GET") return null;
  const { origin: requestOrigin, pathname, search } = new URL(url);
  if (requestOrigin !== origin) return null;
  if (pathname === "/sw.js" || pathname.startsWith("/api/")) return null;
  if (mode === "navigate") return "page";
  // RSC payloads for client-side navigation; Next falls back to a full page
  // load when they fail, which lands in "page".
  if (headers.rsc === "1" || search.includes("_rsc=")) return null;
  if (pathname.startsWith("/_next/static/")) return "immutable";
  if (STATIC_FILE.test(pathname)) return "static";
  return null;
}

/** Our caches from older versions; caches without our prefix are left alone. */
function staleCaches(names) {
  const current = new Set(Object.values(CACHES));
  return names.filter((name) => name.startsWith(PREFIX) && !current.has(name));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHES.offline)
      // "reload" skips the HTTP cache, so a new VERSION gets a fresh copy.
      .then((cache) => cache.add(new Request(OFFLINE_URL, { cache: "reload" })))
      // Take over straight away. Nothing reloads: open tabs keep their page and
      // pick up the new worker's behaviour on their next request.
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(staleCaches(names).map((name) => caches.delete(name)));
      // Starts the page request while the worker boots.
      await self.registration.navigationPreload?.enable();
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const strategy = strategyFor({
    url: request.url,
    method: request.method,
    mode: request.mode,
    origin: self.location.origin,
    headers: { rsc: request.headers.get("rsc") },
  });
  if (strategy === "page") event.respondWith(page(event));
  else if (strategy) {
    event.respondWith(fromCache(event, strategy === "static"));
  }
});

async function page(event) {
  const { request } = event;
  try {
    const response = (await event.preloadResponse) ?? (await fetch(request));
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(put(CACHES.pages, request, copy, LIMITS.pages));
    }
    return response;
  } catch {
    const cached = await caches.match(request, { cacheName: CACHES.pages });
    return (
      cached ??
      (await caches.match(OFFLINE_URL, { cacheName: CACHES.offline })) ??
      Response.error()
    );
  }
}

async function fromCache(event, revalidate) {
  const { request } = event;
  const cached = await caches.match(request, { cacheName: CACHES.static });
  if (cached && !revalidate) return cached;
  const refresh = fetch(request).then((response) => {
    if (response.ok && response.type === "basic") {
      const copy = response.clone();
      event.waitUntil(put(CACHES.static, request, copy, LIMITS.static));
    }
    return response;
  });
  if (!cached) return refresh;
  event.waitUntil(refresh.catch(() => {}));
  return cached;
}

/** Stores a response, then drops the oldest entries past `limit`. */
async function put(cacheName, request, response, limit) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
  const keys = await cache.keys();
  const excess = keys.slice(0, Math.max(0, keys.length - limit));
  await Promise.all(excess.map((key) => cache.delete(key)));
}
