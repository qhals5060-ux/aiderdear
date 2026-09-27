const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),path=require('path');
const source=process.env.AIDERLOG_APP_SW||path.resolve(__dirname,'../android-src/assets/sw.js');
const origin='https://appassets.androidplatform.net',base=origin+'/assets/sw.js',current='aiderlog-v193-core',handlers={},stores=new Map();let network=async()=>{throw Error('offline')},checks=0;
const canonical=key=>new URL(typeof key==='string'?key:key.url,base).href;
function store(name){if(!stores.has(name))stores.set(name,new Map());return stores.get(name);}
const cacheApi=name=>({addAll:async keys=>{for(const key of keys){assert.equal(key.cache,'reload');store(name).set(canonical(key),new Response('asset'));}},match:async key=>store(name).get(canonical(key))?.clone(),put:async(key,response)=>store(name).set(canonical(key),response.clone())});
const context={URL,Request,Response,Promise,Set,Error,self:{location:new URL(base),skipWaiting(){},clients:{claim:async()=>{}},addEventListener:(kind,callback)=>handlers[kind]=callback},caches:{open:async name=>cacheApi(name),keys:async()=>[...stores.keys()],delete:async name=>stores.delete(name),match(){throw Error('Cross-cache reads are forbidden')}},fetch:(request,options)=>{assert.equal(options?.cache,'no-cache');return network(request);}};
vm.runInNewContext(fs.readFileSync(source,'utf8'),context,{filename:'sw.js'});
async function lifecycle(type){const pending=[];handlers[type]({waitUntil:promise=>pending.push(promise)});await Promise.all(pending);}
async function request(suffix,{mode='cors',method='GET',headers={}}={}){let response;const pending=[];handlers.fetch({request:{url:origin+suffix,method,mode,headers:new Headers(headers)},respondWith:promise=>response=promise,waitUntil:promise=>pending.push(promise)});const result=response?await response:null;await Promise.all(pending);return result;}
const pass=name=>{checks++;console.log('PASS',name);};
(async()=>{
await lifecycle('install');assert(!store(current).has(origin+'/assets/android-auth.html'));pass('Auth return page is not precached');
store(current).set(origin+'/assets/app-core-v193.js',new Response('current-script'));
assert.equal(await (await request('/assets/app-core-v193.js?v=193')).text(),'current-script');assert.equal([...store(current).keys()].filter(key=>key.includes('app-core-v193.js')).length,1);pass('Versioned module works offline using one canonical cache entry');
for(const suffix of ['/assets/android-auth.html','/assets/index.html?code=secret','/assets/app-core-v193.js?v=193&token=secret','/api/private','/downloads/a.apk','/assets/user-photo.png']){assert.equal(await request(suffix),null);}pass('Auth, query tokens, API, downloads and unknown files bypass cache');
assert.equal(await request('/assets/app-core-v193.js',{headers:{Authorization:'test'}}),null);assert.equal(await request('/assets/app-core-v193.js',{method:'POST'}),null);pass('Authorized and non-GET requests bypass cache');
store(current).set(origin+'/assets/index.html',new Response('current-index'));network=async()=>new Response('server failure',{status:500});assert.equal(await (await request('/assets/index.html',{mode:'navigate'})).text(),'current-index');pass('Navigation server errors fall back to this release');
network=async()=>{throw Error('offline')};store('aiderlog-old').set(origin+'/assets/index.html',new Response('stale-account'));store(current).delete(origin+'/assets/index.html');assert.equal((await request('/assets/',{mode:'navigate'})).status,503);pass('Missing current index never falls through to an old cache');
store(current).delete(origin+'/assets/app-core-v193.js');assert.equal((await request('/assets/app-core-v193.js?v=193')).status,503);pass('Missing offline assets return a defined 503 response');
store('unrelated-site-cache');await lifecycle('activate');assert(!stores.has('aiderlog-old'));assert(stores.has('unrelated-site-cache'));pass('Activation removes old app caches and preserves unrelated caches');
console.log(`${checks} service-worker checks passed`);
})().catch(e=>{console.error(e);process.exit(1);});
