/* Android presentation only; the existing routine store and handlers own edits. */
(() => {
  'use strict';
  const root=document.getElementById('routine');
  if(!root||typeof window.renderRoutine!=='function')return;
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const practiced=value=>['MINI','MORE','MAX'].includes(String(value||'').toUpperCase());
  const key=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  const weekdays=['일','월','화','수','목','금','토'];
  function overview(){
    const routines=typeof P!=='undefined'&&Array.isArray(P.routines)?P.routines:[],date=typeof today==='function'?today():key(new Date());
    const days=Array.from({length:7},(_,index)=>{const d=new Date(date+'T12:00:00');d.setDate(d.getDate()-6+index);const stamp=key(d);return{date:stamp,label:weekdays[d.getDay()],day:d.getDate(),count:routines.filter(row=>practiced(row.dailyLevels?.[stamp])).length};});
    const metrics=routines.map(row=>({row,metric:typeof routineMetrics==='function'?routineMetrics(row):null}));
    const todayCount=days[6].count,weekCount=days.reduce((sum,day)=>sum+day.count,0),streak=Math.max(0,...metrics.map(({metric})=>Number(metric?.streak)||0));
    const goals=typeof P!=='undefined'?(Array.isArray(P.routineBigGoals)?P.routineBigGoals:Array.isArray(P.routineGoals)?P.routineGoals:[]):[];
    return `<section class="r187-overview-card"><header><h2>실천 현황</h2><button type="button" data-r165-tab="statistics" aria-label="루틴 통계 보기">통계 <span aria-hidden="true">›</span></button></header><div class="r187-totals"><div><span>오늘</span><b>${todayCount}<small> / ${routines.length}</small></b></div><div><span>최근 7일</span><b>${weekCount}<small>회</small></b></div><div><span>회차 최장</span><b>${streak}<small>일</small></b></div></div><div class="r187-week" aria-label="최근 7일 실천 루틴 수">${days.map(day=>`<div class="${day.date===date?'today':''}" aria-label="${day.date}, ${day.count}개 실천"><span>${day.label}</span><b class="${day.count?'has-practice':''}">${day.count}</b><small>${day.day}</small></div>`).join('')}</div></section><section class="r187-overview-card r187-rounds"><header><h2>회차 진행</h2></header>${metrics.map(({row,metric})=>{const completion=Math.max(0,Math.min(100,Number(metric?.completion)||0));return `<div class="r187-round"><div><b>${safe(row.text||row.title||'Routine')}</b><span>${completion}%</span></div><div class="r187-track" role="progressbar" aria-label="${safe(row.text||row.title||'Routine')} 현재 회차 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${completion}"><i style="width:${completion}%"></i></div></div>`;}).join('')||'<p class="r187-empty">등록된 루틴 없음</p>'}</section><section class="r187-overview-card r187-goals"><header><h2>큰 목표</h2><button type="button" data-r165-tab="mandala" aria-label="큰 목표 편집하기">편집 <span aria-hidden="true">›</span></button></header>${goals.filter(goal=>String(goal||'').trim()).map((goal,index)=>`<p><span>${String(index+1).padStart(2,'0')}</span><b>${safe(goal)}</b></p>`).join('')||'<p class="r187-empty">설정된 목표 없음</p>'}</section>`;
  }
  function decorate(){
    root.classList.add('routine-refine-v187');
    const pane=root.querySelector('.r165-content');if(!pane||pane.dataset.refinedV187)return;
    pane.dataset.refinedV187='';
    if(pane.dataset.tab==='practice'){
      const list=pane.querySelector('.r165-practice-list'),heading=pane.querySelector('.r165-section-heading');if(!list)return;
      const workspace=document.createElement('div');workspace.className='r187-workspace';
      const main=document.createElement('section');main.className='r187-practice';main.setAttribute('aria-label','오늘의 루틴');
      if(heading)main.append(heading);main.append(list);
      const side=document.createElement('aside');side.className='r187-overview';side.setAttribute('aria-label','실천 현황과 목표');side.innerHTML=overview();
      workspace.append(main,side);pane.append(workspace);
      for(const button of list.querySelectorAll('.r165-recent [data-routine-date]')){
        const date=new Date(button.dataset.routineDate+'T12:00:00'),label=button.querySelector('span');
        if(label)label.textContent=weekdays[date.getDay()]+' '+date.getDate();
      }
    }
  }
  const previous=window.renderRoutine;
  window.renderRoutine=function(...args){const result=previous.apply(this,args);decorate();return result;};
  window.AiderRoutineRefineV187=Object.freeze({refresh:decorate});
  decorate();
})();
