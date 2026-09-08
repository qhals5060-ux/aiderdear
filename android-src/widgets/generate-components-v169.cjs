/* v169: production dp/sp hierarchy; no HTML-only presentation rules. */
const fs=require('node:fs'),path=require('node:path');
require('./generate-components-v168.cjs');
const res=path.resolve(process.argv[2]||path.join(__dirname,'res'));
function attrs(tag,values){for(const[k,v]of Object.entries(values)){const rx=new RegExp('android:'+k+'="[^"]*"');tag=rx.test(tag)?tag.replace(rx,`android:${k}="${v}"`):tag.replace(/(\/?>)$/,` android:${k}="${v}"$1`);}return tag;}
function el(xml,id,values){return xml.replace(new RegExp('<[A-Za-z]+\\b[^>]*android:id="@\\+?id/'+id+'"[^>]*>'),tag=>attrs(tag,values));}
for(const name of fs.readdirSync(path.join(res,'layout')).filter(n=>/^widget_.*\.xml$/.test(n))){
  let xml=fs.readFileSync(path.join(res,'layout',name),'utf8');
  if(!/widget_(?:design|native|item|note|todo|routine|language|stats|challenge|workout|book|quote|workflow|day|meal_slot|client_link|stack|group)/.test(name))continue;
  xml=xml.replace(/<(FrameLayout|LinearLayout)\b[^>]*>/,tag=>attrs(tag,{forceDarkAllowed:'false'}));
  if(/^widget_(note|todo|routine|language|stats|challenge|workout|book|quote|workflow)_v165/.test(name)){
    // Outer 18dp + row 0/2dp: do not compound 14+12+4 into 30dp on every side.
    xml=xml.replace(/android:layout_margin="4dp"/g,'android:layout_margin="2dp"').replace(/android:padding="12dp"/g,'android:paddingLeft="0dp" android:paddingRight="0dp" android:paddingTop="11dp" android:paddingBottom="11dp"');
  }
  if(/^widget_(design|native)/.test(name))xml=xml.replace(/android:padding="(?:12|14)dp"/,'android:padding="18dp"');
  if(/^widget_design_v165/.test(name)){
    for(const id of ['w165_header','widget_previous','widget_next','widget_add'])xml=el(xml,id,{visibility:'gone'});
    xml=el(xml,'widget_empty',{text:'기록을 불러오는 중'});
    // The component carries its separator in both collection and inline modes.
    // Do not draw a second ListView divider against that native 1dp line.
    for(const id of ['widget_items_v164','w165_secondary_list'])xml=el(xml,id,{dividerHeight:'0dp'});
  }
  if(name==='widget_item_v164.xml'){
    xml=xml.replace('android:layout_margin="3dp"','android:layout_margin="0dp"').replace('android:padding="9dp"','android:padding="0dp"').replace('android:minHeight="44dp"','android:minHeight="22dp"');
    xml=el(xml,'widget_item_text_v164',{layout_marginLeft:'10dp',maxLines:'20'});
    xml=el(xml,'widget_item_time_v165',{layout_marginLeft:'0dp'});
    xml=el(xml,'widget_item_dot_v164',{background:'@drawable/widget_event_dot_v169'});
  }
  if(/^widget_(routine|workflow|challenge)_v165/.test(name)){
    const title=xml.match(/<TextView\b[^>]*android:id="@\+?id\/w165_title"[^>]*\/>/);
    const meta=xml.match(/<TextView\b[^>]*android:id="@\+?id\/w165_meta"[^>]*\/>/);
    if(title&&meta){const heading=attrs(title[0],{layout_width:'0dp',layout_weight:'1',layout_marginRight:'10dp'});
      const aside=attrs(meta[0],{layout_width:'wrap_content',layout_marginTop:'0dp',gravity:'right',maxWidth:'124dp'});
      xml=xml.replace(title[0]+meta[0],`<LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:gravity="center_vertical">${heading}${aside}</LinearLayout>`);
    }
  }
  if(/^widget_todo_v165/.test(name)){
    // Deadline has its own right-hand column; long title wraps without moving the check.
    const title=xml.match(/<TextView\b[^>]*android:id="@\+?id\/w165_title"[^>]*\/>/);
    const meta=xml.match(/<TextView\b[^>]*android:id="@\+?id\/w165_meta"[^>]*\/>/);
    if(title&&meta)xml=xml.replace(/<LinearLayout android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content" android:orientation="vertical">[^]*?<\/LinearLayout>/,attrs(title[0],{layout_width:'0dp',layout_weight:'1',layout_marginRight:'10dp'})+attrs(meta[0],{layout_width:'wrap_content',maxWidth:'76dp',gravity:'right',layout_marginTop:'0dp'}));
  }
  if(/^widget_language_v165/.test(name)){
    const graph=xml.match(/<ImageView\b[^>]*android:id="@\+?id\/w165_graph"[^>]*\/>/);
    const meta=xml.match(/<TextView\b[^>]*android:id="@\+?id\/w165_meta"[^>]*\/>/);
    if(graph&&meta)xml=xml.replace(graph[0]+meta[0],meta[0]+graph[0]);
  }
  xml=xml.replace(/<ProgressBar\b[^>]*>/g,tag=>attrs(tag,{progressTint:'#6255E8',progressBackgroundTint:'#DED9FF'}));
  xml=el(xml,'widget_day_number_v164',{layout_height:'wrap_content',minHeight:'22dp',includeFontPadding:'true',gravity:'center',textSize:'12sp'});
  xml=el(xml,'widget_day_label_v164',{layout_height:'wrap_content',minHeight:'14dp',includeFontPadding:'true'});
  xml=el(xml,'w165_action',{textColor:'#171A3A'});
  if(/^widget_(note|todo|routine|language|challenge|workout|workflow)_v165(?:_cell)?\.xml$/.test(name))xml=xml.replace(/<\/FrameLayout>\s*$/,separator()+'</FrameLayout>');
  fs.writeFileSync(path.join(res,'layout',name),xml);
}
function separator(){return '<ImageView android:id="@+id/w169_row_divider" android:layout_width="match_parent" android:layout_height="1dp" android:layout_gravity="bottom" android:src="@drawable/widget_row_separator_v169" android:scaleType="fitXY" android:contentDescription="@null"/>';}
// A trend is a short reading row, not a second large statistics card. Retain the
// familiar ids so the same native value/graph/footnote binding remains intact.
for(const cell of [false,true]){
  const xml=`<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android" android:id="@+id/w165_card" android:layout_width="${cell?'0dp':'match_parent'}" ${cell?'android:layout_weight="1"':''} android:layout_height="wrap_content" android:layout_margin="2dp" android:forceDarkAllowed="false">
  <ImageView android:id="@+id/w165_card_background" android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/widget_card_v165" android:scaleType="fitXY" android:contentDescription="@null"/>
  <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="vertical" android:paddingTop="11dp" android:paddingBottom="11dp">
    <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:gravity="center_vertical" android:baselineAligned="false">
      <LinearLayout android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content" android:layout_marginRight="12dp" android:orientation="vertical">
        <TextView android:id="@+id/w165_title" android:layout_width="match_parent" android:layout_height="wrap_content" android:textSize="14sp" android:textColor="#171A3A" android:textStyle="bold" android:lineSpacingMultiplier="1.3"/>
        <TextView android:id="@+id/w165_meta" android:layout_width="match_parent" android:layout_height="wrap_content" android:textSize="12sp" android:textColor="#171A3A" android:layout_marginTop="4dp"/>
      </LinearLayout>
      <ImageView android:id="@+id/w165_graph" android:layout_width="108dp" android:layout_height="34dp" android:scaleType="fitCenter" android:contentDescription="항목별 추이"/>
    </LinearLayout>
    <TextView android:id="@+id/w165_body" android:layout_width="match_parent" android:layout_height="wrap_content" android:visibility="gone" android:textSize="13sp" android:textColor="#171A3A"/>
    <TextView android:id="@+id/w165_foot" android:layout_width="match_parent" android:layout_height="wrap_content" android:textSize="11sp" android:textColor="#171A3A" android:layout_marginTop="5dp"/>
  </LinearLayout>
  ${separator()}
</FrameLayout>`;
  fs.writeFileSync(path.join(res,'layout','widget_trend_v169'+(cell?'_cell':'')+'.xml'),xml);
}
fs.writeFileSync(path.join(res,'drawable','widget_event_dot_v169.xml'),'<?xml version="1.0" encoding="utf-8"?><shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="oval"><solid android:color="#6255E8"/></shape>');
fs.writeFileSync(path.join(res,'drawable','widget_row_separator_v169.xml'),'<?xml version="1.0" encoding="utf-8"?><shape xmlns:android="http://schemas.android.com/apk/res/android"><solid android:color="#DED9FF"/></shape>');
fs.writeFileSync(path.join(res,'drawable','widget_trend_surface_dark_v169.xml'),'<?xml version="1.0" encoding="utf-8"?><shape xmlns:android="http://schemas.android.com/apk/res/android"><solid android:color="#202035"/></shape>');
console.log('Generated v169 widget native hierarchy, spacing and force-dark protection.');
