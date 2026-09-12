// Private, owner-only calendar values. These never enter app/main or pair data.
export const PRIVATE_CALENDAR_VERSION = 175;
export const INTIMACY_EMAILS = Object.freeze(['qhals5060@gmail.com', 'aidway55@gmail.com']);
export const PRIVATE_CALENDAR_NOTICE = '예상일은 입력한 주기와 최근 실제 시작일로 계산한 참고값입니다. 실제 생리일과 다를 수 있으며 배란일·피임 안전일을 판단하는 데 사용할 수 없습니다.';
const DAY = 86400000;
export function privateCalendarFailure(message, code = 'invalid-argument') {
  const error = new Error(message); error.code = code; throw error;
}
export function privateCalendarError(error) {
  if (String(error?.code || '').split('/').at(-1) !== 'resource-exhausted') return error;
  const result = new Error('저장소 사용량 또는 요청 한도에 도달했습니다. 기존 기록과 입력은 유지됩니다. 자동 재시도를 잠시 멈추고 나중에 다시 시도해주세요.');
  result.name = 'AiderQuotaError'; result.code = 'resource-exhausted'; result.retryAfterMs = 300000; return result;
}
export function privateCalendarId(value) {
  if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(value)) privateCalendarFailure('기록 식별자를 확인해주세요.');
  return value;
}
export function privateCalendarDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) privateCalendarFailure('날짜를 확인해주세요.');
  const time = Date.parse(value + 'T00:00:00Z');
  if (!Number.isFinite(time) || new Date(time).toISOString().slice(0, 10) !== value || value < '1900-01-01' || value > '2200-12-31') privateCalendarFailure('존재하는 날짜를 입력해주세요.');
  return value;
}
export function privateCalendarOffset(value, amount) {
  return new Date(Date.parse(privateCalendarDate(value) + 'T00:00:00Z') + amount * DAY).toISOString().slice(0, 10);
}
const days = (start, end) => Math.round((Date.parse(end + 'T00:00:00Z') - Date.parse(start + 'T00:00:00Z')) / DAY);
const plain = value => value && typeof value === 'object' && !Array.isArray(value);
function boundedInteger(value, min, max, label) {
  if (!Number.isSafeInteger(value) || value < min || value > max) privateCalendarFailure(`${label} 값을 확인해주세요.`);
  return value;
}
function knownKeys(value, keys) {
  if (!plain(value) || Object.keys(value).some(key => !keys.includes(key))) privateCalendarFailure('지원하지 않는 기록 항목이 포함되어 있습니다.');
}
export function canUsePrivateIntimacy(user) {
  // Exact verified addresses, not profile labels or pair membership.
  return Boolean(user?.uid && user.emailVerified === true && INTIMACY_EMAILS.includes(user.email));
}
export function normalizePrivateCalendarSettings(value = null) {
  if (value == null) return {menstrualEnabled:false, cycleLength:28, periodLength:5, revision:0};
  if (!plain(value) || typeof value.menstrualEnabled !== 'boolean') privateCalendarFailure('개인 캘린더 설정을 읽을 수 없습니다. 원본은 유지됩니다.');
  return {menstrualEnabled:value.menstrualEnabled, cycleLength:boundedInteger(value.cycleLength, 15, 90, '주기'), periodLength:boundedInteger(value.periodLength, 1, 30, '기간'), revision:boundedInteger(value.revision ?? 0, 0, 1000000000, '기록 버전')};
}
export function privateCalendarSettingsInput(value) {
  knownKeys(value, ['menstrualEnabled', 'cycleLength', 'periodLength']);
  return normalizePrivateCalendarSettings({...value, revision:0});
}
export function normalizePrivateCalendarEntry(kind, value, stored = false) {
  const common = ['id', 'note'];
  const dateKeys = kind === 'period' ? ['startDate', 'endDate'] : kind === 'intimacy' ? ['date'] : [];
  if (!dateKeys.length) privateCalendarFailure('지원하지 않는 개인 기록입니다.');
  if (!stored) knownKeys(value, [...common, ...dateKeys]);
  if (!plain(value)) privateCalendarFailure('개인 기록을 읽을 수 없습니다.');
  const row = {id:privateCalendarId(value.id)};
  if (kind === 'period') {
    row.startDate = privateCalendarDate(value.startDate); row.endDate = privateCalendarDate(value.endDate);
    if (row.endDate < row.startDate || days(row.startDate, row.endDate) > 59) privateCalendarFailure('실제 시작일과 종료일을 확인해주세요. 한 기록은 최대 60일까지 입력할 수 있습니다.');
  } else row.date = privateCalendarDate(value.date);
  if (value.note != null && typeof value.note !== 'string') privateCalendarFailure('메모 내용을 확인해주세요.');
  row.note = String(value.note || '').trim();
  if (row.note.length > 500) privateCalendarFailure('메모는 500자 이내로 입력해주세요.');
  if (stored) row.revision = boundedInteger(value.revision, 1, 1000000000, '기록 버전');
  return row;
}
export function privateCalendarRange(value) {
  knownKeys(value, ['from', 'to']);
  const from = privateCalendarDate(value.from), to = privateCalendarDate(value.to);
  if (to < from || days(from, to) > 365) privateCalendarFailure('개인 캘린더는 한 번에 최대 366일을 조회할 수 있습니다.');
  return {from, to, historyFrom: from < '1900-06-30' ? '1900-01-01' : privateCalendarOffset(from, -180)};
}
export function privateCalendarRevision(value) { return boundedInteger(value, 0, 1000000000, '기록 버전'); }
export function privateCalendarMutation(input, stored = null) {
  knownKeys(input, ['type', 'item', 'id', 'expectedRevision']);
  const type = input.type, expected = privateCalendarRevision(input.expectedRevision);
  if (!['settings', 'period-save', 'period-delete', 'intimacy-save', 'intimacy-delete'].includes(type)) privateCalendarFailure('지원하지 않는 개인 캘린더 작업입니다.');
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const conflict = () => privateCalendarFailure('다른 화면에서 기록이 변경되었습니다. 최신 기록을 다시 불러온 뒤 저장해주세요.', 'conflict');
  if (type === 'settings') {
    if (input.id != null) privateCalendarFailure('설정에는 기록 식별자를 입력할 수 없습니다.');
    const previous = normalizePrivateCalendarSettings(stored), next = privateCalendarSettingsInput(input.item);
    const unchanged = same({...previous, revision:0}, next);
    if (previous.revision !== expected && !(unchanged && previous.revision === expected + 1)) conflict();
    return {changed: !unchanged, settings: {...next, revision: previous.revision + (unchanged ? 0 : 1)}};
  }
  const kind = type.startsWith('period-') ? 'period' : 'intimacy';
  const deleting = type.endsWith('-delete');
  const id = privateCalendarId(deleting ? input.id : input.item?.id);
  if (deleting && input.item != null || !deleting && input.id != null && input.id !== id) privateCalendarFailure('기록 식별자를 확인해주세요.');
  if (stored && stored.id !== id) privateCalendarFailure('저장된 기록의 식별자가 일치하지 않습니다.');
  const revision = stored ? boundedInteger(stored.revision, 1, 1000000000, '기록 버전') : 0;
  if (deleting) {
    if (!stored) { if (expected !== 0) conflict(); return {changed:false, deleted:true, id, revision:0}; }
    if (stored.deleted === true) { if (expected !== revision - 1 && expected !== revision) conflict(); return {changed:false, deleted:true, id, revision}; }
    if (revision !== expected) conflict();
    normalizePrivateCalendarEntry(kind, stored, true);
    return {changed:true, deleted:true, id, revision:revision + 1};
  }
  const next = normalizePrivateCalendarEntry(kind, input.item);
  if (stored?.deleted === true) privateCalendarFailure('삭제된 기록은 다시 저장할 수 없습니다. 새 기록으로 추가해주세요.', 'conflict');
  const previous = stored ? normalizePrivateCalendarEntry(kind, stored, true) : null;
  const unchanged = previous && same({...previous, revision:undefined}, next);
  if (revision !== expected && !(unchanged && revision === expected + 1)) conflict();
  return {changed:!unchanged, item:{...next, revision:revision + (unchanged ? 0 : 1)}};
}
export function privateCalendarMarkers(data, from, to) {
  privateCalendarRange({from, to});
  const settings = normalizePrivateCalendarSettings(data?.settings), marks = new Map();
  const add = (date, kind) => { if (date >= from && date <= to) marks.set(`${date}:${kind}`, {date, kind}); };
  if (settings.menstrualEnabled) {
    const periods = (data?.periods || []).map(row => normalizePrivateCalendarEntry('period', row, true));
    for (const row of periods) for (let date = row.startDate; date <= row.endDate; date = privateCalendarOffset(date, 1)) add(date, 'period');
    // Only the next cycle after the latest actual start. Never roll a stale
    // estimate forward month after month or imply an ovulation/safe-day window.
    const latest = periods.filter(row => row.startDate <= to).sort((a, b) => b.startDate.localeCompare(a.startDate))[0];
    if (latest && !data?.hasMore?.periods) {
      const start = privateCalendarOffset(latest.startDate, settings.cycleLength);
      for (let n = 0; start <= '2200-12-31' && n < settings.periodLength; n++) {
        const date = privateCalendarOffset(start, n);
        if (!marks.has(`${date}:period`)) add(date, 'period-estimate');
      }
    }
  }
  if (data?.canUseIntimacy) for (const row of data.intimacy || []) add(privateCalendarDate(row.date), 'intimacy');
  return [...marks.values()].sort((a, b) => a.date.localeCompare(b.date) || a.kind.localeCompare(b.kind));
}
export function withoutPrivateEmotionFlags(payload) {
  const result = JSON.parse(JSON.stringify(payload));
  // Retain all ordinary emotion records, but never newly publish these flags.
  if (Array.isArray(result?.entries)) result.entries = result.entries.map(row => {
    if (!plain(row)) return row;
    const {period, intimacy, ...ordinary} = row; return ordinary;
  });
  if (plain(result)) { delete result.period; delete result.intimacy; }
  return result;
}
