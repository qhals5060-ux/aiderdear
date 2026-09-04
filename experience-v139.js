/* AiderLog v139 · stable workspace entries and deliberately lean record sheets */
(function(){
  'use strict';

  function refineRenderedUI(scope=document){
    scope.querySelectorAll?.('.event-form-intro-v113,.event-form-section-title-v113 span').forEach(node=>node.remove());
    scope.querySelectorAll?.('.event-empty-v111').forEach(node=>{
      const text=node.textContent.trim();
      if(text.startsWith('+')||text.startsWith('＋'))node.textContent=text.slice(1).trim();
    });
  }

  document.addEventListener('click',event=>{
    const entry=event.target.closest?.('[data-my128-open]');
    if(!entry)return;
    const api=window.AiderLogMyV128;
    if(!api?.open)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    api.open(entry.dataset.my128Open);
  },true);

  let queued=false;
  const refresh=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;refineRenderedUI();});
  };
  new MutationObserver(refresh).observe(document.documentElement,{subtree:true,childList:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refineRenderedUI,{once:true}):refineRenderedUI();
})();
