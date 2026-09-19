'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
test('language receivers, templates, source projections and native routes are retired',()=>{
  assert.doesNotMatch(read('../AndroidManifest.xml'),/WidgetProvider\$(?:RoutineLanguage|LanguageYoutube)/);
  for(const dir of ['res/xml','res/layout','res/drawable-nodpi','smali'])assert.deepEqual(fs.readdirSync(path.join(__dirname,dir)).filter(n=>/language|youtube/i.test(n)),[]);
  for(const file of ['WidgetNativeV164.java','WidgetDesignV165.java','widget-sync-v164.js','../../widget-sync-v162.js'])assert.doesNotMatch(read(file),/RoutineLanguage|LanguageYoutube|languageStudy|loadWidgetCourses|openLanguage|youtubeNotes/);
});
test('fortnight calendar has visible equal-width framed cells without a 60-percent blank reserve',()=>{
  assert.match(read('WidgetNativeV164.java'),/CalendarFortnight"\.equals\(kind\)\?"widget_native_fortnight_v178"/);
  assert.match(read('res/layout/widget_native_fortnight_v178.xml'),/widget_calendar_v164"[^>]+layout_height="wrap_content"[^>]+orientation="vertical"/);
  const day=read('res/layout/widget_day_compact_v178.xml');
  assert.match(day,/layout_width="0dp" android:layout_weight="1" android:layout_height="match_parent" android:minHeight="52dp"/);
  assert.match(read('res/drawable/widget_day_bg_v164.xml'),/stroke android:width="1dp" android:color="#DED9FF"/);
  assert.match(read('res/drawable/widget_day_selected_v164.xml'),/solid android:color="#DED9FF"/);
  assert.match(read('WidgetNativeV164.java'),/"widget_day_number_v164",foreground/);
});
test('workout sets are compact summaries and collection rows remain unlimited and wrappable',()=>{
  assert.match(read('WidgetDesignV165.java'),/workoutSummary\(r\)/);
  assert.match(read('WidgetDesignV165.java'),/groups\.get\(dose\)\+"세트 × "/);
  assert.match(read('res/layout/widget_workout_v165.xml'),/w165_body"[^>]+layout_height="wrap_content"/);
  assert.doesNotMatch(read('res/layout/widget_workout_v165.xml'),/maxLines|ellipsize/);
  assert.match(read('WidgetRowsV164.java'),/getCount\(\)/);
});
test('memo picker shows two complete records and media fixture is native XML, not shipped demo records',()=>{
  const xml=read('res/layout/widget_picker_personal_workflow_one_v164.xml');
  assert.match(xml,/회의에서 확인할 내용/);assert.match(xml,/연구 아이디어/);
  assert.match(read('generate-picker-v169.cjs'),/personal_workflow_one:\[2,304\]/);
  assert.doesNotMatch(read('widget-sync-v164.js'),/회의에서 확인할 내용|연구 아이디어|30kg/);
});
