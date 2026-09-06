/* Website presentation only. Reuse original forms, records and event handlers. */
(() => {
  'use strict';
  if (window.AiderLogSiteUIV167 || window.AiderLogNative || document.documentElement.classList.contains('aiderlog-android')) return;
  const $ = (selector, root = document) => root?.querySelector(selector);
  const app = $('#app');
  if (!app) return;
  const modern = () => document.documentElement.classList.contains('modern-site');
  let frame = 0;

  function colorFields() {
    const picker = $('#recordColorPicker'), category = $('#recordMood')?.closest('.field');
    if (!picker || !category) return;
    const colors = picker.closest('.field');
    let row = $('#recordClassificationV167');
    if (!row) {
      row = document.createElement('div'); row.id = 'recordClassificationV167';
      row.className = 'record-classification-v167 full';
      category.before(row); row.append(category, colors);
    }
    const names = ['밤색', '크림색', '황금색', '벽돌색', '올리브색'];
    picker.querySelectorAll('[data-record-color]').forEach((button, index) => {
      if (button.textContent) button.textContent = '';
      button.setAttribute('aria-label', names[index] || '기록 색상');
      button.title = names[index] || '기록 색상';
      button.setAttribute('aria-pressed', String(button.classList.contains('active')));
    });
  }

  function routineOverview() {
    const stage = $('#privateStage'), workspace = $('.modern-routine-workspace');
    let dialog = $('#routineOverallDialogV167');
    if (!modern() || !workspace) { if (dialog?.open) dialog.close(); return; }
    if (!dialog) {
      dialog = document.createElement('dialog'); dialog.id = 'routineOverallDialogV167';
      dialog.className = 'site-display-dialog routine-overall-dialog-v167';
      dialog.setAttribute('aria-labelledby', 'routineOverallTitleV167');
      const head = document.createElement('header'), title = document.createElement('h2');
      title.id = 'routineOverallTitleV167'; title.textContent = '전체 루틴 통계';
      const close = document.createElement('button'); close.type = 'button';
      close.className = 'site-display-dialog-close'; close.textContent = '닫기';
      close.addEventListener('click', () => dialog.close()); head.append(title, close);
      const content = document.createElement('div'); content.className = 'routine-overall-content-v167';
      dialog.append(head, content); stage.append(dialog);
      dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    }
    const panel = $('[data-routine-overall-panel]', workspace);
    if (panel && panel.parentElement !== $('.routine-overall-content-v167', dialog)) {
      panel.open = true;
      $('.routine-overall-content-v167', dialog).replaceChildren(panel);
    }
    const navigation = $('.modern-routine-nav', workspace);
    if (navigation && !$('.routine-overall-open-v167', navigation)) {
      const button = document.createElement('button'); button.type = 'button';
      button.className = 'routine-overall-open-v167'; button.textContent = '전체 루틴 통계';
      button.addEventListener('click', () => dialog.showModal()); navigation.prepend(button);
    }
    if (dialog.open && (app.dataset.activeTab !== 'private'
      || !$('.private-dot[data-private-page="0"]')?.classList.contains('active'))) dialog.close();
  }
  function refresh() { frame = 0; colorFields(); routineOverview(); }
  function schedule() { if (!frame) frame = requestAnimationFrame(refresh); }
  new MutationObserver(records => {
    if (records.some(record => record.type === 'childList'
      || record.target.matches?.('[data-record-color],#app'))) schedule();
  }).observe(app, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-active-tab'] });
  // The record modal is outside #app in some downloaded editions.
  $('#recordColorPicker')?.addEventListener('click', schedule);
  addEventListener('aiderlog-site-editionchange', schedule);
  window.AiderLogSiteUIV167 = Object.freeze({ refresh: schedule });
  refresh();
})();
