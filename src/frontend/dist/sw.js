/* eslint-env serviceworker */
// Enhanced Service Worker for PWA - Offline Support & Caching
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `tarot-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `tarot-dynamic-${CACHE_VERSION}`;
const API_CACHE = `tarot-api-${CACHE_VERSION}`;

// Static files to cache on install
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html'
];

// API endpoints to cache
const CACHEABLE_API_PATTERNS = [
  '/api/cards',
  '/api/readings/daily'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing v2...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static files');
      return cache.addAll(STATIC_FILES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating v2...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheName.includes(CACHE_VERSION)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  // API requests - Network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, API_CACHE));
    return;
  }

  // Static assets (JS, CSS, images) - Cache first
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // HTML pages - Network first with offline fallback
  event.respondWith(networkFirstWithOffline(request));
});

// Check if URL is a static asset
function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/i.test(pathname);
}

// Network first strategy (good for API and HTML)
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);

    // Clone and cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API
    return new Response(
      JSON.stringify({ error: 'Offline', message: 'No internet connection' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// Cache first strategy (good for static assets)
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    // Return cached, but also update cache in background
    updateCache(request, cacheName);
    return cachedResponse;
  }

  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('[SW] Failed to fetch:', request.url);
    return new Response('', { status: 404 });
  }
}

// Network first with offline HTML fallback
async function networkFirstWithOffline(request) {
  try {
    const networkResponse = await fetch(request);

    // Cache HTML pages
    if (networkResponse.ok && request.destination === 'document') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('/offline.html') || caches.match('/');
    }

    return new Response('', { status: 404 });
  }
}

// Background cache update
async function updateCache(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silently fail - we already have cached version
  }
}

// ==========================================
// PUSH NOTIFICATIONS
// ==========================================

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push notification received');

  let notification = {
    title: 'Tarot AI',
    body: 'У вас новое уведомление',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: '/dashboard' }
  };

  if (event.data) {
    try {
      notification = event.data.json();
    } catch (e) {
      notification.body = event.data.text();
    }
  }

  const options = {
    body: notification.body,
    icon: notification.icon || '/icon-192.png',
    badge: notification.badge || '/icon-192.png',
    data: notification.data || { url: '/dashboard' },
    vibrate: [100, 50, 100],
    tag: notification.data?.type || 'default',
    requireInteraction: false,
    actions: [
      { action: 'open', title: 'Открыть' },
      { action: 'close', title: 'Закрыть' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(notification.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (const client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }

        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);

  if (event.tag === 'sync-readings') {
    event.waitUntil(syncReadings());
  }
});

async function syncReadings() {
  // Sync any pending readings when back online
  console.log('[SW] Syncing readings...');
  // Implementation would go here
}
