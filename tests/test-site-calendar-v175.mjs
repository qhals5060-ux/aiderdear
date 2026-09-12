import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const script=await readFile(new URL('../site-calendar-v175.js',import.meta.url),'utf8');
const css=(await readFile(new URL('../site-calendar-v175.css',import.meta.url),'utf8')).replaceAll('\r\n','\n');
class Node{
  constructor(id='',className=''){this.id=id;this.className=className;this.children=[];this.attributes={};this.moves=0;this.scrollTop=47;this.listeners=['existing'];}
  get firstChild(){return this.children[0]||null;}
  appendChild(child){return this.insertBefore(child,null);}
  insertBefore(child,before){if(child.parentNode)child.parentNode.children.splice(child.parentNode.children.indexOf(child),1);this.children.splice(before?this.children.indexOf(before):this.children.length,0,child);child.parentNode=this;child.moves++;return child;}
  contains(child){return this===child||this.children.some(row=>row.contains(child));}
  closest(selector){if(this.className===selector.slice(1))return this;return this.parentNode?.closest(selector)||null;}
  querySelector(selector){return this.children.find(child=>child.className===selector.slice(1))||null;}
  setAttribute(key,value){this.attributes[key]=value;}
}
function harness({preview=false,native=false,android=false,bridge=false,missing=false}={}){
  const classes=new Set(android?['aiderlog-android']:[]),nodes=new Map(['app','page0','calendar','sharedListTop','sharedList','photo'].map(id=>[id,new Node(id)])),agenda=new Node('','month-agenda'),lower=new Node('','agenda-lower');
  agenda.appendChild(nodes.get('sharedListTop'));agenda.appendChild(lower);lower.appendChild(nodes.get('sharedList'));lower.appendChild(nodes.get('photo'));
  const document={documentElement:{classList:{contains:name=>classes.has(name),add:name=>classes.add(name)}},getElementById:id=>missing&&id==='calendar'?null:nodes.get(id),createElement:()=>new Node()};
  const window={...(native?{AiderLogNative:{}}:{}),...(bridge?{Android:{}}:{})},events=new Map();
  const context=vm.createContext({window,document,URLSearchParams,location:{search:preview?'?android-preview=1':''},addEventListener:(name,fn)=>events.set(name,fn)});
  vm.runInContext(script,context);return{window,document,classes,nodes,agenda,lower,context,events};
}
test('existing two agenda lists share one scroll region without replacing nodes/media/listeners',()=>{
  const h=harness(),wrapper=h.agenda.children[0];assert.equal(wrapper.className,'site-month-agenda-list-v175');
  assert.deepEqual(wrapper.children,[h.nodes.get('sharedListTop'),h.nodes.get('sharedList')]);assert.equal(h.lower.children[0],h.nodes.get('photo'));
  assert.equal(wrapper.attributes.role,'region');assert.equal(wrapper.tabIndex,0);assert.equal(h.window.AiderLogSiteCalendarV175.eventLineLimit(),3);
  for(const node of h.nodes.values())assert.deepEqual(node.listeners,['existing']);
});
test('refresh/edition changes install wrapper once and preserve scroll; no state/network side effects',()=>{
  const h=harness(),wrapper=h.agenda.children[0],moves=[...h.nodes.values()].map(node=>node.moves);
  for(let i=0;i<50;i++)h.window.AiderLogSiteCalendarV175.refresh();h.events.get('aiderlog-site-editionchange')();vm.runInContext(script,h.context);
  assert.equal(h.agenda.children[0],wrapper);assert.equal(wrapper.scrollTop,47);assert.deepEqual([...h.nodes.values()].map(node=>node.moves),moves);
  assert(!/localStorage|sessionStorage|indexedDB|fetch\s*\(|MutationObserver|\.click\s*\(|innerHTML/.test(script));
});
test('all Android paths and missing calendar skip site-only reparenting',()=>{
  for(const options of [{preview:true},{native:true},{android:true},{bridge:true},{missing:true}]){const h=harness(options);assert(!h.classes.has('site-calendar-v175'));assert.equal(h.window.AiderLogSiteCalendarV175,undefined);assert.equal(h.nodes.get('sharedList').parentNode,h.lower);}
});
test('three event rows fit 88px cell and overflow count does not consume a fourth row',()=>{
  assert(css.includes('repeat(6,minmax(88px,1fr))'));assert(css.includes('flex:0 0 18px!important;height:18px!important'));assert(css.includes('min-height:20px!important;height:20px!important'));
  assert(css.includes('.calendar-more-count {\n  position:absolute!important'));assert(20+3*18+3*2+8<=88);
  assert(css.includes('font-size:11px!important;line-height:14px!important'));assert(!css.includes('repeat(6,minmax(104px'));
});
test('half-height media has top-right close/minimize, lower-center counter, lower-right download',()=>{
  assert(css.includes('grid-template-rows:minmax(0,1fr) minmax(0,1fr)!important'));
  assert(css.includes('#storyMediaControls {\n  display:contents!important'));assert(css.includes('#storyMediaControls[hidden] {display:none!important}'));
  for(const id of ['storyMediaMinimize','coupleMediaDelete'])assert(new RegExp('#'+id+' \\{\\n  grid-row:1!important;justify-self:end!important').test(css));
  assert(css.includes('#storyMediaDownload {justify-self:end!important}'));assert(css.includes('#storyMediaCounter {\n  grid-column:1!important;justify-self:center!important'));
  assert(css.includes('object-fit:contain!important'));assert(css.includes('#storyMediaCard.is-collapsed :is(#storyMediaOpen,#storyMediaControls) {display:none!important}'));
});
test('mood author fills and private icons share upper-right row in both clients; unrelated pages stay scoped',()=>{
  assert(css.includes('.calendar-status-icons {\n  position:absolute!important;top:3px!important;right:3px!important;bottom:auto!important'));
  for(const kind of ['mine','partner','shared'])assert(css.includes('.calendar-status-icon.mood.'+kind));
  const selectors=css.replace(/\/\*[\s\S]*?\*\//g,'').match(/[^{}]+(?=\{)/g)||[];
  for(const selector of selectors.filter(s=>!s.trim().startsWith('@'))){assert(selector.includes('html.site-calendar-v175:not(.aiderlog-android)')||selector.includes('#calendar .calendar-status-icon')||selector.includes('#calendar .day'),selector);}
});
