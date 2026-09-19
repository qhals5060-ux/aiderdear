// Local demo emulator only; no production credentials or data are used.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import path from 'node:path';
import {financeDispatch,ASSET_COLLECTION} from '../server/finance-store-v190.mjs';
const host=process.env.FIRESTORE_EMULATOR_HOST||'';
const enabled=/^(127\.0\.0\.1|localhost):\d+$/.test(host)&&!!process.env.RULES_TEST_MODULE_ROOT;
test('real Firestore transactions keep finance revisions atomic, compressed data readable and owners separate',{skip:!enabled},async()=>{
 const require=createRequire(path.join(process.env.RULES_TEST_MODULE_ROOT,'package.json'));
 const {initializeApp,deleteApp}=require('firebase-admin/app'),{getFirestore,FieldValue}=require('firebase-admin/firestore');
 const app=initializeApp({projectId:'demo-aiderlog-finance-v190'},'finance-v190-emulator');const db=getFirestore(app),uid='local-owner-'+Date.now(),user={uid};
 const command={action:'save',expectedOwnerKey:uid,id:'005930',watched:true,note:'영구 보관',expectedRevision:0,requestId:'local-first-request-0001'};
 const commitOptions={commitTimestamp:()=>FieldValue.serverTimestamp()};
 try{
  await db.doc(`users/${uid}/private/main`).set({payload:{personalItems:[{id:'keep-original',title:'기존 금융'}]}});
  const first=await financeDispatch(db,user,command,commitOptions);assert.equal(first.record.revision,1);
  const results=await Promise.allSettled([0,1].map(i=>financeDispatch(db,user,{...command,expectedRevision:1,note:'수정 '+i,requestId:'local-concurrent-request-000'+i},commitOptions)));
  assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.find(r=>r.status==='rejected').reason.status,409);
  const stored=(await db.doc(`users/${uid}/${ASSET_COLLECTION}/005930`).get()).data();assert.equal(stored.encoding,'gzip-json-v190');assert.equal(stored.revision,2);
  const loaded=await financeDispatch(db,user,{action:'read',expectedOwnerKey:uid});assert.equal(loaded.records.length,1);assert.equal(loaded.records[0].historyCount,2);
  assert.equal((await financeDispatch(db,{uid:uid+'-other'},{action:'read',expectedOwnerKey:uid+'-other'})).records.length,0);
  const incremental=await financeDispatch(db,user,{action:'read',expectedOwnerKey:uid,since:loaded.checkedAt});assert.equal(incremental.records.length,0);
  assert.equal((await db.doc(`users/${uid}/private/main`).get()).data().payload.personalItems[0].title,'기존 금융');
  // Hold a real transaction after preparing its write. A read in the gap must
  // still see that eventual commit on its next incremental poll.
  let release,started;const gate=new Promise(r=>release=r),ready=new Promise(r=>started=r);
  const delayedDb={doc:db.doc.bind(db),collection:db.collection.bind(db),runTransaction:fn=>db.runTransaction(async tx=>{const result=await fn(tx);started();await gate;return result;})};
  const delayed=financeDispatch(delayedDb,user,{...command,expectedRevision:2,note:'지연 커밋 기록',requestId:'local-delayed-request-0001'},{...commitOptions,now:1000});
  await ready;let gap;try{gap=await financeDispatch(db,user,{action:'read',expectedOwnerKey:uid});assert.equal(gap.records[0].revision,2);}finally{release();}
  await delayed;const later=await financeDispatch(db,user,{action:'read',expectedOwnerKey:uid,since:gap.checkedAt});assert.equal(later.records.length,1);assert.equal(later.records[0].note,'지연 커밋 기록');assert.equal(later.records[0].revision,3);
 }finally{await db.terminate();await deleteApp(app);}
});
