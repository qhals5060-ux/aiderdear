(function(root){
  'use strict';
  // Presentation only. The original ISO dates and 24-hour time values stay intact.
  function parts(value){const row=typeof value==='object'&&value?value:null;if(row?.allDay)return null;const match=String(row?row.time||'':value||'').match(/^([01]\d|2[0-3]):([0-5]\d)(?::\d\d)?$/);return match?{hour:Number(match[1]),minute:Number(match[2])}:null;}
  function format(value){const p=parts(value);return p?`${p.hour%12||12}시${p.minute?' '+p.minute+'분':''}`:'';}
  function group(row){if(row?.allDay||!row?.time)return 'allDay';const p=parts(row);return p?(p.hour<12?'am':'pm'):'unknown';}
  function ordered(rows){const weight={allDay:0,am:1,pm:2,unknown:3};return [...rows].sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||weight[group(a)]-weight[group(b)]||String(a.time||'').localeCompare(String(b.time||'')));}
  function entries(rows){let previous=null;return ordered(rows).map(row=>{const separatorBefore=!!previous&&previous.date===row.date&&group(previous)==='am'&&group(row)==='pm';previous=row;return {row,separatorBefore};});}
  root.AiderScheduleTimeV179=Object.freeze({format,group,ordered,entries});
})(typeof window!=='undefined'?window:globalThis);
