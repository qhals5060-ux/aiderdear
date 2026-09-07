import {FieldValue,FieldPath} from 'firebase-admin/firestore';
import {randomUUID} from 'node:crypto';
import {encodeArchive,encodeStoredPayload,decodeArchive,cutoffThreeMonths} from '../archive-codec-v168.js';
import {OWNER_EMAILS,fail,id,COLLECTIONS} from './work-model.mjs';

const BODY='compressedBodyV168';
const bodyFields=['record','notes','personalMemo','purpose','hypothesis','procedure','deviations','observations','result','interpretation','issues','rawData','qc','comment','sections','deliveries','description','requirements','milestones','checklist','protocol','materials','sourceData'];
export function decodeWorkRow(raw) {
  if(!raw||!Object.hasOwn(raw,BODY))return raw;
  const restored=decodeArchive(raw[BODY]);
  if(!restored||!restored.body||typeof restored.body!=='object')throw Error('Work 압축 원본을 확인해주세요.');
  const copy={...raw};delete copy[BODY];return {...copy,...restored.body};
}
export function encodeWorkRow(raw,now=Date.now()) {
  const row=decodeWorkRow(raw);if(!row||typeof row!=='object')return row;
  const stamp=Number(row.updatedAt||row.createdAt||0);if(!stamp||stamp>=cutoffThreeMonths(now))return row;
  const body=Object.fromEntries(bodyFields.filter(k=>Object.hasOwn(row,k)).map(k=>[k,row[k]]));
  if(!Object.keys(body).length)return row;
  const packed=encodeArchive({updatedAt:stamp,body},{now});
  if(!Object.hasOwn(packed,'__aiderlogQuarterArchive168'))return row;
  const next={...row};for(const key of Object.keys(body))delete next[key];next[BODY]=packed;
  if(JSON.stringify(decodeWorkRow(next))===JSON.stringify(row))return next;
  // Property order is not semantic; preserve all values and verify by key.
  if(Object.keys(row).every(k=>JSON.stringify(decodeWorkRow(next)[k])===JSON.stringify(row[k])))return next;
  throw Error('Work 압축 복원 검사가 실패했습니다.');
}
const size=v=>Buffer.byteLength(JSON.stringify(v));
export async function compactForUser(db,user,{now=Date.now()}={}) {
  const uid=id(user.uid);if(!user.email_verified)fail(403,'이메일 확인이 필요합니다.');
  const identity=(await db.doc(`workIdentities/${uid}`).get()).data();
  const employee=identity?.kind==='employee',owner=!employee&&OWNER_EMAILS.has(String(user.email||'').toLowerCase());
  const refs=[];let pairId='';
  if(employee) {
    const member=(await db.doc(`workspaces/${id(identity.workspaceId)}/members/${uid}`).get()).data();
    if(!member?.active||member.role!=='employee')fail(403,'연결된 계정의 권한이 없습니다.');
  } else {
    for(const type of ['app','private','schedule','emotion'])refs.push(db.doc(`users/${uid}/${type}/main`));
    const membership=(await db.doc(`pairMemberships/${uid}`).get()).data();
    if(membership?.status==='active'&&membership.pairId){
      const pair=(await db.doc(`pairs/${id(membership.pairId)}`).get()).data();
      if(pair?.status==='active'&&pair.memberUids?.includes(uid)){
        pairId=id(membership.pairId);refs.push(db.doc(`pairs/${pairId}/app/main`),db.doc(`pairs/${pairId}/schedules/${uid}`),db.doc(`pairs/${pairId}/emotions/${uid}`));
      }
    }
  }
  const stateRef=db.doc(`users/${uid}/storageMaintenance/v168`),state=(await stateRef.get()).data();
  const quarter=`${new Date(now).getUTCFullYear()}-Q${Math.floor(new Date(now).getUTCMonth()/3)+1}`;
  if(state?.completedQuarter===quarter)return {...state,alreadyComplete:true};
  const lease=randomUUID();
  const claimed=await db.runTransaction(async tx=>{
    const latest=(await tx.get(stateRef)).data();
    if(latest?.completedQuarter===quarter||Number(latest?.leaseUntil||0)>now)return false;
    tx.set(stateRef,{lease,leaseUntil:now+60000},{merge:true});return true;
  });
  if(!claimed)return {busy:true,done:false};
  try {
  const totals={checked:0,compressed:0,savedBytes:0,mediaUnchanged:true};
  async function payload(ref) {
    const result=await db.runTransaction(async tx=>{
      const current=await tx.get(ref);if(!current.exists||current.data().payload==null)return null;
      // Recheck pair membership inside the committing transaction.
      if(ref.path.startsWith('pairs/')){const pair=await tx.get(db.doc(`pairs/${pairId}`));if(pair.data()?.status!=='active'||!pair.data()?.memberUids?.includes(uid))fail(403,'연결이 변경되어 압축을 중단했습니다.');}
      const raw=current.data().payload,packed=encodeStoredPayload(raw,{now}),saved=size(raw)-size(packed);
      if(saved<=0)return {saved:0};
      tx.update(ref,{payload:packed,storageVersion:168,formatWrittenAt:FieldValue.serverTimestamp(),compressedAt:FieldValue.serverTimestamp(),compressionQuarter:quarter});
      return {saved};
    });
    if(result){totals.checked++;if(result.saved>0){totals.compressed++;totals.savedBytes+=result.saved;}}
  }
  for(const ref of refs)await payload(ref);
  // Bounded resumable scan. No collectionGroup or scan of another user's drafts.
  let ownWorkspace=false;
  if(owner){const [space,member]=await Promise.all([db.doc(`workspaces/${uid}`).get(),db.doc(`workspaces/${uid}/members/${uid}`).get()]);
    if(space.exists){if(space.data().ownerUid!==uid||member.data()?.role!=='owner'||!member.data()?.active)fail(403,'업무 공간 권한을 확인해주세요.');ownWorkspace=true;}}
  const groups=ownWorkspace?COLLECTIONS.map(k=>`workspaces/${uid}/${k}`):[];
  if(employee)groups.push(`employeePrivate/${uid}/drafts`);
  const cursors={...(state?.quarter===quarter?state.cursors||{}:{})};let budget=100,done=true;
  for(const path of groups){
    if(cursors[path]==='done')continue;if(budget<=0){done=false;break;}
    const pageLimit=Math.min(25,budget);
    let q=db.collection(path).orderBy(FieldPath.documentId()).limit(pageLimit);if(cursors[path])q=q.startAfter(cursors[path]);
    const snap=await q.get();
    for(const document of snap.docs){
      const result=await db.runTransaction(async tx=>{
        const current=await tx.get(document.ref);if(!current.exists)return 0;
        if(employee){const member=await tx.get(db.doc(`workspaces/${id(identity.workspaceId)}/members/${uid}`));if(!member.data()?.active)fail(403,'계정 권한이 회수되어 압축을 중단했습니다.');}
        const raw=current.data(),packed=encodeWorkRow(raw,now),saved=size(raw)-size(packed);
        if(saved>0)tx.set(document.ref,packed);return Math.max(0,saved);
      });
      totals.checked++;if(result){totals.compressed++;totals.savedBytes+=result;}budget--;
    }
    if(snap.size<pageLimit)cursors[path]='done';else {cursors[path]=snap.docs.at(-1)?.id||'done';done=false;}
  }
  if(groups.some(path=>cursors[path]!=='done'))done=false;
  const result={...totals,cursors,checkedAt:now,quarter,done,completedQuarter:done?quarter:'',savedBytesTotal:Number(state?.savedBytesTotal||0)+totals.savedBytes};
  await db.runTransaction(async tx=>{const latest=(await tx.get(stateRef)).data();if(latest?.lease!==lease)throw Error('다른 압축 실행으로 변경되었습니다. 다음에 이어집니다.');tx.set(stateRef,{...result,leaseUntil:0},{merge:true});});return result;
  } finally {
    await db.runTransaction(async tx=>{const current=(await tx.get(stateRef)).data();if(current?.lease===lease)tx.update(stateRef,{leaseUntil:0});});
  }
}
