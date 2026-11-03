// Store complete background downloads, then serve the byte ranges requested
// by native video players from those same files.
const prefix = 'xworld-video-';
const cacheName = prefix + new URL(self.location.href).searchParams.get('v');
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil((async () => {
  await Promise.all((await caches.keys())
    .filter(name => name.startsWith(prefix) && name !== cacheName)
    .map(name => caches.delete(name)));
  await self.clients.claim();
})()));

async function mediaResponse(request) {
  const cached = await caches.match(request.url, { cacheName }).catch(() => null);
  if (!cached) return fetch(request);
  const range = request.headers.get('Range');
  if (!range) return cached;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return fetch(request);
  const blob = await cached.blob();
  const start = match[1] ? Number(match[1]) : Math.max(0, blob.size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), blob.size - 1) : blob.size - 1;
  if (start > end) return new Response(null, { status: 416, headers: { 'Content-Range': 'bytes */' + blob.size } });
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Length': String(end - start + 1),
      'Content-Range': 'bytes ' + start + '-' + end + '/' + blob.size,
    },
  });
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method === 'GET' && url.origin === self.location.origin && url.pathname.endsWith('.mp4')) {
    event.respondWith(mediaResponse(event.request));
  }
});
