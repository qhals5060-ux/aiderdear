'use strict';
// Idempotent mechanical migration of native RemoteViews resources. No user data.
const fs=require('node:fs'),path=require('node:path');
const res=path.resolve(process.argv[2]||path.join(__dirname,'res'));
function edit(folder,name,transform){const file=path.join(res,folder,name+'.xml'),before=fs.readFileSync(file,'utf8'),after=transform(before);if(after!==before)fs.writeFileSync(file,after);}
const replace=(s,pairs)=>pairs.reduce((v,[a,b])=>v.replaceAll(a,b),s);
for(const name of ['widget_design_v165','widget_design_v165_wide'])edit('layout',name,s=>replace(s,[
 ['android:padding="18dp"','android:padding="8dp"'],['android:layout_height="40dp"','android:layout_height="28dp"'],
 ['android:layout_marginBottom="10dp"','android:layout_marginBottom="2dp"'],['android:paddingBottom="12dp"','android:paddingBottom="0dp"'],
 ['android:layout_marginLeft="22dp"','android:layout_marginLeft="8dp"'],['android:layout_width="38dp"','android:layout_width="28dp"'],
 ['android:layout_width="32dp"','android:layout_width="24dp"'],['android:layout_height="32dp"','android:layout_height="24dp"'],['android:textSize="25sp"','android:textSize="20sp"']
]));
for(const name of ['widget_native_v164','widget_native_wide_v164','widget_native_fortnight_v178'])edit('layout',name,s=>replace(s,[
 ['android:padding="18dp"','android:padding="6dp"'],['android:layout_height="38dp"','android:layout_height="26dp"'],
 ['android:layout_width="40dp"','android:layout_width="28dp"'],['android:layout_width="32dp"','android:layout_width="24dp"'],
 ['android:layout_height="32dp"','android:layout_height="24dp"'],['android:textSize="25sp"','android:textSize="20sp"'],
 ['android:layout_marginBottom="10dp"','android:layout_marginBottom="3dp"'],['android:paddingBottom="12dp"','android:paddingBottom="0dp"'],
 ['android:paddingTop="5dp"','android:paddingTop="2dp"'],['android:layout_marginLeft="10dp"','android:layout_marginLeft="6dp"']
]));
// Content stays wrappable; reclaim empty insets instead of reducing text size.
for(const file of fs.readdirSync(path.join(res,'layout')).filter(n=>/^widget_(note|todo|routine|workout|challenge|workflow|quote|stats|book|day|meal_slot)_v165(_cell)?\.xml$/.test(n)))edit('layout',file.slice(0,-4),s=>replace(s,[
 ['android:paddingTop="11dp"','android:paddingTop="6dp"'],['android:paddingBottom="11dp"','android:paddingBottom="6dp"'],
 ['android:lineSpacingMultiplier="1.45"','android:lineSpacingMultiplier="1.2"'],['android:lineSpacingMultiplier="1.5"','android:lineSpacingMultiplier="1.25"'],
 ['android:minHeight="44dp"','android:minHeight="30dp"']
]));
for(const name of ['widget_todo_v165','widget_todo_v165_cell'])edit('layout',name,s=>replace(s,[['android:layout_width="24dp"','android:layout_width="18dp"'],['android:layout_height="24dp"','android:layout_height="18dp"'],['android:layout_marginRight="10dp"','android:layout_marginRight="8dp"']]));
edit('layout','widget_item_v164',s=>replace(s,[['android:paddingTop="11dp"','android:paddingTop="5dp"'],['android:paddingBottom="11dp"','android:paddingBottom="5dp"'],['android:layout_width="46dp"','android:layout_width="38dp"'],['android:layout_marginRight="10dp"','android:layout_marginRight="6dp"'],['android:layout_marginLeft="10dp"','android:layout_marginLeft="4dp"'],['android:lineSpacingMultiplier="1.5"','android:lineSpacingMultiplier="1.2"']]));
edit('layout','widget_day_v164',s=>replace(s,[['android:layout_margin="1dp"','android:layout_margin="0dp"'],['android:layout_width="28dp" android:layout_height="28dp"','android:layout_width="match_parent" android:layout_height="wrap_content"'],['android:minHeight="22dp"','android:minHeight="14dp"'],['android:includeFontPadding="true"','android:includeFontPadding="false"'],['android:lineSpacingMultiplier="1.3"','android:lineSpacingMultiplier="1.1"'],['android:layout_height="14dp" android:textColor="#6255E8"','android:layout_height="10dp" android:textColor="#6255E8"']]));
edit('layout','widget_weekrow_v164',s=>s.replace('android:layout_height="20dp"','android:layout_height="16dp"'));
for(const name of ['widget_day_bg_v164','widget_day_today_v164','widget_day_selected_v164','widget_day_selected_dark_v178','widget_day_dark_v164'])edit('drawable',name,s=>replace(s,[['android:radius="9dp"','android:radius="0dp"'],['android:width="1dp"','android:width="0.5dp"'],['android:color="#DED9FF"','android:color="#E8E3F3"']]));
edit('layout','widget_compact_event_v181',s=>replace(s,[['android:layout_width="10dp"','android:layout_width="8dp"'],['android:layout_width="34dp"','android:layout_width="36dp"'],['android:textSize="10.5sp"','android:textSize="11sp"'],['android:textSize="11.5sp"','android:textSize="12.5sp"']]));
edit('layout','widget_compact_todo_v181',s=>s.replaceAll('android:textSize="11.5sp"','android:textSize="12.5sp"'));
edit('layout','widget_compact_todo_cell_v181',s=>s.replaceAll('android:textSize="10.5sp"','android:textSize="11.5sp"'));
edit('layout','widget_compact_day_v181',s=>replace(s,[['android:textSize="10sp"','android:textSize="11.5sp"'],['android:textSize="8sp"','android:textSize="9sp"']]));
edit('layout','widget_compact_weekday_v181',s=>s.replaceAll('android:textSize="8sp"','android:textSize="9sp"'));
console.log('v183 native shell, rows and calendar resources compacted: '+res);
