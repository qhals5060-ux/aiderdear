const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const context={window:{}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../shared-schedule-v176.js'),'utf8'),context);
const {isReceived,color}=context.window.AiderSharedScheduleV176;
const user={uid:'owner-a',email:'A@example.com'};
test('incoming friend and couple schedules receive forsythia styling',()=>{
  for(const flag of [{friendShared:true},{shareWithCouple:true},{owner:'shared'},{owner:'partner'}])assert.equal(isReceived({...flag,authorUid:'owner-b',authorEmail:'b@example.com'},user),true);
});
test('outgoing own shared schedules keep their own colour',()=>{
  for(const owner of [{authorUid:user.uid},{authorEmail:' a@EXAMPLE.com '},{authorUid:user.uid,authorEmail:'b@example.com'}])assert.equal(isReceived({...owner,owner:'shared',shareWithCouple:true,friendShared:true},user),false);
});
test('guest, unknown, ordinary imported and business schedules are not incoming shares',()=>{
  assert.equal(isReceived({owner:'partner'},null),false);
  assert.equal(isReceived({owner:'shared'},user),false);
  assert.equal(isReceived({authorUid:'owner-b',externalSource:'google'},user),false);
  for(const calendarScope of ['work','consult','consulting','estate','business'])assert.equal(isReceived({calendarScope,owner:'shared',authorUid:'owner-b'},user),false);
  assert.equal(isReceived({projectionSource:'work',owner:'shared',authorUid:'owner-b'},user),false);
});
test('legacy partner records and source colour precedence stay explicit',()=>{
  assert.equal(isReceived({owner:'partner'},user),true);
  assert.equal(color({owner:'shared',authorUid:'owner-b',sourceColor:'#0000FF'},user,'#0000FF'),'#B58B00');
  assert.equal(color({owner:'shared',authorUid:user.uid},user,'#123456'),'#123456');
});
test('visual classification never mutates a saved event',()=>{
  const row=Object.freeze({owner:'shared',authorUid:'owner-b',title:'shared',sourceColor:'#0000FF'});const before=JSON.stringify(row);isReceived(row,user);color(row,user,'blue');assert.equal(JSON.stringify(row),before);
});
test('yellow fill retains readable dark foreground with explicit class selectors',()=>{
  const css=fs.readFileSync(path.join(__dirname,'../shared-schedule-v176.css'),'utf8');assert.match(css,/background:#FFF2B3!important;color:#594600!important/);assert.match(css,/#calendar \.ev\.schedule-received-v176/);assert.match(css,/schedule-upcoming-line-v126\.schedule-received-v176/);assert.doesNotMatch(css,/\.ev\.mine\s*\{/);
});
