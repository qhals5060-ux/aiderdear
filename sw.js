const CACHE='aiderlog-v153-fresh-install-recovery';
const LANGUAGE_FILES=['en','ja','zh'].flatMap(language=>[1,2,3,4,5].map(level=>`./language-data-v2/data/${language}/level-${level}.json`));
const APP_SHELL=['./','./index.html','./client-intake.html','./firebase-app.js','./brain-3d.js','./paper-workspace-v121.js','./paper-workspace-v121.css','./site-work-v146.js','./site-work-v146.css','./language-lab-v18-engine.js','./language-content-v149.js','./language-lab-v18.js','./language-lab-v18.css','./language-lab-v18-template.html','./language-data-v2/validation-report.json','./language-data-v2/data/manifest.json','./manifest.webmanifest','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg','./challenge-lunge-forward-animated-v100.webp','./challenge-lunge-reverse-animated-v100.webp','./challenge-lunge-side-animated-v100.webp','./challenge-squat-basic-animated-v100.webp','./challenge-squat-wide-animated-v100.webp','./challenge-squat-side-animated-v100.webp','./challenge-plank-forearm-animated-v100.webp','./challenge-plank-high-animated-v100.webp','./challenge-plank-side-animated-v100.webp','./challenge-burpee-animated-v100.webp','./challenge-burpee-stepback-animated-v103.webp','./challenge-burpee-pushup-animated-v103.webp',...LANGUAGE_FILES];

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
  if(requestUrl.pathname.includes('/downloads/')||/AiderLog-v\d+\.(apk|zip)$/i.test(requestUrl.pathname))return;

  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok){
        const copy=response.clone();
        await caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
      }
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }

  const fresh=fetch(request).then(async response=>{
      if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(request,copy))}
      return response;
    });
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith(caches.match(request).then(cached=>cached||fresh).catch(()=>fresh));
});
