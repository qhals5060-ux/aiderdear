/* ESTATE-only calendar. Read the existing owner projections; never copy records. */
const SOURCES={tasks:'업무',visits:'방문',deals:'거래',customers:'고객 연락',properties:'매물 확인'};
const pad=value=>String(value).padStart(2,'0');
const dateKey=date=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
export function calendarMonthCells(month){
  const match=/^(\d{4})-(\d{2})$/.exec(String(month));
  if(!match||Number(match[2])<1||Number(match[2])>12)return [];
  const first=new Date(Number(match[1]),Number(match[2])-1,1,12);
  first.setDate(1-first.getDay());
  return Array.from({length:42},(_,index)=>{const date=new Date(first);date.setDate(date.getDate()+index);return {date:dateKey(date),day:date.getDate(),weekday:date.getDay(),inMonth:dateKey(date).startsWith(month)};});
}
export function calendarMonthShift(month,offset){
  const [year,number]=month.split('-').map(Number),date=new Date(year,number-1+offset,1,12);
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}`;
}
export function mergeCalendarProjection(previous,rows,source){
  const map=new Map(previous.map(row=>[row.id,row]));
  for(const row of rows||[])if(row&&row.sourceKind===source&&typeof row.id==='string'&&typeof row.sourceId==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(row.date))map.set(row.id,{...row});
  return [...map.values()];
}

export function installEstateCalendar(app){
  let owner='',position=null;
  app.registerView('calendar',async({container,signal})=>{
    const actor=app.uid();if(actor!==owner){owner=actor;position=null;}
    position??={month:app.today().slice(0,7),selected:app.today()};
    const state={month:position.month,selected:position.selected,pages:Object.fromEntries(Object.keys(SOURCES).map(key=>[key,{rows:[],cursor:key+':',count:0,complete:false,error:'',seen:[]}])),busy:false,dirty:true,epoch:0};
    const e=app.esc,surface=typeof window!=='undefined'?window:null,doc=typeof document!=='undefined'?document:null;
    const alive=()=>!signal?.aborted&&app.uid()===actor;
    const visible=()=>alive()&&!container.hidden&&!container.closest?.('[hidden]')&&doc?.visibilityState!=='hidden';
    const allRows=()=>Object.values(state.pages).flatMap(page=>page.rows).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||'')||a.id.localeCompare(b.id));
    container.classList.add('estate-calendar-view');
    const empty=text=>`<p class="estate-calendar-empty">${e(text)}</p>`;
    function entry(row,compact=false){return `<button type="button" class="estate-calendar-entry${compact?' estate-calendar-entry-compact':''}" data-estate-calendar-source="${e(row.sourceKind)}" data-estate-calendar-id="${e(row.sourceId)}" aria-label="${e(`${row.date} ${row.time||'시간 미정'} ${row.title||SOURCES[row.sourceKind]}`)}"><time>${e(row.time||'시간 미정')}</time><span>${e(row.title||SOURCES[row.sourceKind])}</span>${compact?'':`<small>${e(SOURCES[row.sourceKind])} · 원본 열기</small>`}</button>`;}
    function paint(){
      if(!alive())return;
      position={month:state.month,selected:state.selected};
      const rows=allRows(),monthRows=rows.filter(row=>row.date.startsWith(state.month)),selected=rows.filter(row=>row.date===state.selected),byDay=new Map();
      rows.forEach(row=>{if(!byDay.has(row.date))byDay.set(row.date,[]);byDay.get(row.date).push(row);});
      const pages=Object.entries(state.pages),complete=pages.every(([,page])=>page.complete),today=app.today(),[year,month]=state.month.split('-');
      container.innerHTML=`<header class="estate-calendar-toolbar"><div><h2>일정 캘린더</h2><p>${e(year)}년 ${Number(month)}월 · 부동산 업무</p></div><nav aria-label="부동산 캘린더 월 이동"><button type="button" data-estate-calendar-month="-1" aria-label="이전 달">‹</button><button type="button" data-estate-calendar-today>TODAY</button><button type="button" data-estate-calendar-month="1" aria-label="다음 달">›</button></nav><button type="button" data-estate-calendar-refresh ${state.busy?'disabled':''}>새로고침</button></header>
      <p class="estate-calendar-range" role="status">${state.busy?'일정을 불러오는 중 · ':''}불러온 일정 ${rows.length}개 · 이번 달 ${monthRows.length}개 · ${complete?'모든 원본 범위 확인 완료':'아직 조회하지 않은 원본 범위가 있습니다.'}</p>
      <div class="estate-calendar-layout"><section class="estate-calendar-month" aria-label="${e(year)}년 ${Number(month)}월 부동산 캘린더"><div class="estate-calendar-weekdays" aria-hidden="true">${['일','월','화','수','목','금','토'].map(day=>`<span>${day}</span>`).join('')}</div><div class="estate-calendar-grid">${calendarMonthCells(state.month).map(cell=>{const dayRows=byDay.get(cell.date)||[];return `<article class="estate-calendar-cell${cell.inMonth?'':' estate-calendar-outside'}${cell.date===state.selected?' estate-calendar-selected':''}" data-estate-calendar-day="${cell.date}"><button type="button" class="estate-calendar-date" data-estate-calendar-add="${cell.date}" aria-label="${cell.date} 업무 등록"${cell.date===today?' aria-current="date"':''}><span>${cell.day}</span><small>${dayRows.length?`${dayRows.length}건`:'+'}</small></button><div class="estate-calendar-cell-events">${dayRows.slice(0,2).map(row=>entry(row,true)).join('')}${dayRows.length>2?`<button type="button" class="estate-calendar-overflow" data-estate-calendar-select="${cell.date}">+${dayRows.length-2}개 더 보기</button>`:''}</div>${dayRows.length?`<button type="button" class="estate-calendar-mobile-count" data-estate-calendar-select="${cell.date}" aria-label="${cell.date} 일정 ${dayRows.length}개 보기">${dayRows.length}건 보기</button>`:''}</article>`;}).join('')}</div></section>
      <section class="estate-calendar-agenda" aria-label="선택한 날짜의 부동산 일정"><header><h3>${e(state.selected)} 일정</h3><button type="button" data-estate-calendar-add="${e(state.selected)}">+ 업무 등록</button></header>${selected.map(row=>entry(row)).join('')||empty(complete?'이 날짜에 저장된 부동산 일정이 없습니다.':'불러온 범위에는 이 날짜의 일정이 없습니다. 아래에서 다음 범위를 확인할 수 있습니다.')}</section></div>
      <footer class="estate-calendar-pagination"><p>업무·방문·거래·고객 연락·매물 확인 원본을 종류별 최대 50건씩 조회합니다. 건수는 원본 수가 아닌 날짜별 일정 수이며, 여러 날짜를 가진 거래는 여러 일정으로 표시됩니다. 날짜를 누르면 업무 등록, 일정을 누르면 원본 편집이 열립니다.</p><div>${pages.map(([key,page])=>`<section><span>${e(SOURCES[key])} · 일정 ${page.rows.length}개${page.complete?' · 확인 완료':''}</span>${page.error?`<small role="alert">${e(page.error)}</small>`:''}${!page.complete||page.error?`<button type="button" data-estate-calendar-more="${key}" ${state.busy?'disabled':''}>${page.error?'다시 확인':`${e(SOURCES[key])} 다음 50건`}</button>`:''}</section>`).join('')}</div></footer>`;
    }
    async function loadSource(source,{reset=false,pages=1,epoch}={}){
      const old=state.pages[source];let rows=reset?[]:old.rows.slice(),cursor=reset?source+':':old.cursor,count=reset?0:old.count,complete=false,seen=new Set(reset?[]:old.seen);
      if(!cursor)return;
      try{
        for(let index=0;index<pages&&cursor;index++){
          if(!visible()){state.dirty=true;return;}if(epoch!==state.epoch)return;
          const before=cursor,response=await app.api.call('calendar',{cursor});
          if(!alive()||epoch!==state.epoch)return;
          if(!Array.isArray(response.rows))throw Error('일정 응답을 확인할 수 없습니다.');
          rows=mergeCalendarProjection(rows,response.rows,source);count++;
          const next=response.cursor||null;
          if(next===before||seen.has(next))throw Error('조회 위치가 반복됩니다. 새로고침 후 다시 확인해주세요.');
          if(next&&!Object.keys(SOURCES).some(key=>next.startsWith(key+':')))throw Error('다음 조회 범위를 확인할 수 없습니다.');
          seen.add(before);
          // The shared calendar API continues with the next source when this
          // source is exhausted. Each source is independently loaded here.
          cursor=next?.startsWith(source+':')?next:null;complete=!cursor;
        }
        state.pages[source]={rows,cursor,count,complete,error:'',seen:[...seen]};
      }catch(error){if(alive()&&epoch===state.epoch)state.pages[source]={...old,error:error.message||'일정을 불러오지 못했습니다.'};}
    }
    async function load(reset=false,source=null){
      if(!visible()){state.dirty=true;return;}
      if(state.busy){if(reset){state.dirty=true;state.epoch++;}return;}
      state.busy=true;const epoch=state.epoch;state.dirty=false;paint();
      const keys=source?[source]:Object.keys(SOURCES);
      await Promise.all(keys.map(key=>loadSource(key,{reset,pages:reset?Math.max(1,state.pages[key].count):1,epoch})));
      if(!alive())return;
      state.busy=false;paint();
      if(state.dirty&&visible())return load(true);
    }
    container.addEventListener('click',event=>{
      const target=event.target.closest('button');if(!target||!container.contains(target)||!alive())return;
      const data=target.dataset;
      if(data.estateCalendarAdd){state.selected=data.estateCalendarAdd;state.month=state.selected.slice(0,7);paint();app.open('tasks',undefined,{date:state.selected});return;}
      if(data.estateCalendarSelect){state.selected=data.estateCalendarSelect;state.month=state.selected.slice(0,7);paint();container.querySelector('.estate-calendar-agenda')?.scrollIntoView?.({block:'nearest'});return;}
      if(data.estateCalendarSource&&SOURCES[data.estateCalendarSource]){app.open(data.estateCalendarSource,data.estateCalendarId);return;}
      if(data.estateCalendarMonth){state.month=calendarMonthShift(state.month,Number(data.estateCalendarMonth));state.selected=state.month+'-01';paint();return;}
      if(target.hasAttribute('data-estate-calendar-today')){state.selected=app.today();state.month=state.selected.slice(0,7);paint();return;}
      if(data.estateCalendarMore&&SOURCES[data.estateCalendarMore]){load(!!state.pages[data.estateCalendarMore].error,data.estateCalendarMore);return;}
      if(target.hasAttribute('data-estate-calendar-refresh'))load(true);
    },{signal});
    const changed=()=>{state.dirty=true;if(visible())load(true);};
    const visibleAgain=()=>{if(state.dirty&&visible())load(true);};
    surface?.addEventListener('aiderlog-estate-updated',changed,{signal});
    doc?.addEventListener('visibilitychange',visibleAgain,{signal});
    if(typeof MutationObserver!=='undefined'){
      const observer=new MutationObserver(visibleAgain);observer.observe(container,{attributes:true,attributeFilter:['hidden']});signal?.addEventListener('abort',()=>observer.disconnect(),{once:true});
    }
    paint();await load(true);
  });
}
