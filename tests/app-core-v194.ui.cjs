const fs=require('fs'),path=require('path'),http=require('http');
const assert=require('assert/strict');
// Run from the repository with `node tests/app-core-v194.ui.cjs`.
// All accounts and records below are fixtures; remote requests are blocked.
function playwright(){
  const candidates=['playwright',...(process.env.NODE_PATH||'').split(path.delimiter).filter(Boolean).map(root=>path.join(root,'playwright'))];
  if(process.env.USERPROFILE)candidates.push(path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));
  for(const candidate of candidates){try{return require(candidate);}catch{}}
  throw new Error('Install Playwright or set NODE_PATH to its node_modules directory.');
}
const {chromium}=playwright();
const repository=path.resolve(__dirname,'..');
const browserCandidates=[process.env.AIDERLOG_TEST_BROWSER,process.env.ProgramFiles&&path.join(process.env.ProgramFiles,'Google/Chrome/Application/chrome.exe'),process.env['ProgramFiles(x86)']&&path.join(process.env['ProgramFiles(x86)'],'Microsoft/Edge/Application/msedge.exe')];
const executablePath=browserCandidates.find(file=>file&&fs.existsSync(file));

const root=path.resolve(process.env.AIDERLOG_APP_ASSETS||path.join(repository,'android-src/assets')),out=path.resolve(repository,'work/qa-app-v194');fs.mkdirSync(out,{recursive:true});
const types={'.js':'application/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.gif':'image/gif'};
const server=http.createServer((req,res)=>{const file=path.join(root,decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html');if(!file.startsWith(root)||!fs.existsSync(file)){res.writeHead(404);res.end();return;}res.setHeader('content-type',types[path.extname(file)]||'application/octet-stream');res.end(fs.readFileSync(file));});
(async()=>{await new Promise(resolve=>server.listen(3193,'127.0.0.1',resolve));const browser=await chromium.launch({...(executablePath?{executablePath}:{}),headless:true,args:['--disable-gpu']});
const context=await browser.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true});const page=await context.newPage(),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.stack));page.on('dialog',dialog=>dialog.accept());page.on('response',r=>{if(r.status()>=400)requests.push(r.url()+': '+r.status());});
await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:3193')?route.continue():route.abort());
await page.addInitScript(()=>{sessionStorage.setItem('aiderlog-splash-shown-session-v150','1');localStorage.setItem('aiderlog-private-v20',JSON.stringify({routines:[],personalItems:[{id:'test-money',category:'finance',title:'기존 적금',amount:500000,date:'2026-09-27',details:{financeType:'saving',cycle:'monthly',dueDay:15,paymentChecks:{}}},{id:'test-flow',category:'workflow',title:'기존 프로젝트',status:'planned',details:{project:'테스트',steps:['준비','실행'],completedSteps:{}}},{id:'keep-health',category:'health',title:'이전 건강 기록'}]}));});
await page.goto('http://127.0.0.1:3193',{waitUntil:'domcontentloaded'});await page.waitForTimeout(2000);
const cdp=await context.newCDPSession(page);
async function openWheel(){
  const box=await page.locator('#wheelCore').boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await page.waitForTimeout(230);
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(60);
  assert(await page.locator('#wheel').evaluate(e=>e.classList.contains('open')));
}
async function wheelGo(id){await openWheel();await page.locator('#wheel [data-page="'+id+'"]').tap();await page.waitForTimeout(350);assert.equal(await page.locator('.view.on').getAttribute('id'),id);}
const checks=[];function pass(name){checks.push(name);console.log('PASS',name);}
async function planetHome(){await page.locator('#wheelCore').tap();await page.waitForTimeout(350);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');}
const weekly=()=>page.evaluate(()=>window.AiderScheduleUIV184.isWeekly());
async function swipe(x,y,endX,endY){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(endX-x)*i/5,y:y+(endY-y)*i/5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(130);}
assert.equal(await page.locator('.core-nav-v193,[data-core-tools],[data-core-back],.core-swipe-hint-v193,[data-week-toggle-v184]').count(),0);assert.equal(await page.locator('#mailboxBtn').count(),0);pass('No replacement bar, calendar tools/Weekly button, return button, hint or mailbox');
assert.deepEqual(await page.locator('#wheel .global-wheel-item-v126').evaluateAll(rows=>rows.map(e=>e.dataset.page)),['personal','routine','event','fifth']);assert.deepEqual(await page.locator('#wheel .wheelbar-name-v176').allTextContents(),['금융 · 워크플로우','ROUTINE','EVENT','PAPER']);assert.equal(await page.locator('[data-wheelbar-icon-v176="personal"]').evaluate(e=>getComputedStyle(e).fill),'none');pass('Original wheel routes Finance/Workflow, Routine, Event, Paper in order with visible wallet details');
await openWheel();await page.screenshot({path:path.join(out,'wheel-expanded.png')});await planetHome();
// Original v192 calendar geometry with the same empty fixture. All seven columns
// remain inside the card at phone, unfolded and rotated viewport sizes.
for(const [width,height,calendarWidth,calendarHeight] of [[360,800,356,678.75],[412,915,408,793.75],[700,840,419.6875,783.75],[840,700,505.84375,643.75],[915,412,552,355.75]]){
 await page.setViewportSize({width,height});await page.evaluate(()=>go('home',false));await page.waitForTimeout(500);
 const geometry=await page.evaluate(()=>{const c=document.querySelector('#home .schedule-calendar-v119').getBoundingClientRect(),d=document.querySelector('#home .schedule-days-v119').getBoundingClientRect(),cells=[...document.querySelectorAll('#home .schedule-days-v119 > [data-schedule-date-v125]')].slice(0,7).map(e=>{const r=e.getBoundingClientRect();return {x:r.x,right:r.right,width:r.width}});return {width:c.width,height:c.height,x:c.x,right:c.right,days:{x:d.x,right:d.right,width:d.width},cells,overflow:document.documentElement.scrollWidth>innerWidth};});
 assert(Math.abs(geometry.width-calendarWidth)<1);assert(Math.abs(geometry.height-calendarHeight)<1);assert.equal(geometry.cells.length,7);assert(!geometry.overflow&&geometry.x>=0&&geometry.right<=width);assert(geometry.cells.every(c=>c.x>=geometry.days.x-.1&&c.right<=geometry.days.right+.1));assert(Math.abs(geometry.cells.reduce((sum,c)=>sum+c.width,0)-geometry.days.width)<1);
 await page.screenshot({path:path.join(out,`schedule-${width}x${height}.png`)});pass(`Original calendar size and seven unclipped columns at ${width}x${height}`);
}
await page.setViewportSize({width:412,height:915});await page.waitForTimeout(400);
await swipe(95,350,275,353);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');assert(await weekly());assert.equal(await page.locator('.weekly-view-v184:not([hidden]) .week-day-v184').count(),7);await page.screenshot({path:path.join(out,'weekly.png')});pass('Deliberate right touch swipe opens the existing seven-day Weekly view');
await swipe(310,350,100,352);assert.equal(await weekly(),false);pass('Left swipe returns Weekly to the month without changing page');
await swipe(14,350,205,352);assert(await weekly());assert.equal(await page.evaluate(()=>window.AiderLogAppShell.handleBack()),true);assert.equal(await weekly(),false);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Schedule edge swipe and native Back cooperate with Weekly');
await swipe(100,350,105,560);assert.equal(await weekly(),false);await swipe(100,350,140,351);assert.equal(await weekly(),false);await page.evaluate(()=>window.AiderLogAppShell.handleBack());pass('Vertical and short gestures keep the month');
await swipe(270,350,95,351);assert.equal(await weekly(),false);pass('Left swipe from month stays on month');
await page.evaluate(()=>{const target=document.querySelector('[data-schedule-date-v125]');const send=(type,x)=>target.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:4,pointerType:'mouse',button:0,clientX:x,clientY:350}));send('pointerdown',100);send('pointermove',210);send('pointercancel',210);send('pointerup',280);});assert.equal(await weekly(),false);pass('Canceled mouse/pointer gesture never navigates');
await page.mouse.move(100,350);await page.mouse.down();await page.mouse.move(280,352,{steps:6});await page.mouse.up();await page.waitForTimeout(150);assert(await weekly());await page.locator('[data-calendar-today-v125]').click();assert.equal(await weekly(),false);pass('Desktop mouse drag opens Weekly; Today restores the month');
await wheelGo('personal');assert.equal(await page.locator('#personal [data-core-back]').count(),0);await page.screenshot({path:path.join(out,'finance.png')});pass('First wheel slot opens Finance/Workflow without a return button');
await page.locator('#personal [data-padd="finance"]').click();await page.locator('#personalTitle').fill('새 금융 기록');await page.locator('#pAmount').fill('12000');await page.locator('#personalModal').getByRole('button',{name:'저장',exact:true}).click();await page.waitForTimeout(150);assert(await page.evaluate(()=>P.personalItems.some(r=>r.category==='finance'&&r.title==='새 금융 기록'&&r.amount===12000)));assert(await page.evaluate(()=>P.personalItems.some(r=>r.id==='keep-health')));pass('Finance saves preserve historical records');
await page.locator('#personal [data-pcat="workflow"]').click();await page.locator('[data-workflow-step-v127="test-flow|0"]').click();await page.waitForTimeout(100);assert.deepEqual(await page.evaluate(()=>{const r=P.personalItems.find(r=>r.id==='test-flow');return [r.status,r.details.progress];}),['ongoing',50]);await page.screenshot({path:path.join(out,'workflow.png')});pass('Workflow completion preserves its existing progress behavior');
await page.locator('[data-workflow-edit-v127="test-flow"]').click();assert(await page.locator('.workflow-editor-v127').isVisible());await page.locator('[data-workflow-editor-close-v127]').first().click();pass('Workflow editor opens and closes');
await page.evaluate(()=>{window.AiderCoreV194.openTools();openPersonal('finance');});await swipe(50,500,280,500);assert.equal(await page.locator('.view.on').getAttribute('id'),'personal');assert(await page.locator('#personalModal').isVisible());await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await page.locator('#personalModal').evaluate(e=>e.classList.contains('on')),false);pass('Editor blocks swipes and native Back closes the editor first');
await planetHome();assert.equal(await weekly(),false);pass('Planet tap always returns to the main monthly Schedule');
await page.evaluate(()=>window.AiderLogAppShell.openTarget('private',''));assert.equal(await page.locator('.view.on').getAttribute('id'),'routine');await page.evaluate(()=>window.AiderLogAppShell.openTarget('home',''));assert.equal(await page.locator('.view.on').getAttribute('id'),'home');assert.equal(await weekly(),false);pass('Native widget Schedule and Routine routes remain distinct from tools');
await page.evaluate(()=>go('estate',false));assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Retired routes remain unavailable');
// Retained core CRUD uses only an in-memory authenticated write boundary.
{
  await page.evaluate(()=>{
   window.__retained193={privateWrites:[],appWrites:[],scheduleWrites:[]};
   authState={user:{uid:'retained-qa',email:'retained@example.invalid',name:'검증'},pair:null,partner:null,friends:[]};
   fb={getState:()=>authState,writePrivateData:async value=>{__retained193.privateWrites.push(structuredClone(value));return value},writeAppData:async value=>{__retained193.appWrites.push(structuredClone(value));return value},writeScheduleData:async value=>{__retained193.scheduleWrites.push(structuredClone(value));return value}};
   window.AiderDearFirebase=fb;go('home',false);
  });
  const todayKey=await page.evaluate(()=>today());
  await page.locator('[data-schedule-date-v125="'+todayKey+'"]').click();
  const schedule=page.locator('#appScheduleFormV179');await schedule.locator('[name="title"]').fill('검증 일정');await schedule.locator('[name="allDay"]').check();await schedule.locator('[name="note"]').fill('다시 열 일정 메모');
  await page.locator('button[form="appScheduleFormV179"][type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('.schedule-dialog-v125')?.classList.contains('on'));
  const scheduleId=await page.evaluate(()=>A.scheduleEvents.find(r=>r.title==='검증 일정')?.id);assert(scheduleId);assert.equal(await page.evaluate(()=>__retained193.scheduleWrites.length),1);
  await page.locator('[data-schedule-date-v125="'+todayKey+'"]').click();await page.locator('[data-schedule-list-edit-v125="'+scheduleId+'"]').click();assert.equal(await schedule.locator('[name="note"]').inputValue(),'다시 열 일정 메모');await schedule.locator('[name="title"]').fill('수정된 일정');
  await page.locator('button[form="appScheduleFormV179"][type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('.schedule-dialog-v125')?.classList.contains('on'));
  assert(await page.evaluate(()=>A.scheduleEvents.some(r=>r.title==='수정된 일정'&&r.allDay&&r.note==='다시 열 일정 메모')));pass('Schedule creates, saves, reopens and edits through the calendar dialog');
  await page.screenshot({path:path.join(out,'retained-schedule.png'),fullPage:true});
  // Weekly stays active beneath both event and notebook editors, and native
  // Back closes the editor before it returns Weekly to the monthly calendar.
  await swipe(95,350,275,353);assert(await weekly());await page.waitForTimeout(450);await page.locator('[data-week-event-v184="'+scheduleId+'"]').click();assert(await schedule.isVisible());
  await swipe(100,410,285,412);assert(await weekly());await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await page.locator('.schedule-dialog-v125').evaluate(e=>e.classList.contains('on')),false);assert(await weekly());pass('Weekly event editor blocks swipes and native Back closes it before Weekly');
  await page.evaluate(async()=>{P.memos=[{id:'qa-memo-v194',text:'기존 메모',notes:'이전 내용'}];fb.readPrivateData=async()=>structuredClone(P);await window.AiderTodoV179.refresh();window.AiderScheduleUIV184.refresh();});await page.waitForTimeout(100);
  await page.locator('.weekly-view-v184 [data-todo-edit-v179="qa-memo-v194"]').click();assert(await page.locator('.todo-editor-overlay-v179').isVisible());
  const memoTitle=await page.locator('#todo-editor-title-v179').boundingBox();await swipe(memoTitle.x+5,memoTitle.y+5,memoTitle.x+100,memoTitle.y+7);assert(await weekly());assert(await page.locator('.todo-editor-overlay-v179').isVisible());
  await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await page.locator('.todo-editor-overlay-v179').count(),0);assert(await weekly());await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await weekly(),false);pass('Weekly notebook editor preserves its view and closes before monthly Back');

  await page.evaluate(()=>go('routine',false));await page.locator('[data-routine-create-open]:visible').click();const routineForm=page.locator('#routineEditorFormV111');await routineForm.locator('[name="text"]').fill('검증 루틴');await routineForm.locator('[name="miniText"]').fill('1분');await routineForm.locator('[name="maxText"]').fill('10분');await page.locator('button[form="routineEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(()=>P.routines.some(r=>r.text==='검증 루틴')&&!document.querySelector('#routineEditorFormV111'));
  const routineId=await page.evaluate(()=>P.routines.find(r=>r.text==='검증 루틴').id);await page.locator('[data-routine-id="'+routineId+'"][data-routine-level="MAX"]').click();
  await page.waitForFunction(date=>P.routines.some(r=>r.dailyLevels?.[date]==='MAX'&&r.doneDates.includes(date)),todayKey);
  await page.locator('[data-routine-open="'+routineId+'"]').click();await page.locator('[data-routine-edit-open="'+routineId+'"]').click();assert.equal(await routineForm.locator('[name="text"]').inputValue(),'검증 루틴');await routineForm.locator('[name="text"]').fill('수정된 루틴');await page.locator('button[form="routineEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(date=>P.routines.some(r=>r.text==='수정된 루틴'&&r.dailyLevels?.[date]==='MAX'),todayKey);assert(await page.evaluate(()=>P.personalItems.some(r=>r.id==='keep-health')));pass('Routine creates, marks MAX complete, and edits without losing completion or historical data');
  await page.screenshot({path:path.join(out,'retained-routine.png'),fullPage:true});
  await page.evaluate(()=>go('event',false));await page.locator('[data-event-create="record"]').click();const record=page.locator('#eventEditorFormV111');await record.locator('[name="title"]').fill('검증 EVENT 기록');await record.locator('[name="body"]').fill('다시 열 기록입니다.');await page.locator('button[form="eventEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(()=>A.records.some(r=>r.title==='검증 EVENT 기록')&&!document.querySelector('#eventEditorFormV111'));
  const recordId=await page.evaluate(()=>A.records.find(r=>r.title==='검증 EVENT 기록').id);await page.locator('[data-record-edit="'+recordId+'"]').first().click();assert.equal(await record.locator('[name="body"]').inputValue(),'다시 열 기록입니다.');await record.locator('[name="body"]').fill('수정된 EVENT 내용');await page.locator('button[form="eventEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(()=>A.records.some(r=>r.body==='수정된 EVENT 내용')&&!document.querySelector('#eventEditorFormV111'));pass('EVENT record saves, reopens and edits through its existing form');
  await page.screenshot({path:path.join(out,'retained-event.png'),fullPage:true});
  const persisted=await page.evaluate(()=>({private:JSON.parse(localStorage.getItem('aiderlog-private-v20')),app:JSON.parse(localStorage.getItem('aiderlog-app-v20')),writes:{private:__retained193.privateWrites.length,app:__retained193.appWrites.length,schedule:__retained193.scheduleWrites.length}}));
  assert(persisted.private.routines.some(r=>r.text==='수정된 루틴'&&r.dailyLevels?.[todayKey]==='MAX'));assert(persisted.app.scheduleEvents.some(r=>r.title==='수정된 일정'));assert(persisted.app.records.some(r=>r.body==='수정된 EVENT 내용'));assert(persisted.writes.private>=3&&persisted.writes.app>=4&&persisted.writes.schedule===2);pass('Local cache and isolated cloud-write boundary contain the edited records');
}
await page.evaluate(()=>{window.AiderDearFirebase={getState:()=>({user:{uid:'qa-owner',email:'qhals5060@gmail.com'}})};P.paperItems=[{id:'qa-paper',title:'기존 논문',journal:'Test Journal',year:'2026',keywords:['검증']}];window.renderMyV128();go('fifth',false);});await page.waitForTimeout(100);assert(await page.locator('.mp159-page').isVisible());await page.locator('[data-mp159-tab="read"]').click();assert(await page.getByRole('button',{name:/기존 논문/}).isVisible());await page.getByRole('button',{name:/기존 논문/}).click();await page.screenshot({path:path.join(out,'paper-reader.png')});pass('Authorized PAPER library and existing paper reader work');
await page.setViewportSize({width:360,height:800});await page.evaluate(()=>go('home',false));await page.screenshot({path:path.join(out,'schedule-360.png')});;const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);pass('360px layout has no horizontal overflow');
assert.equal(await page.locator('#wheel [aria-current="page"]').count(),1);assert.equal(await page.locator('#wheel [aria-current="page"]').getAttribute('id'),'wheelCore');pass('Planet alone marks the main Schedule as current');
await openWheel();const beforeBack=await page.locator('.view.on').getAttribute('id');await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await page.locator('#wheel').evaluate(e=>e.classList.contains('open')),false);assert.equal(await page.locator('.view.on').getAttribute('id'),beforeBack);pass('Native Back closes wheel before changing the page');
// Drag around the original orbit, crossing ROUTINE and releasing on EVENT.
let box=await page.locator('#wheelCore').boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await page.waitForTimeout(230);
for(const id of ['routine','event']){box=await page.locator('#wheel [data-page="'+id+'"]').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(350);assert.equal(await page.locator('.view.on').getAttribute('id'),'event');pass('Native touch hold and radial drag select the intended wheel page');
await page.locator('#wheelCore').tap();await page.waitForTimeout(350);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Original planet tap returns to Schedule');
await page.setViewportSize({width:800,height:360});await openWheel();const wheelBounds=await page.locator('#wheelCore').boundingBox();assert(wheelBounds.x>=0&&wheelBounds.y>=0&&wheelBounds.x+wheelBounds.width<=800&&wheelBounds.y+wheelBounds.height<=360);assert.deepEqual(await page.locator('#wheel .global-wheel-item-v126').evaluateAll(rows=>rows.map(e=>e.dataset.page)),['personal','routine','event','fifth']);await page.screenshot({path:path.join(out,'wheel-landscape.png')});pass('Wheel remains visible and ordered after device rotation');
await page.setViewportSize({width:360,height:800});await page.locator('#wheelCore').tap();await page.waitForTimeout(350);await page.screenshot({path:path.join(out,'schedule-360.png')});await openWheel();await page.screenshot({path:path.join(out,'wheel-expanded-360.png')});

// Install a native bridge before scripts run, so the real widget adapter is
// wrapped by app-core in production order. All persistence here remains mocked.
const widgetContext=await browser.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true,serviceWorkers:'block'}),widgetPage=await widgetContext.newPage();widgetPage.on('pageerror',e=>errors.push(e.stack));widgetPage.on('dialog',dialog=>dialog.accept());
await widgetPage.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:3193')?route.continue():route.abort());
await widgetPage.addInitScript(()=>{sessionStorage.setItem('aiderlog-splash-shown-session-v150','1');window.AiderLogNative={syncWidgets(){}};});
await widgetPage.goto('http://127.0.0.1:3193',{waitUntil:'domcontentloaded'});await widgetPage.waitForFunction(()=>window.AiderCoreV194&&window.AiderWidgetSyncV164&&window.AiderTodoV179);
await widgetPage.evaluate(()=>{
 window.__memoWidgetQA={reads:[],writes:[],subscribers:[]};authState={user:{uid:'memo-owner-a',email:'fixture@example.invalid'},pair:null,friends:[]};
 const notes={ 'memo-owner-a':{checklists:[],memos:[{id:'widget-memo-a',text:'위젯 메모 원문',notes:'현재 계정의 상세 내용',updatedAt:41}]},'memo-owner-b':{checklists:[],memos:[{id:'widget-memo-b',text:'다른 계정 메모',notes:'B 전용',updatedAt:42}]}};
 const recordWrite=(method,value)=>{__memoWidgetQA.writes.push({method,value});throw Error('A memo preview must not mutate data');};
 fb={getState:()=>authState,subscribe(callback){__memoWidgetQA.subscribers.push(callback);callback(authState);return()=>{};},readPrivateData:async()=>{__memoWidgetQA.reads.push(authState.user.uid);return structuredClone(notes[authState.user.uid]);},readAppData:async()=>({scheduleEvents:[]}),readScheduleData:async()=>[],writePrivateData:value=>recordWrite('private',value),writeAppData:value=>recordWrite('app',value),writeScheduleData:value=>recordWrite('schedule',value),applyWidgetActionV165:value=>recordWrite('widget',value),mutateChecklistV179:value=>recordWrite('memo',value)};
 window.AiderDearFirebase=fb;dispatchEvent(new Event('aiderdear-firebase-ready'));
 window.__memoWidgetOpen=(target,uid='memo-owner-a')=>window.AiderLogAppShell.openTarget(target,'widget-v165:'+encodeURIComponent(JSON.stringify({kind:'CalendarSplit',op:'open',value:'note',id:'widget-memo-a',source:'memos',uid,date:'2026-09-27',widgetId:42,key:'memo-preview'})));
});
await widgetPage.waitForTimeout(500);
for(const target of ['home','todo']){
 await widgetPage.evaluate(target=>__memoWidgetOpen(target),target);await widgetPage.locator('.todo-editor-overlay-v179').waitFor({state:'visible'});
 assert.equal(await widgetPage.locator('.todo-editor-overlay-v179 [name="text"]').inputValue(),'위젯 메모 원문');assert.equal(await widgetPage.locator('.todo-editor-overlay-v179 [name="notes"]').inputValue(),'현재 계정의 상세 내용');assert.equal(await widgetPage.locator('.view.on').getAttribute('id'),'todo');
 assert.deepEqual(await widgetPage.evaluate(()=>__memoWidgetQA.writes),[]);assert((await widgetPage.evaluate(()=>__memoWidgetQA.reads)).every(uid=>uid==='memo-owner-a'));
 await widgetPage.screenshot({path:path.join(out,'widget-memo-'+target+'.png')});await widgetPage.locator('[data-todo-close-v179]').click();await widgetPage.waitForTimeout(350);
}
pass('Actual native memo action reaches the correct notebook editor through home/todo shell routes without saving');
await widgetPage.evaluate(()=>{authState={...authState,user:{uid:'memo-owner-b',email:'fixture-b@example.invalid'}};__memoWidgetQA.subscribers.forEach(callback=>callback(authState));});await widgetPage.waitForTimeout(500);
const readsBefore=await widgetPage.evaluate(()=>__memoWidgetQA.reads.length);await widgetPage.evaluate(()=>__memoWidgetOpen('home','memo-owner-a'));await widgetPage.waitForTimeout(200);assert.equal(await widgetPage.locator('.todo-editor-overlay-v179').count(),0);assert.equal(await widgetPage.evaluate(()=>__memoWidgetQA.reads.length),readsBefore);assert.deepEqual(await widgetPage.evaluate(()=>__memoWidgetQA.writes),[]);assert.equal(await widgetPage.evaluate(()=>window.AiderTodoV179.snapshot().memos[0]?.id),'widget-memo-b');
await widgetContext.close();pass('Memo actions captured for a prior UID cannot open, read, save or delete after account changes');

// The launch media must remain the supplied v192 animation, at its original
// full viewport scale and timing. This fresh context does not skip the splash.
assert.equal(require('crypto').createHash('sha256').update(fs.readFileSync(path.join(root,'aiderlog-launch-v145.gif'))).digest('hex'),'a9936a466a395f644def8c8e5dd612a0598e9752e7f2a2d708835c160dc9e52b');
const launchContext=await browser.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true,serviceWorkers:'block'}),launchPage=await launchContext.newPage();launchPage.on('pageerror',e=>errors.push(e.stack));
await launchPage.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:3193')?route.continue():route.abort());
await launchPage.addInitScript(()=>{window.__launchQA={start:0,end:0};new MutationObserver(()=>{if(!__launchQA.start&&document.querySelector('.app-splash-v145'))__launchQA.start=performance.now();}).observe(document,{childList:true,subtree:true});addEventListener('aiderlog-splash-complete',()=>{__launchQA.end=performance.now()},{once:true});});
await launchPage.goto('http://127.0.0.1:3193',{waitUntil:'domcontentloaded'});await launchPage.waitForFunction(()=>document.querySelector('.app-splash-v145 img')?.naturalWidth>0);await launchPage.waitForTimeout(3500);
const launch=await launchPage.locator('.app-splash-v145 img').evaluate(img=>{const box=img.getBoundingClientRect();return {src:img.getAttribute('src'),width:box.width,height:box.height,fit:getComputedStyle(img).objectFit}});assert.equal(launch.src,'./aiderlog-launch-v145.gif');assert.equal(launch.width,412);assert.equal(launch.height,915);assert.equal(launch.fit,'cover');await launchPage.screenshot({path:path.join(out,'startup-412.png')});await launchPage.waitForFunction(()=>__launchQA.end>0);const launchTime=await launchPage.evaluate(()=>__launchQA.end-__launchQA.start);assert(launchTime>=5500&&launchTime<14000);await launchContext.close();pass('Original v192 full-screen launch GIF and duration are restored');

assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);pass('No runtime errors or missing local assets');
console.log('ERRORS',JSON.stringify(errors,null,2));console.log('MISSING',requests);
fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors,requests},null,2));await browser.close();server.close();})().catch(e=>{console.error(e);server.close();process.exit(1);});
