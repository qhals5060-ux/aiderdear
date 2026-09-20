/* Production presentation only: no preview records, stores, network or action replacement. */
(()=>{'use strict';let frame=0;const root=document.documentElement;
 function refresh(){frame=0;
  document.querySelectorAll('.dday-summary-v179 time').forEach(el=>{const full=el.dataset.fullDateV188||el.textContent.trim();if(/^\d{4}-\d{2}-\d{2}$/.test(full)){if(!el.dataset.fullDateV188)el.dataset.fullDateV188=full;el.title=full;const value=full.slice(5).replace('-','.');if(el.textContent!==value)el.textContent=value;}});
  const mailbox=document.getElementById('mailboxBtn'),search=document.getElementById('searchBtn');if(mailbox?.getAttribute('aria-label')!=='우편함')mailbox?.setAttribute('aria-label','우편함');if(search?.getAttribute('aria-label')!=='검색')search?.setAttribute('aria-label','검색');
  const profile=document.querySelector('.profile-sheet-v137');if(profile)profile.dataset.designV188='';
 }
 function queue(){if(!frame)frame=requestAnimationFrame(refresh)}
 new MutationObserver(records=>{if(records.some(r=>r.type==='childList'))queue()}).observe(document.body,{subtree:true,childList:true});
 root.dataset.designRevision='191';queue();window.AiderDesignV188=Object.freeze({refresh:queue});
})();
