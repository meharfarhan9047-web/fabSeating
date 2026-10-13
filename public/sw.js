// Cache only full public HTML navigations, never Next.js RSC/prefetch responses.
const CACHE_NAME = 'fabseating-v3'
const MAX_PAGES = 30

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys()
    await Promise.all(names.filter((name) => name.startsWith('fabseating-') && name !== CACHE_NAME).map((name) => caches.delete(name)))
    await self.clients.claim()
  })())
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || request.mode !== 'navigate' || url.origin !== self.location.origin) return
  if (/^\/(api|admin|_next)(\/|$)/.test(url.pathname) || request.headers.has('range')) return
  // Query variants must not accumulate unbounded offline copies.
  const key = url.origin + url.pathname
  let save = Promise.resolve()
  const response = (async () => {
    try {
      const result = await fetch(request)
      if (result.ok && !result.redirected && result.headers.get('content-type')?.includes('text/html') && !/private|no-store/i.test(result.headers.get('cache-control') || '')) {
        const copy = result.clone()
        save = (async () => {
          const cache = await caches.open(CACHE_NAME)
          await cache.put(key, copy)
          const keys = await cache.keys()
          await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_PAGES)).map((entry) => cache.delete(entry)))
        })().catch(() => {})
      }
      return result
    } catch {
      const cached = await (await caches.open(CACHE_NAME)).match(key)
      return cached || Response.error()
    }
  })()
  event.respondWith(response)
  event.waitUntil(response.then(() => save).catch(() => {}))
})
