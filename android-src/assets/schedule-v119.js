/* Calendar data bridge only. Rendering and editing belong to the current calendar. */
(function () {
  'use strict';
  let bound=false,generation=0;
  function mergeRows(){
    const rows=new Map();
    Array.from(arguments).flat().filter(Boolean).forEach(row=>{
      const id=String(row.id||`${row.date||''}:${row.time||''}:${row.title||''}`),previous=rows.get(id);
      if(!previous||Number(row.updatedAt||row.createdAt||0)>=Number(previous.updatedAt||previous.createdAt||0))rows.set(id,row);
    });
    return [...rows.values()];
  }
  const scope=state=>`${state?.user?.uid||''}|${state?.pair?.id||''}`;
  function bindScheduleSync(){
    const api=window.AiderDearFirebase;if(bound||!api?.subscribe)return;bound=true;
    api.subscribe(async state=>{
      const token=++generation,actor=scope(state);
      if(!state?.user||!api.readScheduleData)return;
      try{
        const remote=await api.readScheduleData();
        if(token!==generation||actor!==scope(api.getState?.()||state))return;
        // Only this authenticated pair read may attribute older shared rows to
        // the current pair; unscoped cache flags alone never grant visibility.
        const shared=(remote?.shared||[]).map(row=>state.pair?.id?{...row,pairKey:String(state.pair.id)}:row);
        A.scheduleEvents=mergeRows(Array.isArray(A.scheduleEvents)?A.scheduleEvents:[],remote?.own||[],shared);
        window.AiderCalendarSyncV184?.applyCached?.();
        try{localStorage.setItem('aiderlog-app-v20',JSON.stringify(A));}catch{}
        if(activePage==='home'&&typeof renderHome==='function')renderHome();
      }catch(error){console.warn('Schedule read sync skipped',error?.code||'unavailable');}
    });
  }
  window.addEventListener('aiderdear-firebase-ready',bindScheduleSync,{once:true});
  setTimeout(bindScheduleSync,1200);
})();
