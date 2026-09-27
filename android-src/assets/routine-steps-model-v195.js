/* Pure routine-step and timer transitions. No network, storage or DOM access. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.AiderRoutineStepsModelV195=api;})(typeof globalThis==='object'?globalThis:this,function(){
 'use strict';
 const LIMIT=30,MAX_SECONDS=86400,rank={SKIP:0,MINI:1,MORE:2,MAX:3},copy=value=>JSON.parse(JSON.stringify(value));
 function steps(values){
  if(!Array.isArray(values))return [];if(values.length>LIMIT)throw Error('단계는 최대 30개까지 만들 수 있습니다.');
  const ids=new Set();return values.map(value=>{const id=String(value?.id||'').trim(),title=String(value?.title||'').trim(),durationSeconds=Number(value?.durationSeconds);
   if(!id||id.length>100||ids.has(id))throw Error('단계 식별자를 확인해주세요.');ids.add(id);
   if(!title||title.length>80)throw Error('각 단계의 이름을 1~80자로 입력해주세요.');
   if(!Number.isInteger(durationSeconds)||durationSeconds<1||durationSeconds>MAX_SECONDS)throw Error('단계 시간은 1초~24시간으로 입력해주세요.');
   return {...copy(value),id,title,durationSeconds};
  });
 }
 function create(routine,owner,date,now,id){const list=steps(routine.steps);if(!list.length)throw Error('실행할 단계를 먼저 추가해주세요.');if(!owner||!/^\d{4}-\d{2}-\d{2}$/.test(date))throw Error('실행 계정을 확인해주세요.');return {schema:195,id,owner,routineId:String(routine.id),title:String(routine.text||routine.title||'루틴'),date,steps:list,index:0,statuses:list.map(()=>''),elapsedMs:0,remainingMs:list[0].durationSeconds*1000,resumedAt:0,state:'paused',createdAt:now,updatedAt:now};}
 function remaining(run,now){return Math.max(0,run.remainingMs-(run.state==='running'?Math.max(0,now-run.resumedAt):0));}
 function pause(run,now){if(run.state!=='running')return {...run};const left=remaining(run,now);return {...run,remainingMs:left,elapsedMs:run.elapsedMs+Math.max(0,now-run.resumedAt),resumedAt:0,state:'paused',updatedAt:now};}
 function resume(run,now){return run.state==='review'||run.state==='running'?{...run}:{...run,state:'running',resumedAt:now,updatedAt:now};}
 function advance(run,status,now){if(run.state==='review')return {...run};if(!['done','skipped'].includes(status))throw Error('단계 상태를 확인해주세요.');const next=pause(run,now),statuses=next.statuses.slice();statuses[next.index]=status;const index=next.index+1;return {...next,statuses,index,remainingMs:index<next.steps.length?next.steps[index].durationSeconds*1000:0,state:index<next.steps.length?'running':'review',resumedAt:index<next.steps.length?now:0,updatedAt:now};}
 function end(run,now){return {...pause(run,now),state:'review',resumedAt:0,updatedAt:now};}
 function summary(run,now){const frozen=pause(run,now),completed=frozen.statuses.filter(x=>x==='done').length,skipped=frozen.statuses.filter(x=>x==='skipped').length,total=frozen.steps.length;return {runId:run.id,completed,total,skipped,remaining:total-completed-skipped,elapsedSeconds:Math.floor(frozen.elapsedMs/1000),finishedAt:now};}
 function finish(routine,run,now){if(run.state!=='review')throw Error('실행을 마친 뒤 기록을 저장해주세요.');if(String(routine.id)!==run.routineId)throw Error('루틴이 변경되었습니다.');const result=copy(routine),record=summary(run,now),completed=record.completed,total=record.total,newLevel=completed===total?'MAX':completed>=Math.ceil(total/2)?'MORE':completed>0?'MINI':'';
  if(newLevel){const existing=String(result.dailyLevels?.[run.date]||'').toUpperCase();result.dailyLevels={...(result.dailyLevels||{})};if((rank[newLevel]||0)>(rank[existing]||0))result.dailyLevels[run.date]=newLevel;result.doneDates=Array.from(new Set([...(Array.isArray(result.doneDates)?result.doneDates:[]),run.date]));}
  const history={...(result.stepHistory||{}),[run.date]:{...(result.stepHistory?.[run.date]||{}),...record}};result.stepHistory=Object.fromEntries(Object.keys(history).sort().slice(-30).map(date=>[date,history[date]]));result.updatedAt=now;return result;
 }
 function restore(value,owner){try{const run=copy(value);if(run.schema!==195||run.owner!==owner||!run.id||!run.routineId||!/^\d{4}-\d{2}-\d{2}$/.test(run.date))return null;run.steps=steps(run.steps);if(!run.steps.length||!Number.isInteger(run.index)||run.index<0||run.index>run.steps.length||!['running','paused','review'].includes(run.state)||run.index===run.steps.length&&run.state!=='review')return null;if(!Array.isArray(run.statuses)||run.statuses.length!==run.steps.length||run.statuses.some(s=>!['','done','skipped'].includes(s)))return null;if(![run.elapsedMs,run.remainingMs,run.resumedAt,run.createdAt,run.updatedAt].every(Number.isFinite)||run.elapsedMs<0||run.remainingMs<0||run.remainingMs>MAX_SECONDS*1000)return null;return run;}catch{return null;}}
 return Object.freeze({LIMIT,MAX_SECONDS,steps,create,remaining,pause,resume,advance,end,summary,finish,restore});
});
