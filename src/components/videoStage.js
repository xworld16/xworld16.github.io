/**
 * Video stage: a clean looping video with lazy loading, error/loading states and bilingual captions.
 *
 *  - The <video> gets no src until the stage is near the viewport (only one request per visible player).
 *  - Autoplay (muted) while visible; leaving the viewport pauses it and returning resumes automatically.
 *  - setMedia(id, { restart }) can rewind logical examples sharing one file.
 *  - loop defaults to true; setLoop() and onEnded support sequential examples.
 */
import metaTable from '../content/media.meta.generated.js';
import { mediaById } from '../content/media.config.js';
import { site } from '../content/site.config.js';
import { t, L, onLangChange } from '../i18n/index.js';

export function fmtTime(s) {
  const v = Math.max(0, Number.isFinite(s) ? s : 0);
  const m = Math.floor(v / 60);
  return `${String(m).padStart(2, '0')}:${(v - m * 60).toFixed(1).padStart(4, '0')}`;
}

export function mediaMeta(m) {
  return metaTable[m.src] || {};
}

const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

export function createVideoStage(host, opts) {
  const options = { variant: 'demo', caption: true, loop: true, ...opts };
  const state = { media: mediaById[options.mediaId], attached: false, ended: false, endNotified: false, failed: false, visible: 0, near: false };
  let playRequest = 0;
  let wantsPlay = false;
  let pendingSeek = null;
  const timeListeners = new Set();

  const fig = el('figure', `stage stage-${options.variant}`);
  const bar = el('div', 'stage-bar');
  const led = el('span', 'stage-led');
  const title = el('span', 'stage-title');
  const chips = el('span', 'stage-chips');
  bar.append(led, title, chips);

  const viewport = el('div', 'stage-viewport');
  const video = document.createElement('video');
  video.controls = false;
  video.loop = options.loop;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.preload = 'none';
  video.disablePictureInPicture = true;
  video.tabIndex = -1;
  viewport.append(video);
  for (const c of ['tl', 'tr', 'bl', 'br']) viewport.append(el('span', `stage-corner ${c}`));
  const overlay = el('div', 'stage-overlay');
  viewport.append(overlay);

  const caption = el('figcaption', 'stage-caption');
  const desc = el('p', 'stage-desc');
  const io = el('div', 'io-chips');
  const ioIn = el('span', 'io-in');
  const ioOut = el('span', 'io-out');
  io.append(ioIn, ioOut);
  const render = el('details', 'stage-render');
  const renderSum = el('summary');
  const renderP = el('p');
  render.append(renderSum, renderP);
  caption.append(desc, io, render);

  fig.append(bar, viewport);
  if (options.caption) fig.append(caption);
  host.replaceChildren(fig);

  /* ---------- text ---------- */
  function views(m) {
    return m.views ?? (m.controlType === '3dgs' ? 1 : 7);
  }
  function refreshText() {
    const m = state.media;
    title.textContent = L(m.title);
    chips.replaceChildren();
    chips.append(el('span', 'chip', views(m) === 1 ? t('common.view1') : t('common.views7')));
    chips.append(el('span', 'chip', t(video.loop ? 'common.looped' : 'common.playsOnce')));
    if (m.isReference && site.flags.showReferenceBadges) {
      const b = el('span', 'badge badge-ref', `${t('common.referenceClip')} · ${t('common.toBeReplaced')}`);
      chips.append(b);
    }
    refreshPlaybackLabel();
    desc.textContent = L(m.description);
    ioIn.innerHTML = `<i></i>${escapeHtml(L(m.inputLabel))}`;
    ioOut.innerHTML = `<i></i>${escapeHtml(L(m.outputLabel))}`;
    render.hidden = !m.renderNote;
    renderSum.textContent = t('common.renderNote');
    renderP.textContent = L(m.renderNote);
    renderOverlay();
  }
  function refreshPlaybackLabel() {
    video.setAttribute('aria-label', L(state.media.title));
  }
  onLangChange(refreshText);

  function applyMediaAttrs() {
    const m = state.media;
    const info = mediaMeta(m);
    if (info.width && info.height) viewport.style.setProperty('--ar', `${info.width} / ${info.height}`);
    if (state.attached) video.poster = m.poster || '';
    video.loop = options.loop;
    if (options.maxH) viewport.style.setProperty('--stage-max-h', options.maxH);
  }

  /* ---------- overlay states: idle | loading | error | ended ---------- */
  let overlayMode = 'idle';
  function setOverlay(mode) {
    overlayMode = mode;
    renderOverlay();
  }
  function renderOverlay() {
    overlay.replaceChildren();
    if (overlayMode === 'loading') {
      const box = el('div', 'stage-msg');
      box.setAttribute('role', 'status');
      box.append(el('span', 'stage-spinner'), el('span', null, t('common.loading')));
      overlay.append(box);
    } else if (overlayMode === 'error') {
      const box = el('div', 'stage-msg is-error');
      box.setAttribute('role', 'alert');
      const retry = el('button', 'btn btn-sm btn-outline', t('common.retry'));
      retry.type = 'button';
      retry.addEventListener('click', () => {
        state.failed = false;
        state.attached = false;
        attach(true);
        play(true);
      });
      box.append(el('span', null, t('common.loadError')), retry);
      overlay.append(box);
    }
  }

  /* ---------- loading & playback ---------- */
  function attach(force = false) {
    if (state.attached && !force) return;
    state.attached = true;
    video.poster = state.media.poster || '';
    video.preload = 'metadata';
    video.src = state.media.src;
    video.load();
  }

  async function play(user = false) {
    if (document.hidden || (!user && state.visible < 0.5) || state.failed) return;
    wantsPlay = true;
    const request = ++playRequest;
    if (!state.attached) attach();
    if (state.ended) {
      video.currentTime = 0;
      state.ended = false;
      state.endNotified = false;
    }
    try {
      if (video.readyState < 2) setOverlay('loading');
      await video.play();
      // Late promises must not resume a hidden player or pause a newer selection.
      if (!wantsPlay || document.hidden || state.visible < 0.15) {
        if (request === playRequest) pause();
        else video.pause();
      }
    } catch (e) {
      if (request !== playRequest) return;
      if (e?.name === 'NotAllowedError' || e?.name === 'AbortError') setOverlay('idle');
      else {
        state.failed = true;
        setOverlay('error');
      }
    }
  }
  function pause() {
    wantsPlay = false;
    ++playRequest;
    video.pause();
  }
  function cancelSeek() {
    if (pendingSeek) video.removeEventListener('loadedmetadata', pendingSeek);
    pendingSeek = null;
  }
  function seek(seconds) {
    cancelSeek();
    const go = () => {
      pendingSeek = null;
      const d = video.duration || mediaMeta(state.media).duration || 0;
      video.currentTime = Math.min(Math.max(0, seconds), Math.max(0, d - 0.04));
      state.ended = false;
      state.endNotified = false;
      updateTime();
    };
    if (!state.attached) attach();
    if (video.readyState >= 1) go();
    else {
      pendingSeek = go;
      video.addEventListener('loadedmetadata', go, { once: true });
    }
  }
  function updateTime() {
    const d = video.duration || mediaMeta(state.media).duration || 0;
    const c = video.currentTime || 0;
    timeListeners.forEach((cb) => cb(c, d));
  }
  let raf = 0;
  function tick() {
    updateTime();
    raf = video.paused || !timeListeners.size ? 0 : requestAnimationFrame(tick);
  }

  video.addEventListener('play', () => {
    fig.classList.add('is-playing');
    refreshPlaybackLabel();
    if (overlayMode !== 'loading') setOverlay('none');
    if (timeListeners.size && !raf) raf = requestAnimationFrame(tick);
  });
  video.addEventListener('playing', () => setOverlay('none'));
  video.addEventListener('pause', () => {
    fig.classList.remove('is-playing');
    refreshPlaybackLabel();
    if (overlayMode === 'none' || overlayMode === 'loading') setOverlay(state.ended ? 'ended' : 'idle');
  });
  video.addEventListener('waiting', () => {
    if (!video.paused) setOverlay('loading');
  });
  video.addEventListener('canplay', () => {
    if (overlayMode === 'loading') setOverlay(video.paused ? 'idle' : 'none');
  });
  video.addEventListener('ended', () => {
    // Ignore a completion queued before a click restarted or replaced the clip.
    if (!video.ended || video.loop) return;
    wantsPlay = false;
    ++playRequest;
    state.ended = true;
    setOverlay('ended');
    notifyEnded();
  });
  video.addEventListener('loadedmetadata', updateTime);
  video.addEventListener('timeupdate', () => {
    if (video.paused) updateTime();
  });
  video.addEventListener('seeked', updateTime);
  video.addEventListener('error', () => {
    if (!state.attached) return;
    state.failed = true;
    pause();
    fig.classList.remove('is-playing');
    setOverlay('error');
  });

  /* ---------- visibility ---------- */
  const canAutoplay = () => state.media.autoplay && !state.ended && !state.failed;
  function notifyEnded() {
    if (!state.ended || state.endNotified || document.hidden || state.visible < 0.5) return;
    state.endNotified = true;
    options.onEnded?.();
  }
  function resumeVisible() {
    if (document.hidden || state.visible < 0.5) return;
    if (state.ended) notifyEnded();
    else if (canAutoplay() && video.paused) play();
  }
  const nearObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        state.near = e.isIntersecting;
        if (e.isIntersecting) attach();
      }
    },
    { rootMargin: '400px 0px' },
  );
  const visObs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        state.visible = e.intersectionRatio;
        if (e.intersectionRatio >= 0.5) resumeVisible();
        else if (e.intersectionRatio < 0.15) pause();
      }
    },
    { threshold: [0, 0.15, 0.5, 0.8] },
  );
  nearObs.observe(fig);
  visObs.observe(fig);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else resumeVisible();
  });
  /* ---------- public API ---------- */
  function setLoop(loop) {
    options.loop = Boolean(loop);
    video.loop = options.loop;
    refreshText();
  }
  function setMedia(id, { restart = false } = {}) {
    const next = mediaById[id];
    if (!next) return;
    const sameFile = next.src === state.media.src;
    const reload = !sameFile || (restart && state.failed);
    state.media = next;
    if (reload || restart) {
      pause();
      cancelSeek();
      state.ended = false;
      state.endNotified = false;
      state.failed = false;
      if (reload) {
        const wasAttached = state.attached;
        state.attached = false;
        video.removeAttribute('src');
        video.load();
        if (wasAttached || state.near) attach();
      }
      applyMediaAttrs();
      setOverlay('idle');
      if (restart) seek(0);
      if (canAutoplay()) play();
      updateTime();
    } else {
      applyMediaAttrs();
    }
    refreshText();
  }

  applyMediaAttrs();
  refreshText();
  updateTime();

  return {
    el: fig,
    video,
    get media() {
      return state.media;
    },
    setMedia,
    setLoop,
    play,
    pause,
    seek,
    onTime(cb) {
      timeListeners.add(cb);
      if (!video.paused && !raf) raf = requestAnimationFrame(tick);
      return () => timeListeners.delete(cb);
    },
  };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
