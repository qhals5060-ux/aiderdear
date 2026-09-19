(() => {
  'use strict';

  const wheel = document.getElementById('wheel');
  const core = document.getElementById('wheelCore');
  const field = document.getElementById('wheelFan');
  if (!wheel || !core || !field) return;

  /* One owner only. Older controllers see these flags before DOMContentLoaded. */
  ['controlV142','controlV143','controlV149','controlV150','controlV151']
    .forEach(key => { wheel.dataset[key] = '1'; });

  const items = () => Array.from(wheel.querySelectorAll('.global-wheel-item-v126'));
  let gesture = null;
  let holdTimer = 0;
  let suppressClickUntil = 0;
  let touchInputUntil = 0;
  let routeToken = 0;
  const ROUTE_KEY = 'aiderlog-active-page-v157';

  const consume = event => {
    if (event.cancelable) event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
  };

  const touchPoint = (event, ended = false) => {
    const list = ended ? event.changedTouches : event.touches;
    const point = list && list[0];
    return point ? { x: point.clientX, y: point.clientY, id: point.identifier } : null;
  };

  function clearSelection() {
    items().forEach(item => {
      item.classList.remove('hovered');
      delete item.dataset.wheelSelectedV151;
    });
    if (gesture) gesture.selected = null;
  }

  function markSelection(item) {
    items().forEach(candidate => {
      const active = candidate === item;
      candidate.classList.toggle('hovered', active);
      if (active) candidate.dataset.wheelSelectedV151 = 'true';
      else delete candidate.dataset.wheelSelectedV151;
    });
    if (gesture) gesture.selected = item || null;
    return item || null;
  }

  function setOpen(open) {
    const next = Boolean(open);
    wheel.classList.toggle('open', next);
    core.setAttribute('aria-expanded', String(next));
    core.setAttribute('aria-label', '홈으로 이동 · 길게 눌러 페이지 선택');
    if (!next) wheel.classList.remove('arming');
    if (!next) clearSelection();
  }

  function nearest(x, y, maxDistance = 74) {
    let selected = null;
    let best = maxDistance;
    for (const item of items()) {
      const rect = item.getBoundingClientRect();
      if (!rect.width || !rect.height) continue;
      const distance = Math.hypot(x - (rect.left + rect.width / 2), y - (rect.top + rect.height / 2));
      if (distance <= best) {
        best = distance;
        selected = item;
      }
    }
    return markSelection(selected);
  }

  function renderFallback(page) {
    document.querySelectorAll('.views > .view').forEach(view => view.classList.toggle('on', view.id === page));
    document.getElementById('app')?.classList.toggle('home-mode', page === 'home');
    document.getElementById('app')?.classList.toggle('insights-mode', page === 'insights');
    history.replaceState(null, '', `${location.pathname}${location.search}#${page}`);
    document.documentElement.dataset.activePageV154 = page;
    try {
      sessionStorage.setItem(ROUTE_KEY, page);
      sessionStorage.setItem('aiderlog-active-page-v154', page);
    } catch {}
  }

  function navigate(requested) {
    const candidate = String(requested || '');
    const page = document.querySelector(`.views > #${CSS.escape(candidate)}`) ? candidate : 'home';
    if (window.AiderEstateAppV183?.beforeNavigate(page) === false) return false;
    const token = ++routeToken;
    suppressClickUntil = Date.now() + 650;
    document.documentElement.classList.add('aiderlog-route-changing-v154');
    setOpen(false);
    /* Commit the view before any expensive page renderer runs. This gives
       Samsung WebView a paint opportunity immediately after finger-up. */
    renderFallback(page);
    document.dispatchEvent(new CustomEvent('aiderlog-page-changed', { detail: { page } }));
    setTimeout(() => {
      if (token !== routeToken || typeof window.go !== 'function') return;
      try { window.go(page, false); }
      catch (error) {
        console.warn('[wheel-v157] navigation fallback', error);
        renderFallback(page);
      }
    }, 16);

    /* Some Samsung WebView builds dispatch a delayed synthetic core click.
       Reassert the selected view after that compatibility window. */
    [0, 96, 260].forEach(delay => setTimeout(() => {
      if (token !== routeToken) return;
      const active = document.querySelector('.views > .view.on');
      if (active?.id !== page) renderFallback(page);
      if (delay >= 260) document.documentElement.classList.remove('aiderlog-route-changing-v154');
    }, delay));
  }

  function start(kind, event, point) {
    const target = event.target;
    const item = target.closest?.('.global-wheel-item-v126');
    const pressedCore = target.closest?.('#wheelCore');
    const insideOpenField = wheel.classList.contains('open') && target.closest?.('#wheel');
    if (!item && !pressedCore && !insideOpenField) return false;

    consume(event);
    clearTimeout(holdTimer);
    suppressClickUntil = Date.now() + 650;
    gesture = {
      kind,
      id: point.id,
      origin: item ? 'item' : pressedCore ? 'core' : 'field',
      item: item || null,
      selected: item || null,
      startX: point.x,
      startY: point.y,
      moved: false,
      long: Boolean(item)
    };

    if (item) {
      setOpen(true);
      markSelection(item);
    } else if (pressedCore) {
      clearSelection();
      core.classList.add('pressing');
      wheel.classList.add('arming');
      holdTimer = setTimeout(() => {
        if (!gesture || gesture.kind !== kind || gesture.id !== point.id) return;
        gesture.long = true;
        setOpen(true);
        navigator.vibrate?.(10);
      }, 165);
    } else {
      setOpen(true);
      nearest(point.x, point.y, 112);
    }
    return true;
  }

  function move(kind, event, point) {
    if (!gesture || gesture.kind !== kind || gesture.id !== point.id) return;
    consume(event);
    const distance = Math.hypot(point.x - gesture.startX, point.y - gesture.startY);
    if (distance > 7) gesture.moved = true;
    if (gesture.origin === 'core' && gesture.moved && !gesture.long) {
      clearTimeout(holdTimer);
      gesture.long = true;
      setOpen(true);
    }
    if (gesture.long || gesture.origin === 'field') nearest(point.x, point.y, 116);
  }

  function finish(kind, event, point, cancelled = false) {
    if (!gesture || gesture.kind !== kind || gesture.id !== point.id) return;
    consume(event);
    clearTimeout(holdTimer);
    core.classList.remove('pressing');
    wheel.classList.remove('arming');
    suppressClickUntil = Date.now() + 650;

    const state = gesture;
    if (point) {
      /* The 44px+ touch targets intentionally extend beyond the visible orb.
         On compact Galaxy screens those boxes can overlap, so elementFromPoint
         may report the later sibling instead of the orb the user touched. */
      if (state.origin === 'item' && !state.moved) state.selected = state.item;
      // A stationary hold opens the approved compact orbit without choosing
      // a menu merely because its center is now within the old 116px radius.
      else if (state.moved || state.origin !== 'core') state.selected = nearest(point.x, point.y, 116) || state.selected;
    }
    gesture = null;

    if (cancelled) {
      setOpen(false);
      return;
    }
    if (state.origin === 'core' && !state.long && !state.moved) {
      navigate('home');
      return;
    }
    if (state.selected) {
      navigator.vibrate?.(8);
      navigate(state.selected.dataset.page);
      return;
    }

    /* A stationary long press leaves the whole wheel bar tappable. */
    clearSelection();
    setOpen(true);
  }

  /* Native TouchEvent is the authoritative Android path. */
  document.addEventListener('touchstart', event => {
    const point = touchPoint(event);
    if (!point) return;
    if (start('touch', event, point)) touchInputUntil = Date.now() + 1400;
    else if (wheel.classList.contains('open') && !event.target.closest?.('#wheel')) setOpen(false);
  }, { capture: true, passive: false });
  document.addEventListener('touchmove', event => {
    const point = touchPoint(event);
    if (point) move('touch', event, point);
  }, { capture: true, passive: false });
  document.addEventListener('touchend', event => {
    const point = touchPoint(event, true);
    if (point) finish('touch', event, point, false);
  }, { capture: true, passive: false });
  document.addEventListener('touchcancel', event => {
    const point = touchPoint(event, true) || (gesture ? { x: gesture.startX, y: gesture.startY, id: gesture.id } : null);
    if (point) finish('touch', event, point, true);
  }, { capture: true, passive: false });

  /* Mouse/pen preview path. Touch pointers are ignored to prevent duplicate
     Android gestures after the native touch handlers above. */
  document.addEventListener('pointerdown', event => {
    if (event.pointerType === 'touch' || Date.now() < touchInputUntil) return;
    start('pointer', event, { x: event.clientX, y: event.clientY, id: event.pointerId });
  }, { capture: true, passive: false });
  document.addEventListener('pointermove', event => {
    if (event.pointerType === 'touch' || Date.now() < touchInputUntil) return;
    move('pointer', event, { x: event.clientX, y: event.clientY, id: event.pointerId });
  }, { capture: true, passive: false });
  document.addEventListener('pointerup', event => {
    if (event.pointerType === 'touch' || Date.now() < touchInputUntil) return;
    finish('pointer', event, { x: event.clientX, y: event.clientY, id: event.pointerId }, false);
  }, { capture: true, passive: false });
  document.addEventListener('pointercancel', event => {
    if (event.pointerType === 'touch' || Date.now() < touchInputUntil) return;
    finish('pointer', event, { x: event.clientX, y: event.clientY, id: event.pointerId }, true);
  }, { capture: true, passive: false });

  document.addEventListener('click', event => {
    const item = event.target.closest?.('.global-wheel-item-v126');
    const pressedCore = event.target.closest?.('#wheelCore');
    if (!item && !pressedCore) {
      if (wheel.classList.contains('open') && !event.target.closest?.('#wheel')) setOpen(false);
      return;
    }
    consume(event);
    if (Date.now() < suppressClickUntil || Date.now() < touchInputUntil) return;
    navigate(item?.dataset.page || 'home');
  }, true);

  wheel.addEventListener('contextmenu', event => event.preventDefault(), true);
  core.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); navigate('home'); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); }
    else if (event.key === 'Escape') setOpen(false);
  });

  /* WebView can resume with delayed mutations from an earlier render.  Keep
     the last committed route stable without replaying the splash screen. */
  function restoreCommittedRoute(preferSaved = false) {
    let saved = '';
    try { saved = sessionStorage.getItem(ROUTE_KEY) || sessionStorage.getItem('aiderlog-active-page-v154') || ''; } catch {}
    const hashed = location.hash.slice(1);
    const savedValid = saved && document.querySelector(`.views > #${CSS.escape(saved)}`) ? saved : '';
    const hashValid = hashed && document.querySelector(`.views > #${CSS.escape(hashed)}`) ? hashed : '';
    const page = preferSaved ? (savedValid || hashValid) : (hashValid || savedValid);
    if (!page || !document.querySelector(`.views > #${CSS.escape(page)}`)) return;
    requestAnimationFrame(() => {
      const active = document.querySelector('.views > .view.on');
      if (active?.id !== page) renderFallback(page);
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') restoreCommittedRoute(true);
  });
  window.addEventListener('pageshow', () => restoreCommittedRoute(false));
  window.addEventListener('aiderlog-native-resume', () => restoreCommittedRoute(true));
  window.addEventListener('pagehide', () => {
    const active = document.querySelector('.views > .view.on')?.id || location.hash.slice(1) || 'home';
    try { sessionStorage.setItem(ROUTE_KEY, active); } catch {}
  });

  restoreCommittedRoute(false);

  window.AiderLogWheelV151 = { navigate, setOpen, restoreCommittedRoute };
})();
