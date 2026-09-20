const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),assets=path.join(root,'android-src/assets');
const source=fs.readFileSync(path.join(assets,'app-data-sync-v191.js'),'utf8');
const wait=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(){
 const counts={app:0,private:0},applied=[],changed=[];let blocked=false;
 const api={readAppData:async()=>{counts.app++;return{records:['initial']};},readPrivateData:async()=>{counts.private++;return{routines:['initial']};}};
 const state={api,uid:'A',pairId:'',ready:true},box={window:{},JSON,Object,Promise};vm.createContext(box);vm.runInContext(source,box);
 const sync=box.window.createAppDataSyncV191({context:()=>state,apply:(kind,payload,detail)=>applied.push({kind,payload,detail}),blocked:()=>blocked,onScope:(a,b)=>changed.push([a,b])});
 return{api,state,sync,counts,applied,changed,block:value=>blocked=value};
}
test('app state event fanout performs one initial read per document, not one per event',async()=>{
 const f=fixture();await Promise.all(Array.from({length:100},()=>f.sync.observe()));assert.deepEqual(f.counts,{app:1,private:1});
 await f.sync.observe();assert.deepEqual(f.counts,{app:1,private:1});f.state.pairId='pair';await f.sync.observe();assert.deepEqual(f.counts,{app:2,private:2});
});
test('auth boot waits for readiness and repeated in-flight explicit refresh coalesces',async()=>{
 const f=fixture();f.state.ready=false;await f.sync.observe();assert.deepEqual(f.counts,{app:0,private:0});f.state.ready=true;
 await Promise.all([f.sync.observe(),f.sync.request(),f.sync.request()]);assert.deepEqual(f.counts,{app:1,private:1});
});
test('scoped snapshot payloads update only their own document without extra cloud reads',async()=>{
 const f=fixture();await f.sync.observe();f.applied.length=0;
 f.sync.receive('private',{uid:'A',payload:{routines:['remote']},hasPendingWrites:false});assert.equal(f.applied.length,1);assert.equal(f.applied[0].kind,'private');
 f.sync.receive('private',{uid:'B',payload:{routines:['secret']}});f.sync.receive('app',{scope:'A:other-pair',payload:{records:['secret']}});
 assert.equal(f.applied.length,1);assert.deepEqual(f.counts,{app:1,private:1});
});
test('a newer snapshot wins over an older overlapping getDoc response',async()=>{
 const f=fixture();let resolve;f.api.readAppData=()=>new Promise(done=>resolve=done);const loading=f.sync.observe();await wait();
 f.sync.receive('app',{scope:'A:solo',payload:{records:['new']}});resolve({records:['old']});await loading;
 assert.equal(f.applied.filter(x=>x.kind==='app').length,1);assert.equal(f.applied.find(x=>x.kind==='app').payload.records[0],'new');
});
test('account or pair changes invalidate older requests, including logout and same-user return',async()=>{
 const f=fixture();let resolve;f.api.readAppData=()=>new Promise(done=>resolve=done);const loading=f.sync.observe();await wait();
 f.state.uid='';await f.sync.observe();f.state.uid='A';f.api.readAppData=async()=>({records:['new-session']});await f.sync.observe();resolve({records:['old-session']});await loading;
 assert(!f.applied.some(x=>x.payload.records?.includes('old-session')));
});
test('an open editor buffers remote data until it closes, without reading it again',async()=>{
 const f=fixture();await f.sync.observe();f.applied.length=0;f.block(true);
 f.sync.receive('private',{uid:'A',payload:{routines:['one']}});f.sync.receive('private',{uid:'A',payload:{routines:['latest']}});assert.equal(f.applied.length,0);
 f.block(false);f.sync.flush();assert.equal(f.applied[0].payload.routines[0],'latest');assert.deepEqual(f.counts,{app:1,private:1});
});
test('cache-missing notifications cannot invalidate an authoritative initial read',async()=>{
 const f=fixture();let resolve;f.api.readPrivateData=options=>{assert.equal(options.remember,false);return new Promise(done=>resolve=done);};
 const loading=f.sync.observe();await wait();f.sync.receive('private',{uid:'A',fromCache:true,exists:false,payload:null});resolve({memos:['saved server record']});await loading;
 assert.equal(f.applied.filter(x=>x.kind==='private').length,1);assert.equal(f.applied.find(x=>x.kind==='private').payload.memos[0],'saved server record');
});
test('explicit refresh defers cloud reads while an editor is open and fresh snapshots satisfy that deferred refresh',async()=>{
 const f=fixture();await f.sync.observe();f.block(true);await f.sync.request();assert.deepEqual(f.counts,{app:1,private:1});
 f.sync.receive('private',{uid:'A',payload:{routines:['new']}});f.sync.receive('app',{scope:'A:solo',payload:{records:['new']}});f.block(false);f.sync.flush();await wait();assert.deepEqual(f.counts,{app:1,private:1});
});
test('pending local snapshots and in-flight or failed writes cannot replace an unsaved draft',async()=>{
 const f=fixture();await f.sync.observe();f.applied.length=0;
 f.sync.receive('private',{uid:'A',payload:{routines:['uncommitted']},hasPendingWrites:true});assert.equal(f.applied.length,0);
 const finish=f.sync.beginWrite('private');f.sync.receive('private',{uid:'A',payload:{routines:['pre-commit']}});finish(true);f.sync.flush();assert.equal(f.applied.length,0);
 f.sync.receive('private',{uid:'A',payload:{routines:['confirmed']},hasPendingWrites:false});assert.equal(f.applied.length,1);
 const failure=f.sync.beginWrite('private');failure(false);f.sync.receive('private',{uid:'A',payload:{routines:['would-erase-draft']}});await f.sync.request(['private']);assert.equal(f.applied.length,1);assert.equal(f.counts.private,1);
});
test('save adopts a merged transaction return when its confirmed ack arrives before the promise resolves',async()=>{
 const f=fixture();await f.sync.observe();f.applied.length=0;
 const merged={routines:['my edit'],memos:['concurrent remote memo']},finish=f.sync.beginWrite('private',{routines:['my edit']});
 f.sync.receive('private',{uid:'A',payload:merged,hasPendingWrites:false});finish(true,merged);await wait();
 assert.deepEqual(f.applied[0].payload,merged);assert.equal(f.counts.private,1,'matching transaction ack needs no second read');
});
test('conflicting confirmed snapshot during save triggers only one scoped reconciliation after editor closes',async()=>{
 const f=fixture();await f.sync.observe();f.applied.length=0;f.block(true);
 const merged={routines:['my edit'],memos:['remote before commit']},latest={...merged,memos:['remote before commit','remote after commit']};
 f.api.readPrivateData=async()=>{f.counts.private++;return latest;};
 const finish=f.sync.beginWrite('private',{routines:['my edit']});f.sync.receive('private',{uid:'A',payload:latest,hasPendingWrites:false});finish(true,merged);
 assert.equal(f.applied.length,0);assert.equal(f.counts.private,1);f.block(false);f.sync.flush();await wait();
 assert.deepEqual(f.applied.at(-1).payload,latest);assert.deepEqual(f.counts,{app:1,private:2});
});
test('app integration uses snapshot acceptance only after adopting private payload and preserves save hooks',()=>{
 const html=fs.readFileSync(path.join(assets,'index.html'),'utf8');assert.match(html,/app-data-sync-v191\.js/);assert.match(html,/acceptPrivateSnapshot\?\.\(\{uid:actor,payload\}\)/);assert.match(html,/beginWrite\('private',P\)/);assert.doesNotMatch(html,/fb\.subscribe\(s=>\{[^\n]*sync\(\);render\(\)/);
});

function scheduleFixture(){
 const events={},subscriptions=[],watchers=[],published=[];let reads=0,stops=0,state={user:{uid:'A'},ready:true};
 const api={getState:()=>state,subscribe:fn=>{subscriptions.push(fn);fn(state)},readScheduleData:async()=>{reads++;return{own:[],shared:[]}},watchScheduleData:fn=>{watchers.push(fn);return()=>stops++}};
 const box={console,Map,Array,String,Number,JSON,A:{scheduleEvents:[]},activePage:'home',renderHome(){},localStorage:{setItem(){}},document:{querySelector:()=>null,addEventListener(){}},CustomEvent:class{constructor(type,{detail}){this.type=type;this.detail=detail}},setTimeout:fn=>{fn();return 1},addEventListener:(name,fn)=>{events[name]=fn},dispatchEvent:e=>published.push(e),AiderDearFirebase:api};box.window=box;vm.createContext(box);vm.runInContext(fs.readFileSync(path.join(assets,'schedule-v119.js'),'utf8'),box);
 return{box,watchers,published,stats:()=>({reads,stops}),emit:next=>{state=next;subscriptions.forEach(fn=>fn(state))}};
}
test('calendar app creates one live subscription per semantic scope instead of reading on state fanout',()=>{
 const f=scheduleFixture();for(let i=0;i<100;i++)f.emit({user:{uid:'A'},ready:true,incoming:[i]});assert.equal(f.watchers.length,1);assert.equal(f.stats().reads,0);
 f.watchers[0]({own:[{id:'a',title:'live',updatedAt:1}],shared:[]});assert.equal(f.box.A.scheduleEvents[0].title,'live');assert.equal(f.published[0].detail.uid,'A');
 f.emit({user:{uid:'B'},ready:true});assert.equal(f.watchers.length,2);assert.equal(f.stats().stops,1);f.watchers[0]({own:[{id:'late',title:'secret'}],shared:[]});assert.equal(f.published.length,1);
});
test('late app/main data cannot replace the current dedicated schedule snapshot',()=>{
 const f=scheduleFixture(),bridge=f.box.AiderAppScheduleV191;
 const remote={own:[{id:'a',title:'current schedule',updatedAt:1}],shared:[]};f.watchers[0](remote);
 f.box.A={...f.box.A,scheduleEvents:[{id:'a',title:'stale app main',updatedAt:999},{id:'legacy',title:'retain unrelated legacy'}]};
 assert.equal(bridge.applyCached(),true);assert.equal(f.box.A.scheduleEvents.find(row=>row.id==='a').title,'current schedule');assert(f.box.A.scheduleEvents.some(row=>row.id==='legacy'));
 const early=scheduleFixture();early.box.A.scheduleEvents=[{id:'a',title:'app main first',updatedAt:999}];early.watchers[0](remote);assert.equal(early.box.A.scheduleEvents.find(row=>row.id==='a').title,'current schedule');
 assert.match(fs.readFileSync(path.join(assets,'index.html'),'utf8'),/if\(payload\)A=\{\.\.\.A,\.\.\.payload\};window\.AiderAppScheduleV191\?\.applyCached\?\.\(\)/);
});
test('cached calendar application fails closed when the account or pair changes',()=>{
 const f=scheduleFixture(),bridge=f.box.AiderAppScheduleV191;f.watchers[0]({own:[{id:'a',title:'A private schedule'}],shared:[]});
 f.emit({user:{uid:'B'},ready:true});f.box.A={scheduleEvents:[]};assert.equal(bridge.applyCached(),false);assert.equal(f.box.A.scheduleEvents.length,0);
 f.watchers[1]({own:[{id:'b',title:'B schedule'}],shared:[]});f.emit({user:{uid:'B'},pair:{id:'new-pair'},partner:{uid:'C'},ready:true});f.box.A={scheduleEvents:[]};assert.equal(bridge.applyCached(),false);assert.equal(f.box.A.scheduleEvents.length,0);
});
