'use strict';
// Actual adapter functions in a local VM. No Firebase SDK/network/account/file upload.
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'firebase-app.js'),'utf8');
const section=(start,end)=>{const a=source.indexOf(start),b=source.indexOf(end,a);assert.ok(a>=0&&b>a);return source.slice(a,b);};
const shared=section('function captureMediaUploadContextV176(', 'async function readMedia(');
const privateUpload=section('async function uploadPrivateMedia(', 'async function readPrivateMedia(');
const direct=section('function directPhotoPayload(', 'async function markDirectLetterRead(');
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject}};
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
function fixture(overrides={}){
 const writes=[],commits=[],metadata=[],letters=[],db={};const state={user:{uid:'synthetic-a',email:'a@example.invalid',name:'A'},pair:null,friends:[],partner:null};
 const auth={currentUser:{uid:'synthetic-a'}},file={name:'synthetic.jpg',type:'image/jpeg',size:3,arrayBuffer:async()=>new Uint8Array([1,2,3]).buffer};
 const ref=(base,...parts)=>({path:[...(base===db?[]:base.path),...parts]});
 const context={state,auth,db,Date,crypto:{randomUUID:()=> 'synthetic-random-id'},Uint8Array,
  requireUser:()=>{if(!auth.currentUser||!state.user)throw Error('signed out');return state.user},
  pairScope:()=>state.pair?{base:['pairs',state.pair.id]}:{base:['users',state.user.uid]},
  compressImage:async value=>value,videoDurationSeconds:async()=>10,doc:ref,collection:ref,
  Bytes:{fromUint8Array:value=>value,fromBase64String:value=>({syntheticBase64:value})},serverTimestamp:()=> 'synthetic-server-time',
  writeBatch:()=>{const rows=[];return {set:(target,data)=>rows.push({target,data}),commit:async()=>{commits.push(rows);writes.push(...rows);metadata.push(...rows.filter(row=>row.data.createdBy))}}},
  setDoc:async(target,data)=>metadata.push({target,data}),addDoc:async(target,data)=>{letters.push({target,data});return {id:'synthetic-letter'}},cleanEmail:value=>String(value||'').toLowerCase(),...overrides};
 vm.runInNewContext(shared+privateUpload+direct,context);
 return {context,auth,state,file,writes,commits,metadata,letters,change(uid='synthetic-b'){auth.currentUser={uid};state.user={uid,email:uid+'@example.invalid',name:uid};}};
}
for(const name of ['uploadPrivateMedia','uploadMedia']){
 test(name+' keeps the captured owner path and metadata through successful upload',async()=>{
  const f=fixture(),result=await f.context[name](f.file);assert.ok(result.id);assert.equal(f.metadata.length,1);
  const expected=['users','synthetic-a',name==='uploadPrivateMedia'?'privateMedia':'media'];
  assert.deepEqual(f.metadata[0].target.path.slice(0,3),expected);assert.equal(f.metadata[0].data.createdBy,'synthetic-a');
  for(const write of f.writes)assert.deepEqual(write.target.path.slice(0,3),expected);
 });
 test(name+' rejects account changes during compression before creating a write',async()=>{
  const compressed=deferred(),f=fixture({compressImage:()=>compressed.promise}),pending=f.context[name](f.file);f.change();compressed.resolve(f.file);
  await assert.rejects(pending,{code:'auth/context-changed'});assert.equal(f.writes.length+f.metadata.length,0);
 });
 test(name+' rejects same-UID reauthentication while reading bytes',async()=>{
  const bytes=deferred(),f=fixture();f.file.arrayBuffer=()=>bytes.promise;const pending=f.context[name](f.file);await flush();f.change('synthetic-a');bytes.resolve(new Uint8Array([1]).buffer);
  await assert.rejects(pending,{code:'auth/context-changed'});assert.equal(f.writes.length+f.metadata.length,0);
 });
 test(name+' rejects a profile/auth mismatch before compression',async()=>{
  let compressed=0;const f=fixture({compressImage:async file=>{compressed++;return file}});f.auth.currentUser={uid:'synthetic-b'};
  await assert.rejects(f.context[name](f.file),{code:'auth/context-changed'});assert.equal(compressed,0);
 });
 test(name+' rejects late completion without retargeting an in-flight batch to a new account',async()=>{
  const commit=deferred(),staged=[];const f=fixture({writeBatch:()=>({set:(target,data)=>staged.push({target,data}),commit:()=>commit.promise})});
  const pending=f.context[name](f.file);await flush();f.change();commit.resolve();await assert.rejects(pending,{code:'auth/context-changed'});
  assert.equal(f.metadata.length,0);for(const row of staged)assert.equal(row.target.path[1],'synthetic-a');
 });
 test(name+' exposes storage errors without reporting a successful upload',async()=>{
  const error=Object.assign(Error('synthetic quota'),{code:'resource-exhausted'}),f=fixture({writeBatch:()=>({set:()=>{},commit:async()=>{throw error}})});
  await assert.rejects(f.context[name](f.file),e=>e===error);assert.equal(f.metadata.length,0);
 });
 test(name+' atomically commits one-chunk photo bytes and metadata without a second request',async()=>{
  const f=fixture({setDoc:async()=>{throw Error('small photo must not write metadata separately')}});
  await f.context[name](f.file);assert.equal(f.commits.length,1);assert.equal(f.commits[0].length,2);
  assert.equal(f.commits[0][0].target.path.at(-1),'00000');assert.equal(f.commits[0][0].data.data.length,3);
  assert.equal(f.commits[0][1].data.chunkCount,1);assert.equal(f.commits[0][1].data.createdBy,'synthetic-a');
 });
 test(name+' failed one-chunk atomic request leaves no metadata-only or bytes-only document',async()=>{
  const attempted=[],applied=[],error=Object.assign(Error('synthetic failed atomic request'),{code:'resource-exhausted'});
  const f=fixture({writeBatch:()=>{const rows=[];return {set:(target,data)=>rows.push({target,data}),commit:async()=>{attempted.push(rows);throw error}}},setDoc:async(...args)=>applied.push(args)});
  await assert.rejects(f.context[name](f.file),e=>e===error);assert.equal(attempted.length,1);assert.equal(attempted[0].length,2);assert.equal(applied.length,0);
 });
 test(name+' retains the existing multiple-chunk and non-photo save policy',async()=>{
  for(const kind of ['large-image','document']){
   const f=fixture();if(kind==='large-image'){f.file.size=700*1024+1;f.file.arrayBuffer=async()=>new Uint8Array(f.file.size).buffer;}else f.file.type='application/pdf';
   await f.context[name](f.file);assert.equal(f.commits.length,1);assert.equal(f.commits[0].length,kind==='large-image'?2:1);assert.equal(f.metadata.length,1);
   assert.equal(f.metadata[0].data.type,kind==='large-image'?'image/jpeg':'application/pdf');
  }
 });
}
test('shared media scope change during compression is blocked, private media remains owner-only',async()=>{
 const compressed=deferred(),f=fixture({compressImage:()=>compressed.promise});f.state.pair={id:'synthetic-pair-a'};
 const sharedPending=f.context.uploadMedia(f.file),privatePending=f.context.uploadPrivateMedia(f.file);f.state.pair={id:'synthetic-pair-b'};compressed.resolve(f.file);
 await assert.rejects(sharedPending,{code:'auth/context-changed'});await privatePending;
 assert.deepEqual(f.metadata[0].target.path.slice(0,3),['users','synthetic-a','privateMedia']);
});
test('shared media rejects account change during video duration inspection',async()=>{
 const duration=deferred(),f=fixture({videoDurationSeconds:()=>duration.promise});f.file.type='video/mp4';const pending=f.context.uploadMedia(f.file);await flush();f.change();duration.resolve(10);
 await assert.rejects(pending,{code:'auth/context-changed'});assert.equal(f.writes.length+f.metadata.length,0);
});
test('direct letter photo arrays preserve legacy first image and cap count and total size',()=>{
 const f=fixture(),photo='data:image/jpeg;base64,YWJj';
 const payload=f.context.directPhotosPayload([photo,photo],null);assert.equal(payload.photoMimeType,'image/jpeg');assert.equal(payload.additionalPhotos.length,1);
 assert.equal(f.context.directPhotosPayload(undefined,photo).additionalPhotos,undefined);
 assert.throws(()=>f.context.directPhotosPayload(Array(7).fill(photo)),/최대 6장/);
 assert.throws(()=>f.context.directPhotosPayload(Array(6).fill('data:image/jpeg;base64,'+'a'.repeat(150000))),/최대 6장/);
 assert.throws(()=>f.context.directPhotosPayload(['https://fixture.invalid/private.jpg']),/형식/);
});
test('direct letter sends photos only to an existing pair/friend and preserves seven-day rule',async()=>{
 const f=fixture();f.state.friends=[{uid:'synthetic-friend',email:'friend@example.invalid',friendshipId:'synthetic-friendship'}];
 await f.context.sendDirectLetter({toUid:'synthetic-friend',toEmail:'friend@example.invalid',body:'synthetic letter',photoDataUrls:['data:image/jpeg;base64,YWJj','data:image/jpeg;base64,YWJj']});
 assert.equal(f.letters.length,1);assert.equal(f.letters[0].data.additionalPhotos.length,1);assert.equal(f.letters[0].data.connectionType,'friend');
 await assert.rejects(f.context.sendDirectLetter({toUid:'stranger',toEmail:'stranger@example.invalid',body:'synthetic'}));assert.equal(f.letters.length,1);
 const rules=fs.readFileSync(path.join(root,'firestore.rules'),'utf8'),block=rules.slice(rules.indexOf('match /directLetters/'),rules.indexOf('match /ephemeralMedia/'));
 assert.match(block,/request\.resource\.data\.fromUid == request\.auth\.uid/);assert.match(block,/hasAll\(request\.resource\.data\.memberUids\)/);
 assert.match(block,/duration\.value\(7, 'd'\)/);
});
