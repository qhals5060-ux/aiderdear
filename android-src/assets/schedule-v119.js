/* Calendar data bridge only. Rendering and editing belong to the current calendar. */
(function () {
  'use strict';
  let bound=false,generation=0,activeScope='',stop=null,verified=null,pending=null;
  function mergeRows(){
    const rows=new Map();
    Array.from(arguments).flat().filter(Boolean).forEach(row=>{
      const id=String(row.id||`${row.date||''}:${row.time||''}:${row.title||''}`),previous=rows.get(id);
      if(!previous||Number(row.updatedAt||row.createdAt||0)>=Number(previous.updatedAt||previous.createdAt||0))rows.set(id,row);
    });
    return [...rows.values()];
  }
  const scope=state=>`${state?.user?.uid||''}|${state?.pair?.id||''}|${state?.partner?.uid||''}`;
  function applyCached(){
    const state=window.AiderDearFirebase?.getState?.();
    if(!verified||verified.scope!==scope(state)||verified.uid!==String(state?.user?.uid||''))return false;
    const remote=verified.payload,shared=(remote.shared||[]).map(row=>state.pair?.id?{...row,pairKey:String(state.pair.id)}:row);
    // A late app/main payload can contain an older copy of the same schedule.
    // The dedicated schedule snapshot wins for its IDs; other legacy rows stay.
    const incoming=mergeRows(remote.own||[],shared),ids=new Set(incoming.map(row=>String(row.id)));
    A.scheduleEvents=mergeRows((Array.isArray(A.scheduleEvents)?A.scheduleEvents:[]).filter(row=>!ids.has(String(row.id))),incoming);
    return true;
  }
  function flush(){
    if(!pending||document.querySelector('.overlay.on,dialog[open],input:focus,textarea:focus'))return;
    pending=null;if(!applyCached())return;
    window.AiderCalendarSyncV184?.applyCached?.();
    try{localStorage.setItem('aiderlog-app-v20',JSON.stringify(A));}catch{}
    if(activePage==='home'&&typeof renderHome==='function')renderHome();
  }
  window.AiderAppScheduleV191=Object.freeze({snapshot:()=>verified,applyCached});
  function bindScheduleSync(){
    const api=window.AiderDearFirebase;if(bound||!api?.subscribe)return;bound=true;
    api.subscribe(state=>{
      const actor=scope(state);if(actor===activeScope||state.ready===false&&state.user)return;
      activeScope=actor;const token=++generation;try{stop?.();}catch{}stop=null;verified=null;pending=null;
      if(!state?.user)return;
      const receive=remote=>{
        if(token!==generation||actor!==scope(api.getState?.()||state))return;
        if(!Array.isArray(remote?.own)||!Array.isArray(remote?.shared))return;
        verified={uid:String(state.user.uid),pairId:String(state.pair?.id||''),scope:actor,payload:JSON.parse(JSON.stringify(remote))};
        window.dispatchEvent(new CustomEvent('aiderlog:verified-schedule-data-v191',{detail:verified}));
        pending={remote:verified.payload,state};flush();
      };
      try{if(typeof api.watchScheduleData==='function')stop=api.watchScheduleData(receive);
        else if(api.readScheduleData)Promise.resolve(api.readScheduleData()).then(receive).catch(error=>console.warn('Schedule read sync skipped',error?.code||'unavailable'));
      }catch(error){console.warn('Schedule listener unavailable',error?.code||'unavailable');}
    });
  }
  document.addEventListener('focusout',()=>setTimeout(flush,0));document.addEventListener('click',()=>setTimeout(flush,0),{passive:true});
  window.addEventListener('aiderdear-firebase-ready',bindScheduleSync,{once:true});
  setTimeout(bindScheduleSync,1200);
})();
