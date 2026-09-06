(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const user=()=>window.AiderDearFirebase?.getState?.()?.user||null;
  const nameOf=person=>person?.name||person?.displayName||person?.email?.split('@')[0]||'AiderLog 사용자';

  function calendarIcon(){
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17"/></svg>';
  }
  function decorateProfile(){
    const sheet=$('.profile-sheet-v137');
    if(!sheet||$('[data-profile-calendar-section-v138]',sheet))return;
    const person=user(),fontSection=$('.profile-section-v137:last-of-type',sheet);
    const section=document.createElement('section');
    section.className='profile-section-v137';
    section.dataset.profileCalendarSectionV138='1';
    section.innerHTML=`<button class="profile-calendar-link-v164" type="button" data-profile-calendar-v138><span>캘린더 연동</span><span>${person?'연결 · 선택':'로그인'} <i aria-hidden="true">›</i></span></button>`;
    fontSection?.after(section);
  }
  async function openCalendar(event){
    const button=event.target.closest('[data-profile-calendar-v138]');if(!button)return;
    event.preventDefault();event.stopPropagation();
    if(!user()){
      const login=$('[data-profile-login-v137]');if(login){login.click();return}
      try{await window.AiderDearFirebase?.login?.()}catch(error){console.error('[v138-login]',error)}
      return;
    }
    $('.profile-overlay-v137')?.classList.remove('on');
    window.AiderLogCalendarV125?.openSettings?.();
  }
  function restoreWorkspace(){
    if(typeof window.renderMyV128!=='function')return;
    const host=$('#fifth');
    if(host&&!$('.my128-page',host))window.renderMyV128();
    const label=$('#fifthLabel');if(label)label.textContent='My';
  }
  function refresh(){decorateProfile();restoreWorkspace()}
  document.addEventListener('click',openCalendar,true);
  addEventListener('aiderdear-firebase-state',()=>requestAnimationFrame(refresh));
  new MutationObserver(()=>requestAnimationFrame(decorateProfile)).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(refresh),{once:true}):requestAnimationFrame(refresh);
})();
