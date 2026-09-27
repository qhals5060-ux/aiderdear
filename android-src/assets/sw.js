const CACHE='aiderlog-v195-core';
const APP_SHELL=["./widget-calendar-sync-v195.js", "./routine-steps-model-v195.js", "./routine-steps-v195.js", "./routine-steps-v195.css", "./aiderdear-icon-180.png", "./aiderdear-icon-192.png", "./aiderdear-icon-512.png", "./aiderdear-icon.svg", "./android-session-v176.js", "./app-back-gesture-v176.js", "./app-calendar-v175.css", "./app-calendar-v179.css", "./app-calendar-v179.js", "./app-calendar-view-v176.js", "./app-compact-v186.css", "./app-compact-v186.js", "./app-core-v195.css", "./app-core-v195.js", "./app-data-sync-v191.js", "./app-dday-v175.js", "./app-design-v188.css", "./app-design-v188.js", "./app-feature-v148.css", "./app-feature-v152b.js", "./app-feature-v156.css", "./app-files-v163.css", "./app-fold-daily-v177.css", "./app-fold-layout-v177.css", "./app-fold-workspaces-v177.css", "./app-home-refine-v187.css", "./app-life-v188.css", "./app-life-v188.js", "./app-photo-attachments-v176.js", "./app-polish-v147.css", "./app-polish-v149.css", "./app-polish-v150.css", "./app-polish-v152.css", "./app-polish-v153.css", "./app-polish-v154.css", "./app-polish-v155.css", "./app-polish-v157.css", "./app-polish-v157.js", "./app-polish-v158.css", "./app-polish-v159.css", "./app-polish-v160.css", "./app-polish-v160.js", "./app-polish-v161.css", "./app-polish-v161.js", "./app-readability-v184.css", "./app-readability-v184.js", "./app-record-footers-v176.css", "./app-system-surfaces-v176.css", "./app-theme-primary-v176.css", "./app-theme-v164.css", "./app-todo-v179.css", "./app-todo-v179.js", "./archive-codec-v168.js", "./business-calendar-v175.css", "./business-calendar-v175.js", "./calendar-sync-v184.js", "./consult-sync-v167.js", "./cosmic-final-v121.css", "./daylog-ui-v165.css", "./daylog-ui-v165.js", "./dday-display-v176.css", "./dday-display-v176.js", "./dday-store-v174.js", "./design-polish-v129.css", "./enhancements-v118.css", "./enhancements-v118.js", "./event-cosmic-v120.css", "./event-cosmic-v120.js", "./event-routine-v186.css", "./event-routine-v186.js", "./event-support-v126.js", "./event-ui-v164.css", "./event-ui-v164.js", "./event-v111.js", "./experience-v136.css", "./experience-v136.js", "./experience-v137.css", "./experience-v137.js", "./experience-v138.css", "./experience-v138.js", "./experience-v139.css", "./experience-v139.js", "./experience-v140.css", "./experience-v140.js", "./experience-v141.css", "./experience-v141.js", "./experience-v142.css", "./experience-v142.js", "./experience-v143.css", "./experience-v143.js", "./experience-v145.css", "./feature-fixes-v126.css", "./feature-polish-v127.css", "./feature-polish-v127.js", "./feature-polish-v128.css", "./feature-polish-v128.js", "./feature-system-v125.css", "./feature-system-v125.js", "./features-v113.js", "./file-transfer-v163.js", "./firebase-app.js", "./friend-schedule-firebase-v175.js", "./friend-schedule-ui-v175.js", "./friend-schedule-v175.js", "./global-cosmic-v126.css", "./global-cosmic-v126.js", "./global-icons-v126.js", "./holographic-editorial-v135.css", "./holographic-editorial-v135.js", "./icon.svg", "./index.html", "./manifest.webmanifest", "./mobile-paper-v159.js", "./my-paper-v166.css", "./my-workspaces-v128.js", "./paper-workspace-v128.css", "./paper-workspace-v128.js", "./photo-attachments-v176.css", "./photo-attachments-v176.js", "./planet-system-v133.css", "./planet-system-v133.js", "./polish-v112.js", "./private-calendar-ui-v175.js", "./private-calendar-v175.css", "./private-calendar-v175.js", "./retired-features-v178.js", "./routine-cosmic-v122.css", "./routine-refine-v187.css", "./routine-refine-v187.js", "./routine-ui-v165.css", "./routine-ui-v165.js", "./routine-v110.js", "./routine-v111.js", "./schedule-editor-v179.css", "./schedule-time-v179.js", "./schedule-ui-v184.css", "./schedule-ui-v184.js", "./schedule-v119.css", "./schedule-v119.js", "./shared-schedule-v176.css", "./shared-schedule-v176.js", "./solar-material-v134.css", "./solar-material-v134.js", "./space-ui-v131.css", "./storage-maintenance-v168.js", "./todo-domain-v179.js", "./vendor/pako-2.1.0.min.js", "./vendor/pako-LICENSE.txt", "./wheel-navigation-v151.js", "./wheel-owner-v154.js", "./wheel-planet-v140.png", "./wheelbar-v176.css", "./wheelbar-v176.js", "./widget-models-v165.js", "./widget-sync-v164.js", "./widget-ui-v165.js"];
// Bound the cache to this release's public static shell only. User data,
// authentication pages, APIs and downloads never enter this cache.
const INDEX_URL=new URL('./index.html',self.location.href);
const ROOT_URL=new URL('./',self.location.href);
const SHELL_PATHS=new Set(APP_SHELL.map(value=>new URL(value,self.location.href).pathname));
const unavailable=()=>new Response('AiderLog offline shell is unavailable.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
function eligible(request,url){
  if(request.method!=='GET'||url.origin!==self.location.origin||request.headers.has('Authorization'))return false;
  if([...url.searchParams.keys()].some(key=>key!=='v'))return false;
  if(/(?:^|\/)(?:api|downloads)(?:\/|$)/.test(url.pathname)||/\.(?:apk|zip)$/i.test(url.pathname)||url.pathname.endsWith('/android-auth.html'))return false;
  return true;
}
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL.map(value=>new Request(new URL(value,self.location.href),{cache:'reload'})))));
});
self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([self.clients.claim(),caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('aiderlog-')&&key!==CACHE).map(key=>caches.delete(key))))]));
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(!eligible(request,url))return;
  if(request.mode==='navigate'){
    if(url.pathname!==INDEX_URL.pathname&&url.pathname!==ROOT_URL.pathname)return;
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{const response=await fetch(request,{cache:'no-cache'});if(response.ok){await cache.put(INDEX_URL.href,response.clone());return response;}}catch{}
      return await cache.match(INDEX_URL.href)||unavailable();
    })());return;
  }
  if(!SHELL_PATHS.has(url.pathname))return;
  // ?v=193 is a cache-busting deployment hint, not a separate stored copy.
  const canonical=new URL(url.pathname,url.origin).href;
  const fresh=(async()=>{const response=await fetch(request,{cache:'no-cache'});if(!response.ok)throw new Error('Static shell response unavailable');const cache=await caches.open(CACHE);await cache.put(canonical,response.clone());return response;})();
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith((async()=>{const cache=await caches.open(CACHE),cached=await cache.match(canonical);if(cached)return cached;try{return await fresh;}catch{return unavailable();}})());
});
