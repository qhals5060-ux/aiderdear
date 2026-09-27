/* Active native widget adapter. Models, not flattened calendar DOM, are the source. */
(() => {
  'use strict';
  const native=window.AiderLogNative;
  if(typeof native?.syncWidgets!=='function')return;
  const array=value=>Array.isArray(value)?value:[];
  const str=value=>String(value??'').trim();
  const date=value=>str(value).slice(0,10);
  const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const activityDate=value=>{const d=new Date(value);return Number.isFinite(d.getTime())?key(d):''};
  const read=name=>{try{return JSON.parse(localStorage.getItem(name)||'{}')}catch{return{}}};
  const text=row=>str(row?.text||row?.title||row?.name||row?.note);
  const newest=(a,b)=>Number(b.updatedAt||b.createdAt||0)-Number(a.updatedAt||a.createdAt||0);
  const allowed=new Set(['qhals5060@gmail.com','aidway55@gmail.com']);
  const themeMap={system:'aurora',sun:'sunset',mercury:'mono',venus:'rose',earth:'ocean',mars:'rose',jupiter:'sunset',saturn:'lavender',uranus:'mint',neptune:'midnight',pluto:'mono'};
  const copy=value=>JSON.parse(JSON.stringify(value));
  const object=value=>value&&typeof value==='object'&&!Array.isArray(value);
  const auth=()=>window.AiderDearFirebase?.getState?.()||{};
  const identity=state=>state?.user?.uid?`${state.user.uid}|${state.pair?.id||'solo'}`:'';
  const cacheKey=owner=>`aiderlog.widgets.verified.v164:${encodeURIComponent(owner)}`;
  let owner='',ownerState={},epoch=0,source={app:{},personal:{}},verified=false;
  let apiBound=null,refreshTimer=0,refreshRun=0,logoutPending=false,logoutOwner='',refreshFlight=null,refreshFlightKinds=new Set(),refreshForce=false;
  let parts={app:false,personal:false,schedule:false},versions={app:0,personal:0,schedule:0};const refreshScopes=new Set();
  const photoCache=new Map();let photoRun=0;
  // A/P and the v20 local keys are legacy, unscoped data. They can still contain
  // another user's fields while the app merges a new cloud response. Never read
  // them here: only atomically owner-tagged, scoped Firebase responses are used.
  const widgetApp=value=>({scheduleEvents:array(value?.scheduleEvents)});
  const widgetPrivate=value=>({routines:array(value?.routines),checklists:array(value?.checklists),memos:array(value?.memos).filter(row=>row&&row.category!=='emotion'&&!row.demo).sort(newest).slice(0,100).map(row=>({id:str(row.id),text:text(row).slice(0,180),notes:str(row.notes||row.note||row.preview||row.description).slice(0,240),updatedAt:Number(row.updatedAt||row.createdAt||0)}))});
  function blankSnapshot(){return {version:194,uid:'',v165:{},email:'',theme:themeMap[document.documentElement.dataset.theme]||'aurora',syncState:'account-unverified',accessState:owner&&!logoutPending?'sync-required':'needs-login',scheduleItems:[],schedule:[],holidays:{},routines:[],routineStats:[],todos:[]};}
  function sendBlank(){try{const payload=JSON.stringify(blankSnapshot());native.syncWidgets(payload);last=payload;}catch{last='';}}
  function changeOwner(state){
    const next=identity(state);if(next===owner)return;
    epoch++;refreshRun++;photoRun++;clearTimeout(timer);clearTimeout(refreshTimer);
    owner=next;ownerState=state||{};source={app:{},personal:{}};verified=false;photoCache.clear();refreshFlight=null;refreshFlightKinds.clear();refreshForce=false;refreshScopes.clear();parts={app:false,personal:false,schedule:false};versions={app:0,personal:0,schedule:0};
    // This bypasses the normal debounce: an old account must disappear immediately.
    sendBlank();
    if(!next)return;
    const cached=read(cacheKey(next));
    if(cached.owner===next&&object(cached.app)&&object(cached.personal)){
      source={app:widgetApp(cached.app),personal:widgetPrivate(cached.personal)};verified=true;parts={app:true,personal:true,schedule:true};sync();prepareMealPhotos();
    }
    requestRefresh(0);
  }
  function checkOwner(){
    const state=auth();if(logoutPending)return false;
    changeOwner(state);ownerState=state;
    return Boolean(owner&&identity(state)===owner);
  }
  function stillCurrent(expectedEpoch,expectedOwner){return !logoutPending&&epoch===expectedEpoch&&owner===expectedOwner&&identity(auth())===expectedOwner;}
  function publish(){
    verified=parts.app&&parts.personal&&parts.schedule;
    if(verified)try{localStorage.setItem(cacheKey(owner),JSON.stringify({owner,...source}));}catch{}
    sync();if(verified){prepareMealPhotos();flushCommands();}
  }
  function scheduleRows(value){if(!Array.isArray(value)&&!(object(value)&&Array.isArray(value.own)&&Array.isArray(value.shared)))return null;const rows=Array.isArray(value)?value:[...value.own,...value.shared],byId=new Map();rows.forEach((row,index)=>{if(object(row))byId.set(str(row.id)||'undated:'+index,copy(row));});return [...byId.values()];}
  function acceptPart(kind,payload){
    if(kind==='schedule'){if(payload!==undefined){const rows=scheduleRows(payload);if(!rows)return false;source.app.scheduleEvents=rows;}}
    else {if(payload!==null&&!object(payload))return false;const value=copy(payload||{});if(kind==='app'&&typeof window.AiderDearFirebase?.readScheduleData==='function')value.scheduleEvents=source.app.scheduleEvents||[];source[kind]=kind==='app'?widgetApp(value):widgetPrivate(value);}
    parts[kind]=true;versions[kind]++;return true;
  }
  function receive(kind,detail){
    if(!checkOwner()||!detail||detail.hasPendingWrites||detail.fromCache&&detail.exists===false)return;
    const uid=str(ownerState.user?.uid),pair=str(ownerState.pair?.id);
    if(kind==='app'?detail.scope!==uid+':'+(pair||'solo'):detail.uid!==uid)return;
    if(kind==='schedule'&&str(detail.pairId)!==pair)return;
    if(!Object.hasOwn(detail,'payload')||!acceptPart(kind,detail.payload))return;
    refreshScopes.delete(kind);publish();
  }
  function requestRefresh(delay=500,scopes=['app','personal','schedule'],force=false){scopes.forEach(kind=>refreshScopes.add(kind));refreshForce=refreshForce||force;clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{const kinds=[...refreshScopes],forced=refreshForce;refreshScopes.clear();refreshForce=false;return refresh(kinds,forced);},delay);}
  async function refresh(scopes=['app','personal','schedule'],force=false){
    if(!checkOwner())return;
    if(refreshFlight){scopes.filter(kind=>force||!refreshFlightKinds.has(kind)).forEach(kind=>refreshScopes.add(kind));refreshForce=refreshForce||force;return refreshFlight;}
    clearTimeout(refreshTimer);refreshScopes.clear();
    const api=window.AiderDearFirebase,expectedEpoch=epoch,expectedOwner=owner,run=++refreshRun;
    if(typeof api?.readAppData!=='function'||typeof api?.readPrivateData!=='function')return;
    const captured={...versions};
    const task=(async()=>{try{
      const methods={app:'readAppData',personal:'readPrivateData',schedule:'readScheduleData'};
      const result=await Promise.all(scopes.map(async kind=>{
        if(kind==='schedule'){const cached=window.AiderAppScheduleV191?.snapshot?.();if(cached?.uid===ownerState.user?.uid&&str(cached.pairId)===str(ownerState.pair?.id))return[kind,cached.payload];if(typeof api.readScheduleData!=='function')return[kind,undefined];}
        return[kind,await api[methods[kind]](kind==='personal'?{remember:false}:undefined)];
      }));
      if(!stillCurrent(expectedEpoch,expectedOwner)||run!==refreshRun)return;
      if(result.some(([kind,payload])=>kind==='schedule'?payload!==undefined&&!scheduleRows(payload):payload!==null&&!object(payload)))return;
      for(const [kind,payload]of result)if(captured[kind]===versions[kind])acceptPart(kind,payload);
      publish();
    }catch{/* Offline: retain only this owner's verified snapshot. */}})();
    refreshFlight=task;refreshFlightKinds=new Set(scopes);
    try{return await task;}finally{if(refreshFlight===task){refreshFlight=null;refreshFlightKinds.clear();if(refreshScopes.size)requestRefresh(50,[]);}}
  }
  function bindAuth(){
    const api=window.AiderDearFirebase;if(!api||apiBound===api)return;apiBound=api;
    if(typeof api.subscribe==='function')api.subscribe(state=>{
      const next=identity(state);if(logoutPending&&next===logoutOwner)return;
      logoutPending=false;changeOwner(state);ownerState=state||{};
    });
    for(const method of ['writeAppData','writePrivateData','writeScheduleData']){
      const original=api[method];if(typeof original!=='function')continue;
      api[method]=function(...args){const expectedEpoch=epoch,expectedOwner=owner;return Promise.resolve(original.apply(this,args)).then(result=>{if(stillCurrent(expectedEpoch,expectedOwner)){const kind=method==='writePrivateData'?'personal':method==='writeScheduleData'?'schedule':'app';if(kind==='personal'&&object(result)){acceptPart(kind,result);publish();}else if(kind==='app'&&object(args[0])){acceptPart(kind,args[0]);publish();}else{versions[kind]++;requestRefresh(50,[kind],true);}}return result;});};
    }
    if(typeof api.logout==='function'){
      const logout=api.logout;api.logout=function(...args){logoutOwner=identity(auth());logoutPending=true;changeOwner({});return logout.apply(this,args);};
    }
  }
  function prepareMealPhotos(){} // v193: retained widgets contain no photos.
  function snapshot(){
    if(!checkOwner()||!verified)return blankSnapshot();
    const {app,personal}=source,state=ownerState;
    const email=str(state?.user?.email).toLowerCase(),now=new Date(),today=key(now);
    const calendar=window.AiderWorkCalendarV168;
    // Reuse the current owner's API projection; legacy workRecords are no longer
    // authoritative. Never join another account's cached Work rows to a widget.
    const projected=[];
    // This adapter only reads the friend controller's current, identity-checked
    // projection. It neither creates a new subscription nor exports to Google.
    const received=array(window.AiderFriendScheduleUIV175?.events?.());
    const scheduleColor=row=>{const fallback=str(row.sourceColor||row.color),candidate=window.AiderSharedScheduleV176?.color?.(row,state.user,fallback)||fallback;return /^#[0-9a-f]{6}$/i.test(candidate)?candidate:'#6255E8';};
    const scheduleItems=[...new Map([...array(app.scheduleEvents),...projected,...received].filter(row=>row?.date&&row?.title&&!row.demo).map(row=>[str(row.id),{id:str(row.id),date:date(row.date),endDate:date(row.endDate||row.date),time:row.allDay?'':str(row.time),allDay:!!row.allDay,title:str(row.title),color:scheduleColor(row),readOnly:!!(row.readOnly||row.projectionSource||row.friendShared),friendShared:!!row.friendShared,projectionSource:['work','consult','consulting','estate'].includes(str(row.projectionSource))?str(row.projectionSource):''}])).values()].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    const holidays={};
    for(let year=now.getFullYear()-1;year<=now.getFullYear()+2;year++)for(let day=new Date(year,0,1);day.getFullYear()===year;day.setDate(day.getDate()+1)){
      const k=key(day),label=window.AiderLogHolidayTitleV164?.(k);if(label)holidays[k]=label;
    }
    const routines=array(personal.routines).map(row=>{
      const days=[...new Set(array(row.doneDates))].length,goal=Number(row.goalDays)||0,level=str(row.dailyLevels?.[today]);
      return `${text(row)}${goal?` · ${days} / ${goal}일`:''}${level?` · ${level.toUpperCase()}`:''}`;
    }).filter(Boolean);
    const uid=state.user.uid;
    const checks=array(personal.checklists).filter(row=>row&&!row.demo&&row.kind!=='memo'&&row.type!=='memo'&&row.category!=='emotion');
    const todos=checks.map(row=>`${row.done?'✓':'○'} ${text(row)}${row.dueAt||row.date?' · '+date(row.dueAt||row.date):''}`);
    return {version:194,uid,v165:window.AiderWidgetModelsV165?.build({app,personal,uid,now})||{},email,theme:themeMap[document.documentElement.dataset.theme]||'aurora',today:new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(now),month:new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long'}).format(now),scheduleItems,holidays,schedule:scheduleItems.map(row=>`${row.date} ${row.time} ${row.title}`),routines,routineStats:routines,todos};
  }
  let timer=0,last='';
  const commandQueueKey=uid=>`aiderlog.widget-actions.v165:${encodeURIComponent(uid)}`;
  const retainedKinds=new Set(['CalendarMonth','CalendarCombined','CalendarSplit','CalendarFortnight','RoutineAll','RoutineCards','RoutineStats']);
  const retainedCommand=command=>retainedKinds.has(str(command?.kind))&&(['todo','routine','add-todo'].includes(command.op)||command.op==='open'&&['routine','todo','note'].includes(command.value));
  let executing=false;
  function enqueue(command){const name=commandQueueKey(command.uid),rows=array(read(name)),remaining=rows.filter(row=>row.key!==command.key&&!(row.id===command.id&&row.op===command.op));remaining.push(command);localStorage.setItem(name,JSON.stringify(remaining));}
  function notify(message){if(typeof window.toast==='function')window.toast(message);else if(typeof window.AiderLogAppShell?.toast==='function')window.AiderLogAppShell.toast(message);}
  function openScheduleWidget(raw){
    let record;try{record=JSON.parse(decodeURIComponent(raw));}catch{return;}
    if(str(record.uid)!==str(auth()?.user?.uid))return;
    if(typeof go==='function')go('home',false);else location.hash='home';
    setTimeout(()=>window.AiderLogCalendarV125?.openSchedule?.(date(record.selectedDate||record.date),str(record.id)),250);
  }
  async function flushCommands(){
    if(executing||!checkOwner()||!verified||typeof window.AiderDearFirebase?.applyWidgetActionV165!=='function')return;
    executing=true;const uid=ownerState.user.uid,expectedEpoch=epoch,expectedOwner=owner,name=commandQueueKey(uid);
    try{for(const command of array(read(name))){if(!stillCurrent(expectedEpoch,expectedOwner))break;if(!retainedCommand(command)){localStorage.setItem(name,JSON.stringify(array(read(name)).filter(row=>row.key!==command.key)));const archiveKey=name+':retired-v193';localStorage.setItem(archiveKey,JSON.stringify([...array(read(archiveKey)),command]));continue;}try{
      const localRows=typeof P!=='undefined'?array(P[command.op==='routine'?'routines':'checklists']):[],localRow=localRows.find(row=>str(row.id)===str(command.id)),localBefore=JSON.stringify(localRow||null);
      const result=await window.AiderDearFirebase.applyWidgetActionV165(command);if(!stillCurrent(expectedEpoch,expectedOwner))break;
      localStorage.setItem(name,JSON.stringify(array(read(name)).filter(row=>row.key!==command.key)));
      if(object(result?.payload)){source.personal=widgetPrivate(copy(result.payload));try{localStorage.setItem(cacheKey(owner),JSON.stringify({owner,...source}))}catch{}}
      sync();if(!object(result?.payload))requestRefresh(50,['personal']);window.dispatchEvent(new CustomEvent('aiderlog:widget-private-changed',{detail:{uid,payload:result?.payload,command,localBefore}}));
    }catch(error){if(!stillCurrent(expectedEpoch,expectedOwner))break;const code=String(error?.code||error?.message||''),terminal=['stale-action','invalid-action','not-found','replay-mismatch','invalid-data','goal-linked','permission-denied','unauthenticated'].some(value=>code.includes(value));if(code.includes('goal-linked')){window.AiderLogAppShell?.openTarget?.('routine','');notify('목표 연동 루틴은 앱에서 목표별 수행을 수정해주세요.');}if(terminal){localStorage.setItem(name,JSON.stringify(array(read(name)).filter(row=>row.key!==command.key)));const draftsKey=`${name}:failed`;localStorage.setItem(draftsKey,JSON.stringify([...array(read(draftsKey)),{command,error:code,at:Date.now()}]));notify(code.includes('stale-action')?'기록이 변경되어 다시 불러왔습니다. 위젯에서 다시 선택해주세요.':'저장할 수 없는 작업입니다. 입력 내용은 기기에 보관했습니다. 앱에서 확인해주세요.');requestRefresh(0,['personal'],true);continue;}notify('기기에 저장했습니다. 연결되면 동기화합니다.');break;}}}finally{executing=false;}
  }
  function quickAdd(command){
    const dialog=document.createElement('dialog');dialog.style.cssText='width:min(92vw,480px);max-height:60dvh;padding:20px;border:1px solid var(--line,#ded9ff);border-radius:20px;background:var(--card,#f7f6ff);color:var(--ink,#171a3a)';
    const form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('textarea'),dateInput=document.createElement('input'),buttons=document.createElement('div'),save=document.createElement('button'),cancel=document.createElement('button');
    label.textContent=command.op==='add-todo'?'할 일 (180자 이내)':'메모 (180자 이내)';input.rows=3;input.required=true;input.maxLength=180;input.setAttribute('aria-label',label.textContent);input.style.cssText='display:block;width:100%;box-sizing:border-box;margin:10px 0;padding:12px;font:inherit';dateInput.type='date';dateInput.setAttribute('aria-label','기한 (선택)');dateInput.style.cssText='width:100%;padding:10px;box-sizing:border-box;font:inherit';dateInput.hidden=command.op!=='add-todo';
    buttons.style.cssText='display:flex;justify-content:flex-end;gap:12px;margin-top:14px';save.type='submit';save.textContent='저장';cancel.type='button';cancel.textContent='취소';for(const b of [save,cancel])b.style.cssText='min-width:68px;min-height:44px;font:inherit';buttons.append(cancel,save);form.append(label,input,dateInput,buttons);dialog.append(form);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());cancel.onclick=()=>dialog.close();form.onsubmit=e=>{e.preventDefault();if(!str(input.value))return;const uid=auth()?.user?.uid;if(uid!==command.uid){dialog.close();return;}const id='widget-'+crypto.randomUUID();enqueue({...command,id,key:id,value:str(input.value),date:dateInput.value||''});dialog.close();flushCommands();};dialog.showModal();
  }
  async function commandAction(raw){
    let command;try{command=JSON.parse(decodeURIComponent(String(raw).slice(12)));}catch{return;}
    if(!object(command)||!retainedCommand(command)||str(command.uid)!==str(auth()?.user?.uid)||!checkOwner())return;
    if(command.op==='add-todo'){quickAdd(command);return;}
    if(['todo','routine'].includes(command.op)){if(!str(command.id)||!str(command.key)||command.key.length>1000)return;enqueue(command);if(!verified)await refresh();flushCommands();return;}
    if(command.op==='open'){
      if(command.value==='note'){
        if(!['memos','checklists'].includes(str(command.source)))return;
        const notebook=window.AiderTodoV179;if(!notebook)return;
        await notebook.refresh?.();if(str(auth()?.user?.uid)!==str(command.uid))return;
        notebook.open?.('memo');if(str(command.id))notebook.edit?.(command.source,command.id,'memo');return;
      }
      const target=command.value==='routine'?'routine':'schedule';window.AiderLogAppShell?.openTarget?.(target,'');if(command.value==='todo')document.querySelector('#quickMemoBtn')?.click();
    }
  }
  function sync(){clearTimeout(timer);timer=setTimeout(()=>{try{const payload=JSON.stringify(snapshot());if(payload!==last&&payload.length<=4194304){native.syncWidgets(payload);last=payload}else if(payload.length>4194304){sendBlank();console.warn('[widgets-v164] Snapshot exceeds native transfer limit.');}}catch{sendBlank();console.warn('[widgets-v164] Snapshot sync failed.');}},250)}
  function hook(){
    const shell=window.AiderLogAppShell;if(!shell||shell.widgetV164)return;
    shell.widgetV164=true;shell.syncWidgets=sync;const open=shell.openTarget;
    shell.openTarget=function(target,action){
      if(String(action||'').startsWith('create-client-intake-v168:'))return;
      if(String(action||'').startsWith('open-schedule-item-v168:')){openScheduleWidget(String(action).slice(24));return;}
      if(String(action||'').startsWith('open-schedule-date-v168:')){const requested=String(action).slice(24);if(typeof go==='function')go('home',false);setTimeout(()=>window.AiderLogCalendarV125?.openSchedule?.(requested),250);return;}
      if(String(action||'').startsWith('widget-v165:')){commandAction(action);return;}
      if(String(action||'').startsWith('add-schedule:')){
        if(typeof go==='function')go('home',false);else location.hash='home';
        const requested=String(action).slice(13);
        setTimeout(()=>{if(/^\d{4}-\d{2}-\d{2}$/.test(requested))window.AiderLogCalendarV125?.openSchedule?.(requested)},300);
        return;
      }
      if(action==='add-memo')return;
      if(action==='add-todo'){document.querySelector('#quickMemoBtn')?.click();return;}
      return open?.call(this,target,action);
    };
  }
  window.AiderWidgetSyncV164={snapshot,sync,refresh,prepareMealPhotos,commandAction,flushCommands};
  addEventListener('online',()=>{requestRefresh(0);flushCommands()});
  addEventListener('aiderlog-calendar-projection-v168',()=>sync());
  addEventListener('aiderlog-friend-schedule-data',()=>sync());
  addEventListener('aiderlog:todo-changed-v179',event=>{if(object(event.detail?.payload))receive('personal',event.detail);sync();});
  addEventListener('aiderdear-firebase-data',event=>receive('app',event.detail));
  addEventListener('aiderdear-firebase-private-data',event=>receive('personal',event.detail));
  addEventListener('aiderlog:verified-schedule-data-v191',event=>receive('schedule',event.detail));
  document.addEventListener('click',sync,{passive:true});document.addEventListener('change',sync,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkOwner();sync();if(!verified)requestRefresh();prepareMealPhotos()}});
  addEventListener('aiderlog:data-changed',()=>sync());addEventListener('aiderdear-firebase-ready',()=>{bindAuth();sync()});addEventListener('pageshow',()=>{bindAuth();sync();if(!verified)requestRefresh()});
  new MutationObserver(()=>{hook();sync()}).observe(document.body,{childList:true,subtree:true,characterData:true});
  sendBlank();bindAuth();hook();sync();setTimeout(()=>{bindAuth();hook();sync();prepareMealPhotos()},1000);
})();
