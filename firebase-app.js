import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  reauthenticateWithPopup,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  Bytes,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyALzfkvB9MscSFBxz6I4mtHtCmx1G5bdaw',
  authDomain: 'aiderdear-1bbca.firebaseapp.com',
  projectId: 'aiderdear-1bbca',
  storageBucket: 'aiderdear-1bbca.firebasestorage.app',
  messagingSenderId: '272602158936',
  appId: '1:272602158936:web:4b516691f374849a52772d',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
auth.languageCode = 'ko';

const state = {
  ready: false,
  user: null,
  pair: null,
  partner: null,
  incoming: [],
  outgoing: [],
  friends: [],
  friendIncoming: [],
  friendOutgoing: [],
  directLetters: [],
  error: '',
};

const subscribers = new Set();
let googleDriveAccessToken = '';
let googleCalendarAccessToken = '';
let unsubscribePairs = null;
let unsubscribeIncoming = null;
let unsubscribeOutgoing = null;
let unsubscribeFriends = null;
let unsubscribeFriendIncoming = null;
let unsubscribeFriendOutgoing = null;
let unsubscribeDirectLetters = null;
let unsubscribeAppData = null;
let unsubscribeOwnSchedule = null;
let unsubscribePartnerSchedule = null;
let appDataScopeKey = '';
let pairRows = [];
let incomingRows = [];
let outgoingRows = [];
let friendRows = [];
let friendIncomingRows = [];
let friendOutgoingRows = [];
let directLetterRows = [];
let repairPromise = null;
let directLetterCleanupBusy = false;

const DIRECT_LETTER_RETENTION_MS = 7 * 24 * 60 * 60 * 1000;
const PAPER_TASK_WORKSPACE_ID = 'aiderlog-paper-task-v1';
const PAPER_TASK_WORKSPACE_EMAILS = new Set(['qhals5060@gmail.com', 'aidway55@gmail.com']);

const cleanEmail = value => String(value || '').trim().toLowerCase();
const publicUser = user => user ? {
  uid: user.uid,
  email: cleanEmail(user.email),
  name: String(user.displayName || user.email?.split('@')[0] || '사용자'),
  photoURL: String(user.photoURL || ''),
} : null;
const timestampValue = value => value?.toMillis?.() || Number(value || 0);
const plainDoc = snapshot => snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;

function emit() {
  const snapshot = {
    ready: state.ready,
    user: state.user ? { ...state.user } : null,
    pair: state.pair ? { ...state.pair } : null,
    partner: state.partner ? { ...state.partner } : null,
    incoming: state.incoming.map(row => ({ ...row })),
    outgoing: state.outgoing.map(row => ({ ...row })),
    friends: state.friends.map(row => ({ ...row })),
    friendIncoming: state.friendIncoming.map(row => ({ ...row })),
    friendOutgoing: state.friendOutgoing.map(row => ({ ...row })),
    directLetters: state.directLetters.map(row => ({ ...row })),
    error: state.error,
  };
  subscribers.forEach(callback => {
    try { callback(snapshot); } catch (error) { console.error(error); }
  });
  window.dispatchEvent(new CustomEvent('aiderdear-firebase-state', { detail: snapshot }));
}

function stopListeners() {
  [unsubscribePairs, unsubscribeIncoming, unsubscribeOutgoing, unsubscribeFriends, unsubscribeFriendIncoming, unsubscribeFriendOutgoing, unsubscribeDirectLetters, unsubscribeAppData, unsubscribeOwnSchedule, unsubscribePartnerSchedule].forEach(stop => {
    try { stop?.(); } catch {}
  });
  unsubscribePairs = unsubscribeIncoming = unsubscribeOutgoing = unsubscribeFriends = unsubscribeFriendIncoming = unsubscribeFriendOutgoing = unsubscribeDirectLetters = unsubscribeAppData = unsubscribeOwnSchedule = unsubscribePartnerSchedule = null;
  appDataScopeKey = '';
  pairRows = [];
  incomingRows = [];
  outgoingRows = [];
  friendRows = [];
  friendIncomingRows = [];
  friendOutgoingRows = [];
  directLetterRows = [];
}

function watchAppData() {
  if (!state.user) return;
  const scopeKey = `${state.user.uid}:${state.pair?.id || 'solo'}`;
  if (scopeKey === appDataScopeKey) return;
  try { unsubscribeAppData?.(); } catch {}
  appDataScopeKey = scopeKey;
  const ref = state.pair
    ? doc(db, 'pairs', state.pair.id, 'app', 'main')
    : doc(db, 'users', state.user.uid, 'app', 'main');
  unsubscribeAppData = onSnapshot(ref, snapshot => {
    if (!snapshot.exists()) return;
    const data = snapshot.data();
    window.dispatchEvent(new CustomEvent('aiderdear-firebase-data', {
      detail: {
        scope: scopeKey,
        updatedBy: String(data.updatedBy || ''),
        updatedAt: timestampValue(data.updatedAt),
      },
    }));
  }, error => {
    state.error = error.message;
    emit();
  });
}

function recomputeState() {
  const active = pairRows
    .filter(row => row.status === 'active' && Array.isArray(row.memberUids) && row.memberUids.includes(state.user?.uid))
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt))[0] || null;
  state.pair = active;
  state.partner = null;
  if (active && state.user) {
    const profiles = Array.isArray(active.memberProfiles) ? active.memberProfiles : [];
    const partner = profiles.find(profile => profile.uid && profile.uid !== state.user.uid);
    if (partner) state.partner = {
      uid: String(partner.uid || ''),
      email: cleanEmail(partner.email),
      name: String(partner.name || partner.email?.split('@')[0] || '상대'),
      photoURL: String(partner.photoURL || ''),
    };
  }
  state.incoming = incomingRows
    .filter(row => row.status === 'pending')
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
  state.outgoing = outgoingRows
    .filter(row => row.status === 'pending')
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
  state.friends = friendRows
    .filter(row => row.status === 'active' && row.memberUids?.includes(state.user?.uid))
    .map(row => {
      const friend = (row.memberProfiles || []).find(profile => profile.uid !== state.user?.uid) || {};
      return { friendshipId: row.id, uid: String(friend.uid || ''), email: cleanEmail(friend.email), name: String(friend.name || friend.email?.split('@')[0] || '친구'), photoURL: String(friend.photoURL || '') };
    })
    .filter(row => row.uid && row.email)
    .sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  state.friendIncoming = friendIncomingRows.filter(row => row.status === 'pending').sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
  state.friendOutgoing = friendOutgoingRows.filter(row => row.status === 'pending').sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
  state.directLetters = directLetterRows.sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
  watchAppData();
  emit();
}

async function cleanupExpiredDirectLetters(snapshots) {
  if (directLetterCleanupBusy || !snapshots.length) return;
  directLetterCleanupBusy = true;
  try {
    for (let start = 0; start < snapshots.length; start += 400) {
      const batch = writeBatch(db);
      snapshots.slice(start, start + 400).forEach(snapshot => batch.delete(snapshot.ref));
      await batch.commit();
    }
  } finally {
    directLetterCleanupBusy = false;
  }
}

async function ensureUserProfile(user) {
  const profile = publicUser(user);
  await setDoc(doc(db, 'users', user.uid), {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  return profile;
}

async function propagateMemberProfile(profile) {
  const sources = await Promise.all([
    getDocs(query(collection(db, 'pairs'), where('memberUids', 'array-contains', profile.uid))),
    getDocs(query(collection(db, 'friendships'), where('memberUids', 'array-contains', profile.uid))),
  ]);
  const rows = sources.flatMap(snapshot => snapshot.docs)
    .filter(snapshot => snapshot.data().status === 'active');
  for (let start = 0; start < rows.length; start += 400) {
    const batch = writeBatch(db);
    let changed = 0;
    rows.slice(start, start + 400).forEach(snapshot => {
      const data = snapshot.data();
      const memberProfiles = Array.isArray(data.memberProfiles) && data.memberProfiles.length === 2
        ? data.memberProfiles.map(member => member.uid === profile.uid ? {
            ...member,
            name: profile.name,
          } : member)
        : [];
      if (!memberProfiles.some(member => member.uid === profile.uid)) return;
      batch.update(snapshot.ref, { memberProfiles, updatedAt: serverTimestamp() });
      changed += 1;
    });
    if (changed) await batch.commit();
  }
}

async function updateNickname(rawName) {
  const user = auth.currentUser;
  if (!user) throw new Error('로그인이 필요합니다.');
  const name = String(rawName || '').trim().slice(0, 24);
  if (!name) throw new Error('사용할 닉네임을 입력해주세요.');
  await updateProfile(user, { displayName: name });
  state.user = await ensureUserProfile(user);
  await propagateMemberProfile(state.user);
  emit();
  return state.user;
}

function startListeners(user) {
  stopListeners();
  const email = cleanEmail(user.email);
  unsubscribePairs = onSnapshot(
    query(collection(db, 'pairs'), where('memberUids', 'array-contains', user.uid)),
    snapshot => {
      pairRows = snapshot.docs.map(plainDoc);
      recomputeState();
    },
    error => {
      state.error = error.message;
      emit();
    },
  );
  unsubscribeIncoming = onSnapshot(
    query(collection(db, 'pairInvites'), where('toEmail', '==', email)),
    snapshot => {
      incomingRows = snapshot.docs.map(plainDoc);
      recomputeState();
    },
    error => {
      state.error = error.message;
      emit();
    },
  );
  unsubscribeOutgoing = onSnapshot(
    query(collection(db, 'pairInvites'), where('fromUid', '==', user.uid)),
    snapshot => {
      outgoingRows = snapshot.docs.map(plainDoc);
      recomputeState();
    },
    error => {
      state.error = error.message;
      emit();
    },
  );
  unsubscribeFriends = onSnapshot(
    query(collection(db, 'friendships'), where('memberUids', 'array-contains', user.uid)),
    snapshot => { friendRows = snapshot.docs.map(plainDoc); recomputeState(); },
    error => { state.error = error.message; emit(); },
  );
  unsubscribeFriendIncoming = onSnapshot(
    query(collection(db, 'friendInvites'), where('toEmail', '==', email)),
    snapshot => { friendIncomingRows = snapshot.docs.map(plainDoc); recomputeState(); },
    error => { state.error = error.message; emit(); },
  );
  unsubscribeFriendOutgoing = onSnapshot(
    query(collection(db, 'friendInvites'), where('fromUid', '==', user.uid)),
    snapshot => { friendOutgoingRows = snapshot.docs.map(plainDoc); recomputeState(); },
    error => { state.error = error.message; emit(); },
  );
  unsubscribeDirectLetters = onSnapshot(
    query(collection(db, 'directLetters'), where('memberUids', 'array-contains', user.uid)),
    snapshot => {
      const cutoff = Date.now() - DIRECT_LETTER_RETENTION_MS;
      const expired = snapshot.docs.filter(item => {
        const createdAt = timestampValue(item.data().createdAt);
        return createdAt > 0 && createdAt < cutoff;
      });
      directLetterRows = snapshot.docs.filter(item => !expired.includes(item)).map(item => {
        const row = plainDoc(item) || {};
        let photoDataUrl = '';
        try { if (row.photoBytes?.toBase64) photoDataUrl = `data:${row.photoMimeType || 'image/jpeg'};base64,${row.photoBytes.toBase64()}`; } catch {}
        return { ...row, transport: 'direct', photoDataUrl, createdAt: timestampValue(row.createdAt) };
      });
      recomputeState();
      if (expired.length) cleanupExpiredDirectLetters(expired).catch(error => console.warn('Expired letter cleanup failed', error));
    },
    error => { state.error = error.message; emit(); },
  );
}

function requireUser() {
  if (!auth.currentUser || !state.user) throw new Error('Google 로그인이 필요합니다.');
  return state.user;
}

function requirePaperTaskMember() {
  const user = requireUser();
  if (!PAPER_TASK_WORKSPACE_EMAILS.has(cleanEmail(user.email))) {
    throw new Error('PAPER · TASK 공동 작업공간에 접근할 수 없는 계정입니다.');
  }
  return user;
}

function paperTaskWorkspaceRef() {
  requirePaperTaskMember();
  return doc(db, 'sharedWorkspaces', PAPER_TASK_WORKSPACE_ID);
}

function pairScope() {
  const user = requireUser();
  return state.pair
    ? { kind: 'pair', id: state.pair.id, base: ['pairs', state.pair.id] }
    : { kind: 'user', id: user.uid, base: ['users', user.uid] };
}

function scopedDoc(section, id = 'main') {
  const scope = pairScope();
  return doc(db, ...scope.base, section, id);
}

async function login() {
  state.error = '';
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    return await signInWithPopup(auth, provider);
  } catch (error) {
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment', 'auth/web-storage-unsupported'].includes(error.code)) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    if (error?.code === 'auth/unauthorized-domain') {
      throw new Error('현재 주소가 Firebase 승인 도메인에 등록되지 않았습니다. Firebase Authentication의 승인된 도메인에 이 사이트 주소를 추가해주세요.');
    }
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('로그인 창이 닫혔습니다. 다시 로그인해주세요.');
    }
    throw error;
  }
}

async function logout() {
  googleDriveAccessToken = '';
  googleCalendarAccessToken = '';
  await signOut(auth);
}

function googleDriveProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/drive.file');
  provider.setCustomParameters({ prompt: 'consent' });
  return provider;
}

async function requestGoogleDriveAccess() {
  requireUser();
  const result = await reauthenticateWithPopup(auth.currentUser, googleDriveProvider());
  const credential = GoogleAuthProvider.credentialFromResult(result);
  googleDriveAccessToken = String(credential?.accessToken || '');
  if (!googleDriveAccessToken) throw new Error('Google Drive 연결 권한을 확인하지 못했습니다.');
  return true;
}

async function googleDriveFetch(url, options = {}, responseType = 'json') {
  if (!googleDriveAccessToken) await requestGoogleDriveAccess();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${googleDriveAccessToken}`);
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    if (response.status === 401) googleDriveAccessToken = '';
    if (response.status === 403 && /accessNotConfigured|SERVICE_DISABLED/i.test(body)) {
      throw new Error('Google Cloud에서 Google Drive API를 먼저 사용 설정해주세요.');
    }
    throw new Error(`Google Drive 백업 오류 (${response.status})`);
  }
  if (response.status === 204) return null;
  if (responseType === 'response') return response;
  if (responseType === 'text') return response.text();
  return response.json();
}

function googleCalendarProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
  provider.setCustomParameters({ prompt: 'consent' });
  return provider;
}

async function requestGoogleCalendarAccess() {
  requireUser();
  try {
    const result = await reauthenticateWithPopup(auth.currentUser, googleCalendarProvider());
    const credential = GoogleAuthProvider.credentialFromResult(result);
    googleCalendarAccessToken = String(credential?.accessToken || '');
    if (!googleCalendarAccessToken) throw new Error('Google Calendar 연결 권한을 확인하지 못했습니다.');
    return true;
  } catch (error) {
    if (error?.code === 'auth/popup-closed-by-user') {
      throw new Error('AiderLog 로그인은 완료되어 있습니다. Google Calendar 권한 연결만 취소되었습니다.');
    }
    if (error?.code === 'auth/unauthorized-domain') {
      throw new Error('AiderLog 로그인은 완료되어 있습니다. Google Calendar OAuth 승인 도메인 설정을 확인해주세요.');
    }
    throw error;
  }
}

async function googleCalendarFetch(url, options = {}) {
  if (!googleCalendarAccessToken) await requestGoogleCalendarAccess();
  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${googleCalendarAccessToken}`);
  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    if (response.status === 401) googleCalendarAccessToken = '';
    if (response.status === 403 && /accessNotConfigured|SERVICE_DISABLED/i.test(body)) {
      throw new Error('Google Cloud에서 Google Calendar API를 먼저 사용 설정해주세요.');
    }
    throw new Error(`Google Calendar 가져오기 오류 (${response.status})`);
  }
  return response.status === 204 ? null : response.json();
}

async function listGoogleCalendars() {
  const fields = 'items(id,summary,primary,accessRole,backgroundColor,foregroundColor)';
  const result = await googleCalendarFetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList?maxResults=250&fields=${encodeURIComponent(fields)}`);
  return Array.isArray(result?.items) ? result.items : [];
}

async function listGoogleCalendarEvents(calendarId, timeMin, timeMax) {
  const rows = [];
  let pageToken = '';
  do {
    const params = new URLSearchParams({
      singleEvents: 'true',
      orderBy: 'startTime',
      maxResults: '2500',
      timeMin,
      timeMax,
      fields: 'items(id,status,summary,description,start,end,updated,htmlLink),nextPageToken',
    });
    if (pageToken) params.set('pageToken', pageToken);
    const result = await googleCalendarFetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${params}`);
    rows.push(...(Array.isArray(result?.items) ? result.items.filter(item => item.status !== 'cancelled') : []));
    pageToken = String(result?.nextPageToken || '');
  } while (pageToken && rows.length < 750);
  return rows.slice(0, 750);
}

function driveQueryEscape(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

async function ensureGoogleDriveBackupFolder() {
  const q = "mimeType='application/vnd.google-apps.folder' and trashed=false and appProperties has { key='aiderlogBackup' and value='root' }";
  const result = await googleDriveFetch(`https://www.googleapis.com/drive/v3/files?spaces=drive&pageSize=10&fields=files(id,name)&q=${encodeURIComponent(q)}`);
  if (result.files?.[0]) return result.files[0];
  return googleDriveFetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'AiderLog Backups',
      mimeType: 'application/vnd.google-apps.folder',
      appProperties: { aiderlogBackup: 'root' },
    }),
  });
}

async function findGoogleDriveBackup(sourceId) {
  const safe = driveQueryEscape(sourceId);
  const q = `trashed=false and appProperties has { key='aiderlogSourceId' and value='${safe}' }`;
  const result = await googleDriveFetch(`https://www.googleapis.com/drive/v3/files?spaces=drive&pageSize=1&fields=files(id,name,size,mimeType)&q=${encodeURIComponent(q)}`);
  return result.files?.[0] || null;
}

async function uploadGoogleDriveBackupFile(folderId, sourceId, name, blob) {
  const existing = await findGoogleDriveBackup(sourceId);
  if (existing) return { ...existing, reused: true };
  const metadata = {
    name: String(name || 'AiderLog media').replace(/[\\/:*?"<>|]/g, '_').slice(0, 180),
    parents: [folderId],
    mimeType: blob.type || 'application/octet-stream',
    appProperties: { aiderlogBackup: 'media', aiderlogSourceId: String(sourceId) },
  };
  const start = await googleDriveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable&fields=id,name,size,mimeType', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-Upload-Content-Type': blob.type || 'application/octet-stream',
      'X-Upload-Content-Length': String(blob.size),
    },
    body: JSON.stringify(metadata),
  }, 'response');
  const uploadUrl = start.headers.get('Location');
  if (!uploadUrl) throw new Error('Google Drive 업로드 주소를 받지 못했습니다.');
  return googleDriveFetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': blob.type || 'application/octet-stream' },
    body: blob,
  });
}

async function uploadGoogleDriveBackupManifest(folderId, fileName, payload) {
  const boundary = `aiderlog_backup_${Date.now()}`;
  const metadata = JSON.stringify({
    name: fileName,
    parents: [folderId],
    mimeType: 'application/json',
    appProperties: { aiderlogBackup: 'manifest' },
  });
  const body = new Blob([
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${metadata}\r\n`,
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(payload, null, 2)}\r\n`,
    `--${boundary}--`,
  ], { type: `multipart/related; boundary=${boundary}` });
  return googleDriveFetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size', {
    method: 'POST',
    headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
    body,
  });
}

async function backupEventDataToGoogleDrive({ records = [], travel = [], media = [], exportedAt = '' } = {}) {
  requireUser();
  await requestGoogleDriveAccess();
  const folder = await ensureGoogleDriveBackupFolder();
  const mediaBackups = {};
  let uploaded = 0;
  for (const item of media) {
    const id = String(item?.id || '');
    if (!id || mediaBackups[id]) continue;
    const blob = await readMedia(id);
    const result = await uploadGoogleDriveBackupFile(folder.id, id, item.name || id, blob);
    mediaBackups[id] = { driveFileId: result.id, name: result.name, mimeType: result.mimeType || blob.type, size: Number(result.size || blob.size) };
    if (!result.reused) uploaded += 1;
  }
  const date = String(exportedAt || new Date().toISOString()).slice(0, 10);
  const manifest = await uploadGoogleDriveBackupManifest(folder.id, `AiderLog-Event-Backup-${date}.json`, {
    app: 'AiderLog',
    version: 1,
    exportedAt: exportedAt || new Date().toISOString(),
    records,
    travel,
    mediaBackups,
  });
  return { folderId: folder.id, manifestId: manifest.id, mediaCount: Object.keys(mediaBackups).length, uploaded };
}

async function backupPaperTaskDataToGoogleDrive({ paper = {}, task = {}, media = [], exportedAt = '' } = {}) {
  requireUser();
  await requestGoogleDriveAccess();
  const folder = await ensureGoogleDriveBackupFolder();
  const mediaBackups = {};
  let uploaded = 0;
  for (const item of media) {
    const id = String(item?.id || '');
    if (!id || mediaBackups[id]) continue;
    const blob = item?.storageScope === 'paper-task' ? await readPaperTaskMedia(id) : await readPrivateMedia(id);
    const result = await uploadGoogleDriveBackupFile(folder.id, `private:${id}`, item.name || id, blob);
    mediaBackups[id] = { driveFileId: result.id, name: result.name, mimeType: result.mimeType || blob.type, size: Number(result.size || blob.size) };
    if (!result.reused) uploaded += 1;
  }
  const date = String(exportedAt || new Date().toISOString()).slice(0, 10);
  const manifest = await uploadGoogleDriveBackupManifest(folder.id, `AiderLog-Paper-Task-Backup-${date}.json`, {
    app: 'AiderLog',
    version: 1,
    exportedAt: exportedAt || new Date().toISOString(),
    paper,
    task,
    mediaBackups,
  });
  return { folderId: folder.id, manifestId: manifest.id, mediaCount: Object.keys(mediaBackups).length, uploaded };
}

async function createInvite(rawEmail) {
  const user = requireUser();
  const toEmail = cleanEmail(rawEmail);
  if (!toEmail || !toEmail.includes('@')) throw new Error('상대의 Google 이메일을 정확히 입력해주세요.');
  if (toEmail === user.email) throw new Error('본인에게는 초대를 보낼 수 없습니다.');
  if (state.pair) throw new Error('이미 커플로 연결되어 있습니다.');
  if (state.outgoing.some(row => cleanEmail(row.toEmail) === toEmail && row.status === 'pending')) {
    throw new Error('이미 이 이메일로 보낸 초대가 있습니다.');
  }
  const ref = await addDoc(collection(db, 'pairInvites'), {
    fromUid: user.uid,
    fromEmail: user.email,
    fromName: user.name,
    fromPhotoURL: user.photoURL,
    toEmail,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

async function finalizeInvitePair(invite, user, updateInvite = true) {
  const inviteId = String(invite?.id || '');
  if (!inviteId || !invite?.fromUid) throw new Error('커플 요청 정보를 확인할 수 없습니다.');
  const pairRef = doc(db, 'pairs', inviteId);
  const memberUids = [invite.fromUid, user.uid];
  const batch = writeBatch(db);
  if (updateInvite) batch.update(doc(db, 'pairInvites', inviteId), {
    status: 'accepted',
    pairId: inviteId,
    updatedAt: serverTimestamp(),
  });
  batch.set(pairRef, {
    inviteId,
    status: 'active',
    memberUids,
    memberEmails: [cleanEmail(invite.fromEmail), user.email],
    memberProfiles: [
      {
        uid: invite.fromUid,
        email: cleanEmail(invite.fromEmail),
        name: String(invite.fromName || invite.fromEmail?.split('@')[0] || '상대'),
        photoURL: String(invite.fromPhotoURL || ''),
      },
      { ...user },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  memberUids.forEach(uid => batch.set(doc(db, 'pairMemberships', uid), {
    uid,
    pairId: inviteId,
    memberUids,
    status: 'active',
    createdAt: serverTimestamp(),
  }));
  try {
    await batch.commit();
  } catch (error) {
    if (error.code === 'permission-denied') {
      throw new Error('커플 연결을 완료할 수 없습니다. 나 또는 상대가 이미 다른 커플과 연결되어 있는지 확인해주세요.');
    }
    throw error;
  }
  return inviteId;
}

async function acceptInvite(inviteId) {
  const user = requireUser();
  if (state.pair) throw new Error('이미 커플로 연결되어 있습니다.');
  const invite = plainDoc(await getDoc(doc(db, 'pairInvites', inviteId)));
  if (!invite || invite.status !== 'pending') throw new Error('이미 처리되었거나 만료된 초대입니다.');
  if (cleanEmail(invite.toEmail) !== user.email) throw new Error('이 계정으로 받은 초대가 아닙니다.');
  return finalizeInvitePair(invite, user, true);
}

async function repairPairConnection() {
  if (repairPromise) return repairPromise;
  repairPromise = (async () => {
    const user = requireUser();
    const pairSnapshot = await getDocs(query(collection(db, 'pairs'), where('memberUids', 'array-contains', user.uid)));
    const visiblePairs = pairSnapshot.docs.map(plainDoc);
    const active = visiblePairs.find(row => row.status === 'active' && row.memberUids?.includes(user.uid));
    if (active) {
      pairRows = visiblePairs;
      recomputeState();
      return true;
    }
    const inviteSnapshot = await getDocs(query(collection(db, 'pairInvites'), where('toEmail', '==', user.email)));
    const accepted = inviteSnapshot.docs.map(plainDoc)
      .filter(row => row.status === 'accepted' && row.pairId === row.id)
      .sort((a, b) => timestampValue(b.updatedAt || b.createdAt) - timestampValue(a.updatedAt || a.createdAt));
    for (const invite of accepted) {
      const pair = plainDoc(await getDoc(doc(db, 'pairs', invite.id)));
      if (pair?.status === 'active' && pair.memberUids?.includes(user.uid)) {
        pairRows = [pair, ...visiblePairs.filter(row => row.id !== pair.id)];
        recomputeState();
        return true;
      }
      if (!pair) {
        await finalizeInvitePair(invite, user, false);
        return true;
      }
    }
    return false;
  })();
  try { return await repairPromise; } finally { repairPromise = null; }
}

async function rejectInvite(inviteId) {
  requireUser();
  await updateDoc(doc(db, 'pairInvites', inviteId), {
    status: 'rejected',
    updatedAt: serverTimestamp(),
  });
}

async function cancelInvite(inviteId) {
  requireUser();
  await updateDoc(doc(db, 'pairInvites', inviteId), {
    status: 'cancelled',
    updatedAt: serverTimestamp(),
  });
}

async function disconnectPair() {
  const user = requireUser();
  if (!state.pair) return;
  const batch = writeBatch(db);
  batch.update(doc(db, 'pairs', state.pair.id), {
    status: 'disconnected',
    disconnectedBy: user.uid,
    updatedAt: serverTimestamp(),
  });
  state.pair.memberUids.forEach(uid => batch.delete(doc(db, 'pairMemberships', uid)));
  await batch.commit();
}

async function createFriendInvite(rawEmail) {
  const user = requireUser();
  const toEmail = cleanEmail(rawEmail);
  if (!toEmail || !toEmail.includes('@')) throw new Error('친구의 Google 이메일을 정확히 입력해주세요.');
  if (toEmail === user.email) throw new Error('본인에게는 친구 요청을 보낼 수 없습니다.');
  if (state.friends.some(row => row.email === toEmail)) throw new Error('이미 친구로 연결되어 있습니다.');
  if (state.friendOutgoing.some(row => cleanEmail(row.toEmail) === toEmail && row.status === 'pending')) throw new Error('이미 보낸 친구 요청이 있습니다.');
  const ref = await addDoc(collection(db, 'friendInvites'), {
    fromUid: user.uid,
    fromEmail: user.email,
    fromName: user.name,
    fromPhotoURL: user.photoURL,
    toEmail,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

async function acceptFriendInvite(inviteId) {
  const user = requireUser();
  const invite = plainDoc(await getDoc(doc(db, 'friendInvites', inviteId)));
  if (!invite || invite.status !== 'pending') throw new Error('이미 처리되었거나 만료된 친구 요청입니다.');
  if (cleanEmail(invite.toEmail) !== user.email) throw new Error('이 계정으로 받은 친구 요청이 아닙니다.');
  const batch = writeBatch(db);
  batch.update(doc(db, 'friendInvites', inviteId), { status: 'accepted', friendshipId: inviteId, updatedAt: serverTimestamp() });
  batch.set(doc(db, 'friendships', inviteId), {
    inviteId,
    status: 'active',
    memberUids: [invite.fromUid, user.uid],
    memberEmails: [cleanEmail(invite.fromEmail), user.email],
    memberProfiles: [
      { uid: invite.fromUid, email: cleanEmail(invite.fromEmail), name: String(invite.fromName || invite.fromEmail?.split('@')[0] || '친구'), photoURL: String(invite.fromPhotoURL || '') },
      { ...user },
    ],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  await batch.commit();
  return inviteId;
}

async function rejectFriendInvite(inviteId) {
  requireUser();
  await updateDoc(doc(db, 'friendInvites', inviteId), { status: 'rejected', updatedAt: serverTimestamp() });
}

async function cancelFriendInvite(inviteId) {
  requireUser();
  await updateDoc(doc(db, 'friendInvites', inviteId), { status: 'cancelled', updatedAt: serverTimestamp() });
}

async function removeFriend(friendshipId) {
  const user = requireUser();
  const row = plainDoc(await getDoc(doc(db, 'friendships', friendshipId)));
  if (!row?.memberUids?.includes(user.uid)) throw new Error('친구 연결을 확인할 수 없습니다.');
  await deleteDoc(doc(db, 'friendships', friendshipId));
}

function directPhotoPayload(dataUrl) {
  const match = String(dataUrl || '').match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return {};
  if (match[2].length > 680000) throw new Error('사진 용량이 큽니다. 다른 사진을 선택해주세요.');
  return { photoMimeType: match[1], photoBytes: Bytes.fromBase64String(match[2]) };
}

async function sendDirectLetter({ toUid, toEmail, toName, body, photoDataUrl = '' } = {}) {
  const user = requireUser();
  const friend = state.friends.find(row => row.uid === toUid && row.email === cleanEmail(toEmail));
  const partner = state.partner?.uid === toUid && state.partner?.email === cleanEmail(toEmail);
  if (!friend && !partner) throw new Error('연결된 커플 또는 친구에게만 편지를 보낼 수 있습니다.');
  const text = String(body || '').trim().slice(0, 220);
  if (!text) throw new Error('편지 내용을 입력해주세요.');
  const payload = {
    fromUid: user.uid,
    fromEmail: user.email,
    fromName: user.name,
    toUid: String(toUid),
    toEmail: cleanEmail(toEmail),
    toName: String(toName || toEmail?.split('@')[0] || '받는 사람').slice(0, 80),
    memberUids: [user.uid, String(toUid)],
    connectionType: friend ? 'friend' : 'pair',
    connectionId: friend ? friend.friendshipId : state.pair?.id,
    body: text,
    readBy: [user.uid],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...directPhotoPayload(photoDataUrl),
  };
  return (await addDoc(collection(db, 'directLetters'), payload)).id;
}

async function markDirectLetterRead(letterId) {
  const user = requireUser();
  const ref = doc(db, 'directLetters', letterId);
  const row = plainDoc(await getDoc(ref));
  if (!row || row.toUid !== user.uid) return;
  const readBy = Array.isArray(row.readBy) ? row.readBy : [];
  if (readBy.includes(user.uid)) return;
  await updateDoc(ref, { readBy: [...readBy, user.uid], updatedAt: serverTimestamp() });
}

async function readAppData() {
  const snapshot = await getDoc(scopedDoc('app'));
  return snapshot.exists() ? snapshot.data().payload || null : null;
}

const copyJson = value => JSON.parse(JSON.stringify(value ?? null));

function eventPairKey() {
  const emails = (Array.isArray(state.pair?.memberEmails) ? state.pair.memberEmails : [])
    .map(cleanEmail)
    .filter(Boolean)
    .sort();
  return emails.join('::');
}

function mergeEventRows(currentRows, soloRows, ownerField, pairKey) {
  const rows = new Map();
  const add = (row, fromSolo = false) => {
    if (!row?.id) return;
    const next = copyJson(row);
    if (fromSolo) {
      next[ownerField] = cleanEmail(next[ownerField] || state.user?.email);
      next.pairKey = pairKey;
    }
    const previous = rows.get(String(next.id));
    const previousTime = Number(previous?.updatedAt || previous?.createdAt || 0);
    const nextTime = Number(next.updatedAt || next.createdAt || 0);
    if (!previous || nextTime >= previousTime) rows.set(String(next.id), next);
  };
  (Array.isArray(currentRows) ? currentRows : []).forEach(row => add(row));
  (Array.isArray(soloRows) ? soloRows : []).forEach(row => add(row, true));
  return [...rows.values()];
}

function mergeEventFolders(currentFolders, soloFolders) {
  const folders = new Map();
  [...(Array.isArray(currentFolders) ? currentFolders : []), ...(Array.isArray(soloFolders) ? soloFolders : [])]
    .forEach(folder => {
      if (!folder?.id) return;
      const previous = folders.get(String(folder.id));
      if (!previous || Number(folder.createdAt || 0) >= Number(previous.createdAt || 0)) {
        folders.set(String(folder.id), copyJson(folder));
      }
    });
  return [...folders.values()];
}

function mergeSoloEventPayload(sharedPayload, soloPayload) {
  const shared = copyJson(sharedPayload || {}) || {};
  const solo = copyJson(soloPayload || {}) || {};
  const pairKey = eventPairKey();
  const soloKey = `solo:${cleanEmail(state.user?.email)}`;
  shared.records = mergeEventRows(shared.records, solo.records, 'authorEmail', pairKey);
  shared.eventReviews = mergeEventRows(shared.eventReviews, solo.eventReviews, 'authorEmail', pairKey);
  shared.bucketItems = mergeEventRows(shared.bucketItems, solo.bucketItems, 'createdBy', pairKey);
  shared.albumsBySpace = shared.albumsBySpace && typeof shared.albumsBySpace === 'object' ? shared.albumsBySpace : {};
  shared.travelFoldersBySpace = shared.travelFoldersBySpace && typeof shared.travelFoldersBySpace === 'object' ? shared.travelFoldersBySpace : {};
  const soloAlbums = solo.albumsBySpace?.[soloKey] || (Array.isArray(solo.albums) ? solo.albums : []);
  const soloTrips = solo.travelFoldersBySpace?.[soloKey] || [];
  shared.albumsBySpace[pairKey] = mergeEventFolders(shared.albumsBySpace[pairKey], soloAlbums);
  shared.travelFoldersBySpace[pairKey] = mergeEventFolders(shared.travelFoldersBySpace[pairKey], soloTrips);
  shared.eventMigrationByUid = shared.eventMigrationByUid && typeof shared.eventMigrationByUid === 'object' ? shared.eventMigrationByUid : {};
  shared.eventMigrationByUid[state.user.uid] = Date.now();
  return shared;
}

function eventMediaIds(payload) {
  const ids = new Set();
  (Array.isArray(payload?.records) ? payload.records : []).forEach(row => {
    (Array.isArray(row?.media) ? row.media : []).forEach(item => {
      const id = String(item?.fileId || item?.key || '');
      if (id) ids.add(id);
    });
  });
  (Array.isArray(payload?.eventReviews) ? payload.eventReviews : []).forEach(row => {
    const id = String(row?.media?.fileId || '');
    if (id) ids.add(id);
  });
  (Array.isArray(payload?.bucketItems) ? payload.bucketItems : []).forEach(row => {
    const id = String(row?.photo?.fileId || '');
    if (id) ids.add(id);
  });
  return [...ids];
}

async function copyOwnEventMediaToPair(mediaId) {
  const user = requireUser();
  if (!state.pair || !mediaId) return;
  const sourceRef = doc(db, 'users', user.uid, 'media', mediaId);
  const targetRef = doc(db, 'pairs', state.pair.id, 'media', mediaId);
  if ((await getDoc(targetRef)).exists()) return;
  const sourceSnapshot = await getDoc(sourceRef);
  if (!sourceSnapshot.exists()) return;
  const chunks = await getDocs(collection(sourceRef, 'chunks'));
  for (let start = 0; start < chunks.docs.length; start += 400) {
    const batch = writeBatch(db);
    chunks.docs.slice(start, start + 400).forEach(item => {
      batch.set(doc(targetRef, 'chunks', item.id), item.data());
    });
    await batch.commit();
  }
  await setDoc(targetRef, {
    ...sourceSnapshot.data(),
    migratedFromUid: user.uid,
    migratedAt: serverTimestamp(),
  });
}

async function migrateEventWorkspace() {
  const user = requireUser();
  if (!state.pair) return readAppData();
  const soloRef = doc(db, 'users', user.uid, 'app', 'main');
  const pairRef = doc(db, 'pairs', state.pair.id, 'app', 'main');
  const [soloSnapshot, pairSnapshot] = await Promise.all([getDoc(soloRef), getDoc(pairRef)]);
  const soloPayload = soloSnapshot.exists() ? soloSnapshot.data().payload || {} : {};
  let pairPayload = pairSnapshot.exists() ? pairSnapshot.data().payload || {} : {};
  if (!pairPayload.eventMigrationByUid?.[user.uid]) {
    pairPayload = await runTransaction(db, async transaction => {
      const currentPairSnapshot = await transaction.get(pairRef);
      const currentPairPayload = currentPairSnapshot.exists() ? currentPairSnapshot.data().payload || {} : {};
      if (currentPairPayload.eventMigrationByUid?.[user.uid]) return currentPairPayload;
      const merged = mergeSoloEventPayload(currentPairPayload, soloPayload);
      transaction.set(pairRef, {
        payload: merged,
        updatedAt: serverTimestamp(),
        updatedBy: user.uid,
      });
      return merged;
    });
  }
  if (!pairPayload.eventMediaMigrationByUid?.[user.uid]) {
    let complete = true;
    for (const mediaId of eventMediaIds(soloPayload)) {
      try { await copyOwnEventMediaToPair(mediaId); }
      catch (error) { complete = false; console.warn('EVENT media migration skipped', mediaId, error); }
    }
    if (complete) {
      pairPayload = await runTransaction(db, async transaction => {
        const currentPairSnapshot = await transaction.get(pairRef);
        const current = currentPairSnapshot.exists() ? currentPairSnapshot.data().payload || {} : {};
        current.eventMediaMigrationByUid = current.eventMediaMigrationByUid && typeof current.eventMediaMigrationByUid === 'object' ? current.eventMediaMigrationByUid : {};
        current.eventMediaMigrationByUid[user.uid] = Date.now();
        transaction.set(pairRef, { payload: current, updatedAt: serverTimestamp(), updatedBy: user.uid });
        return current;
      });
    }
  }
  return pairPayload;
}

async function writeAppData(payload) {
  const user = requireUser();
  await setDoc(scopedDoc('app'), {
    payload: JSON.parse(JSON.stringify(payload)),
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  });
}

function ownScheduleRef() {
  const user = requireUser();
  return doc(db, 'users', user.uid, 'schedule', 'main');
}

function pairScheduleRef(uid) {
  requireUser();
  if (!state.pair) return null;
  return doc(db, 'pairs', state.pair.id, 'schedules', String(uid));
}

function cleanScheduleRows(rows, ownerUid = '') {
  const user = requireUser();
  const email = cleanEmail(user.email);
  return (Array.isArray(rows) ? rows : [])
    .filter(row => row && row.id && row.authorEmail && cleanEmail(row.authorEmail) === email)
    .map(row => ({
      ...JSON.parse(JSON.stringify(row)),
      authorEmail: email,
      authorUid: String(ownerUid || user.uid),
      owner: row.owner === 'shared' ? 'shared' : 'mine',
      pairKey: row.owner === 'shared' && state.pair ? state.pair.id : '',
    }))
    .slice(-1200);
}

async function readScheduleData() {
  const user = requireUser();
  const ownSnapshot = await getDoc(ownScheduleRef());
  const own = ownSnapshot.exists() ? ownSnapshot.data().payload || [] : [];
  let shared = [];
  if (state.pair && state.partner?.uid) {
    const partnerSnapshot = await getDoc(pairScheduleRef(state.partner.uid));
    shared = partnerSnapshot.exists() ? partnerSnapshot.data().payload || [] : [];
  }
  return {
    own: Array.isArray(own) ? own : [],
    shared: Array.isArray(shared) ? shared : [],
  };
}

async function writeScheduleData(rows) {
  const user = requireUser();
  const own = cleanScheduleRows(rows, user.uid);
  const writes = [setDoc(ownScheduleRef(), {
    payload: own,
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  })];
  const pairRef = pairScheduleRef(user.uid);
  if (pairRef) {
    const shared = own.filter(row => row.owner === 'shared' && !row.externalSource);
    writes.push(setDoc(pairRef, {
      payload: shared,
      ownerUid: user.uid,
      ownerEmail: user.email,
      updatedAt: serverTimestamp(),
    }));
  }
  await Promise.all(writes);
}

function watchScheduleData(callback) {
  const user = requireUser();
  try { unsubscribeOwnSchedule?.(); } catch {}
  try { unsubscribePartnerSchedule?.(); } catch {}
  let own = [];
  let shared = [];
  let ownReady = false;
  let sharedReady = !state.pair || !state.partner?.uid;
  const emitRows = () => {
    if (ownReady && sharedReady) callback({ own: [...own], shared: [...shared] });
  };
  unsubscribeOwnSchedule = onSnapshot(
    ownScheduleRef(),
    snapshot => {
      own = snapshot.exists() && Array.isArray(snapshot.data().payload) ? snapshot.data().payload : [];
      ownReady = true;
      emitRows();
    },
    error => console.warn('Private schedule listener stopped', error),
  );
  if (state.pair && state.partner?.uid) {
    unsubscribePartnerSchedule = onSnapshot(
      pairScheduleRef(state.partner.uid),
      snapshot => {
        shared = snapshot.exists() && Array.isArray(snapshot.data().payload) ? snapshot.data().payload : [];
        sharedReady = true;
        emitRows();
      },
      error => console.warn('Shared schedule listener stopped', error),
    );
  } else {
    unsubscribePartnerSchedule = null;
    emitRows();
  }
  return () => {
    try { unsubscribeOwnSchedule?.(); } catch {}
    try { unsubscribePartnerSchedule?.(); } catch {}
    unsubscribeOwnSchedule = unsubscribePartnerSchedule = null;
  };
}

async function getFirebaseIdToken(forceRefresh = false) {
  requireUser();
  return auth.currentUser.getIdToken(Boolean(forceRefresh));
}

async function readPrivateData() {
  const user = requireUser();
  const snapshot = await getDoc(doc(db, 'users', user.uid, 'private', 'main'));
  return snapshot.exists() ? snapshot.data().payload || null : null;
}

async function writePrivateData(payload) {
  const user = requireUser();
  await setDoc(doc(db, 'users', user.uid, 'private', 'main'), {
    payload: JSON.parse(JSON.stringify(payload)),
    updatedAt: serverTimestamp(),
  });
}

async function readPaperTaskData() {
  const snapshot = await getDoc(paperTaskWorkspaceRef());
  return snapshot.exists() ? snapshot.data().payload || null : null;
}

async function writePaperTaskData(payload) {
  const user = requirePaperTaskMember();
  await setDoc(paperTaskWorkspaceRef(), {
    payload: JSON.parse(JSON.stringify(payload || {})),
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
    updatedByEmail: user.email,
  });
}

function watchPaperTaskData(callback) {
  paperTaskWorkspaceRef();
  return onSnapshot(
    doc(db, 'sharedWorkspaces', PAPER_TASK_WORKSPACE_ID),
    snapshot => callback(snapshot.exists() ? snapshot.data().payload || null : null),
    error => console.warn('PAPER · TASK workspace listener stopped', error),
  );
}

function emotionRef(uid) {
  const user = requireUser();
  if (state.pair) return doc(db, 'pairs', state.pair.id, 'emotions', uid);
  if (uid !== user.uid) throw new Error('개인 모드에서는 본인의 감정 기록만 볼 수 있습니다.');
  return doc(db, 'users', user.uid, 'emotion', 'main');
}

async function readEmotionData(uid) {
  const snapshot = await getDoc(emotionRef(uid));
  return snapshot.exists() ? snapshot.data().payload || null : null;
}

async function writeEmotionData(payload) {
  const user = requireUser();
  const safePayload = JSON.parse(JSON.stringify(payload));
  const ownSoloRef = doc(db, 'users', user.uid, 'emotion', 'main');
  const ownPairRef = emotionRef(user.uid);
  const writes = [setDoc(ownSoloRef, { payload: safePayload, updatedAt: serverTimestamp() })];
  if (ownPairRef.path !== ownSoloRef.path) {
    writes.push(setDoc(ownPairRef, { payload: safePayload, updatedAt: serverTimestamp() }));
  }
  await Promise.all(writes);
}

function mediaCollection() {
  const scope = pairScope();
  return collection(db, ...scope.base, 'media');
}

function mediaRef(mediaId) {
  const scope = pairScope();
  return doc(db, ...scope.base, 'media', mediaId);
}

async function compressImage(file) {
  if (!String(file.type || '').startsWith('image/') || file.type === 'image/gif') return file;
  const bitmap = await createImageBitmap(file);
  const maxSide = 1600;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext('2d', { alpha: false }).drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();
  const blob = await new Promise((resolve, reject) => canvas.toBlob(
    value => value ? resolve(value) : reject(new Error('사진을 변환하지 못했습니다.')),
    'image/jpeg',
    0.82,
  ));
  return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
}

async function videoDurationSeconds(file) {
  if (!String(file?.type || '').startsWith('video/')) return 0;
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const timer = setTimeout(() => reject(new Error('영상 재생 시간을 확인하지 못했습니다.')), 15000);
      video.preload = 'metadata';
      video.onloadedmetadata = () => { clearTimeout(timer); resolve(Number(video.duration) || 0); };
      video.onerror = () => { clearTimeout(timer); reject(new Error('영상 정보를 읽지 못했습니다.')); };
      video.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function uploadMedia(originalFile, label = 'media') {
  requireUser();
  const file = await compressImage(originalFile);
  const isVideo = String(file.type || '').startsWith('video/');
  if (isVideo) {
    const duration = await videoDurationSeconds(file);
    if (duration > 310) throw new Error('영상은 5분 이내로 선택해주세요.');
    if (file.size > 120 * 1024 * 1024) throw new Error('5분 영상은 120MB 이하로 선택해주세요. 화질을 낮추면 더 오래 보관할 수 있습니다.');
  } else if (file.size > 25 * 1024 * 1024) {
    throw new Error('무료 저장공간 보호를 위해 사진은 25MB 이하만 올릴 수 있습니다.');
  }
  const mediaId = `m-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const ref = mediaRef(mediaId);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 700 * 1024;
  const chunkCount = Math.ceil(bytes.length / chunkSize);
  const chunks = collection(ref, 'chunks');
  let batch = writeBatch(db);
  let operations = 0;
  for (let index = 0; index < chunkCount; index += 1) {
    const start = index * chunkSize;
    const end = Math.min(bytes.length, start + chunkSize);
    batch.set(doc(chunks, String(index).padStart(5, '0')), {
      data: Bytes.fromUint8Array(bytes.slice(start, end)),
    });
    operations += 1;
    if (operations === 400) {
      await batch.commit();
      batch = writeBatch(db);
      operations = 0;
    }
  }
  if (operations) await batch.commit();
  await setDoc(ref, {
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    chunkCount,
    label,
    createdAt: serverTimestamp(),
    createdBy: state.user.uid,
  });
  return { id: mediaId, name: file.name, mimeType: file.type, size: file.size };
}

async function readMedia(mediaId) {
  requireUser();
  const ref = mediaRef(mediaId);
  const metaSnapshot = await getDoc(ref);
  if (!metaSnapshot.exists()) throw new Error('미디어 파일을 찾을 수 없습니다.');
  const meta = metaSnapshot.data();
  const chunkSnapshot = await getDocs(collection(ref, 'chunks'));
  const parts = chunkSnapshot.docs.sort((a, b) => a.id.localeCompare(b.id)).map(item => item.data().data.toUint8Array());
  return new Blob(parts, { type: meta.type || 'application/octet-stream' });
}

async function deleteMedia(mediaId) {
  if (!mediaId) return;
  requireUser();
  const ref = mediaRef(mediaId);
  const chunkSnapshot = await getDocs(query(collection(ref, 'chunks'), limit(500)));
  const batch = writeBatch(db);
  chunkSnapshot.docs.forEach(item => batch.delete(item.ref));
  batch.delete(ref);
  await batch.commit();
}

const EPHEMERAL_MEDIA_TTL_MS = 24 * 60 * 60 * 1000;

function ephemeralMediaRef(mediaId) {
  return doc(db, 'ephemeralMedia', mediaId);
}

function connectedRecipientUids() {
  const rows = [];
  if (state.partner?.uid) rows.push(state.partner.uid);
  state.friends.forEach(friend => { if (friend?.uid) rows.push(friend.uid); });
  return new Set(rows);
}

async function uploadEphemeralMedia(originalFile, recipientUids = []) {
  const user = requireUser();
  const allowed = connectedRecipientUids();
  const recipients = [...new Set((recipientUids || []).map(String))].filter(uid => allowed.has(uid));
  if (!recipients.length) throw new Error('공유할 커플 또는 친구를 선택해주세요.');
  const file = await compressImage(originalFile);
  const isVideo = String(file.type || '').startsWith('video/');
  if (!(isVideo || String(file.type || '').startsWith('image/'))) throw new Error('사진 또는 동영상만 올릴 수 있습니다.');
  if (isVideo) {
    const duration = await videoDurationSeconds(file);
    if (duration > 310) throw new Error('영상은 5분 이내로 선택해주세요.');
    if (file.size > 120 * 1024 * 1024) throw new Error('영상은 120MB 이하로 선택해주세요.');
  } else if (file.size > 25 * 1024 * 1024) {
    throw new Error('사진은 25MB 이하로 선택해주세요.');
  }
  const mediaId = `em-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const ref = ephemeralMediaRef(mediaId);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 700 * 1024;
  const chunkCount = Math.ceil(bytes.length / chunkSize);
  const expiresAt = Timestamp.fromMillis(Date.now() + EPHEMERAL_MEDIA_TTL_MS);
  await setDoc(ref, {
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    chunkCount,
    createdByUid: user.uid,
    createdByEmail: user.email,
    createdByName: user.name,
    recipientUids: recipients,
    memberUids: [user.uid, ...recipients],
    createdAt: serverTimestamp(),
    expiresAt,
    ready: false,
  });
  try {
    const chunks = collection(ref, 'chunks');
    let batch = writeBatch(db);
    let operations = 0;
    for (let index = 0; index < chunkCount; index += 1) {
      const start = index * chunkSize;
      const end = Math.min(bytes.length, start + chunkSize);
      batch.set(doc(chunks, String(index).padStart(5, '0')), { data: Bytes.fromUint8Array(bytes.slice(start, end)) });
      operations += 1;
      if (operations === 400) {
        await batch.commit();
        batch = writeBatch(db);
        operations = 0;
      }
    }
    if (operations) await batch.commit();
    await updateDoc(ref, { ready: true });
  } catch (error) {
    await deleteEphemeralMedia(mediaId).catch(() => {});
    throw error;
  }
  return { id: mediaId, name: file.name, mimeType: file.type, size: file.size, expiresAt: expiresAt.toMillis() };
}

async function readEphemeralMedia(mediaId) {
  requireUser();
  const ref = ephemeralMediaRef(mediaId);
  const metaSnapshot = await getDoc(ref);
  if (!metaSnapshot.exists()) throw new Error('공유 미디어를 찾을 수 없습니다.');
  const meta = metaSnapshot.data();
  if (!meta.memberUids?.includes(state.user.uid)) throw new Error('이 미디어를 볼 권한이 없습니다.');
  if (timestampValue(meta.expiresAt) <= Date.now()) throw new Error('24시간이 지나 사라진 미디어입니다.');
  const chunkSnapshot = await getDocs(collection(ref, 'chunks'));
  const parts = chunkSnapshot.docs.sort((a, b) => a.id.localeCompare(b.id)).map(item => item.data().data.toUint8Array());
  return new Blob(parts, { type: meta.type || 'application/octet-stream' });
}

async function deleteEphemeralMedia(mediaId) {
  if (!mediaId) return;
  const user = requireUser();
  const ref = ephemeralMediaRef(mediaId);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return;
  if (snapshot.data().createdByUid !== user.uid) throw new Error('올린 사람만 모두에게서 삭제할 수 있습니다.');
  const chunks = await getDocs(query(collection(ref, 'chunks'), limit(500)));
  const batch = writeBatch(db);
  chunks.docs.forEach(item => batch.delete(item.ref));
  batch.delete(ref);
  await batch.commit();
}

function watchEphemeralMedia(callback) {
  const user = requireUser();
  return onSnapshot(
    query(collection(db, 'ephemeralMedia'), where('memberUids', 'array-contains', user.uid)),
    snapshot => {
      const now = Date.now();
      const expiredOwned = [];
      const rows = snapshot.docs.map(item => {
        const row = plainDoc(item) || {};
        return { ...row, createdAt: timestampValue(row.createdAt), expiresAt: timestampValue(row.expiresAt) };
      }).filter(row => {
        const expired = row.expiresAt > 0 && row.expiresAt <= now;
        if (expired && row.createdByUid === user.uid) expiredOwned.push(row.id);
        return row.ready && !expired;
      }).sort((a, b) => b.createdAt - a.createdAt);
      callback(rows);
      expiredOwned.forEach(id => deleteEphemeralMedia(id).catch(() => {}));
    },
    error => console.warn('24-hour media listener stopped', error),
  );
}

function privateMediaRef(mediaId) {
  const user = requireUser();
  return doc(db, 'users', user.uid, 'privateMedia', mediaId);
}

async function uploadPrivateMedia(originalFile, label = 'personal') {
  requireUser();
  const file = await compressImage(originalFile);
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) throw new Error('무료 저장공간 보호를 위해 파일은 25MB 이하만 올릴 수 있습니다.');
  const mediaId = `pm-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const ref = privateMediaRef(mediaId);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 700 * 1024;
  const chunkCount = Math.ceil(bytes.length / chunkSize);
  const chunks = collection(ref, 'chunks');
  let batch = writeBatch(db);
  let operations = 0;
  for (let index = 0; index < chunkCount; index += 1) {
    const start = index * chunkSize;
    const end = Math.min(bytes.length, start + chunkSize);
    batch.set(doc(chunks, String(index).padStart(5, '0')), { data: Bytes.fromUint8Array(bytes.slice(start, end)) });
    operations += 1;
    if (operations === 400) {
      await batch.commit();
      batch = writeBatch(db);
      operations = 0;
    }
  }
  if (operations) await batch.commit();
  await setDoc(ref, {
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    chunkCount,
    label,
    createdAt: serverTimestamp(),
    createdBy: state.user.uid,
  });
  return { id: mediaId, name: file.name, mimeType: file.type, size: file.size };
}

async function readPrivateMedia(mediaId) {
  const ref = privateMediaRef(mediaId);
  const metaSnapshot = await getDoc(ref);
  if (!metaSnapshot.exists()) throw new Error('개인 사진을 찾을 수 없습니다.');
  const meta = metaSnapshot.data();
  const chunkSnapshot = await getDocs(collection(ref, 'chunks'));
  const parts = chunkSnapshot.docs.sort((a, b) => a.id.localeCompare(b.id)).map(item => item.data().data.toUint8Array());
  return new Blob(parts, { type: meta.type || 'application/octet-stream' });
}

async function deletePrivateMedia(mediaId) {
  if (!mediaId) return;
  const ref = privateMediaRef(mediaId);
  const chunkSnapshot = await getDocs(query(collection(ref, 'chunks'), limit(500)));
  const batch = writeBatch(db);
  chunkSnapshot.docs.forEach(item => batch.delete(item.ref));
  batch.delete(ref);
  await batch.commit();
}

function paperTaskMediaRef(mediaId) {
  requirePaperTaskMember();
  return doc(db, 'sharedWorkspaces', PAPER_TASK_WORKSPACE_ID, 'media', mediaId);
}

async function uploadPaperTaskMedia(originalFile, label = 'consulting-client-file') {
  const user = requirePaperTaskMember();
  const file = await compressImage(originalFile);
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) throw new Error('공동 작업공간 파일은 25MB 이하만 올릴 수 있습니다.');
  const mediaId = `ptm-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const ref = paperTaskMediaRef(mediaId);
  const bytes = new Uint8Array(await file.arrayBuffer());
  const chunkSize = 700 * 1024;
  const chunkCount = Math.ceil(bytes.length / chunkSize);
  const chunks = collection(ref, 'chunks');
  let batch = writeBatch(db);
  let operations = 0;
  for (let index = 0; index < chunkCount; index += 1) {
    const start = index * chunkSize;
    const end = Math.min(bytes.length, start + chunkSize);
    batch.set(doc(chunks, String(index).padStart(5, '0')), { data: Bytes.fromUint8Array(bytes.slice(start, end)) });
    operations += 1;
    if (operations === 400) {
      await batch.commit();
      batch = writeBatch(db);
      operations = 0;
    }
  }
  if (operations) await batch.commit();
  await setDoc(ref, {
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    chunkCount,
    label,
    createdAt: serverTimestamp(),
    createdBy: user.uid,
    createdByEmail: user.email,
  });
  return { id: mediaId, name: file.name, mimeType: file.type, size: file.size };
}

async function readPaperTaskMedia(mediaId) {
  const ref = paperTaskMediaRef(mediaId);
  const metaSnapshot = await getDoc(ref);
  if (!metaSnapshot.exists()) throw new Error('공동 작업공간 파일을 찾을 수 없습니다.');
  const meta = metaSnapshot.data();
  const chunkSnapshot = await getDocs(collection(ref, 'chunks'));
  const parts = chunkSnapshot.docs.sort((a, b) => a.id.localeCompare(b.id)).map(item => item.data().data.toUint8Array());
  return new Blob(parts, { type: meta.type || 'application/octet-stream' });
}

async function deletePaperTaskMedia(mediaId) {
  if (!mediaId) return;
  const ref = paperTaskMediaRef(mediaId);
  const chunkSnapshot = await getDocs(query(collection(ref, 'chunks'), limit(500)));
  const batch = writeBatch(db);
  chunkSnapshot.docs.forEach(item => batch.delete(item.ref));
  batch.delete(ref);
  await batch.commit();
}

const CLIENT_INTAKE_TOKEN = /^[A-Za-z0-9_-]{32,100}$/;
const intakeText = (value, max) => String(value || '').trim().slice(0, max);

function randomClientIntakeToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function clientIntakeRef(token) {
  if (!CLIENT_INTAKE_TOKEN.test(String(token || ''))) throw new Error('고객 작성 링크 형식이 올바르지 않습니다.');
  return doc(db, 'clientIntakeLinks', String(token));
}

async function createClientIntakeLink(preferredToken = '', previousToken = '') {
  const user = requireUser();
  let token = CLIENT_INTAKE_TOKEN.test(String(preferredToken || '')) ? String(preferredToken) : '';
  const activePayload = {
    ownerUid: user.uid,
    ownerName: intakeText(user.name, 80),
    active: true,
    updatedAt: serverTimestamp(),
  };
  if (token) {
    try {
      await setDoc(clientIntakeRef(token), activePayload, { merge: true });
      return token;
    } catch {
      try {
        await setDoc(clientIntakeRef(token), { ...activePayload, createdAt: serverTimestamp() });
        return token;
      } catch {
        token = '';
      }
    }
  }
  if (previousToken && previousToken !== token && CLIENT_INTAKE_TOKEN.test(String(previousToken))) {
    await updateDoc(clientIntakeRef(previousToken), { active: false, updatedAt: serverTimestamp() }).catch(() => {});
  }
  token = randomClientIntakeToken();
  await setDoc(clientIntakeRef(token), { ...activePayload, createdAt: serverTimestamp() });
  return token;
}

async function getClientIntakeLink(token) {
  const snapshot = await getDoc(clientIntakeRef(token));
  if (!snapshot.exists()) throw new Error('존재하지 않는 고객 작성 링크입니다.');
  const row = snapshot.data();
  return { active: row.active === true, ownerName: intakeText(row.ownerName, 80) };
}

async function submitClientIntake(token, payload = {}) {
  const applicationYear = Math.max(2000, Math.min(2200, Number(payload.applicationYear) || 0));
  const applicationSemester = ['spring', 'fall', 'rolling', 'other'].includes(payload.applicationSemester)
    ? payload.applicationSemester
    : '';
  const data = {
    name: intakeText(payload.name, 60),
    phone: intakeText(payload.phone, 30),
    email: intakeText(payload.email, 120),
    birthYear: Math.max(0, Math.min(2200, Number(payload.birthYear) || 0)),
    gender: ['female', 'male'].includes(payload.gender) ? payload.gender : '',
    currentSchool: intakeText(payload.currentSchool, 120),
    currentMajor: intakeText(payload.currentMajor, 120),
    targetUniversity: intakeText(payload.targetUniversity, 120),
    targetMajor: intakeText(payload.targetMajor, 120),
    applicationYear,
    applicationSemester,
    topic: intakeText(payload.topic, 1200),
    languageSpec: intakeText(payload.languageSpec, 1200),
    certifications: intakeText(payload.certifications, 1200),
    activities: intakeText(payload.activities, 1600),
    researchExperience: intakeText(payload.researchExperience, 1600),
    inquiry: intakeText(payload.inquiry, 2000),
    note: intakeText(payload.note, 6000),
    consent: true,
    source: 'external-intake-v2',
    status: 'new',
    createdAt: serverTimestamp(),
  };
  if (!data.name || !data.phone || !applicationYear || !applicationSemester) {
    throw new Error('이름, 연락처, 진학 희망 학년도와 학기를 모두 입력해주세요.');
  }
  const link = await getDoc(clientIntakeRef(token));
  if (!link.exists() || link.data().active !== true) throw new Error('만료되었거나 교체된 작성 링크입니다.');
  const ref = await addDoc(collection(clientIntakeRef(token), 'submissions'), data);
  return ref.id;
}

function watchClientIntakeSubmissions(token, callback) {
  const user = requireUser();
  const ref = clientIntakeRef(token);
  return onSnapshot(
    query(collection(ref, 'submissions'), where('status', '==', 'new'), limit(100)),
    snapshot => callback(snapshot.docs.map(item => ({
      id: item.id,
      ...item.data(),
      createdAt: timestampValue(item.data().createdAt),
    }))),
    error => console.warn('Client intake listener stopped', error),
  );
}

async function markClientIntakeImported(token, submissionId) {
  requireUser();
  if (!/^[A-Za-z0-9_-]{8,100}$/.test(String(submissionId || ''))) return;
  await updateDoc(doc(clientIntakeRef(token), 'submissions', String(submissionId)), {
    status: 'imported',
    importedAt: serverTimestamp(),
  });
}

const api = {
  config: { projectId: firebaseConfig.projectId, authDomain: firebaseConfig.authDomain },
  getState: () => ({ ...state }),
  subscribe(callback) {
    subscribers.add(callback);
    callback({ ...state });
    return () => subscribers.delete(callback);
  },
  login,
  logout,
  createInvite,
  acceptInvite,
  repairPairConnection,
  rejectInvite,
  cancelInvite,
  disconnectPair,
  createFriendInvite,
  acceptFriendInvite,
  rejectFriendInvite,
  cancelFriendInvite,
  removeFriend,
  sendDirectLetter,
  markDirectLetterRead,
  readAppData,
  migrateEventWorkspace,
  writeAppData,
  readScheduleData,
  writeScheduleData,
  watchScheduleData,
  getFirebaseIdToken,
  readPrivateData,
  writePrivateData,
  readPaperTaskData,
  writePaperTaskData,
  watchPaperTaskData,
  readEmotionData,
  writeEmotionData,
  uploadMedia,
  readMedia,
  deleteMedia,
  uploadEphemeralMedia,
  readEphemeralMedia,
  deleteEphemeralMedia,
  watchEphemeralMedia,
  uploadPrivateMedia,
  readPrivateMedia,
  deletePrivateMedia,
  uploadPaperTaskMedia,
  readPaperTaskMedia,
  deletePaperTaskMedia,
  requestGoogleDriveAccess,
  requestGoogleCalendarAccess,
  listGoogleCalendars,
  listGoogleCalendarEvents,
  backupEventDataToGoogleDrive,
  backupPaperTaskDataToGoogleDrive,
  updateNickname,
  createClientIntakeLink,
  getClientIntakeLink,
  submitClientIntake,
  watchClientIntakeSubmissions,
  markClientIntakeImported,
};

window.AiderDearFirebase = api;
window.dispatchEvent(new CustomEvent('aiderdear-firebase-ready'));

await setPersistence(auth, browserLocalPersistence);
onAuthStateChanged(auth, async user => {
  stopListeners();
  state.user = null;
  state.pair = null;
  state.partner = null;
  state.incoming = [];
  state.outgoing = [];
  state.friends = [];
  state.friendIncoming = [];
  state.friendOutgoing = [];
  state.directLetters = [];
  state.error = '';
  if (user) {
    try {
      state.user = await ensureUserProfile(user);
      startListeners(user);
      setTimeout(() => repairPairConnection().catch(error => {
        console.warn('Pair connection repair skipped', error);
      }), 700);
    } catch (error) {
      state.error = error.message;
    }
  }
  state.ready = true;
  emit();
});
