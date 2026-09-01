const fs = require('fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const calendarApi = read('api/calendar-sync.mjs');
const languageElement = read('language-lab-v18.js');
const languageCss = read('language-lab-v18.css');
const brain = read('brain-3d.js');
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
  [html, 'content="v107"'],
  [html, 'language-lab-v18-engine.js?v=107'],
  [html, 'routine-overall-v107'],
  [html, 'routine-donut-v107'],
  [html, 'OAuth 콜백 뒤 연결 상태가 저장되지 않았습니다.'],
  [html, '.brain-workspace{height:auto!important;min-height:100%!important'],
  [html, '.graduate-fit-overview{height:auto!important;min-height:148px!important'],
  [calendarApi, "trace('oauth-google-saved'"],
  [calendarApi, 'calendar_sync_provider='],
  [languageElement, 'language-lab-v18-template.html?v=107'],
  [languageCss, 'AiderLog v107 · keep the answer action'],
  [brain, 'focused ? 1.28 : 0.82'],
];
for (const [source, marker] of markers) {
  if (!source.includes(marker)) throw new Error(`Missing v107 marker: ${marker}`);
}

if (pkg.name !== 'aiderlog-v107' || pkg.version !== '107.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v107-calendar-ui-layout-recovery';")) throw new Error('Unexpected v107 service worker cache key.');

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missing = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v107 calendar recovery and layout fixes: ok');
