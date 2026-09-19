'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const attr=(xml,name)=>xml.match(new RegExp('android:'+name+'="([^"]+)"'))?.[1];
const minima={combined:[180,110],agenda:[110,110],fortnight:[180,110],month:[180,180],split:[180,180]};
for(const[kind,[width,height]]of Object.entries(minima))test(kind+' allows shrinking independently of its initial placement size',()=>{
 const xml=read('res/xml/widget_calendar_'+kind+'.xml');
 assert.equal(attr(xml,'minResizeWidth'),width+'dp');assert.equal(attr(xml,'minResizeHeight'),height+'dp');
 assert.ok(width<parseFloat(attr(xml,'minWidth')));assert.ok(height<parseFloat(attr(xml,'minHeight')));
 assert.equal(attr(xml,'resizeMode'),'horizontal|vertical');assert.equal(attr(xml,'maxResizeWidth'),undefined);assert.equal(attr(xml,'maxResizeHeight'),undefined);
});
test('small agenda fits one full upcoming row and one full todo at 110dp',()=>{
 const height=110-8-24,half=height/2;
 assert.ok(half>=parseFloat(attr(read('res/layout/widget_upcoming_small_v185.xml'),'minHeight')));
 assert.ok(half>=parseFloat(attr(read('res/layout/widget_todo_small_v185.xml'),'minHeight')));
 const java=read('WidgetCompactCalendarV181.java');assert.match(java,/show\(c,result,"w184_todo_heading",height>=170\)/);
 assert.match(java,/show\(c,result,"widget_previous",width>=180\)/);
});
test('compact upcoming records retain date, time, title and individual opening actions',()=>{
 const xml=read('res/layout/widget_upcoming_small_v185.xml');
 for(const id of ['w184_event_date','w184_event_time','w184_event_title','w184_event_mark'])assert.ok(xml.includes('/'+id+'"'));
 assert.match(read('WidgetCompactCalendarV181.java'),/setOnClickFillInIntent\(id\(c,"w184_row"\)/);
 assert.match(read('WidgetCompactCalendarV181.java'),/if\(slots==0&&!dated.isEmpty\(\)\)text\(c,cell,"w184_day"/);
});
test('launchers receive resize callbacks and isolated exact-size adapter rows',()=>{
 assert.match(read('WidgetProvider.java'),/onAppWidgetOptionsChanged/);
 assert.match(read('WidgetSizeV169.java'),/appWidgetSizes/);
 assert.match(read('WidgetRowsV164.java'),/WidgetSizeV169.active.set\(bounds\)/);
});
