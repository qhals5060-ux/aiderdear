/* AiderLog v161 · keep the native chrome and system palette in sync. */
(() => {
  'use strict';
  const root = document.documentElement;
  function syncSystemPalette() {
    const theme = window.AiderLogThemeV125;
    const scheme = theme?.refreshSystemScheme?.() || root.dataset.systemScheme || 'light';
    const styles = getComputedStyle(root);
    const color = styles.getPropertyValue(root.dataset.backgroundMode === 'light' ? '--app-canvas' : '--app-space-base').trim()
      || '#231E35';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', color);
    window.dispatchEvent(new CustomEvent('aiderlog-system-palette', {
      detail: { scheme, color }
    }));
  }

  new MutationObserver(records => {
    if (records.some(record => record.type === 'attributes' && ['data-theme','data-background-mode','data-system-scheme'].includes(record.attributeName))) {
      syncSystemPalette();
    }
  }).observe(root, { attributes: true, attributeFilter: ['data-theme','data-background-mode','data-system-scheme'] });
  window.addEventListener('pageshow', syncSystemPalette, { passive: true });
  window.addEventListener('aiderlog-native-resume', syncSystemPalette, { passive: true });
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', syncSystemPalette, { once: true })
    : syncSystemPalette();
  setTimeout(syncSystemPalette, 2600);
})();
