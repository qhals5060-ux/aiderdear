(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const params=new URLSearchParams(location.search);
  let typeQueued=false;

  function detectLayout(){
    const forced=params.get('device');
    const ua=navigator.userAgent||'';
    const width=Math.min(innerWidth,innerHeight),wide=Math.max(innerWidth,innerHeight);
    let layout='phone';
    if(forced==='flip')layout='flip';
    else if(forced==='fold')layout='fold-open';
    else if(/SM-F7\d/i.test(ua))layout='flip';
    else if(/SM-F9\d/i.test(ua))layout=innerWidth>=600?'fold-open':'fold-cover';
    else if(innerWidth>=600&&innerWidth/innerHeight>.68)layout='fold-open';
    else if(wide/width>=2.05)layout='flip';
    document.documentElement.dataset.deviceLayout=layout;
    document.documentElement.style.setProperty('--device-inline',`${innerWidth}px`);
  }

  function scaleScope(scope=document){
    const mode=document.documentElement.dataset.appFontSize||'normal';
    const scale={small:.84,normal:1,large:1.22}[mode]||1;
    document.documentElement.style.setProperty('--app-font-multiplier',String(scale));
    $$('aiderlog-language-lab',scope).forEach(host=>host.style.setProperty('--app-font-multiplier',String(scale)));
  }

  function queueType(){if(typeQueued)return;typeQueued=true;requestAnimationFrame(()=>{typeQueued=false;scaleScope()})}

  function burst(core){
    if(!core||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    $$('.wheel-sparkle-v133',core).forEach(node=>node.remove());
    const colors=['#ffffff','var(--theme-star)','var(--theme-accent)','#ffe9a8'];
    for(let i=0;i<18;i++){
      const angle=(-165+i*19+Math.random()*8)*Math.PI/180,distance=38+Math.random()*48;
      const node=document.createElement('i');
      node.className=`wheel-sparkle-v133 ${i%3===0?'diamond':''}`;
      node.style.setProperty('--spark-x',`${Math.cos(angle)*distance}px`);
      node.style.setProperty('--spark-y',`${Math.sin(angle)*distance}px`);
      node.style.setProperty('--spark-size',`${4+Math.random()*7}px`);
      node.style.setProperty('--spark-time',`${540+Math.random()*310}ms`);
      node.style.setProperty('--spark-delay',`${Math.random()*90}ms`);
      node.style.setProperty('--spark-color',colors[i%colors.length]);
      core.append(node);setTimeout(()=>node.remove(),1100);
    }
  }

  function bindWheel(){
    const core=$('#wheelCore');if(!core||core.dataset.sparkleV133==='1')return;
    core.dataset.sparkleV133='1';
    core.addEventListener('pointerdown',()=>burst(core),{passive:true});
    core.addEventListener('click',()=>{if(!core.querySelector('.wheel-sparkle-v133'))burst(core)},{passive:true});
  }

  function ensureDisplaySettingsButton(){
    const tools=$('.masthead .tools')||$('.top .tools');
    if(!tools||tools.querySelector('[data-display-settings-v133]'))return;
    const button=document.createElement('button');button.type='button';button.className='iconbtn global-icon-button-v126';button.dataset.displaySettingsV133='1';button.setAttribute('aria-label','화면 설정');
    button.innerHTML='<svg class="global-svg-icon-v126" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18"/></svg>';
    button.addEventListener('click',event=>{event.preventDefault();window.AiderLogThemeV125?.openSettings?.()});
    tools.insertBefore(button,tools.lastElementChild||null);
  }

  function syncSystemTheme(){
    if(document.documentElement.dataset.theme!=='system')return;
    const meta=$('meta[name="theme-color"]');
    if(meta)meta.content=getComputedStyle(document.documentElement).getPropertyValue('--theme-background').trim()||'#f8f7fc';
  }

  function decorate(){detectLayout();bindWheel();ensureDisplaySettingsButton();syncSystemTheme();queueType()}
  const observer=new MutationObserver(records=>{
    if(records.some(record=>record.type==='attributes'&&['data-app-font-size','data-theme'].includes(record.attributeName)))queueType();
    if(records.some(record=>record.addedNodes.length))queueType();
    bindWheel();ensureDisplaySettingsButton();
  });
  observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-app-font-size','data-theme']});
  addEventListener('resize',detectLayout,{passive:true});
  matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change',syncSystemTheme);
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',decorate,{once:true}):decorate();
})();
