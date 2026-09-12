const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'android-src/assets', name), 'utf8');
const css = read('app-record-footers-v176.css');
const declarations = css.replace(/\/\*[\s\S]*?\*\//g, '');
const emotionForm = 'html body .emotion-dialog-v119 > section > form[data-emotion-form-v119]';
const privateActions = 'html body #privateCalendarDialogV175 #privateCalendarEntryV175 > .private-calendar-entry-actions';
function block(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(escaped + '\\s*\\{([^}]+)\\}'));
  assert.ok(match, `missing selector: ${selector}`);
  return match[1];
}

test('schedule keeps one scrolling body and full-bleed actions inside the original form', () => {
  assert.match(block('html body .schedule-dialog-v125 .schedule-dialog-body-v125'), /padding:11px 0 0!important/);
  const form = block('html body .schedule-dialog-v125 .schedule-form-v125');
  assert.match(form, /padding:0 12px!important/);
  assert.match(form, /overflow:visible!important/);
  const footer = block('html body .schedule-dialog-v125 .schedule-dialog-actions-v125');
  assert.match(footer, /width:calc\(100% \+ 24px\)!important/);
  assert.match(footer, /margin:8px -12px 0!important/);
  assert.match(footer, /padding:9px 12px max\(9px,env\(safe-area-inset-bottom\)\)!important/);
  assert.ok(read('index.html').includes('./app-record-footers-v176.css?v=176'));
  assert.ok(read('sw.js').includes("'./app-record-footers-v176.css','./app-record-footers-v176.css?v=176'"));
});

test('emotion actions span the exact form padding and remove the bottom gap', () => {
  assert.match(block(emotionForm), /padding:16px 16px 0!important/);
  const footer = block(emotionForm + ' > footer');
  assert.match(footer, /width:calc\(100% \+ 32px\)!important/);
  assert.match(footer, /margin:8px -16px 0!important/);
  assert.match(footer, /max-width:none!important/);
  assert.match(footer, /padding:12px 16px max\(12px,env\(safe-area-inset-bottom\)\)!important/);
  assert.match(footer, /bottom:0!important/);
  assert.match(footer, /flex-wrap:wrap!important/);
});

test('emotion remains scrollable without a reserved scrollbar edge strip', () => {
  assert.match(block(emotionForm), /overflow-y:auto!important/);
  assert.match(block(emotionForm), /overflow-x:hidden!important/);
  assert.match(block(emotionForm), /overscroll-behavior:contain!important/);
  assert.match(block(emotionForm), /scrollbar-width:none!important/);
  assert.ok(css.includes(emotionForm + '::-webkit-scrollbar'));
});

test('private date action surface is full bleed but never covers the following records', () => {
  const actions = block(privateActions);
  assert.match(actions, /width:calc\(100% \+ 36px\)!important/);
  assert.match(actions, /margin:12px -18px 0!important/);
  assert.match(actions, /padding:12px 18px!important/);
  assert.match(actions, /position:static!important/);
  assert.doesNotMatch(actions, /\b(?:bottom|top|height|z-index):/);
  assert.doesNotMatch(declarations, /#privateCalendarSettingsV175|#privateCalendarListV175/);
});

test('existing full-width editors only receive a palette-following action surface', () => {
  const surfaces = [
    '#event.event-ui-v164 #eventEditorFormV111 > .event-editor-actions-v111',
    '.daylog-editor-v165 form > footer',
    '#routine.routine-ui-v165 .routine-editor-v111 #routineEditorFormV111 > .routine-detail-actions',
    '.c167-dialog.cw168-sheet > form > footer',
    '.cw168-sheet .work-form-v167 > footer'
  ];
  const palette = css.slice(css.indexOf('@layer appColour164'));
  for (const selector of surfaces) assert.ok(palette.includes(selector), selector);
  assert.match(palette, /background:var\(--app-editor-foot,var\(--app-control,var\(--app-surface\)\)\)!important/);
  assert.match(palette, /background-image:none!important/);
  assert.doesNotMatch(palette, /(?:width|height|padding|margin|position):/);
  assert.doesNotMatch(declarations, /r165-goal-card|work-pager-v167|c167-section/);
});

test('Work retains its established 18px full-bleed correction exactly once', () => {
  const work = read('app-consult-work-v168.css');
  assert.match(work, /\.cw168-sheet \.work-form-v167\{[^}]*padding:15px 18px 0/);
  assert.match(work, /\.cw168-sheet \.work-form-v167>footer\{[^}]*margin:0 -18px/);
  assert.match(block('html body .cw168-sheet .work-form-v167'), /scrollbar-width:none!important/);
  assert.doesNotMatch(block('html body .cw168-sheet .work-form-v167'), /(?:^|[;\s])(?:margin|padding|width):/);
});

test('footer patch preserves app type scale, form behavior and chosen theme', () => {
  assert.doesNotMatch(declarations, /(?:font(?:-size|-family|-weight)?|line-height|--app-[\w-]+)\s*:/);
  assert.doesNotMatch(declarations, /(?:pointer-events|visibility|opacity|transform|content)\s*:/);
  assert.doesNotMatch(declarations, /#[0-9a-f]{3,8}\b|\brgba?\(/i);
  assert.doesNotMatch(declarations, /position:(?:fixed|absolute)/);
});
