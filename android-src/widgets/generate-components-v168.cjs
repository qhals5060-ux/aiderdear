/* v13 production RemoteViews resources. Retain resource names/IDs for installed widgets. */
const fs=require('node:fs'),path=require('node:path');
require('./generate-components-v165.cjs');
const res=path.resolve(process.argv[2]||path.join(__dirname,'res'));
const ns='xmlns:android="http://schemas.android.com/apk/res/android"';
const read=(type,name)=>fs.readFileSync(path.join(res,type,name+'.xml'),'utf8');
const write=(type,name,value)=>{fs.mkdirSync(path.join(res,type),{recursive:true});fs.writeFileSync(path.join(res,type,name+'.xml'),value.startsWith('<?xml')?value:'<?xml version="1.0" encoding="utf-8"?>\n'+value+'\n')};
function element(xml,id,attrs){const rx=new RegExp('<[A-Za-z]+\\b[^>]*android:id="@\\+?id/'+id+'"[^>]*>');return xml.replace(rx,el=>{for(const[key,value]of Object.entries(attrs)){const a=new RegExp('android:'+key+'="[^"]*"');el=a.test(el)?el.replace(a,`android:${key}="${value}"`):el.replace(/(\/?>)$/,` android:${key}="${value}"$1`)}return el})}
const shape=(color,radius=0,stroke='')=>`<shape ${ns}><solid android:color="${color}"/>${radius?`<corners android:radius="${radius}dp"/>`:''}${stroke?`<stroke android:width="1dp" android:color="${stroke}"/>`:''}</shape>`;
write('drawable','widget_bg_aurora',shape('#F7F6FF',20,'#DED9FF'));
write('drawable','widget_card_v165',shape('#F7F6FF'));
write('drawable','widget_day_bg_v164',shape('#F7F6FF',9));
write('drawable','widget_day_today_v164',shape('#F7F6FF',9,'#DED9FF'));
write('drawable','widget_day_selected_v164',shape('#DED9FF',9,'#6255E8'));
write('drawable','widget_day_clear_v164',shape('#00000000'));
write('drawable','widget_button_v165',shape('#DED9FF',9));
write('drawable','widget_button_outline_v168',shape('#F7F6FF',9,'#6255E8'));
write('drawable','widget_stage_v168',shape('#F7F6FF',7));
write('drawable','widget_stage_selected_v168',`<layer-list ${ns}><item><shape><solid android:color="#DED9FF"/><corners android:radius="7dp"/></shape></item><item android:gravity="bottom" android:height="2dp"><shape><solid android:color="#6255E8"/></shape></item></layer-list>`);
write('drawable','widget_bullet_card_v168',shape('#F7F6FF',10,'#DED9FF'));
write('drawable','widget_photo_v168',shape('#DED9FF',10));
write('drawable','widget_time_v168',shape('#F7F6FF',5));
write('drawable','widget_check_done_v165',`<shape ${ns} android:shape="oval"><solid android:color="#DED9FF"/><stroke android:width="1dp" android:color="#6255E8"/></shape>`);
for(const file of fs.readdirSync(path.join(res,'layout')).filter(n=>/^widget_(note|todo|routine|language|stats|challenge|workout|book|quote|workflow|day|meal_slot|design)_v165(?:_cell|_wide)?\.xml$/.test(n))){
  let xml=fs.readFileSync(path.join(res,'layout',file),'utf8').replace(/android:layout_height="7dp"/g,'android:layout_height="4dp"').replace(/android:padding="11dp"/g,'android:padding="12dp"').replace(/android:layout_margin="3dp"/g,'android:layout_margin="4dp"');
  xml=xml.replace(/android:textColor="#6255E8"/g,'android:textColor="#171A3A"').replace(/android:textColor="#FFFFFF"/g,'android:textColor="#171A3A"');
  xml=element(xml,'w165_check',{layout_width:'24dp',layout_height:'24dp',textSize:'17sp',layout_marginRight:'10dp'});
  xml=element(xml,'w165_title',{lineSpacingMultiplier:'1.45'});
  xml=element(xml,'w165_body',{lineSpacingMultiplier:'1.5'});
  xml=element(xml,'w165_graph',{layout_height:file.includes('stats')?'120dp':'74dp',scaleType:'fitCenter'});
  xml=element(xml,'w165_levels',{layout_height:'48dp'});
  for(let n=0;n<4;n++)xml=element(xml,'w165_level_'+n,{layout_height:'34dp',layout_marginTop:'7dp',layout_marginBottom:'7dp',layout_marginLeft:n?'3dp':'0dp',layout_marginRight:n<3?'3dp':'0dp',background:'@drawable/widget_stage_v168'});
  xml=element(xml,'w165_action',{layout_height:'40dp',gravity:'center',background:'@drawable/widget_button_outline_v168',layout_marginTop:'12dp'});
  xml=element(xml,'w165_cover',{layout_width:'67dp',layout_height:'94dp'});
  xml=element(xml,'w165_photo',{background:'@drawable/widget_photo_v168'});
  xml=element(xml,'w165_time',{layout_width:'wrap_content',layout_marginLeft:'6dp',layout_marginTop:'6dp',background:'@drawable/widget_time_v168',paddingLeft:'5dp',paddingRight:'5dp',paddingTop:'2dp',paddingBottom:'2dp'});
  xml=element(xml,'w165_rating',{textColor:'#6255E8',textSize:'12sp',layout_height:'22dp',layout_marginTop:'5dp'});
  if(file.includes('quote'))xml=element(xml,'w165_body',{textSize:'18sp',lineSpacingMultiplier:'1.55'});
  if(file.includes('day')){xml=element(xml,'w165_card_background',{src:'@drawable/widget_bullet_card_v168'});xml=element(xml,'w165_title',{textSize:'12sp'});}
  if(file.includes('design')){
    xml=xml.replace(/android:padding="12dp"/,'android:padding="14dp"');
    xml=element(xml,'w165_header',{layout_height:'40dp',layout_marginBottom:'10dp'});
    xml=element(xml,'widget_add',{layout_width:'32dp',layout_height:'32dp',textColor:'#171A3A'});
    xml=element(xml,'widget_title',{textSize:'13sp'});
    xml=element(xml,'widget_empty',{gravity:'left|top',text:'기록 없음'});
    xml=element(xml,'widget_items_v164',{divider:'#DED9FF',dividerHeight:'1dp',paddingBottom:'12dp',clipToPadding:'false'});
    xml=element(xml,'w165_secondary_list',{divider:'#DED9FF',dividerHeight:'1dp',paddingBottom:'12dp',clipToPadding:'false'});
    xml=xml.replace(/android:layout_weight="1\.6"/g,'android:layout_weight="1"');
    xml=element(xml,'w165_secondary',{layout_marginLeft:'22dp'});
  }
  fs.writeFileSync(path.join(res,'layout',file),xml);
}
// Dedicated compact book summary, native text and images remain independently accessible.
write('layout','widget_stack_v168',`<LinearLayout ${ns} android:id="@id/w165_group" android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content" android:layout_margin="5dp" android:orientation="vertical"/>`);
for(const cell of [false,true])write('layout','widget_book_detail_v168'+(cell?'_cell':''),`<FrameLayout ${ns} android:id="@id/w165_card" android:layout_width="${cell?'0dp':'match_parent'}" ${cell?'android:layout_weight="1"':''} android:layout_height="wrap_content"><ImageView android:id="@id/w165_card_background" android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/widget_card_v165" android:contentDescription="@null"/><LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:padding="12dp" android:orientation="horizontal"><ImageView android:id="@id/w165_cover" android:layout_width="83dp" android:layout_height="116dp" android:background="@drawable/widget_photo_v168" android:scaleType="fitCenter" android:contentDescription="책 표지"/><LinearLayout android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content" android:layout_marginLeft="14dp" android:orientation="vertical"><TextView android:id="@id/w165_title" android:layout_width="match_parent" android:layout_height="wrap_content" android:textSize="17sp" android:textColor="#171A3A" android:lineSpacingMultiplier="1.45"/><TextView android:id="@id/w165_meta" android:layout_width="match_parent" android:layout_height="wrap_content" android:textSize="12sp" android:textColor="#171A3A"/><ProgressBar android:id="@id/w165_progress" style="?android:attr/progressBarStyleHorizontal" android:layout_width="match_parent" android:layout_height="4dp" android:layout_marginTop="12dp" android:layout_marginBottom="12dp" android:max="100" android:progressDrawable="@drawable/widget_progress_v165"/><TextView android:id="@id/w165_body" android:layout_width="match_parent" android:layout_height="wrap_content" android:textSize="13sp" android:textColor="#171A3A"/></LinearLayout></LinearLayout></FrameLayout>`);
// Small native shortcut uses the existing AppWidgetID/settings and the regular authenticated app route.
write('layout','widget_client_link_v168',`<FrameLayout ${ns} android:id="@id/widget_root" android:layout_width="match_parent" android:layout_height="match_parent"><ImageView android:id="@id/widget_background" android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/widget_bg_aurora" android:contentDescription="@null"/><LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:gravity="center" android:padding="8dp" android:orientation="vertical"><TextView android:id="@id/widget_title" android:layout_width="match_parent" android:layout_height="wrap_content" android:gravity="center" android:text="고객정보" android:textSize="12sp" android:textColor="#171A3A"/><TextView android:id="@id/widget_subtitle" android:layout_width="match_parent" android:layout_height="wrap_content" android:gravity="center" android:text="링크 복사" android:textSize="11sp" android:textColor="#171A3A"/></LinearLayout></FrameLayout>`);
write('xml','widget_task_client_link',`<appwidget-provider ${ns} android:minWidth="48dp" android:minHeight="48dp" android:minResizeWidth="48dp" android:minResizeHeight="48dp" android:targetCellWidth="1" android:targetCellHeight="1" android:initialLayout="@layout/widget_client_link_v168" android:previewLayout="@layout/widget_client_link_v168" android:resizeMode="none" android:updatePeriodMillis="1800000" android:widgetCategory="home_screen" android:configure="com.aiderlog.v22app.WidgetConfigActivity" android:widgetFeatures="reconfigurable|configuration_optional"/>`);
for(const name of ['widget_native_v164','widget_native_wide_v164','widget_item_v164','widget_day_v164','widget_weekrow_v164']){
  let xml=read('layout',name).replace(/#6B6D83|#AAA9B7/g,'#171A3A');
  xml=element(xml,'widget_day_number_v164',{textSize:'12sp',textColor:'#171A3A'});
  xml=element(xml,'widget_day_label_v164',{layout_height:'14dp',textSize:'10sp',textColor:'#171A3A'});
  xml=element(xml,'widget_day_events_v164',{textSize:'11sp',maxLines:'4',lineSpacingMultiplier:'1.3'});
  xml=element(xml,'widget_day_more_v164',{layout_height:'14dp',textSize:'10sp'});
  xml=element(xml,'widget_item_text_v164',{textSize:'14sp',maxLines:'6',lineSpacingMultiplier:'1.5'});
  xml=element(xml,'widget_item_time_v165',{layout_width:'46dp',textSize:'12sp',textColor:'#171A3A'});
  xml=element(xml,'widget_item_row_v164',{paddingTop:'11dp',paddingBottom:'11dp'});
  xml=element(xml,'widget_item_dot_v164',{layout_width:'7dp',layout_height:'7dp',layout_marginRight:'10dp'});
  xml=element(xml,'widget_empty',{text:'기록 없음',gravity:'left|top',textColor:'#171A3A'});
  xml=element(xml,'widget_items_v164',{divider:'#DED9FF',dividerHeight:'1dp',scrollbars:'vertical',paddingBottom:'12dp',clipToPadding:'false'});
  xml=element(xml,'widget_add',{layout_width:'32dp',layout_height:'32dp',background:'@drawable/widget_button_v165',textColor:'#171A3A'});
  xml=element(xml,'widget_subtitle',{layout_height:'wrap_content',textSize:'12sp',layout_marginBottom:'10dp',textColor:'#171A3A'});
  write('layout',name,xml);
}
console.log('Generated v168/v13 native production cards + 1×1 customer link.');
