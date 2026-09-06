// Pure validation shared by the API and isolated tests. Never trust browser roles.
export const OWNER_EMAILS = new Set(['qhals5060@gmail.com', 'aidway55@gmail.com']);
export const COLLECTIONS = ['projects', 'tasks', 'employees', 'expenses', 'purchases', 'resources', 'submissions', 'reviews', 'legacyRecords'];
export const TASK_STATES = ['assigned', 'active', 'submitted', 'complete', 'blocked', 'revision', 'hold', 'cancelled'];
export const RECORD_FIELDS = ['kind','title','performedAt','taskId','projectId','purpose','hypothesis','procedure','deviations','observations','result','interpretation','issues','nextAction','decisionRequest','experimentCode','protocolId','protocolVersion','batch','sampleIds','materials','rawData','qc','mediaIds'];
export const TASK_PUBLIC = ['id','title','projectId','assigneeUid','startDate','dueDate','priority','purpose','deliverableType','checklist','resourceIds','predecessorIds','status','blockedReason','result','submissionIds','nextAction','revision','updatedAt'];
export function fail(status, message) { throw Object.assign(new Error(message), {status}); }
export function id(value) { const v = String(value || ''); if (!/^[\w-]{1,128}$/.test(v)) fail(400, 'ID가 올바르지 않습니다.'); return v; }
export function text(value, max = 10000) { if (typeof value !== 'string' || value.length > max) fail(400, `문자열은 ${max}자 이내여야 합니다.`); return value.trim(); }
export function pick(row, keys) { return Object.fromEntries(keys.filter(k => row[k] !== undefined).map(k => [k, structuredClone(row[k])])); }
export function jsonSafe(value) { const s = JSON.stringify(value); if (!s || Buffer.byteLength(s) > 600000) fail(413, '기록을 나누어 저장해주세요.'); const v=JSON.parse(s); if (!v || typeof v !== 'object' || Array.isArray(v)) fail(400,'기록 형식을 확인해주세요.'); return v; }
export function record(input, {draft = false} = {}) {
  const v=pick(jsonSafe(input), [...RECORD_FIELDS, ...(draft?['personalMemo','copiedFrom']:[])]);
  if (!['work','experiment'].includes(v.kind)) fail(400,'기록 유형을 선택해주세요.');
  v.title=text(v.title || '',180); if (!draft && !v.title) fail(400,'제목을 입력해주세요.');
  for (const k of RECORD_FIELDS.filter(k=>!['kind','qc','mediaIds'].includes(k))) if (v[k] != null) v[k]=text(v[k],k==='title'?180:20000);
  if (draft && v.personalMemo != null) v.personalMemo=text(v.personalMemo,20000);
  v.mediaIds=Array.isArray(v.mediaIds)?[...new Set(v.mediaIds.map(id))]:[];
  if(v.mediaIds.length>20) fail(400,'첨부는 20개까지 등록할 수 있습니다.');
  v.qc=(Array.isArray(v.qc)?v.qc:[]).map(q=>pick(jsonSafe(q),['item','sample','value','unit','criterion','judgment','evidence']));
  if(v.qc.length>200) fail(400,'QC 항목을 나누어 저장해주세요.');
  for(const q of v.qc) { for(const key of Object.keys(q))q[key]=text(String(q[key]),2000); if(!q.criterion)q.judgment='미판정'; }
  if(!draft && !(v.result||v.observations))fail(400,'결과 또는 관찰 내용을 입력해주세요.');
  return v;
}
export function revision(previous, expected) { if(Number(expected)!==Number(previous?.revision||0))fail(409,'다른 기기에서 변경되었습니다. 최신 기록을 다시 확인해주세요.'); }
export function entity(kind, input) {
  const fields={
    projects:['title','code','type','goal','startDate','dueDate','institution','contact','status','stage','budget','currency','noticeUrl','verifiedAt','requirements','milestones','notes'],
    tasks:['title','projectId','assigneeUid','startDate','dueDate','priority','purpose','deliverableType','checklist','resourceIds','predecessorIds','status','blockedReason','result','nextAction','expenseId','sourceSubmissionId'],
    employees:['name','email','roleLabel'],
    expenses:['title','vendor','projectId','category','amount','paidAmount','refundAmount','currency','date','dueDate','paymentStatus','evidenceType','evidenceStatus','mediaIds','notes','status'],
    purchases:['title','quantity','specification','vendor','quoteAmount','currency','status','dueDate','inspection','expenseId','projectId','mediaIds'],
    resources:['title','category','documentId','version','date','projectId','taskIds','allowedUids','mediaIds','notes']
  }[kind];
  if(!fields)fail(400,'변경할 수 없는 자료입니다.');
  const v=pick(jsonSafe(input),fields); const label=kind==='employees'?'name':'title';v[label]=text(v[label]||'',180);if(!v[label])fail(400,'이름을 입력해주세요.');
  for(const k of ['budget','amount','paidAmount','refundAmount','quantity','quoteAmount']) if(v[k]!=null&&(!Number.isFinite(Number(v[k]))||Number(v[k])<0))fail(400,'금액·수량을 확인해주세요.');
  if(kind==='tasks'&&!TASK_STATES.includes(v.status))fail(400,'업무 상태를 확인해주세요.');
  if(kind==='employees'){v.email=text(v.email||'',200).toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))fail(400,'직원 이메일을 확인해주세요.');}
  if(kind==='resources'){v.version=Number(v.version)||1;if(v.version<1||!Number.isInteger(v.version))fail(400,'문서 버전을 확인해주세요.');}
  for(const k of ['checklist','milestones','requirements','mediaIds','resourceIds','predecessorIds','taskIds','allowedUids'])if(v[k]!=null&&(!Array.isArray(v[k])||v[k].length>200))fail(400,'목록 형식을 확인해주세요.');
  return v;
}
export function budget(project, expenses) {
  const rows=expenses.filter(e=>e.projectId===project.id&&e.status!=='cancelled'&&(!project.currency||e.currency===project.currency));
  let paid=0,committed=0,planned=0;for(const e of rows){const net=Math.max(0,Number(e.paidAmount||0)-Number(e.refundAmount||0));paid+=net;if(e.paymentStatus==='planned')planned+=Number(e.amount||0);else committed+=Math.max(0,Number(e.amount||0)-Number(e.paidAmount||0));}
  return {budget:Number(project.budget||0),paid,committed,planned,afterPaid:Number(project.budget||0)-paid,afterCommitted:Number(project.budget||0)-paid-committed};
}
