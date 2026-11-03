'use strict';
const sfEmbedded = window.parent !== window;
let sfParentActive = !sfEmbedded;
document.body.dataset.embedded = String(sfEmbedded);
function sfPost(message) { if (sfEmbedded) window.parent.postMessage(message, location.origin === 'null' ? '*' : location.origin); }
function sfReportHeight() { sfPost({ type: 'xworld-long:size', height: Math.ceil(el('app').getBoundingClientRect().height) }); }
function sfSetActive(active) {
  if (embedActive === active) return;
  embedActive = active;
  if (!active) { const keep = state.playing || (state.loading && embedResume); pause(); embedResume = keep; }
  else if (!state.loading) play();
}
function sfApplyLanguage(language) {
  sfLang = language === 'zh' ? 'zh' : 'en'; document.documentElement.lang = sfLang === 'zh' ? 'zh-CN' : 'en';
  document.title = sfLabel('title');
  for (const [id, key] of Object.entries({ comparison: 'comparison', previous: 'previous', next: 'next' })) el(id).setAttribute('aria-label', sfLabel(key));
  document.querySelector('.case-nav').setAttribute('aria-label', sfLabel('cases'));
  document.querySelector('.theme-nav').setAttribute('aria-label', sfLabel('appearance'));
  for (const m of METHODS) for (const stage of ['main', 'reference', 'current']) canvases[m][stage].setAttribute('aria-label', sfLabel(stage, { method: m === 'sf' ? 'Self Forcing' : 'Connected Self Forcing' }));
  for (const theme of ['day', 'night']) el(theme).textContent = sfLabel(theme);
  if (state.statusKey) setStatus(state.statusKey); updateUI(); sfReportHeight();
}
window.addEventListener('message', event => {
  if (!sfEmbedded || event.source !== window.parent || (location.origin !== 'null' && event.origin !== location.origin)) return;
  const data = event.data || {};
  if (data.type !== 'xworld-long:settings') return;
  sfApplyLanguage(data.lang); setTheme(data.theme === 'dark' ? 'night' : 'day');
  sfParentActive = data.active === true; sfSetActive(sfParentActive && !document.hidden);
});
document.addEventListener('visibilitychange', () => sfSetActive(sfParentActive && !document.hidden));
new ResizeObserver(sfReportHeight).observe(el('app'));
window.addEventListener('resize', sfReportHeight);
sfApplyLanguage(sfLang); setTheme(new URLSearchParams(location.search).get('theme') === 'dark' ? 'night' : 'day');
sfPost({ type: 'xworld-long:ready' }); sfReportHeight();
