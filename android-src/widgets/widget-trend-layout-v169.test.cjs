'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const dir=__dirname;

function generatedLayouts(){
  const output=new Map(),samples={
    'widget_note_v165.xml':'<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"><LinearLayout android:padding="12dp"/></FrameLayout>',
    'widget_design_v165.xml':'<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"><ListView android:id="@id/widget_items_v164" android:dividerHeight="1dp"/><ListView android:id="@id/w165_secondary_list" android:dividerHeight="1dp"/></LinearLayout>'
  };
  const fakeFs={readdirSync:()=>Object.keys(samples),readFileSync:p=>samples[path.basename(p)],writeFileSync:(p,value)=>output.set(path.basename(p),value)};
  vm.runInNewContext(fs.readFileSync(path.join(dir,'generate-components-v169.cjs'),'utf8'),{
    require:name=>name==='node:fs'?fakeFs:name==='node:path'?path:undefined,
    process:{argv:['node','components','/mock-res']},__dirname:dir,console:{log(){}}
  });
  return output;
}

test('trend native layout keeps binding ids and compact left-value/right-graph structure',()=>{
  const output=generatedLayouts();
  for(const name of ['widget_trend_v169.xml','widget_trend_v169_cell.xml']){
    const xml=output.get(name);assert.ok(xml,name);
    for(const id of ['card','card_background','title','meta','body','graph','foot'])assert.match(xml,new RegExp('@\\+id/w165_'+id+'"'));
    assert.match(xml,/android:orientation="horizontal" android:gravity="center_vertical"/);
    assert.match(xml,/w165_graph" android:layout_width="108dp" android:layout_height="34dp"/);
    assert.match(xml,/w165_body"[^>]*android:visibility="gone"/);
    assert.ok(xml.indexOf('w165_graph')<xml.indexOf('w165_foot'),'period remains below the compact graph row');
    assert.doesNotMatch(xml,/120dp|22sp/,'does not inherit oversized summary chart/value styles');
  }
});

test('simple row separator is 1dp and native list does not draw it twice',()=>{
  const output=generatedLayouts();
  for(const name of ['widget_note_v165.xml','widget_trend_v169.xml']){
    const xml=output.get(name);
    assert.match(xml,/w169_row_divider"[^>]*android:layout_height="1dp"[^>]*android:layout_gravity="bottom"/);
    assert.equal((xml.match(/w169_row_divider/g)||[]).length,1);
  }
  assert.match(output.get('widget_row_separator_v169.xml'),/android:color="#DED9FF"/);
  assert.equal((output.get('widget_design_v165.xml').match(/android:dividerHeight="0dp"/g)||[]).length,2);
  assert.doesNotMatch(output.get('widget_trend_surface_dark_v169.xml'),/corners|stroke/);
});

test('production renderer routes only trend rows to v169 and retains opacity handling',()=>{
  const java=fs.readFileSync(path.join(dir,'WidgetDesignV165.java'),'utf8');
  assert.match(java,/String template=type\.equals\("routineStats"\)\|\|type\.equals\("workoutStats"\)\?"stats"/);
  assert.match(java,/type\.equals\("trend"\)\?"widget_trend_v169"/);
  assert.match(java,/"w169_row_divider"\),"setImageAlpha"/);
  assert.match(java,/type\.equals\("todo"\)\|\|type\.equals\("trend"\)\?14/);
});

test('picker constructors use native trend rows for inbody/exercise but not other stats',()=>{
  const picker=fs.readFileSync(path.join(dir,'generate-picker-v169.cjs'),'utf8');
  const code=picker.slice(picker.indexOf('function legacyFixtureConstructors()'),picker.indexOf('// Only graphs'));
  const legacy=fs.readFileSync(path.join(dir,'generate-picker-v165.cjs'),'utf8');
  const mockFs={readFileSync:p=>p.endsWith('generate-picker-v165.cjs')?legacy:`<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" android:tag="${path.basename(p)}"><TextView android:id="@id/w165_title"/><TextView android:id="@id/w165_meta"/><ImageView android:id="@id/w165_graph"/></FrameLayout>`};
  const mockRequire=name=>name==='node:fs'?mockFs:name==='node:path'?path:undefined;
  const context={fs:mockFs,path,vm,__dirname:dir,res:'/mock-res',require:mockRequire,module:{exports:{}},graphSvg:function graphSvg(){return '<svg/>';}};
  vm.runInNewContext(code+'\nmodule.exports=legacyFixtureConstructors();',context);
  const fixture=context.module.exports;
  for(const xml of fixture.inbody)assert.match(xml,/android:tag="widget_trend_v169.xml"/);
  assert.match(fixture.configs.personal_workout_stats.rows[1],/android:tag="widget_trend_v169.xml"/);
  assert.match(fixture.configs.personal_workout_stats.rows[0],/android:tag="widget_stats_v165.xml"/);
  assert.match(fixture.statistics,/android:tag="widget_stats_v165.xml"/);
});
