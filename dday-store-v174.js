// Pure D-day validation/projection. No network, storage, account lookup or writes.
// Legacy app/main documents are read-only; mutations target app/ddays exclusively.
export function ddayFailure(message, status = 400) { throw Object.assign(new Error(message), {status}); }
const object = value => !!value && typeof value === 'object' && !Array.isArray(value);
const email = value => String(value || '').trim().toLowerCase();
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const str = (value, max, label, optional = true) => {
  if (value == null && optional) return '';
  if (typeof value !== 'string' || value.length > max) ddayFailure(`${label} 형식을 확인해주세요.`);
  return value.trim();
};
export function ddayId(value) {
  const id = str(value, 128, 'D-day 식별자', false);
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(id)) ddayFailure('D-day 식별자를 확인해주세요.');
  return id;
}
export function ddayScope(value) {
  const scope = str(value, 140, 'D-day 저장 공간', false);
  if (!/^(user|pair):[A-Za-z0-9_-]{1,128}$/.test(scope)) ddayFailure('D-day 저장 공간을 확인해주세요.');
  return scope;
}
export function normalizeDdayItem(value, {legacy = false} = {}) {
  if (!object(value)) ddayFailure('저장된 D-day 형식이 잘못되었습니다. 원본을 변경하지 않았습니다.');
  const id = ddayId(value.id), title = str(value.title, legacy ? 500 : 80, 'D-day 이름');
  const date = str(value.date, 10, 'D-day 날짜', false), stamp = Date.parse(date + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(stamp) || new Date(stamp).toISOString().slice(0, 10) !== date) ddayFailure('D-day 날짜를 YYYY-MM-DD 형식으로 입력해주세요.');
  if (!legacy && !title) ddayFailure('D-day 이름을 입력해주세요.');
  if (value.mode != null && !['', 'since', 'countdown'].includes(value.mode)) ddayFailure('D-day 표시 방식을 확인해주세요.');
  return {...(legacy ? value : {}), id, title: title || 'D-day', date, mode: value.mode === 'since' ? 'since' : 'countdown'};
}
export function normalizeDdayStore(value) {
  if (value == null) return {version: 174, items: [], deletedIds: []};
  if (!object(value) || (value.version != null && value.version !== 174)) ddayFailure('D-day 저장 형식을 확인할 수 없습니다. 원본을 변경하지 않았습니다.');
  if (value.items != null && !Array.isArray(value.items) || value.deletedIds != null && !Array.isArray(value.deletedIds)) ddayFailure('저장된 D-day 목록 형식을 확인해주세요.');
  const items = (value.items || []).map(row => normalizeDdayItem(row, {legacy: true}));
  const deletedIds = [...new Set((value.deletedIds || []).map(ddayId))];
  if (items.length > 1000 || deletedIds.length > 5000 || new Set(items.map(row => row.id)).size !== items.length) ddayFailure('D-day 저장 개수 또는 중복 식별자를 확인해주세요.');
  return {version: 174, items, deletedIds};
}
function visibleLegacy(row, sourceScope, context) {
  const author = email(row.createdBy), stored = String(row.pairKey || '');
  if (author === email(context.email)) return true;
  if (!author && sourceScope === `user:${context.uid}`) return true;
  if (!context.pairId || !context.partnerEmail) return false;
  if (author === email(context.partnerEmail)) return !stored || stored === context.pairKey || stored === `solo:${email(context.partnerEmail)}`;
  return !author && (!stored || stored === context.pairKey);
}
export function mergeDdaySources(sources, context) {
  const items = [];
  for (const source of sources) {
    const sourceScope = ddayScope(source.sourceScope);
    if (![ `user:${context.uid}`, ...(context.pairId ? [`pair:${context.pairId}`] : []) ].includes(sourceScope)) ddayFailure('현재 계정의 D-day 저장 공간이 아닙니다.', 403);
    const legacy = source.legacy == null ? {} : source.legacy;
    if (!object(legacy) || legacy.ddays != null && !Array.isArray(legacy.ddays)) ddayFailure('기존 D-day 목록을 읽을 수 없습니다. 저장을 중단했습니다.');
    const store = normalizeDdayStore(source.stored), rows = new Map(), removed = new Set(store.deletedIds);
    for (const raw of legacy.ddays || []) {
      if (!object(raw)) ddayFailure('기존 D-day 기록을 확인해주세요.');
      // Filter before validation: private entries belonging to old connections
      // must neither surface nor prevent access to the current user's records.
      if (!visibleLegacy(raw, sourceScope, context)) continue;
      const row = normalizeDdayItem(raw, {legacy: true}); rows.set(row.id, row);
    }
    for (const row of store.items) rows.set(row.id, row);
    for (const row of rows.values()) if (!removed.has(row.id)) items.push({...row, sourceScope});
  }
  return items;
}
export function resolveDdaySelection(items, settings, sources, context) {
  if (settings != null && !object(settings)) ddayFailure('대표 D-day 설정을 읽을 수 없습니다.');
  // A dedicated preference is authoritative. If inaccessible/deleted, display
  // an existing accessible row without changing that saved preference.
  if (settings && own(settings, 'activeId')) {
    const activeId = settings.activeId ? ddayId(settings.activeId) : '';
    const activeScope = settings.activeScope ? ddayScope(settings.activeScope) : '';
    return items.find(row => row.id === activeId && row.sourceScope === activeScope) || items[0] || null;
  }
  for (const source of [...sources].reverse()) {
    const legacy = source.legacy || {}, keys = [context.pairKey, `solo:${email(context.email)}`].filter(Boolean);
    const candidates = [...keys.map(key => legacy.activeDdayBySpace?.[key]), legacy.activeDdayId].filter(Boolean);
    for (const id of candidates) {
      const row = items.find(item => item.id === id && item.sourceScope === source.sourceScope);
      if (row) return row;
    }
  }
  return items[0] || null;
}
export function preserveDdayRows(stored, visibleItems, sourceScope) {
  const store = normalizeDdayStore(stored), ids = new Set(store.items.map(row => row.id)), removed = new Set(store.deletedIds);
  let changed = false;
  for (const visible of visibleItems) {
    if (visible.sourceScope !== sourceScope || ids.has(visible.id) || removed.has(visible.id)) continue;
    const {sourceScope: _scope, ...row} = visible;
    store.items.push(normalizeDdayItem(row, {legacy:true})); ids.add(row.id); changed = true;
  }
  return {store:normalizeDdayStore(store), changed};
}
export function mutateDdayStore(stored, action, {context, sourceScope, visibleItems, now = Date.now()}) {
  const type = action?.type;
  if (!['add', 'select', 'delete'].includes(type)) ddayFailure('지원하지 않는 D-day 작업입니다.');
  const preserved = preserveDdayRows(stored, visibleItems, sourceScope), store = preserved.store;
  if (type === 'add') {
    const item = normalizeDdayItem(action.item), existing = visibleItems.find(row => row.id === item.id && row.sourceScope === sourceScope);
    if (store.deletedIds.includes(item.id)) ddayFailure('삭제한 D-day 식별자는 다시 사용할 수 없습니다.', 409);
    if (existing) {
      if (['title','date','mode'].some(key => existing[key] !== item[key])) ddayFailure('같은 식별자의 D-day가 이미 있습니다. 저장 내용을 확인해주세요.', 409);
      return {store, id: item.id, changed: preserved.changed, added:false};
    }
    const row = {...item, createdBy: email(context.email), pairKey: sourceScope.startsWith('pair:') ? context.pairKey : `solo:${email(context.email)}`, createdAt: now, updatedAt: now};
    store.items.push(row);
    return {store: normalizeDdayStore(store), id: item.id, changed: true, added:true};
  }
  const id = ddayId(action.id), exists = visibleItems.some(row => row.id === id && row.sourceScope === sourceScope);
  if (type === 'select') {
    if (!exists) ddayFailure('선택한 D-day를 찾을 수 없습니다.', 404);
    return {store, id, changed: preserved.changed};
  }
  if (!exists && !store.deletedIds.includes(id)) ddayFailure('삭제할 D-day를 찾을 수 없습니다.', 404);
  if (store.deletedIds.includes(id)) return {store, id, changed: preserved.changed};
  store.items = store.items.filter(row => row.id !== id); store.deletedIds.push(id);
  return {store: normalizeDdayStore(store), id, changed: true};
}
