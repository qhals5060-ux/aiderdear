'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const script=fs.readFileSync(path.join(__dirname,'../site-typography-v169.js'),'utf8');
const css=fs.readFileSync(path.join(__dirname,'../site-typography-v169.css'),'utf8');
function harness({native=false,android=false}={}){
 const queue=[],observers=[],events={};let appends=0;
 const root={children:[],querySelector(){return this.children.find(x=>x.attrs?.['data-site-typography-v169']!==undefined)||null},append(x){this.children=this.children.filter(e=>e!==x);this.children.push(x);appends++}};
 const host={shadowRoot:root,attrs:{},setAttribute(k,v){this.attrs[k]=v}};
 const window=native?{AiderLogNative:{}}:{};
 const document={currentScript:{src:'http://127.0.0.1/site-typography-v169.js'},documentElement:{classList:{contains:()=>android}},body:{},querySelectorAll:()=>[host],createElement:()=>({attrs:{},setAttribute(k,v){this.attrs[k]=v}}),addEventListener:(key,fn)=>events[key]=fn};
 const context={window,document,URL,location:{href:'http://127.0.0.1/'},WeakSet,MutationObserver:class{constructor(fn){this.fn=fn;observers.push(this)}observe(target){this.target=target}},requestAnimationFrame:fn=>queue.push(fn),addEventListener:(key,fn)=>events[key]=fn,customElements:{whenDefined:()=>({then:()=>{}})}};
 vm.runInNewContext(script,context);
 return {window,host,root,observers,events,get appends(){return appends},flush(){while(queue.length){assert(queue.length<5,'bounded frame scheduling');queue.shift()()}},mutate(target){observers.filter(o=>o.target===target).forEach(o=>o.fn([{target,type:'childList',addedNodes:[]}]))}};
}
const checks=[];
for(const [key,value]of Object.entries({body:14,control:13,meta:12,section:16,subhead:14,page:20,metric:20,month:24}))assert(css.includes(`--site-type-${key}:${value}px;`));checks.push('Work-derived typography tokens');
assert(!/\b(?:zoom|transform|scale)\s*:/.test(css));checks.push('no zoom, transforms or page navigation changes');
for(const options of [{native:true},{android:true}]){const h=harness(options);assert.equal(h.appends,0);assert.equal(h.observers.length,0);assert.equal(h.window.AiderLogSiteTypographyV169,undefined)}checks.push('Android bridge and CSS-class guards');
const h=harness();assert.equal(h.appends,1);assert.equal(h.host.attrs['data-site-typography-v169'],'');assert.equal(h.root.children[0].href,'http://127.0.0.1/site-typography-v169.css?v=169');checks.push('one local stylesheet mounted per Shadow DOM');
for(let i=0;i<8;i++)h.window.AiderLogSiteTypographyV169.refresh();assert.equal(h.appends,1);checks.push('refresh is idempotent');
h.root.children.push({tag:'edition-style'});h.mutate(h.root);h.flush();assert.equal(h.appends,1);checks.push('does not fight existing edition stylesheet order');
h.root.children=[];h.mutate(h.root);h.flush();assert.equal(h.appends,2);assert.equal(h.root.children.length,1);checks.push('component re-render restores stylesheet once');
h.events['aiderlog-site-editionchange']();h.flush();assert.equal(h.appends,2);checks.push('theme edition changes preserve mounted typography');
assert(!/localStorage|sessionStorage|fetch\(|XMLHttpRequest|AiderDearFirebase|\.click\(/.test(script));checks.push('no record, authentication, API or click mutation');
console.log(JSON.stringify({ok:true,checks},null,2));
