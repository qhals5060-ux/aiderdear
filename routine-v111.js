let routineEditorIdV111=null,selectedBigGoalV111=0,routineMandalaOpenV111=false;

function routineGoalWorkspaceV111(){
  P.routines=Array.isArray(P.routines)?P.routines:[];
  const first=P.routines[0]||{},legacyGoals=Array.isArray(P.routineGoals)?P.routineGoals:first.bigGoals;
  if(!Array.isArray(P.routineBigGoals))P.routineBigGoals=Array.from({length:3},(_,i)=>String(legacyGoals?.[i]||''));
  P.routineBigGoals=Array.from({length:3},(_,i)=>String(P.routineBigGoals?.[i]||'').slice(0,120));
  if(!P.routineMandalaByGoal||typeof P.routineMandalaByGoal!=='object'||Array.isArray(P.routineMandalaByGoal)){
    const legacy=Array.isArray(first.mandalaGoals)?first.mandalaGoals:[];
    P.routineMandalaByGoal={'0':Array.from({length:8},(_,i)=>String(legacy[i]||'')),'1':Array(8).fill(''),'2':Array(8).fill('')};
  }
  for(let i=0;i<3;i++)P.routineMandalaByGoal[String(i)]=Array.from({length:8},(_,n)=>String(P.routineMandalaByGoal?.[String(i)]?.[n]||'').slice(0,100));
  selectedBigGoalV111=Math.max(0,Math.min(2,Number(selectedBigGoalV111)||0));
  return{goals:P.routineBigGoals,mandala:P.routineMandalaByGoal};
}

function routineGoalsHTMLV111(){
  const data=routineGoalWorkspaceV111();
  return `<form id="routineGoalsFormV111" class="routine-goals-v111"><div class="routine-goals-head-v111"><div><b>BIG GOALS</b><span> · 루틴과 별도의 큰 목표</span></div><button type="submit">저장</button></div><div class="routine-goal-list-v111">${data.goals.map((goal,i)=>`<label class="routine-goal-v111"><button type="button" class="${selectedBigGoalV111===i?'active':''}" data-big-goal-open="${i}" aria-label="${i+1}번 목표 만다라트 열기">0${i+1}</button><input name="goal${i}" maxlength="120" value="${esc(goal)}" placeholder="큰 목표"></label>`).join('')}</div></form>`;
}

function routineStampsV111(r){
  const st=routineMetrics(r);
  return st.cycle.dates.map(k=>{const v=String(r.dailyLevels?.[k]||'').toUpperCase(),future=k>today();return `<button type="button" data-routine-date="${k}" data-routine-id="${esc(r.id)}" class="${routineStatus(v)} ${k===today()?'today':''}" ${future?'disabled':''}><b>${k.slice(5).replace('-','.')}</b>${v||'—'}</button>`}).join('');
}

function routineDetailHTMLV111(r){
  if(!r)return'';
  const st=routineMetrics(r),partner=authState?.partner||authState?.pair?.partner;
  return `<div class="routine-detail-overlay routine-detail-v111" data-routine-close-overlay data-routine-palette="${routinePaletteKey(r.color)}" style="--routine-color:${routineColor(r)}"><section class="routine-detail-sheet" role="dialog" aria-modal="true" aria-label="루틴 상세"><header class="routine-detail-head"><div><small>ROUTINE HISTORY</small><h2>${esc(r.icon||'✨')} ${esc(r.text||r.title||'Routine')}</h2></div><button type="button" data-routine-close aria-label="닫기">×</button></header><div class="routine-detail-body"><section class="routine-detail-card routine-detail-stats"><div><span>총 실천</span><b>${st.total}</b></div><div><span>이번 회차</span><b>${st.practice}</b></div><div><span>완료율</span><b>${st.completion}%</b></div><div><span>최장 연속</span><b>${st.streak}</b></div></section><section class="routine-detail-card"><h3>이번 회차 전체 스탬프 · 날짜를 누르면 단계가 바뀝니다</h3><div class="routine-cycle-grid">${routineStampsV111(r)}</div></section><div class="routine-detail-actions"><button class="routine-delete" type="button" data-routine-delete="${esc(r.id)}">루틴 삭제</button>${(authState?.pair||partner)?`<button class="routine-share" type="button" data-routine-share="${esc(r.id)}">오늘 완료 공유</button>`:''}<button class="routine-save" type="button" data-routine-edit-open="${esc(r.id)}">설정 수정</button></div></div></section></div>`;
}

function routineEditorHTMLV111(){
  if(routineEditorIdV111===null)return'';
  const editing=routineEditorIdV111!==''&&(P.routines||[]).find(x=>String(x.id)===String(routineEditorIdV111));
  if(routineEditorIdV111!==''&&!editing){routineEditorIdV111=null;return''}
  const r=editing||{text:'',icon:'✨',goalDays:20,color:'pv4',miniText:'5분만 시작하기',moreText:'20분 집중하기',maxText:'충분히 끝내기'},selectedColor=routinePaletteKey(r.color);
  const swatches=Object.keys(ROUTINE_COLORS).map(key=>{const meta=ROUTINE_PALETTE_META[key];return `<label class="routine-color-choice-v122"><input type="radio" name="color" value="${key}" ${key===selectedColor?'checked':''} aria-label="${meta.label} ${meta.pantone}"><span class="routine-color-swatch-v122" style="--swatch:${ROUTINE_COLORS[key]}"><i aria-hidden="true">✓</i></span></label>`}).join('');
  return `<div class="routine-detail-overlay routine-editor-v111" data-routine-editor-overlay><section class="routine-detail-sheet" role="dialog" aria-modal="true" aria-label="${editing?'루틴 설정 수정':'루틴 추가'}"><header class="routine-detail-head"><div><small>${editing?'EDIT ROUTINE':'NEW ROUTINE'}</small><h2>${editing?'루틴 설정':'새 루틴 추가'}</h2></div><button type="button" data-routine-editor-close aria-label="닫기">×</button></header><form id="routineEditorFormV111" class="routine-detail-body" data-routine-id="${editing?esc(editing.id):''}"><section class="routine-detail-card"><h3>루틴 설정</h3><div class="routine-edit-grid"><label class="routine-name-field-v122">ROUTINE<input name="text" maxlength="80" value="${esc(r.text||r.title||'')}" placeholder="루틴 이름" required autofocus></label><div class="routine-goal-color-v127"><label>GOAL<select name="goalDays">${[7,14,20,21,30,66,100].map(n=>`<option value="${n}" ${n===Number(r.goalDays||20)?'selected':''}>${n}일</option>`).join('')}</select></label><fieldset class="routine-color-field-v122"><legend>COLOR</legend><div class="routine-color-options-v122">${swatches}</div></fieldset></div></div><div class="routine-level-copy"><label>MINI<input name="miniText" maxlength="100" value="${esc(r.miniText||'5분만 시작하기')}"></label><label>MORE<input name="moreText" maxlength="100" value="${esc(r.moreText||'20분 집중하기')}"></label><label>MAX<input name="maxText" maxlength="100" value="${esc(r.maxText||'충분히 끝내기')}"></label></div></section><div class="routine-detail-actions"><button type="button" data-routine-editor-close>취소</button><button class="routine-save" type="submit">${editing?'변경 저장':'루틴 추가'}</button></div></form></section></div>`;
}

function routineMandalaHTMLV111(){
  if(!routineMandalaOpenV111)return'';
  const data=routineGoalWorkspaceV111(),goal=data.goals[selectedBigGoalV111]||`BIG GOAL 0${selectedBigGoalV111+1}`,cells=data.mandala[String(selectedBigGoalV111)];
  let index=0;
  const grid=Array.from({length:9},(_,i)=>i===4?`<div class="routine-mandala-center">0${selectedBigGoalV111+1}<br>${esc(goal)}</div>`:(()=>{const n=index++;return `<label><span>0${n+1}</span><input name="mandala${n}" maxlength="100" value="${esc(cells[n])}" placeholder="실행 목표"></label>`})()).join('');
  return `<div class="routine-detail-overlay routine-mandala-overlay-v111" data-routine-mandala-overlay><section class="routine-detail-sheet" role="dialog" aria-modal="true" aria-label="만다라트"><header class="routine-detail-head"><div class="routine-mandala-title-v111"><span>BIG GOAL 0${selectedBigGoalV111+1} · MANDAL-ART</span><b>${esc(goal)}</b></div><button type="button" data-routine-mandala-close aria-label="닫기">×</button></header><form id="routineMandalaFormV111"><div class="routine-mandala-grid">${grid}</div><div class="routine-mandala-actions-v111"><button type="submit">만다라트 저장</button></div></form></section></div>`;
}

renderRoutine=function(){
  P.routines=Array.isArray(P.routines)?P.routines:[];
  routineGoalWorkspaceV111();
  if(routineDetailId&&!P.routines.some(r=>String(r.id)===String(routineDetailId)))routineDetailId='';
  if(routineEditorIdV111!==null&&routineEditorIdV111!==''&&!P.routines.some(r=>String(r.id)===String(routineEditorIdV111)))routineEditorIdV111=null;
  const cards=P.routines.length?P.routines.map(routineCardV110).join(''):'<div class="routine-empty-v110">오른쪽 위 + 버튼으로 첫 루틴을 추가해보세요.</div>';
  routine.innerHTML=`<div class="page routine-v110 routine-v111 routine-v122"><div class="barebar"><h1 class="page-title">Routine</h1><div class="routine-head-actions"><button type="button" data-routine-overall class="${routineOverallOpen?'active':''}">전체 통계</button><button type="button" class="routine-plus-v111" data-routine-create-open aria-label="루틴 추가">＋</button></div></div>${routineGoalsHTMLV111()}${routineOverallHTML()}<div class="routinegrid routine-complete-grid">${cards}</div>${routineDetailHTMLV111(P.routines.find(r=>String(r.id)===String(routineDetailId)))}${routineEditorHTMLV111()}${routineMandalaHTMLV111()}</div>`;
  bindRoutineV111();
};

async function saveRoutineGoalsV111(form){
  const data=new FormData(form);P.routineBigGoals=Array.from({length:3},(_,i)=>String(data.get('goal'+i)||'').trim().slice(0,120));await savePrivate();
}

async function saveRoutineMandalaV111(form){
  routineGoalWorkspaceV111();const data=new FormData(form);P.routineMandalaByGoal[String(selectedBigGoalV111)]=Array.from({length:8},(_,i)=>String(data.get('mandala'+i)||'').trim().slice(0,100));await savePrivate();routineMandalaOpenV111=false;renderRoutine();
}

async function saveRoutineEditorV111(form){
  const data=new FormData(form),name=String(data.get('text')||'').trim();if(!name){alert('루틴 이름을 입력해주세요.');return}
  let existing=(P.routines||[]).find(x=>String(x.id)===String(form.dataset.routineId));
  const values={text:name.slice(0,80),icon:existing?.icon||'✨',goalDays:Number(data.get('goalDays'))||20,cycleDays:Number(data.get('goalDays'))||20,color:routinePaletteKey(data.get('color')),miniText:String(data.get('miniText')||'').trim().slice(0,100)||'5분만 시작하기',moreText:String(data.get('moreText')||'').trim().slice(0,100)||'20분 집중하기',maxText:String(data.get('maxText')||'').trim().slice(0,100)||'충분히 끝내기',updatedAt:Date.now()};
  let r=existing;
  if(r)Object.assign(r,values);else{r={id:'r-'+Date.now(),...values,doneDates:[],dailyLevels:{},goalTracking:{'0':{},'1':{},'2':{}},goalDerivedDates:{},braggedAt:0,createdAt:Date.now()};P.routines.push(r)}
  await savePrivate();routineEditorIdV111=null;routineDetailId='';renderRoutine();
}

function bindRoutineV111(){
  const root=$('#routine');if(!root)return;
  $('#routineGoalsFormV111')?.addEventListener('submit',async e=>{e.preventDefault();await saveRoutineGoalsV111(e.currentTarget);renderRoutine()});
  $('#routineEditorFormV111')?.addEventListener('submit',e=>{e.preventDefault();saveRoutineEditorV111(e.currentTarget)});
  $('#routineMandalaFormV111')?.addEventListener('submit',e=>{e.preventDefault();saveRoutineMandalaV111(e.currentTarget)});
  root.onclick=async e=>{
    const level=e.target.closest('[data-routine-level]');if(level){await setRoutine(level.dataset.routineId,level.dataset.routineLevel);return}
    const open=e.target.closest('[data-routine-open]');if(open){routineDetailId=open.dataset.routineOpen;routineEditorIdV111=null;routineMandalaOpenV111=false;renderRoutine();return}
    if(e.target.closest('[data-routine-close]')||e.target.matches('[data-routine-close-overlay]')){routineDetailId='';renderRoutine();return}
    if(e.target.closest('[data-routine-overall]')){routineOverallOpen=!routineOverallOpen;renderRoutine();return}
    if(e.target.closest('[data-routine-create-open]')){routineDetailId='';routineMandalaOpenV111=false;routineEditorIdV111='';renderRoutine();return}
    const edit=e.target.closest('[data-routine-edit-open]');if(edit){routineDetailId='';routineEditorIdV111=edit.dataset.routineEditOpen;renderRoutine();return}
    if(e.target.closest('[data-routine-editor-close]')||e.target.matches('[data-routine-editor-overlay]')){routineEditorIdV111=null;renderRoutine();return}
    const goal=e.target.closest('[data-big-goal-open]');if(goal){await saveRoutineGoalsV111($('#routineGoalsFormV111'));selectedBigGoalV111=Number(goal.dataset.bigGoalOpen)||0;routineMandalaOpenV111=true;routineEditorIdV111=null;routineDetailId='';renderRoutine();return}
    if(e.target.closest('[data-routine-mandala-close]')||e.target.matches('[data-routine-mandala-overlay]')){routineMandalaOpenV111=false;renderRoutine();return}
    const date=e.target.closest('[data-routine-date]');if(date){await cycleRoutineDate(date.dataset.routineId,date.dataset.routineDate);return}
    const share=e.target.closest('[data-routine-share]');if(share){await shareRoutineCompletion(share.dataset.routineShare);return}
    const remove=e.target.closest('[data-routine-delete]');if(remove&&confirm('이 루틴과 기록을 삭제할까요?')){P.routines=P.routines.filter(r=>String(r.id)!==String(remove.dataset.routineDelete));routineDetailId='';routineEditorIdV111=null;await savePrivate();renderRoutine()}
  };
}

renderRoutine();
