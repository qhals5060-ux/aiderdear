(() => {
  'use strict';

  const stage = document.querySelector('#paperStage');
  if (!stage) return;
  [...stage.children].forEach(child => {
    child.hidden = true;
    child.classList.add('paper-v120-legacy');
  });

  const paperHost = document.createElement('aider-paper-workspace-v120');
  const paperRoot = paperHost.attachShadow({ mode: 'open' });
  paperRoot.innerHTML = `
    <link rel="stylesheet" href="./paper-workspace-v120.css?v=120">
    <div class="paper-v120-surface">
      <main class="paper-app">
        <aside class="paper-sidebar">
          <div class="paper-brand"><span class="brand-mark">P</span><div><strong>Research OS</strong><small>EVIDENCE FIRST</small></div></div>
          <nav class="paper-nav" id="paperNav" aria-label="Paper 연구 메뉴">
            <button type="button" data-view="hub"><span>⌂</span><b>Research Hub</b><small>오늘의 연구</small></button>
            <button type="button" class="active" data-view="library"><span>▤</span><b>Library</b><small>논문과 자료</small></button>
            <button type="button" data-view="evidence"><span>✓</span><b>Evidence</b><small>근거 검증</small><i id="evidenceBadge">3</i></button>
            <button type="button" data-view="synthesis"><span>⌁</span><b>Synthesis</b><small>통합 분석</small></button>
            <button type="button" data-view="study"><span>◇</span><b>Study Workspace</b><small>아이디어와 설계</small></button>
            <button type="button" data-view="atlas"><span>◉</span><b>Brain Atlas</b><small>영역과 논문</small></button>
          </nav>
          <div class="sidebar-project"><span>ACTIVE PROJECT</span><strong>뇌 노화 × 인지예비능</strong><div><i style="--value:68%"></i></div><small>Evidence review 68%</small></div>
          <a class="sidebar-lab" href="https://sites.google.com/view/yooklab/home" target="_blank" rel="noopener" aria-label="Yoo Lab 연구실 사이트 열기"><span>MY LABORATORY</span><strong>Yoo Lab</strong><small>Computational Brain Science<br>&amp; AI Laboratory</small><em>SKKU · SAIHST · SMC <b>↗</b></em></a>
        </aside>
        <section class="paper-main">
          <header class="paper-topbar">
            <div class="project-switch"><span>RESEARCH PROJECT</span><button type="button" id="projectButton">뇌 노화와 인지 기능 연구 <b>⌄</b></button></div>
            <label class="global-search"><span>⌕</span><input id="globalSearch" type="search" placeholder="논문, 저자, 근거, 뇌 영역 검색"></label>
            <button type="button" class="secondary-button" id="guideButton">사용 안내</button>
            <button type="button" class="primary-button" id="importButton">＋ 논문 가져오기</button>
          </header>
          <div class="paper-content" id="paperContent" aria-live="polite"></div>
        </section>
      </main>

      <div class="drawer-backdrop" id="importBackdrop" hidden></div>
      <aside class="import-drawer" id="importDrawer" aria-hidden="true" aria-labelledby="importTitle">
        <header><div><span>GPT → AIDERLOG</span><h2 id="importTitle">검증 가능한 논문 가져오기</h2></div><button type="button" class="icon-button" id="closeImport" aria-label="닫기">×</button></header>
        <ol class="import-steps" aria-label="가져오기 단계"><li class="active"><b>1</b><span>프롬프트</span></li><li><b>2</b><span>결과 붙여넣기</span></li><li><b>3</b><span>검사·저장</span></li></ol>
        <section class="import-section">
          <div class="section-heading compact"><div><span>STEP 1</span><h3>ChatGPT에 논문과 함께 넣으세요</h3></div><button type="button" class="outline-button" id="copyPrompt">프롬프트 복사</button></div>
          <div class="upload-checklist"><span class="done">✓ PDF 원문</span><span>＋ 표 CSV/XLSX</span><span>＋ 그림 원본</span><span>＋ Supplement</span></div>
          <textarea id="promptText" class="prompt-box" readonly></textarea>
        </section>
        <section class="import-section">
          <div class="section-heading compact"><div><span>STEP 2</span><h3>AIDERLOG_PAPER_V3 결과를 붙여넣으세요</h3></div><button type="button" class="text-button" id="loadSampleJson">예시 결과 넣기</button></div>
          <textarea id="resultText" class="result-box" placeholder="GPT가 출력한 JSON을 여기에 붙여넣으세요."></textarea>
          <button type="button" class="primary-button wide" id="validateImport">결과 검사하기</button>
        </section>
        <section class="import-validation" id="importValidation" hidden></section>
      </aside>

      <dialog class="paper-dialog" id="paperDialog"><button type="button" class="dialog-close icon-button" data-dialog-close aria-label="닫기">×</button><div id="paperDialogContent"></div></dialog>
      <dialog class="guide-dialog" id="guideDialog"><button type="button" class="dialog-close icon-button" data-dialog-close aria-label="닫기">×</button><span class="eyebrow">PAPER GUIDE</span><h2>논문에서 연구 설계까지 이어지는 순서</h2><div class="guide-grid"><article><b>01</b><h3>Library</h3><p>논문을 정독형 화면으로 읽고 표·그림·피처와 원문 위치를 함께 확인합니다.</p></article><article><b>02</b><h3>Evidence</h3><p>원문 사실, AI 해석, 반대·제한 근거와 검토 상태를 분리합니다.</p></article><article><b>03</b><h3>Synthesis</h3><p>여러 논문의 대상·주제·방법·결과를 비교해 수렴과 상충을 찾습니다.</p></article><article><b>04</b><h3>Study Workspace</h3><p>연구 공백을 질문·가설·설계·분석 계획과 실행 순서로 전환합니다.</p></article></div><button type="button" class="primary-button wide" data-dialog-close>둘러보기 시작</button></dialog>
      <div class="toast" id="paperPreviewToast" role="status" aria-live="polite"></div>
    </div>`;
  stage.prepend(paperHost);
  stage.classList.add('paper-v120-ready');

  const $ = (selector, root = paperRoot) => root.querySelector(selector);
  const $$ = (selector, root = paperRoot) => [...root.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, match => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[match]);

  const papers = [
    {
      id: 'bethlehem-2022',
      title: 'Brain charts for the human lifespan',
      authors: 'Bethlehem, R. A. I., Seidlitz, J., White, S. R., et al.',
      year: 2022,
      journal: 'Nature',
      doi: '10.1038/s41586-022-04554-y',
      url: 'https://www.nature.com/articles/s41586-022-04554-y',
      type: '대규모 다기관 연구',
      population: '전 생애 · 101,457명',
      sample: '123,984 MRI scans',
      modality: 'Structural MRI',
      method: 'Normative modelling',
      topics: ['뇌 노화', '전 생애', 'Normative model'],
      status: 'verified',
      statusLabel: '메타데이터 확인',
      coverage: 76,
      summary: '전 생애에 걸친 뇌 구조 변화의 기준 곡선을 구축하고, 개인의 MRI 지표를 연령 규준과 비교할 수 있는 공개 자원을 제시한 연구입니다.',
      finding: '101,457명의 123,984개 MRI 스캔을 통합하여 임신 중기부터 100세까지의 구조적 뇌 발달·노화 궤적을 모델링했습니다.',
      limitation: 'MRI 연구 표본의 세계 인구 대표성 편향과 연구 간 획득·처리 이질성을 고려해야 합니다.',
      neuro: { region: '전뇌 형태계측', network: '해당 없음', atlas: '다기관 조화화', preprocessing: '연구별 MRI 처리 후 규준 통합', statistics: '비선형 성장곡선·centile' }
    },
    {
      id: 'marek-2022',
      title: 'Reproducible brain-wide association studies require thousands of individuals',
      authors: 'Marek, S., Tervo-Clemmens, B., Calabro, F. J., et al.',
      year: 2022,
      journal: 'Nature',
      doi: '10.1038/s41586-022-04492-9',
      url: 'https://www.nature.com/articles/s41586-022-04492-9',
      type: '방법론·재현성 연구',
      population: 'ABCD · HCP · UK Biobank',
      sample: '약 50,000명',
      modality: 'sMRI · resting-state fMRI',
      method: 'BWAS · 재표집 분석',
      topics: ['재현성', '뇌-행동 연관', '표본 크기'],
      status: 'verified',
      statusLabel: '메타데이터 확인',
      coverage: 84,
      summary: '대규모 데이터셋을 이용해 뇌-행동 연관 연구의 효과크기와 재현성이 표본 크기에 따라 어떻게 달라지는지 평가했습니다.',
      finding: '전형적인 소규모 BWAS는 효과크기 과대추정과 재현 실패에 취약했고, 표본이 수천 명 규모가 되면서 재현성이 개선되었습니다.',
      limitation: '이 결론은 개인차 기반 BWAS에 관한 것으로 병변·중재·개인 내 연구 등 효과가 더 큰 설계에 그대로 적용하면 안 됩니다.',
      neuro: { region: '전뇌', network: 'Resting-state connectivity', atlas: '데이터셋별', preprocessing: '대규모 코호트 표준 파이프라인', statistics: 'Univariate·multivariate BWAS' }
    },
    {
      id: 'vanerp-2018',
      title: 'Cortical Brain Abnormalities in 4474 Individuals With Schizophrenia and 5098 Control Subjects',
      authors: 'van Erp, T. G. M., Walton, E., Hibar, D. P., et al.',
      year: 2018,
      journal: 'Biological Psychiatry',
      doi: '10.1016/j.biopsych.2018.04.023',
      url: 'https://pubmed.ncbi.nlm.nih.gov/29960671/',
      type: 'ENIGMA 메타분석',
      population: '조현병 4,474명 · 대조군 5,098명',
      sample: '39개 기관 · 9,572명',
      modality: 'Structural MRI',
      method: 'Cortical thickness·surface area meta-analysis',
      topics: ['조현병', '피질 두께', '표면적'],
      status: 'verified',
      statusLabel: '초록 근거 확인',
      coverage: 72,
      summary: 'ENIGMA 표준 분석을 통해 조현병의 피질 두께와 표면적 차이를 대규모 다기관 표본에서 분석했습니다.',
      finding: '조현병 집단에서 광범위한 피질 두께 감소와 표면적 감소가 관찰되었으며, 전두엽과 측두엽에서 큰 효과가 보고되었습니다.',
      limitation: '약물 복용, 증상 중증도와 질병 기간이 피질 측정치와 연관될 수 있어 원인 해석에 주의해야 합니다.',
      neuro: { region: '전두엽·측두엽 중심', network: '해당 없음', atlas: 'ENIGMA cortical protocol', preprocessing: '기관별 표준화된 피질 형태계측', statistics: 'Meta-analysis · Cohen’s d' }
    },
    {
      id: 'seitz-2024',
      title: 'BrainAGE, brain health, and mental disorders: A systematic review',
      authors: 'Seitz-Holland, J., Haas, S. S., Penzel, N., et al.',
      year: 2024,
      journal: 'Neuroscience & Biobehavioral Reviews',
      doi: '10.1016/j.neubiorev.2024.105581',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38354871/',
      type: '체계적 문헌고찰',
      population: '신경정신질환 · 건강 대조군',
      sample: '30개 연구',
      modality: '다양한 neuroimaging',
      method: 'BrainAGE systematic review',
      topics: ['BrainAGE', '정신질환', '외부 검증'],
      status: 'abstract',
      statusLabel: '초록 기반 예시',
      coverage: 61,
      summary: '정신질환과 BrainAGE 차이를 다룬 연구들을 검토하고 생물학적 나이 지표로서의 타당성을 비판적으로 평가했습니다.',
      finding: '다수 질환군에서 높은 BrainAGE가 보고되었지만 임상 특성과의 연관은 혼재되어 있었습니다.',
      limitation: '훈련 표본 다양성, multimodal 연구, 외부 검증과 종단 자료가 부족하여 생물학적 나이 지표 해석에 제약이 있습니다.',
      neuro: { region: '전뇌 brain-age features', network: '연구별 상이', atlas: '연구별 상이', preprocessing: '연구 간 높은 이질성', statistics: '정성적 체계적 고찰' }
    },
    {
      id: 'yang-2024',
      title: 'Association of Cognitive Reserve Indicator with Cognitive Decline and Structural Brain Differences in Middle and Older Age',
      authors: 'Yang, W., et al.',
      year: 2024,
      journal: 'Journal of Prevention of Alzheimer’s Disease',
      doi: '10.14283/jpad.2024.54',
      url: 'https://doi.org/10.14283/jpad.2024.54',
      type: '종단 코호트 연구',
      population: 'UK Biobank 중·노년층',
      sample: '평균 추적 9년',
      modality: 'Structural MRI · cognition',
      method: '복합 CR 지표 · 종단 분석',
      topics: ['인지예비능', '인지 저하', 'UK Biobank'],
      status: 'abstract',
      statusLabel: '초록 기반 예시',
      coverage: 58,
      summary: '사회행동적 대리변수로 구성한 인지예비능 지표가 중·노년기의 인지 변화 및 뇌 구조 차이와 연관되는지 평가했습니다.',
      finding: '높은 인지예비능은 일부 인지 기능의 느린 저하와 연관되었으며, 전반적 인지 저하와의 연관은 구조적 뇌 차이와 독립적으로 나타났습니다.',
      limitation: '인지예비능 복합 지표의 구성과 인과 방향, UK Biobank 선택 편향을 별도로 검토해야 합니다.',
      neuro: { region: '해마·전뇌 용적·미세혈관 부담', network: '해당 없음', atlas: 'UK Biobank imaging', preprocessing: '코호트 표준 파이프라인', statistics: 'Longitudinal association models' }
    },
    {
      id: 'stern-2020',
      title: 'Whitepaper: Defining and investigating cognitive reserve, brain reserve, and brain maintenance',
      authors: 'Stern, Y., Arenaza-Urquijo, E. M., Bartrés-Faz, D., et al.',
      year: 2020,
      journal: 'Alzheimer’s & Dementia',
      doi: '10.1016/j.jalz.2018.07.219',
      url: 'https://pubmed.ncbi.nlm.nih.gov/30222945/',
      type: '합의 백서',
      population: '노화·치매 연구',
      sample: '개념·측정 지침',
      modality: '다중 방법론',
      method: 'Consensus framework',
      topics: ['인지예비능', '뇌예비능', '뇌 유지'],
      status: 'verified',
      statusLabel: '초록 근거 확인',
      coverage: 69,
      summary: '인지예비능, 뇌예비능, 뇌 유지 개념을 구분하고 연구에서 각 개념을 어떻게 조작화할지 공통 언어와 지침을 제안합니다.',
      finding: '서로 혼용되던 예비능 관련 개념을 구분하고, 연구 질문에 맞는 측정·모형화를 명시할 필요성을 강조했습니다.',
      limitation: '개념적 합의 문서이므로 특정 측정 도구의 예측 타당성을 직접 입증하는 효과 연구로 취급하면 안 됩니다.',
      neuro: { region: '개념별 상이', network: '인지 효율성·유연성', atlas: '해당 없음', preprocessing: '해당 없음', statistics: '개념·조작화 프레임워크' }
    },
    {
      id: 'yoo-2022-attention',
      title: 'A brain-based general measure of attention',
      authors: 'Yoo, K., Rosenberg, M. D., Kwon, Y. H., et al.',
      year: 2022,
      journal: 'Nature Human Behaviour',
      doi: '10.1038/s41562-022-01301-1',
      url: 'https://www.nature.com/articles/s41562-022-01301-1',
      type: '예측모형·외부검증',
      population: '성인 · 주 표본 92명 + 외부 4개 데이터셋',
      sample: '주 분석 N=92 · 외부검증 총 N=495',
      modality: 'Task fMRI · resting-state fMRI',
      method: 'CPM · C2C transformation · general attention factor',
      topics: ['주의', '기능연결성', '외부검증', 'Yoo Lab'],
      status: 'verified',
      statusLabel: '원문 페이지 확인',
      coverage: 91,
      summary: '여러 주의 과제에서 공통되는 개인차를 기능적 연결성으로 예측하고, 휴지기 연결체를 과제 연결체로 변환해 데이터셋 간 일반화되는 주의 지표를 제안한 연구입니다.',
      finding: '주 표본의 세 가지 주의 과제에서 일반 주의 요인을 구성하고, 네 개의 독립 데이터셋 총 495명에서 서로 다른 주의 측정치에 대한 일반화를 평가했습니다.',
      limitation: '주 분석 표본이 92명이고 데이터셋마다 과제와 측정치가 다르므로, 임상 진단도구로 사용하기 전 calibration·공정성·전향적 검증이 필요합니다.',
      neuro: { region: '전뇌 기능연결성', network: 'Salience · subcortical · frontoparietal', atlas: '연구 원문 확인 필요', preprocessing: 'Task/rest fMRI connectome', statistics: 'CPM · latent general factor · external validation' }
    },
    {
      id: 'yoo-2022-c2c',
      title: 'A cognitive state transformation model for task-general and task-specific subsystems of the brain connectome',
      authors: 'Yoo, K., Rosenberg, M. D., Kwon, Y. H., et al.',
      year: 2022,
      journal: 'NeuroImage',
      doi: '10.1016/j.neuroimage.2022.119279',
      url: 'https://www.sciencedirect.com/science/article/pii/S1053811922004001',
      type: '계산모형·방법론',
      population: 'Human Connectome Project 성인',
      sample: 'HCP · 휴지기와 7개 인지 상태',
      modality: 'Resting-state · task fMRI',
      method: 'Connectome-to-connectome state transformation',
      topics: ['C2C', '인지 상태', '연결체', 'Yoo Lab'],
      status: 'verified',
      statusLabel: '초록·데이터 확인',
      coverage: 86,
      summary: '휴지기 기능 연결체에서 개인의 과제 연결체를 생성하는 C2C 변환모형으로 과제 일반·특이적 재구성을 정량화한 연구입니다.',
      finding: '일곱 인지 상태에 특이적인 연결체를 생성했고, 변환된 연결체는 휴지기 연결체만 사용할 때보다 행동 예측력을 높였습니다.',
      limitation: '동일 HCP 자료와 특정 전처리·연결체 정의에 기반하므로 독립 임상 코호트, 다른 scanner와 parcellation에서의 재현을 별도로 확인해야 합니다.',
      neuro: { region: '전뇌 연결체', network: 'Task-general · task-specific subsystems', atlas: 'HCP 분석 정의', preprocessing: 'Rest-to-task connectome transformation', statistics: 'C2C model · cross-state prediction' }
    },
    {
      id: 'qu-2025-ef',
      title: 'Connectome-Based Predictive Models of General and Specific Executive Functions',
      authors: 'Qu, S., Qu, Y. L., Yoo, K., & Chun, M. M.',
      year: 2025,
      journal: 'Human Brain Mapping',
      doi: '10.1002/hbm.70358',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12439485/',
      type: 'CPM · 대규모 공개 코호트',
      population: 'HCP 성인 · 최종 N=635 (여성 355명)',
      sample: 'S1200 · fMRI/행동 완전자료 및 motion QC 통과 N=635',
      modality: '2-back task fMRI · resting-state fMRI',
      method: 'CPM · cross-task prediction · computational lesion',
      topics: ['집행기능', '기능연결성', 'CPM', 'Yoo Lab'],
      status: 'verified',
      statusLabel: '원문 정독 예시',
      coverage: 98,
      summary: '억제·전환·업데이트를 각각 Flanker, Card Sort, 2-back 점수로 근사하고 전뇌 기능연결성이 과제 내부와 과제 간 개인차를 예측하는지 검증했습니다.',
      finding: '2-back 과제 상태의 grayordinate 연결체가 휴지기·volumetric 표현보다 일관되게 높은 예측력을 보였고, 일반 집행기능은 FPN·DMN·DAN의 분산 연결로 예측되었습니다.',
      limitation: '각 과제는 의도한 집행기능만 순수하게 측정하지 않으며, 단일 HCP 코호트 결과이므로 임상·노화 표본의 독립 외부검증이 필요합니다.',
      neuro: { region: '전뇌 피질·피질하', network: 'FPN · DMN · DAN 중심', atlas: 'Schaefer300+CIFTI subcortex / Shen268', preprocessing: 'HCP minimal pipeline · nuisance regression · ICA-FIX(rest)', statistics: '10-fold CV ×1000 · permutation · FWE' }
    },
    {
      id: 'kwon-2025-sal-pmn',
      title: 'Situating the Salience and Parietal Memory Networks Using Precision Functional Mapping',
      authors: 'Kwon, Y. H., Salvo, J. J., Anderson, N. L., et al.',
      year: 2025,
      journal: 'Cell Reports',
      doi: '10.1016/j.celrep.2024.115207',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11924860/',
      type: 'Precision fMRI · 반복·독립검증',
      population: '7T NSD 6명 심층측정 · 독립 3T DBNO 8명',
      sample: '개인당 다회 resting-state + 22,500–30,000 recognition trials',
      modality: '7T/3T resting-state & task fMRI',
      method: 'Seed FC · MS-HBM · k-means · recognition contrast',
      topics: ['SAL/PMN', '정밀기능지도', '기억', 'Yoo Lab'],
      status: 'verified',
      statusLabel: '원문 정독 예시',
      coverage: 99,
      summary: '개인 내 고해상도 지도를 사용해 전방의 salience network와 후방의 parietal memory network가 실제로 하나의 분산 SAL/PMN인지 반복·대안 알고리즘·독립 데이터로 검증했습니다.',
      finding: '6명의 7T NSD 전원에서 SAL/PMN이 9개 이상의 피질 구역으로 분산되었고, 3T 8명·UK Biobank 집단지도·연속재인 과제에서도 구조와 기능적 특성이 수렴했습니다.',
      limitation: '심층측정 표본의 사람 수는 작고 network 경계에 개인차가 크며, 측두엽 일부는 signal dropout 때문에 여전히 잠정적입니다.',
      neuro: { region: 'PCU · rPCC · mPFC · aINS · IPL · rPFC · MTL · ventral striatum', network: '통합 SAL/PMN', atlas: '개인별 surface · MS-HBM', preprocessing: 'motion QC · nuisance regression · 0.01–0.1 Hz · 2.5 mm smoothing', statistics: 'replication/triplication · BH correction · multi-algorithm' }
    },
    {
      id: 'wang-2024-dbs',
      title: 'Individualized Structural Perturbations on Normative Brain Connectome Restrict DBS Outcomes in Parkinson’s Disease',
      authors: 'Wang, X., Fu, S., Yoo, K., et al.',
      year: 2024,
      journal: 'Movement Disorders',
      doi: '10.1002/mds.29874',
      url: 'https://movementdisorders.onlinelibrary.wiley.com/doi/10.1002/mds.29874',
      type: '후향적 임상 예측·normative connectome',
      population: '양측 STN-DBS 파킨슨병 N=141',
      sample: '건강청년 280 + 정상노화 155 + PD 141',
      modality: '수술 전 T1 MRI · 임상 운동평가',
      method: '개인별 SCN deviation · random forest · mediation',
      topics: ['파킨슨병', 'DBS', '구조공분산', 'Yoo Lab'],
      status: 'verified',
      statusLabel: '원문 정독 예시',
      coverage: 97,
      summary: '정상 청년의 기준 구조공분산망, 정상 노화의 시간적 편차, 파킨슨병의 질병 관련 가속 편차를 분리해 수술 전 T1 MRI가 STN-DBS 운동개선 변이를 예측하는지 분석했습니다.',
      finding: '138개 음의 편차 edge는 DBS 개선을 예측했고(r=.40, MAE=.09, R²=.15), levodopa 반응과 결합하면 r=.71, MAE=.068, R²=.48로 평가가 개선되었습니다.',
      limitation: '단일 후향적 코호트이며 외부검증은 두 scanner 간 분할에 기반합니다. 예측력은 후보선별을 보조할 수 있지만 전향적 임상결정 성능을 확정하지 않습니다.',
      neuro: { region: 'PFC · motor strip · limbic · cerebellum', network: 'CER–PFC–MOT pathway', atlas: 'Shen268 중 257 ROI', preprocessing: 'CAT12 VBM · DARTEL MNI · 6 mm FWHM · CovBat', statistics: 'RFR 150 trees · LOOCV/10-fold · 5000 permutations' }
    },
    {
      id: 'jiang-2023-frailty',
      title: 'Associations of Physical Frailty With Health Outcomes and Brain Structure in 483,033 Adults',
      authors: 'Jiang, R., Noble, S., Sui, J., Yoo, K., et al.',
      year: 2023,
      journal: 'The Lancet Digital Health',
      doi: '10.1016/S2589-7500(23)00043-2',
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10257912/',
      type: '인구기반 종단·neuroimaging 역학',
      population: 'UK Biobank 38–73세 · baseline N=483,033',
      sample: '9년 추적 46,501 · neuroimaging 40,210',
      modality: '행동·임상 325개 지표 · 3T sMRI',
      method: 'mixed-effects · bidirectional longitudinal · mediation',
      topics: ['노쇠', '뇌 노화', '정신건강', 'Yoo Lab'],
      status: 'verified',
      statusLabel: '원문 정독 예시',
      coverage: 99,
      summary: 'Fried 노쇠 5지표와 325개 건강변수의 단면·9년 양방향 종단 연관, 139개 회백질 영역과 WMH, 그리고 뇌 구조의 매개효과를 한 코호트에서 분석했습니다.',
      finding: '325개 중 283개 건강지표가 노쇠와 연관됐고, 기저 노쇠는 추적 152개 중 70개를 예측했습니다. WMH 증가와 특히 피질하 회백질 감소가 연관됐지만 효과와 매개율은 작았습니다.',
      limitation: '단면 매개분석으로 인과를 확정할 수 없고, 5개 중 4개 노쇠 지표가 자기보고이며 UK Biobank 선택편향·추적탈락·작은 효과크기를 고려해야 합니다.',
      neuro: { region: '139 cortical/subcortical GM regions · total WMH', network: '피질하·소뇌·측두/해마 중심', atlas: 'UK Biobank image-derived phenotypes', preprocessing: '3T Skyra QC · head-size adjustment · WMH log transform', statistics: 'LME/GLMM · Bonferroni/FDR · 10,000 bootstrap mediation' }
    }
  ];

  const evidence = [
    {
      id: 'e-bethlehem-1', paperId: 'bethlehem-2022', state: 'verified', direction: 'support', type: '표본·설계', confidence: '높음', strength: '대규모 관찰 근거',
      title: '전 생애 규준 모델은 매우 큰 다기관 MRI 표본을 사용했다',
      quote: '“123,984 MRI scans … from 101,457 human participants”',
      locator: 'Abstract · 표본 설명',
      interpretation: '전 생애 구조 MRI 규준을 구축할 수 있는 규모이지만, 데이터 통합과 대표성 문제를 함께 평가해야 합니다.',
      warning: '초록 및 논문 메타데이터에서 확인. 세부 조화화 절차는 Methods 원문 검토 필요.'
    },
    {
      id: 'e-marek-1', paperId: 'marek-2022', state: 'verified', direction: 'support', type: '재현성', confidence: '높음', strength: '대규모 방법론 근거',
      title: 'BWAS의 재현성은 표본이 수천 명 규모가 되면서 개선되었다',
      quote: '“As sample sizes grew into the thousands, replication rates began to improve.”',
      locator: 'Abstract · Results',
      interpretation: '개인차 기반 뇌-행동 연관 연구에서는 작은 표본으로 얻은 큰 효과를 과신하지 않아야 합니다.',
      warning: 'BWAS에 관한 결론입니다. 중재·병변·개인 내 설계로 범위를 확장하면 안 됩니다.'
    },
    {
      id: 'e-vanerp-1', paperId: 'vanerp-2018', state: 'verified', direction: 'support', type: '질환 차이', confidence: '높음', strength: '다기관 메타분석',
      title: '조현병 집단에서 광범위한 피질 두께 감소가 보고되었다',
      quote: '“individuals with schizophrenia have widespread thinner cortex”',
      locator: 'Abstract · Results',
      interpretation: '전두·측두 영역을 포함한 광범위한 형태계측 차이가 있으나 약물과 질병 특성을 고려해야 합니다.',
      warning: '집단 차이를 개인 진단 정확도나 원인 기전으로 해석할 수 없습니다.'
    },
    {
      id: 'e-seitz-1', paperId: 'seitz-2024', state: 'review', direction: 'mixed', type: '임상 타당도', confidence: '중간', strength: '체계적 고찰',
      title: 'BrainAGE와 임상 특성의 연관은 일관되지 않았다',
      quote: '“the associations with clinical characteristics were mixed”',
      locator: 'Abstract · Synthesis',
      interpretation: 'BrainAGE가 질환군 차이에 민감하더라도 생물학적 노화나 임상 예후를 직접 대표한다고 단정하기 어렵습니다.',
      warning: '포함 연구별 modality·설계·입력 피처 이질성을 표 수준에서 재확인해야 합니다.'
    },
    {
      id: 'e-yang-1', paperId: 'yang-2024', state: 'review', direction: 'support', type: '인지 변화', confidence: '중간', strength: '종단 코호트',
      title: '높은 인지예비능 지표는 느린 전반적 인지 저하와 연관되었다',
      quote: '“high CR was associated with slower declines in global cognitive function”',
      locator: 'Abstract · Findings',
      interpretation: '복합 CR 지표가 인지 변화와 관련되지만, 구성 대리변수와 선택 편향을 확인해야 합니다.',
      warning: '정확한 표본 수·모형 공변량·효과크기는 본문 표 검토 전까지 미확인입니다.'
    },
    {
      id: 'e-stern-1', paperId: 'stern-2020', state: 'review', direction: 'context', type: '개념 정의', confidence: '높음', strength: '전문가 합의',
      title: '인지예비능·뇌예비능·뇌 유지를 구분해 조작화해야 한다',
      quote: '“There has been confusion regarding the measurement of these constructs.”',
      locator: 'Abstract · Background',
      interpretation: '인지예비능을 교육연수 하나로 대체하기보다 연구 모형 안에서 개념과 측정의 관계를 명시해야 합니다.',
      warning: '합의 백서이므로 효과크기 근거가 아니라 개념·측정 지침으로 사용해야 합니다.'
    },
    {
      id: 'e-yoo-attention-1', paperId: 'yoo-2022-attention', state: 'verified', direction: 'support', type: '외부검증', confidence: '높음', strength: '다중 데이터셋 일반화',
      title: '일반 주의 지표는 네 개의 독립 데이터셋에서 일반화를 평가했다',
      quote: '“superior generalization across four independent datasets (total N = 495)”',
      locator: 'Abstract · final validation statement',
      interpretation: '단일 과제의 예측 정확도보다, 서로 다른 주의 과제와 데이터셋에서 유지되는 공통 신호를 검증하려는 설계가 핵심입니다.',
      warning: '외부검증이 곧 임상 적용 가능성을 뜻하지 않습니다. 데이터셋별 성능·calibration·표본 특성을 표와 보충자료에서 확인해야 합니다.'
    },
    {
      id: 'e-yoo-c2c-1', paperId: 'yoo-2022-c2c', state: 'review', direction: 'support', type: '계산모형', confidence: '중간', strength: 'HCP 내 상태 예측',
      title: '휴지기 연결체에서 개인의 과제 관련 연결체를 생성할 수 있었다',
      quote: '“generates an individual’s task-related connectomes from their task-free connectome”',
      locator: 'Abstract · model performance',
      interpretation: 'C2C는 휴지기 신호에 포함된 개인차를 과제 맥락에 맞게 재표현하여 행동 예측에 유용한 연결 특성을 강화하는 접근입니다.',
      warning: '독립 임상 표본의 외부검증과 parcellation·전처리 변화에 대한 강건성은 별도의 근거로 확인해야 합니다.'
    },
    {
      id: 'e-qu-ef-1', paperId: 'qu-2025-ef', state: 'verified', direction: 'support', type: '예측·일반화', confidence: '높음', strength: 'HCP N=635 · 반복 교차검증',
      title: '2-back task-state grayordinate connectome이 집행기능 예측에 가장 유리했다',
      quote: '“CPM performance was significantly higher from 2-back task scans than resting-state scans.”',
      locator: 'Results · Table 2 · data representation comparison',
      interpretation: '집행기능 개인차 예측에서 task-state가 신호를 증폭했고, surface 기반 표현의 장점은 atlas 차이만으로 설명되지 않았습니다.',
      warning: '단일 HCP 표본 내 비교이며 task impurity와 family-independent split 여부를 재현 설계에서 다시 확인해야 합니다.'
    },
    {
      id: 'e-kwon-sal-1', paperId: 'kwon-2025-sal-pmn', state: 'verified', direction: 'support', type: 'network anatomy', confidence: '높음', strength: '개인 내 반복·독립 데이터 수렴',
      title: 'SAL과 PMN은 개인별 고해상도 지도에서 하나의 분산 network로 수렴했다',
      quote: '“individualized estimates of the PMN extend beyond the posterior set”',
      locator: 'Summary · Figures 1–7 · STAR Methods',
      interpretation: '후방 PCU/rPCC와 전방 mPFC/aINS를 분리된 명칭으로만 보던 관례를 수정하고, 미세하게 interdigitate된 SAL/PMN으로 해석할 근거를 제공합니다.',
      warning: '7T 핵심 표본은 6명이며 lateral temporal component와 일부 경계는 신호 손실·개인차에 민감합니다.'
    },
    {
      id: 'e-wang-dbs-1', paperId: 'wang-2024-dbs', state: 'verified', direction: 'support', type: '임상 예측', confidence: '중간', strength: '후향 코호트·scanner 외부검증',
      title: '가속된 음의 구조공분산 편차가 적은 DBS 운동개선과 연결됐다',
      quote: '“more preoperative deviations, less postoperative improvements”',
      locator: 'Results · Figures 3–5 · Table 1',
      interpretation: '수술 전 T1 MRI에서 얻은 개인별 CER–PFC–MOT 회로 편차는 levodopa challenge에 추가되는 보조 예측정보를 제공했습니다.',
      warning: 'R²=.15인 brain-only 모델과 융합모델을 구분하고, 전향적·기관 외 검증 전에는 치료선택 규칙으로 사용하지 않습니다.'
    },
    {
      id: 'e-jiang-frailty-1', paperId: 'jiang-2023-frailty', state: 'verified', direction: 'mixed', type: '종단·매개', confidence: '높음', strength: 'UK Biobank 대규모 인구기반 분석',
      title: '노쇠는 광범위한 건강결과 및 뇌 구조와 연관됐지만 개별 효과는 작았다',
      quote: '“although the mediated effects were small”',
      locator: 'Summary · Figures 1–4 · Methods',
      interpretation: '노쇠·정신건강의 양방향 시간관계와 WMH/회백질의 부분 매개 가능성을 제시하지만, population-level 연관을 개인 인과기전으로 확대하면 안 됩니다.',
      warning: '자기보고·선택편향·비무작위 결측과 단면 매개분석을 명시하고, 절대 효과크기와 신뢰구간을 함께 봅니다.'
    }
  ];

  const paperDeepDive = {
    'bethlehem-2022': {
      question: '연령에 따른 뇌 구조의 비선형 변화를 공통 규준 곡선으로 표현하고, 개인의 측정치를 같은 나이 집단 안에서 위치시킬 수 있는가?',
      design: '100개가 넘는 연구의 횡단·종단 MRI를 통합한 전 생애 규준 모델',
      variables: '연령·성별과 구조 MRI 지표의 centile 궤적',
      validation: '연구 간 hold-out과 임상 표본 적용을 구분해 확인해야 함',
      tables: '표본 구성표에서 연령대·성별·사이트별 N과 종단 반복측정 비율 확인',
      figures: '성장곡선의 중앙값뿐 아니라 centile 폭, 변곡점과 불확실성 구간 확인',
      reproducibility: '공개 차트의 입력 단위와 사용한 처리 파이프라인이 내 데이터와 호환되는지 점검',
      use: ['서론: 전 생애 뇌 변화의 비선형성', '방법: 연령 규준화와 centile 접근', '논의: 표본 대표성과 사이트 이질성'],
      openQuestions: ['비서구권 표본에서도 같은 centile이 유지되는가?', 'scanner와 segmentation 차이가 개인 centile에 미치는 영향은?']
    },
    'marek-2022': {
      question: '뇌-행동 연관 효과의 크기와 재현성은 표본 크기에 따라 얼마나 안정화되는가?',
      design: 'ABCD·HCP·UK Biobank의 재표집과 독립 복제 분석',
      variables: '표본 크기, 효과크기 편향, sign error, 복제율',
      validation: '동일 데이터 내부 재표집과 독립 코호트 일반화를 구분',
      tables: '분석 종류별 N, 효과분포, 단변량·다변량 성능 차이를 확인',
      figures: 'N 증가에 따른 효과크기 수축과 복제율 변화의 비선형 패턴 확인',
      reproducibility: '내 연구가 BWAS 범주인지, 예상 효과와 유효 표본 크기가 같은 조건인지 먼저 판정',
      use: ['방법: 표본 수 정당화', '분석: nested validation과 hold-out', '논의: 소표본 효과 과대추정 경고'],
      openQuestions: ['희귀 임상집단에서 대규모 N을 대체할 설계는?', '반복측정·개인 내 효과에는 어떤 표본전략이 필요한가?']
    },
    'vanerp-2018': {
      question: '조현병 집단의 피질 두께와 표면적 차이가 다기관 표본에서 재현되는가?',
      design: '39개 코호트의 ENIGMA 표준 프로토콜 기반 메타분석',
      variables: '피질 두께·표면적의 집단 차이와 임상 변수',
      validation: '기관별 동일 모형 후 효과크기 메타분석',
      tables: '사이트별 N, 연령·성별, 약물, 유병기간과 QC 제외 수 확인',
      figures: '영역별 Cohen’s d의 공간 분포와 다중비교 보정 기준 확인',
      reproducibility: 'ENIGMA 처리·QC·통계 프로토콜 버전을 기록',
      use: ['서론: 조현병의 광범위 피질 변화', '방법: 다기관 메타분석 사례', '논의: 약물·질병기간 교란'],
      openQuestions: ['피질 차이가 발병 전부터 존재하는가?', '종단 변화와 약물 노출을 분리할 수 있는가?']
    },
    'seitz-2024': {
      question: '정신질환 연구에서 BrainAGE가 일관된 질환 차이와 임상적 관련성을 보이는가?',
      design: '30개 연구를 대상으로 한 체계적 문헌고찰',
      variables: '질환군 BrainAGE 차이, 증상·경과·인지 등 임상 특성과의 연관',
      validation: '훈련표본·외부검증·종단검증 여부를 연구별로 분리해야 함',
      tables: '질환, N, modality, 입력 피처, 알고리즘, age-bias correction, 외부검증을 한 행씩 재추출',
      figures: '질환별 결과 방향과 이질성의 시각화가 실제 포함연구 표와 일치하는지 확인',
      reproducibility: 'BrainAGE 계산 정의와 모델 검증 단계가 연구마다 달라 단일 지표처럼 합치지 않음',
      use: ['서론: BrainAGE의 잠재력과 임상 타당도 공백', '방법: BrainAGE 연구 비교항목', '논의: 질환 차이와 임상 유용성의 구분'],
      openQuestions: ['동일 파이프라인의 다질환 외부검증 결과는?', 'BrainAGE 변화량이 임상 경과를 전향적으로 예측하는가?']
    },
    'yang-2024': {
      question: '인지예비능 복합 지표가 중·노년기의 종단 인지 변화 및 뇌 구조와 어떻게 연관되는가?',
      design: 'UK Biobank 기반 관찰 코호트와 평균 9년 인지 추적',
      variables: 'CR 복합지표, 전반·영역별 인지 변화, 해마·전뇌 구조',
      validation: '복합지표 구성의 민감도 분석과 선택 편향 확인 필요',
      tables: '정확한 N, 탈락자, CR 구성변수, 표준화 단위, 공변량 단계별 추정치 확인',
      figures: 'CR 수준별 예측 인지 궤적과 신뢰구간, 상호작용 방향 확인',
      reproducibility: 'CR 지표 산식과 결측치 처리 규칙을 저장',
      use: ['이론: 인지예비능의 조절 가설', '방법: 복합 CR 지표 사례', '논의: 구조적 뇌 차이와 독립성의 범위'],
      openQuestions: ['교육 외 직업·여가활동 기여는?', '정신질환 집단에서 같은 완충관계가 유지되는가?']
    },
    'stern-2020': {
      question: '인지예비능, 뇌예비능, 뇌 유지를 어떤 개념과 측정 모형으로 구분할 것인가?',
      design: '분야 전문가의 개념·조작화 합의 백서',
      variables: '예비능 개념, 대리변수, 뇌 변화와 인지결과의 관계',
      validation: '효과 검증 논문이 아니라 연구모형 명세 지침으로 사용',
      tables: '각 개념의 정의·필요 변수·통계적 검정 차이를 비교표로 정리',
      figures: '병리·뇌 변화·인지 사이에서 reserve와 maintenance가 놓이는 위치 확인',
      reproducibility: '내 연구에서 어떤 개념을 어떤 관측변수로 조작화했는지 선등록',
      use: ['이론: 핵심 개념 정의', '방법: 조작적 정의', '논의: 대리변수의 불완전성'],
      openQuestions: ['reserve의 직접 측정은 가능한가?', '동일 개인에서 maintenance와 reserve를 분리하는 종단모형은?']
    },
    'yoo-2022-attention': {
      question: '서로 다른 주의 과제에 공통되는 개인차를 뇌 연결성으로 측정하고 새로운 데이터셋에 일반화할 수 있는가?',
      design: '주 표본 92명의 세 주의 과제 모델링 후 네 개 독립 데이터셋 총 495명에 일반화',
      variables: '지속·분할주의, 추적, 작업기억 용량, task/rest connectome',
      validation: '내부검증과 네 개 독립 데이터셋 일반화를 명시적으로 분리',
      tables: '각 데이터셋의 과제, 행동척도, N, scanner, 성능지표와 신뢰구간 비교',
      figures: 'Fig. 1–8의 CPM 교차예측, network contribution, rest-to-task 변환, 외부검증 흐름 확인',
      reproducibility: '원자료 DOI와 공개 General Attention/C2C 코드를 함께 기록',
      use: ['이론: 과제 일반 주의 요인', '방법: CPM·C2C·외부검증', '논의: 임상 확장 전 calibration 필요'],
      openQuestions: ['정신질환과 노화 표본에서 측정 불변성이 유지되는가?', '반복검사 신뢰도와 변화 민감도는 충분한가?']
    },
    'yoo-2022-c2c': {
      question: '휴지기 연결체에서 개인별 과제 연결체를 생성해 인지 상태별 재구성과 행동 관련 개인차를 모델링할 수 있는가?',
      design: 'HCP 휴지기와 일곱 과제 상태를 사용한 connectome-to-connectome 변환모형',
      variables: 'rest connectome, task connectome, state specificity, 행동 예측성',
      validation: '상태별 specificity와 예측력 향상을 확인하되 독립 임상 외부검증은 별도 과제',
      tables: '과제별 N, edge 정의, feature 수, 훈련/검증 분할과 성능지표 확인',
      figures: 'rest→task 변환 구조, 상태별 유사도, 행동 예측 향상과 subsystem 해석 확인',
      reproducibility: 'HCP 자료 버전, parcellation, nuisance regression, family-aware split을 기록',
      use: ['이론: 상태 일반·특이적 연결 하위체계', '방법: C2C 변환', '논의: 임상·다기관 일반화의 필요성'],
      openQuestions: ['노화로 C2C 변환함수가 달라지는가?', '질환 특이적 상태 재구성이 인지기능을 설명하는가?']
    }
  };

  const closeReads = {
    'qu-2025-ef': {
      thesis: '집행기능의 공통 성분은 분산된 연결체에서 예측되며, 특히 updating과 2-back task-state가 공통 집행기능 신호를 강하게 드러낸다.',
      readingTime: '정독 대체 18분',
      question: 'Flanker·Card Sort·2-back이 공유하는 집행기능과 각 과제에 특이적인 성분을 전뇌 기능연결성으로 구분하고 새로운 사람의 수행을 예측할 수 있는가?',
      rationale: '행동과제 하나는 여러 지각·운동·인지 과정을 동시에 포함합니다. 연구는 이 task impurity를 약점으로만 두지 않고 과제 간 cross-prediction과 공통/잔차 점수로 unity와 diversity를 분리했습니다.',
      hypothesis: ['세 과제 수행은 서로 공유되는 연결체 성분을 가진다.', '2-back updating 성분은 일반 집행기능과 가장 강하게 연결된다.', 'task fMRI와 grayordinate 표현이 rest·volume보다 예측에 유리하다.'],
      cohort: [
        ['초기 HCP S1200', 'rest·WM fMRI와 NIH Toolbox 완전 수행자 선별'],
        ['완전자료 제외', '필수 세션/행동 누락 445명 제외'],
        ['motion·품질 제외', '3 mm, 3°, mean FD .15 mm 초과 116명 + HCP defect 10명 제외'],
        ['최종 분석', 'N=635 · 여성 355명 · 세 행동점수 모두 보유']
      ],
      measures: [
        ['Inhibition proxy', 'Flanker · scanner 밖 · 약 3분 · 정확도+반응시간 정규화'],
        ['Shifting proxy', 'Dimensional Change Card Sort · 약 4분 · NIH Toolbox 점수'],
        ['Updating proxy', '2-back · scanner 안 · 유효 약 5분 · 정확도+반응시간'],
        ['General EF', '세 z-score의 평균'],
        ['Specific EF', '각 점수에서 나머지 두 점수의 설명분을 제거한 residual']
      ],
      pipeline: [
        ['01', '표현 비교', 'NIFTI volume vs CIFTI grayordinate; rest vs 2-back task state'],
        ['02', '전처리', 'HCP minimal pipeline; motion·WM·CSF·global signal·trend 회귀, rest CIFTI는 ICA-FIX'],
        ['03', 'parcellation', 'volume=Shen268, surface=Schaefer300 + CIFTI subcortical labels'],
        ['04', 'feature', 'ROI 평균 시계열의 모든 pairwise Pearson r → Fisher z connectome'],
        ['05', 'CPM', '훈련 fold에서 edge 선택·요약·선형 예측; positive/negative/both 모델'],
        ['06', '검증', '10-fold CV를 1,000회 반복 + permutation/FWE; cross-task prediction'],
        ['07', '해석', 'network lesion으로 FPN·DMN·DAN 등 기여도 비교']
      ],
      results: [
        ['17/18', '원 과제 within-task 예측', '18개 조합 중 17개가 FWE 보정 후 유의했습니다.', '유의함이 큰 임상효과를 의미하지는 않습니다.'],
        ['r=.46', 'General EF 최고 예측', '2-back grayordinate, positive+negative edge를 함께 쓴 일반 EF within-prediction.', '반복 CV 평균 상관이며 독립 임상 외부검증 값이 아닙니다.'],
        ['r=.40', 'Updating-specific ↔ General EF', '2-back-specific과 general EF의 높은 교차예측이 updating의 중심성을 지지했습니다.', '2-back은 순수 updating 측정치가 아닙니다.'],
        ['FPN·DMN', '가장 큰 lesion 손실', '해당 network edge 제거 시 예측 성능 저하가 가장 컸고 DAN도 공통 EF에 기여했습니다.', '계산적 lesion은 실제 뇌손상이나 인과개입이 아닙니다.'],
        ['0', 'General attention 전이 실패', '기존 일반 주의 CPM은 EF 점수에 잘 일반화되지 않아 두 구성개념의 연결체가 같지 않음을 보였습니다.', '도구·상태·표현 차이가 비교에 영향을 줄 수 있습니다.']
      ],
      nulls: ['Card Sort와 Flanker의 서로 간 cross-prediction은 rest fMRI에서 낮거나 비유의였습니다.', 'specific score끼리 공유 연결은 공통분산 제거 후 뚜렷하게 감소했습니다.', 'general attention CPM은 일반·특이 EF 점수를 잘 예측하지 못했습니다.'],
      figures: [
        ['Figure 1', '전체 분석 논리', '세 행동과제 → connectome → within/cross-task CPM → general/specific score로 이어지는 설계를 먼저 읽습니다.', '훈련 fold 내부 feature selection과 test fold 분리가 유지되는지'],
        ['Figure 2', 'Computational lesion', '각 canonical network edge를 제거했을 때 prediction drop을 비교해 FPN·DMN 기여를 시각화합니다.', '기준선, 95% 범위, FWE 색상과 positive/negative 패널'],
        ['Table 2', '원 점수 cross-prediction', 'task/rest와 edge 부호별 3×3 행렬에서 대각선과 비대각선을 구분합니다.', '훈련 행동이 행, 검증 행동이 열'],
        ['Table 3', '공통·특이 EF', 'General EF와 specific residual들의 4×4 예측 행렬입니다.', 'r=.46, updating 관련 r=.40과 낮은 타 specific 값'],
        ['Supplement', '강건성', 'threshold, atlas, volume/surface, rest/task 대안을 비교합니다.', '주결론이 특정 score threshold나 atlas 하나에만 의존하는지']
      ],
      appraisal: {
        strengths: ['명시적인 motion exclusion과 최종 표본 흐름', '1,000회 반복 CV 및 permutation/FWE', 'brain state·data representation·atlas 대안 비교', 'within-task와 cross-task를 분리'],
        limitations: ['한 HCP 코호트 내부 검증', '과제-구성개념 대응의 task impurity', '일부 score 산식의 연구자 선택', '임상·노화·문화권 외부 타당도 미검증'],
        boundary: '이 결과는 updating이 집행기능의 유일한 원인이라는 뜻이 아니며, FPN/DMN edge가 실제로 제거되면 수행이 떨어진다는 인과 주장도 아닙니다.'
      },
      reproducibility: ['HCP S1200 release와 subject exclusion manifest', 'CIFTI/NIFTI 및 nuisance regression 버전', 'Schaefer300·Shen268 label', '가족관계가 fold를 가로지르지 않는지 추가 점검', 'feature threshold와 1,000개 CV seed'],
      ideas: ['노화·파킨슨병에서 general EF와 updating-specific connectome의 측정 불변성 비교', 'CR이 task-state connectome 예측오차를 완충하는지 검증', '정신질환별 FPN–DMN lesion sensitivity profile 비교']
    },
    'kwon-2025-sal-pmn': {
      thesis: '후방 PMN과 전방 salience network는 개인별 고해상도에서 서로 분리된 체계가 아니라, 9개 이상의 피질 구역을 잇는 하나의 SAL/PMN으로 나타난다.',
      readingTime: '정독 대체 20분',
      question: '그룹 평균에서 후방 PMN과 전방 SAL로 나뉘어 보였던 체계가 개인별 정밀지도에서는 하나의 parallel distributed network인가?',
      rationale: 'association cortex의 다른 network들은 전방·후방에 반복되는 분산 구조를 보이는데 SAL과 PMN만 각각 한쪽에 국한된다는 기존 그림은 해상도·평균화 산물일 수 있습니다.',
      hypothesis: ['7T 개인별 FC는 작은 전방·insula PMN component를 안정적으로 드러낸다.', 'SAL/PMN은 인접 DN·FPN·cingulo-opercular network와 통계적으로 분리된다.', '전방과 후방 component 모두 recognition repetition enhancement를 보인다.'],
      cohort: [
        ['7T NSD', '심층측정 6명 · 분석 가능한 rest run 6–35개/인'],
        ['개인 내 검증', '5명은 discovery + replication/triplication으로 세션 분리'],
        ['3T DBNO', '독립 심층측정 8명 · multi-echo · 10–16 rest run/인'],
        ['대규모 참조', 'UK Biobank group map N=4,181을 낮은 threshold에서 비교'],
        ['기능 확인', 'NSD 연속재인 · 개인당 22,500–30,000 trials, 균형 세션 14개 분석']
      ],
      measures: [
        ['Network identity', 'PCU/rPCC seed가 mPFC·aINS·IPL·rPFC 등과 이루는 FC'],
        ['Topology', 'DN-A/B–SAL/PMN–FPN-A/B–CON-A/B가 여러 피질 구역에서 반복되는 순서'],
        ['Subcortical anchor', 'posterior MTL과 ventral striatum seed가 같은 분산 SAL/PMN을 회복하는지'],
        ['Recognition function', '동일 이미지 2회차 > 1회차 BOLD beta의 repetition enhancement'],
        ['Resolution robustness', 'k=7–50, mPFC vertex threshold 1–50에서 network unity 유지 여부']
      ],
      pipeline: [
        ['01', '고해상도 QC', 'FD·absolute motion 기준으로 run 제외; native 1 mm surface projection'],
        ['02', '신호 정리', 'motion·global·ventricle·deep WM 회귀 + 0.01–0.1 Hz bandpass'],
        ['03', 'seed FC', 'PCU/rPCC, mPFC, aINS, IPL, rPFC 등 다중 구역 seed correlation'],
        ['04', 'data-driven map', 'MS-HBM과 k-means가 같은 distributed network를 재현하는지 비교'],
        ['05', 'left-out validation', 'discovery에서 정의한 seed를 replication/triplication session에 고정'],
        ['06', '독립 복제', '3T multi-echo DBNO와 UK Biobank group map 비교'],
        ['07', '기능 대조', 'correct trial 중 balanced session의 repeated > novel contrast']
      ],
      results: [
        ['6/6', '7T 개인 재현', '모든 NSD 개인에서 PMN이 전방·insula를 포함한 분산 SAL/PMN으로 나타났습니다.', '사람 수보다 개인당 측정량이 큰 precision 설계입니다.'],
        ['≥9 zones', '피질 분산 범위', 'posteromedial, mPFC, aINS, lateral parietal 등 9개 이상의 association zone을 포함했습니다.', '정확한 모양과 위치는 개인마다 달랐습니다.'],
        ['r≈.6', 'core-to-anterior FC', 'posteromedial core와 mPFC component 사이에 강한 연결이 반복 관찰됐습니다.', 'seed correlation만으로 방향성·인과를 알 수 없습니다.'],
        ['8명', '독립 3T 복제', 'DBNO 전원에서 분산 SAL/PMN을 확인했으나 높은 k에서는 7T보다 더 빨리 분리됐습니다.', '해상도 외 sequence·SNR 차이도 함께 존재합니다.'],
        ['P2>P1', '재인 기능', '전방·후방 SAL/PMN 모두 반복 이미지에 repetition enhancement를 보였습니다.', 'familiarity와 salience가 동일한 심리과정이라는 뜻은 아닙니다.']
      ],
      nulls: ['Lateral temporal component는 일부 개인에서 약하고 signal dropout 인접부라 확정도가 낮았습니다.', '3T에서는 높은 k/엄격 threshold에서 전·후방 component가 더 쉽게 분리됐습니다.', '개인별 network 경계는 그룹 평균처럼 한 위치에 정확히 겹치지 않았습니다.'],
      figures: [
        ['Figure 1', '통합 network 발견', '6명의 surface map에서 posterior PMN seed가 mPFC·aINS 등 SAL 위치까지 잇는지 봅니다.', '개인 간 overlap보다 개인 내 완결성'],
        ['Figure 2', '다중 seed 수렴', '5개 피질 구역의 seed가 같은 network를 복원하는지 확인합니다.', 'seed 선택 편향을 clustering 결과와 대조'],
        ['Figure 3', 'left-out 통계 검증', '복제·triplication 자료에서 within-network FC가 neighboring network 간 FC보다 높은지 봅니다.', '개인별 paired test와 BH correction'],
        ['Figure 4', '피질하·대규모 확인', 'posterior MTL, ventral striatum, UK Biobank에서 통합 지도가 재현되는지 봅니다.', 'threshold를 낮춘 group map은 보조 근거'],
        ['Figure 5', '7T vs 3T', 'k와 mPFC vertex 기준을 높일수록 어느 데이터에서 unity가 오래 유지되는지 봅니다.', 'resolution과 SNR을 분리해 해석하기 어려움'],
        ['Figure 6', 'parallel sequence', 'SAL/PMN이 여러 영역에서 DN–FPN–CON 사이 같은 위치를 차지하는지 봅니다.', '해부학적 반복 motif'],
        ['Figure 7', '기능적 동일성', 'novel/repeated beta와 SAL/PMN 경계를 겹쳐 전·후방 반응이 같은 방향인지 봅니다.', 'correct·balanced session 제한']
      ],
      appraisal: {
        strengths: ['개인당 매우 많은 고해상도 측정', 'discovery/replication/triplication 분리', 'seed·MS-HBM·k-means 수렴', '3T 독립자료·UKB·task activation 교차 확인'],
        limitations: ['7T 6명, 3T 8명의 적은 인원', 'manual seed 선택의 판단 개입', 'global signal regression 등 pipeline 의존성', 'signal dropout과 공간 smoothing의 영향'],
        boundary: 'SAL과 PMN의 통합은 기능명 전체가 동일하다는 뜻이 아니라, 기능적으로 연결되고 반복되는 하나의 해부학적 network 안에 여러 component가 있다는 주장입니다.'
      },
      reproducibility: ['NSD와 DBNO run-level QC 목록', '1 mm/fsaverage7 projection 및 2.5 mm FWHM', 'MS-HBM k 선택 규칙', 'Zenodo custom code DOI 10.5281/zenodo.14278880', 'recognition session balance·FD·tSNR 기준'],
      ideas: ['노화·정신질환에서 SAL/PMN 전후방 coupling과 기억/살리언스 분리', '3T multi-echo에서 dropout-robust SAL/PMN marker 개발', '개인별 SAL/PMN topography가 cognitive reserve를 예측하는지 평가']
    },
    'wang-2024-dbs': {
      thesis: '정상 노화 이상의 개인별 구조공분산 편차, 특히 CER–PFC–MOT 회로의 가속 편차는 STN-DBS 운동개선의 이질성을 일부 예측한다.',
      readingTime: '정독 대체 17분',
      question: '일상 수술 전 T1 MRI에서 산출한 개인별 normative SCN deviation이 파킨슨병 환자의 DBS 운동개선 변이를 설명하고 기존 levodopa challenge 평가를 보강하는가?',
      rationale: 'fMRI/dMRI는 수술 전 일상적으로 확보되지 않을 수 있지만 T1은 흔합니다. 정상 노화 효과를 질병 편차와 분리하면 임상적으로 접근 가능한 개인화 예측 피처가 될 수 있습니다.',
      hypothesis: ['PD는 정상 노화보다 더 큰 SCN deviation을 보인다.', '기준망에서 더 크게 벗어난 환자는 DBS 개선이 작다.', '뇌 피처와 LCT 결합이 단독 LCT보다 낫다.'],
      cohort: [
        ['기준망', '건강 청년 N=280 · 17–27세 · 남/여 140/140'],
        ['노화 규준', '정상 노화 N=155 · 39–72세 · 두 기관'],
        ['임상군', 'PD N=141 · 39–77세 · bilateral STN-DBS · 2017–2022'],
        ['예후', 'UPDRS-III off-med 전후 개선율 · 평균 .59±.13'],
        ['scanner 검증', 'scanner 1 N=38에서 학습 → scanner 2 N=103에 적용 및 반대 방향']
      ],
      measures: [
        ['Clinical outcome', '(pre-op off-med UPDRS-III − post-op on-DBS/off-med) / pre-op'],
        ['Medical predictor', 'levodopa challenge response, age, onset, LEDD 등'],
        ['Morphometry', 'T1 CAT12 회백질 용적 · Shen268 중 brainstem/저신호 제외 257 ROI'],
        ['Individual deviation', '개인을 기준군에 한 명씩 더한 pSCN − rSCN, log(1+Δ)'],
        ['Disease acceleration', '정상 노화 DI의 평균·SD로 PD edge를 z-score']
      ],
      pipeline: [
        ['01', 'T1 전처리', 'visual QC·AC-PC 정렬·CAT12 bias/skull/segment'],
        ['02', '정규화', 'DARTEL MNI152 1.5 mm · 6 mm FWHM · GM threshold .2'],
        ['03', 'site harmonization', 'aging+PD ROI GM volume에 CovBat'],
        ['04', 'rSCN', '청년 280명의 ROI 간 partial correlation; age·sex·TIV 공변량'],
        ['05', '질병 편차', '정상노화 분포로 PD edge z-score; z>2.5와 FDR<.01'],
        ['06', '예측', '150-tree random forest · positive 26 vs negative 138 edge'],
        ['07', '검증·해석', 'LOOCV, 10×10-fold, 5,000 permutation, scanner external, mediation']
      ],
      results: [
        ['164 edges', '가속 편차', 'PFC·motor strip·limbic·cerebellum 연결이 정상 노화 이상으로 벗어났습니다.', 'threshold와 atlas에 의존하는 edge set입니다.'],
        ['r=.40', 'brain-only prediction', 'negative network가 DBS 개선을 예측; MAE=.090, R²=.15.', '설명분산은 제한적이며 양의 network는 실패했습니다.'],
        ['r=.03', 'positive network null', '26개 positive edge 모델은 MAE=.10, R²=−.10으로 만족스럽지 않았습니다.', '모든 질병편차가 예측에 유용한 것은 아닙니다.'],
        ['r=.71', 'LCT+brain fusion', 'LCT 단독 r=.62에서 결합 r=.71, MAE=.068, R²=.48; Steiger z=2.57, p=.005.', '같은 코호트에서 규칙을 개발·평가한 점을 고려합니다.'],
        ['partial', 'age mediation', 'CER–PFC–MOT deviation이 수술연령과 DBS outcome 관계를 부분 매개했습니다.', '관찰 매개는 인과 경로 입증이 아닙니다.']
      ],
      nulls: ['Positive 26-edge network는 DBS outcome을 예측하지 못했습니다.', 'Brain-only R²=.15로 예측오차의 대부분은 남았습니다.', '임상군 원자료와 전체 코드는 공개 저장소가 아니라 요청·협약이 필요합니다.'],
      figures: [
        ['Figure 1', '전체 파이프라인', '청년 rSCN → 정상노화 DI → PD z-deviation → RFR → mediation 순서를 읽습니다.', '각 단계의 표본이 서로 다른 역할'],
        ['Figure 2', '노화 vs PD 편차', 'node map·module radar·chord plot에서 164 accelerated edge가 어디에 집중되는지 봅니다.', 'regional atrophy와 network deviation을 구분'],
        ['Figure 3', '예측 성능', 'positive/negative network와 LCT fusion을 r·MAE·R² 세 지표로 비교합니다.', 'r만 높고 R²가 낮을 수 있음'],
        ['Figure 4', '중요 피처', 'top 10 feature와 top 4 post-hoc correlation을 구분합니다.', 'feature importance 이후 상관은 탐색적'],
        ['Figure 5', 'CER–PFC–MOT', '핵심 회로와 age→deviation→outcome 부분매개를 시각화합니다.', '매개모형 시간순서·잔여교란'],
        ['Supplement S1–S9', 'QC·강건성', 'CAT12 QC, 임상 상관, small-world, CV, scanner, mediation, atrophy를 확인합니다.', '주결론과 불일치하는 결과 여부']
      ],
      appraisal: {
        strengths: ['임상적으로 흔한 수술 전 T1 사용', '노화와 PD 편차를 분리한 규준 설계', '여러 CV·permutation·scanner 검증', 'LCT 대비 incremental value 보고'],
        limitations: ['후향적·단일 임상군', '정상 청년 rSCN과 중노년 PD의 분포 차이', '같은 연구 내 feature 선택·fusion 개발', 'R²=.15 brain-only와 전향 calibration 미검증'],
        boundary: 'CER–PFC–MOT 편차는 후보선별 보조 biomarker 가설이며, 현재 단계에서 개인의 DBS 시행 여부를 단독 결정하는 임상도구가 아닙니다.'
      },
      reproducibility: ['PINS301 bilateral STN electrode와 평가시점', 'CAT12·SPM12·DARTEL·CovBat 버전', '257 ROI 제외 규칙', 'RFR 150 trees/min leaf 5와 feature selection leakage 점검', 'scanner별 calibration·MAE·R²'],
      ideas: ['외부 병원 전향 코호트에서 사전 고정한 fusion rule 검증', 'SCN deviation과 dopaminergic·cognitive reserve 지표 결합', 'longitudinal pre/post T1에서 회로 회복과 임상반응 연결']
    },
    'jiang-2023-frailty': {
      thesis: '신체 노쇠는 중년부터 인지·정신건강·신체·생활 전반과 양방향으로 연결되며, WMH와 피질하 회백질은 이 관계의 작지만 측정 가능한 일부를 매개한다.',
      readingTime: '정독 대체 19분',
      question: 'Fried physical frailty가 325개 건강지표와 단면·9년 양방향으로 어떻게 연결되고, 뇌 구조가 이 연관을 얼마나 설명하는가?',
      rationale: '기존 노쇠 연구는 소표본·노년층·신체 결과 중심이었습니다. UK Biobank의 규모와 다영역 변수를 사용해 정신건강·인지·환경까지 같은 분석틀에서 비교했습니다.',
      hypothesis: ['노쇠가 심할수록 다양한 건강결과가 불리하다.', '기저 노쇠와 미래 건강, 기저 건강과 미래 노쇠 사이에 양방향성이 있다.', 'WMH 증가와 GM 감소가 일부 연관을 매개한다.'],
      cohort: [
        ['Baseline', 'N=483,033 · 평균 56세 · 38–73세 · 여성 54.4%'],
        ['표본 구성', 'White 94.68%; 22개 assessment centre 기반'],
        ['9년 행동 추적', 'N=46,501 · 중앙 9년(IQR 8–10)'],
        ['Neuroimaging', 'N=40,210 · 139 GM region + total WMH'],
        ['분석별 N', '건강지표별 12,532–483,033; complete frailty/covariates 요구']
      ],
      measures: [
        ['Frailty 0–5', 'weight loss·exhaustion·weakness·physical inactivity·slow walking speed'],
        ['Health phenome', '인지21·생활91·초기생애10·신체62·정신건강82·생화학30·환경29'],
        ['MRI', '3T Skyra · 139 regional GM volume · total WMH'],
        ['Primary covariates', 'age·sex·BMI·education·WHR·ethnicity·deprivation; site random effect'],
        ['Sensitivity', 'sex·<60/≥60 stratification + income·smoking·alcohol 추가']
      ],
      pipeline: [
        ['01', '노쇠 정의', 'UKB 가용변수에 맞춘 Fried phenotype 5지표 합계'],
        ['02', '단면 phenome', '325개 결과별 LME/GLMM, standardized β/OR→Cohen d'],
        ['03', '다중비교', '325개 Bonferroni; brain map correspondence는 BH-FDR'],
        ['04', '종단 양방향', 'baseline outcome·공변량 변화까지 조정해 152개 추적 결과 모델'],
        ['05', '뇌 연관', 'head size·TIV 조정, WMH log, 5 SD outlier 제외'],
        ['06', '매개', '공통 연관 GM/WMH로 양방향 3변수 path; 10,000 bootstrap'],
        ['07', '강건성', '연령·성별 subgroup, 추가 생활 공변량, categorical frailty']
      ],
      results: [
        ['283/325', '단면 연관', '87% 지표가 p<1.54×10⁻⁴에서 유의; d=.007–.668.', '초대형 N에서는 매우 작은 효과도 유의합니다.'],
        ['70/152', '노쇠→9년 결과', '기저 노쇠가 baseline과 변화 공변량 조정 후 추적 건강결과 약 절반을 예측했습니다.', '관찰 종단은 무작위 인과효과가 아닙니다.'],
        ['85 measures', '건강→노쇠', '반대 방향에서도 85개 기저 건강지표가 미래 노쇠 진행과 연관됐습니다.', '양방향 연관은 상호 인과를 직접 입증하지 않습니다.'],
        ['17/18', '정신건강 민감성', '기저 노쇠가 추적 정신건강 18개 중 17개, 반대 방향은 15개를 예측했습니다.', '대부분 자기보고이고 측정시점 차이가 있습니다.'],
        ['d=.027–.082', '뇌 구조', 'WMH 증가와 GM 감소, 특히 thalamus·accumbens·cerebellum·temporal pole·hippocampus가 연관됐습니다.', '효과와 mediation은 작고 brain structure가 전부를 설명하지 않습니다.']
      ],
      nulls: ['42개 건강지표는 Bonferroni 기준을 통과하지 않았습니다.', 'GM/WMH 매개효과는 유의해도 크기가 작았습니다.', '노쇠 기준 중 weight loss는 다른 지표보다 연관이 약했습니다.', 'UK Biobank 표본의 유병률은 일반 UK 인구에 그대로 일반화하기 어렵습니다.'],
      figures: [
        ['Figure 1', '표본·분석 지도', '7개 건강영역과 baseline/follow-up frailty 분포, 네 분석축을 한 번에 확인합니다.', '각 분석의 분모가 다름'],
        ['Figure 2', '325개 단면 연관', 'Manhattan형 overview와 top outcomes, 추가 공변량 전후 d 분포를 읽습니다.', 'p값 순위보다 절대 d'],
        ['Figure 3', '9년 양방향', 'frailty→health 70개와 health→frailty 85개, 정신건강 양방향을 분리합니다.', 'baseline 조정·추적탈락'],
        ['Figure 4', '뇌 구조·매개', 'frailty와 GM/WMH map, 상위 건강지표와의 map similarity, mediation 비율을 봅니다.', '공통 공간패턴과 causal pathway 구분'],
        ['Appendix', '정의·민감도', 'frailty cut-off, missingness, subgroup, individual indicator 결과를 확인합니다.', '본 논문의 일반화 경계를 결정']
      ],
      appraisal: {
        strengths: ['거대한 population cohort와 325개 공통 분석틀', '9년 전후 방향을 모두 평가', 'MRI와 health phenome 연결', '다중비교·subgroup·추가 공변량 민감도'],
        limitations: ['단면 brain mediation의 인과 한계', '노쇠 5개 중 4개 자기보고·UKB 맞춤 정의', '건강한 지원자·imaging 참여자 선택편향', '추적탈락이 무작위가 아닐 가능성'],
        boundary: '통계적으로 유의한 작은 매개효과를 임상적으로 큰 뇌기전으로 표현하면 안 되며, 노쇠 개선이 정신질환을 예방한다는 중재 결론도 아직 아닙니다.'
      },
      reproducibility: ['UKB field ID와 325 measure dictionary', 'Fried indicator 코딩과 grip/BMI cutoff', '지표별 exact N·missingness', 'LME/GLMM family·site random effect', 'Bonferroni/FDR와 10,000 bootstrap seed'],
      ideas: ['cognitive reserve를 노쇠–인지 변화의 moderator로 추가', '정신질환군에서 노쇠와 SAL/PMN·FPN connectivity의 종단 연결', 'GM/WMH 외 white-matter microstructure와 염증 biomarker의 다중매개']
    }
  };

  const paperExplanations = {
    'qu-2025-ef': {
      koreanTitle: '서로 다른 집행기능 과제에는 공통된 뇌 연결 패턴이 있는가?',
      orientation: '이 논문은 “집행기능을 하나의 능력으로 볼 것인가, 억제·전환·업데이트로 나눌 것인가”라는 오래된 문제를 기능연결성 예측으로 검사합니다. 단순히 세 과제와 뇌 신호의 상관을 계산한 것이 아니라, 한 과제에서 학습한 연결 패턴이 다른 과제 수행도 예측하는지 확인해 공통성과 특이성을 분리하려 했습니다.',
      walkthrough: [
        ['01 · 왜 이 연구를 했나', 'Flanker는 방해자극 억제, Card Sort는 규칙 전환, 2-back은 작업기억 업데이트를 주로 요구하지만 어느 과제도 한 기능만 측정하지 않습니다. 예를 들어 2-back에는 자극 인식, 반응 선택, 주의 유지도 필요합니다. 저자들은 이 “과제 불순도” 때문에 행동점수의 상관만으로 집행기능 구조를 결정하기 어렵다고 보고, 뇌 연결 패턴의 과제 간 일반화를 추가 증거로 사용했습니다.'],
        ['02 · 누구를 어떻게 측정했나', 'Human Connectome Project S1200에서 필요한 휴지기·작업기억 fMRI와 세 행동점수를 모두 가진 사람을 선별했습니다. 자료 누락 445명, 과도한 움직임 116명, HCP 품질문제 10명을 제외해 최종 635명(여성 355명)을 분석했습니다. Flanker와 Card Sort는 scanner 밖 NIH Toolbox 점수이고, 2-back은 scanner 안 작업기억 과제의 정확도와 반응시간을 결합한 점수입니다.'],
        ['03 · 공통 기능과 특이 기능을 어떻게 만들었나', '각 행동점수를 표준화한 뒤 세 점수의 평균을 general EF로 정의했습니다. 특정 과제의 specific EF는 그 과제 점수에서 나머지 두 과제가 설명하는 분산을 회귀로 제거한 잔차입니다. 따라서 specific score는 해당 기능의 순수한 생물학적 측정치가 아니라 “다른 두 점수와 공유되지 않은 행동분산”이라는 통계적 정의입니다.'],
        ['04 · 뇌 예측은 어떻게 했나', '휴지기와 2-back 상태에서 ROI 쌍의 Pearson 상관을 계산해 개인별 connectome을 만들고 CPM을 적용했습니다. 훈련 fold 안에서 행동과 관련된 positive·negative edge를 고른 뒤 edge 합으로 선형모형을 만들고, 보지 않은 fold의 행동을 예측했습니다. volume Shen268과 grayordinate Schaefer300+CIFTI 피질하 표현을 비교했고, 10-fold 교차검증을 1,000회 반복하며 permutation과 FWE로 우연 성능을 통제했습니다.'],
        ['05 · 무엇을 발견했고 왜 중요한가', '원래 과제 점수의 within-task 예측 18개 조합 중 17개가 보정 후 유의했고, 전반적으로 휴지기보다 2-back task-state, volume보다 grayordinate 표현이 좋았습니다. general EF의 최고 성능은 2-back grayordinate 양·음 edge 결합 모델의 r=.46이었습니다. Updating-specific 패턴이 general EF와 r≈.40으로 연결돼 업데이트가 공통 집행기능을 강하게 반영했지만, 이것이 업데이트가 집행기능의 유일한 원인이라는 뜻은 아닙니다.'],
        ['06 · network 결과는 어떻게 읽나', '계산적 lesion 분석에서 FPN과 DMN edge를 제거했을 때 예측 저하가 가장 컸고 DAN도 기여했습니다. 이는 집행기능이 한 뇌영역보다 여러 network 사이의 분산 연결에 의존한다는 해석과 맞습니다. 그러나 실제 뇌를 손상시킨 실험이 아니므로 FPN·DMN이 행동을 인과적으로 만든다는 증거는 아닙니다. 기존 general attention CPM이 EF에 전이되지 않은 결과도 주의와 집행기능 connectome이 완전히 같지 않음을 보여 줍니다.']
      ],
      keyTerms: [
        ['Unity / diversity', '세 집행기능이 공유하는 공통성(unity)과 각 과제에 남는 특이성(diversity).', 'general score와 residual score를 왜 함께 만들었는지 이해하는 핵심입니다.'],
        ['CPM', '행동과 관련된 연결 edge를 훈련자료에서 선택해 edge-strength 합으로 새 사람의 점수를 예측하는 방법.', 'feature selection이 test fold 밖에서 이루어졌는지 확인해야 누수를 피할 수 있습니다.'],
        ['Task-state connectome', '과제를 수행하는 동안 계산한 기능연결성.', '휴지기보다 행동 관련 상태가 예측 신호를 증폭했을 가능성을 설명합니다.'],
        ['Grayordinate', '피질 surface vertex와 피질하 voxel을 함께 표현하는 HCP 좌표 단위.', 'volume averaging보다 피질 접힘과 영역 경계를 더 잘 보존할 수 있습니다.'],
        ['Computational lesion', '특정 network에 속한 edge를 모델 입력에서 제거해 성능 감소를 보는 분석.', '인과적 뇌손상이 아니라 모델 의존도를 보는 민감도 분석입니다.']
      ],
      studyAnswers: [
        ['핵심 독립변수와 종속변수는?', '독립 피처는 rest 또는 2-back connectome edge이고, 종속변수는 세 원점수·general EF·specific residual입니다.'],
        ['가장 설득력 있는 결과는?', '여러 표현과 brain state를 비교해도 2-back grayordinate가 반복적으로 우수했고, 1,000회 반복 CV와 permutation/FWE를 사용한 점입니다.'],
        ['가장 큰 불확실성은?', 'general/specific score가 연구자가 선택한 통계적 조작화이며 HCP 한 코호트 안에서만 검증됐다는 점입니다.'],
        ['내 연구에 어떻게 쓰나?', '노화·정신질환에서 집행기능을 단일 과제로 대표하지 않고 공통·특이 성분과 task-state 일반화를 분리하는 설계 근거로 사용할 수 있습니다.']
      ]
    },
    'kwon-2025-sal-pmn': {
      koreanTitle: 'Salience network와 parietal memory network는 실제로 하나의 분산 네트워크인가?',
      orientation: '이 논문의 핵심은 평균 뇌 지도가 개인의 실제 network 구조를 가릴 수 있다는 점입니다. 기존 그룹 지도에서는 anterior insula·전방 대상피질의 salience network와 posterior medial cortex의 parietal memory network가 떨어져 보였지만, 개인 한 명을 매우 많이 측정하면 두 영역이 반복되는 하나의 SAL/PMN 안에서 연결되는지를 검사했습니다.',
      walkthrough: [
        ['01 · 기존 이론의 빈틈', 'Default, frontoparietal, cingulo-opercular network는 전두·두정·측두의 여러 구역에 반복되는 parallel distributed organization을 보입니다. 그런데 SAL은 전방, PMN은 후방에만 있는 것처럼 기술돼 이 일반 원리의 예외였습니다. 저자들은 작은 전방 PMN component가 사람마다 위치가 달라 그룹 평균에서 지워졌을 가능성을 제기했습니다.'],
        ['02 · 적은 사람을 많이 측정한 이유', '7T Natural Scenes Dataset의 6명은 사람 수는 적지만 개인당 6–35개의 양질 rest run과 22,500–30,000회의 장면 재인 trial을 가집니다. 5명에서는 세션을 discovery, replication, triplication으로 나눠 발견한 위치가 같은 사람의 독립 세션에서도 재현되는지 확인했습니다. 이 설계는 모집단 평균보다 개인 내부 network 경계를 정밀하게 정하는 데 목적이 있습니다.'],
        ['03 · 지도를 어떻게 만들고 검증했나', 'Posteromedial core를 seed로 mPFC, anterior insula, lateral parietal, rostral PFC 등과의 기능연결을 계산했습니다. 한 seed 결과에 의존하지 않도록 여러 cortical·subcortical seed, 개인별 MS-HBM, k-means를 함께 사용했습니다. 발견 세션에서 정한 영역을 left-out 세션에 고정해 within-network 연결이 인접 DN/FPN/CON보다 높은지 검사했고 BH 보정을 적용했습니다.'],
        ['04 · 독립자료와 기능은 어떻게 확인했나', '3T multi-echo DBNO 8명에서도 같은 분산 구조를 찾았고, UK Biobank 4,181명의 group map을 낮은 threshold에서 보조적으로 비교했습니다. 또한 NSD 장면 재인에서 처음 본 이미지(P1)와 반복 이미지(P2)의 beta를 비교해 posterior뿐 아니라 anterior SAL/PMN component도 반복 자극에 반응이 증가하는지 확인했습니다.'],
        ['05 · 핵심 결과', '7T 6명 모두에서 SAL/PMN은 posteromedial cortex만이 아니라 mPFC, anterior insula, lateral parietal 등 9개 이상의 구역에 나타났습니다. Posteromedial core와 mPFC component의 연결은 대략 r=.6 수준이었고, 3T 8명에서도 재현됐습니다. 다만 높은 k나 엄격한 threshold에서는 3T에서 전·후방 component가 더 빨리 분리돼 해상도와 SNR의 영향을 시사했습니다.'],
        ['06 · 결론의 정확한 범위', '저자들의 주장은 salience와 memory라는 심리 기능이 완전히 같은 과정이라는 뜻이 아닙니다. 개인별 해부·기능 지도에서 두 component가 하나의 연결된 network 안에 존재하며 인접 network와 구분된다는 주장입니다. Lateral temporal component는 dropout 인접부라 약했고, 개인마다 모양과 위치가 달라 임상 적용에는 개인별 mapping의 비용과 안정성을 추가 검증해야 합니다.']
      ],
      keyTerms: [
        ['Precision functional mapping', '한 사람을 여러 세션에서 반복 측정해 개인별 network 경계를 추정하는 접근.', '작은 N과 많은 반복측정의 목적을 모집단 연구와 구분하게 합니다.'],
        ['SAL/PMN', '전통적 salience와 parietal memory component를 포함하는 것으로 제안된 분산 network.', '기능명이 아니라 연결 topology에 근거한 통합 명칭입니다.'],
        ['MS-HBM', '개인과 집단 정보를 계층적으로 결합해 개인별 network를 추정하는 Bayesian 모델.', 'seed 선택만으로 만들어진 결과인지 확인하는 대안 알고리즘입니다.'],
        ['Replication / triplication', '같은 사람의 독립 세션 묶음에서 위치와 연결성을 재확인하는 절차.', '개인 내 재현성과 사람 간 일반화는 서로 다른 질문입니다.'],
        ['Repetition enhancement', '반복된 이미지에 더 큰 BOLD 반응을 보이는 현상.', '전방과 후방 component가 관련 기능 특성을 공유하는 보조 증거입니다.']
      ],
      studyAnswers: [
        ['이 연구의 분석 단위는?', '주로 개인 내부의 surface vertex·network component이며, 개인을 그룹 평균으로 합치는 것이 핵심 분석이 아닙니다.'],
        ['왜 6명으로도 의미가 있나?', '사람당 매우 많은 독립 세션과 수만 trial을 확보해 개인별 topology의 안정성을 집중적으로 검증했기 때문입니다.'],
        ['어디까지 일반화할 수 있나?', 'network 조직 원리의 존재를 지지하지만 연령·질환·인구집단의 빈도와 임상적 유용성은 별도 대규모 연구가 필요합니다.'],
        ['내 연구에 어떻게 쓰나?', '노화나 정신질환에서 SAL과 PMN을 고정된 group atlas 두 개로 나누기 전에 개인별 경계와 전후방 coupling을 검토하는 근거가 됩니다.']
      ]
    },
    'wang-2024-dbs': {
      koreanTitle: '정상 노화에서 벗어난 구조 네트워크가 파킨슨병 DBS 반응을 예측하는가?',
      orientation: '이 연구는 STN-DBS 수술 후 운동증상 개선 정도가 환자마다 다른 이유를 수술 전 T1 MRI에서 찾습니다. 단순한 위축량이 아니라, 한 환자의 영역 간 회백질 관계가 정상 청년의 기준망과 정상 노화 변화에서 얼마나 더 벗어났는지를 개인별 structural covariance deviation으로 계산했습니다.',
      walkthrough: [
        ['01 · 임상 문제', 'Levodopa challenge test는 DBS 반응 예측에 널리 쓰이지만 실제 결과의 모든 변이를 설명하지 못합니다. 기능·확산 MRI는 유용할 수 있으나 일상적인 수술 전 검사에 항상 포함되지는 않습니다. 저자들은 대부분의 환자가 보유한 T1 MRI에서 추가 예측정보를 얻고 LCT에 더했을 때 실제 증분가치가 있는지 질문했습니다.'],
        ['02 · 세 집단은 서로 다른 역할을 한다', '건강 청년 280명은 성숙한 기준 structural covariance network(rSCN)를 만드는 데 사용됐습니다. 정상 노화 155명은 나이가 들면서 생기는 정상 편차의 평균과 분산을 정하는 규준 역할을 했습니다. 양측 STN-DBS를 받은 PD 141명은 이 정상 노화 범위를 넘어서는 disease-related deviation과 수술 후 UPDRS-III 개선을 연결하는 임상군입니다.'],
        ['03 · 개인 편차를 어떻게 만들었나', 'CAT12로 T1을 분할하고 DARTEL MNI 정규화, 6 mm smoothing 후 Shen268 중 품질상 제외한 257 ROI의 회백질 용적을 얻었습니다. 사이트 차이는 CovBat으로 조화화했습니다. 각 개인을 기준집단에 한 명씩 추가했을 때 ROI 간 partial correlation이 얼마나 변하는지 계산하고, 정상 노화 분포로 z-score화해 z>2.5이면서 FDR<.01인 edge를 가속 편차로 정의했습니다.'],
        ['04 · 예측모형과 검증', '가속 편차 중 positive 26개와 negative 138개 edge를 나눠 150-tree random forest에 입력했습니다. LOOCV, 반복 10-fold CV, 5,000회 permutation을 사용했고 scanner 1의 38명에서 학습해 scanner 2의 103명에 적용하는 방향과 반대 방향도 확인했습니다. 예측은 상관 r뿐 아니라 MAE와 R²를 함께 보고했습니다.'],
        ['05 · 실제 성능', 'Negative edge 모델은 DBS 운동개선과 r=.40, MAE=.090, R²=.15였지만 positive edge 모델은 r=.03, R²=−.10으로 실패했습니다. LCT 단독은 r=.62였고, LCT와 brain deviation을 결합하면 r=.71, MAE=.068, R²=.48로 개선됐으며 Steiger 비교 p=.005였습니다. 즉 뇌 피처는 LCT를 대체하기보다 보완했습니다.'],
        ['06 · 회로와 임상 해석', '중요 edge는 cerebellum–PFC–motor(CER–PFC–MOT) 회로에 집중됐고, 이 편차가 수술연령과 결과의 관계를 부분 매개했습니다. 하지만 관찰 매개분석은 노화가 이 회로를 손상시켜 반응을 낮춘다는 인과증명이 아닙니다. 후향적 단일 코호트와 제한된 scanner 분할 검증이므로 현재는 개인 수술결정을 자동화하는 도구가 아니라 후보 biomarker입니다.']
      ],
      keyTerms: [
        ['Structural covariance network', '사람들 사이에서 두 영역의 회백질 용적이 함께 변하는 정도로 만든 network.', '한 사람의 직접 해부 연결이나 tractography가 아닙니다.'],
        ['Normative deviation', '정상 노화 분포를 기준으로 한 환자의 edge가 얼마나 비정상적인지 나타낸 z-score.', '질병 효과를 단순 연령 효과와 분리하려는 핵심입니다.'],
        ['Negative deviation', '환자에서 기준보다 구조공분산 관계가 감소한 edge.', '본 연구에서는 positive보다 DBS 결과 예측에 유용했습니다.'],
        ['Incremental value', '기존 LCT 모델에 뇌 피처를 더했을 때 성능이 추가로 좋아지는 정도.', '새 biomarker가 기존 임상정보를 실제로 보완하는지 판단합니다.'],
        ['Partial mediation', '연령–결과 연관의 일부가 network deviation과 통계적으로 연결된 모형.', '시간적·인과적 매개를 확정하지는 못합니다.']
      ],
      studyAnswers: [
        ['outcome은 정확히 무엇인가?', '수술 전 off-med UPDRS-III에서 수술 후 on-DBS/off-med 점수를 뺀 뒤 수술 전 점수로 나눈 운동개선율입니다.'],
        ['뇌 피처만으로 충분한가?', '아닙니다. Brain-only R²=.15로 남는 오차가 크고, LCT와 결합했을 때 가장 나았습니다.'],
        ['외부검증이라고 부를 수 있나?', 'scanner 분할 검증은 있지만 독립 기관·전향 코호트에 완전히 고정된 모델 검증은 아직 아닙니다.'],
        ['내 연구에 어떻게 쓰나?', '정상 노화 규준과 질병 편차를 분리하고 기존 임상지표 대비 증분가치를 평가하는 예측 biomarker 설계 사례로 사용할 수 있습니다.']
      ]
    },
    'jiang-2023-frailty': {
      koreanTitle: '신체적 노쇠는 정신건강·인지·뇌 구조와 어떤 양방향 관계를 갖는가?',
      orientation: '이 논문은 노쇠를 단순한 노년기 운동문제가 아니라 전신 건강과 뇌를 연결하는 광범위한 phenotype으로 다룹니다. UK Biobank의 매우 큰 표본에서 325개 건강 결과를 같은 분석틀로 훑고, 9년 뒤 변화의 양방향성 및 MRI 구조가 관계를 얼마나 매개하는지 단계적으로 분석했습니다.',
      walkthrough: [
        ['01 · 노쇠를 어떻게 정의했나', 'Fried phenotype을 UK Biobank 변수에 맞춰 체중감소, 피로, 악력저하, 신체활동저하, 느린 보행의 5개 지표로 구성하고 0–5점 합계를 사용했습니다. 다만 이 중 4개가 자기보고이고 원래 Fried 측정과 완전히 동일하지 않아, 노쇠가 객관적 생물학 상태라기보다 설문·행동·신체기능의 복합표현이라는 점을 기억해야 합니다.'],
        ['02 · 분석마다 표본이 왜 다른가', 'Baseline phenome 분석은 38–73세 483,033명(평균 56세, 여성 54.4%)을 포함했습니다. 약 9년 추적자료가 있는 표본은 46,501명이고, brain imaging 분석은 40,210명입니다. Imaging과 follow-up 참여자는 더 건강하고 선택된 집단일 수 있으므로 48만 명이라는 숫자가 모든 결과의 분모는 아닙니다.'],
        ['03 · 325개 건강지표와 통계', '인지 21, 생활방식 91, 초기생애 10, 신체건강 62, 정신건강 82, 생화학 30, 환경 29개를 결과로 구성했습니다. 각 변수 유형에 맞춰 linear/generalized mixed model을 쓰고 imaging site를 random effect로 처리했으며 연령·성별·BMI·교육·허리엉덩이비·인종·박탈지수 등을 조정했습니다. 325개 비교에는 Bonferroni 기준 p<1.54×10⁻⁴를 적용했습니다.'],
        ['04 · 단면과 종단을 어떻게 구분했나', '단면에서는 baseline frailty와 동시점 건강지표의 연관을 봤습니다. 종단에서는 baseline 결과와 공변량 변화까지 조정해 frailty가 약 9년 후 152개 결과를 예측하는지, 반대로 baseline 건강지표가 추후 frailty 변화와 연관되는지도 분석했습니다. 두 방향을 모두 봤지만 관찰자료이므로 상호 인과를 직접 증명하지는 않습니다.'],
        ['05 · MRI와 매개분석', '3T MRI에서 139개 regional gray-matter volume과 total white-matter hyperintensity를 사용했습니다. 노쇠는 더 많은 WMH와 더 작은 GM, 특히 시상·측좌핵·소뇌·측두극·해마와 연관됐습니다. 건강지표와 노쇠가 공유하는 뇌 공간패턴을 찾고 10,000회 bootstrap mediation을 했지만, brain mediation은 단면 자료이고 효과크기도 작았습니다.'],
        ['06 · 결과를 실제 크기로 읽기', '325개 중 283개가 단면에서 유의했지만 Cohen d는 .007–.668로 범위가 넓었습니다. 기저 노쇠는 추적 152개 중 70개, 반대 방향에서는 85개 건강지표가 미래 노쇠와 연관됐습니다. 정신건강은 frailty→outcome 17/18, reverse 15/18로 특히 양방향성이 강했습니다. 큰 표본에서는 미세한 차이도 유의하므로 p값보다 d와 임상적 크기를 봐야 합니다.'],
        ['07 · 논문의 결론', '노쇠는 신체·정신·인지·생활환경 전반과 얽혀 있고 일부 관계는 장기간 양방향으로 이어집니다. 뇌 구조는 이 관계의 일부와 연결되지만 대부분을 설명하지 않습니다. 따라서 노쇠를 수정하면 정신질환이 예방된다고 단정하거나 작은 뇌 매개효과를 중심 기전으로 과장해서는 안 됩니다. 선택편향, 추적탈락, 자기보고 측정도 일반화 범위를 제한합니다.']
      ],
      keyTerms: [
        ['Frailty phenotype', '체중감소·피로·악력·활동·보행을 합친 취약성 지표.', '질병 수와 같지 않고 측정 구성에 따라 분류가 달라집니다.'],
        ['Phenome-wide analysis', '많은 건강영역을 공통 틀에서 동시에 조사하는 접근.', '발견 범위가 넓은 대신 다중비교와 작은 효과 해석이 중요합니다.'],
        ['Bidirectional longitudinal', 'A가 미래 B와, B가 미래 A와 각각 연관되는지 따로 보는 설계.', '양방향 연관이 자동으로 인과적 순환을 뜻하지는 않습니다.'],
        ['WMH', '주로 소혈관질환 부담과 연결되는 T2-FLAIR 고신호 백질 병변량.', '전체 WMH는 위치·기전을 모두 구분하지 못합니다.'],
        ['Mediation', '노쇠–건강 연관 중 뇌 구조와 통계적으로 공유되는 부분을 추정한 분석.', '단면 mediator라 시간순서와 인과 경로가 확정되지 않습니다.']
      ],
      studyAnswers: [
        ['가장 큰 결과는 무엇인가?', '유의한 변수 수가 아니라 노쇠가 여러 건강영역과 광범위하게 연결되고 정신건강에서 양방향 종단성이 두드러졌다는 패턴입니다.'],
        ['뇌가 관계를 많이 설명했나?', '아닙니다. GM·WMH 연관과 매개는 유의했지만 대체로 작아 전신·사회·행동 경로가 많이 남습니다.'],
        ['48만 명이면 편향이 없는가?', '아닙니다. UK Biobank는 비교적 건강한 자원자 표본이고 imaging·follow-up 참여는 더 선택적입니다.'],
        ['내 연구에 어떻게 쓰나?', '인지예비능, 정신질환, 뇌 노화와 노쇠의 종단 관계를 설계할 때 다중영역 outcome과 양방향·선택편향 검증의 출발점이 됩니다.']
      ]
    }
  };

  const paperEvaluations = {
    'qu-2025-ef': {
      grade: 'B+', confidence: '중간–높음', verdict: '집행기능의 공통·특이 성분을 연결체 예측으로 분리한 방법론적 기여는 설득력 있습니다. 다만 general EF와 specific residual의 조작화가 연구자 선택에 의존하고, HCP 단일 코호트 밖의 재현이 없어 임상·노화 집단으로 바로 확장할 근거는 아직 부족합니다.',
      dimensions: [
        ['내적 타당도', '중간–높음', '훈련 fold 안에서 edge를 선택하고 10-fold CV를 1,000회 반복했으며 permutation/FWE로 우연 성능을 통제했습니다. 다만 가족구조가 fold를 넘지 않았는지와 모든 전처리·threshold 선택이 nested되었는지는 재현 시 확인해야 합니다.', 'Methods · CPM/CV; Supplement', '예측 상관은 신뢰할 만하지만 완전한 독립검증으로 읽지는 않습니다.'],
        ['구성 타당도', '중간', 'general EF는 세 z점수의 평균이고 specific EF는 나머지 과제와 공유된 분산을 제거한 잔차입니다. 잠재변수 모형이나 반복측정 신뢰도가 아니라 연구자가 만든 통계적 조작화입니다.', 'Methods · behavioral scores', '“순수 억제·전환·업데이트”로 명명하기보다 사용한 산식을 함께 씁니다.'],
        ['통계적 결론', '중간–높음', '성능을 r 하나로만 보지 않고 18개 조합, 반복 CV, permutation과 FWE로 비교했습니다. 그러나 같은 HCP 자료에서 모형 선택과 성능 비교가 이루어져 데이터셋 특이성이 남습니다.', 'Results · Tables 2–3', 'r=.46은 강한 인과효과가 아니라 보지 않은 fold의 순위 예측 정도입니다.'],
        ['외적 타당도', '낮음–중간', '최종 N=635로 내부 추정은 안정적이지만 건강한 HCP 성인 한 코호트이며 임상군·노년층·다기관 scanner에서 고정 모형을 검증하지 않았습니다.', 'Participants; Discussion', '정신질환·노화 연구에서는 새 표본의 calibration과 subgroup 성능을 다시 봐야 합니다.'],
        ['재현 가능성', '중간–높음', '공개 HCP 자료, parcellation, nuisance regression, 반복 검증 흐름이 비교적 상세합니다. 정확한 subject exclusion manifest, seed, feature threshold와 family-aware split을 함께 보존해야 합니다.', 'Methods; Supplement', '파이프라인 버전이 같을 때만 직접 재현으로 간주합니다.'],
        ['임상·이론 가치', '중간', 'task impurity를 cross-task prediction으로 다룬 설계는 이론적으로 유용합니다. 현재 성능만으로 개인의 집행기능 장애를 진단하거나 network를 치료표적으로 정할 수는 없습니다.', 'Discussion', '연구설계의 근거로는 사용 가능하지만 임상결정 근거로는 제외합니다.']
      ],
      claimBalance: [
        ['2-back task-state가 EF 예측에 유리하다', 'rest와 task, volume과 grayordinate를 같은 자료에서 비교했고 다수 조합에서 방향이 반복됐습니다.', '2-back 과제 자체가 행동 outcome과 더 가까워 state-specific signal 또는 circular proximity의 영향을 받을 수 있습니다.', '“이 데이터와 과제에서 더 잘 예측했다”까지 지지됩니다.'],
        ['Updating이 공통 EF의 중심이다', 'updating-specific과 general EF의 교차예측이 약 r=.40으로 가장 컸습니다.', 'specific residual은 조작화 의존적이며 2-back은 여러 인지과정을 포함합니다.', '중심적 후보라는 해석은 가능하지만 유일 원인이라는 결론은 불가합니다.']
      ],
      biases: [
        ['과제·구성개념 혼합', '중간', '세 과제가 순수한 단일 기능 검사가 아니며 general score가 단순 평균입니다.', 'network 차이를 인지구성개념 차이로 과대 번역할 수 있습니다.'],
        ['단일 코호트 재사용', '중간', '모든 비교가 HCP S1200 파생 표본 안에서 이루어졌습니다.', '다른 scanner·연령·질환에서 성능이 감소할 수 있습니다.'],
        ['분석 선택 유연성', '낮음–중간', 'atlas, threshold, edge 부호, brain state 등 많은 조합을 비교했습니다.', 'Supplement의 전체 분석공간과 보정 범위를 확인해야 합니다.']
      ],
      decision: '서론·방법론의 핵심 근거로 사용 가능. 임상 예측 수치나 인과 회로 주장에는 사용하지 말고, 독립 표본과 측정불변성 검증을 연구계획에 추가합니다.'
    },
    'kwon-2025-sal-pmn': {
      grade: 'A−', confidence: '높음(개인 내) · 중간(모집단)', verdict: '개인별 network topology를 밝히는 목적에는 매우 강한 precision-mapping 설계입니다. 발견–복제–삼중검증, 여러 알고리즘, 7T/3T 및 과제반응이 수렴하지만 핵심 참가자 수가 작아 SAL/PMN 통합 구조의 모집단 빈도와 임상적 변이를 추정하는 연구로 읽으면 안 됩니다.',
      dimensions: [
        ['내적 타당도', '높음', '한 사람의 세션을 discovery·replication·triplication으로 분리하고 발견 seed를 left-out 자료에 고정했습니다. seed FC, MS-HBM, k-means와 여러 피질·피질하 seed가 같은 구조에 수렴했습니다.', 'Figures 1–6; STAR Methods', '개인 내부에서 구조가 반복된다는 결론은 강합니다.'],
        ['구성 타당도', '중간–높음', 'SAL/PMN의 “통합”은 기능명 동일성이 아니라 공간적 반복과 within-network FC, 인접 network와의 분리에 근거합니다. Repetition enhancement는 보조 기능 근거입니다.', 'Figures 3, 6–7', 'salience와 memory가 같은 심리과정이라는 표현은 피합니다.'],
        ['통계적 결론', '중간–높음', '개인별 paired comparison과 BH 보정, k·threshold 민감도, left-out session 검증을 사용했습니다. 사람 수가 적어 사람 간 random-effect 추정과 드문 변이는 제한됩니다.', 'Figure 3; Supplement', '개인 내 안정성과 모집단 효과크기를 분리합니다.'],
        ['외적 타당도', '중간', '7T 6명과 독립 3T multi-echo 8명, UKB 4,181명 group map이 방향상 수렴합니다. 그러나 연령·질환·문화권과 낮은 품질의 임상자료에서 같은 topology가 유지되는지는 미검증입니다.', 'Figures 4–5; Discussion', '“대부분의 건강한 성인에서 존재할 가능성” 정도로 제한합니다.'],
        ['재현 가능성', '높음', 'run-level QC, native surface 처리, 여러 알고리즘 및 Zenodo custom code가 제시됩니다. manual seed와 신호손실 구역은 좌표·선택규칙을 보존해야 합니다.', 'STAR Methods; Zenodo 10.5281/zenodo.14278880', '원자료·코드·세션 분할을 보존하면 직접 재현 가능성이 높습니다.'],
        ['임상·이론 가치', '중간–높음(이론) · 낮음(임상)', '그룹 평균이 개인별 interdigitation을 지울 수 있다는 강한 이론·방법론 사례입니다. 진단·예후·치료반응을 직접 시험하지 않았습니다.', 'Summary; Discussion', '개인별 atlas 필요성을 정당화하는 데 쓰고 임상 biomarker로는 사용하지 않습니다.']
      ],
      claimBalance: [
        ['SAL과 PMN은 하나의 분산 network다', '모든 7T 개인, 독립 3T 자료, 다중 seed와 clustering에서 전·후방 component가 연결됐습니다.', '높은 k·엄격 threshold에서 특히 3T component가 분리되고 lateral temporal은 dropout에 민감했습니다.', '고품질 개인별 지도에서 하나의 topology라는 결론은 지지되나 경계와 component 강도는 개인·자료 의존적입니다.'],
        ['전방과 후방 component가 기능을 공유한다', '두 component 모두 repeated>novel response를 보였습니다.', '한 과제 contrast만으로 salience·familiarity·memory 기능 전체의 동일성을 검증할 수 없습니다.', '기능적 유사성의 보조근거이며 기능적 등가성 증거는 아닙니다.']
      ],
      biases: [
        ['소수 precision 표본', '중간', '핵심 7T N=6, 독립 3T N=8입니다.', '개인 내 재현은 강하지만 모집단 분포와 subgroup 차이를 추정하기 어렵습니다.'],
        ['seed·경계 판단', '중간', '일부 seed는 개인별 지도를 보고 정하며 작은 component 경계에 판단이 개입합니다.', 'blinded/automated parcellation과의 일치도를 함께 봐야 합니다.'],
        ['신호손실·전처리', '중간', 'aINS·lateral temporal 인접부, GSR·smoothing·field strength 차이가 있습니다.', '관찰되지 않은 component를 실제 부재로 오인할 수 있습니다.']
      ],
      decision: '개인별 functional mapping과 network taxonomy의 주요 근거로 사용 가능. 모집단 유병률, 질환 차이 또는 행동 예측을 주장하려면 더 큰 독립 표본이 필요합니다.'
    },
    'wang-2024-dbs': {
      grade: 'B', confidence: '중간', verdict: '수술 전 T1에서 얻은 정상노화 대비 구조공분산 편차가 LCT를 보완할 수 있다는 proof-of-concept입니다. 다중 검증과 scanner 분할은 장점이지만 후향 단일 코호트, 복잡한 피처 생성, brain-only R²=.15 때문에 임상 의사결정 모델로 보기에는 아직 이릅니다.',
      dimensions: [
        ['내적 타당도', '중간', '청년 기준망·정상노화 규준·PD 임상군의 역할을 분리하고 CovBat, LOOCV, 반복 10-fold 및 permutation을 사용했습니다. 후향 자료와 피처 선택·튜닝의 전체 nested 여부는 재현 시 점검해야 합니다.', 'Methods; Figures 2–4', '연관·예측 proof-of-concept는 지지되지만 전향적 효용은 미확인입니다.'],
        ['구성 타당도', '중간', '개인 SCN deviation은 개인의 직접 연결이 아니라 그 사람을 기준집단에 추가했을 때 집단 covariance가 변한 양입니다. 정상 노화 z-score와 threshold도 결과를 결정합니다.', 'Methods · pSCN/rSCN definition', '“환자의 해부 연결 손상” 대신 “구조공분산 편차 피처”로 표현합니다.'],
        ['통계적 결론', '중간', 'r, MAE, R², permutation과 Steiger 비교를 함께 보고 positive null도 공개했습니다. 결합모델 r=.71/R²=.48은 유망하지만 같은 개발 코호트에서 규칙과 성능을 평가했습니다.', 'Results · Figures 3–5', '증분 예측력은 후보 근거이며 임상 순이익은 별도입니다.'],
        ['외적 타당도', '낮음–중간', 'scanner 1↔2 분할 검증은 acquisition 차이에 대한 일부 근거입니다. 독립 기관, 다른 DBS programming·follow-up·인구집단의 잠금모형 검증은 없습니다.', 'Scanner validation; Discussion', '기관 외 전향검증 전 개인 예후 수치로 제시하지 않습니다.'],
        ['재현 가능성', '중간', 'CAT12·DARTEL·6 mm·Shen ROI·CovBat·random forest 설정이 제시됩니다. 기준집단 구성과 edge threshold, feature selection 코드가 결과에 큰 영향을 줍니다.', 'Methods; Supplement', '모형 파일·코드·고정 preprocessing manifest가 필요합니다.'],
        ['임상·이론 가치', '중간', '일상 T1과 기존 LCT를 결합한다는 임상 경로는 현실적입니다. calibration, decision-curve, 실패 사례와 prospective utility가 없어 치료결정 도구 단계는 아닙니다.', 'Discussion', '연구용 위험층화 후보로만 사용합니다.']
      ],
      claimBalance: [
        ['뇌 편차가 DBS 반응을 예측한다', 'negative network는 r=.40, MAE=.090, R²=.15이며 permutation을 통과했습니다.', 'positive network는 r=.03, R²=−.10이고 남는 오차가 큽니다.', '일부 편차 피처의 제한된 예측성은 지지되나 뇌영상 단독 정확도는 낮습니다.'],
        ['LCT에 뇌 피처를 더하면 유용하다', 'LCT r=.62에서 결합 r=.71, R²=.48로 증가했고 Steiger p=.005였습니다.', '동일 후향 코호트의 모델 비교이며 임상 threshold·순이익·독립 잠금검증이 없습니다.', '통계적 증분가치는 지지되지만 임상적 증분효용은 미확정입니다.']
      ],
      biases: [
        ['후향 선택편향', '높음', '수술을 받고 영상·follow-up이 완전한 환자만 포함됩니다.', '일반 PD 환자 또는 비수술 환자에 일반화할 수 없습니다.'],
        ['피처 생성 복잡성', '중간–높음', '규준집단, CovBat, z cutoff와 FDR을 거쳐 164개 edge가 정해집니다.', '파이프라인 변화에 성능이 흔들릴 수 있습니다.'],
        ['결과·치료 이질성', '중간', 'UPDRS timing, programming, medication과 follow-up 관리가 결과에 영향을 줄 수 있습니다.', '모형이 영상 외 임상과정 차이를 학습했을 가능성을 점검해야 합니다.']
      ],
      decision: '후속 전향적 다기관 검증과 기존 LCT 대비 calibration·decision-curve를 설계하는 근거로 사용합니다. 현재 환자의 수술 적합성 판정에는 사용하지 않습니다.'
    },
    'jiang-2023-frailty': {
      grade: 'A−(연관 지도) · B−(기전)', confidence: '높음(연관) · 낮음–중간(인과)', verdict: '노쇠와 325개 건강영역의 관계 및 9년 양방향성을 같은 틀로 비교한 강력한 population map입니다. 그러나 자기보고 중심 노쇠, UK Biobank 선택편향, 단면 MRI 매개 때문에 뇌가 노쇠–정신건강 관계를 인과적으로 매개한다는 결론은 약합니다.',
      dimensions: [
        ['내적 타당도', '중간–높음(종단 연관)', 'baseline과 약 9년 follow-up을 양방향으로 분석하고 기저 outcome·공변량 변화를 조정했습니다. 무작위화가 아니며 time-varying confounding과 추적탈락이 남습니다.', 'Methods · longitudinal analyses; Figure 3', '시간 선후는 일부 확보하지만 인과효과로 해석하지 않습니다.'],
        ['구성 타당도', '중간', 'Fried 5요소를 UKB 변수로 변환했으며 4개가 자기보고입니다. 325개 outcome도 측정방식과 임상적 중요도가 서로 다릅니다.', 'Methods; Appendix variable dictionary', '“생물학적 노쇠”보다 사용한 phenotype 정의를 명시합니다.'],
        ['통계적 결론', '높음(검출) · 중간(크기)', 'baseline N=483,033과 Bonferroni 기준으로 거짓양성을 강하게 통제했고 효과크기를 제시했습니다. 매우 큰 N에서는 d=.01 수준도 유의할 수 있습니다.', 'Figure 2; Results', '유의한 항목 수보다 d·CI·절대위험과 일관성을 봅니다.'],
        ['외적 타당도', '중간', '연령 범위와 대규모 표본은 장점이지만 UKB 건강 자원자 편향이 있고 imaging N=40,210, follow-up N=46,501은 더 선택된 집단입니다.', 'Cohort flow; Discussion', '고위험·비서구권·임상 정신질환 집단에서 재검증이 필요합니다.'],
        ['재현 가능성', '중간–높음', 'UKB field, 혼합모형, Bonferroni/FDR, bootstrap 매개 흐름이 구조화돼 있습니다. 325개 변수 코딩·결측처리·Fried cutoff를 그대로 보존해야 합니다.', 'Methods; Appendix', 'variable dictionary와 분석별 exact N 없이는 재현으로 보지 않습니다.'],
        ['임상·이론 가치', '중간–높음(가설 생성)', '정신건강과 노쇠의 양방향 연관 및 공유 뇌 패턴을 보여 후속 종단·중재 연구 우선순위를 정하는 데 유용합니다. 개인 예측이나 개입 효과는 시험하지 않았습니다.', 'Figures 3–4; Discussion', '위험요인 지도로 사용하되 예방효과 근거로는 사용하지 않습니다.']
      ],
      claimBalance: [
        ['노쇠는 전신 건강과 광범위하게 연결된다', '325개 중 283개가 단면에서 유의하고 여러 영역에서 종단 방향도 반복됐습니다.', '효과크기 범위가 넓고 공통방법·사회경제·기저건강 교란이 있습니다.', '광범위한 연관은 강하게 지지되지만 각 연결의 임상 중요성은 개별 평가가 필요합니다.'],
        ['뇌 구조가 노쇠–건강 관계를 매개한다', 'GM/WMH 공간패턴과 bootstrap 간접효과가 관찰됐습니다.', 'mediator가 단면이고 효과가 작으며 시간순서와 미측정 교란을 배제하지 못합니다.', '통계적 공유경로 후보이며 생물학적 인과기전 증거는 아닙니다.']
      ],
      biases: [
        ['건강 자원자·추적 선택', '높음', 'UKB 및 imaging/follow-up 참가자는 일반 인구보다 건강할 수 있습니다.', '절대 유병률과 고위험군 효과가 과소·왜곡될 수 있습니다.'],
        ['자기보고·공통방법', '중간–높음', '노쇠 5요소 중 4개와 다수 outcome이 자기보고입니다.', '같은 응답 성향이 상관을 키울 수 있습니다.'],
        ['단면 매개', '높음', 'MRI mediator와 주요 관계의 시간순서가 충분하지 않습니다.', '간접효과를 기전 또는 개입표적으로 오해할 위험이 큽니다.']
      ],
      decision: '연구 공백 탐색과 후속 종단·매개 설계의 우선순위 근거로 사용합니다. 뇌 매개를 확증하려면 반복 MRI, time-varying exposure와 causal sensitivity analysis가 필요합니다.'
    }
  };

  const evidenceDeepDive = {
    'e-bethlehem-1': {
      direct: '매우 큰 다기관 자료를 사용해 전 생애 구조 MRI 규준 곡선을 구축했다.',
      inference: '연령에 따른 비선형 변화와 개인의 상대적 위치를 설명하는 기준 자료로 사용할 수 있다.',
      boundary: '큰 표본이 모든 지역·인종·scanner를 대표한다거나 개인의 질환을 진단한다는 뜻은 아니다.',
      modifiers: ['사이트·scanner', '연령대별 표본 밀도', '성별', '처리 파이프라인'],
      checklist: ['표본 중복 여부', '연령 구간별 N', '종단자료 처리', 'hold-out 검증', 'centile 단위']
    },
    'e-marek-1': {
      direct: '전형적인 뇌-행동 연관은 작고, 표본이 수천 명 수준일 때 복제율이 개선됐다.',
      inference: '개인차 BWAS의 표본 수 계획과 nested validation에 강한 근거를 제공한다.',
      boundary: '모든 neuroimaging 연구가 반드시 수천 명이어야 한다는 보편 규칙은 아니다.',
      modifiers: ['예상 효과크기', '단변량/다변량', '측정 신뢰도', '표본 독립성'],
      checklist: ['연구 유형 일치', '유효 표본 N', '가족구조 분리', '독립 test set', '효과크기 불확실성']
    },
    'e-vanerp-1': {
      direct: '조현병 집단은 대조군보다 광범위하게 얇은 피질을 보였다.',
      inference: '국소 단일영역보다 분산된 형태계측 이상을 가정하는 근거가 된다.',
      boundary: '집단 평균 차이로 개인 진단, 발병 원인 또는 진행 방향을 추정할 수 없다.',
      modifiers: ['항정신병약물', '질병기간', '연령·성별', '사이트별 QC'],
      checklist: ['영역별 효과크기', '다중비교 보정', '약물 용량 연관', '사이트 이질성', '표면적과 두께 구분']
    },
    'e-seitz-1': {
      direct: '포함 연구에서 BrainAGE와 임상 특성의 연관 방향과 크기가 일관되지 않았다.',
      inference: '질환군 평균 BrainAGE 차이가 관찰되더라도 임상적 예후 지표로 바로 사용할 수 없다.',
      boundary: 'BrainAGE가 무가치하다는 결론도, 실제 생물학적 노화를 직접 측정한다는 결론도 지지하지 않는다.',
      modifiers: ['진단군 구성', '구조/기능 modality', '입력 피처', '훈련 표본', 'age-bias correction', '외부검증'],
      checklist: ['30개 포함연구 표 재추출', '질환별 N', '알고리즘·피처', '임상변수 정의', '종단 여부', '외부검증 여부']
    },
    'e-yang-1': {
      direct: '높은 CR 복합지표와 느린 전반적 인지 저하 사이의 연관이 보고됐다.',
      inference: 'CR을 BrainAGE–인지 변화 관계의 조절변수 후보로 설정할 이론적 근거가 된다.',
      boundary: '관찰 연관만으로 CR 개입이 인지저하를 예방한다고 결론낼 수 없다.',
      modifiers: ['CR 구성변수', '기저 인지', '사회경제 수준', '건강한 지원자 편향'],
      checklist: ['정확한 N', '추적 탈락', 'CR 산식', '공변량 단계', '효과크기·CI', '민감도 분석']
    },
    'e-stern-1': {
      direct: 'reserve 관련 개념의 측정 혼란을 지적하고 개념 구분과 조작화 지침을 제안했다.',
      inference: 'CR을 교육연수 하나로 대체하지 않고 이론적 위치와 관측변수를 명시해야 한다.',
      boundary: '특정 CR 척도의 효과나 예측성에 대한 경험적 효과크기를 제공하지 않는다.',
      modifiers: ['reserve/maintenance 구분', '대리변수', '인지결과', '뇌 변화 지표'],
      checklist: ['개념 정의', '조작적 정의', '매개/조절 위치', '시간 순서', '대안 모형']
    },
    'e-yoo-attention-1': {
      direct: '서로 다른 네 개 외부 데이터셋, 총 495명에서 일반 주의 지표의 일반화를 평가했다.',
      inference: '단일 과제 특이 모델보다 공통 주의 요인과 외부검증을 결합한 설계가 일반화 평가에 적합하다.',
      boundary: '외부검증 성능만으로 임상 진단·개인 치료결정을 정당화할 수 없다.',
      modifiers: ['과제 차이', '행동척도 차이', 'scanner·전처리', 'network 정의'],
      checklist: ['데이터셋별 N', '성능지표', '신뢰구간', 'calibration', 'subgroup 성능', '공개 코드 버전']
    },
    'e-yoo-c2c-1': {
      direct: '휴지기 연결체로부터 개인의 과제 관련 연결체를 생성하고 상태 특이성을 평가했다.',
      inference: '휴지기 연결성이 과제 맥락에서 재구성되는 개인차를 계산적으로 모델링할 수 있다.',
      boundary: '생성된 연결체가 실제 신경기전을 완전히 복원하거나 임상집단에 자동 일반화된다는 뜻은 아니다.',
      modifiers: ['HCP 표본', 'parcellation', '전처리', '과제 상태', '훈련/검증 분할'],
      checklist: ['7개 상태별 성능', 'family-aware split', 'baseline 비교', '독립 데이터', '코드·하이퍼파라미터']
    }
  };

  const atlas = {
    frontal: {
      ko: '전두엽', en: 'Frontal lobe', color: '#e89b7c',
      summary: '집행기능, 작업기억, 목표 유지와 행동 조절을 지원하는 여러 피질·피질하 회로가 포함됩니다. 하나의 단일 기능 영역이 아니라 배외측 전전두피질, 안와전두피질, 전대상피질 등 서로 다른 하위영역을 구분해야 합니다.',
      functions: '집행기능 · 억제 · 작업기억', disorders: '조현병 · 우울증 · ADHD', method: '피질 두께 · task fMRI',
      subregions: ['DLPFC: 작업기억·인지조절', 'OFC/vmPFC: 가치평가·정서조절', 'ACC: 갈등·오류 모니터링'],
      mechanism: '정신질환에서 보고되는 전두엽 변화는 국소 손상 하나보다 전두–두정·salience·피질하 회로의 분산된 연결 이상과 함께 해석하는 편이 타당합니다.',
      caution: '피질 두께 감소를 기능 저하나 질환 원인과 일대일 대응시키지 않습니다.',
      paperIds: ['vanerp-2018', 'marek-2022', 'yoo-2022-attention']
    },
    parietal: {
      ko: '두정엽', en: 'Parietal lobe', color: '#ead484',
      summary: '주의 전환, 감각 통합, 공간 처리와 작업기억에 관여하며 전두–두정 제어망과 dorsal attention network의 핵심 노드를 포함합니다.',
      functions: '주의 · 공간인지 · 감각통합', disorders: '주의장애 · 신경퇴행', method: '두께 · 연결성 · 과제 활성',
      subregions: ['SPL/IPS: 공간주의·수량·작업기억', 'IPL: 다중감각·사회인지', 'Precuneus: 내부지향 처리·DMN'],
      mechanism: '주의 수행은 두정엽 활성 하나보다 전두–두정, salience, 시각망 사이의 상태 의존적 재구성과 관련될 수 있습니다.',
      caution: '서로 다른 atlas의 IPL·IPS 경계와 network label을 직접 동일시하지 않습니다.',
      paperIds: ['bethlehem-2022', 'marek-2022', 'yoo-2022-attention', 'yoo-2022-c2c']
    },
    temporal: {
      ko: '측두엽', en: 'Temporal lobe', color: '#8ecfaf',
      summary: '기억, 언어, 청각, 의미 처리와 사회인지에 관여합니다. 내측 측두 구조와 외측 측두 피질을 분리해 측정해야 하며 노화·정신질환 연구에서 모두 중요합니다.',
      functions: '기억 · 언어 · 사회인지', disorders: '조현병 · MCI · 치매', method: '해마용적 · 피질 두께',
      subregions: ['STG/STS: 청각·사회적 단서', 'MTG/ITG: 의미·시각 객체', 'MTL: 기억 부호화·회상'],
      mechanism: '조현병의 측두 피질 변화와 노화의 내측 측두 위축은 대상·병리·시간척도가 다르므로 같은 기전으로 묶지 않습니다.',
      caution: '엽 수준 평균은 subfield 또는 network 특이 효과를 가릴 수 있습니다.',
      paperIds: ['vanerp-2018', 'yang-2024', 'bethlehem-2022']
    },
    occipital: {
      ko: '후두엽', en: 'Occipital lobe', color: '#86a9df',
      summary: '초기 시각 피질부터 형태·색·움직임 처리로 이어지는 계층적 시각계의 기반입니다. 과제 수행에서는 두정·전두 주의망의 top-down 조절을 함께 고려합니다.',
      functions: '시각 · 형태 · 움직임 처리', disorders: '시지각장애 · 신경퇴행', method: '시각 과제 fMRI · 형태계측',
      subregions: ['V1/V2: 초기 시각 특징', 'V3/V4: 형태·색', 'MT/V5: 움직임'],
      mechanism: '과제 관련 후두엽 신호는 감각 입력 특성과 주의 조절이 함께 반영될 수 있어 자극·행동 성능을 공변량으로 확인해야 합니다.',
      caution: 'BOLD 활성 차이를 흥분성 신경활동 증가로 단순 번역하지 않습니다.',
      paperIds: ['bethlehem-2022', 'yoo-2022-attention']
    },
    hippocampus: {
      ko: '해마', en: 'Hippocampus', color: '#b487cb',
      summary: '일화기억 형성, 맥락 결합과 공간 표상에 중요한 내측 측두 구조입니다. 전체 해마 용적뿐 아니라 subfield, 장축, 기능연결과 종단 변화율을 구분해 볼 필요가 있습니다.',
      functions: '기억 형성 · 맥락 · 공간', disorders: 'MCI · 알츠하이머병 · 우울증', method: '용적 · subfield · 기능연결',
      subregions: ['DG/CA3: 패턴 분리·완성', 'CA1: 비교·출력 통합', 'Subiculum: 피질 네트워크 출력'],
      mechanism: '노화와 신경퇴행에서 위축·연결 변화가 보고되지만, reserve는 같은 뇌 부담에서도 인지 결과가 달라지는 설명변수로 별도 모델링해야 합니다.',
      caution: '분할 도구·해상도·두개강용적 보정에 따라 용적 추정치가 달라집니다.',
      paperIds: ['yang-2024', 'stern-2020', 'bethlehem-2022']
    },
    limbic: {
      ko: '변연·대상 영역', en: 'Limbic and cingulate regions', color: '#efb0b4',
      summary: '대상피질, 해마곁피질, 편도체 등 서로 다른 구조를 포괄하는 편의적 이름입니다. 정서·기억·내부상태·동기 기능을 해부학적 단일 엽으로 묶기보다 세부 구조와 회로 수준에서 읽어야 합니다.',
      functions: '정서 · 기억 · 동기 · 내부상태', disorders: '우울증 · PTSD · 조현병 · 중독', method: '구조 MRI · task/rest fMRI',
      subregions: ['ACC: 갈등·가치·자율반응', 'PCC/retrosplenial: 기억·내부지향 처리', 'Parahippocampal cortex: 장면·맥락'],
      mechanism: 'SAL/PMN 연구는 posteromedial cortex와 전방 salience 위치가 개인별로 하나의 분산 network를 이룰 수 있음을 보여 주며, 전통적 엽 경계만으로 기능을 나누는 접근의 한계를 드러냅니다.',
      caution: '“limbic lobe”는 기능적·계통발생학적 개념이 섞인 용어이므로 영역별 좌표와 network를 병기합니다.',
      paperIds: ['kwon-2025-sal-pmn', 'vanerp-2018', 'yoo-2022-c2c']
    },
    insula: {
      ko: '섬엽', en: 'Insular cortex', color: '#d98d9e',
      summary: '외측고랑 깊숙이 있는 피질로 전방·후방 섬엽의 연결과 기능이 다릅니다. 시상면 주도에서는 직접 보이지 않는 부분이 있어 확대 삽입도에서 표시합니다.',
      functions: '내수용감각 · salience · 통증·미각', disorders: '불안 · 중독 · 조현병 · 통증질환', method: '고해상도 surface · task/rest fMRI',
      subregions: ['Anterior insula: salience·인지/정서 전환', 'Mid-insula: 통합 구역', 'Posterior insula: 체성·내수용 입력'],
      mechanism: '전방 섬엽은 dorsal ACC와 함께 salience network의 핵심으로 자주 정의되지만, Kwon 등의 precision mapping처럼 인접한 SAL/PMN·CON 경계와 개인차를 함께 확인해야 합니다.',
      caution: '시상면 한 장에서는 실제 위치와 피질 두께를 표현하기 어렵고 group atlas 평균이 개인 경계를 가릴 수 있습니다.',
      paperIds: ['kwon-2025-sal-pmn', 'yoo-2022-attention', 'vanerp-2018']
    },
    amygdala: {
      ko: '편도체', en: 'Amygdala', color: '#c96a72',
      summary: '내측 측두엽 앞쪽의 여러 핵군으로 위협·가치·사회적 단서와 기억 조절에 관여합니다. 해마와 가까워도 동일한 기억 구조로 취급하지 않습니다.',
      functions: '정서적 가치 · 위협학습 · 기억 조절', disorders: '불안 · PTSD · 우울증 · 자폐스펙트럼', method: '핵 분할 · task fMRI · 연결성',
      subregions: ['Basolateral complex: 감각·피질 입력과 학습', 'Central nucleus: 자율·행동 출력', 'Cortical/medial nuclei: 후각·사회행동'],
      mechanism: '질환 관련 편도체 신호는 자극, 각성, 약물, 성별·호르몬 상태와 전전두·해마 회로를 함께 모델링해야 합니다.',
      caution: '전체 편도체 평균이나 단일 BOLD contrast를 특정 감정 하나와 일대일 대응시키지 않습니다.',
      paperIds: ['vanerp-2018', 'bethlehem-2022']
    },
    ventricle: {
      ko: '뇌실·뇌척수액계', en: 'Ventricular and CSF system', color: '#b9dbea',
      summary: '측뇌실, 제3뇌실, 중뇌수도관, 제4뇌실로 이어지는 뇌척수액 공간입니다. 주변 구조의 위축, 수두증, segmentation 품질과 밀접하게 연결됩니다.',
      functions: '뇌척수액 순환 · 완충 · 대사물 제거 환경', disorders: '수두증 · 위축 관련 뇌실확대', method: 'T1/T2/FLAIR segmentation · volumetry',
      subregions: ['Lateral ventricle: 대뇌반구 CSF 공간', 'Third ventricle: 시상 사이', 'Aqueduct: 제3–4뇌실 연결', 'Fourth ventricle: 뇌간–소뇌 사이'],
      mechanism: '뇌실 용적 증가는 인접 조직 위축이나 CSF 역학 변화를 반영할 수 있지만 원인과 결과를 영상 한 시점만으로 구분하기 어렵습니다.',
      caution: '뇌실 경계는 partial volume과 segmentation 알고리즘에 민감하며, head-size 보정과 종단 일관성을 확인합니다.',
      paperIds: ['bethlehem-2022', 'jiang-2023-frailty']
    },
    corpus: {
      ko: '뇌량', en: 'Corpus callosum', color: '#f5edd4',
      summary: '좌우 대뇌반구의 상동·비상동 피질을 연결하는 가장 큰 교련섬유 다발입니다. 앞뒤 구간별로 연결되는 피질과 발달·노화 궤적이 다릅니다.',
      functions: '반구간 통합 · 감각운동 전달', disorders: '탈수초질환 · 발달장애 · 외상', method: 'DTI/NODDI · tractography',
      subregions: ['Genu: 전전두 연결', 'Body: 운동·체감각 연결', 'Splenium: 두정·측두·후두 연결'],
      mechanism: '미세구조 변화는 축삭 밀도, 수초, crossing fiber와 부분용적 효과를 함께 반영할 수 있어 단일 DTI 지표를 특정 세포기전으로 곧바로 번역할 수 없습니다.',
      caution: '2D 시상면의 모양은 구조 위치를 보여 주는 참고이며 tractography의 방향성과 연결 강도를 뜻하지 않습니다.',
      paperIds: ['bethlehem-2022', 'jiang-2023-frailty']
    },
    striatum: {
      ko: '선조체', en: 'Striatum', color: '#dd784d',
      summary: '미상핵·조가비핵과 복측 선조체를 포함하며 피질–선조체–시상–피질 고리에서 행동 선택, 강화학습, 동기와 운동을 조절합니다.',
      functions: '행동 선택 · 보상학습 · 운동', disorders: '파킨슨병 · 중독 · 강박장애', method: '구조 MRI · PET · fMRI',
      subregions: ['Caudate: 인지·연합 회로', 'Putamen: 감각운동 회로', 'Nucleus accumbens: 동기·보상'],
      mechanism: '파킨슨병에서는 nigrostriatal dopamine 소실이 basal ganglia 회로 균형을 바꾸지만, DBS 결과는 선조체 하나가 아니라 STN과 피질·소뇌를 잇는 분산 회로 및 임상 반응을 함께 봐야 합니다.',
      caution: 'BOLD 연결성, 도파민 PET, 회백질 용적은 서로 다른 생물학적 수준의 측정입니다.',
      paperIds: ['wang-2024-dbs', 'kwon-2025-sal-pmn']
    },
    thalamus: {
      ko: '시상', en: 'Thalamus', color: '#e4a56f',
      summary: '감각 중계만이 아니라 피질 상태, 주의, 기억과 운동 고리를 조절하는 여러 핵의 집합입니다. 핵별 연결 대상이 달라 전체 시상 용적만으로 기능을 설명하기 어렵습니다.',
      functions: '감각 중계 · 각성 · 인지·운동 고리', disorders: '뇌졸중 · 파킨슨병 · 정신질환', method: '핵 분할 · dMRI · 기능연결',
      subregions: ['MD: 전전두·인지 회로', 'Pulvinar: 시각주의·연합피질', 'VA/VL: 기저핵·소뇌 운동출력'],
      mechanism: '노쇠 연구에서 시상 회백질과의 연관이 관찰됐지만 효과는 작고 단면 영상이므로 전신 노쇠의 원인 구조로 단정할 수 없습니다.',
      caution: '시상핵은 일반 T1 해상도에서 직접 경계가 선명하지 않아 atlas·분할법을 기록해야 합니다.',
      paperIds: ['jiang-2023-frailty', 'wang-2024-dbs']
    },
    hypothalamus: {
      ko: '시상하부·뇌하수체', en: 'Hypothalamus and pituitary axis', color: '#cf5b63',
      summary: '체온, 섭식, 수면–각성, 스트레스, 생식과 내분비 항상성을 조절합니다. 뇌하수체는 시상하부 신호를 전신 호르몬 반응으로 연결합니다.',
      functions: '항상성 · 스트레스 · 내분비', disorders: '수면장애 · 대사질환 · 내분비질환', method: '고해상도 MRI · 호르몬 · 생리신호',
      subregions: ['SCN: 일주기', 'PVN: HPA·자율신경', 'Lateral hypothalamus: 각성·섭식', 'Pituitary: 말초 내분비 출력'],
      mechanism: '뇌–행동 연구에서 스트레스·수면·대사 상태는 인지와 영상지표를 바꿀 수 있는 조절·교란 요인이므로 측정 시간과 약물·호르몬 상태를 기록합니다.',
      caution: '작은 핵과 뇌하수체는 표준 atlas와 일반 해상도에서 부분용적 오차가 큽니다.',
      paperIds: ['jiang-2023-frailty', 'bethlehem-2022']
    },
    cerebellum: {
      ko: '소뇌', en: 'Cerebellum', color: '#b97857',
      summary: '운동 조정뿐 아니라 인지·정서·언어 회로에 참여하며, 반복되는 미세구역이 대뇌 피질과 폐쇄고리를 이룹니다. vermis, anterior/posterior lobe, Crus I/II를 구분해야 합니다.',
      functions: '운동 보정 · 타이밍 · 인지·정서', disorders: '운동실조 · 파킨슨병 · 발달·정신질환', method: 'SUIT atlas · 구조·기능연결',
      subregions: ['Anterior lobe: 감각운동', 'Crus I/II: 인지·언어', 'Vermis: 자세·정서·자율조절'],
      mechanism: 'DBS 예후 연구의 CER–PFC–MOT 구조공분산 편차는 소뇌–전전두–운동 회로가 치료반응 이질성과 연결될 가능성을 제시합니다.',
      caution: '소뇌는 대뇌용 normalization에서 잘리거나 왜곡되기 쉬우므로 전용 atlas·coverage QC가 필요합니다.',
      paperIds: ['wang-2024-dbs', 'jiang-2023-frailty']
    },
    brainstem: {
      ko: '뇌간', en: 'Brainstem', color: '#9da8ae',
      summary: '중뇌·교뇌·연수로 이어지며 각성, 호흡·심혈관, 감각운동 경로와 여러 neuromodulatory nucleus를 포함합니다. 아래로 척수, 뒤로 소뇌와 연결됩니다.',
      functions: '각성 · 자율기능 · 운동·감각 경로', disorders: '파킨슨병 · 수면장애 · 뇌간병변', method: 'neuromelanin MRI · dMRI · PET',
      subregions: ['Midbrain/SN: 도파민·운동', 'Pons: 소뇌·대뇌 중계', 'Medulla: 호흡·순환·반사'],
      mechanism: '파킨슨병과 DBS를 해석할 때 substantia nigra, STN, brainstem nuclei와 대뇌–소뇌 회로를 구분해야 하며 표준 엽 지도만으로는 충분하지 않습니다.',
      caution: '작은 핵은 움직임·생리잡음과 공간평활의 영향을 크게 받습니다.',
      paperIds: ['wang-2024-dbs', 'bethlehem-2022']
    }
  };

  const atlasLocations = {
    frontal: { index: '01', plane: '정중 시상면 · 전방 피질', where: '대뇌의 가장 앞쪽입니다. 중심고랑보다 앞에 있고, 안쪽면에서는 뇌량의 앞·위쪽을 넓게 둘러쌉니다.', landmark: '앞: 이마뼈 · 뒤: 중심고랑 · 아래: 안와면', visibility: '본 그림의 왼쪽 분홍색 피질과 mPFC·OFC·SMA·M1 구획' },
    parietal: { index: '02', plane: '정중 시상면 · 상후방 피질', where: '전두엽 뒤, 후두엽 앞의 대뇌 위쪽입니다. 중심고랑 뒤에서 시작하며 안쪽면의 precuneus를 포함합니다.', landmark: '앞: 중심고랑 · 뒤: 두정후두고랑 · 아래: 측두엽', visibility: '본 그림의 위쪽 황갈색 피질과 S1·precuneus 구획' },
    temporal: { index: '03', plane: '시상면 · 하외측 피질', where: '대뇌의 양옆 아래쪽으로, 외측고랑 아래에 놓입니다. 해마·편도체는 이 엽의 표면이 아니라 안쪽 깊은 곳에 있습니다.', landmark: '위: 외측고랑 · 뒤: 후두엽 · 안쪽: 해마 형성체', visibility: '본 그림 아래쪽 살구색 피질과 PHG/EC 구획' },
    occipital: { index: '04', plane: '정중 시상면 · 후방 피질', where: '대뇌의 가장 뒤쪽입니다. 안쪽면의 calcarine sulcus 주변에 일차시각피질 V1이 놓입니다.', landmark: '앞: 두정·측두엽 · 뒤: 후두극 · 안쪽: calcarine sulcus', visibility: '본 그림 오른쪽 보라색 피질과 cuneus·V1 구획' },
    hippocampus: { index: '05', plane: '내측 측두엽 · 심부', where: '측두엽의 안쪽 깊은 곳에서 앞뒤로 길게 휘어진 구조입니다. 편도체는 해마의 앞쪽, entorhinal cortex는 아래·안쪽에 가깝습니다.', landmark: '앞: 편도체 · 위: 측뇌실 측두각 · 아래: 해마곁이랑', visibility: '본 그림의 보라색 곡선 및 확대판 02' },
    limbic: { index: '06', plane: '정중 시상면 · 내측 피질 띠', where: '뇌량을 위에서 활처럼 둘러싸는 대상피질과 뒤쪽 PCC/retrosplenial cortex를 중심으로 표시했습니다.', landmark: '아래: 뇌량 · 앞: ACC · 뒤: PCC/RSC', visibility: '본 그림 안쪽의 진분홍색 띠와 PCC/RSC 구획' },
    insula: { index: '07', plane: '외측면 심부 · 정중면에서 숨음', where: '외측고랑을 벌렸을 때 보이는 깊은 피질입니다. 전두·두정·측두 operculum이 덮고 있어 정중 시상면 한 장에서는 직접 보이지 않습니다.', landmark: '겉: opercula · 앞: anterior insula · 뒤: posterior insula', visibility: '본 그림에는 위치 표식만, 실제 모양은 확대판 04' },
    amygdala: { index: '08', plane: '내측 측두엽 · 전방 심부', where: '해마 머리의 앞쪽에 있는 작은 핵군입니다. 측두극 뒤, 시상하부의 가쪽·아래쪽에 위치합니다.', landmark: '뒤: 해마 · 위: 선조체 꼬리 · 안쪽: uncus', visibility: '본 그림의 적색 AMG 및 확대판 02' },
    ventricle: { index: '09', plane: '정중·심부 · CSF 공간', where: '대뇌반구 안쪽에서 뇌량 바로 아래에 측뇌실이 놓이고, 시상 사이의 제3뇌실을 거쳐 제4뇌실로 이어집니다.', landmark: '위: 뇌량 · 아래: 시상·fornix · 뒤아래: 제4뇌실', visibility: '본 그림의 하늘색 공간 및 확대판 03' },
    corpus: { index: '10', plane: '정중 시상면 · 교련섬유', where: '좌우 대뇌반구 사이 정중선에서 C자 모양으로 보입니다. 측뇌실의 지붕을 이루며 대상피질 바로 아래에 있습니다.', landmark: '위: 대상피질 · 아래: 측뇌실·fornix · 뒤: splenium', visibility: '본 그림의 크림색 C자 띠 및 확대판 03' },
    striatum: { index: '11', plane: '대뇌 심부 · 기저핵', where: '대뇌피질 아래, 시상의 앞·가쪽에 있습니다. 미상핵은 측뇌실을 따라 휘고 조가비핵은 더 가쪽에 있어 정중면에서는 일부만 보입니다.', landmark: '안쪽: 시상·내포 · 가쪽: insula · 아래: STN·흑질', visibility: '본 그림의 주황색 전방 심부 구조 및 확대판 01' },
    thalamus: { index: '12', plane: '대뇌 중심부 · 간뇌', where: '좌우 대뇌반구 깊은 중심에서 제3뇌실 양옆에 놓입니다. 뇌간 위, 기저핵 안쪽, 뇌량·측뇌실 아래입니다.', landmark: '위: 측뇌실 · 아래: 시상하부 · 뒤아래: 중뇌', visibility: '본 그림 중앙의 큰 주황색 타원 및 확대판 01' },
    hypothalamus: { index: '13', plane: '간뇌 하부 · 정중선 가까이', where: '시상 바로 아래, 뇌하수체 줄기 위에 있는 작은 영역입니다. 앞쪽에는 시신경교차, 뒤쪽에는 중뇌가 있습니다.', landmark: '위: 시상 · 아래: 뇌하수체 · 앞: 시신경교차', visibility: '본 그림 중앙 아래의 적색 구조' },
    cerebellum: { index: '14', plane: '후두개와 · 뇌간 뒤쪽', where: '대뇌 후두엽 아래이자 뇌간의 뒤쪽에 있습니다. 정중면에서는 vermis, 가쪽으로 갈수록 소뇌 반구가 두드러집니다.', landmark: '앞: 교뇌·연수 · 위: 후두엽 · 아래: 대후두공', visibility: '본 그림 오른쪽 아래의 갈색 arbor vitae 구조' },
    brainstem: { index: '15', plane: '정중 시상면 · 대뇌와 척수 사이', where: '시상·시상하부 아래에서 시작해 중뇌–교뇌–연수 순으로 내려가 척수와 이어집니다. 소뇌는 그 뒤쪽에 붙습니다.', landmark: '위: 간뇌 · 뒤: 소뇌 · 아래: 척수', visibility: '본 그림 중앙 아래의 회색 세로 구조' }
  };

  function atlasLocatorShape(key, color) {
    const shapes = {
      frontal: `<path d="M25 69C17 42 36 21 76 16L88 69L75 106C45 101 29 87 25 69Z"/>`,
      parietal: `<path d="M75 16c36-8 68 1 89 20l-8 49-68-16-13-53Z"/>`,
      temporal: `<path d="M75 106l13-37 68 16 9 33c-32 17-65 14-90-12Z"/>`,
      occipital: `<path d="M164 36c29 6 45 25 44 49-1 19-16 31-43 33l-9-33 8-49Z"/>`,
      hippocampus: `<path d="M102 87c18-15 46-12 59 5-13 16-40 20-57 7-6-4-7-8-2-12Z"/>`,
      limbic: `<path d="M71 76c12-37 70-54 105-24" fill="none" stroke-width="12"/>`,
      insula: `<ellipse cx="112" cy="74" rx="25" ry="16"/><path d="M86 60l-18-14M138 60l18-14" fill="none" stroke-width="2" stroke-dasharray="4 3"/>`,
      amygdala: `<circle cx="99" cy="91" r="9"/>`,
      ventricle: `<path d="M76 72c20-31 67-37 98-15-34-6-61 4-81 30Z"/>`,
      corpus: `<path d="M67 74c17-43 75-58 116-25" fill="none" stroke-width="13"/>`,
      striatum: `<path d="M87 58c18-18 44-19 62-5-17 3-31 12-40 26-13 0-21-7-22-21Z"/>`,
      thalamus: `<ellipse cx="130" cy="76" rx="30" ry="20"/>`,
      hypothalamus: `<path d="M119 91c12-7 27-5 34 5-8 11-26 13-35 3-2-3-2-6 1-8Z"/><path d="M137 100v15" fill="none" stroke-width="4"/>`,
      cerebellum: `<circle cx="174" cy="103" r="27"/><path d="M153 97c14-10 30-11 43-3M151 108c17-8 34-6 46 4" fill="none" stroke="#fff" stroke-width="2"/>`,
      brainstem: `<path d="M130 81c16 5 24 17 21 32-3 12-6 19-3 31h-29c5-19 2-30-3-40-5-11 1-20 14-23Z"/>`
    };
    return `<g class="locator-target" fill="${color}" stroke="${color}">${shapes[key] || shapes.thalamus}</g>`;
  }

  function atlasLocatorHtml(key) {
    const item = atlasLocations[key] || atlasLocations.thalamus;
    const region = atlas[key] || atlas.thalamus;
    return `<section class="atlas-location"><header><div><span>WHERE IS IT? · ${item.index}</span><h3>뇌에서 어디에 있나</h3></div><b>${escapeHtml(item.plane)}</b></header><div class="atlas-location-body"><figure><svg viewBox="0 0 230 150" role="img" aria-label="${escapeHtml(region.ko)} 위치 미니 지도"><path class="locator-brain" d="M24 74C14 43 36 21 76 15c31-5 57 2 76 20 27-3 53 15 58 40 6 27-13 48-45 50-24 15-65 17-96 3-26-12-46-32-45-54Z"/><path class="locator-stem" d="M126 82c17 4 28 17 27 31-1 12-8 19-5 34h-30c5-18 2-29-3-39-5-11 0-22 11-26Z"/><circle class="locator-cerebellum" cx="176" cy="108" r="28"/>${atlasLocatorShape(key, region.color)}<g class="locator-axis"><path d="M18 133H58M38 113v38"/><text x="8" y="137">A</text><text x="62" y="137">P</text><text x="34" y="108">S</text><text x="35" y="148">I</text></g></svg><figcaption>앞 A · 뒤 P · 위 S · 아래 I</figcaption></figure><div><p>${escapeHtml(item.where)}</p><dl><div><dt>주변 기준</dt><dd>${escapeHtml(item.landmark)}</dd></div><div><dt>지도에서 찾기</dt><dd>${escapeHtml(item.visibility)}</dd></div></dl></div></div></section>`;
  }

  const promptTemplate = `역할: 당신은 뇌공학·뇌과학·신경과학·인지과학·심리학·정신질환 연구의 근거 추출자이자 방법론 비평자입니다. 내용 추출과 연구 평가를 분리해서 수행합니다.

목표: 첨부한 논문을 AIDERLOG_PAPER_V3 JSON으로 정리합니다. 사용자가 원문을 다시 읽지 않아도 연구 질문, 표본 흐름, 측정, 분석, 결과, 표·그림, 한계와 재현 조건을 정독 수준으로 복원하고, 그 근거가 얼마나 타당하며 내 연구에 어디까지 사용할 수 있는지도 판단할 수 있어야 합니다. 문장을 그럴듯하게 만드는 것보다 원문 사실, 평가 근거와 불확실성을 보존하는 것이 우선입니다.

성공 기준:
- 읽은 범위와 읽지 못한 범위를 documentCoverage에 기록
- 모든 핵심 claim에 25단어 이하 원문 인용과 정확한 위치 기록
- 사실 추출, 정규화, AI 해석을 구분
- 본문·표·그림 사이의 표본 수와 핵심 수치를 대조
- 초기 표본, 제외 사유, 분석별 N과 추적 표본을 cohortFlow로 분리
- 주요 결과뿐 아니라 null·negative·mixed 결과를 같은 깊이로 추출
- 각 figure/table이 연구 논리에서 맡는 역할과 panel별 판독 포인트를 기록
- 저자가 쓴 한계와 AI가 추가로 판단한 한계를 구분
- 논문 저자의 주장과 AI 비평을 같은 필드에 섞지 않음
- 평가마다 evidenceClaimIds와 locator를 붙여 원문 근거로 되돌아갈 수 있게 함
- 내적 타당도, 구성 타당도, 통계적 결론 타당도, 외적 타당도, 재현 가능성, 임상·이론 활용성을 각각 평가
- 대표 주장마다 지지 근거와 null·반대·제한 근거를 동시에 대조
- 편향 위험은 발생 근거, 심각도, 결론에 미치는 영향과 후속 검증법까지 작성
- 확인할 수 없는 값은 추측하지 않고 null
- 결과는 설명 없이 JSON 하나만 출력

서술 깊이 규칙:
- narrativeWalkthrough는 6~10단계로 작성하고 각 단계는 완전한 문단 1개로 씁니다.
- 각 단계는 ‘왜 했는가, 실제로 무엇을 했는가, 그 선택이 해석에 어떤 영향을 주는가’를 모두 포함합니다.
- ‘유의했다’, ‘연관이 있었다’, ‘모델을 사용했다’처럼 대상·수치·방향이 없는 문장을 금지합니다.
- 표본은 초기 N, 제외 사유와 수, 최종 N, 분석별 N, 추적 N을 구체적으로 씁니다.
- 변수는 개념명뿐 아니라 설문·과제·영상 피처·계산식·단위·점수 방향을 설명합니다.
- 모델은 입력 피처, 결과변수, 공변량, 훈련/검증 분리, 다중비교, 성능지표를 연결해 설명합니다.
- 각 핵심 결과는 분모, 비교집단, 방향, 추정치, 불확실성, 보정 여부와 쉬운 말 해설을 포함합니다.
- nullAndMixedResults도 무엇을 비교했고 어느 기준에서 실패했는지 구체적으로 씁니다.
- keyTerms는 일반 사전 정의와 ‘이 논문에서 왜 중요한가’를 분리해 5개 이상 작성합니다.
- studyAnswers는 논문을 정독한 사람이 답해야 할 질문과 2~4문장 답변을 4개 이상 작성합니다.
- 연구자가 원문을 확인해야 하는 문장은 locator와 함께 표시하고, 원문에 없는 기전은 생성하지 않습니다.

근거 기반 평가 규칙:
- criticalEvaluation은 내용 요약이 끝난 뒤 별도로 작성합니다. 원문에서 직접 확인되는 사실과 평가자의 판단을 문장 안에서도 구분합니다.
- evaluationDimensions는 internalValidity, constructValidity, statisticalConclusion, externalValidity, reproducibility, clinicalOrTheoreticalUtility 6개를 모두 작성합니다.
- 각 평가축은 rating{high,moderate,low,unclear}, judgment, basis, evidenceClaimIds, locator, impactOnInterpretation을 포함합니다.
- 근거가 없거나 Supplement를 읽지 못했다면 rating을 unclear로 쓰고 점수를 추정하지 않습니다.
- claimTriangulation은 핵심 주장마다 supportingEvidence, limitingOrOpposingEvidence, balancedVerdict를 기록합니다. 유의한 결과만으로 판정하지 않습니다.
- biasAudit은 selection, measurement, confounding, analyticFlexibility, leakageOverfitting, missingData, reporting 중 해당 위험을 기록하고 severity, observedBasis, consequence, mitigation을 씁니다.
- 저자가 한 인과 주장과 데이터가 허용하는 인과 수준을 비교하고, 관찰·예측·매개 결과를 기전 증명으로 바꾸지 않습니다.
- 임상 유용성은 discrimination, calibration, external validation, decision-curve/clinical utility를 구분합니다. 보고되지 않은 항목은 null입니다.
- 종합 등급은 근거가 연결된 6개 평가축이 모두 있을 때만 제시하고, 등급보다 verdict와 사용 금지 범위를 우선합니다.

필수 영역:
documentCoverage, bibliography, closeReading, criticalEvaluation, studyProfile, neuroProfile, claims, tables, figures, features, qualityChecks, limitationsAndGaps, unknowns

closeReading 필드:
oneSentenceThesis, researchQuestion, rationale, hypotheses, orientationParagraph, narrativeWalkthrough[{step,title,explanation,locator}], keyTerms[{term,definition,roleInThisPaper}], studyAnswers[{question,answer}], cohortFlow, measures, analysisPipeline, mainResults{value,denominator,comparison,direction,estimate,uncertainty,correction,plainLanguageMeaning,caveat,locator}, nullAndMixedResults, figureMap, tableMap, criticalAppraisal{strengths,authorLimitations,reviewerLimitations,interpretationBoundary}, reproducibilityLedger, researchIdeaSeeds

criticalEvaluation 필드:
evaluationType:"AI_METHOD_CRITIQUE", evaluationDimensions[{dimension,rating,judgment,basis,evidenceClaimIds,locator,impactOnInterpretation}], claimTriangulation[{claim,supportingEvidence,limitingOrOpposingEvidence,balancedVerdict,evidenceClaimIds}], biasAudit[{risk,severity,observedBasis,consequence,mitigation,evidenceClaimIds,locator}], causalAssessment{authorClaim,dataPermittedLevel,alternativeExplanations}, applicability{supportedUses,unsupportedUses,targetPopulationLimits}, overallVerdict{grade,confidence,verdict,decisionForMyResearch}

신경과학 필드:
speciesPopulation, diagnosticCriteria, ageSex, sampleSize, modality, acquisition, preprocessing, atlas, coordinateSpace, brainRegions, networks, cognitiveTasks, clinicalMeasures, features, statisticalModel, multipleComparisonCorrection, validation, openScience

claim 필드:
id, claim, claimType, sourceQuote, locator{printedPage,pdfPage,section,table,figure,panel,supplement}, extractionType{verbatim,normalized,inferred}, evidenceDirection{support,oppose,mixed,context}, confidence{high,medium,low}, limitations, relatedVariables

표·그림 규칙:
- 표는 행·열·단위·집단 N·효과크기·신뢰구간·p값·각주를 기록
- 그림은 figure/panel·축·범례·색상척도·비교·보고 통계를 기록
- 해상도가 낮거나 값 판독이 불가능하면 값을 만들지 말고 unknowns에 기록
- MRI 좌표, atlas, threshold, smoothing, correction을 보이지 않는 경우 추정 금지`;

  const sampleImport = {
    schema: 'AIDERLOG_PAPER_V3',
    documentCoverage: { pagesRead: '1-8', sections: ['Abstract', 'Introduction', 'Methods', 'Results', 'Discussion'], tables: ['Table 1'], figures: ['Figure 1', 'Figure 2'], supplementsRead: false },
    bibliography: { title: 'Sample brain ageing study', year: 2024, doi: null },
    closeReading: {
      oneSentenceThesis: 'Example thesis',
      researchQuestion: 'Example question',
      rationale: 'Example rationale',
      orientationParagraph: '이 연구가 해결하려는 문제, 표본과 측정, 분석 전략, 핵심 결과와 해석의 한계를 하나의 흐름으로 연결한 장문 개요입니다.',
      narrativeWalkthrough: [
        { step: 1, title: '왜 연구했나', explanation: '기존 연구가 어떤 질문에는 답했지만 무엇을 구분하지 못했는지, 그 미해결 문제가 임상적·이론적으로 왜 중요한지를 구체적인 선행연구 맥락과 함께 설명합니다.', locator: 'Introduction p.2' },
        { step: 2, title: '누구를 분석했나', explanation: '모집 표본, 제외 기준, 품질관리 탈락, 최종 분석 표본과 하위 분석별 분모를 분리해 적고, 이 표본 구성이 결과의 일반화 범위에 미치는 영향을 설명합니다.', locator: 'Methods p.3; Figure 1' },
        { step: 3, title: '무엇을 어떻게 측정했나', explanation: '핵심 구성개념을 실제 변수로 바꾼 방식, 도구의 점수 방향과 단위, 영상 피처의 생성 과정 및 측정 오차 가능성을 연결해 설명합니다.', locator: 'Methods p.3-4; Table 1' },
        { step: 4, title: '어떻게 분석했나', explanation: '전처리, 공변량, 모형 입력과 결과변수, 훈련·검증 분할, 다중비교 보정 및 성능지표를 분석 순서대로 적어 독자가 재현 경로를 이해하게 합니다.', locator: 'Methods p.4-5' },
        { step: 5, title: '무엇이 발견됐나', explanation: '각 결과의 분석 분모, 비교 대상, 효과의 방향과 추정치, 불확실성 및 보정 여부를 함께 적고, 그 수치가 실제로 무엇을 뜻하는지 평문으로 해설합니다.', locator: 'Results p.5-6; Figure 2' },
        { step: 6, title: '무엇을 의미하고 무엇은 말할 수 없나', explanation: '결과가 지지하는 가장 좁은 결론과 대안 설명, 비유의 결과, 저자가 인정한 한계 및 추가로 검증해야 할 조건을 분리해 과도한 인과 해석을 막습니다.', locator: 'Discussion p.7-8' }
      ],
      keyTerms: [
        { term: 'Brain-age gap', definition: '모형이 예측한 뇌연령에서 실제 연령을 뺀 값입니다.', roleInThisPaper: '핵심 노출변수이며 양수일수록 상대적으로 노화된 뇌 표현을 뜻합니다.' },
        { term: 'Operationalization', definition: '추상적 개념을 관찰 가능한 변수로 바꾸는 규칙입니다.', roleInThisPaper: '뇌 노화를 단일 점수로 정의하는 과정과 해석 범위를 결정합니다.' },
        { term: 'Covariate', definition: '주요 관계와 함께 통계적으로 조정하는 변수입니다.', roleInThisPaper: '연령·성별·스캐너 등의 대안 설명을 줄이기 위해 사용됩니다.' },
        { term: 'Cross-validation', definition: '자료를 나누어 보지 않은 표본에서 모형을 평가하는 절차입니다.', roleInThisPaper: '보고된 예측력이 훈련자료에만 맞춘 결과인지 점검합니다.' },
        { term: 'FDR correction', definition: '다수의 가설검정에서 거짓 발견 비율을 통제하는 방법입니다.', roleInThisPaper: '여러 뇌·임상 변수 비교 중 우연한 유의성을 줄입니다.' }
      ],
      studyAnswers: [
        { question: '이 논문의 핵심 질문은 무엇인가?', answer: '핵심 노출·결과·대상군을 포함한 한 문장으로 답하고, 기존 연구와 달라지는 지점을 함께 설명합니다.' },
        { question: '결론을 만든 실제 표본은 누구인가?', answer: '초기 등록 N과 최종 분석 N을 구분하고, 주요 제외 사유와 하위 분석별 분모 차이를 답합니다.' },
        { question: '가장 중요한 결과 수치는 무엇을 뜻하는가?', answer: '효과의 방향, 크기, 불확실성, 비교 기준과 보정 여부를 함께 적어 통계적 결과를 실제 의미로 번역합니다.' },
        { question: '이 결과로 말할 수 없는 것은 무엇인가?', answer: '관찰 설계의 인과 한계, 일반화되지 않는 집단, 측정·모형 의존성과 재현에 필요한 조건을 구체적으로 답합니다.' }
      ],
      hypotheses: ['H1'], cohortFlow: [{ stage: 'Final analysis', n: 842, exclusionReason: null }], measures: [{ construct: 'Brain ageing', operationalization: 'Brain-age gap' }], analysisPipeline: ['QC', 'Model', 'Validation'], mainResults: [{ value: 'r=.24', denominator: 'N=842', comparison: 'higher vs lower brain-age gap', direction: 'positive', estimate: '.24', uncertainty: '95% CI not reported', correction: 'FDR', plainLanguageMeaning: 'Example only', caveat: 'Not causal', locator: 'Results p.5' }], nullAndMixedResults: ['Example null result'], figureMap: [{ label: 'Figure 1', panels: ['A', 'B'], role: 'Study flow' }], tableMap: [{ label: 'Table 1', role: 'Cohort characteristics' }], criticalAppraisal: { strengths: ['Example'], authorLimitations: ['Example'], reviewerLimitations: ['Example'], interpretationBoundary: 'No causal claim' }, reproducibilityLedger: ['Dataset version'], researchIdeaSeeds: ['External validation']
    },
    criticalEvaluation: {
      evaluationType: 'AI_METHOD_CRITIQUE',
      evaluationDimensions: [
        { dimension: 'internalValidity', rating: 'moderate', judgment: '교란을 일부 조정했지만 관찰설계의 잔여 교란이 남습니다.', basis: '공변량 조정과 민감도 분석을 보고했습니다.', evidenceClaimIds: ['c1'], locator: 'Methods p.4-5' },
        { dimension: 'constructValidity', rating: 'moderate', judgment: 'brain-age gap이 생물학적 노화 전체를 직접 측정하지는 않습니다.', basis: 'T1 기반 예측오차를 조작적 지표로 사용했습니다.', evidenceClaimIds: ['c1'], locator: 'Methods p.3' },
        { dimension: 'statisticalConclusion', rating: 'moderate', judgment: '효과 방향은 평가 가능하지만 불확실성 보고가 불완전합니다.', basis: 'r=.24와 FDR은 보고됐으나 CI는 확인되지 않았습니다.', evidenceClaimIds: ['c1'], locator: 'Results p.5' },
        { dimension: 'externalValidity', rating: 'low', judgment: '독립 코호트 일반화 근거가 부족합니다.', basis: '외부검증이 보고되지 않았습니다.', evidenceClaimIds: ['c1'], locator: 'Discussion p.7' },
        { dimension: 'reproducibility', rating: 'moderate', judgment: '핵심 pipeline은 있으나 atlas와 일부 설정이 미확인입니다.', basis: '데이터 버전은 있으나 unknowns가 남습니다.', evidenceClaimIds: ['c1'], locator: 'Methods p.3-5' },
        { dimension: 'clinicalOrTheoreticalUtility', rating: 'low', judgment: '가설 생성에는 쓰되 개인 임상판정에는 사용할 수 없습니다.', basis: '관찰 연관이며 임상효용 분석이 없습니다.', evidenceClaimIds: ['c1'], locator: 'Discussion p.7-8' }
      ],
      claimTriangulation: [{ claim: 'brain-age gap은 결과와 연관된다', supportingEvidence: 'N=842에서 r=.24가 보고됐습니다.', limitingOrOpposingEvidence: '관찰설계이며 CI와 외부검증이 미확인입니다.', balancedVerdict: '표본 내 연관은 지지되나 인과·임상 일반화는 불가합니다.', evidenceClaimIds: ['c1'] }],
      biasAudit: [{ risk: 'selection', severity: 'moderate', observedBasis: '완전자료 분석 표본입니다.', consequence: '탈락자와 포함자의 차이가 결과를 바꿀 수 있습니다.', mitigation: '탈락 비교와 inverse-probability weighting을 확인합니다.', evidenceClaimIds: ['c1'], locator: 'Figure 1; Methods p.3' }],
      causalAssessment: { authorClaim: 'association', dataPermittedLevel: 'observational association', alternativeExplanations: ['residual confounding', 'measurement error'] },
      applicability: { supportedUses: ['hypothesis generation'], unsupportedUses: ['individual diagnosis'], targetPopulationLimits: ['external cohort untested'] },
      overallVerdict: { grade: 'B−', confidence: 'moderate', verdict: '표본 내 연관은 해석 가능하지만 외부 타당도와 불확실성 보고가 부족합니다.', decisionForMyResearch: '보조 근거로만 사용하고 독립 검증을 추가합니다.' }
    },
    studyProfile: { population: 'Middle and older adults', sampleSize: 842, design: 'Longitudinal observational' },
    neuroProfile: { modality: ['Structural MRI'], brainRegions: ['Hippocampus'], atlas: null },
    claims: [{ id: 'c1', claim: 'Example claim for validation preview', sourceQuote: 'Short source excerpt', locator: { pdfPage: '5', section: 'Results', table: 'Table 1' }, extractionType: 'normalized', confidence: 'medium' }],
    tables: [{ id: 't1', label: 'Table 1', rowsChecked: true, exactValuesNeedReview: true }],
    figures: [{ id: 'f1', label: 'Figure 1', panels: ['A', 'B'], visualInterpretation: 'Example only' }],
    features: [{ name: 'Hippocampal volume', modality: 'sMRI', preprocessing: 'Not reported' }],
    qualityChecks: [{ type: 'coverage', state: 'warning', message: 'Supplement not reviewed' }],
    limitationsAndGaps: ['External validation not reported'],
    unknowns: ['Atlas', 'multiple-comparison correction']
  };

  const builtInPapers = papers.map(row => structuredClone(row));
  const builtInEvidence = evidence.map(row => structuredClone(row));
  const bridgePaperIds = new Set();
  const paperAnalysisCache = new Map();
  let pendingImportPayload = null;

  const asList = value => (Array.isArray(value) ? value : String(value || '').split(/[,\n]/)).map(item => String(item || '').trim()).filter(Boolean);
  const detailText = value => {
    if (Array.isArray(value)) return value.map(detailText).filter(Boolean).join(' · ');
    if (value && typeof value === 'object') return Object.entries(value).map(([key, item]) => `${key}: ${detailText(item)}`).filter(item => !item.endsWith(': ')).join(' · ');
    return String(value || '').trim();
  };
  const locatorText = locator => {
    const row = locator && typeof locator === 'object' ? locator : {};
    return [row.section, row.printedPage || row.printed_page, row.pdfPage || row.pdf_page, row.table, row.figure, row.panel, row.appendix || row.supplement].filter(Boolean).join(' · ') || '위치 미확인';
  };
  const sourceStatus = row => row.reviewState === 'verified' ? 'verified' : row.reviewState === 'rejected' ? 'rejected' : 'review';

  function mapBridgePaper(row) {
    const neuro = row.neuroProfile || {};
    const modalities = asList(neuro.modalities);
    const topics = [...new Set([row.researchTopic, ...asList(row.tags), ...asList(row.keywords)].filter(Boolean))].slice(0, 6);
    const doi = String(row.doi || '').trim();
    return {
      id: row.id,
      title: row.title,
      authors: row.authors || '저자 미입력',
      year: row.year || '연도 미입력',
      journal: row.journal || '저널 미입력',
      doi,
      url: /^https?:\/\//i.test(doi) ? doi : doi ? `https://doi.org/${doi.replace(/^doi:\s*/i, '')}` : '',
      type: neuro.studyDesign || row.method || '연구 설계 미분류',
      population: neuro.speciesPopulation || row.population || '대상군 미입력',
      sample: row.researchLandscape?.sampleSize ? `N=${row.researchLandscape.sampleSize}` : row.population || '분석별 N 확인 필요',
      modality: modalities.join(' · ') || '모달리티 미입력',
      method: row.method || neuro.neuroAnalysis || '방법 미입력',
      topics: topics.length ? topics : ['분류 필요'],
      status: row.status === 'reviewed' || row.status === 'citationCandidate' ? 'verified' : 'review',
      statusLabel: row.status === 'citationCandidate' ? '인용 후보' : row.status === 'reviewed' ? '사용자 검토' : '검토 대기',
      coverage: Math.max(18, Math.min(100, Math.round([row.summary, row.researchQuestion, row.population, row.method, row.findings, row.limitations, neuro.brainRegions?.length, modalities.length].filter(Boolean).length / 8 * 100))),
      summary: row.summary || row.background || '요약을 입력하거나 GPT V3 결과를 가져오세요.',
      finding: row.findings || row.summary || '핵심 결과를 원문과 함께 확인해야 합니다.',
      limitation: row.limitations || (row.importWarnings || []).join(' · ') || 'Methods, Results와 Supplement를 확인해 해석 경계를 추가하세요.',
      neuro: {
        region: asList(neuro.brainRegions).join(' · ') || '영역 미입력',
        network: asList(neuro.brainRegions).filter(value => /network|회로|connect/i.test(value)).join(' · ') || 'network 미입력',
        atlas: neuro.neuroAnalysis || 'atlas·좌표공간 미입력',
        preprocessing: neuro.acquisitionPreprocessing || '획득·전처리 미입력',
        statistics: neuro.statistics || '통계·보정 미입력'
      },
      _bridge: true,
      _source: row,
    };
  }

  function mapBridgeEvidence(row) {
    return {
      id: `bridge-${row.id}`,
      paperId: row.paperId,
      state: sourceStatus(row),
      direction: row.evidenceDirection || 'context',
      type: row.claimType || '근거',
      confidence: ({ high: '높음', moderate: '중간', low: '낮음', unknown: '미평가' })[row.extractionConfidence] || '미평가',
      strength: ({ high: '높은 근거', moderate: '중간 근거', low: '낮은 근거', not_assessed: '근거 수준 미평가' })[row.evidenceStrength] || '근거 수준 미평가',
      title: row.title || row.content || '제목 없는 근거',
      quote: row.sourceQuote ? `“${row.sourceQuote}”` : '원문 인용이 아직 연결되지 않았습니다.',
      locator: locatorText(row.locator || { section: row.sourceSection, printedPage: row.sourcePage }),
      interpretation: row.interpretation || row.content || 'AI 해석과 사용자 판단을 분리해 추가하세요.',
      warning: [row.counterEvidence, ...(row.verificationFlags || [])].filter(Boolean).join(' · ') || '원문과 표·그림을 대조한 뒤 사용하세요.',
      _bridgeInsightId: row.id,
    };
  }

  function syncBridgeCollections() {
    const snapshot = window.AiderPaperBridge?.snapshot?.() || { paperItems: [], researchInsights: [] };
    bridgePaperIds.clear();
    const mergedPapers = builtInPapers.map(row => structuredClone(row));
    const fingerprints = new Set(mergedPapers.map(row => String(row.doi || row.title).trim().toLowerCase()));
    const paperIdAlias = new Map();
    (snapshot.paperItems || []).forEach(row => {
      if (!row?.id || !row.title) return;
      bridgePaperIds.add(row.id);
      const mapped = mapBridgePaper(row);
      const fingerprint = String(mapped.doi || mapped.title).trim().toLowerCase();
      if (fingerprints.has(fingerprint) && row.isSample) {
        const existingPaper = mergedPapers.find(item => String(item.doi || item.title).trim().toLowerCase() === fingerprint);
        if (existingPaper) paperIdAlias.set(row.id, existingPaper.id);
        return;
      }
      const duplicateIndex = mergedPapers.findIndex(item => String(item.doi || item.title).trim().toLowerCase() === fingerprint);
      if (duplicateIndex >= 0) mergedPapers.splice(duplicateIndex, 1, mapped);
      else mergedPapers.unshift(mapped);
      fingerprints.add(fingerprint);
    });
    papers.splice(0, papers.length, ...mergedPapers);
    const bridgeEvidence = (snapshot.researchInsights || []).filter(row => row?.id).map(row => mapBridgeEvidence({ ...row, paperId: paperIdAlias.get(row.paperId) || row.paperId })).filter(row => papers.some(paper => paper.id === row.paperId));
    evidence.splice(0, evidence.length, ...bridgeEvidence, ...builtInEvidence.map(row => structuredClone(row)));
    if (!paperById(selectedPaperId)) selectedPaperId = papers[0]?.id || '';
    if (!evidence.some(row => row.id === selectedEvidenceId)) selectedEvidenceId = evidence.find(row => row.state === 'review')?.id || evidence[0]?.id || '';
  }

  function hydrateAnalysis(paperId, payload) {
    if (!payload || !paperId) return;
    paperAnalysisCache.set(paperId, payload);
    const close = payload.closeReading || {}, evaluation = payload.criticalEvaluation || {};
    const paper = paperById(paperId);
    if (!paper) return;
    const walkthrough = Array.isArray(close.narrativeWalkthrough) ? close.narrativeWalkthrough : [];
    paperExplanations[paperId] = {
      koreanTitle: paper.title,
      orientation: close.orientationParagraph || close.rationale || paper.summary,
      walkthrough: walkthrough.map((row, index) => [`${String(row.step || index + 1).padStart(2, '0')} · ${row.title || '정독 단계'}`, `${row.explanation || ''}${row.locator ? ` [${row.locator}]` : ''}`]),
      keyTerms: (Array.isArray(close.keyTerms) ? close.keyTerms : []).map(row => [row.term || '용어', row.definition || '', row.roleInThisPaper || '']),
      studyAnswers: (Array.isArray(close.studyAnswers) ? close.studyAnswers : []).map(row => [row.question || '확인 질문', row.answer || '']),
    };
    closeReads[paperId] = {
      thesis: close.oneSentenceThesis || paper.finding,
      readingTime: `정독 해설 ${Math.max(6, walkthrough.length)}단계`,
      question: close.researchQuestion || paperDeepDive[paperId]?.question || '',
      rationale: close.rationale || close.orientationParagraph || paper.summary,
      hypothesis: asList(close.hypotheses),
      cohort: (Array.isArray(close.cohortFlow) ? close.cohortFlow : []).map(row => [row.stage || '표본 단계', [row.n != null ? `N=${row.n}` : '', row.exclusionReason].filter(Boolean).join(' · ')]),
      measures: (Array.isArray(close.measures) ? close.measures : []).map(row => [row.construct || row.name || '측정', detailText(row.operationalization || row)]),
      pipeline: (Array.isArray(close.analysisPipeline) ? close.analysisPipeline : asList(close.analysisPipeline)).map((row, index) => [String(index + 1).padStart(2, '0'), row.title || row.stage || '분석 단계', detailText(row.explanation || row)]),
      results: (Array.isArray(close.mainResults) ? close.mainResults : []).map(row => [row.direction || '결과', row.value || row.estimate || '추정치', row.plainLanguageMeaning || detailText(row), [row.caveat, row.locator].filter(Boolean).join(' · ')]),
      nulls: (Array.isArray(close.nullAndMixedResults) ? close.nullAndMixedResults : asList(close.nullAndMixedResults)).map(detailText),
      figures: [...(Array.isArray(close.tableMap) ? close.tableMap : []).map(row => ['TABLE', row.label || '표', row.role || detailText(row), '행·열·단위·분모·효과·각주 확인']), ...(Array.isArray(close.figureMap) ? close.figureMap : []).map(row => ['FIGURE', row.label || '그림', row.role || detailText(row), `패널 ${detailText(row.panels) || '확인 필요'} · 축·범례·통계 확인`])],
      appraisal: { strengths: asList(close.criticalAppraisal?.strengths), limitations: [...asList(close.criticalAppraisal?.authorLimitations), ...asList(close.criticalAppraisal?.reviewerLimitations)], boundary: close.criticalAppraisal?.interpretationBoundary || paper.limitation },
      reproducibility: (Array.isArray(close.reproducibilityLedger) ? close.reproducibilityLedger : asList(close.reproducibilityLedger)).map(detailText),
      ideas: (Array.isArray(close.researchIdeaSeeds) ? close.researchIdeaSeeds : asList(close.researchIdeaSeeds)).map(detailText),
    };
    paperEvaluations[paperId] = {
      grade: evaluation.overallVerdict?.grade || '근거 확인 필요',
      confidence: evaluation.overallVerdict?.confidence || '미평가',
      verdict: evaluation.overallVerdict?.verdict || '비평 결과가 없습니다.',
      dimensions: (evaluation.evaluationDimensions || []).map(row => [row.dimension || '평가축', row.rating || 'unclear', row.judgment || row.basis || '', [row.locator, ...(row.evidenceClaimIds || [])].filter(Boolean).join(' · '), row.impactOnInterpretation || '해석 영향 확인 필요']),
      claimBalance: (evaluation.claimTriangulation || []).map(row => [row.claim || '핵심 주장', detailText(row.supportingEvidence), detailText(row.limitingOrOpposingEvidence), row.balancedVerdict || '균형 판단 필요']),
      biases: (evaluation.biasAudit || []).map(row => [row.risk || '편향', row.severity || 'unclear', `${row.observedBasis || ''} ${row.consequence || ''}`.trim(), row.mitigation || '완화 방법 확인 필요']),
      decision: evaluation.overallVerdict?.decisionForMyResearch || '사용 결정을 사용자 검토 후 기록하세요.',
    };
    paperDeepDive[paperId] = {
      question: close.researchQuestion || paper.summary,
      design: detailText(payload.studyProfile),
      variables: detailText(close.measures),
      validation: detailText(payload.neuroProfile?.validation || evaluation.evaluationDimensions),
      tables: detailText(close.tableMap),
      figures: detailText(close.figureMap),
      reproducibility: detailText(close.reproducibilityLedger),
      use: asList(evaluation.applicability?.supportedUses),
      openQuestions: [...asList(close.researchIdeaSeeds), ...asList(payload.unknowns)],
    };
  }

  async function loadAnalysisForPaper(paperId) {
    if (!bridgePaperIds.has(paperId) || paperAnalysisCache.has(paperId) || !window.AiderPaperBridge?.loadAnalysis) return;
    try {
      const payload = await window.AiderPaperBridge.loadAnalysis(paperId);
      if (payload) { hydrateAnalysis(paperId, payload); if (selectedPaperId === paperId && currentView === 'paper') render(); }
    } catch (error) { console.warn('Detailed analysis load failed', error); }
  }

  let currentView = 'paper';
  let selectedEvidenceId = evidence.find(item => item.state === 'review')?.id || evidence[0].id;
  let evidenceFilter = 'all';
  let studyStep = 3;
  let atlasRegion = 'hippocampus';
  let atlasMapExpanded = false;
  let librarySelection = new Set();
  let selectedPaperId = 'qu-2025-ef';
  let previousView = 'library';
  let paperDetailTab = 'overview';

  function paperById(id) { return papers.find(paper => paper.id === id); }
  function deepForPaper(paper) {
    return paperDeepDive[paper.id] || {
      question: `${paper.topics.join('·')}를 ${paper.population}에서 어떤 설계로 검증했는가?`,
      design: paper.type,
      variables: `${paper.modality} · ${paper.method}`,
      validation: '원문 Methods와 Supplement에서 훈련·검증·재현 단계를 확인해야 합니다.',
      tables: '표본 특성, 결측, 분석별 N, 효과크기와 불확실성을 확인합니다.',
      figures: '축·범례·분모·보정 여부를 확인하고 시각적 크기만으로 효과를 판단하지 않습니다.',
      reproducibility: '데이터·코드·전처리 버전과 분석 환경을 기록합니다.',
      use: ['서론: 연구 배경', '방법: 설계 참고', '논의: 한계와 일반화 범위'],
      openQuestions: ['독립 표본에서 재현되는가?', '대안 모형과 교란 설명은 충분히 배제됐는가?']
    };
  }
  function deepForEvidence(item, paper) {
    return evidenceDeepDive[item.id] || {
      direct: item.title,
      inference: item.interpretation,
      boundary: paper.limitation,
      modifiers: ['표본 구성', '측정 신뢰도', '분석 선택', '외부 타당도'],
      checklist: ['원문 위치', '분석별 N', '효과크기', '신뢰구간', '보정 방법']
    };
  }
  function closeForPaper(paper) {
    if (closeReads[paper.id]) return closeReads[paper.id];
    const deep = deepForPaper(paper);
    return {
      thesis: paper.finding,
      readingTime: '핵심 읽기 8분',
      question: deep.question,
      rationale: paper.summary,
      hypothesis: ['원문 서론에서 명시된 가설을 추가 확인해야 합니다.'],
      cohort: [['등록 표본', paper.sample], ['대상군', paper.population], ['분석 표본', 'Methods의 flow와 분석별 N을 추가 확인']],
      measures: [['핵심 변수', deep.variables], ['연구 방법', paper.method], ['영상 모달리티', paper.modality]],
      pipeline: [['01', '설계', deep.design], ['02', '전처리', paper.neuro.preprocessing], ['03', '표현', paper.neuro.atlas], ['04', '모형', paper.neuro.statistics], ['05', '검증', deep.validation]],
      results: [['핵심', '주요 결과', paper.finding, paper.limitation]],
      nulls: ['원문 Results와 Supplement에서 비유의·반대 결과를 추가 추출해야 합니다.'],
      figures: [['TABLES', '수치 검토', deep.tables, '분모·단위·효과크기·불확실성'], ['FIGURES', '패널 검토', deep.figures, '축·범례·색상척도·오차막대']],
      appraisal: { strengths: ['핵심 서지와 연구 질문이 구조화됨'], limitations: [paper.limitation], boundary: paper.limitation },
      reproducibility: [deep.reproducibility],
      ideas: deep.openQuestions
    };
  }
  function paperExplanationHtml(paper) {
    const explanation = paperExplanations[paper.id];
    if (!explanation) return '';
    return `<article class="research-card close-section narrative-section">
      <div class="close-section-head"><div><span>FULL PAPER WALKTHROUGH</span><h2>${escapeHtml(explanation.koreanTitle)}</h2><p>초록식 요약이 아니라 논문의 문제 설정부터 결론의 경계까지 순서대로 설명합니다.</p></div><b>${explanation.walkthrough.length}단계 해설</b></div>
      <div class="narrative-orientation"><b>먼저 이 논문을 한 문단으로 이해하면</b><p>${escapeHtml(explanation.orientation)}</p></div>
      <div class="narrative-timeline">${explanation.walkthrough.map(([title, text]) => `<section><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></section>`).join('')}</div>
    </article>
    <section class="explanation-reference-grid">
      <article class="research-card close-section"><div class="close-section-head"><div><span>KEY CONCEPTS IN CONTEXT</span><h2>이 논문을 읽기 위한 핵심 용어</h2><p>사전 정의가 아니라 이 연구에서 어떤 역할을 하는지까지 설명합니다.</p></div></div><div class="concept-dictionary">${explanation.keyTerms.map(([term, definition, why]) => `<details open><summary>${escapeHtml(term)}</summary><p>${escapeHtml(definition)}</p><small><b>이 논문에서 중요한 이유</b>${escapeHtml(why)}</small></details>`).join('')}</div></article>
      <article class="research-card close-section"><div class="close-section-head"><div><span>AFTER CLOSE READING</span><h2>정독했다면 답할 수 있어야 하는 질문</h2><p>논문의 내용을 연구 판단에 사용할 수 있는 형태로 확인합니다.</p></div></div><div class="study-answer-list">${explanation.studyAnswers.map(([question, answer], index) => `<div><i>Q${index + 1}</i><span><b>${escapeHtml(question)}</b><p>${escapeHtml(answer)}</p></span></div>`).join('')}</div></article>
    </section>`;
  }
  function evaluationForPaper(paper) {
    return paperEvaluations[paper.id] || {
      grade: '검토 필요', confidence: '미평가',
      verdict: '이 논문은 아직 근거 기반 비평 항목이 완전히 추출되지 않았습니다. 원문 Methods, Results, 표·그림과 Supplement를 대조한 뒤 평가해야 합니다.',
      dimensions: [['평가 준비도', '낮음', '현재 서지와 요약만으로는 타당도·편향·재현성을 점수화할 근거가 부족합니다.', '원문 전체 확인 필요', '근거가 채워질 때까지 연구 판단에서 제외합니다.']],
      claimBalance: [['핵심 주장', paper.finding, paper.limitation, '원문 근거 위치와 반대·제한 결과를 확인하기 전 잠정 판단입니다.']],
      biases: [['불완전한 문서 범위', '높음', '본문·표·그림·부록의 전체 검토 여부가 확인되지 않았습니다.', 'AI 요약만으로 평가하면 선택적 인용 위험이 있습니다.']],
      decision: '검토 대기. 원문 근거가 연결되기 전에는 논문·연구계획의 핵심 근거로 사용하지 않습니다.'
    };
  }
  function paperEvaluationHtml(paper) {
    const evaluation = evaluationForPaper(paper);
    return `<section class="close-read-stack evaluation-workspace">
      <article class="research-card evaluation-verdict"><div><span>EVIDENCE-BASED CRITICAL REVIEW</span><h2>이 논문의 근거 강도와 사용 범위</h2><p>${escapeHtml(evaluation.verdict)}</p></div><aside><small>종합 판단</small><strong>${escapeHtml(evaluation.grade)}</strong><b>평가 확신 ${escapeHtml(evaluation.confidence)}</b></aside></article>
      <div class="evaluation-safety"><b>평가 원칙</b><span>원문 사실</span><i>→</i><span>방법론 판단</span><i>→</i><span>연구 사용 결정</span><p>평가 문장은 AI 해석입니다. 각 판단 아래에 근거 위치와 해석 영향을 표시하며, 근거가 없으면 점수화하지 않습니다.</p></div>
      <section class="research-card close-section"><div class="close-section-head"><div><span>VALIDITY BY DIMENSION</span><h2>타당도·통계·일반화·재현성 평가</h2><p>좋다/나쁘다가 아니라 무엇을 근거로 어느 결론까지 허용하는지 판정합니다.</p></div><b>${evaluation.dimensions.length}개 평가축</b></div><div class="evaluation-dimensions">${evaluation.dimensions.map(([name, level, basis, locator, impact], index) => `<article><header><i>${String(index + 1).padStart(2, '0')}</i><span><b>${escapeHtml(name)}</b><small>${escapeHtml(level)}</small></span></header><p>${escapeHtml(basis)}</p><div><span>근거 위치</span><b>${escapeHtml(locator)}</b></div><div class="evaluation-impact"><span>판단에 미치는 영향</span><b>${escapeHtml(impact)}</b></div></article>`).join('')}</div></section>
      <section class="research-card close-section"><div class="close-section-head"><div><span>CLAIM TRIANGULATION</span><h2>주장별 지지 근거와 제한 근거</h2><p>논문의 대표 결론을 한쪽 방향의 결과만으로 평가하지 않습니다.</p></div></div><div class="claim-balance-list">${evaluation.claimBalance.map(([claim, support, counter, conclusion]) => `<article><h3>${escapeHtml(claim)}</h3><div class="claim-balance"><div class="supports"><span>지지 근거</span><p>${escapeHtml(support)}</p></div><div class="limits"><span>반대·제한 근거</span><p>${escapeHtml(counter)}</p></div></div><footer><span>균형 판정</span><b>${escapeHtml(conclusion)}</b></footer></article>`).join('')}</div></section>
      <section class="evaluation-bottom-grid"><article class="research-card close-section"><div class="close-section-head"><div><span>BIAS AUDIT</span><h2>편향·실패 가능성</h2></div></div><div class="bias-audit-list">${evaluation.biases.map(([risk, level, evidenceText, consequence]) => `<div><header><b>${escapeHtml(risk)}</b><span>${escapeHtml(level)}</span></header><p>${escapeHtml(evidenceText)}</p><small><b>왜 중요한가</b>${escapeHtml(consequence)}</small></div>`).join('')}</div></article><article class="research-card close-section research-decision"><span>DECISION FOR MY RESEARCH</span><h2>이 논문을 실제로 어디까지 사용할까?</h2><p>${escapeHtml(evaluation.decision)}</p><div><button type="button">평가를 검토 완료로 표시</button><button type="button">Study Workspace로 보내기</button></div></article></section>
    </section>`;
  }
  function stateLabel(state) { return ({ verified: '검증 완료', review: '검토 대기', rejected: '제외됨' })[state] || state; }
  function directionLabel(direction) { return ({ support: '지지', oppose: '반대', mixed: '혼재', context: '맥락' })[direction] || direction; }
  function showToast(message) {
    const toast = $('#paperPreviewToast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('show'), 2300);
  }

  function updateBadges() {
    const count = evidence.filter(item => item.state === 'review').length;
    $('#evidenceBadge').textContent = count;
    $('#evidenceBadge').hidden = count === 0;
  }

  function goView(view) {
    currentView = view;
    $$('#paperNav [data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === view || (view === 'paper' && button.dataset.view === 'library')));
    render();
    $('#paperContent')?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function heading(eyebrow, title, description, actions = '') {
    return `<header class="page-heading"><div><span class="eyebrow">${escapeHtml(eyebrow)}</span><h1>${escapeHtml(title)}</h1></div><p>${escapeHtml(description)}</p>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</header>`;
  }

  function renderHub() {
    const verified = evidence.filter(item => item.state === 'verified').length;
    const pending = evidence.filter(item => item.state === 'review').length;
    return `<div class="view-stack">
      ${heading('RESEARCH HUB', '연구를 이어갈 지점이 보이는 홈', '단순한 개수 대신 지금 검토할 근거와 다음 연구 행동을 먼저 보여줍니다.')}
      <section class="hub-hero">
        <article class="research-card focus-card">
          <span>TODAY’S RESEARCH FOCUS</span>
          <h2>BrainAGE를 생물학적 노화 지표로 사용하기 전에 외부검증과 임상 타당도를 확인하세요.</h2>
          <p>현재 문헌 집합에서는 질환군 차이는 반복되지만, 임상 특성과의 연관은 혼재되어 있습니다. 검토 대기 근거 ${pending}건을 확인하면 연구 아이디어의 타당도 평가가 갱신됩니다.</p>
          <div class="focus-actions"><button type="button" class="primary-button" data-go="evidence">근거 검토 시작</button><button type="button" class="outline-button" data-go="synthesis">통합 분석 보기</button></div>
          <div class="focus-meta"><div><strong>${pending}</strong><small>검토 대기</small></div><div><strong>${verified}</strong><small>검증 근거</small></div><div><strong>2</strong><small>연구 공백</small></div></div>
        </article>
        <article class="research-card review-card">
          <div class="section-heading compact"><div><span>EVIDENCE HEALTH</span><h3>근거 검토 완성도</h3></div></div>
          <div class="review-ring"><strong>${Math.round(verified / evidence.length * 100)}%</strong></div>
          <div class="review-breakdown"><span>원문 위치 있음 <b>${evidence.length} / ${evidence.length}</b></span><span>검증 완료 <b>${verified} / ${evidence.length}</b></span><span>본문 전체 확인 <b>3 / ${papers.length}</b></span><span>표·그림 확인 <b>2 / ${papers.length}</b></span></div>
        </article>
      </section>
      <section class="stats-grid">
        <article class="research-card stat-card"><span>LIBRARY</span><strong>${papers.length}</strong><small>실제 학술 논문 예시</small></article>
        <article class="research-card stat-card"><span>VERIFIED EVIDENCE</span><strong>${verified}</strong><small>후속 분석에 사용</small></article>
        <article class="research-card stat-card"><span>REVIEW QUEUE</span><strong>${pending}</strong><small>원문 확인 필요</small></article>
        <article class="research-card stat-card"><span>STUDY READINESS</span><strong>72%</strong><small>설계 보완 3개</small></article>
      </section>
      <section class="two-column">
        <article class="research-card panel">
          <div class="section-heading"><div><span>CONTINUE RESEARCH</span><h2>최근 연구 흐름</h2></div><button class="text-button" data-go="library">Library 전체 →</button></div>
          <div class="work-list">
            ${papers.slice(0, 4).map((paper, index) => `<button type="button" class="work-item" data-paper="${paper.id}"><i>${String(index + 1).padStart(2, '0')}</i><span><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.authors)} · ${paper.year}</small></span><span>→</span></button>`).join('')}
          </div>
        </article>
        <article class="research-card panel">
          <div class="section-heading"><div><span>RESEARCH ACTIVITY</span><h2>다음 행동</h2></div></div>
          <div class="activity-timeline">
            <div><span><b>BrainAGE 임상 타당도 근거 검토</b><p>초록 기반 Insight를 원문 표와 대조합니다.</p></span></div>
            <div><span><b>인지예비능 조작화 비교</b><p>교육·직업·활동 복합 지표의 정의 차이를 정리합니다.</p></span></div>
            <div><span><b>연구 설계의 외부검증 계획 보완</b><p>내부 교차검증과 독립 코호트를 구분합니다.</p></span></div>
          </div>
        </article>
      </section>
    </div>`;
  }

  function libraryRows(rows) {
    return rows.map(paper => `<tr>
      <td><input type="checkbox" data-library-select="${paper.id}" ${librarySelection.has(paper.id) ? 'checked' : ''} aria-label="${escapeHtml(paper.title)} 선택"></td>
      <td class="paper-cell"><button type="button" data-paper="${paper.id}"><b>${escapeHtml(paper.title)}</b><small>${escapeHtml(paper.authors)} · ${paper.journal} · ${paper.year}</small></button></td>
      <td>${escapeHtml(paper.type)}</td><td>${escapeHtml(paper.population)}</td><td>${escapeHtml(paper.modality)}</td>
      <td class="topic-tags">${paper.topics.map(topic => `<span class="tag">${escapeHtml(topic)}</span>`).join('')}</td>
      <td><span class="status-pill ${paper.status}">${escapeHtml(paper.statusLabel)}</span></td><td>${paper.coverage}%</td>
    </tr>`).join('');
  }

  function renderLibrary() {
    const query = ($('#libraryQuery')?.value || '').trim().toLowerCase();
    const selectedType = $('#libraryType')?.value || '';
    const selectedModality = $('#libraryModality')?.value || '';
    const selectedState = $('#libraryState')?.value || '';
    const rows = papers.filter(paper => {
      const hay = [paper.title, paper.authors, paper.journal, paper.type, paper.population, paper.modality, ...paper.topics].join(' ').toLowerCase();
      return (!query || hay.includes(query)) && (!selectedType || paper.type === selectedType) && (!selectedModality || paper.modality.includes(selectedModality)) && (!selectedState || paper.status === selectedState);
    });
    return `<div class="view-stack">
      ${heading('LIBRARY', '논문을 찾고, 묶고, 바로 검토하세요', '태그를 별도 페이지로 분리하지 않고 대상·주제·방법·모달리티 필터 안에 통합했습니다.', '<button class="outline-button" data-selection-action="compare">선택 비교</button>')}
      <form class="research-card filter-bar" id="libraryFilters">
        <label><span>SEARCH</span><input id="libraryQuery" value="${escapeHtml(query)}" placeholder="제목, 저자, 키워드"></label>
        <label><span>STUDY TYPE</span><select id="libraryType"><option value="">전체 연구</option>${[...new Set(papers.map(p => p.type))].map(value => `<option ${selectedType === value ? 'selected' : ''}>${escapeHtml(value)}</option>`).join('')}</select></label>
        <label><span>MODALITY</span><select id="libraryModality"><option value="">전체 모달리티</option>${['Structural MRI', 'resting-state fMRI', 'cognition'].map(value => `<option ${selectedModality === value ? 'selected' : ''}>${value}</option>`).join('')}</select></label>
        <label><span>REVIEW STATE</span><select id="libraryState"><option value="">전체 상태</option><option value="verified" ${selectedState === 'verified' ? 'selected' : ''}>메타데이터 확인</option><option value="abstract" ${selectedState === 'abstract' ? 'selected' : ''}>초록 기반</option></select></label>
      </form>
      <section class="research-card">
        <div class="library-toolbar"><span><b>${rows.length}</b> papers · <b>${librarySelection.size}</b> selected</span><button type="button" data-selection-action="tag">태그</button><button type="button" data-selection-action="project">프로젝트 이동</button><button type="button" data-selection-action="compare">비교</button><button type="button" class="danger" data-selection-action="delete">삭제</button></div>
        <div class="table-wrap"><table class="paper-table"><thead><tr><th><input type="checkbox" id="selectAllPapers" aria-label="전체 선택"></th><th>PAPER</th><th>TYPE</th><th>POPULATION</th><th>MODALITY</th><th>TOPICS</th><th>SOURCE STATE</th><th>COVERAGE</th></tr></thead><tbody>${libraryRows(rows)}</tbody></table></div>
      </section>
    </div>`;
  }

  function closeReadBody(paper, tab) {
    const read = closeForPaper(paper);
    const paperEvidence = evidence.filter(item => item.paperId === paper.id);
    if (tab === 'methods') return `<section class="close-read-stack">
      <article class="research-card close-section"><div class="close-section-head"><div><span>COHORT FLOW</span><h2>누가, 어떤 단계에서 분석에 포함됐나</h2><p>초기 모집 숫자와 최종 분석 N을 같은 값으로 취급하지 않습니다.</p></div><b>${escapeHtml(read.readingTime)}</b></div><div class="cohort-flow">${read.cohort.map(([label, value], index) => `<div><i>${String(index + 1).padStart(2, '0')}</i><span><b>${escapeHtml(label)}</b><p>${escapeHtml(value)}</p></span></div>`).join('')}</div></article>
      <section class="close-two-column"><article class="research-card close-section"><div class="close-section-head"><div><span>VARIABLE DICTIONARY</span><h2>측정과 조작화</h2></div></div><div class="measure-grid">${read.measures.map(([label, value]) => `<div><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div></article><article class="research-card close-section"><div class="close-section-head"><div><span>NEURO PROFILE</span><h2>영상·분석 단위</h2></div></div><dl class="method-dictionary"><div><dt>Modality</dt><dd>${escapeHtml(paper.modality)}</dd></div><div><dt>Preprocessing</dt><dd>${escapeHtml(paper.neuro.preprocessing)}</dd></div><div><dt>Atlas / space</dt><dd>${escapeHtml(paper.neuro.atlas)}</dd></div><div><dt>Region</dt><dd>${escapeHtml(paper.neuro.region)}</dd></div><div><dt>Network</dt><dd>${escapeHtml(paper.neuro.network)}</dd></div><div><dt>Statistics</dt><dd>${escapeHtml(paper.neuro.statistics)}</dd></div></dl></article></section>
      <article class="research-card close-section"><div class="close-section-head"><div><span>ANALYSIS PIPELINE</span><h2>원자료에서 결론까지</h2><p>각 변환 단계가 결론에 어떤 가정을 더하는지 따라갑니다.</p></div></div><div class="method-pipeline">${read.pipeline.map(([number, label, value]) => `<div><i>${escapeHtml(number)}</i><span><b>${escapeHtml(label)}</b><p>${escapeHtml(value)}</p></span></div>`).join('')}</div></article>
    </section>`;
    if (tab === 'results') return `<section class="close-read-stack">
      <article class="research-card close-section"><div class="close-section-head"><div><span>RESULTS, WITH DENOMINATORS</span><h2>핵심 결과와 해석 경계</h2><p>숫자, 무엇을 뜻하는지, 무엇을 뜻하지 않는지를 한 줄에서 함께 읽습니다.</p></div></div><div class="result-grid">${read.results.map(([value, label, explanation, caveat]) => `<article><div><strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span></div><p>${escapeHtml(explanation)}</p><small>해석 경계 · ${escapeHtml(caveat)}</small></article>`).join('')}</div></article>
      <article class="research-card close-section null-section"><div class="close-section-head"><div><span>NULL · NEGATIVE · MIXED RESULTS</span><h2>결론에서 빠지기 쉬운 결과</h2><p>유의한 결과만 기억해 논문의 주장을 과장하지 않도록 따로 보존합니다.</p></div></div><div class="null-list">${read.nulls.map((item, index) => `<div><i>${String(index + 1).padStart(2, '0')}</i><p>${escapeHtml(item)}</p></div>`).join('')}</div></article>
    </section>`;
    if (tab === 'visuals') return `<section class="close-read-stack"><article class="research-card close-section"><div class="close-section-head"><div><span>FIGURE & TABLE READING MAP</span><h2>그림을 보는 순서와 확인할 패널</h2><p>캡션 요약이 아니라 각 그림의 역할, 읽을 메시지, 시각적 함정을 기록합니다.</p></div><b>${read.figures.length}개 항목</b></div><div class="figure-map">${read.figures.map(([label, role, reading, check], index) => `<article><div class="figure-index"><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(label)}</b></div><div><span>${escapeHtml(role)}</span><h3>${escapeHtml(reading)}</h3><p><b>확인할 것</b>${escapeHtml(check)}</p></div><button type="button" aria-label="${escapeHtml(label)} 검토">패널 검토 ↗</button></article>`).join('')}</div><div class="visual-safety"><b>시각 자료 판독 원칙</b><span>축·분모·단위</span><span>오차막대·CI</span><span>색상척도</span><span>보정 threshold</span><span>본문·표 수치 대조</span><span>판독 불가 값은 추정 금지</span></div></article></section>`;
    if (tab === 'appraisal') return `${paperEvaluationHtml(paper)}<section class="close-read-stack legacy-appraisal">
      <section class="appraisal-grid"><article class="research-card close-section strength"><div class="close-section-head"><div><span>AUTHOR-LEVEL STRENGTHS</span><h2>설계의 강점 요약</h2></div></div><ul>${read.appraisal.strengths.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article><article class="research-card close-section limitation"><div class="close-section-head"><div><span>AUTHOR + REVIEWER LIMITS</span><h2>저자 한계와 추가 비판 요약</h2></div></div><ul>${read.appraisal.limitations.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></article></section>
      <article class="research-card close-section boundary-box"><span>INTERPRETATION BOUNDARY</span><h2>이 논문으로 단정하면 안 되는 것</h2><p>${escapeHtml(read.appraisal.boundary)}</p></article>
      <article class="research-card close-section"><div class="close-section-head"><div><span>REPRODUCIBILITY LEDGER</span><h2>재현하려면 확보할 정보</h2><p>논문을 ‘이해했다’와 분석을 ‘재현할 수 있다’를 구분합니다.</p></div></div><div class="repro-list">${read.reproducibility.map((item, index) => `<div><i>${index < 3 ? '✓' : '△'}</i><span><b>${escapeHtml(item)}</b><small>${index < 3 ? '원문에서 구조화됨' : '재현 전 추가 확인'}</small></span></div>`).join('')}</div></article>
    </section>`;
    if (tab === 'evidence') return `<section class="close-read-stack"><article class="research-card close-section"><div class="close-section-head"><div><span>TRACEABLE EVIDENCE</span><h2>요약을 원문으로 되돌려 검증</h2><p>직접 인용, 위치, AI 해석, 허용 범위를 분리해 저장합니다.</p></div><b>${paperEvidence.length} claims</b></div><div class="detail-evidence-list">${paperEvidence.length ? paperEvidence.map(item => { const detail = deepForEvidence(item, paper); return `<article><header><div><span>${escapeHtml(item.type)} · ${escapeHtml(item.locator)}</span><h3>${escapeHtml(item.title)}</h3></div><span class="state-pill ${item.state}">${stateLabel(item.state)}</span></header><blockquote>${escapeHtml(item.quote)}</blockquote><div class="compact-inference"><div><b>원문이 직접 지지</b><p>${escapeHtml(detail.direct)}</p></div><div><b>허용되는 해석</b><p>${escapeHtml(detail.inference)}</p></div><div class="boundary"><b>지지되지 않음</b><p>${escapeHtml(detail.boundary)}</p></div></div><button type="button" class="paper-inline-link" data-go-evidence="${item.id}">Evidence 검토 화면 열기 →</button></article>`; }).join('') : '<div class="empty-state"><span><strong>연결된 원문 근거가 없습니다.</strong><p>가져오기 단계에서 claim과 locator를 추가하세요.</p></span></div>'}</div></article></section>`;
    if (tab === 'notes') return `<section class="close-read-stack"><section class="close-two-column"><article class="research-card close-section"><div class="close-section-head"><div><span>IDEA SEEDS</span><h2>이 논문에서 이어지는 연구 질문</h2><p>현재 결과의 경계를 다음 연구의 검증 가능한 변수로 바꿉니다.</p></div></div><div class="idea-seeds">${read.ideas.map((item, index) => `<button type="button"><i>${String(index + 1).padStart(2, '0')}</i><span><b>${escapeHtml(item)}</b><small>Study Workspace로 보내기 →</small></span></button>`).join('')}</div></article><article class="research-card close-section"><div class="close-section-head"><div><span>THESIS USE</span><h2>논문에 활용하는 위치</h2></div></div><div class="thesis-use"><div><span>서론</span><b>문제의 크기·이론적 공백과 기존 결과의 범위를 제시</b></div><div><span>방법</span><b>${escapeHtml(paper.method)} 설계와 검증 절차의 참고 사례</b></div><div><span>결과</span><b>직접 비교 가능한 지표만 표준화해 evidence table에 포함</b></div><div><span>논의</span><b>비유의 결과·일반화 한계·대안 기전을 함께 기술</b></div></div></article></section></section>`;
    return `<section class="close-read-stack">
      <article class="research-card close-thesis"><div><span>ONE-SENTENCE THESIS</span><h2>${escapeHtml(read.thesis)}</h2></div><b>${escapeHtml(read.readingTime)}</b></article>
      <section class="close-overview-grid"><article class="research-card close-section research-question-card"><span>RESEARCH QUESTION</span><h2>${escapeHtml(read.question)}</h2><p>${escapeHtml(read.rationale)}</p><div class="hypothesis-list">${read.hypothesis.map((item, index) => `<div><i>H${index + 1}</i><b>${escapeHtml(item)}</b></div>`).join('')}</div></article><aside class="research-card close-section study-profile-card"><span>STUDY PROFILE</span><dl><div><dt>설계</dt><dd>${escapeHtml(paper.type)}</dd></div><div><dt>표본</dt><dd>${escapeHtml(paper.sample)}</dd></div><div><dt>대상</dt><dd>${escapeHtml(paper.population)}</dd></div><div><dt>방법</dt><dd>${escapeHtml(paper.method)}</dd></div><div><dt>모달리티</dt><dd>${escapeHtml(paper.modality)}</dd></div><div><dt>원문 커버리지</dt><dd>${paper.coverage}%</dd></div></dl></aside></section>
      ${paperExplanationHtml(paper)}
      <article class="research-card close-section"><div class="close-section-head"><div><span>NUMBERS TO REMEMBER</span><h2>정독 후 남겨야 할 핵심 수치</h2><p>효과값만 떼어내지 않고 의미와 한계를 같은 카드에 둡니다.</p></div><button type="button" class="text-button" data-paper-tab="results">결과 전체 보기 →</button></div><div class="key-number-grid">${read.results.slice(0, 4).map(([value, label, explanation, caveat]) => `<div><strong>${escapeHtml(value)}</strong><b>${escapeHtml(label)}</b><p>${escapeHtml(explanation)}</p><small>${escapeHtml(caveat)}</small></div>`).join('')}</div></article>
      <section class="close-two-column"><article class="research-card close-section"><div class="close-section-head"><div><span>READING ROUTE</span><h2>이 논문을 다시 볼 때</h2></div></div><ol class="reading-route"><li><b>Methods</b><span>표본 흐름·측정·전처리·분석 파이프라인</span></li><li><b>Results</b><span>분모와 핵심 수치, null·mixed 결과</span></li><li><b>Figures</b><span>패널별 메시지와 시각적 함정</span></li><li><b>Appraisal</b><span>강점·한계·재현 가능성·해석 경계</span></li></ol></article><article class="research-card close-section caution-summary"><span>DO NOT OVERREAD</span><h2>${escapeHtml(read.appraisal.boundary)}</h2><button type="button" class="outline-button" data-paper-tab="appraisal">비평·평가 자세히</button></article></section>
    </section>`;
  }

  function paperDetailBody(paper, tab) {
    if (closeReads[paper.id]) return closeReadBody(paper, tab);
    const deep = deepForPaper(paper);
    const paperEvidence = evidence.filter(item => item.paperId === paper.id);
    if (tab === 'source') return `<section class="detail-grid detail-source-grid">
      <article class="research-card detail-section">
        <div class="section-heading"><div><span>DOCUMENT COVERAGE</span><h2>읽은 범위와 남은 검토</h2><p>AI가 실제로 읽은 자료와 아직 확인하지 않은 자료를 분리합니다.</p></div><div class="coverage-number"><strong>${paper.coverage}</strong><small>%</small></div></div>
        <div class="coverage-meter"><i style="--value:${paper.coverage}%"></i></div>
        <div class="source-check-list">
          <div class="done"><b>✓ 서지·초록</b><span>제목, 저자, DOI와 핵심 목적을 확인</span></div>
          <div class="${paper.coverage >= 80 ? 'done' : 'partial'}"><b>${paper.coverage >= 80 ? '✓' : '△'} Methods</b><span>대상·측정·전처리·통계모형을 구조화</span></div>
          <div class="${paper.coverage >= 72 ? 'done' : 'partial'}"><b>${paper.coverage >= 72 ? '✓' : '△'} Results</b><span>분석별 N, 효과크기, CI와 보정 확인</span></div>
          <div class="partial"><b>△ Supplement</b><span>누락된 민감도·QC·세부 모형을 추가 확인</span></div>
        </div>
      </article>
      <article class="research-card detail-section"><h3>Source audit</h3><div class="audit-list"><div><span>TABLE AUDIT</span><b>${escapeHtml(deep.tables)}</b></div><div><span>FIGURE AUDIT</span><b>${escapeHtml(deep.figures)}</b></div><div><span>REPRODUCIBILITY</span><b>${escapeHtml(deep.reproducibility)}</b></div></div><div class="detail-callout warning-callout"><b>저장 규칙</b><p>읽지 못한 항목은 빈칸이 아니라 ‘미확인’으로 저장하고 Synthesis 기본 분석에서 제외합니다.</p></div></article>
    </section>`;
    if (tab === 'evidence') return `<section class="research-card detail-section">
      <div class="section-heading"><div><span>TRACEABLE CLAIMS</span><h2>원문과 연결된 근거</h2><p>주장마다 원문, 위치, 추론 범위와 검토 상태를 유지합니다.</p></div></div>
      <div class="detail-evidence-list">${paperEvidence.length ? paperEvidence.map(item => { const detail = deepForEvidence(item, paper); return `<article><header><div><span>${escapeHtml(item.type)} · ${escapeHtml(item.locator)}</span><h3>${escapeHtml(item.title)}</h3></div><span class="state-pill ${item.state}">${stateLabel(item.state)}</span></header><blockquote>${escapeHtml(item.quote)}</blockquote><div class="compact-inference"><div><b>직접 지지</b><p>${escapeHtml(detail.direct)}</p></div><div><b>허용되는 해석</b><p>${escapeHtml(detail.inference)}</p></div><div class="boundary"><b>넘으면 안 되는 해석</b><p>${escapeHtml(detail.boundary)}</p></div></div></article>`; }).join('') : '<div class="empty-state"><span><strong>연결된 근거가 없습니다.</strong><p>원문에서 claim을 추출해 추가하세요.</p></span></div>'}</div>
    </section>`;
    if (tab === 'visuals') return `<section class="detail-grid">
      <article class="research-card detail-section"><div class="section-heading"><div><span>TABLE EXTRACTION</span><h2>표에서 확인할 값</h2></div></div><div class="visual-audit"><span>TABLE PLAN · REVIEW REQUIRED</span><h3>${escapeHtml(deep.tables)}</h3><ul><li>집단별 N과 제외된 표본</li><li>단위·기준집단·표준화 방식</li><li>효과크기·95% CI·p값·다중비교</li><li>각주와 결측치 처리</li></ul><button type="button" class="outline-button">표 추출 검토</button></div></article>
      <article class="research-card detail-section"><div class="section-heading"><div><span>FIGURE READING</span><h2>그림 해석 계획</h2></div></div><div class="visual-audit figure"><span>FIGURE PLAN · PANEL LEVEL</span><h3>${escapeHtml(deep.figures)}</h3><ul><li>패널·축·범례와 색상척도</li><li>오차막대와 불확실성 표현</li><li>표본·모형·대조조건 연결</li><li>그림에서만 제시된 수치 여부</li></ul><button type="button" class="outline-button">그림 패널 검토</button></div></article>
    </section>`;
    if (tab === 'neuro') return `<section class="detail-grid">
      <article class="research-card detail-section"><div class="section-heading"><div><span>NEURO PIPELINE</span><h2>신경과학 분석 계보</h2><p>원자료에서 결론까지의 변환을 끊김 없이 기록합니다.</p></div></div><div class="pipeline-flow"><div><span>01</span><b>ACQUISITION</b><p>${escapeHtml(paper.modality)}</p></div><div><span>02</span><b>PREPROCESSING</b><p>${escapeHtml(paper.neuro.preprocessing)}</p></div><div><span>03</span><b>REPRESENTATION</b><p>${escapeHtml(paper.neuro.atlas)}</p></div><div><span>04</span><b>FEATURES</b><p>${escapeHtml(paper.neuro.region)} · ${escapeHtml(paper.neuro.network)}</p></div><div><span>05</span><b>MODEL</b><p>${escapeHtml(paper.neuro.statistics)}</p></div><div><span>06</span><b>VALIDATION</b><p>${escapeHtml(deep.validation)}</p></div></div></article>
      <article class="research-card detail-section"><h3>분석 해석 체크</h3><div class="audit-list"><div><span>FEATURE DEFINITION</span><b>${escapeHtml(deep.variables)}</b></div><div><span>ATLAS / SPACE</span><b>${escapeHtml(paper.neuro.atlas)}</b></div><div><span>GENERALIZATION</span><b>${escapeHtml(deep.validation)}</b></div></div><div class="detail-callout warning-callout"><b>Neuro caution</b><p>영역·network label, BOLD 신호, 구조 차이와 질환 기전을 서로 같은 수준의 증거로 취급하지 않습니다.</p></div></article>
    </section>`;
    if (tab === 'notes') return `<section class="detail-grid">
      <article class="research-card detail-section"><div class="section-heading"><div><span>USE IN THESIS</span><h2>논문 작성 활용</h2><p>복사할 요약이 아니라 어떤 주장에 어떻게 사용할지를 저장합니다.</p></div></div><div class="use-list">${deep.use.map((item, index) => `<div><span>${String(index + 1).padStart(2, '0')}</span><b>${escapeHtml(item)}</b><button type="button">노트로 보내기</button></div>`).join('')}</div></article>
      <article class="research-card detail-section"><div class="section-heading"><div><span>IDEA SEEDS</span><h2>이 논문이 남긴 질문</h2></div></div><div class="question-list">${deep.openQuestions.map(question => `<button type="button"><span>?</span><b>${escapeHtml(question)}</b><small>Study Workspace로 보내기 →</small></button>`).join('')}</div><div class="detail-callout"><b>연결 아이디어</b><p>${escapeHtml(paper.topics.join(' × '))}를 현재 프로젝트의 대상군·결과변수와 교차해 검토합니다.</p></div></article>
    </section>`;
    return `<section class="detail-grid">
      <article class="research-card detail-section overview-main"><span class="eyebrow">RESEARCH QUESTION</span><h2>${escapeHtml(deep.question)}</h2><div class="argument-chain"><div><span>01 · 무엇을 했나</span><b>${escapeHtml(deep.design)}</b><p>${escapeHtml(paper.summary)}</p></div><div><span>02 · 무엇을 발견했나</span><b>${escapeHtml(paper.finding)}</b><p>${escapeHtml(deep.variables)}</p></div><div class="boundary"><span>03 · 어디까지 말할 수 있나</span><b>${escapeHtml(paper.limitation)}</b><p>${escapeHtml(deep.validation)}</p></div></div></article>
      <aside class="research-card detail-section"><h3>Study profile</h3><div class="key-grid"><div><span>STUDY TYPE</span><b>${escapeHtml(paper.type)}</b></div><div><span>SAMPLE</span><b>${escapeHtml(paper.sample)}</b></div><div><span>POPULATION</span><b>${escapeHtml(paper.population)}</b></div><div><span>METHOD</span><b>${escapeHtml(paper.method)}</b></div><div><span>MODALITY</span><b>${escapeHtml(paper.modality)}</b></div><div><span>VALIDATION</span><b>${escapeHtml(deep.validation)}</b></div></div></aside>
      <article class="research-card detail-section"><h3>Evidence snapshot</h3><div class="evidence-mini-list">${paperEvidence.map(item => `<button type="button" class="evidence-mini" data-go-evidence="${item.id}"><header><b>${escapeHtml(item.title)}</b><span class="state-pill ${item.state}">${stateLabel(item.state)}</span></header><p>${escapeHtml(item.interpretation)}</p><span class="locator">${escapeHtml(item.locator)} · 검토 화면 열기 →</span></button>`).join('') || '<p>등록된 Evidence가 없습니다.</p>'}</div></article>
      <article class="research-card detail-section"><h3>Research use & open questions</h3><div class="use-list compact">${deep.use.map(item => `<div><b>${escapeHtml(item)}</b></div>`).join('')}</div><div class="question-list compact">${deep.openQuestions.map(question => `<button type="button"><span>?</span><b>${escapeHtml(question)}</b></button>`).join('')}</div></article>
    </section>`;
  }

  function renderPaperDetail() {
    const paper = paperById(selectedPaperId) || papers[0];
    const paperEvidence = evidence.filter(item => item.paperId === paper.id);
    const tabs = closeReads[paper.id]
      ? [['overview', '논문 해설'], ['methods', '연구 설계'], ['results', '결과 해부'], ['visuals', '그림·표 지도'], ['appraisal', '비평·평가'], ['evidence', `원문 근거 · ${paperEvidence.length}`], ['notes', '아이디어·활용']]
      : [['overview', 'Overview'], ['source', 'Source audit'], ['evidence', `Evidence · ${paperEvidence.length}`], ['visuals', 'Tables & Figures'], ['neuro', 'Neuro pipeline'], ['notes', 'Notes & Ideas']];
    return `<div class="view-stack paper-detail-view">
      <section class="research-card detail-hero in-frame-detail">
        <button type="button" class="detail-back" data-paper-back>← Library / 이전 화면</button>
        <div class="detail-title-row"><div><span class="eyebrow">PAPER DETAIL · ${paper.year}</span><h1>${escapeHtml(paper.title)}</h1><div class="detail-meta">${escapeHtml(paper.authors)} · ${paper.journal} · DOI ${paper.doi}</div></div><span class="status-pill ${paper.status}">${escapeHtml(paper.statusLabel)}</span></div>
        <div class="detail-actions"><a href="${paper.url}" target="_blank" rel="noopener">원문·서지정보 ↗</a><button type="button">프로젝트 연결</button><button type="button">＋ Evidence</button><button type="button">비교에 추가</button></div>
      </section>
      <nav class="research-card detail-tabs">${tabs.map(([value, label]) => `<button type="button" class="${paperDetailTab === value ? 'active' : ''}" data-paper-tab="${value}">${label}</button>`).join('')}</nav>
      ${paperDetailBody(paper, paperDetailTab)}
    </div>`;
  }

  function renderEvidence() {
    const visible = evidence.filter(item => evidenceFilter === 'all' || item.state === evidenceFilter);
    if (!visible.some(item => item.id === selectedEvidenceId)) selectedEvidenceId = visible[0]?.id || evidence[0].id;
    const selected = evidence.find(item => item.id === selectedEvidenceId) || evidence[0];
    const paper = paperById(selected.paperId);
    const deep = deepForEvidence(selected, paper);
    return `<div class="view-stack">
      ${heading('EVIDENCE', 'AI 정리와 원문 근거를 분리해서 검토하세요', '검증 완료한 항목만 Synthesis와 Study Workspace에 기본 반영됩니다.')}
      <section class="evidence-layout">
        <aside class="research-card evidence-queue">
          <header><h3>Verification queue</h3><p>${evidence.filter(item => item.state === 'review').length}건이 원문 확인을 기다립니다.</p></header>
          <div class="evidence-filter">${[['all', '전체'], ['review', '검토 대기'], ['verified', '검증 완료'], ['rejected', '제외']].map(([value, label]) => `<button type="button" class="${evidenceFilter === value ? 'active' : ''}" data-evidence-filter="${value}">${label}</button>`).join('')}</div>
          <div class="queue-list">${visible.map(item => `<button type="button" class="queue-item ${item.id === selected.id ? 'active' : ''}" data-evidence="${item.id}"><span>${escapeHtml(item.type)} · ${escapeHtml(paperById(item.paperId).authors.split(',')[0])}</span><b>${escapeHtml(item.title)}</b><small>${escapeHtml(item.locator)} · ${stateLabel(item.state)}</small></button>`).join('') || '<div class="empty-state"><span><strong>해당 항목 없음</strong><p>다른 필터를 선택하세요.</p></span></div>'}</div>
        </aside>
        <article class="research-card evidence-review">
          <header class="evidence-review-header"><div><span class="eyebrow">${escapeHtml(paper.journal)} · ${paper.year} · ${escapeHtml(selected.type)}</span><h2>${escapeHtml(selected.title)}</h2><button type="button" class="paper-inline-link" data-paper="${paper.id}">${escapeHtml(paper.title)} →</button></div><span class="state-pill ${selected.state}">${stateLabel(selected.state)}</span></header>
          <div class="review-columns">
            <section class="source-card"><span>SOURCE EVIDENCE</span><blockquote>${escapeHtml(selected.quote)}</blockquote><div class="locator">${escapeHtml(selected.locator)} · <a href="${paper.url}" target="_blank" rel="noopener">원문 열기 ↗</a></div></section>
            <section class="interpretation-card"><span>NORMALIZED CLAIM · AI</span><p>${escapeHtml(selected.interpretation)}</p><div class="locator">원문 사실 → 정규화된 주장 → 연구 활용을 분리합니다.</div></section>
          </div>
          <div class="review-meta-grid"><div><span>EVIDENCE DIRECTION</span><b>${directionLabel(selected.direction)}</b></div><div><span>EXTRACTION CONFIDENCE</span><b>${selected.confidence}</b></div><div><span>EVIDENCE LEVEL</span><b>${escapeHtml(selected.strength)}</b></div><div><span>USE IN RESEARCH</span><b>${selected.state === 'verified' ? '분석에 포함' : selected.state === 'rejected' ? '분석에서 제외' : '검토 전 제외'}</b></div></div>
          <section class="reasoning-boundary">
            <div><span>01 · DIRECTLY SUPPORTED</span><b>${escapeHtml(deep.direct)}</b></div>
            <div><span>02 · REASONABLE INFERENCE</span><b>${escapeHtml(deep.inference)}</b></div>
            <div class="boundary"><span>03 · NOT SUPPORTED</span><b>${escapeHtml(deep.boundary)}</b></div>
          </section>
          <section class="evidence-detail-grid">
            <div class="compact-panel"><span>STUDY CONTEXT</span><dl><div><dt>설계</dt><dd>${escapeHtml(paper.type)}</dd></div><div><dt>대상</dt><dd>${escapeHtml(paper.population)}</dd></div><div><dt>표본</dt><dd>${escapeHtml(paper.sample)}</dd></div><div><dt>방법</dt><dd>${escapeHtml(paper.method)}</dd></div></dl></div>
            <div class="compact-panel"><span>MODIFIERS & CONFOUNDS</span><div class="modifier-list">${deep.modifiers.map(item => `<b>${escapeHtml(item)}</b>`).join('')}</div><p>효과 방향이나 일반화 범위를 바꿀 수 있으므로 원문 표·모형에서 조정 여부를 확인합니다.</p></div>
            <div class="compact-panel verification-panel"><span>VERIFICATION CHECKLIST</span><div>${deep.checklist.map((item, index) => `<label><input type="checkbox" ${selected.state === 'verified' || index < 2 ? 'checked' : ''}><b>${escapeHtml(item)}</b></label>`).join('')}</div></div>
            <div class="compact-panel"><span>USE IN WRITING</span><div class="writing-use"><b>서론</b><p>현재 지식과 연구 필요성을 한정해 제시</p><b>방법</b><p>측정·검증·표본 계획의 근거로 사용</p><b>논의</b><p>효과의 범위와 대안 설명을 함께 기술</p></div></div>
          </section>
          <div class="review-warning"><b>검토 포인트</b><br>${escapeHtml(selected.warning)} <span>현재 문서 coverage ${paper.coverage}%</span></div>
          <div class="review-actions"><button type="button" class="exclude" data-evidence-action="rejected">제외</button><button type="button" data-evidence-action="review">수정 필요</button><button type="button" class="verify" data-evidence-action="verified">✓ 원문과 일치</button></div>
        </article>
      </section>
    </div>`;
  }

  function renderSynthesis() {
    const verified = evidence.filter(item => item.state === 'verified');
    const evidencePaperCount = new Set(verified.map(item => item.paperId)).size;
    return `<div class="view-stack">
      ${heading('SYNTHESIS', '논문 수가 아니라 연구 패턴과 공백을 보세요', 'Compare·Connections·Research Notes를 한 화면의 문헌 통합 분석으로 합쳤습니다.', '<button class="outline-button">분석 노트로 저장</button>')}
      <section class="research-card">
        <div class="synthesis-controls"><label>POPULATION<select><option>전체 대상군</option><option>중·노년층</option><option>정신질환</option></select></label><label>TOPIC<select><option>뇌 노화 + 인지예비능</option><option>BrainAGE</option><option>정신질환</option></select></label><label>METHOD<select><option>전체 방법</option><option>Structural MRI</option><option>Normative modelling</option></select></label><label>EVIDENCE<select><option>검증 완료만</option><option>미검토 포함</option></select></label></div>
        <div class="evidence-scope"><i></i><b>${evidencePaperCount}편의 검증된 근거 ${verified.length}건</b>으로 분석 중 · 초록 기반 미검토 내용은 제외됨</div>
      </section>
      <section class="synthesis-grid">
        <article class="research-card chart-card"><h3>연구 초점 분포</h3><p>현재 Library에서 반복되는 개념과 방법</p><div class="facet-bars">${[['뇌 노화·BrainAGE', 84, 4], ['인지예비능', 68, 3], ['정신질환', 58, 2], ['재현성·외부검증', 48, 2], ['종단 인지 변화', 35, 1]].map(([label, value, count]) => `<div class="facet-row"><span>${label}</span><i><b style="--value:${value}%"></b></i><strong>${count}</strong></div>`).join('')}</div></article>
        <aside class="synthesis-notes">
          <article class="research-card synthesis-note"><span>CONVERGENCE</span><h4>대규모 표본과 표준화가 반복적으로 중요합니다.</h4><p>규준 모델, BWAS, ENIGMA 연구 모두 표본 규모와 다기관 조화화가 결과 해석의 핵심입니다.</p></article>
          <article class="research-card synthesis-note warning"><span>CONTRADICTION</span><h4>질환군 차이와 임상적 유용성은 같은 주장이 아닙니다.</h4><p>BrainAGE 집단 차이는 보고되지만 임상 특성·예후와의 연결은 혼재되어 있습니다.</p></article>
          <article class="research-card synthesis-note opportunity"><span>RESEARCH GAP · AI CANDIDATE</span><h4>인지예비능이 BrainAGE–인지 변화 관계를 조절하는가?</h4><p>종단·다기관·외부검증 설계로 검사할 가치가 있으나 아직 확립된 결론은 아닙니다.</p></article>
        </aside>
      </section>
      <section class="synthesis-grid">
        <article class="research-card chart-card"><h3>대상 × 방법 Evidence map</h3><p>짙을수록 현재 문헌에서 많이 다뤄진 조합</p><div class="matrix"><span class="head"></span><span class="head">sMRI</span><span class="head">fMRI</span><span class="head">종단 인지</span><span class="head">외부검증</span><span class="row-head">건강 전 생애</span><span class="level-4">4</span><span class="level-2">2</span><span class="level-2">2</span><span class="level-3">3</span><span class="row-head">중·노년층</span><span class="level-3">3</span><span class="level-1">1</span><span class="level-3">3</span><span class="level-1">1</span><span class="row-head">정신질환</span><span class="level-3">3</span><span class="level-1">1</span><span>0</span><span class="level-1">1</span><span class="row-head">인지예비능</span><span class="level-2">2</span><span class="level-1">1</span><span class="level-2">2</span><span>0</span></div></article>
        <article class="research-card chart-card"><h3>연구 흐름</h3><p>현재 예시 Library의 출판 연도 분포</p><div class="timeline">${[['2018', 38, 1], ['2020', 38, 1], ['2022', 120, 4], ['2024', 68, 2]].map(([year, height, count]) => `<div><i style="--height:${height}px"></i><b>${year}</b><small>${count}편</small></div>`).join('')}</div></article>
      </section>
      <section class="research-card panel synthesis-deep">
        <div class="section-heading"><div><span>EVIDENCE ARGUMENT TABLE</span><h2>현재 문헌으로 말할 수 있는 범위</h2><p>일치하는 결과뿐 아니라 반대 근거, 방법 차이와 남은 불확실성을 함께 표시합니다.</p></div><button type="button" class="text-button">근거 행렬 내보내기 →</button></div>
        <div class="synthesis-table-wrap"><table class="synthesis-table"><thead><tr><th>연구 주장</th><th>지지 근거</th><th>제한·반대 근거</th><th>현재 판단</th><th>신뢰</th></tr></thead><tbody>
          <tr><td><b>BrainAGE는 질환군 차이에 민감하다</b><small>집단 수준</small></td><td>체계적 고찰의 다수 포함연구</td><td>질환·모형·피처 이질성</td><td>질환 간 공통 방향은 후보이나 단일 효과로 통합하기 어려움</td><td><span class="confidence medium">중간</span></td></tr>
          <tr><td><b>BrainAGE는 임상 예후를 예측한다</b><small>개인 수준</small></td><td>일부 증상·인지 연관</td><td>임상 연관 혼재, 종단·외부검증 부족</td><td>현재 문헌만으로 임상 예측성을 확정할 수 없음</td><td><span class="confidence low">낮음</span></td></tr>
          <tr><td><b>CR은 인지 저하를 완충한다</b><small>관찰 연관</small></td><td>종단 인지 변화와 CR 지표의 연관</td><td>CR 조작화·선택 편향·인과 방향</td><td>조절변수 후보로는 타당하나 개입효과로 해석 불가</td><td><span class="confidence medium">중간</span></td></tr>
          <tr><td><b>연결체 예측모형은 데이터셋 간 일반화될 수 있다</b><small>방법론</small></td><td>Yoo Lab 주의 지표의 4개 외부 데이터셋</td><td>임상집단·scanner·과제 차이</td><td>외부검증 설계의 사례이며 임상 적용은 추가 검증 필요</td><td><span class="confidence high">높음</span></td></tr>
        </tbody></table></div>
      </section>
      <section class="research-card panel gap-evaluation"><div class="section-heading"><div><span>GAP QUALIFICATION</span><h2>연구 아이디어 후보의 질</h2><p>새로워 보이는 문장이 아니라 실제로 검증 가능한 공백인지 평가합니다.</p></div><div class="feasibility-score"><strong>78</strong><span>/100</span></div></div><div class="gap-score-grid"><div><span>NOVELTY</span><b>중상</b><p>두 문헌 흐름의 직접 결합이 제한적</p></div><div><span>EVIDENCE BASE</span><b>중간</b><p>각 축의 근거는 있으나 교차 근거 부족</p></div><div><span>TESTABILITY</span><b>높음</b><p>PECO와 종단 모형으로 검증 가능</p></div><div><span>RISK</span><b>중상</b><p>작은 상호작용 효과와 CR 측정</p></div></div></section>
    </div>`;
  }

  function studyPanelHtml() {
    if (studyStep === 0) return `<article class="research-card panel study-stage"><div class="section-heading"><div><span>STEP 01 · GAP AUDIT</span><h2>주장 가능한 공백인지 확인</h2><p>‘연구가 없다’가 아니라 무엇이 검증되지 않았는지를 근거 단위로 적습니다.</p></div><span class="stage-score">근거 5건</span></div><div class="gap-grid"><div><span>KNOWN</span><h3>질환군의 BrainAGE 차이는 반복 보고됨</h3><p>그러나 질환·modality·모형에 따른 결과 이질성이 큽니다.</p></div><div><span>UNCERTAIN</span><h3>임상 특성 및 종단 인지와의 연결</h3><p>연관 방향이 혼재되고 외부검증·종단자료가 부족합니다.</p></div><div class="opportunity"><span>TESTABLE GAP</span><h3>CR의 완충 역할과 일반화 가능성</h3><p>사전 정의된 CR과 독립 코호트를 사용해 조절효과를 검증합니다.</p></div></div><div class="gap-criteria"><b>공백 판정 기준</b><span>검증 Evidence ≥3</span><span>반대/혼재 근거 포함</span><span>대상·측정·시간축 명시</span><span>실험 가능한 질문</span></div></article>`;
    if (studyStep === 1) return `<article class="research-card panel study-stage"><div class="section-heading"><div><span>STEP 02 · QUESTION BUILDER</span><h2>PECO로 질문을 고정</h2><p>대상, 노출, 비교, 결과와 시간축이 모두 있어야 분석 계획으로 넘어갑니다.</p></div><span class="stage-score ok">구조 완성</span></div><div class="peco-grid"><div><span>P · POPULATION</span><b>중·노년 정신질환 성인</b><p>진단기준·연령범위·약물·동반질환 명시</p></div><div><span>E · EXPOSURE</span><b>교정된 sMRI BrainAGE</b><p>모형·훈련표본·age-bias correction 기록</p></div><div><span>C · COMPARATOR</span><b>낮은 CR / 진단·연령 비교군</b><p>비교 정의를 분석 전에 고정</p></div><div><span>O · OUTCOME</span><b>종단 전반·영역별 인지 변화</b><p>반복 측정 도구와 최소 추적기간 명시</p></div></div><div class="question-hierarchy"><div><span>PRIMARY</span><b>CR × BrainAGE 상호작용이 전반적 인지 변화율과 연관되는가?</b></div><div><span>SECONDARY</span><b>진단군·성별·연령대에 따라 상호작용이 달라지는가?</b></div><div><span>EXPLORATORY</span><b>해마용적·network feature가 관계를 추가로 설명하는가?</b></div></div></article>`;
    if (studyStep === 2) return `<article class="research-card panel study-stage"><div class="section-heading"><div><span>STEP 03 · CONCEPTUAL MODEL</span><h2>가설과 대안 설명</h2><p>효과 방향, 조절·매개·교란을 섞지 않고 모형 안에 배치합니다.</p></div><span class="stage-score">DAG 초안</span></div><div class="concept-model"><div class="node exposure"><span>EXPOSURE</span><b>BrainAGE</b></div><i>→</i><div class="node outcome"><span>OUTCOME</span><b>인지 변화율</b></div><div class="node moderator"><span>MODERATOR</span><b>인지예비능</b><small>BrainAGE → 인지 경로 완충</small></div><div class="node confound"><span>CONFOUNDERS</span><b>연령·성별·교육·SES·약물·사이트</b></div></div><div class="hypothesis-grid"><div><span>H1 · MAIN</span><b>높은 BrainAGE는 더 빠른 인지 저하와 연관된다.</b><p>인과가 아닌 종단 연관 가설</p></div><div><span>H2 · INTERACTION</span><b>높은 CR에서 BrainAGE–인지 저하 기울기가 완만하다.</b><p>상호작용 계수와 예측 궤적 모두 보고</p></div><div><span>ALTERNATIVE</span><b>CR은 기저 인지만 설명하고 변화율은 완충하지 않는다.</b><p>main effect와 interaction을 분리</p></div></div></article>`;
    if (studyStep === 3) return `<article class="research-card panel study-stage"><div class="feasibility-header"><div class="section-heading"><div><span>STEP 04 · FEASIBILITY CHECK</span><h2>연구 가능성</h2><p>Library ${papers.length}편과 검증 Evidence를 기준으로 한 예비 평가</p></div></div><div class="feasibility-score"><strong>72</strong><span>/100</span></div></div><div class="score-grid">${[['근거 기반', 82], ['데이터 접근', 74], ['측정 명확성', 61], ['분석 가능성', 76], ['외부 타당도', 55]].map(([label, value]) => `<div><span>${label}</span><b>${value}</b><i style="--value:${value}%"></i></div>`).join('')}</div><div class="risk-list"><div><b>핵심 보완</b><p>인지예비능을 단일 교육연수가 아니라 사전 정의된 복합지표로 구성하고 민감도 분석을 계획해야 합니다.</p></div><div><b>표본 위험</b><p>BrainAGE–행동 연관은 작을 수 있으므로 소표본 단일기관 설계보다 대규모 코호트 또는 외부검증이 필요합니다.</p></div><div><b>데이터 확인</b><p>진단군별 반복 인지자료, raw/processed MRI 접근, scanner·사이트 변수와 약물정보의 가용성을 먼저 확인합니다.</p></div><div><b>해석 위험</b><p>BrainAGE를 생물학적 노화 자체로 단정하지 말고 모델 편향과 임상 타당도를 별도로 평가해야 합니다.</p></div></div><div class="decision-bar"><b>조건부 진행</b><span>표본 수 시뮬레이션 · CR 산식 고정 · 독립검증 코호트 확보 후 진행</span></div></article>`;
    if (studyStep === 4) return `<article class="research-card panel study-stage"><div class="section-heading"><div><span>STEP 05 · DESIGN</span><h2>실행 가능한 종단 코호트 설계</h2><p>연구 질문과 데이터 구조가 맞지 않으면 분석을 시작하지 않습니다.</p></div><span class="stage-score ok">초안 가능</span></div><div class="design-spec-grid"><div><span>INCLUSION</span><b>45–80세, DSM/ICD 진단, 기저 MRI와 ≥2회 인지평가</b></div><div><span>EXCLUSION</span><b>주요 신경질환, 급성 의학상태, MRI QC 실패</b></div><div><span>EXPOSURE</span><b>동일 파이프라인 BrainAGE, bias correction 사전 정의</b></div><div><span>MODERATOR</span><b>교육·직업복잡도·인지활동의 표준화 CR composite</b></div><div><span>OUTCOME</span><b>전반인지와 기억·집행기능의 개인별 변화율</b></div><div><span>VALIDATION</span><b>사이트 분리 internal test + 독립 코호트 external test</b></div></div><div class="design-flow"><div><span>T0 · SCREEN</span><b>대상·QC</b><small>진단·약물·scanner</small></div><div><span>T0 · BASELINE</span><b>MRI + CR + 인지</b><small>공통 측정 창</small></div><div><span>T1</span><b>12개월 인지</b><small>변화율 확보</small></div><div><span>T2</span><b>24개월 인지/MRI</b><small>반복 MRI 가능 시</small></div><div><span>LOCK</span><b>분석 동결</b><small>QC 전 결과 미열람</small></div><div><span>VALIDATE</span><b>외부 코호트</b><small>재학습 없이 평가</small></div></div></article>`;
    if (studyStep === 5) return `<article class="research-card panel study-stage"><div class="section-heading"><div><span>STEP 06 · ANALYSIS PLAN</span><h2>결과를 보기 전에 분석을 고정</h2><p>주 분석, 민감도 분석과 외부검증을 분리해 선택적 보고를 줄입니다.</p></div><span class="stage-score">선등록 필요</span></div><div class="analysis-plan"><div><span>01 · QC</span><b>영상 QC·이상치·누락 원인 기록</b><p>진단군별 제외율 비교</p></div><div><span>02 · PRIMARY MODEL</span><b>혼합효과모형: time × BrainAGE × CR</b><p>개인 random intercept/slope, 사이트 처리 명시</p></div><div><span>03 · COVARIATES</span><b>연령·성별·ICV·교육·약물·사이트</b><p>인과구조 없이 자동 선택 금지</p></div><div><span>04 · MULTIPLICITY</span><b>전반인지 1개 primary, 영역별 FDR</b><p>탐색 결과는 별도 표시</p></div><div><span>05 · SENSITIVITY</span><b>CR 산식·진단군·scanner·탈락 가중치</b><p>결과 방향과 추정치 변화 비교</p></div><div><span>06 · VALIDATION</span><b>독립 코호트에서 calibration·CI·subgroup</b><p>재학습 여부를 명시</p></div></div><div class="analysis-guardrails"><b>보고해야 할 값</b><span>분석별 N</span><span>β와 95% CI</span><span>예측 궤적</span><span>결측·제외 수</span><span>모형 진단</span><span>코드·seed</span></div></article>`;
    return `<article class="research-card panel study-stage"><div class="section-heading"><div><span>STEP 07 · RESEARCH OUTPUT</span><h2>검토 가능한 연구 패키지</h2><p>저장하면 연구 개요와 흐름, 근거 링크, 미완료 항목을 한 묶음으로 보여줍니다.</p></div><span class="stage-score ok">6 / 9 준비</span></div><div class="output-grid"><div class="done"><span>✓</span><b>연구 질문·PECO</b><small>변수와 시간축 고정</small></div><div class="done"><span>✓</span><b>근거 행렬</b><small>지지·혼재·한계 포함</small></div><div class="done"><span>✓</span><b>개념 모형</b><small>조절·교란 구분</small></div><div class="done"><span>✓</span><b>코호트 흐름</b><small>포함·제외·추적</small></div><div class="done"><span>✓</span><b>분석 명세</b><small>primary·sensitivity</small></div><div class="done"><span>✓</span><b>표·그림 계획</b><small>효과와 불확실성</small></div><div><span>!</span><b>표본 수 시뮬레이션</b><small>interaction effect 범위 필요</small></div><div><span>!</span><b>윤리·데이터 권한</b><small>IRB와 이용조건 확인</small></div><div><span>!</span><b>선등록</b><small>OSF/프로토콜 확정</small></div></div><div class="export-bar"><button type="button" class="outline-button">연구 요약 보기</button><button type="button" class="outline-button">순서도 내보내기</button><button type="button" class="primary-button">초안 저장</button></div></article>`;
  }

  function renderStudy() {
    const steps = ['연구 공백', '연구 질문', '가설·개념 모형', '실현 가능성', '연구 설계', '분석 계획', '연구 출력'];
    return `<div class="view-stack">
      ${heading('STUDY WORKSPACE', '아이디어를 실행 가능한 연구로 바꾸세요', 'Library의 검증 근거를 사용해 초보 연구자도 설계 누락을 확인할 수 있습니다.', '<button class="primary-button">연구 설계 저장</button>')}
      <article class="research-card study-hero"><span>ACTIVE STUDY · AI 제안, 사용자 검토 필요</span><h2>인지예비능은 정신질환 성인의 BrainAGE와 종단 인지 변화의 관계를 완충하는가?</h2><p>BrainAGE의 임상적 연관은 혼재되어 있고 인지예비능은 인지 저하와 관련되지만 조작화가 다양합니다. 두 문헌 흐름을 연결하되 인과적 표현은 사용하지 않습니다.</p></article>
      <section class="study-layout">
        <nav class="research-card study-steps">${steps.map((label, index) => `<button type="button" class="${index < studyStep ? 'done' : ''} ${index === studyStep ? 'active' : ''}" data-study-step="${index}"><span>${index < studyStep ? '✓' : index + 1}</span><b>${label}</b></button>`).join('')}</nav>
        <div class="study-work">${studyPanelHtml()}</div>
      </section>
    </div>`;
  }

  function renderAtlas() {
    const region = atlas[atlasRegion];
    return `<div class="view-stack">
      ${heading('BRAIN ATLAS', '움직임보다 정확한 선택과 연구 연결에 집중합니다', '미리보기에서는 잘림과 왜곡이 없는 고정 2D 지도를 사용합니다. 최종 구현에서 검증된 atlas 데이터를 연결합니다.')}
      <section class="atlas-layout">
        <article class="research-card brain-map"><svg viewBox="0 0 720 510" role="img" aria-label="선택 가능한 뇌 영역 참고 지도"><path fill="#eef1f1" stroke="#a7b5bc" stroke-width="4" d="M92 254C73 160 132 81 243 58c87-18 150 2 195 42 80-10 157 39 181 111 29 88-27 168-117 191-72 58-194 69-288 24-78-37-127-102-122-172Z"/><path class="brain-region ${atlasRegion === 'frontal' ? 'active' : ''}" data-region="frontal" fill="${atlas.frontal.color}" d="M99 250C84 169 136 105 226 80l42 139-39 155c-77-22-122-65-130-124Z"/><path class="brain-region ${atlasRegion === 'parietal' ? 'active' : ''}" data-region="parietal" fill="${atlas.parietal.color}" d="M226 80c75-24 157-2 209 35l-22 139-145-35-42-139Z"/><path class="brain-region ${atlasRegion === 'temporal' ? 'active' : ''}" data-region="temporal" fill="${atlas.temporal.color}" d="M229 374l39-155 145 35 24 111c-59 55-143 62-208 9Z"/><path class="brain-region ${atlasRegion === 'occipital' ? 'active' : ''}" data-region="occipital" fill="${atlas.occipital.color}" d="M435 115c83 0 151 53 177 115 20 51-7 108-79 147l-96-12-24-111 22-139Z"/><path class="brain-region ${atlasRegion === 'hippocampus' ? 'active' : ''}" data-region="hippocampus" fill="${atlas.hippocampus.color}" d="M291 292c35-33 89-31 124-3-10 39-44 62-84 56-29-5-45-24-40-53Z"/><text class="brain-label" x="142" y="218">전두엽</text><text class="brain-label" x="310" y="155">두정엽</text><text class="brain-label" x="291" y="390">측두엽</text><text class="brain-label" x="505" y="244">후두엽</text><text class="brain-label" x="324" y="316">해마</text><text x="360" y="478" text-anchor="middle" font-family="DM Sans" font-size="12" fill="#61747f">SCHEMATIC PREVIEW · NOT FOR ANATOMICAL MEASUREMENT</text></svg></article>
        <aside class="research-card atlas-detail" style="--region-color:${region.color}"><span>SELECTED REGION</span><h2>${region.ko}</h2><small>${region.en}</small><p>${region.summary}</p><div class="atlas-facts"><div><span>COGNITIVE FUNCTIONS</span><b>${region.functions}</b></div><div><span>RELATED DISORDERS</span><b>${region.disorders}</b></div><div><span>COMMON METHODS</span><b>${region.method}</b></div><div><span>CONNECTED PAPERS</span><b>${region.paperIds.length}편</b></div></div><details class="atlas-deep" open><summary>하위영역과 기능</summary><ul>${region.subregions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details><details class="atlas-deep"><summary>질환·인지 기전 해석</summary><p>${escapeHtml(region.mechanism)}</p></details><div class="atlas-caution"><b>해석 주의</b><p>${escapeHtml(region.caution)}</p></div><div class="related-papers">${region.paperIds.map(id => { const paper = paperById(id); return `<button type="button" data-paper="${paper.id}"><span><b>${escapeHtml(paper.title)}</b><small>${paper.journal} · ${paper.year}</small></span><i>→</i></button>`; }).join('')}</div></aside>
      </section>
      <section class="research-card panel"><div class="section-heading"><div><span>ATLAS READING RULE</span><h2>영역 → network → 측정 → 근거 순으로 읽기</h2><p>영역 이름만으로 질환이나 인지 기능을 단정하지 않고, 선택한 논문의 실제 modality와 분석 단위를 함께 확인합니다.</p></div></div><div class="atlas-reading-flow"><div><span>01</span><b>해부학 수준</b><p>엽·gyrus·subfield와 좌표계</p></div><div><span>02</span><b>회로 수준</b><p>network·연결·상태 의존성</p></div><div><span>03</span><b>측정 수준</b><p>두께·용적·BOLD·연결성</p></div><div><span>04</span><b>근거 수준</b><p>집단차·예측·종단·중재</p></div><div><span>05</span><b>해석 경계</b><p>상관·원인·개인진단 구분</p></div></div></section>
    </div>`;
  }

  function renderAtlasDetailed() {
    const region = atlas[atlasRegion];
    const active = key => atlasRegion === key ? 'active' : '';
    return `<div class="view-stack">
      ${heading('BRAIN ATLAS', '구조의 이름뿐 아니라 뇌 안의 위치까지 함께 봅니다', '정중 시상면의 방향 기준, 번호가 연결된 확대판, 선택 영역의 미니 위치 지도를 함께 제공합니다. 연구 탐색용이며 해부학적 계측에는 사용하지 않습니다.')}
      <section class="atlas-layout ${atlasMapExpanded ? 'map-expanded' : ''}">
        <article class="research-card brain-map">
          <div class="brain-map-toolbar"><div><span>PLATE 01 · MEDIAL VIEW</span><b>정중 시상면 · 얼굴은 왼쪽, 뒤통수는 오른쪽</b></div><button type="button" data-atlas-expand>${atlasMapExpanded ? '설명과 함께 보기' : '지도 크게 보기'} ${atlasMapExpanded ? '↙' : '↗'}</button></div>
          <svg viewBox="0 0 900 580" role="img" aria-labelledby="brainTitle brainDesc">
            <title id="brainTitle">다층 시상면 뇌 해부·연구 지도</title><desc id="brainDesc">피질 하위영역, 대상피질, 뇌량, 뇌실, 시상, 선조체, 해마, 편도체, 시상하부, 소뇌와 뇌간을 선택할 수 있고 아래 확대 삽입도에서 심부핵과 섬엽을 확인합니다.</desc>
            <defs>
              <linearGradient id="cortexWarm" x1="0" x2="1"><stop stop-color="#f1a7a6"/><stop offset="1" stop-color="#f6c4c0"/></linearGradient>
              <linearGradient id="stemGray" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#c9d1d5"/><stop offset="1" stop-color="#87969e"/></linearGradient>
              <radialGradient id="deepOrange"><stop stop-color="#f3a467"/><stop offset="1" stop-color="#cf5d38"/></radialGradient>
              <clipPath id="cortexClip"><path d="M95 294C62 223 79 142 141 94C207 43 319 29 423 49C500 31 594 48 654 101C719 159 737 254 700 326C673 379 614 407 550 414C490 453 382 466 286 440C200 452 116 402 95 332C89 317 89 306 95 294Z"/></clipPath>
            </defs>
            <path fill="#fff8f6" stroke="#b76e70" stroke-width="4" d="M95 294C62 223 79 142 141 94C207 43 319 29 423 49C500 31 594 48 654 101C719 159 737 254 700 326C673 379 614 407 550 414C490 453 382 466 286 440C200 452 116 402 95 332C89 317 89 306 95 294Z"/>
            <g clip-path="url(#cortexClip)">
              <path class="brain-region ${active('frontal')}" data-region="frontal" fill="url(#cortexWarm)" d="M64 54H332L354 228L289 438H65Z"/>
              <path class="brain-region ${active('parietal')}" data-region="parietal" fill="#efb59e" d="M319 41H600L594 270L354 228Z"/>
              <path class="brain-region ${active('occipital')}" data-region="occipital" fill="#dfa6bf" d="M594 51H760V421H551L594 270Z"/>
              <path class="brain-region ${active('temporal')}" data-region="temporal" fill="#f2c0aa" d="M282 438L354 228L594 270L551 421L478 472Z"/>
              <path class="brain-structure ${active('limbic')}" data-region="limbic" fill="#ef9296" d="M215 243C239 144 359 90 483 129C536 146 570 186 574 225C514 183 444 169 374 181C306 192 255 223 229 278Z"/>
            </g>
            <g class="cortical-folds">
              <path class="brain-sulcus" d="M126 144c34-29 66-19 88-44M111 190c38-22 72-13 104-39M104 244c39-26 87-21 115 7M119 306c31-19 69-20 95 10M147 362c33-24 73-24 98 4"/>
              <path class="brain-sulcus" d="M211 80c-13 35 8 58 42 61M270 63c-20 36-5 66 34 77M334 61c-15 37 2 73 39 87M403 64c-18 30-2 60 27 73M472 66c-14 26 2 52 31 66"/>
              <path class="brain-sulcus" d="M532 78c-17 32-1 59 34 71M588 99c-12 27 6 52 36 67M641 136c-29 22-24 58 4 76M676 195c-35 16-40 49-13 72M682 271c-33-7-59 14-60 48"/>
              <path class="brain-sulcus" d="M614 357c-29-22-66-14-85 13M550 404c-30-31-69-25-93 2M460 420c-22-28-63-29-89-3M360 420c-25-30-62-34-88-5"/>
              <path class="brain-sulcus" d="M179 125c12 19 11 37-7 54M244 156c20 17 17 42-3 60M302 112c23 18 25 45 5 66M379 108c19 17 18 42-2 59M461 104c24 14 29 39 13 59"/>
              <path class="brain-sulcus" d="M559 142c25 15 29 42 9 62M611 198c25 19 23 49-2 65M562 267c29 15 34 44 13 67M493 280c24 20 22 48-4 66M414 278c21 21 18 50-7 67"/>
              <path class="brain-sulcus" d="M319 277c25 17 26 45 6 67M251 290c22 17 24 41 5 59M194 235c-20 18-18 46 4 61"/>
            </g>
            <g class="cortical-parcellation">
              <path class="brain-microregion ${active('frontal')}" data-region="frontal" d="M108 118C148 76 207 58 260 57L274 140C221 143 178 164 145 202Z"/><text class="brain-micro-label" x="156" y="119">mPFC</text>
              <path class="brain-microregion ${active('frontal')}" data-region="frontal" d="M103 270C134 244 175 236 220 244L206 325C161 333 127 324 98 301Z"/><text class="brain-micro-label" x="132" y="288">OFC</text>
              <path class="brain-microregion ${active('frontal')}" data-region="frontal" d="M274 51C313 43 351 44 387 50L385 151C347 142 311 140 274 140Z"/><text class="brain-micro-label" x="316" y="89">SMA</text>
              <path class="brain-microregion ${active('frontal')}" data-region="frontal" d="M386 50C418 45 450 46 479 51L470 159C443 152 414 150 385 151Z"/><text class="brain-micro-label" x="412" y="89">M1</text>
              <path class="brain-microregion ${active('parietal')}" data-region="parietal" d="M479 51C513 49 547 56 574 68L556 174C529 164 501 159 470 159Z"/><text class="brain-micro-label" x="505" y="98">S1</text>
              <path class="brain-microregion ${active('parietal')}" data-region="parietal" d="M470 159C506 162 538 174 565 195L530 268C500 247 469 237 433 235Z"/><text class="brain-micro-label" x="477" y="203">PRECUNEUS</text>
              <path class="brain-microregion ${active('limbic')}" data-region="limbic" d="M391 175C427 169 467 174 497 190L463 246C438 235 411 231 382 235Z"/><text class="brain-micro-label" x="414" y="207">PCC/RSC</text>
              <path class="brain-microregion ${active('occipital')}" data-region="occipital" d="M565 195C603 174 646 178 684 201L664 286C626 278 587 281 548 300Z"/><text class="brain-micro-label" x="607" y="235">CUNEUS</text>
              <path class="brain-microregion ${active('occipital')}" data-region="occipital" d="M548 300C587 281 626 278 664 286L629 355C590 354 557 345 529 329Z"/><text class="brain-micro-label" x="579" y="319">V1</text>
              <path class="brain-microregion ${active('temporal')}" data-region="temporal" d="M257 361C305 337 355 341 398 366L376 431C331 438 292 429 253 405Z"/><text class="brain-micro-label" x="295" y="392">PHG/EC</text>
            </g>
            <path class="brain-structure ${active('corpus')}" data-region="corpus" fill="#fff4d9" stroke="#d3a866" stroke-width="3" d="M238 247C279 169 392 133 501 174C542 189 568 219 575 251C535 217 484 202 426 205C349 207 293 241 258 297C244 287 235 268 238 247Z"/>
            <path class="brain-structure ${active('ventricle')}" data-region="ventricle" fill="#d8eef7" stroke="#6fa7bd" stroke-width="2" d="M266 280C305 222 371 198 443 205C499 210 536 232 557 260C511 240 465 239 418 250C356 265 318 295 291 338C279 323 269 302 266 280Z"/>
            <path class="brain-structure ${active('hippocampus')}" data-region="hippocampus" fill="none" stroke="#d8b86f" stroke-width="8" stroke-linecap="round" d="M291 308C321 287 351 282 382 286C403 289 418 299 428 315"/><text class="brain-micro-label dark" x="307" y="305">FORNIX</text>
            <ellipse class="brain-structure ${active('thalamus')}" data-region="thalamus" cx="395" cy="272" rx="71" ry="45" fill="url(#deepOrange)"/>
            <path class="brain-structure ${active('striatum')}" data-region="striatum" fill="#d8512e" d="M310 230C339 204 382 198 416 213C381 219 351 235 329 260C316 255 307 244 310 230Z"/>
            <path class="brain-structure ${active('hippocampus')}" data-region="hippocampus" fill="#9d6bb8" stroke="#70478b" stroke-width="2" d="M380 342C420 312 478 316 507 347C484 375 439 388 401 371C383 363 375 352 380 342Z"/>
            <circle data-region="hippocampus" class="brain-structure ${active('hippocampus')}" cx="374" cy="355" r="15" fill="#774991"/>
            <text class="brain-micro-label dark" x="337" y="389">AMYGDALA</text>
            <path class="brain-structure ${active('hypothalamus')}" data-region="hypothalamus" fill="#cf5b63" d="M360 309C383 300 410 303 427 317C417 339 390 347 367 334C357 328 354 318 360 309Z"/>
            <path class="brain-structure ${active('hypothalamus')}" data-region="hypothalamus" fill="none" stroke="#9d3f48" stroke-width="7" stroke-linecap="round" d="M391 333L381 366"/>
            <ellipse class="brain-structure ${active('hypothalamus')}" data-region="hypothalamus" cx="379" cy="383" rx="22" ry="15" fill="#bd3b50"/>
            <circle data-region="hypothalamus" class="brain-structure ${active('hypothalamus')}" cx="455" cy="317" r="8" fill="#5e4b8d"/>
            <path data-region="hypothalamus" class="brain-structure ${active('hypothalamus')}" fill="#f3f1e6" stroke="#8b725a" stroke-width="2" d="M333 350c19-7 35-1 44 13-19 2-34-2-44-13Z"/>
            <path class="brain-structure ${active('brainstem')}" data-region="brainstem" fill="url(#stemGray)" stroke="#71818a" stroke-width="2" d="M414 318C449 328 480 355 489 389C493 407 484 426 474 444C459 469 459 505 468 552H386C397 501 394 465 382 438C367 405 365 364 382 337C390 324 400 317 414 318Z"/>
            <ellipse class="brain-structure ${active('striatum')}" data-region="striatum" cx="431" cy="325" rx="11" ry="6" fill="#487f79"/><text class="brain-micro-label dark" x="421" y="316">STN</text>
            <path class="brain-structure ${active('brainstem')}" data-region="brainstem" d="M423 347c18-7 34-5 48 5-13 10-30 13-48 7Z" fill="#3f3f48"/><text class="brain-micro-label light" x="433" y="357">SN</text>
            <path class="brain-structure ${active('amygdala')}" data-region="amygdala" fill="#c84f64" stroke="#8f3446" stroke-width="2" d="M356 353c9-15 27-20 41-11 11 7 12 22 3 33-12 14-35 12-44-3-4-6-4-13 0-19Z"/><text class="brain-micro-label light" x="357" y="365">AMG</text>
            <path class="brainstem-divider" d="M384 378C417 391 456 391 488 380M388 438C418 447 450 447 476 439"/><text class="brain-micro-label dark" x="401" y="371">MIDBRAIN</text><text class="brain-micro-label dark" x="411" y="414">PONS</text><text class="brain-micro-label dark" x="404" y="478">MEDULLA</text>
            <path class="brain-structure ${active('cerebellum')}" data-region="cerebellum" fill="#bf7a58" stroke="#885039" stroke-width="3" d="M486 374C521 340 587 335 631 367C669 394 669 447 634 482C603 513 542 518 505 489C469 461 460 408 486 374Z"/>
            <g fill="none" stroke="#f4d7c6" stroke-width="5" stroke-linecap="round"><path d="M491 397c42-30 96-31 134-4M484 420c49-26 112-22 153 10M490 448c42-17 96-10 129 19M515 380c-2 34 13 77 42 112M547 365c-7 39 10 91 43 130M579 363c-7 39 8 83 36 112"/><path stroke-width="3" d="M515 471l33-29 29 20 28-29M524 443l25-24 24 17 26-26M529 416l20-18 20 14 24-20"/></g>
            <g class="map-labels">
              <text class="brain-label" x="132" y="207">전두엽</text><text class="brain-label" x="384" y="93">두정엽</text><text class="brain-label" x="620" y="220">후두엽</text><text class="brain-label" x="264" y="401">측두엽</text><text class="brain-label" x="344" y="178">변연·대상</text>
              <circle class="brain-dot" cx="282" cy="210" r="3"/><path class="brain-leader" d="M282 210H178V183H92"/><text class="brain-anatomy-label" x="18" y="180">뇌량</text><text class="brain-anatomy-label" x="18" y="194">CORPUS CALLOSUM</text>
              <circle class="brain-dot" cx="323" cy="232" r="3"/><path class="brain-leader" d="M323 232H184V238H92"/><text class="brain-anatomy-label" x="18" y="236">선조체 · STRIATUM</text>
              <circle class="brain-dot" cx="391" cy="272" r="3"/><path class="brain-leader" d="M391 272H190V282H92"/><text class="brain-anatomy-label" x="18" y="279">시상 · THALAMUS</text>
              <circle class="brain-dot" cx="380" cy="320" r="3"/><path class="brain-leader" d="M380 320H192V327H92"/><text class="brain-anatomy-label" x="18" y="324">시상하부</text><text class="brain-anatomy-label" x="18" y="338">HYPOTHALAMUS</text>
              <circle class="brain-dot" cx="379" cy="383" r="3"/><path class="brain-leader" d="M379 383H196V383H92"/><text class="brain-anatomy-label" x="18" y="380">뇌하수체 · PITUITARY</text>
              <circle class="brain-dot" cx="341" cy="354" r="3"/><path class="brain-leader" d="M341 354H194V356H92"/><text class="brain-anatomy-label" x="18" y="354">시신경교차 · OPTIC CHIASM</text>
              <circle class="brain-dot" cx="455" cy="317" r="3"/><path class="brain-leader" d="M455 317H726V282H806"/><text class="brain-anatomy-label" x="812" y="279">송과체</text><text class="brain-anatomy-label" x="812" y="293">PINEAL</text>
              <circle class="brain-dot" cx="447" cy="350" r="3"/><path class="brain-leader" d="M447 350H720V332H806"/><text class="brain-anatomy-label" x="812" y="329">해마 · HIPPOCAMPUS</text>
              <circle class="brain-dot" cx="472" cy="407" r="3"/><path class="brain-leader" d="M472 407H720V402H806"/><text class="brain-anatomy-label" x="812" y="399">교뇌 · PONS</text>
              <circle class="brain-dot" cx="449" cy="465" r="3"/><path class="brain-leader" d="M449 465H720V454H806"/><text class="brain-anatomy-label" x="812" y="451">연수 · MEDULLA</text>
              <circle class="brain-dot" cx="609" cy="458" r="3"/><path class="brain-leader" d="M609 458H734V500H806"/><text class="brain-anatomy-label" x="812" y="497">소뇌</text><text class="brain-anatomy-label" x="812" y="511">CEREBELLUM</text>
              <circle class="brain-dot" cx="430" cy="535" r="3"/><path class="brain-leader" d="M430 535H719V540H806"/><text class="brain-anatomy-label" x="812" y="537">척수 · SPINAL CORD</text>
            </g>
            <g class="atlas-callout ${active('striatum')}" data-region="striatum" transform="translate(332 240)"><circle r="13"/><text y="3">01</text><title>확대판 01 · 기저핵–시상</title></g>
            <g class="atlas-callout ${active('hippocampus')}" data-region="hippocampus" transform="translate(440 350)"><circle r="13"/><text y="3">02</text><title>확대판 02 · 해마 형성체–편도체</title></g>
            <g class="atlas-callout ${active('corpus')}" data-region="corpus" transform="translate(294 205)"><circle r="13"/><text y="3">03</text><title>확대판 03 · 뇌량–뇌실–정중선</title></g>
            <g class="atlas-callout atlas-callout-hidden ${active('insula')}" data-region="insula" transform="translate(225 323)"><circle r="13"/><text y="3">04</text><path d="M14 0h48"/><text class="atlas-callout-caption" x="67" y="3">외측고랑 안쪽</text><title>확대판 04 · 섬엽은 정중 시상면에서 직접 보이지 않음</title></g>
            <g class="orientation-compass" transform="translate(78 513)"><circle r="28"/><path d="M-19 0h38M0-19v38"/><path d="M19 0l-6-4v8ZM0-19l-4 6h8Z"/><text x="-38" y="4">A·앞</text><text x="24" y="4">P·뒤</text><text x="-7" y="-34">S·위</text><text x="-7" y="42">I·아래</text></g>
            <text class="brain-note" x="450" y="570" text-anchor="middle">ORIGINAL SCHEMATIC · REGION SELECTION FOR RESEARCH READING · NOT FOR ANATOMICAL MEASUREMENT</text>
          </svg>
          <div class="atlas-inset-grid">
            <article><header><span>01 · DEEP NUCLEI</span><b>기저핵–시상 회로 확대</b></header><svg viewBox="0 0 300 165" role="img" aria-label="기저핵과 시상 확대 지도"><path d="M24 31h252v105H24z" fill="#f7f4ef" stroke="#d6dcdd"/><path class="brain-structure ${active('striatum')}" data-region="striatum" d="M62 62c25-24 62-25 85-4-18 3-35 13-46 28-20 1-34-7-39-24Z" fill="#dc6947"/><ellipse class="brain-structure ${active('striatum')}" data-region="striatum" cx="126" cy="105" rx="30" ry="19" fill="#d59255"/><ellipse class="brain-structure ${active('striatum')}" data-region="striatum" cx="164" cy="103" rx="19" ry="25" fill="#a97855"/><ellipse class="brain-structure ${active('thalamus')}" data-region="thalamus" cx="218" cy="75" rx="37" ry="26" fill="#e8b06f"/><ellipse class="brain-structure ${active('striatum')}" data-region="striatum" cx="192" cy="119" rx="12" ry="7" fill="#477c77"/><path class="brain-structure ${active('brainstem')}" data-region="brainstem" d="M199 136c15-8 34-7 47 2-10 11-31 15-47 7Z" fill="#484750"/><g class="inset-labels"><text x="48" y="52">CAUDATE</text><text x="102" y="109">PUTAMEN</text><text x="151" y="107">GP</text><text x="203" y="78">THALAMUS</text><text x="182" y="118">STN</text><text x="221" y="151">SN</text></g><path class="circuit-arrow" d="M87 88C114 36 187 29 216 48M233 99c-8 24-27 35-47 35M181 122c-18-5-27-15-33-29"/></svg><p>Caudate·putamen·globus pallidus·STN·substantia nigra를 하나의 “선조체”로 뭉개지 않고 회로 위치를 구분합니다.</p></article>
            <article><header><span>02 · MEDIAL TEMPORAL</span><b>해마 형성체·편도체 확대</b></header><svg viewBox="0 0 300 165" role="img" aria-label="내측 측두엽 확대 지도"><path d="M24 31h252v105H24z" fill="#f7f4ef" stroke="#d6dcdd"/><path class="brain-structure ${active('temporal')}" data-region="temporal" d="M47 118c35-50 94-74 167-60 25 5 46 18 58 37-69-14-134 0-189 42Z" fill="#efc1aa"/><path class="brain-structure ${active('hippocampus')}" data-region="hippocampus" d="M101 99c21-32 66-42 100-20 23 14 21 38-3 52-32 18-76 9-97-18-3-4-3-9 0-14Z" fill="#a777c1"/><path class="brain-structure ${active('hippocampus')}" data-region="hippocampus" d="M133 104c16-18 42-20 58-5-8 16-33 21-53 10Z" fill="#ead67c"/><path class="brain-structure ${active('amygdala')}" data-region="amygdala" d="M72 99c9-18 33-24 49-10 14 12 8 34-9 41-19 8-45-10-40-31Z" fill="#c84f64"/><g class="inset-labels"><text x="52" y="84">AMYGDALA</text><text x="123" y="73">CA1</text><text x="181" y="78">CA3</text><text x="146" y="107">DG</text><text x="177" y="137">SUBICULUM</text><text x="206" y="111">EC/PHG</text></g><path class="circuit-arrow" d="M220 119c-17 22-54 31-87 18M126 80c29-18 67-13 82 9"/></svg><p>CA1·CA3·dentate gyrus·subiculum과 amygdala·entorhinal/parahippocampal cortex를 분리해 기억·정서 회로를 읽습니다.</p></article>
            <article><header><span>03 · MIDLINE / CSF</span><b>뇌량·뇌실·fornix·대상회</b></header><svg viewBox="0 0 300 165" role="img" aria-label="정중 구조와 뇌실 확대 지도"><path d="M24 31h252v105H24z" fill="#f7f4ef" stroke="#d6dcdd"/><path class="brain-structure ${active('limbic')}" data-region="limbic" d="M58 106C78 47 166 29 225 67" fill="none" stroke="#e78b94" stroke-width="17"/><path class="brain-structure ${active('corpus')}" data-region="corpus" d="M69 108C94 61 164 48 214 76" fill="none" stroke="#f2d18e" stroke-width="15"/><path class="brain-structure ${active('ventricle')}" data-region="ventricle" d="M91 108c25-29 73-36 107-13-34-5-65 4-87 30Z" fill="#b8deed" stroke="#6fa7bd"/><path class="brain-structure ${active('hippocampus')}" data-region="hippocampus" d="M108 119c24-18 57-18 79 0" fill="none" stroke="#d9af55" stroke-width="6"/><g class="inset-labels"><text x="42" y="52">CINGULATE</text><text x="165" y="56">SPLENIUM</text><text x="73" y="82">GENU</text><text x="123" y="93">LATERAL VENTRICLE</text><text x="138" y="136">FORNIX</text></g></svg><p>피질 회로, 교련섬유와 CSF 공간을 서로 다른 조직으로 표시해 용적·확산·기능연결 결과를 혼동하지 않게 합니다.</p></article>
            <article><header><span>04 · HIDDEN CORTEX</span><b>섬엽과 operculum 확대</b></header><svg viewBox="0 0 300 165" role="img" aria-label="섬엽 확대 지도"><path d="M24 31h252v105H24z" fill="#f7f4ef" stroke="#d6dcdd"/><path d="M49 77c40-35 84-43 126-20-27 8-45 23-55 45-29 5-54-3-71-25Z" fill="#e8b096"/><path d="M250 75c-38-30-79-35-116-14 25 8 42 22 51 42 27 4 49-5 65-28Z" fill="#e6c58d"/><path class="brain-structure ${active('insula')}" data-region="insula" d="M107 76c22-23 61-25 86-3 17 15 14 39-6 52-27 18-67 9-84-18-6-10-4-22 4-31Z" fill="#d98d9e"/><path class="brain-sulcus" d="M124 83c15-8 33-8 48 0M119 99c20-8 43-6 57 6M137 70c-6 14-6 29 1 44M159 68c-6 17-4 35 6 49"/><g class="inset-labels"><text x="37" y="65">FRONTAL OPERCULUM</text><text x="191" y="65">PARIETAL</text><text x="129" y="95">INSULA</text><text x="105" y="130">ANTERIOR → POSTERIOR</text></g></svg><p>정중 시상면에서 보이지 않는 섬엽을 별도 확대해 anterior–posterior 구획과 operculum의 공간관계를 보완합니다.</p></article>
          </div>
          <div class="brain-map-key"><span><b>피질</b> mPFC·OFC·SMA·M1/S1·precuneus·V1</span><span><b>심부핵</b> caudate·putamen·GP·STN·SN·thalamus</span><span><b>기억·정서</b> hippocampal formation·amygdala·insula</span><span><b>정중구조</b> cingulate·corpus callosum·ventricle·fornix</span><span><b>운동</b> midbrain·pons·medulla·cerebellum</span></div>
        </article>
        <aside class="research-card atlas-detail" style="--region-color:${region.color}"><span>SELECTED REGION</span><h2>${region.ko}</h2><small>${region.en}</small><p>${region.summary}</p><div class="atlas-facts"><div><span>COGNITIVE FUNCTIONS</span><b>${region.functions}</b></div><div><span>RELATED DISORDERS</span><b>${region.disorders}</b></div><div><span>COMMON METHODS</span><b>${region.method}</b></div><div><span>CONNECTED PAPERS</span><b>${region.paperIds.length}편</b></div></div><details class="atlas-deep" open><summary>하위영역과 기능</summary><ul>${region.subregions.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></details><details class="atlas-deep" open><summary>질환·인지 기전 해석</summary><p>${escapeHtml(region.mechanism)}</p></details><div class="atlas-caution"><b>해석 주의</b><p>${escapeHtml(region.caution)}</p></div><div class="related-papers">${region.paperIds.map(id => { const paper = paperById(id); return paper ? `<button type="button" data-paper="${paper.id}"><span><b>${escapeHtml(paper.title)}</b><small>${paper.journal} · ${paper.year}</small></span><i>→</i></button>` : ''; }).join('')}</div></aside>
      </section>
      <section class="research-card panel"><div class="section-heading"><div><span>ATLAS READING RULE</span><h2>구조 → 회로 → 측정 → 통계 → 해석 경계</h2><p>같은 구조라도 MRI modality, parcellation, network 정의, 대상군과 시간축이 달라지면 같은 생물학적 주장으로 합치지 않습니다.</p></div></div><div class="atlas-reading-flow"><div><span>01</span><b>해부학 수준</b><p>엽·gyrus·핵·subfield</p></div><div><span>02</span><b>회로 수준</b><p>피질–피질하·소뇌 고리</p></div><div><span>03</span><b>측정 수준</b><p>용적·BOLD·확산·PET</p></div><div><span>04</span><b>통계 수준</b><p>집단차·예측·매개·종단</p></div><div><span>05</span><b>해석 경계</b><p>상관·원인·개인진단 구분</p></div></div></section>
    </div>`;
  }

  function decorateAtlas() {
    if (currentView !== 'atlas') return;
    const content = $('#paperContent');
    const insetMeta = [
      { groups: ['striatum', 'thalamus', 'brainstem'], label: '본 그림의 01', where: '대뇌 한가운데 · 뇌량과 뇌실 아래' },
      { groups: ['hippocampus', 'amygdala', 'temporal'], label: '본 그림의 02', where: '측두엽 안쪽 깊은 곳 · 시상 아래가쪽' },
      { groups: ['corpus', 'ventricle', 'limbic'], label: '본 그림의 03', where: '좌우 반구 사이 · 정중선의 C자 구조' },
      { groups: ['insula'], label: '본 그림의 04', where: '외측고랑 안쪽 · 정중면에서는 보이지 않음', hidden: true }
    ];
    content.querySelectorAll('.atlas-inset-grid > article').forEach((card, index) => {
      const meta = insetMeta[index];
      if (!meta) return;
      card.classList.add('atlas-inset-card');
      if (meta.groups.includes(atlasRegion)) card.classList.add('active');
      card.querySelector('header')?.insertAdjacentHTML('afterend', `<div class="inset-location ${meta.hidden ? 'hidden' : ''}"><span>${meta.label}</span><b>${meta.where}</b></div>`);
    });
    content.querySelector('.atlas-detail > p')?.insertAdjacentHTML('afterend', atlasLocatorHtml(atlasRegion));
  }

  function render() {
    const content = $('#paperContent');
    const renderers = { hub: renderHub, library: renderLibrary, evidence: renderEvidence, synthesis: renderSynthesis, study: renderStudy, atlas: renderAtlasDetailed, paper: renderPaperDetail };
    content.innerHTML = (renderers[currentView] || renderHub)();
    decorateAtlas();
    updateBadges();
  }

  function openPaper(id) {
    const paper = paperById(id);
    if (!paper) return;
    if (currentView !== 'paper') previousView = currentView;
    selectedPaperId = id;
    paperDetailTab = 'overview';
    goView('paper');
    loadAnalysisForPaper(id);
  }

  function openImport() {
    $('#importBackdrop').hidden = false;
    $('#importDrawer').classList.add('open');
    $('#importDrawer').setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeImport() {
    $('#importDrawer').classList.remove('open');
    $('#importDrawer').setAttribute('aria-hidden', 'true');
    $('#importBackdrop').hidden = true;
    document.body.style.overflow = '';
  }

  $('#promptText').value = promptTemplate;
  $('#paperNav').addEventListener('click', event => {
    const button = event.target.closest('[data-view]');
    if (button) goView(button.dataset.view);
  });
  $('#paperContent').addEventListener('click', event => {
    const back = event.target.closest('[data-paper-back]');
    if (back) { goView(previousView || 'library'); return; }
    const paperTab = event.target.closest('[data-paper-tab]');
    if (paperTab) { paperDetailTab = paperTab.dataset.paperTab; render(); $('#paperContent')?.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const goEvidence = event.target.closest('[data-go-evidence]');
    if (goEvidence) { selectedEvidenceId = goEvidence.dataset.goEvidence; evidenceFilter = 'all'; goView('evidence'); return; }
    const go = event.target.closest('[data-go]');
    if (go) { goView(go.dataset.go); return; }
    const paperButton = event.target.closest('[data-paper]');
    if (paperButton) { openPaper(paperButton.dataset.paper); return; }
    const filter = event.target.closest('[data-evidence-filter]');
    if (filter) { evidenceFilter = filter.dataset.evidenceFilter; render(); return; }
    const evidenceButton = event.target.closest('[data-evidence]');
    if (evidenceButton) { selectedEvidenceId = evidenceButton.dataset.evidence; render(); return; }
    const evidenceAction = event.target.closest('[data-evidence-action]');
    if (evidenceAction) {
      const selected = evidence.find(item => item.id === selectedEvidenceId);
      if (selected) selected.state = evidenceAction.dataset.evidenceAction;
      if (selected?._bridgeInsightId && window.AiderPaperBridge?.setInsightReview) {
        const state = selected.state === 'verified' ? 'verified' : selected.state === 'rejected' ? 'rejected' : 'needs_correction';
        window.AiderPaperBridge.setInsightReview(selected._bridgeInsightId, state).catch(error => showToast(error.message || '검토 상태를 저장하지 못했습니다.'));
      }
      showToast(selected.state === 'verified' ? '검증 완료로 표시했습니다. 통합 분석에 반영됩니다.' : selected.state === 'rejected' ? '이 근거를 후속 분석에서 제외했습니다.' : '수정 필요 상태로 되돌렸습니다.');
      render();
      return;
    }
    const studyButton = event.target.closest('[data-study-step]');
    if (studyButton) { studyStep = Number(studyButton.dataset.studyStep); render(); showToast(`${studyButton.textContent.trim()} 단계를 선택했습니다.`); return; }
    const atlasExpand = event.target.closest('[data-atlas-expand]');
    if (atlasExpand) { atlasMapExpanded = !atlasMapExpanded; render(); return; }
    const region = event.target.closest('[data-region]');
    if (region) { atlasRegion = region.dataset.region; render(); return; }
    const action = event.target.closest('[data-selection-action]');
    if (action) {
      if (!librarySelection.size) { showToast('먼저 논문을 선택하세요.'); return; }
      if (action.dataset.selectionAction === 'delete') {
        const deletable = [...librarySelection].filter(id => bridgePaperIds.has(id));
        if (!deletable.length) { showToast('내 Library에 저장된 논문만 삭제할 수 있습니다.'); return; }
        if (!confirm(`${deletable.length}개 논문과 연결된 Insight를 삭제할까요?`)) return;
        window.AiderPaperBridge?.deletePapers?.(deletable).catch(error => showToast(error.message || '논문을 삭제하지 못했습니다.'));
        librarySelection.clear();
        return;
      }
      const labels = { compare: '선택한 논문을 비교 목록에 담았습니다.', tag: '선택 논문의 공통 태그를 비교할 수 있습니다.', project: '연구 프로젝트 분류는 다음 단계에서 연결됩니다.' };
      showToast(labels[action.dataset.selectionAction]);
    }
  });
  $('#paperContent').addEventListener('change', event => {
    if (event.target.matches('[data-library-select]')) {
      event.target.checked ? librarySelection.add(event.target.dataset.librarySelect) : librarySelection.delete(event.target.dataset.librarySelect);
      const label = $('.library-toolbar span');
      if (label) label.innerHTML = `<b>${papers.length}</b> papers · <b>${librarySelection.size}</b> selected`;
    }
    if (event.target.id === 'selectAllPapers') {
      librarySelection = event.target.checked ? new Set(papers.map(paper => paper.id)) : new Set();
      render();
    }
    if (['libraryType', 'libraryModality', 'libraryState'].includes(event.target.id)) render();
  });
  $('#paperContent').addEventListener('input', event => {
    if (event.target.id === 'libraryQuery') {
      clearTimeout(renderLibrary.timer);
      const value = event.target.value;
      renderLibrary.timer = setTimeout(() => {
        render();
        const input = $('#libraryQuery');
        if (input) { input.value = value; input.focus(); input.setSelectionRange(value.length, value.length); }
      }, 180);
    }
  });

  $('#importButton').addEventListener('click', openImport);
  $('#closeImport').addEventListener('click', closeImport);
  $('#importBackdrop').addEventListener('click', closeImport);
  $('#copyPrompt').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(promptTemplate); showToast('GPT 분석 프롬프트를 복사했습니다.'); }
    catch { $('#promptText').select(); document.execCommand('copy'); showToast('프롬프트를 복사했습니다.'); }
  });
  $('#loadSampleJson').addEventListener('click', () => { $('#resultText').value = JSON.stringify(sampleImport, null, 2); showToast('검사용 예시 JSON을 넣었습니다.'); });
  $('#validateImport').addEventListener('click', () => {
    const raw = $('#resultText').value.trim();
    if (!raw) { showToast('GPT 결과를 붙여넣거나 예시 결과를 넣어주세요.'); return; }
    try {
      const parsed = JSON.parse(raw.replace(/^```(?:json)?\s*/i, '').replace(/```$/i, '').trim());
      const required = ['documentCoverage', 'bibliography', 'closeReading', 'criticalEvaluation', 'studyProfile', 'neuroProfile', 'claims', 'tables', 'figures', 'features', 'qualityChecks', 'limitationsAndGaps', 'unknowns'];
      const missing = required.filter(key => !(key in parsed));
      const claims = Array.isArray(parsed.claims) ? parsed.claims : [];
      const missingQuotes = claims.filter(item => !item.sourceQuote).length;
      const missingLocators = claims.filter(item => !item.locator || !Object.values(item.locator).some(Boolean)).length;
      const walkthrough = Array.isArray(parsed.closeReading?.narrativeWalkthrough) ? parsed.closeReading.narrativeWalkthrough : [];
      const shortWalkthrough = walkthrough.filter(item => String(item?.explanation || '').trim().length < 70).length;
      const keyTerms = Array.isArray(parsed.closeReading?.keyTerms) ? parsed.closeReading.keyTerms : [];
      const studyAnswers = Array.isArray(parsed.closeReading?.studyAnswers) ? parsed.closeReading.studyAnswers : [];
      const depthErrors = Number(walkthrough.length < 6) + Number(shortWalkthrough > 0) + Number(keyTerms.length < 5) + Number(studyAnswers.length < 4);
      const evaluationDimensions = Array.isArray(parsed.criticalEvaluation?.evaluationDimensions) ? parsed.criticalEvaluation.evaluationDimensions : [];
      const ungroundedEvaluations = evaluationDimensions.filter(item => !item?.locator || !Array.isArray(item?.evidenceClaimIds) || item.evidenceClaimIds.length === 0).length;
      const claimTriangulation = Array.isArray(parsed.criticalEvaluation?.claimTriangulation) ? parsed.criticalEvaluation.claimTriangulation : [];
      const biasAudit = Array.isArray(parsed.criticalEvaluation?.biasAudit) ? parsed.criticalEvaluation.biasAudit : [];
      const evaluationErrors = Number(evaluationDimensions.length < 6) + Number(ungroundedEvaluations > 0) + Number(claimTriangulation.length < 1) + Number(biasAudit.length < 1) + Number(!parsed.criticalEvaluation?.overallVerdict?.decisionForMyResearch);
      const blockingErrors = missing.length + missingQuotes + missingLocators + depthErrors + evaluationErrors;
      pendingImportPayload = blockingErrors ? null : parsed;
      $('#importValidation').hidden = false;
      $('#importValidation').innerHTML = `<h3>${blockingErrors ? '설명 또는 평가 근거를 보완한 뒤 가져올 수 있습니다' : '정독 내용과 근거 기반 평가 검사를 통과했습니다'}</h3><div class="validation-grid"><div><span>SCHEMA</span><b>${escapeHtml(parsed.schema || '미표시')}</b></div><div><span>CLAIMS</span><b>${claims.length}건</b></div><div><span>BLOCKING ERRORS</span><b>${blockingErrors}</b></div></div><ul class="validation-list">${missing.length ? `<li>필수 영역 누락: ${missing.map(escapeHtml).join(', ')}</li>` : `<li>필수 ${required.length}개 영역이 모두 있습니다.</li>`}<li>원문 인용 누락 ${missingQuotes}건 · 위치 누락 ${missingLocators}건</li><li>장문 해설 ${walkthrough.length}/6단계 · 70자 미만 설명 ${shortWalkthrough}건</li><li>맥락 용어 ${keyTerms.length}/5개 · 정독 확인 질문 ${studyAnswers.length}/4개</li><li>평가축 ${evaluationDimensions.length}/6개 · 원문 근거 없는 평가 ${ungroundedEvaluations}건</li><li>주장 균형평가 ${claimTriangulation.length}건 · 편향 점검 ${biasAudit.length}건</li><li>Supplement 검토 여부: ${parsed.documentCoverage?.supplementsRead ? '확인' : '미확인 — 경고로 저장'}</li><li>${blockingErrors ? '차단 오류를 보완해야 저장 버튼이 열립니다.' : '저장 후 Library·Evidence와 논문별 정독·비평 화면에 반영됩니다.'}</li></ul>${blockingErrors ? '' : '<button type="button" class="primary-button wide" data-save-import>검사 통과 결과를 Library에 저장</button>'}`;
      $$('.import-steps li').forEach((item, index) => item.classList.toggle('active', index === 2));
      showToast(blockingErrors ? '누락 또는 설명 깊이가 부족한 필드를 확인하세요.' : '검사 완료: 정독형 미리보기를 만들 수 있습니다.');
    } catch (error) { showToast(`JSON 형식을 확인해주세요: ${error.message}`); }
  });
  $('#importValidation').addEventListener('click', async event => {
    const button = event.target.closest('[data-save-import]');
    if (!button || !pendingImportPayload) return;
    if (!window.AiderPaperBridge?.saveImport) { showToast('AiderLog 로그인과 저장 연결을 확인해주세요.'); return; }
    button.disabled = true;
    button.textContent = 'Library에 저장 중…';
    try {
      const result = await window.AiderPaperBridge.saveImport(pendingImportPayload);
      syncBridgeCollections();
      hydrateAnalysis(result.id, pendingImportPayload);
      pendingImportPayload = null;
      closeImport();
      openPaper(result.id);
      showToast(result.analysisStored ? '논문·근거·상세 분석을 저장했습니다.' : '논문과 근거는 저장했지만 상세 분석의 서버 저장은 확인이 필요합니다.');
    } catch (error) {
      button.disabled = false;
      button.textContent = '검사 통과 결과를 Library에 저장';
      showToast(error.message || '논문을 저장하지 못했습니다.');
    }
  });

  $('#guideButton').addEventListener('click', () => $('#guideDialog').showModal());
  $$('[data-dialog-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  $('#paperDialog').addEventListener('click', event => { if (event.target === $('#paperDialog')) $('#paperDialog').close(); });
  $('#guideDialog').addEventListener('click', event => { if (event.target === $('#guideDialog')) $('#guideDialog').close(); });
  $('#globalSearch').addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    goView('library');
    requestAnimationFrame(() => {
      const input = $('#libraryQuery');
      if (input) { input.value = event.target.value; input.dispatchEvent(new Event('input', { bubbles: true })); }
    });
  });
  $('#projectButton').addEventListener('click', () => showToast('최종본에서는 여러 연구 프로젝트를 전환할 수 있습니다.'));

  syncBridgeCollections();
  window.AiderPaperWorkspace = {
    activate() { syncBridgeCollections(); render(); },
    refresh() { syncBridgeCollections(); render(); },
    focusSearch() { $('#globalSearch')?.focus(); },
    root: paperRoot,
  };
  render();
})();
