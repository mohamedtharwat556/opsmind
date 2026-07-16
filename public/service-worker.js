/**
 * Service Worker - Offline Support و Caching
 */

const CACHE_NAME = 'opsmind-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icons.svg'
];

// ✅ Install Event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache error:', err))
  );
  
  // Activate immediately
  self.skipWaiting();
});

// ✅ Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🧹 Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// ✅ Fetch Event - Network First Strategy
self.addEventListener('fetch', event => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Network first for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          // Clone and cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(error => {
          // Return cached version if network fails
          return caches.match(request)
            .then(response => {
              return response || new Response('Offline - please check your connection', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  } else {
    // Cache first for static assets
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }

          return fetch(request)
            .then(response => {
              // Don't cache non-successful responses
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseClone);
              });

              return response;
            })
            .catch(error => {
              console.error('Fetch error:', error);
              return new Response('Offline', { status: 503 });
            });
        })
    );
  }
});

// ✅ Background Sync - Sync pending requests when online
self.addEventListener('sync', event => {
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(
      syncPendingRequests()
        .then(() => {
          // Notify clients that sync is complete
          self.clients.matchAll().then(clients => {
            clients.forEach(client => {
              client.postMessage({
                type: 'SYNC_COMPLETE',
                message: 'تم مزامنة البيانات بنجاح'
              });
            });
          });
        })
    );
  }
});

// ✅ Helper: Sync Pending Requests
async function syncPendingRequests() {
  try {
    const db = await openIndexedDB();
    const pendingRequests = await getPendingRequests(db);

    for (const request of pendingRequests) {
      try {
        const response = await fetch(request.url, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });

        if (response.ok) {
          await removePendingRequest(db, request.id);
        }
      } catch (error) {
        console.error('Sync request failed:', error);
      }
    }
  } catch (error) {
    console.error('Sync error:', error);
  }
}

// ✅ IndexedDB Helper
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('opsmind-db', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pending-requests')) {
        db.createObjectStore('pending-requests', { keyPath: 'id' });
      }
    };
  });
}

function getPendingRequests(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readonly');
    const store = transaction.objectStore('pending-requests');
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removePendingRequest(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['pending-requests'], 'readwrite');
    const store = transaction.objectStore('pending-requests');
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

console.log('✅ Service Worker registered and ready for offline support!');
