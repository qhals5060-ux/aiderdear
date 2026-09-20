const CACHE='aiderlog-v192-site-modern';
const APP_SHELL=["./shared-schedule-v176.js","./shared-schedule-v176.js?v=192","./shared-schedule-v176.css","./shared-schedule-v176.css?v=192","./private-calendar-v175.js","./private-calendar-ui-v175.js","./private-calendar-v175.css","./friend-schedule-v175.js","./friend-schedule-firebase-v175.js","./friend-schedule-ui-v175.js","./friend-schedule-v175.css","./business-calendar-v175.js","./business-calendar-v175.css","./site-calendar-v175.js","./site-calendar-v175.css","./private-calendar-v175.js?v=192","./private-calendar-ui-v175.js?v=192","./private-calendar-v175.css?v=192","./friend-schedule-v175.js?v=192","./friend-schedule-firebase-v175.js?v=192","./friend-schedule-ui-v175.js?v=192","./friend-schedule-v175.css?v=192","./business-calendar-v175.js?v=192","./business-calendar-v175.css?v=192","./site-calendar-v175.js?v=192","./site-calendar-v175.css?v=192","./dday-store-v174.js","./dday-store-v174.js?v=192","./estate-cobroker-v173.css","./estate-cobroker-v173.css?v=192","./site-calendar-v172.js?v=192","./site-calendar-v172.css?v=192","./site-panels-v172.js?v=192","./site-panels-v172.css?v=192","./estate-calendar-view-v172.js?v=192","./estate-calendar-view-v172.css?v=192","./site-calendar-v172.js","./site-calendar-v172.css","./site-panels-v172.js","./site-panels-v172.css","./estate-calendar-view-v172.js","./estate-calendar-view-v172.css","./site-typography-v169.js?v=192","./site-typography-v169.css?v=192","./widget-sync-v162.js?v=192","./site-ui-v167.js?v=192","./site-ui-v167.css?v=192","./site-layout-v165.js?v=192","./site-editions-v164.js?v=192","./site-polish-v158.js?v=192","./consult-v167.js?v=192","./consult-deeplink-v168.js?v=192","./consult-intake-v168.js?v=192","./storage-maintenance-v168.js?v=192","./work-calendar-v168.js?v=192","./consult-model-v167.js?v=192","./consult-v167.css?v=192","./paper-v159.js?v=192","./paper-workspace-v121.js?v=192","./brain-3d.js?v=192","./firebase-app.js?v=192","./site-editions-v164.css?v=192","./site-modern-v165.css?v=192","./site-polish-v158.css?v=192","./site-typography-v169.js","./site-typography-v169.css","./consult-deeplink-v168.js","./vendor/pako-2.1.0.min.js","./work-calendar-v168.js","./consult-intake-v168.js","./storage-maintenance-v168.js","./archive-codec-v168.js","./","./index.html","./client-intake.html","./firebase-app.js","./brain-3d.js","./paper-workspace-v121.js","./paper-workspace-v121.css","./paper-v159.js","./paper-v159.css","./paper-analysis-prompt-v159.txt","./paper-verification-prompt-v159.txt","./consult-model-v167.js","./consult-v167.js","./consult-v167.css","./consult-sync-v167.js","./site-ui-v167.js","./site-ui-v167.css","./site-polish-v158.js","./site-polish-v158.css","./site-editions-v164.js","./site-editions-v164.css","./site-modern-v165.css","./site-paper-modern-v165.css","./site-layout-v165.js","./widget-sync-v162.js","./manifest.webmanifest","./aiderdear-icon.svg","./aiderdear-icon-180.png","./aiderdear-icon-192.png","./aiderdear-icon-512.png","./aiderdear-sky.jpg","./challenge-lunge-forward-animated-v100.webp","./challenge-lunge-reverse-animated-v100.webp","./challenge-lunge-side-animated-v100.webp","./challenge-squat-basic-animated-v100.webp","./challenge-squat-wide-animated-v100.webp","./challenge-squat-side-animated-v100.webp","./challenge-plank-forearm-animated-v100.webp","./challenge-plank-high-animated-v100.webp","./challenge-plank-side-animated-v100.webp","./challenge-burpee-animated-v100.webp","./challenge-burpee-stepback-animated-v103.webp","./challenge-burpee-pushup-animated-v103.webp","./estate-v171.js","./estate-v171.css","./estate-client-v171.js","./estate-domain-v171.js","./estate-directory-v171.js","./estate-directory-v171.css","./estate-workflow-v171.js","./estate-workflow-v171.css","./estate-calendar-v171.js","./estate-public-v171.js","./estate-public-v171.css","./estate-v171.js?v=192","./estate-v171.css?v=192","./estate-client-v171.js?v=192","./estate-domain-v171.js?v=192","./estate-directory-v171.js?v=192","./estate-directory-v171.css?v=192","./estate-workflow-v171.js?v=192","./estate-workflow-v171.css?v=192","./estate-calendar-v171.js?v=192","./estate-public-v171.js?v=192","./estate-public-v171.css?v=192","./android-session-v176.js","./android-session-v176.js?v=192","./photo-attachments-v176.js","./photo-attachments-v176.js?v=192","./photo-attachments-v176.css","./photo-attachments-v176.css?v=192","./dday-display-v176.js","./dday-display-v176.js?v=192","./dday-display-v176.css","./dday-display-v176.css?v=192","./retired-features-v178.js","./retired-features-v178.js?v=192","./schedule-time-v179.js","./schedule-time-v179.js?v=192","./site-calendar-v179.css","./site-calendar-v179.css?v=192","./schedule-editor-v179.css","./schedule-editor-v179.css?v=192","./consult-sync-v167.js?v=192","./archive-codec-v168.js?v=192","./todo-domain-v179.js","./todo-domain-v179.js?v=192","./vendor/pako-2.1.0.min.js?v=192","./app-estate-handoff-v180.js","./app-estate-handoff-v180.js?v=192","./calendar-sync-v184.js","./calendar-sync-v184.js?v=192"];
APP_SHELL.push('./site-event-routine-v189.css','./site-event-routine-v189.css?v=192');
APP_SHELL.push();
APP_SHELL.push("./bio-admin-domain-v192.js","./bio-admin-domain-v192.js?v=192","./bio-admin-client-v192.js","./bio-admin-client-v192.js?v=192","./bio-admin-v192.js","./bio-admin-v192.js?v=192","./bio-admin-v192.css","./bio-admin-v192.css?v=192");
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('aiderlog-')&&key!==CACHE).map(key=>caches.delete(key))))
  ]));
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  const requestUrl=new URL(request.url);
  if(request.method!=='GET'||requestUrl.origin!==self.location.origin)return;
  if(requestUrl.pathname.startsWith('/api/')||request.headers.has('Authorization'))return;
  if(/^\/estate-share(?:\.html)?\/?$/i.test(requestUrl.pathname)){
    // Expired/revoked public snapshots must never reopen from an offline HTML fallback.
    event.respondWith(fetch(request,{cache:'no-store',referrerPolicy:'no-referrer'}).catch(()=>new Response('공유 매물은 연결을 확인한 뒤 다시 열어주세요.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8','Cache-Control':'private, no-store','Referrer-Policy':'no-referrer','X-Robots-Tag':'noindex, nofollow, noarchive'}})));
    return;
  }
  if(/^\/employee(?:\/|\.html|$)/.test(requestUrl.pathname)){
    event.respondWith(fetch(request,{cache:'no-store'}).catch(()=>new Response('직원 페이지는 연결을 확인한 뒤 다시 열어주세요.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8','Cache-Control':'no-store'}})));
    return;
  }
  if(requestUrl.pathname.includes('/downloads/')||/AiderLog-[^/]+\.(apk|zip)$/i.test(requestUrl.pathname))return;

  if(request.mode==='navigate'){
    // Each document keeps its own fallback. Never let an intake/login HTML
    // replace the main app, and never persist query-string invitation tokens.
    const documentUrl=new URL(requestUrl.pathname==='/'?'./index.html':requestUrl.pathname,self.location.origin);
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok){
        const copy=response.clone();
        await caches.open(CACHE).then(cache=>cache.put(documentUrl.href,copy));
      }
      return response;
    }).catch(async()=>await caches.match(documentUrl.href)||new Response('연결을 확인한 뒤 다시 열어주세요.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}})));
    return;
  }

  // HTML is network-first. Its executable/styles must use the same freshness
  // policy: stale CSS can leave the previous pane display:grid!important even
  // after the new document selects another page. Keep offline reads available,
  // but never give an online page stale code while updating it in the background.
  const shellAsset=/\.(?:css|js|mjs|html|txt|webmanifest)$/i.test(requestUrl.pathname)
    ;
  if(shellAsset){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const response=await fetch(request,{cache:'no-cache'});
        if(response.ok){await cache.put(request,response.clone());return response;}
        return await cache.match(request)||response;
      }catch(error){
        const cached=await cache.match(request);
        if(cached)return cached;
        return new Response('오프라인 자료가 없습니다. 연결 후 다시 열어주세요.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
      }
    })());
    return;
  }

  const fresh=fetch(request).then(async response=>{
      if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(request,copy))}
      return response;
    });
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith(caches.match(request).then(cached=>cached||fresh).catch(()=>fresh));
});
