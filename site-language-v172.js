/* Website presentation only. Keep the language engine's live nodes and handlers. */
(() => {
  'use strict';
  const html=document.documentElement;
  const site=()=>!window.AiderLogNative&&!window.Android&&!html.classList.contains('aiderlog-android')&&!new URLSearchParams(location.search).has('android-preview');
  if(!site()||window.AiderLogSiteLanguageV172)return;
  const href=new URL('./site-language-v172.css?v=172',document.currentScript?.src||location.href).href;
  const states=new Map();
  let queued=false;
  const modern=()=>site()&&html.classList.contains('modern-site');
  const relevant=node=>node?.nodeType===1&&(node.matches?.('.app-shell,.course-panel,.header-course,.header-stats')||node.querySelector?.('.app-shell,.course-panel,.header-course,.header-stats'));

  function restore(state){
    for(const {node,marker} of state.moves){
      if(marker.isConnected&&node.parentNode&&marker.nextSibling!==node)marker.after(node);
    }
    state.wrapper.remove();
    state.shell.classList.remove('site-language-v172');
    state.host.removeAttribute('data-site-language-v172');
  }
  function createState(host,root,shell,course){
    const controls=[root.querySelector('.header-course'),root.querySelector('.header-stats')];
    if(controls.some(node=>!node))return null;
    const wrapper=document.createElement('section');
    wrapper.className='site-language-controls-v172';
    wrapper.setAttribute('aria-label','언어 · 난이도 · 학습 기록');
    const moves=controls.map(node=>{
      const marker=document.createComment('site-language-v172-control-origin');
      node.before(marker);
      return {node,marker};
    });
    return {host,root,shell,course,wrapper,moves,observer:null};
  }
  function observe(state){
    state.observer.observe(state.root,{childList:true,subtree:true});
  }
  function mount(host){
    const root=host.shadowRoot,shell=root?.querySelector('.app-shell'),course=root?.querySelector('.course-panel');
    if(!root||!shell||!course)return;
    let state=states.get(host);
    // A full template replacement gets fresh anchors. Never retain stale inputs.
    if(state&&(state.shell!==shell||state.course!==course||state.moves.some(({node})=>!root.contains(node)))){
      state.observer.disconnect();
      state.wrapper.remove();
      state.moves.forEach(({marker})=>marker.remove());
      states.delete(host);state=null;
    }
    if(!state){
      if(!modern())return;
      state=createState(host,root,shell,course);if(!state)return;
      state.observer=new MutationObserver(records=>{
        // Lesson text/progress updates do not require DOM movement. React only
        // to a rebuilt shell/control or root stylesheet/template replacement.
        if(records.some(record=>record.target===root||[...record.addedNodes,...record.removedNodes].some(relevant)))schedule();
      });
      states.set(host,state);
    }
    state.observer.disconnect();
    try{
      if(!modern()){restore(state);return;}
      let link=root.querySelector('link[data-site-language-v172]');
      if(!link){
        link=document.createElement('link');link.rel='stylesheet';link.href=href;
        link.setAttribute('data-site-language-v172','');root.append(link);
      }
      // v165 owns its stylesheet order. Specific selectors, not competing
      // last-child moves, make these overrides stable after any edition refresh.
      if(!host.hasAttribute('data-site-language-v172'))host.setAttribute('data-site-language-v172','');
      state.shell.classList.add('site-language-v172');
      if(state.wrapper.parentNode!==course||course.firstElementChild!==state.wrapper)course.prepend(state.wrapper);
      state.moves.forEach(({node})=>{if(node.parentNode!==state.wrapper)state.wrapper.append(node);});
    }finally{observe(state);}
  }
  function refresh(){
    queued=false;
    for(const [host,state]of states){
      if(!host.isConnected){state.observer.disconnect();states.delete(host);}
    }
    document.querySelectorAll('aiderlog-language-lab').forEach(mount);
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(refresh);}}
  new MutationObserver(records=>{
    if(records.some(record=>[...record.addedNodes].some(node=>node?.nodeType===1&&(node.matches?.('aiderlog-language-lab')||node.querySelector?.('aiderlog-language-lab')))))schedule();
    for(const [host,state]of states)if(!host.isConnected){state.observer.disconnect();states.delete(host);}
  }).observe(document.body,{childList:true,subtree:true});
  document.addEventListener('language-lab-ready',schedule);
  addEventListener('aiderlog-site-editionchange',schedule);
  customElements.whenDefined('aiderlog-language-lab').then(schedule);
  window.AiderLogSiteLanguageV172=Object.freeze({refresh});
  refresh();
})();
