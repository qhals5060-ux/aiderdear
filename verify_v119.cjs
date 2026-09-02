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
  'content="v119"',
  'language-lab-v18-engine.js?v=119',
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
  'grid-template-rows:76px 76px',
  '#privateLanguageFrame:before{display:block',
  'id="travelRecordAdd"',
  'id="travelHistoryAdd"',
  'id="travelWantOpen"',
  'id="travelRecordShelfOpen"',
  'id="travelFeedModal"',
  'id="travelPlanFields"',
  'id="travelRecordFields"',
  '<span>A</span><small>LL</small>',
  'id="consultingMajorAdd"',
  'id="consultingClientUniversityYears"',
  'id="consultingClientMilitaryStatus"',
  'id="intakeMajorAdd"',
  "fetch('/api/admin-users?v=119'",
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
  if (html.includes(removed)) throw new Error(`Removed v119 markup still present: ${removed}`);
});

['icon: "기본"', 'icon: "실전"', 'icon: "확장"', 'U${item.unitNumber', '<button class="day-action'].forEach(marker => {
  if (!engine.includes(marker)) throw new Error(`Missing v119 course marker: ${marker}`);
});
if (template.includes('학습 경로와 UNIT 선택')) throw new Error('Removed Course Select subtitle still exists.');
if (!css.includes('AiderLog v119 · aligned lessons and a shorter course rail')) throw new Error('Missing v119 Language Lab layout overrides.');
if (!adminApi.includes('const emails = await listEmails(auth)') || adminApi.includes('getFirestore')) throw new Error('Admin API is not email-only.');
if (pkg.name !== 'aiderlog-v119' || pkg.version !== '119.0.0') throw new Error('Unexpected package version.');
if (!sw.startsWith("const CACHE='aiderlog-v119-routine-language-travel';")) throw new Error('Unexpected service worker cache.');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`Duplicate IDs: ${duplicateIds.join(', ')}`);

console.log(`v119 scripts: ok; ${ids.length} unique ids; requested UI/data markers present`);
