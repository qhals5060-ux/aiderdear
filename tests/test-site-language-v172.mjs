// Actual presentation adapter + extracted existing language handlers/renderCourse.
// A bounded DOM double checks wiring and mutation stability, not browser geometry.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const script=read('site-language-v172.js'),css=read('site-language-v172.css'),engine=read('language-lab-v18-engine.js'),template=read('language-lab-v18-template.html');

function harness({native=false,androidBridge=false,android=false,preview=false,modern=true,empty=false}={}){
  const observers=[],frames=[],events=new Map();let changes=0;
  const notify=(target,addedNodes=[],removedNodes=[])=>{
    changes++;
    for(const o of observers)if(o.target&&(o.target===target||o.options.subtree&&o.target.contains(target)))o.records.push({target,type:'childList',addedNodes,removedNodes});
  };
  class Element{
    constructor(tag='div',className='',id=''){
      this.tagName=tag.toUpperCase();this.nodeType=tag==='#comment'?8:tag==='#text'?3:1;this.childNodes=[];this.parentNode=null;this.attrs=new Map();this.listeners=new Map();this.dataset={};this.style={};this.value='';this.hidden=false;this.disabled=false;this.id=id;this.inner='';this.label='';
      const classes=new Set(className.split(/\s+/).filter(Boolean));
      this.classList={contains:x=>classes.has(x),add:(...xs)=>xs.forEach(x=>classes.add(x)),remove:(...xs)=>xs.forEach(x=>classes.delete(x))};
      Object.defineProperty(this,'className',{get:()=>[...classes].join(' '),set:value=>{classes.clear();String(value).split(/\s+/).filter(Boolean).forEach(x=>classes.add(x));}});
    }
    get firstElementChild(){return this.childNodes.find(x=>x.nodeType===1)||null;}
    get nextSibling(){return this.parentNode?.childNodes[this.parentNode.childNodes.indexOf(this)+1]||null;}
    get isConnected(){let node=this;while(node.parentNode)node=node.parentNode;return node===document;}
    contains(node){for(let x=node;x;x=x.parentNode)if(x===this)return true;return false;}
    matches(selector){return selector.split(',').some(raw=>{const s=raw.trim(),tag=s.match(/^[\w-]+/)?.[0],id=s.match(/#([\w-]+)/)?.[1],classes=[...s.matchAll(/\.([\w-]+)/g)].map(x=>x[1]),attrs=[...s.matchAll(/\[([\w-]+)\]/g)].map(x=>x[1]);return this.nodeType===1&&(!tag||this.tagName===tag.toUpperCase())&&(!id||this.id===id)&&classes.every(x=>this.classList.contains(x))&&attrs.every(x=>this.hasAttribute(x));});}
    querySelectorAll(selector){const found=[];for(const child of this.childNodes){if(child.matches(selector))found.push(child);found.push(...child.querySelectorAll(selector));}return found;}
    querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
    insertBefore(node,before=null){if(before&&before.parentNode!==this)throw Error('Invalid reference');if(node.parentNode)node.remove();const index=before?this.childNodes.indexOf(before):this.childNodes.length;this.childNodes.splice(index,0,node);node.parentNode=this;notify(this,[node]);return node;}
    append(...nodes){nodes.forEach(node=>this.insertBefore(node));}
    prepend(node){this.insertBefore(node,this.childNodes[0]||null);}
    before(node){this.parentNode?.insertBefore(node,this);}
    after(node){this.parentNode?.insertBefore(node,this.nextSibling);}
    remove(){if(this.parentNode){const old=this.parentNode;old.childNodes.splice(old.childNodes.indexOf(this),1);this.parentNode=null;notify(old,[],[this]);}}
    replaceChildren(...nodes){for(const old of [...this.childNodes])old.remove();this.append(...nodes);}
    set textContent(value){this.label=String(value);this.replaceChildren(new Element('#text'));}
    get textContent(){return this.label;}
    set innerHTML(value){this.inner=String(value);this.replaceChildren(new Element('#text'));}
    get innerHTML(){return this.inner;}
    setAttribute(k,v){this.attrs.set(k,String(v));}
    hasAttribute(k){return this.attrs.has(k);}
    removeAttribute(k){this.attrs.delete(k);}
    addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(fn);}
    async fire(name,event={}){for(const fn of this.listeners.get(name)||[])await fn.call(this,{target:this,...event});}
  }
  const document=new Element('#document'),html=new Element('html'),body=new Element('body'),host=new Element('aiderlog-language-lab');
  document.append(html);html.append(body);body.append(host);document.documentElement=html;document.body=body;document.currentScript={src:'http://localhost:8785/site-language-v172.js?v=172'};
  if(modern)html.classList.add('modern-site');if(android)html.classList.add('aiderlog-android');
  document.createElement=tag=>new Element(tag);document.createComment=()=>new Element('#comment');document.addEventListener=(name,fn)=>events.set(name,fn);
  const root=new Element('#shadow');root.parentNode=host;host.shadowRoot=root;
  const build=()=>{
    const shell=new Element('div','app-shell modern-language-layout'),header=new Element('header','app-header'),controls=new Element('div','header-controls'),stats=new Element('div','header-stats'),courseControl=new Element('div','header-course'),language=new Element('select','','language-select'),level=new Element('select','','level-select'),records=new Element('button','records-button','records-button'),share=new Element('button','language-partner-share'),main=new Element('main','single-page','main-page'),left=new Element('aside','modern-language-courses'),course=new Element('section','course-panel'),heading=new Element('div','section-heading-row'),learning=new Element('section','learning-section','course-section');
    share.disabled=true;language.value='ja';level.value='0';
    shell.append(header,main);header.append(controls);controls.append(stats,courseControl);stats.append(records,share);courseControl.append(language,level);main.append(left,learning);left.append(course);course.append(heading);
    for(const id of ['category-tabs','scenario-tabs'])course.append(new Element('div','',id));
    for(const id of ['scenario-number','scenario-place','scenario-title','scenario-description','scenario-progress-label','scenario-progress','day-list-subtitle','day-page-controls','day-list'])learning.append(new Element('div','',id));
    root.replaceChildren(shell);return {shell,controls,stats,courseControl,course,language,level,records,share,main,learning};
  };
  let nodes=empty?null:build();changes=0;
  const window=native?{AiderLogNative:{}}:androidBridge?{Android:{}}:{};
  const context={window,document,URL,URLSearchParams,location:{href:'http://localhost:8785/index.html',search:preview?'?android-preview=1':''},MutationObserver:class{
    constructor(fn){this.fn=fn;this.records=[];observers.push(this);}
    observe(target,options){this.target=target;this.options=options;}
    disconnect(){this.target=null;this.records=[];}
  },requestAnimationFrame:fn=>frames.push(fn),addEventListener:(name,fn)=>events.set(name,fn),customElements:{whenDefined:()=>({then(){}})}};
  vm.createContext(context);vm.runInContext(script,context);
  const flush=()=>{let turns=0;while(frames.length||observers.some(o=>o.records.length)){assert(++turns<12,'observer/frame work must settle');for(const o of observers){if(o.records.length){const records=o.records.splice(0);o.fn(records);}}if(frames.length)frames.shift()();}return turns;};
  flush();
  return {window,document,html,host,root,events,observers,frames,context,Element,flush,get nodes(){return nodes;},rebuild(){nodes=build();return nodes;},get changes(){return changes;},reset(){changes=0;},refresh(){window.AiderLogSiteLanguageV172?.refresh();flush();}};
}

test('native bridge, Android document and Android preview never install or change nodes',()=>{
  for(const flags of [{native:true},{androidBridge:true},{android:true},{preview:true}]){const h=harness(flags);assert.equal(h.window.AiderLogSiteLanguageV172,undefined);assert.equal(h.observers.length,0);assert.equal(h.changes,0);assert.equal(h.nodes.courseControl.parentNode,h.nodes.controls);}
});
test('Modern moves the original course/stat controls once, retaining values, listeners and disabled share state',async()=>{
  const h=harness(),n=h.nodes,wrapper=h.root.querySelector('.site-language-controls-v172');
  assert.equal(n.course.firstElementChild,wrapper);assert.deepEqual(wrapper.childNodes,[n.courseControl,n.stats]);assert.equal(n.language.value,'ja');assert.equal(n.level.value,'0');assert.equal(n.share.disabled,true);
  let recordOpens=0,shares=0;n.records.addEventListener('click',()=>recordOpens++);n.share.addEventListener('click',()=>shares++);h.refresh();await n.records.fire('click');n.share.disabled=false;await n.share.fire('click');assert.equal(recordOpens,1);assert.equal(shares,1);
  assert.equal(h.root.querySelectorAll('link[data-site-language-v172]').length,1);assert.equal(h.root.querySelector('link[data-site-language-v172]').href,'http://localhost:8785/site-language-v172.css?v=172');
});
test('100 settled refreshes do no reparenting, preserving pointer targets and stylesheet order',()=>{
  const h=harness(),style=h.root.querySelector('link[data-site-language-v172]'),editionStyle=new h.Element('link');h.root.append(editionStyle);h.flush();h.reset();for(let i=0;i<100;i++)h.refresh();assert.equal(h.changes,0);assert.equal(h.root.childNodes.at(-1),editionStyle);assert.equal(h.root.querySelector('link[data-site-language-v172]'),style);
});
test('Editorial restores exact live control order, and switching back does not duplicate controls or anchors',()=>{
  const h=harness(),n=h.nodes;h.html.classList.remove('modern-site');h.events.get('aiderlog-site-editionchange')();h.flush();assert.equal(n.courseControl.parentNode,n.controls);assert.equal(n.stats.parentNode,n.controls);assert.deepEqual(n.controls.childNodes.filter(x=>x.nodeType===1),[n.stats,n.courseControl]);assert.equal(h.host.hasAttribute('data-site-language-v172'),false);assert.equal(n.shell.classList.contains('site-language-v172'),false);
  h.html.classList.add('modern-site');h.events.get('aiderlog-site-editionchange')();h.flush();assert.equal(h.root.querySelectorAll('.site-language-controls-v172').length,1);assert.equal(h.root.querySelectorAll('#language-select').length,1);assert.equal(n.controls.childNodes.filter(x=>x.nodeType===8).length,2);
});
test('Editorial initial load leaves its layout untouched until explicit Modern selection',()=>{
  const h=harness({modern:false});assert.equal(h.changes,0);assert.equal(h.root.querySelector('link[data-site-language-v172]'),null);h.html.classList.add('modern-site');h.events.get('aiderlog-site-editionchange')();h.flush();assert.equal(h.root.querySelectorAll('.site-language-controls-v172').length,1);
});
test('late language-ready and full Shadow DOM replacement use current controls and one stylesheet',()=>{
  const h=harness({empty:true});h.rebuild();h.events.get('language-lab-ready')();h.flush();const old=h.nodes.language;h.rebuild();h.flush();assert.notEqual(h.nodes.language,old);assert.equal(h.root.querySelectorAll('.site-language-controls-v172').length,1);assert.equal(h.root.querySelectorAll('link[data-site-language-v172]').length,1);assert.equal(h.nodes.courseControl.parentNode,h.root.querySelector('.site-language-controls-v172'));
});
test('engine text/lesson rerenders do not schedule layout frames or reparent live buttons',()=>{
  const h=harness();h.reset();for(let i=0;i<30;i++){h.root.querySelector('#scenario-number').textContent=String(i+1).padStart(2,'0');h.root.querySelector('#day-list').innerHTML='<button>시작</button>';}
  assert.equal(h.frames.length,0);h.flush();assert.equal(h.frames.length,0);assert.equal(h.nodes.courseControl.parentNode,h.root.querySelector('.site-language-controls-v172'));
});
test('actual language/level change handlers still persist and rerender the actual course function after relocation',async()=>{
  const h=harness();let saved=0;
  const makeCourse=(language,level)=>[{title:'기본',icon:'기본',topics:[{title:`${language} ${level} 첫 인사`,tab:'첫 인사',description:'인사하고 이름을 말합니다.',place:'기본 과정 · UNIT 01',unit:true,unitNumber:1,days:Array.from({length:10},(_,i)=>({id:`${language}-${level}-${i}`,title:'표현 '+i,focus:'연습',weekLabel:'UNIT 01'}))}]}];
  Object.assign(h.context,{$:selector=>h.root.querySelector(selector),state:{language:'ja',levelByLanguage:{ja:0,en:0},categoryIndex:0,scenarioIndex:0,dayPage:0,progress:{}},curriculum:makeCourse('ja',0),scenarios:[],buildCurriculum:makeCourse,DAY_PAGE_SIZE:10,escapeHtml:String,isUnlocked:()=>true,renderGlobalStats:()=>{},persist:()=>saved++,showToast:()=>{},validLevel:x=>x,languageMeta:{en:{label:'English'},ja:{label:'日本語'}},levelProfiles:{en:[{name:'입문'},{name:'초급'}],ja:[{name:'입문'},{name:'초급'}]}});
  const render=engine.slice(engine.indexOf('function renderCourse() {'),engine.indexOf('\nfunction localDateKey',engine.indexOf('function renderCourse() {')));
  const start=engine.indexOf('$("#language-select").addEventListener("change"'),stop=engine.indexOf("$$('.filter-button')",start);
  assert(start>=0&&stop>start);vm.runInContext(render+'\nfunction renderPage(){renderCourse();}\n'+engine.slice(start,stop),h.context);
  h.nodes.language.value='en';await h.nodes.language.fire('change');h.flush();assert.equal(saved,1);assert.equal(h.root.querySelector('#scenario-title').textContent,'en 0 첫 인사');assert.equal(h.root.querySelector('#scenario-number').textContent,'01');assert.match(h.root.querySelector('#day-list').innerHTML,/data-day="9"/);
  h.nodes.level.value='1';await h.nodes.level.fire('change');h.flush();assert.equal(saved,2);assert.equal(h.root.querySelector('#scenario-title').textContent,'en 1 첫 인사');assert.equal(h.root.querySelector('#scenario-place').textContent,'기본 과정 · UNIT 01');assert.equal(h.root.querySelector('#scenario-progress-label').textContent,'0 / 10 Lesson');assert.equal(h.root.querySelectorAll('#language-select').length,1);
});
test('CSS hides only duplicate overview labels, preserves paging, and scopes every style to the site host',()=>{
  for(const selector of ['#scenario-number::before',"content:'UNIT '",'#scenario-place','.scenario-progress-box','.day-list-heading>div:first-child','.day-list-heading:not(:has(#day-page-controls button))','@media(max-width:767px)','min-height:44px'])assert(css.includes(selector));
  assert(!/\.lesson-(?:screen|footer|action|stage|body)|#lesson-(?:action|prev|pass|close)|\.day-action[^\n]*display:none/.test(css));
  const rules=css.replace(/\/\*[\s\S]*?\*\//g,'').match(/[^{}]+\{/g)||[];for(const rule of rules)if(!rule.trim().startsWith('@media'))assert(rule.includes(':host([data-site-language-v172])'),rule);
  for(const id of ['language-select','level-select','records-button','scenario-number','scenario-place','scenario-title','scenario-description','day-page-controls','lesson-action'])assert(template.includes(`id="${id}"`));
});
test('moved header controls reset legacy explicit grid columns and ID widths; one basic category has no empty block',()=>{
  assert.match(css,/\.site-language-controls-v172\{[^}]*grid-template-columns:minmax\(0,1fr\)!important/);
  assert.match(css,/:is\(\.header-course,\.header-stats\)\{[^}]*grid-area:auto!important;grid-column:1!important;grid-row:auto!important/);
  assert.match(css,/#level-select\{width:100%!important;max-width:100%!important;min-width:0!important/);
  assert(css.includes('#main-page #category-tabs:has(>.category-tab:only-child)'));
  assert(css.includes('#main-page #category-tabs:empty{display:none!important}'));
});
test('UNIT generated label exists only for a nonempty overview, never during an active Lesson or explicit hidden header',()=>{
  assert(css.includes('#scenario-number::before{content:none}'));
  assert(css.includes(':not([hidden]) .site-language-v172.modern-language-layout:not(.lesson-active) #course-section:not([hidden]) #scenario-number:not(:empty)::before{content:\'UNIT \'}'));
});
test('adapter never writes records, calls auth/network APIs, clones forms, changes control values, or clicks lesson actions',()=>{
  assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|AiderDearFirebase|cloneNode|\.click\(|\.value\s*=|\.disabled\s*=/.test(script));
});
