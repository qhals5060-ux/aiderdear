/* Presentation-only attachment for website Shadow DOM modules. */
(() => {
  'use strict';
  if (window.AiderLogNative || document.documentElement.classList.contains('aiderlog-android')) return;
  if (window.AiderLogSiteTypographyV169) return;
  const href = new URL('./site-typography-v169.css?v=169', document.currentScript?.src || location.href).href;
  const observed = new WeakSet();
  let queued = false;
  function mount(host) {
    const root = host.shadowRoot;
    if (!root) return;
    host.setAttribute('data-site-typography-v169', '');
    let link = root.querySelector('link[data-site-typography-v169]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.setAttribute('data-site-typography-v169', '');
      root.append(link);
    }
    // The existing edition adapter owns its last stylesheet's position. Do not
    // fight that observer by repeatedly moving this link; the CSS specificity
    // is stable even when edition CSS follows it.
    if (!observed.has(root)) {
      observed.add(root);
      new MutationObserver(records => {
        if (records.some(record => record.target === root && record.type === 'childList')) schedule();
      }).observe(root, {childList: true});
    }
  }
  function refresh() {
    queued = false;
    if (document.documentElement.classList.contains('aiderlog-android')) return;
    document.querySelectorAll('aiderlog-language-lab,aider-paper-workspace-v121').forEach(mount);
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(refresh);
  }
  new MutationObserver(records => {
    if (records.some(record => [...record.addedNodes].some(node => node.nodeType === 1 &&
      (node.matches?.('aiderlog-language-lab,aider-paper-workspace-v121') ||
       node.querySelector?.('aiderlog-language-lab,aider-paper-workspace-v121'))))) schedule();
  }).observe(document.body, {childList: true, subtree: true});
  document.addEventListener('language-lab-ready', schedule);
  addEventListener('aiderlog-site-editionchange', schedule);
  for (const tag of ['aiderlog-language-lab','aider-paper-workspace-v121']) customElements.whenDefined(tag).then(schedule);
  window.AiderLogSiteTypographyV169 = {refresh};
  refresh();
})();
