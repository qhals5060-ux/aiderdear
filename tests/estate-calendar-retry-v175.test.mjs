// Exercise the actual projection module with no browser, real account or API.
// DOM-render feedback is modeled by the same window events and observers that
// used to start an unbounded failed refresh cycle in a visible native home.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const original=fs.readFileSync(new URL('../estate-calendar-v171.js',import.meta.url),'utf8');
const source=original.replace(/^import[^\n]*\n/,'');
const flush=async()=>{for(let i=0;i<50;i++)await Promise.resolve();};
const defer=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return{promise,resolve,reject};};
const error=(code,message='isolated API unavailable',extra={})=>Object.assign(Error(message),{code,...extra});
class Events{
  constructor(){this.listeners=new Map();}
  addEventListener(name,handler){if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(handler);}
  dispatchEvent(event){for(const fn of this.listeners.get(event.type)||[])fn(event);return true;}
  emit(type){this.dispatchEvent({type});}
}
function fixture({native=true}={}){
  let now=Date.parse('2026-09-12T06:00:00Z'),actor='owner-a',known='',handler=async()=>({rows:[],cursor:null}),feedback=false,feedbackEmits=0;
  const calls=[],observers=[],win=new Events(),doc=new Events(),app={dataset:{activeTab:'schedule'}},home={visible:true};
  class Clock extends Date{constructor(...args){super(...(args.length?args:[now]));}static now(){return now;}}
  doc.visibilityState='hidden';doc.documentElement={classList:{contains:()=>false}};
  doc.getElementById=id=>id==='app'?app:id==='home'?home:null;
  doc.querySelector=selector=>selector==='#home.view.on'&&home.visible?home:null;
  win.AiderDearFirebase={getState:()=>({user:actor?{uid:actor,email:actor+'@example.test'}:null})};
  if(native)win.AiderLogNative={};
  class Observer{constructor(fn){this.fn=fn;}observe(target){observers.push({target,fn:this.fn});}}
  const createEstateClient=onIdentityChange=>({
    identity(){if(actor!==known){known=actor;onIdentityChange(known);}return known;},
    async call(action,payload){assert.equal(action,'calendar');const call={actor,action,payload,at:now};calls.push(call);return handler(call);}
  });
  vm.runInNewContext(source,{window:win,document:doc,Date:Clock,createEstateClient,MutationObserver:Observer,CustomEvent:class{constructor(type){this.type=type;}},location:{search:''},URLSearchParams,console});
  const api=win.AiderEstateCalendarV171;
  const observe=()=>observers.forEach(row=>row.fn([{type:'attributes',target:row.target}]));
  // A finite cap prevents an unfixed implementation hanging the regression
  // process. The assertion still fails as soon as it sends redundant requests.
  win.addEventListener('aiderlog-estate-calendar',()=>{
    if(!feedback||++feedbackEmits>12)return;
    Promise.resolve().then(()=>{api.refresh();observe();});
  });
  return{api,win,doc,app,home,calls,observe,now:()=>now,advance:ms=>{now+=ms;},setHandler:fn=>{handler=fn;},setActor:value=>{actor=value;},feedback:()=>{feedback=true;},show:()=>{doc.visibilityState='visible';},async refresh(force=false){await api.refresh(force);await flush();},async storm(){
    for(let i=0;i<12;i++){
      void api.refresh(true);observe();win.emit('online');win.emit('aiderdear-firebase-state');win.emit('hashchange');win.emit('aiderlog-estate-updated');doc.emit('visibilitychange');
    }
    await flush();
  }};
}
async function seed(f){f.show();f.setHandler(async()=>({rows:[{id:'confirmed',title:'기존 업무',date:'2026-09-12',time:'09:00'}],cursor:null}));await f.refresh();assert.equal(f.calls.length,1);assert.equal(f.api.rows()[0].id,'confirmed');}

for(const native of [true,false])test(`${native?'native':'site'}: API error/render/observer loop preserves last data and waits one minute even for forced refresh`,async()=>{
  const f=fixture({native});await seed(f);f.feedback();f.setHandler(async()=>{throw error('unavailable');});
  await f.refresh(true);assert.equal(f.calls.length,2);assert.ok(f.api.status().error);assert.equal(f.api.rows()[0].id,'confirmed');
  await f.storm();assert.equal(f.calls.length,2,'events and force cannot bypass cooldown');
  f.advance(59999);await f.storm();assert.equal(f.calls.length,2);assert.equal(f.api.rows()[0].id,'confirmed');
  f.setHandler(async()=>({rows:[{id:'recovered',date:'2026-09-13'}],cursor:null}));f.advance(1);await f.refresh();
  assert.equal(f.calls.length,3);assert.equal(f.api.rows()[0].id,'recovered');assert.equal(f.api.status().error,'');
  f.observe();f.win.emit('online');await flush();assert.equal(f.calls.length,3,'successful redraw uses normal freshness window');
});

for(const [name,failure] of [
  ['Firestore quota code',()=>error('resource-exhausted')],
  ['HTTP 429',()=>error('', 'Too many requests',{status:429})],
  ['backend-wrapped RESOURCE_EXHAUSTED',()=>error('', '8 RESOURCE_EXHAUSTED: Quota exceeded.',{status:500})]
])test(`${name}: initial failure waits at least five minutes without deleting or inventing rows`,async()=>{
  const f=fixture();f.show();f.feedback();f.setHandler(async()=>{throw failure();});await f.refresh();assert.equal(f.calls.length,1);assert.deepEqual(Array.from(f.api.rows()),[]);
  await f.storm();f.advance(60000);await f.storm();f.advance(239999);await f.refresh(true);assert.equal(f.calls.length,1);
  f.setHandler(async()=>({rows:[{id:'after-quota',date:'2026-09-12'}],cursor:null}));f.advance(1);await f.refresh();assert.equal(f.calls.length,2);assert.equal(f.api.rows()[0].id,'after-quota');
});

test('forced invalidation while request is in flight cannot trigger immediate retry after quota failure',async()=>{
  const f=fixture();await seed(f);const pending=defer();f.setHandler(()=>pending.promise);
  const reading=f.api.refresh(true);for(let i=0;i<5;i++){f.win.emit('aiderlog-estate-updated');void f.api.refresh(true);}
  pending.reject(error('resource-exhausted'));await reading;await flush();
  assert.equal(f.calls.length,2,'queued save invalidations respect the failure cooldown');assert.equal(f.api.rows()[0].id,'confirmed');assert.ok(f.api.status().error);
  await f.storm();assert.equal(f.calls.length,2);
});

test('account switch resets its old error/cooldown and never shows the former owner snapshot',async()=>{
  const f=fixture();await seed(f);f.setHandler(async()=>{throw error('resource-exhausted');});await f.refresh(true);assert.equal(f.calls.length,2);
  f.setActor('owner-b');assert.deepEqual(Array.from(f.api.rows()),[]);assert.equal(f.api.status().error,'');
  f.setHandler(async call=>({rows:[{id:call.actor+'-only',date:'2026-09-12'}],cursor:null}));f.win.emit('aiderdear-firebase-state');await flush();
  assert.equal(f.calls.length,3);assert.equal(f.calls[2].actor,'owner-b');assert.equal(f.api.rows()[0].id,'owner-b-only');
  f.setActor('');f.win.emit('aiderdear-firebase-state');await flush();assert.deepEqual(Array.from(f.api.rows()),[]);assert.equal(f.calls.length,3);
});

test('late quota failure from a former account cannot delay the newly signed-in account',async()=>{
  const f=fixture();await seed(f);const old=defer();f.setHandler(()=>old.promise);const reading=f.api.refresh(true);
  f.setActor('owner-b');f.api.rows();f.setHandler(async()=>({rows:[{id:'new-owner',date:'2026-09-12'}],cursor:null}));
  old.reject(error('resource-exhausted'));await reading;await flush();f.win.emit('aiderdear-firebase-state');await flush();
  assert.equal(f.calls.length,3);assert.equal(f.api.rows()[0].id,'new-owner');assert.equal(f.api.status().error,'');
});

test('hidden page does not scan after cooldown expiry; becoming visible retries once',async()=>{
  const f=fixture({native:false});await seed(f);f.setHandler(async()=>{throw error('unavailable');});await f.refresh(true);
  f.doc.visibilityState='hidden';f.advance(60001);f.win.emit('online');f.observe();await f.refresh(true);assert.equal(f.calls.length,2);
  f.setHandler(async()=>({rows:[{id:'visible-again'}],cursor:null}));f.show();f.doc.emit('visibilitychange');await flush();assert.equal(f.calls.length,3);assert.equal(f.api.rows()[0].id,'visible-again');
});
