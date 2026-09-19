'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const xml=require('C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js');
const source=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const tree=n=>xml.xml2js(source('res/layout/'+n+'.xml'),{compact:false}).elements.find(n=>n.type==='element');
const attr=(n,k)=>n.attributes?.['android:'+k];
const kids=n=>(n.elements||[]).filter(x=>x.type==='element');
const find=(n,id)=>attr(n,'id')?.endsWith('/'+id)?n:kids(n).map(k=>find(k,id)).find(Boolean);
const dp=(n,k)=>parseFloat(attr(n,k)||'0');
test('native shared shell gives content at least 120dp in a 168dp host',()=>{
  for(const name of ['widget_design_v165','widget_design_v165_wide']){
    const root=tree(name),shell=kids(root).find(n=>n.name==='LinearLayout'),header=find(root,'w165_header'),list=find(root,'widget_items_v164');
    const space=168-2*dp(shell,'padding')-dp(header,'layout_height')-dp(header,'layout_marginBottom')-dp(list,'paddingBottom');
    assert.equal(space,122,name);assert.ok(space>168-36-40-10-12);
  }
});
test('standard todo rows retain readable text and fit two complete records in 4x2',()=>{
  for(const suffix of ['','_cell']){
    const root=tree('widget_todo_v165'+suffix),body=kids(root).find(n=>n.name==='LinearLayout'),line=kids(body)[0];
    const row=dp(body,'paddingTop')+dp(body,'paddingBottom')+dp(line,'minHeight')+2*dp(root,'layout_margin');
    assert.ok(row<=46);assert.ok(Math.floor(122/row)>=2);
    assert.ok(dp(find(root,'w165_title'),'textSize')>=14);
    assert.equal(attr(find(root,'w165_title'),'layout_height'),'wrap_content');
  }
});
test('A reads six aligned rows at standard size without header or panel stacking',()=>{
  const root=tree('widget_agenda_compact_v181'),shell=kids(root)[1];
  const height=168-2*dp(shell,'padding');
  const event=tree('widget_compact_event_v181'),todo=tree('widget_compact_todo_v181');
  assert.equal(dp(event,'layout_height'),dp(todo,'layout_height'));
  assert.equal(Math.floor(height/dp(event,'layout_height')),6);
  assert.equal(dp(find(event,'w181_title'),'textSize'),12.5);
  assert.equal(dp(find(todo,'w181_title'),'textSize'),12.5);
  assert.equal(dp(find(event,'w181_time'),'layout_width'),36);
  assert.equal(kids(shell).filter(n=>n.name==='FrameLayout').length,2);
  assert.equal(find(root,'widget_title'),undefined);
});
test('B keeps 60/40 geometry and all 6 visible todo slots',()=>{
  const root=tree('widget_fortnight_compact_v181'),shell=kids(root)[1],parts=kids(shell);
  const total=168-2*dp(shell,'padding')-dp(parts[1],'layout_height'),todoHeight=total*2/5;
  assert.equal(dp(parts[0],'layout_weight'),3);assert.equal(dp(parts[2],'layout_weight'),2);
  assert.equal(Math.floor(todoHeight/dp(tree('widget_compact_todo_group_v181'),'layout_height'))*2,6);
  const day=tree('widget_compact_day_v181');
  assert.equal(dp(find(day,'w181_event'),'textSize'),8.5);
  assert.equal(dp(find(day,'w181_event_time'),'layout_width'),18);
  assert.equal(dp(find(day,'w181_event_time'),'textSize'),8);
  assert.ok((336-8)/7-2-3-18-1>22,'time has a separate bounded column so a title retains room');
  assert.equal(attr(find(day,'w181_event'),'singleLine'),'true');
  assert.equal(attr(find(day,'w181_event'),'ellipsize'),'end');
});
test('month cells reclaim the old 28dp date box and disconnected card gaps',()=>{
  const day=tree('widget_day_v164'),number=find(day,'widget_day_number_v164');
  assert.equal(dp(day,'layout_margin'),0);
  assert.equal(attr(number,'layout_height'),'wrap_content');
  assert.equal(dp(number,'minHeight'),14);
  assert.match(source('res/drawable/widget_day_bg_v164.xml'),/radius="0dp"/);
  assert.match(source('res/drawable/widget_day_bg_v164.xml'),/width="0.5dp"/);
});
test('picker shell and calendar rows come from installed native resources',()=>{
  const generator=source('generate-picker-v169.cjs');
  assert.match(generator,/function rootXml\(conf\)\{\s+let xml=read\('layout','widget_design_v165'\)/);
  assert.match(generator,/let result=read\('layout',split\?'widget_native_wide_v164':'widget_native_v164'\)/);
  assert.match(generator,/fillContainer\(read\('layout','widget_week_v164'\),'widget_week_cells_v164',cells\)/);
  assert.doesNotMatch(generator,/layout_height:'28dp'/);
});
