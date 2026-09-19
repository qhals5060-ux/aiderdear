const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assets=path.resolve(__dirname,'../android-src/assets');
const feature=fs.readFileSync(path.join(assets,'feature-system-v125.js'),'utf8');
const render=feature.slice(feature.indexOf('  function scheduleCellsV125'),feature.indexOf('  function scheduleUpcomingV125'));
const safe=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
function draw(rows,mode='month'){
  const ctx={Date,scheduleViewV176:{current:()=>({mode,start:new Date(2026,8,19),count:1})},scheduleSelectedV125:'2026-09-19',dateKey:()=> '2026-09-19',scheduleRowsV125:()=>rows,eventSpansDateV125:(r,k)=>r.date===k,receivedScheduleV176:r=>!!r.shared,eventColorV125:()=> '#6255e8',safe};
  vm.runInNewContext(render+'; result=scheduleCellsV125(2026,8);',ctx);return ctx.result;
}
const row=(i,extra={})=>({id:String(i),date:'2026-09-19',time:`${String(9+i).padStart(2,'0')}:00`,title:`일정 ${i}`,...extra});
test('month renders three ordered records from the same loaded day without changing stored data',()=>{
  const rows=[row(2),row(0),row(1)],before=JSON.stringify(rows),html=draw(rows);
  assert.equal((html.match(/class="schedule-event-name-v119/g)||[]).length,3);
  assert.ok(html.indexOf('09:00')<html.indexOf('10:00'));assert.ok(html.indexOf('10:00')<html.indexOf('11:00'));
  assert.equal(JSON.stringify(rows),before);assert.doesNotMatch(html,/class="schedule-more-v176"/);
});
test('extra events are counted in both modes and day remains openable for the full list',()=>{
  const rows=Array.from({length:9},(_,i)=>row(i));
  for(const [mode,limit] of [['month',3],['fortnight',6]]){
    const html=draw(rows,mode);assert.equal((html.match(/class="schedule-event-name-v119/g)||[]).length,limit);
    assert.ok(html.includes(`aria-label="일정 ${9-limit}개 더 보기">+${9-limit}`));
    assert.match(html,/data-schedule-date-v125="2026-09-19"/);assert.equal(rows.length,9);
  }
});
test('own, shared and read-only business records all remain visible; missing times and titles stay safe',()=>{
  const html=draw([row(0,{allDay:true,time:'',title:'<비공개>'}),row(1,{shared:true,title:'친구 일정'}),row(2,{source:'consult',readOnly:true,title:'상담'})]);
  for(const text of ['종일','&lt;비공개&gt;','친구 일정','상담','상대가 공유한 일정'])assert.ok(html.includes(text),text);
  assert.doesNotMatch(html,/<비공개>/);
});
test('empty dates render no fake events and unrelated days do not affect overflow count',()=>{
  const html=draw([row(0,{date:'2026-09-20'})]);assert.doesNotMatch(html,/class="schedule-event-name-v119|class="schedule-more-v176"/);
});
test('monthly previews have their own compact nonshrinking style and retain bottom-right status markers',()=>{
  const css=fs.readFileSync(path.join(assets,'app-calendar-v175.css'),'utf8');
  assert.match(css,/data-calendar-view-v176="month"\] \.schedule-event-name-v119\{\s*display:block!important;flex:0 0 auto!important/);
  assert.match(css,/font-size:var\(--type-xs,9px\)!important;line-height:1\.2!important/);
  assert.match(css,/right:3px!important;bottom:3px!important/);
});
