type AssetBridge={read:()=>Promise<unknown>;save:(body:unknown)=>Promise<unknown>;history:(id:string,cursor?:number)=>Promise<unknown>;identity:()=>string};
// Deliberately build-time only. URL parameters or local storage cannot activate it.
export const ASSETS_TEMPLATE_MODE=true;
const templateRead=()=>({records:[],signedIn:false,ownerKey:'template',checkedAt:'',templateMode:true});
const templateError=()=>({ok:false,json:async()=>({error:'재테크는 미리보기입니다. 저장과 데이터 연결을 사용하지 않습니다.'})});
function bridge(){
 if(typeof window==='undefined'||window.parent===window||!new URLSearchParams(location.search).has('embedded'))throw Error('AiderLog의 PERSONAL → 재테크에서 열어 주세요.');
 let value:AssetBridge|undefined;
 try{if(window.parent.location.origin!==location.origin)throw Error();value=(window.parent as Window&{AiderAssetsBridgeV184?:AssetBridge}).AiderAssetsBridgeV184;}catch{}
 if(!value)throw Error('금융 연결을 준비하고 있습니다. 잠시 후 다시 확인해 주세요.');
 return value;
}
async function request(run:(value:AssetBridge)=>Promise<unknown>){
 try{const value=bridge(),owner=value.identity();const data=await run(value);if(value.identity()!==owner)throw Error('로그인 계정이 변경되었습니다. 다시 확인해 주세요.');return {ok:true,json:async()=>data};}
 // Parent-window errors have a different Error prototype from this iframe.
 catch(error){const message=error&&typeof error==='object'&&'message' in error&&typeof error.message==='string'?error.message:'자산 자료를 불러오지 못했습니다.';return {ok:false,json:async()=>({error:message})};}
}
export const assetRequest=(body?:unknown)=>ASSETS_TEMPLATE_MODE?Promise.resolve(body?templateError():{ok:true,json:async()=>templateRead()}):request(value=>body?value.save(body):value.read());
export const assetHistoryRequest=(id:string,cursor?:number)=>ASSETS_TEMPLATE_MODE?Promise.resolve(templateError()):request(value=>value.history(id,cursor));
