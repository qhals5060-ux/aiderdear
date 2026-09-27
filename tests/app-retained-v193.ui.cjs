const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
// Local fixture only. Blocks all external requests and supplies in-memory Firebase writes.
let playwright;try{playwright=require('playwright')}catch{playwright=require(process.env.PLAYWRIGHT_MODULE_PATH||path.join(process.env.USERPROFILE||require('node:os').homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'))}
const root=path.resolve(process.env.AIDERLOG_APP_ASSETS||path.join(__dirname,'../android-src/assets'));
const out=path.resolve(process.env.AIDERLOG_QA_OUT||path.join(__dirname,'../work/qa-app-retained-v193'));fs.mkdirSync(out,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.json':'application/json','.webmanifest':'application/manifest+json'};
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,...((process.env.PLAYWRIGHT_CHANNEL||process.platform==='win32')?{channel:process.env.PLAYWRIGHT_CHANNEL||'msedge'}:{})});
 const context=await browser.newContext({viewport:{width:412,height:915},isMobile:true,hasTouch:true,locale:'ko-KR',timezoneId:'Asia/Seoul',serviceWorkers:'block'}),page=await context.newPage(),errors=[],responses=[],missing=[],failed=[],checks=[];
 const pass=name=>{checks.push(name);console.log('PASS',name)};
 try{
  page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  page.on('response',r=>{if(r.url().startsWith('http://core-app.invalid/'))responses.push({path:new URL(r.url()).pathname,status:r.status()})});
  page.on('requestfailed',r=>{if(r.url().startsWith('http://core-app.invalid/'))failed.push({path:new URL(r.url()).pathname,error:r.failure()?.errorText})});
  await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!=='http://core-app.invalid'||route.request().method()!=='GET')return route.abort();const rel=decodeURIComponent(url.pathname).slice(1)||'index.html',file=path.resolve(root,rel);if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){missing.push(rel);return route.fulfill({status:404,body:'Not found'})}return route.fulfill({status:200,contentType:mime[path.extname(file)]||'application/octet-stream',body:fs.readFileSync(file)})});
  await page.addInitScript(()=>{sessionStorage.setItem('aiderlog-splash-shown-session-v150','1');localStorage.setItem('aiderlog-private-v20',JSON.stringify({routines:[],personalItems:[{id:'old-health',category:'health',title:'보존된 과거 건강 기록'}]}));});
  await page.goto('http://core-app.invalid/',{waitUntil:'networkidle'});
  await page.waitForFunction(()=>typeof go==='function'&&typeof saveRoutineEditorV111==='function'&&window.AiderLogCalendarV125);
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
  await page.screenshot({path:path.join(out,'schedule.png'),fullPage:true});
  await page.evaluate(()=>go('routine',false));await page.locator('[data-routine-create-open]:visible').click();const routineForm=page.locator('#routineEditorFormV111');await routineForm.locator('[name="text"]').fill('검증 루틴');await routineForm.locator('[name="miniText"]').fill('1분');await routineForm.locator('[name="maxText"]').fill('10분');await page.locator('button[form="routineEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(()=>P.routines.some(r=>r.text==='검증 루틴')&&!document.querySelector('#routineEditorFormV111'));
  const routineId=await page.evaluate(()=>P.routines.find(r=>r.text==='검증 루틴').id);await page.locator('[data-routine-id="'+routineId+'"][data-routine-level="MAX"]').click();
  await page.waitForFunction(date=>P.routines.some(r=>r.dailyLevels?.[date]==='MAX'&&r.doneDates.includes(date)),todayKey);
  await page.locator('[data-routine-open="'+routineId+'"]').click();await page.locator('[data-routine-edit-open="'+routineId+'"]').click();assert.equal(await routineForm.locator('[name="text"]').inputValue(),'검증 루틴');await routineForm.locator('[name="text"]').fill('수정된 루틴');await page.locator('button[form="routineEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(date=>P.routines.some(r=>r.text==='수정된 루틴'&&r.dailyLevels?.[date]==='MAX'),todayKey);assert(await page.evaluate(()=>P.personalItems.some(r=>r.id==='old-health')));pass('Routine creates, marks MAX complete, and edits without losing completion or historical data');
  await page.screenshot({path:path.join(out,'routine.png'),fullPage:true});
  await page.evaluate(()=>go('event',false));await page.locator('[data-event-create="record"]').click();const record=page.locator('#eventEditorFormV111');await record.locator('[name="title"]').fill('검증 EVENT 기록');await record.locator('[name="body"]').fill('다시 열 기록입니다.');await page.locator('button[form="eventEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(()=>A.records.some(r=>r.title==='검증 EVENT 기록')&&!document.querySelector('#eventEditorFormV111'));
  const recordId=await page.evaluate(()=>A.records.find(r=>r.title==='검증 EVENT 기록').id);await page.locator('[data-record-edit="'+recordId+'"]').first().click();assert.equal(await record.locator('[name="body"]').inputValue(),'다시 열 기록입니다.');await record.locator('[name="body"]').fill('수정된 EVENT 내용');await page.locator('button[form="eventEditorFormV111"][type="submit"]').click();
  await page.waitForFunction(()=>A.records.some(r=>r.body==='수정된 EVENT 내용')&&!document.querySelector('#eventEditorFormV111'));pass('EVENT record saves, reopens and edits through its existing form');
  await page.screenshot({path:path.join(out,'event.png'),fullPage:true});
  const persisted=await page.evaluate(()=>({private:JSON.parse(localStorage.getItem('aiderlog-private-v20')),app:JSON.parse(localStorage.getItem('aiderlog-app-v20')),writes:{private:__retained193.privateWrites.length,app:__retained193.appWrites.length,schedule:__retained193.scheduleWrites.length}}));
  assert(persisted.private.routines.some(r=>r.text==='수정된 루틴'&&r.dailyLevels?.[todayKey]==='MAX'));assert(persisted.app.scheduleEvents.some(r=>r.title==='수정된 일정'));assert(persisted.app.records.some(r=>r.body==='수정된 EVENT 내용'));assert(persisted.writes.private>=3&&persisted.writes.app>=4&&persisted.writes.schedule===2);pass('Local cache and isolated cloud-write boundary contain the edited records');
  await page.waitForLoadState('networkidle');assert.deepEqual(missing,[]);assert.deepEqual(failed,[]);assert.deepEqual(responses.filter(r=>r.status!==200),[]);assert.deepEqual(errors,[]);pass('Zero local 404s, failed asset requests or page runtime errors');
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({checks,errors,missing,failed,responses,writes:persisted.writes},null,2));
 }catch(error){await page.screenshot({path:path.join(out,'failure.png'),fullPage:true}).catch(()=>{});fs.writeFileSync(path.join(out,'failure.json'),JSON.stringify({error:String(error),errors,missing,failed,checks,html:await page.locator('body').innerText().catch(()=>''),forms:await page.locator('form').evaluateAll(es=>es.map(e=>({id:e.id,html:e.outerHTML}))).catch(()=>[])},null,2));throw error}
 finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
