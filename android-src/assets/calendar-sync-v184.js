// Shared calendar connection lifecycle. OAuth credentials remain on the server.
export const CALENDAR_REFRESH_MS = 5 * 60 * 1000;
export function restoredCalendarStatus(server = {}, cached = false) {
  if (server.connected && server.serverMode) return {...server, clientMode:false, needsReconnect:false};
  if (server.serverMode) return {...server, clientMode:false, needsReconnect:!server.connected};
  return {...server, connected:false, clientMode:false, needsReconnect:cached};
}
export function createCalendarSyncClient({getUser, getToken, fetch:request, bridge=()=>null, navigate=url=>location.assign(url), visible=()=>true, online=()=>true, now=Date.now}) {
  let running=null,lastAt=0,lastUid='',blockedUntil=0;
  async function call(action,payload={}) {
    const uid=String(getUser()?.uid||'');
    if(!uid)throw new Error('로그인이 필요합니다.');
    const token=await getToken();
    if(uid!==String(getUser()?.uid||''))throw new Error('로그인 계정이 변경되었습니다.');
    const response=await request(`/api/calendar-sync?action=${encodeURIComponent(action)}`,{method:'POST',cache:'no-store',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify(payload)});
    const data=await response.json().catch(()=>({}));
    if(uid!==String(getUser()?.uid||''))throw new Error('로그인 계정이 변경되었습니다.');
    if(!response.ok)throw Object.assign(new Error(data.error||`캘린더 연결 오류 (${response.status})`),{code:['calendar/reconnect-required','resource-exhausted'].includes(data.code)?data.code:'calendar/request-failed',status:response.status});
    return data;
  }
  async function connect() {
    const native=bridge();
    const data=await call('start',{provider:'google',native:!!native});
    const url=new URL(data.url);
    if(url.origin!=='https://accounts.google.com'||url.pathname!=='/o/oauth2/v2/auth'||url.username||url.password||url.hash)throw new Error('Google 연결 주소를 확인하지 못했습니다.');
    if(native){
      if(typeof native.openCalendarAuth!=='function'||native.openCalendarAuth(url.href)===false)throw new Error('Google Calendar 연결을 위해 최신 앱으로 업데이트해주세요.');
    }else navigate(url.href);
    lastAt=0;
    return {pending:true};
  }
  function refresh({force=false}={}) {
    const uid=String(getUser()?.uid||'');
    if(uid!==lastUid){lastUid=uid;lastAt=0;running=null;blockedUntil=0;}
    if(!uid||!visible()||!online())return Promise.resolve(null);
    if(running)return running;
    if(now()<blockedUntil){
      if(force)return Promise.reject(Object.assign(new Error('Firebase 무료 사용량 한도로 동기화를 잠시 쉬고 있습니다. 입력한 기록은 유지됩니다.'),{code:'resource-exhausted'}));
      return Promise.resolve(null);
    }
    if(!force&&lastAt&&now()-lastAt<CALENDAR_REFRESH_MS)return Promise.resolve(null);
    lastAt=now();
    const operation=(async()=>{
      let status=await call('status');
      if(status.google?.connected&&status.google?.serverMode){
        const result=await call('sync',{provider:'google',force});
        status={...status,google:{...status.google,...result,lastSyncedAt:result.lastSyncedAt||status.google.lastSyncedAt,lastError:''}};
      }
      return status;
    })();
    running=operation;
    return operation.catch(error=>{
      if(uid===lastUid&&(error.code==='resource-exhausted'||/quota|resource.exhausted|사용량.*한도/i.test(error.message||'')))blockedUntil=now()+30*60*1000;
      throw error;
    }).finally(()=>{if(running===operation)running=null;});
  }
  return {call,connect,refresh,restoreStatus:restoredCalendarStatus,reset(){lastUid='';lastAt=0;running=null;blockedUntil=0;}};
}
