/* Native/PWA back navigation. Keep the wheel's gestures and all existing close
   buttons as their own owners; an edge swipe invokes those same UI actions. */
(() => {
  'use strict';
  if (window.AiderAppBackV176) return;
  const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const visible = node => {
    if (!node || node.hidden || !node.getClientRects().length) return false;
    const style = getComputedStyle(node);
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) !== 0;
  };
  const current = () => document.querySelector('.views > .view.on')?.id || 'home';
  const stack = [current()];
  let returning = '', gesture = null, suppress = null, touchUntil = 0;
  const innerBack = '[data-cw-back],[data-suite145-back],[data-my128-back],[data-my-back],[data-offline-back],[data-mp159-back],[data-paper-back],[data-study-back]';
  const closeButtons = '[data-close],[data-private-close],[data-profile-close-v137],[data-schedule-dialog-close-v125],[data-settings-close-v125],[data-travel-folder-close-v125],[data-routine-stats-close-v125],#personalClose,#cancelRecord,#closeDrawer,button[aria-label*="닫기"]';

  function recordRoute() {
    const page = current();
    if (page === returning) { returning = ''; return; }
    if (returning || stack[stack.length - 1] === page) return;
    stack.push(page);
    if (stack.length > 32) stack.shift();
  }

  function closeOverlay() {
    const dialogs = all('dialog[open]').filter(visible);
    const overlays = dialogs.length ? dialogs : all('[role="dialog"][aria-modal="true"],.intro.on,.modal.open,.modal.on,.event-editor-overlay-v111,.drawer.open').filter(visible);
    const overlay = overlays[overlays.length - 1];
    if (!overlay) return false;
    const close = all(closeButtons, overlay).find(visible);
    if (close && !close.disabled) close.click();
    // Busy/unknown dialogs must not silently navigate away from unsaved input.
    return true;
  }

  function navigateBack() {
    recordRoute();
    const from = current();
    let destination = '';
    while (stack.length && stack[stack.length - 1] === from) stack.pop();
    while (stack.length && !document.getElementById(stack[stack.length - 1])) stack.pop();
    destination = stack[stack.length - 1] || (from !== 'home' ? 'home' : '');
    if (!destination) { stack.push(from); return false; }
    if (!stack.length) stack.push(destination);
    returning = destination;
    if (window.AiderLogWheelV151?.navigate) window.AiderLogWheelV151.navigate(destination);
    else if (typeof window.go === 'function') window.go(destination, false);
    else { returning = ''; stack.push(from); return false; }
    recordRoute();
    return true;
  }

  function install() {
    const shell = window.AiderLogAppShell;
    if (!shell || shell.__backGestureV176) return;
    const prior = shell.handleBack;
    const next = function () {
      if (closeOverlay()) return true;
      if (document.getElementById('wheel')?.classList.contains('open')) {
        window.AiderLogWheelV151?.setOpen(false);
        return true;
      }
      if (prior?.apply(this, arguments)) return true;
      const back = all(innerBack, document.querySelector('.views > .view.on') || document).find(visible);
      if (back && !back.disabled) { back.click(); return true; }
      return navigateBack();
    };
    // Paper/language adapters use markers on the function to prevent rewrapping.
    if (prior?.__paper166) next.__paper166 = true;
    shell.handleBack = next;
    shell.__backGestureV176 = true;
  }

  function blocked(event) {
    const path = event.composedPath?.() || [event.target];
    for (const node of path) {
      if (node?.nodeType !== 1) continue;
      if (node.matches('input,textarea,select,[contenteditable="true"],canvas,video,audio,iframe,#wheel,[data-back-gesture="off"]')) return true;
      const style = getComputedStyle(node);
      if (node.scrollWidth > node.clientWidth + 2 && /auto|scroll/.test(style.overflowX)) return true;
    }
    return false;
  }

  function begin(event, point, kind) {
    gesture = null;
    // An edge-only gesture does not steal card carousels or horizontal lessons.
    if (!point || point.x > Math.min(48, Math.max(32, window.innerWidth * .12)) || point.x < 0 || blocked(event)) return;
    gesture = { ...point, startX: point.x, startY: point.y, at: Date.now(), kind, locked: false };
  }
  function move(event, point) {
    const g = gesture;
    if (!g || !point || point.id !== g.id) return;
    const dx = point.x - g.startX, dy = point.y - g.startY;
    if (!g.locked && (dx < -8 || Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx))) { gesture = null; return; }
    if (dx > 16 && dx > Math.abs(dy) * 1.7) g.locked = true;
    if (g.locked && event.cancelable) event.preventDefault();
  }
  function finish(event, point) {
    const g = gesture; gesture = null;
    if (!g || !point || point.id !== g.id) return;
    const dx = point.x - g.startX, dy = point.y - g.startY;
    if (dx < 64 || Math.abs(dy) > dx * .45 || Date.now() - g.at > 1000) return;
    install();
    if (!window.AiderLogAppShell?.handleBack?.()) return;
    if (event.cancelable) event.preventDefault();
    suppress = { x: point.x, y: point.y, until: Date.now() + 650 };
  }
  const touchPoint = list => list?.length ? { x: list[0].clientX, y: list[0].clientY, id: list[0].identifier } : null;
  const options = { capture: true, passive: false };
  window.addEventListener('touchstart', event => {
    touchUntil = Date.now() + 1000;
    if (event.touches.length !== 1) { gesture = null; return; }
    begin(event, touchPoint(event.touches), 'touch');
  }, { capture: true, passive: true });
  window.addEventListener('touchmove', event => {
    if (event.touches.length !== 1) { gesture = null; return; }
    move(event, touchPoint(event.touches));
  }, options);
  window.addEventListener('touchend', event => { if (gesture?.kind === 'touch') finish(event, touchPoint(event.changedTouches)); }, options);
  window.addEventListener('touchcancel', () => { gesture = null; }, { capture: true, passive: true });
  window.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || Date.now() < touchUntil || event.button !== 0) return;
    begin(event, { x: event.clientX, y: event.clientY, id: event.pointerId }, 'pointer');
  }, { capture: true, passive: true });
  window.addEventListener('pointermove', event => {
    if (gesture?.kind === 'pointer') move(event, { x: event.clientX, y: event.clientY, id: event.pointerId });
  }, options);
  window.addEventListener('pointerup', event => {
    if (gesture?.kind === 'pointer') finish(event, { x: event.clientX, y: event.clientY, id: event.pointerId });
  }, options);
  window.addEventListener('pointercancel', () => { if (gesture?.kind === 'pointer') gesture = null; }, { capture: true, passive: true });
  window.addEventListener('click', event => {
    if (!suppress || event.detail === 0 || Date.now() > suppress.until || Math.hypot(event.clientX - suppress.x, event.clientY - suppress.y) > 32) return;
    suppress = null; event.preventDefault(); event.stopImmediatePropagation();
  }, true);
  const refresh = () => { install(); recordRoute(); };
  document.addEventListener('aiderlog-page-changed', refresh);
  window.addEventListener('hashchange', refresh);
  const views = document.querySelector('.views');
  if (views) new MutationObserver(records => {
    if (records.some(record => record.target.parentElement === views)) refresh();
  }).observe(views, { subtree: true, attributes: true, attributeFilter: ['class'] });
  window.AiderAppBackV176 = { back: () => { install(); return !!window.AiderLogAppShell?.handleBack?.(); }, refresh };
  refresh();
})();
