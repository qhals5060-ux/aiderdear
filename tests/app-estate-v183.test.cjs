const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),{webcrypto}=require('node:crypto');
const repo=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(repo,name),'utf8');
const strip=source=>source.replace(/^import .*;\r?$/gm,'').replace(/^export function /gm,'function ');
let canUseEstateAccount;
test.before(async()=>{({canUseEstateAccount}=await import('../estate-domain-v171.js'));});
class Events{
  constructor(){this.listeners=new Map();}
  addEventListener(name,fn){const list=this.listeners.get(name)||[];list.push(fn);this.listeners.set(name,list);}
  dispatchEvent(event){for(const fn of this.listeners.get(event.type)||[])fn(event);}
}
class Element extends Events{
  constructor(tag='div'){super();this.tagName=tag.toUpperCase();this.children=[];this.slots=new Map();this.dataset={};this.style={setProperty(){}};this.hidden=false;this.disabled=false;this.value='';this.scrollTop=0;this.elements={q:{value:''}};this.classes=new Set();this.classList={contains:key=>this.classes.has(key),add:key=>this.classes.add(key),toggle:(key,on)=>on?this.classes.add(key):this.classes.delete(key)};}
  set innerHTML(value){this.inner=String(value);this.children=[];this.slots.clear();for(const match of this.inner.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)){const b=new Element('button');b.textContent=match[2];for(const attr of match[1].matchAll(/([\w-]+)(?:="([^"]*)")?/g)){b[attr[1]]=attr[2]??'';if(attr[1].startsWith('data-'))b.dataset[attr[1].slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=attr[2]??'';}this.append(b);}}
  get innerHTML(){return this.inner||'';}
  get firstElementChild(){return this.children[0]||null;}
  append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
  appendChild(node){this.append(node);return node;}
  replaceChildren(...nodes){this.children=[];this.slots.clear();this.append(...nodes);}
  remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(n=>n!==this);}
  setAttribute(key,value){this[key]=value;}
  focus(){}
  reset(){this.elements.q.value='';}
  getBoundingClientRect(){return {top:70};}
  descendants(){return this.children.flatMap(node=>[node,...node.descendants()]);}
  contains(node){return node===this||this.descendants().includes(node);}
  closest(selector){let node=this;while(node){if(selector==='.'+node.className)return node;node=node.parentElement;}return null;}
  before(node){const parent=this.parentElement,at=parent.children.indexOf(this);node.parentElement=parent;parent.children.splice(at,0,node);}
  after(node){node.remove();const parent=this.parentElement,at=parent.children.indexOf(this);node.parentElement=parent;parent.children.splice(at+1,0,node);}
  querySelectorAll(selector){if(selector==='button')return this.descendants().filter(n=>n.tagName==='BUTTON');if(selector==='input,select')return this.descendants().filter(n=>['INPUT','SELECT'].includes(n.tagName));if(selector.startsWith('.'))return this.descendants().filter(n=>'.'+n.className===selector);const m=selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);if(m){const key=m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return this.descendants().filter(n=>Object.hasOwn(n.dataset,key)&&(m[2]===undefined||n.dataset[key]===m[2]));}return [];}
  querySelector(selector){if(selector==='[data-busy="true"]')return this.descendants().find(n=>n.dataset.busy==='true')||null;if(selector==='button')return this.querySelectorAll('button')[0];if(selector==='button[type=submit]')return this.querySelectorAll('button').find(n=>n.type==='submit');if(this.querySelectorAll(selector).length)return this.querySelectorAll(selector)[0];if(!this.slots.has(selector)){const node=new Element();node.hidden=selector==='.estate-panel';this.slots.set(selector,node);this.append(node);}return this.slots.get(selector);}
}
const flush=async()=>{for(let i=0;i<16;i++)await Promise.resolve();};
function fixture(email='qhals5060@gmail.com'){
  const root=new Element(),page=new Element(),document=new Events(),window=new Events(),observers=[];root.dataset.estateHost='app';
  let user={uid:'owner-a',email},identity='',onIdentity,app,consent=false,confirmations=0,legacyBack=0,active='fifth',handler=async()=>({rows:[]}),externalDialog=null;
  document.documentElement=new Element();document.activeElement=new Element();document.getElementById=id=>id==='estate'?page:id==='estateStage'?root:null;document.createElement=tag=>new Element(tag);document.querySelector=selector=>selector.startsWith('dialog[open]')?externalDialog:null;
  window.AiderLogNative={};window.AiderDearFirebase={getState:()=>({user})};window.AiderLogAppShell={handleBack:()=>{legacyBack++;return true;}};
  const requests=[];const api={identity(){const next=user?.uid&&['qhals5060@gmail.com','abckms5698@naver.com'].includes(user.email)?user.uid:'';if(next!==identity){identity=next;onIdentity(next);}return next;},call:async(action,payload)=>{requests.push({action,payload});return handler(action,payload);}};
  window.go=function(destination){active=destination;page.classList.toggle('on',destination==='estate');document.dispatchEvent({type:'aiderlog-page-changed'});};
  window.AiderLogWheelV151={navigate(destination){if(window.AiderEstateAppV183?.beforeNavigate(destination)===false)return false;return window.go(destination);}};
  const context=vm.createContext({window,document,location:{search:'',href:'https://aiderdear1.vercel.app/index.html'},URL,URLSearchParams,crypto:webcrypto,AbortController,CustomEvent:class{constructor(type){this.type=type;}},MutationObserver:class{constructor(fn){this.fn=fn;}observe(node,options){observers.push({node,options,fn:this.fn});}},FormData:class{constructor(form){this.values=form.entries||[];}*[Symbol.iterator](){yield* this.values;}},Node:Element,confirm:()=>{confirmations++;return consent;},createEstateClient:fn=>{onIdentity=fn;return api;},installDirectory:value=>app=value,installWorkflow:value=>value.registerView('today',async()=>{}),installEstateCalendar:value=>value.registerView('calendar',async()=>{}),calendarRows:()=>[],matchProperty:()=>({criteria:[]}),estateLabels:{},canUseEstateAccount,console});
  context.mountEstateV171=vm.runInContext('(function(){'+strip(read('estate-v171.js'))+';return mountEstateV171;})()',context);
  vm.runInContext('(function(){'+strip(read('android-src/assets/app-estate-v183.js'))+'})()',context);
  app.registerEntity('tasks',async({container})=>{app.form(container,'',async()=>{await handler('save');});});
  return {root,page,app,window,document,requests,context,mutate:()=>observers.filter(o=>o.node===root&&o.options.childList).forEach(o=>o.fn()),get active(){return active;},get confirmations(){return confirmations;},get legacyBack(){return legacyBack;},allow:value=>consent=value,setHandler:fn=>handler=fn,setDialog:value=>externalDialog=value,changeUser(value){user=value;window.dispatchEvent({type:'aiderdear-firebase-state'});}};
}
test('authorized Estate opens internally, reuses its mount and has the same API; denied accounts cannot navigate directly',async()=>{
  for(const email of ['qhals5060@gmail.com','abckms5698@naver.com']){const f=fixture(email),controller=f.window.AiderEstateV171;assert(f.window.AiderEstateAppV183.open());await flush();assert.equal(f.active,'estate');assert.strictEqual(f.context.mountEstateV171(f.root),controller);await f.app.list('properties');assert.equal(f.requests.at(-1).payload.collection,'properties');}
  for(const email of ['aidway55@gmail.com','friend@example.com']){const f=fixture(email);assert.equal(f.window.AiderEstateAppV183.open(),false);assert.equal(f.window.go('estate'),false);assert.equal(f.active,'fifth');assert.equal(f.requests.length,0);}
});
test('native back and wheel navigation preserve cancelled drafts and close one level after confirmation',async()=>{
  const f=fixture();f.window.AiderEstateAppV183.open();await f.app.open('tasks');const panel=f.root.querySelector('.estate-panel'),form=panel.querySelector('.estate-panel-body').children.find(n=>n.tagName==='FORM');
  form.dispatchEvent({type:'input'});assert(f.window.AiderLogAppShell.handleBack());assert.equal(panel.hidden,false);assert.equal(f.active,'estate');assert.equal(f.legacyBack,0);
  f.window.AiderLogWheelV151.navigate('home');assert.equal(f.active,'estate');assert.equal(panel.hidden,false);assert.equal(f.confirmations,2);
  f.allow(true);f.window.AiderLogAppShell.handleBack();assert.equal(panel.hidden,true);assert.equal(f.active,'estate');f.window.AiderLogAppShell.handleBack();assert.equal(f.active,'fifth');
});
test('saving blocks leave and double submit, failed save retains inputs for retry',async()=>{
  const f=fixture();let reject,calls=0;f.setHandler(()=>{calls++;return new Promise((_,r)=>reject=r);});f.window.AiderEstateAppV183.open();await f.app.open('tasks');const panel=f.root.querySelector('.estate-panel'),form=panel.querySelector('.estate-panel-body').children.find(n=>n.tagName==='FORM');form.entries=[['title','보존할 업무']];form.dispatchEvent({type:'input'});const pending=form.onsubmit({preventDefault(){}});await form.onsubmit({preventDefault(){}});assert.equal(calls,1);
  f.window.go('home');f.window.AiderLogAppShell.handleBack();assert.equal(f.active,'estate');assert.equal(panel.hidden,false);assert.equal(f.confirmations,0);reject(Error('통신 오류'));await pending;assert.equal(form.querySelector('.estate-form-error').textContent,'통신 오류');assert.equal(form.entries[0][1],'보존할 업무');assert(f.window.AiderEstateV171.hasUnsaved());
});
test('logout clears visible record and dirty input immediately; another authorized owner gets a fresh view',async()=>{
  const f=fixture();f.window.AiderEstateAppV183.open();await f.app.open('tasks');const body=f.root.querySelector('.estate-panel-body');f.changeUser(null);await flush();assert.equal(f.active,'fifth');assert.equal(f.root.querySelector('.estate-panel').hidden,true);assert.equal(f.window.AiderEstateV171.hasUnsaved(),false);
  f.changeUser({uid:'owner-b',email:'abckms5698@naver.com'});assert(f.window.AiderEstateAppV183.open());await flush();assert.equal(f.active,'estate');assert.equal(f.confirmations,0);
});
test('non-Estate back and dialogs continue through the established back chain',()=>{
  const f=fixture();f.window.AiderLogAppShell.handleBack();assert.equal(f.legacyBack,1);f.window.AiderEstateAppV183.open();f.setDialog(new Element('dialog'));f.window.AiderLogAppShell.handleBack();assert.equal(f.active,'estate');assert.equal(f.legacyBack,2);
});
test('app directory collapses controls without replacing inputs, listeners, counts or view switches',()=>{
  const f=fixture(),directory=new Element(),toolbar=new Element(),meta=new Element(),input=new Element('input'),sort=new Element('select');toolbar.className='estate-directory-toolbar';meta.className='estate-directory-list-meta';sort.name='directorySort';sort.value='recent';input.value='서울';let changes=0;input.addEventListener('input',()=>changes++);toolbar.append(input,sort,meta);directory.append(toolbar);f.root.append(directory);
  // Model a DOM move as appendChild does, preserving the actual node and listeners.
  const append=Element.prototype.append;Element.prototype.append=function(...nodes){nodes.forEach(node=>node.remove());return append.apply(this,nodes);};
  try{f.mutate();f.mutate();const details=directory.children[0];assert.equal(details.tagName,'DETAILS');assert(!details.open);assert.equal(details.firstElementChild.textContent,'검색 · 필터 · 1개 적용');assert.strictEqual(toolbar.parentElement,details);assert.strictEqual(meta.parentElement,directory);assert.equal(directory.children.length,2);input.dispatchEvent({type:'input'});assert.equal(changes,1);input.value='';f.root.dispatchEvent({type:'input'});assert.equal(details.firstElementChild.textContent,'검색 · 필터');assert.equal(f.app.directoryMode,'cards');}finally{Element.prototype.append=append;}
});
test('real wheel navigation asks the guard before committing its fallback or delayed route',()=>{
  const source=read('android-src/assets/wheel-navigation-v151.js');let commits=0,timers=0,allowed=false;const context={window:{AiderEstateAppV183:{beforeNavigate:()=>allowed}},document:{querySelector:()=>({}),documentElement:{classList:{add(){}}},dispatchEvent(){}},CSS:{escape:String},String,Date,routeToken:0,suppressClickUntil:0,setOpen(){},renderFallback(){commits++;},setTimeout(){timers++;},CustomEvent:class{},console};vm.createContext(context);vm.runInContext(source.slice(source.indexOf('  function navigate(requested)'),source.indexOf('  function start('))+';this.navigate=navigate;',context);assert.equal(context.navigate('home'),false);assert.equal(commits,0);assert.equal(timers,0);allowed=true;context.navigate('home');assert.equal(commits,1);assert.equal(timers,4);
});
test('APK entry contains all editor dependency modules and mirrored assets match shared implementation',()=>{
  const html=read('android-src/assets/index.html');assert.match(html,/id="estate"/);assert.match(html,/data-estate-host="app"/);assert.match(html,/app-estate-v183\.js/);
  for(const name of ['estate-v171.js','estate-directory-v171.js','estate-workflow-v171.js','estate-calendar-view-v172.js','estate-v171.css','estate-directory-v171.css','estate-workflow-v171.css','estate-calendar-view-v172.css','estate-cobroker-v173.css'])assert.equal(read('android-src/assets/'+name),read(name),name);
  const adapter=read('android-src/assets/app-estate-v183.js');assert.doesNotMatch(adapter,/window\.open|openEstateSite|localStorage|indexedDB/);assert.match(read('android-src/assets/app-estate-v183.css'),/@media\(min-width:720px\)/);
});
