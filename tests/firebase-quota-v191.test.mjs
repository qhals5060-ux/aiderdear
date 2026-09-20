import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8').replace(/\r\n/g,'\n');
function section(start,end){const a=source.indexOf(start),b=source.indexOf(end,a+start.length);assert(a>=0&&b>a,start);return source.slice(a,b);}
test('simultaneous same-document reads share a request, sequential reads remain fresh',async()=>{
 let reads=0,finish;const auth={currentUser:{uid:'one'}},c={auth,firebaseGetDocV191:()=>{reads++;return new Promise(r=>finish=r)}};vm.createContext(c);
 vm.runInContext(section('const pendingDocumentReadsV191','let persistenceSetupV176')+'\nglobalThis.read=getDoc;globalThis.invalidate=()=>{readGenerationV191++;pendingDocumentReadsV191.clear()};',c);
 const a=c.read({path:'users/one/private/main'}),b=c.read({path:'users/one/private/main'});assert.equal(a,b);assert.equal(reads,1);finish({version:1});assert.equal((await a).version,1);
 const next=c.read({path:'users/one/private/main'});assert.equal(reads,2);finish({version:2});assert.equal((await next).version,2);
 const old=c.read({path:'users/one/private/main'});auth.currentUser={uid:'two'};c.invalidate();finish({secret:'one'});await assert.rejects(old,/계정이 변경/);
});
test('unchanged login profile does not write; changed profile writes exactly once',async()=>{
 let writes=0;const profile={uid:'one',name:'User',email:'one@test'},c={db:{},doc:()=>({path:'users/one'}),plainDoc:s=>s,publicUser:()=>profile,getDoc:async()=>({...profile}),setDoc:async()=>writes++,serverTimestamp:()=>1};vm.createContext(c);vm.runInContext(section('async function ensureUserProfile','async function propagateMemberProfile')+'\nglobalThis.ensure=ensureUserProfile;',c);
 await c.ensure({uid:'one'});assert.equal(writes,0);c.getDoc=async()=>({...profile,name:'Old'});await c.ensure({uid:'one'});assert.equal(writes,1);
});
test('private listener publishes full payload once per user and rejects old-account callbacks',()=>{
 const callbacks=[],events=[];let watches=0,stops=0;const c={state:{user:{uid:'one'}},auth:{currentUser:{uid:'one'}},db:{},unsubscribePrivateDataV191:null,privateDataScopeV191:'',doc:(...parts)=>({path:parts.slice(1).join('/')}),onSnapshot:(ref,cb)=>{watches++;callbacks.push(cb);return()=>stops++},decodeArchive:x=>x,timestampValue:Number,CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail}},window:{dispatchEvent:event=>events.push(event)},emit:()=>{}};vm.createContext(c);vm.runInContext(section('function watchPrivateDataV191','function acceptPrivateSnapshot')+'\nglobalThis.watch=watchPrivateDataV191;',c);
 c.watch();c.watch();assert.equal(watches,1);callbacks[0]({exists:()=>true,data:()=>({payload:{memos:[{id:'a'}]},updatedAt:10}),metadata:{fromCache:false,hasPendingWrites:false}});assert.equal(events[0].detail.payload.memos[0].id,'a');assert.equal(events[0].detail.uid,'one');
 c.state.user={uid:'two'};c.auth.currentUser={uid:'two'};c.watch();assert.equal(stops,1);callbacks[0]({exists:()=>true,data:()=>({payload:{secret:1}})});assert.equal(events.length,1);callbacks[1]({exists:()=>false,data:()=>undefined});assert.equal(events[1].detail.exists,false);assert.equal(events[1].detail.payload,null);
});
test('app listener carries payload so remote updates need no second get',()=>{
 let callback;const events=[],c={state:{user:{uid:'one'},pair:null},appDataScopeKey:'',unsubscribeAppData:null,db:{},doc:()=>({}),onSnapshot:(ref,cb)=>{callback=cb;return()=>{}},decodeArchive:x=>x,timestampValue:Number,CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts.detail}},window:{dispatchEvent:event=>events.push(event)},emit:()=>{}};vm.createContext(c);vm.runInContext(section('function watchAppData','function watchPrivateDataV191')+'\nglobalThis.watch=watchAppData;',c);c.watch();callback({exists:()=>true,data:()=>({payload:{records:[1]},updatedAt:20}),metadata:{hasPendingWrites:true,fromCache:true}});assert.equal(events[0].detail.payload.records[0],1);assert.equal(events[0].detail.hasPendingWrites,true);assert.equal(events[0].detail.fromCache,true);
});

function listenerHarness(){
 let now=1000,nextTimer=0;const timers=new Map(),native=[],events=[];
 const eventTarget=()=>{const listeners=new Map();return{addEventListener(name,fn){(listeners.get(name)||listeners.set(name,new Set()).get(name)).add(fn);},removeEventListener(name,fn){listeners.get(name)?.delete(fn);},dispatchEvent(event){for(const fn of [...(listeners.get(event.type)||[])])fn(event);return true;},count(){return [...listeners.values()].reduce((n,s)=>n+s.size,0);}};};
 const window=eventTarget(),document={...eventTarget(),visibilityState:'visible'},auth={currentUser:{uid:'one'}},navigator={onLine:true};
 const c={auth,window,document,navigator,Date:{now:()=>now},CustomEvent:class{constructor(type,opts={}){this.type=type;this.detail=opts.detail;}},setTimeout(fn,delay){const id=++nextTimer;timers.set(id,{at:now+delay,fn});return id;},clearTimeout:id=>timers.delete(id),firebaseGetDocV191:async()=>({}),firebaseOnSnapshotV191(...args){const row={ref:args[0],options:args.length===4?args[1]:null,next:args.at(-2),fail:args.at(-1),stopped:0};native.push(row);return()=>row.stopped++;}};
 for(const name of ['unsubscribePairs','unsubscribeIncoming','unsubscribeOutgoing','unsubscribeFriends','unsubscribeFriendIncoming','unsubscribeFriendOutgoing','unsubscribeDirectLetters','unsubscribeAppData','unsubscribePrivateDataV191','unsubscribeOwnSchedule','unsubscribePartnerSchedule'])c[name]=null;
 c.appDataScopeKey='';c.privateDataScopeV191='';
 window.addEventListener('aiderdear-firebase-listener-status',event=>events.push(event.detail));
 vm.createContext(c);vm.runInContext(section('const pendingDocumentReadsV191','let persistenceSetupV176')+section('function stopListeners()','function watchAppData()')+'\nglobalThis.watch=onSnapshot;globalThis.stop=stopListeners;',c);
 return{c,native,events,timers,auth,document,navigator,window,advance(ms){const end=now+ms;while(true){const next=[...timers].filter(([,v])=>v.at<=end).sort((a,b)=>a[1].at-b[1].at)[0];if(!next)break;now=next[1].at;timers.delete(next[0]);next[1].fn();}now=end;},time:()=>now};
}
test('quota recovery waits 30 minutes, retries only visible/online, and ignores old callbacks',()=>{
 const h=listenerHarness(),received=[],failures=[];const unsubscribe=h.c.watch({path:'users/one/private/main'},s=>received.push(s),e=>failures.push(e));
 assert.equal(h.native.length,1);assert.equal(h.native[0].options.includeMetadataChanges,true);
 h.native[0].fail({code:'resource-exhausted',message:'Quota exceeded'});assert.equal(failures.length,1);assert.equal(h.native[0].stopped,1);assert.equal(h.events.at(-1).healthy,false);assert.equal(h.events.at(-1).kind,'private');assert.equal(h.events.at(-1).retryAt,h.time()+1800000);
 h.window.dispatchEvent({type:'online'});h.advance(1799999);assert.equal(h.native.length,1);
 h.document.visibilityState='hidden';h.advance(1);assert.equal(h.native.length,1);assert.equal(h.timers.size,0);
 h.document.visibilityState='visible';h.navigator.onLine=false;h.document.dispatchEvent({type:'visibilitychange'});assert.equal(h.native.length,1);
 h.navigator.onLine=true;h.window.dispatchEvent({type:'online'});assert.equal(h.native.length,2);
 h.native[0].next({stale:true});assert.equal(received.length,0);
 h.native[1].next({metadata:{hasPendingWrites:false}});assert.equal(received.length,1);assert.equal(h.events.at(-1).healthy,true);
 unsubscribe();assert.equal(h.native[1].stopped,1);assert.equal(h.timers.size,0);assert.equal(h.document.count(),0);assert.equal(h.window.count(),1);
});
test('project quota backoff also blocks newly requested listeners, including after auth changes',()=>{
 const h=listenerHarness();h.c.watch({path:'users/one/app/main'},()=>{},()=>{});h.native[0].fail({code:'resource-exhausted'});
 h.c.watch({path:'users/one/private/main'},()=>{},()=>{});assert.equal(h.native.length,1);assert.equal(h.events.at(-1).code,'resource-exhausted');
 h.auth.currentUser={uid:'two'};h.c.stop();assert.equal(h.timers.size,0);assert.equal(h.document.count(),0);assert.equal(h.window.count(),1);
 const seen=[];h.c.watch({path:'users/two/app/main'},s=>seen.push(s),()=>{});assert.equal(h.native.length,1);
 h.native[0].next({secret:'one'});assert.equal(seen.length,0);h.advance(1800000);assert.equal(h.native.length,2);h.native[1].next({owner:'two'});assert.equal(seen[0].owner,'two');assert.equal(h.events.at(-1).scope,'two:solo');
 h.c.stop();
});
test('permission errors remain terminal and unsubscribe cancels all scheduled recovery',()=>{
 const h=listenerHarness();const unsubscribe=h.c.watch({path:'pairs/pair-a/app/main'},()=>{},()=>{});h.native[0].fail({code:'permission-denied',message:'No access'});
 assert.equal(h.events.at(-1).scope,'one:pair-a');assert.equal(h.events.at(-1).retryAt,0);assert.equal(h.timers.size,0);h.advance(7200000);h.window.dispatchEvent({type:'online'});h.document.dispatchEvent({type:'visibilitychange'});assert.equal(h.native.length,1);unsubscribe();
 const cancel=h.c.watch({path:'users/one/private/main'},()=>{},()=>{});h.native[1].fail({code:'resource-exhausted'});assert.equal(h.timers.size,1);cancel();assert.equal(h.timers.size,0);h.advance(1800000);assert.equal(h.native.length,2);assert.equal(h.document.count(),0);
});
test('app/private metadata confirmation is delivered without an extra document read',()=>{
 const h=listenerHarness(),seen=[];const stop=h.c.watch({path:'users/one/app/main'},s=>seen.push(s.metadata.hasPendingWrites),()=>{});
 assert.equal(h.native[0].options.includeMetadataChanges,true);h.native[0].next({metadata:{hasPendingWrites:true}});h.native[0].next({metadata:{hasPendingWrites:false}});assert.deepEqual(seen,[true,false]);assert.equal(h.native.length,1);stop();
});
test('accepted private snapshots are detached from event payload and reject another account',()=>{
 let baseline;const c={requireUser:()=>({uid:'one'}),consultSyncV167:{remember(uid,payload){baseline=payload;return payload;}}};vm.createContext(c);vm.runInContext(section('function acceptPrivateSnapshot','function recomputeState')+'\nglobalThis.accept=acceptPrivateSnapshot;',c);
 const payload={memos:[{id:'a',text:'original'}]},accepted=c.accept({uid:'one',payload});payload.memos[0].text='mutated listener packet';assert.equal(accepted.memos[0].text,'original');assert.equal(baseline.memos[0].text,'original');assert.throws(()=>c.accept({uid:'two',payload}),/계정이 변경/);
});
test('unchanged propagated member profile does not commit while changed own fields preserve the partner',async()=>{
 const profile={uid:'one',name:'One',gender:'female',birthDate:'2000-01-01',birthCalendar:'solar',birthLeap:false},partner={uid:'two',name:'Two',keep:'unchanged'};let rows=[{status:'active',memberProfiles:[{...profile},partner]}],updates=[],commits=0;
 const c={db:{},collection:()=>({}),where:()=>({}),query:()=>({}),getDocs:async()=>({docs:rows.map((row,i)=>({ref:i,data:()=>row}))}),writeBatch:()=>({update:(ref,doc)=>updates.push(doc),commit:async()=>commits++}),serverTimestamp:()=>1};vm.createContext(c);vm.runInContext(section('async function propagateMemberProfile','async function updateNickname')+'\nglobalThis.propagate=propagateMemberProfile;',c);
 await c.propagate(profile);assert.equal(commits,0);rows[0].memberProfiles[0].name='Old';await c.propagate(profile);assert.equal(commits,1);assert.equal(updates.length,2);assert.equal(updates[0].memberProfiles[0].name,'One');assert.deepEqual(updates[0].memberProfiles[1],partner);
});

test('buffered private reads preserve the previous baseline until explicitly accepted',async()=>{
 let baseline={memos:[{id:'old',text:'baseline'}]},remembered=0;const sourcePayload={memos:[{id:'new',text:'server'}]},auth={currentUser:{uid:'one'}};
 const c={auth,db:{},doc:()=>({}),requireUser:()=>({uid:'one'}),decodeArchive:value=>value,getDoc:async()=>({exists:()=>true,data:()=>({payload:sourcePayload})}),consultSyncV167:{remember(uid,payload){assert.equal(uid,'one');remembered++;baseline=payload;return payload;}}};
 vm.createContext(c);vm.runInContext(section('function acceptPrivateSnapshot','function recomputeState')+section('async function readPrivateData','const consultSyncV167')+'\nglobalThis.readPrivate=readPrivateData;',c);
 const buffered=await c.readPrivate({remember:false});assert.equal(remembered,0);assert.equal(baseline.memos[0].id,'old');assert.equal(buffered.memos[0].id,'new');buffered.memos[0].text='draft';assert.equal(sourcePayload.memos[0].text,'server');
 await c.readPrivate();assert.equal(remembered,1);assert.equal(baseline.memos[0].text,'server');
 auth.currentUser={uid:'two'};await assert.rejects(c.readPrivate({remember:false}),/계정이 변경/);assert.equal(remembered,1);
});
