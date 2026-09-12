/* Shared photo batches: successful uploads survive retry; no record is committed here. */
(function(root){
  'use strict';
  const MAX=12, MAX_BYTES=25*1024*1024,batches=new Set(),viewers=new Set();
  function safeSource(value){const source=String(value||'');return /^(blob:|https?:\/\/|data:image\/[a-z0-9.+-]+;base64,)/i.test(source)?source:'';}
  function mediaItems(row){
    const rows=Array.isArray(row?.media)?row.media:Array.isArray(row?.mediaItems)?row.mediaItems:row?.media?[row.media]:row?.localImage?[{localImage:row.localImage}]:[];
    return rows.map(x=>typeof x==='string'?{kind:'image',localImage:x}:x).filter(x=>x&&typeof x==='object'&&(x.fileId||x.localImage||x.url||x.src)).map(x=>({...x,...(x.src&&!x.localImage?{localImage:x.src}:{})}));
  }
  function fields(items){const list=items.map(x=>({...x}));return {media:list[0]||null,mediaItems:list,localImage:list[0]?.localImage||''};}
  function createBatch({owner=()=>'',remove=async()=>{},limit=MAX}={}){
    let rows=[],origin=[],actor=owner(),epoch=0,busy=false;
    const assert=(token,uid)=>{if(token!==epoch||uid!==owner()||uid!==actor)throw Error('계정 또는 기록창이 변경되었습니다. 다시 열어주세요.');};
    const cleanup=entry=>{if(entry.uploaded?.fileId&&actor===owner())Promise.resolve(remove(entry.uploaded.fileId)).catch(()=>{});if(entry.url)try{URL.revokeObjectURL(entry.url)}catch{}};
    const api={
      get entries(){return rows;},get busy(){return busy;},get count(){return rows.length;},
      resetIfOwnerChanged(){if(actor===owner())return false;api.reset();return true;},
      reset(existing=[]){for(const row of rows)cleanup(row);epoch++;busy=false;actor=owner();origin=existing.map(x=>({...x}));rows=origin.map((media,i)=>({key:'saved-'+i,media}));},
      add(files){if(busy)return ['사진 저장이 끝난 후 추가해주세요.'];if(actor!==owner())api.reset();const errors=[];
        for(const file of Array.from(files||[])){if(rows.length>=limit){errors.push(`사진은 한 기록에 ${limit}장까지 첨부할 수 있습니다.`);break;}
          if(!String(file?.type||'').startsWith('image/')){errors.push(`${file?.name||'파일'}: 사진 파일만 선택해주세요.`);continue;}
          if(file.size>MAX_BYTES){errors.push(`${file.name}: 사진은 25MB 이하여야 합니다.`);continue;}
          const key=[file.name,file.size,file.lastModified||0].join('|');if(rows.some(x=>x.key===key))continue;
          let url='';try{url=URL.createObjectURL(file)}catch{}rows.push({key,file,url,error:''});
        }return errors;
      },
      remove(key){if(busy)return;const index=rows.findIndex(x=>x.key===key);if(index<0)return;cleanup(rows[index]);rows.splice(index,1);},
      async upload(upload,onProgress=()=>{}){if(busy)throw Error('사진을 저장하고 있습니다.');busy=true;const token=epoch,uid=actor;
        try{assert(token,uid);for(const row of rows){if(row.media||row.uploaded)continue;row.error='';
          try{const uploaded=await upload(row.file);if(token!==epoch&&uid===owner()&&uploaded?.fileId)Promise.resolve(remove(uploaded.fileId)).catch(()=>{});assert(token,uid);if(!uploaded||typeof uploaded!=='object'||Array.isArray(uploaded)||!(typeof uploaded.fileId==='string'&&uploaded.fileId.trim()||safeSource(uploaded.localImage||uploaded.url||uploaded.src)))throw Error('사진 저장 결과를 확인하지 못했습니다. 다시 시도해주세요.');row.uploaded=uploaded;}
          catch(error){if(token!==epoch||uid!==owner())throw error;row.error=String(error?.message||'업로드 실패');}onProgress();
        }assert(token,uid);const failed=rows.filter(x=>x.error);if(failed.length)throw Error(`${failed.length}장 업로드 실패. 선택한 사진과 완료된 업로드는 유지됩니다. 저장을 다시 누르거나 실패한 사진을 제외해주세요.`);
        return rows.map(x=>({...x.media||x.uploaded}));}finally{if(token===epoch)busy=false;}
      },
      committed(){const retained=new Set(rows.map(x=>(x.media||x.uploaded)?.fileId).filter(Boolean)),removed=origin.filter(x=>x.fileId&&!retained.has(x.fileId));
        for(const row of rows){if(row.url)try{URL.revokeObjectURL(row.url)}catch{}row.media=row.media||row.uploaded;delete row.uploaded;delete row.file;delete row.url;}
        origin=rows.map(x=>({...x.media}));for(const row of removed)if(actor===owner())Promise.resolve(remove(row.fileId)).catch(()=>{});
      }
    };batches.add(api);return api;
  }
  function mountPreview(host,batch,resolve=async()=>'',changed=()=>{}){
    if(!host)return;host.classList.add('photo-batch-v176');host.replaceChildren();
    for(const entry of batch.entries){const cell=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption'),button=document.createElement('button');
      img.alt=entry.file?.name||entry.media?.name||'첨부 사진';caption.textContent=entry.error?`${img.alt} · 업로드 실패`:entry.uploaded?'업로드 완료':entry.file?.name||entry.media?.name||'저장된 사진';
      if(entry.error){cell.classList.add('has-error');caption.title=entry.error;}const src=safeSource(entry.url||entry.media?.localImage||entry.media?.url);if(src)img.src=src;else if(entry.media)Promise.resolve(resolve(entry.media)).then(src=>{if(cell.isConnected&&safeSource(src))img.src=safeSource(src)}).catch(()=>{caption.textContent='사진을 불러오지 못했습니다.';});
      button.type='button';button.textContent='×';button.ariaLabel=`${img.alt} 제외`;button.disabled=batch.busy;button.onclick=()=>{batch.remove(entry.key);mountPreview(host,batch,resolve,changed);changed();};cell.append(img,caption,button);host.append(cell);
    }
  }
  async function compressPhoto(file,{max=1600,budget=500000}={}){
    const url=URL.createObjectURL(file);try{const img=await new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error('사진을 읽을 수 없습니다. 다른 파일을 선택해주세요.'));i.src=url;});
      const scale=Math.min(1,max/Math.max(img.naturalWidth||img.width,img.naturalHeight||img.height)),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round((img.naturalWidth||img.width)*scale));canvas.height=Math.max(1,Math.round((img.naturalHeight||img.height)*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      let quality=.82,blob;do{blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));quality-=.1;}while(blob&&blob.size>budget&&quality>.22);
      while(blob&&blob.size>budget&&canvas.width>320){const smaller=document.createElement('canvas');smaller.width=Math.round(canvas.width*.75);smaller.height=Math.round(canvas.height*.75);smaller.getContext('2d').drawImage(canvas,0,0,smaller.width,smaller.height);canvas.width=smaller.width;canvas.height=smaller.height;canvas.getContext('2d').drawImage(smaller,0,0);blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.65));}
      if(!blob||blob.size>budget)throw Error('사진을 압축하지 못했습니다. 다른 사진을 선택해주세요.');return new File([blob],String(file.name||'photo').replace(/\.[^.]+$/,'')+'.jpg',{type:'image/jpeg',lastModified:file.lastModified||Date.now()});
    }finally{URL.revokeObjectURL(url);}
  }
  const dataUrl=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||''));reader.onerror=()=>reject(Error('사진 읽기에 실패했습니다.'));reader.readAsDataURL(blob);});
  async function gallery(items,resolve,title='첨부 사진'){
    const overlay=document.createElement('div');overlay.className='photo-viewer-v176';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-label',title);let index=0,current='';
    const close=document.createElement('button'),image=document.createElement('img'),bar=document.createElement('footer'),prev=document.createElement('button'),next=document.createElement('button'),counter=document.createElement('span'),download=document.createElement('a');
    close.textContent='×';close.ariaLabel='사진 닫기';close.className='photo-viewer-close';prev.textContent='‹';prev.ariaLabel='이전 사진';next.textContent='›';next.ariaLabel='다음 사진';download.textContent='↓';download.ariaLabel='사진 다운로드';image.alt=title;bar.append(prev,counter,next,download);overlay.append(close,image,bar);document.body.append(overlay);
    const dismiss=()=>{overlay.remove();viewers.delete(dismiss);document.removeEventListener('keydown',keys);};viewers.add(dismiss);close.onclick=dismiss;overlay.onclick=e=>{if(e.target===overlay)dismiss();};const keys=e=>{if(e.key==='Escape')dismiss();};document.addEventListener('keydown',keys);
    async function show(){const item=items[index],token=String(index);current=token;counter.textContent=`${index+1} / ${items.length}`;prev.disabled=index===0;next.disabled=index===items.length-1;image.removeAttribute('src');download.removeAttribute('href');download.setAttribute('aria-disabled','true');try{const src=safeSource(item.localImage||item.url||await resolve(item));if(current!==token||!overlay.isConnected)return;if(!src)throw Error('사진 주소를 확인해주세요.');image.src=src;download.href=src;download.removeAttribute('aria-disabled');download.download=item.name||'photo.jpg';}catch{image.alt='사진을 불러오지 못했습니다. 다시 열어주세요.';}}
    prev.onclick=()=>{if(index>0){index--;show();}};next.onclick=()=>{if(index<items.length-1){index++;show();}};await show();
  }
  let visibleOwner=String(root.AiderDearFirebase?.getState?.()?.user?.uid||'');
  root.addEventListener?.('aiderdear-firebase-state',()=>{const next=String(root.AiderDearFirebase?.getState?.()?.user?.uid||'');let changed=false;for(const batch of batches)changed=batch.resetIfOwnerChanged()||changed;if(next!==visibleOwner||changed){visibleOwner=next;for(const dismiss of [...viewers])dismiss();root.document?.querySelectorAll('.photo-batch-v176').forEach(host=>host.replaceChildren());root.dispatchEvent?.(new CustomEvent('aiderlog-photo-owner-reset-v176'));}});
  const api={MAX,mediaItems,fields,createBatch,mountPreview,compressPhoto,dataUrl,gallery,safeSource};root.AiderLogPhotosV176=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
