/* Layer current app palettes onto the existing compact widget structure. */
require('./generate-compact-v189.cjs');
const fs=require('node:fs'),path=require('node:path'),themes=require('./themes-v190.cjs');
const root=path.join(__dirname,'res'),ns='xmlns:android="http://schemas.android.com/apk/res/android"';
const read=(group,name)=>fs.readFileSync(path.join(root,group,name+'.xml'),'utf8');
const write=(group,name,body)=>fs.writeFileSync(path.join(root,group,name+'.xml'),body.startsWith('<?xml')?body:'<?xml version="1.0" encoding="utf-8"?>\n'+body+'\n');
const name=(key,part)=>`widget_theme_${key}_${part}_v190`;
const shape=(color,radius,stroke)=>`<shape ${ns}><solid android:color="${color}"/><corners android:radius="${radius}dp"/>${stroke?`<stroke android:width="0.7dp" android:color="${stroke}"/>`:''}</shape>`;
for(const [key,t]of Object.entries(themes)){
 const parts={surface:shape(t.surface,16,t.line),control:shape(t.control,7),outline:shape('#00FFFFFF',6,t.line),selected:shape(t.control,6,t.accent),button:shape(t.accent,12),grid:shape(t.surface,0,t.line),today:shape(t.accent,5)};
 for(const [part,source]of Object.entries(parts))write('drawable',name(key,part),source);
 write('drawable',name(key,'progress'),`<layer-list ${ns}><item android:id="@android:id/background"><shape><solid android:color="${t.control}"/><corners android:radius="4dp"/></shape></item><item android:id="@android:id/progress"><clip><shape><solid android:color="${t.accent}"/><corners android:radius="4dp"/></shape></clip></item></layer-list>`);
}
const aliases={aurora:'system',lavender:'system',mint:'sage',rose:'rose',sunset:'rose',ocean:'slate',mono:'charcoal',midnight:'charcoal'};
for(const [old,key]of Object.entries(aliases))write('drawable','widget_bg_'+old,read('drawable',name(key,'surface')));
const colors=(source,t)=>source.replace(/#(?:FF)?(?:171A3A|352C40|80649A|6255E8|807386|9D91AA|EEE7F3|F1EBF5|EAE1F2|DDD4E5)\b/gi,value=>{
 const hex=value.slice(-6).toUpperCase();return ['171A3A','352C40'].includes(hex)?t.ink:['80649A','6255E8'].includes(hex)?t.accent:['807386','9D91AA'].includes(hex)?t.muted:hex==='DDD4E5'?t.line:t.control;
});
const sourceNames=fs.readdirSync(path.join(root,'layout')).filter(f=>/^widget_v18[89]_.*\.xml$/.test(f)&&!f.endsWith('_v190.xml'));
for(const file of sourceNames){const base=file.slice(0,-4),source=read('layout',base);write('layout',base,colors(source,themes.system));if(!source.includes('<ProgressBar'))continue;
 for(const [key,t]of Object.entries(themes)){
  let themed=colors(source,t).replaceAll('@drawable/widget_progress_v165','@drawable/'+name(key,'progress')).replaceAll('@drawable/widget_v188_control','@drawable/'+name(key,'control'));
  write('layout',base+'_'+key+'_v190',themed);
 }
}
// Static initial layouts and picker previews have the same Lavender baseline.
write('drawable','widget_progress_v165',read('drawable',name('system','progress')));
write('drawable','widget_v188_control',read('drawable',name('system','control')));
write('drawable','widget_v189_note',read('drawable',name('system','control')));
write('drawable','widget_v189_selected',read('drawable',name('system','selected')));
write('drawable','widget_v189_outline',read('drawable',name('system','outline')));
write('drawable','widget_today_compact_v184',read('drawable',name('system','today')));
let config=read('layout','activity_widget_config_v157').replace(/<TextView\b[^>]*android:text="홈 화면에서 표시할 내용과 모양을 조정합니다\."[^>]*\/>\s*/,'').replaceAll('layout_height="66dp"','layout_height="52dp"').replace('textSize="26sp"','textSize="22sp"').replace('paddingTop="24dp"','paddingTop="18dp"').replace(/android:text="색상과 테마\s+›"/,'android:text="색상 테마   Lavender   ›" android:maxLines="1" android:ellipsize="end"').replace(/android:text="배경 불투명도\s+›"/,'android:text="배경 불투명도   ›"').replace(/android:text="글자 크기\s+›"/,'android:text="글자 크기   ›"').replace(/android:text="표시할 내용\s+›"/,'android:text="표시할 내용   ›"');
write('layout','activity_widget_config_v157',config);
console.log('v190: five app palettes, themed progress resources and compact configuration generated.');
