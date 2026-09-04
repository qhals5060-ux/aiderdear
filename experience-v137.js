(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const THEMES={system:'시스템',sun:'태양',mercury:'수성',venus:'금성',earth:'지구',mars:'화성',jupiter:'목성',saturn:'토성',uranus:'천왕성',neptune:'해왕성',pluto:'명왕성'};
  const FONTS={small:'작게',normal:'보통',large:'크게'};
  let queued=false;

  function firebase(){return window.AiderDearFirebase}
  function user(){return firebase()?.getState?.()?.user||null}
  function displayName(person=user()){return person?.name||person?.displayName||person?.email?.split('@')[0]||'AiderLog 사용자'}

  function myMarkup(){
    const together=!!(firebase()?.getState?.()?.pair),title=together?'Together':'My';
    return `<div class="page my-home-v137" data-my-home-v137="1"><i class="account-page-v136" hidden aria-hidden="true"></i><div class="barebar"><h1 class="page-title">${title}</h1></div><article class="simple card"><p>${together?'연결된 사람과 공유하는 일정과 우편이 이 공간에 이어집니다.':'휠의 MY 공간입니다. 계정과 화면 설정은 오른쪽 위 프로필 버튼에서 열 수 있어요.'}</p></article></div>`;
  }
  function restoreMy(){
    const host=$('#fifth');if(!host)return;
    /* v128 owns the real MY workspace (Paper, Task, Speech, Brain).  Keep
       account/profile concerns in the header profile sheet. */
    if(typeof window.renderMyV128==='function'){
      const label=$('#fifthLabel');if(label)label.textContent='My';
      return;
    }
    if(!$('[data-my-home-v137]',host)){host.innerHTML=myMarkup()}
    const label=$('#fifthLabel');if(label)label.textContent=firebase()?.getState?.()?.pair?'Together':'My';
  }

  function themeButtons(){
    const active=document.documentElement.dataset.theme||'system';
    return Object.entries(THEMES).map(([id,label])=>`<button class="profile-theme-v137 ${id===active?'active':''}" type="button" data-profile-theme-v137="${id}" aria-pressed="${id===active}"><span class="profile-planet-v137 ${id}" aria-hidden="true"></span><b>${label}</b></button>`).join('');
  }
  function fontButtons(){
    const active=document.documentElement.dataset.appFontSize||'normal';
    return Object.entries(FONTS).map(([id,label])=>`<button class="${id===active?'active':''}" type="button" data-profile-font-v137="${id}" aria-pressed="${id===active}">${label}</button>`).join('');
  }
  function profileMarkup(){
    const person=user(),name=displayName(person),initial=name.trim().charAt(0).toUpperCase()||'A';
    return `<section class="profile-sheet-v137" role="dialog" aria-modal="true" aria-label="개인 페이지"><header class="profile-head-v137"><div class="profile-identity-v137"><div class="profile-avatar-v137">${safe(initial)}</div><div><small>MY AIDERLOG UNIVERSE</small><h1>${safe(name)}</h1><p>${safe(person?.email||'로그인하면 기록과 설정을 안전하게 동기화할 수 있어요.')}</p></div></div><button class="profile-close-v137" type="button" data-profile-close-v137 aria-label="개인 페이지 닫기">×</button></header><section class="profile-section-v137"><header><small>SOLAR SYSTEM</small><h2>시스템 테마</h2></header><div class="profile-theme-grid-v137">${themeButtons()}</div></section><section class="profile-section-v137"><header><small>TYPOGRAPHY</small><h2>글자 크기</h2></header><div class="profile-font-v137">${fontButtons()}</div></section><section class="profile-section-v137 profile-apps-v145"><header><small>DOWNLOAD</small><h2>AiderLog 앱</h2></header><div class="profile-app-grid-v145"><article><i aria-hidden="true">PC</i><div><b>PC · 사이트 파일</b><small>백업 또는 로컬 실행용 전체 파일</small></div><a href="./AiderLog-v145-site-files.zip" download="AiderLog-v145-site-files.zip">다운로드</a></article><article><i class="android" aria-hidden="true">A</i><div><b>Android 앱</b><small>Galaxy Fold·Flip · Android 8.0 이상</small></div><a href="./AiderLog-v145.apk" download="AiderLog-v145.apk">APK 다운로드</a></article></div></section><footer class="profile-foot-v137"><button type="button" data-profile-tutorial-v137>사용 방법 다시 보기</button>${person?'<button class="logout" type="button" data-profile-logout-v137>로그아웃</button>':'<button type="button" data-profile-login-v137>Google 로그인</button>'}</footer></section>`;
  }
  function ensureProfile(){
    let overlay=$('.profile-overlay-v137');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.className='profile-overlay-v137';document.body.append(overlay);
    overlay.addEventListener('click',async event=>{
      if(event.target===overlay||event.target.closest('[data-profile-close-v137]')){overlay.classList.remove('on');return}
      const theme=event.target.closest('[data-profile-theme-v137]');
      if(theme){await window.AiderLogThemeV125?.apply?.(theme.dataset.profileThemeV137,true);renderProfile();return}
      const font=event.target.closest('[data-profile-font-v137]');
      if(font){await window.AiderLogThemeV125?.applyFontSize?.(font.dataset.profileFontV137,true);renderProfile();return}
      if(event.target.closest('[data-profile-tutorial-v137]')){overlay.classList.remove('on');try{localStorage.removeItem('aiderlog-tutorial-dismissed-v136')}catch{}$('.tutorial-v136')?.classList.add('on');return}
      if(event.target.closest('[data-profile-login-v137]')){await startLogin();return}
      if(event.target.closest('[data-profile-logout-v137]')){await firebase()?.logout?.();overlay.classList.remove('on')}
    });
    return overlay;
  }
  function renderProfile(){const overlay=ensureProfile();overlay.innerHTML=profileMarkup();return overlay}
  function openProfile(){renderProfile().classList.add('on')}
  async function startLogin(){
    try{
      if(firebase()?.login){await firebase().login();return}
      await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('로그인 모듈을 불러오지 못했습니다.')),9000);addEventListener('aiderdear-firebase-ready',()=>{clearTimeout(timer);resolve()},{once:true})});
      await firebase()?.login?.();
    }catch(error){console.error('[v137-login]',error);alert(error?.message||'Google 로그인을 시작하지 못했습니다.')}
  }

  function bindProfileButton(){
    if(document.documentElement.dataset.profileButtonV137==='1')return;
    document.documentElement.dataset.profileButtonV137='1';
    document.addEventListener('click',event=>{
      if(!event.target.closest('#loginBtn'))return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      openProfile();
    },true);
  }

  function buildWheelLayers(){
    const core=$('#wheelCore');if(!core||$('.wheel-sphere-v137',core))return;
    const back=document.createElement('span'),sphere=document.createElement('span'),front=document.createElement('span');
    back.className='wheel-ring-back-v137';sphere.className='wheel-sphere-v137';front.className='wheel-ring-front-v137';
    back.setAttribute('aria-hidden','true');sphere.setAttribute('aria-hidden','true');front.setAttribute('aria-hidden','true');
    core.prepend(front);core.prepend(sphere);core.prepend(back);
  }

  function animatePostcard(){
    const art=$('.insight-postcard-art-v135');if(!art)return;
    if(!$('.postcard-dream-v137',art)){const dream=document.createElement('span'),stars=document.createElement('span');dream.className='postcard-dream-v137';stars.className='postcard-stars-v137';dream.setAttribute('aria-hidden','true');stars.setAttribute('aria-hidden','true');art.append(dream,stars);art.dataset.motionV137='active'}
  }
  function directInsightTransition(event){
    if(!event.target.closest('#introView'))return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    const modal=$('#intro');modal?.classList.remove('on','closing-v136','letter-exit-v135');
    if(typeof window.go==='function')window.go('insights',false);else location.hash='insights';
  }
  function updateTutorialCopy(){
    const steps=window.tutorialSteps;if(Array.isArray(steps)&&steps[2])steps[2][2]='감정 기록을 바탕으로 움직이는 행성 엽서가 열립니다. 테마와 글자 크기는 오른쪽 위 프로필 버튼에서 바꿀 수 있어요.';
  }
  function removeInAppWidgetPreviews(){$$('.widget-settings-v135,.widget-config-v136,.widget-preview-v136').forEach(node=>{node.hidden=true;node.setAttribute('aria-hidden','true')})}
  function decorateInsight(){
    const hero=$('#insights .ins-hero-v126');if(hero)hero.dataset.atlasV137='1';
    $$('#insights .insight-site-card-v126').forEach((card,index)=>card.dataset.orbitCardV137=String(index+1));
  }
  function refresh(){
    queued=false;restoreMy();bindProfileButton();buildWheelLayers();animatePostcard();removeInAppWidgetPreviews();decorateInsight();updateTutorialCopy();
  }
  function queue(){if(queued)return;queued=true;requestAnimationFrame(refresh)}

  document.addEventListener('click',directInsightTransition,true);
  addEventListener('aiderdear-firebase-state',()=>{restoreMy();if($('.profile-overlay-v137.on'))renderProfile()});
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-theme','data-app-font-size']});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
