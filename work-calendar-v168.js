/* Consult calendar projection from the already loaded private snapshot.
 * The historic AiderWorkCalendarV168 name is retained for installed consumers;
 * WORK has no projection, subscriptions, polling, token requests or API calls. */
(() => {
 'use strict';
 const owners=new Set(['qhals5060@gmail.com','aidway55@gmail.com']);
 const user=()=>window.AiderDearFirebase?.getState?.().user||{};
 const allowed=()=>!!user().uid&&owners.has(String(user().email||'').toLowerCase());
 const date=value=>/^\d{4}-\d{2}-\d{2}/.test(String(value||''))?String(value).slice(0,10):'';
 function consultRows(data){
  if(!allowed()||!window.AiderConsultModelV167)return[];
  const model=window.AiderConsultModelV167,actor=user();
  return model.calendar(model.normalize(data||{})).filter(r=>r.status!=='cancelled').map(r=>({id:r.id,sourceId:r.legacyNextSession||r.kind==='target'?r.clientId:r.sourceId,clientId:r.clientId,projectionSource:r.legacyNextSession?'consult-client':'consult-'+r.kind,calendarScope:'consulting',title:r.title||'Consult',date:date(r.date),endDate:date(r.date),time:r.time||'',endTime:'',allDay:!r.time,readOnly:true,sourceTitle:'Consult'+(r.clientName?' · '+r.clientName:''),sourceColor:'#B56A46',category:'consulting',owner:'mine',authorUid:actor.uid,authorEmail:actor.email||'',isAiderDear:false,memo:'Consult에서 확인·수정할 수 있습니다.'})).filter(r=>r.date);
 }
 const rows=data=>[...new Map(consultRows(data).map(r=>[r.id,r])).values()];
 window.AiderWorkCalendarV168=Object.freeze({rows,consultRows,refresh:async()=>[],status:()=>({uid:allowed()?user().uid:'',ready:true,error:'',lastSuccess:0})});
})();
