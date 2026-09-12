const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const assets = path.resolve(__dirname, '../android-src/assets');
const read = name => fs.readFileSync(path.join(assets, name), 'utf8');
const css = read('app-fold-daily-v177.css');
const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = clean.match(new RegExp(escaped + '\\s*\\{([^}]+)\\}'));
  assert.ok(match, 'Missing fold rule: ' + selector);
  return match[1];
}

test('all daily Fold layout rules are app-scoped inside usable-space media queries', () => {
  assert.match(clean, /^\s*@layer appColour164\s*\{/);
  assert.equal((clean.match(/@media/g) || []).length, 2);
  assert.match(clean, /@media \(min-width:600px\) and \(min-height:480px\)/);
  assert.match(clean, /@media \(min-width:840px\) and \(min-height:480px\)/);
  const headers = clean.match(/[^{}]+(?=\{)/g).map(text => text.trim());
  for (const header of headers) {
    if (header.startsWith('@')) continue;
    assert.ok(header.startsWith('html body #app #') || header.startsWith('html body .daylog-tool-v165 ') || header.startsWith('html body .daylog-tool-v165[data-tool="focus"] '), header);
  }
  assert.doesNotMatch(clean, /\.view\b|#(?:home|insights|language|fifth)\b|\.on\b/);
});

test('layout is purely presentational and preserves fonts, colours and every existing control', () => {
  assert.doesNotMatch(clean, /[{;]\s*(?:font(?:-size|-family)?|color|background(?:-image)?|content|transform|animation|visibility|pointer-events|touch-action|position|z-index)\s*:/);
  assert.doesNotMatch(clean, /display\s*:\s*none|overflow\s*:\s*hidden|scroll-snap|[0-9]+(?:px|vh|dvh)\s*!important\s*;?\s*\/\*fixed/);
  assert.doesNotMatch(clean, /[{;]\s*(?:height:(?!auto)|max-height:)/);
  assert.doesNotMatch(clean, /\.event-editor|\.routine-detail|\.daylog-editor|\bform\b/);
});

test('Event uses two existing record columns and a full-width honest empty state', () => {
  assert.match(block('html body #app #event.event-ui-v164 :is(.record-grid,.archive-grid-v111,.travel-feed-v148)'), /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/);
  assert.match(block('html body #app #event.event-ui-v164 :is(.record-grid,.archive-grid-v111,.travel-feed-v148) > .event-empty-v111'), /grid-column:1 \/ -1!important/);
  for (const selector of ['record-grid', 'archive-grid-v111']) assert.ok(read('app-feature-v152b.js').includes(selector));
  assert.ok(read('event-ui-v164.js').includes('travel-feed-v148'));
});

test('Routine preserves selected panes and existing records while widening cards and statistics', () => {
  assert.match(block('html body #app #routine.routine-ui-v165 :is(.r165-practice-list,.r165-mandalas)'), /repeat\(2,minmax\(0,1fr\)\)/);
  const selector = 'html body #app #routine.routine-ui-v165 .r165-content[data-tab="statistics"]';
  assert.match(block(selector), /align-content:start!important/);
  assert.match(block(selector + ' > .r165-summary'), /grid-column:1 \/ -1!important/);
  assert.match(block(selector + ' > .r165-comparison'), /grid-row:2 \/ 4!important/);
  assert.match(block(selector + ' > .r165-stat-card:not(.r165-comparison)'), /grid-column:2!important/);
  const source = read('routine-ui-v165.js');
  for (const name of ['r165-practice-list', 'r165-mandalas', 'r165-summary', 'r165-comparison']) assert.ok(source.includes(name));
  assert.ok(source.includes("pane.dataset.tab=state.tab"));
  assert.ok(source.includes("['statistics',"), 'statistics tab ID still matches the selector');
});

test('DayLog health keeps meal/history on left and exercise on right without fixed heights', () => {
  const parent = 'html body #app #personal.daylog-ui-v165 .personal-health';
  assert.match(block(parent), /grid-template-rows:auto auto!important/);
  assert.match(block(parent + ' > .personal-panel:first-child'), /grid-column:1!important/);
  assert.match(block(parent + ' > .personal-panel:nth-child(2)'), /grid-column:2!important/);
  assert.match(block(parent + ' > .daylog-meal-history-v165'), /grid-row:2!important/);
  assert.match(block(parent + ' .meal-grid'), /repeat\(2,minmax\(0,1fr\)\)/);
  assert.ok(read('daylog-ui-v165.js').includes("health.append(history)"));
});

test('Reading pairs current book and quotes with library; workflow uses wide stages only when space allows', () => {
  assert.match(block('html body #app #personal.daylog-ui-v165 .reading-v113'), /grid-template-areas:"hero hero" "metrics metrics" "current library" "quotes library"!important/);
  const wide = clean.slice(clean.indexOf('@media (min-width:840px)'));
  assert.match(wide, /grid-template-columns:repeat\(3,minmax\(0,1fr\)\)!important/);
  assert.match(block('html body #app #personal.daylog-ui-v165 :is(.personal-health,.reading-v113,.workflow-board,.finance-grid) > *'), /min-width:0!important/);
});

test('focus remains a real timer and session list with two columns and a contained scroll surface', () => {
  const selector = 'html body .daylog-tool-v165 .pomo-workspace-v113';
  assert.match(block(selector), /grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)!important/);
  assert.match(block(selector), /grid-template-rows:auto!important/);
  assert.match(block(selector), /overscroll-behavior:contain!important/);
  assert.match(block(selector + ' > :is(.pomo-timer-v113,.pomo-history-v113)'), /min-width:0!important/);
  assert.ok(read('daylog-ui-v165.js').includes(".pomo-history-v113"));
});

test('focus width follows the unfolded viewport while leaving dialog height, scrolling and actions intact', () => {
  const width = block('html body .daylog-tool-v165[data-tool="focus"] > section');
  assert.match(width, /max-width:min\(920px,calc\(100vw - 32px\)\)!important/);
  assert.doesNotMatch(width, /(?:height|overflow|position|padding|margin|display|flex|border-radius):/);
  const base = read('daylog-ui-v165.css');
  assert.match(base, /\.daylog-tool-v165>section\s*\{[^}]*max-height:80%!important/);
  assert.match(base, /\.daylog-tool-v165 :is\(\.daylog-tool-body-v165,\.pomo-workspace-v113\)\s*\{[^}]*overflow:auto!important/);
});
