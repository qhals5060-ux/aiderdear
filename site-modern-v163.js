/* Layout adapter only. Move existing nodes so IDs, event listeners and data remain intact. */
(() => {
  'use strict';
  if (window.AiderLogNative || document.documentElement.classList.contains('aiderlog-android')) return;
  document.documentElement.classList.add('modern-site');
  const app = document.getElementById('app');
  const masthead = app?.querySelector('.masthead');
  const tools = app?.querySelector('.nav-tools');
  if (masthead && tools) masthead.append(tools);
  // Paper is an existing shadow-DOM workspace. Apply its edition inside that boundary.
  const paperRoot = document.querySelector('aider-paper-workspace-v121')?.shadowRoot;
  if (paperRoot) {
    const style = document.createElement('link'); style.rel = 'stylesheet';
    style.href = './site-paper-modern-v163.css?v=163'; paperRoot.append(style);
    // The existing v159 extension adds its stylesheet after fetching prompts.
    // Keep the edition last without changing that async workflow.
    new MutationObserver(() => {
      if (paperRoot.lastElementChild !== style) paperRoot.append(style);
    }).observe(paperRoot, { childList: true });
  }
  const styleLanguage = event => {
    const host = event?.target?.matches?.('aiderlog-language-lab') ? event.target : document.querySelector('aiderlog-language-lab');
    if (!host?.shadowRoot || host.shadowRoot.querySelector('[data-modern-language]')) return;
    const style = document.createElement('link'); style.rel = 'stylesheet'; style.dataset.modernLanguage = '';
    style.href = './site-language-modern-v163.css?v=163'; host.shadowRoot.append(style);
  };
  document.addEventListener('language-lab-ready', styleLanguage); styleLanguage();
  const labels = [
    ['.page-dots', ['캘린더', '감정 인사이트']],
    ['.record-page-dots', ['기록 · 앨범', '아카이브 · 여행']],
    ['.private-page-dots', ['루틴', '어학']],
    ['.personal-page-dots', ['개인 기록', '통합 대시보드']],
    ['.task-page-dots', ['고객 관리', '입시요강']],
  ];
  for (const [selector, names] of labels) {
    const nav = app?.querySelector(selector);
    if (!nav) continue;
    nav.classList.add('modern-section-nav');
    nav.setAttribute('aria-label', '세부 화면 선택');
    [...nav.querySelectorAll('button')].forEach((button, index) => {
      if (!names[index]) return;
      button.textContent = names[index]; button.setAttribute('aria-label', names[index]);
    });
    nav.parentElement.classList.add('modern-has-section-nav');
  }
  const selector = document.getElementById('siteDesignVersion');
  const download = document.getElementById('siteDesignDownload');
  if (selector && download) {
    const apply = () => {
      const editorial = selector.value === 'editorial';
      const name = editorial ? 'AiderLog-Editorial-v161-site-files.zip' : 'AiderLog-Modern-v163-site-files.zip';
      download.href = './' + name; download.download = name;
      download.textContent = (editorial ? '에디토리얼' : '모던') + ' 사이트 파일 다운로드';
    };
    selector.addEventListener('change', apply); apply();
  }
})();
