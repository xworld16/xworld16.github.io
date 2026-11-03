/**
 * Embeds the adapted RL comparison component (public/rl-comparison/) in an iframe.
 *  - created lazily when the section approaches the viewport
 *  - language is passed on load (?lang=) and synced live via postMessage — the component re-labels in place,
 *    so the shared playback position survives a language switch
 *  - the component reports its content height so the iframe never crops; it is paused when scrolled away
 */
import { site } from '../content/site.config.js';
import { t, getLang, onLangChange } from '../i18n/index.js';
import { getTheme, onThemeChange } from './theme.js';

export function buildRlEmbed() {
  const frame = document.getElementById('rl-frame');
  const body = document.getElementById('rl-frame-body');
  const status = document.getElementById('rl-frame-status');
  if (!frame || !body) return;

  let iframe = null;
  let ready = false;
  let failTimer = 0;
  let visible = false;

  const post = (msg) => {
    try {
      iframe?.contentWindow?.postMessage(msg, location.origin === 'null' ? '*' : location.origin);
    } catch {
      /* ignore */
    }
  };

  const create = () => {
    if (iframe) return;
    iframe = document.createElement('iframe');
    iframe.src = `${site.rl.path}?embed=1&lang=${getLang()}&theme=${getTheme()}`;
    iframe.setAttribute('allow', 'autoplay');
    iframe.setAttribute('loading', 'lazy');
    iframe.title = t('rl.iframeTitle');
    iframe.style.height = '640px';
    body.append(iframe);
    failTimer = setTimeout(() => {
      if (!ready) {
        status.hidden = false;
        status.innerHTML = '';
        const p = document.createElement('span');
        p.textContent = t('rl.error');
        status.append(p);
      }
    }, 20000);
  };

  addEventListener('message', (e) => {
    if (!iframe || e.source !== iframe.contentWindow || (location.origin !== 'null' && e.origin !== location.origin)) return;
    const d = e.data || {};
    if (d.type === 'xworld-rl:ready') {
      ready = true;
      clearTimeout(failTimer);
      status.hidden = true;
      post({ type: 'xworld:lang', lang: getLang() });
      post({ type: 'xworld:theme', theme: getTheme() });
      post({ type: 'xworld:visibility', visible });
    }
    if (d.type === 'xworld-rl:height' && Number.isFinite(d.height)) {
      iframe.style.height = `${Math.max(280, Math.min(3000, Math.ceil(d.height)))}px`;
    }
  });

  onLangChange((lang) => {
    if (iframe) iframe.title = t('rl.iframeTitle');
    post({ type: 'xworld:lang', lang });
  });
  onThemeChange((theme) => { post({ type: 'xworld:theme', theme }); });

  new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) create();
      }
    },
    { rootMargin: '600px 0px' },
  ).observe(frame);
  new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        visible = e.isIntersecting;
        post({ type: 'xworld:visibility', visible });
      }
    },
    { threshold: 0 },
  ).observe(frame);
}
