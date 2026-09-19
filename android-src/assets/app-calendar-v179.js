/* Move the SAME todo region when a foldable window opens/closes. */
(() => {
  'use strict';
  const wide=matchMedia('(min-width:600px) and (min-height:480px)');
  let frame=0;
  function refresh(){
    frame=0;const home=document.querySelector('#home .schedule-dashboard-v179');if(!home)return;
    const todos=home.querySelector('[data-todo-inline-v179]'),days=home.querySelector('.schedule-days-v119'),side=home.querySelector('.schedule-summary-v179');
    if(!todos||!days||!side)return;
    if(wide.matches){if(todos.parentNode!==side)side.append(todos);}
    else {const secondWeek=days.querySelectorAll('[data-schedule-date-v125]')[13];if(secondWeek&&secondWeek.nextElementSibling!==todos)secondWeek.after(todos);}
    window.AiderTodoV179?.mountInline?.(todos);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(refresh);}
  new MutationObserver(records=>{if(records.some(({addedNodes})=>[...addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.schedule-dashboard-v179')||node.querySelector?.('.schedule-dashboard-v179')))))schedule();}).observe(document.getElementById('home'),{childList:true});
  wide.addEventListener('change',schedule);
  window.AiderCalendarLayoutV179=Object.freeze({refresh});refresh();
})();
