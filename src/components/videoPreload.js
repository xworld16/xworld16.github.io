// Media inside the embeds is same-origin. Inspect the actual players so a
// buffering foreground clip takes precedence over speculative downloads.
const groups = [
  ['#top', 'media/landing/'],
  ['#control-demo', 'media/control/'],
  ['.frosted-demo[data-kind="r2v"]', 'frosted-demo/frosted/media/r2v_'],
  ['#grounding-3dgs-gallery', 'media/grounding/3dgs/'],
  ['.pointcloud-demo', 'pointcloud-demo/media/'],
  ['#long-stage', 'long-presentation/media/'],
  ['#rl', 'rl-comparison/media/'],
  ['#dashcam-stage', 'frosted-demo/frosted/media/dashcam_'],
  ['#interaction-cases', 'media/interaction/'],
];

function foreground(host, sources) {
  const frame = host.querySelector('iframe');
  if (frame) {
    const bounds = frame.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= innerHeight) return true;
  }
  const doc = frame?.contentDocument;
  if (frame && (!doc || doc.URL === 'about:blank' || doc.readyState === 'loading')) return false;
  if (doc?.querySelector('#comparison[aria-busy="true"]')) return false;
  const players = (doc || host).querySelectorAll('video');
  for (const player of players) {
    const url = player.dataset.mediaUrl || player.currentSrc || player.src;
    if (!url || player.error) continue;
    sources.add(url);
    // A paused metadata-only player can intentionally buffer just one frame.
    if (player.readyState === 4 || (player.paused && player.readyState >= 2)) continue;
    if (player.readyState < 3) return false;
    const time = player.currentTime;
    const target = Math.min(player.duration, time + 3);
    let buffered = false;
    for (let i = 0; i < player.buffered.length; i++) {
      if (player.buffered.start(i) <= time + 0.1 && player.buffered.end(i) >= target - 0.1) buffered = true;
    }
    if (!buffered) return false;
  }
  return true;
}

export async function startVideoPreload() {
  if (!('serviceWorker' in navigator) || !window.caches || navigator.connection?.saveData) return;
  await navigator.serviceWorker.register('./media-cache.js?v=' + __MEDIA_BUILD__);
  await navigator.serviceWorker.ready;
  const cache = await caches.open('xworld-video-' + __MEDIA_BUILD__);
  const completed = new Set((await cache.keys()).map(request => request.url));
  const sections = groups.map(([selector, prefix]) => ({
    host: document.querySelector(selector),
    urls: __MEDIA_FILES__.filter(file => file.startsWith(prefix)).map(file => new URL(file, document.baseURI).href),
  })).filter(section => section.host);
  let downloading;
  let visibleKey;
  let timer;
  let scheduledAt;
  const failures = new Map();

  function schedule(delay = 350) {
    const next = performance.now() + delay;
    if (timer && scheduledAt <= next) return;
    clearTimeout(timer);
    scheduledAt = next;
    timer = setTimeout(() => { timer = null; tick(); }, delay);
  }

  async function tick() {
    if (document.hidden) { downloading?.controller.abort(); return; }
    const ranked = sections.map((section, index) => {
      const rect = section.host.getBoundingClientRect();
      return { ...section, index, distance: Math.max(0, rect.top - innerHeight, -rect.bottom) };
    }).sort((a, b) => a.distance - b.distance);
    const visible = ranked.filter(section => !section.distance);
    const key = visible.map(section => section.index).join(',');
    const sources = new Set();
    const ready = visible.every(section => foreground(section.host, sources));
    if (downloading) {
      if (!ready || key !== visibleKey || sources.has(downloading.url)) downloading.controller.abort();
      schedule();
      return;
    }
    visibleKey = key;
    if (!ready) { schedule(); return; }
    const url = ranked.flatMap(section => section.urls).find(url =>
      !completed.has(url) && !sources.has(url) && (failures.get(url) || 0) <= Date.now());
    if (!url) { if (failures.size) schedule(5000); return; }
    const controller = new AbortController();
    downloading = { url, controller };
    schedule();
    try {
      const response = await fetch(url, { signal: controller.signal, priority: 'low' });
      if (response.status !== 200 || !response.headers.get('Content-Type')?.includes('video/')) throw Error('Invalid video response');
      await cache.put(url, response);
      completed.add(url);
      failures.delete(url);
    } catch (error) {
      if (error.name === 'QuotaExceededError') return;
      if (!controller.signal.aborted) failures.set(url, Date.now() + 60000);
    } finally {
      downloading = null;
      clearTimeout(timer);
      timer = null;
    }
    schedule();
  }

  document.addEventListener('visibilitychange', () => schedule(0));
  window.addEventListener('scroll', () => schedule(50), { passive: true });
  window.addEventListener('resize', () => schedule(50));
  schedule(1000);
}
