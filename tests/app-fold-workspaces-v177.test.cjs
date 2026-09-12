const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const assets = path.resolve(__dirname, '../android-src/assets');
const read = name => fs.readFileSync(path.join(assets, name), 'utf8');
const css = read('app-fold-workspaces-v177.css');
const plain = css.replace(/\/\*[\s\S]*?\*\//g, '');
function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = plain.match(new RegExp(escaped + '\\s*\\{([^}]+)\\}'));
  assert.ok(match, `missing fold rule: ${selector}`);
  return match[1];
}
const my = 'html body #fifth .my166';
const paper = 'html body #fifth .mp166-page ';
const consult = 'html body #fifth #consultAppV168 ';
const work = 'html body #fifth .cw168 ';

test('workspace adaptation is app scoped and only starts in an expanded window', () => {
  assert.match(plain, /^\s*@layer appColour164\s*\{/);
  assert.match(plain, /@media \(min-width:600px\) and \(min-height:480px\)/);
  assert.match(plain, /@media \(min-width:680px\) and \(min-height:480px\)/);
  const rules = [...plain.matchAll(/([^{}]+)\{([^{}]*)\}/g)];
  assert.ok(rules.length > 20);
  for (const [, selectors] of rules) {
    assert.match(selectors.trim(), /^html body #fifth /, selectors);
  }
  assert.doesNotMatch(plain, /@media[^{}]*(?:max-width|orientation|device-width)/);
});

test('My places the existing authorized groups side by side without inventing tools', () => {
  assert.match(block(my + '-scroll'), /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(block(my + '-group'), /max-width:none!important/);
  assert.match(block(my + '-group:only-child'), /grid-column:1\/-1/);
  const source = read('my-workspaces-v128.js');
  assert.match(source, /group\('연구 · 업무',research\)/);
  assert.match(source, /group\('학습 · 훈련',learning\)/);
  assert.match(source, /if \(canUsePaper\(\)\) research\.push/);
  assert.doesNotMatch(plain, /data-my128-open|visibility\s*:/);
});

test('Paper TODAY keeps the reading action left and recent notes right', () => {
  assert.match(block(paper + '.mp159-main:has(>.mp159-actions)'), /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(block(paper + '.mp159-main:has(>.mp159-actions)>:is(.mp159-hero,.mp159-empty)'), /grid-column:1!important/);
  assert.match(block(paper + '.mp159-main:has(>.mp159-actions)>.mp159-feed'), /grid-column:2!important/);
  assert.match(block(paper + '.mp159-paper-list'), /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(block(paper + '.mp159-paper-list>.mp159-empty'), /grid-column:1\/-1/);
});

test('Paper READ and REVIEW place existing evidence beside reading, not desktop authoring', () => {
  assert.match(block(paper + '.mp159-detail>[data-mp166-section^="summary-"]'), /grid-column:1/);
  assert.match(block(paper + '.mp159-detail>[data-mp166-section="evidence"]'), /grid-column:2/);
  assert.match(block(paper + '.mp159-detail>.mp159-progress'), /grid-column:1\/-1/);
  assert.match(block(paper + '.mp159-review-card>details'), /grid-column:2/);
  const source = read('mobile-paper-v159.js');
  assert.match(source, /data-mp166-section="summary-\$\{index\}"/);
  assert.match(source, /data-mp166-section="evidence"/);
  assert.doesNotMatch(plain, /design-studio|paper-workspace|desktop|position\s*:fixed/);
});

test('Consult retains existing filters, stage actions and detail records', () => {
  assert.match(block(consult + '.c167-content:has(>.c167-client-list)'), /display:grid!important/);
  assert.match(block(consult + '.c167-content:has(>.c167-client-list)>.c167-filters'), /grid-column:1/);
  assert.match(block(consult + '.c167-content>.c167-detail-body'), /grid-column:2/);
  assert.match(block(consult + '.c167-content>.c167-detail-tabs'), /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(block(consult + '.c167-stages>button'), /flex:1 0 30%/);
  const source = read('app-consult-work-v168.js');
  assert.match(source, /host\.id='consultAppV168'/);
  assert.match(source, /class="c167-detail-body"/);
});

test('Work shows existing list and selected detail together with only the mobile gate lifted', () => {
  assert.match(block(work + '.work-split-v167'), /grid-template-columns:minmax\(210px,\.82fr\) minmax\(0,1\.18fr\)/);
  assert.match(block(work + '.cw168-list-tools[hidden]'), /display:block!important/);
  assert.match(plain, /\.work-split-v167\.is-detail>\.work-list-v167,/);
  assert.match(block(work + '.work-split-v167:not(.is-detail)>.work-detail-v167'), /display:block!important/);
  assert.match(block(work + '.work-split-v167 .work-rows-v167'), /grid-template-columns:minmax\(0,1fr\)/);
  const hiddenRules = plain.match(/[^{}]+\[hidden\][^{}]*\{/g) || [];
  assert.equal(hiddenRules.length, 1);
  assert.match(hiddenRules[0], /\.cw168-list-tools\[hidden\]/);
  const source = read('app-consult-work-v168.js');
  assert.ok(source.includes('class="cw168-list-tools" ${state.mobileDetail?\'hidden\':\'\'}'));
  assert.match(source, /renderList\(\);renderDetail\(\)/);
});

test('Fold CSS does not modify fonts, colors, data, editors or scroll ownership', () => {
  assert.doesNotMatch(plain, /(?:^|[;{])\s*(?:font(?:-[\w-]+)?|color|background(?:-[\w-]+)?|line-height|height|max-height)\s*:/m);
  assert.doesNotMatch(plain, /(?:dialog|modal|form|editor|wheel|localStorage|Firebase|fetch|url\()/);
  assert.doesNotMatch(plain, /overflow(?:-y)?\s*:hidden/);
  assert.match(block(work + '.cw168-scroll'), /overflow:auto!important/);
  assert.match(block(work + '.cw168-scroll'), /overscroll-behavior:contain!important/);
});
