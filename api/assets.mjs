// Retired investment feature. Old clients never initialize Firebase or read
// account records. Removing the page does not delete historical data.
export default function retiredInvestment(req,res){
  res.setHeader('Content-Type','application/json; charset=utf-8');
  res.setHeader('Cache-Control','private, no-store');
  res.setHeader('X-AiderLog-Finance','192');
  res.statusCode=410;
  res.end(JSON.stringify({retired:true,dataAccess:false,error:'재테크 기능이 종료되었습니다.'}));
}
