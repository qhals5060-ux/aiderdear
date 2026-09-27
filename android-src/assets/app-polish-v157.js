(() => {
  'use strict';

  const selector = [
    '#event .event-editor-overlay-v111',
    '.schedule-dialog-v125.on',
    '.schedule-dialog-v119.on',
    '.emotion-dialog-v119.on',
    '#recordModal.modal.on',
    '#personalModal.modal.on',
    '.travel-folder-dialog-v125.on'
  ].join(',');
  let queued = false;

  function alignBottomSheets() {
    queued = false;
    document.querySelectorAll(selector).forEach(overlay => {
      overlay.style.setProperty('--aiderlog-overlay-shift-v157', '0px');
      const top = overlay.getBoundingClientRect().top;
      if (Math.abs(top) > .5) {
        overlay.style.setProperty('--aiderlog-overlay-shift-v157', `${-top}px`);
      }
    });
  }

  function queueAlignment() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(alignBottomSheets);
  }

  new MutationObserver(queueAlignment).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });
  window.addEventListener('resize', queueAlignment, { passive: true });
  window.addEventListener('orientationchange', queueAlignment, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') queueAlignment();
  });
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', queueAlignment, { once: true })
    : queueAlignment();
})();
