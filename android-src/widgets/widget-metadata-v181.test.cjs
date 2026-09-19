'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const manifest=fs.readFileSync(path.resolve(__dirname,'../AndroidManifest.xml'),'utf8');
const attr=(xml,name)=>xml.match(new RegExp('android:'+name+'="([^"]+)"'))?.[1];
for(const kind of ['agenda','fortnight'])test(`${kind} retains provider identity with a resizable 4 by 2 default`,()=>{
  const xml=read(`res/xml/widget_calendar_${kind}.xml`);
  assert.equal(attr(xml,'targetCellWidth'),'4');assert.equal(attr(xml,'targetCellHeight'),'2');
  assert.equal(attr(xml,'minWidth'),'250dp');assert.equal(attr(xml,'minHeight'),'110dp');
  assert.equal(attr(xml,'minResizeWidth'),'250dp');assert.equal(attr(xml,'minResizeHeight'),'110dp');
  assert.equal(attr(xml,'resizeMode'),'horizontal|vertical');
  assert.equal(attr(xml,'configure'),'com.aiderlog.v22app.WidgetConfigActivity');
  assert.equal(attr(xml,'previewImage'),`@drawable/widget_picker_calendar_${kind}_v164`);
  assert.equal(attr(xml,'previewLayout'),`@layout/widget_picker_calendar_${kind}_v164`);
  assert.equal(attr(xml,'initialLayout'),`@layout/widget_${kind}_compact_v181`);
  assert.ok(manifest.includes(`.WidgetProvider$Calendar${kind==='agenda'?'Agenda':'Fortnight'}`));
  assert.equal(xml,fs.readFileSync(path.resolve(__dirname,`../../../AiderLog-v145-decoded/res/xml/widget_calendar_${kind}.xml`),'utf8'));
});
test('picker regeneration preserves 4 by 2 spans and exact 2 to 1 artwork',()=>{
  const generator=read('generate-picker-v169.cjs');
  assert.match(generator,/calendar_agenda:\[2,168\]/);assert.match(generator,/calendar_fortnight:\[2,168\]/);
  assert.match(generator,/calendar_agenda:336,calendar_fortnight:336/);
  assert.match(generator,/minResizeWidth:'250dp',minResizeHeight:'110dp'/);
  assert.match(generator,/const initial=meta\.match/);assert.match(generator,/Do not replace runtime initialLayout with sample data/);
});
test('settings preview measures a compact inner 2 to 1 frame without changing installed host bounds',()=>{
  const helper=read('WidgetPreviewFrameV181.java');
  assert.match(helper,/width-left-right\)\/2f/);
  assert.match(helper,/new SizeF\(innerWidth\/density,innerWidth\/2f\/density\)/);
  assert.match(helper,/addOnLayoutChangeListener/);assert.match(helper,/removeOnLayoutChangeListener/);
  assert.match(helper,/WidgetSizeV169\.active\.remove\(\)/);assert.match(helper,/WidgetSizeV169\.active\.set\(prior\)/);
  assert.doesNotMatch(helper,/updateAppWidget|SharedPreferences|putInt|setPadding/);
});
test('both new helper classes enter compile, D8 mirror and pure model test sources',()=>{
  const build=read('build-native-v176.ps1'),tests=read('run-native-model-test-v169.ps1');
  for(const name of ['WidgetCompactCalendarV181','WidgetPreviewFrameV181']){assert.ok(build.includes(name+'.java'));assert.ok(tests.includes(name+'.java'));}
  assert.match(build,/CompactCalendarV181\|PreviewFrameV181/);
  assert.match(build,/\$taskMirrors176=@\(/);assert.match(build,/--min-api 26/);
});
test('compact picker fixtures use production rows without decorative headers',()=>{
  const {compactCalendarPreview}=require('./generate-picker-v169.cjs');
  const agenda=compactCalendarPreview('calendar_agenda'),fortnight=compactCalendarPreview('calendar_fortnight');
  assert.equal((agenda.match(/android:id="@\+id\/w181_time"/g)||[]).length,6);
  assert.equal((agenda.match(/android:id="@\+id\/w181_check"/g)||[]).length,6);
  assert.equal((fortnight.match(/android:id="@\+id\/w181_day"/g)||[]).length,14);
  assert.equal((fortnight.match(/android:id="@\+id\/w181_check"/g)||[]).length,6);
  assert.equal((fortnight.match(/android:id="@\+id\/w181_pair"/g)||[]).length,3);
  for(const xml of [agenda,fortnight]){
    assert.doesNotMatch(xml,/android:text="(?:오늘|이번 주|할 일|일정|‹|›|\+|08\.31)/);
    assert.match(xml,/android:padding="4dp"/);
    assert.equal((xml.match(/xmlns:android/g)||[]).length,1);
  }
  assert.match(agenda,/android:layout_height="26dp"/);
  assert.match(fortnight,/android:layout_weight="3"/);assert.match(fortnight,/android:layout_weight="2"/);
});
