import {Asset,money,kindLabels,quoteBase,priceLabel} from './data';
import {normalizeCustom} from '../integration/product-core.js';
export const assetGroup=(a:Asset)=>a.kind==='property'?'국내 부동산':a.kind==='stock'||a.kind==='etf'?(a.currency==='USD'?'미국 ':'국내 ')+kindLabels[a.kind]:kindLabels[a.kind];
export const areaLabel=(a:Asset)=>a.area?a.area+'㎡ · 약 '+(a.area/3.3058).toFixed(1)+'평':'면적 미입력';
export function plainChange(a:Asset){
 if(a.kind==='property')return areaLabel(a);
 if(a.kind==='bond')return (a.couponRate!==undefined?'표면금리 연 '+a.couponRate+'%':'표면금리 미입력')+(a.maturity?' · '+a.maturity.slice(0,4)+'년 만기':'');
 if(!a.sample)return '직접 입력';
 const delta=a.price-a.price/(1+a.change/100),amount=money({...a,price:a.currency==='KRW'&&['stock','etf'].includes(a.kind)?Math.round(Math.abs(delta)/10)*10:Math.round(Math.abs(delta)*100)/100});
 return (a.kind==='fund'?'직전 기준가':'전일')+' 대비 약 '+(delta>=0?'+':'−')+amount;
}
export function productFacts(a:Asset):[string,string][]{
 if(a.kind==='stock')return [['PER',a.per!==undefined?a.per+'배':'—'],['배당수익률',a.dividend!==undefined?a.dividend+'%':'—']];
 if(a.kind==='etf')return [['기초지수',a.benchmark??'—'],['총보수 · 연',a.expenseRatio!==undefined?a.expenseRatio+'%':'—']];
 if(a.kind==='bond')return [['표면금리 · 연',a.couponRate!==undefined?a.couponRate+'%':'—'],['만기',a.maturity??'—'],['신용등급',a.creditRating??'—']];
 if(a.kind==='fund')return [['유형',a.fundType??'—'],['총보수 · 연',a.expenseRatio!==undefined?a.expenseRatio+'%':'—']];
 return [];
}
export function compareSummary(items:Asset[]){
 if(items.length<2)return {title:'비교할 상품 선택',body:''};
 const first=items[0];
 if(!items.every(a=>a.kind===first.kind&&a.currency===first.currency&&quoteBase(a)===quoteBase(first)))return {title:'가격 기준·통화가 다른 상품',body:''};
 if(first.kind==='bond'||first.kind==='fund')return {title:'같은 가격 기준으로 비교 · '+priceLabel(first),body:''};
 const ranked=[...items].sort((a,b)=>a.price-b.price),low=ranked[0],high=ranked[ranked.length-1],diff=high.price-low.price;
 return {title:diff===0?'선택한 상품의 가격이 같아요':items.length===2?low.name+'의 '+(first.kind==='property'?'호가':'1주 가격')+'가 '+money({...low,price:diff})+' 낮아요':items.length+'개 중 '+low.name+'의 '+(first.kind==='property'?'호가':'1주 가격')+'가 가장 낮아요',body:''};
}
export function decodeCustom(raw:string,id:string):Asset|null{try{const a=JSON.parse(raw),valid=normalizeCustom(a,id);return {...valid,sample:false,series:[],change:0,source:'직접 입력',asOf:typeof a.asOf==='string'?a.asOf:''} as Asset;}catch{return null;}}
