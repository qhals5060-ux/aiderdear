'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=name=>fs.readFileSync(path.join(root,name),'utf8'),html=read('index.html');
const bootstrap=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(code=>code.includes("u.searchParams.has('site-edition')"));
function harness({saved='editorial',query='editorial',blocked=false,native=false}={}){
 const values=new Map([['aiderlog.site.edition',saved],['aiderlog-private-v20','private-records'],['aiderlogTheme','rose']]),classes=new Set(['modern-site']);
 const element={dataset:{siteEdition:'modern',siteDefaultEdition:'modern',appPalette:'rose'},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),contains:c=>classes.has(c)}};
 const location={href:'https://example.invalid/?site-edition='+query+'&open=estate#record'},window={AiderLogNative:native?{}:undefined,dispatchEvent:()=>{}},document={documentElement:element,getElementById:()=>null,querySelector:()=>null};
 const context={window,document,location,history:{state:{keep:true},replaceState(state,title,url){assert.deepEqual(state,{keep:true});location.href=String(url);}},URL,CustomEvent:class{constructor(type,init){this.type=type;this.detail=init?.detail;}},localStorage:{getItem:key=>values.get(key),setItem(key,value){if(blocked)throw Error('disabled');values.set(key,value);}}};
 return{context,classes,values,element,location,window};
}
test('the sole website layout is present before any style or application script',()=>{
 assert.match(html.slice(0,html.indexOf('<head>')),/class="modern-site"/);assert(bootstrap);
 assert.doesNotMatch(html,/<option[^>]*value="editorial"|data-site-theme-select|site-theme-control|AiderLog-Editorial-v\d+-site-files\.zip|function renderRoutinePanelEditorialV165/);
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(/\bsrc=|type=["'](?:module|application\/)/i.test(match[1]))continue;assert.doesNotThrow(()=>new vm.Script(match[2]));}
});
test('saved legacy appearance and shortcut query resolve to Modern without touching account or app theme',()=>{
 for(const saved of ['editorial','modern','invalid'])for(const query of ['editorial','modern','invalid']){const h=harness({saved,query});vm.runInNewContext(bootstrap,h.context);assert(h.classes.has('modern-site'));assert.equal(h.element.dataset.siteEdition,'modern');assert.equal(h.values.get('aiderlog.site.edition'),'modern');assert.equal(new URL(h.location.href).searchParams.get('site-edition'),'modern');assert.equal(new URL(h.location.href).searchParams.get('open'),'estate');assert.equal(new URL(h.location.href).hash,'#record');assert.equal(h.values.get('aiderlog-private-v20'),'private-records');assert.equal(h.values.get('aiderlogTheme'),'rose');assert.equal(h.element.dataset.appPalette,'rose');}
});
test('disabled localStorage is harmless and the site bootstrap leaves native app theme alone',()=>{
 const blocked=harness({blocked:true});assert.doesNotThrow(()=>vm.runInNewContext(bootstrap,blocked.context));assert.equal(blocked.element.dataset.siteEdition,'modern');
 const native=harness({native:true});vm.runInNewContext(bootstrap,native.context);assert(native.classes.has('aiderlog-android'));assert(!native.classes.has('modern-site'));assert.equal(native.values.get('aiderlog.site.edition'),'editorial');assert.equal(native.values.get('aiderlogTheme'),'rose');
});
test('legacy public setter cannot restore a retired design',()=>{
 const h=harness();vm.runInNewContext(read('site-editions-v164.js'),h.context);assert.equal(h.window.AiderLogSiteEdition.get(),'modern');for(const value of ['editorial','invalid',null])assert.equal(h.window.AiderLogSiteEdition.set(value),'modern');assert(h.classes.has('modern-site'));assert.equal(h.element.dataset.siteEdition,'modern');assert.equal(h.values.get('aiderlog-private-v20'),'private-records');
 assert.doesNotMatch(read('site-layout-v165.js'),/function restore\(|original-position|Editorial/);assert.doesNotMatch(read('site-editions-v164.css'),/site-theme-control|not\(\.modern-site\)/);
});
test('public account downloads contain one PC package and the Android install link',()=>{
 const block=html.match(/<div class="app-install-grid app-install-v137 site-edition-downloads">([\s\S]*?)<\/div>/)?.[1];assert(block);assert.equal((block.match(/class="app-download-link/g)||[]).length,2);assert.match(block,/\.apk" download=/);assert.match(block,/site-files\.zip" download=/);assert.doesNotMatch(block,/에디토리얼|Editorial/);
 const js=read('site-editions-v164.js');assert(js.includes('downloads.cloneNode(true)'));assert(!js.includes('accountTheme'));assert(js.includes("guest.setAttribute('aria-label','앱 및 사이트 다운로드')"));
});
