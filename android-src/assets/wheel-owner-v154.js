(() => {
  'use strict';
  const wheel = document.getElementById('wheel');
  if (!wheel) return;
  /* Older releases each installed their own capture listener.  Claim those
     versions before they load; wheel-navigation-v151 remains the sole owner. */
  ['controlV142', 'controlV143', 'controlV149', 'controlV150'].forEach(key => {
    wheel.dataset[key] = '1';
  });
  window.__AIDERLOG_WHEEL_OWNER__ = 'v154';
})();
