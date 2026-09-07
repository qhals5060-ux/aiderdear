// No timer/service runs while the app is closed; foreground use resumes safely.
(() => {
  let timer;
  const run=()=>{clearTimeout(timer);timer=setTimeout(()=>window.AiderDearFirebase?.compactQuarterly?.().catch(error=>console.warn('분기 압축 보류 — 원본 보존',error)),12000)};
  window.addEventListener('aiderdear-firebase-state',run);
  window.addEventListener('online',run);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)run()});
  run();
})();
