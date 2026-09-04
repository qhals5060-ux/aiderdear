(function () {
  const STYLE_ID = 'aiderlog-my-v115-style';
  let myModeV115 = 'hub';
  let myModalV115 = null;
  let selectedClientV115 = '';
  let brainGameV115 = null;

  const q = selector => document.querySelector(selector);
  const qa = selector => [...document.querySelectorAll(selector)];
  const safe = value => typeof esc === 'function' ? esc(value) : String(value ?? '');
  const nowDate = () => typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);

  const css = `
#fifth .my-page-v115{height:100%!important;min-height:0!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}
#fifth .my-scroll-v115{flex:1 1 auto;min-height:0;overflow-y:auto;padding:2px 2px 28px;scrollbar-width:thin}
#fifth .my-head-v115{margin-bottom:10px;display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
#fifth .my-head-v115 small,#fifth .my-eyebrow-v115{display:block;color:#7066de;font-size:6.5px;font-weight:900;letter-spacing:.14em}
#fifth .my-head-v115 h1{margin:2px 0 0;font-size:26px;letter-spacing:-.04em}
#fifth .my-head-v115 p{margin:4px 0 0;color:#7b8090;font-size:7.5px}
#fifth .my-private-v115{padding:6px 9px;border:1px solid #e3e0ff;border-radius:999px;background:#f5f3ff;color:#5e55c8;font-size:6px;font-weight:900;letter-spacing:.12em}
#fifth .my-summary-v115{margin-bottom:10px;display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
#fifth .my-summary-v115 article{min-height:54px;padding:10px;border:1px solid #e9e9f1;border-radius:15px;background:#fff;box-shadow:0 8px 20px rgba(32,36,70,.04)}
#fifth .my-summary-v115 span{display:block;color:#818697;font-size:6.5px}
#fifth .my-summary-v115 b{display:block;margin-top:5px;font-size:15px}
#fifth .my-tool-grid-v115{display:grid;gap:9px}
#fifth .my-tool-v115{position:relative;width:100%;min-height:128px;padding:15px 16px;overflow:hidden;border:1px solid #e6e7ef;border-radius:22px;background:#fff;text-align:left;box-shadow:0 12px 30px rgba(31,35,67,.06)}
#fifth .my-tool-v115:after{content:'';position:absolute;width:120px;height:120px;right:-36px;top:-40px;border-radius:50%;background:var(--glow,#f0eeff)}
#fifth .my-tool-v115.paper{--accent:#5d54d9;--glow:#efedff}
#fifth .my-tool-v115.task{--accent:#b78516;--glow:#fff4d7}
#fifth .my-tool-v115.brain{--accent:#2e7f8d;--glow:#e4f6f7}
#fifth .my-tool-v115>span{position:relative;z-index:1;color:var(--accent);font-size:6.5px;font-weight:900;letter-spacing:.14em}
#fifth .my-tool-v115 h2{position:relative;z-index:1;margin:5px 0 4px;font-size:21px;letter-spacing:-.03em}
#fifth .my-tool-v115 p{position:relative;z-index:1;max-width:72%;margin:0;color:#74798a;font-size:8px;line-height:1.55}
#fifth .my-tool-v115 footer{position:absolute;z-index:1;left:16px;right:16px;bottom:13px;display:flex;align-items:center;justify-content:space-between;color:#8a8e9c;font-size:6.5px}
#fifth .my-tool-v115 footer b{color:var(--accent);font-size:9px}
#fifth .my-tool-icon-v115{position:absolute!important;z-index:1!important;right:19px;top:20px;width:46px;height:46px;display:grid!important;place-items:center;border-radius:15px;background:#fff!important;color:var(--accent)!important;font-size:20px!important;letter-spacing:0!important;box-shadow:0 8px 20px rgba(50,52,90,.10)}

#fifth .my-subhead-v115{margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;gap:9px}
#fifth .my-subhead-v115>div{min-width:0;display:flex;align-items:center;gap:9px}
#fifth .my-back-v115{width:34px;height:34px;display:grid;place-items:center;flex:0 0 auto;border:1px solid #e1e2eb;border-radius:11px;background:#fff;font-size:18px}
#fifth .my-subhead-v115 small{display:block;color:#7770d8;font-size:6px;font-weight:900;letter-spacing:.13em}
#fifth .my-subhead-v115 h1{margin:2px 0 0;font-size:21px}
#fifth .my-primary-v115,#fifth .my-secondary-v115{min-height:34px;padding:0 11px;border:0;border-radius:11px;background:#6357e6;color:#fff;font-size:8px;font-weight:900}
#fifth .my-secondary-v115{border:1px solid #ddddea;background:#fff;color:#555b6d}
#fifth .my-stat-row-v115{margin-bottom:9px;display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
#fifth .my-stat-v115{padding:10px;border:1px solid #e7e8ef;border-radius:14px;background:#fff}
#fifth .my-stat-v115 span{display:block;color:#858999;font-size:6px}
#fifth .my-stat-v115 b{display:block;margin-top:4px;font-size:15px}
#fifth .my-toolbar-v115{margin-bottom:9px;display:grid;grid-template-columns:minmax(0,1fr) 104px;gap:6px}
#fifth .my-toolbar-v115 input,#fifth .my-toolbar-v115 select,#fifth .my-form-v115 input,#fifth .my-form-v115 select,#fifth .my-form-v115 textarea{width:100%;border:1px solid #dedfe8;border-radius:11px;background:#fff;color:#262a3d;font:inherit}
#fifth .my-toolbar-v115 input,#fifth .my-toolbar-v115 select{height:35px;padding:0 10px;font-size:8px}
#fifth .my-list-v115{display:grid;gap:7px}
#fifth .my-paper-card-v115{width:100%;padding:13px;border:1px solid #e5e6ed;border-radius:16px;background:#fff;text-align:left}
#fifth .my-paper-card-v115 header{display:flex;align-items:center;justify-content:space-between;gap:8px}
#fifth .my-paper-card-v115 header span{padding:4px 7px;border-radius:999px;background:#f0eeff;color:#5d53cf;font-size:6px;font-weight:900}
#fifth .my-paper-card-v115 header b{color:#d49a1b;font-size:8px}
#fifth .my-paper-card-v115 h3{margin:8px 0 3px;font-size:13px;line-height:1.35}
#fifth .my-paper-card-v115>span{display:block;color:#858999;font-size:7px}
#fifth .my-paper-card-v115 p{margin:8px 0 0;color:#666c7d;font-size:8px;line-height:1.55}
#fifth .my-tag-row-v115{margin-top:8px;display:flex;flex-wrap:wrap;gap:4px}
#fifth .my-tag-row-v115 i{padding:4px 6px;border-radius:7px;background:#f5f6f9;color:#747a8c;font-size:6px;font-style:normal}
#fifth .my-empty-v115{padding:32px 15px;border:1px dashed #d8dae5;border-radius:18px;background:#fafafe;text-align:center;color:#7e8394;font-size:8px;line-height:1.6}
#fifth .my-empty-v115 b{display:block;margin-bottom:5px;color:#33384b;font-size:12px}

#fifth .client-strip-v115{margin-bottom:9px;display:flex;gap:6px;overflow-x:auto;padding-bottom:3px;scrollbar-width:thin}
#fifth .client-card-v115{min-width:145px;padding:11px;border:1px solid #e3e4eb;border-radius:15px;background:#fff;text-align:left}
#fifth .client-card-v115.active{border:2px solid #c29423;background:#fffaf0}
#fifth .client-card-v115 b,#fifth .client-card-v115 span,#fifth .client-card-v115 small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#fifth .client-card-v115 b{font-size:10px}.client-card-v115 span{margin-top:3px;color:#787e8e;font-size:7px}.client-card-v115 small{margin-top:5px;color:#b17f13;font-size:6px}
#fifth .client-hero-v115{margin-bottom:9px;padding:14px;border-radius:18px;background:linear-gradient(135deg,#282532,#5a4930);color:#fff}
#fifth .client-hero-v115 header{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}
#fifth .client-hero-v115 small{color:#e8cf98;font-size:6px;letter-spacing:.12em}.client-hero-v115 h2{margin:3px 0;font-size:18px}.client-hero-v115 p{margin:0;color:#e4dfd6;font-size:7.5px;line-height:1.5}
#fifth .client-hero-v115 button{padding:7px 9px;border:1px solid #ffffff50;border-radius:9px;background:#ffffff15;color:#fff;font-size:7px}
#fifth .task-panels-v115{display:grid;grid-template-columns:1fr;gap:8px}
#fifth .task-panel-v115{padding:12px;border:1px solid #e4e5ec;border-radius:17px;background:#fff}
#fifth .task-panel-v115>header{margin-bottom:8px;display:flex;align-items:center;justify-content:space-between}
#fifth .task-panel-v115>header b{font-size:10px}.task-panel-v115>header button{border:0;background:transparent;color:#a9750e;font-size:7px;font-weight:900}
#fifth .task-row-v115{min-height:47px;display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;gap:7px;border-top:1px solid #ececf1}
#fifth .task-row-v115:first-of-type{border-top:0}.task-row-v115 input{width:16px;height:16px;accent-color:#b88718}.task-row-v115 b{display:block;font-size:8.5px}.task-row-v115 span{display:block;margin-top:2px;color:#8a8e9b;font-size:6px}.task-row-v115 time{color:#a27310;font-size:6px;font-weight:900}
#fifth .session-row-v115{padding:9px 0;border-top:1px solid #ececf1}.session-row-v115:first-of-type{border-top:0}.session-row-v115 b{display:block;font-size:8px}.session-row-v115 p{margin:3px 0 0;color:#747a8b;font-size:7px;line-height:1.45}

#fifth .brain-hero-v115{margin-bottom:9px;padding:16px;border-radius:21px;background:linear-gradient(135deg,#123f4d,#2f7885 56%,#62a9a8);color:#fff;box-shadow:0 12px 28px rgba(29,105,117,.18)}
#fifth .brain-hero-v115 header{display:flex;align-items:center;justify-content:space-between}.brain-score-v115{width:64px;height:64px;display:grid;place-items:center;border:1px solid #ffffff55;border-radius:50%;background:#ffffff12}.brain-score-v115 b{font-size:20px}.brain-score-v115 span{font-size:6px}.brain-hero-v115 small{color:#bde6e6;font-size:6.5px;letter-spacing:.14em}.brain-hero-v115 h2{margin:4px 0;font-size:19px}.brain-hero-v115 p{margin:0;max-width:220px;color:#d8eeee;font-size:7.5px;line-height:1.5}
#fifth .brain-ability-v115{margin-bottom:9px;display:grid;grid-template-columns:repeat(2,1fr);gap:6px}
#fifth .brain-ability-v115 article{padding:11px;border:1px solid #e3e7e8;border-radius:15px;background:#fff}.brain-ability-v115 span{display:block;color:#788588;font-size:6.5px}.brain-ability-v115 b{display:block;margin-top:5px;font-size:15px}.brain-ability-v115 i{display:block;height:4px;margin-top:8px;border-radius:99px;background:#e6eff0;overflow:hidden}.brain-ability-v115 i:after{content:'';display:block;width:var(--score);height:100%;background:#3b9297}
#fifth .brain-plan-v115{padding:13px;border:1px solid #e2e7e8;border-radius:18px;background:#fff}.brain-plan-v115>header{margin-bottom:7px;display:flex;justify-content:space-between}.brain-plan-v115>header b{font-size:11px}.brain-plan-v115>header span{color:#37858d;font-size:7px}.brain-plan-row-v115{min-height:43px;display:grid;grid-template-columns:29px minmax(0,1fr) auto;align-items:center;gap:8px;border-top:1px solid #edf0f0}.brain-plan-row-v115:first-of-type{border-top:0}.brain-plan-row-v115>span{width:27px;height:27px;display:grid;place-items:center;border-radius:9px;background:#e9f5f5;color:#28747c;font-size:9px;font-weight:900}.brain-plan-row-v115 b{display:block;font-size:8.5px}.brain-plan-row-v115 small{display:block;margin-top:2px;color:#82898b;font-size:6px}.brain-plan-row-v115>i{color:#3e8b92;font-size:7px;font-style:normal}
#fifth .brain-start-v115{width:100%;min-height:42px;margin-top:9px;border:0;border-radius:13px;background:#2f8188;color:#fff;font-size:9px;font-weight:900}
#fifth .brain-note-v115{margin-top:8px;color:#848a8d;font-size:6.5px;line-height:1.5;text-align:center}
#fifth .brain-profile-v115,#fifth .brain-game-v115{padding:15px;border:1px solid #e1e6e7;border-radius:20px;background:#fff}
#fifth .brain-profile-v115 h2,#fifth .brain-game-v115 h2{margin:4px 0 6px;font-size:18px}.brain-profile-v115 p,#fifth .brain-game-v115>p{margin:0 0 13px;color:#757d80;font-size:8px;line-height:1.6}
#fifth .brain-profile-v115 label{display:block;margin-top:10px;color:#4d5558;font-size:7px;font-weight:900}.brain-profile-v115 select{width:100%;height:40px;margin-top:5px;padding:0 10px;border:1px solid #dce3e4;border-radius:11px;background:#fff;font-size:9px}
#fifth .brain-progress-v115{height:6px;margin-bottom:12px;border-radius:99px;background:#e5eeee;overflow:hidden}.brain-progress-v115 i{display:block;width:var(--progress);height:100%;background:#378b91}
#fifth .memory-sequence-v115{display:flex;justify-content:center;gap:8px;margin:18px 0}.memory-sequence-v115 b{width:47px;height:55px;display:grid;place-items:center;border-radius:13px;background:#eaf5f5;color:#236f76;font-size:21px}
#fifth .brain-keypad-v115{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.brain-keypad-v115 button,#fifth .brain-choice-v115 button,#fifth .focus-grid-v115 button{min-height:45px;border:1px solid #dce3e4;border-radius:12px;background:#fff;color:#283235;font-size:14px;font-weight:900}.brain-keypad-v115 button:disabled,.focus-grid-v115 button.hit{background:#dff2ed;color:#1c7768}
#fifth .brain-picked-v115{min-height:34px;margin:10px 0;padding:9px;border-radius:11px;background:#f3f7f7;color:#2f767b;text-align:center;font-size:9px;font-weight:900}
#fifth .focus-grid-v115{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.focus-grid-v115 button{font-size:18px}.brain-choice-v115{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;margin:18px 0}.brain-choice-v115 button{min-height:76px;font-size:24px}.brain-rule-v115{padding:10px;border-radius:11px;background:#eaf5f5;color:#256f75;text-align:center;font-size:9px;font-weight:900}
#fifth .brain-result-v115{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin:12px 0}.brain-result-v115 article{padding:12px;border:1px solid #e0e6e7;border-radius:13px}.brain-result-v115 span{display:block;color:#768084;font-size:7px}.brain-result-v115 b{display:block;margin-top:5px;font-size:18px}

#fifth .my-modal-v115{position:absolute;z-index:120;inset:0;display:flex;align-items:flex-end;justify-content:center;padding:12px 10px calc(82px + env(safe-area-inset-bottom));background:rgba(26,28,43,.42);backdrop-filter:blur(5px)}
#fifth .my-dialog-v115{width:min(520px,100%);max-height:88%;overflow-y:auto;border-radius:22px;background:#f8f9fc;box-shadow:0 24px 70px rgba(18,20,39,.28)}
#fifth .my-dialog-v115>header{position:sticky;top:0;z-index:2;padding:14px 15px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e4e5ed;background:#fff;border-radius:22px 22px 0 0}.my-dialog-v115>header small{display:block;color:#7167d9;font-size:6px;font-weight:900;letter-spacing:.13em}.my-dialog-v115>header h2{margin:2px 0 0;font-size:17px}.my-dialog-v115>header button{width:32px;height:32px;border:0;border-radius:10px;background:#f0f1f6;font-size:17px}
#fifth .my-form-v115{padding:13px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.my-form-v115 label{display:block;color:#666c7d;font-size:7px;font-weight:800}.my-form-v115 label.wide{grid-column:1/-1}.my-form-v115 input,.my-form-v115 select{height:38px;margin-top:5px;padding:0 10px;font-size:9px}.my-form-v115 textarea{min-height:72px;margin-top:5px;padding:10px;resize:vertical;font-size:9px;line-height:1.5}.my-form-actions-v115{grid-column:1/-1;display:flex;gap:7px;margin-top:2px}.my-form-actions-v115 button{flex:1;min-height:40px;border:0;border-radius:12px;background:#6357e6;color:#fff;font-size:9px;font-weight:900}.my-form-actions-v115 button.secondary{border:1px solid #dedfe8;background:#fff;color:#555b6b}.my-form-actions-v115 button.danger{flex:0 0 auto;padding:0 13px;background:#fff0f0;color:#b74545}
@media(max-width:430px){#fifth .my-form-v115{grid-template-columns:1fr}#fifth .my-form-v115 label.wide,#fifth .my-form-actions-v115{grid-column:1}.my-summary-v115 article{padding:8px}.my-tool-v115{min-height:124px}}
`;

  function installStyleV115() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function dataV115() {
    P.myPapers = Array.isArray(P.myPapers) ? P.myPapers : [];
    P.myTaskClients = Array.isArray(P.myTaskClients) ? P.myTaskClients : [];
    P.myTaskItems = Array.isArray(P.myTaskItems) ? P.myTaskItems : [];
    P.myTaskSessions = Array.isArray(P.myTaskSessions) ? P.myTaskSessions : [];
    P.myBrain = P.myBrain && typeof P.myBrain === 'object' ? P.myBrain : { profile: null, scores: {}, sessions: [] };
    P.myBrain.scores = P.myBrain.scores || {};
    P.myBrain.sessions = Array.isArray(P.myBrain.sessions) ? P.myBrain.sessions : [];
    return P;
  }

  function statusLabelV115(value) {
    return ({ toRead: '읽기 전', reading: '읽는 중', reviewed: '검토 완료' })[value] || '읽기 전';
  }

  function hubHTMLV115() {
    const data = dataV115();
    const pending = data.myTaskItems.filter(row => !row.done).length;
    const brainSessions = data.myBrain.sessions.length;
    return `<div class="page my-page-v115"><div class="my-head-v115"><div><small>PRIVATE WORKSPACE</small><h1>My</h1><p>연구, 업무, 두뇌 훈련을 한곳에서 이어가세요.</p></div><span class="my-private-v115">PRIVATE</span></div><div class="my-scroll-v115"><section class="my-summary-v115"><article><span>PAPERS</span><b>${data.myPapers.length}</b></article><article><span>PENDING</span><b>${pending}</b></article><article><span>BRAIN</span><b>${brainSessions}</b></article></section><section class="my-tool-grid-v115"><button class="my-tool-v115 paper" data-my-open="paper"><span>RESEARCH WORKSPACE</span><i class="my-tool-icon-v115">▤</i><h2>Paper</h2><p>논문 라이브러리, 핵심 인사이트와 연구 노트를 연결합니다.</p><footer><span>${data.myPapers.length} papers</span><b>OPEN →</b></footer></button><button class="my-tool-v115 task" data-my-open="task"><span>CONSULTING DESK</span><i class="my-tool-icon-v115">✓</i><h2>Task</h2><p>고객, 마감 과업과 상담 기록을 한 작업공간에서 관리합니다.</p><footer><span>${data.myTaskClients.length} clients · ${pending} pending</span><b>OPEN →</b></footer></button><button class="my-tool-v115 brain" data-my-open="brain"><span>COGNITIVE TRAINING</span><i class="my-tool-icon-v115">◎</i><h2>Brain Fit</h2><p>기억력, 집중력, 처리속도와 전환 능력을 짧게 훈련합니다.</p><footer><span>${brainSessions ? `최근 ${brainSessions}회` : '기초 테스트부터 시작'}</span><b>START →</b></footer></button></section></div></div>`;
  }

  function paperHTMLV115() {
    const rows = dataV115().myPapers.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const reviewed = rows.filter(row => row.status === 'reviewed').length;
    const insights = rows.filter(row => row.insight?.trim()).length;
    const cards = rows.length ? rows.map(row => `<button class="my-paper-card-v115" data-paper-card data-paper-open="${safe(row.id)}" data-status="${safe(row.status)}" data-search="${safe(`${row.title} ${row.authors} ${row.journal} ${(row.tags || []).join(' ')}`.toLowerCase())}"><header><span>${statusLabelV115(row.status)}</span><b>${'★'.repeat(Number(row.importance) || 1)}</b></header><h3>${safe(row.title || '제목 없는 논문')}</h3><span>${safe(row.authors || '저자 미입력')} · ${safe(row.year || '연도 미입력')} · ${safe(row.journal || '학술지 미입력')}</span><p>${safe(row.summary || row.insight || '요약과 인사이트를 추가해보세요.')}</p><div class="my-tag-row-v115">${(row.tags || []).slice(0, 4).map(tag => `<i>${safe(tag)}</i>`).join('')}</div></button>`).join('') : `<div class="my-empty-v115"><b>첫 논문을 추가해보세요</b>제목, 연구 방법, 핵심 결과와 내 연구에 쓸 인사이트를 함께 기록할 수 있습니다.</div>`;
    return `<div class="page my-page-v115"><div class="my-subhead-v115"><div><button class="my-back-v115" data-my-back>‹</button><div><small>RESEARCH WORKSPACE</small><h1>Paper</h1></div></div><button class="my-primary-v115" data-paper-add>＋ PAPER</button></div><div class="my-scroll-v115"><section class="my-stat-row-v115"><article class="my-stat-v115"><span>LIBRARY</span><b>${rows.length}</b></article><article class="my-stat-v115"><span>REVIEWED</span><b>${reviewed}</b></article><article class="my-stat-v115"><span>INSIGHTS</span><b>${insights}</b></article></section><div class="my-toolbar-v115"><input id="myPaperSearchV115" type="search" placeholder="제목 · 저자 · 태그 검색"><select id="myPaperStatusV115"><option value="">전체 상태</option><option value="toRead">읽기 전</option><option value="reading">읽는 중</option><option value="reviewed">검토 완료</option></select></div><div class="my-list-v115" id="myPaperListV115">${cards}</div></div>${myModalV115 ? modalHTMLV115() : ''}</div>`;
  }

  function taskHTMLV115() {
    const data = dataV115();
    if (!selectedClientV115 || !data.myTaskClients.some(row => row.id === selectedClientV115)) selectedClientV115 = data.myTaskClients[0]?.id || '';
    const selected = data.myTaskClients.find(row => row.id === selectedClientV115);
    const tasks = data.myTaskItems.filter(row => row.clientId === selectedClientV115).sort((a, b) => Number(a.done) - Number(b.done) || String(a.dueDate).localeCompare(String(b.dueDate)));
    const sessions = data.myTaskSessions.filter(row => row.clientId === selectedClientV115).sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const pending = data.myTaskItems.filter(row => !row.done).length;
    const dueSoon = data.myTaskItems.filter(row => !row.done && row.dueDate && row.dueDate <= new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)).length;
    const clientCards = data.myTaskClients.map(row => { const p = data.myTaskItems.filter(x => x.clientId === row.id && !x.done).length; return `<button class="client-card-v115 ${row.id === selectedClientV115 ? 'active' : ''}" data-client-select="${safe(row.id)}"><b>${safe(row.name || '이름 없음')}</b><span>${safe(row.school || row.target || '소속 미입력')}</span><small>${p} PENDING</small></button>`; }).join('');
    const detail = selected ? `<section class="client-hero-v115"><header><div><small>ACTIVE CLIENT</small><h2>${safe(selected.name)}</h2><p>${safe([selected.school, selected.target].filter(Boolean).join(' · ') || '상담 목표를 입력해주세요.')}<br>${selected.nextSession ? `다음 상담 · ${safe(selected.nextSession.replace('T', ' '))}` : '다음 상담 미정'}</p></div><button data-client-edit="${safe(selected.id)}">EDIT</button></header></section><section class="task-panels-v115"><article class="task-panel-v115"><header><b>DELIVERABLES · TASKS</b><button data-task-add>＋ ADD</button></header>${tasks.length ? tasks.map(row => `<label class="task-row-v115"><input type="checkbox" data-task-toggle="${safe(row.id)}" ${row.done ? 'checked' : ''}><div><b>${safe(row.title)}</b><span>${row.done ? '완료됨' : row.dueDate ? `마감 ${safe(row.dueDate)}` : '마감일 없음'}</span></div><time>${row.done ? 'DONE' : safe(row.dueDate?.slice(5) || '—')}</time></label>`).join('') : '<div class="my-empty-v115">고객에게 전달하거나 확인할 과업을 추가하세요.</div>'}</article><article class="task-panel-v115"><header><b>CONSULTING SESSIONS</b><button data-session-add>＋ LOG</button></header>${sessions.length ? sessions.map(row => `<div class="session-row-v115"><b>${safe(row.date?.replace('T', ' ') || '')}</b><p>${safe(row.summary)}</p></div>`).join('') : '<div class="my-empty-v115">상담 내용과 다음 행동을 기록하세요.</div>'}</article></section>` : `<div class="my-empty-v115"><b>첫 고객을 추가해보세요</b>상담 고객별 마감 과업과 상담 기록을 연결할 수 있습니다.</div>`;
    return `<div class="page my-page-v115"><div class="my-subhead-v115"><div><button class="my-back-v115" data-my-back>‹</button><div><small>CONSULTING DESK</small><h1>Task</h1></div></div><button class="my-primary-v115" data-client-add>＋ CLIENT</button></div><div class="my-scroll-v115"><section class="my-stat-row-v115"><article class="my-stat-v115"><span>CLIENTS</span><b>${data.myTaskClients.length}</b></article><article class="my-stat-v115"><span>PENDING</span><b>${pending}</b></article><article class="my-stat-v115"><span>DUE 7D</span><b>${dueSoon}</b></article></section>${clientCards ? `<div class="client-strip-v115">${clientCards}</div>` : ''}${detail}</div>${myModalV115 ? modalHTMLV115() : ''}</div>`;
  }

  function brainHomeHTMLV115() {
    const brain = dataV115().myBrain;
    if (!brain.profile) return `<div class="page my-page-v115"><div class="my-subhead-v115"><div><button class="my-back-v115" data-my-back>‹</button><div><small>COGNITIVE TRAINING</small><h1>Brain Fit</h1></div></div></div><div class="my-scroll-v115"><form class="brain-profile-v115" id="brainProfileFormV115"><span class="my-eyebrow-v115">START SETUP · 1 / 4</span><h2>나에게 맞는 훈련을 준비합니다</h2><p>연령대는 초기 난이도의 참고값으로만 사용하고, 실제 난이도는 문제 수행 결과를 중심으로 조정합니다.</p><label>연령대<select id="brainAgeV115" required><option value="">선택해주세요</option><option value="20">20~29세</option><option value="30">30~39세</option><option value="40">40~49세</option><option value="50">50~59세</option><option value="60">60~69세</option><option value="70">70세 이상</option></select></label><label>성별 · 선택 사항<select id="brainGenderV115"><option value="skip">응답하지 않음</option><option value="female">여성</option><option value="male">남성</option><option value="other">기타</option></select></label><button class="brain-start-v115" type="submit">기초 테스트 시작</button><div class="brain-note-v115">의료 진단이 아닌 개인 훈련 난이도 설정용 미니 테스트입니다.</div></form></div></div>`;
    const scores = brain.scores || {};
    const average = Math.round(['memory', 'focus', 'speed', 'switch'].reduce((sum, key) => sum + (Number(scores[key]) || 0), 0) / 4) || 0;
    const abilities = [['memory', '기억력'], ['focus', '집중력'], ['speed', '처리속도'], ['switch', '전환 능력']];
    return `<div class="page my-page-v115"><div class="my-subhead-v115"><div><button class="my-back-v115" data-my-back>‹</button><div><small>COGNITIVE TRAINING</small><h1>Brain Fit</h1></div></div><button class="my-secondary-v115" data-brain-reset>재설정</button></div><div class="my-scroll-v115"><section class="brain-hero-v115"><header><div><small>YOUR BRAIN TODAY</small><h2>${average ? '맞춤 훈련이 준비됐어요' : '기초 테스트를 시작해보세요'}</h2><p>네 가지 인지 영역을 짧고 반복 가능한 문제로 훈련합니다.</p></div><div class="brain-score-v115"><div><b>${average || '—'}</b><span>SCORE</span></div></div></header></section><section class="brain-ability-v115">${abilities.map(([key, label]) => `<article><span>${label}</span><b>${Number(scores[key]) || 0}</b><i style="--score:${Number(scores[key]) || 0}%"></i></article>`).join('')}</section><section class="brain-plan-v115"><header><b>오늘의 15분 훈련</b><span>자동 난이도</span></header>${[['1', '순서 기억', '기억력'], ['2', '목표 찾기', '집중력'], ['3', '빠른 비교', '처리속도'], ['4', '규칙 전환', '실행기능']].map(row => `<div class="brain-plan-row-v115"><span>${row[0]}</span><div><b>${row[1]}</b><small>${row[2]} · 약 3~4분</small></div><i>READY</i></div>`).join('')}</section><button class="brain-start-v115" data-brain-start>${average ? '맞춤 트레이닝 시작' : '기초 테스트 시작'}</button><div class="brain-note-v115">결과는 의료적 판단이나 인지 기능 진단을 대신하지 않습니다.</div></div></div>`;
  }

  function gameHTMLV115() {
    const game = brainGameV115;
    const stepMap = { memoryShow: 1, memoryPick: 1, focus: 2, speed: 3, switch: 4, result: 4 };
    const step = stepMap[game.stage] || 1;
    let body = '';
    if (game.stage === 'memoryShow') body = `<span class="my-eyebrow-v115">1 · 기억력</span><h2>숫자 순서를 기억하세요</h2><p>순서대로 기억한 뒤 버튼을 눌러 숫자를 가립니다.</p><div class="memory-sequence-v115">${game.sequence.map(value => `<b>${value}</b>`).join('')}</div><button class="brain-start-v115" data-memory-hide>기억했어요</button>`;
    if (game.stage === 'memoryPick') body = `<span class="my-eyebrow-v115">1 · 기억력</span><h2>기억한 순서대로 선택하세요</h2><p>네 개의 숫자를 순서대로 눌러주세요.</p><div class="brain-picked-v115">${game.picked.length ? game.picked.join(' → ') : '선택을 시작하세요'}</div><div class="brain-keypad-v115">${[1,2,3,4,5,6,7,8,9].map(value => `<button data-memory-key="${value}">${value}</button>`).join('')}</div>`;
    if (game.stage === 'focus') body = `<span class="my-eyebrow-v115">2 · 집중력</span><h2>숫자 5를 모두 찾으세요</h2><p>다른 숫자 사이에 있는 5를 세 개 찾아 선택하세요.</p><div class="focus-grid-v115">${game.focusGrid.map((value, index) => `<button data-focus-key="${index}" class="${game.focusHits.includes(index) ? 'hit' : ''}" ${game.focusHits.includes(index) ? 'disabled' : ''}>${value}</button>`).join('')}</div><div class="brain-picked-v115">찾은 목표 ${game.focusHits.length} / 3 · 실수 ${game.focusWrong}</div>${game.focusHits.length === 3 ? '<button class="brain-start-v115" data-brain-next="speed">다음 테스트</button>' : ''}`;
    if (game.stage === 'speed') { const pair = game.speedPairs[game.round]; body = `<span class="my-eyebrow-v115">3 · 처리속도</span><h2>더 큰 숫자를 빠르게 고르세요</h2><p>문제 ${game.round + 1} / ${game.speedPairs.length}</p><div class="brain-choice-v115"><button data-speed-pick="${pair[0]}">${pair[0]}</button><button data-speed-pick="${pair[1]}">${pair[1]}</button></div>`; }
    if (game.stage === 'switch') { const item = game.switchPairs[game.round]; body = `<span class="my-eyebrow-v115">4 · 전환 능력</span><h2>규칙에 맞는 숫자를 고르세요</h2><div class="brain-rule-v115">이번 규칙 · ${item.rule === 'max' ? '더 큰 숫자' : '더 작은 숫자'}</div><div class="brain-choice-v115"><button data-switch-pick="${item.values[0]}">${item.values[0]}</button><button data-switch-pick="${item.values[1]}">${item.values[1]}</button></div><p>문제 ${game.round + 1} / ${game.switchPairs.length}</p>`; }
    if (game.stage === 'result') { const result = game.result; body = `<span class="my-eyebrow-v115">RESULT</span><h2>오늘의 뇌 훈련 결과</h2><p>평균 ${result.average}점입니다. 다음 훈련은 현재 결과를 기준으로 시작합니다.</p><div class="brain-result-v115">${[['기억력',result.memory],['집중력',result.focus],['처리속도',result.speed],['전환 능력',result.switch]].map(row => `<article><span>${row[0]}</span><b>${row[1]}</b></article>`).join('')}</div><button class="brain-start-v115" data-brain-finish>결과 저장하고 돌아가기</button>`; }
    return `<div class="page my-page-v115"><div class="my-subhead-v115"><div><button class="my-back-v115" data-brain-exit>‹</button><div><small>BRAIN SESSION</small><h1>Brain Fit</h1></div></div><span class="my-private-v115">${step} / 4</span></div><div class="my-scroll-v115"><section class="brain-game-v115"><div class="brain-progress-v115"><i style="--progress:${step * 25}%"></i></div>${body}</section></div></div>`;
  }

  function brainHTMLV115() {
    return brainGameV115 ? gameHTMLV115() : brainHomeHTMLV115();
  }

  function modalHTMLV115() {
    const data = dataV115();
    if (myModalV115.type === 'paper') {
      const row = data.myPapers.find(item => item.id === myModalV115.id) || {};
      return `<div class="my-modal-v115"><section class="my-dialog-v115"><header><div><small>PAPER LIBRARY</small><h2>${row.id ? '논문 수정' : '논문 추가'}</h2></div><button data-modal-close>×</button></header><form class="my-form-v115" id="paperFormV115"><label class="wide">논문 제목<input id="paperTitleV115" value="${safe(row.title || '')}" required></label><label>저자<input id="paperAuthorsV115" value="${safe(row.authors || '')}"></label><label>연도<input id="paperYearV115" type="number" min="0" max="2200" value="${safe(row.year || '')}"></label><label>학술지<input id="paperJournalV115" value="${safe(row.journal || '')}"></label><label>연구 방법<input id="paperMethodV115" value="${safe(row.method || '')}"></label><label>상태<select id="paperStatusV115"><option value="toRead" ${row.status === 'toRead' ? 'selected' : ''}>읽기 전</option><option value="reading" ${row.status === 'reading' ? 'selected' : ''}>읽는 중</option><option value="reviewed" ${row.status === 'reviewed' ? 'selected' : ''}>검토 완료</option></select></label><label>중요도<select id="paperImportanceV115">${[1,2,3].map(value => `<option value="${value}" ${Number(row.importance || 2) === value ? 'selected' : ''}>${'★'.repeat(value)}</option>`).join('')}</select></label><label class="wide">태그<input id="paperTagsV115" value="${safe((row.tags || []).join(', '))}" placeholder="방법론, 주제, 이론"></label><label class="wide">3줄 요약<textarea id="paperSummaryV115">${safe(row.summary || '')}</textarea></label><label class="wide">핵심 인사이트<textarea id="paperInsightV115">${safe(row.insight || '')}</textarea></label><label class="wide">내 연구에 연결할 노트<textarea id="paperNoteV115">${safe(row.note || '')}</textarea></label><div class="my-form-actions-v115">${row.id ? '<button type="button" class="danger" data-paper-delete>삭제</button>' : ''}<button type="button" class="secondary" data-modal-close>취소</button><button type="submit">저장</button></div></form></section></div>`;
    }
    if (myModalV115.type === 'client') {
      const row = data.myTaskClients.find(item => item.id === myModalV115.id) || {};
      return `<div class="my-modal-v115"><section class="my-dialog-v115"><header><div><small>CONSULTING CLIENT</small><h2>${row.id ? '고객 수정' : '고객 추가'}</h2></div><button data-modal-close>×</button></header><form class="my-form-v115" id="clientFormV115"><label>이름<input id="clientNameV115" value="${safe(row.name || '')}" required></label><label>학교·기관<input id="clientSchoolV115" value="${safe(row.school || '')}"></label><label class="wide">목표 대학원·과정<input id="clientTargetV115" value="${safe(row.target || '')}"></label><label class="wide">다음 상담<input id="clientNextV115" type="datetime-local" value="${safe(row.nextSession || '')}"></label><label class="wide">고객 메모<textarea id="clientNoteV115">${safe(row.note || '')}</textarea></label><div class="my-form-actions-v115">${row.id ? '<button type="button" class="danger" data-client-delete>삭제</button>' : ''}<button type="button" class="secondary" data-modal-close>취소</button><button type="submit">저장</button></div></form></section></div>`;
    }
    if (myModalV115.type === 'task') return `<div class="my-modal-v115"><section class="my-dialog-v115"><header><div><small>DELIVERABLE</small><h2>과업 추가</h2></div><button data-modal-close>×</button></header><form class="my-form-v115" id="taskFormV115"><label class="wide">과업<input id="taskTitleV115" required placeholder="전달하거나 확인할 일"></label><label class="wide">마감일<input id="taskDueV115" type="date"></label><div class="my-form-actions-v115"><button type="button" class="secondary" data-modal-close>취소</button><button type="submit">추가</button></div></form></section></div>`;
    if (myModalV115.type === 'session') return `<div class="my-modal-v115"><section class="my-dialog-v115"><header><div><small>CONSULTING LOG</small><h2>상담 기록</h2></div><button data-modal-close>×</button></header><form class="my-form-v115" id="sessionFormV115"><label class="wide">상담 일시<input id="sessionDateV115" type="datetime-local" value="${new Date().toISOString().slice(0, 16)}"></label><label class="wide">상담 내용과 다음 행동<textarea id="sessionSummaryV115" required></textarea></label><div class="my-form-actions-v115"><button type="button" class="secondary" data-modal-close>취소</button><button type="submit">저장</button></div></form></section></div>`;
    return '';
  }

  function renderMyV115() {
    installStyleV115();
    dataV115();
    const host = q('#fifth');
    if (!host) return;
    if (q('#fifthLabel')) q('#fifthLabel').textContent = 'My';
    host.innerHTML = myModeV115 === 'paper' ? paperHTMLV115() : myModeV115 === 'task' ? taskHTMLV115() : myModeV115 === 'brain' ? brainHTMLV115() : hubHTMLV115();
    bindMyV115();
  }

  async function persistV115() {
    if (typeof savePrivate === 'function') await savePrivate();
  }

  function startBrainV115() {
    const sequence = Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 9));
    brainGameV115 = {
      stage: 'memoryShow', sequence, picked: [], memoryCorrect: 0,
      focusGrid: [3,5,8,2,5,7,1,9,5], focusHits: [], focusWrong: 0,
      speedPairs: [[47,39],[52,68],[36,44]], switchPairs: [
        { rule: 'max', values: [24,71] }, { rule: 'min', values: [83,46] }, { rule: 'max', values: [35,62] }
      ], round: 0, speedCorrect: 0, switchCorrect: 0
    };
    renderMyV115();
  }

  function finishBrainGameV115() {
    const game = brainGameV115;
    const memory = Math.round(game.memoryCorrect / game.sequence.length * 100);
    const focus = Math.max(0, Math.round((3 / Math.max(3, 3 + game.focusWrong)) * 100));
    const speed = Math.round(game.speedCorrect / game.speedPairs.length * 100);
    const switchScore = Math.round(game.switchCorrect / game.switchPairs.length * 100);
    game.result = { memory, focus, speed, switch: switchScore, average: Math.round((memory + focus + speed + switchScore) / 4) };
    game.stage = 'result';
  }

  function bindPaperFilterV115() {
    const search = q('#myPaperSearchV115'), status = q('#myPaperStatusV115');
    const apply = () => {
      const query = (search?.value || '').trim().toLowerCase(), value = status?.value || '';
      qa('[data-paper-card]').forEach(card => {
        card.hidden = !!((query && !card.dataset.search.includes(query)) || (value && card.dataset.status !== value));
      });
    };
    if (search) search.oninput = apply;
    if (status) status.onchange = apply;
  }

  function bindMyV115() {
    qa('[data-my-open]').forEach(button => button.onclick = () => { myModeV115 = button.dataset.myOpen; myModalV115 = null; brainGameV115 = null; renderMyV115(); });
    qa('[data-my-back]').forEach(button => button.onclick = () => { myModeV115 = 'hub'; myModalV115 = null; brainGameV115 = null; renderMyV115(); });
    qa('[data-modal-close]').forEach(button => button.onclick = () => { myModalV115 = null; renderMyV115(); });

    const paperAdd = q('[data-paper-add]'); if (paperAdd) paperAdd.onclick = () => { myModalV115 = { type: 'paper', id: '' }; renderMyV115(); };
    qa('[data-paper-open]').forEach(button => button.onclick = () => { myModalV115 = { type: 'paper', id: button.dataset.paperOpen }; renderMyV115(); });
    bindPaperFilterV115();
    const paperForm = q('#paperFormV115'); if (paperForm) paperForm.onsubmit = async event => {
      event.preventDefault(); const data = dataV115(), existing = data.myPapers.find(row => row.id === myModalV115.id), row = {
        id: existing?.id || `paper-${Date.now()}`, title: q('#paperTitleV115').value.trim(), authors: q('#paperAuthorsV115').value.trim(), year: q('#paperYearV115').value,
        journal: q('#paperJournalV115').value.trim(), method: q('#paperMethodV115').value.trim(), status: q('#paperStatusV115').value, importance: Number(q('#paperImportanceV115').value) || 1,
        tags: q('#paperTagsV115').value.split(',').map(value => value.trim()).filter(Boolean), summary: q('#paperSummaryV115').value.trim(), insight: q('#paperInsightV115').value.trim(), note: q('#paperNoteV115').value.trim(),
        createdAt: existing?.createdAt || Date.now(), updatedAt: Date.now()
      }; if (!row.title) return; if (existing) data.myPapers.splice(data.myPapers.indexOf(existing), 1, row); else data.myPapers.push(row); myModalV115 = null; await persistV115(); renderMyV115();
    };
    const paperDelete = q('[data-paper-delete]'); if (paperDelete) paperDelete.onclick = async () => { dataV115().myPapers = dataV115().myPapers.filter(row => row.id !== myModalV115.id); myModalV115 = null; await persistV115(); renderMyV115(); };

    const clientAdd = q('[data-client-add]'); if (clientAdd) clientAdd.onclick = () => { myModalV115 = { type: 'client', id: '' }; renderMyV115(); };
    qa('[data-client-select]').forEach(button => button.onclick = () => { selectedClientV115 = button.dataset.clientSelect; renderMyV115(); });
    qa('[data-client-edit]').forEach(button => button.onclick = () => { myModalV115 = { type: 'client', id: button.dataset.clientEdit }; renderMyV115(); });
    const clientForm = q('#clientFormV115'); if (clientForm) clientForm.onsubmit = async event => {
      event.preventDefault(); const data = dataV115(), existing = data.myTaskClients.find(row => row.id === myModalV115.id), row = { id: existing?.id || `client-${Date.now()}`, name: q('#clientNameV115').value.trim(), school: q('#clientSchoolV115').value.trim(), target: q('#clientTargetV115').value.trim(), nextSession: q('#clientNextV115').value, note: q('#clientNoteV115').value.trim(), createdAt: existing?.createdAt || Date.now(), updatedAt: Date.now() };
      if (!row.name) return; if (existing) data.myTaskClients.splice(data.myTaskClients.indexOf(existing), 1, row); else data.myTaskClients.push(row); selectedClientV115 = row.id; myModalV115 = null; await persistV115(); renderMyV115();
    };
    const clientDelete = q('[data-client-delete]'); if (clientDelete) clientDelete.onclick = async () => { const data = dataV115(), id = myModalV115.id; data.myTaskClients = data.myTaskClients.filter(row => row.id !== id); data.myTaskItems = data.myTaskItems.filter(row => row.clientId !== id); data.myTaskSessions = data.myTaskSessions.filter(row => row.clientId !== id); selectedClientV115 = data.myTaskClients[0]?.id || ''; myModalV115 = null; await persistV115(); renderMyV115(); };
    const taskAdd = q('[data-task-add]'); if (taskAdd) taskAdd.onclick = () => { myModalV115 = { type: 'task' }; renderMyV115(); };
    const taskForm = q('#taskFormV115'); if (taskForm) taskForm.onsubmit = async event => { event.preventDefault(); const title = q('#taskTitleV115').value.trim(); if (!title) return; dataV115().myTaskItems.push({ id: `task-${Date.now()}`, clientId: selectedClientV115, title, dueDate: q('#taskDueV115').value, done: false, createdAt: Date.now() }); myModalV115 = null; await persistV115(); renderMyV115(); };
    qa('[data-task-toggle]').forEach(input => input.onchange = async () => { const row = dataV115().myTaskItems.find(item => item.id === input.dataset.taskToggle); if (!row) return; row.done = input.checked; row.completedAt = input.checked ? Date.now() : 0; await persistV115(); renderMyV115(); });
    const sessionAdd = q('[data-session-add]'); if (sessionAdd) sessionAdd.onclick = () => { myModalV115 = { type: 'session' }; renderMyV115(); };
    const sessionForm = q('#sessionFormV115'); if (sessionForm) sessionForm.onsubmit = async event => { event.preventDefault(); const summary = q('#sessionSummaryV115').value.trim(); if (!summary) return; dataV115().myTaskSessions.push({ id: `session-${Date.now()}`, clientId: selectedClientV115, date: q('#sessionDateV115').value, summary, createdAt: Date.now() }); myModalV115 = null; await persistV115(); renderMyV115(); };

    const profileForm = q('#brainProfileFormV115'); if (profileForm) profileForm.onsubmit = async event => { event.preventDefault(); const age = q('#brainAgeV115').value; if (!age) return; dataV115().myBrain.profile = { age, gender: q('#brainGenderV115').value, createdAt: Date.now() }; await persistV115(); startBrainV115(); };
    const brainStart = q('[data-brain-start]'); if (brainStart) brainStart.onclick = startBrainV115;
    const brainReset = q('[data-brain-reset]'); if (brainReset) brainReset.onclick = async () => { dataV115().myBrain = { profile: null, scores: {}, sessions: [] }; await persistV115(); renderMyV115(); };
    const brainExit = q('[data-brain-exit]'); if (brainExit) brainExit.onclick = () => { brainGameV115 = null; renderMyV115(); };
    const memoryHide = q('[data-memory-hide]'); if (memoryHide) memoryHide.onclick = () => { brainGameV115.stage = 'memoryPick'; renderMyV115(); };
    qa('[data-memory-key]').forEach(button => button.onclick = () => { const game = brainGameV115; if (game.picked.length >= game.sequence.length) return; game.picked.push(Number(button.dataset.memoryKey)); if (game.picked.length === game.sequence.length) { game.memoryCorrect = game.picked.reduce((sum, value, index) => sum + (value === game.sequence[index] ? 1 : 0), 0); game.stage = 'focus'; } renderMyV115(); });
    qa('[data-focus-key]').forEach(button => button.onclick = () => { const game = brainGameV115, index = Number(button.dataset.focusKey); if (game.focusGrid[index] === 5) game.focusHits.push(index); else game.focusWrong += 1; renderMyV115(); });
    const nextSpeed = q('[data-brain-next="speed"]'); if (nextSpeed) nextSpeed.onclick = () => { brainGameV115.stage = 'speed'; brainGameV115.round = 0; renderMyV115(); };
    qa('[data-speed-pick]').forEach(button => button.onclick = () => { const game = brainGameV115, pair = game.speedPairs[game.round]; if (Number(button.dataset.speedPick) === Math.max(...pair)) game.speedCorrect += 1; game.round += 1; if (game.round >= game.speedPairs.length) { game.stage = 'switch'; game.round = 0; } renderMyV115(); });
    qa('[data-switch-pick]').forEach(button => button.onclick = () => { const game = brainGameV115, item = game.switchPairs[game.round], target = item.rule === 'max' ? Math.max(...item.values) : Math.min(...item.values); if (Number(button.dataset.switchPick) === target) game.switchCorrect += 1; game.round += 1; if (game.round >= game.switchPairs.length) finishBrainGameV115(); renderMyV115(); });
    const brainFinish = q('[data-brain-finish]'); if (brainFinish) brainFinish.onclick = async () => { const brain = dataV115().myBrain, result = brainGameV115.result; brain.scores = { memory: result.memory, focus: result.focus, speed: result.speed, switch: result.switch }; brain.sessions.push({ id: `brain-${Date.now()}`, date: nowDate(), ...result, completedAt: Date.now() }); brainGameV115 = null; await persistV115(); renderMyV115(); };
  }

  installStyleV115();
  const previousRenderPersonal = window.renderPersonal;
  if (typeof previousRenderPersonal === 'function') window.renderPersonal = function () { const result = previousRenderPersonal.apply(this, arguments); renderMyV115(); return result; };
  const previousResetPageEntry = window.resetPageEntry;
  if (typeof previousResetPageEntry === 'function') window.resetPageEntry = function (id) { const result = previousResetPageEntry.apply(this, arguments); if (id === 'fifth') { myModeV115 = 'hub'; myModalV115 = null; brainGameV115 = null; } return result; };
  window.renderMyV115 = renderMyV115;
  setTimeout(renderMyV115, 0);
})();
