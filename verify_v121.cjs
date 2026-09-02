const fs = require('fs');

const read = file => fs.readFileSync(file, 'utf8');
const html = read('index.html');
const workspace = read('paper-workspace-v121.js');
const css = read('paper-workspace-v121.css');
const firebase = read('firebase-app.js');
const rules = read('firestore.rules');
const sw = read('sw.js');
const pkg = JSON.parse(read('package.json'));

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(Boolean)
  .forEach(source => new Function(source));
new Function(workspace);

[
  'content="v121"',
  'paper-workspace-v121.js?v=121',
  'window.AiderPaperBridge',
  'savePaperV120Import',
  "payload.schema!=='AIDERLOG_PAPER_V3'",
  'writePaperAnalysis',
  'deletePaperAnalysis',
  'AIDERLOG_PAPER_V3',
].forEach(marker => {
  if (!html.includes(marker) && !workspace.includes(marker) && !firebase.includes(marker)) {
    throw new Error(`Missing v121 marker: ${marker}`);
  }
});

[
  'attachShadow({ mode: \'open\' })',
  'Research Hub',
  'Evidence',
  'Synthesis',
  'Study Workspace',
  'Brain Atlas',
  'MY LABORATORY',
  'AIDERLOG_PAPER_V3',
  'criticalEvaluation',
  'evaluationDimensions',
  'claimTriangulation',
  'biasAudit',
  'data-save-import',
  'loadAnalysisForPaper',
  'atlas-location',
].forEach(marker => {
  if (!workspace.includes(marker)) throw new Error(`Missing Paper workspace marker: ${marker}`);
});

if (!css.startsWith(':host{')) throw new Error('Paper CSS is not scoped to the shadow host.');
if (!css.includes('.paper-app{width:100%;height:100%')) throw new Error('Paper workspace does not fit the AiderLog frame.');
if (!firebase.includes("'paperAnalyses'")) throw new Error('Per-paper analysis storage is missing.');
if (!rules.includes('match /sharedWorkspaces/aiderlog-paper-task-v1')) throw new Error('Paper workspace Firestore rule is missing.');
if (!sw.startsWith("const CACHE='aiderlog-v121-routine-language-travel-paper';")) throw new Error('Unexpected service worker cache.');
if (!sw.includes("'./paper-workspace-v121.js'") || !sw.includes("'./paper-workspace-v121.css'")) throw new Error('Paper assets are not cached.');
if (pkg.name !== 'aiderlog-v121' || pkg.version !== '121.0.0') throw new Error('Unexpected package version.');

[
  'routine-performance-table-v121',
  'routine-analysis-v121',
  'data-share-ready',
  'travel-plan-sheet-v121',
  'travelPlanBookings',
  'travelPlanPicks',
  '+ Folder',
].forEach(marker => { if (!html.includes(marker) && !workspace.includes(marker)) throw new Error(`Missing v121 feature: ${marker}`); });

['TRAVEL RECORDS','+ 여행 기록','논문 수가 아니라 연구 패턴과 공백을 보세요','Compare·Connections·Research Notes를 한 화면의 문헌 통합 분석으로 합쳤습니다.'].forEach(marker => {
  if (html.includes(marker) || workspace.includes(marker)) throw new Error(`Removed copy still present: ${marker}`);
});

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`Duplicate static IDs: ${duplicateIds.join(', ')}`);

console.log(`v121 scripts: ok; ${ids.length} static ids; routine, language, travel, client and Paper refinements present`);
