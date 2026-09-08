/* No private ESTATE records in localStorage, pair payloads, or service-worker caches. */
export function createEstateClient(onIdentityChange=()=>{}) {
  let actor='',generation=0;const urls=new Map();
  const identity=()=>{const next=window.AiderDearFirebase?.getState?.().user?.uid||'';if(actor!==next){actor=next;generation++;urls.forEach(URL.revokeObjectURL);urls.clear();onIdentityChange(next);}return actor;};
  async function call(action,payload={}) {
    const uid=identity(),epoch=generation;if(!uid)throw Error('AiderLog에 로그인한 뒤 사용할 수 있습니다.');
    const body=JSON.stringify({...payload,action,requestId:payload.requestId||crypto.randomUUID()});
    for(let attempt=0;attempt<2;attempt++) {
      try {
        const token=await window.AiderDearFirebase.getFirebaseIdToken();
        if(identity()!==uid||generation!==epoch)throw Error('로그인 계정이 변경되었습니다. 다시 열어주세요.');
        const response=await fetch('/api/estate',{method:'POST',cache:'no-store',credentials:'same-origin',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`},body,signal:AbortSignal.timeout(45000)});
        const data=await response.json().catch(()=>({}));
        if(identity()!==uid||generation!==epoch)throw Error('로그인 계정이 변경되었습니다.');
        if(!response.ok){const error=Error(data.error||`저장소 응답 오류 (${response.status})`);error.status=response.status;throw error;}
        return data;
      } catch(error) {if(attempt||error.status&&error.status<500)throw error;}
    }
  }
  async function compress(file,max=1800,quality=.82) {
    if(!/^image\/(jpeg|png|webp)$/.test(file.type))return file;
    const bitmap=await createImageBitmap(file);try{const ratio=Math.min(1,max/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));if(!blob)throw Error('사진을 압축하지 못했습니다.');return new File([blob],file.name.replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg'});}finally{bitmap.close();}
  }
  async function sendFile(file,target) {
    if(file.size>12*1024*1024)throw Error('파일 하나는 12MB 이하로 첨부해주세요.');
    const start=await call('mediaBegin',{...target,name:file.name,type:file.type||'application/octet-stream',size:file.size});
    const chunkBytes=start.chunkBytes||384*1024;
    try{for(let offset=0,index=0;offset<file.size;offset+=chunkBytes,index++){const bytes=new Uint8Array(await file.slice(offset,offset+chunkBytes).arrayBuffer());let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));await call('mediaChunk',{id:start.id,index,data:btoa(s)});}return await call('mediaFinish',{id:start.id});}
    catch(error){try{await call('mediaDelete',{id:start.id});}catch{}throw error;}
  }
  async function upload(file,target) {
    const compressed=await compress(file),saved=await sendFile(compressed,target);
    if(target.entityCollection==='properties'&&target.thumbnail!==false&&/^image\/(jpeg|png|webp)$/.test(compressed.type))try{const thumbnail=await sendFile(await compress(compressed,360,.72),target);saved.thumbId=thumbnail.id;}catch(error){try{await call('mediaDelete',{id:saved.id});}catch{}throw error;}
    return {...saved,name:compressed.name,type:compressed.type,size:compressed.size};
  }
  async function download(id) {
    const uid=identity(),epoch=generation;
    const info=await call('mediaInfo',{id}),parts=[];
    for(let index=0;index<Math.ceil(info.size/(info.chunkBytes||384*1024));index++){const part=await call('mediaReadChunk',{id,index});parts.push(Uint8Array.from(atob(part.data),c=>c.charCodeAt(0)));}
    const blob=new Blob(parts,{type:info.type});if(blob.size!==info.size)throw Error('파일 크기가 일치하지 않습니다. 다시 다운로드해주세요.');
    if(info.sha256){const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer())),n=>n.toString(16).padStart(2,'0')).join('');if(digest!==info.sha256)throw Error('파일 검증에 실패했습니다.');}
    if(identity()!==uid||generation!==epoch)throw Error('로그인 계정이 변경되었습니다. 파일을 다시 열어주세요.');
    return {blob,name:info.name,type:info.type};
  }
  async function image(id){const uid=identity(),epoch=generation;if(urls.has(id))return urls.get(id);const {blob}=await download(id);if(identity()!==uid||generation!==epoch)throw Error('로그인 계정이 변경되었습니다.');if(!/^image\/(jpeg|png|webp)$/.test(blob.type))throw Error('지원하지 않는 이미지입니다.');const url=URL.createObjectURL(blob);urls.set(id,url);return url;}
  return {call,upload,download,image,identity,clear(){urls.forEach(URL.revokeObjectURL);urls.clear();}};
}
