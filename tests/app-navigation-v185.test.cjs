const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assets=path.resolve(__dirname,'../android-src/assets');
const ui=fs.readFileSync(path.join(assets,'schedule-ui-v184.js'),'utf8');
function navigationFixture(){
  const handlers={document:[],window:[]},frames=new Map();let serial=0,todayCalls=0;
  class Clock extends Date{constructor(...args){super(...(args.length?args:['2026-09-20T12:00:00']));}}
  const document={body:{},querySelector:()=>null,addEventListener:(name,fn)=>{if(name==='click')handlers.document.push(fn);}};
  const window={document,addEventListener:(name,fn,capture)=>{if(name==='click')handlers.window.push({fn,capture});},cancelAnimationFrame:id=>frames.delete(id)};
  const context={window,document,Date:Clock,MutationObserver:class{observe(){}},requestAnimationFrame:fn=>{frames.set(++serial,fn);return serial;}};
  vm.runInNewContext(fs.readFileSync(path.join(assets,'app-calendar-view-v176.js'),'utf8'),context);
  vm.runInNewContext(ui,context);
  const calendar=window.AiderAppCalendarViewV176.create(null,()=>new Clock());
  function click(attribute,value=''){
    const button={id:'',dataset:attribute==='data-calendar-shift-v125'?{calendarShiftV125:value}:{},hasAttribute:key=>key===attribute,closest:()=>button,matches:selector=>selector.split(',').some(part=>part===`[${attribute}]`)};
    const event={target:button,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopImmediatePropagation(){this.stopped=true;}};
    for(const handler of handlers.window.filter(row=>row.capture))handler.fn(event);
    if(!event.stopped){
      if(attribute==='data-calendar-today-v125'){todayCalls++;calendar.today();}
      if(attribute==='data-calendar-shift-v125')calendar.move(value);
      for(const handler of handlers.document)handler(event);
    }
    return event;
  }
  return {calendar,click,todayCalls:()=>todayCalls};
}
test('Weekly → next week → Today returns through the real month controller exactly once',()=>{
  const f=navigationFixture();f.calendar.focus('2027-04-12');f.click('data-week-toggle-v184');
  assert.equal(f.click('data-calendar-shift-v125','1').stopped,true);
  assert.equal(f.calendar.current().anchor.getMonth(),3,'weekly arrows leave the saved monthly cursor alone');
  const event=f.click('data-calendar-today-v125');assert.equal(event.stopped,false);assert.equal(event.prevented,false);
  assert.equal(f.todayCalls(),1);assert.equal(f.calendar.current().anchor.getFullYear(),2026);assert.equal(f.calendar.current().anchor.getMonth(),8);
  assert.equal(f.click('data-calendar-shift-v125','1').stopped,false,'Today has left Weekly');
  assert.equal(f.calendar.current().anchor.getMonth(),9,'arrows again navigate the monthly calendar');
});
test('Today already in month and toggling Weekly back off retain normal calendar controls',()=>{
  const f=navigationFixture();f.calendar.focus('2025-01-01');f.click('data-calendar-today-v125');assert.equal(f.todayCalls(),1);
  f.click('data-week-toggle-v184');f.click('data-week-toggle-v184');
  assert.equal(f.click('data-calendar-shift-v125','-1').stopped,false);assert.equal(f.calendar.current().anchor.getMonth(),7);
  f.click('data-calendar-today-v125');assert.equal(f.todayCalls(),2);assert.equal(f.calendar.current().anchor.getDate(),20);
});

// Optional integration check uses only the local RAM-backed preview fixture.
const base=process.env.AIDERLOG_PREVIEW_URL;
test('actual app preserves schedules/todos, restores Weekly before paint and leaves stable DOM alone',{skip:!base,timeout:60000},async()=>{
  const {chromium}=require(process.env.AIDERLOG_PLAYWRIGHT_MODULE||'playwright');
  const browser=await chromium.launch({headless:true,channel:process.env.AIDERLOG_BROWSER_CHANNEL||'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:384,height:824}}),origin=new URL(base).origin,errors=[];
    page.on('pageerror',error=>errors.push(error.message));
    await page.route('**/*',route=>route.request().url().startsWith(origin+'/')?route.continue():route.abort());
    await page.goto(base+'/app/index.html?android-preview=1&demo=1#home');
    await page.waitForFunction(()=>document.documentElement.dataset.previewFixtureV184==='true');
    await page.waitForTimeout(250);
    const snapshot=()=>page.evaluate(()=>({events:window.AiderLogCalendarV125.rows(),notes:window.AiderTodoV179.snapshot(),ddays:window.AiderAppDdayV175.snapshot()}));
    const before=await snapshot();assert(before.events.length>0);assert(before.notes.checklists.length>0);
    await page.locator('[data-calendar-shift-v125="1"]').click();
    await page.locator('[data-week-toggle-v184]').click();
    await page.waitForSelector('.schedule-calendar-v119.weekly-active-v184');
    await page.locator('[data-calendar-shift-v125="1"]').click();
    await page.locator('[data-calendar-today-v125]').click();
    await page.waitForFunction(()=>!document.querySelector('.schedule-calendar-v119').classList.contains('weekly-active-v184'));
    const current=await page.evaluate(()=>{const today=new Date(),cell=document.querySelector('.schedule-day-v119.today.selected');return {selected:cell?.dataset.scheduleDateV125,expected:`${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`,weeklyHidden:document.querySelector('.weekly-view-v184').hidden,heading:document.querySelector('.schedule-calhead-v119 h1').textContent,month:today.toLocaleString('en-US',{month:'long'})};});
    assert.equal(current.selected,current.expected);assert.equal(current.weeklyHidden,true);assert(current.heading.includes(current.month));
    await page.locator('[data-week-toggle-v184]').click();
    await page.waitForSelector('.schedule-calendar-v119.weekly-active-v184');
    const restored=await page.evaluate(async()=>{window.renderHome();await Promise.resolve();return {active:document.querySelector('.schedule-calendar-v119').classList.contains('weekly-active-v184'),days:document.querySelectorAll('.weekly-days-v184 [data-week-date-v184]').length};});
    assert.equal(restored.active,true,'a data rerender must restore Weekly in the mutation microtask, before a monthly frame can paint');assert.equal(restored.days,7);
    await page.waitForTimeout(150);
    const steady=await page.evaluate(async()=>{
      const heading=document.querySelector('.schedule-calhead-v119 h1'),days=document.querySelector('.weekly-days-v184'),notes=document.querySelector('.weekly-notes-v184');
      const children=[heading.firstElementChild,days.firstElementChild,notes.firstElementChild];let changes=0;
      const observer=new MutationObserver(records=>changes+=records.length);for(const host of [heading,days,notes])observer.observe(host,{childList:true,subtree:true});
      window.AiderScheduleUIV184.refresh();await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);observer.disconnect();
      return {changes,same:children.every((node,index)=>node===[heading,days,notes][index].firstElementChild)};
    });
    assert.equal(steady.same,true);assert.equal(steady.changes,0,'unchanged refreshes retain existing calendar/title/note nodes');
    assert.deepEqual(await snapshot(),before,'navigation and rendering do not mutate persisted data');assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});
