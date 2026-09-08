/**
 * Production workflow/public modules with bounded DOM/API doubles, never live data.
 * Run: node --test tests/test-estate-workflow-v171.mjs
 * These behavior tests supplement, not replace, browser layout/native interaction QA.
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {webcrypto} from 'node:crypto';
import {installWorkflow} from '../estate-workflow-v171.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const tick = () => new Promise(resolve => setTimeout(resolve, 0));
class NodeDouble {
  constructor() { this.innerHTML=''; this.textContent=''; this.dataset={}; this.listeners={}; this.queries=new Map(); this.value=''; this.disabled=false; this.hidden=false; this.scrollTop=0; this.inert=false; this.classList={add(){},toggle(){}}; }
  addEventListener(type, fn, options={}) { (this.listeners[type] ||= []).push({fn, signal:options.signal}); }
  async emit(type, event={}) { for(const {fn,signal} of this.listeners[type]||[]) if(!signal?.aborted) await fn({currentTarget:this,target:this,preventDefault(){},...event}); }
  dispatchEvent(event) { this.dispatched ||= []; this.dispatched.push(event.type); return true; }
  querySelector(selector) { return this.queries.get(selector) || null; }
  querySelectorAll(selector) { return this.queries.get(selector) || []; }
  contains() { return true; }
  closest(selector) { return selector==='button' && this.isButton ? this : this.parents?.[selector] || null; }
  hasAttribute(name) { return this.attributes?.has(name) || false; }
}
const control = (value='', selected=[]) => Object.assign(new NodeDouble(), {value, selectedOptions:selected.map(value=>({value}))});
const button = (dataset={}, attrs=[], parents={}) => Object.assign(new NodeDouble(), {dataset, attributes:new Set(attrs), parents, isButton:true});
function fixture() {
  return {
    tasks:[{id:'deal-d1',sourceKind:'deals',sourceId:'d1',title:'중복 없는 후속 미팅',date:'2026-09-07',status:'open'}],
    visits:[{id:'v1',date:'2026-09-08',time:'10:00',status:'scheduled',customerIds:['c1'],propertyId:'p1'}],
    deals:[
      {id:'d1',title:'확정 거래',nextAction:'중복 없는 후속 미팅',dueDate:'2026-09-07',stage:'contract',propertyId:'p1',buyerIds:['c1'],contractDate:'2026-09-08',feeDueDate:'2026-09-08',confirmedFee:100,expectedFee:120},
      {id:'dhold',title:'제외할 보류 거래',stage:'hold',feeDueDate:'2026-09-08',confirmedFee:900},
      {id:'dstopped',title:'제외할 중단 거래',stage:'stopped',feeDueDate:'2026-09-08',confirmedFee:900},
      {id:'dunknown',title:'금액 미입력 거래',stage:'preparation',feeDueDate:'2026-09-08',confirmedFee:null}],
    customers:[{id:'c1',name:'<img src=x onerror=1>',nextContactDate:'2026-09-07',firstContactDate:'2026-09-01',source:'지인'}],
    properties:[{id:'p1',title:'확인할 실제 매물',nextCheckDate:'2026-09-08',dealType:'sale',receivedDate:'2026-09-01',status:'active'}],
    requests:[], receipts:[{id:'r1',dealId:'d1',amount:40,date:'2026-09-08'},{id:'r2',dealId:'d1',amount:20,date:'2026-09-08'}]
  };
}
function harness(data=fixture()) {
  const state={data,views:new Map(),entities:new Map(),reads:[],saves:[],calls:[],opens:[],closes:[],notices:[],refreshes:0,owner:'owner-1'};
  state.app={
    registerView:(name,fn)=>state.views.set(name,fn), registerEntity:(name,fn)=>state.entities.set(name,fn),
    uid:()=>state.owner,today:()=> '2026-09-08',money:n=>n+'원',esc:escape,
    list:async(collection,options)=>{state.reads.push({collection,...options});return {rows:structuredClone(data[collection]||[]),cursor:collection==='customers'?'next-page':null};},
    pickOptions:async collection=>structuredClone(data[collection]||[]),lookup:async(collection,id)=>data[collection]?.find(row=>row.id===id)||null,
    save:async(collection,row)=>{const committed={...structuredClone(row),revision:(row.revision||0)+1};state.saves.push({collection,row:committed});return committed;},
    open:(...args)=>state.opens.push(args),close:(...args)=>state.closes.push(args),notice:(...args)=>state.notices.push(args),refresh:()=>state.refreshes++,
    form:(container,html,onSave)=>{container.formHTML=html;container.submit=onSave;return container.querySelector('form');},
    api:{call:async(action,payload)=>{state.calls.push({action,payload});return {visit:{id:'confirmed-v1'},row:{id:'r1',status:'rejected'}};},upload:async()=>({id:'uploaded-1'})}
  };
  installWorkflow(state.app);return state;
}
function formContainer(values={}) {
  const container=new NodeDouble(),form=new NodeDouble(),controls=new Map(Object.entries(values));
  form.elements={namedItem:name=>controls.get(name)||null};
  container.queries.set('form',form);
  return {container,form,controls};
}
const signal = () => new AbortController().signal;

test('Today: generated work is not doubled, contact/property tasks and 5 compact summaries remain', async()=>{
  const h=harness(),container=new NodeDouble();await h.views.get('today')({container,signal:signal()});
  assert.equal(h.views.size,3);assert.equal(h.entities.size,5);
  assert.equal((container.innerHTML.match(/중복 없는 후속 미팅/g)||[]).length,1);
  assert(!container.innerHTML.includes('<img'));assert(container.innerHTML.includes('&lt;img'));
  for(const expected of ['확인할 실제 매물','estate-wf-top-summary','이번 주 계약 / 잔금','오늘 일정','가까운 마감','고객 다음 50건','불러온 기록만 집계']) assert(container.innerHTML.includes(expected),expected);
  const summary=container.innerHTML.match(/<div class="estate-wf-top-summary">(.*?)<\/div>/s)?.[1]||'';
  assert.equal((summary.match(/<article>/g)||[]).length,5);
  assert.equal(h.reads.length,7);assert(h.reads.every(read=>read.limit===50));
  h.data.properties=[];h.data.customers=[];
  await h.views.get('today')({container,signal:signal()});
  assert(container.innerHTML.includes('첫 매물 등록'));assert(container.innerHTML.includes('첫 고객 등록'));
});

test('Today action buttons save a completed task or the correct contact date field', async()=>{
  const h=harness(),container=new NodeDouble();await h.views.get('today')({container,signal:signal()});
  await container.emit('click',{target:button({collection:'tasks',id:'deal-d1'},['data-estate-complete'])});
  assert.equal(h.saves[0].row.status,'done');
  const editor=new NodeDouble();editor.queries.set('input',control('2026-09-12'));
  await container.emit('click',{target:button({collection:'customers',id:'c1'},['data-estate-save-date'],{'.estate-wf-reschedule':editor})});
  assert.equal(h.saves[1].row.nextContactDate,'2026-09-12');assert(!('date' in h.saves[1].row));
});

test('Deal view preserves board/list switching and requires hold/stopped reasons', async()=>{
  const h=harness(),container=new NodeDouble();await h.views.get('deals')({container,signal:signal()});
  assert(container.innerHTML.includes('estate-wf-board'));
  await container.emit('click',{target:button({estateMode:'list'})});assert(container.innerHTML.includes('estate-wf-deal-list'));
  const card=new NodeDouble();card.queries.set('[name="quickStage"]',control('hold'));card.queries.set('[name="quickReason"]',control(''));
  const save=button({id:'d1'},['data-estate-save-stage'],{'[data-estate-row]':card});
  await container.emit('click',{target:save});assert.equal(h.saves.length,0);assert(h.notices.at(-1)[0].includes('사유'));
  card.querySelector('[name="quickReason"]').value='고객 일정 확인 대기';await container.emit('click',{target:save});
  assert.equal(h.saves[0].row.stage,'hold');assert.equal(h.saves[0].row.reason,'고객 일정 확인 대기');
});

test('Settlement uses partial receipts, labels unknown fees, charts and bounded samples', async()=>{
  const h=harness(),container=new NodeDouble();await h.views.get('settlement')({container,signal:signal()});
  for(const expected of ['60원','40원','문의 1명 · 계약 1건','확정 수수료 미입력 1건','불러온 기록만 집계']) assert(container.innerHTML.includes(expected),expected);
  assert(!container.innerHTML.includes('제외할 보류 거래'));assert(!container.innerHTML.includes('제외할 중단 거래'));
  assert.equal((container.innerHTML.match(/class="estate-wf-chart-row"/g)||[]).length,4);
  assert(h.reads.every(read=>read.limit===50));
});

test('Receipt editor rejects missing deal/nonpositive amounts and preserves partial receipt identity', async()=>{
  const h=harness(),{container,form,controls}=formContainer({dealId:control('')});
  await h.entities.get('receipts')({container,row:{id:'r-new'},signal:signal()});
  await assert.rejects(()=>container.submit({amount:'20',date:'2026-09-08'},form),/거래를 선택/);
  controls.get('dealId').value='d1';
  for(const amount of ['0','-1','bad']) await assert.rejects(()=>container.submit({amount,date:'2026-09-08'},form),/0보다 크게/);
  await container.submit({amount:'20',date:'2026-09-08',method:'계좌'},form);
  await container.submit({amount:'30',date:'2026-09-09',method:'계좌'},form);
  assert.equal(h.saves.length,2);assert.equal(h.saves[0].row.amount,20);assert.equal(h.saves[1].row.id,'r-new');assert.equal(h.saves[1].row.revision,2);
});

test('Deal attachment deletion is reserved, detached before mediaDelete, and failures can retry', async()=>{
  const h=harness(),{container,form}=formContainer({stage:control('inquiry'),reason:control(''),propertyId:control('p1'),sellerIds:control('',[]),buyerIds:control('',[]),dealFiles:Object.assign(control(''),{files:[]})});
  for(const selector of ['.estate-wf-files','.estate-wf-deal-reason','[data-deal-receipts]']) container.queries.set(selector,new NodeDouble());
  form.queries.set('[data-check-id]',[]);
  const order=[];const save=h.app.save;h.app.save=async(...args)=>{order.push(['save',structuredClone(args[1].mediaIds)]);return save(...args);};
  let attempt=0;h.app.api.call=async(action,{id})=>{order.push([action,id]);if(++attempt===1)throw Error('still referenced');return {ok:true};};
  await h.entities.get('deals')({container,row:{id:'d1',revision:1,mediaIds:['private-media']},signal:signal()});
  const remove=button({estateRemoveMedia:'private-media'});
  await container.emit('click',{target:remove});assert.equal(order.length,0);assert(container.querySelector('.estate-wf-files').innerHTML.includes('삭제 예약 취소'));
  await assert.rejects(()=>container.submit({stage:'hold',reason:''},form),/사유/);assert.equal(order.length,0);
  await container.submit({stage:'inquiry',reason:''},form);
  assert.deepEqual(order,[['save',[]],['mediaDelete','private-media']]);
  assert(container.querySelector('.estate-wf-files').innerHTML.includes('삭제가 보류'));
  await container.emit('click',{target:button({},['data-estate-cleanup-retry'])});
  assert.equal(order.at(-1)[0],'mediaDelete');assert(!container.querySelector('.estate-wf-files').innerHTML.includes('삭제가 보류'));
  assert(form.dispatched.includes('input'),'attachment change must mark the draft dirty');
});

test('Deal attachment upload failure keeps the dirty draft and does not duplicate successful uploads on retry', async()=>{
  const h=harness(),file={name:'note.pdf'},fileInput=Object.assign(control(''),{files:[file]});
  const {container,form}=formContainer({stage:control('inquiry'),reason:control(''),propertyId:control('p1'),sellerIds:control('',[]),buyerIds:control('',[]),dealFiles:fileInput});
  for(const selector of ['.estate-wf-files','.estate-wf-deal-reason','[data-deal-receipts]'])container.queries.set(selector,new NodeDouble());form.queries.set('[data-check-id]',[]);
  let uploads=0,linkAttempts=0;h.app.api.upload=async()=>{uploads++;return {id:'upload-1'};};
  const save=h.app.save;h.app.save=async(...args)=>{if(args[1].mediaIds.includes('upload-1')&&++linkAttempts===1)throw Error('uncertain link save');return save(...args);};
  await h.entities.get('deals')({container,row:{id:'d1',mediaIds:[]},signal:signal()});
  await assert.rejects(()=>container.submit({stage:'inquiry'},form),/uncertain/);assert(form.dispatched.includes('input'));
  await container.submit({stage:'inquiry'},form);assert.equal(uploads,1);assert.deepEqual(h.saves.at(-1).row.mediaIds,['upload-1']);
});

test('Request confirmation defers navigation until form completion; rejection refreshes and unlocks', async t=>{
  const previous=globalThis.window;const events=[];globalThis.window={dispatchEvent:event=>events.push(event.type)};t.after(()=>{if(previous===undefined)delete globalThis.window;else globalThis.window=previous;});
  const h=harness(),{container,form,controls}=formContainer({customerId:control('c1'),propertyId:control('p1')});
  const reject=button({},[],{'form':form});container.queries.set('[data-request-reject]',reject);
  await h.entities.get('requests')({container,row:{id:'request-1',status:'pending',propertyIds:['p1']},signal:signal()});
  controls.get('propertyId').value='not-requested';await assert.rejects(()=>container.submit({date:'2026-09-08'},form),/포함된 매물/);assert.equal(h.calls.length,0);
  controls.get('propertyId').value='p1';let formFinished=false;
  h.app.open=(...args)=>{assert(formFinished,'panel must open after the form success callback completes');h.opens.push(args);};
  await container.submit({date:'2026-09-08',time:'10:00'},form);assert.equal(h.opens.length,0);formFinished=true;await tick();
  assert.deepEqual(h.opens,[['visits','confirmed-v1']]);assert.equal(h.refreshes,1);
  form.dataset.busy='true';await reject.emit('click');assert.equal(h.calls.length,1);
  form.dataset.busy='false';await reject.emit('click');assert.deepEqual(h.closes,[[true]]);assert.equal(h.refreshes,2);
  assert.equal(form.inert,false);assert.equal(form.dataset.busy,'false');assert.equal(reject.disabled,false);
  assert.deepEqual(h.calls.map(call=>call.action),['requestConfirm','requestReject']);assert.deepEqual(events,['aiderlog-estate-updated','aiderlog-estate-updated']);
});

// The public script runs as-is in an isolated browser-like VM. Any innerHTML write fails.
class PublicNode {
  constructor(tag='div') { this.tagName=tag;this.children=[];this.listeners={};this.dataset={};this.hidden=false;this.disabled=false;this.textContent=''; }
  set innerHTML(_) { throw Error('public content must not use innerHTML'); }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children=nodes; }
  addEventListener(type,fn) { this.listeners[type]=fn; }
  querySelector(selector) { if(selector==='button[type="submit"]')return this.submit;return this.children.find(node=>node.tagName===selector)||null; }
  querySelectorAll(selector) { return this.children.filter(node=>node.tagName===selector); }
  reportValidity() { return true; }
  reset() { this.wasReset=true; }
  remove() { this.removed=true; }
}
async function publicHarness({publicData,requestFailure=true}={}) {
  const ids=new Map(),reads=[],pageEvents={},fields={propertyIds:['p1','foreign-property'],name:'Guest',phone:'01012345678',consent:'',preferredDate:'2026-09-10'};
  const get=id=>{if(!ids.has(id))ids.set(id,new PublicNode());return ids.get(id);};
  get('estatePublicRequestForm').submit=new PublicNode('button');
  const token='a'.repeat(64);let requestAttempts=0;
  const context=vm.createContext({console,URL,URLSearchParams,AbortController,Blob,Uint8Array,atob,crypto:webcrypto,
    location:{hash:'#'+token,search:''},document:{getElementById:get,createElement:tag=>new PublicNode(tag)},
    FormData:class { get(key){return fields[key]??null;}getAll(key){return Array.isArray(fields[key])?fields[key]:[];} },
    addEventListener:(name,fn)=>pageEvents[name]=fn,
    fetch:async(url,options)=>{const body=JSON.parse(options.body);reads.push({url,options,body});if(body.action==='publicRequest'){requestAttempts++;if(requestFailure&&requestAttempts===1)throw Error('uncertain network failure');return {ok:true,status:200,json:async()=>({ok:true})};}return {ok:true,status:200,json:async()=>publicData||({expiresAt:'2026-09-30',properties:[{id:'p1',title:'<img src=x onerror=1>',price:100,dealType:'sale',internalMemo:'PRIVATE_SENTINEL',ownerCustomerId:'PRIVATE_OWNER'}]})};}
  });
  const source=await readFile(new URL('../estate-public-v171.js',import.meta.url),'utf8');
  assert(source.trimEnd().endsWith('initialize();'));
  vm.runInContext(source.replace(/initialize\(\);\s*$/,'globalThis.__ready=initialize();globalThis.__photoUrl=photoUrl;'),context);
  await context.__ready;
  const submit=()=>get('estatePublicRequestForm').listeners.submit({preventDefault(){},currentTarget:get('estatePublicRequestForm')});
  const text=node=>[node.textContent,...node.children.map(text)].join(' ');
  return {context,ids,get,reads,fields,token,submit,text,pageEvents};
}

test('Public snapshot never renders private fields/HTML and requires consent; uncertain retry reuses request ID', async()=>{
  const p=await publicHarness(),content=p.text(p.get('estateSharedProperties'));
  assert(content.includes('<img src=x onerror=1>'),'untrusted title remains literal text');
  assert(!content.includes('PRIVATE_SENTINEL'));assert(!content.includes('PRIVATE_OWNER'));
  assert.equal(p.reads[0].body.token,p.token);assert.equal(p.reads.length,1);
  await p.submit();assert.equal(p.reads.length,1,'no consent means no request');
  p.fields.consent='on';await p.submit();await p.submit();await p.submit();
  const requests=p.reads.filter(read=>read.body.action==='publicRequest');assert.equal(requests.length,2,'successful submission blocks duplicates');
  assert.equal(requests[0].body.requestId,requests[1].body.requestId);assert.deepEqual(requests[0].body.propertyIds,['p1']);
  assert.equal(p.get('estatePublicRequestForm').wasReset,true);
  for(const read of p.reads){assert.equal(read.url,'/api/estate');assert.equal(read.options.credentials,'omit');assert.equal(read.options.cache,'no-store');assert.equal(read.options.referrerPolicy,'no-referrer');assert(!('Authorization' in read.options.headers));assert(['publicGet','publicRequest'].includes(read.body.action));}
});

test('Public media rejects SVG/oversized metadata before reading any chunks', async()=>{
  const p=await publicHarness();
  for(const info of [{type:'image/svg+xml',size:10,chunkBytes:10},{type:'image/png',size:21*1024*1024,chunkBytes:1024}]){
    const actions=[];p.context.fetch=async(url,options)=>{actions.push(JSON.parse(options.body).action);return {ok:true,status:200,json:async()=>info};};
    await assert.rejects(()=>p.context.__photoUrl('public-selected-photo'),/미리보기/);assert.deepEqual(actions,['publicMediaInfo']);
  }
});
