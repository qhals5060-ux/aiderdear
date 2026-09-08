/* DOM-operation regression, not a native pointer/browser test.
 * Executes the production move/arrangeHeader/restore functions unchanged in a
 * small ordered DOM. Real mouse down/up is verified separately in the browser.
 */
'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process');
const repo=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(repo,'site-layout-v165.js'),'utf8');

function productionFunction(text,name,next){
  const start=text.indexOf(`  function ${name}(`),end=text.indexOf(`  function ${next}(`,start+1);
  assert(start>=0&&end>start,`Production boundary changed for ${name}; review test extraction`);
  return text.slice(start,end);
}

function harness(text=source){
  const stats={reattaches:0,navReattaches:0,markers:0},registry=new Map(),tracked=new Set();
  class Element{
    constructor(name,tag='div'){
      this.name=name;this.tagName=tag.toUpperCase();this.nodeType=tag==='#comment'?8:1;
      this.childNodes=[];this.parentNode=null;this.dataset={};this.attrs=new Map();this.hidden=false;this.value='';this.listeners=new Map();
      const tokens=new Set();this.classList={contains:v=>tokens.has(v),add:(...values)=>values.forEach(v=>tokens.add(v)),remove:(...values)=>values.forEach(v=>tokens.delete(v)),toggle:(value,force)=>{const on=force===undefined?!tokens.has(value):!!force;if(on)tokens.add(value);else tokens.delete(value);return on;}};
    }
    get nextSibling(){return this.parentNode?.childNodes[this.parentNode.childNodes.indexOf(this)+1]||null;}
    get firstElementChild(){return this.childNodes.find(n=>n.nodeType===1)||null;}
    get lastElementChild(){return this.childNodes.filter(n=>n.nodeType===1).at(-1)||null;}
    get isConnected(){let n=this;while(n.parentNode)n=n.parentNode;return n===document;}
    get textContent(){return this.label||this.childNodes.map(n=>n.textContent).join('');}
    contains(node){for(let n=node;n;n=n.parentNode)if(n===this)return true;return false;}
    insertBefore(node,before=null){
      if(before&&before.parentNode!==this)throw Error('NotFoundError: reference is not a child');
      // DOM pre-insert adjusts a self reference, but still reparents the node.
      // The production helper must avoid this unnecessary call itself.
      let reference=before===node?node.nextSibling:before;
      if(node.parentNode){const old=node.parentNode;old.childNodes.splice(old.childNodes.indexOf(node),1);stats.reattaches++;if(tracked.has(node))stats.navReattaches++;}
      node.parentNode=this;const index=reference?this.childNodes.indexOf(reference):this.childNodes.length;
      this.childNodes.splice(index,0,node);return node;
    }
    append(...nodes){nodes.forEach(node=>this.insertBefore(node));}
    before(node){this.parentNode.insertBefore(node,this);}
    after(node){this.parentNode.insertBefore(node,this.nextSibling);}
    replaceChildren(...nodes){this.childNodes.forEach(node=>{node.parentNode=null;});this.childNodes=[];this.append(...nodes);}
    querySelector(selector){const node=registry.get(selector);return node&&this.contains(node)?node:null;}
    querySelectorAll(selector){if(selector==='button')return this.childNodes.filter(node=>node.tagName==='BUTTON');return [];}
    setAttribute(name,value){this.attrs.set(name,String(value));}
    getAttribute(name){return this.attrs.has(name)?this.attrs.get(name):null;}
    addEventListener(name,listener){if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(listener);}
    click(){for(const listener of this.listeners.get('click')||[])listener.call(this,{target:this});}
  }
  const document=new Element('document','#document');
  document.createComment=label=>{stats.markers++;return new Element(label,'#comment');};
  document.querySelectorAll=()=>[];
  const app=new Element('app'),head=new Element('head'),logo=new Element('logo'),tabs=new Element('tabs'),tools=new Element('tools'),dock=new Element('dock'),choice=new Element('choice','select');
  document.append(app);app.append(head);head.append(logo,tabs,tools,dock);dock.append(choice);app.dataset.activeTab='schedule';
  registry.set('.tabs',tabs);registry.set('.nav-tools',tools);
  const tabNames=['schedule','private','record','personal','task'];
  const labels=[['캘린더','감정 인사이트'],['루틴','어학'],['Record','Archive','Travel'],['개인 기록','통합 대시보드'],['고객 관리','입시요강']];
  const parents=new Map(),buttons=[],clicks=[];
  const groups=tabNames.map((tab,i)=>{
    const parent=new Element(tab+'-page'),node=new Element(tab+'-nav','nav');app.append(parent);parent.append(node);parents.set(node,parent);tracked.add(node);
    labels[i].forEach((label,index)=>{const b=new Element(tab+'-'+index,'button');b.label=label;if(index===0)b.classList.add('active');const listener=()=>clicks.push(b.name);b.addEventListener('click',listener);node.append(b);buttons.push({b,listener});});
    return {tab,node,names:labels[i]};
  });
  for(const id of ['recordShell','albumShell','eventArchiveShell','travelArchiveShell']){const n=new Element(id);app.append(n);registry.set('#'+id,n);}
  const moves=new Map(),created=new Set([dock]);
  const context={document,app,head,dock,choice,groups,moves,created,$:(selector,root=document)=>root.querySelector(selector),currentEvent:()=> 'record',Option:function Option(label,value){const node=new Element('option','option');node.label=label;node.value=String(value);return node;}};
  vm.createContext(context);
  vm.runInContext(productionFunction(text,'move','make')+productionFunction(text,'arrangeHeader','arrangeCalendar')+productionFunction(text,'restore','apply'),context);
  const reset=()=>{stats.reattaches=0;stats.navReattaches=0;};
  const order=()=>dock.childNodes.filter(node=>node.nodeType===1).map(node=>node.name);
  return {...context,Element,stats,reset,order,parents,buttons,clicks};
}

test('100 settled Modern refreshes preserve nav order with zero reattachments/extra markers',()=>{
  const h=harness();h.arrangeHeader();const count=h.stats.markers;h.reset();
  for(let i=0;i<100;i++)h.arrangeHeader();
  assert.equal(h.stats.reattaches,0);assert.equal(h.stats.navReattaches,0);assert.equal(h.stats.markers,count);assert.equal(count,6);
  assert.deepEqual(h.order(),['schedule-nav','private-nav','record-nav','personal-nav','task-nav','choice']);
});

test('moving navigation preserves exact live button objects and listeners',()=>{
  const h=harness(),original=h.buttons.map(({b})=>b);h.arrangeHeader();
  for(let i=0;i<100;i++)h.arrangeHeader();
  h.groups.forEach(group=>group.node.querySelectorAll('button').forEach(button=>assert(original.includes(button))));
  h.buttons.forEach(({b,listener})=>{assert.equal(b.listeners.get('click')[0],listener);b.click();});
  assert.deepEqual(h.clicks,original.map(button=>button.name));
});

test('active group/selected page changes visibility and select value without detaching live navs',()=>{
  const h=harness();h.arrangeHeader();h.reset();
  for(const group of h.groups){
    h.app.dataset.activeTab=group.tab;const buttons=group.node.querySelectorAll('button');buttons[0].classList.remove('active');buttons[1].classList.add('active');
    h.arrangeHeader();
    assert.equal(h.choice.dataset.menu,group.tab);assert.equal(h.choice.value,group.tab==='record'?'record':'1');assert.equal(h.dock.hidden,false);
    for(const row of h.groups)assert.equal(row.node.hidden,row!==group||row.tab==='record');
  }
  h.app.dataset.activeTab='work';h.arrangeHeader();assert.equal(h.dock.hidden,true);assert.equal(h.stats.navReattaches,0);
});

test('Editorial restore is idempotent for 100 repeats and a subsequent Modern round trip',()=>{
  const h=harness();h.arrangeHeader();h.restore();const markers=h.stats.markers;h.reset();
  for(let i=0;i<100;i++)h.restore();
  assert.equal(h.stats.reattaches,0);assert.equal(h.stats.markers,markers);assert.equal(h.dock.hidden,true);
  for(const group of h.groups){assert.equal(group.node.parentNode,h.parents.get(group.node));assert.equal(group.node.hidden,false);assert.equal(h.moves.get(group.node).nextSibling,group.node);}
  h.arrangeHeader();h.reset();for(let i=0;i<100;i++)h.arrangeHeader();
  assert.equal(h.stats.reattaches,0);assert.equal(h.stats.markers,markers);
  assert.deepEqual(h.order(),['schedule-nav','private-nav','record-nav','personal-nav','task-nav','choice']);
});

test('before===node does no reattach, marker creation, or listener replacement',()=>{
  const h=harness(),node=new h.Element('work-navigation','nav');h.head.append(node);h.reset();
  for(let i=0;i<100;i++)h.move(node,h.head,node);
  assert.equal(h.stats.reattaches,0);assert.equal(h.stats.markers,0);assert.equal(h.moves.size,0);
});

test('APP native and Android-document guards still return before website DOM work',()=>{
  for(const mode of ['native','android']){
    let documentQueries=0;
    vm.runInNewContext(source,{window:{AiderLogNative:mode==='native'?{}:null},document:{documentElement:{classList:{contains:name=>mode==='android'&&name==='aiderlog-android'}},querySelector(){documentQueries++;throw Error('App guard was bypassed');}}});
    assert.equal(documentQueries,0);
  }
});

test('negative control: v169 commit 3134bde repeats 500 nav reattachments in 100 refreshes',t=>{
  let old;
  try{old=cp.execFileSync('git',['show','3134bde:site-layout-v165.js'],{cwd:repo,encoding:'utf8',stdio:['ignore','pipe','pipe']});}
  catch{t.skip('Historical Git fixture unavailable in this source-only archive');return;}
  const h=harness(old);h.arrangeHeader();h.reset();for(let i=0;i<100;i++)h.arrangeHeader();
  assert.equal(h.stats.navReattaches,500);assert.throws(()=>assert.equal(h.stats.navReattaches,0));
  h.restore();h.reset();for(let i=0;i<100;i++)h.restore();assert(h.stats.reattaches>=500);
  t.diagnostic('Same production-function harness: 3134bde = 500 nav reattachments; current = 0. Browser pointer verification is separate.');
});
