const cacheName = 'elektronika-cache';

self.addEventListener('install', (event) =>
{
  console.log('Service Worker Installed');
  event.waitUntil(
  caches.open(cacheName).then((cache) =>
  {
    return cache.addAll([
      '/elektronika/',
      '/elektronika/manifest.json',
      '/elektronika/style.css',
      '/elektronika/script.js',
      '/elektronika/favicon.png',
      '/elektronika/font.woff2',
      '/elektronika/sw.js',
      '/elektronika/logo.png',
      '/elektronika/folder/1.pdf', '/elektronika/folder/2.pdf', '/elektronika/folder/3.pdf', '/elektronika/folder/4.pdf', '/elektronika/folder/5.pdf',
      '/elektronika/folder/6.pdf', '/elektronika/folder/7.pdf', '/elektronika/folder/8.pdf', '/elektronika/folder/9.pdf', '/elektronika/folder/10.pdf',
      '/elektronika/folder/11.pdf', '/elektronika/folder/12.pdf', '/elektronika/folder/13.pdf', '/elektronika/folder/14.pdf', '/elektronika/folder/15.pdf',
      '/elektronika/folder/16.pdf', '/elektronika/folder/17.pdf', '/elektronika/folder/18.pdf', '/elektronika/folder/19.pdf', '/elektronika/folder/20.pdf',
      '/elektronika/folder/21.pdf', '/elektronika/folder/22.pdf', '/elektronika/folder/23.pdf', '/elektronika/folder/24.pdf', '/elektronika/folder/25.pdf',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) =>
{
  event.respondWith(
  caches.match(event.request).then((response) =>
  {
    return response || fetch(event.request);
  })
  );
});