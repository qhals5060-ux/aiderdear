const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const fixtureSource=fs.readFileSync(path.join(__dirname,'widget-privacy-test-v164.cjs'),'utf8').split('(async()=>{')[0].replace('return {ctx,api,rows,sent','return {events,ctx,api,rows,sent');
const box={require,__dirname,console};vm.createContext(box);vm.runInContext(fixtureSource+';this.harness=harness;',box);
function fixture(){const h=box.harness('A'),counts={app:0,private:0,schedule:0};for(const [kind,method]of Object.entries({app:'readAppData',private:'readPrivateData',schedule:'readScheduleData'})){const original=h.api[method];h.api[method]=(...args)=>{counts[kind]++;return original(...args);};}return{...h,counts,fire:(name,detail)=>{for(const fn of h.events[name]||[])fn({detail});}};}
test('native bridge shares parallel initial reads and has no reads for unrelated form/state/resume events',async()=>{
 const h=fixture();await Promise.all([h.widget.refresh(),h.widget.refresh(),h.widget.refresh()]);assert.deepEqual(h.counts,{app:1,private:1,schedule:1});
 for(let i=0;i<100;i++){h.emit('A');h.fire('change');h.fire('aiderlog:data-changed');}h.fire('visibilitychange');h.fire('pageshow');await h.flush(700);await h.flush(500);await h.flush(50);assert.deepEqual(h.counts,{app:1,private:1,schedule:1});
});
test('confirmed document and schedule snapshots feed widgets without additional cloud requests',async()=>{
 const h=fixture();await h.widget.refresh();
 h.fire('aiderdear-firebase-private-data',{uid:'A',payload:{routines:[{title:'Remote routine'}]}});
 assert.equal(h.widget.snapshot().routines[0],'Remote routine');
 h.fire('aiderlog:verified-schedule-data-v191',{uid:'A',pairId:'',payload:{own:[{id:'remote',title:'Remote schedule',date:new Date().toLocaleDateString('sv-SE')}],shared:[]}});
 assert.equal(h.widget.snapshot().scheduleItems[0].id,'remote');
 h.fire('aiderdear-firebase-data',{scope:'A:solo',payload:{scheduleEvents:[{id:'old',title:'Old legacy'}]}});
 assert.equal(h.widget.snapshot().scheduleItems[0].id,'remote','app snapshots must not replace authoritative schedules');assert.deepEqual(h.counts,{app:1,private:1,schedule:1});
});
test('native snapshot handlers reject foreign owners, changed pairs and uncommitted local writes',async()=>{
 const h=fixture();await h.widget.refresh();
 for(const detail of [{uid:'B',payload:{routines:[{title:'SECRET B'}]}},{uid:'A',hasPendingWrites:true,payload:{routines:[{title:'UNCOMMITTED'}]}}])h.fire('aiderdear-firebase-private-data',detail);
 h.fire('aiderlog:verified-schedule-data-v191',{uid:'A',pairId:'other-pair',payload:{own:[{id:'foreign',title:'SECRET',date:'2026-09-20'}],shared:[]}});
 assert.equal(h.widget.snapshot().routines[0],'A routine');assert(!JSON.stringify(h.widget.snapshot()).includes('SECRET'));assert.deepEqual(h.counts,{app:1,private:1,schedule:1});
});
test('an available owner-scoped live calendar snapshot avoids the widgets extra schedule get',async()=>{
 const h=fixture();h.ctx.AiderAppScheduleV191={snapshot:()=>({uid:'A',pairId:'',payload:{own:[],shared:[]}})};await h.widget.refresh();assert.deepEqual(h.counts,{app:1,private:1,schedule:0});
 h.ctx.AiderAppScheduleV191={snapshot:()=>({uid:'B',pairId:'',payload:{own:[],shared:[]}})};await h.widget.refresh();assert.equal(h.counts.schedule,1);
});
