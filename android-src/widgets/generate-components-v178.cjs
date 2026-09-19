/* v178: compact, framed calendar cells and complete readable collection rows. */
'use strict';
const fs=require('node:fs'),path=require('node:path');
require('./generate-components-v176.cjs');
const res=path.resolve(process.argv[2]||path.join(__dirname,'res'));
const ns='xmlns:android="http://schemas.android.com/apk/res/android"';
const read=n=>fs.readFileSync(path.join(res,'layout',n+'.xml'),'utf8');
const write=(dir,n,s)=>fs.writeFileSync(path.join(res,dir,n+'.xml'),s);
const shape=(fill,line)=>`<?xml version="1.0" encoding="utf-8"?><shape ${ns}><solid android:color="${fill}"/><corners android:radius="9dp"/><stroke android:width="1dp" android:color="${line}"/></shape>\n`;
write('drawable','widget_day_bg_v164',shape('#00000000','#DED9FF'));
write('drawable','widget_day_today_v164',shape('#00000000','#A79BE9'));
write('drawable','widget_day_selected_v164',shape('#DED9FF','#6255E8'));
write('drawable','widget_day_selected_dark_v178',shape('#423761','#BCAFED'));
// Two calendar rows stay content-sized; additional height belongs to the native agenda.
let compact=read('widget_native_v164').replace('android:id="@+id/widget_calendar_v164" android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1.5"','android:id="@+id/widget_calendar_v164" android:layout_width="match_parent" android:layout_height="wrap_content"');
write('layout','widget_native_fortnight_v178',compact);
write('layout','widget_week_compact_v178',read('widget_week_v164').replace('android:layout_height="0dp" android:layout_weight="1"','android:layout_height="wrap_content"').replace('android:orientation="horizontal"','android:orientation="horizontal" android:baselineAligned="false"'));
let day=read('widget_day_v164').replace('android:layout_height="match_parent" android:layout_margin="1dp"','android:layout_height="match_parent" android:minHeight="52dp" android:layout_margin="1dp"');
day=day.replace('<LinearLayout android:layout_width="match_parent" android:layout_height="match_parent"','<LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content"');
write('layout','widget_day_compact_v178',day);
for(const suffix of ['','_cell']){
  let workout=read('widget_workout_v165'+suffix).replace('android:lineSpacingExtra="6dp" android:lineSpacingMultiplier="1.5"','android:lineSpacingExtra="2dp" android:lineSpacingMultiplier="1.45"');
  write('layout','widget_workout_v165'+suffix,workout);
  let memo=read('widget_note_v165'+suffix).replace('android:layout_marginTop="7dp"','android:layout_marginTop="4dp"');
  write('layout','widget_note_v165'+suffix,memo);
}
console.log('v178 native widget detail layouts generated; no record-count limits changed.');
