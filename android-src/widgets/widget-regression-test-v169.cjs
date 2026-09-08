/* Native source/resource regression gate. No Android inflation or device claim.
 * node android-src/widgets/widget-regression-test-v169.cjs [decoded/res]
 */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const source=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
const res=path.resolve(process.argv[2]||path.join(__dirname,'../../../AiderLog-v145-decoded/res'));
const xml=name=>fs.readFileSync(path.join(res,'layout',name+'.xml'),'utf8');
const size=source('WidgetSizeV169.java'),native=source('WidgetNativeV164.java'),design=source('WidgetDesignV165.java'),provider=source('WidgetProvider.java'),rows=source('WidgetRowsV164.java');
test('Android 12 exact dp host variants are bounded, injected per render, and cleared',()=>{
  assert.match(size,/SDK_INT>=31/);assert.match(size,/getParcelableArrayList\("appWidgetSizes"\)/);
  assert.match(size,/Map<SizeF,RemoteViews> variants=new LinkedHashMap/);
  assert.match(size,/size\.getWidth\(\)<48\|\|size\.getHeight\(\)<48/);
  assert.match(size,/active\.set\(size\);variants\.put\(size,WidgetNativeV164\.render/);
  assert.match(size,/if\(variants\.size\(\)==16\)break/);
  assert.match(size,/getConstructor\(Map\.class\)\.newInstance\(variants\)/);
  assert.match(size,/finally\{active\.remove\(\);\}/);
});
test('fallback portrait uses min width/max height; landscape uses max width/min height',()=>{
  assert.match(size,/orientation==Configuration\.ORIENTATION_LANDSCAPE/);
  assert.match(size,/landscape\?"appWidgetMaxWidth":"appWidgetMinWidth"/);
  assert.match(size,/landscape\?"appWidgetMinHeight":"appWidgetMaxHeight"/);
  assert.match(size,/"appWidgetMaxHeight",b\.getInt\("appWidgetMinHeight",320\)/);
  assert.match(size,/return WidgetNativeV164\.render\(c,widget,kind,false,null,-1,-1\);/);
});
test('collection factory identity includes dimensions and scopes active size for every row',()=>{
  assert.match(native,/putExtra\("widthDp",bounds\.getWidth\(\)\)/);assert.match(native,/putExtra\("heightDp",bounds\.getHeight\(\)\)/);
  assert.match(native,/aiderlog-widget-rows:[^\n]+bounds\.getWidth\(\)[^\n]+bounds\.getHeight\(\)/);
  assert.match(rows,/getFloatExtra\("widthDp",336\)/);assert.match(rows,/getFloatExtra\("heightDp",320\)/);
  for(const method of ['onDataSetChanged','getViewAt'])assert.match(rows,new RegExp(method+'\\([^)]*\\)\\{WidgetSizeV169\\.active\\.set\\(bounds\\);try\\{[^\\n]+finally\\{WidgetSizeV169\\.active\\.remove\\(\\);\\}'));
});
test('five font steps preserve individual title/body/stat roles, not one giant font everywhere',()=>{
  assert.match(size,/return role\+\(Math\.max\(1,Math\.min\(5,level\)\)-3\)\*\.8f/);
  assert.match(design,/WidgetSizeV169\.sp\(c,w,selectedFont,titleSize\)/);
  assert.match(design,/WidgetSizeV169\.sp\(c,w,selectedFont,type\.equals\("day"\)\?12:13\)/);
  assert.match(design,/type\.equals\("routineStats"\)\|\|type\.equals\("workoutStats"\)\?22:12/);
  assert.match(design,/WidgetSizeV169\.current\(c,w\)\.getWidth\(\)>=Math\.round\(\(560\+Math\.max\(0,font-3\)\*40\)\*scale\)/);
});
test('routine chips keep separate 34dp surfaces and 48dp row without gigantic empty padding',()=>{
  for(const suffix of ['','_cell']){
    const x=xml('widget_routine_v165'+suffix);
    assert.match(x,/w165_levels[^>]+layout_height="48dp"/);
    for(let i=0;i<4;i++)assert.match(x,new RegExp('w165_level_'+i+'"[^>]+layout_height="34dp"[^>]+layout_marginTop="7dp"[^>]+layout_marginBottom="7dp"'));
    assert.match(x,/paddingTop="11dp" android:paddingBottom="11dp"/);
  }
});
test('card spacing/scrolling stays compact and content is not clipped to a single text line',()=>{
  for(const kind of ['note','todo','routine','language','challenge','book']){
    const x=xml('widget_'+kind+'_v165');
    assert.match(x,/layout_height="wrap_content" android:layout_margin="2dp"/);
    assert.match(x,/paddingTop="11dp" android:paddingBottom="11dp"/);
  }
  for(const name of ['widget_design_v165','widget_design_v165_wide','widget_native_v164','widget_native_wide_v164'])assert.match(xml(name),/paddingBottom="12dp" android:clipToPadding="false"/);
});
test('dark widgets theme agenda time but keep dark ink on pale chips/date/add surfaces',()=>{
  assert.match(native,/color\(c,row,"widget_item_time_v165",ink\(c,rowTheme\)\)/);
  assert.match(native,/color\(c,cell,"widget_day_number_v164",chosen\?INK:foreground\)/);
  assert.match(native,/color\(c,v,"widget_add",INK\)/);
  assert.match(design,/color\(c,v,"w165_level_"\+i,INK\)/);
  assert.match(native,/"setImageAlpha"/);assert.doesNotMatch(native,/"setAlpha"/);
});
test('source foreground/surface contrast exceeds 4.5:1 for corrected native controls',()=>{
  const luminance=hex=>hex.match(/../g).map(s=>parseInt(s,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
  assert(contrast('171a3a','ded9ff')>4.5);assert(contrast('f7f6ff','202035')>4.5);
});
test('one provider update path enumerates actual own-package installed IDs, including restored IDs',()=>{
  assert.match(provider,/manager\.getInstalledProviders\(\)/);
  assert.match(provider,/c\.getPackageName\(\)\.equals\(info\.provider\.getPackageName\(\)\)/);
  assert.match(provider,/getClassName\(\)\.contains\("WidgetProvider\$"\)/);
  assert.match(provider,/for\(int widget:manager\.getAppWidgetIds\(info\.provider\)\)safeUpdateWidget/);
  assert.match(provider,/onAppWidgetOptionsChanged/);assert.match(provider,/onRestored/);
  assert.match(provider,/edit\.apply\(\);onUpdate\(c,AppWidgetManager\.getInstance\(c\),newIds\)/);
  assert.doesNotMatch(provider,/Class\[\]|0x7f[0-9a-f]{6}|new int\[32\]/);
});
test('all retained manifest provider subclasses still extend the single compiled dispatcher',()=>{
  const manifest=fs.readFileSync(path.join(res,'../AndroidManifest.xml'),'utf8');
  const names=[...manifest.matchAll(/android:name="(?:com\.aiderlog\.v22app)?\.WidgetProvider\$([^"]+)"/g)].map(m=>m[1]);
  assert(names.length>=30,`expected retained variants, found ${names.length}`);
  for(const name of names){const f=path.join(res,'../smali/com/aiderlog/v22app/WidgetProvider$'+name+'.smali');assert.match(fs.readFileSync(f,'utf8'),/\.super Lcom\/aiderlog\/v22app\/WidgetProvider;/,name)}
});
test('recovery is explicit and never records the legacy generic placeholder as success',()=>{
  assert.match(native,/manager\.updateAppWidget\(widget,v\);\s*prefs\(c\)\.edit\(\)\.remove\("widget_render_error_"\+widget\)/);
  assert.match(native,/위젯 다시 연결/);assert.match(native,/manager\.updateAppWidget\(widget,recovery\);return false/);
  assert.match(provider,/if\(WidgetNativeV164\.update\(c,manager,widget,name\)\)\s*WidgetNativeV164\.prefs/);
  assert.match(provider,/putInt\("widget_renderer_"\+widget,169\)/);
});
test('collection fill-in pending intents remain mutable only where required',()=>{
  assert.match(native,/setPendingIntentTemplate[^\n]+SDK_INT>=31\?0x0a000000:0x08000000/);
  assert.match(native,/getActivity\(c,widget\*31\+action\.hashCode\(\),i,0x0c000000\)/);
});
