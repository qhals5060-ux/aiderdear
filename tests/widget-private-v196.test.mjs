import test from 'node:test';
import assert from 'node:assert/strict';
import {privateCommandV196,privateReceiptV196,createPrivateQueueV196,createPrivateGateV196,mergePrivateWriteV196} from '../android-src/assets/widget-private-sync-v196.js';
import {mergePrivateNotesV179} from '../android-src/assets/todo-domain-v179.js';
const copy=x=>JSON.parse(JSON.stringify(x));
const stamp=Date.parse('2026-09-27T12:00:00Z');
const draft=(overrides={})=>({schema:196,uid:'a',op:'routine',id:'routine-1',key:'action-1',date:'2026-09-27',value:'MINI',expectedUpdatedAt:10,kind:'RoutineAll',widgetId:1,createdAt:stamp,state:'claimed',...overrides});
function harness(items=[draft()],options={}){
 const q={uid:'a',epoch:1,time:stamp,items:copy(items),saveCalls:[],published:[],acks:[],failed:[],reports:[],remote:{routines:[{id:'routine-1',text:'독서',dailyLevels:{},doneDates:[],updatedAt:10}],checklists:[]},replay:false,ackAllowed:true,publishAllowed:true,online:true};
 const queue=createPrivateQueueV196({getUser:()=>({uid:q.uid}),getEpoch:()=>q.epoch,now:()=>q.time,online:()=>q.online,getWriteVersion:()=>q.writeVersion||0,pending:uid=>JSON.stringify(q.items.filter(row=>row.uid===uid&&!row.failed).slice(0,1)),localBefore:()=>q.localBefore||'{"before":true}',
 save:async command=>{q.saveCalls.push(copy(command));if(options.save)return options.save(command,q);if(q.error)throw Object.assign(Error(q.error),{code:q.error});const field=command.op==='routine'?'routines':'checklists';let row=q.remote[field].find(r=>r.id===command.id);if(command.op.startsWith('add-')){row={id:command.id,text:command.value,kind:command.op==='add-memo'?'memo':'todo',date:command.date||'',updatedAt:20};q.remote[field].push(row)}else{if(row.updatedAt!==command.expectedUpdatedAt)throw Object.assign(Error('stale'),{code:'widget/stale-action'});row.updatedAt++;if(command.op==='routine'){row.dailyLevels[command.date]=command.value;if(!row.doneDates.includes(command.date))row.doneDates.push(command.date)}else row.done=!!command.value;}return {applied:true,replayed:false,payload:copy(q.remote)}},
 publish:async(command,result,before,receipt)=>{q.published.push({command:copy(command),result:copy(result),before,receipt:copy(receipt)});return q.publishAllowed},ack:(uid,key,raw)=>{const receipt=JSON.parse(raw);if(!q.ackAllowed)return false;q.acks.push({uid,key,receipt});const parent=q.items.find(r=>r.key===key);q.items=q.items.filter(r=>r.key!==key);for(const child of q.items)if(receipt.rebase&&child.parentKey===key&&child.id===parent.id)child.expectedUpdatedAt=receipt.revision;options.onAck?.(q);return true},fail:(uid,key,code)=>{q.failed.push({uid,key,code});const row=q.items.find(r=>r.uid===uid&&r.key===key);row.failed=true;return true},report:code=>q.reports.push(code)});
 return {q,queue};
}
test('claim validation preserves exact key/date/revision across midnight and accepts memo in checklists',()=>{const command=draft();assert.deepEqual(privateCommandV196(command,{uid:'a'},stamp+86400000),command);assert.equal(privateCommandV196(draft({op:'add-memo',kind:'CalendarSplit',id:'memo-1',value:'기억할 내용',date:'',expectedUpdatedAt:undefined}),{uid:'a'},stamp).op,'add-memo');assert.throws(()=>privateCommandV196({...command,uid:'b'},{uid:'a'},stamp),/owner-changed/);assert.throws(()=>privateCommandV196({...command,state:'pending'},{uid:'a'},stamp),/invalid-action/);assert.throws(()=>privateCommandV196({...command,date:'2026-09-28'},{uid:'a'},stamp),/invalid-action/)});
test('empty/offline queue performs no writes',async()=>{const {q,queue}=harness([]);await queue.flush();assert.equal(q.saveCalls.length,0);q.items=[draft()];q.online=false;await queue.flush();assert.equal(q.saveCalls.length,0)});
test('coalesced latest local toggle is one immutable remote command and one ack',async()=>{const {q,queue}=harness([draft({key:'replacement-max',value:'MAX'})]);await Promise.all([queue.flush(),queue.flush(),queue.flush()]);assert.equal(q.saveCalls.length,1);assert.equal(q.saveCalls[0].value,'MAX');assert.equal(q.acks.length,1);assert.equal(q.published[0].before,'{"before":true}');assert.equal(q.published[0].receipt.rebase,true)});
test('ack retry republishes the same confirmed result without another cloud call',async()=>{const {q,queue}=harness();q.ackAllowed=false;await queue.flush();assert.equal(q.items.length,1);await queue.flush();assert.equal(q.saveCalls.length,1);q.ackAllowed=true;await queue.flush();assert.equal(q.items.length,0);assert.equal(q.saveCalls.length,1)});
test('a linked successor rebases only from the immediate freshly applied parent revision',async()=>{const {q,queue}=harness([draft(),draft({key:'next',value:'MAX',parentKey:'action-1'})]);await queue.flush();assert.deepEqual(q.saveCalls.map(c=>c.expectedUpdatedAt),[10,11]);assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],'MAX');assert.equal(q.acks.length,2)});
test('an unrelated cloud edit after our commit is never rebased over',async()=>{let once=true;const {q,queue}=harness([draft(),draft({key:'next',value:'MAX',parentKey:'action-1'})],{onAck:q=>{if(once){once=false;q.remote.routines[0].updatedAt=90;q.remote.routines[0].text='다른 기기 수정'}}});await queue.flush();assert.equal(q.failed[0].code,'widget/stale-action');assert.equal(q.remote.routines[0].updatedAt,90);assert.equal(q.remote.routines[0].text,'다른 기기 수정');assert.equal(q.saveCalls[1].expectedUpdatedAt,11)});
test('receipt replay of an externally changed row never permits successor revision rebase',async()=>{const {q,queue}=harness([draft(),draft({key:'next',value:'MAX',parentKey:'action-1'})],{save:(command,q)=>{if(command.key==='action-1')return {applied:false,replayed:true,payload:{routines:[{id:'routine-1',updatedAt:90,text:'원격 수정'}]}};throw Object.assign(Error('stale'),{code:'widget/stale-action'})}});await queue.flush();assert.equal(q.acks[0].receipt.rebase,false);assert.equal(q.saveCalls[1].expectedUpdatedAt,10);assert.equal(q.failed[0].code,'widget/stale-action')});
test('transport failure freezes claim and retries exact key after event-driven backoff',async()=>{const {q,queue}=harness();q.error='unavailable';await queue.flush();await queue.flush();assert.equal(q.saveCalls.length,1);assert.equal(q.failed.length,0);assert.equal(q.items.length,1);q.error='';q.time+=15001;await queue.flush();assert.deepEqual(q.saveCalls[0],q.saveCalls[1]);assert.equal(q.items.length,0)});
test('quota failures do not create repeated transactions during repeated resume',async()=>{const {q,queue}=harness();q.error='resource-exhausted';await queue.flush();q.time+=1799999;await queue.flush();assert.equal(q.saveCalls.length,1);q.time+=2;q.error='';await queue.flush();assert.equal(q.saveCalls.length,2)});
test('publication must reach coordinator before any native acknowledgement',async()=>{const {q,queue}=harness();q.publishAllowed=false;await queue.flush();assert.equal(q.acks.length,0);q.publishAllowed=true;await queue.flush();assert.equal(q.acks.length,1);assert.equal(q.saveCalls.length,1)});
test('UID switch in flight never publishes or acknowledges previous account result',async()=>{let release;const {q,queue}=harness([draft()],{save:async(command,q)=>{await new Promise(resolve=>release=resolve);return {applied:true,replayed:false,payload:{routines:[{id:'routine-1',updatedAt:11}]}}}});const flight=queue.flush();await Promise.resolve();q.uid='b';q.epoch++;release();await flight;assert.equal(q.published.length,0);assert.equal(q.acks.length,0);assert.equal(q.items.length,1)});
test('unclaimed malformed and goal-linked commands stay local with explicit failed status',async()=>{const {q,queue}=harness([draft({key:'invalid',value:'BAD'}),draft({key:'linked'})]);q.error='widget/goal-linked';await queue.flush();assert.deepEqual(q.failed.map(r=>r.code),['widget/invalid-action','widget/goal-linked']);assert.equal(q.items.length,2)});
test('private receipt proof is independent of visible widget row caps',()=>{const command=draft({op:'add-memo',id:'new-memo'}),payload={checklists:Array.from({length:80},(_,i)=>({id:'memo-'+i,updatedAt:i+1}))};payload.checklists.push({id:'new-memo',updatedAt:999});const proof=privateReceiptV196(command,{applied:true,replayed:false,payload});assert.equal(proof.revision,999);assert.equal(proof.rebase,true);assert.throws(()=>privateReceiptV196(command,{payload:{checklists:[]}}),/invalid-result/)});

test('receipt replay after remote deletion retires the overlay without recreating or rebasing',async()=>{const {q,queue}=harness([draft()],{save:()=>({applied:false,replayed:true,payload:{routines:[],checklists:[]}})});await queue.flush();assert.equal(q.items.length,0);assert.equal(q.acks[0].receipt.revision,0);assert.equal(q.acks[0].receipt.rebase,false);assert.deepEqual(q.published[0].result.payload.routines,[]);for(const result of [{applied:true,replayed:false,payload:{routines:[]}},{applied:false,replayed:true,payload:{routines:{}}},{applied:true,replayed:true,payload:{routines:[]}},{payload:{routines:[]}}])assert.throws(()=>privateReceiptV196(draft(),result),/invalid-result/)});

const pendingPromise=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const privateBase=()=>({routines:[{id:'r',text:'Original',updatedAt:10,doneDates:['2026-09-26'],dailyLevels:{'2026-09-26':'MINI'},unknown:{keep:true}}],checklists:[{id:'t',text:'Todo',done:false,updatedAt:10}],memos:[]});
function gateHarness(){const q={uid:'a',epoch:1,local:privateBase(),remote:privateBase()},gate=createPrivateGateV196({getUser:()=>({uid:q.uid}),getEpoch:()=>q.epoch,getPrivate:()=>q.local,now:()=>100});return {q,gate};}

test('three-way row merge keeps widget completion, unknown fields, local metadata and explicit no-op revision',()=>{
 const base=privateBase(),input=copy(base),latest=copy(base);input.routines[0].text='Edited';input.routines[0].updatedAt=12;
 latest.routines[0].dailyLevels['2026-09-27']='MAX';latest.routines[0].doneDates.push('2026-09-27');latest.routines[0].updatedAt=20;latest.routines[0].unknown.remote='retain';
 const merged=mergePrivateWriteV196(base,input,latest,100);assert.equal(merged.routines[0].text,'Edited');assert.deepEqual(merged.routines[0].doneDates,['2026-09-26','2026-09-27']);assert.deepEqual(merged.routines[0].unknown,{keep:true,remote:'retain'});assert.equal(merged.routines[0].updatedAt,100);
 input.routines[0].text='Original';assert.deepEqual(mergePrivateWriteV196(base,input,latest,100).routines,latest.routines);
});
test('routine day deltas preserve other days and reconcile intentional SKIP, deletion and legacy lowercase levels',()=>{
 const base=privateBase(),input=copy(base),latest=copy(base);latest.routines[0].dailyLevels['2026-09-27']='MAX';latest.routines[0].doneDates.push('2026-09-27');
 input.routines[0].dailyLevels['2026-09-26']='SKIP';input.routines[0].dailyLevels['2026-09-25']='mini';
 let row=mergePrivateWriteV196(base,input,latest,100).routines[0];assert.deepEqual(new Set(row.doneDates),new Set(['2026-09-27','2026-09-25']));assert.equal(row.dailyLevels['2026-09-26'],'SKIP');assert.equal(row.dailyLevels['2026-09-25'],'mini');
 input.routines[0].doneDates=[];delete input.routines[0].dailyLevels['2026-09-26'];row=mergePrivateWriteV196(base,input,latest,100).routines[0];assert.equal(row.dailyLevels['2026-09-26'],undefined);assert(row.doneDates.includes('2026-09-27'));
});
test('row insertion/deletion merge preserves unrelated records and rejects collisions or edited remote deletion',()=>{
 const base=privateBase(),input=copy(base),latest=copy(base);latest.checklists.push({id:'widget-memo',text:'Native',kind:'memo',updatedAt:20});input.checklists=[];input.memos.push({id:'new-app',text:'App',updatedAt:11});
 const merged=mergePrivateWriteV196(base,input,latest);assert.deepEqual(merged.checklists.map(r=>r.id),['widget-memo']);assert.equal(merged.memos[0].id,'new-app');
 input.routines[0].text='Edit deleted';latest.routines=[];assert.throws(()=>mergePrivateWriteV196(base,input,latest),/private-merge-conflict/);
 latest.routines=base.routines;latest.memos=[{id:'new-app',text:'Other device'}];assert.throws(()=>mergePrivateWriteV196(base,input,latest),/private-merge-conflict/);
 input.routines=base.routines;latest.routines=[];input.memos=[];assert.deepEqual(mergePrivateWriteV196(base,input,latest).routines,[]);
});
test('a widget queued in the same task already holds its baseline for the following app metadata write',async()=>{
 const {q,gate}=gateHarness(),release=pendingPromise();let writes=0;
 const widget=gate.widget(async()=>{gate.started({key:'one'});await release.promise;q.remote.routines[0].dailyLevels['2026-09-27']='MAX';q.remote.routines[0].doneDates.push('2026-09-27');gate.committed(q.remote);});
 const input=copy(q.local);input.routines[0].text='Edited';const app=gate.write(input,async value=>{writes++;q.remote=copy(value);return value;});
 await Promise.resolve();assert.equal(writes,0);release.resolve();await Promise.all([widget,app]);assert.equal(writes,1);assert.equal(q.remote.routines[0].text,'Edited');assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],'MAX');
});
test('an app write that starts first completes before widget claim; its stale expected revision is not rebased',async()=>{
 const {q,gate}=gateHarness(),release=pendingPromise();let claimed=false;
 const app=gate.write(q.local,async value=>{await release.promise;q.remote=copy(value);q.remote.routines[0].updatedAt=20;return q.remote;});
 const widget=gate.widget(async()=>{claimed=true;gate.started({key:'old'});assert.equal(q.remote.routines[0].updatedAt,20);throw Object.assign(Error('stale'),{code:'widget/stale-action'});});
 const rejected=assert.rejects(widget,/stale/);await Promise.resolve();assert.equal(claimed,false);release.resolve();await app;await rejected;assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],undefined);
});
test('app save failure releases the gate and retry keeps later widget changes',async()=>{
 const {q,gate}=gateHarness(),release=pendingPromise();
 const widget=gate.widget(async()=>{gate.started({key:'one'});await release.promise;q.remote.routines[0].dailyLevels['2026-09-27']='MINI';gate.committed(q.remote);});
 const input=copy(q.local);input.routines[0].text='Keep draft';const failed=gate.write(input,async()=>{throw Error('offline');});const rejected=assert.rejects(failed,/offline/);release.resolve();await widget;await rejected;
 await gate.widget(async()=>{gate.started({key:'two'});q.remote.routines[0].dailyLevels['2026-09-27']='MAX';gate.committed(q.remote);});
 await gate.write(input,async value=>{q.remote=copy(value);return value;});assert.equal(q.remote.routines[0].text,'Keep draft');assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],'MAX');
});
test('uncertain widget response prevents full save until same receipt is recovered',async()=>{
 const {q,gate}=gateHarness();await assert.rejects(gate.widget(async()=>{gate.started({key:'lost'});throw Error('unavailable');}),/unavailable/);
 const input=copy(q.local);input.routines[0].text='Retained edit';let writes=0;await assert.rejects(gate.write(input,async()=>{writes++;}),/private-unconfirmed/);assert.equal(writes,0);
 q.remote.routines[0].dailyLevels['2026-09-27']='MAX';await gate.widget(async()=>{gate.started({key:'lost'});gate.committed(q.remote);});
 await gate.write(input,async value=>{writes++;q.remote=value;return value;});assert.equal(writes,1);assert.equal(q.remote.routines[0].text,'Retained edit');assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],'MAX');
});
test('UID/generation change rejects a queued app write before its operation and missing owned baseline defers',async()=>{
 const {q,gate}=gateHarness(),release=pendingPromise(),started=pendingPromise();let writes=0;
 const widget=gate.widget(async()=>{gate.started({key:'old'});started.resolve();await release.promise;gate.committed(q.remote);});
 const app=gate.write(q.local,async value=>{writes++;return value;});const rejected=assert.rejects(app,/owner-changed/);await started.promise;q.uid='b';q.epoch++;release.resolve();await widget;await rejected;assert.equal(writes,0);
 q.local=null;await assert.rejects(gate.widget(async()=>{}),/not-ready/);await assert.rejects(gate.write(privateBase(),async()=>{writes++;}),/not-ready/);assert.equal(writes,0);
});
test('deferred local row edit saves after two widget leases without losing either the draft or completion',async()=>{
 const {q,gate}=gateHarness(),original=JSON.stringify(q.local.routines[0]);
 await gate.widget(async()=>{gate.started({key:'one'});q.local.routines[0].text='Late draft';q.remote.routines[0].dailyLevels['2026-09-27']='MINI';q.remote.routines[0].doneDates.push('2026-09-27');gate.committed(q.remote);});
 await gate.widget(async()=>{gate.started({key:'two'});assert.equal(gate.localBefore({op:'routine',id:'r'}),original);q.remote.routines[0].dailyLevels['2026-09-27']='MAX';gate.committed(q.remote);});
 await gate.write(q.local,async value=>{q.remote=copy(value);return value;});assert.equal(q.remote.routines[0].text,'Late draft');assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],'MAX');assert(q.remote.routines[0].doneDates.includes('2026-09-27'));
});
test('a widget row accepted in place becomes the baseline, so an intentional app undo remains effective',async()=>{
 const {q,gate}=gateHarness();await gate.widget(async()=>{gate.started({key:'one'});q.remote.routines[0].dailyLevels['2026-09-27']='MAX';q.remote.routines[0].doneDates.push('2026-09-27');gate.committed(q.remote);q.local.routines=copy(q.remote.routines);});
 delete q.local.routines[0].dailyLevels['2026-09-27'];q.local.routines[0].doneDates=['2026-09-26'];await gate.write(q.local,async value=>{q.remote=copy(value);return value;});assert.equal(q.remote.routines[0].dailyLevels['2026-09-27'],undefined);assert.deepEqual(q.remote.routines[0].doneDates,['2026-09-26']);
});
test('original row comparison survives transport retries instead of accepting a later local draft as baseline',async()=>{
 const {q,queue}=harness();q.localBefore='original';q.error='unavailable';await queue.flush();q.localBefore='new-draft';q.error='';q.time+=15001;await queue.flush();assert.equal(q.published[0].before,'original');
});
test('intervening app write invalidates confirmed response and replays receipt against current payload',async()=>{
 let first=true;const {q,queue}=harness([draft()],{save:(command,q)=>{const result={applied:first,replayed:!first,payload:copy(q.remote)};first=false;return result;}});
 q.ackAllowed=false;await queue.flush();q.remote.routines[0].text='App metadata saved';q.remote.routines[0].updatedAt=40;q.writeVersion=1;q.ackAllowed=true;await queue.flush();assert.equal(q.saveCalls.length,2);assert.equal(q.published.at(-1).result.payload.routines[0].text,'App metadata saved');assert.equal(q.acks[0].receipt.rebase,false);
});
test('serialized full app note edit uses the verified note baseline with the real existing conflict merger',async()=>{
 const {q,gate}=gateHarness(),release=pendingPromise();
 const widget=gate.widget(async()=>{gate.started({key:'todo'});await release.promise;q.remote.checklists[0].done=true;q.remote.checklists[0].updatedAt=20;gate.committed(q.remote);});
 const input=copy(q.local);input.checklists[0].text='Edited todo title';input.checklists[0].updatedAt=12;
 const app=gate.write(input,async(value,proof)=>{assert.equal(proof.uid,'a');const notes=mergePrivateNotesV179(q.remote,value,proof.baseline);q.remote={...value,...notes};return q.remote;});release.resolve();await Promise.all([widget,app]);assert.equal(q.remote.checklists[0].text,'Edited todo title');assert.equal(q.remote.checklists[0].done,true);assert.equal(q.remote.checklists[0].updatedAt,100);
});
