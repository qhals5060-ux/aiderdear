const fs = require('fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const languageJs = read('language-lab-v18.js');
const languageCss = read('language-lab-v18.css');
const serviceWorker = read('sw.js');
const pkg = JSON.parse(read('package.json'));

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter(Boolean)
  .forEach((source, index) => {
    new Function(source);
    console.log(`inline-script-${index + 1}: ok`);
  });
new Function(languageJs);
console.log('language-lab-v18.js: ok');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);

const htmlMarkers = [
  'content="v110"',
  'data-research-view="ideas"',
  'function renderResearchIdeas(data)',
  'function researchIdeaSeeds(data)',
  'id="researchIdeaForm"',
  'id="albumFolderDelete"',
  'id="albumFolderSubmit"',
  "document.body.appendChild(overlay)",
  "body.classList.add('graduate-fit-open')",
  'researchIdeas:data.researchIdeas',
];
for (const marker of htmlMarkers) {
  if (!html.includes(marker)) throw new Error(`Missing v110 marker: ${marker}`);
}

const languageMarkers = [
  '.header-course .course-selectors{display:flex!important',
  'border-top:3px solid #151515!important',
  '.brand b{font-family:',
];
for (const marker of languageMarkers) {
  if (!languageCss.includes(marker)) throw new Error(`Missing Language Lab marker: ${marker}`);
}
if (!languageJs.includes("language-lab-v18-template.html?v=110") || !languageJs.includes("language-lab-v18.css?v=110")) {
  throw new Error('Language Lab assets are not cache-busted to v110.');
}

if (pkg.name !== 'aiderlog-v110' || pkg.version !== '110.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v110-workspace-usability-repair';")) throw new Error('Unexpected v110 service worker cache key.');

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missing = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v110 workspace usability repair: ok');
