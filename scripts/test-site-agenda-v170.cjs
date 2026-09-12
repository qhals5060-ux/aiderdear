/* Exercise the actual website renderShared() with an isolated DOM and clock.
 * No browser, accounts, storage writes or Android source changes.
 * node --test scripts/test-site-agenda-v170.cjs
 */
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../index.html'),'utf8');
const start=source.indexOf('  function renderShared(){'),end=source.indexOf('  function getDdays()',start);
assert(start>=0&&end>start,'actual site month agenda renderer exists');
const renderer=source.slice(start,end);
const receivedHelper=source.match(/^  function scheduleReceivedV176\(event\)\{[^\r\n]+/m)?.[0];
assert(receivedHelper,'actual site shared-event ownership helper exists');
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value)}return value}
function fixture(id,date,endDate='',extra={}){return {id,title:id,date,endDate,time:'12:00',owner:'mine',authorEmail:'fixture@example.invalid',custom:{preserve:true},...extra}}
function harness({rows,month='2026-09',at='2026-09-08T16:00:00'}={}){
  const original=JSON.stringify(rows),data=freeze(rows),opened=[];let current=at;
  class Clock extends Date{constructor(...args){super(...(args.length?args:[current]))}static now(){return new Date(current).getTime()}}
  function node(tag='div'){
    let html='';const n={tag,children:[],listeners:{},attributes:{},textContent:'',hidden:false,
      setAttribute(name,value){this.attributes[name]=String(value)},
      appendChild(child){this.children.push(child)},addEventListener(type,handler){this.listeners[type]=handler},
      get innerHTML(){return html},set innerHTML(value){html=value;this.children=[]}};return n;
  }
  const top=node(),compact=node(),title=node(),toggle=node('button');
  const nodes={'#sharedListTop':top,'#sharedList':compact,'#monthAgendaTitle':title,'#coupleAgendaToggle':toggle};
  const context={window:{},firebaseState:{user:{uid:'fixture-owner',email:'fixture@example.invalid'}},Date:Clock,shown:new Date(month+'-01T12:00:00'),$:selector=>nodes[selector],
    calendarDisplayEvents:()=>data,mutualPartner:()=>null,normalizeEmail:value=>String(value||''),
    scheduleOwnerKind:row=>row.owner,escapeHtml:value=>String(value||''),document:{createElement:node},
    openEvent:row=>opened.push(row),toast(){},persistOwnScheduleEvents(){throw Error('agenda must not write records')},
    saveCloudData(){throw Error('agenda must not save records')}};
  vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(__dirname,'../shared-schedule-v176.js'),'utf8'),context);vm.runInContext(receivedHelper+'\n'+renderer,context);
  return {data,opened,top,compact,advance(value){current=value},render(){
    vm.runInContext('renderShared()',context);
    assert.equal(JSON.stringify(data),original,'original dates/order/metadata remain unchanged');
    return [...top.children,...compact.children].map(row=>row.innerHTML.match(/<b>([^<]*)<\/b>/)[1]);
  }};
}

if(process.argv[2]==='--timezone-fixture'){
  const h=harness({at:process.argv[3],rows:[fixture('sept-7','2026-09-07'),fixture('sept-8','2026-09-08')]});
  process.stdout.write(JSON.stringify(h.render()));
}else{
  test('current month excludes finished past dates and keeps all of today plus future dates',()=>{
    const h=harness({rows:[fixture('earlier','2026-09-01'),fixture('yesterday','2026-09-07'),fixture('today-early','2026-09-08','',{time:'00:01'}),fixture('today-late','2026-09-08','',{time:'23:59'}),fixture('future','2026-09-10')]});
    assert.deepEqual(h.render(),['today-early','today-late','future']);
  });
  test('end date is inclusive and retains an ongoing period that started before today or this month',()=>{
    const h=harness({rows:[fixture('ended-yesterday','2026-08-20','2026-09-07'),fixture('ends-today','2026-09-01','2026-09-08'),fixture('cross-month-ongoing','2026-08-30','2026-09-10')]});
    assert.deepEqual(h.render(),['cross-month-ongoing','ends-today']);
    assert.equal(h.data[2].date,'2026-08-30');assert.equal(h.data[2].endDate,'2026-09-10');
  });
  test('past selected month is empty even when a long event continues into the present',()=>{
    const h=harness({month:'2026-08',rows:[fixture('past','2026-08-15'),fixture('ongoing','2026-08-30','2026-09-10')]});
    assert.deepEqual(h.render(),[]);assert.match(h.top.innerHTML,/오늘 이후 일정이 없습니다\./);assert.equal(h.compact.children.length,0);
  });
  test('future selected month preserves month overlap and excludes events outside that month',()=>{
    const h=harness({month:'2026-10',rows:[fixture('september','2026-09-20'),fixture('cross-october','2026-09-30','2026-10-02'),fixture('october','2026-10-20'),fixture('november','2026-11-01')]});
    assert.deepEqual(h.render(),['cross-october','october']);
  });
  test('month and year boundaries include period overlap without including next-month-only rows',()=>{
    const h=harness({at:'2026-12-31T20:00:00',month:'2026-12',rows:[fixture('dec-30','2026-12-30'),fixture('dec-31','2026-12-31'),fixture('cross-year','2026-12-30','2027-01-02'),fixture('jan-only','2027-01-01')]});
    assert.deepEqual(h.render(),['cross-year','dec-31']);
  });
  test('empty or missing end dates fall back to start date and holidays remain excluded',()=>{
    const missing=fixture('missing-end','2026-09-09');delete missing.endDate;
    const h=harness({rows:[fixture('empty-end','2026-09-08'),missing,fixture('holiday','2026-09-10','',{isHoliday:true}),fixture('birthday','2026-09-11','',{isBirthday:true})]});
    assert.deepEqual(h.render(),['empty-end','missing-end','birthday']);
  });
  test('every render refreshes local today after midnight and clears previous DOM rows',()=>{
    const h=harness({at:'2026-09-08T23:59:00',rows:[fixture('sept-8','2026-09-08'),fixture('sept-9','2026-09-09')]});
    assert.deepEqual(h.render(),['sept-8','sept-9']);h.advance('2026-09-09T00:01:00');assert.deepEqual(h.render(),['sept-9']);
  });
  test('display filtering preserves all original rows, metadata, click identity, and the three-row split',()=>{
    const rows=[fixture('past','2026-09-07'),...Array.from({length:5},(_,i)=>fixture('upcoming-'+i,'2026-09-'+String(8+i).padStart(2,'0')))];
    const h=harness({rows});assert.equal(h.render().length,5);assert.equal(h.data.length,6);assert.equal(h.top.children.length,3);assert.equal(h.compact.children.length,2);
    h.top.children[0].listeners.click({stopPropagation(){}});assert.equal(h.opened[0],h.data[1]);assert.deepEqual(h.data[0].custom,{preserve:true});
  });
  test('month agenda gives incoming shares the received class but preserves outgoing own event colour',()=>{
    const h=harness({rows:[fixture('received','2026-09-08','',{owner:'shared',authorUid:'friend',authorEmail:'friend@example.invalid'}),fixture('outgoing','2026-09-08','',{owner:'shared',shareWithCouple:true,authorUid:'fixture-owner'})]});
    assert.deepEqual(h.render(),['received','outgoing']);assert.match(h.top.children[0].className,/schedule-received-v176/);assert.match(h.top.children[0].attributes['aria-label'],/^상대가 공유한 일정 · /);assert.doesNotMatch(h.top.children[1].className,/schedule-received-v176/);assert.equal(h.top.children[1].attributes['aria-label'],undefined);
  });
  test('calendar projection retains historical dates while business rows expose only a read-only summary',()=>{
    const projection=source.match(/^  function calendarDisplayEvents\(year\)\{[^\r\n]+/m)?.[0];
    const occurs=source.match(/^  function eventOccursOnDate\(e,date\)\{[^\r\n]+/m)?.[0];
    assert(projection&&occurs,'actual calendar projection and date membership helpers exist');
    const rows=[fixture('past','2026-09-07'),fixture('ongoing','2026-09-06','2026-09-09')];
    const h=harness({rows});assert.deepEqual(h.render(),['ongoing']);
    const context=vm.createContext({window:{},addEventListener(){},events:h.data,restrictedCalendarEvents:()=>[fixture('work-past','2026-09-07','',{projectionSource:'work-task',memo:'private task details'})],connectionBirthdayEvents:()=>[]});
    vm.runInContext(fs.readFileSync(path.join(__dirname,'../business-calendar-v175.js'),'utf8'),context);
    vm.runInContext(projection+'\n'+occurs,context);
    const ids=vm.runInContext('calendarDisplayEvents(2026).filter(row=>eventOccursOnDate(row,"2026-09-07")).map(row=>row.id)',context);
    assert.deepEqual(Array.from(ids),['past','ongoing','work-past']);
    const work=vm.runInContext('calendarDisplayEvents(2026).find(row=>row.id==="work-past")',context);assert.equal(work.readOnly,true);assert.equal(work.memo,undefined);
  });
  function inTimezone(timezone,at){
    const previous=process.env.TZ;try{
      process.env.TZ=timezone;
      return harness({at,rows:[fixture('sept-7','2026-09-07'),fixture('sept-8','2026-09-08')]}).render();
    }finally{if(previous===undefined)delete process.env.TZ;else process.env.TZ=previous;}
  }
  test('Asia/Seoul shortly after midnight uses September 8 despite a September 7 UTC date',()=>{
    assert.deepEqual(inTimezone('Asia/Seoul','2026-09-07T15:30:00.000Z'),['sept-8']);
  });
  test('America/Los_Angeles late evening keeps September 7 despite a September 8 UTC date',()=>{
    assert.deepEqual(inTimezone('America/Los_Angeles','2026-09-08T06:30:00.000Z'),['sept-7','sept-8']);
  });
}
