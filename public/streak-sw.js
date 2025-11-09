const CACHE_NAME = 'streak-tracker-v2';
const ASSETS_TO_CACHE = [
  '/streak/',
  '/streak-manifest.webmanifest',
  '/icons/streak-icon-192x192.png',
  '/icons/streak-icon-512x512.png',
  '/icons/streak-apple-touch-icon.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching streak app assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('streak-tracker-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle requests within the /streak/ scope
  if (!event.request.url.includes('/streak')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
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
