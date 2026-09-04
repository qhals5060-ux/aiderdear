(function () {
  'use strict';

  const SPEECH_KEY = 'aiderlog.offline.speech.v129';
  const BRAIN_KEY = 'aiderlog.offline.brain.v129';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escText = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
  const todayKey = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const id = prefix => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));
  const mean = rows => rows.length ? rows.reduce((sum, value) => sum + Number(value || 0), 0) / rows.length : 0;
  const daysAgo = value => Math.floor((new Date(todayKey()) - new Date(value)) / 86400000);
  const icon = name => {
    const paths = {
      back:'<path d="m15 18-6-6 6-6"/><path d="M9 12h10"/>',
      today:'<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>',
      train:'<path d="M5 19V8l7-4 7 4v11"/><path d="M8 19v-5h8v5M9 9h6"/>',
      talk:'<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
      phrase:'<path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
      report:'<path d="M5 20V9M12 20V4M19 20v-7"/><path d="M3 20h18"/>',
      arrow:'<path d="M5 12h14M14 7l5 5-5 5"/>',
      brain:'<path d="M10 5a4 4 0 0 0-6 3.5A3.5 3.5 0 0 0 5 15v1a4 4 0 0 0 5 3.5zM14 5a4 4 0 0 1 6 3.5A3.5 3.5 0 0 1 19 15v1a4 4 0 0 1-5 3.5z"/><path d="M10 9H8M14 9h2M10 15H8M14 15h2"/>',
      change:'<path d="m4 17 5-5 4 3 7-9"/><path d="M15 6h5v5"/>',
      settings:'<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.4 1A7 7 0 0 0 15 6l-.3-2.6h-4L10.5 6A7 7 0 0 0 9 7.1l-2.4-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.4-1A7 7 0 0 0 10.5 18l.2 2.6h4L15 18a7 7 0 0 0 1.5-1.1l2.4 1 2-3.4-2-1.5c.1-.3.1-.7.1-1z"/>',
      lock:'<rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
      download:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 20h14"/>',
      upload:'<path d="M12 16V4M7 9l5-5 5 5"/><path d="M5 20h14"/>',
      trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/>'
    };
    return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.arrow}</svg>`;
  };

  function readLocal(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key) || 'null'); return value && typeof value === 'object' ? value : structuredClone(fallback); }
    catch { return structuredClone(fallback); }
  }

  const speechDefault = {
    sessions: [],
    profile: { vocabulary:55, literacy:55, logic:55, structure:55, questions:55, rebuttal:55, persuasion:55, judgment:55 },
    level: 1,
    settings: { dailyMinutes:25 },
    lastTraining: ''
  };
  const brainDefault = {
    sessions: [], recallItems: [], checks: [],
    difficulty: { memory:1, working:1, attention:1, executive:1, spatial:1 },
    settings: { fontScale:1, sound:true, vibration:true, minutes:10, weeklyGoal:5 },
    baselineDays: [], lastTypes: []
  };

  let speechData = readLocal(SPEECH_KEY, speechDefault);
  let brainData = readLocal(BRAIN_KEY, brainDefault);
  let speechHost = null, speechBack = null, brainHost = null, brainBack = null;
  let speechUI = { tab:'today', exercise:null, conversation:null, result:null, expressionResult:null };
  let brainUI = { tab:'today', session:null, practiceLabel:'' };

  function persistOffline() {
    localStorage.setItem(SPEECH_KEY, JSON.stringify(speechData));
    localStorage.setItem(BRAIN_KEY, JSON.stringify(brainData));
    try {
      if (typeof P !== 'undefined') {
        P.offlineSpeechV129 = structuredClone(speechData);
        P.offlineBrainV129 = structuredClone(brainData);
        if (typeof savePrivate === 'function') Promise.resolve(savePrivate()).catch(() => {});
      }
    } catch {}
  }

  function hydratePrivate() {
    try {
      if (typeof P === 'undefined') return;
      if (!speechData.sessions.length && P.offlineSpeechV129?.sessions?.length) speechData = structuredClone(P.offlineSpeechV129);
      if (!brainData.sessions.length && P.offlineBrainV129?.sessions?.length) brainData = structuredClone(P.offlineBrainV129);
    } catch {}
  }

  const speechSkills = [
    ['vocabulary','01','어휘 정밀도','막연한 표현을 구체적인 개념으로 좁힙니다.'],
    ['literacy','02','문해력','핵심 주장·근거·숨은 전제를 분리합니다.'],
    ['logic','03','논리력','주장과 근거의 연결 및 오류를 검토합니다.'],
    ['structure','04','구성력','결론·근거·예외·판단을 구조화합니다.'],
    ['questions','05','질문력','기준·조건·예외를 드러내는 질문을 만듭니다.'],
    ['rebuttal','06','반론 능력','인정한 뒤 주장만 검토하는 반론을 연습합니다.'],
    ['persuasion','07','설득력','상대 기준과 대안을 포함해 제안합니다.'],
    ['judgment','08','종합 판단','찬반을 넘어 조건부 결론을 만듭니다.']
  ];
  const passages = [
    { topic:'조직문화', text:'회의가 잦은 조직은 정보를 공유할 기회가 많지만, 모든 회의가 의사결정의 질을 높이는 것은 아니다. 목적과 결정권자가 불분명한 회의는 책임을 분산시키고 실제 업무 시간을 줄일 수 있다. 따라서 회의 횟수보다 어떤 문제를 누구와 어떤 기준으로 결정하는지가 생산성에 더 직접적인 영향을 준다.', claim:'회의의 수보다 목적·참여자·결정 기준이 생산성에 중요하다.' },
    { topic:'AI와 일', text:'업무 자동화는 반복 작업을 줄이고 처리 속도를 높일 수 있다. 그러나 절약된 시간이 직원의 학습과 더 가치 있는 업무로 이어지지 않고 단순히 더 많은 과업으로 채워진다면 개인이 체감하는 효율은 낮을 수 있다. 자동화의 효과는 기술 자체보다 조직이 확보한 시간을 어떻게 배분하는지에 달려 있다.', claim:'자동화의 개인적 효과는 확보된 시간을 조직이 어떻게 배분하는지에 좌우된다.' },
    { topic:'주거', text:'도심 주거비가 오르면 외곽 이동이 늘어날 수 있지만 통근 시간과 돌봄 비용까지 고려하면 단순히 주거비가 싼 지역이 더 경제적이라고 단정하기 어렵다. 주거 선택은 월세나 매매가뿐 아니라 이동 시간, 돌봄 접근성, 직업 안정성을 함께 비교해야 한다.', claim:'주거 선택은 가격만이 아니라 시간·돌봄·직업 조건을 함께 비교해야 한다.' },
    { topic:'리더십', text:'구성원에게 자율성을 주는 리더십은 동기를 높일 수 있다. 다만 목표와 권한의 범위가 불명확하면 자율성은 방임으로 받아들여질 수 있다. 좋은 자율성은 개입이 없는 상태가 아니라 목표, 책임, 지원 요청 기준이 합의된 상태에 가깝다.', claim:'효과적인 자율성에는 명확한 목표·책임·지원 기준이 필요하다.' },
    { topic:'소비', text:'구독 서비스는 초기 비용을 낮추고 편의성을 높이지만 사용 빈도가 낮아도 지출이 자동으로 이어진다. 개별 가격이 작다는 이유로 여러 서비스를 유지하면 총비용을 과소평가하기 쉽다. 편의성의 가치는 실제 사용 빈도와 대체 가능성을 기준으로 판단해야 한다.', claim:'구독의 가치는 실제 사용 빈도와 대체 가능성을 기준으로 판단해야 한다.' }
  ];
  const conversationTopics = {
    직장:['성과가 높은 직원에게 중요한 업무가 집중되는 것은 공정한가?','회의 시간을 절반으로 줄이면 조직의 성과가 좋아질까?','재택근무의 자율성과 협업 책임은 어떻게 균형을 잡아야 할까?'],
    사회:['AI 자동화의 생산성은 누구에게 돌아가야 하는가?','능력주의는 공정한 기준이 될 수 있는가?','기술 발전의 편익과 사회적 비용을 어떻게 나눌까?'],
    인간관계:['가족 사이에도 명확한 경계가 필요한가?','친구 관계에서 솔직함과 배려가 충돌하면 무엇을 우선할까?','성공의 기준은 개인이 완전히 선택할 수 있는가?']
  };

  function deterministicAnalysis(text) {
    const clean = String(text || '').trim();
    const sentences = clean.split(/[.!?。！？\n]+/).map(row => row.trim()).filter(Boolean);
    const words = clean.replace(/[^가-힣A-Za-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
    const vagueSet = ['그냥','약간','뭔가','좋다','별로','아무튼','무조건','당연히','원래','대충'];
    const evidenceTerms = ['왜냐하면','때문','근거','예를 들어','사례','수치','경험','첫째','둘째'];
    const conditionTerms = ['다만','조건','경우','현재','상황','따라','만약','전제'];
    const counterTerms = ['반면','그러나','그럼에도','반론','한편','동의하지만','인정'];
    const claimTerms = ['생각한다','판단한다','결론','따라서','필요하다','중요하다','봅니다','입니다'];
    const uncertaintyTerms = ['확인한 범위','단정하기 어렵','추가 정보','가능성','불확실'];
    const countTerms = list => list.reduce((sum, term) => sum + (clean.split(term).length - 1), 0);
    const vague = countTerms(vagueSet), evidence = countTerms(evidenceTerms), condition = countTerms(conditionTerms), counter = countTerms(counterTerms), claim = countTerms(claimTerms), uncertainty = countTerms(uncertaintyTerms);
    const questions = (clean.match(/[?？]/g) || []).length + countTerms(['어떤 기준','무엇이','왜 ','어떻게','예외']);
    const repeats = Object.values(words.reduce((map, word) => { if (word.length > 1) map[word] = (map[word] || 0) + 1; return map; }, {})).filter(value => value >= 3).length;
    const uniqueRatio = words.length ? new Set(words).size / words.length : 0;
    const firstSentence = sentences[0] || '';
    const claimEarly = claimTerms.some(term => firstSentence.includes(term)) || /^(저는|제 판단|결론|핵심)/.test(firstSentence);
    const scores = {
      vocabulary:clamp(48 + uniqueRatio * 42 - vague * 11 - repeats * 5),
      literacy:clamp(42 + Math.min(24, sentences.length * 4) + (clean.length >= 120 ? 18 : clean.length / 8)),
      logic:clamp(42 + Math.min(30, evidence * 10) + Math.min(18, condition * 6) + claim * 4),
      structure:clamp(40 + (claimEarly ? 22 : 4) + Math.min(24, evidence * 8) + (sentences.length >= 4 ? 12 : 0)),
      questions:clamp(40 + questions * 16 + condition * 4),
      rebuttal:clamp(38 + counter * 16 + condition * 6 + evidence * 4),
      persuasion:clamp(40 + evidence * 9 + condition * 7 + countTerms(['이익','대안','우려','비용']) * 6),
      judgment:clamp(42 + condition * 9 + counter * 8 + uncertainty * 10)
    };
    let issue = '결론을 첫 문장에 배치해 핵심 판단을 먼저 보여주세요.';
    let reason = '결론이 늦으면 듣는 사람이 근거의 방향을 예측하느라 더 많은 부담을 느낍니다.';
    let action = '첫 문장을 “현재 조건에서는 …라고 판단합니다”로 시작하고 이후 근거를 붙여보세요.';
    if (vague) { issue = `“${vagueSet.find(term => clean.includes(term))}”처럼 범위가 넓은 표현이 판단을 흐립니다.`; reason='막연한 단어는 문제의 원인·범위·기준을 구분하지 못하게 합니다.'; action='무엇이, 누구에게, 어떤 조건에서 문제인지 한 단계 더 좁혀 쓰세요.'; }
    else if (!evidence) { issue='주장은 보이지만 이를 지지하는 서로 다른 근거가 부족합니다.'; reason='근거가 없으면 의견의 강도만 남고 상대가 검토할 수 있는 기준이 사라집니다.'; action='경험·수치·원리 중 성격이 다른 근거 두 가지를 덧붙이세요.'; }
    else if (!condition) { issue='판단이 적용되는 조건과 예외가 드러나지 않습니다.'; reason='복잡한 문제를 무조건적인 결론으로 표현하면 반례 하나에 전체 주장이 약해집니다.'; action='“다만 …인 경우에는 결론이 달라질 수 있습니다”를 한 문장 추가하세요.'; }
    const good = claimEarly ? '핵심 판단을 앞에 두어 답변의 방향이 분명합니다.' : evidence ? '주장 뒤에 근거를 연결하려는 구조가 보입니다.' : clean.length >= 80 ? '한 문장에 그치지 않고 판단을 설명하려고 했습니다.' : '질문에 대한 자신의 입장을 직접 표현했습니다.';
    const improved = `현재 정보와 조건을 기준으로 보면 ${clean ? clean.replace(/^(그냥|약간|뭔가)\s*/, '').slice(0, 90) : '핵심 판단을 먼저 제시할 필요가 있습니다'}. 다만 적용 범위가 달라지는 예외를 확인한 뒤 최종 결론을 조정할 수 있습니다.`;
    return { chars:clean.length, sentences:sentences.length, avgSentence:sentences.length ? Math.round(clean.length/sentences.length) : 0, evidence, condition, counter, questions, vague, repeats, claimEarly, scores, good, issue, reason, action, improved, next:!evidence?'서로 다른 종류의 근거 2개 만들기':!condition?'조건부 판단과 예외 추가하기':!counter?'상대 주장을 먼저 인정한 뒤 반론하기':'핵심을 3문장으로 압축하기' };
  }

  function updateSpeechProfile(scores) {
    Object.keys(speechData.profile).forEach(key => { speechData.profile[key] = clamp(speechData.profile[key] * .78 + (scores[key] || 50) * .22); });
    const average = mean(Object.values(speechData.profile));
    speechData.level = clamp(Math.ceil((average - 35) / 6), 1, 10);
  }

  function saveSpeechSession(kind, title, answers, analysis) {
    const row = { id:id('thought'), date:todayKey(), createdAt:Date.now(), kind, title, answers, analysis, scores:analysis.scores };
    speechData.sessions.push(row);
    speechData.lastTraining = todayKey();
    updateSpeechProfile(analysis.scores);
    persistOffline();
    return row;
  }

  function speechShell(content) {
    const tabs = [['today','today','오늘'],['training','train','훈련'],['conversation','talk','대화'],['expression','phrase','표현'],['report','report','리포트']];
    return `<div class="offline129 speech129" data-offline-speech><header class="offline129-head"><button data-offline-back aria-label="My로 돌아가기">${icon('back')}</button><div><small>OFFLINE THINKING LAB</small><h1>Speech Training</h1><p>더 어려운 말이 아니라, 더 정확하게 생각하고 성숙하게 대화하는 훈련</p></div><span>${icon('lock')} 기기 안에 저장</span></header><nav class="offline129-tabs" aria-label="지적 대화 훈련 메뉴">${tabs.map(([key,ic,label])=>`<button data-speech-tab="${key}" class="${speechUI.tab===key?'active':''}">${icon(ic)}<span>${label}</span></button>`).join('')}</nav><main class="offline129-main">${content}</main></div>`;
  }

  function speechTodayHtml() {
    const profile = speechData.profile, recent = speechData.sessions.at(-1), week = Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const key=d.toISOString().slice(0,10);return {key,done:speechData.sessions.some(row=>row.date===key)};});
    return `<section class="speech129-hero"><div><small>TODAY · 25 MINUTES</small><h2>오늘의 지적 대화 루틴</h2><p>이해 → 판단 → 구조 → 표현 → 대화의 순서로 한 주제를 끝까지 다룹니다.</p><button data-speech-daily>오늘 훈련 시작 ${icon('arrow')}</button></div><div class="speech129-level"><b>LV.${speechData.level}</b><span>THINKING ORBIT</span></div></section><section class="speech129-week"><header><b>이번 주</b><span>${week.filter(row=>row.done).length} / 5회</span></header><div>${week.map((row,i)=>`<i class="${row.done?'done':''}"><span>${['월','화','수','목','금','토','일'][i]}</span></i>`).join('')}</div></section><section class="speech129-focus"><header><div><small>COACH INSIGHT</small><h3>지금 가장 먼저 다듬을 능력</h3></div><b>${speechSkills.slice().sort((a,b)=>profile[a[0]]-profile[b[0]])[0][2]}</b></header><p>${recent?.analysis?.issue || '첫 훈련을 완료하면 답변의 구조와 어휘 사용을 규칙 기반으로 분석합니다.'}</p></section><section class="speech129-skills"><header><h3>8개 핵심 능력</h3><span>현재 프로필</span></header><div>${speechSkills.map(([key,no,label,desc])=>`<button data-speech-skill="${key}"><i>${no}</i><span><b>${label}</b><small>${desc}</small></span><em>${profile[key]}</em></button>`).join('')}</div></section>`;
  }

  function speechTrainingHtml() {
    return `<section class="offline129-section-head"><div><small>FOCUSED TRAINING</small><h2>능력별 훈련</h2><p>성인 생활과 업무에서 실제로 마주치는 문제를 사용합니다.</p></div><span>LEVEL ${speechData.level}</span></section><section class="speech129-training-grid">${speechSkills.map(([key,no,label,desc])=>`<article><i>${no}</i><h3>${label}</h3><p>${desc}</p><button data-speech-skill="${key}">훈련 시작 ${icon('arrow')}</button></article>`).join('')}</section>`;
  }

  function speechExerciseHtml() {
    const ex = speechUI.exercise;
    if (!ex) return speechTodayHtml();
    if (speechUI.result) return speechResultHtml(speechUI.result);
    const dailySteps = [
      ['UNDERSTAND','핵심을 한 문장으로 요약하세요.','글의 핵심 주장과 이를 지지하는 이유를 구분해 읽습니다.'],
      ['THINK','당신의 판단과 중요한 조건을 적어보세요.','찬성 근거, 반대 근거, 결론이 달라지는 조건을 함께 생각합니다.'],
      ['STRUCTURE','결론 → 근거 1 → 근거 2 → 반론 → 조건 → 최종 판단 순서로 작성하세요.','떠오른 생각을 검토 가능한 구조로 배열합니다.'],
      ['EXPRESS','같은 내용을 더 정확하고 간결한 문장으로 다시 써보세요.','막연한 표현과 과도한 단정을 줄입니다.'],
      ['CONVERSE','상대의 우려를 인정한 뒤 질문으로 대화를 이어가세요.','인정 → 구분 → 반론 → 근거 → 질문 구조를 사용합니다.']
    ];
    const step = ex.kind === 'daily' ? ex.step : 0;
    const [eyebrow,title,guide] = ex.kind === 'daily' ? dailySteps[step] : [ex.label.toUpperCase(),ex.prompt,'답변의 내용과 논리 구조를 기기 안에서 분석합니다.'];
    return `<section class="offline129-exercise"><header><button data-speech-exit>${icon('back')} 나가기</button><div><span>${ex.kind==='daily'?`${step+1} / 5`:'FOCUS'}</span><i style="--progress:${ex.kind==='daily'?(step+1)*20:50}%"></i></div></header>${ex.passage?`<article class="offline129-reading"><small>${escText(ex.passage.topic)}</small><p>${escText(ex.passage.text)}</p></article>`:''}<div class="offline129-question"><small>${eyebrow}</small><h2>${title}</h2><p>${guide}</p></div><label class="offline129-answer"><span>나의 답변</span><textarea id="speechAnswer129" placeholder="결론을 먼저 쓰고, 근거와 조건을 이어보세요.">${escText(ex.answers?.[step] || '')}</textarea><small>서버나 외부 AI로 전송하지 않습니다.</small></label><button class="offline129-primary" data-speech-submit>${ex.kind==='daily'&&step<4?'다음 단계':'답변 분석'} ${icon('arrow')}</button></section>`;
  }

  function speechResultHtml(result) {
    const a=result.analysis, labels=Object.fromEntries(speechSkills.map(([key,,label])=>[key,label]));
    return `<section class="offline129-result"><header><small>LOCAL ANALYSIS COMPLETE</small><h2>${escText(result.title)}</h2><p>생성형 API 없이 문장 구조와 표현 신호를 규칙 기반으로 분석했습니다.</p></header><div class="offline129-metrics"><article><span>문장</span><b>${a.sentences}</b><small>평균 ${a.avgSentence}자</small></article><article><span>근거 신호</span><b>${a.evidence}</b><small>서로 다른 근거 권장</small></article><article><span>조건 표현</span><b>${a.condition}</b><small>예외·전제</small></article><article><span>모호 표현</span><b>${a.vague}</b><small>적을수록 정밀</small></article></div><div class="offline129-score-list">${Object.entries(a.scores).map(([key,value])=>`<div><span>${labels[key]}</span><i><b style="width:${value}%"></b></i><em>${value}</em></div>`).join('')}</div><div class="offline129-feedback"><article class="good"><small>잘한 점</small><p>${escText(a.good)}</p></article><article class="issue"><small>가장 큰 문제</small><p>${escText(a.issue)}</p></article><article><small>왜 문제인가</small><p>${escText(a.reason)}</p></article><article><small>어떻게 수정할까</small><p>${escText(a.action)}</p></article><article class="wide"><small>개선된 예시</small><p>${escText(a.improved)}</p></article><article class="wide next"><small>다음 훈련</small><p>${escText(a.next)}</p></article></div><footer><button data-speech-exit>오늘 화면으로</button><button class="offline129-primary" data-speech-repeat>비슷한 문제 다시 풀기</button></footer></section>`;
  }

  function conversationHtml() {
    const convo = speechUI.conversation;
    if (!convo) return `<section class="offline129-section-head"><div><small>CONVERSATION LAB</small><h2>반대 관점을 통해 생각을 깊게 만듭니다.</h2><p>공격적인 논쟁이 아니라 근거·조건·기준을 확인하는 대화입니다.</p></div></section><section class="conversation129-categories">${Object.entries(conversationTopics).map(([category,topics])=>`<article><h3>${category}</h3><p>${topics[0]}</p><button data-conversation-start="${category}">대화 시작 ${icon('arrow')}</button></article>`).join('')}</section>`;
    if (convo.done && speechUI.result) return speechResultHtml(speechUI.result);
    return `<section class="conversation129-lab"><header><button data-conversation-close>${icon('back')} 주제 선택</button><span>${escText(convo.category)} · ${convo.turns.length}/3 TURN</span></header><article class="conversation129-topic"><small>TOPIC</small><h2>${escText(convo.topic)}</h2></article><div class="conversation129-thread"><div class="coach"><b>COACH</b><p>${escText(convo.coachPrompt)}</p></div>${convo.turns.map((turn,index)=>`<div class="user"><b>나 · ${index+1}</b><p>${escText(turn.answer)}</p></div><div class="coach"><b>COACH</b><p>${escText(turn.challenge)}</p></div>`).join('')}</div><label class="offline129-answer"><span>${convo.turns.length ? '다시 답하기' : '첫 판단'}</span><textarea id="conversationAnswer129" placeholder="상대의 관점을 먼저 요약하고 내 판단의 근거와 조건을 적어보세요."></textarea></label><footer>${convo.turns.length>=2?'<button data-conversation-finish>대화 분석</button>':''}<button class="offline129-primary" data-conversation-send>${convo.turns.length>=2?'한 번 더 답하기':'답변 보내기'} ${icon('arrow')}</button></footer></section>`;
  }

  function expressionHtml() {
    const result=speechUI.expressionResult;
    const examples=[['그건 아닌 것 같은데요.','그 결론에는 동의하기 어렵습니다. 전제가 충분히 성립하지 않는다고 보기 때문입니다.'],['무조건 이렇게 해야죠.','현재 조건에서는 이 방법의 이점이 더 크다고 봅니다.'],['저 사람 말도 일리는 있어요.','문제 제기 자체는 타당합니다. 다만 원인에 대한 해석에는 다른 가능성도 있습니다.']];
    return `<section class="offline129-section-head"><div><small>LANGUAGE UPGRADE</small><h2>어려운 단어보다 정확한 표현</h2><p>막연함·과도한 단정·감정적 반응을 검토 가능한 문장으로 바꿉니다.</p></div></section><section class="expression129-examples">${examples.map(([before,after])=>`<article><small>BEFORE</small><p>${before}</p><i>${icon('arrow')}</i><small>AFTER</small><b>${after}</b></article>`).join('')}</section><section class="expression129-work"><label class="offline129-answer"><span>다듬고 싶은 문장</span><textarea id="expressionAnswer129" placeholder="예: 그냥 이 방식은 별로인 것 같아요."></textarea></label><button class="offline129-primary" data-expression-analyze>표현 분석 ${icon('arrow')}</button>${result?`<article><small>UPGRADE</small><h3>${escText(result.improved)}</h3><p>${escText(result.action)}</p><span>다음: ${escText(result.next)}</span></article>`:''}</section>`;
  }

  function reportHtml() {
    const labels=Object.fromEntries(speechSkills.map(([key,,label])=>[key,label]));
    const weakest=Object.entries(speechData.profile).sort((a,b)=>a[1]-b[1])[0];
    return `<section class="offline129-section-head"><div><small>PRIVATE REPORT</small><h2>사고·대화 역량 변화</h2><p>타인과 비교하지 않고 이전의 나와 비교합니다.</p></div><span>${speechData.sessions.length} sessions</span></section><section class="report129-summary"><article><small>이번 주 좋아진 점</small><p>${speechData.sessions.length?'최근 답변을 기준으로 결론과 근거를 구분하는 신호가 누적되고 있습니다.':'첫 훈련 후 구체적인 변화가 표시됩니다.'}</p></article><article><small>반복되는 문제</small><p>${speechData.sessions.at(-1)?.analysis?.issue || '아직 분석할 답변이 없습니다.'}</p></article><article><small>다음 7일 목표</small><p>${weakest?`${labels[weakest[0]]} 훈련을 우선 배치합니다.`:'첫 훈련을 시작해보세요.'}</p></article></section><section class="offline129-score-list report">${Object.entries(speechData.profile).map(([key,value])=>`<div><span>${labels[key]}</span><i><b style="width:${value}%"></b></i><em>${value}</em></div>`).join('')}</section><section class="report129-history"><header><h3>최근 훈련</h3><span>기기 저장</span></header>${speechData.sessions.slice(-8).reverse().map(row=>`<article><time>${escText(row.date)}</time><span><b>${escText(row.title)}</b><small>${escText(row.kind)}</small></span><em>${Math.round(mean(Object.values(row.scores||{})))}</em></article>`).join('')||'<p>아직 완료한 훈련이 없습니다.</p>'}</section>`;
  }

  function renderSpeech() {
    if (!speechHost) return;
    let content = speechUI.exercise ? speechExerciseHtml() : speechUI.tab==='today'?speechTodayHtml():speechUI.tab==='training'?speechTrainingHtml():speechUI.tab==='conversation'?conversationHtml():speechUI.tab==='expression'?expressionHtml():reportHtml();
    speechHost.innerHTML = speechShell(content);
    bindSpeech();
  }

  function startSpeechExercise(skill='daily') {
    const passage = passages[(new Date().getDate()+speechData.sessions.length) % passages.length];
    const found = speechSkills.find(row=>row[0]===skill);
    const prompts={vocabulary:'“회사 분위기가 안 좋다”를 의미가 겹치지 않는 정확한 표현 3개로 바꿔보세요.',literacy:'지문의 핵심 주장과 필자가 말하지 않은 내용을 구분해 한 문단으로 쓰세요.',logic:'주장과 근거 사이에 숨어 있는 전제와 필요한 추가 정보를 적어보세요.',structure:'결론·근거 2개·반론·조건·최종 판단 순서로 의견을 구성하세요.',questions:'상대의 기준과 예외를 드러내는 깊이 있는 질문 3개를 만드세요.',rebuttal:'상대 주장을 가장 강한 형태로 요약한 뒤 인정→구분→반론→근거→질문으로 답하세요.',persuasion:'상대의 우려를 인정하고 내 제안·근거·이익·대안을 포함해 설득하세요.',judgment:'찬성·반대 근거와 결론이 달라지는 조건을 포함해 조건부 판단을 만드세요.'};
    speechUI.result=null;
    speechUI.exercise={kind:skill==='daily'?'daily':'focus',skill,label:found?.[2]||'오늘의 훈련',prompt:prompts[skill]||'',passage,step:0,answers:[]};
    renderSpeech();
  }

  function finishSpeechExercise() {
    const ex=speechUI.exercise, combined=ex.answers.join('\n');
    const analysis=deterministicAnalysis(combined), title=ex.kind==='daily'?'오늘의 25분 지적 대화 루틴':ex.label;
    saveSpeechSession(ex.kind,title,ex.answers,analysis);
    speechUI.result={title,analysis}; renderSpeech();
  }

  function conversationChallenge(turn, answer) {
    const options=[
      '말씀한 결론이 성립하려면 반드시 참이어야 하는 전제는 무엇인가요?',
      '그 판단에서 가장 큰 이익을 얻는 사람과 비용을 부담하는 사람은 같은가요?',
      '반대 입장의 사람이 동의할 수 있는 부분을 먼저 요약한 뒤 다시 답해보세요.',
      '조건이 바뀌면 결론도 달라질까요? 예외가 되는 상황을 하나 제시해보세요.',
      '지금 제시한 두 근거가 사실상 같은 의미를 반복하는 것은 아닌가요? 다른 종류의 근거를 들어보세요.'
    ];
    return options[(turn + answer.length) % options.length];
  }

  function bindSpeech() {
    $('[data-offline-back]',speechHost)?.addEventListener('click',()=>speechBack?.());
    $$('[data-speech-tab]',speechHost).forEach(button=>button.onclick=()=>{speechUI={...speechUI,tab:button.dataset.speechTab,exercise:null,result:null,expressionResult:null};renderSpeech();});
    $('[data-speech-daily]',speechHost)?.addEventListener('click',()=>startSpeechExercise('daily'));
    $$('[data-speech-skill]',speechHost).forEach(button=>button.onclick=()=>startSpeechExercise(button.dataset.speechSkill));
    $('[data-speech-exit]',speechHost)?.addEventListener('click',()=>{speechUI.exercise=null;speechUI.result=null;speechUI.tab='today';renderSpeech();});
    $('[data-speech-submit]',speechHost)?.addEventListener('click',()=>{const value=$('#speechAnswer129',speechHost)?.value.trim();if(!value){alert('생각을 한 문장 이상 적어주세요.');return;}const ex=speechUI.exercise;ex.answers[ex.step]=value;if(ex.kind==='daily'&&ex.step<4){ex.step+=1;renderSpeech();}else finishSpeechExercise();});
    $('[data-speech-repeat]',speechHost)?.addEventListener('click',()=>{const skill=speechUI.exercise?.skill||'daily';startSpeechExercise(skill);});
    $$('[data-conversation-start]',speechHost).forEach(button=>button.onclick=()=>{const category=button.dataset.conversationStart,topics=conversationTopics[category],topic=topics[(speechData.sessions.length+new Date().getDate())%topics.length];speechUI.conversation={category,topic,turns:[],coachPrompt:'먼저 당신의 결론을 한 문장으로 말하고, 그 판단에 가장 중요한 기준을 설명해주세요.',done:false};renderSpeech();});
    $('[data-conversation-close]',speechHost)?.addEventListener('click',()=>{speechUI.conversation=null;speechUI.result=null;renderSpeech();});
    $('[data-conversation-send]',speechHost)?.addEventListener('click',()=>{const value=$('#conversationAnswer129',speechHost)?.value.trim();if(!value){alert('답변을 적어주세요.');return;}const c=speechUI.conversation;c.turns.push({answer:value,challenge:conversationChallenge(c.turns.length,value)});renderSpeech();});
    $('[data-conversation-finish]',speechHost)?.addEventListener('click',()=>{const c=speechUI.conversation,answers=c.turns.map(row=>row.answer),analysis=deterministicAnalysis(answers.join('\n'));saveSpeechSession('conversation',c.topic,answers,analysis);c.done=true;speechUI.result={title:'Conversation Lab 분석',analysis};renderSpeech();});
    $('[data-expression-analyze]',speechHost)?.addEventListener('click',()=>{const value=$('#expressionAnswer129',speechHost)?.value.trim();if(!value){alert('다듬을 문장을 적어주세요.');return;}speechUI.expressionResult=deterministicAnalysis(value);renderSpeech();});
  }

  const domainInfo = {
    memory:['기억력','사람·장소·이야기를 입력하고 지연 후 회상합니다.'],
    working:['작업기억','숫자·위치 순서를 유지하고 조작합니다.'],
    attention:['주의력','방해 자극 속에서 조건에 맞는 표적을 찾습니다.'],
    executive:['집행기능','규칙을 바꾸고 자동 반응을 억제합니다.'],
    spatial:['시공간','격자 위치·경로·회전을 재현합니다.']
  };
  const brainGames = [
    ['memory','얼굴·이름 기억'],['memory','이름·직업·장소'],['memory','짧은 이야기 회상'],
    ['working','숫자 순서'],['working','숫자 역순'],['working','위치 순서'],
    ['attention','표적 기호 찾기'],['attention','다른 그림 찾기'],['attention','조건 선택'],
    ['executive','색상 억제'],['executive','규칙 전환'],['executive','조건 분류'],
    ['spatial','격자 기억'],['spatial','경로 기억'],['spatial','도형 회전']
  ];
  const people = [['김민수','사진작가','부산'],['박영희','교사','서울'],['이준호','건축가','대전'],['최서윤','정원사','광주'],['정하린','번역가','인천'],['오지훈','요리사','제주']];
  const symbols=['○','△','□','◇','☆','＋','◎','▽'];
  const colorWords=[['빨강','#d45462'],['파랑','#416fd1'],['초록','#2e8a6d'],['보라','#7258b8']];

  function seeded(seed) { let value=seed%2147483647;if(value<=0)value+=2147483646;return()=>((value=value*16807%2147483647)-1)/2147483646; }
  function dailySeed(extra=0){return Number(todayKey().replace(/-/g,''))+extra+brainData.sessions.length*17;}
  function brainSessionGenerator(practiceLabel='',practiceDomain='') {
    const random=seeded(dailySeed(practiceLabel.length)), diff=Math.round(mean(Object.values(brainData.difficulty)));
    const chosen=[...people].sort(()=>random()-.5).slice(0,Math.min(3,2+Math.floor(diff/4)));
    const target=symbols[Math.floor(random()*symbols.length)], attention=Array.from({length:16},(_,i)=>i<3+diff?target:symbols[Math.floor(random()*symbols.length)]).sort(()=>random()-.5);
    const sequence=Array.from({length:3+Math.min(4,diff)},()=>Math.floor(random()*9)+1);
    const colorText=colorWords[Math.floor(random()*colorWords.length)], colorInk=colorWords.filter(row=>row[0]!==colorText[0])[Math.floor(random()*3)];
    const useSpatial=practiceDomain==='spatial'||(practiceDomain!=='executive'&&dailySeed()%2===1), spatialTarget=[...Array(16).keys()].sort(()=>random()-.5).slice(0,Math.min(6,3+Math.floor(diff/3)));
    const recall=chosen[Math.floor(random()*chosen.length)];
    return {id:id('brain-session'),practiceLabel,practiceDomain,useSpatial,step:0,startedAt:Date.now(),chosen,target,attention,sequence,colorText,colorInk,spatialTarget,spatialAnswers:[],spatialHidden:false,recall,answers:[],scores:{memory:0,working:0,attention:0,executive:0,spatial:0},sequenceHidden:false,completed:false};
  }

  function dueRecalls(){const now=todayKey();return brainData.recallItems.filter(row=>!row.retired&&row.nextDue<=now);}
  function weeklyBrain(){return Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);const key=d.toISOString().slice(0,10);return {key,done:brainData.sessions.some(row=>row.date===key)};});}
  function domainTrend(domain,days=28){const rows=brainData.sessions.filter(row=>daysAgo(row.date)<days&&row.scores?.[domain]!=null);if(rows.length<2)return 0;const half=Math.max(1,Math.floor(rows.length/2));return Math.round(mean(rows.slice(-half).map(r=>r.scores[domain]))-mean(rows.slice(0,half).map(r=>r.scores[domain])));}

  function brainShell(content) {
    const tabs=[['today','today','오늘'],['training','brain','훈련'],['change','change','변화'],['settings','settings','설정']];
    return `<div class="offline129 brain129" data-offline-brain style="--brain-scale:${brainData.settings.fontScale}"><header class="offline129-head"><button data-offline-back aria-label="My로 돌아가기">${icon('back')}</button><div><small>OFFLINE COGNITIVE WELLNESS</small><h1>Brain Training</h1><p>기억 → 방해 과제 → 지연회상을 잇는 매일 10분 훈련</p></div><span>${icon('lock')} 진단이 아닌 웰니스</span></header><nav class="offline129-tabs" aria-label="인지 훈련 메뉴">${tabs.map(([key,ic,label])=>`<button data-brain-tab="${key}" class="${brainUI.tab===key?'active':''}">${icon(ic)}<span>${label}</span></button>`).join('')}</nav><main class="offline129-main">${content}</main></div>`;
  }

  function brainTodayHtml() {
    const week=weeklyBrain(), due=dueRecalls().length, nextCheck=Math.max(0,28-(brainData.sessions.length%28));
    return `<section class="brain129-hero"><div><small>${new Date().toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long'})}</small><h2>오늘의 두뇌 훈련</h2><p>약 ${brainData.settings.minutes}분 · 기억 입력과 4개 방해·회상 훈련</p><button data-brain-start>훈련 시작하기 ${icon('arrow')}</button></div><div class="brain129-orbit">5<span>AREAS</span></div></section><section class="brain129-overview"><article><span>이번 주</span><b>${week.filter(row=>row.done).length} / ${brainData.settings.weeklyGoal}회</b><div class="brain129-week">${week.map(row=>`<i class="${row.done?'done':''}"></i>`).join('')}</div></article><article><span>장기 복습</span><b>${due}개 예정</b><small>1·3·7·14·30일 간격</small></article><article><span>다음 인지 체크</span><b>${nextCheck}일 후</b><small>의료 진단이 아닌 변화 확인</small></article></section><section class="brain129-domains"><header><h3>최근 인지영역 변화</h3><span>최근 4주</span></header><div>${Object.entries(domainInfo).map(([key,[label,desc]])=>{const trend=domainTrend(key);return `<article><i>${icon('brain')}</i><span><b>${label}</b><small>${desc}</small></span><em class="${trend>0?'up':trend<0?'down':''}">${trend>0?'＋':''}${trend||'유지'}${trend?'%':''}</em></article>`}).join('')}</div></section><section class="brain129-note"><b>첫 3일은 적응 기간입니다.</b><p>한 번의 점수로 능력을 판단하지 않고, 수행률 70~85%를 목표로 난이도를 조금씩 조정합니다.</p></section>`;
  }

  function brainTrainingHtml() {
    return `<section class="offline129-section-head"><div><small>EXTRA TRAINING</small><h2>인지영역별 추가 훈련</h2><p>오늘의 자동 프로그램 외에 원하는 영역을 한 번 더 훈련할 수 있습니다.</p></div><span>15 PROCEDURAL SETS</span></section><section class="brain129-catalog">${Object.entries(domainInfo).map(([domain,[label,desc]])=>`<article><header><div><small>LEVEL ${brainData.difficulty[domain]}</small><h3>${label}</h3><p>${desc}</p></div></header>${brainGames.filter(row=>row[0]===domain).map(([,game])=>`<button data-brain-practice="${escText(game)}" data-domain="${domain}"><span>${game}</span>${icon('arrow')}</button>`).join('')}</article>`).join('')}</section>`;
  }

  function brainChangeHtml() {
    const periods=[['최근 4주',28],['최근 3개월',90],['최근 6개월',180],['최근 1년',365]];
    return `<section class="offline129-section-head"><div><small>LONG-TERM CHANGE</small><h2>이전의 나와 비교한 변화</h2><p>타인과 비교하거나 ‘뇌 나이’를 계산하지 않습니다.</p></div><span>${brainData.sessions.length} sessions</span></section><section class="brain129-periods">${periods.map(([label,days])=>`<article><header><h3>${label}</h3><span>${brainData.sessions.filter(row=>daysAgo(row.date)<days).length}회</span></header>${Object.entries(domainInfo).map(([key,[name]])=>{const value=domainTrend(key,days);return `<div><span>${name}</span><i><b style="width:${50+Math.max(-35,Math.min(35,value))}%"></b></i><em class="${value>0?'up':value<0?'down':''}">${value>0?'＋':''}${value||'유지'}${value?'%':''}</em></div>`}).join('')}</article>`).join('')}</section><section class="brain129-history"><header><h3>최근 훈련</h3><span>기기 저장</span></header>${brainData.sessions.slice(-10).reverse().map(row=>`<article><time>${row.date}</time><span><b>${escText(row.label||'오늘의 훈련')}</b><small>${Math.round((row.duration||0)/60)}분 · 평균 ${Math.round(mean(Object.values(row.scores||{})))}%</small></span></article>`).join('')||'<p>아직 완료한 훈련이 없습니다.</p>'}</section>`;
  }

  function brainSettingsHtml() {
    const s=brainData.settings;
    return `<section class="offline129-section-head"><div><small>LOCAL SETTINGS</small><h2>훈련 환경과 데이터</h2><p>모든 핵심 훈련은 네트워크 없이 작동합니다.</p></div></section><section class="brain129-settings"><label><span><b>글자 크기</b><small>기본보다 조금 큰 접근성 글자</small></span><select id="brainFont129"><option value="1" ${s.fontScale==1?'selected':''}>기본</option><option value="1.1" ${s.fontScale==1.1?'selected':''}>크게</option><option value="1.2" ${s.fontScale==1.2?'selected':''}>아주 크게</option></select></label><label><span><b>훈련 시간</b><small>오늘의 자동 프로그램 목표</small></span><select id="brainMinutes129"><option value="8" ${s.minutes==8?'selected':''}>8분</option><option value="10" ${s.minutes==10?'selected':''}>10분</option><option value="12" ${s.minutes==12?'selected':''}>12분</option></select></label><label><span><b>효과음</b><small>정답 확인 시 부드러운 신호</small></span><input id="brainSound129" type="checkbox" ${s.sound?'checked':''}></label><label><span><b>진동</b><small>선택을 촉각으로 확인</small></span><input id="brainVibration129" type="checkbox" ${s.vibration?'checked':''}></label><div class="brain129-data"><button data-brain-export>${icon('download')} 데이터 백업</button><label>${icon('upload')} 데이터 복원<input id="brainImport129" type="file" accept="application/json"></label><button class="danger" data-brain-reset>${icon('trash')} 모든 훈련 데이터 삭제</button></div><p>백업 파일과 훈련 기록은 사용자가 직접 선택한 경우에만 기기 밖으로 이동합니다.</p></section>`;
  }

  function brainSessionHtml() {
    const s=brainUI.session;if(!s)return brainTodayHtml();
    if(s.completed)return brainResultHtml(s);
    const step=s.step;
    if(step===0)return `<section class="brain129-session"><header><button data-brain-exit>${icon('back')} 나가기</button><span>1 / 5 · 기억 입력</span></header><div class="brain129-instruction"><small>STEP 1</small><h2>아래 사람과 정보를 기억해보세요.</h2><p>바로 묻지 않습니다. 다른 훈련을 마친 뒤 다시 떠올립니다.</p></div><div class="brain129-people">${s.chosen.map(([name,job,city])=>`<article><i>${name.slice(0,1)}</i><b>${name}</b><span>${job}</span><small>${city}</small></article>`).join('')}</div><button class="offline129-primary" data-brain-next>기억했습니다 ${icon('arrow')}</button></section>`;
    if(step===1)return `<section class="brain129-session"><header><button data-brain-exit>${icon('back')} 나가기</button><span>2 / 5 · 주의력</span></header><div class="brain129-instruction"><small>STEP 2</small><h2>기호 ${s.target}을 모두 찾아 누르세요.</h2><p>방해 기호를 무시하고 표적에만 주의를 유지합니다.</p></div><div class="brain129-symbols">${s.attention.map((value,index)=>`<button data-attention-index="${index}" class="${s.answers.includes(index)?'selected':''}">${value}</button>`).join('')}</div><button class="offline129-primary" data-attention-done>선택 완료 ${icon('arrow')}</button></section>`;
    if(step===2)return `<section class="brain129-session"><header><button data-brain-exit>${icon('back')} 나가기</button><span>3 / 5 · 작업기억</span></header><div class="brain129-instruction"><small>STEP 3</small><h2>숫자를 기억한 뒤 역순으로 입력하세요.</h2><p>정보를 잠시 유지하면서 순서를 조작합니다.</p></div>${!s.sequenceHidden?`<div class="brain129-sequence">${s.sequence.map(v=>`<b>${v}</b>`).join('')}</div><button class="offline129-primary" data-sequence-hide>숨기고 답하기</button>`:`<label class="brain129-sequence-answer">역순 입력<input id="brainSequence129" inputmode="numeric" placeholder="예: 3 7 2"></label><button class="offline129-primary" data-sequence-submit>답 확인 ${icon('arrow')}</button>`}</section>`;
    if(step===3&&s.useSpatial)return `<section class="brain129-session"><header><button data-brain-exit>${icon('back')} 나가기</button><span>4 / 5 · 시공간</span></header><div class="brain129-instruction"><small>STEP 4</small><h2>${s.spatialHidden?'빛났던 위치를 모두 선택하세요.':'빛나는 격자의 위치를 기억하세요.'}</h2><p>공간 배치를 잠시 유지한 뒤 같은 위치를 재현합니다.</p></div><div class="brain129-spatial ${s.spatialHidden?'answering':''}">${Array.from({length:16},(_,index)=>`<button data-spatial-index="${index}" class="${!s.spatialHidden&&s.spatialTarget.includes(index)?'target':''} ${s.spatialAnswers.includes(index)?'selected':''}" ${s.spatialHidden?'':'disabled'} aria-label="격자 ${index+1}"></button>`).join('')}</div><button class="offline129-primary" ${s.spatialHidden?'data-spatial-done':'data-spatial-hide'}>${s.spatialHidden?'선택 완료':'숨기고 답하기'} ${icon('arrow')}</button></section>`;
    if(step===3)return `<section class="brain129-session"><header><button data-brain-exit>${icon('back')} 나가기</button><span>4 / 5 · 집행기능</span></header><div class="brain129-instruction"><small>STEP 4</small><h2>글자의 뜻이 아니라 글자색을 선택하세요.</h2><p>자동으로 읽으려는 반응을 멈추고 현재 규칙을 적용합니다.</p></div><strong class="brain129-stroop" style="color:${s.colorInk[1]}">${s.colorText[0]}</strong><div class="brain129-choices">${colorWords.map(([name,color])=>`<button data-stroop-answer="${name}"><i style="background:${color}"></i>${name}</button>`).join('')}</div></section>`;
    return `<section class="brain129-session"><header><button data-brain-exit>${icon('back')} 나가기</button><span>5 / 5 · 지연회상</span></header><div class="brain129-instruction"><small>STEP 5</small><h2>${s.recall[1]}였던 사람은 누구입니까?</h2><p>세션 처음에 보았던 정보를 다시 떠올립니다.</p></div><div class="brain129-recall">${s.chosen.map(([name])=>`<button data-recall-answer="${name}">${name}</button>`).join('')}</div></section>`;
  }

  function brainResultHtml(s) {
    return `<section class="brain129-result"><header><small>TODAY COMPLETE</small><h2>오늘 훈련을 완료했습니다.</h2><p>점수 경쟁이 아니라 최근 나의 수행과 난이도 조절에 사용됩니다.</p></header><div>${Object.entries(domainInfo).map(([key,[label]])=>`<article><span>${label}</span><b>${s.scores[key]||70}%</b><small>${(s.scores[key]||70)>=80?'최근보다 안정적':(s.scores[key]||70)>=65?'최근 평균 수준':'다음 훈련에서 난이도를 낮춥니다'}</small></article>`).join('')}</div><footer><span>총 시간 <b>${Math.max(1,Math.round((Date.now()-s.startedAt)/60000))}분</b></span><button class="offline129-primary" data-brain-finish>완료</button></footer></section>`;
  }

  function renderBrain() {
    if(!brainHost)return;
    const content=brainUI.session?brainSessionHtml():brainUI.tab==='today'?brainTodayHtml():brainUI.tab==='training'?brainTrainingHtml():brainUI.tab==='change'?brainChangeHtml():brainSettingsHtml();
    brainHost.innerHTML=brainShell(content);bindBrain();
  }

  function completeBrainSession() {
    const s=brainUI.session, selected=s.answers.filter(Number.isInteger), targets=s.attention.map((v,i)=>v===s.target?i:-1).filter(i=>i>=0), correct=selected.filter(i=>targets.includes(i)).length, falseTap=selected.filter(i=>!targets.includes(i)).length;
    s.scores.attention=clamp((correct/Math.max(1,targets.length))*100-falseTap*12,35,100);
    if(s.useSpatial)s.scores.executive=Math.round(mean(brainData.sessions.slice(-5).map(row=>row.scores?.executive).filter(Number.isFinite)))||70;
    else s.scores.spatial=Math.round(mean(brainData.sessions.slice(-5).map(row=>row.scores?.spatial).filter(Number.isFinite)))||70;
    Object.keys(brainData.difficulty).forEach(domain=>{const score=s.scores[domain]||70,recent=brainData.sessions.slice(-5).map(row=>row.scores?.[domain]).filter(Number.isFinite),average=mean([...recent,score]);if(average>88)brainData.difficulty[domain]=Math.min(10,brainData.difficulty[domain]+1);else if(average<65)brainData.difficulty[domain]=Math.max(1,brainData.difficulty[domain]-1);});
    s.completed=true;
    brainData.sessions.push({id:s.id,date:todayKey(),createdAt:Date.now(),label:s.practiceLabel||'오늘의 자동 훈련',duration:Math.round((Date.now()-s.startedAt)/1000),scores:structuredClone(s.scores)});
    const person=s.recall;brainData.recallItems.push({id:id('recall'),createdAt:todayKey(),nextDue:new Date(Date.now()+86400000).toISOString().slice(0,10),intervalIndex:0,prompt:`${person[1]}였던 사람`,answer:person[0],context:`${person[0]} · ${person[1]} · ${person[2]}`,retired:false});
    brainData.lastTypes=[s.practiceLabel||'daily',...brainData.lastTypes].slice(0,8);persistOffline();renderBrain();
  }

  function softFeedback(correct, answer) {
    if(brainData.settings.vibration&&navigator.vibrate)navigator.vibrate(correct?24:[20,35,20]);
    if(!correct)alert(`정답은 ${answer}입니다. 다음 문제에서 다시 떠올려보세요.`);
  }

  function bindBrain() {
    $('[data-offline-back]',brainHost)?.addEventListener('click',()=>brainBack?.());
    $$('[data-brain-tab]',brainHost).forEach(button=>button.onclick=()=>{brainUI.tab=button.dataset.brainTab;brainUI.session=null;renderBrain();});
    $('[data-brain-start]',brainHost)?.addEventListener('click',()=>{brainUI.session=brainSessionGenerator();renderBrain();});
    $$('[data-brain-practice]',brainHost).forEach(button=>button.onclick=()=>{brainUI.session=brainSessionGenerator(button.dataset.brainPractice,button.dataset.domain);renderBrain();});
    $('[data-brain-exit]',brainHost)?.addEventListener('click',()=>{if(confirm('현재 훈련을 끝내고 돌아갈까요?')){brainUI.session=null;renderBrain();}});
    $('[data-brain-next]',brainHost)?.addEventListener('click',()=>{brainUI.session.step=1;brainUI.session.answers=[];renderBrain();});
    $$('[data-attention-index]',brainHost).forEach(button=>button.onclick=()=>{const index=Number(button.dataset.attentionIndex),list=brainUI.session.answers;const at=list.indexOf(index);if(at>=0)list.splice(at,1);else list.push(index);renderBrain();});
    $('[data-attention-done]',brainHost)?.addEventListener('click',()=>{brainUI.session.step=2;renderBrain();});
    $('[data-sequence-hide]',brainHost)?.addEventListener('click',()=>{brainUI.session.sequenceHidden=true;renderBrain();});
    $('[data-sequence-submit]',brainHost)?.addEventListener('click',()=>{const value=$('#brainSequence129',brainHost)?.value.replace(/\D/g,''),answer=[...brainUI.session.sequence].reverse().join(''),correct=value===answer;brainUI.session.scores.working=correct?92:58;softFeedback(correct,answer.split('').join(' '));brainUI.session.step=3;renderBrain();});
    $$('[data-stroop-answer]',brainHost).forEach(button=>button.onclick=()=>{const correct=button.dataset.stroopAnswer===brainUI.session.colorInk[0];brainUI.session.scores.executive=correct?92:58;softFeedback(correct,brainUI.session.colorInk[0]);brainUI.session.step=4;renderBrain();});
    $('[data-spatial-hide]',brainHost)?.addEventListener('click',()=>{brainUI.session.spatialHidden=true;renderBrain();});
    $$('[data-spatial-index]',brainHost).forEach(button=>button.onclick=()=>{const index=Number(button.dataset.spatialIndex),list=brainUI.session.spatialAnswers,at=list.indexOf(index);if(at>=0)list.splice(at,1);else list.push(index);renderBrain();});
    $('[data-spatial-done]',brainHost)?.addEventListener('click',()=>{const s=brainUI.session,hit=s.spatialAnswers.filter(index=>s.spatialTarget.includes(index)).length,miss=s.spatialAnswers.filter(index=>!s.spatialTarget.includes(index)).length;s.scores.spatial=clamp(Math.round(hit/Math.max(1,s.spatialTarget.length)*100)-miss*12,35,100);softFeedback(s.scores.spatial>=70,s.spatialTarget.map(index=>index+1).join(', '));s.step=4;renderBrain();});
    $$('[data-recall-answer]',brainHost).forEach(button=>button.onclick=()=>{const correct=button.dataset.recallAnswer===brainUI.session.recall[0];brainUI.session.scores.memory=correct?94:55;softFeedback(correct,brainUI.session.recall[0]);completeBrainSession();});
    $('[data-brain-finish]',brainHost)?.addEventListener('click',()=>{brainUI.session=null;brainUI.tab='today';renderBrain();});
    const font=$('#brainFont129',brainHost);if(font)font.onchange=()=>{brainData.settings.fontScale=Number(font.value);persistOffline();renderBrain();};
    const minutes=$('#brainMinutes129',brainHost);if(minutes)minutes.onchange=()=>{brainData.settings.minutes=Number(minutes.value);persistOffline();};
    const sound=$('#brainSound129',brainHost);if(sound)sound.onchange=()=>{brainData.settings.sound=sound.checked;persistOffline();};
    const vibration=$('#brainVibration129',brainHost);if(vibration)vibration.onchange=()=>{brainData.settings.vibration=vibration.checked;persistOffline();};
    $('[data-brain-export]',brainHost)?.addEventListener('click',()=>{const blob=new Blob([JSON.stringify(brainData,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`AiderLog-Brain-${todayKey()}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
    const input=$('#brainImport129',brainHost);if(input)input.onchange=async()=>{try{const parsed=JSON.parse(await input.files[0].text());if(!parsed.sessions||!parsed.settings)throw new Error();brainData=parsed;persistOffline();renderBrain();}catch{alert('AiderLog Brain 백업 파일을 확인해주세요.');}};
    $('[data-brain-reset]',brainHost)?.addEventListener('click',()=>{if(!confirm('기기에 저장된 모든 Brain 훈련 데이터를 삭제할까요?'))return;brainData=structuredClone(brainDefault);persistOffline();renderBrain();});
  }

  window.AiderOfflineTrainingV129 = {
    renderSpeech(host,onBack){hydratePrivate();speechHost=host;speechBack=onBack;speechUI={tab:'today',exercise:null,conversation:null,result:null,expressionResult:null};renderSpeech();},
    renderBrain(host,onBack){hydratePrivate();brainHost=host;brainBack=onBack;brainUI={tab:'today',session:null,practiceLabel:''};renderBrain();},
    counts(){return {speech:speechData.sessions.length,brain:brainData.sessions.length};},
    analyze:deterministicAnalysis
  };
})();
