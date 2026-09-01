const CACHE='aiderlog-v98-account-challenge-apps';
const APP_SHELL=['./','./index.html','./client-intake.html','./firebase-app.js','./brain-3d.js','./language-lab-v18-engine.js','./language-lab-v18.js','./language-lab-v18.css','./language-lab-v18-template.html','./manifest.webmanifest','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg','./challenge-lunge-forward-animated-v95.webp','./challenge-lunge-reverse-animated-v95.webp','./challenge-lunge-side-animated-v95.webp','./challenge-squat-basic-animated-v95.webp','./challenge-squat-wide-animated-v95.webp','./challenge-squat-side-animated-v95.webp','./challenge-plank-forearm-animated-v95.webp','./challenge-plank-high-animated-v95.webp','./challenge-plank-side-animated-v95.webp','./challenge-burpee-sequence-v98.png'];

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
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;

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
