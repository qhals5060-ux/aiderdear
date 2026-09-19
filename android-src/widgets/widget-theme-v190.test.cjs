const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const themes=require('./themes-v190.cjs'),read=name=>fs.readFileSync(path.join(__dirname,name),'utf8');
test('native palette values exactly follow the app five-theme contract',()=>{
 const css=read('../assets/app-design-v188.css'),java=read('WidgetThemeV190.java');
 assert.deepEqual(Object.keys(themes),['system','sage','rose','slate','charcoal']);
 for(const [key,t]of Object.entries(themes)){
  const block=css.match(new RegExp(':root\\[data-app-palette="'+key+'"\\]\\{([^}]+)'))?.[1];assert.ok(block,key);
  for(const [part,variable]of Object.entries({accent:'accent',surface:'surface',control:'surface2',line:'line',ink:'ink',muted:'muted'})){assert.ok(block.toLowerCase().includes('--'+variable+':'+t[part].toLowerCase()+'!important'),key+' '+part);assert.ok(java.toLowerCase().includes('0xff'+t[part].slice(1).toLowerCase()));}
 }
});
test('actual settings entry and legacy chooser both use five-theme helper; Save and Cancel remain separate',()=>{
 const smali=read('smali/WidgetConfigActivity.smali'),helper=read('WidgetThemeV190.java');
 assert.match(smali,/showThemeDialog\(\)V[\s\S]*?WidgetThemeV190;->showDialog/);
 assert.match(smali,/chooseTheme\(I\)V[\s\S]*?WidgetThemeV190;->choose/);
 assert.doesNotMatch(smali,/오로라 퍼플|천왕성 민트|명왕성 이클립스|\\uc624\\ub85c\\ub77c/);
 assert.match(helper,/setSingleChoiceItems\(labels,checked/);assert.match(helper,/selected\(activity\)\.set\(activity,key\(choice\)\)/);
 assert.doesNotMatch(helper,/\.edit\(|putString\(|Firebase|snapshot\(/);
 assert.match(smali,/finishWidgetInternalV143[\s\S]*?widget_theme_[\s\S]*?putString[\s\S]*?SharedPreferences\$Editor;->apply/);
 assert.match(read('smali/WidgetConfigActivity$14.smali'),/finish\(\)V/);
 assert.match(read('smali/WidgetConfigActivity$15.smali'),/finishWidget\(\)V/);
 assert.match(read('WidgetNativeV164.java'),/WidgetThemeV190\.refresh\(activity\)/);
});
test('real native paths apply canonical background, controls and readable text rather than only a picker recolor',()=>{
 const native=read('WidgetNativeV164.java'),calendar=read('WidgetCompactCalendarV181.java'),approved=read('WidgetApprovedV188.java');
 assert.match(native,/WidgetThemeV190\.normalize\(prefs\(c\)\.getString\("widget_theme_"/);
 assert.match(native,/WidgetThemeV190\.resource\(selectedTheme,"surface"\)/);
 assert.match(native,/static int ink[^\n]+WidgetThemeV190\.color\(theme,4\)/);
 assert.match(calendar,/WidgetThemeV190\.resource\(chosen,"grid"\)/);assert.match(calendar,/WidgetThemeV190\.resource\(chosen,"today"\)/);
 assert.match(approved,/WidgetThemeV190\.rowView/);assert.match(approved,/WidgetThemeV190\.rowStyle/);
 assert.match(approved,/static int accent[^\n]+WidgetThemeV190\.accent/);
});
test('progress and row palette resources are available on minAPI26 without remote tint reflection',()=>{
 const templates=['widget_v188_book','widget_v188_challenge','widget_v188_routine_detail','widget_v189_routine_summary'];
 for(const [key,t]of Object.entries(themes)){
  for(const part of ['surface','control','outline','selected','button','grid','today','progress'])assert.ok(fs.existsSync(path.join(__dirname,'res/drawable/widget_theme_'+key+'_'+part+'_v190.xml')));
  const progress=read('res/drawable/widget_theme_'+key+'_progress_v190.xml');assert.ok(progress.includes(t.accent));assert.ok(progress.includes(t.control));
  for(const template of templates){const source=read('res/layout/'+template+'_'+key+'_v190.xml');assert.ok(source.includes('widget_theme_'+key+'_progress_v190'));assert.ok(source.includes('@+id/w188_progress'));}
 }
 assert.doesNotMatch(read('WidgetThemeV190.java'),/setColorStateList|SDK_INT|setProgressTintList/);
});
test('theme variants remain a bounded generated inventory and source compaction keeps settings readable',()=>{
 const variants=fs.readdirSync(path.join(__dirname,'res/layout')).filter(f=>/^widget_v18[89]_.*_v190\.xml$/.test(f));assert.equal(variants.length,20);
 const generator=read('generate-themes-v190.cjs');assert.ok(generator.includes("!f.endsWith('_v190.xml')"));
 const config=read('res/layout/activity_widget_config_v157.xml');assert.doesNotMatch(config,/홈 화면에서 표시할 내용과 모양|layout_height="66dp"/);assert.match(config,/색상 테마   Lavender/);
});
