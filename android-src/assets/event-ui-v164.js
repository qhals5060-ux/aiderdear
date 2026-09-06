/* Presentation only: keep Event's existing state, data fields and delegated handlers. */
(() => {
  'use strict';
  const root = document.getElementById('event');
  if (!root || typeof window.renderEvent !== 'function') return;
  const previousRender = window.renderEvent;
  root.classList.add('event-ui-v164');
  function viewport() {
    const vv = window.visualViewport;
    root.style.setProperty('--event-viewport-height', `${vv?.height || innerHeight}px`);
    root.style.setProperty('--event-viewport-top', `${vv?.offsetTop || 0}px`);
  }
  window.renderEvent = function (...args) {
    const result = previousRender.apply(this, args);
    const page = root.querySelector(':scope > .page');
    if (!page) return result;
    const header = page.querySelector(':scope > .barebar');
    const tabs = header?.querySelector('.event-word-tabs-v157');
    if (tabs) {
      tabs.setAttribute('role', 'tablist'); tabs.setAttribute('aria-label', 'Event 기록 유형');
      tabs.querySelectorAll('[data-event-mode]').forEach(b => {
        b.setAttribute('role', 'tab'); b.setAttribute('aria-selected', String(b.classList.contains('active')));
      });
      header.after(tabs);
    }
    const content = document.createElement('div'); content.className = 'event-content-v164';
    [...page.children].filter(node => node !== header && node !== tabs && !node.matches('.event-editor-overlay-v111'))
      .forEach(node => content.append(node));
    (tabs || header)?.after(content);
    const album = content.querySelector('[data-open-albums]');
    if (album && header) {
      const caption = document.createElement('span'); caption.textContent = '앨범'; album.append(caption); header.append(album);
    }
    // The selected-trip summary belongs before the feed, not below a fixed scroll box.
    const travel = content.querySelector('.travel-v111');
    const summary = travel?.querySelector(':scope > .ticket');
    const feed = travel?.querySelector(':scope > .travel-feed-v148');
    if (summary && feed) feed.before(summary);
    const form = root.querySelector('#eventEditorFormV111');
    if (form) {
      const sheet = form.closest('.event-editor-sheet-v111');
      sheet.classList.add('event-sheet-v164');
      sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
      const title = sheet.querySelector('h2');
      if (title) { title.id = 'eventEditorTitleV164'; sheet.setAttribute('aria-labelledby', title.id); }
      sheet.classList.toggle('event-record-sheet-v164', form.dataset.kind === 'record');
      const actions = form.querySelector('.event-editor-actions-v111');
      const fields = document.createElement('div'); fields.className = 'event-editor-fields-v164';
      [...form.childNodes].filter(node => node !== actions).forEach(node => fields.append(node));
      form.prepend(fields);
      const file = form.querySelector('#eventPhotoV111');
      if (file) {
        const label = file.closest('label'); label.classList.add('event-photo-field-v164');
        label.childNodes.forEach(node => { if (node.nodeType === Node.TEXT_NODE) node.textContent = '＋ 사진 추가'; });
      }
      const preview = form.querySelector('#eventPreviewV111');
      if (preview && !preview.querySelector('img,[data-event-file]')) preview.classList.add('event-preview-empty-v164');
    }
    viewport();
    return result;
  };
  window.addEventListener('resize', viewport, {passive:true});
  visualViewport?.addEventListener('resize', viewport, {passive:true});
  visualViewport?.addEventListener('scroll', viewport, {passive:true});
  window.renderEvent();
})();
