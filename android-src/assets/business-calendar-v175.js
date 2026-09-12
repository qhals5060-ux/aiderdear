// The SCHEDULE client receives only a minimal read projection. Editing stays
// inside the original business workspace; no business record enters sharing.
(() => {
  'use strict';
  let dialog;
  function minimal(row){return {id:String(row.id||''),title:String(row.title||''),date:String(row.date||''),endDate:String(row.endDate||row.date||''),time:String(row.time||''),endTime:String(row.endTime||''),allDay:!!row.allDay,projectionSource:String(row.projectionSource||''),calendarScope:String(row.calendarScope||''),sourceTitle:row.calendarScope==='estate'?'부동산 업무':row.calendarScope==='work'?'Work':'Consult',sourceColor:row.sourceColor||'',owner:'mine',authorUid:row.authorUid||'',authorEmail:row.authorEmail||'',readOnly:true,isAiderDear:false,shareWithCouple:false};}
  function open(row){
    if(!window.AiderDearFirebase?.getState?.().user?.uid||!row?.projectionSource)return;
    if(!dialog){dialog=document.createElement('dialog');dialog.id='businessCalendarViewV175';dialog.setAttribute('aria-label','업무 일정 보기');dialog.innerHTML='<header><b>업무 일정</b><button type="button" aria-label="닫기" autofocus>×</button></header><h2></h2><p class="business-calendar-when"></p><p class="business-calendar-source"></p>';dialog.querySelector('button').addEventListener('click',()=>dialog.close());document.body.appendChild(dialog);}
    const event=minimal(row);dialog.querySelector('h2').textContent=event.title;dialog.querySelector('.business-calendar-when').textContent=`${event.date}${event.endDate!==event.date?' ~ '+event.endDate:''} · ${event.time||'종일'}${event.endTime?' ~ '+event.endTime:''}`;dialog.querySelector('.business-calendar-source').textContent=`${event.sourceTitle}에서 등록한 일정 · 여기서는 확인만 할 수 있습니다.`;dialog.showModal();dialog.querySelector('button').focus();
  }
  addEventListener('aiderdear-firebase-state',()=>dialog?.close());
  window.AiderBusinessCalendarV175=Object.freeze({minimal,open});
})();
