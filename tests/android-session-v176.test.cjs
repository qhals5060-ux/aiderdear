'use strict';
// Local doubles only: no network, real Google credential, user record or SDK login.
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const source=read('android-session-v176.js'),firebase=read('firebase-app.js');
const modulePromise=import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return {promise,resolve,reject};};
const flush=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
async function fixture(overrides={}){
 const module=await modulePromise,values=new Map(),writes=[],launches=[],credentials=[],exchanges=[],diagnostics=[];
 let random=0,time=10000000;
 const auth={currentUser:null,authStateReady:async()=>{}};
 const storage={getItem:key=>values.get(key)||null,setItem:(key,value)=>{writes.push([key,value]);values.set(key,value)},removeItem:key=>{values.delete(key)}};
 const deps={auth,provider:{credential:(id,access)=>{const result={id,access};credentials.push(result);return result}},
  signInWithCredential:async(target,credential)=>{exchanges.push(credential);target.currentUser={uid:'synthetic-user'};return {user:target.currentUser}},
  preparePersistence:async()=>{},bridge:()=>({startGoogleLogin:url=>launches.push(url)}),storage,
  crypto:{getRandomValues:bytes=>{assert.equal(bytes.length,32);bytes.fill(++random);return bytes}},now:()=>time,diagnostic:detail=>diagnostics.push(detail),...overrides};
 const session=module.createAndroidSession(deps),key=module.ANDROID_LOGIN_PENDING_KEY;
 return {session,deps,auth:deps.auth,storage,values,writes,launches,credentials,exchanges,diagnostics,key,
  pending:()=>JSON.parse(values.get(key)||'null'),setTime:value=>time=value,
  callback:params=>'aiderlog://auth?'+new URLSearchParams({state:JSON.parse(values.get(key)||'null')?.state||'',id_token:'synthetic-id-token',...params})};
}

test('Android start waits for persisted identity restoration before opening the browser',async()=>{
 const persistence=deferred(),ready=deferred();let readyCalls=0;
 const auth={currentUser:null,authStateReady:()=>{readyCalls++;return ready.promise}};
 const f=await fixture({auth,preparePersistence:()=>persistence.promise}),result=f.session.begin();
 await flush();assert.equal(f.launches.length,0);assert.equal(readyCalls,0);
 persistence.resolve();await flush();assert.equal(readyCalls,1);assert.equal(f.launches.length,0);
 auth.currentUser={uid:'restored-local-user'};ready.resolve();
 assert.deepEqual(await result,{user:auth.currentUser,restored:true});assert.equal(f.writes.length,0);
});
test('Android start coalesces double taps and persists only a 256-bit state and timestamp',async()=>{
 const persistence=deferred(),f=await fixture({preparePersistence:()=>persistence.promise});
 const first=f.session.begin(),second=f.session.begin();persistence.resolve();await Promise.all([first,second]);
 assert.equal(f.launches.length,1);assert.equal(f.writes.length,1);
 assert.deepEqual(Object.keys(f.pending()).sort(),['createdAt','state']);assert.match(f.pending().state,/^[a-f0-9]{64}$/);
 const url=new URL(f.launches[0]);assert.equal(url.origin,'https://aiderdear1.vercel.app');assert.equal(url.pathname,'/android-auth.html');
 assert.equal(url.searchParams.get('state'),f.pending().state);assert.equal(url.searchParams.get('release'),'176');
 assert.equal(url.searchParams.size,2);assert.equal(f.exchanges.length,0);
});
test('Android cancelled start cannot create a pending request or open a browser after logout',async()=>{
 const persistence=deferred(),f=await fixture({preparePersistence:()=>persistence.promise});
 const first=assert.rejects(f.session.begin(),{code:'auth/cancelled'});await f.session.cancel();persistence.resolve();await first;
 assert.equal(f.launches.length,0);assert.equal(f.pending(),null);
});
test('Android browser handoff can complete after the WebView session adapter is recreated',async()=>{
 const f=await fixture();await f.session.begin();const callback=f.callback();
 const reopened=(await modulePromise).createAndroidSession(f.deps);
 const result=await reopened.complete(callback);assert.equal(result.user.uid,'synthetic-user');assert.equal(f.exchanges.length,1);assert.equal(f.pending(),null);
});
test('Android storage failures block browser launch and expose a stable non-token error',async()=>{
 for(const storage of [{getItem:()=>null,setItem:()=>{throw Error('synthetic quota')},removeItem:()=>{}},{getItem:()=>null,setItem:()=>{},removeItem:()=>{}}]){
  const f=await fixture({storage});await assert.rejects(f.session.begin(),{code:'auth/storage-unavailable'});assert.equal(f.launches.length,0);
 }
});
test('Android unavailable native bridge never starts or accepts a browser callback',async()=>{
 const f=await fixture({bridge:()=>null});assert.equal(f.session.enabled(),false);
 await assert.rejects(f.session.begin(),{code:'auth/native-unavailable'});
 await assert.rejects(f.session.complete('aiderlog://auth?state=synthetic'),{code:'auth/native-unavailable'});assert.equal(f.writes.length,0);
});
test('Android bridge launch failure removes its unusable pending request',async()=>{
 const error=Object.assign(Error('synthetic bridge error'),{code:'auth/native-launch-failed'});
 const f=await fixture({bridge:()=>({startGoogleLogin:()=>{throw error}})});
 await assert.rejects(f.session.begin(),e=>e!==error&&e.code==='auth/native-launch-failed'&&!e.message.includes('synthetic'));assert.equal(f.pending(),null);
});
test('Android callback rejects wrong scheme, host, userinfo, path, port and fragment',async()=>{
 for(const prefix of ['https://auth','aiderlog://other','aiderlog://user@auth','aiderlog://auth/path','aiderlog://auth:123','aiderlog://auth/#fragment']){
  const f=await fixture();await f.session.begin();const url=new URL(prefix);url.search=new URL(f.callback()).search;
  await assert.rejects(f.session.complete(url.href),{code:'auth/invalid-callback'},prefix);assert.equal(f.exchanges.length,0);
 }
});
test('Android callback rejects repeated state or credential parameters',async()=>{
 for(const key of ['state','id_token','access_token','error']){
  const f=await fixture();await f.session.begin();const url=new URL(f.callback());url.searchParams.append(key,'one');url.searchParams.append(key,'two');
  await assert.rejects(f.session.complete(url.href),{code:'auth/invalid-callback'});assert.equal(f.exchanges.length,0);
 }
});
test('Android callback rejects missing, mismatched, corrupt, future and expired pending state',async()=>{
 for(const change of [f=>f.values.delete(f.key),f=>f.values.set(f.key,'{bad json'),f=>f.values.set(f.key,JSON.stringify({...f.pending(),state:'f'.repeat(64)})),f=>f.setTime(9999999),f=>f.setTime(11200001)]){
  const f=await fixture();await f.session.begin();const callback=f.callback();change(f);
  await assert.rejects(f.session.complete(callback),{code:'auth/expired-request'});assert.equal(f.exchanges.length,0);
 }
});
test('Android provider failure consumes matching pending state without using credential payload',async()=>{
 const f=await fixture();await f.session.begin();await assert.rejects(f.session.complete(f.callback({error:'synthetic-provider-error'})),{code:'auth/provider-error'});
 assert.equal(f.pending(),null);assert.equal(f.credentials.length,0);
});
test('Android empty or excessive credential payload never reaches the SDK',async()=>{
 for(const params of [{id_token:'',access_token:''},{id_token:'x'.repeat(20001)},{access_token:'x'.repeat(20001)}]){
  const f=await fixture();await f.session.begin();await assert.rejects(f.session.complete(f.callback(params)),{code:'auth/invalid-credential'});assert.equal(f.exchanges.length,0);
 }
});
test('Android successful exchange uses the real adapter arguments without persisting tokens',async()=>{
 const f=await fixture();await f.session.begin();const result=await f.session.complete(f.callback({access_token:'synthetic-access-token'}));
 assert.equal(result.user.uid,'synthetic-user');assert.deepEqual(f.credentials,[{id:'synthetic-id-token',access:'synthetic-access-token'}]);
 assert.equal(f.pending(),null);assert.equal(f.exchanges.length,1);
 assert.doesNotMatch(JSON.stringify(f.writes)+JSON.stringify(f.diagnostics),/synthetic-(?:id|access)-token/);
});
test('Android simultaneous and completed duplicate callbacks perform a single SDK exchange',async()=>{
 const sdk=deferred();let count=0;const auth={currentUser:null,authStateReady:async()=>{}};
 const f=await fixture({auth,signInWithCredential:async()=>{count++;await sdk.promise;auth.currentUser={uid:'synthetic-user'};return {user:auth.currentUser}}});
 await f.session.begin();const callback=f.callback(),a=f.session.complete(callback),b=f.session.complete(callback);await flush();assert.equal(count,1);
 sdk.resolve();await Promise.all([a,b]);assert.equal((await f.session.complete(callback)).user.uid,'synthetic-user');assert.equal(count,1);
});
test('Android login tap during credential exchange does not supersede the active request',async()=>{
 const sdk=deferred(),f=await fixture({signInWithCredential:async()=>{await sdk.promise;return {user:{uid:'synthetic-user'}}}});
 await f.session.begin();const callback=f.callback(),state=f.pending().state,result=f.session.complete(callback);await flush();
 const second=f.session.begin();await flush();
 try{assert.equal(f.launches.length,1);assert.equal(f.pending().state,state);}finally{sdk.resolve();await Promise.all([result,second]);}
});
test('Android cancel before SDK exchange prevents sign-in and clears request',async()=>{
 let blocking=false;const persistence=deferred(),f=await fixture({preparePersistence:()=>blocking?persistence.promise:Promise.resolve()});
 await f.session.begin();blocking=true;const result=assert.rejects(f.session.complete(f.callback()),{code:'auth/cancelled'});
 const cancelled=f.session.cancel();persistence.resolve();await Promise.all([result,cancelled]);assert.equal(f.exchanges.length,0);assert.equal(f.pending(),null);
});
test('Android logout waits for an already-started exchange before Firebase signs out',async()=>{
 const sdk=deferred(),order=[];const f=await fixture({signInWithCredential:async()=>{order.push('sign-in-start');await sdk.promise;order.push('sign-in-end');return {user:{uid:'synthetic-user'}}}});
 await f.session.begin();const completion=f.session.complete(f.callback()).catch(e=>e);await flush();
 const logout=f.session.cancel().then(()=>order.push('sign-out'));await flush();assert.deepEqual(order,['sign-in-start']);sdk.resolve();await Promise.all([completion,logout]);
 assert.deepEqual(order,['sign-in-start','sign-in-end','sign-out']);assert.equal(f.pending(),null);
});
test('Android SDK failure preserves request for explicit retry and diagnostics contain only safe code',async()=>{
 const error=Object.assign(Error('synthetic-secret-in-message'),{code:'invalid token synthetic-secret'});
 const f=await fixture({signInWithCredential:async()=>{throw error}});await f.session.begin();await assert.rejects(f.session.complete(f.callback()),e=>e!==error&&e.code==='auth/unknown'&&!e.message.includes('synthetic-secret'));
 assert.ok(f.pending());assert.deepEqual(f.diagnostics,[{stage:'credential-exchange',code:'auth/unknown'}]);
});
test('Android diagnostic failure cannot replace the safe Firebase failure code',async()=>{
 const error=Object.assign(Error('synthetic original'),{code:'auth/network-request-failed'});
 const f=await fixture({signInWithCredential:async()=>{throw error},diagnostic:()=>{throw Error('synthetic logger failure')}});
 await f.session.begin();await assert.rejects(f.session.complete(f.callback()),e=>e!==error&&e.code==='auth/network-request-failed'&&!e.message.includes('synthetic'));
});

test('Android native begin strips credential-bearing persistence and bridge errors before legacy callers can log them',async()=>{
 for(const source of ['persistence','bridge']){
  const secret='synthetic-private-access-token',error=Object.assign(Error(secret),{code:'auth/network-request-failed',accessToken:secret,credential:{idToken:secret},customData:{_tokenResponse:{oauthAccessToken:secret}},cause:Error(secret)});
  const fail=()=>{throw error},f=await fixture(source==='persistence'?{preparePersistence:fail}:{bridge:()=>({startGoogleLogin:fail})});
  await assert.rejects(f.session.begin(),safe=>{assert.notEqual(safe,error);assert.equal(safe.code,'auth/network-request-failed');assert.deepEqual(Object.keys(safe),['code']);assert.doesNotMatch(require('node:util').inspect(safe,{showHidden:true,depth:5}),new RegExp(secret));return true;});
  assert.deepEqual(f.diagnostics,[{stage:'browser-start',code:'auth/network-request-failed'}]);assert.equal(f.pending(),null);
 }
});

test('Android credential exchange and concurrent login reject only sanitized errors while retaining retry state',async()=>{
 const sdk=deferred(),secret='synthetic-private-credential',error=Object.assign(Error(secret),{code:'auth/internal-error',accessToken:secret,credential:{idToken:secret},customData:{email:secret,_tokenResponse:{oauthAccessToken:secret}},cause:Error(secret)});
 const f=await fixture({signInWithCredential:()=>sdk.promise});await f.session.begin();const callback=f.callback();
 const reject=safe=>{assert.notEqual(safe,error);assert.equal(safe.code,'auth/internal-error');assert.deepEqual(Object.keys(safe),['code']);assert.doesNotMatch(require('node:util').inspect(safe,{showHidden:true,depth:5}),new RegExp(secret));return true;};
 const complete=assert.rejects(f.session.complete(callback),reject);await flush();const login=assert.rejects(f.session.begin(),reject);sdk.reject(error);await Promise.all([complete,login]);
 assert.deepEqual(f.diagnostics,[{stage:'credential-exchange',code:'auth/internal-error'}]);assert.ok(f.pending());
});

test('Android error-code allowlist rejects token-looking codes and throwing SDK accessors without inspecting private fields',async()=>{
 for(const error of [{code:'auth/synthetic-secret-code',message:'synthetic-secret-message'},Object.defineProperty({},'code',{get(){throw Error('synthetic-secret-accessor')}})]){
  const f=await fixture({signInWithCredential:async()=>{throw error}});await f.session.begin();
  await assert.rejects(f.session.complete(f.callback()),safe=>{assert.equal(safe.code,'auth/unknown');assert.doesNotMatch(require('node:util').inspect(safe,{showHidden:true,depth:5}),/synthetic-secret/);return true;});
  assert.deepEqual(f.diagnostics,[{stage:'credential-exchange',code:'auth/unknown'}]);
 }
});
test('Android callback cannot switch a user restored while browser authentication was pending',async()=>{
 const f=await fixture();await f.session.begin();const callback=f.callback();f.auth.currentUser={uid:'another-restored-user'};
 await f.session.complete(callback).catch(()=>{});assert.equal(f.exchanges.length,0);assert.equal(f.auth.currentUser.uid,'another-restored-user');
});
test('Android callback awaits late identity restoration and never exchanges credentials over that user',async()=>{
 const ready=deferred(),f=await fixture();await f.session.begin();f.auth.authStateReady=()=>ready.promise;
 const result=f.session.complete(f.callback());await flush();assert.equal(f.exchanges.length,0);
 f.auth.currentUser={uid:'late-restored-synthetic-user'};ready.resolve();
 assert.equal((await result).user.uid,'late-restored-synthetic-user');assert.equal(f.exchanges.length,0);assert.equal(f.pending(),null);
});
test('Android explicit logout invalidates a previously completed callback rather than replaying login',async()=>{
 const f=await fixture();await f.session.begin();const callback=f.callback();await f.session.complete(callback);await f.session.cancel();f.auth.currentUser=null;
 await assert.rejects(f.session.complete(callback),{code:'auth/expired-request'});assert.equal(f.exchanges.length,1);
});

function persistenceFixture(setPersistence){
 const start=firebase.indexOf('let persistenceSetupV176='),end=firebase.indexOf('const androidSessionV176=',start);assert.ok(start>=0&&end>start);
 const context={auth:{},browserLocalPersistence:'local-double',indexedDBLocalPersistence:'indexed-double',setPersistence};
 vm.runInNewContext(firebase.slice(start,end)+';this.prepare=prepareLoginPersistenceV176',context);return context.prepare;
}
test('Firebase persistence setup is serialized, local-first and reused after success',async()=>{
 const ready=deferred(),calls=[],prepare=persistenceFixture(async(auth,kind)=>{calls.push(kind);await ready.promise});
 const a=prepare(),b=prepare();assert.equal(a,b);assert.deepEqual(calls,['local-double']);ready.resolve();await a;await prepare();assert.equal(calls.length,1);
});
test('Firebase persistence falls back to IndexedDB and retries setup after both stores fail',async()=>{
 const calls=[];let failBoth=true;const prepare=persistenceFixture(async(auth,kind)=>{calls.push(kind);if(failBoth||kind==='local-double')throw Error('synthetic storage denied')});
 await assert.rejects(prepare(),{code:'auth/storage-unavailable'});assert.deepEqual(calls,['local-double','indexed-double']);failBoth=false;await prepare();
 assert.deepEqual(calls,['local-double','indexed-double','local-double','indexed-double']);
});
function authListenerFixture(){
 const sourceStart=firebase.indexOf('let authObserverGenerationV176=');assert.ok(sourceStart>=0);
 const profile=deferred(),listeners=[],emissions=[],state={user:null,ready:false},auth={currentUser:null};let callback;
 const context={auth,state,onAuthStateChanged:(_,fn)=>{callback=fn},stopListeners:()=>{},emit:()=>emissions.push({...state}),
  getDoc:async()=>({data:()=>({})}),doc:()=>({}),db:{},ensureUserProfile:()=>profile.promise,startListeners:user=>listeners.push(user.uid),
  propagateMemberProfile:async()=>{},repairPairConnection:async()=>{},setTimeout:()=>{},location:{replace:()=>{throw Error('unexpected redirect')},href:'https://fixture.invalid/'},URL,console:{warn:()=>{}}};
 vm.runInNewContext(firebase.slice(sourceStart),context);
 return {profile,listeners,emissions,state,auth,emit:user=>{auth.currentUser=user;return callback(user)}};
}
test('Firebase stale profile completion after logout cannot resurrect the old account or listeners',async()=>{
 const f=authListenerFixture(),first=f.emit({uid:'old-synthetic-user'});await flush();await f.emit(null);const emitted=f.emissions.length;
 f.profile.resolve({uid:'old-synthetic-user'});await first;
 assert.equal(f.state.user,null);assert.deepEqual(f.listeners,[]);assert.equal(f.emissions.length,emitted);
});
test('Firebase stale profile failure after logout cannot overwrite the signed-out status',async()=>{
 const f=authListenerFixture(),first=f.emit({uid:'old-synthetic-user'});await flush();await f.emit(null);const emitted=f.emissions.length;
 f.profile.reject(Error('synthetic stale profile error'));await first;assert.equal(f.state.error,'');assert.equal(f.emissions.length,emitted);
});
test('Firebase normal restored profile starts current-user listeners once and becomes ready',async()=>{
 const f=authListenerFixture(),result=f.emit({uid:'current-synthetic-user'});await flush();assert.equal(f.state.ready,false);
 f.profile.resolve({uid:'current-synthetic-user'});await result;assert.equal(f.state.user.uid,'current-synthetic-user');assert.deepEqual(f.listeners,['current-synthetic-user']);assert.equal(f.state.ready,true);
});
test('Firebase native handoff remains separate from web login and logout clears native request first',()=>{
 const login=firebase.slice(firebase.indexOf('async function login() {'),firebase.indexOf('async function logout() {'));
 const logout=firebase.slice(firebase.indexOf('async function logout() {'),firebase.indexOf('\n}',firebase.indexOf('async function logout() {'))+2);
 assert.match(login,/if\(androidSessionV176\.enabled\(\)\)return androidSessionV176\.begin\(\)/);assert.match(login,/signInWithPopup\(auth, provider\)/);
 assert.ok(logout.indexOf('await androidSessionV176.cancel()')<logout.indexOf('await signOut(auth)'));
 assert.match(firebase,/completeAndroidGoogleSignIn:\s*androidSessionV176\.complete/);
 assert.match(firebase,/getItem:key=>window\.localStorage\.getItem\(key\)/);
});
test('Browser handoff validates state, uses isolated in-memory auth, and never stores callback tokens',()=>{
 const html=read('android-auth.html');assert.match(html,/name="referrer" content="no-referrer"/);assert.match(html,/\^\[a-f0-9\]\{64\}\$/);
 assert.match(html,/initializeApp\(firebaseConfig, 'android-handoff-v176'\)/);assert.match(html,/setPersistence\(auth, inMemoryPersistence\)/);
 assert.equal((html.match(/button\.addEventListener\('click'/g)||[]).length,1);assert.doesNotMatch(html,/button\.onclick\s*=/);
 assert.doesNotMatch(html,/(?:localStorage|sessionStorage)\.setItem|console\.(?:log|warn|error)\(/);
});
