import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createConsultSync} from '../consult-sync-v167.js';

test('retired services respond without auth, network, or database initialization', async()=>{
  for(const name of ['bio-admin','estate','youtube-library','consult']) {
    const {default:handler}=await import(`../api/${name}.mjs`);
    let body; const res={setHeader(){},end(s){body=JSON.parse(s);}};
    handler({method:'POST',body:{action:'delete'}},res);
    assert.equal(res.statusCode,410);assert.equal(body.version,193);
    assert.doesNotMatch(fs.readFileSync(new URL(`../api/${name}.mjs`,import.meta.url),'utf8'),/import |getFirestore|verifyIdToken|fetch\(/);
  }
});

test('editing retained private data skips Consult reads and mutations while preserving legacy rows', async()=>{
  let writes=0;
  const legacy={consultingClients:[{id:'existing',revision:12}],consultingTasks:[{id:'task'}]};
  const sync=createConsultSync({retired:true,currentUid:()=> 'one',readCurrent(){assert.fail('Unnecessary document read');},commitRecord(){assert.fail('Retired endpoint called');},writeRemaining:async(uid,payload)=>{writes++;return {...payload,...legacy};}});
  sync.remember('one',legacy);
  const draft={personalItems:[{id:'salary',category:'finance',amount:100}],checklists:[{id:'habit'}]};
  const result=await sync.write(draft);
  assert.equal(writes,1);assert.deepEqual(result.consultingClients,legacy.consultingClients);assert.deepEqual(draft.consultingTasks,legacy.consultingTasks);assert.equal(result.personalItems[0].amount,100);
});

test('private transaction writes changed fields only and cannot erase retired Consult records',async()=>{
  const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
  const a=source.indexOf('const consultSyncV167 = createConsultSync({'),b=source.indexOf('// BEGIN WIDGET ACTION TRANSACTION V165',a);
  const original={personalItems:[{id:'salary',amount:90}],memos:[{id:'keep',body:'original'}],consultingClients:[{id:'legacy',revision:8}]};
  const updates=[];let options;
  const c={auth:{currentUser:{uid:'one'}},db:{},doc:()=>({}),createConsultSync:o=>{options=o;return {};},decodeArchive:x=>x,encodeArchive:x=>x,encodeStoredPayload:x=>x,CONSULT_KEYS:['consultingClients'],mergePrivateNotesV179:()=>({}),FieldPath:class{constructor(...parts){this.parts=parts;}},serverTimestamp:()=>123,runTransaction:async(db,fn)=>fn({get:async()=>({exists:()=>true,data:()=>({payload:original})}),update:(...args)=>updates.push(args),set(){assert.fail('Existing document replaced');}})};
  vm.createContext(c);vm.runInContext(source.slice(a,b),c);
  const next=await options.writeRemaining('one',{personalItems:[{id:'salary',amount:100}],memos:original.memos,consultingClients:[]},{});
  assert.equal(next.consultingClients[0].id,'legacy');
  const fields=updates[0].filter(x=>x?.parts?.[0]==='payload').map(x=>x.parts.join('.'));
  assert.deepEqual(fields,['payload.personalItems']);
  updates.length=0;await options.writeRemaining('one',original,{});assert.equal(updates.length,0);
});

test('login boot never subscribes to retired mail or looks up employee workspace identity',()=>{
  const s=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
  const boot=s.slice(s.indexOf('function startListeners(user)'),s.indexOf('function requireUser()'));
  assert.doesNotMatch(boot,/directLetters|watchClientIntake|workIdentities/);
  assert.doesNotMatch(s.slice(s.indexOf('onAuthStateChanged(auth')),/workIdentities|employee\.html/);
});
