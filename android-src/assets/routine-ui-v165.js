/* Routine presentation. Existing cycle, metrics, CRUD and private sync remain authoritative. */
(() => {
  'use strict';
  const root=document.getElementById('routine');
  if(!root||typeof window.renderRoutine!=='function')return;
  const previousRender=window.renderRoutine;
  const tabs=[['practice','실천'],['mandala','만다라트'],['statistics','통계']];
  const levels=['MINI','MORE','MAX','SKIP'];
  const marks={MINI:'•',MORE:'••',MAX:'★',SKIP:'−'};
  const state={tab:'practice',scroll:{},goals:new Map(),editor:new Map(),lastEditor:null,owner:null,selectedGoal:0,saving:new Set()};
  const html=value=>esc(String(value??''));
  const uid=()=>String(authState?.user?.uid||authState?.user?.email||authState?.uid||'local');
  root.classList.add('routine-ui-v165');
  root.dataset.cssTypography='';

  function capture(){
    const owner=uid();
    if(state.owner!==null&&owner!==state.owner){state.goals.clear();state.editor.clear();state.scroll={};state.tab='practice';state.owner=owner;state.lastEditor=null;return}
    state.owner=owner;
    const pane=root.querySelector('.r165-content');if(pane)state.scroll[pane.dataset.tab]=pane.scrollTop;
    root.querySelectorAll('[data-r165-goal-form]').forEach(form=>{
      const index=Number(form.dataset.goalIndex),draft=state.goals.get(index)||{};
      draft.goal=form.elements['goal'+index].value;
      draft.cells=Array.from({length:8},(_,i)=>form.elements['mandala'+i].value);
      state.goals.set(index,draft);
    });
    const key=routineEditorIdV111===null?null:String(routineEditorIdV111);
    if(state.lastEditor!==null&&key!==state.lastEditor)state.editor.delete(state.lastEditor);
    const form=root.querySelector('#routineEditorFormV111');
    if(form&&key!==null&&String(form.dataset.routineId)===key)state.editor.set(key,Object.fromEntries(new FormData(form)));
    state.lastEditor=key;
  }

  function practiceHTML(){
    const stamp=new Date(today()+'T12:00:00').toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'short'});
    return `<header class="r165-section-heading"><h2>오늘의 실천</h2><time datetime="${today()}">${html(stamp)}</time></header><div class="r165-practice-list">${(P.routines||[]).map(r=>{
      const metric=routineMetrics(r),chosen=String(r.dailyLevels?.[today()]||'').toUpperCase();
      const recent=metric.cycle.dates.filter(date=>date<=today()).slice(-7);
      const copy={MINI:r.miniText||'5분만 시작하기',MORE:r.moreText||'20분 집중하기',MAX:r.maxText||'충분히 끝내기',SKIP:'쉬어가기'};
      return `<article class="r165-practice-card" data-routine-palette="${routinePaletteKey(r.color)}" style="--routine-color:${routineColor(r)}"><header><h3><i aria-hidden="true"></i>${html(r.text||r.title||'Routine')}</h3><button type="button" data-routine-open="${html(r.id)}">상세</button></header><p class="r165-cycle-caption">${metric.cycle.day} / ${metric.cycle.goal}일 · 이번 회차 ${metric.practice}회 실천</p><div class="r165-recent" aria-label="최근 실천 기록">${recent.map(date=>{
        const level=String(r.dailyLevels?.[date]||'').toUpperCase();return `<button type="button" data-routine-date="${date}" data-routine-id="${html(r.id)}" class="${routineStatus(level)} ${date===today()?'today':''}" aria-label="${date} ${level||'무기록'}, 단계 변경"><span>${date.slice(5).replace('-','.')}</span><b aria-hidden="true">${marks[level]||'·'}</b></button>`;
      }).join('')}</div><div class="r165-levels">${levels.map(level=>`<button type="button" data-routine-level="${level}" data-routine-id="${html(r.id)}" class="${chosen===level?'active':''}" aria-pressed="${chosen===level}"><b>${level}</b><span>${html(copy[level])}</span></button>`).join('')}</div></article>`;
    }).join('')||'<p class="r165-empty">저장된 루틴이 없습니다. 위의 + 루틴으로 추가하세요.</p>'}</div>`;
  }

  function goalDraft(index){
    if(!state.goals.has(index))state.goals.set(index,{goal:P.routineBigGoals[index]||'',cells:[...P.routineMandalaByGoal[String(index)]],editing:false,dirty:false});
    const draft=state.goals.get(index);
    if(!draft.dirty&&!draft.editing&&!state.saving.has(index)){draft.goal=P.routineBigGoals[index]||'';draft.cells=[...P.routineMandalaByGoal[String(index)]]}
    return draft;
  }
  function goalName(index){return goalDraft(index).goal||`큰 목표 ${index+1}`}
  function mandalaHTML(){
    routineGoalWorkspaceV111();
    return `<header class="r165-section-heading"><h2>나의 큰 목표</h2></header><nav class="r165-goal-shortcuts" aria-label="큰 목표 바로가기">${[0,1,2].map(i=>`<button type="button" data-r165-goal-jump="${i}" class="${state.selectedGoal===i?'active':''}" aria-current="${state.selectedGoal===i?'true':'false'}"><span data-r165-goal-name="${i}">${html(goalName(i))}</span></button>`).join('')}</nav><div class="r165-mandalas">${[0,1,2].map(index=>{
      const draft=goalDraft(index);let cellIndex=0;
      const cells=Array.from({length:9},(_,position)=>{
        if(position===4)return `<div class="r165-mandala-center"><span data-r165-goal-name="${index}">${html(goalName(index))}</span></div>`;
        const n=cellIndex++;return `<label class="r165-mandala-cell"><span class="r165-cell-number">${n+1}</span><textarea name="mandala${n}" maxlength="100" rows="1" aria-label="${index+1}번 큰 목표의 실행 목표 ${n+1}" placeholder="실행 목표">${html(draft.cells[n])}</textarea></label>`;
      }).join('');
      return `<form id="routineGoalCardV165-${index}" class="r165-goal-card" data-r165-goal-form data-goal-index="${index}"><header><h3 data-r165-goal-name="${index}">${html(goalName(index))}</h3><button type="button" data-r165-goal-edit="${index}" aria-expanded="${!!draft.editing}">목표 편집</button></header><label class="r165-goal-name-editor" ${draft.editing?'':'hidden'}>큰 목표 이름<textarea name="goal${index}" maxlength="120" rows="1">${html(draft.goal)}</textarea></label><div class="r165-mandala-grid">${cells}</div><footer><span>실행 목표 8개</span><small data-r165-goal-status="${index}" role="status">${draft.message|| (draft.dirty?'저장 전':'')}</small><button type="submit" ${state.saving.has(index)?'disabled':''}>${state.saving.has(index)?'저장 중…':'저장'}</button></footer></form>`;
    }).join('')}</div>`;
  }

  function statisticsHTML(){
    const snapshot=window.AiderLogRoutineStatisticsV125?.snapshot?.();
    if(!snapshot)return '<p class="r165-empty">통계를 준비하고 있습니다.</p>';
    const {routines,stats,daily,levelCounts,weekday,bestDay,weekNames,maxDaily,totalLevels}=snapshot;
    const comparison=routines.map(r=>{
      const m=routineMetrics(r);
      return `<article class="r165-comparison-row" style="--routine-color:${routineColor(r)}" data-r165-stat-id="${html(r.id)}"><div class="r165-comparison-values"><b>${html(r.text||r.title||'Routine')}</b><span data-stat="practice">${m.practice}<small>회</small></span><span data-stat="streak">${m.streak}<small>일</small></span><strong data-stat="completion">${m.completion}<small>%</small></strong></div><div class="r165-progress" role="progressbar" aria-label="${html(r.text||r.title)} 현재 회차 완료율" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${m.completion}"><i style="width:${m.completion}%"></i></div><p>${m.cycle.day}일차 · 목표 ${m.cycle.goal}일</p></article>`;
    }).join('');
    const tickStep=Math.max(1,Math.ceil(maxDaily/4)),ticks=[0];for(let value=tickStep;value<maxDaily;value+=tickStep)ticks.push(value);if(maxDaily>0)ticks.push(maxDaily);
    const distributionTotal=Object.values(levelCounts).reduce((sum,value)=>sum+value,0);
    return `<section class="r165-summary" aria-label="루틴 전체 요약"><div><span>30일 실천</span><b data-summary="practice">${stats.practice}<small>회</small></b></div><div><span>30일 완료율</span><b data-summary="rate">${stats.rate}<small>%</small></b></div><div aria-label="각 루틴 현재 회차의 최장 연속 중 최댓값"><span>회차 최장</span><b data-summary="streak">${stats.streak}<small>일</small></b></div><div><span>활성 루틴</span><b data-summary="count">${stats.count}<small>개</small></b></div></section><section class="r165-stat-card r165-comparison"><header><h2>루틴별 비교</h2><span>현재 회차</span></header><div class="r165-comparison-labels"><span>루틴 이름</span><span>실천</span><span>최장연속</span><span>완료율</span></div>${comparison||'<p class="r165-empty-inline">아직 등록된 루틴이 없습니다.</p>'}</section><section class="r165-stat-card"><header><h2>최근 14일 흐름</h2><span>하루 실천 루틴 수</span></header><p class="r165-chart-range">${daily[0].date} — ${daily[daily.length-1].date}</p><div class="r165-chart"><div class="r165-chart-axis">${ticks.map(value=>`<span style="bottom:${value/maxDaily*100}%">${value}</span>`).join('')}</div><div class="r165-day-bars">${daily.map(point=>`<div class="r165-day-bar" aria-label="${point.date}, ${point.value}개" data-date="${point.date}" data-value="${point.value}"><div><i style="height:${point.value/maxDaily*100}%"></i></div><span>${point.date.slice(8)}</span></div>`).join('')}</div></div></section><section class="r165-stat-card"><header><h2>단계 분포</h2><span>전체 기록</span></header><div class="r165-distribution">${levels.map(level=>`<div data-level="${level}"><span>${level}</span><i><em style="width:${Math.round(levelCounts[level]/totalLevels*100)}%"></em></i><b>${levelCounts[level]}<small>회</small></b></div>`).join('')}</div><p class="r165-weekday">${weekday.some(Boolean)?`가장 자주 실천한 요일 · <b>${weekNames[bestDay]}요일</b>`:'아직 실천 기록이 없습니다.'}</p>${distributionTotal?'':'<p class="r165-empty-inline">저장된 단계 기록이 없습니다.</p>'}</section>`;
  }

  function autoSize(field){
    if(!field||field.hidden||!field.getClientRects().length)return;
    field.style.height='0px';field.style.height=Math.max(field.closest('.r165-mandala-cell')?94:44,field.scrollHeight+2)+'px';
  }
  function viewport(){
    const vv=window.visualViewport;root.style.setProperty('--r165-viewport-height',(vv?.height||innerHeight)+'px');root.style.setProperty('--r165-viewport-top',(vv?.offsetTop||0)+'px');
  }
  function restoreEditor(){
    const form=root.querySelector('#routineEditorFormV111');if(!form)return;
    const draft=state.editor.get(String(form.dataset.routineId));
    if(draft)for(const [name,value]of Object.entries(draft)){const input=form.elements[name];if(input)input.value=value}
    const body=document.createElement('div');body.className='r165-editor-fields';
    const actions=form.querySelector('.routine-detail-actions');
    [...form.children].filter(node=>node!==actions).forEach(node=>body.append(node));form.prepend(body);
    body.querySelector('.routine-detail-card > h3')?.remove();
    const heading=form.closest('.routine-detail-sheet').querySelector('h2');if(heading)heading.textContent=form.dataset.routineId?'루틴 설정':'루틴 추가';
    for(const [selector,title]of [['.routine-name-field-v122','루틴 이름'],['.routine-goal-color-v127 > label','목표 기간']]){
      const label=body.querySelector(selector);label?.childNodes.forEach(node=>{if(node.nodeType===Node.TEXT_NODE)node.textContent=title});
    }
    const legend=body.querySelector('.routine-color-field-v122 legend');if(legend)legend.textContent='표시 색상';
    const levelsNode=body.querySelector('.routine-level-copy');if(levelsNode){const label=document.createElement('h3');label.className='r165-level-title';label.textContent='실천 단계';levelsNode.before(label)}
  }
  function selectedGoal(){
    if(state.tab!=='mandala')return;
    const pane=root.querySelector('.r165-content');if(!pane)return;
    const top=pane.getBoundingClientRect().top;
    const cards=[...pane.querySelectorAll('[data-r165-goal-form]')];
    const visible=cards.find(card=>card.getBoundingClientRect().bottom>top+100)||cards[cards.length-1];
    if(visible)state.selectedGoal=Number(visible.dataset.goalIndex);
    root.querySelectorAll('[data-r165-goal-jump]').forEach(button=>{const active=Number(button.dataset.r165GoalJump)===state.selectedGoal;button.classList.toggle('active',active);button.setAttribute('aria-current',String(active))});
  }

  window.renderRoutine=function(...args){
    capture();routineOverallOpen=false;routineMandalaOpenV111=false;
    const result=previousRender.apply(this,args),page=root.querySelector(':scope > .page');if(!page)return result;
    const overlays=[...page.querySelectorAll(':scope > .routine-detail-overlay')];
    const header=page.querySelector(':scope > .barebar');
    header.querySelector('[data-routine-overall]')?.remove();
    const create=header.querySelector('[data-routine-create-open]');if(create)create.textContent='+ 루틴';
    page.className='page routine-ui-page-v165';header.classList.add('r165-header');
    page.replaceChildren(header);
    const nav=document.createElement('nav');nav.className='r165-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','루틴 화면');
    nav.innerHTML=tabs.map(([id,label])=>`<button type="button" role="tab" id="routineTabV165-${id}" aria-controls="routinePanelV165" aria-selected="${id===state.tab}" data-r165-tab="${id}" class="${id===state.tab?'active':''}">${label}</button>`).join('');page.append(nav);
    const pane=document.createElement('div');pane.className='r165-content';pane.id='routinePanelV165';pane.dataset.tab=state.tab;pane.setAttribute('role','tabpanel');pane.setAttribute('aria-labelledby','routineTabV165-'+state.tab);
    pane.innerHTML=state.tab==='practice'?practiceHTML():state.tab==='mandala'?mandalaHTML():statisticsHTML();page.append(pane,...overlays);
    root.classList.toggle('r165-overlay-open',overlays.length>0);
    restoreEditor();viewport();root.querySelectorAll('.r165-mandalas textarea').forEach(autoSize);
    pane.scrollTop=state.scroll[state.tab]||0;pane.addEventListener('scroll',selectedGoal,{passive:true});
    return result;
  };

  root.addEventListener('input',event=>{
    const form=event.target.closest('[data-r165-goal-form]');if(!form)return;
    const index=Number(form.dataset.goalIndex),draft=goalDraft(index);draft.dirty=true;draft.message='';capture();
    const status=form.querySelector('[data-r165-goal-status]');if(status)status.textContent='저장 전';
    if(event.target.name==='goal'+index)root.querySelectorAll(`[data-r165-goal-name="${index}"]`).forEach(node=>node.textContent=goalName(index));
    autoSize(event.target);
  });
  root.addEventListener('click',event=>{
    const tab=event.target.closest('[data-r165-tab]');
    if(tab){event.preventDefault();event.stopImmediatePropagation();state.tab=tab.dataset.r165Tab;renderRoutine();return}
    const jump=event.target.closest('[data-r165-goal-jump]');
    if(jump){event.preventDefault();event.stopImmediatePropagation();const card=root.querySelector(`[data-goal-index="${jump.dataset.r165GoalJump}"]`);card?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});state.selectedGoal=Number(jump.dataset.r165GoalJump);return}
    const edit=event.target.closest('[data-r165-goal-edit]');
    if(edit){event.preventDefault();event.stopImmediatePropagation();const draft=goalDraft(Number(edit.dataset.r165GoalEdit));draft.editing=!draft.editing;renderRoutine();return}
    const level=event.target.closest('[data-routine-level]');
    if(level?.getAttribute('aria-pressed')==='true'){event.preventDefault();event.stopImmediatePropagation();setRoutine(level.dataset.routineId,'');}
  },true);
  root.addEventListener('submit',async event=>{
    const form=event.target.closest('[data-r165-goal-form]');if(!form)return;
    event.preventDefault();event.stopImmediatePropagation();const index=Number(form.dataset.goalIndex);if(state.saving.has(index))return;
    capture();state.saving.add(index);form.querySelector('[type="submit"]').disabled=true;
    try{await saveRoutineGoalsV111(form);await saveRoutineMandalaV111(form);const draft=goalDraft(index);draft.dirty=false;draft.message='저장됨'}
    catch(error){goalDraft(index).message='저장하지 못했습니다. 다시 시도하세요.';console.warn('Routine goal save failed',error)}
    finally{state.saving.delete(index);renderRoutine()}
  },true);
  window.addEventListener('resize',()=>{viewport();root.querySelectorAll('.r165-mandalas textarea').forEach(autoSize)},{passive:true});
  window.visualViewport?.addEventListener('resize',viewport,{passive:true});
  window.visualViewport?.addEventListener('scroll',viewport,{passive:true});
  new MutationObserver(()=>requestAnimationFrame(()=>root.querySelectorAll('.r165-mandalas textarea').forEach(autoSize))).observe(document.documentElement,{attributes:true,attributeFilter:['data-app-font-size']});
  window.AiderLogRoutineUIV165={get tab(){return state.tab}};
  window.renderRoutine();
})();
