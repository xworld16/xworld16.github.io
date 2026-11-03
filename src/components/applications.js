import { createInteractionCases } from './interactionCases.js';
import { bind, L } from '../i18n/index.js';
import { applications as copy } from '../content/applications.js';

export function buildApplications() {
  const host = document.getElementById('applications-content');
  if (!host) return;
  host.innerHTML = `
    <dl class="application-uses">
      ${copy.uses.map((_, index) => `<div><dt data-app-copy="uses.${index}.title"></dt><dd data-app-copy="uses.${index}.description"></dd></div>`).join('')}
    </dl>
    <div id="interaction-cases-host"></div>
    <section class="application-evidence" aria-labelledby="application-evidence-title">
      <h4 id="application-evidence-title" data-app-copy="evidenceTitle"></h4>
      <div class="application-results">
        <div class="application-result">
          <h5 data-app-copy="fdeTitle"></h5>
          <strong class="application-fde-value">${copy.fdeValue}</strong>
          <p data-app-copy="fdeCaption"></p>
        </div>
        <div class="application-result">
          <h5 data-app-copy="thresholdTitle"></h5>
          <p data-app-copy="thresholdUnit"></p>
          <dl class="application-readings">
            ${copy.thresholds.map(row => `<div><dt>FDE &lt; ${row.threshold} m</dt><dd>+${row.gain}</dd></div>`).join('')}
          </dl>
        </div>
        <div class="application-result">
          <h5 data-app-copy="behaviorTitle"></h5>
          <p data-app-copy="behaviorUnit"></p>
          <dl class="application-readings">
            ${copy.outcomes.map((row, i) => `<div><dt data-app-copy="outcomes.${i}.label"></dt><dd>${row.value}%</dd></div>`).join('')}
          </dl>
        </div>
      </div>
      <p class="application-evidence-note" data-app-copy="evidenceNote"></p>
    </section>`;
  createInteractionCases(host.querySelector('#interaction-cases-host'));
  const lookup = key => key.split('.').reduce((entry, part) => entry[part], copy);
  host.querySelectorAll('[data-app-copy]').forEach(element => bind(element, () => L(lookup(element.dataset.appCopy))));
}
