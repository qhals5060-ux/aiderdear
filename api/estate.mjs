import crypto from 'node:crypto';
import {FieldPath} from 'firebase-admin/firestore';
import {services} from '../server/firebase-admin.mjs';
import {COLLECTIONS,EDITABLE,fail,safeId,text,date,time,entity,mediaIds,references,checkRevision,normalizedAddress} from '../server/estate-model.mjs';
import {CHUNK_BYTES,hash,beginMedia,chunkData,finishMedia,mediaInfo} from '../server/estate-media.mjs';
import {calendarRows,publicProperty,canUseEstateAccount} from '../estate-domain-v171.js';

const get=async(reader,ref)=>{const snap=await(typeof reader.get==='function'?reader.get(ref):ref.get());return snap.exists?{...snap.data(),id:snap.id}:null;};
const docs=snap=>snap.docs.map(d=>({...d.data(),id:d.id}));
const PRIVATE_READ=new Set(['context','list','get','history','search','calendar','mediaInfo','mediaReadChunk','sharePreview']);
const PUBLIC_READ=new Set(['publicGet','publicMediaInfo','publicMediaReadChunk']);
const PUBLIC_ACTIONS=new Set([...PUBLIC_READ,'publicRequest']);
const ACTIVE_SHARE=s=>s&&!s.revoked&&Number(s.expiresAt)>Date.now();
const recordId=()=>crypto.randomUUID();
const PUBLIC_PROPERTY_KEYS=['id','number','title','region','address','detailAddress','buildingUnit','unit','propertyType','dealType','price','deposit','rent','managementFee','managementIncludes','area','supplyArea','floor','totalFloors','rooms','bathrooms','direction','parking','elevator','approvalDate','negotiable','availableDate','availableNegotiable','occupancy','pets','conditions','publicDescription','advantages','disadvantages','premium','recommendedBusiness','facilities','landCategory','zoning','road'];
function publicSnapshot(row){return {...Object.fromEntries(PUBLIC_PROPERTY_KEYS.filter(k=>row[k]!==undefined).map(k=>[k,row[k]])),photos:(row.photos||[]).map(p=>({mediaId:safeId(p.mediaId)}))};}

function pageQuery(db,path,cursor,limit=50){let q=db.collection(path).orderBy(FieldPath.documentId()).limit(limit);if(cursor)q=q.startAfter(safeId(cursor));return q;}
// Firestore title ASC uses its existing single-field index (with the default
// document-ID suffix). Keep this DB order across pages, never sort each page
// with a different browser locale. Ordinary Hangul follows 가나다 order;
// mixed numbers/Latin/punctuation follow Firestore UTF-8 string order.
function propertyNameQuery(db,path,cursor,limit,scope){
 let q=db.collection(path).orderBy('title').orderBy(FieldPath.documentId()).limit(limit);
 if(cursor){
  if(typeof cursor!=='string'||cursor.length>12000||!/^title-v172:[A-Za-z0-9_-]+$/.test(cursor))fail(400,'매물명 정렬 위치를 확인해주세요.');
  let decoded;try{decoded=JSON.parse(Buffer.from(cursor.slice(11),'base64url').toString('utf8'));}catch{fail(400,'매물명 정렬 위치를 확인해주세요.');}
  if(!decoded||decoded.scope!==scope||typeof decoded.title!=='string'||decoded.title.length>2000)fail(400,'정렬 또는 검색 조건이 바뀌었습니다. 처음부터 조회해주세요.');
  q=q.startAfter(decoded.title,safeId(decoded.id));
 }
 return q;
}
function propertyNameCursor(row,scope){return row?'title-v172:'+Buffer.from(JSON.stringify({scope,title:row.title,id:row.id})).toString('base64url'):null;}
function stageCursor(value,kinds){const raw=value==null?kinds[0]+':':String(value),i=raw.indexOf(':'),kind=raw.slice(0,i),after=raw.slice(i+1);if(i<0||!kinds.includes(kind))fail(400,'목록 조회 위치를 확인해주세요.');if(after)safeId(after);return {kind,after};}
function nextCursor(kind,snapshot,kinds,limit){return snapshot.docs.length===limit?kind+':'+snapshot.docs.at(-1).id:kinds.indexOf(kind)<kinds.length-1?kinds[kinds.indexOf(kind)+1]+':':null;}
function stamp(row,uid,now,old){return {...row,ownerUid:uid,createdAt:old?.createdAt||now,updatedAt:now,revision:(old?.revision||0)+1};}
function publicToken(value){const token=String(value||'');if(!/^[a-f0-9]{64}$/.test(token))fail(404,'공유 링크를 확인해주세요.');return token;}
function shareOptions(input,ids){
 const opts=input&&typeof input==='object'&&!Array.isArray(input)?input:{},photos={};
 for(const id of ids){const selected=opts.photos?.[id]||[];if(!Array.isArray(selected)||selected.length>10)fail(400,'공개 사진은 매물별 10장까지 선택해주세요.');photos[id]=[...new Set(selected.map(safeId))];}
 return {showAddress:opts.showAddress===true,showUnit:opts.showUnit===true,photos};
}
function cleanPublicProperty(row,options){
 // The domain function itself is allowlisted. Defensively re-allowlist here at the trust boundary.
 const out=publicSnapshot(publicProperty(row,options));
 if(!options.showAddress)delete out.address;if(!options.showUnit){delete out.unit;delete out.buildingUnit;delete out.detailAddress;}
 out.photos=(row.photos||[]).filter(p=>(options.photos?.[row.id]||[]).includes(p.mediaId)).map(p=>({mediaId:p.mediaId}));
 return out;
}

/** Pure dispatcher: tests inject an isolated Firestore-compatible store; only handler verifies tokens. */
export async function dispatch(db,rawUser,input,requestMeta={}){
 if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'요청 내용을 확인해주세요.');
 const action=String(input.action||''),now=Date.now();
 if(PUBLIC_ACTIONS.has(action))return dispatchPublic(db,input,requestMeta,now);
 if(!rawUser?.uid)fail(401,'로그인이 필요합니다.');
 if(!canUseEstateAccount(rawUser,{verified:true}))fail(403,'ESTATE는 이메일 인증이 완료된 지정 계정에서만 사용할 수 있습니다.');
 const uid=safeId(rawUser.uid),w=`estateWorkspaces/${uid}`;
 // Employees may only use explicitly granted Work data, never create/access this private workspace.
 if((await get(db,db.doc(`workIdentities/${uid}`)))?.kind==='employee')fail(403,'직원 전용 계정에서는 ESTATE를 사용할 수 없습니다.');
 const col=k=>{if(!COLLECTIONS.includes(k))fail(400,'자료 유형을 확인해주세요.');return `${w}/${k}`;};
 const ref=(k,id)=>db.doc(`${col(k)}/${safeId(id)}`);
 const owned=async(reader,k,id)=>{const row=await get(reader,ref(k,id));if(!row||row.ownerUid!==uid)fail(404,'기록을 찾을 수 없습니다.');return row;};
 if(action==='context')return {uid};
 if(action==='list'){
  if(input.limit!=null&&(!Number.isInteger(Number(input.limit))||Number(input.limit)<1))fail(400,'조회 개수를 확인해주세요.');
  const byName=input.sort==='name';if(input.sort!=null&&!byName||byName&&input.collection!=='properties')fail(400,'지원하지 않는 정렬입니다.');
  const limit=Math.min(50,Number(input.limit)||50),scope=uid+':list',snapshot=await (byName?propertyNameQuery(db,col(input.collection),input.cursor,limit,scope):pageQuery(db,col(input.collection),input.cursor,limit)).get(),all=docs(snapshot).filter(r=>r.ownerUid===uid),rows=[];let bytes=0;
  for(const row of all){const size=Buffer.byteLength(JSON.stringify(row));if(rows.length&&bytes+size>1500000)break;rows.push(row);bytes+=size;}
  const last=rows.length<all.length?rows.at(-1):snapshot.docs.length===limit?{...snapshot.docs.at(-1).data(),id:snapshot.docs.at(-1).id}:null;
  return {rows,cursor:byName?propertyNameCursor(last,scope):last?.id||null,...(byName?{sort:'name',sortBasis:'title-utf8'}:{})};
 }
 if(action==='get')return {row:await owned(db,input.collection,input.id)};
 if(action==='history'){if(input.collection!=='properties')fail(400,'매물 가격과 상태 이력만 조회할 수 있습니다.');await owned(db,'properties',input.id);const snapshot=await pageQuery(db,`${col('properties')}/${safeId(input.id)}/history`,input.cursor,50).get();return {rows:docs(snapshot),cursor:snapshot.docs.length===50?snapshot.docs.at(-1).id:null};}
 if(action==='search'){
  const q=text(input.q,150).normalize('NFKC').toLowerCase().replace(/[\s-]/g,''),kinds=['properties','customers'];if(!q)return {results:[],cursor:null,scanned:0,partial:false};
  if(input.sort!=null){
   if(input.sort!=='name'||input.collection!=='properties')fail(400,'지원하지 않는 검색 정렬입니다.');
   const scope=uid+':search:'+hash(q),snapshot=await propertyNameQuery(db,col('properties'),input.cursor,50,scope).get();
   const results=docs(snapshot).filter(r=>r.ownerUid===uid&&[r.title,r.address,r.detailAddress,r.number].some(v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s-]/g,'').includes(q))).map(r=>({collection:'properties',id:r.id,label:r.title,subtitle:[r.number,r.address].filter(Boolean).join(' · ')}));
   const last=snapshot.docs.length===50?snapshot.docs.at(-1):null,cursor=last?propertyNameCursor({...last.data(),id:last.id},scope):null;
   return {results,cursor,scanned:snapshot.docs.length,partial:cursor!==null,searchMode:'owner-bounded-continuation',sort:'name',sortBasis:'title-utf8'};
  }
  const {kind,after}=stageCursor(input.cursor,kinds),snapshot=await pageQuery(db,col(kind),after,50).get(),cursor=nextCursor(kind,snapshot,kinds,50);
  const results=docs(snapshot).filter(r=>r.ownerUid===uid&&[r.title,r.address,r.detailAddress,r.number,r.name,r.phone].some(v=>String(v||'').normalize('NFKC').toLowerCase().replace(/[\s-]/g,'').includes(q))).map(r=>({collection:kind,id:r.id,label:r.title||r.name,subtitle:kind==='properties'?[r.number,r.address].filter(Boolean).join(' · '):r.phone}));
  return {results,cursor,scanned:snapshot.docs.length,partial:cursor!==null,searchMode:'owner-bounded-continuation'};
 }
 if(action==='calendar'){
  const kinds=['tasks','visits','deals','customers','properties'],{kind,after}=stageCursor(input.cursor,kinds),snapshot=await pageQuery(db,col(kind),after,50).get();
  const data=Object.fromEntries(kinds.map(k=>[k,k===kind?docs(snapshot).filter(r=>r.ownerUid===uid&&!r.archived):[]]));
  return {rows:calendarRows(data),cursor:nextCursor(kind,snapshot,kinds,50)};
 }
 if(action==='mediaInfo'||action==='mediaReadChunk'){
  const m=await get(db,db.doc(`${w}/media/${safeId(input.id)}`));if(!m?.ready||m.ownerUid!==uid)fail(404,'완료된 첨부 파일을 찾을 수 없습니다.');
  if(action==='mediaInfo')return mediaInfo(m);return readMediaChunk(db,w,m,input.index);
 }
 async function snapshotProperties(reader,ids,options){
  if(!Array.isArray(ids)||ids.length<2||ids.length>5||new Set(ids).size!==ids.length)fail(400,'비교할 매물 2~5개를 선택해주세요.');
  const rows=[];for(const id of ids){const row=await owned(reader,'properties',id);for(const mid of options.photos[row.id]||[]){if(!(row.photos||[]).some(p=>p.mediaId===mid))fail(400,'해당 매물의 사진만 공개할 수 있습니다.');const m=await get(reader,db.doc(`${w}/media/${mid}`));if(!m?.ready||m.ownerUid!==uid||!m.type.startsWith('image/'))fail(400,'공개할 사진 전송 상태를 확인해주세요.');}rows.push(cleanPublicProperty(row,options));}return rows;
 }
 if(action==='sharePreview'){const ids=input.propertyIds,options=shareOptions(input.publicOptions,Array.isArray(ids)?ids:[]);return {properties:await snapshotProperties(db,ids,options)};}
 if(PRIVATE_READ.has(action))fail(400,'요청을 확인해주세요.');
 const requestId=safeId(input.requestId),fingerprint=hash(JSON.stringify(input)),receiptRef=db.doc(`${w}/operations/${hash(requestId)}`);
 let preparedMedia=null;
 if(action==='mediaFinish'){
  const replay=await get(db,receiptRef);if(replay){if(replay.fingerprint!==fingerprint)fail(409,'이미 다른 작업에 사용된 요청 ID입니다.');return replay.result;}
  const mr=db.doc(`${w}/media/${safeId(input.id)}`),m=await get(db,mr);if(!m||m.ownerUid!==uid||m.ready||m.deleting)fail(409,'변경할 수 없는 첨부 파일입니다.');
  // Existing chunks are immutable. Read/hash outside the write transaction, then verify
  // the upload nonce inside it so deletion/recreation cannot attach a stale hash.
  preparedMedia={nonce:m.uploadNonce,createdAt:m.createdAt,size:m.size,type:m.type,...finishMedia(m,docs(await mr.collection('chunks').orderBy(FieldPath.documentId()).get()))};
 }
 const mutationResult=await db.runTransaction(async tx=>{
  if((await get(tx,db.doc(`workIdentities/${uid}`)))?.kind==='employee')fail(403,'직원 전용 계정에서는 ESTATE를 사용할 수 없습니다.');
  const replay=await get(tx,receiptRef);if(replay){if(replay.fingerprint!==fingerprint)fail(409,'이미 다른 작업에 사용된 요청 ID입니다.');return replay.result;}
  const writes=[],set=(ref,row)=>writes.push(()=>tx.set(ref,row));let result;
  const writeRow=(kind,row,old)=>{const saved=stamp(row,uid,now,old);set(ref(kind,row.id),saved);return saved;};
  async function validateReferences(row){for(const [kind,id]of references(row)){const related=await owned(tx,kind,id);if(kind==='deals'&&row.propertyId&&related.propertyId!==row.propertyId)fail(400,'선택한 거래와 매물이 서로 다릅니다. 연결 관계를 확인해주세요.');}}
  async function reconcileMedia(kind,row,old){
   const previous=mediaIds(old),next=mediaIds(row),key=kind+':'+row.id;
   for(const id of [...new Set([...previous,...next])]){const mr=db.doc(`${w}/media/${id}`),m=await get(tx,mr);if(!m||m.ownerUid!==uid)fail(400,'본인의 첨부 파일만 연결할 수 있습니다.');
    if(next.includes(id)&&(!m.ready||m.entityCollection!==kind||m.entityId!==row.id))fail(400,'이 기록에 올린 완료된 첨부만 연결할 수 있습니다.');
    set(mr,{...m,refs:next.includes(id)?[...new Set([...(m.refs||[]),key])]:(m.refs||[]).filter(x=>x!==key),updatedAt:now});
   }
  }
  async function generatedTask(kind,row,old){
   let title,day,clock,taskKind;
   if(kind==='consultations'){title=row.nextAction;day=row.dueDate;clock=row.dueTime;taskKind='contact';}
   if(kind==='visits'){title=row.followUpAction||'방문 후 후속 연락';day=row.followUpDate;taskKind='followup';}
   if(kind==='deals'){title=row.nextAction;day=row.dueDate;taskKind='documents';}
   if(!['consultations','visits','deals'].includes(kind))return;
   const id=(kind==='consultations'?'consultation':kind==='visits'?'visit':'deal')+'-'+row.id,existing=await get(tx,ref('tasks',id));
   if(title&&day&&row.status!=='cancelled'&&!['stopped','settled'].includes(row.stage))writeRow('tasks',{id,title,date:day,time:clock||'',priority:row.priority||'normal',status:existing?.status==='done'&&existing.title===title&&existing.date===day?'done':'open',kind:taskKind,customerId:row.customerId||row.customerIds?.[0]||row.buyerIds?.[0]||'',propertyId:row.propertyId||'',dealId:kind==='deals'?row.id:row.dealId||'',sourceKind:kind,sourceId:row.id,notes:''},existing);
   else if(existing)writeRow('tasks',{...existing,status:'cancelled'},existing);
  }
  if(action==='save'){
   const kind=input.collection;if(!EDITABLE.includes(kind))fail(403,'이 자료는 직접 수정할 수 없습니다.');const id=safeId(input.id),old=await get(tx,ref(kind,id));if(old&&old.ownerUid!==uid)fail(404,'기록을 찾을 수 없습니다.');checkRevision(old,input.expectedRevision);
   const row={...entity(kind,input.row,old||{}),id};if(old?.archived)row.archived=true;
   if(kind==='tasks'&&old?.sourceKind){row.sourceKind=old.sourceKind;row.sourceId=old.sourceId;}
   await validateReferences(row);await reconcileMedia(kind,row,old);
   const warnings=[];
   if(kind==='properties'){
    row.number=old?.number||'E-'+now.toString(36).toUpperCase()+'-'+hash(id).slice(0,6).toUpperCase();row.addressKey=normalizedAddress(row);
    if(row.addressKey&&row.addressKey!==old?.addressKey){const dup=await tx.get(db.collection(col(kind)).where('addressKey','==',row.addressKey).limit(5));if(dup.docs.some(d=>d.id!==id))warnings.push('주소가 같은 매물이 있습니다. 다른 호실 또는 다른 의뢰인지 확인해주세요. 자동 병합하지 않았습니다.');}
    row.history=old?.history||[];const changes=[];if(old)for(const key of ['price','deposit','rent','status'])if((old[key]??null)!==(row[key]??null))changes.push({field:key,before:old[key]??null,after:row[key]??null});
    if(changes.length){const entry={id:recordId(),at:now,changes};row.history=[...row.history,entry].slice(-100);set(ref(kind,id).collection('history').doc(String(now)+'-'+entry.id),{...entry,ownerUid:uid});}
   }
   await generatedTask(kind,row,old);const saved=writeRow(kind,row,old);result={row:saved,...(warnings.length?{warnings}:{})};
  } else if(action==='archive'){
   const kind=input.collection;if(!EDITABLE.includes(kind))fail(403,'이 자료는 보관할 수 없습니다.');const old=await owned(tx,kind,input.id);checkRevision(old,input.expectedRevision);
   const row={...old,archived:true,archivedAt:now,...(kind==='properties'?{status:'ended'}:{})};await generatedTask(kind,{...row,status:'cancelled'},old);result={row:writeRow(kind,row,old),retained:true};
  } else if(action==='mediaBegin'){
   const row=beginMedia(input,uid,now),mr=db.doc(`${w}/media/${row.id}`);if(await get(tx,mr))fail(409,'같은 파일 식별자가 이미 있습니다.');set(mr,row);result={id:row.id,chunkBytes:CHUNK_BYTES};
  } else if(action==='mediaChunk'||action==='mediaFinish'){
   const mr=db.doc(`${w}/media/${safeId(input.id)}`),m=await get(tx,mr);if(!m||m.ownerUid!==uid||m.ready||m.deleting)fail(409,'변경할 수 없는 첨부 파일입니다.');
   if(action==='mediaChunk'){const chunk=chunkData(m,input),cr=mr.collection('chunks').doc(String(chunk.index).padStart(4,'0')),old=await get(tx,cr);if(old&&old.data!==chunk.data)fail(409,'이미 다른 데이터가 저장된 첨부 조각입니다.');set(cr,{data:chunk.data});set(mr,{...m,updatedAt:now});result={ok:true};}
   else{if(!preparedMedia||m.uploadNonce!==preparedMedia.nonce||m.createdAt!==preparedMedia.createdAt||m.size!==preparedMedia.size||m.type!==preparedMedia.type)fail(409,'첨부 전송 세션이 변경되었습니다. 다시 확인해주세요.');const ready={ready:true,sha256:preparedMedia.sha256};set(mr,{...m,...ready,updatedAt:now});result={id:m.id,...ready};}
  } else if(action==='mediaDelete'||action==='cleanup'){
   let candidates,cursor=null;
   if(action==='mediaDelete'){const m=await get(tx,db.doc(`${w}/media/${safeId(input.id)}`));candidates=m?[m]:[];}
   else {const snapshot=await tx.get(pageQuery(db,`${w}/media`,input.cursor,2));candidates=docs(snapshot);cursor=snapshot.docs.length===2?snapshot.docs.at(-1).id:null;}
   const ids=[];
   for(const m of candidates){if(m.ownerUid!==uid)fail(403,'본인의 첨부만 삭제할 수 있습니다.');const activeShares=[];for(const digest of m.shareRefs||[])if(ACTIVE_SHARE(await get(tx,db.doc(`estateShares/${digest}`))))activeShares.push(digest);
    const referenced=(m.refs||[]).length||activeShares.length;
    if(referenced){if(action==='mediaDelete')fail(409,'기록 또는 활성 공유 링크에서 사용 중인 파일입니다. 연결을 해제한 뒤 삭제해주세요.');continue;}
    if(action==='cleanup'&&!m.deleting&&now-(m.updatedAt||m.createdAt)<(m.ready?7:1)*86400000)continue;
    set(db.doc(`${w}/media/${m.id}`),{...m,deleting:true,ready:false});ids.push(m.id);
   }
   result={__mediaCleanup:ids,final:action==='cleanup'?{removed:ids.length,cursor}:{ok:true}};
  } else if(action==='shareCreate'){
   const ids=input.propertyIds,options=shareOptions(input.publicOptions,Array.isArray(ids)?ids:[]),properties=await snapshotProperties(tx,ids,options),expiresAt=Number(input.expiresAt);
   if(!Number.isFinite(expiresAt)||expiresAt<=now||expiresAt>now+30*86400000)fail(400,'공유 만료는 현재부터 30일 이내로 정해주세요.');
   const token=crypto.randomBytes(32).toString('hex'),digest=hash(token),id=recordId(),selected=properties.flatMap(p=>p.photos.map(x=>x.mediaId));
   const row=stamp({id,propertyIds:ids,publicOptions:options,properties,expiresAt,revoked:false,tokenHash:digest},uid,now,null);
   for(const mid of selected){const mr=db.doc(`${w}/media/${mid}`),m=await get(tx,mr);if((m.shareRefs||[]).length>=100)fail(409,'이 사진의 오래된 공유 링크를 비활성화한 뒤 다시 공유해주세요.');set(mr,{...m,shareRefs:[...new Set([...(m.shareRefs||[]),digest])]});}
   set(ref('shareLinks',id),row);set(db.doc(`estateShares/${digest}`),{ownerUid:uid,shareId:id,properties,selectedMediaIds:selected,expiresAt,revoked:false,createdAt:now});result={row,token};
  } else if(action==='shareRevoke'){
   const row=await owned(tx,'shareLinks',input.id),sr=db.doc(`estateShares/${safeId(row.tokenHash)}`),share=await get(tx,sr);
   for(const mid of share?.selectedMediaIds||[]){const mr=db.doc(`${w}/media/${safeId(mid)}`),m=await get(tx,mr);if(m?.ownerUid===uid)set(mr,{...m,shareRefs:(m.shareRefs||[]).filter(digest=>digest!==row.tokenHash)});}
   if(share)set(sr,{...share,revoked:true,revokedAt:now});result={ok:true};writeRow('shareLinks',{...row,revoked:true},row);
  } else if(action==='requestConfirm'){
   const request=await owned(tx,'requests',input.id);if(request.status==='confirmed'){result={visit:await owned(tx,'visits',request.visitId)};}
   else {
    if(request.status!=='pending')fail(409,'확인 대기 요청만 일정으로 확정할 수 있습니다.');if(!request.propertyIds.includes(input.propertyId))fail(400,'고객이 요청한 매물을 선택해주세요.');
    const customer=await owned(tx,'customers',input.customerId),property=await owned(tx,'properties',input.propertyId),id='request-'+request.id,old=await get(tx,ref('visits',id));
    const visit={...entity('visits',{customerIds:[customer.id],propertyId:property.id,date:input.date,time:input.time,status:'scheduled'}),id};
    result={visit:writeRow('visits',visit,old)};writeRow('requests',{...request,status:'confirmed',visitId:id,confirmedAt:now},request);
   }
  } else if(action==='requestReject'){
   const request=await owned(tx,'requests',input.id);if(request.status==='confirmed')fail(409,'확정된 방문은 방문 기록에서 취소해주세요.');
   result={row:writeRow('requests',{...request,status:'rejected'},request)};
  } else fail(400,'지원하지 않는 작업입니다.');
  // All reads finish before the first write; Firestore transactions reject read-after-write.
  for(const write of writes)write();tx.set(receiptRef,{fingerprint,result,createdAt:now});return result;
 });
 if(mutationResult.__mediaCleanup){
  // Delete at most 8 base64 chunk documents (~4 MiB) per transaction, never 12 MiB at once.
  for(const id of mutationResult.__mediaCleanup)await drainMediaDeletion(db,w,id,uid);
  await db.runTransaction(async tx=>{const receipt=await get(tx,receiptRef);if(receipt?.fingerprint===fingerprint&&receipt.result.__mediaCleanup)tx.set(receiptRef,{...receipt,result:mutationResult.final});});
  return mutationResult.final;
 }
 return mutationResult;
}

async function drainMediaDeletion(db,w,id,uid){
 for(let pass=0;pass<33;pass++){
  const done=await db.runTransaction(async tx=>{const mr=db.doc(`${w}/media/${safeId(id)}`),m=await get(tx,mr);if(!m)return true;if(m.ownerUid!==uid||!m.deleting||(m.refs||[]).length)fail(409,'파일 연결 상태가 변경되어 정리를 중단했습니다.');
   const chunks=await tx.get(mr.collection('chunks').orderBy(FieldPath.documentId()).limit(8));for(const chunk of chunks.docs)tx.delete(chunk.ref);if(chunks.docs.length<8){tx.delete(mr);return true;}return false;
  });if(done)return;
 }
 fail(503,'파일 정리를 재시도해주세요.');
}

async function readMediaChunk(reader,w,m,index){const i=Number(index);if(!Number.isInteger(i)||i<0||i>=Math.ceil(m.size/CHUNK_BYTES))fail(400,'첨부 조각 번호를 확인해주세요.');const chunk=await get(reader,reader.doc?reader.doc(`${w}/media/${m.id}/chunks/${String(i).padStart(4,'0')}`):null);if(!chunk)fail(404,'첨부 조각을 찾을 수 없습니다.');return {data:chunk.data};}
async function dispatchPublic(db,input,meta,now){
 const token=publicToken(input.token),digest=hash(token),sr=db.doc(`estateShares/${digest}`),share=await get(db,sr);
 if(!ACTIVE_SHARE(share))fail(404,'만료되었거나 비활성화된 공유 링크입니다.');
 if(input.action==='publicGet')return {properties:share.properties.map(publicSnapshot),expiresAt:share.expiresAt};
 if(['publicMediaInfo','publicMediaReadChunk'].includes(input.action)){
  const id=safeId(input.id);if(!share.selectedMediaIds?.includes(id))fail(404,'공개되지 않은 사진입니다.');
  const w=`estateWorkspaces/${safeId(share.ownerUid)}`,m=await get(db,db.doc(`${w}/media/${id}`));if(!m?.ready||!m.type.startsWith('image/')||m.ownerUid!==share.ownerUid)fail(404,'사진을 찾을 수 없습니다.');
  return input.action==='publicMediaInfo'?{...mediaInfo(m),name:'매물사진.'+({'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[m.type]||'image')}:readMediaChunk(db,w,m,input.index);
 }
 if(input.consent!==true)fail(400,'연락처 제공 동의가 필요합니다.');
 const name=text(input.name,80),phone=text(input.phone,40),message=text(input.message,1500),preferredDate=date(input.preferredDate),preferredTime=time(input.preferredTime);
 if(!name||!phone||!/^[+()\d\s-]{6,40}$/.test(phone))fail(400,'이름과 연락 가능한 전화번호를 입력해주세요.');
 const ids=input.propertyIds;if(!Array.isArray(ids)||!ids.length||ids.length>5||new Set(ids).size!==ids.length||ids.some(id=>!share.properties.some(p=>p.id===id)))fail(400,'공개된 관심 매물을 선택해주세요.');
 const requestId=safeId(input.requestId),rid=hash(digest+':'+requestId),w=`estateWorkspaces/${safeId(share.ownerUid)}`,rr=db.doc(`${w}/requests/${rid}`),fingerprint=hash(JSON.stringify({ids,name,phone,message,preferredDate,preferredTime}));
 return db.runTransaction(async tx=>{
  const current=await get(tx,sr);if(!ACTIVE_SHARE(current))fail(404,'만료되었거나 비활성화된 공유 링크입니다.');
  const previous=await get(tx,rr);if(previous){if(previous.requestFingerprint!==fingerprint)fail(409,'새 요청으로 다시 제출해주세요.');return {ok:true};}
  // One bounded counter per share; no unbounded daily/IP documents or paid TTL cleanup.
  const day=new Date(now).toISOString().slice(0,10),rateId=hash(String(meta.ip||'anonymous')),sameDay=current.rateDay===day,count=sameDay?Number(current.rateCount)||0:0,clients=sameDay?{...(current.rateClients||{})}:{};
  if((clients[rateId]||0)>=5||count>=30)fail(429,'요청이 잠시 많습니다. 나중에 다시 시도하거나 중개사에게 직접 연락해주세요.');
  tx.set(rr,stamp({id:rid,shareId:share.shareId,propertyIds:ids,name,phone,preferredDate,preferredTime,message,status:'pending',requestFingerprint:fingerprint},share.ownerUid,now,null));
  clients[rateId]=(clients[rateId]||0)+1;tx.set(sr,{...current,rateDay:day,rateCount:count+1,rateClients:clients});return {ok:true};
 });
}

export function assertSameOrigin(req){
 const origin=req.headers.origin;if(!origin)return;
 const configured=process.env.PUBLIC_APP_URL?.replace(/\/$/,''),host=String(req.headers.host||'');
 const allowed=new Set([configured,host&&`https://${host}`,...(/^localhost(?::\d+)?$|^127\.0\.0\.1(?::\d+)?$/.test(host)?[`http://${host}`]:[])].filter(Boolean));
 if(!allowed.has(origin))fail(403,'요청 출처를 확인해주세요.');
}
export function makeHandler(getServices=services){return async function handler(req,res){
 res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization, Origin');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Type','application/json; charset=utf-8');
 try{
  if(req.method!=='POST')fail(405,'POST 요청만 지원합니다.');assertSameOrigin(req);
  let body=req.body;if(body===undefined){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>900000)fail(413,'요청이 너무 큽니다.');chunks.push(chunk);}body=Buffer.concat(chunks).toString('utf8');}
  if(Buffer.byteLength(typeof body==='string'?body:JSON.stringify(body||{}))>900000)fail(413,'요청이 너무 큽니다.');
  if(typeof body==='string'){try{body=JSON.parse(body);}catch{fail(400,'요청 형식을 확인해주세요.');}}
  if(!body||typeof body!=='object'||Array.isArray(body))fail(400,'요청 형식을 확인해주세요.');
  const {db,auth}=getServices();let user=null;
  if(!PUBLIC_ACTIONS.has(body.action)){const token=String(req.headers.authorization||'').match(/^Bearer ([^\s]+)$/)?.[1];if(!token)fail(401,'로그인이 필요합니다.');user=await auth.verifyIdToken(token,true);}
  const result=await dispatch(db,user,body,{ip:String(req.headers['x-forwarded-for']||req.socket?.remoteAddress||'').split(',')[0].trim()});res.statusCode=200;res.end(JSON.stringify(result));
 }catch(error){const status=Number(error.status)||(String(error.code||'').startsWith('auth/')?401:503);res.statusCode=status;res.end(JSON.stringify({error:status===503?'부동산 업무 서버 연결을 확인해주세요. 저장하지 못한 입력은 유지됩니다.':status===401?'로그인이 필요하거나 인증이 만료되었습니다.':error.message}));}
};}
export default makeHandler();
