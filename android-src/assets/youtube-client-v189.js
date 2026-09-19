import {organizeText} from './youtube-text-v189.js';

export function createYoutubeClient({getFirebase=()=>window.AiderDearFirebase,fetchImpl=(...args)=>fetch(...args),events=window}={}){
 const listeners=new Set(),pending=new Set(),requests=new Map();let currentUid=null,epoch=0,unsubscribe=null,libraryRevision=null;
 const user=()=>{const u=getFirebase()?.getState?.()?.user;return u?.uid?{uid:u.uid}:null;};
 function update(){const uid=user()?.uid||null;if(uid!==currentUid){currentUid=uid;epoch++;libraryRevision=null;requests.clear();for(const c of pending)c.abort();pending.clear();}for(const listener of listeners)listener(user());}
 function bind(){if(unsubscribe)return;const api=getFirebase();if(api?.subscribe)unsubscribe=api.subscribe(update);update();}
 events.addEventListener('aiderdear-firebase-ready',bind);events.addEventListener('aiderdear-firebase-state',update);bind();
 const stale=()=>Object.assign(new Error('로그인 계정이 변경되었습니다. 다시 열어주세요.'),{status:401});
 async function call(action,value={}){
   update();const uid=currentUid,run=epoch,api=getFirebase();if(!uid)throw Object.assign(new Error('로그인 후 사용할 수 있습니다.'),{status:401});
   const assertOwner=()=>{if(user()?.uid!==uid||currentUid!==uid||epoch!==run)throw stale();};
   const token=await api.getFirebaseIdToken();assertOwner();if(!token)throw stale();
   const controller=new AbortController();pending.add(controller);const timeout=setTimeout(()=>controller.abort(),22000);
   try{
     const response=await fetchImpl('/api/youtube-library',{method:'POST',cache:'no-store',credentials:'same-origin',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify({...value,action,ownerUid:uid}),signal:controller.signal});assertOwner();
     let result;try{result=await response.json();}catch{throw new Error('서버 응답을 읽지 못했습니다. 입력은 유지됩니다.');}assertOwner();
     if(!response.ok)throw Object.assign(new Error(result.error||'요청을 처리하지 못했습니다.'),{status:response.status});if(Number.isSafeInteger(result.libraryRevision))libraryRevision=Math.max(libraryRevision??0,result.libraryRevision);return result;
   }catch(error){assertOwner();if(error.name==='AbortError')throw new Error('불러오는 시간이 길어졌습니다. 연결을 확인하고 다시 시도해주세요.');if(error instanceof TypeError)throw new Error('연결되지 않았습니다. 입력은 유지되며 다시 저장할 수 있습니다.');throw error;}
   finally{clearTimeout(timeout);pending.delete(controller);}
 }
 async function mutate(action,value){
   update();const owner=currentUid,run=epoch,key=JSON.stringify([currentUid,action,value]);let request=requests.get(key);
   if(!request){
     if(action==='save'&&value.expectedRevision===0&&libraryRevision===null)await call('list');
     if(user()?.uid!==owner||currentUid!==owner||epoch!==run)throw stale();
     request={requestId:value.requestId||crypto.randomUUID(),...(action==='save'&&value.expectedRevision===0?{expectedLibraryRevision:libraryRevision}: {})};
     if(requests.size>=16)requests.delete(requests.keys().next().value);requests.set(key,request);
   }
   try{const result=await call(action,{...value,...request});requests.delete(key);return result;}
   catch(error){if(error.status>=400&&error.status<500)requests.delete(key);if(error.status===409)libraryRevision=null;throw error;}
 }
 return Object.freeze({getUser:user,subscribe(listener){listeners.add(listener);listener(user());return()=>listeners.delete(listener);},list:(value={})=>call('list',value),importVideo:value=>call('import',value),organize:text=>organizeText(text).sentences,save:value=>mutate('save',value),remove:value=>mutate('delete',value)});
}
if(typeof window!=='undefined'){window.AiderYoutubeV189=createYoutubeClient();window.dispatchEvent(new CustomEvent('aiderlog-youtube-ready-v189'));}
