/* Flat wheelbar silhouettes. Navigation and the planet remain owned by v151. */
(() => {
  'use strict';
  const names=Object.freeze({home:'SCHEDULE',routine:'ROUTINE',event:'EVENT',fifth:'PAPER'});
  const shapes=Object.freeze({
    home:'<rect x="3" y="5" width="18" height="16" rx="2.2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 18h3"/>',
    event:'<rect x="3" y="5.5" width="18" height="13" rx="2.2"/><path d="m6.3 15.5 3.9-4.3 4.5 4.3"/><circle cx="16.5" cy="9.3" r="1.25" fill="currentColor" stroke="none"/>',
    routine:'<path d="M9.6 20.15A8.5 8.5 0 1 1 20.45 11.1"/><path d="m12.6 17.3 2.6 2.6 5.7-6"/>',
    fifth:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v5h4M9 12h7M9 16h7"/>'
  });
  const icon=page=>shapes[page]?'<svg class="global-svg-icon-v126 wheelbar-icon-v176" data-wheelbar-icon-v176="'+page+'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="'+(page==='personal'?'currentColor':'none')+'" stroke="'+(page==='personal'?'none':'currentColor')+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+shapes[page]+'</svg>':'';
  const wheel=document.getElementById('wheel');
  let queued=false;
  function currentPage(){
    const active=document.querySelector('.views > .view.on')?.id||location.hash.slice(1);
    return ['personal','todo'].includes(active)?'home':active;
  }
  function refresh(){
    queued=false;if(!wheel)return;
    const active=currentPage();
    wheel.querySelectorAll('.global-wheel-item-v126').forEach(button=>{
      const page=button.dataset.page;if(!names[page])return;
      const labelId='wheelbar-label-'+page+'-v176';
      // Required semantic nodes only: other renderers may safely decorate styles.
      if(!button.querySelector('[data-wheelbar-icon-v176="'+page+'"]')){
        button.innerHTML='<i aria-hidden="true">'+icon(page)+'</i><span class="wheelbar-name-v176" id="'+labelId+'">'+names[page]+'</span>';
      }else if(!button.querySelector('#'+labelId)){
        const label=document.createElement('span');label.id=labelId;label.className='wheelbar-name-v176';label.textContent=names[page];button.append(label);
      }
      if(button.dataset.wheelbarMenuV176!==page)button.dataset.wheelbarMenuV176=page;
      if(button.getAttribute('aria-labelledby')!==labelId)button.setAttribute('aria-labelledby',labelId);
      if(active===page){if(button.getAttribute('aria-current')!=='page')button.setAttribute('aria-current','page');}else button.removeAttribute('aria-current');
      const tabIndex=wheel.classList.contains('open')?0:-1;
      if(button.tabIndex!==tabIndex)button.tabIndex=tabIndex;
    });
  }
  function queue(){if(queued)return;queued=true;requestAnimationFrame(refresh);}
  window.AiderWheelbarV176=Object.freeze({icon,names,refresh});
  if(!wheel)return;
  new MutationObserver(records=>{if(records.some(record=>record.type==='childList'||record.attributeName==='data-page'||record.target===wheel))queue();}).observe(wheel,{childList:true,subtree:true,attributes:true,attributeFilter:['data-page','class']});
  const views=document.querySelector('.views');
  if(views)new MutationObserver(records=>{if(records.some(record=>record.target?.classList?.contains('view')))queue();}).observe(views,{subtree:true,attributes:true,attributeFilter:['class']});
  document.addEventListener('aiderlog-page-changed',queue);
  window.addEventListener('hashchange',queue);
  window.addEventListener('pageshow',queue);
  window.addEventListener('aiderlog-native-resume',queue);
  refresh();
})();
