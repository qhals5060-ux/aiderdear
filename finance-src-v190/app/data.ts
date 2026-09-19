export type AssetKind='stock'|'etf'|'bond'|'fund'|'property';
export type Asset={id:string;kind:AssetKind;name:string;sub:string;price:number;currency:'KRW'|'USD';change:number;series:number[];quoteBase?:number;expenseRatio?:number;benchmark?:string;fundType?:string;couponRate?:number;maturity?:string;creditRating?:string;area?:number;floor?:string;year?:number;per?:number;dividend?:number;source:string;sample:boolean;asOf:string;url?:string};
export {kindLabels} from '../integration/product-core.js';
export const quoteBase=(a:Asset)=>a.quoteBase??1;
export const currencyLabel=(a:Asset)=>a.currency==='USD'?'달러':'원';
export const priceLabel=(a:Asset)=>a.kind==='property'?'매매 희망가':a.kind==='bond'?`액면 ${quoteBase(a).toLocaleString()}${currencyLabel(a)}당 단가`:a.kind==='fund'?`기준가 · ${quoteBase(a).toLocaleString()}좌`:'1주 가격';
export const quantityLabel=(a:Asset)=>a.kind==='bond'?`보유 액면금액 (${currencyLabel(a)})`:a.kind==='fund'?'보유 좌수 (좌)':'보유 수량 (주)';
export const quantityUnit=(a:Asset)=>a.kind==='bond'?currencyLabel(a):a.kind==='fund'?'좌':'주';
export const hasPriceChart=(a:Asset)=>['stock','etf','fund'].includes(a.kind);
const example=(id:string,name:string,sub:string,price:number,change:number,currency:'KRW'|'USD',series:number[],per:number,dividend:number):Asset=>({id,name,sub,price,change,currency,series,per,dividend,kind:'stock',source:'화면 체험용 예시',sample:true,asOf:'예시'});
export const assets:Asset[]=[
example('005930','삼성전자','005930 · KOSPI · 반도체',72400,1.83,'KRW',[100,99,102,101,104,102,105,103,105,108,107,110,112,111,114],15.2,2.01),
example('000660','SK하이닉스','000660 · KOSPI · 반도체',186500,2.47,'KRW',[100,101,99,103,102,106,105,108,106,111,109,113,112,118,121],9.4,.64),
example('035420','NAVER','035420 · KOSPI · 인터넷',198000,-.75,'KRW',[100,102,101,99,100,98,101,99,97,98,99,97,96,98,97],21.3,.61),
example('AAPL','Apple','AAPL · NASDAQ · 테크',228.26,.67,'USD',[100,101,100,104,103,107,104,107,109,108,110,109,112,114,115],34.1,.44),
example('NVDA','NVIDIA','NVDA · NASDAQ · 반도체',121.40,2.35,'USD',[100,103,101,108,105,107,111,109,113,112,119,116,122,120,124],49.5,.03),
{id:'etf-kr-200',kind:'etf',name:'국내 200 ETF',sub:'국내 주식형 · 가상 상품',price:35400,currency:'KRW',change:.85,quoteBase:1,expenseRatio:.15,benchmark:'국내 대형주 200',series:[100,101,100,102,103,102,104,105,104,106,107,106,108,109,110],source:'화면 체험용 가상 상품',sample:true,asOf:'예시'},
{id:'etf-us-500',kind:'etf',name:'미국 대형주 ETF',sub:'미국 주식형 · 가상 상품',price:512.8,currency:'USD',change:.62,quoteBase:1,expenseRatio:.04,benchmark:'미국 대형주 500',series:[100,102,101,103,104,103,105,107,106,109,110,109,111,112,113],source:'화면 체험용 가상 상품',sample:true,asOf:'예시'},
{id:'bond-kr-gov',kind:'bond',name:'국채 2031',sub:'국채 · 가상 상품',price:9875,currency:'KRW',change:0,quoteBase:10000,couponRate:3.25,maturity:'2031-06-10',series:[],source:'화면 체험용 가상 상품 · 경과이자 제외 단가',sample:true,asOf:'예시'},
{id:'bond-kr-corp',kind:'bond',name:'회사채 2029',sub:'가상기업 · 회사채',price:10080,currency:'KRW',change:0,quoteBase:10000,couponRate:4.1,maturity:'2029-09-20',creditRating:'AA− (가상)',series:[],source:'화면 체험용 가상 상품 · 경과이자 제외 단가',sample:true,asOf:'예시'},
{id:'fund-global',kind:'fund',name:'글로벌 주식형 펀드',sub:'주식형 · 가상 상품',price:1382.45,currency:'KRW',change:.42,quoteBase:1000,expenseRatio:.85,fundType:'해외 주식형',series:[100,99,101,102,101,103,104,103,105,104,106,107,106,108,109],source:'화면 체험용 가상 상품',sample:true,asOf:'예시'},
{id:'fund-income',kind:'fund',name:'국내 채권형 펀드',sub:'채권형 · 가상 상품',price:1074.22,currency:'KRW',change:.08,quoteBase:1000,expenseRatio:.32,fundType:'국내 채권형',series:[100,100.2,100.3,100.5,100.6,100.8,100.9,101,101.2,101.3,101.5,101.6,101.8,101.9,102],source:'화면 체험용 가상 상품',sample:true,asOf:'예시'},
{id:'p1',kind:'property',name:'성수 리버뷰 아파트',sub:'서울 성동구 · 가상 매물',price:1480000000,currency:'KRW',change:0,series:[100,100,101,101,102,102,103,103,103,104,104,104,105,105,106],area:84.9,floor:'12 / 25층',year:2016,source:'가상 매도 호가',sample:true,asOf:'예시'},
{id:'p2',kind:'property',name:'마포 센트럴 아파트',sub:'서울 마포구 · 가상 매물',price:1260000000,currency:'KRW',change:0,series:[100,100,100,101,101,101,102,102,103,103,103,104,104,104,104.8],area:84.7,floor:'8 / 20층',year:2014,source:'가상 매도 호가',sample:true,asOf:'예시'},
{id:'p3',kind:'property',name:'분당 파크 아파트',sub:'경기 성남시 · 가상 매물',price:1120000000,currency:'KRW',change:0,series:[100,100,99,100,100,101,101,101,102,102,102,103,103,104,104],area:84.8,floor:'6 / 15층',year:2009,source:'가상 매도 호가',sample:true,asOf:'예시'}];
export const money=(a:Asset)=>a.kind==='property'?propertyMoney(a.price):a.currency==='USD'?'$'+a.price.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}):a.price.toLocaleString('ko-KR',{maximumFractionDigits:2})+'원';
export function propertyMoney(n:number){const won=Math.round(n),billions=Math.floor(won/1e8),tenThousands=Math.floor(won%1e8/1e4),remainder=won%10000;return [billions?billions+'억':'',tenThousands?tenThousands.toLocaleString('ko-KR')+'만':'',remainder?remainder.toLocaleString('ko-KR'):''].filter(Boolean).join(' ')+(won?' 원':'0원');}
