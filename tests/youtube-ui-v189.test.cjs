'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8');
const source=read('android-src/assets/app-youtube-v189.js'),hub=read('android-src/assets/my-workspaces-v128.js');
function parser(){const window={};vm.runInNewContext(source,{window,document:{addEventListener(){},getElementById(){return null;}},URL,setTimeout,clearTimeout});return window.AiderYoutubeUIV189.parse;}
test('YouTube UI canonicalizes supported URLs and rejects unsafe targets',()=>{
 const parse=parser(),id='abcdefgh_01';
 for(const url of [`https://www.youtube.com/watch?v=${id}&list=test`,`https://youtube.com/shorts/${id}?si=test`,`https://m.youtube.com/live/${id}`,`https://music.youtube.com/watch?v=${id}`,`https://youtu.be/${id}?t=23`,`https://www.youtube.com/embed/${id}`]){const result=parse(url);assert.equal(result.videoId,id);assert.equal(result.url,`https://www.youtube.com/watch?v=${id}`);}
 assert.equal(parse(`https://youtube.com/shorts/${id}`).shorts,true);
 for(const url of ['javascript:alert(1)',`http://youtube.com/watch?v=${id}`,`https://youtube.com.evil.test/watch?v=${id}`,`https://youtube.com@evil.test/watch?v=${id}`,`https://user:pw@youtube.com/watch?v=${id}`,`https://youtube.com:444/watch?v=${id}`,'https://youtube.com/watch?v=invalid','file:///watch?v=abcdefgh_01'])assert.equal(parse(url),null,url);
});
test('library is available to signed-in users while the original eight My gates remain intact',()=>{
 // Read the actual declaration and predicate together, without starting application UI.
 const start=hub.indexOf('const myRoutesV180 ='),end=hub.indexOf('const canUsePaper',start),code=hub.slice(start,end)+'globalThis.allowed=canUseModeV180;';
 const legacy=['paper','task','work','lab','estate','speech','brain','study'];
 for(const [email,expected] of [['ordinary@example.test',[]],['qhals5060@gmail.com',legacy],['aidway55@gmail.com',['paper','task','work','lab']],['abckms5698@naver.com',['estate']]]){
   let uid='signed-in';const context={currentUid:()=>uid,currentEmail:()=>email};vm.runInNewContext(code,context);assert(context.allowed('youtube'));for(const route of legacy)assert.equal(context.allowed(route),expected.includes(route),`${email}/${route}`);uid='';assert(!context.allowed('youtube'));for(const route of legacy)assert(!context.allowed(route));
 }
});
test('UI is isolated from the shared private payload and embeds no downloaded media or AI calls',()=>{
 assert.doesNotMatch(source,/localStorage|sessionStorage|savePrivate\s*\(|\bfetch\s*\(|\bP\s*\[|\bP\s*\./);
 assert.match(source,/https:\/\/i\.ytimg\.com\/vi\//);assert.match(source,/rel="noopener noreferrer"/);assert.match(source,/token\.owner===currentOwner\(\)/);
 assert.match(source,/maxlength="180"/);assert.match(source,/maxlength="2000"/);assert.match(source,/edit\.saving\|\|edit\.loading/);
 new vm.Script(source);new vm.Script(hub);
});
