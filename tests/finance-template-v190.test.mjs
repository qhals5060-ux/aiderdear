import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createAssetsClient} from '../assets-client-v190.js';
import handler,{createHandler} from '../api/assets.mjs';

async function http(run,req){const response={headers:{},setHeader(k,v){this.headers[k]=v;},end(text){this.body=JSON.parse(text);}};await run(req,response);return response;}
test('default bridge is inert before any auth lookup, subscription, token or fetch',async()=>{
 let calls=0;const forbidden=()=>{calls++;throw Error('must not run');};
 const bridge=createAssetsClient({getFirebase:forbidden,fetchImpl:forbidden,events:{addEventListener:forbidden,dispatchEvent:forbidden}});
 assert.equal(bridge.templateMode,true);assert.equal(bridge.identity(),'');assert.equal(bridge.generation(),0);
 for(let i=0;i<3;i++)assert.deepEqual(await bridge.read(),{records:[],signedIn:false,ownerKey:'template',checkedAt:'',templateMode:true});
 await assert.rejects(bridge.save({id:'005930',watched:true}),e=>e.status===423&&e.message.includes('미리보기'));
 await assert.rejects(bridge.history('005930',30),e=>e.status===423);
 assert.equal(calls,0);
});
test('suspended endpoint returns before body, token verification and all database initialization',async()=>{
 let calls=0;const blocked=createHandler({getServices:()=>{calls++;throw Error('DB service entry forbidden');},dispatch:()=>{calls++;throw Error('DB dispatch forbidden');}});
 for(const method of ['POST','GET','PUT','DELETE','OPTIONS']){
  const req={method,url:'/api/assets?enabled=true'};
  Object.defineProperty(req,'headers',{get(){throw Error('auth headers must not be read');}});
  Object.defineProperty(req,'body',{get(){throw Error('data body must not be read');}});
  const result=await http(blocked,req);assert.equal(result.statusCode,423);assert.equal(result.body.mode,'template');assert.equal(result.body.dataAccess,false);
 }
 assert.equal(calls,0);
});
test('production default endpoint and health cannot activate storage through request parameters',async()=>{
 const saved=await http(handler,{method:'POST',url:'/api/assets?enabled=1',headers:{authorization:'Bearer not-verified'},body:{enabled:true,action:'save',id:'005930'}});
 assert.equal(saved.statusCode,423);
 const health=await http(handler,{method:'GET',url:'/api/assets?action=health&enabled=true',headers:{}});
 assert.equal(health.statusCode,200);assert.equal(health.body.mode,'template');assert.equal(health.body.requiresAuth,false);assert.equal(health.body.dataAccess,false);
});
test('frontend template is build-time locked; hook disables polling and mutation entry points',async()=>{
 const transport=await readFile(new URL('../finance-src-v190/app/asset-transport.ts',import.meta.url),'utf8');
 const hook=await readFile(new URL('../finance-src-v190/app/use-assets.tsx',import.meta.url),'utf8');
 assert.match(transport,/export const ASSETS_TEMPLATE_MODE=true/);
 assert.match(transport,/assetRequest=.*ASSETS_TEMPLATE_MODE\?Promise\.resolve/);
 assert.match(hook,/useEffect\(\(\)=>\{if\(templateMode\)return;void refresh/);
 assert.match(hook,/useEffect\(\(\)=>\{if\(templateMode\|\|!automatic\)return/);
 assert.match(hook,/const startEdit=\(asset:Asset\)=>\{if\(templateMode\)return/);
 assert.match(hook,/const openManagement=\(a:Asset\)=>\{if\(templateMode\)return/);
});
