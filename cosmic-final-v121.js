(function(){
  'use strict';

  const wheel=document.getElementById('wheel');
  if(!wheel)return;
  wheel.classList.add('wheel-v121');
  wheel.dataset.cosmicV121='1';
  wheel.dataset.fixedOrderV125='1';

  const icon=(paths)=>`<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
  const menuDefs={
    home:{label:'Schedule',icon:icon('<rect x="4" y="5" width="16" height="15" rx="3"></rect><path d="M8 3v4M16 3v4M4 9h16M8 13h2M14 13h2M8 17h2"></path>')},
    event:{label:'Event',icon:icon('<path d="M5 18.5V21h2.5L18.4 10.1l-2.5-2.5L5 18.5Z"></path><path d="m14.7 8.8 2.5 2.5M14.5 4.5l.6-1.7.6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6Z"></path>')},
    routine:{label:'Routine',icon:icon('<rect x="4" y="4" width="16" height="16" rx="3"></rect><path d="m7.5 9 1.4 1.4L11.5 8M13.5 9H17M7.5 15l1.4 1.4 2.6-2.4M13.5 15H17"></path>')},
    personal:{label:'Personal',icon:icon('<circle cx="12" cy="8" r="3"></circle><path d="M6.5 19c.6-3.4 2.4-5.2 5.5-5.2s4.9 1.8 5.5 5.2"></path><circle cx="12" cy="12" r="9"></circle>')},
    language:{label:'Language',icon:icon('<path d="M5 18 9.5 6h1L15 18M6.5 14h7"></path><path d="M15 8h4M17 6v9M14.5 12.5c1.2 1.2 2.7 2 4.5 2.5"></path>')},
    fifth:{label:'My',icon:icon('<path d="m12 4 2.2 4.5 5 .7-3.6 3.5.8 5-4.4-2.3-4.4 2.3.8-5-3.6-3.5 5-.7L12 4Z"></path>')}
  };
  const fixedOrder=['home','event','routine','personal','language','fifth'];
  const slots=[...wheel.querySelectorAll('.wheel-seg')];

  let fifthProxy=document.getElementById('fifthLabel');
  const initialMyLabel=fifthProxy?.textContent?.trim()||'My';
  if(fifthProxy)fifthProxy.removeAttribute('id');
  fifthProxy=document.createElement('span');
  fifthProxy.id='fifthLabel';
  fifthProxy.textContent=initialMyLabel;
  fifthProxy.hidden=true;
  document.body.appendChild(fifthProxy);

  function currentMainPage(){
    const current=typeof activePage==='string'?activePage:String(location.hash||'#home').slice(1);
    return current==='insights'?'home':(menuDefs[current]?current:'home');
  }
  function applyWheelMenus(){
    const current=currentMainPage();
    const destinations=fixedOrder.filter(page=>page!==current).slice(0,5);
    const myLabel=fifthProxy.textContent.trim()||'My';
    slots.forEach((button,index)=>{
      const page=destinations[index],def=menuDefs[page];
      if(!def)return;
      const label=page==='fifth'?myLabel:def.label;
      button.dataset.index=String(index);
      button.dataset.page=page;
      button.setAttribute('aria-label',label);
      button.title=label;
      button.innerHTML=`<i>${def.icon}</i><b>${label}</b>`;
    });
  }

  if(typeof go==='function'){
    const originalGo=go;
    go=function(...args){
      const result=originalGo.apply(this,args);
      applyWheelMenus();
      return result;
    };
  }
  applyWheelMenus();
  const previewParams=new URLSearchParams(location.search);
  if(previewParams.get('android-preview')==='1'&&previewParams.get('wheel')==='open')wheel.classList.add('open');

  const albumDialog=document.createElement('div');
  albumDialog.className='album-create-v121';
  albumDialog.setAttribute('aria-hidden','true');
  albumDialog.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="albumCreateTitleV121">
    <header><div><small>ALBUM</small><h2 id="albumCreateTitleV121">새 앨범</h2></div><button type="button" data-album-create-close aria-label="새 앨범 닫기">×</button></header>
    <form id="albumCreateFormV121"><label>앨범 이름<input id="albumCreateNameV121" name="name" maxlength="60" autocomplete="off" placeholder="앨범 이름을 입력하세요" required></label>
    <footer><button type="button" data-album-create-close>취소</button><button type="submit">만들기</button></footer></form>
  </section>`;
  document.body.appendChild(albumDialog);
  const albumInput=albumDialog.querySelector('#albumCreateNameV121');
  function openAlbumCreate(){
    albumInput.value='';
    albumDialog.classList.add('on');
    albumDialog.setAttribute('aria-hidden','false');
    setTimeout(()=>albumInput.focus(),40);
  }
  function closeAlbumCreate(){
    albumDialog.classList.remove('on');
    albumDialog.setAttribute('aria-hidden','true');
  }
  document.addEventListener('click',event=>{
    if(!event.target.closest('[data-album-new]'))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openAlbumCreate();
  },true);
  albumDialog.querySelectorAll('[data-album-create-close]').forEach(button=>button.addEventListener('click',closeAlbumCreate));
  albumDialog.addEventListener('click',event=>{if(event.target===albumDialog)closeAlbumCreate()});
  albumDialog.querySelector('form').addEventListener('submit',async event=>{
    event.preventDefault();
    const name=String(albumInput.value||'').trim();
    if(!name)return albumInput.focus();
    const list=albumsV111();
    list.push({
      id:'album-'+Date.now(),
      name:name.slice(0,60),
      color:['#d9d5ff','#ffd9e4','#d8eee4','#ffe7ca'][list.length%4],
      createdAt:Date.now()
    });
    putAlbumsV111(list);
    await saveApp();
    closeAlbumCreate();
    openAlbums();
  });

  const eventRoot=document.getElementById('event');
  if(eventRoot){
    function decorateTravelCards(){
      const rows=typeof eventReviewsV111==='function'?eventReviewsV111():[];
      eventRoot.querySelectorAll('.dest[data-review-edit]').forEach(card=>{
        const row=rows.find(item=>String(item.id)===String(card.dataset.reviewEdit));
        if(!row)return;
        const folder=typeof travelFoldersV111==='function'?travelFoldersV111().find(item=>String(item.id)===String(row.folderId||'trip-default')):null;
        const meta=[String(row.date||'').replaceAll('-','.'),row.place,folder?.name||'여행 준비'].filter(Boolean).join(' · ');
        const small=card.querySelector('small');
        if(small&&small.textContent!==meta)small.textContent=meta;
        let note=card.querySelector('.travel-card-note-v121');
        if(!note){note=document.createElement('p');note.className='travel-card-note-v121';card.appendChild(note)}
        const copy=String(row.oneLine||row.review||'').trim();
        if(note.textContent!==copy)note.textContent=copy;
      });
    }
    const observer=new MutationObserver(()=>{
      eventRoot.classList.add('event-cosmic-v120','event-cosmic-final-v121');
      decorateTravelCards();
    });
    observer.observe(eventRoot,{childList:true,subtree:true});
    eventRoot.classList.add('event-cosmic-final-v121');
    decorateTravelCards();
  }
})();
