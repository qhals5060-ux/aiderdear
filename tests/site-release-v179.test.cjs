'use strict';
// Source/packaging contracts only. Passing this file does not attest a deployed
// APK, signed-in production write, live security rules, or physical phone QA.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const index = read('index.html'), sw = read('sw.js'), config = JSON.parse(read('vercel.json'));
const packaging = read('../../tools/package-pc-v179.ps1');
const retained = [...['calendar','panels'].flatMap(name => ['js','css'].map(ext => `site-${name}-v172.${ext}`)), 'estate-calendar-view-v172.js', 'estate-calendar-view-v172.css', 'estate-cobroker-v173.css', 'dday-store-v174.js'];
const added = ['shared-schedule-v176.js','shared-schedule-v176.css','private-calendar-v175.js','private-calendar-ui-v175.js','private-calendar-v175.css','friend-schedule-v175.js','friend-schedule-firebase-v175.js','friend-schedule-ui-v175.js','friend-schedule-v175.css','business-calendar-v175.js','business-calendar-v175.css','site-calendar-v175.js','site-calendar-v175.css','todo-domain-v179.js','schedule-time-v179.js','schedule-editor-v179.css','site-calendar-v179.css'];
const events = new Map();
added.push('android-session-v176.js','photo-attachments-v176.js','photo-attachments-v176.css');
added.push('dday-display-v176.js','dday-display-v176.css','retired-features-v178.js');
const context = vm.createContext({self:{addEventListener:(name, handler) => events.set(name, handler),location:{origin:'https://aiderdear1.vercel.app'}},URL});
vm.runInContext(sw, context);
const shell = Array.from(vm.runInContext('APP_SHELL', context));
const localDependencies = html => [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"'<>]+\.(?:m?js|css)(?:[?#][^"'<>]*)?)["']/g)].map(row=>row[1]).filter(value=>!/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/.test(value));

test('v179 release: site, PC and Android metadata/download advance together', () => {
  assert(index.includes('<meta name="aiderlog-build" content="v179">'));
  assert(index.includes('<meta name="aiderlog-android-build" content="v179">'));
  assert(index.includes('href="./AiderLog-v179.apk" download="AiderLog-v179.apk"'));
  assert(!/AiderLog-v(?!179\b)\d+\.apk/.test(index));
  for (const edition of ['Modern','Editorial']) assert(index.includes(`href="./AiderLog-${edition}-v179-site-files.zip" download="AiderLog-${edition}-v179-site-files.zip"`));
  assert(!/AiderLog-(?:Modern|Editorial)-v(?!179\b)\d+-site-files\.zip/.test(index));
});

test('v179 release: all local site entry dependencies exist and use current release queries', () => {
  for(const value of localDependencies(index)){
    const url = new URL(value,'https://archive.invalid/');
    assert(fs.existsSync(path.join(root,decodeURIComponent(url.pathname.slice(1)))),value);
    if(url.searchParams.has('v'))assert.equal(url.searchParams.get('v'),'179',value);
  }
});

test('v179 release: ESTATE and co-broker retain source filenames while entry queries advance', () => {
  for(const name of ['estate-v171.js','estate-v171.css','estate-calendar-v171.js','estate-directory-v171.css','estate-workflow-v171.css','estate-cobroker-v173.css']){
    assert(index.includes(`./${name}?v=179`));assert(shell.includes(`./${name}?v=179`));
  }
  assert(!/estate(?:-(?:client|domain|directory|workflow|calendar|public))?-v175/.test(index+sw+packaging));
});

test('v179 release: retained and new browser modules are packaged and cached with and without queries', () => {
  for(const name of [...retained,...added]){
    assert(fs.existsSync(path.join(root,name)),name);assert(shell.includes(`./${name}`),name);
    assert(shell.includes(`./${name}?v=179`),name+' query');assert(packaging.includes(`'${name}'`),name+' packaging');
  }
  for(const name of retained.filter(name=>name.includes('-v172.')))assert(shell.includes(`./${name}`),'internal queryless dependency: '+name);
  assert(!fs.existsSync(path.join(root,'site-language-v172.js')),'language presentation was explicitly retired');
  assert(read('estate-v171.js').includes("from './estate-calendar-view-v172.js'"));
});

test('v179 release: new shared UI modules are mounted once, model modules are statically imported', () => {
  const entries=['shared-schedule-v176.js','site-calendar-v175.js','private-calendar-ui-v175.js','friend-schedule-ui-v175.js','business-calendar-v175.js','schedule-time-v179.js'];
  for(const name of entries)assert.equal(localDependencies(index).filter(value=>new URL(value,'https://archive.invalid/').pathname==='/'+name).length,1,name);
  for(const name of ['dday-store-v174.js','private-calendar-v175.js','friend-schedule-firebase-v175.js','todo-domain-v179.js']){
    assert(read('firebase-app.js').includes(`from './${name}'`),name);assert(!index.includes(`src="./${name}`),'not double-mounted: '+name);
  }
});

test('v179 release: service worker has new version key, unique existing pre-cache paths', () => {
  assert.equal(vm.runInContext('CACHE',context),'aiderlog-v179-site-calendar-todo');
  assert.equal(new Set(shell).size,shell.length);
  for(const value of shell){const name=decodeURIComponent(new URL(value,'https://archive.invalid/').pathname.slice(1))||'index.html';assert(fs.existsSync(path.join(root,name)),name);}
});

test('v179 release: private records, share links, API responses and binaries are never pre-cached', () => {
  for(const value of shell)assert(!/\/api\/|estate-share(?:\.html)?(?:\?|$)|\/employee(?:\.html|\/)|\.(?:apk|zip)(?:\?|$)|[?&](?:token|idToken|access_token)=/i.test(value),value);
  assert(!shell.some(value=>/privateCalendar\/|scheduleShares\/|\/users\//.test(value)));
});

test('v179 release: service worker bypasses API, authenticated, cross-origin, binary and non-GET requests', () => {
  for(const options of [
    {url:'https://aiderdear1.vercel.app/api/estate'},
    {url:'https://aiderdear1.vercel.app/private-calendar-v175.js',auth:true},
    {url:'https://aiderdear1.vercel.app/AiderLog-Modern-v179-site-files.zip'},
    {url:'https://aiderdear1.vercel.app/AiderLog-v179.apk'},
    {url:'https://aiderdear1.vercel.app/AiderLog-v179.apk'},
    {url:'https://firestore.googleapis.com/v1/projects/fixture/documents/privateCalendar/a'},
    {url:'https://aiderdear1.vercel.app/index.html',method:'POST'}
  ]){
    let intercepts=0;events.get('fetch')({request:{url:options.url,method:options.method||'GET',headers:{has:name=>name==='Authorization'&&!!options.auth}},respondWith:()=>intercepts++,waitUntil:()=>intercepts++});
    assert.equal(intercepts,0,JSON.stringify(options));
  }
  assert(sw.includes("fetch(request,{cache:'no-store',referrerPolicy:'no-referrer'})"));assert(sw.includes("fetch(request,{cache:'no-store'})"));
});

test('v179 release: old PC/APK download URLs redirect directly without loops or permanent caching', () => {
  for(const edition of ['Modern','Editorial'])for(const version of [165,167,168,169,170,171,172,173,174,175,176,178]){
    const row=config.redirects.find(row=>row.source===`/AiderLog-${edition}-v${version}-site-files.zip`);
    assert(row,`${edition} ${version}`);assert.equal(row.destination,`/AiderLog-${edition}-v179-site-files.zip`);assert.equal(row.permanent,false);
  }
  for(const version of [165,166,167,168,169,170,171,172,173,174,175,176,177,178])assert(config.redirects.some(row=>row.source===`/AiderLog-v${version}.apk`),String(version));
  for(const row of config.redirects.filter(row=>row.source.endsWith('.apk'))){assert.equal(row.destination,'/AiderLog-v179.apk');assert.equal(row.permanent,false);}
  assert(!config.redirects.some(row=>row.source===row.destination));
  assert.equal(new Set(config.redirects.map(row=>row.source)).size,config.redirects.length,'No duplicate redirect sources');
});

test('v179 release: correct ZIP/APK attachment headers and private customer-share policy survive', () => {
  for(const [name,type] of [['AiderLog-Modern-v179-site-files.zip','application/zip'],['AiderLog-Editorial-v179-site-files.zip','application/zip'],['AiderLog-v179.apk','application/vnd.android.package-archive']]){
    const row=config.headers.find(row=>row.source==='/'+name);assert(row,name);
    const headers=Object.fromEntries(row.headers.map(item=>[item.key,item.value]));assert.equal(headers['Content-Type'],type);
    assert.equal(headers['Content-Disposition'],`attachment; filename="${name}"`);assert.equal(headers['Cache-Control'],'public, max-age=31536000, immutable');
  }
  const share=config.headers.find(row=>row.source==='/estate-share.html');assert(share.headers.some(row=>row.key==='Cache-Control'&&row.value==='private, no-store'));
  assert(!config.headers.some(row=>/AiderLog-(?:Modern|Editorial)-v(?!179\b)\d+-site-files/.test(row.source)));
  assert(!config.headers.some(row=>/AiderLog-v(?!179\b)\d+\.apk/.test(row.source)),'Old APK redirects must not retain immutable artifact headers');
});

test('v179 release: PC packaging preserves source bytes, edition boundaries and recoverable previous archives', () => {
  assert(packaging.includes('release=179&site-edition='));assert(packaging.includes('$pcIndexText -cne $pcExpectedIndex'));assert(packaging.includes('$pcHtml -cne $pcSourceIndex'));
  for(const guard of ['Browser source bytes changed:','Browser source changed between editions:','Browser source changed before publishing:','Previous archive backup verification failed:','Published archive copy verification failed:','Forbidden archive entry:'])assert(packaging.includes(guard),guard);
  assert(packaging.includes("'AiderLog-v179.apk','AiderLog-Modern-v179-site-files.zip','AiderLog-Editorial-v179-site-files.zip'"));
  assert(packaging.includes('Keep old published releases until the coordinator has passed live gates.'));
});

test('v179 release: Android includes required shared domain dependencies and no desktop-only calendar layout', () => {
  const html=read('android-src/assets/index.html');
  for(const name of ['shared-schedule-v176.js','shared-schedule-v176.css','wheelbar-v176.js','wheelbar-v176.css','private-calendar-ui-v175.js','private-calendar-v175.css','business-calendar-v175.js','business-calendar-v175.css','app-dday-v175.js','app-calendar-v175.css','app-calendar-v179.js','app-calendar-v179.css','app-todo-v179.js','app-todo-v179.css','schedule-time-v179.js','schedule-editor-v179.css','friend-schedule-ui-v175.js'])assert(html.includes(name),name);
  for(const name of ['firebase-app.js','private-calendar-v175.js','friend-schedule-v175.js','friend-schedule-firebase-v175.js','dday-store-v174.js','todo-domain-v179.js'])assert(fs.existsSync(path.join(root,'android-src/assets',name)),name);
  assert(!/<script[^>]+(?:site-calendar-v175|estate-ui-v171)\.js/.test(html));
});

test('v179 release: both site schedule open paths mount private date entries after the form opens',()=>{
  assert.equal((index.match(/openModal\('scheduleModal'\);window\.AiderPrivateCalendarUIV175\?\.scheduleOpened\(\)/g)||[]).length,2);
  const ui=read('private-calendar-ui-v175.js');assert.match(ui,/installScheduleEntries\(\)/);assert.match(ui,/!save\.hidden&&!save\.disabled&&!date\.disabled/);
  assert(!ui.includes("const calendarTools="));assert(!ui.includes("$('addEmotionTop')?.parentElement"));
});

test('v179 release: removed emotion entrypoints cannot be loaded, cached or shipped in PC archives',()=>{
  const appIndex=read('android-src/assets/index.html'),appSw=read('android-src/assets/sw.js');
  for(const name of ['insight-range-v175.js','insight-range-v175.css','insight-motion-v132.js']){
    assert(!fs.existsSync(path.join(root,name)),name);assert(!index.includes(name),name+' site');assert(!appIndex.includes(name),name+' app');assert(!sw.includes(name),name+' site cache');assert(!appSw.includes(name),name+' app cache');
  }
  for(const name of ['feature-fixes-v126.js','experience-v145.js']){assert(!appIndex.includes(name),name);assert(!appSw.includes(name),name);assert(!fs.existsSync(path.join(root,'android-src/assets',name)),name);}
  for(const html of [index,appIndex])assert.doesNotMatch(html,/id=["'](?:emotionModal|emotionForm|emotionInsightPage|emotionDetailModal)["']/);
  assert(packaging.includes('Retired browser feature still present:'));assert.doesNotMatch(read('firebase-app.js'),/async function (?:writeEmotionData|readEmotionData|watchEmotionData)\(/);
});

test('v179 release: date cells and private markers open the same schedule without intercepting existing event pills',()=>{
  const start=index.indexOf('const addForDay=event=>{'),end=index.indexOf(';cell.addEventListener(',start);assert(start>0&&end>start);
  const opened=[];const local={date:'2026-09-18',newEvent:(owner,date)=>opened.push([owner,date])};vm.runInNewContext(index.slice(start,end)+';globalThis.openDate=addForDay',local);
  let prevented=0;const event=(type,kind,key)=>({type,key,preventDefault:()=>prevented++,target:{closest:selector=>selector==='[data-private-calendar-marker]'?kind==='private':kind!=='cell'}});
  local.openDate(event('click','cell'));local.openDate(event('click','private'));local.openDate(event('click','pill'));local.openDate(event('keydown','cell','Enter'));local.openDate(event('keydown','cell','Escape'));
  assert.deepEqual(opened,[['mine','2026-09-18'],['mine','2026-09-18'],['mine','2026-09-18']]);assert.equal(prevented,3);
});
