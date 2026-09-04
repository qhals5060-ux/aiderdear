(() => {
  'use strict';
  const $=(selector,root=document)=>root.querySelector(selector);
  const $$=(selector,root=document)=>Array.from(root.querySelectorAll(selector));
  const safe=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const fontBases=new WeakMap();
  const observedRoots=new WeakSet();
  let typeQueued=false,typeApplying=false,mailTab='received',wheelGesture=null,ignoreWheelClickUntil=0;
  const appShellMode=location.protocol==='file:'||Boolean(window.AiderLogNative)||new URLSearchParams(location.search).get('android-preview')==='1';

  function textTargets(root){
    const result=new Set();
    const doc=root.ownerDocument||document;
    const walker=doc.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    let node;
    while((node=walker.nextNode())){
      if(!node.nodeValue.trim())continue;
      const parent=node.parentElement;
      if(!parent||parent.closest('script,style,noscript,svg,canvas,video,audio'))continue;
      result.add(parent);
    }
    $$('input,select,textarea,button',root).forEach(node=>{
      if(!node.closest('svg'))result.add(node);
    });
    return [...result];
  }

  function shadowRoots(){return $$('aiderlog-language-lab').map(host=>host.shadowRoot).filter(Boolean)}

  function observeRoot(root){
    if(!root||observedRoots.has(root))return;
    observedRoots.add(root);
    new MutationObserver(records=>{if(!typeApplying&&records.some(record=>record.addedNodes.length))queueTypography()}).observe(root,{childList:true,subtree:true});
  }

  function applyTypography(){
    if(typeApplying)return;
    typeApplying=true;typeQueued=false;
    const html=document.documentElement,mode=['small','normal','large'].includes(html.dataset.appFontSize)?html.dataset.appFontSize:'normal';
    const scale={small:.93,normal:1,large:1.075}[mode];
    const roots=[document,...shadowRoots()];
    roots.forEach(observeRoot);
    /* Derive the normal-size baseline from the active scale, then resize only
       glyphs. Avoiding a temporary dataset change also prevents observer loops. */
    const targets=roots.flatMap(textTargets);
    targets.forEach(node=>{
      if(fontBases.has(node))return;
      const size=parseFloat(getComputedStyle(node).fontSize);
      if(Number.isFinite(size)&&size>0)fontBases.set(node,size/scale);
    });
    targets.forEach(node=>{
      const base=fontBases.get(node);if(!base)return;
      const next=Math.max(7,Math.min(42,base*scale));
      node.style.setProperty('font-size',`${Math.round(next*100)/100}px`,'important');
    });
    typeApplying=false;
  }
  function queueTypography(){if(typeQueued||typeApplying)return;typeQueued=true;requestAnimationFrame(applyTypography)}

  function enhanceSearch(){
    const box=$('#searchSheet .searchbox');if(!box||box.dataset.v142==='1')return;
    box.dataset.v142='1';
    const head=document.createElement('header');head.className='search-head-v142';
    head.innerHTML='<div><small>AIDERLOG SEARCH</small><h2>전체 검색</h2></div><button type="button" data-search-close-v142 aria-label="검색 닫기">×</button>';
    box.prepend(head);
    head.querySelector('button').addEventListener('click',()=>$('#searchSheet')?.classList.remove('on'));
  }

  function getChecklist(){
    if(typeof P!=='undefined'){
      if(!Array.isArray(P.checklists))P.checklists=[];
      return P.checklists;
    }
    try{return JSON.parse(localStorage.getItem('aiderlog-quick-notes-v142')||'[]')}catch{return[]}
  }
  async function persistChecklist(rows){
    if(typeof P!=='undefined'){
      P.checklists=rows;
      if(typeof savePrivate==='function')try{await savePrivate()}catch(error){console.warn('[v142-notepad]',error)}
    }else try{localStorage.setItem('aiderlog-quick-notes-v142',JSON.stringify(rows))}catch{}
  }
  function notepadMarkup(){return `<section class="utility-dialog-v142" role="dialog" aria-modal="true" aria-labelledby="notepadTitleV142"><header class="utility-head-v142"><div><small>QUICK NOTE</small><h2 id="notepadTitleV142">메모장</h2></div><button class="utility-close-v142" type="button" data-utility-close-v142 aria-label="메모장 닫기">×</button></header><div class="utility-body-v142"><form class="utility-compose-v142" data-note-form-v142><input name="text" maxlength="180" placeholder="메모 또는 할 일을 입력하세요" required><input name="date" type="date" aria-label="마감일"><button type="submit">추가</button></form><div class="utility-list-v142" data-note-list-v142></div></div></section>`}
  function ensureNotepad(){
    let overlay=$('#quickMemoModalV142');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.id='quickMemoModalV142';overlay.className='overlay utility-overlay-v142';overlay.innerHTML=notepadMarkup();document.body.append(overlay);
    overlay.addEventListener('click',async event=>{
      if(event.target===overlay||event.target.closest('[data-utility-close-v142]')){overlay.classList.remove('on');return}
      const check=event.target.closest('[data-note-check-v142]');
      if(check){const rows=getChecklist(),row=rows.find(item=>String(item.id)===check.dataset.noteCheckV142);if(row){row.done=check.checked;await persistChecklist(rows);renderNotepad()}return}
      const del=event.target.closest('[data-note-delete-v142]');
      if(del){await persistChecklist(getChecklist().filter(item=>String(item.id)!==del.dataset.noteDeleteV142));renderNotepad()}
    });
    $('[data-note-form-v142]',overlay).addEventListener('submit',async event=>{
      event.preventDefault();const form=event.currentTarget,text=form.elements.text.value.trim();if(!text)return;
      const rows=getChecklist();rows.push({id:`quick-${Date.now()}`,text,date:form.elements.date.value||'',done:false,createdAt:Date.now()});await persistChecklist(rows);form.reset();renderNotepad();form.elements.text.focus();
    });
    return overlay;
  }
  function renderNotepad(){
    const overlay=ensureNotepad(),list=$('[data-note-list-v142]',overlay),rows=getChecklist().slice().sort((a,b)=>Number(a.done)-Number(b.done)||(a.date||'9999').localeCompare(b.date||'9999')||(a.createdAt||0)-(b.createdAt||0));
    list.innerHTML=rows.length?rows.map(row=>`<div class="utility-row-v142 ${row.done?'done':''}"><input type="checkbox" data-note-check-v142="${safe(row.id)}" aria-label="${safe(row.text)} 완료" ${row.done?'checked':''}><span>${safe(row.text)}</span><time>${safe(row.date||'')}</time><button type="button" data-note-delete-v142="${safe(row.id)}" aria-label="삭제">×</button></div>`).join(''):'<div class="utility-empty-v142">메모나 오늘 할 일을 바로 남겨보세요.</div>';
  }
  function openNotepad(){renderNotepad();ensureNotepad().classList.add('on');setTimeout(()=>$('[data-note-form-v142] input[name="text"]')?.focus(),30)}

  function firebase(){return window.AiderDearFirebase}
  function firebaseState(){return firebase()?.getState?.()||{}}
  function recipients(state=firebaseState()){
    const rows=[];if(state.partner?.uid)rows.push({...state.partner,kind:'커플'});
    (state.friends||[]).forEach(friend=>friend?.uid&&rows.push({...friend,kind:'친구'}));
    return [...new Map(rows.map(row=>[row.uid,row])).values()];
  }
  function letterTime(value){const stamp=Number(value)||Date.now();try{return new Intl.DateTimeFormat('ko-KR',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(stamp))}catch{return''}}
  function mailboxMarkup(){return `<section class="utility-dialog-v142" role="dialog" aria-modal="true" aria-labelledby="mailboxTitleV142"><header class="utility-head-v142"><div><small>CONNECTED LETTERS</small><h2 id="mailboxTitleV142">우편함</h2></div><button class="utility-close-v142" type="button" data-utility-close-v142 aria-label="우편함 닫기">×</button></header><div class="utility-body-v142" data-mail-body-v142></div></section>`}
  function ensureMailbox(){
    let overlay=$('#mailboxModalV142');if(overlay)return overlay;
    overlay=document.createElement('div');overlay.id='mailboxModalV142';overlay.className='overlay utility-overlay-v142';overlay.innerHTML=mailboxMarkup();document.body.append(overlay);
    overlay.addEventListener('click',async event=>{
      if(event.target===overlay||event.target.closest('[data-utility-close-v142]')){overlay.classList.remove('on');return}
      const tab=event.target.closest('[data-mail-tab-v142]');if(tab){mailTab=tab.dataset.mailTabV142;renderMailbox();return}
      if(event.target.closest('[data-mail-login-v142]')){try{await firebase()?.login?.()}catch(error){alert(error?.message||'Google 로그인을 시작하지 못했습니다.')}return}
      const letter=event.target.closest('[data-letter-v142]');if(letter&&letter.classList.contains('unread')){try{await firebase()?.markDirectLetterRead?.(letter.dataset.letterV142)}catch{}renderMailbox()}
    });
    return overlay;
  }
  function renderMailbox(){
    const overlay=ensureMailbox(),host=$('[data-mail-body-v142]',overlay),state=firebaseState(),user=state.user;
    if(!user){host.innerHTML='<div class="mail-login-v142"><p>Google 로그인 후 연결된 커플·친구와<br>우편을 주고받을 수 있어요.</p><button type="button" data-mail-login-v142>Google 로그인</button></div>';return}
    const people=recipients(state),letters=Array.isArray(state.directLetters)?state.directLetters:[],uid=String(user.uid||'');
    const rows=(mailTab==='sent'?letters.filter(row=>String(row.fromUid||'')===uid):letters.filter(row=>String(row.toUid||'')===uid)).slice().sort((a,b)=>(Number(b.createdAt)||0)-(Number(a.createdAt)||0));
    host.innerHTML=`${people.length?`<form class="utility-compose-v142" data-mail-form-v142><select name="recipient" aria-label="받는 사람">${people.map(row=>`<option value="${safe(row.uid)}">${safe(row.kind)} · ${safe(row.name||row.email)}</option>`).join('')}</select><span></span><button type="submit">보내기</button><textarea name="body" maxlength="800" placeholder="마음을 담은 우편을 적어보세요" required></textarea></form>`:'<div class="utility-empty-v142" style="min-height:90px">개인 페이지에서 커플이나 친구를 연결하면 우편을 보낼 수 있어요.</div>'}<nav class="mail-tabs-v142"><button type="button" data-mail-tab-v142="received" class="${mailTab==='received'?'active':''}">받은 우편</button><button type="button" data-mail-tab-v142="sent" class="${mailTab==='sent'?'active':''}">보낸 우편</button></nav><div class="utility-list-v142">${rows.length?rows.map(row=>{const incoming=String(row.toUid||'')===uid,unread=incoming&&(!Array.isArray(row.readBy)||!(row.readBy||[]).includes(uid));const who=incoming?(row.fromName||row.fromEmail||'보낸 사람'):(row.toName||row.toEmail||'받는 사람');return `<button type="button" class="mail-row-v142 ${unread?'unread':''}" data-letter-v142="${safe(row.id)}"><span><b>${incoming?'From.':'To.'} ${safe(who)}</b><p>${safe(row.body||'')}</p></span><time>${safe(letterTime(row.createdAt))}</time></button>`}).join(''):'<div class="utility-empty-v142">아직 우편이 없습니다.</div>'}</div>`;
    const form=$('[data-mail-form-v142]',host);if(form)form.addEventListener('submit',async event=>{
      event.preventDefault();const person=people.find(row=>row.uid===form.elements.recipient.value),body=form.elements.body.value.trim();if(!person||!body)return;
      const button=form.querySelector('button[type="submit"]');button.disabled=true;button.textContent='보내는 중';
      try{await firebase()?.sendDirectLetter?.({toUid:person.uid,toEmail:person.email,toName:person.name||person.email,body});form.elements.body.value='';mailTab='sent';renderMailbox()}catch(error){alert(error?.message||'우편을 보내지 못했습니다.')}finally{if(button.isConnected){button.disabled=false;button.textContent='보내기'}}
    });
  }
  function openMailbox(){renderMailbox();ensureMailbox().classList.add('on')}

  function bindUtilityButtons(){
    if(!appShellMode)return;
    const memo=$('.top button[aria-label="memo"]');if(memo){memo.id='quickMemoBtn';if(memo.dataset.v142!=='1'){memo.dataset.v142='1';memo.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();openNotepad()},true)}}
    const mail=$('.top button[aria-label="mail"]');if(mail){mail.id='mailboxBtn';mail.hidden=false;if(mail.dataset.v142!=='1'){mail.dataset.v142='1';mail.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();openMailbox()},true)}}
  }

  function setWheelOpen(open){
    const wheel=$('#wheel'),core=$('#wheelCore');if(!wheel||!core)return;
    wheel.classList.toggle('open',!!open);core.setAttribute('aria-expanded',String(!!open));core.setAttribute('aria-label',open?'글로벌 메뉴 닫기':'글로벌 메뉴 열기');
    if(!open)clearWheelSelection();
  }
  function clearWheelSelection(){
    $$('.global-wheel-item-v126').forEach(item=>{item.classList.remove('hovered');delete item.dataset.wheelSelectedV142});
    if(wheelGesture)wheelGesture.selected=null;
  }
  function nearestWheelItem(x,y){
    let selected=null,best=82;
    $$('.global-wheel-item-v126').forEach(item=>{const rect=item.getBoundingClientRect();if(!rect.width||!rect.height)return;const distance=Math.hypot(x-(rect.left+rect.width/2),y-(rect.top+rect.height/2));if(distance<best){best=distance;selected=item}});
    $$('.global-wheel-item-v126').forEach(item=>{const active=item===selected;item.classList.toggle('hovered',active);if(active)item.dataset.wheelSelectedV142='true';else delete item.dataset.wheelSelectedV142});
    if(wheelGesture)wheelGesture.selected=selected;return selected;
  }
  function navigateWheel(item){const page=item?.dataset.page;if(!page)return;setWheelOpen(false);if(typeof window.go==='function')window.go(page,true);else location.hash=page;navigator.vibrate?.(7)}
  function installWheelControl(){
    const wheel=$('#wheel'),core=$('#wheelCore');if(!wheel||!core||wheel.dataset.controlV142==='1')return;
    wheel.dataset.controlV142='1';
    document.addEventListener('pointerdown',event=>{
      const item=event.target.closest?.('.global-wheel-item-v126'),pressedCore=event.target.closest?.('#wheelCore');if(!item&&!pressedCore)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      const wasOpen=wheel.classList.contains('open');setWheelOpen(true);
      wheelGesture={id:event.pointerId,wasOpen,startX:event.clientX,startY:event.clientY,selected:item||null,core:!!pressedCore};
      if(item){item.classList.add('hovered');item.dataset.wheelSelectedV142='true'}else nearestWheelItem(event.clientX,event.clientY);
      try{core.setPointerCapture?.(event.pointerId)}catch{}
      navigator.vibrate?.(5);
    },true);
    document.addEventListener('pointermove',event=>{
      if(!wheelGesture||event.pointerId!==wheelGesture.id)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();nearestWheelItem(event.clientX,event.clientY);
    },true);
    const finish=event=>{
      if(!wheelGesture||event.pointerId!==wheelGesture.id)return;event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      const state=wheelGesture,moved=Math.hypot(event.clientX-state.startX,event.clientY-state.startY),selected=nearestWheelItem(event.clientX,event.clientY);wheelGesture=null;ignoreWheelClickUntil=Date.now()+320;
      try{core.releasePointerCapture?.(event.pointerId)}catch{}
      if(selected&&(!state.core||moved>10)){navigateWheel(selected);return}
      clearWheelSelection();if(state.wasOpen&&moved<12)setWheelOpen(false);else setWheelOpen(true);
    };
    document.addEventListener('pointerup',finish,true);
    document.addEventListener('pointercancel',event=>{if(!wheelGesture||event.pointerId!==wheelGesture.id)return;event.preventDefault();event.stopImmediatePropagation();wheelGesture=null;clearWheelSelection();setWheelOpen(false)},true);
    document.addEventListener('click',event=>{
      const item=event.target.closest?.('.global-wheel-item-v126'),pressedCore=event.target.closest?.('#wheelCore');if(!item&&!pressedCore)return;
      event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
      if(Date.now()<ignoreWheelClickUntil)return;
      if(item)navigateWheel(item);else setWheelOpen(!wheel.classList.contains('open'));
    },true);
    core.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setWheelOpen(!wheel.classList.contains('open'))}});
  }

  function closeTopUtility(){
    const open=$('.utility-overlay-v142.on');if(open){open.classList.remove('on');return true}
    if($('#searchSheet.on')){$('#searchSheet').classList.remove('on');return true}
    return false;
  }
  function refresh(){bindUtilityButtons();enhanceSearch();installWheelControl();queueTypography()}
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeTopUtility()});
  addEventListener('aiderdear-firebase-state',()=>{if($('#mailboxModalV142.on'))renderMailbox();queueTypography()});
  new MutationObserver(records=>{
    if(records.some(record=>record.addedNodes.length)){bindUtilityButtons();enhanceSearch();installWheelControl();queueTypography()}
    if(!typeApplying&&records.some(record=>record.type==='attributes'&&record.attributeName==='data-app-font-size'))queueTypography();
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-app-font-size']});
  window.AiderLogV142={openNotepad,openMailbox,closeTopUtility,applyTypography};
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',refresh,{once:true}):refresh();
})();
