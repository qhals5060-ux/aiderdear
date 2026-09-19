const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, 'android-src/assets', name), 'utf8');
const css = read('app-record-footers-v176.css');
const declarations = css.replace(/\/\*[\s\S]*?\*\//g, '');
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
  assert.ok(read('index.html').includes('./app-record-footers-v176.css?v=179'));
  const shell=vm.runInNewContext(read('sw.js')+';[...APP_SHELL]',{URL,self:{location:{href:'https://app.invalid/sw.js'},addEventListener(){}}});
  for(const query of ['', '?v=179'])assert(shell.includes('./app-record-footers-v176.css'+query));
});

test('Schedule Save/X stay in the header while deletion remains a full-bleed body action', () => {
  const source=read('feature-system-v125.js'),form=source.slice(source.indexOf('  function ensureScheduleDialogV125'),source.indexOf('  function openScheduleV125'));
  const header=form.slice(form.indexOf('<header'),form.indexOf('</header>'));
  assert.match(header,/data-schedule-dialog-close-v125/);assert.match(header,/type="submit" form="appScheduleFormV179"/);assert.match(header,/data-private-header-v179/);
  const footer=form.slice(form.indexOf('<div class="schedule-dialog-actions-v125"'),form.indexOf('</form>'));
  assert.match(footer,/data-schedule-delete-v125/);assert.doesNotMatch(footer,/type="submit"|>취소<|>감정</);
});

test('removed emotion entry cannot be recreated by the private-calendar schedule integration', () => {
  const source=read('private-calendar-ui-v175.js');assert.doesNotMatch(source,/AiderAppEmotionV176|openEmotionFromSchedule|emotion\.addEventListener/);
  const editor=read('schedule-editor-v179.css');assert.match(editor,/schedule-dialog-actions-v125:not\(:has\(button:not\(\[hidden\]\)\)\)/);
});

test('private day actions are underlined header links in the same high-priority app theme layer', () => {
  const editor=read('schedule-editor-v179.css');const layer=editor.slice(editor.indexOf('@layer appColour164'));
  assert.match(layer,/\[data-private-schedule-kind\][^]*background:transparent!important[^]*border:0!important[^]*box-shadow:none!important/);
  assert.match(layer,/font-size:11px!important;text-decoration:underline!important/);assert.doesNotMatch(layer,/position:(fixed|absolute)/);
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
