(function(root){
  'use strict';
  const KEY='aiderlog-app-calendar-view-v176';
  const day=value=>value instanceof Date?new Date(value.getFullYear(),value.getMonth(),value.getDate(),12):new Date(String(value).slice(0,10)+'T12:00:00');
  const key=value=>`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
  function create(storage,now=()=>new Date()){
    let mode='fortnight',anchor=day(now());
    try{const saved=storage?.getItem(KEY);if(saved==='month'||saved==='fortnight')mode=saved;}catch{}
    function current(){
      const start=mode==='month'?new Date(anchor.getFullYear(),anchor.getMonth(),1,12):day(anchor);
      start.setDate(start.getDate()-start.getDay());
      const count=mode==='month'?42:14,end=day(start);end.setDate(end.getDate()+count-1);
      return {mode,start,end,anchor:day(anchor),count,keys:Array.from({length:count},(_,i)=>{const d=day(start);d.setDate(d.getDate()+i);return key(d);})};
    }
    function focus(value){const next=day(value);if(Number.isFinite(next.getTime()))anchor=next;return current();}
    function toggle(value){
      // Reopen the selected day only when it still belongs to the displayed
      // range; browsing another month must not unexpectedly jump to today.
      const range=current(),candidate=day(value);
      if(Number.isFinite(candidate.getTime())&&candidate>=range.start&&candidate<=range.end)anchor=candidate;
      mode=mode==='month'?'fortnight':'month';
      try{storage?.setItem(KEY,mode);}catch{}
      return current();
    }
    function move(direction){const delta=Number(direction)<0?-1:1;if(mode==='month')anchor=new Date(anchor.getFullYear(),anchor.getMonth()+delta,1,12);else anchor.setDate(anchor.getDate()+delta*14);return current();}
    return Object.freeze({current,focus,toggle,move,today:()=>focus(now())});
  }
  root.AiderAppCalendarViewV176=Object.freeze({create});
})(typeof window==='undefined'?globalThis:window);
