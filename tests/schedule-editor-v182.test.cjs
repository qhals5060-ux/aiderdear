const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8');
const site=read('index.html'),native=read('android-src/assets/feature-system-v125.js'),css=read('schedule-editor-v179.css');

test('site and app place private date actions next to header date/title, before separate compact Save/X',()=>{
  const app=native.slice(native.indexOf('function ensureScheduleDialogV125'),native.indexOf('function syncScheduleScopeV148'));
  const form=site.slice(site.indexOf('<!-- Schedule editor -->'),site.indexOf('<!-- Calendar import -->'));
  for(const [html,title]of [[app,'h2 data-schedule-title-v125'],[form,'b id="scheduleModalTitle"']]){
    assert.match(html,new RegExp('class="schedule-editor-heading-v182" data-private-header-v179><'+title));
    assert.doesNotMatch(html,/class="schedule-editor-tools-v179" data-private-header/);
    const save=html.indexOf('>저장</button>'),close=html.indexOf('aria-label="닫기"');assert(save>=0&&save<close);
  }
  assert.match(css,/schedule-editor-heading-v182\{[^}]*display:flex!important[^}]*align-items:center!important/);
  assert.match(css,/#scheduleModal \.schedule-editor-primary-v179 button\{[^}]*height:30px!important[^}]*font-size:12px!important/);
  assert.match(css,/html body \.schedule-dialog-v125 \.schedule-editor-heading-v182 \[data-private-schedule-kind\][^}]*text-decoration:underline!important/);
  const integration=read('private-calendar-ui-v175.js');assert.match(integration,/host.querySelector\('\[data-private-header-v179\]'\)/);
  assert.match(integration,/strip.hidden=!identity\(\)\|\|!canUsePrivateIntimacy\(user\(\)\)\|\|!context.editable/);
});

test('site Couple and Friends are sibling checkbox options with no changed permission or Google API',()=>{
  const form=site.slice(site.indexOf('<!-- Schedule editor -->'),site.indexOf('<!-- Calendar import -->'));
  assert.match(form,/id="eventOwnerField"[^>]*role="group"[^>]*><label[^>]*><input id="eventShared" type="checkbox"><span>커플<\/span><\/label><label[^>]*><input id="eventShareFriends" type="checkbox"><span>친구<\/span>/);
  assert.match(css,/#scheduleModal #eventOwnerField.schedule-share-options-v182\{[^}]*display:flex!important[^}]*flex-wrap:nowrap!important/);
  assert.match(css,/#scheduleModal #eventOwnerField.schedule-share-options-v182\{[^}]*flex-direction:row!important/);
  assert.match(css,/#scheduleModal #eventFriendShareV175\{[^}]*flex-direction:row!important[^}]*min-height:0!important[^}]*padding:0!important/);
  assert.match(css,/#scheduleModal #eventFriendShareV175 label\{[^}]*height:26px!important/);
  assert.match(css,/#scheduleModal #eventFriendShareV175>small:empty\{display:none!important/);
  assert.match(read('friend-schedule-ui-v175.js'),/\|\|\$\('eventShareFriends'\)/);
  const adapter=read('friend-schedule-ui-v175.js');assert.doesNotMatch(adapter,/googleapis|calendarSyncRequest|createGoogleEvent/);
  assert.match(adapter,/!event\.readOnly&&!event\.externalSource&&!event\.projectionSource&&!event\.friendShared/);
});

class Node {
  constructor(){this.listeners={};this.style={};this.attributes={};this.children=[];this.dataset={};this.classList={add(){}};this.connected=false;}
  get isConnected(){return this.connected;}
  setAttribute(name,value){this.attributes[name]=value;}
  addEventListener(name,fn){this.listeners[name]=fn;}
  appendChild(child){this.children.push(child);child.connected=true;child.parent=this;return child;}
  contains(node){return !!node&&(node===this||this.children.some(child=>child.contains(node)));}
  remove(){this.connected=false;if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this);}
  getBoundingClientRect(){return {left:20,top:30,bottom:90,width:300,height:180};}
  emit(name,extra={}){const event={target:this,relatedTarget:null,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;},...extra};this.listeners[name]?.(event);return event;}
}
function hoverFixture(rows){
  const body=new Node(),cell=body.appendChild(new Node()),timers=new Map(),opened=[],notices=[];let next=0;
  const context={document:{createElement:()=>new Node(),body},window:{innerWidth:700,innerHeight:800,AiderScheduleTimeV179:{entries:items=>items.map(row=>({row,separatorBefore:false})),format:row=>row.time||''}},escapeHtml:text=>String(text).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'),scheduleReceivedV176:row=>!!row.friendShared,openEvent:row=>opened.push(row),toast:text=>notices.push(text),requestAnimationFrame:fn=>fn(),setTimeout:fn=>{timers.set(++next,fn);return next;},clearTimeout:key=>timers.delete(key)};
  const start=site.indexOf('  let calendarTooltip='),end=site.indexOf('  function renderCalendar()',start);
  vm.createContext(context);vm.runInContext(site.slice(start,end)+';globalThis.attach=attachCalendarEventTooltip;globalThis.getTip=()=>calendarTooltip;',context);context.attach(cell,rows,'2026-09-20');
  return {body,cell,context,opened,notices,get tip(){return context.getTip();},flush(){const run=[...timers.values()];timers.clear();run.forEach(fn=>fn());},click(index){const button=new Node();button.dataset.calendarTooltipEventV182=String(index);button.closest=()=>button;return this.tip.emit('click',{target:button});}};
}

test('overflow hover retains every event and remains clickable across cell-to-popover gap',()=>{
  const rows=Array.from({length:7},(_,index)=>({id:'e'+index,title:'일정 '+index,time:'10:00'}));rows[6].title='<script>bad</script>';
  const f=hoverFixture(rows);f.cell.emit('mouseenter');const tip=f.tip;assert.equal(tip.attributes.role,'dialog');assert.equal((tip.innerHTML.match(/data-calendar-tooltip-event-v182=/g)||[]).length,7);assert(!tip.innerHTML.includes('<script>'));
  f.cell.emit('mouseleave');tip.emit('mouseenter');f.flush();assert.equal(f.tip,tip);const event=f.click(6);assert(event.prevented&&event.stopped);assert.equal(f.opened[0],rows[6]);assert.equal(f.tip,null);
});

test('overflow hover supports focus transfer, Escape dismissal and outside departure',()=>{
  const f=hoverFixture([{id:'e',title:'일정'}]);f.cell.emit('focusin');const tip=f.tip;f.cell.emit('focusout',{relatedTarget:tip});f.flush();assert.equal(f.tip,tip);tip.emit('keydown',{key:'Escape'});assert.equal(f.tip,null);assert.equal(f.opened.length,0);
  f.cell.emit('mouseenter');f.tip.emit('mouseleave');f.flush();assert.equal(f.tip,null);
  assert.match(css,/body>\.calendar-event-tooltip\{pointer-events:auto!important;max-height:[^}]*overflow-y:auto!important/);
});

test('popover routes incoming and business rows through existing edit permissions, birthdays remain notices',()=>{
  const own={id:'own',title:'내 일정',isAiderDear:true,authorUid:'owner',authorEmail:'owner@example.test'},incoming={...own,id:'incoming',friendShared:true},business={...own,id:'work',projectionSource:'work'},birthday={id:'birth',title:'생일',isBirthday:true};
  const f=hoverFixture([own,incoming,business,birthday]);for(let index=0;index<4;index++){f.cell.emit('mouseenter');f.click(index);}assert.deepEqual(f.opened,[own,incoming,business]);assert.equal(f.notices.length,1);
  const fields=new Map(),readonly=[],sources=[];const ctx={currentUser:'owner@example.test',currentUserEmail:'owner@example.test',firebaseState:{user:{uid:'owner'}},normalizeEmail:value=>String(value||'').toLowerCase(),sharedPartner:()=>null,$:id=>{if(!fields.has(id))fields.set(id,{});return fields.get(id);},configureOwnerOptions(){},setScheduleReadOnly:flag=>readonly.push(flag),syncEventAllDayFields(){},openModal(){},window:{AiderBusinessCalendarV175:{open:row=>sources.push(row)}}};
  const guard=site.split('\n').find(line=>line.includes('function canEditEvent(')),start=site.indexOf('  function openEvent(e){'),end=site.indexOf("  $('#eventAllDay').addEventListener",start);
  vm.createContext(ctx);vm.runInContext(guard+'\n'+site.slice(start,end)+';globalThis.open=openEvent;',ctx);
  ctx.open(own);ctx.open(incoming);ctx.open(business);assert.deepEqual(readonly,[false,true]);assert.deepEqual(sources,[business]);
});
