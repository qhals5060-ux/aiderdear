import {FieldValue,FieldPath} from 'firebase-admin/firestore';
import {OWNER_EMAILS,fail,id} from './work-model.mjs';
import {decodeArchive,encodeStoredPayload} from '../archive-codec-v168.js';

// Find submissions from every link belonging to this account, including links
// created on another device. Imports are atomic, idempotent, and keep originals.
export async function syncIntakes(db,user,input={}){
  const uid=id(user.uid);
  if(!user.email_verified||!OWNER_EMAILS.has(String(user.email||'').toLowerCase())||(await db.doc(`workIdentities/${uid}`).get()).data()?.kind==='employee')fail(403,'Consult 접근 권한이 없습니다.');
  let query=db.collection('clientIntakeLinks').where('ownerUid','==',uid).orderBy(FieldPath.documentId()).limit(10);
  const cursor=input.cursor||{};
  if(cursor.pending)query=query.startAt(id(cursor.pending));else if(cursor.after)query=query.startAfter(id(cursor.after));
  const links=await query.get();let imported=0,next=null;
  for(const link of links.docs){
    const submissions=await link.ref.collection('submissions').where('status','==','new').limit(10).get();
    for(const document of submissions.docs){
      const added=await db.runTransaction(async tx=>{
        const ref=db.doc(`users/${uid}/private/main`);
        const [owner,source,main,identity]=await Promise.all([tx.get(link.ref),tx.get(document.ref),tx.get(ref),tx.get(db.doc(`workIdentities/${uid}`))]);
        if(owner.data()?.ownerUid!==uid||identity.data()?.kind==='employee')fail(403,'계정 권한이 변경되었습니다.');
        if(!source.exists||source.data().status!=='new')return false;
        const raw=source.data(),payload=decodeArchive(main.data()?.payload)||{},clients=payload.consultingClients||[];
        const duplicate=clients.some(row=>row.externalSubmissionId===document.id);
        if(!duplicate){
          const fields=['name','phone','email','birthYear','gender','currentSchool','currentMajor','targetUniversity','targetMajor','advisorNames','degree','gpa','gpaScale','applicationYear','applicationSemester','topic','languageSpec','certifications','activities','researchExperience','outputs','inquiry','note'];
          const row=Object.fromEntries(fields.filter(key=>raw[key]!==undefined).map(key=>[key,raw[key]]));
          Object.assign(row,{id:'client-external-'+document.id,externalSubmissionId:document.id,externalLinkToken:link.id,contact:[raw.phone,raw.email].filter(Boolean).join(' · '),university:raw.targetUniversity||'',institution:raw.currentSchool||'',program:raw.currentMajor||'',major:raw.targetMajor||'',stage:'inquiry',admissionResult:'pending',createdAt:raw.createdAt?.toMillis?.()||Date.now(),updatedAt:Date.now(),createdBy:uid,updatedBy:uid,revision:1});
          const packed=encodeStoredPayload({...payload,consultingClients:[...clients,row]});
          if(Buffer.byteLength(JSON.stringify(packed))>850000)fail(413,'저장 공간을 확인해주세요. 제출 원본은 보존됩니다.');
          tx.set(ref,{...main.data(),payload:packed,storageVersion:168,formatWrittenAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()});
        }
        tx.update(document.ref,{status:'imported',importedAt:FieldValue.serverTimestamp()});return !duplicate;
      });if(added)imported++;
    }
    if(submissions.size===10){next={pending:link.id};break;}
    next={after:link.id};
  }
  if(links.size<10&&!next?.pending)next=null;
  return {imported,cursor:next};
}
