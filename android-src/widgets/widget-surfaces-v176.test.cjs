'use strict';
// Actual resources and production Java/Settings path; not a launcher/device test.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const explicitRes=process.argv.slice(2).find(value=>fs.existsSync(value)&&fs.statSync(value).isDirectory());
const res=path.resolve(explicitRes||path.join(__dirname,'res'));
const read=(folder,name)=>fs.readFileSync(path.join(res,folder,name+'.xml'),'utf8');
const java=fs.readFileSync(path.join(__dirname,'WidgetDesignV165.java'),'utf8');
const native=fs.readFileSync(path.join(__dirname,'WidgetNativeV164.java'),'utf8');
const color=name=>read('drawable',name).match(/<solid android:color="([^"]+)"/)?.[1];

test('installed default base, notes/stat panels and bordered cards are distinct surfaces',()=>{
  assert.equal(color('widget_bg_aurora'),'#FCFBFF');
  assert.equal(color('widget_panel_v176'),'#EFECFA');
  assert.equal(color('widget_framed_v176'),'#FFFFFF');
  assert.equal(color('widget_card_v165'),'#00000000');
  for(const name of ['widget_bg_aurora','widget_framed_v176','widget_bullet_card_v168'])assert.match(read('drawable',name),/stroke android:width="1dp" android:color="#DDD7F0"/);
  assert.match(java,/drawable\(c,surface\(type,r\.optBoolean\("detail"\),dark\(c,chosen\)\)\)/,'production component binding must select semantic surfaces');
});

test('all portrait and Fold/cell component layouts use their production semantic surface',()=>{
  for(const suffix of ['','_cell']){
    for(const name of ['note','stats','workout','quote'])assert.match(read('layout','widget_'+name+'_v165'+suffix),/w165_card_background[^>]+src="@drawable\/widget_panel_v176"/);
    for(const name of ['routine','challenge','workflow'])assert.match(read('layout','widget_'+name+'_v165'+suffix),/w165_card_background[^>]+src="@drawable\/widget_framed_v176"/);
    assert.match(read('layout','widget_trend_v169'+suffix),/src="@drawable\/widget_framed_v176"/);
    assert.match(read('layout','widget_book_detail_v168'+suffix),/src="@drawable\/widget_panel_v176"/);
    for(const name of ['todo','language','book'])assert.match(read('layout','widget_'+name+'_v165'+suffix),/src="@drawable\/widget_card_v165"/);
  }
});

test('selected dates and done checks are white on primary violet, not dark on pale violet',()=>{
  for(const name of ['widget_day_selected_v164','widget_check_done_v165']){
    assert.equal(color(name),'#6255E8');assert.match(read('drawable',name),/android:shape="oval"/);
  }
  assert.match(native,/widget_day_number_v164",chosen\?0xffffffff:foreground/);
  assert.match(java,/"w165_check",done\?0xffffffff:fg/);
  assert.match(java,/"setPaintFlags",done\?17:1/);
  assert.match(native,/color\(c,v,"widget_add",PRIMARY\)/);
  assert.match(read('layout','widget_day_v164'),/widget_day_number_v164"[^>]+layout_width="28dp"[^>]+layout_height="28dp"/);
});

test('progress, star graph and statistic emphasis remain primary violet with a lighter track',()=>{
  assert.equal(color('widget_panel_v176'),'#EFECFA');
  assert.match(read('drawable','widget_progress_v165'),/#E7E2F7[\s\S]+#6255E8/);
  assert.match(java,/p\.setColor\(PRIMARY\)/);
  assert.match(java,/type\.equals\("routineStats"\)\|\|type\.equals\("workoutStats"\)\)color\(c,v,"w165_meta",accent\)/);
});

test('longpress settings still preview the actual renderer and alpha applies to each background',()=>{
  assert.match(native,/RemoteViews remote=render\(activity,wf\.getInt\(activity\),type\(\(String\)kf\.get\(activity\)\),true,/);
  assert.match(native,/remote\.apply\(activity,host\)/);
  assert.match(native,/getString\("widget_theme_"\+widget,"aurora"\)/);
  assert.match(java,/String chosen=overrideTheme==null\?theme\(c,w\):overrideTheme/);
  assert.match(java,/Integer po=previewOpacity\.get\(\);int opacity=po==null\?prefs\(c\)\.getInt\("widget_opacity_"\+w,100\):po/);
  assert.match(java,/"w165_card_background"\),"setImageAlpha",Math\.round\(255\*Math\.max\(0,Math\.min\(100,opacity\)\)\/100f\)/);
  assert.match(java,/WidgetSizeV169\.sp\(c,w,selectedFont,titleSize\)/);
  assert.match(java,/night\?"widget_panel_dark_v176":"widget_panel_v176"/);
});

test('plain row separators survive, while bordered cards do not double their edges',()=>{
  for(const name of ['todo','language'])assert.doesNotMatch(read('layout','widget_'+name+'_v165').match(/<ImageView[^>]+w169_row_divider[^>]*>/)?.[0]||'',/visibility="gone"/);
  for(const name of ['note','routine','challenge','workflow'])assert.match(read('layout','widget_'+name+'_v165'),/w169_row_divider[^>]+visibility="gone"/);
});

test('all 30 launcher XML previews resolve to current PNGs with the same near-white base',async()=>{
  const sharp=require('C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
  const names=new Set();
  for(const file of fs.readdirSync(path.join(res,'xml')).filter(n=>n.startsWith('widget_')&&n.endsWith('.xml'))){
    const provider=fs.readFileSync(path.join(res,'xml',file),'utf8');
    const name=provider.match(/android:previewImage="@drawable\/(widget_picker_[^"]+)"/)?.[1];
    if(!name)continue;names.add(name);
    assert.match(provider,new RegExp('android:previewLayout="@layout/'+name+'"'));
    assert.ok(read('layout',name).includes('widget_bg_aurora'),'picker uses the current native outer drawable');
    const png=path.join(res,'drawable-nodpi',name+'.png'),meta=await sharp(png).metadata();
    assert.equal(meta.format,'png');assert.ok(meta.width>=80&&meta.width<=672);
    const bytes=await sharp(png).extract({left:5,top:40,width:1,height:1}).removeAlpha().raw().toBuffer();
    assert.deepEqual([...bytes],[252,251,255],name+' still has an old flat-violet bitmap');
  }
  assert.equal(names.size,30);
});

test('offline fallback artwork interprets actual drawable XML rather than guessing by name',()=>{
  const renderer=fs.readFileSync(path.join(__dirname,'render-picker-xml-v176.cjs'),'utf8');
  assert.match(renderer,/const source=bundle\.drawables\[key\]/);
  assert.match(renderer,/find\(el,'solid'\),stroke=find\(el,'stroke'\),corners=find\(el,'corners'\)/);
  assert.match(renderer,/color\(get\(solid,'color'\)\)/);
  assert.doesNotMatch(renderer,/includes\('(?:panel|selected|day_)'\)/);
});
