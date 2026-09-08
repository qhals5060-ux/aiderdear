// Real calendar module/projection function with isolated event/API doubles.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {installEstateCalendar,calendarMonthCells,calendarMonthShift,mergeCalendarProjection} from '../estate-calendar-view-v172.js';
import {calendarRows} from '../estate-domain-v171.js';
const keys=['tasks','visits','deals','customers','properties'];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const flush=async()=>{for(let i=0;i<20;i++)await Promise.resolve();};
const deferred=()=>{let resolve;const promise=new Promise(done=>resolve=done);return {promise,resolve};};
class Events{
  constructor(){this.handlers=[];}
  addEventListener(type,fn,{signal}={}){this.handlers.push({type,fn,signal});}
  async emit(type,detail={}){for(const h of this.handlers.filter(h=>h.type===type&&!h.signal?.aborted))await h.fn(detail);}
}
function fixture(records={}){
  const win=new Events(),doc=new Events();doc.visibilityState='visible';globalThis.window=win;globalThis.document=doc;
  const views=new Map(),calls=[],opens=[],notice=[];let uid='owner-a',override=null;
  const app={esc,today:()=> '2026-09-08',uid:()=>uid,registerView:(key,fn)=>views.set(key,fn),open:(...args)=>opens.push(args),notice:(...args)=>notice.push(args),api:{call:async(action,payload)=>{
    calls.push({action,payload});if(override)return override(action,payload);
    assert.equal(action,'calendar');const [kind,after]=payload.cursor.split(':'),start=Number(after)||0,all=records[kind]||[],page=all.slice(start,start+50),next=page.length===50?kind+':'+(start+50):keys[keys.indexOf(kind)+1]?keys[keys.indexOf(kind)+1]+':':null;
    return {rows:calendarRows({[kind]:page}),cursor:next};
  }}};
  installEstateCalendar(app);
  function container(){const el=new Events();el.classList={add(){}};el.hidden=false;el.innerHTML='';el.closest=()=>null;el.contains=target=>target.container===el;return el;}
  const element=container(),abort=new AbortController();
  const click=async(dataset={},attributes=[])=>{const button={dataset,container:element,closest:()=>button,hasAttribute:key=>attributes.includes(key)};await element.emit('click',{target:button});await flush();};
  return {app,views,calls,opens,notice,records,win,doc,element,abort,click,async start(){await views.get('calendar')({container:element,signal:abort.signal});},setUid:value=>uid=value,setHandler:fn=>override=fn,async changed(){await win.emit('aiderlog-estate-updated');await flush();}};
}
test('calendar dates cover six complete weeks with leap days and local month/year boundaries',()=>{
  const cells=calendarMonthCells('2024-02');assert.equal(cells.length,42);assert.equal(cells[0].weekday,0);assert.equal(cells[41].weekday,6);assert.equal(cells.filter(c=>c.inMonth).length,29);assert(cells.some(c=>c.date==='2024-02-29'));assert.equal(calendarMonthShift('2026-12',1),'2027-01');assert.equal(calendarMonthShift('2026-01',-1),'2025-12');assert.deepEqual(calendarMonthCells('2026-13'),[]);
});
test('stable source IDs deduplicate amended projections without mixing unrelated source pages',()=>{
  const before={id:'estate:visits:v1:visit',sourceKind:'visits',sourceId:'v1',date:'2026-09-09'};
  const rows=mergeCalendarProjection([before],[{...before,date:'2026-09-10'},{...before,id:'evil',sourceKind:'customers'}],'visits');assert.equal(rows.length,1);assert.equal(rows[0].date,'2026-09-10');assert.equal(before.date,'2026-09-09');
});
test('initial view reads one bounded page per source and subsequent 50-record pages retain every source projection',async()=>{
  const f=fixture({tasks:Array.from({length:53},(_,i)=>({id:'t'+i,title:'업무 '+i,date:'2026-09-08',status:'open'})),visits:[{id:'v1',date:'2026-09-09',time:'10:00'}],deals:[{id:'d1',title:'계약',stage:'preparation',contractDate:'2026-09-10',balanceDate:'2026-10-10'}]});
  await f.start();assert.equal(f.calls.length,5);assert.deepEqual(f.calls.map(c=>c.payload.cursor),keys.map(k=>k+':'));assert.match(f.element.innerHTML,/불러온 일정 53개/);assert.match(f.element.innerHTML,/아직 조회하지 않은 원본 범위/);
  await f.click({estateCalendarMore:'tasks'});assert.equal(f.calls.at(-1).payload.cursor,'tasks:50');assert.match(f.element.innerHTML,/불러온 일정 56개/);assert.match(f.element.innerHTML,/모든 원본 범위 확인 완료/);
});
test('month movement/TODAY never write; date registers a new task preset and event opens exact source',async()=>{
  const f=fixture();await f.start();await f.click({estateCalendarMonth:'1'});assert.match(f.element.innerHTML,/2026년 10월/);await f.click({},['data-estate-calendar-today']);assert.match(f.element.innerHTML,/2026년 9월/);await f.click({estateCalendarAdd:'2026-09-19'});assert.deepEqual(f.opens.pop(),['tasks',undefined,{date:'2026-09-19'}]);await f.click({estateCalendarSource:'visits',estateCalendarId:'v1'});assert.deepEqual(f.opens.pop(),['visits','v1']);assert.equal(f.calls.length,5);assert(f.calls.every(c=>c.action==='calendar'));
});
test('save invalidation rereads loaded depths, removes former date and completed tasks without calendar writes',async()=>{
  const records={tasks:[{id:'t1',title:'업무',date:'2026-09-08',status:'open'}],visits:[{id:'v1',date:'2026-09-09',time:'10:00'}]},f=fixture(records);await f.start();records.tasks[0].status='done';records.visits[0].date='2026-09-10';await f.changed();assert.match(f.element.innerHTML,/불러온 일정 1개/);assert.match(f.element.innerHTML,/aria-label="2026-09-10 10:00 부동산 방문"/);assert(!f.element.innerHTML.includes('aria-label="2026-09-09 10:00 부동산 방문"'));assert.equal(f.calls.length,10);assert(f.calls.every(c=>c.action==='calendar'));
});
test('source failure remains explicit and retry can refresh a previously complete source',async()=>{
  const f=fixture();await f.start();let fail=true;f.setHandler(async(action,payload)=>{if(payload.cursor==='visits:'&&fail)throw Error('조회 실패');return {rows:[],cursor:null};});await f.changed();assert.match(f.element.innerHTML,/조회 실패/);assert.match(f.element.innerHTML,/data-estate-calendar-more="visits"/);fail=false;await f.click({estateCalendarMore:'visits'});assert(!f.element.innerHTML.includes('조회 실패'));assert.match(f.element.innerHTML,/모든 원본 범위 확인 완료/);
});
test('hidden views make no refresh calls until visible again and account-switched late data is ignored',async()=>{
  const f=fixture();await f.start();f.doc.visibilityState='hidden';await f.changed();assert.equal(f.calls.length,5);f.doc.visibilityState='visible';await f.doc.emit('visibilitychange');await flush();assert.equal(f.calls.length,10);
  const gate=deferred();f.setHandler(()=>gate.promise);const pending=f.changed();await flush();f.setUid('owner-b');gate.resolve({rows:[{id:'private',sourceKind:'tasks',sourceId:'t1',title:'OLD OWNER SECRET',date:'2026-09-08'}],cursor:null});await pending;await flush();assert(!f.element.innerHTML.includes('OLD OWNER SECRET'));
});
test('in-flight save invalidation coalesces to a fresh snapshot and repeated cursors report an error',async()=>{
  const f=fixture();await f.start();const gate=deferred();let first=true;f.setHandler(async(action,payload)=>{if(first){first=false;return gate.promise;}return {rows:[],cursor:null};});const pending=f.changed();await flush();await f.win.emit('aiderlog-estate-updated');gate.resolve({rows:[{id:'old',sourceKind:'tasks',sourceId:'t1',title:'OLD VALUE',date:'2026-09-08'}],cursor:null});await pending;await flush();assert(!f.element.innerHTML.includes('OLD VALUE'));assert.equal(f.calls.length,15);
  f.setHandler(async(action,payload)=>({rows:[],cursor:payload.cursor}));await f.changed();assert.match(f.element.innerHTML,/조회 위치가 반복됩니다/);
});
test('refreshing a previously paged source pauses between pages when hidden and reloads its full depth on return',async()=>{
  const records={tasks:Array.from({length:53},(_,i)=>({id:'t'+i,title:'업무 '+i,date:'2026-09-08',status:'open'}))},f=fixture(records);await f.start();await f.click({estateCalendarMore:'tasks'});assert.match(f.element.innerHTML,/불러온 일정 53개/);
  const gate=deferred();f.setHandler(async(action,payload)=>payload.cursor==='tasks:'?gate.promise:{rows:[],cursor:null});const pending=f.changed();await flush();f.doc.visibilityState='hidden';gate.resolve({rows:calendarRows({tasks:records.tasks.slice(0,50)}),cursor:'tasks:50'});await pending;await flush();const paused=f.calls.length;assert.equal(f.calls.slice(-5).filter(c=>c.payload.cursor==='tasks:50').length,0);
  f.setHandler(null);f.doc.visibilityState='visible';await f.doc.emit('visibilitychange');await flush();assert.equal(f.calls.length-paused,6,'five first pages plus the previously loaded second task page');assert.equal(f.calls.at(-1).payload.cursor,'tasks:50');assert.match(f.element.innerHTML,/불러온 일정 53개/);
});
test('calendar markup escapes source titles and provides mobile day summary controls without horizontal fixed widths',async()=>{
  const f=fixture({tasks:[{id:'t1',title:'<img src=x onerror=alert(1)>',date:'2026-09-08',status:'open'}]});await f.start();assert(!f.element.innerHTML.includes('<img src=x'));assert(f.element.innerHTML.includes('&lt;img'));assert.match(f.element.innerHTML,/estate-calendar-mobile-count/);
  const css=fs.readFileSync(new URL('../estate-calendar-view-v172.css',import.meta.url),'utf8');assert(css.includes('repeat(7,minmax(0,1fr))'));assert(css.includes('@media(max-width:600px)'));assert(!/min-width:\s*(?:3\d\d|[4-9]\d\d)px/.test(css));
});
