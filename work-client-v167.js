/* Authenticated Work API client. No credentials, role switches or local data fallback. */
(() => {
  'use strict';
  const CHUNK = 384 * 1024, LIMIT = 25 * 1024 * 1024;
  const readActions = new Set(['identity','context','list','get','draftList','draftGet','preview','mediaInfo','mediaReadChunk','history','reviewHistory','legacyList']);
  const mime = new Set(['image/jpeg','image/png','image/webp','application/pdf','video/mp4','video/webm','text/plain','text/csv']);
  const requestId = () => crypto.randomUUID();
  const error = (message, status = 0) => Object.assign(new Error(message), {status});
  function encode(bytes) { let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(binary); }
  function decode(value) { const binary=atob(value);return Uint8Array.from(binary,c=>c.charCodeAt(0)); }
  function create(getToken) {
    if(typeof getToken!=='function')throw new TypeError('인증 함수가 필요합니다.');
    const uploads=new WeakMap();
    async function call(action, payload = {}) {
      const body={...payload,action};if(!readActions.has(action)&&!body.requestId)body.requestId=requestId();
      const serialized=JSON.stringify(body);
      for(let attempt=0;attempt<2;attempt++){
        const token=await getToken();if(!token)throw error('로그인이 필요합니다.',401);
        let response;
        try { response=await fetch('/api/work',{method:'POST',cache:'no-store',credentials:'same-origin',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:serialized}); }
        catch { if(!attempt)continue;throw Object.assign(error('연결되지 않았습니다. 저장 결과를 확인하고 다시 시도해주세요.'),{requestId:body.requestId}); }
        let data;try{data=await response.json();}catch{throw error('서버 응답을 확인할 수 없습니다.',response.status);}
        if(!response.ok){if(response.status>=500&&!attempt)continue;throw Object.assign(error(data?.error||'요청을 처리할 수 없습니다.',response.status),{requestId:body.requestId});}
        return data;
      }
    }
    async function pages(action, payload={}) {
      const rows=[],seen=new Set();let cursor=null;
      do { const page=await call(action,{...payload,...(cursor?{cursor}:{})});if(!Array.isArray(page.rows))throw error('목록 형식이 올바르지 않습니다.');rows.push(...page.rows);cursor=page.cursor||null;if(cursor&&seen.has(cursor))throw error('목록 페이지가 반복되었습니다.');if(cursor)seen.add(cursor); } while(cursor);
      return rows;
    }
    async function upload(file) {
      if(!file||!mime.has(file.type)||file.size<=0||file.size>LIMIT)throw error('사진·PDF·MP4·WebM·텍스트 파일은 25MB 이하로 첨부해주세요.',400);
      let state=uploads.get(file);
      if(!state){state={begin:requestId(),finish:requestId(),chunks:[],next:0};uploads.set(file,state);}
      if(!state.id){const result=await call('mediaBegin',{requestId:state.begin,name:file.name,type:file.type,size:file.size});state.id=result.id;state.chunkBytes=result.chunkBytes||CHUNK;}
      for(let i=state.next;i<Math.ceil(file.size/state.chunkBytes);i++){
        const bytes=new Uint8Array(await file.slice(i*state.chunkBytes,Math.min(file.size,(i+1)*state.chunkBytes)).arrayBuffer());
        state.chunks[i] ||= requestId();await call('mediaChunk',{requestId:state.chunks[i],id:state.id,index:i,data:encode(bytes)});state.next=i+1;
      }
      if(!state.ready){await call('mediaFinish',{requestId:state.finish,id:state.id});state.ready=true;}
      return {id:state.id,name:file.name,type:file.type,size:file.size,ready:true};
    }
    async function download(id) {
      const info=await call('mediaInfo',{id});if(!Number.isInteger(info.size)||info.size<=0||info.size>LIMIT)throw error('파일 크기를 확인해주세요.');
      const parts=[];for(let i=0;i<Math.ceil(info.size/CHUNK);i++){const part=await call('mediaReadChunk',{id,index:i});parts.push(decode(part.data));}
      const blob=new Blob(parts,{type:info.type});if(blob.size!==info.size)throw error('다운로드가 완전하지 않습니다. 다시 시도해주세요.');
      if(info.sha256){const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()));const actual=[...digest].map(n=>n.toString(16).padStart(2,'0')).join('');if(actual!==info.sha256)throw error('파일 무결성 검사에 실패했습니다.');}
      return {blob,name:info.name,type:info.type,size:info.size};
    }
    return Object.freeze({call,pages,all:collection=>pages('list',{collection}),drafts:()=>pages('draftList'),upload,download});
  }
  window.AiderWorkClientV167=Object.freeze({create,requestId});
})();
