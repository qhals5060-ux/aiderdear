/* AiderLog website v146 · Work is the only app workspace added to the restored website. */
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const ALLOWED = new Set(['qhals5060@gmail.com', 'aidway55@gmail.com']);
  const TABS = [
    ['today', '오늘'], ['tasks', '업무'], ['grants', '국가과제'], ['bio', '바이오 연구'],
    ['admin', '행정·지출'], ['employees', '직원 관리'], ['clients', '고객'], ['archive', '보관함']
  ];
  const TYPE_LABEL = Object.fromEntries(TABS);
  const CLOSED = new Set(['완료', '취소']);
  const STATUS = ['예정', '전달 전', '전달 완료', '진행 확인', 'QC', '검토 필요', '대표 확인 필요', '보완 필요', '보류', '실무 완료', '완료', '취소'];
  const ASSIGNEES = ['대표', '직원 1', '직원 2', '외부 업체', '공동 연구기관', '기타'];
  const LOCAL_KEY = 'aiderlog.website.work.v146';
  let stage;
  let tab = 'today';
  let query = '';
  let records = [];
  let loading = false;

  function api() { return window.AiderDearFirebase; }
  function auth() { return api()?.getState?.() || {}; }
  function email() { return String(auth().user?.email || '').trim().toLowerCase(); }
  function preview() { return /^(localhost|127\.0\.0\.1)$/.test(location.hostname) && new URLSearchParams(location.search).has('preview'); }
  function allowed() { return ALLOWED.has(email()) || preview(); }
  function todayKey(offset = 0) {
    const date = new Date(); date.setDate(date.getDate() + offset);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function active(row) { return !CLOSED.has(row.status); }
  function overdue(row) { return active(row) && row.dueDate && row.dueDate < todayKey(); }
  function withinWeek(row) { return active(row) && row.dueDate && row.dueDate >= todayKey() && row.dueDate <= todayKey(7); }
  function uid() { return `work-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

  function normalize(rows) {
    return (Array.isArray(rows) ? rows : []).filter(row => row && row.id && row.title).map(row => ({
      type: 'tasks', status: '예정', priority: '보통', assignee: '대표', representativeChecked: false,
      ...row, id: String(row.id), title: String(row.title).slice(0, 160)
    }));
  }

  const DEMO = [
    {id:'demo-grant', demo:true, type:'grants', title:'디지털 바이오마커 기반 인지저하 조기예측', status:'적합성 검토', priority:'높음', dueDate:todayKey(12), assignee:'대표', issue:'기관확약서와 데이터관리계획 확인 필요', nextAction:'공고문 12쪽 신청 자격 재확인', agency:'한국보건산업진흥원', readiness:68, evidence:'공고문 p.12 · 신청 자격'},
    {id:'demo-bio', demo:true, type:'bio', title:'혈장 바이오마커 파일럿 분석', status:'QC', priority:'높음', dueDate:todayKey(2), assignee:'직원 1', issue:'이상치 3개 재측정 필요', nextAction:'CV 15% 기준으로 재측정 결정', code:'BIO-26-014', qcCriteria:'CV 15% 미만', rawData:'이중 백업'},
    {id:'demo-admin', demo:true, type:'admin', title:'연구비 카드 증빙 및 세금계산서 대조', status:'확인 필요', priority:'보통', dueDate:todayKey(4), assignee:'직원 2', issue:'거래명세서 1건 누락', nextAction:'공급처에 명세서 재요청', amount:840000, evidenceState:'미수취'}
  ];
  function visibleRecords() { return records.length ? records : DEMO; }

  async function load() {
    if (loading || !allowed()) return;
    loading = true;
    render();
    try {
      if (auth().user && api()?.readPrivateData) {
        const payload = await api().readPrivateData();
        records = normalize(payload?.workRecords);
      } else {
        records = normalize(JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]'));
      }
    } catch (error) {
      console.warn('[site-work-v146] load fallback', error);
      try { records = normalize(JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]')); } catch { records = []; }
    } finally {
      loading = false;
      render();
    }
  }

  async function save(message = '업무 기록을 저장했습니다.') {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
    if (auth().user && api()?.readPrivateData && api()?.writePrivateData) {
      const latest = await api().readPrivateData() || {};
      latest.workRecords = records;
      await api().writePrivateData(latest);
    }
    const toast = $('#toast');
    if (toast) { toast.textContent = message; toast.classList.add('show'); clearTimeout(toast._workTimer); toast._workTimer = setTimeout(() => toast.classList.remove('show'), 1800); }
  }

  function ensureStage() {
    if (stage) return;
    stage = document.createElement('section');
    stage.id = 'siteWorkStageV146';
    stage.className = 'site-work-stage-v146';
    stage.hidden = true;
    stage.setAttribute('aria-label', '대표 업무 운영');
    ($('#taskStage') || $('#app')).insertAdjacentElement('afterend', stage);
  }

  function syncVisibility() {
    const button = $('.tab[data-tab="work"]');
    if (!button) return;
    button.hidden = !allowed();
    if (!allowed() && button.classList.contains('active')) $('.tab[data-tab="schedule"]')?.click();
  }

  function activate() {
    if (!auth().user && !preview()) { $('#loginBtn')?.click(); return; }
    if (!allowed()) return;
    ensureStage();
    ['#stage','#emotionStage','#recordStage','#eventStage','#privateStage','#personalStage','#paperStage','#taskStage'].forEach(selector => {
      const node = $(selector); if (node) { node.hidden = true; node.setAttribute('aria-hidden', 'true'); }
    });
    $$('.tab').forEach(button => {
      const on = button.dataset.tab === 'work';
      button.classList.toggle('active', on); button.setAttribute('aria-selected', String(on)); button.tabIndex = on ? 0 : -1;
    });
    stage.hidden = false; stage.setAttribute('aria-hidden', 'false');
    $('#app')?.setAttribute('data-active-tab', 'work');
    document.title = 'Work · AiderLog';
    render(); load();
  }

  function stats(rows) {
    const open = rows.filter(active);
    return [
      ['오늘 마감', open.filter(row => row.dueDate === todayKey()).length],
      ['7일 이내', open.filter(withinWeek).length],
      ['지연 업무', open.filter(overdue).length],
      ['확인 필요', open.filter(row => /확인|검토/.test(row.status || '')).length],
      ['국가과제', open.filter(row => row.type === 'grants').length],
      ['QC 확인', open.filter(row => row.type === 'bio' && /QC|재실험/.test(row.status || '')).length],
      ['증빙 누락', open.filter(row => row.type === 'admin' && /미수취|누락/.test(`${row.evidenceState || ''} ${row.issue || ''}`)).length],
      ['고객 미납', open.filter(row => row.type === 'clients' && Number(row.unpaid) > 0).length]
    ];
  }

  function card(row) {
    return `<article class="site-work-card-v146 ${overdue(row) ? 'danger' : ''}">
      <header><span>${row.demo ? 'DEMO · ' : ''}${esc(TYPE_LABEL[row.type] || '업무')}</span><em>${esc(row.status || '예정')}</em></header>
      <h4>${esc(row.title)}</h4><p>${esc(row.issue || row.description || '현재 문제 없음')}</p>
      <dl><div><dt>담당</dt><dd>${esc(row.assignee || '대표')}</dd></div><div><dt>마감</dt><dd>${esc(row.dueDate || '미정')}</dd></div><div><dt>다음 행동</dt><dd>${esc(row.nextAction || '대표 확인')}</dd></div></dl>
      ${row.demo ? '<footer><span>미리보기 데이터 · 실제 기록과 분리됨</span></footer>' : `<footer><button type="button" data-work-edit="${esc(row.id)}">수정</button>${row.status === '실무 완료' ? `<button class="primary" type="button" data-work-confirm="${esc(row.id)}">대표 확인 · 완료</button>` : active(row) ? `<button type="button" data-work-progress="${esc(row.id)}">실무 완료 기록</button>` : ''}<button class="danger" type="button" data-work-delete="${esc(row.id)}">삭제</button></footer>`}
    </article>`;
  }

  function todayView(rows) {
    const open = rows.filter(active), priority = open.filter(row => overdue(row) || row.priority === '높음' || /확인|검토|QC/.test(row.status || ''));
    return `<section class="site-work-summary-v146">${stats(rows).map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong><small>${value ? '대표 확인 필요' : '안정'}</small></article>`).join('')}</section>
      <div class="site-work-grid-v146"><section class="site-work-panel-v146"><header class="site-work-section-head-v146"><div><small>OWNER BRIEFING</small><h3>대표가 먼저 볼 일</h3></div><span>${priority.length} PRIORITY</span></header><div class="site-work-list-v146">${(priority.length ? priority : open.slice(0, 5)).map(card).join('') || '<div class="site-work-empty-v146">지금 바로 확인할 업무가 없습니다.</div>'}</div></section>
      <aside class="site-work-panel-v146"><header class="site-work-section-head-v146"><div><small>PEOPLE &amp; RISK</small><h3>직원별 진행</h3></div></header>${['직원 1','직원 2','대표'].map(name => `<p class="site-work-person-v146"><b>${name}</b><strong>${open.filter(row => row.assignee === name).length}</strong><span>${esc(open.find(row => row.assignee === name)?.nextAction || '확인 일정 없음')}</span></p>`).join('')}<div class="site-work-risk-v146"><b>${open.filter(overdue).length}개 지연</b><span>결과 근거와 대표 확인 전에는 최종 완료되지 않습니다.</span></div><div class="site-work-risk-v146"><b>${open.filter(row => row.issue).length}개 문제 기록</b><span>현재 문제와 다음 행동이 등록된 항목입니다.</span></div></aside></div>`;
  }

  function listView(rows) {
    let filtered = tab === 'archive' ? rows.filter(row => !active(row)) : rows.filter(row => row.type === tab && active(row));
    const needle = query.trim().toLowerCase();
    if (needle) filtered = filtered.filter(row => JSON.stringify(row).toLowerCase().includes(needle));
    return `<section class="site-work-panel-v146"><header class="site-work-section-head-v146"><div><small>${tab.toUpperCase()}</small><h3>${esc(TYPE_LABEL[tab] || '보관함')}</h3></div><button class="site-work-button-v146" type="button" data-work-add="${esc(tab === 'archive' ? 'tasks' : tab)}">+ 기록 추가</button></header><div class="site-work-list-v146">${filtered.map(card).join('') || `<div class="site-work-empty-v146">${esc(TYPE_LABEL[tab] || '보관')} 기록이 없습니다.</div>`}</div></section>`;
  }

  function render() {
    ensureStage();
    if (stage.hidden) return;
    const rows = visibleRecords();
    stage.innerHTML = `<section class="site-work-shell-v146"><header class="site-work-head-v146"><div><small>OWNER OPERATIONS</small><h2>Work</h2></div><div class="site-work-head-actions-v146"><input data-work-query type="search" value="${esc(query)}" placeholder="업무 · 과제 · 실험 · 고객 검색"><button class="site-work-button-v146 primary" type="button" data-work-add="tasks">+ 업무</button></div></header><div class="site-work-body-v146"><nav class="site-work-nav-v146" aria-label="Work 메뉴">${TABS.map(([key,label]) => `<button class="${tab === key ? 'active' : ''}" type="button" data-work-tab="${key}">${label}</button>`).join('')}</nav><main class="site-work-content-v146">${loading ? '<div class="site-work-empty-v146">업무 데이터를 불러오는 중입니다.</div>' : tab === 'today' ? todayView(rows) : listView(rows)}${!records.length && !loading ? '<p class="site-work-notice-v146">DEMO 항목은 화면 확인용이며 저장 데이터와 분리됩니다. 새 기록을 추가하면 실제 업무만 표시됩니다.</p>' : ''}</main></div></section>`;
  }

  function field(label, name, value = '', type = 'text', wide = false) {
    return `<label class="${wide ? 'wide' : ''}">${label}<input name="${name}" type="${type}" value="${esc(value)}"></label>`;
  }
  function textarea(label, name, value = '', wide = true) {
    return `<label class="${wide ? 'wide' : ''}">${label}<textarea name="${name}">${esc(value)}</textarea></label>`;
  }
  function select(label, name, values, current = '', wide = false) {
    return `<label class="${wide ? 'wide' : ''}">${label}<select name="${name}">${values.map(value => `<option ${value === current ? 'selected' : ''}>${esc(value)}</option>`).join('')}</select></label>`;
  }

  function openEditor(record = {}, type = 'tasks') {
    const overlay = document.createElement('div'); overlay.className = 'site-work-overlay-v146';
    overlay.innerHTML = `<section class="site-work-dialog-v146" role="dialog" aria-modal="true"><header><div><small>OWNER OPERATIONS</small><h2>${record.id ? '업무 기록 수정' : '새 업무 기록'}</h2></div><button type="button" data-work-close aria-label="닫기">×</button></header>
      <form class="site-work-form-v146" data-work-form><input type="hidden" name="id" value="${esc(record.id || '')}">
      <label>분류<select name="type">${TABS.filter(([key]) => !['today','archive'].includes(key)).map(([key,label]) => `<option value="${key}" ${key === (record.type || type) ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
      ${select('상태','status',STATUS,record.status || '예정')}${field('업무 제목 *','title',record.title || '')}${select('우선순위','priority',['낮음','보통','높음'],record.priority || '보통')}${select('실제 담당자','assignee',ASSIGNEES,record.assignee || '대표')}${field('시작일','startDate',record.startDate || '','date')}${field('마감일','dueDate',record.dueDate || '','date')}${field('예상 소요시간','estimate',record.estimate || '')}
      ${textarea('설명 · 완료 조건','description',record.description || '')}${textarea('현재 문제','issue',record.issue || '')}${textarea('대표가 해야 할 다음 행동','nextAction',record.nextAction || '')}
      <details open><summary>과제 · 연구 · 행정 근거</summary><div class="site-work-detail-grid-v146">${field('기관 · 프로젝트','agency',record.agency || '')}${field('과제 · 실험 코드','code',record.code || '')}${field('현재 단계','stage',record.stage || '')}${field('준비도 (%)','readiness',record.readiness || '','number')}${field('금액','amount',record.amount || '','number')}${select('증빙 상태','evidenceState',['필요 없음','미수취','확인 필요','보완 필요','완료'],record.evidenceState || '필요 없음')}${field('전달일','deliveredAt',record.deliveredAt || '','date')}${select('전달 방법','deliveryMethod',['대면','전화','문자','카카오톡','이메일','기타'],record.deliveryMethod || '대면')}${field('마지막 확인일','lastChecked',record.lastChecked || '','date')}${field('다음 확인일','nextCheck',record.nextCheck || '','date')}${textarea('공고문 페이지·조항 / QC 기준 / 완료 근거','evidence',record.evidence || record.qcCriteria || '',true)}${textarea('프로토콜 · batch · 시료 · 장비 · 시약','labDetails',record.labDetails || '',true)}${textarea('원자료 위치 · 관련 링크','source',record.source || record.rawData || '',true)}</div></details>
      <details><summary>고객 · 납부 · 대표 결정</summary><div class="site-work-detail-grid-v146">${field('고객명 · 요청자','clientName',record.clientName || '')}${field('연락처','contact',record.contact || '')}${field('서비스 · 결정 유형','service',record.service || '')}${field('납부 예정','paymentDue',record.paymentDue || '','date')}${field('미납 금액','unpaid',record.unpaid || '','number')}${textarea('질문 · 요청 · 대표 답변','decisionNote',record.decisionNote || '',true)}</div></details>
      <footer><button type="button" data-work-close>취소</button><button class="primary" type="submit">저장</button></footer></form></section>`;
    document.body.append(overlay); document.body.classList.add('modal-open');
    const close = () => { overlay.remove(); document.body.classList.remove('modal-open'); };
    overlay.addEventListener('click', event => { if (event.target === overlay || event.target.closest('[data-work-close]')) close(); });
    $('[data-work-form]', overlay).addEventListener('submit', async event => {
      event.preventDefault(); const form = event.currentTarget; const payload = Object.fromEntries(new FormData(form).entries());
      if (!payload.title.trim()) { form.elements.title.focus(); return; }
      const old = records.find(row => row.id === payload.id); payload.id = payload.id || uid(); payload.title = payload.title.trim();
      payload.amount = Number(payload.amount) || 0; payload.unpaid = Number(payload.unpaid) || 0; payload.readiness = Math.max(0, Math.min(100, Number(payload.readiness) || 0)); payload.createdAt = old?.createdAt || Date.now(); payload.updatedAt = Date.now(); payload.demo = false;
      const index = records.findIndex(row => row.id === payload.id); if (index >= 0) records.splice(index, 1, {...old, ...payload}); else records.push(payload);
      try { await save(); close(); render(); } catch (error) { alert(error.message || '저장하지 못했습니다.'); }
    });
    setTimeout(() => formFocus(overlay), 0);
  }
  function formFocus(root) { root.querySelector('input[name="title"]')?.focus(); }

  async function action(event) {
    const tabButton = event.target.closest('[data-work-tab]'); if (tabButton) { tab = tabButton.dataset.workTab; render(); return; }
    const add = event.target.closest('[data-work-add]'); if (add) { openEditor({}, add.dataset.workAdd || 'tasks'); return; }
    const edit = event.target.closest('[data-work-edit]'); if (edit) { const row = records.find(item => item.id === edit.dataset.workEdit); if (row) openEditor(row, row.type); return; }
    const progress = event.target.closest('[data-work-progress]'); if (progress) { const row = records.find(item => item.id === progress.dataset.workProgress); if (!row) return; row.status = '실무 완료'; row.updatedAt = Date.now(); await save('실무 완료를 기록했습니다. 대표 확인 후 최종 완료됩니다.'); render(); return; }
    const confirmButton = event.target.closest('[data-work-confirm]'); if (confirmButton) { const row = records.find(item => item.id === confirmButton.dataset.workConfirm); if (!row) return; row.status = '완료'; row.representativeChecked = true; row.completedAt = Date.now(); await save('대표 확인을 기록하고 최종 완료했습니다.'); render(); return; }
    const remove = event.target.closest('[data-work-delete]'); if (remove) { const row = records.find(item => item.id === remove.dataset.workDelete); if (!row || !confirm(`“${row.title}” 기록을 삭제할까요?`)) return; records = records.filter(item => item.id !== row.id); await save('업무 기록을 삭제했습니다.'); render(); }
  }

  function bind() {
    ensureStage(); syncVisibility();
    $('.tab[data-tab="work"]')?.addEventListener('click', event => { event.preventDefault(); event.stopImmediatePropagation(); activate(); });
    $('.tabs')?.addEventListener('click', event => { if (!event.target.closest('.tab[data-tab="work"]') && stage && !stage.hidden) { stage.hidden = true; stage.setAttribute('aria-hidden','true'); } }, true);
    stage.addEventListener('click', action);
    stage.addEventListener('input', event => { if (event.target.matches('[data-work-query]')) { query = event.target.value; if (tab !== 'today') { const position = event.target.selectionStart; render(); const next = $('[data-work-query]', stage); next?.focus(); next?.setSelectionRange(position, position); } } });
    window.addEventListener('aiderdear-firebase-state', () => { syncVisibility(); if (!stage.hidden && allowed()) load(); });
    window.addEventListener('aiderdear-firebase-ready', syncVisibility);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind, {once:true}); else bind();
})();
