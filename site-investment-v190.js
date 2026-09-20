/* PERSONAL's independently mounted investment workspace. Existing finance stays intact. */
(() => {
  'use strict';
  if (window.AiderFinanceHostV190 || !document.getElementById('personalStage')) return;
  const tabs = document.getElementById('personalCategoryTabs');
  const dashboard = document.getElementById('personalDashboard');
  const shell = document.getElementById('personalMainShell');
  if (!tabs || !dashboard || !shell) return;
  let selected = false, frame = null, lastVisible = null, queued = false;
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.personalCategory = 'investment';
  button.className = 'personal-investment-category';
  button.innerHTML = '<span aria-hidden="true">↗</span><span>재테크</span>';
  const previous = tabs.querySelector('[data-personal-category="finance"]');
  if (previous) previous.after(button); else tabs.append(button);
  const pane = document.createElement('section');
  pane.id = 'personalInvestmentV190';
  pane.setAttribute('aria-label', '재테크');
  pane.hidden = true;
  dashboard.after(pane);

  function childEvent(name) {
    try { frame?.contentWindow?.dispatchEvent(new frame.contentWindow.Event(name)); } catch {}
  }
  function notifyVisibility(visible) {
    try { if (frame?.contentWindow) frame.contentWindow.__AiderAssetsVisibleV190 = visible; } catch {}
    if (lastVisible !== visible) { lastVisible = visible; childEvent('aider-assets-visibility'); }
  }
  function mount() {
    if (frame) return;
    frame = document.createElement('iframe');
    frame.className = 'personal-investment-frame';
    frame.title = '재테크 미리보기';
    frame.src = './finance-v190.html?embedded=1&template=1&v=190';
    frame.addEventListener('load', () => { lastVisible = null; refresh(); });
    pane.append(frame);
  }
  function refresh() {
    queued = false;
    const current = selected && document.getElementById('app')?.dataset.activeTab === 'personal'
      && shell.classList.contains('current') && document.visibilityState === 'visible';
    if (selected) mount();
    if (pane.hidden === selected) pane.hidden = !selected;
    if (dashboard.hidden !== selected) dashboard.hidden = selected;
    if (shell.hasAttribute('data-investment-open') !== selected) shell.toggleAttribute('data-investment-open', selected);
    tabs.querySelectorAll('[data-personal-category]').forEach(item => {
      if (selected && item.classList.contains('active') !== (item === button)) item.classList.toggle('active', item === button);
    });
    if (!selected && button.classList.contains('active')) button.classList.remove('active');
    if (button.getAttribute('aria-pressed') !== String(selected)) button.setAttribute('aria-pressed', String(selected));
    notifyVisibility(current);
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(refresh); } }
  function open() { selected = true; refresh(); }
  function close() { selected = false; refresh(); }
  button.addEventListener('click', event => { event.stopPropagation(); open(); });
  tabs.addEventListener('click', event => {
    const target = event.target.closest('[data-personal-category]');
    if (target && target !== button) close();
  }, true);
  document.getElementById('personalOverviewDashboard')?.addEventListener('click', event => {
    if (event.target.closest('[data-overview-category]')) close();
  }, true);
  window.addEventListener('aider-assets-identity', () => {
    if (window.AiderAssetsBridgeV184?.templateMode !== false) return;
    childEvent('aider-assets-identity');
    frame?.remove(); frame = null; lastVisible = null;
    refresh();
  });
  window.addEventListener('message', event => {
    if (window.AiderAssetsBridgeV184?.templateMode !== false) return;
    if (event.origin !== location.origin || event.source !== frame?.contentWindow || event.data?.type !== 'aider-assets-login') return;
    document.getElementById('loginBtn')?.click();
  });
  document.addEventListener('visibilitychange', schedule);
  const observer = new MutationObserver(schedule);
  observer.observe(tabs, { attributes: true, subtree: true, attributeFilter: ['class'] });
  observer.observe(shell, { attributes: true, attributeFilter: ['class'] });
  const app = document.getElementById('app');
  if (app) observer.observe(app, { attributes: true, attributeFilter: ['data-active-tab'] });
  window.AiderFinanceHostV190 = Object.freeze({ open, close, refresh });
  refresh();
})();
