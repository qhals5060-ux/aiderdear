const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const repo=path.resolve(__dirname,'..'),assets=path.join(repo,'android-src/assets');
const source=fs.readFileSync(path.join(assets,'my-workspaces-v128.js'),'utf8');
function policy(user,legacyUser){
  const context={window:{AiderDearFirebase:{getState:()=>({user})}},authState:{user:legacyUser},Object,String,Boolean};
  vm.createContext(context);
  vm.runInContext(source.slice(source.indexOf('  const currentUserV180'),source.indexOf('  const icon ='))+';this.allowed=canUseModeV180;this.paper=canUsePaper;this.uid=currentUid;',context);
  return context;
}
test('My cards exactly follow the three signed-in account lists without preview bypass',()=>{
  const routes=['paper','task','work','lab','estate','speech','brain','study'];
  const expected={
    'qhals5060@gmail.com':routes,
    'aidway55@gmail.com':['paper','task','work','lab'],
    'abckms5698@naver.com':['estate'],
    'friend@example.com':[]
  };
  for(const[email,list]of Object.entries(expected))assert.deepEqual(routes.filter(policy({uid:'actor',email}).allowed),list);
  assert(routes.every(route=>!policy(null,{uid:'old',email:'qhals5060@gmail.com'}).allowed(route)));
  assert(routes.every(route=>!policy({email:'qhals5060@gmail.com'}).allowed(route)));
  assert(policy({uid:'actor',email:' QHALS5060@GMAIL.COM '}).paper());
  assert.doesNotMatch(source,/previewMode/);
});
test('My hub produces only allowed cards and names Estate as a site handoff',()=>{
  const user={uid:'actor',email:'qhals5060@gmail.com'},context=policy(user);
  Object.assign(context,{P:{},ensureData:()=>({paperItems:[],consultingTasks:[],consultingClients:[],workRecords:[],labNotebookEntries:[],labNotebookLinks:[]}),icon:()=>'<svg/>',safe:String});
  vm.runInContext(source.slice(source.indexOf('  function hubHtml()'),source.indexOf('  const subhead ='))+';this.render=hubHtml;',context);
  assert.equal((context.render().match(/data-my128-open=/g)||[]).length,8);
  assert.match(context.render(),/부동산 업무 · 사이트에서 열기/);
  user.email='aidway55@gmail.com';let html=context.render();assert.equal((html.match(/data-my128-open=/g)||[]).length,4);assert.match(html,/data-my128-open="paper"/);assert.doesNotMatch(html,/data-my128-open="(?:estate|speech|brain|study)"/);
  user.email='abckms5698@naver.com';html=context.render();assert.equal((html.match(/data-my128-open=/g)||[]).length,1);assert.match(html,/data-my128-open="estate"/);
});
test('Estate native handoff is guarded and carries neither token nor account data',()=>{
  let nativeCalls=0,browserCalls=[];const user={uid:'actor',email:'qhals5060@gmail.com'},context=policy(user);
  Object.assign(context,{toast:()=>{},alert:()=>{},Error});context.window.AiderLogNative={openEstateSite:()=>{nativeCalls++;return true;}};context.window.open=(...args)=>browserCalls.push(args);
  vm.runInContext(source.slice(source.indexOf('  function openEstateSiteV180()'),source.indexOf('  function openLegacyBrain()'))+';this.open=openEstateSiteV180;',context);
  assert(context.open());assert.equal(nativeCalls,1);assert.equal(browserCalls.length,0);
  user.email='aidway55@gmail.com';assert.equal(context.open(),false);assert.equal(nativeCalls,1);
  user.email='abckms5698@naver.com';delete context.window.AiderLogNative;context.open();assert.equal(browserCalls[0][0],'https://aiderdear1.vercel.app/?site-edition=modern&open=estate');assert.equal(browserCalls[0][2],'noopener,noreferrer');
  const smali=fs.readFileSync(path.join(repo,'android-src/smali/MainActivity$NativeBridge.smali'),'utf8');
  const native=smali.slice(smali.indexOf('.method public openEstateSite()Z'),smali.indexOf('.method public syncWidgets('));
  assert.match(native,/android.intent.action.VIEW/);assert.match(native,/JavascriptInterface/);assert.match(native,/open=estate/);assert.doesNotMatch(native,/getIdToken|access_token|email|p1/);
});
test('app top memo button opens detailed todo management instead of the legacy quick overlay',()=>{
  const code=fs.readFileSync(path.join(assets,'experience-v142.js'),'utf8'),body=code.slice(code.indexOf('  function openNotepad(){'),code.indexOf('  window.AiderLogNotepadV142='));let kind,closed=0;
  const context={window:{AiderTodoV179:{open:value=>kind=value}},$:()=>({classList:{remove:()=>closed++}})};vm.createContext(context);vm.runInContext(body+';openNotepad()',context);
  assert.equal(kind,'todo');assert.equal(closed,1);assert.doesNotMatch(body,/renderNotepad|\.focus\(/);assert.match(code,/투두 및 메모 관리/);
  const app=fs.readFileSync(path.join(assets,'app-todo-v179.js'),'utf8');for(const feature of ['data-todo-search-v179','data-todo-filter-v179','data-todo-kind-v179','data-todo-edit-v179','data-todo-delete-v179','name="date"','name="notes"'])assert(app.includes(feature));
});
function handoff(user,hidden=false){
  let clicks=0,historyPath='',frame=[],listeners={},subscription,observer;
  const tab={hidden,disabled:false,click:()=>{clicks++;app.dataset.activeTab='estate';}},app={dataset:{}},location={href:'https://aiderdear1.vercel.app/?site-edition=modern&open=estate'};
  const context={window:{AiderDearFirebase:{getState:()=>({user}),subscribe:fn=>subscription=fn},addEventListener:(type,fn)=>listeners[type]=fn},document:{documentElement:{classList:{contains:()=>false}},querySelector:q=>q==='#app'?app:tab},URL,Set,String,location,history:{state:null,replaceState:(_,__,path)=>historyPath=path},requestAnimationFrame:fn=>frame.push(fn),MutationObserver:class{constructor(fn){observer=this;this.fn=fn;}observe(){}disconnect(){this.stopped=true;}}};
  vm.runInNewContext(fs.readFileSync(path.join(repo,'app-estate-handoff-v180.js'),'utf8'),context);
  return {flush:()=>{const tasks=frame.splice(0);tasks.forEach(fn=>fn());},login:next=>{user=next;subscription?.();},show:()=>{tab.hidden=false;observer.fn();},get clicks(){return clicks},get path(){return historyPath},get stopped(){return observer.stopped}};
}
test('Estate website handoff waits for its own authorized login and visible tab',()=>{
  const f=handoff(null,true);f.flush();assert.equal(f.clicks,0);
  f.login({uid:'friend',email:'friend@example.com'});f.flush();assert.equal(f.clicks,0);
  f.login({uid:'broker',email:'abckms5698@naver.com'});f.flush();assert.equal(f.clicks,0);
  f.show();f.flush();assert.equal(f.clicks,1);assert.equal(f.path,'/?site-edition=modern');assert(f.stopped);
  f.login({uid:'broker',email:'abckms5698@naver.com'});f.flush();assert.equal(f.clicks,1);
});
test('Estate website handoff does not widen site or server access policies',()=>{
  const site=fs.readFileSync(path.join(repo,'index.html'),'utf8'),server=fs.readFileSync(path.join(repo,'estate-domain-v171.js'),'utf8');
  assert.match(site,/app-estate-handoff-v180\.js/);assert.match(site,/\['qhals5060@gmail\.com','abckms5698@naver\.com'\]\.includes\(email\)/);
  assert.match(server,/\['qhals5060@gmail\.com','abckms5698@naver\.com'\]/);
});
