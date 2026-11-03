/**
 * Shared route icons and the open/closed-loop diagram (Applications). The Method figures live in ./method/.
 */
import { applyI18n } from '../i18n/index.js';

const ROUTE_ICONS = {
  video: '<svg viewBox="0 0 20 20"><rect x="2.5" y="5" width="11" height="10" rx="1.5"/><path d="M13.5 8.5 17.5 6v8l-4-2.5"/></svg>',
  image: '<svg viewBox="0 0 20 20"><rect x="2.5" y="3.5" width="15" height="13" rx="1.5"/><path d="M2.5 13l4-4 3.5 3.5 2.5-2.5 5 5"/><circle cx="13" cy="7.5" r="1.4"/></svg>',
  gs: '<svg viewBox="0 0 20 20"><ellipse cx="7" cy="8" rx="4" ry="2.6" transform="rotate(-25 7 8)"/><ellipse cx="13" cy="12" rx="4.4" ry="2.4" transform="rotate(20 13 12)"/><ellipse cx="8.5" cy="14" rx="2.6" ry="1.6"/></svg>',
  pc: '<svg viewBox="0 0 20 20"><g fill="currentColor" stroke="none"><circle cx="4" cy="12" r="1"/><circle cx="7" cy="8" r="1"/><circle cx="10" cy="11" r="1"/><circle cx="13" cy="6" r="1"/><circle cx="16" cy="10" r="1"/><circle cx="6" cy="15" r="1"/><circle cx="11" cy="15" r="1"/><circle cx="15" cy="14" r="1"/><circle cx="9" cy="4.5" r="1"/></g></svg>',
};

/** Fill <span class="route-icon" data-icon="…"> placeholders anywhere in the page. */
export function fillRouteIcons(root = document) {
  root.querySelectorAll('.route-icon[data-icon]').forEach((n) => {
    if (!n.firstChild) n.innerHTML = ROUTE_ICONS[n.dataset.icon] || '';
  });
}

/* ================================================================== open vs closed loop */
export function buildLoop() {
  const host = document.getElementById('loop-diagram');
  if (!host) return;
  host.innerHTML = `
  <div class="loops">
    <div class="loop">
      <div class="loop-head"><strong data-i18n="apps.openLoop"></strong><span data-i18n="apps.openLoopBody"></span></div>
      <div class="open-chain">
        <div class="lnode lnode-rec"><strong data-i18n="apps.oReplay"></strong><span data-i18n="apps.oReplaySub"></span></div>
        <div class="lnode lnode-policy"><strong data-i18n="apps.nPolicy"></strong><span data-i18n="apps.nPolicySub"></span></div>
        <div class="lnode"><strong data-i18n="apps.oPred"></strong><span data-i18n="apps.oPredSub"></span></div>
        <div class="lnode"><strong data-i18n="apps.nEval"></strong><span data-i18n="apps.nEvalSub"></span></div>
      </div>
      <p class="open-nofeed" data-i18n="apps.noFeedback"></p>
    </div>
    <div class="loop loop-closed">
      <div class="loop-head"><strong data-i18n="apps.closedLoop"></strong><span data-i18n="apps.closedLoopBody"></span></div>
      <div class="closed-grid">
        <div class="lnode lnode-rec"><strong data-i18n="apps.nRecorded"></strong><span data-i18n="apps.nRecordedSub"></span></div>
        <span class="h-arrow dashed a1" aria-hidden="true"></span>
        <div class="lnode lnode-policy"><strong data-i18n="apps.nPolicy"></strong><span data-i18n="apps.nPolicySub"></span></div>
        <span class="h-arrow a2" aria-hidden="true"></span>
        <div class="lnode lnode-eval"><strong data-i18n="apps.nEval"></strong><span data-i18n="apps.nEvalSub"></span></div>
        <div class="v-arrows">
          <span class="v-arrow down" data-i18n="apps.aAction"></span>
          <span class="v-arrow up" data-i18n="apps.aViews"></span>
        </div>
        <div class="lnode lnode-world"><strong data-i18n="apps.nWorld"></strong><span data-i18n="apps.nWorldSub"></span></div>
      </div>
    </div>
  </div>`;
  applyI18n(host);
}
