/* Site presentation only. Keep calendar/media nodes, listeners and stored records intact. */
(() => {
  'use strict';
  const html=document.documentElement;
  const native=()=>Boolean(window.AiderLogNative||window.Android||html.classList.contains('aiderlog-android')
    ||new URLSearchParams(location.search).has('android-preview'));
  if(window.AiderLogSiteCalendarV172||native())return;
  const app=document.getElementById('app'),page=document.getElementById('page0');
  if(!app||!page||!document.getElementById('calendar'))return;
  // The existing calendar, photo controls and insights live in the light DOM.
  // Do not inject this layout into unrelated Paper/Language shadow roots.
  html.classList.add('site-calendar-v172');
  let frame=0;
  function label(node,text,{visible=true}={}){
    if(!node)return;
    if(visible&&node.textContent!==text)node.textContent=text;
    if(node.getAttribute('aria-label')!==text)node.setAttribute('aria-label',text);
  }
  function refresh(){
    frame=0;if(native())return;
    document.getElementById('addScheduleTop')?.remove();
    document.getElementById('addEmotionTop')?.remove();
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(refresh);}
  // Only label sources matter. Rendering calendar cells or moving unrelated
  // controls must not create another layout/MutationObserver feedback loop.
  new MutationObserver(records=>{
    if(records.some(({target})=>target.matches?.('.page-dots,.modern-header-page-select')
      ||target.closest?.('.page-dots,.modern-header-page-select')))schedule();
  }).observe(app,{childList:true,subtree:true});
  addEventListener('aiderlog-site-editionchange',schedule);
  window.AiderLogSiteCalendarV172=Object.freeze({refresh});
  refresh();
})();
