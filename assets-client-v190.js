export function createAssetsClient({enabled=false,getFirebase=()=>window.AiderDearFirebase,fetchImpl=(...args)=>fetch(...args),events=globalThis.window}={}){
 // Return before Firebase lookup, auth subscription, timers, token or API access.
 if(!enabled){const unavailable=async()=>{throw Object.assign(Error('재테크는 미리보기입니다. 저장과 데이터 연결을 사용하지 않습니다.'),{status:423});};return Object.freeze({templateMode:true,identity:()=>'',generation:()=>0,read:async()=>({records:[],signedIn:false,ownerKey:'template',checkedAt:'',templateMode:true}),save:unavailable,history:unavailable});}
 let uid='',epoch=0,unsubscribe=null,since=null;const cache=new Map(),requests=new Map(),pending=new Set();
 const identity=()=>String(getFirebase()?.getState?.()?.user?.uid||'');
 const stale=()=>Object.assign(Error('로그인 계정이 변경되었습니다. 다시 열어주세요.'),{status:401});
 const guard=()=>{const owner=uid,generation=epoch;return()=>{if(identity()!==owner||uid!==owner||epoch!==generation)throw stale();};};
 function update(){const next=identity();if(next===uid)return;uid=next;epoch++;since=null;cache.clear();requests.clear();for(const c of pending)c.abort();pending.clear();events.dispatchEvent(new Event('aider-assets-identity'));}
 function bind(){if(!unsubscribe&&getFirebase()?.subscribe)unsubscribe=getFirebase().subscribe(update);update();}
 events.addEventListener('aiderdear-firebase-ready',bind);events.addEventListener('aiderdear-firebase-state',update);bind();
 async function call(action,value={}){
  update();const owner=uid,generation=epoch;if(!owner)throw stale();const check=()=>{if(identity()!==owner||uid!==owner||epoch!==generation)throw stale();};
  const token=await getFirebase().getFirebaseIdToken();check();if(!token)throw stale();const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),22000);pending.add(abort);
  try{const r=await fetchImpl('/api/assets',{method:'POST',cache:'no-store',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({...value,action,expectedOwnerKey:owner}),signal:abort.signal});check();const result=await r.json();check();if(!r.ok)throw Object.assign(Error(result.error||'저장하지 못했습니다.'),{status:r.status});if(result.ownerKey!==owner)throw stale();return result;}
  catch(error){check();if(error.name==='AbortError'||error instanceof TypeError)throw Error('연결되지 않았습니다. 입력은 유지되며 다시 저장할 수 있습니다.');throw error;}finally{clearTimeout(timer);pending.delete(abort);}
 }
 let readSequence=0;
 async function read(){update();if(!uid)return{records:[],signedIn:false,ownerKey:'anonymous',checkedAt:new Date().toISOString()};const check=guard(),seq=++readSequence,result=await call('read',since?{since}:{});check();if(seq!==readSequence)return{...result,records:[...cache.values()]};if(!result.incremental)cache.clear();for(const row of result.records){const old=cache.get(row.asset_id);if(!old||old.revision<=row.revision)cache.set(row.asset_id,row);}since=result.checkedAt;return{...result,records:[...cache.values()]};}
 async function save(value){update();if(value.expectedOwnerKey!==uid)throw stale();const check=guard();++readSequence;const key=JSON.stringify([uid,value]);let requestId=requests.get(key);if(!requestId){requestId=crypto.randomUUID();if(requests.size>=16)requests.delete(requests.keys().next().value);requests.set(key,requestId);}try{const result=await call('save',{...value,requestId});check();++readSequence;requests.delete(key);const old=cache.get(result.record.asset_id);if(!old||old.revision<=result.record.revision)cache.set(result.record.asset_id,result.record);return result;}catch(error){check();if(error.status>=400&&error.status<500)requests.delete(key);throw error;}}
 return Object.freeze({templateMode:false,identity,read,save,history:(id,cursor)=>call('history',{id,cursor}),generation:()=>epoch});
}
if(typeof window!=='undefined'){window.AiderAssetsBridgeV184=createAssetsClient();window.dispatchEvent(new Event('aider-assets-ready'));}
