(()=>{
 'use strict';
 const root=document.documentElement;
 root.classList.add('app-readability-v184');
 const owned=new WeakSet();let queued=false;
 const skip='#wheel,svg,canvas,video,[contenteditable="true"],[data-font-owned-v184="1"],.brain-view,.brain-canvas,.plotly,.chartjs-render-monitor';
 const caption='small,time,figcaption,.record-meta,.section-label,.event-meta,.field-help,.hint,[class*="-subtitle"],[class*="-caption"],[class*="-hint"]';
 const calendar='.schedule-days-v119,.schedule-week-v119,.calendar-todos-v179,.schedule-calctl-v119,.calendar-status-icons,.weekly-view-v184';
 function normalizeText(){
   const nodes=document.querySelectorAll('#app :is(button,label,input,select,textarea,p,span,b,strong,small,time,td,th,li,legend,dt,dd),body>.modal :is(button,label,input,select,textarea,p,span,b,strong,small,time),[role="dialog"] :is(button,label,input,select,textarea,p,span,b,strong,small,time),[data-editor-sheet-v184] :is(button,label,input,select,textarea,p,span,b,strong,small,time)');
   const writes=[];
   for(const el of nodes){
     if(owned.has(el)||el.closest(skip)||!el.getClientRects().length||el.matches('input[type="checkbox"],input[type="radio"],input[type="range"],input[type="color"]'))continue;
     if(!['INPUT','SELECT','TEXTAREA'].includes(el.tagName)&&![...el.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue;
     if(el.closest('h1,h2,h3,h4,h5,h6')||el.matches('[class*="icon"],.brandmark,.daynum,.schedule-day-number-v119'))continue;
     const px=parseFloat(getComputedStyle(el).fontSize);
     if(!Number.isFinite(px)||px>16.5)continue;
     const role=el.closest(calendar)?'calendar':el.matches(caption)||el.closest(caption)?'caption':'body';
     writes.push([el,role]);
   }
   for(const [el,role] of writes){el.dataset.readableRoleV184=role;el.setAttribute('data-css-typography','v184');el.style.setProperty('font-size',`var(--app-${role}-v184)`,'important');owned.add(el);}
 }
 const layers=[
 ['.schedule-dialog-v125',':scope>section'],['.schedule-dialog-v119',':scope>section'],['.emotion-dialog-v119',':scope>section'],['.dday-dialog-v125',':scope>section'],
 ['#recordModal',':scope>.box'],['#personalModal',':scope>.box'],['#journalModal',':scope>.box'],['#memoModal',':scope>.box'],
 ['.travel-folder-dialog-v125',':scope>section'],['.workflow-editor-v127',':scope>section'],['.work145-overlay',':scope>section'],
 ['.event-editor-overlay-v111',':scope>.event-editor-sheet-v111'],['.routine-detail-overlay',':scope>.routine-detail-sheet'],['.routine-editor-v111',':scope>.routine-detail-sheet'],
 ['.todo-editor-overlay-v179',':scope>.todo-editor-v179'],
 ['.my128-modal',':scope>section'],['.my-modal-v115',':scope>.my-dialog-v115'],
 ['.album-create-v121',':scope>section'],['#quickMemoModalV142',':scope>.utility-dialog-v142'],
 ['.consult-modal-overlay',':scope>.consult-modal'],['.estate-modal-overlay',':scope>.estate-modal'],['.a184-editor',':scope>section']
 ];
 function updateViewport(){
   const vv=window.visualViewport;const height=Math.max(120,vv?.height||innerHeight);const bottom=Math.max(0,innerHeight-height-(vv?.offsetTop||0));
   root.style.setProperty('--editor-viewport-v184',`${height}px`);root.style.setProperty('--editor-height-v184',`${height*.6}px`);root.style.setProperty('--editor-bottom-v184',`${bottom}px`);
 }
 function decorateEditors(){
   for(const [selector,child] of layers)for(const layer of document.querySelectorAll(selector)){
     const sheet=layer.querySelector(child);if(!sheet)continue;
     if(layer.hasAttribute('data-editor-layer-v184'))continue;
     layer.dataset.editorLayerV184='';sheet.dataset.editorSheetV184='';
     // Inline ownership beats old important Fold/full-screen editor rules;
     // values remain CSS variables so keyboard/rotation updates need no DOM rewrite.
     const set=(node,rules)=>Object.entries(rules).forEach(([name,value])=>node.style.setProperty(name,value,'important'));
     set(layer,{'position':'fixed','inset':'auto 0 var(--editor-bottom-v184,0px)','width':'100%','min-width':'0','max-width':'100%','height':'var(--editor-viewport-v184,100dvh)','min-height':'0','max-height':'none','margin':'0','padding':'0','align-items':'flex-end','justify-content':'center','transform':'none','translate':'none'});
     set(sheet,{'position':'relative','inset':'auto','width':'100%','min-width':'0','max-width':'100%','height':'var(--editor-height-v184,60dvh)','min-height':'var(--editor-height-v184,60dvh)','max-height':'var(--editor-height-v184,60dvh)','margin':'0','transform':'none','translate':'none','box-sizing':'border-box','border-radius':'18px 18px 0 0','overflow-x':'hidden','overflow-y':'auto'});
   }
   for(const sheet of document.querySelectorAll('dialog.cw168-sheet,dialog.c167-dialog,dialog.mp166-modal,#estateStage>aside.estate-panel[role="dialog"]')){
     if(sheet.hasAttribute('data-editor-native-v184'))continue;
     sheet.dataset.editorSheetV184='';sheet.dataset.editorNativeV184='';
     Object.entries({'position':'fixed','inset':'auto 0 var(--editor-bottom-v184,0px)','width':'100%','min-width':'0','max-width':'100%','height':'var(--editor-height-v184,60dvh)','min-height':'var(--editor-height-v184,60dvh)','max-height':'var(--editor-height-v184,60dvh)','margin':'0','transform':'none','translate':'none','box-sizing':'border-box','border-radius':'18px 18px 0 0','overflow-x':'hidden','overflow-y':'auto'}).forEach(([name,value])=>sheet.style.setProperty(name,value,'important'));
   }
 }
 function pass(){queued=false;decorateEditors();normalizeText();}
 function queue(){if(!queued){queued=true;requestAnimationFrame(pass);}}
 function start(){updateViewport();pass();new MutationObserver(queue).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','aria-hidden']});new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['data-app-font-size']});}
 addEventListener('resize',()=>{updateViewport();queue();},{passive:true});window.visualViewport?.addEventListener('resize',updateViewport,{passive:true});window.visualViewport?.addEventListener('scroll',updateViewport,{passive:true});
 addEventListener('aiderlog-native-resume',()=>{updateViewport();queue();});
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
 window.AiderLogReadabilityV184={refresh:queue,updateViewport};
})();
