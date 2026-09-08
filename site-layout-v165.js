/* Modern website layout: move live controls; never duplicate forms or save data. */
(() => {
  'use strict';
  if(window.AiderLogNative||document.documentElement.classList.contains('aiderlog-android'))return;
  const html=document.documentElement,app=document.querySelector('#app'),head=app?.querySelector('.masthead');
  if(!app||!head)return;
  const $=(selector,root=document)=>root?.querySelector(selector)||null;
  const modern=()=>html.classList.contains('modern-site');
  const moves=new Map(),created=new Set(),shadowRoots=new Map();
  let eventView='record';
  const drafts=new Map();let scheduled=0,applying=false;
  function move(node,parent,before=null){
    if(!node||!parent||node===before)return;
    if(!moves.has(node)){const marker=document.createComment('modern-v165-original-position');node.before(marker);moves.set(node,marker);}
    if(node.parentNode!==parent||(before&&node.nextSibling!==before))parent.insertBefore(node,before);
  }
  function make(tag,className,parent){const node=document.createElement(tag);node.className=className;parent.append(node);created.add(node);return node;}
  const dock=make('div','modern-header-pages',head),choice=document.createElement('select');
  choice.className='modern-header-page-select';choice.setAttribute('aria-label','현재 메뉴의 세부 화면');dock.append(choice);
  const groups=[['schedule','.page-dots',['캘린더','감정 인사이트']],['private','.private-page-dots',['루틴','어학']],['record','.record-page-dots',['Record','Archive','Travel']],['personal','.personal-page-dots',['개인 기록','통합 대시보드']],['task','.task-page-dots',['고객 관리','입시요강']]].map(([tab,selector,names])=>({tab,node:$(selector),names})).filter(row=>row.node);
  function currentEvent(){return $('.record-dot[data-record-page="0"]')?.classList.contains('active')?'record':eventView==='record'?'archive':eventView;}
  function selectEvent(view){eventView=['archive','travel'].includes(view)?view:'record';$(`.record-dot[data-record-page="${eventView==='record'?0:1}"]`)?.click();apply();}
  choice.addEventListener('change',()=>{if(app.dataset.activeTab==='record'){selectEvent(choice.value);return;}const group=groups.find(row=>row.tab===app.dataset.activeTab);group?.node.querySelectorAll('button')[Number(choice.value)]?.click();});
  function arrangeHeader(){
    move($('.tabs',app),head,$('.nav-tools',head));
    // The edition controller owns the original toolbar marker and Editorial restore.
    const tools=$('.nav-tools',app);if(tools&&tools.parentNode!==head)head.append(tools);
    if(head.lastElementChild!==dock)head.append(dock);
    const active=groups.find(row=>row.tab===app.dataset.activeTab);
    // Keep the live buttons attached between pointerdown and pointerup. Moving
    // every group directly before choice cycled all five nodes on every frame:
    // the observer scheduled apply again, and native mouse clicks were lost.
    // Place from right to left so an already-correct order does no DOM work.
    let anchor=choice;
    for(const group of [...groups].reverse()){move(group.node,dock,anchor);anchor=group.node;}
    for(const group of groups)group.node.hidden=group!==active||group.tab==='record';
    dock.classList.toggle('modern-event-pages',active?.tab==='record');
    dock.hidden=!active;
    if(active){
      const selected=[...active.node.querySelectorAll('button')].findIndex(button=>button.classList.contains('active'));
      if(choice.dataset.menu!==active.tab){choice.replaceChildren(...active.names.map((name,index)=>new Option(name,active.tab==='record'?name.toLowerCase():index)));choice.dataset.menu=active.tab;}
      choice.value=active.tab==='record'?currentEvent():String(Math.max(0,selected));
    }
    for(const selector of ['#quickMemoBtn','#mailboxBtn','#loginBtn','#todayJournalBtn']){const button=$(selector);if(button&&!button.getAttribute('aria-label'))button.setAttribute('aria-label',button.textContent.trim());}
  }
  function arrangeCalendar(){const page=$('#page0');move($('.cal-top',page),page,$('.frame',page));}
  function applyEvent(){
    eventView=currentEvent();
    $('#recordShell').hidden=false;$('#albumShell').hidden=false;
    $('#eventArchiveShell').hidden=eventView==='travel';$('#travelArchiveShell').hidden=eventView!=='travel';
    const sidebar=$('.record-aside');
    if(sidebar){
      let dialog=$('#modernRecordBrowserV167');
      if(!dialog){dialog=make('dialog','site-display-dialog modern-record-browser-dialog',app);dialog.id='modernRecordBrowserV167';dialog.setAttribute('aria-label','기록 찾아보기');const close=document.createElement('button');close.type='button';close.className='site-display-dialog-close';close.textContent='닫기';close.addEventListener('click',()=>dialog.close());dialog.append(close);dialog.addEventListener('click',event=>{if(event.target===dialog||event.target.closest('.record-month'))dialog.close();});}
      move(sidebar,dialog);
      if(!$('.modern-record-browse-open')){const button=make('button','modern-record-browse-open',$('.record-toolbar'));button.type='button';button.textContent='기록 찾아보기';button.addEventListener('click',()=>dialog.showModal());}
      if(dialog.open&&(app.dataset.activeTab!=='record'||eventView!=='record'))dialog.close();
    }
  }
  function arrangePersonal(){
    const frame=$('#personalMainShell>.personal-frame');if(!frame)return;
    let side=$('.modern-personal-navigation',frame);if(!side)side=make('aside','modern-personal-navigation',frame);
    move($('#personalCategoryTabs'),side);move($('.pomodoro-card',frame),side);
    const display=$('.pomodoro-mini-display',side);if(display&&!$('#pomodoroClock')){const clock=make('strong','modern-pomodoro-clock',display);clock.id='pomodoroClock';clock.textContent=String($('#pomodoroCustomMinutes')?.value||25).padStart(2,'0')+':00';clock.setAttribute('aria-label','남은 집중 시간');}
  }
  function arrangeWork(){const stage=$('#siteWorkStageV146'),workHead=$('.site-work-head-v146',stage);if(workHead)move($('.site-work-nav-v146',stage),workHead,workHead.firstElementChild);}
  function arrangeConsult(){
    if(document.getElementById('consultV167'))return;
    const rail=$('.consulting-client-rail'),actions=$('#taskStage .task-toolbar-actions');if(!rail)return;
    if(actions)move(actions,rail,$('.consulting-cohort-filter',rail)||$('#consultingClientList'));
    let select=$('.modern-consult-client-select',rail);
    if(!select){select=make('select','modern-consult-client-select',rail);select.setAttribute('aria-label','고객 선택');select.addEventListener('change',()=>{[...rail.querySelectorAll('[data-consulting-client]')].find(button=>button.dataset.consultingClient===select.value)?.click();});}
    const buttons=[...rail.querySelectorAll('[data-consulting-client]')],signature=buttons.map(button=>button.dataset.consultingClient+':'+button.textContent).join('|');
    if(select.dataset.signature!==signature){select.replaceChildren(...buttons.map(button=>new Option(button.querySelector('b')?.textContent||button.textContent,button.dataset.consultingClient)));select.dataset.signature=signature;}
    const active=buttons.find(button=>button.classList.contains('active'));if(active)select.value=active.dataset.consultingClient;
  }
  function arrangeSettings(){
    const tabs=$('.account-settings-nav');if(!tabs)return;
    const parent=tabs.parentElement;if(!parent.classList.contains('modern-account-layout'))parent.classList.add('modern-account-layout');
  }
  const owner=()=>window.AiderDearFirebase?.getState?.()?.user?.uid||'guest';
  function draftKey(input){const goal=input.closest('[data-modern-goal-index]')?.dataset.modernGoalIndex??String(Math.max(0,Number(input.closest('form')?.querySelector('header b')?.textContent.match(/GOAL\s*0?(\d)/)?.[1]||1)-1));return `${owner()}:${input.id}:${input.id.startsWith('routineMandala')?goal:'all'}`;}
  document.addEventListener('input',event=>{if(event.target.matches?.('#privateRoutineGoalsForm input,#privateRoutineMandalaForm textarea'))drafts.set(draftKey(event.target),event.target.value);});
  document.addEventListener('submit',event=>{if(event.target.matches?.('#privateRoutineGoalsForm,#privateRoutineMandalaForm'))for(const input of event.target.querySelectorAll('input,textarea'))drafts.delete(draftKey(input));},true);
  function restoreDrafts(){for(const input of document.querySelectorAll('#privateRoutineGoalsForm input,#privateRoutineMandalaForm textarea')){const value=drafts.get(draftKey(input));if(value!==undefined&&input.value!==value)input.value=value;}}
  function mountLanguage(host){
    const root=host.shadowRoot;if(!root?.querySelector('.app-shell'))return;
    let state=shadowRoots.get(root);
    if(!state){
      const style=root.querySelector('[data-site-edition-style="language"]')||document.createElement('link');style.rel='stylesheet';style.href='./site-language-modern-v165.css';style.dataset.siteEditionStyle='language';if(!style.isConnected)root.append(style);
      const shell=$('.app-shell',root),main=$('#main-page',root),course=$('.course-panel',root),words=$('#wordbook-section',root),lesson=$('#lesson-view',root);
      const left=document.createElement('aside');left.className='modern-language-courses';
      const nav=document.createElement('nav');nav.className='modern-language-mobile-nav';nav.setAttribute('aria-label','어학 화면');
      for(const [value,label]of [['course','과정'],['learn','학습'],['words','MY WORDS']]){const b=document.createElement('button');b.type='button';b.dataset.languagePanel=value;b.textContent=label;nav.append(b);}
      const courseSlot=document.createComment('modern-course-slot'),wordsSlot=document.createComment('modern-words-slot'),lessonSlot=document.createComment('modern-lesson-slot');course.before(courseSlot);words.before(wordsSlot);lesson?.before(lessonSlot);
      state={kind:'language',style,shell,main,course,words,lesson,left,nav,courseSlot,wordsSlot,lessonSlot};shadowRoots.set(root,state);
      nav.addEventListener('click',event=>{const button=event.target.closest('[data-language-panel]');if(!button)return;shell.dataset.modernLanguagePanel=button.dataset.languagePanel;nav.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===button));});
      root.addEventListener('click',event=>{if(event.target.closest('#scenario-tabs button,#category-tabs button'))shell.dataset.modernLanguagePanel='learn';});
    }
    state.style.disabled=!modern();state.style.media=modern()?'all':'not all';
    if(modern()){
      state.shell.classList.add('modern-language-layout');
      if(state.left.parentNode!==state.main)state.main.prepend(state.left);
      if(state.course.parentNode!==state.left)state.left.append(state.course);
      if(state.words.parentNode!==state.main)state.main.append(state.words);
      if(state.lesson&&state.lesson.parentNode!==state.main)state.main.insertBefore(state.lesson,state.words);
      if(state.nav.parentNode!==state.shell)state.main.before(state.nav);
      if(!state.shell.dataset.modernLanguagePanel)state.shell.dataset.modernLanguagePanel='learn';
      state.nav.querySelectorAll('button').forEach(button=>button.classList.toggle('active',button.dataset.languagePanel===state.shell.dataset.modernLanguagePanel));
      if(root.lastElementChild!==state.style)root.append(state.style);
    }else{
      state.shell.classList.remove('modern-language-layout');
      state.courseSlot.after(state.course);state.wordsSlot.after(state.words);if(state.lesson)state.lessonSlot.after(state.lesson);state.left.remove();state.nav.remove();
    }
  }
  function mountPaper(host){
    const root=host.shadowRoot;if(!root?.querySelector('.paper-app'))return;
    $('#paperStage')?.classList.toggle('modern-paper-overlay-open',modern()&&!!root.querySelector('.import-drawer.open'));
    let state=shadowRoots.get(root);
    if(!state){
      const style=root.querySelector('[data-site-edition-style="paper"]')||document.createElement('link');style.rel='stylesheet';style.href='./site-paper-modern-v165.css';style.dataset.siteEditionStyle='paper';if(!style.isConnected)root.append(style);
      const nav=$('#paperNav',root),select=document.createElement('select');select.className='modern-paper-menu';select.setAttribute('aria-label','연구 화면 선택');nav.before(select);
      state={kind:'paper',style,select};shadowRoots.set(root,state);
      select.addEventListener('change',()=>{const button=[...nav.querySelectorAll('button')].find(b=>(b.dataset.view||b.dataset.v159View)===select.value);button?.click();});
      new MutationObserver(()=>schedule()).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
    }
    state.style.disabled=!modern();state.style.media=modern()?'all':'not all';state.select.hidden=!modern();
    if(modern()){
      const side=$('.paper-sidebar',root);let extra=$('.modern-paper-projects',root);
      if(!extra){extra=make('details','modern-paper-projects',side);const summary=document.createElement('summary');summary.textContent='진행 프로젝트 · 연구실';extra.append(summary);}
      for(const node of root.querySelectorAll('.sidebar-project,.sidebar-lab'))move(node,extra);
    }
    const buttons=[...root.querySelectorAll('#paperNav button')];
    const signature=buttons.map(b=>(b.dataset.view||b.dataset.v159View)+':'+b.querySelector('b')?.textContent).join('|');
    if(state.select.dataset.signature!==signature){const home=new Option('연구 홈','');home.disabled=true;state.select.replaceChildren(home,...buttons.map(b=>new Option(b.querySelector('b')?.textContent||b.textContent,b.dataset.view||b.dataset.v159View)));state.select.dataset.signature=signature;}
    const active=buttons.find(b=>b.classList.contains('active'));state.select.value=active?(active.dataset.view||active.dataset.v159View):'';
    if(modern()&&root.lastElementChild!==state.style)root.append(state.style);
    const flow=$('.v159-import-flow',root);
    if(flow&&!$('.modern-import-pager',flow)){
      const sections=[...flow.children].filter(node=>node.tagName==='SECTION');
      const pager=document.createElement('nav');pager.className='modern-import-pager';pager.setAttribute('aria-label','논문 가져오기 단계 이동');
      const previous=document.createElement('button'),next=document.createElement('button'),step=document.createElement('select');
      previous.type=next.type='button';previous.textContent='이전';next.textContent='다음';step.setAttribute('aria-label','현재 가져오기 단계');
      ['1 · 분석 프롬프트','2 · 구조 검사','3 · 2차 검증','4 · 미리보기·저장'].forEach((name,index)=>step.add(new Option(name,index)));
      pager.append(previous,step,next);flow.append(pager);
      const show=index=>{index=Math.max(0,Math.min(3,index));flow.dataset.modernImportStep=String(index);step.value=String(index);sections.forEach((section,i)=>section.classList.toggle('modern-import-inactive',i!==index));previous.disabled=index===0;next.disabled=index===3;};
      step.addEventListener('change',()=>show(Number(step.value)));previous.addEventListener('click',()=>show(Number(step.value)-1));next.addEventListener('click',()=>show(Number(step.value)+1));
      // Navigation only changes visibility, not parser state, locked stages or save permissions.
      show(0);
    }
    const pager=$('.modern-import-pager',flow);if(pager)pager.hidden=!modern();
  }
  function restore(){
    document.querySelectorAll('.site-display-dialog[open]').forEach(dialog=>dialog.close());
    for(const [node,marker]of [...moves].reverse()){if(marker.isConnected&&node.isConnected&&marker.nextSibling!==node)marker.after(node);}
    for(const node of created)node.hidden=true;
    for(const group of groups)group.node.hidden=false;
    for(const id of ['recordShell','albumShell','eventArchiveShell','travelArchiveShell'])$('#'+id).hidden=false;
    document.querySelectorAll('.modern-account-layout').forEach(node=>node.classList.remove('modern-account-layout'));
  }
  function apply(){
    scheduled=0;if(applying)return;applying=true;
    try{
      if(modern()){
        for(const node of created)node.hidden=false;
        arrangeHeader();arrangeCalendar();applyEvent();arrangePersonal();arrangeWork();arrangeConsult();arrangeSettings();restoreDrafts();
      }else{restore();restoreDrafts();}
      document.querySelectorAll('aiderlog-language-lab').forEach(mountLanguage);
      document.querySelectorAll('aider-paper-workspace-v121').forEach(mountPaper);
    }finally{applying=false;}
  }
  function schedule(){if(!scheduled)scheduled=requestAnimationFrame(apply);}
  new MutationObserver(records=>{if(records.some(record=>record.type==='childList'||record.attributeName==='data-active-tab'||record.target.matches?.('.tab,[class*=dot],.paper-nav button')))schedule();}).observe(app,{childList:true,subtree:true,attributes:true,attributeFilter:['data-active-tab','class']});
  addEventListener('aiderlog-site-editionchange',apply);
  document.addEventListener('language-lab-ready',schedule);
  document.addEventListener('click',event=>{
    const tab=event.target.closest?.('.tab');if(tab&&modern())requestAnimationFrame(()=>{
      const strip=tab.parentElement,a=tab.getBoundingClientRect(),b=strip.getBoundingClientRect();
      // Only the menu strip may scroll; scrollIntoView also moved the entire mobile app.
      if(a.left<b.left)strip.scrollLeft-=b.left-a.left;else if(a.right>b.right)strip.scrollLeft+=a.right-b.right;
    });
  });
  window.AiderLogModernLayoutV165={refresh:apply};
  apply();
})();
