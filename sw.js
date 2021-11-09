

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
                    '/static/media/square_320_431787d41442021a815067689754243d.ef24912b.jpg',
                    '/s/inter/v3/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2 ',
                    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
                    'https://fonts.gstatic.com/s/inter/v3/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2',
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
    if(!navigator.onLine){
        e.respondWith(
            caches.match(e.request)
                .then((res) => {
                    if(res){
                        return res
                    }
                    // let requestUrl = e.request.clone()
                    // fetch(requestUrl)
                })
        )
    }
})