import crypto from 'node:crypto';
import {decodeArchive,encodeStoredPayload} from '../archive-codec-v168.js';
import {FieldValue} from 'firebase-admin/firestore';
import {syncIntakes} from '../server/intake-v168.mjs';
import {services} from '../server/firebase-admin.mjs';
import {OWNER_EMAILS,fail,id,jsonSafe,revision} from '../server/work-model.mjs';
import '../consult-model-v167.js';
const M=globalThis.AiderConsultModelV167;
const KEYS=['consultingClients','consultingTasks','consultingSessions','consultingFiles'];
export async function commitConsult(db,user,input){
  if(!user.email_verified||!OWNER_EMAILS.has(String(user.email||'').toLowerCase()))fail(403,'Consult 접근 권한이 없습니다.');
  const uid=id(user.uid),key=input.collection;if(!KEYS.includes(key))fail(400,'자료 종류를 확인해주세요.');id(input.id);id(input.requestId);
  const fingerprint=crypto.createHash('sha256').update(JSON.stringify(input)).digest('hex');
  const main=db.doc(`users/${uid}/private/main`),receipt=db.doc(`users/${uid}/consultReceipts/${input.requestId}`);
  return db.runTransaction(async tx=>{
    const [snap,replay,identity]=await Promise.all([tx.get(main),tx.get(receipt),tx.get(db.doc(`workIdentities/${uid}`))]);
    if(identity.data()?.kind==='employee')fail(403,'직원 계정은 Consult를 사용할 수 없습니다.');
    const payload=decodeArchive(snap.data()?.payload)||{},data=M.normalize(payload);
    if(replay.exists){if(replay.data().fingerprint!==fingerprint)fail(409,'요청 ID가 다른 변경에 사용되었습니다.');return {payload,replayed:true};}
    const rows=data[key],old=rows.find(r=>r.id===input.id);revision(old,input.expectedRevision);
    if(old&&!old.revision&&Number(input.expectedUpdatedAt||0)!==Number(old.updatedAt||old.createdAt||0))fail(409,'기존 기록이 변경되었습니다. 다시 불러와주세요.');
    let row=jsonSafe(input.row);if(row.id!==input.id)fail(400,'기록 ID가 일치하지 않습니다.');
    row={...old,...row,id:input.id,schemaVersion:167,createdAt:old?.createdAt||Date.now(),createdBy:old?.createdBy||uid,updatedAt:Date.now(),updatedBy:uid,revision:Number(old?.revision||0)+1};
    if(key!=='consultingClients'&&!data.consultingClients.some(c=>c.id===row.clientId))fail(400,'연결할 고객을 확인해주세요.');
    if(old&&key!=='consultingClients'&&old.clientId!==row.clientId)fail(409,'기존 기록의 고객 연결을 변경할 수 없습니다.');
    if(key==='consultingFiles'){
      if(old&&['textContent','fileId','documentId','version','storageScope','ownerEmail'].some(k=>JSON.stringify(old[k]??'')!==JSON.stringify(row[k]??'')))fail(409,'문서 원본을 수정할 수 없습니다. 새 버전으로 등록해주세요.');
      if(rows.some(r=>r.id!==row.id&&r.clientId===row.clientId&&r.documentId===row.documentId&&Number(r.version)===Number(row.version)))fail(409,'이미 존재하는 문서 버전입니다.');
    }
    let mediaLock=null;
    if(key==='consultingFiles'&&!old&&row.fileId){
      if(row.storageScope!=='private')fail(400,'새 문서는 계정 전용 첨부로 업로드해주세요.');
      const ref=db.doc(`users/${uid}/privateMedia/${id(row.fileId)}`),meta=await tx.get(ref),m=meta.data();
      if(!m||m.createdBy!==uid||m.size<=0||m.size>25*1024*1024||!Number.isInteger(m.chunkCount)||m.chunkCount<1||m.chunkCount>37)fail(400,'완료된 본인 첨부만 연결할 수 있습니다.');
      const chunks=await tx.get(ref.collection('chunks'));
      const sorted=chunks.docs.sort((a,b)=>a.id.localeCompare(b.id));
      if(sorted.length!==m.chunkCount||sorted.some((d,i)=>d.id!==String(i).padStart(5,'0')||!Buffer.isBuffer(d.data().data)))fail(409,'첨부 업로드가 완료되지 않았습니다.');
      const bytes=Buffer.concat(sorted.map(d=>d.data().data));if(bytes.length!==m.size)fail(409,'첨부 크기가 일치하지 않습니다.');
      row.ownerEmail=String(user.email).toLowerCase();row.size=m.size;row.type=m.type;row.attachmentSha256=crypto.createHash('sha256').update(bytes).digest('hex');
      mediaLock={ref,data:{immutableConsult:true,consultLockedAt:Date.now(),sha256:row.attachmentSha256}};
    }
    if(key==='consultingTasks'&&row.sourceKey&&rows.some(r=>r.id!==row.id&&r.clientId===row.clientId&&r.sourceKey===row.sourceKey))fail(409,'같은 후속 과업이 이미 있습니다.');
    if(key==='consultingClients'){
      const previous=old?.consult167?.deliveries||[],next=row.consult167?.deliveries||[];
      if(previous.some(d=>JSON.stringify(d)!==JSON.stringify(next.find(n=>n.id===d.id))))fail(409,'저장된 전달본은 변경하거나 삭제할 수 없습니다.');
      const used=new Set();for(const d of next){if(used.has(d.id))fail(400,'전달본 ID가 중복되었습니다.');used.add(d.id);if(previous.some(p=>p.id===d.id))continue;
        const selected=(d.sourceRefs||[]).map(r=>r.kind==='goals'?'goals':`${r.kind}:${r.id}`),expected=M.delivery(data,row.id,selected,{id:d.id,createdAt:d.createdAt,createdBy:uid});
        if(JSON.stringify(d.sections)!==JSON.stringify(expected.sections)||JSON.stringify(d.sourceRefs)!==JSON.stringify(expected.sourceRefs))fail(409,'전달 내용이 변경되었습니다. 다시 미리보기를 확인해주세요.');
        Object.keys(d).forEach(k=>delete d[k]);Object.assign(d,expected,{createdAt:Date.now()});
      }
    }
    const next={...payload,[key]:[...rows.filter(r=>r.id!==row.id),row]};
    // Never silently truncate legacy arrays to satisfy Firestore's document limit.
    const packed=encodeStoredPayload(next);
    if(Buffer.byteLength(JSON.stringify(packed))>850000)fail(413,'개인 데이터 용량이 큽니다. 원본을 보존했으며 분할 이전이 필요합니다.');
    if(mediaLock)tx.update(mediaLock.ref,mediaLock.data);
    tx.set(main,{...snap.data(),payload:packed,storageVersion:168,formatWrittenAt:FieldValue.serverTimestamp(),updatedAt:new Date()});tx.set(receipt,{fingerprint,createdAt:Date.now()});
    return {payload:next,row};
  });
}
export default async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');res.setHeader('Content-Type','application/json; charset=utf-8');
  try{
    if(req.method!=='POST')fail(405,'POST 요청만 지원합니다.');const origin=req.headers.origin;if(origin&&origin!==process.env.PUBLIC_APP_URL?.replace(/\/$/,''))fail(403,'요청 출처를 확인해주세요.');
    const token=String(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];if(!token)fail(401,'로그인이 필요합니다.');const {db,auth}=services();const user=await auth.verifyIdToken(token,true);
    const body=jsonSafe(typeof req.body==='string'?JSON.parse(req.body):req.body);const result=body.action==='syncIntakes'?await syncIntakes(db,user,body):await commitConsult(db,user,body);res.statusCode=200;res.end(JSON.stringify(result));
  }catch(e){res.statusCode=e.status||503;res.end(JSON.stringify({error:e.status?e.message:'Consult 서버 연결을 확인해주세요. 변경사항이 저장되지 않았습니다.'}));}
}
