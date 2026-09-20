import test from 'node:test';
import assert from 'node:assert/strict';
import {randomBytes} from 'node:crypto';
import {financeDispatch,ASSET_COLLECTION} from '../server/finance-store-v190.mjs';
import {createHandler} from '../api/assets.mjs';
import {createAssetsClient} from '../assets-client-v190.js';
import {defaultDetails,normalizeDetails,validateAssetDetails} from '../finance-management-v190.js';
import {normalizeCustom} from '../finance-product-v190.js';
const clone=x=>structuredClone(x),owner={uid:'owner-a'},another={uid:'owner-b'};
function memory(){const docs=new Map([['users/owner-a/private/main',{payload:{personalItems:[{id:'existing',title:'금융 기록'}]}}]]),writes=[];const snap=(path)=>({id:path.split('/').at(-1),exists:docs.has(path),data:()=>clone(docs.get(path))});const db={docs,writes,doc(path){return{path,get:async()=>snap(path)};},collection(path){return{doc:id=>db.doc(path+'/'+id),get:async()=>({docs:[...docs.keys()].filter(key=>key.startsWith(path+'/')&&!key.slice(path.length+1).includes('/')).map(snap)}),where(field,operator,value){assert.equal(operator,'>=');return{get:async()=>({docs:(await db.collection(path).get()).docs.filter(d=>d.data()[field]>=value)})};}};},async runTransaction(fn){const queued=[];const value=await fn({get:ref=>ref.get(),set(ref,data){queued.push([ref.path,clone(data)]);}});for(const [key,row]of queued){docs.set(key,row);writes.push(key);}return value;}};return db;}
const read=(uid=owner.uid)=>({action:'read',expectedOwnerKey:uid});
const save=(values={})=>({action:'save',expectedOwnerKey:owner.uid,id:'005930',watched:true,note:'오래 보관할 메모',expectedRevision:0,requestId:'finance-request-000001',...values});
const custom=(kind='stock')=>({id:'custom-test',kind,currency:'KRW',name:'내 직접 등록',sub:'내 기록',price:10000,quoteBase:kind==='bond'?10000:kind==='fund'?1000:1,...(kind==='property'?{area:84.5}:{})});
test('finance is owner-separated, preserves private main, rejects employees and mismatched token owner',async()=>{const db=memory(),before=clone(db.docs);await financeDispatch(db,owner,save());assert.deepEqual(db.docs.get('users/owner-a/private/main'),before.get('users/owner-a/private/main'));assert.equal((await financeDispatch(db,another,read(another.uid))).records.length,0);await assert.rejects(financeDispatch(db,another,save()),e=>e.status===401);db.docs.set('workIdentities/owner-a',{kind:'employee'});await assert.rejects(financeDispatch(db,owner,read()),e=>e.status===403);assert.equal(db.writes.length,1);});
test('legacy assetWorkspaceV184 records are read and unknown fields retained when updated',async()=>{const db=memory(),key=`users/${owner.uid}/${ASSET_COLLECTION}/005930`;db.docs.set(key,{asset_id:'005930',watched:0,note:'원본',custom:null,details:null,history:null,updated_at:'2020-01-01T00:00:00.000Z',legacyExtra:{keep:true}});const first=await financeDispatch(db,owner,read());assert.equal(first.records[0].revision,0);const next=await financeDispatch(db,owner,save());assert.deepEqual(next.record.legacyExtra,{keep:true});assert.equal(next.record.revision,1);assert.equal((await financeDispatch(db,owner,read())).records[0].note,'오래 보관할 메모');});
test('all history survives more than thirty edits and is paged only in the read response',async()=>{const db=memory();for(let i=0;i<55;i++)await financeDispatch(db,owner,save({note:'기록 '+i+' '+ '한'.repeat(1990),expectedRevision:i,requestId:'permanent-request-'+String(i).padStart(6,'0')}),{now:Date.UTC(2020,0,1)+i*86400000});const row=(await financeDispatch(db,owner,read())).records[0];assert.equal(row.historyCount,55);assert.equal(JSON.parse(row.history).length,30);const older=await financeDispatch(db,owner,{action:'history',expectedOwnerKey:owner.uid,id:'005930',cursor:25});assert.equal(JSON.parse(older.history).length,25);assert.equal(older.cursor,null);assert(JSON.parse(older.history)[0].changes.some(c=>c.field==='메모'&&c.to.length>160));assert.equal(older.total,55);const data=db.docs.get(`users/${owner.uid}/${ASSET_COLLECTION}/005930`);assert.equal(data.encoding,'gzip-json-v190');assert(data.packed.length<data.rawBytes);});
test('idempotent response-loss retries do not increment revision or duplicate history; stale edits fail',async()=>{const db=memory(),command=save();const first=await financeDispatch(db,owner,command);const retry=await financeDispatch(db,owner,clone(command));assert(retry.replayed);assert.equal(retry.record.revision,1);assert.equal(first.record.history,retry.record.history);assert.equal(db.writes.length,1);await assert.rejects(financeDispatch(db,owner,save({requestId:'stale-request-000001'})),e=>e.status===409);await assert.rejects(financeDispatch(db,owner,save({note:'changed same nonce'})),e=>e.status===409);});
test('five product types and quote-base protections remain valid; malformed fields do not write',async()=>{for(const kind of ['stock','etf','bond','fund','property']){const db=memory(),asset=custom(kind);const result=await financeDispatch(db,owner,save({id:asset.id,custom:asset}));assert.equal(JSON.parse(result.record.custom).kind,kind);}const db=memory();await assert.rejects(financeDispatch(db,owner,save({custom:{...custom(),id:'005930'}})),e=>e.status===400);await assert.rejects(financeDispatch(db,owner,save({note:'x'.repeat(2001)})));assert.equal(db.writes.length,0);assert.throws(()=>normalizeCustom({...custom('bond'),quoteBase:0},'custom-test'));assert.throws(()=>normalizeDetails({...defaultDetails(),quantity:2}));assert.throws(()=>validateAssetDetails({...custom('bond'),quoteBase:1000},defaultDetails(),custom('bond'),{...defaultDetails(),targetPrice:100}));});
test('incremental reads include only changed rows and preserve the full initial snapshot contract',async()=>{const db=memory(),time=Date.UTC(2026,8,20);await financeDispatch(db,owner,save(),{now:time});const first=await financeDispatch(db,owner,read(),{now:time+1});const noChanges=await financeDispatch(db,owner,{...read(),since:first.checkedAt},{now:time+2});assert.equal(noChanges.records.length,0);assert(noChanges.incremental);await financeDispatch(db,owner,save({expectedRevision:1,requestId:'new-edit-request-0001',note:'새 기록'}),{now:time+3});assert.equal((await financeDispatch(db,owner,{...read(),since:first.checkedAt})).records[0].note,'새 기록');});
async function http(handler,input){const r={setHeader(){},end(s){this.body=JSON.parse(s);}};await handler(input,r);return r;}
test('finance health is read-only and API rejects missing auth and untrusted origins',async()=>{let calls=0;const handler=createHandler({enabled:true,getServices:async()=>{calls++;return{db:{},auth:{verifyIdToken:async()=>owner}};},dispatch:async(db,u,input)=>({ownerKey:u.uid,records:[]})});assert.equal((await http(handler,{method:'GET',url:'/?action=health',headers:{}})).body.version,190);assert.equal(calls,0);assert.equal((await http(handler,{method:'POST',headers:{}})).statusCode,401);assert.equal((await http(handler,{method:'POST',headers:{origin:'https://invalid.test',authorization:'Bearer a'}})).statusCode,403);});
function clientFixture(fetchImpl){let user={uid:'owner-a'},changed;const firebase={getState:()=>({user}),getFirebaseIdToken:async()=> 'token',subscribe(fn){changed=fn;fn();return()=>{};}};const events=new EventTarget(),client=createAssetsClient({enabled:true,getFirebase:()=>firebase,fetchImpl,events});return{client,firebase,change(next){user=next;changed();}};}
test('bridge merges incremental reads, captures owner, reuses nonce after lost response, and clears on account change',async()=>{const bodies=[];let fail=true,reads=0;const fx=clientFixture(async(url,opt)=>{const b=JSON.parse(opt.body);bodies.push(b);if(b.action==='read')return{ok:true,json:async()=>({ownerKey:'owner-a',signedIn:true,records:++reads===1?[{asset_id:'005930',note:'old',revision:1}]:[],checkedAt:'2026-09-20T00:00:00.000Z',incremental:reads>1})};if(fail){fail=false;throw new TypeError('lost');}return{ok:true,json:async()=>({ownerKey:'owner-a',record:{asset_id:'005930',note:'new',revision:2}})};});assert.equal((await fx.client.read()).records.length,1);assert.equal((await fx.client.read()).records.length,1);assert(bodies[1].since);const input={...save(),expectedRevision:1,note:'new'};await assert.rejects(fx.client.save(input));await fx.client.save(clone(input));assert.equal(bodies[2].requestId,bodies[3].requestId);assert(bodies.every(b=>b.expectedOwnerKey==='owner-a'));fx.change(null);assert.deepEqual((await fx.client.read()).records,[]);});
test('bridge rejects token and response resolving after account transitions',async()=>{let resolve;const fx=clientFixture(()=>new Promise(r=>resolve=r));const pending=fx.client.read();await new Promise(r=>setImmediate(r));fx.change({uid:'owner-b'});resolve({ok:true,json:async()=>({ownerKey:'owner-a',records:[]})});await assert.rejects(pending,e=>e.status===401);let token;fx.firebase.getFirebaseIdToken=()=>new Promise(r=>token=r);const delayed=fx.client.read();fx.change(null);token('later');await assert.rejects(delayed,e=>e.status===401);});

test('oversized or malformed legacy records are preserved without replacement',async()=>{const db=memory(),key=`users/${owner.uid}/${ASSET_COLLECTION}/005930`,legacy={asset_id:'005930',watched:0,note:'keep',revision:0,history:null,custom:null,details:null,legacyUnknown:randomBytes(800000).toString('base64')};db.docs.set(key,clone(legacy));await assert.rejects(financeDispatch(db,owner,save()),e=>e.status===413);assert.deepEqual(db.docs.get(key),legacy);assert.equal(db.writes.length,0);db.docs.set(key,{...legacy,legacyUnknown:null,history:JSON.stringify([{unrecognized:'retain'}])});await assert.rejects(financeDispatch(db,owner,save()),e=>e.status===409);assert.equal(db.writes.length,0);});

test('a read started while save is in flight cannot replace the saved cache with an older snapshot',async()=>{const waiting=[];const fx=clientFixture((url,opt)=>new Promise(resolve=>waiting.push({body:JSON.parse(opt.body),resolve})));const change=fx.client.save(save());await new Promise(r=>setImmediate(r));const refresh=fx.client.read();await new Promise(r=>setImmediate(r));waiting[0].resolve({ok:true,json:async()=>({ownerKey:owner.uid,record:{asset_id:'005930',revision:1,note:'saved'}})});await change;waiting[1].resolve({ok:true,json:async()=>({ownerKey:owner.uid,records:[],incremental:false,checkedAt:'2026-09-20T00:00:00.000Z'})});assert.equal((await refresh).records[0].note,'saved');});

test('same user returning after sign-out does not revive a stale response',async()=>{let resolve;const fx=clientFixture(()=>new Promise(r=>resolve=r)),pending=fx.client.read();await new Promise(r=>setImmediate(r));fx.change(null);fx.change(owner);resolve({ok:true,json:async()=>({ownerKey:owner.uid,records:[{asset_id:'005930',note:'stale'}]})});await assert.rejects(pending,e=>e.status===401);});

test('invalid form values return 400 through the real handler and do not write',async()=>{const db=memory(),handler=createHandler({enabled:true,getServices:async()=>({db,auth:{verifyIdToken:async()=>owner}})});for(const command of [save({id:'custom-test',custom:{...custom('bond'),quoteBase:0}}),save({details:{...defaultDetails(),quantity:2}})]){const result=await http(handler,{method:'POST',headers:{authorization:'Bearer token'},body:command});assert.equal(result.statusCode,400);assert.equal(db.writes.length,0);}});

test('read rejects account changes in the call-to-cache microtask gap and keeps the next owner cache empty',async()=>{
 for(const returnToSameOwner of [false,true]){
  const bodies=[];let responses=0;
  const fx=clientFixture(async(url,opt)=>{
   const body=JSON.parse(opt.body);bodies.push(body);
   return{ok:true,json(){
    if(++responses===1){
     // First allow call() to validate its JSON response, then change auth before
     // read() resumes its await and merges that response into the shared cache.
     queueMicrotask(()=>queueMicrotask(()=>{fx.change(null);fx.change(returnToSameOwner?owner:another);}));
     return{ownerKey:owner.uid,signedIn:true,records:[{asset_id:'005930',revision:1,note:'private owner A'}],incremental:false,checkedAt:'2026-09-20T00:00:00.000Z'};
    }
    return{ownerKey:body.expectedOwnerKey,signedIn:true,records:[],incremental:body.since!==undefined,checkedAt:'2026-09-20T00:01:00.000Z'};
   }};
  });
  await assert.rejects(fx.client.read(),error=>error.status===401);
  const loaded=await fx.client.read();
  assert.equal(loaded.ownerKey,returnToSameOwner?owner.uid:another.uid);
  assert.equal(bodies[1].since,undefined,'a rejected response must not restore its previous owner read cursor');
  assert.deepEqual(loaded.records,[]);
 }
});

test('save rejects account changes in the call-to-cache microtask gap, including the same user returning',async()=>{
 for(const returnToSameOwner of [false,true]){
  const bodies=[];
  const fx=clientFixture(async(url,opt)=>{
   const body=JSON.parse(opt.body);bodies.push(body);
   return{ok:true,json(){
    if(body.action==='save'){
     queueMicrotask(()=>queueMicrotask(()=>{fx.change(null);fx.change(returnToSameOwner?owner:another);}));
     return{ownerKey:owner.uid,record:{asset_id:'005930',revision:1,note:'private owner A'}};
    }
    return{ownerKey:body.expectedOwnerKey,signedIn:true,records:[],incremental:false,checkedAt:'2026-09-20T00:01:00.000Z'};
   }};
  });
  await assert.rejects(fx.client.save(save()),error=>error.status===401);
  const loaded=await fx.client.read();
  assert.equal(bodies[1].expectedOwnerKey,returnToSameOwner?owner.uid:another.uid);
  assert.deepEqual(loaded.records,[]);
 }
});

test('a late successful save response cannot replace a newer cached revision',async()=>{
 const waiting=[];
 const fx=clientFixture((url,opt)=>new Promise(resolve=>waiting.push({body:JSON.parse(opt.body),resolve})));
 const tick=()=>new Promise(resolve=>setImmediate(resolve));
 const answer=(index,value)=>waiting[index].resolve({ok:true,json:async()=>({ownerKey:owner.uid,...value})});
 const first=fx.client.save(save());await tick();
 // Another read can observe the committed first edit while its HTTP response
 // remains in flight, so a subsequent edit can carry the next valid revision.
 const observed=fx.client.read();await tick();
 answer(1,{records:[{asset_id:'005930',revision:1,note:'first'}],incremental:false,checkedAt:'2026-09-20T00:00:00.000Z'});await observed;
 const second=fx.client.save(save({expectedRevision:1,note:'second'}));await tick();
 answer(2,{record:{asset_id:'005930',revision:2,note:'second'}});await second;
 answer(0,{record:{asset_id:'005930',revision:1,note:'first'}});await first;
 const refreshed=fx.client.read();await tick();
 answer(3,{records:[],incremental:true,checkedAt:'2026-09-20T00:01:00.000Z'});
 const result=await refreshed;
 assert.equal(result.records[0].revision,2);assert.equal(result.records[0].note,'second');
});
