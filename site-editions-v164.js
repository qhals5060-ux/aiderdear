/* Website edition only: reuse the same controls, listeners and data in both layouts. */
(() => {
  'use strict';
  const html = document.documentElement;
  if (window.AiderLogNative || html.classList.contains('aiderlog-android')) return;
  const KEY = 'aiderlog.site.edition';
  const app = document.getElementById('app');
  const masthead = app?.querySelector('.masthead');
  const navTools = app?.querySelector('.nav-tools');
  const originalToolsParent = navTools?.parentNode;
  const toolsSlot = document.createComment('site-edition-tools-position');
  if (navTools) navTools.before(toolsSlot);
  let current = html.dataset.siteDefaultEdition === 'editorial' ? 'editorial' : 'modern';
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'modern' || saved === 'editorial') current = saved;
  } catch { /* Downloaded file or private browsing may disable localStorage. */ }
  // Edition-specific Windows shortcuts open the authenticated HTTPS app. Only
  // these two public appearance values may override the saved preference.
  const requestedEdition = new URL(location.href).searchParams.get('site-edition');
  if (requestedEdition === 'modern' || requestedEdition === 'editorial') {
    current = requestedEdition;
    try { localStorage.setItem(KEY, current); } catch {}
  }
  const sectionNavs = [
    ['.page-dots', ['캘린더', '감정 인사이트']],
    ['.record-page-dots', ['기록 · 앨범', '아카이브 · 여행']],
    ['.private-page-dots', ['루틴', '어학']],
    ['.personal-page-dots', ['개인 기록', '통합 대시보드']],
    ['.task-page-dots', ['고객 관리', '입시요강']],
  ].map(([selector, names]) => {
    const nav = app?.querySelector(selector);
    if (!nav) return null;
    return { nav, names, parent: nav.parentElement, aria: nav.getAttribute('aria-label'),
      navClass: nav.classList.contains('modern-section-nav'),
      parentClass: nav.parentElement.classList.contains('modern-has-section-nav'),
      buttons: [...nav.querySelectorAll('button')].map(button => ({ button,
        nodes: [...button.childNodes], aria: button.getAttribute('aria-label') })) };
  }).filter(Boolean);
  const shadowStyles = new Map();
  // Only public edition controls and release links are copied outside the
  // authenticated account panel. Profile, records and notices stay protected.
  const accountDownloads = document.querySelector('[data-account-panel="app"] .site-edition-downloads');
  const accountTheme = document.querySelector('[data-account-panel="app"] .site-theme-control');
  const loginStatus = document.getElementById('googleStatus');
  if (accountDownloads && accountTheme && loginStatus && !document.getElementById('siteGuestDownloadsV164')) {
    const guest = document.createElement('section');
    guest.id = 'siteGuestDownloadsV164'; guest.className = 'site-guest-downloads';
    guest.setAttribute('aria-label', '사이트 테마와 앱 다운로드');
    const themeCopy = accountTheme.cloneNode(true);
    const guestSelect = themeCopy.querySelector('[data-site-theme-select]');
    guestSelect.id = 'guestSiteThemeVersion';
    themeCopy.querySelector('label').htmlFor = guestSelect.id;
    guest.append(themeCopy, accountDownloads.cloneNode(true));
    loginStatus.after(guest);
  }
  function restoreAttribute(node, name, value) {
    if (value === null) node.removeAttribute(name); else node.setAttribute(name, value);
  }
  function clearEditionFontFloor(root) {
    root.querySelectorAll('[data-site-font-floor-original]').forEach(element => {
      const value = element.dataset.siteFontFloorOriginal;
      const priority = element.dataset.siteFontFloorPriority || '';
      // Restore only a value still owned by the floor, not a later user override.
      if (element.style.getPropertyValue('font-size') === element.dataset.siteFontFloorApplied
          && element.style.getPropertyPriority('font-size') === 'important') {
        if (value) element.style.setProperty('font-size', value, priority);
        else element.style.removeProperty('font-size');
      }
      delete element.dataset.siteFontFloorOriginal;
      delete element.dataset.siteFontFloorPriority;
      delete element.dataset.siteFontFloorApplied;
      element.classList.remove('font-floor-raised');
    });
  }
  function styleShadow(host, kind, path) {
    const root = host?.shadowRoot;
    if (!root || !root.querySelector(kind === 'paper' ? '.paper-v121-surface' : '.app-shell')) return;
    let style = shadowStyles.get(root) || root.querySelector(`[data-site-edition-style="${kind}"]`);
    if (!style) {
      style = document.createElement('link');
      style.rel = 'stylesheet'; style.href = path; style.dataset.siteEditionStyle = kind;
      style.media = current === 'modern' ? 'all' : 'not all';
      style.disabled = current !== 'modern';
      root.append(style); shadowStyles.set(root, style);
      new MutationObserver(() => {
        // Paper adds its extension CSS asynchronously; keep only the active
        // Modern override last. Editorial never reapplies a Modern stylesheet.
        if (current === 'modern' && root.lastElementChild !== style) root.append(style);
      }).observe(root, { childList: true });
    }
    style.media = current === 'modern' ? 'all' : 'not all';
    style.disabled = current !== 'modern';
    if (current === 'modern') {
      clearEditionFontFloor(root);
      if (root.lastElementChild !== style) root.append(style);
    }
  }
  function styleWorkspaces() {
    styleShadow(document.querySelector('aider-paper-workspace-v121'), 'paper', './site-paper-modern-v165.css?v=167');
    styleShadow(document.querySelector('aiderlog-language-lab'), 'language', './site-language-modern-v165.css');
  }
  function apply(value, persist = true) {
    current = value === 'editorial' ? 'editorial' : 'modern';
    const modern = current === 'modern';
    html.classList.toggle('modern-site', modern);
    html.dataset.siteEdition = current;
    if (navTools) {
      if (modern && masthead && navTools.parentNode !== masthead) masthead.append(navTools);
      else if (!modern && toolsSlot.isConnected) toolsSlot.after(navTools);
      else if (!modern && originalToolsParent?.isConnected) originalToolsParent.append(navTools);
    }
    for (const entry of sectionNavs) {
      entry.nav.classList.toggle('modern-section-nav', modern || entry.navClass);
      entry.parent.classList.toggle('modern-has-section-nav', modern || entry.parentClass);
      restoreAttribute(entry.nav, 'aria-label', modern ? '세부 화면 선택' : entry.aria);
      entry.buttons.forEach(({ button, nodes, aria }, index) => {
        if (modern && entry.names[index]) {
          button.replaceChildren(document.createTextNode(entry.names[index]));
          button.setAttribute('aria-label', entry.names[index]);
        } else {
          button.replaceChildren(...nodes);
          restoreAttribute(button, 'aria-label', aria);
        }
      });
    }
    if (modern) clearEditionFontFloor(document);
    styleWorkspaces();
    document.querySelectorAll('[data-site-theme-select]').forEach(select => { select.value = current; });
    document.querySelectorAll('[data-site-theme-status]').forEach(status => {
      status.textContent = '현재 사이트: ' + (modern ? '모던' : '에디토리얼');
    });
    if (persist) { try { localStorage.setItem(KEY, current); } catch {} }
    window.dispatchEvent(new CustomEvent('aiderlog-site-editionchange', { detail: { edition: current } }));
  }
  document.addEventListener('change', event => {
    if (event.target.matches?.('[data-site-theme-select]')) apply(event.target.value);
  });
  document.addEventListener('language-lab-ready', styleWorkspaces);
  window.AiderLogSiteEdition = Object.freeze({ get: () => current, set: value => apply(value) });
  apply(current, false);
})();
