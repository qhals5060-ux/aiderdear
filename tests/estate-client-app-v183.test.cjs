// Run the shipped ESTATE client with actual account rules and isolated browser/fetch doubles.
// No live Firebase, production writes, Android bridge or persisted private data is used.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {webcrypto,createHash}=require('node:crypto');
const root=path.join(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8').replace(/\r\n/g,'\n');
const source=read('android-src/assets/estate-client-v171.js');
const domain=read('estate-domain-v171.js');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const settle=async()=>{for(let i=0;i<30;i++)await Promise.resolve();};
const response=(data,status=200)=>({ok:status>=200&&status<300,status,json:async()=>data});
const bitmap=()=>({width:1200,height:800,closed:false,close(){this.closed=true;}});
const identityError=error=>error.code==='estate-identity-changed';
const target={entityCollection:'properties',entityId:'property-a',thumbnail:false};

function fixture(){
  const state={user:{uid:'owner-a',email:'qhals5060@gmail.com'}},events=new Map(),calls=[],tokens=[],changed=[],created=[],revoked=[];
  let serial=0,handler=async()=>response({ok:true}),getToken=async uid=>'token-'+uid,decode=value=>Buffer.from(value,'base64').toString('binary'),makeBitmap=async()=>bitmap(),digest=(...args)=>webcrypto.subtle.digest(...args);
  const window={
    addEventListener(name,fn){if(!events.has(name))events.set(name,[]);events.get(name).push(fn);},
    AiderDearFirebase:{getState:()=>state,getFirebaseIdToken:async()=>{const uid=state.user?.uid;tokens.push(uid);return getToken(uid);}},
    AiderLogNative:{openExternal(){throw Error('ESTATE must stay inside the app');}}
  };
  const context=vm.createContext({
    window,Blob,File,Uint8Array,AbortSignal,console,
    crypto:{randomUUID:()=>`test-request-${++serial}`,subtle:{digest:(...args)=>digest(...args)}},
    URL:{createObjectURL(blob){const url=`blob:test-${created.length+1}`;created.push({url,blob,uid:state.user?.uid});return url;},revokeObjectURL:url=>revoked.push(url)},
    fetch:async(url,options)=>{const call={url,options,payload:JSON.parse(options.body),uid:state.user?.uid};calls.push(call);return handler(call);},
    atob:value=>decode(value),btoa:value=>Buffer.from(value,'binary').toString('base64'),
    createImageBitmap:file=>makeBitmap(file),
    document:{createElement(tag){assert.equal(tag,'canvas');return {getContext:()=>({drawImage(){}}),toBlob:fn=>fn(new Blob(['jpeg'],{type:'image/jpeg'}))};}}
  });
  vm.runInContext(domain.replace(/\bexport /g,''),context,{filename:'estate-domain-v171.js'});
  vm.runInContext(source.replace(/^import[^\n]*\n/,'').replace('export function createEstateClient','function createEstateClient'),context,{filename:'estate-client-v171.js'});
  const api=context.createEstateClient(uid=>changed.push(uid));
  return {api,state,calls,tokens,changed,created,revoked,
    setActor(uid,email=uid==='owner-a'?'qhals5060@gmail.com':'abckms5698@naver.com',emit=true){state.user=uid?{uid,email}:null;if(emit)for(const fn of events.get('aiderdear-firebase-state')||[])fn();},
    fetch:fn=>handler=fn,token:fn=>getToken=fn,bitmap:fn=>makeBitmap=fn,decode:fn=>decode=fn,digest:fn=>digest=fn};
}
function uploadResponses(f){
  let number=0;
  f.fetch(async({payload})=>response(payload.action==='mediaBegin'?{id:`file-${++number}`,chunkBytes:3}:payload.action==='mediaFinish'?{id:payload.id}:{}));
}
function downloadResponses(f,{type='image/jpeg',sha256}={}){
  f.fetch(async({payload})=>response(payload.action==='mediaInfo'?{name:'private.jpg',type,size:6,chunkBytes:3,...(sha256?{sha256}:{})}:{data:Buffer.from(payload.index?'def':'abc').toString('base64')}));
}

test('site, APK source and canonical APK client are identical',()=>{
  assert.equal(source,read('estate-client-v171.js'));
  assert.equal(source,read('../AiderLog-v145-decoded/assets/estate-client-v171.js'));
});

test('app requests use its existing HTTPS origin and Firebase bearer token; retries keep the request ID',async()=>{
  const f=fixture();f.fetch(async()=>f.calls.length===1?response({error:'temporary'},503):response({row:{id:'saved'}}));
  const result=await f.api.call('save',{collection:'properties',row:{title:'본인 매물'}});
  assert.equal(result.row.id,'saved');assert.equal(f.calls.length,2);assert.deepEqual(f.tokens,['owner-a','owner-a']);
  for(const call of f.calls){assert.equal(call.url,'/api/estate');assert.equal(new URL(call.url,'https://aiderdear1.vercel.app/index.html').origin,'https://aiderdear1.vercel.app');assert.equal(call.options.method,'POST');assert.equal(call.options.credentials,'same-origin');assert.equal(call.options.cache,'no-store');assert.equal(call.options.headers.Authorization,'Bearer token-owner-a');assert.equal(call.options.headers['Content-Type'],'application/json');}
  assert.equal(f.calls[0].options.body,f.calls[1].options.body,'a retry reuses the complete mutation receipt');
});

test('unauthorized or logged-out accounts cannot request a token or access ESTATE',async()=>{
  for(const [uid,email] of [['unrelated','not-allowed@example.test'],['','']]){
    const f=fixture();f.setActor(uid,email);await assert.rejects(f.api.call('context'),/지정된 두 계정/);assert.equal(f.tokens.length,0);assert.equal(f.calls.length,0);
  }
});

test('a pending token cannot start or retry a request after the account changes',async()=>{
  const f=fixture(),gate=deferred();f.token(()=>gate.promise);
  const rejected=assert.rejects(f.api.call('save',{collection:'customers'}),identityError);await settle();f.setActor('owner-b');gate.resolve('token-owner-a');await rejected;
  assert.deepEqual(f.tokens,['owner-a']);assert.equal(f.calls.length,0);
});

test('logout and relogin to the same UID invalidate its previous token work',async()=>{
  const f=fixture(),gate=deferred();f.token(()=>gate.promise);
  const rejected=assert.rejects(f.api.call('context'),identityError);await settle();f.setActor('');f.setActor('owner-a');gate.resolve('token-owner-a');await rejected;
  assert.equal(f.calls.length,0);assert.deepEqual(f.changed,['owner-a','','owner-a']);
});

test('late response and transient failure from the former owner cannot return data or retry with the new token',async()=>{
  for(const failed of [false,true]){
    const f=fixture(),gate=deferred();f.fetch(()=>gate.promise);
    const rejected=assert.rejects(f.api.call('list',{collection:'customers'}),identityError);await settle();f.setActor('owner-b');
    if(failed)gate.reject(Error('network interrupted'));else gate.resolve(response({rows:[{name:'owner-a private data'}]}));
    await rejected;assert.equal(f.calls.length,1);assert.deepEqual(f.tokens,['owner-a']);
  }
});

test('authorization errors are not retried',async()=>{
  for(const status of [401,403]){const f=fixture();f.fetch(async()=>response({error:'denied'},status));await assert.rejects(f.api.call('context'),error=>error.status===status);assert.equal(f.calls.length,1);}
});

test('normal upload sends every chunk and finish with one owner; a same-owner failure still cleans up',async()=>{
  const f=fixture();uploadResponses(f);const saved=await f.api.upload(new File(['abcdef'],'private.pdf',{type:'application/pdf'}),target);
  assert.equal(saved.id,'file-1');assert.equal(saved.name,'private.pdf');assert.equal(saved.size,6);
  assert.deepEqual(f.calls.map(c=>c.payload.action),['mediaBegin','mediaChunk','mediaChunk','mediaFinish']);
  assert.deepEqual(f.calls.filter(c=>c.payload.action==='mediaChunk').map(c=>Buffer.from(c.payload.data,'base64').toString()),['abc','def']);
  assert(f.calls.every(c=>c.options.headers.Authorization==='Bearer token-owner-a'));
  const failure=fixture();failure.fetch(async({payload})=>payload.action==='mediaBegin'?response({id:'failed-upload',chunkBytes:3}):payload.action==='mediaChunk'?response({error:'invalid chunk'},400):response({ok:true}));
  await assert.rejects(failure.api.upload(new File(['abc'],'private.pdf',{type:'application/pdf'}),target),/invalid chunk/);
  assert.deepEqual(failure.calls.map(c=>c.payload.action),['mediaBegin','mediaChunk','mediaDelete']);
});

test('account change during initial image compression cannot begin an upload',async()=>{
  const f=fixture(),gate=deferred(),image=bitmap();f.bitmap(()=>gate.promise);
  const rejected=assert.rejects(f.api.upload(new File(['png'],'private.png',{type:'image/png'}),target),identityError);await settle();f.setActor('owner-b');gate.resolve(image);await rejected;
  assert.equal(f.calls.length,0);assert.equal(f.tokens.length,0);assert.equal(image.closed,true);
});

test('account change while reading an upload chunk cannot send a chunk, finish or cleanup under the next owner',async()=>{
  const f=fixture(),gate=deferred();uploadResponses(f);
  const file={name:'private.pdf',type:'application/pdf',size:3,slice:()=>({arrayBuffer:()=>gate.promise})};
  const rejected=assert.rejects(f.api.upload(file,target),identityError);await settle();assert.equal(f.calls[0].payload.action,'mediaBegin');
  f.setActor('owner-b');gate.resolve(new Uint8Array([1,2,3]).buffer);await rejected;
  assert.deepEqual(f.calls.map(c=>c.payload.action),['mediaBegin']);assert.deepEqual(f.tokens,['owner-a']);
});

test('account change while an upload response is pending prevents subsequent chunks and cleanup',async()=>{
  const f=fixture(),gate=deferred();f.fetch(async({payload})=>payload.action==='mediaBegin'?response({id:'upload-a',chunkBytes:3}):gate.promise);
  const rejected=assert.rejects(f.api.upload(new File(['abcdef'],'private.pdf',{type:'application/pdf'}),target),identityError);await settle();assert.equal(f.calls.length,2);
  f.setActor('owner-b');gate.resolve(response({ok:true}));await rejected;
  assert.deepEqual(f.calls.map(c=>c.payload.action),['mediaBegin','mediaChunk']);assert(f.calls.every(c=>c.uid==='owner-a'));
});

test('thumbnail generation retains the original upload owner and cannot delete a new owner file after a switch',{timeout:2000},async()=>{
  const f=fixture(),gate=deferred(),entered=deferred();uploadResponses(f);let images=0;f.bitmap(async()=>{if(++images===1)return bitmap();entered.resolve();return gate.promise;});
  const rejected=assert.rejects(f.api.upload(new File(['png'],'private.png',{type:'image/png'}),{...target,thumbnail:true}),identityError);
  await entered.promise;assert.equal(images,2);assert.equal(f.calls.at(-1).payload.action,'mediaFinish');
  f.setActor('owner-b');gate.resolve(bitmap());await rejected;
  assert.equal(f.calls.filter(c=>c.payload.action==='mediaBegin').length,1);assert.equal(f.calls.filter(c=>c.payload.action==='mediaDelete').length,0);assert(f.calls.every(c=>c.uid==='owner-a'));
});

test('normal chunked downloads verify content and reject a mismatched digest',async()=>{
  const f=fixture();downloadResponses(f,{type:'application/pdf',sha256:createHash('sha256').update('abcdef').digest('hex')});
  const downloaded=await f.api.download('private-file');assert.equal(await downloaded.blob.text(),'abcdef');assert.equal(downloaded.type,'application/pdf');
  assert.deepEqual(f.calls.map(c=>c.payload.action),['mediaInfo','mediaReadChunk','mediaReadChunk']);
  const bad=fixture();downloadResponses(bad,{sha256:'0'.repeat(64)});await assert.rejects(bad.api.image('bad-image'),/파일 검증/);assert.equal(bad.created.length,0);
});

test('account change between download chunks cannot request the next owner chunk',async()=>{
  const f=fixture();downloadResponses(f);f.decode(value=>{f.setActor('owner-b');return Buffer.from(value,'base64').toString('binary');});
  await assert.rejects(f.api.download('same-file-id'),identityError);
  assert.deepEqual(f.calls.map(c=>c.payload.action),['mediaInfo','mediaReadChunk']);assert(f.calls.every(c=>c.uid==='owner-a'));
});

test('account change during image integrity verification cannot create a stale object URL',{timeout:2000},async()=>{
  const f=fixture(),gate=deferred(),entered=deferred();downloadResponses(f,{sha256:'0'.repeat(64)});f.digest(()=>{entered.resolve();return gate.promise;});
  const rejected=assert.rejects(f.api.image('private-image'),identityError);await entered.promise;
  f.setActor('owner-b');gate.resolve(new Uint8Array(32).buffer);await rejected;assert.equal(f.created.length,0);
});

test('account changes immediately revoke cached image URLs and reuse of an ID loads the current owner image',async()=>{
  const f=fixture();downloadResponses(f);const first=await f.api.image('same-id');assert.equal(await f.api.image('same-id'),first);assert.equal(f.calls.length,3);
  f.setActor('owner-b');assert.deepEqual(f.revoked,[first]);const second=await f.api.image('same-id');assert.notEqual(first,second);assert.equal(f.created[1].uid,'owner-b');
  assert(f.calls.slice(3).every(c=>c.options.headers.Authorization==='Bearer token-owner-b'));
  f.setActor('');assert.deepEqual(f.revoked,[first,second]);await assert.rejects(f.api.image('same-id'),/지정된 두 계정/);assert.equal(f.calls.length,6);
});

test('concurrent previews of one image share a tracked URL that is revoked on logout',async()=>{
  const f=fixture();downloadResponses(f);const [first,second]=await Promise.all([f.api.image('same-id'),f.api.image('same-id')]);
  assert.equal(first,second);assert.equal(f.created.length,1);
  f.setActor('');assert.deepEqual(f.revoked,f.created.map(item=>item.url));
});
