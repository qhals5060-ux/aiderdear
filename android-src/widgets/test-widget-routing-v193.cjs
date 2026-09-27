const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const assets=path.join(__dirname,'../assets'),modelModule={exports:{}};
vm.runInNewContext(fs.readFileSync(path.join(assets,'widget-models-v165.js'),'utf8'),{module:modelModule,exports:modelModule.exports,Date});
const models=modelModule.exports;
const uid='scope-user-a',owner=uid+'|solo',privateData={routines:[{id:'r1',title:'Routine',updatedAt:10}],checklists:[{id:'t1',title:'Task',updatedAt:20},{id:'memo',title:'Memo',kind:'memo'}],records:[{id:'health',type:'health'}]};
const stored=new Map([[`aiderlog.widgets.verified.v164:${encodeURIComponent(owner)}`,JSON.stringify({owner,app:{scheduleEvents:[{id:'s1',title:'Calendar',date:'2026-09-27'}]},personal:privateData})]]);
const mutations=[],routes=[],opened=[],timers=new Map();let timerId=0,todoOpens=0;
const state={user:{uid,email:'example@invalid.test'},pair:null};
const context={console,Intl,Date,Set,Map,URL,URLSearchParams,Promise,encodeURIComponent,decodeURIComponent,
  document:{documentElement:{dataset:{theme:'system'}},body:{},addEventListener(){},querySelector(selector){return selector==='#quickMemoBtn'?{click(){todoOpens++}}:null;}},
  localStorage:{getItem:key=>stored.get(key)||null,setItem:(key,value)=>stored.set(key,String(value))},
  MutationObserver:class{observe(){}},CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail}},
  setTimeout:(fn,delay)=>{timers.set(++timerId,{fn,delay});return timerId},clearTimeout:id=>timers.delete(id),
  addEventListener(){},dispatchEvent(){},go:page=>routes.push(page),location:{hash:''},P:privateData,
  AiderLogNative:{syncWidgets(){}},AiderWidgetModelsV165:models,
  AiderLogCalendarV125:{openSchedule:(...args)=>opened.push(args)},
  AiderLogAppShell:{openTarget(target){routes.push(({private:'routine',schedule:'home',home:'home',routine:'routine'})[target]||'home')}},
  AiderDearFirebase:{getState:()=>state,subscribe:fn=>fn(state),readAppData:async()=>({}),readPrivateData:async()=>privateData,readScheduleData:async()=>[],applyWidgetActionV165:async command=>{mutations.push(command);return{payload:privateData}}}
};context.window=context;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(assets,'widget-sync-v164.js'),'utf8'),context);
const adapter=context.AiderWidgetSyncV164,action=command=>'widget-v165:'+encodeURIComponent(JSON.stringify(command)),queue=`aiderlog.widget-actions.v165:${uid}`;
const command=(kind,op,value,id='r1',user=uid)=>({kind,op,value,id,uid:user,key:kind+':'+op+':'+value,expectedUpdatedAt:10,date:'2026-09-27',widgetId:42});
(async()=>{
 const snapshot=adapter.snapshot();assert.equal(snapshot.version,193);assert.equal(snapshot.v165.uid,uid);assert.equal(snapshot.scheduleItems.length,1);assert.equal(snapshot.v165.todos.length,1);assert.equal(snapshot.v165.routines.length,1);assert.equal(snapshot.v165.meals,undefined);assert.equal(snapshot.mealPhotos,undefined);
 await adapter.commandAction(action(command('RoutineCards','routine','MINI')));await adapter.flushCommands();await Promise.resolve();assert.equal(mutations.length,1);assert.equal(mutations[0].kind,'RoutineCards');assert.equal(mutations[0].expectedUpdatedAt,10);
 await adapter.commandAction(action(command('CalendarSplit','todo','true','t1')));await adapter.flushCommands();await Promise.resolve();assert.equal(mutations.length,2);assert.equal(mutations[1].id,'t1');
 for(const row of [command('PersonalTodo','todo','true','t1'),command('TaskClientLink','todo','true','t1'),command('CalendarAgenda','todo','true','t1','other-user'),command('RoutineAll','open','health')])await adapter.commandAction(action(row));
 assert.equal(mutations.length,2);assert.equal(routes.length,0);
 stored.set(queue,JSON.stringify([command('PersonalWorkflowAll','todo','true','old-todo')]));await adapter.flushCommands();assert.equal(mutations.length,2);assert.equal(JSON.parse(stored.get(queue)).length,0);assert.equal(JSON.parse(stored.get(queue+':retired-v193')).length,1);
 await adapter.commandAction(action(command('RoutineAll','open','routine')));assert.equal(routes.at(-1),'routine');
 await adapter.commandAction(action(command('CalendarSplit','open','todo')));assert.equal(routes.at(-1),'home');assert.equal(todoOpens,1);
 const before=routes.length;context.AiderLogAppShell.openTarget('task','create-client-intake-v168:42:'+uid);context.AiderLogAppShell.openTarget('personal','add-memo');assert.equal(routes.length,before);assert.equal(todoOpens,1);
 context.AiderLogAppShell.openTarget('home','open-schedule-item-v168:'+encodeURIComponent(JSON.stringify({uid:'other-user',id:'s1',date:'2026-09-27'})));assert.equal(routes.length,before);
 context.AiderLogAppShell.openTarget('home','open-schedule-item-v168:'+encodeURIComponent(JSON.stringify({uid,id:'s1',date:'2026-09-26',selectedDate:'2026-09-27'})));assert.equal(routes.at(-1),'home');[...timers.values()].at(-1).fn();assert.deepEqual(opened.at(-1),['2026-09-27','s1']);
 context.AiderLogAppShell.openTarget('home','add-schedule:2026-09-28');assert.equal(routes.at(-1),'home');[...timers.values()].at(-1).fn();assert.deepEqual(opened.at(-1),['2026-09-28']);
 console.log('PASS widget adapter: schedule/routine/todo projection, retained mutations, UID checks, retired pending-intent/queue rejection, calendar links');
})().catch(error=>{console.error(error);process.exitCode=1});
