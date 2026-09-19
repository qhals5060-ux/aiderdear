const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const assets=path.resolve(__dirname,'../android-src/assets');
test('app date titles anchor below the absolute date/status row instead of native button vertical centering',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v179.css'),'utf8');
  assert.match(css,/@layer appColour164/);
  assert.match(css,/#home\.schedule-feature-v125 \.schedule-day-v119\s*\{display:flex!important;flex-direction:column!important;justify-content:flex-start!important;/);
  assert.match(css,/padding:20px 2px 12px!important/);
  assert.match(css,/\.schedule-event-name-v119\s*\{display:block!important;flex:none!important;width:100%!important;margin:0!important/);
});
test('remaining period/relationship icons use a compact lower-right area without invading the date',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v179.css'),'utf8');
  assert.match(css,/\.calendar-status-icons\s*\{right:2px!important;bottom:2px!important;height:9px!important;gap:2px!important/);
  assert.match(css,/\.calendar-status-icon\s*\{width:8px!important;height:9px!important;font-size:8px!important;min-width:8px!important/);
  assert.match(css,/padding:20px 2px 12px!important/);assert(2*8+2<=45-4);assert(12>=9+2);
});
test('upcoming entries form a compact scroll strip on Flip and a grid in the Fold side pane',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v179.css'),'utf8');
  assert.match(css,/\.schedule-upcoming-v179\s*\{display:flex;gap:5px;overflow-x:auto/);assert.match(css,/background:none!important;box-shadow:none!important/);
  assert.match(css,/min-height:32px!important;min-width:76px;max-width:125px;flex:0 0 auto/);
  assert.match(css,/@media \(min-width:600px\) and \(min-height:480px\)/);assert.match(css,/\.schedule-summary-v179\s*\{grid-column:2;grid-row:1/);assert.match(css,/\.schedule-upcoming-v179\s*\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});
test('couple share occupies the reminder row second column without changing its input or permissions',()=>{
  const css=fs.readFileSync(path.join(assets,'schedule-editor-v179.css'),'utf8');
  assert.match(css,/\[data-app-friend-slot-v179\]\{grid-column:auto!important/);
  const source=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8');assert.match(source,/name="reminderMinutes"[\s\S]*?data-app-friend-slot-v179[\s\S]*?name="shareWithCouple"/);assert.match(source,/shareWithCouple.disabled=!editable\|\|!currentState\(\).pair/);
});
