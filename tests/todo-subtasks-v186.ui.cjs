/* Actual app UI, local RAM-only preview. Run with its preview server on port 8844. */
const assert=require('node:assert/strict');
const path=require('node:path');
const {chromium}=require(process.env.AIDER_PLAYWRIGHT_PATH||path.join(process.env.USERPROFILE,'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'));

(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'}),errors=[];
 try{
  const page=await browser.newPage({viewport:{width:360,height:840}});page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8844/app/index.html?android-preview=1&demo=1#home');
  await page.waitForFunction(()=>document.documentElement.dataset.previewFixtureV184==='true');
  await page.evaluate(()=>window.AiderTodoV179.open('todo'));
  const todoPage=page.locator('#todo.on');
  await todoPage.locator('[data-todo-add-v179="todo"]').click();
  const sheet=page.locator('[data-todo-editor-v179]');
  assert.equal(await sheet.locator('header button').first().textContent(),'저장');assert(await sheet.locator('header button').nth(1).getAttribute('data-todo-close-v179')!==null);
  const editorStyle=await sheet.evaluate(element=>({titleHeight:element.querySelector('[name=text]').getBoundingClientRect().height,saveColor:getComputedStyle(element.querySelector('[type=submit]')).color}));
  assert.equal(editorStyle.titleHeight,34);assert.equal(editorStyle.saveColor,'rgb(255, 255, 255)');
  await sheet.locator('[name="text"]').fill('하위 할 일을 포함한 투두 테스트');
  await sheet.locator('[name="date"]').fill('2026-12-03');
  await sheet.locator('[data-todo-subtask-add-v186]').click();
  await sheet.locator('[data-todo-subtask-v186] input[type="text"]').nth(0).fill('자료 확인');
  await sheet.locator('[data-todo-subtask-add-v186]').click();
  await sheet.locator('[data-todo-subtask-v186] input[type="text"]').nth(1).fill('제출');
  await sheet.locator('[data-todo-subtask-v186] input[type="checkbox"]').nth(0).check();
  await sheet.locator('[type="submit"]').click();await sheet.waitFor({state:'detached'});
  let created=await page.evaluate(()=>window.AiderTodoV179.snapshot().checklists.find(row=>row.text==='하위 할 일을 포함한 투두 테스트'));
  assert.equal(created.subtasks.length,2);assert.equal(created.subtasks[0].done,true);
  const id=created.id,row=todoPage.locator(`[data-todo-edit-v179="${id}"].todo-copy-v179`);
  const layout=await row.evaluate(element=>{const title=element.querySelector('b'),date=element.querySelector('time'),t=title.getBoundingClientRect(),d=date.getBoundingClientRect();return {titleY:t.y,dateY:d.y,titleRight:t.right,dateX:d.x,line:getComputedStyle(title).whiteSpace};});
  assert(Math.abs(layout.titleY-layout.dateY)<3);assert(layout.dateX>layout.titleRight);assert.equal(layout.line,'nowrap');
  await row.click();await sheet.locator('[data-todo-subtask-v186] input[type="text"]').nth(0).fill('자료 최종 확인');
  await sheet.locator('[data-todo-subtask-v186] input[type="checkbox"]').nth(1).check();
  await sheet.locator('[data-todo-subtask-remove-v186]').nth(0).click();
  await sheet.locator('[type="submit"]').click();await sheet.waitFor({state:'detached'});
  await page.evaluate(()=>window.AiderTodoV179.refresh());
  const edited=await page.evaluate(id=>window.AiderTodoV179.snapshot().checklists.find(row=>row.id===id),id);
  assert.deepEqual(edited.subtasks,[created.subtasks[1]].map(row=>({...row,done:true})));
  await row.click();assert.equal(await sheet.locator('[data-todo-subtask-v186] input[type="text"]').inputValue(),'제출');assert(await sheet.locator('[data-todo-subtask-v186] input[type="checkbox"]').isChecked());
  await sheet.locator('[data-todo-close-v179]').click();
  await todoPage.locator('[data-todo-add-v179="memo"]').click();assert.equal(await sheet.locator('header button').first().textContent(),'저장');assert(await sheet.locator('header button').nth(1).getAttribute('data-todo-close-v179')!==null);assert.equal(await sheet.locator('[data-todo-subtask-add-v186]').count(),0);
  await sheet.locator('[name="text"]').fill('하위 투두와 별도로 보존되는 메모');await sheet.locator('[type="submit"]').click();await sheet.waitFor({state:'detached'});
  const snapshot=await page.evaluate(()=>window.AiderTodoV179.snapshot());assert.equal(snapshot.memos.length,3);assert.equal(snapshot.checklists.find(row=>row.id===id).subtasks.length,1);
  await page.setViewportSize({width:768,height:900});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
  assert.deepEqual(errors,[]);console.log('v186 todo UI: create / edit / child check / child delete / save order / one-line due date / memo isolation / Fold layout passed.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
