const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const asset = name => fs.readFileSync(path.join(root,'android-src/assets',name),'utf8');
const moduleSource = asset('app-dday-v175.js');
const fixed = Date.parse('2026-09-12T06:00:00Z');
const NativeDate = Date;
class FixedDate extends NativeDate {constructor(...args){super(...(args.length?args:[fixed]));}static now(){return fixed;}}
function ddayFixture(reader=async()=>({items:[],activeId:'',activeScope:''})){
  const state={user:{uid:'u1',email:'owner@example.test'},pair:null},handlers=new Map();let read=reader,homes=0;
  const window={AiderDearFirebase:{getState:()=>state,readDdayData:()=>read()},addEventListener:(type,fn)=>handlers.set(type,fn),renderHome:()=>homes++};
  const document={visibilityState:'visible',addEventListener(){}};
  vm.runInNewContext(moduleSource,{window,document,Date:FixedDate,alert(){},console});
  return{api:window.AiderAppDdayV175,state,read:fn=>{read=fn},event:type=>handlers.get(type)?.(),homes:()=>homes};
}
test('Android reads dedicated selected D-day and distinguishes same IDs by source scope',async()=>{
  const own={id:'same',sourceScope:'user:u1',title:'개인',date:'2026-10-01'},pair={id:'same',sourceScope:'pair:p1',title:'커플',date:'2026-12-01'};
  const f=ddayFixture(async()=>({items:[own,pair],activeId:'same',activeScope:'pair:p1'}));
  await f.api.refresh();assert.equal(f.api.selected().title,'커플');assert.ok(f.homes()>0);
});
test('Android D-day failed reload preserves the last confirmed visible record',async()=>{
  const row={id:'a',sourceScope:'user:u1',title:'기념일',date:'2026-10-01'},f=ddayFixture(async()=>({items:[row],activeId:'a',activeScope:'user:u1'}));
  await f.api.refresh();f.read(async()=>{throw Error('offline')});await f.api.refresh(true);assert.equal(f.api.selected().title,'기념일');
  f.read(async()=>({items:[{...row,title:'복구'}],activeId:'a',activeScope:'user:u1'}));await f.api.refresh(true);assert.equal(f.api.selected().title,'복구');
});
test('Android D-day coalesces concurrent reloads',async()=>{
  let resolve,calls=0;const f=ddayFixture(()=>{calls++;return new Promise(r=>resolve=r)});
  const first=f.api.refresh(),second=f.api.refresh();await Promise.resolve();assert.equal(calls,1);resolve({items:[],activeId:'',activeScope:''});await Promise.all([first,second]);assert.equal(calls,1);
});
test('Android D-day response from a signed-out account cannot reappear',async()=>{
  let resolve;const f=ddayFixture(()=>new Promise(r=>resolve=r));const read=f.api.refresh();await Promise.resolve();f.state.user=null;f.event('aiderdear-firebase-state');resolve({items:[{id:'old',sourceScope:'user:u1',title:'private'}],activeId:'old',activeScope:'user:u1'});await read;assert.equal(f.api.selected(),null);
});
test('Android D-day scope change clears old rows while the new account loads',async()=>{
  const f=ddayFixture(async()=>({items:[{id:'old',sourceScope:'user:u1',title:'old'}],activeId:'old',activeScope:'user:u1'}));await f.api.refresh();let resolve;f.read(()=>new Promise(r=>resolve=r));f.state.user={uid:'u2'};f.event('aiderdear-firebase-state');assert.equal(f.api.selected(),null);await Promise.resolve();resolve({items:[],activeId:'',activeScope:''});await f.api.refresh();assert.equal(f.api.selected(),null);
});
test('Android D-day matches site Korean date and inclusive anniversary count',()=>{
  const f=ddayFixture();assert.equal(f.api.count({date:'2026-09-12'}),'D-DAY');assert.equal(f.api.count({date:'2026-09-12',mode:'since'}),'D+1');assert.equal(f.api.count({date:'2026-09-11',mode:'since'}),'D+2');assert.equal(f.api.count({date:'2026-10-01'}),'D-19');
});
test('Android D-day actions cannot overwrite legacy whole-app payloads',()=>{
  assert.doesNotMatch(moduleSource,/saveApp\(|writeAppData\(|A\.ddays|activeDdayId\s*=/);
  assert.match(moduleSource,/api\(\)\.mutateDday\(action\)/);
  assert.match(moduleSource,/sourceScope:item\.sourceScope/);
  assert.match(moduleSource,/draft\?\.fingerprint!==fingerprint/);
  assert.match(moduleSource,/if\(await mutate\(/);
});
test('Android calendar business rows are minimized and open a read-only view',()=>{
  const source=asset('feature-system-v125.js'),fn=source.match(/function scheduleRowsV125\(\) \{[^\n]+/)[0],context={window:{AiderBusinessCalendarV175:{minimal:r=>({id:r.id,title:r.title,projectionSource:r.projectionSource,readOnly:true})}},baseScheduleRowsV125:()=>[{id:'personal',note:'mine'},{id:'oldwork',calendarScope:'work',note:'private'}],privateScheduleRowsV148:()=>[{id:'newwork',projectionSource:'work-task',note:'private'}]};
  vm.runInNewContext(fn+';globalThis.result=scheduleRowsV125()',context);
  assert.equal(context.result[0].note,'mine');assert.equal(context.result[1].note,undefined);assert.equal(context.result[2].note,undefined);assert.equal(context.result[2].readOnly,true);
  assert.match(source,/if\(projected\)\{closeScheduleV125\(\);window\.AiderBusinessCalendarV175\?\.open\(projected\);return\}/);
  assert.doesNotMatch(source,/<option value="consulting">Consulting<\/option>|<option value="work">Work<\/option>/);
  assert.match(source,/if\(scope!=='schedule'\)/);
  assert.doesNotMatch(source,/await app\.newWorkTask\(seed\)|await app\.newConsultTask\(seed\)/);
});
test('Android calendar has a stable common status line; no legacy private-period or unscoped mood fallback',()=>{
  const feature=asset('feature-system-v125.js'),emotion=asset('experience-v145.js');
  assert.match(feature,/data-schedule-date-v125="\$\{key\}" data-date="\$\{key\}"/);
  assert.match(feature,/class="calendar-status-icons"/);
  assert.match(feature,/AiderPrivateCalendarUIV175\?\.calendarChanged\(\)/);
  assert.doesNotMatch(emotion,/localStorage\.getItem\('aiderlog-emotion|partnerPeriod|hasPeriod\(/);
  assert.match(emotion,/source\.own\?'is-own':'is-partner'/);
  assert.match(emotion,/scope!==lastScope\|\|scope!==currentScope/);
});
test('Android profile birthday save is bound to the rendered user, preserves lunar settings and inputs on failure',()=>{
  const profile=asset('experience-v137.js');assert.match(profile,/id="loginBirthDate"/);assert.match(profile,/data-profile-user-v175/);
  assert.match(profile,/form\.dataset\.profileUserV175!==person\.uid/);assert.match(profile,/birthCalendar:person\.birthCalendar\|\|'solar',birthLeap:!!person\.birthLeap/);
  assert.match(profile,/입력은 유지됩니다/);assert.match(profile,/AiderPrivateCalendarUIV175\?\.calendarChanged\(\)/);
});
test('Android includes its own presentation and the new shared features, not desktop Estate UI',()=>{
  const html=asset('index.html');for(const name of ['insight-range-v175.js','insight-range-v175.css','business-calendar-v175.js','business-calendar-v175.css','private-calendar-ui-v175.js','private-calendar-v175.css','app-dday-v175.js','app-calendar-v175.css','estate-calendar-v171.js'])assert.ok(html.includes(name),name);
  assert.doesNotMatch(html,/<script[^>]+(?:estate-ui-v171|site-calendar-v175)\.js/);
  assert.ok(html.indexOf('<script src="./insight-range-v175.js')<html.indexOf('<script src="./experience-v143.js'));
});
test('Android profile entry is initialized before unrelated workspace bootstrap',()=>{
  const source=asset('experience-v137.js');
  assert.doesNotMatch(source,/profileDiagnosticV175|traceV175|profilePointerdownV175/);
  assert.match(source,/let profileBoundV175=false/);
  assert.match(source,/bindProfileButton\(\);\s*window\.AiderLogProfileV175=Object\.freeze/);
  assert.match(source,/queued=false;bindProfileButton\(\);restoreMy\(\)/);
});
test('Android calendar re-applies account emotion badges after each calendar render and viewport change',()=>{
  assert.match(asset('feature-system-v125.js'),/bindScheduleV125\(\);window\.AiderLogV145\?\.decorateCalendar\(\)/);
  assert.match(asset('experience-v145.js'),/addEventListener\('resize',scheduleRefresh\)/);
  assert.match(asset('experience-v145.js'),/addEventListener\('aiderlog-page-changed',scheduleRefresh\)/);
});
test('Android guide does not offer editing projected business records from Schedule',()=>{
  assert.doesNotMatch(asset('experience-v143.js'),/Consulting과 Work 마감도 같은 캘린더에서 확인하고 수정/);
  assert.match(asset('experience-v143.js'),/등록과 수정은 해당 업무 페이지에서/);
  assert.match(asset('index.html'),/<title>AiderLog<\/title>/);
});
test('Android routes live date clicks at window capture before legacy page handlers',()=>{
  const source=asset('feature-system-v125.js');
  const start=source.indexOf("  // Day cells may be rebuilt");
  const end=source.indexOf("  installRoutineStatsModal();",start);
  assert.ok(start>0&&end>start);
  const handlers=[],opened=[],window={addEventListener:(type,handler,capture)=>handlers.push({type,handler,capture})};
  vm.runInNewContext(source.slice(start,end),{window,openScheduleV125:value=>opened.push(value)});
  assert.equal(handlers.length,1);assert.equal(handlers[0].type,'click');assert.equal(handlers[0].capture,true);
  const day={dataset:{scheduleDateV125:'2026-09-14'},closest:()=>null};
  let prevented=0,stopped=0;
  const event={target:{closest:selector=>{assert.equal(selector,'#home [data-schedule-date-v125]');return day}},preventDefault:()=>prevented++,stopImmediatePropagation:()=>stopped++};
  handlers[0].handler(event);assert.deepEqual(opened,['2026-09-14']);assert.equal(prevented,1);assert.equal(stopped,1);
  day.closest=()=>({inert:true});handlers[0].handler(event);assert.equal(opened.length,1);
  event.target.closest=()=>null;handlers[0].handler(event);assert.equal(opened.length,1);
  assert.doesNotMatch(source,/scheduleDateDelegateV175/);
});
test('Android account decoration is idempotent after SVG serialization and still updates changed data',()=>{
  const source=asset('experience-v136.js');
  const start=source.indexOf('  const accountMarkupV175');
  const end=source.indexOf('  function themeMarkup',start);
  assert.ok(start>0&&end>start);
  let rendered='',writes=0;
  const button={dataset:{},setAttribute(){},addEventListener(){},querySelector:selector=>selector==='svg'&&rendered.includes('<svg')||selector==='.account-name-v136'&&rendered.includes('account-name-v136')?{}:null,get innerHTML(){return rendered},set innerHTML(value){writes++;rendered=value.replace(/\/>/g,'></normalized>')}};
  const user={name:'첫 이름'},context={$:()=>button,currentUser:()=>user,iconUser:()=>'<svg><path/></svg>',safe:String,window:{}};
  vm.runInNewContext(source.slice(start,end)+';updateLoginButton();updateLoginButton();updateLoginButton();',context);
  assert.equal(writes,1);
  user.name='바뀐 이름';vm.runInNewContext('updateLoginButton();updateLoginButton()',context);assert.equal(writes,2);
  rendered=rendered.replace('account-name-v136','account-name-v136 font-decorated').replace('<svg>','<svg style="font-size:14px">');vm.runInNewContext('updateLoginButton();updateLoginButton()',context);assert.equal(writes,2);
  rendered='<span>removed required nodes</span>';vm.runInNewContext('updateLoginButton();updateLoginButton()',context);assert.equal(writes,3);
});
test('Android new private-calendar action row wraps without changing existing control widths',()=>{
  const css=asset('app-calendar-v175.css');
  assert.match(css,/\.schedule-calctl-v119:has\(\.private-calendar-actions-v175\)\s*\{[^}]*flex-wrap:wrap!important/);
  assert.match(css,/\.schedule-calctl-v119>\.private-calendar-actions-v175>button\s*\{[^}]*min-width:76px!important/);
});
