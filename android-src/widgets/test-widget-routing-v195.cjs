const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const assets=process.env.AIDERLOG_TEST_APP_ROOT||path.join(__dirname,'../assets'),modelModule={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'widget-models-v165.js'),'utf8'),{module:modelModule,exports:modelModule.exports,Date});
const models=modelModule.exports;
const uid='scope-user-a',owner=uid+'|solo',privateData={routines:[{id:'r1',title:'Routine',updatedAt:10}],checklists:[{id:'t1',title:'Task',updatedAt:20},{id:'memo',title:'Memo',kind:'memo'}],memos:[{id:'m1',text:'Notebook memo',notes:'Body'}],records:[{id:'health',type:'health'}]};
const stored=new Map([[`aiderlog.widgets.verified.v164:${encodeURIComponent(owner)}`,JSON.stringify({owner,app:{scheduleEvents:[{id:'s1',title:'Calendar',date:'2026-09-27'},{id:'widget-own',title:'Edited widget event',date:'2026-09-27',widgetCreatedV195:true,authorUid:uid},{id:'widget-other',title:'Received event',date:'2026-09-27',widgetCreatedV195:true,authorUid:'other-user',friendShared:true}]},personal:privateData})]]);
const memoCalls=[];const mutations=[],routes=[],opened=[],timers=new Map();let timerId=0,todoOpens=0,statsOpens=0;
const state={user:{uid,email:'example@invalid.test'},pair:null};
const context={console,Intl,Date,Set,Map,URL,URLSearchParams,Promise,encodeURIComponent,decodeURIComponent,
  document:{documentElement:{dataset:{theme:'system'}},body:{},addEventListener(){},querySelector(selector){return selector==='#quickMemoBtn'?{click(){todoOpens++}}:selector==='#routine [data-r165-tab="statistics"]'?{click(){statsOpens++}}:null;}},
  localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,String(value))},
  MutationObserver:class{observe(){}},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},
  setTimeout:(fn,delay)=>{timers.set(++timerId,{fn,delay});return timerId},clearTimeout:id=>timers.delete(id),
  addEventListener(){},dispatchEvent(){},go:page=>routes.push(page),location:{hash:''},P:privateData,
  AiderTodoV179:{refresh:async()=>memoCalls.push('refresh'),open:kind=>memoCalls.push(['open',kind]),edit:(...args)=>memoCalls.push(['edit',...args])},AiderLogNative:{syncWidgets(){}},AiderWidgetModelsV165:models,
  AiderLogCalendarV125:{openSchedule:(...args)=>opened.push(args)},
  AiderLogAppShell:{openTarget(target){routes.push(({private:'routine',schedule:'home',home:'home',routine:'routine'})[target]||'home')}},
  AiderDearFirebase:{getState:()=>state,subscribe:fn=>fn(state),readAppData:async()=>({}),readPrivateData:async()=>privateData,readScheduleData:async()=>[],applyWidgetActionV165:async command=>{mutations.push(command);return{payload:privateData}}}
};context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(assets,'widget-sync-v164.js'),'utf8'),context);
const adapter=context.AiderWidgetSyncV164,action=command=>'widget-v165:'+encodeURIComponent(JSON.stringify(command)),queue=`aiderlog.widget-actions.v165:${uid}`;
const command=(kind,op,value,id='r1',user=uid)=>({kind,op,value,id,uid:user,key:kind+':'+op+':'+value,expectedUpdatedAt:10,date:'2026-09-27',widgetId:42});
(async()=>{
 const snapshot=adapter.snapshot();assert.equal(snapshot.version,195);assert.equal(snapshot.v165.uid,uid);assert.equal(snapshot.scheduleItems.length,3);assert.equal(snapshot.v165.todos.length,1);assert.equal(snapshot.v165.routines.length,1);assert.equal(snapshot.v165.meals,undefined);assert.equal(snapshot.mealPhotos,undefined);
 assert.equal(snapshot.scheduleItems.find(row=>row.id==='widget-own').widgetCreatedV195,true);assert.equal(snapshot.scheduleItems.find(row=>row.id==='widget-own').authorUid,uid);assert.equal(snapshot.scheduleItems.find(row=>row.id==='s1').widgetCreatedV195,undefined);assert.equal(snapshot.scheduleItems.find(row=>row.id==='widget-other').widgetCreatedV195,undefined);assert.equal(snapshot.scheduleItems.find(row=>row.id==='widget-other').authorUid,undefined);
 await adapter.commandAction(action(command('RoutineCards','routine','MINI')));await adapter.flushCommands();await Promise.resolve();assert.equal(mutations.length,1);assert.equal(mutations[0].kind,'RoutineAll');assert.equal(mutations[0].expectedUpdatedAt,10);
 await adapter.commandAction(action(command('CalendarSplit','todo','true','t1')));await adapter.flushCommands();await Promise.resolve();assert.equal(mutations.length,2);assert.equal(mutations[1].id,'t1');
 for(const row of [command('PersonalTodo','todo','true','t1'),command('TaskClientLink','todo','true','t1'),command('CalendarAgenda','todo','true','t1'),command('RoutineAll','open','health')])await adapter.commandAction(action(row));
 assert.equal(mutations.length,2);assert.equal(routes.length,0);
 stored.set(queue,JSON.stringify([command('PersonalWorkflowAll','todo','true','old-todo')]));await adapter.flushCommands();assert.equal(mutations.length,2);assert.equal(JSON.parse(stored.get(queue)).length,0);assert.equal(JSON.parse(stored.get(queue+':retired-v193')).length,1);
 await adapter.commandAction(action(command('RoutineAll','open','routine')));assert.equal(routes.at(-1),'routine');
 await adapter.commandAction(action(command('CalendarSplit','open','todo')));assert.equal(routes.at(-1),'home');assert.equal(todoOpens,1);
 const before=routes.length;context.AiderLogAppShell.openTarget('task','create-client-intake-v168:42:'+uid);context.AiderLogAppShell.openTarget('personal','add-memo');assert.equal(routes.length,before);assert.equal(todoOpens,1);
 context.AiderLogAppShell.openTarget('home','open-schedule-item-v168:'+encodeURIComponent(JSON.stringify({uid:'other-user',id:'s1',date:'2026-09-27'})));assert.equal(routes.length,before);
 context.AiderLogAppShell.openTarget('home','open-schedule-item-v168:'+encodeURIComponent(JSON.stringify({uid,id:'s1',date:'2026-09-26',selectedDate:'2026-09-27'})));assert.equal(routes.at(-1),'home');[...timers.values()].at(-1).fn();assert.deepEqual(opened.at(-1),['2026-09-27','s1']);
 context.AiderLogAppShell.openTarget('home','add-schedule:2026-09-28');assert.equal(routes.at(-1),'home');[...timers.values()].at(-1).fn();assert.deepEqual(opened.at(-1),['2026-09-28']);
 await adapter.commandAction(action(command('RoutineStats','open','routine')));assert.equal(routes.at(-1),'routine');
 await adapter.commandAction(action(command('RoutineAll','open','routine-stats')));assert.equal(routes.at(-1),'routine');assert.equal(statsOpens,1);await adapter.commandAction(action(command('RoutineAll','open','routine-stats','r1','other-user')));assert.equal(statsOpens,1);
 const memo={...command('CalendarSplit','open','note','m1'),source:'memos'};await adapter.commandAction(action(memo));assert.deepEqual(memoCalls,['refresh',['open','memo'],['edit','memos','m1','memo']]);assert.equal(mutations.length,2);
 await adapter.commandAction(action({...memo,source:'finance'}));assert.equal(memoCalls.length,3);await adapter.commandAction(action({...memo,uid:'other-user'}));assert.equal(memoCalls.length,3);
 await adapter.commandAction(action({...memo,source:'checklists'}));assert.deepEqual(memoCalls.at(-1),['edit','checklists','m1','memo']);assert.equal(mutations.length,2);
 stored.set(queue,JSON.stringify([command('RoutineCards','routine','MAX','r1')]));await adapter.flushCommands();assert.equal(mutations.length,3);assert.equal(mutations.at(-1).kind,'RoutineAll');assert.equal(mutations.at(-1).value,'MAX');assert.equal(JSON.parse(stored.get(queue)).length,0);
 await adapter.commandAction(action(command('RoutineStats','open','routine','r1','other-user')));assert.equal(mutations.length,3);
 const count=memoCalls.length;context.AiderTodoV179.refresh=async()=>{state.user={uid:'switched-user'};};await adapter.commandAction(action(memo));assert.equal(memoCalls.length,count);
 console.log('PASS widget adapter: schedule/routine/todo projection, retained mutations, UID checks, retired pending-intent/queue rejection, calendar links');
})().catch(error=>{console.error(error);process.exitCode=1});
