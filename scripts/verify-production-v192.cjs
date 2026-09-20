#!/usr/bin/env node
'use strict';

// Read-only deployment probe. Binary assets are checked with HEAD only.
// Usage: node verify-production-v192.cjs --url https://your-production-host
const RELEASE_ROOT = 'https://github.com/qhals5060-ux/aiderdear/releases/download/';
const ASSETS = [{file:'AiderLog-v192.apk',version:192},{file:'AiderLog-v192-site-files.zip',version:192}];
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
    method, redirect, headers: {'Cache-Control': 'no-cache', 'User-Agent': 'AiderLog-v192-readonly-verification'},
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
    const {text} = await fetchText('/?verify=android-v192');
    if (!/<meta\b[^>]*name=["']aiderlog-build["'][^>]*content=["']v192["']/i.test(text)) throw new Error('aiderlog-build v192 metadata is missing');
    for (const file of ['site-calendar-v179.css?v=192', 'site-typography-v169.css?v=192', 'firebase-app.js?v=192', 'site-event-routine-v189.css?v=192', 'bio-admin-domain-v192.js?v=192', 'bio-admin-client-v192.js?v=192', 'bio-admin-v192.js?v=192', 'bio-admin-v192.css?v=192']) {
      if (!text.includes(file)) throw new Error(`Missing module reference: ${file}`);
    }
    if (/schedule-ui-v184|AiderScheduleUIBridgeV184|app-compact-v18[67]|event-routine-v18[67]|routine-ui-v189/.test(text)) throw new Error('App-only layout must not be mounted on the site');
    if (!/<meta\b[^>]*name=["']aiderlog-android-build["'][^>]*content=["']v192["']/i.test(text)) throw new Error('Android v192 metadata is missing');
    for(const asset of ASSETS)if(!text.includes(`href="./${asset.file}"`))throw new Error(`Missing download: ${asset.file}`);
    if(/data-site-theme-select|value=["']editorial["']/.test(text))throw new Error('Retired edition control is still present');
    return {build:'v192',androidBuild:'v192',siteDesign:'Modern; Event/Routine refined'};
  });
  for (const [path, marker] of [
    ['/calendar-sync-v184.js?v=192', 'createCalendarSyncClient'],
    ['/firebase-app.js?v=192', "from './calendar-sync-v184.js'"],
    ['/sw.js?verify=v192', 'aiderlog-v192-site-modern'],
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
  await record('YouTube library API health', async () => {
    const {response, text} = await fetchText('/api/youtube-library?action=health');
    const health=JSON.parse(text);
    if(health.ok!==true||health.version!==189||health.requiresAuth!==true||response.headers.get('x-aiderlog-youtube')!=='189')throw new Error('YouTube library API is not healthy v189');
    return {version:189,captions:health.captions};
  });
  await record('YouTube library rejects unauthenticated reads',async()=>{
    const response=await request(new URL('/api/youtube-library',base),'POST');
    await response.body?.cancel();
    if(response.status!==401)throw new Error(`Expected 401; got ${response.status}`);
    return {status:401};
  });
  await record('Bio administration health',async()=>{
    const {text}=await fetchText('/api/bio-admin?action=health');const h=JSON.parse(text);
    if(h.ok!==true||h.version!==192||h.requiresAuth!==true||h.automaticRefresh!==false)throw Error('Bio administration health mismatch');
    return {version:192,automaticRefresh:false};
  });
  await record('Bio administration requires authentication',async()=>{
    const r=await request(new URL('/api/bio-admin',base),'POST');await r.body?.cancel();if(r.status!==401)throw Error('Expected 401');return {status:401};
  });
  for(const name of ['work','assets'])await record('Retired API '+name,async()=>{
    const r=await request(new URL('/api/'+name,base),'POST');await r.body?.cancel();if(r.status!==410)throw Error('Expected 410');return {status:410};
  });
  await record('Retired investment page',async()=>{
    const r=await request(new URL('/finance-v190.html',base),'HEAD');if(![301,302,307,308].includes(r.status)||new URL(r.headers.get('location'),base).href!==base.href)throw Error('Retired page must redirect home');return {status:r.status};
  });
  for(const [file,marker] of [['bio-admin-domain-v192.js','AiderBioAdminDomainV192'],['bio-admin-client-v192.js','createBioAdminClient'],['bio-admin-v192.js','AiderBioAdminV192'],['bio-admin-v192.css','bio192']])await record('Bio public asset '+file,async()=>{const {text}=await fetchText('/'+file+'?v=192');if(!text.includes(marker))throw Error('Missing bio asset marker');return {bytes:Buffer.byteLength(text)};});
  for (const file of [...ASSETS.map(asset=>asset.file), 'AiderLog-v191.apk', 'AiderLog-v191-site-files.zip', 'AiderLog-v190.apk', 'AiderLog-v190-site-files.zip', 'AiderLog-v189.apk', 'AiderLog-v189-site-files.zip', 'AiderLog-v188.apk', 'AiderLog-v187.apk', 'AiderLog-v186.apk', 'AiderLog-v185.apk', 'AiderLog-v184.apk', 'AiderLog-v183.apk', 'AiderLog-Editorial-v184-site-files.zip', 'AiderLog-Modern-v184-site-files.zip']) {
    await record(`download redirect ${file}`, async () => {
      const response = await request(new URL(`/${file}`, base), 'HEAD');
      const asset = file.endsWith('.apk') ? ASSETS[0] : ASSETS[1];
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
  return {url: base.href, version:192, siteVersion:192, calendarApiVersion:184, readOnly: true, binaryDownloadBytes: 0, ok: checks.every(row => row.ok), checks};
}

module.exports = {verifyProduction, boundedText};
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length !== 2 || args[0] !== '--url') {
    console.error('Usage: node verify-production-v192.cjs --url https://your-production-host');
    process.exitCode = 2;
  } else verifyProduction(args[1]).then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exitCode = result.ok ? 0 : 1;
  }).catch(error => { console.error(error.message); process.exitCode = 1; });
}
