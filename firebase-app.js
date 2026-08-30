import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';
import {
  Bytes,
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
  error: '',
};

const subscribers = new Set();
let unsubscribePairs = null;
let unsubscribeIncoming = null;
let unsubscribeOutgoing = null;
let unsubscribeAppData = null;
let appDataScopeKey = '';
let pairRows = [];
let incomingRows = [];
let outgoingRows = [];
let repairPromise = null;

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
    error: state.error,
  };
  subscribers.forEach(callback => {
    try { callback(snapshot); } catch (error) { console.error(error); }
  });
  window.dispatchEvent(new CustomEvent('aiderdear-firebase-state', { detail: snapshot }));
}

function stopListeners() {
  [unsubscribePairs, unsubscribeIncoming, unsubscribeOutgoing, unsubscribeAppData].forEach(stop => {
    try { stop?.(); } catch {}
  });
  unsubscribePairs = unsubscribeIncoming = unsubscribeOutgoing = unsubscribeAppData = null;
  appDataScopeKey = '';
  pairRows = [];
  incomingRows = [];
  outgoingRows = [];
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
  watchAppData();
  emit();
}

async function ensureUserProfile(user) {
  const profile = publicUser(user);
  await setDoc(doc(db, 'users', user.uid), {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  return profile;
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
}

function requireUser() {
  if (!auth.currentUser || !state.user) throw new Error('Google 로그인이 필요합니다.');
  return state.user;
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
    if (['auth/popup-blocked', 'auth/operation-not-supported-in-this-environment'].includes(error.code)) {
      await signInWithRedirect(auth, provider);
      return null;
    }
    throw error;
  }
}

async function logout() {
  await signOut(auth);
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

async function readAppData() {
  const snapshot = await getDoc(scopedDoc('app'));
  return snapshot.exists() ? snapshot.data().payload || null : null;
}

async function writeAppData(payload) {
  const user = requireUser();
  await setDoc(scopedDoc('app'), {
    payload: JSON.parse(JSON.stringify(payload)),
    updatedAt: serverTimestamp(),
    updatedBy: user.uid,
  });
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

async function uploadMedia(originalFile, label = 'media') {
  requireUser();
  const file = await compressImage(originalFile);
  const maxSize = 25 * 1024 * 1024;
  if (file.size > maxSize) throw new Error('무료 저장공간 보호를 위해 파일은 25MB 이하만 올릴 수 있습니다.');
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
  readAppData,
  writeAppData,
  readPrivateData,
  writePrivateData,
  readEmotionData,
  writeEmotionData,
  uploadMedia,
  readMedia,
  deleteMedia,
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
