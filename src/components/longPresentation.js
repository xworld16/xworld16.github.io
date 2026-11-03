import { t, getLang, onLangChange } from '../i18n/index.js';
import { getTheme, onThemeChange } from './theme.js';

/** The supplied SF/CSF presentation, loaded near the viewport and paused off screen. */
export function createLongPresentation(host) {
  host.classList.add('long-presentation');
  const frame = document.createElement('iframe');
  frame.className = 'long-presentation-frame'; frame.loading = 'lazy'; frame.setAttribute('allow', 'autoplay');
  const status = document.createElement('p'); status.className = 'long-presentation-loading'; status.setAttribute('role', 'status');
  let visible = false;
  function settings() {
    frame.title = t('long.iframeTitle'); status.textContent = t('long.loading');
    if (frame.hasAttribute('src')) frame.contentWindow?.postMessage({ type: 'xworld-long:settings', lang: getLang(), theme: getTheme(), active: visible && !document.hidden }, location.origin);
  }
  frame.addEventListener('load', settings);
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'xworld-long:ready') { status.hidden = true; settings(); }
    if (event.data?.type === 'xworld-long:size' && Number.isFinite(event.data.height)) frame.style.height = `${Math.max(240, Math.min(2000, Math.ceil(event.data.height)))}px`;
  });
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !frame.hasAttribute('src')) frame.src = `long-presentation/index.html?v=case-nav-2&lang=${getLang()}&theme=${getTheme()}`;
  }, { rootMargin: '300px 0px' }).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; settings(); }).observe(host);
  document.addEventListener('visibilitychange', settings);
  onLangChange(settings); onThemeChange(settings);
  host.replaceChildren(frame, status); settings();
}
