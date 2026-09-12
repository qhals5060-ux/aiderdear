/* Native browser handoff only. No provider/Firebase tokens are stored here. */
export const ANDROID_LOGIN_PENDING_KEY='aiderlog-android-login-pending-v176';
const TTL=20*60*1000;
const fail=(code,message)=>Object.assign(new Error(message),{code});
// Provider errors may carry bearer credentials in message/customData. Never
// expose their object, stack, cause or arbitrary code to callers or diagnostics.
const SAFE_ERRORS=Object.freeze({
  'auth/native-unavailable':'앱의 시스템 브라우저 연결을 사용할 수 없습니다.',
  'auth/native-launch-failed':'Google 로그인 브라우저를 열지 못했습니다. 앱에서 다시 시도해주세요.',
  'auth/cancelled':'로그인이 취소되었습니다.',
  'auth/storage-unavailable':'로그인 상태를 저장할 수 없습니다. 앱 저장 공간을 확인해주세요.',
  'auth/invalid-callback':'로그인 응답 주소가 올바르지 않습니다. 앱에서 다시 시작해주세요.',
  'auth/expired-request':'로그인 요청이 만료되었거나 일치하지 않습니다. 앱에서 다시 시작해주세요.',
  'auth/provider-error':'Google 로그인을 완료하지 못했습니다. 앱에서 다시 시도해주세요.',
  'auth/invalid-credential':'Google 인증 응답을 확인하지 못했습니다. 앱에서 다시 로그인해주세요.',
  'auth/network-request-failed':'인터넷 연결을 확인한 뒤 로그인을 다시 시도해주세요.',
  'auth/too-many-requests':'로그인 요청이 많습니다. 잠시 후 다시 시도해주세요.',
  'auth/user-disabled':'사용할 수 없는 계정입니다. 계정 상태를 확인해주세요.',
  'auth/invalid-user-token':'로그인 인증이 만료되었습니다. 앱에서 다시 로그인해주세요.',
  'auth/user-token-expired':'로그인 인증이 만료되었습니다. 앱에서 다시 로그인해주세요.',
  'auth/account-exists-with-different-credential':'이 계정의 기존 로그인 방법을 확인해주세요.',
  'auth/credential-already-in-use':'이미 다른 계정에 연결된 인증입니다. 로그인 계정을 확인해주세요.',
  'auth/operation-not-allowed':'현재 로그인 방식을 사용할 수 없습니다. 잠시 후 다시 시도해주세요.',
  'auth/unauthorized-domain':'로그인 사이트 연결을 확인하지 못했습니다. 앱에서 다시 시작해주세요.',
  'auth/app-not-authorized':'앱의 로그인 연결을 확인하지 못했습니다. 앱 업데이트를 확인해주세요.',
  'auth/invalid-api-key':'앱의 로그인 설정을 확인하지 못했습니다. 앱 업데이트를 확인해주세요.',
  'auth/invalid-oauth-client-id':'앱의 Google 로그인 설정을 확인하지 못했습니다. 앱 업데이트를 확인해주세요.',
  'auth/internal-error':'Google 로그인을 완료하지 못했습니다. 앱에서 다시 시도해주세요.',
  'auth/unknown':'Google 로그인을 완료하지 못했습니다. 앱에서 다시 시도해주세요.'
});
function safeError(error){
  let code='auth/unknown';
  try{if(typeof error?.code==='string'&&Object.prototype.hasOwnProperty.call(SAFE_ERRORS,error.code))code=error.code;}catch{}
  return fail(code,SAFE_ERRORS[code]);
}
export function createAndroidSession({auth,provider,signInWithCredential,preparePersistence,bridge,storage,crypto,now=Date.now,diagnostic=()=>{}}){
  let starting=null,completing=null,completingState='',completedState='',generation=0;
  const enabled=()=>typeof bridge()?.startGoogleLogin==='function';
  function clear(){try{storage.removeItem(ANDROID_LOGIN_PENDING_KEY)}catch{}}
  function pending(){try{return JSON.parse(storage.getItem(ANDROID_LOGIN_PENDING_KEY)||'null')}catch{return null}}
  function report(stage,error){try{diagnostic({stage,code:/^[a-z0-9/_-]{1,90}$/i.test(error?.code||'')?error.code:'auth/unknown'});}catch{}}
  async function begin(){
    if(!enabled())throw fail('auth/native-unavailable','앱의 시스템 브라우저 연결을 사용할 수 없습니다.');
    if(starting)return starting;
    if(completing)return completing;
    const epoch=generation;
    starting=(async()=>{
      await preparePersistence();await auth.authStateReady?.();
      if(epoch!==generation)throw fail('auth/cancelled','로그인이 취소되었습니다.');
      if(auth.currentUser)return {user:auth.currentUser,restored:true};
      const bytes=new Uint8Array(32);crypto.getRandomValues(bytes);
      const state=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
      try{storage.setItem(ANDROID_LOGIN_PENDING_KEY,JSON.stringify({state,createdAt:now()}));if(pending()?.state!==state)throw Error('unavailable');}
      catch{throw fail('auth/storage-unavailable','로그인 요청을 보관할 수 없습니다. 앱 저장 공간을 확인해주세요.');}
      try{bridge().startGoogleLogin('https://aiderdear1.vercel.app/android-auth.html?'+new URLSearchParams({state,release:'176'}));}
      catch(error){if(pending()?.state===state)clear();throw error;}
      return {pending:true};
    })().catch(error=>{const safe=safeError(error);report('browser-start',safe);throw safe}).finally(()=>{starting=null});
    return starting;
  }
  async function complete(raw){
    if(!enabled())throw fail('auth/native-unavailable','앱에서 시작한 로그인 요청만 처리할 수 있습니다.');
    let url;try{url=new URL(String(raw))}catch{throw fail('auth/invalid-callback','로그인 응답 주소를 확인할 수 없습니다.');}
    if(url.protocol!=='aiderlog:'||url.hostname!=='auth'||url.username||url.password||url.port||url.hash||url.pathname&&url.pathname!=='/')throw fail('auth/invalid-callback','로그인 응답 주소가 올바르지 않습니다.');
    const state=url.searchParams.get('state')||'';
    if(['state','id_token','access_token','error'].some(key=>url.searchParams.getAll(key).length>1))throw fail('auth/invalid-callback','중복된 로그인 응답입니다.');
    if(completing&&state===completingState)return completing;
    if(state&&state===completedState&&auth.currentUser)return {user:auth.currentUser,restored:true};
    const request=pending(),age=now()-Number(request?.createdAt);
    if(!/^[a-f0-9]{64}$/.test(state)||request?.state!==state||!Number.isFinite(age)||age<0||age>TTL)throw fail('auth/expired-request','로그인 요청이 만료되었거나 일치하지 않습니다. 앱에서 다시 시작해주세요.');
    if(url.searchParams.has('error')){clear();throw fail('auth/provider-error','Google 로그인을 완료하지 못했습니다. 앱에서 다시 시도해주세요.');}
    const id=url.searchParams.get('id_token')||'',access=url.searchParams.get('access_token')||'';
    if((!id&&!access)||id.length>20000||access.length>20000)throw fail('auth/invalid-credential','Google 인증 응답이 비어 있거나 올바르지 않습니다.');
    const epoch=generation;completingState=state;
    completing=(async()=>{
      await preparePersistence();await auth.authStateReady?.();
      if(epoch!==generation)throw fail('auth/cancelled','로그인이 취소되었습니다.');
      if(auth.currentUser){if(pending()?.state===state)clear();return {user:auth.currentUser,restored:true};}
      const result=await signInWithCredential(auth,provider.credential(id||null,access||null));
      completedState=epoch===generation?state:'';
      if(pending()?.state===state)clear();return result;
    })().catch(error=>{const safe=safeError(error);report('credential-exchange',safe);throw safe}).finally(()=>{completing=null;completingState=''});
    return completing;
  }
  async function cancel(){generation++;completedState='';clear();if(completing)try{await completing}catch{}}
  return {enabled,begin,complete,cancel};
}
