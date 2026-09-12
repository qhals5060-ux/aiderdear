import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Focused VM contract against the actual new rule expressions. This is NOT a
// Firestore emulator/compiler or live-server test; deployment verification is
// still required. Unknown constructs throw rather than being granted access.
const rules=fs.readFileSync(new URL('../firestore.rules',import.meta.url),'utf8');
function body(needle){const start=rules.indexOf(needle);assert(start>=0,needle);const open=start+needle.length-1;assert.equal(rules[open],'{');let depth=1,end=open+1;while(depth&&end<rules.length){if(rules[end]==='{')depth++;if(rules[end]==='}')depth--;end++;}assert.equal(depth,0);return rules.slice(open+1,end-1);}
function transform(expression){return expression
  .replace(/get\(\/databases\/\$\(database\)\/documents\/friendships\/\$\(friendshipId\)\)\.data/g,'friend')
  .replace(/exists\(\/databases\/\$\(database\)\/documents\/friendships\/\$\(friendshipId\)\)/g,'friendExists')
  .replace(/([A-Za-z_$][\w$]*(?:\.[\w$]+)*) is (string|int|bool)/g,(_,value,type)=>`__type(${value},'${type}')`)
  .replace(/request\.auth\.token\.get\('email', ''\) in (\[[^\]]+\])/g,"$1.includes(request.auth.token.get('email', ''))")
  .replace(/request\.auth\.uid in friend\.memberUids/g,'friend.memberUids.includes(request.auth.uid)');}
const functionNames=['privateCalendarOwner','privateIntimacyOwner','privateCalendarStamp','privateCalendarDate','privateCalendarRecordBase','privateCalendarTombstone','activeScheduleFriend','scheduleShareDate','scheduleShareTime','validScheduleShare'];
const functions=functionNames.map(name=>{const m=rules.match(new RegExp(`function ${name}\\(([^)]*)\\) \\{`));assert(m,name);return `function ${name}(${m[1]}) {${transform(body(m[0]))}}`;}).join('\n');
const blocks={settings:body('match /healthCalendar/{documentId} {'),period:body('match /menstrualEntries/{entryId} {'),intimacy:body('match /intimacyEntries/{entryId} {'),friend:body('match /scheduleShares/{shareId} {')};
const expression=(kind,operation)=>{const clauses=[...blocks[kind].matchAll(/allow ([\w, ]+): if ([\s\S]*?);/g)].filter(m=>m[1].split(',').map(v=>v.trim()).includes(operation));assert(clauses.length>0);return clauses.map(m=>`(${transform(m[2])})`).join(' || ');};
function allows(kind,operation,{uid='u1',email='qhals5060@gmail.com',verified=true,userId='u1',employee=false,existing=null,next=null,limit=100,friend=null,documentId='settings'}={}){
  const input={userId,entryId:'p1',shareId:'s1',friendshipId:'f1',documentId,friend,friendExists:!!friend,employee,request:{auth:uid?{uid,token:{email,email_verified:verified}}:null,time:100,query:{limit},resource:{data:next}},resource:existing?{data:existing}:null};
  const context=vm.createContext({json:JSON.stringify(input)});
  vm.runInContext(`Object.assign(globalThis,JSON.parse(json));Object.prototype.get=function(key,fallback){return Object.prototype.hasOwnProperty.call(this,key)?this[key]:fallback};Object.prototype.keys=function(){return Object.keys(this)};Array.prototype.hasOnly=function(allowed){return this.every(key=>allowed.includes(key))};String.prototype.size=function(){return this.length};Array.prototype.size=function(){return this.length};String.prototype.matches=function(pattern){return new RegExp(pattern).test(this)};function __type(value,type){return type==='int'?Number.isInteger(value):typeof value===(type==='bool'?'boolean':type)};function signedIn(){return request.auth!==null&&!employee};function currentEmail(){return request.auth.token.email};${functions}`,context);
  try{return vm.runInContext(expression(kind,operation),context)===true;}catch{return false;}
}
const stamp={ownerUid:'u1',version:175,revision:1,createdAt:100,updatedAt:100};
const period={...stamp,id:'p1',startDate:'2026-09-01',endDate:'2026-09-05',note:''};
const intimacy={...stamp,id:'p1',date:'2026-09-01',note:''};
const settings={...stamp,menstrualEnabled:false,cycleLength:28,periodLength:5};
test('owner-only health reads reject guests, another user, employees, unbounded lists and unknown settings IDs',()=>{
  for(const kind of ['period','settings']){assert(allows(kind,'get'));for(const change of [{uid:null},{uid:'u2'},{employee:true}])assert.equal(allows(kind,'get',change),false);}
  assert.equal(allows('settings','get',{documentId:'other'}),false);assert.equal(allows('settings','list'),false);
  assert(allows('period','list',{limit:201}));for(const limit of [null,202])assert.equal(allows('period','list',{limit}),false);
});
test('both confirmed verified owners can read/write intimacy; all other users including guests are denied',()=>{
  for(const email of ['qhals5060@gmail.com','aidway55@gmail.com']){assert(allows('intimacy','get',{email}));assert(allows('intimacy','create',{email,next:intimacy}));}
  for(const change of [{uid:null},{uid:'u2'},{email:'friend@example.test'},{email:'qhals5060@@gmail.com'},{email:'QHALS5060@gmail.com'},{verified:false},{employee:true}])for(const op of ['get','list','create','update','delete'])assert.equal(allows('intimacy',op,{existing:intimacy,next:{...intimacy,revision:2},...change}),false,`${op}:${JSON.stringify(change)}`);
});
test('health writes whitelist fields, bind owner/revision/timestamps and preserve disabled history',()=>{
  assert(allows('period','create',{next:period}));assert(allows('settings','create',{next:settings}));
  for(const extra of [{ownerUid:'u2'},{version:174},{revision:2},{updatedAt:99},{createdAt:99},{internalLeak:'secret'},{note:'x'.repeat(501)},{endDate:'2026-08-31'}])assert.equal(allows('period','create',{next:{...period,...extra}}),false);
  assert(allows('settings','update',{existing:settings,next:{...settings,revision:2,menstrualEnabled:true}}));
  assert.equal(allows('settings','update',{existing:settings,next:{...settings,revision:1,menstrualEnabled:true}}),false);
  assert.equal(allows('settings','update',{existing:settings,next:{...settings,revision:2,cycleLength:999}}),false);
  assert.equal(allows('period','delete',{existing:period}),false,'explicit client delete cannot bypass version tombstones');
});
test('tombstone update strips dates/notes and cannot be resurrected by an old client',()=>{
  const tombstone={...stamp,id:'p1',deleted:true,revision:2};
  assert(allows('period','update',{existing:period,next:tombstone}));
  assert.equal(allows('period','create',{next:{...tombstone,revision:1}}),false);
  assert.equal(allows('period','update',{existing:period,next:{...tombstone,startDate:'2026-09-01'}}),false);
  assert.equal(allows('period','update',{existing:tombstone,next:{...period,revision:3}}),false);
  assert(allows('intimacy','update',{existing:intimacy,next:tombstone}));
});
test('friend schedule rules allow accepted members only and bounded query',()=>{
  const friend={status:'active',memberUids:['u1','u2']};assert(allows('friend','get',{friend}));assert(allows('friend','list',{friend,uid:'u2'}));
  for(const change of [{uid:null},{uid:'stranger'},{friend:null},{friend:{...friend,status:'disconnected'}},{friend:{...friend,memberUids:['u1','u2','u3']}},{limit:101},{limit:null}])assert.equal(allows('friend','list',{friend,...change}),false);
});
test('friend shares reject private/business fields, owner overwrite and invalid date/time records',()=>{
  const friend={status:'active',memberUids:['u1','u2']};const share={source:'personal',sourceEventId:'e1',ownerUid:'u1',ownerEmail:'qhals5060@gmail.com',friendshipId:'f1',title:'약속',date:'2026-09-01',endDate:'2026-09-01',time:'09:30',endTime:'10:30',allDay:false,updatedAt:100};
  assert(allows('friend','create',{friend,next:share}));assert(allows('friend','update',{friend,existing:share,next:{...share,title:'변경'}}));
  for(const extra of [{source:'consult'},{source:'work'},{source:'estate'},{period:true},{intimacy:true},{note:'private'},{phone:'private'},{ownerUid:'u2'},{ownerEmail:'other@example.test'},{friendshipId:'other'},{time:'25:00'},{endDate:'2026-08-31'},{updatedAt:99}])assert.equal(allows('friend','create',{friend,next:{...share,...extra}}),false);
  assert.equal(allows('friend','update',{friend,existing:{...share,ownerUid:'u2'},next:share}),false);
  assert.equal(allows('friend','update',{friend,existing:share,next:{...share,sourceEventId:'e2'}}),false);
  assert(allows('friend','delete',{friend,existing:share}));assert.equal(allows('friend','delete',{friend,existing:share,uid:'u2'}),false);
});
