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
  let apiBound=null,refreshTimer=0,refreshRun=0,logoutPending=false,logoutOwner='';
  const photoCache=new Map();let photoRun=0;
  // A/P and the v20 local keys are legacy, unscoped data. They can still contain
  // another user's fields while the app merges a new cloud response. Never read
  // them here: only atomically owner-tagged, scoped Firebase responses are used.
  function blankSnapshot(){return {version:165,uid:'',v165:{},email:'',theme:themeMap[document.documentElement.dataset.theme]||'aurora',syncState:'account-unverified',accessState:owner&&!logoutPending?'sync-required':'needs-login',scheduleItems:[],schedule:[],holidays:{},routines:[],routineStats:[],languageRows:[],language:'',youtubeNotes:[],memos:[],todos:[],memoTodos:[],readingBooks:[],readingCurrent:[],quote:'',workouts:[],workoutStats:[],workoutStatsInbody:[],challengeSelected:[],challengeAll:[],challengeCombined:[],workoutChallenges:[],mealWorkouts:[],mealPhotos:['','','',''],mealTimes:['','','',''],mealRatings:['','','',''],meals:[],workflows:[],bullet3:[],bullet7:[],bullet3Workflow:[],bullet7Workflow:[]};}
  function sendBlank(){try{const payload=JSON.stringify(blankSnapshot());native.syncWidgets(payload);last=payload;}catch{last='';}}
  function changeOwner(state){
    const next=identity(state);if(next===owner)return;
    epoch++;refreshRun++;photoRun++;clearTimeout(timer);clearTimeout(refreshTimer);
    owner=next;ownerState=state||{};source={app:{},personal:{}};verified=false;photoCache.clear();
    // This bypasses the normal debounce: an old account must disappear immediately.
    sendBlank();
    if(!next)return;
    const cached=read(cacheKey(next));
    if(cached.owner===next&&object(cached.app)&&object(cached.personal)){
      source={app:cached.app,personal:cached.personal};verified=true;sync();prepareMealPhotos();
    }
    requestRefresh(0);
  }
  function checkOwner(){
    const state=auth();if(logoutPending)return false;
    changeOwner(state);ownerState=state;
    return Boolean(owner&&identity(state)===owner);
  }
  function stillCurrent(expectedEpoch,expectedOwner){return !logoutPending&&epoch===expectedEpoch&&owner===expectedOwner&&identity(auth())===expectedOwner;}
  function requestRefresh(delay=500){clearTimeout(refreshTimer);refreshTimer=setTimeout(refresh,delay);}
  async function refresh(){
    if(!checkOwner())return;
    const api=window.AiderDearFirebase,expectedEpoch=epoch,expectedOwner=owner,run=++refreshRun;
    if(typeof api?.readAppData!=='function'||typeof api?.readPrivateData!=='function')return;
    try{
      const [app,personal,schedule]=await Promise.all([api.readAppData(),api.readPrivateData(),typeof api.readScheduleData==='function'?api.readScheduleData():Promise.resolve(null)]);
      if(!stillCurrent(expectedEpoch,expectedOwner)||run!==refreshRun)return;
      // A successfully scoped null means this account has not created that
      // document yet. It is a verified empty component, never a reason to import
      // legacy A/P. Rejected reads reach catch and keep only this owner's cache.
      if((app!==null&&!object(app))||(personal!==null&&!object(personal)))return;
      const cleanApp=copy(app||{}),scheduleRows=Array.isArray(schedule)?schedule:[...array(schedule?.own),...array(schedule?.shared)];
      if(scheduleRows.length){const byId=new Map();[...array(cleanApp.scheduleEvents),...scheduleRows].forEach((row,index)=>{if(row&&typeof row==='object')byId.set(str(row.id)||`undated:${index}`,copy(row));});cleanApp.scheduleEvents=[...byId.values()];}
      source={app:cleanApp,personal:copy(personal||{})};verified=true;
      try{localStorage.setItem(cacheKey(owner),JSON.stringify({owner,...source}));}catch{}
      sync();prepareMealPhotos();flushCommands();
    }catch{/* Offline: retain only the already verified snapshot for this owner. */}
  }
  function bindAuth(){
    const api=window.AiderDearFirebase;if(!api||apiBound===api)return;apiBound=api;
    if(typeof api.subscribe==='function')api.subscribe(state=>{
      const next=identity(state);if(logoutPending&&next===logoutOwner)return;
      logoutPending=false;changeOwner(state);ownerState=state||{};
    });
    for(const method of ['writeAppData','writePrivateData','writeScheduleData']){
      const original=api[method];if(typeof original!=='function')continue;
      api[method]=function(...args){const expectedEpoch=epoch,expectedOwner=owner;return Promise.resolve(original.apply(this,args)).then(result=>{if(stillCurrent(expectedEpoch,expectedOwner))requestRefresh(50);return result;});};
    }
    if(typeof api.logout==='function'){
      const logout=api.logout;api.logout=function(...args){logoutOwner=identity(auth());logoutPending=true;changeOwner({});return logout.apply(this,args);};
    }
  }
  async function prepareMealPhotos(){
    if(!checkOwner()||!verified)return;
    const run=++photoRun,expectedEpoch=epoch,expectedOwner=owner,personal=source.personal,user=ownerState.user.uid;
    try{
      const meals=array(personal.personalItems).filter(row=>row.category==='health'&&row.details?.healthType==='meal'&&date(row.date)===key(new Date())).slice().sort(newest);
      const selected=['breakfast','lunch','dinner','snack'].map(slot=>meals.find(row=>row.details?.mealType===slot)).filter(Boolean);
      const coverKeys=new Set();array(personal.personalItems).filter(row=>row.category==='reading'&&!row.demo).sort((a,b)=>str(b.date).localeCompare(str(a.date))||Number(b.createdAt||0)-Number(a.createdAt||0)).forEach(row=>{const id=window.AiderWidgetModelsV165?.bookKey?.(row)||row.id;if(!coverKeys.has(id)&&(row.media?.fileId||row.localImage)){coverKeys.add(id);selected.push(row)}});
      for(const row of selected){
        if(!stillCurrent(expectedEpoch,expectedOwner)||run!==photoRun)return;
        const cacheKey=`${user}:${row.id}:${row.media?.fileId||row.updatedAt||row.createdAt||''}`;
        if(photoCache.has(cacheKey))continue;
        let url=str(row.localImage),revoke=false;
        if(!url&&row.media?.fileId&&typeof window.AiderDearFirebase?.readPrivateMedia==='function'){try{const blob=await window.AiderDearFirebase.readPrivateMedia(row.media.fileId);if(!stillCurrent(expectedEpoch,expectedOwner)||run!==photoRun)return;url=URL.createObjectURL(blob);revoke=true}catch{continue}}
        if(!url)continue;
        try{
          const image=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=url});
          if(!stillCurrent(expectedEpoch,expectedOwner)||run!==photoRun)return;
          const canvas=document.createElement('canvas'),cover=row.category==='reading',width=cover?80:180,height=cover?110:140;canvas.width=width;canvas.height=height;const scale=(cover?Math.min:Math.max)(width/image.width,height/image.height),context=canvas.getContext('2d');if(cover){context.fillStyle='#F7F6FF';context.fillRect(0,0,width,height)}context.drawImage(image,(width-image.width*scale)/2,(height-image.height*scale)/2,image.width*scale,image.height*scale);
          photoCache.set(cacheKey,canvas.toDataURL('image/jpeg',cover?.4:.5));
        }catch{}finally{if(revoke)URL.revokeObjectURL(url)}
      }
    }finally{if(stillCurrent(expectedEpoch,expectedOwner)&&run===photoRun)sync()}
  }
  function snapshot(){
    if(!checkOwner()||!verified)return blankSnapshot();
    const {app,personal}=source,state=ownerState;
    const email=str(state?.user?.email).toLowerCase(),now=new Date(),today=key(now);
    const consulting=allowed.has(email)?array(personal.consultingTasks).filter(row=>row.dueDate&&!row.demo).map(row=>({...row,id:`consulting:${row.id}`,date:row.dueDate,time:row.dueTime||row.time||''})):[];
    const work=allowed.has(email)?array(personal.workRecords).filter(row=>(row.dueDate||row.date)&&!row.demo).map(row=>({...row,id:`work:${row.id}`,date:row.dueDate||row.date,time:row.dueTime||row.time||''})):[];
    const scheduleItems=[...array(app.scheduleEvents),...consulting,...work].filter(row=>row?.date&&row?.title&&!row.demo).map(row=>({id:str(row.id),date:date(row.date),endDate:date(row.endDate||row.date),time:str(row.time),title:str(row.title)})).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    const holidays={};
    for(let year=now.getFullYear()-1;year<=now.getFullYear()+2;year++)for(let day=new Date(year,0,1);day.getFullYear()===year;day.setDate(day.getDate()+1)){
      const k=key(day),label=window.AiderLogHolidayTitleV164?.(k);if(label)holidays[k]=label;
    }
    const routines=array(personal.routines).map(row=>{
      const days=[...new Set(array(row.doneDates))].length,goal=Number(row.goalDays)||0,level=str(row.dailyLevels?.[today]);
      return `${text(row)}${goal?` · ${days} / ${goal}일`:''}${level?` · ${level.toUpperCase()}`:''}`;
    }).filter(Boolean);
    const checks=array(personal.checklists).slice().sort((a,b)=>Number(Boolean(a.done))-Number(Boolean(b.done))||(a.done?newest(a,b):str(a.date||'9999').localeCompare(str(b.date||'9999'))||newest(a,b)));
    const todos=checks.filter(row=>row.date).map(row=>`${row.done?'✓':'○'} ${text(row)} · ${date(row.date)}`);
    const memos=[...checks.filter(row=>!row.date),...array(personal.memos||personal.notes)].slice().sort(newest).map(text).filter(Boolean);
    const items=array(personal.personalItems).filter(row=>row?.category!=='emotion');
    const health=items.filter(row=>row.category==='health'),workflows=items.filter(row=>row.category==='workflow').map(row=>`${text(row)}${row.details?.stage?` · ${row.details.stage}`:''}`);
    const mealItems=health.filter(row=>row.details?.healthType==='meal'&&date(row.date)===today).slice().sort(newest),uid=state?.user?.uid||'local';
    const mealSlots=['breakfast','lunch','dinner','snack'].map(slot=>mealItems.find(row=>row.details?.mealType===slot));
    const mealPhotos=mealSlots.map(row=>row?photoCache.get(`${uid}:${row.id}:${row.media?.fileId||row.updatedAt||row.createdAt||''}`)||'':'');
    const mealTimes=mealSlots.map(row=>str(row?.details?.time||row?.details?.mealTime)),mealRatings=mealSlots.map(row=>row?.details?.rating==null?'':Math.max(0,Math.min(5,Number(row.details.rating))));
    const workouts=health.filter(row=>row.details?.healthType==='exercise'&&date(row.date)===today).map(row=>{
      const d=row.details||{},minutes=Number(row.minutes??d.minutes),exercises=array(d.exercises).map(ex=>str(ex.name)).filter(Boolean);
      return `${text(row)}${minutes?` · ${minutes}분`:''}${exercises.length?` · ${exercises.join(', ')}`:''}`;
    });
    const exerciseHistory=health.filter(row=>row.details?.healthType==='exercise'),recent=exerciseHistory.filter(row=>{const value=Date.parse(date(row.date));return Number.isFinite(value)&&value>=Date.now()-7*86400000});
    const minutes=recent.map(row=>Number(row.minutes??row.details?.minutes)).filter(Number.isFinite);
    const workoutStats=recent.length?[`최근 7일 · 운동 ${recent.length}회`,...(minutes.length?[`총 ${minutes.reduce((a,b)=>a+b,0)}분 · 평균 ${Math.round(minutes.reduce((a,b)=>a+b,0)/minutes.length)}분`,`최장 ${Math.max(...minutes)}분`]:[])]:[];
    const inbody=health.filter(row=>row.details?.healthType==='inbody').slice().sort((a,b)=>str(b.date).localeCompare(str(a.date))).slice(0,4).map(row=>{const d=row.details||{};return `${date(row.date)} · ${[['체중',d.inbodyWeight,'kg'],['골격근량',d.inbodyMuscle,'kg'],['체지방률',d.inbodyFatPercent,'%']].filter(([,value])=>value!=null&&value!=='').map(([label,value,unit])=>`${label} ${value}${unit}`).join(' · ')}`});
    const challenges=health.filter(row=>row.details?.challengeId).map(row=>`${text(row)} · DAY ${row.details.challengeDay||'—'}${row.details.challengeTarget?` · ${row.details.challengeTarget}${row.details.challengeUnit||''}`:''}`);
    const books=new Map();items.filter(row=>row.category==='reading').slice().sort(newest).forEach(row=>{const d=row.details||{},book=str(d.bookId||row.bookId)||(str(row.title).toLowerCase()+'|'+str(d.author).toLowerCase());if(!books.has(book))books.set(book,row)});
    const reading=[...books.values()].map(row=>{const d=row.details||{},total=Number(d.totalPages),current=Number(d.currentPage);return `${text(row)}${d.author?` · ${d.author}`:''}${total>0?` · ${current||0} / ${total}쪽 · ${Math.min(100,Math.max(0,Math.round((current||0)/total*100)))}%`:''}`});
    const quotes=[...books.values()].filter(row=>str(row.details?.quote)).map(row=>`${str(row.details.quote)}${row.details.quotePage?` · p.${row.details.quotePage}`:''}`);
    const languageStudy=personal.languageStudy||{},languageRows=[],progressValues=Object.values(languageStudy.v2Progress?.progress||{});
    for(const storageKey of Object.keys(localStorage))if(storageKey.startsWith(`languageProgress:${uid}:`)){const record=read(storageKey);if(record&&record.completedAt)progressValues.push(record);}
    for(const [lang,label] of [['en','English'],['ja','Japanese']]){
      const per=languageStudy[lang]||{},records=progressValues.filter(row=>row.language===lang&&row.completedAt);
      const days=[...array(per.completedDates),...records.flatMap(row=>[row.completedAt,...array(row.reviewHistory)])].map(activityDate).filter(Boolean);
      const unique=new Set(days),cursor=new Date();if(!unique.has(key(cursor)))cursor.setDate(cursor.getDate()-1);
      let streak=0;while(unique.has(key(cursor))){streak++;cursor.setDate(cursor.getDate()-1)}
      languageRows.push(`${label} · ${streak}일 연속 · 최근 7일 ${[...unique].filter(day=>Date.parse(day)>=Date.now()-7*86400000).length}회`);
    }
    const youtube=array((personal.languageShortsV118||personal.languageShorts)?.notes).map(row=>`${str(row.phrase||row.text)}${row.meaning?` · ${str(row.meaning)}`:''}`).filter(Boolean);
    const bullet=days=>{
      const result=[];for(let offset=0;offset<days;offset++){const day=new Date();day.setDate(day.getDate()+offset);const d=key(day);
        result.push(...scheduleItems.filter(row=>row.date<=d&&(row.endDate||row.date)>=d).map(row=>`${d.slice(5)} · ${row.time} ${row.title}`));
        result.push(...items.filter(row=>date(row.date)===d&&row.category!=='emotion').map(row=>`${d.slice(5)} · ${text(row)}`));
      }return [...result,...memos,...todos];
    };
    return {version:165,uid,v165:window.AiderWidgetModelsV165?.build({app,personal,uid,now,photo:row=>photoCache.get(`${uid}:${row.id}:${row.media?.fileId||row.updatedAt||row.createdAt||''}`)||''})||{},email,theme:themeMap[document.documentElement.dataset.theme]||'aurora',today:new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',weekday:'short'}).format(now),month:new Intl.DateTimeFormat('ko-KR',{year:'numeric',month:'long'}).format(now),scheduleItems,holidays,schedule:scheduleItems.map(row=>`${row.date} ${row.time} ${row.title}`),routines,routineStats:routines,languageRows,language:languageRows.join('\n'),youtubeNotes:youtube,memos,todos,memoTodos:[...memos,...todos],readingBooks:reading,readingCurrent:[...reading,...quotes],quote:quotes[0]||'',workouts,workoutStats,workoutStatsInbody:[...workoutStats,...inbody],challengeSelected:challenges,challengeAll:challenges,challengeCombined:challenges,workoutChallenges:[...workouts,...challenges],mealWorkouts:workouts,mealPhotos,mealTimes,mealRatings,meals:[],workflows,bullet3:bullet(3),bullet7:bullet(7),bullet3Workflow:[...bullet(3),...workflows],bullet7Workflow:[...bullet(7),...workflows]};
  }
  let timer=0,last='';
  const commandQueueKey=uid=>`aiderlog.widget-actions.v165:${encodeURIComponent(uid)}`;
  let executing=false;
  function enqueue(command){const name=commandQueueKey(command.uid),rows=array(read(name)),remaining=rows.filter(row=>row.key!==command.key&&!(row.id===command.id&&row.op===command.op));remaining.push(command);localStorage.setItem(name,JSON.stringify(remaining));}
  function notify(message){if(typeof window.toast==='function')window.toast(message);else if(typeof window.AiderLogAppShell?.toast==='function')window.AiderLogAppShell.toast(message);}
  async function flushCommands(){
    if(executing||!checkOwner()||!verified||typeof window.AiderDearFirebase?.applyWidgetActionV165!=='function')return;
    executing=true;const uid=ownerState.user.uid,expectedEpoch=epoch,expectedOwner=owner,name=commandQueueKey(uid);
    try{for(const command of array(read(name))){if(!stillCurrent(expectedEpoch,expectedOwner))break;try{
      const localRows=typeof P!=='undefined'?array(P[command.op==='routine'?'routines':'checklists']):[],localRow=localRows.find(row=>str(row.id)===str(command.id)),localBefore=JSON.stringify(localRow||null);
      const result=await window.AiderDearFirebase.applyWidgetActionV165(command);if(!stillCurrent(expectedEpoch,expectedOwner))break;
      localStorage.setItem(name,JSON.stringify(array(read(name)).filter(row=>row.key!==command.key)));
      if(object(result?.payload)){source.personal=copy(result.payload);try{localStorage.setItem(cacheKey(owner),JSON.stringify({owner,...source}))}catch{}}
      sync();requestRefresh(50);window.dispatchEvent(new CustomEvent('aiderlog:widget-private-changed',{detail:{uid,payload:result?.payload,command,localBefore}}));
    }catch(error){if(!stillCurrent(expectedEpoch,expectedOwner))break;const code=String(error?.code||error?.message||''),terminal=['stale-action','invalid-action','not-found','replay-mismatch','invalid-data','permission-denied','unauthenticated'].some(value=>code.includes(value));if(terminal){localStorage.setItem(name,JSON.stringify(array(read(name)).filter(row=>row.key!==command.key)));const draftsKey=`${name}:failed`;localStorage.setItem(draftsKey,JSON.stringify([...array(read(draftsKey)),{command,error:code,at:Date.now()}]));notify(code.includes('stale-action')?'기록이 변경되어 다시 불러왔습니다. 위젯에서 다시 선택해주세요.':'저장할 수 없는 작업입니다. 입력 내용은 기기에 보관했습니다. 앱에서 확인해주세요.');requestRefresh(0);continue;}notify('기기에 저장했습니다. 연결되면 동기화합니다.');break;}}}finally{executing=false;}
  }
  function quickAdd(command){
    const dialog=document.createElement('dialog');dialog.style.cssText='width:min(92vw,480px);max-height:60dvh;padding:20px;border:1px solid var(--line,#ded9ff);border-radius:20px;background:var(--card,#f7f6ff);color:var(--ink,#171a3a)';
    const form=document.createElement('form'),label=document.createElement('label'),input=document.createElement('textarea'),dateInput=document.createElement('input'),buttons=document.createElement('div'),save=document.createElement('button'),cancel=document.createElement('button');
    label.textContent=command.op==='add-todo'?'할 일 (180자 이내)':'메모 (180자 이내)';input.rows=3;input.required=true;input.maxLength=180;input.setAttribute('aria-label',label.textContent);input.style.cssText='display:block;width:100%;box-sizing:border-box;margin:10px 0;padding:12px;font:inherit';dateInput.type='date';dateInput.setAttribute('aria-label','기한 (선택)');dateInput.style.cssText='width:100%;padding:10px;box-sizing:border-box;font:inherit';dateInput.hidden=command.op!=='add-todo';
    buttons.style.cssText='display:flex;justify-content:flex-end;gap:12px;margin-top:14px';save.type='submit';save.textContent='저장';cancel.type='button';cancel.textContent='취소';for(const b of [save,cancel])b.style.cssText='min-width:68px;min-height:44px;font:inherit';buttons.append(cancel,save);form.append(label,input,dateInput,buttons);dialog.append(form);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove());cancel.onclick=()=>dialog.close();form.onsubmit=e=>{e.preventDefault();if(!str(input.value))return;const uid=auth()?.user?.uid;if(uid!==command.uid){dialog.close();return;}const id='widget-'+crypto.randomUUID();enqueue({...command,id,key:id,value:str(input.value),date:dateInput.value||''});dialog.close();flushCommands();};dialog.showModal();
  }
  function openLanguage(lang){const open=window.AiderLogAppShell?.openTarget;open?.call(window.AiderLogAppShell,'language','');setTimeout(()=>{let select=document.querySelector('#language-select');if(!select)for(const el of document.querySelectorAll('*'))if(el.shadowRoot){select=el.shadowRoot.querySelector('#language-select');if(select)break;}if(select&&['en','ja'].includes(lang)){select.value=lang;select.dispatchEvent(new Event('change',{bubbles:true}));}},500);}
  async function commandAction(raw){
    let command;try{command=JSON.parse(decodeURIComponent(String(raw).slice(12)));}catch{return;}
    if(!object(command)||str(command.uid)!==str(auth()?.user?.uid)||!checkOwner())return;
    if(['add-memo','add-todo'].includes(command.op)){quickAdd(command);return;}
    if(command.op==='language'){openLanguage(command.value);return;}
    if(['todo','routine'].includes(command.op)){if(!str(command.id)||!str(command.key)||command.key.length>1000)return;enqueue(command);if(!verified)await refresh();flushCommands();return;}
    if(command.op==='youtube'){window.AiderLogAppShell?.openTarget?.('language','open-youtube');return;}
    if(command.op==='open'){const target=command.value==='routine'?'routine':command.value==='language'?'language':'personal';window.AiderLogAppShell?.openTarget?.(target,'');if(['note','todo'].includes(command.value))document.querySelector('#quickMemoBtn')?.click();}
  }
  function sync(){clearTimeout(timer);timer=setTimeout(()=>{try{const payload=JSON.stringify(snapshot());if(payload!==last&&payload.length<=4194304){native.syncWidgets(payload);last=payload}else if(payload.length>4194304){sendBlank();console.warn('[widgets-v164] Snapshot exceeds native transfer limit.');}}catch{sendBlank();console.warn('[widgets-v164] Snapshot sync failed.');}},250)}
  function hook(){
    const shell=window.AiderLogAppShell;if(!shell||shell.widgetV164)return;
    shell.widgetV164=true;shell.syncWidgets=sync;const open=shell.openTarget;
    shell.openTarget=function(target,action){
      if(String(action||'').startsWith('widget-v165:')){commandAction(action);return;}
      if(String(action||'').startsWith('add-schedule:')){
        if(typeof go==='function')go('home',false);else location.hash='home';
        const requested=String(action).slice(13);
        setTimeout(()=>{if(/^\d{4}-\d{2}-\d{2}$/.test(requested))window.AiderLogCalendarV125?.openSchedule?.(requested)},300);
        return;
      }
      if(action==='add-memo'||action==='add-todo'){document.querySelector('#quickMemoBtn')?.click();return;}
      if(action==='open-youtube'){open?.call(this,'language','');setTimeout(()=>document.querySelector('[data-language-mode-v118="shorts"]')?.click(),300);return;}
      return open?.call(this,target,action);
    };
  }
  window.AiderWidgetSyncV164={snapshot,sync,refresh,prepareMealPhotos,commandAction,flushCommands};
  addEventListener('online',()=>{requestRefresh(0);flushCommands()});
  document.addEventListener('click',sync,{passive:true});document.addEventListener('change',sync,{passive:true});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){checkOwner();sync();requestRefresh();prepareMealPhotos()}});
  addEventListener('aiderlog:data-changed',()=>{sync();requestRefresh()});addEventListener('aiderdear-firebase-ready',()=>{bindAuth();sync()});addEventListener('pageshow',()=>{bindAuth();sync();requestRefresh()});
  new MutationObserver(()=>{hook();sync()}).observe(document.body,{childList:true,subtree:true,characterData:true});
  sendBlank();bindAuth();hook();sync();setTimeout(()=>{bindAuth();hook();sync();prepareMealPhotos()},1000);document.addEventListener('change',()=>{requestRefresh(700)}, {passive:true});
})();
