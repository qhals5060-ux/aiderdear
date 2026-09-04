(function () {
  'use strict';

  const SHADOW_STYLE_ID = 'aiderlog-language-v124-shadow';
  const shadowObservers = new WeakMap();
  const queuedRoots = new WeakSet();

  const SHADOW_CSS = `
    :host{
      --blue:#625DF5;
      --blue-dark:#4E47D6;
      --blue-pale:#F0EFFF;
      --ink:#11152C;
      --muted:#8E93A6;
      --line:#E6E8F1;
      --line-dark:#D8DAE7;
      --canvas:transparent;
      height:100%!important;
      min-height:0!important;
      overflow:hidden!important;
      color:var(--ink)!important;
      background:transparent!important;
    }
    *{box-sizing:border-box}
    button,input,select{font-family:inherit}
    .cosmic-svg-icon-v123{
      display:block;
      fill:none;
      stroke:currentColor;
      stroke-width:1.9;
      stroke-linecap:round;
      stroke-linejoin:round;
      overflow:visible;
    }
    .app-shell{
      width:100%!important;
      height:100%!important;
      min-height:0!important;
      display:grid!important;
      grid-template-rows:auto minmax(0,1fr)!important;
      gap:8px!important;
      overflow:hidden!important;
      background:transparent!important;
    }
    .app-header{
      position:relative!important;
      top:auto!important;
      z-index:30!important;
      width:100%!important;
      min-height:96px!important;
      height:auto!important;
      margin:0!important;
      padding:9px 10px!important;
      display:block!important;
      overflow:hidden!important;
      border:1px solid var(--line)!important;
      border-radius:18px!important;
      background:rgba(255,255,255,.96)!important;
      box-shadow:0 6px 22px rgba(25,30,70,.045)!important;
    }
    .app-header::after{
      content:"";
      position:absolute;
      width:74px;
      height:28px;
      right:-20px;
      top:-7px;
      border:1px solid rgba(98,93,245,.11);
      border-radius:50%;
      transform:rotate(-19deg);
      pointer-events:none;
    }
    .brand{display:none!important}
    .header-controls{
      width:100%!important;
      min-width:0!important;
      display:grid!important;
      grid-template-columns:1fr!important;
      grid-template-rows:auto auto!important;
      align-items:center!important;
      gap:7px!important;
    }
    .header-course{
      grid-column:1!important;
      grid-row:1!important;
      display:block!important;
      width:100%!important;
      min-width:0!important;
      text-align:left!important;
    }
    .header-course .course-selectors{
      width:100%!important;
      display:grid!important;
      grid-template-columns:minmax(105px,.72fr) minmax(0,1.28fr)!important;
      gap:7px!important;
      align-items:end!important;
      justify-content:stretch!important;
    }
    .header-course .language-select,.header-course .level-select{
      min-width:0!important;
      width:100%!important;
      display:grid!important;
      grid-template-columns:1fr!important;
      gap:4px!important;
      color:#656A7D!important;
      font-size:10px!important;
      font-weight:850!important;
      line-height:1!important;
    }
    .header-course .language-select select,.header-course .level-select select{
      width:100%!important;
      min-width:0!important;
      height:35px!important;
      margin:0!important;
      padding:0 27px 0 9px!important;
      border:1px solid var(--line)!important;
      border-radius:11px!important;
      background:#fff!important;
      color:var(--ink)!important;
      font-size:11px!important;
      font-weight:750!important;
      outline:0!important;
    }
    .header-course select:focus{border-color:var(--blue)!important;box-shadow:0 0 10px rgba(98,93,245,.1)!important}
    .header-stats{
      grid-column:1!important;
      grid-row:2!important;
      display:flex!important;
      align-items:center!important;
      justify-content:flex-end!important;
      gap:6px!important;
    }
    .streak-chip,.records-button{
      min-height:30px!important;
      height:30px!important;
      padding:0 9px!important;
      display:inline-flex!important;
      align-items:center!important;
      gap:5px!important;
      border:1px solid var(--line)!important;
      border-radius:10px!important;
      background:#fff!important;
      color:#565B6E!important;
      font-size:10px!important;
      font-weight:850!important;
      box-shadow:none!important;
    }
    .streak-chip i{
      width:7px!important;
      height:7px!important;
      overflow:hidden!important;
      border-radius:50%!important;
      background:#FF9D55!important;
      color:transparent!important;
      font-size:0!important;
      box-shadow:0 0 6px rgba(255,157,85,.28)!important;
    }
    .records-button{color:var(--blue)!important;background:#F8F7FF!important}
    .records-button .language-record-icon-v124{width:14px;height:14px;display:grid;place-items:center}
    .records-button .language-record-icon-v124 svg{width:14px;height:14px}
    .records-button b{
      min-width:18px;
      height:18px;
      padding:0 4px;
      display:grid;
      place-items:center;
      border-radius:9px;
      background:var(--blue);
      color:#fff;
      font-size:9px!important;
    }

    .single-page{
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      margin:0!important;
      padding:0 0 30px!important;
      display:block!important;
      overflow-x:hidden!important;
      overflow-y:auto!important;
      overscroll-behavior:contain!important;
      scrollbar-width:thin!important;
      background:transparent!important;
    }
    .language-quick-v114{display:none!important}
    .learning-section,.course-panel,.wordbook-section{
      width:100%!important;
      height:auto!important;
      min-height:0!important;
      overflow:hidden!important;
      border:1px solid var(--line)!important;
      border-radius:18px!important;
      background:#fff!important;
      box-shadow:0 6px 22px rgba(25,30,70,.045)!important;
    }
    .learning-section{display:block!important;margin:0 0 8px!important}
    .scenario-summary{
      position:relative!important;
      min-height:112px!important;
      height:auto!important;
      padding:15px 15px 13px!important;
      display:grid!important;
      grid-template-columns:minmax(0,1fr)!important;
      gap:12px!important;
      overflow:hidden!important;
      border:0!important;
      border-radius:17px 17px 0 0!important;
      color:#fff!important;
      background:
        radial-gradient(circle at 91% 20%,rgba(255,255,255,.72) 0 1.2px,transparent 2px),
        radial-gradient(circle at 79% 72%,rgba(226,223,255,.6) 0 1px,transparent 1.8px),
        linear-gradient(135deg,#5667F3,#625DF5 54%,#735AF5)!important;
    }
    .scenario-summary::before{
      content:"";
      position:absolute;
      width:78px;
      height:32px;
      right:-17px;
      top:18px;
      border:1px solid rgba(255,255,255,.26);
      border-radius:50%;
      transform:rotate(-23deg);
    }
    .scenario-summary::after{
      content:"";
      position:absolute;
      width:27px;
      height:27px;
      right:11px;
      top:21px;
      border-radius:50%;
      background:radial-gradient(circle at 35% 28%,rgba(255,255,255,.55),rgba(255,255,255,.11) 40%,rgba(196,190,255,.22));
      box-shadow:0 0 12px rgba(255,255,255,.09);
    }
    .scenario-main{position:relative;z-index:1;display:flex!important;align-items:center!important;gap:11px!important;min-width:0!important}
    .scenario-number{
      width:43px!important;
      height:43px!important;
      display:grid!important;
      place-items:center!important;
      flex:0 0 auto!important;
      border:1px solid rgba(255,255,255,.53)!important;
      border-radius:13px!important;
      background:rgba(255,255,255,.09)!important;
      color:#fff!important;
      font-size:13px!important;
      font-weight:900!important;
    }
    .scenario-line{min-width:0!important;display:block!important}
    .scenario-line #scenario-place{display:block!important;color:#E6E5FF!important;font-size:10px!important;font-weight:850!important;opacity:1!important}
    .scenario-line h3{margin:3px 0 0!important;overflow:hidden!important;color:#fff!important;font-size:20px!important;line-height:1.15!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .scenario-progress-box{position:relative;z-index:1;padding:0!important;border:0!important}
    .scenario-progress-box>div:first-child{display:flex!important;align-items:center!important;justify-content:space-between!important;color:#F0EFFF!important;font-size:10px!important}
    .scenario-progress-box b{font-size:10px!important}
    .scenario-progress{height:5px!important;margin-top:6px!important;overflow:hidden!important;border-radius:99px!important;background:rgba(255,255,255,.2)!important}
    .scenario-progress i{height:100%!important;border-radius:99px!important;background:#fff!important;box-shadow:none!important}

    .day-list-heading{
      min-height:79px!important;
      padding:13px 13px 8px!important;
      display:block!important;
      border:0!important;
      background:#fff!important;
    }
    .day-list-heading>div:first-child{display:flex!important;align-items:baseline!important;justify-content:space-between!important;gap:8px!important}
    .day-list-heading h3{margin:0!important;color:var(--ink)!important;font-size:17px!important}
    .day-list-heading>div:first-child span{max-width:70%;overflow:hidden;color:var(--muted)!important;font-size:10px!important;text-overflow:ellipsis;white-space:nowrap}
    .day-list-tools{margin-top:9px!important;display:block!important}
    .day-list-tools>span{display:none!important}
    .day-page-controls{width:100%!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:5px!important}
    .day-page-button{
      width:100%!important;
      height:30px!important;
      padding:0 2px!important;
      border:1px solid var(--line)!important;
      border-radius:9px!important;
      background:#fff!important;
      color:#74798B!important;
      font-size:9px!important;
      font-weight:850!important;
    }
    .day-page-button.active{border-color:var(--blue)!important;background:var(--blue)!important;color:#fff!important;box-shadow:0 0 10px rgba(98,93,245,.1)!important}
    .day-list{
      height:auto!important;
      margin:0 12px 11px!important;
      padding:0!important;
      display:block!important;
      overflow:visible!important;
      border-top:1px solid var(--line)!important;
      list-style:none!important;
    }
    .day-row{
      position:relative!important;
      min-height:61px!important;
      height:auto!important;
      display:grid!important;
      grid-template-columns:66px minmax(0,1fr) 68px!important;
      align-items:center!important;
      border:0!important;
      border-bottom:1px solid #ECECF3!important;
      background:#fff!important;
    }
    .day-row.is-current-v124{background:#FAF9FF!important}
    .day-index{
      align-self:stretch!important;
      padding:0 5px!important;
      display:grid!important;
      grid-template-columns:1fr auto!important;
      place-items:center!important;
      gap:5px!important;
      border:0!important;
      border-right:1px solid #F0F0F5!important;
      background:transparent!important;
      color:var(--blue)!important;
    }
    .day-index b{font-size:10px!important;white-space:nowrap!important}
    .language-day-status-v124{
      width:12px;
      height:12px;
      display:grid;
      place-items:center;
      border:1px solid #CFCDEA;
      border-radius:50%;
      background:#fff;
      color:#fff;
    }
    .language-day-status-v124 svg{width:8px;height:8px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
    .day-row.is-done-v124 .language-day-status-v124{border-color:var(--blue);background:var(--blue)}
    .day-row.is-locked-v124 .language-day-status-v124{border-color:#E1E2EA;background:#F2F3F7}
    .day-info{min-width:0!important;padding:9px 10px!important}
    .day-info b{display:block!important;overflow:hidden!important;color:var(--ink)!important;font-size:12px!important;line-height:1.35!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .day-info p{margin:3px 0 0!important;overflow:hidden!important;color:var(--muted)!important;font-size:9.5px!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .day-action{
      width:62px!important;
      height:32px!important;
      justify-self:center!important;
      border:1px solid var(--blue)!important;
      border-radius:10px!important;
      background:var(--blue)!important;
      color:#fff!important;
      font-size:9px!important;
      font-weight:900!important;
    }
    .day-action.done{border-color:#DED9FF!important;background:#F0EFFF!important;color:var(--blue)!important}
    .day-action:disabled{border-color:#E3E4EB!important;background:#F3F4F7!important;color:#9B9FAD!important}

    .recent-study{
      min-height:90px!important;
      margin:0 12px 12px!important;
      padding:7px 8px 6px!important;
      display:grid!important;
      grid-template-columns:1fr!important;
      grid-template-rows:minmax(53px,1fr) 19px!important;
      gap:5px!important;
      overflow:hidden!important;
      border:1px solid #ECECF3!important;
      border-radius:13px!important;
      background:#FAFAFD!important;
    }
    .recent-study-days{
      min-width:0!important;
      display:grid!important;
      grid-template-columns:repeat(14,minmax(47px,1fr))!important;
      gap:4px!important;
      overflow-x:auto!important;
      overflow-y:hidden!important;
      scrollbar-width:thin!important;
    }
    .recent-study-day{
      min-height:49px!important;
      padding:5px 2px!important;
      border:1px solid #E4E5ED!important;
      border-radius:9px!important;
      background:#fff!important;
    }
    .recent-study-day time b{font-size:9px!important}.recent-study-day time small{font-size:7px!important}
    .recent-study-day>div span{font-size:7px!important}.recent-study-day>div i{font-size:8px!important}
    .recent-study-actions{
      width:100%!important;
      height:19px!important;
      display:flex!important;
      align-items:flex-end!important;
      justify-content:flex-end!important;
      gap:12px!important;
    }
    .recent-study-actions .reset-button,.recent-study-actions .language-partner-share{
      width:auto!important;
      min-width:0!important;
      height:auto!important;
      min-height:0!important;
      padding:0 0 2px!important;
      border:0!important;
      border-radius:0!important;
      background:transparent!important;
      box-shadow:none!important;
      color:#687085!important;
      font-size:8px!important;
      font-weight:850!important;
      text-decoration:underline!important;
      text-underline-offset:3px!important;
    }

    .dashboard-section{width:100%!important;margin:0!important;display:block!important;overflow:visible!important}
    .course-panel{margin:0 0 8px!important}
    .course-panel .section-heading-row{
      min-height:43px!important;
      height:auto!important;
      padding:12px 13px 7px!important;
      display:block!important;
    }
    .course-panel .section-label,.wordbook-section .section-label{
      margin:0!important;
      color:var(--blue)!important;
      font-size:11px!important;
      font-weight:900!important;
      letter-spacing:.13em!important;
    }
    .category-selector{
      padding:0 12px 8px!important;
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      gap:6px!important;
    }
    .category-tab{
      min-width:0!important;
      min-height:36px!important;
      height:36px!important;
      padding:0 7px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      gap:5px!important;
      border:1px solid var(--line)!important;
      border-radius:10px!important;
      background:#fff!important;
      color:#666B7E!important;
      font-size:9px!important;
      font-weight:850!important;
    }
    .category-tab .language-category-icon-v124{width:14px;height:14px;display:grid;place-items:center;flex:0 0 auto}
    .category-tab .language-category-icon-v124 svg{width:14px;height:14px}
    .category-tab.active{border-color:var(--blue)!important;background:var(--blue)!important;color:#fff!important;box-shadow:none!important}
    .scenario-selector{
      padding:0 12px 12px!important;
      display:grid!important;
      grid-template-columns:repeat(2,minmax(0,1fr))!important;
      gap:6px!important;
      overflow:visible!important;
    }
    .scenario-tab{
      width:100%!important;
      min-width:0!important;
      min-height:49px!important;
      height:auto!important;
      padding:7px 8px!important;
      display:flex!important;
      align-items:center!important;
      gap:7px!important;
      border:1px solid var(--line)!important;
      border-radius:11px!important;
      background:#fff!important;
      color:var(--ink)!important;
      text-align:left!important;
      box-shadow:none!important;
    }
    .scenario-tab>span:first-child{
      width:27px!important;
      height:27px!important;
      display:grid!important;
      place-items:center!important;
      flex:0 0 auto!important;
      border:1px solid #E2E1F2!important;
      border-radius:9px!important;
      background:#F6F5FF!important;
      color:var(--blue)!important;
      font-size:10px!important;
      font-weight:900!important;
    }
    .scenario-tab .tab-copy{min-width:0!important}
    .scenario-tab b{display:block!important;overflow:hidden!important;font-size:9.5px!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .scenario-tab small{display:block!important;margin-top:2px!important;color:var(--muted)!important;font-size:8px!important}
    .scenario-tab.active{border-color:var(--blue)!important;background:#F2F0FF!important;color:var(--blue)!important}
    .scenario-tab.active>span:first-child{border-color:var(--blue)!important;background:var(--blue)!important;color:#fff!important}

    .wordbook-section{margin:0!important}
    .wordbook-section .content-heading{
      min-height:54px!important;
      height:auto!important;
      padding:10px 12px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:space-between!important;
    }
    .wordbook-section .count-box{
      min-width:48px!important;
      height:36px!important;
      padding:0 8px!important;
      display:flex!important;
      align-items:baseline!important;
      justify-content:center!important;
      gap:3px!important;
      border:1px solid #E2E1F2!important;
      border-radius:11px!important;
      background:#F7F6FF!important;
      color:var(--blue)!important;
    }
    .count-box b{font-size:15px!important}.count-box small{font-size:8px!important}
    .filter-row{
      min-height:36px!important;
      padding:0 12px!important;
      display:flex!important;
      gap:17px!important;
      border-bottom:1px solid #ECECF3!important;
    }
    .filter-button{
      position:relative!important;
      min-width:34px!important;
      padding:0 2px!important;
      border:0!important;
      background:transparent!important;
      color:#7E8395!important;
      font-size:10px!important;
      font-weight:800!important;
    }
    .filter-button.active{color:var(--blue)!important}
    .filter-button.active::after{
      content:"";
      position:absolute;
      left:2px;
      right:2px;
      bottom:0;
      height:2px;
      border-radius:2px;
      background:var(--blue);
    }
    .word-list{max-height:none!important;overflow:visible!important}
    .word-row{
      min-height:64px!important;
      padding:9px 11px!important;
      display:grid!important;
      grid-template-columns:42px minmax(0,1fr) auto!important;
      align-items:center!important;
      gap:9px!important;
      border:0!important;
      border-bottom:1px solid #ECECF3!important;
      background:#fff!important;
    }
    .word-kind{display:grid!important;justify-items:start!important;gap:2px!important;color:var(--blue)!important;font-size:8px!important}
    .word-kind .language-word-icon-v124{width:16px;height:16px;display:grid;place-items:center}
    .word-kind .language-word-icon-v124 svg{width:16px;height:16px}
    .word-kind small{display:none!important}
    .word-copy{min-width:0!important}
    .word-copy strong{display:block!important;overflow:hidden!important;color:var(--ink)!important;font-size:13px!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .word-copy span{display:block!important;margin-top:3px!important;overflow:hidden!important;color:var(--muted)!important;font-size:10px!important;text-overflow:ellipsis!important;white-space:nowrap!important}
    .listen-button{
      min-width:34px!important;
      width:34px!important;
      height:34px!important;
      padding:0!important;
      display:grid!important;
      place-items:center!important;
      border:1px solid #E2E1F2!important;
      border-radius:10px!important;
      background:#F7F6FF!important;
      color:var(--blue)!important;
      font-size:0!important;
    }
    .listen-button svg{width:16px!important;height:16px!important}
    .empty-state{
      min-height:128px!important;
      padding:25px 15px!important;
      display:grid!important;
      place-items:center!important;
      align-content:center!important;
      gap:5px!important;
      background:
        radial-gradient(circle at 78% 23%,rgba(98,93,245,.09) 0 3px,transparent 4px),
        linear-gradient(145deg,#fff,#F9F8FF)!important;
    }
    .empty-state b{color:var(--ink)!important;font-size:13px!important}
    .empty-state .language-empty-copy-v124{margin:0;color:var(--muted);font-size:9.5px;text-align:center}
    .empty-state button{
      height:32px!important;
      margin-top:5px!important;
      padding:0 12px!important;
      border:0!important;
      border-radius:10px!important;
      background:var(--blue)!important;
      color:#fff!important;
      font-size:9px!important;
      font-weight:900!important;
    }

    .records-modal,.lesson-screen{
      position:fixed!important;
      inset:0!important;
      z-index:90!important;
      width:100%!important;
      height:100%!important;
    }
    .records-modal{background:rgba(17,21,44,.28)!important;backdrop-filter:none!important}
    .records-dialog{
      width:calc(100% - 20px)!important;
      max-height:calc(100% - 28px)!important;
      border:1px solid var(--line)!important;
      border-radius:20px!important;
      background:#fff!important;
      box-shadow:0 18px 48px rgba(25,30,70,.16)!important;
    }
    .record-summary{grid-template-columns:repeat(2,1fr)!important}
    .records-detail-grid{grid-template-columns:1fr!important}
    .lesson-screen{background:#F7F8FD!important}
    .lesson-header{padding-inline:12px!important;background:#fff!important;border-bottom:1px solid var(--line)!important}
    .lesson-close{border-radius:10px!important;background:#F0EFFF!important;color:var(--blue)!important}
    .lesson-stage{height:auto!important;min-height:0!important;padding:15px 12px 86px!important}
    .lesson-footer{padding:10px 12px calc(10px + env(safe-area-inset-bottom))!important}

    @media(max-width:390px){
      .app-header{min-height:94px!important;padding:8px 9px!important}
      .header-course .course-selectors{grid-template-columns:minmax(98px,.7fr) minmax(0,1.3fr)!important}
      .header-course .language-select,.header-course .level-select{font-size:9px!important}
      .header-course .language-select select,.header-course .level-select select{height:33px!important;font-size:10px!important}
      .scenario-line h3{font-size:18px!important}
      .day-row{grid-template-columns:64px minmax(0,1fr) 64px!important}
      .day-action{width:58px!important;font-size:8.5px!important}
    }

    @media(min-width:700px){
      .app-header{min-height:74px!important}
      .header-controls{grid-template-columns:minmax(0,1fr) auto!important;grid-template-rows:auto!important;gap:10px!important}
      .header-course{grid-column:1!important;grid-row:1!important}
      .header-stats{grid-column:2!important;grid-row:1!important}
      .single-page{display:grid!important;grid-template-columns:minmax(0,1.45fr) minmax(280px,.75fr)!important;gap:10px!important}
      .learning-section{grid-column:1!important;margin:0!important}
      .dashboard-section{grid-column:2!important}
    }

    /* v131 space skin: this block stays inside the component-owned final style. */
    :host{
      --ink:#F7FBFF!important;
      --muted:#9FB4CF!important;
      --line:rgba(159,193,230,.2)!important;
      --blue:#8CDCFF!important;
      background:transparent!important;
      color:#F7FBFF!important;
    }
    .app-shell{background:transparent!important;color:#F7FBFF!important}
    .app-header,.learning-section,.course-panel,.wordbook-section{
      border-color:rgba(159,193,230,.2)!important;
      background:rgba(9,24,49,.94)!important;
      color:#F7FBFF!important;
      box-shadow:0 12px 30px rgba(0,4,18,.27)!important;
    }
    .header-course select,.header-course .language-select select,.header-course .level-select select,
    .streak-chip,.records-button,.day-page-button,.category-tab,.scenario-tab,
    .filter-button,.word-save,.records-close,.reset-button{
      border-color:rgba(159,193,230,.2)!important;
      background:#102342!important;
      color:#CBD8EB!important;
    }
    .header-course label,.day-list-heading span,.day-info p,.scenario-tab small,.word-copy span,
    .empty-state .language-empty-copy-v124{color:#9FB4CF!important}
    .records-button,.category-tab.active,.scenario-tab.active,.filter-button.active{
      border-color:rgba(140,220,255,.42)!important;
      background:#173A5C!important;
      color:#BDEEFF!important;
    }
    .scenario-summary{
      border-color:rgba(140,220,255,.24)!important;
      background:radial-gradient(circle at 88% 22%,rgba(255,255,255,.15) 0 2px,transparent 2.5px),linear-gradient(135deg,#213869,#4E3782 58%,#7259C8)!important;
      color:#FFF!important;
      box-shadow:0 16px 36px rgba(0,4,18,.32)!important;
    }
    .day-list-heading,.day-list,.dashboard-section{background:transparent!important;color:#F7FBFF!important}
    .day-row,.word-row{
      border-color:rgba(159,193,230,.14)!important;
      background:#0D1C38!important;
      color:#F7FBFF!important;
    }
    .day-row.is-current-v124{background:#14294C!important}
    .day-index{border-color:rgba(159,193,230,.16)!important;color:#8CDCFF!important}
    .language-day-status-v124{border-color:#58708F!important;background:#102342!important}
    .day-row.is-locked-v124 .language-day-status-v124{border-color:#344963!important;background:#1A2941!important}
    .day-info b,.day-list-heading h3,.section-heading-row strong,.word-copy strong,.empty-state b{color:#F7FBFF!important}
    .day-action{border-color:rgba(140,220,255,.28)!important;background:#173A5C!important;color:#BDEEFF!important}
    .day-action:disabled{border-color:rgba(159,193,230,.12)!important;background:#13213A!important;color:#687D99!important}
    .category-tab>span:first-child,.scenario-tab>span:first-child,.count-box,.empty-state{
      border-color:rgba(159,193,230,.17)!important;
      background:#102342!important;
      color:#BDEEFF!important;
    }
    .scenario-tab.active>span:first-child{border-color:#8CDCFF!important;background:#8CDCFF!important;color:#071122!important}
    .records-modal{background:rgba(1,5,18,.72)!important;backdrop-filter:blur(10px)!important}
    .records-dialog,.review-panel,.weekly-record,.history-panel{
      border-color:rgba(159,193,230,.18)!important;
      background:#091831!important;
      color:#F7FBFF!important;
    }
    .record-summary>div,.week-bars>div,.history-panel article{
      border-color:rgba(159,193,230,.14)!important;
      background:#102342!important;
      color:#EAF6FF!important;
    }
    .lesson-screen{background:#061126!important;color:#F7FBFF!important}
    .lesson-header,.lesson-footer{border-color:rgba(159,193,230,.18)!important;background:rgba(9,24,49,.97)!important;color:#F7FBFF!important}
    .lesson-heading small{color:#9FB4CF!important}.lesson-heading b{color:#F7FBFF!important}
    .lesson-close,.lesson-count,.footer-secondary,.footer-pass{border-color:rgba(159,193,230,.2)!important;background:#132442!important;color:#CBD8EB!important}
    .lesson-body>*,.lesson-card,.practice-card,.choice-button{border-color:rgba(159,193,230,.18)!important;background:#0D1C38!important;color:#F7FBFF!important}
    input,select,textarea{border-color:rgba(159,193,230,.22)!important;background:#102342!important;color:#F7FBFF!important}

    /* v131.1 brighter observatory surfaces. */
    :host{--line:rgba(183,211,242,.3)!important;background:transparent!important}
    .app-header,.learning-section,.course-panel,.wordbook-section{
      border-color:rgba(183,211,242,.3)!important;
      background:rgba(20,45,82,.94)!important;
      box-shadow:0 13px 32px rgba(5,15,39,.23)!important;
    }
    .header-course select,.header-course .language-select select,.header-course .level-select select,
    .streak-chip,.records-button,.day-page-button,.category-tab,.scenario-tab,
    .filter-button,.word-save,.records-close,.reset-button,
    input,select,textarea{
      border-color:rgba(183,211,242,.3)!important;
      background:#1B3B67!important;
    }
    .day-row,.word-row,.lesson-body>*,.lesson-card,.practice-card,.choice-button{
      border-color:rgba(183,211,242,.22)!important;
      background:#19365F!important;
    }
    .day-row.is-current-v124{background:#214674!important}
    .category-tab>span:first-child,.scenario-tab>span:first-child,.count-box,.empty-state,
    .record-summary>div,.week-bars>div,.history-panel article{
      border-color:rgba(183,211,242,.24)!important;
      background:#1B3B67!important;
    }
    .records-dialog,.review-panel,.weekly-record,.history-panel,
    .lesson-header,.lesson-footer{background:#14305A!important}
    .lesson-screen{background:#102852!important}

    /* v131.2 white and purple component theme. */
    :host{
      --ink:#28203F!important;
      --muted:#746B89!important;
      --line:rgba(111,82,183,.19)!important;
      --blue:#7657D8!important;
      color:#28203F!important;
    }
    .app-shell{color:#28203F!important}
    .app-header,.learning-section,.course-panel,.wordbook-section{
      border-color:rgba(111,82,183,.18)!important;
      background:rgba(255,255,255,.94)!important;
      color:#28203F!important;
      box-shadow:0 14px 34px rgba(75,49,137,.09)!important;
    }
    .header-course select,.header-course .language-select select,.header-course .level-select select,
    .streak-chip,.records-button,.day-page-button,.category-tab,.scenario-tab,
    .filter-button,.word-save,.records-close,.reset-button,input,select,textarea{
      border-color:rgba(111,82,183,.19)!important;
      background:#FAF8FF!important;
      color:#332849!important;
    }
    .header-course label,.day-list-heading span,.day-info p,.scenario-tab small,.word-copy span,
    .empty-state .language-empty-copy-v124{color:#746B89!important}
    .records-button,.category-tab.active,.scenario-tab.active,.filter-button.active{
      border-color:rgba(117,86,216,.3)!important;
      background:#EEE8FF!important;
      color:#6748CF!important;
    }
    .day-list-heading,.day-list,.dashboard-section{color:#28203F!important}
    .day-row,.word-row,.lesson-body>*,.lesson-card,.practice-card,.choice-button{
      border-color:rgba(111,82,183,.15)!important;
      background:#FFF!important;
      color:#332849!important;
    }
    .day-row.is-current-v124{background:#F3EEFF!important}
    .day-index{border-color:rgba(111,82,183,.15)!important;color:#7657D8!important}
    .language-day-status-v124{border-color:#B7A7DF!important;background:#F6F2FF!important}
    .day-info b,.day-list-heading h3,.section-heading-row strong,.word-copy strong,.empty-state b{color:#28203F!important}
    .day-action{border-color:rgba(117,86,216,.25)!important;background:#EEE8FF!important;color:#6748CF!important}
    .day-action:disabled{border-color:rgba(111,82,183,.1)!important;background:#F4F1FA!important;color:#A49BB4!important}
    .category-tab>span:first-child,.scenario-tab>span:first-child,.count-box,.empty-state,
    .record-summary>div,.week-bars>div,.history-panel article{
      border-color:rgba(111,82,183,.15)!important;
      background:#F8F5FF!important;
      color:#5D4B84!important;
    }
    .scenario-tab.active>span:first-child{border-color:#7657D8!important;background:#7657D8!important;color:#FFF!important}
    .records-modal{background:rgba(70,48,124,.24)!important}
    .records-dialog,.review-panel,.weekly-record,.history-panel{
      border-color:rgba(111,82,183,.18)!important;
      background:#FFF!important;
      color:#28203F!important;
    }
    .lesson-screen{background:#F5F2FF!important;color:#28203F!important}
    .lesson-header,.lesson-footer{border-color:rgba(111,82,183,.18)!important;background:rgba(255,255,255,.97)!important;color:#28203F!important}
    .lesson-heading small{color:#746B89!important}.lesson-heading b{color:#28203F!important}
    .lesson-close,.lesson-count,.footer-secondary,.footer-pass{border-color:rgba(111,82,183,.18)!important;background:#F5F1FF!important;color:#5D4B84!important}

    /* v132 readable minimum type. */
    :host{font-size:13px!important}
    small,.section-label,.scenario-tab small,.word-kind,.count-box small{font-size:10px!important;line-height:1.4!important}
    p,.day-info p,.empty-state .language-empty-copy-v124{font-size:11px!important;line-height:1.5!important}
    button,label,input,select,textarea,.category-tab,.scenario-tab,.filter-button{font-size:11px!important}
    .scenario-tab b{font-size:11px!important}
    @media(max-width:390px){
      .header-course .language-select,.header-course .level-select{font-size:10px!important}
      .header-course .language-select select,.header-course .level-select select{font-size:11px!important}
      .day-action{font-size:10px!important}
    }
  `;

  function icon(name) {
    const registry = window.AiderLogCosmicIconsV123;
    if (registry?.icon) return registry.icon(name);
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8"/></svg>';
  }

  function decorateOuter() {
    const view = document.getElementById('language');
    if (!view) return;
    view.classList.add('language-v124');
    const head = view.querySelector('.language-edu-head');
    if (head) {
      const eyebrow = head.querySelector('span');
      const title = head.querySelector('h1');
      const subtitle = head.querySelector('p');
      if (eyebrow) eyebrow.textContent = 'LANGUAGE';
      if (title) title.textContent = 'Language Lab';
      if (subtitle) subtitle.remove();
    }
    decorateShorts(view);
    view.querySelectorAll('aiderlog-language-lab').forEach(enhanceLab);
  }

  function decorateShorts(view) {
    const work = view.querySelector('.al-shorts-work-v118');
    const list = view.querySelector('.al-shorts-list-v118');
    if (work && list && !work.querySelector('.language-saved-head-v124')) {
      const heading = document.createElement('div');
      heading.className = 'language-saved-head-v124';
      heading.innerHTML = '<span>저장된 영어 표현</span><small>최근 저장순</small>';
      work.insertBefore(heading,list);
    }
    const videoEmpty = view.querySelector('.al-shorts-frame-v118>.al-shorts-empty-v118');
    if (videoEmpty && !videoEmpty.querySelector('.language-shorts-play-v124')) {
      const play = document.createElement('span');
      play.className = 'language-shorts-play-v124';
      play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 7 8 5-8 5V7Z"/></svg>';
      videoEmpty.prepend(play);
    }
    const empty = list?.querySelector('.al-shorts-empty-v118');
    if (empty && empty.dataset.languageEmptyV124 !== '1') {
      empty.dataset.languageEmptyV124 = '1';
      empty.innerHTML = '<b>저장한 영어 표현이 없습니다.</b><span>영상을 보며 첫 표현을 저장해보세요.</span>';
    }
    view.querySelectorAll('[data-short-delete]').forEach(button => {
      if (button.dataset.languageIconV124 === '1') return;
      button.dataset.languageIconV124 = '1';
      button.innerHTML = icon('delete');
    });
  }

  function enhanceLab(lab) {
    const root = lab?.shadowRoot;
    if (!root || !root.querySelector('.app-shell')) return;
    if (!root.getElementById(SHADOW_STYLE_ID)) {
      const style = document.createElement('style');
      style.id = SHADOW_STYLE_ID;
      style.textContent = SHADOW_CSS;
      root.appendChild(style);
    }
    const finalStyle = root.getElementById(SHADOW_STYLE_ID);
    if (finalStyle && finalStyle !== root.lastElementChild) root.appendChild(finalStyle);
    decorateShadow(root);
    if (!shadowObservers.has(root)) {
      const observer = new MutationObserver(() => queueShadow(root));
      observer.observe(root,{childList:true,subtree:true});
      shadowObservers.set(root,observer);
    }
  }

  function queueShadow(root) {
    if (queuedRoots.has(root)) return;
    queuedRoots.add(root);
    requestAnimationFrame(() => {
      queuedRoots.delete(root);
      decorateShadow(root);
    });
  }

  function decorateShadow(root) {
    const finalStyle = root.getElementById(SHADOW_STYLE_ID);
    if (finalStyle && finalStyle !== root.lastElementChild) root.appendChild(finalStyle);
    const records = root.getElementById('records-button');
    if (records && !records.querySelector('.language-record-icon-v124')) {
      const host = document.createElement('span');
      host.className = 'language-record-icon-v124';
      host.innerHTML = icon('book');
      records.prepend(host);
    }

    const categoryIcons = ['calendar','travel','profile','archive','settings','task'];
    root.querySelectorAll('.category-tab').forEach((button,index) => {
      if (button.querySelector('.language-category-icon-v124')) return;
      const host = document.createElement('span');
      host.className = 'language-category-icon-v124';
      host.innerHTML = icon(categoryIcons[index] || 'calendar');
      button.prepend(host);
    });

    root.querySelectorAll('.day-row').forEach(row => {
      const action = row.querySelector('.day-action');
      const index = row.querySelector('.day-index');
      const done = !!action?.classList.contains('done');
      const current = !!action?.classList.contains('current');
      const locked = !!action?.disabled;
      row.classList.toggle('is-done-v124',done);
      row.classList.toggle('is-current-v124',current);
      row.classList.toggle('is-locked-v124',locked);
      if (index && !index.querySelector('.language-day-status-v124')) {
        const status = document.createElement('span');
        status.className = 'language-day-status-v124';
        if (done) status.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 6.2 2.1 2.1 4.9-5"/></svg>';
        index.append(status);
      } else if (done) {
        const status = index?.querySelector('.language-day-status-v124');
        if (status && !status.querySelector('svg')) status.innerHTML = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="m2.5 6.2 2.1 2.1 4.9-5"/></svg>';
      }
      if (action && !locked) {
        const expected = done ? '복습하기' : '시작하기';
        if (action.textContent.trim() !== expected) action.textContent = expected;
      }
    });

    root.querySelectorAll('.word-kind').forEach(kind => {
      if (kind.querySelector('.language-word-icon-v124')) return;
      const host = document.createElement('span');
      host.className = 'language-word-icon-v124';
      host.innerHTML = icon('record');
      kind.prepend(host);
    });
    root.querySelectorAll('.listen-button').forEach(button => {
      if (button.dataset.languageIconV124 === '1') return;
      button.dataset.languageIconV124 = '1';
      button.setAttribute('aria-label','발음 듣기');
      button.innerHTML = icon('music');
    });

    const empty = root.querySelector('.word-list .empty-state');
    if (empty && !empty.querySelector('.language-empty-copy-v124')) {
      const copy = document.createElement('p');
      copy.className = 'language-empty-copy-v124';
      copy.textContent = '첫 표현을 저장하고 나만의 단어장을 만들어보세요.';
      const action = empty.querySelector('button');
      empty.insertBefore(copy,action || null);
    }
  }

  let queued = false;
  function queue() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; decorateOuter(); });
  }

  document.addEventListener('language-lab-ready',event => {
    document.getElementById('language')?.classList.add('language-v124');
    enhanceLab(event.target);
  });
  new MutationObserver(queue).observe(document.documentElement,{childList:true,subtree:true});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',queue,{once:true});
  else queue();
})();
