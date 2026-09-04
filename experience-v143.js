(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const wheelEarly=$('#wheel');
  /* v142 installed a competing capture handler. Claim the control before
     DOMContentLoaded so there is one deterministic wheel input path. */
  if(wheelEarly){wheelEarly.dataset.controlV142='1';wheelEarly.dataset.controlV143='1'}
  try{localStorage.setItem('aiderlog-tutorial-dismissed-v136','1')}catch{}

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
  const TUTORIAL_KEY='aiderlog-tutorial-dismissed-v143';
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
    chooser.innerHTML='<button type="button" data-background-v143="light"><span><b>밝은 배경</b><small>테마의 Background 색상</small></span></button><button type="button" data-background-v143="cosmic"><span><b>우주 배경</b><small>기존 은하 배경</small></span></button>';
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
        clearWheel();core.classList.add('pressing');clearTimeout(wheelHoldTimer);wheelHoldTimer=setTimeout(()=>{if(!wheelState||wheelState.id!==event.pointerId)return;wheelState.long=true;setWheelOpen(true);navigator.vibrate?.(7)},145);
      }
      try{core.setPointerCapture?.(event.pointerId)}catch{}
    },true);
    document.addEventListener('pointermove',event=>{if(!wheelState||wheelState.id!==event.pointerId)return;consume(event);const distance=Math.hypot(event.clientX-wheelState.startX,event.clientY-wheelState.startY);if(distance>7&&!wheelState.long){clearTimeout(wheelHoldTimer);wheelState.long=true;setWheelOpen(true)}if(wheelState.long)selectNearest(event.clientX,event.clientY)},true);
    const finish=event=>{
      if(!wheelState||wheelState.id!==event.pointerId)return;consume(event);
      clearTimeout(wheelHoldTimer);wheelHoldTimer=null;core.classList.remove('pressing');
      const state=wheelState,distance=Math.hypot(event.clientX-state.startX,event.clientY-state.startY);let selected=state.selected;
      if(state.long&&distance>6)selected=selectNearest(event.clientX,event.clientY);wheelState=null;ignoreClickUntil=Date.now()+360;
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
  function decorateKoreanHolidays(){
    $$('[data-schedule-date-v125]').forEach(day=>{const key=day.dataset.scheduleDateV125,title=holidayTitle(key);day.classList.toggle('holiday-v144',Boolean(title));let label=$('.schedule-holiday-v144',day);if(!title){label?.remove();return}if(!label){label=document.createElement('small');label.className='schedule-holiday-v144';$('.schedule-day-number-v119',day)?.after(label)}label.textContent=title;day.setAttribute('aria-label',`${key} ${title} 일정 관리`)})
  }

  function insightRows(){try{return window.AiderLogInsightsV126?.rows?.()||[]}catch{return[]}}
  function rowDate(row){return String(row?.date||row?.createdDate||row?.day||'').slice(0,10)}
  function listValues(row,keys){for(const key of keys){const value=row?.[key];if(Array.isArray(value)&&value.length)return value.map(String);if(typeof value==='string'&&value.trim())return value.split(/[,·/]/).map(x=>x.trim()).filter(Boolean)}return[]}
  function moods(row){return listValues(row,['emotions','emotion','moods','mood'])}
  function count(rows,getter){const map=new Map();rows.forEach(row=>getter(row).forEach(value=>map.set(value,(map.get(value)||0)+1)));return [...map.entries()].sort((a,b)=>b[1]-a[1])}
  function recentDayRows(rows){
    return [2,1,0].map(offset=>{const date=new Date();date.setDate(date.getDate()-offset);const key=date.toISOString().slice(0,10),day=rows.filter(row=>rowDate(row)===key),rank=count(day,moods);return{label:['일','월','화','수','목','금','토'][date.getDay()],key,top:rank[0]?.[0]||'기록 없음',count:day.length}});
  }
  function renderInsightsV143(){
    const root=$('#insights');if(!root)return;
    root.dataset.v143Rendered='1';
    const all=insightRows(),cutoff=new Date();cutoff.setHours(0,0,0,0);cutoff.setDate(cutoff.getDate()-29);
    const recent=all.filter(row=>{const value=new Date(`${rowDate(row)}T00:00:00`);return !Number.isNaN(value.valueOf())&&value>=cutoff});
    const basis=recent.length?recent:all,moodRank=count(basis,moods),top=moodRank[0]?.[0]||'편안함',total=Math.max(1,moodRank.reduce((sum,row)=>sum+row[1],0));
    const top3=(moodRank.length?moodRank:[['편안함',0],['행복',0],['피곤함',0]]).slice(0,3);while(top3.length<3)top3.push([['편안함','행복','피곤함'][top3.length],0]);
    const activityRank=count(basis,row=>listValues(row,['currentActivities','activity','action'])),placeRank=count(basis,row=>listValues(row,['location','place'])),peopleRank=count(basis,row=>listValues(row,['people','companion']));
    const intensity=basis.map(row=>Number(row.intensity||row.strength||row.score)).filter(Number.isFinite),avg=intensity.length?(intensity.reduce((a,b)=>a+b,0)/intensity.length).toFixed(1):'—';
    const mainActivity=activityRank[0]?.[0]||'저녁 산책',mainPlace=placeRank[0]?.[0]||'집',mainPeople=peopleRank[0]?.[0]||'혼자';
    const todayKey=new Date().toISOString().slice(0,10),today=basis.filter(row=>rowDate(row)===todayKey),todayTop=count(today,moods)[0]?.[0]||top;
    const recent3=recentDayRows(all);
    const barColors=['var(--theme-primary)','#4f7ef3','#f07872'];
    root.innerHTML=`<div class="insights-v143">
      <header class="insights-head-v143"><div><small>INSIGHTS</small><h1>마음 인사이트</h1></div><select class="insights-range-v143" aria-label="인사이트 기간"><option>최근 30일</option></select></header>
      <div class="insights-stack-v143">
        <article class="ins-card-v143"><header class="ins-card-head-v143"><span>1</span><h2>오늘 요약</h2></header><div class="ins-summary-v143"><div class="ins-summary-lines-v143"><p><b>TODAY · ONE LINE</b><span>${safe(today.length?`${todayTop}이 오늘의 중심을 잡아줬어요.`:'오늘의 마음을 한 줄로 기록해보세요.')}</span></p><p><b>TOP EMOTION</b><span>${safe(todayTop)} ${today.length?Math.round((count(today,moods)[0]?.[1]||1)/Math.max(1,count(today,moods).reduce((s,x)=>s+x[1],0))*100):0}%</span></p><p><b>ACTIVITY</b><span>${safe(mainActivity)} · 20분 추천</span></p></div><div class="ins-orb-v143" aria-hidden="true"></div></div></article>
        <article class="ins-card-v143"><header class="ins-card-head-v143"><span>2</span><h2>감정 균형</h2></header><div class="ins-balance-v143"><div class="ins-score-v143"><span><span><strong>${avg}</strong><small>/ 5 · ${basis.length}회 기록</small></span></span></div><i class="ins-divider-v143"></i><div class="ins-bars-v143"><h3>자주 느낀 감정 TOP 3</h3>${top3.map(([label,value],index)=>`<div class="ins-bar-v143" style="--value:${Math.round(value/total*100)}%;--bar:${barColors[index]}"><span>${safe(label)}</span><i></i><b>${Math.round(value/total*100)}%</b></div>`).join('')}</div></div></article>
        <article class="ins-card-v143"><header class="ins-card-head-v143"><span>3</span><h2>기록 환경 분석</h2></header><div class="ins-context-v143"><p><b>◷ 시간대</b><span>${safe(basis[0]?.time?`${basis[0].time} 전후`:'저녁 8–10시')}</span></p><p><b>⌂ 장소 · 함께한 사람</b><span>${safe(mainPlace)} · ${safe(mainPeople)}</span></p><p><b>↗ 상황</b><span>${safe(activityRank[0]?.[0]||'휴식 후 안정')}</span></p></div></article>
        <article class="ins-card-v143"><header class="ins-card-head-v143"><span>4</span><h2>감정 흐름 분석</h2></header><div class="ins-chart-legend-v143"><span><i style="background:var(--theme-primary)"></i>${safe(top3[0][0])}</span><span><i style="background:#4f7ef3"></i>${safe(top3[1][0])}</span><span><i style="background:#f07872"></i>${safe(top3[2][0])}</span></div><svg class="ins-chart-v143" viewBox="0 0 700 190" preserveAspectRatio="none" aria-label="최근 30일 감정 흐름"><path class="grid" d="M10 30H690M10 90H690M10 150H690"/><path class="line" style="stroke:var(--theme-primary)" d="M10 145 C70 36 115 82 170 67 S275 116 335 47 S438 104 497 67 S600 101 690 76"/><path class="line" style="stroke:#4f7ef3" d="M10 155 C70 125 105 151 155 119 S251 158 310 128 S405 159 470 117 S590 153 690 130"/><path class="line" style="stroke:#f07872" d="M10 169 C77 165 95 124 150 154 S245 126 300 164 S388 119 455 157 S560 130 690 159"/></svg></article>
        <article class="ins-card-v143"><header class="ins-card-head-v143"><span>5</span><h2>활동 전후 분석</h2></header><div class="ins-activity-v143"><article><b>감정과 함께한 활동</b><span>${safe(activityRank.slice(0,3).map(x=>x[0]).join(' · ')||'산책 · 휴식 · 독서')}</span></article><article><b>기록 후 한 활동</b><span>${safe(listValues(basis[0]||{},['afterActivities']).join(' · ')||'휴식 · 물 마시기')}</span></article><article><b>눈에 띄는 변화</b><span>${safe(mainActivity)} 후 긴장이 낮아지는 흐름</span></article></div></article>
        <article class="ins-card-v143"><header class="ins-card-head-v143"><span>6</span><h2>최근 3일</h2></header><div class="ins-recent-v143">${recent3.map(day=>`<article><b>${safe(day.label)} · ${safe(day.key.slice(5).replace('-','.'))}</b><span>${day.count?`${day.count}개의 마음 기록`:'기록 없음'}</span><strong>${safe(day.top)}</strong></article>`).join('')}</div></article>
      </div></div>`;
  }
  function installInsightRenderer(){
    try{if(typeof renderInsights==='function')renderInsights=renderInsightsV143;window.renderInsights=renderInsightsV143}catch{}
    const root=$('#insights');
    if((location.hash==='#insights'||root?.classList.contains('on'))&&root&&root.dataset.v143Rendered!=='1')renderInsightsV143();
  }

  function decorateEventEditor(){
    $$('.event-editor-sheet-v111').forEach(sheet=>{
      let head=$('.event-editor-head-v111',sheet);
      if(!head){head=document.createElement('header');head.className='event-editor-head-v111';head.innerHTML='<div><small>RECORD</small><h2>기록 추가</h2><p class="event-head-subtitle-v143">오늘의 장면을 하나의 작은 별처럼 남겨보세요.</p></div><button type="button" data-event-editor-close aria-label="기록창 닫기">×</button>';sheet.prepend(head)}
      if(head.dataset.v143==='1')return;head.dataset.v143='1';
      const small=$('small',head),title=$('h2',head);if(small)small.textContent=String(small.textContent||'RECORD').split('·')[0].trim();
      if(title&&!/수정/.test(title.textContent))title.textContent='기록 추가';
      if(!$('.event-head-subtitle-v143',head)){const copy=document.createElement('p');copy.className='event-head-subtitle-v143';copy.textContent='오늘의 장면을 하나의 작은 별처럼 남겨보세요.';head.firstElementChild?.append(copy)}
    });
  }
  function decoratePostcard(){
    $$('.insight-letter-mascot-v133,#introMascotV133,#introMascot').forEach(node=>node.remove());
    const view=$('#introView');if(view&&!view.dataset.directV143){view.dataset.directV143='1';view.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();$('#intro')?.classList.remove('on','closing-v136','letter-exit-v135');navigate('insights')},true)}
  }

  const tutorialSteps=[
    ['01 · HOME','홈과 캘린더','날짜를 누르면 일정 추가창이 아래에서 열립니다. 네온 원형 띠가 현재 선택한 날짜를 표시해요.','home'],
    ['02 · PLANET WHEEL','행성 휠 사용법','오른쪽 아래 행성을 누르면 버튼을 감싸는 궤도가 열립니다. 아이콘을 누르거나 손가락을 끌어 메뉴를 선택하세요.','wheel'],
    ['03 · EVENT','기록과 앨범','Event에서 일상·감상·여행 기록을 남기고 앨범별로 다시 볼 수 있어요.','event'],
    ['04 · ROUTINE','루틴과 통계','Routine에서 MINI·MORE·MAX 단계를 선택하고 전체 통계로 흐름을 확인하세요.','routine'],
    ['05 · PERSONAL','건강과 생활 기록','Personal에서 식사, 운동, 수면과 건강 기록을 한곳에서 관리해요.','personal'],
    ['06 · LANGUAGE','어학 학습','Language에서 영어·중국어·일본어 코스를 선택하고 학습 진도를 이어가세요.','language'],
    ['07 · MY TOOLS','나의 작업 도구','My에서 Paper, Task, 뇌 훈련, Speech 도구를 열 수 있어요.','fifth'],
    ['08 · INSIGHTS','마음 인사이트','감정 기록이 쌓이면 오늘 요약, 감정 균형, 환경과 활동 전후 흐름을 분석해요.','insights']
  ];
  function tutorialScene(type){
    const title={home:'September · 2026',wheel:'행성 휠',event:'Event · 기록',routine:'전체 루틴',personal:'Personal Overview',language:'Language Lab',fifth:'My Tools',insights:'마음 인사이트'}[type];
    return `<div class="tutorial-live-stage-v143" data-tutorial-live-v143="${type}"><span class="tutorial-live-caption-v143">${title} · 실제 화면</span></div>`;
  }
  function hydrateTutorialScene(type){
    const host=$('[data-tutorial-live-v143]');if(!host)return;
    const source=document.getElementById(type==='wheel'?'home':type);if(!source)return;
    const clone=source.cloneNode(true);clone.classList.add('tutorial-live-page-v143','on');clone.setAttribute('aria-hidden','true');clone.inert=true;
    clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));clone.querySelectorAll('[onclick]').forEach(node=>node.removeAttribute('onclick'));
    if(type==='wheel'){
      const wheel=$('#wheel')?.cloneNode(true);if(wheel){wheel.removeAttribute('id');wheel.classList.add('open','tutorial-live-wheel-v143');wheel.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));clone.append(wheel)}
    }
    host.append(clone);
  }
  function ensureTutorial(){
    let overlay=$('.tutorial-v143');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.className='tutorial-v143';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
    overlay.innerHTML='<section class="tutorial-card-v143"><div class="tutorial-scene-v143"></div><div class="tutorial-copy-v143"><small data-tutorial-kicker-v143></small><h2 data-tutorial-title-v143></h2><p data-tutorial-copy-v143></p><div class="tutorial-dots-v143"></div><div class="tutorial-actions-v143"><button type="button" data-tutorial-dismiss-v143>다시 보지 않기</button><span><button type="button" data-tutorial-prev-v143>이전</button> <button type="button" data-tutorial-next-v143>다음</button></span></div></div></section>';
    document.body.append(overlay);
    overlay.addEventListener('click',event=>{
      if(event.target.closest('[data-tutorial-dismiss-v143]')){try{localStorage.setItem(TUTORIAL_KEY,'1')}catch{}overlay.classList.remove('on');return}
      const current=Number(overlay.dataset.step||0);
      if(event.target.closest('[data-tutorial-prev-v143]'))renderTutorial(Math.max(0,current-1));
      if(event.target.closest('[data-tutorial-next-v143]')){if(current>=tutorialSteps.length-1){overlay.classList.remove('on');return}renderTutorial(current+1)}
    });return overlay;
  }
  function renderTutorial(index=0){
    const overlay=ensureTutorial(),step=tutorialSteps[index]||tutorialSteps[0];overlay.dataset.step=String(index);
    $('.tutorial-scene-v143',overlay).innerHTML=tutorialScene(step[3]);hydrateTutorialScene(step[3]);$('[data-tutorial-kicker-v143]',overlay).textContent=step[0];$('[data-tutorial-title-v143]',overlay).textContent=step[1];$('[data-tutorial-copy-v143]',overlay).textContent=step[2];
    $('.tutorial-dots-v143',overlay).innerHTML=tutorialSteps.map((_,i)=>`<i class="${i===index?'active':''}"></i>`).join('');$('[data-tutorial-prev-v143]',overlay).disabled=index===0;$('[data-tutorial-next-v143]',overlay).textContent=index===tutorialSteps.length-1?'시작하기':'다음';overlay.classList.add('on');
  }
  function maybeTutorial(){let dismissed=false;try{dismissed=localStorage.getItem(TUTORIAL_KEY)==='1'}catch{}if(!dismissed)setTimeout(()=>renderTutorial(0),1250)}

  function captureActions(event){
    const background=event.target.closest?.('[data-background-v143]');if(background){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();applyBackground(background.dataset.backgroundV143);return}
    if(event.target.closest?.('[data-profile-tutorial-v137],[data-tutorial-replay-v136]')){event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();$('.profile-overlay-v137')?.classList.remove('on');renderTutorial(0);return}
  }
  function refresh(){refreshQueued=false;installWheel();decorateThemes();decorateEventEditor();decoratePostcard();decorateKoreanHolidays();installInsightRenderer()}
  function queueRefresh(){if(refreshQueued)return;refreshQueued=true;requestAnimationFrame(refresh)}

  applyBackground(backgroundMode(),false);
  document.addEventListener('click',captureActions,true);
  window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(page&&document.getElementById(page))navigate(page)});
  new MutationObserver(records=>{if(records.some(record=>record.addedNodes.length||record.type==='attributes'))queueRefresh()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-theme','class']});
  window.AiderLogV143={navigate,setWheelOpen,renderInsights:renderInsightsV143,renderTutorial,applyBackground,palettes:PALETTES};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{refresh();maybeTutorial()},{once:true});else{refresh();maybeTutorial()}
})();
