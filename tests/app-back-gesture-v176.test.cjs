const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assets=path.resolve(__dirname,'../android-src/assets');
const source=fs.readFileSync(path.join(assets,'app-back-gesture-v176.js'),'utf8');
function fixture(start='home'){
  const listeners=new Map(),observers=[],routes=[];
  let active=start,priorResult=false,priorCalls=0,open=false,time=10000,dialogs=[],overlays=[],backs=[];
  const views={};
  const makeNode=(options={})=>({nodeType:1,hidden:false,disabled:false,clientWidth:200,scrollWidth:200,
    style:{display:'block',visibility:'visible',opacity:'1',overflowX:'visible'},
    matches(){return false},getClientRects(){return this.hidden?[]:[{}]},querySelectorAll(){return this.children||[]},click(){this.clicked=(this.clicked||0)+1},...options});
  const view=makeNode({parentElement:views,querySelectorAll:()=>backs});
  Object.defineProperty(view,'id',{get:()=>active});
  const document={querySelector:s=>s==='.views'?views:s==='.views > .view.on'?view:null,
    getElementById:id=>id==='wheel'?{classList:{contains:()=>open}}:['home','event','personal','routine','language','fifth'].includes(id)?{}:null,
    querySelectorAll:s=>s==='dialog[open]'?dialogs:s.startsWith('[role=')?overlays:[],
    addEventListener:(type,fn)=>listeners.set('document:'+type,fn)};
  function route(page){active=page;listeners.get('document:aiderlog-page-changed')?.();}
  const window={innerWidth:390,addEventListener:(type,fn)=>listeners.set(type,fn),
    AiderLogAppShell:{handleBack:()=>{priorCalls++;return priorResult}},
    AiderLogWheelV151:{navigate:page=>{routes.push(page);route(page)},setOpen:value=>{open=value}}};
  class MutationObserver{constructor(fn){observers.push(fn)}observe(){}}
  vm.runInNewContext(source,{window,document,MutationObserver,Date:{now:()=>time},getComputedStyle:node=>node.style});
  const target=makeNode();
  function emit(type,options={}){
    const event={target,composedPath:()=>[target],cancelable:true,detail:1,button:0,pointerType:'mouse',pointerId:1,clientX:10,clientY:200,
      preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true},...options};
    listeners.get(type)?.(event);return event;
  }
  function swipe(options={}){
    const start=options.start||[12,200],end=options.end||[108,204],kind=options.kind||'touch',node=options.node||target;
    const extra={target:node,composedPath:()=>[node,...(options.parents||[])]};
    if(kind==='touch'){
      emit('touchstart',{...extra,touches:[{clientX:start[0],clientY:start[1],identifier:2}]});
      if(options.cancel)emit(options.cancel);
      time+=options.duration||200;
      emit('touchmove',{...extra,touches:[{clientX:end[0],clientY:end[1],identifier:2}]});
      return emit('touchend',{...extra,changedTouches:[{clientX:end[0],clientY:end[1],identifier:2}]});
    }
    emit('pointerdown',{...extra,clientX:start[0],clientY:start[1]});time+=200;
    emit('pointermove',{...extra,clientX:end[0],clientY:end[1]});return emit('pointerup',{...extra,clientX:end[0],clientY:end[1]});
  }
  return{api:window.AiderAppBackV176,shell:window.AiderLogAppShell,window,listeners,routes,route,swipe,emit,node:makeNode,target,
    active:()=>active,prior:value=>priorResult=value,priorCalls:()=>priorCalls,open:value=>open=value,isOpen:()=>open,
    dialogs:value=>dialogs=value,overlays:value=>overlays=value,backs:value=>backs=value,advance:value=>time+=value,
    observe:()=>observers.forEach(fn=>fn([{target:view}]))};
}
test('touch edge swipe follows prior app routes, not browser replaceState history',()=>{
  const f=fixture();f.route('event');f.route('personal');assert.ok(f.swipe().prevented);assert.equal(f.active(),'event');
  f.swipe();assert.equal(f.active(),'home');assert.equal(f.api.back(),false);assert.deepEqual(f.routes,['event','home']);
  assert.doesNotMatch(source,/history\.back|history\.go|location\.hash\s*=/);
});
test('native Back and pointer preview use the same action and fall back home after a cold open',()=>{
  const f=fixture('routine');f.swipe({kind:'pointer'});assert.equal(f.active(),'home');
  f.route('fifth');assert.equal(f.shell.handleBack(),true);assert.equal(f.active(),'home');
});
test('vertical scroll, small drag, slow drag, right-to-left and central swipes do not navigate',()=>{
  for(const options of [{end:[20,330]},{end:[40,203]},{duration:1200},{end:[0,203]},{start:[120,200],end:[280,205]}]){
    const f=fixture('event');f.swipe(options);assert.equal(f.active(),'event');assert.equal(f.routes.length,0);
  }
});
test('input, media, canvas, wheel and horizontal scroll targets keep their gestures',()=>{
  for(const kind of ['input','canvas','wheel','carousel']){
    const f=fixture('event'),node=f.node(kind==='carousel'?{scrollWidth:400,style:{display:'block',visibility:'visible',opacity:'1',overflowX:'auto'}}:{matches:()=>true});
    f.swipe({parents:[node]});assert.equal(f.active(),'event',kind);assert.equal(f.routes.length,0);
  }
});
test('Android compatibility pointercancel does not cancel the authoritative touch gesture',()=>{
  const f=fixture('event');f.swipe({cancel:'pointercancel'});assert.equal(f.active(),'home');
  const cancelled=fixture('event');cancelled.swipe({cancel:'touchcancel'});assert.equal(cancelled.active(),'event');
});
test('multitouch never turns into a back gesture on release',()=>{
  const f=fixture('event');f.emit('touchstart',{touches:[{clientX:12,clientY:200,identifier:2}]});
  f.emit('touchmove',{touches:[{clientX:110,clientY:200,identifier:2},{clientX:30,clientY:100,identifier:3}]});
  f.emit('touchend',{changedTouches:[{clientX:110,clientY:200,identifier:2}]});assert.equal(f.active(),'event');
});
test('visible dialog uses its close action and preserves underlying route; disabled dialogs do not discard input',()=>{
  const f=fixture('event'),close=f.node(),overlay=f.node({children:[close]});f.dialogs([overlay]);
  f.swipe();assert.equal(close.clicked,1);assert.equal(f.active(),'event');assert.equal(f.priorCalls(),0);
  close.disabled=true;f.swipe();assert.equal(close.clicked,1);assert.equal(f.routes.length,0);
});
test('hidden stale overlays do not intercept route back and nested page back uses its existing button',()=>{
  const f=fixture('fifth');f.overlays([f.node({hidden:true})]);const back=f.node();f.backs([back]);
  f.swipe();assert.equal(back.clicked,1);assert.equal(f.active(),'fifth');
  f.backs([]);f.api.back();assert.equal(f.active(),'home');
});
test('wheel open closes first without moving the planet or consuming a page back',()=>{
  const f=fixture('routine');f.open(true);f.swipe();assert.equal(f.isOpen(),false);assert.equal(f.active(),'routine');
  f.swipe();assert.equal(f.active(),'home');assert.doesNotMatch(source,/wheelCore|\.style\.|\.innerHTML\s*=/);
});
test('existing study/paper close handlers are preserved and run before route navigation',()=>{
  const f=fixture('fifth');f.prior(true);f.swipe();assert.equal(f.priorCalls(),1);assert.equal(f.routes.length,0);
  f.prior(false);f.swipe();assert.equal(f.active(),'home');
});
test('only a swipe release compatibility click is suppressed; keyboard and distinct clicks stay available',()=>{
  const f=fixture('event');f.swipe();
  assert.equal(f.emit('click',{clientX:200,clientY:100}).stopped,undefined);
  assert.equal(f.emit('click',{clientX:108,clientY:204,detail:0}).stopped,undefined);
  assert.equal(f.emit('click',{clientX:108,clientY:204}).stopped,true);
  assert.equal(f.emit('click',{clientX:108,clientY:204}).stopped,undefined);
});
test('late legacy renderer view-class changes enter history without extra duplicate steps',()=>{
  const f=fixture();f.route('routine');f.observe();f.api.refresh();f.route('personal');f.api.back();
  assert.equal(f.active(),'routine');f.api.back();assert.equal(f.active(),'home');
});
test('canonical mirror stays byte identical and old modal handler checks visibility before claiming back',()=>{
  const canonical=path.resolve(assets,'../../../AiderLog-v145-decoded/assets');
  assert.equal(fs.readFileSync(path.join(canonical,'app-back-gesture-v176.js'),'utf8'),source);
  const legacy=fs.readFileSync(path.join(assets,'experience-v136.js'),'utf8');
  assert.match(legacy,/node\.getClientRects\(\)\.length&&style\.display!=='none'&&style\.visibility!=='hidden'/);
  assert.match(legacy,/if\(!close\)return false;close\.click\(\);return true/);
  assert.equal(fs.readFileSync(path.join(canonical,'experience-v136.js'),'utf8'),legacy);
});
