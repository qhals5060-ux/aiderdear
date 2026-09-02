const fs = require('fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const languageJs = read('language-lab-v18.js');
const languageCss = read('language-lab-v18.css');
const firebaseJs = read('firebase-app.js');
const calendarApi = read('api/calendar-sync.mjs');
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
  'content="v111"',
  'data-research-view="design"',
  'function setExternalEventCoupleShare',
  'function seedNeuroscienceExamples',
  'function insightQualityScore',
  'function renderResearchDesign',
  'id="albumShareRecipients"',
  'sharedFriendUids',
  '상대의 AiderLog에만 표시됩니다',
  'researchDesigns:data.researchDesigns',
];
for (const marker of htmlMarkers) {
  if (!html.includes(marker)) throw new Error(`Missing v111 marker: ${marker}`);
}

const languageMarkers = [
  'AiderLog v111 final override',
  'grid-template-columns:1fr auto!important',
  '상대에게 보내기',
];
for (const marker of languageMarkers) {
  if (!languageCss.includes(marker) && !languageJs.includes(marker)) {
    throw new Error(`Missing Language Lab marker: ${marker}`);
  }
}
if (!languageJs.includes('language-lab-v18-template.html?v=111') || !languageJs.includes('language-lab-v18.css?v=111')) {
  throw new Error('Language Lab assets are not cache-busted to v111.');
}

const firebaseMarkers = [
  'sharedFriendUids',
  'connectedRecipientUids',
  'folderIds',
];
for (const marker of firebaseMarkers) {
  if (!firebaseJs.includes(marker)) throw new Error(`Missing Firebase sharing marker: ${marker}`);
}

const shareFunction = calendarApi.match(/async function shareGoogleEvent[\s\S]*?\n}\n\nasync function stopGoogleChannels/)?.[0] || '';
if (!shareFunction.includes('sharedEventKeys') || shareFunction.includes('googleJson(')) {
  throw new Error('Google imported-event sharing must update only AiderLog metadata, never a Google calendar.');
}
if (!calendarApi.includes('previouslyShared') || !calendarApi.includes("provider === 'google' ? new Set()")) {
  throw new Error('Non-Google imported-event sharing is not preserved across provider refreshes.');
}

if (pkg.name !== 'aiderlog-v111' || pkg.version !== '111.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v111-sharing-insights-design-studio';")) throw new Error('Unexpected v111 service worker cache key.');

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missing = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v111 selective sharing and research design: ok');
