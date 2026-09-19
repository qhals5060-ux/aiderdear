/* Move the SAME todo region when a foldable window opens/closes. */
(() => {
  'use strict';
  const wide=matchMedia('(min-width:600px) and (min-height:480px)');
  let frame=0;
  const dayKey=value=>`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`;
  function todoPosition(dates,today=dayKey(new Date())){
    if(!dates.length)return null;
    const exact=dates.indexOf(today),nearest=exact>=0?exact:today<dates[0]?0:dates.length-1;
    const week=Math.floor(nearest/7),weeks=Math.ceil(dates.length/7),last=Math.min(dates.length-1,week*7+6);
    const rows=Array(weeks).fill('minmax(var(--calendar-week-min-v182,0px),1fr)');rows.splice(week+1,0,'66px');
    return {last,week,weeks,rows:rows.join(' ')};
  }
  function refresh(){
    frame=0;const home=document.querySelector('#home .schedule-dashboard-v179');if(!home)return;
    const todos=home.querySelector('[data-todo-inline-v179]'),days=home.querySelector('.schedule-days-v119'),side=home.querySelector('.schedule-summary-v179');
    if(!todos||!days||!side)return;
    {
      const cells=[...days.querySelectorAll('[data-schedule-date-v125]')],position=todoPosition(cells.map(cell=>cell.dataset.scheduleDateV125));
      if(position){const end=cells[position.last];if(end.nextElementSibling!==todos)end.after(todos);days.style.setProperty('--calendar-grid-rows-v182',position.rows);}
    }
    window.AiderTodoV179?.mountInline?.(todos);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(refresh);}
  new MutationObserver(records=>{if(records.some(({addedNodes})=>[...addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.schedule-dashboard-v179')||node.querySelector?.('.schedule-dashboard-v179')))))schedule();}).observe(document.getElementById('home'),{childList:true});
  wide.addEventListener('change',schedule);
  window.AiderCalendarLayoutV179=Object.freeze({refresh,todoPosition});refresh();
})();
