const fs = require('fs');

const read = path => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const languageJs = read('language-lab-v18.js');
const firebaseJs = read('firebase-app.js');
const rules = read('firestore.rules');
const adminApi = read('api/admin-users.mjs');
const serviceWorker = read('sw.js');
const pkg = JSON.parse(read('package.json'));

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(Boolean)
  .forEach((source, index) => {
    new Function(source);
    console.log(`inline-script-${index + 1}: ok`);
  });
new Function(languageJs);
console.log('language-lab-v18.js: ok');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);

const htmlMarkers = [
  'content="v112"',
  'data-account-settings="admin"',
  'id="loginBirthDate"',
  'id="loginBirthCalendar"',
  'function connectionBirthdayEvents',
  'isBirthday:true',
  "calendarId:'aiderlog-birthday'",
  'data-research-view="lab"',
  'NEURO_RESEARCH_WORKFLOW_V2',
  'research_landscape',
  'researchLandscape:structuredClone(researchPendingLandscape||{})',
  'function researchLandscapeBoard',
  'function designFeasibility',
  'function deleteSelectedResearchPapers',
  'data-library-delete-selected',
  'https://sites.google.com/view/yooklab/home',
  '10.1016/j.neuroimage.2026.121862',
];
for (const marker of htmlMarkers) {
  if (!html.includes(marker)) throw new Error(`Missing v112 marker: ${marker}`);
}

for (const marker of ['updateProfileSettings', 'propagateMemberProfile', 'birthCalendar', 'birthLeap']) {
  if (!firebaseJs.includes(marker)) throw new Error(`Missing Firebase profile marker: ${marker}`);
}
for (const marker of ['birthDate is string', "birthCalendar in ['solar', 'lunar']", 'birthLeap is bool']) {
  if (!rules.includes(marker)) throw new Error(`Missing Firestore rule marker: ${marker}`);
}
for (const marker of [
  "const ADMIN_EMAIL = 'qhals5060@gmail.com'",
  'verifyIdToken(token, true)',
  'decoded.email_verified !== true',
  'auth.listUsers(1000, pageToken)',
  "db.doc(`users/${user.uid}`)",
]) {
  if (!adminApi.includes(marker)) throw new Error(`Missing protected admin API marker: ${marker}`);
}
if (adminApi.includes('passwordHash') || adminApi.includes('refreshToken')) {
  throw new Error('Admin API must not expose authentication secrets.');
}

if (!languageJs.includes('language-lab-v18-template.html?v=112') || !languageJs.includes('language-lab-v18.css?v=112')) {
  throw new Error('Language Lab assets are not cache-busted to v112.');
}
if (pkg.name !== 'aiderlog-v112' || pkg.version !== '112.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v112-admin-birthdays-research-landscape';")) {
  throw new Error('Unexpected v112 service worker cache key.');
}

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map(match => match[1]);
const missing = shellAssets.filter(asset => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v112 protected admin, birthdays, and research workflow: ok');
