const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'firebase-app.js'),'utf8');
const start=source.indexOf('function cleanScheduleRows('),end=source.indexOf('\nasync function readScheduleData()',start);
assert(start>=0&&end>start);
function cleaner(user={uid:'u1',email:'owner@example.test'},pair={id:'p1'}){
  const context={requireUser:()=>{if(!user)throw Error('auth required');return user},cleanEmail:value=>String(value||'').trim().toLowerCase(),state:{pair},JSON,String,Array};vm.createContext(context);vm.runInContext(source.slice(start,end)+';globalThis.clean=cleanScheduleRows;',context);return context.clean;
}
test('actual Firebase owner cleaner excludes partner and friend schedules from personal writes',()=>{
  const rows=[{id:'mine',authorUid:'u1',authorEmail:'owner@example.test'},{id:'partner',authorUid:'u2',authorEmail:'partner@example.test',owner:'shared',shareWithCouple:true},{id:'friend',authorUid:'u3',authorEmail:'friend@example.test',friendShared:true,readOnly:true}],original=JSON.stringify(rows);
  const own=cleaner()(rows,'u1');assert.deepEqual(Array.from(own,row=>row.id),['mine']);assert.equal(JSON.stringify(rows),original);
});
test('app save plus subsequent site read shows received schedule once under production ownership contract',()=>{
  const partner={id:'partner',authorEmail:'partner@example.test',owner:'shared',shareWithCouple:true},own={id:'mine',authorEmail:'owner@example.test'};
  const savedOwn=cleaner()([own,partner],'u1'),siteEvents=[...savedOwn,partner];assert.equal(siteEvents.filter(row=>row.id==='partner').length,1);
});
test('own shared event retains explicit couple intent and canonical actor without changing input',()=>{
  const row={id:'own',authorEmail:' OWNER@EXAMPLE.TEST ',owner:'shared',note:'retained'},original=JSON.stringify(row),result=cleaner()([row],'u1')[0];
  assert.equal(result.authorUid,'u1');assert.equal(result.authorEmail,'owner@example.test');assert.equal(result.pairKey,'p1');assert.equal(result.shareWithCouple,true);assert.equal(JSON.stringify(row),original);
});
test('unlinked account never leaves a stale pair key in its own stored schedule',()=>{
  const result=cleaner(undefined,null)([{id:'own',authorEmail:'owner@example.test',owner:'shared',pairKey:'old-pair'}],'u1')[0];assert.equal(result.pairKey,'');
});
test('schedule owner cleaner rejects missing or foreign authors and requires a signed-in actor',()=>{
  assert.equal(cleaner()([{id:'missing'},{id:'foreign',authorEmail:'foreign@example.test'},null]).length,0);assert.throws(()=>cleaner(null)([]),/auth required/);
});

const appSource=fs.readFileSync(path.join(root,'android-src/assets/feature-system-v125.js'),'utf8');
function visibleCache(rows){
  let state={},reads=0,projectionReads=0,friendReads=0;
  const original=JSON.stringify(rows),cached=Object.freeze(rows.map(row=>Object.freeze({...row}))),context={currentState:()=>state,
    baseScheduleRowsV125:()=>{reads++;return cached;},privateScheduleRowsV148:()=>{projectionReads++;return [];},
    window:{AiderFriendScheduleUIV175:{events:()=>{friendReads++;return [];}}}};
  const code=['visibleCachedScheduleV179','scheduleRowsV125'].map(name=>appSource.match(new RegExp('  function '+name+'[^\\n]+'))?.[0]).join('\n');
  vm.runInNewContext(code+';globalThis.rows=scheduleRowsV125',context);
  return {context,set:next=>{state=next;},rows:()=>{const result=context.rows();assert.equal(JSON.stringify(cached),original,'display filtering never edits or deletes cached records');return Array.from(result,row=>row.id);},reads:()=>({reads,projectionReads,friendReads})};
}

test('guest or unresolved identity never exposes or reads another account cached schedules',()=>{
  const h=visibleCache([{id:'old-a',authorUid:'a'},{id:'old-b',authorUid:'b'},{id:'old-pair',authorUid:'partner',pairKey:'p1',owner:'shared'}]);
  for(const state of [{},{user:null},{user:{email:'owner@example.test'}}]){h.set(state);assert.deepEqual(h.rows(),[]);}
  assert.deepEqual(h.reads(),{reads:0,projectionReads:0,friendReads:0});
});

test('offline authenticated owner retains their cache while account switches hide foreign and unowned rows',()=>{
  const h=visibleCache([{id:'a',authorUid:'a'},{id:'b',authorUid:'b'},{id:'legacy-a',authorEmail:' A@EXAMPLE.TEST '},{id:'unknown'},{id:'spoofed-email',authorUid:'b',authorEmail:'a@example.test'}]);
  h.set({user:{uid:'a',email:'a@example.test'},offline:true});assert.deepEqual(h.rows(),['a','legacy-a']);
  h.set({user:{uid:'b',email:'b@example.test'},offline:true});assert.deepEqual(h.rows(),['b','spoofed-email']);
  h.set({user:null});assert.deepEqual(h.rows(),[]);
  h.set({user:{uid:'a',email:'a@example.test'},offline:true});assert.deepEqual(h.rows(),['a','legacy-a']);
});

test('cached couple rows require the currently connected partner and pair, not just a shared flag',()=>{
  const h=visibleCache([{id:'current',authorUid:'partner',owner:'shared',pairKey:'p1'},{id:'old-pair',authorUid:'partner',owner:'shared',pairKey:'old'},{id:'no-pair',authorUid:'partner',owner:'shared'},{id:'stranger',authorUid:'other',owner:'shared',pairKey:'p1'},{id:'private-partner',authorUid:'partner',owner:'mine',pairKey:'p1'},{id:'cached-friend',authorUid:'friend',friendShared:true}]);
  h.set({user:{uid:'a'},pair:{id:'p1'},partner:{uid:'partner'}});assert.deepEqual(h.rows(),['current']);
  h.set({user:{uid:'a'},pair:null,partner:null});assert.deepEqual(h.rows(),[]);
  h.set({user:{uid:'b'},pair:{id:'p2'},partner:{uid:'partner'}});assert.deepEqual(h.rows(),[]);
});

test('actual monthly and upcoming renderers stay empty with cached private data when signed out',()=>{
  const h=visibleCache([{id:'old',title:'MUST NOT LEAK',date:'2026-09-12',authorUid:'a'}]),c=h.context;
  class Clock extends Date{constructor(...args){super(...(args.length?args:['2026-09-12T12:00:00']));}}
  Object.assign(c,{Date:Clock,safe:String,currentUser:()=>null,receivedScheduleV176:()=>false,scheduleSelectedV125:'2026-09-12',dateKey:date=>date.toISOString().slice(0,10),eventSpansDateV125:(row,date)=>row.date===date});
  vm.runInNewContext(fs.readFileSync(path.join(root,'android-src/assets/app-calendar-view-v176.js'),'utf8'),c);vm.runInNewContext(fs.readFileSync(path.join(root,'schedule-time-v179.js'),'utf8'),c);
  c.scheduleViewV176=c.window.AiderAppCalendarViewV176.create(null,()=>new Clock());
  vm.runInNewContext(appSource.slice(appSource.indexOf('  function scheduleCellsV125'),appSource.indexOf('  function renderScheduleV125')),c);
  const calendar=c.scheduleCellsV125(2026,8),upcoming=c.scheduleUpcomingV125();
  assert.equal((calendar.match(/data-schedule-date-v125=/g)||[]).length,42);assert.doesNotMatch(calendar+upcoming,/MUST NOT LEAK|data-schedule-edit-v125=|schedule-event-title-v176/);
  assert.deepEqual(h.reads(),{reads:0,projectionReads:0,friendReads:0});
});
