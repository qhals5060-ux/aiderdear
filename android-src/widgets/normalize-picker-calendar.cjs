/* Build-time normalization: launcher preview cells obey runtime size thresholds. */
const fs = require('node:fs');
const path = require('node:path');
const root = process.argv[2];
if (!root) throw new Error('Usage: node normalize-picker-calendar.cjs <decoded-res>');
const sizes = { calendar_month:365, calendar_combined:365, calendar_split:365, calendar_fortnight:300 };
for (const [kind, height] of Object.entries(sizes)) {
  const file = path.join(root, 'layout', `widget_picker_${kind}_v164.xml`);
  let xml = fs.readFileSync(file, 'utf8');
  const rows = kind==='calendar_fortnight'?2:6;
  const full = kind==='calendar_month'||kind==='calendar_split';
  const cellHeight = ((height-62)*(full?1:.6)-20)/rows-6;
  let count=0;
  xml=xml.replace(/<LinearLayout\b(?=[^>]*android:background="@drawable\/widget_day_bg_v164")[^>]*>[\s\S]*?<\/LinearLayout>/g, cell => {
    count++;
    cell=cell.replace('android:layout_width="22dp"', 'android:layout_width="match_parent"');
    if(cellHeight<38)cell=cell.replace(/<TextView\b(?=[^>]*android:text="●")[^>]*\/>/g,'');
    if(cellHeight<28)cell=cell.replace(/<TextView\b(?=[^>]*android:text="추석")[^>]*\/>/g,'');
    return cell;
  });
  if(count!==rows*7)throw new Error(`${kind}: expected ${rows*7} cells, got ${count}`);
  fs.writeFileSync(file,xml);
  console.log(`${kind}: ${count} native cells, ${cellHeight.toFixed(1)}dp content/cell`);
}
