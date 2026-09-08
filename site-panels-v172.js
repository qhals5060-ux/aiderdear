/* Presentation-only website gate. The existing renderers own all live content. */
(() => {
  'use strict';
  const html = document.documentElement;
  const marker = 'data-site-panels-v172';
  const native = () => !!(window.AiderLogNative || window.Android ||
    html.classList.contains('aiderlog-android') ||
    new URLSearchParams(location.search).has('android-preview'));
  if (native() || window.AiderLogSitePanelsV172) return;

  // These four panels are light DOM. CSS follows render/edition changes itself;
  // no observers, animation frames, duplicate folder controls or data writes.
  function refresh() {
    if (native()) {
      if (html.hasAttribute(marker)) html.removeAttribute(marker);
      return;
    }
    if (!html.hasAttribute(marker)) html.setAttribute(marker, '');
  }
  window.AiderLogSitePanelsV172 = Object.freeze({refresh});
  window.addEventListener('aiderlog-site-editionchange', refresh);
  refresh();
})();
