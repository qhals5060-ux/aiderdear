import crypto from 'node:crypto';
import {fail,safeId,text} from './estate-model.mjs';
export const CHUNK_BYTES=384*1024,MAX_FILE=12*1024*1024;
export const hash=value=>crypto.createHash('sha256').update(value).digest('hex');
const MIME=new Set(['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm','text/plain','text/csv']);
export function beginMedia(input,uid,now){
 const size=Number(input.size),type=String(input.type||'');
 if(!Number.isInteger(size)||size<1||size>MAX_FILE||!MIME.has(type))fail(400,'사진, PDF, MP4, WebM, 텍스트는 12MB 이하로 첨부해주세요. 사진은 압축 후 전송합니다.');
 if(!['properties','deals'].includes(input.entityCollection))fail(400,'매물 또는 거래에 파일을 첨부해주세요.');
 return {id:input.id?safeId(input.id):hash(uid+':'+safeId(input.requestId)),uploadNonce:crypto.randomUUID(),ownerUid:uid,entityCollection:input.entityCollection,entityId:safeId(input.entityId),name:text(input.name,180)||'첨부파일',type,size,chunkBytes:CHUNK_BYTES,ready:false,refs:[],shareRefs:[],createdAt:now,updatedAt:now};
}
export function chunkData(media,input){
 const index=Number(input.index),data=String(input.data||'');
 if(!Number.isInteger(index)||index<0||index>=Math.ceil(media.size/CHUNK_BYTES)||!data||data.length>CHUNK_BYTES*4/3+4||!/^[A-Za-z0-9+/]*={0,2}$/.test(data))fail(400,'첨부 조각을 확인해주세요.');
 const bytes=Buffer.from(data,'base64');
 if(bytes.toString('base64')!==data||bytes.length!==Math.min(CHUNK_BYTES,media.size-index*CHUNK_BYTES))fail(400,'첨부 조각의 길이가 맞지 않습니다.');
 return {index,data:bytes.toString('base64')};
}
export function finishMedia(media,chunks){
 const expected=Math.ceil(media.size/CHUNK_BYTES);
 if(chunks.length!==expected||chunks.some((x,i)=>x.id!==String(i).padStart(4,'0')))fail(409,'첨부 전송이 아직 끝나지 않았습니다.');
 const bytes=Buffer.concat(chunks.map(x=>Buffer.from(x.data,'base64'))),h=bytes.subarray(0,16);
 if(bytes.length!==media.size)fail(409,'첨부 크기가 맞지 않습니다. 다시 전송해주세요.');
 const magic=media.type==='image/png'?h.subarray(0,8).equals(Buffer.from('89504e470d0a1a0a','hex')):media.type==='image/jpeg'?h[0]===255&&h[1]===216&&h[2]===255:media.type==='image/webp'?h.toString('ascii',0,4)==='RIFF'&&h.toString('ascii',8,12)==='WEBP':media.type==='application/pdf'?h.toString('ascii',0,5)==='%PDF-':media.type==='video/mp4'?h.toString('ascii',4,8)==='ftyp':media.type==='video/webm'?h.subarray(0,4).equals(Buffer.from('1a45dfa3','hex')):!bytes.includes(0)&&!/^\s*<(?:!doctype|html|script|svg)/i.test(bytes.toString('utf8',0,100));
 if(!magic)fail(400,'파일 내용과 확장 형식이 일치하지 않습니다.');
 return {sha256:hash(bytes),ready:true};
}
export function mediaInfo(media){return Object.fromEntries(['id','name','type','size','sha256','chunkBytes','ready'].map(k=>[k,media[k]??null]));}
