const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const native=fs.readFileSync(path.join(root,'android-src/assets/feature-system-v125.js'),'utf8');
const site=fs.readFileSync(path.join(root,'index.html'),'utf8');
const line=(source,name)=>source.split('\n').find(row=>row.includes('function '+name+'('));
const functionBody=(name,end)=>native.slice(native.indexOf('  '+name),native.indexOf('  '+end));
function scheduleFixture(){
  let rows=[],user={uid:'u1',email:'owner@example.test'},writes=0,shares=0,closes=0,renders=0;const status={textContent:''},submit={disabled:false};
  const form={dataset:{openedActorUidV179:'u1',openedExistingIdV179:''},elements:{id:{value:''}},closest:()=>({querySelector:()=>submit}),querySelector:()=>status};
  const values={title:'방문',date:'2026-09-19',time:'16:15',endTime:'16:45',recordScope:'schedule',reminderMinutes:'-1'};
  const context={window:{AiderFriendScheduleUIV175:{share:async()=>{shares++;}},AiderPrivateCalendarUIV175:{scheduleOpened(){}}},Date,Math,FormData:class{constructor(){ }get(name){return name==='id'?form.elements.id.value:values[name]||'';}},currentUser:()=>user,currentState:()=>({pair:{id:'pair'}}),receivedScheduleV176:row=>!!row.friendShared||!!row.authorUid&&row.authorUid!==user.uid,scheduleRowsV125:()=>rows,baseScheduleRowsV125:()=>rows,scheduleSelectedV125:'2026-09-19',scheduleViewV176:{focus:()=>({anchor:new Date()})},persistScheduleV125:async()=>{writes++;},closeScheduleV125:()=>{closes++;},renderScheduleV125:()=>{renders++;},cancelNativeReminderV136(){},syncNativeReminderV136(){},alert:message=>{context.alerts.push(message)},alerts:[]};
  vm.createContext(context);vm.runInContext(line(native,'editableScheduleV179')+'\n'+line(native,'scheduleDraftIdentityV179')+'\n'+functionBody('async function saveScheduleV125','async function deleteScheduleV125')+';globalThis.save=saveScheduleV125;globalThis.editable=editableScheduleV179;',context);
  return{context,form,values,status,submit,get rows(){return rows},set rows(value){rows=value},get user(){return user},set user(value){user=value},get counts(){return{writes,shares,closes,renders}},save:()=>context.save({preventDefault(){},currentTarget:form})};
}
test('12-hour presentation leaves storage untouched and has no all-day prefix',()=>{
  const context={};vm.runInNewContext(fs.readFileSync(path.join(root,'schedule-time-v179.js'),'utf8'),context);const time=context.AiderScheduleTimeV179;
  for(const [input,expected] of [['00:00','12시'],['01:00','1시'],['12:00','12시'],['16:15','4시 15분'],['23:59','11시 59분'],['24:00','']])assert.equal(time.format(input),expected);
  assert.equal(time.format({allDay:true,time:'10:30'}),'');const rows=[{id:'pm',date:'2026-09-19',time:'16:00'},{id:'all',date:'2026-09-19',allDay:true},{id:'am',date:'2026-09-19',time:'04:00'}],before=JSON.stringify(rows),result=time.entries(rows);assert.equal(JSON.stringify(rows),before);assert.deepEqual(Array.from(result,row=>[row.row.id,row.separatorBefore]),[['all',false],['am',false],['pm',true]]);assert.equal(time.entries([{date:'2026-09-19',time:'10:00'},{date:'2026-09-20',time:'14:00'}])[1].separatorBefore,false);
});
test('app edit guard permits own personal schedule, never incoming or source-owned business data',()=>{
  const f=scheduleFixture(),own={id:'own',authorUid:'u1',authorEmail:'owner@example.test'};assert(f.context.editable(own));assert(f.context.editable({...own,shareWithCouple:true,owner:'shared'}));
  for(const extra of [{authorUid:'u2'},{authorEmail:'partner@example.test'},{friendShared:true},{readOnly:true},{externalSource:'google'},{projectionSource:'consult'},{calendarScope:'estate'},{category:'work'},{isHoliday:true},{isBirthday:true}])assert.equal(f.context.editable({...own,...extra}),false,JSON.stringify(extra));
});
test('app update/delete controls are single header Save/X and one title all-day checkbox',()=>{
  const html=functionBody('function ensureScheduleDialogV125','function syncScheduleScopeV148');assert.equal((html.match(/data-schedule-dialog-close-v125 aria-label/g)||[]).length,1);assert.equal((html.match(/type="submit"/g)||[]).length,1);assert.match(html,/form="appScheduleFormV179"/);assert.match(html,/name="allDay" type="checkbox">종일/);assert.doesNotMatch(html,/>취소<|name="workAssignee"|name="clientId"/);assert.match(html,/data-schedule-delete-v125/);
  const siteForm=site.slice(site.indexOf('<!-- Schedule editor -->'),site.indexOf('<!-- Calendar import -->'));assert.equal((siteForm.match(/id="eventAllDay"/g)||[]).length,1);assert.equal((siteForm.match(/id="saveEvent"/g)||[]).length,1);assert.match(siteForm,/form="scheduleForm" id="saveEvent"/);
});
test('app saves selected all-day explicitly and preserves 24-hour timed values',async()=>{
  const timed=scheduleFixture();await timed.save();assert.equal(timed.rows[0].time,'16:15');assert.equal(timed.rows[0].allDay,false);assert.equal(timed.rows[0].isAiderDear,true);assert.equal(timed.counts.closes,1);
  const full=scheduleFixture();full.values.allDay='on';await full.save();assert.equal(full.rows[0].time,'');assert.equal(full.rows[0].endTime,'');assert.equal(full.rows[0].allDay,true);
  const missing=scheduleFixture();missing.values.time='';await missing.save();assert.equal(missing.rows.length,0);assert.match(missing.context.alerts[0],/종일/);
});

test('v180 app header places compact Save before X and Couple/Friends checkboxes in one scoped row',()=>{
  const html=functionBody('function ensureScheduleDialogV125','function syncScheduleScopeV148');
  assert.match(html,/<button type="submit" form="appScheduleFormV179" class="primary">저장<\/button><button type="button" data-schedule-dialog-close-v125/);
  assert.match(html,/<div class="schedule-share-options-v180"[^>]*>[\s\S]*name="shareWithCouple"[^>]*><span>커플<\/span><\/label><label[^>]*><input name="shareWithFriends"[^>]*><span>친구<\/span><\/label><\/div>/);
  const css=fs.readFileSync(path.join(root,'schedule-editor-v179.css'),'utf8');
  assert.match(css,/html body \.schedule-dialog-v125 \.schedule-share-options-v180[^}]*display:flex!important[^}]*flex-wrap:nowrap!important/);
  assert.match(css,/html body \.schedule-dialog-v125 \.schedule-editor-primary-v179 button[^}]*height:30px!important[^}]*font-size:12px!important/);
  assert.doesNotMatch(site,/schedule-share-options-v180|name="shareWithFriends"/);
});
test('app friend sharing failure keeps the same editable draft ID and retry never duplicates the event',async()=>{
  const f=scheduleFixture();f.context.window.AiderFriendScheduleUIV175.share=async()=>{throw Error('공유 저장 실패')};await f.save();assert.equal(f.rows.length,1);const id=f.form.elements.id.value;assert(id);assert.match(f.status.textContent,/공유 저장 실패/);assert.equal(f.counts.closes,0);assert.equal(f.submit.disabled,false);
  f.context.window.AiderFriendScheduleUIV175.share=async()=>{};await f.save();assert.equal(f.rows.length,1);assert.equal(f.rows[0].id,id);assert.equal(f.counts.closes,1);
});
test('app saving prevents duplicate submissions and edits an existing own schedule',async()=>{
  const f=scheduleFixture();let resolve;f.context.persistScheduleV125=()=>new Promise(yes=>{resolve=yes});const first=f.save();await Promise.resolve();await f.save();assert.equal(f.rows.length,1);assert.equal(f.submit.disabled,true);resolve();await first;f.context.persistScheduleV125=async()=>{};f.values.title='변경한 제목';await f.save();assert.equal(f.rows.length,1);assert.equal(f.rows[0].title,'변경한 제목');
});

test('guest saves are blocked before mutation and preserve the complete editable draft',async()=>{
  const f=scheduleFixture();f.user=null;f.form.dataset.openedActorUidV179='';const before=JSON.stringify(f.values);await f.save();
  assert.deepEqual(f.counts,{writes:0,shares:0,closes:0,renders:0});assert.equal(f.rows.length,0);assert.equal(JSON.stringify(f.values),before);assert.match(f.status.textContent,/로그인 후/);
});

test('open form is bound to its original actor; account-switch save and delete cannot target matching IDs',async()=>{
  const f=scheduleFixture();f.rows=[{id:'same',authorUid:'u2',title:'other account'}];f.form.elements.id.value='same';f.form.dataset.openedExistingIdV179='same';f.user={uid:'u2',email:'other@example.test'};const before=JSON.stringify(f.rows),draft=JSON.stringify(f.values);await f.save();
  assert.equal(f.counts.writes,0);assert.equal(f.counts.shares,0);assert.equal(f.counts.closes,0);assert.equal(JSON.stringify(f.rows),before);assert.equal(JSON.stringify(f.values),draft);assert.match(f.status.textContent,/로그인 계정이 변경/);
  f.context.$=()=>f.form;f.context.confirm=()=>{throw Error('cross-account delete must not reach confirmation');};
  vm.runInContext(functionBody('async function deleteScheduleV125','function openDdayV125')+';globalThis.remove=deleteScheduleV125;',f.context);await f.context.remove();assert.equal(JSON.stringify(f.rows),before);assert.equal(f.counts.writes,0);
  assert.match(functionBody('function openScheduleV125','function editableScheduleV179'),/form\.dataset\.openedActorUidV179=String\(currentUser\(\)\?\.uid\|\|''\)/);
});

test('an existing record removed during editing is never resurrected as a new schedule',async()=>{
  for(const id of ['deleted','']){const f=scheduleFixture();f.form.elements.id.value=id;f.form.dataset.openedExistingIdV179='deleted';const draft=JSON.stringify(f.values);await f.save();assert.equal(f.rows.length,0);assert.equal(f.counts.writes,0);assert.equal(f.counts.closes,0);assert.equal(JSON.stringify(f.values),draft);assert.match(f.status.textContent,/삭제되었거나/);}
});

test('returning to the original account permits a blocked new draft without changing its inputs',async()=>{
  const f=scheduleFixture(),before=JSON.stringify(f.values);f.user={uid:'other',email:'other@example.test'};await f.save();assert.equal(f.rows.length,0);f.user={uid:'u1',email:'owner@example.test'};await f.save();assert.equal(f.rows.length,1);assert.equal(f.rows[0].authorUid,'u1');assert.equal(JSON.stringify(f.values),before);assert.equal(f.counts.closes,1);
});
test('received event cannot be submitted or exported; both app writes and friend sharing stay Firebase-only',async()=>{
  const f=scheduleFixture();f.rows=[{id:'incoming',friendShared:true,authorUid:'u2',title:'받은 일정'}];f.form.elements.id.value='incoming';await f.save();assert.equal(f.counts.writes,0);assert.equal(f.counts.shares,0);
  const persist=functionBody('async function persistScheduleV125','function syncNativeReminderV136');assert.match(persist,/writeScheduleData/);assert.doesNotMatch(persist,/google|fetch|calendarSyncRequest/i);
  const sharing=fs.readFileSync(path.join(root,'friend-schedule-firebase-v175.js'),'utf8');assert.doesNotMatch(sharing,/googleapis|calendarSyncRequest|listGoogleCalendar|createGoogleEvent/);
  const context={currentUserEmail:'owner@example.test',currentUser:'owner@example.test',firebaseState:{user:{uid:'u1'}},normalizeEmail:value=>String(value||'').toLowerCase()};vm.createContext(context);vm.runInContext(line(site,'canEditEvent')+';globalThis.edit=canEditEvent;',context);assert.equal(context.edit({isAiderDear:true,friendShared:true,authorEmail:'owner@example.test'}),false);assert.equal(context.edit({isAiderDear:true,authorUid:'u2',authorEmail:'owner@example.test'}),false);
  const submit=site.slice(site.indexOf("$('#scheduleForm').addEventListener('submit'"),site.indexOf("$('#deleteEvent').addEventListener"));assert.match(submit,/if\(id\)\{[^\n]*!canEditEvent\(old\)[^\n]*else if\(\$\('#eventGoogleCalendar'\)\.value\)/);assert.match(submit,/saveEvent'\)\.disabled\)return/);
});
