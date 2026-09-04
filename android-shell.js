(function () {
  'use strict';
  const preview = new URLSearchParams(location.search).get('android-preview') === '1';
  if (!window.AiderLogNative && !preview) return;
  if (document.documentElement.classList.contains('client-intake-only')) return;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const norm = value => String(value || '').trim().toLowerCase();
  const PAPER_EMAILS = new Set(['qhals5060@gmail.com', 'aidway55@gmail.com']);
  const TASK_EMAILS = new Set(['qhals5060@gmail.com', 'aidway55@gmail.com']);
  const THEMES = [
    ['aurora', '#5b4cff'], ['lavender', '#8c68e8'], ['ocean', '#2e8fe5'], ['mint', '#35a995'],
    ['rose', '#e3769e'], ['sunset', '#ed8955'], ['midnight', '#25213d'], ['mono', '#575757']
  ];
  const FONT_SCALES = [['작게', .88], ['보통', 1], ['크게', 1.12], ['아주 크게', 1.24]];
  let activeEmail = '';
  let wheelOpen = false;
  let sheetOpen = false;
  let syncTimer = 0;

  document.documentElement.classList.add('aiderlog-android');

  const header = document.createElement('header');
  header.className = 'al-app-header';
  header.innerHTML = `
    <div class="al-header-left">
      <div class="al-brand" aria-label="AiderLog">Aider<em>Log</em></div>
      <nav class="al-primary-tabs" aria-label="주요 기능">
        <button type="button" data-al-tab="schedule">스케줄</button>
        <button type="button" data-al-tab="private">루틴</button>
        <button type="button" data-al-tab="record">이벤트</button>
        <button type="button" data-al-tab="personal">펄스널</button>
        <button type="button" data-al-tab="paper" hidden>페이퍼</button>
        <button type="button" data-al-tab="task" hidden>테스크</button>
      </nav>
    </div>
    <div class="al-header-right">
      <div class="al-head-top">
        <button class="al-icon-button" type="button" data-al-copy="searchBtn" aria-label="검색">⌕</button>
        <button class="al-icon-button" type="button" data-al-copy="todayJournalBtn" aria-label="날짜와 불렛저널">▣</button>
        <button class="al-icon-button" type="button" data-al-copy="mailboxBtn" aria-label="알림">♧</button>
        <button class="al-date-button" type="button" data-al-copy="todayJournalBtn"></button>
      </div>
      <div class="al-head-links">
        <button class="al-head-link" type="button" data-al-copy="loginBtn" data-al-role="login">로그인</button>
        <button class="al-head-link" type="button" data-al-copy="quickMemoBtn">메모장</button>
        <button class="al-head-link" type="button" data-al-copy="mailboxBtn" data-al-role="mail">우편함</button>
      </div>
    </div>`;

  const bottom = document.createElement('nav');
  bottom.className = 'al-bottom-bar';
  bottom.setAttribute('aria-label', '하단 메뉴');
  bottom.innerHTML = `
    <button class="al-bottom-item" type="button" data-al-tab="schedule"><span>▦</span><span>캘린더</span></button>
    <button class="al-bottom-item" type="button" data-al-tab="private"><span>✓</span><span>할 일</span></button>
    <button class="al-bottom-item" type="button" data-al-tab="record"><span>▥</span><span>기록</span></button>
    <button class="al-bottom-item" type="button" data-al-sheet-open><span>•••</span><span>더보기</span></button>
    <button class="al-mascot-button" type="button" aria-label="기능 휠 열기" aria-expanded="false"><span class="al-mascot" aria-hidden="true"></span></button>`;

  const wheelBackdrop = document.createElement('div');
  wheelBackdrop.className = 'al-wheel-backdrop';
  const wheel = document.createElement('div');
  wheel.className = 'al-wheel';
  wheel.setAttribute('role', 'menu');
  wheel.setAttribute('aria-hidden', 'true');
  wheel.innerHTML = `
    <button class="al-wheel-action" type="button" data-al-tab="personal" role="menuitem"><span>▧</span>펄스널</button>
    <button class="al-wheel-action" type="button" data-al-tab="schedule" role="menuitem"><span>▣</span>일정</button>
    <button class="al-wheel-action" type="button" data-al-tab="private" role="menuitem"><span>✓</span>루틴</button>
    <button class="al-wheel-action" type="button" data-al-tab="record" role="menuitem"><span>▤</span>앨범</button>`;

  const sheetBackdrop = document.createElement('div');
  sheetBackdrop.className = 'al-sheet-backdrop';
  const sheet = document.createElement('section');
  sheet.className = 'al-more-sheet';
  sheet.setAttribute('aria-hidden', 'true');
  sheet.innerHTML = `
    <div class="al-sheet-handle"></div>
    <div class="al-sheet-title"><b>더보기</b><button type="button" data-al-sheet-close aria-label="닫기">×</button></div>
    <div class="al-more-grid">
      <button type="button" data-al-tab="record"><span>▤</span>이벤트 · 앨범</button>
      <button type="button" data-al-tab="personal"><span>♡</span>펄스널</button>
      <button type="button" data-al-copy="quickMemoBtn"><span>▧</span>메모장</button>
      <button type="button" data-al-copy="mailboxBtn"><span>✉</span>우편함</button>
      <button type="button" data-al-tab="paper" data-al-private="paper" hidden><span>◫</span>페이퍼</button>
      <button type="button" data-al-tab="task" data-al-private="task" hidden><span>▦</span>테스크</button>
      <button type="button" data-al-tab="fifth"><span>◎</span>내 계정 · 설정</button>
    </div>`;

  const app = $('#app');
  if (!app) return;
  app.prepend(header);
  app.append(bottom);
  document.body.append(wheelBackdrop, wheel, sheetBackdrop, sheet);

  function settingsKey() { return `aiderlog-android-settings:${activeEmail || 'guest'}`; }
  function readSettings() {
    try { return JSON.parse(localStorage.getItem(settingsKey()) || '{}'); } catch (_) { return {}; }
  }
  function applySettings(next) {
    const data = Object.assign({ theme: 'aurora', fontScale: 1 }, readSettings(), next || {});
    document.documentElement.dataset.alTheme = data.theme;
    document.documentElement.style.setProperty('--al-font-scale', String(data.fontScale));
    $$('.al-theme-grid button', sheet).forEach(button => button.classList.toggle('active', button.dataset.alTheme === data.theme));
    $$('.al-font-grid button', sheet).forEach(button => button.classList.toggle('active', Number(button.dataset.alFont) === Number(data.fontScale)));
    localStorage.setItem(settingsKey(), JSON.stringify(data));
    scheduleWidgetSync();
  }

  function setWheel(open) {
    wheelOpen = !!open;
    wheel.classList.toggle('open', wheelOpen);
    wheelBackdrop.classList.toggle('open', wheelOpen);
    wheel.setAttribute('aria-hidden', String(!wheelOpen));
    const mascot = $('.al-mascot-button', bottom);
    mascot.setAttribute('aria-expanded', String(wheelOpen));
    mascot.setAttribute('aria-label', wheelOpen ? '기능 휠 닫기' : '기능 휠 열기');
  }
  function setSheet(open) {
    sheetOpen = !!open;
    sheet.classList.toggle('open', sheetOpen);
    sheetBackdrop.classList.toggle('open', sheetOpen);
    sheet.setAttribute('aria-hidden', String(!sheetOpen));
    if (sheetOpen) setWheel(false);
  }
  function mirror(id) {
    const original = document.getElementById(id);
    if (!original) return;
    if (original.hidden && id === 'mailboxBtn') {
      const login = document.getElementById('loginBtn');
      if (login && !activeEmail) login.click();
      return;
    }
    original.click();
  }
  function selectTab(tab) {
    if (tab === 'paper' && !PAPER_EMAILS.has(activeEmail)) return;
    if (tab === 'task' && !TASK_EMAILS.has(activeEmail)) return;
    if (tab === 'fifth') {
      if (typeof go === 'function') go('fifth', true);
      setWheel(false); setSheet(false); updateActive('fifth');
      return;
    }
    const original = $(`.tab[data-tab="${tab}"]`);
    if (original) original.click();
    setWheel(false); setSheet(false); updateActive(tab);
  }
  function updateActive(tab) {
    tab = tab || app.dataset.activeTab || 'schedule';
    $$('[data-al-tab]').forEach(button => button.classList.toggle('active', button.dataset.alTab === tab));
  }
  function updateDate() {
    const now = new Date();
    const korean = new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(now);
    $('.al-date-button', header).innerHTML = `<b>${korean}</b>`;
  }
  function updateAccountUI(state) {
    activeEmail = norm(state && state.user && state.user.email);
    const name = state && state.user && (state.user.name || state.user.displayName || state.user.email);
    const login = $('[data-al-role="login"]', header);
    if (login) login.textContent = name || '로그인';
    const paper = PAPER_EMAILS.has(activeEmail);
    const task = TASK_EMAILS.has(activeEmail);
    $$('[data-al-tab="paper"], [data-al-private="paper"]').forEach(node => node.hidden = !paper);
    $$('[data-al-tab="task"], [data-al-private="task"]').forEach(node => node.hidden = !task);
    const settings = readSettings();
    applySettings(settings);
    scheduleWidgetSync();
  }

  function textRows(selector, limit) {
    const values = $$(selector).map(node => (node.innerText || node.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
    return Array.from(new Set(values)).slice(0, limit);
  }
  function imageRows(selector, limit) {
    return Array.from(new Set($$(selector)
      .map(node => node.currentSrc || node.src || '')
      .filter(value => /^data:image\//.test(value) && value.length < 180000)))
      .slice(0, limit);
  }
  function prefixedRows(label, selector, limit) {
    return textRows(selector, limit).map(value => `${label} · ${value}`);
  }
  function languageWidgetRows() {
    const labels = { en:'영어', zh:'중국어', ja:'일본어' };
    try {
      const saved = JSON.parse(localStorage.getItem('aiderlog-language-course-v114') || '{}');
      const progress = Object.values(saved.progress || {});
      return Object.entries(labels).map(([code, label]) => {
        const completed = progress.filter(row => row && row.completedAt && row.language === code).length;
        const level = Number(saved.levelByLanguage?.[code] || 0) + 1;
        return `${label} · ${completed}회 학습 · LEVEL ${level}`;
      });
    } catch (_) {
      return Object.values(labels).map(label => `${label} · 학습을 시작해 보세요.`);
    }
  }
  function emotionWidgetRows() {
    const rows = window.AiderLogInsightsV126?.rows?.() || [];
    return rows.slice(-2).reverse().map(row => {
      const mood = row.mood || row.emotion || row.feeling || row.moods?.[0] || row.emotions?.[0] || '마음 기록';
      return `감정 · ${mood}`;
    });
  }
  function widgetSnapshot() {
    const now = new Date();
    const shownMonth = ($('#monthTitle') && $('#monthTitle').innerText.trim()) || `${now.getFullYear()}. ${String(now.getMonth()+1).padStart(2,'0')}`;
    return {
      email: activeEmail,
      theme: document.documentElement.dataset.alTheme || 'aurora',
      today: new Intl.DateTimeFormat('ko-KR', { month:'long', day:'numeric', weekday:'short' }).format(now),
      month: shownMonth,
      schedule: textRows('.shared-row,.ev', 14),
      routines: textRows('.routine-v16-list button,.routine-v30-shell [data-routine-id],.routine-card-title,.routine-name-tab.active', 12),
      language: textRows('.language-lab-progress,.language-progress,.routine-stat-card', 1)[0] || '',
      languageRows: languageWidgetRows(),
      meals: textRows('.meal-slot-v59 footer,.nutrition-dashboard [data-personal-entry]', 8),
      mealPhotos: imageRows('.meal-slot-v59 img,.nutrition-dashboard [data-personal-entry] img', 3),
      workouts: textRows('.exercise-recent-card,.workout-session-list [data-personal-entry],.personal-health-tools-v127 button,.challenge-sessions-v127 article', 10),
      journal: [
        ...prefixedRows('일정', '.shared-row,.ev', 2),
        ...emotionWidgetRows(),
        ...prefixedRows('루틴', '.routine-card-title,.routine-name-tab.active', 2),
        ...prefixedRows('할 일', '.todo-list [data-id],.task-list [data-id],.private-task-row', 2)
      ],
      workoutStats: textRows('.exercise-summary-v59,.exercise-stat-card,.workout-statistics', 4),
      inbody: textRows('.inbody-history-v127 article,.inbody-summary-v127', 3),
      quote: textRows('.quote-v59,.quote-collection,.reading-dashboard blockquote', 1)[0] || '',
      workflows: textRows('.workflow-card-v59,.workflow-board [data-personal-entry]', 10),
      taskWeek: textRows('.consulting-session-row,.task-admissions-row', 8),
      taskTwoWeeks: textRows('.consulting-session-row,.task-admissions-row', 16)
    };
  }
  function scheduleWidgetSync() {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      if (!window.AiderLogNative || typeof window.AiderLogNative.syncWidgets !== 'function') return;
      try { window.AiderLogNative.syncWidgets(JSON.stringify(widgetSnapshot())); } catch (_) {}
    }, 700);
  }
  function copyClientLink() {
    if (!TASK_EMAILS.has(activeEmail)) return;
    selectTab('task');
    const openShare = $('#taskAddClientLink');
    if (openShare) openShare.click();
    setTimeout(() => {
      const input = $('#consultingShareUrl');
      const value = input && input.value;
      if (value && window.AiderLogNative && window.AiderLogNative.copyText) window.AiderLogNative.copyText('고객 링크', value);
      else if (value && navigator.clipboard) navigator.clipboard.writeText(value).catch(() => {});
    }, 1100);
  }

  document.addEventListener('click', event => {
    const mascot = event.target.closest('.al-mascot-button');
    if (mascot) { event.preventDefault(); setWheel(!wheelOpen); return; }
    if (event.target.closest('.al-wheel-backdrop')) { setWheel(false); return; }
    if (event.target.closest('.al-sheet-backdrop') || event.target.closest('[data-al-sheet-close]')) { setSheet(false); return; }
    if (event.target.closest('[data-al-sheet-open]')) { setSheet(true); return; }
    const tab = event.target.closest('[data-al-tab]');
    if (tab) { event.preventDefault(); selectTab(tab.dataset.alTab); return; }
    const copy = event.target.closest('[data-al-copy]');
    if (copy) { event.preventDefault(); mirror(copy.dataset.alCopy); setSheet(false); return; }
    const theme = event.target.closest('[data-al-theme]');
    if (theme) { applySettings({ theme: theme.dataset.alTheme }); return; }
    const font = event.target.closest('[data-al-font]');
    if (font) { applySettings({ fontScale: Number(font.dataset.alFont) }); return; }
    if (wheelOpen && !event.target.closest('.al-wheel')) setWheel(false);
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') { if (wheelOpen) setWheel(false); else if (sheetOpen) setSheet(false); } });
  window.addEventListener('aiderdear-firebase-state', event => updateAccountUI(event.detail || {}));
  window.addEventListener('aiderdear-firebase-data', scheduleWidgetSync);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') scheduleWidgetSync(); });
  new MutationObserver(() => { updateActive(); scheduleWidgetSync(); }).observe(app, { attributes:true, attributeFilter:['data-active-tab'] });
  new MutationObserver(scheduleWidgetSync).observe(app, { childList:true, characterData:true, subtree:true });

  window.AiderLogAppShell = {
    handleBack() {
      if (wheelOpen) { setWheel(false); return true; }
      if (sheetOpen) { setSheet(false); return true; }
      const visibleOverlay = $$('.overlay,.consulting-overlay,.research-overlay').find(node => !node.hidden && getComputedStyle(node).display !== 'none');
      if (visibleOverlay) { const close = $('[data-close],button[id$="Close"],.x', visibleOverlay); if (close) close.click(); return true; }
      return false;
    },
    openTarget(target, action) {
      if (String(action || '').startsWith('aiderlog://auth')) {
        const finishLogin = () => window.AiderDearFirebase.completeAndroidGoogleSignIn(action)
          .catch(error => {
            console.error('[android-auth] credential-failed', error);
            window.alert(error?.message || 'Google 로그인을 완료하지 못했습니다. 다시 시도해주세요.');
          });
        if (typeof window.AiderDearFirebase?.completeAndroidGoogleSignIn === 'function') finishLogin();
        else window.addEventListener('aiderdear-firebase-ready', finishLogin, { once: true });
        return;
      }
      if (action === 'copy-client-link') copyClientLink(); else selectTab(target || 'schedule');
    },
    deviceChanged() { setWheel(false); setSheet(false); },
    syncWidgets: scheduleWidgetSync
  };

  updateDate();
  setInterval(updateDate, 60000);
  applySettings(readSettings());
  updateActive('schedule');
  scheduleWidgetSync();
  setTimeout(() => window.AiderLogAppShell.openTarget('schedule', ''), 0);
})();
