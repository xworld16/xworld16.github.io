'use strict';
const frostedEmbedded = window.parent !== window;
if (frostedEmbedded && document.body.dataset.kind === 'r2v') document.documentElement.dataset.fitFrame = 'true';
let frostedParentActive = !frostedEmbedded;
function frostedPost(data) { if (frostedEmbedded) window.parent.postMessage(data, location.origin === 'null' ? '*' : location.origin); }
function frostedReport() { frostedPost({ type: 'xworld-frosted:size', height: Math.ceil(document.querySelector('main').getBoundingClientRect().height) }); }
function frostedSettings(data) {
  frostedLang = data.lang === 'zh' ? 'zh' : 'en';
  document.documentElement.lang = frostedLang === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.theme = data.theme === 'dark' ? 'dark' : 'light';
  document.title = ft(document.body.dataset.kind) + ' · X-World 1.6';
  window.FROSTED_API.refreshText();
  frostedParentActive = data.active === true;
  window.FROSTED_API.setActive(frostedParentActive && !document.hidden); frostedReport();
}
window.addEventListener('message', event => {
  if (!frostedEmbedded || event.source !== window.parent || (location.origin !== 'null' && event.origin !== location.origin)) return;
  if (event.data?.type === 'xworld-frosted:settings') frostedSettings(event.data);
});
document.addEventListener('visibilitychange', () => window.FROSTED_API.setActive(frostedParentActive && !document.hidden));
new ResizeObserver(frostedReport).observe(document.querySelector('main'));
window.addEventListener('resize', frostedReport);
frostedSettings({ lang: frostedLang, theme: new URLSearchParams(location.search).get('theme'), active: frostedParentActive });
frostedPost({ type: 'xworld-frosted:ready' });
