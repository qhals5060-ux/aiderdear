/* Pure ESTATE rules, shared by the site and isolated tests. No external pricing assumptions. */
export const estateLabels = Object.freeze({sale:'매매',jeonse:'전세',rent:'월세',apartment:'아파트',officetel:'오피스텔',house:'빌라·주택',commercial:'상가·사무실',land:'토지',other:'기타',active:'중개 중',negotiating:'협의 중',closed:'거래 완료',hold:'보류',ended:'중개 종료',inquiry:'문의',consultation:'상담',proposal:'매물 제안',visit:'방문',negotiation:'조건 협의',preparation:'계약 준비',contract:'계약 완료',settled:'잔금·인도 완료',stopped:'거래 중단'});
const present = x => x !== null && x !== undefined && x !== '';
const numeric = x => present(x) && Number.isFinite(Number(x)) ? Number(x) : null;
const array = x => Array.isArray(x) ? x : [];
const norm = x => String(x||'').trim().toLocaleLowerCase();
const inRange = (d,from,to) => !!d && (!from||d>=from) && (!to||d<=to);
const day = x => /^\d{4}-\d{2}-\d{2}$/.test(String(x||'')) ? String(x) : '';
const timestampDay = x => {if(!present(x))return '';const date=new Date(x);return Number.isFinite(date.getTime())?`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`:'';};
export function matchProperty(customer={},property={}) {
  const criteria=[],required=new Set(array(customer.required)),flexible=new Set(array(customer.flexible));
  function add(key,label,ok,reason,negotiable=false) {
    const status=ok===null?'unknown':ok?'fulfilled':(negotiable||flexible.has(key))?'negotiable':'unfulfilled';
    criteria.push({key,label,status,reason,required:required.has(key)});
  }
  function cap(key,label,max,value) {if(numeric(max)!==null)add(key,label,numeric(value)===null?null:Number(value)<=Number(max),numeric(value)===null?'매물 금액 미확인':`${Number(value).toLocaleString('ko-KR')}원 / 한도 ${Number(max).toLocaleString('ko-KR')}원`,property.negotiable===true);}
  function minimum(key,label,min,value) {if(numeric(min)!==null)add(key,label,numeric(value)===null?null:Number(value)>=Number(min),numeric(value)===null?'매물 정보 미확인':`${value} / 최소 ${min}`);}
  const region=norm(property.region||property.address);
  if(array(customer.regions).length)add('region','지역',!region?null:customer.regions.some(r=>region.includes(norm(r))),region?`${property.region||property.address} / 희망 ${customer.regions.join(', ')}`:'지역 미확인');
  if(array(customer.excludedRegions).length)add('excludedRegion','제외 지역',!region?null:!customer.excludedRegions.some(r=>region.includes(norm(r))),`제외: ${customer.excludedRegions.join(', ')}`);
  for(const [key,label,values] of [['dealType','거래 유형',customer.dealTypes],['propertyType','부동산 유형',customer.propertyTypes]])if(array(values).length)add(key,label,property[key]?values.includes(property[key]):null,property[key]?`${estateLabels[property[key]]||property[key]} / 희망 ${values.map(v=>estateLabels[v]||v).join(', ')}`:'유형 미확인');
  if(property.dealType==='sale')cap('price','매매 예산',customer.priceMax,property.price);
  if(['jeonse','rent'].includes(property.dealType))cap('deposit','보증금 예산',customer.depositMax,property.deposit);
  if(property.dealType==='rent') {
    cap('rent','월세 예산',customer.rentMax,property.rent);
    cap('monthlyCost','월 주거비',customer.monthlyCostMax,numeric(property.rent)!==null&&numeric(property.managementFee)!==null?Number(property.rent)+Number(property.managementFee):null);
  }
  if(!property.dealType)for(const [key,label,v] of [['price','매매 예산',customer.priceMax],['deposit','보증금 예산',customer.depositMax],['rent','월세 예산',customer.rentMax],['monthlyCost','월 주거비',customer.monthlyCostMax]])if(numeric(v)!==null)add(key,label,null,'거래 유형과 금액 확인 필요');
  minimum('area','전용면적 (㎡)',customer.areaMin,property.area);minimum('rooms','방 수',customer.roomsMin,property.rooms);
  if(day(customer.moveInFrom)||day(customer.moveInTo)) {
    const available=day(property.availableDate),end=day(customer.moveInTo),start=day(customer.moveInFrom);
    add('moveIn','입주일',available?(!end||available<=end):null,available?`입주 가능 ${available} / 희망 ${start||'시작 미정'}~${end||'종료 미정'}`:property.availableNegotiable?'입주일 협의 가능, 날짜 확인 필요':'입주 가능일 미확인',property.availableNegotiable===true);
  }
  for(const [key,label] of [['parking','주차'],['elevator','엘리베이터'],['pets','반려동물']]) {
    const want=customer[key];if(!want||want==='unknown'||want==='any')continue;
    const value=property[key];add(key,label,!value||value==='unknown'||value==='negotiable'?null:value===want,value==='negotiable'?'협의 필요':!value||value==='unknown'?'미확인':value==='yes'?'가능 / 있음':'불가 / 없음',value==='negotiable');
    if(value==='negotiable')criteria[criteria.length-1].status='negotiable';
  }
  if(customer.excludedConditions)add('excludedConditions','제외 조건',null,`직접 확인: ${customer.excludedConditions}`);
  for(const key of required)if(!criteria.some(c=>c.key===key))add(key,key,null,'필수 조건의 기준값 또는 매물 정보가 없습니다.');
  const confirmed=criteria.filter(c=>['fulfilled','unfulfilled'].includes(c.status)).length;
  const eligible=!['closed','hold','ended'].includes(property.status)&&!criteria.some(c=>(c.required||c.key==='excludedRegion')&&c.status!=='fulfilled');
  return {criteria,score:criteria.length?Math.round(criteria.filter(c=>c.status==='fulfilled').length/criteria.length*100):null,coverage:criteria.length?Math.round(confirmed/criteria.length*100):0,eligible};
}
export function estateStatistics({deals=[],receipts=[],customers=[],properties=[],visits=[]}={}, {from='',to=''}={}) {
  const completed=deals.filter(d=>['contract','settled'].includes(d.stage));
  const contracts=completed.filter(d=>inRange(d.contractDate,from,to));
  const current=deals.filter(d=>!['stopped','hold'].includes(d.stage));
  const paid=new Map();for(const r of receipts)paid.set(r.dealId,(paid.get(r.dealId)||0)+(numeric(r.amount)||0));
  const received=receipts.filter(r=>inRange(r.date,from,to)).reduce((s,r)=>s+(numeric(r.amount)||0),0);
  const owing=current.filter(d=>inRange(d.feeDueDate||d.contractDate,from,to));
  const propertyMap=new Map(properties.map(p=>[p.id,p]));
  const byType=Object.entries(contracts.reduce((a,d)=>{const type=propertyMap.get(d.propertyId)?.dealType||'unknown';a[type]=(a[type]||0)+1;return a;},{})).map(([key,count])=>({key,label:estateLabels[key]||'미확인',count,value:count}));
  const cohort=customers.filter(c=>inRange(c.firstContactDate||timestampDay(c.createdAt),from,to));
  const bySource=Object.entries(cohort.reduce((a,c)=>{const k=c.source||'미확인';(a[k]??=[]).push(c.id);return a;},{})).map(([label,ids])=>({label,customers:ids.length,contracts:contracts.filter(d=>[...array(d.sellerIds),...array(d.buyerIds)].some(id=>ids.includes(id))).length,count:ids.length}));
  const visitedIds=new Set(visits.filter(v=>v.status!=='cancelled'&&inRange(v.date,from,to)).flatMap(v=>array(v.customerIds)));
  const contractIds=new Set(contracts.flatMap(d=>[...array(d.sellerIds),...array(d.buyerIds)]));
  const days=contracts.map(d=>{const p=propertyMap.get(d.propertyId);return day(p?.receivedDate)&&day(d.contractDate)?(Date.parse(d.contractDate)-Date.parse(p.receivedDate))/86400000:null;}).filter(n=>n!==null&&n>=0);
  return {contracts:contracts.length,received,outstanding:owing.reduce((s,d)=>s+Math.max(0,(numeric(d.confirmedFee)||0)-(paid.get(d.id)||0)),0),expected:current.filter(d=>inRange(d.feeDueDate||d.contractDate,from,to)).reduce((s,d)=>s+(numeric(d.expectedFee)||0),0),coBrokerAmount:contracts.reduce((s,d)=>s+(numeric(d.coBrokerAmount)||0),0),byType,bySource,funnel:{inquiry:cohort.length,visit:cohort.filter(c=>visitedIds.has(c.id)).length,contract:cohort.filter(c=>contractIds.has(c.id)).length},averageDays:days.length?Math.round(days.reduce((a,b)=>a+b,0)/days.length*10)/10:null,sampleSize:{deals:deals.length,receipts:receipts.length,customers:customers.length,properties:properties.length,visits:visits.length,duration:days.length},basis:'계약: 계약일이 기간 내인 계약 완료·잔금/인도 완료 거래. 실수납: 수납일 기준(분할 합산). 미수: 기간 내 수납예정일(없으면 계약일)의 확정 보수−누적 수납, 보류·중단 제외. 예상액은 확정/수납과 별도. 전환: 기간 내 최초 상담 고객 중 같은 기간 방문·계약 고객 수(중복 제외). 소요일: 매물 접수일~계약일. 불러온 자료만 집계.'};
}
export function calendarRows({tasks=[],visits=[],deals=[],customers=[],properties=[]}={}) {
  const rows=[],add=(collection,row,key,title,date,time='',endTime='')=>{if(day(date))rows.push({id:`estate:${collection}:${row.id}:${key}`,sourceKind:collection,sourceId:row.id,title,date,endDate:date,time,endTime,category:'estate',readOnly:true});};
  tasks.filter(t=>!['cancelled','done'].includes(t.status)&&t.sourceKind!=='deals').forEach(t=>add('tasks',t,'due',t.title||'부동산 업무',t.date,t.time));
  visits.filter(v=>v.status!=='cancelled').forEach(v=>add('visits',v,'visit','부동산 방문',v.date,v.time,v.endTime));
  deals.filter(d=>!['hold','stopped'].includes(d.stage)).forEach(d=>{for(const [k,label] of [['contractDate','계약'],['interimDate','중도금'],['balanceDate','잔금'],['handoverDate','인도']])add('deals',d,k,`부동산 ${label} · ${d.title||''}`,d[k]);if(d.nextAction&&d.dueDate)add('deals',d,'nextAction',d.nextAction,d.dueDate);});
  customers.forEach(c=>add('customers',c,'contact','부동산 고객 연락',c.nextContactDate));
  properties.filter(p=>!['closed','ended'].includes(p.status)).forEach(p=>add('properties',p,'check','부동산 매물 확인',p.nextCheckDate));
  return [...new Map(rows.map(r=>[r.id,r])).values()];
}
export function publicProperty(property={}, options={}) {
  const result={};
  for(const key of ['id','number','title','region','propertyType','dealType','area','supplyArea','floor','totalFloors','rooms','bathrooms','direction','parking','elevator','approvalDate','price','deposit','rent','managementFee','managementIncludes','negotiable','availableDate','availableNegotiable','occupancy','pets','conditions','publicDescription','advantages','disadvantages','premium','recommendedBusiness','facilities','landCategory','zoning','road'])if(present(property[key]))result[key]=property[key];
  if(options.showAddress)result.address=property.address||'';
  if(options.showUnit){result.detailAddress=property.detailAddress||'';result.buildingUnit=property.buildingUnit||'';result.unit=property.unit||'';}
  const selected=new Set(options.photos?.[property.id]||[]);
  result.photos=array(property.photos).filter(p=>selected.has(p.mediaId)).map(p=>({mediaId:p.mediaId}));
  return result;
}
