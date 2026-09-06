// Shared by web and Android. Only the server may mutate Consult records.
export const CONSULT_KEYS = ['consultingClients','consultingTasks','consultingSessions','consultingFiles'];
const clone = value => JSON.parse(JSON.stringify(value));
const canonical = value => JSON.stringify(sort(value));
function sort(value) {
  if (Array.isArray(value)) return value.map(sort);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(key=>[key,sort(value[key])]));
  return value;
}
function comparable(row) {
  const value={...row};
  for(const key of ['revision','schemaVersion','updatedAt','updatedBy','createdBy'])delete value[key];
  return canonical(value);
}
export function createConsultSync({currentUid,readCurrent,commitRecord,writeRemaining}) {
  const baselines=new Map(), tails=new Map(), pending=new Map();
  function assert(uid) { if(!uid || currentUid()!==uid)throw Error('계정이 변경되었습니다. 다시 로그인해주세요.'); }
  function remember(uid,payload) { assert(uid);baselines.set(uid,clone(payload||{}));return payload; }
  function write(payload) {
    const uid=currentUid(), snapshot=clone(payload||{});assert(uid);
    const run=async()=>{
      assert(uid);
      let current=await readCurrent(uid)||{};assert(uid);
      const base=baselines.get(uid)||current;
      for(const key of CONSULT_KEYS){
        const incoming=Array.isArray(snapshot[key])?snapshot[key]:[], currentRows=()=>Array.isArray(current[key])?current[key]:[];
        const ids=new Set();
        for(const row of incoming){
          if(!row?.id || ids.has(String(row.id)))throw Error('컨설트 기록 ID를 확인해주세요. 원본은 변경되지 않았습니다.');
          ids.add(String(row.id));
          const old=(base[key]||[]).find(r=>String(r.id)===String(row.id)), latest=currentRows().find(r=>String(r.id)===String(row.id));
          if(latest && comparable(latest)===comparable(row))continue;
          // An unrelated page can hold an older snapshot. It is not an edit.
          if(old && comparable(old)===comparable(row))continue;
          const expected=old||row;
          const input={collection:key,id:String(row.id),expectedRevision:Number(expected.revision||0),expectedUpdatedAt:Number(expected.updatedAt||expected.createdAt||0),row};
          const fingerprint=uid+canonical(input);
          if(!pending.has(fingerprint))pending.set(fingerprint,globalThis.crypto?.randomUUID?.()||`sync-${Date.now()}-${Math.random().toString(36).slice(2)}`);
          const result=await commitRecord(uid,{...input,requestId:pending.get(fingerprint)});assert(uid);
          pending.delete(fingerprint);current=result.payload;
          // A successfully saved row remains the baseline if a later row fails.
          const nextBase=clone(baselines.get(uid)||base);
          nextBase[key]=[...(nextBase[key]||[]).filter(r=>String(r.id)!==String(row.id)),clone(currentRows().find(r=>String(r.id)===String(row.id)))];
          baselines.set(uid,nextBase);
        }
        // Full-document saves are not permission to delete server-held records.
        if((base[key]||[]).some(row=>!ids.has(String(row.id))))throw Error('컨설트 기록 삭제는 지원하지 않습니다. 원본을 보존했습니다. 컨설트 화면에서 상태를 변경해주세요.');
      }
      // The transaction re-reads Consult fields, so a simultaneous edit survives.
      const finalPayload=await writeRemaining(uid,snapshot);assert(uid);
      remember(uid,finalPayload);
      for(const key of CONSULT_KEYS){
        if(canonical(payload[key]||[])===canonical(snapshot[key]||[]))payload[key]=clone(finalPayload[key]||[]);
      }
      return finalPayload;
    };
    const task=(tails.get(uid)||Promise.resolve()).catch(()=>{}).then(run);
    tails.set(uid,task);task.finally(()=>{if(tails.get(uid)===task)tails.delete(uid);}).catch(()=>{});
    return task;
  }
  return {remember,write,clear(){baselines.clear();pending.clear();}};
}
