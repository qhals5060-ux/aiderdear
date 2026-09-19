import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const source=await readFile(new URL('../friend-schedule-ui-v175.js',import.meta.url),'utf8');
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no});return{promise,resolve,reject}};
const settle=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
class Node{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners=new Map();this.attributes={};this.dataset={};this.hidden=false;this.disabled=false;this.checked=false;this.value='';this.text='';this.id='';}
  get textContent(){return this.text+this.children.map(node=>node.textContent).join('');}set textContent(value){this.text=String(value);this.replaceChildren();}
  get isConnected(){return this.tagName==='BODY'||!!this.parentNode?.isConnected;}
  appendChild(node){node.remove();node.parentNode=this;this.children.push(node);return node;}append(...nodes){nodes.forEach(node=>this.appendChild(node));}
  replaceChildren(...nodes){this.children.forEach(node=>{node.parentNode=null});this.children=[];this.append(...nodes);}
  remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(node=>node!==this);this.parentNode=null;}
  after(node){const parent=this.parentNode,index=parent.children.indexOf(this);node.remove();node.parentNode=parent;parent.children.splice(index+1,0,node);}
  setAttribute(name,value){this.attributes[name]=String(value);}
  querySelectorAll(selector){const rows=[];const walk=node=>node.children.forEach(child=>{rows.push(child);walk(child)});walk(this);return rows.filter(node=>selector==='input'?node.tagName==='INPUT':selector==='input:checked'?node.tagName==='INPUT'&&node.checked:selector.startsWith('#')?node.id===selector.slice(1):selector==='[role="status"]'?node.attributes.role==='status':false);}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  addEventListener(name,fn){this.listeners.set(name,fn);}emit(name){return this.listeners.get(name)?.({target:this,currentTarget:this});}
}
const event={id:'e1',title:'개인 일정',isAiderDear:true,authorEmail:'owner@example.test'};
function fixture({guest=false,noFriends=false,native=false,compactSite=false}={}){
  let state={user:guest?null:{uid:'u1',email:'owner@example.test'},friends:noFriends?[]:[{uid:'u2',friendshipId:'f1',name:'친구 A'},{uid:'u3',friendshipId:'f2',name:'친구 B'}]},clock=1000000,reader=async()=>({events:[],ownTargetsByEventId:{}}),targetReader=async()=>[],shareWriter=async()=>({}),removeWriter=async()=>({});
  const body=new Node('body'),owner=body.appendChild(new Node()),google=body.appendChild(new Node('select')),header=body.appendChild(new Node()),dates=[new Node(),new Node()];owner.id='eventOwnerField';google.id='eventGoogleCalendar';dates[0].dataset.date='2026-09-01';dates[1].dataset.date='2026-10-12';const reads=[],targets=[],shares=[],removes=[],dispatched=[],warnings=[],events=new Map();
  const toggle=native||compactSite?owner.appendChild(new Node('input')):null;if(compactSite)toggle.id='eventShareFriends';
  const document={createElement:tag=>new Node(tag),createTextNode:text=>{const node=new Node('#text');node.text=text;return node},getElementById:id=>body.querySelector('#'+id),querySelector:selector=>selector==='#page0 .month-list-head'?header:native&&selector==='.schedule-dialog-v125 [data-app-friend-slot-v179]'?owner:native&&selector==='.schedule-dialog-v125 [name="shareWithFriends"]'?toggle:null,querySelectorAll:selector=>selector==='#calendar .day[data-date]'&&!native||selector==='#home [data-schedule-date-v125][data-date]'&&native?dates:[]};
  const api={getState:()=>state,readFriendSchedule:async range=>{reads.push(range);return reader(range)},friendScheduleTargets:async id=>{targets.push(id);return targetReader(id)},setFriendScheduleTargets:async(row,selected)=>{shares.push({row,selected:[...selected]});return shareWriter(row,selected)},removeFriendSchedule:async id=>{removes.push(id);return removeWriter(id)}};
  const window={AiderDearFirebase:api,dispatchEvent:e=>dispatched.push(e.type)};class DateDouble extends Date{static now(){return clock}}
  vm.runInNewContext(source,{window,document,Date:DateDouble,Event:class{constructor(type){this.type=type}},console:{warn:(...args)=>warnings.push(args)},addEventListener:(type,fn)=>events.set(type,fn)});
  return{ui:window.AiderFriendScheduleUIV175,body,owner,toggle,google,header,reads,targets,shares,removes,warnings,dispatched,events,get state(){return state},set state(value){state=value},set read(fn){reader=fn},set targetRead(fn){targetReader=fn},set write(fn){shareWriter=fn},set removeWrite(fn){removeWriter=fn},tick:ms=>clock+=ms,box:()=>document.getElementById(native?'appEventFriendShareV179':'eventFriendShareV175'),status:()=>document.getElementById('friendScheduleStatusV175')};
}
test('guest/no accepted friends have no sharing UI, reads, writes or default recipients',async()=>{
  for(const options of [{guest:true},{noFriends:true}]){const f=fixture(options);await settle();await f.ui.open();assert(f.box().hidden);assert.equal(f.reads.length,0);assert.deepEqual(Array.from(f.ui.selected()),[]);}
  const f=fixture();await settle();await f.ui.open();assert(!f.box().hidden);assert.equal(f.box().querySelectorAll('input:checked').length,0);assert.equal(f.targets.length,0);
});
test('received couple/friend, imported and business rows never show selectable friend fields',async()=>{
  const f=fixture();await settle();for(const extra of [{authorEmail:'partner@example.test'},{authorUid:'u2'},{readOnly:true},{externalSource:'google'},{projectionSource:'work-task'},{calendarScope:'estate'},{category:'consulting'},{friendShared:true},{isAiderDear:false}]){await f.ui.open({...event,...extra});assert(f.box().hidden,JSON.stringify(extra));}
  assert.equal(f.targets.length,0);assert.equal(f.shares.length,0);await assert.rejects(f.ui.share({...event,authorEmail:'partner@example.test'}),/내가 직접/);
});
test('existing selection loads before enabling inputs; explicit selected IDs only are saved',async()=>{
  const f=fixture();await settle();const gate=deferred();f.targetRead=()=>gate.promise;const pending=f.ui.open(event);await settle();assert(f.box().querySelectorAll('input').every(node=>node.disabled));assert.equal(f.ui.selectionReady(),false);gate.resolve(['f2']);await pending;assert(f.box().querySelectorAll('input').every(node=>!node.disabled));assert.deepEqual(Array.from(f.ui.selected()),['f2']);await f.ui.share(event);assert.deepEqual(f.shares[0].selected,['f2']);
});
test('selection read failure cannot silently revoke existing recipients',async()=>{
  const f=fixture();await settle();f.targetRead=async()=>{throw Error('offline')};await f.ui.open(event);assert.equal(f.ui.selectionReady(),false);assert.match(f.box().textContent,/기존 공유는 변경하지 않습니다/);await assert.rejects(f.ui.share(event),/공유 대상을 확인/);assert.equal(f.shares.length,0);
});
test('stale prior form recipient response cannot change a newer open form',async()=>{
  const f=fixture();await settle();const old=deferred();f.targetRead=id=>id==='e1'?old.promise:Promise.resolve(['f1']);const pending=f.ui.open(event);await settle();await f.ui.open({...event,id:'e2'});old.resolve(['f2']);await pending;assert.deepEqual(Array.from(f.ui.selected()),['f1']);
});
test('read response after signout/account switch cannot restore received private schedule titles',async()=>{
  const f=fixture();await settle();const gate=deferred();f.read=()=>gate.promise;const pending=f.ui.refresh(true);await settle();f.state={user:null,friends:[]};f.events.get('aiderdear-firebase-state')();gate.resolve({events:[{title:'private old account'}],ownTargetsByEventId:{}});await pending;assert.equal(f.ui.events().length,0);assert(f.box().hidden);assert(f.status().hidden);
});
test('read failures keep last good events and show a non-identifying status message',async()=>{
  const f=fixture();await settle();f.read=async()=>({events:[{id:'safe',title:'saved title'}],ownTargetsByEventId:{}});await f.ui.refresh(true);f.read=async()=>{throw Error('unsafe internal error body')};await f.ui.refresh(true);assert.equal(f.ui.events()[0].id,'safe');assert(!f.status().hidden);assert.match(f.status().textContent,/조회.*완료하지/);assert(!f.status().textContent.includes('unsafe'));assert(!JSON.stringify(f.warnings).includes('unsafe'));
});
test('quota failure honors retryAfterMs and blocks refresh storms without losing visible events',async()=>{
  const f=fixture();await settle();f.read=async()=>{throw Object.assign(Error('quota'),{code:'resource-exhausted',retryAfterMs:420000})};await f.ui.refresh(true);const count=f.reads.length;f.tick(300001);await f.ui.refresh(true);assert.equal(f.reads.length,count);f.tick(120000);await f.ui.refresh(true);assert.equal(f.reads.length,count+1);assert.match(f.status().textContent,/한도/);
});
test('opening a dialog during quota cooldown makes no recipient reads and does not extend cooldown',async()=>{
  const f=fixture();await settle();f.read=async()=>{throw Object.assign(Error('quota'),{code:'resource-exhausted',retryAfterMs:300000})};await f.ui.refresh(true);const count=f.reads.length;f.tick(240000);await f.ui.open(event);assert.equal(f.targets.length,0);f.tick(60001);await f.ui.refresh(true);assert.equal(f.reads.length,count+1);
});
test('Google export target disables and clears friend selection; clearing target reenables',async()=>{
  const f=fixture();await settle();await f.ui.open();f.box().querySelectorAll('input')[0].checked=true;f.google.value='google-calendar';f.google.emit('change');assert.equal(f.ui.selected().length,0);assert(f.box().querySelectorAll('input').every(node=>node.disabled));f.google.value='';f.google.emit('change');assert(f.box().querySelectorAll('input').every(node=>!node.disabled));
});
test('read deduplication avoids render feedback loops and view accessor returns a copy',async()=>{
  const f=fixture();await settle();const count=f.reads.length;for(let i=0;i<10;i++)await f.ui.refresh();assert.equal(f.reads.length,count);const gate=deferred();f.read=()=>gate.promise;const pending=[f.ui.refresh(true),f.ui.refresh(true)];await settle();assert.equal(f.reads.length,count+1);gate.resolve({events:[{id:'e'}],ownTargetsByEventId:{}});await Promise.all(pending);const rows=f.ui.events();rows.length=0;assert.equal(f.ui.events().length,1);
});
test('remove invokes revocation API; failed revoke is propagated instead of claiming deletion',async()=>{
  const f=fixture();await settle();f.removeWrite=async()=>{throw Error('offline')};await assert.rejects(f.ui.remove('e1'),/offline/);assert.deepEqual(f.removes,['e1']);
});

test('app uses its visible month and explicit friend recipients through the same safe adapter',async()=>{
  const f=fixture({native:true});await settle();assert.equal(f.reads[0].from,'2026-09-01');await f.ui.open();assert.equal(f.box().id,'appEventFriendShareV179');assert.equal(f.ui.selected().length,0);assert(f.box().hidden);f.toggle.checked=true;f.toggle.emit('change');assert(!f.box().hidden);f.box().querySelectorAll('input')[1].checked=true;await f.ui.share({...event,authorUid:'u1'});assert.deepEqual(f.shares[0].selected,['f2']);
});

test('app friend mode restores saved recipients before allowing an unrelated edit to be saved',async()=>{
  const f=fixture({native:true});await settle();const gate=deferred();f.targetRead=()=>gate.promise;const pending=f.ui.open(event);await settle();assert(f.toggle.disabled);assert(f.box().hidden);await assert.rejects(f.ui.share(event),/공유 대상을 확인/);assert.equal(f.shares.length,0);
  gate.resolve(['f2']);await pending;assert(f.toggle.checked);assert(!f.toggle.disabled);assert(!f.box().hidden);assert.deepEqual(Array.from(f.ui.selected()),['f2']);await f.ui.share({...event,title:'이름만 수정'});assert.deepEqual(f.shares[0].selected,['f2']);
});

test('app explicitly unchecking Friends clears recipients and persists revocation despite collapsed list',async()=>{
  const f=fixture({native:true});await settle();f.targetRead=async()=>['f1','f2'];await f.ui.open(event);f.toggle.checked=false;f.toggle.emit('change');assert(f.box().hidden);assert.equal(f.box().querySelectorAll('input:checked').length,0);assert.equal(f.ui.selected().length,0);await f.ui.share(event);assert.deepEqual(f.shares[0].selected,[]);
  f.toggle.checked=true;f.toggle.emit('change');assert(!f.box().hidden);assert.equal(f.ui.selected().length,0);assert(f.box().querySelectorAll('input').every(node=>!node.disabled));
});

test('app failed recipient lookup never permits an unchecked default to erase existing shares',async()=>{
  const f=fixture({native:true});await settle();f.targetRead=async()=>{throw Error('offline')};await f.ui.open(event);assert(f.toggle.disabled);assert(!f.box().hidden);assert.match(f.box().textContent,/기존 공유는 변경하지 않습니다/);await assert.rejects(f.ui.share(event),/공유 대상을 확인/);assert.equal(f.shares.length,0);
});

test('app read-only, guest and friendless forms cannot select or mutate recipient mode',async()=>{
  for(const options of [{guest:true},{noFriends:true}]){const f=fixture({native:true,...options});await settle();await f.ui.open();assert(f.toggle.disabled);assert(!f.toggle.checked);assert(f.box().hidden);assert.equal(f.ui.selected().length,0);}
  const f=fixture({native:true});await settle();for(const extra of [{friendShared:true},{authorUid:'u2'},{readOnly:true},{calendarScope:'estate'}]){await f.ui.open({...event,...extra});assert(f.toggle.disabled);assert(!f.toggle.checked);assert(f.box().hidden);}assert.equal(f.targets.length,0);assert.equal(f.shares.length,0);
});

test('app stale target load after opening another schedule cannot restore its friend checkbox',async()=>{
  const f=fixture({native:true});await settle();const old=deferred();f.targetRead=id=>id==='e1'?old.promise:Promise.resolve([]);const pending=f.ui.open(event);await settle();await f.ui.open({...event,id:'e2'});old.resolve(['f2']);await pending;assert(!f.toggle.checked);assert(f.box().hidden);assert.equal(f.ui.selected().length,0);
});

test('v182 site compact Friends restores and explicitly revokes saved recipients without changing sharing APIs',async()=>{
  const f=fixture({compactSite:true});await settle();f.targetRead=async()=>['f2'];await f.ui.open(event);assert(f.toggle.checked);assert(!f.box().hidden);assert.match(f.box().textContent,/공유할 친구/);
  await f.ui.share({...event,title:'다른 필드 수정'});assert.deepEqual(f.shares[0].selected,['f2']);
  f.toggle.checked=false;f.toggle.emit('change');assert(f.box().hidden);assert.equal(f.ui.selected().length,0);await f.ui.share(event);assert.deepEqual(f.shares[1].selected,[]);
  f.toggle.checked=true;f.toggle.emit('change');assert(!f.box().hidden);f.box().querySelectorAll('input')[0].checked=true;await f.ui.share(event);assert.deepEqual(f.shares[2].selected,['f1']);
});

test('v182 site compact Friends never bypasses readonly, failed lookup, stale identity or Google destination guards',async()=>{
  const f=fixture({compactSite:true});await settle();f.targetRead=async()=>['f1'];await f.ui.open(event);f.google.value='google-calendar';f.google.emit('change');assert(f.toggle.disabled);assert(!f.toggle.checked);assert(f.box().hidden);assert.equal(f.ui.selected().length,0);f.google.value='';f.google.emit('change');assert(!f.toggle.disabled);assert(f.box().hidden);
  for(const extra of [{friendShared:true},{readOnly:true},{projectionSource:'work'},{authorUid:'u2'}]){await f.ui.open({...event,...extra});assert(f.toggle.disabled);assert(f.box().hidden);}
  f.targetRead=async()=>{throw Error('offline')};await f.ui.open(event);assert(f.toggle.disabled);await assert.rejects(f.ui.share(event),/공유 대상을 확인/);assert.equal(f.shares.length,0);
  f.state={user:null,friends:[]};f.events.get('aiderdear-firebase-state')();assert(f.toggle.disabled);assert(!f.toggle.checked);assert(f.box().hidden);
});
