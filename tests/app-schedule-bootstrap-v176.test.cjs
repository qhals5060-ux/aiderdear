const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'../android-src/assets'),source=fs.readFileSync(path.join(base,'schedule-v119.js'),'utf8');
const start=source.indexOf('  function bindScheduleSync() {'),end=source.indexOf('\n\n  restoreEmotionLocal();',start);
assert.ok(start>=0&&end>start);
const realSync=source.slice(start,end);
function fixture(){
 let listener,resolve,reads=0,legacy=0,current=0;
 const stored=[],remote=new Promise(done=>resolve=done),api={subscribe:fn=>{listener=fn;},readScheduleData:()=>{reads++;return remote;}};
 const context={window:{AiderDearFirebase:api},scheduleSyncBound:false,A:{scheduleEvents:[{id:'local'}]},activePage:'home',console,
  eventRows:()=>context.A.scheduleEvents,mergeRows:(...rows)=>rows.flat(),localStorage:{setItem:(key,value)=>stored.push([key,JSON.parse(value)])},
  renderScheduleV119:()=>legacy++};
 context.renderHome=context.renderScheduleV119;
 vm.runInNewContext(realSync+';bindScheduleSync()',context);
 return {context,stored,resolve,emit:state=>listener(state),upgrade:()=>{context.renderHome=()=>current++;},counts:()=>({reads,legacy,current})};
}
test('late schedule cloud response uses the newest renderer, preserving fetched own and shared rows',async()=>{
 const f=fixture(),pending=f.emit({user:{uid:'a'}});
 f.upgrade();f.resolve({own:[{id:'own'}],shared:[{id:'shared'}]});await pending;
 assert.deepEqual(f.counts(),{reads:1,legacy:0,current:1});
 assert.deepEqual(f.context.A.scheduleEvents.map(row=>row.id),['local','own','shared']);
 assert.equal(f.stored.length,1);
});
test('legacy-only app still renders and loads its cloud schedule',async()=>{
 const f=fixture(),pending=f.emit({user:{uid:'a'}});f.resolve({own:[{id:'own'}],shared:[]});await pending;
 assert.deepEqual(f.counts(),{reads:1,legacy:1,current:0});
});
test('cloud completion off Home does not navigate or repaint the active page',async()=>{
 const f=fixture(),pending=f.emit({user:{uid:'a'}});f.upgrade();f.context.activePage='event';f.resolve({own:[{id:'own'}]});await pending;
 assert.deepEqual(f.counts(),{reads:1,legacy:0,current:0});assert.equal(f.context.A.scheduleEvents.length,2);
});
test('signed-out state does not fetch records and duplicate sync binding is ignored',async()=>{
 const f=fixture();await f.emit({user:null});vm.runInNewContext('bindScheduleSync()',f.context);
 assert.deepEqual(f.counts(),{reads:0,legacy:0,current:0});assert.equal(f.stored.length,0);
});
test('canonical and bundled Android legacy sync source are identical',()=>{
 const canonical=path.resolve(base,'../../../AiderLog-v145-decoded/assets/schedule-v119.js');
 assert.equal(source,fs.readFileSync(canonical,'utf8'));
 assert.match(realSync,/if \(activePage === 'home'\) renderHome\(\)/);
 assert.doesNotMatch(realSync,/renderScheduleV119\(\)/);
});
