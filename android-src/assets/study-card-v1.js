/* AiderLog My Space · Study Card v1 — offline-only curriculum and progress engine. */
(function () {
  'use strict';

  const SCHEMA = 'AIDERLOG_STUDY_CARD_V1';
  const VERSION = '1.0.0';
  const INTERVALS = [1, 7, 21, 60];
  const DOMAIN_LABELS = {
    politics:'정치', economy:'경제', society:'사회', culture:'문화', arts:'예술', science:'과학',
    world_history:'세계사', stocks:'주식', psychology:'심리학', current_affairs:'시사', general_knowledge:'상식'
  };
  const $ = (selector, root = document) => root.querySelector(selector);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const localKey = 'aiderlog.study-card.v1';
  let host = null;
  let leave = null;
  let tab = 'learn';
  let screen = 'overview';
  let moduleId = 'Y1-W01-D1';
  let step = 0;
  let reviewKey = '';
  let reviewRevealed = false;
  let markerObserver = null;
  let catalog = null;
  let moduleMap = new Map();
  let sourceMap = new Map();
  let validation = {ok:false, message:'학습 데이터를 읽지 못했습니다.'};

  const svg = (name, size = 20) => {
    const paths = {
      back:'<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
      book:'<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v18H7.5A3.5 3.5 0 0 0 4 23z"/><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v18h3.5A3.5 3.5 0 0 1 20 23z"/>',
      check:'<path d="m5 12 4 4L19 6"/>',
      clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
      source:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/>',
      orbit:'<circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-20 12 12)"/><circle cx="20" cy="9" r="1"/>'
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.orbit}</svg>`;
  };

  function dateKey(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function addDays(days, from = new Date()) { const date = new Date(from); date.setDate(date.getDate() + days); return dateKey(date); }
  function rootState() {
    if (typeof P !== 'undefined' && P && typeof P === 'object') return P;
    try { window.__aiderStudyPrivate = JSON.parse(localStorage.getItem(localKey) || '{}'); } catch { window.__aiderStudyPrivate = {}; }
    return window.__aiderStudyPrivate;
  }
  function baseState() {
    return {
      schemaVersion:1, curriculumVersion:VERSION, startedAt:null, activeModuleId:'Y1-W01-D1', completedModuleIds:[],
      moduleProgress:{}, reviewQueue:{}, reviewHistory:[], streak:{current:0,best:0,lastStudyDate:null},
      settings:{dailyMinutes:20,textScale:1,showSources:true}
    };
  }
  function migrateWorldLabStudyState() {
    const root = rootState();
    const old = root.worldLabStudy && typeof root.worldLabStudy === 'object' ? root.worldLabStudy : {};
    const next = {...baseState(), ...old};
    next.completedModuleIds = [...new Set((Array.isArray(old.completedModuleIds) ? old.completedModuleIds : []).filter(id => moduleMap.has(id)))];
    next.moduleProgress = old.moduleProgress && typeof old.moduleProgress === 'object' ? old.moduleProgress : {};
    next.reviewQueue = old.reviewQueue && typeof old.reviewQueue === 'object' ? old.reviewQueue : {};
    next.reviewHistory = Array.isArray(old.reviewHistory) ? old.reviewHistory.slice(-5000) : [];
    next.streak = {...baseState().streak, ...(old.streak || {})};
    next.settings = {...baseState().settings, ...(old.settings || {})};
    next.schemaVersion = 1;
    next.curriculumVersion = VERSION;
    if (!moduleMap.has(next.activeModuleId)) next.activeModuleId = 'Y1-W01-D1';
    root.worldLabStudy = next;
    return next;
  }
  function state() { return migrateWorldLabStudyState(); }
  function progress(id) {
    const s = state();
    s.moduleProgress[id] = {
      openedAt:0, completedAt:0, conceptStep:0, connectionOpened:false, connectionCheckPassed:false, answers:{}, mastery:0,
      ...(s.moduleProgress[id] || {})
    };
    s.moduleProgress[id].answers = s.moduleProgress[id].answers && typeof s.moduleProgress[id].answers === 'object' ? s.moduleProgress[id].answers : {};
    s.moduleProgress[id].answers.readConcepts = Array.isArray(s.moduleProgress[id].answers.readConcepts) ? s.moduleProgress[id].answers.readConcepts : [];
    return s.moduleProgress[id];
  }
  async function persist() {
    const root = rootState();
    try {
      if (typeof savePrivate === 'function') await savePrivate();
      else localStorage.setItem(localKey, JSON.stringify(root));
    } catch (error) {
      console.warn('[Study Card] progress save fallback', error);
      try { localStorage.setItem(localKey, JSON.stringify(root)); } catch {}
    }
  }

  function prepareCatalog() {
    catalog = window.AiderWorldLabYear1;
    if (!catalog || catalog.schema !== SCHEMA) return;
    const modules = Array.isArray(catalog.modules) ? catalog.modules : [];
    const ids = modules.map(row => row.id);
    const valid = Number(catalog.curriculum?.moduleCount) === 192 && modules.length === 192 &&
      new Set(ids).size === 192 && modules.every(row => Array.isArray(row.concepts) && row.concepts.length === 3);
    if (!valid) { validation = {ok:false,message:'학습 데이터 구조가 올바르지 않습니다.'}; return; }
    moduleMap = new Map(modules.map(row => [row.id, row]));
    sourceMap = new Map((catalog.sources || []).map(row => [row.id, row]));
    validation = {ok:true,message:''};
    migrateWorldLabStudyState();
  }

  function header(title = 'Study') {
    return `<header class="study-head-v1"><button type="button" data-study-back aria-label="My로 돌아가기">${svg('back',22)}</button><div><small>Study Card</small><h1>${esc(title)}</h1></div><span>OFFLINE</span></header>`;
  }
  function tabs() {
    return `<nav class="study-tabs-v1" aria-label="Study Card 메뉴">${[['learn','학습'],['review','복습'],['progress','진도']].map(([id,label]) => `<button type="button" class="${tab === id ? 'active' : ''}" data-study-tab="${id}" aria-selected="${tab === id}">${label}</button>`).join('')}</nav>`;
  }
  function domainTags(domains = []) { return `<div class="study-tags-v1">${domains.map(id => `<span>${esc(DOMAIN_LABELS[id] || id)}</span>`).join('')}</div>`; }
  function currentModule() { return moduleMap.get(moduleId) || moduleMap.get(state().activeModuleId) || catalog.modules[0]; }
  function dueRows() { const today = dateKey(); return Object.entries(state().reviewQueue).filter(([,row]) => row?.dueDate && row.dueDate <= today).sort((a,b) => String(a[1].dueDate).localeCompare(String(b[1].dueDate))); }
  function nextDue() { return Object.values(state().reviewQueue).filter(row => row?.dueDate).sort((a,b) => String(a.dueDate).localeCompare(String(b.dueDate)))[0]; }
  function moduleStatus(module) {
    const s = state();
    if (s.completedModuleIds.includes(module.id)) return '완료';
    if (module.id === s.activeModuleId || progress(module.id).openedAt) return '진행 중';
    return '미학습';
  }

  function learnOverview() {
    const s = state(), module = moduleMap.get(s.activeModuleId) || catalog.modules[0];
    moduleId = module.id;
    const at = catalog.modules.findIndex(row => row.id === module.id);
    const upcoming = catalog.modules.slice(at + 1, at + 4);
    return `<section class="study-hero-v1"><div><small>${String(module.week).padStart(2,'0')}주 · DAY ${module.day}</small><h2>${esc(catalog.weekTopics?.find(row => Number(row.week) === Number(module.week))?.theme || `WEEK ${module.week}`)}</h2><p>${esc(module.title)}</p></div></section>
      <section class="study-focus-v1"><small>TODAY'S BIG QUESTION</small><h3>${esc(module.bigQuestion)}</h3>${domainTags(module.domains)}<div class="study-meta-v1"><span>${svg('clock',17)} 약 ${module.estimatedMinutes || 20}분</span><span>${esc(({structural:'구조 연결',causal:'인과 연결',analogical:'유추 연결',functional:'기능 연결'})[module.connectionType] || module.connectionType || '개념 연결')}</span>${module.asOf ? `<span>기준일 ${esc(module.asOf)}</span>` : ''}</div><button class="study-primary-v1" type="button" data-study-start="${esc(module.id)}">${progress(module.id).openedAt ? '오늘 학습 이어서' : '오늘 학습 시작'}</button></section>
      <section class="study-concept-preview-v1 study-preview-v166">${module.concepts.map((row,index)=>`<span><i>0${index+1}</i><b>${esc(row.title)}</b></span>`).join('')}</section><section class="study-next-v1"><header><div><small>RECOMMENDED ORDER</small><h3>다음 학습</h3></div><b>${s.completedModuleIds.length}/192</b></header>${upcoming.map(row => `<button type="button" data-study-open-module="${esc(row.id)}"><span>W${String(row.week).padStart(2,'0')} · D${row.day}</span><b>${esc(row.title)}</b><em>${moduleStatus(row)}</em></button>`).join('')}</section>`;
  }

  function sourcePanel(ids = []) {
    if (!state().settings.showSources) return '';
    const rows = [...new Set(ids)].map(id => sourceMap.get(id)).filter(Boolean);
    if (!rows.length) return '';
    return `<details class="study-sources-v1"><summary>${svg('source',16)} 출처 보기 · ${rows.length}</summary>${rows.map(row => `<article><b>${esc(row.institution || row.publisher || '출처')}</b><span>${esc(row.title || row.name || '')}${row.year ? ` · ${esc(row.year)}` : ''}</span>${row.url ? `<a href="${esc(row.url)}" target="_blank" rel="noopener noreferrer">원문 열기</a>` : ''}</article>`).join('')}</details>`;
  }
  function questionStep(module) {
    return `<section class="study-question-v1"><small>STEP A · 오늘의 질문</small><h2>${esc(module.title)}</h2><blockquote>${esc(module.bigQuestion)}</blockquote><div class="study-concept-preview-v1">${module.concepts.map((row,index) => `<span><i>0${index + 1}</i><b>${esc(row.title)}</b></span>`).join('')}</div><p>세 개념이 맡는 역할을 차례로 확인한 뒤 하나의 흐름으로 연결합니다.</p><em>${esc(module.connectionType || 'structural connection')}</em></section>`;
  }
  function conceptStep(module, concept, index) {
    const p = progress(module.id), read = p.answers.readConcepts.includes(concept.id);
    return `<article class="study-concept-v1"><header><span>CONCEPT ${index + 1} / 3</span><em>${esc(DOMAIN_LABELS[concept.domain] || concept.domain || '')}</em><h2>${esc(concept.title)}</h2></header>
      <section><small>정의</small><p>${esc(concept.definition)}</p></section><section><small>왜 중요한가</small><p>${esc(concept.whyItMatters)}</p></section><section><small>작동 원리</small><p>${esc(concept.mechanism)}</p></section>
      <div class="study-pair-v1"><section><small>사례 · ${esc(concept.example?.context || '')}</small><p>${esc(concept.example?.explanation || '')}</p></section><section><small>${esc(concept.distinction?.from || '유사 개념')}와 구분</small><p>${esc(concept.distinction?.explanation || '')}</p></section></div>
      <section class="study-correction-v1"><small>오개념</small><b>${esc(concept.misconception?.claim || '')}</b><p>${esc(concept.misconception?.correction || '')}</p></section>
      <section><small>한계와 주의</small><ul>${(concept.limitations || []).map(row => `<li>${esc(row)}</li>`).join('')}</ul></section>${sourcePanel(concept.sourceIds)}
      <div class="study-read-marker-v1 ${read ? 'read' : ''}" data-study-read-marker="${esc(concept.id)}">${svg('check',16)} ${read ? '읽음' : '여기까지 읽으면 다음으로 이동할 수 있어요.'}</div></article>`;
  }
  function connectionStep(module) {
    const p = progress(module.id), answer = Number.isInteger(p.answers.connectionAnswer) ? p.answers.connectionAnswer : null;
    const check = module.connection?.check || {};
    return `<section class="study-connection-v1"><header><small>STEP C</small><h2>CONNECTION OF THE DAY</h2><p>${esc(module.connection?.title || '')}</p></header><blockquote>${esc(module.connection?.summary || '')}</blockquote>
      <div class="study-flow-v1">${(module.connection?.steps || []).map((row,index) => { const concept = module.concepts.find(item => item.id === row.conceptId); return `<article><i>${index + 1}</i><span><small>${esc(row.role)}</small><b>${esc(concept?.title || '')}</b><p>${esc(row.statement)}</p></span></article>`; }).join('')}</div>
      <section class="study-integrated-v1"><small>하나의 흐름으로 이해하기</small><p>${esc(module.connection?.integratedExplanation || '')}</p></section><aside><small>이 연결을 조심해야 하는 경우</small><p>${esc(module.connection?.boundary || '')}</p></aside>
      <details class="study-removal-v1"><summary>왜 이 세 개념이 모두 필요한가</summary>${(module.connection?.removalTest || []).map(row => `<p><b>${esc(module.concepts.find(item => item.id === row.conceptId)?.title || '')}</b>${esc(row.breaksBecause)}</p>`).join('')}</details>
      <fieldset class="study-check-v1"><legend>연결 확인</legend><p>${esc(check.prompt || '')}</p>${(check.options || []).map((option,index) => { const selected = answer === index, correct = answer !== null && index === check.correctIndex, wrong = selected && answer !== check.correctIndex; return `<button type="button" class="${correct ? 'correct' : ''} ${wrong ? 'wrong' : ''}" data-study-answer="${index}"><i>${String.fromCharCode(65 + index)}</i><span>${esc(option)}</span></button>`; }).join('')}${answer !== null ? `<div class="study-answer-v1 ${answer === check.correctIndex ? 'correct' : 'wrong'}"><b>${answer === check.correctIndex ? '정답입니다.' : '다시 생각해보세요.'}</b><p>${esc(check.explanation || '')}</p></div>` : ''}</fieldset>${sourcePanel(module.sourceIds)}</section>`;
  }
  function completionStep(module) {
    const p = progress(module.id), complete = state().completedModuleIds.includes(module.id);
    return `<section class="study-complete-v1"><span>${svg('orbit',54)}</span><small>STEP D · 학습 완료</small><h2>${complete ? '오늘의 연결을 기록했습니다.' : '세 개념을 하나의 흐름으로 묶었습니다.'}</h2><p>${esc(module.title)}</p><div>${module.concepts.map(row => `<b>${svg('check',14)} ${esc(row.title)}</b>`).join('')}</div>${complete ? `<button type="button" class="study-secondary-v1" data-study-uncomplete>학습 완료 취소</button>` : `<button type="button" class="study-primary-v1" data-study-complete ${p.answers.readConcepts.length === 3 && Number.isInteger(p.answers.connectionAnswer) ? '' : 'disabled'}>학습 완료 · 복습 일정 만들기</button>`}<button type="button" class="study-link-v1" data-study-overview>학습 목록으로</button></section>`;
  }
  function lesson() {
    const module = currentModule(), p = progress(module.id);
    p.openedAt = p.openedAt || Date.now(); p.conceptStep = step;
    const content = step === 0 ? questionStep(module) : step <= 3 ? conceptStep(module, module.concepts[step - 1], step - 1) : step === 4 ? connectionStep(module) : completionStep(module);
    const read = step < 1 || step > 3 || p.answers.readConcepts.includes(module.concepts[step - 1].id);
    return `<div class="study-lesson-v1"><div class="study-step-label-v166">${module.week}주 · DAY ${module.day} · ${['질문','개념 1','개념 2','개념 3','연결','완료'][step]}</div><div class="study-lesson-progress-v1"><span style="width:${((step + 1) / 6) * 100}%"></span></div>${content}<footer class="study-lesson-actions-v1"><button type="button" data-study-prev ${step === 0 ? 'disabled' : ''}>이전</button><span>${step + 1} / 6</span>${step < 5 ? `<button class="primary" type="button" data-study-next ${read ? '' : 'disabled'}>${step === 4 ? '완료 확인' : '다음'}</button>` : '<button class="primary" type="button" data-study-overview>목록</button>'}</footer></div>`;
  }

  function resolveReview(key) {
    const parts = String(key).split('|'), module = moduleMap.get(parts[0]);
    if (!module) return null;
    if (parts[1] === 'connection') return {module, type:'connection', prompt:module.connection?.check?.prompt, answer:module.connection?.check?.options?.[module.connection?.check?.correctIndex], explanation:module.connection?.check?.explanation, options:module.connection?.check?.options};
    const concept = module.concepts[Number(parts[1])], card = concept?.reviewCards?.[Number(parts[2])];
    return card ? {module,concept,...card} : null;
  }
  function reviewView() {
    const due = dueRows();
    if (!reviewKey || !due.some(([key]) => key === reviewKey)) reviewKey = due[0]?.[0] || '';
    const item = resolveReview(reviewKey), next = nextDue();
    if (!item) return `<section class="study-empty-v1"><span>${svg('orbit',48)}</span><h2>오늘 예정된 복습이 없습니다.</h2><p>${next ? `다음 복습은 ${esc(next.dueDate)} · ${Object.values(state().reviewQueue).filter(row => row.dueDate === next.dueDate).length}개입니다.` : '학습을 완료하면 1·7·21·60일 복습 일정이 만들어집니다.'}</p><button type="button" class="study-primary-v1" data-study-tab="learn">학습으로 이동</button></section>`;
    const position = due.findIndex(([key]) => key === reviewKey) + 1;
    return `<section class="study-review-v1"><header><div><small>TODAY REVIEW</small><h2>${position} / ${due.length}</h2></div><span>${esc(item.type || 'recall')}</span></header><article class="study-review-card-v1"><small>${esc(item.module.title)}${item.concept ? ` · ${esc(item.concept.title)}` : ' · CONNECTION'}</small><h3>${esc(item.prompt)}</h3>${item.options && !reviewRevealed ? `<ol>${item.options.map(row => `<li>${esc(row)}</li>`).join('')}</ol>` : ''}${reviewRevealed ? `<div class="study-review-answer-v1"><small>정답</small><b>${esc(item.answer || '')}</b>${item.explanation ? `<p>${esc(item.explanation)}</p>` : ''}</div>` : '<button type="button" class="study-primary-v1" data-study-reveal>정답 확인</button>'}</article><footer><p>정답을 확인한 뒤 기억 상태를 직접 선택하세요.</p><div><button type="button" data-study-rate="again" ${reviewRevealed ? '' : 'disabled'}>다시</button><button type="button" data-study-rate="hard" ${reviewRevealed ? '' : 'disabled'}>어려움</button><button class="primary" type="button" data-study-rate="good" ${reviewRevealed ? '' : 'disabled'}>기억함</button></div></footer></section>`;
  }
  function progressView() {
    const s = state(), completed = s.completedModuleIds.length, now = dateKey(), due = Object.values(s.reviewQueue).filter(row => row.dueDate === now).length, overdue = Object.values(s.reviewQueue).filter(row => row.dueDate < now).length;
    const domains = Object.keys(DOMAIN_LABELS).map(id => [id, catalog.modules.filter(row => s.completedModuleIds.includes(row.id) && row.domains.includes(id)).length]);
    const recent = s.reviewHistory.filter(row => Date.now() - Number(row.at || 0) <= 28 * 86400000), accuracy = recent.length ? Math.round(recent.filter(row => row.result === 'good').length / recent.length * 100) : null;
    return `<section class="study-progress-v1"><header><small>YEAR 01 · 48 WEEKS</small><h2>나의 학습 궤도</h2></header><div class="study-progress-summary-v1"><article><span>완료 모듈</span><b>${completed}<small>/192</small></b></article><article><span>학습한 개념</span><b>${completed * 3}<small>/576</small></b></article><article><span>예정 · 밀림</span><b>${due}<small> · ${overdue}</small></b></article><article><span>연속 · 최고</span><b>${s.streak.current}<small> · ${s.streak.best}일</small></b></article></div><section class="study-week-grid-v1"><header><b>48주 진행</b><span>완료 · 진행 · 미학습</span></header><div>${Array.from({length:48},(_,index) => { const modules = catalog.modules.filter(row => row.week === index + 1), count = modules.filter(row => s.completedModuleIds.includes(row.id)).length, current = modules.some(row => row.id === s.activeModuleId); return `<button type="button" class="${count === 4 ? 'done' : current || count ? 'current' : ''}" data-study-week="${index + 1}" aria-label="${index + 1}주 · ${count}/4 완료"><span>${String(index + 1).padStart(2,'0')}</span><i>${count}/4</i></button>`; }).join('')}</div></section><section class="study-domain-progress-v1"><header><b>분야별 학습 범위</b><span>우열 점수가 아닌 완료 범위입니다.</span></header>${domains.map(([id,count]) => `<article><span>${esc(DOMAIN_LABELS[id])}</span><i><b style="width:${Math.min(100, count / 48 * 100)}%"></b></i><em>${count}</em></article>`).join('')}</section><section class="study-accuracy-v1"><span>최근 4주 복습</span><b>${accuracy === null ? '기록 부족' : `${accuracy}%`}</b><p>${recent.length ? `${recent.length}개의 자가평가 기록을 기준으로 표시합니다.` : '복습 결과가 쌓이면 기억함 비율을 표시합니다.'}</p></section></section>`;
  }

  function render() {
    if (!host) return;
    if (!catalog) prepareCatalog();
    if (!validation.ok) {
      host.innerHTML = `<div class="page study-page-v1 training-v166" data-css-typography>${header()}<section class="study-error-v1"><b>${esc(validation.message)}</b><p>앱을 완전히 종료한 뒤 다시 시작해주세요.</p></section></div>`;
      bind(); return;
    }
    state();
    const body = tab === 'learn' ? (screen === 'lesson' ? lesson() : learnOverview()) : tab === 'review' ? reviewView() : progressView();
    host.innerHTML = `<div class="page study-page-v1 training-v166" data-css-typography style="--study-text-scale:${Number(state().settings.textScale) || 1}">${header()}${tabs()}<main class="study-scroll-v1">${body}</main></div>`;
    bind(); observeMarker();
  }
  function observeMarker() {
    markerObserver?.disconnect();
    const marker = $('[data-study-read-marker]', host); if (!marker || marker.classList.contains('read')) return;
    markerObserver = new IntersectionObserver(async entries => {
      if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .55)) return;
      const p = progress(moduleId), id = marker.dataset.studyReadMarker;
      if (!p.answers.readConcepts.includes(id)) p.answers.readConcepts.push(id);
      marker.classList.add('read'); marker.innerHTML = `${svg('check',16)} 읽음`;
      $('[data-study-next]',host)?.removeAttribute('disabled');
      markerObserver.disconnect(); await persist();
    }, {threshold:[.55]});
    markerObserver.observe(marker);
  }
  function chooseNextModule() {
    const s = state(), at = catalog.modules.findIndex(row => row.id === moduleId);
    s.activeModuleId = catalog.modules.slice(at + 1).find(row => !s.completedModuleIds.includes(row.id))?.id || catalog.modules.find(row => !s.completedModuleIds.includes(row.id))?.id || moduleId;
  }
  function scheduleReviews(module) {
    const s = state(), queue = s.reviewQueue;
    module.concepts.forEach((concept, conceptIndex) => concept.reviewCards.forEach((card, cardIndex) => {
      const key = `${module.id}|${conceptIndex}|${cardIndex}`;
      if (!queue[key]) queue[key] = {moduleId:module.id,conceptId:concept.id,cardIndex,intervalIndex:0,dueDate:addDays(INTERVALS[0]),lastResult:'new'};
    }));
    const key = `${module.id}|connection`;
    if (!queue[key]) queue[key] = {moduleId:module.id,conceptId:'connection',cardIndex:0,intervalIndex:0,dueDate:addDays(INTERVALS[0]),lastResult:'new'};
  }
  function updateStreak() {
    const streak = state().streak, today = dateKey(), yesterday = addDays(-1);
    if (streak.lastStudyDate === today) return;
    streak.current = streak.lastStudyDate === yesterday ? Number(streak.current || 0) + 1 : 1;
    streak.best = Math.max(Number(streak.best || 0), streak.current); streak.lastStudyDate = today;
  }
  async function completeModule() {
    const module = currentModule(), p = progress(module.id), s = state();
    if (p.answers.readConcepts.length < 3 || !Number.isInteger(p.answers.connectionAnswer)) return;
    if (!s.completedModuleIds.includes(module.id)) s.completedModuleIds.push(module.id);
    p.completedAt = p.completedAt || Date.now(); p.mastery = p.connectionCheckPassed ? 1 : .8;
    s.startedAt = s.startedAt || Date.now(); scheduleReviews(module); updateStreak(); chooseNextModule(); step = 5;
    await persist(); render();
  }
  async function rateReview(result) {
    if (!reviewRevealed || !reviewKey) return;
    const s = state(), row = s.reviewQueue[reviewKey]; if (!row) return;
    s.reviewHistory.push({date:dateKey(),at:Date.now(),cardKey:reviewKey,result,durationMs:0});
    row.lastResult = result;
    if (result === 'again') row.dueDate = dateKey();
    else if (result === 'hard') { row.intervalIndex = Math.max(0, Number(row.intervalIndex || 0) - 1); row.dueDate = addDays(INTERVALS[row.intervalIndex]); }
    else { row.intervalIndex = Number(row.intervalIndex || 0) + 1; if (row.intervalIndex >= INTERVALS.length) delete s.reviewQueue[reviewKey]; else row.dueDate = addDays(INTERVALS[row.intervalIndex]); }
    reviewKey = ''; reviewRevealed = false; await persist(); render();
  }
  function startLesson(id) {
    moduleId = moduleMap.has(id) ? id : state().activeModuleId; const p = progress(moduleId);
    step = Math.max(0, Math.min(5, Number(p.conceptStep || 0))); screen = 'lesson';
    try { history.pushState({aiderStudyDetail:true}, '', location.href); } catch {}
    render();
  }
  function handleBack() {
    if (screen === 'lesson') { screen = 'overview'; step = 0; render(); return true; }
    leave?.(); return true;
  }
  function bind() {
    if (!host) return;
    host.onclick = async event => {
      const target = event.target;
      if (target.closest('[data-study-back]')) { handleBack(); return; }
      const tabButton = target.closest('[data-study-tab]'); if (tabButton) { tab = tabButton.dataset.studyTab; screen = 'overview'; reviewKey = ''; reviewRevealed = false; render(); return; }
      const starter = target.closest('[data-study-start]'); if (starter) { startLesson(starter.dataset.studyStart); return; }
      const opener = target.closest('[data-study-open-module]'); if (opener) { state().activeModuleId = opener.dataset.studyOpenModule; await persist(); startLesson(opener.dataset.studyOpenModule); return; }
      if (target.closest('[data-study-prev]')) { step = Math.max(0, step - 1); progress(moduleId).conceptStep = step; await persist(); render(); return; }
      if (target.closest('[data-study-next]')) { step = Math.min(5, step + 1); progress(moduleId).conceptStep = step; if (step === 4) progress(moduleId).connectionOpened = true; await persist(); render(); return; }
      const answer = target.closest('[data-study-answer]'); if (answer) { const p = progress(moduleId), module = currentModule(); p.answers.connectionAnswer = Number(answer.dataset.studyAnswer); p.connectionCheckPassed = p.answers.connectionAnswer === module.connection.check.correctIndex; await persist(); render(); return; }
      if (target.closest('[data-study-complete]')) { await completeModule(); return; }
      if (target.closest('[data-study-uncomplete]')) { if (!confirm('완료 상태만 취소할까요? 과거 복습 이력과 큐는 유지됩니다.')) return; const s=state(); s.completedModuleIds=s.completedModuleIds.filter(id=>id!==moduleId); progress(moduleId).completedAt=0; await persist(); render(); return; }
      if (target.closest('[data-study-overview]')) { screen='overview';step=0;render();return; }
      if (target.closest('[data-study-reveal]')) { reviewRevealed=true;render();return; }
      const rate=target.closest('[data-study-rate]');if(rate){await rateReview(rate.dataset.studyRate);return;}
      const week=target.closest('[data-study-week]');if(week){tab='learn';screen='overview';const first=catalog.modules.find(row=>row.week===Number(week.dataset.studyWeek));if(first){state().activeModuleId=first.id;await persist();}render();}
    };
  }

  window.addEventListener('popstate', () => { if (host && screen === 'lesson') { screen = 'overview'; step = 0; render(); } });
  window.addEventListener('aiderlog:study-card-data-ready', () => { prepareCatalog(); if (host) render(); });
  prepareCatalog();
  window.migrateWorldLabStudyState = migrateWorldLabStudyState;
  window.AiderStudyCardV1 = Object.freeze({
    render(nextHost, onBack) { host = nextHost; leave = onBack; render(); },
    handleBack,
    counts() { if (!validation.ok) return {completed:0,due:0,concepts:0}; const s=state(); return {completed:s.completedModuleIds.length,due:dueRows().length,concepts:s.completedModuleIds.length*3}; },
    validate() { return {...validation,modules:catalog?.modules?.length || 0,concepts:(catalog?.modules || []).reduce((sum,row)=>sum+(row.concepts?.length||0),0)}; }
  });
})();
