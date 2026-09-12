/* Shared display only. Selection continues to use the existing per-user D-day API. */
(function(root){
  'use strict';
  const DAY=86400000;
  const today=(now=Date.now())=>new Date(now+9*3600000).toISOString().slice(0,10);
  function difference(item,now=Date.now()){
    const value=String(item?.date||''),stamp=Date.parse(value+'T00:00:00Z');
    if(!/^\d{4}-\d{2}-\d{2}$/.test(value)||!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==value)return null;
    return Math.round((stamp-Date.parse(today(now)+'T00:00:00Z'))/DAY);
  }
  function count(item,now=Date.now()){
    const gap=difference(item,now);if(gap===null)return '—';
    if(item.mode==='since')return gap<=0?`D+${1-gap}`:`D-${gap}`;
    return gap===0?'D-DAY':gap>0?`D-${gap}`:`D+${-gap}`;
  }
  const same=(a,b)=>!!a&&!!b&&a.id===b.id&&a.sourceScope===b.sourceScope;
  function presentation(data,now=Date.now()){
    const items=Array.isArray(data?.items)?data.items:[];
    // Retain the established first-accessible fallback. Never rewrite a saved
    // preference because a pair disconnected or its selected row was deleted.
    const featured=items.find(item=>item.id===data.activeId&&item.sourceScope===data.activeScope)||items[0]||null;
    const remaining=items.map((item,index)=>({item,index,gap:difference(item,now)})).filter(row=>!same(row.item,featured));
    remaining.sort((a,b)=>{
      const distance=(a.gap===null?Infinity:Math.abs(a.gap))-(b.gap===null?Infinity:Math.abs(b.gap));
      if(distance)return distance;
      // Both past and future stay visible. At equal distance, the upcoming date
      // comes first; equal-day entries keep the stored order.
      const side=(a.gap<0?1:0)-(b.gap<0?1:0);return side||a.index-b.index;
    });
    return {featured,remaining:remaining.map(row=>row.item)};
  }
  const api=Object.freeze({today,difference,count,presentation,same});root.AiderDdayDisplayV176=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
