const fs=require('fs'),path=require('path'),http=require('http');
const assert=require('assert/strict');
// Run from the repository with `node tests/app-core-v193.ui.cjs`.
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

const root=path.resolve(process.env.AIDERLOG_APP_ASSETS||path.join(repository,'android-src/assets')),out=path.resolve(repository,'work/qa-app');fs.mkdirSync(out,{recursive:true});
const types={'.js':'application/javascript','.css':'text/css','.html':'text/html','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp'};
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
await page.screenshot({path:path.join(out,'schedule.png')});
await openWheel();await page.screenshot({path:path.join(out,'wheel-expanded.png')});await page.locator('#wheel [data-page="home"]').tap();await page.waitForTimeout(350);

await page.getByRole('button',{name:'금융과 워크플로우 열기. 오른쪽으로 밀어서도 열 수 있습니다.'}).click();await page.waitForTimeout(100);await page.screenshot({path:path.join(out,'finance.png')});
await page.locator('#personal [data-pcat="workflow"]').click();await page.waitForTimeout(100);await page.screenshot({path:path.join(out,'workflow.png')});
await wheelGo('routine');await page.screenshot({path:path.join(out,'routine.png')});
await wheelGo('event');await page.screenshot({path:path.join(out,'event.png')});
await wheelGo('fifth');await page.screenshot({path:path.join(out,'paper.png')});
const checks=[];function pass(name){checks.push(name);console.log('PASS',name);}
assert.equal(await page.locator('.core-nav-v193').count(),0);assert.equal(await page.locator('#wheel .global-wheel-item-v126').count(),4);assert.deepEqual(await page.locator('#wheel .global-wheel-item-v126').evaluateAll(rows=>rows.map(e=>e.dataset.page)),['home','routine','event','fifth']);assert.deepEqual(await page.locator('#wheel .wheelbar-name-v176').allTextContents(),['SCHEDULE','ROUTINE','EVENT','PAPER']);assert.equal(await page.locator('#mailboxBtn').count(),0);pass('Original wheelbar has SCHEDULE ROUTINE EVENT PAPER in order; no replacement bar or mailbox');
await page.evaluate(()=>go('estate',false));assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Retired route falls back to Schedule');

async function swipe(x,y,endX,endY){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let i=1;i<=5;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+(endX-x)*i/5,y:y+(endY-y)*i/5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(100);}
await swipe(95,350,275,353);assert.equal(await page.locator('.view.on').getAttribute('id'),'personal');pass('Real touch swipe right opens Finance/Workflow from Schedule');
await page.waitForTimeout(450);await page.locator('#personal [data-padd="finance"]').click();await page.locator('#personalTitle').fill('새 금융 기록');await page.locator('#pAmount').fill('12000');await page.locator('#personalModal').getByRole('button',{name:'저장',exact:true}).click();await page.waitForTimeout(150);
assert(await page.evaluate(()=>P.personalItems.some(r=>r.category==='finance'&&r.title==='새 금융 기록'&&r.amount===12000)));assert(await page.evaluate(()=>P.personalItems.some(r=>r.id==='keep-health')));pass('Finance record save works; existing retired records preserved');
await page.locator('#personal [data-pcat="workflow"]').click();await page.locator('[data-workflow-step-v127="test-flow|0"]').click();await page.waitForTimeout(100);assert.deepEqual(await page.evaluate(()=>{const r=P.personalItems.find(r=>r.id==='test-flow');return [r.status,r.details.progress];}),['ongoing',50]);pass('Existing workflow step updates progress and status');
await page.locator('[data-workflow-edit-v127="test-flow"]').click();assert(await page.locator('.workflow-editor-v127').isVisible());await page.locator('[data-workflow-editor-close-v127]').first().click();pass('Workflow edit form opens and closes');
await page.locator('#personal [data-core-back]').click();await swipe(100,350,105,560);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Vertical touch scroll does not open finance');
await swipe(100,350,140,351);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');await page.evaluate(()=>{if(document.querySelector('.overlay.on,.modal.on,dialog[open]'))window.AiderAppBackV176?.back();});pass('Short horizontal touch stays on Schedule');
await swipe(270,350,95,351);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Leftward Schedule swipe does not open finance');
;await swipe(14,350,205,351);;assert.equal(await page.locator('.view.on').getAttribute('id'),'personal');await page.waitForTimeout(450);assert.equal(await page.evaluate(()=>window.AiderLogAppShell.handleBack()),true);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Schedule edge swipe opens tools; native Back returns to Schedule');
await swipe(95,350,275,353);await page.waitForTimeout(450);await swipe(310,700,110,700);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Leftward tools swipe returns to Schedule');
await page.evaluate(()=>{const target=document.querySelector('[data-schedule-date-v125]');const send=(type,x)=>target.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:4,pointerType:'mouse',button:0,clientX:x,clientY:350}));send('pointerdown',100);send('pointermove',210);send('pointercancel',210);send('pointerup',280);});assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Canceled pointer gesture never navigates');
await page.evaluate(()=>{window.AiderCoreV193.openTools();openPersonal('finance');});await swipe(50,500,280,500);assert.equal(await page.locator('.view.on').getAttribute('id'),'personal');assert(await page.locator('#personalModal').isVisible());await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await page.locator('#personalModal').evaluate(e=>e.classList.contains('on')),false);pass('Editor blocks swipe; native Back closes editor before navigating');
await page.evaluate(()=>{window.AiderLogAppShell.openTarget('private','');});assert.equal(await page.locator('.view.on').getAttribute('id'),'routine');await page.evaluate(()=>{window.AiderLogAppShell.openTarget('home','');});assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Native Schedule/Routine targets map to retained pages');
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
assert.equal(await page.locator('#wheel .global-wheel-item-v126[aria-current="page"]').count(),1);assert.equal(await page.locator('#wheel .global-wheel-item-v126[aria-current="page"]').getAttribute('data-page'),'home');pass('Exactly one current wheel destination');
await openWheel();const beforeBack=await page.locator('.view.on').getAttribute('id');await page.evaluate(()=>window.AiderLogAppShell.handleBack());assert.equal(await page.locator('#wheel').evaluate(e=>e.classList.contains('open')),false);assert.equal(await page.locator('.view.on').getAttribute('id'),beforeBack);pass('Native Back closes wheel before changing the page');
// Drag around the original orbit, crossing ROUTINE and releasing on EVENT.
let box=await page.locator('#wheelCore').boundingBox(),x=box.x+box.width/2,y=box.y+box.height/2;
await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});await page.waitForTimeout(230);
for(const id of ['routine','event']){box=await page.locator('#wheel [data-page="'+id+'"]').boundingBox();await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});}
await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForTimeout(350);assert.equal(await page.locator('.view.on').getAttribute('id'),'event');pass('Native touch hold and radial drag select the intended wheel page');
await page.locator('#wheelCore').tap();await page.waitForTimeout(350);assert.equal(await page.locator('.view.on').getAttribute('id'),'home');pass('Original planet tap returns to Schedule');
await page.setViewportSize({width:800,height:360});await openWheel();const wheelBounds=await page.locator('#wheelCore').boundingBox();assert(wheelBounds.x>=0&&wheelBounds.y>=0&&wheelBounds.x+wheelBounds.width<=800&&wheelBounds.y+wheelBounds.height<=360);assert.deepEqual(await page.locator('#wheel .global-wheel-item-v126').evaluateAll(rows=>rows.map(e=>e.dataset.page)),['home','routine','event','fifth']);await page.screenshot({path:path.join(out,'wheel-landscape.png')});pass('Wheel remains visible and ordered after device rotation');
await page.setViewportSize({width:360,height:800});await page.locator('#wheel [data-page="home"]').tap();await page.waitForTimeout(350);await page.screenshot({path:path.join(out,'schedule-360.png')});await openWheel();await page.screenshot({path:path.join(out,'wheel-expanded-360.png')});

assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);pass('No runtime errors or missing local assets');
console.log('ERRORS',JSON.stringify(errors,null,2));console.log('MISSING',requests);
fs.writeFileSync(path.join(out,'initial-report.json'),JSON.stringify({checks,errors,requests},null,2));await browser.close();server.close();})().catch(e=>{console.error(e);server.close();process.exit(1);});
