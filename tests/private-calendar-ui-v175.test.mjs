/* Actual shared UI in an isolated DOM + memory API. No network or real records. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import * as domain from '../private-calendar-v175.js';
const original=await readFile(new URL('../private-calendar-ui-v175.js',import.meta.url),'utf8');
const source=original.replace(/^import[^\n]*\n/,'')+'\nglobalThis.inspect=()=>({actor,epoch,data,busy,error,draft,retryAt,pending,formKind});';
const dataKey=name=>name.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase());
class Element{
  constructor(tag='div',text=''){this.tagName=tag.toUpperCase();this.nodeType=tag==='#text'?3:1;this.text=text;this.children=[];this.dataset={};this.attributes={};this.listeners=new Map();this.hidden=false;this.disabled=false;this.checked=false;this.value='';this.required=false;this.className='';this.id='';this.style={};}
  get classList(){const self=this;return{contains:name=>self.className.split(/\s+/).includes(name),add(...names){self.className=[...new Set([...self.className.split(/\s+/).filter(Boolean),...names])].join(' ')},remove(...names){self.className=self.className.split(/\s+/).filter(name=>!names.includes(name)).join(' ')}};}
  get parentElement(){return this.parentNode;}
  get firstChild(){return this.children[0]||null;}
  get childNodes(){return this.children;}
  get isConnected(){return this.tagName==='BODY'||!!this.parentNode?.isConnected;}
  get textContent(){return this.nodeType===3?this.text:this.text+this.children.map(child=>child.textContent).join('');}
  set textContent(value){this.text=String(value);this.replaceChildren();}
  appendChild(child){child.remove();this.children.push(child);child.parentNode=this;return child;}
  insertBefore(child,before){child.remove();const index=this.children.indexOf(before);if(index<0)return this.appendChild(child);this.children.splice(index,0,child);child.parentNode=this;return child;}
  remove(){if(this.parentNode){const index=this.parentNode.children.indexOf(this);if(index>=0)this.parentNode.children.splice(index,1);}this.parentNode=null;}
  replaceChildren(...children){this.children.forEach(node=>{node.parentNode=null});this.children=[];children.forEach(node=>this.appendChild(node));}
  setAttribute(name,value){this.attributes[name]=String(value);if(name==='id'||name==='class')this[name==='class'?'className':'id']=String(value);else if(name.startsWith('data-'))this.dataset[dataKey(name)]=String(value);else if(name==='name')this.name=String(value);}
  getAttribute(name){return name.startsWith('data-')?this.dataset[dataKey(name)]??null:this.attributes[name]??null;}
  matches(selector){
    if(this.nodeType!==1)return false;
    for(const [,not]of selector.matchAll(/:not\(([^)]+)\)/g))if(this.matches(not))return false;selector=selector.replace(/:not\([^)]+\)/g,'');
    const attrs=[...selector.matchAll(/\[([^\]=]+)(?:="([^"]*)")?\]/g)];const bare=selector.replace(/\[[^\]]+\]/g,'');
    const id=bare.match(/#([\w-]+)/)?.[1],classes=[...bare.matchAll(/\.([\w-]+)/g)].map(row=>row[1]),tag=bare.match(/^[a-z]+/i)?.[0];
    return(!id||id===this.id)&&classes.every(name=>this.classList.contains(name))&&(!tag||tag.toUpperCase()===this.tagName)&&attrs.every(([,name,value])=>this.getAttribute(name)!==null&&(value==null||this.getAttribute(name)===value));
  }
  querySelectorAll(selector){
    const all=[];const walk=node=>node.children.forEach(child=>{all.push(child);walk(child)});walk(this);
    return all.filter(node=>selector.split(',').some(group=>{const parts=group.trim().split(/\s+/);if(!node.matches(parts.pop()))return false;let parent=node.parentNode;while(parts.length){const part=parts.pop();while(parent&&!parent.matches(part))parent=parent.parentNode;if(!parent)return false;parent=parent.parentNode;}return true;}));
  }
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){return this.matches(selector)?this:this.parentNode?.closest(selector)||null;}
  addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push(fn);}
  async emit(type){for(const fn of this.listeners.get(type)||[])await fn({type,currentTarget:this,target:this,preventDefault(){},stopPropagation(){}});}
  click(){return this.emit('click');}
  focus(){this.focused=true;}
  showModal(){this.open=true;}
  close(){if(!this.open)return;this.open=false;return this.emit('close');}
  get elements(){return Object.fromEntries(this.querySelectorAll('input').filter(node=>node.name).map(node=>[node.name,node]));}
  set innerHTML(html){
    this.replaceChildren();const stack=[this];for(const token of html.match(/<[^>]+>|[^<]+/g)||[]){
      if(token.startsWith('</')){stack.pop();continue;}if(token.startsWith('<')){const tag=token.match(/^<([a-z\d-]+)/i)?.[1];if(!tag)continue;const node=new Element(tag);for(const match of token.matchAll(/\s([\w-]+)(?:="([^"]*)")?/g))node.setAttribute(match[1],match[2]??'');stack.at(-1).appendChild(node);if(!['input','br','img','hr'].includes(tag))stack.push(node);}else stack.at(-1).appendChild(new Element('#text',token));
    }
  }
}
const settle=async()=>{for(let n=0;n<8;n++)await Promise.resolve();};
const model=enabled=>({settings:{menstrualEnabled:enabled,cycleLength:28,periodLength:5,revision:1},periods:[{id:'p1',startDate:'2026-09-12',endDate:'2026-09-14',note:'',revision:1}],intimacy:[{id:'i1',date:'2026-09-12',note:'',revision:1}],canUseIntimacy:true,hasMore:{periods:false,intimacy:false}});
function harness({email='qhals5060@gmail.com',verified=true,guest=false,enabled=true,native=false}={}){
  const body=new Element('body'),calendar=body.appendChild(new Element());calendar.id='calendar';const day=calendar.appendChild(new Element());day.className='day';day.dataset.date='2026-09-12';const mood=day.appendChild(new Element());mood.className='calendar-status-icons';const emoji=mood.appendChild(new Element('span'));emoji.className='calendar-status-icon mood mine';emoji.textContent='🙂';
  const birthLabel=body.appendChild(new Element('label')),birth=birthLabel.appendChild(new Element('input'));birth.id='loginBirthDate';const tools=body.appendChild(new Element()),emotion=tools.appendChild(new Element('button'));emotion.id='addEmotionTop';
  const schedule=body.appendChild(new Element());schedule.id=native?'':'scheduleModal';schedule.className=native?'schedule-dialog-v125 on':'overlay open';
  const scheduleClose=schedule.appendChild(new Element('button'));scheduleClose.setAttribute(native?'data-schedule-dialog-close-v125':'data-close',native?'':'scheduleModal');scheduleClose.addEventListener('click',()=>schedule.classList.remove(native?'on':'open'));
  const scheduleBody=schedule.appendChild(new Element()),scheduleForm=scheduleBody.appendChild(new Element('form'));if(native)scheduleForm.setAttribute('data-schedule-form-v125','');else scheduleForm.id='scheduleForm';
  const scheduleDate=scheduleForm.appendChild(new Element('input'));scheduleDate.setAttribute('name','date');scheduleDate.id=native?'':'eventDate';scheduleDate.value='2026-09-18';
  const scheduleTitle=scheduleForm.appendChild(new Element('input'));scheduleTitle.name='title';scheduleTitle.value='입력 중인 개인 일정';
  const scheduleFooter=scheduleForm.appendChild(new Element());scheduleFooter.className=native?'schedule-dialog-actions-v125':'modal-actions';
  const scheduleCancel=native?scheduleFooter.appendChild(new Element('button','취소')):null;if(scheduleCancel){scheduleCancel.setAttribute('type','button');scheduleCancel.setAttribute('data-schedule-dialog-close-v125','');}
  const scheduleSave=scheduleFooter.appendChild(new Element('button','저장'));scheduleSave.setAttribute('type','submit');scheduleSave.id=native?'':'saveEvent';
  const legacySection=body.appendChild(new Element());legacySection.id='emotionCycleSection';const legacyInput=legacySection.appendChild(new Element('input'));legacyInput.id='emotionPeriod';legacyInput.checked=true;
  const document={body,documentElement:new Element('html'),createElement:tag=>new Element(tag),getElementById:id=>body.querySelector('#'+id),querySelector:selector=>body.querySelector(selector),querySelectorAll:selector=>body.querySelectorAll(selector)};
  if(native)document.documentElement.className='aiderlog-android';
  let currentUser=guest?null:{uid:'u1',email,emailVerified:verified},currentModel=model(enabled),readFn=null,mutationFn=null,clock=Date.parse('2026-09-12T03:00:00Z');const reads=[],mutations=[],events=new Map();
  const api={getState:()=>({user:currentUser}),readPrivateCalendarData:async range=>{reads.push(range);return readFn?readFn(range):structuredClone(currentModel)},mutatePrivateCalendar:async action=>{mutations.push(structuredClone(action));if(mutationFn)return mutationFn(action);if(action.type==='day-set'){const key=action.kind==='period'?'periodDays':'intimacyDays';const rows=currentModel[key]||[];const previous=rows.find(row=>row.date===action.date);const result=domain.privateCalendarDayMutation(action,previous);currentModel[key]=[...rows.filter(row=>row.date!==action.date),result.item];if(action.kind==='period'&&action.active)currentModel.settings.menstrualEnabled=true;return result;}return{};}};
  class FakeDate extends Date{constructor(...args){super(...(args.length?args:[clock]));}static now(){return clock;}}
  const emotions=[];let uuid=0;const window={AiderDearFirebase:api,AiderAppEmotionV176:{open:(date,options)=>emotions.push({date,...options})}};const context=vm.createContext({...domain,window,document,Date:FakeDate,URLSearchParams,location:{search:'',hash:'#home'},crypto:{randomUUID:()=>`stable-${++uuid}`},confirm:()=>true,addEventListener:(name,fn)=>events.set(name,fn)});vm.runInContext(source,context);
  return{window,context,document,body,day,mood,emoji,birthLabel,tools,schedule,scheduleForm,scheduleFooter,scheduleCancel,scheduleDate,scheduleTitle,scheduleSave,legacySection,legacyInput,reads,mutations,events,emotions,api,inspect:()=>context.inspect(),get user(){return currentUser},set user(value){currentUser=value},set read(value){readFn=value},set mutate(value){mutationFn=value},set model(value){currentModel=value},tick:amount=>clock+=amount};
}
test('intimacy entry and marker are restricted to verified allowlisted accounts; guests make no reads',async()=>{
  for(const options of [{guest:true},{email:'other@example.test'},{email:'qhals5060@gmail.com',verified:false}]){const h=harness(options);await settle();assert(!h.schedule.textContent.includes('관계'));assert.equal(h.day.querySelector('[data-private-calendar-marker="intimacy"]'),null);if(options.guest)assert.equal(h.reads.length,0);}
  const h=harness({email:'aidway55@gmail.com'});await settle();assert(h.schedule.textContent.includes('관계'));assert(h.day.querySelector('[data-private-calendar-marker="intimacy"]'));
});
test('period action keeps concise label and enables markers when explicitly toggled',async()=>{
  const h=harness({enabled:false});await settle();assert.equal(h.schedule.querySelector('[data-private-schedule-kind="period"]').textContent,'생리');assert.equal(h.schedule.querySelector('[data-private-schedule-kind="period"]').title,'생리');assert.equal(h.day.querySelector('[data-private-calendar-marker="period"]'),null);assert(h.schedule.textContent.includes('관계'));
  await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();await settle();assert.equal(h.inspect().data.settings.menstrualEnabled,true);assert(h.day.querySelector('[data-private-calendar-marker="period"]'));assert.equal(h.emoji.textContent,'🙂');
});
test('quota read failure retains existing model/markers and cools down repeat requests',async()=>{
  const h=harness();await settle();const before=h.inspect().data;h.read=async()=>{throw Object.assign(new Error('quota'),{code:'firestore/resource-exhausted'})};await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.inspect().data,before);assert(h.day.querySelector('[data-private-calendar-marker="period"]'));
  const count=h.reads.length;for(let n=0;n<5;n++)await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.reads.length,count);assert.match(h.inspect().error,/한도/);h.tick(300001);await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.reads.length,count+1);
});
test('late read from former account never decorates or repopulates after logout',async()=>{
  const h=harness();await settle();let release;h.read=()=>new Promise(resolve=>{release=resolve});const pending=h.window.AiderPrivateCalendarUIV175.refresh(true);await settle();h.user=null;h.events.get('aiderdear-firebase-state')();release(model(true));await pending;assert.equal(h.inspect().data,null);assert.equal(h.day.querySelector('[data-private-calendar-marker="intimacy"]'),null);assert.equal(h.day.querySelector('[data-private-calendar-marker="period"]'),null);assert.equal(h.emoji.textContent,'🙂');
});
test('failed day toggle keeps schedule draft and chosen date; duplicate click is blocked while busy',async()=>{
  const h=harness();await settle();let reject;h.mutate=()=>new Promise((_resolve,no)=>{reject=no});const first=h.schedule.querySelector('[data-private-schedule-kind="period"]').click();await settle();await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();assert.equal(h.mutations.length,1);reject(new Error('저장 실패'));await first;assert.equal(h.scheduleDate.value,'2026-09-18');assert.equal(h.scheduleTitle.value,'입력 중인 개인 일정');assert.match(h.inspect().error,/저장 실패/);assert.equal(h.document.getElementById('privateCalendarEntryV175'),null);h.mutate=async()=>{throw Error('저장 실패')};await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();assert.deepEqual(h.mutations[0],h.mutations[1]);
});
test('dialog opens with close control focused, not a keyboard-triggering date input',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open();const dialog=h.document.getElementById('privateCalendarDialogV175');assert(dialog.open);assert(dialog.querySelector('[data-private-close]').focused);assert(!dialog.querySelector('input').focused);
});
test('settings-only profile dialog and background refresh preserve dirty settings and schedule date',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open('period');const settings=h.document.getElementById('privateCalendarSettingsV175');settings.elements.cycleLength.value='31';await settings.emit('input');await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.scheduleDate.value,'2026-09-18');assert.equal(settings.elements.cycleLength.value,'31');assert.equal(h.document.getElementById('privateCalendarEntryV175'),null);assert.equal(h.document.querySelector('.private-calendar-notice-v175'),null);
});
test('private-created marker container preserves later non-private emotion children on logout',async()=>{
  const h=harness();h.mood.remove();await settle();const line=h.day.querySelector('[data-private-calendar-marker="line"]'),emoji=line.appendChild(new Element('span'));emoji.className='calendar-status-icon mood mine';emoji.textContent='😌';h.user=null;h.events.get('aiderdear-firebase-state')();assert.equal(emoji.parentNode,line);assert(line.isConnected);assert.equal(line.children.length,1);
});
test('replaced account birthday field receives one connected profile button',async()=>{
  const h=harness();await settle();h.birthLabel.remove();const label=h.body.appendChild(new Element('label')),birth=label.appendChild(new Element('input'));birth.id='loginBirthDate';h.window.AiderPrivateCalendarUIV175.syncProfile();h.window.AiderPrivateCalendarUIV175.syncProfile();assert.equal(label.querySelectorAll('#privateCalendarProfileV175').length,1);
});
test('native visible calendar receives markers instead of hidden site cells and controls read range',async()=>{
  const h=harness({native:true});await settle();const home=h.body.appendChild(new Element());home.id='home';const cell=home.appendChild(new Element());cell.dataset.scheduleDateV125='2026-09-12';cell.dataset.date='2026-09-12';h.day.dataset.date='2024-01-01';h.window.AiderPrivateCalendarUIV175.calendarChanged();await settle();assert(cell.querySelector('[data-private-calendar-marker="period"]'));assert(cell.querySelector('[data-private-calendar-marker="intimacy"]'));assert.equal(h.day.querySelector('[data-private-calendar-marker="period"]'),null);assert.equal(h.reads.at(-1).from,'2026-09-12');
});
test('overlapping refresh calls coalesce to one API request',async()=>{
  const h=harness();await settle();let release;h.read=()=>new Promise(resolve=>{release=resolve});const count=h.reads.length,pending=[];for(let n=0;n<6;n++)pending.push(h.window.AiderPrivateCalendarUIV175.refresh(true));await settle();assert.equal(h.reads.length,count+1);release(model(true));await Promise.all(pending);assert.equal(h.inspect().pending,null);
});
test('in-flight day toggle after account switch never repopulates previous private state',async()=>{
  const h=harness();await settle();let release;h.mutate=()=>new Promise(resolve=>{release=resolve});const pending=h.schedule.querySelector('[data-private-schedule-kind="intimacy"]').click();await settle();h.user={uid:'u9',email:'other@example.test',emailVerified:true};h.events.get('aiderdear-firebase-state')();release({});await pending;await settle();assert.equal(h.document.getElementById('privateCalendarDialogV175'),null);assert.equal(h.schedule.querySelector('[data-private-schedule-kind="intimacy"]'),null);assert.equal(h.day.querySelector('[data-private-calendar-marker="intimacy"]'),null);
});
test('quota day-toggle error leaves selected date and blocks repeated attempts during cooldown',async()=>{
  const h=harness();await settle();h.mutate=async()=>{throw Object.assign(Error('quota'),{code:'resource-exhausted'})};await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();assert.equal(h.mutations.length,1);assert.equal(h.scheduleDate.value,'2026-09-18');assert.match(h.scheduleFooter.querySelector('[data-private-day-error-v178]').textContent,/한도/);
});
test('site and app Schedule directly toggle separate period/intimacy days without opening any record form',async()=>{
  for(const native of [false,true])for(const kind of ['period','intimacy']){
    const h=harness({native});await settle();h.window.AiderPrivateCalendarUIV175.scheduleOpened();await settle();
    assert.equal(h.tools.querySelector('[data-private-schedule-v176]'),null);assert.equal(h.body.querySelector('.private-calendar-actions-v175'),null);
    assert.equal(h.schedule.querySelectorAll('[data-private-schedule-v176]').length,1);
    await h.schedule.querySelector(`[data-private-schedule-kind="${kind}"]`).click();await settle();
    assert.equal(h.document.getElementById('privateCalendarEntryV175'),null);assert.equal(h.document.getElementById('privateCalendarDialogV175'),null);
    assert(h.schedule.classList.contains(native?'on':'open'));assert.equal(h.scheduleTitle.value,'입력 중인 개인 일정');assert.equal(h.mutations.length,1);
    assert.deepEqual(h.mutations[0],{type:'day-set',kind,date:'2026-09-18',active:true,expectedRevision:0});
    assert.equal(h.schedule.querySelector(`[data-private-schedule-kind="${kind}"]`).getAttribute('aria-pressed'),'true');
    await h.schedule.querySelector(`[data-private-schedule-kind="${kind}"]`).click();await settle();assert.equal(h.mutations[1].active,false);assert.equal(h.mutations[1].expectedRevision,1);
  }
});
test('private entries do not appear in read-only site or app schedule views or to guests',async()=>{
  for(const native of [false,true]){
    const h=harness({native});await settle();h.scheduleSave.hidden=true;h.scheduleDate.disabled=true;h.window.AiderPrivateCalendarUIV175.scheduleOpened();
    const strip=h.schedule.querySelector('[data-private-schedule-v176]');assert(strip.hidden);assert.equal(strip.children.length,0);
    h.scheduleSave.hidden=false;h.scheduleDate.disabled=false;h.user=null;h.events.get('aiderdear-firebase-state')();assert(strip.hidden);assert.equal(strip.children.length,0);
  }
});
test('switching selected schedule date updates button state, not the personal draft',async()=>{
  const h=harness();await settle();await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();await settle();
  h.scheduleDate.value='2026-09-25';await h.scheduleForm.emit('change');assert.equal(h.schedule.querySelector('[data-private-schedule-kind="period"]').getAttribute('aria-pressed'),'false');await h.schedule.querySelector('[data-private-schedule-kind="period"]').click();await settle();assert.equal(h.mutations[1].date,'2026-09-25');assert.equal(h.scheduleTitle.value,'입력 중인 개인 일정');assert.equal(h.scheduleForm.listeners.get('change').length,1);
});
test('old emotion period control is hidden and disabled without changing historical flags',async()=>{
  const h=harness();await settle();assert(h.legacySection.hidden);assert(h.legacyInput.disabled);assert(h.legacyInput.checked);assert.equal(h.mutations.length,0);
  const css=await readFile(new URL('../private-calendar-v175.css',import.meta.url),'utf8');assert.match(css,/#emotionCycleSection[^}]+display:none!important/);assert.match(css,/\.emotion-day-flags :is\(\.period,\.intimacy\)/);
});
test('day toggles never close the Schedule draft or change selected date, scroll or focus',async()=>{
  for(const native of [false,true])for(const kind of ['period','intimacy']){
    const h=harness({native});await settle();h.scheduleTitle.value='격리 검증 입력 유지';h.scheduleDate.value='2026-09-13';h.schedule.scrollTop=123;h.body.classList.add('modal-open');
    await h.schedule.querySelector(`[data-private-schedule-kind="${kind}"]`).click();await settle();assert.equal(h.document.getElementById('privateCalendarDialogV175'),null);
    assert(h.schedule.classList.contains(native?'on':'open'));assert.equal(h.scheduleTitle.value,'격리 검증 입력 유지');assert.equal(h.scheduleDate.value,'2026-09-13');assert.equal(h.schedule.scrollTop,123);assert.equal(h.mutations.length,1);
    assert(!h.scheduleTitle.focused);assert(h.body.classList.contains('modal-open'));
  }
});
test('period and intimacy on the same selected date stay independent without submitting schedule fields',async()=>{
  const h=harness({native:true});await settle();for(const kind of ['period','intimacy','period'])await h.schedule.querySelector(`[data-private-schedule-kind="${kind}"]`).click();await settle();
  assert(h.schedule.classList.contains('on'));assert.equal(h.scheduleTitle.value,'입력 중인 개인 일정');assert.equal(h.mutations.length,3);assert.equal(h.schedule.querySelector('[data-private-schedule-kind="period"]').getAttribute('aria-pressed'),'false');assert.equal(h.schedule.querySelector('[data-private-schedule-kind="intimacy"]').getAttribute('aria-pressed'),'true');assert(h.mutations.every(row=>row.type==='day-set'&&!row.item&&!row.title));
});

test('site and app private date actions move beside the header save without duplicating controls',async()=>{
  for(const native of [false,true]){
    const h=harness({native});await settle();const header=h.schedule.appendChild(new Element());header.dataset.privateHeaderV179='';header.appendChild(h.scheduleSave);for(let i=0;i<3;i++)h.window.AiderPrivateCalendarUIV175.scheduleOpened();await settle();
    const secondary=header.querySelector('[data-schedule-secondary-v176]'),strip=secondary.querySelector('[data-private-schedule-v176]');
    assert.equal(header.children[1],secondary);assert.equal(h.schedule.querySelectorAll('[data-private-schedule-v176]').length,1);
    assert.equal(h.scheduleSave.parentElement,header);assert.equal(h.schedule.querySelectorAll('button[type="submit"]').length,1);
    assert.deepEqual(strip.children.map(button=>button.dataset.privateScheduleKind),['period','intimacy']);
    assert.equal(secondary.querySelector('[data-schedule-emotion-footer-v176]'),null);
  }
});

test('footer intimacy controls preserve verified account allowlist and never appear for signed-out users',async()=>{
  for(const native of [false,true])for(const options of [{guest:true},{email:'other@example.test'},{verified:false},{email:'qhals5060@gmail.com'},{email:'aidway55@gmail.com'}]){
    const h=harness({...options,native});await settle();const allowed=!options.guest&&options.verified!==false&&options.email!=='other@example.test';
    assert.equal(!!h.scheduleFooter.querySelector('[data-private-schedule-kind="intimacy"]'),allowed);
    assert.equal(!!h.scheduleFooter.querySelector('[data-private-schedule-kind="period"]'),allowed);
    assert.equal(h.scheduleFooter.querySelector('[data-schedule-emotion-footer-v176]'),null);
  }
});

test('app schedule no longer contains an emotion action and keeps the draft untouched',async()=>{
  for(const guest of [false,true]){
    const h=harness({native:true,guest});await settle();h.schedule.scrollTop=73;
    assert.equal(h.scheduleFooter.querySelector('[data-schedule-emotion-footer-v176]'),null);h.window.AiderPrivateCalendarUIV175.scheduleOpened();await settle();
    assert.equal(h.emotions.length,0);assert.equal(h.scheduleTitle.value,'입력 중인 개인 일정');
    assert(h.schedule.classList.contains('on'));assert.equal(h.schedule.scrollTop,73);assert.equal(h.scheduleTitle.value,'입력 중인 개인 일정');assert.equal(h.mutations.length,0);
    assert(!h.scheduleTitle.focused);
  }
});

test('read-only schedules cannot expose or activate private date actions',async()=>{
  const readonly=harness({native:true});await settle();readonly.scheduleDate.disabled=true;readonly.window.AiderPrivateCalendarUIV175.scheduleOpened();assert.equal(readonly.schedule.querySelector('[data-private-schedule-kind]'),null);assert.equal(readonly.emotions.length,0);assert.equal(readonly.mutations.length,0);
});

test('schedule footer styles wrap instead of clipping and retain accessible small-screen touch height',async()=>{
  const css=await readFile(new URL('../private-calendar-v175.css',import.meta.url),'utf8');
  assert.match(css,/\[data-schedule-footer-v176\]\{[^}]*flex-wrap:wrap!important[^}]*min-width:0/);
  assert.match(css,/\[data-schedule-secondary-v176\] button\{[^}]*min-height:40px[^}]*min-width:0/);
  assert.match(css,/@media\(max-width:420px\)/);
  assert.doesNotMatch(css,/\.private-schedule-actions-v176[^}]*min-width:100px/);
});

test('private calendar adapter no longer launches a retired emotion dialog',()=>{
  assert.doesNotMatch(original,/AiderAppEmotionV176|openEmotionFromSchedule/);
});

test('v179 private controls are underlined compact header links, not boxed buttons',async()=>{
  const css=await readFile(new URL('../schedule-editor-v179.css',import.meta.url),'utf8');
  assert.match(css,/\[data-private-schedule-kind\]\{[^}]*background:transparent!important[^}]*border:0!important[^}]*text-decoration:underline/);
});
