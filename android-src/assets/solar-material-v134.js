(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const core=()=>$('#wheelCore');
  let activePointer=null;

  function removeLegacySizing(root=document){
    $$('[data-font-base-v133]',root).forEach(node=>{
      node.style.removeProperty('font-size');
      delete node.dataset.fontBaseV133;
    });
  }

  function syncTypography(){
    removeLegacySizing();
  }

  function clearStars(immediate=false){
    const node=core();if(!node)return;
    activePointer=null;
    node.classList.remove('stellar-hold-v134');
    if(immediate){node.classList.remove('stellar-release-v134');$$('.wheel-hold-star-v134',node).forEach(star=>star.remove());return}
    node.classList.add('stellar-release-v134');
    setTimeout(()=>{node.classList.remove('stellar-release-v134');$$('.wheel-hold-star-v134',node).forEach(star=>star.remove())},300);
  }

  function createStars(pointerId){
    const node=core();if(!node||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    clearStars(true);activePointer=pointerId;
    $$('.wheel-sparkle-v133,.wheel-burst-v126',node).forEach(effect=>effect.remove());
    const colors=['#fff','#f7e8a9','var(--theme-star)','color-mix(in srgb,var(--theme-accent) 68%,white)'];
    for(let index=0;index<30;index++){
      const distance=39+(index%6)*12+Math.random()*8;
      const angle=(188+(index/29)*92+Math.random()*5)*Math.PI/180;
      const star=document.createElement('i');
      star.className=`wheel-hold-star-v134 ${index%4===0?'dot':''}`;
      star.style.setProperty('--star-x',`${Math.cos(angle)*distance}px`);
      star.style.setProperty('--star-y',`${Math.sin(angle)*distance}px`);
      star.style.setProperty('--star-size',`${index%4===0?2.5+Math.random()*2:6+Math.random()*9}px`);
      star.style.setProperty('--star-delay',`${-Math.random()*1.5}s`);
      star.style.setProperty('--star-speed',`${.7+Math.random()*1.05}s`);
      star.style.setProperty('--star-color',colors[index%colors.length]);
      node.append(star);
    }
    node.classList.add('stellar-hold-v134');
  }

  function bindStellarHold(){
    const node=core();if(!node||node.dataset.stellarV134==='1')return;
    node.dataset.stellarV134='1';
    node.addEventListener('pointerdown',event=>{if(event.button!==undefined&&event.button!==0)return;createStars(event.pointerId)},{capture:true,passive:true});
    const finish=event=>{if(activePointer==null||event.pointerId===activePointer)clearStars(false)};
    node.addEventListener('pointerup',finish,{capture:true,passive:true});
    node.addEventListener('pointercancel',finish,{capture:true,passive:true});
    node.addEventListener('lostpointercapture',finish,{capture:true,passive:true});
    if(new URLSearchParams(location.search).get('wheel')==='pressed')createStars(-1);
  }

  function syncThemeChrome(){
    const meta=$('meta[name="theme-color"]');
    const theme=getComputedStyle(document.documentElement);
    const color=theme.getPropertyValue('--app-space-base').trim()||theme.getPropertyValue('--cosmos-base').trim();
    if(meta&&color)meta.content=color;
  }

  function refresh(){const node=core();if(node)$$('.wheel-sparkle-v133,.wheel-burst-v126',node).forEach(effect=>effect.remove());bindStellarHold();syncTypography();syncThemeChrome()}
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;refresh()})};
  new MutationObserver(records=>{
    if(records.some(record=>record.type==='attributes'||record.addedNodes.length))queue();
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-app-font-size','data-theme']});
  addEventListener('blur',()=>clearStars(false));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)clearStars(false)});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
