import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {todoRowsV179,filterTodosV179,sortTodosV179,todoDateV179,mutateTodoRowsV179,todoFailureV179,mergePrivateNotesV179} from '../todo-domain-v179.js';
import {decodeArchive,encodeArchive,encodeStoredPayload} from '../archive-codec-v168.js';
import {createConsultSync} from '../consult-sync-v167.js';

const clone=value=>value==null?value:structuredClone(value);
const sample=()=>({checklists:[{id:'old',text:'기존 투두',date:'',done:false,createdAt:10,unknown:{keep:true}},{id:'due',text:'날짜 있음',date:'2026-09-10',done:false,createdAt:9},{id:'done',text:'완료함',date:'2026-09-11',done:true,createdAt:8},{id:'widget-note',text:'위젯 메모',kind:'memo',createdAt:7}],memos:[{id:'site-note',text:'사이트 메모',createdAt:8}],personalItems:[{id:'body',note:'untouched'}],consultingClients:[{id:'client',name:'untouched'}]});
const save=(overrides={})=>({source:'checklists',op:'save',id:'new',mutationId:'request_12345678',expected:'null',kind:'todo',text:'새 할 일',notes:'상세 정보',date:'',important:false,...overrides});

test('legacy undated checklist entries remain todos; site/widget memos are not silently converted',()=>{
  const rows=todoRowsV179(sample());
  assert.equal(rows.find(r=>r.id==='old').kind,'todo');assert.equal(rows.find(r=>r.id==='widget-note').kind,'memo');assert.equal(rows.find(r=>r.id==='site-note').source,'memos');
  assert.deepEqual(filterTodosV179(sample()).map(r=>r.id),['due','old']);
  assert.deepEqual(filterTodosV179(sample(),{kind:'memo'}).map(r=>r.id),['site-note','widget-note']);
});
test('incomplete includes every due date and undated tasks; filters search completed and overdue accurately',()=>{
  assert.deepEqual(filterTodosV179(sample(),{filter:'overdue',today:'2026-09-19'}).map(r=>r.id),['due']);
  assert.deepEqual(filterTodosV179(sample(),{filter:'done'}).map(r=>r.id),['done']);
  assert.deepEqual(filterTodosV179(sample(),{filter:'today',today:'2026-09-10'}).map(r=>r.id),['due']);
  assert.deepEqual(filterTodosV179(sample(),{filter:'all',query:'기존'}).map(r=>r.id),['old']);
  assert.deepEqual(sortTodosV179([{id:'a',done:false,date:''},{id:'b',done:false,date:'2026-10-10'},{id:'c',done:false,date:'2026-08-01'}]).map(r=>r.id),['c','b','a']);
});
test('shared mutation preserves unknown row fields and all unrelated collections',()=>{
  const p=sample(),before=clone(p),old=p.checklists[0];
  const r=mutateTodoRowsV179(p,save({id:'old',expected:JSON.stringify(old),text:'수정한 일',date:'2026-10-02',important:true}),100);
  assert.deepEqual(p,before);assert.deepEqual(r.row.unknown,{keep:true});assert.equal(r.row.date,'2026-10-02');assert.equal(r.row.important,true);assert.equal(r.row.createdAt,10);assert.deepEqual(r.rows.slice(1),p.checklists.slice(1));
});
test('explicit clear of legacy dueAt cannot resurrect an erased deadline',()=>{
  const p={checklists:[{id:'old',text:'Task',dueAt:'2026-09-02',note:'legacy note'}]};const r=mutateTodoRowsV179(p,save({id:'old',expected:JSON.stringify(p.checklists[0]),date:'',notes:''}),100);
  assert.equal(r.row.date,'');assert.equal(r.row.dueAt,'');assert.equal(r.row.note,'');assert.equal(r.row.notes,'');assert.equal(todoRowsV179({checklists:r.rows})[0].date,'');
});
test('complete, undo and delete use the exact source collection and selected row',()=>{
  const p=sample(),old=p.checklists[0];const done=mutateTodoRowsV179(p,save({op:'toggle',id:'old',expected:JSON.stringify(old),done:true}),100);
  assert(done.row.done);assert.equal(done.row.completedAt,100);
  const undone=mutateTodoRowsV179({checklists:done.rows},save({op:'toggle',id:'old',expected:JSON.stringify(done.row),done:false,mutationId:'request_undo_123'}),101);assert(!undone.row.done);assert.equal(undone.row.completedAt,0);
  const removed=mutateTodoRowsV179(p,save({op:'delete',source:'memos',id:'site-note',expected:JSON.stringify(p.memos[0])}),100);assert.equal(removed.rows.length,0);assert.equal(p.checklists.length,4);
  assert.throws(()=>mutateTodoRowsV179(p,save({op:'toggle',source:'memos',id:'site-note',expected:JSON.stringify(p.memos[0]),done:true})),{code:'todo/invalid-action'});
});
test('full-row comparison catches legacy edits that did not update revision',()=>{
  const p=sample(),expected=JSON.stringify(p.checklists[0]);p.checklists[0].text='Changed in quick note';assert.throws(()=>mutateTodoRowsV179(p,save({id:'old',expected})),{code:'todo/conflict'});
});
test('sequential create, edit, legacy normalization, complete and undo are not false conflicts',()=>{
  const p=sample(),created=mutateTodoRowsV179(p,save({text:'v179 저장 확인'}),100);p.checklists=created.rows;
  const edited=mutateTodoRowsV179(p,save({text:'v179 수정 확인',expected:JSON.stringify(created.row),mutationId:'change_edit_179'}),101);p.checklists=edited.rows;
  // A site notebook normalization, followed by Firestore's reordered object keys.
  p.checklists=p.checklists.map(row=>row.id==='new'?Object.fromEntries(Object.entries({...row,time:'',category:''}).reverse()):row);
  const checked=mutateTodoRowsV179(p,save({op:'toggle',expected:JSON.stringify(edited.row),done:true,mutationId:'change_check_179'}),102);assert(checked.row.done);assert.equal(checked.row.text,'v179 수정 확인');assert.equal(checked.row.time,'');assert.equal(checked.row.category,'');
  p.checklists=checked.rows;const undone=mutateTodoRowsV179(p,save({op:'toggle',expected:JSON.stringify(Object.fromEntries(Object.entries(checked.row).reverse())),done:false,mutationId:'change_uncheck_179'}),103);assert(!undone.row.done);
  const expected=JSON.stringify(undone.row);p.checklists=undone.rows;p.checklists.find(row=>row.id==='new').category='important';assert.throws(()=>mutateTodoRowsV179(p,save({op:'toggle',expected,done:true,mutationId:'change_conflict_179'})),{code:'todo/conflict'});
});
test('ambiguous retry is idempotent and cannot reuse a key for another edit',()=>{
  const input=save(),r=mutateTodoRowsV179(sample(),input,100),payload={...sample(),checklists:r.rows};
  const retry=mutateTodoRowsV179(payload,input,200);assert(retry.replayed);assert(!retry.changed);assert.equal(retry.row.updatedAt,100);assert.equal(retry.rows.filter(row=>row.id==='new').length,1);
  assert.throws(()=>mutateTodoRowsV179(payload,{...input,text:'Different'}),{code:'todo/replay-mismatch'});
});
test('invalid dates, unsafe fields and missing/oversized content never replace stored data',()=>{
  const p=sample(),before=clone(p);for(const date of ['2026-02-30','2026-9-2','not-date'])assert.throws(()=>todoDateV179(date),{code:'todo/invalid-date'});
  for(const bad of [{source:'consultingClients'},{source:'__proto__'},{text:''},{text:'x'.repeat(181)},{notes:'x'.repeat(2001)},{date:'2026-02-30'},{expected:'{}'}])assert.throws(()=>mutateTodoRowsV179(p,save(bad)));
  assert.deepEqual(p,before);const memo=mutateTodoRowsV179(p,save({source:'memos',kind:'memo',text:'m'.repeat(1200)}));assert.equal(memo.row.kind,'memo');assert.equal(memo.row.date,'');
});

const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8');
const block=source.slice(source.indexOf('// BEGIN TODO NOTE TRANSACTION V179'),source.indexOf('// END TODO NOTE TRANSACTION V179'));
function fixture(payload=sample()){
  let data={payload:encodeStoredPayload(clone(payload)),unrelated:'preserve'},commits=0,reads=0;
  const writes=[],auth={currentUser:{uid:'a'}},state={user:{uid:'a'}};
  const h={beforeRead:null,afterCommit:null};
  class FieldPath{constructor(...parts){this.parts=parts;}}
  const context={mutateTodoRowsV179,todoFailureV179,decodeArchive,encodeArchive,encodeStoredPayload,Date,JSON,auth,state,db:{},FieldPath,serverTimestamp:()=>42,storageStampV168:()=>({storageVersion:168}),doc:(_, ...parts)=>parts.join('/'),runTransaction:async(_,callback)=>{
    const pending=[];const result=await callback({get:async path=>{reads++;assert.equal(path,'users/a/private/main');await h.beforeRead?.();return {exists:()=>!!data,data:()=>clone(data)};},update:(path,...args)=>{const next=clone(data);for(let i=0;i<args.length;i+=2){const parts=args[i].parts;let obj=next;for(const part of parts.slice(0,-1))obj=obj[part]??=( {} );obj[parts.at(-1)]=clone(args[i+1]);}pending.push(next);writes.push(args.filter((_,i)=>i%2===0).map(x=>x.parts.join('.')));},set:(path,next)=>pending.push(next)});if(pending.length){data=pending.at(-1);commits++;}await h.afterCommit?.();return result;
  }};
  vm.createContext(context);vm.runInContext(block,context);
  return Object.assign(h,{auth,state,mutate:input=>context.mutateChecklistV179(input),payload:()=>decodeArchive(data.payload),writes,stats:()=>({commits,reads}),switchOwner(){auth.currentUser={uid:'b'};state.user={uid:'b'};}});
}
test('real Firebase adapter patches only payload.checklists and storage metadata',async()=>{
  const p=sample(),h=fixture(p),r=await h.mutate({...save(),uid:'a'});assert(r.changed);assert.equal(h.stats().commits,1);assert.deepEqual(h.payload().memos,p.memos);assert.deepEqual(h.payload().personalItems,p.personalItems);assert.deepEqual(h.payload().consultingClients,p.consultingClients);assert.equal(h.payload().checklists.length,5);
  assert.deepEqual(h.writes[0],['payload.checklists','updatedAt','storageVersion','formatWrittenAt']);
});
test('Firebase adapter never reads another owner or returns a payload after account switch',async()=>{
  const h=fixture();await assert.rejects(h.mutate({...save(),uid:'b'}),{code:'todo/owner-changed'});assert.equal(h.stats().reads,0);
  const during=fixture();during.beforeRead=()=>during.switchOwner();await assert.rejects(during.mutate({...save(),uid:'a'}),{code:'todo/owner-changed'});assert.equal(during.stats().commits,0);
  const after=fixture();after.afterCommit=()=>after.switchOwner();await assert.rejects(after.mutate({...save(),uid:'a'}),{code:'todo/owner-changed'});assert.equal(after.stats().commits,1);
});
test('UI uses scoped existing data, error-preserving forms, no auto input focus, and no full-document writer',()=>{
  const ui=fs.readFileSync(new URL('../android-src/assets/app-todo-v179.js',import.meta.url),'utf8');
  assert.match(ui,/api\(\)\.mutateChecklistV179/);assert.match(ui,/mutationId=retryMutationId/);assert.match(ui,/preserveLocal\(\)/);assert.match(ui,/owner!==actor\|\|uid\(\)!==actor/);assert.match(ui,/data-todo-inline-v179/);assert.match(ui,/data-todo-check-v179/);
  assert.doesNotMatch(ui,/await savePrivate|await api\(\)\.writePrivateData|autofocus/);assert.match(ui,/\$\('\[data-todo-close-v179\]',sheet\)\?\.focus\(\{preventScroll:true\}\)/);
  const css=fs.readFileSync(new URL('../android-src/assets/app-todo-v179.css',import.meta.url),'utf8');assert.match(css,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);assert.match(css,/grid-auto-rows:32px/);assert.match(css,/max-height:96px;overflow-y:auto/);assert.match(css,/overscroll-behavior:contain/);
  assert.match(ui,/data=fields\(payload\);loaded=true;error='';preserveLocal\(\)/);
});

test('unrelated full private save preserves remote additions, edits and deletions in both note collections',()=>{
  const base=sample(),server=clone(base);server.checklists[0].done=true;server.checklists.splice(1,1);server.checklists.push({id:'remote',text:'휴대폰에서 추가',done:false});server.memos.push({id:'remote-note',text:'다른 기기 메모'});
  assert.deepEqual(mergePrivateNotesV179(server,{...base,personalItems:[{id:'new-photo'}]},base),{checklists:server.checklists,memos:server.memos});
  assert.deepEqual(mergePrivateNotesV179(server,{},base),{checklists:server.checklists,memos:server.memos});
  assert.deepEqual(mergePrivateNotesV179(server,{checklists:[],memos:[]},{}),{checklists:server.checklists,memos:server.memos});
});
test('legacy quick note creates, checks, edits and intentionally deletes without losing remote notes',()=>{
  const base=sample(),server=clone(base),local=clone(base);server.checklists[0].notes='서버 상세 메모';server.checklists.push({id:'remote',text:'다른 기기'});local.checklists[0].done=true;local.checklists=local.checklists.filter(row=>row.id!=='due');local.checklists.push({id:'local',text:'퀵노트 추가',done:false});local.memos[0].text='메모장 수정';
  const merged=mergePrivateNotesV179(server,local,base);assert(merged.checklists.find(row=>row.id==='old').done);assert.equal(merged.checklists.find(row=>row.id==='old').notes,'서버 상세 메모');assert(!merged.checklists.some(row=>row.id==='due'));assert(merged.checklists.some(row=>row.id==='remote'));assert(merged.checklists.some(row=>row.id==='local'));assert.equal(merged.memos[0].text,'메모장 수정');
  assert.equal(mergePrivateNotesV179(base,{checklists:[],memos:[]},base).checklists.length,0);
});
test('same-field edit conflict, deleting a changed note and restoring a remotely removed note fail without mutation',()=>{
  const base=sample(),server=clone(base),local=clone(base);server.checklists[0].text='다른 기기 수정';local.checklists[0].text='현재 기기 수정';const original=clone(server);
  assert.throws(()=>mergePrivateNotesV179(server,local,base),{code:'todo/conflict'});assert.deepEqual(server,original);
  local.checklists=[];assert.throws(()=>mergePrivateNotesV179(server,local,base),{code:'todo/conflict'});
  const deleted=clone(base);deleted.checklists.shift();const editing=clone(base);editing.checklists[0].done=true;assert.throws(()=>mergePrivateNotesV179(deleted,editing,base),{code:'todo/conflict'});
});
test('generic save captures its baseline at call time and reconciles notes into the legacy caller snapshot',async()=>{
  const base=sample(),payload=clone(base);let stored=clone(base),baselineReceived;
  const sync=createConsultSync({currentUid:()=> 'a',readCurrent:async()=>clone(stored),commitRecord:()=>{throw Error('No Consult changes expected');},writeRemaining:async(uid,incoming,baseline)=>{baselineReceived=clone(baseline);stored={...incoming,...mergePrivateNotesV179(stored,incoming,baseline)};return clone(stored);}});
  sync.remember('a',base);stored.checklists.push({id:'remote',text:'새 기록'});payload.personalItems.push({id:'photo'});const pending=sync.write(payload);
  sync.remember('a',stored);await pending;assert.deepEqual(baselineReceived,base);assert(payload.checklists.some(row=>row.id==='remote'));assert.equal(stored.personalItems.at(-1).id,'photo');
  const before=clone(stored);stored.checklists[0].done=true;sync.rememberFields('a',{checklists:stored.checklists});payload.checklists=clone(stored.checklists);payload.memos=clone(stored.memos);payload.personalItems.push({id:'second-photo'});await sync.write(payload);assert(stored.checklists[0].done);assert.equal(stored.checklists.length,before.checklists.length);
});
test('real full private Firebase transaction writes merged notes, not incoming stale arrays',async()=>{
  assert.match(source,/writeRemaining:async\(uid,incoming,noteBaseline\)/);assert.match(source,/Object\.assign\(next,mergePrivateNotesV179\(current,incoming,noteBaseline\)\)/);assert.match(source,/Object\.entries\(next\)/);assert.match(source,/consultSyncV167\.rememberFields\(uid,\{\[result\.source\]:result\.rows\}\)/);
  const adapter=source.match(/writeRemaining:(async\(uid,incoming,noteBaseline\)=>\{[\s\S]*?\n  \})\n\}\);/)[1],base=sample(),server=clone(base),incoming=clone(base);
  server.checklists[0].done=true;server.checklists.push({id:'from-widget',text:'위젯 신규'});server.memos[0].text='서버 최신 메모';incoming.personalItems.push({id:'photo-upload'});
  let stored={payload:encodeStoredPayload(server)},writes=0;const deletion=Symbol('delete'),auth={currentUser:{uid:'a'}};
  class FieldPath{constructor(...parts){this.parts=parts;}}
  const context={auth,JSON,Object,CONSULT_KEYS:['consultingClients','consultingTasks','consultingSessions','consultingFiles'],mergePrivateNotesV179,decodeArchive,encodeArchive,encodeStoredPayload,FieldPath,db:{},doc:(_, ...parts)=>parts.join('/'),serverTimestamp:()=>1,deleteField:()=>deletion,storageStampV168:()=>({storageVersion:168}),runTransaction:async(_,callback)=>{let pending;const result=await callback({get:async path=>{assert.equal(path,'users/a/private/main');return {exists:()=>true,data:()=>clone(stored)};},update:(path,...fields)=>{pending=clone(stored);for(let i=0;i<fields.length;i+=2){const parts=fields[i].parts;let target=pending;for(const part of parts.slice(0,-1))target=target[part]??={};if(fields[i+1]===deletion)delete target[parts.at(-1)];else target[parts.at(-1)]=fields[i+1];}},set:(path,value)=>{pending=value;}});if(pending){stored=pending;writes++;}return result;}};
  vm.createContext(context);vm.runInContext('write='+adapter,context);const result=await context.write('a',incoming,base),saved=decodeArchive(stored.payload);
  assert.equal(writes,1);assert.deepEqual(saved.checklists,server.checklists);assert.deepEqual(saved.memos,server.memos);assert.deepEqual(saved.personalItems,incoming.personalItems);assert.deepEqual(saved.consultingClients,server.consultingClients);assert.deepEqual(result.checklists,server.checklists);
  const conflict=clone(base);conflict.checklists[0].text='현재 수정';saved.checklists[0].text='서버 충돌';stored={payload:encodeStoredPayload(saved)};await assert.rejects(context.write('a',conflict,base),{code:'todo/conflict'});assert.equal(writes,1);assert.equal(decodeArchive(stored.payload).checklists[0].text,'서버 충돌');
});
test('app quick note shows both existing sources and deletes only the selected source',async()=>{
  const source=fs.readFileSync(new URL('../android-src/assets/experience-v142.js',import.meta.url),'utf8'),block=source.slice(source.indexOf('  function getChecklist('),source.indexOf('  function openNotepad('));
  const P={checklists:[{id:'same-id',text:'일정 없는 할 일',done:false},{id:'widget-memo',text:'위젯 메모',kind:'memo'}],memos:[{id:'same-id',text:'관리페이지 메모'}]},list={innerHTML:''},handlers={};let overlay=null,saves=0;
  const form={addEventListener:(type,handler)=>handlers['form:'+type]=handler};
  const context={P,JSON,Array,String,Number,Date,safe:String,savePrivate:async()=>{saves++;},localStorage:{getItem:()=>null,setItem(){}},console,$:selector=>selector==='#quickMemoModalV142'?overlay:selector==='[data-note-list-v142]'?list:selector==='[data-note-form-v142]'?form:null,document:{createElement:()=>({classList:{remove(){}},addEventListener:(type,handler)=>handlers[type]=handler}),body:{append:node=>overlay=node}}};
  vm.createContext(context);vm.runInContext(block,context);context.renderNotepad();assert.match(list.innerHTML,/관리페이지 메모/);assert.match(list.innerHTML,/위젯 메모/);assert.match(list.innerHTML,/data-note-source-v179="memos"/);assert(!list.innerHTML.includes('data-note-check-v142="widget-memo"'));
  const button={dataset:{noteDeleteV142:'same-id',noteSourceV179:'memos'}};await handlers.click({target:{closest:selector=>selector==='[data-note-delete-v142]'?button:null}});assert.equal(P.memos.length,0);assert.equal(P.checklists.length,2);assert.equal(saves,1);
  button.dataset.noteSourceV179='checklists';await handlers.click({target:{closest:selector=>selector==='[data-note-delete-v142]'?button:null}});assert.equal(P.checklists.length,1);assert.equal(P.checklists[0].id,'widget-memo');assert.equal(saves,2);
});
test('site quick note shows memos without completion controls and source-aware deletion preserves a same-ID todo',async()=>{
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),start=html.indexOf('  function renderQuickTodo()'),end=html.indexOf('  // Firebase Google login',start),block=html.slice(start,end),owner='qa@example.invalid',data={checklists:[{id:'same-id',text:'투두',done:false}],memos:[{id:'same-id',text:'관리 메모'}]},handlers={},list={innerHTML:'',addEventListener:(type,handler)=>handlers['list:'+type]=handler};let saves=0;
  const context={currentUserEmail:owner,currentUser:{uid:'qa'},currentUserName:'QA',privateData:{[owner]:data},privateRefs:{[owner]:{fileId:'private'}},today:new Date(2026,8,19),iso:()=> '2026-09-19',escapeHtml:String,savePrivateData:async()=>{saves++;},renderPrivate(){},toast(){},$:selector=>selector==='#quickTodoList'?list:{addEventListener:(type,handler)=>handlers[selector+':'+type]=handler},googleErrorMessage:error=>{throw error;}};
  vm.createContext(context);vm.runInContext(block,context);context.renderQuickTodo();assert.match(list.innerHTML,/관리 메모/);assert.match(list.innerHTML,/data-quick-note-source="memos"/);assert.equal((list.innerHTML.match(/data-quick-todo-check=/g)||[]).length,1);
  const button={dataset:{quickTodoDelete:'same-id',quickNoteSource:'memos'}};await handlers['list:click']({target:{closest:()=>button}});assert.equal(data.memos.length,0);assert.equal(data.checklists.length,1);assert.equal(saves,1);
  button.dataset.quickNoteSource='checklists';await handlers['list:click']({target:{closest:()=>button}});assert.equal(data.checklists.length,0);assert.equal(saves,2);
});
test('late generic save response cannot replace a newer focused TODO result',async()=>{
  const source=fs.readFileSync(new URL('../android-src/assets/app-todo-v179.js',import.meta.url),'utf8'),start=source.indexOf('    const write=current.writePrivateData;'),end=source.indexOf('\n    if(uid()',start),block=source.slice(start,end);
  let resolve;const original=()=>new Promise(done=>resolve=done),fresh={checklists:[{id:'new',text:'newer',done:true}],memos:[]},context={current:{writePrivateData:original},uid:()=> 'a',owner:'a',ownerEpoch:1,writeVersion:0,loadRun:0,data:clone(fresh),fields:clone,render(){},Promise,Array};vm.createContext(context);vm.runInContext(block,context);
  const pending=context.current.writePrivateData({checklists:[],memos:[]});context.writeVersion++;context.data=clone(fresh);resolve({checklists:[],memos:[]});await pending;assert.deepEqual(context.data,fresh);
  assert.match(source,/\+\+writeVersion;data\[result.source\]=copy\(result.rows\)/);
});
