import test from 'node:test';
import assert from 'node:assert/strict';
import * as d from '../private-calendar-v175.js';

const period = (extra = {}) => ({id:'p1',startDate:'2026-09-01',endDate:'2026-09-05',note:'',...extra});
const settings = (extra = {}) => ({menstrualEnabled:true,cycleLength:28,periodLength:5,revision:1,...extra});

test('intimacy requires exact confirmed verified account, never case-folding or profile-only labels', () => {
  for (const email of d.INTIMACY_EMAILS) assert.equal(d.canUsePrivateIntimacy({uid:'u1',email,emailVerified:true}),true);
  for (const user of [null,{}, {uid:'u1',email:'qhals5060@gmail.com'}, {uid:'u1',email:'qhals5060@@gmail.com',emailVerified:true}, {uid:'u1',email:'QHALS5060@gmail.com',emailVerified:true}, {uid:'u1',email:'friend@example.test',emailVerified:true}]) assert.equal(d.canUsePrivateIntimacy(user),false);
});
test('settings default off; disabling does not mutate or delete historical records', () => {
  assert.equal(d.normalizePrivateCalendarSettings().menstrualEnabled,false);
  const records=[{...period(),revision:1}], before=JSON.stringify(records);
  assert.deepEqual(d.privateCalendarMarkers({settings:settings({menstrualEnabled:false}),periods:records},'2026-09-01','2026-09-30'),[]);
  assert.equal(JSON.stringify(records),before);
});
test('actual days, next estimated cycle, intimacy share the date without overriding actual days', () => {
  const data={settings:settings(),periods:[{...period(),revision:1}],canUseIntimacy:true,intimacy:[{date:'2026-09-01'}]};
  const marks=d.privateCalendarMarkers(data,'2026-09-01','2026-10-31');
  assert.equal(marks.filter(row=>row.kind==='period').length,5);
  assert.equal(marks.filter(row=>row.kind==='period-estimate').length,5);
  assert(marks.some(row=>row.date==='2026-09-29'&&row.kind==='period-estimate'));
  assert(marks.some(row=>row.date==='2026-09-01'&&row.kind==='intimacy'));
  assert(!marks.some(row=>row.date==='2026-10-27'),'no rolling fictitious monthly predictions');
  data.periods.push({...period({id:'p2',startDate:'2026-09-27',endDate:'2026-10-01'}),revision:1});
  const updated=d.privateCalendarMarkers(data,'2026-09-01','2026-10-10');
  assert(!updated.some(row=>row.kind==='period-estimate'));
  assert.equal(d.privateCalendarMarkers({...data,canUseIntimacy:false},'2026-09-01','2026-10-10').some(row=>row.kind==='intimacy'),false);
});
test('truncated periods suppress estimates; markers never infer actual or intimacy data', () => {
  const marks=d.privateCalendarMarkers({settings:settings(),periods:[{...period(),revision:1}],hasMore:{periods:true}},'2026-09-01','2026-10-31');
  assert.equal(marks.some(row=>row.kind==='period-estimate'),false);
  assert.deepEqual(d.privateCalendarMarkers({settings:settings()},'2026-09-01','2026-10-31'),[]);
});
test('strict fields, valid dates, bounded period/range/revisions and IDs reject malformed values', () => {
  for (const value of ['2026-02-30','2026-13-01','2026-09-1','1899-12-31','2201-01-01']) assert.throws(()=>d.privateCalendarDate(value));
  for (const extra of [{id:'../x'},{ownerUid:'other'},{startDate:'2026-09-06'},{endDate:'2026-12-31'},{note:'x'.repeat(501)}]) assert.throws(()=>d.normalizePrivateCalendarEntry('period',period(extra)));
  assert.throws(()=>d.privateCalendarRange({from:'2026-01-01',to:'2027-01-02'}));
  assert.throws(()=>d.privateCalendarSettingsInput(settings({revision:undefined})));
  assert.throws(()=>d.privateCalendarRevision(-1));
  assert.equal(d.privateCalendarDate('2024-02-29'),'2024-02-29');
});
test('create/update replay is idempotent; conflicting revisions never silently overwrite', () => {
  const action={type:'period-save',item:period(),expectedRevision:0};
  const first=d.privateCalendarMutation(action); assert.equal(first.item.revision,1);
  assert.equal(d.privateCalendarMutation(action,first.item).changed,false);
  assert.throws(()=>d.privateCalendarMutation({...action,item:period({note:'different'})},first.item),{code:'conflict'});
  const updated=d.privateCalendarMutation({...action,item:period({note:'corrected'}),expectedRevision:1},first.item);
  assert.equal(updated.item.revision,2);
  assert.equal(d.privateCalendarMutation({...action,item:period({note:'corrected'}),expectedRevision:1},updated.item).changed,false);
  assert.throws(()=>d.privateCalendarMutation(action,updated.item),{code:'conflict'});
});
test('deletion leaves only an identifier/version tombstone and cannot resurrect from a stale save', () => {
  const stored={...period(),revision:1};
  const removed=d.privateCalendarMutation({type:'period-delete',id:'p1',expectedRevision:1},stored);
  assert.deepEqual(removed,{changed:true,deleted:true,id:'p1',revision:2});
  assert.equal(d.privateCalendarMutation({type:'period-delete',id:'p1',expectedRevision:1},removed).changed,false);
  assert.throws(()=>d.privateCalendarMutation({type:'period-save',item:period(),expectedRevision:0},removed),{code:'conflict'});
});
test('settings use revision and idempotence; quota keeps its actionable code and cooldown', () => {
  const action={type:'settings',item:{menstrualEnabled:true,cycleLength:28,periodLength:5},expectedRevision:0};
  const created=d.privateCalendarMutation(action); assert.equal(created.settings.revision,1);
  assert.equal(d.privateCalendarMutation(action,created.settings).changed,false);
  assert.throws(()=>d.privateCalendarMutation({...action,item:{...action.item,cycleLength:29}},created.settings),{code:'conflict'});
  const error=d.privateCalendarError({code:'firestore/resource-exhausted'}); assert.equal(error.code,'resource-exhausted');assert.equal(error.retryAfterMs,300000);
  const ordinary=new Error('temporary');assert.equal(d.privateCalendarError(ordinary),ordinary);
});
test('shared emotion projection strips only private flags and never mutates private original', () => {
  const payload={period:true,intimacy:true,entries:[{id:'e1',mood:'happy',period:true,intimacy:true,note:'normal'}],unrelated:'kept'};
  const clean=d.withoutPrivateEmotionFlags(payload);
  assert.equal(payload.entries[0].period,true);
  assert.deepEqual(clean,{entries:[{id:'e1',mood:'happy',note:'normal'}],unrelated:'kept'});
});
