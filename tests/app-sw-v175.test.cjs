const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'android-src/assets/sw.js'),'utf8');
const canonical=path.resolve(root,'../AiderLog-v145-decoded/assets');
function fixture(){
 const events=new Map(),stored=[],precached=[];
 const cache={put:async(...args)=>stored.push(args),addAll:async urls=>precached.push(...urls)};
 const context={URL,Set,Promise,self:{location:{href:'https://aiderdear1.vercel.app/sw.js',origin:'https://aiderdear1.vercel.app'},addEventListener:(type,fn)=>events.set(type,fn),skipWaiting(){},clients:{claim:async()=>{}}},caches:{open:async()=>cache,match:async()=>null,keys:async()=>[],delete:async()=>true},fetch:async()=>({ok:true,clone:()=>({})})};
 vm.runInNewContext(source+';globalThis.shell=[...SHELL_URLS_V175];globalThis.cacheName=CACHE',context);
 return{context,events,stored,precached,request:(pathname,options={})=>{let response;const waits=[];events.get('fetch')({request:{url:'https://aiderdear1.vercel.app'+pathname,method:'GET',mode:'cors',headers:new Headers(),...options},respondWith:value=>response=value,waitUntil:value=>waits.push(value)});return{response,waits}}};
}
test('Android service worker cache and shell queries use v176 and every precache file exists',()=>{
 const f=fixture();assert.equal(f.context.cacheName,'aiderlog-v176-wheelbar-widget-colours');assert.doesNotMatch(source,/\?v=169|CACHE='aiderlog-v169/);
 for(const url of f.context.shell){const pathname=decodeURIComponent(new URL(url).pathname);const target=path.join(canonical,pathname==='/'?'index.html':pathname.slice(1));assert.ok(fs.existsSync(target),pathname);}
 assert.equal(source,fs.readFileSync(path.join(canonical,'sw.js'),'utf8'));
 for(const name of ['private-calendar-ui-v175.js','private-calendar-v175.js','friend-schedule-firebase-v175.js','business-calendar-v175.js','insight-range-v175.js','app-dday-v175.js','shared-schedule-v176.js','wheelbar-v176.js'])assert.ok(f.context.shell.some(url=>new URL(url).pathname==='/'+name),name);
 for(const url of f.context.shell){const query=new URL(url).searchParams;if(query.has('v'))assert.equal(query.get('v'),'176',url);}
});
test('Android service worker install de-duplicates requested shell URLs',async()=>{
 const f=fixture();let pending;f.events.get('install')({waitUntil:p=>pending=p});await pending;
 assert.equal(f.precached.length,new Set(f.precached).size);assert.ok(f.precached.length>100);
});
test('Android service worker never handles APIs, credentials, private files, uploads or APKs',()=>{
 const f=fixture();for(const url of ['/api/estate','/api/work','/api/private-calendar','/downloads/private.json','/private-record.json','/customer-contract.pdf','/AiderLog-v176.apk'])assert.equal(f.request(url).response,undefined,url);
 assert.equal(f.request('/firebase-app.js?v=176',{headers:new Headers({Authorization:'Bearer local-test'})}).response,undefined);
 assert.equal(f.request('/index.html',{method:'POST'}).response,undefined);
});
test('Android offline shell is not overwritten by navigation to intake or shared pages',()=>{
 const f=fixture();for(const url of ['/client-intake.html?token=local-test','/estate-share.html','/private-calendar.json'])assert.equal(f.request(url,{mode:'navigate'}).response,undefined,url);
 assert.ok(f.request('/index.html?android-preview=1',{mode:'navigate'}).response);
});
test('Android static calendar code can still use the declared offline cache',async()=>{
 const f=fixture(),r=f.request('/private-calendar-v175.js?v=176');assert.ok(r.response);await r.response;await Promise.all(r.waits);assert.equal(f.stored.length,1);
});
