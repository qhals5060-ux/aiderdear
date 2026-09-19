'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const section=(a,b)=>{const start=source.indexOf(a),end=source.indexOf(b,start);assert.ok(start>=0&&end>start);return source.slice(start,end);};
const reader=section('function clearPersonalMediaCacheV178()', 'const personalPhotosV176=');
const hydration=section('async function hydratePersonalMedia(rows)', 'function openPersonalEntry(');
function fixture(){
 const hosts=[],revoked=[],urls=[],readCalls=[],galleries=[];
 const context={currentUserEmail:'a@example.invalid',personalMediaUrlCache:new Map(),personalMediaEpochV178:0,$$:()=>hosts,escapeHtml:String,personalPhotoResolverV176(){},
  URL:{createObjectURL(blob){const url='blob:'+urls.length;urls.push(url);return url;},revokeObjectURL:url=>revoked.push(url)},
  AiderDearFirebase:{readPrivateMedia:async id=>{readCalls.push(id);return {type:'video/mp4'};}},
  AiderLogPhotosV176:{mediaItems:r=>r.mediaItems||[r.media],kind:m=>m.kind||'image',gallery:(...args)=>galleries.push(args)}};
 context.window=context;vm.createContext(context);vm.runInContext(reader+hydration,context);
 const row={id:'row-a',title:'synthetic',media:{fileId:'same-file',kind:'video'},mediaItems:[{fileId:'same-file',kind:'video'}]};
 const host={dataset:{personalMedia:row.id},isConnected:true,innerHTML:'',classList:{add(){}},insertAdjacentHTML(position,html){this.innerHTML+=html;}};
 return {context,hosts,revoked,urls,readCalls,row,host,galleries};
}
test('website private media cache is owner-keyed even for the same media ID',async()=>{const f=fixture(),a=await f.context.personalMediaSrc(f.row);assert.equal(await f.context.personalMediaSrc(f.row),a);f.context.currentUserEmail='b@example.invalid';const b=await f.context.personalMediaSrc(f.row);assert.notEqual(a,b);assert.equal(f.readCalls.length,2);});
test('owner reset revokes all cached object URLs and invalidates the cache generation',async()=>{const f=fixture();await f.context.personalMediaSrc(f.row);f.context.clearPersonalMediaCacheV178();assert.deepEqual(f.revoked,['blob:0']);assert.equal(f.context.personalMediaUrlCache.size,0);assert.equal(f.context.personalMediaEpochV178,1);await f.context.personalMediaSrc(f.row);assert.equal(f.readCalls.length,2);});
for(const mode of ['account-change','same-owner-reset'])test('an asynchronous private read is discarded after '+mode,async()=>{const f=fixture();let resolve;f.context.AiderDearFirebase.readPrivateMedia=()=>new Promise(done=>resolve=done);const pending=f.context.personalMediaSrc(f.row);if(mode==='account-change')f.context.currentUserEmail='b@example.invalid';else f.context.clearPersonalMediaCacheV178();resolve({type:'image/jpeg'});await assert.rejects(pending,/계정이 변경/);assert.equal(f.urls.length,0);assert.equal(f.context.personalMediaUrlCache.size,0);});
test('guest sessions cannot consult the private file cache or fetch private media',async()=>{const f=fixture();f.context.currentUserEmail='';assert.equal(await f.context.personalMediaSrc(f.row),'');assert.equal(f.readCalls.length,0);});
test('video hydration sets video metadata markup only on connected current-owner hosts',async()=>{const f=fixture();f.hosts.push(f.host,{...f.host,isConnected:false});await f.context.hydratePersonalMedia([f.row]);assert.match(f.host.innerHTML,/<video .*preload="metadata" playsinline muted/);assert.equal(f.hosts[1].innerHTML,'');});
test('late hydration cannot place old account media into the current DOM',async()=>{const f=fixture();f.hosts.push(f.host);let resolve;f.context.AiderDearFirebase.readPrivateMedia=()=>new Promise(done=>resolve=done);const pending=f.context.hydratePersonalMedia([f.row]);f.context.currentUserEmail='b@example.invalid';resolve({type:'video/mp4'});await pending;assert.equal(f.host.innerHTML,'');assert.equal(f.urls.length,0);});
test('an old visible gallery trigger cannot reopen private media after owner reset',async()=>{const f=fixture();f.hosts.push(f.host);await f.context.hydratePersonalMedia([f.row]);const event={preventDefault(){},stopPropagation(){}};f.host.onclick(event);assert.equal(f.galleries.length,1);f.context.clearPersonalMediaCacheV178();f.host.onclick(event);assert.equal(f.galleries.length,1);});
test('both Firebase session reset and photo-owner reset clear the scoped cache',()=>{assert.match(source,/function resetFirebaseLocalSession\(\)\{\s*clearPersonalMediaCacheV178\(\)/);assert.match(source,/aiderlog-photo-owner-reset-v176',\(\)=>\{clearPersonalMediaCacheV178\(\)/);});
