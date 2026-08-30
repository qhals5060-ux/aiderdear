const CACHE='aiderlog-v75-windows-widgets-brain-atlas-header';
const WIDGET_STATE_CACHE='aiderlog-widget-state-v1';
const WIDGET_STATE_URL=new URL('./__aiderlog_widget_state__',self.location.href).href;
const WIDGET_DEFINITIONS={
  'aiderlog-schedule':{key:'schedule',template:'./widgets/schedule-template.json',data:'./widgets/schedule-data.json',url:'./?widget=schedule'},
  'aiderlog-insights':{key:'insights',template:'./widgets/insights-template.json',data:'./widgets/insights-data.json',url:'./?widget=insights'},
  'aiderlog-clients':{key:'clients',template:'./widgets/clients-template.json',data:'./widgets/clients-data.json',url:'./?widget=clients'}
};
const APP_SHELL=['./','./index.html','./firebase-app.js','./brain-3d.js','./language-lab-v18-engine.js','./language-lab-v18.js','./language-lab-v18.css','./language-lab-v18-template.html','./manifest.webmanifest','./widgets/schedule-template.json','./widgets/schedule-data.json','./widgets/insights-template.json','./widgets/insights-data.json','./widgets/clients-template.json','./widgets/clients-data.json','./aiderdear-icon.svg','./aiderdear-icon-180.png','./aiderdear-icon-192.png','./aiderdear-icon-512.png','./aiderdear-sky.jpg'];

async function readJson(url){const absolute=new URL(url,self.location.href).href,response=await caches.match(absolute)||await fetch(absolute);return response.json()}
async function readText(url){const absolute=new URL(url,self.location.href).href,response=await caches.match(absolute)||await fetch(absolute);return response.text()}
async function readWidgetState(){const response=await caches.open(WIDGET_STATE_CACHE).then(cache=>cache.match(WIDGET_STATE_URL));return response?response.json():{selectedWidgets:['schedule']}}
async function saveWidgetState(payload){await caches.open(WIDGET_STATE_CACHE).then(cache=>cache.put(WIDGET_STATE_URL,new Response(JSON.stringify(payload),{headers:{'content-type':'application/json'}})))}
async function updateWidget(tag,payload){
  if(!self.widgets||!WIDGET_DEFINITIONS[tag])return;const definition=WIDGET_DEFINITIONS[tag],state=payload||await readWidgetState(),selected=(state.selectedWidgets||[]).includes(definition.key),template=await readText(definition.template),fallback=await readJson(definition.data),widgetData=selected?(state[definition.key]||fallback):{...fallback,empty:'AiderLog 설정에서 이 위젯을 선택해주세요.'},data=JSON.stringify(widgetData);
  if(typeof self.widgets.updateByTag==='function')await self.widgets.updateByTag(tag,{template,data});
  else if(typeof self.widgets.getByTag==='function'){const installed=await self.widgets.getByTag(tag);await Promise.all((installed||[]).map(widget=>widget.update({template,data})))}
}
async function updateAllWidgets(payload){await Promise.all(Object.keys(WIDGET_DEFINITIONS).map(tag=>updateWidget(tag,payload).catch(()=>{})))}

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('aiderlog-')&&key!==CACHE&&key!==WIDGET_STATE_CACHE).map(key=>caches.delete(key)))),
    updateAllWidgets().catch(()=>{})
  ]));
});

self.addEventListener('message',event=>{if(event.data?.type!=='AIDERLOG_WIDGET_DATA')return;event.waitUntil((async()=>{await saveWidgetState(event.data.payload||{});await updateAllWidgets(event.data.payload||{})})())});
self.addEventListener('widgetinstall',event=>{const tag=event.widget?.definition?.tag||event.widget?.tag;event.waitUntil(tag?updateWidget(tag):Promise.resolve())});
self.addEventListener('widgetresume',event=>{const tag=event.widget?.definition?.tag||event.widget?.tag;event.waitUntil(tag?updateWidget(tag):updateAllWidgets())});
self.addEventListener('widgetclick',event=>{const tag=event.widget?.definition?.tag||event.widget?.tag,definition=WIDGET_DEFINITIONS[tag];if(!definition)return;event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{const url=new URL(definition.url,self.location.href).href,existing=clients[0];if(existing){await existing.focus();return existing.navigate(url)}return self.clients.openWindow(url)}))});

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
