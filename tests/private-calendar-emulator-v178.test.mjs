// Run against a LOCAL demo emulator only, never production:
// FIRESTORE_EMULATOR_HOST=127.0.0.1:8899 RULES_TEST_MODULE_ROOT=C:/AiderLogBuild/work-security-v167
// node --test tests/private-calendar-emulator-v178.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import * as domain from '../private-calendar-v175.js';
const host=process.env.FIRESTORE_EMULATOR_HOST||'';
const enabled=/^(127\.0\.0\.1|localhost):\d+$/.test(host)&&!!process.env.RULES_TEST_MODULE_ROOT;
test('private-day rules and actual adapter integration on isolated Firestore emulator',{skip:!enabled},async t=>{
  const require=createRequire(path.join(process.env.RULES_TEST_MODULE_ROOT,'package.json'));
  const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
  const sdk=require('firebase/firestore');
  const [hostname,port]=host.split(':');
  const env=await initializeTestEnvironment({projectId:'demo-aiderlog-private-v178',firestore:{host:hostname,port:Number(port),rules:fs.readFileSync(new URL('../firestore.rules',import.meta.url),'utf8')}});
  const claims=(email='qhals5060@gmail.com',verified=true)=>({email,email_verified:verified});
  const u1=env.authenticatedContext('u1',claims()).firestore(),u2=env.authenticatedContext('u2',claims('aidway55@gmail.com')).firestore();
  const u3=env.authenticatedContext('u3',claims('other@example.test')).firestore(),guest=env.unauthenticatedContext().firestore();
  const ref=(db,p)=>sdk.doc(db,p),read=(db,p)=>sdk.getDoc(ref(db,p)),write=(db,p,data)=>sdk.setDoc(ref(db,p),data);
  const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
  const block=source.slice(source.indexOf('function assertPrivateCalendarContext'),source.indexOf('\nfunction eventPairKey'));
  function adapter(db,uid,email,pairId='p1'){
    const user={uid,email,emailVerified:true,getIdTokenResult:async()=>({claims:{sub:uid,...claims(email)}})},state={user,pair:pairId?{id:pairId}:null};
    const context={...domain,...sdk,db,state,auth:{currentUser:user},JSON,Date,requireUser:()=>user,window:{dispatchEvent(){}},CustomEvent:class{}};
    const actual=new Function(...Object.keys(context),block+';return {read:readPrivateCalendarData,mutate:mutatePrivateCalendar};')(...Object.values(context));return{state,...actual};
  }
  const a=adapter(u1,'u1','qhals5060@gmail.com'),b=adapter(u2,'u2','aidway55@gmail.com');
  const action=(kind='period',active=true,expectedRevision=0,date='2026-09-12')=>({type:'day-set',kind,date,active,expectedRevision});
  async function seed(){await env.clearFirestore();await env.withSecurityRulesDisabled(async context=>{const db=context.firestore();await Promise.all([
    write(db,'pairs/p1',{status:'active',memberUids:['u1','u2']}),
    write(db,'pairMemberships/u1',{status:'active',pairId:'p1'}),write(db,'pairMemberships/u2',{status:'active',pairId:'p1'}),
    write(db,'friendships/f1',{status:'active',memberUids:['u1','u3']}),
  ]);});}
  try{
    await t.test('real adapter registers/removes selected day atomically and linked partner reads only minimal projection',async()=>{
      await seed();await assertSucceeds(a.mutate(action()));await assertSucceeds(a.mutate(action('intimacy')));
      const data=await b.read({from:'2026-09-01',to:'2026-09-30'});assert.equal(data.sharedPeriods.length,1);assert.equal(data.sharedIntimacy.length,1);
      assert.equal(data.periods.length,0);assert.equal(data.intimacy.length,0);
      await assertFails(read(u2,'users/u1/menstrualDays/2026-09-12'));await assertFails(read(u2,'users/u1/intimacyDays/2026-09-12'));
      const projection=(await read(u2,'pairs/p1/menstrualDays/u1_2026-09-12')).data();assert.deepEqual(Object.keys(projection).sort(),['active','date','kind','ownerUid','pairId','revision','updatedAt','version']);
      assert.equal((await a.mutate(action())).changed,false);await assertSucceeds(a.mutate(action('period',false,1)));
      assert.equal((await b.read({from:'2026-09-01',to:'2026-09-30'})).sharedPeriods[0].active,false);
    });
    await t.test('guest, friend, third party, and unverified or nonallowlisted intimacy readers are denied',async()=>{
      await seed();await a.mutate(action());await a.mutate(action('intimacy'));
      for(const db of [u3,guest])for(const name of ['menstrualDays','intimacyDays']){
        await assertFails(read(db,`pairs/p1/${name}/u1_2026-09-12`));await assertFails(sdk.getDocs(sdk.query(sdk.collection(db,'pairs/p1/'+name),sdk.limit(201))));
        await assertFails(read(db,`users/u1/${name}/2026-09-12`));
      }
      for(const token of [claims('other@example.test'),claims('aidway55@gmail.com',false)]){
        const db=env.authenticatedContext('u2',token).firestore();await assertSucceeds(read(db,'pairs/p1/menstrualDays/u1_2026-09-12'));
        await assertFails(read(db,'pairs/p1/intimacyDays/u1_2026-09-12'));await assertFails(read(db,'users/u2/intimacyDays/2026-09-12'));
        await assertFails(write(db,'users/u2/intimacyDays/2026-09-12',{kind:'intimacy',date:'2026-09-12',active:true,ownerUid:'u2',version:175,revision:1,createdAt:sdk.serverTimestamp(),updatedAt:sdk.serverTimestamp()}));
      }
    });
    await t.test('unlink, missing membership and changed partner revoke stored shared records without exposing owner history',async()=>{
      for(const change of ['disconnected','missing','other-pair']){
        await seed();await a.mutate(action());await a.mutate(action('intimacy'));
        await env.withSecurityRulesDisabled(async context=>{const db=context.firestore();if(change==='disconnected')await sdk.updateDoc(ref(db,'pairs/p1'),{status:'disconnected'});else if(change==='missing')await sdk.deleteDoc(ref(db,'pairMemberships/u2'));else await sdk.updateDoc(ref(db,'pairMemberships/u2'),{pairId:'p2'});});
        for(const db of [u1,u2])for(const name of ['menstrualDays','intimacyDays'])await assertFails(read(db,`pairs/p1/${name}/u1_2026-09-12`));
        await assertSucceeds(read(u1,'users/u1/menstrualDays/2026-09-12'));
      }
    });
    await t.test('projection writes cannot forge another owner, publish private fields, or replay old private history',async()=>{
      await seed();await a.mutate(action());const stored=(await read(u1,'pairs/p1/menstrualDays/u1_2026-09-12')).data();
      await assertFails(write(u2,'pairs/p1/menstrualDays/u1_2026-09-12',{...stored,active:false,updatedAt:sdk.serverTimestamp()}));
      await assertFails(write(u1,'pairs/p1/menstrualDays/u1_2026-09-12',{...stored,note:'private',updatedAt:sdk.serverTimestamp()}));
      await assertFails(write(u1,'pairs/p1/menstrualDays/u1_2026-09-12',{...stored,updatedAt:sdk.serverTimestamp()}));
      await assertFails(write(u1,'pairs/p1/menstrualDays/u1_2026-09-13',{...stored,date:'2026-09-13',updatedAt:sdk.serverTimestamp()}));
      await assertFails(sdk.getDocs(sdk.collection(u2,'pairs/p1/menstrualDays')));
      await assertFails(sdk.getDocs(sdk.query(sdk.collection(u2,'pairs/p1/menstrualDays'),sdk.limit(202))));
    });
    await t.test('unlinked toggles stay private and linking does not backfill old records',async()=>{
      await seed();const solo=adapter(u1,'u1','qhals5060@gmail.com','');await solo.mutate(action());
      assert.equal((await read(u2,'pairs/p1/menstrualDays/u1_2026-09-12')).exists(),false);
      await a.read({from:'2026-09-01',to:'2026-09-30'});await a.mutate(action());
      assert.equal((await read(u2,'pairs/p1/menstrualDays/u1_2026-09-12')).exists(),false);
    });
  }finally{await env.cleanup();}
});
