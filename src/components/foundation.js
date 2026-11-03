import { bind, L } from '../i18n/index.js';
import { foundation as copy, foundationMetrics as metrics } from '../content/foundation.js';

/** Data selection, model evaluation and their measured operating results. */
export function buildFoundation() {
  const host = document.getElementById('foundation-details');
  if (!host) return;
  const { annotation, agreement, detection } = metrics;
  host.innerHTML = `
    <section class="fnd-section" id="data" aria-labelledby="foundation-data-title">
      <header class="fnd-heading">
        <h3 id="foundation-data-title" data-foundation-copy="dataTitle"></h3>
        <p data-foundation-copy="dataLede"></p>
      </header>
      <dl class="fnd-scales">${metrics.data.map((metric, index) => `<div><dt>${metric.value}</dt><dd data-foundation-copy="scaleLabels.${index}"></dd></div>`).join('')}</dl>
      <div class="fnd-data-methods">${copy.dataMethods.map((_, index) => `<article><h4 data-foundation-copy="dataMethods.${index}.title"></h4><p data-foundation-copy="dataMethods.${index}.body"></p></article>`).join('')}</div>
    </section>
    <section class="fnd-section fnd-evaluation" id="evaluation" aria-labelledby="foundation-evaluation-title">
      <header class="fnd-heading">
        <h3 id="foundation-evaluation-title" data-foundation-copy="evaluationTitle"></h3>
        <p data-foundation-copy="evaluationLede"></p>
      </header>
      <ol class="fnd-workflow">${copy.workflow.map((_, index) => `<li><h4 data-foundation-copy="workflow.${index}.title"></h4><p data-foundation-copy="workflow.${index}.body"></p></li>`).join('')}</ol>
      <div class="fnd-evaluation-charts">
        <figure class="fnd-chart fnd-efficiency">
          <header><h4 data-foundation-copy="efficiencyTitle"></h4><p data-foundation-copy="efficiencyCohort"></p></header>
          <div class="fnd-time-saving"><strong>−${annotation.reductionPercent}%</strong><span data-foundation-copy="efficiencySaving"></span></div>
          <div class="fnd-time-row"><span data-foundation-copy="efficiencyBefore"></span><div class="fnd-time-track" aria-hidden="true"><i style="--fraction:1"></i></div><strong data-foundation-duration="beforeDays"></strong></div>
          <div class="fnd-time-row fnd-time-after"><span data-foundation-copy="efficiencyAfter"></span><div class="fnd-time-track" aria-hidden="true"><i style="--fraction:${annotation.afterDays / annotation.beforeDays}"></i></div><strong data-foundation-duration="afterDays"></strong></div>
          <figcaption data-foundation-copy="efficiencyNote"></figcaption>
        </figure>
        <figure class="fnd-chart fnd-agreement">
          <header><h4 data-foundation-copy="agreementTitle"></h4><p data-foundation-copy="agreementCohort"></p></header>
          <div class="fnd-accuracy-plot">
            ${agreement.models.map((model, index) => `<div class="fnd-accuracy-row fnd-accuracy-${model.key}">
              <div class="fnd-accuracy-label"><span data-foundation-copy="evaluatorNames.${index}"></span><small><span data-foundation-copy="agreementInterval"></span>: ${model.ci[0]}–${model.ci[1]}%</small></div>
              <div class="fnd-accuracy-track" aria-hidden="true">
                <i class="fnd-baseline" style="left:${agreement.majorityBaseline}%"></i>
                <i class="fnd-confidence" style="left:${model.ci[0]}%;width:${model.ci[1] - model.ci[0]}%"></i>
                <i class="fnd-estimate" style="left:${model.accuracy}%"></i>
              </div>
              <strong>${model.accuracy}%</strong>
            </div>`).join('')}
            <div class="fnd-accuracy-axis" aria-hidden="true"><span></span><div><span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span></div><span></span></div>
          </div>
          <p class="fnd-baseline-key"><i aria-hidden="true"></i><span data-foundation-copy="agreementBaseline"></span><strong>${agreement.majorityBaseline}%</strong></p>
          <figcaption data-foundation-copy="agreementNote"></figcaption>
        </figure>
      </div>
      <div class="fnd-detection">
        <div><h4 data-foundation-copy="detectionTitle"></h4><p data-foundation-copy="detectionNote"></p></div>
        <dl><div><dt>${detection.recall.toFixed(1)}%</dt><dd data-foundation-copy="detectionRecall"></dd></div><div><dt>${detection.precision.toFixed(1)}%</dt><dd data-foundation-copy="detectionPrecision"></dd></div></dl>
      </div>
    </section>`;
  host.querySelectorAll('[data-foundation-copy]').forEach(element => {
    const value = element.dataset.foundationCopy.split('.').reduce((entry, key) => entry[key], copy);
    bind(element, () => L(value));
  });
  host.querySelectorAll('[data-foundation-duration]').forEach(element => {
    const days = annotation[element.dataset.foundationDuration];
    bind(element, () => `${days} ${L(days === 1 ? copy.day : copy.days)}`);
  });
}
