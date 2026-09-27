const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

// Optional source overrides allow running this before release-tree integration.
const roots={site:process.env.AIDERLOG_TEST_SITE_ROOT||path.resolve(__dirname,'..'),app:process.env.AIDERLOG_TEST_APP_ROOT||path.resolve(__dirname,'../android-src/assets')};
function worker(root){
  const origin='https://aiderlog.invalid',href=origin+'/sw.js',handlers={},stores=new Map(),deleted=[],precacheModes=[];
  let offline=false,networkStatus=200,networkTag='installed-v197',globalMatches=0,claimed=0,skipped=0,lastFetchOptions;
  const url=value=>new URL(typeof value==='string'?value:value.url,href).href;
  const bare=value=>{const parsed=new URL(url(value));parsed.search='';return parsed.href};
  const network=async(request,options)=>{lastFetchOptions=options;if(offline)throw new TypeError('offline');return new Response(networkTag+':'+new URL(url(request)).pathname,{status:networkStatus})};
  const cacheFor=name=>{
    if(!stores.has(name))stores.set(name,new Map());
    const entries=stores.get(name);
    return {
      async addAll(requests){for(const request of requests){precacheModes.push(request.cache);const response=await network(request);if(!response.ok)throw new Error('precache failed');entries.set(url(request),response.clone())}},
      async put(request,response){entries.set(url(request),response.clone())},
      async match(request,options){const key=url(request);const value=options?.ignoreSearch?[...entries].find(([stored])=>bare(stored)===bare(key))?.[1]:entries.get(key);return value?.clone()},
      async keys(){return [...entries.keys()]}
    };
  };
  stores.set('aiderlog-v196-retired',new Map([[origin+'/firebase-app.js',new Response('old-module-v196')]]));
  stores.set('unrelated-cache',new Map([[origin+'/firebase-app.js',new Response('foreign-module')]]));
  const caches={open:async name=>cacheFor(name),keys:async()=>[...stores.keys()],delete:async name=>{deleted.push(name);return stores.delete(name)},match:async()=>{globalMatches++;throw new Error('Unbounded caches.match is forbidden')}};
  const context={URL,Response,Request,Headers,Set,Promise,console,caches,fetch:network,self:{location:{href,origin},skipWaiting(){skipped++},clients:{async claim(){claimed++}},addEventListener(type,fn){handlers[type]=fn}}};
  vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'sw.js'),'utf8')+'\n;globalThis.__testScope={CACHE,APP_SHELL};',context);
  const scope=context.__testScope;
  async function lifecycle(type){const jobs=[];handlers[type]({waitUntil:promise=>jobs.push(Promise.resolve(promise))});await Promise.all(jobs)}
  async function fetchEvent(target,options={}){
    const jobs=[];let response,handled=false;
    const request={url:new URL(target,origin).href,method:options.method||'GET',mode:options.mode||'cors',headers:new Headers(options.headers)};
    handlers.fetch({request,waitUntil:promise=>jobs.push(Promise.resolve(promise)),respondWith:promise=>{handled=true;response=Promise.resolve(promise)}});
    if(!handled)return{handled:false};
    const value=await response;await Promise.all(jobs);assert.ok(value instanceof Response,'respondWith resolves to a Response');return{handled:true,response:value,text:await value.text()};
  }
  return{scope,stores,deleted,lifecycle,fetchEvent,setOffline:value=>{offline=value},setStatus:value=>{networkStatus=value},setTag:value=>{networkTag=value},stats:()=>({globalMatches,claimed,skipped,lastFetchOptions,precacheModes})};
}

for(const [kind,root]of Object.entries(roots)){
  test(`${kind}: precache and activation retire only older AiderLog caches`,async()=>{
    const w=worker(root);assert.match(w.scope.CACHE,/v197/);
    for(const asset of w.scope.APP_SHELL){assert.ok(fs.existsSync(path.join(root,asset)),`precache resource exists: ${asset}`);assert.doesNotMatch(asset,/android-auth\.html|aiderlog-launch-v145\.gif|bio-admin|estate-share|client-intake|employee\.html/)}
    await w.lifecycle('install');await w.lifecycle('activate');
    assert.equal(w.stats().precacheModes.length,w.scope.APP_SHELL.length);assert.ok(w.stats().precacheModes.every(mode=>mode==='reload'||mode==='no-cache'),'new release precache bypasses stale HTTP cache');
    assert.deepEqual(w.deleted,['aiderlog-v196-retired']);assert.ok(w.stores.has('unrelated-cache'));assert.equal(w.stats().claimed,1);assert.equal(w.stats().skipped,1);
    const keys=[...w.stores.get(w.scope.CACHE).keys()];assert.equal(keys.length,new Set(keys).size);assert.ok(keys.every(key=>!new URL(key).search));
  });
  test(`${kind}: bare/versioned modules share one current-version offline cache entry`,async()=>{
    const w=worker(root);await w.lifecycle('install');const before=w.stores.get(w.scope.CACHE).size;
    w.setOffline(true);const versioned=await w.fetchEvent('/firebase-app.js?v=197');assert.equal(versioned.handled,true);assert.match(versioned.text,/installed-v197/);assert.doesNotMatch(versioned.text,/old-module|foreign-module/);
    const oldRequest=await w.fetchEvent('/firebase-app.js?v=196');assert.equal(oldRequest.handled,true);assert.match(oldRequest.text,/installed-v197/);
    w.setOffline(false);w.setTag('fresh-v197');await w.fetchEvent('/firebase-app.js?v=197');assert.equal(w.stores.get(w.scope.CACHE).size,before);assert.equal(w.stats().lastFetchOptions?.cache,'no-cache','revalidate HTTP cache before storing current shell');
    w.setOffline(true);assert.match((await w.fetchEvent('/firebase-app.js')).text,/fresh-v197/);assert.equal(w.stats().globalMatches,0);
  });
  test(`${kind}: navigation stays on current shell and has offline/server-error fallbacks`,async()=>{
    const w=worker(root);await w.lifecycle('install');w.setTag('updated-shell');await w.fetchEvent('/',{mode:'navigate'});assert.equal(w.stats().lastFetchOptions?.cache,'no-cache','revalidate navigation HTTP cache');
    w.setOffline(true);const offline=await w.fetchEvent('/',{mode:'navigate'});assert.equal(offline.handled,true);assert.match(offline.text,/updated-shell/);
    w.setOffline(false);w.setStatus(503);const failed=await w.fetchEvent('/index.html',{mode:'navigate'});assert.equal(failed.handled,true);assert.match(failed.text,/updated-shell/);
    w.stores.get(w.scope.CACHE).delete('https://aiderlog.invalid/index.html');w.setOffline(true);const missing=await w.fetchEvent('/',{mode:'navigate'});assert.equal(missing.response.status,503);
    assert.equal((await w.fetchEvent('/not-a-shell-page',{mode:'navigate'})).handled,false);assert.equal(w.stats().globalMatches,0);
  });
  test(`${kind}: auth, API, secrets, downloads and unknown feature files never enter shell cache`,async()=>{
    const w=worker(root);await w.lifecycle('install');const before=w.stores.get(w.scope.CACHE).size;
    for(const target of ['/api/private','/android-auth.html','/android-auth.html?code=secret&state=state','/__/auth/handler','/downloads/AiderLog-v197.apk','/AiderLog-v197-site-files.zip','/firebase-app.js?token=secret','/index.html?code=secret','/firebase-app.js?v=197&session=secret','/aiderlog-launch-v145.gif','/bio-admin-v192.js','https://other.invalid/firebase-app.js'])assert.equal((await w.fetchEvent(target)).handled,false,target);
    assert.equal((await w.fetchEvent('/firebase-app.js',{method:'POST'})).handled,false);assert.equal((await w.fetchEvent('/firebase-app.js',{headers:{Authorization:'Bearer test'}})).handled,false);
    assert.equal(w.stores.get(w.scope.CACHE).size,before);
    const retired=await w.fetchEvent('/employee.html',{mode:'navigate'});if(retired.handled)assert.equal(retired.response.status,410);assert.equal(w.stores.get(w.scope.CACHE).size,before);
  });
}
