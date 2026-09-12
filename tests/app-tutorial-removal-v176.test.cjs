const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const repo=path.resolve(__dirname,'..'),assets=path.join(repo,'android-src/assets'),canonical=path.resolve(repo,'../AiderLog-v145-decoded/assets');
const names=['experience-v136.js','experience-v137.js','experience-v143.js','experience-v136.css','experience-v143.css','app-back-gesture-v176.js'];
const read=name=>fs.readFileSync(path.join(assets,name),'utf8');
function startup({returning=false,blockedStorage=false,user=null}={}){
  const created=[],listeners=new Map(),timers=[],storage=new Map(returning?[['aiderlog-tutorial-dismissed-v136','1'],['aiderlog-tutorial-dismissed-v149','1']]:[]),accesses=[],routes=[];
  class Element{constructor(){this.dataset={};this.className='';this.innerHTML='';this.children=[];this.classList={add:name=>{this.className+=' '+name;},remove(){},toggle(){},contains:()=>false};}setAttribute(){}addEventListener(){}append(node){this.children.push(node);}prepend(node){this.children.unshift(node);}remove(){}querySelector(){return null;}querySelectorAll(){return [];}getClientRects(){return [];}}
  const document={readyState:'loading',documentElement:new Element(),body:new Element(),querySelector:selector=>created.find(node=>selector==='.'+node.className)||null,querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>{const node=new Element();created.push(node);return node;},addEventListener(){}};
  const on=(name,handler)=>{if(!listeners.has(name))listeners.set(name,[]);listeners.get(name).push(handler);},emit=event=>{for(const fn of listeners.get(event.type)||[])fn(event);};
  const context={document,console,performance:{now:()=>0},location:{hash:'',pathname:'/index.html',search:''},history:{replaceState(){}},navigator:{},getComputedStyle:()=>({display:'block',visibility:'visible'}),
    localStorage:{getItem:key=>{accesses.push(key);if(blockedStorage)throw Error('storage blocked');return storage.get(key)||null;},setItem:(key,value)=>{accesses.push(key);if(blockedStorage)throw Error('storage blocked');storage.set(key,value);}},sessionStorage:{getItem:()=>null,setItem(){if(blockedStorage)throw Error('storage blocked');}},
    requestAnimationFrame(){},setTimeout:fn=>{timers.push(fn);return timers.length;},clearTimeout(){},MutationObserver:class{observe(){}},CustomEvent:class{constructor(type){this.type=type;}},Event:class{constructor(type){this.type=type;}},
    addEventListener:on,dispatchEvent:emit,go:page=>routes.push(page),AiderDearFirebase:{getState:()=>({user})}};
  context.window=context;vm.createContext(context);for(const name of names.filter(name=>/^experience.*\.js$/.test(name)))vm.runInContext(read(name),context,{filename:name});
  emit({type:'load'});while(timers.length)timers.shift()();emit({type:'aiderlog-splash-complete'});
  return {context,created,listeners,accesses,routes};
}
test('fresh, returning and storage-blocked startup never creates or schedules a tutorial',()=>{
  for(const options of [{},{returning:true},{blockedStorage:true}]){const h=startup(options);assert.equal(h.listeners.has('aiderlog-splash-complete'),false);assert.equal('renderTutorial' in h.context.AiderLogV143,false);assert.ok(h.created.some(node=>node.className.includes('app-splash-v136')));assert.ok(h.created.every(node=>!/tutorial/i.test(node.className+node.innerHTML)));assert.ok(h.accesses.every(key=>!/tutorial/i.test(key)));}
});
test('profile retains birthday, theme, font and account controls without a replay action',()=>{
  for(const user of [null,{uid:'fixture',email:'fixture@example.test',name:'사용자',birthDate:'1999-01-01'}]){const h=startup({user});h.context.AiderLogProfileV175.open();const sheet=h.created.find(node=>node.className.includes('profile-overlay-v137'));assert.ok(sheet);assert.doesNotMatch(sheet.innerHTML,/tutorial|사용 방법|다시 보기/);assert.match(sheet.innerHTML,/시스템 테마/);assert.match(sheet.innerHTML,/글자 크기/);assert.match(sheet.innerHTML,user?/data-profile-logout-v137/:/data-profile-login-v137/);if(user)assert.match(sheet.innerHTML,/id="loginBirthDate"/);}
});
test('native navigation and non-tutorial dialogs remain installed',()=>{
  const h=startup();assert.equal(typeof h.context.AiderLogAppShell.openTarget,'function');h.context.AiderLogAppShell.openTarget('personal');assert.deepEqual(h.routes,['personal']);assert.equal(h.context.AiderLogAppShell.handleBack(),false);assert.equal(typeof h.context.AiderLogV143.navigate,'function');assert.equal(typeof h.context.AiderLogV143.renderInsights,'function');assert.match(read('experience-v136.js'),/completeAndroidGoogleSignIn/);assert.match(read('experience-v136.js'),/aiderlog-splash-complete/);assert.match(read('experience-v143.js'),/function decoratePostcard/);
});
test('tutorial code, skip flags, replay selectors and CSS are deleted, not hidden',()=>{
  for(const name of names){assert.doesNotMatch(read(name),/tutorial|TUTORIAL|maybeShowTutorial|renderTutorial/);assert.equal(read(name),fs.readFileSync(path.join(canonical,name),'utf8'),name+' canonical mirror');}
  assert.match(read('experience-v136.css'),/app-splash-v136/);assert.match(read('experience-v136.css'),/dream-orbit-v136\.png/);assert.match(read('experience-v143.css'),/insight-envelope/);
});
