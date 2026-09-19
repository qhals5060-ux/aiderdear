import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {mutateTodoRowsV179,todoSubtasksV186,todoFailureV179,mergePrivateNotesV179} from '../todo-domain-v179.js';
import {decodeArchive,encodeArchive,encodeStoredPayload} from '../archive-codec-v168.js';

const input=(overrides={})=>({source:'checklists',op:'save',id:'task-186',mutationId:'request_186_create',expected:'null',kind:'todo',text:'준비하기',notes:'',date:'2026-10-01',important:false,subtasks:[{id:'sub-one',text:'자료 확인',done:false},{id:'sub-two',text:'제출',done:false}],...overrides});
const next=(row,overrides={})=>input({expected:JSON.stringify(row),mutationId:'request_186_edit',...overrides});

test('subtasks create, edit, complete, delete and preserve fields through parent toggle',()=>{
  const memo={id:'memo',text:'기존 메모'},payload={checklists:[],memos:[memo]},created=mutateTodoRowsV179(payload,input(),100);
  assert.equal(payload.checklists.length,0);assert.deepEqual(created.row.subtasks,input().subtasks);
  const first={...created.row,subtasks:created.row.subtasks.map(row=>({...row,legacyData:'preserved'}))};
  const edited=mutateTodoRowsV179({checklists:[first],memos:[memo]},next(first,{subtasks:[{id:'sub-one',text:'자료 최종 확인',done:true}]}),101);
  assert.deepEqual(edited.row.subtasks,[{id:'sub-one',text:'자료 최종 확인',done:true,legacyData:'preserved'}]);
  const toggled=mutateTodoRowsV179({checklists:edited.rows},next(edited.row,{op:'toggle',done:true,mutationId:'request_186_toggle'}),102);
  assert.deepEqual(toggled.row.subtasks,edited.row.subtasks);assert.equal(toggled.row.done,true);
  const cleared=mutateTodoRowsV179({checklists:edited.rows},next(edited.row,{subtasks:[],mutationId:'request_186_clear'}),103);assert.deepEqual(cleared.row.subtasks,[]);
  const oldEditor=next(edited.row,{mutationId:'request_186_legacy'});delete oldEditor.subtasks;
  assert.deepEqual(mutateTodoRowsV179({checklists:edited.rows},oldEditor,104).row.subtasks,edited.row.subtasks);
  assert.deepEqual(payload.memos,[memo]);
});

test('subtask replay and concurrent subtask edits cannot overwrite one another',()=>{
  const action=input(),created=mutateTodoRowsV179({},action,100),payload={checklists:created.rows};
  assert.equal(mutateTodoRowsV179(payload,action,101).changed,false);
  assert.throws(()=>mutateTodoRowsV179(payload,{...action,subtasks:[{...action.subtasks[0],done:true}]}),{code:'todo/replay-mismatch'});
  const remote={...created.row,subtasks:[{...created.row.subtasks[0],done:true}]};
  assert.throws(()=>mutateTodoRowsV179({checklists:[remote]},next(created.row)),{code:'todo/conflict'});
  const merged=mergePrivateNotesV179({checklists:[remote]},{checklists:created.rows,personalItems:[{id:'unrelated'}]},{checklists:created.rows});
  assert.deepEqual(merged.checklists[0].subtasks,remote.subtasks);
});

test('subtasks reject invalid/duplicate content without mutating data and fit adapter limit',()=>{
  for(const value of [null,{},[{id:'a',text:'',done:false}],[{id:'a',text:'x',done:'yes'}],[{id:'a',text:'x',done:false},{id:'a',text:'y',done:false}],Array.from({length:21},(_,i)=>({id:'s'+i,text:'x',done:false})),[{id:'a',text:'x'.repeat(181),done:false}]])assert.throws(()=>todoSubtasksV186(value),{code:'todo/invalid-subtasks'});
  const full=mutateTodoRowsV179({},input({text:'x'.repeat(180),notes:'n'.repeat(2000),subtasks:Array.from({length:20},(_,i)=>({id:'subtask-'+String(i).padStart(36,'0'),text:'가'.repeat(180),done:false}))}),100).row;
  assert(JSON.stringify(full).length<20000,'editable row stays within existing Firebase expected-row limit');
});

test('real Firebase adapter encodes nested subtasks and preserves unrelated private fields',async()=>{
  const source=fs.readFileSync(new URL('../firebase-app.js',import.meta.url),'utf8'),block=source.slice(source.indexOf('// BEGIN TODO NOTE TRANSACTION V179'),source.indexOf('// END TODO NOTE TRANSACTION V179'));
  const original={checklists:[{id:'other',text:'다른 할 일'}],memos:[{id:'memo',text:'보존할 메모'}],routines:[{id:'routine'}]};
  let stored={payload:encodeStoredPayload(original)};const writes=[];
  class FieldPath{constructor(...parts){this.parts=parts;}}
  const context={mutateTodoRowsV179,todoFailureV179,decodeArchive,encodeArchive,encodeStoredPayload,Date,JSON,auth:{currentUser:{uid:'owner'}},state:{user:{uid:'owner'}},db:{},FieldPath,serverTimestamp:()=>42,storageStampV168:()=>({storageVersion:168}),doc:(_, ...parts)=>parts.join('/'),runTransaction:async(_,callback)=>callback({get:async path=>{assert.equal(path,'users/owner/private/main');return {exists:()=>true,data:()=>structuredClone(stored)};},update:(path,...args)=>{for(let i=0;i<args.length;i+=2){const parts=args[i].parts;writes.push(parts.join('.'));let target=stored;for(const part of parts.slice(0,-1))target=target[part]??={};target[parts.at(-1)]=structuredClone(args[i+1]);}},set:()=>{throw Error('Existing private document should be patched');}})};
  vm.createContext(context);vm.runInContext(block,context);
  await context.mutateChecklistV179({...input(),uid:'owner'});
  const decoded=decodeArchive(stored.payload);assert.deepEqual(decoded.checklists.at(-1).subtasks,input().subtasks);assert.deepEqual(decoded.checklists[0],original.checklists[0]);assert.deepEqual(decoded.memos,original.memos);assert.deepEqual(decoded.routines,original.routines);
  assert.deepEqual(writes,['payload.checklists','updatedAt','storageVersion','formatWrittenAt']);
  assert.equal(fs.readFileSync(new URL('../android-src/assets/todo-domain-v179.js',import.meta.url),'utf8'),fs.readFileSync(new URL('../todo-domain-v179.js',import.meta.url),'utf8'));
});

test('actual legacy site normalizer and quick-note handlers preserve remotely edited subtasks',async()=>{
  const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8'),start=html.indexOf('  function renderQuickTodo()'),block=html.slice(start,html.indexOf('  // Firebase Google login',start));
  const checklistNormalizer=html.split('\n').find(line=>line.includes('d.checklists=Array.isArray(d.checklists)?d.checklists.filter(Boolean).map'));
  assert(checklistNormalizer,'existing site normalizer is available');
  const owner='qa@example.invalid',original={checklists:[{id:'task',text:'기존 투두',done:false,date:'',priority:'보통',time:'',category:'',subtasks:[{id:'sub-one',text:'앱에서 추가한 하위 할 일',done:false}]}],memos:[{id:'memo',text:'기존 메모'}]};
  const data=structuredClone(original),server=structuredClone(original);server.checklists[0].subtasks[0].done=true;server.checklists[0].subtasks.push({id:'sub-two',text:'다른 기기에서 추가',done:false});
  const handlers={},list={innerHTML:'',addEventListener:(type,handler)=>handlers['list:'+type]=handler};let stored=server,saves=0,baseline=structuredClone(original);
  const context={d:data,currentUserEmail:owner,currentUser:{uid:'qa'},currentUserName:'QA',privateData:{[owner]:data},privateRefs:{[owner]:{fileId:'private'}},today:new Date(2026,8,20),iso:()=> '2026-09-20',escapeHtml:String,savePrivateData:async()=>{stored={...stored,...mergePrivateNotesV179(stored,data,baseline)};Object.assign(data,structuredClone(stored));baseline=structuredClone(stored);saves++;},renderPrivate(){},toast(){},$:selector=>selector==='#quickTodoList'?list:{addEventListener:(type,handler)=>handlers[selector+':'+type]=handler},googleErrorMessage:error=>{throw error;}};
  vm.createContext(context);vm.runInContext(checklistNormalizer,context);assert.deepEqual(JSON.parse(JSON.stringify(data.checklists[0].subtasks)),original.checklists[0].subtasks);
  vm.runInContext(block,context);
  await handlers['list:change']({target:{dataset:{quickTodoDue:'task'},value:'2026-12-20'}});
  assert.equal(stored.checklists[0].date,'2026-12-20');assert.deepEqual(stored.checklists[0].subtasks,server.checklists[0].subtasks);
  await handlers['list:change']({target:{dataset:{quickTodoCheck:'task'},checked:true}});
  assert.equal(stored.checklists[0].done,true);assert.deepEqual(stored.checklists[0].subtasks,server.checklists[0].subtasks);assert.deepEqual(stored.memos,original.memos);assert.equal(saves,2);
});
