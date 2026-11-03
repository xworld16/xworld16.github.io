/**
 * Minimal i18n runtime.
 *  - Dictionaries: ./en.js and ./zh.js (same keys).
 *  - Static markup:  data-i18n="key" (text) · data-i18n-html="key" (trusted dictionary markup)
 *                    data-i18n-attr="aria-label:key; title:key" · data-i18n-list="key" (array → <li>)
 *  - Dynamic text:   bind(el, () => L(obj)) for bilingual objects from content configs.
 * Switching language only rewrites text — videos, tabs and scroll position are untouched.
 */
import en from './en.js';
import zh from './zh.js';
import { site } from '../content/site.config.js';

const dicts = { en, zh };
export const LANGS = ['en', 'zh'];
let lang = site.defaultLang;
const listeners = new Set();
const bindings = new Set();

const lookup = (dict, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), dict);

export function getLang() {
  return lang;
}

export function t(key, vars) {
  let v = lookup(dicts[lang], key);
  if (v === undefined) {
    if (import.meta.env?.DEV) console.warn(`[i18n] missing "${key}" in ${lang}`);
    v = lookup(dicts.en, key);
  }
  if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? ''));
  return v ?? key;
}

/** Pick the current language from a { en, zh } object (or pass strings through). */
export function L(obj) {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] ?? obj.en ?? '';
}

/** Keep an element's text (or attribute / innerHTML) in sync with the language. */
export function bind(el, fn, prop = 'textContent') {
  const b = { el, fn, prop };
  bindings.add(b);
  run(b);
  return el;
}
function run(b) {
  const v = b.fn();
  if (b.prop === 'textContent' || b.prop === 'innerHTML') b.el[b.prop] = v;
  else b.el.setAttribute(b.prop, v);
}

export function applyI18n(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const vars = el.dataset.i18nVars ? JSON.parse(el.dataset.i18nVars) : undefined;
    el.textContent = t(el.dataset.i18n, vars);
  });
  root.querySelectorAll('[data-i18n-html]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, key] = pair.split(':').map((s) => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
  root.querySelectorAll('[data-i18n-list]').forEach((el) => {
    const items = t(el.dataset.i18nList);
    el.replaceChildren(
      ...(Array.isArray(items) ? items : []).map((s) => {
        const li = document.createElement('li');
        li.innerHTML = s;
        return li;
      }),
    );
  });
  for (const b of bindings) {
    if (!b.el.isConnected) bindings.delete(b);
    else run(b);
  }
}

function applyDocument() {
  const html = document.documentElement;
  html.lang = lang === 'zh' ? 'zh-CN' : 'en';
  html.dataset.lang = lang;
  document.title = t('meta.title');
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', t('meta.title'));
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', t('meta.description'));
  document.querySelector('meta[property="og:locale"]')?.setAttribute('content', lang === 'zh' ? 'zh_CN' : 'en_US');
}

export function setLang(next, { persist = true } = {}) {
  if (!LANGS.includes(next)) return;
  lang = next;
  if (persist) {
    try { localStorage.setItem(site.storageKey, next); } catch { /* storage unavailable: preference lasts for this visit */ }
  }
  applyDocument();
  applyI18n();
  listeners.forEach((cb) => cb(lang));
}

export function onLangChange(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Open in English unless ?lang=zh|en explicitly selects a language for this visit. */
export function initLang() {
  let initial = site.defaultLang;
  const param = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(param)) initial = param;
  lang = initial;
  applyDocument();
  applyI18n();
  return lang;
}
