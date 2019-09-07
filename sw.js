const CACHE_VERSION = 'v' + 13;
const CACHE_STATIC_NAME = 'static-' + CACHE_VERSION;
const CACHE_DYNAMIC_NAME = 'dynamic-' + CACHE_VERSION;
const CACHE_DYNAMIC_SIZE = 800;
const API_URL = '';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        cache.add('/');
        cache.add('/dist/build.js');
        cache.add('/dist/logo.svg?d636998a49f9ea19c9f4ce89717cbadb');
        cache.add('/dist/decor.svg?74ae3c9ec53291a89a06e42dabc3c774');
        cache.add('/dist/nointernet.svg?9131dec4daf48e1a10a8ee86e65e4018');
        cache.add('https://fonts.gstatic.com/s/fredokaone/v7/k3kUo8kEI-tA1RRcTZGmTlHGCaen8wf-.woff2');
        cache.add('https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyCMIT4ttDfCmxA.woff2');
        cache.add('https://fonts.gstatic.com/s/raleway/v14/1Ptug8zYS_SKggPNyC0IT4ttDfA.woff2');
        cache.add('https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwN4rWqhPANqczVsq4A.woff2');
        cache.add('https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwN4rWqZPANqczVs.woff2');
        cache.add('https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwJYtWqhPANqczVsq4A.woff2');
        cache.add('https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwJYtWqhPANqczVsq4A.woff2');
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if(key !== CACHE_STATIC_NAME && key !== 'dynamic') {
            return caches.delete(key);
          }
        }));
      })
  );
});

self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.content,
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
  catch(err) {
    console.log(err);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.waitUntil(
    clients.matchAll()
      .then((allClients) => {
        const client = allClients.find(c => {
          return c.visibilityState === 'visible';
        });

        if(client) {
          client.navigate('http://localhost:8080');
          client.focus();
        }
        else {
          clients.openWindow('http://localhost:8080');
        }

        event.notification.close();
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        return caches.open(CACHE_DYNAMIC_NAME)
          .then(cache => {
            cache.put(event.request.url, res.clone());
            return res;
          });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if(event.request.method === 'GET' &&
    !event.request.url.includes(API_URL)) {

    caches.match(event.request.url, {cacheName: CACHE_STATIC_NAME})
      .then(res => {
        return res;
      })
      .catch(() => {
        fetch(event.request)
          .then(res => {
            return caches.open(CACHE_DYNAMIC_NAME)
              .then(cache => {
                cacheTrim();
                cache.put(event.request.url, res.clone());
                return res;
              });
          })
          .catch(() => {
            return caches.match(event.request);
          })

      })
  }
})

function cacheTrim() {
  caches.open(CACHE_DYNAMIC_NAME)
    .then(async cache => {
      while(cache.length > CACHE_DYNAMIC_SIZE) {
        let keys = await cache.keys();
        cache.delete[0];
      }
    });
}
