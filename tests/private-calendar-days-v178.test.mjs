import test from 'node:test';
import assert from 'node:assert/strict';
import * as d from '../private-calendar-v175.js';
import {createPrivateCalendarFirebaseFixture as harness} from './private-calendar-firebase-fixture-v175.mjs';
const range={from:'2026-09-01',to:'2026-09-30'};
const action=(kind='period',active=true,expectedRevision=0)=>({type:'day-set',kind,date:'2026-09-12',active,expectedRevision});
function pair(h){h.state.pair={id:'p1'};h.seed('pairs/p1',{status:'active',memberUids:['u1','u2']});h.seed('pairMemberships/u1',{status:'active',pairId:'p1'});}
test('direct day actions preserve old ranges and override only the selected day',async()=>{
  const h=harness();h.seed('users/u1/menstrualEntries/old',{id:'old',startDate:'2026-09-11',endDate:'2026-09-14',revision:1,note:'keep'});
  const original=structuredClone(h.rows.get('users/u1/menstrualEntries/old'));
  await h.mutate(action('period',false));let data=await h.read(range);
  assert.equal(d.privateCalendarDayState(data,'period','2026-09-12').active,false);
  assert.equal(d.privateCalendarDayState(data,'period','2026-09-13').active,true);
  await h.mutate(action('period',true,1));data=await h.read(range);
  assert.equal(data.settings.menstrualEnabled,true);assert.equal(d.privateCalendarDayState(data,'period','2026-09-12').active,true);
  assert.deepEqual(h.rows.get('users/u1/menstrualEntries/old'),original);
  assert(!h.writes.some(path=>path.startsWith('pairs/')));
});
test('only explicit new day toggles create minimal current-couple projections; idempotent replay never backfills',async()=>{
  const h=harness();await h.mutate(action());pair(h);
  const writes=h.writes.length;assert.equal((await h.mutate(action())).changed,false);assert.equal(h.writes.length,writes);
  assert.equal(h.rows.has('pairs/p1/menstrualDays/u1_2026-09-12'),false);
  await h.mutate(action('period',false,1));const shared=h.rows.get('pairs/p1/menstrualDays/u1_2026-09-12');
  assert.equal(shared.active,false);assert.deepEqual(Object.keys(shared).sort(),['active','date','kind','ownerUid','pairId','revision','updatedAt','version']);
  await h.mutate(action('intimacy'));assert(h.rows.get('pairs/p1/intimacyDays/u1_2026-09-12').active);
  assert(!h.writes.some(path=>/app\/main|friends|emotions|schedules/.test(path)));
});
test('stale or disconnected couple link fails before any owner write; in-flight link change aborts',async()=>{
  for(const change of ['disconnected','wrong-members','membership','midflight']){
    const h=harness();pair(h);
    if(change==='disconnected')h.rows.get('pairs/p1').status='disconnected';
    if(change==='wrong-members')h.rows.get('pairs/p1').memberUids=['u2','u3'];
    if(change==='membership')h.rows.get('pairMemberships/u1').pairId='other';
    if(change==='midflight')h.before(()=>{h.state.pair=null;});
    await assert.rejects(h.mutate(action()));assert.equal(h.writes.length,0);
  }
});
test('intimacy day-set and shared reads reject nonallowlisted or unverified principals',async()=>{
  for(const [email,verified]of [['other@example.test',true],['qhals5060@gmail.com',false]]){
    const h=harness(email,verified);pair(h);await assert.rejects(h.mutate(action('intimacy')),{code:'permission-denied'});await h.read(range);
    assert(!h.reads.some(path=>/intimacy/.test(path)));assert.equal(h.writes.length,0);
  }
});
test('partner projection is separate from own toggle state and requires verified intimacy access',async()=>{
  const h=harness();pair(h);
  h.seed('pairs/p1/menstrualDays/u2_2026-09-12',{ownerUid:'u2',pairId:'p1',date:'2026-09-12',kind:'period',active:true,revision:1});
  h.seed('pairs/p1/intimacyDays/u2_2026-09-12',{ownerUid:'u2',pairId:'p1',date:'2026-09-12',kind:'intimacy',active:true,revision:1});
  const data=await h.read(range);assert.equal(d.privateCalendarDayState(data,'period','2026-09-12').active,false);
  assert.deepEqual(d.privateCalendarMarkers(data,range.from,range.to).map(row=>row.kind).sort(),['intimacy','period']);
  assert.deepEqual(d.privateCalendarMarkers({...data,canUseIntimacy:false},range.from,range.to).map(row=>row.kind),['period']);
});
test('day-set is independent, bounded and revision-safe under retries',()=>{
  const first=d.privateCalendarDayMutation(action());assert.equal(first.item.revision,1);
  assert.equal(d.privateCalendarDayMutation(action(),first.item).changed,false);
  assert.throws(()=>d.privateCalendarDayMutation(action('period',false),first.item),{code:'conflict'});
  assert.throws(()=>d.privateCalendarDayMutation({...action(),date:'2026-02-31'}));
  assert.throws(()=>d.privateCalendarDayMutation({...action(),note:'must not share'}));
});
test('pair watch is date-bounded, cancellable and drops callbacks after account/link changes',async()=>{
  const h=harness();pair(h);const listeners=[];let changes=0,errors=0,stopped=0;
  h.context.onSnapshot=(ref,next,fail)=>{listeners.push({ref,next,fail});return()=>stopped++;};
  const stop=h.context.watchPrivateCalendarPair(range,()=>changes++,()=>errors++);for(let n=0;n<20;n++)await Promise.resolve();
  assert.equal(listeners.length,2);assert(listeners.every(row=>row.ref.path.startsWith('pairs/p1/')));
  assert(listeners.every(row=>row.ref.constraints.some(c=>c.type==='limit'&&c.value===201)));
  listeners[0].next();assert.equal(changes,1);h.state.pair=null;listeners[0].next();assert.equal(changes,1);assert.equal(errors,1);
  stop();listeners[0].next();listeners[1].fail(Error('late'));assert.equal(stopped,2);assert.equal(errors,1);
});
