'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
class Element {
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.isConnected=true;this.dataset={};this.classes=new Set();this.classList={add:n=>this.classes.add(n),remove:n=>this.classes.delete(n)};}
  append(...rows){this.children.push(...rows);} replaceChildren(...rows){this.children=[...rows];}
  setAttribute(k,v){this[k]=v;}
}
function media(){const context={console,URL:{createObjectURL:()=> 'blob:test',revokeObjectURL(){}},document:{createElement:tag=>new Element(tag)}};context.window=context;vm.runInNewContext(read('photo-attachments-v176.js'),context);return context.AiderLogPhotosV176;}
for(const [type,tag] of [['image/jpeg','IMG'],['video/mp4','VIDEO']]){
 test(`selected ${type} clears the obsolete empty preview state and renders its controls`,()=>{
  const api=media(),host=new Element(),batch=api.createBatch({allowVideo:true});host.classes.add('event-preview-empty-v164');
  batch.add([{name:type.startsWith('video')?'sample.mp4':'sample.jpg',size:4,lastModified:1,type}]);api.mountPreview(host,batch);
  assert.equal(host.classes.has('event-preview-empty-v164'),false);assert.equal(host.classes.has('photo-batch-v176'),true);
  assert.equal(host.children.length,1);const [visual,caption,remove]=host.children[0].children;
  assert.equal(visual.tagName,tag);assert.equal(visual.src,'blob:test');assert.equal(remove.type,'button');assert.ok(caption.textContent);
  if(tag==='VIDEO')assert.equal(visual.controls,true);
  remove.onclick();assert.equal(batch.count,0);assert.equal(host.children.length,0);
 });
}
test('a mobile upload failure is visible text, not a desktop-only title tooltip',async()=>{
 const api=media(),host=new Element(),batch=api.createBatch();batch.add([{name:'sample.jpg',size:4,type:'image/jpeg'}]);
 await assert.rejects(batch.upload(async()=>{throw Error('네트워크 연결을 확인해주세요.');}));api.mountPreview(host,batch);
 assert.match(host.children[0].children[1].textContent,/네트워크 연결/);assert.equal(batch.count,1);
});
test('Event CSS never hides real images/video because a batch contains figure, caption and remove button',()=>{
 const css=read('android-src/assets/event-ui-v164.css');
 assert.doesNotMatch(css,/event-preview-empty-v164:has\(:not\(img\)\)/);
 assert.match(css,/event-editor-preview-v111:empty\s*\{display:none!important/);
 assert.match(css,/event-editor-preview-v111\.photo-batch-v176:not\(:empty\)\s*\{display:grid!important/);
 assert.match(css,/photo-batch-v176\.not|photo-batch-v176:not|photo-batch-v176 figure :is\(img,video\)/);
 assert.match(css,/max-height:210px!important;overflow:auto!important/);
});
test('Event empty detection recognises video and batch figures, not only img',()=>{
 assert.match(read('android-src/assets/event-ui-v164.js'),/querySelector\('img,video,figure,\[data-event-file\]'\)/);
});
test('upload errors are mounted in the scrolling Event fields, before the fixed footer',()=>{
 const source=read('android-src/assets/app-photo-attachments-v176.js');
 const start=source.indexOf('const message='),end=source.indexOf('// Counts and stage',start);
 const fields=new Element(),footer=new Element(),form=new Element();form.children=[fields,footer];
 fields.querySelector=()=>null;form.querySelector=selector=>selector==='.event-editor-fields-v164'?fields:null;
 const ctx={document:{createElement:tag=>new Element(tag)},form};vm.runInNewContext(source.slice(start,end)+'message(form,"선택한 파일을 다시 확인해주세요.");',ctx);
 assert.equal(fields.children.length,1);assert.equal(fields.children[0].role,'alert');assert.match(fields.children[0].textContent,/파일/);assert.equal(footer.children.length,0);
});
test('source diagnostics contain only stage, scope and counts; native chooser still checks readable content URIs',()=>{
 const app=read('android-src/assets/app-photo-attachments-v176.js'),native=read('android-src/java/MediaChooserV178.java');
 assert.match(app,/console.info\?\.\('\[media-attachment\]',\{stage,scope,count\}\)/);
 assert.match(native,/Log.i\("AiderLogMedia", "picker-result returned=" \+ returnedCount \+ " readable=" \+ uris.size\(\) \+ " rejected=" \+ rejected\)/);
 assert.match(native,/!unknownMime\(type\) && !accepted\(selection.types, type.trim\(\)\)/);
 assert.match(native,/"application\/octet-stream".equalsIgnoreCase\(type.trim\(\)\)/);
 assert.match(native,/!"content".equals\(uri.getScheme\(\)\)/);assert.match(native,/openAssetFileDescriptor\(uri, "r"\)/);
});
