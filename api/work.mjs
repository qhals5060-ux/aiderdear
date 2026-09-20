/* WORK is retired. Keep this endpoint for installed older clients without reading
 * authentication, initializing Firebase, or touching existing workspace records. */
export default function handler(_req,res){
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.statusCode=410;
  res.end(JSON.stringify({error:'WORK 페이지는 더 이상 사용하지 않습니다.',code:'work-retired'}));
}
