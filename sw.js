const CACHE_NAME = 'ide-engine-cache-v1';

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return instantly from browser memory if it exists
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Otherwise, fetch from the Python server and cache it for next time
            return fetch(event.request).then((response) => {
                // Only cache the heavy engine files (Monaco and Xterm)
                if (event.request.url.includes('monaco-editor') || event.request.url.includes('xterm')) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return response;
            });
        })
    );
});