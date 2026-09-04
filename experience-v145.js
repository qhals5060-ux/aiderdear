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
  const localPayload=()=>{try{return JSON.parse(localStorage.getItem('aiderlog-emotion-v119')||'null')}catch{return null}};
  const rowDate=row=>String(row?.date||'').slice(0,10);
  const latestByDate=payload=>{
    const map=new Map();entries(payload).forEach(row=>{const key=rowDate(row),old=map.get(key);if(key&&(!old||Number(row.updatedAt||row.createdAt||0)>=Number(old.updatedAt||old.createdAt||0)))map.set(key,row)});return map;
  };
  const hasPeriod=(payload,key)=>entries(payload).some(row=>rowDate(row)===key&&Boolean(row.period));

  function updatePeriodControl(){
    const s=state(),label=$('.emotion-period-v126');if(!label)return;
    const female=isFemale(s.user);label.hidden=!female;
    const input=$('input[name="period"]',label);if(input){input.disabled=!female;if(!female)input.checked=false}
  }

  function decorateCalendar(){
    if(decorating)return;decorating=true;
    try{
      const s=state(),pairMode=Boolean(s.pair&&s.partner?.uid),moodSource=pairMode?partnerPayload:(ownPayload||localPayload()),moodRows=latestByDate(moodSource);
      $$('[data-schedule-date-v125]').forEach(day=>{
        const key=day.dataset.scheduleDateV125;$('.schedule-emotion-v145',day)?.remove();$('.schedule-period-v145',day)?.remove();
        const row=moodRows.get(key),mood=String(row?.mood||(Array.isArray(row?.moods)?row.moods[0]:'')||'');
        if(mood){const marker=document.createElement('span');marker.className='schedule-emotion-v145';marker.title=`${pairMode?'상대의':'나의'} 감정 · ${mood}`;marker.setAttribute('aria-label',marker.title);const file=MOOD_FILE[mood]||'calm';marker.innerHTML=`<img src="./mascots-v118/${file}.png" alt="">`;day.append(marker)}
        const ownPeriod=isFemale(s.user)&&hasPeriod(ownPayload||localPayload(),key),partnerPeriod=pairMode&&isFemale(s.partner)&&hasPeriod(partnerPayload,key);
        if(ownPeriod||partnerPeriod){const marker=document.createElement('span');marker.className='schedule-period-v145';marker.title=partnerPeriod&&!ownPeriod?'상대의 생리 기록':'생리 기록';marker.setAttribute('aria-label',marker.title);day.append(marker)}
      });
      updatePeriodControl();
    } finally {decorating=false}
  }

  async function loadEmotionScope(next=state()){
    const api=window.AiderDearFirebase;if(!next?.user?.uid||!api?.readEmotionData){ownPayload=localPayload();partnerPayload=null;decorateCalendar();return}
    const scope=`${next.user.uid}|${next.pair?.id||''}|${next.partner?.uid||''}`;lastScope=scope;
    const [own,partner]=await Promise.all([
      api.readEmotionData(next.user.uid).catch(()=>localPayload()),
      next.pair&&next.partner?.uid?api.readEmotionData(next.partner.uid).catch(()=>null):Promise.resolve(null)
    ]);
    if(scope!==lastScope)return;ownPayload=own||localPayload();partnerPayload=partner;decorateCalendar();
  }

  function scheduleRefresh(){clearTimeout(syncTimer);syncTimer=setTimeout(decorateCalendar,40)}
  function install(){
    updatePeriodControl();loadEmotionScope().catch(()=>{});scheduleRefresh();
    const api=window.AiderDearFirebase;if(api?.subscribe&&!document.documentElement.dataset.emotionCalendarV145){document.documentElement.dataset.emotionCalendarV145='1';api.subscribe(next=>{updatePeriodControl();loadEmotionScope(next).catch(()=>{})})}
  }

  document.addEventListener('submit',event=>{
    if(!event.target.matches?.('[data-emotion-form-v119]'))return;
    setTimeout(()=>{ownPayload=localPayload();decorateCalendar()},120);
    setTimeout(()=>loadEmotionScope().catch(()=>{}),1200);
  },true);
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-schedule-emotion-v119],[data-schedule-emotion-v125]'))setTimeout(updatePeriodControl,0);
  },true);
  window.addEventListener('aiderdear-firebase-ready',install);
  new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.('[data-schedule-date-v125],.emotion-dialog-v119')||n.querySelector?.('[data-schedule-date-v125],.emotion-dialog-v119')))))scheduleRefresh()}).observe(document.documentElement,{childList:true,subtree:true});
  window.AiderLogV145={decorateCalendar,reloadEmotions:loadEmotionScope};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
