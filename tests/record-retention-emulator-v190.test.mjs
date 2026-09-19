// Local demo emulator only. Never connect this test to a production project.
// $env:FIRESTORE_EMULATOR_HOST='127.0.0.1:8899'
// $env:RULES_TEST_MODULE_ROOT='C:/AiderLogBuild/work-security-v167'
// node --test tests/record-retention-emulator-v190.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const host=process.env.FIRESTORE_EMULATOR_HOST||'';
const enabled=/^(127\.0\.0\.1|localhost):\d+$/.test(host)&&!!process.env.RULES_TEST_MODULE_ROOT;
test('permanent-record rules on an isolated local Firestore emulator',{skip:!enabled},async t=>{
  const require=createRequire(path.join(process.env.RULES_TEST_MODULE_ROOT,'package.json'));
  const {initializeTestEnvironment,assertSucceeds,assertFails}=require('@firebase/rules-unit-testing');
  const sdk=require('firebase/firestore');
  const [hostname,port]=host.split(':');
  const env=await initializeTestEnvironment({projectId:'demo-aiderlog-retention-v190',firestore:{host:hostname,port:Number(port),rules:fs.readFileSync(new URL('../firestore.rules',import.meta.url),'utf8')}});
  const owner=env.authenticatedContext('sender',{email:'sender@example.test',email_verified:true}).firestore();
  const recipient=env.authenticatedContext('recipient',{email:'recipient@example.test',email_verified:true}).firestore();
  const outsider=env.authenticatedContext('outsider',{email:'outsider@example.test',email_verified:true}).firestore();
  const guest=env.unauthenticatedContext().firestore();
  const doc=(db,p)=>sdk.doc(db,p),write=(db,p,value)=>sdk.setDoc(doc(db,p),value),read=(db,p)=>sdk.getDoc(doc(db,p));
  const photo=(extra={})=>({createdByUid:'sender',createdByEmail:'sender@example.test',memberUids:['sender','recipient'],recipientUids:['recipient'],name:'original.jpg',type:'image/jpeg',size:3,chunkCount:1,ready:false,createdAt:sdk.serverTimestamp(),...extra});
  const old=sdk.Timestamp.fromDate(new Date('2001-01-01T00:00:00Z'));
  async function seed(){await env.clearFirestore();await env.withSecurityRulesDisabled(async context=>{
    const db=context.firestore();await write(db,'directLetters/old',{fromUid:'sender',fromEmail:'sender@example.test',toUid:'recipient',memberUids:['sender','recipient'],body:'Never expire',createdAt:old});
    await write(db,'ephemeralMedia/old',photo({ready:true,createdAt:old,expiresAt:sdk.Timestamp.fromDate(new Date('2001-01-02T00:00:00Z'))}));
    await write(db,'ephemeralMedia/old/chunks/0000',{data:sdk.Bytes.fromUint8Array(new Uint8Array([1,2,3]))});
  });}
  try{
    await t.test('old mail remains readable and recipients cannot invoke the former age-based cleanup',async()=>{
      await seed();for(const db of [owner,recipient])assert.equal((await assertSucceeds(read(db,'directLetters/old'))).data().body,'Never expire');
      await assertFails(sdk.deleteDoc(doc(recipient,'directLetters/old')));
      await assertSucceeds(sdk.updateDoc(doc(recipient,'directLetters/old'),{readBy:['recipient'],updatedAt:sdk.serverTimestamp()}));
      for(const db of [outsider,guest]){await assertFails(read(db,'directLetters/old'));await assertFails(sdk.deleteDoc(doc(db,'directLetters/old')));}
      await assertSucceeds(sdk.deleteDoc(doc(owner,'directLetters/old')));
    });
    await t.test('new shared photos save without expiry and only the uploader can finalize or delete them',async()=>{
      await seed();await assertSucceeds(write(owner,'ephemeralMedia/new',photo()));
      await assertSucceeds(write(owner,'ephemeralMedia/new/chunks/0000',{data:sdk.Bytes.fromUint8Array(new Uint8Array([1,2,3]))}));
      await assertSucceeds(sdk.updateDoc(doc(owner,'ephemeralMedia/new'),{ready:true}));
      const stored=(await assertSucceeds(read(recipient,'ephemeralMedia/new'))).data();assert.equal(stored.ready,true);assert.equal(Object.hasOwn(stored,'expiresAt'),false);
      await assertSucceeds(read(recipient,'ephemeralMedia/new/chunks/0000'));
      await assertFails(sdk.updateDoc(doc(recipient,'ephemeralMedia/new'),{ready:false}));
      await assertFails(sdk.deleteDoc(doc(recipient,'ephemeralMedia/new')));
      await assertFails(sdk.deleteDoc(doc(recipient,'ephemeralMedia/new/chunks/0000')));
      await assertFails(sdk.updateDoc(doc(owner,'ephemeralMedia/new'),{expiresAt:old}));
      await assertFails(sdk.updateDoc(doc(owner,'ephemeralMedia/new'),{memberUids:['sender','outsider']}));
      await assertSucceeds(sdk.deleteDoc(doc(owner,'ephemeralMedia/new/chunks/0000')));
      await assertSucceeds(sdk.deleteDoc(doc(owner,'ephemeralMedia/new')));
    });
    await t.test('legacy expired metadata does not hide existing media; membership still protects all content',async()=>{
      await seed();for(const db of [owner,recipient]){
        await assertSucceeds(read(db,'ephemeralMedia/old'));
        await assertSucceeds(read(db,'ephemeralMedia/old/chunks/0000'));
      }
      for(const db of [outsider,guest]){
        await assertFails(read(db,'ephemeralMedia/old'));
        await assertFails(read(db,'ephemeralMedia/old/chunks/0000'));
        await assertFails(write(db,'ephemeralMedia/forged',photo()));
      }
      await assertFails(write(owner,'ephemeralMedia/expiring',photo({expiresAt:old})));
      await assertFails(write(owner,'ephemeralMedia/another-owner',photo({createdByUid:'outsider'})));
      await assertFails(write(owner,'ephemeralMedia/no-owner-member',photo({memberUids:['recipient','outsider']})));
      await assertSucceeds(sdk.deleteDoc(doc(owner,'ephemeralMedia/old/chunks/0000')));
      await assertSucceeds(sdk.deleteDoc(doc(owner,'ephemeralMedia/old')));
    });
  }finally{await env.cleanup();}
});
