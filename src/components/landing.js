import { landing } from '../content/landing.config.js';
import { t, bind, onLangChange } from '../i18n/index.js';
import { landingLayout } from './landing-layout.js';

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (a, b, v) => { const p = clamp((v - a) / (b - a)); return p * p * (3 - 2 * p); };
const mix = (a, b, t) => a + (b - a) * t;

export function buildLanding() {
  const section = document.getElementById('top');
  const stage = document.getElementById('landing-stage');
  const host = document.getElementById('landing-views');
  if (!stage || !host) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 959px)');
  const error = document.getElementById('landing-error');
  const video = document.createElement('video');
  Object.assign(video, { muted: true, defaultMuted: true, loop: true, playsInline: true, preload: 'none' });
  video.className = 'landing-source';
  video.setAttribute('aria-hidden', 'true');
  video.setAttribute('playsinline', '');
  video.tabIndex = -1;
  stage.append(video);

  const views = landing.views.map((view, index) => {
    const frame = document.createElement('figure');
    frame.className = `landing-view landing-view-${view.side}`;
    frame.dataset.view = view.id;
    const poster = document.createElement('img');
    if (index === 0) poster.src = view.poster;
    poster.alt = '';
    poster.fetchPriority = index === 0 ? 'high' : 'low';
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    frame.append(poster, canvas);
    bind(frame, () => t('landing.viewLabel', { n: view.id }), 'aria-label');
    host.append(frame);
    return { ...view, frame, canvas, posterImage: poster };
  });

  // All seven canvases are painted from the same decoded video frame. There are
  // no independent media clocks to drift, including across looping and pausing.
  let visible = false;
  let source = null;
  let lastProgress = -1;
  let frameHandle = null;
  const nativeFrames = 'requestVideoFrameCallback' in video;
  function paint() {
    if (video.readyState < 2) return;
    const full = source === landing.src;
    const showSides = full && lastProgress > 0.12;
    for (const view of views) {
      if (view.side !== 'main' && !showSides) continue;
      const [x, y, w, h] = full ? view.crop : [0, 0, video.videoWidth, video.videoHeight];
      if (view.canvas.width !== w || view.canvas.height !== h) {
        view.canvas.width = w;
        view.canvas.height = h;
      }
      view.canvas.getContext('2d', { alpha: false }).drawImage(video, x, y, w, h, 0, 0, w, h);
    }
    stage.classList.add('has-frames');
    if (showSides) stage.classList.add('has-side-frames');
  }
  function cancelFrames() {
    if (frameHandle === null) return;
    if (nativeFrames) video.cancelVideoFrameCallback(frameHandle);
    else cancelAnimationFrame(frameHandle);
    frameHandle = null;
  }
  function requestFrame() {
    if (frameHandle !== null || video.paused || !visible || document.hidden) return;
    const next = () => { frameHandle = null; paint(); requestFrame(); };
    frameHandle = nativeFrames ? video.requestVideoFrameCallback(next) : requestAnimationFrame(next);
  }
  function refreshPlayer() {
    error.textContent = t('landing.loadError');
  }
  function selectSource() {
    const full = !compact.matches && lastProgress > 0.12;
    if (source === landing.src || (source && !full)) return;
    // A jump to another chapter can run the scroll handler before the observer.
    const bounds = stage.getBoundingClientRect();
    if (bounds.bottom <= 0 || bounds.top >= innerHeight) return;
    const time = video.currentTime;
    source = full ? landing.src : landing.openingSrc;
    if (full) views.slice(1).forEach(view => { view.posterImage.src = view.poster; });
    cancelFrames();
    video.src = source;
    if (time > 0) video.currentTime = time;
  }
  function updatePlayback() {
    if (!visible || document.hidden) {
      video.pause();
      cancelFrames();
    } else {
      selectSource();
      if (source) video.play().then(requestFrame).catch(refreshPlayer);
    }
    refreshPlayer();
  }
  video.addEventListener('loadeddata', () => { error.hidden = true; paint(); updatePlayback(); });
  video.addEventListener('seeked', paint);
  video.addEventListener('play', () => { refreshPlayer(); requestFrame(); });
  video.addEventListener('pause', () => { cancelFrames(); refreshPlayer(); });
  video.addEventListener('error', () => { error.hidden = false; refreshPlayer(); });
  document.addEventListener('visibilitychange', updatePlayback);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updatePlayback(); }, { threshold: 0 })
    .observe(stage);
  onLangChange(refreshPlayer);

  const connectionSvg = stage.querySelector('.landing-connections');
  const worldTitle = stage.querySelector('.landing-world-title');
  const worldCaption = stage.querySelector('.landing-world-caption');
  const connectionGroup = connectionSvg.querySelector('g');
  const paths = views.slice(1).map(() => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    connectionGroup.append(p);
    return p;
  });
  let geometry;
  let layoutRequest = null;
  const place = (el, rect) => {
    el.style.left = `${rect.x}px`;
    el.style.top = `${rect.y}px`;
    el.style.width = `${rect.w}px`;
    el.style.height = `${rect.h}px`;
  };
  function measure() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const fit = landingLayout({
      width: w, height: h,
      titleBottom: worldTitle.offsetTop + worldTitle.offsetHeight,
      captionHeight: worldCaption.offsetHeight,
      aspect: landing.views[0].crop[2] / landing.views[0].crop[3],
      contentRatio: Number(getComputedStyle(stage).getPropertyValue('--desktop-content-ratio')) || 0.85,
    });
    const finalMain = fit.main;
    geometry = {
      h,
      start: fit.start,
      main: finalMain,
      end: views.map((view) => view.side === 'main' ? finalMain : fit.rail(view.side, view.row)),
    };
    stage.style.setProperty('--caption-top', `${fit.captionTop}px`);
    connectionSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    paths.forEach((path, i) => {
      const target = geometry.end[i + 1];
      const left = views[i + 1].side === 'left';
      const x1 = left ? target.x + target.w : target.x;
      const x2 = left ? finalMain.x : finalMain.x + finalMain.w;
      const y1 = target.y + target.h / 2;
      const y2 = finalMain.y + finalMain.h * (0.25 + views[i + 1].row * 0.25);
      const mid = (x1 + x2) / 2;
      path.setAttribute('d', `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`);
    });
    lastProgress = -1;
    updateLayout();
  }
  function updateLayout() {
    layoutRequest = null;
    if (!geometry) return;
    const scroll = -section.getBoundingClientRect().top;
    // Tie progress to the full sticky travel so there is no dead scroll range.
    const travel = Math.max(1, section.offsetHeight - stage.offsetHeight);
    let p = clamp(scroll / travel);
    if (reduced.matches) p = p < 0.3 ? 0 : 1;
    if (compact.matches) p = 0;
    if (p === lastProgress) return;
    lastProgress = p;
    if (visible && !document.hidden && p > 0.12 && source !== landing.src) updatePlayback();
    stage.classList.toggle('is-unfolding', p > 0.12);
    section.dataset.progress = p.toFixed(3);
    const motion = smooth(0.02, 0.68, p);
    stage.style.setProperty('--main-radius', `${8 * motion}px`);
    const copy = 1 - smooth(0.03, 0.32, p);
    const reveal = smooth(0.64, 0.84, p);
    stage.style.setProperty('--copy-opacity', copy);
    stage.style.setProperty('--copy-offset', `${-28 * (1 - copy)}px`);
    stage.style.setProperty('--world-opacity', reveal);
    stage.style.setProperty('--shade-opacity', 1 - smooth(0.04, 0.65, p));
    stage.querySelector('.landing-copy').inert = copy < 0.15;
    stage.querySelector('.landing-world-caption').inert = reveal < 0.8;
    stage.querySelector('.landing-scroll').inert = reveal > 0.9;
    const primary = {};
    for (const k of ['x', 'y', 'w', 'h']) primary[k] = mix(geometry.start[k], geometry.main[k], motion);
    place(views[0].frame, primary);
    views.slice(1).forEach((view, i) => {
      const end = geometry.end[i + 1];
      const spread = smooth(0.18 + view.row * 0.035, 0.72 + view.row * 0.035, p);
      const initial = { x: geometry.main.x + geometry.main.w / 2 - end.w / 2, y: geometry.main.y + geometry.main.h / 2 - end.h / 2, w: end.w * 0.8, h: end.h * 0.8 };
      const rect = {};
      for (const k of ['x', 'y', 'w', 'h']) rect[k] = mix(initial[k], end[k], spread);
      place(view.frame, rect);
      view.frame.style.opacity = smooth(0.15, 0.48, spread);
    });
  }
  function scheduleLayout() {
    if (layoutRequest === null) layoutRequest = requestAnimationFrame(updateLayout);
  }
  function expand() {
    if (compact.matches) { document.getElementById('overview').scrollIntoView(); return; }
    const top = section.getBoundingClientRect().top + scrollY;
    const travel = Math.max(0, section.offsetHeight - stage.offsetHeight);
    scrollTo({ top: top + travel * 0.9, behavior: reduced.matches ? 'instant' : 'smooth' });
  }
  document.getElementById('landing-expand').addEventListener('click', expand);
  document.getElementById('landing-scroll').addEventListener('click', expand);
  addEventListener('scroll', scheduleLayout, { passive: true });
  addEventListener('resize', measure, { passive: true });
  reduced.addEventListener('change', () => { measure(); });
  compact.addEventListener('change', measure);
  new ResizeObserver(measure).observe(worldTitle);
  new ResizeObserver(measure).observe(worldCaption);
  document.fonts.ready.then(measure);
  onLangChange(() => requestAnimationFrame(measure));
  measure();
  refreshPlayer();
}
