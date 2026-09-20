import {createHash} from 'node:crypto';
import {OWNER_EMAILS,fail,id} from './work-model.mjs';
import {decodeArchive,encodeStoredPayload} from '../archive-codec-v168.js';
import '../bio-admin-domain-v192.js';
const M=globalThis.AiderBioAdminDomainV192;
export const BIO_ADMIN_COLLECTION='bioAdmin';
const clone=value=>JSON.parse(JSON.stringify(value));
function owner(user,input){if(!user?.uid||!user.email_verified||!OWNER_EMAILS.has(String(user.email||'').toLowerCase()))fail(403,'Consult 접근 권한이 없습니다.');const uid=id(user.uid);if(input?.expectedOwnerKey!==uid)fail(401,'계정이 변경되었습니다. 다시 열어주세요.');return uid;}
function readStored(stored,uid){if(!stored)return M.empty();if(stored.ownerUid!==uid||stored.version!==192)fail(409,'행정 기록을 확인할 수 없습니다. 원본은 유지됩니다.');let state;try{state=decodeArchive(stored.state);}catch{fail(409,'행정 기록을 복원할 수 없습니다. 원본은 유지됩니다.');}if(Buffer.byteLength(JSON.stringify(state),'utf8')>16*1024*1024)fail(413,'행정 기록 복원 용량을 초과했습니다. 원본은 유지됩니다.');return M.normalizeState(state);}
function result(state,uid,extra={}){return {state,summary:M.summary(state),ownerKey:uid,...extra};}
function fingerprint(input){return createHash('sha256').update(JSON.stringify(input)).digest('hex');}
export async function bioAdminDispatch(db,user,input,{now=Date.now(),commitTimestamp=()=>new Date(now)}={}){
 const uid=owner(user,input),ref=db.doc(`users/${uid}/${BIO_ADMIN_COLLECTION}/main`),identity=db.doc(`workIdentities/${uid}`);
 if(input.action==='read'){
  const [marker,snapshot]=await Promise.all([identity.get(),ref.get()]);if(marker.data()?.kind==='employee')fail(403,'직원 계정은 Consult를 사용할 수 없습니다.');return result(readStored(snapshot.data(),uid),uid);
 }
 if(!['save','delete'].includes(input.action)||!M.COLLECTIONS.includes(input.collection)||!Number.isSafeInteger(input.expectedRevision)||input.expectedRevision<0)fail(400,'저장 요청을 확인해주세요.');
 id(input.requestId);const rowId=id(input.action==='delete'?input.id:input.row?.id);if(input.action==='delete'&&input.confirmed!==true)fail(400,'삭제 확인이 필요합니다.');
 const fresh=input.action==='save'?M.normalizeRow(input.collection,input.row):null,hash=fingerprint(input);
 return db.runTransaction(async tx=>{
  const [marker,snapshot]=await Promise.all([tx.get(identity),tx.get(ref)]);if(marker.data()?.kind==='employee')fail(403,'직원 계정은 Consult를 사용할 수 없습니다.');
  const stored=snapshot.data(),state=readStored(stored,uid),requests=stored?.requests||[],replay=requests.find(r=>r.id===input.requestId);
  if(replay){if(replay.fingerprint!==hash)fail(409,'다른 변경에 사용한 요청입니다.');return result(state,uid,{replayed:true});}
  if(state.revision!==input.expectedRevision)fail(409,'다른 화면에서 변경되었습니다. 새로고침 후 다시 수정해주세요.');
  const rows=state[input.collection],old=rows.find(row=>row.id===rowId);let row;
  if(input.action==='delete'){
   if(!old||old.deleted)fail(404,'삭제할 기록을 찾을 수 없습니다.');
   row={...old,deleted:true,deletedAt:now};
  }else{
   if(old?.deleted)fail(409,'삭제한 기록 ID를 다시 사용할 수 없습니다. 새 기록으로 추가해주세요.');
   row={...old,...fresh};
   if(input.collection==='orders'){
    const program=state.programs.find(p=>p.id===row.programId);if(!program||(program.deleted||program.active===false)&&old?.programId!==program.id)fail(400,'사용할 프로그램을 먼저 등록해주세요.');
    const privateSnap=await tx.get(db.doc(`users/${uid}/private/main`)),payload=decodeArchive(privateSnap.data()?.payload)||{},client=(payload.consultingClients||[]).find(c=>c.id===row.clientId&&!c.deleted);
    if(!client)fail(400,'Consult에 등록된 고객을 선택해주세요.');
    row.clientName=String(client.name||client.title||'고객').slice(0,160);row.programName=program.name;
   }
  }
  row={...row,createdAt:old?.createdAt||now,updatedAt:now,revision:(old?.revision||0)+1};
  state[input.collection]=old?rows.map(current=>current.id===rowId?row:current):[...rows,row];state.revision++;
  M.validateLinks(state);
  if(Buffer.byteLength(JSON.stringify(state),'utf8')>16*1024*1024)fail(413,'행정 기록 용량이 큽니다. 기존 기록은 보존했으며 저장을 중단했습니다.');
  const packed=encodeStoredPayload(state,{now});
  const next={ownerUid:uid,version:192,state:packed,requests:[...requests,{id:input.requestId,fingerprint:hash}].slice(-32),writtenAt:commitTimestamp()};
  // Refuse a large save instead of dropping rows, attachments or old records.
  if(Buffer.byteLength(JSON.stringify(next),'utf8')>700000)fail(413,'행정 기록 용량이 큽니다. 기존 기록은 보존했으며 저장을 중단했습니다.');
  tx.set(ref,next);return result(clone(state),uid,{row});
 });
}
