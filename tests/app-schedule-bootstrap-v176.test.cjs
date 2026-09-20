const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'../android-src/assets'),source=fs.readFileSync(path.join(base,'schedule-v119.js'),'utf8');
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(){
 let listener,state={user:null},reads=0,legacy=0,current=0,bindings=0;
 const stored=[],pending=[],ready=[],timers=[],api={subscribe:fn=>{listener=fn;bindings++;},getState:()=>state,readScheduleData:()=>{reads++;return new Promise(resolve=>pending.push(resolve));}};
 const context={window:{AiderDearFirebase:api,addEventListener:(_name,fn)=>ready.push(fn),dispatchEvent(){}},document:{querySelector:()=>null,addEventListener(){}},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},A:{scheduleEvents:[{id:'local',updatedAt:1}]},activePage:'home',console,
  localStorage:{setItem:(key,value)=>stored.push([key,JSON.parse(value)])},setTimeout:fn=>timers.push(fn)};
 context.renderHome=()=>legacy++;
 vm.runInNewContext(source,context);timers.forEach(fn=>fn());
 return {context,stored,pending,emit:next=>{state=next;listener(next);return tick();},upgrade:()=>{context.renderHome=()=>current++;},rebind:()=>ready.forEach(fn=>fn()),counts:()=>({reads,legacy,current,bindings})};
}

test('late schedule cloud response uses the newest renderer and preserves fetched own/shared rows',async()=>{
 const f=fixture(),p=f.emit({user:{uid:'a'}});
 f.upgrade();f.pending[0]({own:[{id:'own'}],shared:[{id:'shared'}]});await p;
 assert.deepEqual(f.counts(),{reads:1,legacy:0,current:1,bindings:1});
 assert.deepEqual(Array.from(f.context.A.scheduleEvents,row=>row.id),['local','own','shared']);assert.equal(f.stored.length,1);
});

test('bootstrap before current calendar still renders through the existing renderer',async()=>{
 const f=fixture(),p=f.emit({user:{uid:'a'}});f.pending[0]({own:[{id:'own'}],shared:[]});await p;
 assert.deepEqual(f.counts(),{reads:1,legacy:1,current:0,bindings:1});
});

test('cloud completion off Home never navigates or repaints the active page',async()=>{
 const f=fixture(),p=f.emit({user:{uid:'a'}});f.upgrade();f.context.activePage='event';f.pending[0]({own:[{id:'own'}],shared:[]});await p;
 assert.deepEqual(f.counts(),{reads:1,legacy:0,current:0,bindings:1});assert.equal(f.context.A.scheduleEvents.length,2);
});

test('signed-out state does not fetch and duplicate readiness does not duplicate subscriptions',async()=>{
 const f=fixture();await f.emit({user:null});f.rebind();f.rebind();
 assert.deepEqual(f.counts(),{reads:0,legacy:0,current:0,bindings:1});assert.equal(f.stored.length,0);
});

test('older account response cannot publish after logout or a new account read',async()=>{
 for(const next of [{user:null},{user:{uid:'b'}}]){
  const f=fixture(),p=f.emit({user:{uid:'a'}}),q=f.emit(next);f.pending[0]({own:[{id:'stale-a'}],shared:[]});await p;
  assert.equal(f.stored.length,0);assert.deepEqual(Array.from(f.context.A.scheduleEvents,row=>row.id),['local']);
  if(next.user){f.pending[1]({own:[{id:'current-b'}],shared:[]});await q;await tick();assert.deepEqual(Array.from(f.context.A.scheduleEvents,row=>row.id),['local','current-b']);assert.equal(f.stored.length,1);}
 }
});

test('pair changes reject stale reads; matching latest rows win by ID without duplicates',async()=>{
 const f=fixture(),old=f.emit({user:{uid:'a'},pair:{id:'before'}}),current=f.emit({user:{uid:'a'},pair:{id:'after'}});
 f.pending[0]({own:[],shared:[{id:'stale-pair'}]});await old;assert.equal(f.stored.length,0);
 f.pending[1]({own:[{id:'local',updatedAt:3,title:'current'}],shared:[{id:'local',updatedAt:2,title:'older'},{id:'shared',updatedAt:2}]});await current;await tick();
 assert.equal(f.context.A.scheduleEvents.length,2);assert.equal(f.context.A.scheduleEvents[0].title,'current');assert.equal(f.stored.length,1);
});

test('verified pair read attributes legacy shared rows without mutating the received data',async()=>{
 const f=fixture(),p=f.emit({user:{uid:'a'},pair:{id:'p1'},partner:{uid:'partner'}}),shared=Object.freeze([{id:'legacy-shared',authorUid:'partner',owner:'shared'}]);
 f.pending[0]({own:[],shared});await p;
 assert.equal(f.context.A.scheduleEvents.find(row=>row.id==='legacy-shared').pairKey,'p1');assert.equal(shared[0].pairKey,undefined);
});

test('canonical and bundled data bridge match without removed emotion renderers',()=>{
 const canonical=path.resolve(base,'../../../AiderLog-v145-decoded/assets/schedule-v119.js');
 assert.equal(source,fs.readFileSync(canonical,'utf8'));assert.match(source,/activePage==='home'&&typeof renderHome==='function'/);
 assert.doesNotMatch(source,/renderScheduleV119|Emotion|emotion|Insights|insights/);
});

const appIndex=fs.readFileSync(path.join(base,'index.html'),'utf8');
function appSyncFixture(){
 const start=appIndex.indexOf('let privateDataOwnerV179='),end=appIndex.indexOf('\nfunction connect(',start);assert(start>0&&end>start);
 const appReads=[],privateReads=[],renders=[],accepted=[],storageWrites=[];
 const pending=list=>new Promise((resolve,reject)=>list.push({resolve,reject}));
 const context={window:{},document:{querySelector:()=>null},authState:null,A:{scheduleEvents:[{id:'untouched-cached'}]},P:{routines:[{id:'unscoped-cached'}],consultingClients:[{id:'cached-client'}]},
  render:()=>renders.push(JSON.parse(JSON.stringify({a:context.A,p:context.P}))),localStorage:{setItem:(...args)=>storageWrites.push(['set',...args]),removeItem:(...args)=>storageWrites.push(['remove',...args])}};
 context.fb={getState:()=>context.authState,readAppData:()=>pending(appReads),readPrivateData:options=>{assert.equal(options.remember,false);return pending(privateReads);},acceptPrivateSnapshot:packet=>{assert.equal(packet.uid,context.authState.user.uid);accepted.push(packet);}};
 vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(base,'app-data-sync-v191.js'),'utf8'),context);vm.runInContext(appIndex.slice(start,end),context);
 return {context,appReads,privateReads,renders,accepted,storageWrites,login:uid=>{context.authState={user:uid?{uid}:null};return context.sync();},answer:(index,app,personal)=>{appReads[index].resolve(app);privateReads[index].resolve(personal);},owns:()=>context.window.AiderAppDataScopeV179.ownsPrivate(context.P)};
}

test('whole-app late reads are discarded on logout without deleting local data',async()=>{
 const f=appSyncFixture(),pending=f.login('a');await tick();await f.login(null);const count=f.renders.length;f.answer(0,{scheduleEvents:[{id:'stale-a'}]},{consultingClients:[{id:'stale-a'}]});await pending;
 assert.equal(f.renders.length,count);assert.equal(f.context.A.scheduleEvents.length,0);assert.equal(f.context.P.consultingClients,undefined);assert.equal(f.owns(),false);assert.equal(f.accepted.length,0);assert.deepEqual(f.storageWrites,[]);
});

test('account switch publishes only latest reads and never attributes old private fields to the new UID',async()=>{
 const f=appSyncFixture(),old=f.login('a');await tick();const current=f.login('b');await tick();
 f.answer(1,{scheduleEvents:[{id:'b'}]},{routines:[{id:'b-routine'}]});await current;
 f.answer(0,{scheduleEvents:[{id:'a'}]},{consultingClients:[{id:'a-client'}]});await old;
 assert(f.renders.length>0);assert(f.renders.every(row=>!row.p.consultingClients));assert.equal(f.context.A.scheduleEvents[0].id,'b');assert.equal(f.context.P.routines[0].id,'b-routine');assert.equal(f.context.P.consultingClients,undefined);assert.equal(f.owns(),true);assert.deepEqual(f.accepted.map(row=>row.uid),['b']);assert.deepEqual(f.storageWrites,[]);
});

test('same-account offline read failure preserves verified private data; guest/other accounts cannot use it',async()=>{
 const f=appSyncFixture(),first=f.login('a');await tick();f.answer(0,{}, {consultingClients:[{id:'a-client'}]});await first;assert.equal(f.owns(),true);
 const second=f.login('a');await tick();f.appReads[1].reject(Error('offline'));f.privateReads[1].reject(Error('offline'));await second;assert.equal(f.owns(),true);assert.equal(f.context.P.consultingClients[0].id,'a-client');
 await f.login(null);assert.equal(f.owns(),false);const other=f.login('b');await tick();assert.equal(f.owns(),false);f.appReads[2].reject(Error('offline'));f.privateReads[2].reject(Error('offline'));await other;assert.equal(f.owns(),false);assert.equal(f.context.P.consultingClients,undefined);
 f.context.authState={user:{uid:'a'}};assert.equal(f.owns(),false);const restored=f.login('a');await tick();f.answer(3,{}, {consultingClients:[{id:'a-client'}]});await restored;assert.equal(f.owns(),true);assert.equal(f.context.P.consultingClients[0].id,'a-client');assert.deepEqual(f.storageWrites,[]);
});

test('calendar Consult projection receives private data only after its current-owner scope is verified',async()=>{
 const f=appSyncFixture(),passed=[],feature=fs.readFileSync(path.join(base,'feature-system-v125.js'),'utf8'),fn=feature.match(/  function privateScheduleRowsV148\(\) \{[\s\S]*?\n  \}/)[0];
 f.context.window.AiderWorkCalendarV168={rows:data=>{passed.push(data);return [];}};f.context.window.AiderEstateCalendarV171={rows:()=>[]};vm.runInNewContext(fn,f.context);
 f.context.privateScheduleRowsV148();assert.equal(Object.keys(passed.pop()).length,0);
 const first=f.login('a');await tick();f.answer(0,{}, {consultingClients:[{id:'a-client'}]});await first;f.context.privateScheduleRowsV148();assert.equal(passed.pop(),f.context.P);
 await f.login(null);f.context.privateScheduleRowsV148();assert.equal(Object.keys(passed.pop()).length,0);
});
