import '@fontsource-variable/instrument-sans/wght.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/landing.css';
import './styles/theme.css';
import './styles/method.css';
import './styles/math.css';
import './styles/typography.css';
import './styles/grounding.css';
import './styles/opening.css';
import './styles/demo-summary.css';
import './styles/narrative.css';
import './styles/applications.css';
import './styles/foundation.css';

import { initLang, applyI18n } from './i18n/index.js';
import { buildControl, buildGrounding, buildDashcam, buildLong, applyReferenceFlags } from './components/demos.js';
import { startVideoPreload } from './components/videoPreload.js';
import { buildLanding } from './components/landing.js';
import { initTheme } from './components/theme.js';
import { buildMethodFigure } from './components/method/figure.js';
import { fillRouteIcons } from './components/diagrams.js';
import { buildApplications } from './components/applications.js';
import { buildFoundation } from './components/foundation.js';
import { buildRlEmbed } from './components/rlEmbed.js';
import { initLangToggle, initHeader, initDrawer, initScrollSpy, initReveal, initResources, initLightbox } from './components/chrome.js';

document.documentElement.classList.add('js');

initLang();
initTheme();
fillRouteIcons();
buildLanding();
buildControl();
buildGrounding();
buildDashcam();
buildLong();
buildRlEmbed();
buildMethodFigure();
buildFoundation();
buildApplications();
initResources();
applyReferenceFlags();
applyI18n();

initLangToggle();
initHeader();
initDrawer();
initScrollSpy();
initReveal();
initLightbox();

document.body.classList.remove('i18n-pending');

// On a direct chapter visit, settle the viewport after mounting the demos and
// before their visibility observers decide which media to fetch.
if (location.hash && performance.getEntriesByType('navigation')[0]?.type === 'navigate') {
  document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant' });
}

startVideoPreload().catch(() => {}); // Playback also works without background storage.
