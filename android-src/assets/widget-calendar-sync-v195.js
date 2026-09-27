/* Native quick-add stores locally; the existing authenticated app syncs on resume. */
const text = value => String(value ?? '').trim();
const fail = code => { throw Object.assign(new Error(code), {code}); };
const validDay = value => {const day=new Date(value+'T12:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '2000-01-01' && value <= '2199-12-31' && Number.isFinite(day.getTime()) && day.toISOString().slice(0,10)===value;};

export function calendarDraftV195(input, user) {
  if (!user?.uid || input?.uid !== user.uid) fail('widget-calendar/owner-changed');
  const id = text(input.id), title = text(input.title), date = text(input.date), endDate = text(input.endDate || date), time = text(input.time);
  if (input.schema !== 195 || input.op !== 'add-schedule' || !/^widget-calendar-[a-zA-Z0-9-]{16,80}$/.test(id) || !title || title.length > 180 || !validDay(date) || endDate !== date || typeof input.allDay !== 'boolean' || (!input.allDay && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time))) fail('widget-calendar/invalid-draft');
  const stamp = Number(input.createdAt);
  if (!Number.isSafeInteger(stamp) || stamp < 946684800000 || stamp > Date.now() + 86400000) fail('widget-calendar/invalid-draft');
  return {id, title, date, endDate, time:input.allDay ? '' : time, endTime:input.allDay ? '' : time, allDay:input.allDay, category:'personal', color:'#D86D99', note:'', owner:'mine', shareWithCouple:false, pairKey:'', authorUid:user.uid, authorEmail:text(user.email).toLowerCase(), createdAt:stamp, updatedAt:stamp, widgetCreatedV195:true};
}

export function appendCalendarDraftV195(previous, row) {
  if (!Array.isArray(previous)) fail('widget-calendar/invalid-store');
  const existing = previous.find(item => item?.id === row.id);
  // A confirmed draft may have been edited elsewhere before an acknowledgement.
  // Keep that newer content instead of replaying the original quick-add values.
  if (existing) {
    if (!existing.widgetCreatedV195 || existing.authorUid !== row.authorUid) fail('widget-calendar/id-conflict');
    return {rows:previous, changed:false};
  }
  return {rows:[...previous, row], changed:true};
}

export function createCalendarQueueV195({getUser, getEpoch, pending, save, confirm, ack, online=()=>true, now=Date.now, report=()=>{}}) {
  let running=null, requested=false, blockedUntil=0, blockedOwner='';
  const committed=new Set();
  async function execute() {
    const user=getUser(), epoch=getEpoch();
    if (!user?.uid || !online()) return;
    if (blockedOwner!==user.uid) { blockedOwner=user.uid; blockedUntil=0; }
    if (now()<blockedUntil) return;
    const current=()=>getUser()?.uid===user.uid && getEpoch()===epoch;
    let drafts;
    try { drafts=JSON.parse(pending(user.uid)||'[]'); } catch { return; }
    if (!Array.isArray(drafts)) return;
    for (const input of drafts.slice(0,100)) {
      if (!current()) return;
      try {
        const row=calendarDraftV195(input,user), key=user.uid+'|'+row.id;
        if (!committed.has(key)) { await save(row,current); if (!current()) return; committed.add(key); }
        // The ordinary schedule listener must have delivered this ID before we
        // clear its native overlay. A slow/offline listener never loses a draft.
        if (current() && await confirm(user.uid,row.id) && current() && ack(user.uid,row.id)) committed.delete(key);
      } catch (error) {
        if (!current()) return;
        const code=String(error?.code||'unavailable');
        report(code);
        if (/invalid-draft|id-conflict/.test(code)) continue;
        blockedUntil=now()+(/resource-exhausted|quota/.test(code)?1800000:15000);
        break;
      }
    }
  }
  const worker={flush() { if (running) {requested=true;return running;} running=execute().finally(()=>{running=null;if(requested){requested=false;worker.flush();}}); return running; }};
  return worker;
}

if (typeof window!=='undefined') {
  const native=window.AiderLogNative;
  if (typeof native?.calendarPendingV195==='function' && typeof native?.calendarAckV195==='function') {
    let bound=null, epoch=0, uid='', sdkFlight=null, timer=0;
    const getUser=()=>window.AiderDearFirebase?.getState?.()?.user;
    const schedule=()=>{ clearTimeout(timer); timer=setTimeout(()=>queue.flush(),350); };
    const sdk=()=>sdkFlight||(sdkFlight=Promise.all([
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'),
      import('./archive-codec-v168.js')
    ]).catch(error=>{sdkFlight=null;throw error;}));
    const queue=createCalendarQueueV195({
      getUser, getEpoch:()=>epoch, online:()=>navigator.onLine!==false,
      pending:owner=>native.calendarPendingV195(owner), ack:(owner,id)=>native.calendarAckV195(owner,id),
      async save(row,current) {
        const [auth,firestore,codec]=await sdk();
        const assertOwner=()=>{if(!current()||auth.getAuth().currentUser?.uid!==row.authorUid)fail('widget-calendar/owner-changed');};
        assertOwner();
        const db=firestore.getFirestore(), ref=firestore.doc(db,'users',row.authorUid,'schedule','main');
        await firestore.runTransaction(db,async transaction=>{
          assertOwner();const snapshot=await transaction.get(ref);assertOwner();
          const previous=snapshot.exists()?codec.decodeArchive(snapshot.data()?.payload):[];
          const result=appendCalendarDraftV195(previous,row);
          if(result.changed)transaction.set(ref,{payload:codec.encodeStoredPayload(result.rows),storageVersion:168,formatWrittenAt:firestore.serverTimestamp(),updatedAt:firestore.serverTimestamp(),updatedBy:row.authorUid},{merge:true});
        });
        assertOwner();
      },
      confirm(owner,id) {
        const snapshot=window.AiderWidgetSyncV164?.snapshot?.();
        if(snapshot?.uid!==owner||!snapshot.scheduleItems?.some(row=>row.id===id&&row.widgetCreatedV195===true&&row.authorUid===owner))return false;
        native.syncWidgets(JSON.stringify(snapshot));return true;
      },
      report:code=>console.warn('[widget-calendar] Local draft retained:',code)
    });
    function bind() {
      const api=window.AiderDearFirebase;
      if(!api?.subscribe||bound===api)return;bound=api;
      api.subscribe(state=>{const next=state?.user?.uid||'';if(next!==uid){uid=next;epoch++;}schedule();});
    }
    for(const name of ['aiderdear-firebase-ready','aiderlog-native-resume','online','pageshow','aiderlog:verified-schedule-data-v191'])window.addEventListener(name,()=>{bind();schedule();});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){bind();schedule();}});
    window.AiderWidgetCalendarV195=Object.freeze({flush:()=>queue.flush()});
    bind();
  }
}
