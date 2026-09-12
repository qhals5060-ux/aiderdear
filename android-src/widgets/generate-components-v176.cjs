/* v176: semantic native surfaces, not one violet fill across every component.
 * Run this AFTER the historical templates; picker XML reads these exact layouts.
 * Existing dimensions, provider IDs, font steps and action target IDs are kept.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path');
require('./generate-components-v169.cjs');
const res=path.resolve(process.argv[2]||path.join(__dirname,'res'));
const ns='xmlns:android="http://schemas.android.com/apk/res/android"';
const palette={base:'#FCFBFF',panel:'#EFECFA',card:'#FFFFFF',primary:'#6255E8',border:'#DDD7F0',muted:'#6B687D',track:'#E7E2F7'};
function write(name,body){fs.writeFileSync(path.join(res,'drawable',name+'.xml'),'<?xml version="1.0" encoding="utf-8"?>\n'+body+'\n');}
function shape(fill,radius=0,stroke='',oval=false){return `<shape ${ns}${oval?' android:shape="oval"':''}><solid android:color="${fill}"/>${radius?`<corners android:radius="${radius}dp"/>`:''}${stroke?`<stroke android:width="1dp" android:color="${stroke}"/>`:''}</shape>`;}
function attrs(tag,values){for(const[k,v]of Object.entries(values)){const rx=new RegExp('android:'+k+'="[^"]*"');tag=rx.test(tag)?tag.replace(rx,`android:${k}="${v}"`):tag.replace(/(\/?>)$/,` android:${k}="${v}"$1`);}return tag;}
function el(xml,id,values){return xml.replace(new RegExp('<[A-Za-z]+\\b[^>]*android:id="@\\+?id/'+id+'"[^>]*>'),tag=>attrs(tag,values));}
write('widget_bg_aurora',shape(palette.base,20,palette.border));
// Plain rows reveal the user's chosen outer colour instead of repainting it.
write('widget_card_v165',shape('#00000000'));
write('widget_panel_v176',shape(palette.panel,12));
write('widget_panel_dark_v176',shape('#302B48',12,'#55516F'));
write('widget_framed_v176',shape(palette.card,12,palette.border));
write('widget_bullet_card_v168',shape(palette.card,10,palette.border));
write('widget_card_dark_v165',shape('#202035',12,'#55516F'));
write('widget_day_bg_v164',shape('#00000000',9));
write('widget_day_today_v164',shape('#00000000',9,palette.border));
write('widget_day_selected_v164',shape(palette.primary,0,'',true));
write('widget_check_v165',shape('#00000000',0,'#77758B',true));
write('widget_check_done_v165',shape(palette.primary,0,'',true));
write('widget_button_v165',shape('#E5DFFC',9));
write('widget_button_outline_v168',shape(palette.base,9,palette.border));
write('widget_stage_v168',shape(palette.card,7));
write('widget_stage_selected_v168',shape(palette.panel,7));
write('widget_photo_v168',shape(palette.panel,10));
write('widget_time_v168',shape('#88000000',5));
write('widget_row_separator_v169',shape(palette.border));
write('widget_bullet_header_v176',shape(palette.panel,6));
write('widget_progress_v165',`<layer-list ${ns}><item android:id="@android:id/background"><shape><solid android:color="${palette.track}"/><corners android:radius="4dp"/></shape></item><item android:id="@android:id/progress"><clip><shape><solid android:color="${palette.primary}"/><corners android:radius="4dp"/></shape></clip></item></layer-list>`);

for(const name of fs.readdirSync(path.join(res,'layout')).filter(n=>/^widget_.*\.xml$/.test(n))){
  let xml=fs.readFileSync(path.join(res,'layout',name),'utf8');
  const match=name.match(/^widget_(note|todo|routine|language|stats|challenge|workout|book|quote|workflow|day|trend)_(?:v165|v169)(?:_cell)?\.xml$/);
  const detail=/^widget_book_detail_v168/.test(name);
  if(match||detail){
    const type=detail?'book_detail':match[1];
    const soft=['note','stats','workout','quote','book_detail'].includes(type);
    const framed=['routine','challenge','workflow','trend','day'].includes(type);
    xml=el(xml,'w165_card_background',{src:'@drawable/'+(soft?'widget_panel_v176':type==='day'?'widget_bullet_card_v168':framed?'widget_framed_v176':'widget_card_v165')});
    if(soft||framed)xml=xml.replace(/android:paddingLeft="0dp" android:paddingRight="0dp"/,'android:paddingLeft="10dp" android:paddingRight="10dp"');
    // A framed or filled card already separates adjacent rows; keep plain-row hairlines.
    if(soft||framed)xml=el(xml,'w169_row_divider',{visibility:'gone'});
    xml=el(xml,'w165_meta',{textColor:type==='stats'?palette.primary:palette.muted});
    xml=el(xml,'w165_action',{textColor:palette.primary});
    if(type==='quote')xml=el(xml,'w165_title',{textColor:palette.primary});
    if(type==='day')xml=el(xml,'w165_title',{background:'@drawable/widget_bullet_header_v176',paddingLeft:'6dp',paddingRight:'6dp',paddingTop:'3dp',paddingBottom:'3dp'});
  }
  if(name==='widget_day_v164.xml')xml=el(xml,'widget_day_number_v164',{layout_width:'28dp',layout_height:'28dp',layout_gravity:'center_horizontal',gravity:'center'});
  if(/^widget_meal_slot_v165/.test(name))xml=el(xml,'w165_time',{textColor:'#FFFFFF'});
  xml=xml.replace(/android:progressBackgroundTint="#DED9FF"/g,`android:progressBackgroundTint="${palette.track}"`);
  // Preserve all navigation and content target IDs; only their resting colour changes.
  xml=el(xml,'widget_add',{textColor:palette.primary});
  fs.writeFileSync(path.join(res,'layout',name),xml);
}
console.log('v176 native widget surfaces generated: near-white base, lavender panels, white framed content.');
