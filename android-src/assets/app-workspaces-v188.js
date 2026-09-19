/* Approved compact workspace presentation. Existing nodes, data and handlers
   remain authoritative; this module never persists or seeds application data. */
(() => {
  'use strict';
  const wide = matchMedia('(min-width:600px) and (min-height:480px)');
  const eventRoot = document.getElementById('event');
  let layout = null;

  function arrangeEvent() {
    if (!layout?.page.isConnected) return;
    const {page, header, tabs, sidebar, content, filters} = layout;
    if (tabs.parentElement !== header) header.querySelector('.page-title')?.after(tabs);
    for (const {node, placeholder} of filters) {
      if (wide.matches) {
        if (node.parentElement !== sidebar) sidebar.append(node);
      } else if (node.previousSibling !== placeholder) placeholder.after(node);
    }
    const occupied = [...sidebar.children].some(node => node.children.length);
    page.classList.toggle('workspace-sidebar-v188', wide.matches && occupied);
    content.classList.toggle('workspace-content-wide-v188', wide.matches);
  }

  function decorateEvent() {
    const root = eventRoot, page = root?.querySelector(':scope > .page');
    const header = page?.querySelector(':scope > .barebar');
    const tabs = page?.querySelector('.event-word-tabs-v157');
    const content = page?.querySelector('.event-content-v164');
    if (!header || !tabs || !content || page.dataset.workspaceV188) return;
    page.dataset.workspaceV188 = '1';
    root.classList.add('workspace-event-v188');
    header.classList.add('workspace-event-head-v188');
    header.querySelector('.page-title')?.after(tabs);

    const actions = document.createElement('div');
    actions.className = 'workspace-event-actions-v188';
    const sort = root.querySelector('#recordSortV111,#archiveSortV111,#travelSortV111');
    if (sort) {
      const picker = sort.closest('.er186-picker') || sort;
      actions.append(picker);
      sort.setAttribute('aria-label', '정렬 기준');
    }
    const add = root.querySelector('[data-event-create], [data-travel-folder-new]');
    if (add) {
      add.textContent = add.hasAttribute('data-travel-folder-new') ? '+ 여행지' : '+ 기록';
      actions.append(add);
    }
    header.append(actions);

    const recordTools = root.querySelector('.er186-record-tools');
    const album = header.querySelector('[data-open-albums]');
    if (album && recordTools) {
      recordTools.append(album);
      album.querySelector('span')?.remove();
      album.setAttribute('aria-label', '앨범 선택');
    }
    const date = root.querySelector('#recordDateV111');
    if (date && recordTools) {
      const reset = document.createElement('button');
      reset.type = 'button'; reset.className = 'workspace-date-reset-v188';
      reset.textContent = '×'; reset.setAttribute('aria-label', '날짜 필터 해제');
      reset.hidden = !date.value;
      reset.addEventListener('click', () => { date.value = ''; date.dispatchEvent(new Event('change', {bubbles:true})); });
      date.closest('.er186-picker').after(reset);
    }
    root.querySelectorAll('.er186-archive-tools:empty').forEach(node => node.remove());
    root.querySelectorAll('[data-archive-category]').forEach(button => {
      const key = button.dataset.archiveCategory;
      button.textContent = key === 'performance' ? 'stage' : key;
      if (key === 'performance') button.setAttribute('aria-label', '공연 · stage');
    });
    root.querySelectorAll('.event-archive-copy-v111 > em').forEach(node => { node.textContent = 'want'; });
    root.querySelectorAll('.travel-log-card-v148').forEach(card => {
      const media = card.querySelector('.travel-log-media-v148');
      if (media && !media.querySelector('img,video,[data-event-file]')) {
        const kind = media.querySelector('em');
        const copy = card.querySelector('.travel-log-copy-v148');
        if (kind && copy) { kind.classList.add('workspace-travel-kind-v188'); copy.prepend(kind); }
        media.classList.add('workspace-media-empty-v188');
      }
    });
    root.querySelectorAll('.insta-card-v148 > header').forEach(cardHeader => {
      const badge = cardHeader.querySelector(':scope > i');
      const dateText = cardHeader.querySelector('small')?.textContent || '';
      const match = dateText.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (badge && match) {
        badge.classList.add('workspace-date-stamp-v188');
        const day = document.createElement('b'), month = document.createElement('small');
        day.textContent = match[3];
        month.textContent = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][+match[2]-1];
        badge.replaceChildren(day, month);
        badge.setAttribute('aria-hidden', 'true');
      }
    });

    const workspace = page.querySelector('.er187-workspace');
    const sidebar = workspace?.querySelector('.er187-sidebar');
    if (sidebar) {
      const filterNodes = [...root.querySelectorAll('.er186-record-tools,.er186-travel-tools')];
      const filters = filterNodes.map(node => {
        const placeholder = document.createComment('Compact workspace filter position');
        node.before(placeholder); return {node, placeholder};
      });
      layout = {page, header, tabs, sidebar, content, filters};
      arrangeEvent();
    }
  }

  if (eventRoot && typeof window.renderEvent === 'function') {
    const previous = window.renderEvent;
    window.renderEvent = function (...args) {
      const result = previous.apply(this, args); decorateEvent(); return result;
    };
    wide.addEventListener('change', arrangeEvent);
    decorateEvent();
  }

  // My's internal renderers are closures. Observe only newly rendered hub heads;
  // keep permission gates, original workspace modules and their listeners intact.
  const myRoot = document.getElementById('fifth');
  function decorateMy() {
    if (!myRoot) return;
    myRoot.classList.add('workspace-my-v188');
    const hub = myRoot.querySelector('.my166-page');
    if (!hub || hub.dataset.workspaceV188) return;
    hub.dataset.workspaceV188 = '1';
    const title = hub.querySelector('.my166-head h1');
    if (title) title.textContent = 'My Space';
  }
  if (myRoot) {
    let queued = false;
    new MutationObserver(() => {
      if (queued) return;
      queued = true;
      queueMicrotask(() => { queued = false; decorateMy(); });
    }).observe(myRoot, {childList:true, subtree:true});
    decorateMy();
  }
})();
