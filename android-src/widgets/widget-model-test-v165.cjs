/* Owner-scoped synthetic fixtures only. Run: node android-src/widgets/widget-model-test-v165.cjs */
const test = require('node:test');
const assert = require('node:assert/strict');
// The surrounding site is type:module, while this browser asset is a UMD factory.
const moduleBox = {exports:{}};
new Function('module', require('node:fs').readFileSync(require('node:path').join(__dirname,'widget-models-v165.js'),'utf8'))(moduleBox);
const M = moduleBox.exports;
const NOW = new Date('2026-09-06T12:00:00');
const TODAY = '2026-09-06';
const make = personal => M.build({uid:'fixture-owner', personal, now:NOW, courses:[{language:'en'},{language:'ja'}], photo:r=>r.localImage || `image:${r.id}`});
const freeze = obj => { if(obj && typeof obj==='object') { Object.freeze(obj); Object.values(obj).forEach(freeze); } return obj; };
const reading = (id,date,createdAt,details={},extra={}) => ({id,category:'reading',title:'A Book',date,createdAt,details:{author:'Author',readingStatus:'read',...details},...extra});
const health = (id,date,details,extra={}) => ({id,category:'health',title:id,date,createdAt:1,details,...extra});

test('empty account is genuinely empty: no fabricated counts, photos, minutes or books',()=>{
  const m=make({});
  assert.equal(m.schema,165); assert.equal(m.uid,'fixture-owner'); assert.equal(m.today,TODAY);
  for(const key of ['notes','todos','routines','workouts','challenges','inbody','books','workflows'])assert.equal(m[key].length,0,key);
  assert.deepEqual(m.meals,['breakfast','lunch','dinner','snack'].map(slot=>({id:'',slot,recordIds:[],image:'',time:'',rating:null})));
  assert.deepEqual(m.language.map(r=>[r.id,r.minutes,r.weekCount,r.streak]),[['en',null,0,0],['ja',null,0,0]]);
  assert.equal(m.routineStats.weekPercent,null); assert.deepEqual(m.dates,{});
});

test('pure projection does not mutate stored records, nested arrays, fields or order',()=>{
  const personal={routines:[{id:'r',title:'Walk',doneDates:['2026-09-05','2026-09-05'],dailyLevels:{'2026-09-05':'MINI'},color:'pv3',icon:'legacy',goalTracking:{start:'2026-01-01'},unknown:{keep:true}}],checklists:[{id:'t',date:'',done:false,createdAt:2}],personalItems:[reading('b',TODAY,3)]};
  const before=JSON.stringify(personal);make(freeze(personal));assert.equal(JSON.stringify(personal),before);
});

test('todos retain undated entries; unfinished due dates ascend then undated creation descends',()=>{
  const checks=[{id:'u-old',createdAt:3},{id:'late',date:'2026-10-01',createdAt:9},{id:'u-new',date:'',createdAt:8},{id:'early',dueAt:'2026-09-01',createdAt:20}];
  assert.deepEqual(make({checklists:checks}).todos.map(r=>r.id),['early','late','u-new','u-old']);
});

test('completed todos follow unfinished rows and use completedAt before update/create fallback',()=>{
  const checks=[{id:'complete-old',done:true,completedAt:10,updatedAt:999},{id:'unfinished',done:false},{id:'complete-new',done:true,completedAt:30},{id:'fallback-update',done:true,updatedAt:20},{id:'fallback-create',done:true,createdAt:15}];
  assert.deepEqual(make({checklists:checks}).todos.map(r=>r.id),['unfinished','complete-new','fallback-update','fallback-create','complete-old']);
});

test('notes use explicit memo classification, newest update/create order and never expose check state',()=>{
  const m=make({checklists:[{id:'typed',type:'memo',text:'Typed note',done:true,updatedAt:12},{id:'kind',kind:'memo',text:'Kind note',createdAt:6},{id:'todo',text:'Undated task',done:false}],memos:[{id:'external',title:'Note',createdAt:10}]});
  assert.deepEqual(m.notes.map(r=>r.id),['typed','external','kind']);assert.deepEqual(m.todos.map(r=>r.id),['todo']);
  for(const row of m.notes){assert.equal(row.kind,'note');assert(!Object.hasOwn(row,'done'));}
});

test('routine doneDates are unique, existing goal controls percent, latest sequence controls streak',()=>{
  const m=make({routines:[{id:'r',title:'Walk',goalDays:7,cycleDays:30,doneDates:['2026-09-01','2026-09-02','2026-09-02','2026-09-03'],dailyLevels:{'2026-09-03':'MAX'},miniText:'One minute',moreText:'Ten',maxText:'Thirty'}]});
  const r=m.routines[0]; assert.equal(r.done,3); assert.equal(r.percent,43); assert.equal(r.streak,3); assert.equal(r.level,'');
  assert.equal(r.cycleDays,30); assert.equal(r.maxText,'Thirty'); assert.deepEqual(r.week,[false,true,true,true,false,false,false]);
});

test('routine stats count per-routine completed dates, not duplicate rows or MINI/MORE/MAX weights',()=>{
  const m=make({routines:[{id:'a',goalDays:7,doneDates:['2026-09-05',TODAY,TODAY],dailyLevels:{[TODAY]:'MINI'}},{id:'b',goalDays:30,doneDates:[TODAY],dailyLevels:{[TODAY]:'MAX'}},{id:'c',goalDays:66,doneDates:[],dailyLevels:{[TODAY]:'SKIP'}}]});
  assert.equal(m.routineStats.todayDone,2);assert.equal(m.routineStats.total,3);assert.equal(m.routineStats.cumulative,3);
  assert.deepEqual(m.routineStats.weekCounts,[0,0,0,0,0,1,2]);assert.equal(m.routineStats.weekPercent,14);assert.equal(m.routineStats.streak,2);
  assert.deepEqual(m.routines.map(r=>r.level),['MINI','MAX','SKIP']);
});

test('legacy explicit SKIP is distinguishable from an untouched date without counting as completed',()=>{
  const m=make({routines:[{id:'explicit',doneDates:[],dailyLevels:{[TODAY]:'SKIP'}},{id:'untouched',doneDates:[],dailyLevels:{}}]});
  assert.deepEqual(m.routines.map(r=>r.level),['SKIP','']);assert.equal(m.routineStats.todayDone,0);assert.equal(m.routineStats.cumulative,0);
});

test('routine missing goal has unknown percent rather than 0 or 100',()=>{
  assert.equal(make({routines:[{id:'r',doneDates:[TODAY]}]}).routines[0].percent,null);
});

test('English/Japanese actual completion and review dates are separated; Chinese is not emitted',()=>{
  const languageStudy={en:{completedDates:['2026-09-01']},ja:{completedDates:['2026-09-02']},zh:{completedDates:[TODAY]},v2Progress:{levelByLanguage:{en:2,ja:4},progress:{a:{language:'en',completedAt:'2026-09-03T10:00:00',reviewHistory:['2026-09-05T09:00:00','2026-09-05T12:00:00']},b:{language:'ja',completedAt:'2026-09-04T10:00:00'},c:{language:'zh',completedAt:TODAY},d:{language:'en',attempts:4}}}};
  const m=make({languageStudy});assert.deepEqual(m.language.map(r=>r.id),['en','ja']);
  assert.deepEqual([...m.language[0].dates].sort(),['2026-09-01','2026-09-03','2026-09-05']);
  assert.deepEqual([...m.language[1].dates].sort(),['2026-09-02','2026-09-04']);
  assert.equal(m.language[0].title,'English · 중급');assert.equal(m.language[1].title,'Japanese · 고급');
  assert.equal(m.language[0].minutes,null);assert.equal(m.language[1].minutes,null);
  assert(!JSON.stringify(m).includes('language:zh'));
});

test('legacy lastReviewedAt is an actual activity date even without reviewHistory',()=>{
  const m=make({languageStudy:{v2Progress:{progress:{a:{language:'en',completedAt:'2026-08-01T09:00:00',lastReviewedAt:'2026-09-06T09:00:00'}}}}});
  assert(m.language[0].dates.includes(TODAY)); assert.equal(m.language[0].weekCount,1); assert.equal(m.language[0].streak,1);
});

test('measured language active time is not inferred from completed lesson count',()=>{
  const m=make({languageStudy:{v2Progress:{progress:{a:{language:'en',completedAt:TODAY,activeStudyMs:120000},b:{language:'en',completedAt:TODAY,activeMs:60000},c:{language:'en',completedAt:TODAY}}}}});
  assert.equal(m.language[0].minutes,3); assert.equal(m.language[1].minutes,null);
});

test('meal four slots retain only today, latest own image, real time and rating',()=>{
  const m=make({personalItems:[health('old','2026-09-05',{healthType:'meal',mealType:'dinner',time:'20:00',rating:5}),health('breakfast',TODAY,{healthType:'meal',mealType:'breakfast',time:'08:15',mealTime:'11:00',rating:4}),health('lunch-old',TODAY,{healthType:'meal',mealType:'lunch',time:'12:00',rating:2},{createdAt:2}),health('lunch-new',TODAY,{healthType:'meal',mealType:'lunch',mealTime:'13:10',rating:0},{updatedAt:3}),health('snack',TODAY,{healthType:'meal',mealType:'snack'})]});
  assert.equal(m.meals.length,4);assert.deepEqual(m.meals.map(r=>r.id),['breakfast','lunch-new','','snack']);
  assert.equal(m.meals[0].time,'08:15');assert.equal(m.meals[1].time,'13:10');assert.equal(m.meals[1].rating,0);assert.equal(m.meals[3].rating,null);
  for(const r of m.meals)assert.deepEqual(Object.keys(r).sort(),['id','image','rating','recordIds','slot','time']);
});

test('exercise minutes come from top-level minutes; set weight/reps/seconds are preserved',()=>{
  const m=make({personalItems:[health('w',TODAY,{healthType:'exercise',minutes:99,exercises:[{name:'Squat',sets:[{weight:10,reps:8},{duration:30}]}]},{minutes:32}),health('unknown',TODAY,{healthType:'exercise'})]});
  assert.equal(m.workouts[0].minutes,32);assert.equal(m.workouts[1].minutes,null);
  assert.deepEqual(m.workouts[0].exercises[0].sets,[{weight:10,reps:8,seconds:null},{weight:null,reps:null,seconds:30}]);
});

test('actual 30-day burpee challenge is retained, unique days counted, absent stretch never invented',()=>{
  const m=make({personalItems:[health('burpee1','2026-09-05',{healthType:'exercise',challengeId:'burpee',challengeDay:1,challengeTarget:10,challengeUnit:'회'}),health('burpee1again','2026-09-05',{healthType:'exercise',challengeId:'burpee',challengeDay:1,challengeTarget:10,challengeUnit:'회'}),health('burpee2',TODAY,{healthType:'exercise',challengeId:'burpee',challengeDay:2,challengeTarget:12,challengeUnit:'회',challengeVariantName:'Basic burpee'})]});
  assert.deepEqual(m.challenges.map(r=>r.id),['burpee']);const r=m.challenges[0];assert.equal(r.title,'버피');assert.equal(r.done,2);assert.equal(r.goal,30);assert.equal(r.day,2);assert.equal(r.nodes.length,30);assert.equal(r.percent,7);assert.equal(r.target,12);assert.equal(r.streak,2);
});

test('inbody retains just weight/muscle/fat ordered by actual date; missing values stay null',()=>{
  const m=make({personalItems:[health('new',TODAY,{healthType:'inbody',inbodyWeight:61,inbodyMuscle:22,inbodyFatPercent:25,BMI:23,calories:300}),health('old','2026-09-01',{healthType:'inbody',inbodyWeight:62})]});
  assert.deepEqual(m.inbody,[{date:'2026-09-01',weight:62,muscle:null,fat:null},{date:TODAY,weight:61,muscle:22,fat:25}]);
});

test('book grouping uses stable book ID before title and author',()=>{
  const m=make({personalItems:[reading('old','2026-09-01',500,{bookId:'book-a',currentPage:1,totalPages:100}),reading('new',TODAY,10,{bookId:'book-a',currentPage:50,totalPages:100},{title:'Renamed Book'})]});
  assert.equal(m.books.length,1);assert.equal(m.books[0].recordId,'new');assert.equal(m.books[0].currentPage,50);assert.equal(m.books[0].percent,50);
});

test('fallback book key normalizes whitespace/case and distinguishes authors',()=>{
  const m=make({personalItems:[reading('a','2026-09-01',1,{author:' Author '},{title:'Ａ   Book'}),reading('b',TODAY,2,{author:'author'},{title:'a book'}),reading('c',TODAY,3,{author:'Other'},{title:'a book'})]});
  assert.equal(m.books.length,2); assert.equal(m.books.find(r=>r.id.includes('author')).recordId,'b');
});

test('book representative uses date first then createdAt, not oldest record updated later',()=>{
  const m=make({personalItems:[reading('old','2026-09-01',999,{currentPage:1},{updatedAt:5000}),reading('new-a',TODAY,10,{currentPage:30}),reading('new-b',TODAY,20,{currentPage:45})]});
  assert.equal(m.books[0].recordId,'new-b');assert.equal(m.books[0].currentPage,45);
});

test('latest non-empty original quote is used independently of newest progress record',()=>{
  const quote='Original sentence.\nKeep the second line and  two spaces.';
  const m=make({personalItems:[reading('older','2026-09-01',1,{quote:'Older quote',quotePage:3}),reading('quote','2026-09-05',2,{quote,quotePage:25}),reading('latest',TODAY,3,{quote:'',currentPage:50,totalPages:100})]});
  assert.equal(m.books[0].quote,quote);assert.equal(m.books[0].quotePage,25);assert.equal(m.books[0].recordId,'latest');
});

test('legacy top-level book author is retained in display as well as grouping',()=>{
  const m=make({personalItems:[{id:'b',category:'reading',title:'Legacy book',author:'Legacy author',date:TODAY,details:{currentPage:5}}]});
  assert.equal(m.books[0].author,'Legacy author');
});

test('missing total pages stays unknown; finished/want/reading state and current book are explicit',()=>{
  const m=make({personalItems:[reading('unknown',TODAY,100,{bookId:'unknown',currentPage:5}),reading('finished',TODAY,50,{bookId:'done',currentPage:100,totalPages:100}),reading('want',TODAY,60,{bookId:'want',readingStatus:'want'})]});
  assert.equal(m.books.find(r=>r.id==='unknown').percent,null);assert.equal(m.books.find(r=>r.id==='done').status,'finished');assert.equal(m.books.find(r=>r.id==='want').status,'want');assert.equal(m.currentBookId,'unknown');
});

test('workflow preserves completedSteps mapping for string steps, project progress and state',()=>{
  const m=make({personalItems:[{id:'w',category:'workflow',title:'Research',status:'ongoing',details:{project:'Protocol',progress:50,steps:['Preparation','Analysis'],completedSteps:{0:1234}}}]});
  assert.deepEqual(m.workflows[0].steps,[{text:'Preparation',done:true},{text:'Analysis',done:false}]);assert.equal(m.workflows[0].percent,50);assert.equal(m.workflows[0].status,'ongoing');
});

test('emotion/demo records and forbidden health fields do not leak through display/source dates',()=>{
  const personal={emotionSummary:'EMOTION_SECRET',memos:[{id:'e-note',category:'emotion',text:'EMOTION_SECRET'},{id:'d-note',demo:true,text:'DEMO_SECRET'}],checklists:[{id:'e-todo',category:'emotion',text:'EMOTION_SECRET'}],personalItems:[{id:'e',category:'emotion',date:TODAY,title:'EMOTION_SECRET',note:'EMOTION_SECRET'},{id:'d',category:'health',demo:true,title:'DEMO_SECRET',date:TODAY,details:{healthType:'exercise'}},health('exercise',TODAY,{healthType:'exercise',calories:'CALORIES_SECRET',steps:'STEPS_SECRET',distance:'DISTANCE_SECRET',bodyMassIndex:'BMI_SECRET',bloodPressure:'BP_SECRET',sleep:'SLEEP_SECRET'})]};
  const serialized=JSON.stringify(make(personal));for(const forbidden of ['EMOTION_SECRET','DEMO_SECRET','CALORIES_SECRET','STEPS_SECRET','DISTANCE_SECRET','BMI_SECRET','BP_SECRET','SLEEP_SECRET'])assert(!serialized.includes(forbidden),forbidden);
  assert.equal(make(personal).dates[TODAY].length,1);
});

test('bullet date rows retain actual non-emotion records without manufacturing placeholder entries',()=>{
  const m=make({personalItems:[{id:'read',category:'reading',date:TODAY,title:'Read',details:{time:'09:00'}},{id:'finance',category:'finance',date:TODAY,title:'Receipt',time:'08:00'},{id:'emotion',category:'emotion',date:TODAY,title:'Hidden'},{id:'invalid',category:'health',date:'not-a-date',title:'Invalid'}],routines:[{id:'r',title:'Walk',doneDates:[TODAY],dailyLevels:{[TODAY]:'MINI'}}]});
  assert.deepEqual(m.dates[TODAY].map(r=>r.id),['finance','read',`routine:r:${TODAY}`]);assert.equal(Object.keys(m.dates).length,1);
});

test('week and streak handle Sunday/year boundary and duplicate dates consistently',()=>{
  assert.deepEqual(M.week(TODAY),['2026-08-31','2026-09-01','2026-09-02','2026-09-03','2026-09-04','2026-09-05','2026-09-06']);
  assert.equal(M.shift('2026-01-01',-1),'2025-12-31');assert.equal(M.streak(['2025-12-30','2025-12-31','2025-12-31'],'2026-01-01'),2);
});
