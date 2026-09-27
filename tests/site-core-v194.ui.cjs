const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
// Run with local playwright, NODE_PATH, or PLAYWRIGHT_MODULE_PATH (module directory).
// AIDERLOG_SITE_ROOT and AIDERLOG_QA_OUT optionally override source/output paths.
// Uses an isolated in-memory identity and persistence fixture; all external requests are blocked.
let playwright;
try{playwright=require('playwright')}catch{
 const bundled=path.join(process.env.USERPROFILE||require('node:os').homedir(),'.cache','codex-runtimes','codex-primary-runtime','dependencies','node','node_modules','playwright');
 playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||bundled);
}
const {chromium}=playwright;
const root=path.resolve(process.env.AIDERLOG_SITE_ROOT||path.join(__dirname,'..')),out=path.resolve(process.env.AIDERLOG_QA_OUT||path.join(root,'work','qa-site-v194'));fs.mkdirSync(out,{recursive:true});
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const match of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(match[1]);
const seed=`window.__qa193={auth(email='qa@example.invalid'){
 currentUser='mine';currentUserEmail=email;currentUserName='검증';
 firebaseState={ready:true,user:{uid:'localqa',email,name:'검증'},pair:null,partner:null,friends:[],incoming:[],outgoing:[],friendIncoming:[],friendOutgoing:[],directLetters:[]};
 privateOwner=email;privateData[email]=blankPrivateData(email,'검증');privateRefs[email]={writable:true};googleToken='local-fixture';
 privateData[email].personalItems=[{id:'retired-health',category:'health',title:'보존된 과거 기록',date:'2026-09-25',createdAt:1,details:{healthType:'meal'}},{id:'expense-existing',category:'finance',title:'월 구독',date:'2026-09-01',amount:19000,note:'기존 데이터',createdAt:2,details:{financeType:'expense',source:'생활 통장',cycle:'monthly',dueDay:27,paymentChecks:{}}}];
 savePrivateData=async()=>{window.__qa193.saved=(window.__qa193.saved||0)+1};
 saveCloudData=async()=>{window.__qa193.cloudSaved=(window.__qa193.cloudSaved||0)+1};
 persistOwnScheduleEvents=async()=>{events=[...ownScheduleEvents];window.__qa193.scheduleSaved=(window.__qa193.scheduleSaved||0)+1;renderCalendar()};
 loadCalendarEvents=async()=>{events=[...ownScheduleEvents];renderCalendar()};loadGoogleCalendarTargets=async()=>[];
 applyLoginUI();renderPersonal();
 },snapshot(){return structuredClone(privateData[currentUserEmail])},records(){return structuredClone(getRecords())},schedule(){return structuredClone(ownScheduleEvents)},month(){return [shown.getFullYear(),shown.getMonth()+1]}};\n`;
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.mjs':'text/javascript','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.webmanifest':'application/manifest+json'};
async function setup(browser,width,query=''){
 const context=await browser.newContext({viewport:{width,height:900},locale:'ko-KR',timezoneId:'Asia/Seoul',serviceWorkers:'block'}),page=await context.newPage(),errors=[],requests=[],missingLocalFiles=[],localResponses=[],failedLocalRequests=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('dialog',dialog=>dialog.accept());
 page.on('response',response=>{const url=new URL(response.url());if(url.origin==='http://core-site.invalid')localResponses.push({path:url.pathname,query:url.search,status:response.status()})});
 page.on('requestfailed',request=>{const url=new URL(request.url());if(url.origin==='http://core-site.invalid')failedLocalRequests.push({path:url.pathname,error:request.failure()?.errorText})});
 await page.addInitScript(()=>{const D=Date,now=new D('2026-09-27T12:00:00+09:00').valueOf();window.Date=class extends D{constructor(...args){super(...(args.length?args:[now]))}static now(){return now}}});
 await page.route('**/*',route=>{const url=new URL(route.request().url());requests.push(url.pathname);if(url.origin!=='http://core-site.invalid'||route.request().method()!=='GET')return route.abort();const rel=decodeURIComponent(url.pathname).slice(1)||'index.html',file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){missingLocalFiles.push({request:url.pathname,file:rel});return route.fulfill({status:404,body:'Not found'})}if(rel==='firebase-app.js')return route.fulfill({status:200,contentType:'text/javascript',body:'/* Network disabled in isolated browser fixture. */'});let body=fs.readFileSync(file);if(rel==='index.html')body=String(body).replace('  function applyLoginUI(){',seed+'  function applyLoginUI(){');return route.fulfill({status:200,contentType:mime[path.extname(file)]||'application/octet-stream',body})});
 await page.goto('http://core-site.invalid/'+query,{waitUntil:'networkidle'});await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
 return{page,context,errors,requests,missingLocalFiles,localResponses,failedLocalRequests};
}
async function assertControls(page,selector){
 const rows=await page.locator(selector).evaluateAll(elements=>elements.map(e=>{const r=e.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return {text:e.textContent.trim(),left:r.left,right:r.right,width:innerWidth,clickable:e===hit||e.contains(hit),height:r.height}}));
 for(const row of rows){assert(row.left>=0&&row.right<=row.width+1,`${row.text} is in viewport`);assert(row.clickable,`${row.text} is not clipped or covered`);assert(row.height>0)}
}
// Measured against the supplied v192 site with the same 900px viewport height.
const originalCalendar={1280:{width:885.6875,height:828,dayHeight:132},384:{width:360,height:748,dayHeight:120}};
async function assertCalendarSize(page,width){
 const layout=await page.evaluate(()=>{
  const rect=selector=>document.querySelector(selector).getBoundingClientRect().toJSON();
  return {calendar:rect('#calendar'),day:rect('#calendar .day'),lastDay:document.querySelector('#calendar .day:last-child').getBoundingClientRect().toJSON(),toolbar:rect('#page0>.cal-top'),dday:rect('#ddayManageBtn'),month:rect('#monthTitle'),controls:rect('.month-controls')};
 });
 const original=originalCalendar[width];assert(layout.calendar.width>=original.width-.1,'calendar retains original width');assert(layout.calendar.height>=original.height-.1,'calendar retains original height');assert(layout.day.height>=original.dayHeight-.1,'day cells retain original height');
 assert(layout.lastDay.bottom<=layout.calendar.bottom+1,'all six weeks fit in the calendar without clipping');
 assert(layout.toolbar.bottom<=layout.dday.top,'year/month and controls are above D-day');
 if(width>760){assert(layout.toolbar.left>=layout.calendar.right,'toolbar uses original right column');assert.equal(layout.calendar.top,layout.toolbar.top,'toolbar does not consume calendar height');}
 else assert(layout.toolbar.bottom<=layout.calendar.top,'mobile toolbar does not overlap calendar');
 return {original,actual:layout};
}
(async()=>{
 const browser=await chromium.launch({headless:true,...((process.env.PLAYWRIGHT_CHANNEL||process.platform==='win32')?{channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'}:{})}),results=[];
 try{for(const width of [1280,384]){
  const {page,context,errors,requests,missingLocalFiles,localResponses,failedLocalRequests}=await setup(browser,width,width===384?'?client-intake=retired-fixture&release=193':'');
  assert.equal(new URL(page.url()).searchParams.has('client-intake'),false,'retired intake query removed');
  assert.equal(await page.locator('html').evaluate(e=>e.classList.contains('client-intake-only')),false,'legacy intake link keeps the Schedule shell visible');
  assert.deepEqual(await page.locator('.tabs .tab:visible').allTextContents(),['SCHEDULE','ROUTINE','EVENT','PAPER']);
  assert.equal(await page.locator('button[data-schedule-view="calendar"]').count(),0,'Today is the calendar return control');
  await assertControls(page,'.tab,.schedule-tools-v193 button,#todayBtn');
  const calendarSize=await assertCalendarSize(page,width);
  await page.screenshot({path:path.join(out,'calendar-'+width+'.png'),fullPage:true});
  await page.locator('[data-schedule-view="finance"]').click();assert(await page.locator('#loginModal').isVisible(),'finance requires login');await page.locator('[data-close="loginModal"]').click();
  await page.evaluate(()=>__qa193.auth());
  await page.locator('#prevMonth').click();assert.deepEqual(await page.evaluate(()=>__qa193.month()),[2026,8]);await page.locator('#todayBtn').click();assert.deepEqual(await page.evaluate(()=>__qa193.month()),[2026,9]);
  for(const view of ['finance','workflow']){
   await page.locator('[data-schedule-view="'+view+'"]').click();await page.locator('#nextMonth').click();assert.deepEqual(await page.evaluate(()=>__qa193.month()),[2026,10]);
   const before=await page.evaluate(()=>JSON.stringify(__qa193.snapshot()));await page.locator('#todayBtn').click();assert.deepEqual(await page.evaluate(()=>__qa193.month()),[2026,9]);assert.equal(await page.locator('#page0').getAttribute('data-schedule-view'),'calendar');assert(await page.locator('#calendar').isVisible());assert.equal(await page.evaluate(()=>JSON.stringify(__qa193.snapshot())),before,'Today does not alter stored finance/workflow data');await assertCalendarSize(page,width);
  }
  await page.locator('[data-schedule-view="finance"]').click();await page.locator('[data-personal-add="finance"]').first().click();await page.locator('#personalEntryTitle').fill('저장 전 입력 보존');
  const beforeDraft=await page.evaluate(()=>({month:__qa193.month(),saved:__qa193.saved||0}));await page.locator('#todayBtn').evaluate(button=>button.click());assert(await page.locator('#personalEntryOverlay').isVisible(),'background Today cannot dismiss the active editor');assert.equal(await page.locator('#personalEntryTitle').inputValue(),'저장 전 입력 보존');assert.deepEqual(await page.evaluate(()=>({month:__qa193.month(),saved:__qa193.saved||0})),beforeDraft,'background Today cannot reset month or submit draft');await page.locator('#personalEntryClose').click();await page.locator('#todayBtn').click();
  await page.locator('#calendar .day[data-date="2026-09-27"]').click();await page.locator('#eventTitle').fill('검증 일정');await page.locator('#eventMemo').fill('일정 메모');
  await page.locator('#saveEvent').click();await page.waitForFunction(()=>!document.querySelector('#scheduleModal').classList.contains('open'));
  assert(await page.evaluate(()=>__qa193.schedule().some(row=>row.title==='검증 일정'&&row.date==='2026-09-27')),'schedule saves');
  await page.locator('#calendar .ev').filter({hasText:'검증 일정'}).first().click();assert.equal(await page.locator('#eventMemo').inputValue(),'일정 메모');await page.locator('#eventTitle').fill('검증 일정 수정');await page.locator('#saveEvent').click();await page.waitForFunction(()=>!document.querySelector('#scheduleModal').classList.contains('open'));
  assert(await page.evaluate(()=>__qa193.schedule().some(row=>row.title==='검증 일정 수정')),'schedule editor reopens and updates');
  await page.locator('[data-schedule-view="finance"]').click();assert.equal(await page.locator('#app').getAttribute('data-active-tab'),'schedule');assert(await page.locator('#personalDashboard').isVisible());assert(!(await page.locator('#calendar').isVisible()));
  assert(await page.locator('#personalDashboard').getByText('월 구독',{exact:true}).first().isVisible());
  await assertControls(page,'.schedule-tools-v193 button,#todayBtn');assert(await page.locator('#scheduleToolTitleV193').isVisible());
  await page.locator('[data-personal-edit="expense-existing"]').click();assert.equal(await page.locator('#personalEntryAmount').inputValue(),'19000');assert.equal(await page.locator('#personalFinanceSource').inputValue(),'생활 통장');
  await page.locator('#personalEntryAmount').fill('21000');await page.locator('#personalEntryTitle').fill('월 구독 수정');await page.locator('#personalEntryForm button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#personalEntryOverlay').hidden);
  assert.equal(await page.evaluate(()=>__qa193.snapshot().personalItems.find(row=>row.id==='expense-existing').amount),21000);
  await page.locator('[data-finance-check]').first().check();assert(await page.evaluate(()=>!!__qa193.snapshot().personalItems.find(row=>row.id==='expense-existing').details.paymentChecks['2026-09-27']));
  const actions=await page.locator('.finance-edit-v193,.finance-v59-card>.personal-record-delete').evaluateAll(elements=>elements.map(e=>e.getBoundingClientRect().toJSON()));assert(actions[0].right<=actions[1].left,'finance edit/delete do not overlap');
  await page.evaluate(()=>document.querySelector('#stage').scrollTop=0);
  await page.screenshot({path:path.join(out,'finance-'+width+'.png'),fullPage:true});
  await page.locator('[data-schedule-view="workflow"]').click();await page.locator('[data-personal-add="workflow"]').click();
  await page.locator('#personalEntryTitle').fill('새 작업');await page.locator('#personalWorkflowProject').fill('테스트 프로젝트');await page.locator('#personalWorkflowSteps').fill('첫 단계\n두 번째 단계');
  await page.locator('#personalEntryForm button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#personalEntryOverlay').hidden);
  assert(await page.evaluate(()=>__qa193.snapshot().personalItems.some(row=>row.category==='workflow'&&row.title==='새 작업')));
  await page.locator('[data-workflow-step]').first().click();assert.equal(await page.evaluate(()=>__qa193.snapshot().personalItems.find(row=>row.category==='workflow').details.progress),50);
  await page.evaluate(()=>document.querySelector('#stage').scrollTop=0);
  await page.screenshot({path:path.join(out,'workflow-'+width+'.png'),fullPage:true});
  assert(await page.evaluate(()=>__qa193.snapshot().personalItems.some(row=>row.id==='retired-health')),'hidden historical data preserved');
  await page.locator('.tab[data-tab="private"]').click();assert(await page.locator('#privateStage').isVisible());
  await page.getByRole('button',{name:'+ 루틴 생성',exact:true}).click();await page.locator('#privateRoutineText').fill('검증 루틴');await page.locator('#privateRoutineMini').fill('1분');await page.locator('#privateRoutineMore').fill('5분');await page.locator('#privateRoutineMax').fill('10분');await page.locator('#privateRoutineForm button[type="submit"]').click();
  await page.waitForFunction(()=>__qa193.snapshot().routines.some(row=>row.text==='검증 루틴'));
  await page.locator('[data-routine-date-status][data-date="2026-09-27"]:visible').first().click();await page.locator('[data-routine-status-value="MAX"]').click();
  await page.waitForFunction(()=>__qa193.snapshot().routines.some(row=>row.dailyLevels?.['2026-09-27']==='MAX'&&row.doneDates.includes('2026-09-27')));
  await page.locator('[data-routine-edit]:visible').first().click();assert.equal(await page.locator('#privateRoutineText').inputValue(),'검증 루틴');await page.locator('#privateRoutineText').fill('검증 루틴 수정');await page.locator('#privateRoutineForm button[type="submit"]').click();
  assert(await page.evaluate(()=>__qa193.snapshot().routines.some(row=>row.text==='검증 루틴 수정'&&row.dailyLevels?.['2026-09-27']==='MAX')),'routine edit preserves completion');
  await page.locator('.tab[data-tab="record"]').click();assert(await page.locator('#recordStage').isVisible());
  await page.locator('#newRecordTop').click();await page.locator('#recordTitle').fill('검증 EVENT 기록');await page.locator('#recordBody').fill('저장하고 다시 열 기록입니다.');await page.locator('#recordForm button[type="submit"]').click();
  await page.waitForFunction(()=>!document.querySelector('#recordModal').classList.contains('open'));
  assert(await page.evaluate(()=>__qa193.records().some(row=>row.title==='검증 EVENT 기록')),'EVENT record saves');
  await page.locator('.record-post').filter({hasText:'검증 EVENT 기록'}).getByRole('button',{name:'수정',exact:true}).click();assert.equal(await page.locator('#recordBody').inputValue(),'저장하고 다시 열 기록입니다.');await page.locator('#recordBody').fill('수정한 EVENT 내용');await page.locator('#recordForm button[type="submit"]').click();
  await page.waitForFunction(()=>!document.querySelector('#recordModal').classList.contains('open'));assert(await page.evaluate(()=>__qa193.records().some(row=>row.body==='수정한 EVENT 내용')),'EVENT record reopens and edits');
  await assertControls(page,'.tab');
  await page.locator('.tab[data-tab="paper"]').click();assert.match(await page.locator('#toast').textContent(),/지정된 연구 계정/);assert.equal(await page.locator('#app').getAttribute('data-active-tab'),'record');
  await page.evaluate(()=>__qa193.auth('qhals5060@gmail.com'));await page.locator('.tab[data-tab="paper"]').click();assert(await page.locator('#paperStage').isVisible());assert(await page.locator('aider-paper-workspace-v121').isVisible());
  await page.waitForLoadState('networkidle');
  for(const asset of ['/paper-workspace-v121.css','/paper-v159.css','/site-paper-modern-v165.css'])assert(localResponses.some(response=>response.path===asset&&response.status===200),`PAPER dynamic style loaded: ${asset}`);
  await page.locator('.tab[data-tab="schedule"]').click();assert(await page.locator('#calendar').isVisible());assert(!(await page.locator('#personalStage').isVisible()));
  const overflow=await page.evaluate(()=>({body:document.body.scrollWidth,viewport:innerWidth,toolbar:document.querySelector('.month-controls').getBoundingClientRect().toJSON()}));assert(overflow.body<=width+1,'no horizontal page overflow');
  assert(!requests.some(p=>/^\/(?:estate-|bio-admin-|consult-v|consult-intake|consult-deeplink|app-estate|work-calendar)/.test(p)),'retired bundles not loaded');
  await page.waitForLoadState('networkidle');
  assert.deepEqual(missingLocalFiles,[],'all requested local files exist after pruning');assert.deepEqual(failedLocalRequests,[],'local requests complete');assert.deepEqual(localResponses.filter(response=>response.status!==200),[],'all executed local asset requests return200');
  assert.deepEqual(errors,[]);results.push({width,errors,saved:await page.evaluate(()=>__qa193.saved),calendarSize,overflow,missingLocalFiles,failedLocalRequests,localResponses,checks:'original calendar dimensions, year/month controls above D-day, Today from calendar/finance/workflow, open draft preserved, navigation, schedule create/edit, ROUTINE create/MAX/edit, EVENT save/reopen/edit, finance edit/payment, workflow create/steps, historical preservation, PAPER restriction/allowed account, all local assets200 including PAPER shadow styles'});
  await context.close();
 }}finally{await browser.close();fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2))}
 console.log(JSON.stringify(results,null,2));
})().catch(error=>{console.error(error);process.exitCode=1});
