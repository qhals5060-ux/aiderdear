const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const engine = fs.readFileSync('language-lab-v18-engine.js', 'utf8');
const labCss = fs.readFileSync('language-lab-v18.css', 'utf8');
const labElement = fs.readFileSync('language-lab-v18.js', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter(Boolean);
inlineScripts.forEach((script, index) => {
  new Function(script);
  console.log(`inline-script-${index + 1}: ok`);
});

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);
console.log(`ids: ${ids.length} unique`);

const requiredFiles = [
  'challenge-burpee-animated-v100.webp',
  'challenge-burpee-stepback-animated-v103.webp',
  'challenge-burpee-pushup-animated-v103.webp',
  'language-lab-v18-engine.js',
  'language-lab-v18.css',
  'language-lab-v18.js',
];
for (const file of requiredFiles) {
  if (!fs.existsSync(file) || fs.statSync(file).size < 1000) throw new Error(`Missing or empty v103 asset: ${file}`);
}

const htmlMarkers = [
  'content="v103"',
  'id="personalWorkflowPriority"',
  'id="personalWorkflowSuccess"',
  'id="personalWorkflowBlocker"',
  'class="workflow-command-v103"',
  'data-workflow-step=',
  'class="today-journal-hero"',
  "id:'stepback'",
  "id:'pushup'",
  'language-lab-v18-engine.js?v=103',
];
for (const marker of htmlMarkers) {
  if (!html.includes(marker)) throw new Error(`Missing v103 HTML marker: ${marker}`);
}

const languageMarkers = [
  'suggestionCount: 3',
  'if (result.length === 3) break;',
  'I don\'t think we\'ve met before.',
  'It was great meeting you.',
  'firstMeeting?.matches()',
];
for (const marker of languageMarkers) {
  if (!engine.includes(marker)) throw new Error(`Missing language marker: ${marker}`);
}
if (!labCss.includes('reliable nested lesson scrolling') || !labCss.includes('overscroll-behavior:contain')) {
  throw new Error('Language lesson scroll containment is missing.');
}
if (!labElement.includes("['wheel','touchstart','touchmove','touchend']")) {
  throw new Error('Language host event containment is missing.');
}

if (!serviceWorker.startsWith("const CACHE='aiderlog-v103-language-workflow-daily-brief';")) {
  throw new Error('Unexpected v103 service worker cache key.');
}
const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missingShellAssets = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missingShellAssets.length) throw new Error(`Missing service worker assets: ${missingShellAssets.join(', ')}`);
for (const file of requiredFiles.slice(0, 3)) {
  if (!serviceWorker.includes(`'./${file}'`)) throw new Error(`Burpee asset not cached: ${file}`);
}

console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v103 language, burpee, workflow, and Daily Brief structure: ok');
