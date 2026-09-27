/* Pure, owner-scoped widget view models. No storage writes and no demonstration fallbacks. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AiderWidgetModelsV165=api;})(typeof globalThis==='object'?globalThis:this,function(){
  'use strict';
  const list=x=>Array.isArray(x)?x:[],s=x=>String(x??'').trim(),num=x=>x===null||x===''||x===undefined?null:Number.isFinite(Number(x))?Number(x):null;
  const day=d=>{const x=d instanceof Date?d:new Date(d);return Number.isFinite(x.getTime())?`${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,'0')}-${String(x.getDate()).padStart(2,'0')}`:''};
  const at=d=>new Date(`${s(d).slice(0,10)}T12:00:00`),shift=(d,n)=>{const x=at(d);x.setDate(x.getDate()+n);return day(x)};
  const text=r=>s(r?.text||r?.title||r?.name||r?.note),time=r=>Number(r.updatedAt||r.createdAt||0),latest=(a,b)=>time(b)-time(a),unique=x=>[...new Set(x.filter(Boolean))];
  const percent=(n,total)=>total>0?Math.max(0,Math.min(100,Math.round(n/total*100))):null;
  const norm=x=>s(x).normalize('NFKC').replace(/\s+/g,' ').toLowerCase();
  const bookKey=r=>s(r.bookId||r.details?.bookId)||`book:${norm(r.title)}|${norm(r.details?.author||r.author)}`;
  function streak(dates,today,latestAllowed=false){const set=new Set(dates),sorted=[...set].filter(x=>x<=today).sort();let cursor=set.has(today)?today:latestAllowed?sorted.at(-1):shift(today,-1),n=0;while(cursor&&set.has(cursor)){n++;cursor=shift(cursor,-1)}return n;}
  function week(today){const start=at(today);start.setDate(start.getDate()-(start.getDay()+6)%7);return Array.from({length:7},(_,n)=>shift(day(start),n));}
  function todoCompare(a,b){if(!!a.done!==!!b.done)return a.done?1:-1;if(a.done)return Number(b.completedAt||b.updatedAt||b.createdAt||0)-Number(a.completedAt||a.updatedAt||a.createdAt||0);const ad=s(a.dueAt||a.date),bd=s(b.dueAt||b.date);return ad&&bd?ad.localeCompare(bd):ad?-1:bd?1:Number(b.createdAt||0)-Number(a.createdAt||0);}
  function practicedDates(row,today){const levels=row.dailyLevels||{};return unique([...list(row.doneDates).map(x=>s(x).slice(0,10)),...Object.keys(levels).filter(d=>['MINI','MORE','MAX'].includes(s(levels[d]).toUpperCase()))]).filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&day(at(d))===d&&d<=today&&s(levels[d]).toUpperCase()!=='SKIP').sort();}
  function build({app={},personal={},uid='',now=new Date(),photo=()=>'',routineEngine=null}={}){
    const today=day(now),weekDates=week(today),checks=list(personal.checklists).filter(r=>r&&r.category!=='emotion'&&!r.demo);
    const memoRows=[...checks.filter(r=>r.kind==='memo'||r.type==='memo').map(r=>({...r,source:'checklists'})),...list(personal.memos).map(r=>({...r,source:'memos'}))].filter(r=>r&&s(r.id)&&text(r)&&r.category!=='emotion'&&!r.demo).sort(latest);
    const notesById=new Map();for(const r of memoRows){const key=r.source+':'+s(r.id);if(!notesById.has(key))notesById.set(key,{id:s(r.id),source:r.source,title:text(r).slice(0,180),preview:s(r.notes||r.note||r.preview||r.description).slice(0,240),updatedAt:time(r),kind:'note'});}const notes=[...notesById.values()].slice(0,40);
    const todos=checks.filter(r=>r.kind!=='memo'&&r.type!=='memo').sort(todoCompare).map(r=>({id:s(r.id),title:text(r),done:!!r.done,dueAt:s(r.dueAt||r.date),createdAt:Number(r.createdAt||0),updatedAt:time(r),completedAt:Number(r.completedAt||0),kind:'todo'}));
    const incompleteTodos=todos.filter(row=>!row.done&&row.id&&row.title);
    const routines=list(personal.routines).filter(r=>r&&!r.demo).map(r=>{const dates=practicedDates(r,today),goal=num(r.goalDays),level=s(r.dailyLevels?.[today]).toUpperCase(),engine=routineEngine?.(r)||{};return {id:s(r.id),title:text(r),goalDays:goal,cycleDays:num(r.cycleDays),goalTracking:r.goalTracking||null,goalDerivedDates:r.goalDerivedDates||{},doneDates:dates,dailyLevels:r.dailyLevels||{},miniText:s(r.miniText),moreText:s(r.moreText),maxText:s(r.maxText),done:dates.length,percent:percent(dates.length,goal),level:['MINI','MORE','MAX','SKIP'].includes(level)?level:'',streak:num(engine.streak)??streak(dates,today,true),weekDates,week:weekDates.map(d=>dates.includes(d)),updatedAt:time(r),kind:'routine'};});
    const routineCounts=weekDates.map(d=>routines.filter(r=>r.doneDates.includes(d)).length),allRoutineDates=unique(routines.flatMap(r=>r.doneDates));
    const routineWeek=routines.filter(r=>r.week.some(Boolean)).map(r=>({id:r.id,title:r.title,week:r.week,weekCount:r.week.filter(Boolean).length,updatedAt:r.updatedAt,kind:"routineWeek"}));
    const routineStats={practiced:routineWeek.length,weekTotal:routineCounts.reduce((a,b)=>a+b,0),todayDone:routines.filter(r=>r.doneDates.includes(today)).length,total:routines.length,weekDates,weekCounts:routineCounts,weekPercent:percent(routineCounts.reduce((a,b)=>a+b,0),routines.length*7),streak:streak(allRoutineDates,today,true),cumulative:routines.reduce((n,r)=>n+r.done,0)};
    return {schema:195,uid,today,weekDates,notes,todos,incompleteTodos,routines,routineWeek,routineStats,dates:{}};
  }
  return {build,practicedDates,todoCompare,bookKey,streak,week,day,shift,percent};
});
