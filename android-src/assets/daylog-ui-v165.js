/* DayLog presentation only. Existing renderers, metrics, form IDs, media loader,
   delegated actions and save engines remain the authoritative implementation. */
(function () {
  'use strict';
  const $ = (s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const root=$('#personal'); if(!root || typeof renderPersonal!=='function') return;
  const scrollByCategory=new Map(); let renderedCategory='',lastTrigger=null,toolWasOpen=false;
  root.classList.add('daylog-ui-v165');
  root.dataset.cssTypography='daylog165';
  function cssTypography(host){if(!host)return;host.dataset.cssTypography='daylog165';$$('[style]',host).forEach(e=>e.style.removeProperty('font-size'));}
  function text(el,value){if(el&&el.textContent!==value)el.textContent=value;}
  function labelInput(id,label){const input=$('#'+id);if(!input||input.closest('label'))return;const wrap=document.createElement('label');wrap.htmlFor=id;wrap.append(document.createTextNode(label));input.before(wrap);wrap.append(input);}
  function surface(html){const t=document.createElement('template');t.innerHTML=html;return t.content;}

  // Preserve the private-media lookup marker. Missing photos are not decorative assets.
  const oldPhoto=itemPhoto;
  itemPhoto=function(row,cls){const dom=surface(oldPhoto(row,cls)),host=dom.firstElementChild;
    if(host){host.dataset.daylogPhoto='1';host.dataset.photoState=row.localImage?'ready':row.media?.fileId?'loading':'empty';
      const img=$('img',host);if(img)img.alt=row.category==='reading'?'업로드한 책 표지':'업로드한 기록 사진';
      else text($('span',host),row.media?.fileId?'사진 불러오는 중':row.category==='reading'?'표지 없음':'사진 없음');}
    const div=document.createElement('div');div.append(dom);return div.innerHTML;};
  const oldHydrate=hydratePersonalMedia;
  hydratePersonalMedia=async function(){const result=await oldHydrate.apply(this,arguments);
    $$('[data-daylog-photo][data-pmedia]').forEach(host=>{const img=$('img',host);if(img){host.dataset.photoState='ready';img.alt=host.className.includes('cover')?'업로드한 책 표지':'업로드한 기록 사진';}
      else if(typeof fb!=='undefined'&&fb?.readPrivateMedia){host.dataset.photoState='error';text($('span',host),'사진을 불러오지 못했습니다');}});return result;};
  document.addEventListener('error',event=>{const img=event.target;if(img?.tagName!=='IMG'||!img.closest('[data-daylog-photo]'))return;const host=img.parentElement;host.dataset.photoState='error';img.remove();const span=document.createElement('span');span.textContent='사진을 불러오지 못했습니다';host.replaceChildren(span);},true);

  function decorateHealth(dashboard){
    const health=$('.personal-health',dashboard);if(!health)return;
    const tools=$('.personal-health-tools-v127',dashboard),sections=$$('.personal-panel',health),meal=sections[0],exercise=sections[1];
    const toolbar=document.createElement('div');toolbar.className='daylog-toolbar-v165';
    const date=document.createElement('h2');date.textContent=typeof today==='function'?today().replaceAll('-','. '):'건강 기록';toolbar.append(date);
    const add=$('[data-health="meal"]',meal);if(add){text(add,'+ 기록');toolbar.append(add);}dashboard.prepend(toolbar);
    if(tools){tools.classList.add('daylog-health-tools-v165');$$('button>span',tools).forEach(e=>e.remove());text($('button:first-child>b',tools),'30일 챌린지');}
    text($('h3',meal),'오늘의 식사');text($('h3',exercise),'운동 기록');
    $$('.meal-slot',meal).forEach(button=>{const pic=$('.meal-pic',button),name=$('b',button),small=$('small',button);if(name&&pic)button.prepend(name);
      if(!button.classList.contains('filled')){pic?.remove();text(small,button.dataset.meal==='snack'?'+ 간식 기록':'+ 식사 기록');button.classList.add('daylog-empty-meal-v165');}
      else if(small){const value=small.textContent,at=value.lastIndexOf(' · ');if(at>=0){small.textContent=value.slice(0,at);const rating=document.createElement('span');rating.className='daylog-rating-v165';rating.textContent=value.slice(at+3);button.append(rating);}}});
    // Move the existing history, never clone its controls or reorder its records.
    const history=$('.health-history',meal);if(history){history.classList.add('personal-panel','daylog-meal-history-v165');health.append(history);}
  }
  function decorateReading(dashboard){
    text($('.reading-hero-v113 h2',dashboard),'나의 독서');$('.reading-hero-v113 p',dashboard)?.remove();
    const rows=typeof pRows==='function'?pRows('reading'):[];
    // Old renderer contains demo-only fallbacks. Empty accounts must show no invented books.
    if(!rows.length){$$('.reading-metrics-v113 b',dashboard).forEach(e=>text(e,'0'));
      const current=$('.reading-featured-v113',dashboard),shelf=$('.reading-books-v113',dashboard),quotes=$('.reading-quote-list-v113',dashboard);
      for(const [el,message] of [[current,'아직 저장된 책이 없습니다.'],[shelf,'책 기록을 추가해보세요.'],[quotes,'아직 저장된 문장이 없습니다.']]){if(el){el.replaceChildren();const p=document.createElement('p');p.className='personal-empty';p.textContent=message;el.append(p);}}}
    else {const quotes=pRows('reading').filter(x=>x.details?.readingStatus!=='want'&&x.details?.quote).slice(0,3);
      if(!quotes.length){const host=$('.reading-quote-list-v113',dashboard);if(host)host.innerHTML='<p class="personal-empty">아직 저장된 문장이 없습니다.</p>';const metrics=$$('.reading-metrics-v113 b',dashboard);text(metrics[2],'0');}
      // Correct only legacy fallback literals when the actual aggregate is zero.
      const read=rows.filter(x=>x.details?.readingStatus!=='want'),metrics=$$('.reading-metrics-v113 b',dashboard);
      if(!read.length)text(metrics[0],'0');if(read.reduce((n,r)=>n+(+r.details?.currentPage||0),0)===0)text(metrics[3],'0');}
    text($('.reading-metrics-v113 article:nth-child(3) span',dashboard),'기억한 문장');
    text($('.reading-current-v113 h3',dashboard),'지금 읽는 책');text($('.reading-quotes-v113 h3',dashboard),'남겨둔 문장');
  }
  function decorateWorkflow(dashboard){const panel=$('.workflow-panel-v127',dashboard);if(!panel)return;text($('header h3',panel),'나의 워크플로우');$('header p',panel)?.remove();
    const summary=document.createElement('div');summary.className='daylog-workflow-summary-v165';
    $$('.workflow-board>section>h4',panel).forEach(title=>{const part=document.createElement('span');part.textContent=title.textContent.replace(/(\D)(\d)/,'$1 $2');summary.append(part);});$('.workflow-board',panel)?.before(summary);
    $$('[data-workflow-row-v127]',panel).forEach(card=>{const steps=$$('[data-workflow-step-v127]',card);if(steps.length){const p=document.createElement('small');p.className='daylog-step-count-v165';p.textContent=`${steps.filter(e=>e.classList.contains('done')).length} / ${steps.length} 단계 완료`;$('.workflow-steps-v127',card)?.before(p);}});}
  function decorate(){
    const page=$('.personal-page',root),title=$('.personal-title',root),tabs=$('.personal-tabs',root),dashboard=$('.personal-dashboard',root);if(!page||!dashboard)return;
    text($('.page-title',title),'DayLog');if(tabs)title.after(tabs);
    [['[data-poverview]','통계'],['[data-ppomodoro]','집중']].forEach(([s,t])=>{const b=$(s,title);text($('span',b),t);b?.setAttribute('aria-label',t);});
    $$('[data-pcat]',tabs||root).forEach(b=>{b.setAttribute('aria-pressed',String(b.classList.contains('active')));$('i',b)?.setAttribute('aria-hidden','true');});
    dashboard.classList.add('daylog-content-v165');dashboard.setAttribute('tabindex','-1');
    decorateHealth(dashboard);decorateReading(dashboard);decorateWorkflow(dashboard);text($('.finance-grid',dashboard)?.parentElement?.querySelector('header h3'),'나의 금융 기록');
    $$('.personal-panel>header small,.reading-hero-v113 small',dashboard).forEach(e=>e.remove());
    $$('[data-pdelete]',dashboard).forEach(b=>b.setAttribute('aria-label','기록 삭제'));
    dashboard.scrollTop=scrollByCategory.get(personalCategory)||0;renderedCategory=personalCategory;
    decorateTools();
  }
  const previousRender=renderPersonal;
  renderPersonal=function(){const old=$('.personal-dashboard',root);if(old&&renderedCategory)scrollByCategory.set(renderedCategory,old.scrollTop);
    const result=previousRender.apply(this,arguments);decorate();return result;};
  function decorateTools(){const layer=$('.personal-tool-overlay-v127');
    if(!layer){if(toolWasOpen){toolWasOpen=false;const trigger=lastTrigger?.isConnected?lastTrigger:$('[data-'+(lastTrigger?.matches?.('[data-ppomodoro]')?'ppomodoro':'poverview')+']',root);trigger?.focus({preventScroll:true});}return;}
    toolWasOpen=true;layer.classList.add('daylog-tool-v165');layer.dataset.tool=personalPomodoro?'focus':'statistics';cssTypography(layer);
    const dialog=$(':scope>section',layer);dialog.setAttribute('aria-label',personalPomodoro?'집중 타이머':'DayLog 통계');
    if(personalOverview){const overview=$('.overview-dialog-v113',layer),head=$(':scope>header',overview);text($('h2',head),'DayLog 통계');$('small',head)?.remove();$('p',head)?.remove();
      $$('.overview-metrics-v113 i',layer).forEach(e=>e.remove());if(!$('.daylog-tool-body-v165',overview)){const body=document.createElement('div');body.className='daylog-tool-body-v165';Array.from(overview.children).filter(e=>e!==head).forEach(e=>body.append(e));overview.append(body);}}
    else{const page=$('.pomo-page',layer),oldHead=$('.pomo-page-head',page),close=$('[data-personal-tool-close-v127]',layer);const head=document.createElement('header');head.className='daylog-focus-head-v165';head.innerHTML='<h2>집중 타이머</h2>';if(close)head.append(close);oldHead?.replaceWith(head);
      const timer=$('.pomo-timer-v113',layer),task=$('label',timer),presets=$('.pomo-presets-v113',timer),clock=$('.pomo-clock-v113',timer);if(task&&presets&&clock){timer.prepend(task,presets,clock);}
      text($('#pomoStart',layer),pomoRunning?'일시정지':'시작');text($('#pomoReset',layer),'초기화');$$('.pomo-clock-v113 small,.pomo-history-v113 header small',layer).forEach(e=>e.remove());text($('.pomo-history-v113 h3',layer),'집중 기록');}
    dialog.tabIndex=-1; if(!layer.contains(document.activeElement))dialog.focus({preventScroll:true});
    setTimeout(hydratePersonalMedia,0);
  }
  function viewport(){const h=visualViewport?.height||innerHeight,t=visualViewport?.offsetTop||0;
    $$('#personalModal,.workflow-editor-v127,.daylog-tool-v165').forEach(e=>{e.style.setProperty('--daylog-viewport-height',h+'px');e.style.setProperty('--daylog-viewport-top',t+'px');});}
  function wrapForm(form){if(!form||$('.daylog-form-body-v165',form))return;const footer=$(':scope>footer',form)||document.createElement('footer');
    if(!footer.parentNode){const save=$(':scope>button[type="submit"]',form);const cancel=document.createElement('button');cancel.type='button';cancel.textContent='취소';cancel.dataset.workflowEditorCloseV127='';footer.append(cancel);if(save)footer.append(save);form.append(footer);}
    const body=document.createElement('div');body.className='daylog-form-body-v165';Array.from(form.children).filter(e=>e!==footer).forEach(e=>body.append(e));form.prepend(body);}
  function decorateForms(){const modal=$('#personalModal');if(modal&&!modal.dataset.daylog165){modal.dataset.daylog165='1';modal.classList.add('daylog-editor-v165');const box=$('.box',modal);box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-labelledby','personalModalTitle');box.tabIndex=-1;
      $('.personal-form-head small',modal)?.remove();labelInput('personalDate','날짜');labelInput('personalTitle','기록 제목');labelInput('personalNote','메모');wrapForm($('#personalForm'));cssTypography(modal);}
    if(modal?.classList.contains('on')){if(!modal.dataset.daylogWasOpen){modal.dataset.daylogWasOpen='1';$('.box',modal)?.focus({preventScroll:true});}
      if(typeof personalCategory!=='undefined'&&personalCategory==='health')text($('#personalModalTitle'),$('#pHealthType')?.value==='exercise'?'운동 기록 추가':'식사 기록 추가');}
    else if(modal?.dataset.daylogWasOpen){delete modal.dataset.daylogWasOpen;const b=lastTrigger?.isConnected?lastTrigger:$('[data-padd]',root);b?.focus({preventScroll:true});}
    $$('.workflow-editor-v127').forEach(layer=>{if(!layer.classList.contains('daylog-editor-v165')){layer.classList.add('daylog-editor-v165');cssTypography(layer);}wrapForm($('form',layer));$('header small',layer)?.remove();});viewport();}
  // One modal, no automatic keyboard: focus the dialog container, not an input.
  document.addEventListener('click',e=>{const trigger=e.target.closest?.('#personal [data-padd],#personal [data-poverview],#personal [data-ppomodoro],#personal [data-workflow-edit-v127]');if(trigger)lastTrigger=trigger;},true);
  document.addEventListener('keydown',e=>{const modal=$('#personalModal.on')||$('.workflow-editor-v127.on')||$('.daylog-tool-v165');if(!modal)return;
    if(e.key==='Tab'){const items=$$('button,input,select,textarea,[tabindex="0"]',modal).filter(n=>!n.disabled&&n.getClientRects().length);if(!items.length)return;const first=items[0],last=items.at(-1);if(e.shiftKey&&(document.activeElement===first||!items.includes(document.activeElement))){e.preventDefault();last.focus();}else if(!e.shiftKey&&(document.activeElement===last||!items.includes(document.activeElement))){e.preventDefault();first.focus();}}
    if(e.key==='Escape'){const close=$('#personalClose,[data-workflow-editor-close-v127],[data-personal-tool-close-v127],[data-personal-overview-close]',modal);close?.click();}});
  let scheduled=false;const queue=()=>{if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;decorateForms();});};
  new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='childList'||m.attributeName==='class'))queue();}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  $('#personalModal')?.addEventListener('change',queue);visualViewport?.addEventListener('resize',viewport);visualViewport?.addEventListener('scroll',viewport);addEventListener('resize',viewport);
  window.AiderLogDaylogV165={refresh:()=>{renderPersonal();decorateForms();},presentationOnly:true};
  renderPersonal();decorateForms();
})();
