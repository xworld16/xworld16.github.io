/**
 * Demo sections built from media.config.js + dictionaries:
 *   hero · 01 controllable generation · 02 scene-grounded generation · 03 dashcam → multiview · 04 long-horizon
 */
import { media } from '../content/media.config.js';
import { site } from '../content/site.config.js';
import { applyI18n } from '../i18n/index.js';
import { createVideoStage } from './videoStage.js';
import { createLongPresentation } from './longPresentation.js';
import { createFrostedDemo } from './frostedDemo.js';
import { createGsGallery } from './gsGallery.js';
import { createPointCloudDemo } from './pointCloudDemo.js';
import { createTabs } from './tabs.js';

const bySection = (s) => media.filter((m) => m.section === s);

/* ------------------------------------------------------------------ 01 control */
const CONTROL_ORDER = ['lane', 'road_marker', 'traffic_light'];

export function buildControl() {
  const host = document.getElementById('control-demo');
  if (!host) return;
  const entries = CONTROL_ORDER.map((type) => bySection('control').find((m) => m.controlType === type)).filter(Boolean);
  const panelId = 'control-panel';

  const body = document.createElement('div');
  body.className = 'demo-body';
  body.id = panelId;
  body.setAttribute('role', 'tabpanel');
  const mediaCol = document.createElement('div');
  mediaCol.className = 'demo-media';
  body.append(mediaCol);
  let automatic = true;
  let selected = false;
  const stage = createVideoStage(mediaCol, {
    mediaId: entries[0].id,
    caption: false,
    loop: false,
    onEnded: () => {
      if (!automatic) return;
      const index = entries.findIndex((m) => m.controlType === tabs.current);
      tabs.select(entries[(index + 1) % entries.length].controlType);
    },
  });

  const tabs = createTabs(
    host,
    entries.map((m) => ({ id: m.controlType, labelKey: `control.tab.${m.controlType}` })),
    {
      panelId,
      onSelect: (type, user) => {
        if (user) automatic = false;
        stage.setLoop(!automatic);
        // A logical example restarts even while every example shares the same file.
        stage.setMedia(entries.find((m) => m.controlType === type).id, { restart: selected });
        selected = true;
      },
    },
  );
  host.append(body);
  applyI18n(host);
  tabs.select(entries[0].controlType);
}

/* ------------------------------------------------------------------ 02 scene grounding */
const GROUNDING_ORDER = ['reference_images', '3dgs', 'point_cloud'];

export function buildGrounding() {
  const host = document.getElementById('grounding-demo');
  if (!host) return;
  host.replaceChildren();
  for (const type of GROUNDING_ORDER) buildGroundingGroup(host, type);
  applyI18n(host);
}

function buildGroundingGroup(host, type) {
  const group = document.createElement('section');
  group.className = 'grounding-group';
  group.dataset.category = type;
  const intro = document.createElement('header');
  intro.className = 'grounding-group-head';
  const heading = document.createElement('h3');
  heading.id = 'grounding-' + type + '-title';
  heading.dataset.i18n = `grounding.tab.${type}`;
  group.setAttribute('aria-labelledby', heading.id);
  const summary = document.createElement('p');
  summary.className = 'grounding-group-summary';
  summary.id = 'grounding-' + type + '-summary';
  summary.dataset.i18n = `grounding.gallery.${type}.summary`;
  group.setAttribute('aria-describedby', summary.id);
  intro.append(heading, summary);
  const videos = document.createElement('div');
  videos.className = 'grounding-videos';
  const footnote = document.createElement('p');
  footnote.className = 'grounding-footnote';
  footnote.dataset.i18n = `grounding.gallery.${type}.footnote`;
  group.append(intro, videos, footnote);
  host.append(group);
  if (type === '3dgs') {
    createGsGallery(videos);
    return;
  }
  if (type === 'point_cloud') {
    createPointCloudDemo(videos);
    return;
  }
  createFrostedDemo(videos, 'r2v');
}

/* ------------------------------------------------------------------ 03 dashcam */
export function buildDashcam() {
  const host = document.getElementById('dashcam-stage');
  if (!host) return;
  createFrostedDemo(host, 'dashcam');
}

/* ------------------------------------------------------------------ 04 long-horizon */
export function buildLong() {
  const host = document.getElementById('long-stage');
  if (!host) return;
  createLongPresentation(host);
}

/* ------------------------------------------------------------------ reference / placeholder notes */
export function applyReferenceFlags() {
  const show = site.flags.showReferenceBadges;
  const control = bySection('control');
  const long = bySection('long')[0];
  const notes = {
    // all control tabs still point at one shared clip
    control: control.length > 1 && new Set(control.map((m) => m.src)).size === 1 && control.every((m) => m.isReference),
    // the long-horizon clip is declared as reusing other footage
    long: !!(long?.isReference && long.sharedWith?.length),
  };
  document.querySelectorAll('[data-ref-note]').forEach((n) => (n.hidden = !(show && notes[n.dataset.refNote])));
  const notice = document.querySelector('.js-ref-notice');
  if (notice) notice.hidden = !(media.some((m) => m.isReference) && site.flags.showReferenceNotice);
}
