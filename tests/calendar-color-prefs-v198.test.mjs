import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {googleColorState,colorGoogleRows} from '../server/calendar-color-prefs-v198.mjs';
import {mergeProviderRows,sameRows} from '../server/calendar-rows-v184.mjs';
const helper=globalThis.AiderCalendarColorsV198;
const calendars=[{id:'work@example.test',backgroundColor:'#4285F4'},{id:'home@example.test',backgroundColor:'#4285F4'},{id:'study@example.test',backgroundColor:'#4285F4'}];
const plain=value=>JSON.parse(JSON.stringify(value));
const source=fs.readFileSync(new URL('../api/calendar-sync.mjs',import.meta.url),'utf8');
function extracted(name,next){const start=source.indexOf(`async function ${name}(`),end=source.indexOf(`\n${next}`,start);assert(start>=0&&end>start);return source.slice(start,end)}

test('known calendars receive stable distinct automatic colors independent of Google metadata/order',()=>{
 const first=googleColorState(calendars),again=googleColorState([...calendars].reverse(),first);
 assert.equal(new Set(Object.values(first.colors)).size,3);assert.deepEqual(again,first);
 assert(helper.palette.some(row=>row.label==='브라운'));assert(helper.palette.some(row=>row.label==='코코아'));
});
test('manual colors merge sparsely, reset removes the override, and unknown calendar IDs are ignored',()=>{
 const first=googleColorState(calendars,{}, {'work@example.test':'#966b4b','home@example.test':'#765545','unknown':'#000000'});
 assert.equal(first.colors['work@example.test'],'#966B4B');assert(!('unknown' in first.calendarColorOverrides));
 const reset=googleColorState(calendars,first,{'work@example.test':''});assert(!('work@example.test' in reset.calendarColorOverrides));assert.equal(reset.colors['home@example.test'],'#765545');
 const preserved=googleColorState(calendars,reset);assert.deepEqual(preserved.calendarColorOverrides,reset.calendarColorOverrides);
 assert.throws(()=>googleColorState(calendars,{}, {'work@example.test':'url(javascript:x)'}),/HEX/);
 assert.throws(()=>googleColorState(calendars,{}, []),/설정/);
});
test('preferences are bounded and special property names remain data',()=>{
 assert.throws(()=>googleColorState(calendars,{},Object.fromEntries(Array.from({length:501},(_,i)=>['id'+i,'#966B4B']))),/설정/);
 const state=googleColorState([{id:'__proto__'},{id:'constructor'}],{},JSON.parse('{"__proto__":"#966B4B","constructor":"#765545"}'));
 assert.equal(state.colors.__proto__,'#966B4B');assert.equal(state.colors.constructor,'#765545');assert.equal({}.polluted,undefined);
});
test('recolor updates retained dates without losing content/sharing or affecting other providers',()=>{
 const old={id:'old',calendarId:'google:work@example.test',externalSource:'google',date:'2000-01-01',sourceColor:'#4285F4',owner:'shared',shareWithCouple:true,unknown:{keep:1}},local={id:'local',calendarId:'firebase-main',title:'mine'},notion={id:'notion',externalSource:'notion',sourceColor:'#000000'};
 const before=structuredClone([old,local,notion]),rows=colorGoogleRows(before,googleColorState(calendars,{}, {'work@example.test':'#966B4B'}));
 assert.equal(rows[0].sourceColor,'#966B4B');assert.equal(rows[0].sourceColorVersion,198);assert.deepEqual(rows[0].unknown,{keep:1});assert(rows[0].shareWithCouple);assert.equal(rows[1],before[1]);assert.equal(rows[2],before[2]);assert.equal(old.sourceColor,'#4285F4');
});
test('calendars list returns display colors and preferences without writing or mutating Google metadata',async()=>{
 const data={calendarColorOverrides:{'work@example.test':'#966B4B'}},context={googleAccess:async()=>({data}),availableGoogleCalendars:async()=>calendars,selectedGoogleCalendars:()=>[calendars[0]],googleColorState,cleanText:v=>String(v)};
 vm.createContext(context);vm.runInContext(extracted('googleCalendarChoices','async function syncGoogle'),context);const result=await context.googleCalendarChoices('alice');
 assert.equal(result.calendars[0].displayColor,'#966B4B');assert.equal(result.calendars[0].backgroundColor,'#4285F4');assert.equal(result.calendarColorOverrides['work@example.test'],'#966B4B');assert.equal(calendars[0].displayColor,undefined);
});
test('configure transaction merges latest owner preferences, resets actual map keys, and preserves unrelated fields',async()=>{
 const ref='users/alice/integrations/google',writes=[];let current={refreshToken:'private fixture',calendarColorOverrides:{'work@example.test':'#966B4B','home@example.test':'#765545'},calendarAutoColors:{}};
 const context={googleAccess:async()=>({ref,data:{calendarColorOverrides:{}}}),availableGoogleCalendars:async()=>calendars,googleColorState,FieldValue:{serverTimestamp:()=>42},db:{runTransaction:async fn=>fn({get:async r=>{assert.equal(r,ref);return {exists:true,data:()=>current}},set:(r,value,options)=>{writes.push({r,value,options});current={...current,...value}}})},syncGoogle:async()=>({itemCount:1}),watchGoogle:async()=>{}};
 vm.createContext(context);vm.runInContext(extracted('configureGoogle','function notionValue'),context);await context.configureGoogle('alice',['work@example.test'],{'work@example.test':''});
 assert.equal(current.refreshToken,'private fixture');assert(!('work@example.test' in current.calendarColorOverrides));assert.equal(current.calendarColorOverrides['home@example.test'],'#765545');assert.deepEqual(plain(writes[0].options.mergeFields),['selectedCalendarIds','calendarColorOverrides','calendarAutoColors','updatedAt']);
});
test('late old sync uses latest saved color including outside-window rows and does not overwrite new selection',async()=>{
 const old={id:'old',externalSource:'google',calendarId:'google:work@example.test',date:'2000-01-01',sourceColor:'#4285F4',extra:'keep'},incoming={id:'current',externalSource:'google',calendarId:'google:work@example.test',date:'2026-09-27',sourceColor:'#7864AD',sourceColorVersion:198};
 const data={selectedCalendarIds:['home@example.test'],calendarColorOverrides:{'work@example.test':'#966B4B'}};let saved,mirrors=0;const writes=[];
 const context={mergeProviderRows,sameRows,googleColorState,colorGoogleRows,decodeArchive:v=>v,encodeStoredPayload:v=>v,getAuth:()=>({getUser:async()=>({email:'alice@example.test'})}),scheduleRef:uid=>'schedule/'+uid,integrationRef:(uid,p)=>'integration/'+uid+'/'+p,FieldValue:{serverTimestamp:()=>42},mirrorSharedSchedule:async()=>mirrors++,db:{runTransaction:async fn=>fn({get:async ref=>({exists:true,data:()=>ref==='schedule/alice'?{payload:[old,{id:'local',title:'local'}]}:data}),set:(ref,value)=>{writes.push({ref,value});if(ref==='schedule/alice')saved=value.payload}})}};
 vm.createContext(context);vm.runInContext(extracted('replaceProviderRows','async function removeProviderRows'),context);
 await context.replaceProviderRows('alice','google',[incoming],{from:'2025-01-01',to:'2028-01-01',calendarIds:['google:work@example.test'],selectedCalendarIds:['work@example.test'],colorCalendars:calendars});
 assert(saved.filter(row=>row.externalSource==='google').every(row=>row.sourceColor==='#966B4B'&&row.sourceColorVersion===198));assert.equal(saved.find(row=>row.id==='old').extra,'keep');assert(saved.some(row=>row.id==='local'));assert.equal(mirrors,1);assert(!writes.some(row=>row.value.selectedCalendarIds));assert(!writes.some(row=>row.value.calendarColorOverrides));
});
test('unchanged colored refresh writes no schedule or color-preference documents',async()=>{
 const state=googleColorState(calendars),raw={id:'same',externalSource:'google',calendarId:'google:work@example.test',date:'2026-09-27',sourceColor:state.colors['work@example.test'],sourceColorVersion:198,updatedAt:1};const previous=mergeProviderRows([],'google',[raw],'alice','alice@example.test'),writes=[];
 const context={mergeProviderRows,sameRows,googleColorState,colorGoogleRows,decodeArchive:v=>v,encodeStoredPayload:v=>v,getAuth:()=>({getUser:async()=>({email:'alice@example.test'})}),scheduleRef:uid=>'schedule/'+uid,integrationRef:(uid,p)=>'integration/'+uid+'/'+p,FieldValue:{serverTimestamp:()=>42},mirrorSharedSchedule:async()=>assert.fail('unchanged mirror'),db:{runTransaction:async fn=>fn({get:async ref=>({exists:true,data:()=>ref==='schedule/alice'?{payload:previous}:{...state,selectedCalendarIds:['work@example.test']}}),set:(ref,value)=>writes.push({ref,value})})}};
 vm.createContext(context);vm.runInContext(extracted('replaceProviderRows','async function removeProviderRows'),context);assert.equal(await context.replaceProviderRows('alice','google',[raw],{calendarIds:['google:work@example.test'],colorCalendars:calendars}),false);assert.deepEqual(writes,[]);
});
test('post-fetch integration status never writes stale selection or color preferences',()=>{
 const sync=extracted('syncGoogle','function nextDate');const status=sync.slice(sync.lastIndexOf('await connection.ref.set'));
 assert.doesNotMatch(status.split('return {')[0],/calendarAutoColors|calendarColorOverrides|selectedCalendarIds[,}]/);
});
