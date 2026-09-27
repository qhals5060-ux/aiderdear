const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const assets=path.join(__dirname,'../assets');
const modelModule={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'widget-models-v165.js'),'utf8'),{module:modelModule,exports:modelModule.exports,Date});
const models=modelModule.exports;
const personal={
  routines:[{id:'r1',title:'Read',doneDates:['2026-09-26','2026-09-27'],dailyLevels:{'2026-09-27':'MINI'},goalDays:10,updatedAt:100},{id:'r2',title:'Stretch',doneDates:[],dailyLevels:{},updatedAt:200},{id:'demo-r',title:'Demo routine',demo:true}],
  checklists:[{id:'t1',title:'Pending',done:false,dueAt:'2026-09-28',updatedAt:500},{id:'t2',title:'Completed',done:true,updatedAt:600},{id:'m1',title:'Memo',kind:'memo'},{id:'e1',title:'Emotion',category:'emotion'},{id:'d1',title:'Demo',demo:true}],
  records:[{id:'health',type:'health'}],workflows:[{id:'w1'}],finance:[{id:'f1'}]
};
const model=models.build({personal,uid:'scope-user-a',now:new Date('2026-09-27T12:00:00+09:00')});
assert.equal(model.schema,193);assert.equal(model.routines.length,2);assert.equal(model.todos.length,2);assert.equal(model.incompleteTodos.length,1);assert.equal(model.routineStats.todayDone,1);
const data={uid:'scope-user-a',version:193,v165:model,scheduleItems:[{id:'s1',title:'Today',date:'2026-09-27',time:'09:00'},{id:'s2',title:'Shared multi-day',date:'2026-09-26',endDate:'2026-09-28',allDay:true,readOnly:true,friendShared:true},{id:'s3',title:'Future',date:'2026-09-29',time:'10:00'},{id:'s4',title:'Expired',date:'2026-09-25',time:'11:00'}]};
fs.writeFileSync(path.resolve(process.argv[2]||path.join(__dirname,'../../../../work/widget-fixture-v193.json')),JSON.stringify(data));
console.log('PASS JS widget projection contract; wrote shared Java fixture');
