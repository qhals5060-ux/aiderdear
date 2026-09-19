export const statusLabels={none:'미분류',review:'검토 중',waiting:'매수 대기',visit:'방문 예정',paused:'보류',owned:'보유'};
export const defaultDetails=()=>({status:'none',tags:[],targetPrice:null,targetDirection:'below',quantity:null,averageCost:null,visits:[]});
const fail=()=>{throw Error('관리 정보의 입력 범위를 확인해 주세요.');};
const str=(v,max)=>typeof v==='string'&&v.length<=max?v:fail();
const num=(v,max)=>v===null?null:typeof v==='number'&&Number.isFinite(v)&&v>0&&v<=max?v:fail();
export function normalizeDetails(input){
 if(!input||typeof input!=='object'||Array.isArray(input))fail();
 const d={...defaultDetails(),...input};if(typeof d.status!=='string'||!Object.hasOwn(statusLabels,d.status)||!['below','above'].includes(d.targetDirection)||!Array.isArray(d.tags)||d.tags.length>6||!Array.isArray(d.visits)||d.visits.length>20)fail();
 const tags=[...new Set(d.tags.map(t=>str(t,16).trim()).filter(Boolean))];
 const quantity=num(d.quantity,1e9),averageCost=num(d.averageCost,1e14);if((quantity===null)!==(averageCost===null))fail();
 const visits=d.visits.map(v=>{if(!v||typeof v!=='object'||typeof v.id!=='string'||!/^[-\w]{1,60}$/.test(v.id)||typeof v.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(v.date)||new Date(v.date+'T00:00:00Z').toISOString().slice(0,10)!==v.date||!Array.isArray(v.links)||v.links.length>4)fail();return {id:v.id,date:v.date,pros:str(v.pros,500),cons:str(v.cons,500),checks:str(v.checks,500),monthlyFee:num(v.monthlyFee,1e8),links:v.links.map(link=>{str(link,1000);const url=new URL(link);if(!['http:','https:'].includes(url.protocol)||url.href.length>1000)fail();return url.href;})};});
 if(new Set(visits.map(v=>v.id)).size!==visits.length)fail();
 const result={status:d.status,tags,targetPrice:num(d.targetPrice,1e14),targetDirection:d.targetDirection,quantity,averageCost,visits};
 if(JSON.stringify(result).length>60000)throw Error('방문 기록의 전체 용량을 초과했습니다. 긴 내용이나 링크를 줄여 주세요.');return result;
}
export function readDetails(raw){try{return normalizeDetails(typeof raw==='string'?JSON.parse(raw):raw);}catch{return defaultDetails();}}
export function readHistory(raw){try{const h=typeof raw==='string'?JSON.parse(raw):raw;return Array.isArray(h)?h.filter(e=>e&&typeof e.at==='string'&&e.at.length<=30&&Number.isFinite(Date.parse(e.at))&&Array.isArray(e.changes)&&e.changes.length>0&&e.changes.length<=20&&e.changes.every(c=>c&&typeof c.field==='string'&&c.field.length<=40&&typeof c.from==='string'&&c.from.length<=65536&&typeof c.to==='string'&&c.to.length<=65536)):[];}catch{return [];}}
/** @param {{kind:string,currency:string,quoteBase?:number}} asset @param {unknown} raw @param {{kind:string,currency:string,quoteBase?:number}|null} previousAsset @param {unknown} previousRaw */
export function validateAssetDetails(asset,raw,previousAsset=null,previousRaw=null){
 const d=readDetails(raw),old=readDetails(previousRaw);
 if(asset.kind!=='property'&&d.visits.length||asset.kind==='property'&&(d.quantity!==null||d.averageCost!==null))throw Error('상품 종류에 맞는 관리 정보를 입력해 주세요.');
 if(previousAsset&&(asset.quoteBase??1)!==(previousAsset.quoteBase??1)&&(old.targetPrice!==null||old.averageCost!==null))throw Error('가격 기준을 변경하려면 관리 창에서 목표가와 보유 정보를 먼저 비워 주세요.');
 if(previousAsset&&asset.currency!==previousAsset.currency&&(old.targetPrice!==null||old.averageCost!==null))throw Error('통화를 변경하려면 관리 창에서 목표가와 보유 정보를 먼저 비워 주세요.');
 if(previousAsset&&asset.kind!==previousAsset.kind&&(old.quantity!==null||old.visits.length))throw Error('관리 기록이 있는 자산의 종류는 변경할 수 없습니다. 새 자산으로 등록해 주세요.');
}
const show=v=>v===null||v===undefined||v===''?'—':typeof v==='object'?JSON.stringify(v):String(v);
export function appendHistory(previous,next,stamp){
 const old=previous??{},a=readDetails(old.details),b=readDetails(next.details),changes=[];
 const add=(label,from,to)=>{if(JSON.stringify(from)!==JSON.stringify(to))changes.push({field:label,from:show(from),to:show(to)});};
 add('관심',old.watched??0,next.watched);add('메모',old.note??'',next.note);add('상태',statusLabels[a.status],statusLabels[b.status]);add('태그',a.tags.join(', '),b.tags.join(', '));add('목표가',a.targetPrice,b.targetPrice);if(b.targetPrice!==null)add('목표 조건',a.targetDirection==='below'?'이하':'이상',b.targetDirection==='below'?'이하':'이상');add('보유 수량',a.quantity,b.quantity);add('평균 매입가',a.averageCost,b.averageCost);
 add('방문 기록',a.visits,b.visits);
 const parseCustom=raw=>{try{return JSON.parse(raw??'null')}catch{return null;}};const c=parseCustom(old.custom),d=parseCustom(next.custom);if(d){add('이름',c?.name,d.name);add('가격',c?.price,d.price);add('위치·코드',c?.sub,d.sub);add('면적',c?.area,d.area);add('가격 기준',c?.quoteBase,d.quoteBase);add('상품 지표',[c?.couponRate,c?.maturity,c?.creditRating,c?.expenseRatio,c?.benchmark,c?.fundType].filter(v=>v!==undefined).join(' · '),[d.couponRate,d.maturity,d.creditRating,d.expenseRatio,d.benchmark,d.fundType].filter(v=>v!==undefined).join(' · '));}
 const history=changes.length?[...readHistory(old.history),{at:stamp,changes}]:readHistory(old.history);return JSON.stringify(history);
}
