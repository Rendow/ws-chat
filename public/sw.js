

const APP_PREFIX = 'ws-vol-'
const VERSION = '01'
const CACHE_NAME = APP_PREFIX + VERSION
const URLS =[
    '/static/js/main.chunk.js',
    '/static/js/0.chunk.js',
    '/static/js/bundle.js',
    '/static/js/vendors~main.chunk.js',
    '/static/media/square_320_431787d41442021a815067689754243d.ef24912b.jpg',
    '/s/inter/v3/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2 ',
    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
    'https://fonts.gstatic.com/s/inter/v3/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
    '/manifest.json',
    '/favicon.ico',
    '/logo192.png',
    '/index.html',
    '/'
]


this.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                cache.addAll(URLS)
            })
            .then(this.skipWaiting())
    )

})

this.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys()
            .then(function (keyList) {

            let cacheWhitelist = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX)
            })
            cacheWhitelist.push(CACHE_NAME)

            return Promise.all(keyList.map(function (key, i) {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('deleting cache : ' + keyList[i] )
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})
this.addEventListener('fetch', event => {
    if (!navigator.onLine) {
        if (event.request.url.startsWith(this.location.origin)) {
            event.respondWith(
                caches.match(event.request)
                    .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return caches.open(CACHE_NAME)
                        .then(cache => {
                        return fetch(event.request)
                            .then(response => {
                            return cache
                                .put(event.request, response.clone())
                                .then(() => {
                                return response;
                            });
                        });
                    });
                })
            );
        }
    }
});