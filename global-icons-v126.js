(function(){
  'use strict';

  const ICONS={
    profile:'<circle cx="12" cy="7.5" r="3.4"/><path d="M5.4 20c.4-3.9 2.6-6 6.6-6s6.2 2.1 6.6 6"/><path class="cosmic-detail-v126" d="m18.5 3.5.45 1.1 1.1.45-1.1.45-.45 1.1-.45-1.1-1.1-.45 1.1-.45.45-1.1Z"/>',
    memo:'<path d="M6 3.5h11A1.5 1.5 0 0 1 18.5 5v14A1.5 1.5 0 0 1 17 20.5H6A1.5 1.5 0 0 1 4.5 19V5A1.5 1.5 0 0 1 6 3.5Z"/><path d="M8 8h7M8 12h7M8 16h4.8"/><circle class="cosmic-detail-v126" cx="18.8" cy="7.2" r=".75"/>',
    mail:'<rect x="3.5" y="5" width="17" height="14" rx="2.2"/><path d="m4.5 7 7.5 5.6L19.5 7"/><path class="cosmic-detail-v126" d="m19 2.9.35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    search:'<circle cx="10.8" cy="10.8" r="6.1"/><path d="m15.3 15.3 4.5 4.5"/><path class="cosmic-detail-v126" d="M7 6.7a6.1 6.1 0 0 1 5.8-1.2"/>',
    insights:'<path d="M5 19v-6M10 19V9M15 19V5M3.5 19.5h16"/><path class="cosmic-detail-v126" d="m19 3.4.45 1.15 1.15.45-1.15.45L19 6.2l-.45-1.15-1.15-.45 1.15-.45L19 3Z"/>',
    calendar:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M7 3v4M17 3v4M3.5 9h17"/><ellipse class="cosmic-detail-v126" cx="12" cy="14.5" rx="2" ry="1.2"/><circle class="cosmic-detail-v126" cx="13.8" cy="14.2" r=".55"/>',
    event:'<path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v3a2.5 2.5 0 0 0 0 5v3a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 17v-3a2.5 2.5 0 0 0 0-5V6A1.5 1.5 0 0 1 5 4.5Z"/><path d="M9 4.5v14"/><path class="cosmic-detail-v126" d="m14 9 .45 1.1 1.1.45-1.1.45-.45 1.1-.45-1.1-1.1-.45 1.1-.45L14 9Z"/>',
    routine:'<path d="M9 6h10M9 12h10M9 18h10"/><path d="m4 6 1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/><path class="cosmic-detail-v126" d="M17 15.6a3 3 0 0 1 2 .9"/>',
    record:'<path d="M5 18.5V21h2.5l10.9-10.9-2.5-2.5L5 18.5Z"/><path d="m14.7 8.8 2.5 2.5"/><path class="cosmic-detail-v126" d="m18.5 3 .4 1 .95.4-.95.4-.4 1-.4-1-.95-.4.95-.4.4-1Z"/>',
    archive:'<path d="M4 7.5h16v11A2.5 2.5 0 0 1 17.5 21h-11A2.5 2.5 0 0 1 4 18.5v-11ZM3.5 4h17v3.5h-17M9 12h6"/><circle class="cosmic-detail-v126" cx="18" cy="11" r=".65"/>',
    travel:'<path d="m3.5 13.2 7.7-1.9 4.7-7.1c.6-.9 1.9-1 2.6-.2.5.5.6 1.2.2 1.9l-4.2 6.5 4.4 2.3 1.8-1.5 1 .5-1.2 3.1-3.3.7-.7-.9 1-1.5-4.8-1.1-3.2 4.9-1.6-.4 1.4-5.1-5.5.9-.3-1.1Z"/><path class="cosmic-detail-v126" d="M4 9.5c2.4-1.6 4.7-2.3 7-2.2"/>',
    language:'<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.2 3.3 8.5S14.2 18.1 12 20.5M12 3.5C9.8 5.9 8.7 8.7 8.7 12s1.1 6.1 3.3 8.5"/><circle class="cosmic-detail-v126" cx="19.7" cy="7" r=".75"/>',
    my:'<circle cx="12" cy="9" r="3.4"/><path d="M5.6 20c.5-3.6 2.7-5.6 6.4-5.6s5.9 2 6.4 5.6"/><path class="cosmic-detail-v126" d="m18.7 3.3.45 1.15 1.15.45-1.15.45-.45 1.15-.45-1.15-1.15-.45 1.15-.45.45-1.15Z"/>',
    album:'<rect x="3.5" y="5" width="17" height="14" rx="2.5"/><circle cx="9" cy="10" r="1.5"/><path d="m5.5 17 4.2-4 3.1 2.7 2.2-2 3.5 3.3"/><path class="cosmic-detail-v126" d="m18.2 3 .35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    statistics:'<path d="M12 3.5V12h8.5A8.5 8.5 0 1 1 12 3.5Z"/><path d="M15 3.9A8.5 8.5 0 0 1 20.1 9H15V3.9Z"/><circle class="cosmic-detail-v126" cx="18.8" cy="14.7" r=".65"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.2 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.4 1a8.2 8.2 0 0 0-2.6-1.5L14 2.5h-4l-.3 2.6a8.2 8.2 0 0 0-2.6 1.5l-2.4-1-2 3.4 2.1 1.5a7.6 7.6 0 0 0 0 3L2.7 15l2 3.4 2.4-1a8.2 8.2 0 0 0 2.6 1.5l.3 2.6h4l.3-2.6a8.2 8.2 0 0 0 2.6-1.5l2.4 1 2-3.4-2.1-1.5Z"/><circle class="cosmic-detail-v126" cx="12" cy="12" r=".65"/>',
    emotion:'<circle cx="12" cy="12" r="8.5"/><path d="M8.3 10h.1M15.6 10h.1M8.5 14.2c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"/><path class="cosmic-detail-v126" d="m18.5 5 .35.9.9.35-.9.35-.35.9-.35-.9-.9-.35.9-.35.35-.9Z"/>',
    add:'<circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/><circle class="cosmic-detail-v126" cx="19.7" cy="7" r=".65"/>',
    book:'<path d="M4 5.2c3-.8 5.7-.2 8 1.5v13c-2.3-1.7-5-2.3-8-1.5v-13ZM20 5.2c-3-.8-5.7-.2-8 1.5v13c2.3-1.7 5-2.3 8-1.5v-13Z"/><path class="cosmic-detail-v126" d="m17.5 8 .3.8.8.3-.8.3-.3.8-.3-.8-.8-.3.8-.3.3-.8Z"/>',
    previous:'<path d="m15 6-6 6 6 6"/>',next:'<path d="m9 6 6 6-6 6"/>',close:'<path d="m6 6 12 12M18 6 6 18"/>'
  };

  function icon(name,className=''){
    return `<svg class="global-svg-icon-v126${className?` ${className}`:''}" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">${ICONS[name]||ICONS.record}</svg>`;
  }
  window.AiderLogIconsV126=Object.freeze({icon,names:Object.freeze(Object.keys(ICONS))});
  window.AiderLogCosmicIconsV123=window.AiderLogIconsV126;

  function replace(button,name){
    if(!button||button.dataset.globalIconV126===name)return;
    button.dataset.globalIconV126=name;
    button.innerHTML=icon(name);
  }
  function replaceSlot(slot,name){
    if(!slot||slot.dataset.globalIconV126===name)return;
    slot.dataset.globalIconV126=name;
    slot.classList.add('global-icon-slot-v126');
    slot.innerHTML=icon(name);
  }
  function decorate(){
    [[document.getElementById('loginBtn'),'profile'],[document.querySelector('.top button[aria-label="memo"]'),'memo'],[document.querySelector('.top button[aria-label="mail"]'),'mail'],[document.getElementById('searchBtn'),'search']].forEach(([node,name])=>{if(node){node.classList.add('global-icon-button-v126');replace(node,name)}});
    document.querySelectorAll('[data-calendar-shift-v125]').forEach(button=>replace(button,Number(button.dataset.calendarShiftV125)<0?'previous':'next'));
    replace(document.querySelector('[data-schedule-insights-v125]'),'insights');
    replace(document.querySelector('[data-schedule-emotion-v125]'),'emotion');
    replace(document.querySelector('[data-calendar-settings-open-v125]'),'calendar');
    const eventMap={record:'record',archive:'archive',travel:'travel'};
    document.querySelectorAll('#event [data-event-mode]').forEach(button=>replace(button,eventMap[button.dataset.eventMode]||'event'));
    document.querySelectorAll('#event [data-travel-create]').forEach(button=>replaceSlot(button.querySelector('i'),button.dataset.travelCreate));
    const album=document.querySelector('#event .album-btn');
    if(album&&album.dataset.globalCompoundV126!=='1'){const label=album.querySelector('span')?.textContent?.trim()||'Album';album.dataset.globalCompoundV126='1';album.innerHTML=`${icon('album')}<span>${label}</span>`;album.classList.add('global-inline-icon-v126')}
    document.querySelectorAll('#routine [data-routine-create-open]').forEach(button=>{if(/^\s*[＋+]\s*$/.test(button.textContent))replace(button,'add')});
    document.querySelectorAll('#routine [data-routine-stats-open],#routine [data-routine-overall]').forEach(button=>{if(button.dataset.globalCompoundV126==='1')return;const label=button.textContent.trim();button.dataset.globalCompoundV126='1';button.innerHTML=`${icon('statistics')}<span>${label}</span>`;button.classList.add('global-inline-icon-v126')});
    document.querySelectorAll('[role="dialog"] button[aria-label*="닫기"],.drawer button[aria-label*="닫기"]').forEach(button=>{if(button.textContent.trim()==='×')replace(button,'close')});
    document.querySelectorAll('.view .card,.view .personal-panel,.view .routine-card,.view .routine-goals-v111,.view .event-archive-card-v111,.view .record-card,.view .dest,.view .ticket,#fifth .my-summary-v115 article,#fifth .my-tool-v115').forEach(node=>node.classList.add('global-surface-v126'));
  }
  let queued=false;
  const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})};
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',queue,{once:true}):queue();
})();
