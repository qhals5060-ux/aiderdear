import {Asset,hasPriceChart} from './data';
import {Management,targetMet} from './management';
export type Filters={region:string;budget:string;area:string;notesOnly:boolean;status:string;tag:string;alert:string};
export const emptyFilters:Filters={region:'all',budget:'all',area:'all',notesOnly:false,status:'all',tag:'all',alert:'all'};
export function sortOptions(view:string):[string,string][]{
 const base:[string,string][]=[['default','기본 순'],['name','이름 순']];
 if(view==='property')return [...base,['price-asc','낮은 가격 순'],['price-desc','높은 가격 순'],['area-desc','넓은 면적 순']];
 if(view==='bond')return [...base,['maturity','가까운 만기 순'],['coupon','높은 표면금리 순']];
 if(view==='etf'||view==='fund')return [...base,['change','높은 등락률 순'],['change-asc','낮은 등락률 순'],['fee','낮은 보수 순']];
 return [...base,['change','높은 등락률 순'],['change-asc','낮은 등락률 순']];
}
function orderedNumber(a:number|undefined,b:number|undefined,descending=false){
 if(a===undefined)return b===undefined?0:1;if(b===undefined)return -1;
 return descending?b-a:a-b;
}
export function filterAssets(assets:Asset[],options:{view:string;market:string;query:string;sort:string;filters:Filters;watched:(id:string)=>boolean;note:(id:string)=>string;meta:(id:string)=>Management}){
 const {view,market,query,sort,filters,watched,note,meta}=options;
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
 return assets.filter(a=>{
  if(['stock','etf','bond','fund','property'].includes(view)&&a.kind!==view||view==='saved'&&!watched(a.id))return false;
  if(market==='kr'&&(a.kind==='property'||a.currency!=='KRW')||market==='us'&&(a.kind==='property'||a.currency!=='USD')||['stock','etf','bond','fund','property'].includes(market)&&a.kind!==market||['KRW','USD'].includes(market)&&a.currency!==market||market==='manual'&&a.sample)return false;
  if(view==='property'&&(filters.region!=='all'&&!a.sub.startsWith(filters.region)||filters.budget!=='all'&&a.price>Number(filters.budget)||filters.area!=='all'&&(a.area??0)<Number(filters.area)))return false;
  if(filters.status!=='all'&&meta(a.id).status!==filters.status)return false;
  if(view==='alerts'&&meta(a.id).targetPrice===null)return false;
  if(filters.tag!=='all'&&!meta(a.id).tags.includes(filters.tag))return false;
  if(view==='alerts'&&filters.alert!=='all'&&(filters.alert==='met')!==targetMet(a,meta(a.id)))return false;
  if(filters.notesOnly&&!note(a.id).trim())return false;
  return words.every(word=>`${a.name} ${a.sub} ${a.id} ${a.benchmark??''} ${a.fundType??''} ${a.creditRating??''} ${meta(a.id).tags.join(' ')} ${note(a.id)}`.toLocaleLowerCase().includes(word));
 }).sort((a,b)=>{
  if(sort==='name')return a.name.localeCompare(b.name,'ko');
  if(sort==='price-asc')return a.price-b.price;if(sort==='price-desc')return b.price-a.price;
  if(sort==='area-desc')return orderedNumber(a.area,b.area,true);
  if(sort==='fee')return orderedNumber(a.expenseRatio,b.expenseRatio);
  if(sort==='coupon')return orderedNumber(a.couponRate,b.couponRate,true);
  if(sort==='maturity')return orderedNumber(a.maturity?Date.parse(a.maturity):undefined,b.maturity?Date.parse(b.maturity):undefined);
  if(sort==='change'||sort==='change-asc')return orderedNumber(hasPriceChart(a)&&a.sample?a.change:undefined,hasPriceChart(b)&&b.sample?b.change:undefined,sort==='change');
  return 0;
 });
}
