const CACHE='aiderlog-v167-consult-work-site';
const LANGUAGE_FILES=['en','ja'].flatMap(language=>[1,2,3,4,5].map(level=>`./language-data-v2/data/${language}/level-${level}.json`));
const APP_SHELL=['./','./index.html','./client-intake.html','./firebase-app.js','./brain-3d.js','./paper-workspace-v121.js','./paper-workspace-v121.css','./paper-v159.js','./paper-v159.css','./paper-analysis-prompt-v159.txt','./paper-verification-prompt-v159.txt','./consult-model-v167.js','./consult-v167.js','./consult-v167.css','./consult-sync-v167.js','./work-client-v167.js','./site-work-v167.js','./site-work-v167.css','./site-ui-v167.js','./site-ui-v167.css','./site-polish-v158.js','./site-polish-v158.css','./site-editions-v164.js','./site-editions-v164.css','./site-modern-v165.css','./site-paper-modern-v165.css','./site-language-modern-v165.css','./site-layout-v165.js','./widget-sync-v162.js','./language-lab-v18-engine.js','./language-content-v149.js','./language-lab-v18.js','./language-lab-v18.css','./language-lab-v18-template.html','./language-data-v2/validation-report.json','./language-data-v2/data/manifest.json','./manifest.webmanifest','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg','./challenge-lunge-forward-animated-v100.webp','./challenge-lunge-reverse-animated-v100.webp','./challenge-lunge-side-animated-v100.webp','./challenge-squat-basic-animated-v100.webp','./challenge-squat-wide-animated-v100.webp','./challenge-squat-side-animated-v100.webp','./challenge-plank-forearm-animated-v100.webp','./challenge-plank-high-animated-v100.webp','./challenge-plank-side-animated-v100.webp','./challenge-burpee-animated-v100.webp','./challenge-burpee-stepback-animated-v103.webp','./challenge-burpee-pushup-animated-v103.webp',...LANGUAGE_FILES];

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
  if(requestUrl.pathname.startsWith('/api/'))return;
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

  const fresh=fetch(request).then(async response=>{
      if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(request,copy))}
      return response;
    });
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith(caches.match(request).then(cached=>cached||fresh).catch(()=>fresh));
});
