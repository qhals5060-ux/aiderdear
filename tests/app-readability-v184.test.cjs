/* Optional real-browser geometry check. Set AIDERLOG_PREVIEW_URL to the local
   app preview server; network requests outside that origin are blocked. */
const test=require('node:test'),assert=require('node:assert/strict');
const base=process.env.AIDERLOG_PREVIEW_URL;
test('phone and unfolded screens open schedule, record, todo, memo and native sheets at three fifths',{skip:!base,timeout:90000},async()=>{
 const {chromium}=require('playwright'),browser=await chromium.launch({headless:true,channel:process.env.AIDERLOG_BROWSER_CHANNEL||'msedge'});
 try{for(const viewport of [{width:384,height:824},{width:768,height:900}]){
  const page=await browser.newPage({viewport}),origin=new URL(base).origin,errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
  await page.goto(base+'/app/index.html?android-preview=1#home');await page.waitForTimeout(450);
  await page.evaluate(async()=>{const user={uid:'geometry-qa',email:'geometry@example.invalid'};window.AiderDearFirebase={getState:()=>({user}),subscribe:()=>{},readPrivateData:async()=>({checklists:[],memos:[]}),readDdayData:async()=>({items:[],activeId:'',activeScope:''})};window.dispatchEvent(new Event('aiderdear-firebase-ready'));await window.AiderTodoV179.refresh();document.querySelector('#intro')?.classList.remove('on');document.querySelector('#intro')?.remove();});
  const measure=async selector=>{await page.waitForTimeout(90);const box=await page.locator(selector).boundingBox();assert(box,selector+' is visible');assert(Math.abs(box.height-viewport.height*.6)<2,`${viewport.width} ${selector}: ${box.height}, expected ${viewport.height*.6}`);assert(Math.abs(box.y+box.height-viewport.height)<3,selector+' is bottom aligned');assert(box.x>=-1&&box.x+box.width<=viewport.width+1,selector+' fits horizontally');};
  await page.evaluate(()=>window.AiderLogCalendarV125.openSchedule('2026-09-20'));await measure('.schedule-dialog-v125>section');await page.locator('[data-schedule-dialog-close-v125]').click();
  for(const kind of ['todo','memo']){await page.evaluate(kind=>window.AiderTodoV179.edit('','',kind),kind);await measure('.todo-editor-v179');await page.locator('[data-todo-close-v179]').click();}
  await page.evaluate(()=>{go('event',false);openEventEditorV111('record');});await measure('.event-editor-sheet-v111');await page.locator('[data-event-editor-close]').first().click();
  // Native dialog fixture uses the exact production shell from c167's modal().
  await page.evaluate(()=>{const dialog=document.createElement('dialog');dialog.className='c167-dialog cw168-sheet';dialog.id='geometry-native-sheet';dialog.innerHTML='<form><header><h3>고객 추가</h3><button type="button">닫기</button></header><div class="c167-modal-body"><label>이름<input></label></div><footer><button>저장</button></footer></form>';document.body.append(dialog);dialog.showModal();window.AiderLogReadabilityV184.refresh();});await measure('#geometry-native-sheet');
  const frame=await page.evaluate(()=>({top:parseFloat(getComputedStyle(document.body).paddingTop),bottom:parseFloat(getComputedStyle(document.body).paddingBottom)}));assert(Math.abs(frame.top-96*.3/25.4)<.05);assert.equal(frame.top,frame.bottom);
  assert.deepEqual(errors,[]);await page.close();
 }}finally{await browser.close();}
});
