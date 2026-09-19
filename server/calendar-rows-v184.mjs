function canonical(value) {
  if(Array.isArray(value))return value.map(canonical);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().map(key=>[key,canonical(value[key])]));
  return value;
}
export function sameRows(left,right) {return JSON.stringify(canonical(left))===JSON.stringify(canonical(right));}
export function mergeProviderRows(previous,provider,rows,uid,email,coverage=null) {
  const old=Array.isArray(previous)?previous:[];
  const byId=new Map(old.filter(row=>row?.externalSource===provider).map(row=>[String(row.id),row]));
  const unique=new Map();
  // A bounded provider query is not evidence that older/future records were
  // deleted. Retain records outside the calendars/date range actually fetched.
  if(coverage){
    const calendars=new Set(coverage.calendarIds||[]),fromValue=String(coverage.from||''),toValue=String(coverage.to||''),from=fromValue.slice(0,10),to=toValue.slice(0,10);
    for(const row of byId.values()){
      // Imported rows do not retain the provider's original timezone. Keep the
      // whole boundary day instead of treating a partial-day query as complete.
      const date=String(row.date||''),end=String(row.endDate||date),covered=calendars.has(String(row.calendarId))&&(!from||(fromValue.includes('T')?end>from:end>=from))&&(!to||(toValue.includes('T')?date<to:date<=to));
      if(!covered)unique.set(String(row.id),row);
    }
  }
  for(const row of rows){
    if(!row?.id)continue;
    const before=byId.get(String(row.id));
    unique.set(String(row.id),{...row,...(before?.createdAt?{createdAt:before.createdAt}:{}),authorEmail:email,authorUid:uid,owner:row.shareWithCouple||row.owner==='shared'?'shared':'mine',pairKey:before?.pairKey||''});
  }
  return [...old.filter(row=>row?.externalSource!==provider),...[...unique.values()].sort((a,b)=>String(a.date).localeCompare(String(b.date))||String(a.time||'').localeCompare(String(b.time||''))||String(a.id).localeCompare(String(b.id)))];
}
