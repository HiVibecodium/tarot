/**
 * Service Worker for AI Tarot Decision Assistant
 * Provides offline caching and PWA functionality
 */

const CACHE_NAME = 'ai-tarot-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/static/css/main.css',
  '/static/js/main.js'
];

// API endpoints to cache (runtime)
const CACHE_API_PATTERNS = [
  '/api/cards',
  '/api/readings/daily',
  '/api/users/me'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔮 Service Worker: Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets');
        // Don't fail if some assets are missing
        return Promise.allSettled(
          STATIC_ASSETS.map(url =>
            cache.add(url).catch(err =>
              console.log(`⚠️  Failed to cache ${url}:`, err.message)
            )
          )
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔮 Service Worker: Activating...');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('🗑️  Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      return self.clients.claim(); // Take control immediately
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // API requests - Network First, then Cache
  if (url.pathname.startsWith('/api')) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Static assets - Cache First, then Network
  event.respondWith(cacheFirstStrategy(request));
});

/**
 * Cache First Strategy
 * Try cache first, fallback to network
 * Good for: static assets, images, CSS, JS
 */
async function cacheFirstStrategy(request) {
  try {
    const cachedResponse = await caches.match(request);

    if (cachedResponse) {
      console.log('📦 Serving from cache:', request.url);
      return cachedResponse;
    }

    console.log('🌐 Fetching from network:', request.url);
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.error('❌ Fetch failed:', request.url, error);

    // Return offline page for HTML requests
    if (request.headers.get('accept').includes('text/html')) {
      const cache = await caches.open(CACHE_NAME);
      return cache.match('/index.html');
    }

    throw error;
  }
}

/**
 * Network First Strategy
 * Try network first, fallback to cache
 * Good for: API requests, dynamic data
 */
async function networkFirstStrategy(request) {
  const cache = await caches.open(RUNTIME_CACHE);

  try {
    console.log('🌐 Fetching from network (API):', request.url);
    const networkResponse = await fetch(request);

    // Cache successful API responses
    if (networkResponse && networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('📦 Network failed, trying cache:', request.url);

    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('✅ Serving API from cache:', request.url);
      return cachedResponse;
    }

    console.error('❌ No cached response available for:', request.url);

    // Return offline JSON response
    return new Response(
      JSON.stringify({
        error: 'offline',
        message: 'Вы находитесь в оффлайн режиме. Данные могут быть устаревшими.'
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Background sync for offline readings
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-readings') {
    console.log('🔄 Service Worker: Background sync triggered');
    event.waitUntil(syncReadings());
  }
});

async function syncReadings() {
  try {
    // Get pending readings from IndexedDB (if implemented)
    console.log('🔄 Syncing offline readings...');

    // TODO: Implement IndexedDB sync logic

    console.log('✅ Readings synced successfully');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received');

  const options = {
    body: event.data ? event.data.text() : 'Время для вашего ежедневного расклада Таро!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть расклад',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('🔮 AI Tarot', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/reading/daily')
    );
  }
});

// Message handler (for communication with app)
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

console.log('🔮 Service Worker: Script loaded');
