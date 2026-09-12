/* AiderLog v145 · calendar identity signals and private-suite integration */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
  const MOOD_FILE={
    '기쁨':'joy','행복':'happiness','설렘':'excitement','편안함':'calm','평온':'calm','감사':'gratitude',
    '피곤함':'tired','불안':'anxiety','짜증':'irritation','외로움':'loneliness','슬픔':'sadness','화남':'anger'
  };
  let ownPayload=null,partnerPayload=null,lastScope='',syncTimer=0,decorating=false;

  const state=()=>window.AiderDearFirebase?.getState?.()||window.authState||{};
  const isFemale=person=>['female','woman','f','여성'].includes(String(person?.gender||person?.sex||'').trim().toLowerCase());
  const entries=payload=>Array.isArray(payload?.entries)?payload.entries:Object.values(payload?.entries||{});
  const rowDate=row=>String(row?.date||'').slice(0,10);
  const latestByDate=payload=>{const map=new Map();entries(payload).forEach(row=>{const key=rowDate(row),old=map.get(key);if(key&&(!old||Number(row.updatedAt||row.createdAt||0)>=Number(old.updatedAt||old.createdAt||0)))map.set(key,row)});return map;};
  function updatePeriodControl(){const label=$('.emotion-period-v126');if(!label)return;label.hidden=true;const input=$('input[name="period"]',label);if(input)input.disabled=true;}
  function decorateCalendar(){
    if(decorating)return;decorating=true;
    try{const s=state(),sources=s.user?.uid?[{payload:ownPayload,own:true,name:s.user.name||'나'},...(s.pair&&s.partner?.uid?[{payload:partnerPayload,own:false,name:s.partner.name||'상대'}]:[])]:[];
      $$('[data-schedule-date-v125]').forEach(day=>{day.querySelectorAll('.schedule-emotion-v145,.schedule-period-v145').forEach(node=>node.remove());const key=day.dataset.scheduleDateV125,line=$('.calendar-status-icons',day);if(!line)return;
        for(const source of sources){const row=latestByDate(source.payload).get(key),mood=String(row?.mood||(Array.isArray(row?.moods)?row.moods[0]:'')||'');if(!mood)continue;const marker=document.createElement('span');marker.className='schedule-emotion-v145 '+(source.own?'is-own':'is-partner');marker.title=source.name+' 감정 · '+mood;marker.setAttribute('aria-label',marker.title);const image=document.createElement('img');image.src='./mascots-v118/'+(MOOD_FILE[mood]||'calm')+'.png';image.alt='';marker.append(image);line.append(marker);}
      });updatePeriodControl();window.AiderPrivateCalendarUIV175?.decorateCalendar();
    }finally{decorating=false;}
  }
  async function loadEmotionScope(next=state()){
    const api=window.AiderDearFirebase,scope=next?.user?.uid?next.user.uid+'|'+(next.pair?.id||'')+'|'+(next.partner?.uid||''):'';
    if(scope!==lastScope){lastScope=scope;ownPayload=null;partnerPayload=null;decorateCalendar();}
    if(!scope||!api?.readEmotionData)return;
    const [own,partner]=await Promise.all([api.readEmotionData(next.user.uid).catch(()=>ownPayload),next.pair&&next.partner?.uid?api.readEmotionData(next.partner.uid).catch(()=>partnerPayload):Promise.resolve(null)]);
    const current=state(),currentScope=current?.user?.uid?current.user.uid+'|'+(current.pair?.id||'')+'|'+(current.partner?.uid||''):'';
    if(scope!==lastScope||scope!==currentScope)return;ownPayload=own;partnerPayload=partner;decorateCalendar();
  }

  function scheduleRefresh(){clearTimeout(syncTimer);syncTimer=setTimeout(decorateCalendar,40)}
  function install(){
    updatePeriodControl();loadEmotionScope().catch(()=>{});scheduleRefresh();
    const api=window.AiderDearFirebase;if(api?.subscribe&&!document.documentElement.dataset.emotionCalendarV145){document.documentElement.dataset.emotionCalendarV145='1';api.subscribe(next=>{updatePeriodControl();loadEmotionScope(next).catch(()=>{})})}
  }

  document.addEventListener('submit',event=>{
    if(!event.target.matches?.('[data-emotion-form-v119]'))return;
    setTimeout(()=>loadEmotionScope().catch(()=>{}),120);
    setTimeout(()=>loadEmotionScope().catch(()=>{}),1200);
  },true);
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-schedule-emotion-v119],[data-schedule-emotion-v125]'))setTimeout(updatePeriodControl,0);
  },true);
  window.addEventListener('aiderdear-firebase-ready',install);
  window.addEventListener('resize',scheduleRefresh);
  window.addEventListener('aiderlog-page-changed',scheduleRefresh);
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-schedule-date-v125],.emotion-dialog-v119')||n.querySelector?.('[data-schedule-date-v125],.emotion-dialog-v119')))))scheduleRefresh()}).observe(document.documentElement,{childList:true,subtree:true});
  window.AiderLogV145={decorateCalendar,reloadEmotions:loadEmotionScope};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
