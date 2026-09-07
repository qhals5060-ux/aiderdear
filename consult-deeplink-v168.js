(() => {
  const params=new URLSearchParams(location.search),view=params.get('section');
  if(!['consult-admissions','consult-analysis'].includes(view))return;
  let opened=false;
  const run=()=>{if(opened||!window.AiderConsultBridge?.canAccess())return;const button=document.querySelector('.tab[data-tab="task"]');if(!button||button.hidden)return;opened=true;button.click();setTimeout(()=>{if(view==='consult-admissions')window.AiderConsultBridge.openAdmissions();else{const id=params.get('clientId');if((window.AiderConsultBridge.snapshot()?.consultingClients||[]).some(row=>row.id===id))window.AiderConsultBridge.legacyAnalysis(id)}},100)};
  addEventListener('aiderdear-firebase-state',()=>setTimeout(run,500));addEventListener('aiderdear-firebase-data',run);setTimeout(run,500);
})();
