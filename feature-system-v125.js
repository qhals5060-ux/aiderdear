(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const THEMES = {
    system:{name:'시스템',note:'기기의 밝은·어두운 화면 설정을 따릅니다',a:'#F8F7FC',b:'#25213A',dots:['#7657D8','#F8F7FC','#25213A']},
    sun:{name:'태양',note:'오렌지와 코랄이 선명한 에너지',a:'#FF821C',b:'#B41C2A',dots:['#FF821C','#F45A23','#DC3626']},
    mercury:{name:'수성',note:'미니멀한 실버와 차콜',a:'#5F5D5A',b:'#F1F2F3',dots:['#5F5D5A','#B9B8B8','#F1F2F3']},
    venus:{name:'금성',note:'웜 그레이와 크림 베이지',a:'#9A9D9C',b:'#F4DDC1',dots:['#9A9D9C','#D7AB89','#F4DDC1']},
    earth:{name:'지구',note:'딥 네이비와 오션 그린',a:'#27457D',b:'#3D7C6D',dots:['#27457D','#0F1E2B','#3D7C6D']},
    mars:{name:'화성',note:'샌드 베이지와 마션 코랄',a:'#DDBE99',b:'#EE775B',dots:['#DDBE99','#9B6754','#EE775B']},
    jupiter:{name:'목성',note:'오커와 클레이 브라운',a:'#C38836',b:'#AA735F',dots:['#2E2A18','#C38836','#AA735F']},
    saturn:{name:'토성',note:'샴페인 골드와 고요한 올리브',a:'#F3CF83',b:'#8C846C',dots:['#F3CF83','#DDBD75','#8C846C']},
    uranus:{name:'천왕성',note:'아쿠아와 아이스 블루',a:'#6E9294',b:'#C8EBF0',dots:['#405E63','#6E9294','#C8EBF0']},
    neptune:{name:'해왕성',note:'페리윙클과 딥 블루',a:'#6F87B2',b:'#52647F',dots:['#6F87B2','#7598C5','#52647F']},
    pluto:{name:'명왕성',note:'아이보리와 코코아 브라운',a:'#D7CBB9',b:'#49301F',dots:['#D7CBB9','#ABA49D','#49301F']}
  };
  const FONT_SIZES = {
    small:{name:'작게',note:'정보를 더 많이 봅니다'},
    normal:{name:'보통',note:'균형 잡힌 기본 크기'},
    large:{name:'크게',note:'읽기 편한 큰 글자'}
  };
  const THEME_KEY = 'aiderlogTheme';
  const CALENDAR_KEY = 'aiderlog-calendar-selection-v1';
  const SHORTS_KEY = 'aiderlog-language-shorts-v118';
  const PREVIEW_THEME_V126 = new URLSearchParams(location.search).get('theme');
  const PREVIEW_FONT_V134 = new URLSearchParams(location.search).get('android-preview') === '1'
    ? new URLSearchParams(location.search).get('font')
    : '';
  const LANGUAGE_THEME_OBSERVERS_V126 = new WeakMap();
  const themeId = value => THEMES[value] ? value : 'system';
  const fontSizeId = value => FONT_SIZES[value] ? value : 'normal';
  const currentState = () => window.AiderDearFirebase?.getState?.() || (typeof authState !== 'undefined' ? authState : {}) || {};
  const currentUser = () => currentState().user || null;
  const currentTheme = () => themeId(document.documentElement.dataset.theme);
  const legacyEmotionOpenV125 = document.querySelector('[data-schedule-emotion-v119]')?.onclick || null;

  function icon(name) {
    if (window.AiderLogCosmicIconsV123?.icon) return window.AiderLogCosmicIconsV123.icon(name);
    const paths = name === 'close' ? '<path d="m6 6 12 12M18 6 6 18"/>'
      : name === 'dday' ? '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17M9 13v4h1.4a2 2 0 0 0 0-4H9Z"/>'
      : name === 'calendar' ? '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17"/>'
      : '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>';
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths}</svg>`;
  }

  function applyFixedWheelV125() {
    const wheel=$('#wheel');if(!wheel)return;
    const order=['fifth','language','personal','routine','event'],labels={event:'Event',routine:'Routine',personal:'Personal',language:'Language',fifth:'My'},icons={event:'event',routine:'routine',personal:'profile',language:'language',fifth:'my'};
    $$('.global-wheel-item-v126',wheel).forEach((button,index)=>{const page=order[index],label=labels[page];button.dataset.page=page;button.dataset.index=String(index);button.setAttribute('aria-label',label);button.title=label;button.innerHTML=`<i>${window.AiderLogIconsV126?.icon(icons[page])||icon(icons[page])}</i>`});
    const core=$('.global-wheel-planet-v126',wheel);if(core&&core.dataset.pressV125!=='1'){core.dataset.pressV125='1';const on=()=>core.classList.add('pressing'),off=()=>core.classList.remove('pressing');core.addEventListener('pointerdown',on);core.addEventListener('pointerup',off);core.addEventListener('pointercancel',off);core.addEventListener('pointerleave',off)}
  }

  function applyLanguageTheme() {
    const styles = getComputedStyle(document.documentElement);
    $$('aiderlog-language-lab').forEach(host => {
      const names = ['primary','secondary','accent','accent-soft','background','border','text','text-muted','deep','gradient-start','gradient-mid','gradient-end','glow'];
      names.forEach(name => host.style.setProperty(`--theme-${name}`,styles.getPropertyValue(`--theme-${name}`).trim()));
      host.style.setProperty('--cosmic-primary',styles.getPropertyValue('--theme-primary').trim());
      host.style.setProperty('--cosmic-secondary',styles.getPropertyValue('--theme-secondary').trim());
      host.style.setProperty('--cosmic-blue',styles.getPropertyValue('--theme-gradient-start').trim());
      host.style.setProperty('--cosmic-bg',styles.getPropertyValue('--theme-background').trim());
      host.style.setProperty('--cosmic-border',styles.getPropertyValue('--theme-border').trim());
      host.style.setProperty('--blue',styles.getPropertyValue('--theme-primary').trim());
      host.style.setProperty('--blue-dark',styles.getPropertyValue('--theme-deep').trim());
      host.style.setProperty('--blue-pale',styles.getPropertyValue('--theme-accent-soft').trim());
      const root = host.shadowRoot;
      if (!root) return;
      let style = root.querySelector('style[data-theme-v125]');
      if (!style) {
        style = document.createElement('style');
        style.dataset.themeV125 = '1';
        root.append(style);
      }
      style.textContent = `
        :host{--blue:var(--theme-primary)!important;--blue-dark:var(--theme-deep)!important;--blue-pale:var(--theme-accent-soft)!important;--canvas:var(--theme-background)!important;--line:var(--theme-border)!important;--ink:var(--theme-text)!important;--muted:var(--theme-text-muted)!important}
        .scenario-summary{background:linear-gradient(135deg,var(--theme-gradient-start),var(--theme-gradient-mid) 56%,var(--theme-gradient-end))!important}
        .category-tab.active,.scenario-tab.active,.records-button,.footer-primary,#review-start-button,.listen-large,.record-control{background:var(--theme-primary)!important;border-color:var(--theme-primary)!important}
        .day-action.primary,.day-action:not(:disabled){border-color:var(--theme-primary)}
        :is(select,input,button):focus-visible{outline-color:var(--theme-primary)!important}
        .scenario-summary{background-color:var(--theme-deep)!important;background-image:url("./planet-surface-v134.png")!important;background-size:620px 620px!important;background-blend-mode:soft-light!important}
        .day-index :is(b,small),.day-info :is(b,p,small),.day-action,.category-tab :is(b,small),.scenario-tab :is(b,small,em),.scenario-main>p,.scenario-progress-box :is(div,b),.records-header-actions button,.streak-chip,.records-button{font-size:var(--type-xs,11px)!important}
        .section-heading-row strong,.quiz-prompt,.choice-button,.lesson-coach-card :is(b,p),.expression-expansion li :is(b,span){font-size:var(--type-sm,12px)!important}
        .scenario-line h3,.page-intro h2{font-size:var(--type-lg,17px)!important}
        .learning-section .day-row .day-index{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;text-align:left!important;padding-left:12px!important;overflow:hidden!important}
        .learning-section .day-row .day-index>b,.learning-section .day-row .day-index>small{position:static!important;left:auto!important;right:auto!important;align-self:flex-start!important;justify-self:start!important;width:100%!important;margin:0!important;padding:0!important;translate:none!important;transform:none!important;text-align:left!important;max-width:100%!important}
        :host-context(html[data-app-font-size="large"]) .day-row{grid-template-columns:82px minmax(0,1fr) 72px!important}
        :host-context(html[data-app-font-size="large"]) .learning-section .day-row .day-index{padding-left:9px!important}
      `;
      /* Keep the shared theme layer last when Language Lab appends its own runtime styles. */
      root.append(style);
      if (!LANGUAGE_THEME_OBSERVERS_V126.has(root)) {
        const observer = new MutationObserver(() => {
          const themeStyle = root.querySelector('style[data-theme-v125]');
          if (themeStyle && themeStyle !== root.lastElementChild) root.append(themeStyle);
        });
        observer.observe(root,{childList:true});
        LANGUAGE_THEME_OBSERVERS_V126.set(root,observer);
      }
    });
  }

  function refreshThemeCards() {
    $$('[data-theme-choice-v125]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.themeChoiceV125 === currentTheme())));
  }

  async function applyTheme(value, persist = false) {
    const id = themeId(value);
    document.documentElement.dataset.theme = id;
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue('--theme-background').trim() || '#F7F6FF';
    applyLanguageTheme();
    refreshThemeCards();
    if (!persist) return;
    try { localStorage.setItem(THEME_KEY,id); } catch (_) {}
    if (typeof P !== 'undefined') {
      P.settings = P.settings && typeof P.settings === 'object' ? P.settings : {};
      P.settings.theme = id;
      if (typeof savePrivate === 'function') {
        try { await savePrivate(); } catch (error) { console.warn('Theme preference sync skipped',error); }
      }
    }
  }

  function themeCardsMarkup() {
    return Object.entries(THEMES).map(([id,row]) => `<button type="button" class="theme-card-v125" data-theme-choice-v125="${id}" aria-pressed="${id === currentTheme()}" style="--preview-a:${row.a};--preview-b:${row.b}">
      <span class="theme-check-v125" aria-hidden="true">✓</span>
      <b>${row.name}</b><small>${row.note}</small>
    </button>`).join('');
  }

  function fontCardsMarkup() {
    const selected=fontSizeId(document.documentElement.dataset.appFontSize||(typeof P!=='undefined'&&P?.settings?.fontSize));
    return Object.entries(FONT_SIZES).map(([id,row])=>`<button type="button" class="font-card-v133" data-font-choice-v133="${id}" aria-pressed="${id===selected}"><b>${row.name}</b><small>${row.note}</small></button>`).join('');
  }

  async function applyFontSize(value,persist=false){
    const id=fontSizeId(value);document.documentElement.dataset.appFontSize=id;
    $$('[data-font-choice-v133]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.fontChoiceV133===id)));
    document.querySelectorAll('aiderlog-language-lab').forEach(host=>host.style.setProperty('--app-font-multiplier',id==='large'?'1.14':id==='small'?'.92':'1'));
    try{localStorage.setItem('aiderlogFontSize',id)}catch(_){}
    if(!persist||typeof P==='undefined')return;
    P.settings=P.settings&&typeof P.settings==='object'?P.settings:{};P.settings.fontSize=id;
    if(typeof savePrivate==='function')try{await savePrivate()}catch(error){console.warn('Font preference sync skipped',error)}
  }

  function ensureSettings() {
    let overlay = $('.settings-v125');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.className = 'settings-v125';
    overlay.setAttribute('aria-hidden','true');
    overlay.innerHTML = `<section role="dialog" aria-modal="true" aria-labelledby="settingsTitleV125">
      <header class="settings-head-v125"><div><small>MY AIDERLOG UNIVERSE</small><h2 id="settingsTitleV125">화면 설정</h2><p>행성 테마와 읽기 편한 글자 크기를 선택합니다.</p></div><button type="button" class="settings-close-v125" data-settings-close-v125 aria-label="설정 닫기">${icon('close')}</button></header>
      <div class="settings-user-v125"><div><b data-settings-name-v125>로그인 사용자</b><span data-settings-email-v125></span></div><button type="button" data-settings-logout-v125>로그아웃</button></div>
      <section class="settings-section-v125"><header><h3>태양계 색상 테마</h3><span>시스템 또는 좋아하는 행성의 색을 선택하세요.</span></header><div class="theme-grid-v125 planet-theme-grid-v133">${themeCardsMarkup()}</div></section>
      <section class="settings-section-v125"><header><h3>글자 크기</h3><span>화면 전체와 어학 학습 화면에 함께 적용됩니다.</span></header><div class="font-grid-v133">${fontCardsMarkup()}</div></section>
      <section class="settings-section-v125" data-calendar-settings-v125><header><h3>캘린더 동기화</h3><span>사이트와 같은 일정 데이터를 사용합니다.</span></header>
        <div class="calendar-sync-v125">
          <article class="calendar-provider-v125"><header><b>Google Calendar</b><button type="button" data-google-connect-v125>연결 · 선택</button></header><p>가져올 캘린더를 직접 고르고 일정과 원래 색상을 불러옵니다.</p></article>
          <article class="calendar-provider-v125"><header><b>ICS 캘린더</b><label class="import-v125">파일 가져오기<input type="file" accept=".ics,text/calendar" data-ics-import-v125></label></header><p>Notion·Samsung 등에서 내보낸 ICS 일정을 읽기 전용으로 추가합니다.</p></article>
          <div class="calendar-source-list-v125" data-calendar-sources-v125></div>
        </div>
      </section>
    </section>`;
    document.body.append(overlay);
    overlay.addEventListener('click',event => {
      if (event.target === overlay || event.target.closest('[data-settings-close-v125]')) closeSettings();
      const theme = event.target.closest('[data-theme-choice-v125]');
      if (theme) applyTheme(theme.dataset.themeChoiceV125,true);
      const font=event.target.closest('[data-font-choice-v133]');
      if(font)applyFontSize(font.dataset.fontChoiceV133,true);
      if (event.target.closest('[data-settings-logout-v125]')) {
        closeSettings();
        window.AiderDearFirebase?.logout?.();
      }
      if (event.target.closest('[data-google-connect-v125]')) connectGoogleCalendars();
      if (event.target.closest('[data-calendar-sync-selected-v125]')) syncSelectedGoogleCalendars();
      if (event.target.closest('[data-calendar-source-cancel-v125]')) $('[data-calendar-sources-v125]',overlay)?.classList.remove('on');
    });
    $('[data-ics-import-v125]',overlay)?.addEventListener('change',importIcsFile);
    return overlay;
  }

  function openSettings(section = '') {
    const overlay = ensureSettings(), user = currentUser();
    const userBlock=$('.settings-user-v125',overlay),calendarBlock=$('[data-calendar-settings-v125]',overlay);
    if(userBlock)userBlock.hidden=!user;if(calendarBlock)calendarBlock.hidden=!user;
    $('[data-settings-name-v125]',overlay).textContent = user?.displayName || user?.name || 'AiderLog 사용자';
    $('[data-settings-email-v125]',overlay).textContent = user?.email || '로그인 계정';
    overlay.classList.add('on');
    overlay.setAttribute('aria-hidden','false');
    refreshThemeCards();
    if (section === 'calendar') setTimeout(() => $('[data-calendar-settings-v125]',overlay)?.scrollIntoView({block:'start'}),30);
  }
  function closeSettings() {
    const overlay = $('.settings-v125');
    overlay?.classList.remove('on');
    overlay?.setAttribute('aria-hidden','true');
  }

  function bindProfileSettings() {
    const button = $('#loginBtn');
    if (!button || button.dataset.settingsV125 === '1') return;
    button.dataset.settingsV125 = '1';
    button.setAttribute('aria-label',currentUser() ? '설정' : '로그인');
    button.onclick = event => {
      event.preventDefault();
      event.stopPropagation();
      if (currentUser()) openSettings();
      else window.AiderDearFirebase?.login?.();
    };
  }

  let googleSourcesV125 = [];
  function calendarSelection() {
    try { const value = JSON.parse(localStorage.getItem(CALENDAR_KEY) || '[]'); return new Set(Array.isArray(value) ? value.map(String) : []); }
    catch (_) { return new Set(); }
  }
  function calendarColor(source) { return String(source?.backgroundColor || source?.color || '#6255E8'); }
  async function connectGoogleCalendars() {
    const api = window.AiderDearFirebase, host = $('[data-calendar-sources-v125]');
    if (!currentUser()) return api?.login?.();
    if (!api?.requestGoogleCalendarAccess || !api?.listGoogleCalendars) {
      if (host) { host.classList.add('on'); host.innerHTML = '<p class="shorts-transcript-state-v125">현재 빌드에서 Google 캘린더 연결 모듈을 찾지 못했습니다.</p>'; }
      return;
    }
    host.classList.add('on'); host.innerHTML = '<p class="shorts-transcript-state-v125">Google 캘린더 권한과 목록을 확인하고 있습니다…</p>';
    try {
      await api.requestGoogleCalendarAccess();
      googleSourcesV125 = await api.listGoogleCalendars();
      const selected = calendarSelection();
      host.innerHTML = googleSourcesV125.length ? googleSourcesV125.map((source,index) => `<label><input type="checkbox" data-calendar-source-v125="${index}" ${selected.has(String(source.id)) || (!selected.size && source.primary) ? 'checked' : ''}><i style="--source-color:${safe(calendarColor(source))}"></i><span>${safe(source.summary || source.name || 'Calendar')}</span></label>`).join('') + `<div class="calendar-source-actions-v125"><button type="button" data-calendar-source-cancel-v125>취소</button><button type="button" data-calendar-sync-selected-v125>선택 저장 · 동기화</button></div>` : '<p class="shorts-transcript-state-v125">가져올 캘린더가 없습니다.</p>';
    } catch (error) {
      host.innerHTML = `<p class="shorts-transcript-state-v125">${safe(error?.message || 'Google 캘린더를 연결하지 못했습니다.')}</p>`;
    }
  }
  function googleDate(raw) {
    const value = raw?.date || raw?.dateTime || '';
    return String(value).slice(0,10);
  }
  function googleTime(raw) {
    const value = String(raw?.dateTime || '');
    return value.includes('T') ? value.slice(11,16) : '';
  }
  function mapGoogleEvent(raw,source,user) {
    const allDay = !!raw?.start?.date;
    return {
      id:`google:${source.id}:${raw.id}`,googleEventId:raw.id,calendarId:String(source.id),sourceTitle:source.summary || 'Google Calendar',sourceColor:calendarColor(source),externalSource:'google',readOnly:true,
      title:String(raw.summary || '(제목 없음)').slice(0,100),date:googleDate(raw.start),endDate:googleDate(raw.end),time:allDay ? '' : googleTime(raw.start),endTime:allDay ? '' : googleTime(raw.end),allDay,
      category:'other',note:String(raw.description || '').slice(0,1200),location:String(raw.location || '').slice(0,180),owner:'mine',shareWithCouple:false,authorEmail:user.email || '',authorUid:user.uid || '',createdAt:Date.now(),updatedAt:Date.now()
    };
  }
  async function syncSelectedGoogleCalendars() {
    const api = window.AiderDearFirebase, host = $('[data-calendar-sources-v125]'), user = currentUser();
    if (!api?.listGoogleCalendarEvents || !user) return;
    const selected = $$('[data-calendar-source-v125]:checked',host).map(input => googleSourcesV125[Number(input.dataset.calendarSourceV125)]).filter(Boolean);
    if (!selected.length) { host.insertAdjacentHTML('afterbegin','<p class="shorts-transcript-state-v125">가져올 캘린더를 하나 이상 선택해주세요.</p>'); return; }
    const ids = selected.map(source => String(source.id));
    try { localStorage.setItem(CALENDAR_KEY,JSON.stringify(ids)); } catch (_) {}
    host.innerHTML = '<p class="shorts-transcript-state-v125">선택한 캘린더 일정을 동기화하고 있습니다…</p>';
    const year = new Date().getFullYear(), timeMin = new Date(Date.UTC(year-1,0,1)).toISOString(), timeMax = new Date(Date.UTC(year+2,0,1)).toISOString();
    try {
      const groups = await Promise.all(selected.map(async source => {
        const result = await api.listGoogleCalendarEvents(source.id,timeMin,timeMax);
        const items = Array.isArray(result) ? result : (result?.items || []);
        return items.map(raw => mapGoogleEvent(raw,source,user)).filter(row => row.date);
      }));
      A.scheduleEvents = [...(Array.isArray(A.scheduleEvents) ? A.scheduleEvents.filter(row => row.externalSource !== 'google') : []),...groups.flat()];
      if (typeof saveApp === 'function') await saveApp();
      if (api.writeScheduleData) await api.writeScheduleData(A.scheduleEvents);
      host.innerHTML = `<p class="shorts-transcript-state-v125">${selected.length}개 캘린더에서 ${groups.flat().length}개 일정을 동기화했습니다.</p><div class="calendar-source-actions-v125"><button type="button" data-calendar-source-cancel-v125>닫기</button></div>`;
      if (typeof activePage !== 'undefined' && activePage === 'home') renderHome();
    } catch (error) {
      host.innerHTML = `<p class="shorts-transcript-state-v125">${safe(error?.message || '일정 동기화에 실패했습니다.')}</p>`;
    }
  }

  function unfoldIcs(text) { return String(text || '').replace(/\r?\n[ \t]/g,''); }
  function parseIcsDate(value) {
    const raw = String(value || '').replace(/^.*:/,'').trim();
    const match = raw.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
    return match ? {date:`${match[1]}-${match[2]}-${match[3]}`,time:match[4] ? `${match[4]}:${match[5]}` : '',allDay:!match[4]} : {date:'',time:'',allDay:false};
  }
  function parseIcs(text,user = {}) {
    const blocks = unfoldIcs(text).split('BEGIN:VEVENT').slice(1).map(block => block.split('END:VEVENT')[0]);
    return blocks.map((block,index) => {
      const lines = block.split(/\r?\n/), field = name => (lines.find(line => line.startsWith(name)) || '').replace(/^.*?:/,'').replace(/\\n/g,'\n').replace(/\\,/g,',').trim();
      const start = parseIcsDate(lines.find(line => line.startsWith('DTSTART')) || ''), end = parseIcsDate(lines.find(line => line.startsWith('DTEND')) || ''), uid = field('UID') || `${Date.now()}-${index}`;
      return {id:`ics:${uid}`,externalSource:'ics',readOnly:true,sourceTitle:'ICS Calendar',title:field('SUMMARY') || '(제목 없음)',date:start.date,endDate:end.date,time:start.time,endTime:end.time,allDay:start.allDay,location:field('LOCATION'),note:field('DESCRIPTION'),category:'other',owner:'mine',shareWithCouple:false,authorEmail:user.email || '',authorUid:user.uid || '',createdAt:Date.now(),updatedAt:Date.now()};
    }).filter(row => row.date);
  }
  async function importIcsFile(event) {
    const file = event.target.files?.[0]; if (!file) return;
    try {
      const rows = parseIcs(await file.text(),currentUser() || {}), ids = new Set(rows.map(row => row.id));
      A.scheduleEvents = [...(Array.isArray(A.scheduleEvents) ? A.scheduleEvents.filter(row => !ids.has(row.id)) : []),...rows];
      if (typeof saveApp === 'function') await saveApp();
      if (currentUser() && window.AiderDearFirebase?.writeScheduleData) await window.AiderDearFirebase.writeScheduleData(A.scheduleEvents);
      if (typeof activePage !== 'undefined' && activePage === 'home') renderHome();
      event.target.value = '';
      alert(`${rows.length}개의 ICS 일정을 가져왔습니다.`);
    } catch (error) { alert(error?.message || 'ICS 파일을 읽지 못했습니다.'); }
  }

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const WEEK = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
  const SCHEDULE_CATEGORY = {work:['업무','#6255E8'],personal:['개인','#D86D99'],health:['건강','#42A993'],study:['학습','#3A86E8'],event:['약속','#E8933A'],other:['기타','#8B849D']};
  const dateKey = value => { const date = value instanceof Date ? new Date(value) : new Date(`${value}T12:00:00`); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; };
  let scheduleCursorV125 = new Date(new Date().getFullYear(),new Date().getMonth(),1);
  let scheduleSelectedV125 = dateKey(new Date());

  function scheduleRowsV125() { A.scheduleEvents = Array.isArray(A.scheduleEvents) ? A.scheduleEvents : []; return A.scheduleEvents; }
  function eventSpansDateV125(row,key) { const start = row.date || '', end = row.endDate || start; return !!start && key >= start && key <= (end || start); }
  function eventColorV125(row) { return row.sourceColor || SCHEDULE_CATEGORY[row.category]?.[1] || SCHEDULE_CATEGORY.other[1]; }
  function selectedDdayV125() { const rows = Array.isArray(A.ddays) ? A.ddays : []; return rows.find(row => String(row.id) === String(A.activeDdayId || '')) || rows[0] || null; }
  function ddayCountV125(row) { if (!row?.date) return '—'; const base=new Date();base.setHours(0,0,0,0);const target=new Date(`${row.date}T00:00:00`),gap=Math.round((target-base)/86400000);return gap===0?'D-DAY':gap>0?`D-${gap}`:`D+${Math.abs(gap)}`; }
  function scheduleCellsV125(year,month) {
    const start = new Date(year,month,1-new Date(year,month,1).getDay());
    return Array.from({length:42},(_,index) => {
      const date = new Date(start.getFullYear(),start.getMonth(),start.getDate()+index), key = dateKey(date), rows = scheduleRowsV125().filter(row => eventSpansDateV125(row,key)).sort((a,b)=>String(a.time||'').localeCompare(String(b.time||''))), outside=date.getMonth()!==month;
      return `<button type="button" class="day schedule-day-v119${outside?' outside':''}${key===scheduleSelectedV125?' selected':''}${key===dateKey(new Date())?' today':''}" data-schedule-date-v125="${key}" aria-label="${key} 일정 관리"><span class="schedule-day-number-v119">${date.getDate()}</span>${rows[0]?`<small class="schedule-event-name-v119">${safe(rows[0].allDay?'종일':rows[0].time||'')} ${safe(rows[0].title||'일정')}</small>`:''}<span class="schedule-event-dots-v119">${rows.slice(0,3).map(row=>`<i style="--event-color:${safe(eventColorV125(row))}"></i>`).join('')}</span></button>`;
    }).join('');
  }
  function scheduleUpcomingV125() {
    const now = dateKey(new Date()), rows = scheduleRowsV125().filter(row => (row.endDate || row.date || '') >= now).sort((a,b)=>`${a.date}${a.time||''}`.localeCompare(`${b.date}${b.time||''}`)).slice(0,4);
    const ownerColor=row=>row.sourceColor||(row.owner==='shared'||row.shareWithCouple?'#D67796':row.authorUid&&currentUser()?.uid&&row.authorUid!==currentUser().uid?'#42A993':'var(--theme-primary)');
    return `<section class="upcoming card schedule-upcoming-v119"><header><h3>예정된 일정</h3><small>${rows.length?`${rows.length} UPCOMING`:'SYNC READY'}</small></header>${rows.length?rows.map(row=>`<button class="uprow schedule-upcoming-line-v126" type="button" data-schedule-edit-v125="${safe(row.id)}" style="--owner-color:${safe(ownerColor(row))}"><i class="schedule-owner-dot-v127" aria-hidden="true"></i><time>${safe(row.allDay?'종일':row.time||'시간 미정')}</time><b>${safe(row.title||'일정')}</b></button>`).join(''):'<div class="schedule-empty-v119"><span aria-hidden="true"><i></i></span><p>예정 일정이 없습니다.</p><small>날짜를 눌러 첫 일정을 추가하세요.</small></div>'}</section>`;
  }
  function renderScheduleV125() {
    const year=scheduleCursorV125.getFullYear(),month=scheduleCursorV125.getMonth(),dday=selectedDdayV125();
    home.classList.add('schedule-cosmic-v119','schedule-feature-v125');
    home.innerHTML=`<div class="home schedule-home-v119"><article class="calendar card schedule-calendar-v119"><div class="calhead schedule-calhead-v119"><h1><span>${MONTHS[month]}</span><small>${year}</small></h1><div class="calctl schedule-calctl-v119" aria-label="캘린더 조작"><button type="button" data-calendar-shift-v125="-1" aria-label="이전 달">${icon('previous')}</button><button type="button" class="schedule-today-v119" data-calendar-today-v125>Today</button><button type="button" data-calendar-shift-v125="1" aria-label="다음 달">${icon('next')}</button><button type="button" class="schedule-icon-v119 insights" data-schedule-insights-v125 aria-label="인사이트">${window.AiderLogIconsV126?.icon('insights')||icon('add')}</button><button type="button" class="schedule-icon-v119 emotion" data-schedule-emotion-v125 aria-label="감정 기록">${window.AiderLogIconsV126?.icon('emotion')||icon('add')}</button></div></div><div class="week schedule-week-v119">${WEEK.map(day=>`<span>${day}</span>`).join('')}</div><div class="days schedule-days-v119">${scheduleCellsV125(year,month)}</div></article><aside class="homeside schedule-homeside-v119">${scheduleUpcomingV125()}<button type="button" class="dday schedule-dday-v119" data-dday-open-v125><span class="dday-orbit-v127" aria-hidden="true"></span><small>D-DAY</small>${dday?`<h2>${safe(dday.title||'D-Day')}</h2><strong>${ddayCountV125(dday)}</strong><span>${safe(dday.date)}</span>`:''}</button></aside></div>`;
    bindScheduleV125();
  }

  function ensureScheduleDialogV125() {
    let overlay=$('.schedule-dialog-v125'); if (overlay) return overlay;
    overlay=document.createElement('div');overlay.className='schedule-dialog-v125';overlay.innerHTML=`<section role="dialog" aria-modal="true"><header class="feature-dialog-head-v125"><div><small>SCHEDULE</small><h2 data-schedule-title-v125>일정 추가</h2></div><button type="button" data-schedule-dialog-close-v125 aria-label="닫기">${icon('close')}</button></header><div class="schedule-dialog-body-v125"><div class="schedule-day-list-v125" data-schedule-day-list-v125></div><form class="schedule-form-v125" data-schedule-form-v125><input type="hidden" name="id"><div class="schedule-form-grid-v125"><label>시작 날짜<input name="date" type="date" required></label><label>종료 날짜<input name="endDate" type="date"></label><label>시작 시간<input name="time" type="time"></label><label>종료 시간<input name="endTime" type="time"></label><label>알림<select name="reminderMinutes"><option value="-1">알림 없음</option><option value="0">정각</option><option value="10">10분 전</option><option value="30" selected>30분 전</option><option value="60">1시간 전</option><option value="1440">하루 전</option></select></label><label class="schedule-check-v125"><input name="allDay" type="checkbox"><span>하루 종일 / 날짜 범위 일정</span></label><label class="schedule-check-v125"><input name="shareWithCouple" type="checkbox"><span>연결된 상대와 공유</span></label></div><label>일정명<input name="title" maxlength="100" required placeholder="일정 제목"></label><div class="schedule-form-grid-v125"><label>분류<select name="category">${Object.entries(SCHEDULE_CATEGORY).map(([key,row])=>`<option value="${key}">${row[0]}</option>`).join('')}</select></label><label>장소<input name="location" maxlength="180" placeholder="장소 또는 링크"></label></div><label>메모<textarea name="note" maxlength="1200" placeholder="준비할 내용이나 상세 정보를 적어보세요."></textarea></label><div class="schedule-dialog-actions-v125"><button type="button" class="danger" data-schedule-delete-v125 hidden>삭제</button><button type="button" data-schedule-dialog-close-v125>취소</button><button type="submit" class="primary">일정 저장</button></div></form></div></section>`;document.body.append(overlay);
    overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-schedule-dialog-close-v125]'))closeScheduleV125();const edit=event.target.closest('[data-schedule-list-edit-v125]');if(edit)openScheduleV125(scheduleSelectedV125,edit.dataset.scheduleListEditV125);if(event.target.closest('[data-schedule-delete-v125]'))deleteScheduleV125();});
    $('[data-schedule-form-v125]',overlay).addEventListener('submit',saveScheduleV125);
    $('[name="allDay"]',overlay).addEventListener('change',event=>{for(const name of ['time','endTime'])$(`[name="${name}"]`,overlay).disabled=event.target.checked;});
    return overlay;
  }
  function openScheduleV125(date,id='') {
    const overlay=ensureScheduleDialogV125(),form=$('[data-schedule-form-v125]',overlay),rows=scheduleRowsV125().filter(row=>eventSpansDateV125(row,date)),row=id?scheduleRowsV125().find(item=>String(item.id)===String(id)):null;
    scheduleSelectedV125=date||row?.date||scheduleSelectedV125;form.reset();form.elements.id.value=row?.id||'';form.elements.date.value=row?.date||scheduleSelectedV125;form.elements.endDate.value=row?.endDate||'';form.elements.time.value=row?.time||'';form.elements.endTime.value=row?.endTime||'';form.elements.reminderMinutes.value=String(row?.reminderMinutes??30);form.elements.title.value=row?.title||'';form.elements.category.value=row?.category||'other';form.elements.location.value=row?.location||'';form.elements.note.value=row?.note||row?.memo||'';form.elements.allDay.checked=!!row?.allDay;form.elements.shareWithCouple.checked=!!(row?.shareWithCouple||row?.owner==='shared');form.elements.shareWithCouple.disabled=!currentState().pair;form.elements.time.disabled=form.elements.endTime.disabled=form.elements.allDay.checked;$('[data-schedule-title-v125]',overlay).textContent=row?'일정 수정':`${scheduleSelectedV125} 일정 추가`;$('[data-schedule-delete-v125]',overlay).hidden=!row||row.readOnly;
    $('[data-schedule-day-list-v125]',overlay).innerHTML=rows.map(item=>`<article class="schedule-item-v125"><i style="--event-color:${safe(eventColorV125(item))}"></i><div><b>${safe(item.title||'일정')}</b><span>${safe(item.allDay?'종일':item.time||'시간 미정')}${item.sourceTitle?` · ${safe(item.sourceTitle)}`:''}</span></div><button type="button" data-schedule-list-edit-v125="${safe(item.id)}">${item.readOnly?'보기':'수정'}</button></article>`).join('');
    $$('input,textarea,select,button[type="submit"]',form).forEach(control=>control.disabled=!!row?.readOnly && !['button'].includes(control.tagName.toLowerCase()));
    if(row?.readOnly){form.querySelector('button[type="submit"]').hidden=true}else form.querySelector('button[type="submit"]').hidden=false;
    overlay.classList.add('on');setTimeout(()=>form.elements.title.focus(),30);
  }
  function closeScheduleV125(){ $('.schedule-dialog-v125')?.classList.remove('on'); }
  async function persistScheduleV125() {
    try { localStorage.setItem('aiderlog-app-v20',JSON.stringify(A)); } catch (_) {}
    if (typeof saveApp === 'function') await saveApp();
    const api=window.AiderDearFirebase;if(currentUser()&&api?.writeScheduleData)try{await api.writeScheduleData(scheduleRowsV125())}catch(error){console.warn('Schedule sync skipped',error)}
  }
  function syncNativeReminderV136(row){
    const bridge=window.AiderLogNative;if(!row||Number(row.reminderMinutes)<0||typeof bridge?.scheduleEventNotification!=='function')return;
    try{bridge.scheduleEventNotification(JSON.stringify({id:row.id,title:row.title,date:row.date,time:row.allDay?'09:00':row.time||'09:00',reminderMinutes:Number(row.reminderMinutes)||0,location:row.location||''}))}catch(error){console.warn('Native reminder skipped',error)}
  }
  function cancelNativeReminderV136(id){try{window.AiderLogNative?.cancelEventNotification?.(String(id||''))}catch(error){console.warn('Native reminder cancel skipped',error)}}
  async function saveScheduleV125(event) {
    event.preventDefault();const form=event.currentTarget,data=new FormData(form),id=String(data.get('id')||''),existing=id?scheduleRowsV125().find(row=>String(row.id)===id):null;if(existing?.readOnly)return;const start=String(data.get('date')||scheduleSelectedV125),end=String(data.get('endDate')||'');if(end&&end<start){alert('종료 날짜는 시작 날짜 이후여야 합니다.');return}const stamp=Date.now(),user=currentUser()||{},shared=!!data.get('shareWithCouple');const row={...existing,id:existing?.id||`schedule-${stamp}-${Math.random().toString(36).slice(2,7)}`,date:start,endDate:end,time:data.get('allDay')?'':String(data.get('time')||''),endTime:data.get('allDay')?'':String(data.get('endTime')||''),allDay:!!data.get('allDay'),reminderMinutes:Number(data.get('reminderMinutes')??-1),title:String(data.get('title')||'').trim().slice(0,100),category:String(data.get('category')||'other'),location:String(data.get('location')||'').trim().slice(0,180),note:String(data.get('note')||'').trim().slice(0,1200),owner:shared?'shared':'mine',shareWithCouple:shared,authorEmail:existing?.authorEmail||user.email||'',authorUid:existing?.authorUid||user.uid||'',createdAt:existing?.createdAt||stamp,updatedAt:stamp};if(!row.title)return;const rows=scheduleRowsV125(),index=rows.findIndex(item=>String(item.id)===String(row.id));if(index>=0)rows[index]=row;else rows.push(row);scheduleSelectedV125=row.date;scheduleCursorV125=new Date(new Date(`${row.date}T12:00:00`).getFullYear(),new Date(`${row.date}T12:00:00`).getMonth(),1);closeScheduleV125();renderScheduleV125();await persistScheduleV125();if(row.reminderMinutes>=0)syncNativeReminderV136(row);else cancelNativeReminderV136(row.id);
  }
  async function deleteScheduleV125(){const form=$('[data-schedule-form-v125]'),id=form?.elements.id.value,row=scheduleRowsV125().find(item=>String(item.id)===String(id));if(!row||row.readOnly||!confirm('이 일정을 삭제할까요?'))return;A.scheduleEvents=scheduleRowsV125().filter(item=>String(item.id)!==String(id));cancelNativeReminderV136(id);closeScheduleV125();renderScheduleV125();await persistScheduleV125();}

  function ensureDdayV125(){let overlay=$('.dday-dialog-v125');if(overlay)return overlay;overlay=document.createElement('div');overlay.className='dday-dialog-v125';overlay.innerHTML=`<section role="dialog" aria-modal="true"><header class="feature-dialog-head-v125"><div><small>SCHEDULE</small><h2>D-DAY 목록</h2></div><button type="button" data-dday-close-v125>${icon('close')}</button></header><div class="dday-list-v125" data-dday-list-v125></div><button type="button" class="dday-add-toggle-v126" data-dday-add-toggle-v126>＋ D-DAY 추가</button><form class="dday-form-v125 dday-form-v126" data-dday-form-v125 hidden><input name="title" maxlength="80" required placeholder="D-DAY 이름"><input name="date" type="date" required><div><button type="button" data-dday-add-cancel-v126>취소</button><button type="submit">추가</button></div></form></section>`;document.body.append(overlay);overlay.addEventListener('click',async event=>{if(event.target===overlay||event.target.closest('[data-dday-close-v125]'))overlay.classList.remove('on');if(event.target.closest('[data-dday-add-toggle-v126]')){const form=$('[data-dday-form-v125]',overlay);form.hidden=false;event.target.closest('[data-dday-add-toggle-v126]').hidden=true;setTimeout(()=>form.elements.title.focus(),20)}if(event.target.closest('[data-dday-add-cancel-v126]')){const form=$('[data-dday-form-v125]',overlay);form.reset();form.hidden=true;$('[data-dday-add-toggle-v126]',overlay).hidden=false}const select=event.target.closest('[data-dday-select-v125]');if(select){A.activeDdayId=select.dataset.ddaySelectV125;await saveApp();renderDdayListV125();renderScheduleV125()}const remove=event.target.closest('[data-dday-delete-v125]');if(remove){A.ddays=(A.ddays||[]).filter(row=>String(row.id)!==String(remove.dataset.ddayDeleteV125));if(A.activeDdayId===remove.dataset.ddayDeleteV125)A.activeDdayId=A.ddays[0]?.id||'';await saveApp();renderDdayListV125();renderScheduleV125()}});$('[data-dday-form-v125]',overlay).addEventListener('submit',async event=>{event.preventDefault();const data=new FormData(event.currentTarget),row={id:`dday-${Date.now()}`,title:String(data.get('title')||'').trim().slice(0,80),date:String(data.get('date')||'')};if(!row.title||!row.date)return;A.ddays=Array.isArray(A.ddays)?A.ddays:[];A.ddays.push(row);A.activeDdayId=row.id;event.currentTarget.reset();event.currentTarget.hidden=true;$('[data-dday-add-toggle-v126]',overlay).hidden=false;await saveApp();renderDdayListV125();renderScheduleV125()});return overlay;}
  function renderDdayListV125(){const overlay=ensureDdayV125(),rows=Array.isArray(A.ddays)?A.ddays:[];$('[data-dday-list-v125]',overlay).innerHTML=rows.length?rows.map(row=>`<article class="dday-row-v125"><div><b>${safe(row.title)}</b><small>${safe(row.date)} · ${ddayCountV125(row)}</small></div><button type="button" class="${selectedDdayV125()?.id===row.id?'active':''}" data-dday-select-v125="${safe(row.id)}">대표</button><button type="button" data-dday-delete-v125="${safe(row.id)}">삭제</button></article>`).join(''):'<p class="shorts-transcript-state-v125">저장된 D-DAY가 없습니다.</p>';}
  function openDdayV125(){const overlay=ensureDdayV125();renderDdayListV125();const form=$('[data-dday-form-v125]',overlay);form.reset();form.hidden=true;$('[data-dday-add-toggle-v126]',overlay).hidden=false;$('[name="date"]',overlay).value=dateKey(new Date());overlay.classList.add('on')}
  function bindScheduleV125(){home.querySelectorAll('[data-calendar-shift-v125]').forEach(button=>button.onclick=()=>{scheduleCursorV125=new Date(scheduleCursorV125.getFullYear(),scheduleCursorV125.getMonth()+Number(button.dataset.calendarShiftV125),1);renderScheduleV125()});$('[data-calendar-today-v125]',home).onclick=()=>{const now=new Date();scheduleCursorV125=new Date(now.getFullYear(),now.getMonth(),1);scheduleSelectedV125=dateKey(now);renderScheduleV125()};$('[data-schedule-insights-v125]',home).onclick=()=>go('insights');$('[data-schedule-emotion-v125]',home).onclick=()=>{if(legacyEmotionOpenV125)legacyEmotionOpenV125();else document.querySelector('.emotion-dialog-v119')?.classList.add('on')};home.querySelectorAll('[data-schedule-date-v125]').forEach(button=>button.onclick=()=>openScheduleV125(button.dataset.scheduleDateV125));home.querySelectorAll('[data-schedule-edit-v125]').forEach(button=>button.onclick=()=>{const row=scheduleRowsV125().find(item=>String(item.id)===String(button.dataset.scheduleEditV125));openScheduleV125(row?.date||scheduleSelectedV125,row?.id||'')});home.querySelectorAll('[data-dday-open-v125]').forEach(button=>button.onclick=openDdayV125)}

  function recentEmotionDaysV125() {
    const rows = typeof emotionRows === 'function' ? emotionRows() : (Array.isArray(E?.entries) ? E.entries : Object.values(E?.entries || {}));
    return Array.from({length:3},(_,offset)=>{const date=new Date();date.setDate(date.getDate()-offset);const key=dateKey(date),items=rows.filter(row=>(row.date||dateKey(new Date(Number(row.createdAt)||0)))===key),counts={};items.forEach(row=>(row.moods||[row.mood||row.emotion]).filter(Boolean).forEach(mood=>counts[mood]=(counts[mood]||0)+1));const top=Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||'기록 없음',values=items.map(row=>Number(row.intensity||row.strength||row.score)).filter(Number.isFinite),avg=values.length?(values.reduce((sum,value)=>sum+value,0)/values.length).toFixed(1):'—',activity=items.map(row=>row.activity||row.context||row.action).find(Boolean)||`${items.length}건`;return{key,label:offset===0?'오늘':offset===1?'어제':'2일 전',top,avg,activity,count:items.length};});
  }
  function decorateIntroV125() {
    const card=$('#intro .intro-card');if(!card||card.classList.contains('insight-letter-card-v132'))return;$('#introView')?.remove();let section=$('.insight-three-days-v125',card);if(!section){section=document.createElement('section');section.className='insight-three-days-v125';card.append(section)}section.innerHTML=recentEmotionDaysV125().map(day=>`<article class="insight-day-v125"><time>${day.label} · ${day.key.slice(5).replace('-','.')}</time><b>${safe(day.top)}</b><span>${day.count?`강도 ${day.avg} · ${safe(day.activity)}`:'기록 없음'}</span></article>`).join('');const host=$('#introMascot');if(host&&!host.querySelector('img')){const map={'기쁨':'joy','행복':'happiness','설렘':'excitement','편안함':'calm','평온':'calm','감사':'gratitude','피곤함':'tired','불안':'anxiety','짜증':'irritation','외로움':'loneliness','슬픔':'sadness'},key=map[$('#introMood')?.textContent?.trim()]||'calm';host.innerHTML=`<figure class="al-intro-mascot-v118 mood-${key}"><span class="al-intro-glow-v118"></span><img src="./mascots-v118/${key}.png" alt="감정 마스코트"></figure>`}}

  function ensureTravelFolderDialogV125() {
    let overlay=$('.travel-folder-dialog-v125');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.className='travel-folder-dialog-v125';overlay.innerHTML=`<section role="dialog" aria-modal="true"><header class="feature-dialog-head-v125"><div><small>TRAVEL</small><h2>새 여행지</h2></div><button type="button" data-travel-folder-close-v125>${icon('close')}</button></header><form data-travel-folder-form-v125><label>여행지 이름<input name="name" maxlength="60" required placeholder="도시 또는 여행 이름"></label><div class="travel-folder-date-grid-v125"><label>출발일<input name="startDate" type="date"></label><label>도착일<input name="endDate" type="date"></label></div><p data-travel-folder-error-v125></p><div class="schedule-dialog-actions-v125"><button type="button" data-travel-folder-close-v125>취소</button><button type="submit" class="primary">여행지 만들기</button></div></form></section>`;document.body.append(overlay);
    overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-travel-folder-close-v125]'))overlay.classList.remove('on')});
    $('[data-travel-folder-form-v125]',overlay).addEventListener('submit',async event=>{event.preventDefault();const data=new FormData(event.currentTarget),name=String(data.get('name')||'').trim(),start=String(data.get('startDate')||''),end=String(data.get('endDate')||''),error=$('[data-travel-folder-error-v125]',overlay);error.textContent='';if(!name)return;if(start&&end&&end<start){error.textContent='도착일은 출발일 이후여야 합니다.';return}const rows=travelFoldersV111().filter(row=>String(row.id)!=='trip-default'||A.travelFolders?.length);if(rows.some(row=>String(row.name||'').toLowerCase()===name.toLowerCase())){error.textContent='같은 이름의 여행지가 있습니다.';return}const colors=['#C7D8D0','#C9DAEB','#E8D4B5','#EFC9B5','#D9CFEC','#E9C9D1'],folder={id:`trip-${Date.now()}`,name:name.slice(0,60),color:colors[rows.length%colors.length],startDate:start,endDate:end,createdAt:Date.now()};rows.push(folder);putTravelFoldersV111(rows);travelFolderV111=folder.id;overlay.classList.remove('on');event.currentTarget.reset();await saveApp();renderEvent()});return overlay;
  }
  function openTravelFolderDialogV125(){const overlay=ensureTravelFolderDialogV125(),form=$('[data-travel-folder-form-v125]',overlay),start=dateKey(new Date());form.reset();form.elements.startDate.value=start;form.elements.endDate.value=start;$('[data-travel-folder-error-v125]',overlay).textContent='';overlay.classList.add('on');setTimeout(()=>form.elements.name.focus(),30)}
  if(typeof createTravelFolderV111==='function')createTravelFolderV111=openTravelFolderDialogV125;

  function installRoutineStatsModal() {
    if (typeof routineOverallHTML !== 'function' || routineOverallHTML.__v125) return;
    const next = function(){
      if(!routineOverallOpen)return'';
      const routines=Array.isArray(P.routines)?P.routines:[],stats=routineOverall(),days=Array.from({length:14},(_,index)=>routineOffsetDate(index-13)),levelCounts={MINI:0,MORE:0,MAX:0,SKIP:0},weekday=Array(7).fill(0),daily=days.map(date=>({date,value:0}));
      routines.forEach(r=>Object.entries(r.dailyLevels||{}).forEach(([date,raw])=>{const level=String(raw||'').toUpperCase();if(level in levelCounts)levelCounts[level]++;if(level&&level!=='SKIP'){const day=new Date(`${date}T12:00:00`).getDay();weekday[day]++;const point=daily.find(item=>item.date===date);if(point)point.value++}}));
      const totalLevels=Object.values(levelCounts).reduce((sum,value)=>sum+value,0)||1,bestDay=weekday.indexOf(Math.max(...weekday)),weekNames=['일','월','화','수','목','금','토'],maxDaily=Math.max(1,...daily.map(item=>item.value));
      const rows=routines.map(r=>{const metric=routineMetrics(r);return `<article class="routine-stat-row-v127" style="--routine-color:${routineColor(r)}"><i></i><div><b>${safe(r.text||r.title||'Routine')}</b><span>${metric.cycle.day}/${metric.cycle.goal}일 · ${metric.practice}회 실천</span></div><strong>${metric.completion}%</strong></article>`}).join('')||'<p class="routine-stat-empty-v127">루틴을 추가하면 비교 분석이 시작됩니다.</p>';
      const levelBars=['MINI','MORE','MAX','SKIP'].map(level=>`<div><span>${level}</span><i><em style="width:${Math.round(levelCounts[level]/totalLevels*100)}%"></em></i><b>${levelCounts[level]}</b></div>`).join('');
      const dayBars=daily.map(item=>`<div title="${item.date}"><i style="height:${Math.max(7,Math.round(item.value/maxDaily*100))}%"></i><span>${item.date.slice(8)}</span></div>`).join('');
      return `<div class="routine-stats-dialog-v125 on" data-routine-stats-overlay-v125><section class="routine-stats-sheet-v127" role="dialog" aria-modal="true"><header class="feature-dialog-head-v125"><div><small>ROUTINE STATISTICS</small><h2>전체 통계</h2><p>저장된 루틴 기록을 최근 흐름과 단계별로 분석했어요.</p></div><button type="button" data-routine-stats-close-v125>${icon('close')}</button></header><section class="routine-overall-v110"><article><span>최근 30일 실천</span><b>${stats.practice}</b></article><article><span>전체 완료율</span><b>${stats.rate}%</b></article><article><span>최장 연속</span><b>${stats.streak}일</b></article><article><span>활성 루틴</span><b>${stats.count}</b></article></section><div class="routine-analysis-grid-v127"><section><header><b>최근 14일 흐름</b><span>하루 완료 루틴 수</span></header><div class="routine-day-bars-v127">${dayBars}</div><p>가장 자주 실천한 요일은 <b>${weekNames[bestDay]}요일</b>이에요.</p></section><section><header><b>단계 분포</b><span>전체 기록</span></header><div class="routine-level-bars-v127">${levelBars}</div></section><section class="routine-stat-routines-v127"><header><b>루틴별 진도</b><span>현재 회차 기준</span></header>${rows}</section></div></section></div>`
    };next.__v125=true;routineOverallHTML=next;
    const root=$('#routine');if(root&&!root.dataset.statsV125){root.dataset.statsV125='1';root.addEventListener('click',event=>{if(event.target.closest('[data-routine-stats-close-v125]')||event.target.matches('[data-routine-stats-overlay-v125]')){event.preventDefault();event.stopImmediatePropagation();routineOverallOpen=false;renderRoutine()}},true)}
  }

  function parseJsonArrayAt(text,start) {let depth=0,string=false,escapeNext=false;for(let index=start;index<text.length;index++){const char=text[index];if(string){if(escapeNext)escapeNext=false;else if(char==='\\')escapeNext=true;else if(char==='"')string=false;continue}if(char==='"'){string=true;continue}if(char==='[')depth++;if(char===']'&&--depth===0)return text.slice(start,index+1)}return''}
  function parseCaptionPayloadV125(payload) {let data=payload;if(typeof payload==='string'){try{data=JSON.parse(payload)}catch(_){const doc=new DOMParser().parseFromString(payload,'text/xml');return $$('text',doc).map(node=>node.textContent||'').join(' ')}}if(Array.isArray(data?.events))return data.events.flatMap(event=>event.segs||[]).map(seg=>seg.utf8||'').join(' ');if(Array.isArray(data))return data.map(item=>item.text||item.utf8||'').join(' ');return''}
  function splitSentencesV125(text) {const clean=String(text||'').replace(/\s+/g,' ').replace(/\[(music|applause|laughter)\]/ig,'').trim(),chunks=clean.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[];const out=[];chunks.forEach(chunk=>{const value=chunk.trim();if(!value)return;if(value.length<=150)out.push(value);else{const words=value.split(' ');let current='';words.forEach(word=>{if((current+' '+word).trim().length>120&&current){out.push(current.trim());current=word}else current=(current+' '+word).trim()});if(current)out.push(current)}});return [...new Set(out.filter(value=>/[A-Za-z]/.test(value)).map(value=>value.replace(/^[-–—\s]+/,'')))].slice(0,80)}
  function youtubeIdV125(raw){try{const url=new URL(String(raw||'').trim());if(url.hostname==='youtu.be')return url.pathname.split('/').filter(Boolean)[0]||'';if(!/(^|\.)youtube\.com$/.test(url.hostname))return'';const parts=url.pathname.split('/').filter(Boolean);return ['shorts','embed'].includes(parts[0])?parts[1]||'':url.searchParams.get('v')||''}catch(_){return''}}
  async function fetchTranscriptV125(videoId) {
    const nativeBridge=window.AiderLogNative;if(typeof nativeBridge?.fetchYouTubeCaption==='function'){for(const automatic of [false,true]){try{const payload=nativeBridge.fetchYouTubeCaption(videoId,automatic),sentences=splitSentencesV125(parseCaptionPayloadV125(payload));if(sentences.length)return sentences}catch(_){}}}
    const directUrls=[`https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=en&fmt=json3`,`https://www.youtube.com/api/timedtext?v=${encodeURIComponent(videoId)}&lang=en&kind=asr&fmt=json3`];
    for(const url of directUrls){try{const response=await fetch(url,{credentials:'omit'});if(!response.ok)continue;const sentences=splitSentencesV125(parseCaptionPayloadV125(await response.text()));if(sentences.length)return sentences}catch(_){}}
    const watch=await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&hl=en`,{credentials:'omit'});if(!watch.ok)throw new Error('YouTube 영상 정보를 불러오지 못했습니다.');const html=await watch.text(),marker='"captionTracks":',index=html.indexOf(marker);if(index<0)throw new Error('이 영상에는 사용할 수 있는 자막이 없습니다.');const start=html.indexOf('[',index+marker.length),json=parseJsonArrayAt(html,start),tracks=JSON.parse(json),track=tracks.find(item=>/^en(?:-|$)/i.test(item.languageCode||''))||tracks.find(item=>item.kind!=='asr')||tracks[0];if(!track?.baseUrl)throw new Error('영어 자막 트랙을 찾지 못했습니다.');const response=await fetch(`${track.baseUrl}&fmt=json3`,{credentials:'omit'});if(!response.ok)throw new Error('자막 데이터를 불러오지 못했습니다.');const text=parseCaptionPayloadV125(await response.text()),sentences=splitSentencesV125(text);if(!sentences.length)throw new Error('정리할 영어 문장을 찾지 못했습니다.');return sentences;
  }
  function shortsStoreV125(){try{const value=JSON.parse(localStorage.getItem(SHORTS_KEY)||'{}');return value&&typeof value==='object'?value:{current:null,notes:[]}}catch(_){return{current:null,notes:[]}}}
  function saveShortsStoreV125(store){try{localStorage.setItem(SHORTS_KEY,JSON.stringify(store))}catch(_){}const api=window.AiderDearFirebase;if(currentUser()&&api?.writePrivateData&&typeof P!=='undefined'){P.languageShorts=store;api.writePrivateData(P).catch(error=>console.warn('Shorts transcript sync skipped',error))}}
  let transcriptTimerV125=0;
  function queueTranscriptV125(form){clearTimeout(transcriptTimerV125);const url=$('input',form)?.value;transcriptTimerV125=setTimeout(()=>analyseShortsV125(url),110)}
  function ensureTranscriptPanelV125() {const work=$('.al-shorts-work-v118');if(!work)return null;let panel=$('.shorts-transcript-v125',work);if(!panel){panel=document.createElement('section');panel.className='shorts-transcript-v125';panel.innerHTML='<header><b>영상 문장</b><span>영어 자막을 문장 단위로 정리합니다.</span></header><div class="shorts-transcript-list-v125"></div>';const note=$('.al-shorts-note-v118',work);work.insertBefore(panel,note||work.firstChild);panel.addEventListener('click',event=>{const button=event.target.closest('[data-transcript-sentence-v125]');if(!button)return;const input=$('.al-shorts-note-v118 [name="phrase"]');if(input){input.value=button.dataset.transcriptSentenceV125;input.focus()}})}const linkForm=$('.al-shorts-link-v118',work.closest('.al-shorts-v118')||document);if(linkForm&&linkForm.dataset.transcriptV125!=='1'){linkForm.dataset.transcriptV125='1';linkForm.addEventListener('submit',()=>queueTranscriptV125(linkForm),true);$('button[type="submit"]',linkForm)?.addEventListener('click',()=>queueTranscriptV125(linkForm),true)}renderTranscriptPanelV125(panel);return panel}
  function renderTranscriptPanelV125(panel=ensureTranscriptPanelV125(),state=''){if(!panel)return;const store=shortsStoreV125(),sentences=Array.isArray(store.current?.sentences)?store.current.sentences:[],list=$('.shorts-transcript-list-v125',panel),storedError=String(store.current?.transcriptError||'');if(state)list.innerHTML=`<p class="shorts-transcript-state-v125">${safe(state)}</p>`;else if(sentences.length)list.innerHTML=sentences.map((sentence,index)=>`<button type="button" data-transcript-sentence-v125="${safe(sentence)}"><b>${String(index+1).padStart(2,'0')}</b> ${safe(sentence)}</button>`).join('');else if(storedError)list.innerHTML=`<p class="shorts-transcript-state-v125">${safe(storedError)} · 공개 영어 자막이 있는 영상에서 사용할 수 있습니다.</p>`;else list.innerHTML='<p class="shorts-transcript-state-v125">Shorts 링크를 열면 접근 가능한 영어 자막을 자동으로 정리합니다.</p>'}
  let analysingVideoV125='';
  async function analyseShortsV125(url) {const id=youtubeIdV125(url);if(!id||analysingVideoV125===id)return;analysingVideoV125=id;const panel=ensureTranscriptPanelV125();renderTranscriptPanelV125(panel,'영상의 영어 자막을 분석하고 있습니다…');try{const sentences=await fetchTranscriptV125(id),store=shortsStoreV125();if(store.current?.id!==id)store.current={id,url:String(url||'').trim(),updatedAt:Date.now()};store.current.sentences=sentences;store.current.transcriptError='';store.current.transcriptUpdatedAt=Date.now();saveShortsStoreV125(store);renderTranscriptPanelV125(panel)}catch(error){const store=shortsStoreV125();if(store.current?.id===id){store.current.sentences=[];store.current.transcriptError=String(error?.message||error);store.current.transcriptUpdatedAt=Date.now();saveShortsStoreV125(store)}renderTranscriptPanelV125(panel,`${error?.message||'자막을 정리하지 못했습니다.'} · 공개 영어 자막이 있는 영상에서 사용할 수 있습니다.`)}finally{analysingVideoV125=''}}
  function maybeAnalyseCurrentShortV125(){const store=shortsStoreV125(),current=store.current,sentences=Array.isArray(current?.sentences)?current.sentences:[];if(current?.id&&!sentences.length&&!current.transcriptError&&analysingVideoV125!==current.id)analyseShortsV125(current.url||`https://www.youtube.com/watch?v=${current.id}`)}

  window.AiderLogTranscriptV125=Object.freeze({youtubeId:youtubeIdV125,parseCaptionPayload:parseCaptionPayloadV125,splitSentences:splitSentencesV125,extract:fetchTranscriptV125});
  window.AiderLogThemeV125=Object.freeze({themes:Object.keys(THEMES),apply:applyTheme,applyFontSize,openSettings});
  window.AiderLogCalendarV125=Object.freeze({parseIcs,openSettings:()=>openSettings('calendar')});

  const previousOpenIntro = typeof openIntro === 'function' ? openIntro : null;
  if (previousOpenIntro) openIntro = function(){previousOpenIntro();requestAnimationFrame(decorateIntroV125)};
  renderHome = renderScheduleV125;
  installRoutineStatsModal();

  document.addEventListener('language-lab-ready',()=>{applyLanguageTheme();ensureTranscriptPanelV125();[80,320,900].forEach(delay=>setTimeout(applyLanguageTheme,delay))});
  document.addEventListener('click',event=>{const close=event.target.closest('#introClose');if(close)$('#intro')?.classList.remove('on')});

  let queuePending=false;
  function refreshV125(){queuePending=false;bindProfileSettings();applyFixedWheelV125();applyLanguageTheme();installRoutineStatsModal();ensureTranscriptPanelV125();maybeAnalyseCurrentShortV125();if($('#intro')?.classList.contains('on'))decorateIntroV125()}
  new MutationObserver(()=>{if(queuePending)return;queuePending=true;requestAnimationFrame(refreshV125)}).observe(document.documentElement,{childList:true,subtree:true});

  const previousSync = typeof sync === 'function' ? sync : null;
  if (previousSync) sync = async function(){const result=await previousSync.apply(this,arguments);const cloudTheme=typeof P!=='undefined'?P?.settings?.theme:'',cloudFont=typeof P!=='undefined'?P?.settings?.fontSize:'';if(PREVIEW_THEME_V126)await applyTheme(PREVIEW_THEME_V126,false);else if(cloudTheme)await applyTheme(cloudTheme,false);if(cloudFont)await applyFontSize(cloudFont,false);return result};
  window.addEventListener('aiderdear-firebase-state',event=>{bindProfileSettings();const user=event.detail?.user;if(PREVIEW_THEME_V126)applyTheme(PREVIEW_THEME_V126,false);else if(user&&typeof P!=='undefined'&&P?.settings?.theme)applyTheme(P.settings.theme,false);if(user&&typeof P!=='undefined'&&P?.settings?.fontSize)applyFontSize(P.settings.fontSize,false)});
  window.addEventListener('aiderdear-firebase-ready',bindProfileSettings,{once:true});

  const featurePreviewV125=new URLSearchParams(location.search),previewThemeV125=PREVIEW_THEME_V126;
  applyTheme(previewThemeV125||(typeof P!=='undefined'&&P?.settings?.theme)||currentTheme(),false);
  applyFontSize(PREVIEW_FONT_V134||(typeof P!=='undefined'&&P?.settings?.fontSize)||localStorage.getItem('aiderlogFontSize')||'normal',false);
  bindProfileSettings();
  applyFixedWheelV125();
  renderScheduleV125();
  refreshV125();
  if(featurePreviewV125.get('settings')==='1')setTimeout(()=>openSettings(),80);
})();
