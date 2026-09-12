const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const sharedContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'shared-schedule-v176.js'),'utf8'),sharedContext);const shared=sharedContext.window.AiderSharedScheduleV176;
const source=fs.readFileSync(path.join(root,'android-src/assets/feature-system-v125.js'),'utf8');
const user={uid:'u1',email:'owner@example.test'};
const incoming={id:'received',date:'2026-09-12',title:'받은 일정',time:'08:00',friendShared:true,authorUid:'u2',sourceColor:'#ff0000'};
const outgoing={id:'outgoing',date:'2026-09-12',title:'내 공유 일정',time:'09:00',shareWithCouple:true,authorUid:'u1'};
const business={id:'business',date:'2026-09-12',title:'업무 일정',time:'10:00',projectionSource:'work',readOnly:true,sourceColor:'#123456'};
function fixture(){
  class FixedDate extends Date{constructor(...args){super(...(args.length?args:[Date.parse('2026-09-12T03:00:00Z')]));}}
  const rows=[incoming,outgoing,business],context={Date:FixedDate,window:{AiderSharedScheduleV176:shared},currentUser:()=>user,SCHEDULE_CATEGORY:{other:['기타','#456789']},safe:String,scheduleRowsV125:()=>rows,scheduleSelectedV125:'2026-09-12',dateKey:value=>`${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}`,eventSpansDateV125:(row,key)=>row.date===key};
  vm.runInNewContext(fs.readFileSync(path.join(root,'android-src/assets/app-calendar-view-v176.js'),'utf8'),context);
  context.scheduleViewV176=context.window.AiderAppCalendarViewV176.create(null,()=>new FixedDate());
  const functions=source.match(/  function receivedScheduleV176[^\n]+/)[0]+'\n'+source.match(/  function eventColorV125[^\n]+/)[0];
  vm.createContext(context);vm.runInContext(functions+'\n'+source.slice(source.indexOf('  function scheduleCellsV125'),source.indexOf('  function renderScheduleV125')),context);return context;
}
test('app event colour and upcoming colour both distinguish received from outgoing shares',()=>{
  const context=fixture();assert.equal(context.eventColorV125(incoming),'#B58B00');assert.equal(context.eventColorV125(outgoing),'#456789');assert.equal(context.eventColorV125(business),'#123456');
  const upcoming=context.scheduleUpcomingV125();assert.match(upcoming,/schedule-upcoming-line-v126 schedule-received-v176[^>]+data-schedule-edit-v125="received"[^>]+--owner-color:#B58B00/);
  assert.match(upcoming,/class="uprow schedule-upcoming-line-v126"[^>]+data-schedule-edit-v125="outgoing"[^>]+--owner-color:var\(--theme-primary\)/);
  assert.match(upcoming,/aria-label="상대가 공유한 일정 · 받은 일정"/);
});
test('app calendar first event, dots, and day detail list expose incoming ownership consistently',()=>{
  const context=fixture(),cells=context.scheduleCellsV125(2026,8);assert.match(cells,/schedule-event-name-v119 schedule-received-v176/);assert.match(cells,/class="schedule-received-v176" style="--event-color:#B58B00"/);assert.match(cells,/aria-label="상대가 공유한 일정 · 받은 일정"/);
  const line=source.split('\n').find(row=>row.includes("$('[data-schedule-day-list-v125]',overlay).innerHTML=rows.map"));assert(line);
  context.rows=[incoming,outgoing,business];vm.runInContext('globalThis.dayList='+line.slice(line.indexOf('rows.map')),context);
  assert.match(context.dayList,/article class="schedule-item-v125 schedule-received-v176" aria-label="상대가 공유한 일정 · 받은 일정"/);
  assert.match(context.dayList,/data-schedule-list-edit-v125="business">보기/);assert.doesNotMatch(context.dayList,/schedule-received-v176[^>]+업무 일정/);
});
test('app schedule entry initializes private dates only after editable/read-only fields are resolved',()=>{
  const code=source.slice(source.indexOf('  function openScheduleV125'),source.indexOf('  function closeScheduleV125'));
  assert(code.indexOf('scheduleOpened()')>code.indexOf("overlay.classList.add('on')"));assert(code.indexOf('scheduleOpened()')>code.indexOf('row?.readOnly'));
  assert.match(code,/if\(projected\)\{closeScheduleV125\(\);window\.AiderBusinessCalendarV175\?\.open\(projected\);return\}/);
  assert.doesNotMatch(source,/row\.owner==='shared'\|\|row\.shareWithCouple\?'#D67796'/);
});
