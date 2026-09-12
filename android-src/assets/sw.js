const CACHE='aiderlog-v175-private-calendar-insight';
const LANGUAGE_FILES=['en','ja'].flatMap(language=>[1,2,3,4,5].map(level=>`./language-data-v2/data/${language}/level-${level}.json`));
const APP_SHELL=['./firebase-app.js?v=175','./widget-sync-v164.js?v=175','./widget-ui-v165.js?v=175','./widget-models-v165.js?v=175','./app-consult-work-v168.js?v=175','./app-consult-work-v168.css?v=175','./work-client-v167.js?v=175','./consult-model-v167.js?v=175','./work-calendar-v168.js?v=175','./consult-intake-v168.js?v=175','./storage-maintenance-v168.js?v=175','./daylog-ui-v165.js?v=175','./routine-ui-v165.js?v=175','./event-ui-v164.js?v=175','./app-polish-v161.js?v=175','./app-polish-v160.js?v=175','./app-polish-v157.js?v=175','./wheel-navigation-v151.js?v=175','./app-feature-v152b.js?v=175','./experience-v145.js?v=175','./language-presentation-v166.js?v=175','./study-card-v1.js?v=175','./world-lab-year1-data.js?v=175','./my-suite-v145.js?v=175','./experience-v143.js?v=175','./my-paper-v166.css?v=175','./training-presentation-v166.css?v=175','./daylog-ui-v165.css?v=175','./routine-ui-v165.css?v=175','./event-ui-v164.css?v=175','./app-theme-v164.css?v=175','./app-files-v163.css?v=175','./app-polish-v161.css?v=175','./app-polish-v160.css?v=175','./app-polish-v159.css?v=175','./app-polish-v158.css?v=175','./app-polish-v157.css?v=175','./app-feature-v156.css?v=175','./app-polish-v155.css?v=175','./app-polish-v154.css?v=175','./app-polish-v153.css?v=175','./app-polish-v152.css?v=175','./app-polish-v150.css?v=175','./app-polish-v149.css?v=175','./app-feature-v148.css?v=175','./app-polish-v147.css?v=175','./study-card-v1.css?v=175','./experience-v145.css?v=175','./experience-v143.css?v=175','./experience-v142.js?v=175','./wheel-owner-v154.js?v=175','./experience-v142.css?v=175','./experience-v141.js?v=175','./experience-v141.css?v=175','./experience-v140.js?v=175','./experience-v140.css?v=175','./experience-v139.js?v=175','./experience-v138.js?v=175','./experience-v137.js?v=175','./experience-v136.js?v=175','./holographic-editorial-v135.js?v=175','./solar-material-v134.js?v=175','./planet-system-v133.js?v=175','./insight-motion-v132.js?v=175','./feature-polish-v128.js?v=175','./my-workspaces-v128.js?v=175','./mobile-paper-v159.js?v=175','./offline-training-v129.js?v=175','./paper-workspace-v128.js?v=175','./feature-polish-v127.js?v=175','./feature-fixes-v126.js?v=175','./global-cosmic-v126.js?v=175','./feature-system-v125.js?v=175','./global-icons-v126.js?v=175','./language-lab-v124.js?v=175','./event-support-v126.js?v=175','./event-cosmic-v120.js?v=175','./schedule-v119.js?v=175','./enhancements-v118.js?v=175','./my-v115.js?v=175','./language-v114.js?v=175','./features-v113.js?v=175','./routine-v111.js?v=175','./polish-v112.js?v=175','./event-v111.js?v=175','./routine-v110.js?v=175','./language-lab-v18.js?v=175','./language-content-v149.js?v=175','./language-lab-v18-engine.js?v=175','./experience-v139.css?v=175','./experience-v138.css?v=175','./experience-v137.css?v=175','./experience-v136.css?v=175','./holographic-editorial-v135.css?v=175','./solar-material-v134.css?v=175','./planet-system-v133.css?v=175','./space-ui-v131.css?v=175','./design-polish-v129.css?v=175','./offline-training-v129.css?v=175','./feature-polish-v128.css?v=175','./paper-workspace-v128.css?v=175','./feature-polish-v127.css?v=175','./feature-fixes-v126.css?v=175','./global-cosmic-v126.css?v=175','./feature-system-v125.css?v=175','./language-lab-v124.css?v=175','./routine-cosmic-v122.css?v=175','./cosmic-final-v121.css?v=175','./event-cosmic-v120.css?v=175','./schedule-v119.css?v=175','./enhancements-v118.css?v=175','./file-transfer-v163.js?v=175','./app-consult-work-v168.css','./app-consult-work-v168.js','./vendor/pako-2.1.0.min.js','./work-client-v167.js','./consult-model-v167.js','./work-calendar-v168.js','./consult-intake-v168.js','./storage-maintenance-v168.js','./archive-codec-v168.js','./event-ui-v164.js','./event-ui-v164.css','./app-theme-v164.css','./','./index.html','./file-transfer-v163.js','./app-files-v163.css','./client-intake.html','./firebase-app.js','./consult-sync-v167.js','./brain-3d.js','./paper-workspace-v128.js','./paper-workspace-v128.css','./mobile-paper-v159.js','./my-workspaces-v128.js','./my-suite-v145.js','./experience-v145.js','./experience-v145.css','./study-card-v1.js','./study-card-v1.css','./app-polish-v147.css','./app-polish-v158.css','./app-polish-v159.css','./app-polish-v160.css','./app-polish-v160.js','./app-polish-v161.css','./app-polish-v161.js','./world-lab-year1-data.js','./world-lab-year1-index.json','./world-lab-source-registry.json','./language-lab-v18-engine.js','./language-content-v149.js','./language-lab-v18.js','./language-lab-v18.css','./language-lab-v18-template.html','./language-data-v2/validation-report.json','./language-data-v2/data/manifest.json','./manifest.webmanifest','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg','./challenge-lunge-forward-animated-v100.webp','./challenge-lunge-reverse-animated-v100.webp','./challenge-lunge-side-animated-v100.webp','./challenge-squat-basic-animated-v100.webp','./challenge-squat-wide-animated-v100.webp','./challenge-squat-side-animated-v100.webp','./challenge-plank-forearm-animated-v100.webp','./challenge-plank-high-animated-v100.webp','./challenge-plank-side-animated-v100.webp','./challenge-burpee-animated-v100.webp','./challenge-burpee-stepback-animated-v103.webp','./challenge-burpee-pushup-animated-v103.webp',...LANGUAGE_FILES];

APP_SHELL.push('./my-paper-v166.css','./training-presentation-v166.css','./language-presentation-v166.js','./language-presentation-v166.css','./widget-sync-v164.js','./widget-models-v165.js','./widget-ui-v165.js','./routine-ui-v165.js','./routine-ui-v165.css','./daylog-ui-v165.js','./daylog-ui-v165.css');

const CALENDAR_FILES_V175=['private-calendar-v175.js','private-calendar-ui-v175.js','private-calendar-v175.css','friend-schedule-v175.js','friend-schedule-firebase-v175.js','dday-store-v174.js','app-dday-v175.js','app-calendar-v175.css','insight-range-v175.js','insight-range-v175.css','business-calendar-v175.js','business-calendar-v175.css','estate-calendar-v171.js','estate-client-v171.js','estate-domain-v171.js'];
APP_SHELL.push(...CALENDAR_FILES_V175.flatMap(name=>['./'+name,'./'+name+'?v=175']),...['anxiety','calm','excitement','gratitude','happiness','irritation','joy','loneliness','sadness','tired'].map(name=>'./mascots-v118/'+name+'.png'));
const SHELL_URLS_V175=new Set(APP_SHELL.map(value=>new URL(value,self.location.href).href));
const INDEX_URL_V175=new URL('./index.html',self.location.href),ROOT_URL_V175=new URL('./',self.location.href);

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll([...SHELL_URLS_V175])));
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
  if(requestUrl.pathname.includes('/downloads/')||/\.(?:apk|zip)$/i.test(requestUrl.pathname)||requestUrl.pathname.startsWith('/api/')||request.headers.has('Authorization'))return;

  if(request.mode==='navigate'){
    // Never replace the app's offline shell with an intake/shared/private page.
    if(![INDEX_URL_V175.pathname,ROOT_URL_V175.pathname].includes(requestUrl.pathname))return;
    event.respondWith(fetch(request).then(async response=>{
      if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put('./index.html',copy))}
      return response;
    }).catch(()=>caches.match('./index.html')));
    return;
  }

  // Only declared static shell files may enter Cache Storage. Account API and
  // downloaded customer/research files are never runtime-cached by this worker.
  if(!SHELL_URLS_V175.has(requestUrl.href))return;

  const fresh=fetch(request).then(async response=>{
    if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(request,copy))}
    return response;
  });
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith(caches.match(request).then(cached=>cached||fresh).catch(()=>fresh));
});
