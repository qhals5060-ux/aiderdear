/* ESTATE workflow UI. Owner-scoped server API only; no demo or direct Firestore writes. */
import {estateStatistics} from './estate-domain-v171.js';

const STAGES=[['inquiry','문의'],['consultation','상담'],['proposal','제안'],['visit','방문'],['negotiation','협의'],['preparation','계약 준비'],['contract','계약'],['settled','완료'],['hold','보류'],['stopped','중단']];
const PRIORITIES=[['high','높음'],['normal','보통'],['low','낮음']];
const KINDS=[['contact','연락'],['followup','후속 조치'],['documents','서류'],['payment','수납'],['handover','인도'],['property-check','매물 확인'],['other','기타']];
const VISIT_STATES=[['scheduled','방문 예정'],['done','방문 완료'],['cancelled','취소']];
const TASK_STATES=[['open','진행'],['done','완료'],['cancelled','취소']];
const COLLECTION_LABELS={tasks:'업무',visits:'방문',deals:'거래',receipts:'수납',requests:'방문 희망',customers:'고객',properties:'매물'};
const stageLabel=value=>STAGES.find(([key])=>key===value)?.[1]||value||'미입력';
const numberOrNull=value=>String(value??'').trim()===''?null:Number(value);
const unique=values=>[...new Set(values.filter(Boolean))];

// Read-only private property context, not a duplicated counterparty record.
export function coBrokerDealContext(property,escape){
  if(!property)return '<p class="estate-wf-meta">매물을 선택하면 공동중개 정보를 확인할 수 있습니다.</p>';
  const partners=Array.isArray(property.coBrokers)?property.coBrokers:[];
  if(!property.coBroker&&!property.coBrokerStage&&property.coBrokerSource!=='partner'&&!partners.length&&!property.coBrokerInfo)return '<p class="estate-wf-meta">선택한 매물은 자체 중개입니다.</p>';
  const stage={available:'공동중개 가능',active:'공동중개 진행',finished:'공동중개 종료'}[property.coBrokerStage]||(property.coBroker?'공동중개 가능':'공동중개 · 상태 미설정');
  const source={own:'우리 사무소 매물',partner:'상대 사무소 매물'}[property.coBrokerSource]||'매물 출처 미확인';
  return '<h3>연결 매물의 공동중개</h3><p>'+escape(stage)+' · '+escape(source)+'</p>'+partners.slice(0,5).map(partner=>'<article class="estate-wf-cobroker-party"><strong>'+escape(partner.office||'사무소 미입력')+'</strong><p>'+escape([partner.name,partner.phone].filter(Boolean).join(' · ')||'담당자·연락처 미입력')+'</p><p>'+escape({listing:'매물 담당',customer:'고객 담당',both:'매물·고객 담당'}[partner.role]||'담당 역할 미확인')+'</p>'+(partner.terms?'<p>'+escape(partner.terms)+'</p>':'')+'</article>').join('')+(property.coBrokerInfo?'<p>'+escape(property.coBrokerInfo)+'</p>':'')+'<p class="estate-wf-meta">협의 조건은 매물 상세에서 수정합니다. 아래 배분액은 거래별 직접 입력 값이며, 실제 지급 기록이나 자동 송금이 아닙니다. 상대 중개사에게 자료를 자동 공유하지 않습니다.</p>';
}

function createDownloadShelf(app,host,signal,className){
  const owner=app.uid(),ready=new Map(),pending=new Map(),versions=new Map(),surface=globalThis.window;let disposed=false;
  function remove(id){versions.set(id,(versions.get(id)||0)+1);const item=ready.get(id);if(item){URL.revokeObjectURL(item.url);item.node.remove();ready.delete(id);}}
  function dispose(){if(disposed)return;disposed=true;for(const id of [...ready.keys()])remove(id);surface?.removeEventListener('aiderdear-firebase-state',checkOwner);surface?.removeEventListener('aiderdear-firebase-ready',checkOwner);}
  function checkOwner(){if(app.uid()!==owner)dispose();}
  function assertActive(){if(disposed||signal?.aborted||app.uid()!==owner||!host.isConnected){dispose();throw Error('화면 또는 로그인 계정이 변경되었습니다. 첨부를 다시 준비해주세요.');}}
  function activateLink(item){try{item.link.click();}catch{/* The connected, visible save link remains available for a direct gesture. */}app.notice('파일 준비 완료 · 자동 다운로드가 시작되지 않으면 파일 저장을 눌러주세요.');}
  async function prepare(id){
    assertActive();if(ready.has(id)){activateLink(ready.get(id));return ready.get(id);}if(pending.has(id))return pending.get(id);
    const version=versions.get(id)||0;
    const work=(async()=>{
      try{
        const file=await app.api.download(id);assertActive();if((versions.get(id)||0)!==version)return;
        const url=URL.createObjectURL(file.blob),node=document.createElement('div'),message=document.createElement('span'),link=document.createElement('a');
        node.className=className;node.dataset.estateDownloadReady=id;
        message.textContent='준비 완료 · 자동 다운로드가 시작되지 않으면 아래 파일 저장을 누르세요.';
        link.href=url;link.download=file.name||'첨부 파일';link.rel='noopener';link.textContent='파일 저장 · '+(file.name||'첨부 파일');
        link.addEventListener('click',event=>{try{assertActive();}catch(error){event.preventDefault();app.notice(error.message,true);}});
        node.append(message,link);host.append(node);const item={url,node,link};ready.set(id,item);activateLink(item);return item;
      }finally{pending.delete(id);}
    })();pending.set(id,work);return work;
  }
  signal?.addEventListener('abort',dispose,{once:true});
  surface?.addEventListener('aiderdear-firebase-state',checkOwner);
  surface?.addEventListener('aiderdear-firebase-ready',checkOwner);
  return {prepare,remove,dispose};
}

export function installWorkflow(app){
  const e=value=>app.esc(String(value??'')),money=value=>value===null||value===undefined||value===''?'미입력':app.money(Number(value));
  const states=new Map();let stateOwner='';
  const button=(label,attrs='',className='')=>`<button type="button" class="estate-wf-button ${className}" ${attrs}>${e(label)}</button>`;
  const openButton=(collection,id,label)=>button(label,`data-estate-open="${e(collection)}" data-id="${e(id||'')}"`);
  const chip=(label,kind='')=>`<span class="estate-wf-chip ${e(kind)}">${e(label)}</span>`;
  const empty=label=>`<p class="estate-wf-empty">${e(label)}</p>`;
  const field=(name,label,type='text',value='',options=[],attrs='')=>{
    let input;
    if(type==='textarea')input=`<textarea name="${e(name)}" rows="3" ${attrs}>${e(value)}</textarea>`;
    else if(type==='select')input=`<select name="${e(name)}" ${attrs}>${options.map(([key,text])=>`<option value="${e(key)}" ${String(value??'')===String(key)?'selected':''}>${e(text)}</option>`).join('')}</select>`;
    else input=`<input name="${e(name)}" type="${e(type)}" value="${e(value)}" ${attrs}>`;
    return `<label class="estate-wf-field"><span>${e(label)}</span>${input}</label>`;
  };
  function statusLine(state){
    const pages=Object.entries(state.pages);
    return `<div class="estate-wf-sample" role="status">${pages.map(([key,p])=>`${e(COLLECTION_LABELS[key]||key)} ${p.rows.length}건${p.cursor?' · 다음 페이지 있음':' · 현재 조회 완료'}`).join(' / ')}<br>목록은 요청당 최대 50건입니다. 통계와 요약은 불러온 기록만 집계합니다.</div>`;
  }
  function pagination(state){return `<div class="estate-wf-pagination">${Object.entries(state.pages).filter(([,p])=>p.cursor).map(([key])=>button(`${COLLECTION_LABELS[key]||key} 다음 50건`, `data-estate-next="${key}"`)).join('')}</div>`;}
  async function page(state,collection,more=false){
    const previous=state.pages[collection]||{rows:[],cursor:null};
    const data=await app.list(collection,{limit:50,...(more&&previous.cursor?{cursor:previous.cursor}:{})});
    const rows=more?[...previous.rows,...data.rows]:data.rows;
    state.pages[collection]={rows:[...new Map(rows.map(row=>[row.id,row])).values()],cursor:data.cursor||null};
  }
  const rows=(state,key)=>state.pages[key]?.rows||[];
  const register=(name,collections,draw)=>app.registerView(name,async({container,signal})=>{
    if(stateOwner!==app.uid()){states.clear();stateOwner=app.uid();}
    const state=states.get(name)||{pages:{},query:'',stage:'',mode:'board',date:app.today(),from:app.today().slice(0,7)+'-01',to:app.today()};states.set(name,state);
    container.classList.add('estate-wf');container.innerHTML='<p class="estate-wf-empty" role="status">기록을 불러오는 중…</p>';
    try{await Promise.all(collections.map(collection=>page(state,collection)));}catch(error){if(!signal?.aborted)container.innerHTML=`<p class="estate-wf-error" role="alert">${e(error.message||'기록을 불러오지 못했습니다.')}</p>`;return;}
    if(signal?.aborted)return;
    function paint(){if(signal?.aborted)return;const top=container.scrollTop;container.innerHTML=draw(state);container.scrollTop=top;}
    container.addEventListener('click',async event=>{
      const target=event.target.closest('button');if(!target||!container.contains(target))return;
      if(target.dataset.estateOpen){app.open(target.dataset.estateOpen,target.dataset.id||undefined);return;}
      if(target.dataset.estateMode){state.mode=target.dataset.estateMode;paint();return;}
      if(target.hasAttribute('data-estate-filter')){state.query=container.querySelector('[name="estateQuery"]')?.value.trim()||'';state.stage=container.querySelector('[name="estateStage"]')?.value||'';state.date=container.querySelector('[name="estateDate"]')?.value||app.today();state.from=container.querySelector('[name="estateFrom"]')?.value||state.from;state.to=container.querySelector('[name="estateTo"]')?.value||state.to;if(state.from>state.to){app.notice('종료 날짜를 시작 날짜 이후로 선택해주세요.',true);return;}paint();return;}
      if(target.dataset.estateReschedule){const editor=target.closest('[data-estate-row]').querySelector('.estate-wf-reschedule');editor.hidden=!editor.hidden;return;}
      target.disabled=true;
      try{
        if(target.dataset.estateNext){await page(state,target.dataset.estateNext,true);paint();return;}
        const collection=target.dataset.collection,id=target.dataset.id;
        if(target.hasAttribute('data-estate-complete')){
          const row=rows(state,collection).find(r=>r.id===id);if(!row)return;
          await app.save(collection,{...row,status:'done'});app.notice('완료로 기록했습니다.');await page(state,collection);paint();return;
        }
        if(target.hasAttribute('data-estate-save-date')){
          const row=rows(state,collection).find(r=>r.id===id),date=target.closest('.estate-wf-reschedule').querySelector('input').value;
          if(!date)throw Error('새 날짜를 선택해주세요.');
          const dateField={deals:'dueDate',customers:'nextContactDate',properties:'nextCheckDate'}[collection]||'date';
          await app.save(collection,{...row,[dateField]:date});await page(state,collection);paint();return;
        }
        if(target.hasAttribute('data-estate-save-stage')){
          const card=target.closest('[data-estate-row]'),row=rows(state,'deals').find(r=>r.id===id),stage=card.querySelector('[name="quickStage"]').value,reason=card.querySelector('[name="quickReason"]').value.trim();
          if(['hold','stopped'].includes(stage)&&!reason)throw Error('보류 또는 중단 사유를 입력해주세요.');
          await app.save('deals',{...row,stage,reason});await page(state,'deals');paint();
        }
      }catch(error){app.notice(error.message||'저장하지 못했습니다. 다시 시도해주세요.',true);}finally{target.disabled=false;}
    },{signal});
    container.addEventListener('change',event=>{if(event.target.name==='quickStage'){const area=event.target.closest('[data-estate-row]');area.querySelector('.estate-wf-hold-reason').hidden=!['hold','stopped'].includes(event.target.value);}}, {signal});
    paint();
  });
  function todayEntries(state){
    const generatedDeals=new Set(rows(state,'tasks').filter(r=>r.sourceKind==='deals').map(r=>r.sourceId));
    return [
      ...rows(state,'tasks').filter(r=>r.status==='open').map(row=>({collection:'tasks',row,date:row.date,time:row.time,title:row.title,label:'업무'})),
      ...rows(state,'visits').filter(r=>r.status==='scheduled').map(row=>({collection:'visits',row,date:row.date,time:row.time,title:'매물 방문',label:'방문'})),
      ...rows(state,'deals').filter(r=>r.dueDate&&r.nextAction&&!generatedDeals.has(r.id)&&!['settled','stopped'].includes(r.stage)).map(row=>({collection:'deals',row,date:row.dueDate,time:'',title:row.nextAction,label:row.title||'거래 후속 업무'})),
      ...rows(state,'customers').filter(r=>r.nextContactDate).map(row=>({collection:'customers',row,date:row.nextContactDate,time:'',title:`${row.name||'고객'} 연락`,label:'고객 연락'})),
      ...rows(state,'properties').filter(r=>r.nextCheckDate&&!['closed','ended'].includes(r.status)).map(row=>({collection:'properties',row,date:row.nextCheckDate,time:'',title:row.title||row.address||'매물 정보 확인',label:'매물 확인'}))
    ].sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||(a.time||'99:99').localeCompare(b.time||'99:99')||({high:0,normal:1,low:2}[a.row.priority]??1)-({high:0,normal:1,low:2}[b.row.priority]??1));
  }
  function actionRow(item){const {row,collection}=item;return `<article class="estate-wf-action-row" data-estate-row>
    <div class="estate-wf-row-main"><div>${chip(item.label)}${row.priority==='high'?chip('우선','estate-wf-high'):''}<span class="estate-wf-meta">${e(item.date||'날짜 미정')} ${e(item.time)}</span></div><h3>${e(item.title)}</h3></div>
    <div class="estate-wf-row-actions">${openButton(collection,row.id,'자세히')}${['tasks','visits'].includes(collection)?button('완료',`data-estate-complete data-collection="${collection}" data-id="${e(row.id)}"`):''}${button('날짜 변경','data-estate-reschedule="yes"')}</div>
    <div class="estate-wf-reschedule" hidden><label>새 날짜 <input type="date" value="${e(item.date)}"></label>${button('날짜 저장',`data-estate-save-date data-collection="${collection}" data-id="${e(row.id)}"`)}</div></article>`;}
  register('today',['tasks','visits','deals','requests','customers','properties','receipts'],state=>{
    const entries=todayEntries(state),overdue=entries.filter(r=>r.date&&r.date<state.date),today=entries.filter(r=>r.date===state.date),later=entries.filter(r=>!r.date||r.date>state.date),pending=rows(state,'requests').filter(r=>r.status==='pending');
    const dateKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    const monday=new Date(state.date+'T12:00:00');monday.setDate(monday.getDate()-(monday.getDay()+6)%7);const sunday=new Date(monday);sunday.setDate(sunday.getDate()+6);const weekFrom=dateKey(monday),weekTo=dateKey(sunday);
    const weekCount=key=>rows(state,'deals').filter(r=>r[key]>=weekFrom&&r[key]<=weekTo&&!['hold','stopped'].includes(r.stage)).length;
    const owing=estateStatistics({deals:rows(state,'deals'),receipts:rows(state,'receipts')},{}).outstanding;
    const contactCount=rows(state,'customers').filter(r=>r.nextContactDate&&r.nextContactDate<=state.date).length,checkCount=rows(state,'properties').filter(r=>r.nextCheckDate&&r.nextCheckDate<=state.date&&!['closed','ended'].includes(r.status)).length;
    const summaries=[['오늘 방문',today.filter(r=>r.collection==='visits').length],['연락할 고객',contactCount],['이번 주 계약 / 잔금',`${weekCount('contractDate')} / ${weekCount('balanceDate')}`],['확인할 매물',checkCount],['미수 보수',money(owing)]];
    const agenda=list=>list.length?list.map(item=>`<div class="estate-wf-agenda-item"><time>${e(item.date)} ${e(item.time)}</time><strong>${e(item.title)}</strong>${openButton(item.collection,item.row.id,'열기')}</div>`).join(''):empty('등록된 일정이 없습니다.');
    const missingProperties=!rows(state,'properties').length,missingCustomers=!rows(state,'customers').length;
    return `<header class="estate-wf-heading"><div><h2>오늘 업무</h2><p class="estate-wf-meta">날짜를 정한 업무부터 확인합니다.</p></div><div class="estate-wf-toolbar">${field('estateDate','기준 날짜','date',state.date)}${button('보기','data-estate-filter')}${openButton('tasks','','업무 추가')}${openButton('visits','','방문 등록')}</div></header>
      <div class="estate-wf-top-summary">${summaries.map(([label,value])=>`<article><span>${e(label)}</span><strong>${e(value)}</strong></article>`).join('')}</div>
      ${missingProperties||missingCustomers?`<section class="estate-wf-onboarding"><div><h3>내 자료로 시작하기</h3><p>${missingProperties?'첫 매물을 등록하고 ':'등록한 매물에 '}${missingCustomers?'고객을 연결해보세요.':'방문과 거래를 연결할 수 있습니다.'} 예시 기록은 추가하지 않습니다.</p></div><div>${missingProperties?openButton('properties','','첫 매물 등록'):''}${missingCustomers?openButton('customers','','첫 고객 등록'):''}</div></section>`:''}
      ${overdue.length?`<section class="estate-wf-overdue"><h3>기한이 지난 업무 <span>${overdue.length}</span></h3>${overdue.map(actionRow).join('')}</section>`:''}
      <div class="estate-wf-today-grid"><section><h3 class="estate-wf-section-title">오늘 ${today.length}건</h3>${today.length?today.map(actionRow).join(''):empty('선택한 날짜에 등록된 업무가 없습니다.')}<h3 class="estate-wf-section-title">다음 업무</h3>${later.length?later.slice(0,8).map(actionRow).join(''):empty('다음 업무가 없습니다.')}${later.length>8?`<p class="estate-wf-meta">이후 업무 ${later.length-8}건은 기준 날짜를 바꿔 확인할 수 있습니다.</p>`:''}</section>
      <aside class="estate-wf-summary"><section><h3>오늘 일정</h3>${agenda(today.slice(0,6))}${today.length>6?`<p class="estate-wf-meta">전체 ${today.length}건은 왼쪽 목록에서 확인합니다.</p>`:''}</section><section><h3>가까운 마감</h3>${agenda(later.filter(item=>item.date).slice(0,5))}</section><section><h3>방문 희망 ${pending.length}</h3>${pending.length?pending.map(row=>`<div class="estate-wf-request"><strong>${e(row.name)}</strong><span>${e(row.preferredDate||'날짜 협의')} ${e(row.preferredTime)}</span>${openButton('requests',row.id,'확인')}</div>`).join(''):empty('대기 중인 방문 희망이 없습니다.')}</section><p class="estate-wf-meta">확정 수수료가 없는 거래는 미수 금액을 계산하지 않습니다. ${e(weekFrom)}–${e(weekTo)} 기준 · 불러온 자료만 집계</p></aside></div>${statusLine(state)}${pagination(state)}`;
  });
  function dealCard(row){
    const checklist=Array.isArray(row.checklist)?row.checklist:[],done=checklist.filter(r=>r.done).length;
    return `<article class="estate-wf-deal-card" data-estate-row><div class="estate-wf-card-title"><h3>${e(row.title||'제목 미입력')}</h3>${row.priority==='high'?chip('우선','estate-wf-high'):''}</div>
      <dl class="estate-wf-compact-dl"><div><dt>다음 업무</dt><dd>${e(row.nextAction||'미입력')}</dd></div><div><dt>기한</dt><dd>${e(row.dueDate||'미정')}</dd></div><div><dt>체크리스트</dt><dd>${done} / ${checklist.length}</dd></div></dl>
      <div class="estate-wf-stage-controls">${field('quickStage','진행 단계','select',row.stage,STAGES)}<div class="estate-wf-hold-reason" ${['hold','stopped'].includes(row.stage)?'':'hidden'}>${field('quickReason','보류·중단 사유','text',row.reason||'')}</div>${button('단계 저장',`data-estate-save-stage data-id="${e(row.id)}"`)}${openButton('deals',row.id,'거래 열기')}</div></article>`;
  }
  register('deals',['deals'],state=>{
    const selected=rows(state,'deals').filter(row=>(!state.stage||row.stage===state.stage)&&(!state.query||`${row.title||''} ${row.nextAction||''} ${row.reason||''}`.toLowerCase().includes(state.query.toLowerCase())));
    return `<header class="estate-wf-heading"><div><h2>거래 관리</h2><p class="estate-wf-meta">${selected.length}건 표시</p></div>${openButton('deals','','거래 추가')}</header><div class="estate-wf-toolbar">${field('estateQuery','거래·다음 업무 검색','search',state.query)}${field('estateStage','단계','select',state.stage,[['','모든 단계'],...STAGES])}${button('검색','data-estate-filter')}<div class="estate-wf-segment" aria-label="거래 표시 방식">${button('보드',`data-estate-mode="board" aria-pressed="${state.mode==='board'}"`)}${button('목록',`data-estate-mode="list" aria-pressed="${state.mode==='list'}"`)}</div></div>
      ${state.mode==='board'?`<div class="estate-wf-board" aria-label="단계별 거래 보드">${STAGES.filter(([key])=>!state.stage||key===state.stage).map(([key,label])=>{const list=selected.filter(row=>row.stage===key);return `<section class="estate-wf-board-column"><h3>${label} <span>${list.length}</span></h3>${list.length?list.map(dealCard).join(''):empty('등록된 거래 없음')}</section>`;}).join('')}</div>`:`<div class="estate-wf-deal-list">${selected.length?selected.map(row=>`<div><span class="estate-wf-stage-label">${e(stageLabel(row.stage))}</span>${dealCard(row)}</div>`).join(''):empty('조건에 맞는 거래가 없습니다.')}</div>`}${statusLine(state)}${pagination(state)}`;
  });
  register('settlement',['deals','receipts','customers','properties','visits'],state=>{
    const data=Object.fromEntries(Object.keys(state.pages).map(key=>[key,rows(state,key)]));
    const result=estateStatistics(data,{from:state.from,to:state.to}),payments=rows(state,'receipts').filter(row=>row.date>=state.from&&row.date<=state.to).sort((a,b)=>b.date.localeCompare(a.date));
    const dealMap=new Map(rows(state,'deals').map(row=>[row.id,row]));
    const pending=rows(state,'deals').filter(row=>{const date=row.feeDueDate||row.contractDate;return !['hold','stopped'].includes(row.stage)&&date&&date>=state.from&&date<=state.to;});
    const objectStats=(value,key)=>Array.isArray(value)?value.map(row=>[row.label||row[key]||row.type||row.source||row.stage||'기타',key==='source'?`문의 ${row.customers??0}명 · 계약 ${row.contracts??0}건`:row.count??row.value??row.amount??0]):Object.entries(value||{}).map(([label,v])=>[label,typeof v==='object'?(v.count??v.value??v.amount??0):v]);
    const chart=(items)=>{const max=Math.max(1,...items.map(([,value])=>Number(value)||0));return `<div class="estate-wf-chart">${items.map(([label,value])=>`<div class="estate-wf-chart-row"><span>${e(stageLabel(label))}</span><div class="estate-wf-chart-track" aria-hidden="true"><i style="width:${Math.max(0,Math.min(100,(Number(value)||0)/max*100))}%"></i></div><strong>${e(value)}${label==='sale'||label==='jeonse'||label==='rent'?'건':''}</strong></div>`).join('')}</div>`;};
    return `<header class="estate-wf-heading"><div><h2>정산 · 통계</h2><p class="estate-wf-meta">실제 수납과 예정 금액을 나누어 표시합니다.</p></div>${openButton('receipts','','수납 등록')}</header><div class="estate-wf-toolbar">${field('estateFrom','시작 날짜','date',state.from)}${field('estateTo','종료 날짜','date',state.to)}${button('기간 적용','data-estate-filter')}</div>
      <div class="estate-wf-metrics">${[['실제 수납',money(result.received)],['미수납',money(result.outstanding)],['예정 금액',money(result.expected)],['계약',`${result.contracts??0}건`]].map(([label,value])=>`<article><span>${e(label)}</span><strong>${e(value)}</strong></article>`).join('')}</div>
      <div class="estate-wf-settlement-grid"><section><h3>수납 내역</h3>${payments.length?payments.map(row=>`<article class="estate-wf-payment"><div><strong>${e(dealMap.get(row.dealId)?.title||'연결 거래')}</strong><span>${e(row.date)} · ${e(row.method||'방법 미입력')}</span></div><b>${e(money(row.amount))}</b>${openButton('receipts',row.id,'수정')}</article>`).join(''):empty('선택한 기간의 수납 내역이 없습니다.')}</section><section><h3>정산 예정 거래</h3>${pending.length?pending.map(row=>{const paid=rows(state,'receipts').filter(r=>r.dealId===row.id).reduce((sum,r)=>sum+Number(r.amount||0),0);const remaining=row.confirmedFee==null?null:Math.max(0,Number(row.confirmedFee)-paid);return `<article class="estate-wf-payment"><div><strong>${e(row.title)}</strong><span>${row.feeDueDate?'예정일':'계약일 기준'} ${e(row.feeDueDate||row.contractDate)} · 확정 수수료 ${e(money(row.confirmedFee))}</span><span>불러온 수납 ${e(money(paid))} / 남은 금액 ${e(money(remaining))}</span></div>${openButton('deals',row.id,'거래 열기')}</article>`;}).join(''):empty('선택한 기간의 정산 예정 거래가 없습니다.')}</section></div>
      <div class="estate-wf-statistics">${[['거래 유형',objectStats(result.byType,'type'),true],['유입 경로',objectStats(result.bySource,'source'),false],['문의 → 방문 → 계약',objectStats(result.funnel,'stage'),true]].map(([title,items,bars])=>`<section><h3>${title}</h3>${items.length?(bars?chart(items):`<dl>${items.map(([label,value])=>`<div><dt>${e(label)}</dt><dd>${e(value)}</dd></div>`).join('')}</dl>`):empty('집계할 기록 없음')}</section>`).join('')}</div>
      <p class="estate-wf-meta">평균 진행 기간: ${result.averageDays==null?'계산 가능한 기록 없음':e(Number(result.averageDays).toFixed(1))+'일'} · 기간 계산 가능 표본 ${e(result.sampleSize?.duration??0)}건</p><p class="estate-wf-meta">확정 수수료 미입력 ${rows(state,'deals').filter(row=>row.confirmedFee==null).length}건은 미수 금액을 계산하지 않습니다. 0원과 미확인 금액은 다릅니다.${result.basis?` ${e(result.basis)}`:''}</p>${statusLine(state)}${pagination(state)}`;
  });

  async function choices(collection,ids=[]){
    const listed=await app.pickOptions(collection);const list=Array.isArray(listed)?listed:listed.rows||[];
    const additional=await Promise.all(unique(ids).filter(id=>!list.some(row=>row.id===id)).map(id=>app.lookup(collection,id).catch(()=>null)));
    return [...list,...additional.filter(Boolean)];
  }
  const recordLabel=(collection,row)=>collection==='properties'?`${row.number||''} ${row.title||row.address||'매물'}`.trim():row.name||row.title||row.id;
  function chooser(name,label,collection,available,selected,multiple=false){
    const ids=multiple?(selected||[]):[selected];
    return `<div class="estate-wf-chooser"><label class="estate-wf-field"><span>${e(label)}${multiple?' (복수 선택)':''}</span><select name="${e(name)}" ${multiple?'multiple size="4"':''}>${multiple?'':'<option value="">선택 안 함</option>'}${available.map(row=>`<option value="${e(row.id)}" ${ids.includes(row.id)?'selected':''}>${e(recordLabel(collection,row))}</option>`).join('')}</select></label><div class="estate-wf-find"><input type="search" aria-label="${e(label)} 추가 검색" placeholder="첫 50건 외 기록 찾기"><button type="button" data-estate-find="${e(collection)}" data-target="${e(name)}">찾기</button></div><div class="estate-wf-find-results" role="status"></div></div>`;
  }
  function selected(form,name,multiple=false){const input=form.elements.namedItem(name);return multiple?Array.from(input?.selectedOptions||[]).map(option=>option.value):input?.value||null;}
  function bindSearch(container,signal){
    container.addEventListener('click',async event=>{
      const find=event.target.closest('[data-estate-find]');if(!find)return;
      const chooserBox=find.closest('.estate-wf-chooser'),results=chooserBox.querySelector('.estate-wf-find-results'),query=chooserBox.querySelector('input[type="search"]').value.trim();if(!query){results.textContent='검색어를 입력해주세요.';return;}
      find.disabled=true;
      try{
        const result=await app.api.call('search',{q:query,...(find.dataset.cursor?{cursor:find.dataset.cursor}:{})});if(signal?.aborted)return;
        const matches=(result.results||[]).filter(row=>row.collection===find.dataset.estateFind);results.replaceChildren();
        for(const item of matches){const b=document.createElement('button');b.type='button';b.className='estate-wf-search-result';b.textContent=[item.label,item.subtitle].filter(Boolean).join(' · ');b.addEventListener('click',()=>{const select=container.querySelector(`[name="${find.dataset.target}"]`);let option=Array.from(select.options).find(o=>o.value===item.id);if(!option){option=new Option(item.label||item.id,item.id);select.add(option);}option.selected=true;select.dispatchEvent(new Event('change',{bubbles:true}));results.replaceChildren();});results.append(b);}
        if(!matches.length){const text=document.createElement('span');text.textContent=result.cursor?'이번 검색 범위에 일치하는 기록이 없습니다. 다음 범위를 확인하세요.':'일치하는 기록이 없습니다.';results.append(text);}
        if(result.cursor){const next=document.createElement('button');next.type='button';next.textContent='다음 검색 범위';next.dataset.estateFind=find.dataset.estateFind;next.dataset.target=find.dataset.target;next.dataset.cursor=result.cursor;results.append(next);}
      }catch(error){results.textContent=error.message||'검색하지 못했습니다.';}finally{find.disabled=false;}
    },{signal});
  }
  function bindForm(container,html,onSave,signal){
    container.classList.add('estate-wf-panel');
    app.form(container,`<div class="estate-wf-form-content">${html}</div>`,async(data,form)=>onSave(data,form||container.querySelector('form')));
    bindSearch(container,signal);
  }
  const section=(title,html)=>`<fieldset class="estate-wf-fieldset"><legend>${e(title)}</legend><div class="estate-wf-form-grid">${html}</div></fieldset>`;
  const normalizeNumbers=(data,keys)=>Object.fromEntries(keys.map(key=>[key,numberOrNull(data[key])]));
  const normalizeDates=(data,keys)=>Object.fromEntries(keys.map(key=>[key,data[key]||null]));

  app.registerEntity('tasks',async({container,row,signal})=>{
    let current=row;const [customers,properties,deals]=await Promise.all([choices('customers',[row.customerId]),choices('properties',[row.propertyId]),choices('deals',[row.dealId])]);if(signal?.aborted)return;
    bindForm(container,section('업무',field('title','업무 이름','text',row.title||'',[],'required maxlength="200"')+field('status','상태','select',row.status||'open',TASK_STATES)+field('date','예정 날짜','date',row.date||app.today())+field('time','시간','time',row.time||'')+field('priority','우선순위','select',row.priority||'normal',PRIORITIES)+field('kind','업무 목적','select',row.kind||'other',KINDS))+section('연결',chooser('customerId','고객','customers',customers,row.customerId)+chooser('propertyId','매물','properties',properties,row.propertyId)+chooser('dealId','거래','deals',deals,row.dealId))+section('메모',field('notes','업무 메모','textarea',row.notes||''))+(row.sourceKind?`<p class="estate-wf-meta">${e(row.sourceKind)} 기록에서 연결된 업무입니다. 원본의 후속 일정 변경 시 함께 갱신됩니다.</p>`:''),async(data,form)=>{
      current=await app.save('tasks',{...current,...data,...normalizeDates(data,['date','time']),customerId:selected(form,'customerId'),propertyId:selected(form,'propertyId'),dealId:selected(form,'dealId')},form);app.notice('업무를 저장했습니다.');
    },signal);
  });
  app.registerEntity('visits',async({container,row,signal})=>{
    let current=row;const [customers,properties,deals]=await Promise.all([choices('customers',row.customerIds),choices('properties',[row.propertyId]),choices('deals',[row.dealId])]);if(signal?.aborted)return;
    bindForm(container,section('방문 일정',chooser('propertyId','방문 매물','properties',properties,row.propertyId)+chooser('customerIds','방문 고객','customers',customers,row.customerIds,true)+field('date','방문 날짜','date',row.date||app.today(),[],'required')+field('time','시작 시간','time',row.time||'')+field('endTime','종료 시간','time',row.endTime||'')+field('status','방문 상태','select',row.status||'scheduled',VISIT_STATES)+chooser('dealId','연결 거래','deals',deals,row.dealId))+section('방문 결과',field('reaction','고객 반응','textarea',row.reaction||'')+field('positives','긍정적으로 본 점','textarea',row.positives||'')+field('exclusionReason','제외·보류한 이유','textarea',row.exclusionReason||''))+section('후속 조치',field('followUpAction','다음에 할 일','text',row.followUpAction||'')+field('followUpDate','후속 업무 날짜','date',row.followUpDate||'')),async(data,form)=>{
      const propertyId=selected(form,'propertyId'),customerIds=selected(form,'customerIds',true);if(!propertyId||!customerIds.length)throw Error('방문 매물과 고객을 선택해주세요.');if(data.endTime&&data.time&&data.endTime<data.time)throw Error('종료 시간은 시작 시간 이후여야 합니다.');
      current=await app.save('visits',{...current,...data,...normalizeDates(data,['date','time','endTime','followUpDate']),propertyId,customerIds,dealId:selected(form,'dealId')},form);app.notice('방문 기록과 후속 업무를 저장했습니다.');
    },signal);
  });
  app.registerEntity('receipts',async({container,row,signal})=>{
    let current=row;const deals=await choices('deals',[row.dealId]);if(signal?.aborted)return;
    bindForm(container,section('수납 기록',chooser('dealId','거래','deals',deals,row.dealId)+field('amount','이번에 받은 금액 (원)','number',row.amount??'',[],'required min="1" step="1"')+field('date','수납 날짜','date',row.date||app.today(),[],'required')+field('method','수납 방법','text',row.method||'')+field('notes','수납 메모','textarea',row.notes||''))+'<p class="estate-wf-meta">분할 수납은 받은 날짜와 금액별로 각각 등록합니다. 예정 금액은 실제 수납으로 집계하지 않습니다.</p>',async(data,form)=>{
      const dealId=selected(form,'dealId'),amount=Number(data.amount);if(!dealId)throw Error('거래를 선택해주세요.');if(!Number.isFinite(amount)||amount<=0)throw Error('실제 받은 금액을 0보다 크게 입력해주세요.');
      current=await app.save('receipts',{...current,...data,dealId,amount},form);app.notice('수납 내역을 저장했습니다.');
    },signal);
  });
  app.registerEntity('deals',async({container,row,signal})=>{
    let current=row;const owner=app.uid(),assertActive=()=>{if(signal?.aborted||app.uid()!==owner)throw Error('화면 또는 로그인 계정이 변경되어 첨부 작업을 중단했습니다.');};const [customers,properties]=await Promise.all([choices('customers',[...(row.sellerIds||[]),...(row.buyerIds||[])]),choices('properties',[row.propertyId])]);if(signal?.aborted)return;
    const checklistRow=item=>`<div class="estate-wf-check-row" data-check-id="${e(item.id)}"><input type="checkbox" aria-label="항목 완료" ${item.done?'checked':''}><input type="text" aria-label="체크리스트 항목" value="${e(item.text)}" maxlength="300">${button('삭제','data-check-remove')}</div>`;
    const uploaded=new Map(),removedIds=new Set(),cleanupPending=new Set();
    function renderFiles(){
      const list=container.querySelector('.estate-wf-files');if(!list)return;
      list.innerHTML=(current.mediaIds||[]).map((id,index)=>`<div class="estate-wf-file-row">${button(`첨부 파일 ${index+1} 다운로드`,`data-estate-download="${e(id)}"`)}${button(removedIds.has(id)?'삭제 예약 취소':'첨부 삭제 예약',`data-estate-remove-media="${e(id)}"`)}${removedIds.has(id)?'<small>저장 시 연결 해제 후 삭제하며, 삭제한 파일은 복구할 수 없습니다.</small>':''}</div>`).join('')+(cleanupPending.size?`<p class="estate-wf-meta">연결은 해제했지만 ${cleanupPending.size}개 파일의 삭제가 보류되었습니다. 다른 기록이나 활성 공유에서 사용 중이면 파일은 삭제되지 않습니다.</p>${button('보류된 파일 삭제 다시 확인','data-estate-cleanup-retry')}`:'');
    }
    async function cleanupFiles(){for(const id of [...cleanupPending]){assertActive();try{await app.api.call('mediaDelete',{id});cleanupPending.delete(id);}catch(error){if(signal?.aborted||app.uid()!==owner)throw error;}}renderFiles();}
    bindForm(container,section('거래',field('title','거래 이름','text',row.title||'',[],'required maxlength="200"')+field('stage','진행 단계','select',row.stage||'inquiry',STAGES)+chooser('propertyId','매물','properties',properties,row.propertyId)+chooser('sellerIds','매도·임대 고객','customers',customers,row.sellerIds,true)+chooser('buyerIds','매수·임차 고객','customers',customers,row.buyerIds,true)+`<div class="estate-wf-deal-reason">${field('reason','보류·중단 사유','textarea',row.reason||'')}</div>`)+section('합의 조건',field('agreedPrice','매매 금액 (원)','number',row.agreedPrice??'',[],'min="0" step="1"')+field('agreedDeposit','보증금 (원)','number',row.agreedDeposit??'',[],'min="0" step="1"')+field('agreedRent','월세 (원)','number',row.agreedRent??'',[],'min="0" step="1"')+field('conditions','합의한 조건','textarea',row.conditions||''))+section('주요 일정',field('contractDate','계약일','date',row.contractDate||'')+field('interimDate','중도금일','date',row.interimDate||'')+field('balanceDate','잔금일','date',row.balanceDate||'')+field('handoverDate','인도일','date',row.handoverDate||'')+field('nextAction','다음 업무','text',row.nextAction||'')+field('dueDate','다음 업무 기한','date',row.dueDate||'')+field('priority','우선순위','select',row.priority||'normal',PRIORITIES))+`<fieldset class="estate-wf-fieldset"><legend>진행 체크리스트</legend><div class="estate-wf-checklist">${(row.checklist||[]).map(checklistRow).join('')}</div>${button('항목 추가','data-check-add')}</fieldset>`+`<section class="estate-wf-cobroker-context" data-cobroker-deal-context aria-live="polite"></section>`+section('정산',field('expectedFee','예정 수수료 (원)','number',row.expectedFee??'',[],'min="0" step="1"')+field('confirmedFee','확정 수수료 (원)','number',row.confirmedFee??'',[],'min="0" step="1"')+field('coBrokerAmount','공동 중개 배분액 (원)','number',row.coBrokerAmount??'',[],'min="0" step="1"')+field('feeDueDate','정산 예정일','date',row.feeDueDate||''))+section('기록',field('internalMemo','내부 메모','textarea',row.internalMemo||''))+`<fieldset class="estate-wf-fieldset"><legend>첨부 파일</legend><div class="estate-wf-files">${(row.mediaIds||[]).map((id,index)=>button(`첨부 파일 ${index+1} 다운로드`,`data-estate-download="${e(id)}"`)).join('')}</div><div class="estate-wf-downloads" aria-live="polite"></div><label class="estate-wf-field"><span>문서·사진·동영상 추가</span><input type="file" name="dealFiles" multiple></label><p class="estate-wf-meta">파일은 거래 저장 후 연결됩니다. 공개 링크에는 내부 첨부 파일이 자동으로 포함되지 않습니다.</p></fieldset><section class="estate-wf-linked-payments"><h3>이 거래의 부분 수납</h3><div data-deal-receipts></div>${button('수납 추가','data-new-deal-receipt')}</section>`,async(data,form)=>{
      const stage=data.stage,reason=String(data.reason||'').trim();if(['hold','stopped'].includes(stage)&&!reason)throw Error('보류·중단 사유를 입력해주세요.');
      const propertyId=selected(form,'propertyId');if(!propertyId)throw Error('거래 매물을 선택해주세요.');
      const checklist=Array.from(form.querySelectorAll('[data-check-id]')).map(node=>({id:node.dataset.checkId,text:node.querySelector('input[type="text"]').value.trim(),done:node.querySelector('input[type="checkbox"]').checked})).filter(item=>item.text);
      const clean={...current,...data,...normalizeNumbers(data,['agreedPrice','agreedDeposit','agreedRent','expectedFee','confirmedFee','coBrokerAmount']),...normalizeDates(data,['contractDate','interimDate','balanceDate','handoverDate','dueDate','feeDueDate']),stage,reason,propertyId,sellerIds:selected(form,'sellerIds',true),buyerIds:selected(form,'buyerIds',true),checklist,mediaIds:unique([...(current.mediaIds||[]),...uploaded.values()]).filter(id=>!removedIds.has(id))};delete clean.dealFiles;
      try{
        assertActive();current=await app.save('deals',clean,form);for(const id of removedIds){cleanupPending.add(id);downloads.remove(id);}removedIds.clear();
        for(const file of Array.from(form.elements.namedItem('dealFiles')?.files||[]))if(!uploaded.has(file)){assertActive();const media=await app.api.upload(file,{entityCollection:'deals',entityId:current.id});assertActive();uploaded.set(file,typeof media==='string'?media:media.id);}
        const mediaIds=unique([...(current.mediaIds||[]),...uploaded.values()]);if(mediaIds.length!==(current.mediaIds||[]).length){assertActive();current=await app.save('deals',{...current,mediaIds},form);}
        form.elements.namedItem('dealFiles').value='';uploaded.clear();await cleanupFiles();renderFiles();await showReceipts();app.notice(cleanupPending.size?'거래 저장 완료 · 참조 중이거나 응답을 확인하지 못한 첨부의 삭제는 보류했습니다.':'거래와 첨부를 저장했습니다.');
      }catch(error){form.dispatchEvent(new Event('input',{bubbles:true}));throw error;}
    },signal);
    const form=container.querySelector('form');
    const coBrokerHost=container.querySelector('[data-cobroker-deal-context]');let coBrokerSequence=0;
    async function refreshCoBroker(){
      if(!coBrokerHost)return;const sequence=++coBrokerSequence,id=selected(form,'propertyId');
      coBrokerHost.textContent='공동중개 정보를 확인하는 중…';
      try{const property=id?await app.lookup('properties',id):null;if(signal?.aborted||app.uid()!==owner||sequence!==coBrokerSequence)return;coBrokerHost.innerHTML=coBrokerDealContext(property,e);}
      catch(error){if(!signal?.aborted&&app.uid()===owner&&sequence===coBrokerSequence)coBrokerHost.textContent='공동중개 정보를 불러오지 못했습니다. 매물을 다시 선택해주세요.';}
    }
    form.addEventListener('change',event=>{if(event.target.name==='propertyId')refreshCoBroker();},{signal});
    refreshCoBroker();
    const downloads=createDownloadShelf(app,container.querySelector('.estate-wf-downloads'),signal,'estate-wf-download-ready');
    renderFiles();
    const updateReason=()=>{const required=['hold','stopped'].includes(form.elements.namedItem('stage').value);const input=form.elements.namedItem('reason');input.required=required;container.querySelector('.estate-wf-deal-reason').classList.toggle('estate-wf-required',required);};updateReason();form.elements.namedItem('stage').addEventListener('change',updateReason,{signal});
    container.addEventListener('click',async event=>{
      const b=event.target.closest('button');if(!b)return;
      if(b.hasAttribute('data-check-add')){const wrapper=document.createElement('div');wrapper.innerHTML=checklistRow({id:crypto.randomUUID(),text:'',done:false});container.querySelector('.estate-wf-checklist').append(wrapper.firstElementChild);form.dispatchEvent(new Event('input',{bubbles:true}));return;}
      if(b.hasAttribute('data-check-remove')){b.closest('[data-check-id]').remove();form.dispatchEvent(new Event('input',{bubbles:true}));return;}
      if(b.dataset.estateRemoveMedia){const id=b.dataset.estateRemoveMedia;removedIds.has(id)?removedIds.delete(id):removedIds.add(id);form.dispatchEvent(new Event('input',{bubbles:true}));renderFiles();return;}
      if(b.hasAttribute('data-estate-cleanup-retry')){b.disabled=true;try{await cleanupFiles();if(cleanupPending.size)app.notice('아직 참조 중이거나 연결 상태를 확인하지 못해 파일 삭제를 보류했습니다.',true);else app.notice('연결이 해제된 파일을 삭제했습니다.');}catch(error){app.notice(error.message,true);}finally{b.disabled=false;}return;}
      if(b.hasAttribute('data-new-deal-receipt')){if(!current.revision){app.notice('거래를 먼저 저장해주세요.',true);return;}app.open('receipts',undefined,{dealId:current.id});return;}
      if(b.dataset.estateDownload){b.disabled=true;try{await downloads.prepare(b.dataset.estateDownload);}catch(error){if(!signal?.aborted&&app.uid()===owner)app.notice(error.message||'다운로드하지 못했습니다.',true);}finally{b.disabled=false;}}
    },{signal});
    const list=container.querySelector('[data-deal-receipts]');let receiptRows=[],receiptCursor=null;
    async function showReceipts(more=false){try{const result=await app.list('receipts',{limit:50,...(more&&receiptCursor?{cursor:receiptCursor}:{})});if(signal?.aborted)return;receiptRows=more?[...receiptRows,...result.rows]:result.rows;receiptCursor=result.cursor;const relevant=receiptRows.filter(item=>item.dealId===current.id);list.innerHTML=`${relevant.length?relevant.map(item=>`<div class="estate-wf-payment"><span>${e(item.date)} · ${e(item.method)}</span><strong>${e(money(item.amount))}</strong>${openButton('receipts',item.id,'수정')}</div>`).join(''):empty('불러온 범위에 수납 기록이 없습니다.')}<p class="estate-wf-meta">전체 수납 ${receiptRows.length}건을 확인한 범위입니다.${receiptCursor?' 다음 50건을 더 불러올 수 있습니다.':''}</p>${receiptCursor?button('수납 다음 50건','data-receipt-next'):''}`;}catch(error){list.textContent=error.message||'수납 내역을 불러오지 못했습니다.';}}
    list.addEventListener('click',event=>{const b=event.target.closest('button');if(b?.hasAttribute('data-receipt-next'))showReceipts(true);else if(b?.dataset.estateOpen)app.open(b.dataset.estateOpen,b.dataset.id);},{signal});
    if(current.revision)showReceipts();else list.textContent='거래를 저장하면 수납 기록을 연결할 수 있습니다.';
  });
  app.registerEntity('requests',async({container,row,signal})=>{
    const owner=app.uid();
    const [customers,properties]=await Promise.all([choices('customers'),choices('properties',row.propertyIds)]);if(signal?.aborted)return;
    const allowed=properties.filter(property=>(row.propertyIds||[]).includes(property.id));
    const summary=`<section class="estate-wf-request-summary"><h3>${e(row.name||'방문 희망')}</h3><dl><div><dt>연락처</dt><dd>${e(row.phone)}</dd></div><div><dt>희망 일정</dt><dd>${e(row.preferredDate||'협의')} ${e(row.preferredTime)}</dd></div><div><dt>요청 내용</dt><dd>${e(row.message||'없음')}</dd></div><div><dt>처리 상태</dt><dd>${e({pending:'확인 대기',confirmed:'확정',rejected:'거절'}[row.status]||row.status)}</dd></div></dl></section>`;
    if(row.status!=='pending'){container.innerHTML=summary;return;}
    bindForm(container,summary+section('방문 확정',chooser('customerId','연결할 기존 고객','customers',customers,null)+chooser('propertyId','확정할 요청 매물','properties',allowed,allowed.length===1?allowed[0].id:null)+field('date','방문 날짜','date',row.preferredDate||app.today(),[],'required')+field('time','방문 시간','time',row.preferredTime||''))+`<p class="estate-wf-meta">저장하면 선택한 고객과 매물로 방문 일정이 확정됩니다. 희망 요청만으로는 방문이 자동 생성되지 않습니다.</p>${button('요청 거절','data-request-reject')}`,async(data,form)=>{
      const customerId=selected(form,'customerId'),propertyId=selected(form,'propertyId');if(!customerId||!propertyId)throw Error('기존 고객과 요청에 포함된 매물을 선택해주세요.');if(!(row.propertyIds||[]).includes(propertyId))throw Error('요청에 포함된 매물만 확정할 수 있습니다.');
      const result=await app.api.call('requestConfirm',{id:row.id,customerId,propertyId,date:data.date,time:data.time||null});
      if(signal?.aborted||app.uid()!==owner)return;
      app.notice('방문 일정을 확정했습니다.');window.dispatchEvent(new Event('aiderlog-estate-updated'));
      // The controller clears the saved form's dirty/busy state after this callback returns.
      setTimeout(()=>{if(signal?.aborted||app.uid()!==owner)return;app.refresh();app.open('visits',result.visit.id);},0);
    },signal);
    container.querySelector('[data-request-reject]').addEventListener('click',async event=>{
      const b=event.currentTarget,form=b.closest('form');if(form.dataset.busy==='true')return;
      b.disabled=true;form.dataset.busy='true';form.inert=true;
      try{
        await app.api.call('requestReject',{id:row.id});if(signal?.aborted||app.uid()!==owner)return;
        app.notice('요청을 거절 상태로 보관했습니다.');window.dispatchEvent(new Event('aiderlog-estate-updated'));
        form.dataset.busy='false';form.inert=false;app.close(true);app.refresh();
      }catch(error){if(!signal?.aborted&&app.uid()===owner)app.notice(error.message||'처리하지 못했습니다.',true);}
      finally{form.dataset.busy='false';form.inert=false;b.disabled=false;}
    },{signal});
  });
}
