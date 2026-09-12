import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import * as domain from '../private-calendar-v175.js';
import {encodeStoredPayload,decodeArchive} from '../archive-codec-v168.js';
import {createPrivateCalendarFirebaseFixture as harness} from './private-calendar-firebase-fixture-v175.mjs';

// Actual adapter code, with a memory-only Firestore contract. Not a claim of
// production permissions testing: firestore.rules is verified separately.
const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const range={from:'2026-09-01',to:'2026-09-30'};
const period=(extra={})=>({id:'p1',startDate:'2026-09-01',endDate:'2026-09-05',note:'',...extra});

test('default read is opt-out, bounded, and owner-only even in an active pair',async()=>{
  const h=harness();const data=await h.read(range);assert.equal(data.settings.menstrualEnabled,false);assert.equal(data.canUseIntimacy,true);assert.equal(data.periods.length,0);
  assert(h.reads.every(path=>path.startsWith('users/u1/')));assert.equal(h.writes.length,0);
  assert(h.queries.every(q=>q.constraints.some(c=>c.type==='limit'&&c.value===201)));
  assert(h.queries.every(q=>q.constraints.filter(c=>c.type==='where').length===2));
});
test('ordinary, unverified and forged-token accounts never read or mutate intimacy entries',async()=>{
  for(const [email,verified]of [['other@example.test',true],['qhals5060@gmail.com',false],['qhals5060@@gmail.com',true]]){
    const h=harness(email,verified);assert.equal((await h.read(range)).canUseIntimacy,false);
    await assert.rejects(h.mutate({type:'intimacy-save',item:{id:'i1',date:'2026-09-01'},expectedRevision:0}),{code:'permission-denied'});
    assert(!h.reads.some(path=>path.includes('intimacyEntries')));assert.equal(h.writes.length,0);
  }
  const h=harness();h.claims.email='other@example.test';assert.equal((await h.read(range)).canUseIntimacy,false);
  h.claims.sub='u2';await assert.rejects(h.read(range),{code:'unauthenticated'});
  h.state.user=null;await assert.rejects(h.read(range));
});
test('save, idempotent replay, revision update, settings off, and delete preserve independent data',async()=>{
  const h=harness();h.seed('users/u1/app/main',{payload:{personal:'keep'}});const before=clone(h.rows.get('users/u1/app/main'));
  const action={type:'period-save',item:period(),expectedRevision:0};
  let result=await h.mutate(action);assert.equal(result.item.revision,1);
  assert.equal((await h.mutate(action)).changed,false);assert.equal(h.writes.length,1);
  result=await h.mutate({...action,item:period({note:'revised'}),expectedRevision:1});assert.equal(result.item.revision,2);
  await assert.rejects(h.mutate(action),{code:'conflict'});
  await h.mutate({type:'settings',item:{menstrualEnabled:true,cycleLength:30,periodLength:4},expectedRevision:0});
  await h.mutate({type:'settings',item:{menstrualEnabled:false,cycleLength:30,periodLength:4},expectedRevision:1});
  assert.equal((await h.read(range)).periods.length,1,'opt-out must not delete history');
  await h.mutate({type:'period-delete',id:'p1',expectedRevision:2});
  assert.equal((await h.read(range)).periods.length,0);
  assert.equal(h.rows.get('users/u1/menstrualEntries/p1').startDate,undefined);
  assert.equal(h.rows.get('users/u1/menstrualEntries/p1').note,undefined);
  assert.equal((await h.mutate({type:'period-delete',id:'p1',expectedRevision:2})).changed,false);
  await assert.rejects(h.mutate(action),{code:'conflict'});
  assert.deepEqual(h.rows.get('users/u1/app/main'),before);
  assert(h.writes.every(path=>/^users\/u1\/(healthCalendar|menstrualEntries)\//.test(path)));
  assert(h.transactions.every(options=>options.maxAttempts===1));
  assert(h.events.every(event=>Object.keys(event.detail).join(',')==='uid'));
});
test('verified second confirmed account may save only its own intimacy date',async()=>{
  const h=harness('aidway55@gmail.com');await h.mutate({type:'intimacy-save',item:{id:'i1',date:'2026-09-01',note:'private'},expectedRevision:0});
  const data=await h.read(range);assert.equal(data.intimacy[0].date,'2026-09-01');assert.equal(h.writes[0],'users/u1/intimacyEntries/i1');
});
test('range truncation is explicit and out-of-range/other-owner records are not returned',async()=>{
  const h=harness();for(let i=0;i<202;i++)h.seed('users/u1/menstrualEntries/p'+i,{...period({id:'p'+i}),revision:1});
  h.seed('users/u2/menstrualEntries/other',{...period({id:'other'}),revision:1,ownerUid:'u2'});
  h.seed('users/u1/intimacyEntries/old',{id:'old',date:'2025-01-01',note:'',revision:1});
  const data=await h.read(range);assert.equal(data.periods.length,200);assert.equal(data.hasMore.periods,true);assert.equal(data.intimacy.length,0);
  assert(!data.periods.some(row=>row.id==='other'));
});
test('switching account, including same UID with a new auth principal, invalidates pending requests',async()=>{
  for(const mode of ['read','save'])for(const uid of ['u2','u1']){
    const h=harness();h.before(()=>{h.auth.currentUser={...h.principal,uid};h.state.user={uid};});
    await assert.rejects(mode==='read'?h.read(range):h.mutate({type:'period-save',item:period(),expectedRevision:0}),{code:'unauthenticated'});
    assert.equal(h.writes.length,0);assert.equal(h.events.length,0);
  }
});
test('quota and malformed storage errors preserve original rows and do not create empty replacements',async()=>{
  const h=harness();h.seed('users/u1/menstrualEntries/p1',{...period(),revision:1});const before=clone([...h.rows]);
  h.fail({code:'firestore/resource-exhausted'});
  await assert.rejects(h.read(range),{code:'resource-exhausted',retryAfterMs:300000});
  await assert.rejects(h.mutate({type:'period-save',item:period(),expectedRevision:0}),{code:'resource-exhausted'});
  assert.deepEqual([...h.rows],before);assert.equal(h.writes.length,0);
  h.fail(null);h.rows.get('users/u1/menstrualEntries/p1').startDate='2026-09-99';
  await assert.rejects(h.mutate({type:'period-delete',id:'p1',expectedRevision:1}));assert.equal(h.writes.length,0);
});
test('actual emotion adapter preserves private original but strips future paired health flags',async()=>{
  const writes=[];const context={requireUser:()=>({uid:'u1'}),encodeStoredPayload,withoutPrivateEmotionFlags:domain.withoutPrivateEmotionFlags,db:{},JSON,doc:(_db,...parts)=>({path:parts.join('/')}),emotionRef:()=>({path:'pairs/p1/emotions/u1'}),setDoc:async(ref,data)=>writes.push([ref.path,data]),storageStampV168:()=>({storageVersion:168}),serverTimestamp:()=>1};
  const code=source.slice(source.indexOf('async function writeEmotionData('),source.indexOf('\nfunction mediaCollection'));
  vm.createContext(context);vm.runInContext(code,context);await context.writeEmotionData({entries:[{id:'e1',period:true,intimacy:true,mood:'happy'}]});
  assert.equal(decodeArchive(writes[0][1].payload).entries[0].period,true);
  const shared=decodeArchive(writes[1][1].payload);assert.equal(shared.entries[0].period,undefined);assert.equal(shared.entries[0].intimacy,undefined);assert.equal(shared.entries[0].mood,'happy');
});
