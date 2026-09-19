import {Asset,AssetKind} from './data';
export function typeSpec(type:string):{kind:AssetKind;currency:'KRW'|'USD'}{return {kind:type==='kr'||type==='us'?'stock':type.replace('-us','') as AssetKind,currency:type==='us'||type.endsWith('-us')?'USD':'KRW'};}
export const formType=(a:Pick<Asset,'kind'|'currency'>)=>a.kind==='stock'?(a.currency==='USD'?'us':'kr'):a.kind+(a.currency==='USD'?'-us':'');
