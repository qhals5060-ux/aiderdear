import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {normalizeCustom,sampleSpecs} from '../finance-product-v190.js';
import {normalizeDetails,validateAssetDetails,appendHistory,readHistory} from '../finance-management-v190.js';
import {firestoreDocumentBytes} from './youtube-library-store-v189.mjs';

export const ASSET_COLLECTION='assetWorkspaceV184';
const MAX_RAW=16*1024*1024;
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const isObject=x=>x&&typeof x==='object'&&!Array.isArray(x);
function validateInput(fn){try{return fn();}catch(error){if(error.status)throw error;fail(400,error.message||'입력 내용을 확인해주세요.');}}
const assetId=id=>{if(typeof id!=='string'||!/^[-\w]{1,70}$/.test(id))fail(400,'상품 ID를 확인해주세요.');return id;};
const safeOwner=user=>{if(typeof user?.uid!=='string'||!user.uid||user.uid.includes('/')||user.uid.length>128)fail(401,'로그인이 필요합니다.');return user.uid;};
function readRow(data,uid,id){
 if(!data)return null;
 let row=data;
 if(data.encoding==='gzip-json-v190'){
  if(data.ownerUid!==uid||!Number.isInteger(data.rawBytes)||data.rawBytes>MAX_RAW||typeof data.packed!=='string')fail(409,'기록 형식을 확인할 수 없습니다. 원본은 유지됩니다.');
  const bytes=gunzipSync(Buffer.from(data.packed,'base64'),{maxOutputLength:MAX_RAW});if(bytes.length!==data.rawBytes)fail(409,'기록의 압축 크기가 일치하지 않습니다.');row=JSON.parse(bytes.toString('utf8'));
 }
 if(row.asset_id!==id||typeof row.note!=='string'||![0,1].includes(row.watched)||!Number.isSafeInteger(row.revision??0)||(row.revision??0)<0)fail(409,'기록 형식을 확인할 수 없습니다. 원본은 유지됩니다.');
 return {...row,revision:row.revision??0};
}
function responseRow(row){const history=readHistory(row.history);return {...row,history:JSON.stringify(history.slice(-30)),historyCount:history.length};}
function pack(row,uid,request,commitTimestamp){
 const raw=Buffer.from(JSON.stringify(row));if(raw.length>MAX_RAW)fail(413,'상품 기록 용량이 큽니다. 원본을 유지했으며 저장하지 않았습니다.');
 const data={ownerUid:uid,encoding:'gzip-json-v190',rawBytes:raw.length,packed:gzipSync(raw).toString('base64'),updated_at:row.updated_at,writtenAt:commitTimestamp(),revision:row.revision,lastRequest:request};
 if(firestoreDocumentBytes(`users/${uid}/${ASSET_COLLECTION}/${row.asset_id}`,data)>900000)fail(413,'상품 기록 용량이 큽니다. 기존 이력을 지우지 않고 저장을 중단했습니다.');
 if(JSON.stringify(readRow(data,uid,row.asset_id))!==JSON.stringify(row))fail(409,'기록 복원 검사를 통과하지 못했습니다.');return data;
}
export async function financeDispatch(db,user,input,{now=Date.now(),commitTimestamp=()=>new Date(now)}={}){
 const uid=safeOwner(user);if(!isObject(input))fail(400,'요청을 확인해주세요.');
 if(input.expectedOwnerKey!==uid)fail(401,'로그인 계정이 변경되었습니다. 다시 열어주세요.');
 const identity=await db.doc(`workIdentities/${uid}`).get();if(identity.data()?.kind==='employee')fail(403,'이 계정은 개인 재테크 공간을 사용할 수 없습니다.');
 const collection=db.collection(`users/${uid}/${ASSET_COLLECTION}`),stamp=new Date(now).toISOString();
 if(input.action==='read'){
  let query=collection;const since=input.since;if(since!==undefined){if(typeof since!=='string'||!/^\d{4}-\d{2}-\d{2}T.*Z$/.test(since)||!Number.isFinite(Date.parse(since)))fail(400,'확인 시각을 확인해주세요.');query=query.where('writtenAt','>=',new Date(since));}
  const snap=await query.get(),records=snap.docs.map(doc=>responseRow(readRow(doc.data(),uid,doc.id)));
  // Use Firestore's snapshot/commit times, not request start times. A save can
  // commit after this read even if its HTTP request started earlier.
  return {records,signedIn:true,ownerKey:uid,checkedAt:snap.readTime?.toDate?.().toISOString()??stamp,incremental:since!==undefined};
 }
 const id=assetId(input.id),ref=collection.doc(id);
 if(input.action==='history'){
  const snap=await ref.get();if(!snap.exists)fail(404,'상품을 찾을 수 없습니다.');const row=readRow(snap.data(),uid,id),history=readHistory(row.history);
  const end=input.cursor==null?history.length:input.cursor;if(!Number.isSafeInteger(end)||end<0||end>history.length)fail(400,'이력 위치를 확인해주세요.');const start=Math.max(0,end-30);
  return{history:JSON.stringify(history.slice(start,end)),cursor:start||null,total:history.length,ownerKey:uid,revision:row.revision};
 }
 if(input.action!=='save')fail(400,'지원하지 않는 요청입니다.');
 if(typeof input.watched!=='boolean'||typeof input.note!=='string'||input.note.length>2000||!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<0||typeof input.requestId!=='string'||!/^[-\w]{16,80}$/.test(input.requestId))fail(400,'저장할 내용을 확인해주세요.');
 let custom;if(input.custom!==undefined){if(Object.hasOwn(sampleSpecs,id))fail(400,'예시 상품의 원본은 수정할 수 없습니다.');custom={...validateInput(()=>normalizeCustom(input.custom,id)),change:0,series:[],source:'직접 입력',sample:false,asOf:stamp};}
 const details=input.details===undefined?undefined:JSON.stringify(validateInput(()=>normalizeDetails(input.details)));
 const fingerprint=createHash('sha256').update(JSON.stringify({id,watched:input.watched,note:input.note,custom:input.custom,details:input.details,expectedRevision:input.expectedRevision})).digest('hex');
 return db.runTransaction(async tx=>{
  const snapshot=await tx.get(ref),stored=snapshot.data(),old=snapshot.exists?readRow(stored,uid,id):null;
  if(stored?.lastRequest?.id===input.requestId){if(stored.lastRequest.fingerprint!==fingerprint)fail(409,'다른 변경에 사용된 저장 요청입니다.');return{record:responseRow(old),ownerKey:uid,replayed:true};}
  if((old?.revision??0)!==input.expectedRevision)fail(409,'다른 화면에서 수정한 내용이 있습니다. 새로고침한 뒤 다시 수정해주세요.');
  if(!Object.hasOwn(sampleSpecs,id)&&!custom&&!old)fail(404,'상품을 찾을 수 없습니다.');
  if(old?.history&&readHistory(old.history).length!==JSON.parse(old.history).length)fail(409,'기존 이력을 읽을 수 없어 원본을 유지했습니다.');
  const row={...old,asset_id:id,watched:input.watched?1:0,note:input.note,custom:custom?JSON.stringify(custom):old?.custom??null,details:details===undefined?old?.details??null:details,updated_at:stamp,revision:(old?.revision??0)+1};
  const previousAsset=old?.custom?JSON.parse(old.custom):sampleSpecs[id]??null;validateInput(()=>validateAssetDetails(custom??previousAsset,row.details,previousAsset,old?.details));
  row.history=appendHistory(old,row,stamp);const storedNext=pack(row,uid,{id:input.requestId,fingerprint},commitTimestamp);tx.set(ref,storedNext);
  return{record:responseRow(row),ownerKey:uid};
 });
}
