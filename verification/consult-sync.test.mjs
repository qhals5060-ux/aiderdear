import assert from 'node:assert/strict';
import {createConsultSync} from '../consult-sync-v167.js';
const copy=v=>structuredClone(v);let uid='a',store={consultingClients:[{id:'c',name:'Before',createdAt:10}],consultingTasks:[],consultingSessions:[],consultingFiles:[],memos:[]},calls=[],failOnce=false,switchDuringRead=false;
const sync=createConsultSync({currentUid:()=>uid,readCurrent:async()=>{if(switchDuringRead)uid='b';return copy(store)},commitRecord:async(owner,input)=>{
  assert.equal(owner,'a');calls.push(copy(input));
  const prior=store[input.collection].find(r=>r.id===input.id);assert.equal(input.expectedRevision,prior?.revision||0,'revision conflict');
  const row={...input.row,revision:(prior?.revision||0)+1,updatedAt:20};
  if(failOnce){failOnce=false;throw Error('offline')}
  store[input.collection]=[...store[input.collection].filter(r=>r.id!==row.id),row];return {payload:copy(store),row};
},writeRemaining:async(owner,incoming)=>{assert.equal(owner,uid);store={...incoming,...Object.fromEntries(['consultingClients','consultingTasks','consultingSessions','consultingFiles'].map(k=>[k,store[k]]))};return copy(store)}});
let tests=0;const pass=name=>{tests++;console.log('PASS '+name)};
sync.remember(uid,store);let p=copy(store);p.memos.push({id:'m'});await sync.write(p);assert.equal(calls.length,0);pass('unrelated write does not commit Consult');
p=copy(store);p.consultingClients[0].name='App edited';await sync.write(p);assert.equal(store.consultingClients[0].name,'App edited');assert.equal(p.consultingClients[0].revision,1);pass('app edit through per-record API preserves revision');
p=copy(store);store.consultingClients[0]={...store.consultingClients[0],name:'Site newer',revision:2};p.memos.push({id:'m2'});await sync.write(p);assert.equal(store.consultingClients[0].name,'Site newer');assert.equal(p.consultingClients[0].revision,2);pass('stale unedited app row cannot roll back site');
p=copy(store);p.consultingClients[0].name='Pending offline';failOnce=true;await assert.rejects(()=>sync.write(p),/offline/);const request=calls.at(-1).requestId;await sync.write(p);assert.equal(calls.at(-1).requestId,request);pass('uncertain retry reuses request ID');
p=copy(store);p.consultingClients[0].name='Conflict edit';store.consultingClients[0].revision++;await assert.rejects(()=>sync.write(p),/revision conflict/);assert.equal(p.consultingClients[0].name,'Conflict edit');pass('conflict preserves user input and rejects overwrite');
sync.remember(uid,store);p=copy(store);p.consultingClients=[];await assert.rejects(()=>sync.write(p),/삭제/);assert.equal(store.consultingClients.length,1);pass('full save cannot delete existing originals');
p=copy(store);switchDuringRead=true;await assert.rejects(()=>sync.write(p),/계정/);pass('late read after account change denied');
console.log('ALL '+tests);
