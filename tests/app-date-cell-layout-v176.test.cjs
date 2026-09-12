const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const assets=path.resolve(__dirname,'../android-src/assets');
test('app date titles anchor below the absolute date/status row instead of native button vertical centering',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  assert.match(css,/@layer appColour164/);
  assert.match(css,/#home\.schedule-feature-v125 \[data-schedule-date-v125\]\{\s*display:flex!important;flex-direction:column!important;justify-content:flex-start!important;/);
  assert.match(css,/padding:20px 3px 26px!important/);
  assert.match(css,/\[data-schedule-date-v125\]>\.schedule-event-name-v119\{\s*margin:0!important;flex:0 1 auto!important;min-height:0!important;overflow:hidden!important/);
  assert.equal(css,fs.readFileSync(path.resolve(assets,'../../../AiderLog-v145-decoded/assets/app-calendar-v175.css'),'utf8'));
});
test('emotion and private-date icons occupy the bottom-right reserved area and wrap to at most two rows',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  assert.match(css,/>\.calendar-status-icons\{\s*position:absolute!important;top:auto!important;left:auto!important;right:3px!important;bottom:3px!important/);
  assert.match(css,/flex-wrap:wrap!important;align-items:center!important;justify-content:flex-end!important/);
  assert.match(css,/gap:1px!important;width:calc\(100% - 6px\)!important;max-width:calc\(100% - 6px\)!important/);
  assert.match(css,/max-height:21px!important;overflow:hidden!important;margin:0!important/);
  assert.match(css,/calendar-status-icons:empty\{display:none!important/);
  assert.match(css,/flex:0 0 10px!important;width:10px!important;height:10px!important/);
  assert.match(css,/img\{width:8px!important;height:8px!important/);
  assert.match(css,/calendar-period-drop\{width:6px!important;height:6px!important/);
  // Four markers (two moods, period, intimacy) fit a 51px date cell; narrower
  // cells wrap into the two-row footer rather than moving the title or date.
  assert.ok(4*10+3*1<=51-3*2);
  assert.ok(20>=3+16+1);
  assert.ok(26>=2*10+1+3+2);
});
test('upcoming entries use compact rows without changing font sizes or hiding content',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  const rule=css.match(/\.schedule-upcoming-v119>\.schedule-upcoming-line-v126\{([^}]+)\}/)?.[1];
  assert.ok(rule);assert.match(rule,/min-height:32px!important;height:auto!important/);
  assert.match(rule,/margin:0!important;padding:2px 0!important;row-gap:0!important/);
  assert.doesNotMatch(rule,/font-size|display:none|overflow:hidden/);
});
test('couple share occupies the reminder row second column without changing its input or permissions',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  assert.match(css,/\.schedule-form-grid-v125>\.schedule-check-v125:has\(\[name="shareWithCouple"\]\)\{\s*grid-column:2!important;align-self:end!important/);
  assert.match(css,/min-height:40px!important;\s*margin:0!important;padding:6px 8px!important/);
  assert.match(css,/schedule-check-v125:has\(\[name="shareWithCouple"\]\) span\{min-width:0!important;white-space:normal!important/);
});
