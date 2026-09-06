const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
const source=fs.readFileSync(path.join(__dirname,'widget-privacy-test-v164.cjs'),'utf8').split('(async()=>{')[0];
const context={require,__dirname,console};vm.createContext(context);vm.runInContext(source+';this.harness=harness;this.tick=tick;',context);
function harness(){const h=context.harness();h.ctx.decodeURIComponent=decodeURIComponent;h.ctx.CustomEvent=class{constructor(type,options){this.type=type;this.detail=options.detail}};h.events=[];h.ctx.dispatchEvent=e=>h.events.push(e);return h;}
const cmd=(over={})=>({uid:'A',key:'test-key',op:'todo',id:'task',date:'2026-09-06',value:'true',expectedUpdatedAt:10,...over});
const send=(h,command)=>h.widget.commandAction('widget-v165:'+encodeURIComponent(JSON.stringify(command)));
(async()=>{
 let h=harness();h.rows.A.personal={checklists:[{id:'task',text:'Task',updatedAt:10,done:false}]};h.ctx.P=h.rows.A.personal;await h.widget.refresh();let calls=0;h.api.applyWidgetActionV165=async command=>{calls++;return {payload:{checklists:[{...h.rows.A.personal.checklists[0],done:true,updatedAt:20}]}}};await send(h,cmd());await context.tick();assert.equal(calls,1);assert.equal(JSON.parse(h.localStorage['aiderlog.widget-actions.v165:A']).length,0);assert.equal(h.events[0].detail.localBefore,JSON.stringify(h.rows.A.personal.checklists[0]));assert.equal(h.events[0].detail.command.id,'task');assert.equal(h.events[0].detail.payload.checklists[0].done,true);
 console.log('PASS desired action calls atomic helper and emits unchanged-row contract');
 for(const code of ['widget/stale-action','widget/invalid-action','widget/not-found','widget/replay-mismatch','widget/invalid-data','permission-denied']){h=harness();await h.widget.refresh();h.api.applyWidgetActionV165=async()=>{throw Object.assign(Error(code),{code})};await send(h,cmd());await context.tick();assert.equal(JSON.parse(h.localStorage['aiderlog.widget-actions.v165:A']).length,0,code);assert.equal(JSON.parse(h.localStorage['aiderlog.widget-actions.v165:A:failed']).length,1,code);}
 console.log('PASS permanent failures leave active queue and preserve scoped failed drafts');
 h=harness();await h.widget.refresh();h.api.applyWidgetActionV165=async()=>{throw Object.assign(Error('offline'),{code:'unavailable'})};await send(h,cmd());await context.tick();assert.equal(JSON.parse(h.localStorage['aiderlog.widget-actions.v165:A']).length,1);calls=0;h.api.applyWidgetActionV165=async()=>{calls++;return {payload:{checklists:[]}}};h.emit('B');await h.widget.refresh();await h.widget.flushCommands();assert.equal(calls,0);h.emit('A');await h.widget.refresh();await context.tick();assert.equal(calls,1);
 console.log('PASS offline queue remains owner-scoped and resumes only for same owner');
 h=harness();await h.widget.refresh();calls=0;h.api.applyWidgetActionV165=async()=>{calls++;return{}};await send(h,cmd({uid:'B'}));await context.tick();assert.equal(calls,0);assert(!h.localStorage['aiderlog.widget-actions.v165:B']);
 h=harness();await h.widget.refresh();let resolve;h.api.applyWidgetActionV165=()=>new Promise(r=>resolve=r);await send(h,cmd());h.emit('B');resolve({payload:{checklists:[{id:'secret',text:'SECRET A'}]}});await context.tick();assert.equal(h.events.length,0);assert(!JSON.stringify(h.widget.snapshot()).includes('SECRET A'));
 console.log('PASS cross-owner payload and late transaction result cannot mutate active owner');
 assert(fs.readFileSync(path.join(__dirname,'widget-sync-v164.js'),'utf8').includes('input.maxLength=180'));
 console.log('Widget action routing regression: all checks passed.');
})().catch(error=>{console.error(error);process.exitCode=1});
