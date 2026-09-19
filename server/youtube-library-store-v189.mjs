import {createHash} from 'node:crypto';
import {decodeArchive} from '../archive-codec-v168.js';
import {normalizeYoutubeURL} from '../youtube-text-v189.js';

export const LIBRARY_DOCUMENT='youtube-library-v189';
export const MAX_LIBRARY_BYTES=700000;
export const MAX_FIRESTORE_DOCUMENT_BYTES=900000;
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const string=(v,max,label)=>{if(typeof v!=='string'||v.length>max)fail(400,`${label}의 길이나 형식을 확인해주세요.`);return v.trim();};
const id=v=>{if(typeof v!=='string'||!/^[A-Za-z0-9_-]{11}$/.test(v))fail(400,'유튜브 링크를 확인해주세요.');return v;};
const revision=v=>{if(!Number.isSafeInteger(v)||v<0)fail(400,'저장 버전을 확인해주세요.');return v;};
const nowRow=row=>({...row,thumbnail:`https://i.ytimg.com/vi/${row.videoId}/hqdefault.jpg`});

// Firestore charges map overhead even for short sentence objects. JSON length
// alone does not bound its document size: https://firebase.google.com/docs/firestore/storage-size
export function firestoreDocumentBytes(path,value){
  const bytes=text=>Buffer.byteLength(text,'utf8')+1;
  function size(item,depth){
    if(item===null)return 1;
    if(typeof item==='string')return bytes(item);
    if(typeof item==='boolean')return 1;
    if(typeof item==='number')return Number.isFinite(item)?8:Infinity;
    if(depth>20)return Infinity;
    if(Array.isArray(item))return item.reduce((sum,child)=>sum+size(child,depth+1),0);
    if(plain(item))return 32+Object.entries(item).reduce((sum,[key,child])=>sum+bytes(key)+size(child,depth+1),0);
    return Infinity;
  }
  return path.split('/').reduce((sum,part)=>sum+bytes(part),16)+size(value,0);
}

export function normalizePatch(videoId,value){
  if(!plain(value))fail(400,'저장할 내용을 확인해주세요.');
  const parsed=normalizeYoutubeURL(string(value.url,2048,'링크'));
  if(parsed.videoId!==videoId)fail(400,'영상과 링크가 일치하지 않습니다.');
  const title=string(value.title,180,'제목');if(!title)fail(400,'제목을 입력해주세요.');
  if(!['recipe','language','other'].includes(value.category))fail(400,'분류를 선택해주세요.');
  if(!['captions','manual','none'].includes(value.source))fail(400,'문장 출처를 확인해주세요.');
  if(!Array.isArray(value.sentences)||value.sentences.length>200)fail(400,'문장은 200개까지 저장할 수 있습니다.');
  let length=0;
  const sentences=value.sentences.map(s=>{
    if(!plain(s))fail(400,'문장 형식을 확인해주세요.');
    const text=string(s.text,4000,'문장');if(!text)fail(400,'빈 문장을 지워주세요.');length+=text.length;
    const start=s.start==null?null:Number(s.start);if(start!==null&&(!Number.isFinite(start)||start<0||start>86400))fail(400,'문장의 영상 시간을 확인해주세요.');
    return{start:start===null?null:Math.round(start*1000)/1000,text};
  });
  if(length>32000)fail(413,'문장은 32,000자까지 저장할 수 있습니다.');
  return{url:parsed.url,title,category:value.category,notes:string(value.notes??'',2000,'메모'),source:sentences.length?value.source:'none',language:string(value.language??'',32,'언어'),sentences};
}
function readLibrary(snapshot,uid){
  if(!snapshot.exists)return{rows:[],receipts:[],revision:0};
  const doc=snapshot.data();
  if(doc.ownerUid!==uid||doc.schemaVersion!==189)fail(409,'보관함 형식을 확인할 수 없습니다. 원본을 유지했습니다.');
  const payload=decodeArchive(doc.payload);
  if(!plain(payload)||!Array.isArray(payload.rows)||!Array.isArray(payload.receipts)||!Number.isSafeInteger(payload.revision)||payload.revision<0)fail(409,'보관함을 읽을 수 없습니다. 원본을 유지했습니다.');
  return payload;
}
export async function libraryDispatch(db,user,input,{now=Date.now()}={}){
  const uid=user?.uid;if(typeof uid!=='string'||!uid||uid.includes('/')||uid.length>128)fail(401,'로그인이 필요합니다.');
  if(!plain(input))fail(400,'요청 형식을 확인해주세요.');
  const ref=db.doc(`users/${uid}/private/${LIBRARY_DOCUMENT}`);
  if(input.action==='list'){
    const payload=readLibrary(await ref.get(),uid),query=string(input.query??'',80,'검색어').toLocaleLowerCase(),category=input.category??'all';
    if(!['all','recipe','language','other'].includes(category))fail(400,'분류를 확인해주세요.');
    let cursor=null;if(input.cursor){const match=/^(\d{1,16}):([A-Za-z0-9_-]{11})$/.exec(input.cursor);if(!match)fail(400,'목록 위치를 확인해주세요.');cursor={updatedAt:Number(match[1]),videoId:match[2]};}
    const filtered=payload.rows.filter(row=>(category==='all'||row.category===category)&&(!query||[row.title,row.notes,...row.sentences.map(s=>s.text)].join(' ').toLocaleLowerCase().includes(query)));
    const sorted=filtered.filter(row=>!cursor||row.updatedAt<cursor.updatedAt||(row.updatedAt===cursor.updatedAt&&row.videoId>cursor.videoId)).sort((a,b)=>b.updatedAt-a.updatedAt||(a.videoId<b.videoId?-1:a.videoId>b.videoId?1:0));
    const rows=sorted.slice(0,20),last=rows.at(-1);return{rows:rows.map(nowRow),total:filtered.length,libraryRevision:payload.revision,cursor:sorted.length>20?`${last.updatedAt}:${last.videoId}`:null};
  }
  if(!['save','delete'].includes(input.action))fail(400,'지원하지 않는 요청입니다.');
  const videoId=id(input.videoId),expectedRevision=revision(input.expectedRevision),requestId=string(input.requestId,80,'요청 ID');
  if(!/^[A-Za-z0-9_-]{16,80}$/.test(requestId))fail(400,'저장 요청을 다시 열어주세요.');
  const patch=input.action==='save'?normalizePatch(videoId,input.patch):null;
  const expectedLibraryRevision=input.action==='save'&&expectedRevision===0?revision(input.expectedLibraryRevision):null;
  const fingerprint=createHash('sha256').update(JSON.stringify({action:input.action,videoId,expectedRevision,expectedLibraryRevision,patch})).digest('hex');
  return db.runTransaction(async tx=>{
    const payload=readLibrary(await tx.get(ref),uid),old=payload.rows.find(row=>row.videoId===videoId),receipt=payload.receipts.find(r=>r.id===requestId);
    if(receipt){if(receipt.fingerprint!==fingerprint)fail(409,'이미 사용된 저장 요청입니다. 다시 확인해주세요.');if(input.action==='delete')return{ok:true,libraryRevision:payload.revision};if(!old)fail(409,'이 기록은 이후 삭제되었습니다. 목록을 새로고침해주세요.');return{row:nowRow(old),alreadyApplied:true,libraryRevision:payload.revision};}
    if(expectedLibraryRevision!==null&&expectedLibraryRevision!==payload.revision)fail(409,'보관함이 변경되었습니다. 새로고침한 뒤 다시 저장해주세요.');
    if((old?.revision??0)!==expectedRevision)fail(409,'다른 화면에서 변경된 기록입니다. 목록을 새로고침한 뒤 다시 수정해주세요.');
    if(input.action==='delete'&&!old)fail(404,'이미 삭제된 기록입니다.');
    const nextRevision=payload.revision+1;
    const row=input.action==='save'?{...patch,videoId,revision:nextRevision,createdAt:old?.createdAt??now,updatedAt:now}:null;
    const rows=payload.rows.filter(r=>r.videoId!==videoId);if(row)rows.push(row);
    if(rows.length>500)fail(413,'링크는 500개까지 보관할 수 있습니다. 사용하지 않는 링크를 정리해주세요.');
    const receipts=[...payload.receipts.slice(-31),{id:requestId,fingerprint}];
    const next={rows,receipts,revision:nextRevision};if(Buffer.byteLength(JSON.stringify(next),'utf8')>MAX_LIBRARY_BYTES)fail(413,'보관함의 텍스트 용량이 가득 찼습니다. 불필요한 문장이나 메모를 정리해주세요.');
    const document={ownerUid:uid,schemaVersion:189,payload:next,updatedAt:now};
    if(firestoreDocumentBytes(ref.path,document)>MAX_FIRESTORE_DOCUMENT_BYTES)fail(413,'보관함의 저장 용량이 가득 찼습니다. 불필요한 문장이나 메모를 정리해주세요.');
    tx.set(ref,document);
    return row?{row:nowRow(row),libraryRevision:nextRevision}:{ok:true,libraryRevision:nextRevision};
  });
}
