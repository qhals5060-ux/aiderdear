(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  // Shared by both existing settings entry points. Labels remain accessible,
  // while the visible controls are six small, solid colour swatches.
  const THEMES = Object.freeze({
    system:{name:'기본 · Soft Purple',a:'#6E4A8E'},
    terracotta:{name:'테라코타',a:'#99472F'},
    apricot:{name:'애프리콧',a:'#E8A168'},
    peach:{name:'피치 크림',a:'#F0CEB4'},
    slate:{name:'슬레이트 블루',a:'#416579'},
    charcoal:{name:'잉크 차콜',a:'#2D3E48'}
  });
  // Keep legacy saved IDs; one resolved palette now colours content, wheel and logo.
  const LEGACY_THEMES = Object.freeze({sun:'terracotta',mercury:'charcoal',venus:'peach',earth:'slate',mars:'terracotta',jupiter:'apricot',saturn:'peach',uranus:'slate',neptune:'slate',pluto:'charcoal','cosmic-violet':'system','nebula-blue':'slate','solar-dust':'terracotta','aurora-pink':'peach','eclipse-mono':'charcoal',aurora:'system',lavender:'system',ocean:'slate',mint:'slate',rose:'peach',sunset:'apricot',midnight:'charcoal',mono:'charcoal'});
  const FONT_SIZES = {
    small:{name:'작게',note:'정보를 더 많이 봅니다'},
    normal:{name:'보통',note:'균형 잡힌 기본 크기'},
    large:{name:'크게',note:'읽기 편한 큰 글자'}
  };
  const THEME_KEY = 'aiderlogTheme';
  const CALENDAR_KEY = 'aiderlog-calendar-selection-v1';
  const PREVIEW_THEME_V126 = new URLSearchParams(location.search).get('theme');
  const PREVIEW_FONT_V134 = new URLSearchParams(location.search).get('android-preview') === '1'
    ? new URLSearchParams(location.search).get('font')
    : '';
  const themeId = value => THEMES[value] || LEGACY_THEMES[value] ? value : 'system';
  const paletteId = value => LEGACY_THEMES[value] || (THEMES[value] ? value : 'system');
  const fontSizeId = value => FONT_SIZES[value] ? value : 'normal';
  const currentState = () => window.AiderDearFirebase?.getState?.() || (typeof authState !== 'undefined' ? authState : {}) || {};
  const currentUser = () => currentState().user || null;
  const currentTheme = () => themeId(document.documentElement.dataset.theme);

  function icon(name) {
    if (window.AiderLogCosmicIconsV123?.icon) return window.AiderLogCosmicIconsV123.icon(name);
    const paths = name === 'close' ? '<path d="m6 6 12 12M18 6 6 18"/>'
      : name === 'dday' ? '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17M9 13v4h1.4a2 2 0 0 0 0-4H9Z"/>'
      : name === 'calendar' ? '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17"/>'
      : '<circle cx="12" cy="12" r="8"/><path d="M12 8v8M8 12h8"/>';
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">${paths}</svg>`;
  }

  const wheelMarkupV175 = new WeakMap();
  function applyFixedWheelV125() {
    const wheel=$('#wheel');if(!wheel)return;
    const order=['fifth','personal','routine','event'],labels={event:'Event',routine:'Routine',personal:'Personal',fifth:'My'},icons={event:'event',routine:'routine',personal:'profile',fifth:'my'};
    $$('.global-wheel-item-v126',wheel).forEach((button,index)=>{
      const page=order[index];if(!page)return;const label=window.AiderWheelbarV176?.names[page]||labels[page];
      if(button.dataset.page!==page)button.dataset.page=page;if(button.dataset.index!==String(index))button.dataset.index=String(index);
      if(button.getAttribute('aria-label')!==label)button.setAttribute('aria-label',label);button.title=label;
      // v178: never paint an older glyph while a drag/hover decoration runs.
      // The final renderer owns its SVG node, not a later observer repair.
      if(window.AiderWheelbarV176?.icon)return;
      const markup=`<i>${window.AiderLogIconsV126?.icon(icons[page])||icon(icons[page])}</i>`,cached=wheelMarkupV175.get(button);
      if(!cached||cached.source!==markup||!button.querySelector('svg')){button.innerHTML=markup;wheelMarkupV175.set(button,{source:markup});}
    });
    window.AiderWheelbarV176?.refresh();
    const core=$('.global-wheel-planet-v126',wheel);if(core&&core.dataset.pressV125!=='1'){core.dataset.pressV125='1';const on=()=>core.classList.add('pressing'),off=()=>core.classList.remove('pressing');core.addEventListener('pointerdown',on);core.addEventListener('pointerup',off);core.addEventListener('pointercancel',off);core.addEventListener('pointerleave',off)}
  }

  function refreshThemeCards() {
    $$('[data-theme-choice-v125]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.themeChoiceV125 === paletteId(currentTheme()))));
    $$('[data-profile-theme-v137]').forEach(button => {const active=button.dataset.profileThemeV137 === paletteId(currentTheme());button.setAttribute('aria-pressed',String(active));button.classList.toggle('active',active)});
  }

  async function applyTheme(value, persist = false) {
    const id = themeId(value);
    document.documentElement.dataset.theme = id;
    document.documentElement.dataset.appPalette = paletteId(id);
    refreshSystemScheme();
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.content = getComputedStyle(document.documentElement).getPropertyValue(document.documentElement.dataset.backgroundMode === 'light' ? '--app-canvas' : '--app-space-base').trim() || '#231E35';
    
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

  // WebView's prefers-color-scheme can reflect the Activity theme, not the
  // device setting. Read Configuration.uiMode through the existing bridge.
  // This is derived state only: the user's one stored theme stays untouched.
  function refreshSystemScheme() {
    const root = document.documentElement;
    let nativeScheme = '';
    try { nativeScheme = window.AiderLogNative?.getSystemScheme?.() || ''; } catch (_) {}
    if ((nativeScheme === 'light' || nativeScheme === 'dark') && root.dataset.nativeScheme !== nativeScheme) root.dataset.nativeScheme = nativeScheme;
    const scheme = root.dataset.nativeScheme || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (root.dataset.systemScheme !== scheme) {
      root.dataset.systemScheme = scheme;
      
      refreshThemeCards();
    }
    return scheme;
  }

  function themeCardsMarkup() {
    return Object.entries(THEMES).map(([id,row]) => `<button type="button" class="theme-card-v125 theme-swatch-v164" data-theme-choice-v125="${id}" aria-label="${row.name}" aria-pressed="${id === paletteId(currentTheme())}" style="--swatch:${row.a}"><span aria-hidden="true"></span></button>`).join('');
  }

  function fontCardsMarkup() {
    const selected=fontSizeId(document.documentElement.dataset.appFontSize||(typeof P!=='undefined'&&P?.settings?.fontSize));
    return Object.entries(FONT_SIZES).map(([id,row])=>`<button type="button" class="font-card-v133" data-font-choice-v133="${id}" aria-pressed="${id===selected}"><b>${row.name}</b><small>${row.note}</small></button>`).join('');
  }

  async function applyFontSize(value,persist=false){
    const id=fontSizeId(value);document.documentElement.dataset.appFontSize=id;
    $$('[data-font-choice-v133]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.fontChoiceV133===id)));
    const scale={small:.72,normal:.84,large:1}[id];
    document.documentElement.style.setProperty('--app-font-multiplier',String(scale));
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
      <header class="settings-head-v125"><div><small>ACCOUNT &amp; SYSTEM</small><h2 id="settingsTitleV125">AiderLog 설정</h2></div><button type="button" class="settings-close-v125" data-settings-close-v125 aria-label="설정 닫기">${icon('close')}</button></header>
      <div class="settings-user-v125"><div><b data-settings-name-v125>로그인 사용자</b><span data-settings-email-v125></span></div><button type="button" data-settings-logout-v125>로그아웃</button></div>
      <section class="settings-section-v125"><header><h3>시스템 테마</h3></header><div class="theme-grid-v125 planet-theme-grid-v133">${themeCardsMarkup()}</div></section>
      <section class="settings-section-v125"><header><h3>글자 크기</h3></header><div class="font-grid-v133">${fontCardsMarkup()}</div></section>
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
  const SCHEDULE_CATEGORY = {work:['업무','#6255E8'],consulting:['Consulting','#B56A46'],personal:['개인','#D86D99'],health:['건강','#42A993'],study:['학습','#3A86E8'],event:['약속','#E8933A'],other:['기타','#8B849D']};
  const dateKey = value => { const date = value instanceof Date ? new Date(value) : new Date(`${value}T12:00:00`); return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; };
  let scheduleStorageV176=null;try{scheduleStorageV176=window.localStorage;}catch{}
  const scheduleViewV176=window.AiderAppCalendarViewV176.create(scheduleStorageV176);
  let scheduleCursorV125 = scheduleViewV176.current().anchor;
  let scheduleSelectedV125 = dateKey(new Date());

  function baseScheduleRowsV125() { A.scheduleEvents = Array.isArray(A.scheduleEvents) ? A.scheduleEvents : []; return A.scheduleEvents; }
  function privateScheduleRowsV148() {
    const privateData=window.AiderAppDataScopeV179?.ownsPrivate(P)?P:{};
    return [...(window.AiderWorkCalendarV168?.rows?.(privateData)||[]),...(window.AiderEstateCalendarV171?.rows?.()||[])];
  }
  window.addEventListener('aiderlog-calendar-projection-v168',()=>{if(typeof activePage!=='undefined'&&activePage==='home')renderHome()});
  function visibleCachedScheduleV179(row,state){const user=state?.user;if(!row||!user?.uid||row.friendShared)return false;const email=value=>String(value||'').trim().toLowerCase(),uid=String(row.authorUid||row.ownerUid||''),author=email(row.authorEmail||row.ownerEmail),mine=uid?uid===String(user.uid):!!author&&author===email(user.email);if(mine)return true;const partner=state.partner,paired=state.pair?.id&&partner?.uid&&String(row.pairKey||'')===String(state.pair.id),fromPartner=uid?uid===String(partner?.uid||''):!!author&&author===email(partner?.email);return !!(paired&&fromPartner&&(row.owner==='shared'||row.owner==='partner'||row.shareWithCouple));}
  function scheduleRowsV125() { const state=currentState();if(!state.user?.uid)return [];return [...baseScheduleRowsV125().filter(row=>visibleCachedScheduleV179(row,state)),...privateScheduleRowsV148(),...(window.AiderFriendScheduleUIV175?.events?.()||[])].map(row=>row.projectionSource||['work','consulting','estate'].includes(row.calendarScope)?window.AiderBusinessCalendarV175.minimal({...row,projectionSource:row.projectionSource||row.calendarScope}):row); }
  window.addEventListener('aiderdear-firebase-state',()=>{if(typeof activePage!=='undefined'&&activePage==='home')renderHome()});
  window.addEventListener('aiderlog-estate-calendar',()=>{if(typeof activePage!=='undefined'&&activePage==='home')renderHome()});
  window.addEventListener('aiderlog-friend-schedule-data',()=>{if(typeof activePage!=='undefined'&&activePage==='home')renderHome()});
  function eventSpansDateV125(row,key) { const start = row.date || '', end = row.endDate || start; return !!start && key >= start && key <= (end || start); }
  function receivedScheduleV176(row) { return window.AiderSharedScheduleV176?.isReceived(row,currentUser())===true; }
  function eventColorV125(row) { const fallback=row.sourceColor || SCHEDULE_CATEGORY[row.category]?.[1] || SCHEDULE_CATEGORY.other[1];return window.AiderSharedScheduleV176?.color(row,currentUser(),fallback)||fallback; }
  function selectedDdayV125() { return window.AiderAppDdayV175?.selected()||null; }
  function ddayCountV125(row) { return window.AiderAppDdayV175?.count(row)||'—'; }
  function scheduleCellsV125(year,month) {
    const range=scheduleViewV176.current(),start=range.start,previewLimit=3;
    return Array.from({length:range.count},(_,index) => {
      const date = new Date(start.getFullYear(),start.getMonth(),start.getDate()+index), key = dateKey(date), matches = scheduleRowsV125().filter(row => eventSpansDateV125(row,key)), time=window.AiderScheduleTimeV179, rows=time?time.ordered(matches):matches, outside=date.getMonth()!==month;
      const entries=time?time.entries(rows.slice(0,previewLimit)):rows.slice(0,previewLimit).map(row=>({row}));
      const todos=index===13?'<div class="calendar-todos-v179" data-todo-inline-v179 role="region" aria-label="완료하지 않은 전체 할 일"></div>':'';
      return `<button type="button" class="day schedule-day-v119${outside?' outside':''}${key===scheduleSelectedV125?' selected':''}${key===dateKey(new Date())?' today':''}" data-schedule-date-v125="${key}" data-date="${key}" aria-label="${key} 일정 관리"><span class="schedule-day-number-v119">${date.getDate()}</span><span class="calendar-status-icons" aria-label="날짜 기록"></span>${entries.map(({row,separatorBefore})=>`${separatorBefore?'<span class="schedule-halfday-v179" aria-label="오후 일정">-</span>':''}<small class="schedule-event-name-v119${row.allDay?' is-all-day':''}${receivedScheduleV176(row)?' schedule-received-v176':''}" title="${safe(row.title||'일정')}"${receivedScheduleV176(row)?` aria-label="상대가 공유한 일정 · ${safe(row.title||'일정')}"`:''}><span class="schedule-event-time-v176">${safe(time?.format(row)||'')}</span><span class="schedule-event-title-v176">${safe(row.title||'일정')}</span></small>`).join('')}${rows.length>previewLimit?`<small class="schedule-more-v176" aria-label="일정 ${rows.length-previewLimit}개 더 보기">+${rows.length-previewLimit}</small>`:''}</button>${todos}`;
    }).join('');
  }
  function scheduleUpcomingV125() {
    const now = dateKey(new Date()), time=window.AiderScheduleTimeV179, rows = time.ordered(scheduleRowsV125().filter(row => (row.endDate || row.date || '') >= now)).slice(0,12);
    const ownerColor=row=>window.AiderSharedScheduleV176?.color(row,currentUser(),row.sourceColor||'var(--theme-primary)')||row.sourceColor||'var(--theme-primary)';
    return `<section class="schedule-upcoming-v179" aria-label="가까운 일정">${time.entries(rows).map(({row,separatorBefore})=>`${separatorBefore?'<span class="upcoming-halfday-v179" aria-label="오후 일정">-</span>':''}<button class="schedule-upcoming-line-v179${receivedScheduleV176(row)?' schedule-received-v176':''}" type="button" data-schedule-jump-v180="${safe(row.id)}" style="--owner-color:${safe(ownerColor(row))}" title="${safe(row.date||'')} · ${safe(row.title||'일정')}"><i aria-hidden="true"></i><span>${row.allDay?'':`<time>${safe(time.format(row)||'')}</time>`}<b>${safe(row.title||'일정')}</b></span></button>`).join('')}</section>`;
  }
  function renderScheduleV125() {
    const range=scheduleViewV176.current();scheduleCursorV125=range.anchor;
    const year=scheduleCursorV125.getFullYear(),month=scheduleCursorV125.getMonth(),dday=selectedDdayV125();
    home.dataset.calendarViewV176=range.mode;
    home.classList.add('schedule-cosmic-v119','schedule-feature-v125');
    home.innerHTML=`<div class="home schedule-home-v119 schedule-dashboard-v179"><aside class="schedule-summary-v179">${window.AiderAppDdayV175?.cardMarkup?.()||'<button type="button" data-dday-open-v125>D-DAY</button>'}${scheduleUpcomingV125()}</aside><article class="calendar card schedule-calendar-v119"><div class="calhead schedule-calhead-v119"><h1><span>${MONTHS[month]}</span><small>${year}</small></h1><div class="calctl schedule-calctl-v119" aria-label="캘린더 조작"><button type="button" data-calendar-shift-v125="-1" aria-label="이전 달">${icon('previous')}</button><button type="button" class="schedule-today-v119" data-calendar-today-v125>Today</button><button type="button" data-calendar-shift-v125="1" aria-label="다음 달">${icon('next')}</button></div></div><div class="week schedule-week-v119">${WEEK.map(day=>`<span>${day}</span>`).join('')}</div><div class="days schedule-days-v119">${scheduleCellsV125(year,month)}</div></article></div>`;
    bindScheduleV125();window.AiderPrivateCalendarUIV175?.calendarChanged();window.AiderEstateCalendarV171?.refresh();window.AiderFriendScheduleUIV175?.refresh();window.AiderCalendarLayoutV179?.refresh();
  }

  function ensureScheduleDialogV125() {
    let overlay=$('.schedule-dialog-v125'); if (overlay) return overlay;
    overlay=document.createElement('div');overlay.className='schedule-dialog-v125';overlay.innerHTML=`<section role="dialog" aria-modal="true"><header class="feature-dialog-head-v125"><div class="schedule-editor-heading-v182" data-private-header-v179><h2 data-schedule-title-v125>일정 추가</h2></div><div class="schedule-editor-tools-v179"><div class="schedule-editor-primary-v179"><button type="submit" form="appScheduleFormV179" class="primary">저장</button><button type="button" data-schedule-dialog-close-v125 aria-label="닫기">${icon('close')}</button></div></div></header><div class="schedule-dialog-body-v125"><div class="schedule-day-list-v125" data-schedule-day-list-v125></div><form id="appScheduleFormV179" class="schedule-form-v125" data-schedule-form-v125><input type="hidden" name="id"><div class="schedule-title-row-v179"><label class="schedule-title-first-v150">일정 이름<input name="title" maxlength="100" required placeholder="일정 이름을 입력하세요"></label><label class="schedule-all-day-v179"><input name="allDay" type="checkbox">종일</label></div><input type="hidden" name="recordScope" value="schedule"><div class="schedule-form-grid-v125"><label>시작 날짜<input name="date" type="date" required></label><label>종료 날짜<input name="endDate" type="date"></label><label>시작 시간<input name="time" type="time"></label><label>종료 시간<input name="endTime" type="time"></label><label>알림<select name="reminderMinutes"><option value="-1">알림 없음</option><option value="0">정각</option><option value="10">10분 전</option><option value="30" selected>30분 전</option><option value="60">1시간 전</option><option value="1440">하루 전</option></select></label><div class="schedule-share-options-v180" data-app-friend-slot-v179 role="group" aria-label="일정 공유"><label class="schedule-check-v125"><input name="shareWithCouple" type="checkbox"><span>커플</span></label><label class="schedule-check-v125"><input name="shareWithFriends" type="checkbox"><span>친구</span></label></div></div><label data-schedule-location-v150>장소<input name="location" maxlength="180" placeholder="장소 또는 링크"></label><label>메모<textarea name="note" maxlength="1200" placeholder="준비할 내용이나 상세 정보를 적어보세요."></textarea></label><p class="schedule-editor-error-v179" data-schedule-error-v179 role="status" aria-live="polite"></p><div class="schedule-dialog-actions-v125"><button type="button" class="danger" data-schedule-delete-v125 hidden>삭제</button></div></form></div></section>`;document.body.append(overlay);
    overlay.addEventListener('click',event=>{if(event.target===overlay||event.target.closest('[data-schedule-dialog-close-v125]'))closeScheduleV125();const edit=event.target.closest('[data-schedule-list-edit-v125]');if(edit)openScheduleV125(scheduleSelectedV125,edit.dataset.scheduleListEditV125);if(event.target.closest('[data-schedule-delete-v125]'))deleteScheduleV125();});
    $('[data-schedule-form-v125]',overlay).addEventListener('submit',saveScheduleV125);
    $('[name="recordScope"]',overlay).addEventListener('change',syncScheduleScopeV148);
    $('[name="allDay"]',overlay).addEventListener('change',()=>{const form=$('[data-schedule-form-v125]',overlay);for(const name of ['time','endTime'])form.elements[name].disabled=form.elements.allDay.checked;});
    $('[name="date"]',overlay).addEventListener('change',()=>{const form=$('[data-schedule-form-v125]',overlay),row=scheduleRowsV125().find(item=>String(item.id)===form.elements.id.value);$('[data-schedule-title-v125]',overlay).textContent=`${form.elements.date.value} · 일정 ${row?(editableScheduleV179(row)?'수정':'보기'):'추가'}`;});
    return overlay;
  }
  function syncScheduleScopeV148(){const form=$('[data-schedule-form-v125]'),scope=form?.elements.recordScope?.value||'schedule',client=$('[data-schedule-client-v148]',form),work=$('[data-schedule-work-v150]',form),location=$('[data-schedule-location-v150]',form);if(client)client.hidden=scope!=='consulting';if(work)work.hidden=true;if(location)location.hidden=scope!=='schedule';for(const name of ['endDate','endTime','reminderMinutes','shareWithCouple'])if(form?.elements[name])form.elements[name].closest('label').hidden=scope!=='schedule'}
  function openScheduleV125(date,id='') {
    const projected=id?scheduleRowsV125().find(row=>String(row.id)===String(id)&&row.projectionSource):null;
    if(projected){closeScheduleV125();window.AiderBusinessCalendarV175?.open(projected);return}
    const overlay=ensureScheduleDialogV125(),form=$('[data-schedule-form-v125]',overlay),rows=scheduleRowsV125().filter(row=>eventSpansDateV125(row,date)),row=id?scheduleRowsV125().find(item=>String(item.id)===String(id)):null;
    if(form.dataset.savingV179==='1')return;
    form.dataset.openedActorUidV179=String(currentUser()?.uid||'');form.dataset.openedExistingIdV179=String(id||'');
    const editable=editableScheduleV179(row);scheduleSelectedV125=date||row?.date||scheduleSelectedV125;form.reset();form.elements.id.value=row?.id||'';form.elements.recordScope.value='schedule';form.elements.date.value=row?.date||scheduleSelectedV125;form.elements.endDate.value=row?.endDate||'';form.elements.time.value=row?.time||'';form.elements.endTime.value=row?.endTime||'';form.elements.allDay.checked=row?!!row.allDay:!form.elements.time.value;form.elements.reminderMinutes.value=String(row?.reminderMinutes??30);form.elements.title.value=row?.title||'';form.elements.location.value=row?.location||'';form.elements.note.value=row?.note||row?.memo||'';form.elements.shareWithCouple.checked=!!(row?.shareWithCouple||row?.owner==='shared');$('[data-schedule-title-v125]',overlay).textContent=`${form.elements.date.value} · 일정 ${row?(editable?'수정':'보기'):'추가'}`;$('[data-schedule-delete-v125]',overlay).hidden=!row||!editable;$('[data-schedule-error-v179]',overlay).textContent='';
    const dayEntries=window.AiderScheduleTimeV179?.entries(rows)||rows.map(row=>({row}));
    $('[data-schedule-day-list-v125]',overlay).innerHTML=dayEntries.map(({row:item,separatorBefore})=>`${separatorBefore?'<span class="schedule-period-separator-v179" aria-label="오후 일정">-</span>':''}<article class="schedule-item-v125${receivedScheduleV176(item)?' schedule-received-v176':''}"${receivedScheduleV176(item)?` aria-label="상대가 공유한 일정 · ${safe(item.title||'일정')}"`:''}><i style="--event-color:${safe(eventColorV125(item))}"></i><div><b>${safe(item.title||'일정')}</b><span>${safe(window.AiderScheduleTimeV179?.format(item)||'')}${item.sourceTitle?` · ${safe(item.sourceTitle)}`:''}</span></div><button type="button" data-schedule-list-edit-v125="${safe(item.id)}">${item.readOnly||receivedScheduleV176(item)?'보기':'수정'}</button></article>`).join('');
    $$('input,textarea,select',form).forEach(control=>control.disabled=!editable);
    form.elements.recordScope.disabled=Boolean(row);
    for(const name of ['time','endTime'])form.elements[name].disabled=!editable||form.elements.allDay.checked;
    form.elements.shareWithCouple.disabled=!editable||!currentState().pair;
    overlay.querySelector('button[type="submit"]').hidden=!editable;
    window.AiderFriendScheduleUIV175?.open(row?{...row,isAiderDear:editable}:null);
    overlay.classList.add('on');
    window.AiderPrivateCalendarUIV175?.scheduleOpened();
  }
  function editableScheduleV179(row){if(!row)return true;const user=currentUser();return !row.readOnly&&!row.friendShared&&!row.externalSource&&!row.projectionSource&&!row.isHoliday&&!row.isBirthday&&!['work','consulting','consult','estate','business'].includes(row.calendarScope||row.category)&&!receivedScheduleV176(row)&&(!user?.uid||!row.authorUid||row.authorUid===user.uid)&&(!user?.email||!row.authorEmail||String(row.authorEmail).toLowerCase()===String(user.email).toLowerCase());}
  function scheduleDraftIdentityV179(form){const actor=String(currentUser()?.uid||'');if(actor&&form?.dataset.openedActorUidV179===actor)return true;const status=form?.querySelector('[data-schedule-error-v179]');if(status)status.textContent=actor?'로그인 계정이 변경되었습니다. 입력은 유지됩니다. 원래 계정으로 돌아오거나 창을 다시 열어주세요.':'로그인 후 일정을 저장할 수 있습니다. 입력은 유지됩니다.';return false;}
  function closeScheduleV125(){if($('[data-schedule-form-v125]')?.dataset.savingV179==='1')return;$('.schedule-dialog-v125')?.classList.remove('on'); }
  async function persistScheduleV125() {
    try { localStorage.setItem('aiderlog-app-v20',JSON.stringify(A)); } catch (_) {}
    if (typeof saveApp === 'function') await saveApp();
    const api=window.AiderDearFirebase;if(currentUser()&&api?.writeScheduleData)await api.writeScheduleData(baseScheduleRowsV125());
  }
  function syncNativeReminderV136(row){
    const bridge=window.AiderLogNative;if(!row||Number(row.reminderMinutes)<0||typeof bridge?.scheduleEventNotification!=='function')return;
    try{bridge.scheduleEventNotification(JSON.stringify({id:row.id,title:row.title,date:row.date,time:row.allDay?'09:00':row.time||'09:00',reminderMinutes:Number(row.reminderMinutes)||0,location:row.location||''}))}catch(error){console.warn('Native reminder skipped',error)}
  }
  function cancelNativeReminderV136(id){try{window.AiderLogNative?.cancelEventNotification?.(String(id||''))}catch(error){console.warn('Native reminder cancel skipped',error)}}
  async function saveScheduleV125(event) {
    event.preventDefault();const form=event.currentTarget;if(form.dataset.savingV179==='1'||!scheduleDraftIdentityV179(form))return;const data=new FormData(form),id=String(data.get('id')||''),existing=id?scheduleRowsV125().find(row=>String(row.id)===id):null;if((id||form.dataset.openedExistingIdV179)&&!existing){form.querySelector('[data-schedule-error-v179]').textContent='이 일정이 삭제되었거나 더 이상 이 계정에서 볼 수 없습니다. 입력은 유지됩니다. 창을 다시 열어 확인해주세요.';return;}if(!editableScheduleV179(existing))return;const start=String(data.get('date')||scheduleSelectedV125),end=String(data.get('endDate')||start);if(end&&end<start){alert('종료 날짜는 시작 날짜 이후여야 합니다.');return}const stamp=Date.now(),user=currentUser()||{},shared=!!currentState().pair&&!!data.get('shareWithCouple'),scope=String(data.get('recordScope')||'schedule'),title=String(data.get('title')||'').trim().slice(0,100),allDay=!!data.get('allDay'),time=allDay?'':String(data.get('time')||''),endTime=allDay?'':String(data.get('endTime')||time),note=String(data.get('note')||'').trim().slice(0,1200);if(!title)return;if(!allDay&&!time){alert('시작 시간을 입력하거나 종일을 선택해주세요.');return}if(!allDay&&start===end&&endTime<time){alert('종료 시간은 시작 시간 이후여야 합니다.');return}
    if(scope!=='schedule'){alert('업무 일정은 원래 업무 페이지에서 등록하거나 수정해주세요.');return;}
    const row={...existing,id:existing?.id||id||`schedule-${stamp}-${Math.random().toString(36).slice(2,7)}`,isAiderDear:true,date:start,endDate:end,time,endTime,allDay,reminderMinutes:Number(data.get('reminderMinutes')??-1),title,category:existing?.category||'other',location:String(data.get('location')||'').trim().slice(0,180),note,memo:note,owner:shared?'shared':'mine',shareWithCouple:shared,authorEmail:existing?.authorEmail||user.email||'',authorUid:existing?.authorUid||user.uid||'',createdAt:existing?.createdAt||stamp,updatedAt:stamp};const rows=baseScheduleRowsV125(),index=rows.findIndex(item=>String(item.id)===String(row.id));if(index>=0)rows[index]=row;else rows.push(row);form.elements.id.value=row.id;const overlay=form.closest('.schedule-dialog-v125'),submit=overlay.querySelector('button[type="submit"]'),status=form.querySelector('[data-schedule-error-v179]');form.dataset.savingV179='1';submit.disabled=true;status.textContent='';let saved=false;
    try{await persistScheduleV125();if((currentUser()?.uid||'')!==(user.uid||''))throw Error('로그인 계정이 변경되었습니다.');await window.AiderFriendScheduleUIV175?.share(row);if((currentUser()?.uid||'')!==(user.uid||''))throw Error('로그인 계정이 변경되었습니다.');scheduleSelectedV125=row.date;scheduleCursorV125=scheduleViewV176.focus(row.date).anchor;if(row.reminderMinutes>=0)syncNativeReminderV136(row);else cancelNativeReminderV136(row.id);saved=true;}catch(error){status.textContent=error?.message||'일정을 저장하지 못했습니다. 입력은 유지됩니다. 다시 저장해주세요.';}finally{form.dataset.savingV179='';submit.disabled=false;window.AiderPrivateCalendarUIV175?.scheduleOpened();}if(saved){closeScheduleV125();renderScheduleV125();}
  }
  async function deleteScheduleV125(){const form=$('[data-schedule-form-v125]');if(!scheduleDraftIdentityV179(form))return;const id=form?.elements.id.value,row=scheduleRowsV125().find(item=>String(item.id)===String(id));if(!row||!editableScheduleV179(row)||form.dataset.savingV179==='1'||!confirm('이 기록을 삭제할까요?'))return;const before=baseScheduleRowsV125().slice(),actor=currentUser()?.uid||'';form.dataset.savingV179='1';const status=form.querySelector('[data-schedule-error-v179]');status.textContent='';let deleted=false;try{await window.AiderFriendScheduleUIV175?.remove(id);if((currentUser()?.uid||'')!==actor)throw Error('로그인 계정이 변경되었습니다.');A.scheduleEvents=before.filter(item=>String(item.id)!==String(id));await persistScheduleV125();cancelNativeReminderV136(id);deleted=true;}catch(error){if((currentUser()?.uid||'')===actor)A.scheduleEvents=before;status.textContent=error?.message||'삭제하지 못했습니다. 다시 시도해주세요.';}finally{form.dataset.savingV179='';}if(deleted){closeScheduleV125();renderScheduleV125();}}

  function openDdayV125(){return window.AiderAppDdayV175?.open();}
  function jumpToScheduleV180(id){
    const row=scheduleRowsV125().find(item=>String(item.id)===String(id)),date=String(row?.date||'').slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;
    scheduleSelectedV125=date;scheduleCursorV125=scheduleViewV176.focus(date).anchor;renderScheduleV125();
    requestAnimationFrame(()=>{const cell=home.querySelector(`[data-schedule-date-v125="${date}"]`);cell?.focus({preventScroll:true});cell?.scrollIntoView({block:'nearest',inline:'nearest'});});
  }
  function bindScheduleV125(){home.querySelectorAll('[data-calendar-shift-v125]').forEach(button=>button.onclick=()=>{scheduleCursorV125=scheduleViewV176.move(button.dataset.calendarShiftV125).anchor;renderScheduleV125()});$('[data-calendar-today-v125]',home).onclick=()=>{const now=new Date();scheduleCursorV125=scheduleViewV176.today().anchor;scheduleSelectedV125=dateKey(now);renderScheduleV125()};home.querySelectorAll('[data-schedule-jump-v180]').forEach(button=>button.onclick=()=>jumpToScheduleV180(button.dataset.scheduleJumpV180));home.querySelectorAll('[data-schedule-edit-v125]').forEach(button=>button.onclick=()=>{const row=scheduleRowsV125().find(item=>String(item.id)===String(button.dataset.scheduleEditV125));openScheduleV125(row?.date||scheduleSelectedV125,row?.id||'')});home.querySelectorAll('[data-dday-open-v125]').forEach(button=>button.onclick=openDdayV125)}



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
    // Shared snapshot extracted from the original renderer; calculation boundaries stay unchanged.
    const snapshot = function(){
      const routines=Array.isArray(P.routines)?P.routines:[],stats=routineOverall(),days=Array.from({length:14},(_,index)=>routineOffsetDate(index-13)),levelCounts={MINI:0,MORE:0,MAX:0,SKIP:0},weekday=Array(7).fill(0),daily=days.map(date=>({date,value:0}));
      routines.forEach(r=>Object.entries(r.dailyLevels||{}).forEach(([date,raw])=>{const level=String(raw||'').toUpperCase();if(level in levelCounts)levelCounts[level]++;if(level&&level!=='SKIP'){const day=new Date(`${date}T12:00:00`).getDay();weekday[day]++;const point=daily.find(item=>item.date===date);if(point)point.value++}}));
      const totalLevels=Object.values(levelCounts).reduce((sum,value)=>sum+value,0)||1,bestDay=weekday.indexOf(Math.max(...weekday)),weekNames=['일','월','화','수','목','금','토'],maxDaily=Math.max(1,...daily.map(item=>item.value));
      return{routines,stats,days,levelCounts,weekday,daily,totalLevels,bestDay,weekNames,maxDaily};
    };
    window.AiderLogRoutineStatisticsV125={snapshot};
    const next = function(){
      if(!routineOverallOpen)return'';
      const {routines,stats,daily,levelCounts,weekday,totalLevels,bestDay,weekNames,maxDaily}=snapshot();
      const rows=routines.map(r=>{const metric=routineMetrics(r);return `<article class="routine-stat-row-v127" style="--routine-color:${routineColor(r)}"><i></i><div><b>${safe(r.text||r.title||'Routine')}</b><span>${metric.cycle.day}/${metric.cycle.goal}일 · ${metric.practice}회 실천</span></div><strong>${metric.completion}%</strong></article>`}).join('')||'<p class="routine-stat-empty-v127">루틴을 추가하면 비교 분석이 시작됩니다.</p>';
      const levelBars=['MINI','MORE','MAX','SKIP'].map(level=>`<div><span>${level}</span><i><em style="width:${Math.round(levelCounts[level]/totalLevels*100)}%"></em></i><b>${levelCounts[level]}</b></div>`).join('');
      const dayBars=daily.map(item=>`<div title="${item.date}"><i style="height:${Math.max(7,Math.round(item.value/maxDaily*100))}%"></i><span>${item.date.slice(8)}</span></div>`).join('');
      return `<div class="routine-stats-dialog-v125 on" data-routine-stats-overlay-v125><section class="routine-stats-sheet-v127" role="dialog" aria-modal="true"><header class="feature-dialog-head-v125"><div><small>ROUTINE STATISTICS</small><h2>전체 통계</h2><p>저장된 루틴 기록을 최근 흐름과 단계별로 분석했어요.</p></div><button type="button" data-routine-stats-close-v125>${icon('close')}</button></header><section class="routine-overall-v110"><article><span>최근 30일 실천</span><b>${stats.practice}</b></article><article><span>전체 완료율</span><b>${stats.rate}%</b></article><article><span>최장 연속</span><b>${stats.streak}일</b></article><article><span>활성 루틴</span><b>${stats.count}</b></article></section><div class="routine-analysis-grid-v127"><section><header><b>최근 14일 흐름</b><span>하루 완료 루틴 수</span></header><div class="routine-day-bars-v127">${dayBars}</div><p>가장 자주 실천한 요일은 <b>${weekNames[bestDay]}요일</b>이에요.</p></section><section><header><b>단계 분포</b><span>전체 기록</span></header><div class="routine-level-bars-v127">${levelBars}</div></section><section class="routine-stat-routines-v127"><header><b>루틴별 진도</b><span>현재 회차 기준</span></header>${rows}</section></div></section></div>`
    };next.__v125=true;routineOverallHTML=next;
    const root=$('#routine');if(root&&!root.dataset.statsV125){root.dataset.statsV125='1';root.addEventListener('click',event=>{if(event.target.closest('[data-routine-stats-close-v125]')||event.target.matches('[data-routine-stats-overlay-v125]')){event.preventDefault();event.stopImmediatePropagation();routineOverallOpen=false;renderRoutine()}},true)}
  }

  window.AiderLogThemeV125=Object.freeze({themes:Object.keys(THEMES),palettes:THEMES,resolvePalette:paletteId,apply:applyTheme,refreshSystemScheme,applyFontSize,openSettings});
  window.AiderLogCalendarV125=Object.freeze({parseIcs,openSettings:()=>openSettings('calendar'),openSchedule:openScheduleV125});


  renderHome = renderScheduleV125;
  // Day cells may be rebuilt after binding; capture before legacy page handlers.
  // Restrict to the live calendar so inert tutorial clones never open a form.
  window.addEventListener('click', event => {
    const button = event.target.closest?.('#home [data-schedule-date-v125]');
    if (!button || button.closest('[inert]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openScheduleV125(button.dataset.scheduleDateV125);
  }, true);
  installRoutineStatsModal();

  const systemSchemeV164=window.matchMedia?.('(prefers-color-scheme: dark)');
  const refreshSystemSchemeV164=()=>{refreshSystemScheme();if(paletteId(currentTheme())==='system')applyTheme(currentTheme(),false)};
  if(systemSchemeV164?.addEventListener)systemSchemeV164.addEventListener('change',refreshSystemSchemeV164);
  else systemSchemeV164?.addListener?.(refreshSystemSchemeV164);
  document.addEventListener('click',event=>{const close=event.target.closest('#introClose');if(close)$('#intro')?.classList.remove('on')});

  let queuePending=false;
  function refreshV125(){queuePending=false;bindProfileSettings();applyFixedWheelV125();installRoutineStatsModal()}
  new MutationObserver(()=>{if(queuePending)return;queuePending=true;requestAnimationFrame(refreshV125)}).observe(document.documentElement,{childList:true,subtree:true});

  const previousSync = typeof sync === 'function' ? sync : null;
  if (previousSync) sync = async function(){const result=await previousSync.apply(this,arguments);const cloudTheme=typeof P!=='undefined'?P?.settings?.theme:'',cloudFont=typeof P!=='undefined'?P?.settings?.fontSize:'';if(PREVIEW_THEME_V126)await applyTheme(PREVIEW_THEME_V126,false);else if(cloudTheme)await applyTheme(cloudTheme,false);if(cloudFont)await applyFontSize(cloudFont,false);return result};
  window.addEventListener('aiderdear-firebase-state',event=>{bindProfileSettings();const user=event.detail?.user;if(PREVIEW_THEME_V126)applyTheme(PREVIEW_THEME_V126,false);else if(user&&typeof P!=='undefined'&&P?.settings?.theme)applyTheme(P.settings.theme,false);if(user&&typeof P!=='undefined'&&P?.settings?.fontSize)applyFontSize(P.settings.fontSize,false)});
  window.addEventListener('aiderdear-firebase-ready',bindProfileSettings,{once:true});

  const featurePreviewV125=new URLSearchParams(location.search),previewThemeV125=PREVIEW_THEME_V126;
  let savedThemeV164='';try{savedThemeV164=localStorage.getItem(THEME_KEY)||''}catch(_){}
  applyTheme(previewThemeV125||(typeof P!=='undefined'&&P?.settings?.theme)||savedThemeV164||currentTheme(),false);
  // The final semantic stylesheet is parsed later in the bundled document.
  // Refresh dependent native meta/shadow colours once all initial CSS is ready.
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>applyTheme(currentTheme(),false),{once:true});
  let savedFontV176='';try{savedFontV176=localStorage.getItem('aiderlogFontSize')||''}catch(_){}
  applyFontSize(PREVIEW_FONT_V134||(typeof P!=='undefined'&&P?.settings?.fontSize)||savedFontV176||'normal',false);
  bindProfileSettings();
  applyFixedWheelV125();
  renderScheduleV125();
  refreshV125();
  if(featurePreviewV125.get('settings')==='1')setTimeout(()=>openSettings(),80);
})();
