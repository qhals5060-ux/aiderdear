import {canUsePrivateIntimacy, privateCalendarMarkers, PRIVATE_CALENDAR_NOTICE} from './private-calendar-v175.js';

// Sensitive dates live only in this account-bound memory view, never in shared
// schedule payloads, URL parameters, analytics or browser persistent storage.
const $=id=>document.getElementById(id), api=()=>window.AiderDearFirebase;
const user=()=>api()?.getState?.().user||null;
let actor='',epoch=0,data=null,rangeKey='',pending=null,busy=false,retryAt=0,error='',draft=null;
let dialog,profileButton,toolbar,formKind='period',editing=null,entryDirty=false,settingsDirty=false;
const dateNow=()=>new Date(Date.now()+9*3600000).toISOString().slice(0,10);
function identity(){const u=user(),key=u?.uid?`${u.uid}:${u.email}:${u.emailVerified===true}`:'';if(key!==actor){actor=key;epoch++;data=null;pending=null;rangeKey='';retryAt=0;error='';draft=null;editing=null;entryDirty=false;settingsDirty=false;busy=false;dialog?.close();clearMarkers();if(dialog)dialog.remove();dialog=null;}return key;}
function canIntimacy(){return !!identity()&&canUsePrivateIntimacy(user())&&data?.canUseIntimacy===true;}
const calendarCellSelector='#calendar .day[data-date], #home [data-schedule-date-v125][data-date]';
function calendarCells(){const native=!!window.AiderLogNative||document.documentElement.classList.contains('aiderlog-android')||new URLSearchParams(location.search).has('android-preview');const preferred=[...document.querySelectorAll(native?'#home [data-schedule-date-v125][data-date]':'#calendar .day[data-date]')];return preferred.length?preferred:[...document.querySelectorAll(calendarCellSelector)];}
function clearMarkers(){document.querySelectorAll('[data-private-calendar-marker]:not([data-private-calendar-marker="line"])').forEach(node=>node.remove());document.querySelectorAll('[data-private-calendar-marker="line"]').forEach(node=>{if(!node.children.length)node.remove();});}
function range(){const dates=calendarCells().map(el=>el.dataset.date).sort();const now=dateNow();return{from:dates[0]||now,to:dates.at(-1)||now};}
function message(value){error=value;const node=$('privateCalendarStatusV175');if(node)node.textContent=value;}
function failure(err){if(String(err?.code||'').endsWith('resource-exhausted')){retryAt=Date.now()+300000;return '저장소 요청 한도에 도달했습니다. 기록과 입력은 유지됩니다. 잠시 후 다시 시도해주세요.';}return String(err?.message||'저장소 연결을 확인해주세요. 기존 기록은 변경하지 않았습니다.');}
async function refresh(force=false){
  const key=identity();install();if(!key||busy)return;if(pending)return pending;if(Date.now()<retryAt)return;
  const query=range(),queryKey=JSON.stringify(query);if(!force&&data&&rangeKey===queryKey){decorateCalendar();return;}
  const version=epoch;const run=Promise.resolve().then(async()=>{try{
    if(!api()?.readPrivateCalendarData)throw Error('최신 버전으로 다시 열어주세요.');
    const result=await api().readPrivateCalendarData(query);if(key!==identity()||version!==epoch)return;
    data=result;rangeKey=queryKey;retryAt=0;error='';render();decorateCalendar();
  }catch(err){if(key===identity()&&version===epoch){message(failure(err));renderStatus();}}
  finally{if(version===epoch)pending=null;}});pending=run;return run;
}
function decorateCalendar(){
  identity();clearMarkers();if(!data||!actor)return;let marks=[];
  try{const r=range();marks=privateCalendarMarkers({...data,canUseIntimacy:canIntimacy()},r.from,r.to);}catch{return;}
  for(const mark of marks)for(const cell of calendarCells().filter(node=>node.dataset.date===mark.date)){
    let line=cell.querySelector('.calendar-status-icons');if(!line){line=document.createElement('div');line.className='calendar-status-icons';line.dataset.privateCalendarMarker='line';cell.appendChild(line);}
    const icon=document.createElement('span');icon.dataset.privateCalendarMarker=mark.kind;icon.className=`calendar-status-icon ${mark.kind}`;
    icon.title=mark.kind==='period'?'생리일':mark.kind==='period-estimate'?'예상 생리일':'관계일';icon.setAttribute('aria-label',icon.title);icon.setAttribute('role','img');
    if(mark.kind==='intimacy')icon.textContent='♥';else{const drop=document.createElement('i');drop.className='calendar-period-drop';drop.setAttribute('aria-hidden','true');icon.appendChild(drop);}
    line.appendChild(icon);cell.classList.add('has-calendar-status');
  }
}
function compactProfile(){
  // Keep the existing forms and their listeners; collapse secondary connection
  // management rather than removing controls or duplicating account state.
  for(const section of document.querySelectorAll('#loginModal .profile-connections-block > section')){
    if(section.querySelector('[data-connection-details-v175]'))continue;
    const friend=section.classList.contains('friend-panel'),details=document.createElement('details'),summary=document.createElement('summary'),body=document.createElement('div');
    details.dataset.connectionDetailsV175='';summary.textContent=friend?'친구 연결 · 요청 관리':'커플 연결 · 요청 관리';body.className='connection-details-body-v175';
    for(const child of [...section.childNodes])body.appendChild(child);details.append(summary,body);section.appendChild(details);
    if(friend){const text=body.querySelector('header span');if(text)text.textContent='우편과 선택한 일정을 공유합니다.';}
  }
}
function install(){
  compactProfile();
  const birth=$('loginBirthDate')?.closest('label');if(birth&&!profileButton?.isConnected){profileButton=document.createElement('button');profileButton.id='privateCalendarProfileV175';profileButton.type='button';profileButton.className='private-calendar-profile-v175';profileButton.textContent='생리 일정';profileButton.addEventListener('click',()=>open());birth.appendChild(profileButton);}
  if(profileButton){profileButton.hidden=!identity();profileButton.textContent=data?.settings?.menstrualEnabled?'생리 일정 · 사용 중':'생리 일정';}
  const calendarTools=document.querySelector('#home .schedule-calctl-v119')||$('addEmotionTop')?.parentElement||$('addScheduleTop')?.parentElement;
  if(calendarTools&&!toolbar?.isConnected){toolbar=document.createElement('span');toolbar.className='private-calendar-actions-v175';calendarTools.appendChild(toolbar);}
  if(toolbar){toolbar.replaceChildren();if(identity()&&data?.settings?.menstrualEnabled){const add=document.createElement('button');add.type='button';add.textContent='+ 생리일';add.addEventListener('click',()=>open('period'));toolbar.appendChild(add);}if(canIntimacy()){const add=document.createElement('button');add.type='button';add.textContent='+ 관계일';add.addEventListener('click',()=>open('intimacy'));toolbar.appendChild(add);}}
}
function build(){if(dialog)return;dialog=document.createElement('dialog');dialog.id='privateCalendarDialogV175';dialog.setAttribute('aria-labelledby','privateCalendarTitleV175');
  dialog.innerHTML='<header><h2 id="privateCalendarTitleV175">개인 캘린더</h2><button type="button" data-private-close aria-label="닫기" autofocus>×</button></header><div class="private-calendar-body-v175"><p id="privateCalendarStatusV175" role="status" aria-live="polite"></p><form id="privateCalendarSettingsV175"><label class="private-calendar-enabled"><input type="checkbox" name="menstrualEnabled">생리 일정 사용</label><div class="private-calendar-grid-v175"><label>평균 주기 · 일<input name="cycleLength" type="number" min="15" max="90" required></label><label>예상 기간 · 일<input name="periodLength" type="number" min="1" max="30" required></label></div><button type="submit">설정 저장</button></form><p class="private-calendar-notice-v175"></p><nav id="privateCalendarTabsV175" aria-label="개인 날짜 기록"></nav><form id="privateCalendarEntryV175"><div class="private-calendar-grid-v175"><label>시작일<input name="startDate" type="date" required></label><label>종료일<input name="endDate" type="date" required></label></div><div class="private-calendar-entry-actions"><button type="submit">기록 저장</button><button type="button" data-private-reset>새 기록</button></div></form><section id="privateCalendarListV175" aria-label="선택한 달의 개인 기록"></section><button type="button" data-private-retry>다시 불러오기</button></div>';
  document.body.appendChild(dialog);dialog.querySelector('.private-calendar-notice-v175').textContent=PRIVATE_CALENDAR_NOTICE;
  dialog.querySelector('[data-private-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
  dialog.querySelector('[data-private-retry]').addEventListener('click',()=>refresh(true));dialog.querySelector('[data-private-reset]').addEventListener('click',()=>{editing=null;draft=null;entryDirty=false;renderEntry();});
  $('privateCalendarEntryV175').addEventListener('input',()=>{entryDirty=true;});$('privateCalendarSettingsV175').addEventListener('input',()=>{settingsDirty=true;});
  $('privateCalendarSettingsV175').addEventListener('submit',async e=>{e.preventDefault();if(!data)return;const f=e.currentTarget;await save({type:'settings',expectedRevision:data.settings.revision,item:{menstrualEnabled:f.elements.menstrualEnabled.checked,cycleLength:Number(f.elements.cycleLength.value),periodLength:Number(f.elements.periodLength.value)}});});
  $('privateCalendarEntryV175').addEventListener('submit',async e=>{e.preventDefault();if(!data||busy)return;if(formKind==='intimacy'&&!canIntimacy())return;const f=e.currentTarget;
    const values=formKind==='period'?{startDate:f.elements.startDate.value,endDate:f.elements.endDate.value}:{date:f.elements.startDate.value};
    const fingerprint=JSON.stringify([actor,formKind,editing?.id,values]);if(draft?.fingerprint!==fingerprint)draft={fingerprint,id:editing?.id||crypto.randomUUID()};
    if(await save({type:formKind+'-save',item:{id:draft.id,...values,note:editing?.note||''},expectedRevision:editing?.revision||0})){editing=null;draft=null;entryDirty=false;renderEntry();}
  });
}
function renderStatus(){if(!dialog)return;const counts=data?.hasMore?.periods||data?.hasMore?.intimacy;$('privateCalendarStatusV175').textContent=error||(counts?'기록이 많아 일부만 표시됩니다. 달을 좁혀서 확인해주세요.':data?'내 계정에서만 표시됩니다. 친구·커플 일정에 자동 공유되지 않습니다.':'개인 기록을 불러오는 중입니다…');dialog.querySelectorAll('input,button').forEach(el=>el.disabled=busy);}
function renderEntry(){if(!dialog)return;const form=$('privateCalendarEntryV175'),isPeriod=formKind==='period';form.hidden=!data||(isPeriod?!data.settings.menstrualEnabled:!canIntimacy());
  form.elements.startDate.parentElement.firstChild.textContent=isPeriod?'시작일':'관계일';form.elements.endDate.parentElement.hidden=!isPeriod;form.elements.endDate.required=isPeriod;
  if(!entryDirty){form.elements.startDate.value=editing?(editing.startDate||editing.date):dateNow();form.elements.endDate.value=editing?.endDate||dateNow();}
}
function render(){install();if(!dialog)return;const settings=$('privateCalendarSettingsV175');if(data&&!busy&&!settingsDirty){settings.elements.menstrualEnabled.checked=data.settings.menstrualEnabled;settings.elements.cycleLength.value=data.settings.cycleLength;settings.elements.periodLength.value=data.settings.periodLength;}
  const nav=$('privateCalendarTabsV175');nav.replaceChildren();for(const kind of ['period',...(canIntimacy()?['intimacy']:[])]){const b=document.createElement('button');b.type='button';b.textContent=kind==='period'?'생리일 추가':'관계일 추가';b.setAttribute('aria-pressed',String(formKind===kind));b.addEventListener('click',()=>{formKind=kind;editing=null;draft=null;entryDirty=false;render();});nav.appendChild(b);}
  if(formKind==='intimacy'&&!canIntimacy())formKind='period';renderEntry();const list=$('privateCalendarListV175');list.replaceChildren();
  const rows=(formKind==='period'?data?.periods:data?.intimacy)||[],r=range();for(const row of rows.filter(row=>(row.endDate||row.date)>=r.from&&(row.startDate||row.date)<=r.to).sort((a,b)=>(b.startDate||b.date).localeCompare(a.startDate||a.date))){
    const article=document.createElement('article'),label=document.createElement('span');label.textContent=formKind==='period'?`${row.startDate} ~ ${row.endDate}`:row.date;article.appendChild(label);
    const edit=document.createElement('button');edit.type='button';edit.textContent='수정';edit.addEventListener('click',()=>{editing=row;draft=null;entryDirty=false;renderEntry();});article.appendChild(edit);
    const remove=document.createElement('button');remove.type='button';remove.textContent='삭제';remove.addEventListener('click',async()=>{if(confirm('선택한 날짜 기록을 삭제할까요?'))await save({type:formKind+'-delete',id:row.id,expectedRevision:row.revision});});article.appendChild(remove);list.appendChild(article);
  }renderStatus();
}
async function save(action){const key=identity(),version=epoch;if(!key||busy||!data)return false;if(Date.now()<retryAt){renderStatus();return false;}busy=true;renderStatus();let success=false;
  try{await api().mutatePrivateCalendar(action);if(key!==identity()||epoch!==version)return false;error='';success=true;}
  catch(err){if(key===identity()&&epoch===version)message(failure(err));}
  finally{if(epoch===version){busy=false;renderStatus();}}
  if(success){if(action.type==='settings')settingsDirty=false;await refresh(true);if(error)return false;}return success;
}
async function open(kind='period'){if(!identity())return;const nextKind=kind==='intimacy'&&canIntimacy()?'intimacy':'period';if(formKind!==nextKind){editing=null;draft=null;entryDirty=false;}formKind=nextKind;build();
  const closeProfile=document.querySelector('#loginModal.open [data-close="loginModal"], .profile-overlay-v137.on [data-profile-close-v137]');closeProfile?.click();render();if(!dialog.open)dialog.showModal();dialog.querySelector('[data-private-close]').focus();await refresh(true);
}
function calendarChanged(){install();decorateCalendar();refresh();}
window.AiderPrivateCalendarUIV175=Object.freeze({calendarChanged,decorateCalendar,refresh,open,syncProfile:install});
['aiderdear-firebase-ready','aiderdear-firebase-state'].forEach(name=>addEventListener(name,()=>{identity();install();refresh();}));
if(api()?.subscribe)api().subscribe(()=>{identity();install();refresh();});calendarChanged();
