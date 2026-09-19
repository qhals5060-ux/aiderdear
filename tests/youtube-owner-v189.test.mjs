import test from 'node:test';
import assert from 'node:assert/strict';
import {createHandler} from '../api/youtube-library.mjs';
import {createYoutubeClient} from '../youtube-client-v189.js';

test('verified token owner must match the captured client owner before import/read/write',async()=>{
 let work=0;
 const handler=createHandler({getServices:()=>({db:{},auth:{verifyIdToken:async()=>({uid:'account-b'})}}),loadVideo:async()=>{work++;},dispatch:async()=>{work++;}});
 for(const action of ['import','list','save','delete']){
  const response={setHeader(){},end(value){this.body=JSON.parse(value);}};
  await handler({method:'POST',headers:{authorization:'Bearer token-for-b'},body:{action,ownerUid:'account-a'}},response);
  assert.equal(response.statusCode,401);
 }
 assert.equal(work,0);
});

test('client sends captured owner rather than caller override and refreshes revision after conflict',async()=>{
 const requests=[];let fail=true;
 const firebase={getState:()=>({user:{uid:'account-a'}}),getFirebaseIdToken:async()=> 'token',subscribe(fn){fn();return()=>{};}};
 const client=createYoutubeClient({getFirebase:()=>firebase,events:new EventTarget(),fetchImpl:async(url,options)=>{
  const body=JSON.parse(options.body);requests.push(body);
  if(body.action==='list')return{ok:true,json:async()=>({rows:[],libraryRevision:fail?0:2})};
  if(fail){fail=false;return{ok:false,status:409,json:async()=>({error:'Changed'})};}
  return{ok:true,json:async()=>({row:{revision:3},libraryRevision:3})};
 }});
 const value={ownerUid:'attacker',videoId:'M7lc1UVf-VE',expectedRevision:0,patch:{}};
 await assert.rejects(client.save(value),e=>e.status===409);
 await client.save(value);
 assert.deepEqual(requests.map(r=>r.action),['list','save','list','save']);
 assert(requests.every(r=>r.ownerUid==='account-a'));
 assert.equal(requests[3].expectedLibraryRevision,2);
 assert.notEqual(requests[1].requestId,requests[3].requestId);
});
