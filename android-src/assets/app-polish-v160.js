/* AiderLog v160 · opening a record sheet must not summon the keyboard. */
(() => {
  'use strict';
  const selectors = [
    '.modal.on', '.schedule-dialog-v119.on', '.emotion-dialog-v119.on', '.schedule-dialog-v125.on',
    '.dday-dialog-v125.on', '.travel-folder-dialog-v125.on', '.event-editor-overlay-v111', '.work145-overlay'
  ];
  const opened = new WeakSet();
  function settleSheet(sheet) {
    if (!sheet || opened.has(sheet)) return;
    opened.add(sheet);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const active = document.activeElement;
      if (active && sheet.contains(active) && /^(INPUT|TEXTAREA|SELECT)$/.test(active.tagName)) active.blur();
      sheet.scrollTop = 0;
      const panel = sheet.querySelector(':scope > section, :scope > .box, :scope > [class*="sheet"]');
      if (panel) panel.scrollTop = 0;
    }));
  }
  function scan() {
    selectors.forEach(selector => document.querySelectorAll(selector).forEach(settleSheet));
  }
  new MutationObserver(records => {
    records.forEach(record => {
      if (record.type === 'attributes' && record.target instanceof Element && !record.target.matches(selectors.join(','))) opened.delete(record.target);
    });
    scan();
  }).observe(document.documentElement, {subtree:true, childList:true, attributes:true, attributeFilter:['class']});
  document.addEventListener('DOMContentLoaded', scan, {once:true});
})();
