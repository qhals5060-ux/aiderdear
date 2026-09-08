// Local-only UI contracts: real directory/field/model code with a small DOM double.
// Layout, pointer interaction and launcher behavior require the separate browser QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {installDirectory} from '../estate-directory-v171.js';
import {entity} from '../server/estate-model.mjs';

const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const decode=value=>String(value??'').replace(/&(amp|lt|gt|quot);/g,(_,key)=>({amp:'&',lt:'<',gt:'>',quot:'"'}[key]));
const source=fs.readFileSync(new URL('../estate-v171.js',import.meta.url),'utf8');
const start=source.indexOf('field(name,label'),end=source.indexOf('\n    form(',start);
const field=Function('esc','return ({'+source.slice(start,end)+'}).field')(esc);
globalThis.CSS??={escape:String};

class El {
  constructor(owner=null){this.owner=owner;this.children=new Map();this.listeners={};this.dataset={};this.classList={add(){}};this.isConnected=true;this.hidden=false;this.value='';this.checked=false;this.disabled=false;this.elements={};this.ownedNames=[];this.events=[];}
  set innerHTML(markup){
    this.markup=markup;
    if(!this.owner)return;
    this.ownedNames.forEach(name=>delete this.owner.elements[name]);this.ownedNames=[];
    for(const match of markup.matchAll(/<(input|textarea|select)\b([^>]*)(?:>([\s\S]*?)<\/\1>|\s*\/?\s*>)/g)){
      const [,kind,attrs,body='']=match,name=attrs.match(/\bname="([^"]+)"/)?.[1];if(!name)continue;
      const node=new El();node.name=decode(name);node.checked=/\bchecked\b/.test(attrs);
      node.value=kind==='textarea'?decode(body):kind==='select'?decode([...body.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/g)].find((option,index)=>/\bselected\b/.test(option[1]))?.[1].match(/\bvalue="([^"]*)"/)?.[1]??body.match(/<option\b[^>]*\bvalue="([^"]*)"/)?.[1]??''):decode(attrs.match(/\bvalue="([^"]*)"/)?.[1]??'');
      node.type=attrs.match(/\btype="([^"]*)"/)?.[1]||kind;
      this.owner.elements[node.name]=node;this.ownedNames.push(node.name);
    }
  }
  get innerHTML(){return this.markup||'';}
  querySelector(selector){if(!this.children.has(selector))this.children.set(selector,new El(this.owner));return this.children.get(selector);}
  querySelectorAll(selector){if(selector==='[data-directory-mode]')return ['cards','list'].map(mode=>{const node=this.querySelector('[mode="'+mode+'"]');node.dataset.directoryMode=mode;return node;});return [];}
  addEventListener(type,handler){(this.listeners[type]??=[]).push(handler);}
  dispatchEvent(event){this.events.push(event.type);for(const handler of this.listeners[event.type]||[])handler(event);return true;}
  setAttribute(key,value){this[key]=value;}
  async fire(type,event={}){for(const handler of this.listeners[type]||[])await handler(event);}
}

function harness(rows=[]){
  const views=new Map(),editors=new Map(),calls=[],notices=[];let form,callback,markup,saved,fail=false;
  const app={esc,field,uid:()=> 'co-qa-owner',today:()=> '2026-09-08',money:n=>n+'원',options:()=>[],pickOptions:async()=>[],lookup:async()=>null,open(){},notice:(...args)=>notices.push(args),
    registerView:(key,fn)=>views.set(key,fn),registerEntity:(key,fn)=>editors.set(key,fn),
    form:(_host,html,onSave)=>{form=new El();form.owner=form;form.innerHTML=html;form.isConnected=false;markup=html;callback=onSave;return form;},
    save:async(collection,row)=>{calls.push(['save',collection,structuredClone(row)]);if(fail)throw Error('QA save failed');saved={...row,...entity(collection,row),revision:(row.revision||0)+1};return saved;},
    list:async(collection,options)=>{calls.push(['list',collection,options]);return {rows:options.cursor?rows.slice(50):rows.slice(0,50),cursor:!options.cursor&&rows.length>50?'page2':null};},
    api:{image:async()=>'',call:async(action,params)=>{calls.push([action,params]);return {rows:[],results:[],cursor:null};}}
  };
  installDirectory(app);
  return {app,calls,notices,views,editors,get form(){return form;},get markup(){return markup;},get saved(){return saved;},set fail(value){fail=value;},
    open:async(row={})=>editors.get('properties')({container:new El(),row:{id:'qa-property',title:'QA 매물',revision:1,...row},isNew:true}),
    data:()=>Object.fromEntries(Object.entries(form.elements).map(([name,node])=>[name,node.type==='checkbox'?(node.checked?'1':''):node.value])),
    save:()=>callback(Object.fromEntries(Object.entries(form.elements).map(([name,node])=>[name,node.type==='checkbox'?(node.checked?'1':''):node.value])),form)
  };
}
const partners=h=>JSON.parse(h.form.elements.coBrokersJson.value);
const input=(h,id,key,value)=>{h.form.elements[`coBroker_${id}_${key}`].value=value;};
const add=h=>h.form.querySelector('[data-cobroker-add]').fire('click');
const remove=(h,id)=>h.form.querySelector('[data-cobroker-partners]').fire('click',{target:{closest:()=>({dataset:{cobrokerRemove:id}})}});
const filter=(container,value)=>container.querySelector('[name="directoryCoBroker"]').fire('change',{target:{value}});
const shown=container=>[...container.querySelector('[data-directory-results]').innerHTML.matchAll(/data-directory-open="([^"]+)"/g)].map(match=>match[1]);
const partner={id:'partner-old',office:'가나다 부동산',name:'김담당',phone:'010-1234-5678',role:'listing',terms:'기존 약정'};

test('legacy positive flag and legacy memo are preserved without inventing a source or partner',async()=>{
  const h=harness();await h.open({coBroker:true,coBrokerInfo:'오래된 공동중개 메모'});
  assert.match(h.markup,/공동중개 메모 \(기존 기록 포함\)/);assert.match(h.markup,/자동 공유되거나 계정이 생성되지 않습니다/);
  await h.save();assert.equal(h.saved.coBroker,true);assert.equal(h.saved.coBrokerInfo,'오래된 공동중개 메모');assert.equal(h.saved.coBrokerSource,'');assert.equal(h.saved.coBrokerStage,'');assert.deepEqual(h.saved.coBrokers,[]);
});
test('complete structured partners and manual source/stage save through the real backend schema',async()=>{
  const h=harness();await h.open({coBrokerInfo:'원래 메모',coBrokerSource:'partner',coBrokerStage:'active',coBrokers:[partner]});
  input(h,partner.id,'terms',' 새 협의 내용 ');await h.save();
  assert.equal(h.saved.coBroker,true);assert.equal(h.saved.coBrokerStage,'active');assert.equal(h.saved.coBrokerSource,'partner');assert.equal(h.saved.coBrokerInfo,'원래 메모');assert.deepEqual(h.saved.coBrokers,[{...partner,terms:'새 협의 내용'}]);
});
test('add preserves live input, uses stable unique UUIDs and never fills invented partner information',async()=>{
  const h=harness();await h.open({coBrokers:[partner]});input(h,partner.id,'office','수정 사무소');await add(h);
  const first=partners(h);assert.equal(first[0].office,'수정 사무소');assert.match(first[1].id,/^[0-9a-f-]{36}$/i);assert.deepEqual(Object.values(first[1]).slice(1),['','','','','']);
  input(h,first[1].id,'name','새 담당자');await add(h);const next=partners(h);
  assert.equal(next[1].id,first[1].id);assert.equal(next[1].name,'새 담당자');assert.notEqual(next[2].id,first[1].id);assert(h.form.elements.coBrokersJson.events.includes('input'));
});
test('remove retains unsaved input in every remaining partner and cannot regenerate their IDs',async()=>{
  const h=harness();await h.open({coBrokers:[partner,{...partner,id:'partner-second',office:'다른 사무소'}]});
  input(h,'partner-second','phone','010-9999-8888');await remove(h,'partner-old');await h.save();
  assert.deepEqual(h.saved.coBrokers,[{...partner,id:'partner-second',office:'다른 사무소',phone:'010-9999-8888'}]);
});
test('save failure keeps draft fields and partner IDs for a successful retry',async()=>{
  const h=harness();await h.open({coBrokerInfo:'기존 약속'});await add(h);const id=partners(h)[0].id;input(h,id,'office','실패해도 보존');input(h,id,'phone','010-1111-2222');h.form.elements.coBrokerStage.value='available';h.fail=true;
  await assert.rejects(h.save(),/QA save failed/);assert.equal(h.form.elements[`coBroker_${id}_office`].value,'실패해도 보존');assert.equal(partners(h)[0].id,id);
  h.fail=false;await h.save();assert.equal(h.saved.coBrokers[0].id,id);assert.equal(h.saved.coBrokers[0].office,'실패해도 보존');assert.equal(h.saved.coBrokerInfo,'기존 약속');
});
test('five-partner cap prevents extra additions without losing any existing input',async()=>{
  const h=harness();await h.open();for(let i=0;i<5;i++)await add(h);input(h,partners(h)[0].id,'terms','보존할 조건');await add(h);await h.save();
  assert.equal(h.saved.coBrokers.length,5);assert.equal(h.saved.coBrokers[0].terms,'보존할 조건');assert.equal(h.form.querySelector('[data-cobroker-add]').disabled,true);assert.match(h.notices.at(-1)[0],/최대 5명/);
  await remove(h,h.saved.coBrokers[4].id);assert.equal(h.form.querySelector('[data-cobroker-add]').disabled,false);
});
test('all partner markup is escaped and real input length limits match the backend contract',async()=>{
  const h=harness();await h.open({coBrokers:[{...partner,office:'<img src=x onerror=alert(1)>',terms:'</textarea><script>bad()</script>'}]});
  const html=h.form.querySelector('[data-cobroker-partners]').innerHTML;assert(!html.includes('<img'));assert(!html.includes('<script>'));assert.match(html,/&lt;img/);assert.match(html,/maxlength="120"/);assert.match(html,/maxlength="80"/);assert.match(html,/maxlength="2000"/);
});
test('own/available/active/finished filters work with legacy flags and explicit source ownership',async()=>{
  const rows=[{id:'ordinary',title:'가'},{id:'legacy',title:'나',coBroker:true},{id:'active',title:'다',coBrokerSource:'partner',coBrokerStage:'active',coBrokers:[partner]},{id:'finished',title:'라',coBrokerStage:'finished'},{id:'own-active',title:'마',coBrokerSource:'own',coBrokerStage:'active'}];
  const h=harness(rows),container=new El();await h.views.get('properties')({container});
  await filter(container,'own');assert.deepEqual(shown(container),['ordinary','own-active']);
  await filter(container,'available');assert.deepEqual(shown(container),['legacy']);
  await filter(container,'active');assert.deepEqual(shown(container),['active','own-active']);
  await filter(container,'finished');assert.deepEqual(shown(container),['finished']);
  await container.querySelector('[data-directory-reset]').fire('click');assert.equal(shown(container).length,5);
});
test('partner office, name and phone queries remain local, with explicit loaded-range disclosure',async()=>{
  const rows=Array.from({length:51},(_,i)=>({id:'p'+i,title:'매물 '+i,...(i===50?{coBrokerStage:'active',coBrokers:[partner]}:{})}));
  const h=harness(rows),container=new El();await h.views.get('properties')({container});
  assert.match(container.innerHTML,/공동중개 업체·담당자·연락처 검색과 분류는 불러온 자료 범위/);
  await container.querySelector('[data-directory-query]').fire('input',{target:{value:partner.office}});assert.deepEqual(shown(container),[]);assert.match(container.querySelector('[data-directory-range]').textContent,/아직 불러오지 않은/);
  await container.querySelector('[data-directory-more]').fire('click');assert.deepEqual(shown(container),['p50']);
  for(const q of [partner.name,partner.phone]){await container.querySelector('[data-directory-query]').fire('input',{target:{value:q}});assert.deepEqual(shown(container),['p50']);}
  assert(!h.calls.some(call=>call[0]==='search'));
});
test('partner-only or legacy-memo records with a false flag are not mislabeled as own or available',async()=>{
  const h=harness([{id:'partner-only',title:'가',coBroker:false,coBrokers:[partner]},{id:'source-only',title:'나',coBroker:false,coBrokerSource:'partner'},{id:'memo-only',title:'다',coBrokerInfo:'보존할 옛 메모'},{id:'normal',title:'라',coBroker:false}]),container=new El();await h.views.get('properties')({container});
  const html=container.querySelector('[data-directory-results]').innerHTML;assert.equal((html.match(/공동중개 · 상태 미설정/g)||[]).length,3);
  await filter(container,'own');assert.deepEqual(shown(container),['normal']);await filter(container,'available');assert.deepEqual(shown(container),[]);await filter(container,'');assert.equal(shown(container).length,4);
});
test('list and photo cards contain stage and office badges but no partner contact details',async()=>{
  const h=harness([{id:'p',title:'매물',coBrokerStage:'active',coBrokers:[partner]}]),container=new El();await h.views.get('properties')({container});
  for(const mode of ['list','cards']){await container.querySelector(`[mode="${mode}"]`).fire('click');const html=container.querySelector('[data-directory-results]').innerHTML;assert.match(html,/공동중개 진행/);assert.match(html,/가나다 부동산/);assert(!html.includes(partner.phone));assert(!html.includes(partner.terms));assert.match(html,mode==='list'?/estate-directory-table/:/estate-directory-property-card/);}
});
test('source ownership and stage are retained when reopening details and no sharing/API account write occurs',async()=>{
  const h=harness();await h.open({coBrokerSource:'own',coBrokerStage:'finished',coBrokers:[partner]});await h.save();await h.open(h.saved);
  assert.equal(h.form.elements.coBrokerSource.value,'own');assert.equal(h.form.elements.coBrokerStage.value,'finished');assert.equal(partners(h)[0].id,partner.id);
  assert(h.calls.every(call=>call[0]==='save'));
});
test('CSS is limited to ESTATE and inherits the shared site typography scale',()=>{
  const css=fs.readFileSync(new URL('../estate-cobroker-v173.css',import.meta.url),'utf8');
  assert.match(css,/var\(--site-type-control,13px\)/);assert.match(css,/var\(--site-type-meta,12px\)/);assert.match(css,/#estateStage \.estate-wf-cobroker-context/);
  for(const rule of css.replace(/\/\*[\s\S]*?\*\//g,'').split('}')){const selector=rule.slice(0,rule.indexOf('{')).trim();if(selector&&!selector.startsWith('@media'))assert(selector.split(',').every(item=>item.trim().startsWith('#estateStage')));}
});
