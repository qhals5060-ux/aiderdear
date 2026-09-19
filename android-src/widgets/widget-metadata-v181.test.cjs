'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8'),manifest=fs.readFileSync(path.resolve(__dirname,'../AndroidManifest.xml'),'utf8'),attr=(xml,name)=>xml.match(new RegExp('android:'+name+'="([^"]+)"'))?.[1];
const definitions={combined:[3,180,'split'],agenda:[4,250,'agenda'],fortnight:[3,180,'month'],month:[5,320,'month'],split:[6,390,'month']};
for(const[kind,[span,height,layout]]of Object.entries(definitions))test(kind+' retains provider identity with approved resizable composition',()=>{
 const xml=read('res/xml/widget_calendar_'+kind+'.xml');assert.equal(attr(xml,'targetCellWidth'),'4');assert.equal(attr(xml,'targetCellHeight'),String(span));assert.equal(attr(xml,'minHeight'),height+'dp');
 assert.equal(attr(xml,'resizeMode'),'horizontal|vertical');assert.equal(attr(xml,'configure'),'com.aiderlog.v22app.WidgetConfigActivity');assert.equal(attr(xml,'previewImage'),'@drawable/widget_picker_calendar_'+kind+'_v164');
 assert.equal(attr(xml,'previewLayout'),'@layout/widget_picker_calendar_'+kind+'_v164');assert.equal(attr(xml,'initialLayout'),'@layout/widget_'+layout+'_compact_v184');assert.ok(manifest.includes('.WidgetProvider$Calendar'+kind[0].toUpperCase()+kind.slice(1)));
 if(process.env.AIDERLOG_DECODED_STAGE)assert.equal(xml,fs.readFileSync(path.join(process.env.AIDERLOG_DECODED_STAGE,'res/xml/widget_calendar_'+kind+'.xml'),'utf8'));
});
test('picker fixtures use real production XML with 14 or 35 real date cells',()=>{
 const {compactCalendarPreview}=require('./generate-picker-v169.cjs');for(const[kind]of Object.entries(definitions)){
  const xml=compactCalendarPreview('calendar_'+kind);assert.equal((xml.match(/xmlns:android/g)||[]).length,1);assert.match(xml,/예시 데이터/);assert.match(xml,/android:padding="6dp"/);
  if(kind!=='agenda')assert.equal((xml.match(/android:id="@\+id\/w184_day"/g)||[]).length,kind==='fortnight'?14:35);
  if(kind==='split'||kind==='agenda')assert.match(xml,/w184_check/);
 }assert.match(read('generate-picker-v169.cjs'),/Do not replace runtime initialLayout with sample data/);
});
test('settings follows each ratio, restores dimensions and compiles at min26',()=>{
 const helper=read('WidgetPreviewFrameV181.java');assert.match(helper,/innerWidth\*WidgetCompactCalendarV181.ratio\(kind\)/);assert.match(helper,/WidgetSizeV169\.active\.set\(prior\)/);assert.doesNotMatch(helper,/updateAppWidget|SharedPreferences|putInt|setPadding/);
 const build=read('build-native-v176.ps1');assert.match(build,/--min-api 26/);assert.match(build,/CanonicalDecodedPath/);for(const n of ['WidgetCompactCalendarV181','WidgetPreviewFrameV181'])assert.ok(build.includes(n+'.java'));
});
