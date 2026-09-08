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
    const insight=document.querySelector('.page-dots [data-page="1"]');
    // Editorial keeps its original dot artwork; its accessible name still changes.
    label(insight,'인사이트',{visible:html.classList.contains('modern-site')||Boolean(insight?.textContent.trim())});
    const choice=document.querySelector('.modern-header-page-select');
    if(choice?.dataset.menu==='schedule')for(const option of choice.options){if(option.value==='1'&&option.textContent!=='인사이트')option.textContent='인사이트';}
    label(document.getElementById('emotionInsightPage'),'인사이트',{visible:false});
    for(const [id,text,aria]of [['addScheduleTop','+ 일정','일정 등록'],['addEmotionTop','+ 감정','감정 기록']]){
      const control=document.getElementById(id);if(!control)continue;
      if(control.textContent!==text)control.textContent=text;
      if(control.getAttribute('aria-label')!==aria)control.setAttribute('aria-label',aria);
    }
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
