'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),app=path.resolve(root,'../AiderLog-v145-decoded/assets');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
function storage(entries={}){const data=new Map(Object.entries(entries));return {get length(){return data.size},key:i=>[...data.keys()][i]??null,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k),data};}
function harness(store=storage()){const window={},context={window,localStorage:store,location:{origin:'https://app.example'},URL};vm.runInNewContext(read('retired-features-v178.js'),context);return {api:window.AiderLogRetiredFeaturesV178,store};}
test('website and app no longer load or expose the language feature',()=>{
 for(const [base,html] of [[root,read('index.html')],[app,fs.readFileSync(path.join(app,'index.html'),'utf8')]]){
  assert.doesNotMatch(html,/<(?:script|link)[^>]*(?:src|href)=["'][^"']*(?:site-)?language(?:-|\.)/i);
  assert.doesNotMatch(html,/id=["'](?:language|privateLanguageShell|languageLearningBlank)["']|initAiderLogLanguageLab|renderLanguageStudy|function renderLanguage\(/);
  assert.match(html,/retired-features-v178\.js/);
  for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){
   if(/\bsrc=|type=["'](?:module|application\/)/i.test(match[1]))continue;
   assert.doesNotThrow(()=>new vm.Script(match[2]),'retained inline app code must compile');
  }
  for(const match of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']\.\/([^"']+\.(?:js|css)(?:\?[^"']*)?)["']/gi)){
   const filename=match[1].split('?')[0];assert(fs.existsSync(path.join(base,filename)),filename+' must be packaged');
  }
 }
 assert.doesNotMatch(read('android-src/assets/my-workspaces-v128.js'),/languageHtml|bindMyLanguage|\['language','speech'|'study','language'/);
 assert.match(read('android-src/assets/my-workspaces-v128.js'),/canUseTraining\(\)/);
 assert.match(read('index.html'),/consultingClientLanguageSpec/);
 assert.match(read('android-src/assets/my-workspaces-v128.js'),/languageSpec:q\('#clientLanguage128'\)/);
});
test('bundled courses and all learning-only application files are absent',()=>{
 for(const base of [root,app,path.join(root,'android-src/assets')]){
  for(const name of fs.readdirSync(base))assert(!/^(?:site-)?language(?:-|\.)/.test(name),name);
 }
 assert(!fs.existsSync(path.join(root,'api/youtube-transcript.mjs')));
 for(const name of ['sw.js','android-src/assets/sw.js'])assert.doesNotMatch(read(name),/LANGUAGE_FILES|['"]\.\/(?:site-)?language/);
});
test('My routing and native targets retain no learning entry; background transcript fetching is gone',()=>{
 for(const name of ['android-src/assets/enhancements-v118.js','android-src/assets/feature-system-v125.js','site-layout-v165.js','site-editions-v164.js','site-typography-v169.js']){
  const code=read(name);assert.doesNotMatch(code,/aiderlog-language-lab|language-lab-ready|analyseShorts|fetchTranscript|languageShorts|mountLanguage/);
  assert.doesNotThrow(()=>new vm.Script(code));
 }
 const native=read('android-src/smali/MainActivity.smali'),method=native.slice(native.indexOf('.method private safeTarget'),native.indexOf('.end method',native.indexOf('.method private safeTarget')));
 assert.doesNotMatch(method,/"language"/);
});
test('retiring a tool preserves its existing records and Consult qualifications',()=>{
 const data={languageStudy:{notes:{a:'obsolete'}},languageShorts:{},languageShortsV118:{},consultingClients:[{languageSpec:'TOEFL 105'}],personalItems:[{category:'reading',title:'Language research'}],ddays:[{id:'keep'}],profile:{language:'ko'}};
 const store=storage({'aiderlog-language-course-v114':'{}','aiderlog-language-mode-v118':'course','languageProgress:owner:en:1:1':'{}','aiderlog-private-v20':JSON.stringify(data),'aiderlogTheme':'slate','aiderlog-app-v20':'{"records":[1]}','language-preference':'ko','consult-languageSpec':'TOEFL'});
 const {api}=harness(store);const next=JSON.parse(store.getItem('aiderlog-private-v20'));
 assert.deepEqual(next,data);
 assert.deepEqual(next.consultingClients,data.consultingClients);assert.deepEqual(next.personalItems,data.personalItems);assert.deepEqual(next.ddays,data.ddays);
 assert.equal(store.getItem('aiderlog-language-course-v114'),'{}');assert.equal(store.getItem('languageProgress:owner:en:1:1'),'{}');
 for(const key of ['aiderlogTheme','aiderlog-app-v20','language-preference','consult-languageSpec'])assert.notEqual(store.getItem(key),null);
 assert.strictEqual(api.cleanPrivate(data),data);assert(Object.hasOwn(data,'languageStudy'));assert.equal(data.profile.language,'ko');
 assert.equal(api.cleanPrivate(null),null);assert.equal(api.cleanPrivate('raw'),'raw');
});
test('malformed private data remains recoverable; cleanup is idempotent',()=>{
 const store=storage({'aiderlog-private-v20':'{broken','aiderlog-language-course-v114':'{}'}),{api}=harness(store);
 assert.equal(store.getItem('aiderlog-private-v20'),'{broken');api.cleanLocal(store);assert.equal(store.getItem('aiderlog-private-v20'),'{broken');
});
test('offline cleanup deletes only same-origin learning assets within app-owned caches',async()=>{
 const {api}=harness(),removed=[],opened=[];
 const urls=['https://app.example/language-lab-v18.js?v=176','https://app.example/language-data-v2/data/ja/level-1.json','https://app.example/site-language-modern-v165.css','https://foreign.example/language-lab-v18.js','https://app.example/consult-v167.js','https://app.example/index.html','https://app.example/photos/language-study.jpg'];
 const cache={keys:async()=>urls.map(url=>({url})),delete:async r=>removed.push(r.url)};
 await api.cleanOffline({keys:async()=>['aiderlog-v177','other-site-cache'],open:async name=>{opened.push(name);return cache}});
 assert.deepEqual(opened,['aiderlog-v177']);assert.deepEqual(removed,urls.slice(0,3));
});
