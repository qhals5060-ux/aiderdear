(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const THEME_META={
    system:['시스템','#7657d8','#f8f7fc'],sun:['태양','#ff821c','#b41c2a'],mercury:['수성','#777572','#d8d8da'],
    venus:['금성','#9a9d9c','#f4ddc1'],earth:['지구','#27457d','#3d7c6d'],mars:['화성','#ddbe99','#ee775b'],
    jupiter:['목성','#c38836','#aa735f'],saturn:['토성','#f3cf83','#8c846c'],uranus:['천왕성','#6e9294','#c8ebf0'],
    neptune:['해왕성','#6f87b2','#52647f'],pluto:['명왕성','#d7cbb9','#49301f']
  };
  const FONT_META={small:'작게',normal:'보통',large:'크게'};
  const TUTORIAL_KEY='aiderlog-tutorial-dismissed-v136';
  let accountState=window.AiderDearFirebase?.getState?.()||{};
  let wheelSparkTimer=0;
  let queued=false;

  function state(){return window.AiderDearFirebase?.getState?.()||accountState||{}}
  function currentUser(){return state().user||null}
  function iconUser(){return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>'}

  function installNativeAppShell(){
    const shell=window.AiderLogAppShell||{};if(typeof shell.openTarget==='function'){document.documentElement.dataset.nativeShellV136='existing';return}
    shell.openTarget=(target,action)=>{
      if(String(action||'').startsWith('aiderlog://auth')){
        const finish=()=>window.AiderDearFirebase?.completeAndroidGoogleSignIn?.(action).catch(error=>{console.error('[v136-android-auth]',error);alert(error?.message||'Google 로그인을 완료하지 못했습니다.')});
        if(typeof window.AiderDearFirebase?.completeAndroidGoogleSignIn==='function')finish();else addEventListener('aiderdear-firebase-ready',finish,{once:true});return;
      }
      const page={schedule:'home',private:'routine',record:'event',personal:'personal',language:'language',fifth:'fifth'}[target]||'home';
      if(typeof go==='function')go(page,false);else location.hash=page;
    };
    shell.handleBack=()=>{const open=$('.tutorial-v136.on,.intro.on,.schedule-dialog-v125.on,.emotion-dialog-v119.on,.event-editor-overlay-v111');if(!open)return false;const close=$('[aria-label="닫기"],[data-schedule-dialog-close-v125],[data-tutorial-dismiss-v136]',open);close?.click?.();return true};
    shell.deviceChanged=()=>dispatchEvent(new Event('resize'));window.AiderLogAppShell=shell;document.documentElement.dataset.nativeShellV136='installed';
  }

  function installSplash(){
    let splash=$('.app-splash-v136');
    if(!splash){
      splash=document.createElement('div');splash.className='app-splash-v136 app-splash-v145';splash.setAttribute('aria-label','AiderLog 시작 화면');
      splash.innerHTML='<div class="splash-media-v145"><img src="./aiderlog-launch-v145.gif" alt="AiderLog · 오늘의 기록이 모여 나의 우주가 됩니다."><span class="splash-progress-v145" aria-hidden="true"><i></i></span></div>';
      document.body.prepend(splash);
    }
    const shownAt=performance.now();
    const finish=()=>setTimeout(()=>{splash.classList.add('is-hidden');setTimeout(()=>{splash.remove();maybeShowTutorial()},560)},Math.max(0,5600-(performance.now()-shownAt)));
    document.readyState==='complete'?finish():addEventListener('load',finish,{once:true});
  }

  const tutorialSteps=[
    ['01 · PLANET WHEEL','휠을 누른 채 움직여 보세요','오른쪽 아래 행성을 길게 누른 뒤 손가락을 움직이면 선택 중인 메뉴가 빛납니다. 손을 놓으면 해당 화면으로 이동해요.'],
    ['02 · CALENDAR','날짜를 눌러 일정을 기록해요','날짜를 누르면 아래에서 일정 창이 올라옵니다. 알림 시간도 함께 정할 수 있어요.'],
    ['03 · INSIGHT LETTER','오늘의 마음은 한 장의 엽서로','감정 기록을 바탕으로 움직이는 행성 엽서가 열립니다. 테마와 글자 크기는 오른쪽 위 프로필 버튼에서 바꿀 수 있어요.']
  ];
  function ensureTutorial(){
    let overlay=$('.tutorial-v136');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.className='tutorial-v136';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
    overlay.innerHTML='<section class="tutorial-card-v136"><div class="tutorial-visual-v136"></div><div class="tutorial-step-v136"><small data-tutorial-kicker-v136></small><h2 data-tutorial-title-v136></h2><p data-tutorial-copy-v136></p><div class="tutorial-dots-v136" aria-hidden="true"></div><div class="tutorial-actions-v136"><button type="button" data-tutorial-dismiss-v136>다시 보지 않기</button><button type="button" data-tutorial-next-v136>다음</button></div></div></section>';
    document.body.append(overlay);
    overlay.addEventListener('click',event=>{
      if(event.target.closest('[data-tutorial-dismiss-v136]')){try{localStorage.setItem(TUTORIAL_KEY,'1')}catch{}overlay.classList.remove('on');return}
      if(event.target.closest('[data-tutorial-next-v136]')){const current=Number(overlay.dataset.step||0);if(current>=tutorialSteps.length-1){overlay.classList.remove('on');return}renderTutorial(current+1)}
    });
    return overlay;
  }
  function renderTutorial(index=0){
    const overlay=ensureTutorial(),step=tutorialSteps[index]||tutorialSteps[0];overlay.dataset.step=String(index);
    $('[data-tutorial-kicker-v136]',overlay).textContent=step[0];$('[data-tutorial-title-v136]',overlay).textContent=step[1];$('[data-tutorial-copy-v136]',overlay).textContent=step[2];
    $('.tutorial-dots-v136',overlay).innerHTML=tutorialSteps.map((_,i)=>`<i class="${i===index?'active':''}"></i>`).join('');
    $('[data-tutorial-next-v136]',overlay).textContent=index===tutorialSteps.length-1?'시작하기':'다음';overlay.classList.add('on');
  }
  function maybeShowTutorial(){let dismissed=false;try{dismissed=localStorage.getItem(TUTORIAL_KEY)==='1'}catch{}if(!dismissed)setTimeout(()=>renderTutorial(0),180)}

  function loginReady(){
    if(window.AiderDearFirebase?.login)return Promise.resolve(window.AiderDearFirebase);
    return new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(new Error('로그인 모듈을 불러오지 못했습니다. 네트워크를 확인한 뒤 다시 시도해주세요.')),9000);
      addEventListener('aiderdear-firebase-ready',()=>{clearTimeout(timer);resolve(window.AiderDearFirebase)},{once:true});
    });
  }
  async function startLogin(){
    try{const api=await loginReady();await api.login()}catch(error){console.error('[v136-login]',error);alert(error?.message||'Google 로그인을 시작하지 못했습니다.')}
  }
  function updateLoginButton(){
    const button=$('#loginBtn');if(!button)return;const user=currentUser();
    button.dataset.accountV136=String(!!user);button.setAttribute('aria-label',user?'개인 페이지':'Google 로그인');button.title=user?'개인 페이지':'Google 로그인';
    button.innerHTML=user?`${iconUser()}<span class="account-name-v136">${safe(user.name||user.displayName||user.email?.split('@')[0]||'My')}</span>`:iconUser();
    if(button.dataset.loginV136==='1')return;
    button.dataset.loginV136='1';button.onclick=null;
    button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();if(currentUser()){renderAccountPage();if(typeof go==='function')go('fifth',true);else location.hash='fifth'}else startLogin()},true);
  }

  function themeMarkup(){
    const active=document.documentElement.dataset.theme||'system';
    return Object.entries(THEME_META).map(([id,row])=>`<button type="button" class="account-theme-v136 ${id===active?'active':''}" data-account-theme-v136="${id}" style="--sw1:${row[1]};--sw2:${row[2]}"><i></i>${row[0]}</button>`).join('');
  }
  function fontMarkup(){
    const active=document.documentElement.dataset.appFontSize||'normal';
    return Object.entries(FONT_META).map(([id,label])=>`<button type="button" class="${id===active?'active':''}" data-account-font-v136="${id}">${label}</button>`).join('');
  }
  function widgetDays(){
    const today=new Date(),first=new Date(today.getFullYear(),today.getMonth(),1),start=1-first.getDay();
    return Array.from({length:35},(_,index)=>{const value=start+index,date=new Date(today.getFullYear(),today.getMonth(),value),isToday=date.toDateString()===today.toDateString();return `<span class="${isToday?'today':''}">${date.getDate()}</span>`}).join('');
  }
  function accountMarkup(){
    const user=currentUser(),name=user?.name||user?.displayName||user?.email?.split('@')[0]||'AiderLog 사용자',initial=String(name).trim().charAt(0).toUpperCase()||'A';
    const now=new Date(),month=new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long'}).format(now);
    return `<div class="page account-page-v136">
      <section class="account-hero-v136"><div class="account-identity-v136"><div class="account-avatar-v136">${safe(initial)}</div><div><small>MY AIDERLOG UNIVERSE</small><h1>${safe(name)}</h1><p>${safe(user?.email||'로그인하면 설정을 기기와 동기화할 수 있어요.')}</p></div></div>${user?'<button type="button" data-account-logout-v136>로그아웃</button>':'<button type="button" data-account-login-v136>Google 로그인</button>'}</section>
      <div class="account-grid-v136">
        <section class="account-panel-v136"><header><div><small>APPEARANCE</small><h2>테마와 글자</h2></div></header><div class="account-theme-strip-v136">${themeMarkup()}</div><div class="account-font-v136">${fontMarkup()}</div><div class="account-actions-v136"><button type="button" data-tutorial-replay-v136>사용 방법 다시 보기</button></div></section>
        <section class="account-panel-v136"><header><div><small>HOME WIDGET</small><h2>캘린더 위젯 미리보기</h2></div></header><div class="widget-config-v136"><div class="widget-choice-v136"><label>구성<select data-widget-layout-v136><option value="split">달력 + 일정</option><option value="month">월간 달력</option><option value="agenda">일정 스트립</option></select></label><label>크기<select data-widget-size-v136><option value="small">작게</option><option value="medium" selected>보통</option><option value="large">넓게</option></select></label><button type="button" data-widget-pin-v136>이 구성으로 홈 화면에 추가</button></div><article class="widget-preview-v136" data-layout="split" data-size="medium"><header><h3>${safe(month)}</h3><small>오늘의 일정</small></header><div class="widget-month-v136">${widgetDays()}</div><div class="widget-agenda-v136"><p>09:30 · 오늘의 계획 정리</p><p>18:00 · 마음 기록</p></div></article></div><p class="widget-help-v136" data-widget-help-v136>설정을 바꾸면 이 자리에서 실제 색상과 구성을 미리 볼 수 있어요.</p></section>
      </div>
    </div>`;
  }
  function renderAccountPage(){
    const workspace=$('#fifth');
    if(typeof window.renderMyV128==='function'){
      if(!workspace?.classList.contains('on')||workspace.children.length)return;
      window.renderMyV128();return
    }
    const host=$('#fifth');if(!host)return;const user=currentUser(),key=`${user?.uid||'guest'}|${document.documentElement.dataset.theme||'system'}|${document.documentElement.dataset.appFontSize||'normal'}`;
    if(host.dataset.accountKeyV136===key&&$('.account-page-v136',host))return;host.dataset.accountKeyV136=key;host.innerHTML=accountMarkup();const label=$('#fifthLabel');if(label)label.textContent='My';
  }
  async function accountClick(event){
    const theme=event.target.closest('[data-account-theme-v136]');if(theme){await window.AiderLogThemeV125?.apply?.(theme.dataset.accountThemeV136,true);renderAccountPage();return}
    const font=event.target.closest('[data-account-font-v136]');if(font){await window.AiderLogThemeV125?.applyFontSize?.(font.dataset.accountFontV136,true);renderAccountPage();return}
    if(event.target.closest('[data-account-login-v136]'))return startLogin();
    if(event.target.closest('[data-account-logout-v136]'))return window.AiderDearFirebase?.logout?.();
    if(event.target.closest('[data-tutorial-replay-v136]')){try{localStorage.removeItem(TUTORIAL_KEY)}catch{}renderTutorial(0);return}
    if(event.target.closest('[data-widget-pin-v136]')){
      const layout=$('[data-widget-layout-v136]')?.value||'split',size=$('[data-widget-size-v136]')?.value||'medium',help=$('[data-widget-help-v136]');
      try{const accepted=window.AiderLogNative?.pinCalendarWidget?.(`${layout}:${size}`);if(help)help.textContent=accepted?'홈 화면의 위젯 추가 확인창을 열었어요.':'홈 화면의 AiderLog 위젯 목록에서 같은 구성을 선택해주세요.'}catch{if(help)help.textContent='홈 화면의 위젯 목록에서 AiderLog를 선택해주세요.'}
    }
  }
  function accountChange(event){
    if(!event.target.matches('[data-widget-layout-v136],[data-widget-size-v136]'))return;const preview=$('.widget-preview-v136');if(!preview)return;
    preview.dataset.layout=$('[data-widget-layout-v136]')?.value||'split';preview.dataset.size=$('[data-widget-size-v136]')?.value||'medium';
  }

  function wrapPersonalRenderer(){
    if(typeof window.renderPersonal!=='function'||window.renderPersonal.__v136)return;
    const previous=window.renderPersonal;const wrapped=function(){const result=previous.apply(this,arguments);renderAccountPage();return result};wrapped.__v136=true;window.renderPersonal=wrapped;
  }

  function wideWheelSelector(x,y){
    const core=$('#wheelCore');if(!core)return;const rect=core.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2,left=cx-x,up=cy-y,dist=Math.hypot(left,up);let idx=null;
    if(left>=-62&&up>=-66&&dist>18&&dist<286){const angle=Math.atan2(Math.max(0,up+5),Math.max(.001,left+4))*180/Math.PI;idx=Math.max(0,Math.min(4,Math.round(angle/22.5)))}
    wheelSelected=idx==null?null:$(`.global-wheel-item-v126[data-index="${idx}"]`);$$('.global-wheel-item-v126').forEach(item=>{const selected=item===wheelSelected;item.classList.toggle('hovered',selected);item.dataset.wheelSelectedV136=String(selected)});
  }
  function installWheelSelector(){try{window.selectWheelAngle=wideWheelSelector;if(typeof selectWheelAngle!=='undefined')selectWheelAngle=wideWheelSelector}catch{}}
  function sparkWheel(){
    const core=$('#wheelCore');if(!core)return;const rect=core.getBoundingClientRect(),angle=Math.random()*Math.PI*2,radius=38+Math.random()*38,node=document.createElement('i');node.className='wheel-holo-trail-v136';
    const x=rect.left+rect.width/2+Math.cos(angle)*radius,y=rect.top+rect.height/2+Math.sin(angle)*radius;node.style.left=`${x}px`;node.style.top=`${y}px`;node.style.color=['#dffcff','#f5d9ff','#fff2b4','#9fe7ff'][Math.floor(Math.random()*4)];node.style.setProperty('--tx',`${Math.cos(angle)*(12+Math.random()*20)}px`);node.style.setProperty('--ty',`${Math.sin(angle)*(12+Math.random()*20)}px`);document.body.append(node);setTimeout(()=>node.remove(),760);
  }
  function bindWheelEffects(){
    const core=$('#wheelCore');if(!core||core.dataset.effectsV136==='1')return;core.dataset.effectsV136='1';
    core.addEventListener('pointerdown',()=>{clearInterval(wheelSparkTimer);sparkWheel();wheelSparkTimer=setInterval(sparkWheel,86)},{capture:true});
    const stop=()=>{clearInterval(wheelSparkTimer);wheelSparkTimer=0;setTimeout(()=>$$('.wheel-holo-trail-v136').forEach(node=>node.remove()),720)};
    core.addEventListener('pointerup',stop,{capture:true});core.addEventListener('pointercancel',stop,{capture:true});core.addEventListener('lostpointercapture',stop,{capture:true});
    if(new URLSearchParams(location.search).get('wheel')==='pressed'){
      $('#wheel')?.classList.add('open');core.classList.add('holo-hold-v135','pressing');
      const preview=$('.global-wheel-item-v126[data-index="2"]');preview?.classList.add('hovered');if(preview)preview.dataset.wheelSelectedV136='true';
    }
  }

  function moodTone(value){const text=String(value||'');if(/기쁨|행복|설렘|신남|뿌듯/.test(text))return'joy';if(/사랑|애정|감사/.test(text))return'love';if(/슬픔|우울|외로|허전/.test(text))return'sad';if(/화|분노|짜증|불안/.test(text))return'anger';return'calm'}
  function decoratePostcard(){
    const modal=$('#intro'),card=$('.insight-letter-card-v132');if(!modal||!card)return;
    if(!$('.insight-postcard-art-v135',card)){const art=document.createElement('div');art.className='insight-postcard-art-v135';art.setAttribute('aria-hidden','true');card.insertBefore(art,$('.insight-letter-summary-v132',card))}
    modal.dataset.moodTone=moodTone($('#introMood')?.textContent);const mascot=$('#introMascotV133');mascot?.remove();
    const old=$('#introView');if(old&&old.dataset.exitV136!=='1'){
      const button=old.cloneNode(true);button.dataset.exitV136='1';button.dataset.exitV135='1';old.replaceWith(button);
      button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();if(modal.classList.contains('closing-v136'))return;modal.classList.add('closing-v136');const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?40:820;setTimeout(()=>{modal.classList.remove('on','closing-v136','letter-exit-v135');if(typeof go==='function')go('insights',false);else location.hash='insights'},delay)},true);
    }
  }

  function improveLanguageScroll(){
    $$('aiderlog-language-lab').forEach(host=>{
      const root=host.shadowRoot;if(!root||root.querySelector('style[data-v136-scroll]'))return;const style=document.createElement('style');style.dataset.v136Scroll='1';
      style.textContent=':host{display:block!important;height:auto!important;min-height:0!important;overflow:visible!important}:host .app-shell{height:auto!important;min-height:100%!important;max-height:none!important;overflow:visible!important;padding-bottom:80px!important}:host .app-shell>.single-page{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}:host .app-shell>.single-page>.learning-section,:host .app-shell>.single-page>.dashboard-section{height:auto!important;min-height:0!important;max-height:none!important;overflow:visible!important}:host .scenario-summary{border-radius:24px!important}:host .day-list{height:auto!important;max-height:none!important;overflow:visible!important;padding-bottom:30px!important}@media(max-width:760px){:host .app-shell>.single-page{display:block!important}:host .dashboard-section{margin-top:14px!important}}';root.append(style);
    });
  }

  function notifyNewMail(detail){
    const user=detail?.user;if(!user?.uid||!Array.isArray(detail.directLetters))return;const key=`aiderlog-mail-seen-v136:${user.uid}`;let seen=[];try{seen=JSON.parse(localStorage.getItem(key)||'[]')}catch{}const set=new Set(Array.isArray(seen)?seen.map(String):[]);
    const incoming=detail.directLetters.filter(row=>row?.id&&row.toUid===user.uid&&!row.readBy?.includes(user.uid));
    if(!seen.length){try{localStorage.setItem(key,JSON.stringify(detail.directLetters.map(row=>String(row.id)).slice(0,120)))}catch{}return}
    const fresh=incoming.filter(row=>!set.has(String(row.id)));fresh.slice(0,2).forEach(row=>{try{window.AiderLogNative?.showMailNotification?.(`${row.fromName||'AiderLog'}님의 우편`,String(row.body||'새로운 우편이 도착했어요.'),String(row.id))}catch{}});
    detail.directLetters.forEach(row=>set.add(String(row.id)));try{localStorage.setItem(key,JSON.stringify(Array.from(set).slice(-160)))}catch{}
  }

  function openInsightFromHome(event){
    if(!event.target.closest('[data-schedule-insights-v125],[data-schedule-insights-v119]'))return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    if(typeof window.openAiderLogInsightLetter==='function')window.openAiderLogInsightLetter();else $('#intro')?.classList.add('on');
  }

  function refresh(){queued=false;installNativeAppShell();updateLoginButton();wrapPersonalRenderer();renderAccountPage();installWheelSelector();bindWheelEffects();decoratePostcard();improveLanguageScroll()}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(refresh)}
  document.addEventListener('click',openInsightFromHome,true);document.addEventListener('click',accountClick);document.addEventListener('change',accountChange);
  addEventListener('aiderdear-firebase-ready',()=>{updateLoginButton();renderAccountPage()});
  addEventListener('aiderdear-firebase-state',event=>{accountState=event.detail||{};updateLoginButton();renderAccountPage();notifyNewMail(event.detail||{})});
  new MutationObserver(records=>{if(records.some(record=>record.addedNodes.length||record.type==='attributes'))queue()}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','data-theme','data-app-font-size']});
  installNativeAppShell();installSplash();document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
