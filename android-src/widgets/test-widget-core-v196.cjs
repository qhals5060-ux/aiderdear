const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const assets=process.env.AIDERLOG_TEST_APP_ROOT||path.join(__dirname,'../assets'),moduleValue={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'widget-models-v165.js'),'utf8'),{module:moduleValue,exports:moduleValue.exports,Date});const models=moduleValue.exports;
const personal={routines:[
 {id:'read',title:'독서',doneDates:['2026-09-20','2026-09-21','2026-09-21','2026-09-23','2026-09-27','invalid','2026-02-30'],dailyLevels:{'2026-09-21':'MINI','2026-09-22':'MORE','2026-09-23':'SKIP','2026-09-24':'MAX'},updatedAt:10},
 {id:'stretch',title:'스트레칭',doneDates:[],dailyLevels:{'2026-09-23':'MAX'},steps:[{id:'s1',title:'준비',durationSeconds:20}],stepHistory:{'2026-09-23':{finished:true}},updatedAt:20},
 {id:'old',title:'지난 주만 실천',doneDates:['2026-09-20']},
 {id:'skip',title:'쉬기',doneDates:['2026-09-21'],dailyLevels:{'2026-09-21':'SKIP'}},
 {id:'future',title:'미래 기록',doneDates:['2026-09-24'],dailyLevels:{'2026-09-25':'MINI'}},
 {id:'demo',title:'샘플',doneDates:['2026-09-23'],demo:true}
],checklists:[{id:'todo',title:'할 일'},{id:'memo',title:'레거시 메모',kind:'memo'}],memos:[{id:'memo',text:'메모장',notes:'본문'}]};
const model=models.build({personal,uid:'scope-user-a',now:new Date('2026-09-23T12:00:00+09:00')});
assert.equal(model.schema,196);assert.equal(model.uid,'scope-user-a');assert.equal(model.routines.length,5);assert.equal(model.routineWeek.length,2);assert.deepEqual(Array.from(model.weekDates),['2026-09-21','2026-09-22','2026-09-23','2026-09-24','2026-09-25','2026-09-26','2026-09-27']);
assert.deepEqual(Array.from(model.routineWeek,x=>x.title),['독서','스트레칭']);assert.deepEqual(Array.from(model.routineWeek[0].week),[true,true,false,false,false,false,false]);assert.equal(model.routineWeek[0].weekCount,2);assert.equal(model.routineStats.weekTotal,3);assert.equal(model.routineStats.practiced,2);assert.equal(model.routineStats.todayDone,1);assert.equal(model.routines[0].done,3);assert.equal(model.routines[0].level,'SKIP');assert.equal(model.routines[1].steps,undefined);assert.equal(model.routines[1].stepHistory,undefined);assert.equal(model.notes.length,2);assert.equal(model.todos.length,1);
for(const [today,start,end]of [['2026-09-21','2026-09-21','2026-09-27'],['2026-09-27','2026-09-21','2026-09-27'],['2026-09-28','2026-09-28','2026-10-04'],['2027-01-01','2026-12-28','2027-01-03']]){const m=models.build({personal,uid:'scope-user-a',now:new Date(today+'T12:00:00+09:00')});assert.equal(m.weekDates[0],start);assert.equal(m.weekDates[6],end);for(const r of m.routineWeek)for(let i=0;i<7;i++)if(m.weekDates[i]>today)assert.equal(r.week[i],false);}
const data={uid:model.uid,version:195,v165:model,scheduleItems:[{id:'s1',title:'일정',date:'2026-09-23'}]};if(process.argv[2])fs.writeFileSync(path.resolve(process.argv[2]),JSON.stringify(data));console.log('PASS v195 named weekly routines, calendar boundaries, future/SKIP exclusion, steps compatibility, unchanged memo/todo projection');
