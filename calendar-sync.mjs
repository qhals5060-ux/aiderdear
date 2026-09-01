import crypto from 'node:crypto';
import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const GOOGLE_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';
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

async function replaceProviderRows(uid, provider, rows) {
  const user = await getAuth().getUser(uid);
  const email = String(user.email || '').toLowerCase();
  await db.runTransaction(async transaction => {
    const ref = scheduleRef(uid);
    const snapshot = await transaction.get(ref);
    const previous = Array.isArray(snapshot.data()?.payload) ? snapshot.data().payload : [];
    const own = previous.filter(row => row?.externalSource !== provider);
    const merged = [...own, ...rows.slice(0, 600)].map(row => ({ ...row, authorEmail: email, owner: 'mine', pairKey: '' })).slice(-1200);
    transaction.set(ref, { ownerUid: uid, payload: merged, updatedAt: FieldValue.serverTimestamp(), updatedBy: uid }, { merge: true });
  });
}

async function removeProviderRows(uid, provider) {
  await db.runTransaction(async transaction => {
    const ref = scheduleRef(uid);
    const snapshot = await transaction.get(ref);
    const rows = (Array.isArray(snapshot.data()?.payload) ? snapshot.data().payload : []).filter(row => row?.externalSource !== provider);
    transaction.set(ref, { ownerUid: uid, payload: rows, updatedAt: FieldValue.serverTimestamp(), updatedBy: uid }, { merge: true });
  });
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
  if (!response.ok) throw new Error(token.error_description || 'Google Calendar 토큰 갱신에 실패했습니다.');
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

async function listGoogleEvents(token, calendar, start, end) {
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
        readOnly: true,
        externalUrl: String(item.htmlLink || ''),
        updatedAt: Date.parse(item.updated || '') || Date.now(),
      });
    }
    pageToken = String(data.nextPageToken || '');
  } while (pageToken && rows.length < 600);
  return rows;
}

async function syncGoogle(uid) {
  const connection = await googleAccess(uid);
  const calendars = await googleJson(connection.token, 'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250');
  const selected = (calendars.items || []).filter(item => item.accessRole !== 'freeBusyReader' && !item.deleted).slice(0, 10);
  const start = new Date(Date.now() - 366 * 86400000).toISOString();
  const end = new Date(Date.now() + 732 * 86400000).toISOString();
  const batches = await Promise.all(selected.map(calendar => listGoogleEvents(connection.token, calendar, start, end)));
  const rows = batches.flat().sort((a, b) => Math.abs(Date.parse(a.date) - Date.now()) - Math.abs(Date.parse(b.date) - Date.now())).slice(0, 600).sort((a, b) => String(a.date).localeCompare(String(b.date)));
  await replaceProviderRows(uid, 'google', rows);
  await connection.ref.set({ provider: 'google', connected: true, calendarCount: selected.length, itemCount: rows.length, lastSyncedAt: FieldValue.serverTimestamp(), lastError: '' }, { merge: true });
  return { itemCount: rows.length, calendarCount: selected.length };
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
  const calendars = await googleJson(connection.token, 'https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250');
  const selected = (calendars.items || []).filter(item => item.accessRole !== 'freeBusyReader' && !item.deleted).slice(0, 10);
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
    const query = new URLSearchParams({ client_id: env('GOOGLE_CALENDAR_CLIENT_ID'), redirect_uri: callbackUrl(), response_type: 'code', scope: GOOGLE_SCOPE, access_type: 'offline', prompt: 'consent', include_granted_scopes: 'true', state });
    return `${GOOGLE_AUTH}?${query}`;
  }
  if (provider === 'notion') {
    const query = new URLSearchParams({ client_id: env('NOTION_CLIENT_ID'), redirect_uri: callbackUrl(), response_type: 'code', owner: 'user', state });
    return `${NOTION_AUTH}?${query}`;
  }
  throw new Error('지원하지 않는 캘린더입니다.');
}

async function oauthCallback(req, res) {
  try {
    const state = verifyState(req.query.state);
    const code = String(req.query.code || '');
    if (!code) throw new Error(String(req.query.error_description || req.query.error || '연결이 취소되었습니다.'));
    if (state.provider === 'google') {
      const response = await fetch(GOOGLE_TOKEN, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ code, client_id: env('GOOGLE_CALENDAR_CLIENT_ID'), client_secret: env('GOOGLE_CALENDAR_CLIENT_SECRET'), redirect_uri: callbackUrl(), grant_type: 'authorization_code' }) });
      const token = await response.json();
      if (!response.ok) throw new Error(token.error_description || 'Google Calendar 연결에 실패했습니다.');
      const ref = integrationRef(state.uid, 'google');
      const previous = (await ref.get()).data() || {};
      await ref.set({ provider: 'google', connected: true, accessToken: token.access_token, refreshToken: token.refresh_token || previous.refreshToken || '', expiresAt: Date.now() + Number(token.expires_in || 3600) * 1000, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      await syncGoogle(state.uid);
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
    res.statusCode = 302;
    res.setHeader('Location', `${baseUrl()}/?calendar_sync_error=${encodeURIComponent(error.message || String(error))}`);
    res.end();
  }
}

async function status(uid) {
  const [google, notion] = await Promise.all([integrationRef(uid, 'google').get(), integrationRef(uid, 'notion').get()]);
  const expose = snapshot => {
    if (!snapshot.exists) return { connected: false };
    const row = snapshot.data();
    return { connected: !!row.connected, lastSyncedAt: row.lastSyncedAt?.toMillis?.() || 0, itemCount: Number(row.itemCount || 0), calendarCount: Number(row.calendarCount || 0), sourceId: row.sourceId || '', workspaceName: row.workspaceName || '', lastError: row.lastError || '' };
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
    if (action === 'status') return json(res, 200, await status(user.uid));
    if (action === 'start') return json(res, 200, { url: await startConnection(user.uid, parsed.value.provider) });
    if (action === 'sync') {
      const provider = parsed.value.provider;
      const result = provider === 'google' ? await syncGoogle(user.uid) : await syncNotion(user.uid);
      return json(res, 200, result);
    }
    if (action === 'configure') {
      if (parsed.value.provider !== 'notion') throw new Error('지원하지 않는 설정입니다.');
      const sourceId = notionSourceId(parsed.value.source);
      const ref = integrationRef(user.uid, 'notion');
      const snapshot = await ref.get();
      if (!snapshot.exists) throw new Error('Notion을 먼저 연결해주세요.');
      await ref.set({ sourceId, sourceTitle: cleanText(parsed.value.sourceTitle || 'Notion', 80), updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      const result = await syncNotion(user.uid);
      return json(res, 200, { ...result, sourceId });
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
