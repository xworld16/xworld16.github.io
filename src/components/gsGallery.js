import { gsDemos, gsViews, gsComparison } from '../content/3dgs.config.js';
import { t, onLangChange } from '../i18n/index.js';

/** One decoder paints seven generated cameras and the 3DGS comparison from the same frame. */
export function createGsGallery(host) {
  host.className = 'gs-gallery';
  host.id = 'grounding-3dgs-gallery';
  host.setAttribute('role', 'region');
  host.setAttribute('aria-labelledby', 'grounding-3dgs-title');
  host.tabIndex = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const scene = document.createElement('div');
  scene.className = 'gs-scene';
  scene.id = 'grounding-3dgs-scene';
  const stage = document.createElement('div');
  stage.className = 'gs-stage';
  stage.append(scene);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('gs-connections');
  svg.setAttribute('aria-hidden', 'true');
  scene.append(svg);
  const rails = {};
  for (const side of ['left', 'right']) {
    rails[side] = document.createElement('div');
    rails[side].className = `gs-rail gs-rail-${side}`;
    scene.append(rails[side]);
  }
  let comparisonPoster, comparisonCanvas, comparisonContext;
  const views = gsViews.map((view) => {
    const frame = document.createElement('figure');
    frame.className = `gs-view gs-view-${view.side}`;
    frame.dataset.camera = String(view.camera);
    const poster = document.createElement('img');
    poster.alt = '';
    poster.draggable = false;
    poster.loading = 'lazy';
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = view.crop.slice(2);
    canvas.setAttribute('aria-hidden', 'true');
    const cameraLabel = document.createElement('figcaption');
    cameraLabel.className = 'gs-camera-label';
    frame.append(poster, canvas, cameraLabel);
    if (view.side === 'main') {
      const comparison = document.createElement('div');
      comparison.className = 'gs-comparison';
      comparisonPoster = document.createElement('img');
      comparisonPoster.alt = '';
      comparisonPoster.draggable = false;
      comparisonPoster.loading = 'lazy';
      comparisonCanvas = document.createElement('canvas');
      [comparisonCanvas.width, comparisonCanvas.height] = gsComparison.crop.slice(2);
      comparisonCanvas.setAttribute('aria-hidden', 'true');
      comparisonContext = comparisonCanvas.getContext('2d', { alpha: false });
      comparison.append(comparisonPoster, comparisonCanvas);
      const labels = document.createElement('div');
      labels.className = 'gs-compare-labels';
      labels.innerHTML = '<span>3DGS</span><span>Diffusion</span>';
      labels.setAttribute('aria-hidden', 'true');
      const divider = document.createElement('div');
      divider.className = 'gs-compare-line';
      divider.setAttribute('aria-hidden', 'true');
      divider.innerHTML = '<span class="gs-compare-knob"><svg viewBox="0 0 24 24" fill="none"><path d="m8 7-5 5 5 5m8-10 5 5-5 5M3 12h18"/></svg></span>';
      frame.append(comparison, labels, divider);
      scene.append(frame);
    }
    return { ...view, frame, poster, canvas, cameraLabel, ctx: canvas.getContext('2d', { alpha: false }) };
  });
  for (const side of ['left', 'right']) {
    rails[side].append(...views.filter(view => view.side === side).sort((a, b) => a.row - b.row).map(view => view.frame));
  }
  const main = views[0].frame;
  main.tabIndex = 0;
  main.setAttribute('role', 'slider');
  main.setAttribute('aria-orientation', 'horizontal');
  main.setAttribute('aria-valuemin', '0');
  main.setAttribute('aria-valuemax', '100');
  const error = document.createElement('span');
  error.className = 'gs-error';
  error.setAttribute('role', 'alert');
  error.hidden = true;
  main.append(error);
  const video = document.createElement('video');
  video.className = 'gs-source';
  Object.assign(video, { muted: true, defaultMuted: true, loop: true, playsInline: true, preload: 'none' });
  video.setAttribute('playsinline', '');
  video.setAttribute('aria-hidden', 'true');
  video.tabIndex = -1;

  let current = 0, requested = 0, requestId = 0;
  let attached = false, near = false, visible = false;
  let animation = null, frameHandle = null;
  let split = 50, draggingPointer = null;
  const nativeFrames = 'requestVideoFrameCallback' in video;
  const status = document.createElement('p');
  status.className = 'gs-demo-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');

  function navigation(side, offset) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `media-carousel-nav gs-nav gs-nav-${side}`;
    button.setAttribute('aria-controls', scene.id);
    button.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${offset < 0 ? 'M15 5 8 12l7 7' : 'm9 5 7 7-7 7'}"/></svg>`;
    button.addEventListener('click', () => select(requested + offset, offset));
    stage.append(button);
    return button;
  }
  const previous = navigation('prev', -1), next = navigation('next', 1);
  host.append(video, stage, status);

  function refreshText() {
    main.setAttribute('aria-label', `${t('grounding.gsCameras.cam0')} · ${t('grounding.gsCompare')}`);
    refreshSplitValue();
    views.forEach(({ frame, camera, cameraLabel, side }) => {
      const name = t(`grounding.gsCameras.cam${camera}`);
      cameraLabel.textContent = name;
      if (side !== 'main') frame.setAttribute('aria-label', name);
    });
    status.textContent = `${String(current + 1).padStart(2, '0')} / ${String(gsDemos.length).padStart(2, '0')}`;
    status.setAttribute('aria-label', t('grounding.gsPosition', { current: current + 1, total: gsDemos.length }));
    error.textContent = t('common.loadError');
    for (const [button, offset] of [[previous, -1], [next, 1]]) {
      const index = (current + offset + gsDemos.length) % gsDemos.length;
      button.title = t(offset < 0 ? 'common.previousVideo' : 'common.nextVideo');
      button.setAttribute('aria-label', t('common.showVideo', { title: t('grounding.tab.3dgs'), number: index + 1 }));
      button.dataset.index = String(index);
    }
  }
  function posters() {
    host.dataset.active = String(current);
    host.dataset.demo = gsDemos[current].id;
    views.forEach(({ poster, camera }) => { poster.src = gsDemos[current].poster(camera); });
    comparisonPoster.src = gsDemos[current].comparisonPoster;
    host.classList.remove('has-frames');
    error.hidden = true;
    refreshText();
  }
  function paint() {
    if (video.readyState < 2 || !attached) return;
    for (const { crop: [x, y, w, h], ctx } of views) ctx.drawImage(video, x, y, w, h, 0, 0, w, h);
    const [x, y, w, h] = gsComparison.crop;
    comparisonContext.drawImage(video, x, y, w, h, 0, 0, w, h);
    host.classList.add('has-frames');
  }
  function cancelFrames() {
    if (frameHandle === null) return;
    if (nativeFrames) video.cancelVideoFrameCallback(frameHandle);
    else cancelAnimationFrame(frameHandle);
    frameHandle = null;
  }
  function requestFrame() {
    if (frameHandle !== null || video.paused || !visible || document.hidden) return;
    const nextFrame = () => { frameHandle = null; paint(); requestFrame(); };
    frameHandle = nativeFrames ? video.requestVideoFrameCallback(nextFrame) : requestAnimationFrame(nextFrame);
  }
  function attach(force = false) {
    if (attached && !force) return;
    attached = true;
    video.preload = 'auto';
    video.src = gsDemos[current].src;
    video.load();
  }
  function updatePlayback() {
    if (!visible || document.hidden) {
      video.pause();
      cancelFrames();
    } else {
      attach();
      video.play().then(requestFrame).catch(refreshText);
    }
    refreshText();
  }
  function refreshSplitValue() {
    main.setAttribute('aria-valuenow', String(Math.round(split)));
    main.setAttribute('aria-valuetext', t('grounding.gsSplitValue', { gs: Math.round(split), diffusion: 100 - Math.round(split) }));
  }
  function setSplit(value) {
    split = Math.max(0, Math.min(100, value));
    main.style.setProperty('--gs-split', `${split}%`);
    refreshSplitValue();
  }
  function moveSplit(event) {
    const bounds = main.getBoundingClientRect();
    if (bounds.width > 0) setSplit(100 * (event.clientX - bounds.left) / bounds.width);
  }
  function endDrag(event) {
    if (draggingPointer === null || (event && event.pointerId !== draggingPointer)) return;
    const pointer = draggingPointer;
    draggingPointer = null;
    main.classList.remove('is-comparing');
    if (main.hasPointerCapture(pointer)) main.releasePointerCapture(pointer);
  }
  main.addEventListener('pointerdown', (event) => {
    if (event.isPrimary === false || event.button !== 0) return;
    event.preventDefault();
    draggingPointer = event.pointerId;
    main.setPointerCapture(event.pointerId);
    main.focus({ preventScroll: true });
    main.classList.add('is-comparing');
    moveSplit(event);
  });
  main.addEventListener('pointermove', (event) => { if (event.pointerId === draggingPointer) moveSplit(event); });
  main.addEventListener('pointerup', endDrag);
  main.addEventListener('pointercancel', endDrag);
  main.addEventListener('lostpointercapture', endDrag);
  main.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const step = event.shiftKey ? 10 : 2;
    const values = { ArrowLeft: split - step, ArrowRight: split + step, ArrowDown: split - step, ArrowUp: split + step, Home: 0, End: 100, PageDown: split - 10, PageUp: split + 10 };
    if (event.key in values) {
      event.preventDefault();
      event.stopPropagation();
      setSplit(values[event.key]);
      return;
    }
  });
  function commit(index) {
    if (index === current) return;
    endDrag();
    video.pause();
    cancelFrames();
    attached = false;
    current = index;
    video.removeAttribute('src');
    video.load();
    posters();
    if (near) attach();
    updatePlayback();
  }
  async function select(index, direction = index < requested ? -1 : 1) {
    const target = (index + gsDemos.length) % gsDemos.length;
    if (target === requested) return;
    requested = target;
    const token = ++requestId;
    animation?.cancel();
    const animate = !reduced.matches && typeof scene.animate === 'function';
    if (animate) {
      host.dataset.transition = 'out';
      animation = scene.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-direction * 28}px)` }], { duration: 160, easing: 'ease-in', fill: 'forwards' });
      try { await animation.finished; } catch { /* A newer selection wins. */ }
      if (token !== requestId) return;
    }
    commit(target);
    animation?.cancel();
    if (animate) {
      host.dataset.transition = 'in';
      animation = scene.animate([{ opacity: 0, transform: `translateX(${direction * 28}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 280, easing: 'cubic-bezier(.2,.7,.2,1)' });
      try { await animation.finished; } catch { /* A newer selection wins. */ }
      if (token !== requestId) return;
    }
    animation = null;
    delete host.dataset.transition;
  }
  host.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowLeft' ? -1 : 1;
    select(requested + direction, direction);
  });
  video.addEventListener('loadeddata', () => { error.hidden = true; paint(); updatePlayback(); });
  video.addEventListener('seeked', paint);
  video.addEventListener('play', () => { refreshText(); requestFrame(); });
  video.addEventListener('pause', () => { cancelFrames(); refreshText(); });
  video.addEventListener('error', () => { if (attached) { error.hidden = false; refreshText(); } });
  document.addEventListener('visibilitychange', updatePlayback);
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      ++requestId;
      animation?.cancel();
      animation = null;
      commit(requested);
      delete host.dataset.transition;
    }
    updatePlayback();
  });
  new IntersectionObserver(([entry]) => { near = entry.isIntersecting; if (near) attach(); }, { rootMargin: '300px 0px' }).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updatePlayback(); }, { threshold: 0 }).observe(host);

  const paths = views.slice(1).map(() => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.append(path);
    return path;
  });
  function measureConnections() {
    host.style.setProperty('--gs-label-scale', String(host.getBoundingClientRect().width / 1920));
    const bounds = scene.getBoundingClientRect(), center = main.getBoundingClientRect();
    if (!bounds.width) return;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    views.slice(1).forEach((view, i) => {
      const box = view.frame.getBoundingClientRect(), left = view.side === 'left';
      const x1 = (left ? box.right : box.left) - bounds.left;
      const x2 = (left ? center.left : center.right) - bounds.left;
      const y1 = box.top + box.height / 2 - bounds.top;
      const y2 = center.top + center.height * (0.25 + view.row * 0.25) - bounds.top;
      const mid = (x1 + x2) / 2;
      paths[i].setAttribute('d', `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`);
    });
  }
  new ResizeObserver(measureConnections).observe(scene);
  onLangChange(refreshText);
  setSplit(50);
  posters();
  return { select, video };
}
