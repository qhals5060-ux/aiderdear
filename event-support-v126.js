(function(){
  'use strict';
  const albumDialog=document.createElement('div');
  albumDialog.className='album-create-v121';
  albumDialog.setAttribute('aria-hidden','true');
  albumDialog.innerHTML=`<section role="dialog" aria-modal="true" aria-labelledby="albumCreateTitleV126"><header><div><small>ALBUM</small><h2 id="albumCreateTitleV126">새 앨범</h2></div><button type="button" data-album-create-close aria-label="새 앨범 닫기">×</button></header><form id="albumCreateFormV126"><label>앨범 이름<input id="albumCreateNameV126" name="name" maxlength="60" autocomplete="off" placeholder="앨범 이름을 입력하세요" required></label><footer><button type="button" data-album-create-close>취소</button><button type="submit">만들기</button></footer></form></section>`;
  document.body.appendChild(albumDialog);
  const albumInput=albumDialog.querySelector('#albumCreateNameV126');
  function openAlbumCreate(){albumInput.value='';albumDialog.classList.add('on');albumDialog.setAttribute('aria-hidden','false');setTimeout(()=>albumInput.focus(),40)}
  function closeAlbumCreate(){albumDialog.classList.remove('on');albumDialog.setAttribute('aria-hidden','true')}
  document.addEventListener('click',event=>{if(!event.target.closest('[data-album-new]'))return;event.preventDefault();event.stopImmediatePropagation();openAlbumCreate()},true);
  albumDialog.querySelectorAll('[data-album-create-close]').forEach(button=>button.addEventListener('click',closeAlbumCreate));
  albumDialog.addEventListener('click',event=>{if(event.target===albumDialog)closeAlbumCreate()});
  albumDialog.querySelector('form').addEventListener('submit',async event=>{
    event.preventDefault();const name=String(albumInput.value||'').trim();if(!name)return albumInput.focus();
    const list=albumsV111();list.push({id:'album-'+Date.now(),name:name.slice(0,60),color:['#d9d5ff','#ffd9e4','#d8eee4','#ffe7ca'][list.length%4],createdAt:Date.now()});putAlbumsV111(list);await saveApp();closeAlbumCreate();openAlbums();
  });
  const eventRoot=document.getElementById('event');
  if(!eventRoot)return;
  function decorateTravelCards(){
    const rows=typeof eventReviewsV111==='function'?eventReviewsV111():[];
    eventRoot.querySelectorAll('.dest[data-review-edit]').forEach(card=>{const row=rows.find(item=>String(item.id)===String(card.dataset.reviewEdit));if(!row)return;const folder=typeof travelFoldersV111==='function'?travelFoldersV111().find(item=>String(item.id)===String(row.folderId||'trip-default')):null;const meta=[String(row.date||'').replaceAll('-','.'),row.place,folder?.name||'여행 준비'].filter(Boolean).join(' · ');const small=card.querySelector('small');if(small&&small.textContent!==meta)small.textContent=meta;let note=card.querySelector('.travel-card-note-v121');if(!note){note=document.createElement('p');note.className='travel-card-note-v121';card.appendChild(note)}const copy=String(row.oneLine||row.review||'').trim();if(note.textContent!==copy)note.textContent=copy});
  }
  let queued=false;const queue=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;eventRoot.classList.add('event-cosmic-v120','event-cosmic-final-v121');decorateTravelCards()})};
  new MutationObserver(queue).observe(eventRoot,{childList:true,subtree:true});queue();
})();
