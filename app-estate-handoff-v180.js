/* The app's Estate shortcut opens the existing site, never copies credentials. */
(() => {
  'use strict';
  const url=new URL(location.href);
  if(url.searchParams.get('open')!=='estate'||window.AiderLogNative||window.Android||document.documentElement.classList.contains('aiderlog-android'))return;
  const allowed=new Set(['qhals5060@gmail.com','abckms5698@naver.com']);
  let complete=false,queued=false,boundApi=null;
  function attempt(){
    queued=false;if(complete)return;
    const user=window.AiderDearFirebase?.getState?.()?.user;
    if(!user?.uid||!allowed.has(String(user.email||'').trim().toLowerCase()))return;
    const tab=document.querySelector('.tab[data-tab="estate"]');
    if(!tab||tab.hidden||tab.disabled)return;
    tab.click();
    if(document.querySelector('#app')?.dataset.activeTab!=='estate')return;
    complete=true;observer?.disconnect();
    const next=new URL(location.href);next.searchParams.delete('open');
    history.replaceState(history.state,'',next.pathname+next.search+next.hash);
  }
  function queue(){if(!queued&&!complete){queued=true;requestAnimationFrame(attempt);}}
  const tab=document.querySelector('.tab[data-tab="estate"]');
  const observer=tab?new MutationObserver(queue):null;
  observer?.observe(tab,{attributes:true,attributeFilter:['hidden','disabled']});
  function bind(){const api=window.AiderDearFirebase;if(api&&boundApi!==api){boundApi=api;api.subscribe?.(queue);}queue();}
  window.addEventListener('aiderdear-firebase-ready',bind);
  window.addEventListener('aiderdear-firebase-state',queue);
  window.addEventListener('pageshow',bind);
  bind();
})();
