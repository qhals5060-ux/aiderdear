'use strict';
// Read-only negative controls, extracted from the project's actual Git history.
// Only relevant function boundaries are retained; this is never a runtime asset.
// Removing process/git dependencies also permits source-only archive verification.
exports.staleWorker = String.raw`
const CACHE='aiderlog-v168-native-widgets-lossless-storage';
// Exact fetch tail from f847af6340459c25e07e69654b007f9cc872817b:sw.js.
self.addEventListener('fetch',event=>{
  const request=event.request;
  const fresh=fetch(request).then(async response=>{
      if(response.ok){const copy=response.clone();await caches.open(CACHE).then(cache=>cache.put(request,copy))}
      return response;
    });
  event.waitUntil(fresh.then(()=>undefined).catch(()=>undefined));
  event.respondWith(caches.match(request).then(cached=>cached||fresh).catch(()=>fresh));
});`;
exports.reattachingLayout = String.raw`
// Exact relevant functions from 3134bde:site-layout-v165.js. Empty adjacent
// boundary sentinels are for the existing production-function extractor only.
  function move(node,parent,before=null){
    if(!node||!parent)return;
    if(!moves.has(node)){const marker=document.createComment('modern-v165-original-position');node.before(marker);moves.set(node,marker);}
    if(node.parentNode!==parent||(before&&node.nextSibling!==before))parent.insertBefore(node,before);
  }
  function make(){}
  function arrangeHeader(){
    move($('.tabs',app),head,$('.nav-tools',head));
    // The edition controller owns the original toolbar marker and Editorial restore.
    const tools=$('.nav-tools',app);if(tools&&tools.parentNode!==head)head.append(tools);
    if(head.lastElementChild!==dock)head.append(dock);
    const active=groups.find(row=>row.tab===app.dataset.activeTab);
    for(const group of groups){move(group.node,dock,choice);group.node.hidden=group!==active||group.tab==='record';}
    dock.classList.toggle('modern-event-pages',active?.tab==='record');
    dock.hidden=!active;
    if(active){
      const selected=[...active.node.querySelectorAll('button')].findIndex(button=>button.classList.contains('active'));
      if(choice.dataset.menu!==active.tab){choice.replaceChildren(...active.names.map((name,index)=>new Option(name,active.tab==='record'?name.toLowerCase():index)));choice.dataset.menu=active.tab;}
      choice.value=active.tab==='record'?currentEvent():String(Math.max(0,selected));
    }
    for(const selector of ['#quickMemoBtn','#mailboxBtn','#loginBtn','#todayJournalBtn']){const button=$(selector);if(button&&!button.getAttribute('aria-label'))button.setAttribute('aria-label',button.textContent.trim());}
  }
  function arrangeCalendar(){}
  function restore(){
    document.querySelectorAll('.site-display-dialog[open]').forEach(dialog=>dialog.close());
    for(const [node,marker]of [...moves].reverse()){if(marker.isConnected&&node.isConnected)marker.after(node);}
    for(const node of created)node.hidden=true;
    for(const group of groups)group.node.hidden=false;
    for(const id of ['recordShell','albumShell','eventArchiveShell','travelArchiveShell'])$('#'+id).hidden=false;
    document.querySelectorAll('.modern-account-layout').forEach(node=>node.classList.remove('modern-account-layout'));
  }
  function apply(){}
`;
