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
const packaging = read('../../tools/package-pc-v176.ps1');
const retained = [...['calendar','language','panels'].flatMap(name => ['js','css'].map(ext => `site-${name}-v172.${ext}`)), 'estate-calendar-view-v172.js', 'estate-calendar-view-v172.css', 'estate-cobroker-v173.css', 'dday-store-v174.js'];
const added = ['shared-schedule-v176.js','shared-schedule-v176.css','private-calendar-v175.js','private-calendar-ui-v175.js','private-calendar-v175.css','friend-schedule-v175.js','friend-schedule-firebase-v175.js','friend-schedule-ui-v175.js','friend-schedule-v175.css','business-calendar-v175.js','business-calendar-v175.css','site-calendar-v175.js','site-calendar-v175.css','insight-range-v175.js','insight-range-v175.css'];
const events = new Map();
added.push('android-session-v176.js','photo-attachments-v176.js','photo-attachments-v176.css');
added.push('dday-display-v176.js','dday-display-v176.css');
const context = vm.createContext({self:{addEventListener:(name, handler) => events.set(name, handler),location:{origin:'https://aiderdear1.vercel.app'}},URL});
vm.runInContext(sw, context);
const shell = Array.from(vm.runInContext('APP_SHELL', context));
const localDependencies = html => [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"'<>]+\.(?:m?js|css)(?:[?#][^"'<>]*)?)["']/g)].map(row=>row[1]).filter(value=>!/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/.test(value));

test('v176 release: website and Android metadata/download target the same completed source version', () => {
  for(const name of ['aiderlog-build','aiderlog-android-build'])assert(index.includes(`<meta name="${name}" content="v176">`));
  assert(index.includes('href="./AiderLog-v176.apk"'));
  assert(!/AiderLog-v(?!176\b)\d+\.apk/.test(index));
  for (const edition of ['Modern','Editorial']) assert(index.includes(`href="./AiderLog-${edition}-v176-site-files.zip" download="AiderLog-${edition}-v176-site-files.zip"`));
  assert(!/AiderLog-(?:Modern|Editorial)-v(?!176\b)\d+-site-files\.zip/.test(index));
});

test('v176 release: all local site entry dependencies exist and use current release queries', () => {
  for(const value of localDependencies(index)){
    const url = new URL(value,'https://archive.invalid/');
    assert(fs.existsSync(path.join(root,decodeURIComponent(url.pathname.slice(1)))),value);
    if(url.searchParams.has('v'))assert.equal(url.searchParams.get('v'),'176',value);
  }
});

test('v176 release: ESTATE and co-broker retain source filenames while entry queries advance', () => {
  for(const name of ['estate-v171.js','estate-v171.css','estate-calendar-v171.js','estate-directory-v171.css','estate-workflow-v171.css','estate-cobroker-v173.css']){
    assert(index.includes(`./${name}?v=176`));assert(shell.includes(`./${name}?v=176`));
  }
  assert(!/estate(?:-(?:client|domain|directory|workflow|calendar|public))?-v175/.test(index+sw+packaging));
});

test('v176 release: retained and new browser modules are packaged and cached with and without queries', () => {
  for(const name of [...retained,...added]){
    assert(fs.existsSync(path.join(root,name)),name);assert(shell.includes(`./${name}`),name);
    assert(shell.includes(`./${name}?v=176`),name+' query');assert(packaging.includes(`'${name}'`),name+' packaging');
  }
  for(const name of retained.filter(name=>name.includes('-v172.')))assert(shell.includes(`./${name}?v=172`),'retained internal query: '+name);
  assert(read('site-language-v172.js').includes('site-language-v172.css?v=172'));
  assert(read('estate-v171.js').includes("from './estate-calendar-view-v172.js'"));
});

test('v176 release: new shared UI modules are mounted once, model modules are statically imported', () => {
  const entries=['shared-schedule-v176.js','site-calendar-v175.js','private-calendar-ui-v175.js','friend-schedule-ui-v175.js','business-calendar-v175.js','insight-range-v175.js'];
  for(const name of entries)assert.equal(localDependencies(index).filter(value=>new URL(value,'https://archive.invalid/').pathname==='/'+name).length,1,name);
  for(const name of ['dday-store-v174.js','private-calendar-v175.js','friend-schedule-firebase-v175.js']){
    assert(read('firebase-app.js').includes(`from './${name}'`),name);assert(!index.includes(`src="./${name}`),'not double-mounted: '+name);
  }
});

test('v176 release: service worker has new version key, unique existing pre-cache paths', () => {
  assert.equal(vm.runInContext('CACHE',context),'aiderlog-v176-schedule-colours');
  assert.equal(new Set(shell).size,shell.length);
  for(const value of shell){const name=decodeURIComponent(new URL(value,'https://archive.invalid/').pathname.slice(1))||'index.html';assert(fs.existsSync(path.join(root,name)),name);}
});

test('v176 release: private records, share links, API responses and binaries are never pre-cached', () => {
  for(const value of shell)assert(!/\/api\/|estate-share(?:\.html)?(?:\?|$)|\/employee(?:\.html|\/)|\.(?:apk|zip)(?:\?|$)|[?&](?:token|idToken|access_token)=/i.test(value),value);
  assert(!shell.some(value=>/privateCalendar\/|scheduleShares\/|\/users\//.test(value)));
});

test('v176 release: service worker bypasses API, authenticated, cross-origin, binary and non-GET requests', () => {
  for(const options of [
    {url:'https://aiderdear1.vercel.app/api/estate'},
    {url:'https://aiderdear1.vercel.app/private-calendar-v175.js',auth:true},
    {url:'https://aiderdear1.vercel.app/AiderLog-Modern-v176-site-files.zip'},
    {url:'https://aiderdear1.vercel.app/AiderLog-v176.apk'},
    {url:'https://firestore.googleapis.com/v1/projects/fixture/documents/privateCalendar/a'},
    {url:'https://aiderdear1.vercel.app/index.html',method:'POST'}
  ]){
    let intercepts=0;events.get('fetch')({request:{url:options.url,method:options.method||'GET',headers:{has:name=>name==='Authorization'&&!!options.auth}},respondWith:()=>intercepts++,waitUntil:()=>intercepts++});
    assert.equal(intercepts,0,JSON.stringify(options));
  }
  assert(sw.includes("fetch(request,{cache:'no-store',referrerPolicy:'no-referrer'})"));assert(sw.includes("fetch(request,{cache:'no-store'})"));
});

test('v176 release: old PC/APK download URLs redirect directly without loops or permanent caching', () => {
  for(const edition of ['Modern','Editorial'])for(const version of [165,167,168,169,170,171,172,173,174,175]){
    const row=config.redirects.find(row=>row.source===`/AiderLog-${edition}-v${version}-site-files.zip`);
    assert(row,`${edition} ${version}`);assert.equal(row.destination,`/AiderLog-${edition}-v176-site-files.zip`);assert.equal(row.permanent,false);
  }
  for(const version of [165,167,168,169])assert(config.redirects.some(row=>row.source===`/AiderLog-v${version}.apk`),String(version));
  for(const row of config.redirects.filter(row=>row.source.endsWith('.apk'))){assert.equal(row.destination,'/AiderLog-v176.apk');assert.equal(row.permanent,false);}
  assert(!config.redirects.some(row=>row.source===row.destination));
});

test('v176 release: correct ZIP/APK attachment headers and private customer-share policy survive', () => {
  for(const [name,type] of [['AiderLog-Modern-v176-site-files.zip','application/zip'],['AiderLog-Editorial-v176-site-files.zip','application/zip'],['AiderLog-v176.apk','application/vnd.android.package-archive']]){
    const row=config.headers.find(row=>row.source==='/'+name);assert(row,name);
    const headers=Object.fromEntries(row.headers.map(item=>[item.key,item.value]));assert.equal(headers['Content-Type'],type);
    assert.equal(headers['Content-Disposition'],`attachment; filename="${name}"`);assert.equal(headers['Cache-Control'],'public, max-age=31536000, immutable');
  }
  const share=config.headers.find(row=>row.source==='/estate-share.html');assert(share.headers.some(row=>row.key==='Cache-Control'&&row.value==='private, no-store'));
  assert(!config.headers.some(row=>/AiderLog-(?:Modern|Editorial)-v(?!176\b)\d+-site-files/.test(row.source)));
});

test('v176 release: PC packaging preserves source bytes, edition boundaries and recoverable previous archives', () => {
  assert(packaging.includes('release=176&site-edition='));assert(packaging.includes('$pcIndexText -cne $pcExpectedIndex'));assert(packaging.includes('$pcHtml -cne $pcSourceIndex'));
  for(const guard of ['Browser source bytes changed:','Browser source changed between editions:','Browser source changed before publishing:','Previous archive backup verification failed:','Published archive copy verification failed:','Forbidden archive entry:'])assert(packaging.includes(guard),guard);
  assert(packaging.includes("'AiderLog-v176.apk','AiderLog-Modern-v176-site-files.zip','AiderLog-Editorial-v176-site-files.zip'"));
  assert(packaging.includes('Keep old published releases until the coordinator has passed live gates.'));
});

test('v176 release: Android includes required shared domain dependencies and no desktop-only calendar layout', () => {
  const html=read('android-src/assets/index.html');
  for(const name of ['shared-schedule-v176.js','shared-schedule-v176.css','wheelbar-v176.js','wheelbar-v176.css','private-calendar-ui-v175.js','private-calendar-v175.css','business-calendar-v175.js','business-calendar-v175.css','insight-range-v175.js','insight-range-v175.css','app-dday-v175.js','app-calendar-v175.css'])assert(html.includes(name),name);
  for(const name of ['firebase-app.js','private-calendar-v175.js','friend-schedule-v175.js','friend-schedule-firebase-v175.js','dday-store-v174.js'])assert(fs.existsSync(path.join(root,'android-src/assets',name)),name);
  assert(!/<script[^>]+(?:site-calendar-v175|estate-ui-v171)\.js/.test(html));
});

test('v176 release: both site schedule open paths mount private date entries after the form opens',()=>{
  assert.equal((index.match(/openModal\('scheduleModal'\);window\.AiderPrivateCalendarUIV175\?\.scheduleOpened\(\)/g)||[]).length,2);
  const ui=read('private-calendar-ui-v175.js');assert.match(ui,/installScheduleEntries\(\)/);assert.match(ui,/!save\.hidden&&!save\.disabled&&!date\.disabled/);
  assert(!ui.includes("const calendarTools="));assert(!ui.includes("$('addEmotionTop')?.parentElement"));
});

test('v176 release: emotion save never creates or overwrites private-date flags; legacy originals survive emotion deletion',()=>{
  const start=index.indexOf("$('#emotionForm').addEventListener('submit'"),end=index.indexOf("$('#deleteEmotion').addEventListener",start);assert(start>0&&end>start);
  assert.doesNotMatch(index.slice(start,end),/existing\.(?:period|intimacy)\s*=|\b(?:period|intimacy)\s*:|#emotionPeriod|emotionView==='cycle'/);
  const configure=index.match(/function configureEmotionModal\(\)[^\n]+/)[0];assert(configure.includes("emotionView='journal'"));assert(configure.includes("$('#emotionCycleSection').hidden=true"));assert(configure.includes("$('#emotionPeriod').disabled=true"));
  const deletion=index.slice(end,index.indexOf('/* Emotion Insights interactions */',end));assert(deletion.includes('&&!entry.period&&!entry.intimacy'));
  assert.doesNotMatch(index,/<span class="period" title="생리일">P<\/span>/);
});

test('v176 release: private marker clicks on the shared emotion line open Schedule, while mood clicks still open emotion detail',()=>{
  const start=index.indexOf("status.addEventListener('click',ev=>{"),end=index.indexOf(';cell.appendChild(status)',start);assert(start>0&&end>start);
  const opened=[];let click;const local={status:{addEventListener:(name,fn)=>{assert.equal(name,'click');click=fn}},date:'2026-09-18',newEvent:(owner,date)=>opened.push(['schedule',owner,date]),renderEmotionDayDetail:date=>opened.push(['emotion',date])};vm.runInNewContext(index.slice(start,end),local);
  let stopped=0;click({stopPropagation:()=>stopped++,target:{closest:()=>({})}});click({stopPropagation:()=>stopped++,target:{closest:()=>null}});
  assert.deepEqual(opened,[['schedule','mine','2026-09-18'],['emotion','2026-09-18']]);assert.equal(stopped,2);
});
