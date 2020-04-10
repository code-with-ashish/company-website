var cacheName = "ieqn-cache-v1";

var urlsToCache = [
    '/',
    '/css',
    '/js',
    '/fonts',
    '/images',
    '/index.html'
];

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(cacheName)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

var preLoad = function () {
    console.log('[PWA Builder] Install Event processing');
    return caches.open(cacheName).then(function (cache) {
        console.log('[PWA Builder] Cached index and offline page during Install');
        return cache.addAll(urlsToCache);
    });
};

self.addEventListener('fetch', function (event) {
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
        return;
    }
    console.log('[PWA Builder] The service worker is serving the asset.');
    event.respondWith(checkResponse(event.request).catch(function () {
        return returnFromCache(event.request);
    }));
    event.waitUntil(addToCache(event.request));
});

var checkResponse = function (request) {
    return new Promise(function (fulfill, reject) {
        fetch(request).then(function (response) {
            if (response.status !== 404) {
                fulfill(response);
            } else {
                reject();
            }
        }, reject);
    });
};

var addToCache = function (request) {
    return caches.open(cacheName).then(function (cache) {
        return fetch(request).then(function (response) {
            console.log('[PWA Builder] add page to offline: ' + response.url);
            return cache.put(request, response);
        });
    });
};

var returnFromCache = function (request) {
    return caches.open(cacheName).then(function (cache) {
        return cache.match(request).then(function (matching) {
            if (!matching || matching.status == 404) {
                return cache.match('offline.html');
            } else {
                return matching;
            }
        });
    });
};