/* Static native resource/data-routing contracts, not an Android inflation test. */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=n=>fs.readFileSync(path.join(__dirname,n),'utf8');
const xml=require('C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js');
const keys=['routine_all','routine_cards','routine_stats','personal_workout_meal','personal_quote','personal_workflow_all','personal_today','personal_challenge'];
test('13 approved designs plus existing consult utility retain component identities; duplicates use documented host hint',()=>{
 const manifest=fs.readFileSync(path.join(__dirname,'../AndroidManifest.xml'),'utf8'),providers=[...manifest.matchAll(/<receiver\b[^>]*>[\s\S]*?<\/receiver>/g)].map(x=>x[0]).filter(x=>x.includes('android.appwidget.provider'));
 assert.equal(providers.length,27);let visible=0,hidden=0;for(const provider of providers){const name=provider.match(/android:resource="@xml\/([^\"]+)"/)[1],meta=read('res/xml/'+name+'.xml');if(meta.includes('hide_from_picker'))hidden++;else visible++;}
 assert.equal(visible,14);assert.equal(hidden,13);
 for(const suffix of ['seven','three_workflow','seven_workflow'])assert.match(read('res/xml/widget_personal_bullet_'+suffix+'.xml'),/hide_from_picker/);
 assert.match(manifest,/android:label="데이로그 · 오늘의 기록" android:name=".WidgetProvider\$PersonalToday"/);
});
test('eight new native designs preserve two-axis flexible resizing and explicit non-demo initial layouts',()=>{
 for(const key of keys){const meta=read('res/xml/widget_'+key+'.xml');assert.match(meta,/initialLayout="@layout\/widget_approved_v188"/);assert.match(meta,/resizeMode="horizontal\|vertical"/);assert.match(meta,/minResizeWidth="180dp"/);assert.match(meta,/minResizeHeight="90dp"/);assert.doesNotMatch(meta,/hide_from_picker/);assert.ok(read('res/layout/widget_picker_'+key+'_v164.xml').includes('예시 데이터'));}
 assert.doesNotMatch(read('res/xml/widget_personal_today.xml'),/widget_desc_bullet/);
});
test('all production XML is valid RemoteViews-compatible XML; weighted titles are never zero-width in vertical stacks',()=>{
 const names=fs.readdirSync(path.join(__dirname,'res/layout')).filter(n=>/^widget_(?:v188_|approved_v188)/.test(n));
 for(const name of names){const source=read('res/layout/'+name);const tree=xml.xml2js(source,{compact:false});let ids=new Set();function visit(node,parent){if(node.type!=='element')return;assert.ok(['FrameLayout','LinearLayout','TextView','ImageView','ProgressBar','ListView'].includes(node.name));const a=node.attributes||{},id=a['android:id'];if(id){assert.ok(!ids.has(id),name+' duplicate id '+id);ids.add(id);}if(parent&&a['android:layout_width']==='0dp')assert.equal(parent?.attributes?.['android:orientation'],'horizontal',name+' weighted child parent');for(const child of node.elements||[])visit(child,node);}tree.elements.forEach(n=>visit(n));}
});
test('native collection routing keeps owner guard, stable actions, model sources and bitmap clearing',()=>{
 const helper=read('WidgetApprovedV188.java'),native=read('WidgetNativeV164.java'),service=read('WidgetRowsV164.java');assert.match(native,/WidgetApprovedV188\.rows/);assert.match(native,/WidgetApprovedV188\.renderRow/);assert.match(service,/sameOwner/);assert.match(helper,/action\(bound,w,k,r,"todo"/);assert.match(helper,/action\(bound,w,k,r,"routine"/);assert.match(helper,/bitmap\(c,v,"w188_photo",r\.optString\("image"\)\)/);assert.doesNotMatch(helper,/widget_demo_|owner-photo|제임스|팀 미팅|localStorage|Firebase/);assert.match(helper,/incompleteTodos/);assert.match(helper,/quotePage/);
});
test('approved rows fail closed before views/actions and never rebind action UID from a new snapshot',()=>{
 const helper=read('WidgetApprovedV188.java');assert.match(helper,/if\(!validOwner\(r,captured\)\)return cleared\(c\);JSONObject bound=actionData\(r\)/);assert.match(helper,/bindOwner\(child,uid,date\)/);assert.doesNotMatch(helper,/action\(snapshot\(c\)/);assert.match(helper,/type\.equals\("stats"\)\?"routine"/);assert.match(helper,/open-schedule-item-v168:/);assert.match(helper,/put\(payload,"uid",r\.optString\("_widgetOwnerV188"\)\)/);
});
test('widget palettes now have distinct surface families; old saved theme keys remain supported',()=>{
 const themes=['aurora','mint','rose','ocean','mono'],fills=themes.map(name=>read('res/drawable/widget_bg_'+name+'.xml').match(/<solid android:color="([^"]+)"/)[1]);assert.equal(new Set(fills).size,5);for(const name of [...themes,'lavender','sunset','midnight'])assert.match(read('res/drawable/widget_bg_'+name+'.xml'),/radius="16dp"/);
});
