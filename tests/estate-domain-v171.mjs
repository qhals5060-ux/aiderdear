import test from 'node:test';
import assert from 'node:assert/strict';
import {matchProperty,estateStatistics,calendarRows,publicProperty} from '../estate-domain-v171.js';
import {createEstateClient} from '../estate-client-v171.js';

const criterion=(match,key)=>match.criteria.find(c=>c.key===key);
const property={id:'p1',title:'공개 매물',status:'active',region:'서울 마포구',dealType:'rent',propertyType:'apartment',deposit:10000000,rent:800000,managementFee:0,area:60,rooms:2,parking:'yes',elevator:'yes',pets:'negotiable'};
test('required unknown and unmet conditions never enter default recommendations; flexible remains negotiation',()=>{
 const customer={required:['parking','area'],areaMin:65,parking:'yes'};
 let result=matchProperty(customer,{...property,parking:'unknown'});assert.equal(result.eligible,false);assert.equal(criterion(result,'parking').status,'unknown');assert.equal(criterion(result,'area').status,'unfulfilled');
 result=matchProperty({...customer,flexible:['area']},{...property});assert.equal(result.eligible,false);assert.equal(criterion(result,'area').status,'negotiable');
 result=matchProperty({required:['rooms']},property);assert.equal(result.eligible,false);assert.equal(criterion(result,'rooms').status,'unknown');
});
test('zero management fee is confirmed zero; missing management fee is not silently zero',()=>{
 const customer={monthlyCostMax:800000,required:['monthlyCost']};
 assert.equal(criterion(matchProperty(customer,property),'monthlyCost').status,'fulfilled');
 const unknown=matchProperty(customer,{...property,managementFee:null});assert.equal(criterion(unknown,'monthlyCost').status,'unknown');assert.equal(unknown.eligible,false);
 const exceeded=matchProperty(customer,{...property,managementFee:1000});assert.equal(criterion(exceeded,'monthlyCost').status,'unfulfilled');
});
test('matching discloses reasons, confirmed coverage, non-probability score and explicit excluded regions',()=>{
 const customer={regions:['서울'],excludedRegions:['마포'],areaMin:50,parking:'yes',pets:'yes'};
 const result=matchProperty(customer,property);assert.equal(result.eligible,false);assert.equal(criterion(result,'pets').status,'negotiable');assert.ok(result.criteria.every(c=>typeof c.reason==='string'&&c.reason.length));assert.equal(result.coverage,80);assert.equal(result.score,60);
 assert.equal(matchProperty({},property).score,null);assert.equal(matchProperty({},property).coverage,0);assert.equal(matchProperty({},{...property,status:'closed'}).eligible,false);
});
test('unknown deal type and prices cannot satisfy budget; available date vs deadline is explicit',()=>{
 assert.equal(criterion(matchProperty({priceMax:1e9},{...property,dealType:''}),'price').status,'unknown');
 const c={moveInTo:'2026-10-01',required:['moveIn']};assert.equal(criterion(matchProperty(c,{...property,availableDate:'2026-10-02'}),'moveIn').status,'unfulfilled');assert.equal(matchProperty(c,{...property,availableDate:null}).eligible,false);
 assert.equal(criterion(matchProperty(c,{...property,availableDate:'2026-09-01'}),'moveIn').status,'fulfilled');
});
test('statistics separate dated receipts, lifetime partial payments, confirmed outstanding and expected fee',()=>{
 const properties=[{id:'p1',dealType:'sale',receivedDate:'2026-08-20'}],customers=[{id:'c1',firstContactDate:'2026-09-01',source:'소개'}],deals=[{id:'d1',propertyId:'p1',buyerIds:['c1'],stage:'contract',contractDate:'2026-09-05',feeDueDate:'2026-09-10',confirmedFee:3000000,expectedFee:4000000,coBrokerAmount:500000},{id:'paused',stage:'hold',contractDate:'2026-09-01',confirmedFee:100000000,expectedFee:100000000},{id:'stopped',stage:'stopped',contractDate:'2026-09-01',confirmedFee:100000000}];
 const receipts=[{dealId:'d1',date:'2026-08-31',amount:500000},{dealId:'d1',date:'2026-09-06',amount:1000000}];
 const result=estateStatistics({properties,customers,deals,receipts,visits:[{date:'2026-09-02',status:'done',customerIds:['c1']},{date:'2026-09-03',status:'cancelled',customerIds:['c1']}]},{from:'2026-09-01',to:'2026-09-30'});
 assert.equal(result.contracts,1);assert.equal(result.received,1000000);assert.equal(result.outstanding,1500000);assert.equal(result.expected,4000000);assert.equal(result.coBrokerAmount,500000);assert.equal(result.averageDays,16);assert.deepEqual(result.funnel,{inquiry:1,visit:1,contract:1});assert.equal(result.bySource[0].contracts,1);
 assert.match(result.basis,/분할/);assert.match(result.basis,/보류/);
});
test('customer creation timestamps provide a real local date when first-contact date is unset',()=>{
 const createdAt=new Date(2026,8,8,12,0).getTime(),result=estateStatistics({customers:[{id:'c1',createdAt,source:'소개'}]},{from:'2026-09-01',to:'2026-09-30'});
 assert.equal(result.funnel.inquiry,1);assert.equal(result.bySource[0].customers,1);
});
test('empty statistics do not fabricate samples, averages or conversions',()=>{
 const result=estateStatistics();assert.equal(result.contracts,0);assert.equal(result.received,0);assert.equal(result.averageDays,null);assert.deepEqual(result.byType,[]);assert.deepEqual(result.bySource,[]);assert.equal(result.sampleSize.duration,0);
});
test('calendar links stable sources, excludes inactive data and avoids duplicate generated deal follow-up',()=>{
 const source={tasks:[{id:'deal-d1',date:'2026-09-09',title:'후속 연락',status:'open',sourceKind:'deals',sourceId:'d1'},{id:'cancelled',date:'2026-09-09',status:'cancelled'},{id:'finished',date:'2026-09-09',status:'done'}],deals:[{id:'d1',title:'거래',stage:'preparation',dueDate:'2026-09-09',nextAction:'후속 연락',contractDate:'2026-09-20'}],visits:[{id:'v1',date:'2026-09-08',time:'14:00',status:'scheduled'}]};
 const first=calendarRows(source);assert.equal(first.filter(r=>r.title==='후속 연락').length,1);assert.equal(first.length,3);
 source.visits[0].date='2026-09-10';const changed=calendarRows(source);assert.equal(first.find(r=>r.sourceKind==='visits').id,changed.find(r=>r.sourceKind==='visits').id);assert.ok(changed.every(r=>r.category==='estate'&&r.readOnly===true));
 assert.ok(changed.every(r=>!('phone'in r)&&!('internalMemo'in r)));
});
test('public property projection only contains explicit fields, selected photo ids and deliberate address switches',()=>{
 const raw={...property,ownerUid:'SECRET-UID',ownerCustomerId:'SECRET-ID',keyMemo:'SECRET-KEY',internalMemo:'SECRET-MEMO',coBrokerInfo:'SECRET-CONTACT',history:[{price:'SECRET-HISTORY'}],address:'EXACT-ADDRESS',detailAddress:'EXACT-DETAIL',buildingUnit:'EXACT-BUILDING',unit:'EXACT-UNIT',publicDescription:'공개 설명',photos:[{mediaId:'approved',thumbId:'PRIVATE-THUMB',name:'PRIVATE-FILENAME'},{mediaId:'unselected'}],mediaIds:['PRIVATE-DOCUMENT']};
 let result=publicProperty(raw,{photos:{p1:['approved']}}),json=JSON.stringify(result);assert.ok(!json.includes('SECRET'));assert.ok(!json.includes('PRIVATE'));assert.ok(!json.includes('EXACT'));assert.equal(result.managementFee,0);assert.deepEqual(result.photos,[{mediaId:'approved'}]);
 result=publicProperty(raw,{showAddress:true,showUnit:true,photos:{}});assert.equal(result.address,'EXACT-ADDRESS');assert.equal(result.unit,'EXACT-UNIT');assert.deepEqual(result.photos,[]);
});

test('co-broker source, progress, legacy memo and structured contacts are private for every public projection mode',()=>{
 const privateFields={coBroker:true,coBrokerInfo:'PRIVATE-LEGACY',coBrokerSource:'partner',coBrokerStage:'active',coBrokers:[{id:'PRIVATE-ID',office:'PRIVATE-OFFICE',name:'PRIVATE-NAME',phone:'PRIVATE-PHONE',role:'both',terms:'PRIVATE-TERMS'}]};
 for(const showAddress of [false,true])for(const showUnit of [false,true]){
  const result=publicProperty({...property,...privateFields},{showAddress,showUnit});
  for(const key of Object.keys(privateFields))assert.equal(Object.hasOwn(result,key),false,key);
  assert.ok(!JSON.stringify(result).includes('PRIVATE-'));
 }
});

async function clientFixture(t,fetcher){
 const priorWindow=globalThis.window,priorFetch=globalThis.fetch;let uid='first-owner';globalThis.window={AiderDearFirebase:{getState:()=>({user:uid?{uid,email:'qhals5060@gmail.com'}:null}),getFirebaseIdToken:async()=>`token-${uid}`}};globalThis.fetch=fetcher;
 t.after(()=>{globalThis.window=priorWindow;globalThis.fetch=priorFetch;});return {client:createEstateClient(),setUser(value){uid=value;}};
}
test('client retry uses identical operation ID and rejects account change during network response',async t=>{
 const payloads=[];let failOnce=true,fixture;
 fixture=await clientFixture(t,async(url,init)=>{payloads.push(init.body);if(failOnce){failOnce=false;throw Error('isolated network interruption');}return {ok:true,json:async()=>({row:{id:'p1'}})};});
 await fixture.client.call('save',{collection:'properties',id:'p1',row:{title:'test'},expectedRevision:0});assert.equal(payloads.length,2);assert.equal(payloads[0],payloads[1]);
 globalThis.fetch=async()=>{fixture.setUser('second-owner');return {ok:true,json:async()=>({row:{private:'first-owner record'}})};};await assert.rejects(fixture.client.call('get',{collection:'properties',id:'p1'}),/계정/);
});
test('client rejects account switch during final file digest, before creating an object URL',async t=>{
 const bytes=Buffer.from('image bytes'),encoded=bytes.toString('base64');let fixture;
 fixture=await clientFixture(t,async(url,init)=>({ok:true,json:async()=>{const action=JSON.parse(init.body).action;return action==='mediaInfo'?{id:'image1',name:'private.png',type:'image/png',size:bytes.length,chunkBytes:100,sha256:'00'.repeat(32)}:{data:encoded};}}));
 t.mock.method(crypto.subtle,'digest',async()=>{fixture.setUser('second-owner');return new Uint8Array(32).buffer;});
 await assert.rejects(fixture.client.image('image1'),/계정/);
});
