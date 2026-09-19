import {libraryDispatch} from '../server/youtube-library-store-v189.mjs';
import {importVideo} from '../server/youtube-source-v189.mjs';

const importBudget=new Map();
function fail(status,message){throw Object.assign(new Error(message),{status});}
function rateLimit(uid){
  const now=Date.now();for(const [key,row]of importBudget)if(row.until<=now)importBudget.delete(key);
  const row=importBudget.get(uid)||{count:0,until:now+15*60*1000};if(row.count>=20)fail(429,'잠시 뒤 다시 불러와주세요. 지금은 텍스트를 붙여넣어 정리할 수 있습니다.');
  if(importBudget.size>=3000&&!importBudget.has(uid))fail(429,'잠시 뒤 다시 시도해주세요.');row.count++;importBudget.set(uid,row);
}
async function readBody(req){
  if(req.body){const text=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(text)>160000)fail(413,'내용이 너무 깁니다.');try{return JSON.parse(text);}catch{fail(400,'요청 형식을 확인해주세요.');}}
  const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>160000)fail(413,'내용이 너무 깁니다.');chunks.push(chunk);}try{return JSON.parse(Buffer.concat(chunks).toString());}catch{fail(400,'요청 형식을 확인해주세요.');}
}
export function createHandler({getServices=async()=> (await import('../server/firebase-admin.mjs')).services(),loadVideo=importVideo,dispatch=libraryDispatch}={}){
 return async function handler(req,res){
  res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-AiderLog-YouTube','189');
  try{
    if(req.method==='GET'&&new URL(req.url,'https://request.invalid').searchParams.get('action')==='health'){res.statusCode=200;res.end(JSON.stringify({ok:true,version:189,requiresAuth:true,captions:'best-effort-public'}));return;}
    if(req.method!=='POST')fail(405,'POST 요청만 지원합니다.');
    const origin=req.headers.origin,allowed=process.env.PUBLIC_APP_URL?.replace(/\/$/,'');if(origin&&origin!==allowed)fail(403,'요청 출처를 확인해주세요.');
    const token=String(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];if(!token)fail(401,'로그인이 필요합니다.');
    const {db,auth}=await getServices(),user=await auth.verifyIdToken(token,true),body=await readBody(req);
    if(!body||typeof body!=='object'||Array.isArray(body))fail(400,'요청 형식을 확인해주세요.');
    if(body.ownerUid!==user.uid)fail(401,'로그인 계정이 변경되었습니다. 다시 열어주세요.');
    let result;
    if(body.action==='import'){rateLimit(user.uid);result=await loadVideo(body.url);}
    else result=await dispatch(db,user,body);
    res.statusCode=200;res.end(JSON.stringify(result));
  }catch(error){
    const status=Number(error.status)||(String(error.code||'').startsWith('auth/')?401:['invalid_url','invalid_text','too_long','too_many_sentences'].includes(error.code)?400:503);
    res.statusCode=status;res.end(JSON.stringify({error:status===503?'서버 연결을 확인해주세요. 입력한 내용은 그대로 유지됩니다.':error.message}));
  }
 };
}
export default createHandler();
