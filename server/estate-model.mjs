// ESTATE data is independent of Consult, Work, personal and shared records.
export const COLLECTIONS = ['properties','customers','consultations','visits','deals','tasks','receipts','proposals','shareLinks','requests'];
export const EDITABLE = COLLECTIONS.filter(k => !['shareLinks','requests'].includes(k));
export function fail(status,message) { throw Object.assign(new Error(message),{status}); }
export function safeId(value) { const s=String(value??''); if(!/^[A-Za-z0-9_-]{1,128}$/.test(s))fail(400,'기록 식별자를 확인해주세요.'); return s; }
export function text(value,max=2000) { if(value==null)return '';if(typeof value!=='string'||value.length>max)fail(400,'입력 내용이 너무 길거나 형식이 잘못되었습니다.');return value.trim(); }
export function date(value) { const s=text(value,10);if(!s)return '';const d=new Date(s+'T00:00:00Z');if(!/^\d{4}-\d{2}-\d{2}$/.test(s)||!Number.isFinite(+d)||d.toISOString().slice(0,10)!==s)fail(400,'날짜를 YYYY-MM-DD 형식으로 입력해주세요.');return s; }
export function time(value) { const s=text(value,5);if(s&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(s))fail(400,'시간을 확인해주세요.');return s; }
export function number(value,max=1e15) { if(value===''||value==null)return null;if(typeof value==='boolean'||!Number.isFinite(Number(value))||Number(value)<0||Number(value)>max)fail(400,'금액과 수량은 0 이상의 숫자로 입력해주세요.');return Number(value); }
function list(value,fn,max=50) { if(value==null)return [];if(!Array.isArray(value)||value.length>max)fail(400,'선택 항목의 개수를 확인해주세요.');return [...new Set(value.map(fn))]; }
const fields={
 properties:'title address detailAddress region building buildingUnit unit propertyType dealType area supplyArea floor totalFloors rooms bathrooms direction parking elevator approvalDate price deposit rent managementFee managementIncludes negotiable availableDate availableNegotiable occupancy pets conditions viewingTimes keyMemo ownerCustomerId receivedDate confirmedDate nextCheckDate status coBroker coBrokerInfo coBrokerSource coBrokerStage coBrokers internalMemo publicDescription advantages disadvantages premium recommendedBusiness facilities landCategory zoning road photos mediaIds',
 customers:'name phone email roles source contactMethod contactTime firstContactDate lastContactDate nextContactDate memo regions excludedRegions dealTypes propertyTypes priceMax depositMax rentMax monthlyCostMax areaMin roomsMin moveInFrom moveInTo parking elevator pets required flexible excludedConditions',
 consultations:'customerId propertyId dealId date time method content nextAction dueDate dueTime priority',
 visits:'customerIds propertyId dealId date time endTime status reaction positives exclusionReason followUpDate followUpAction',
 deals:'title propertyId sellerIds buyerIds stage reason agreedPrice agreedDeposit agreedRent conditions contractDate interimDate balanceDate handoverDate nextAction dueDate priority checklist mediaIds internalMemo expectedFee confirmedFee coBrokerAmount feeDueDate',
 tasks:'title customerId propertyId dealId date time priority status kind notes',
 receipts:'dealId amount date method notes',
 proposals:'customerId propertyId date status notes'
};
const dates=new Set('approvalDate availableDate receivedDate confirmedDate nextCheckDate firstContactDate lastContactDate nextContactDate moveInFrom moveInTo date dueDate followUpDate contractDate interimDate balanceDate handoverDate feeDueDate'.split(' '));
const nums=new Set('area supplyArea totalFloors rooms bathrooms price deposit rent managementFee premium priceMax depositMax rentMax monthlyCostMax areaMin roomsMin agreedPrice agreedDeposit agreedRent expectedFee confirmedFee coBrokerAmount amount'.split(' '));
const enums={propertyType:['apartment','officetel','house','commercial','land','other'],dealType:['sale','jeonse','rent'],parking:['yes','no','unknown'],elevator:['yes','no','unknown'],pets:['yes','no','negotiable','unknown'],coBrokerSource:['own','partner'],coBrokerStage:['available','active','finished'],priority:['high','normal','low'],stage:['inquiry','consultation','proposal','visit','negotiation','preparation','contract','settled','hold','stopped'],kind:['contact','followup','documents','payment','handover','property-check','other']};
const statuses={properties:['active','negotiating','closed','hold','ended'],visits:['scheduled','done','cancelled'],tasks:['open','done','cancelled'],proposals:['suggested','interested','declined']};
const defaults={properties:{status:'active',propertyType:'other',dealType:'sale'},customers:{roles:[]},consultations:{priority:'normal'},visits:{status:'scheduled',customerIds:[]},deals:{stage:'inquiry',priority:'normal'},tasks:{status:'open',priority:'normal',kind:'other'},proposals:{status:'suggested'}};
export function entity(kind,input,old={}) {
 if(!EDITABLE.includes(kind)||!input||typeof input!=='object'||Array.isArray(input))fail(400,'자료 유형과 입력을 확인해주세요.');
 const merged={...defaults[kind],...old,...input},out={};
 for(const key of fields[kind].split(' ')){
  let v=merged[key];if(v===undefined)continue;
  if(dates.has(key))v=date(v);
  else if(['time','endTime','dueTime'].includes(key))v=time(v);
  else if(nums.has(key))v=number(v);
  else if(['negotiable','availableNegotiable','coBroker'].includes(key)){if(typeof v!=='boolean')fail(400,'선택 항목을 확인해주세요.');}
  else if(key==='coBrokers')v=list(v,p=>{
   if(!p||typeof p!=='object'||Array.isArray(p))fail(400,'공동중개사 입력 형식을 확인해주세요.');
   const role=text(p.role,20);if(role&&!['listing','customer','both'].includes(role))fail(400,'공동중개사의 역할을 확인해주세요.');
   // Private, optional contact details; never infer missing information or copy into public descriptions.
   return {id:safeId(text(p.id,128)),office:text(p.office,120),name:text(p.name,80),phone:text(p.phone,80),role,terms:text(p.terms,2000)};
  },5);
  else if(key==='photos')v=list(v,p=>{if(!p||typeof p!=='object')fail(400,'사진 형식을 확인해주세요.');return {mediaId:safeId(p.mediaId),thumbId:p.thumbId?safeId(p.thumbId):'',name:text(p.name,180)};},20);
  else if(key==='checklist')v=list(v,p=>({id:safeId(p.id),text:text(p.text,300),done:p.done===true}),60);
  else if(['mediaIds','customerIds','sellerIds','buyerIds'].includes(key))v=list(v,safeId,30);
  else if(['regions','excludedRegions','required','flexible'].includes(key))v=list(v,x=>text(x,150),30);
  else if(['roles','dealTypes','propertyTypes'].includes(key)){const allowed=key==='roles'?['seller','landlord','buyer','tenant']:enums[key==='dealTypes'?'dealType':'propertyType'];v=list(v,x=>{if(!allowed.includes(x))fail(400,'선택 항목을 확인해주세요.');return x;},10);}
  else if(key==='floor'){v=v==null||v===''?null:Number(v);if(v!==null&&(!Number.isInteger(v)||v< -30||v>300))fail(400,'층수를 확인해주세요.');}
  else if(key.endsWith('Id'))v=v?safeId(v):'';
  else {v=text(v,['internalMemo','memo','content','publicDescription','conditions','notes'].includes(key)?12000:2000);const allowed=key==='status'?statuses[kind]:enums[key];if(allowed&&v&&!allowed.includes(v))fail(400,'지원하지 않는 상태 또는 선택 항목입니다.');}
  out[key]=v;
 }
 const required={properties:['title'],customers:['name','phone'],consultations:['customerId','date','content'],visits:['propertyId','date'],deals:['title','propertyId'],tasks:['title','date'],receipts:['dealId','date'],proposals:['customerId','propertyId','date']}[kind];
 for(const key of required)if(!out[key])fail(400,'필수 항목을 입력해주세요: '+key);
 if(kind==='customers'&&!out.roles?.length)fail(400,'고객 역할을 하나 이상 선택해주세요.');
 if(kind==='visits'&&!out.customerIds?.length)fail(400,'방문 고객을 선택해주세요.');
 if(kind==='receipts'&&!(out.amount>0))fail(400,'수납액은 0보다 커야 합니다.');
 if(kind==='deals'&&['hold','stopped'].includes(out.stage)&&!out.reason)fail(400,'보류 또는 중단 사유를 입력해주세요.');
 if(out.photos&&new Set(out.photos.map(p=>p.mediaId)).size!==out.photos.length)fail(400,'동일한 사진을 중복 등록할 수 없습니다.');
 if(out.coBrokers&&new Set(out.coBrokers.map(p=>p.id)).size!==out.coBrokers.length)fail(400,'공동중개사 식별자가 중복되었습니다.');
 if(out.checklist&&(out.checklist.some(c=>!c.text)||new Set(out.checklist.map(c=>c.id)).size!==out.checklist.length))fail(400,'체크리스트 내용과 중복 식별자를 확인해주세요.');
 if(out.moveInFrom&&out.moveInTo&&out.moveInTo<out.moveInFrom)fail(400,'입주 희망 기간을 확인해주세요.');
 if(out.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email))fail(400,'이메일 형식을 확인해주세요.');
 return out;
}
export function mediaIds(row) {return [...new Set([...(row?.mediaIds||[]),...(row?.photos||[]).flatMap(p=>[p.mediaId,p.thumbId].filter(Boolean))])];}
export function references(row={}) {return [row.ownerCustomerId&&['customers',row.ownerCustomerId],row.customerId&&['customers',row.customerId],row.propertyId&&['properties',row.propertyId],row.dealId&&['deals',row.dealId],...[...(row.customerIds||[]),...(row.sellerIds||[]),...(row.buyerIds||[])].map(x=>['customers',x])].filter(Boolean);}
export function checkRevision(old,expected) {if(!Number.isInteger(expected)||expected<0||expected!==(old?.revision||0))fail(409,'다른 화면에서 변경된 기록입니다. 새로고침한 뒤 수정해주세요. 입력 내용은 유지됩니다.');}
export function normalizedAddress(row) {return String(row.address||'').normalize('NFKC').replace(/\s+/g,'').toLowerCase();}
