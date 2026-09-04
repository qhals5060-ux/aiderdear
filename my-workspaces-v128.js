(function () {
  'use strict';

  let mode = 'hub';
  let selectedClientId = '';
  let modal = null;
  let speechState = 'ready';
  let speechRecorder = null;
  let speechStream = null;
  let speechChunks = [];
  let speechBlob = null;
  let speechObjectUrl = '';
  let speechStartedAt = 0;
  let speechTimer = null;
  let speechRecognition = null;
  let speechTranscript = '';
  let speechElapsed = 0;
  let sharedWorkspaceStop = null;
  let sharedWorkspaceLoading = false;

  const q = (selector, root = document) => root.querySelector(selector);
  const qa = (selector, root = document) => [...root.querySelectorAll(selector)];
  const safe = value => typeof esc === 'function' ? esc(value) : String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const dateKey = () => typeof today === 'function' ? today() : new Date().toISOString().slice(0, 10);
  const uid = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const previewMode = () => /^(?:localhost|127\.0\.0\.1)$/.test(location.hostname) && (new URLSearchParams(location.search).has('preview') || new URLSearchParams(location.search).get('android-preview') === '1');
  const currentEmail = () => String((typeof authState !== 'undefined' && authState?.user?.email) || window.AiderDearFirebase?.getState?.().user?.email || '').trim().toLowerCase();
  const currentUid = () => String((typeof authState !== 'undefined' && authState?.user?.uid) || window.AiderDearFirebase?.getState?.().user?.uid || '').trim();
  const canUsePaper = () => previewMode() || ['qhals5060@gmail.com','aidway55@gmail.com'].includes(currentEmail());
  const canUseWork = () => previewMode() || ['qhals5060@gmail.com','aidway55@gmail.com'].includes(currentEmail());

  const icon = (name, size = 24) => {
    const paths = {
      back:'<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
      paper:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/><circle cx="17.5" cy="17.5" r="2.5"/>',
      task:'<path d="M9 5h10M9 12h10M9 19h10"/><path d="m3 5 1.5 1.5L7 3.8M3 12l1.5 1.5L7 10.8M3 19l1.5 1.5L7 17.8"/>',
      speech:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/><circle cx="18.5" cy="4.5" r="1.2"/>',
      brain:'<path d="M9.5 4.5A3.5 3.5 0 0 0 6 8v1a3 3 0 0 0-1 5.8V16a4 4 0 0 0 4 4h1V4.5zM14.5 4.5A3.5 3.5 0 0 1 18 8v1a3 3 0 0 1 1 5.8V16a4 4 0 0 1-4 4h-1V4.5z"/><path d="M10 9H8M14 9h2M10 15H8M14 15h2"/>',
      plus:'<path d="M12 5v14M5 12h14"/>',
      search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      close:'<path d="m6 6 12 12M18 6 6 18"/>',
      calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>',
      file:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4"/>',
      play:'<path d="m9 7 8 5-8 5z"/>',
      stop:'<rect x="7" y="7" width="10" height="10" rx="2"/>',
      save:'<path d="M5 4h12l2 2v14H5z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>',
      edit:'<path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10z"/><path d="m14 7 3 3"/>',
      trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
      star:'<path d="m12 3 2.2 5.2L20 10l-4.4 3.7.9 5.8-4.5-3-4.5 3 .9-5.8L4 10l5.8-1.8z"/>'
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.star}</svg>`;
  };

  function ensureData() {
    P.paperItems = Array.isArray(P.paperItems) ? P.paperItems : [];
    P.researchInsights = Array.isArray(P.researchInsights) ? P.researchInsights : [];
    P.researchNotes = Array.isArray(P.researchNotes) ? P.researchNotes : [];
    P.researchIdeas = Array.isArray(P.researchIdeas) ? P.researchIdeas : [];
    P.researchDesigns = Array.isArray(P.researchDesigns) ? P.researchDesigns : [];
    P.researchComparisons = Array.isArray(P.researchComparisons) ? P.researchComparisons : [];
    P.researchConnections = Array.isArray(P.researchConnections) ? P.researchConnections : [];
    P.consultingClients = Array.isArray(P.consultingClients) ? P.consultingClients : [];
    P.consultingTasks = Array.isArray(P.consultingTasks) ? P.consultingTasks : [];
    P.consultingSessions = Array.isArray(P.consultingSessions) ? P.consultingSessions : [];
    P.consultingFiles = Array.isArray(P.consultingFiles) ? P.consultingFiles : [];
    P.paperAnalyses = P.paperAnalyses && typeof P.paperAnalyses === 'object' ? P.paperAnalyses : {};
    P.speechTrainingSessions = Array.isArray(P.speechTrainingSessions) ? P.speechTrainingSessions : [];
    P.speechTrainingSettings = P.speechTrainingSettings && typeof P.speechTrainingSettings === 'object' ? P.speechTrainingSettings : { mode:'presentation', goalSeconds:60, script:'' };
    P.myBrain = P.myBrain && typeof P.myBrain === 'object' ? P.myBrain : { profile:null, scores:{}, sessions:[] };
    P.myBrain.sessions = Array.isArray(P.myBrain.sessions) ? P.myBrain.sessions : [];
    if (!P.paperItems.length && Array.isArray(P.myPapers) && P.myPapers.length) {
      P.paperItems = P.myPapers.map(row => ({ ...row, keywords:row.tags || [], findings:row.insight || '', researchConnection:row.note || '' }));
    }
    if (!P.consultingClients.length && Array.isArray(P.myTaskClients) && P.myTaskClients.length) {
      P.consultingClients = P.myTaskClients.map(row => ({ ...row, currentSchool:row.school || '', targetUniversity:row.target || '', stage:'inquiry', admissionResult:'pending' }));
    }
    if (!P.consultingTasks.length && Array.isArray(P.myTaskItems)) P.consultingTasks = P.myTaskItems.map(row => ({ ...row }));
    if (!P.consultingSessions.length && Array.isArray(P.myTaskSessions)) P.consultingSessions = P.myTaskSessions.map(row => ({ ...row }));
    return P;
  }

  async function persist(message = '') {
    ensureData();
    if (typeof savePrivate === 'function') await savePrivate();
    if (message && typeof toast === 'function') toast(message);
  }

  function mergeSharedRows(localRows, remoteRows) {
    const rows = new Map();
    (Array.isArray(localRows) ? localRows : []).forEach((row, index) => rows.set(String(row?.id || `local-${index}`), row));
    (Array.isArray(remoteRows) ? remoteRows : []).forEach((row, index) => rows.set(String(row?.id || `remote-${index}`), row));
    return [...rows.values()];
  }

  function applySharedWorkspace(remote) {
    if (!remote || typeof remote !== 'object') return false;
    ensureData();
    /* v145: Paper and Task are private, per-account workspaces.  The former
       shared document is read exactly once only to rescue pre-v145 records. */
    if (P.paperTaskPrivateMigrationV145) return false;
    const keys = ['paperItems','researchInsights','researchNotes','researchIdeas','researchDesigns',
      'researchComparisons','researchConnections','consultingClients','consultingTasks',
      'consultingSessions','consultingFiles'];
    const uidNow=currentUid(),emailNow=currentEmail();
    const belongsToCurrentAccount=row=>{
      const ownerUid=String(row?.ownerUid||row?.createdBy||row?.userUid||row?.uid||'').trim();
      const ownerEmail=String(row?.ownerEmail||row?.createdByEmail||row?.userEmail||row?.email||'').trim().toLowerCase();
      return Boolean((uidNow&&ownerUid===uidNow)||(emailNow&&ownerEmail===emailNow));
    };
    let changed = false;
    keys.forEach(key => {
      if (!Array.isArray(remote[key])) return;
      const ownedLegacyRows=remote[key].filter(belongsToCurrentAccount);
      const merged = (P[key]?.length ? P[key] : mergeSharedRows(P[key], ownedLegacyRows));
      if (JSON.stringify(merged) !== JSON.stringify(P[key])) {
        P[key] = merged;
        changed = true;
      }
    });
    if (remote.researchWorkspaceSeeded && !P.researchWorkspaceSeeded && !P.paperItems.length) {
      P.researchWorkspaceSeeded = true;
      changed = true;
    }
    P.paperTaskPrivateMigrationV145 = true;
    changed = true;
    return changed;
  }

  async function connectSharedWorkspace() {
    if (sharedWorkspaceLoading) return;
    const api = window.AiderDearFirebase || (typeof fb !== 'undefined' ? fb : null);
    const signedIn = typeof authState !== 'undefined' && authState?.user;
    if (!api?.readPaperTaskData || !signedIn) return;
    sharedWorkspaceLoading = true;
    try {
      const remote = await api.readPaperTaskData();
      if (applySharedWorkspace(remote)) {
        if (typeof savePrivate === 'function') await savePrivate();
        if (q('#fifth')?.classList.contains('on')) renderMy();
      }
    } catch (error) {
      console.warn('PAPER · TASK legacy migration skipped', error);
    } finally {
      sharedWorkspaceLoading = false;
    }
  }

  function installPaperBridge() {
    window.AiderPaperBridge = {
      snapshot() {
        const data = ensureData();
        return structuredClone({
          paperItems:data.paperItems, researchInsights:data.researchInsights, researchNotes:data.researchNotes,
          researchIdeas:data.researchIdeas, researchDesigns:data.researchDesigns, researchComparisons:data.researchComparisons
        });
      },
      async saveImport(payload) {
        if (!payload || payload.schema !== 'AIDERLOG_PAPER_V3') throw new Error('AIDERLOG_PAPER_V3 형식만 저장할 수 있습니다.');
        const data = ensureData(), bibliography = payload.bibliography || {}, close = payload.closeReading || {}, study = payload.studyProfile || {}, neuro = payload.neuroProfile || {}, evaluation = payload.criticalEvaluation || {};
        const list = value => (Array.isArray(value) ? value : String(value || '').split(/[,\n]/)).map(item => typeof item === 'string' ? item.trim() : item).filter(Boolean);
        const join = value => Array.isArray(value) ? value.map(item => typeof item === 'string' ? item : Object.values(item || {}).flat().join(' · ')).join('\n') : String(value || '');
        const doi = String(bibliography.doi || bibliography.url || '').trim();
        const existing = data.paperItems.find(row => doi && String(row.doi || '').toLowerCase() === doi.toLowerCase());
        const id = existing?.id || uid('paper-v128');
        const terms = list(close.keyTerms).map(item => typeof item === 'string' ? item : item.term).filter(Boolean);
        const regions = list(neuro.brainRegions), modalities = list(neuro.modality || neuro.modalities);
        const paper = {
          id, title:String(bibliography.title || '제목 없는 논문'), authors:String(bibliography.authors || ''),
          year:Number(bibliography.year) || new Date().getFullYear(), journal:String(bibliography.journal || ''), doi,
          summary:String(close.oneSentenceThesis || close.orientationParagraph || ''), background:String(close.rationale || ''),
          purpose:String(close.researchQuestion || ''), researchQuestion:String(close.researchQuestion || ''), theory:join(close.keyTerms),
          population:String(study.population || neuro.speciesPopulation || ''), method:[study.design, join(modalities), join(close.analysisPipeline)].filter(Boolean).join(' · '),
          variables:join(close.measures), findings:join(close.mainResults), limitations:join(payload.limitationsAndGaps),
          futureResearch:[...list(close.researchIdeaSeeds), ...list(payload.unknowns)].join('\n'),
          keywords:[...new Set([...terms, ...regions, ...modalities])].slice(0, 40),
          researchConnection:String(evaluation.overallVerdict?.decisionForMyResearch || ''),
          neuroProfile:{ brainRegions:regions, modalities, cognitiveFunctions:list(neuro.cognitiveTasks || neuro.cognitiveFunctions), disorders:list(neuro.disorders), studyDesign:String(study.design || '') },
          status:'reading', importance:3, tags:[...new Set([...terms, ...regions, ...modalities])].slice(0, 30),
          importSchema:'AIDERLOG_PAPER_V3', createdAt:existing?.createdAt || Date.now(), updatedAt:Date.now(), lastOpenedAt:Date.now()
        };
        const at = data.paperItems.findIndex(row => row.id === id);
        if (at >= 0) data.paperItems.splice(at, 1, paper); else data.paperItems.push(paper);
        data.researchInsights = data.researchInsights.filter(row => row.paperId !== id || !(row.tags || []).includes('AIDERLOG_PAPER_V3'));
        (Array.isArray(payload.claims) ? payload.claims : []).slice(0, 120).forEach((claim, index) => data.researchInsights.push({
          id:uid(`insight-${index}`), paperId:id, title:String(claim.claim || `근거 ${index + 1}`), content:String(claim.claim || ''),
          sourceEvidence:String(claim.sourceQuote || ''), sourceQuote:String(claim.sourceQuote || ''), interpretation:String(claim.plainLanguageMeaning || ''),
          evidenceDirection:claim.evidenceDirection || 'context', reviewState:'unreviewed', status:'aiCandidate', tags:['AIDERLOG_PAPER_V3', ...paper.tags.slice(0, 8)], createdAt:Date.now() + index
        }));
        data.paperAnalyses[id] = payload;
        await persist(existing ? '논문 분석을 업데이트했습니다.' : '논문과 근거를 Library에 저장했습니다.');
        return { id, analysisStored:true };
      },
      async saveQuickPaper(fields, file) {
        const data = ensureData(), doi = String(fields?.doi || fields?.url || '').trim();
        const existing = data.paperItems.find(row => doi && String(row.doi || '').trim().toLowerCase() === doi.toLowerCase());
        let attachment = existing?.attachment || null;
        if (file) {
          if (file.size > 25 * 1024 * 1024) throw new Error('PDF는 25MB 이하만 등록할 수 있습니다.');
          const api = window.AiderDearFirebase;
          if (!api?.uploadPrivateMedia) throw new Error('PDF를 저장하려면 Google 로그인이 필요합니다.');
          attachment = await api.uploadPrivateMedia(file, 'paper-pdf');
        }
        const row = {
          ...(existing || {}), id:existing?.id || uid('paper-v145'), title:String(fields?.title || file?.name?.replace(/\.pdf$/i, '') || '확인 필요'),
          authors:String(fields?.authors || ''), journal:String(fields?.journal || ''), year:Number(fields?.year) || new Date().getFullYear(), doi,
          summary:String(fields?.note || '확인 필요'), status:'reading', reviewState:'unreviewed', importance:Number(existing?.importance || 3),
          tags:Array.isArray(existing?.tags) ? existing.tags : [], keywords:Array.isArray(existing?.keywords) ? existing.keywords : [],
          attachment, importSchema:'manual-v145', createdAt:existing?.createdAt || Date.now(), updatedAt:Date.now(), lastOpenedAt:Date.now()
        };
        const at=data.paperItems.findIndex(item=>item.id===row.id); if(at>=0)data.paperItems.splice(at,1,row);else data.paperItems.unshift(row);
        await persist(existing ? '논문 서지정보를 업데이트했습니다.' : '논문을 Library에 수집했습니다.');
        return {id:row.id,analysisStored:false};
      },
      async loadAnalysis(id) { return ensureData().paperAnalyses[id] || null; },
      async deletePapers(ids) {
        const selected = new Set(ids || []), data = ensureData();
        data.paperItems = data.paperItems.filter(row => !selected.has(row.id));
        data.researchInsights = data.researchInsights.filter(row => !selected.has(row.paperId));
        selected.forEach(id => delete data.paperAnalyses[id]);
        await persist(`${selected.size}개 논문을 삭제했습니다.`);
        window.AiderPaperWorkspace?.refresh?.();
      },
      async setInsightReview(id, state) {
        const row = ensureData().researchInsights.find(item => item.id === id);
        if (!row) return;
        row.reviewState = state; row.status = state === 'verified' ? 'reviewed' : 'aiCandidate'; row.updatedAt = Date.now();
        await persist('근거 검토 상태를 저장했습니다.');
        window.AiderPaperWorkspace?.refresh?.();
      },
      toast: message => typeof toast === 'function' ? toast(message) : console.info(message)
    };
  }

  function hubHtml() {
    const data = ensureData();
    const pending = data.consultingTasks.filter(row => !row.done).length;
    const offlineCounts = window.AiderLogSuiteV145?.counts?.() || window.AiderOfflineTrainingV129?.counts?.() || { speech:0, brain:0 };
    const speechCount = offlineCounts.speech;
    const brainCount = offlineCounts.brain;
    const reviewed = data.paperItems.filter(row => row.status === 'reviewed').length;
    const paperSummary = canUsePaper() ? `<article><span>PAPERS</span><b>${data.paperItems.length}</b><small>${reviewed} reviewed</small></article>` : '';
    const workSummary = canUseWork() ? `<article><span>WORK</span><b>${(data.workItems||[]).filter(row=>row.status!=='완료').length}</b><small>active</small></article>` : '';
    const paperTool = canUsePaper() ? `<button class="my128-tool paper" data-my128-open="paper"><i>${icon('paper',28)}</i><span>RESEARCH WORKSPACE</span><h2>Paper</h2><p>Library, Evidence, Synthesis, Study Workspace와 Brain Atlas를 사용합니다.</p><footer><b>${data.paperItems.length} papers</b><em>OPEN</em></footer></button>` : '';
    const workTools = canUseWork() ? `<button class="my128-tool task" data-my128-open="task"><i>${icon('task',28)}</i><span>CONSULTING DESK</span><h2>Task</h2><p>고객 정보, 마감 과업, 상담 기록, 파일과 지원 결과를 관리합니다.</p><footer><b>${data.consultingClients.length} clients · ${pending} pending</b><em>OPEN</em></footer></button><button class="my128-tool work" data-my128-open="work"><i>${icon('calendar',28)}</i><span>OWNER OPERATIONS</span><h2>Work</h2><p>국가과제·바이오 연구·행정·지출·직원 업무와 대표 결정을 관리합니다.</p><footer><b>${(data.workItems||[]).length} records</b><em>OPEN</em></footer></button>` : '';
    return `<div class="page my128-page"><header class="my128-head"><div><small>PRIVATE UNIVERSE</small><h1>My</h1><p>연구·사업 운영·대화·인지 훈련을 계정별 개인 공간에서 안전하게 이어갑니다.</p></div><span>PRIVATE</span></header><div class="my128-scroll"><section class="my128-summary">${paperSummary}${workSummary}<article><span>SPEECH</span><b>${speechCount}</b><small>sessions</small></article><article><span>BRAIN</span><b>${brainCount}</b><small>training</small></article></section><section class="my128-tools">
      ${paperTool}${workTools}
      <button class="my128-tool speech" data-my128-open="speech"><i>${icon('speech',28)}</i><span>THINKING &amp; CONVERSATION</span><h2>Speech Training</h2><p>어휘·논리·설득·반론·질문을 글로 훈련해 성숙한 대화 구조를 만듭니다.</p><footer><b>${speechCount ? `최근 ${speechCount}회` : '오늘의 25분 시작'}</b><em>TRAIN</em></footer></button>
      <button class="my128-tool brain" data-my128-open="brain"><i>${icon('brain',28)}</i><span>OFFLINE COGNITIVE WELLNESS</span><h2>Brain Training</h2><p>기억·주의·작업기억·집행/공간·지연 회상을 하루 약 10분 훈련합니다.</p><footer><b>${brainCount ? `최근 ${brainCount}회` : '첫 기준선 측정'}</b><em>START</em></footer></button>
    </section></div></div>`;
  }

  const subhead = (eyebrow, title, action = '') => `<header class="my128-subhead"><div><button class="my128-back" data-my128-back aria-label="My로 돌아가기">${icon('back')}</button><span><small>${eyebrow}</small><h1>${title}</h1></span></div>${action}</header>`;

  function paperHtml() {
    return `<div class="page my128-page my128-paper-page">${subhead('MOBILE RESEARCH COMPANION', 'Paper', '<span class="my128-paper-actions"><button class="my128-collect-action" data-paper-collect>'+icon('plus',16)+' 수집</button><button class="my128-icon-action" data-paper-search aria-label="논문 검색">'+icon('search')+'</button></span>')}<div class="paper-stage-v128" id="paperStage"><div class="my128-loading"><i></i><b>Paper Workspace를 준비하고 있어요</b></div></div></div>`;
  }

  function stageLabel(value) { return ({ inquiry:'문의', proposal:'제안', analysis:'분석', revision:'수정', complete:'완료' })[value] || '문의'; }
  function resultLabel(value) { return ({ pending:'진행 중', accepted:'합격', waitlisted:'대기', rejected:'불합격' })[value] || '진행 중'; }

  function taskHtml() {
    const data = ensureData();
    if (!selectedClientId || !data.consultingClients.some(row => row.id === selectedClientId)) selectedClientId = data.consultingClients[0]?.id || '';
    const selected = data.consultingClients.find(row => row.id === selectedClientId);
    const query = safe(window.__taskQuery128 || '');
    const clients = data.consultingClients.map(row => `<button class="my128-client ${row.id === selectedClientId ? 'active' : ''}" data-client128="${safe(row.id)}"><i>${safe((row.name || '?').slice(0,1))}</i><span><b>${safe(row.name)}</b><small>${safe(row.currentSchool || row.school || '학교 미입력')} · ${stageLabel(row.stage)}</small></span><em>${resultLabel(row.admissionResult)}</em></button>`).join('');
    let main = `<section class="my128-task-empty"><i>${icon('task',40)}</i><b>첫 고객을 추가해보세요</b><p>상담 정보, 과업, 세션과 파일을 한곳에 정리할 수 있습니다.</p><button data-client-add128>${icon('plus',16)} 고객 추가</button></section>`;
    if (selected) {
      const tasks = data.consultingTasks.filter(row => row.clientId === selected.id);
      const sessions = data.consultingSessions.filter(row => row.clientId === selected.id).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
      const files = data.consultingFiles.filter(row => row.clientId === selected.id);
      const done = tasks.filter(row => row.done).length;
      main = `<section class="my128-client-main"><header><div><small>${safe(selected.currentSchool || selected.school || 'CONSULTING CLIENT')}</small><h2>${safe(selected.name)} <i class="result ${safe(selected.admissionResult || 'pending')}">${resultLabel(selected.admissionResult)}</i></h2><p>${safe(selected.targetUniversity || selected.target || '목표 대학원 미입력')} · ${safe(selected.targetMajor || selected.degree || '과정 미입력')}</p></div><div><button data-client-edit128="${safe(selected.id)}">${icon('edit',15)} 수정</button><button data-client-delete128="${safe(selected.id)}" class="danger">${icon('trash',15)}</button></div></header><div class="my128-task-stats"><article><span>STAGE</span><b>${stageLabel(selected.stage)}</b></article><article><span>RESULT</span><b>${resultLabel(selected.admissionResult)}</b></article><article><span>TASK</span><b>${done}/${tasks.length}</b></article><article><span>NEXT</span><b>${safe((selected.nextSession || '—').replace('T',' '))}</b></article></div><div class="my128-task-panels">
        <article><header><b>과업</b><button data-task-add128>${icon('plus',14)} 추가</button></header><div>${tasks.length ? tasks.map(row => `<label class="my128-task-row"><input type="checkbox" data-task-toggle128="${safe(row.id)}" ${row.done?'checked':''}><span><b>${safe(row.title)}</b><small>${row.dueDate ? `마감 ${safe(row.dueDate)}` : '마감일 없음'}</small></span><button type="button" data-task-delete128="${safe(row.id)}" aria-label="과업 삭제">${icon('close',13)}</button></label>`).join('') : '<p class="my128-empty-line">등록된 과업이 없습니다.</p>'}</div></article>
        <article><header><b>상담 기록</b><button data-session-add128>${icon('plus',14)} 추가</button></header><div>${sessions.length ? sessions.map(row => `<div class="my128-session-row"><time>${safe(String(row.date||'').replace('T',' '))}</time><p>${safe(row.summary)}</p><button data-session-delete128="${safe(row.id)}">${icon('close',13)}</button></div>`).join('') : '<p class="my128-empty-line">상담 기록이 없습니다.</p>'}</div></article>
        <article class="wide"><header><b>파일</b><button data-file-add128>${icon('plus',14)} 추가</button></header><div class="my128-file-list">${files.length ? files.map(row => `<button data-file-open128="${safe(row.id)}"><i>${icon('file',18)}</i><span><b>${safe(row.name)}</b><small>${Math.max(1,Math.round((row.size||0)/1024))} KB · ${new Date(row.createdAt||Date.now()).toLocaleDateString('ko-KR')}</small></span></button>`).join('') : '<p class="my128-empty-line">첨부 파일이 없습니다.</p>'}</div></article>
      </div></section>`;
    }
    return `<div class="page my128-page">${subhead('PRIVATE WORKSPACE', 'Task', '<button class="my128-primary" data-client-add128>'+icon('plus',15)+' CLIENT</button>')}<div class="my128-task-shell"><aside><label>${icon('search',16)}<input id="taskSearch128" value="${query}" placeholder="이름 · 학교 · 과정 검색"></label><div class="my128-client-list">${clients || '<p>고객이 없습니다.</p>'}</div></aside><main>${main}</main></div></div>`;
  }

  function speechHtml() {
    const data = ensureData(), settings = data.speechTrainingSettings;
    const sessions = data.speechTrainingSessions.slice().sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,8);
    const prompts = {
      presentation:'오늘의 핵심 메시지를 한 문장으로 먼저 말하고, 근거와 예시를 차분하게 이어가 보세요.',
      interview:'지원 동기와 나의 강점을 구체적인 경험 하나로 설명해 보세요.',
      articulation:'입술과 혀의 움직임을 크게 쓰며 또박또박 읽어 보세요. 간장 공장 공장장은 강 공장장입니다.'
    };
    const script = settings.script || prompts[settings.mode] || prompts.presentation;
    const review = speechState === 'review' && speechObjectUrl ? `<section class="speech128-review"><div><span>RECORDING COMPLETE</span><h3>${formatTime(speechElapsed)}</h3><p>${speechTranscript ? `인식된 문장: ${safe(speechTranscript)}` : '녹음을 들어보고 전달 속도와 문장 사이의 호흡을 확인하세요.'}</p></div><audio controls src="${speechObjectUrl}"></audio><div class="speech128-review-actions"><button data-speech-discard>다시 녹음</button><button class="primary" data-speech-save>${icon('save',16)} 세션 저장</button></div></section>` : '';
    return `<div class="page my128-page">${subhead('VOICE PRACTICE', 'Speech Training')}<div class="my128-scroll speech128-scroll"><section class="speech128-hero"><div><small>SPEAKING ORBIT</small><h2>말의 속도와 호흡을<br>직접 듣고 다듬어보세요.</h2><p>녹음은 사용자가 시작할 때만 진행되며, 저장한 세션은 내 계정에만 보관됩니다.</p></div><div class="speech128-orbit"><i></i>${icon('speech',34)}</div></section><section class="speech128-work"><header><div><span>TRAINING MODE</span><h3>오늘의 스피치 연습</h3></div><select id="speechMode128"><option value="presentation" ${settings.mode==='presentation'?'selected':''}>발표 · 프레젠테이션</option><option value="interview" ${settings.mode==='interview'?'selected':''}>면접 · 자기소개</option><option value="articulation" ${settings.mode==='articulation'?'selected':''}>발음 · 또박또박 말하기</option></select></header><div class="speech128-grid"><label class="speech128-script"><span>연습 대본</span><textarea id="speechScript128">${safe(script)}</textarea><small>첫 문장은 천천히, 핵심 단어 앞뒤에는 짧은 여백을 주세요.</small></label><div class="speech128-studio"><div class="speech128-wave ${speechState==='recording'?'recording':''}">${Array.from({length:18},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><time id="speechClock128">${formatTime(speechElapsed)}</time><p id="speechLive128">${speechState==='recording' ? '듣고 있어요. 편안하게 이어가세요.' : '마이크 버튼을 누르면 녹음을 시작합니다.'}</p><button class="speech128-record ${speechState==='recording'?'on':''}" data-speech-record aria-label="${speechState==='recording'?'녹음 중지':'녹음 시작'}">${icon(speechState==='recording'?'stop':'speech',24)}</button></div></div>${review}</section><section class="speech128-coach"><article><span>01</span><b>호흡</b><p>문장 끝마다 급하게 들이쉬지 말고 의미 단위 사이에서 쉽니다.</p></article><article><span>02</span><b>속도</b><p>핵심 문장은 평소보다 10% 느리게 말해 메시지를 남깁니다.</p></article><article><span>03</span><b>시선</b><p>대본 한 줄을 읽고 시선을 들어 청자에게 문장을 전달합니다.</p></article></section><section class="speech128-history"><header><b>최근 연습</b><span>${data.speechTrainingSessions.length} sessions</span></header>${sessions.length ? sessions.map(row => `<article><i>${icon('play',16)}</i><div><b>${safe(row.modeLabel || '스피치 연습')}</b><small>${safe(row.date)} · ${formatTime(row.seconds || 0)} · ${row.pace || 0}자/분</small></div>${row.fileId ? `<button data-speech-play="${safe(row.id)}">재생</button>` : '<em>기록</em>'}</article>`).join('') : '<p class="my128-empty-line">아직 저장한 스피치 연습이 없습니다.</p>'}</section></div></div>`;
  }

  function formatTime(seconds) { seconds = Math.max(0, Math.floor(Number(seconds) || 0)); return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`; }

  function modalHtml() {
    if (!modal) return '';
    const data = ensureData();
    if (modal.type === 'client') {
      const row = data.consultingClients.find(item => item.id === modal.id) || {};
      return `<div class="my128-modal"><section><header><div><small>CONSULTING CLIENT</small><h2>${row.id?'고객 정보 수정':'고객 직접 추가'}</h2></div><button data-my128-modal-close>${icon('close')}</button></header><form id="clientForm128" class="my128-form"><input type="hidden" id="clientId128" value="${safe(row.id||'')}"><fieldset><legend>01 · 개인 정보</legend><label>이름 *<input id="clientName128" required value="${safe(row.name||'')}"></label><label>연락처<input id="clientPhone128" value="${safe(row.phone||'')}"></label><label>이메일<input id="clientEmail128" type="email" value="${safe(row.email||'')}"></label><label>출생년도<input id="clientBirth128" type="number" min="1900" max="2200" value="${safe(row.birthYear||'')}"></label></fieldset><fieldset><legend>02 · 학력 및 목표</legend><label>현재 학교<input id="clientSchool128" value="${safe(row.currentSchool||row.school||'')}"></label><label>현재 전공<input id="clientMajor128" value="${safe(row.currentMajor||'')}"></label><label>희망 대학원<input id="clientUniversity128" value="${safe(row.targetUniversity||row.target||'')}"></label><label>희망 전공<input id="clientTargetMajor128" value="${safe(row.targetMajor||'')}"></label><label>희망 과정<select id="clientDegree128"><option value="">선택</option><option value="masters" ${row.degree==='masters'?'selected':''}>석사</option><option value="doctoral" ${row.degree==='doctoral'?'selected':''}>박사</option><option value="integrated" ${row.degree==='integrated'?'selected':''}>석박사 통합</option></select></label><label>지원 시기<input id="clientYear128" type="number" min="2000" max="2200" value="${safe(row.applicationYear||'')}"></label><label>진행 단계<select id="clientStage128">${[['inquiry','문의'],['proposal','제안'],['analysis','분석'],['revision','수정'],['complete','완료']].map(([v,l])=>`<option value="${v}" ${row.stage===v?'selected':''}>${l}</option>`).join('')}</select></label><label>지원 결과<select id="clientResult128">${[['pending','진행 중'],['accepted','합격'],['waitlisted','대기'],['rejected','불합격']].map(([v,l])=>`<option value="${v}" ${row.admissionResult===v?'selected':''}>${l}</option>`).join('')}</select></label><label class="wide">관심 분야 · 연구 주제<textarea id="clientTopic128">${safe(row.topic||'')}</textarea></label></fieldset><fieldset><legend>03 · 스펙 및 상담</legend><label>어학<textarea id="clientLanguage128">${safe(row.languageSpec||'')}</textarea></label><label>자격증<textarea id="clientCert128">${safe(row.certifications||'')}</textarea></label><label class="wide">관련 활동 · 연구 경험<textarea id="clientExperience128">${safe([row.activities,row.researchExperience].filter(Boolean).join('\n'))}</textarea></label><label>다음 상담<input id="clientNext128" type="datetime-local" value="${safe(row.nextSession||'')}"></label><label>기타 문의<textarea id="clientInquiry128">${safe(row.inquiry||'')}</textarea></label><label class="wide">관리 메모<textarea id="clientNote128">${safe(row.note||'')}</textarea></label></fieldset><footer>${row.id?'<button type="button" class="danger" data-client-delete128="'+safe(row.id)+'">삭제</button>':''}<button type="button" data-my128-modal-close>취소</button><button class="primary" type="submit">저장</button></footer></form></section></div>`;
    }
    if (modal.type === 'task') return `<div class="my128-modal"><section class="compact"><header><div><small>DELIVERABLE</small><h2>과업 추가</h2></div><button data-my128-modal-close>${icon('close')}</button></header><form id="taskForm128" class="my128-form single"><label>과업<input id="taskTitle128" required placeholder="전달하거나 확인할 일"></label><label>마감일<input id="taskDue128" type="date"></label><footer><button type="button" data-my128-modal-close>취소</button><button class="primary">추가</button></footer></form></section></div>`;
    if (modal.type === 'session') return `<div class="my128-modal"><section class="compact"><header><div><small>CONSULTING LOG</small><h2>상담 기록</h2></div><button data-my128-modal-close>${icon('close')}</button></header><form id="sessionForm128" class="my128-form single"><label>상담 일시<input id="sessionDate128" type="datetime-local" value="${new Date().toISOString().slice(0,16)}"></label><label>상담 내용과 다음 행동<textarea id="sessionSummary128" required></textarea></label><footer><button type="button" data-my128-modal-close>취소</button><button class="primary">저장</button></footer></form></section></div>`;
    if (modal.type === 'file') return `<div class="my128-modal"><section class="compact"><header><div><small>CLIENT FILE</small><h2>파일 추가</h2></div><button data-my128-modal-close>${icon('close')}</button></header><form id="fileForm128" class="my128-form single"><label>파일 선택<input id="clientFile128" type="file" required></label><p>로그인 계정의 안전한 저장소에 업로드합니다.</p><footer><button type="button" data-my128-modal-close>취소</button><button class="primary">업로드</button></footer></form></section></div>`;
    return '';
  }

  async function startSpeech() {
    if (speechState === 'recording') { speechRecorder?.stop(); return; }
    try {
      speechStream = await navigator.mediaDevices.getUserMedia({ audio:{ echoCancellation:true, noiseSuppression:true } });
      speechChunks = []; speechBlob = null; speechTranscript = ''; speechElapsed = 0;
      speechRecorder = new MediaRecorder(speechStream);
      speechRecorder.ondataavailable = event => { if (event.data?.size) speechChunks.push(event.data); };
      speechRecorder.onstop = () => {
        speechElapsed = Math.max(1, Math.round((Date.now() - speechStartedAt) / 1000));
        speechBlob = new Blob(speechChunks, { type:speechRecorder.mimeType || 'audio/webm' });
        if (speechObjectUrl) URL.revokeObjectURL(speechObjectUrl);
        speechObjectUrl = URL.createObjectURL(speechBlob);
        speechStream?.getTracks().forEach(track => track.stop());
        speechRecognition?.stop?.(); speechRecognition = null;
        clearInterval(speechTimer); speechState = 'review'; renderMy();
      };
      const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (Recognition) {
        speechRecognition = new Recognition(); speechRecognition.lang = 'ko-KR'; speechRecognition.continuous = true; speechRecognition.interimResults = true;
        speechRecognition.onresult = event => {
          speechTranscript = [...event.results].map(result => result[0]?.transcript || '').join(' ').trim();
          const live = q('#speechLive128'); if (live) live.textContent = speechTranscript || '듣고 있어요. 편안하게 이어가세요.';
        };
        try { speechRecognition.start(); } catch {}
      }
      speechStartedAt = Date.now(); speechState = 'recording'; speechRecorder.start(250); renderMy();
      speechTimer = setInterval(() => { speechElapsed = Math.round((Date.now()-speechStartedAt)/1000); const clock=q('#speechClock128'); if(clock) clock.textContent=formatTime(speechElapsed); }, 250);
    } catch (error) {
      speechState = 'ready';
      alert('마이크 권한을 허용해야 스피치 연습을 시작할 수 있습니다.');
    }
  }

  async function saveSpeech() {
    if (!speechBlob) return;
    const data = ensureData(), settings = data.speechTrainingSettings, script = q('#speechScript128')?.value || settings.script || '';
    let fileId = '', fileName = '';
    const api = window.AiderDearFirebase || (typeof fb !== 'undefined' ? fb : null);
    if (api?.uploadPrivateMedia && authState?.user) {
      try {
        const file = new File([speechBlob], `speech-${Date.now()}.webm`, { type:speechBlob.type || 'audio/webm' });
        const uploaded = await api.uploadPrivateMedia(file, 'speech-training'); fileId = uploaded.id; fileName = uploaded.name;
      } catch (error) { console.warn('Speech audio upload skipped', error); }
    }
    const chars = script.replace(/\s/g,'').length;
    data.speechTrainingSessions.push({ id:uid('speech'), date:dateKey(), mode:settings.mode, modeLabel:({presentation:'발표 연습',interview:'면접 연습',articulation:'발음 연습'})[settings.mode], seconds:speechElapsed, pace:Math.round(chars/Math.max(1,speechElapsed)*60), transcript:speechTranscript, script, fileId, fileName, createdAt:Date.now() });
    await persist('스피치 연습을 저장했습니다.');
    speechState='ready'; speechBlob=null; speechTranscript=''; speechElapsed=0; if(speechObjectUrl) URL.revokeObjectURL(speechObjectUrl); speechObjectUrl=''; renderMy();
  }

  async function playSpeechSession(id) {
    const row = ensureData().speechTrainingSessions.find(item => item.id === id);
    const api = window.AiderDearFirebase || (typeof fb !== 'undefined' ? fb : null);
    if (!row?.fileId || !api?.readPrivateMedia) return;
    try { const blob = await api.readPrivateMedia(row.fileId); const url = URL.createObjectURL(blob); const audio = new Audio(url); audio.onended=()=>URL.revokeObjectURL(url); await audio.play(); } catch { alert('저장된 녹음을 불러오지 못했습니다.'); }
  }

  function renderMy() {
    const host = q('#fifth'); if (!host) return;
    ensureData(); installPaperBridge();
    q('#fifthLabel') && (q('#fifthLabel').textContent='My');
    if (mode === 'paper' && !canUsePaper()) mode = 'hub';
    if ((mode === 'task' || mode === 'work') && !canUseWork()) mode = 'hub';
    if (mode === 'speech' && window.AiderLogSuiteV145) {
      window.AiderLogSuiteV145.renderSpeech(host, () => { mode='hub'; modal=null; renderMy(); });
      return;
    }
    if (mode === 'speech' && window.AiderOfflineTrainingV129) {
      window.AiderOfflineTrainingV129.renderSpeech(host, () => { mode='hub'; modal=null; renderMy(); });
      return;
    }
    if (mode === 'brain' && window.AiderLogSuiteV145) {
      window.AiderLogSuiteV145.renderBrain(host, () => { mode='hub'; modal=null; renderMy(); });
      return;
    }
    if (mode === 'brain' && window.AiderOfflineTrainingV129) {
      window.AiderOfflineTrainingV129.renderBrain(host, () => { mode='hub'; modal=null; renderMy(); });
      return;
    }
    if ((mode === 'task' || mode === 'work') && window.AiderLogSuiteV145) {
      window.AiderLogSuiteV145.renderWork(host, () => { mode='hub'; modal=null; renderMy(); }, mode);
      return;
    }
    host.innerHTML = (mode==='paper'?paperHtml():mode==='task'?taskHtml():mode==='speech'?speechHtml():hubHtml()) + modalHtml();
    bind();
    if (mode === 'paper') requestAnimationFrame(() => window.initAiderPaperWorkspaceV128?.());
  }

  function openLegacyBrain() {
    if (typeof window.renderMyV115 !== 'function') return;
    window.renderMyV115();
    requestAnimationFrame(() => {
      q('#fifth [data-my-open="brain"]')?.click();
      setTimeout(() => { const back=q('#fifth [data-my-back]'); if(back) back.onclick=()=>{mode='hub';renderMy();}; }, 20);
    });
  }

  function bind() {
    qa('[data-my128-open]', q('#fifth')).forEach(button => {
      const open=()=>{mode=button.dataset.my128Open;modal=null;renderMy()};
      button.onclick=open;
    });
    qa('[data-my128-back]', q('#fifth')).forEach(button => button.onclick=()=>{ mode='hub';modal=null;renderMy(); });
    qa('[data-my128-modal-close]', q('#fifth')).forEach(button => button.onclick=()=>{ modal=null;renderMy(); });
    q('[data-paper-search]',q('#fifth')) && (q('[data-paper-search]',q('#fifth')).onclick=()=>window.AiderPaperWorkspace?.focusSearch?.());
    q('[data-paper-collect]',q('#fifth')) && (q('[data-paper-collect]',q('#fifth')).onclick=()=>window.AiderPaperWorkspace?.openImport?.());
    qa('[data-client-add128]',q('#fifth')).forEach(button=>button.onclick=()=>{modal={type:'client',id:''};renderMy();});
    qa('[data-client128]',q('#fifth')).forEach(button=>button.onclick=()=>{selectedClientId=button.dataset.client128;renderMy();});
    qa('[data-client-edit128]',q('#fifth')).forEach(button=>button.onclick=()=>{modal={type:'client',id:button.dataset.clientEdit128};renderMy();});
    q('#taskSearch128') && (q('#taskSearch128').oninput=event=>{window.__taskQuery128=event.target.value; const value=event.target.value.trim().toLowerCase(); qa('.my128-client',q('#fifth')).forEach(row=>row.hidden=value&&!row.textContent.toLowerCase().includes(value));});
    qa('[data-task-add128]',q('#fifth')).forEach(button=>button.onclick=()=>{modal={type:'task'};renderMy();});
    qa('[data-session-add128]',q('#fifth')).forEach(button=>button.onclick=()=>{modal={type:'session'};renderMy();});
    qa('[data-file-add128]',q('#fifth')).forEach(button=>button.onclick=()=>{modal={type:'file'};renderMy();});
    qa('[data-task-toggle128]',q('#fifth')).forEach(input=>input.onchange=async()=>{const row=ensureData().consultingTasks.find(item=>item.id===input.dataset.taskToggle128);if(!row)return;row.done=input.checked;row.completedAt=input.checked?Date.now():0;await persist();renderMy();});
    qa('[data-task-delete128]',q('#fifth')).forEach(button=>button.onclick=async()=>{P.consultingTasks=P.consultingTasks.filter(row=>row.id!==button.dataset.taskDelete128);await persist();renderMy();});
    qa('[data-session-delete128]',q('#fifth')).forEach(button=>button.onclick=async()=>{P.consultingSessions=P.consultingSessions.filter(row=>row.id!==button.dataset.sessionDelete128);await persist();renderMy();});
    qa('[data-client-delete128]',q('#fifth')).forEach(button=>button.onclick=async()=>{if(!confirm('고객과 연결된 과업·상담 기록을 삭제할까요?'))return;const id=button.dataset.clientDelete128;P.consultingClients=P.consultingClients.filter(row=>row.id!==id);P.consultingTasks=P.consultingTasks.filter(row=>row.clientId!==id);P.consultingSessions=P.consultingSessions.filter(row=>row.clientId!==id);P.consultingFiles=P.consultingFiles.filter(row=>row.clientId!==id);selectedClientId='';modal=null;await persist();renderMy();});
    qa('[data-file-open128]',q('#fifth')).forEach(button=>button.onclick=async()=>{const row=ensureData().consultingFiles.find(item=>item.id===button.dataset.fileOpen128),api=window.AiderDearFirebase||(typeof fb!=='undefined'?fb:null);if(!row||!api)return;try{const blob=row.storageScope==='paper-task'&&api.readPaperTaskMedia?await api.readPaperTaskMedia(row.fileId):await api.readPrivateMedia(row.fileId);const url=URL.createObjectURL(blob);window.open(url,'_blank');setTimeout(()=>URL.revokeObjectURL(url),60000)}catch{alert('파일을 열지 못했습니다.')}});
    const clientForm=q('#clientForm128'); if(clientForm) clientForm.onsubmit=async event=>{event.preventDefault();const data=ensureData(),id=q('#clientId128').value||uid('client'),old=data.consultingClients.find(row=>row.id===id)||{};const row={...old,id,name:q('#clientName128').value.trim(),phone:q('#clientPhone128').value.trim(),email:q('#clientEmail128').value.trim(),birthYear:Number(q('#clientBirth128').value)||0,currentSchool:q('#clientSchool128').value.trim(),currentMajor:q('#clientMajor128').value.trim(),targetUniversity:q('#clientUniversity128').value.trim(),targetMajor:q('#clientTargetMajor128').value.trim(),degree:q('#clientDegree128').value,applicationYear:Number(q('#clientYear128').value)||0,stage:q('#clientStage128').value,admissionResult:q('#clientResult128').value,topic:q('#clientTopic128').value.trim(),languageSpec:q('#clientLanguage128').value.trim(),certifications:q('#clientCert128').value.trim(),researchExperience:q('#clientExperience128').value.trim(),nextSession:q('#clientNext128').value,inquiry:q('#clientInquiry128').value.trim(),note:q('#clientNote128').value.trim(),createdAt:old.createdAt||Date.now(),updatedAt:Date.now()};const at=data.consultingClients.findIndex(item=>item.id===id);if(at>=0)data.consultingClients.splice(at,1,row);else data.consultingClients.push(row);selectedClientId=id;modal=null;await persist('고객 정보를 저장했습니다.');renderMy();};
    const taskForm=q('#taskForm128');if(taskForm)taskForm.onsubmit=async event=>{event.preventDefault();const title=q('#taskTitle128').value.trim();if(!title||!selectedClientId)return;P.consultingTasks.push({id:uid('task'),clientId:selectedClientId,title,dueDate:q('#taskDue128').value,done:false,createdAt:Date.now()});modal=null;await persist();renderMy();};
    const sessionForm=q('#sessionForm128');if(sessionForm)sessionForm.onsubmit=async event=>{event.preventDefault();const summary=q('#sessionSummary128').value.trim();if(!summary||!selectedClientId)return;P.consultingSessions.push({id:uid('session'),clientId:selectedClientId,date:q('#sessionDate128').value,summary,createdAt:Date.now()});modal=null;await persist();renderMy();};
    const fileForm=q('#fileForm128');if(fileForm)fileForm.onsubmit=async event=>{event.preventDefault();const file=q('#clientFile128').files?.[0],api=window.AiderDearFirebase||(typeof fb!=='undefined'?fb:null);if(!file||!selectedClientId)return;try{const uploaded=await api?.uploadPrivateMedia?.(file,'consulting-client-file');if(!uploaded)throw new Error();P.consultingFiles.push({id:uid('file'),clientId:selectedClientId,fileId:uploaded.id,name:uploaded.name||file.name,type:uploaded.mimeType||file.type,size:uploaded.size||file.size,storageScope:'private',createdAt:Date.now()});modal=null;await persist('파일을 계정 전용 공간에 저장했습니다.');renderMy();}catch{alert('파일 업로드에 실패했습니다. 로그인 상태를 확인해주세요.')}};
    q('#speechMode128') && (q('#speechMode128').onchange=async event=>{P.speechTrainingSettings.mode=event.target.value;P.speechTrainingSettings.script='';await persist();renderMy();});
    q('#speechScript128') && (q('#speechScript128').onchange=async event=>{P.speechTrainingSettings.script=event.target.value;await persist();});
    q('[data-speech-record]',q('#fifth')) && (q('[data-speech-record]',q('#fifth')).onclick=startSpeech);
    q('[data-speech-discard]',q('#fifth')) && (q('[data-speech-discard]',q('#fifth')).onclick=()=>{speechState='ready';speechBlob=null;speechTranscript='';speechElapsed=0;if(speechObjectUrl)URL.revokeObjectURL(speechObjectUrl);speechObjectUrl='';renderMy();});
    q('[data-speech-save]',q('#fifth')) && (q('[data-speech-save]',q('#fifth')).onclick=saveSpeech);
    qa('[data-speech-play]',q('#fifth')).forEach(button=>button.onclick=()=>playSpeechSession(button.dataset.speechPlay));
  }

  const previousRenderPersonal = window.renderPersonal;
  if (typeof previousRenderPersonal === 'function') window.renderPersonal = function () { const result=previousRenderPersonal.apply(this,arguments); renderMy(); return result; };
  const previousResetPageEntry = window.resetPageEntry;
  if (typeof previousResetPageEntry === 'function') window.resetPageEntry = function (id) { const result=previousResetPageEntry.apply(this,arguments); if(id==='fifth'){mode='hub';modal=null;if(speechState==='recording')speechRecorder?.stop();} return result; };
  window.renderMyV128 = renderMy;
  window.AiderLogMyV128 = Object.freeze({
    render: renderMy,
    open(nextMode='hub') {
      const allowed = new Set(['hub','paper','task','work','speech','brain']);
      mode = allowed.has(nextMode) ? nextMode : 'hub';
      modal = null;
      renderMy();
    }
  });
  window.addEventListener('aiderdear-firebase-ready', connectSharedWorkspace);
  window.addEventListener('aiderdear-firebase-state', event => {
    if (event.detail?.user) connectSharedWorkspace();
    else if (sharedWorkspaceStop) { sharedWorkspaceStop(); sharedWorkspaceStop = null; }
    if (q('#fifth')?.classList.contains('active')) renderMy();
  });
  setTimeout(renderMy, 0);
  setTimeout(connectSharedWorkspace, 900);
})();
