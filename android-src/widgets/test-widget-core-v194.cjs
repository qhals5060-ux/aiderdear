const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const assets=process.env.AIDERLOG_TEST_APP_ROOT||path.join(__dirname,'../assets');
const modelModule={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'widget-models-v165.js'),'utf8'),{module:modelModule,exports:modelModule.exports,Date});
const models=modelModule.exports;
const personal={
  routines:[{id:'r1',title:'Read',doneDates:['2026-09-26','2026-09-27'],dailyLevels:{'2026-09-27':'MINI'},goalDays:10,updatedAt:100},{id:'r2',title:'Stretch',doneDates:[],dailyLevels:{},updatedAt:200},{id:'demo-r',title:'Demo routine',demo:true}],
  checklists:[{id:'t1',title:'Pending',done:false,dueAt:'2026-09-28',updatedAt:500},{id:'t2',title:'Completed',done:true,updatedAt:600},{id:'m1',title:'Memo',kind:'memo'},{id:'e1',title:'Emotion',category:'emotion'},{id:'d1',title:'Demo',demo:true}],
  memos:[{id:'m1',text:'New memo',notes:'Body',updatedAt:100},{id:'m1',text:'Old duplicate',updatedAt:10},{id:'empty',text:''},{id:'demo-note',text:'Example',demo:true}],
  records:[{id:'health',type:'health'}],workflows:[{id:'w1'}],finance:[{id:'f1'}]
};
const model=models.build({personal,uid:'scope-user-a',now:new Date('2026-09-27T12:00:00+09:00')});
assert.equal(model.schema,194);assert.equal(model.routines.length,2);assert.equal(model.todos.length,2);assert.equal(model.incompleteTodos.length,1);assert.equal(model.routineStats.todayDone,1);
assert.equal(model.notes.length,2);assert.equal(model.notes[0].source,'memos');assert.equal(model.notes[0].title,'New memo');assert.equal(model.notes[1].source,'checklists');assert.equal(model.notes[0].id,model.notes[1].id);
const bounded=models.build({personal:{memos:Array.from({length:60},(_,i)=>({id:'m'+i,text:'x'.repeat(400),notes:'y'.repeat(500),updatedAt:i}))},uid:'scope-user-a'});assert.equal(bounded.notes.length,40);assert.equal(bounded.notes[0].title.length,180);assert.equal(bounded.notes[0].preview.length,240);assert.equal(bounded.notes[0].id,'m59');
const data={uid:'scope-user-a',version:194,v165:model,scheduleItems:[{id:'s1',title:'Today',date:'2026-09-27',time:'09:00'},{id:'s2',title:'Shared multi-day',date:'2026-09-26',endDate:'2026-09-28',allDay:true,readOnly:true,friendShared:true},{id:'s3',title:'Future',date:'2026-09-29',time:'10:00'},{id:'s4',title:'Expired',date:'2026-09-25',time:'11:00'}]};
if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),JSON.stringify(data));
console.log('PASS JS widget projection contract'+(process.argv[2]?'; wrote shared Java fixture':''));
