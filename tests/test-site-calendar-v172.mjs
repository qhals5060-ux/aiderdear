/* Bounded presentation regression tests. No user records or browser storage are accessed. */
import assert from 'node:assert/strict';
import test from 'node:test';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

const script=await readFile(new URL('../site-calendar-v172.js',import.meta.url),'utf8');
const css=await readFile(new URL('../site-calendar-v172.css',import.meta.url),'utf8');
const index=await readFile(new URL('../index.html',import.meta.url),'utf8');
class LabelNode {
  constructor(text=''){this.text=text;this.attributes=new Map();this.dataset={};this.textWrites=0;this.attributeWrites=0;this.listeners=[];}
  get textContent(){return this.text;}
  set textContent(value){this.text=String(value);this.textWrites++;}
  getAttribute(name){return this.attributes.get(name)??null;}
  setAttribute(name,value){this.attributes.set(name,value);this.attributeWrites++;}
  matches(selector){return this.selector===selector;}
  closest(){return this.closestLabelRoot||null;}
}
function run({modern=true,android=false,preview=false,native=false,androidBridge=false}={}){
  const classes=new Set([...(modern?['modern-site']:[]),...(android?['aiderlog-android']:[])]);
  const nodes=new Map(['app','page0','calendar','emotionInsightPage','addScheduleTop','addEmotionTop'].map(id=>[id,new LabelNode()]));
  nodes.get('addScheduleTop').text='+ 일정 등록';nodes.get('addEmotionTop').text='+ 감정 기록';
  const insight=new LabelNode(modern?'감정 인사이트':''),choice=new LabelNode(),first=new LabelNode('캘린더'),second=new LabelNode('감정 인사이트');
  first.value='0';second.value='1';choice.options=[first,second];choice.dataset.menu='schedule';
  const originalListener=()=>{};insight.listeners.push(originalListener);nodes.get('addScheduleTop').listeners.push(originalListener);
  const raf=[],observers=[],events=new Map();
  const document={documentElement:{classList:{contains:name=>classes.has(name),add:name=>classes.add(name)}},getElementById:id=>nodes.get(id)||null,
    querySelector:selector=>selector==='.page-dots [data-page="1"]'?insight:selector==='.modern-header-page-select'?choice:null};
  const window={...(native?{AiderLogNative:{}}:{}),...(androidBridge?{Android:{}}:{})};
  const context=vm.createContext({window,document,location:{search:typeof preview==='string'?preview:preview?'?android-preview=1':''},URLSearchParams,
    requestAnimationFrame:fn=>{raf.push(fn);return raf.length;},addEventListener:(type,fn)=>events.set(type,fn),
    MutationObserver:class{constructor(callback){this.callback=callback;observers.push(this);}observe(node,options){this.node=node;this.options=options;}}});
  vm.runInContext(script,context);
  const drain=()=>{let count=0;while(raf.length){assert(++count<10,'unexpected perpetual refresh loop');raf.shift()();}};
  return {window,context,classes,nodes,insight,choice,first,second,raf,observers,events,drain,originalListener};
}

test('Site installs once, renames existing navigation and preserves original controls/listeners',()=>{
  const h=run();assert(h.classes.has('site-calendar-v172'));
  assert.equal(h.insight.textContent,'인사이트');assert.equal(h.insight.getAttribute('aria-label'),'인사이트');
  assert.equal(h.second.textContent,'인사이트');assert.equal(h.first.textContent,'캘린더');
  assert.equal(h.nodes.get('emotionInsightPage').getAttribute('aria-label'),'인사이트');
  assert.equal(h.nodes.get('emotionInsightPage').textWrites,0,'insight content must not be replaced');
  assert.equal(h.nodes.get('addScheduleTop').textContent,'+ 일정');assert.equal(h.nodes.get('addScheduleTop').getAttribute('aria-label'),'일정 등록');
  assert.equal(h.nodes.get('addEmotionTop').textContent,'+ 감정');
  assert.equal(h.insight.listeners[0],h.originalListener);assert.equal(h.nodes.get('addScheduleTop').listeners[0],h.originalListener);
  assert.equal(h.observers.length,1);vm.runInContext(script,h.context);assert.equal(h.observers.length,1);
});

test('100 refreshes cause no new text/attribute writes, no reparenting, and no calendar render feedback',()=>{
  const h=run(),all=[...h.nodes.values(),h.insight,h.first,h.second];
  const before=all.map(node=>[node.textWrites,node.attributeWrites]);
  for(let count=0;count<100;count++)h.window.AiderLogSiteCalendarV172.refresh();
  assert.deepEqual(all.map(node=>[node.textWrites,node.attributeWrites]),before);
  h.observers[0].callback([{target:h.nodes.get('calendar')}]);assert.equal(h.raf.length,0);
  h.insight.closestLabelRoot={};h.insight.text='감정 인사이트';
  h.observers[0].callback([{target:h.insight}]);h.drain();assert.equal(h.insight.textContent,'인사이트');
  h.observers[0].callback([{target:h.insight}]);h.drain();assert.equal(h.raf.length,0);
  assert(!/\.(?:append|appendChild|insertBefore|replaceChildren|remove|before|after)\s*\(/.test(script),'live nodes must never be reparented');
  assert(!/localStorage|sessionStorage|indexedDB|fetch\s*\(|\.click\s*\(/.test(script),'presentation must not read/write records or replay actions');
});

test('Editorial dot artwork stays empty; edition events and recreated mobile options get the new label',()=>{
  const h=run({modern:false});assert.equal(h.insight.textContent,'');assert.equal(h.insight.getAttribute('aria-label'),'인사이트');
  h.classes.add('modern-site');h.insight.text='감정 인사이트';h.second.text='감정 인사이트';
  h.events.get('aiderlog-site-editionchange')();h.drain();assert.equal(h.insight.textContent,'인사이트');assert.equal(h.second.textContent,'인사이트');
  h.choice.dataset.menu='record';h.second.text='Archive';h.window.AiderLogSiteCalendarV172.refresh();assert.equal(h.second.textContent,'Archive');
});

test('Android bridge, Android class and preview do not install labels/styles/observers',()=>{
  for(const options of [{native:true},{android:true},{androidBridge:true},{preview:true},{preview:'?android-preview'},{preview:'?android-preview=fold'},{preview:'?android-preview=0'}]){
    const h=run(options);assert(!h.classes.has('site-calendar-v172'));assert.equal(h.observers.length,0);assert.equal(h.window.AiderLogSiteCalendarV172,undefined);assert.equal(h.insight.textContent,'감정 인사이트');
  }
});

test('Static layout keeps both frame ownership models, full-height calendar and compact controls above D-DAY',()=>{
  assert(css.includes('#page0>.frame {\n  display:contents!important'));
  assert(css.includes('#calendar {\n  grid-column:1!important;grid-row:1/-1!important'));
  assert(css.includes('#page0 .cal-top {\n  grid-column:2!important;grid-row:1!important'));
  assert(css.includes('#page0>.side {\n  grid-column:2!important;grid-row:2!important'));
  assert(css.includes('#page0 .month-controls {\n  display:contents!important'));
  assert(css.includes('@media(max-width:760px)'));assert(css.includes('grid-template-rows:auto minmax(460px,65dvh) auto!important'));
  assert(css.includes('#calendar .day:is(:hover,:focus-within) .ev'));
  assert(css.includes('body>.calendar-event-tooltip>span {grid-template-columns:58px minmax(0,1fr)!important;font-size:14px!important'));
  for(const id of ['calendar','monthTitle','prevMonth','nextMonth','todayBtn','addScheduleTop','addEmotionTop','ddayManageBtn','emotionInsightPage','emotionInsightFrame','storyMediaOpen','storyMediaControls','storyMediaMinimize'])assert(index.includes(`id="${id}"`),`existing control missing: ${id}`);
});

test('Photo controls occupy a separate static grid row, preserve hidden/collapse and never cover/crop media',()=>{
  assert(css.includes('#storyMediaOpen {\n  grid-column:1/-1!important;grid-row:1!important;position:relative!important'));
  assert(css.includes('#storyMediaControls {\n  grid-column:1!important;grid-row:2!important;position:static!important'));
  assert(css.includes('#storyMediaMinimize {grid-column:2!important;grid-row:2!important;position:static!important'));
  assert(css.includes('object-fit:contain!important'));assert(css.includes('#storyMediaControls[hidden] {display:none!important}'));
  assert(css.includes('#storyMediaOpen:has(>img:not([hidden]),>video:not([hidden])) #mediaPlaceholder2 {display:none!important}'));
  assert(css.includes('#storyMediaCard.is-collapsed :is(#storyMediaOpen,#storyMediaControls) {display:none!important}'));
  assert(css.includes('border:0!important;border-radius:0!important;\n  box-shadow:none!important;background:transparent!important'));
  const selectors=css.replace(/\/\*[\s\S]*?\*\//g,'').match(/[^{}]+(?=\{)/g)||[];
  for(const selector of selectors.filter(selector=>!selector.trim().startsWith('@'))){assert(selector.includes('html.site-calendar-v172:not(.aiderlog-android)'),`unscoped CSS selector: ${selector}`);assert(!selector.includes(':host'),'unrelated shadow roots must remain unchanged');}
});

test('Actual media source renderer exposes one media node and hides placeholder in image/video modes',()=>{
  const source=index.match(/function applyMediaSource\(src,type\)\{[\s\S]*?\n  \}/)?.[0];assert(source,'existing media renderer is required');
  const image={hidden:true,removeAttribute(name){delete this[name];}},video={hidden:true,pause(){},play:()=>Promise.resolve(),removeAttribute(name){delete this[name];}},placeholder={style:{display:'flex'}};
  const nodes={'#couplePhoto2':image,'#coupleVideo2':video,'#mediaPlaceholder2':placeholder};
  const context=vm.createContext({$:selector=>nodes[selector],pageIndex:0});vm.runInContext(source+'\nglobalThis.apply=applyMediaSource;',context);
  context.apply('blob:synthetic-photo','image/png');assert.equal(image.hidden,false);assert.equal(video.hidden,true);assert.equal(placeholder.style.display,'none');
  context.apply('blob:synthetic-video','video/mp4');assert.equal(image.hidden,true);assert.equal(video.hidden,false);assert.equal(placeholder.style.display,'none');
  // The scoped :has selector must match either state, defeating legacy !important display:grid.
  assert(css.includes(':has(>img:not([hidden]),>video:not([hidden])) #mediaPlaceholder2 {display:none!important}'));
});
