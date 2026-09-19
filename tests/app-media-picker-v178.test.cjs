'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../android-src/assets/app-photo-attachments-v176.js'),'utf8');
function fixture(){
 const listeners={},windowListeners={},batches=[],hosts=[],rows=[];
 const node=tag=>({tagName:tag.toUpperCase(),dataset:{},style:{},children:[],isConnected:true,setAttribute(k,v){this[k]=v;},append(x){this.children.push(x);},replaceChildren(...c){this.children=c;},querySelector(selector){return this.children.find(c=>selector==='img,video'?['IMG','VIDEO'].includes(c.tagName):c.className===selector.slice(1))||null;}});
 const form=node('form');form.querySelector=selector=>form.children.find(x=>x.className===selector.slice(1))||null;
 const inputs=Object.fromEntries(['personalPhoto','eventPhotoV111'].map(id=>[id,{...node('input'),id,value:'synthetic',files:[{name:'synthetic.jpg'}],closest:s=>s==='form'?form:null,matches:()=>false}]));
 const document={body:{},createElement:node,getElementById:id=>inputs[id]||null,querySelector:()=>null,querySelectorAll:()=>hosts,
  addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)};
 const photos={createBatch:()=>{const b={files:[],add(files){this.files.push(...files);return[];},reset(){this.files=[];}};batches.push(b);return b;},mountPreview(){},mediaItems:r=>r?.mediaItems||[],safeSource:v=>v,kind:r=>r?.kind||'image'};
 const context={document,AiderLogPhotosV176:photos,authState:{user:{uid:'a'},pair:null},URL:{createObjectURL:()=> 'blob:synthetic-media',revokeObjectURL(){}},console,
  MutationObserver:class{observe(){}},addEventListener:(name,fn)=>(windowListeners[name]??=[]).push(fn),hydratePersonalMedia(){},personalItems:()=>rows,
  fb:{readPrivateMedia:async()=>({type:'video/mp4'})},P:{},A:{}};
 context.window=context;vm.runInNewContext(source,context);
 function fire(type,id='personalPhoto'){const event={target:inputs[id],stopImmediatePropagation(){},preventDefault(){}};for(const fn of listeners[type]||[])fn(event);}
 return {context,inputs,batches,rows,hosts,form,node,fire,reset(){for(const fn of windowListeners['aiderlog-photo-owner-reset-v176']||[])fn();}};
}
for(const id of ['personalPhoto','eventPhotoV111']){
 test(id+' accepts a multiple selection only for the editor/account that opened it',()=>{const f=fixture();f.inputs[id].files.push({name:'synthetic.mp4'});f.fire('click',id);f.fire('change',id);assert.equal(f.batches[id==='personalPhoto'?0:1].files.length,2);assert.equal(f.inputs[id].value,'');});
 test(id+' discards a late picker result after account switch',()=>{const f=fixture();f.fire('click',id);f.context.authState.user={uid:'b'};f.fire('change',id);assert.equal(f.batches.reduce((n,b)=>n+b.files.length,0),0);assert.match(f.form.children[0].textContent,/다시 선택/);});
 test(id+' rejects an old picker even if account changes away and back before the result',()=>{const f=fixture();f.fire('click',id);f.reset();f.fire('change',id);assert.equal(f.batches.reduce((n,b)=>n+b.files.length,0),0);});
 test(id+' accepts a new selection after cancellation/reset and a fresh click',()=>{const f=fixture();f.fire('click',id);f.reset();f.fire('click',id);f.fire('change',id);assert.equal(f.batches[id==='personalPhoto'?0:1].files.length,1);});
}
test('shared event picker rejects a changed couple scope without changing UID',()=>{const f=fixture();f.fire('click','eventPhotoV111');f.context.authState.pair={id:'new-pair'};f.fire('change','eventPhotoV111');assert.equal(f.batches[1].files.length,0);});
test('private picker does not bind the selected file to a different reopened private editor',()=>{const f=fixture();f.fire('click');f.context.AiderLogAppPhotosV176.resetPersonal();f.fire('change');assert.equal(f.batches[0].files.length,0);});
test('an unstamped old callback is rejected rather than added to a new account draft',()=>{const f=fixture();f.fire('change');assert.equal(f.batches[0].files.length,0);});
test('personal media hydration emits a video element and multi-item badge rather than an image loading error',async()=>{
 const f=fixture(),host=f.node('div');host.dataset.pmedia='r';f.hosts.push(host);f.rows.push({id:'r',mediaItems:[{kind:'video',fileId:'v'},{kind:'image',fileId:'p'}]});
 await f.context.hydratePersonalMedia();const visual=host.children[0];assert.equal(visual.tagName,'VIDEO');assert.equal(visual.src,'blob:synthetic-media');assert.equal(visual.preload,'metadata');assert.equal(visual.playsInline,true);assert.equal(visual.muted,true);assert.equal(host.dataset.photoState,'ready');assert.equal(host.children[1].textContent,'+1');
});
test('personal hydration cannot inject media returned for an old owner',async()=>{
 const f=fixture(),host=f.node('div');host.dataset.pmedia='r';f.hosts.push(host);f.rows.push({id:'r',mediaItems:[{kind:'video',fileId:'v'}]});
 let finish;f.context.fb.readPrivateMedia=()=>new Promise(resolve=>{finish=resolve;});const pending=f.context.hydratePersonalMedia();f.context.authState.user={uid:'b'};finish({type:'video/mp4'});await pending;assert.equal(host.children.length,0);
});
