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
const testSource = `${engine.slice(0, storageIndex)}function normalizeSpeech(text){return String(text).replace(/\\s/g, '').toLowerCase();}\nreturn { buildCurriculum, levelProfiles, CORE_UNIT_COUNT, LESSONS_PER_UNIT, CORE_LESSON_COUNT };\n};`;
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(testSource, sandbox);
const courseApi = sandbox.window.initAiderLogLanguageLab(null, null);

const expectedLevels = {
  en: [['입문', 'Pre-A1'], ['기초', 'A1–A2'], ['독립', 'B1–B2'], ['고급', 'C1'], ['숙련', 'C2+']],
  ja: [['입문', 'Pre-N5'], ['기초', 'N5–N4'], ['독립', 'N3'], ['고급', 'N2–N1'], ['숙련', 'N1+']],
  zh: [['입문', 'Pre-HSK 1'], ['기초', 'HSK 1–3'], ['독립', 'HSK 4'], ['고급', 'HSK 5–6'], ['숙련', 'HSK 6+']],
};
const exactBeginnerFirstUnit = {
  en: ["Hi, I'm Min.", 'Nice to meet you.', 'Where are you from?', "I'm from Korea.", 'What do you do?'],
  ja: ['こんにちは。', 'はじめまして。', 'わたしは ミンです。', 'かんこくから きました。', 'よろしく おねがいします。'],
  zh: ['你好。', '我叫敏。', '我是韩国人。', '很高兴认识你。', '你呢？'],
};
const forbidden = ['관계없는 뜻', '등장하지 않는다', '단어 순서를 바꾸어도', '조사를 바꾸어도', 'Can,do'];
const categoryIds = ['core', 'labs', 'review'];

if (courseApi.CORE_UNIT_COUNT !== 8 || courseApi.LESSONS_PER_UNIT !== 6 || courseApi.CORE_LESSON_COUNT !== 48) {
  throw new Error('The core course is not 8 UNIT × 6 Lesson = 48 Lesson.');
}

for (const language of ['en', 'ja', 'zh']) {
  const firstSentences = [];
  const profiles = courseApi.levelProfiles[language];
  expectedLevels[language].forEach(([name, standard], index) => {
    if (profiles[index].name !== name || profiles[index].standard !== standard) {
      throw new Error(`${language} level ${index + 1}: expected ${name} · ${standard}.`);
    }
  });

  for (let level = 0; level < 5; level += 1) {
    const curriculum = courseApi.buildCurriculum(language, level);
    if (curriculum.map(item => item.id).join('|') !== categoryIds.join('|')) {
      throw new Error(`${language} level ${level + 1}: learning paths are not CORE/LAB/REVIEW.`);
    }
    for (const category of curriculum) {
      if (category.topics.length !== 8) throw new Error(`${language} level ${level + 1} ${category.id}: expected 8 units.`);
      for (const unit of category.topics) {
        if (unit.days.length !== 6) throw new Error(`${language} level ${level + 1} ${category.id}/${unit.tab}: expected 6 lessons.`);
      }
    }

    const core = curriculum[0];
    const allCoreLessons = core.topics.flatMap(unit => unit.days);
    if (allCoreLessons.length !== 48) throw new Error(`${language} level ${level + 1}: expected 48 core lessons.`);
    const ids = curriculum.flatMap(category => category.topics.flatMap(unit => unit.days.map(day => day.id)));
    if (new Set(ids).size !== ids.length) throw new Error(`${language} level ${level + 1}: duplicate lesson IDs.`);
    firstSentences.push(allCoreLessons[0].studySentence);

    for (const day of allCoreLessons) {
      if (!day.coach?.canDo || !day.quiz?.prompt) throw new Error(`${day.id}: CAN-DO or quiz prompt missing.`);
      if (day.quiz.options.length !== 4 || day.quiz.options.filter(option => option.correct).length !== 1) {
        throw new Error(`${day.id}: quiz must have 4 choices and exactly one answer.`);
      }
      if (day.quiz.alternatives.length !== 5) throw new Error(`${day.id}: expression network must have 5 functions.`);
      const linkForms = day.quiz.alternatives.map(item => item.form).filter(Boolean);
      if (linkForms.length !== 5 || new Set(linkForms).size !== 5) throw new Error(`${day.id}: expression network forms must be present and distinct.`);
      const text = JSON.stringify({ canDo: day.coach.canDo, quiz: day.quiz });
      if (forbidden.some(fragment => text.includes(fragment))) throw new Error(`${day.id}: contains a legacy artificial choice.`);
    }

    if (level === 0) {
      const firstFive = core.topics[0].days.slice(0, 5).map(day => day.studySentence);
      if (JSON.stringify(firstFive) !== JSON.stringify(exactBeginnerFirstUnit[language])) {
        throw new Error(`${language}: beginner first-meeting sequence does not match the authored course.`);
      }
      for (const day of core.topics[0].days) {
        if (!day.scriptGuide?.reading) throw new Error(`${language} beginner ${day.id}: script/reading support missing.`);
      }
    }
  }
  if (new Set(firstSentences).size !== 5) throw new Error(`${language}: five levels still begin with duplicate content.`);
}
console.log('curriculum: 3 languages × 5 levels × 3 paths × 8 units × 6 lessons ok');

const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
if (duplicates.length) throw new Error(`Duplicate IDs: ${duplicates.join(', ')}`);

for (const marker of [
  '학습 경로와 UNIT 선택',
  '핵심 장면 → 응답 → 변형 → 듣기·발음 → 확장 → 종합 미션',
  '/ 48 Lesson',
  'id="level-guide"',
]) {
  if (!template.includes(marker)) throw new Error(`Missing v114 template marker: ${marker}`);
}
for (const marker of [
  'const CORE_UNIT_COUNT = 8',
  'const LESSONS_PER_UNIT = 6',
  'const curatedFirstMeetingUnits',
  'function unitExpressionLinks',
  '표현 연결망 · 같은 의도 안에서만 연결',
]) {
  if (!engine.includes(marker)) throw new Error(`Missing v114 engine marker: ${marker}`);
}
for (const marker of ['AiderLog v114', '.quiz-prompt', '.course-panel .scenario-tab em']) {
  if (!style.includes(marker)) throw new Error(`Missing v114 style marker: ${marker}`);
}

for (const marker of ['content="v114"', 'language-lab-v18-engine.js?v=114', 'language-lab-v18.js?v=114']) {
  if (!html.includes(marker)) throw new Error(`Missing v114 HTML marker: ${marker}`);
}
if (!component.includes('language-lab-v18-template.html?v=114') || !component.includes('language-lab-v18.css?v=114')) {
  throw new Error('Language Lab assets are not cache-busted to v114.');
}
if (pkg.name !== 'aiderlog-v114' || pkg.version !== '114.0.0') throw new Error('Unexpected package version.');
if (!serviceWorker.startsWith("const CACHE='aiderlog-v114-language-course-rebuild';")) {
  throw new Error('Unexpected v114 service worker cache key.');
}

const shellAssets = [...serviceWorker.matchAll(/'\.\/([^']+)'/g)].map(match => match[1]);
const missing = shellAssets.filter(asset => !fs.existsSync(asset));
if (missing.length) throw new Error(`Missing service worker assets: ${missing.join(', ')}`);

console.log(`ids: ${ids.length} unique`);
console.log(`service worker assets: ${shellAssets.length} present`);
console.log('v114 communicative curriculum, course selector, and layout: ok');
