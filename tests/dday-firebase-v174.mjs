import test from 'node:test';
import assert from 'node:assert/strict';
import {decodeArchive} from '../archive-codec-v168.js';
import {createDdayFirebaseFixture as harness} from './dday-firebase-fixture-v174.mjs';

// Evaluate the actual adapter functions with an isolated Firestore contract.
// No Firebase SDK, credentials, production reads or network are available.
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const item=(id='d1',extra={})=>({id,title:'등록한 디데이',date:'2027-01-01',mode:'countdown',...extra});

test('read combines only current owner and current pair and protects legacy in its original scope without editing main',async()=>{
  const h=harness();h.pair();h.seed('users/u1/app/main',{ddays:[item('same')],activeDdayBySpace:{'solo:owner@example.test':'same'},records:[{id:'untouched'}]});h.seed('pairs/p1/app/main',{ddays:[item('same',{title:'커플 디데이',createdBy:'partner@example.test'})]});h.seed('pairs/old/app/main',{ddays:[item('private-old')]});h.seed('users/u2/app/main',{ddays:[item('private-other')]});
  const originals=clone([...h.rows]);const result=await h.read();assert.deepEqual(Array.from(result.items,row=>row.sourceScope),['user:u1','pair:p1']);assert.equal(result.activeScope,'user:u1');assert(h.writes.every(path=>/app\/(ddays|dday-settings)$/.test(path)));assert(h.reads.every(path=>path.startsWith('users/u1/')||path.startsWith('pairs/p1/')));
  for(const [path,data] of originals)assert.deepEqual(h.rows.get(path),data);const count=h.writes.length;await h.read();assert.equal(h.writes.length,count,'a second read must not repeat protection writes');
});

test('add, selection and deletion write only dedicated docs and preserve all unrelated legacy data',async()=>{
  const h=harness(),legacy={ddays:[item('old')],records:[{id:'record'}],scheduleEvents:[{id:'schedule'}],activeDdayId:'old'};h.seed('users/u1/app/main',legacy);const before=clone(h.rows.get('users/u1/app/main'));
  let data=await h.mutate({type:'add',item:item('new',{createdBy:'attacker',pairKey:'forged'})});assert.equal(data.activeId,'new');assert.equal(data.activeScope,'user:u1');assert.equal(data.items.find(r=>r.id==='new').createdBy,'owner@example.test');
  const writes=h.writes.length;await h.mutate({type:'add',item:item('new')});assert.equal(h.writes.length,writes,'identical retry must not reselect or rewrite');
  data=await h.mutate({type:'select',id:'old',sourceScope:'user:u1'});assert.equal(data.activeId,'old');
  data=await h.mutate({type:'delete',id:'old',sourceScope:'user:u1'});assert.deepEqual(Array.from(data.items,row=>row.id),['new']);assert.deepEqual(h.rows.get('users/u1/app/main'),before);
  h.seed('users/u1/app/main',{...legacy,ddays:[item('old'),item('stale-restored')]});data=await h.read();assert(!data.items.some(r=>r.id==='old'));assert(data.items.some(r=>r.id==='new'));
  assert(h.writes.every(path=>/^users\/u1\/app\/(ddays|dday-settings)$/.test(path)));
});

test('current-pair adds never copy solo records and per-user selection distinguishes equal IDs',async()=>{
  const h=harness();h.pair();h.seed('users/u1/app/main',{ddays:[item('same')]});await h.mutate({type:'add',item:item('same',{title:'새 공유 디데이'})});
  const pairData=decodeArchive(h.rows.get('pairs/p1/app/ddays').payload);assert.equal(pairData.items.length,1);assert.equal(pairData.items[0].title,'새 공유 디데이');assert.equal(decodeArchive(h.rows.get('users/u1/app/ddays').payload).items[0].title,'등록한 디데이');
  let result=await h.mutate({type:'select',id:'same',sourceScope:'user:u1'});assert.equal(result.activeScope,'user:u1');result=await h.mutate({type:'select',id:'same',sourceScope:'pair:p1'});assert.equal(result.activeScope,'pair:p1');assert.equal(h.rows.has('pairs/p1/app/dday-settings'),false);
  h.state.pair=null;h.state.partner=null;result=await h.read();assert.equal(result.items.length,1);assert.equal(result.activeScope,'user:u1');assert.equal(decodeArchive(h.rows.get('users/u1/app/dday-settings').payload).activeScope,'pair:p1');
  await assert.rejects(h.mutate({type:'delete',id:'same',sourceScope:'pair:p1'}),{status:403});
});

test('concurrent adds and stale whole-app saves cannot remove dedicated records or selection',async()=>{
  const h=harness();await Promise.all([h.mutate({type:'add',item:item('a')}),h.mutate({type:'add',item:item('b')})]);let result=await h.read();assert.deepEqual(Array.from(result.items,row=>row.id),['a','b']);
  await h.mutate({type:'select',id:'a',sourceScope:'user:u1'});h.seed('users/u1/app/main',{ddays:[],activeDdayId:'old-stale'});result=await h.read();assert.equal(result.activeId,'a');assert.equal(result.items.length,2);
  await h.mutate({type:'add',item:item('b')});assert.equal((await h.read()).activeId,'a','uncertain original add retry must not overwrite a newer preference');
  await Promise.all([h.mutate({type:'delete',id:'a',sourceScope:'user:u1'}),h.mutate({type:'add',item:item('c')})]);assert.deepEqual(Array.from((await h.read()).items,row=>row.id),['b','c']);
});

test('malformed legacy/store/settings or failed reads throw without any empty replacement write',async()=>{
  for(const [path,payload] of [['users/u1/app/main',{ddays:{bad:true}}],['users/u1/app/ddays',{items:[item('bad',{date:'2026-02-30'})]}],['users/u1/app/dday-settings',{activeId:'../bad',activeScope:'user:u1'}]]){
    const h=harness();h.seed(path,payload);await assert.rejects(h.read());await assert.rejects(h.mutate({type:'add',item:item('good')}));assert.equal(h.writes.length,0);
  }
  const h=harness();h.setFail('users/u1/app/main');await assert.rejects(h.read(),/permission-denied/);await assert.rejects(h.mutate({type:'add',item:item()}),/permission-denied/);assert.equal(h.writes.length,0);
});

test('forged scopes and changing auth or pair during async reads abort with no wrong-account result or write',async()=>{
  for(const sourceScope of ['user:u2','pair:old','user:../bad']){const h=harness();await assert.rejects(h.mutate({type:'delete',id:'d1',sourceScope}));assert.equal(h.writes.length,0);}
  for(const op of ['read','mutate'])for(const change of ['auth','pair']){
    const h=harness();h.seed('users/u1/app/main',{ddays:[item()]});let changed=false;h.setBeforeRead(()=>{if(changed)return;changed=true;if(change==='auth'){h.auth.currentUser={uid:'u2'};h.state.user={uid:'u2',email:'other@example.test'};}else h.pair();});
    await assert.rejects(op==='read'?h.read():h.mutate({type:'select',id:'d1',sourceScope:'user:u1'}),{status:409});assert.equal(h.writes.length,0);assert(h.reads.every(path=>path.startsWith('users/u1/')));
  }
});

test('server state changing between transaction and response never returns another account data',async()=>{
  const h=harness();let reads=0;h.setBeforeRead(()=>{if(++reads===4){h.state.user={uid:'u2',email:'other@example.test'};h.auth.currentUser={uid:'u2'};}});
  await assert.rejects(h.mutate({type:'add',item:item()}),{status:409});assert(h.writes.every(path=>path.startsWith('users/u1/')));assert.equal(h.events.length,0);
});

test('legacy read repair and legacy selection survive subsequent stale main overwrites without repeating writes',async()=>{
  for(const op of ['read','select']){
    const h=harness();h.seed('users/u1/app/main',{ddays:[item('first'),item('selected')],activeDdayId:'selected'});
    if(op==='read')await h.read();else await h.mutate({type:'select',id:'selected',sourceScope:'user:u1'});
    h.seed('users/u1/app/main',{ddays:[],activeDdayId:'first'});const result=await h.read();assert.equal(result.items.length,2);assert.equal(result.activeId,'selected');
    const count=h.writes.length;await h.read();assert.equal(h.writes.length,count);
  }
});

test('read repair never resurrects deleted legacy rows or overwrites the newest dedicated version',async()=>{
  const h=harness();h.seed('users/u1/app/main',{ddays:[item('deleted'),item('newer',{title:'예전 제목'}),item('recover')]});h.seed('users/u1/app/ddays',{version:174,items:[item('newer',{title:'새 제목'})],deletedIds:['deleted']});
  const result=await h.read();assert(!result.items.some(row=>row.id==='deleted'));assert.equal(result.items.find(row=>row.id==='newer').title,'새 제목');assert(result.items.some(row=>row.id==='recover'));assert.equal(decodeArchive(h.rows.get('users/u1/app/ddays').payload).deletedIds[0],'deleted');
});
