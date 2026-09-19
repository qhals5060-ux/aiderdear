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
const packaging = read('scripts/package-pc-v184.ps1');
const release=Number(process.env.AIDERLOG_SITE_VERSION||index.match(/name="aiderlog-build" content="v(\d+)"/)?.[1]);
const androidRelease=Number(process.env.AIDERLOG_ANDROID_VERSION||index.match(/name="aiderlog-android-build" content="v(\d+)"/)?.[1]);
assert([179,180,181,182,183,184].includes(release),'Supported release metadata is required');
assert([179,180,181,182,183,184,185].includes(androidRelease),'Supported Android release metadata is required');
const releaseTest=(name,fn)=>test(`v${release} release: ${name}`,fn);
const retained = [...['calendar','panels'].flatMap(name => ['js','css'].map(ext => `site-${name}-v172.${ext}`)), 'estate-calendar-view-v172.js', 'estate-calendar-view-v172.css', 'estate-cobroker-v173.css', 'dday-store-v174.js'];
const added = ['shared-schedule-v176.js','shared-schedule-v176.css','private-calendar-v175.js','private-calendar-ui-v175.js','private-calendar-v175.css','friend-schedule-v175.js','friend-schedule-firebase-v175.js','friend-schedule-ui-v175.js','friend-schedule-v175.css','business-calendar-v175.js','business-calendar-v175.css','site-calendar-v175.js','site-calendar-v175.css','todo-domain-v179.js','schedule-time-v179.js','schedule-editor-v179.css','site-calendar-v179.css'];
const events = new Map();
added.push('android-session-v176.js','photo-attachments-v176.js','photo-attachments-v176.css');
added.push('dday-display-v176.js','dday-display-v176.css','retired-features-v178.js');
const context = vm.createContext({self:{addEventListener:(name, handler) => events.set(name, handler),location:{origin:'https://aiderdear1.vercel.app'}},URL});
vm.runInContext(sw, context);
const shell = Array.from(vm.runInContext('APP_SHELL', context));
const localDependencies = html => [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"'<>]+\.(?:m?js|css)(?:[?#][^"'<>]*)?)["']/g)].map(row=>row[1]).filter(value=>!/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/.test(value));

releaseTest('site and PC downloads retain their release independently of Android', () => {
  assert(index.includes(`<meta name="aiderlog-build" content="v${release}">`));
  assert(index.includes(`<meta name="aiderlog-android-build" content="v${androidRelease}">`));
  assert(index.includes(`href="./AiderLog-v${androidRelease}.apk" download="AiderLog-v${androidRelease}.apk"`));
  for(const match of index.matchAll(/AiderLog-v(\d+)\.apk/g))assert.equal(Number(match[1]),androidRelease);
  for (const edition of ['Modern','Editorial']) assert(index.includes(`href="./AiderLog-${edition}-v${release}-site-files.zip" download="AiderLog-${edition}-v${release}-site-files.zip"`));
  for(const match of index.matchAll(/AiderLog-(?:Modern|Editorial)-v(\d+)-site-files\.zip/g))assert.equal(Number(match[1]),release);
  const apk=read('android-src/apktool.yml');assert.match(apk,new RegExp(`versionCode: ${androidRelease}\\s`));assert(apk.includes(`apkFileName: AiderLog-v${androidRelease}.apk`));
  if(androidRelease===185){assert.equal(release,184,'an app-only release must keep the restored site build');assert.match(apk,/versionName: 1\.9\.75\s/);assert.doesNotMatch(index,/schedule-ui-v18[45]|app-readability-v18[45]|AiderScheduleUIBridgeV184/);}
});

releaseTest('production probe checks Android v185 independently of the unchanged site and sync API',async()=>{
  const {verifyProduction}=require('../scripts/verify-production-v185.cjs');
  async function fixture({oldApk=false,advanceSite=false}={}){
    const requests=[];
    const fetchImpl=async(input,options)=>{
      const url=new URL(input);requests.push({url:url.href,method:options.method});
      if(url.hostname==='github.com')return new Response(null,{status:200,headers:{'content-length':'1024'}});
      const redirect=config.redirects.find(row=>row.source===url.pathname);
      if(redirect)return new Response(null,{status:307,headers:{location:oldApk&&url.pathname.endsWith('.apk')?redirect.destination.replaceAll('v185','v184'):redirect.destination}});
      if(url.pathname==='/')return new Response(advanceSite?index.replace('name="aiderlog-build" content="v184"','name="aiderlog-build" content="v185"'):index);
      if(url.pathname==='/api/calendar-sync')return new Response(JSON.stringify({ok:true,configured:{publicAppUrl:true,firebaseAdmin:true,stateSecret:true,cronSecret:true,googleOAuth:true}}),{headers:{'x-aiderlog-calendar-api':'184'}});
      return new Response(read(url.pathname.slice(1)),{headers:{'content-type':'text/javascript'}});
    };
    return {result:await verifyProduction('https://release-fixture.invalid/',{fetchImpl}),requests};
  }
  const {result,requests}=await fixture();assert(result.ok,JSON.stringify(result.checks.filter(row=>!row.ok)));assert.equal(result.siteVersion,184);assert.equal(result.calendarApiVersion,184);assert.equal(result.version,185);assert.equal(result.binaryDownloadBytes,0);
  assert(requests.filter(row=>/\.(apk|zip)$/.test(row.url)).every(row=>row.method==='HEAD'),'release verification must not download binaries');
  assert.equal((await fixture({oldApk:true})).result.ok,false,'stale APK redirects are rejected');
  assert.equal((await fixture({advanceSite:true})).result.ok,false,'an unintended site build change is rejected');
});

releaseTest('all local site entry dependencies exist and use current release queries', () => {
  for(const value of localDependencies(index)){
    const url = new URL(value,'https://archive.invalid/');
    assert(fs.existsSync(path.join(root,decodeURIComponent(url.pathname.slice(1)))),value);
    if(url.searchParams.has('v'))assert.equal(url.searchParams.get('v'),String(release),value);
  }
});

releaseTest('ESTATE and co-broker retain source filenames while entry queries advance', () => {
  for(const name of ['estate-v171.js','estate-v171.css','estate-calendar-v171.js','estate-directory-v171.css','estate-workflow-v171.css','estate-cobroker-v173.css']){
    assert(index.includes(`./${name}?v=${release}`));assert(shell.includes(`./${name}?v=${release}`));
  }
  assert(!/estate(?:-(?:client|domain|directory|workflow|calendar|public))?-v175/.test(index+sw+packaging));
});

releaseTest('retained and new browser modules are packaged and cached with and without queries', () => {
  for(const name of [...retained,...added]){
    assert(fs.existsSync(path.join(root,name)),name);assert(shell.includes(`./${name}`),name);
    assert(shell.includes(`./${name}?v=${release}`),name+' query');assert(packaging.includes(`'${name}'`),name+' packaging');
  }
  for(const name of retained.filter(name=>name.includes('-v172.')))assert(shell.includes(`./${name}`),'internal queryless dependency: '+name);
  assert(!fs.existsSync(path.join(root,'site-language-v172.js')),'language presentation was explicitly retired');
  assert(read('estate-v171.js').includes("from './estate-calendar-view-v172.js'"));
});

releaseTest('new shared UI modules are mounted once, model modules are statically imported', () => {
  const entries=['shared-schedule-v176.js','site-calendar-v175.js','private-calendar-ui-v175.js','friend-schedule-ui-v175.js','business-calendar-v175.js','schedule-time-v179.js'];
  for(const name of entries)assert.equal(localDependencies(index).filter(value=>new URL(value,'https://archive.invalid/').pathname==='/'+name).length,1,name);
  for(const name of ['dday-store-v174.js','private-calendar-v175.js','friend-schedule-firebase-v175.js','todo-domain-v179.js']){
    assert(read('firebase-app.js').includes(`from './${name}'`),name);assert(!index.includes(`src="./${name}`),'not double-mounted: '+name);
  }
});

releaseTest('service worker has new version key, unique existing pre-cache paths', () => {
  assert.equal(vm.runInContext('CACHE',context),release===184?'aiderlog-v184-site-original-design-r1':`aiderlog-v${release}-site-calendar-todo`);
  assert.equal(new Set(shell).size,shell.length);
  for(const value of shell){const name=decodeURIComponent(new URL(value,'https://archive.invalid/').pathname.slice(1))||'index.html';assert(fs.existsSync(path.join(root,name)),name);}
});

releaseTest('private records, share links, API responses and binaries are never pre-cached', () => {
  for(const value of shell)assert(!/\/api\/|estate-share(?:\.html)?(?:\?|$)|\/employee(?:\.html|\/)|\.(?:apk|zip)(?:\?|$)|[?&](?:token|idToken|access_token)=/i.test(value),value);
  assert(!shell.some(value=>/privateCalendar\/|scheduleShares\/|\/users\//.test(value)));
});

releaseTest('service worker bypasses API, authenticated, cross-origin, binary and non-GET requests', () => {
  for(const options of [
    {url:'https://aiderdear1.vercel.app/api/estate'},
    {url:'https://aiderdear1.vercel.app/private-calendar-v175.js',auth:true},
    {url:`https://aiderdear1.vercel.app/AiderLog-Modern-v${release}-site-files.zip`},
    {url:`https://aiderdear1.vercel.app/AiderLog-v${androidRelease}.apk`},
    {url:`https://aiderdear1.vercel.app/AiderLog-v${androidRelease-1}.apk`},
    {url:'https://firestore.googleapis.com/v1/projects/fixture/documents/privateCalendar/a'},
    {url:'https://aiderdear1.vercel.app/index.html',method:'POST'}
  ]){
    let intercepts=0;events.get('fetch')({request:{url:options.url,method:options.method||'GET',headers:{has:name=>name==='Authorization'&&!!options.auth}},respondWith:()=>intercepts++,waitUntil:()=>intercepts++});
    assert.equal(intercepts,0,JSON.stringify(options));
  }
  assert(sw.includes("fetch(request,{cache:'no-store',referrerPolicy:'no-referrer'})"));assert(sw.includes("fetch(request,{cache:'no-store'})"));
});

releaseTest('old PC/APK download URLs redirect directly without loops or permanent caching', () => {
  for(const edition of ['Modern','Editorial'])for(const version of [165,167,168,169,170,171,172,173,174,175,176,178,...Array.from({length:release-179},(_,i)=>179+i)]){
    const row=config.redirects.find(row=>row.source===`/AiderLog-${edition}-v${version}-site-files.zip`);
    assert(row,`${edition} ${version}`);assert.equal(row.destination,`https://github.com/qhals5060-ux/aiderdear/releases/download/v${release}/AiderLog-${edition}-v${release}-site-files.zip`);assert.equal(row.permanent,false);
  }
  for(const version of Array.from({length:androidRelease-165+1},(_,i)=>165+i))assert(config.redirects.some(row=>row.source===`/AiderLog-v${version}.apk`),String(version));
  for(const row of config.redirects.filter(row=>row.source.endsWith('.apk'))){assert.equal(row.destination,`https://github.com/qhals5060-ux/aiderdear/releases/download/v${androidRelease}/AiderLog-v${androidRelease}.apk`);assert.equal(row.permanent,false);}
  assert(!config.redirects.some(row=>row.source===row.destination));
  assert.equal(new Set(config.redirects.map(row=>row.source)).size,config.redirects.length,'No duplicate redirect sources');
});

releaseTest('correct ZIP/APK attachment headers and private customer-share policy survive', () => {
  for(const [name,assetRelease] of [[`AiderLog-Modern-v${release}-site-files.zip`,release],[`AiderLog-Editorial-v${release}-site-files.zip`,release],[`AiderLog-v${androidRelease}.apk`,androidRelease]]){
    const redirect=config.redirects.find(row=>row.source==='/'+name);assert(redirect,name);
    assert.equal(redirect.destination,`https://github.com/qhals5060-ux/aiderdear/releases/download/v${assetRelease}/${name}`);
    assert(!config.headers.some(row=>row.source==='/'+name),'Redirects must not retain binary cache headers');
    for(const ignore of ['.gitignore','.vercelignore'])assert(read(ignore).includes('AiderLog-v*.apk')&&read(ignore).includes('AiderLog-*-site-files.zip'));
  }
  const share=config.headers.find(row=>row.source==='/estate-share.html');assert(share.headers.some(row=>row.key==='Cache-Control'&&row.value==='private, no-store'));
  for(const row of config.headers){const match=row.source.match(/AiderLog-(?:Modern|Editorial)-v(\d+)-site-files/);if(match)assert.equal(Number(match[1]),release);}
  for(const row of config.headers){const match=row.source.match(/AiderLog-v(\d+)\.apk/);if(match)assert.equal(Number(match[1]),androidRelease,'Old APK redirects must not retain immutable artifact headers');}
});

releaseTest('PC packaging preserves source bytes, edition boundaries and recoverable previous archives', () => {
  assert(packaging.includes("'/?release='+$Version+'&site-edition='"));assert(packaging.includes('$pcIndexText -cne $pcExpectedIndex'));assert(packaging.includes('$pcHtml -cne $pcSourceIndex'));
  for(const guard of ['Browser source bytes changed:','Browser source changed between editions:','Browser source changed before publishing:','Previous archive backup verification failed:','Published archive copy verification failed:','Forbidden archive entry:'])assert(packaging.includes(guard),guard);
  assert(packaging.includes('"AiderLog-v$Version.apk","AiderLog-Modern-v$Version-site-files.zip","AiderLog-Editorial-v$Version-site-files.zip"'));
  assert(packaging.includes('Keep old published releases until the coordinator has passed live gates.'));
});

releaseTest('Android includes required shared domain dependencies and no desktop-only calendar layout', () => {
  const html=read('android-src/assets/index.html');
  for(const name of ['shared-schedule-v176.js','shared-schedule-v176.css','wheelbar-v176.js','wheelbar-v176.css','private-calendar-ui-v175.js','private-calendar-v175.css','business-calendar-v175.js','business-calendar-v175.css','app-dday-v175.js','app-calendar-v175.css','app-calendar-v179.js','app-calendar-v179.css','app-todo-v179.js','app-todo-v179.css','schedule-time-v179.js','schedule-editor-v179.css','friend-schedule-ui-v175.js'])assert(html.includes(name),name);
  for(const name of ['firebase-app.js','private-calendar-v175.js','friend-schedule-v175.js','friend-schedule-firebase-v175.js','dday-store-v174.js','todo-domain-v179.js'])assert(fs.existsSync(path.join(root,'android-src/assets',name)),name);
  assert(!/<script[^>]+(?:site-calendar-v175|estate-ui-v171)\.js/.test(html));
});

releaseTest('both site schedule open paths mount private date entries after the form opens',()=>{
  assert.equal((index.match(/openModal\('scheduleModal'\);window\.AiderPrivateCalendarUIV175\?\.scheduleOpened\(\)/g)||[]).length,2);
  const ui=read('private-calendar-ui-v175.js');assert.match(ui,/installScheduleEntries\(\)/);assert.match(ui,/!save\.hidden&&!save\.disabled&&!date\.disabled/);
  assert(!ui.includes("const calendarTools="));assert(!ui.includes("$('addEmotionTop')?.parentElement"));
});

releaseTest('removed emotion entrypoints cannot be loaded, cached or shipped in PC archives',()=>{
  const appIndex=read('android-src/assets/index.html'),appSw=read('android-src/assets/sw.js');
  for(const name of ['insight-range-v175.js','insight-range-v175.css','insight-motion-v132.js']){
    assert(!fs.existsSync(path.join(root,name)),name);assert(!index.includes(name),name+' site');assert(!appIndex.includes(name),name+' app');assert(!sw.includes(name),name+' site cache');assert(!appSw.includes(name),name+' app cache');
  }
  for(const name of ['feature-fixes-v126.js','experience-v145.js']){assert(!appIndex.includes(name),name);assert(!appSw.includes(name),name);assert(!fs.existsSync(path.join(root,'android-src/assets',name)),name);}
  for(const html of [index,appIndex])assert.doesNotMatch(html,/id=["'](?:emotionModal|emotionForm|emotionInsightPage|emotionDetailModal)["']/);
  assert(packaging.includes('Retired browser feature still present:'));assert.doesNotMatch(read('firebase-app.js'),/async function (?:writeEmotionData|readEmotionData|watchEmotionData)\(/);
});

releaseTest('date cells and private markers open the same schedule without intercepting existing event pills',()=>{
  const start=index.indexOf('const addForDay=event=>{'),end=index.indexOf(';cell.addEventListener(',start);assert(start>0&&end>start);
  const opened=[];const local={date:'2026-09-18',newEvent:(owner,date)=>opened.push([owner,date])};vm.runInNewContext(index.slice(start,end)+';globalThis.openDate=addForDay',local);
  let prevented=0;const event=(type,kind,key)=>({type,key,preventDefault:()=>prevented++,target:{closest:selector=>selector==='[data-private-calendar-marker]'?kind==='private':kind!=='cell'}});
  local.openDate(event('click','cell'));local.openDate(event('click','private'));local.openDate(event('click','pill'));local.openDate(event('keydown','cell','Enter'));local.openDate(event('keydown','cell','Escape'));
  assert.deepEqual(opened,[['mine','2026-09-18'],['mine','2026-09-18'],['mine','2026-09-18']]);assert.equal(prevented,3);
});
