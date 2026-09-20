import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createCalendarSyncClient,restoredCalendarStatus,CALENDAR_REFRESH_MS} from '../calendar-sync-v184.js';
import {mergeProviderRows,sameRows} from '../server/calendar-rows-v184.mjs';
function fixture(overrides={}){
 let uid='alice',clock=1000,visible=true,online=true;
 const requests=[],launches=[];
 const client=createCalendarSyncClient({getUser:()=>uid?{uid}:null,getToken:async()=> 'test-token',now:()=>clock,visible:()=>visible,online:()=>online,bridge:()=>null,navigate:url=>launches.push(url),fetch:async(url,options)=>{requests.push({url,payload:JSON.parse(options.body)});return {ok:true,json:async()=>url.includes('action=status')?{google:{connected:true,serverMode:true,lastSyncedAt:1}}:url.includes('action=start')?{url:'https://accounts.google.com/o/oauth2/v2/auth?state=test'}:{itemCount:7,lastSyncedAt:clock}}},...overrides});
 return {client,requests,launches,tick:ms=>clock+=ms,user:value=>uid=value,visible:value=>visible=value,online:value=>online=value};
}
test('launch/resume imports once, throttles foreground events, and skips hidden/offline work',async()=>{
 const f=fixture();assert.equal((await f.client.refresh()).google.itemCount,7);assert.equal(f.requests.length,2);
 await f.client.refresh();assert.equal(f.requests.length,2);
 f.tick(CALENDAR_REFRESH_MS);f.visible(false);await f.client.refresh();assert.equal(f.requests.length,2);
 f.visible(true);f.online(false);await f.client.refresh();assert.equal(f.requests.length,2);
 f.online(true);await f.client.refresh();assert.equal(f.requests.length,4);
});
test('OAuth launches native external browser and resume bypasses pre-connect cooldown',async()=>{
 const launches=[],f=fixture({bridge:()=>({openCalendarAuth:url=>{launches.push(url);return true;}})});
 await f.client.refresh();await f.client.connect();assert.equal(launches.length,1);assert.equal(f.requests.at(-1).payload.native,true);
 await f.client.refresh();assert.equal(f.requests.filter(row=>row.url.includes('action=status')).length,2);
});
test('invalid authorization target never navigates or launches native browser',async()=>{
 const f=fixture({fetch:async()=>({ok:true,json:async()=>({url:'https://attacker.example/auth'})})});
 await assert.rejects(f.client.connect(),/연결 주소/);assert.equal(f.launches.length,0);
});
test('pending refresh is shared and stale account response is rejected',async()=>{
 let resolve;const f=fixture({fetch:()=>new Promise(r=>resolve=r)});
 const one=f.client.refresh(),two=f.client.refresh();await Promise.resolve();
 f.user('bob');resolve({ok:true,json:async()=>({google:{connected:true,serverMode:true}})});
 await assert.rejects(one,/계정이 변경/);await assert.rejects(two,/계정이 변경/);
});

test('quota failure pauses automatic calendar requests for 30 minutes and account changes clear the pause',async()=>{
 let calls=0;const f=fixture({fetch:async()=>{calls++;return {ok:false,status:503,json:async()=>({code:'resource-exhausted',error:'Firebase 무료 사용량 한도'})}}});
 await assert.rejects(f.client.refresh(),e=>e.code==='resource-exhausted');assert.equal(calls,1);
 f.tick(CALENDAR_REFRESH_MS);await f.client.refresh();assert.equal(calls,1);
 await assert.rejects(f.client.refresh({force:true}),e=>e.code==='resource-exhausted');assert.equal(calls,1);
 f.tick(30*60*1000);await assert.rejects(f.client.refresh());assert.equal(calls,2);
 f.user('bob');await assert.rejects(f.client.refresh());assert.equal(calls,3);
});
test('revoked server connection is not represented as live by a cached import',()=>{
 assert.equal(restoredCalendarStatus({connected:false,serverMode:true},true).connected,false);
 assert.equal(restoredCalendarStatus({},true).needsReconnect,true);
 const connected=restoredCalendarStatus({connected:true,serverMode:true,selectedCalendarIds:['primary']},true);
 assert.equal(connected.clientMode,false);assert.equal(connected.needsReconnect,false);
});
test('server merge preserves concurrent local records, replaces deleted imports and deduplicates',()=>{
 const local={id:'local',title:'saved during remote fetch',owner:'shared',pairKey:'pair1'};
 const previous=[local,{id:'old-google',externalSource:'google'},{id:'live',externalSource:'google',createdAt:42}];
 const row={id:'live',externalSource:'google',date:'2026-09-20',updatedAt:84,title:'Changed'};
 const merged=mergeProviderRows(previous,'google',[row,row],'alice','a@example.test');
 assert.equal(merged.length,2);assert.equal(merged[0],local);assert.equal(merged[1].createdAt,42);assert.equal(merged[1].title,'Changed');
 assert.equal(sameRows(merged,mergeProviderRows(merged,'google',[row],'alice','a@example.test')),true);
});
const source=fs.readFileSync(new URL('../api/calendar-sync.mjs',import.meta.url),'utf8');
function sourceFunction(name,next){const a=source.indexOf(`async function ${name}(`),b=source.indexOf(`\n${next}`,a);assert(a>=0&&b>a);return source.slice(a,b);}

test('Notion automatic sync reuses recent result but explicit sync still fetches and preserves records',async()=>{
 let fetches=0,writes=0;const now=Date.now(),context={Date,integrationRef:()=>({get:async()=>({data:()=>({accessToken:'fixture-token',sourceId:'db',itemCount:4,lastSyncedAt:{toMillis:()=>now}})}),set:async()=>{writes++}}),notionJson:async()=>{fetches++;return {results:[],has_more:false}},replaceProviderRows:async()=>{},FieldValue:{serverTimestamp:()=>now}};
 vm.createContext(context);vm.runInContext(sourceFunction('syncNotion','async function startConnection'),context);
 const result=await context.syncNotion('owner',{force:false});assert.equal(result.itemCount,4);assert.equal(result.unchanged,true);assert.equal(fetches,0);assert.equal(writes,0);
 await context.syncNotion('owner',{force:true});assert.equal(fetches,1);assert.equal(writes,1);
});
test('unchanged refresh commits no schedule writes or pair mirrors',async()=>{
 const row={id:'g',externalSource:'google',date:'2026-09-20',updatedAt:2};
 const previous=mergeProviderRows([],'google',[row],'alice','a@example.test');let writes=0,mirrors=0;
 const context={mergeProviderRows,sameRows,decodeArchive:value=>value,encodeStoredPayload:value=>value,getAuth:()=>({getUser:async()=>({email:'a@example.test'})}),scheduleRef:uid=>uid,FieldValue:{serverTimestamp:()=>1},mirrorSharedSchedule:async()=>mirrors++,db:{runTransaction:fn=>fn({get:async()=>({data:()=>({payload:previous})}),set:()=>writes++})}};
 vm.createContext(context);vm.runInContext(sourceFunction('replaceProviderRows','async function removeProviderRows'),context);
 assert.equal(await context.replaceProviderRows('alice','google',[row]),false);assert.equal(writes,0);assert.equal(mirrors,0);
 assert.equal(await context.replaceProviderRows('alice','google',[{...row,title:'edit'}]),true);assert.equal(writes,1);assert.equal(mirrors,1);
});
test('event pagination continues past 600 historical rows and includes the recent page',async()=>{
 const historical=Array.from({length:750},(_,i)=>({id:'old-'+i,start:{date:'2025-01-01'},end:{date:'2025-01-02'},updated:'2025-01-01T00:00:00Z'}));let pages=0;
 const context={URLSearchParams,Set,Date,cleanText:value=>String(value),endExclusiveToInclusive:()=> '2025-01-01',googleShareKey:(a,b)=>a+'::'+b,googleJson:async()=>++pages===1?{items:historical,nextPageToken:'recent'}:{items:[{id:'recent',start:{date:'2026-09-20'},end:{date:'2026-09-21'},updated:'2026-09-20T00:00:00Z'}]}};
 vm.createContext(context);vm.runInContext(sourceFunction('listGoogleEvents','async function availableGoogleCalendars'),context);
 const rows=await context.listGoogleEvents('token',{id:'primary'},'start','end');assert.equal(pages,2);assert.equal(rows.at(-1).googleEventId,'recent');
});
test('native callback contains no credentials and all bundled imports match',()=>{
 const start=source.indexOf('function nativeCalendarReturn'),end=source.indexOf('\nasync function status',start),context={};let body='';
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);context.nativeCalendarReturn({setHeader(){},end:value=>body=value},true);
 assert.match(body,/aiderlog:\/\/calendar-sync\?provider=google/);assert.doesNotMatch(body,/access_token|refresh_token|id_token|code=/);
 for(const file of ['calendar-sync-v184.js','firebase-app.js'])assert.equal(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),fs.readFileSync(new URL('../android-src/assets/'+file,import.meta.url),'utf8'));
});
test('late legacy app reads cannot restore stale Google events after current sync',()=>{
 const feature=fs.readFileSync(new URL('../android-src/assets/feature-system-v125.js',import.meta.url),'utf8');
 const start=feature.indexOf('  function applyGoogleRowsV184()'),end=feature.indexOf('\n  window.AiderCalendarSyncV184',start);
 const context={A:{scheduleEvents:[{id:'local'},{id:'deleted-remote',externalSource:'google'}]},googleRowsV184:{scope:'alice||',rows:[{id:'current',externalSource:'google'}]},calendarScopeKeyV184:state=>`${state?.user?.uid||''}|${state?.pair?.id||''}|${state?.partner?.uid||''}`,currentState:()=>({user:{uid:'alice'}})};
 vm.createContext(context);vm.runInContext(feature.slice(start,end),context);context.applyGoogleRowsV184();
 assert.deepEqual(Array.from(context.A.scheduleEvents,row=>row.id),['local','current']);
 context.currentState=()=>({user:{uid:'bob'}});context.A.scheduleEvents=[{id:'bob'}];context.applyGoogleRowsV184();assert.equal(context.A.scheduleEvents[0].id,'bob');
});
test('Google cached-token 401 refreshes server-side once and retries without browser consent',async()=>{
 let requests=0,refreshes=0,clears=0;
 const connection={uid:'alice',token:'expired',ref:{set:async()=>clears++}};
 const context={fetch:async(_url,options)=>{requests++;return {status:requests===1?401:200,ok:requests>1,json:async()=>requests===1?{error:{message:'expired'}}:{authorized:options.headers.Authorization}}},googleAccess:async()=>{refreshes++;return {...connection,token:'fresh'};}};
 vm.createContext(context);vm.runInContext(sourceFunction('googleJson','function googleShareKey'),context);
 const result=await context.googleJson(connection,'https://www.googleapis.com/calendar/v3/users/me/calendarList');
 assert.equal(requests,2);assert.equal(refreshes,1);assert.equal(clears,1);assert.equal(result.authorized,'Bearer fresh');
});
test('rejected refreshed token marks reauthorization once instead of retrying forever',async()=>{
 const saved=[],connection={uid:'alice',token:'expired',ref:{set:async row=>saved.push(row)}};let requests=0;
 const context={fetch:async()=>{requests++;return {status:401,ok:false,json:async()=>({error:{message:'revoked'}})}},googleAccess:async()=>({...connection,token:'still-rejected'})};
 vm.createContext(context);vm.runInContext(sourceFunction('googleJson','function googleShareKey'),context);
 await assert.rejects(context.googleJson(connection,'https://www.googleapis.com/calendar/v3/users/me/calendarList'),{code:'calendar/reconnect-required'});
 assert.equal(requests,2);assert.equal(saved.at(-1).connected,false);
});
test('shared Google result cannot be attributed to a new couple while its read is pending',async()=>{
 const feature=fs.readFileSync(new URL('../android-src/assets/feature-system-v125.js',import.meta.url),'utf8');
 const start=feature.indexOf('  async function refreshCalendarV184('),end=feature.indexOf('\n  function bindCalendarV184',start);let resolve,applied=0,state={user:{uid:'alice'},pair:{id:'before'},partner:{uid:'old-partner'}};
 const api={calendarSync:{refresh:async()=>({google:{connected:true}})},readScheduleData:()=>new Promise(done=>resolve=done)};
 const context={window:{AiderDearFirebase:api},currentState:()=>state,calendarScopeKeyV184:s=>`${s.user?.uid||''}|${s.pair?.id||''}|${s.partner?.uid||''}`,$:()=>null,applyGoogleRowsV184:()=>applied++,localStorage:{setItem:()=>{throw Error('must not publish stale rows');}},activePage:'event'};
 vm.createContext(context);vm.runInContext(feature.slice(start,end),context);const pending=context.refreshCalendarV184();await new Promise(setImmediate);assert.equal(typeof resolve,'function');state={user:{uid:'alice'},pair:{id:'after'},partner:{uid:'new-partner'}};resolve({own:[],shared:[{id:'private-old',externalSource:'google'}]});await pending;assert.equal(applied,0);
});
test('native resume refresh is wired and bridge accepts only the Google OAuth endpoint',()=>{
 const feature=fs.readFileSync(new URL('../android-src/assets/feature-system-v125.js',import.meta.url),'utf8');assert.match(feature,/addEventListener\('aiderlog-native-resume',\(\)=>refreshCalendarV184\(\)\)/);
 const smali=fs.readFileSync(new URL('../android-src/smali/MainActivity$NativeBridge.smali',import.meta.url),'utf8');const method=smali.slice(smali.indexOf('.method public openCalendarAuth'),smali.indexOf('.method public openEstateSite'));
 for(const required of ['JavascriptInterface','"https"','"accounts.google.com"','"/o/oauth2/v2/auth"','getUserInfo()','getPort()','android.intent.action.VIEW'])assert(method.includes(required));
 assert.doesNotMatch(method,/loadUrl/);
});
