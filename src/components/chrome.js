/** Page chrome: language toggle, header state, mobile drawer, scroll-spy, reveal, resources, lightbox. */
import { site } from '../content/site.config.js';
import { t, L, bind, getLang, setLang, onLangChange } from '../i18n/index.js';

export function initLangToggle() {
  const sync = () => {
    document.querySelectorAll('[data-lang-btn]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === getLang())));
  };
  document.querySelectorAll('[data-lang-btn]').forEach((b) =>
    b.addEventListener('click', () => {
      if (b.dataset.langBtn !== getLang()) setLang(b.dataset.langBtn);
    }),
  );
  onLangChange(sync);
  sync();
}

export function initHeader() {
  const header = document.getElementById('site-header');
  const bar = document.getElementById('read-progress-bar');
  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update, { passive: true });
  update();
}

export function initDrawer() {
  const btn = document.getElementById('menu-btn');
  const drawer = document.getElementById('drawer');
  if (!btn || !drawer) return;
  const set = (open) => {
    drawer.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
    btn.dataset.i18nAttr = `aria-label:${open ? 'a11y.menuClose' : 'a11y.menuOpen'}`;
    btn.setAttribute('aria-label', t(open ? 'a11y.menuClose' : 'a11y.menuOpen'));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) drawer.querySelector('a')?.focus();
  };
  btn.addEventListener('click', () => set(drawer.hidden));
  drawer.addEventListener('click', (e) => {
    if (e.target.closest('a')) set(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !drawer.hidden) {
      set(false);
      btn.focus();
    }
  });
  matchMedia('(min-width: 1240px)').addEventListener('change', (e) => e.matches && set(false));
}

export function initScrollSpy() {
  const links = [...document.querySelectorAll('[data-nav]')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const advances = new Set(['control', 'grounding', 'posttraining']);
  const setActive = (id) => {
    links.forEach((a) => a.classList.toggle('is-active', a.dataset.nav === id ||
      (a.closest('.site-header') && a.dataset.nav === 'control' && advances.has(id))));
    sections.forEach((section) => section.classList.toggle('is-current', section.id === id));
  };
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
    },
    { rootMargin: '-40% 0px -55% 0px' },
  );
  sections.forEach((s) => obs.observe(s));
  // hero
  const hero = document.getElementById('top');
  new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive('')), { rootMargin: '-40% 0px -55% 0px' }).observe(hero);
}

export function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((n) => n.classList.add('is-in'));
    return;
  }
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries)
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          obs.unobserve(e.target);
        }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
  );
  items.forEach((n) => obs.observe(n));
}

export function initResources() {
  const r = site.report;
  document.querySelectorAll('.js-report-title').forEach((el) => (el.textContent = r.title));
  document.querySelectorAll('.js-report-link').forEach((a) => (a.href = r.href));
  const meta = document.querySelector('.js-report-meta');
  if (meta) bind(meta, () => t('resources.reportMeta', { p: r.pages }));
  document.querySelectorAll('.js-draft').forEach((n) => (n.hidden = !r.isDraft));

  // Optional links: hidden until configured
  const linksHost = document.getElementById('res-links');
  const labels = { code: 'resources.code', models: 'resources.models', arxiv: 'resources.arxiv', video: 'resources.video' };
  let any = false;
  for (const [k, href] of Object.entries(site.links)) {
    if (!href) continue;
    any = true;
    const a = document.createElement('a');
    a.className = 'btn btn-sm btn-outline';
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener';
    bind(a, () => t(labels[k] || k));
    linksHost.append(a);
  }
  const more = document.querySelector('.js-more-soon');
  if (more) more.hidden = any && !!site.bibtex;

  const list = document.getElementById('related-list');
  for (const item of site.related) {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = item.href;
    a.target = '_blank';
    a.rel = 'noopener';
    const span = document.createElement('span');
    bind(span, () => L(item.label));
    const small = document.createElement('small');
    small.textContent = item.meta;
    a.append(span, small);
    li.append(a);
    list.append(li);
  }

  const cite = document.getElementById('cite-block');
  if (site.bibtex && cite) {
    cite.hidden = false;
    document.getElementById('cite-text').textContent = site.bibtex.trim();
    const copy = document.getElementById('cite-copy');
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(site.bibtex.trim());
        copy.textContent = t('resources.copied');
        setTimeout(() => (copy.textContent = t('resources.copy')), 1600);
      } catch {
        /* clipboard unavailable */
      }
    });
  }
}

export function initLightbox() {
  const dlg = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  if (!dlg || !img) return;
  document.querySelectorAll('.js-zoom').forEach((b) =>
    b.addEventListener('click', () => {
      const src = b.querySelector('img');
      img.src = src.currentSrc || src.src;
      img.alt = src.alt;
      dlg.showModal();
    }),
  );
  dlg.addEventListener('click', () => dlg.close());
}
