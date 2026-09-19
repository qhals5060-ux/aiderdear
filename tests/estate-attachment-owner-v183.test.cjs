// Actual property editor callbacks; only DOM and transport are in-memory doubles.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8').replace(/\r\n/g,'\n');
const deferred=()=>{let resolve,reject;const promise=new Promise((a,b)=>{resolve=a;reject=b;});return {promise,resolve,reject};};
globalThis.CSS??={escape:String};
class El{
  constructor(){this.children=new Map();this.listeners=new Map();this.dataset={};this.classList={add(){}};this.isConnected=true;this.hidden=false;this.value='';this.checked=false;this.elements=new Proxy({}, {get:(all,key)=>all[key]??=(new El())});}
  querySelector(selector){if(!this.children.has(selector))this.children.set(selector,new El());return this.children.get(selector);}
  querySelectorAll(){return [];}
  addEventListener(type,fn,options={}){if(!this.listeners.has(type))this.listeners.set(type,[]);this.listeners.get(type).push({fn,signal:options.signal});}
  dispatchEvent(event){for(const {fn,signal} of this.listeners.get(event.type)||[])if(!signal?.aborted)fn(event);return true;}
  async fire(type,event){for(const {fn,signal} of this.listeners.get(type)||[])if(!signal?.aborted)await fn(event);}
}
async function fixture(row={}){
  const {installDirectory}=await import('../estate-directory-v171.js');
  const editors=new Map(),calls=[],notices=[],abort=new AbortController();let uid='owner-a',form,onSave;
  let call=async()=>({name:'private file'}),upload=async file=>({id:file.name,thumbId:'',name:file.name}),save=async row=>({...row,history:[],revision:2});
  const app={uid:()=>uid,today:()=> '2026-09-19',esc:String,field:()=>'',money:String,options:()=>[],pickOptions:async()=>[],lookup:async()=>null,
    registerView(){},registerEntity:(name,fn)=>editors.set(name,fn),notice:message=>notices.push(message),
    form:(_container,_html,fn)=>{form=new El();form.isConnected=false;onSave=fn;return form;},
    save:async(_collection,row)=>{calls.push({action:'save',uid,row});return save(row);},
    api:{image:async()=>'',call:async(action,payload)=>{calls.push({action,uid,...payload});return call(action,payload);},upload:async(file,target)=>{calls.push({action:'upload',uid,file,target});return upload(file,target);}}
  };
  installDirectory(app);await editors.get('properties')({container:new El(),row:{id:'property-a',revision:1,...row},isNew:true,signal:abort.signal});
  return {calls,notices,form,abort,setOwner:value=>uid=value,call:fn=>call=fn,upload:fn=>upload=fn,saveHandler:fn=>save=fn,
    save:()=>onSave({},form),
    remove:id=>form.querySelector('[data-document-list]').fire('click',{target:{closest:selector=>selector==='[data-document-remove]'?{dataset:{documentRemove:id}}:null}}),
    send:files=>form.querySelector('[data-document-upload]').fire('change',{target:{files}})};
}
const removedCalls=f=>f.calls.filter(call=>call.action==='mediaDelete');
const file=name=>({name,type:'application/pdf'});

test('directory privacy guards ship identically in site and both APK source trees',()=>{
  const source=read('estate-directory-v171.js');assert.equal(source,read('android-src/assets/estate-directory-v171.js'));assert.equal(source,read('../AiderLog-v145-decoded/assets/estate-directory-v171.js'));
});

test('removing several attachments continues same-owner cleanup after a referenced-file refusal',async()=>{
  const f=await fixture({mediaIds:['first','second']});await f.remove('first');await f.remove('second');
  f.call(async(action,payload)=>{if(action==='mediaDelete'&&payload.id==='first')throw Error('still referenced');return {};});
  await f.save();assert.deepEqual(removedCalls(f).map(call=>call.id),['first','second']);assert(removedCalls(f).every(call=>call.uid==='owner-a'));
});

for(const change of ['other owner','closed panel','same UID new session'])test(`${change} during attachment deletion stops all remaining cleanup`,{timeout:2000},async()=>{
  const f=await fixture({mediaIds:['first','second']}),gate=deferred(),entered=deferred();await f.remove('first');await f.remove('second');
  f.call(async action=>{if(action==='mediaDelete'){entered.resolve();return gate.promise;}return {};});
  const rejected=assert.rejects(f.save(),/화면 또는 로그인 계정이 변경/);await entered.promise;
  if(change==='other owner')f.setOwner('owner-b');else f.abort.abort();
  gate.resolve({});await rejected;assert.deepEqual(removedCalls(f).map(call=>call.id),['first']);assert.equal(removedCalls(f)[0].uid,'owner-a');
});

test('a failed deletion from the former account is not swallowed before continuing cleanup',async()=>{
  const f=await fixture({mediaIds:['first','second']});await f.remove('first');await f.remove('second');
  f.call(async action=>{if(action==='mediaDelete'){f.setOwner('owner-b');throw Error('old request failed');}return {};});
  await assert.rejects(f.save(),/화면 또는 로그인 계정이 변경/);assert.deepEqual(removedCalls(f).map(call=>call.id),['first']);assert.equal(f.notices.length,0);
});

test('owner change during property save prevents attachment cleanup entirely',async()=>{
  const f=await fixture({mediaIds:['first']});await f.remove('first');f.saveHandler(async row=>{f.setOwner('owner-b');return row;});
  await assert.rejects(f.save(),/화면 또는 로그인 계정이 변경/);assert.equal(removedCalls(f).length,0);
});

test('an aborted or previous-owner property form cannot submit a new save',async()=>{
  for(const abort of [false,true]){const f=await fixture();if(abort)f.abort.abort();else f.setOwner('owner-b');await assert.rejects(f.save(),/화면 또는 로그인 계정이 변경/);assert.equal(f.calls.filter(call=>call.action==='save').length,0);}
});

test('multi-file upload stops after owner change without sending the next file or old-owner cleanup',async()=>{
  const f=await fixture();f.upload(async file=>{f.setOwner('owner-b');return {id:file.name,thumbId:'thumb-a'};});
  await f.send([file('first'),file('second')]);assert.deepEqual(f.calls.filter(call=>call.action==='upload').map(call=>call.file.name),['first']);assert.equal(removedCalls(f).length,0);
});

test('late upload completion after panel abort never deletes its IDs in the next session',async()=>{
  const f=await fixture();f.upload(async()=>{f.abort.abort();f.setOwner('owner-b');return {id:'uploaded-a',thumbId:'thumbnail-a'};});
  await f.send([file('first'),file('second')]);assert.equal(f.calls.filter(call=>call.action==='upload').length,1);assert.equal(removedCalls(f).length,0);
});

test('ordinary multi-file uploads still continue after a file-specific failure',async()=>{
  const f=await fixture();f.upload(async file=>{if(file.name==='first')throw Error('invalid file');return {id:file.name,name:file.name};});
  await f.send([file('first'),file('second')]);assert.deepEqual(f.calls.filter(call=>call.action==='upload').map(call=>call.file.name),['first','second']);
});
