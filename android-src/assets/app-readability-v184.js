(()=>{
 'use strict';
 const root=document.documentElement;
 root.classList.add('app-readability-v184');
 let queued=false;
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
   // Android reports a physical 0.3 mm in device pixels; CSS mm is only a reference pixel unit.
   try{const px=Number(window.AiderLogNative?.getFrameInsetPx?.());if(Number.isFinite(px)&&px>0)root.style.setProperty('--app-frame-v184',String(px/(window.devicePixelRatio||1))+'px');}catch(_){}
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
     set(sheet,{'position':'relative','inset':'auto','width':'100%','min-width':'0','max-width':'100%','height':'auto','min-height':'0','max-height':'var(--editor-height-v184,60dvh)','margin':'0','transform':'none','translate':'none','box-sizing':'border-box','border-radius':'18px 18px 0 0','overflow-x':'hidden','overflow-y':'auto'});
   }
   for(const sheet of document.querySelectorAll('dialog.cw168-sheet,dialog.c167-dialog,dialog.mp166-modal,#estateStage>aside.estate-panel[role="dialog"]')){
     if(sheet.hasAttribute('data-editor-native-v184'))continue;
     sheet.dataset.editorSheetV184='';sheet.dataset.editorNativeV184='';
     Object.entries({'position':'fixed','inset':'auto 0 var(--editor-bottom-v184,0px)','width':'100%','min-width':'0','max-width':'100%','height':'auto','min-height':'0','max-height':'var(--editor-height-v184,60dvh)','margin':'0','transform':'none','translate':'none','box-sizing':'border-box','border-radius':'18px 18px 0 0','overflow-x':'hidden','overflow-y':'auto'}).forEach(([name,value])=>sheet.style.setProperty(name,value,'important'));
   }
 }
 function pass(){queued=false;decorateEditors();}
 function queue(){if(!queued){queued=true;requestAnimationFrame(pass);}}
 function start(){updateViewport();pass();new MutationObserver(pass).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','hidden','aria-hidden']});new MutationObserver(queue).observe(root,{attributes:true,attributeFilter:['data-app-font-size']});}
 addEventListener('resize',()=>{updateViewport();queue();},{passive:true});window.visualViewport?.addEventListener('resize',updateViewport,{passive:true});window.visualViewport?.addEventListener('scroll',updateViewport,{passive:true});
 addEventListener('aiderlog-native-resume',()=>{updateViewport();queue();});
 document.readyState==='loading'?document.addEventListener('DOMContentLoaded',start,{once:true}):start();
 window.AiderLogReadabilityV184={refresh:queue,updateViewport};
})();
