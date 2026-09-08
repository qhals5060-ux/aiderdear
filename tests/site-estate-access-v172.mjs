import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {canUseEstateAccount} from '../estate-domain-v171.js';
import {createEstateClient} from '../estate-client-v171.js';

test('two account UI allowlist is normalized, exact and server verification remains mandatory',()=>{
 for(const email of ['qhals5060@gmail.com',' ABCKMS5698@NAVER.COM ']){
  assert.equal(canUseEstateAccount({uid:'a',email}),true);
  assert.equal(canUseEstateAccount({uid:'a',email},{verified:true}),false);
  assert.equal(canUseEstateAccount({uid:'a',email,email_verified:true},{verified:true}),true);
 }
 for(const email of ['xqhals5060@gmail.com','qhals5060@gmail.com.evil','abckms5698@naver.com.evil','','friend@example.com'])assert.equal(canUseEstateAccount({uid:'a',email,email_verified:true}),false);
 assert.equal(canUseEstateAccount(null),false);
});

test('hidden by default; same site allowlist governs navigation and no Android preview bypass',()=>{
 const index=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
 assert.match(index,/<button[^>]*data-tab="estate"[^>]* hidden>/);
 assert.match(index,/estateTab\.hidden=!canAccessRestrictedTab\('estate'\)/);
 assert.match(index,/if\(tab==='estate'&&!canAccessRestrictedTab\('estate'\)\)/);
 const source=index.split(/\r?\n/).find(line=>line.includes('function canAccessRestrictedTab('));
 const context={normalizeEmail:s=>String(s||'').trim().toLowerCase(),currentUserEmail:'',window:{},document:{documentElement:{classList:{contains:()=>false}}},location:{search:''},URLSearchParams,localPreviewMode:()=>true,RESTRICTED_WORKSPACE_EMAILS:new Set()};
 vm.createContext(context);vm.runInContext(source,context);
 assert.equal(context.canAccessRestrictedTab('estate','qhals5060@gmail.com'),true);
 assert.equal(context.canAccessRestrictedTab('estate','abckms5698@naver.com'),true);
 assert.equal(context.canAccessRestrictedTab('estate','friend@example.com'),false);
 context.location.search='?android-preview=1';assert.equal(context.canAccessRestrictedTab('estate','qhals5060@gmail.com'),false);
 context.location.search='';context.window.Android={};assert.equal(context.canAccessRestrictedTab('estate','qhals5060@gmail.com'),false);
});

test('changing to a disallowed account clears client identity and blocks network requests',async t=>{
 const before=globalThis.window,priorFetch=globalThis.fetch;let user={uid:'same-uid',email:'qhals5060@gmail.com'},requests=0;const identities=[];
 globalThis.window={AiderDearFirebase:{getState:()=>({user}),getFirebaseIdToken:async()=> 'fixture-token'}};
 globalThis.fetch=async()=>{requests++;return {ok:true,json:async()=>({rows:[]})};};
 t.after(()=>{globalThis.window=before;globalThis.fetch=priorFetch;});
 const client=createEstateClient(uid=>identities.push(uid));await client.call('list',{collection:'properties'});assert.equal(requests,1);
 user={uid:'same-uid',email:'friend@example.com'};assert.equal(client.identity(),'');
 await assert.rejects(client.call('list',{collection:'properties'}),/지정/);assert.equal(requests,1);assert.deepEqual(identities,['same-uid','']);
});
