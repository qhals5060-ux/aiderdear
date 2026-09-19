import {Asset,quoteBase} from './data';
import {readDetails,readHistory,statusLabels} from '../integration/management-core.js';
export type Visit={id:string;date:string;pros:string;cons:string;checks:string;monthlyFee:number|null;links:string[]};
export type Management={status:keyof typeof statusLabels;tags:string[];targetPrice:number|null;targetDirection:'below'|'above';quantity:number|null;averageCost:number|null;visits:Visit[]};
export type HistoryEvent={at:string;changes:{field:string;from:string;to:string}[]};
export const management=(raw?:string|null)=>readDetails(raw) as Management;
export const historyEvents=(raw?:string|null)=>readHistory(raw) as HistoryEvent[];
export {statusLabels};
export function targetMet(a:Asset,m:Management){return m.targetPrice!==null&&(m.targetDirection==='below'?a.price<=m.targetPrice:a.price>=m.targetPrice);}
export function position(a:Asset,m:Management){if(a.kind==='property'||!m.quantity||!m.averageCost)return null;const units=m.quantity/quoteBase(a);return {cost:units*m.averageCost,value:units*a.price,profit:units*(a.price-m.averageCost),percent:(a.price/m.averageCost-1)*100};}
