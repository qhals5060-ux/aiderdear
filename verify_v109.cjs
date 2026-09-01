const fs = require('fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const serviceWorker = read('sw.js');
const pkg = JSON.parse(read('package.json'));

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter(Boolean)
  .forEach((source, index) => {
    new Function(source);
    console.log(`inline-script-${index + 1}: ok`);
  });

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);

const markers = [
  'content="v109"',
  'AIDERLOG_PAPER_V1',
  'NEURO_EVIDENCE_V1',
  'data-research-view="evidence"',
  'function renderResearchEvidence(data)',
  'function paperPromptTemplate()',
  'id="paperPromptCopy"',
  'id="paperImportDiagnostics"',
  'id="importPaperStructuredInsights"',
  'NEUROSCIENCE STUDY PROFILE',
  'sourceQuote:',
  'reviewState:',
  'evidenceDirection:',
  'extractionConfidence:',
  'evidenceStrength:',
];
for (const marker of markers) {
  if (!html.includes(marker)) throw new Error(`Missing v109 marker: ${marker}`);
}

if (pkg.name !== 'aiderlog-v109' || pkg.version !== '109.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v109-neuroscience-evidence-workspace';")) throw new Error('Unexpected v109 service worker cache key.');

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missing = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v109 neuroscience evidence workspace: ok');
