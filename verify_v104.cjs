const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const firebase = fs.readFileSync('firebase-app.js', 'utf8');
const calendarApi = fs.readFileSync('api/calendar-sync.mjs', 'utf8');
const rules = fs.readFileSync('firestore.rules', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

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

const markers = [
  [html, 'content="v104"'],
  [html, 'id="eventGoogleCalendar"'],
  [html, 'id="eventImportedShare"'],
  [html, 'id="eventWishlistModal"'],
  [html, 'id="recordFavorite"'],
  [html, 'id="albumFolderShared"'],
  [html, 'id="consultingClientAdvisors"'],
  [html, 'id="intakeAdvisors"'],
  [html, 'class="routine-mandala-v104"'],
  [html, 'class="routine-compact-v104'],
  [html, 'class="routine-overall-v104"'],
  [html, 'data-routine-expand='],
  [firebase, 'publishSharedAlbums'],
  [firebase, 'watchSharedAlbums'],
  [firebase, "source: 'external-intake-v4'"],
  [calendarApi, "'https://www.googleapis.com/auth/calendar.events'"],
  [calendarApi, 'async function createGoogleEvent'],
  [calendarApi, 'async function shareGoogleEvent'],
  [calendarApi, 'mirrorSharedSchedule'],
  [rules, 'match /sharedAlbums/{ownerUid}'],
  [rules, "request.resource.data.source == 'external-intake-v4'"],
];
for (const [source, marker] of markers) {
  if (!source.includes(marker)) throw new Error(`Missing v104 marker: ${marker}`);
}

if (pkg.name !== 'aiderlog-v104' || pkg.version !== '104.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v104-calendar-events-albums-advisors-routine';")) {
  throw new Error('Unexpected v104 service worker cache key.');
}
const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missingShellAssets = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missingShellAssets.length) throw new Error(`Missing service worker assets: ${missingShellAssets.join(', ')}`);

console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v104 calendar, archive, album, advisor, and routine structure: ok');
