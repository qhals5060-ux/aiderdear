/* Read-only calendar projection. Owner scoped, paginated, no legacy Work writes. */
(() => {
 'use strict';
 const owners=new Set(['qhals5060@gmail.com','aidway55@gmail.com']);
 const user=()=>window.AiderDearFirebase?.getState?.().user||{};
 const allowed=()=>!!user().uid&&owners.has(String(user().email||'').toLowerCase());
 let uid='',work=[],pending=null,abort=null,revision=0,lastSuccess=0,error='',ready=false;
 const date=value=>/^\d{4}-\d{2}-\d{2}/.test(String(value||''))?String(value).slice(0,10):'';
 const emit=()=>window.dispatchEvent(new CustomEvent('aiderlog-calendar-projection-v168',{detail:{uid,ready,error}}));
 function identity(){const next=allowed()?user().uid:'';if(next!==uid){abort?.abort();uid=next;work=[];ready=false;error='';lastSuccess=0;pending=null;revision++;emit()}return uid}
 function mapWork(row){const source=['work-task','work-project'].includes(row.source)?row.source:null,id=String(row.id||''),start=date(row.startDate||row.date),end=date(row.endDate)||start;if(!source||!id||!start||end<start)return null;const time=String(row.startTime||row.time||'');return {id:source+':'+id,sourceId:id,projectionSource:source,calendarScope:'work',title:String(row.title||'Work'),date:start,endDate:end,time,endTime:String(row.endTime||''),allDay:!time,readOnly:true,sourceTitle:source==='work-project'?'Work · 프로젝트':'Work · 업무',sourceColor:'#6255E8',category:'work',owner:'mine',authorUid:uid,authorEmail:user().email||'',isAiderDear:false,memo:'Work에서 확인·수정할 수 있습니다.'}}
 function dedupe(rows){return [...new Map(rows.filter(Boolean).map(r=>[r.id,r])).values()]}
 function consultRows(data){if(!identity()||!window.AiderConsultModelV167)return[];const model=window.AiderConsultModelV167;return model.calendar(model.normalize(data||{})).filter(r=>r.status!=='cancelled').map(r=>({id:r.id,sourceId:r.legacyNextSession||r.kind==='target'?r.clientId:r.sourceId,clientId:r.clientId,projectionSource:r.legacyNextSession?'consult-client':'consult-'+r.kind,calendarScope:'consulting',title:r.title||'Consult',date:date(r.date),endDate:date(r.date),time:r.time||'',endTime:'',allDay:!r.time,readOnly:true,sourceTitle:'Consult'+(r.clientName?' · '+r.clientName:''),sourceColor:'#B56A46',category:'consulting',owner:'mine',authorUid:uid,authorEmail:user().email||'',isAiderDear:false,memo:'Consult에서 확인·수정할 수 있습니다.'})).filter(r=>r.date)}
 function rows(data){identity();return uid?dedupe([...consultRows(data),...work]):[]}
 async function refresh(force=false){
  const actor=identity();if(!actor)return[];if(pending)return pending;if(!force&&ready&&Date.now()-lastSuccess<60000)return work.slice();const generation=revision;abort=new AbortController();const signal=abort.signal;
  const run=(async()=>{try{const results=[],seen=new Set();let cursor=null;do{if(actor!==identity()||generation!==revision)return[];const token=await window.AiderDearFirebase.getFirebaseIdToken();if(actor!==identity()||generation!==revision)return[];const response=await fetch('/api/work',{method:'POST',cache:'no-store',credentials:'same-origin',signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({action:'calendar',...(cursor?{cursor}:{})})});const result=await response.json();if(!response.ok)throw Error(result.error||'업무 일정 연결에 실패했습니다.');if(!Array.isArray(result.records))throw Error('업무 일정 형식을 확인할 수 없습니다.');results.push(...result.records);cursor=result.cursor||null;if(cursor&&seen.has(cursor))throw Error('업무 일정 페이지가 반복되었습니다.');if(cursor)seen.add(cursor)}while(cursor);if(actor!==identity()||generation!==revision)return[];work=dedupe(results.map(mapWork));ready=true;error='';lastSuccess=Date.now();emit();return work.slice()}catch(e){if(actor===uid&&generation===revision&&e.name!=='AbortError'){error=e.message||'업무 일정 연결에 실패했습니다.';emit()}return work.slice()}finally{if(actor===uid&&generation===revision)pending=null}})();pending=run;return run;
 }
 const connect=()=>{identity();if(allowed())refresh()};
 ['aiderdear-firebase-state','aiderlog-site-work-updated','aiderlog-app-work-updated','aiderlog-app-consult-updated','online'].forEach(name=>addEventListener(name,()=>{identity();if(name.includes('work-updated'))lastSuccess=0;connect()}));
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')connect()});
 window.AiderWorkCalendarV168=Object.freeze({rows,consultRows,refresh,status:()=>{identity();return{uid,ready,error,lastSuccess}}});
 if(window.AiderDearFirebase?.subscribe)window.AiderDearFirebase.subscribe(connect);connect();
})();
