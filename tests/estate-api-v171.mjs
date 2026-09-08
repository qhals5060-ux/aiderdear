import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {registerHooks} from 'node:module';
import {entity} from '../server/estate-model.mjs';
import {CHUNK_BYTES} from '../server/estate-media.mjs';
import {MemoryFirestore} from './estate-api-store-v171.mjs';

// No SDK installation, credentials, network or production Firestore is used by this harness.
const forbidden='()=>{throw new Error("Live Firebase is forbidden in isolated ESTATE tests")}',stubs={
 'firebase-admin/firestore':`export const FieldPath={documentId:()=> '__name__'};export const getFirestore=${forbidden};`,
 'firebase-admin/auth':`export const getAuth=${forbidden};`,
 'firebase-admin/app':`export const applicationDefault=${forbidden},cert=${forbidden},getApps=${forbidden},initializeApp=${forbidden};`
};
const hook=registerHooks({resolve(specifier,context,next){return stubs[specifier]?{url:'data:text/javascript,'+encodeURIComponent(stubs[specifier]),shortCircuit:true}:next(specifier,context);}});
const {dispatch,makeHandler,assertSameOrigin}=await import('../api/estate.mjs');hook.deregister();

const user={uid:'owner-a',email:'ordinary@example.com'},other={uid:'owner-b',email:'another@example.com'};
const call=(db,action,payload={},who=user)=>dispatch(db,who,{action,...payload,requestId:payload.requestId||crypto.randomUUID()},{ip:'test-address'});
const save=(db,collection,id,row={},expectedRevision=0)=>call(db,'save',{collection,id,row,expectedRevision});
const makeProperty=(db,id='p1',extra={})=>save(db,'properties',id,{title:'햇빛 매물',address:'서울 중구 1',region:'서울',propertyType:'apartment',dealType:'sale',price:500000000,area:60,...extra});
const makeCustomer=(db,id='c1',extra={})=>save(db,'customers',id,{name:'고객',phone:'010-1234-5678',roles:['buyer'],...extra});
async function media(db,id='photo1',entityId='p1'){
 const data=Buffer.from('89504e470d0a1a0a0000000049454e44ae426082','hex');
 await call(db,'mediaBegin',{id,entityCollection:'properties',entityId,name:'선택사진.png',type:'image/png',size:data.length});await call(db,'mediaChunk',{id,index:0,data:data.toString('base64')});await call(db,'mediaFinish',{id});return id;
}
function response(){return {headers:{},setHeader(k,v){this.headers[k]=v;},end(value){this.body=JSON.parse(value);}};}

test('owner isolation, verified ordinary account access, Work employee rejection and traversal',async()=>{
 const db=new MemoryFirestore();await makeProperty(db);assert.equal((await call(db,'context')).uid,user.uid);
 assert.equal((await call(db,'list',{collection:'properties'},other)).rows.length,0);
 await assert.rejects(call(db,'get',{collection:'properties',id:'p1',ownerUid:user.uid},other),{status:404});
 await assert.rejects(call(db,'get',{collection:'properties',id:'../../owner-a'}),{status:400});
 db.rows.set('workIdentities/employee-1',{kind:'employee'});await assert.rejects(call(db,'context',{}, {uid:'employee-1'}),{status:403});
 await assert.rejects(call(db,'context',{},null),{status:401});
});
test('CRUD persists, immutable generated number, exact request retry, stale revisions and distinct customer namespace',async()=>{
 const db=new MemoryFirestore(),payload={collection:'properties',id:'p1',row:{title:'원본',number:'INJECTED',ownerUid:'owner-b'},expectedRevision:0,requestId:'request-1'};
 const first=await call(db,'save',payload);assert.notEqual(first.row.number,'INJECTED');assert.equal(first.row.ownerUid,user.uid);
 assert.deepEqual(await call(db,'save',payload),first);await assert.rejects(call(db,'save',{...payload,row:{title:'다른 내용'}}),{status:409});
 await assert.rejects(save(db,'properties','p1',{title:'잘못 덮어쓰기'},0),{status:409});
 const updated=await save(db,'properties','p1',{title:'새 이름',price:300,status:'negotiating',number:'BAD'},1);assert.equal(updated.row.number,first.row.number);assert.equal(updated.row.revision,2);assert.equal(updated.row.history.length,1);
 assert.equal((await call(db,'get',{collection:'properties',id:'p1'})).row.title,'새 이름');
 await makeCustomer(db);assert.ok([...db.rows.keys()].every(path=>!path.startsWith('users/')&&!path.startsWith('workspaces/')&&!path.startsWith('sharedWorkspaces/')));
});
test('validation leaves unknowns unknown, dates/enums/amounts validated and cross-owner references denied atomically',async()=>{
 const db=new MemoryFirestore();await makeCustomer(db);
 assert.equal(entity('properties',{title:'빈 값',price:null}).price,null);
 assert.throws(()=>entity('properties',{title:'잘못된 날짜',approvalDate:'2026-02-31'}),{status:400});
 assert.throws(()=>entity('deals',{title:'중단',propertyId:'p1',stage:'stopped'}),{status:400});
 assert.throws(()=>entity('receipts',{dealId:'d1',date:'2026-01-01',amount:0}),{status:400});
 await assert.rejects(makeProperty(db,'bad',{ownerCustomerId:'other-customer'}),{status:404});assert.ok(!db.rows.has('estateWorkspaces/owner-a/properties/bad'));
});
test('same-address warning does not merge distinct units or records',async()=>{
 const db=new MemoryFirestore();await makeProperty(db,'p1',{unit:'101'});const second=await makeProperty(db,'p2',{unit:'102'});assert.equal(second.warnings.length,1);assert.equal((await call(db,'list',{collection:'properties'})).rows.length,2);
});
test('consultation creates, reschedules and cancels one atomic follow-up task without personal sharing',async()=>{
 const db=new MemoryFirestore();await makeCustomer(db);const row={customerId:'c1',date:'2026-09-08',content:'상담',nextAction:'내일 연락',dueDate:'2026-09-09'};
 await save(db,'consultations','note1',row);assert.equal(db.rows.get('estateWorkspaces/owner-a/tasks/consultation-note1').date,'2026-09-09');
 await save(db,'consultations','note1',{dueDate:'2026-09-10'},1);assert.equal(db.rows.get('estateWorkspaces/owner-a/tasks/consultation-note1').date,'2026-09-10');
 await save(db,'consultations','note1',{nextAction:'',dueDate:''},2);assert.equal(db.rows.get('estateWorkspaces/owner-a/tasks/consultation-note1').status,'cancelled');
 assert.equal((await call(db,'list',{collection:'tasks'})).rows.length,1);
});
test('visits project stable calendar IDs after date changes; historical records are retained',async()=>{
 const db=new MemoryFirestore();await makeProperty(db);await makeCustomer(db);
 await save(db,'visits','v1',{propertyId:'p1',customerIds:['c1'],date:'2026-09-08',time:'14:00',followUpDate:'2026-09-09'});
 const first=await call(db,'calendar',{cursor:'visits:'});assert.equal(first.rows.length,1);const id=first.rows[0].id;
 await save(db,'visits','v1',{date:'2026-09-12'},1);const changed=await call(db,'calendar',{cursor:'visits:'});assert.equal(changed.rows[0].id,id);assert.equal(changed.rows[0].date,'2026-09-12');assert.equal(changed.rows[0].category,'estate');
 await save(db,'tasks','historic',{title:'과거 업무 보존',date:'2020-01-01'});await call(db,'cleanup');assert.equal((await call(db,'get',{collection:'tasks',id:'historic'})).row.date,'2020-01-01');
});
test('deal stages and split receipts persist independently, no deletion of competing customer/deal data',async()=>{
 const db=new MemoryFirestore();await makeProperty(db);await makeCustomer(db);await save(db,'deals','d1',{title:'첫 거래',propertyId:'p1',buyerIds:['c1'],stage:'preparation',expectedFee:3000000});
 await save(db,'deals','d2',{title:'다른 상담',propertyId:'p1',buyerIds:['c1']});
 await save(db,'deals','d1',{stage:'contract',contractDate:'2026-09-09',confirmedFee:2500000},1);
 await save(db,'receipts','r1',{dealId:'d1',amount:1000000,date:'2026-09-09'});await save(db,'receipts','r2',{dealId:'d1',amount:1500000,date:'2026-09-10'});
 assert.equal((await call(db,'list',{collection:'receipts'})).rows.reduce((s,r)=>s+r.amount,0),2500000);assert.equal((await call(db,'get',{collection:'deals',id:'d2'})).row.stage,'inquiry');
 const archived=await call(db,'archive',{collection:'properties',id:'p1',expectedRevision:1});assert.equal(archived.row.status,'ended');assert.ok(db.rows.has('estateWorkspaces/owner-a/deals/d1'));
});
test('pagination and search expose bounded continuation rather than claiming partial scan complete',async()=>{
 const db=new MemoryFirestore();for(let i=0;i<53;i++)db.rows.set(`estateWorkspaces/owner-a/properties/p${String(i).padStart(2,'0')}`,{id:`p${i}`,ownerUid:user.uid,title:'검색 대상',number:`E${i}`,revision:1});
 let page=await call(db,'list',{collection:'properties',limit:999});assert.equal(page.rows.length,50);assert.ok(page.cursor);assert.equal((await call(db,'list',{collection:'properties',cursor:page.cursor})).rows.length,3);
 const search=await call(db,'search',{q:'검색'});assert.equal(search.results.length,50);assert.equal(search.partial,true);assert.equal(search.scanned,50);
 const next=await call(db,'search',{q:'검색',cursor:search.cursor});assert.equal(next.results.length,3);assert.equal(next.cursor,'customers:');
});
test('media upload hashes and validates bytes; cross-owner, wrong entity, missing chunks, unsupported content rejected',async()=>{
 const db=new MemoryFirestore();await media(db);const info=await call(db,'mediaInfo',{id:'photo1'});assert.equal(info.chunkBytes,CHUNK_BYTES);assert.match(info.sha256,/^[a-f0-9]{64}$/);
 await assert.rejects(call(db,'mediaInfo',{id:'photo1'},other),{status:404});
 await assert.rejects(makeProperty(db,'p2',{photos:[{mediaId:'photo1'}]}),{status:400});
 await call(db,'mediaBegin',{id:'incomplete',entityCollection:'properties',entityId:'p1',name:'x.pdf',type:'application/pdf',size:5});await assert.rejects(call(db,'mediaFinish',{id:'incomplete'}),{status:409});
 await call(db,'mediaChunk',{id:'incomplete',index:0,data:Buffer.from('wrong').toString('base64')});await assert.rejects(call(db,'mediaFinish',{id:'incomplete'}),{status:400});
 await assert.rejects(call(db,'mediaBegin',{entityCollection:'properties',entityId:'p1',name:'x.svg',type:'image/svg+xml',size:10}),{status:400});
});
test('referenced files cannot be deleted; detaching/replacing deletes all chunks and stale pending cleanup preserves valid records',async()=>{
 const db=new MemoryFirestore();await media(db);await makeProperty(db,'p1',{photos:[{mediaId:'photo1'}]});await assert.rejects(call(db,'mediaDelete',{id:'photo1'}),{status:409});
 await save(db,'properties','p1',{photos:[]},1);await call(db,'mediaDelete',{id:'photo1'});assert.ok(![...db.rows.keys()].some(p=>p.includes('/media/photo1')));
 await call(db,'mediaBegin',{id:'stale',entityCollection:'properties',entityId:'p1',name:'stale.pdf',type:'application/pdf',size:5});db.rows.get('estateWorkspaces/owner-a/media/stale').updatedAt=Date.now()-2*86400000;
 assert.equal((await call(db,'cleanup')).removed,1);assert.ok(db.rows.has('estateWorkspaces/owner-a/properties/p1'));
});
test('share snapshots exclude internal/contact/unit details, selected photos only, expiry/revocation protected',async()=>{
 const db=new MemoryFirestore();await media(db);db.rows.get('estateWorkspaces/owner-a/media/photo1').name='SECRET-CUSTOMER-01012345678.png';await makeProperty(db,'p1',{photos:[{mediaId:'photo1',name:'SECRET-CUSTOMER-01012345678.png'}],unit:'SECRET-UNIT',detailAddress:'SECRET-DETAIL',internalMemo:'PRIVATE-MEMO',keyMemo:'PRIVATE-KEY',coBrokerInfo:'PRIVATE-PHONE',approvalDate:'2020-01-01',conditions:'공개 전 확인한 입주 조건',premium:0});await makeProperty(db,'p2');
 const payload={propertyIds:['p1','p2'],publicOptions:{photos:{p1:['photo1']}},expiresAt:Date.now()+86400000};const share=await call(db,'shareCreate',payload),pub=await call(db,'publicGet',{token:share.token},null),raw=JSON.stringify(pub);
 for(const secret of ['PRIVATE-MEMO','PRIVATE-KEY','PRIVATE-PHONE','SECRET-DETAIL','SECRET-UNIT','SECRET-CUSTOMER','ownerUid','tokenHash'])assert.ok(!raw.includes(secret));assert.deepEqual(pub.properties[0].photos,[{mediaId:'photo1'}]);assert.equal(pub.properties[0].approvalDate,'2020-01-01');assert.equal(pub.properties[0].premium,0);
 const publicInfo=await call(db,'publicMediaInfo',{token:share.token,id:'photo1'},null);assert.ok(publicInfo.ready);assert.equal(publicInfo.name,'매물사진.png');assert.ok(!JSON.stringify(publicInfo).includes('SECRET-CUSTOMER'));await assert.rejects(call(db,'publicMediaInfo',{token:share.token,id:'missing'},null),{status:404});
 await save(db,'properties','p1',{photos:[]},1);await assert.rejects(call(db,'mediaDelete',{id:'photo1'}),{status:409});
 await call(db,'shareRevoke',{id:share.row.id});await assert.rejects(call(db,'publicGet',{token:share.token},null),{status:404});await call(db,'mediaDelete',{id:'photo1'});
 await assert.rejects(call(db,'shareCreate',{...payload,publicOptions:{},expiresAt:Date.now()+31*86400000}),{status:400});
 const expiring=await call(db,'shareCreate',{...payload,publicOptions:{}});db.rows.get('estateShares/'+crypto.createHash('sha256').update(expiring.token).digest('hex')).expiresAt=Date.now()-1;
 for(const action of ['publicGet','publicMediaInfo','publicMediaReadChunk','publicRequest'])await assert.rejects(call(db,action,{token:expiring.token,id:'photo1',index:0},null),{status:404});
});
test('12 MiB file finalization writes only metadata; deletion resumes after interruption in <=8-chunk transactions',async()=>{
 const db=new MemoryFirestore(),id='max-file',size=12*1024*1024,bytes=Buffer.alloc(size,32);bytes.write('%PDF-1.7');
 await call(db,'mediaBegin',{id,entityCollection:'properties',entityId:'pending-property',name:'max.pdf',type:'application/pdf',size});
 for(let index=0;index<32;index++)db.rows.set(`estateWorkspaces/owner-a/media/${id}/chunks/${String(index).padStart(4,'0')}`,{data:bytes.subarray(index*CHUNK_BYTES,(index+1)*CHUNK_BYTES).toString('base64')});
 const finish=await call(db,'mediaFinish',{id,requestId:'finish-max'});assert.equal(finish.sha256,crypto.createHash('sha256').update(bytes).digest('hex'));assert.ok(db.transactionMetrics.at(-1).bytes<10000);assert.deepEqual(await call(db,'mediaFinish',{id,requestId:'finish-max'}),finish);
 let batches=0;db.beforeCommit=metric=>{if(metric.operations.some(op=>op.type==='delete')&&++batches===2)throw Error('isolated process interruption');};
 await assert.rejects(call(db,'mediaDelete',{id,requestId:'delete-max'}),/isolated process/);assert.equal(db.rows.get(`estateWorkspaces/owner-a/media/${id}`).deleting,true);assert.equal([...db.rows.keys()].filter(path=>path.includes('/max-file/chunks/')).length,24);
 await assert.rejects(call(db,'mediaChunk',{id,index:0,data:bytes.subarray(0,CHUNK_BYTES).toString('base64')}),{status:409});
 db.beforeCommit=null;assert.deepEqual(await call(db,'mediaDelete',{id,requestId:'delete-max'}),{ok:true});assert.ok(![...db.rows.keys()].some(path=>path.includes('/media/max-file')));
 const deletionBatches=db.transactionMetrics.filter(m=>m.operations.some(op=>op.type==='delete'));assert.ok(deletionBatches.length>=5);assert.ok(deletionBatches.every(m=>m.operations.filter(op=>op.path.includes('/chunks/')).length<=8));assert.ok(deletionBatches.every(m=>m.bytes<4.1*1024*1024&&m.writes<=9));
});
test('upload nonce prevents finalizing stale bytes after deletion/recreation; pending requests may be rejected only by owner',async()=>{
 const db=new MemoryFirestore(),id='nonce-file',bytes=Buffer.from('%PDF-1.7');await call(db,'mediaBegin',{id,entityCollection:'properties',entityId:'p1',name:'x.pdf',type:'application/pdf',size:bytes.length});await call(db,'mediaChunk',{id,index:0,data:bytes.toString('base64')});
 const original=db.runTransaction.bind(db);db.runTransaction=async fn=>{db.rows.get('estateWorkspaces/owner-a/media/nonce-file').uploadNonce='recreated-upload';db.runTransaction=original;return original(fn);};await assert.rejects(call(db,'mediaFinish',{id}),{status:409});
 db.rows.set('estateWorkspaces/owner-a/requests/request1',{id:'request1',ownerUid:user.uid,status:'pending',revision:1});await assert.rejects(call(db,'requestReject',{id:'request1'},other),{status:404});assert.equal((await call(db,'requestReject',{id:'request1'})).row.status,'rejected');
});
test('public requests stay pending until broker confirms an existing customer/property, retries make exactly one visit',async()=>{
 const db=new MemoryFirestore();await makeProperty(db);await makeProperty(db,'p2');await makeCustomer(db);const share=await call(db,'shareCreate',{propertyIds:['p1','p2'],publicOptions:{},expiresAt:Date.now()+86400000});
 const request={token:share.token,propertyIds:['p1'],name:'방문 고객',phone:'010-1111-2222',preferredDate:'2026-09-09',consent:true,requestId:'public-one'};
 await call(db,'publicRequest',request,null);await call(db,'publicRequest',request,null);assert.equal((await call(db,'list',{collection:'visits'})).rows.length,0);
 const req=(await call(db,'list',{collection:'requests'})).rows[0];assert.equal(req.status,'pending');
 await assert.rejects(call(db,'requestConfirm',{id:req.id,customerId:'c1',propertyId:'p2',date:'2026-09-09'}),{status:400});
 const visit=await call(db,'requestConfirm',{id:req.id,customerId:'c1',propertyId:'p1',date:'2026-09-09',time:'14:00'});const repeat=await call(db,'requestConfirm',{id:req.id,customerId:'c1',propertyId:'p1',date:'2026-09-09',time:'14:00'});
 assert.equal(repeat.visit.id,visit.visit.id);assert.equal((await call(db,'list',{collection:'visits'})).rows.length,1);
});
test('public request size/consent/rate limits and invalid token failures do not expose owner metadata',async()=>{
 const db=new MemoryFirestore();await makeProperty(db);await makeProperty(db,'p2');const share=await call(db,'shareCreate',{propertyIds:['p1','p2'],publicOptions:{},expiresAt:Date.now()+86400000});const request={token:share.token,propertyIds:['p1'],name:'고객',phone:'010-1111-2222',consent:true};
 await assert.rejects(call(db,'publicRequest',{...request,consent:false},null),{status:400});
 for(let i=0;i<5;i++)await call(db,'publicRequest',{...request,requestId:'try-'+i},null);
 await assert.rejects(call(db,'publicRequest',request,null),{status:429});await assert.rejects(call(db,'publicGet',{token:'BAD'},null),{status:404});
});
test('HTTP uses revoked-token checking, same-origin, no-store, strict body size, safe configuration errors',async()=>{
 const db=new MemoryFirestore();let verified=0;const handler=makeHandler(()=>({db,auth:{verifyIdToken:async(token,revoked)=>{assert.equal(token,'verified-token');assert.equal(revoked,true);verified++;return user;}}}));
 const req={method:'POST',headers:{host:'example.test',origin:'https://example.test',authorization:'Bearer verified-token'},body:{action:'context'}};
 let res=response();await handler(req,res);assert.equal(res.statusCode,200);assert.equal(verified,1);assert.match(res.headers['Cache-Control'],/no-store/);
 res=response();await handler({...req,headers:{...req.headers,authorization:''}},res);assert.equal(res.statusCode,401);
 res=response();await handler({...req,headers:{...req.headers,origin:'https://attacker.test'}},res);assert.equal(res.statusCode,403);
 res=response();await handler({...req,body:{action:'context',huge:'x'.repeat(900001)}},res);assert.equal(res.statusCode,413);
 res=response();await makeHandler(()=>{throw new Error('PRIVATE KEY SHOULD NEVER LEAK');})(req,res);assert.equal(res.statusCode,503);assert.ok(!JSON.stringify(res.body).includes('PRIVATE KEY'));
 res=response();await makeHandler(()=>({db,auth:{verifyIdToken:async()=>{throw Object.assign(Error('sensitive token diagnostics'),{code:'auth/id-token-revoked'});}}}))(req,res);assert.equal(res.statusCode,401);assert.ok(!JSON.stringify(res.body).includes('sensitive token'));
 assert.throws(()=>assertSameOrigin({headers:{host:'example.test',origin:'null'}}),{status:403});
});
