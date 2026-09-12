(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const wheelEarly=$('#wheel');
  /* v142 installed a competing capture handler. Claim the control before
     DOMContentLoaded so there is one deterministic wheel input path. */
  if(wheelEarly){
    /* Claim the legacy v142 controller immediately, but leave the v143
       installation flag untouched so installWheel() can bind this handler. */
    wheelEarly.dataset.controlV142='1';
  }

  const PALETTES={
    system:['#6255E8','#7B6CF2','#A89BFA','#DED9FF','#F7F6FF','#171A3A'],
    sun:['#D86428','#F28B3C','#FFC56B','#FFE8BD','#FFF9F1','#522615'],
    mercury:['#626873','#858C97','#B7BDC6','#E3E6EA','#F7F8F9','#272C34'],
    venus:['#A97846','#C59B68','#E2C393','#F3E6CF','#FCF9F3','#4A3727'],
    earth:['#2D748E','#4E9A82','#80B48C','#DCEEE8','#F4FAF9','#163A4A'],
    mars:['#A84C3B','#C76A52','#E39A7E','#F3DED4','#FCF6F3','#4B261F'],
    jupiter:['#9B704E','#C19A6B','#DEC090','#F2E6D2','#FBF8F3','#4D392A'],
    saturn:['#8E7A4A','#B8A06A','#D9C58B','#F2EBD6','#FAF8F0','#403A2A'],
    uranus:['#4D8790','#74ABB2','#A6CFD2','#DDF0F1','#F4FAFA','#25434A'],
    neptune:['#3F5FA7','#5F7FC4','#91A7DE','#DDE4F5','#F5F7FC','#202E5A'],
    pluto:['#554C43','#7A7064','#AAA092','#E7E2DA','#F8F7F4','#2D2925']
  };
  const THEME_LABELS={system:'시스템 · Cosmic Violet',sun:'태양 · Solar Flare',mercury:'수성 · Mercury Alloy',venus:'금성 · Venus Veil',earth:'지구 · Living Orbit',mars:'화성 · Mars Ember',jupiter:'목성 · Jovian Cloud',saturn:'토성 · Saturn Halo',uranus:'천왕성 · Uranus Mist',neptune:'해왕성 · Neptune Deep',pluto:'명왕성 · Pluto Shadow'};
  let wheelState=null,wheelHoldTimer=null,ignoreClickUntil=0,refreshQueued=false;
  const KOREA_HOLIDAY_SPECIAL={
    2024:[['02-09','설날 연휴'],['02-10','설날'],['02-11','설날 연휴'],['02-12','설날 대체공휴일'],['04-10','국회의원 선거일'],['05-06','어린이날 대체공휴일'],['05-15','부처님오신날'],['09-16','추석 연휴'],['09-17','추석'],['09-18','추석 연휴'],['10-01','국군의날 임시공휴일']],
    2025:[['01-27','임시공휴일'],['01-28','설날 연휴'],['01-29','설날'],['01-30','설날 연휴'],['05-05','부처님오신날'],['05-06','대체공휴일'],['06-03','대통령 선거일'],['10-05','추석 연휴'],['10-06','추석'],['10-07','추석 연휴'],['10-08','추석 대체공휴일']],
    2026:[['02-16','설날 연휴'],['02-17','설날'],['02-18','설날 연휴'],['03-02','삼일절 대체공휴일'],['05-24','부처님오신날'],['05-25','부처님오신날 대체공휴일'],['06-03','전국동시지방선거일'],['08-17','광복절 대체공휴일'],['09-24','추석 연휴'],['09-25','추석'],['09-26','추석 연휴'],['10-05','개천절 대체공휴일']],
    2027:[['02-06','설날 연휴'],['02-07','설날'],['02-08','설날 연휴'],['02-09','설날 대체공휴일'],['05-13','부처님오신날'],['08-16','광복절 대체공휴일'],['09-14','추석 연휴'],['09-15','추석'],['09-16','추석 연휴'],['10-04','개천절 대체공휴일'],['10-11','한글날 대체공휴일'],['12-27','성탄절 대체공휴일']],
    2028:[['01-26','설날 연휴'],['01-27','설날'],['01-28','설날 연휴'],['05-02','부처님오신날'],['10-02','추석 연휴'],['10-03','추석'],['10-04','추석 연휴'],['10-05','대체공휴일']],
    2029:[['02-12','설날 연휴'],['02-13','설날'],['02-14','설날 연휴'],['05-07','어린이날 대체공휴일'],['05-20','부처님오신날'],['05-21','부처님오신날 대체공휴일'],['09-21','추석 연휴'],['09-22','추석'],['09-23','추석 연휴'],['09-24','추석 대체공휴일']],
    2030:[['02-02','설날 연휴'],['02-03','설날'],['02-04','설날 연휴'],['02-05','설날 대체공휴일'],['05-06','어린이날 대체공휴일'],['05-09','부처님오신날'],['09-11','추석 연휴'],['09-12','추석'],['09-13','추석 연휴']],
    2031:[['01-22','설날 연휴'],['01-23','설날'],['01-24','설날 연휴'],['03-03','삼일절 대체공휴일'],['05-28','부처님오신날'],['09-30','추석 연휴'],['10-01','추석'],['10-02','추석 연휴']],
    2032:[['02-10','설날 연휴'],['02-11','설날'],['02-12','설날 연휴'],['05-16','부처님오신날'],['05-17','부처님오신날 대체공휴일'],['08-16','광복절 대체공휴일'],['09-18','추석 연휴'],['09-19','추석'],['09-20','추석 연휴'],['09-21','추석 대체공휴일'],['10-04','개천절 대체공휴일'],['10-11','한글날 대체공휴일'],['12-27','성탄절 대체공휴일']]
  };

  function backgroundMode(){try{return localStorage.getItem('aiderlog-background-mode-v143')||'cosmic'}catch{return'cosmic'}}
  function applyBackground(mode,persist=true){
    mode=mode==='light'?'light':'cosmic';document.documentElement.dataset.backgroundMode=mode;
    if(persist)try{localStorage.setItem('aiderlog-background-mode-v143',mode)}catch{}
    $$('.profile-background-v143 button').forEach(button=>{const active=button.dataset.backgroundV143===mode;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});
  }
  function decorateThemes(){
    $$('.profile-theme-v137').forEach(button=>{
      const id=button.dataset.profileThemeV137,palette=PALETTES[id];if(!palette)return;
      button.style.setProperty('--planet-primary',palette[0]);button.style.setProperty('--planet-soft',palette[3]);
      const label=$('b',button);if(label)label.textContent=THEME_LABELS[id]||label.textContent;
    });
    const grid=$('.profile-theme-grid-v137');if(!grid)return;
    const section=grid.closest('.profile-section-v137');if(!section||$('.profile-background-v143',section))return;
    const chooser=document.createElement('div');chooser.className='profile-background-v143';chooser.setAttribute('aria-label','앱 배경 밝기');
    chooser.innerHTML='<button type="button" data-background-v143="light">밝은 배경</button><button type="button" data-background-v143="cosmic">우주 배경</button>';
    section.append(chooser);applyBackground(backgroundMode(),false);
  }

  function setWheelOpen(open){
    const wheel=$('#wheel'),core=$('#wheelCore');if(!wheel||!core)return;
    wheel.classList.toggle('open',Boolean(open));core.setAttribute('aria-expanded',String(Boolean(open)));core.setAttribute('aria-label','홈으로 이동 · 길게 눌러 휠 메뉴 열기');
    if(!open)clearWheel();
  }
  function clearWheel(){
    $$('.global-wheel-item-v126').forEach(item=>{item.classList.remove('hovered');delete item.dataset.wheelSelectedV143});
    if(wheelState)wheelState.selected=null;
  }
  function selectNearest(x,y){
    let nearest=null,best=68;
    $$('.global-wheel-item-v126').forEach(item=>{const rect=item.getBoundingClientRect();if(!rect.width)return;const distance=Math.hypot(x-rect.left-rect.width/2,y-rect.top-rect.height/2);if(distance<best){nearest=item;best=distance}});
    $$('.global-wheel-item-v126').forEach(item=>{const active=item===nearest;item.classList.toggle('hovered',active);if(active)item.dataset.wheelSelectedV143='true';else delete item.dataset.wheelSelectedV143});
    if(wheelState)wheelState.selected=nearest;return nearest;
  }
  function navigate(page){
    if(!document.getElementById(page))page='home';setWheelOpen(false);
    try{if(typeof window.go==='function'){window.go(page,false);return}}catch(error){console.warn('[v143 navigation fallback]',error)}
    $$('.view').forEach(view=>view.classList.toggle('on',view.id===page));
    const app=$('#app');app?.classList.toggle('home-mode',page==='home');app?.classList.toggle('insights-mode',page==='insights');
    history.replaceState(null,'',`${location.pathname}${location.search}#${page}`);
    try{window.render?.()}catch{}
  }
  function installWheel(){
    const wheel=$('#wheel'),core=$('#wheelCore');if(!wheel||!core||wheel.dataset.controlV143==='1')return;
    wheel.dataset.controlV143='1';wheel.dataset.controlV142='1';
    const consume=event=>{event.preventDefault();event.stopPropagation();event.stopImmediatePropagation()};
    document.addEventListener('pointerdown',event=>{
      const item=event.target.closest?.('.global-wheel-item-v126'),pressedCore=event.target.closest?.('#wheelCore');if(!item&&!pressedCore)return;
      consume(event);const wasOpen=wheel.classList.contains('open');
      wheelState={id:event.pointerId,wasOpen,core:Boolean(pressedCore),long:Boolean(item),startX:event.clientX,startY:event.clientY,selected:item||null};
      if(item){setWheelOpen(true);item.classList.add('hovered');item.dataset.wheelSelectedV143='true'}else{
        clearWheel();core.classList.add('pressing');clearTimeout(wheelHoldTimer);wheelHoldTimer=setTimeout(()=>{if(!wheelState||wheelState.id!==event.pointerId)return;wheelState.long=true;setWheelOpen(true);navigator.vibrate?.(7)},420);
      }
      try{core.setPointerCapture?.(event.pointerId)}catch{}
    },true);
    document.addEventListener('pointermove',event=>{if(!wheelState||wheelState.id!==event.pointerId)return;consume(event);const distance=Math.hypot(event.clientX-wheelState.startX,event.clientY-wheelState.startY);if(distance>18&&!wheelState.long){clearTimeout(wheelHoldTimer);wheelState.long=true;setWheelOpen(true)}if(wheelState.long)selectNearest(event.clientX,event.clientY)},true);
    const finish=event=>{
      if(!wheelState||wheelState.id!==event.pointerId)return;consume(event);
      clearTimeout(wheelHoldTimer);wheelHoldTimer=null;core.classList.remove('pressing');
      const state=wheelState,distance=Math.hypot(event.clientX-state.startX,event.clientY-state.startY);let selected=state.selected;
      if(state.long&&distance>12)selected=selectNearest(event.clientX,event.clientY);wheelState=null;ignoreClickUntil=Date.now()+360;
      try{core.releasePointerCapture?.(event.pointerId)}catch{}
      if(selected&&(!state.core||state.long)){navigate(selected.dataset.page);navigator.vibrate?.(7);return}
      clearWheel();setWheelOpen(false);if(state.core&&!state.long)navigate('home');
    };
    document.addEventListener('pointerup',finish,true);
    document.addEventListener('pointercancel',event=>{if(!wheelState||wheelState.id!==event.pointerId)return;consume(event);clearTimeout(wheelHoldTimer);wheelHoldTimer=null;core.classList.remove('pressing');wheelState=null;clearWheel();setWheelOpen(false)},true);
    document.addEventListener('click',event=>{
      const item=event.target.closest?.('.global-wheel-item-v126'),pressedCore=event.target.closest?.('#wheelCore');if(!item&&!pressedCore)return;
      consume(event);if(Date.now()<ignoreClickUntil)return;if(item)navigate(item.dataset.page);else navigate('home');
    },true);
    document.addEventListener('click',event=>{if(wheel.classList.contains('open')&&!event.target.closest?.('#wheel'))setWheelOpen(false)});
    core.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();navigate('home')}else if(event.key==='ArrowUp'){event.preventDefault();setWheelOpen(true)}else if(event.key==='Escape'){setWheelOpen(false)}});
  }

  function holidayTitle(key){
    if(!/^\d{4}-\d{2}-\d{2}$/.test(key||''))return'';const year=Number(key.slice(0,4)),md=key.slice(5),fixed={
      '01-01':'신정','03-01':'삼일절','05-05':'어린이날','06-06':'현충일','08-15':'광복절','10-03':'개천절','10-09':'한글날','12-25':'성탄절'
    };const titles=[];if(fixed[md])titles.push(fixed[md]);(KOREA_HOLIDAY_SPECIAL[year]||[]).forEach(([date,title])=>{if(date===md)titles.push(title)});return[...new Set(titles)].join(' · ');
  }
  window.AiderLogHolidayTitleV164=holidayTitle;
  function holidayCompactTitle(title){return String(title||'').replace('전국동시지방선거일','지방선거일').replace('국회의원 선거일','국회의원선거').replace(' 대체공휴일',' 대체').replace(' 연휴','연휴')}
  function decorateKoreanHolidays(){
    $$('[data-schedule-date-v125]').forEach(day=>{const key=day.dataset.scheduleDateV125,title=holidayTitle(key);day.classList.toggle('holiday-v144',Boolean(title));let label=$('.schedule-holiday-v144',day);if(!title){label?.remove();return}if(!label){label=document.createElement('small');label.className='schedule-holiday-v144';$('.schedule-day-number-v119',day)?.after(label)}label.textContent=holidayCompactTitle(title);label.classList.toggle('compact-long',label.textContent.replace(/\s/g,'').length>7);label.title=title;day.setAttribute('aria-label',`${key} ${title} 일정 관리`)})
  }

  function insightRows(){try{return window.AiderLogInsightsV126?.rows?.()||[]}catch{return[]}}
  function renderInsightsV143(){
    const host=$('#insights'),api=window.AiderLogInsightRangeV175;if(!host||!api)return;
    host.dataset.v143Rendered='1';
    host.innerHTML=api.mobileMarkup(insightRows());
  }
  window.addEventListener('aiderlog-insight-range-change',renderInsightsV143);
  function installInsightRenderer(){
    try{if(typeof renderInsights==='function')renderInsights=renderInsightsV143;window.renderInsights=renderInsightsV143}catch{}
    const root=$('#insights');
    if((location.hash==='#insights'||root?.classList.contains('on'))&&root&&root.dataset.v143Rendered!=='1')renderInsightsV143();
  }

  function decorateEventEditor(){
    $$('.event-editor-sheet-v111').forEach(sheet=>{
      let head=$('.event-editor-head-v111',sheet);
      if(!head){head=document.createElement('header');head.className='event-editor-head-v111';head.innerHTML='<div><small>RECORD</small><h2>기록 추가</h2></div><button type="button" data-event-editor-close aria-label="기록창 닫기">×</button>';sheet.prepend(head)}
      if(head.dataset.v143==='1')return;head.dataset.v143='1';
      const small=$('small',head),title=$('h2',head);if(small)small.textContent=String(small.textContent||'RECORD').split('·')[0].trim();
      if(title&&!/수정/.test(title.textContent))title.textContent='기록 추가';
      $$('.event-head-subtitle-v143',head).forEach(node=>node.remove());
    });
  }
  function decoratePostcard(){
    $$('.insight-letter-mascot-v133,#introMascotV133,#introMascot').forEach(node=>node.remove());
    const view=$('#introView');if(view&&!view.dataset.directV143){view.dataset.directV143='1';view.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();$('#intro')?.classList.remove('on','closing-v136','letter-exit-v135');navigate('insights')},true)}
  }


  function captureActions(event){
    const background=event.target.closest?.('[data-background-v143]');if(background){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();applyBackground(background.dataset.backgroundV143);return}
  }
  function refresh(){refreshQueued=false;installWheel();decorateThemes();decorateEventEditor();decoratePostcard();decorateKoreanHolidays();installInsightRenderer()}
  function queueRefresh(){if(refreshQueued)return;refreshQueued=true;requestAnimationFrame(refresh)}

  applyBackground(backgroundMode(),false);
  document.addEventListener('click',captureActions,true);
  window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(page&&document.getElementById(page))navigate(page)});
  new MutationObserver(records=>{if(records.some(record=>record.addedNodes.length||record.type==='attributes'))queueRefresh()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-theme','class']});
  window.AiderLogV143={navigate,setWheelOpen,renderInsights:renderInsightsV143,applyBackground,palettes:PALETTES};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refresh,{once:true});else refresh();
})();
