import {mountEstateV171} from './estate-v171.js';
import {canUseEstateAccount} from './estate-domain-v171.js';

// The APK serves these assets on the site origin, sharing its authenticated API.
const page=document.getElementById('estate'),root=document.getElementById('estateStage');
if(page&&root){
  const user=()=>window.AiderDearFirebase?.getState?.()?.user;
  const allowed=()=>canUseEstateAccount(user());
  const isActive=()=>page.classList.contains('on');
  const navigate=destination=>{
    if(window.AiderLogWheelV151?.navigate)window.AiderLogWheelV151.navigate(destination);
    else window.go?.(destination,false);
  };
  let controller;
  function open(){
    if(!allowed())return false;
    navigate('estate');
    controller?.activate();
    return isActive();
  }
  function beforeNavigate(destination){
    if(destination==='estate'&&!allowed())return false;
    if(destination!=='estate'&&isActive()&&allowed())return controller?.canLeave()!==false;
    return true;
  }
  controller=mountEstateV171(root,{isActive:()=>isActive()&&allowed(),openPage:open,savedMessage:'부동산 자료 저장 완료',directoryMode:'cards'});
  root.dataset.estateHost='app';
  const back=()=>{
    if(!isActive())return false;
    if(document.getElementById('wheel')?.classList.contains('open')||document.querySelector('dialog[open],.intro.on,.modal.open,.modal.on,.event-editor-overlay-v111,.drawer.open'))return false;
    if(controller.hasPanel()){controller.close();return true;}
    if(controller.canLeave())navigate('fifth');
    return true;
  };
  window.AiderEstateAppV183=Object.freeze({open,beforeNavigate,back,activate:()=>controller.activate()});
  page.querySelector('[data-estate-back]').onclick=back;

  // Reparent the existing controls, retaining their filters, handlers and view state.
  function enhanceDirectories(){
    root.querySelectorAll('.estate-directory-toolbar').forEach(toolbar=>{
      let details=toolbar.closest('.app-estate-filters');
      if(!details){
        details=document.createElement('details');details.className='app-estate-filters';
        const summary=document.createElement('summary');details.append(summary);
        toolbar.before(details);details.append(toolbar);
        const meta=toolbar.querySelector('.estate-directory-list-meta');if(meta)details.after(meta);
      }
      const count=[...toolbar.querySelectorAll('input,select')].filter(input=>String(input.value||'').trim()&&(input.name!=='directorySort'||input.value!=='recent')).length;
      const label=`검색 · 필터${count?` · ${count}개 적용`:''}`;
      if(details.firstElementChild.textContent!==label)details.firstElementChild.textContent=label;
    });
  }
  new MutationObserver(enhanceDirectories).observe(root,{childList:true,subtree:true});
  root.addEventListener('input',enhanceDirectories);
  root.addEventListener('change',enhanceDirectories);
  enhanceDirectories();

  // Keep the existing page owner and native back chain, adding only ESTATE's guard.
  function installGuards(){
    if(typeof window.go==='function'&&!window.go.__estateV183){
      const prior=window.go;
      const guarded=function(destination){if(!beforeNavigate(destination))return false;return prior.apply(this,arguments);};
      guarded.__estateV183=true;window.go=guarded;
    }
    const shell=window.AiderLogAppShell;
    if(shell&&typeof shell.handleBack==='function'&&!shell.handleBack.__estateV183){
      const prior=shell.handleBack;
      const guarded=function(){return back()||prior.apply(this,arguments);};
      Object.assign(guarded,prior);guarded.__estateV183=true;shell.handleBack=guarded;
    }
  }
  function refresh(){
    installGuards();controller.activate();
    if(isActive()&&!allowed())navigate('fifth');
  }
  document.addEventListener('aiderlog-page-changed',refresh);
  new MutationObserver(refresh).observe(page,{attributes:true,attributeFilter:['class']});
  window.addEventListener('aiderdear-firebase-state',refresh);
  window.addEventListener('aiderdear-firebase-ready',refresh);
  window.addEventListener('beforeunload',event=>{
    if(isActive()&&controller.hasUnsaved()){event.preventDefault();event.returnValue='';}
  });
  refresh();
}
