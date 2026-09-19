/* Approved compact DayLog / Routine presentation. Original stores, forms,
   media loading, timers, workflow actions and routine transactions stay in use. */
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const safe=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=value=>Math.max(0,Number(value)||0), pct=(a,b)=>Math.min(100,Math.round(num(a)/Math.max(1,num(b))*100));
  const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">${name==='timer'?'<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 3V2m0 6v5l3 2"/>':'<path d="M4 3v17h17M8 16v-5m5 5V6m5 10V9"/>'}</svg>`;
  const financeTypes={saving:'적금',deposit:'예금',flexible:'유동 지출',income:'수익',expense:'고정 지출'};
  const cycleNames={monthly:'매월',weekly:'매주',yearly:'매년',once:'한 번'};
  const flowNames={planned:'예정',ongoing:'진행 중',done:'완료'};
  let financeFilter='all';

  // Canonical finance fields and existing monthly payment keys are unchanged.
  if(typeof financeHTML==='function') financeHTML=function(){
    const rows=pRows('finance'),sum=items=>items.reduce((v,r)=>v+num(r.amount),0);
    const groups=[[['saving','deposit'],'적금 · 예금'],[['flexible','income'],'유동 · 수익'],[['expense'],'고정 지출']];
    const card=r=>{const d=r.details||{},payment=['saving','deposit','expense'].includes(d.financeType),checked=!!d.paymentChecks?.[financeCheckKey(r)],progress=d.goal?pct(r.amount,d.goal):0;
      const details=[['카드·계좌',d.source],['납부 주기',cycleNames[d.cycle]],['납부일',d.dueDay?`${d.dueDay}일`:null],['목표 금액',d.goal?`₩ ${money(d.goal)}`:null],['만기일',d.maturityDate],['상대·예정처',d.destination],['정산 예정일',d.expectedDate],['진행 상태',flowNames[d.flowStatus]],['기록일',r.date],['메모',r.note]].filter(([,v])=>v);
      return `<article class="l188-money-row"><div class="l188-money-heading"><span class="l188-type">${safe(financeTypes[d.financeType]||'금융')}</span><time>${safe((r.date||'').slice(2).replaceAll('-','.'))}</time><b>${safe(r.title)}</b><strong>${money(r.amount)}<small>원</small></strong></div><div class="l188-money-meta"><span>${safe(d.source||'카드·계좌 미입력')}</span><span>${safe(d.cycle?cycleNames[d.cycle]||'':'')}${d.dueDay?' '+safe(d.dueDay)+'일':''}</span>${d.maturityDate?`<span>만기 ${safe(d.maturityDate.slice(2).replaceAll('-','.'))}</span>`:''}${d.destination?`<span>${safe(d.destination)}</span>`:''}${d.expectedDate?`<span>정산 ${safe(d.expectedDate.slice(2).replaceAll('-','.'))}</span>`:''}</div>${d.goal?`<div class="l188-goal-progress"><i style="width:${progress}%"></i></div><div class="l188-money-meta"><span>목표 ${money(d.goal)}원</span><b>${progress}%</b></div>`:''}${r.note?`<p class="l188-finance-note">${safe(r.note)}</p>`:''}<div class="l188-money-foot">${payment?`<label class="paycheck"><input type="checkbox" data-fcheck="${safe(r.id)}" ${checked?'checked':''}><span>이번 납부</span></label>`:`<span class="l188-flow">${safe(flowNames[d.flowStatus]||'예정')}</span>`}<details><summary>상세</summary><dl>${details.map(([k,v])=>`<dt>${safe(k)}</dt><dd>${safe(v)}</dd>`).join('')}</dl>${r.localImage||r.media?.fileId?itemPhoto(r,'l188-money-photo'):''}</details><button data-pdelete="${safe(r.id)}" aria-label="${safe(r.title)} 삭제">×</button></div></article>`;};
    const group=([types,title])=>{const items=rows.filter(r=>types.includes(r.details?.financeType)&&(financeFilter==='all'||r.details?.financeType===financeFilter));if(financeFilter!=='all'&&!items.length)return '';return `<section class="finance-group"><h4>${title}<small>${money(sum(items))}원</small></h4>${items.map(card).join('')||'<p class="personal-empty">기록 없음</p>'}</section>`;};
    return `<section class="personal-panel l188-finance"><header><h3>금융</h3><button data-padd="finance">+ 기록</button></header><section class="l188-finance-overview"><div class="finance-summary"><span>전체 관리 금액</span><b>${money(sum(rows))}<small>원</small></b></div><div class="l188-finance-count"><b>${rows.length}</b><span>개 기록</span></div></section><nav class="l188-finance-filters" aria-label="금융 기록 분류">${[['all','전체'],...Object.entries(financeTypes)].map(([id,label])=>`<button type="button" data-l188-finance-filter="${id}" class="${financeFilter===id?'active':''}" aria-pressed="${financeFilter===id}">${label}</button>`).join('')}</nav><div class="l188-finance-layout ${financeFilter!=='all'?'filtered':''}"><div class="finance-grid">${group(groups[0])}</div><div class="finance-grid">${group(groups[1])}${group(groups[2])}</div>${financeFilter!=='all'&&!rows.some(r=>r.details?.financeType===financeFilter)?'<p class="personal-empty">기록 없음</p>':''}</div></section>`;
  };

  // Real books only; the selected spine changes presentation, never saved data.
  let selectedBook='';
  if(typeof readingHTML==='function') readingHTML=function(){
    const rows=pRows('reading'),read=rows.filter(r=>r.details?.readingStatus!=='want'),quotes=rows.filter(r=>r.details?.quote),current=rows.find(r=>String(r.id)===selectedBook)||read.find(r=>num(r.details?.currentPage)<num(r.details?.totalPages))||rows[0],d=current?.details||{},complete=read.filter(r=>num(r.details?.totalPages)>0&&num(r.details?.currentPage)>=num(r.details?.totalPages)).length;
    return `<div class="reading-v113 l188-reading"><section class="reading-hero-v113"><h2>독서</h2><button data-padd="reading">+ 책</button></section><section class="personal-panel reading-library-v113"><header><h3>나의 책장</h3><span>${rows.length}권</span></header><div class="l188-bookshelf">${rows.map((r,i)=>`<button class="l188-spine ${current?.id===r.id?'active':''}" data-l188-book="${safe(r.id)}" style="--book-h:${113+(i%4)*9}px;--book-tone:${i%5}" aria-label="${safe(r.title)}, ${r.details?.readingStatus==='want'?'읽고 싶은 책':'책 기록 보기'}"><b>${safe(r.title)}</b><span>${safe(r.details?.author||r.author||'')}</span></button>`).join('')||'<p class="personal-empty">저장된 책 없음</p>'}</div></section><section class="personal-panel reading-current-v113"><header><h3>${current?.details?.readingStatus==='want'?'읽고 싶은 책':'읽고 있는 책'}</h3>${current?`<button data-pdelete="${safe(current.id)}" aria-label="책 기록 삭제">×</button>`:''}</header>${current?`<div class="reading-featured-v113">${itemPhoto(current,'reading-featured-cover-v113')}<div><b>${safe(current.title)}</b><p>${safe(d.author||current.author||'')}</p><i><em style="width:${pct(d.currentPage,d.totalPages)}%"></em></i><small>${num(d.currentPage)} / ${num(d.totalPages)}p · ${pct(d.currentPage,d.totalPages)}%</small></div></div>`:'<p class="personal-empty">저장된 책 없음</p>'}</section><section class="reading-metrics-v113">${[['기록한 책',rows.length],['완독',complete],['기억한 문장',quotes.length],['읽은 페이지',read.reduce((n,r)=>n+num(r.details?.currentPage),0)]].map(([label,value])=>`<article><span>${label}</span><b>${value}</b></article>`).join('')}</section><section class="personal-panel reading-quotes-v113"><header><h3>남겨둔 문장</h3></header><div class="reading-quote-list-v113">${quotes.map(r=>`<blockquote><small>${safe(r.title)}</small><p>“${safe(r.details.quote)}”</p>${r.details.quotePage?`<small>p. ${safe(r.details.quotePage)}</small>`:''}</blockquote>`).join('')||'<p class="personal-empty">저장된 문장 없음</p>'}</div></section></div>`;
  };

  const personalRoot=$('#personal');
  function decoratePersonal(){
    if(!personalRoot)return;personalRoot.classList.add('app-life-v188');
    const head=$('.personal-title',personalRoot),tabs=$('.personal-tabs',personalRoot),actions=$('.personal-title-actions',personalRoot),dashboard=$('.personal-dashboard',personalRoot);if(!head||!tabs||!actions||!dashboard||dashboard.dataset.life188==='ready')return;dashboard.dataset.life188='ready';
    head.insertBefore(tabs,actions);
    const timer=$('[data-ppomodoro]',actions),stats=$('[data-poverview]',actions);
    for(const [button,name,label] of [[timer,'timer','포모도로'],[stats,'stats','통계']])if(button){button.innerHTML=icon(name);button.title=label;button.setAttribute('aria-label',label);}
    if(timer)actions.prepend(timer);
    const add=$('[data-padd]',dashboard);if(add){add.textContent=personalCategory==='reading'?'+ 책':personalCategory==='workflow'?'+ 작업':'+ 기록';add.classList.add('l188-header-add');actions.append(add);}
    $$('.daylog-toolbar-v165,.reading-hero-v113,.workflow-panel-v127>header,.l188-finance>header',dashboard).forEach(e=>e.remove());
    $$('.personal-empty',dashboard).forEach(e=>{if(/없습니다|비어 있음|기록하면|세트를|다음 단계를/.test(e.textContent))e.textContent='기록 없음';});
    const health=$('.personal-health',dashboard),tools=$('.personal-health-tools-v127',dashboard);
    if(health&&tools)health.append(tools);
    $$('.health-history>h4',dashboard).forEach(e=>{e.textContent=e.textContent.replace('최근 ','');});
    const board=$('.workflow-board',dashboard);
    if(board){const rows=pRows('workflow'),summary=$('.daylog-workflow-summary-v165',dashboard);if(summary){summary.classList.add('l188-work-summary');summary.innerHTML=[['planned','예정'],['ongoing','진행'],['done','완료']].map(([status,label])=>`<div><span>${label}</span><b>${rows.filter(r=>r.status===status).length}</b></div>`).join('');}
      $$('[data-workflow-row-v127]',board).forEach(card=>{const row=rows.find(r=>String(r.id)===card.dataset.workflowRowV127),d=row?.details||{},steps=Array.isArray(d.steps)?d.steps:[],done=steps.filter((_,i)=>d.completedSteps?.[i]).length,progress=steps.length?pct(done,steps.length):Math.min(100,num(d.progress));card.style.setProperty('--l188-progress',progress+'%');const value=document.createElement('b');value.className='l188-work-percent';value.textContent=progress+'%';$('.progress',card)?.before(value);if(d.nextAction||d.next){const next=document.createElement('p');next.className='l188-next-action';next.textContent=d.nextAction||d.next;$('.workflow-steps-v127',card)?.before(next);}});
    }
  }
  if(typeof renderPersonal==='function'){const before=renderPersonal;renderPersonal=function(){const result=before.apply(this,arguments);decoratePersonal();return result;};}
  personalRoot?.addEventListener('click',event=>{const book=event.target.closest('[data-l188-book]');if(book){selectedBook=book.dataset.l188Book;renderPersonal();}const filter=event.target.closest('[data-l188-finance-filter]');if(filter){financeFilter=filter.dataset.l188FinanceFilter;renderPersonal();}});

  const routineRoot=$('#routine');
  function routineMotivation(){
    const snapshot=window.AiderLogRoutineStatisticsV125?.snapshot?.();if(!snapshot)return '';
    const rows=snapshot.routines,stamp=today(),practiced=value=>['MINI','MORE','MAX'].includes(String(value||'').toUpperCase());
    const dayRows=Array.from({length:28},(_,i)=>{const date=new Date(stamp+'T12:00:00');date.setDate(date.getDate()-27+i);const key=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-');return{date:key,count:rows.filter(r=>practiced(r.dailyLevels?.[key])).length};});
    const current=dayRows.at(-1).count,rate=pct(current,rows.length),activeDays=dayRows.filter(d=>d.count).length,remaining=Math.max(0,rows.length-current);
    return `<section class="l188-routine-momentum"><div class="l188-ring" style="--rate:${rate}%" role="img" aria-label="오늘 ${rows.length}개 중 ${current}개 실천"><div><b>${current}<small>/${rows.length}</small></b><span>오늘 실천</span></div></div><div class="l188-momentum-copy"><span>${activeDays?`최근 28일 중 ${activeDays}일 실천`:'첫 실천을 기다리고 있어요'}</span><b>${rows.length?(remaining?`${remaining}개, 작은 시작부터`:'오늘의 루틴을 모두 실천했어요'):'나만의 루틴을 만들어보세요'}</b><button type="button" data-r165-tab="practice">실천하기 →</button></div><div class="l188-heatmap" aria-label="최근 28일 실천 기록">${dayRows.map(d=>`<i title="${d.date} · ${d.count}개 실천" aria-label="${d.date} · ${d.count}개 실천" data-level="${d.count?Math.min(4,Math.ceil(d.count/Math.max(1,rows.length)*4)):0}"></i>`).join('')}</div></section>`;
  }
  function decorateRoutine(){
    if(!routineRoot)return;routineRoot.classList.add('app-life-v188');
    const head=$('.r165-header',routineRoot),tabs=$('.r165-tabs',routineRoot),pane=$('.r165-content',routineRoot);if(!head||!tabs||!pane)return;
    const add=$('[data-routine-create-open]',head);if(add&&add.parentElement!==head)head.append(add);head.insertBefore(tabs,add||null);
    if(pane.dataset.tab==='practice'){
      const list=$('.r165-practice-list',pane);if(list)pane.replaceChildren(list);
    }else if(pane.dataset.tab==='mandala'){$('.r165-section-heading',pane)?.remove();}
    else if(pane.dataset.tab==='statistics'&&!$('.l188-routine-momentum',pane)){pane.insertAdjacentHTML('afterbegin',routineMotivation());}
  }
  if(typeof renderRoutine==='function'){const before=renderRoutine;renderRoutine=function(){const result=before.apply(this,arguments);decorateRoutine();return result;};}
  window.AiderLogLifeV188=Object.freeze({refresh(){decoratePersonal();decorateRoutine();},presentationOnly:true});
  if(typeof renderPersonal==='function')renderPersonal();if(typeof renderRoutine==='function')renderRoutine();
})();
