const fs = require('fs');
const vm = require('vm');

const read = path => fs.readFileSync(path, 'utf8');
const html = read('index.html');
const engine = read('language-lab-v18-engine.js');
const component = read('language-lab-v18.js');
const template = read('language-lab-v18-template.html');
const style = read('language-lab-v18.css');
const serviceWorker = read('sw.js');
const pkg = JSON.parse(read('package.json'));

[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(Boolean)
  .forEach((source, index) => {
    new Function(source);
    console.log(`inline-script-${index + 1}: ok`);
  });
new Function(component);
new Function(engine);
console.log('language lab scripts: ok');

const storageIndex = engine.indexOf('const STORAGE_KEY');
if (storageIndex < 0) throw new Error('Language Lab test boundary not found.');
const testSource = `${engine.slice(0, storageIndex)}function normalizeSpeech(text){return String(text).replace(/\\s/g, '').toLowerCase();}\nreturn { buildCurriculum, levelProfiles, courseOrderByLevel, coursePhraseSets, CORE_DAY_COUNT, CORE_WEEK_COUNT };\n};`;
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(testSource, sandbox);
const courseApi = sandbox.window.initAiderLogLanguageLab(null, null);
for (const language of ['en', 'ja', 'zh']) {
  const firstSentences = [];
  for (let level = 0; level < 5; level += 1) {
    const curriculum = courseApi.buildCurriculum(language, level);
    const core = curriculum.find(category => category.id === 'core');
    const labs = curriculum.find(category => category.id === 'labs');
    const review = curriculum.find(category => category.id === 'review');
    if (core?.topics?.[0]?.days?.length !== 84) throw new Error(`${language} level ${level + 1}: core day count is not 84.`);
    if (labs?.topics?.length !== 12) throw new Error(`${language} level ${level + 1}: situation lab count is not 12.`);
    if (review?.topics?.[0]?.days?.length !== 12) throw new Error(`${language} level ${level + 1}: checkpoint count is not 12.`);
    const first = core.topics[0].days[0];
    const last = core.topics[0].days[83];
    firstSentences.push(first.studySentence);
    if (!first.internalBand.endsWith('A') || !last.internalBand.endsWith('B')) throw new Error(`${language} level ${level + 1}: internal A/B band progression failed.`);
    if (level === 0 && !first.scriptGuide?.reading) throw new Error(`${language}: beginner script guide missing.`);
    if (first.quiz.alternatives.length !== 4) throw new Error(`${language} level ${level + 1}: expression network is incomplete.`);
  }
  if (new Set(firstSentences).size !== 5) throw new Error(`${language}: the five visible levels still start with duplicate sentences.`);
}
if (!engine.includes('{ minutes: 20, label: "20분" }') || !engine.includes('{ days: 30, label: "30일" }')) throw new Error('Review intervals are not 20 minutes through 30 days.');
console.log('course generation: 3 languages × 5 levels × 84 days ok');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);

for (const marker of [
  'content="v113"',
  'language-lab-v18-engine.js?v=113',
  'language-lab-v18.js?v=113',
]) {
  if (!html.includes(marker)) throw new Error(`Missing v113 HTML marker: ${marker}`);
}

for (const marker of [
  'const CORE_DAY_COUNT = 84',
  'const CORE_WEEK_COUNT = 12',
  'const courseOrderByLevel',
  'const elementaryPhraseSets',
  'bands: ["1A", "1B"]',
  'bands: ["5A", "5B"]',
  'const beginnerScriptGuides',
  'function contextualizeLearningPoint',
  '상대가 자연스럽게 할 수 있는 응답',
  '같은 장면을 이어가는 다음 말',
  'const REVIEW_INTERVALS',
  '{ minutes: 20, label: "20분" }',
  'data-immediate-review',
]) {
  if (!engine.includes(marker)) throw new Error(`Missing v113 engine marker: ${marker}`);
}

for (const marker of [
  '본 학습 12–15분 · 빠른 회상 2분 · 저녁 복습 5분',
  'SMART REVIEW · 20분·1·3·7·14·30일',
  '/ 84 코어',
]) {
  if (!template.includes(marker)) throw new Error(`Missing v113 template marker: ${marker}`);
}

for (const marker of ['.script-guide-card', '.immediate-review-button', '.day-page-controls']) {
  if (!style.includes(marker)) throw new Error(`Missing v113 style marker: ${marker}`);
}

if (!component.includes('language-lab-v18-template.html?v=113') || !component.includes('language-lab-v18.css?v=113')) {
  throw new Error('Language Lab assets are not cache-busted to v113.');
}
if (pkg.name !== 'aiderlog-v113' || pkg.version !== '113.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v113-language-core-spaced-recall';")) {
  throw new Error('Unexpected v113 service worker cache key.');
}

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map(match => match[1]);
const missing = shellAssets.filter(asset => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v113 84-day course, script support, and spaced recall: ok');
