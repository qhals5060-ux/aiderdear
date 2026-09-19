'use strict';
// Pure model + owner-scoped native bridge doubles. No live account or writes.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const modelSource=fs.readFileSync(path.join(__dirname,'widget-models-v165.js'),'utf8'),adapterSource=fs.readFileSync(path.join(__dirname,'widget-sync-v164.js'),'utf8');
const moduleBox={exports:{}};new Function('module',modelSource)(moduleBox);const M=moduleBox.exports;
const NOW=new Date('2026-09-19T12:00:00'),plain=value=>JSON.parse(JSON.stringify(value));
function model(personal,now=NOW){return M.build({personal,uid:'owner-A',now});}
const harnessSource=fs.readFileSync(path.join(__dirname,'widget-privacy-test-v164.cjs'),'utf8').split('(async()=>{')[0],scope={require,__dirname,console};
vm.createContext(scope);vm.runInContext(harnessSource+';this.harness=harness;',scope);
function harness(){const h=scope.harness('A');vm.runInContext(modelSource,h.ctx);return h;}

test('calendar backlog includes every incomplete task beyond 40 with overdue, future and absent deadlines',()=>{
  const rows=Array.from({length:55},(_,index)=>({id:'task-'+index,text:'할 일 '+index,createdAt:index,updatedAt:100+index,done:false}));
  rows.push({id:'past',text:'지난 마감',date:'2025-01-01',kind:'todo'},{id:'future',text:'먼 마감',dueAt:'2027-12-01'},
    {id:'complete',text:'완료',done:true},{id:'memo',kind:'memo',text:'메모'},{id:'typed',type:'memo',text:'메모'},
    {id:'demo',demo:true,text:'예시'},{id:'retired',category:'emotion',text:'감정'},{id:'empty-title',text:''},{text:'식별자 없음'});
  const m=model({checklists:rows,memos:[{id:'memo-todo',kind:'todo',text:'Memo collection is not writable checklist'}]});
  assert.equal(m.incompleteTodos.length,57);assert.equal(m.incompleteTodos[0].id,'past');assert.equal(m.incompleteTodos[1].id,'future');
  assert(m.incompleteTodos.some(row=>row.id==='task-54'));assert(m.incompleteTodos.some(row=>row.id==='task-0'));
  for(const row of m.incompleteTodos){assert.equal(row.done,false);assert(row.id&&row.title);assert.equal(row.kind,'todo');}
  assert(m.todos.some(row=>row.id==='complete'),'Other task widgets retain completed history');
  for(const id of ['complete','memo','typed','demo','retired','empty-title','memo-todo'])assert(!m.incompleteTodos.some(row=>row.id===id),id);
});

test('calendar backlog does not depend on selected week and projection leaves original records intact',()=>{
  const personal={checklists:[{id:'past',text:'과거',date:'2026-01-01',updatedAt:4},{id:'future',text:'미래',date:'2028-01-01',updatedAt:5},{id:'undated',text:'미정',updatedAt:6}]},before=JSON.stringify(personal);
  for(const row of personal.checklists)Object.freeze(row);Object.freeze(personal.checklists);Object.freeze(personal);
  const a=model(personal),b=model(personal,new Date('2030-01-01T12:00:00'));
  assert.deepEqual(a.incompleteTodos,b.incompleteTodos);assert.equal(JSON.stringify(personal),before);
  assert.deepEqual(a.incompleteTodos.map(row=>[row.id,row.updatedAt]),[['past',4],['future',5],['undated',6]]);
});

test('empty backlog creates no fabricated title, date, identifier or demo row',()=>{
  const m=model({checklists:[{id:'done',text:'완료',done:true}],memos:[{id:'note',text:'메모'}]});
  assert.deepEqual(m.incompleteTodos,[]);assert.deepEqual(model({}).incompleteTodos,[]);
});

test('schedule bridge retains safe colour, all-day and readonly metadata without copying private details',async()=>{
  const h=harness(),today=new Date().toLocaleDateString('sv-SE');h.rows.A.app={scheduleEvents:[
    {id:'day',date:today,title:'하루 일정',allDay:true,time:'15:00',color:'#C5A5F0',note:'SECRET_NOTE',contact:'SECRET_CONTACT'},
    {id:'work',date:today,title:'업무',time:'10:30',sourceColor:'#6688CC',projectionSource:'work',readOnly:true},
    {id:'bad-colour',date:today,title:'색상 기본값',time:'11:30',color:'url(SECRET_URL)'}]};
  h.ctx.AiderFriendScheduleUIV175={events:()=>[{id:'received',date:today,title:'공유받은 일정',time:'12:30',friendShared:true,readOnly:true,color:'#D6BE79'}]};
  h.api.readScheduleData=async()=>({own:h.rows.A.app.scheduleEvents,shared:[]});
  await h.widget.refresh();const shot=h.widget.snapshot(),byId=Object.fromEntries(shot.scheduleItems.map(row=>[row.id,row]));
  assert.equal(byId.day.allDay,true);assert.equal(byId.day.time,'');assert.equal(byId.day.color,'#C5A5F0');
  assert.equal(byId.work.readOnly,true);assert.equal(byId.work.projectionSource,'work');assert.equal(byId['bad-colour'].color,'#6255E8');
  assert.equal(byId.received.friendShared,true);assert.equal(byId.received.readOnly,true);
  for(const value of ['SECRET_NOTE','SECRET_CONTACT','SECRET_URL'])assert(!JSON.stringify(shot).includes(value),value);
  assert.doesNotMatch(adapterSource,/createGoogleEvent|googleapis|calendarSyncRequest/);
});

test('owner-scoped bridge exposes undated todos rather than treating them as memos, and refresh removes completed rows',async()=>{
  const h=harness();h.rows.A.personal={checklists:[{id:'undated',text:'날짜 없는 할 일',updatedAt:10},{id:'explicit',text:'메모',kind:'memo'},{id:'future',text:'미래',date:'2099-01-01'}]};
  await h.widget.refresh();let shot=h.widget.snapshot();assert.deepEqual(plain(shot.v165.incompleteTodos.map(row=>row.id)),['future','undated']);
  assert(shot.todos.some(row=>row.includes('날짜 없는 할 일')));assert(!shot.memos.some(row=>row.includes('날짜 없는 할 일')));assert(shot.memos.includes('메모'));
  h.rows.A.personal.checklists[0].done=true;h.rows.A.personal.checklists[0].updatedAt=11;await h.widget.refresh();shot=h.widget.snapshot();assert.deepEqual(plain(shot.v165.incompleteTodos.map(row=>row.id)),['future']);
  h.emit('B');assert.equal(h.widget.snapshot().v165.incompleteTodos,undefined);await h.widget.refresh();assert.deepEqual(plain(h.widget.snapshot().v165.incompleteTodos),[]);
  h.emit(null);assert.equal(h.widget.snapshot().uid,'');assert.deepEqual(plain(h.widget.snapshot().scheduleItems),[]);
});

test('calendar data source mirrors keep packaged and canonical adapters identical',()=>{
  for(const name of ['widget-models-v165.js','widget-sync-v164.js']){
    const source=fs.readFileSync(path.join(__dirname,name),'utf8');
    assert.equal(source,fs.readFileSync(path.join(__dirname,'../assets',name),'utf8'),name+' overlay');
    assert.equal(source,fs.readFileSync(path.join(__dirname,'../../../AiderLog-v145-decoded/assets',name),'utf8'),name+' canonical');
  }
});

test('authoritative schedule empty, deletion and edits replace rather than merge stale app/main rows',async()=>{
  const h=harness(),today=new Date().toLocaleDateString('sv-SE');
  h.rows.A.app={scheduleEvents:[{id:'deleted',title:'DELETED_LEGACY',date:today},{id:'edited',title:'OLD_TITLE',date:today,time:'09:00'}]};
  h.api.readScheduleData=async()=>({own:[{id:'edited',title:'새 제목',date:today,time:'11:30'}],shared:[]});
  await h.widget.refresh();let rows=h.widget.snapshot().scheduleItems;
  assert.equal(rows.length,1);assert.equal(rows[0].title,'새 제목');assert.equal(rows[0].time,'11:30');
  assert(!JSON.stringify(rows).includes('DELETED_LEGACY'));assert(!JSON.stringify(rows).includes('OLD_TITLE'));
  h.api.readScheduleData=async()=>({own:[],shared:[]});await h.widget.refresh();assert.deepEqual(plain(h.widget.snapshot().scheduleItems),[]);
  const cached=JSON.parse(h.localStorage['aiderlog.widgets.verified.v164:A%7Csolo']);assert.deepEqual(cached.app.scheduleEvents,[]);
});

test('missing schedule reader alone permits scoped fallback; invalid or failed reads preserve only last verified snapshot',async()=>{
  const h=harness();delete h.api.readScheduleData;await h.widget.refresh();assert.equal(h.widget.snapshot().scheduleItems[0].id,'a');
  h.api.readScheduleData=async()=>[];await h.widget.refresh();assert.deepEqual(plain(h.widget.snapshot().scheduleItems),[]);
  h.api.readScheduleData=async()=>null;await h.widget.refresh();assert.deepEqual(plain(h.widget.snapshot().scheduleItems),[]);
  h.api.readScheduleData=async()=>{throw Error('offline')};await h.widget.refresh();assert.deepEqual(plain(h.widget.snapshot().scheduleItems),[]);
  h.emit('B');await h.widget.refresh();assert.equal(h.widget.snapshot().accessState,'sync-required');assert.deepEqual(plain(h.widget.snapshot().scheduleItems),[]);
});
