import {services} from '../server/firebase-admin.mjs';
import {compactForUser} from '../server/storage-v168.mjs';
import {fail} from '../server/work-model.mjs';
export default async function handler(req,res){
  res.setHeader('Cache-Control','private, no-store');res.setHeader('Vary','Authorization');res.setHeader('Content-Type','application/json; charset=utf-8');
  try {
    if(req.method!=='POST')fail(405,'POST 요청만 지원합니다.');
    if(req.headers.origin&&req.headers.origin!==process.env.PUBLIC_APP_URL?.replace(/\/$/,''))fail(403,'요청 출처를 확인해주세요.');
    const token=String(req.headers.authorization||'').match(/^Bearer (.+)$/)?.[1];if(!token)fail(401,'로그인이 필요합니다.');
    const {db,auth}=services(),user=await auth.verifyIdToken(token,true);
    const body=typeof req.body==='string'?JSON.parse(req.body):req.body;
    if(body?.action!=='compact'||body?.storageVersion!==168)fail(400,'최신 앱에서 압축을 요청해주세요.');
    const result=await compactForUser(db,user);res.statusCode=200;res.end(JSON.stringify(result));
  } catch(error){res.statusCode=error.status||503;res.end(JSON.stringify({error:error.status?error.message:'압축을 완료하지 못했습니다. 원본은 삭제하지 않았습니다.'}));}
}
