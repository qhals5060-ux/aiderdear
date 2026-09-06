const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const adapter = fs.readFileSync(path.resolve(__dirname, 'widget-sync-v164.js'), 'utf8');
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const tick = async () => { for(let i=0;i<8;i++) await Promise.resolve(); };
function harness(initialUid='A', storage={}) {
  let state = initialUid ? { user:{uid:initialUid,email:`${initialUid}@example.test`},ready:true } : {user:null,ready:true};
  const events={}, subs=[], sent=[], images=[], revoked=[], timers=new Map();let timerId=0;
  const rows={A:{app:{scheduleEvents:[{id:'a',title:'A schedule',date:today()}]},personal:{routines:[{title:'A routine'}]}}, B:{app:{scheduleEvents:[]},personal:{routines:[{title:'B routine'}]}}};
  const localStorage={getItem:key=>Object.hasOwn(localStorage,key)?localStorage[key]:null,setItem:(key,value)=>{localStorage[key]=String(value)},removeItem:key=>delete localStorage[key],...storage};
  for(const key of ['getItem','setItem','removeItem'])Object.defineProperty(localStorage,key,{enumerable:false});
  const api={getState:()=>state,subscribe:fn=>{subs.push(fn);fn(state)},readAppData:async()=>rows[state.user.uid].app,readPrivateData:async()=>rows[state.user.uid].personal,readScheduleData:async()=>({own:[],shared:[]}),readPrivateMedia:async()=>({}),writeAppData:async()=>{},writePrivateData:async()=>{},writeScheduleData:async()=>{},logout:()=>Promise.resolve()};
  const doc={documentElement:{dataset:{theme:'saturn'}},body:{},hidden:false,addEventListener:(name,fn)=>{(events[name]??=[]).push(fn)},querySelector:()=>null,createElement:tag=>tag==='canvas'?{width:0,height:0,getContext:()=>({drawImage:(image)=>{doc.imageSource=image.src}}),toDataURL:()=>`data:image/jpeg;base64,${doc.imageSource}`}:{}};
  const ctx={console,Date,Intl,Set,Map,JSON,Object,Array,String,Number,Boolean,Math,Promise,encodeURIComponent,localStorage,document:doc,location:{hash:''},A:{scheduleEvents:[{id:'legacy',title:'LEGACY SECRET',date:today()}]},P:{routines:[{title:'LEGACY SECRET'}]},MutationObserver:class {observe(){}},Image:class {constructor(){this.width=180;this.height=140;images.push(this)}},URL:{createObjectURL:()=>`blob:meal-${images.length}`,revokeObjectURL:url=>revoked.push(url)},setTimeout:(fn,delay)=>{const id=++timerId;timers.set(id,{fn,delay});return id},clearTimeout:id=>timers.delete(id),addEventListener:(name,fn)=>{(events[name]??=[]).push(fn)}};
  ctx.window=ctx;ctx.AiderDearFirebase=api;ctx.AiderLogNative={syncWidgets:payload=>sent.push(JSON.parse(payload))};
  vm.createContext(ctx);vm.runInContext(adapter,ctx,{filename:'widget-sync-v164.js'});
  const emit=(uid,pair)=>{state={user:uid?{uid,email:`${uid}@example.test`}:null,pair:pair?{id:pair}:null,ready:true};subs.forEach(fn=>fn(state));};
  const flush=async delay=>{const pending=[...timers].filter(([,item])=>item.delay===delay);for(const [id,item]of pending){timers.delete(id);item.fn()}await tick()};
  return {ctx,api,rows,sent,images,revoked,localStorage,emit,flush,widget:ctx.AiderWidgetSyncV164};
}
(async()=>{
  const h=harness('A',{'aiderlog-private-v20':JSON.stringify({routines:[{title:'LEGACY SECRET'}]}),'aiderlog-language-shorts-v118':JSON.stringify({notes:[{phrase:'LEGACY SECRET'}]})});
  assert.equal(h.sent.at(-1).accessState,'sync-required');
  assert(!JSON.stringify(h.widget.snapshot()).includes('LEGACY SECRET'));
  h.rows.A.personal={routines:[{title:'A routine'}],checklists:[{id:'memo',text:'A memo'},{id:'todo',text:'A todo',date:today()}],personalItems:[{id:'exercise',date:today(),category:'health',title:'Walk',minutes:32,details:{healthType:'exercise'}},{id:'meal',date:today(),category:'health',title:'Breakfast',details:{healthType:'meal',mealType:'breakfast',time:'08:15',rating:4}}],languageShortsV118:{notes:[{phrase:'A phrase',meaning:'뜻'}]}};
  h.api.readScheduleData=async()=>({own:[{id:'own',title:'Own schedule',date:today()}],shared:[{id:'shared',title:'Shared permitted schedule',date:today()}]});
  await h.widget.refresh();let shot=h.widget.snapshot();
  assert.equal(shot.scheduleItems.length,3);assert.equal(shot.memos.length,1);assert.equal(shot.todos.length,1);assert.equal(shot.memoTodos.length,2);assert.equal(shot.mealTimes[0],'08:15');assert(shot.workouts[0].includes('32분'));assert.equal(shot.youtubeNotes[0],'A phrase · 뜻');
  assert(!JSON.stringify(shot).includes('LEGACY SECRET'));
  h.emit('B');assert.equal(h.sent.at(-1).scheduleItems.length,0);assert.equal(h.sent.at(-1).mealPhotos.filter(Boolean).length,0);assert.equal(h.sent.at(-1).accessState,'sync-required');
  assert(!JSON.stringify(h.widget.snapshot()).includes('A routine'));
  const readApp=h.api.readAppData;h.api.readAppData=()=>Promise.reject(Error('permission-denied'));await h.widget.refresh();assert.equal(h.widget.snapshot().accessState,'sync-required');h.api.readAppData=readApp;
  h.rows.B.app={scheduleEvents:[]};h.api.readScheduleData=async()=>({own:[],shared:[]});await h.widget.refresh();assert.equal(h.widget.snapshot().routines[0],'B routine');
  h.api.logout();assert.equal(h.sent.at(-1).accessState,'needs-login');assert.equal(h.widget.snapshot().routines.length,0);
  h.emit(null);assert.equal(h.widget.snapshot().mealPhotos.filter(Boolean).length,0);
  console.log('PASS initial legacy isolation, authoritative calendar source, memo/schema mapping, immediate account switch and logout');

  const race=harness('A'),oldApp=deferred(),oldPrivate=deferred();
  race.api.readAppData=()=>race.api.getState().user.uid==='A'?oldApp.promise:Promise.resolve(race.rows.B.app);
  race.api.readPrivateData=()=>race.api.getState().user.uid==='A'?oldPrivate.promise:Promise.resolve(race.rows.B.personal);
  const pending=race.widget.refresh();race.emit('B');await race.widget.refresh();oldApp.resolve(race.rows.A.app);oldPrivate.resolve(race.rows.A.personal);await pending;
  assert.equal(race.widget.snapshot().routines[0],'B routine');assert(!JSON.stringify(race.widget.snapshot()).includes('A schedule'));
  race.emit('B','new-pair');assert.equal(race.sent.at(-1).accessState,'sync-required');
  console.log('PASS stale out-of-order account reads and pair-scope transition');

  const media=harness('A');media.rows.A.personal.personalItems=[{id:'secret-photo',category:'health',date:today(),media:{fileId:'private-A'},details:{healthType:'meal',mealType:'breakfast'}}];
  const blob=deferred();media.api.readPrivateMedia=()=>blob.promise;await media.widget.refresh();media.emit('B');await media.widget.refresh();blob.resolve({});await tick();
  assert.equal(media.images.length,0);assert.equal(media.widget.snapshot().mealPhotos.filter(Boolean).length,0);
  const imageRace=harness('A');imageRace.rows.A.personal.personalItems=[{id:'photo',category:'health',date:today(),localImage:'data:image/jpeg;base64,OWNER_A_SECRET',details:{healthType:'meal',mealType:'breakfast'}}];
  await imageRace.widget.refresh();assert.equal(imageRace.images.length,1);imageRace.emit('B');await imageRace.widget.refresh();imageRace.images[0].onload();await tick();await imageRace.flush(250);
  assert.equal(imageRace.widget.snapshot().mealPhotos.filter(Boolean).length,0);assert(!JSON.stringify(imageRace.sent.at(-1)).includes('OWNER_A_SECRET'));
  console.log('PASS late private-media fetch and late image decode cannot republish previous owner');

  const cache=harness('A');await cache.widget.refresh();const saved={...cache.localStorage};
  const offline=harness('A',saved);offline.api.readAppData=()=>Promise.reject(Error('offline'));await offline.widget.refresh();assert.equal(offline.widget.snapshot().routines[0],'A routine');
  const other=harness('B',saved);other.api.readAppData=()=>Promise.reject(Error('offline'));await other.widget.refresh();assert.equal(other.widget.snapshot().routines.length,0);
  const guest=harness(null,saved);assert.equal(guest.widget.snapshot().accessState,'needs-login');assert.equal(guest.widget.snapshot().routines.length,0);
  console.log('PASS verified same-owner offline cache only, unknown owner/guest fail closed');

  const first=harness('B');first.rows.B={app:null,personal:null};first.api.readScheduleData=async()=>({own:[{id:'first-schedule',title:'First schedule',date:today()}],shared:[]});
  await first.widget.refresh();assert.equal(first.widget.snapshot().scheduleItems[0].title,'First schedule');assert.equal(first.widget.snapshot().routines.length,0);assert(!JSON.stringify(first.widget.snapshot()).includes('LEGACY SECRET'));
  first.api.readScheduleData=async()=>({own:[],shared:[]});await first.widget.refresh();assert.equal(first.widget.snapshot().scheduleItems.length,0);assert.notEqual(first.widget.snapshot().accessState,'sync-required');
  console.log('PASS first-install schedule-only and no-document accounts are verified empty, not legacy fallbacks');
  console.log('Widget privacy regression suite: all checks passed.');
})().catch(error=>{console.error(error);process.exitCode=1});
