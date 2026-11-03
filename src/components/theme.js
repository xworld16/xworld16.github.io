const listeners = new Set();
export const getTheme = () => 'light';
export const onThemeChange = (callback) => { listeners.add(callback); return () => listeners.delete(callback); };
export function setTheme() {
  document.documentElement.dataset.theme = 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#ffffff');
  listeners.forEach((callback) => callback('light'));
}
export function initTheme() {
  setTheme();
}
