const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const read = name => fs.readFileSync(path.join(__dirname, name), 'utf8');
const native = read('WidgetNativeV164.java');
const compact = read('WidgetCompactCalendarV181.java');
const layout = name => read(`res/layout/${name}.xml`);

test('A has exactly two equal independent native scrolling collections, no header', () => {
  const xml=layout('widget_agenda_compact_v181');
  assert.equal((xml.match(/<ListView\b/g)||[]).length,2);
  assert.equal((xml.match(/android:layout_weight="1"/g)||[]).length,2);
  assert.match(xml, /@\+id\/widget_items_v164/);
  assert.match(xml, /@\+id\/w165_secondary_list/);
  assert.match(xml, /android:padding="4dp"/);
  assert.doesNotMatch(xml, /widget_(title|subtitle|previous|next|add)/);
  assert.match(compact, /String todoKind=kind\+"@todos"/);
  assert.match(native, /notifyAppWidgetViewDataChanged\(widget,id\(c,"w165_secondary_list"\)\)/);
  assert.match(native, /setData\(Uri.parse\("aiderlog-widget-rows:\/\/"\+widget\+"\/"\+kind/);
});
test('A schedule and todo row height and divider location are exactly aligned', () => {
  for(const name of ['widget_compact_event_v181','widget_compact_todo_v181']) {
    const xml=layout(name);
    assert.match(xml, /android:id="@\+id\/w181_row"[^>]*android:layout_height="26dp"/);
    assert.match(xml, /android:layout_height="0\.5dp" android:layout_gravity="bottom"/);
    assert.doesNotMatch(xml, /widget_(panel|card|framed)/);
  }
  assert.match(layout('widget_compact_event_v181'), /id="@\+id\/w181_time"[^>]*layout_width="36dp"/);
  assert.equal(Math.floor((168-8)/26),6);
});
test('B uses 60/40 split with fourteen single-line day cells and opens actual date', () => {
  const xml=layout('widget_fortnight_compact_v181');
  assert.match(xml, /id="@\+id\/widget_calendar_v164"[^>]*layout_weight="3"/);
  assert.match(xml, /<FrameLayout[^>]*layout_weight="2"/);
  assert.doesNotMatch(xml, /widget_(title|subtitle|previous|next|add)/);
  assert.match(compact, /for\(int r=0;r<2;r\+\+\)/);
  assert.match(compact, /for\(int col=0;col<7;col\+\+\)/);
  assert.match(compact, /dated.get\(0\)/);
  assert.match(compact, /"open-schedule-date-v168:"\+key/);
  assert.doesNotMatch(compact, /navigate\(/);
  assert.match(layout('widget_compact_day_v181'), /id="@\+id\/w181_event"[^>]*singleLine="true"[^>]*ellipsize="end"/);
});
test('B has two compact todo columns and a non-collapsing odd final slot', () => {
  assert.match(layout('widget_compact_todo_cell_v181'), /layout_width="0dp" android:layout_height="21dp" android:layout_weight="1"/);
  assert.match(layout('widget_compact_todo_group_v181'), /layout_height="21dp"/);
  assert.match(compact, /if\(child==null\)item.setViewVisibility\(id\(c,"w181_row"\),View.INVISIBLE\)/);
  assert.equal(Math.floor(((168-8-1)*.4)/21),3);
});
test('native preview uses the installed tree, measured 4x2 frame and six rows', () => {
  assert.match(native, /WidgetCompactCalendarV181.render/);
  assert.match(native, /WidgetPreviewFrameV181.prepare\(activity,host,previewKind\)/);
  assert.match(native, /WidgetPreviewFrameV181.restore\(\)/);
  assert.match(compact, /row\(c,widget,kind,values.get\(i\),i,chosen,selectedFont\)/);
  assert.match(compact, /selectedFont,6\)/);
  assert.match(compact, /agenda\?6:3/);
  assert.doesNotMatch(compact, /Bitmap|Canvas|setImageViewBitmap/);
});
test('actions and adapter identity preserve real stable IDs, no clipped collection cap', () => {
  assert.match(native, /WidgetDesignV165.stableId\(rows.get\(i\),i\)/);
  assert.match(native, /setRemoteAdapter/);
  assert.match(compact, /WidgetDesignV165.action\(data,widget,kind,record,"todo","true"\)/);
  assert.match(compact, /WidgetDesignV165.action\(data,widget,kind,record,"open","todo"\)/);
  assert.match(compact, /"open-schedule-item-v168:"\+Uri.encode\(record.toString\(\)\)/);
  assert.match(compact, /if\(values==null\)values=model.optJSONArray\("todos"\)/);
  assert.doesNotMatch(compact.split('static List<String> incompleteRows')[1].split('static List<String> rows')[0], /dueAt|Math\.min\(6/);
});
test('service rows stop showing or rebinding old records immediately on account change', () => {
  const service=read('WidgetRowsV164.java');
  assert.match(service, /owner=WidgetCompactCalendarV181.owner\(data\)/);
  assert.match(service, /public int getCount\(\)\{return currentOwner\(\)\?items.size\(\):0/);
  assert.match(service, /return !currentOwner\(\)\|\|position<0/);
  assert.match(compact, /record.has\("_widgetOwnerV181"\)&&!sameOwner/);
  assert.match(compact, /WidgetDesignV165.put\(row,"_widgetOwnerV181",owner\)/);
});
test('headerless agenda follows the current day rather than an invisible old date preference', () => {
  assert.match(compact, /String today=day\(Calendar.getInstance\(\)\);return "CalendarAgenda".equals\(WidgetDesignV165.base\(kind\)\)\?today:fortnightSelected/);
  assert.match(compact, /scheduleRows\(data.optJSONArray\("scheduleItems"\),selectedDay\(c,widget,kind\)\)/);
  assert.match(compact, /put\(record,"selectedDate",selectedDay\(c,widget,kind\)\)/);
});
test('headerless fortnight advances with the current week and ignores stale date anchors', () => {
  assert.match(compact, /String today=day\(Calendar.getInstance\(\)\),selected=fortnightSelected\(today,selected\(c,widget\)\);Calendar start=date\(fortnightStart\(today\)\)/);
  assert.doesNotMatch(compact, /Calendar start=date\(selected\)/);
  assert.match(compact, /stored.compareTo\(start\)>=0&&stored.compareTo\(day\(end\)\)<=0\?stored:today/);
});
