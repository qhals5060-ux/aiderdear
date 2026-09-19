/* Single website design. Legacy appearance preferences resolve to Modern;
   the Android application's theme controls and account data are independent. */
(() => {
  'use strict';
  const html=document.documentElement;
  if(window.AiderLogNative||html.classList.contains('aiderlog-android'))return;
  const app=document.getElementById('app'),masthead=app?.querySelector('.masthead'),navTools=app?.querySelector('.nav-tools');
  const sectionNavs=[
    ['.page-dots',['캘린더','감정 인사이트']],
    ['.record-page-dots',['기록 · 앨범','아카이브 · 여행']],
    ['.personal-page-dots',['개인 기록','통합 대시보드']],
    ['.task-page-dots',['고객 관리','입시요강']],
  ];
  // Only public installation links are cloned into the guest account area.
  const downloads=document.querySelector('[data-account-panel="app"] .site-edition-downloads'),loginStatus=document.getElementById('googleStatus');
  if(downloads&&loginStatus&&!document.getElementById('siteGuestDownloadsV164')){
    const guest=document.createElement('section');guest.id='siteGuestDownloadsV164';guest.className='site-guest-downloads';guest.setAttribute('aria-label','앱 및 사이트 다운로드');guest.append(downloads.cloneNode(true));loginStatus.after(guest);
  }
  const shadowStyles=new WeakMap();
  function styleWorkspaces(){
    const root=document.querySelector('aider-paper-workspace-v121')?.shadowRoot;
    if(!root||!root.querySelector('.paper-v121-surface'))return;
    let style=shadowStyles.get(root)||root.querySelector('[data-site-edition-style="paper"]');
    if(!style){style=document.createElement('link');style.rel='stylesheet';style.href='./site-paper-modern-v165.css';style.dataset.siteEditionStyle='paper';root.append(style);shadowStyles.set(root,style);new MutationObserver(()=>{if(root.lastElementChild!==style)root.append(style);}).observe(root,{childList:true});}
    style.media='all';style.disabled=false;
  }
  function apply(){
    html.classList.add('modern-site');html.dataset.siteEdition='modern';html.dataset.siteDefaultEdition='modern';
    try{localStorage.setItem('aiderlog.site.edition','modern');}catch{}
    if(navTools&&masthead&&navTools.parentNode!==masthead)masthead.append(navTools);
    for(const [selector,names]of sectionNavs){const nav=app?.querySelector(selector);if(!nav)continue;nav.classList.add('modern-section-nav');nav.parentElement.classList.add('modern-has-section-nav');nav.setAttribute('aria-label','세부 화면 선택');[...nav.querySelectorAll('button')].forEach((button,index)=>{if(names[index]){button.textContent=names[index];button.setAttribute('aria-label',names[index]);}});}
    styleWorkspaces();window.dispatchEvent(new CustomEvent('aiderlog-site-editionchange',{detail:{edition:'modern'}}));
    return 'modern';
  }
  // Compatibility hook for older saved shortcuts/extensions; it cannot restore
  // a retired layout.
  window.AiderLogSiteEdition=Object.freeze({get:()=> 'modern',set:apply});
  apply();
})();
