const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const base=path.resolve(__dirname,'../android-src/assets');
const source=fs.readFileSync(path.join(base,'wheelbar-v176.js'),'utf8');
const css=fs.readFileSync(path.join(base,'wheelbar-v176.css'),'utf8');
function fixture(){
  const writes=new Map(),listeners=[],frames=[];let active='event',open=true;
  const buttons=['fifth','personal','routine','event'].map((page,index)=>{
    let html='';const attributes={};
    const button={dataset:{page,index:String(index)},className:'global-wheel-item-v126 slot-'+index,tabIndex:0,title:'',
      setAttribute:(key,value)=>attributes[key]=value,getAttribute:key=>attributes[key]??null,
      get innerHTML(){return html},set innerHTML(value){html=value;writes.set(page,(writes.get(page)||0)+1)},
      querySelector(selector){
        if(selector==='b')return html.includes('<b')?{}:null;
        if(selector==='svg'||selector==='.global-svg-icon-v126')return html.includes('<svg')?{}:null;
        if(selector.startsWith('[data-wheelbar-icon-v176='))return html.includes(selector.slice(1,-1))?{}:null;
        if(selector.startsWith('#'))return html.includes('id="'+selector.slice(1)+'"')?{}:null;
        return null;
      },
      append(label){html+='<span id="'+label.id+'">'+label.textContent+'</span>'},
      decorate(){html=html.replace('<svg ','<svg style="font-size:9px" ').replace('wheelbar-icon-v176','wheelbar-icon-v176 decorated')}
    };return button;
  });
  const wheel={dataset:{},classList:{contains:value=>value==='open'&&open},querySelectorAll:()=>buttons};
  const views={};
  const document={getElementById:id=>id==='wheel'?wheel:null,querySelector:selector=>selector==='.views'?views:selector==='.views > .view.on'?{id:active}:null,
    createElement:()=>({}),addEventListener:(type,fn)=>listeners.push([type,fn])};
  const window={addEventListener:(type,fn)=>listeners.push([type,fn])};
  class MutationObserver{constructor(fn){this.fn=fn}observe(){}}
  const context={window,document,location:{hash:'#event'},MutationObserver,requestAnimationFrame:fn=>frames.push(fn)};
  vm.runInNewContext(source,context);
  return {api:window.AiderWheelbarV176,buttons,wheel,views,context,writes,listeners,active:value=>active=value,open:value=>open=value};
}
test('wheelbar exposes four distinct currentColor vector silhouettes at 24px',()=>{
  const f=fixture(),names=Object.keys(f.api.names).sort();assert.deepEqual(names,['event','fifth','personal','routine']);
  const values=names.map(page=>f.api.icon(page));assert.equal(new Set(values).size,4);
  for(const icon of values){assert.match(icon,/viewBox="0 0 24 24"/);assert.match(icon,/currentColor/);assert.doesNotMatch(icon,/linearGradient|radialGradient|filter=|<image|<text|#[0-9a-f]{3}/i);}
  assert.match(f.api.icon('event'),/<rect[^>]*width="18"[^>]*height="13"/);
  assert.match(f.api.icon('event'),/<circle/);
  assert.equal((f.api.icon('routine').match(/<path/g)||[]).length,2);
  assert.equal((f.api.icon('fifth').match(/<path/g)||[]).length,2);
});
test('personal uses a real even-odd transparent circular hole, not a painted center',()=>{
  const icon=fixture().api.icon('personal');
  assert.match(icon,/fill-rule="evenodd"/);assert.match(icon,/a3 3 0 1 0-6 0 3 3 0 1 0 6 0Z/);
  assert.doesNotMatch(icon,/<circle|#fff|white|mask|filter/i);
  assert.equal((icon.match(/<path/g)||[]).length,1);
});
test('wheelbar retains page order and uses stable Korean accessible names and true current-page state',()=>{
  const f=fixture();assert.deepEqual(f.buttons.map(b=>b.dataset.page),['fifth','personal','routine','event']);
  for(const button of f.buttons){assert.equal(button.getAttribute('aria-labelledby'),'wheelbar-label-'+button.dataset.page+'-v176');assert.ok(button.innerHTML.includes(f.api.names[button.dataset.page]));}
  assert.equal(f.buttons[3].getAttribute('aria-current'),'page');
  f.active('personal');f.api.refresh();assert.equal(f.buttons[1].getAttribute('aria-current'),'page');assert.equal(f.buttons[3].getAttribute('aria-current'),'false');
  f.active('language');f.api.refresh();assert.equal(f.buttons[0].getAttribute('aria-current'),'page');
  f.active('home');f.api.refresh();assert.ok(f.buttons.every(b=>b.getAttribute('aria-current')==='false'));
});
test('font decoration and selected states do not recreate pressed SVGs',()=>{
  const f=fixture();for(const button of f.buttons)button.decorate();
  f.api.refresh();f.api.refresh();assert.deepEqual([...f.writes.values()],[1,1,1,1]);
  f.active('routine');f.api.refresh();assert.deepEqual([...f.writes.values()],[1,1,1,1]);
  f.buttons[0].innerHTML='<i><svg></svg></i>';f.api.refresh();assert.equal(f.writes.get('fifth'),3);
});
test('real legacy wheel decorators coexist with the final SVG layer without a rewrite loop',()=>{
  const f=fixture();f.context.$=selector=>selector==='#wheel'?f.wheel:null;f.context.$$=()=>f.buttons;
  f.context.window.AiderLogIconsV126={icon:name=>'<svg class="global-svg-icon-v126"><path data-old="'+name+'"/></svg>'};f.context.icon=f.context.window.AiderLogIconsV126.icon;
  const legacy=fs.readFileSync(path.join(base,'feature-system-v125.js'),'utf8');
  const snippet=legacy.slice(legacy.indexOf('  const wheelMarkupV175'),legacy.indexOf('  function applyLanguageTheme'));
  vm.runInNewContext(snippet+';applyFixedWheelV125()',f.context);
  f.api.refresh();
  const counts=[...f.writes.values()];
  for(const button of f.buttons)button.decorate();
  vm.runInNewContext('applyFixedWheelV125()',f.context);f.api.refresh();
  assert.deepEqual([...f.writes.values()],counts);
  // The prior controller may restore English aria-label; aria-labelledby wins.
  assert.equal(f.buttons[1].getAttribute('aria-labelledby'),'wheelbar-label-personal-v176');
});
test('hidden wheel entries are out of Tab order; navigation stays owned by the original handler',()=>{
  const f=fixture();f.open(false);f.api.refresh();assert.ok(f.buttons.every(b=>b.tabIndex===-1));
  f.open(true);f.api.refresh();assert.ok(f.buttons.every(b=>b.tabIndex===0));
  assert.doesNotMatch(source,/addEventListener\(['"](?:click|touch\w*|pointer\w*|keydown)|\.navigate\(|\bgo\(|setOpen\(/);
  assert.doesNotMatch(source,/setAttribute\(['"]data-page|dataset\.page\s*=/);
});
test('48px targets preserve the prior centers and do not overlap',()=>{
  const old=[[34,145],[54,82],[106,42],[172,39]],next=[[42,153],[62,90],[114,50],[180,47]];
  for(let i=0;i<next.length;i++){assert.deepEqual(next[i].map(n=>n+24),old[i].map(n=>n+32));for(let j=i+1;j<next.length;j++){const[x,y]=next[i],[u,v]=next[j];assert.ok(x+48<=u||u+48<=x||y+48<=v||v+48<=y,'targets '+i+'/'+j);}}
  assert.match(css,/width:48px!important;height:48px!important/);assert.match(css,/width:44px!important;height:44px!important/);assert.match(css,/width:24px!important;height:24px!important/);
  assert.doesNotMatch(css,/#wheelCore|wheel-art|wheel-planet|global-wheel-v126\s*\{/);
});
test('all visual states use the shared Primary token and no menu-specific texture or glow',()=>{
  assert.match(css,/@layer appColour164/);assert.match(css,/var\(--app-primary,var\(--theme-primary,#6255E8\)\)/);
  assert.match(css,/:focus-visible/);
  assert.doesNotMatch(css,/aria-current="page"|:active|\.hovered|data-wheel-selected|scale\(/);
  assert.match(css,/color:#fff!important/);
  assert.match(css,/background:var\(--app-primary,var\(--theme-primary,#6255E8\)\)!important/);
  assert.doesNotMatch(css,/gradient\(|url\(|drop-shadow\(/);
  assert.doesNotMatch(css,/data-theme=/);
});
test('filled normal and pressed silhouettes stay identical while current-page semantics still update',()=>{
  const f=fixture(),before=f.buttons.map(button=>button.innerHTML);
  f.active('routine');f.api.refresh();assert.deepEqual(f.buttons.map(button=>button.innerHTML),before);
  assert.equal(f.buttons[2].getAttribute('aria-current'),'page');assert.equal(f.buttons[3].getAttribute('aria-current'),'false');
  assert.doesNotMatch(css,/wheelbar-surface|background-color \.1s|scale\(\.96\)/);
});
test('opened guide circles follow the preserved menu arc without moving the planet',()=>{
  for(const [x,y]of [[66,177],[86,114],[138,74],[204,71]])assert.ok(Math.abs(Math.hypot(x-176,y-177)-110)<1);
  assert.match(css,/#wheelFan\.global-wheel-field-v126::after,\s*html body #wheel\.open #wheelFan \.global-wheel-orbits-v126/);
  assert.match(css,/left:66px!important;top:67px!important;right:auto!important;bottom:auto!important/);
  assert.match(css,/width:220px!important;height:220px!important;transform:none!important;pointer-events:none!important/);
  assert.match(css,/#wheelFan\.global-wheel-field-v126::before\{\s*left:73px!important;top:74px!important;right:auto!important;bottom:auto!important/);
  assert.match(css,/width:206px!important;height:206px!important;transform:none!important;pointer-events:none!important/);
  assert.deepEqual([73+206/2,74+206/2],[66+220/2,67+220/2]);
});
test('eleven navigation Primary tokens stay exact across system light/dark without recolouring the planet',()=>{
  const tokens=fs.readFileSync(path.join(base,'app-theme-primary-v176.css'),'utf8');
  const expected={system:'#6255E8',sun:'#D86428',mercury:'#626873',venus:'#A97846',earth:'#2D748E',mars:'#A84C3B',jupiter:'#9B704E',saturn:'#8E7A4A',uranus:'#4D8790',neptune:'#3F5FA7',pluto:'#554C43'};
  for(const[id,value]of Object.entries(expected))assert.ok(tokens.includes(':root[data-theme="'+id+'"]{--app-navigation-primary:'+value+'}'));
  assert.doesNotMatch(tokens,/data-system-scheme|wheelCore|wheel-art|--app-wheel|--app-primary\s*:/);
  assert.match(css,/--app-primary:var\(--app-navigation-primary,#6255E8\)/);
  assert.match(css,/#wheel\.open #wheelFan\.global-wheel-field-v126\{transform:none!important/);
  for(const name of ['index.html','sw.js'])assert.ok(fs.readFileSync(path.join(base,name),'utf8').includes('app-theme-primary-v176.css?v=176'));
});
test('canonical assets and sparse Android mirror agree; confirmation page includes required states',()=>{
  const canonical=path.resolve(base,'../../../AiderLog-v145-decoded/assets');
  for(const name of ['wheelbar-v176.js','wheelbar-v176.css','wheelbar-v176-preview.html','app-theme-primary-v176.css'])assert.equal(fs.readFileSync(path.join(base,name),'utf8'),fs.readFileSync(path.join(canonical,name),'utf8'),name);
  const html=fs.readFileSync(path.join(base,'wheelbar-v176-preview.html'),'utf8');
  for(const text of ['기본 상태','선택 상태','어두운 배경','기존 휠 안의 배치','[20,24,28]','wheel-navigation-v151.js','wheel-planet-v140.png'])assert.ok(html.includes(text),text);
});
