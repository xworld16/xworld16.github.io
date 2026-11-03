/** Original Figure 3 from the technical report, exported as a scalable vector. */
import { applyI18n } from '../../i18n/index.js';

export function buildMethodFigure() {
  const host = document.getElementById('method-figure');
  if (!host) return;
  const src = 'figures/report-fig3-architecture.svg';
  host.innerHTML = `
    <figure class="method-architecture">
      <a class="architecture-image" href="${src}" target="_blank" rel="noopener" data-i18n-attr="aria-label:method.figure.viewFull">
        <img src="${src}" width="471" height="235" loading="lazy" decoding="async" data-i18n-attr="alt:method.figure.alt">
      </a>
    </figure>`;
  applyI18n(host);
}
