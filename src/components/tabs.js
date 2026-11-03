/**
 * Accessible tab list (WAI-ARIA tabs pattern): roving tabindex, ←/→/Home/End, automatic activation.
 * Labels are dictionary keys so they follow the language switch.
 */
import { applyI18n } from '../i18n/index.js';

export function createTabs(host, items, { panelId, onSelect, labelKey = 'a11y.sectionTabs' } = {}) {
  const list = document.createElement('div');
  list.className = 'tabs';
  list.setAttribute('role', 'tablist');
  list.dataset.i18nAttr = `aria-label:${labelKey}`;
  let current = items[0].id;

  const buttons = items.map((item, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.id = `${panelId}-tab-${item.id}`;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', panelId);
    b.dataset.tab = item.id;
    b.innerHTML = `<span class="tab-label">${item.idx ? `<span class="tab-idx">${item.idx}</span>` : ''}<span data-i18n="${item.labelKey}"></span></span>${
      item.subKey ? `<span class="tab-sub" data-i18n="${item.subKey}"></span>` : ''
    }`;
    b.addEventListener('click', () => select(item.id, true));
    b.addEventListener('keydown', (e) => {
      const k = e.key;
      let n = null;
      if (k === 'ArrowRight') n = (i + 1) % items.length;
      else if (k === 'ArrowLeft') n = (i - 1 + items.length) % items.length;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = items.length - 1;
      if (n == null) return;
      e.preventDefault();
      select(items[n].id, true);
      buttons[n].focus();
    });
    return b;
  });
  list.append(...buttons);
  host.append(list);
  applyI18n(list);

  function select(id, user = false) {
    current = id;
    buttons.forEach((b) => {
      const on = b.dataset.tab === id;
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
      if (on && user) b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    });
    const panel = document.getElementById(panelId);
    panel?.setAttribute('aria-labelledby', `${panelId}-tab-${id}`);
    onSelect?.(id, user);
  }

  return {
    el: list,
    select,
    get current() {
      return current;
    },
  };
}
