const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'android-src/assets/feature-system-v125.js'),'utf8');
test('upcoming items target the date grid, not the editor',()=>{
  const render=source.slice(source.indexOf('  function scheduleUpcomingV125'),source.indexOf('  function ',source.indexOf('  function scheduleUpcomingV125')+3));
  assert.match(render,/data-schedule-jump-v180/);assert.doesNotMatch(render,/data-schedule-edit-v125/);
});
test('upcoming selection changes month/date then focuses a date without editing or changing data',()=>{
  const body=source.slice(source.indexOf('  function jumpToScheduleV180'),source.indexOf('  function bindScheduleV125'));
  const rows=[{id:'other-month',date:'2026-10-12',readOnly:true}],calls=[];
  const ctx={scheduleRowsV125:()=>rows,scheduleSelectedV125:'2026-09-19',scheduleCursorV125:null,
    scheduleViewV176:{focus(date){calls.push(['month',date]);return {anchor:date}}},
    renderScheduleV125(){calls.push(['render'])},requestAnimationFrame(fn){fn()},
    home:{querySelector(selector){calls.push(['cell',selector]);return {
      focus(opts){calls.push(['focus',opts.preventScroll])},
      scrollIntoView(opts){calls.push(['scroll',opts.block])}
    }}}
  };
  vm.runInNewContext(body+';jumpToScheduleV180("other-month");',ctx);
  assert.equal(ctx.scheduleSelectedV125,'2026-10-12');assert.equal(ctx.scheduleCursorV125,'2026-10-12');
  assert.deepEqual(calls,[['month','2026-10-12'],['render'],['cell','[data-schedule-date-v125="2026-10-12"]'],['focus',true],['scroll','nearest']]);
  assert.equal(rows[0].readOnly,true);calls.length=0;vm.runInNewContext('jumpToScheduleV180("missing");',ctx);assert.equal(calls.length,0);
});
