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
  close(){this.open=false;}
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
  const document={body,documentElement:new Element('html'),createElement:tag=>new Element(tag),getElementById:id=>body.querySelector('#'+id),querySelector:selector=>body.querySelector(selector),querySelectorAll:selector=>body.querySelectorAll(selector)};
  if(native)document.documentElement.className='aiderlog-android';
  let currentUser=guest?null:{uid:'u1',email,emailVerified:verified},currentModel=model(enabled),readFn=null,mutationFn=null,clock=Date.parse('2026-09-12T03:00:00Z');const reads=[],mutations=[],events=new Map();
  const api={getState:()=>({user:currentUser}),readPrivateCalendarData:async range=>{reads.push(range);return readFn?readFn(range):structuredClone(currentModel)},mutatePrivateCalendar:async action=>{mutations.push(structuredClone(action));if(mutationFn)return mutationFn(action);return{};}};
  class FakeDate extends Date{constructor(...args){super(...(args.length?args:[clock]));}static now(){return clock;}}
  let uuid=0;const window={AiderDearFirebase:api};const context=vm.createContext({...domain,window,document,Date:FakeDate,URLSearchParams,location:{search:''},crypto:{randomUUID:()=>`stable-${++uuid}`},confirm:()=>true,addEventListener:(name,fn)=>events.set(name,fn)});vm.runInContext(source,context);
  return{window,context,document,body,day,mood,emoji,birthLabel,tools,reads,mutations,events,api,inspect:()=>context.inspect(),get user(){return currentUser},set user(value){currentUser=value},set read(value){readFn=value},set mutate(value){mutationFn=value},set model(value){currentModel=value},tick:amount=>clock+=amount};
}
test('intimacy entry and marker are restricted to verified allowlisted accounts; guests make no reads',async()=>{
  for(const options of [{guest:true},{email:'other@example.test'},{email:'qhals5060@gmail.com',verified:false}]){const h=harness(options);await settle();assert(!h.tools.textContent.includes('관계일'));assert.equal(h.day.querySelector('[data-private-calendar-marker="intimacy"]'),null);if(options.guest)assert.equal(h.reads.length,0);}
  const h=harness({email:'aidway55@gmail.com'});await settle();assert(h.tools.textContent.includes('관계일'));assert(h.day.querySelector('[data-private-calendar-marker="intimacy"]'));
});
test('menstrual opt-in controls period add/markers without hiding allowable intimacy',async()=>{
  const h=harness({enabled:false});await settle();assert(!h.tools.textContent.includes('+ 생리일'));assert.equal(h.day.querySelector('[data-private-calendar-marker="period"]'),null);assert(h.tools.textContent.includes('관계일'));
  h.model=model(true);await h.window.AiderPrivateCalendarUIV175.refresh(true);assert(h.tools.textContent.includes('+ 생리일'));assert(h.day.querySelector('[data-private-calendar-marker="period"]'));assert.equal(h.emoji.textContent,'🙂');
});
test('quota read failure retains existing model/markers and cools down repeat requests',async()=>{
  const h=harness();await settle();const before=h.inspect().data;h.read=async()=>{throw Object.assign(new Error('quota'),{code:'firestore/resource-exhausted'})};await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.inspect().data,before);assert(h.day.querySelector('[data-private-calendar-marker="period"]'));
  const count=h.reads.length;for(let n=0;n<5;n++)await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.reads.length,count);assert.match(h.inspect().error,/한도/);h.tick(300001);await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(h.reads.length,count+1);
});
test('late read from former account never decorates or repopulates after logout',async()=>{
  const h=harness();await settle();let release;h.read=()=>new Promise(resolve=>{release=resolve});const pending=h.window.AiderPrivateCalendarUIV175.refresh(true);await settle();h.user=null;h.events.get('aiderdear-firebase-state')();release(model(true));await pending;assert.equal(h.inspect().data,null);assert.equal(h.day.querySelector('[data-private-calendar-marker="intimacy"]'),null);assert.equal(h.day.querySelector('[data-private-calendar-marker="period"]'),null);assert.equal(h.emoji.textContent,'🙂');
});
test('failed save keeps date input and idempotent ID; duplicate submit blocked while busy',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open('period');const form=h.document.getElementById('privateCalendarEntryV175');form.elements.startDate.value='2026-09-10';form.elements.endDate.value='2026-09-13';let reject;h.mutate=()=>new Promise((_resolve,no)=>{reject=no});const first=form.emit('submit');await settle();await form.emit('submit');assert.equal(h.mutations.length,1);reject(new Error('저장 실패'));await first;assert.equal(form.elements.startDate.value,'2026-09-10');assert.equal(form.elements.endDate.value,'2026-09-13');assert.match(h.inspect().error,/저장 실패/);h.mutate=async()=>{throw Error('저장 실패')};await form.emit('submit');assert.equal(h.mutations[0].item.id,h.mutations[1].item.id);
});
test('dialog opens with close control focused, not a keyboard-triggering date input',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open();const dialog=h.document.getElementById('privateCalendarDialogV175');assert(dialog.open);assert(dialog.querySelector('[data-private-close]').focused);assert(!dialog.querySelector('input').focused);
});
test('successful background refresh preserves dirty date and settings inputs',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open('period');const form=h.document.getElementById('privateCalendarEntryV175'),settings=h.document.getElementById('privateCalendarSettingsV175');form.elements.startDate.value='2026-09-10';form.elements.endDate.value='2026-09-13';await form.emit('input');settings.elements.cycleLength.value='31';await settings.emit('input');await h.window.AiderPrivateCalendarUIV175.refresh(true);assert.equal(form.elements.startDate.value,'2026-09-10');assert.equal(form.elements.endDate.value,'2026-09-13');assert.equal(settings.elements.cycleLength.value,'31');
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
test('in-flight save completing after account switch never opens or repopulates previous dialog',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open();let release;h.mutate=()=>new Promise(resolve=>{release=resolve});const form=h.document.getElementById('privateCalendarEntryV175'),pending=form.emit('submit');await settle();h.user={uid:'u9',email:'other@example.test',emailVerified:true};h.events.get('aiderdear-firebase-state')();release({});await pending;await settle();assert.equal(h.document.getElementById('privateCalendarDialogV175'),null);assert(!h.tools.textContent.includes('관계일'));assert.equal(h.day.querySelector('[data-private-calendar-marker="intimacy"]'),null);
});
test('quota save error leaves typed dates and blocks repeated save attempts during cooldown',async()=>{
  const h=harness();await settle();await h.window.AiderPrivateCalendarUIV175.open();const form=h.document.getElementById('privateCalendarEntryV175');form.elements.startDate.value='2026-09-10';form.elements.endDate.value='2026-09-11';await form.emit('input');h.mutate=async()=>{throw Object.assign(Error('quota'),{code:'resource-exhausted'})};await form.emit('submit');await form.emit('submit');assert.equal(h.mutations.length,1);assert.equal(form.elements.startDate.value,'2026-09-10');assert.equal(form.elements.endDate.value,'2026-09-11');assert.match(h.document.getElementById('privateCalendarStatusV175').textContent,/한도/);
});
