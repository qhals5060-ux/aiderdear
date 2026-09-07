import {decodeWorkRow,encodeWorkRow} from '../server/storage-v168.mjs';
import {decodeArchive} from '../archive-codec-v168.js';
import crypto from 'node:crypto';
import {FieldPath} from 'firebase-admin/firestore';
import {services} from '../server/firebase-admin.mjs';
import {OWNER_EMAILS,COLLECTIONS,TASK_PUBLIC,fail,id,text,pick,record,entity,revision,jsonSafe} from '../server/work-model.mjs';

const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const MAX_FILE=25*1024*1024, CHUNK=384*1024;
const MIME=new Set(['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm','text/plain','text/csv']);
const get=async(r,ref)=>{const s=await (typeof r.get==='function'?r.get(ref):ref.get());return s.exists?{...decodeWorkRow(s.data()),id:s.id}:null;};
const cleanUser=u=>({uid:id(u.uid),email:String(u.email||'').toLowerCase(),verified:u.email_verified===true});

export async function dispatch(db,rawUser,input){
  const user=cleanUser(rawUser),action=String(input.action||''),now=Date.now();
  const identityRef=db.doc(`workIdentities/${user.uid}`),identity=await get(db,identityRef);
  if(action==='identity')return {employee:identity?.kind==='employee',workspaceId:identity?.workspaceId||''};
  if(action==='acceptInvite'){
    if(!user.verified)fail(403,'검증된 이메일 계정으로 로그인해주세요.');
    const token=String(input.token||'');if(!/^[a-f0-9]{64}$/.test(token))fail(400,'초대 링크를 확인해주세요.');
    return db.runTransaction(async tx=>{
      const ref=db.doc(`workInvitations/${hash(token)}`),invite=await get(tx,ref),oldIdentity=await get(tx,identityRef);
      if(!invite||invite.revoked||invite.usedAt||invite.expiresAt<now||invite.email!==user.email)fail(403,'만료되었거나 사용할 수 없는 초대입니다.');
      if(OWNER_EMAILS.has(user.email)||oldIdentity)fail(409,'이미 연결된 계정입니다. 대표에게 권한을 확인해주세요.');
      const profileRef=db.doc(`workspaces/${id(invite.workspaceId)}/employees/${id(invite.employeeId)}`),profile=await get(tx,profileRef);
      if(!profile||profile.inviteHash!==hash(token)||profile.uid)fail(409,'새 초대 링크를 사용해주세요.');
      tx.set(identityRef,{kind:'employee',workspaceId:invite.workspaceId,employeeId:invite.employeeId,createdAt:now});
      tx.set(db.doc(`workspaces/${invite.workspaceId}/members/${user.uid}`),{uid:user.uid,employeeId:invite.employeeId,role:'employee',active:true,joinedAt:now});
      tx.update(profileRef,{uid:user.uid,active:true,updatedAt:now,revision:(profile.revision||0)+1});tx.update(ref,{usedAt:now,usedBy:user.uid});
      return {workspaceId:invite.workspaceId};
    });
  }
  const owner=OWNER_EMAILS.has(user.email)&&user.verified&&identity?.kind!=='employee';
  const workspaceId=owner?user.uid:identity?.workspaceId;
  if(!workspaceId)fail(403,'Work 초대 또는 대표 계정이 필요합니다.');
  const w=`workspaces/${id(workspaceId)}`,workspaceRef=db.doc(w),memberRef=db.doc(`${w}/members/${user.uid}`);
  const check=async reader=>{
    const [space,member]=await Promise.all([get(reader,workspaceRef),get(reader,memberRef)]);
    if(owner){if(!space||space.ownerUid!==user.uid||!member?.active||member.role!=='owner')fail(403,'업무 공간을 먼저 생성해주세요.');}
    else if(!space||!member?.active||member.role!=='employee')fail(403,'소속 권한이 없거나 회수되었습니다.');
    return {space,member};
  };
  if(action==='bootstrap'||(['context','calendar'].includes(action)&&owner)){
    if(!owner||(action==='bootstrap'&&input.confirm!==true))fail(403,'대표 계정이 필요합니다.');
    const initialized=await db.runTransaction(async tx=>{
      const [old,member]=await Promise.all([get(tx,workspaceRef),get(tx,memberRef)]);
      if(old&&old.ownerUid!==user.uid)fail(403,'접근할 수 없습니다.');
      if(member&&(member.role!=='owner'||member.uid!==user.uid))fail(403,'기존 소속을 확인해주세요.');
      if(!old)tx.set(workspaceRef,{ownerUid:user.uid,title:'Work',createdAt:now,schemaVersion:167,revokedRetention:'retain-no-access'});
      if(!member)tx.set(memberRef,{uid:user.uid,role:'owner',active:true,joinedAt:now});
      return {workspaceId};
    });
    if(action==='bootstrap')return initialized;
  }
  const ctx=await check(db);
  if(action==='context'){
    const employee=owner?null:pick(await get(db,db.doc(`${w}/employees/${id(ctx.member.employeeId)}`))||{},['id','name','roleLabel']);
    await check(db);
    return {workspaceId,owner,user:{uid:user.uid,email:user.email},member:ctx.member,workspace:ctx.space,employee};
  }
  const requireOwner=()=>{if(!owner)fail(403,'대표에게 허용된 작업입니다.');};
  const collection=name=>{if(!COLLECTIONS.includes(name))fail(400,'자료 유형을 확인해주세요.');return db.collection(`${w}/${name}`);};
  if(action==='calendar'){
    requireOwner();
    const cursor=input.cursor==null?'tasks:':String(input.cursor),match=/^(tasks|projects):(.*)$/.exec(cursor);
    if(!match)fail(400,'일정 조회 위치를 확인해주세요.');
    const [,kind,after]=match;let query=collection(kind).orderBy(FieldPath.documentId()).limit(100);if(after)query=query.startAfter(id(after));
    const snapshot=await query.get();await check(db);
    const date=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)?value:'';
    const inactive=new Set(['cancelled','rejected','archived','deleted']);
    const records=snapshot.docs.map(doc=>({...doc.data(),id:doc.id})).filter(row=>!row.archived&&!row.deleted&&!row.archivedAt&&!row.deletedAt&&!inactive.has(row.status)).flatMap(row=>{
      const startDate=date(row.startDate)||date(row.dueDate),endDate=date(row.endDate)||date(row.dueDate);if(!startDate)return [];
      return [{id:row.id,source:kind==='tasks'?'work-task':'work-project',title:String(row.title||''),startDate,...(endDate&&endDate>=startDate?{endDate}:{}),status:String(row.status||''),...(kind==='tasks'&&row.projectId?{projectId:String(row.projectId)}:{})}];
    });
    return {records,cursor:snapshot.docs.length===100?`${kind}:${snapshot.docs.at(-1).id}`:kind==='tasks'?'projects:':null,updatedAt:now};
  }
  async function visible(reader,kind,row){
    if(!row)fail(404,'기록을 찾을 수 없습니다.');
    if(owner)return row;
    if(kind==='tasks'&&row.assigneeUid===user.uid)return pick(row,TASK_PUBLIC);
    if(kind==='submissions'&&row.authorUid===user.uid)return row;
    if(kind==='reviews'){const s=await get(reader,db.doc(`${w}/submissions/${id(row.submissionId)}`));if(s?.authorUid===user.uid)return row;}
    if(kind==='resources'&&(row.allowedUids||[]).includes(user.uid))return pick(row,['id','title','category','documentId','version','date','projectId','mediaIds','notes','revision']);
    fail(403,'해당 기록에 접근할 수 없습니다.');
  }
  if(action==='history'||action==='reviewHistory'){
    const kind=action==='reviewHistory'?'reviews':String(input.collection||'');const ref=collection(kind).doc(id(input.id));
    await visible(db,kind,await get(db,ref));if(!owner&&kind!=='reviews')fail(403,'공개된 검토 이력만 조회할 수 있습니다.');
    let q=ref.collection('history').orderBy(FieldPath.documentId()).limit(100);if(input.cursor)q=q.startAfter(id(input.cursor));const snap=await q.get();await check(db);
    return {rows:snap.docs.map(d=>({...decodeWorkRow(d.data()),historyId:d.id})),cursor:snap.size===100?snap.docs.at(-1).id:null};
  }
  if(action==='legacyList'){
    requireOwner();const privateDoc=await get(db,db.doc(`users/${user.uid}/private/main`)),payload=decodeArchive(privateDoc?.payload)||{};
    if(!input.token)return {rows:(payload.workRecords||[]).filter(r=>r&&!r.demo),links:payload.labNotebookLinks||[],cursor:null};
    const link=await get(db,db.doc(`labNotebookLinks/${id(input.token)}`));if(link?.ownerUid!==user.uid)fail(403,'본인의 기존 노트 링크만 조회할 수 있습니다.');
    let q=db.collection(`labNotebookLinks/${id(input.token)}/submissions`).orderBy(FieldPath.documentId()).limit(100);if(input.cursor)q=q.startAfter(id(input.cursor));const snap=await q.get();
    return {rows:snap.docs.map(d=>({...decodeWorkRow(d.data()),id:d.id})),cursor:snap.size===100?snap.docs.at(-1).id:null};
  }
  if(action==='list'||action==='get'){
    const kind=String(input.collection||'');const ref=collection(kind);
    if(action==='get'){const row=await visible(db,kind,await get(db,ref.doc(id(input.id))));await check(db);return {row};}
    let q=ref;if(!owner){if(kind==='tasks')q=q.where('assigneeUid','==',user.uid);else if(kind==='submissions'||kind==='reviews')q=q.where('authorUid','==',user.uid);else if(kind==='resources')q=q.where('allowedUids','array-contains',user.uid);else fail(403,'직원에게 허용되지 않은 목록입니다.');}
    q=q.orderBy(FieldPath.documentId()).limit(100);if(input.cursor)q=q.startAfter(id(input.cursor));
    const snap=await q.get();await check(db);
    return {rows:await Promise.all(snap.docs.map(d=>visible(db,kind,{...decodeWorkRow(d.data()),id:d.id}))),cursor:snap.docs.length===100?snap.docs.at(-1).id:null};
  }
  if(action==='draftList'||action==='draftGet'){
    if(owner)fail(403,'대표는 직원 개인 저장소를 조회할 수 없습니다.');
    const ref=db.collection(`employeePrivate/${user.uid}/drafts`);
    if(action==='draftGet'){const row=await get(db,ref.doc(id(input.id)));if(!row||row.workspaceId!==workspaceId)fail(404,'초안을 찾을 수 없습니다.');await check(db);return {row};}
    let q=ref.orderBy(FieldPath.documentId()).limit(100);if(input.cursor)q=q.startAfter(id(input.cursor));const snap=await q.get();await check(db);
    return {rows:snap.docs.map(d=>({...decodeWorkRow(d.data()),id:d.id})).filter(r=>r.workspaceId===workspaceId),cursor:snap.size===100?snap.docs.at(-1).id:null};
  }
  if(action==='preview'){
    if(owner)fail(403,'직원 개인 기록입니다.');const draft=await get(db,db.doc(`employeePrivate/${user.uid}/drafts/${id(input.id)}`));
    if(!draft||draft.workspaceId!==workspaceId)fail(404,'초안을 찾을 수 없습니다.');revision(draft,input.expectedRevision);
    const payload=record(draft);await check(db);return {payload,previewHash:hash(JSON.stringify(payload)),expectedRevision:draft.revision};
  }
  if(action==='mediaInfo'||action==='mediaReadChunk'){
    const media=await get(db,db.doc(`${w}/media/${id(input.id)}`));await mediaAccess(db,media);
    if(action==='mediaInfo'){await check(db);return pick(media,['id','name','type','size','sha256']);}
    const index=Number(input.index);if(!Number.isInteger(index)||index<0||index>=Math.ceil(media.size/CHUNK))fail(400,'조각 번호를 확인해주세요.');
    const chunk=await get(db,db.doc(`${w}/media/${id(media.sourceMediaId||media.id)}/chunks/${String(index).padStart(4,'0')}`));
    if(!chunk)fail(404,'첨부 조각을 찾을 수 없습니다.');await check(db);return {data:chunk.data};
  }
  async function mediaAccess(reader,m){
    if(!m?.ready)fail(404,'업로드가 완료되지 않은 파일입니다.');
    if(m.createdBy===user.uid)return;
    if(m.submissionId){await visible(reader,'submissions',await get(reader,db.doc(`${w}/submissions/${id(m.submissionId)}`)));return;}
    if(m.resourceId){await visible(reader,'resources',await get(reader,db.doc(`${w}/resources/${id(m.resourceId)}`)));return;}
    if(owner&&m.scope==='owner')return;
    fail(403,'이 첨부 파일은 공개되지 않았습니다.');
  }
  const requestId=id(input.requestId),fingerprint=hash(JSON.stringify(input)),receiptRef=db.doc(`${w}/receipts/${hash(user.uid+':'+requestId)}`);
  return db.runTransaction(async tx=>{
    await check(tx);const receipt=await get(tx,receiptRef);if(receipt){if(receipt.fingerprint!==fingerprint)fail(409,'다른 작업에 사용된 요청 ID입니다.');return receipt.result;}
    let result;const writes=[];const set=(ref,data)=>writes.push(()=>tx.set(ref,encodeWorkRow(data,now)));const update=(ref,data)=>writes.push(()=>tx.update(ref,data));
    const refFor=(kind,value)=>collection(kind).doc(id(value));
    const metadata=old=>({schemaVersion:167,workspaceId,createdBy:old?.createdBy||user.uid,createdAt:old?.createdAt||now,updatedBy:user.uid,updatedAt:now,revision:Number(old?.revision||0)+1});
    if(action==='legacyClose'){
      requireOwner();if(input.confirm!==true||input.backupConfirmed!==true)fail(400,'기존 기록 백업과 이전 확인 후 익명 링크의 새 제출을 중지할 수 있습니다.');
      update(workspaceRef,{legacyWritesDisabled:true,legacyClosedAt:now,legacyClosedBy:user.uid});result={ok:true,recordsRetained:true};
    }else if(action==='migrateLegacy'){
      requireOwner();if(input.confirm!==true)fail(400,'원본 보존 이전을 확인해주세요.');
      let original,source;if(input.token){
        const link=await get(tx,db.doc(`labNotebookLinks/${id(input.token)}`));if(link?.ownerUid!==user.uid)fail(403,'다른 소유자의 노트입니다.');
        original=await get(tx,db.doc(`labNotebookLinks/${id(input.token)}/submissions/${id(input.id)}`));source=`labNotebookLinks/${input.token}/submissions/${input.id}`;
      }else{const p=await get(tx,db.doc(`users/${user.uid}/private/main`));original=(decodeArchive(p?.payload)?.workRecords||[]).find(r=>String(r.id)===String(input.id)&&!r.demo);source=`users/${user.uid}/private/main#workRecords:${input.id}`;}
      if(!original)fail(404,'이전할 원본을 찾을 수 없습니다.');const migrationId=hash(source),ref=db.doc(`${w}/legacyRecords/${migrationId}`),existing=await get(tx,ref);
      if(existing&&existing.sourceHash!==hash(JSON.stringify(original)))fail(409,'원본이 변경되었습니다. 기존 이전본은 보존했으며 변경본 검토가 필요합니다.');
      if(existing&&(!input.target||existing.target)){
        if(input.target&&input.target!==existing.target.collection)fail(409,'이미 연결된 이전 대상은 변경할 수 없습니다.');
        result={row:existing,replayed:true};
      }
      else{
        const row=existing?{...existing,...metadata(existing)}:{id:migrationId,originalId:String(original.id),source,sourceHash:hash(JSON.stringify(original)),raw:original,assigneeNeedsConfirmation:true,authorUid:null,...metadata(null)};
        if(input.target){
          if(!['projects','tasks','expenses'].includes(input.target))fail(400,'이전 대상 유형을 확인해주세요.');
          const targetId=/^[\w-]{1,128}$/.test(String(original.id))?String(original.id):'legacy-'+migrationId,ref2=refFor(input.target,targetId),old=await get(tx,ref2);
          if(old)fail(409,'동일 ID의 새 기록이 존재합니다. 기존 기록을 덮어쓰지 않았습니다.');
          const mapped=entity(input.target,input.mapped||{});if(mapped.projectId&&!await get(tx,refFor('projects',mapped.projectId)))fail(400,'이전 대상 프로젝트를 확인해주세요.');
          if(input.target==='tasks'){const member=await get(tx,db.doc(`${w}/members/${id(mapped.assigneeUid)}`));if(!member?.active||input.confirmAssignee!==true)fail(400,'새 담당자를 직접 확인해주세요.');if(mapped.sourceSubmissionId&&!await get(tx,refFor('submissions',mapped.sourceSubmissionId)))fail(400,'후속 업무 원본을 확인해주세요.');row.assigneeNeedsConfirmation=false;}
          row.target={collection:input.target,id:targetId};set(ref2,{...mapped,id:targetId,legacySourceId:migrationId,...metadata(null)});
        }
        set(ref,row);result={row};
      }
    }else if(action==='save'){
      requireOwner();const kind=input.collection,ref=refFor(kind,input.id),old=await get(tx,ref);revision(old,input.expectedRevision);
      if(!['projects','tasks','employees','expenses','purchases','resources'].includes(kind))fail(403,'수정할 수 없는 기록입니다.');
      const row={...old,...entity(kind,input.row),id:ref.id,...metadata(old)};
      if(row.projectId){if(!await get(tx,db.doc(`${w}/projects/${id(row.projectId)}`)))fail(400,'프로젝트를 확인해주세요.');}
      if(kind==='employees'&&old?.uid&&row.email!==old.email)fail(409,'연결된 직원 이메일은 변경할 수 없습니다.');
      if(kind==='tasks'){
        if(row.sourceSubmissionId&&!await get(tx,refFor('submissions',row.sourceSubmissionId)))fail(400,'후속 업무의 원본 제출 기록을 확인해주세요.');
        const member=await get(tx,db.doc(`${w}/members/${id(row.assigneeUid||user.uid)}`));if(!member?.active)fail(400,'현재 소속된 담당자를 선택해주세요.');row.assigneeUid=member.uid;
        for(const rid of row.resourceIds||[])if(!await get(tx,db.doc(`${w}/resources/${id(rid)}`)))fail(400,'자료 ID를 확인해주세요.');
        for(const tid of row.predecessorIds||[])if(tid===row.id||!await get(tx,db.doc(`${w}/tasks/${id(tid)}`)))fail(400,'선행 업무를 확인해주세요.');
        if(row.status==='complete'&&input.confirmComplete!==true)fail(400,'완료 조건을 확인하고 완료를 확정해주세요.');
      }
      if(kind==='resources'&&old)fail(409,'자료 원본을 수정할 수 없습니다. 새 버전을 등록해주세요.');
      if(kind==='resources'){
        const siblings=await tx.get(collection(kind).where('documentId','==',row.documentId||row.id));if(siblings.docs.some(d=>d.data().version===row.version))fail(409,'이미 있는 문서 버전입니다.');
        for(const uid of row.allowedUids||[]){const m=await get(tx,db.doc(`${w}/members/${id(uid)}`));if(!m?.active)fail(400,'현재 소속된 직원만 자료를 허용할 수 있습니다.');}
      }
      const resourceMedia=[];
      for(const mid of row.mediaIds||[]){
        const mref=db.doc(`${w}/media/${id(mid)}`),m=await get(tx,mref);
        if(!m?.ready||m.createdBy!==user.uid||!(m.scope==='owner'||kind==='resources'&&m.scope==='resource'))fail(403,'본인의 완료된 첨부만 연결할 수 있습니다.');
        if(kind==='resources'){
          const copyId=hash(`resource:${row.id}:${mid}`);set(db.doc(`${w}/media/${copyId}`),{...m,id:copyId,sourceMediaId:m.sourceMediaId||mid,scope:'resource',resourceId:row.id});resourceMedia.push(copyId);
        }
      }
      if(kind==='resources')row.mediaIds=resourceMedia;
      set(ref,row);set(ref.collection('history').doc(String(row.revision)),{...row});result={row};
    }else if(action==='invite'){
      requireOwner();const ref=refFor('employees',input.id),profile=await get(tx,ref);if(!profile||profile.uid)fail(400,'아직 연결되지 않은 직원을 선택해주세요.');
      const token=crypto.randomBytes(32).toString('hex'),digest=hash(token),expiresAt=now+48*3600000;
      set(db.doc(`workInvitations/${digest}`),{workspaceId,employeeId:profile.id,email:profile.email,expiresAt,createdAt:now,createdBy:user.uid,usedAt:0,revoked:false});
      update(ref,{inviteHash:digest,updatedAt:now,revision:(profile.revision||0)+1});result={token,expiresAt,employeeId:profile.id};
    }else if(action==='revoke'||action==='restoreAccess'){
      requireOwner();const ref=refFor('employees',input.id),profile=await get(tx,ref);if(!profile)fail(404,'직원을 찾을 수 없습니다.');
      if(profile.inviteHash)update(db.doc(`workInvitations/${profile.inviteHash}`),{revoked:true});
      if(profile.uid)update(db.doc(`${w}/members/${id(profile.uid)}`),{active:action==='restoreAccess',changedAt:now,changedBy:user.uid});
      update(ref,{active:action==='restoreAccess',updatedAt:now,revision:(profile.revision||0)+1});result={ok:true};
    }else if(action==='draftSave'){
      if(owner)fail(403,'직원 개인 기록입니다.');const ref=db.doc(`employeePrivate/${user.uid}/drafts/${id(input.id)}`),old=await get(tx,ref);revision(old,input.expectedRevision);
      const row={...record(input.row,{draft:true}),id:ref.id,authorUid:user.uid,...metadata(old),lastSubmissionId:old?.lastSubmissionId||'',version:old?.version||0};set(ref,row);result={row};
    }else if(action==='submit'){
      if(owner)fail(403,'직원만 제출할 수 있습니다.');const ref=db.doc(`employeePrivate/${user.uid}/drafts/${id(input.id)}`),draft=await get(tx,ref);if(!draft)fail(404,'초안을 먼저 저장해주세요.');revision(draft,input.expectedRevision);
      const payload=record(draft);if(hash(JSON.stringify(payload))!==input.previewHash)fail(409,'제출할 내용이 변경되었습니다. 다시 확인해주세요.');
      let task=null;if(payload.taskId){task=await get(tx,refFor('tasks',payload.taskId));if(!task||task.assigneeUid!==user.uid||['complete','cancelled'].includes(task.status))fail(403,'현재 본인에게 배정된 업무만 제출할 수 있습니다.');if(payload.projectId!==String(task.projectId||''))fail(403,'배정된 프로젝트와 일치하지 않습니다.');}
      else if(payload.projectId)fail(403,'미배정 활동은 프로젝트 없이 검토 요청으로 제출해주세요.');
      let protocolSnapshot=null;if(payload.protocolId){const protocol=await get(tx,refFor('resources',payload.protocolId));await visible(tx,'resources',protocol);if(String(protocol.version)!==String(payload.protocolVersion))fail(409,'프로토콜 버전을 확인해주세요.');protocolSnapshot=protocol;}
      const version=Number(draft.version||0)+1,sid=hash(`${user.uid}:${draft.id}:${version}`),submissionRef=refFor('submissions',sid);
      const mediaIds=[];for(const mid of payload.mediaIds){const m=await get(tx,db.doc(`${w}/media/${mid}`));if(!m?.ready||m.createdBy!==user.uid)fail(403,'첨부의 소유권·업로드 상태를 확인해주세요.');const copyId=hash(sid+':'+mid);set(db.doc(`${w}/media/${copyId}`),{...m,id:copyId,sourceMediaId:m.sourceMediaId||mid,submissionId:sid,scope:'submission'});mediaIds.push(copyId);}
      const author=await get(tx,refFor('employees',ctx.member.employeeId));
      const row={...payload,mediaIds,protocolSnapshot,id:sid,authorUid:user.uid,authorName:author?.name||user.email,version,draftId:draft.id,submittedAt:now,...metadata(null)};
      set(submissionRef,row);update(ref,{version,lastSubmissionId:sid,updatedAt:now,revision:draft.revision+1});
      if(task)update(refFor('tasks',task.id),{status:'submitted',submissionIds:[...new Set([...(task.submissionIds||[]),sid])],revision:(task.revision||0)+1,updatedAt:now});result={row};
    }else if(action==='review'){
      requireOwner();const submission=await get(tx,refFor('submissions',input.id));if(!submission)fail(404,'제출본을 찾을 수 없습니다.');
      if(!['reviewed','revision'].includes(input.status))fail(400,'검토 상태를 선택해주세요.');const comment=text(input.comment||'',20000);if(input.status==='revision'&&!comment)fail(400,'보완 의견을 작성해주세요.');
      const ref=refFor('reviews',submission.id),old=await get(tx,ref);revision(old,input.expectedRevision);
      const row={id:ref.id,submissionId:submission.id,authorUid:submission.authorUid,status:input.status,comment,...metadata(old)};set(ref,row);set(ref.collection('history').doc(String(row.revision)),row);
      if(submission.taskId&&input.status==='revision'){const tref=refFor('tasks',submission.taskId),task=await get(tx,tref);if(task)update(tref,{status:'revision',revision:(task.revision||0)+1,updatedAt:now});}result={row};
    }else if(action==='taskProgress'){
      if(owner)fail(403,'직원 진행 기록입니다.');const ref=refFor('tasks',input.id),old=await get(tx,ref);if(!old||old.assigneeUid!==user.uid)fail(403,'배정된 업무가 아닙니다.');revision(old,input.expectedRevision);
      if(!['active','blocked'].includes(input.status)||['complete','cancelled'].includes(old.status))fail(400,'현재 변경할 수 없는 상태입니다.');const reason=text(input.blockedReason||'',10000);if(input.status==='blocked'&&!reason)fail(400,'진행 불가 사유를 작성해주세요.');
      const row={...old,status:input.status,blockedReason:reason,...metadata(old)};set(ref,row);set(ref.collection('history').doc(String(row.revision)),row);result={row:pick(row,TASK_PUBLIC)};
    }else if(action==='mediaBegin'){
      const size=Number(input.size),type=String(input.type||'');if(!Number.isInteger(size)||size<=0||size>MAX_FILE||!MIME.has(type))fail(400,'사진·PDF·MP4·WebM·텍스트 파일은 25MB 이하로 첨부해주세요.');
      const mid=hash(user.uid+':'+requestId),row={id:mid,name:text(input.name,180),type,size,createdBy:user.uid,createdAt:now,ready:false,scope:owner?'owner':'private'};set(db.doc(`${w}/media/${mid}`),row);result={id:mid,chunkBytes:CHUNK};
    }else if(action==='mediaChunk'){
      const ref=db.doc(`${w}/media/${id(input.id)}`),m=await get(tx,ref);if(!m||m.createdBy!==user.uid||m.ready)fail(403,'변경할 수 없는 첨부입니다.');const number=Number(input.index),bytes=Buffer.from(String(input.data||''),'base64');
      if(!Number.isInteger(number)||number<0||number>=Math.ceil(m.size/CHUNK)||bytes.length!==Math.min(CHUNK,m.size-number*CHUNK))fail(400,'첨부 조각의 길이를 확인해주세요.');set(ref.collection('chunks').doc(String(number).padStart(4,'0')),{data:bytes.toString('base64')});result={ok:true};
    }else if(action==='mediaFinish'){
      const ref=db.doc(`${w}/media/${id(input.id)}`),m=await get(tx,ref);if(!m||m.createdBy!==user.uid||m.ready)fail(403,'변경할 수 없는 첨부입니다.');const snap=await tx.get(ref.collection('chunks').orderBy(FieldPath.documentId())),bytes=Buffer.concat(snap.docs.map(d=>Buffer.from(d.data().data,'base64')));
      if(bytes.length!==m.size)fail(409,'업로드가 완료되지 않았습니다.');const header=bytes.subarray(0,16),magic=m.type==='image/png'?header.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')):m.type==='image/jpeg'?header[0]===255&&header[1]===216:m.type==='image/webp'?header.toString('ascii',0,4)==='RIFF'&&header.toString('ascii',8,12)==='WEBP':m.type==='application/pdf'?header.toString('ascii',0,5)==='%PDF-':m.type==='video/mp4'?header.toString('ascii',4,8)==='ftyp':m.type==='video/webm'?header.subarray(0,4).equals(Buffer.from('1a45dfa3','hex')):!bytes.includes(0);
      if(!magic)fail(400,'파일 내용과 형식이 일치하지 않습니다.');update(ref,{ready:true,sha256:hash(bytes),finishedAt:now});result={id:m.id,ready:true};
    }else fail(400,'지원하지 않는 작업입니다.');
    for(const write of writes)write();tx.set(receiptRef,{uid:user.uid,fingerprint,result,createdAt:now});return result;
  });
}

export default async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');res.setHeader('X-Content-Type-Options','nosniff');
  try{
    if(req.method!=='POST')fail(405,'POST 요청만 지원합니다.');
    const origin=req.headers.origin,allowed=process.env.PUBLIC_APP_URL?.replace(/\/$/,'');if(origin&&(!allowed||origin!==allowed))fail(403,'요청 출처를 확인해주세요.');
    const token=String(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];if(!token)fail(401,'로그인이 필요합니다.');
    const {db,auth}=services(),user=await auth.verifyIdToken(token,true);
    let body=req.body;if(typeof body==='string')body=JSON.parse(body);if(!body){const chunks=[];let bytes=0;for await(const c of req){bytes+=c.length;if(bytes>900000)fail(413,'요청이 너무 큽니다.');chunks.push(c);}body=JSON.parse(Buffer.concat(chunks).toString());}
    const result=await dispatch(db,user,jsonSafe(body));
    if(result.binary){res.setHeader('Content-Type','application/octet-stream');res.setHeader('Content-Disposition',`attachment; filename*=UTF-8''${encodeURIComponent(result.name)}`);res.statusCode=200;res.end(result.binary);return;}
    res.setHeader('Content-Type','application/json; charset=utf-8');res.statusCode=200;res.end(JSON.stringify(result));
  }catch(e){const status=Number(e.status)||((String(e.code||'').startsWith('auth/'))?401:503);res.statusCode=status;res.setHeader('Content-Type','application/json; charset=utf-8');res.end(JSON.stringify({error:status===503?'Work 서버 설정 또는 연결을 확인해주세요. 저장되지 않았습니다.':e.message}));}
}
