'use strict';
const {test}=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.resolve(__dirname,'../index.html'),'utf8');
const start=source.indexOf('const siteMediaPickerContextsV178='),end=source.indexOf('const eventPhotosV176=',start);assert.ok(start>0&&end>start);
function fixture(id){
 const listeners={},received=[],errors=[],input={value:'',files:[],addEventListener:(name,fn)=>listeners[name]=fn};
 const context={currentUserEmail:'a@example.invalid',pair:'pair-a',currentPairKey:()=>context.pair,$:()=>input,toast:text=>errors.push(text)};
 vm.createContext(context);vm.runInContext(source.slice(start,end),context);context.bindSiteMediaPickerV178(id,files=>received.push(...files));
 return {context,input,received,errors,open:()=>listeners.click(),result:()=>{input.files=[{name:'one.jpg'},{name:'two.mp4'}];input.value='synthetic';listeners.change({stopImmediatePropagation(){}});}};
}
for(const id of ['personalPhotoInput','eventPhotoInput']){
 test(id+' accepts all selected media after a real opening click',()=>{const f=fixture(id);f.open();f.result();assert.equal(f.received.length,2);assert.equal(f.input.value,'');});
 test(id+' rejects a late result from a different account',()=>{const f=fixture(id);f.open();f.context.currentUserEmail='b@example.invalid';f.result();assert.equal(f.received.length,0);assert.match(f.errors[0],/다시 선택/);assert.equal(f.input.value,'');});
 test(id+' invalidates closed/reopened or reset editors even with the same account',()=>{const f=fixture(id);f.open();f.context.resetSiteMediaPickerV178(id);f.result();assert.equal(f.received.length,0);f.open();f.result();assert.equal(f.received.length,2);});
 test(id+' rejects unstamped callbacks instead of guessing current ownership',()=>{const f=fixture(id);f.result();assert.equal(f.received.length,0);});
}
test('shared event selections reject couple-scope changes; private selections are owner-only',()=>{for(const id of ['personalPhotoInput','eventPhotoInput']){const f=fixture(id);f.open();f.context.pair='pair-b';f.result();assert.equal(f.received.length,id==='personalPhotoInput'?2:0);}});
test('both site inputs use the guard and owner/editor resets invalidate outstanding pickers',()=>{
 assert.match(source,/bindSiteMediaPickerV178\('eventPhotoInput',files=>renderEventPhotoPreview\(null,files\)\)/);
 assert.match(source,/bindSiteMediaPickerV178\('personalPhotoInput',renderPersonalPhotoPreview\)/);
 for(const name of ['clearEventPendingPreview','clearPersonalPhotoPreview'])assert.match(source,new RegExp('function '+name+'\\(\\)\\{resetSiteMediaPickerV178'));
 assert.match(source,/aiderlog-photo-owner-reset-v176',\(\)=>\{clearPersonalMediaCacheV178\(\);resetSiteMediaPickerV178\('personalPhotoInput'\);resetSiteMediaPickerV178\('eventPhotoInput'\)/);
});
