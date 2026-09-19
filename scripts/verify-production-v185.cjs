#!/usr/bin/env node
'use strict';

// Read-only deployment probe. Binary assets are checked with HEAD only.
// Usage: node verify-production-v185.cjs --url https://your-production-host
const RELEASE_ROOT = 'https://github.com/qhals5060-ux/aiderdear/releases/download/';
const ASSETS = [{file:'AiderLog-v185.apk',version:185},{file:'AiderLog-Editorial-v184-site-files.zip',version:184},{file:'AiderLog-Modern-v184-site-files.zip',version:184}];
const releaseUrl = asset => `${RELEASE_ROOT}v${asset.version}/${asset.file}`;
const CONFIG_KEYS = ['publicAppUrl', 'firebaseAdmin', 'stateSecret', 'cronSecret', 'googleOAuth'];

async function boundedText(response, limit = 3 * 1024 * 1024) {
  const size = Number(response.headers.get('content-length') || 0);
  if (size > limit) { await response.body?.cancel(); throw new Error(`Response exceeds ${limit} bytes`); }
  if (!response.body) return '';
  const reader = response.body.getReader();
  const chunks = [];
  let count = 0;
  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;
      count += value.byteLength;
      if (count > limit) throw new Error(`Response exceeds ${limit} bytes`);
      chunks.push(Buffer.from(value));
    }
  } finally { await reader.cancel().catch(() => {}); }
  return Buffer.concat(chunks).toString('utf8');
}

async function verifyProduction(input, {fetchImpl = fetch, checkReleaseAssets = true} = {}) {
  const base = new URL(input);
  if (!['https:', 'http:'].includes(base.protocol) || base.username || base.password) throw new Error('A public HTTP(S) URL without credentials is required');
  base.pathname = '/'; base.search = ''; base.hash = '';
  const checks = [];
  const request = (url, method = 'GET', redirect = 'manual') => fetchImpl(url, {
    method, redirect, headers: {'Cache-Control': 'no-cache', 'User-Agent': 'AiderLog-v185-readonly-verification'},
    signal: AbortSignal.timeout(20000),
  });
  const record = async (name, operation) => {
    try { checks.push({name, ok: true, ...await operation()}); }
    catch (error) { checks.push({name, ok: false, error: error.message}); }
  };
  const fetchText = async path => {
    const response = await request(new URL(path, base));
    if (response.status !== 200) { await response.body?.cancel(); throw new Error(`HTTP ${response.status}`); }
    return {response, text: await boundedText(response)};
  };
  await record('site build and module references', async () => {
    const {text} = await fetchText('/?verify=android-v185');
    if (!/<meta\b[^>]*name=["']aiderlog-build["'][^>]*content=["']v184["']/i.test(text)) throw new Error('aiderlog-build v184 metadata is missing');
    for (const file of ['site-calendar-v179.css?v=184', 'site-typography-v169.css?v=184', 'firebase-app.js?v=184']) {
      if (!text.includes(file)) throw new Error(`Missing module reference: ${file}`);
    }
    if (/schedule-ui-v184|AiderScheduleUIBridgeV184/.test(text)) throw new Error('App-only layout must not be mounted on the site');
    if (!/<meta\b[^>]*name=["']aiderlog-android-build["'][^>]*content=["']v185["']/i.test(text)) throw new Error('Android v185 metadata is missing');
    for(const asset of ASSETS)if(!text.includes(`href="./${asset.file}"`))throw new Error(`Missing download: ${asset.file}`);
    return {build:'v184',androidBuild:'v185',siteDesign:'v183 restored'};
  });
  for (const [path, marker] of [
    ['/calendar-sync-v184.js?v=184', 'createCalendarSyncClient'],
    ['/firebase-app.js?v=184', "from './calendar-sync-v184.js'"],
    ['/sw.js?verify=v184', 'aiderlog-v184-site-original-design-r1'],
  ]) {
    await record(`module ${path.split('?')[0]}`, async () => {
      const {response, text} = await fetchText(path);
      if ((response.headers.get('content-type') || '').includes('text/html') || /^\s*<!doctype html/i.test(text)) throw new Error('Received an HTML fallback instead of a module');
      if (!text.includes(marker)) throw new Error('Expected v184 code marker is missing');
      return {bytes: Buffer.byteLength(text)};
    });
  }
  await record('Calendar API health', async () => {
    const {response, text} = await fetchText('/api/calendar-sync?action=health');
    const health = JSON.parse(text);
    if (health.ok !== true || response.headers.get('x-aiderlog-calendar-api') !== '184') throw new Error('Calendar API is not healthy v184');
    const missing = CONFIG_KEYS.filter(key => health.configured?.[key] !== true);
    if (missing.length) throw new Error(`Missing configuration flags: ${missing.join(', ')}`);
    return {version: 184, configured: Object.fromEntries(CONFIG_KEYS.map(key => [key, true]))};
  });
  for (const file of [...ASSETS.map(asset=>asset.file), 'AiderLog-v184.apk', 'AiderLog-v183.apk']) {
    await record(`download redirect ${file}`, async () => {
      const response = await request(new URL(`/${file}`, base), 'HEAD');
      const asset = file.endsWith('.apk') ? ASSETS[0] : ASSETS.find(asset=>asset.file===file);
      const expected = releaseUrl(asset);
      const location = response.headers.get('location');
      if (![301, 302, 303, 307, 308].includes(response.status)) throw new Error(`Expected redirect; got HTTP ${response.status}`);
      if (!location || new URL(location, base).href !== expected) throw new Error('Redirect does not point to the expected Android/site GitHub release asset');
      return {status: response.status, destination: expected};
    });
  }
  if (checkReleaseAssets) for (const asset of ASSETS) {
    const {file}=asset;
    await record(`release asset available ${file}`, async () => {
      const response = await request(releaseUrl(asset), 'HEAD', 'follow');
      if (response.status !== 200) throw new Error(`GitHub asset HEAD returned HTTP ${response.status}`);
      const bytes = Number(response.headers.get('content-length') || 0);
      if (!bytes) throw new Error('GitHub asset has no positive Content-Length');
      return {bytes, method: 'HEAD'};
    });
  }
  return {url: base.href, version:185, siteVersion:184, calendarApiVersion:184, readOnly: true, binaryDownloadBytes: 0, ok: checks.every(row => row.ok), checks};
}

module.exports = {verifyProduction, boundedText};
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--url') {
    console.error('Usage: node verify-production-v185.cjs --url https://your-production-host');
    process.exitCode = 2;
  } else verifyProduction(args[1]).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
