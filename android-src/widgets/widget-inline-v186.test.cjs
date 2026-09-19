'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const xml=require('C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const tree=name=>xml.xml2js(read('res/layout/'+name+'.xml'),{compact:false}).elements.find(n=>n.type==='element');
const attr=(node,key)=>node.attributes?.['android:'+key];
const children=node=>(node.elements||[]).filter(n=>n.type==='element');
test('inline date, time and title share one row and only the title may ellipsize',()=>{
 const root=tree('widget_upcoming_inline_v186'),nodes=children(root),text=nodes.filter(n=>n.name==='TextView');
 assert.equal(attr(root,'orientation'),'horizontal');assert.equal(attr(root,'minHeight'),'27dp');
 assert.deepEqual(text.map(n=>attr(n,'id')),['@+id/w184_event_date','@+id/w184_event_time','@+id/w184_event_title']);
 for(const node of text)assert.equal(attr(node,'singleLine'),'true');
 for(const node of text.slice(0,2)){assert.equal(attr(node,'layout_width'),'wrap_content');assert.equal(attr(node,'ellipsize'),undefined);}
 assert.equal(attr(text[2],'layout_width'),'0dp');assert.equal(attr(text[2],'layout_weight'),'1');assert.equal(attr(text[2],'ellipsize'),'end');
 assert.equal(nodes.filter(n=>n.name==='LinearLayout').length,0);
});
test('small fallback and calendar chips retain full row action targets with one-line titles',()=>{
 const fallback=read('res/layout/widget_upcoming_small_v185.xml');
 for(const id of ['w184_row','w184_event_date','w184_event_time','w184_event_title'])assert.ok(fallback.includes('/'+id+'"'));
 for(const name of ['widget_event_chip_v184','widget_event_chip_tall_v184']){const chip=tree(name);assert.equal(attr(chip,'singleLine'),'true');assert.equal(attr(chip,'maxLines'),undefined);assert.equal(attr(chip,'ellipsize'),'end');}
 const java=read('WidgetCompactCalendarV181.java');
 assert.match(java,/measure\.measureText\(dateLabel\)\/density/);assert.match(java,/measure\.measureText\(timeLabel\)\/density/);
 assert.match(java,/setOnClickFillInIntent\(id\(c,"w184_row"\),new Intent\(\)\.putExtra\("widgetRow",index\)\.putExtra\("action","open-schedule-item-v168:"\+Uri.encode\(record.toString\(\)\)\)\)/);
 assert.match(java,/setContentDescription\(id\(c,"w184_row"\),date\+" "\+timeLabel\+" "\+record.optString\("title"\)\)/);
});
test('compiled helper includes measured-width choice and new RemoteViews layout',()=>{
 const compiled=read('smali/WidgetCompactCalendarV181.smali');
 assert.match(compiled,/"widget_upcoming_inline_v186"/);assert.match(compiled,/Landroid\/graphics\/Paint;->measureText\(Ljava\/lang\/String;\)F/);
 assert.match(compiled,/->inlineEventRow\(FFFFF\)Z/);assert.match(compiled,/"widget_upcoming_small_v185"/);
});
