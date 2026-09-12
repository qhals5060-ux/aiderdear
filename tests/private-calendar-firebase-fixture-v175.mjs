import fs from 'node:fs';
import vm from 'node:vm';
import * as domain from '../private-calendar-v175.js';

// Actual adapter code with memory-only persistence. No SDK, credentials, or
// production network requests. Used by unit tests and local browser QA.
const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
const block=source.slice(source.indexOf('function assertPrivateCalendarContext'),source.indexOf('\nfunction eventPairKey'));
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
export function createPrivateCalendarFirebaseFixture(email='qhals5060@gmail.com',verified=true){
  const rows=new Map(),reads=[],writes=[],events=[],transactions=[],queries=[];
  const state={user:{uid:'u1',email},pair:{id:'p1'}};
  const claims={sub:'u1',email,email_verified:verified};
  const principal={uid:'u1',email,emailVerified:verified,getIdTokenResult:async()=>({claims})},auth={currentUser:principal};
  let beforeRead=null,fail=null,tail=Promise.resolve();
  const snap=ref=>({id:ref.path.split('/').at(-1),exists:()=>rows.has(ref.path),data:()=>clone(rows.get(ref.path))});
  const before=async ref=>{reads.push(ref.path);await beforeRead?.(ref);if(fail)throw fail;};
  const read=async ref=>{await before(ref);return snap(ref);};
  const context={...domain,db:{},state,auth,JSON,Date,requireUser:()=>{if(!state.user)throw Error('로그인이 필요합니다.');return state.user;},doc:(_db,...parts)=>({path:parts.join('/')}),collection:(_db,...parts)=>({path:parts.join('/')}),where:(field,op,value)=>({type:'where',field,op,value}),orderBy:(field,direction)=>({type:'order',field,direction}),limit:value=>({type:'limit',value}),query:(ref,...constraints)=>({...ref,constraints}),getDoc:read,getDocs:async query=>{
    await before(query);queries.push(query);
    let matching=[...rows].filter(([path])=>path.startsWith(query.path+'/')&&path.split('/').length===query.path.split('/').length+1);
    for(const c of query.constraints.filter(c=>c.type==='where'))matching=matching.filter(([,row])=>row[c.field]!=null&&(c.op==='>='?row[c.field]>=c.value:row[c.field]<=c.value));
    const order=query.constraints.find(c=>c.type==='order');if(order)matching.sort((a,b)=>String(b[1][order.field]).localeCompare(String(a[1][order.field])));
    const count=query.constraints.find(c=>c.type==='limit')?.value;if(count)matching=matching.slice(0,count);
    return {docs:matching.map(([path])=>snap({path}))};
  },serverTimestamp:()=>42,runTransaction:(_db,callback,options)=>{
    transactions.push(options);const task=tail.then(async()=>{const pending=[];const result=await callback({get:read,set:(ref,data)=>pending.push([ref.path,clone(data)])});for(const [path,data]of pending){rows.set(path,data);writes.push(path);}return result;});tail=task.catch(()=>{});return task;
  },window:{dispatchEvent:event=>events.push(event)},CustomEvent:class{constructor(type,options){this.type=type;this.detail=options.detail;}}};
  vm.createContext(context);vm.runInContext(block,context);
  return {rows,reads,writes,queries,transactions,events,state,auth,claims,principal,context,read:input=>context.readPrivateCalendarData(input),mutate:input=>context.mutatePrivateCalendar(input),seed(path,data){rows.set(path,{version:175,ownerUid:'u1',createdAt:1,updatedAt:1,...data});},before(fn){beforeRead=fn;},fail(error){fail=error;}};
}
