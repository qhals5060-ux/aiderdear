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
test('five calendars use six-dp padding and 30dp navigation instead of oversized chrome',()=>{
  for(const name of ['widget_split_compact_v184','widget_agenda_compact_v184','widget_month_compact_v184']){
    const root=tree(name),shell=kids(root)[1],header=kids(shell)[0];assert.equal(dp(shell,'padding'),6);assert.equal(dp(header,'layout_height'),30);
    assert.equal(255-2*dp(shell,'padding')-dp(header,'layout_height'),213);
  }
});
test('calendar text has a distinct holiday line and scalable compact todo rows',()=>{
  const day=tree('widget_event_day_v184'),todo=tree('widget_todo_row_v184');
  assert.equal(dp(day,'layout_margin'),0);assert.equal(attr(find(day,'w184_day'),'layout_height'),'wrap_content');
  assert.equal(attr(find(day,'w184_holiday'),'singleLine'),'true');assert.equal(attr(find(day,'w184_holiday'),'ellipsize'),'end');
  assert.equal(dp(find(todo,'w184_check_hit'),'layout_width'),30);assert.equal(dp(find(todo,'w184_todo_title'),'textSize'),12);
  assert.equal(attr(find(todo,'w184_todo_title'),'layout_height'),'wrap_content');assert.equal(attr(find(todo,'w184_todo_title'),'minHeight'),'29dp');
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
  assert.match(generator,/calendar-preview-v184.cjs/);
  assert.match(source('calendar-preview-v184.cjs'),/fillContainer\(read\('layout','widget_week_v164'\),'widget_week_cells_v164',cells\)/);
  assert.doesNotMatch(generator,/layout_height:'28dp'/);
});
