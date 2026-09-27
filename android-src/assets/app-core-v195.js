/* v195: original Schedule layout; tools live in the wheel and Weekly uses a swipe. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const pages=[['home','SCHEDULE','일정'],['routine','ROUTINE','루틴'],['event','EVENT','이벤트'],['fifth','PAPER','논문']];
  const allowed=new Set([...pages.map(([id])=>id),'personal','todo']);
  const current=()=>$('.views>.view.on')?.id||'home';
  function refresh(){
    window.AiderWheelbarV176?.refresh();
    const title=$('#personal .page-title');if(title&&title.textContent!=='금융 · 워크플로우')title.textContent='금융 · 워크플로우';
    const planet=$('#wheelCore');if(planet){if(current()==='home')planet.setAttribute('aria-current','page');else planet.removeAttribute('aria-current');}
  }
  function openTools(category='finance'){
    personalCategory=category==='workflow'?'workflow':'finance';personalOverview=false;personalPomodoro=false;
    go('personal',false,true);refresh();
  }
  const previousGo=go;
  go=function(id,showIntro=false,preserveSub=false){
    id={schedule:'home',private:'routine',record:'event',paper:'fifth'}[id]||id;
    if(!allowed.has(id))id='home';
    if(id==='home')window.AiderScheduleUIV184?.setWeekly(false);
    if(id==='personal'){personalCategory=['finance','workflow'].includes(personalCategory)?personalCategory:'finance';preserveSub=true;}
    const result=previousGo.call(this,id,false,preserveSub);refresh();return result;
  };
  // Swipe left from the month to Weekly, and right from Weekly to the month.
  // Non-passive move handlers claim horizontal motion before WebView scrolling.
  // A horizontal gesture changes views only after deliberate movement. Forms,
  // controls, horizontal scrollers and active overlays keep their gestures.
  let gesture=null,suppressUntil=0;
  function blocked(target){
    if([...document.querySelectorAll('[role="dialog"][aria-modal="true"],.overlay.on,.modal.on,.intro.on,dialog[open],.event-editor-overlay-v111,.personal-tool-overlay-v127,.workflow-editor-v127')].some(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none'))return true;
    if(target.closest('input,textarea,select,button:not([data-schedule-date-v125]):not([data-week-add-v184]):not([data-week-event-v184]),a,[contenteditable="true"],canvas,iframe,#wheel'))return true;
    for(let el=target;el&&el!==document.body;el=el.parentElement){if(el.scrollWidth>el.clientWidth+3&&/auto|scroll/.test(getComputedStyle(el).overflowX))return true;}
    return false;
  }
  function begin(x,y,id,target){gesture=null;if(current()!=='home'||blocked(target))return;gesture={x,y,id,page:current(),at:Date.now()};}
  function move(event,x,y,id){if(!gesture||gesture.id!==id)return;const dx=x-gesture.x,dy=y-gesture.y;if(Math.abs(dy)>18&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}if(Math.abs(dx)>18&&Math.abs(dx)>Math.abs(dy)*1.7&&event.cancelable)event.preventDefault();}
  function end(event,x,y,id){const g=gesture;gesture=null;if(!g||g.id!==id||current()!==g.page||Date.now()-g.at>1100)return;const dx=x-g.x,dy=y-g.y;if(Math.abs(dx)<70||Math.abs(dy)>Math.abs(dx)*.4)return;if(event.cancelable)event.preventDefault();suppressUntil=Date.now()+400;if(g.page==='home')window.AiderScheduleUIV184?.setWeekly(dx<0);}
  window.addEventListener('touchstart',e=>{if(e.touches.length!==1){gesture=null;return;}const t=e.touches[0];begin(t.clientX,t.clientY,t.identifier,e.target);},{capture:true,passive:true});
  window.addEventListener('touchmove',e=>{if(e.touches.length!==1){gesture=null;return;}const t=e.touches[0];if(t)move(e,t.clientX,t.clientY,t.identifier);},{capture:true,passive:false});
  window.addEventListener('touchend',e=>{const t=e.changedTouches[0];if(t)end(e,t.clientX,t.clientY,t.identifier);},{capture:true,passive:false});
  window.addEventListener('touchcancel',()=>{gesture=null;},{passive:true});
  window.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch'&&e.button===0)begin(e.clientX,e.clientY,e.pointerId,e.target);},{capture:true,passive:true});
  window.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')move(e,e.clientX,e.clientY,e.pointerId);},{capture:true,passive:false});
  window.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')end(e,e.clientX,e.clientY,e.pointerId);},{capture:true,passive:false});
  window.addEventListener('pointercancel',()=>{gesture=null;},{capture:true,passive:true});
  window.addEventListener('click',e=>{if(e.detail&&Date.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
  let frame=0;function queue(){if(!frame)frame=requestAnimationFrame(()=>{frame=0;refresh();});}
  new MutationObserver(queue).observe($('.views'),{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);go(allowed.has(page)?page:'home',false);});
  const shell=window.AiderLogAppShell;
  if(shell){const open=shell.openTarget;shell.openTarget=function(target,action){
    if(String(action||'').startsWith('aiderlog://auth'))return open?.apply(this,arguments);
    if(['personal','finance','workflow'].includes(target)){openTools(target);return;}
    if(['paper','fifth'].includes(target)){go('fifth',false);return;}
    if(!['','schedule','home','private','routine','record','event','todo'].includes(String(target||''))){go('home',false);return;}
    return open?.apply(this,arguments);
  };}
  if(shell){const previousBack=shell.handleBack;shell.handleBack=function(){
    const modal=[...document.querySelectorAll('[role=dialog][aria-modal=true],dialog[open],.intro.on,.modal.on')].some(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none');
    if(current()==='home'&&window.AiderScheduleUIV184?.isWeekly()&&!modal&&!$('#wheel')?.classList.contains('open')){window.AiderScheduleUIV184.setWeekly(false);return true;}
    return previousBack?.apply(this,arguments)||false;
  };}
  window.AiderCoreV195=Object.freeze({openTools,refresh,pages:pages.map(([id])=>id)});
  go(current()==='personal'?'home':current(),false);
})();
