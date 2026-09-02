import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const ADMIN_EMAIL = 'qhals5060@gmail.com';

function env(name) {
  return String(process.env[name] || '').trim();
}

function firebaseApp() {
  if (getApps().length) return getApps()[0];
  const raw = env('FIREBASE_SERVICE_ACCOUNT_JSON');
  if (raw) {
    const serviceAccount = JSON.parse(raw);
    if (serviceAccount.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    return initializeApp({ credential: cert(serviceAccount), projectId: serviceAccount.project_id });
  }
  const projectId = env('FIREBASE_PROJECT_ID');
  const clientEmail = env('FIREBASE_CLIENT_EMAIL');
  const privateKey = env('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
  if (projectId && clientEmail && privateKey) {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
  }
  return initializeApp({ credential: applicationDefault(), projectId: projectId || undefined });
}

firebaseApp();
const auth = getAuth();
const db = getFirestore();

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.end(JSON.stringify(body));
}

async function adminUser(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw Object.assign(new Error('로그인이 필요합니다.'), { status: 401 });
  const decoded = await auth.verifyIdToken(token, true);
  if (String(decoded.email || '').trim().toLowerCase() !== ADMIN_EMAIL || decoded.email_verified !== true) {
    throw Object.assign(new Error('관리자 전용 기능입니다.'), { status: 403 });
  }
  return decoded;
}

async function listAllUsers() {
  const users = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    users.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);
  return users;
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return json(res, 405, { error: 'GET 요청만 지원합니다.' });
    await adminUser(req);
    const authUsers = await listAllUsers();
    const refs = authUsers.map(user => db.doc(`users/${user.uid}`));
    const snapshots = refs.length ? await db.getAll(...refs) : [];
    const profiles = new Map(snapshots.filter(row => row.exists).map(row => [row.id, row.data()]));
    const users = authUsers.map(user => {
      const profile = profiles.get(user.uid) || {};
      return {
        uid: user.uid,
        email: String(user.email || profile.email || '').toLowerCase(),
        name: String(profile.name || user.displayName || ''),
        photoURL: String(user.photoURL || profile.photoURL || ''),
        gender: ['female', 'male'].includes(profile.gender) ? profile.gender : '',
        birthDate: /^\d{4}-\d{2}-\d{2}$/.test(String(profile.birthDate || '')) ? profile.birthDate : '',
        birthCalendar: profile.birthCalendar === 'lunar' ? 'lunar' : 'solar',
        birthLeap: Boolean(profile.birthLeap),
        disabled: Boolean(user.disabled),
        emailVerified: Boolean(user.emailVerified),
        providerIds: user.providerData.map(row => row.providerId).filter(Boolean),
        createdAt: user.metadata.creationTime || '',
        lastSignInAt: user.metadata.lastSignInTime || '',
      };
    }).sort((a, b) => String(b.lastSignInAt).localeCompare(String(a.lastSignInAt)));
    return json(res, 200, { admin: ADMIN_EMAIL, count: users.length, users });
  } catch (error) {
    console.error('[admin-users]', error);
    return json(res, Number(error.status) || 500, { error: error.message || '계정 목록을 불러오지 못했습니다.' });
  }
}
