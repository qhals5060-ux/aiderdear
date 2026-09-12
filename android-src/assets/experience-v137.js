(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
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
    const api=window.AiderLogThemeV125,active=api?.resolvePalette?.(document.documentElement.dataset.theme)||'system';
    return Object.entries(api?.palettes||{}).map(([id,row])=>`<button class="profile-theme-v137 theme-swatch-v164 ${id===active?'active':''}" type="button" data-profile-theme-v137="${id}" aria-label="${safe(row.name)}" aria-pressed="${id===active}" style="--swatch:${row.a}"><span aria-hidden="true"></span></button>`).join('');
  }
  function fontButtons(){
    const active=document.documentElement.dataset.appFontSize||'normal';
    return Object.entries(FONTS).map(([id,label])=>`<button class="${id===active?'active':''}" type="button" data-profile-font-v137="${id}" aria-pressed="${id===active}">${label}</button>`).join('');
  }
  function profileMarkup(){
    const person=user(),name=displayName(person),initial=name.trim().charAt(0).toUpperCase()||'A';
    return `<section class="profile-sheet-v137 profile-compact-v164" role="dialog" aria-modal="true" aria-label="개인 페이지"><header class="profile-head-v137"><h1>개인 페이지</h1><button class="profile-close-v137" type="button" data-profile-close-v137 aria-label="개인 페이지 닫기">×</button></header><div class="profile-identity-v137"><div class="profile-avatar-v137" aria-hidden="true">${safe(initial)}</div><div><b>${safe(name)}</b>${person?.email?`<p>${safe(person.email)}</p>`:''}</div></div>${person?`<form class="profile-birth-v175" data-profile-birth-v175 data-profile-user-v175="${safe(person.uid)}"><label><span>생일${person.birthCalendar==='lunar'?' · 음력':''}</span><input id="loginBirthDate" name="birthDate" type="date" required value="${safe(person.birthDate||'')}"></label><button type="submit">저장</button><label ${person.gender?'hidden':''}>성별<select name="gender" required><option value="">선택</option><option value="female" ${person.gender==='female'?'selected':''}>여성</option><option value="male" ${person.gender==='male'?'selected':''}>남성</option></select></label><p role="status" aria-live="polite"></p></form>`:''}<section class="profile-section-v137"><header><h2>시스템 테마</h2></header><div class="profile-theme-grid-v137">${themeButtons()}</div></section><section class="profile-section-v137"><header><h2>글자 크기</h2></header><div class="profile-font-v137">${fontButtons()}</div></section><footer class="profile-foot-v137">${person?'<button class="logout" type="button" data-profile-logout-v137>로그아웃</button>':'<button type="button" data-profile-login-v137>Google 로그인</button>'}</footer></section>`;
  }
  function ensureProfile(){
    let overlay=$('.profile-overlay-v137');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.className='profile-overlay-v137';document.body.append(overlay);
    overlay.addEventListener('click',async event=>{
      if(event.target===overlay||event.target.closest('[data-profile-close-v137]')){overlay.classList.remove('on');return}
      const theme=event.target.closest('[data-profile-theme-v137]');
      if(theme){await window.AiderLogThemeV125?.apply?.(theme.dataset.profileThemeV137,true);return}
      const font=event.target.closest('[data-profile-font-v137]');
      if(font){await window.AiderLogThemeV125?.applyFontSize?.(font.dataset.profileFontV137,true);$$('[data-profile-font-v137]',overlay).forEach(button=>{const active=button.dataset.profileFontV137===font.dataset.profileFontV137;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active))});return}
      if(event.target.closest('[data-profile-login-v137]')){await startLogin();return}
      if(event.target.closest('[data-profile-logout-v137]')){await firebase()?.logout?.();overlay.classList.remove('on')}
    });
    overlay.addEventListener('submit',async event=>{if(!event.target.matches('[data-profile-birth-v175]'))return;event.preventDefault();const form=event.target,person=user();if(!person||form.dataset.profileUserV175!==person.uid)return;const status=form.querySelector('[role="status"]'),button=form.querySelector('[type="submit"]');if(button.disabled)return;button.disabled=true;status.textContent='저장 중…';try{await firebase().updateProfileSettings({name:displayName(person),gender:form.elements.gender.value,birthDate:form.elements.birthDate.value,birthCalendar:person.birthCalendar||'solar',birthLeap:!!person.birthLeap});if(user()?.uid===person.uid){renderProfile();const message=$('[data-profile-birth-v175] [role="status"]',overlay);if(message)message.textContent='생일을 저장했습니다.';}}catch(error){status.textContent=error.message||'저장하지 못했습니다. 입력은 유지됩니다.';}finally{button.disabled=false;}});
    return overlay;
  }
  function renderProfile(){const overlay=ensureProfile();overlay.innerHTML=profileMarkup();window.AiderPrivateCalendarUIV175?.calendarChanged();return overlay}
  function openProfile(){renderProfile().classList.add('on')}
  async function startLogin(){
    try{
      if(firebase()?.login){await firebase().login();return}
      await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('로그인 모듈을 불러오지 못했습니다.')),9000);addEventListener('aiderdear-firebase-ready',()=>{clearTimeout(timer);resolve()},{once:true})});
      await firebase()?.login?.();
    }catch(error){console.error('[v137-login]',error);alert(error?.message||'Google 로그인을 시작하지 못했습니다.')}
  }

  let profileBoundV175=false;
  function bindProfileButton(){
    if(profileBoundV175)return;
    profileBoundV175=true;
    document.documentElement.dataset.profileButtonV137='1';
    window.addEventListener('click',event=>{
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
  function removeInAppWidgetPreviews(){$$('.widget-settings-v135,.widget-config-v136,.widget-preview-v136').forEach(node=>{node.hidden=true;node.setAttribute('aria-hidden','true')})}
  function decorateInsight(){
    const hero=$('#insights .ins-hero-v126');if(hero)hero.dataset.atlasV137='1';
    $$('#insights .insight-site-card-v126').forEach((card,index)=>card.dataset.orbitCardV137=String(index+1));
  }
  function refresh(){
    queued=false;bindProfileButton();restoreMy();buildWheelLayers();animatePostcard();removeInAppWidgetPreviews();decorateInsight();
  }
  function queue(){if(queued)return;queued=true;requestAnimationFrame(refresh)}

  // The profile entry must work even while another workspace is still booting.
  // Register it independently of render/MutationObserver initialization.
  bindProfileButton();
  window.AiderLogProfileV175=Object.freeze({open:openProfile});
  document.addEventListener('click',directInsightTransition,true);
  addEventListener('aiderdear-firebase-state',()=>{restoreMy();if($('.profile-overlay-v137.on'))renderProfile()});
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-theme','data-app-font-size']});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
