import { t, getLang, onLangChange } from '../i18n/index.js';

export function createPointCloudDemo(host) {
  host.className = 'pointcloud-demo';
  const frame = document.createElement('iframe');
  frame.className = 'pointcloud-frame';
  frame.loading = 'lazy';
  frame.allowFullscreen = true;
  frame.setAttribute('allow', 'fullscreen');
  host.append(frame);
  let near = false, visible = false;
  const theme = () => document.documentElement.dataset.theme === 'dark' ? 'night' : 'day';
  function settings() {
    frame.title = t('pointcloud.viewer');
    if (!frame.hasAttribute('src')) return;
    frame.contentWindow?.postMessage({ type: 'xworld-pointcloud-settings', lang: getLang(), theme: theme(), active: visible && !document.hidden }, location.origin);
  }
  frame.addEventListener('load', settings);
  window.addEventListener('message', (event) => {
    if (event.source !== frame.contentWindow || event.origin !== location.origin) return;
    if (event.data?.type === 'xworld-pointcloud-ready') settings();
    if (event.data?.type === 'xworld-pointcloud-size' && Number.isFinite(event.data.height)) {
      frame.style.height = `${Math.max(120, Math.min(2400, Math.ceil(event.data.height)))}px`;
    }
  });
  new IntersectionObserver(([entry]) => {
    near = entry.isIntersecting;
    if (near && !frame.hasAttribute('src')) {
      frame.src = `pointcloud-demo/index.html?lang=${getLang()}&theme=${theme()}`;
    }
  }, { rootMargin: '300px 0px' }).observe(host);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; settings(); }).observe(host);
  new MutationObserver(settings).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', settings);
  onLangChange(settings);
  settings();
}
