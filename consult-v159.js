/* AiderLog v159 · Consult journey layer */
(function(){
  'use strict';
  const base=window.renderConsultingWorkspace;
  if(typeof base!=='function')return;
  const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const stages=[
    {key:'proposal',number:'01',title:'목표 대학원 설계',short:'TARGET DESIGN',desc:'지원 목표·전공·지도교수와 연구 방향을 정리합니다.'},
    {key:'analysis',number:'02',title:'지원 문서 완성',short:'DOCUMENTS',desc:'연구계획서·자기소개서·포트폴리오를 과업과 파일로 관리합니다.'},
    {key:'revision',number:'03',title:'심층 면접',short:'INTERVIEW',desc:'예상 질문·답변 근거·피드백과 후속 수정을 기록합니다.'}
  ];
  function stageIndex(value){if(value==='analysis')return 1;if(value==='revision'||value==='complete')return 2;return 0}
  function enhance(){
    const host=document.querySelector('#consultingMain');
    if(!host||!host.querySelector('.consulting-client-head'))return;
    const data=typeof consultingStore==='function'?consultingStore():null;
    const selected=(data?.consultingClients||[]).find(row=>row.id===selectedConsultingClientId);
    if(!selected)return;
    document.querySelector('.task-toolbar h2')?.replaceChildren(document.createTextNode('Consulting Journey'));
    const current=stageIndex(selected.stage);
    const progress=Math.round(((current+1)/stages.length)*100);
    const roadmap=document.createElement('section');
    roadmap.className='consult-v159-roadmap';
    roadmap.innerHTML=`<header><div><span>CONSULTING JOURNEY</span><h3>${esc(selected.name)}님의 지원 준비 흐름</h3></div><div class="consult-v159-progress"><b>${progress}%</b><i style="--value:${progress}%"></i></div></header><div class="consult-v159-stages">${stages.map((item,index)=>`<button type="button" class="${index===current?'active':''} ${index<current?'done':''}" data-consult-v159-stage="${item.key}" data-client-id="${esc(selected.id)}"><span>${item.number}</span><div><small>${item.short}</small><b>${item.title}</b><p>${item.desc}</p></div><em>${index<current?'완료':index===current?'진행 중':'예정'}</em></button>`).join('')}</div></section>`;
    host.querySelector('.consulting-client-head').insertAdjacentElement('afterend',roadmap);
    const panels=[...host.querySelectorAll('.consulting-detail-grid>.consulting-panel')];
    panels[0]?.setAttribute('data-consult-section','roadmap');
    panels[1]?.setAttribute('data-consult-section','meetings');
    host.querySelector('.consulting-files-panel')?.setAttribute('data-consult-section','files');
    host.querySelector('.consulting-client-note')?.setAttribute('data-consult-section','feedback');
    const tools=document.createElement('nav');
    tools.className='consult-v159-tabs';tools.setAttribute('aria-label','컨설팅 세부 메뉴');
    tools.innerHTML=`<button class="active" data-consult-v159-target="overview">Overview</button><button data-consult-v159-target="roadmap">Roadmap</button><button data-consult-v159-target="meetings">Meetings</button><button data-consult-v159-target="feedback">Feedback</button><button data-consult-v159-target="files">Files</button><button data-consult-v159-pdf="${esc(selected.id)}">Delivery PDF</button>`;
    roadmap.insertAdjacentElement('afterend',tools);
    const note=host.querySelector('.consulting-client-note');
    if(note){note.innerHTML=`<b>FEEDBACK · NEXT ACTION</b><p>${esc(selected.note||'다음 상담에서 확인할 질문과 수정 방향을 기록하세요.')}</p><dl><div><dt>목표 대학원</dt><dd>${esc(selected.targetUniversity||selected.university||'확인 필요')}</dd></div><div><dt>연구 방향</dt><dd>${esc(selected.topic||'확인 필요')}</dd></div><div><dt>다음 상담</dt><dd>${esc(selected.nextSession||'일정 미정')}</dd></div></dl>`}
  }
  window.renderConsultingWorkspace=function(){base();enhance()};
  document.addEventListener('click',async event=>{
    const stageButton=event.target.closest('[data-consult-v159-stage]');
    if(stageButton){
      const data=consultingStore(),row=(data.consultingClients||[]).find(item=>item.id===stageButton.dataset.clientId);if(!row)return;
      row.stage=stageButton.dataset.consultV159Stage;row.updatedAt=Date.now();
      try{await savePrivateData(currentUserEmail);window.renderConsultingWorkspace();toast('컨설팅 단계를 저장했습니다.')}catch(error){toast(googleErrorMessage(error))}
      return;
    }
    const tab=event.target.closest('[data-consult-v159-target]');
    if(tab){const host=document.querySelector('#consultingMain'),target=tab.dataset.consultV159Target==='overview'?host?.querySelector('.consult-v159-roadmap'):host?.querySelector(`[data-consult-section="${tab.dataset.consultV159Target}"]`);host?.querySelectorAll('.consult-v159-tabs button').forEach(button=>button.classList.toggle('active',button===tab));target?.scrollIntoView({behavior:'smooth',block:'start'});return}
    const pdf=event.target.closest('[data-consult-v159-pdf]');
    if(pdf){
      const data=consultingStore(),client=(data.consultingClients||[]).find(row=>row.id===pdf.dataset.consultV159Pdf);if(!client)return;
      const tasks=(data.consultingTasks||[]).filter(row=>row.clientId===client.id),sessions=(data.consultingSessions||[]).filter(row=>row.clientId===client.id);
      const popup=window.open('','_blank','noopener,noreferrer');if(!popup){toast('팝업 차단을 해제한 뒤 다시 시도하세요.');return}
      popup.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(client.name)} · 컨설팅 요약</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,'Malgun Gothic',sans-serif;color:#191815;line-height:1.55}header{border-bottom:3px solid #1e1e1e;padding-bottom:18px}h1{font-family:Georgia,serif;margin:4px 0}.meta{color:#716b5e}.box{border:1px solid #bbb5a5;padding:16px;margin:16px 0}li{margin:8px 0}.tag{font-size:11px;letter-spacing:.14em;font-weight:800;color:#8d7300}</style></head><body><header><span class="tag">AIDERLOG · CONSULT DELIVERY</span><h1>${esc(client.name)} 컨설팅 진행 요약</h1><p class="meta">${esc([client.targetUniversity||client.university,client.targetMajor||client.major,client.applicationYear&&`${client.applicationYear}학년도`].filter(Boolean).join(' · '))}</p></header><section class="box"><b>연구 방향</b><p>${esc(client.topic||'확인 필요')}</p></section><section><h2>과업</h2><ul>${tasks.map(row=>`<li>${row.done?'완료':'진행'} · ${esc(row.title)}${row.dueDate?` · ${esc(row.dueDate)}`:''}</li>`).join('')||'<li>등록된 과업 없음</li>'}</ul></section><section><h2>상담 기록</h2><ul>${sessions.map(row=>`<li>${esc(row.date||'날짜 미정')} · ${esc(row.summary||'')}</li>`).join('')||'<li>등록된 상담 기록 없음</li>'}</ul></section><script>addEventListener('load',()=>print())<\/script></body></html>`);popup.document.close();
    }
  });
  window.renderConsultingWorkspace();
})();
