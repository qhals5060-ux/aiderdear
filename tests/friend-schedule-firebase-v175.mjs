import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import * as domain from '../friend-schedule-v175.js';
const original=await readFile(new URL('../friend-schedule-firebase-v175.js',import.meta.url),'utf8');
const source=original.replace(/^import[^\n]*\n/gm,'').replace('const firebase={collection,doc,getDoc,getDocs,query,where,orderBy,limit,startAfter,runTransaction,serverTimestamp};','const firebase={};').replace('export function createFriendScheduleAdapter','function createFriendScheduleAdapter')+'\nglobalThis.create=createFriendScheduleAdapter;';
const input={id:'e1',title:'개인 일정',date:'2026-09-12',endDate:'2026-09-12',time:'09:00',endTime:'10:00',allDay:false,isAiderDear:true,authorEmail:'user@example.test',memo:'비공개'};
function harness(){
  let state={user:{uid:'u1',email:'user@example.test'},friends:[{uid:'u2',friendshipId:'f1'},{uid:'u3',friendshipId:'f2'}]},readHook=null,fail='';
  const rows=new Map(),writes=[],queries=[];
  for(const [fid,uid]of [['f1','u2'],['f2','u3']])rows.set('friendships/'+fid,{status:'active',memberUids:['u1',uid]});
  const snapshot=path=>({id:path.split('/').at(-1),path,exists:()=>rows.has(path),data:()=>structuredClone(rows.get(path))});
  const get=async path=>{if(readHook)await readHook(path);if(path.includes(fail)&&fail)throw new Error('Injected write/read failure');return snapshot(path);};
  const sdk={doc:(_db,...parts)=>parts.join('/'),collection:(_db,...parts)=>parts.join('/'),getDoc:get,where:(field,op,value)=>({field,op,value}),orderBy:field=>({order:field}),limit:take=>({take}),startAfter:after=>({after}),query:(path,...constraints)=>({path,constraints}),serverTimestamp:()=>123456,
    getDocs:async q=>{queries.push(q);if(readHook)await readHook(q.path);const constraints=q.constraints;let docs=[...rows.keys()].filter(path=>path.startsWith(q.path+'/')&&!path.slice(q.path.length+1).includes('/')).map(snapshot);for(const c of constraints.filter(c=>c.field))docs=docs.filter(row=>c.op==='>='?row.data()[c.field]>=c.value:row.data()[c.field]<=c.value);const order=constraints.find(c=>c.order)?.order;docs.sort((a,b)=>String(a.data()[order]).localeCompare(String(b.data()[order]))||a.path.localeCompare(b.path));const cursor=constraints.find(c=>c.after)?.after;if(cursor)docs=docs.slice(docs.findIndex(row=>row.path===cursor.path)+1);return{docs:docs.slice(0,constraints.find(c=>c.take)?.take||100)};},
    runTransaction:async(_db,callback)=>{const pending=[];await callback({get,set:(path,value)=>pending.push({path,value}),delete:path=>pending.push({path,remove:true})});for(const row of pending){if(row.remove)rows.delete(row.path);else rows.set(row.path,structuredClone(row.value));writes.push(row);}}
  };
  const context=vm.createContext({...domain});vm.runInContext(source,context);
  const adapter=context.create({db:{},getContext:()=>state,sdk});
  const path=(fid,owner='u1',id='e1')=>'friendships/'+fid+'/scheduleShares/'+domain.friendScheduleDocumentId(owner,id);
  return {adapter,rows,writes,queries,path,get state(){return state},set state(value){state=value},set fail(value){fail=value},set readHook(value){readHook=value},context:()=>domain.friendScheduleContext(state)};
}
test('explicit selected friend gets safe projection, original data untouched; retry is idempotent',async()=>{
  const h=harness();h.rows.set('users/u1/schedule/main',{payload:[input]});
  await h.adapter.setTargets(input,['f1']);await h.adapter.setTargets(input,['f1']);
  assert(h.rows.has(h.path('f1')));assert(!h.rows.has(h.path('f2')));assert.deepEqual(h.rows.get('users/u1/schedule/main'),{payload:[input]});
  assert.equal([...h.rows.keys()].filter(path=>path.includes('/scheduleShares/')).length,1);assert(!JSON.stringify(h.rows.get(h.path('f1'))).includes('비공개'));assert.deepEqual(Array.from(await h.adapter.targets('e1')),['f1']);
});
test('target change revokes prior recipient; remove unshares without deleting personal schedule',async()=>{
  const h=harness();await h.adapter.setTargets(input,['f1']);await h.adapter.setTargets({...input,title:'변경'},['f2']);assert(!h.rows.has(h.path('f1')));assert.equal(h.rows.get(h.path('f2')).title,'변경');await h.adapter.remove('e1');assert(!h.rows.has(h.path('f2')));
});
test('business/invalid target fails before any read or write',async()=>{
  const h=harness();await assert.rejects(h.adapter.setTargets({...input,projectionSource:'estate-visit'},['f1']),/개인 일정/);await assert.rejects(h.adapter.setTargets(input,['stranger']),/연결된 친구/);assert.equal(h.writes.length,0);
});
test('revoked link and adapter failures are explicit partial failures; retry repairs same IDs',async()=>{
  const h=harness();h.fail='friendships/f2';await assert.rejects(h.adapter.setTargets(input,['f1','f2']),error=>{assert.equal(error.code,'partial-failure');assert.deepEqual(Array.from(error.failedFriendshipIds),['f2']);return true;});assert(h.rows.has(h.path('f1')));h.fail='';await h.adapter.setTargets(input,['f1','f2']);assert(h.rows.has(h.path('f2')));
  h.rows.delete('friendships/f2');await assert.rejects(h.adapter.setTargets(input,['f2']),error=>error.code==='partial-failure');
});
test('identity/friend change during await cancels uncommitted write',async()=>{
  const h=harness();h.readHook=async()=>{h.state={user:{uid:'u9',email:'other@example.test'},friends:[]};h.readHook=null;};await assert.rejects(h.adapter.setTargets(input,['f1']),/변경/);assert.equal(h.writes.length,0);
});
test('bounded month read includes ongoing multi-day events and excludes own/old/future rows',async()=>{
  const h=harness(),friend={...h.context(),uid:'u2',email:'friend@example.test'},share=overrides=>domain.createFriendScheduleShare({...input,authorEmail:friend.email,...overrides},friend,'f1');
  h.rows.set(h.path('f1','u2','old'),share({id:'old',date:'2026-08-01',endDate:'2026-08-01'}));
  h.rows.set(h.path('f1','u2','span'),share({id:'span',date:'2026-08-20',endDate:'2026-09-18'}));
  h.rows.set(h.path('f1','u2','future'),share({id:'future',date:'2026-10-15',endDate:'2026-10-15'}));
  await h.adapter.setTargets(input,['f1']);const result=await h.adapter.read({from:'2026-09-01',to:'2026-09-30'});
  assert.deepEqual(Array.from(result.events,row=>row.sourceId),['span']);assert(result.events[0].readOnly);assert.deepEqual(Array.from(result.ownTargetsByEventId.e1),['f1']);assert.equal(h.queries.length,2);assert(h.queries.every(q=>q.constraints.some(c=>c.take===100)));
});
test('malformed shared payload is an error, never silently shown or partially returned',async()=>{
  const h=harness();await h.adapter.setTargets(input,['f1']);h.rows.get(h.path('f1')).memo='unexpected private data';await assert.rejects(h.adapter.read({from:'2026-09-01',to:'2026-09-30'}),/형식/);
});
test('a mismatched owner/source at an own share key cannot be mistaken for own sharing',async()=>{
  const h=harness();await h.adapter.setTargets(input,['f1']);h.rows.get(h.path('f1')).sourceEventId='different';await assert.rejects(h.adapter.targets('e1'),/식별자/);
  const before=h.writes.length;await assert.rejects(h.adapter.setTargets(input,['f1']),error=>error.code==='partial-failure');assert.equal(h.writes.length,before);
});
test('pagination fetches all bounded pages and returns each event once',async()=>{
  const h=harness(),friend={...h.context(),uid:'u2',email:'friend@example.test'};
  for(let i=0;i<101;i++)h.rows.set(h.path('f1','u2','page-'+i),domain.createFriendScheduleShare({...input,id:'page-'+i,authorEmail:friend.email},friend,'f1'));
  const result=await h.adapter.read({from:'2026-09-01',to:'2026-09-30'});assert.equal(result.events.length,101);assert.equal(new Set(result.events.map(row=>row.id)).size,101);assert.equal(h.queries.length,3);
});
test('factory has no watcher, local persistent cache, generic user reads or Google calls',()=>{assert(!/onSnapshot|localStorage|indexedDB|googleapis\.com|collectionGroup|users.*private/.test(original));assert(original.includes('11.10.0/firebase-firestore.js'));});
