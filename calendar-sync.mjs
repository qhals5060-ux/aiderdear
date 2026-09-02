import crypto from 'node:crypto';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/calendar.calendarlist.readonly',
  'https://www.googleapis.com/auth/calendar.events',
];
const GOOGLE_SCOPE = GOOGLE_SCOPES.join(' ');
const GOOGLE_AUTH = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN = 'https://oauth2.googleapis.com/token';
const NOTION_AUTH = 'https://api.notion.com/v1/oauth/authorize';
const NOTION_TOKEN = 'https://api.notion.com/v1/oauth/token';
const NOTION_VERSION = '2022-06-28';

function env(name, optional = false) {
  const value = String(process.env[name] || '').trim();
  if (!value && !optional) throw new Error(`${name} 환경 변수가 필요합니다.`);
  return value;
}

function firebaseApp() {
  if (getApps().length) return getApps()[0];
  const raw = env('FIREBASE_SERVICE_ACCOUNT_JSON', true);
  if (raw) {
    const serviceAccount = JSON.parse(raw);
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    return initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  }
  const projectId = env('FIREBASE_PROJECT_ID', true);
  const clientEmail = env('FIREBASE_CLIENT_EMAIL', true);
  const privateKey = env('FIREBASE_PRIVATE_KEY', true).replace(/\\n/g, '\n');
  if (projectId && clientEmail && privateKey) {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
  }
  return initializeApp({ credential: applicationDefault(), projectId: projectId || undefined });
}

firebaseApp();
const db = getFirestore();

function baseUrl() {
  return env('PUBLIC_APP_URL').replace(/\/$/, '');
}

function callbackUrl() {
  return `${baseUrl()}/api/calendar-sync?action=callback`;
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function trace(stage, detail = {}) {
  console.info('[calendar-sync]', JSON.stringify({ stage, ...detail }));
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return { value: req.body, raw: JSON.stringify(req.body) };
  if (typeof req.body === 'string') {
    try { return { value: JSON.parse(req.body || '{}'), raw: req.body }; } catch { return { value: {}, raw: req.body }; }
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  try { return { value: JSON.parse(raw || '{}'), raw }; } catch { return { value: {}, raw }; }
}

function b64url(value) {
  return Buffer.from(value).toString('base64url');
}

function stateSecret() {
  return env('CALENDAR_STATE_SECRET');
}

function signedState(payload) {
  const data = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', stateSecret()).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyState(value) {
  const [data, signature] = String(value || '').split('.');
  if (!data || !signature) throw new Error('잘못된 연결 요청입니다.');
  const expected = crypto.createHmac('sha256', stateSecret()).update(data).digest('base64url');
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new Error('연결 요청이 유효하지 않습니다.');
  const payload = JSON.parse(Buffer.from(data, 'base64url').toString('utf8'));
  if (!payload.uid || Number(payload.exp || 0) < Date.now()) throw new Error('연결 요청이 만료되었습니다.');
  return payload;
}

async function currentUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw Object.assign(new Error('로그인이 필요합니다.'), { status: 401 });
  return getAuth().verifyIdToken(token);
}

function integrationRef(uid, provider) {
  return db.doc(`users/${uid}/integrations/${provider}`);
}

function scheduleRef(uid) {
  return db.doc(`users/${uid}/schedule/main`);
}

function cleanText(value, max = 500) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function dateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function endExclusiveToInclusive(value, fallback) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return fallback;
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() - 1);
  return dateOnly(date);
}

async function activePairId(uid) {
  const membership = await db.doc(`pairMemberships/${uid}`).get();
  if (!membership.exists || membership.data()?.status !== 'active') return '';
  const pairId = String(membership.data()?.pairId || '');
  if (!pairId) return '';
  const pair = await db.doc(`pairs/${pairId}`).get();
  return pair.exists && pair.data()?.status === 'active' && (pair.data()?.memberUids || []).includes(uid) ? pairId : '';
}

async function mirrorSharedSchedule(uid, email, rows) {
  const pairId = await activePairId(uid);
  if (!pairId) return;
  const shared = rows.filter(row => row?.owner === 'shared' || row?.shareWithCouple).map(row => ({
    ...row,
    owner: 'shared',
    pairKey: pairId,
    authorEmail: email,
    authorUid: uid,
  }));
  await db.doc(`pairs/${pairId}/schedules/${uid}`).set({
    payload: shared,
    ownerUid: uid,
    ownerEmail: email,
    updatedAt: FieldValue.serverTimestamp(),
  }, { merge: true });
}

async function replaceProviderRows(uid, provider, rows) {
  const user = await getAuth().getUser(uid);
  const email = String(user.email || '').toLowerCase();
  let savedRows = [];
  await db.runTransaction(async transaction => {
    const ref = scheduleRef(uid);
    const snapshot = await transaction.get(ref);
    const previous = Array.isArray(snapshot.data()?.payload) ? snapshot.data().payload : [];
    const own = previous.filter(row => row?.externalSource !== provider);
    // Google keeps its explicit sharedEventKeys on the connection document.
    // Other imported providers do not have a remote share flag, so preserve the
    // AiderLog-only choice by stable external ID when their rows are refreshed.
    const previouslyShared = provider === 'google' ? new Set() : new Set(
      previous
        .filter(row => row?.externalSource === provider && (row?.shareWithCouple || row?.owner === 'shared'))
        .map(row => String(row?.externalId || row?.id || ''))
        .filter(Boolean),
    );
    const imported = rows.slice(0, 600).map(row => {
      const keepShared = !!row?.shareWithCouple || previouslyShared.has(String(row?.externalId || row?.id || ''));
      return {
        ...row,
        authorEmail: email,
        authorUid: uid,
        shareWithCouple: keepShared,
        owner: keepShared ? 'shared' : 'mine',
        pairKey: '',
      };
    });
    const merged = [...own, ...imported].slice(-1200);
    savedRows = merged;
    transaction.set(ref, { ownerUid: uid, payload: merged, updatedAt: FieldValue.serverTimestamp(), updatedBy: uid }, { merge: true });
  });
  await mirrorSharedSchedule(uid, email, savedRows);
}

async function removeProviderRows(uid, provider) {
  const user = await getAuth().getUser(uid);
  const email = String(user.email || '').toLowerCase();
  let savedRows = [];
  await db.runTransaction(async transaction => {
    const ref = scheduleRef(uid);
    const snapshot = await transaction.get(ref);
    const rows = (Array.isArray(snapshot.data()?.payload) ? snapshot.data().payload : []).filter(row => row?.externalSource !== provider);
    savedRows = rows;
    transaction.set(ref, { ownerUid: uid, payload: rows, updatedAt: FieldValue.serverTimestamp(), updatedBy: uid }, { merge: true });
  });
  await mirrorSharedSchedule(uid, email, savedRows);
}

async function googleAccess(uid) {
  const ref = integrationRef(uid, 'google');
  const snapshot = await ref.get();
  if (!snapshot.exists) throw new Error('Google Calendar가 연결되지 않았습니다.');
  const data = snapshot.data();
  if (data.accessToken && Number(data.expiresAt || 0) > Date.now() + 60_000) return { ref, data, token: data.accessToken };
  if (!data.refreshToken) throw new Error('Google Calendar를 다시 연결해주세요.');
  const response = await fetch(GOOGLE_TOKEN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: env('GOOGLE_CALENDAR_CLIENT_ID'), client_secret: env('GOOGLE_CALENDAR_CLIENT_SECRET'), refresh_token: data.refreshToken, grant_type: 'refresh_token' }),
  });
  const token = await response.json();
  if (!response.ok) {
    const message = token.error_description || 'Google Calendar 토큰 갱신에 실패했습니다.';
    if (String(token.error || '').toLowerCase() === 'invalid_grant') {
      await ref.set({ connected: false, accessToken: '', refreshToken: '', expiresAt: 0, lastError: 'Google 권한이 만료되었습니다. 캘린더를 다시 연결해주세요.', updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      throw new Error('Google 권한이 만료되었습니다. 캘린더를 다시 연결해주세요.');
    }
    await ref.set({ lastError: message, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    throw new Error(message);
  }
  const next = { ...data, accessToken: token.access_token, expiresAt: Date.now() + Number(token.expires_in || 3600) * 1000 };
  await ref.set({ accessToken: next.accessToken, expiresAt: next.expiresAt, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return { ref, data: next, token: next.accessToken };
}

async function googleJson(token, url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } });
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error?.message || `Google Calendar 오류 (${response.status})`);
  return body;
}

function googleShareKey(calendarId, eventId) {
  return `${String(calendarId)}::${String(eventId)}`;
}

async function listGoogleEvents(token, calendar, start, end, sharedEventKeys = new Set()) {
  const rows = [];
  let pageToken = '';
  do {
    const query = new URLSearchParams({ singleEvents: 'true', orderBy: 'startTime', maxResults: '2500', timeMin: start, timeMax: end });
    if (pageToken) query.set('pageToken', pageToken);
    const data = await googleJson(token, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?${query}`);
    for (const item of data.items || []) {
      if (item.status === 'cancelled' || !item.start) continue;
      const allDay = !!item.start.date;
      const startValue = item.start.date || item.start.dateTime;
      const endValue = item.end?.date || item.end?.dateTime || startValue;
      const startDate = String(startValue).slice(0, 10);
      const endDate = allDay ? endExclusiveToInclusive(String(endValue).slice(0, 10), startDate) : String(endValue).slice(0, 10);
      const shareWithCouple = sharedEventKeys.has(googleShareKey(calendar.id, item.id));
      rows.push({
        id: `google-live:${calendar.id}:${item.id}`,
        googleEventId: item.id,
        calendarId: `google:${calendar.id}`,
        sourceTitle: cleanText(calendar.summary || 'Google Calendar', 80),
        sourceColor: calendar.backgroundColor || '#4285F4',
        externalSource: 'google',
        externalId: item.id,
        isAiderDear: false,
        isHoliday: false,
        title: cleanText(item.summary || '(제목 없음)', 120),
        date: startDate,
        endDate: endDate < startDate ? startDate : endDate,
        time: allDay ? '' : String(startValue).slice(11, 16),
        endTime: allDay ? '' : String(endValue).slice(11, 16),
        allDay,
        memo: cleanText(item.description || '', 1200),
        owner: shareWithCouple ? 'shared' : 'mine',
        shareWithCouple,
        readOnly: true,
        externalUrl: String(item.htmlLink || ''),
        updatedAt: Date.parse(item.updated || '') || Date.now(),
      });
    }
    pageToken = String(data.nextPageToken || '');
  } while (pageToken && rows.length < 600);
  return rows;
}

async function availableGoogleCalendars(connection) {
  const result = await googleJson(connection.token, 'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250');
  return (result.items || []).filter(item => item.accessRole !== 'freeBusyReader' && !item.deleted);
}

function selectedGoogleCalendars(connection, calendars) {
  const configured = new Set((Array.isArray(connection.data.selectedCalendarIds) ? connection.data.selectedCalendarIds : []).map(String));
  const selected = configured.size ? calendars.filter(calendar => configured.has(String(calendar.id))) : calendars.filter(calendar => calendar.primary);
  return (selected.length ? selected : calendars.slice(0, 1)).slice(0, 20);
}

async function googleCalendarChoices(uid) {
  const connection = await googleAccess(uid);
  const calendars = await availableGoogleCalendars(connection);
  const selectedIds = selectedGoogleCalendars(connection, calendars).map(calendar => String(calendar.id));
  return {
    selectedCalendarIds: selectedIds,
    calendars: calendars.map(calendar => ({
      id: String(calendar.id),
      summary: cleanText(calendar.summary || 'Google Calendar', 100),
      primary: !!calendar.primary,
      accessRole: String(calendar.accessRole || 'reader'),
      writable: ['owner', 'writer'].includes(String(calendar.accessRole || 'reader')),
      backgroundColor: String(calendar.backgroundColor || '#4285F4'),
      foregroundColor: String(calendar.foregroundColor || '#FFFFFF'),
    })),
  };
}

async function syncGoogle(uid) {
  const connection = await googleAccess(uid);
  const calendars = await availableGoogleCalendars(connection);
  const selected = selectedGoogleCalendars(connection, calendars);
  const start = new Date(Date.now() - 366 * 86400000).toISOString();
  const end = new Date(Date.now() + 732 * 86400000).toISOString();
  const sharedEventKeys = new Set((Array.isArray(connection.data.sharedEventKeys) ? connection.data.sharedEventKeys : []).map(String));
  const batches = await Promise.all(selected.map(calendar => listGoogleEvents(connection.token, calendar, start, end, sharedEventKeys)));
  const rows = batches.flat().sort((a, b) => Math.abs(Date.parse(a.date) - Date.now()) - Math.abs(Date.parse(b.date) - Date.now())).slice(0, 600).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  await replaceProviderRows(uid, 'google', rows);
  const selectedCalendarIds = selected.map(calendar => String(calendar.id));
  await connection.ref.set({ provider: 'google', connected: true, selectedCalendarIds, calendarCount: selected.length, itemCount: rows.length, lastSyncedAt: FieldValue.serverTimestamp(), lastError: '' }, { merge: true });
  return { itemCount: rows.length, calendarCount: selected.length, selectedCalendarIds };
}

function nextDate(value) {
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error('일정 날짜가 올바르지 않습니다.');
  date.setUTCDate(date.getUTCDate() + 1);
  return dateOnly(date);
}

function googleEventPayload(raw = {}) {
  const title = cleanText(raw.title, 120);
  const date = String(raw.date || '');
  const endDate = String(raw.endDate || date);
  if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) throw new Error('일정 제목과 날짜를 확인해주세요.');
  if (raw.allDay) return {
    summary: title,
    description: cleanText(raw.memo, 1200),
    start: { date },
    end: { date: nextDate(endDate < date ? date : endDate) },
    extendedProperties: { private: { aiderlogCreated: 'true' } },
  };
  const time = /^\d{2}:\d{2}$/.test(String(raw.time || '')) ? String(raw.time) : '09:00';
  const endTime = /^\d{2}:\d{2}$/.test(String(raw.endTime || '')) ? String(raw.endTime) : time;
  const safeEndDate = endDate < date ? date : endDate;
  const startAt = new Date(`${date}T${time}:00+09:00`);
  let endAt = new Date(`${safeEndDate}T${endTime}:00+09:00`);
  if (!Number.isFinite(endAt.getTime()) || endAt <= startAt) endAt = new Date(startAt.getTime() + 60 * 60 * 1000);
  const endParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(endAt);
  const endValue = Object.fromEntries(endParts.map(part => [part.type, part.value]));
  return {
    summary: title,
    description: cleanText(raw.memo, 1200),
    start: { dateTime: `${date}T${time}:00`, timeZone: 'Asia/Seoul' },
    end: { dateTime: `${endValue.year}-${endValue.month}-${endValue.day}T${endValue.hour}:${endValue.minute}:00`, timeZone: 'Asia/Seoul' },
    extendedProperties: { private: { aiderlogCreated: 'true' } },
  };
}

async function createGoogleEvent(uid, calendarId, event = {}, shareWithCouple = false) {
  const connection = await googleAccess(uid);
  const calendars = await availableGoogleCalendars(connection);
  const selected = selectedGoogleCalendars(connection, calendars);
  const calendar = selected.find(row => String(row.id) === String(calendarId));
  if (!calendar) throw new Error('동기화 대상으로 선택한 Google 캘린더만 사용할 수 있습니다.');
  if (!['owner', 'writer'].includes(String(calendar.accessRole || ''))) throw new Error('이 Google 캘린더에는 일정을 추가할 권한이 없습니다.');
  const item = await googleJson(connection.token, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events?sendUpdates=none`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleEventPayload(event)),
  });
  if (shareWithCouple) {
    const sharedEventKeys = [...new Set([...(Array.isArray(connection.data.sharedEventKeys) ? connection.data.sharedEventKeys : []), googleShareKey(calendar.id, item.id)])].slice(-600);
    await connection.ref.set({ sharedEventKeys, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
  const result = await syncGoogle(uid);
  return { ...result, eventId: item.id, calendarId: String(calendar.id) };
}

async function shareGoogleEvent(uid, calendarId, eventId, shared) {
  const connection = await googleAccess(uid);
  const key = googleShareKey(calendarId, eventId);
  const values = new Set((Array.isArray(connection.data.sharedEventKeys) ? connection.data.sharedEventKeys : []).map(String));
  if (shared) values.add(key); else values.delete(key);
  await connection.ref.set({ sharedEventKeys: [...values].slice(-600), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  const result = await syncGoogle(uid);
  return { ...result, shared: !!shared };
}

async function stopGoogleChannels(token, channels = []) {
  await Promise.allSettled(channels.map(channel => googleJson(token, 'https://www.googleapis.com/calendar/v3/channels/stop', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: channel.id, resourceId: channel.resourceId }),
  })));
  await Promise.allSettled(channels.map(channel => db.doc(`calendarChannels/${channel.id}`).delete()));
}

async function watchGoogle(uid) {
  const connection = await googleAccess(uid);
  const oldChannels = Array.isArray(connection.data.channels) ? connection.data.channels : [];
  await stopGoogleChannels(connection.token, oldChannels);
  const calendars = await availableGoogleCalendars(connection);
  const selected = selectedGoogleCalendars(connection, calendars);
  const channels = await Promise.all(selected.map(async calendar => {
    const id = crypto.randomUUID();
    const body = { id, type: 'web_hook', address: `${baseUrl()}/api/calendar-sync?action=google-webhook`, token: signedState({ uid, provider: 'google', exp: Date.now() + 8 * 86400000 }), expiration: String(Date.now() + 6 * 86400000) };
    const result = await googleJson(connection.token, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events/watch`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const channel = { id, resourceId: result.resourceId, calendarId: calendar.id, expiration: Number(result.expiration || body.expiration) };
    await db.doc(`calendarChannels/${id}`).set({ uid, provider: 'google', calendarId: calendar.id, expiration: channel.expiration });
    return channel;
  }));
  await connection.ref.set({ channels, watchUpdatedAt: FieldValue.serverTimestamp() }, { merge: true });
  return channels.length;
}

async function configureGoogle(uid, calendarIds = []) {
  const connection = await googleAccess(uid);
  const calendars = await availableGoogleCalendars(connection);
  const allowed = new Set(calendars.map(calendar => String(calendar.id)));
  const selectedCalendarIds = [...new Set((Array.isArray(calendarIds) ? calendarIds : []).map(String).filter(id => allowed.has(id)))].slice(0, 20);
  if (!selectedCalendarIds.length) throw new Error('자동 동기화할 Google 캘린더를 하나 이상 선택해주세요.');
  await connection.ref.set({ selectedCalendarIds, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  const result = await syncGoogle(uid);
  try { await watchGoogle(uid); } catch (error) {
    await connection.ref.set({ watchError: error.message || String(error), watchUpdatedAt: FieldValue.serverTimestamp() }, { merge: true });
  }
  return result;
}

function notionValue(property) {
  if (!property) return '';
  if (property.type === 'title') return (property.title || []).map(value => value.plain_text || '').join('');
  if (property.type === 'rich_text') return (property.rich_text || []).map(value => value.plain_text || '').join('');
  if (property.type === 'select') return property.select?.name || '';
  if (property.type === 'status') return property.status?.name || '';
  if (property.type === 'url') return property.url || '';
  return '';
}

function notionSourceId(value) {
  const compact = String(value || '').replace(/-/g, '');
  const match = compact.match(/[a-f0-9]{32}/i);
  if (!match) throw new Error('올바른 Notion 데이터베이스 링크 또는 ID를 입력해주세요.');
  return match[0].replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/, '$1-$2-$3-$4-$5');
}

async function notionJson(token, url, options = {}) {
  const response = await fetch(url, { ...options, headers: { Authorization: `Bearer ${token}`, 'Notion-Version': NOTION_VERSION, 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || `Notion 오류 (${response.status})`);
  return body;
}

async function syncNotion(uid) {
  const ref = integrationRef(uid, 'notion');
  const snapshot = await ref.get();
  const connection = snapshot.data() || {};
  if (!connection.accessToken) throw new Error('Notion이 연결되지 않았습니다.');
  if (!connection.sourceId) throw new Error('Notion 데이터베이스를 먼저 지정해주세요.');
  const pages = [];
  let cursor = '';
  do {
    const payload = { page_size: 100 };
    if (cursor) payload.start_cursor = cursor;
    const data = await notionJson(connection.accessToken, `https://api.notion.com/v1/databases/${connection.sourceId}/query`, { method: 'POST', body: JSON.stringify(payload) });
    pages.push(...(data.results || []));
    cursor = data.has_more ? String(data.next_cursor || '') : '';
  } while (cursor && pages.length < 1000);
  const rows = [];
  for (const page of pages) {
    const properties = Object.values(page.properties || {});
    const title = properties.find(property => property.type === 'title');
    const date = properties.find(property => property.type === 'date' && property.date?.start);
    if (!date?.date?.start) continue;
    const start = String(date.date.start);
    const end = String(date.date.end || start);
    const allDay = !start.includes('T');
    rows.push({
      id: `notion-live:${page.id}`,
      googleEventId: `notion:${page.id}`,
      calendarId: `notion:${connection.sourceId}`,
      sourceTitle: cleanText(connection.sourceTitle || 'Notion', 80),
      sourceColor: '#000000',
      externalSource: 'notion',
      externalId: page.id,
      isAiderDear: false,
      isHoliday: false,
      title: cleanText(notionValue(title) || '(제목 없음)', 120),
      date: start.slice(0, 10),
      endDate: end.slice(0, 10),
      time: allDay ? '' : start.slice(11, 16),
      endTime: allDay ? '' : end.slice(11, 16),
      allDay,
      memo: cleanText(properties.map(notionValue).filter(Boolean).join(' · '), 1200),
      readOnly: true,
      externalUrl: String(page.url || ''),
      updatedAt: Date.parse(page.last_edited_time || '') || Date.now(),
    });
  }
  await replaceProviderRows(uid, 'notion', rows);
  await ref.set({ provider: 'notion', connected: true, itemCount: rows.length, lastSyncedAt: FieldValue.serverTimestamp(), lastError: '' }, { merge: true });
  return { itemCount: rows.length };
}

async function startConnection(uid, provider) {
  const state = signedState({ uid, provider, exp: Date.now() + 10 * 60_000 });
  if (provider === 'google') {
    const user = await getAuth().getUser(uid);
    const query = new URLSearchParams({ client_id: env('GOOGLE_CALENDAR_CLIENT_ID'), redirect_uri: callbackUrl(), response_type: 'code', scope: GOOGLE_SCOPE, access_type: 'offline', prompt: 'select_account consent', include_granted_scopes: 'true', state });
    if (user.email) query.set('login_hint', user.email);
    return `${GOOGLE_AUTH}?${query}`;
  }
  if (provider === 'notion') {
    const query = new URLSearchParams({ client_id: env('NOTION_CLIENT_ID'), redirect_uri: callbackUrl(), response_type: 'code', owner: 'user', state });
    return `${NOTION_AUTH}?${query}`;
  }
  throw new Error('지원하지 않는 캘린더입니다.');
}

async function oauthCallback(req, res) {
  let state = null;
  try {
    state = verifyState(req.query.state);
    const code = String(req.query.code || '');
    if (!code) throw new Error(String(req.query.error_description || req.query.error || '연결이 취소되었습니다.'));
    trace('oauth-callback-start', { provider: state.provider, user: String(state.uid).slice(0, 8) });
    if (state.provider === 'google') {
      const response = await fetch(GOOGLE_TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: env('GOOGLE_CALENDAR_CLIENT_ID'), client_secret: env('GOOGLE_CALENDAR_CLIENT_SECRET'), redirect_uri: callbackUrl(), grant_type: 'authorization_code' }) });
      const token = await response.json();
      if (!response.ok) throw new Error(token.error_description || 'Google Calendar 연결에 실패했습니다.');
      const ref = integrationRef(state.uid, 'google');
      const previous = (await ref.get()).data() || {};
      await ref.set({ provider: 'google', connected: true, accessToken: token.access_token, refreshToken: token.refresh_token || previous.refreshToken || '', expiresAt: Date.now() + Number(token.expires_in || 3600) * 1000, scope: String(token.scope || GOOGLE_SCOPE), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      const synced = await syncGoogle(state.uid);
      trace('oauth-google-saved', { user: String(state.uid).slice(0, 8), calendars: synced.calendarCount, items: synced.itemCount, hasRefreshToken: Boolean(token.refresh_token || previous.refreshToken) });
      // A webhook subscription is an optional live-refresh enhancement. Google can
      // reject it temporarily even though OAuth and the initial event import both
      // succeeded. Do not turn that into a failed connection after rows are saved.
      try {
        await watchGoogle(state.uid);
      } catch (watchError) {
        console.warn('Google Calendar watch setup skipped', watchError);
        await ref.set({ watchError: watchError.message || String(watchError), watchUpdatedAt: FieldValue.serverTimestamp() }, { merge: true });
      }
    } else if (state.provider === 'notion') {
      const basic = Buffer.from(`${env('NOTION_CLIENT_ID')}:${env('NOTION_CLIENT_SECRET')}`).toString('base64');
      const response = await fetch(NOTION_TOKEN, { method: 'POST', headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ grant_type: 'authorization_code', code, redirect_uri: callbackUrl() }) });
      const token = await response.json();
      if (!response.ok) throw new Error(token.message || 'Notion 연결에 실패했습니다.');
      await integrationRef(state.uid, 'notion').set({ provider: 'notion', connected: true, accessToken: token.access_token, workspaceId: token.workspace_id || '', workspaceName: token.workspace_name || '', botId: token.bot_id || '', updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      if (token.workspace_id) await db.doc(`calendarIntegrationIndex/notion-${token.workspace_id}`).set({ uid: state.uid, provider: 'notion', workspaceId: token.workspace_id });
    }
    res.statusCode = 302;
    res.setHeader('Location', `${baseUrl()}/?calendar_sync=${encodeURIComponent(state.provider)}`);
    res.end();
  } catch (error) {
    console.error('calendar-sync callback', error);
    res.statusCode = 302;
    const provider = String(state?.provider || '');
    res.setHeader('Location', `${baseUrl()}/?calendar_sync_error=${encodeURIComponent(error.message || String(error))}${provider ? `&calendar_sync_provider=${encodeURIComponent(provider)}` : ''}`);
    res.end();
  }
}

async function status(uid) {
  const [google, notion] = await Promise.all([integrationRef(uid, 'google').get(), integrationRef(uid, 'notion').get()]);
  const expose = snapshot => {
    if (!snapshot.exists) return { connected: false };
    const row = snapshot.data();
    return { connected: !!row.connected, lastSyncedAt: row.lastSyncedAt?.toMillis?.() || 0, itemCount: Number(row.itemCount || 0), calendarCount: Number(row.calendarCount || 0), selectedCalendarIds: Array.isArray(row.selectedCalendarIds) ? row.selectedCalendarIds : [], writeEnabled: String(row.scope || '').includes('calendar.events'), sourceId: row.sourceId || '', workspaceName: row.workspaceName || '', lastError: row.lastError || '' };
  };
  return { google: expose(google), notion: expose(notion), samsung: { connected: google.exists, mode: 'google-account' } };
}

async function disconnect(uid, provider) {
  const ref = integrationRef(uid, provider);
  const snapshot = await ref.get();
  if (provider === 'google' && snapshot.exists) {
    try { const access = await googleAccess(uid); await stopGoogleChannels(access.token, snapshot.data().channels || []); } catch {}
  }
  if (provider === 'notion' && snapshot.data()?.workspaceId) await db.doc(`calendarIntegrationIndex/notion-${snapshot.data().workspaceId}`).delete().catch(() => {});
  await ref.delete();
  await removeProviderRows(uid, provider);
}

async function notionWebhook(req, res, body, raw) {
  if (body.verification_token) return json(res, 200, { ok: true });
  const secret = env('NOTION_WEBHOOK_SECRET');
  const signature = String(req.headers['x-notion-signature'] || '');
  const expected = `sha256=${crypto.createHmac('sha256', secret).update(raw).digest('hex')}`;
  if (!signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return json(res, 401, { error: 'invalid signature' });
  const workspaceId = String(body.workspace_id || body.workspace?.id || '');
  if (workspaceId) {
    const index = await db.doc(`calendarIntegrationIndex/notion-${workspaceId}`).get();
    if (index.exists) await syncNotion(index.data().uid);
  }
  return json(res, 200, { ok: true });
}

async function renewGoogleWatches(req, res) {
  const authorization = String(req.headers.authorization || '');
  if (authorization !== `Bearer ${env('CRON_SECRET')}`) return json(res, 401, { error: 'unauthorized' });
  const snapshots = await db.collectionGroup('integrations').where('provider', '==', 'google').get();
  let renewed = 0;
  for (const snapshot of snapshots.docs) {
    const uid = snapshot.ref.parent.parent?.id;
    if (!uid) continue;
    try { await syncGoogle(uid); await watchGoogle(uid); renewed++; } catch (error) { await snapshot.ref.set({ lastError: error.message || String(error) }, { merge: true }); }
  }
  return json(res, 200, { renewed });
}

export default async function handler(req, res) {
  const action = String(req.query.action || 'status');
  try {
    if (action === 'callback') return oauthCallback(req, res);
    if (action === 'google-webhook') {
      const channelId = String(req.headers['x-goog-channel-id'] || '');
      const token = String(req.headers['x-goog-channel-token'] || '');
      if (!channelId || !token) return json(res, 400, { error: 'missing channel' });
      const state = verifyState(token);
      const channel = await db.doc(`calendarChannels/${channelId}`).get();
      if (!channel.exists || channel.data().uid !== state.uid) return json(res, 404, { error: 'unknown channel' });
      await syncGoogle(state.uid);
      return json(res, 200, { ok: true });
    }
    const parsed = await readBody(req);
    if (action === 'notion-webhook') return notionWebhook(req, res, parsed.value, parsed.raw);
    if (action === 'renew') return renewGoogleWatches(req, res);
    const user = await currentUser(req);
    if (action === 'status') {
      const snapshot = await status(user.uid);
      trace('status', { user: String(user.uid).slice(0, 8), googleConnected: snapshot.google.connected, googleCalendars: snapshot.google.calendarCount, googleItems: snapshot.google.itemCount, notionConnected: snapshot.notion.connected });
      return json(res, 200, snapshot);
    }
    if (action === 'calendars') return json(res, 200, await googleCalendarChoices(user.uid));
    if (action === 'start') return json(res, 200, { url: await startConnection(user.uid, parsed.value.provider) });
    if (action === 'sync') {
      const provider = parsed.value.provider;
      const result = provider === 'google' ? await syncGoogle(user.uid) : await syncNotion(user.uid);
      trace('manual-sync', { user: String(user.uid).slice(0, 8), provider, calendars: result.calendarCount || 0, items: result.itemCount || 0 });
      return json(res, 200, result);
    }
    if (action === 'configure') {
      if (parsed.value.provider === 'google') return json(res, 200, await configureGoogle(user.uid, parsed.value.calendarIds));
      if (parsed.value.provider !== 'notion') throw new Error('지원하지 않는 설정입니다.');
      const sourceId = notionSourceId(parsed.value.source);
      const ref = integrationRef(user.uid, 'notion');
      const snapshot = await ref.get();
      if (!snapshot.exists) throw new Error('Notion을 먼저 연결해주세요.');
      await ref.set({ sourceId, sourceTitle: cleanText(parsed.value.sourceTitle || 'Notion', 80), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      const result = await syncNotion(user.uid);
      return json(res, 200, { ...result, sourceId });
    }
    if (action === 'create') {
      if (parsed.value.provider !== 'google') throw new Error('Google Calendar 일정만 직접 추가할 수 있습니다.');
      return json(res, 200, await createGoogleEvent(user.uid, parsed.value.calendarId, parsed.value.event, parsed.value.shareWithCouple));
    }
    if (action === 'share') {
      if (parsed.value.provider !== 'google') throw new Error('Google Calendar 일정만 공유 설정할 수 있습니다.');
      return json(res, 200, await shareGoogleEvent(user.uid, parsed.value.calendarId, parsed.value.eventId, parsed.value.shared));
    }
    if (action === 'disconnect') {
      await disconnect(user.uid, parsed.value.provider);
      return json(res, 200, { ok: true });
    }
    return json(res, 404, { error: 'unknown action' });
  } catch (error) {
    console.error('calendar-sync', action, error);
    return json(res, Number(error.status || 500), { error: error.message || String(error) });
  }
}
