(() => {
  'use strict';
  const api=()=>window.AiderDearFirebase,$=id=>document.getElementById(id);
  let identity='',generation=0,received=[],lastKey='',pending=null,retryAt=0,box,statusNode,error='',quota=false,selectionReady=false,formVersion=0,ownTargets={};
  const state=()=>api()?.getState?.()||{},friends=()=>state().friends||[];
  const email=value=>String(value||'').trim().toLowerCase();
  function own(event){const user=state().user;return !!user?.uid&&!!event&&event.isAiderDear===true&&!event.readOnly&&!event.externalSource&&!event.projectionSource&&!event.friendShared&&!event.isHoliday&&!event.isBirthday&&(!event.authorUid||event.authorUid===user.uid)&&email(event.authorEmail)===email(user.email)&&(!event.calendarScope||event.calendarScope==='personal')&&!['work','consult','consulting','estate','business'].includes(event.category);}
  function showStatus(){if(statusNode){statusNode.textContent=error;statusNode.hidden=!error;}}
  function actor(){const s=state(),next=s.user?.uid?s.user.uid+'|'+email(s.user.email)+'|'+friends().map(f=>f.friendshipId+':'+f.uid).sort().join('|'):'';if(next!==identity){identity=next;generation++;received=[];ownTargets={};lastKey='';pending=null;retryAt=0;error='';quota=false;selectionReady=false;formVersion++;if(box)box.hidden=true;showStatus();}return identity;}
  function failure(e){quota=String(e?.code||'').endsWith('resource-exhausted');retryAt=Date.now()+(quota?Math.max(300000,Number(e?.retryAfterMs)||0):60000);error=quota?'친구 일정 저장소의 요청 한도에 도달했습니다. 기존 표시는 유지됩니다. 잠시 후 다시 시도해주세요.':'친구 일정 조회를 완료하지 못했습니다. 기존 표시는 유지됩니다. 잠시 후 다시 시도해주세요.';showStatus();}
  function checkQuota(){if(quota&&Date.now()<retryAt){const e=new Error(error);e.code='resource-exhausted';e.retryAfterMs=retryAt-Date.now();e.cooldownActive=true;throw e;}}
  function range(){const dates=[...document.querySelectorAll('#calendar .day[data-date]')].map(el=>el.dataset.date).sort();return dates.length?{from:dates[0],to:dates.at(-1)}:null;}
  function install(){if(!box?.isConnected){const owner=$('eventOwnerField');if(owner){box=document.createElement('fieldset');box.id='eventFriendShareV175';box.className='field full';box.hidden=true;owner.after(box);}}
    if(!statusNode?.isConnected){const header=document.querySelector('#page0 .month-list-head');if(header){statusNode=document.createElement('small');statusNode.id='friendScheduleStatusV175';statusNode.setAttribute('role','status');statusNode.setAttribute('aria-live','polite');header.appendChild(statusNode);showStatus();}}
  }
  async function refresh(force=false){const key=actor(),r=range();install();if(!key||!r||!friends().length||Date.now()<retryAt)return;if(pending)return pending;const signature=key+JSON.stringify(r);if(!force&&lastKey===signature)return;const version=generation;
    const work=Promise.resolve().then(async()=>{try{const result=await api().readFriendSchedule(r);if(actor()!==key||generation!==version)return;if(!Array.isArray(result?.events))throw Error('친구 일정 응답을 확인할 수 없습니다.');received=result.events.slice();ownTargets=result.ownTargetsByEventId||{};lastKey=signature;retryAt=0;error='';quota=false;showStatus();window.dispatchEvent(new Event('aiderlog-friend-schedule-data'));}catch(e){if(actor()===key){failure(e);console.warn('친구 일정 조회 보류',e?.code||'unavailable');}}finally{if(version===generation)pending=null;}});pending=work;return work;
  }
  async function open(event=null){install();const key=actor(),version=++formVersion;if(!box)return;box.replaceChildren();box.hidden=!key||!friends().length||!!event&&!own(event);selectionReady=box.hidden;
    if(box.hidden)return;const legend=document.createElement('legend');legend.textContent='친구와 공유';box.appendChild(legend);const hint=document.createElement('small');hint.textContent='선택한 친구에게 일정 이름·날짜·시간만 표시됩니다.';box.appendChild(hint);
    for(const friend of friends()){const label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.value=friend.friendshipId;input.disabled=true;label.append(input,document.createTextNode(friend.name||friend.email||'친구'));box.appendChild(label);}
    const status=document.createElement('small');status.setAttribute('role','status');box.appendChild(status);
    try{checkQuota();const selected=event?await api().friendScheduleTargets(event.id):[];if(key!==actor()||version!==formVersion)return;if(!Array.isArray(selected))throw Error('공유 대상을 확인할 수 없습니다.');box.querySelectorAll('input').forEach(el=>{el.checked=selected.includes(el.value);el.disabled=false;});selectionReady=true;status.textContent='';}
    catch(e){if(key===actor()&&version===formVersion){selectionReady=false;if(String(e?.code||'').endsWith('resource-exhausted')&&!e.cooldownActive)failure(e);status.textContent='기존 공유 대상을 불러오지 못했습니다. 창을 다시 열어주세요. 기존 공유는 변경하지 않습니다.';}}
  }
  function selected(){return box&&!box.hidden?[...box.querySelectorAll('input:checked')].map(el=>el.value):[];}
  async function share(event){const key=actor();if(!key||!friends().length)return;checkQuota();if(!own(event))throw Error('내가 직접 등록한 개인 일정만 친구에게 공유할 수 있습니다.');if(!selectionReady)throw Error('개인 일정은 저장됐지만 친구 공유 대상을 확인하지 못했습니다. 창을 다시 열어주세요.');if(!box||box.hidden)return;try{await api().setFriendScheduleTargets(event,selected());}catch(e){if(actor()===key&&String(e?.code||'').endsWith('resource-exhausted'))failure(e);throw e;}if(actor()!==key)return;lastKey='';await refresh(true);}
  async function remove(id){const key=actor();checkQuota();try{if(key&&friends().length)await api().removeFriendSchedule(id);}catch(e){if(actor()===key&&String(e?.code||'').endsWith('resource-exhausted'))failure(e);throw e;}if(actor()!==key)return;lastKey='';await refresh(true);}
  $('eventGoogleCalendar')?.addEventListener('change',()=>{if(!box||box.hidden)return;const external=!!$('eventGoogleCalendar').value;box.querySelectorAll('input').forEach(el=>el.disabled=external||!selectionReady);if(external)box.querySelectorAll('input').forEach(el=>el.checked=false);});
  window.AiderFriendScheduleUIV175=Object.freeze({open,share,remove,refresh,events:()=>{actor();return received.slice();},selected,selectionReady:()=>selectionReady});
  ['aiderdear-firebase-state','aiderdear-firebase-ready'].forEach(name=>addEventListener(name,()=>{actor();refresh();}));
  install();refresh();
})();
