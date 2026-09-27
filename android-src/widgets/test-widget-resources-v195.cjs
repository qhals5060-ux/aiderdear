const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),test=require('node:test');
// AIDERLOG_TEST_NATIVE_ROOT accepts an apktool stage (res/) or android-src (widgets/res/).
const root=path.resolve(process.env.AIDERLOG_TEST_NATIVE_ROOT||path.join(__dirname,'..'));
const res=fs.existsSync(path.join(root,'res'))?path.join(root,'res'):path.join(root,'widgets/res');
const manifest=path.join(root,'AndroidManifest.xml');
// Android 8+ RemoteViews allowlist; API31-only controls require a v31+ resource qualifier.
// https://developer.android.com/reference/android/widget/RemoteViews
// ViewStub: https://developer.android.com/develop/ui/views/appwidgets
const supported=new Set(['AdapterViewFlipper','FrameLayout','GridLayout','GridView','LinearLayout','ListView','RelativeLayout','StackView','ViewFlipper','AnalogClock','Button','Chronometer','ImageButton','ImageView','ProgressBar','TextClock','TextView','ViewStub']);
const newer=new Set(['CheckBox','RadioButton','RadioGroup','Switch']),meta=new Set(['include','merge','requestFocus','tag']);
function xml(file){
 const source=fs.readFileSync(file,'utf8').replace(/<!--[\s\S]*?-->/g,'');const nodes=[],stack=[];
 for(const token of source.matchAll(/<\/?([\w.$:-]+)\b([^>]*?)\/?\s*>/g)){
  if(token[0].startsWith('</')){assert.equal(stack.pop()?.tag,token[1],`${file}: balanced XML`);continue}
  const attrs=Object.fromEntries([...token[2].matchAll(/([\w:.-]+)\s*=\s*(["'])([\s\S]*?)\2/g)].map(m=>[m[1],m[3]]));
  const node={tag:token[1],attrs,parent:stack.at(-1)||null,order:nodes.length};nodes.push(node);if(!token[0].endsWith('/>'))stack.push(node);
 }
 assert.equal(stack.length,0,`${file}: all XML tags close`);return {file,source,nodes};
}
const resources=new Map(),layoutDirs=fs.readdirSync(res).filter(name=>/^layout(?:-|$)/.test(name));
function filesForLayout(name){return layoutDirs.map(dir=>path.join(res,dir,name+'.xml')).filter(file=>fs.existsSync(file))}
function loadLayout(name){
 const files=filesForLayout(name);assert(files.length>0,`layout exists: ${name}`);
 for(const file of files){if(resources.has(file))continue;const doc=xml(file);resources.set(file,doc);for(const node of doc.nodes)for(const value of Object.values(node.attrs)){const match=value.match(/^@layout\/([\w_]+)$/);if(match)loadLayout(match[1])}}
}
const expected=['CalendarMonth','CalendarCombined','CalendarSplit','CalendarFortnight','RoutineAll'];
const manifestDoc=xml(manifest),receivers=manifestDoc.nodes.filter(node=>node.tag==='receiver'&&manifestDoc.nodes.some(child=>child.parent===node&&child.tag==='meta-data'&&child.attrs['android:name']==='android.appwidget.provider'));
const providerDocs=receivers.map(receiver=>{const metadata=manifestDoc.nodes.find(node=>node.parent===receiver&&node.attrs['android:name']==='android.appwidget.provider'),name=metadata.attrs['android:resource'].replace('@xml/',''),doc=xml(path.join(res,'xml',name+'.xml'));for(const node of doc.nodes)for(const [key,value]of Object.entries(node.attrs))if(['android:initialLayout','android:previewLayout'].includes(key))loadLayout(value.replace('@layout/',''));return doc});
const runtimeLayouts=['widget_routine_v195','widget_calendar_notes_v194','widget_fortnight_notes_v194','widget_routine_v194','widget_routine_row_v194','widget_routine_stats_v194','widget_memo_row_v194','widget_month_small_v185','widget_month_compact_v184','widget_split_small_v185','widget_split_compact_v184','widget_weekdays_small_v185','widget_weekdays_compact_v184','widget_week_v164','widget_mini_day_small_v185','widget_mini_day_v184','widget_event_day_small_v185','widget_event_day_v184','widget_event_chip_v184','widget_upcoming_row_v184','widget_upcoming_inline_v186','widget_upcoming_small_v185','widget_todo_small_v185','widget_todo_row_v184','widget_v189_empty_calendar'];
for(const name of runtimeLayouts)loadLayout(name);for(const theme of ['system','sage','rose','slate','charcoal'])loadLayout('widget_routine_v195_'+theme+'_v190');
const themes=['system','sage','rose','slate','charcoal'];
for(const base of ['widget_routine_row_v194','widget_routine_stats_v194','widget_v189_empty_calendar'])for(const theme of themes){const name=base+'_'+theme+'_v190';if(base!=='widget_v189_empty_calendar'||filesForLayout(name).length)loadLayout(name)}
function byId(doc,id){const nodes=doc.nodes.filter(node=>(node.attrs['android:id']||'').replace(/^@\+?id\//,'')===id);assert.equal(nodes.length,1,`${path.basename(doc.file)} contains exactly one ${id}`);return nodes[0]}
function type(doc,id,tag){const node=byId(doc,id);assert.equal(node.tag,tag,`${id} uses ${tag}`);return node}
function inside(node,ancestor){for(let p=node.parent;p;p=p.parent)if(p===ancestor)return true;return false}
function baseDoc(name){return resources.get(path.join(res,'layout',name+'.xml'))}
test('exactly the five retained widget providers are registered',()=>{
 assert.deepEqual(receivers.map(node=>node.attrs['android:name'].split('$').at(-1)).sort(),expected.slice().sort());assert.equal(providerDocs.length,5);
 assert(!receivers.some(node=>/Agenda|Personal|DayLog/.test(node.attrs['android:name'])));
});
test('all active initial/preview/runtime row layouts use supported RemoteViews classes',()=>{
 for(const doc of resources.values())for(const node of doc.nodes){const tag=(node.tag==='view'?node.attrs.class||'':node.tag).replace(/^android\.(?:widget|view)\./,'');const qualifier=path.basename(path.dirname(doc.file)),api=Number(qualifier.match(/(?:^|-)v(\d+)/)?.[1]||0);assert(supported.has(tag)||meta.has(tag)||api>=31&&newer.has(tag),`${path.relative(res,doc.file)}: ${tag} is not supported on the layout's minimum Android API`)}
});
test('CalendarSplit and Fortnight have independent TODO and MEMO collections below the calendar',()=>{
 for(const name of ['widget_calendar_notes_v194','widget_fortnight_notes_v194']){const doc=baseDoc(name),calendar=type(doc,'widget_calendar_v164','LinearLayout'),panel=type(doc,'w184_todo_panel','LinearLayout');assert.equal(calendar.parent,panel.parent);assert.equal(calendar.parent.attrs['android:orientation'],'vertical');assert(calendar.order<panel.order);assert(Number(calendar.attrs['android:layout_weight'])>0&&Number(panel.attrs['android:layout_weight'])>0);
  const todos=type(doc,'w165_secondary_list','ListView'),notes=type(doc,'w194_notes_list','ListView');assert(inside(todos,panel)&&inside(notes,panel));assert(!inside(todos,notes)&&!inside(notes,todos));
  for(const list of [todos,notes])for(let parent=list.parent;parent;parent=parent.parent)assert(!['ListView','GridView','StackView','AdapterViewFlipper'].includes(parent.tag),'collections are not nested inside collections');
  for(const id of ['w184_todo_heading','w194_notes_heading','w184_todo_empty','w194_notes_empty'])type(doc,id,'TextView');
  for(const id of ['w181_todo_preview','w194_notes_preview'])type(doc,id,'LinearLayout');
 }
});
test('Fortnight keeps its schedule list between the calendar and TODO/MEMO panel',()=>{
 const doc=baseDoc('widget_fortnight_notes_v194'),calendar=byId(doc,'widget_calendar_v164'),panel=byId(doc,'w184_todo_panel'),list=type(doc,'widget_items_v164','ListView');assert(list.order>calendar.order&&list.order<panel.order);assert(!inside(list,panel));type(doc,'widget_preview_rows_v164','LinearLayout');type(doc,'w184_event_empty','TextView');type(doc,'w194_schedule_heading','TextView');
});
test('new routine and memo row action/progress IDs have the expected native view types',()=>{
 const routine=baseDoc('widget_routine_row_v194'),stats=baseDoc('widget_routine_stats_v194'),memo=baseDoc('widget_memo_row_v194');
 for(const doc of [routine,stats]){type(doc,'w194_routine_row','LinearLayout');type(doc,'w194_routine_title','TextView');type(doc,'w194_routine_meta','TextView');type(doc,'w194_routine_progress','ProgressBar')}
 type(routine,'w194_routine_actions','LinearLayout');for(let i=0;i<4;i++)type(routine,'w194_level_'+i,'TextView');for(let i=0;i<7;i++)type(stats,'w194_week_'+i,'TextView');type(memo,'w194_note_row','LinearLayout');type(memo,'w194_note_title','TextView');type(memo,'w194_note_body','TextView');
});
test('each routine palette selects its matching progress drawable and preserves action IDs',()=>{
 for(const base of ['widget_routine_row_v194','widget_routine_stats_v194'])for(const theme of themes){const doc=baseDoc(base+'_'+theme+'_v190'),progress=type(doc,'w194_routine_progress','ProgressBar');assert.equal(progress.attrs['android:progressDrawable'],'@drawable/widget_theme_'+theme+'_progress_v190');const drawable=path.join(res,'drawable','widget_theme_'+theme+'_progress_v190.xml');assert(fs.existsSync(drawable));assert.match(fs.readFileSync(drawable,'utf8'),/@android:id\/progress/);type(doc,'w194_routine_row','LinearLayout');if(base==='widget_routine_row_v194')for(let i=0;i<4;i++)type(doc,'w194_level_'+i,'TextView')}
});
console.log(`Validated resource graph: ${resources.size} layouts, ${receivers.length} providers.`);

test('RoutineAll has fixed2:1 body and non-scrolling seven-day aggregate statistics',()=>{const doc=baseDoc('widget_routine_v195'),daily=byId(doc,'w195_daily_panel'),weekly=byId(doc,'w195_week_panel');assert.equal(daily.parent,weekly.parent);assert.equal(daily.parent.attrs['android:orientation'],'vertical');assert(daily.order<weekly.order);assert.equal(Number(daily.attrs['android:layout_weight'])/Number(weekly.attrs['android:layout_weight']),2);type(doc,'widget_items_v164','ListView');assert(!doc.nodes.some(n=>inside(n,weekly)&&['ListView','GridView','StackView'].includes(n.tag)),'all statistics must be visible without scrolling');type(doc,'w195_week_title','TextView');type(doc,'w195_week_names','TextView');for(let i=0;i<7;i++){type(doc,'w195_day_'+i,'TextView');const count=type(doc,'w195_count_'+i,'TextView');assert.equal(count.attrs['android:textSize'],'12sp','counts keep constant readable font');type(doc,'w195_bar_'+i,'ProgressBar');}});
test('aggregate progress resources preserve every palette',()=>{for(const theme of themes){const doc=baseDoc('widget_routine_v195_'+theme+'_v190');for(let i=0;i<7;i++)assert.equal(type(doc,'w195_bar_'+i,'ProgressBar').attrs['android:progressDrawable'],'@drawable/widget_theme_'+theme+'_progress_v190');}});
