const CACHE='aiderlog-v67-main-recovery';
const APP_SHELL=['./','./index.html','./firebase-app.js','./brain-3d.js','./manifest.webmanifest','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg','./language-study/index.html','./language-study/styles.css','./language-study/app.js','./language-study/manifest.webmanifest','./language-study/icon.svg'];

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
    const url=new URL(request.url);
    const isLanguage=url.pathname.includes('/language-study/');
    const fallback=isLanguage?'./language-study/index.html':'./index.html';
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok){
        const copy=response.clone();
        await caches.open(CACHE).then(cache=>cache.put(isLanguage?request:'./index.html',copy));
      }
      return response;
    }).catch(()=>caches.match(isLanguage?request:fallback).then(cached=>cached||caches.match(fallback))));
    return;
  }

  const fresh=fetch(request).then(async response=>{
      if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(request,copy))}
      return response;
    });
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith(caches.match(request).then(cached=>cached||fresh).catch(()=>fresh));
});
