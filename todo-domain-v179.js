/* The notebook, widgets and TODO page share private/main; no second task store. */
export const TODO_FIELDS_V179 = Object.freeze(['checklists', 'memos']);
export function todoFailureV179(code, message) { return Object.assign(new Error(message), {code:'todo/'+code}); }
const noteCanonicalV179=value=>JSON.stringify(value&&typeof value==='object'?Array.isArray(value)?value.map(item=>JSON.parse(noteCanonicalV179(item))):Object.fromEntries(Object.keys(value).sort().map(key=>[key,JSON.parse(noteCanonicalV179(value[key]))])):value);
const noteEqualV179=(left,right)=>left===undefined||right===undefined?left===right:noteCanonicalV179(left)===noteCanonicalV179(right);
function comparableTodoV179(row){
  if(row===null)return null;
  const value={...row};
  // The site's legacy notebook normalizer adds these empty optional defaults.
  // That is not a content edit; preserve them from the latest row when writing.
  for(const key of ['time','category'])if(value[key]==='')delete value[key];
  return value;
}
// Legacy notebooks still submit a whole private snapshot. Apply only their real
// row/field edits to the transaction's current arrays; an unrelated save is not
// permission to restore deleted rows or erase another device's new notes.
export function mergePrivateNotesV179(current={},incoming={},baseline={}) {
  const merged={};
  for(const source of TODO_FIELDS_V179){
    if(!Object.hasOwn(incoming,source)){if(Object.hasOwn(current,source))merged[source]=current[source];continue;}
    const before=Array.isArray(baseline[source])?baseline[source]:[],wanted=incoming[source],latest=current[source]??[];
    if(!Array.isArray(wanted)||!Array.isArray(latest))throw todoFailureV179('invalid-data','기존 메모 형식을 확인해주세요. 원본은 보존했습니다.');
    if(noteEqualV179(before,wanted)){if(Object.hasOwn(current,source))merged[source]=latest;else if(wanted.length===0)merged[source]=[];continue;}
    const rowsToMap=rows=>{const map=new Map();for(const row of rows){const id=String(row?.id||'');if(!id||map.has(id))throw todoFailureV179('invalid-data','메모의 식별자를 확인해주세요. 원본은 보존했습니다.');map.set(id,row);}return map;};
    const oldRows=rowsToMap(before),localRows=rowsToMap(wanted),serverRows=rowsToMap(latest),result=new Map(serverRows);
    const conflict=()=>{throw todoFailureV179('conflict','다른 곳에서 변경된 메모가 있습니다. 원본은 보존했습니다. 새로고침한 뒤 다시 수정해주세요.');};
    for(const [id,old] of oldRows){
      if(localRows.has(id))continue;
      const remote=serverRows.get(id);if(remote&&!noteEqualV179(old,remote))conflict();result.delete(id);
    }
    for(const [id,local] of localRows){
      const old=oldRows.get(id),remote=serverRows.get(id);
      if(old&&noteEqualV179(old,local))continue;
      if(!old){if(remote&&!noteEqualV179(remote,local))conflict();if(!remote)result.set(id,local);continue;}
      if(!remote)conflict();
      const next={...remote};
      for(const key of new Set([...Object.keys(old),...Object.keys(local)])){
        if(noteEqualV179(old[key],local[key]))continue;
        if(!noteEqualV179(remote[key],old[key])&&!noteEqualV179(remote[key],local[key]))conflict();
        if(Object.hasOwn(local,key))next[key]=local[key];else delete next[key];
      }
      result.set(id,next);
    }
    merged[source]=[...result.values()];
  }
  return merged;
}
export const todoTextV179 = row => String(row?.text || row?.title || row?.name || '');
export const todoKindV179 = (row, source = 'checklists') => source === 'memos' || row?.kind === 'memo' || row?.type === 'memo' ? 'memo' : 'todo';
export function todoDateV179(value) {
  const text = String(value || '');
  if (!text) return '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw todoFailureV179('invalid-date','마감일을 확인해주세요.');
  const date = new Date(text+'T12:00:00Z');
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0,10) !== text) throw todoFailureV179('invalid-date','마감일을 확인해주세요.');
  return text;
}
export function todoRowsV179(payload = {}) {
  return TODO_FIELDS_V179.flatMap(source => (Array.isArray(payload[source]) ? payload[source] : []).filter(row => row && row.id && !row.demo && row.category !== 'emotion').map(row => ({...row,source,key:source+':'+row.id,kind:todoKindV179(row,source),text:todoTextV179(row),date:String(row.date || row.dueAt || '').slice(0,10),done:!!row.done})));
}
export function sortTodosV179(rows) {
  return rows.slice().sort((a,b) => Number(a.done)-Number(b.done) || (a.done ? Number(b.completedAt||b.updatedAt||0)-Number(a.completedAt||a.updatedAt||0) : (a.date||'9999').localeCompare(b.date||'9999') || Number(b.important||b.priority==='높음')-Number(a.important||a.priority==='높음')) || Number(b.updatedAt||b.createdAt||0)-Number(a.updatedAt||a.createdAt||0) || String(a.id).localeCompare(String(b.id)));
}
export function filterTodosV179(payload, {kind='todo',filter='open',query='',today=''} = {}) {
  const search=String(query).trim().toLocaleLowerCase('ko-KR');
  return sortTodosV179(todoRowsV179(payload).filter(row => {
    if(row.kind!==kind||search&&![row.text,row.notes,row.note,row.date].join(' ').toLocaleLowerCase('ko-KR').includes(search))return false;
    if(kind==='memo'||filter==='all')return true;
    if(filter==='done')return row.done;
    return !row.done&&(filter!=='overdue'||!!row.date&&row.date<today)&&(filter!=='today'||row.date===today);
  }));
}
export function mutateTodoRowsV179(payload, input, now = Date.now()) {
  if (!payload || typeof payload!=='object' || Array.isArray(payload)) throw todoFailureV179('invalid-data','기존 메모 형식을 확인해주세요.');
  const source=String(input.source||'checklists'), op=String(input.op||''),id=String(input.id||''),mutationId=String(input.mutationId||'');
  if (!TODO_FIELDS_V179.includes(source) || !['save','toggle','delete'].includes(op) || !id || id.length>180 || !/^[a-zA-Z0-9_-]{8,100}$/.test(mutationId)) throw todoFailureV179('invalid-action','저장할 항목을 다시 확인해주세요.');
  if (payload[source]!=null&&!Array.isArray(payload[source])) throw todoFailureV179('invalid-data','기존 메모 형식을 확인해주세요.');
  const rows=(payload[source]||[]).slice(), index=rows.findIndex(row=>row&&String(row.id)===id), before=index<0?null:rows[index];
  const fingerprint=JSON.stringify([source,op,id,input.kind||'',input.text||'',input.notes||'',input.date||'',!!input.important,input.done??null]);
  if (before?.lastTodoMutationV179===mutationId) {
    if(before.lastTodoFingerprintV179!==fingerprint)throw todoFailureV179('replay-mismatch','같은 요청으로 다른 내용을 저장할 수 없습니다. 다시 시도해주세요.');
    return {source,rows,row:before,changed:false,replayed:true};
  }
  if (op==='delete'&&!before) return {source,rows,row:null,changed:false,replayed:true};
  // Compare every substantive field (legacy quick notes have no revision), but
  // not object insertion order: Firestore and normalization may reorder keys.
  let expected;try{expected=JSON.parse(input.expected);}catch{throw todoFailureV179('invalid-action','수정할 항목을 다시 불러와주세요.');}
  if (!noteEqualV179(comparableTodoV179(expected),comparableTodoV179(before))) throw todoFailureV179('conflict','다른 곳에서 변경된 항목입니다. 새로고침한 뒤 다시 수정해주세요.');
  if (op!=='save'&&!before) throw todoFailureV179('not-found','항목이 삭제되었습니다.');
  if (op==='delete') { rows.splice(index,1); return {source,rows,row:null,changed:true}; }
  const stamp=Math.max(Number(now)||Date.now(),Number(before?.updatedAt||before?.createdAt||0)+1);
  let row;
  if (op==='toggle') {
    if (todoKindV179(before,source)!=='todo'||typeof input.done!=='boolean') throw todoFailureV179('invalid-action','완료할 할 일을 확인해주세요.');
    row={...before,done:input.done,completedAt:input.done?stamp:0};
  } else {
    const kind=todoKindV179(before||{kind:input.kind},source), text=String(input.text||'').trim(), notes=String(input.notes||'').trim();
    if (!text || text.length>(kind==='memo'?1200:180) || notes.length>2000) throw todoFailureV179('invalid-text',kind==='memo'?'메모는 1,200자, 설명은 2,000자 이내로 입력해주세요.':'할 일은 180자, 설명은 2,000자 이내로 입력해주세요.');
    const date=kind==='todo'?todoDateV179(input.date):'';
    row={...before,id,text,notes,date,kind,done:before?.done||false,important:kind==='todo'&&!!input.important,priority:input.important?'높음':'보통',createdAt:before?.createdAt||stamp};
    // dueAt is the old widget alias. Explicitly clearing a deadline must clear it too.
    if (before&&Object.hasOwn(before,'dueAt')) row.dueAt=date;
    if (before&&Object.hasOwn(before,'note')) row.note=notes;
  }
  row={...row,updatedAt:stamp,lastTodoMutationV179:mutationId,lastTodoFingerprintV179:fingerprint};
  if(index<0)rows.push(row);else rows[index]=row;
  return {source,rows,row,changed:true};
}
