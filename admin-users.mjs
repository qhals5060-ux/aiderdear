import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

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

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.end(JSON.stringify(body));
}

async function verifiedAdmin(auth, req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) throw Object.assign(new Error('로그인이 필요합니다.'), { status: 401 });
  const decoded = await auth.verifyIdToken(token, true);
  if (String(decoded.email || '').trim().toLowerCase() !== ADMIN_EMAIL || decoded.email_verified !== true) {
    throw Object.assign(new Error('관리자 계정으로 로그인해주세요.'), { status: 403 });
  }
}

async function listEmails(auth) {
  const emails = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    page.users.forEach(user => {
      const email = String(user.email || '').trim().toLowerCase();
      if (email) emails.push(email);
    });
    pageToken = page.pageToken;
  } while (pageToken);
  return [...new Set(emails)].sort((a, b) => a.localeCompare(b));
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') return json(res, 405, { error: 'GET 요청만 지원합니다.' });
    const auth = getAuth(firebaseApp());
    await verifiedAdmin(auth, req);
    const emails = await listEmails(auth);
    return json(res, 200, { count: emails.length, emails });
  } catch (error) {
    console.error('[admin-users]', error);
    return json(res, Number(error.status) || 500, { error: error.message || '가입 이메일을 불러오지 못했습니다.' });
  }
}
