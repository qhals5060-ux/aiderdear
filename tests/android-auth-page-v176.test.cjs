'use strict';
const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../android-auth.html'),'utf8');
const code=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*?;$/gm,'');
async function setup({state='a'.repeat(64),popupError=null,persistenceError=false}={}){
  const handlers=[],calls=[],elements={loginButton:{disabled:true,textContent:'',addEventListener(type,fn){handlers.push(fn)}},status:{textContent:'',classList:{add(){},remove(){}}}};
  const location={search:'?state='+state,href:''};
  class Provider{setCustomParameters(options){calls.push(['provider',options])}static credentialFromResult(result){return result.credential}}
  const context=vm.createContext({URLSearchParams,location,document:{getElementById:id=>elements[id]},initializeApp:(config,name)=>{calls.push(['app',name]);return{}},getAuth:()=>({}),GoogleAuthProvider:Provider,inMemoryPersistence:'memory',setPersistence:async(auth,p)=>{calls.push(['persistence',p]);if(persistenceError)throw Error('failed')},signInWithPopup:async()=>{calls.push(['popup']);if(popupError)throw popupError;return {credential:{idToken:'fake-id',accessToken:'fake-access'}}}});
  await new vm.Script('(async()=>{'+code+'})()').runInContext(context);
  return {elements,location,calls,click:()=>handlers[0]()};
}
test('external browser uses a separate named, in-memory Firebase session',async()=>{const f=await setup();assert.deepEqual(f.calls.slice(0,2),[['app','android-handoff-v176'],['persistence','memory']]);assert.equal(f.elements.loginButton.disabled,false)});
test('return-to-app retry never starts a second Google login',async()=>{const f=await setup();await f.click();const first=f.location.href;assert.equal(new URL(first).searchParams.get('state'),'a'.repeat(64));assert.equal(new URL(first).searchParams.get('id_token'),'fake-id');await f.click();assert.equal(f.location.href,first);assert.equal(f.calls.filter(c=>c[0]==='popup').length,1);assert.equal(f.elements.loginButton.textContent,'AiderLog로 돌아가기')});
test('double click coalesces browser login into one popup',async()=>{const f=await setup();await Promise.all([f.click(),f.click()]);assert.equal(f.calls.filter(c=>c[0]==='popup').length,1)});
test('invalid handoff state never initializes authentication',async()=>{const f=await setup({state:'untrusted'});await f.click();assert.equal(f.calls.length,0);assert.equal(f.elements.loginButton.disabled,true);assert.equal(f.location.href,'')});
test('provider failure exposes safe error code, not credential-bearing message',async()=>{const f=await setup({popupError:{code:'auth/internal-error',message:'secret token must not appear'}});await f.click();assert.match(f.elements.status.textContent,/auth\/internal-error/);assert.doesNotMatch(f.elements.status.textContent,/secret/);assert.equal(f.location.href,'');assert.equal(f.elements.loginButton.disabled,false)});
test('persistence setup failure does not launch Google',async()=>{const f=await setup({persistenceError:true});assert.equal(f.elements.loginButton.disabled,true);assert.equal(f.calls.filter(c=>c[0]==='popup').length,0)});
test('handoff document does not index, refer, log or persist bearer credentials',()=>{assert.match(html,/name="referrer" content="no-referrer"/);assert.match(html,/name="robots" content="noindex,nofollow"/);assert.doesNotMatch(code,/console\.|localStorage|sessionStorage|button\.onclick/)});
