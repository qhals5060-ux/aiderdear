/* Native private actions are claimed on-device and use the existing receipt transaction. */
const text=value=>String(value??'').trim();
const failure=code=>Object.assign(new Error(code),{code});
const kinds=new Set(['CalendarMonth','CalendarCombined','CalendarSplit','CalendarFortnight','RoutineAll']);
const day=value=>{const d=new Date(value+'T12:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(d.getTime())&&d.toISOString().slice(0,10)===value;};
const today=now=>{const d=new Date(now);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
export function privateCommandV196(input,user,now=Date.now()) {
  if(!user?.uid||input?.uid!==user.uid)throw failure('widget/owner-changed');
  const op=text(input.op),id=text(input.id),key=text(input.key),date=text(input.date),adding=['add-todo','add-memo'].includes(op);
  if(input.schema!==196||input.state!=='claimed'||!kinds.has(input.kind)||!['routine','todo','add-todo','add-memo'].includes(op)||!id||id.length>180||!key||new TextEncoder().encode(key).length>600)throw failure('widget/invalid-action');
  if(!adding&&(input.expectedUpdatedAt==null||!Number.isFinite(Number(input.expectedUpdatedAt))||Number(input.expectedUpdatedAt)<0))throw failure('widget/stale-action');
  if(op==='routine'&&(!day(date)||date>today(now)||!['','MINI','MORE','MAX','SKIP'].includes(String(input.value??''))))throw failure('widget/invalid-action');
  if(op==='todo'&&![true,false,'true','false'].includes(input.value))throw failure('widget/invalid-action');
  if(adding&&(typeof input.value!=='string'||!input.value.trim()||input.value.trim().length>180||op==='add-todo'&&date&&!day(date)))throw failure('widget/invalid-action');
  // Do not manufacture a new key, date, value or expected revision after claim.
  return JSON.parse(JSON.stringify(input));
}
export function privateReceiptV196(command,result) {
  const field=command.op==='routine'?'routines':'checklists',payload=result?.payload;
  if(!payload||typeof payload!=='object'||Array.isArray(payload)||typeof result.applied!=='boolean'||typeof result.replayed!=='boolean'||result.applied&&result.replayed||payload[field]!=null&&!Array.isArray(payload[field]))throw failure('widget/invalid-result');
  const row=(payload[field]||[]).find(r=>String(r?.id)===command.id),revision=Number(row?.updatedAt||row?.createdAt||0);
  // A receipt proves the action committed even if another device subsequently
  // deleted its row. Retire that optimistic overlay; never recreate or rebase it.
  if((!row&&!(result.replayed===true&&result.applied===false))||!Number.isFinite(revision)||revision<0)throw failure('widget/invalid-result');
  return {uid:command.uid,key:command.key,id:command.id,op:command.op,revision,rebase:result.replayed===false&&result.applied===true};
}
const terminal=code=>/^widget\/(stale-action|invalid-action|not-found|replay-mismatch|invalid-data|goal-linked)$/.test(code);
const clone=value=>value===undefined?undefined:JSON.parse(JSON.stringify(value));
const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const plain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const own=(value,key)=>Object.prototype.hasOwnProperty.call(value||{},key);
function mergeFields(base,input,latest){
  if(equal(base,input))return clone(latest);
  if(plain(base)&&plain(input)&&plain(latest)){
    const result=clone(latest);
    for(const key of new Set([...Object.keys(base),...Object.keys(input)])){
      if(!own(input,key)){delete result[key];continue;}
      const value=mergeFields(base[key],input[key],latest[key]);
      if(value===undefined)delete result[key];else result[key]=value;
    }
    return result;
  }
  return clone(input);
}
// Only the three collections written by native actions need a three-way merge.
// Unchanged fields use the transaction result; explicit app edits win.
export function mergePrivateWriteV196(base,input,latest,now=Date.now()){
  if(!plain(base)||!plain(input)||!plain(latest))throw failure('widget/private-merge-conflict');
  const result={...clone(latest),...clone(input)};
  for(const field of ['routines','checklists','memos']){
    if(!own(input,field))continue;
    const lists=[base[field]||[],input[field],latest[field]||[]];
    if(lists.some(rows=>!Array.isArray(rows)))throw failure('widget/private-merge-conflict');
    const maps=lists.map(rows=>{const map=new Map();for(const row of rows){if(!plain(row)||!row.id||map.has(String(row.id)))throw failure('widget/private-merge-conflict');map.set(String(row.id),row);}return map;});
    const [beforeMap,inputMap,currentMap]=maps,rows=[];
    for(const id of new Set([...currentMap.keys(),...inputMap.keys(),...beforeMap.keys()])){
      const before=beforeMap.get(id),submitted=inputMap.get(id),current=currentMap.get(id);
      if(equal(before,submitted)){if(current)rows.push(clone(current));continue;}
      if(!submitted)continue; // An explicit app deletion remains a deletion.
      if(!before){if(current&&!equal(current,submitted))throw failure('widget/private-merge-conflict');rows.push(clone(submitted));continue;}
      if(!current)throw failure('widget/private-merge-conflict'); // Do not resurrect a deleted row.
      const row=mergeFields(before,submitted,current);
      if(field==='routines'&&['doneDates','dailyLevels'].some(key=>own(before,key)||own(submitted,key)||own(current,key))){
        const dates=new Set(current.doneDates||[]),oldDates=new Set(before.doneDates||[]),newDates=new Set(submitted.doneDates||[]),levels=row.dailyLevels||{};
        for(const date of oldDates)if(!newDates.has(date)){dates.delete(date);if(equal(before.dailyLevels?.[date],submitted.dailyLevels?.[date]))delete levels[date];}
        for(const date of newDates)if(!oldDates.has(date))dates.add(date);
        for(const date of new Set([...Object.keys(before.dailyLevels||{}),...Object.keys(submitted.dailyLevels||{})])){
          if(equal(before.dailyLevels?.[date],submitted.dailyLevels?.[date]))continue;
          if(['MINI','MORE','MAX'].includes(String(submitted.dailyLevels?.[date]||'').toUpperCase()))dates.add(date);else dates.delete(date);
        }
        row.doneDates=[...dates];row.dailyLevels=levels;
      }
      const withoutRevision=value=>{const copy=clone(value);delete copy.updatedAt;return copy;};
      if(equal(withoutRevision(row),withoutRevision(current))){rows.push(clone(current));continue;}
      row.updatedAt=Math.max(Number(now)||0,(Number(current.updatedAt||current.createdAt)||0)+1,Number(submitted.updatedAt)||0);
      rows.push(row);
    }
    result[field]=rows;
  }
  return result;
}
export function createPrivateGateV196({getUser,getEpoch,getPrivate,now=Date.now}){
  let tail=Promise.resolve(),active=null,uncertain=null,retry=null,retained=null,scope='',version=0;
  const waiting=[];
  const identity=()=>String(getUser()?.uid||'')+'|'+getEpoch();
  function observe(){const value=identity();if(value!==scope){scope=value;active=null;uncertain=null;retry=null;retained=null;waiting.length=0;version++;}if(retained&&getPrivate()!==retained.localRef)retained=null;return value;}
  function retain(frame){
    if(!frame.latest||frame.actor!==observe()||getPrivate()!==frame.localRef)return;
    const base=clone(frame.base),local=frame.localRef;
    // A row accepted by the UI is the new comparison point. Rows still holding
    // an unsaved edit retain their original baseline across later widget taps.
    for(const field of ['routines','checklists','memos']){
      const current=new Map((local[field]||[]).map(row=>[String(row.id),row]));
      const latest=new Map((frame.latest[field]||[]).map(row=>[String(row.id),row]));
      const before=new Map((base[field]||[]).map(row=>[String(row.id),row]));
      for(const id of new Set([...before.keys(),...current.keys(),...latest.keys()]))if(equal(current.get(id),latest.get(id))){if(current.has(id))before.set(id,clone(current.get(id)));else before.delete(id);}
      if(own(base,field)||own(local,field)||own(frame.latest,field))base[field]=[...before.values()];
    }
    retained={...frame,base};
  }
  function serial(work){const actor=observe();const task=tail.catch(()=>{}).then(()=>{if(!getUser()?.uid||observe()!==actor)throw failure('widget/owner-changed');return work(actor);});tail=task.catch(()=>{});return task;}
  const gate={
    version:()=>{observe();return version;},
    localBefore(command){const frame=active,field=command.op==='routine'?'routines':'checklists';return frame?JSON.stringify((frame.base[field]||[]).find(row=>String(row.id)===command.id)||null):undefined;},
    widget(work){
      const actor=observe(),localRef=getPrivate(),base=retained?.base||localRef,frame={actor,localRef,base:clone(base),latest:null,started:false,key:'',safeFailure:false};waiting.push(frame);
      return serial(async()=>{
      waiting.splice(waiting.indexOf(frame),1);
      if(!plain(base))throw failure('widget/not-ready');active=frame;
      try{return await work();}catch(error){
        frame.safeFailure=terminal(String(error?.code));
        if(frame.safeFailure&&uncertain?.key===frame.key){uncertain.safeFailure=true;uncertain=null;}
        if(frame.safeFailure&&retry?.key===frame.key)retry.safeFailure=true;
        if(frame.started&&!frame.latest&&!frame.safeFailure)uncertain=frame;
        throw error;
      }
      finally{if(active===frame){retain(frame);active=null;}}
    });},
    started(command){if(active){active.started=true;active.key=command.key;if(uncertain?.key===command.key&&uncertain.actor===active.actor)active.base=clone(uncertain.base);}},
    committed(payload){if(active&&active.actor===observe()&&plain(payload)){active.latest=clone(payload);if(uncertain?.key===active.key){uncertain.latest=clone(payload);uncertain=null;}if(retry)retry.latest=clone(payload);}},
    write(submitted,operation){
      const actor=observe(),input=clone(submitted),baseline=getPrivate(),frame=active||waiting[0]||uncertain||retry||retained;
      return serial(async()=>{
        try{
          if(observe()!==actor)throw failure('widget/owner-changed');
          if(!plain(baseline)||!plain(input))throw failure('widget/not-ready');
          let value=input;
          if(frame?.started){
            if(frame.latest)value=mergePrivateWriteV196(frame.base,input,frame.latest,typeof now==='function'?now():now);
            else if(!frame.safeFailure)throw failure('widget/private-unconfirmed');
          }
          version++; // Even a lost response may have committed remotely.
          const result=await operation(value,frame?.started&&frame.latest?{uid:getUser().uid,baseline:clone(frame.latest)}:null);
          if(observe()!==actor)throw failure('widget/owner-changed');
          if(frame?.latest&&plain(result))frame.latest=clone(result);if(retry===frame)retry=null;retained=null;return result;
        }catch(error){if(observe()===actor&&frame)retry=frame;throw error;}
      });
    }
  };
  return gate;
}
export function createPrivateQueueV196({getUser,getEpoch,pending,save,publish,ack,fail,localBefore=()=>undefined,online=()=>true,now=Date.now,report=()=>{},lease=work=>work(),getWriteVersion=()=>0,onConfirmed=()=>{}}) {
  let running=null,requested=false,blockedOwner='',blockedEpoch=-1,blockedUntil=0;
  // If publication/ack fails after a response, reuse it in this page lifetime.
  // A reload retries the frozen key through the server's existing receipt.
  const confirmed=new Map(),originals=new Map();
  async function execute(){
    const user=getUser(),epoch=getEpoch();if(!user?.uid||!online())return;
    if(blockedOwner!==user.uid||blockedEpoch!==epoch){blockedOwner=user.uid;blockedEpoch=epoch;blockedUntil=0;confirmed.clear();originals.clear();}
    if(now()<blockedUntil)return;
    const current=()=>getUser()?.uid===user.uid&&getEpoch()===epoch;
    for(let count=0;count<100&&current();count++){
      let command;
      try{
        const more=await lease(async()=>{
        if(!current())return false;
        const list=JSON.parse(pending(user.uid)||'[]');if(!Array.isArray(list)||list.length!==1)return false;
        command=list[0];command=privateCommandV196(command,user,now());
        const cacheKey=user.uid+'|'+command.key;
        let success=confirmed.get(cacheKey);
        if(success&&success.version!==getWriteVersion()){confirmed.delete(cacheKey);success=null;}
        if(!success){if(!originals.has(cacheKey))originals.set(cacheKey,localBefore(command));const result=await save(command);if(!current())return false;success={result,before:originals.get(cacheKey),receipt:privateReceiptV196(command,result),version:getWriteVersion()};confirmed.set(cacheKey,success);}
        if(!current())return false;
        onConfirmed(command,success.result);
        if(!await publish(command,success.result,success.before,success.receipt)||!current())return false;
        if(!ack(user.uid,command.key,JSON.stringify({revision:success.receipt.revision,rebase:success.receipt.rebase}))||!current())return false;
        confirmed.delete(cacheKey);originals.delete(cacheKey);return true;
        });
        if(!more)return;
      }catch(error){
        if(!current())return;
        const code=String(error?.code||'unavailable');report(code,command);
        if(command&&terminal(code)&&fail(user.uid,command.key,code)){confirmed.delete(user.uid+'|'+command.key);originals.delete(user.uid+'|'+command.key);continue;}
        if(code==='widget/not-ready')return;
        blockedUntil=now()+(/quota|resource-exhausted/.test(code)?1800000:15000);return;
      }
    }
  }
  const worker={flush(){if(running){requested=true;return running;}running=execute().finally(()=>{running=null;if(requested){requested=false;void worker.flush();}});return running;}};
  return worker;
}
if(typeof window!=='undefined') {
  const native=window.AiderLogNative;
  if(['privatePendingV196','privateAckV196','privateFailV196'].every(name=>typeof native?.[name]==='function')){
    let api=null,gate=null,epoch=0,uid='',timer=0;
    const getUser=()=>window.AiderDearFirebase?.getState?.()?.user;
    const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>queue.flush(),250);};
    const ownedPrivate=()=>typeof P!=='undefined'&&window.AiderAppDataScopeV179?.ownsPrivate(P)?P:null;
    const queue=createPrivateQueueV196({getUser,getEpoch:()=>epoch,online:()=>navigator.onLine!==false,
      lease:work=>gate?gate.widget(work):Promise.resolve(),getWriteVersion:()=>gate?.version()||0,
      onConfirmed:(command,result)=>{gate?.started(command);gate?.committed(result.payload);},
      pending:owner=>native.privatePendingV196(owner),ack:(owner,key,receipt)=>native.privateAckV196(owner,key,receipt),fail:(owner,key,code)=>native.privateFailV196(owner,key,code),
      localBefore(command){if(!ownedPrivate())return undefined;return gate?.localBefore(command);},
      save:command=>{const method=window.AiderDearFirebase?.applyWidgetActionV165;if(typeof method!=='function')throw failure('widget/not-ready');gate?.started(command);return method(command);},
      publish:(...args)=>window.AiderWidgetSyncV164?.publishPrivateResultV196?.(...args)||false,
      report:code=>console.warn('[widget-private] Local action retained:',code)
    });
    function bind(){
      const next=window.AiderDearFirebase;if(!next?.subscribe||next===api)return;api=next;epoch++;
      const ownerGate=createPrivateGateV196({getUser,getEpoch:()=>epoch,getPrivate:ownedPrivate});gate=ownerGate;
      const write=next.writePrivateData;
      if(typeof write==='function')next.writePrivateData=function(value,...args){return ownerGate.write(value,(merged,proof)=>{
        // The existing note serializer performs its own field conflict checks.
        // Its baseline must be the same verified snapshot we just merged against.
        if(proof)next.acceptPrivateSnapshot?.({uid:proof.uid,payload:proof.baseline});
        return write.call(next,merged,...args);
      }).finally(schedule);};
      next.subscribe(state=>{if(api!==next)return;const owner=state?.user?.uid||'';if(owner!==uid){uid=owner;epoch++;}schedule();});
    }
    for(const event of ['aiderdear-firebase-ready','aiderlog-native-resume','online','pageshow','aiderdear-firebase-private-data'])window.addEventListener(event,()=>{bind();schedule();});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){bind();schedule();}});
    window.AiderWidgetPrivateV196=Object.freeze({flush:()=>{bind();return queue.flush();}});bind();
  }
}
