'use strict';
// Execute the actual upload implementation with a deterministic, atomic Firestore
// double. These are failure-path tests, not live Firebase/device verification.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../firebase-app.js'),'utf8');
const section=(a,b)=>source.slice(source.indexOf(a),source.indexOf(b,source.indexOf(a)));
const script=section('function captureMediaUploadContextV176(', 'async function readMedia(')+section('async function uploadPrivateMedia(', 'async function readPrivateMedia(');
const CHUNK=700*1024;
function fixture({size=9*CHUNK,failAt=0,code='resource-exhausted',applyBeforeFailure=false,afterCommit,cleanupError=false}={}){
 const db={},auth={currentUser:{uid:'a'}},state={user:{uid:'a'},pair:null},attempts=[],documents=new Map();
 const context={db,auth,state,Date,Uint8Array,crypto:{randomUUID:()=> 'synthetic-uuid'},serverTimestamp:()=> 'server-time',
  requireUser:()=>state.user,pairScope:()=>({base:state.pair?['pairs',state.pair.id]:['users',state.user.uid]}),
  compressImage:async f=>f,videoDurationSeconds:async()=>12,Bytes:{fromUint8Array:b=>b},
  doc:(base,...p)=>({path:[...(base===db?[]:base.path),...p]}),collection:(base,...p)=>({path:[...base.path,...p]}),
  setDoc:()=>{throw Error('Metadata must be atomic with final chunks')},
  writeBatch:()=>{const operations=[];return {
   set:(ref,data)=>operations.push({type:'set',ref,data}),delete:ref=>operations.push({type:'delete',ref}),
   commit:async()=>{
    attempts.push(operations);const number=attempts.length,fail=number===failAt;
    if(cleanupError&&operations[0]?.type==='delete')throw Error('cleanup unavailable');
    if(!fail||applyBeforeFailure)for(const op of operations){const key=op.ref.path.join('/');if(op.type==='delete')documents.delete(key);else documents.set(key,op.data);}
    if(afterCommit)afterCommit({number,auth,state,operations});
    if(fail)throw Object.assign(Error('synthetic upload failure'),{code});
   }
  }}
 };
 vm.runInNewContext(script,context);
 return {context,auth,state,attempts,documents,file:{name:'synthetic.mp4',type:'video/mp4',size,arrayBuffer:async()=>new Uint8Array(size).buffer}};
}
for(const name of ['uploadMedia','uploadPrivateMedia']){
 test(name+' stores a 25 MiB video in bounded requests and writes metadata only in the final batch',async()=>{
  const f=fixture({size:25*1024*1024});await f.context[name](f.file);
  assert.equal(f.attempts.length,5);assert.equal(f.documents.size,38);
  for(const [i,ops] of f.attempts.entries()){
   const byteRows=ops.filter(x=>x.data?.data),meta=ops.filter(x=>x.data?.createdBy);
   assert.ok(byteRows.length<=8);assert.ok(byteRows.reduce((n,x)=>n+x.data.data.byteLength,0)<6*1024*1024);
   assert.equal(meta.length,i===f.attempts.length-1?1:0);
  }
  const metadata=[...f.documents.values()].find(x=>x.createdBy);assert.equal(metadata.chunkCount,37);assert.equal(metadata.size,25*1024*1024);
 });
 test(name+' rejects a final batch without leaving previously acknowledged chunks',async()=>{
  const f=fixture({failAt:2});await assert.rejects(f.context[name](f.file),{code:'resource-exhausted'});
  assert.equal(f.documents.size,0);assert.equal(f.attempts.length,3);assert.equal(f.attempts[2].length,8);
  assert.ok(f.attempts[2].every(x=>x.type==='delete'&&x.ref.path.at(-2)==='chunks'));
 });
 test(name+' rejects a middle batch and cleans only chunks from acknowledged requests',async()=>{
  const f=fixture({size:17*CHUNK,failAt:2});await assert.rejects(f.context[name](f.file),{code:'resource-exhausted'});
  assert.equal(f.documents.size,0);assert.equal(f.attempts.length,3);assert.ok(f.attempts.every(ops=>!ops.some(x=>x.data?.createdBy)));
 });
 test(name+' does not delete a possibly successful final network commit',async()=>{
  const f=fixture({failAt:2,code:'unavailable',applyBeforeFailure:true});await assert.rejects(f.context[name](f.file),{code:'unavailable'});
  assert.equal(f.attempts.length,2);assert.equal(f.documents.size,10);assert.ok([...f.documents.values()].some(x=>x.createdBy));
 });
 test(name+' leaves completed data intact when the account changes after final acknowledgement',async()=>{
  const f=fixture({afterCommit:({number,auth,state})=>{if(number===2){auth.currentUser={uid:'b'};state.user={uid:'b'};}}});
  await assert.rejects(f.context[name](f.file),{code:'auth/context-changed'});
  assert.equal(f.attempts.length,2);assert.equal(f.documents.size,10);assert.ok([...f.documents.keys()].every(k=>k.startsWith('users/a/')));
 });
 test(name+' never cleans another account after a mid-upload account change',async()=>{
  const f=fixture({afterCommit:({number,auth,state})=>{if(number===1){auth.currentUser={uid:'b'};state.user={uid:'b'};}}});
  await assert.rejects(f.context[name](f.file),{code:'auth/context-changed'});assert.equal(f.attempts.length,1);assert.equal(f.documents.size,8);
 });
 test(name+' preserves original quota error when cleanup is unavailable',async()=>{
  const f=fixture({failAt:2,cleanupError:true});await assert.rejects(f.context[name](f.file),{code:'resource-exhausted'});assert.equal(f.documents.size,8);
 });
}
