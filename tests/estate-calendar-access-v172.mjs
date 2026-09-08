import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {registerHooks} from 'node:module';
import {MemoryFirestore} from './estate-api-store-v171.mjs';

const forbidden='()=>{throw Error("Live services forbidden")}',stubs={
 'firebase-admin/firestore':`export const FieldPath={documentId:()=> '__name__'};export const getFirestore=${forbidden};`,
 'firebase-admin/auth':`export const getAuth=${forbidden};`,
 'firebase-admin/app':`export const applicationDefault=${forbidden},cert=${forbidden},getApps=${forbidden},initializeApp=${forbidden};`
};
const hooks=registerHooks({resolve(s,c,next){return stubs[s]?{url:'data:text/javascript,'+encodeURIComponent(stubs[s]),shortCircuit:true}:next(s,c);}});
const {dispatch}=await import('../api/estate.mjs');hooks.deregister();
const actors=[{uid:'calendar-owner-a',email:'qhals5060@gmail.com',email_verified:true},{uid:'calendar-owner-b',email:'abckms5698@naver.com',email_verified:true}];
const call=(db,who,action,body={})=>dispatch(db,who,{action,...body,requestId:crypto.randomUUID()});
async function calendar(db,who){
 const rows=new Map(),seen=new Set();let cursor=null;
 do {const page=await call(db,who,'calendar',{cursor});for(const row of page.rows)rows.set(row.id,row);cursor=page.cursor||null;if(cursor){assert(!seen.has(cursor));seen.add(cursor);}}while(cursor);
 return [...rows.values()];
}
for(const actor of actors)test(`${actor.email}: saved and changed tasks project once into SCHEDULE without personal sharing writes`,async()=>{
 const db=new MemoryFirestore(),id='calendar-task';
 const saved=await call(db,actor,'save',{collection:'tasks',id,row:{title:'방문 준비',date:'2026-09-10',time:'14:30',status:'open'},expectedRevision:0});
 let rows=await calendar(db,actor);assert.equal(rows.length,1);assert.equal(rows[0].date,'2026-09-10');assert.equal(rows[0].category,'estate');assert.equal(rows[0].sourceKind,'tasks');assert.equal(rows[0].sourceId,id);assert.equal(rows[0].readOnly,true);
 const stableId=rows[0].id;
 await call(db,actor,'save',{collection:'tasks',id,row:{...saved.row,date:'2026-09-11'},expectedRevision:saved.row.revision});
 rows=await calendar(db,actor);assert.equal(rows.length,1);assert.equal(rows[0].id,stableId);assert.equal(rows[0].date,'2026-09-11');
 const other=actors.find(a=>a.uid!==actor.uid);assert.deepEqual(await calendar(db,other),[]);
 assert([...db.rows.keys()].every(path=>path.startsWith(`estateWorkspaces/${actor.uid}/`)),'projections do not write to personal, couple or friend collections');
});
