import {createEstateClient} from './estate-client-v171.js';
// Owner-only read projections. Nothing is written to personal / pair calendar payloads.
{
  let uid='',data=[],pending=null,last=0,error='',revision=0,refreshQueued=false,retryAt=0;
  const emit=()=>window.dispatchEvent(new CustomEvent('aiderlog-estate-calendar'));
  const api=createEstateClient(next=>{uid=next;data=[];last=0;error='';pending=null;refreshQueued=false;retryAt=0;revision++;emit();});
  const native=()=>!!window.AiderLogNative||document.documentElement.classList.contains('aiderlog-android')||new URLSearchParams(location.search).has('android-preview');
  const visible=()=>document.visibilityState==='visible'&&(native()?!!document.querySelector('#home.view.on'):['estate','schedule'].includes(document.getElementById('app')?.dataset.activeTab));
  const rows=()=>{api.identity();return uid?data.slice():[];};
  async function refresh(force=false){
    api.identity();if(force)last=0;if(!uid)return rows();
    // A failed projection redraws the calendar, which can trigger another
    // refresh through its class observer. Keep that cycle off the network,
    // including forced invalidations, and preserve the last good snapshot.
    if(Date.now()<retryAt)return rows();
    // An invalidation belongs after the current snapshot, not to that snapshot.
    // Record it even when the tab becomes hidden while a request is in flight.
    if(pending){if(force)refreshQueued=true;return pending;}
    if(!visible())return rows();
    if(!force&&last&&Date.now()-last<60000)return rows();
    const epoch=revision,actor=uid;refreshQueued=false;
    const work=(async()=>{
      try{
        const next=[],seen=new Set();let cursor=null;
        do{
          if(!visible()||actor!==api.identity()||epoch!==revision||refreshQueued)return rows();
          const page=await api.call('calendar',{cursor});
          if(!Array.isArray(page.rows))throw Error('부동산 일정 응답을 확인할 수 없습니다.');
          next.push(...page.rows);cursor=page.cursor||null;
          if(cursor&&seen.has(cursor))throw Error('일정 페이지가 반복되어 중단했습니다.');
          if(cursor)seen.add(cursor);
        }while(cursor);
        if(actor!==api.identity()||epoch!==revision||refreshQueued)return rows();
        data=[...new Map(next.map(r=>[r.id,{...r,projectionSource:'estate',calendarScope:'estate',sourceTitle:'부동산 업무',sourceColor:'#14645f',owner:'mine',authorUid:actor,authorEmail:window.AiderDearFirebase?.getState?.().user?.email||'',allDay:!r.time,readOnly:true,isAiderDear:false,shareWithCouple:false,memo:'ESTATE에서 확인·수정하는 비공개 업무 일정입니다.'}])).values()];
        last=Date.now();retryAt=0;error='';emit();
      }catch(e){if(actor===uid&&epoch===revision){
        const nextError=String(e?.message||'부동산 일정을 불러오지 못했습니다.');
        retryAt=Date.now()+(Number(e?.status)===429||/resource[-_]exhausted|quota|429|한도/i.test(`${e?.code||''} ${nextError}`)?300000:60000);
        const changed=error!==nextError;error=nextError;if(changed)emit();
      }}
      finally{
        if(actor===uid&&epoch===revision){
          pending=null;
          if(refreshQueued){
            refreshQueued=false;
            // Coalesce concurrent saves. A hidden view retains last=0 and reloads
            // on its next visibility/tab event instead of making a hidden scan.
            Promise.resolve().then(()=>{if(actor===uid&&epoch===revision&&!pending)refresh(true);});
          }
        }
      }
      return rows();
    })();
    pending=work;return work;
  }
  window.AiderEstateCalendarV171=Object.freeze({rows,refresh,status:()=>({error,last,retryAt})});
  const start=()=>{api.identity();refresh();};
  ['aiderdear-firebase-ready','aiderdear-firebase-state','online'].forEach(name=>window.addEventListener(name,start));
  window.addEventListener('aiderlog-estate-updated',()=>{last=0;refresh(true);});
  document.addEventListener('visibilitychange',start);
  const app=document.getElementById('app');if(app)new MutationObserver(start).observe(app,{attributes:true,attributeFilter:['data-active-tab']});start();
  const home=document.getElementById('home');if(home)new MutationObserver(start).observe(home,{attributes:true,attributeFilter:['class']});window.addEventListener('hashchange',start);
}
