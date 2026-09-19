const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const assets=path.resolve(__dirname,'../android-src/assets');
const source=fs.readFileSync(path.join(assets,'app-todo-v179.js'),'utf8');
const css=fs.readFileSync(path.join(assets,'app-todo-v179.css'),'utf8');
const block=source.slice(source.indexOf('  // BEGIN MANAGER CLOSE V182'),source.indexOf('  // END MANAGER CLOSE V182'));

test('both add actions and close stay in one sticky row independently of the selected tab',()=>{
  const header=source.match(/<header class="todo-header-v179">(.*?)<\/header>/)[1];
  assert.match(header,/data-todo-add-v179="todo">＋ 투두/);
  assert.match(header,/data-todo-add-v179="memo">＋ 메모/);
  assert.match(header,/data-todo-manager-close-v182/);
  assert.equal((header.match(/<button /g)||[]).length,3);
  assert.match(css,/\.todo-header-v179\{position:sticky;top:0;/);
  assert.match(css,/flex-wrap:nowrap/);
  assert.doesNotMatch(source,/\$\('\[data-todo-add-v179\]',page\).textContent/);
});

test('memo tab only displays its list; either fixed add action passes its own record kind',()=>{
  const listeners={},calls=[];
  const context={kind:'todo',document:{addEventListener:(type,handler)=>listeners[type]=handler},render:()=>calls.push('render'),edit:(...args)=>calls.push(args),refresh(){},closeManagerV182:()=>calls.push('close')};
  const click=source.slice(source.indexOf("  document.addEventListener('click',event=>{"),source.indexOf("  document.addEventListener('change',async event=>{"));
  vm.runInNewContext(click,context);
  const fire=(attribute,dataset)=>listeners.click({target:{closest:()=>({hasAttribute:name=>name===attribute,dataset})}});
  fire('data-todo-kind-v179',{todoKindV179:'memo'});assert.equal(context.kind,'memo');assert.deepEqual(calls,['render']);
  fire('data-todo-add-v179',{todoAddV179:'todo'});assert.deepEqual(calls.at(-1),['','','todo']);assert.equal(context.kind,'memo');
  fire('data-todo-add-v179',{todoAddV179:'memo'});assert.deepEqual(calls.at(-1),['','','memo']);
  fire('data-todo-manager-close-v182',{});assert.equal(calls.at(-1),'close');
});

function gestureFixture(){
  const listeners={},routes=[];let time=1000,backCalls=0,backResult=true,overlay=false;
  const page={dataset:{},addEventListener:(type,handler)=>listeners[type]=handler};
  const context={busy:false,editorCloseV182:null,$:()=>overlay?{}:null,Date:{now:()=>time},Math,window:{AiderAppBackV176:{back:()=>{backCalls++;return backResult}},AiderLogWheelV151:{navigate:p=>routes.push(p)}}};
  vm.createContext(context);vm.runInContext(block+';this.close=closeManagerV182;this.bind=bindManagerSwipeV182;',context);context.bind(page);
  const emit=(type,options={})=>{const event={target:{closest:()=>false},cancelable:true,detail:1,button:0,pointerType:'mouse',pointerId:1,clientX:200,clientY:100,preventDefault(){this.prevented=true},stopPropagation(){this.stopped=true},stopImmediatePropagation(){this.immediate=true},...options};listeners[type]?.(event);return event;};
  const swipe=(options={})=>{const start=options.start||[240,100],end=options.end||[100,104],target={closest:()=>!!options.blocked},extra={target};
    emit('touchstart',{...extra,touches:[{clientX:start[0],clientY:start[1],identifier:5}]});time+=options.elapsed||200;
    if(options.multi)emit('touchmove',{touches:[{},{}]});
    if(options.cancel)emit(options.cancel);
    emit('touchmove',{...extra,touches:[{clientX:end[0],clientY:end[1],identifier:5}]});
    return emit('touchend',{...extra,changedTouches:[{clientX:end[0],clientY:end[1],identifier:5}]});};
  return {context,emit,swipe,routes,listeners,close:context.close,get backCalls(){return backCalls},set backResult(v){backResult=v},set overlay(v){overlay=v}};
}

test('left swipe closes once through the existing back stack and suppresses only its compatibility click',()=>{
  const f=gestureFixture();assert(f.swipe().prevented);assert.equal(f.backCalls,1);
  assert.equal(f.emit('click',{detail:0}).immediate,undefined);
  assert(f.emit('click').immediate);assert.equal(f.emit('click').immediate,undefined);
});
test('vertical list scroll, short/stale/right swipes, form controls and multitouch cannot close manager',()=>{
  for(const options of [{end:[230,240]},{end:[205,102]},{elapsed:9000},{start:[20,100],end:[110,104]},{blocked:true},{multi:true},{cancel:'touchcancel'}]){
    const f=gestureFixture();f.swipe(options);assert.equal(f.backCalls,0,JSON.stringify(options));
  }
  const f=gestureFixture();f.overlay=true;f.swipe();assert.equal(f.backCalls,0);
  f.overlay=false;f.context.busy=true;f.swipe();assert.equal(f.backCalls,0);
});
test('deliberate slower left swipes remain usable beyond a one-second gesture window',()=>{
  for(const elapsed of [1200,3000,6800,8000]){
    const f=gestureFixture();assert(f.swipe({elapsed}).prevented);assert.equal(f.backCalls,1,String(elapsed));
  }
  for(const options of [{elapsed:6800,blocked:true},{elapsed:6800,end:[230,240]},{elapsed:6800,multi:true}]){
    const f=gestureFixture();f.swipe(options);assert.equal(f.backCalls,0);
  }
});
test('Android compatibility pointercancel preserves the authoritative touch swipe',()=>{
  const f=gestureFixture();f.swipe({cancel:'pointercancel'});assert.equal(f.backCalls,1);
});
test('X closes editor only, respects cancelled unsaved close, and falls back home without history',()=>{
  const f=gestureFixture();f.overlay=true;f.context.editorCloseV182=()=>false;assert.equal(f.close(),false);assert.equal(f.backCalls,0);
  f.context.editorCloseV182=()=>true;assert(f.close());assert.equal(f.backCalls,0);
  f.overlay=false;f.backResult=false;assert(f.close());assert.deepEqual(f.routes,['home']);
  f.context.busy=true;assert.equal(f.close(),false);assert.equal(f.backCalls,1);
});
test('manager close does not stop after merely closing an expanded wheel',()=>{
  const f=gestureFixture(),order=[];
  f.context.window.AiderLogWheelV151.setOpen=value=>order.push(['wheel',value]);
  f.context.window.AiderAppBackV176.back=()=>{order.push(['back']);return true;};
  assert(f.close());assert.deepEqual(order,[['wheel',false],['back']]);
});
test('unsaved editor close confirms before discarding and does not focus an input',()=>{
  assert.match(source,/initialValues=JSON.stringify\(\[\.\.\.new FormData\(form\).entries\(\)\]\)/);
  assert.match(source,/initialValues!==JSON.stringify\(\[\.\.\.new FormData\(form\).entries\(\)\]\)&&!confirm\(/);
  assert.match(source,/\$\('\[data-todo-close-v179\]',sheet\)\?\.focus\(\{preventScroll:true\}\)/);
  assert.doesNotMatch(source,/autofocus/);
});
test('empty calendar todo host remains visible without placeholder records or headings',()=>{
  const element={hidden:true,firstElementChild:null,innerHTML:''},context={inlineMarkup:()=>'<div class="todo-inline-grid-v179"></div>',signatures:new WeakMap()};
  vm.runInNewContext(source.slice(source.indexOf('  function mountInline('),source.indexOf('  function mountAll('))+';this.mount=mountInline',context);
  context.mount(element);assert.equal(element.hidden,false);assert.equal(element.innerHTML,'<div class="todo-inline-grid-v179"></div>');
  assert.match(css,/min-height:32px;max-height:96px/);
});
test('packaged assets match canonical app assets',()=>{
  const canonical=path.resolve(assets,'../../../AiderLog-v145-decoded/assets');
  for(const name of ['app-todo-v179.js','app-todo-v179.css'])assert.equal(fs.readFileSync(path.join(assets,name),'utf8'),fs.readFileSync(path.join(canonical,name),'utf8'));
});
test('manager fills the shared app frame without a second top or wheel-reserved bottom gap',()=>{
  assert.match(css,/#todo\{[^}]*padding:0 4px!important;height:100%!important/);
  assert.match(css,/\.todo-workspace-v179\{[^}]*height:100%;min-height:0;box-sizing:border-box/);
  assert.match(css,/\.todo-list-v179\{[^}]*flex:1;min-height:0;[^}]*overflow-y:auto/);
  assert.doesNotMatch(css,/padding:6px 4px 70px|100dvh\s*-\s*76px/);
});
