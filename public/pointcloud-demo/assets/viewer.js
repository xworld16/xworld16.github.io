(() => {
  'use strict';
  const t = window.PXW_EMBED.t, $ = id => document.getElementById(id);
  const manifest = window.PXW_MANIFEST;
  if (!manifest?.scenes?.length) { $('status').hidden = false; $('status').textContent = t('manifestError'); return; }
  const tiles = [...document.querySelectorAll('[data-camera]')];
  const generated = tiles.map(tile => tile.querySelector('video'));
  const conditions = tiles.map(tile => tile.querySelector('.comparison-condition video'));
  const videos = [...generated, ...conditions];
  const master = tiles.find(tile => tile.dataset.camera === 'cam2').querySelector('video');
  let index = 0, active = window.parent === window, loading = true, failed = false, generation = 0;
  const pending = new Map();
  function refreshLabels() {
    $('status').hidden = !failed;
    $('status').textContent = failed ? t('videoError') : '';
  }
  function setPlaying() {
    const play = active && !document.hidden && !loading && !failed;
    for (const video of videos) {
      if (play) video.play().catch(() => {});
      else video.pause();
    }
    refreshLabels();
  }
  function load(video, src) {
    // Cancel old listeners when navigating quickly, so stale loads cannot change the new scene.
    pending.get(video)?.();
    return new Promise(resolve => {
      const finish = ok => { video.removeEventListener('loadeddata', ready); video.removeEventListener('error', error); pending.delete(video); resolve(ok); };
      const ready = () => finish(true), error = () => finish(false);
      pending.set(video, () => finish(false));
      video.addEventListener('loadeddata', ready, { once: true });
      video.addEventListener('error', error, { once: true });
      video.loop = false; video.playbackRate = 1; video.src = src; video.load();
    });
  }
  async function select(next) {
    const token = ++generation;
    index = (next + manifest.scenes.length) % manifest.scenes.length;
    const scene = manifest.scenes[index];
    loading = true; failed = false; setPlaying();
    $('counter').textContent = `${String(index + 1).padStart(2, '0')} / ${String(manifest.scenes.length).padStart(2, '0')}`;
    const results = await Promise.all([...tiles.map((tile, i) => load(generated[i], scene.generated[tile.dataset.camera])), ...tiles.map((tile, i) => load(conditions[i], scene.condition[tile.dataset.camera]))]);
    if (token !== generation) return;
    loading = false; failed = results.some(ok => !ok);
    for (const video of videos) if (video.readyState >= 1) video.currentTime = 0;
    setPlaying();
  }
  $('prev').onclick = () => select(index - 1);
  $('next').onclick = () => select(index + 1);
  videos.forEach(video => video.addEventListener('error', () => { if (!loading) { failed = true; setPlaying(); } }));
  document.addEventListener('visibilitychange', setPlaying);
  const comparison = $('comparison');
  let split = 50, phase = 0, previousTick = null, hovered = false, focused = false, dragging = false;
  function setSplit(value) {
    split = Math.min(100, Math.max(0, value));
    $('camera-grid').style.setProperty('--split', `${split}%`);
    comparison.setAttribute('aria-valuenow', String(Math.round(split)));
    comparison.setAttribute('aria-valuetext', t('compareValue', { value: Math.round(split) }));
  }
  function pointerSplit(event) {
    const rect = comparison.getBoundingClientRect();
    setSplit(100 * (event.clientX - rect.left) / rect.width);
  }
  comparison.addEventListener('pointerenter', () => { hovered = true; });
  comparison.addEventListener('pointerleave', () => { hovered = false; });
  comparison.addEventListener('focus', () => { focused = true; });
  comparison.addEventListener('blur', () => { focused = false; });
  comparison.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    event.preventDefault(); dragging = true;
    comparison.setPointerCapture(event.pointerId);
    pointerSplit(event);
  });
  comparison.addEventListener('pointermove', event => { if (dragging) pointerSplit(event); });
  const stopDrag = () => { dragging = false; };
  comparison.addEventListener('pointerup', stopDrag);
  comparison.addEventListener('pointercancel', stopDrag);
  comparison.addEventListener('lostpointercapture', stopDrag);
  comparison.addEventListener('keydown', event => {
    const value = { ArrowLeft: split - 2, ArrowRight: split + 2, Home: 0, End: 100 }[event.key];
    if (value !== undefined) { event.preventDefault(); setSplit(value); }
  });
  function tick(now) {
    requestAnimationFrame(tick);
    const dt = previousTick === null ? 0 : Math.min(.1, (now - previousTick) / 1000);
    previousTick = now;
    if (!active || document.hidden || loading || failed) return;
    if (!hovered && !focused && !dragging) {
      phase += dt * Math.PI * 2 / 16;
      // A 16-second oscillation within 35–65%; ease back smoothly after manual dragging.
      const target = 50 + 15 * Math.sin(phase);
      setSplit(split + (target - split) * (1 - Math.exp(-dt * 3)));
    }
    if (master.ended) {
      for (const video of videos) video.currentTime = 0;
      setPlaying();
      return;
    }
    // Every rendered condition and generated view follows the CAM2 decoder clock.
    for (const video of videos) if (video !== master && video.readyState >= 2 && Math.abs(video.currentTime - master.currentTime) > .5 / (manifest.fps || 12)) video.currentTime = master.currentTime;
  }
  window.PXW_EMBED_API = { setActive(value) { active = Boolean(value); setPlaying(); }, refreshLabels };
  const requested = new URLSearchParams(location.search).get('scene');
  const initial = manifest.scenes.findIndex(scene => scene.id === requested);
  setSplit(50);
  select(initial < 0 ? 0 : initial);
  requestAnimationFrame(tick);
})();
