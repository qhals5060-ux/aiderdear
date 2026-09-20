// Account-scoped, on-demand administration transport. No database listeners or polling.
export function createBioAdminClient({getFirebase=()=>window.AiderDearFirebase,fetchImpl=(...args)=>fetch(...args),events=window}={}){
 const clone=v=>structuredClone(v),listeners=new Set(),pending=new Set(),requests=new Map();
 let uid='',epoch=0,cache=null,readFlight=null,writeVersion=0,unsubscribe=null,blockedUntil=0;
 const identity=()=>String(getFirebase()?.getState?.()?.user?.uid||'');
 const stale=()=>Object.assign(Error('로그인 계정이 변경되었습니다. 다시 열어주세요.'),{status:401});
 function update(){const next=identity();if(next===uid)return;uid=next;epoch++;writeVersion++;cache=null;readFlight=null;requests.clear();for(const c of pending)c.abort();pending.clear();for(const fn of listeners)fn({uid,epoch});}
 function bind(){if(!unsubscribe&&getFirebase()?.subscribe)unsubscribe=getFirebase().subscribe(update);update();}
 events?.addEventListener('aiderdear-firebase-ready',bind);events?.addEventListener('aiderdear-firebase-state',update);bind();
 const guard=(owner,run)=>{if(!owner||identity()!==owner||uid!==owner||epoch!==run)throw stale();};
 async function call(action,value={}){
  update();const owner=uid,run=epoch;guard(owner,run);
  if(blockedUntil>Date.now())throw Object.assign(Error('Firebase 사용량 한도로 잠시 대기 중입니다. 입력한 내용은 유지됩니다.'),{status:503,code:'resource-exhausted'});
  const api=getFirebase(),token=await api.getFirebaseIdToken();guard(owner,run);if(!token)throw stale();
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),22000);pending.add(controller);
  try{
   const response=await fetchImpl('/api/bio-admin',{method:'POST',cache:'no-store',credentials:'same-origin',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({...value,action,expectedOwnerKey:owner}),signal:controller.signal});guard(owner,run);
   let result;try{result=await response.json()}catch{throw Error('서버 응답을 읽지 못했습니다. 입력은 유지됩니다.')}guard(owner,run);
   if(!response.ok){if(result.code==='resource-exhausted')blockedUntil=Date.now()+Math.max(1800,Number(response.headers?.get?.('Retry-After'))||0)*1000;throw Object.assign(Error(result.error||'저장하지 못했습니다. 입력은 유지됩니다.'),{status:response.status,code:result.code||''})}
   if(result.ownerKey!==owner)throw stale();return result;
  }catch(error){guard(owner,run);if(error.name==='AbortError'||error instanceof TypeError)throw Error('연결되지 않았습니다. 입력을 유지했으니 다시 저장해주세요.');throw error}
  finally{clearTimeout(timer);pending.delete(controller)}
 }
 async function read({force=false}={}){
  update();if(!uid)throw stale();if(cache&&!force)return clone(cache);if(readFlight)return readFlight;
  const owner=uid,run=epoch,version=writeVersion;
  const task=call('read').then(result=>{guard(owner,run);if(version===writeVersion&&(!cache||result.state.revision>=cache.state.revision))cache=clone(result);return clone(cache||result)});readFlight=task;
  try{return await task}finally{if(readFlight===task)readFlight=null}
 }
 async function mutate(action,value){
  update();const owner=uid,run=epoch;guard(owner,run);if(value.expectedOwnerKey&&value.expectedOwnerKey!==owner)throw stale();
  const key=JSON.stringify([owner,action,value]);let requestId=requests.get(key);if(!requestId){requestId=value.requestId||crypto.randomUUID();requests.set(key,requestId)}
  writeVersion++;
  try{const result=await call(action,{...value,requestId});guard(owner,run);writeVersion++;requests.delete(key);if(!cache||result.state.revision>=cache.state.revision)cache=clone(result);return clone(cache)}
  catch(error){guard(owner,run);if(error.status>=400&&error.status<500)requests.delete(key);throw error}
 }
 return Object.freeze({identity,generation:()=>epoch,subscribe(fn){listeners.add(fn);fn({uid:identity(),epoch});return()=>listeners.delete(fn)},read,save:value=>mutate('save',value),remove:value=>mutate('delete',{...value,confirmed:true}),snapshot:()=>cache?clone(cache):null});
}
if(typeof window!=='undefined'){window.AiderBioAdminClientV192=createBioAdminClient();window.dispatchEvent(new Event('aiderlog-bio-admin-ready-v192'));}
