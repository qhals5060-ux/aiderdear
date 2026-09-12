const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assets=path.resolve(__dirname,'../android-src/assets');
const source=fs.readFileSync(path.join(assets,'app-calendar-view-v176.js'),'utf8');
function fixture(saved){const window={},storage={getItem:()=>saved,setItem:(key,value)=>saved=value};vm.runInNewContext(source,{window,Date});return {api:window.AiderAppCalendarViewV176.create(storage,()=>new Date(2026,8,12,12)),window,storage,saved:()=>saved};}
test('new app uses exactly two full weeks, including today, with Sunday start',()=>{const range=fixture().api.current();assert.equal(range.mode,'fortnight');assert.equal(range.count,14);assert.equal(range.keys[0],'2026-09-06');assert.equal(range.keys[13],'2026-09-19');assert.equal(new Set(range.keys).size,14);});
test('W toggles month and fortnight and restores only the presentation preference',()=>{const f=fixture();assert.equal(f.api.toggle('2026-09-12').count,42);assert.equal(f.saved(),'month');const reloaded=f.window.AiderAppCalendarViewV176.create(f.storage,()=>new Date(2026,8,12));assert.equal(reloaded.current().mode,'month');assert.equal(reloaded.toggle('2026-09-12').count,14);});
test('two-week arrows cross month and year boundaries without overlaps or missing dates',()=>{const f=fixture();f.api.focus('2026-12-31');const before=f.api.current(),after=f.api.move(1);assert.equal(before.keys[0],'2026-12-27');assert.equal(before.keys[13],'2027-01-09');assert.equal(after.keys[0],'2027-01-10');assert.equal(f.api.move(-1).keys[0],before.keys[0]);});
test('month arrows do not overflow short months and toggling stays in the browsed month',()=>{const f=fixture('month');f.api.focus('2026-01-31');assert.equal(f.api.move(1).anchor.getMonth(),1);const range=f.api.toggle('2026-09-12');assert.equal(range.anchor.getMonth(),1);assert.equal(range.keys[0],'2026-02-01');});
test('Today and saved date focus work in either view without changing the preferred mode',()=>{const f=fixture('month');f.api.focus('2027-04-06');assert.equal(f.api.today().anchor.getFullYear(),2026);assert.equal(f.api.current().mode,'month');f.api.toggle();assert.ok(f.api.focus('2028-02-29').keys.includes('2028-02-29'));});
test('denied local storage or invalid preference never blocks the calendar',()=>{const window={};vm.runInNewContext(source,{window,Date});const api=window.AiderAppCalendarViewV176.create({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}});assert.equal(api.current().count,14);assert.equal(api.toggle().count,42);assert.equal(fixture('unsafe').api.current().count,14);});
test('actual feature startup reaches the calendar when storage access or its font read is denied',()=>{
  const feature=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8'),start=feature.indexOf('  const featurePreviewV125='),end=feature.lastIndexOf('})();');assert(start>=0&&end>start);
  for(const denial of['access','read']){
    const calls=[],context={URLSearchParams,location:{search:''},THEME_KEY:'aiderlogTheme',PREVIEW_THEME_V126:'',PREVIEW_FONT_V134:'',P:{settings:{}},document:{readyState:'complete'},currentTheme:()=> 'system',applyTheme:()=>calls.push('theme'),applyFontSize:(value,persist)=>calls.push(['font',value,persist]),bindProfileSettings:()=>calls.push('profile'),applyFixedWheelV125:()=>calls.push('wheel'),renderScheduleV125:()=>calls.push('calendar'),refreshV125:()=>calls.push('refresh')};
    if(denial==='access')Object.defineProperty(context,'localStorage',{get(){throw Error('SecurityError')}});else context.localStorage={getItem(){throw Error('storage denied')}};
    assert.doesNotThrow(()=>vm.runInNewContext(feature.slice(start,end),context),denial);assert.deepEqual(calls,['theme',['font','normal',false],'profile','wheel','calendar','refresh']);
  }
});
test('safe font startup retains preview then cloud then saved preference precedence',()=>{
  const feature=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8'),start=feature.indexOf("  let savedFontV176='';"),end=feature.indexOf('  bindProfileSettings();',start);assert(start>=0&&end>start);
  for(const [preview,cloud,saved,expected] of[['small','normal','large','small'],['','small','large','small'],['','','large','large'],['','','','normal']]){
    let actual;vm.runInNewContext(feature.slice(start,end),{PREVIEW_FONT_V134:preview,P:{settings:{fontSize:cloud}},localStorage:{getItem:()=>saved},applyFontSize:value=>actual=value});assert.equal(actual,expected);
  }
});
test('actual app renderer shows six ordered event previews in fortnight and one in month',()=>{
  const feature=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8');
  const render=feature.slice(feature.indexOf('  function scheduleCellsV125'),feature.indexOf('  function scheduleUpcomingV125'));
  const f=fixture(),rows=Array.from({length:7},(_,i)=>({id:String(i),date:'2026-09-12',time:`${String(9+i).padStart(2,'0')}:00`,title:i===0?'<unsafe>':'일정 '+i}));
  const context={Date,scheduleViewV176:f.api,scheduleSelectedV125:'2026-09-12',dateKey:d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,scheduleRowsV125:()=>rows,eventSpansDateV125:(r,k)=>r.date===k,receivedScheduleV176:()=>false,eventColorV125:()=> '#6255e8',safe:s=>String(s).replace(/</g,'&lt;').replace(/>/g,'&gt;')};
  vm.runInNewContext(render+'; result=scheduleCellsV125(2026,8);',context);assert.equal((context.result.match(/data-schedule-date-v125=/g)||[]).length,14);assert.equal((context.result.match(/<small class="schedule-event-name-v119/g)||[]).length,6);assert.match(context.result,/schedule-more-v176">\+1/);assert.ok(context.result.includes('&lt;unsafe&gt;'));assert.ok(!context.result.includes('<unsafe>'));
  f.api.toggle();vm.runInNewContext('result=scheduleCellsV125(2026,8)',context);assert.equal((context.result.match(/data-schedule-date-v125=/g)||[]).length,42);assert.equal((context.result.match(/<small class="schedule-event-name-v119/g)||[]).length,1);
});
test('fortnight time and title have separate lines without forcing line breaks in monthly view',()=>{
  const feature=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8'),css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  assert.match(feature,/class="schedule-event-time-v176"/);assert.match(feature,/class="schedule-event-title-v176"/);
  assert.match(css,/data-calendar-view-v176="fortnight"\] \.schedule-event-title-v176\{display:block!important/);
  assert.match(css,/schedule-event-time-v176:empty\{display:none!important/);
});
test('W is app-only, accessible, two-row layout; module is loaded before the owning renderer',()=>{
  const feature=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8'),html=fs.readFileSync(path.join(assets,'index.html'),'utf8'),css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  assert.match(feature,/data-calendar-view-v176 aria-label=/);assert.match(feature,/aria-pressed="\$\{range.mode==='fortnight'\}"/);assert.match(feature,/>W<\/button>/);assert.doesNotMatch(feature,/data-schedule-emotion-v125/);assert.match(feature,/scheduleViewV176.toggle\(scheduleSelectedV125\);renderScheduleV125\(\)/);assert.match(feature,/scheduleViewV176.focus\(row.date\)/);
  assert.ok(html.indexOf('src="./app-calendar-view-v176.js')<html.indexOf('src="./feature-system-v125.js'));
  assert.match(css,/data-calendar-view-v176="fortnight".*\.schedule-days-v119\{grid-template-rows:repeat\(2,minmax\(0,1fr\)\)!important/);
  assert.doesNotMatch(fs.readFileSync(path.resolve(assets,'../../index.html'),'utf8'),/src="\.\/app-calendar-view-v176.js/);
  assert.equal(source,fs.readFileSync(path.resolve(assets,'../../../AiderLog-v145-decoded/assets/app-calendar-view-v176.js'),'utf8'));
});
