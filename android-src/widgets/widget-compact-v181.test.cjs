// v184 updates the compact calendar regression contract to the five approved layouts.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),test=require('node:test');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8'),native=read('WidgetNativeV164.java'),compact=read('WidgetCompactCalendarV181.java'),layout=n=>read('res/layout/'+n+'.xml');
test('all five existing providers share live compact renderer without example records',()=>{
 for(const type of ['CalendarCombined','CalendarAgenda','CalendarFortnight','CalendarMonth','CalendarSplit'])assert.ok(compact.includes('"'+type+'".equals'));
 assert.match(native,/WidgetCompactCalendarV181.render/);assert.doesNotMatch(compact,/Bitmap|Canvas|팀 미팅|발표 자료 준비/);
});
test('first style keeps month left and upcoming right independently of Fold width',()=>{
 const xml=layout('widget_split_compact_v184');assert.match(xml,/layout_weight="48"/);assert.match(xml,/layout_weight="52"/);
 assert.ok(xml.indexOf('widget_calendar_v164')<xml.indexOf('widget_items_v164'));assert.equal((xml.match(/<ListView\b/g)||[]).length,1);
 assert.match(compact,/upcomingRows\(data.optJSONArray\("scheduleItems"\)/);assert.match(layout('widget_upcoming_row_v184'),/w184_event_date/);
});
test('second style stacks live collections; fifth puts todos below month',()=>{
 assert.equal((layout('widget_agenda_compact_v184').match(/<ListView\b/g)||[]).length,2);
 const month=layout('widget_month_compact_v184');assert.ok(month.indexOf('widget_calendar_v164')<month.indexOf('w184_todo_panel'));
 assert.match(month,/layout_weight="3"/);assert.match(month,/w184_todo_panel[^>]*layout_weight="1"/);assert.match(compact,/todos=agenda\|\|"CalendarSplit".equals\(kind\)/);
});
test('date actions, event titles and holidays remain separate and accessible',()=>{
 const day=layout('widget_event_day_v184');assert.ok(day.indexOf('w184_day')<day.indexOf('w184_holiday'));assert.ok(day.indexOf('w184_holiday')<day.indexOf('w184_events'));
 assert.match(compact,/count=fortnight\?2:/);assert.match(compact,/for\(int col=0;col<7;col\+\+\)/);assert.match(compact,/"open-schedule-date-v168:"\+key/);
 assert.match(compact,/"open-schedule-item-v168:"\+Uri.encode\(event.toString\(\)\)/);assert.match(layout('widget_event_chip_tall_v184'),/maxLines="2"/);assert.match(compact,/scaledDensity/);
});
test('todo completion, stable IDs and owner boundaries are retained without a collection cap',()=>{
 assert.match(native,/WidgetDesignV165.stableId\(rows.get\(i\),i\)/);assert.match(native,/notifyAppWidgetViewDataChanged\(widget,id\(c,"w165_secondary_list"\)\)/);
 assert.match(compact,/WidgetDesignV165.action\(data,widget,kind,record,"todo","true"\)/);assert.match(compact,/WidgetDesignV165.action\(data,widget,kind,record,"open","todo"\)/);
 assert.match(compact,/record.has\("_widgetOwnerV181"\)&&!sameOwner/);assert.match(compact,/WidgetDesignV165.put\(row,"_widgetOwnerV181",owner\)/);
 assert.match(read('WidgetRowsV164.java'),/getCount\(\)\{return currentOwner\(\)\?items.size\(\):0/);
 assert.doesNotMatch(compact.split('static List<String> incompleteRows')[1].split('static List<String> rows')[0],/dueAt|Math\.min\(6/);
});
test('settings previews share installed renderer and restore launcher bounds',()=>{
 assert.match(native,/WidgetPreviewFrameV181.prepare\(activity,host,previewKind\)/);assert.match(native,/WidgetPreviewFrameV181.restore\(\)/);
 assert.match(read('WidgetPreviewFrameV181.java'),/WidgetCompactCalendarV181.ratio\(kind\)/);
});
