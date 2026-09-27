const CACHE='aiderlog-v198-site-core';
const APP_SHELL=["./calendar-colors-v198.js", "./site-calendar-colors-v198.css",
  "./aiderdear-icon-180.png",
  "./aiderdear-icon-192.png",
  "./aiderdear-icon-512.png",
  "./aiderdear-icon.svg",
  "./aiderdear-sky.jpg",
  "./android-session-v176.js",
  "./archive-codec-v168.js",
  "./brain-3d.js",
  "./business-calendar-v175.css",
  "./business-calendar-v175.js",
  "./calendar-sync-v184.js",
  "./consult-sync-v167.js",
  "./dday-display-v176.css",
  "./dday-display-v176.js",
  "./dday-store-v174.js",
  "./firebase-app.js",
  "./friend-schedule-firebase-v175.js",
  "./friend-schedule-ui-v175.js",
  "./friend-schedule-v175.css",
  "./friend-schedule-v175.js",
  "./index.html",
  "./manifest.webmanifest",
  "./paper-analysis-prompt-v159.txt",
  "./paper-v159.css",
  "./paper-v159.js",
  "./paper-verification-prompt-v159.txt",
  "./paper-workspace-v121.css",
  "./paper-workspace-v121.js",
  "./photo-attachments-v176.css",
  "./photo-attachments-v176.js",
  "./private-calendar-ui-v175.js",
  "./private-calendar-v175.css",
  "./private-calendar-v175.js",
  "./retired-features-v178.js",
  "./schedule-editor-v179.css",
  "./schedule-time-v179.js",
  "./schedule-tools-v194.css",
  "./shared-schedule-v176.css",
  "./shared-schedule-v176.js",
  "./site-calendar-v172.css",
  "./site-calendar-v172.js",
  "./site-calendar-v175.css",
  "./site-calendar-v175.js",
  "./site-calendar-v179.css",
  "./site-editions-v164.css",
  "./site-editions-v164.js",
  "./site-event-routine-v189.css",
  "./site-layout-v165.js",
  "./site-modern-v165.css",
  "./site-panels-v172.css",
  "./site-panels-v172.js",
  "./site-paper-modern-v165.css",
  "./site-polish-v158.css",
  "./site-polish-v158.js",
  "./site-typography-v169.css",
  "./site-typography-v169.js",
  "./site-ui-v167.css",
  "./site-ui-v167.js",
  "./storage-maintenance-v168.js",
  "./todo-domain-v179.js",
  "./vendor/pako-2.1.0.min.js",
  "./widget-sync-v162.js"
];
const SHELL_PATHS=new Set(APP_SHELL.map(asset=>new URL(asset,self.location.href).pathname));
const retiredPath=path=>/^\/(?:employee|estate-share|client-intake)(?:\/|\.html|$)/i.test(path);
const offline=()=>new Response('오프라인 자료가 없습니다. 연결 후 다시 열어주세요.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL.map(asset=>new Request(new URL(asset,self.location.href),{cache:'reload'})))));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('aiderlog-')&&key!==CACHE).map(key=>caches.delete(key))))
  ]));
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/')||request.headers.has('Authorization'))return;
  if(url.pathname==='/android-auth.html'||url.pathname.startsWith('/__/auth'))return;
  if([...url.searchParams.keys()].some(name=>name!=='v'))return;
  if(retiredPath(url.pathname)){
    event.respondWith(Promise.resolve(new Response('이 기능은 종료되었습니다. SCHEDULE, ROUTINE, EVENT, PAPER를 이용해주세요.',{status:410,headers:{'Content-Type':'text/plain;charset=utf-8','Cache-Control':'no-store'}})));
    return;
  }
  if(url.pathname.includes('/downloads/')||/AiderLog-[^/]+\.(apk|zip)$/i.test(url.pathname))return;
  const path=url.pathname==='/'?new URL('./index.html',self.location.href).pathname:url.pathname;
  if(!SHELL_PATHS.has(path))return;
  // Only known static shell assets share a query-free key. Tokens, API data,
  // user media and retired feature files never enter this bounded cache.
  const key=new URL(path,self.location.origin).href;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(request,{cache:'no-cache'});
      if(response.ok){await cache.put(key,response.clone());return response;}
      return await cache.match(key,{ignoreSearch:true})||response;
    }catch{
      return await cache.match(key,{ignoreSearch:true})||offline();
    }
  })());
});
