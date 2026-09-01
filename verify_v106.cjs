const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const firebase = fs.readFileSync('firebase-app.js', 'utf8');
const calendarApi = fs.readFileSync('api/calendar-sync.mjs', 'utf8');
const rules = fs.readFileSync('firestore.rules', 'utf8');
const serviceWorker = fs.readFileSync('sw.js', 'utf8');
const languageElement = fs.readFileSync('language-lab-v18.js', 'utf8');
const languageEngine = fs.readFileSync('language-lab-v18-engine.js', 'utf8');
const languageCss = fs.readFileSync('language-lab-v18.css', 'utf8');
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
  [html, 'content="v106"'],
  [html, 'language-lab-v18-engine.js?v=106'],
  [html, 'language-lab-v18.js?v=106'],
  [html, 'id="eventGoogleCalendar"'],
  [html, 'id="eventImportedShare"'],
  [html, 'id="eventWishlistModal"'],
  [html, 'id="recordFavorite"'],
  [html, 'id="albumFolderShared"'],
  [html, 'id="consultingClientAdvisors"'],
  [html, 'id="intakeAdvisors"'],
  [html, 'class="routine-mandala-v104 routine-mandala-v106"'],
  [html, 'class="routine-compact-v104'],
  [html, 'class="routine-overall-v104"'],
  [html, 'data-routine-expand='],
  [html, 'routine-expanded-inline-v106'],
  [html, 'function routineStampMark'],
  [html, 'function routineGoalWorkspace'],
  [html, 'data-big-goal-select='],
  [html, 'id="eventWishlistCount"'],
  [html, 'id="albumEditFolder"'],
  [html, 'function openAlbumFolderEditor'],
  [html, 'function prepareConsultingClientColumns'],
  [html, '지출 완료 확인'],
  [html, 'async function openGoogleBrowserFallback'],
  [firebase, 'publishSharedAlbums'],
  [firebase, 'watchSharedAlbums'],
  [firebase, "source: 'external-intake-v4'"],
  [calendarApi, "'https://www.googleapis.com/auth/calendar.events'"],
  [calendarApi, 'async function createGoogleEvent'],
  [calendarApi, 'async function shareGoogleEvent'],
  [calendarApi, 'mirrorSharedSchedule'],
  [rules, 'match /sharedAlbums/{ownerUid}'],
  [rules, "request.resource.data.source == 'external-intake-v4'"],
  [html, 'className=\'calendar-period-marker\''],
  [html, 'const RETENTION_DAYS=90'],
  [html, 'id="todayJournalWeek"'],
  [html, 'brain-atlas-index-v105'],
  [html, 'graduate-fit-collapsible'],
  [firebase, 'pruneSharedAlbumMedia'],
  [firebase, "await deleteDoc(doc(clientIntakeRef(token), 'submissions'"],
  [languageElement, "language-lab-v18-template.html?v=106"],
  [languageElement, "language-lab-v18.css?v=106"],
  [languageEngine, 'linkedDialogueFallbacks(language, target)'],
  [languageEngine, 'createDialogueSuggestionPicker(language, target)'],
  [languageCss, 'display:none!important'],
  [languageCss, '.app-shell.lesson-active .lesson-screen{display:flex!important}'],
];
for (const [source, marker] of markers) {
  if (!source.includes(marker)) throw new Error(`Missing v106 marker: ${marker}`);
}

if (pkg.name !== 'aiderlog-v106' || pkg.version !== '106.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v106-calendar-archive-album-goals-routines';")) {
  throw new Error('Unexpected v106 service worker cache key.');
}
const subregionSource = html.slice(html.indexOf('const BRAIN_SUBREGIONS='), html.indexOf('const brainDisorder='));
const disorderSource = html.slice(html.indexOf('const BRAIN_DISORDERS='), html.indexOf('const EMOTION_DATA_FILE_NAME='));
const subregionCount = [...subregionSource.matchAll(/\bid:\s*'/g)].length;
const disorderCount = [...disorderSource.matchAll(/brainDisorder\('/g)].length;
if (subregionCount < 40 || disorderCount < 80) throw new Error(`Brain atlas coverage too small: ${subregionCount} subregions, ${disorderCount} disorders`);
const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missingShellAssets = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missingShellAssets.length) throw new Error(`Missing service worker assets: ${missingShellAssets.join(', ')}`);

console.log(`service worker assets: ${shellAssets.length} present`);
console.log(`brain atlas: ${subregionCount} subregions, ${disorderCount} disorders`);
console.log('v106 calendar recovery, archive, album, client, finance, goals and routine structure: ok');
