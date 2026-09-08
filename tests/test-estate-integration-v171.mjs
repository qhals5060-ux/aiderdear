// Executes the actual controller/calendar source with a bounded DOM/API double.
// No browser, network, database, Google Calendar or production writes are performed.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {calendarRows} from '../estate-domain-v171.js';

const read=name=>fs.readFileSync(new URL('../'+name,import.meta.url),'utf8');
const controller=read('estate-v171.js'),calendar=read('estate-calendar-v171.js'),index=read('index.html');
const stripImports=source=>source.replace(/^import .*;\r?$/gm,'');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
class Events{
 constructor(){this.listeners=new Map();}
 addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(fn);}
 removeEventListener(name,fn){this.listeners.set(name,(this.listeners.get(name)||[]).filter(listener=>listener!==fn));}
 dispatchEvent(event){for(const fn of this.listeners.get(event.type)||[])fn(event);return true;}
}
class Element extends Events{
 constructor(tag='div'){super();this.tagName=tag.toUpperCase();this.children=[];this.slots=new Map();this.dataset={};this.style={setProperty(){}};this.classList={contains:()=>false,add(){}};this.hidden=false;this.disabled=false;this.value='';this.scrollTop=0;this.elements={q:{value:''}};this.inner='';this.textContent='';}
 set innerHTML(value){this.inner=String(value);this.children=[];this.slots.clear();for(const match of this.inner.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/g)){const b=new Element('button');b.textContent=match[2];b.disabled=/\bdisabled\b/.test(match[1]);for(const attr of match[1].matchAll(/([\w-]+)(?:="([^"]*)")?/g)){b[attr[1]]=attr[1]==='disabled'?true:attr[2]??'';if(attr[1].startsWith('data-'))b.dataset[attr[1].slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=attr[2]??'';}this.append(b);}}
 get innerHTML(){return this.inner;}
 append(...nodes){for(const node of nodes){node.parentElement=this;this.children.push(node);}}
 appendChild(node){this.append(node);return node;}
 replaceChildren(...nodes){this.inner='';this.children=[];this.slots.clear();this.append(...nodes);}
 remove(){if(this.parentElement)this.parentElement.children=this.parentElement.children.filter(n=>n!==this);}
 setAttribute(k,v){this[k]=v;}
 getAttribute(k){return this[k];}
 focus(){}
 reset(){for(const input of Object.values(this.elements)){input.value='';input.checked=false;}}
 getBoundingClientRect(){return {top:100};}
 descendants(){return this.children.flatMap(node=>[node,...node.descendants()]);}
 querySelectorAll(selector){if(selector==='button')return this.descendants().filter(n=>n.tagName==='BUTTON');const m=selector.match(/^\[data-([\w-]+)(?:="([^"]*)")?\]$/);if(m){const key=m[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase());return this.descendants().filter(n=>Object.hasOwn(n.dataset,key)&&(m[2]===undefined||n.dataset[key]===m[2]));}return [];}
 querySelector(selector){if(selector==='[data-busy="true"]')return this.descendants().find(n=>n.dataset.busy==='true')||null;if(selector==='button')return this.querySelectorAll('button')[0]||this.slot(selector,'button');if(selector==='[data-form-cancel]')return this.querySelectorAll(selector)[0]||this.slot(selector,'button');if(selector==='button[type=submit]'||selector==='button[type="submit"]')return this.querySelectorAll('button').find(n=>n.type==='submit')||this.slot(selector,'button');if(selector==='[data-search-more]')return this.querySelectorAll(selector)[0]||null;return this.slot(selector);}
 slot(selector,tag='div'){if(!this.slots.has(selector)){const el=new Element(tag);this.slots.set(selector,el);this.append(el);}return this.slots.get(selector);}
 contains(target){return target===this||this.descendants().includes(target);}
}
class FormDataDouble{constructor(form){this.values=form.fixtureEntries||[];}*[Symbol.iterator](){yield* this.values;}getAll(name){return this.values.filter(([key])=>key===name).map(([,value])=>value);}}

function controllerFixture(){
 const root=new Element();root.hidden=true;const doc=new Events();doc.documentElement=new Element();doc.getElementById=id=>id==='estateStage'?root:null;doc.createElement=tag=>new Element(tag);doc.querySelector=()=>null;doc.activeElement=new Element();
 const win=new Events();let app,actor='',uid='owner-a',onIdentity,handler=async()=>({rows:[]}),confirms=0;const googleRequests=[];
 win.AiderDearFirebase={getFirebaseIdToken:async()=> 'fake-test-token'};
 const fakeFetch=async(url,options)=>{const action=new URL(url,'https://example.test').searchParams.get('action');googleRequests.push({action,payload:JSON.parse(options.body)});return {ok:true,json:async()=>action==='status'?{google:{connected:true,writeEnabled:true}}:action==='calendars'?{selectedCalendarIds:['owned-calendar'],calendars:[{id:'owned-calendar',accessRole:'owner',summary:'본인 캘린더'}]}:{ok:true}};};
 const api={identity(){if(actor!==uid){actor=uid;onIdentity(actor);}return actor;},call:(action,payload)=>handler(action,payload)};
 const context=vm.createContext({window:win,document:doc,location:{search:'',href:'https://example.test/'},URL,URLSearchParams,crypto:webcrypto,AbortController,CustomEvent:class{constructor(type){this.type=type;}},MutationObserver:class{observe(){}},FormData:FormDataDouble,Node:Element,fetch:fakeFetch,confirm:()=>{confirms++;return true;},createEstateClient:fn=>{onIdentity=fn;return api;},installDirectory:value=>{app=value;},installWorkflow:value=>value.registerView('today',async()=>{}),calendarRows,matchProperty:()=>({criteria:[],score:null,eligible:true}),estateLabels:{},console});
 vm.runInContext(stripImports(controller),context,{filename:'estate-v171.js'});
 return {app,api,root,win,doc,googleRequests,get confirms(){return confirms;},setUid:value=>uid=value,setHandler:fn=>handler=fn};
}
function calendarFixture({native=false}={}){
 const win=new Events();if(native)win.AiderLogNative={};const appNode=new Element();appNode.dataset.activeTab='schedule';
 const doc=new Events();doc.visibilityState='hidden';doc.documentElement=new Element();doc.getElementById=id=>id==='app'?appNode:null;
 let actor='',uid='owner-a',onIdentity,handler=async()=>({rows:[],cursor:null}),calls=[];
 win.AiderDearFirebase={getState:()=>({user:uid?{uid,email:uid+'@example.test'}:null})};
 const api={identity(){if(actor!==uid){actor=uid;onIdentity(actor);}return actor;},call:async(action,payload)=>{calls.push({action,payload});return handler(action,payload);}};
 const context=vm.createContext({window:win,document:doc,location:{search:''},URLSearchParams,CustomEvent:class{constructor(type){this.type=type;}},MutationObserver:class{observe(){}},createEstateClient:fn=>{onIdentity=fn;return api;},console});
 vm.runInContext(stripImports(calendar),context,{filename:'estate-calendar-v171.js'});
 return {calendar:win.AiderEstateCalendarV171,win,doc,appNode,api,calls,setUid:value=>uid=value,setHandler:fn=>handler=fn,show:()=>doc.visibilityState='visible'};
}
test('site assets mount ESTATE separately and route projection clicks to source records',()=>{
 assert.match(index,/id="estateStage"/);
 assert.match(index,/type="module" src="\.\/estate-v171\.js\?v=171"/);
 assert.match(index,/type="module" src="\.\/estate-calendar-v171\.js\?v=171"/);
 const display=index.slice(index.indexOf('function calendarDisplayEvents('),index.indexOf('\n',index.indexOf('function calendarDisplayEvents(')));
 assert.match(display,/AiderEstateCalendarV171\?\.rows/);
 const open=index.slice(index.indexOf('function openEvent(e)'),index.indexOf('function openEvent(e)')+450);
 assert(open.indexOf("projectionSource==='estate'")<open.indexOf('canEditEvent'));
 assert.match(open,/AiderEstateV171\?\.open\(e.sourceKind,e.sourceId\);return/);
});
test('projection integration has no personal/pair persistence or direct Firestore',()=>{
 assert.doesNotMatch(calendar,/localStorage\.setItem|indexedDB|\.firestore\(|persist\(|shareWithCouple:true/);
 assert.match(calendar,/readOnly:true/);assert.match(calendar,/shareWithCouple:false/);
});
test('late inactive view completion cannot expose itself over active view',async()=>{
 const f=controllerFixture(),gate=deferred();let oldNode,newNode;
 f.app.registerView('slow',async({container})=>{oldNode=container;await gate.promise;});
 f.app.registerView('fast',async({container})=>newNode=container);
 const pending=f.app.navigate('slow');await f.app.navigate('fast');gate.resolve();await pending;
 assert.equal(oldNode.hidden,true);assert.equal(newNode.hidden,false);
});
test('panel open ignores stale earlier entity response',async()=>{
 const f=controllerFixture(),gate=deferred(),opened=[];
 f.app.registerEntity('properties',async({row})=>opened.push(row.id));
 f.setHandler((action,payload)=>payload.id==='old'?gate.promise:Promise.resolve({row:{id:'new',revision:1}}));
 const pending=f.app.open('properties','old');await f.app.open('properties','new');gate.resolve({row:{id:'old',revision:1}});await pending;
 assert.deepEqual(opened,['new']);
});
test('form prevents duplicate submit and restores preexisting disabled buttons',async()=>{
 const f=controllerFixture(),host=new Element(),gate=deferred();let saves=0;
 const form=f.app.form(host,'<button type="button" disabled>disabled</button>',async()=>{saves++;await gate.promise;});
 const disabled=form.querySelectorAll('button')[0],event={preventDefault(){}};
 const pending=form.onsubmit(event);await form.onsubmit(event);
 assert.equal(saves,1);assert.equal(form.inert,true);assert.equal(form.dataset.busy,'true');gate.resolve();await pending;
 assert.equal(form.inert,false);assert.equal(disabled.disabled,true);assert.equal(form.querySelector('button[type=submit]').disabled,false);
});
test('form failure keeps input and shows inline error',async()=>{
 const f=controllerFixture(),form=f.app.form(new Element(),'input draft',async()=>{throw Error('revision conflict');});
 form.fixtureEntries=[['title','preserved']];await form.onsubmit({preventDefault(){}});
 assert.equal(form.fixtureEntries[0][1],'preserved');assert.equal(form.querySelector('.estate-form-error').textContent,'revision conflict');assert.equal(form.querySelector('.estate-form-error').hidden,false);
});
test('open blocks switching entity while a save is in flight',async()=>{
 const f=controllerFixture(),gate=deferred();let form,otherOpened=0;
 f.app.registerEntity('properties',async({container})=>{form=f.app.form(container,'',async()=>gate.promise);});
 f.app.registerEntity('customers',async()=>otherOpened++);
 await f.app.open('properties');const pending=form.onsubmit({preventDefault(){}});
 await f.app.open('customers');assert.equal(otherOpened,0,'header quick-add must not replace a saving form');
 gate.resolve();await pending;
});
test('identity change clears prior owner search result text and query',async()=>{
 const f=controllerFixture();await f.app.navigate('today');
 f.setHandler(async()=>({results:[{collection:'customers',id:'owner-a-customer',label:'Owner A private customer',subtitle:'010-private-phone'}]}));
 const search=f.root.querySelector('.estate-search'),results=search.querySelector('.estate-search-results');search.elements.q.value='private';
 search.onsubmit({preventDefault(){}});await flush();assert(results.children.length>0);
 f.setUid('owner-b');f.api.identity();
 assert.equal(results.hidden,true);assert.equal(results.children.length,0);assert.equal(search.elements.q.value,'');
});
test('closed busy panel is not discarded',async()=>{
 const f=controllerFixture(),panel=f.root.querySelector('.estate-panel');panel.hidden=false;const busy=new Element('form');busy.dataset.busy='true';panel.append(busy);
 assert.equal(f.app.close(),false);assert.equal(panel.hidden,false);
});
test('auxiliary form does not create editor dirty state',async()=>{
 const f=controllerFixture(),aux=f.app.form(new Element(),'',async()=>{},{trackDirty:false});
 aux.dispatchEvent({type:'input'});await aux.onsubmit({preventDefault(){}});f.app.close();assert.equal(f.confirms,0);
});
test('auxiliary form success does not clear an existing editor draft warning',async()=>{
 const f=controllerFixture(),editor=f.app.form(new Element(),'',async()=>{}),aux=f.app.form(new Element(),'',async()=>{},{trackDirty:false});
 editor.dispatchEvent({type:'input'});aux.dispatchEvent({type:'change'});await aux.onsubmit({preventDefault(){}});f.app.close();assert.equal(f.confirms,1);
});
test('auxiliary cancel removes only itself and preserves editor draft state',()=>{
 const f=controllerFixture(),panel=f.root.querySelector('.estate-panel');panel.hidden=false;
 const editor=f.app.form(panel,'',async()=>{}),aux=f.app.form(panel,'',async()=>{},{trackDirty:false});editor.dispatchEvent({type:'input'});
 aux.querySelector('[data-form-cancel]').onclick();assert.equal(panel.hidden,false);assert(!panel.contains(aux));assert(panel.contains(editor));f.app.close();assert.equal(f.confirms,1);
});
test('default external form cancel still removes its form and confirms its draft',()=>{
 const f=controllerFixture(),host=new Element(),form=f.app.form(host,'',async()=>{});form.dispatchEvent({type:'input'});form.querySelector('[data-form-cancel]').onclick();assert.equal(f.confirms,1);assert(!host.contains(form));
});
async function exportFixture(){
 const f=controllerFixture();f.api.identity();let row={id:'property-export',revision:1,title:'Private property',status:'active',nextCheckDate:'2026-09-08'},editor;
 f.setHandler(async(action,payload)=>{if(action==='save')row={...payload.row,revision:row.revision+1};return {row:{...row}};});
 f.app.registerEntity('properties',async({container})=>editor=f.app.form(container,'',async()=>{}));
 await f.app.open('properties',row.id);
 const panel=f.root.querySelector('.estate-panel'),section=panel.descendants().find(node=>node.className==='estate-google');assert(section);
 const review=async()=>{await section.querySelector('button').onclick();return section.querySelector('div').descendants().find(node=>node.tagName==='FORM');};
 const entries=[['projection','estate:properties:property-export:check'],['calendarId','owned-calendar'],['title','Safe external title'],['memo','Only explicitly entered memo']];
 return {...f,get confirms(){return f.confirms;},panel,section,editor,review,entries,saveDate:async date=>f.app.save('properties',{...row,nextCheckDate:date})};
}
test('Google review and send use latest saved cache row, not initial or unsaved editor dates',async()=>{
 const f=await exportFixture();await f.saveDate('2026-09-15');f.editor.fixtureEntries=[['nextCheckDate','2026-09-30']];f.editor.dispatchEvent({type:'input'});
 const form=await f.review();assert.match(form.innerHTML,/2026-09-15/);assert.doesNotMatch(form.innerHTML,/2026-09-08|2026-09-30/);form.fixtureEntries=f.entries;
 await form.onsubmit({preventDefault(){}});const sent=f.googleRequests.find(request=>request.action==='create');assert(sent);assert.equal(sent.payload.event.date,'2026-09-15');assert.equal(sent.payload.event.title,'Safe external title');assert.equal(sent.payload.shareWithCouple,false);
 f.app.close();assert.equal(f.confirms,1,'Google success must preserve the unrelated editor draft warning');
});
test('Google send rejects changed saved schedule after review instead of sending stale date',async()=>{
 const f=await exportFixture(),form=await f.review();await f.saveDate('2026-09-16');form.fixtureEntries=f.entries;await form.onsubmit({preventDefault(){}});
 assert.equal(f.googleRequests.filter(request=>request.action==='create').length,0);assert.match(form.querySelector('.estate-form-error').textContent,/저장 일정이 변경/);
});
test('Google send rejects a removed saved projection and requires fresh review',async()=>{
 const f=await exportFixture(),form=await f.review();await f.saveDate('');form.fixtureEntries=f.entries;await form.onsubmit({preventDefault(){}});
 assert.equal(f.googleRequests.filter(request=>request.action==='create').length,0);assert.match(form.querySelector('.estate-form-error').textContent,/저장 일정이 변경/);
});
test('successful Google auxiliary form cannot resubmit the same export',async()=>{
 const f=await exportFixture(),form=await f.review();form.fixtureEntries=f.entries;await form.onsubmit({preventDefault(){}});await form.onsubmit({preventDefault(){}});
 assert.equal(f.googleRequests.filter(request=>request.action==='create').length,1);assert.match(form.querySelector('.estate-form-error').textContent,/이미 전송/);
});
test('calendar does not install in native application',()=>{assert.equal(calendarFixture({native:true}).calendar,undefined);});
test('calendar stays idle while page is hidden or unrelated',async()=>{
 const f=calendarFixture();await f.calendar.refresh(true);assert.equal(f.calls.length,0);
 f.show();f.appNode.dataset.activeTab='personal';await f.calendar.refresh(true);assert.equal(f.calls.length,0);
});
test('calendar paginates all ranges, deduplicates IDs and forces private read-only metadata',async()=>{
 const f=calendarFixture();f.show();f.setHandler(async(_,p)=>p.cursor?{rows:[{id:'same',title:'latest',time:'09:00'}],cursor:null}:{rows:[{id:'same',title:'old',time:'',shareWithCouple:true,owner:'shared'}],cursor:'next'});
 await f.calendar.refresh(true);const rows=f.calendar.rows();assert.equal(f.calls.length,2);assert.equal(rows.length,1);assert.equal(rows[0].title,'latest');
 assert.equal(rows[0].projectionSource,'estate');assert.equal(rows[0].calendarScope,'estate');assert.equal(rows[0].owner,'mine');assert.equal(rows[0].authorUid,'owner-a');assert.equal(rows[0].readOnly,true);assert.equal(rows[0].shareWithCouple,false);assert.equal(rows[0].allDay,false);
});
test('calendar rows accessor does not expose the array container',async()=>{
 const f=calendarFixture();f.show();f.setHandler(async()=>({rows:[{id:'one'}]}));await f.calendar.refresh(true);const rows=f.calendar.rows();rows.pop();assert.equal(f.calendar.rows().length,1);
});
test('calendar avoids repeated scans within freshness window',async()=>{
 const f=calendarFixture();f.show();await f.calendar.refresh(true);await f.calendar.refresh();assert.equal(f.calls.length,1);
});
test('calendar refuses repeated cursor and preserves prior complete snapshot',async()=>{
 const f=calendarFixture();f.show();f.setHandler(async()=>({rows:[{id:'valid'}],cursor:null}));await f.calendar.refresh(true);
 f.setHandler(async()=>({rows:[{id:'incomplete'}],cursor:'loop'}));await f.calendar.refresh(true);
 assert.equal(f.calendar.rows()[0].id,'valid');assert.match(f.calendar.status().error,/반복/);
});
test('calendar discards old-owner response after identity switch',async()=>{
 const f=calendarFixture(),gate=deferred();f.show();f.setHandler(()=>gate.promise);
 const pending=f.calendar.refresh(true);f.setUid('owner-b');f.calendar.rows();gate.resolve({rows:[{id:'owner-a-secret'}],cursor:null});await pending;
 assert.equal(f.calendar.rows().length,0);
});
test('calendar signout clears previously loaded owner rows',async()=>{
 const f=calendarFixture();f.show();f.setHandler(async()=>({rows:[{id:'owner-a-row'}],cursor:null}));await f.calendar.refresh(true);
 f.setUid('');assert.equal(f.calendar.rows().length,0);
});
test('save invalidation during pending calendar fetch performs one fresh follow-up scan',async()=>{
 const f=calendarFixture(),gate=deferred();f.show();let count=0;
 f.setHandler(()=>++count===1?gate.promise:Promise.resolve({rows:[{id:'fresh-after-save'}],cursor:null}));
 const pending=f.calendar.refresh(true);f.win.dispatchEvent({type:'aiderlog-estate-updated'});gate.resolve({rows:[{id:'before-save'}],cursor:null});
 await pending;await flush();
 assert.equal(count,2,'forced invalidation must survive existing pending fetch');assert.equal(f.calendar.rows()[0].id,'fresh-after-save');
});
test('several saves coalesce into a single post-request calendar scan',async()=>{
 const f=calendarFixture(),gate=deferred();f.show();let count=0;
 f.setHandler(()=>++count===1?gate.promise:Promise.resolve({rows:[{id:'latest'}],cursor:null}));
 const pending=f.calendar.refresh(true);for(let i=0;i<4;i++)f.win.dispatchEvent({type:'aiderlog-estate-updated'});
 gate.resolve({rows:[{id:'old'}],cursor:null});await pending;await flush();assert.equal(count,2);assert.equal(f.calendar.rows()[0].id,'latest');
});
test('save while a pending calendar view is hidden invalidates its next visible scan',async()=>{
 const f=calendarFixture(),gate=deferred();f.show();let count=0;
 f.setHandler(()=>++count===1?gate.promise:Promise.resolve({rows:[{id:'visible-latest'}],cursor:null}));
 const pending=f.calendar.refresh(true);f.doc.visibilityState='hidden';f.win.dispatchEvent({type:'aiderlog-estate-updated'});
 gate.resolve({rows:[{id:'stale-hidden'}],cursor:null});await pending;await flush();assert.equal(count,1);assert.equal(f.calendar.rows().length,0);assert.equal(f.calendar.status().last,0);
 f.show();f.doc.dispatchEvent({type:'visibilitychange'});await flush();assert.equal(count,2);assert.equal(f.calendar.rows()[0].id,'visible-latest');
});
test('domain projections keep stable source IDs and exclude cancelled automatic work',()=>{
 const rows=calendarRows({tasks:[{id:'manual',title:'contact',date:'2026-09-08',status:'open'},{id:'done',date:'2026-09-08',status:'done'},{id:'auto-deal',date:'2026-09-08',sourceKind:'deals'}],visits:[{id:'visit',date:'2026-09-09',status:'scheduled'}],deals:[{id:'deal',title:'Deal',stage:'contract',contractDate:'2026-09-10'}]});
 assert.deepEqual(rows.map(r=>r.id),['estate:tasks:manual:due','estate:visits:visit:visit','estate:deals:deal:contractDate']);assert(rows.every(r=>r.readOnly&&r.category==='estate'));
});
const downloadSources=['estate-directory-v171.js','estate-workflow-v171.js'];
function downloadHelper(source){const start=source.indexOf('function createDownloadShelf('),end=source.indexOf('\nexport function install',start);assert(start>=0&&end>start);return source.slice(start,end);}
function downloadFixture(filename,{automaticClickThrows=false}={}){
 const host=new Element(),win=new Events(),abort=new AbortController(),created=[],revoked=[],clicks=[],notices=[];host.isConnected=true;
 let uid='download-owner',calls=0,handler=async()=>({blob:{contents:'verified bytes'},name:'테스트 문서.txt'}),timers=0;
 const doc={createElement(tag){const node=new Element(tag);node.click=()=>{const event={type:'click',preventDefault(){this.defaultPrevented=true;}};node.dispatchEvent(event);if(!event.defaultPrevented){assert(host.contains(node),'automatic click must use a connected link');clicks.push(node);if(automaticClickThrows)throw Error('automatic download blocked');}};return node;}};
 const app={uid:()=>uid,notice:(...args)=>notices.push(args),api:{download:async id=>{calls++;return handler(id);}}};
 const context=vm.createContext({window:win,document:doc,URL:{createObjectURL:()=>{const url='blob:test-'+(created.length+1);created.push(url);return url;},revokeObjectURL:url=>revoked.push(url)},setTimeout:()=>timers++,console});
 vm.runInContext(downloadHelper(read(filename))+'\nglobalThis.createShelf=createDownloadShelf;',context);
 const shelf=context.createShelf(app,host,abort.signal,'test-download-ready');
 return {shelf,host,win,abort,created,revoked,clicks,notices,get calls(){return calls;},get timers(){return timers;},setUid:value=>uid=value,setHandler:fn=>handler=fn};
}
test('both attachment handlers use the same tested stable-link lifecycle',()=>{
 const [directory,workflow]=downloadSources.map(read);assert.equal(downloadHelper(directory),downloadHelper(workflow));
 assert.match(directory,/await downloads\.prepare\(button\.dataset\.documentDownload\)/);assert.match(workflow,/await downloads\.prepare\(b\.dataset\.estateDownload\)/);
 assert.doesNotMatch(downloadHelper(directory),/setTimeout/);
});
for(const filename of downloadSources){
 test(filename+': prepared link stays visible and repeated prepare reuses one URL',async()=>{
  const f=downloadFixture(filename),first=await f.shelf.prepare('media-one'),again=await f.shelf.prepare('media-one');
  assert.equal(f.calls,1);assert.equal(f.created.length,1);assert.equal(f.host.children.length,1);assert.equal(first,again);assert.equal(first.link.download,'테스트 문서.txt');assert.match(first.link.textContent,/파일 저장/);assert.equal(first.link.href,f.created[0]);assert.equal(f.clicks.length,2);assert.equal(f.timers,0);assert.equal(f.revoked.length,0);
 });
 test(filename+': abort revokes links and forbids later reuse',async()=>{
  const f=downloadFixture(filename);await f.shelf.prepare('one');f.abort.abort();assert.deepEqual(f.revoked,f.created);assert.equal(f.host.children.length,0);await assert.rejects(f.shelf.prepare('one'),/화면 또는 로그인/);
 });
 test(filename+': identity event revokes previously prepared owner links',async()=>{
  const f=downloadFixture(filename);await f.shelf.prepare('one');f.setUid('different-owner');f.win.dispatchEvent({type:'aiderdear-firebase-state'});assert.deepEqual(f.revoked,f.created);assert.equal(f.host.children.length,0);
 });
 test(filename+': late old-owner download never creates a blob URL',async()=>{
  const f=downloadFixture(filename),gate=deferred();f.setHandler(()=>gate.promise);const pending=f.shelf.prepare('one');f.setUid('different-owner');gate.resolve({blob:{},name:'secret.txt'});await assert.rejects(pending,/화면 또는 로그인/);assert.equal(f.created.length,0);assert.equal(f.host.children.length,0);
 });
 test(filename+': removal during preparation cannot resurrect a removed attachment',async()=>{
  const f=downloadFixture(filename),gate=deferred();f.setHandler(()=>gate.promise);const pending=f.shelf.prepare('one');f.shelf.remove('one');gate.resolve({blob:{},name:'removed.txt'});await pending;assert.equal(f.created.length,0);assert.equal(f.host.children.length,0);
  f.setHandler(async()=>({blob:{},name:'retry.txt'}));await f.shelf.prepare('one');assert.equal(f.created.length,1);
 });
 test(filename+': concurrent prepares coalesce into one stable link',async()=>{
  const f=downloadFixture(filename),gate=deferred();f.setHandler(()=>gate.promise);const first=f.shelf.prepare('one'),second=f.shelf.prepare('one');gate.resolve({blob:{},name:'once.txt'});await Promise.all([first,second]);assert.equal(f.calls,1);assert.equal(f.host.children.length,1);assert.equal(f.created.length,1);
 });
 test(filename+': blocked automatic click leaves the direct save fallback usable',async()=>{
  const f=downloadFixture(filename,{automaticClickThrows:true}),item=await f.shelf.prepare('one');assert(f.host.contains(item.link));assert.equal(item.link.download,'테스트 문서.txt');assert.equal(f.revoked.length,0);assert.match(f.notices.at(-1)[0],/파일 준비 완료/);
 });
 test(filename+': removing one prepared attachment preserves other ready links',async()=>{
  const f=downloadFixture(filename),first=await f.shelf.prepare('one'),second=await f.shelf.prepare('two');f.shelf.remove('one');assert.deepEqual(f.revoked,[first.url]);assert.equal(f.host.children.length,1);assert(f.host.contains(second.link));f.shelf.dispose();assert.deepEqual(f.revoked,f.created);
 });
 test(filename+': response after panel abort cannot create a late save link',async()=>{
  const f=downloadFixture(filename),gate=deferred();f.setHandler(()=>gate.promise);const pending=f.shelf.prepare('one');f.abort.abort();gate.resolve({blob:{},name:'late.txt'});await assert.rejects(pending,/화면 또는 로그인/);assert.equal(f.created.length,0);
 });
}
