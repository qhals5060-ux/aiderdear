// Actual Android D-day UI module with isolated in-memory API/clock doubles.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'android-src/assets/app-dday-v175.js'),'utf8');
const display=fs.readFileSync(path.join(root,'dday-display-v176.js'),'utf8');
const plain=x=>JSON.parse(JSON.stringify(x));
const row=(id,date='2026-09-12',sourceScope='user:u1',title=id)=>({id,date,sourceScope,title,mode:'countdown'});
const snapshot=(items,activeId=items[0]?.id||'',activeScope=items[0]?.sourceScope||'')=>({items,activeId,activeScope});
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b});return{promise,resolve,reject}};
const settle=async()=>{for(let i=0;i<20;i++)await Promise.resolve()};
function fixture({store={value:snapshot([row('hero','2027-01-01'),row('near','2026-09-13'),row('past','2026-09-11')])},read,mutate,uid='u1'}={}){
  let clock=Date.parse('2026-09-12T03:00:00Z'),homes=0,timerSerial=0,dialog=null;
  const state={user:uid?{uid}:null,pair:null},calls=[],events=new Map(),docs=new Map(),timers=new Map();
  const on=map=>(name,fn)=>{if(!map.has(name))map.set(name,[]);map.get(name).push(fn)};
  const api={getState:()=>state,readDdayData:async()=>{calls.push({type:'read'});return read?read():plain(store.value)},mutateDday:async action=>{calls.push(plain(action));if(mutate)return mutate(action);store.value={...store.value,activeId:action.id,activeScope:action.sourceScope};return plain(store.value)}};
  const window={AiderDearFirebase:api,addEventListener:on(events),renderHome:()=>homes++};
  const document={visibilityState:'visible',addEventListener:on(docs),body:{appendChild(){}},createElement:()=>{
    const handlers=new Map(),nodes=new Map(),node=selector=>{if(!nodes.has(selector))nodes.set(selector,{innerHTML:'',textContent:'',hidden:false,disabled:false,focus(){},addEventListener(){}});return nodes.get(selector)};
    dialog={handlers,nodes,innerHTML:'',className:'',classList:{add(){},remove(){}},remove(){dialog=null},addEventListener:on(handlers),querySelector:node,querySelectorAll:()=>[...nodes.values()]};return dialog;
  }};
  class Clock extends Date{constructor(...args){super(...(args.length?args:[clock]))}static now(){return clock}}
  const context=vm.createContext({window,document,Date:Clock,console,alert(){},setInterval:(fn,ms)=>{const id=++timerSerial;timers.set(id,{fn,ms});return id},clearInterval:id=>timers.delete(id)});
  vm.runInContext(display,context);vm.runInContext(source,context);
  const fire=async(map,name,event={})=>{for(const fn of map.get(name)||[])await fn(event)};
  return{api:window.AiderAppDdayV175,transport:api,state,calls,timers,store,context,events,homes:()=>homes,markup:()=>window.AiderAppDdayV175.cardMarkup(),
    event:name=>fire(events,name),time:iso=>{clock=Date.parse(iso)},rerun:()=>vm.runInContext(source,context),
    controlsDisabled:()=>dialog&&[...dialog.nodes.values()].some(node=>node.disabled),
    click:async(id,scope='user:u1')=>{if(!dialog)await window.AiderAppDdayV175.open();if(!dialog)return;const index=store.value.items.findIndex(item=>item.id===id&&item.sourceScope===scope);return fire(dialog.handlers,'click',{target:{closest:selector=>selector==='[data-dday-select-v175]'?{dataset:{ddaySelectV175:String(index)}}:null}})}};
}
test('Android representative is the only home button and compact dates are sorted information rows',async()=>{
  const f=fixture();await f.api.refresh();const html=f.markup();assert.match(html,/<h2>hero<\/h2>/);assert(html.indexOf('aria-label="near D-1"')<html.indexOf('aria-label="past D+1"'));
  assert.equal((html.match(/<button/g)||[]).length,1);assert.equal((html.match(/<\/button>/g)||[]).length,1);assert.match(html,/<\/button><div class="dday-secondary/);assert.equal(f.calls.filter(c=>c.type!=='read').length,0);
  assert.equal((html.match(/role="listitem"/g)||[]).length,2);assert.doesNotMatch(html,/data-dday-featured-v176|dday-small-date-v176/);assert.doesNotMatch(source,/document\.addEventListener\('click'|data-dday-featured-v176/);
  const css=fs.readFileSync(path.join(root,'dday-display-v176.css'),'utf8');assert.match(css,/#home\.schedule-cosmic-v119 \.dday-display-v176>\.dday-secondary-v176\{[^}]*gap:0;max-height:60px/);assert.match(css,/#home\.schedule-cosmic-v119 \.dday-secondary-v176>\.dday-compact-row-v176\{[^}]*min-height:20px;padding:1px 0/);
  assert.match(css,/^\.dday-secondary-v176\{display:grid;gap:3px;max-height:132px/m,'site list spacing stays unchanged');assert.match(css,/\.dday-small-title-v176\{font-size:11px!important/);assert.match(css,/\.dday-small-count-v176\{font-size:13px!important/);
});
test('Android management-dialog choice persists through a new UI instance and shared cloud resets',async()=>{
  const f=fixture();await f.api.refresh();await f.click('near');assert.equal(f.api.selected().id,'near');assert.deepEqual(f.calls.at(-1),{type:'select',id:'near',sourceScope:'user:u1'});
  await f.event('aiderdear-firebase-state');assert.equal(f.api.selected().id,'near');const reopened=fixture({store:f.store});await reopened.api.refresh();assert.equal(reopened.api.selected().id,'near');
});
test('Android identical IDs in personal and pair scopes select only the requested record',async()=>{
  const f=fixture({store:{value:snapshot([row('same','2026-09-13','user:u1','개인'),row('same','2026-09-14','pair:p1','커플')])}});await f.api.refresh();await f.click('same','pair:p1');assert.equal(f.api.selected().title,'커플');assert.match(f.markup(),/dday-small-title-v176" title="개인">개인/);
});
test('Android selection error retains both lists, blocks duplicates in flight, and permits retry',async()=>{
  const job=deferred(),f=fixture({mutate:()=>job.promise});await f.api.refresh();const first=f.click('near');await settle();assert.equal(f.controlsDisabled(),true);assert.match(f.markup(),/저장하는 중/);await f.click('past');assert.equal(f.calls.filter(c=>c.type==='select').length,1);
  job.reject(Error('offline'));await first;assert.equal(f.api.selected().id,'hero');assert.match(f.markup(),/저장 상태 확인/);assert.equal(f.controlsDisabled(),false);
  f.transport.mutateDday=async()=>snapshot(f.store.value.items,'near','user:u1');await f.click('near');assert.equal(f.api.selected().id,'near');
});
test('Android malformed read and mutation acknowledgements never replace the confirmed selection',async()=>{
  const f=fixture();await f.api.refresh();f.transport.readDdayData=async()=>({items:null});await f.api.refresh(true);assert.equal(f.api.selected().id,'hero');
  f.transport.mutateDday=async()=>({items:[{}],activeId:'bad',activeScope:'user:u1'});await f.click('near');assert.equal(f.api.selected().id,'hero');assert.match(f.markup(),/저장 상태 확인/);
});
test('Android late selection after logout cannot repopulate the previous account',async()=>{
  const job=deferred(),f=fixture({mutate:()=>job.promise});await f.api.refresh();const pending=f.click('near');await settle();f.state.user=null;await f.event('aiderdear-firebase-state');assert.equal(f.api.selected(),null);assert.doesNotMatch(f.markup(),/dday-small-title/);
  job.resolve(snapshot(f.store.value.items,'near','user:u1'));await pending;assert.equal(f.api.selected(),null);assert.match(f.markup(),/로그인 후/);
});
test('Android relogin to the same UID rejects an earlier session selection acknowledgement',async()=>{
  const job=deferred(),f=fixture({mutate:()=>job.promise});await f.api.refresh();const pending=f.click('near');await settle();
  f.state.user=null;await f.event('aiderdear-firebase-state');f.state.user={uid:'u1'};
  f.transport.readDdayData=async()=>snapshot([row('fresh-session','2026-10-01')]);await f.event('aiderdear-firebase-state');await f.api.refresh();
  job.resolve(snapshot(f.store.value.items,'near','user:u1'));await pending;
  assert.equal(f.api.selected().id,'fresh-session');assert.doesNotMatch(f.markup(),/aria-label="near D-1"/);
});
test('Android account switch keeps the new account load pending when the old selection finishes',async()=>{
  const old=deferred(),next=deferred(),f=fixture({mutate:()=>old.promise});await f.api.refresh();const pending=f.click('near');await settle();
  f.state.user={uid:'u2'};f.transport.readDdayData=()=>next.promise;await f.event('aiderdear-firebase-state');await settle();
  assert.equal(f.api.selected(),null);old.resolve(snapshot(f.store.value.items,'near','user:u1'));await pending;assert.equal(f.api.selected(),null);assert.match(f.markup(),/불러오는 중/);
  next.resolve(snapshot([row('account-b','2026-09-14','user:u2')]));await f.api.refresh();
  assert.equal(f.api.selected().sourceScope,'user:u2');assert.equal(f.api.selected().id,'account-b');assert.doesNotMatch(f.markup(),/\bhero\b|\bnear\b/);
});
test('Android quota cooldown stops repeated reads and selections without clearing persisted data',async()=>{
  let reads=0;const f=fixture();await f.api.refresh();f.transport.readDdayData=async()=>{reads++;throw Object.assign(Error('quota'),{code:'firestore/resource-exhausted'})};await f.api.refresh(true);await f.api.refresh(true);await f.event('focus');await f.event('online');await f.click('near');assert.equal(reads,1);assert.equal(f.calls.filter(c=>c.type==='select').length,0);assert.equal(f.api.selected().id,'hero');
  f.time('2026-09-12T03:05:01Z');f.transport.readDdayData=async()=>{reads++;return plain(f.store.value)};await f.api.refresh(true);assert.equal(reads,2);assert.doesNotMatch(f.markup(),/저장 상태 확인/);
});
test('Android timer is single-installed, stops for pagehide, and resumes without network writes',async()=>{
  const f=fixture();await f.api.refresh();f.rerun();assert.equal(f.timers.size,1);assert.equal(f.events.get('aiderdear-firebase-state').length,1);assert.equal([...f.timers.values()][0].ms,60000);
  await f.event('pagehide');assert.equal(f.timers.size,0);f.time('2026-09-12T15:00:00Z');const before=f.homes();await f.event('pageshow');await f.event('pageshow');assert.equal(f.timers.size,1);assert.equal(f.homes(),before+1);assert.equal(f.calls.length,1);assert.match(f.markup(),/near D-DAY/);
});
test('Android escapes stored D-day markup and does not expose rows for guests',async()=>{
  const f=fixture({store:{value:snapshot([row('hero'),row('bad','2026-09-13','user:u1','<img src=x onerror=alert(1)>')])}});await f.api.refresh();assert.match(f.markup(),/&lt;img/);assert.doesNotMatch(f.markup(),/<img/);
  const guest=fixture({uid:''});await guest.api.refresh();assert.equal(guest.calls.length,0);assert.doesNotMatch(guest.markup(),/data-dday-featured-v176=/);
});
test('site and Android entrypoints preload the same D-day helper and styles offline',()=>{
  for(const folder of['','android-src/assets/']){
    const index=fs.readFileSync(path.join(root,folder,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,folder,'sw.js'),'utf8');
    const context={URL,self:{location:{href:'https://aiderdear1.vercel.app/sw.js'},addEventListener(){}}};
    vm.runInNewContext(sw+';globalThis.precache=[...APP_SHELL]',context);
    for(const file of['dday-display-v176.js','dday-display-v176.css']){
      assert(index.includes(file+'?v=176'));assert(context.precache.includes('./'+file));assert(context.precache.includes('./'+file+'?v=176'));
      assert.equal(fs.readFileSync(path.join(root,folder,file),'utf8'),fs.readFileSync(path.join(root,file),'utf8'));
      assert.equal(fs.readFileSync(path.resolve(root,'../AiderLog-v145-decoded/assets',file),'utf8'),fs.readFileSync(path.join(root,file),'utf8'));
    }
  }
  assert.equal(source,fs.readFileSync(path.resolve(root,'../AiderLog-v145-decoded/assets/app-dday-v175.js'),'utf8'));
  assert.equal(fs.readFileSync(path.join(root,'android-src/assets/index.html'),'utf8'),fs.readFileSync(path.resolve(root,'../AiderLog-v145-decoded/assets/index.html'),'utf8'));
});
