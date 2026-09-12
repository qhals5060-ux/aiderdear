/* Site calendar density and agenda/media grouping. No records or media are copied. */
(() => {
  'use strict';
  const html=document.documentElement;
  const native=()=>Boolean(window.AiderLogNative||window.Android||html.classList.contains('aiderlog-android')
    ||new URLSearchParams(location.search).has('android-preview'));
  if(window.AiderLogSiteCalendarV175||native())return;
  const app=document.getElementById('app'),page=document.getElementById('page0');
  if(!app||!page||!document.getElementById('calendar'))return;
  html.classList.add('site-calendar-v175');
  function refresh(){
    if(native())return;
    const top=document.getElementById('sharedListTop'),remaining=document.getElementById('sharedList');
    const agenda=top?.closest('.month-agenda');
    if(!agenda||!remaining||!agenda.contains(remaining))return;
    let list=agenda.querySelector('.site-month-agenda-list-v175');
    if(!list){
      list=document.createElement('div');list.className='site-month-agenda-list-v175';
      list.setAttribute('role','region');list.setAttribute('aria-label','이번 달 일정 목록');list.tabIndex=0;
      agenda.insertBefore(list,agenda.firstChild);
    }
    // renderShared keeps updating these same two IDs. Move each live list only
    // once; do not re-append stable nodes on refresh or observe our own changes.
    if(top.parentNode!==list)list.appendChild(top);
    if(remaining.parentNode!==list)list.appendChild(remaining);
  }
  window.AiderLogSiteCalendarV175=Object.freeze({refresh,eventLineLimit:()=>native()?2:3});
  addEventListener('aiderlog-site-editionchange',refresh);
  refresh();
})();
