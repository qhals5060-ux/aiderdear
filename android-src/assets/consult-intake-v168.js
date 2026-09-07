(() => {
  'use strict';
  const api=()=>window.AiderDearFirebase,user=()=>api()?.getState?.().user||{},allowed=()=>['qhals5060@gmail.com','aidway55@gmail.com'].includes(String(user().email||'').toLowerCase());
  let busy=false,lastUid='',last=0,timer;
  async function sync(force=false){
    const uid=user().uid;if(!uid||!allowed()||busy||document.hidden||navigator.onLine===false||(!force&&uid===lastUid&&Date.now()-last<600000))return;
    busy=true;let count=0;
    try{let cursor=null;do{const token=await api().getFirebaseIdToken();if(user().uid!==uid)return;const r=await fetch('/api/consult',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({action:'syncIntakes',cursor}),signal:AbortSignal.timeout(25000)}),value=await r.json();if(!r.ok)throw Error(value.error||'고객 제출을 불러오지 못했습니다.');if(user().uid!==uid)return;count+=value.imported;cursor=value.cursor||null;}while(cursor&&!document.hidden);if(!cursor){lastUid=uid;last=Date.now()}if(count)window.dispatchEvent(new CustomEvent('aiderlog-intakes-imported-v168',{detail:{uid,count}}));
    }finally{busy=false}
  }
  async function createAndCopy(expectedUid=user().uid){
    if(!allowed()||!expectedUid||user().uid!==expectedUid)throw Error('Consult 계정으로 로그인해주세요.');
    const token=await api().createClientIntakeLink();if(user().uid!==expectedUid)throw Error('계정이 변경되었습니다.');
    const url=new URL('/client-intake.html','https://aiderdear1.vercel.app');url.searchParams.set('client-intake',token);
    const value=url.href;if(window.AiderLogNative?.copyText)window.AiderLogNative.copyText('고객정보 입력 링크',value);else await navigator.clipboard.writeText(value);
    return value;
  }
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>sync().catch(error=>console.warn('고객 제출 동기화 보류',error)),4000)};
  addEventListener('aiderdear-firebase-state',schedule);addEventListener('online',schedule);document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
  window.AiderConsultIntakeV168=Object.freeze({createAndCopy,sync});schedule();
  setInterval(()=>sync().catch(error=>console.warn('고객 제출 동기화 보류',error)),600000);
})();
