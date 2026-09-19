/* Compact schedule views. Existing account-scoped stores remain authoritative. */
(function(root){
  'use strict';
  const escape=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const key=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  function dates(start=new Date(),count=7){const date=start instanceof Date?new Date(start):new Date(start+'T12:00:00');return Array.from({length:count},(_,i)=>key(new Date(date.getFullYear(),date.getMonth(),date.getDate()+i)));}
  function occurs(row,date){return !!row?.date&&date>=row.date&&date<=(row.endDate||row.date);}
  function notes(payload={}){return ['checklists','memos'].flatMap(source=>(Array.isArray(payload[source])?payload[source]:[]).filter(row=>row?.id&&!row.demo&&row.category!=='emotion').map(row=>({...row,source,kind:source==='memos'||row.kind==='memo'||row.type==='memo'?'memo':'todo',text:String(row.text||row.title||row.name||''),date:String(row.date||row.dueAt||'').slice(0,10)}))).sort((a,b)=>Number(!!a.done)-Number(!!b.done)||(a.date||'9999').localeCompare(b.date||'9999')||Number(b.updatedAt||b.createdAt||0)-Number(a.updatedAt||a.createdAt||0));}
  const model=Object.freeze({dates,occurs,notes});
  if(typeof module!=='undefined'&&module.exports)module.exports=model;
  if(!root.document)return;
  const document=root.document,$=(q,host=document)=>host.querySelector(q);
  const native=()=>!!$('#home.schedule-feature-v125');
  const bridge=()=>root.AiderScheduleUIBridgeV184;
  const api=()=>root.AiderDearFirebase;
  const uid=()=>String(api()?.getState?.()?.user?.uid||bridge()?.snapshot?.().uid||'');
  let weekly=false,anchor=key(new Date()),frame=0,overview=null,overviewFocus=null,lastIdentity='',siteBusy=false;
  const signatures=new WeakMap(),headings=new WeakMap();
  function snapshot(){
    if(!native())return bridge()?.snapshot?.()||{uid:'',events:[],ddays:null,notes:{}};
    return {uid:uid(),events:root.AiderLogCalendarV125?.rows?.()||[],ddays:root.AiderAppDdayV175?.snapshot?.()||null,notes:root.AiderTodoV179?.snapshot?.()||{}};
  }
  function html(host,markup){if(signatures.get(host)===markup)return;const top=host.scrollTop;host.innerHTML=markup;host.scrollTop=top;signatures.set(host,markup);}
  function ordered(rows){return root.AiderScheduleTimeV179?.ordered?.(rows)||rows.slice().sort((a,b)=>(a.date||'').localeCompare(b.date||'')||(a.time||'').localeCompare(b.time||''));}
  const time=row=>root.AiderScheduleTimeV179?.format?.(row)||(row.allDay?'종일':row.time||'');
  const dateLabel=date=>date?`${Number(date.slice(5,7))}/${Number(date.slice(8,10))}`:'';
  const holiday=date=>native()?root.AiderLogHolidayTitleV164?.(date)||'':bridge()?.holiday?.(date)||'';
  function openEvent(date,id=''){if(native())root.AiderLogCalendarV125?.openSchedule?.(date,id);else bridge()?.openEvent?.(date,id);}
  function openDdays(){closeOverview();if(native())root.AiderAppDdayV175?.open?.();else bridge()?.openDdays?.();}
  function eventMarkup(row,date){return `<button type="button" class="week-event-v184${row.allDay?' all-day':''}" data-week-event-v184="${escape(row.id)}" data-event-date="${escape(date||row.date)}" title="${escape([row.date,time(row),row.title].filter(Boolean).join(' · '))}"><time>${escape(time(row)||'종일')}</time><b>${escape(row.title||'일정')}</b></button>`;}
  function weekMarkup(events,start=anchor){return dates(start).map(date=>{const day=new Date(date+'T12:00:00'),rows=ordered(events.filter(row=>!row.isHoliday&&occurs(row,date))),name=holiday(date);return `<section class="week-day-v184${date===key(new Date())?' today':''}${name?' holiday':''}" data-week-date-v184="${date}"><button type="button" class="week-date-v184" data-week-add-v184="${date}" aria-label="${date} 일정 추가"><span>${['Sun.','Mon.','Tue.','Wed.','Thu.','Fri.','Sat.'][day.getDay()]}</span><strong>${day.getDate()}</strong>${name?`<small title="${escape(name)}">${escape(name)}</small>`:''}</button><div class="week-events-v184">${rows.map(row=>eventMarkup(row,date)).join('')||`<button type="button" class="week-empty-v184" data-week-add-v184="${date}" aria-label="${date} 일정 추가">＋</button>`}</div></section>`;}).join('');}
  function taskMarkup(row){const source=escape(row.source),id=escape(row.id),isNative=native(),edit=isNative?`data-todo-edit-v179="${id}"`:`data-note-edit-v184="${id}"`,check=isNative?`data-todo-check-v179="${id}"`:`data-note-check-v184="${id}"`;return `<article class="week-note-row-v184 ${row.kind}">${row.kind==='todo'?`<input type="checkbox" ${check} data-source="${source}" aria-label="${escape(row.text)} 완료" ${row.done?'checked':''} ${siteBusy?'disabled':''}>`:''}<button type="button" ${edit} data-source="${source}" title="${escape(row.text)}"><span>${escape(row.text)}</span></button>${row.kind==='todo'&&row.date?`<time datetime="${row.date}" title="${row.date} 마감">${dateLabel(row.date)}</time>`:''}</article>`;}
  function notesMarkup(payload){const rows=notes(payload),tasks=rows.filter(row=>row.kind==='todo'&&!row.done),memos=rows.filter(row=>row.kind==='memo');return ['todo','memo'].map(kind=>`<section class="week-notes-column-v184 ${kind}"><header><b>${kind==='todo'?'TODO':'MEMO'}</b><button type="button" ${native()?`data-todo-add-v179="${kind}"`:`data-note-add-v184="${kind}"`} aria-label="${kind==='todo'?'투두':'메모'} 추가">＋</button></header><div>${(kind==='todo'?tasks:memos).map(taskMarkup).join('')||`<p class="week-notes-empty-v184">${kind==='todo'?'할 일이 없어요':'메모를 남겨보세요'}</p>`}</div></section>`).join('');}
  function mountWeekly(calendar,state){
    let view=$('.weekly-view-v184',calendar);if(!view){view=document.createElement('div');view.className='weekly-view-v184';view.innerHTML='<div class="weekly-days-v184" aria-label="오늘부터 7일 일정"></div><div class="weekly-notes-v184" aria-label="투두와 메모"></div>';calendar.append(view);}
    view.hidden=!weekly;calendar.classList.toggle('weekly-active-v184',weekly);
    if(weekly){html($('.weekly-days-v184',view),weekMarkup(state.events||[]));html($('.weekly-notes-v184',view),notesMarkup(state.notes));}
  }
  function mountControls(calendar){const today=$(native()?'[data-calendar-today-v125]':'#todayBtn',calendar)||$('#todayBtn');if(!today)return;let button=$('[data-week-toggle-v184]',today.parentElement);if(!button){button=document.createElement('button');button.type='button';button.dataset.weekToggleV184='';button.className='weekly-toggle-v184';button.textContent='Weekly';button.setAttribute('aria-label','오늘부터 7일 보기');today.after(button);}button.setAttribute('aria-pressed',String(weekly));const heading=$(native()?'.schedule-calhead-v119 h1':'#monthTitle',calendar);if(heading){if(weekly){if(!headings.has(heading))headings.set(heading,heading.innerHTML);const date=new Date(anchor+'T12:00:00'),month=date.toLocaleString('en-US',{month:'long'}),markup=native()?`<span>${month}</span><small>${date.getFullYear()}</small>`:`${date.getFullYear()}. <b>${String(date.getMonth()+1).padStart(2,'0')}.</b>`;if(heading.innerHTML!==markup)heading.innerHTML=markup;}else if(headings.has(heading)){heading.innerHTML=headings.get(heading);headings.delete(heading);}}}
  function mountDdays(){
    const host=native()?$('.dday-summary-v179'):$('#ddayManageBtn')?.parentElement;if(!host)return;
    host.classList.add('dday-group-v184');let button=$('[data-week-overview-v184]',host);
    if(!button){button=document.createElement('button');button.type='button';button.className='week-overview-open-v184';button.dataset.weekOverviewV184='';button.textContent='W';button.setAttribute('aria-label','전체 디데이와 이번 주 일정');host.insertBefore(button,host.firstChild);}
  }
  function mountUpcoming(state){
    if(native()){
      document.querySelectorAll('#home [data-schedule-jump-v180]').forEach(button=>{const row=(state.events||[]).find(row=>String(row.id)===button.dataset.scheduleJumpV180);if(!row)return;let date=$('.upcoming-date-v184',button);if(!date){date=document.createElement('time');date.className='upcoming-date-v184';button.insertBefore(date,button.querySelector('span'));}date.textContent=dateLabel(row.date);date.dateTime=row.date;});
    }else document.querySelectorAll('#page0 .shared-date').forEach(node=>node.classList.add('upcoming-date-v184'));
  }
  function renderOverview(state=snapshot()){
    if(!overview)return;const now=new Date(),start=new Date(now.getFullYear(),now.getMonth(),now.getDate()-now.getDay()),ddays=state.ddays?.items||[];
    html($('.overview-ddays-v184',overview),ddays.map(row=>`<button type="button" class="overview-dday-v184" data-all-ddays-v184><strong>${escape(root.AiderDdayDisplayV176?.count?.(row)||'D-DAY')}</strong><span>${escape(row.title)}</span><time>${escape(row.date)}</time></button>`).join('')||'<p class="week-notes-empty-v184">저장한 디데이가 없습니다.</p>');
    html($('.overview-week-v184',overview),weekMarkup(state.events||[],key(start)));
  }
  function openOverview(){
    if(overview)return;overviewFocus=document.activeElement;overview=document.createElement('dialog');overview.className='week-overview-dialog-v184';overview.setAttribute('aria-labelledby','week-overview-title-v184');overview.innerHTML='<header><div><small>AT A GLANCE</small><h2 id="week-overview-title-v184">디데이 · 이번 주</h2></div><button type="button" data-week-close-v184 aria-label="닫기">×</button></header><div class="overview-body-v184"><section><div class="overview-section-head-v184"><b>모든 디데이</b><button type="button" data-all-ddays-v184>관리</button></div><div class="overview-ddays-v184"></div></section><section><div class="overview-section-head-v184"><b>이번 주 일정</b></div><div class="overview-week-v184"></div></section></div>';
    document.body.append(overview);renderOverview();overview.addEventListener('cancel',event=>{event.preventDefault();closeOverview();});overview.addEventListener('click',event=>{if(event.target===overview){const box=overview.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeOverview();}});overview.showModal();$('[data-week-close-v184]',overview).focus();
  }
  function closeOverview(){if(!overview)return;overview.close();overview.remove();overview=null;overviewFocus?.focus?.({preventScroll:true});}
  function refresh(){
    frame=0;const state=snapshot(),identity=String(state.uid||'');if(identity!==lastIdentity){lastIdentity=identity;closeOverview();$('.site-note-editor-v184')?.close();$('.site-note-editor-v184')?.remove();}
    const calendar=native()?$('#home .schedule-calendar-v119'):$('#page0 .calendar-wrap')||$('#calendar')?.parentElement;
    if(!calendar)return;calendar.classList.add('schedule-calendar-v184');mountControls(calendar);mountDdays();mountUpcoming(state);mountWeekly(calendar,state);if(overview)renderOverview(state);
    const title=$('#todo .todo-header-v179 h1');if(title){title.classList.remove('todo-sr-v179');title.textContent='투두 · 메모';}
  }
  function queue(){if(!frame)frame=requestAnimationFrame(refresh);}
  async function siteCommit(input){const actor=uid();if(!actor||siteBusy)throw Error('로그인 후 다시 시도해주세요.');siteBusy=true;try{await api().mutateChecklistV179({...input,uid:actor,mutationId:'note-'+crypto.randomUUID()});if(actor!==uid())throw Error('로그인 계정이 변경되었습니다.');await bridge()?.reloadNotes?.();queue();}finally{siteBusy=false;}}
  function editSiteNote(source='',id='',kind='todo'){
    if(!uid())return;const state=snapshot(),before=id?(state.notes?.[source]||[]).find(row=>String(row.id)===String(id)):null;if(id&&!before)return;const type=source==='memos'||before?.kind==='memo'||kind==='memo'?'memo':'todo',collection=source||(type==='memo'?'memos':'checklists');
    const sheet=document.createElement('dialog');sheet.className='site-note-editor-v184';sheet.innerHTML=`<form><header><h2>${type==='memo'?'메모':'투두'} ${before?'수정':'추가'}</h2><button type="button" data-note-close-v184 aria-label="닫기">×</button><button type="submit">저장</button></header><div><label>${type==='memo'?'메모':'할 일'}<textarea name="text" required maxlength="${type==='memo'?1200:180}">${escape(before?.text||before?.title||'')}</textarea></label>${type==='todo'?`<label>마감일<input name="date" type="date" value="${escape(before?.date||before?.dueAt||'')}"></label>`:''}<label>상세 메모<textarea name="notes" maxlength="2000">${escape(before?.notes||before?.note||'')}</textarea></label><p role="status"></p>${before?'<button type="button" data-note-delete-v184>삭제</button>':''}</div></form>`;document.body.append(sheet);const form=$('form',sheet),actor=uid(),initial=new FormData(form),clean=()=>JSON.stringify([...initial.entries()])===JSON.stringify([...new FormData(form).entries()]);
    const close=()=>{if(siteBusy)return;if(!clean()&&!confirm('저장하지 않은 내용을 닫을까요?'))return;sheet.close();sheet.remove();};
    async function save(op){if(actor!==uid())return;const values=new FormData(form);try{await siteCommit({source:collection,id:id||'note-'+crypto.randomUUID(),op,expected:JSON.stringify(before),kind:type,text:String(values.get('text')||''),notes:String(values.get('notes')||''),date:String(values.get('date')||''),important:!!before?.important});sheet.close();sheet.remove();}catch(error){$('[role=status]',sheet).textContent=error.message;}}
    sheet.addEventListener('cancel',event=>{event.preventDefault();close();});sheet.addEventListener('click',event=>{if(event.target.closest('[data-note-close-v184]'))close();if(event.target.closest('[data-note-delete-v184]')&&confirm('이 항목을 삭제할까요?'))save('delete');});form.addEventListener('submit',event=>{event.preventDefault();save('save');});sheet.showModal();$('[data-note-close-v184]',sheet).focus();
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-week-toggle-v184')){weekly=!weekly;anchor=key(new Date());queue();}
    else if(button.hasAttribute('data-week-overview-v184'))openOverview();
    else if(button.hasAttribute('data-week-close-v184'))closeOverview();
    else if(button.hasAttribute('data-all-ddays-v184'))openDdays();
    else if(button.hasAttribute('data-week-event-v184')){closeOverview();openEvent(button.dataset.eventDate,button.dataset.weekEventV184);}
    else if(button.hasAttribute('data-week-add-v184')){closeOverview();openEvent(button.dataset.weekAddV184);}
    else if(button.hasAttribute('data-note-add-v184'))editSiteNote('','',button.dataset.noteAddV184);
    else if(button.hasAttribute('data-note-edit-v184'))editSiteNote(button.dataset.source,button.dataset.noteEditV184);
  });
  // Weekly navigation is independent of the stored month/fortnight selection.
  root.addEventListener('click',event=>{if(!weekly)return;const button=event.target.closest('button');if(!button||!button.matches('[data-calendar-today-v125],#todayBtn,[data-calendar-shift-v125],#prevMonth,#nextMonth'))return;event.preventDefault();event.stopImmediatePropagation();if(button.matches('[data-calendar-today-v125],#todayBtn'))anchor=key(new Date());else{const shift=button.dataset.calendarShiftV125||(button.id==='prevMonth'?-1:1),date=new Date(anchor+'T12:00:00');date.setDate(date.getDate()+7*Number(shift));anchor=key(date);}queue();},true);
  document.addEventListener('change',async event=>{const check=event.target.closest('[data-note-check-v184]');if(!check)return;const source=check.dataset.source,before=(snapshot().notes?.[source]||[]).find(row=>String(row.id)===check.dataset.noteCheckV184);if(!before)return;try{await siteCommit({source,id:before.id,op:'toggle',done:check.checked,expected:JSON.stringify(before)});}catch(error){check.checked=!!before.done;check.title=error.message;}});
  new MutationObserver(records=>{if(records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1&&!node.closest?.('.weekly-view-v184,.week-overview-dialog-v184,.site-note-editor-v184')&&(node.matches?.('.schedule-dashboard-v179,.day,.dday-main-v179,.todo-row-v179')||node.querySelector?.('.schedule-dashboard-v179,.todo-row-v179')))))queue();}).observe(document.body,{childList:true,subtree:true});
  ['aiderdear-firebase-state','aiderdear-dday-data','aiderlog:todo-changed-v179','aiderlog:data-changed','aiderlog-friend-schedule-data','aiderlog-site-editionchange'].forEach(name=>root.addEventListener(name,queue));
  root.addEventListener('resize',queue,{passive:true});
  root.AiderScheduleUIV184=Object.freeze({refresh:queue,model,openOverview});queue();
})(typeof window!=='undefined'?window:globalThis);
