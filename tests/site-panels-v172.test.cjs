'use strict';
// Non-browser contract regression. Visual dimensions/scrolling need browser QA.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const script = fs.readFileSync(path.join(root, 'site-panels-v172.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'site-panels-v172.css'), 'utf8');
const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const checks = [];
function test(name, run) { run(); checks.push(name); }

function harness({bridge = '', android = false, search = ''} = {}) {
  const attrs = new Map(), classes = new Set(android ? ['aiderlog-android'] : ['modern-site']);
  const events = new Map(); let writes = 0;
  const html = {
    classList: {contains: value => classes.has(value)},
    hasAttribute: key => attrs.has(key),
    setAttribute(key, value) { writes++; attrs.set(key, value); },
    removeAttribute(key) { writes++; attrs.delete(key); }
  };
  const window = {addEventListener(name, listener) {
    assert(!events.has(name), `no duplicate ${name} listener`); events.set(name, listener);
  }};
  if (bridge) window[bridge] = {};
  const document = {documentElement: html};
  const location = {search};
  const context = vm.createContext({window, document, location, URLSearchParams, Object});
  const run = () => vm.runInContext(script, context);
  run();
  return {window, attrs, classes, events, location, run, get writes() { return writes; }};
}

// Parse this stylesheet's ordinary style rules and media blocks. Deliberately
// reject unbalanced braces/unknown at-rules rather than silently skipping them.
const rules = [];
function parseRules(source, media = '') {
  let at = 0;
  while (at < source.length) {
    while (/\s/.test(source[at] || '') && at < source.length) at++;
    if (at === source.length) break;
    const open = source.indexOf('{', at);
    assert(open >= 0, 'every CSS rule has a body');
    const selector = source.slice(at, open).trim();
    let depth = 1, close = open + 1;
    while (depth && close < source.length) {
      if (source[close] === '{') depth++;
      if (source[close] === '}') depth--;
      close++;
    }
    assert.equal(depth, 0, 'balanced CSS blocks');
    const body = source.slice(open + 1, close - 1).trim();
    if (selector.startsWith('@media')) parseRules(body, selector);
    else {
      assert(!selector.startsWith('@'), 'no import/keyframe/font-face side effects');
      assert(!body.includes('{'), 'plain declaration body');
      rules.push({selector, body, media});
    }
    at = close;
  }
}
parseRules(css.replace(/\/\*[\s\S]*?\*\//g, ''));
function rule(selector, media = '') {
  const found = rules.find(row => row.selector.endsWith(selector) && row.media === media);
  assert(found, `missing rule: ${selector} ${media}`);
  return found.body;
}
function declaration(body, name, value) {
  const actual = body.split(';').map(item => item.trim()).find(item => item.startsWith(name + ':'));
  assert.equal(actual, `${name}:${value}`);
}
function inlineFunction(name) {
  const start = index.indexOf(`function ${name}(`);
  assert(start >= 0, `${name} renderer exists`);
  // Both production renderers are intentionally single-line functions.
  return index.slice(start, index.indexOf('\n', start)).trim();
}
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

test('website attaches one presentation marker', () => {
  const h = harness();
  assert.equal(h.attrs.get('data-site-panels-v172'), '');
  assert.equal(h.writes, 1);
  assert(Object.isFrozen(h.window.AiderLogSitePanelsV172));
});
for (const options of [{bridge:'AiderLogNative'}, {bridge:'Android'}, {android:true}, {search:'?android-preview=1'}, {search:'?android-preview'}]) {
  test(`native guard: ${JSON.stringify(options)}`, () => {
    const h = harness(options);
    assert.equal(h.writes, 0);
    assert.equal(h.window.AiderLogSitePanelsV172, undefined);
    assert.equal(h.events.size, 0);
  });
}
test('ordinary website query remains enabled', () => assert.equal(harness({search:'?v=172'}).writes, 1));
test('repeated load/refresh and edition switches do not mutate live DOM', () => {
  const h = harness(), instance = h.window.AiderLogSitePanelsV172;
  for (let i = 0; i < 20; i++) { h.run(); instance.refresh(); }
  h.classes.delete('modern-site');
  h.events.get('aiderlog-site-editionchange')();
  h.classes.add('modern-site');
  h.events.get('aiderlog-site-editionchange')();
  assert.equal(h.writes, 1);
  assert.equal(h.events.size, 1);
  assert.equal(h.window.AiderLogSitePanelsV172, instance);
});
test('late native transition removes the website marker', () => {
  const h = harness();
  h.window.AiderLogNative = {};
  h.events.get('aiderlog-site-editionchange')();
  assert.equal(h.attrs.size, 0);
  h.window.AiderLogSitePanelsV172.refresh();
  assert.equal(h.writes, 2);
});
test('no data writes, network, folder duplication, timer or observation loop', () => {
  assert(!/MutationObserver|ResizeObserver|requestAnimationFrame|setInterval|setTimeout|fetch\s*\(|XMLHttpRequest|localStorage|sessionStorage|AiderDearFirebase|innerHTML|outerHTML|cloneNode|appendChild|createElement|\.click\s*\(/.test(script));
  assert.equal((script.match(/addEventListener\(/g) || []).length, 1);
  assert(!/addEventListener\(['"](?:click|input|change|submit)/.test(script));
});
test('every CSS selector requires Modern, website marker and Android exclusion', () => {
  assert(rules.length > 30);
  for (const {selector} of rules) {
    // Commas inside :is() are not selector-list boundaries.
    for (const branch of selector.split(/,\s*(?=html\.)/)) {
      assert(branch.startsWith('html.modern-site[data-site-panels-v172]:not(.aiderlog-android) body '), branch);
    }
  }
  assert(!/url\(|@import|\b(?:zoom|scale|transform)\s*:/.test(css));
});
test('routine uses the saved cycle range and four genuine metric values', () => {
  const stats = {counts:{MAX:8,MORE:3,MINI:2,SKIP:1},cycle:{range:'9.1. ~ 9.20.',cycleDays:20,cycleIndex:2},practice:13,completion:65,maxCount:8,streak:4};
  const context = vm.createContext({routineStats: () => stats, routineStatusClass: k => k.toLowerCase(), routineDonutGradient: () => 'conic-gradient(red 40%,gray 0)', escapeHtml});
  vm.runInContext(inlineFunction('renderRoutineStats'), context);
  const output = vm.runInContext('renderRoutineStats({icon:"✨"})', context);
  assert(output.includes('<b>이번 회차 습관 통계</b><span>9.1. ~ 9.20.</span>'));
  for (const [label, value] of [['총 실천일',13],['완료율',65],['MAX 달성',8],['연속 기록',4]]) {
    assert(output.includes(`<span>${label}</span><b>${value}<small>`));
  }
  assert(output.includes('conic-gradient(red 40%,gray 0)'));
  assert(!vm.runInContext('renderRoutineStats(null)', context).includes('routine-donut'));
});
test('routine date is inline, donut grows 78→112 px, compact metrics keep four columns', () => {
  declaration(rule('.modern-routine-current .routine-card-head'), 'flex-direction', 'row!important');
  declaration(rule('.modern-routine-current .routine-donut'), 'width', '112px!important');
  declaration(rule('.modern-routine-current .routine-donut'), 'height', '112px!important');
  declaration(rule('.modern-routine-current .routine-stat-summary'), 'grid-template-columns', 'repeat(4,minmax(0,1fr))');
  declaration(rule('.modern-routine-current .routine-stat-summary > div'), 'padding', '7px 3px');
  declaration(rule('.modern-routine-current .routine-stat-summary b'), 'font-size', '17px!important');
});
test('routine cards align bottoms and stack without a fixed height on narrow screens', () => {
  declaration(rule('.modern-routine-current'), 'align-items', 'stretch');
  declaration(rule('.modern-routine-current > .routine-stat-card'), 'height', 'auto!important');
  declaration(rule('.modern-routine-current > .routine-stat-card'), 'align-self', 'stretch');
  declaration(rule('.modern-routine-current', '@media (max-width:900px)'), 'grid-template-columns', 'minmax(0,1fr)');
});
test('Record/Album/Archive/Travel headings use real DOM and are larger/visible', () => {
  for (const token of ['class="record-heading"','id="albumHeading"','class="event-heading">Archive','class="event-heading">Travel']) assert(index.includes(token));
  declaration(rule('#recordStage :is(.record-heading,.album-heading,.event-title-group)'), 'display', 'block!important');
  declaration(rule('#recordStage :is(.record-heading h2,#albumHeading,.event-heading)'), 'font-size', '24px!important');
  declaration(rule('#recordStage :is(.record-heading h2,#albumHeading,.event-heading)', '@media (max-width:767px)'), 'font-size', '22px!important');
});
test('Travel rail and all existing create/select/delete targets remain native controls', () => {
  for (const id of ['travelFrame','travelReviewGrid','travelFolderTabs','travelFolderAdd']) {
    assert.equal((index.match(new RegExp(`id="${id}"`, 'g')) || []).length, 1, id);
  }
  assert(index.includes("$('#travelFolderTabs').addEventListener('click'"));
  assert(index.includes("const button=e.target.closest('[data-travel-folder]')"));
  assert(index.includes("e.target.closest('[data-travel-folder-delete]')"));
  assert(index.includes("$('#travelFolderAdd').addEventListener('click',openTravelFolderCreator)"));
  declaration(rule('#travelFrame .travel-bottom-dock'), 'grid-column', '2');
  declaration(rule('#travelFrame .travel-bottom-dock'), 'overflow', 'auto!important');
  declaration(rule('#travelFolderTabs'), 'grid-template-columns', 'minmax(0,1fr)');
});
test('Travel renderer preserves real IDs, counts, folder color/name and deletion button', () => {
  const host = {innerHTML:''};
  const context = vm.createContext({$: () => host, getTravelFolders: () => [{id:'trip-1',name:'제주 <가족>',color:'#C7D8D0'}], visibleEventRows: () => [{category:'travel',folderId:'trip-1'},{category:'book'}], activeTravelFolder:'trip-1',normalizeTravelFolderColor: x => x,travelFolderPeriod: () => '9.1. ~ 9.3.',escapeHtml});
  vm.runInContext(inlineFunction('renderTravelFolders'), context);
  vm.runInContext('renderTravelFolders()', context);
  assert(host.innerHTML.includes('data-travel-folder="trip-1"'));
  assert(host.innerHTML.includes('data-travel-folder-delete="trip-1"'));
  assert(host.innerHTML.includes('제주 &lt;가족&gt;'));
  assert(host.innerHTML.includes('--folder-color:#C7D8D0'));
  assert(host.innerHTML.includes('<small>9.1. ~ 9.3.</small><b>1</b>'));
  assert(host.innerHTML.includes('travel-folder-select active'));
});
test('empty Travel renderer does not fabricate folders or records', () => {
  const host = {innerHTML:''};
  const context = vm.createContext({$: () => host,getTravelFolders: () => [],visibleEventRows: () => [],activeTravelFolder:'all'});
  vm.runInContext(inlineFunction('renderTravelFolders'), context);
  vm.runInContext('renderTravelFolders()', context);
  assert(host.innerHTML.includes('ALL TRIPS'));
  assert(host.innerHTML.includes('<b>0</b>'));
  assert(!host.innerHTML.includes('data-travel-folder-delete'));
});
test('mobile Travel folder rail is before records and no panel clips the stacked layout', () => {
  const media = '@media (max-width:767px)';
  declaration(rule('#travelFrame > .travel-content', media), 'grid-template-columns', 'minmax(0,1fr)!important');
  declaration(rule('#travelFrame > .travel-content', media), 'overflow', 'visible!important');
  declaration(rule('#travelFrame .travel-bottom-dock', media), 'grid-row', '1');
  declaration(rule('#travelReviewGrid', media), 'grid-row', '2');
  declaration(rule('#travelFolderTabs', media), 'overflow-x', 'auto!important');
  declaration(rule('#travelReviewGrid', '@media (max-width:420px)'), 'grid-template-columns', 'minmax(0,1fr)!important');
});
test('Pomodoro font changes are confined to its box, preserving timer control IDs', () => {
  declaration(rule('#personalStage .pomodoro-mini-card'), '--site-type-control', '12px');
  declaration(rule('#personalStage .pomodoro-mini-card :is(span,b,label)'), 'font-size', '11px!important');
  declaration(rule('#personalStage .pomodoro-mini-card #pomodoroClock'), 'font-size', '16px!important');
  for (const id of ['pomodoroTaskName','pomodoroCustomMinutes','pomodoroCustomApply','pomodoroStart','pomodoroReset']) assert(index.includes(`id="${id}"`));
  for (const row of rules.filter(row => row.selector.includes('#personalStage'))) assert(row.selector.includes('.pomodoro-mini-card'));
});
test('Consult page and body-level dialog share Modern teal and neutral tokens', () => {
  const theme = rule('body .c167-dialog');
  declaration(theme, '--c167-accent', 'var(--modern-primary,#335d5b)');
  declaration(theme, '--c167-bg', 'var(--modern-surface,#fff)');
  declaration(theme, '--c167-line', 'var(--modern-border,#dde2e0)');
  declaration(rule('body .c167-dialog form > footer button[type=submit]'), 'background', 'var(--modern-primary,#335d5b)!important');
  declaration(rule('body .c167-dialog :focus-visible'), 'outline', '3px solid var(--modern-primary,#335d5b)!important');
  assert(!rules.some(row => /c167-warning|c167-live|c167-dialog output/.test(row.selector)), 'semantic warning/error colors remain distinguishable');
});
console.log(JSON.stringify({ok:true,count:checks.length,checks,scope:'non-browser VM/render/stylesheet contracts; pixel alignment and real scrolling are verified separately'}, null, 2));
