const CACHE='aiderlog-v172-site-layout';
const LANGUAGE_FILES=['en','ja'].flatMap(language=>[1,2,3,4,5].map(level=>`./language-data-v2/data/${language}/level-${level}.json`));
// Cache public executable assets only, never owner records, API responses or token-bearing HTML.
const ESTATE_FILES=["./estate-v171.js","./estate-v171.css","./estate-client-v171.js","./estate-domain-v171.js","./estate-directory-v171.js","./estate-directory-v171.css","./estate-workflow-v171.js","./estate-workflow-v171.css","./estate-calendar-v171.js","./estate-public-v171.js","./estate-public-v171.css"];
const SITE_LAYOUT_FILES=["./site-calendar-v172.js","./site-calendar-v172.css","./site-language-v172.js","./site-language-v172.css","./site-panels-v172.js","./site-panels-v172.css","./estate-calendar-view-v172.js","./estate-calendar-view-v172.css"];
const APP_SHELL=[...SITE_LAYOUT_FILES,...SITE_LAYOUT_FILES.map(path=>`${path}?v=172`),'./site-typography-v169.js?v=172','./site-typography-v169.css?v=172','./widget-sync-v162.js?v=172','./site-ui-v167.js?v=172','./site-ui-v167.css?v=172','./site-layout-v165.js?v=172','./site-editions-v164.js?v=172','./site-polish-v158.js?v=172','./site-work-v167.js?v=172','./consult-v167.js?v=172','./consult-deeplink-v168.js?v=172','./consult-intake-v168.js?v=172','./storage-maintenance-v168.js?v=172','./work-calendar-v168.js?v=172','./consult-model-v167.js?v=172','./consult-v167.css?v=172','./paper-v159.js?v=172','./paper-workspace-v121.js?v=172','./language-lab-v18.js?v=172','./language-content-v149.js?v=172','./language-lab-v18-engine.js?v=172','./brain-3d.js?v=172','./firebase-app.js?v=172','./site-editions-v164.css?v=172','./site-modern-v165.css?v=172','./site-polish-v158.css?v=172','./site-work-v167.css?v=172','./employee-auth-v167.js?v=172','./employee-v167.js?v=172','./work-client-v167.js?v=172','./employee-v167.css?v=172','./site-typography-v169.js','./site-typography-v169.css','./consult-deeplink-v168.js','./vendor/pako-2.1.0.min.js','./work-calendar-v168.js','./consult-intake-v168.js','./storage-maintenance-v168.js','./archive-codec-v168.js','./','./index.html','./client-intake.html','./firebase-app.js','./brain-3d.js','./paper-workspace-v121.js','./paper-workspace-v121.css','./paper-v159.js','./paper-v159.css','./paper-analysis-prompt-v159.txt','./paper-verification-prompt-v159.txt','./consult-model-v167.js','./consult-v167.js','./consult-v167.css','./consult-sync-v167.js','./work-client-v167.js','./site-work-v167.js','./site-work-v167.css','./site-ui-v167.js','./site-ui-v167.css','./site-polish-v158.js','./site-polish-v158.css','./site-editions-v164.js','./site-editions-v164.css','./site-modern-v165.css','./site-paper-modern-v165.css','./site-language-modern-v165.css','./site-layout-v165.js','./widget-sync-v162.js','./language-lab-v18-engine.js','./language-content-v149.js','./language-lab-v18.js','./language-lab-v18.css','./language-lab-v18-template.html','./language-data-v2/validation-report.json','./language-data-v2/data/manifest.json','./manifest.webmanifest','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg','./challenge-lunge-forward-animated-v100.webp','./challenge-lunge-reverse-animated-v100.webp','./challenge-lunge-side-animated-v100.webp','./challenge-squat-basic-animated-v100.webp','./challenge-squat-wide-animated-v100.webp','./challenge-squat-side-animated-v100.webp','./challenge-plank-forearm-animated-v100.webp','./challenge-plank-high-animated-v100.webp','./challenge-plank-side-animated-v100.webp','./challenge-burpee-animated-v100.webp','./challenge-burpee-stepback-animated-v103.webp','./challenge-burpee-pushup-animated-v103.webp',...LANGUAGE_FILES,...ESTATE_FILES,...ESTATE_FILES.map(path=>`${path}?v=172`)];

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
    || requestUrl.pathname==='/language-data-v2/data/manifest.json';
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
