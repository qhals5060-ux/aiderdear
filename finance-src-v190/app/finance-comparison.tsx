'use client';
import {useState} from 'react';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from '@/components/ui/table';
import {Switch} from '@/components/ui/switch';
import {Asset,money,priceLabel,quantityUnit} from './data';
import {assetGroup,areaLabel,plainChange,productFacts} from './asset-content';
import {position,statusLabels} from './management';
import type {useAssets} from './use-assets';

type Row={id:string;label:string;values:string[];fixed?:boolean};
export function FinanceComparison({items,fields,store}:{items:Asset[];fields:string[];store:ReturnType<typeof useAssets>}){
 const [differencesOnly,setDifferencesOnly]=useState(false);
 const {getManagement,savedNote,openDetail}=store;
 const rows:Row[]=[
  {id:'price',label:'가격',values:items.map(money),fixed:true},
  {id:'basis',label:'가격 기준',values:items.map(priceLabel),fixed:true},
  {id:'unit',label:'통화',values:items.map(a=>a.currency)},
  {id:'space',label:items.every(a=>a.kind==='property')?'전용 면적':'기본 정보',values:items.map(a=>a.kind==='property'?areaLabel(a):plainChange(a))},
  ...(items.some(a=>a.kind==='property')?[{id:'unit',label:'㎡당 호가',values:items.map(a=>a.area?Math.round(a.price/a.area/10000).toLocaleString()+'만 원':'—')}]:[]),
  {id:'status',label:'상태 · 태그',values:items.map(a=>{const m=getManagement(a.id);return [m.status==='none'?'':statusLabels[m.status],...m.tags].filter(Boolean).join(' · ')||'—'})},
  {id:'target',label:'목표가',values:items.map(a=>{const m=getManagement(a.id);return m.targetPrice===null?'—':money({...a,price:m.targetPrice})+' '+(m.targetDirection==='below'?'이하':'이상')})},
  {id:'holding',label:'보유 수량',values:items.map(a=>{const m=getManagement(a.id);return position(a,m)?m.quantity!.toLocaleString()+quantityUnit(a):'—'})},
  {id:'holding',label:'평가손익',values:items.map(a=>{const p=position(a,getManagement(a.id));return p?`${p.profit>=0?'+':''}${money({...a,price:p.profit})} (${p.percent>=0?'+':''}${p.percent.toFixed(1)}%)`:'—'})},
  {id:'fee',label:'월 관리비 · 최근 방문',values:items.map(a=>{const fee=getManagement(a.id).visits[0]?.monthlyFee;return a.kind==='property'&&fee!==null&&fee!==undefined?fee.toLocaleString()+'원':'—'})},
  ...Array.from(new Set(items.flatMap(a=>productFacts(a).map(([label])=>label)))).map(label=>({id:'metrics',label,values:items.map(a=>productFacts(a).find(([name])=>name===label)?.[1]??'—')})),
  {id:'note',label:'내 메모',values:items.map(a=>savedNote(a.id)||'—')}
 ].filter(row=>row.fixed||fields.includes(row.id));
 const visible=rows.filter(row=>row.fixed||!differencesOnly||new Set(row.values).size>1);
 return <section className="finance-comparison" aria-label="상품별 비교표">
  <div className="finance-comparison-tools"><span>{items.length}개 상품 · 예시/입력값</span><label><Switch checked={differencesOnly} onCheckedChange={setDifferencesOnly} aria-label="다른 항목만 표시"/> 다른 항목만</label></div>
  <Table className="finance-comparison-table" style={{minWidth:Math.max(570,130+items.length*190)}} aria-label="재테크 상품 비교"><TableHeader><TableRow><TableHead scope="col">항목</TableHead>{items.map(a=><TableHead scope="col" key={a.id}><button onClick={()=>openDetail(a)}>{a.name}</button><span>{assetGroup(a)}</span></TableHead>)}</TableRow></TableHeader><TableBody>{visible.map(row=><TableRow key={row.id+row.label} className={row.id==='price'?'comparison-price-row':''}><TableHead scope="row">{row.label}</TableHead>{row.values.map((value,i)=><TableCell key={items[i].id}>{value}</TableCell>)}</TableRow>)}</TableBody></Table>
 </section>;
}
