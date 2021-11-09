

let cacheData = 'appV1'
this.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheData)
            .then((cache) => {
                cache.addAll([
                    '/static/js/main.chunk.js',
                    '/static/js/0.chunk.js',
                    '/static/js/bundle.js',
                    '/static/js/vendors~main.chunk.js',
                    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap ',
                    '/manifest.json',
                    '/favicon.ico',
                    '/logo192.png',
                    '/index.html',
                    '/'
                ])
            })
    )

})

this.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request)
            .then((res) => {
                if(res){
                    return res
                }
            })
    )
})