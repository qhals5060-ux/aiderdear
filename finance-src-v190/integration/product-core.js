export const kinds=['stock','etf','bond','fund','property'];
export const kindLabels={stock:'주식',etf:'ETF',bond:'채권',fund:'펀드',property:'부동산'};
export const sampleSpecs={
 '005930':{kind:'stock',currency:'KRW',quoteBase:1},'000660':{kind:'stock',currency:'KRW',quoteBase:1},'035420':{kind:'stock',currency:'KRW',quoteBase:1},AAPL:{kind:'stock',currency:'USD',quoteBase:1},NVDA:{kind:'stock',currency:'USD',quoteBase:1},
 p1:{kind:'property',currency:'KRW'},p2:{kind:'property',currency:'KRW'},p3:{kind:'property',currency:'KRW'},
 'etf-kr-200':{kind:'etf',currency:'KRW',quoteBase:1},'etf-us-500':{kind:'etf',currency:'USD',quoteBase:1},
 'bond-kr-gov':{kind:'bond',currency:'KRW',quoteBase:10000},'bond-kr-corp':{kind:'bond',currency:'KRW',quoteBase:10000},
 'fund-global':{kind:'fund',currency:'KRW',quoteBase:1000},'fund-income':{kind:'fund',currency:'KRW',quoteBase:1000}
};
const reject=()=>{throw Error('상품 종류, 가격 기준 또는 입력 범위를 확인해 주세요.');};
const text=(v,max)=>typeof v==='string'&&v.trim().length&&v.length<=max?v.trim():reject();
const positive=(v,max)=>typeof v==='number'&&Number.isFinite(v)&&v>0&&v<=max?v:reject();
const percent=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100?v:reject();
export function normalizeCustom(input,id){
 if(!input||typeof input!=='object'||Array.isArray(input)||typeof id!=='string'||!/^custom-[-\w]{1,63}$/.test(id)||input.id!==id||!kinds.includes(input.kind)||!['KRW','USD'].includes(input.currency))reject();
 const a={id,kind:input.kind,currency:input.currency,name:text(input.name,60),sub:text(input.sub,120),price:positive(input.price,1e14),quoteBase:input.kind==='bond'||input.kind==='fund'?positive(input.quoteBase,1e9):1};
 if(!Number.isInteger(a.quoteBase)||a.quoteBase<1)reject();
 if(input.kind==='property'&&input.currency!=='KRW')reject();
 const area=input.kind==='property'?positive(input.area,100000):undefined;
 let url;if(input.url!==undefined&&input.url!==''){url=text(input.url,1000);try{if(!['http:','https:'].includes(new URL(url).protocol))reject();}catch{reject();}}
 const expenseRatio=['etf','fund'].includes(input.kind)&&input.expenseRatio!==undefined?percent(input.expenseRatio):undefined;
 const benchmark=input.kind==='etf'&&input.benchmark?text(input.benchmark,80):undefined;
 const fundType=input.kind==='fund'&&input.fundType?text(input.fundType,40):undefined;
 const couponRate=input.kind==='bond'&&input.couponRate!==undefined?percent(input.couponRate):undefined;
 const creditRating=input.kind==='bond'&&input.creditRating?text(input.creditRating,20):undefined;
 let maturity;if(input.kind==='bond'&&input.maturity){maturity=text(input.maturity,10);if(!/^\d{4}-\d{2}-\d{2}$/.test(maturity)||!Number.isFinite(Date.parse(maturity+'T00:00:00Z'))||new Date(maturity+'T00:00:00Z').toISOString().slice(0,10)!==maturity)reject();}
 return {...a,...(area!==undefined?{area}:{}),...(url?{url}:{}),...(expenseRatio!==undefined?{expenseRatio}:{}),...(benchmark?{benchmark}:{}),...(fundType?{fundType}:{}),...(couponRate!==undefined?{couponRate}:{}),...(creditRating?{creditRating}:{}),...(maturity?{maturity}:{})};
}
