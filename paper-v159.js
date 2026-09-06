/* AiderLog v160 · PAPER information architecture, close reading and concept folders */
(async function(){
  'use strict';
  const workspace=window.AiderPaperWorkspace,root=workspace?.root;if(!root)return;
  const $=(s,r=root)=>r.querySelector(s),$$=(s,r=root)=>Array.from(r.querySelectorAll(s));
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read=async(path,fallback)=>{try{const res=await fetch(path,{cache:'no-store'});if(res.ok)return await res.text()}catch{}return fallback};
  const [analysisPrompt,verificationPrompt]=await Promise.all([
    read('./paper-analysis-prompt-v159.txt','첨부 논문을 aiderlog.paper.v2 JSON으로 구조화하고, 확인할 수 없는 값은 null로 출력하세요.'),
    read('./paper-verification-prompt-v159.txt','생성한 JSON을 원문과 다시 대조하고 수정된 aiderlog.paper.v2 JSON 하나만 출력하세요.')
  ]);
  const style=document.createElement('link');style.rel='stylesheet';style.href='./paper-v159.css?v=160';root.append(style);
  const nav=$('#paperNav');
  nav.innerHTML=`
    <button data-view="hub"><span>⌂</span><b>Home</b><small>연구 홈</small></button>
    <button data-view="library"><span>▤</span><b>Library</b><small>논문 자료</small></button>
    <button data-v159-view="papers"><span>▧</span><b>Papers</b><small>논문 정독</small></button>
    <button data-v159-view="concepts"><span>◫</span><b>Concepts</b><small>개념 학습</small></button>
    <button data-view="synthesis"><span>⌁</span><b>Synthesis</b><small>비교·근거 통합</small><i id="evidenceBadge" hidden></i></button>
    <button data-v159-view="ideas"><span>✦</span><b>Ideas</b><small>연구 질문</small></button>
    <button data-view="study"><span>◇</span><b>Design Studio</b><small>연구 설계</small></button>
    <button data-v159-view="notes"><span>✎</span><b>Research Notes</b><small>메모와 수집함</small></button>
    <button data-view="atlas"><span>◉</span><b>Brain</b><small>연구용 뇌 지도</small></button>
    <button data-view="lab"><span>⌬</span><b>My Lab</b><small>Yoo Lab 논문</small></button>`;
  const oldGuide=$('#guideButton');
  if(oldGuide){
    const homeButton=oldGuide.cloneNode(true);
    homeButton.id='paperResearchHomeV160';
    homeButton.textContent='연구 홈';
    homeButton.setAttribute('aria-label','Paper 연구 홈 열기');
    oldGuide.replaceWith(homeButton);
    homeButton.addEventListener('click',()=>nav.querySelector('[data-view="hub"]')?.click());
  }
  const snap=()=>window.AiderPaperBridge?.snapshot?.()||{paperItems:[],researchInsights:[],researchNotes:[],researchIdeas:[],researchDesigns:[]};
  function heading(kicker,title,text){return `<header class="v159-heading"><div><span>${esc(kicker)}</span><h1>${esc(title)}</h1></div><p>${esc(text)}</p></header>`}
  let activeConceptFolder='all';
  function conceptFolderData(){const data=snap(),folders=Array.isArray(data.paperConceptFolders)?data.paperConceptFolders:[];return folders.length?folders:[{id:'uncategorized',name:'미분류',conceptKeys:[]}]}
  async function saveConceptFolders(folders){await window.AiderPaperBridge?.saveConceptFolders?.(folders);window.AiderPaperBridge?.toast?.('개념 폴더를 저장했습니다.');renderV159View('concepts')}
  function papers(){const data=snap(),items=data.paperItems||[];return `<div class="v159-view v160-reading-view">${heading('CLOSE READING','논문을 정독 흐름으로 읽습니다','논문 자료 목록과 분리해 연구 질문, 방법, 결과, 한계와 원문 근거를 순서대로 확인합니다.')}<section class="v160-reading-list">${items.map(paper=>`<article><header><span>${esc(paper.journal||'JOURNAL')} · ${esc(paper.year||'')}</span><em>${esc(({toRead:'읽기 전',reading:'읽는 중',reviewed:'검토 완료',citationCandidate:'인용 후보'})[paper.status]||'읽는 중')}</em></header><h2>${esc(paper.title)}</h2><p>${esc(paper.summary||paper.researchQuestion||'정독 요약을 확인하세요.')}</p><dl><div><dt>연구 질문</dt><dd>${esc(paper.researchQuestion||paper.purpose||'확인 필요')}</dd></div><div><dt>대상·방법</dt><dd>${esc([paper.population,paper.method].filter(Boolean).join(' · ')||'확인 필요')}</dd></div><div><dt>핵심 결과</dt><dd>${esc(paper.findings||'원문 결과 확인 필요')}</dd></div><div><dt>중요한 한계</dt><dd>${esc(paper.limitations||'확인 필요')}</dd></div></dl><button type="button" data-v160-open-paper="${esc(paper.id)}">정독 화면 열기 →</button></article>`).join('')||'<article class="v159-empty">Library에 논문을 등록하면 정독 목록에 표시됩니다.</article>'}</section></div>`}
  function concepts(){
    const data=snap(),folders=conceptFolderData(),cards=(data.paperItems||[]).flatMap(paper=>[...(paper.keywords||paper.tags||[])].slice(0,6).map(word=>({paper,word,key:`${paper.id}::${word}`}))),selected=activeConceptFolder==='all'?cards:cards.filter(card=>(folders.find(folder=>folder.id===activeConceptFolder)?.conceptKeys||[]).includes(card.key));
    const folderOptions=folders.map(folder=>`<option value="${esc(folder.id)}">${esc(folder.name)}</option>`).join('');
    return `<div class="v159-view">${heading('CONCEPTS','논문 속 개념을 폴더별로 학습합니다','일반적인 의미와 각 논문에서 사용한 정의·측정 방식을 섞지 않습니다.')}<section class="v160-folderbar"><div class="v160-folder-tabs"><button type="button" data-concept-folder="all" class="${activeConceptFolder==='all'?'active':''}">전체 <b>${cards.length}</b></button>${folders.map(folder=>`<button type="button" data-concept-folder="${esc(folder.id)}" class="${activeConceptFolder===folder.id?'active':''}">${esc(folder.name)} <b>${(folder.conceptKeys||[]).length}</b></button>`).join('')}</div><button type="button" data-concept-folder-add>＋ 폴더</button></section><section class="v159-concept-grid">${selected.map(({paper,word,key})=>`<article data-concept-key="${esc(key)}"><span>${esc(paper.year||'')} · ${esc(paper.journal||'PAPER')}</span><h2>${esc(word)}</h2><p>${esc(paper.theory||paper.summary||'논문별 정의는 상세 분석에서 확인합니다.')}</p><dl><div><dt>이 논문에서는</dt><dd>${esc(paper.researchQuestion||paper.purpose||'확인 필요')}</dd></div><div><dt>원문 근거</dt><dd>${esc(paper.citationCandidates||'페이지·표·그림 위치 확인 필요')}</dd></div></dl><label class="v160-concept-folder-select">폴더<select data-concept-move="${esc(key)}"><option value="">미분류</option>${folderOptions}</select></label><footer><button data-paper="${esc(paper.id)}">관련 논문 열기</button><button>복습 카드</button></footer></article>`).join('')||'<article class="v159-empty">선택한 폴더에 개념 카드가 없습니다.</article>'}</section></div>`}
  function ideas(){const data=snap(),ideas=data.researchIdeas||[],designs=data.researchDesigns||[];return `<div class="v159-view">${heading('IDEAS','연구 공백을 질문과 가설로 발전시킵니다','각 아이디어는 여러 연구 설계와 참고 논문을 가질 수 있습니다.')}<section class="v159-idea-list">${ideas.map(row=>`<article><span>${esc(row.status||'IDEA')}</span><h2>${esc(row.title||'제목 없는 연구 아이디어')}</h2><p>${esc(row.researchQuestion||row.question||row.summary||'연구 질문을 구체화하세요.')}</p><dl><div><dt>가설</dt><dd>${esc(row.hypothesis||'확인 필요')}</dd></div><div><dt>연결된 설계</dt><dd>${designs.filter(item=>item.ideaId===row.id).length}개</dd></div></dl><button data-go="study">Design Studio에서 열기</button></article>`).join('')||'<article class="v159-empty">Study Workspace에서 저장한 연구 아이디어가 이곳에 표시됩니다.</article>'}</section></div>`}
  function notes(){const data=snap(),notes=data.researchNotes||[];return `<div class="v159-view">${heading('RESEARCH NOTES','읽으면서 수집한 메모와 질문','앱 CAPTURE에서 저장한 메모도 같은 계정으로 동기화됩니다.')}<section class="v159-note-list">${notes.slice().sort((a,b)=>(b.updatedAt||b.createdAt||0)-(a.updatedAt||a.createdAt||0)).map(row=>`<article><header><span>${esc((row.type||row.source||'NOTE').toUpperCase())}</span><time>${new Date(row.updatedAt||row.createdAt||Date.now()).toLocaleDateString('ko-KR')}</time></header><h2>${esc(row.title||'연구 메모')}</h2><p>${esc(row.content||row.note||'')}</p><small>${row.paperId?'논문 연결됨':'받은 편지함'}</small></article>`).join('')||'<article class="v159-empty">아직 저장한 연구 메모가 없습니다.</article>'}</section></div>`}
  function renderV159View(view){$('#paperContent').innerHTML=view==='papers'?papers():view==='concepts'?concepts():view==='ideas'?ideas():notes();$('#paperContent').scrollTop=0}
  nav.addEventListener('click',event=>{const button=event.target.closest('[data-v159-view]');if(!button)return;event.preventDefault();event.stopImmediatePropagation();const view=button.dataset.v159View;$$('#paperNav button').forEach(b=>b.classList.toggle('active',b===button));renderV159View(view)},true);
  $('#paperContent').addEventListener('click',async event=>{
    const openPaper=event.target.closest('[data-v160-open-paper]');
    if(openPaper){nav.querySelector('[data-view="library"]')?.click();requestAnimationFrame(()=>root.querySelector(`[data-paper="${CSS.escape(openPaper.dataset.v160OpenPaper)}"]`)?.click());return}
    const folderButton=event.target.closest('[data-concept-folder]');if(folderButton){activeConceptFolder=folderButton.dataset.conceptFolder;renderV159View('concepts');return}
    if(event.target.closest('[data-concept-folder-add]')){const name=prompt('새 개념 폴더 이름');if(!String(name||'').trim())return;const folders=conceptFolderData().filter(folder=>folder.id!=='uncategorized');folders.push({id:`folder-${Date.now()}`,name:String(name).trim().slice(0,50),conceptKeys:[]});await saveConceptFolders(folders)}
  });
  $('#paperContent').addEventListener('change',async event=>{const select=event.target.closest('[data-concept-move]');if(!select)return;const key=select.dataset.conceptMove,folders=conceptFolderData().filter(folder=>folder.id!=='uncategorized').map(folder=>({...folder,conceptKeys:(folder.conceptKeys||[]).filter(item=>item!==key)}));const target=folders.find(folder=>folder.id===select.value);if(target&&!target.conceptKeys.includes(key))target.conceptKeys.push(key);await saveConceptFolders(folders)});

  const drawer=$('#importDrawer'),oldSteps=$('.import-steps',drawer),oldSections=$$('.import-section,.import-validation',drawer);oldSteps?.remove();oldSections.forEach(node=>node.remove());
  const flow=document.createElement('div');flow.className='v159-import-flow';flow.innerHTML=`
    <ol class="v159-import-steps"><li class="active"><b>1</b><span>분석 프롬프트</span></li><li><b>2</b><span>구조 검사</span></li><li><b>3</b><span>2차 검증</span></li><li><b>4</b><span>미리보기·저장</span></li></ol>
    <section><header><div><span>STEP 1</span><h3>ChatGPT에 논문과 함께 넣으세요</h3></div><button id="v159CopyAnalysis">프롬프트 복사</button></header><p>PDF 원문과 확인 가능한 표·그림·Supplement를 함께 제공하세요. 확인하지 못한 값은 추측하지 않습니다.</p><textarea id="v159AnalysisPrompt" readonly></textarea></section>
    <section><header><div><span>STEP 2</span><h3>aiderlog.paper.v2 결과를 붙여넣으세요</h3></div></header><textarea id="v159Draft" placeholder="첫 분석 JSON을 붙여넣으세요."></textarea><button class="primary" id="v159ValidateDraft">구조 검사</button><div id="v159DraftReport" hidden></div></section>
    <section class="locked" id="v159VerifySection"><header><div><span>STEP 3</span><h3>원문과 2차 검증하세요</h3></div><button id="v159CopyVerify">검증 프롬프트 복사</button></header><p>Step 2 JSON과 원문을 함께 제공한 뒤, 수정된 JSON만 아래에 붙여넣으세요.</p><textarea id="v159VerifyPrompt" readonly></textarea><textarea id="v159Verified" placeholder="2차 검증으로 수정된 JSON을 붙여넣으세요."></textarea><button class="primary" id="v159ValidateVerified">검증 결과 검사</button><div id="v159VerifiedReport" hidden></div></section>
    <section class="locked" id="v159SaveSection"><header><div><span>STEP 4</span><h3>전체 내용을 확인하고 저장하세요</h3></div></header><div id="v159Preview"></div><button class="primary" id="v159Save" disabled>검증본을 Library에 저장</button></section>`;drawer.append(flow);
  $('#v159AnalysisPrompt').value=analysisPrompt;$('#v159VerifyPrompt').value=verificationPrompt;
  const copy=async(text,message)=>{try{await navigator.clipboard.writeText(text)}catch{const area=document.createElement('textarea');area.value=text;document.body.append(area);area.select();document.execCommand('copy');area.remove()}window.AiderPaperBridge?.toast?.(message)};
  $('#v159CopyAnalysis').onclick=()=>copy(analysisPrompt,'논문 분석 프롬프트를 복사했습니다.');$('#v159CopyVerify').onclick=()=>copy(verificationPrompt,'2차 검증 프롬프트를 복사했습니다.');
  const parse=value=>JSON.parse(String(value||'').trim().replace(/^```(?:json)?\s*/i,'').replace(/```$/i,'').trim());
  const locatorPresent=value=>{if(!value)return false;if(typeof value==='string')return value.trim().length>0;return Object.values(value).some(v=>String(v||'').trim())};
  function audit(payload,final=false){
    const errors=[],warnings=[];if(payload?.schemaVersion!=='aiderlog.paper.v2')errors.push('schemaVersion은 aiderlog.paper.v2여야 합니다.');
    if(!String(payload?.paper?.title||'').trim())errors.push('paper.title이 없습니다.');
    ['sourceAudit','deepReading','concepts','methods','results','figuresTables','criticalReview','researchUse','synthesisKeys','importWarnings','verificationSummary'].forEach(key=>{if(!(key in (payload||{})))errors.push(`${key} 필드가 없습니다.`)});
    const concepts=Array.isArray(payload?.concepts)?payload.concepts:[],results=Array.isArray(payload?.results)?payload.results:[],visuals=Array.isArray(payload?.figuresTables)?payload.figuresTables:[];
    if(!concepts.length)warnings.push('핵심 개념이 없습니다.');if(!results.length)warnings.push('결과 카드가 없습니다.');
    results.forEach((row,index)=>{if(!String(row.originalQuote||row.sourceQuote||row.source?.quote||'').trim())errors.push(`results[${index}] 원문 인용 누락`);if(!locatorPresent(row.locator||row.source?.locator))errors.push(`results[${index}] 원문 위치 누락`)});
    visuals.forEach((row,index)=>{if(row.visualReadable!==true&&row.visualReadable!==false)warnings.push(`figuresTables[${index}] visualReadable 확인 필요`)});
    const ids=[...concepts,...results,...visuals].map(row=>row?.id).filter(Boolean),duplicates=ids.filter((id,index)=>ids.indexOf(id)!==index);if(duplicates.length)errors.push(`중복 ID: ${[...new Set(duplicates)].join(', ')}`);
    if(final&&!payload?.verificationSummary)errors.push('2차 검증 요약 verificationSummary가 없습니다.');
    if(final&&payload?.sourceAudit?.analysisScope==='abstract')warnings.push('초록 기반 분석입니다. 전문 분석으로 표시되지 않습니다.');
    return {errors,warnings,concepts,results,visuals};
  }
  function report(target,result,success){target.hidden=false;target.className=success?'pass':'fail';target.innerHTML=`<b>${success?'검사를 통과했습니다':'저장 전 수정이 필요합니다'}</b><ul>${result.errors.map(x=>`<li>${esc(x)}</li>`).join('')}${result.warnings.map(x=>`<li class="warning">경고 · ${esc(x)}</li>`).join('')||'<li>추가 경고 없음</li>'}</ul>`}
  let draft=null,verified=null;
  $('#v159ValidateDraft').onclick=()=>{try{draft=parse($('#v159Draft').value);const result=audit(draft,false),ok=!result.errors.length;report($('#v159DraftReport'),result,ok);if(ok){$('#v159VerifySection').classList.remove('locked');$$('.v159-import-steps li').forEach((li,i)=>li.classList.toggle('active',i===2));window.AiderPaperBridge?.toast?.('구조 검사를 통과했습니다. 이제 원문과 2차 검증하세요.')}}catch(error){report($('#v159DraftReport'),{errors:[`JSON 문법 오류: ${error.message}`],warnings:[]},false)}};
  $('#v159ValidateVerified').onclick=()=>{try{verified=parse($('#v159Verified').value);const result=audit(verified,true),ok=!result.errors.length;report($('#v159VerifiedReport'),result,ok);if(ok){const p=verified.paper||{};$('#v159Preview').innerHTML=`<article><span>VERIFIED IMPORT</span><h4>${esc(p.title)}</h4><p>${esc(Array.isArray(p.authors)?p.authors.map(x=>x.name||x).join(', '):p.authors||'저자 확인 필요')}</p><dl><div><dt>개념</dt><dd>${result.concepts.length}</dd></div><div><dt>결과</dt><dd>${result.results.length}</dd></div><div><dt>표·그림</dt><dd>${result.visuals.length}</dd></div><div><dt>경고</dt><dd>${result.warnings.length}</dd></div></dl><small>AI 생성 내용은 저장 후에도 검토 전 상태로 유지됩니다.</small></article>`;$('#v159SaveSection').classList.remove('locked');$('#v159Save').disabled=false;$$('.v159-import-steps li').forEach((li,i)=>li.classList.toggle('active',i===3));window.AiderPaperBridge?.toast?.('2차 검증본을 미리볼 수 있습니다.')}}catch(error){report($('#v159VerifiedReport'),{errors:[`JSON 문법 오류: ${error.message}`],warnings:[]},false)}};
  $('#v159Save').onclick=async event=>{if(!verified)return;const button=event.currentTarget;button.disabled=true;button.textContent='Library에 저장 중…';try{const result=await window.AiderPaperBridge.saveImport(verified);workspace.refresh?.();drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');$('#importBackdrop').hidden=true;document.body.style.overflow='';window.AiderPaperBridge?.toast?.(`논문과 검증 데이터를 저장했습니다. Paper ID: ${result.id}`)}catch(error){button.disabled=false;button.textContent='검증본을 Library에 저장';window.AiderPaperBridge?.toast?.(error.message||'저장하지 못했습니다.')}};
  workspace.refresh?.();
})();
