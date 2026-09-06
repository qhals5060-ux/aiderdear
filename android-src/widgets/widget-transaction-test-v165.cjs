/* No network or real accounts: exercise the exact exported Firestore callback with
 * an optimistic transaction harness (reads, version conflict, atomic commit/retry). */
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'),path=require('node:path');
const repo=path.resolve(__dirname,'../..');
const source=fs.readFileSync(path.join(repo,'firebase-app.js'),'utf8');
const start='// BEGIN WIDGET ACTION TRANSACTION V165',end='// END WIDGET ACTION TRANSACTION V165';
const block=source.slice(source.indexOf(start),source.indexOf(end)+end.length);
assert(block.includes('async function applyWidgetActionV165'));
const copy=x=>x===undefined?undefined:structuredClone(x);
const mainPath='users/A/private/main';
const initial=()=>({routines:[{id:'r',title:'Read',color:'pv3',icon:'legacy',goalDays:30,cycleDays:30,miniText:'5 minutes',bigGoals:['goal'],goalTracking:{a:{x:1}},goalDerivedDates:{a:'2026-09-01'},doneDates:['2026-09-01'],dailyLevels:{'2026-09-01':'MORE'},createdAt:100,updatedAt:200}],checklists:[{id:'t',text:'Task',date:'',done:false,createdAt:100,updatedAt:200,custom:{keep:true}},{id:'other',text:'Other',createdAt:100}],personalItems:[{id:'read',category:'reading',title:'Keep me'}],paper:{unknown:true},unknown:{nested:[1,2,3]}});
const command=(op='todo',overrides={})=>({uid:'A',key:`A:${op}:fixture`,op,id:op==='routine'?'r':'t',date:'2026-09-06',value:op==='routine'?'MINI':true,expectedUpdatedAt:200,...overrides});
function harness(payload=initial()){
  const auth={currentUser:{uid:'A'}},state={user:{uid:'A'}},docs=new Map(),versions=new Map();
  if(payload!==undefined)docs.set(mainPath,{payload:copy(payload),updatedAt:'prior-server-time',unrelatedDocumentField:'keep'});
  let now=Date.parse('2026-09-06T12:00:00Z'),attempts=0,reads=0,commits=0;
  class Clock extends Date { constructor(...args){super(...(args.length?args:[now]));} static now(){return now;} }
  const h={auth,state,docs,versions,beforeCommit:null,afterCommit:null,afterRead:null};
  const set=(key,data)=>{docs.set(key,copy(data));versions.set(key,(versions.get(key)||0)+1)};
  const runTransaction=async(_,callback)=>{
    for(let n=0;n<6;n++){
      attempts++;const observed=new Map(),writes=[];
      const tx={get:async ref=>{if(writes.length)throw Error('read after write');reads++;observed.set(ref,versions.get(ref)||0);const data=copy(docs.get(ref));if(h.afterRead)await h.afterRead(ref,reads);return {exists:()=>data!==undefined,data:()=>data};},update:(ref,data)=>writes.push({ref,data:copy(data),update:true}),set:(ref,data)=>writes.push({ref,data:copy(data),update:false})};
      const result=await callback(tx);
      if(h.beforeCommit)await h.beforeCommit(n,writes);
      if([...observed].some(([key,version])=>(versions.get(key)||0)!==version))continue;
      for(const {ref} of writes)if(ref.split('/')[1]!==auth.currentUser?.uid){const e=Error('permission-denied');e.code='permission-denied';throw e;}
      for(const {ref,data,update}of writes){if(update&&!docs.has(ref))throw Error('not found');set(ref,update?{...docs.get(ref),...data}:data)}
      if(writes.length)commits++;if(h.afterCommit)await h.afterCommit(result);return result;
    }
    throw Error('transaction retry limit');
  };
  h.api=new Function('auth','state','doc','db','runTransaction','serverTimestamp','TextEncoder','Date',block+'\nreturn applyWidgetActionV165;')(auth,state,(_,...parts)=>parts.join('/'),{},runTransaction,()=> 'SERVER_TIME',TextEncoder,Clock);
  h.payload=()=>copy(docs.get(mainPath)?.payload);
  h.replace=(payload)=>set(mainPath,{...docs.get(mainPath),payload:copy(payload)});
  h.switch=uid=>{auth.currentUser=uid?{uid}:null;state.user=uid?{uid}:null};
  h.stats=()=>({attempts,reads,commits,receipts:[...docs.keys()].filter(k=>k.includes('/widget-action-v165-')).length});
  h.tick=n=>{now+=n};return h;
}

test('site and app contain the identical focused helper and export the API',()=>{
  const app=fs.readFileSync(path.resolve(repo,'../AiderLog-v145-decoded/assets/firebase-app.js'),'utf8');
  assert.equal(app.slice(app.indexOf(start),app.indexOf(end)+end.length),block);
  for(const text of [source,app])assert.match(text,/const api = \{[\s\S]*?\n  applyWidgetActionV165,/);
});

test('todo writes desired state atomically and preserves all unrelated record/document fields',async()=>{
  const before=initial(),h=harness(before),r=await h.api(command());assert(r.applied);assert.equal(r.payload.checklists[0].done,true);assert(r.payload.checklists[0].completedAt>200);assert.equal(r.payload.checklists[0].updatedAt,r.payload.checklists[0].completedAt);
  for(const key of ['routines','personalItems','paper','unknown'])assert.deepEqual(r.payload[key],before[key]);
  assert.deepEqual(r.payload.checklists[0].custom,{keep:true});assert.deepEqual(r.payload.checklists[1],before.checklists[1]);assert.equal(h.docs.get(mainPath).unrelatedDocumentField,'keep');assert.equal(h.stats().receipts,1);
});

test('same-key retry returns latest data without applying twice, even after legacy main replacement',async()=>{
  const h=harness();await h.api(command());const fresh=h.payload();fresh.unknown.newField='new';h.replace(fresh);
  const retry=await h.api(command());assert.equal(retry.applied,false);assert.equal(retry.replayed,true);assert.equal(retry.payload.unknown.newField,'new');assert.equal(h.stats().receipts,1);assert.equal(h.stats().commits,1);
});

test('same key with different desired state is rejected, not silently replayed',async()=>{
  const h=harness();await h.api(command());await assert.rejects(h.api(command('todo',{value:false})),{code:'widget/replay-mismatch'});assert(h.payload().checklists[0].done);
});

test('same current desired state is a recorded no-op and does not alter timestamps',async()=>{
  const h=harness();const r=await h.api(command('todo',{value:false}));assert.equal(r.applied,false);assert.equal(h.payload().checklists[0].updatedAt,200);assert.equal(h.stats().receipts,1);
});

test('todo can explicitly unset completion; reusing stale expected timestamp is rejected',async()=>{
  const h=harness();const first=await h.api(command());const unset=command('todo',{key:'unset',value:false,expectedUpdatedAt:first.payload.checklists[0].updatedAt});
  const second=await h.api(unset);assert.equal(second.payload.checklists[0].done,false);assert.equal(second.payload.checklists[0].completedAt,0);
  await assert.rejects(h.api(command('todo',{key:'late-arrival'})),{code:'widget/stale-action'});assert.equal(h.stats().receipts,2);
});

test('routine modifies exactly one date while preserving color/goals/unknown fields',async()=>{
  const h=harness(),before=h.payload().routines[0],r=await h.api(command('routine'));const after=r.payload.routines[0];assert.deepEqual(after.doneDates,['2026-09-01','2026-09-06']);assert.deepEqual(after.dailyLevels,{'2026-09-01':'MORE','2026-09-06':'MINI'});
  for(const key of ['color','icon','goalDays','cycleDays','miniText','bigGoals','goalTracking','goalDerivedDates'])assert.deepEqual(after[key],before[key],key);
});

test('routine existing legacy lower-case storage remains lower-case',async()=>{
  const p=initial();p.routines[0].dailyLevels={'2026-09-01':'more'};const h=harness(p),r=await h.api(command('routine'));assert.equal(r.payload.routines[0].dailyLevels['2026-09-06'],'mini');assert.equal(r.payload.routines[0].dailyLevels['2026-09-01'],'more');
});

test('routine done date is added only once and SKIP removes both selected date and key',async()=>{
  const p=initial();p.routines[0].doneDates=['2026-09-01','2026-09-06','2026-09-06'];p.routines[0].dailyLevels['2026-09-06']='MAX';const h=harness(p);
  const r=await h.api(command('routine'));assert.equal(r.payload.routines[0].doneDates.filter(d=>d==='2026-09-06').length,1);
  const skip=await h.api(command('routine',{key:'skip',value:'SKIP',expectedUpdatedAt:r.payload.routines[0].updatedAt}));assert.deepEqual(skip.payload.routines[0].doneDates,['2026-09-01']);assert.deepEqual(skip.payload.routines[0].dailyLevels,{'2026-09-01':'MORE'});
});

test('cross UID, signed-out, and inconsistent auth/state never read private data',async()=>{
  for(const situation of ['different','signed-out','inconsistent']){const h=harness();if(situation==='different')h.switch('B');if(situation==='signed-out')h.switch(null);if(situation==='inconsistent')h.state.user={uid:'B'};await assert.rejects(h.api(command()),{code:'widget/owner-changed'});assert.equal(h.stats().reads,0);assert.equal(h.stats().commits,0);}
});

test('account switch while asynchronous transaction reads resolve rejects before any writes',async()=>{
  const h=harness();h.afterRead=()=>h.switch('B');await assert.rejects(h.api(command()),{code:'widget/owner-changed'});assert.equal(h.stats().commits,0);assert.equal(h.payload().checklists[0].done,false);
});

test('account is rechecked on each Firestore retry',async()=>{
  const h=harness();h.beforeCommit=n=>{if(n===0){const p=h.payload();p.unknown.change='concurrent';h.replace(p);h.switch('B')}};await assert.rejects(h.api(command()),{code:'widget/owner-changed'});assert.equal(h.stats().commits,0);assert.equal(h.stats().attempts,2);
});

test('account switch after commit does not return prior owner payload to the new account',async()=>{
  const h=harness();h.afterCommit=()=>h.switch('B');await assert.rejects(h.api(command()),{code:'widget/owner-changed'});assert.equal(h.stats().commits,1);
});

test('concurrent changes to unrelated fields are retained when Firestore retries',async()=>{
  const h=harness();h.beforeCommit=n=>{if(n===0){const p=h.payload();p.unknown.new='concurrent';p.checklists[1].text='Other edit';h.replace(p)}};const r=await h.api(command());assert.equal(r.payload.unknown.new,'concurrent');assert.equal(r.payload.checklists[1].text,'Other edit');assert.equal(h.stats().attempts,2);
});

test('concurrent change to selected row rejects stale action on transaction retry',async()=>{
  const h=harness();h.beforeCommit=n=>{if(n===0){const p=h.payload();p.checklists[0].updatedAt=300;p.checklists[0].text='Edited elsewhere';h.replace(p)}};await assert.rejects(h.api(command()),{code:'widget/stale-action'});assert.equal(h.payload().checklists[0].text,'Edited elsewhere');assert.equal(h.payload().checklists[0].done,false);assert.equal(h.stats().receipts,0);
});

test('parallel identical replay keys commit only once',async()=>{
  const h=harness();const rows=await Promise.all([h.api(command()),h.api(command())]);assert.equal(rows.filter(r=>r.applied).length,1);assert.equal(rows.filter(r=>r.replayed).length,1);assert.equal(h.stats().receipts,1);assert.equal(h.stats().commits,1);
});

test('parallel different actions from the same stale snapshot cannot overwrite each other',async()=>{
  const h=harness();const results=await Promise.allSettled([h.api(command()),h.api(command('todo',{key:'second',value:false}))]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.code,'widget/stale-action');assert.equal(h.payload().checklists[0].done,true);
});

test('first-account add-memo/add-todo uses stable IDs and does not duplicate on replay',async()=>{
  const h=harness();h.docs.delete(mainPath);
  const cmd=command('add-memo',{id:'memo-stable',key:'memo-key',value:'A note',date:'2026-09-06'});const r=await h.api(cmd);assert.equal(r.payload.checklists[0].kind,'memo');assert.equal(r.payload.checklists[0].date,'');assert.equal(r.payload.checklists[0].text,'A note');
  await h.api(cmd);assert.equal(h.payload().checklists.length,1);
  const todo=await h.api(command('add-todo',{id:'todo-stable',key:'todo-key',value:'A task',date:''}));assert.equal(todo.payload.checklists[1].kind,'todo');assert.equal(todo.payload.checklists[1].date,'');assert.equal(todo.payload.checklists[1].done,false);
});

test('existing stable add ID is not overwritten or resurrected with a different key',async()=>{
  const h=harness();await assert.rejects(h.api(command('add-todo',{id:'t',key:'collision',value:'Replace task'})),{code:'widget/stale-action'});assert.equal(h.payload().checklists[0].text,'Task');assert.equal(h.stats().receipts,0);
});

test('deleted row is not recreated by routine/todo mutations',async()=>{
  const h=harness();await assert.rejects(h.api(command('routine',{id:'missing'})),{code:'widget/not-found'});assert.equal(h.stats().commits,0);
});

test('malformed existing payload or nested field fails closed without discarding data',async()=>{
  for(const p of [[],{checklists:'bad'}, {routines:[{id:'r',updatedAt:200,doneDates:'bad'}]}]){const h=harness(p),cmd=p.routines?command('routine'):command();await assert.rejects(h.api(cmd),{code:'widget/invalid-data'});assert.deepEqual(h.payload(),p);assert.equal(h.stats().commits,0);}
});

test('invalid state, missing revision, impossible/future dates and oversized text/keys are rejected',async()=>{
  const cases=[command('todo',{value:'yes'}),command('todo',{expectedUpdatedAt:undefined}),command('routine',{date:'2026-02-31'}),command('routine',{date:'2026-09-07'}),command('routine',{value:'SUPER'}),command('add-memo',{value:'x'.repeat(181)}),command('add-todo',{value:'ok',date:'not-a-date'}),command('todo',{key:'한'.repeat(201)})];
  for(const cmd of cases){const h=harness();await assert.rejects(h.api(cmd));assert.equal(h.stats().commits,0);}
});

test('memo records cannot be accidentally toggled as todos',async()=>{
  const p=initial();p.checklists[0].kind='memo';const h=harness(p);await assert.rejects(h.api(command()),{code:'widget/invalid-action'});assert.equal(h.stats().commits,0);
});

test('receipt key supports Unicode/slashes without changing the document path depth',async()=>{
  const h=harness();await h.api(command('todo',{key:'A:/위젯/할 일:#1'}));const receipt=[...h.docs.keys()].find(k=>k.includes('/widget-action-v165-'));assert.equal(receipt.split('/').length,4);assert(receipt.length<1500);
});
