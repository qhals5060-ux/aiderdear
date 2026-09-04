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

  function languageTypeStyle(host){
    const root=host?.shadowRoot;if(!root)return;
    removeLegacySizing(root);
    let style=root.querySelector('style[data-solar-type-v134]');
    if(!style){style=document.createElement('style');style.dataset.solarTypeV134='1';root.append(style)}
    style.textContent=`
      :host{--lab-xs:var(--type-xs,11px);--lab-sm:var(--type-sm,12px);--lab-md:var(--type-md,14px);--lab-lg:var(--type-lg,17px)}
      :is(button,input,select,textarea,label,p,small,span,em){line-height:1.42}
      .day-index :is(b,small),.day-info :is(b,p,small),.day-action,.category-tab :is(b,small),.scenario-tab :is(b,small,em),.scenario-main>p,.scenario-progress-box :is(div,b),.records-header-actions button,.streak-chip,.records-button{font-size:var(--lab-xs)!important}
      .section-heading-row strong,.quiz-prompt,.choice-button,.lesson-coach-card :is(b,p),.expression-expansion li :is(b,span){font-size:var(--lab-sm)!important}
      .scenario-line h3,.page-intro h2{font-size:var(--lab-lg)!important}
      .learning-section .day-row .day-index{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:center!important;text-align:left!important;padding-left:12px!important;overflow:hidden!important}
      .learning-section .day-row .day-index>b,.learning-section .day-row .day-index>small{position:static!important;left:auto!important;right:auto!important;align-self:flex-start!important;justify-self:start!important;width:100%!important;margin:0!important;padding:0!important;translate:none!important;transform:none!important;text-align:left!important;max-width:100%!important}
      :is(.day-row,.scenario-tab,.category-tab){height:auto!important}
      .day-row{min-height:calc(var(--lab-sm) * 5.5)!important}
      @media(max-width:640px){.single-page{height:auto!important;min-height:calc(100dvh - 132px)!important;overflow-y:auto!important}.day-list{grid-template-columns:1fr!important}.course-panel{height:auto!important;min-height:620px!important}}
      :host-context(html[data-app-font-size="large"]) .single-page{overflow-y:auto!important}
      :host-context(html[data-app-font-size="large"]) .day-list{grid-template-columns:1fr!important;grid-template-rows:none!important}
      :host-context(html[data-app-font-size="large"]) .day-row{grid-template-columns:82px minmax(0,1fr) 72px!important}
      :host-context(html[data-app-font-size="large"]) .learning-section .day-row .day-index{padding-left:9px!important}
      :host-context(html[data-app-font-size="large"]) .course-panel{min-height:680px!important}
    `;
    root.append(style);
  }

  function syncTypography(){
    removeLegacySizing();
    $$('aiderlog-language-lab').forEach(languageTypeStyle);
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
    const color=getComputedStyle(document.documentElement).getPropertyValue('--cosmos-base').trim();
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
