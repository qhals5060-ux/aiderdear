import {todoRowsV179,todoKindV179,todoTextV179,filterTodosV179,sortTodosV179} from './todo-domain-v179.js';

/* Detailed notebook, backed by the same two fields as the site and quick note. */
(() => {
  'use strict';
  const $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const copy=value=>JSON.parse(JSON.stringify(value));
  const day=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
  const api=()=>window.AiderDearFirebase;
  const uid=()=>String(api()?.getState?.()?.user?.uid||'');
  const freshId=prefix=>prefix+'-'+(crypto.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
  let owner='',ownerEpoch=0,data={checklists:[],memos:[]},kind='todo',filter='open',query='',loaded=false,loading=false,busy=false,error='',loadRun=0,writeVersion=0,boundApi=null,queued=false,editorCloseV182=null;
  const signatures=new WeakMap();
  const incomplete=()=>sortTodosV179(todoRowsV179(owner&&owner===uid()?data:{}).filter(row=>row.kind==='todo'&&!row.done));
  const raw=(source,id)=>(data[source]||[]).find(row=>String(row.id)===String(id))||null;
  const due=date=>date?Number(date.slice(5,7))+'/'+Number(date.slice(8,10)):'';
  const fields=payload=>({checklists:copy(Array.isArray(payload?.checklists)?payload.checklists:[]),memos:copy(Array.isArray(payload?.memos)?payload.memos:[])});

  function ensurePage(){
    let page=$('#todo');
    if(!page){const views=$('.views');if(!views)return null;page=document.createElement('section');page.id='todo';page.className='view';page.setAttribute('aria-label','투두와 메모');views.append(page);}
    if(!page.querySelector('[data-todo-workspace-v179]'))page.innerHTML=`<div class="todo-workspace-v179" data-todo-workspace-v179><header class="todo-header-v179"><h1 class="todo-sr-v179">투두 · 메모</h1><button type="button" data-todo-add-v179="todo">＋ 투두</button><button type="button" data-todo-add-v179="memo">＋ 메모</button><button type="button" data-todo-manager-close-v182 aria-label="투두와 메모 닫기">×</button></header><nav class="todo-tabs-v179" aria-label="노트 종류"><button type="button" data-todo-kind-v179="todo">투두</button><button type="button" data-todo-kind-v179="memo">메모</button></nav><div class="todo-toolbar-v179"><label class="todo-search-v179"><span class="todo-sr-v179">투두와 메모 검색</span><input type="search" data-todo-search-v179 placeholder="내용 검색" autocomplete="off"></label><select data-todo-filter-v179 aria-label="할 일 상태"><option value="open">미완료</option><option value="today">오늘 마감</option><option value="overdue">기한 지남</option><option value="all">전체</option><option value="done">완료</option></select><button type="button" data-todo-refresh-v179 aria-label="새로고침">↻</button></div><div class="todo-status-v179" data-todo-status-v179 role="status"></div><div class="todo-list-v179" data-todo-list-v179></div></div>`;
    bindManagerSwipeV182(page);
    return page;
  }
  function render(){
    const page=ensurePage();if(!page)return;
    const active=owner&&owner===uid();
    $$('[data-todo-kind-v179]',page).forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.todoKindV179===kind)));
    $$('[data-todo-add-v179]',page).forEach(button=>button.disabled=!active||!loaded||busy);
    $('[data-todo-manager-close-v182]',page).disabled=busy;
    $('[data-todo-filter-v179]',page).hidden=kind==='memo';
    $('[data-todo-refresh-v179]',page).disabled=loading||busy||!active;
    $('[data-todo-status-v179]',page).textContent=!active?'로그인 후 내 투두와 메모를 볼 수 있습니다.':error||(loading?'불러오는 중…':busy?'저장 중…':'');
    const list=$('[data-todo-list-v179]',page),rows=filterTodosV179(active?data:{},{kind,filter,query,today:day()});
    const markup=rows.map(row=>`<article class="todo-row-v179 ${row.done?'is-done':''}">${kind==='todo'?`<label class="todo-check-v179"><input type="checkbox" data-todo-check-v179="${safe(row.id)}" data-source="${row.source}" ${row.done?'checked':''} ${busy?'disabled':''} aria-label="${safe(row.text)} 완료"></label>`:''}<button type="button" class="todo-copy-v179" data-todo-edit-v179="${safe(row.id)}" data-source="${row.source}"><b>${safe(row.text)}</b>${row.notes||row.note?`<span>${safe(row.notes||row.note)}</span>`:''}<small>${[row.important?'중요':'',row.date?(due(row.date)+(row.date<day()&&!row.done?' · 기한 지남':' 마감')):'',kind==='memo'&&row.updatedAt?new Date(row.updatedAt).toLocaleDateString('ko-KR'):''].filter(Boolean).join(' · ')}</small></button><button class="todo-more-v179" type="button" data-todo-edit-v179="${safe(row.id)}" data-source="${row.source}" aria-label="${safe(row.text)} 수정">⋯</button></article>`).join('')||(!loading&&active?`<div class="todo-empty-v179">${query?'검색 결과가 없습니다.':kind==='memo'?'저장한 메모가 없습니다.':filter==='done'?'완료한 할 일이 없습니다.':'표시할 할 일이 없습니다.'}</div>`:'');
    if(signatures.get(list)!==markup){const scroll=list.scrollTop;list.innerHTML=markup;list.scrollTop=scroll;signatures.set(list,markup);}
    mountAll();
  }
  function inlineMarkup(){
    const rows=incomplete();
    return `<div class="todo-inline-grid-v179" role="group" aria-label="미완료 할 일">${rows.map(row=>`<label class="todo-inline-item-v179" title="${safe(row.text+(row.date?' ('+due(row.date)+' 마감)':''))}"><input type="checkbox" data-todo-check-v179="${safe(row.id)}" data-source="${row.source}" ${busy?'disabled':''} aria-label="${safe(row.text)} 완료"><span>${safe(row.text)}</span>${row.date?`<small>(${due(row.date)} 마감)</small>`:''}</label>`).join('')}</div>${error?`<p class="todo-inline-error-v179" role="status">${safe(error)}</p>`:''}`;
  }
  function mountInline(element){if(!element)return;const markup=inlineMarkup();element.hidden=false;if(signatures.get(element)===markup)return;const scroll=element.firstElementChild?.scrollTop||0;element.innerHTML=markup;if(element.firstElementChild)element.firstElementChild.scrollTop=scroll;signatures.set(element,markup);}
  function mountAll(){$$('[data-todo-inline-v179]').forEach(mountInline);}
  function queue(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mountAll();});}
  function preserveLocal(){
    if(owner!==uid()||!owner)return;
    // Keep the legacy quick notebook on the exact same records, without uploading P.
    if(typeof P!=='undefined'){P.checklists=copy(data.checklists);P.memos=copy(data.memos);try{localStorage.setItem('aiderlog-private-v20',JSON.stringify(P));}catch{}}
    if($('#quickMemoModalV142.on'))window.AiderLogNotepadV142?.refresh?.();
  }
  async function refresh(){
    if(busy)return false;
    const actor=uid();if(!actor){changeOwner('');return false;}
    if(owner!==actor)changeOwner(actor);
    const run=++loadRun;loading=true;render();
    try{const payload=await api().readPrivateData();if(owner!==actor||uid()!==actor||run!==loadRun)return false;data=fields(payload);loaded=true;error='';preserveLocal();return true;}
    catch(e){if(owner===actor&&uid()===actor&&run===loadRun)error='메모를 불러오지 못했습니다. 연결을 확인하고 새로고침해주세요.';return false;}
    finally{if(owner===actor&&uid()===actor&&run===loadRun){loading=false;render();}}
  }
  function changeOwner(next){if(owner===next)return;owner=next;++ownerEpoch;++loadRun;++writeVersion;data={checklists:[],memos:[]};loaded=false;loading=false;busy=false;error='';query='';document.querySelector('[data-todo-editor-v179]')?.remove();editorCloseV182=null;render();const search=$('[data-todo-search-v179]');if(search)search.value='';}
  async function commit(input){
    if(busy)throw Error('저장이 진행 중입니다.');
    const actor=uid(),epoch=ownerEpoch;if(!actor||owner!==actor||!loaded)throw Error('로그인한 계정의 메모를 먼저 불러와주세요.');
    if(typeof api()?.mutateChecklistV179!=='function')throw Error('저장 기능을 불러오지 못했습니다. 앱을 다시 열어주세요.');
    busy=true;error='';++loadRun;++writeVersion;loading=false;render();
    try{
      const result=await api().mutateChecklistV179({...input,uid:actor});
      if(owner!==actor||uid()!==actor||ownerEpoch!==epoch)throw Error('계정이 변경되었습니다.');
      ++writeVersion;data[result.source]=copy(result.rows);preserveLocal();
      window.dispatchEvent(new CustomEvent('aiderlog:data-changed',{detail:{source:'todo-v179',uid:actor}}));
      window.dispatchEvent(new CustomEvent('aiderlog:todo-changed-v179',{detail:{uid:actor}}));
      return result;
    }catch(e){if(owner===actor&&uid()===actor&&ownerEpoch===epoch)error=e?.message||'저장하지 못했습니다. 입력한 내용은 유지됩니다.';throw e;}
    finally{if(owner===actor&&uid()===actor&&ownerEpoch===epoch){busy=false;render();}}
  }
  function edit(source='',id='',requestedKind=''){
    if(busy)return;const actor=uid();if(!actor||owner!==actor||!loaded){error='로그인 후 새로고침해주세요.';render();return;}
    const before=id?raw(source,id):null;if(id&&!before)return;
    const editingKind=before?todoKindV179(before,source):requestedKind==='memo'?'memo':requestedKind==='todo'?'todo':kind,collection=source||(editingKind==='memo'?'memos':'checklists'),recordId=id||freshId(editingKind);
    $('[data-todo-editor-v179]')?.remove();const sheet=document.createElement('div');sheet.className='todo-editor-overlay-v179';sheet.dataset.todoEditorV179='1';
    sheet.innerHTML=`<section class="todo-editor-v179" role="dialog" aria-modal="true" aria-labelledby="todo-editor-title-v179"><form data-todo-form-v179><header><h2 id="todo-editor-title-v179">${editingKind==='memo'?'메모':'투두'} ${before?'수정':'추가'}</h2><button type="button" data-todo-close-v179 aria-label="닫기">×</button><button type="submit">저장</button></header><div class="todo-editor-fields-v179"><label>${editingKind==='memo'?'메모':'할 일'}<textarea name="text" maxlength="${editingKind==='memo'?1200:180}" rows="${editingKind==='memo'?8:2}" required>${safe(todoTextV179(before))}</textarea></label>${editingKind==='todo'?`<div class="todo-editor-options-v179"><label>마감일<input name="date" type="date" value="${safe(before?.date||before?.dueAt||'')}"></label><label class="todo-important-v179"><input type="checkbox" name="important" ${before?.important?'checked':''}> 중요</label></div>`:''}<label>상세 메모<textarea name="notes" maxlength="2000" rows="4">${safe(before?.notes||before?.note||'')}</textarea></label><p class="todo-form-error-v179" role="alert"></p>${before?'<button type="button" class="todo-delete-v179" data-todo-delete-v179>삭제</button>':''}</div></form></section>`;
    document.body.append(sheet);const form=$('form',sheet);const previousFocus=document.activeElement;
    const initialValues=JSON.stringify([...new FormData(form).entries()]);
    const close=()=>{if(busy)return false;if(initialValues!==JSON.stringify([...new FormData(form).entries()])&&!confirm('저장하지 않은 내용을 닫을까요?'))return false;sheet.remove();editorCloseV182=null;previousFocus?.focus?.({preventScroll:true});return true;};
    editorCloseV182=close;
    const changeDisabled=value=>$$('button,input,textarea',sheet).forEach(element=>element.disabled=value);
    sheet.addEventListener('click',event=>{if(event.target===sheet||event.target.closest('[data-todo-close-v179]'))close();});
    sheet.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();close();}if(event.key==='Tab'){const controls=$$('button:not(:disabled),input:not(:disabled),textarea:not(:disabled)',sheet),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}});
    // Focus the dialog's close button, never an input: opening must not raise the keyboard.
    $('[data-todo-close-v179]',sheet)?.focus({preventScroll:true});
    let retrySignature='',retryMutationId='';
    async function save(op){if(actor!==uid()||owner!==actor){sheet.remove();editorCloseV182=null;return;}const values=new FormData(form),input={op,source:collection,id:recordId,expected:JSON.stringify(before),kind:editingKind,text:String(values.get('text')||''),notes:String(values.get('notes')||''),date:String(values.get('date')||''),important:values.get('important')==='on'};const signature=JSON.stringify(input);if(signature!==retrySignature){retrySignature=signature;retryMutationId=freshId('change');}input.mutationId=retryMutationId;changeDisabled(true);try{await commit(input);sheet.remove();editorCloseV182=null;}catch(e){if(sheet.isConnected&&actor===uid())$('.todo-form-error-v179',sheet).textContent=e?.message||'저장하지 못했습니다.';}finally{changeDisabled(false);}}
    form.addEventListener('submit',event=>{event.preventDefault();save('save');});
    $('[data-todo-delete-v179]',sheet)?.addEventListener('click',()=>{if(confirm('이 '+(editingKind==='memo'?'메모':'할 일')+'을 삭제할까요?'))save('delete');});
  }
  function open(nextKind='todo'){kind=nextKind==='memo'?'memo':'todo';ensurePage();if(window.AiderLogWheelV151?.navigate)window.AiderLogWheelV151.navigate('todo');else window.go?.('todo',false);render();if(!loaded&&!loading)refresh();}
  // BEGIN MANAGER CLOSE V182: page-only left swipe; form and list controls keep ownership.
  function closeManagerV182(){
    if(busy)return false;
    if($('[data-todo-editor-v179]'))return editorCloseV182?.()||false;
    window.AiderLogWheelV151?.setOpen?.(false);
    if(window.AiderAppBackV176?.back?.())return true;
    if(window.AiderLogWheelV151?.navigate){window.AiderLogWheelV151.navigate('home');return true;}
    if(window.go){window.go('home',false);return true;}
    return false;
  }
  function managerSwipeV182(start,end,elapsed){const dx=end.x-start.x,dy=end.y-start.y;return elapsed>=0&&elapsed<=8000&&dx<=-64&&Math.abs(dy)<=Math.abs(dx)*.4;}
  function bindManagerSwipeV182(page){
    if(page.dataset.todoSwipeV182)return;page.dataset.todoSwipeV182='1';let gesture=null,suppressUntil=0,touchUntil=0;
    const point=list=>list?.length===1?{x:list[0].clientX,y:list[0].clientY,id:list[0].identifier}:null;
    const blocked=event=>event.target.closest('input,textarea,select,label,form,[contenteditable="true"],[data-todo-editor-v179],#wheel,button:not(.todo-copy-v179)')||$('[data-todo-editor-v179]');
    function start(event,p,type){gesture=null;if(!p||blocked(event)||busy)return;gesture={...p,type,at:Date.now(),locked:false};}
    function move(event,p){if(!gesture||!p||p.id!==gesture.id)return;const dx=p.x-gesture.x,dy=p.y-gesture.y;if(dx>8||Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)){gesture=null;return;}if(dx< -16&&-dx>Math.abs(dy)*1.7)gesture.locked=true;if(gesture.locked&&event.cancelable)event.preventDefault();}
    function finish(event,p){const prior=gesture;gesture=null;if(!prior||!p||p.id!==prior.id||!managerSwipeV182(prior,p,Date.now()-prior.at))return;if(!closeManagerV182())return;if(event.cancelable)event.preventDefault();event.stopPropagation();suppressUntil=Date.now()+650;}
    page.addEventListener('touchstart',event=>{touchUntil=Date.now()+1000;start(event,point(event.touches),'touch');},{passive:true});
    page.addEventListener('touchmove',event=>{if(event.touches.length!==1){gesture=null;return;}move(event,point(event.touches));},{passive:false});
    page.addEventListener('touchend',event=>{if(gesture?.type==='touch')finish(event,point(event.changedTouches));},{passive:false});
    page.addEventListener('touchcancel',()=>{gesture=null;},{passive:true});
    page.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||Date.now()<touchUntil||event.button!==0)return;start(event,{x:event.clientX,y:event.clientY,id:event.pointerId},'pointer');});
    page.addEventListener('pointermove',event=>{if(gesture?.type==='pointer')move(event,{x:event.clientX,y:event.clientY,id:event.pointerId});});
    page.addEventListener('pointerup',event=>{if(gesture?.type==='pointer')finish(event,{x:event.clientX,y:event.clientY,id:event.pointerId});});
    page.addEventListener('pointercancel',()=>{if(gesture?.type==='pointer')gesture=null;});
    page.addEventListener('click',event=>{if(event.detail&&Date.now()<suppressUntil){suppressUntil=0;event.preventDefault();event.stopImmediatePropagation();}},true);
  }
  // END MANAGER CLOSE V182
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-todo-kind-v179')){kind=button.dataset.todoKindV179;render();}
    else if(button.hasAttribute('data-todo-add-v179'))edit('','',button.dataset.todoAddV179);
    else if(button.hasAttribute('data-todo-manager-close-v182'))closeManagerV182();
    else if(button.hasAttribute('data-todo-refresh-v179'))refresh();
    else if(button.hasAttribute('data-todo-edit-v179'))edit(button.dataset.source,button.dataset.todoEditV179);
  });
  document.addEventListener('change',async event=>{
    if(event.target.matches('[data-todo-filter-v179]')){filter=event.target.value;render();return;}
    const check=event.target.closest('[data-todo-check-v179]');if(!check)return;
    const source=check.dataset.source||'checklists',id=check.dataset.todoCheckV179,before=raw(source,id);if(!before){render();return;}
    try{await commit({source,id,op:'toggle',done:check.checked,expected:JSON.stringify(before),mutationId:freshId('check')});}catch{check.checked=!!before.done;render();}
  });
  document.addEventListener('input',event=>{if(event.target.matches('[data-todo-search-v179]')){query=event.target.value;render();}});
  document.addEventListener('aiderlog-page-changed',event=>{if(event.detail?.page==='todo'){render();if(!loaded&&!loading)refresh();}});
  function bind(){
    const current=api();if(!current||boundApi===current)return;boundApi=current;
    current.subscribe?.(state=>{const next=String(state?.user?.uid||'');if(next!==owner){changeOwner(next);if(next)refresh();}});
    const write=current.writePrivateData;if(typeof write==='function')current.writePrivateData=function(...args){const actor=uid(),epoch=ownerEpoch,version=++writeVersion,snapshot=fields(args[0]);return Promise.resolve(write.apply(this,args)).then(result=>{if(actor&&actor===owner&&actor===uid()&&epoch===ownerEpoch&&version===writeVersion){++loadRun;data=Array.isArray(result?.checklists)||Array.isArray(result?.memos)?fields(result):snapshot;loaded=true;loading=false;error='';render();}return result;});};
    if(uid()&&owner!==uid()){changeOwner(uid());refresh();}
  }
  window.addEventListener('aiderdear-firebase-ready',bind);
  window.addEventListener('pageshow',bind);
  window.addEventListener('aiderlog:widget-private-changed',()=>refresh());
  window.addEventListener('aiderlog-native-resume',()=>{if(!busy)refresh();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden&&owner&&!busy)refresh();});
  new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
  window.AiderTodoV179=Object.freeze({open,refresh,incomplete,inlineMarkup,mountInline,mountAll,edit,close:closeManagerV182});
  ensurePage();bind();render();
})();
