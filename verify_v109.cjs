const fs = require('fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const api = read('api/calendar-sync.mjs');
const firebase = read('firebase-app.js');
const serviceWorker = read('sw.js');
const languageElement = read('language-lab-v18.js');
const pkg = JSON.parse(read('package.json'));
const vercel = JSON.parse(read('vercel.json'));

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
  [html, 'content="v109"'],
  [html, 'const CALENDAR_API_VERSION=109;'],
  [html, "calendarImportMode='server'"],
  [html, "calendarSyncRequest('start',{provider})"],
  [html, '상대 AiderLog에만 표시되며 상대 Google Calendar에는 추가되지 않습니다.'],
  [html, '서버에서 자동 동기화됩니다.'],
  [api, 'const API_VERSION = 109;'],
  [api, "coupleShareTarget: 'aiderlog-site-only'"],
  [api, 'partnerGoogleWrite: false'],
  [api, 'serverAutomaticSync: true'],
  [api, 'aiderLogToGoogle: true'],
  [api, "'https://www.googleapis.com/auth/calendar.events'"],
  [api, 'async function shareGoogleEventToCoupleSiteOnly'],
  [api, "if (action === 'google-webhook')"],
  [api, "if (action === 'renew')"],
  [firebase, "return doc(db, 'pairs', state.pair.id, 'schedules', String(uid));"],
  [languageElement, 'language-lab-v18-template.html?v=109'],
];
for (const [source, marker] of markers) {
  if (!source.includes(marker)) throw new Error(`Missing v109 marker: ${marker}`);
}

const start = html.slice(html.indexOf('async function startExternalCalendar(provider)'), html.indexOf('async function disconnectExternalCalendar(provider)'));
if (!start.includes("calendarSyncRequest('start',{provider})")) throw new Error('Google connect does not use the v109 server OAuth path.');
if (start.includes('requestGoogleCalendarAccess') || start.includes("calendarImportMode='client'")) throw new Error('Legacy browser OAuth still blocks the server connection path.');

const create = api.slice(api.indexOf('async function createGoogleEvent'), api.indexOf('async function shareGoogleEventToCoupleSiteOnly'));
if (!create.includes("method: 'POST'") || !create.includes('selected.find')) throw new Error('AiderLog-to-selected-Google-calendar creation is incomplete.');

const share = api.slice(api.indexOf('async function shareGoogleEventToCoupleSiteOnly'), api.indexOf('async function stopGoogleChannels'));
if (share.includes("method: 'POST'") || share.includes("method: 'PATCH'") || share.includes("method: 'DELETE'")) throw new Error('Couple site sharing must never write to Google Calendar.');
if (!share.includes('connection.ref.set') || !share.includes('await syncGoogle(uid)')) throw new Error('Couple site sharing is not persisted and mirrored.');

if (!api.includes("db.doc(`pairs/${pairId}/schedules/${uid}`).set")) throw new Error('Partner AiderLog schedule mirror is missing.');
if (!firebase.includes("shared = partnerSnapshot.exists() ? partnerSnapshot.data().payload || [] : []")) throw new Error('Partner AiderLog schedule reader is missing.');

if (pkg.name !== 'aiderlog-v109' || pkg.version !== '109.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v109-server-calendar-sync-and-site-only-couple-share';")) throw new Error('Unexpected v109 service worker cache key.');
if (vercel.functions?.['api/calendar-sync.mjs']?.maxDuration !== 60) throw new Error('Calendar function duration is not configured.');
if (!vercel.crons?.some((cron) => cron.path === '/api/calendar-sync?action=renew')) throw new Error('Calendar fallback cron is missing.');

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missing = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('server OAuth + selected-calendar write: ok');
console.log('Google webhook + scheduled fallback sync: ok');
console.log('couple share is AiderLog-only; partner Google write: none');
console.log('v109 verification: ok');
