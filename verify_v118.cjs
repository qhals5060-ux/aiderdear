const fs = require('fs');

const read = file => fs.readFileSync(file, 'utf8');
const html = read('index.html');
const engine = read('language-lab-v18-engine.js');
const component = read('language-lab-v18.js');
const template = read('language-lab-v18-template.html');
const css = read('language-lab-v18.css');
const adminApi = read('api/admin-users.mjs');
const pkg = JSON.parse(read('package.json'));
const sw = read('sw.js');

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(Boolean)
  .forEach(source => new Function(source));
new Function(engine);
new Function(component);

const requiredHtml = [
  'content="v118"',
  'language-lab-v18-engine.js?v=118',
  'goPage(0,true)',
  'goRecordPage(0,true)',
  'goPrivatePage(0,true)',
  'goPersonalPage(0,true)',
  "researchView='home'",
  'calendar-period-drop',
  'calendar-status-owner-dot',
  '--calendar-mine:#c69a2f',
  '--calendar-partner:#7d8743',
  'calendar-event-tooltip',
  'grid-auto-rows:70px',
  'id="travelRecordAdd"',
  '<span>A</span><small>LL</small>',
  'id="consultingMajorAdd"',
  'id="consultingClientUniversityYears"',
  'id="consultingClientMilitaryStatus"',
  'id="intakeMajorAdd"',
  "fetch('/api/admin-users?v=118'",
];
requiredHtml.forEach(marker => {
  if (!html.includes(marker)) throw new Error(`Missing v118 HTML marker: ${marker}`);
});

[
  'id="pomodoroClock"',
  'id="travelKindActions"',
  'id="recordEmptyAdd"',
  'id="eventEmptyAdd"',
  'id="travelEmptyAdd"',
  'verifyClientV118',
  'verifySectionV118',
].forEach(removed => {
  if (html.includes(removed)) throw new Error(`Removed v118 markup still present: ${removed}`);
});

['기본 과정', '실전 연습', '맞춤 복습', 'U${item.unitNumber'].forEach(marker => {
  if (!engine.includes(marker)) throw new Error(`Missing v118 course marker: ${marker}`);
});
if (template.includes('학습 경로와 UNIT 선택')) throw new Error('Removed Course Select subtitle still exists.');
if (!css.includes('AiderLog v118 · compact course navigation and readable lessons')) throw new Error('Missing v118 Language Lab layout overrides.');
if (!adminApi.includes('const emails = await listEmails(auth)') || adminApi.includes('getFirestore')) throw new Error('Admin API is not email-only.');
if (pkg.name !== 'aiderlog-v118' || pkg.version !== '118.0.0') throw new Error('Unexpected package version.');
if (!sw.startsWith("const CACHE='aiderlog-v118-ui-interaction-layout';")) throw new Error('Unexpected service worker cache.');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`Duplicate IDs: ${duplicateIds.join(', ')}`);

console.log(`v118 scripts: ok; ${ids.length} unique ids; requested UI/data markers present`);
