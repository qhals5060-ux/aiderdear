(() => {
 'use strict';
 const root=document.documentElement,canvas=document.createElement('canvas'),measure=canvas.getContext('2d');
 let frame=0,formId=0;
 const observed=new WeakSet(),resize=new ResizeObserver(()=>queue());
 function holidays(){
  for(const label of document.querySelectorAll('#home .schedule-holiday-v144')){
   if(!observed.has(label.parentElement)){resize.observe(label.parentElement);observed.add(label.parentElement);}
   const style=getComputedStyle(label),width=label.clientWidth;
   if(width<1)continue;
   const scale=parseFloat(getComputedStyle(root).getPropertyValue('--app-type-scale-v185'))||1;
   const max=10*scale;measure.font=`${style.fontWeight} ${max}px ${style.fontFamily}`;
   const textWidth=measure.measureText(label.textContent).width;
   // Measure the full holiday name, including spaces. No truncation or replacement.
   const fit=Math.floor(Math.min(max,max*(width-.5)/Math.max(1,textWidth))*100)/100+'px';
   if(label.style.getPropertyValue('--holiday-fit-v186')!==fit)label.style.setProperty('--holiday-fit-v186',fit);
  }
 }
 function profile(){
  const sheet=document.querySelector('.profile-sheet-v137'),footer=sheet?.querySelector('.profile-foot-v137'),calendar=sheet?.querySelector('[data-profile-calendar-section-v138]');
  if(footer&&calendar&&calendar.parentElement!==footer)footer.prepend(calendar);
 }
 function editors(){
  for(const sheet of document.querySelectorAll('[data-editor-sheet-v184]')){
   if(!sheet.hasAttribute('data-compact-sheet-v186'))sheet.dataset.compactSheetV186='';
   // Todo owns its richer subtask form; share visual tokens without moving fields.
   if(sheet.matches('.todo-editor-v179'))continue;
   const head=sheet.querySelector(':scope>header,:scope>form>header,.personal-form-head,.feature-dialog-head-v125,.routine-detail-head');
   if(!head)continue;
   const review=sheet.querySelector('#eventEditorFormV111[data-kind=review]');
   if(review){const title=head.querySelector('h2'),label=(review.elements.namedItem('category')?.value==='travel'?'여행 기록':'아카이브')+(review.dataset.id?' 수정':' 추가');if(title&&title.textContent!==label)title.textContent=label;}
   if(!head.classList.contains('compact-head-v186'))head.classList.add('compact-head-v186');
   if(head.querySelector('.compact-actions-v186'))continue;
   const close=[...head.querySelectorAll('button')].find(b=>/close|Close|닫기/.test([...b.attributes].map(a=>a.name+' '+a.value).join(' '))||b.textContent.trim()==='×');
   if(!close)continue;
   const form=sheet.querySelector('form'),save=form?.querySelector('button[type=submit]')||head.querySelector('button[type=submit]');
   // D-day management may contain an optional hidden add form: keep its action there.
   if(form?.hidden||sheet.closest('.dday-dialog-v125'))continue;
   const actions=document.createElement('div');actions.className='compact-actions-v186';
   if(save){
    const owner=save.form||form;
    if(owner){if(!owner.getAttribute('id'))owner.setAttribute('id','compactFormV186_'+(++formId));save.setAttribute('form',owner.getAttribute('id'));}
    actions.append(save);
   }
   actions.append(close);head.append(actions);
   for(const button of sheet.querySelectorAll('button'))if(button!==close&&button.textContent.trim()==='취소'&&!button.classList.contains('compact-cancel-v186'))button.classList.add('compact-cancel-v186');
  }
 }
 function refresh(){frame=0;profile();editors();holidays();}
 function queue(){if(!frame)frame=requestAnimationFrame(refresh);}
 new MutationObserver(queue).observe(document.body,{childList:true,subtree:true});
 new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['data-app-font-size']});
 addEventListener('resize',queue,{passive:true});document.fonts?.ready.then(queue);queue();
 window.AiderCompactV186=Object.freeze({refresh:queue});
})();
