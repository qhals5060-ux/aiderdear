(() => {
  'use strict';
  const dateKey=value=>{
    const raw=String(value||'').slice(0,10);
    const date=new Date(`${raw}T00:00:00`);
    return Number.isNaN(date.valueOf())?null:date;
  };
  const values=(row,keys)=>keys.flatMap(key=>{
    const value=row?.[key];
    return Array.isArray(value)?value:value?[value]:[];
  }).map(value=>String(value).trim()).filter(Boolean);
  function recentSummary(){
    const rows=window.AiderLogInsightsV126?.rows?.()||[];
    const end=new Date();end.setHours(23,59,59,999);
    const start=new Date(end);start.setDate(start.getDate()-2);start.setHours(0,0,0,0);
    const recent=rows.filter(row=>{const date=dateKey(row.date||row.createdAt||row.day);return date&&date>=start&&date<=end});
    if(!recent.length)return '최근 3일의 감정 기록이 아직 없습니다.';
    const counts=new Map();
    recent.forEach(row=>values(row,['moods','mood','emotions','emotion','feelings','feeling']).forEach(item=>counts.set(item,(counts.get(item)||0)+1)));
    const ranked=[...counts].sort((a,b)=>b[1]-a[1]);
    const top=ranked[0]?.[0];
    const places=[...new Set(recent.flatMap(row=>values(row,['location','place'])))];
    const activities=[...new Set(recent.flatMap(row=>values(row,['currentActivities','activity','action'])))];
    const parts=[`${recent.length}개의 기록`];
    if(top)parts.push(`${top}이(가) 가장 선명했어요`);
    if(activities[0])parts.push(`${activities[0]} 활동이 눈에 띄었어요`);
    else if(places[0])parts.push(`${places[0]}에서의 기록이 눈에 띄었어요`);
    return parts.join(' · ')+'.';
  }
  const emptyCopy=/기록.*쌓이면|기록.*하면|선택하면|분석됩니다|나타납니다|비교할 수 있어요|보여드려요|정리해드려요|기다리고 있어요/;
  function simplifyInsights(){
    const root=document.querySelector('#insights');
    if(!root)return;
    const hero=root.querySelector('.ins-hero-v126');
    if(hero){
      let title=hero.querySelector('h1');
      let summary=hero.querySelector('p');
      if(!title){title=document.createElement('h1');hero.append(title)}
      if(!summary){summary=document.createElement('p');hero.append(summary)}
      title.textContent='마음의 궤적';
      summary.textContent=recentSummary();
      [...hero.children].forEach(child=>{if(child!==title&&child!==summary)child.remove()});
      hero.dataset.v141Simple='1';
    }
    root.querySelectorAll('p,.insight-pattern-v126,.insight-empty-v126').forEach(node=>{
      if(node.closest('.ins-hero-v126'))return;
      if(emptyCopy.test(node.textContent.trim()))node.classList.add('v141-copy-hidden');
    });
  }
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;simplifyInsights()})};
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',queue,{once:true}):queue();
})();
