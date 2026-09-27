(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  let activePointer=null;
  let selectedWidget='split';
  let selectedSize='medium';

  const themeToWidget={
    system:'aurora',sun:'sunset',mercury:'mono',venus:'sunset',earth:'mint',mars:'rose',
    jupiter:'sunset',saturn:'lavender',uranus:'mint',neptune:'ocean',pluto:'mono'
  };

  function makeHologram(core){
    let field=$('.wheel-holo-field-v135',core);
    if(field)return field;
    field=document.createElement('div');
    field.className='wheel-holo-field-v135';
    field.setAttribute('aria-hidden','true');
    field.innerHTML='<span class="wheel-holo-aura-v135"></span>';
    const orbitSpecs=[
      ['132px','74px','-18deg','3.8s','rgba(150,239,255,.72)'],
      ['112px','104px','24deg','5.2s','rgba(226,184,255,.58)'],
      ['154px','46px','7deg','6.4s','rgba(255,230,156,.52)']
    ];
    orbitSpecs.forEach(spec=>{
      const ring=document.createElement('b');ring.className='wheel-holo-orbit-v135';
      ring.style.setProperty('--holo-w',spec[0]);ring.style.setProperty('--holo-h',spec[1]);
      ring.style.setProperty('--holo-r',spec[2]);ring.style.setProperty('--holo-s',spec[3]);ring.style.setProperty('--holo-c',spec[4]);field.append(ring);
    });
    const glints=[[-44,-29,25,-16,1.7,-.3],[43,-31,18,18,2.1,-1.1],[-58,24,22,12,1.5,-.8],[53,32,29,-22,2.4,-1.5],[-7,-59,17,74,1.9,-.4],[9,61,21,104,2.25,-1.2],[66,2,16,-7,1.35,-.7]];
    glints.forEach(([x,y,l,r,s,d])=>{
      const glint=document.createElement('i');glint.className='wheel-holo-glint-v135';
      glint.style.setProperty('--glint-x',`${x}px`);glint.style.setProperty('--glint-y',`${y}px`);
      glint.style.setProperty('--glint-l',`${l}px`);glint.style.setProperty('--glint-r',`${r}deg`);
      glint.style.setProperty('--glint-s',`${s}s`);glint.style.setProperty('--glint-d',`${d}s`);field.append(glint);
    });
    core.append(field);return field;
  }

  function clearLegacy(core){$$('.wheel-hold-star-v134,.wheel-sparkle-v133,.wheel-burst-v126',core).forEach(node=>node.remove())}
  function startHologram(event){
    const core=event.currentTarget;if(event.button!==undefined&&event.button!==0)return;
    activePointer=event.pointerId;clearLegacy(core);makeHologram(core);core.classList.add('holo-hold-v135');
    requestAnimationFrame(()=>clearLegacy(core));
  }
  function stopHologram(event){
    const core=event.currentTarget;if(activePointer!==null&&event.pointerId!==undefined&&event.pointerId!==activePointer)return;
    activePointer=null;core.classList.remove('holo-hold-v135');clearLegacy(core);
  }
  function bindWheel(){
    const core=$('#wheelCore');if(!core||core.dataset.holoV135==='1')return;
    core.dataset.holoV135='1';makeHologram(core);
    core.addEventListener('pointerdown',startHologram,{capture:true,passive:true});
    core.addEventListener('pointerup',stopHologram,{capture:true,passive:true});
    core.addEventListener('pointercancel',stopHologram,{capture:true,passive:true});
    core.addEventListener('lostpointercapture',stopHologram,{capture:true,passive:true});
    if(new URLSearchParams(location.search).get('wheel')==='pressed'){core.classList.add('holo-hold-v135');setTimeout(()=>clearLegacy(core),0)}
  }

  function decoratePostcard(){
    const card=$('.insight-letter-card-v132');if(!card||$('.insight-postcard-art-v135',card))return;
    const art=document.createElement('div');art.className='insight-postcard-art-v135';art.setAttribute('aria-hidden','true');
    const summary=$('.insight-letter-summary-v132',card);card.insertBefore(art,summary);
  }
  function bindInsightExit(){
    const button=$('#introView');if(!button||button.dataset.exitV135==='1')return;
    button.dataset.exitV135='1';
    button.addEventListener('click',event=>{
      event.preventDefault();event.stopImmediatePropagation();
      const modal=$('#intro');if(!modal||modal.classList.contains('letter-exit-v135'))return;
      modal.classList.add('letter-exit-v135');
      const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(()=>{
        modal.classList.remove('on','letter-exit-v135');
        if(typeof go==='function')go('insights',false);else location.hash='insights';
      },reduced?40:1210);
    },true);
  }

  function widgetMarkup(){
    return `<section class="settings-section-v125 widget-settings-v135" data-widget-settings-v135>
      <header><h3>홈 화면 캘린더 위젯</h3></header>
      <div class="widget-choice-grid-v135" role="group" aria-label="위젯 구성">
        <button type="button" class="widget-choice-v135" data-widget-layout="agenda" aria-pressed="false"><i></i><b>일정 스트립</b><small>오늘과 예정 일정</small></button>
        <button type="button" class="widget-choice-v135" data-widget-layout="month" aria-pressed="false"><i></i><b>월간 달력</b><small>달력 중심 구성</small></button>
        <button type="button" class="widget-choice-v135" data-widget-layout="split" aria-pressed="true"><i></i><b>달력 + 일정</b><small>분할형 구성</small></button>
      </div>
      <div class="widget-size-row-v135">
        <span>기본 크기</span>
        <div class="widget-size-tabs-v135" role="group" aria-label="위젯 크기">
          <button type="button" data-widget-size="small" aria-pressed="false">작게</button>
          <button type="button" data-widget-size="medium" aria-pressed="true">보통</button>
          <button type="button" data-widget-size="large" aria-pressed="false">넓게</button>
        </div>
        <button type="button" class="widget-pin-v135" data-widget-pin-v135>홈 화면에 추가</button>
      </div>
      <p class="widget-status-v135" data-widget-status-v135>추가한 뒤 홈 화면에서 가로·세로 크기를 다시 조절할 수 있어요.</p>
    </section>`;
  }
  function decorateSettings(){
    const dialog=$('.settings-v125>section');if(!dialog)return;
    $$('.theme-card-v125>small,.font-card-v133>small',dialog).forEach(node=>node.remove());
    $$('.settings-section-v125>header>span',dialog).forEach(node=>node.remove());
    $('.settings-head-v125 p',dialog)?.remove();
    if(!$('[data-widget-settings-v135]',dialog))dialog.insertAdjacentHTML('beforeend',widgetMarkup());
  }
  function setWidgetStatus(message){const node=$('[data-widget-status-v135]');if(node)node.textContent=message}
  function selectWidgetButton(button){
    selectedWidget=button.dataset.widgetLayout;
    $$('[data-widget-layout]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));
  }
  function selectSizeButton(button){
    selectedSize=button.dataset.widgetSize;
    $$('[data-widget-size]').forEach(node=>node.setAttribute('aria-pressed',String(node===button)));
  }
  function pinWidget(){
    const bridge=window.AiderLogNative;
    if(typeof bridge?.pinCalendarWidget==='function'){
      try{
        const accepted=bridge.pinCalendarWidget(`${selectedWidget}:${selectedSize}`);
        setWidgetStatus(accepted?'홈 화면의 위젯 추가 확인창을 열었어요.':'기기 설정에서 위젯 고정이 허용되지 않았어요. 홈 화면의 위젯 목록에서 AiderLog를 선택해주세요.');
      }catch(_){setWidgetStatus('홈 화면의 위젯 목록에서 AiderLog를 선택해주세요.')}
    }else if(new URLSearchParams(location.search).get('android-preview')==='1'){
      setWidgetStatus(`미리보기: ${selectedWidget==='month'?'월간 달력':selectedWidget==='agenda'?'일정 스트립':'달력 + 일정'} · ${selectedSize==='small'?'작게':selectedSize==='large'?'넓게':'보통'} 구성을 선택했어요.`);
    }else setWidgetStatus('최신 Android 앱에서 홈 화면 추가 기능을 사용할 수 있어요.');
  }

  function syncWidgetTheme(){
    const theme=document.documentElement.dataset.theme||'system';
    const mapped=themeToWidget[theme]||'aurora';
    if(document.documentElement.dataset.alTheme!==mapped){
      document.documentElement.dataset.alTheme=mapped;
      window.AiderLogAppShell?.syncWidgets?.();
    }
  }

  document.addEventListener('click',event=>{
    const layout=event.target.closest('[data-widget-layout]');if(layout){selectWidgetButton(layout);return}
    const size=event.target.closest('[data-widget-size]');if(size){selectSizeButton(size);return}
    if(event.target.closest('[data-widget-pin-v135]'))pinWidget();
  });
  addEventListener('blur',()=>{const core=$('#wheelCore');if(core)stopHologram({currentTarget:core})});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){const core=$('#wheelCore');if(core)stopHologram({currentTarget:core})}});

  let queued=false;
  function refresh(){queued=false;bindWheel();decoratePostcard();decorateSettings();bindInsightExit();syncWidgetTheme()}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(refresh)}
  new MutationObserver(records=>{
    if(records.some(record=>record.addedNodes.length||record.type==='attributes'))queue();
  }).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-theme','class']});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
