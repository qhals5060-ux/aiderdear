const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const bridge=read('android-src/assets/schedule-v119.js');

test('site removes mood editors, insights, search and data loading, preserving Bucket and research',()=>{
  const source=read('index.html');
  assert.doesNotMatch(source,/<[^>]+id="(?:emotionStage|emotionModal|emotionDayModal|breathModal|writeModal|meditationModal)"/);
  assert.doesNotMatch(source,/function (?:loadEmotionData|saveEmotionData|normalizeEmotionData|emotionEntries|countWantByMood|searchEmotionText)\b/);
  assert.doesNotMatch(source,/\bemotionData\b|\bemotionRefs\b|readEmotionData|writeEmotionData|kind:'감정'/);
  assert.match(source,/id="bucketLegacySupport"/);
  assert.match(source,/function renderBucketList\(/);
  assert.match(source,/data\.researchInsights/);
  assert.match(source,/recordMood/); // Event categories are not mood records.
});

test('app contains no retired mood or insight entry point or startup letter',()=>{
  const source=read('android-src/assets/index.html');
  assert.doesNotMatch(source,/<[^>]+id="(?:insights|intro|introMood|introView)"/);
  assert.doesNotMatch(source,/<script[^>]+(?:insight-range-v175|insight-motion-v132|feature-fixes-v126|experience-v145)\.js/);
  assert.doesNotMatch(source,/readEmotionData|writeEmotionData|(?:querySelector|\$)\(['"]#introView/);
  assert.doesNotMatch(bridge,/emotion|Emotion|mood|Mood|document\.|renderHome\s*=(?!=)/);
});

test('Firebase public adapter no longer loads, writes, migrates or deletes historical mood data',()=>{
  const source=read('firebase-app.js');
  assert.doesNotMatch(source,/emotionRef|readEmotionData|writeEmotionData|withoutPrivateEmotionFlags/);
  assert.doesNotMatch(source,/deleteDoc\([^\n]*['"]emotions?['"]/);
  assert.match(source,/readPrivateCalendar/);
  assert.match(source,/readScheduleData/);
});

test('dedicated retired modules are removed instead of hidden in the current bundle',()=>{
  for(const file of ['insight-range-v175.js','insight-range-v175.css','android-src/assets/insight-range-v175.js','android-src/assets/insight-range-v175.css','android-src/assets/feature-fixes-v126.js','android-src/assets/experience-v145.js'])assert.equal(fs.existsSync(path.join(root,file)),false,file);
  assert.ok(fs.existsSync(path.join(root,'android-src/assets/experience-v145.css')),'shared theme styles remain');
});

test('site and app classic inline scripts still parse after scoped retirement',()=>{
  for(const file of ['index.html','android-src/assets/index.html']){
    let count=0;
    for(const match of read(file).matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)){
      if(/\bsrc=|type="module"|application\//.test(match[1]||''))continue;
      assert.doesNotThrow(()=>new vm.Script(match[2],{filename:file+':'+ ++count}));
    }
    assert.ok(count>0,file);
  }
});

function fixture(){
  let current={user:{uid:'owner'},pair:null},subscription,reads=0,renders=0;
  const pending=[],writes=[],events=new Map(),timers=[];
  const api={getState:()=>current,subscribe:fn=>{subscription=fn},readScheduleData:()=>{reads++;return new Promise((resolve,reject)=>pending.push({resolve,reject}))}};
  const context={window:{AiderDearFirebase:api,addEventListener:(name,fn)=>events.set(name,fn)},A:{scheduleEvents:[]},activePage:'home',renderHome:()=>renders++,localStorage:{setItem:(...args)=>writes.push(args)},setTimeout:fn=>timers.push(fn),console:{warn(){}}};
  vm.runInNewContext(bridge,context);
  timers[0]();
  return{context,api,pending,writes,events,timers,setState:state=>{current=state},emit:state=>{if(state)current=state;return subscription(current)},reads:()=>reads,renders:()=>renders};
}

test('schedule bridge merges distinct IDs and newest revision, then calls installed renderer',async()=>{
  const f=fixture();f.context.A.scheduleEvents=[{id:'same',title:'older',updatedAt:1},{id:'local',title:'local'}];
  const result=f.emit();f.pending[0].resolve({own:[{id:'same',title:'newer',updatedAt:2}],shared:[{id:'friend',title:'shared'}]});await result;
  assert.deepEqual(Array.from(f.context.A.scheduleEvents,row=>row.title),['newer','local','shared']);
  assert.equal(f.renders(),1);assert.equal(f.writes.length,1);assert.equal(f.writes[0][0],'aiderlog-app-v20');
});

test('schedule bridge does not subscribe twice when both readiness paths fire',()=>{
  const f=fixture();let subscriptions=0;f.api.subscribe=()=>subscriptions++;f.events.get('aiderdear-firebase-ready')();f.timers[0]();assert.equal(subscriptions,0);
});

test('schedule bridge rejects late responses after account or pair changes without a new notification',async()=>{
  for(const next of [{user:{uid:'other'},pair:null},{user:{uid:'owner'},pair:{id:'new'}},{user:null,pair:null}]){
    const f=fixture(),result=f.emit();f.setState(next);f.pending[0].resolve({own:[{id:'private',title:'never show'}]});await result;
    assert.equal(f.context.A.scheduleEvents.length,0);assert.equal(f.writes.length,0);assert.equal(f.renders(),0);
  }
});

test('schedule bridge rejects an older request arriving after a newer one',async()=>{
  const f=fixture(),first=f.emit(),second=f.emit();f.pending[1].resolve({own:[{id:'new'}]});await second;f.pending[0].resolve({own:[{id:'old'}]});await first;
  assert.deepEqual(Array.from(f.context.A.scheduleEvents,row=>row.id),['new']);assert.equal(f.renders(),1);
});

test('schedule bridge preserves the current calendar on failed read and does not render hidden home',async()=>{
  const f=fixture();f.context.A.scheduleEvents=[{id:'retained'}];let p=f.emit();f.pending[0].reject(Object.assign(Error('offline'),{code:'unavailable'}));await p;assert.equal(f.context.A.scheduleEvents[0].id,'retained');assert.equal(f.renders(),0);
  f.context.activePage='event';p=f.emit();f.pending[1].resolve({own:[{id:'new'}]});await p;assert.equal(f.renders(),0);assert.equal(f.writes.length,1);
});
