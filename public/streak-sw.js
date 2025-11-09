// Cache version - auto-generated during build
const CACHE_VERSION = '2025.1109.1216';
const CACHE_NAME = `streak-tracker-v${CACHE_VERSION}`;

// Assets to precache on install
const PRECACHE_ASSETS = [
  '/streak-manifest.webmanifest',
  '/icons/streak-icon-192x192.png',
  '/icons/streak-icon-512x512.png',
  '/icons/streak-apple-touch-icon.png',
];

// Install event - precache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets for', CACHE_NAME);
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches and notify clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Delete old caches
        ...cacheNames.map((cacheName) => {
          if (cacheName.startsWith('streak-tracker-') && cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
        // Take control of all clients immediately
        self.clients.claim()
      ]);
    }).then(() => {
      // Notify all clients that a new version is active
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION
          });
        });
      });
    })
  );
});

// Fetch event - network-first for HTML, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin requests for /streak/
  if (url.origin !== location.origin || !url.pathname.startsWith('/streak')) {
    return;
  }

  // Network-first strategy for HTML pages
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the fresh HTML
          if (response.ok) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cached) => {
            return cached || new Response('Offline - page not cached', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets (CSS, JS, images)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) {
        return cached;
      }

      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Cache the asset
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return response;
      });
    })
  );
});

// Handle notification click - open the app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes('/streak') && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window if app is not already open
      if (clients.openWindow) {
        return clients.openWindow('/streak/');
      }
    })
  );
});

// Periodic notification check (when service worker wakes up)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_SCHEDULED_NOTIFICATIONS') {
    checkAndSendScheduledNotifications();
  }

  // Skip waiting when instructed by client
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * Check localStorage for scheduled notifications and send if time has come
 */
function checkAndSendScheduledNotifications() {
  // This function will be called periodically by the app
  // Service workers can't directly access localStorage, so we'll need to
  // coordinate with the main app thread
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'REQUEST_SCHEDULED_NOTIFICATIONS'
      });
    });
  });
}
