'use client';
import {useState} from 'react';
import {SlidersHorizontal,ChevronDown} from 'lucide-react';
import {Collapsible,CollapsibleContent,CollapsibleTrigger} from '@/components/ui/collapsible';
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from '@/components/ui/select';
import {Checkbox} from '@/components/ui/checkbox';
import {statusLabels} from './management';
import type {useAssets} from './use-assets';
function Field({label,value,options,onChange}:{label:string;value:string;options:[string,string][];onChange:(value:string)=>void}){
 return <label className="finance-filter-field"><span>{label}</span><Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label}><SelectValue/></SelectTrigger><SelectContent>{options.map(([id,name])=><SelectItem key={id} value={id}>{name}</SelectItem>)}</SelectContent></Select></label>;
}
export function FinanceFilters({store,count}:{store:ReturnType<typeof useAssets>;count:number}){
 const [open,setOpen]=useState(false);
 const {assets,filters,setFilters,view,getManagement}=store;
 const tags=Array.from(new Set(assets.flatMap(a=>getManagement(a.id).tags))).sort((a,b)=>a.localeCompare(b,'ko'));
 const regions=Array.from(new Set(assets.filter(a=>a.kind==='property').map(a=>a.sub.trim().split(/\s+/)[0]))).sort();
 return <Collapsible open={open} onOpenChange={setOpen} className="finance-filter-panel"><CollapsibleTrigger className="finance-filter-toggle"><SlidersHorizontal size={14}/> 필터 {count>0&&<b>{count}</b>}<ChevronDown size={13} className={open?'expanded':''}/></CollapsibleTrigger><CollapsibleContent><div className="finance-filter-fields">
  {view==='property'&&<><Field label="지역" value={filters.region} onChange={region=>setFilters({...filters,region})} options={[['all','모든 지역'],...regions.map(v=>[v,v] as [string,string])]}/><Field label="최대 예산" value={filters.budget} onChange={budget=>setFilters({...filters,budget})} options={[["all","제한 없음"],["1000000000","10억 원 이하"],["1300000000","13억 원 이하"],["1500000000","15억 원 이하"],["2000000000","20억 원 이하"]]}/><Field label="전용 면적" value={filters.area} onChange={area=>setFilters({...filters,area})} options={[["all","모든 면적"],["59","59㎡ 이상"],["84","84㎡ 이상"],["100","100㎡ 이상"]]}/></>}
  <Field label="관리 상태" value={filters.status} onChange={status=>setFilters({...filters,status})} options={[["all","모든 상태"],...Object.entries(statusLabels) as [string,string][]]}/>
  <Field label="태그" value={filters.tag} onChange={tag=>setFilters({...filters,tag})} options={[["all","모든 태그"],...tags.map(v=>[v,v] as [string,string])]}/>
  <label className="finance-filter-note"><Checkbox checked={filters.notesOnly} onCheckedChange={v=>setFilters({...filters,notesOnly:!!v})}/> 메모 있음</label>
 </div></CollapsibleContent></Collapsible>;
}
