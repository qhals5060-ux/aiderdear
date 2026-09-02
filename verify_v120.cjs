const fs = require('fs');

const read = file => fs.readFileSync(file, 'utf8');
const html = read('index.html');
const workspace = read('paper-workspace-v120.js');
const css = read('paper-workspace-v120.css');
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
  'content="v120"',
  'paper-workspace-v120.js?v=120',
  'window.AiderPaperBridge',
  'savePaperV120Import',
  "payload.schema!=='AIDERLOG_PAPER_V3'",
  'writePaperAnalysis',
  'deletePaperAnalysis',
  'AIDERLOG_PAPER_V3',
].forEach(marker => {
  if (!html.includes(marker) && !workspace.includes(marker) && !firebase.includes(marker)) {
    throw new Error(`Missing v120 marker: ${marker}`);
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
if (!sw.startsWith("const CACHE='aiderlog-v120-paper-research-os';")) throw new Error('Unexpected service worker cache.');
if (!sw.includes("'./paper-workspace-v120.js'") || !sw.includes("'./paper-workspace-v120.css'")) throw new Error('Paper assets are not cached.');
if (pkg.name !== 'aiderlog-v120' || pkg.version !== '120.0.0') throw new Error('Unexpected package version.');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`Duplicate static IDs: ${duplicateIds.join(', ')}`);

console.log(`v120 scripts: ok; ${ids.length} static ids; Paper Research OS and per-paper analysis storage present`);
