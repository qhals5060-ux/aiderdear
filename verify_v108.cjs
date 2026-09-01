const fs = require('fs');

const read = (path) => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const firebase = read('firebase-app.js');
const languageElement = read('language-lab-v18.js');
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
  [html, 'content="v108"'],
  [html, 'language-lab-v18-engine.js?v=108'],
  [html, "calendarImportMode='client';calendarImportSources=[];googleCalendarWriteSources=[];"],
  [html, 'v100 방식으로 바로 연결됩니다.'],
  [html, 'if(!remembered&&!rows.length)return status;'],
  [firebase, "provider.setCustomParameters({ prompt: 'consent' });"],
  [firebase, '[calendar-connection] browser-consent-ready'],
  [languageElement, 'language-lab-v18-template.html?v=108'],
];
for (const [source, marker] of markers) {
  if (!source.includes(marker)) throw new Error(`Missing v108 marker: ${marker}`);
}

const start = html.slice(html.indexOf('async function startExternalCalendar(provider)'), html.indexOf('async function disconnectExternalCalendar(provider)'));
if (!start.includes('requestGoogleCalendarAccess') && !start.includes('connectGoogleCalendarImport')) throw new Error('Google browser connection is not the primary path.');
if (start.includes("calendarSyncRequest('start',{provider:'google'}")) throw new Error('Server OAuth still blocks the primary Google connect path.');

if (pkg.name !== 'aiderlog-v108' || pkg.version !== '108.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v108-calendar-browser-connection-recovery';")) throw new Error('Unexpected v108 service worker cache key.');

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map((match) => match[1]);
const missing = shellAssets.filter((asset) => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v108 v100-style calendar connection recovery: ok');
