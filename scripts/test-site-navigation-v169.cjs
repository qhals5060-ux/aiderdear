/* No browser credentials or network: exercise the actual page switchers and SW. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const {staleWorker}=require('../tests/fixtures/historical-navigation-v169.cjs');
const root=path.resolve(__dirname,'..'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const passed=[];
function fn(name){
  const start=html.indexOf('  function '+name+'(');assert(start>=0,name+' exists');
  const tail=html.slice(start),next=tail.indexOf('\n  ',3);
  // Multiline helpers end on an independently indented closing brace; legacy
  // switchers are a single line or are followed by their original button bind.
  if(name==='setSitePaneVisibilityV169')return tail.slice(0,tail.indexOf('\n  }')+4);
  const end=tail.indexOf('\n  $$(\'');
  assert(end>0,name+' has its original button binding');return tail.slice(0,end);
}
function element(name){
  const styles=new Map(),attributes=new Map();
  const node={name,dataset:{},hidden:false,inert:false,offsetWidth:100,className:'page current',
    setAttribute:(key,value)=>attributes.set(key,String(value)),
    getAttribute:key=>attributes.get(key)??null,
    hasAttribute:key=>key.startsWith('data-')?Object.hasOwn(node.dataset,key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())):attributes.has(key),
    style:{setProperty:(key,value,priority='')=>styles.set(key,{value,priority}),getPropertyValue:key=>styles.get(key)?.value||'',getPropertyPriority:key=>styles.get(key)?.priority||'',removeProperty:key=>styles.delete(key)},
    listeners:{},addEventListener(type,handler){this.listeners[type]=handler},click(){this.listeners.click?.({target:this})}};
  node.classList={contains:value=>node.className.split(/\s+/).includes(value),add(...values){node.className=[...new Set([...node.className.split(/\s+/),...values])].join(' ')},remove(...values){node.className=node.className.split(/\s+/).filter(x=>!values.includes(x)).join(' ')},toggle(value,on){if(on)this.add(value);else this.remove(value)}};
  return node;
}
function navigationTests(){
  const groups=[
    {fn:'goPage',panes:['page0','page1'],buttons:'.dotnav',key:'page'},
    {fn:'goRecordPage',panes:['recordHubShell','eventStage'],buttons:'.record-dot',key:'recordPage'},
    {fn:'goPrivatePage',panes:['privateShell','privateLanguageShell'],buttons:'.private-dot',key:'privatePage'},
    {fn:'goPersonalPage',panes:['personalMainShell','personalOverviewShell'],buttons:'.personal-dot',key:'personalPage'},
    {fn:'goTaskPage',panes:['taskPage0','taskPage1'],buttons:'[data-task-page]',key:'taskPage'},
  ];
  for(const group of groups){
    const nodes=new Map(),get=selector=>{if(selector==='#coupleVideo2')return null;if(!nodes.has(selector))nodes.set(selector,element(selector));return nodes.get(selector)};
    const panes=group.panes.map(id=>get('#'+id)),buttons=[0,1].map(i=>{const b=element('button'+i);b.dataset[group.key]=String(i);return b});
    const context={window:{},document:{documentElement:{classList:{contains:()=>false}}},$:get,$$:selector=>selector==='#taskStage .task-page'?panes:buttons,Math,Number,String,Date,setTimeout:()=>0,requestAnimationFrame:callback=>callback(),
      animateLines:()=>{},animateStandaloneFrame:()=>{},renderRecordFeed:()=>{},renderAlbumFolders:()=>{},renderEventArchive:()=>{},renderTravelArchive:()=>{},renderPrivate:()=>{},renderPersonal:()=>{},renderGraduateConsultingCalendar:()=>{}};
    vm.createContext(context);
    vm.runInContext('let pageIndex=0,locked=false,recordPageIndex=0,recordFlipLocked=false,privatePageIndex=0,privateFlipLocked=false,personalPageIndex=0,personalFlipLocked=false,taskPageIndex=0;'+fn('setSitePaneVisibilityV169')+'\n'+fn(group.fn),context);
    const bind=new RegExp("^  \\$\\$\\('"+group.buttons.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+"'\\)\\.forEach\\([^\\n]*addEventListener[^\\n]+",'m').exec(html);
    assert(bind,group.fn+' original binding');vm.runInContext(bind[0],context);
    for(const selected of [1,0,1,1,0,1,0]){
      buttons[selected].click();
      panes.forEach((pane,i)=>{
        assert.equal(pane.hidden,i!==selected);assert.equal(pane.inert,i!==selected);
        assert.equal(pane.getAttribute('aria-hidden'),String(i!==selected));
        assert.equal(pane.classList.contains('current'),i===selected);
        assert.equal(pane.dataset.sitePaneActive,String(i===selected));
        // An author stylesheet's cached display:grid!important loses to this
        // inline important declaration. Active display remains design-owned.
        assert.equal(pane.style.getPropertyValue('display'),i===selected?'':'none');
        assert.equal(pane.style.getPropertyPriority('display'),i===selected?'':'important');
      });
    }
    passed.push(group.fn+': 7 rapid original-button selections update actual pane visibility');
    const p=panes[0];context.window.AiderLogNative={};p.hidden=false;p.style.removeProperty('display');vm.runInContext('setSitePaneVisibilityV169($("#'+group.panes[0]+'"),false)',context);assert.equal(p.hidden,false);assert.equal(p.style.getPropertyValue('display'),'');
  }
  passed.push('Native app guard: website visibility policy does not change Android panes');
}
async function serviceWorker(source){
  const listeners={},entries=new Map(),calls=[];let mode='online',body='fresh';
  const cache={addAll:async()=>{},put:async(request,response)=>entries.set(typeof request==='string'?request:request.url,response.clone()),match:async request=>entries.get(typeof request==='string'?request:request.url)?.clone()};
  const context={URL,Response,Promise,self:{location:{origin:'https://fixture.invalid'},clients:{claim:async()=>{}},skipWaiting(){},addEventListener:(type,fn)=>listeners[type]=fn},caches:{open:async()=>cache,match:cache.match,keys:async()=>[],delete:async()=>true},fetch:async(request,options)=>{calls.push(options);if(mode==='offline')throw Error('isolated offline');return new Response(body,{status:mode==='error'?503:200})}};
  vm.createContext(context);vm.runInContext(source,context);
  return {entries,calls,set(value,text='fresh'){mode=value;body=text},async request(pathname,mode='cors',method='GET',headers={}){let response=null;const waits=[];listeners.fetch({request:{url:'https://fixture.invalid'+pathname,mode,method,headers:new Headers(headers)},respondWith:p=>response=p,waitUntil:p=>waits.push(p)});const result=response?await response:null;await Promise.allSettled(waits);return result}};
}
async function swTests(){
  const source=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  // The pinned faulty fetch tail is retained as a test-only fixture, so this
  // negative control needs neither a Git checkout nor a subprocess permission.
  const old=await serviceWorker(staleWorker);old.entries.set('https://fixture.invalid/site-modern-v165.css?v=167',new Response('stale'));
  assert.equal(await (await old.request('/site-modern-v165.css?v=167')).text(),'stale');
  passed.push('Regression reproduced: v168 SW returns stale cached CSS to an online v168 document');
  const worker=await serviceWorker(source);
  for(const file of ['site-modern-v165.css?v=167','site-layout-v165.js?v=167','language-lab-v18-template.html','paper-analysis-prompt-v159.txt','manifest.webmanifest','language-data-v2/data/manifest.json']){
    worker.entries.set('https://fixture.invalid/'+file,new Response('stale'));
    assert.equal(await (await worker.request('/'+file)).text(),'fresh');assert.equal(worker.calls.at(-1).cache,'no-cache');
  }
  passed.push('6 shell asset types: online current response replaces stale cache');
  worker.set('offline');assert.equal(await (await worker.request('/site-modern-v165.css?v=167')).text(),'fresh');assert.equal((await worker.request('/missing.css')).status,503);
  passed.push('Offline shell is readable; missing assets return explicit 503');
  worker.set('error');assert.equal(await (await worker.request('/site-modern-v165.css?v=167')).text(),'fresh');
  passed.push('Transient HTTP failure retains previously working cached shell');
  assert.equal(await worker.request('/api/work'),null);assert.equal(await worker.request('/api/storage','cors','POST'),null);assert.equal(await worker.request('/AiderLog-v169.apk'),null);
  passed.push('API mutations and release downloads never pass through shell cache');
  assert.equal(await worker.request('/site-modern-v165.css','cors','GET',{'Authorization':'Bearer isolated-test-token'}),null);
  passed.push('Authenticated GET requests never pass through shell cache');
}
(async()=>{navigationTests();await swTests();console.log(JSON.stringify({ok:true,passed},null,2))})().catch(error=>{console.error(error);process.exitCode=1});
