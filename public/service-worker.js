const CACHE_NAME = 'joovis-terms-cockpit-v7'
const STATIC_SHELL = [
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(precacheCurrentBuild().then(() => self.skipWaiting()))
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))),
      )
      .then(() => self.clients.claim()),
  )
})

async function precacheCurrentBuild() {
  const cache = await caches.open(CACHE_NAME)
  const indexResponse = await fetch('/index.html', { cache: 'no-store' })
  if (!indexResponse.ok) {
    throw new Error(`App shell request failed with ${indexResponse.status}`)
  }

  const html = await indexResponse.clone().text()
  const buildAssets = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => new URL(match[1], self.location.origin))
    .filter((url) => url.origin === self.location.origin)
    .map((url) => `${url.pathname}${url.search}`)

  await cache.put('/index.html', indexResponse.clone())
  await cache.put('/', indexResponse)
  await cache.addAll([...new Set([...STATIC_SHELL, ...buildAssets])])
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
    return
  }

  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('/index.html')))
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      return fetch(request).then((networkResponse) => {
        const responseCopy = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy))
        return networkResponse
      })
    }),
  )
})
