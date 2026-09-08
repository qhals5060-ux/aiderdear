// Executes the actual index.html D-day controller with a minimal DOM/transport double.
// No production APIs, account data, browser storage, or calendar tokens are used.
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const index=await readFile(new URL('../index.html',import.meta.url),'utf8');
const begin=index.indexOf('  // D-day is independent of the whole EVENT payload.');
const end=index.indexOf('  // 24-hour photo / video stories',begin);
assert(begin>=0&&end>begin,'actual D-day controller boundaries must remain discoverable');
const source=index.slice(begin,end);
const plain=value=>JSON.parse(JSON.stringify(value));
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};};
const settle=async()=>{for(let turn=0;turn<12;turn++)await Promise.resolve();};
const item=(id='one',scope='user:owner-a',overrides={})=>({id,sourceScope:scope,title:'저장한 기념일',date:'2026-09-12',mode:'countdown',...overrides});
const result=(items=[item()],activeId=items[0]?.id||'',activeScope=items[0]?.sourceScope||'')=>({items,activeId,activeScope});

class El {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.value='';this.disabled=false;this.hidden=false;this.children=[];this.listeners=new Map();this.attributes=new Map();this._text='';this._html='';this.className='';this.fields=[];}
  set textContent(value){this._text=String(value);this._html='';this.children=[];}
  get textContent(){return this._text+this.children.map(child=>child.textContent).join('');}
  set innerHTML(value){this._html=String(value);this._text='';this.children=[];}
  get innerHTML(){return this._html;}
  append(...children){this.children.push(...children);}
  appendChild(child){this.append(child);return child;}
  addEventListener(type,fn){const handlers=this.listeners.get(type)||[];handlers.push(fn);this.listeners.set(type,handlers);}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  querySelectorAll(selector){return selector==='input,select,button'?this.fields:[];}
  async fire(type,extra={}){for(const fn of this.listeners.get(type)||[])await fn({type,target:this,preventDefault(){},...extra});}
  click(){if(this.disabled)return Promise.resolve();return this.fire('click');}
}

function harness({uid='owner-a',pair='',now='2026-09-08T18:00:00.000Z',read,mutate}={}){
  let clock=Date.parse(now),uuid=0;
  const ids=['dday','ddayMeta','ddayStatus','ddayRetry','ddayForm','ddayTitle','ddayDate','ddayMode','ddayList','ddayManageBtn'];
  const nodes=new Map(ids.map(id=>[id,new El(id==='ddayForm'?'form':'div')]));
  const form=nodes.get('ddayForm');form.fields=['ddayTitle','ddayDate','ddayMode'].map(id=>nodes.get(id));form.fields.push(new El('button'));nodes.get('ddayMode').value='countdown';
  const events=new El(),document=new El(),calls=[],warnings=[],messages=[],modals=[],timers=[];
  document.createElement=tag=>new El(tag);document.visibilityState='visible';
  const api={readDdayData:async()=>{calls.push({kind:'read'});return read?read():result([]);},mutateDday:async action=>{calls.push({kind:'mutate',action:plain(action)});return mutate?mutate(action):result([action.item?{...action.item,sourceScope:'user:'+uid}:item()]);}};
  const window={AiderDearFirebase:api,addEventListener:events.addEventListener.bind(events)};
  class Clock extends Date {constructor(...args){super(...(args.length?args:[clock]));}static now(){return clock;}}
  const context=vm.createContext({window,document,Date:Clock,Promise,setInterval:(fn,ms)=>{timers.push({fn,ms});return timers.length;},crypto:{randomUUID:()=>`00000000-0000-4000-8000-${String(++uuid).padStart(12,'0')}`},
    currentUser:uid?{uid}:null,firebaseState:{user:uid?{uid}:null,pair:pair?{id:pair}:null},cloudData:{ddays:[],activeDdayBySpace:{}},
    $:selector=>nodes.get(selector.replace(/^#/,''))||null,escapeHtml:value=>String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])),
    console:{warn:(...args)=>warnings.push(args)},toast:message=>messages.push(message),openModal:id=>modals.push(id),requireLogin:()=>calls.push({kind:'login'}),confirm:()=>true});
  vm.runInContext(source+`\nglobalThis.controller={refreshDdayData,changeDday,resetDdayView,setDday,renderDdayList,ddayText,refreshDdayOnReturn,getDdays,ensureDdayIdentity,snapshot:()=>({view:ddayView,pending:ddayPendingAdd,loadPending:!!ddayLoadPromise})};`,context);
  context.controller.resetDdayView();
  return {context,api,window,document,events,nodes,calls,warnings,messages,modals,timers,controller:context.controller,
    get snapshot(){return plain(context.controller.snapshot());},node:id=>nodes.get(id),
    identity(nextUid,nextPair='',reset=true){context.currentUser=nextUid?{uid:nextUid}:null;context.firebaseState={user:nextUid?{uid:nextUid}:null,pair:nextPair?{id:nextPair}:null};if(reset)context.controller.resetDdayView();},
    time(value){clock=Date.parse(value);},draft(title='새 디데이',date='2026-09-15',mode='countdown'){nodes.get('ddayTitle').value=title;nodes.get('ddayDate').value=date;nodes.get('ddayMode').value=mode;},
    submit:()=>form.fire('submit')};
}

test('read rejection and malformed reads retain the prior representative and never write an empty payload',async()=>{
  const h=harness({read:()=>result()});await h.controller.refreshDdayData();const before=[h.node('dday').textContent,h.node('ddayMeta').textContent];
  h.api.readDdayData=async()=>{throw Error('offline');};await h.controller.refreshDdayData();
  assert.deepEqual([h.node('dday').textContent,h.node('ddayMeta').textContent],before);assert.deepEqual(h.snapshot.view.data.items,[item()]);assert.match(h.node('ddayStatus').textContent,/기존 기록은 변경하지 않았습니다/);assert.equal(h.node('ddayRetry').hidden,false);
  h.api.readDdayData=async()=>({items:null});await h.node('ddayRetry').click();assert.deepEqual(h.snapshot.view.data.items,[item()]);assert.equal(h.calls.filter(call=>call.kind==='mutate').length,0);
});

test('one slow load per identity keeps the existing display and survives shared cloud resets',async()=>{
  const h=harness({read:()=>result([item('first'),item('selected')],'selected','user:owner-a')});await h.controller.refreshDdayData();const before=h.node('ddayMeta').textContent;
  const pending=deferred();let reads=0;h.api.readDdayData=()=>{reads++;return pending.promise;};const first=h.controller.refreshDdayData(),second=h.controller.refreshDdayData();
  await settle();
  assert.equal(reads,1);assert.equal(h.snapshot.view.loading,true);assert.equal(h.node('ddayMeta').textContent,before);
  h.context.cloudData={ddays:[],activeDdayBySpace:{},records:[]};h.controller.setDday();h.controller.renderDdayList();assert.equal(h.node('ddayMeta').textContent,before);assert.equal(h.snapshot.view.data.activeId,'selected');
  pending.resolve(result([item('first'),item('selected')],'selected','user:owner-a'));await Promise.all([first,second]);assert.equal(h.snapshot.loadPending,false);assert.equal(h.snapshot.view.data.activeId,'selected');
});

test('logout, different users and pair changes discard delayed read responses',async()=>{
  for(const [nextUid,nextPair] of [['',''],['owner-b',''],['owner-a','pair-new']]){
    const pending=deferred(),h=harness({read:()=>pending.promise});const read=h.controller.refreshDdayData();h.identity(nextUid,nextPair);pending.resolve(result());await read;
    assert.equal(h.snapshot.view.data,null);assert.equal(h.node('ddayMeta').textContent,'');assert.equal(h.node('dday').textContent,'D-DAY');assert(!h.node('ddayList').innerHTML.includes('저장한 기념일'));
  }
});

test('old identity cleanup cannot clear the new identity in-flight read promise',async()=>{
  const a=deferred(),b=deferred(),h=harness({read:()=>a.promise});const old=h.controller.refreshDdayData();await settle();h.identity('owner-b');h.api.readDdayData=()=>b.promise;const next=h.controller.refreshDdayData();
  a.resolve(result());await old;assert.equal(h.snapshot.view.loading,true);assert.equal(h.snapshot.loadPending,true);assert.equal(h.snapshot.view.data,null);
  b.resolve(result([item('b','user:owner-b')]));await next;assert.equal(h.snapshot.view.data.activeId,'b');assert.equal(h.snapshot.view.data.activeScope,'user:owner-b');
});

test('same UID after logout still rejects the previous session response by view identity',async()=>{
  const pending=deferred(),h=harness({read:()=>pending.promise});const old=h.controller.refreshDdayData();await settle();h.identity('');h.identity('owner-a');h.api.readDdayData=async()=>result([item('new-session')]);await h.controller.refreshDdayData();
  pending.resolve(result([item('stale-session')]));await old;assert.equal(h.snapshot.view.data.activeId,'new-session');
});

test('synchronous missing-API and throwing-API failures remain retryable',async()=>{
  const h=harness();delete h.api.readDdayData;await h.controller.refreshDdayData();assert.equal(h.snapshot.loadPending,false,'synchronous failure must not leave a completed promise cached');
  h.api.readDdayData=()=>{throw Error('sync failure');};await h.controller.refreshDdayData();assert.equal(h.snapshot.loadPending,false);
  h.api.readDdayData=async()=>result();await h.controller.refreshDdayData();assert.equal(h.snapshot.view.data.activeId,'one');assert.equal(h.snapshot.view.error,'');
});

test('failed add preserves every input and retries the exact same ID without duplicate submission',async()=>{
  const pending=deferred(),h=harness({mutate:()=>pending.promise});h.draft('저장 실패에도 유지','2026-09-18','since');
  const first=h.submit();await h.submit();assert.equal(h.calls.filter(call=>call.kind==='mutate').length,1);assert.equal(h.snapshot.view.busy,true);assert(formControlsDisabled(h));
  const action=h.calls.find(call=>call.kind==='mutate').action;pending.reject(Error('lost acknowledgement'));await first;
  assert.equal(h.node('ddayTitle').value,'저장 실패에도 유지');assert.equal(h.node('ddayDate').value,'2026-09-18');assert.equal(h.node('ddayMode').value,'since');assert.equal(h.snapshot.view.busy,false);assert(!formControlsDisabled(h));
  let retry;h.api.mutateDday=async value=>{retry=plain(value);return result([{...value.item,sourceScope:'user:owner-a'}]);};await h.submit();
  assert.deepEqual(retry,action);assert.equal(h.node('ddayTitle').value,'');assert.equal(h.snapshot.pending,null);assert.equal(h.snapshot.view.data.items.length,1);assert.match(h.messages.at(-1),/保存|저장/);
});
function formControlsDisabled(h){return h.node('ddayForm').fields.every(node=>node.disabled);}

test('changed add content receives a new ID, but unchanged retries remain idempotent',async()=>{
  const h=harness({mutate:()=>{throw Error('retry later');}});h.draft('첫 입력');await h.submit();const first=h.snapshot.pending.item.id;
  await h.submit();assert.equal(h.snapshot.pending.item.id,first);h.draft('바뀐 입력');await h.submit();assert.notEqual(h.snapshot.pending.item.id,first);
  assert.equal(new Set(h.calls.filter(call=>call.kind==='mutate').map(call=>call.action.item.id)).size,2);
});

test('lost acknowledgement followed by a read still retries the original add ID, not a duplicate',async()=>{
  const h=harness({mutate:()=>{throw Error('acknowledgement lost');}});h.draft('서버에는 저장된 입력');await h.submit();const original=h.snapshot.pending.item;
  h.api.readDdayData=async()=>result([{...original,sourceScope:'user:owner-a'}]);await h.controller.refreshDdayData();assert.equal(h.node('ddayTitle').value,original.title);assert.equal(h.snapshot.pending.item.id,original.id);
  let retry;h.api.mutateDday=async action=>{retry=plain(action);return result([{...original,sourceScope:'user:owner-a'}]);};await h.submit();assert.equal(retry.item.id,original.id);assert.equal(h.snapshot.view.data.items.length,1);
});

test('blank title or date does not create IDs or writes, and display-button forwarding keeps source scope',async()=>{
  const h=harness({read:()=>result([item('one'),item('two','pair:couple-a')]),mutate:action=>result([item(action.id,action.sourceScope)])});
  h.draft('  ','2026-09-12');await h.submit();h.draft('제목','');await h.submit();assert.equal(h.snapshot.pending,null);assert.equal(h.calls.length,0);
  await h.controller.refreshDdayData();await h.node('ddayList').children[1].children[1].click();assert.deepEqual(h.calls.filter(call=>call.kind==='mutate').at(-1).action,{type:'select',id:'two',sourceScope:'pair:couple-a'});
});

test('late mutation completion after account switch cannot clear the new user draft or render old data',async()=>{
  const pending=deferred(),h=harness({mutate:()=>pending.promise});h.draft('계정 A 입력');const old=h.submit();h.identity('owner-b');h.draft('계정 B 입력');pending.resolve(result());await old;
  assert.equal(h.node('ddayTitle').value,'계정 B 입력');assert.equal(h.snapshot.view.identity,'owner-b:solo');assert.equal(h.snapshot.view.data,null);assert.equal(h.messages.length,0);
});

test('select and delete send both ID and sourceScope, including colliding personal/pair IDs',async()=>{
  const entries=[item('same','user:owner-a',{title:'개인'}),item('same','pair:couple-a',{title:'커플'})],h=harness({pair:'couple-a',read:()=>result(entries,'same','pair:couple-a'),mutate:action=>result(entries,action.id,action.sourceScope)});
  await h.controller.refreshDdayData();assert.match(h.node('ddayMeta').textContent,/커플/);assert.equal(h.node('ddayList').children[1].className,'dday-row active');assert.equal(h.node('ddayList').children[0].className,'dday-row');
  await h.node('ddayList').children[0].children[0].click();assert.deepEqual(h.calls.filter(call=>call.kind==='mutate').at(-1).action,{type:'select',id:'same',sourceScope:'user:owner-a'});assert.match(h.node('ddayMeta').textContent,/개인/);
  await h.node('ddayList').children[1].children[2].click();assert.deepEqual(h.calls.filter(call=>call.kind==='mutate').at(-1).action,{type:'delete',id:'same',sourceScope:'pair:couple-a'});
});

test('select failure preserves the representative and successful selection survives subsequent cloud resets',async()=>{
  const entries=[item('first'),item('second')],h=harness({read:()=>result(entries,'second','user:owner-a'),mutate:()=>{throw Error('offline');}});await h.controller.refreshDdayData();
  const before=h.node('ddayMeta').textContent;await h.node('ddayList').children[0].children[0].click();assert.equal(h.snapshot.view.data.activeId,'second');assert.equal(h.node('ddayMeta').textContent,before);
  h.api.mutateDday=async()=>result(entries,'first','user:owner-a');await h.node('ddayList').children[0].children[0].click();h.context.cloudData={ddays:[],activeDdayBySpace:{}};h.controller.setDday();assert.equal(h.snapshot.view.data.activeId,'first');
});

test('read-in-progress blocks add/select mutations and leaves typed draft unchanged',async()=>{
  const pending=deferred(),h=harness({read:()=>pending.promise});h.draft('불러오는 동안 입력');const load=h.controller.refreshDdayData();await h.submit();assert.equal(await h.controller.changeDday({type:'select',id:'one',sourceScope:'user:owner-a'}),false);
  assert.equal(h.calls.filter(call=>call.kind==='mutate').length,0);assert.equal(h.node('ddayTitle').value,'불러오는 동안 입력');pending.resolve(result([]));await load;
});

test('Seoul day boundary and inclusive since count are independent of machine timezone/DST',()=>{
  const h=harness({now:'2026-09-08T14:59:59.999Z'});
  assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-09-09'})),'D-1');h.time('2026-09-08T15:00:00.000Z');assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-09-09'})),'D-DAY');
  assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-09-09',mode:'since'})),'D+1');assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-09-08',mode:'since'})),'D+2');assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-09-10',mode:'since'})),'D-1');assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-09-08'})),'D+1');
  h.time('2026-03-08T15:00:00Z');assert.equal(h.controller.ddayText(item('x','scope',{date:'2026-03-10'})),'D-1');
});

test('minute clock updates both representative and open list at Seoul midnight without network writes',async()=>{
  const h=harness({now:'2026-09-08T14:59:00Z',read:()=>result([item('one','user:owner-a',{date:'2026-09-09'})])});await h.controller.refreshDdayData();assert.equal(h.node('dday').textContent,'D-1');assert.match(h.node('ddayList').children[0].children[0].innerHTML,/D-1/);
  assert.equal(h.timers.length,1);assert.equal(h.timers[0].ms,60000);h.timers[0].fn();h.time('2026-09-08T15:00:00Z');h.timers[0].fn();
  assert.equal(h.node('dday').textContent,'D-DAY');assert.match(h.node('ddayList').children[0].children[0].innerHTML,/D-DAY/);assert.equal(h.calls.length,1);
});

test('signed-in Firebase-only users can open, read and add without a Google token',async()=>{
  const h=harness({read:()=>result([])});assert(!('googleToken' in h.context));assert(!/googleToken|requestGoogle|driveSave|saveCloud|cloudData|fetch\s*\(/.test(source));
  await h.node('ddayManageBtn').click();await h.controller.refreshDdayData();assert.deepEqual(h.modals,['ddayModal']);assert.equal(h.node('ddayDate').value,'2026-09-09');h.draft();await h.submit();assert.equal(h.calls.filter(call=>call.kind==='mutate').length,1);
});

test('signed-out view does not read/write, renders no fictional date and requests login on manage',async()=>{
  const h=harness({uid:''});await h.controller.refreshDdayData();h.draft();await h.submit();assert.equal(h.calls.length,0);assert.equal(h.node('dday').textContent,'D-DAY');assert.equal(h.node('ddayMeta').textContent,'');assert.equal(h.node('ddayList').children.length,0);assert.match(h.node('ddayStatus').textContent,/로그인/);
  await h.node('ddayManageBtn').click();assert.equal(h.calls[0].kind,'login');assert.equal(h.modals.length,0);
  assert.match(index,/<strong id="dday">D-DAY<\/strong>/);assert.match(index,/<span class="since-date" id="ddayMeta"><\/span>/);
});

test('title markup is escaped and network errors use textContent, not executable HTML',async()=>{
  const evil='<img src=x onerror=alert(1)>',h=harness({read:()=>result([item('one','user:owner-a',{title:evil})]),mutate:()=>{throw Error(evil);}});await h.controller.refreshDdayData();
  const html=h.node('ddayList').children[0].children[0].innerHTML;assert(!html.includes('<img'));assert.match(html,/&lt;img/);assert(h.node('ddayMeta').textContent.includes(evil));
  h.draft();await h.submit();assert(h.node('ddayStatus').textContent.includes(evil));assert.equal(h.node('ddayStatus').innerHTML,'');
});

test('focus/visibility refresh respects visibility and freshness and online can retry',async()=>{
  const h=harness({read:()=>result()});await h.controller.refreshDdayData();assert.equal(h.calls.length,1);
  await h.events.fire('focus');assert.equal(h.calls.length,1);h.time('2026-09-08T18:00:31Z');h.document.visibilityState='hidden';await h.document.fire('visibilitychange');assert.equal(h.calls.length,1);
  h.document.visibilityState='visible';await h.document.fire('visibilitychange');await settle();assert.equal(h.calls.length,2);await h.events.fire('online');await settle();assert.equal(h.calls.length,3);
});
