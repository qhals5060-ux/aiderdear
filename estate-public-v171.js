/* Public immutable snapshot. No Auth SDK, private reads, editing, or automatic requests. */
const $=id=>document.getElementById(id),status=$('estateShareStatus'),requestSection=$('estateVisitRequest');
const labels={sale:'매매',jeonse:'전세',rent:'월세',apartment:'아파트',officetel:'오피스텔',house:'주택',commercial:'상가·사무실',land:'토지',other:'기타',yes:'가능',no:'불가',unknown:'미확인',negotiable:'협의 가능'};
const hash=new URLSearchParams(location.hash.slice(1)),query=new URLSearchParams(location.search);
const rawHash=location.hash.slice(1);
const token=hash.get('token')||(/^[A-Za-z0-9_-]{32,200}$/.test(rawHash)?rawHash:'')||query.get('token')||'';
const urls=new Set(),controller=new AbortController();
let shared=[],lastRequest=null,submitted=false;
const present=value=>value!==null&&value!==undefined&&value!=='';
const money=value=>present(value)&&Number.isFinite(Number(value))?Number(value).toLocaleString('ko-KR')+'원':'미확인';
const element=(tag,text,className)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=String(text);if(className)node.className=className;return node;};
async function call(action,payload){
  const response=await fetch('/api/estate',{method:'POST',credentials:'omit',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...payload}),cache:'no-store',referrerPolicy:'no-referrer',signal:controller.signal});
  let data;try{data=await response.json();}catch{throw Error('응답을 확인하지 못했습니다. 잠시 후 다시 시도해주세요.');}
  if(!response.ok||data.error)throw Error(response.status===404||response.status===410?'공유가 종료되었거나 유효하지 않은 링크입니다.':response.status===429?'잠시 후 다시 시도해주세요.':data.message||(typeof data.error==='string'?data.error:'')||'요청을 처리하지 못했습니다.');
  return data;
}
function addSpec(list,label,value){if(!present(value))return;const group=element('div'),term=element('dt',label),definition=element('dd',value);group.append(term,definition);list.append(group);}
function propertyCard(property){
  const card=element('article',undefined,'estate-public-card'),head=element('header');
  head.append(element('small',[property.number,labels[property.propertyType],labels[property.dealType]].filter(Boolean).join(' · ')),element('h2',property.title||'공유 매물'));
  const address=[property.address||property.region,property.detailAddress,property.buildingUnit,property.unit].filter(present).join(' ');if(address)head.append(element('p',address,'estate-public-address'));
  const price=property.dealType==='rent'?`보증금 ${money(property.deposit)} / 월 ${money(property.rent)}`:property.dealType==='jeonse'?`전세 ${money(property.deposit)}`:property.dealType==='sale'?money(property.price):'금액 확인 필요';head.append(element('div',price,'estate-public-price'));card.append(head);
  const specs=element('dl',undefined,'estate-public-specs');
  for(const [key,label,suffix]of [['area','전용면적','㎡'],['supplyArea','공급면적','㎡'],['rooms','방','개'],['bathrooms','욕실','개'],['approvalDate','사용승인일',''],['direction','방향',''],['availableDate','입주 가능일',''],['occupancy','현재 사용 상태',''],['recommendedBusiness','권장 업종',''],['landCategory','지목',''],['zoning','용도 지역',''],['road','도로','']])if(present(property[key]))addSpec(specs,label,String(property[key])+suffix);
  if(present(property.floor))addSpec(specs,'층',`${property.floor}층${present(property.totalFloors)?' / 전체 '+property.totalFloors+'층':''}`);
  for(const [key,label]of [['parking','주차'],['elevator','엘리베이터'],['pets','반려동물']])if(present(property[key]))addSpec(specs,label,labels[property[key]]||property[key]);
  if(present(property.managementFee))addSpec(specs,'관리비',money(property.managementFee));
  if(property.negotiable)addSpec(specs,'금액 조정','협의 가능');if(property.availableNegotiable)addSpec(specs,'입주일 조정','협의 가능');
  if(present(property.premium))addSpec(specs,'권리금',money(property.premium));card.append(specs);
  const description=element('div',undefined,'estate-public-description');
  for(const [key,label]of [['publicDescription','매물 소개'],['advantages','장점'],['disadvantages','확인할 점'],['conditions','거래 조건'],['managementIncludes','관리비 포함 항목'],['facilities','시설']])if(present(property[key]))description.append(element('h3',label),element('p',Array.isArray(property[key])?property[key].join(' · '):property[key]));
  card.append(description);
  const photos=Array.isArray(property.photos)?property.photos.filter(photo=>typeof photo.mediaId==='string').slice(0,20):[];
  if(photos.length){const panel=element('div',undefined,'estate-public-photos'),button=element('button',`선택된 사진 ${photos.length}장 보기`,'estate-public-photo-button');button.type='button';button.addEventListener('click',()=>loadPhotos(photos,panel,button));panel.append(button);card.append(panel);}
  return card;
}
async function photoUrl(id){
  const info=await call('publicMediaInfo',{token,id});
  const allowed=['image/jpeg','image/png','image/webp','image/gif','image/avif'];
  if(!allowed.includes(info.type)||!Number.isSafeInteger(info.size)||info.size<=0||info.size>20*1024*1024||!Number.isSafeInteger(info.chunkBytes)||info.chunkBytes<=0||info.chunkBytes>1024*1024)throw Error('이 사진은 온라인 미리보기를 지원하지 않습니다. 담당자에게 문의해주세요.');
  const count=Math.ceil(info.size/info.chunkBytes);if(count>160)throw Error('사진 크기를 확인할 수 없습니다.');
  const chunks=[];let total=0;
  for(let index=0;index<count;index++){const result=await call('publicMediaReadChunk',{token,id,index});const binary=atob(result.data||'');if(binary.length>info.chunkBytes)throw Error('사진 데이터가 올바르지 않습니다.');const bytes=Uint8Array.from(binary,char=>char.charCodeAt(0));total+=bytes.length;chunks.push(bytes);}
  if(total!==info.size)throw Error('사진을 모두 불러오지 못했습니다. 다시 시도해주세요.');
  const url=URL.createObjectURL(new Blob(chunks,{type:info.type}));urls.add(url);return url;
}
async function loadPhotos(photos,panel,button){
  button.disabled=true;button.textContent='사진을 불러오는 중…';
  try{const shown=new Set(Array.from(panel.querySelectorAll('img')).map(image=>image.dataset.mediaId)),remaining=photos.filter(photo=>!shown.has(photo.mediaId));for(const photo of remaining.slice(0,4)){const image=element('img');image.alt=`공유 매물 사진 ${photos.indexOf(photo)+1}`;image.dataset.mediaId=photo.mediaId;image.loading='lazy';image.src=await photoUrl(photo.mediaId);panel.append(image);}if(remaining.length>4){button.textContent=`사진 ${Math.min(4,remaining.length-4)}장 더 보기`;button.disabled=false;}else button.remove();}
  catch(error){button.textContent='불러오지 못한 사진 다시 시도';button.disabled=false;let message=panel.querySelector('p');if(!message){message=element('p');panel.append(message);}message.textContent=error.message;}
}
function chooseProperties(properties){
  const list=$('estateRequestProperties');list.replaceChildren();
  for(const property of properties){const label=element('label'),input=element('input');input.type='checkbox';input.name='propertyIds';input.value=property.id;label.append(input,element('span',property.title||property.number||'공유 매물'));list.append(label);}
}
async function initialize(){
  if(!token||token.length>300){status.textContent='공유 링크를 확인해주세요. 담당자에게 받은 전체 주소로 다시 접속해주세요.';status.dataset.error='true';return;}
  try{const data=await call('publicGet',{token});shared=Array.isArray(data.properties)?data.properties.filter(p=>p&&typeof p.id==='string').slice(0,5):[];if(!shared.length)throw Error('공유된 매물 정보가 없습니다.');const grid=$('estateSharedProperties');grid.replaceChildren(...shared.map(propertyCard));chooseProperties(shared);requestSection.hidden=false;status.textContent=`${shared.length}개 매물 비교`;const expires=new Date(data.expiresAt);$('estateShareExpiry').textContent=Number.isNaN(expires.getTime())?'담당자가 선택하여 공유한 정보입니다.':`${expires.toLocaleDateString('ko-KR')}까지 확인할 수 있습니다.`;}
  catch(error){if(controller.signal.aborted)return;status.textContent=error.message;status.dataset.error='true';requestSection.hidden=true;}
}
$('estatePublicRequestForm').addEventListener('submit',async event=>{
  event.preventDefault();if(submitted)return;const form=event.currentTarget,notice=$('estateRequestStatus'),submit=form.querySelector('button[type="submit"]');
  if(!form.reportValidity())return;
  const data=new FormData(form),propertyIds=data.getAll('propertyIds').filter(id=>shared.some(property=>property.id===id));
  if(!propertyIds.length){notice.textContent='방문하고 싶은 매물을 하나 이상 선택해주세요.';notice.dataset.error='true';return;}
  const payload={token,propertyIds,name:String(data.get('name')||'').trim(),phone:String(data.get('phone')||'').trim(),preferredDate:String(data.get('preferredDate')||''),preferredTime:String(data.get('preferredTime')||''),message:String(data.get('message')||'').trim(),consent:data.get('consent')==='on'};
  if(!payload.name||!payload.phone||!payload.consent){notice.textContent='이름·연락처와 개인정보 전달 동의를 확인해주세요.';notice.dataset.error='true';return;}
  const fingerprint=JSON.stringify(payload);if(lastRequest?.fingerprint!==fingerprint)lastRequest={fingerprint,id:crypto.randomUUID()};
  submit.disabled=true;notice.textContent='방문 희망을 전달하는 중…';delete notice.dataset.error;
  try{const result=await call('publicRequest',{...payload,requestId:lastRequest.id});if(!result.ok)throw Error('요청 접수를 확인하지 못했습니다. 다시 시도해주세요.');submitted=true;form.reset();notice.textContent='방문 희망을 전달했습니다. 담당자가 확인 후 연락드립니다. 아직 확정된 일정은 아닙니다.';submit.textContent='접수 완료';}
  catch(error){if(controller.signal.aborted)return;notice.textContent=error.message;notice.dataset.error='true';submit.disabled=false;}
});
addEventListener('pagehide',event=>{if(event.persisted)return;controller.abort();for(const url of urls)URL.revokeObjectURL(url);urls.clear();});
initialize();
