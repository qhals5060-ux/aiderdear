/* Static RemoteViews contract checks, NOT Android inflation/device verification.
 * Run after generate-components-v165.cjs with the decoded res directory, e.g.
 * node android-src/widgets/widget-native-contract-test-v165.cjs ../AiderLog-v145-decoded/res
 * Method audit sources (each reflective method is @RemotableViewMethod):
 * https://android.googlesource.com/platform/frameworks/base/+/jb-release/core/java/android/widget/TextView.java
 * https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/widget/ImageView.java
 * https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/view/View.java
 */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const res=path.resolve(process.argv[2]||path.join(__dirname,'../../../AiderLog-v145-decoded/res'));
const java=fs.readFileSync(path.join(__dirname,'WidgetDesignV165.java'),'utf8');
const native=fs.readFileSync(path.join(__dirname,'WidgetNativeV164.java'),'utf8');
const service=fs.readFileSync(path.join(__dirname,'WidgetRowsV164.java'),'utf8');
const parse=name=>{
  const file=path.join(res,'layout',name+'.xml'),xml=fs.readFileSync(file,'utf8'),ids=new Map(),tags=[];
  for(const match of xml.matchAll(/<([A-Za-z][\w.]*)\b([^<>]*)>/g)){
    const [,tag,attrs]=match;tags.push(tag);const id=attrs.match(/android:id="@\+?id\/([^"]+)"/);
    if(id){assert(!ids.has(id[1]),`${name} duplicate ID ${id[1]}`);ids.set(id[1],{tag,attrs});}
  }
  return {name,xml,ids,tags};
};
const common={w165_card:'FrameLayout',w165_card_background:'ImageView',w165_title:'TextView'};
const body={w165_body:'TextView'},meta={w165_meta:'TextView'},progress={w165_progress:'ProgressBar'},graph={w165_graph:'ImageView'};
const branches={
  note:{...common,...body,...meta},
  todo:{...common,...meta,w165_check:'TextView'},
  routine:{...common,...body,...meta,...progress,...graph,...Object.fromEntries(Array.from({length:4},(_,i)=>['w165_level_'+i,'TextView']))},
  language:{...common,...body,...meta,...graph,w165_action:'TextView'},
  stats:{...common,...body,...meta,...graph,w165_foot:'TextView'},
  challenge:{...common,...body,...meta,...progress,...graph},
  workout:{...common,...body},
  book:{...common,...body,...meta,...progress,w165_cover:'ImageView'},
  quote:{...common,...body,...meta},
  workflow:{...common,...body,...meta,...progress},
  day:{...common,...body},
  meal_slot:{w165_card:'LinearLayout',w165_photo:'ImageView',w165_time:'TextView',w165_rating:'TextView'},
};
const componentLayouts=Object.keys(branches).flatMap(type=>['','_cell'].map(suffix=>parse(`widget_${type}_v165${suffix}`)));
const outerKeys={widget_root:'FrameLayout',widget_background:'ImageView',w165_header:'LinearLayout',widget_title:'TextView',widget_subtitle:'TextView',widget_previous:'TextView',widget_next:'TextView',widget_add:'TextView',widget_empty:'TextView',widget_items_v164:'ListView',widget_preview_rows_v164:'LinearLayout',w165_secondary:'FrameLayout',w165_secondary_list:'ListView',w165_secondary_preview:'LinearLayout'};
const outerLayouts=['widget_design_v165','widget_design_v165_wide'].map(parse);

test('all 24 regular/cell layouts have exact conditional-branch target IDs and compatible view classes',()=>{
  for(const [type,targets]of Object.entries(branches))for(const suffix of ['','_cell']){
    const {name,ids}=parse(`widget_${type}_v165${suffix}`);
    for(const [id,tag]of Object.entries(targets))assert.equal(ids.get(id)?.tag,tag,`${name}: ${id} must be ${tag}`);
  }
});

test('portrait/wide outer layouts contain all shared appearance, collection and preview targets',()=>{
  for(const layout of outerLayouts)for(const [id,tag]of Object.entries(outerKeys))assert.equal(layout.ids.get(id)?.tag,tag,`${layout.name}: ${id}`);
  assert.equal(parse('widget_group_v165').ids.get('w165_group')?.tag,'LinearLayout');
  assert(parse('widget_empty_cell_v165').xml.includes('layout_weight="1"'));
});

test('every v165 Java literal target is covered, including dynamically generated routine level IDs',()=>{
  const covered=new Set([...Object.values(branches).flatMap(x=>Object.keys(x)),...Object.keys(outerKeys),'w165_group']);
  const literals=[...java.matchAll(/"(w165_[a-z0-9_]+)"/g)].map(m=>m[1]).filter(x=>x!=='w165_level_');
  for(const id of literals)assert(covered.has(id),`Unreviewed Java target ${id}; extend branch contract before release`);
  assert.match(java,/for\(int i=0;i<4;i\+\+\)\{String label=new String\[\]\{"MINI","MORE","MAX","SKIP"\}/);
});

test('common setters retain exclusion guards for templates intentionally lacking body/meta/background',()=>{
  assert.match(java,/if\(!type\.equals\("meal"\)\)\{v\.setImageViewResource\(id\(c,"w165_card_background"\)/);
  assert.match(java,/if\(!type\.equals\("todo"\)\)\{text\(c,v,"w165_body"/);
  assert.match(java,/if\(!type\.equals\("workout"\)&&!type\.equals\("day"\)\)\{color\(c,v,"w165_meta"/);
  assert.match(java,/if\(type\.equals\("meal"\)\)\{bitmap[\s\S]*?return v;\}\s*text\(c,v,"w165_title"/);
  assert.match(java,/if\(type\.equals\("group"\)\)\{RemoteViews group=[\s\S]*?return group;\}/);
});

test('all XML widgets use supported RemoteViews view classes, without custom/unsupported UI tags',()=>{
  const allowed=new Set(['FrameLayout','LinearLayout','TextView','ImageView','ProgressBar','ListView','GridLayout','GridView','RelativeLayout','ViewFlipper','StackView','AdapterViewFlipper','AnalogClock','Chronometer','Button','ImageButton','TextClock']);
  for(const layout of [...componentLayouts,...outerLayouts,parse('widget_group_v165'),parse('widget_empty_cell_v165')])for(const tag of layout.tags)assert(allowed.has(tag),`${layout.name}: unsupported RemoteViews tag ${tag}`);
});

test('reflective setInt calls only use audited @RemotableViewMethod methods on compatible targets',()=>{
  const signatures={setPaintFlags:['TextView'],setImageAlpha:['ImageView'],setBackgroundResource:['View'],setHeight:['TextView']};
  // Picker illustrations flatten repeated sample cards; setters target runtime layouts only.
  const resources=fs.readdirSync(path.join(res,'layout')).filter(f=>/^widget_.*\.xml$/.test(f)&&!/^widget_(?:picker|preview)_/.test(f)).map(f=>parse(f.slice(0,-4)));
  let checked=0;
  for(const [file,text]of [['WidgetDesignV165',java],['WidgetNativeV164',native]]){
    const reflects=[...text.matchAll(/\.set(Int|Float|Boolean|String|CharSequence|Long|Double)\(id\(c,"([^"]+)"\),"([^"]+)"/g)];
    for(const [,argType,id,method]of reflects){
      assert.equal(argType,'Int',`${file} ${method}: new signature needs explicit audit`);assert(signatures[method],`Unaudited reflective method ${method}`);
      const matches=resources.flatMap(layout=>layout.ids.has(id)?[{name:layout.name,...layout.ids.get(id)}]:[]);assert(matches.length,`${file} missing target ${id}`);
      for(const target of matches)assert(signatures[method].includes('View')||signatures[method].includes(target.tag),`${file} ${method} is not compatible with ${target.name}/${target.tag}`);
      checked++;
    }
    const allCalls=[...text.matchAll(/\.set(?:Int|Float|Boolean|String|CharSequence|Long|Double)\(/g)];assert.equal(reflects.length,allCalls.length,`${file}: dynamic reflection target must be manually audited`);
  }
  assert(checked>=7,'Expected the audited background, paint and date-height calls');
});

test('dynamic template aliases exist, including stats/YouTube/meal and cell variants',()=>{
  assert.match(java,/type\.equals\("routineStats"\)\|\|type\.equals\("workoutStats"\)\|\|type\.equals\("trend"\)\?"stats":type\.equals\("youtube"\)\?"note":type\.equals\("meal"\)\?"meal_slot":type/);
  for(const name of ['stats','note','meal_slot'])for(const suffix of ['','_cell'])assert(parse(`widget_${name}_v165${suffix}`).ids.size>0);
});

test('inline and service collection type counts cover all possible top-level layouts',()=>{
  const count=Number(service.match(/getViewTypeCount\(\)\{return (\d+);/)?.[1]);
  const inline=Number(native.match(/getMethod\("setViewTypeCount",int\.class\)\.invoke\(builder,(\d+)\)/)?.[1]);
  const required=Object.keys(branches).length+1; // all component kinds + grouped row; cell templates are nested.
  assert(count>=required,`service ${count} < ${required}`);assert(inline>=required,`inline ${inline} < ${required}`);
  assert.match(native,/VERSION\.SDK_INT>=31&&[^\{]*rows\.size\(\)<=40/);
  assert.match(native,/Collection API unavailable; using RemoteViewsService/);
  const manifest=fs.readFileSync(path.resolve(res,'../AndroidManifest.xml'),'utf8');
  assert.match(manifest,/<service[^>]*android:exported="false"[^>]*android:name="\.WidgetRowsV164"[^>]*android:permission="android\.permission\.BIND_REMOTEVIEWS"/);
});

test('collection actions have a mutable template, individual fill-in intents and owner-scoped IDs',()=>{
  assert.match(native,/setPendingIntentTemplate/);assert.match(native,/VERSION\.SDK_INT>=31\?0x0a000000:0x08000000/);
  assert.match(java,/setOnClickFillInIntent\(id\(c,"w165_card"\)/);assert.match(java,/put\(payload,"expectedUpdatedAt",row\.optLong\("updatedAt"\)\)/);
  assert.match(java,/"uid",model\(data\)\.optString\("uid"\)/);
});

test('native image reapplication explicitly clears old photo/cover before an absent image',()=>{
  assert.match(java,/static void bitmap\([\s\S]*?v\.setImageViewResource\(id\(c,id\),0\);if\(data==null\|\|!data\.startsWith\("data:image\/"\)\)return;/);
});

test('every generated launcher progress attribute is an integer in the native 0–100 range',()=>{
  const files=fs.readdirSync(path.join(res,'layout')).filter(name=>/^widget_picker_.*\.xml$/.test(name));
  assert.equal(files.length,29);
  for(const file of files){const xml=fs.readFileSync(path.join(res,'layout',file),'utf8');for(const match of xml.matchAll(/android:progress="([^"]*)"/g)){assert.match(match[1],/^\d+$/,`${file}: ${match[1]} is not an integer`);assert(Number(match[1])<=100,`${file}: progress above 100`);}}
});
