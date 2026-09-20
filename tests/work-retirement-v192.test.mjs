import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import handler from '../api/work.mjs';
const read=file=>readFileSync(new URL('../'+file,import.meta.url),'utf8');

for(const method of ['GET','POST','DELETE','OPTIONS'])test(`retired WORK returns 410 for ${method} before reading auth, request body or Firebase`,async()=>{
 const request=new Proxy({method},{get(){throw Error('request must not be inspected')}}),headers={};let body;
 const response={setHeader(k,v){headers[k]=v},end(value){body=JSON.parse(value)}};
 await handler(request,response);
 assert.equal(response.statusCode,410);assert.equal(body.code,'work-retired');
 assert.match(headers['Cache-Control'],/no-store/);
 assert.doesNotMatch(read('api/work.mjs'),/\bimport\s|services\(|verifyIdToken|\.doc\(|\.delete\(/);
});

test('site and app retire WORK entry points while Consult and Personal workflow stay installed',()=>{
 const site=read('index.html'),app=read('android-src/assets/index.html'),my=read('android-src/assets/my-workspaces-v128.js');
 assert.doesNotMatch(site,/data-tab="work"|src="\.\/site-work-v167|src="\.\/work-client-v167/);
 assert.doesNotMatch(app,/src="\.\/work-client-v167/);
 assert.doesNotMatch(my,/mode === 'work'|\['work','calendar'|'task','work'/);
 assert.match(site,/data-tab="task"/);assert.match(my,/\['task','task','Consulting'/);
 assert.match(site,/workflow/);assert.match(app,/daylog-ui-v165\.js/);
 assert.doesNotMatch(read('employee.html'),/<script|firebase|api\/work/i);
});

function calendarFixture(){
 let actor={uid:'owner',email:'qhals5060@gmail.com'};
 const deny=()=>{throw Error('retired WORK must not perform background work')};
 const context={window:{AiderDearFirebase:{getState:()=>({user:actor}),getFirebaseIdToken:deny,subscribe:deny},AiderConsultModelV167:{normalize:input=>input,calendar:data=>data.consultOnly||[]}},fetch:deny,addEventListener:deny,setInterval:deny,setTimeout:deny,document:new Proxy({},{get:deny})};
 vm.runInNewContext(read('work-calendar-v168.js'),context);
 return {api:context.window.AiderWorkCalendarV168,setUser:user=>{actor=user}};
}

test('calendar retains Consult rows and account gate without background reads or archived WORK projections',async()=>{
 const {api,setUser}=calendarFixture();
 const payload={workRecords:[{id:'historic',title:'Keep this',dueDate:'2026-09-20'}],consultOnly:[
  {id:'session:1',sourceId:'1',kind:'session',clientId:'c',clientName:'고객',title:'상담',date:'2026-09-20',time:'14:00',status:'scheduled'},
  {id:'session:2',sourceId:'2',kind:'session',clientId:'c',title:'취소',date:'2026-09-20',status:'cancelled'}
 ]};
 const before=JSON.stringify(payload),rows=api.rows(payload);
 assert.equal(rows.length,1);assert.equal(rows[0].calendarScope,'consulting');assert.equal(rows[0].title,'상담');assert.equal(rows[0].authorUid,'owner');
 await api.refresh(true);await api.refresh(false);assert.equal(JSON.stringify(payload),before);
 setUser({uid:'stranger',email:'other@example.com'});assert.equal(api.rows(payload).length,0);
 setUser(null);assert.equal(api.rows(payload).length,0);
 assert.equal(read('work-calendar-v168.js'),read('android-src/assets/work-calendar-v168.js'));
});

test('legacy Lab, Brain and Speech remain available without mutating historic Work records',()=>{
 const history=[{id:'historic',title:'preserve',demo:true}],P={workRecords:history};
 const host={innerHTML:'',querySelector:()=>null,querySelectorAll:()=>[]};
 const context={window:{AiderDearFirebase:{getState:()=>({user:{uid:'owner',email:'qhals5060@gmail.com'}})}},P,document:{addEventListener(){}},console};
 vm.runInNewContext(read('android-src/assets/my-suite-v145.js'),context);
 const suite=context.window.AiderLogSuiteV145;
 assert.equal(suite.renderWork,undefined);
 for(const name of ['renderLabNotebook','renderBrain','renderSpeech'])assert.equal(typeof suite[name],'function');
 suite.renderLabNotebook(host,()=>{});
 assert.equal(P.workRecords,history);assert.equal(P.workRecords[0].demo,true);assert.equal(P.workTaskSeparatedV147,undefined);
 assert.match(host.innerHTML,/Experiment Notebook/);
});
