(function(root){
  'use strict';
  const day=value=>value instanceof Date?new Date(value.getFullYear(),value.getMonth(),value.getDate(),12):new Date(String(value).slice(0,10)+'T12:00:00');
  const key=value=>`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
  function create(storage,now=()=>new Date()){
    // v179: the app calendar is monthly. An old saved fortnight preference
    // must not keep a removed view active after an in-place app update.
    let anchor=day(now());
    function current(){
      const start=new Date(anchor.getFullYear(),anchor.getMonth(),1,12);
      start.setDate(start.getDate()-start.getDay());
      const count=42,end=day(start);end.setDate(end.getDate()+count-1);
      return {mode:'month',start,end,anchor:day(anchor),count,keys:Array.from({length:count},(_,i)=>{const d=day(start);d.setDate(d.getDate()+i);return key(d);})};
    }
    function focus(value){const next=day(value);if(Number.isFinite(next.getTime()))anchor=next;return current();}
    // Harmless compatibility for a cached older caller; the removed W view
    // can no longer restore or persist a fortnight mode.
    function toggle(){return current();}
    function move(direction){const delta=Number(direction)<0?-1:1;anchor=new Date(anchor.getFullYear(),anchor.getMonth()+delta,1,12);return current();}
    return Object.freeze({current,focus,toggle,move,today:()=>focus(now())});
  }
  root.AiderAppCalendarViewV176=Object.freeze({create});
})(typeof window==='undefined'?globalThis:window);
