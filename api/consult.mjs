// v193: retired endpoint. No authentication lookup or database access.
export default function handler(_req,res) {
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  res.statusCode=410;
  res.end(JSON.stringify({error:'이 기능은 v193에서 종료되었습니다. SCHEDULE, ROUTINE, EVENT, PAPER를 사용해주세요.',code:'consult-retired',version:193}));
}
