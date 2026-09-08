'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const index = read('index.html'), sw = read('sw.js'), config = JSON.parse(read('vercel.json'));
const packaging = read('../../tools/package-pc-v174.ps1');
const checks = [];
function test(name, run) { run(); checks.push(name); }
const files = [...['calendar','language','panels'].flatMap(name => ['js','css'].map(ext => `site-${name}-v172.${ext}`)), 'estate-calendar-view-v172.js', 'estate-calendar-view-v172.css'];
files.push("estate-cobroker-v173.css", "dday-store-v174.js");
const events = new Map();
const context = vm.createContext({self:{addEventListener:(name, handler) => events.set(name, handler),location:{origin:'https://aiderdear1.vercel.app'}},URL});
vm.runInContext(sw, context);
const shell = Array.from(vm.runInContext('APP_SHELL', context));

test('site build is v174 and Android build/download stays v169', () => {
  assert(index.includes('<meta name="aiderlog-build" content="v174">'));
  assert(index.includes('<meta name="aiderlog-android-build" content="v169">'));
  assert(index.includes('href="./AiderLog-v169.apk"'));
  assert(!/AiderLog-v(?!169\b)\d+\.apk/.test(index));
});
test('PC links/download names are v174 and old asset queries are absent', () => {
  for (const edition of ['Modern','Editorial']) {
    assert(index.includes(`href="./AiderLog-${edition}-v174-site-files.zip" download="AiderLog-${edition}-v174-site-files.zip"`));
  }
  assert(!/\?v=(?:171|172|173)\b|AiderLog-(?:Modern|Editorial)-v(?:171|172|173)-site-files\.zip/.test(index));
});
test('all current local index JavaScript/CSS dependencies exist', () => {
  for (const match of index.matchAll(/\b(?:src|href)\s*=\s*["']([^"'<>]+\.(?:m?js|css)(?:[?#][^"'<>]*)?)["']/g)) {
    const value = match[1];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/.test(value)) continue;
    const file = new URL(value, 'https://archive.invalid/').pathname.slice(1);
    assert(fs.existsSync(path.join(root, file)), value);
  }
});
test('ESTATE filenames remain v171, served through v174 entry queries', () => {
  for (const name of ['estate-v171.js','estate-v171.css','estate-calendar-v171.js','estate-directory-v171.css','estate-workflow-v171.css']) {
    assert(index.includes(`./${name}?v=174`));
    assert(shell.includes(`./${name}?v=174`));
  }
  assert(!/estate(?:-(?:client|domain|directory|workflow|calendar|public))?-v174/.test(index + sw + packaging));
});
test('retained layout/co-broker assets and new D-day module are packaged and pre-cached with/without query', () => {
  for (const file of files) {
    assert(fs.existsSync(path.join(root, file)), file);
    assert(shell.includes(`./${file}`), file);
    assert(shell.includes(`./${file}?v=174`), file + ' query');
    assert(packaging.includes(`'${file}'`), file + ' package requirement');
  }
  assert(read('site-language-v172.js').includes('site-language-v172.css?v=172'));
  for (const file of files.filter(file => file.includes('-v172.'))) assert(shell.includes(`./${file}?v=172`), 'retained module query: ' + file);
  assert(index.includes('estate-cobroker-v173.css?v=174'));
  assert(read('firebase-app.js').includes("from './dday-store-v174.js'"));
  assert(!index.includes('src="./dday-store-v174.js'), 'D-day is statically imported once by Firebase, not mounted twice');
  assert(index.includes('estate-calendar-view-v172.css?v=174'));
  assert(read('estate-v171.js').includes("from './estate-calendar-view-v172.js'"));
});
test('service worker uses new version key and every pre-cache path exists', () => {
  assert.equal(vm.runInContext('CACHE', context), 'aiderlog-v174-dday');
  assert(!/\?v=171\b/.test(sw));
  assert.equal(new Set(shell).size, shell.length, 'pre-cache has no duplicate entries');
  for (const url of shell) {
    const name = new URL(url, 'https://archive.invalid/').pathname.slice(1) || 'index.html';
    assert(fs.existsSync(path.join(root, name)), name);
  }
});
test('private/public-share documents, APIs and release binaries are not pre-cached', () => {
  for (const url of shell) assert(!/\/api\/|estate-share(?:\.html)?(?:\?|$)|\/employee(?:\.html|\/)|\.(?:apk|zip)(?:\?|$)|[?&](?:token|idToken|access_token)=/i.test(url), url);
});
test('service worker bypasses API/authenticated/binary/cross-origin/non-GET requests', () => {
  const fetchHandler = events.get('fetch');
  for (const options of [
    {url:'https://aiderdear1.vercel.app/api/estate'},
    {url:'https://aiderdear1.vercel.app/estate-v171.js',auth:true},
    {url:'https://aiderdear1.vercel.app/AiderLog-Modern-v174-site-files.zip'},
    {url:'https://aiderdear1.vercel.app/AiderLog-v169.apk'},
    {url:'https://other.invalid/site-panels-v172.js'},
    {url:'https://aiderdear1.vercel.app/index.html',method:'POST'}
  ]) {
    let intercepts = 0;
    fetchHandler({request:{url:options.url,method:options.method || 'GET',headers:{has: name => name === 'Authorization' && !!options.auth}},respondWith:() => intercepts++,waitUntil:() => intercepts++});
    assert.equal(intercepts, 0, JSON.stringify(options));
  }
  assert(sw.includes("fetch(request,{cache:'no-store',referrerPolicy:'no-referrer'})"));
  assert(sw.includes("fetch(request,{cache:'no-store'})"));
});
test('all old PC ZIP redirects go directly to v174; APK redirects still target v169', () => {
  for (const edition of ['Modern','Editorial']) {
    for (const version of [165,167,168,169,170,171,172,173]) {
      const row = config.redirects.find(row => row.source === `/AiderLog-${edition}-v${version}-site-files.zip`);
      assert(row, `${edition} ${version}`);
      assert.equal(row.destination, `/AiderLog-${edition}-v174-site-files.zip`);
      assert.equal(row.permanent, false);
    }
  }
  for (const row of config.redirects.filter(row => row.source.endsWith('.apk'))) assert.equal(row.destination, '/AiderLog-v169.apk');
  assert(!config.redirects.some(row => row.source === row.destination));
});
test('ZIP headers identify v174 attachments, APK169 and private share headers preserved', () => {
  for (const edition of ['Modern','Editorial']) {
    const name = `AiderLog-${edition}-v174-site-files.zip`;
    const row = config.headers.find(row => row.source === '/' + name);
    assert(row);
    const headers = Object.fromEntries(row.headers.map(header => [header.key,header.value]));
    assert.equal(headers['Content-Type'], 'application/zip');
    assert.equal(headers['Content-Disposition'], `attachment; filename="${name}"`);
    assert.equal(headers['Cache-Control'], 'public, max-age=31536000, immutable');
  }
  assert(config.headers.some(row => row.source === '/AiderLog-v169.apk'));
  const share = config.headers.find(row => row.source === '/estate-share.html');
  assert(share.headers.some(row => row.key === 'Cache-Control' && row.value === 'private, no-store'));
  assert(!config.headers.some(row => /AiderLog-(?:Modern|Editorial)-v(?:171|172|173)-site-files/.test(row.source)));
});
test('packaging retains byte hashes, launcher-only index changes and source-race guards', () => {
  assert(packaging.includes('release=174&site-edition='));
  assert(packaging.includes('$pcIndexText -cne $pcExpectedIndex'));
  assert(packaging.includes('$pcHtml -cne $pcSourceIndex'));
  assert(packaging.includes('Browser source bytes changed:'));
  assert(packaging.includes('Browser source changed between editions:'));
  assert(packaging.includes('Browser source changed before publishing:'));
  assert(packaging.includes('Previous archive backup verification failed:'));
  assert(packaging.includes('Published archive copy verification failed:'));
  assert(packaging.includes('Forbidden archive entry:'));
});
console.log(JSON.stringify({ok:true,count:checks.length,precacheEntries:shell.length,checks}, null, 2));
