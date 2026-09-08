import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeDdayItem,normalizeDdayStore,mergeDdaySources,resolveDdaySelection,preserveDdayRows,mutateDdayStore} from '../dday-store-v174.js';
import {encodeStoredPayload,decodeArchive} from '../archive-codec-v168.js';

const context={uid:'owner',email:'owner@example.test',pairId:'pair1',partnerEmail:'partner@example.test',pairKey:'owner@example.test::partner@example.test'};
const item=(id='d1',extra={})=>({id,title:'디데이',date:'2027-01-01',mode:'countdown',...extra});
const source=(sourceScope='user:owner',legacy={},stored=null)=>({sourceScope,legacy,stored});

test('strict new D-day validation rejects malformed identifiers, impossible dates, empty titles and oversized content',()=>{
  assert.deepEqual(normalizeDdayItem(item('d1',{title:' 이름 ',mode:'since',createdBy:'forged',sourceScope:'pair:other'})),item('d1',{title:'이름',mode:'since'}));
  for(const bad of [null,[],item('../bad'),item('',{}),item('d1',{date:'2026-02-30'}),item('d1',{date:'2026-1-1'}),item('d1',{title:''}),item('d1',{title:'a'.repeat(81)}),item('d1',{mode:'mystery'}),item('d1',{date:20260101})])assert.throws(()=>normalizeDdayItem(bad));
  assert.throws(()=>normalizeDdayStore({items:[item(),item()]}),/중복/);
  assert.throws(()=>normalizeDdayStore({items:{}}));assert.throws(()=>normalizeDdayStore({deletedIds:{}}));
});

test('legacy source reads preserve same-ID rows across scopes without copying own D-days to a pair',()=>{
  const sources=[source('user:owner',{ddays:[item('same',{createdBy:context.email})]}),source('pair:pair1',{ddays:[item('same',{title:'공유 일정',createdBy:context.partnerEmail,pairKey:context.pairKey})]})];
  const before=structuredClone(sources),rows=mergeDdaySources(sources,context);
  assert.deepEqual(rows.map(r=>[r.id,r.sourceScope]),[['same','user:owner'],['same','pair:pair1']]);assert.deepEqual(sources,before);
  assert.equal(resolveDdaySelection(rows,{activeId:'same',activeScope:'pair:pair1'},sources,context).title,'공유 일정');
  assert.throws(()=>mergeDdaySources([source('pair:old-pair',{ddays:[]})],context),{status:403});
});

test('legacy ownership filter recovers untagged own records but excludes old connections',()=>{
  const rows=mergeDdaySources([source('user:owner',{ddays:[item('untagged'),item('mine',{createdBy:context.email,pairKey:'old-pair'}),item('former',{createdBy:'former@example.test'}),item('current',{createdBy:context.partnerEmail,pairKey:context.pairKey}),item('current-old-space',{createdBy:context.partnerEmail,pairKey:'old-pair'})]})],context);
  assert.deepEqual(rows.map(r=>r.id),['untagged','mine','current']);
  const solo={...context,pairId:'',partnerEmail:'',pairKey:''};assert.deepEqual(mergeDdaySources([source('user:owner',{ddays:[item('untagged'),item('former',{createdBy:'former@example.test'})]})],solo).map(r=>r.id),['untagged']);
});

test('dedicated preference wins over site and app legacy settings; inaccessible pair falls back without modifying settings',()=>{
  const sources=[source('user:owner',{ddays:[item('a'),item('b')],activeDdayId:'b',activeDdayBySpace:{'solo:owner@example.test':'a'}})],rows=mergeDdaySources(sources,context);
  assert.equal(resolveDdaySelection(rows,null,sources,context).id,'a');assert.equal(resolveDdaySelection(rows,{activeId:'b',activeScope:'user:owner'},sources,context).id,'b');
  delete sources[0].legacy.activeDdayBySpace;assert.equal(resolveDdaySelection(rows,null,sources,context).id,'b');
  const settings={activeId:'inaccessible',activeScope:'pair:old-pair'},before=structuredClone(settings);assert.equal(resolveDdaySelection(rows,settings,sources,context).id,'a');assert.deepEqual(settings,before);
});

test('targeted add is idempotent, stamps owner data, and never treats a conflicting duplicate as an update',()=>{
  const options={context,sourceScope:'pair:pair1',visibleItems:[],now:12345},add={type:'add',item:item('new',{createdBy:'forged',pairKey:'forged'})};
  const first=mutateDdayStore(null,add,options);assert.equal(first.store.items[0].createdBy,context.email);assert.equal(first.store.items[0].pairKey,context.pairKey);
  const visibleItems=first.store.items.map(row=>({...row,sourceScope:'pair:pair1'}));
  const retry=mutateDdayStore(first.store,add,{...options,now:88888,visibleItems});assert.equal(retry.changed,false);assert.deepEqual(retry.store,first.store);
  assert.throws(()=>mutateDdayStore(first.store,{type:'add',item:item('new',{title:'other'})},{...options,visibleItems}),{status:409});
});

test('explicit tombstones prevent stale legacy resurrection and repeated delete is harmless',()=>{
  const sources=[source('user:owner',{ddays:[item()]})],visibleItems=mergeDdaySources(sources,context),options={context,sourceScope:'user:owner',visibleItems};
  const deleted=mutateDdayStore(null,{type:'delete',id:'d1'},options);sources[0].stored=deleted.store;
  assert.deepEqual(mergeDdaySources(sources,context),[]);assert.equal(sources[0].legacy.ddays.length,1);
  assert.equal(mutateDdayStore(deleted.store,{type:'delete',id:'d1'},{...options,visibleItems:[]}).changed,false);
  assert.throws(()=>mutateDdayStore(deleted.store,{type:'add',item:item()},{...options,visibleItems:[]}),{status:409});
  assert.throws(()=>mutateDdayStore(deleted.store,{type:'select',id:'d1'},{...options,visibleItems:[]}),{status:404});
});

test('quarterly archive retains old dedicated rows and deletion markers exactly',()=>{
  const payload={version:174,items:Array.from({length:40},(_,i)=>item('old-'+i,{title:'과거 기록을 보존합니다 '.repeat(15),date:'2020-01-01',createdAt:1577836800000})),deletedIds:['legacy-removed']};
  assert.deepEqual(decodeArchive(encodeStoredPayload(payload,{now:Date.parse('2026-09-09')})),payload);
});

test('selection materializes same-scope legacy rows and add-only repair preserves newer dedicated data and tombstones',()=>{
  const sources=[source('user:owner',{ddays:[item('a'),item('b')]}),source('pair:pair1',{ddays:[item('partner',{createdBy:context.partnerEmail})]})],visibleItems=mergeDdaySources(sources,context);
  const selected=mutateDdayStore(null,{type:'select',id:'b'},{context,sourceScope:'user:owner',visibleItems});
  assert.equal(selected.changed,true);assert.deepEqual(selected.store.items.map(row=>row.id),['a','b']);assert(!selected.store.items.some(row=>Object.hasOwn(row,'sourceScope')));
  const repaired=preserveDdayRows({items:[item('a',{title:'새 제목'})],deletedIds:['b']},visibleItems,'user:owner');
  assert.equal(repaired.changed,false);assert.deepEqual(repaired.store.items,[item('a',{title:'새 제목'})]);assert.deepEqual(repaired.store.deletedIds,['b']);
});
