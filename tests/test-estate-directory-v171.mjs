// Directory UI contract regression harness. No production or external API writes.
// Uses the real module, controller field helper and backend entity validation.
// The minimal DOM double checks callbacks/data/markup, not layout or browser behavior.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { installDirectory } from '../estate-directory-v171.js';
import { entity } from '../server/estate-model.mjs';
const esc=x=>String(x??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const controller=fs.readFileSync(new URL('../estate-v171.js',import.meta.url),'utf8'),start=controller.indexOf('field(name,label'),end=controller.indexOf('\n    form(',start);
assert(start>=0&&end>start);
const field=Function('esc','return ({'+controller.slice(start,end)+'}).field')(esc);
class El {
 constructor(){this.children=new Map;this.listeners={};this.dataset={};this.classList={add(){}};this.isConnected=true;this.hidden=false;this.value='';this.checked=false;this.multi={};this.elements=new Proxy({}, {get:(o,k)=>o[k]??=(new El)});}
 querySelector(s){if(!this.children.has(s))this.children.set(s,new El);return this.children.get(s);}
 querySelectorAll(){return [];}
 addEventListener(t,f){(this.listeners[t]??=[]).push(f);}
 dispatchEvent(e){for(const f of this.listeners[e.type]||[])f(e);return true;}
 setAttribute(k,v){this[k]=v;}
 async fire(t,e={}){for(const f of this.listeners[t]||[])await f(e);}
}
globalThis.CSS={escape:String};
globalThis.FormData=class {constructor(form){this.form=form;}getAll(k){return this.form.multi[k]||[];}};
let form,callback,html,saved,records=[],page=[],calls=[],searchPage={results:[],cursor:null};
const views=new Map,editors=new Map;
const app={
 esc,field,money:n=>n.toLocaleString('ko-KR')+'원',today:()=> '2026-09-08',uid:()=> 'qa-owner',
 registerView:(k,f)=>views.set(k,f),registerEntity:(k,f)=>editors.set(k,f),
 form:(container,markup,onSave)=>{html=markup;form=new El;form.isConnected=false;callback=onSave;return form;},
 save:async(k,row)=>{saved={...row,...entity(k,row),revision:(row.revision||0)+1};return saved;},
 list:async(k,o)=>{calls.push(['list',k,o]);return {rows:page,cursor:page.length===50?'page-2':null};},
 options:()=>records,pickOptions:async()=>records,lookup:async()=>null,notice:()=>{},open:()=>{},
 api:{call:async(a,p)=>{calls.push([a,p]);return a==='search'?searchPage:{rows:[],cursor:null};},image:async()=>'',upload:async()=>{}}
};
installDirectory(app);
let checks=0;const pass=(v)=>{assert(v);checks++;};
pass(views.size===2&&editors.size===4);
const blankProperty={title:'실제 양식 QA',propertyType:'commercial',dealType:'jeonse',status:'active',parking:'unknown',elevator:'unknown',pets:'unknown',price:'',deposit:'200000000',rent:'0',area:'83.5',floor:'-1',premium:'0',facilities:'기존 시설 보존',landCategory:'기존 토지값'};
await editors.get('properties')({container:new El,row:{id:'qa-property',revision:0},isNew:true});
pass(html.includes('매매 금액 (원)')&&html.includes('전세 / 월세 보증금 (원)'));
pass(html.includes('data-property-section="commercial"')&&html.includes('data-property-section="land"')&&!html.includes('disabled'));
form.elements.negotiable.checked=true;form.elements.availableNegotiable.checked=false;form.elements.coBroker.checked=true;
await callback(blankProperty,form);
pass(saved.price===null&&saved.deposit===200000000&&saved.rent===0&&saved.floor===-1&&saved.area===83.5);
pass(saved.negotiable===true&&saved.availableNegotiable===false&&saved.coBroker===true);
pass(saved.facilities==='기존 시설 보존'&&saved.landCategory==='기존 토지값');
await assert.rejects(callback({...blankProperty,deposit:'not-a-number'},form));checks++;
await editors.get('properties')({container:new El,row:{id:'qa-photo',revision:0,photos:[{mediaId:'photo-a',thumbId:'thumb-a',name:'A'},{mediaId:'photo-b',thumbId:'thumb-b',name:'B'}]},isNew:true});
const grid=form.querySelector('[data-photo-grid]');
await grid.fire('click',{target:{closest:()=>({dataset:{photoIndex:'1',photoAction:'cover'}})}});
await callback(blankProperty,form);pass(saved.photos[0].mediaId==='photo-b'&&saved.photos[1].mediaId==='photo-a');
await grid.fire('click',{target:{closest:()=>({dataset:{photoIndex:'1',photoAction:'remove'}})}});
await callback(blankProperty,form);pass(saved.photos.length===1&&saved.photos[0].mediaId==='photo-b');
pass(calls.some(x=>x[0]==='mediaDelete'&&x[1].id==='photo-a')&&calls.some(x=>x[0]==='mediaDelete'&&x[1].id==='thumb-a'));
await editors.get('customers')({container:new El,row:{id:'qa-customer',revision:0},isNew:true});
form.multi={roles:['seller','buyer'],required:['region','deposit'],flexible:['pets'],dealTypes:['jeonse','rent'],propertyTypes:['apartment','commercial']};
const customer={name:'고객 QA',phone:'010-0000-0000',regions:'서울, 서울\n수원',excludedRegions:'제외동',priceMax:'',depositMax:'500000000',moveInFrom:'2026-09-08',moveInTo:'2026-09-20',parking:'unknown',elevator:'yes',pets:'negotiable'};
await callback(customer,form);pass(saved.roles.length===2&&saved.required.length===2&&saved.flexible[0]==='pets'&&saved.dealTypes.length===2);
pass(saved.regions.join(',')==='서울,수원'&&saved.priceMax===null&&saved.depositMax===500000000);
await assert.rejects(callback({...customer,moveInTo:'2026-09-01'},form));checks++;
form.multi.roles=[];await assert.rejects(callback(customer,form));checks++;
form.multi.roles=['buyer'];form.multi.flexible=['region'];await assert.rejects(callback(customer,form));checks++;
await editors.get('consultations')({container:new El,row:{id:'qa-consult',revision:0,method:'고객 기존 입력 방법'},isNew:true});
pass(html.includes('고객 기존 입력 방법')&&html.includes('selected'));
await callback({customerId:'qa-customer',propertyId:'qa-property',date:'2026-09-08',method:'전화',content:'상담 내용',nextAction:'재연락',dueDate:'2026-09-09',priority:'high'},form);
pass(saved.nextAction==='재연락'&&saved.dueDate==='2026-09-09'&&saved.customerId==='qa-customer');
await assert.rejects(callback({date:'2026-09-08',content:'없음'},form));checks++;
await editors.get('proposals')({container:new El,row:{id:'qa-proposal',revision:0},isNew:true});
await assert.rejects(callback({customerId:'qa-customer',date:'2026-09-08'},form));checks++;
await callback({customerId:'qa-customer',propertyId:'qa-property',date:'2026-09-08',status:'interested',notes:'실제 고객 반응'},form);
pass(saved.status==='interested'&&saved.propertyId==='qa-property');
page=Array.from({length:50},(_,i)=>({id:'p-'+i,title:'매물 '+i,dealType:'jeonse',deposit:200000000,price:999,status:'active',floor:3,confirmedDate:'2026-09-07'}));records=[];
const container=new El;await views.get('properties')({container});
pass(container.querySelector('[data-directory-range]').textContent.includes('50개'));
pass(container.querySelector('[data-directory-results]').innerHTML.includes('전세 200,000,000원')&&!container.querySelector('[data-directory-results]').innerHTML.includes('999원'));
pass(calls.some(x=>x[0]==='list'&&x[2].limit===50));
await container.querySelector('[name="directoryStatus"]').fire('change',{target:{value:'ended'}});
pass(container.querySelector('[data-directory-results]').innerHTML.includes('조건과 일치하는 자료가 없습니다'));
await container.querySelector('[data-directory-query]').fire('input',{target:{value:'범위밖'}});
searchPage={results:[{id:'c-remote',collection:'customers',label:'다른 종류'},{id:'p-remote',collection:'properties',label:'범위밖 매물',subtitle:'검색'}],cursor:'scan-2'};
await container.querySelector('[data-directory-global]').fire('click');
pass(container.querySelector('[data-directory-results]').innerHTML.includes('범위밖 매물')&&!container.querySelector('[data-directory-results]').innerHTML.includes('다른 종류'));
pass(container.querySelector('[data-directory-range]').textContent.includes('다음 검색 범위'));
// Real rendered-list event paths: null is unknown, zero remains a real value.
app.uid=()=> 'qa-detail-filters';records=[];
page=[
 {id:'sale-zero',title:'Zero',dealType:'sale',price:0,deposit:999,area:0,availableDate:'2026-09-08',confirmedDate:'2026-09-08',status:'active',propertyType:'house'},
 {id:'sale-boundary',title:'Sale',dealType:'sale',price:100,deposit:999,area:50,availableDate:'2026-09-10',confirmedDate:'2026-09-01',status:'active'},
 {id:'jeonse-boundary',title:'Jeonse',dealType:'jeonse',price:999,deposit:100,area:50,availableDate:'2026-09-10',confirmedDate:'2026-08-09',status:'active'},
 {id:'rent-low',title:'Rent low',dealType:'rent',deposit:100,rent:50,area:55,availableDate:'2026-09-11',availableNegotiable:true,confirmedDate:'2026-08-08',status:'active'},
 {id:'rent-high',title:'Rent high',dealType:'rent',deposit:200,rent:150,area:70,availableDate:'',availableNegotiable:true,confirmedDate:'',status:'active'},
 {id:'unknown-price',title:'Unknown',dealType:'sale',price:null,area:null,availableDate:'',confirmedDate:'2026-09-09',status:'active'},
 {id:'unknown-rent',title:'Missing rent',dealType:'rent',deposit:100,rent:null,area:' ',availableDate:'2026-09-12',confirmedDate:'invalid',status:'active'},
 {id:'unknown-deal',title:'Unknown deal',dealType:'',price:0,deposit:0,area:0,availableDate:'',confirmedDate:'',status:'active'}
];
const filters=new El;await views.get('properties')({container:filters});
const shown=()=>[...(filters.querySelector('[data-directory-results]').innerHTML||'').matchAll(/data-directory-open="([^"]+)"/g)].map(match=>match[1]).sort();
const reset=()=>filters.querySelector('[data-directory-reset]').fire('click');
const filter=async(name,value)=>filters.querySelector(`[name="${name}"]`).fire(['directoryPriceMin','directoryPriceMax','directoryRentMax','directoryAreaMin'].includes(name)?'input':'change',{target:{value}});
pass(filters.querySelector('[data-directory-results]').innerHTML.includes('estate-directory-table')&&!filters.querySelector('[data-directory-results]').innerHTML.includes('estate-directory-property-card'));
pass(!/<details class="estate-directory-advanced"[^>]*\bopen\b/.test(filters.innerHTML));
pass(filters.innerHTML.includes('중개 중')&&filters.innerHTML.includes('중개 종료')&&filters.innerHTML.includes('빌라·주택')&&filters.innerHTML.includes('상가·사무실'));
await filter('directoryPriceMin','0');await filter('directoryPriceMax','0');pass(shown().join(',')==='sale-zero');
await reset();await filter('directoryPriceMin','100');await filter('directoryPriceMax','100');pass(shown().join(',')==='jeonse-boundary,rent-low,sale-boundary,unknown-rent');
await reset();await filter('directoryRentMax','50');pass(shown().includes('rent-low')&&!shown().includes('rent-high')&&!shown().includes('unknown-rent')&&shown().includes('sale-zero'));
await reset();await filter('directoryAreaMin','0');pass(shown().includes('sale-zero')&&shown().includes('unknown-deal')&&!shown().includes('unknown-price')&&!shown().includes('unknown-rent'));
await filter('directoryAreaMin','50');pass(shown().join(',')==='jeonse-boundary,rent-high,rent-low,sale-boundary');
await reset();await filter('directoryAvailableBy','2026-09-10');pass(shown().join(',')==='jeonse-boundary,sale-boundary,sale-zero');
await reset();await filter('directoryAvailability','negotiable');pass(shown().join(',')==='rent-high,rent-low');
await filter('directoryAvailableBy','2026-09-10');pass(shown().length===0);
await reset();await filter('directoryAvailability','unknown');pass(shown().join(',')==='unknown-deal,unknown-price');
await reset();await filter('directoryAvailability','confirmed');pass(shown().join(',')==='jeonse-boundary,sale-boundary,sale-zero,unknown-rent');
await reset();await filter('directoryConfirmed','week');pass(shown().join(',')==='sale-boundary,sale-zero');
await filter('directoryConfirmed','stale');pass(shown().join(',')==='rent-high,rent-low,unknown-deal,unknown-rent');
app.today=()=> '2026-09-09';await filter('directoryConfirmed','week');pass(shown().join(',')==='sale-zero,unknown-price');app.today=()=> '2026-09-08';
await reset();await filter('directoryPriceMin','200');await filter('directoryPriceMax','100');pass(shown().length===0&&filters.querySelector('[data-directory-range]').textContent.includes('최소 가격'));
await reset();await filter('directoryPriceMin','-1');pass(shown().length===0&&filters.querySelector('[data-directory-range]').textContent.includes('0 이상의'));
await reset();pass(shown().length===8&&filters.querySelector('[data-directory-detail-count]').textContent==='가격 · 면적 · 입주 · 확인일');
await filter('directoryPriceMin','100');await filters.querySelector('[data-directory-advanced]').fire('toggle',{target:{open:true}});
const reopened=new El;await views.get('properties')({container:reopened});pass(/<details class="estate-directory-advanced"[^>]*\bopen\b/.test(reopened.innerHTML)&&reopened.innerHTML.includes('name="directoryPriceMin" type="number" value="100"'));
// Filtering a loaded page never implies that unloaded owner records were searched.
app.uid=()=> 'qa-filter-pagination';const firstPage=Array.from({length:50},(_,i)=>({id:'range-'+i,title:'First range',dealType:'sale',price:999}));
app.list=async(k,o)=>{calls.push(['list',k,o]);return o.cursor?{rows:[{id:'last-range-match',title:'Later range',dealType:'sale',price:123}],cursor:null}:{rows:firstPage,cursor:'last-range'};};
const paged=new El;await views.get('properties')({container:paged});
await paged.querySelector('[name="directoryPriceMin"]').fire('input',{target:{value:'123'}});await paged.querySelector('[name="directoryPriceMax"]').fire('input',{target:{value:'123'}});
pass(paged.querySelector('[data-directory-range]').textContent.includes('50개 중 0개')&&paged.querySelector('[data-directory-range]').textContent.includes('아직 불러오지 않은'));
await paged.querySelector('[data-directory-more]').fire('click');pass(paged.querySelector('[data-directory-results]').innerHTML.includes('last-range-match')&&paged.querySelector('[data-directory-range]').textContent.includes('51개 중 1개'));
// Reset invalidates an in-flight global search as well as clearing detail fields.
let finishSearch;app.api.call=async(action)=>action==='search'?await new Promise(resolve=>finishSearch=resolve):{rows:[]};
await paged.querySelector('[data-directory-query]').fire('input',{target:{value:'old-query'}});const pendingSearch=paged.querySelector('[data-directory-global]').fire('click');await paged.querySelector('[data-directory-reset]').fire('click');finishSearch({results:[{id:'stale-search',collection:'properties',label:'Must stay cleared'}],cursor:null});await pendingSearch;
pass(!paged.querySelector('[data-directory-results]').innerHTML.includes('stale-search')&&paged.querySelector('[data-directory-range]').textContent.includes('불러온'));
console.log(JSON.stringify({passed:checks,scope:'Real directory module + real controller field helper + real backend entity validation; lightweight DOM contract harness, not browser/production API'},null,2));
