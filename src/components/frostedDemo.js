import { t, getLang, onLangChange } from '../i18n/index.js';
import { getTheme, onThemeChange } from './theme.js';

export function createFrostedDemo(host, kind) {
  host.className = 'frosted-demo'; host.dataset.kind = kind;
  const frame = document.createElement('iframe'); frame.className = 'frosted-frame'; frame.loading = 'lazy'; frame.setAttribute('allow', 'autoplay');
  const status = document.createElement('p'); status.className = 'frosted-loading'; status.setAttribute('role', 'status');
  let visible = false;
  function settings() {
    frame.title = t(`frosted.${kind}`); status.textContent = t('frosted.loading');
    if (frame.hasAttribute('src')) frame.contentWindow?.postMessage({ type: 'xworld-frosted:settings', lang: getLang(), theme: getTheme(), active: visible && !document.hidden }, location.origin);
  }
  frame.addEventListener('load', settings);
  window.addEventListener('message', event => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'xworld-frosted:ready') { status.hidden = true; settings(); }
    if (event.data?.type === 'xworld-frosted:size' && Number.isFinite(event.data.height)) frame.style.height = `${Math.max(180, Math.min(1600, Math.ceil(event.data.height)))}px`;
  });
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !frame.hasAttribute('src')) frame.src = `frosted-demo/${kind}.html?lang=${getLang()}&theme=${getTheme()}`;
  }, { rootMargin: '250px 0px' }).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; settings(); }).observe(host);
  document.addEventListener('visibilitychange', settings); onLangChange(settings); onThemeChange(settings);
  host.replaceChildren(frame, status); settings();
}
