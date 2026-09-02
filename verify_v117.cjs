const fs = require('fs');

const read = file => fs.readFileSync(file, 'utf8');
const html = read('index.html');
const engine = read('language-lab-v18-engine.js');
const component = read('language-lab-v18.js');
const firebase = read('firebase-app.js');
const rules = read('firestore.rules');
const adminApi = read('api/admin-users.mjs');
const css = read('language-lab-v18.css');
const pkg = JSON.parse(read('package.json'));
const sw = read('sw.js');

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(Boolean)
  .forEach(source => new Function(source));
new Function(engine);
new Function(component);

const requiredHtml = [
  'content="v117"',
  'language-lab-v18-engine.js?v=117',
  'calendar-status-icons',
  'calendar-more-count',
  '꾸준한 루틴',
  "pomodoroMode==='focus'?'🍅'",
  'id="consultingClientAdditionalMajors"',
  'id="consultingClientDoubleMajor"',
  'id="consultingClientMinor"',
  'id="intakeAdditionalMajors"',
  'admin-email-list',
  "fetch('/api/admin-users?v=117'",
];
requiredHtml.forEach(marker => {
  if (!html.includes(marker)) throw new Error(`Missing v117 HTML marker: ${marker}`);
});

['전체 달성률', '가장 꾸준한 루틴', '＋ EXTERNAL LINK'].forEach(removed => {
  if (html.includes(removed)) throw new Error(`Removed copy still present: ${removed}`);
});
if (engine.includes('<small>${escapeHtml(day.sessionLabel')) throw new Error('Lesson pill markup still exists.');
if (!css.includes('AiderLog v117 · final compact lesson/card allocation')) throw new Error('Missing final Language Lab layout overrides.');
if (!firebase.includes('개인 정보와 진학 희망 학년도·학기를 모두 입력해주세요.')) throw new Error('Client intake validation was not updated.');
if (!rules.includes("'currentMajor', 'targetUniversity', 'targetMajor'")) throw new Error('Existing external intake rule compatibility is missing.');
if (!adminApi.includes('const emails = await listEmails(auth)') || adminApi.includes('getFirestore')) throw new Error('Admin API is not email-only.');
if (pkg.name !== 'aiderlog-v117' || pkg.version !== '117.0.0') throw new Error('Unexpected package version.');
if (!sw.startsWith("const CACHE='aiderlog-v117-ui-data-fixes';")) throw new Error('Unexpected service worker cache.');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicateIds.length) throw new Error(`Duplicate IDs: ${duplicateIds.join(', ')}`);

console.log(`v117 scripts: ok; ${ids.length} unique ids; requested UI/data markers present`);
