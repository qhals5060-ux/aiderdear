(function () {
  'use strict';

  const q = selector => document.querySelector(selector);
  const safe = value => typeof esc === 'function' ? esc(value) : String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const icon = name => {
    const paths = {
      schedule:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/><circle cx="8" cy="14" r="1"/>',
      record:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 12h6M9 16h4"/>',
      archive:'<path d="M4 7h16v13H4zM3 4h18v3H3zM9 11h6"/>',
      travel:'<path d="m3 16 18-8-7 7-2 6-2-5z"/><path d="m10 16 4-1"/>',
      paper:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/>',
      task:'<path d="M9 5h10M9 12h10M9 19h10"/><path d="m3 5 1.5 1.5L7 3.8M3 12l1.5 1.5L7 10.8M3 19l1.5 1.5L7 17.8"/>'
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.record}</svg>`;
  };

  function searchRows() {
    const items = [];
    (Array.isArray(A?.scheduleEvents) ? A.scheduleEvents : []).forEach(row => items.push({
      type:'schedule', label:'일정', title:row.title || row.name || '일정', detail:[row.date, row.time, row.ownerName].filter(Boolean).join(' · '), page:'home'
    }));
    (Array.isArray(A?.records) ? A.records : []).forEach(row => items.push({
      type:'record', label:'Record', title:row.title || '기록', detail:[row.date, row.body || row.memo || row.note].filter(Boolean).join(' · '), page:'event', mode:'record'
    }));
    (Array.isArray(A?.eventReviews) ? A.eventReviews : []).forEach(row => items.push({
      type:row.category === 'travel' ? 'travel' : 'archive', label:row.category === 'travel' ? 'Travel' : 'Archive', title:row.title || row.place || '기록', detail:[row.date, row.oneLine || row.review || row.place].filter(Boolean).join(' · '), page:'event', mode:row.category === 'travel' ? 'travel' : 'archive'
    }));
    (Array.isArray(P?.paperItems) ? P.paperItems : []).forEach(row => items.push({
      type:'paper', label:'Paper', title:row.title || '논문', detail:[row.year, row.authors, row.summary].filter(Boolean).join(' · '), page:'fifth', myMode:'paper'
    }));
    (Array.isArray(P?.consultingTasks) ? P.consultingTasks : []).forEach(row => items.push({
      type:'task', label:'Task', title:row.title || '과업', detail:[row.dueDate, row.done ? '완료' : '진행 중'].filter(Boolean).join(' · '), page:'fifth', myMode:'task'
    }));
    return items;
  }

  function installSearch() {
    const open = q('#searchBtn'), sheet = q('#searchSheet'), input = q('#globalSearch'), results = q('#searchResults'), close = q('#closeSearch');
    if (!open || !sheet || !input || !results || !close) return;
    close.innerHTML = '<span aria-hidden="true">×</span>';
    close.setAttribute('aria-label', '검색 닫기');
    input.placeholder = '일정, Record, Archive, Travel, Paper, Task 검색';
    const refresh = () => {
      const term = input.value.trim().toLocaleLowerCase('ko');
      const rows = searchRows().filter(row => !term || `${row.title} ${row.detail} ${row.label}`.toLocaleLowerCase('ko').includes(term)).slice(0, 30);
      results.innerHTML = rows.length ? rows.map((row, index) => `<button type="button" data-search-v128="${index}"><i>${icon(row.type)}</i><span><b>${safe(row.title)}</b><small>${safe(row.label)}${row.detail ? ` · ${safe(row.detail)}` : ''}</small></span></button>`).join('') : '<p class="search-empty-v128">일정이나 기록을 찾지 못했습니다.</p>';
      [...results.querySelectorAll('[data-search-v128]')].forEach((button, index) => button.onclick = () => {
        const row = rows[index];
        if (row.mode && typeof eventMode !== 'undefined') eventMode = row.mode;
        if (row.myMode) window.__aiderMyOpenV128 = row.myMode;
        sheet.classList.remove('on');
        if (typeof go === 'function') go(row.page, false, !!row.mode);
        if (row.page === 'fifth' && typeof window.renderMyV128 === 'function') {
          setTimeout(() => document.querySelector(`#fifth [data-my128-open="${row.myMode}"]`)?.click(), 30);
        }
      });
    };
    open.onclick = () => { sheet.classList.add('on'); input.value=''; refresh(); requestAnimationFrame(() => input.focus()); };
    close.onclick = () => sheet.classList.remove('on');
    sheet.addEventListener('click', event => { if (event.target === sheet) sheet.classList.remove('on'); });
    input.oninput = refresh;
    input.onkeydown = event => { if (event.key === 'Escape') sheet.classList.remove('on'); };
  }

  function markResponsiveContext() {
    document.documentElement.classList.toggle('aider-flip-v128', innerWidth < 560);
    document.documentElement.classList.toggle('aider-fold-v128', innerWidth >= 560);
  }

  installSearch();
  markResponsiveContext();
  addEventListener('resize', markResponsiveContext, { passive:true });
})();
