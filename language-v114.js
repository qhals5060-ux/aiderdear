(function () {
  const OUTER_STYLE_ID = 'aiderlog-language-v114-outer';
  const SHADOW_STYLE_ID = 'aiderlog-language-v114-shadow';

  const outerCss = `
#language .language-edu-head{overflow:hidden}
#language .language-edu-head p{max-width:560px!important}
@media(max-width:720px){
  #language .language-page-v25{gap:0!important}
  #language .language-edu-head{
    width:100%!important;
    height:60px!important;
    min-height:60px!important;
    margin:0 0 6px!important;
    padding:8px 11px!important;
    display:grid!important;
    grid-template-columns:minmax(0,1fr) auto!important;
    align-items:center!important;
    gap:8px!important;
  }
  #language .language-edu-head>div:first-child{min-width:0}
  #language .language-edu-head span{font-size:6px!important}
  #language .language-edu-head h1{margin:1px 0 0!important;font-size:18px!important;line-height:1.05!important}
  #language .language-edu-head p{display:none!important}
  #language .edu-badges{display:flex!important;flex-wrap:nowrap!important;gap:4px!important;justify-content:flex-end!important}
  #language .edu-badges i{padding:5px 6px!important;font-size:5.5px!important;white-space:nowrap!important}
  #language .edu-badges i:nth-child(3){display:none!important}
  #language aiderlog-language-lab{
    flex:1 1 auto!important;
    width:100%!important;
    height:calc(100% - 66px)!important;
    min-height:0!important;
    border-radius:16px!important;
    overflow:hidden!important;
  }
}`;

  const shadowCss = `
:host{height:100%!important;min-height:0!important;overflow:hidden!important;background:#f6f7fb!important}
.app-shell{
  width:100%!important;
  height:100%!important;
  min-height:0!important;
  display:grid!important;
  grid-template-rows:auto minmax(0,1fr)!important;
  overflow:hidden!important;
}
.single-page{
  width:100%!important;
  height:auto!important;
  min-height:0!important;
  overflow-y:auto!important;
  overflow-x:hidden!important;
  overscroll-behavior:contain!important;
  scrollbar-width:thin!important;
}
.language-quick-v114{display:none}

@media(max-width:760px){
  .app-header{
    position:relative!important;
    min-height:103px!important;
    height:auto!important;
    padding:10px 11px!important;
    display:block!important;
    background:linear-gradient(135deg,#fff,#f5f3ff)!important;
  }
  .brand{display:none!important}
  .header-controls{
    width:100%!important;
    display:grid!important;
    grid-template-columns:1fr!important;
    grid-template-rows:auto auto!important;
    gap:8px!important;
  }
  .header-course{display:block!important;grid-column:1!important;grid-row:1!important;width:100%!important}
  .header-course .course-selectors{
    width:100%!important;
    display:grid!important;
    grid-template-columns:minmax(105px,.78fr) minmax(0,1.35fr)!important;
    gap:7px!important;
  }
  .header-course .language-select,.header-course .level-select{
    width:100%!important;
    min-width:0!important;
    display:grid!important;
    grid-template-columns:auto minmax(0,1fr)!important;
    align-items:center!important;
    gap:5px!important;
    font-size:8px!important;
  }
  .header-course .language-select select,.header-course .level-select select{
    width:100%!important;
    min-width:0!important;
    height:34px!important;
    margin:0!important;
    padding:0 23px 0 8px!important;
    border-radius:10px!important;
    font-size:9px!important;
  }
  .header-stats{
    grid-column:1!important;
    grid-row:2!important;
    display:flex!important;
    justify-content:flex-start!important;
    gap:6px!important;
  }
  .streak-chip,.records-button{height:31px!important;min-height:31px!important;border-radius:10px!important;font-size:9px!important}

  .single-page{display:block!important;padding:10px 9px 24px!important}
  .language-quick-v114{
    margin:0 0 9px;
    padding:12px 13px;
    display:grid!important;
    grid-template-columns:minmax(0,1fr) auto;
    align-items:center;
    gap:10px;
    color:#fff;
    border-radius:17px;
    background:linear-gradient(135deg,#27245f,#5147c8 55%,#7364ed);
    box-shadow:0 12px 26px rgba(75,65,186,.18);
  }
  .language-quick-v114 small{display:block;color:#c9c4ff;font-size:7px;font-weight:900;letter-spacing:.13em}
  .language-quick-v114 b{display:block;margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px}
  .language-quick-v114 span{display:block;margin-top:3px;color:#e2dfff;font-size:8px}
  .language-quick-v114 button{
    height:37px;
    padding:0 13px;
    border:1px solid rgba(255,255,255,.45);
    border-radius:11px;
    background:#fff;
    color:#4e43c5;
    font-size:9px;
    font-weight:900;
    white-space:nowrap;
  }

  .learning-section,.dashboard-section,.course-panel,.wordbook-section{
    width:100%!important;
    height:auto!important;
    min-height:0!important;
  }
  .learning-section{display:block!important;margin:0 0 10px!important;overflow:hidden!important}
  .scenario-summary{
    min-height:92px!important;
    padding:14px!important;
    display:grid!important;
    grid-template-columns:minmax(0,1fr)!important;
    gap:11px!important;
  }
  .scenario-main{gap:10px!important}
  .scenario-number{width:38px!important;height:38px!important;font-size:12px!important}
  .scenario-line{min-width:0}
  .scenario-line span{font-size:8px!important}
  .scenario-line h3{margin:3px 0 0!important;font-size:17px!important;line-height:1.2!important}
  .scenario-progress-box{padding:0!important;border-left:0!important}
  .scenario-progress-box>div:first-child{font-size:8px!important}
  .scenario-progress{height:5px!important;margin-top:6px!important;border-radius:99px!important;overflow:hidden!important}

  .day-list-heading{padding:14px 13px 8px!important;display:block!important}
  .day-list-heading>div:first-child{display:block!important}
  .day-list-heading h3{font-size:14px!important}
  .day-list-heading>div:first-child span{display:block!important;margin-top:3px!important;font-size:8px!important}
  .day-list-heading .day-list-tools{margin-top:9px!important;display:block!important}
  .day-list-heading .day-list-tools>span{display:none!important}
  .day-page-controls{width:100%!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:4px!important}
  .day-page-button{width:100%!important;height:28px!important;padding:0 2px!important;border-radius:8px!important;font-size:7px!important}
  .day-list{height:auto!important;margin:0 12px 11px!important;display:block!important;overflow:visible!important}
  .day-row{min-height:58px!important;height:auto!important;grid-template-columns:50px minmax(0,1fr) 58px!important}
  .day-index b{font-size:9px!important}
  .day-info{padding:8px 9px!important}
  .day-info b{font-size:10px!important;line-height:1.35!important}
  .day-info p{margin-top:3px!important;font-size:7.5px!important}
  .day-action{width:50px!important;height:30px!important;border-radius:9px!important;font-size:8px!important}

  .recent-study{margin:0 12px 12px!important;border-radius:13px!important}
  .recent-study-days{grid-template-columns:repeat(14,minmax(54px,1fr))!important;overflow-x:auto!important;overflow-y:hidden!important}
  .recent-study-day{min-height:58px!important}
  .recent-study-actions .reset-button,.recent-study-actions .language-partner-share{font-size:8px!important}

  .dashboard-section{display:block!important;margin:0!important;overflow:visible!important}
  .course-panel{margin:0 0 10px!important;overflow:hidden!important}
  .course-panel .section-heading-row{min-height:40px!important;height:auto!important;padding:12px 13px 6px!important}
  .course-panel .section-label{font-size:8px!important}
  .category-selector{
    padding:0 12px 8px!important;
    display:grid!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:6px!important;
  }
  .category-tab{min-height:37px!important;height:auto!important;border-radius:10px!important;font-size:9px!important}
  .scenario-selector{
    padding:0 12px 13px!important;
    display:grid!important;
    grid-template-columns:repeat(2,minmax(0,1fr))!important;
    gap:6px!important;
    overflow:visible!important;
  }
  .scenario-tab{width:100%!important;min-width:0!important;min-height:48px!important;height:auto!important;padding:7px 8px!important;border-radius:11px!important;gap:7px!important}
  .scenario-tab>span:first-child{width:26px!important;height:26px!important;font-size:10px!important}
  .scenario-tab b{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:9px!important}
  .scenario-tab small{font-size:7px!important}

  .wordbook-section{margin:0!important;overflow:hidden!important}
  .wordbook-section .content-heading{min-height:51px!important;height:auto!important;padding:9px 12px!important}
  .wordbook-section .section-label{font-size:8px!important}
  .wordbook-section .count-box{min-width:52px!important;height:38px!important}
  .wordbook-section .filter-row{min-height:36px!important}
  .wordbook-section .filter-button{font-size:9px!important}
  .wordbook-section .word-list{max-height:none!important;overflow:visible!important}
  .wordbook-section .empty-state{padding:32px 12px!important}

  .records-modal,.lesson-screen{position:fixed!important;inset:0!important;width:100%!important;height:100%!important}
  .records-dialog{width:calc(100% - 20px)!important;max-height:calc(100% - 28px)!important;border-radius:20px!important}
  .record-summary{grid-template-columns:repeat(2,1fr)!important}
  .records-detail-grid{grid-template-columns:1fr!important}
  .lesson-header{padding-inline:12px!important;color:#20243a!important;background:#fff!important;border-bottom:1px solid #e6e7ef!important}
  .lesson-close{color:#4e43c5!important;background:#f0eeff!important;border-radius:9px!important}
  .lesson-heading small{color:#7b8092!important}
  .lesson-heading b{color:#20243a!important}
  .lesson-count{color:#4e43c5!important;background:#f0eeff!important;border-color:#ded9ff!important}
  .lesson-stage{height:auto!important;min-height:0!important;padding:15px 12px 86px!important}
  .lesson-footer{padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important}
}
`;

  function installOuterStyle() {
    if (document.getElementById(OUTER_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = OUTER_STYLE_ID;
    style.textContent = outerCss;
    document.head.appendChild(style);
  }

  function polishOuterCopy() {
    const head = document.querySelector('#language .language-edu-head');
    if (!head) return;
    const description = head.querySelector('p');
    if (description) description.remove();
    const badges = head.querySelectorAll('.edu-badges i');
    const labels = ['36개 코스', '발음 연습', '스마트 복습'];
    badges.forEach((badge, index) => { if (labels[index]) badge.textContent = labels[index]; });
  }

  function enhanceLanguageLab(lab) {
    const root = lab?.shadowRoot;
    if (!root || !root.querySelector('.app-shell')) return;

    if (!root.getElementById(SHADOW_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = SHADOW_STYLE_ID;
      style.textContent = shadowCss;
      root.appendChild(style);
    }

    const main = root.querySelector('.single-page');
    if (!main) return;

    let quick = root.querySelector('.language-quick-v114');
    if (!quick) {
      quick = document.createElement('section');
      quick.className = 'language-quick-v114';
      quick.setAttribute('aria-label', '오늘의 학습 바로가기');
      quick.innerHTML = '<div><small>TODAY\'S LESSON</small><b>오늘의 학습</b><span>다음 학습을 준비하고 있어요.</span></div><button type="button">시작하기</button>';
      main.prepend(quick);
    }

    const syncQuick = () => {
      const title = root.querySelector('#scenario-title')?.textContent?.trim() || '오늘의 학습';
      const action = root.querySelector('.day-action:not(:disabled)');
      const row = action?.closest('.day-row');
      const day = row?.querySelector('.day-index b')?.textContent?.trim() || 'Day 1';
      const lesson = row?.querySelector('.day-info b')?.textContent?.trim() || '첫 학습을 시작해보세요';
      const titleEl = quick.querySelector('b');
      const metaEl = quick.querySelector('span');
      const button = quick.querySelector('button');
      titleEl.textContent = title;
      metaEl.textContent = `${day} · ${lesson}`;
      button.textContent = action?.textContent?.trim() === '복습' ? '복습하기' : '시작하기';
      button.disabled = !action;
    };

    if (!quick.dataset.bound) {
      quick.dataset.bound = 'true';
      quick.querySelector('button').addEventListener('click', () => {
        root.querySelector('.day-action:not(:disabled)')?.click();
      });
      root.addEventListener('click', () => requestAnimationFrame(syncQuick));
      root.addEventListener('change', () => requestAnimationFrame(syncQuick));
      const observer = new MutationObserver(syncQuick);
      const target = root.querySelector('.learning-section');
      if (target) observer.observe(target, { childList: true, subtree: true, characterData: true });
    }
    syncQuick();
  }

  function scanLanguageLab() {
    polishOuterCopy();
    document.querySelectorAll('aiderlog-language-lab').forEach(enhanceLanguageLab);
  }

  installOuterStyle();
  document.addEventListener('language-lab-ready', event => {
    polishOuterCopy();
    enhanceLanguageLab(event.target);
  });

  const previousRenderLanguage = window.renderLanguage;
  if (typeof previousRenderLanguage === 'function') {
    window.renderLanguage = function () {
      const result = previousRenderLanguage.apply(this, arguments);
      setTimeout(scanLanguageLab, 0);
      return result;
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(scanLanguageLab, 0), { once: true });
  } else {
    setTimeout(scanLanguageLab, 0);
  }
})();
