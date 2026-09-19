/* App presentation only. Keep the existing controls, handlers and saved records. */
(() => {
  'use strict';
  function compactControl(control, label) {
    if (!control || control.parentElement.classList.contains('er186-picker')) return;
    const shell = document.createElement('label');
    shell.className = 'er186-picker';
    const caption = document.createElement('span');
    const update = () => {
      caption.textContent = control.type === 'date' && control.value ? control.value.slice(5).replace('-', '.') : label;
      shell.title = control.type === 'date' ? control.value || label : control.selectedOptions?.[0]?.textContent || label;
      shell.classList.toggle('has-value', control.type === 'date' && !!control.value);
    };
    control.before(shell); shell.append(caption, control);
    if (!control.getAttribute('aria-label')) control.setAttribute('aria-label', label);
    control.addEventListener('change', update); update();
  }
  function eventPresentation() {
    const root = document.getElementById('event');
    if (!root) return;
    root.classList.add('event-ui-v186');
    const content = root.querySelector('.event-content-v164');
    if (!content) return;
    content.dataset.fontOwnedV184 = '1';
    const recordToolbar = content.querySelector(':scope > .event-toolbar-v111');
    if (recordToolbar && !recordToolbar.classList.contains('er186-toolbar')) {
      const controls = [...recordToolbar.querySelectorAll('button,input,select')];
      recordToolbar.replaceChildren(...controls);
      recordToolbar.classList.add('er186-toolbar', 'er186-record-tools');
      recordToolbar.classList.toggle('has-together', !!recordToolbar.querySelector('[data-record-owner="together"]'));
      compactControl(recordToolbar.querySelector('#recordDateV111'), '날짜');
      compactControl(recordToolbar.querySelector('#recordSortV111'), '정렬');
    }
    const archive = content.querySelector('.archive-v111');
    if (archive) {
      const toolbar = archive.querySelector('.event-toolbar-v111');
      if (toolbar && !toolbar.classList.contains('er186-toolbar')) {
        const controls = [...toolbar.querySelectorAll('button,select')];
        toolbar.replaceChildren(...controls);
        toolbar.classList.add('er186-toolbar', 'er186-archive-tools');
        const want = toolbar.querySelector('[data-archive-wishlist]');
        if (want) { want.textContent = 'want'; want.setAttribute('aria-label', 'want 목록'); want.setAttribute('aria-pressed', String(want.classList.contains('primary'))); }
        compactControl(toolbar.querySelector('#archiveSortV111'), '정렬');
      }
    }
    const travel = content.querySelector('.travel-v111');
    if (travel && !travel.querySelector('.er186-travel-tools')) {
      const header = travel.querySelector(':scope > header');
      if (header?.querySelector('h2')?.textContent.trim() === 'Travel Log') header.remove();
      const oldHead = travel.querySelector('.travel-head');
      const folders = travel.querySelector('.travel-folder-strip-v111');
      const all = folders?.querySelector('[data-travel-folder="all"]');
      const preparation = folders?.querySelector('[data-travel-folder="trip-default"]');
      const sort = oldHead?.querySelector('#travelSortV111');
      const add = oldHead?.querySelector('[data-travel-folder-new]');
      if (all && sort && add) {
        const toolbar = document.createElement('div');
        toolbar.className = 'er186-toolbar er186-travel-tools';
        all.textContent = 'all';
        toolbar.append(all); if (preparation) toolbar.append(preparation);
        else toolbar.classList.add('without-preparation');
        toolbar.append(sort, add); compactControl(sort, '정렬');
        travel.prepend(toolbar); oldHead.remove();
        if (folders && !folders.children.length) folders.remove();
      }
      // The default empty folder needs no duplicate summary card.
      const ticket = travel.querySelector(':scope > .ticket');
      if (ticket && ticket.querySelector('h3')?.textContent.trim() === '여행 준비' && ticket.querySelector('p')?.textContent.trim() === '날짜 미정') ticket.remove();
    }
  }
  function routinePresentation() {
    const root = document.getElementById('routine');
    if (!root) return;
    root.classList.add('routine-ui-v186');
    const content = root.querySelector('.r165-content');
    if (!content) return;
    content.dataset.fontOwnedV184 = '1';
    const heading = content.querySelector('.r165-section-heading h2');
    if (heading?.textContent === '오늘의 실천') heading.textContent = '오늘';
    if (heading?.textContent === '나의 큰 목표') heading.closest('.r165-section-heading').remove();
    content.querySelectorAll('.r165-practice-card').forEach(card => {
      if (card.querySelector('.er186-routine-progress')) return;
      const id = card.querySelector('[data-routine-open]')?.dataset.routineOpen;
      const routine = typeof P !== 'undefined' && P.routines?.find(row => String(row.id) === id);
      if (!routine || typeof routineMetrics !== 'function') return;
      const metric = routineMetrics(routine), caption = card.querySelector('.r165-cycle-caption');
      if (caption) caption.textContent = `${metric.cycle.day}/${metric.cycle.goal}일 · ${metric.practice}회 실천 · ${metric.completion}%`;
      const progress = document.createElement('div');
      progress.className = 'er186-routine-progress'; progress.setAttribute('role', 'progressbar');
      progress.setAttribute('aria-label', '현재 회차 완료율'); progress.setAttribute('aria-valuemin', '0');
      progress.setAttribute('aria-valuemax', '100'); progress.setAttribute('aria-valuenow', String(metric.completion));
      const fill = document.createElement('i'); fill.style.width = Math.max(0, Math.min(100, Number(metric.completion) || 0)) + '%';
      progress.append(fill); caption?.after(progress);
    });
    content.querySelectorAll('.r165-goal-card footer > span').forEach(label => label.remove());
    content.querySelectorAll('.r165-empty').forEach(label => {
      if (label.textContent.includes('저장된 루틴이 없습니다.')) label.textContent = '아직 등록된 루틴이 없습니다.';
    });
  }
  for (const [name, decorate] of [['renderEvent', eventPresentation], ['renderRoutine', routinePresentation]]) {
    if (typeof window[name] !== 'function') continue;
    const previous = window[name];
    window[name] = function (...args) { const result = previous.apply(this, args); decorate(); return result; };
    decorate();
  }
})();
