(function () {
  'use strict';
  const $ = (selector,root=document) => root.querySelector(selector);
  const $$ = (selector,root=document) => Array.from(root.querySelectorAll(selector));
  let queued = false;

  const icons = {
    record:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 18.5V21h2.5L18.4 10.1l-2.5-2.5L5 18.5Z"/><path d="m14.7 8.8 2.5 2.5M14.5 4.5l.6-1.7.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6Z"/></svg>',
    archive:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 4v16M12 8h5M12 12h5M12 16h3"/></svg>',
    travel:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3.8 13 7.5-1.7 4.6-7.1c.6-.8 1.8-.9 2.5-.2.5.5.6 1.2.2 1.8l-4.2 6.5 4.5 2.4 1.8-1.6 1 .5-1.2 3.1-3.3.7-.7-.9 1-1.5-4.8-1.1-3.2 4.9-1.6-.4 1.4-5.1-5.2.8-.3-1.1Z"/></svg>',
    plan:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4" width="14" height="16" rx="3"/><path d="M8 8h8M8 12h5M8 16h7"/></svg>',
    place:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.2"/></svg>',
    food:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v7M4.5 3v4.5A2.5 2.5 0 0 0 7 10v11M9.5 3v4.5A2.5 2.5 0 0 1 7 10M16 21v-7M16 14c-2 0-3.5-1.7-3.5-4 0-3.9 2.1-7 4.5-7v18"/></svg>',
    activity:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z"/><path d="m18.5 16 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"/></svg>'
  };

  function decorateEventIcons() {
    const root = $('#event'); if (!root) return;
    root.classList.add('event-cosmic-v120');
    $$('[data-event-mode]',root).forEach(button => {
      const name = button.dataset.eventMode;
      if (!icons[name] || button.dataset.eventIconV120 === '1') return;
      button.dataset.eventIconV120 = '1';
      button.innerHTML = icons[name];
      const label = name[0].toUpperCase()+name.slice(1);
      button.title = label; button.setAttribute('aria-label',label);
    });
    $$('[data-travel-create]',root).forEach(button => {
      const name = button.dataset.travelCreate,host = $('i',button);
      if (!host || !icons[name] || host.dataset.travelIconV120 === '1') return;
      host.dataset.travelIconV120 = '1'; host.innerHTML = icons[name];
    });
    const form = $('#eventEditorFormV111',root);
    if (form) form.dataset.cosmicV120 = '1';
  }

  function queue() {
    if (queued) return; queued = true;
    requestAnimationFrame(() => { queued = false; decorateEventIcons(); });
  }
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  queue();
})();
