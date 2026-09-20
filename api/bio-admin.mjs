import {bioAdminDispatch} from '../server/bio-admin-store-v192.mjs';
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
async function bodyOf(req){if(req.body){const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(Buffer.byteLength(raw)>100000)fail(413,'입력 내용이 너무 큽니다.');return JSON.parse(raw);}let bytes=0;const chunks=[];for await(const chunk of req){bytes+=chunk.length;if(bytes>100000)fail(413,'입력 내용이 너무 큽니다.');chunks.push(chunk);}return JSON.parse(Buffer.concat(chunks).toString());}
export function createHandler({getServices=async()=>{const [{services},{FieldValue}]=await Promise.all([import('../server/firebase-admin.mjs'),import('firebase-admin/firestore')]);return {...services(),commitTimestamp:()=>FieldValue.serverTimestamp()};},dispatch=bioAdminDispatch}={}){return async(req,res)=>{
 res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');
 try{
  if(req.method==='GET'&&new URL(req.url,'https://request.invalid').searchParams.get('action')==='health'){res.statusCode=200;return res.end(JSON.stringify({ok:true,version:192,requiresAuth:true,automaticRefresh:false}));}
  if(req.method!=='POST')fail(405,'POST 요청만 지원합니다.');const origin=req.headers.origin;if(origin&&origin!==process.env.PUBLIC_APP_URL?.replace(/\/$/,''))fail(403,'요청 출처를 확인해주세요.');
  const token=String(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];if(!token)fail(401,'로그인이 필요합니다.');
  const input=await bodyOf(req);if(!input||typeof input!=='object'||Array.isArray(input))fail(400,'요청 형식을 확인해주세요.');
  const {db,auth,commitTimestamp}=await getServices(),user=await auth.verifyIdToken(token,true),output=await dispatch(db,user,input,{commitTimestamp});res.statusCode=200;res.end(JSON.stringify(output));
 }catch(error){
  const quota=Number(error.code)===8||/resource.?exhausted|quota.*exceed/i.test(String(error.code||'')+' '+String(error.message||''));
  const status=quota?503:Number(error.status)||(String(error.code||'').startsWith('auth/')?401:error instanceof SyntaxError?400:503);res.statusCode=status;if(quota)res.setHeader('Retry-After','1800');
  res.end(JSON.stringify({error:quota?'Firebase 무료 사용량 한도에 도달했습니다. 기존 기록과 입력은 유지됩니다.':status===503?'연결 또는 저장을 완료하지 못했습니다. 기존 기록과 입력은 유지됩니다.':error.message,...(quota?{code:'resource-exhausted'}:{})}));
 }
};}
export default createHandler();
