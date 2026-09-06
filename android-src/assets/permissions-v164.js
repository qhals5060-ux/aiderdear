(() => {
  'use strict';
  if (!window.AiderLogPermissions?.showFirstRun) return;
  let launched = false;
  let timer;
  function check() {
    if (launched || document.visibilityState === 'hidden') return;
    if (document.querySelector('.app-splash-v136,.tutorial-v143.on,.tutorial-v136.on')) return;
    launched = true;
    clearInterval(timer);
    window.AiderLogPermissions.showFirstRun();
  }
  // The tutorial is scheduled 180 ms after splash completion. Do not race it.
  window.addEventListener('aiderlog-splash-complete', () => setTimeout(check, 500), { once: true });
  window.addEventListener('pageshow', () => setTimeout(check, 750));
  document.addEventListener('visibilitychange', check);
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-tutorial-dismiss-v143],[data-tutorial-next-v143]')) setTimeout(check, 250);
  });
  timer = setInterval(check, 1500);
})();
