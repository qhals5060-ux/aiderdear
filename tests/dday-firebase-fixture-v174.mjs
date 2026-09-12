import fs from 'node:fs';
import vm from 'node:vm';
import * as domain from '../dday-store-v174.js';
import {encodeStoredPayload} from '../archive-codec-v168.js';
import {decodeArchive} from '../archive-codec-v168.js';

// The actual production adapter, injected with an in-memory Firestore contract.
// This fixture does not import Firebase or call any network/production service.
const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
const block=source.slice(source.indexOf('function captureDdayContext()'),source.indexOf('\nconst copyJson'));
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
export function createDdayFirebaseFixture(){
  const rows=new Map(),reads=[],writes=[],events=[],state={user:{uid:'u1',email:'owner@example.test'},pair:null,partner:null},auth={currentUser:{uid:'u1'}};
  let beforeRead=null,failPath='',tail=Promise.resolve();const transactions=[];
  const snapshot=ref=>({exists:()=>rows.has(ref.path),data:()=>clone(rows.get(ref.path))});
  async function read(ref){reads.push(ref.path);await beforeRead?.(ref);if(ref.path===failPath)throw Error('permission-denied (isolated)');return snapshot(ref);}
  const context={...domain,encodeStoredPayload,decodeArchive,state,auth,db:{},TextEncoder,JSON,Date,requireUser:()=>{if(!state.user)throw Error('로그인이 필요합니다.');return state.user;},cleanEmail:value=>String(value||'').trim().toLowerCase(),eventPairKey:()=>state.pair?(state.pair.memberEmails||[]).map(v=>v.toLowerCase()).sort().join('::'):'',doc:(_db,...parts)=>({path:parts.join('/')}),getDoc:read,storageStampV168:()=>({storageVersion:168}),serverTimestamp:()=>1,window:{dispatchEvent:event=>events.push(event)},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}},runTransaction:(_db,callback,options)=>{transactions.push(options);
    const result=tail.then(async()=>{const pending=[],tx={get:read,set:(ref,data)=>pending.push({path:ref.path,data:clone(data)})};const value=await callback(tx);for(const write of pending){rows.set(write.path,write.data);writes.push(write.path);}return value;});tail=result.catch(()=>{});return result;
  }};
  vm.createContext(context);vm.runInContext(block,context);
  const seed=(path,payload)=>rows.set(path,{payload:encodeStoredPayload(payload)});
  const pair=()=>{state.pair={id:'p1',memberEmails:['owner@example.test','partner@example.test']};state.partner={email:'partner@example.test'};};
  return {context,rows,reads,writes,events,transactions,state,auth,seed,pair,read:()=>context.readDdayData(),mutate:action=>context.mutateDday(action),setBeforeRead(fn){beforeRead=fn;},setFail(path){failPath=path;}};
}
