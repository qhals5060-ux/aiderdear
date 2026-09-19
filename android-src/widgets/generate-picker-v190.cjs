/* Fixture-only theme matrix; every runtime view still renders actual owner data. */
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const themes=require('./themes-v190.cjs'),sharp=require('C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const qa=path.resolve(process.argv[2]||path.join(__dirname,'../../../../work/widget-v190/picker')),res=path.join(__dirname,'res');
fs.mkdirSync(qa,{recursive:true});
execFileSync(process.execPath,[path.join(__dirname,'generate-picker-v189.cjs'),path.join(qa,'base')],{stdio:'inherit'});
const base=JSON.parse(fs.readFileSync(path.join(qa,'base/fixtures.json'),'utf8'));
const drawable=(key,part)=>'@drawable/widget_theme_'+key+'_'+part+'_v190';
function themedXML(xml,key){const t=themes[key],mapping={
 '#171a3a':t.ink,'#352c40':t.ink,'#80649a':t.accent,'#6255e8':t.accent,'#807386':t.muted,'#9d91aa':t.muted,'#eee7f3':t.control,'#f1ebf5':t.control,'#eae1f2':t.control,'#ddd4e5':t.line
 };for(const component of ['ink','accent','muted','control','line'])mapping[themes.system[component].toLowerCase()]=t[component];
 xml=xml.replace(/#[0-9a-f]{6}\b/gi,value=>mapping[value.toLowerCase()]||value);
 const surfaces={widget_bg_aurora:'surface',widget_v188_control:'control',widget_v189_note:'control',widget_v189_outline:'outline',widget_v189_selected:'selected',widget_progress_v165:'progress',widget_today_compact_v184:'today',widget_control_v187:'control',widget_compact_grid_v181:'grid',widget_compact_check_v181:'outline'};
 for(const [old,part]of Object.entries(surfaces))xml=xml.replaceAll('@drawable/'+old+'"',drawable(key,part)+'"');return xml;
}
async function graph(name,t,widgetWidth=336){const week=name.startsWith('week'),width=week?Math.round(Math.max(48,Math.min(2048,widgetWidth-16))*2):630,height=week?136:name.startsWith('challenge')?240:150;let s='',empty=name.endsWith('_empty');for(let i=0;i<(name.startsWith('challenge')?30:7);i++){
 if(name.startsWith('challenge')){let x=i%10*63,y=Math.floor(i/10)*80,done=!empty&&i<17;s+=`<rect x="${x+4}" y="${y+4}" width="55" height="72" rx="8" fill="${done?t.accent:t.control}"/>${empty?'':`<text x="${x+31.5}" y="${y+47}" text-anchor="middle" font-family="Malgun Gothic" font-size="20" fill="${done?'white':t.muted}">${done?'✓':i+1}</text>`}`;continue;}
 const x=width/7*(i+.5),h=[65,106,80,106,80,53,53][i],done=!empty&&i<5;s+=(week?`<circle cx="${x}" cy="42" r="${Math.min(24,width/7*.32)}" fill="${done?t.accent:t.control}"/><text x="${x}" y="49" text-anchor="middle" font-family="Malgun Gothic" font-size="20" fill="${done?'white':t.muted}">${done?'✓':'·'}</text>`:`<rect x="${x-13}" y="8" width="26" height="110" rx="6" fill="${t.control}"/>${empty?'':`<rect x="${x-13}" y="${118-h}" width="26" height="${h}" rx="6" fill="${t.accent}"/>`}`)+`<text x="${x}" y="${week?108:145}" text-anchor="middle" font-family="Malgun Gothic" font-size="20" fill="${t.muted}">${['월','화','수','목','금','토','일'][i]}</text>`;
 }return sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${s}</svg>`)).png().toBuffer();}
async function main(){for(const [key,t]of Object.entries(themes)){
 const target=path.join(qa,key);fs.mkdirSync(target,{recursive:true});const images={...base.images};
 for(const name of ['week','week_empty','bars','bars_empty','challenge','challenge_empty']){const data=await graph(name,t),id='widget_fixture_'+name+'_v189';images[id]='data:image/png;base64,'+data.toString('base64');if(key==='system'&&!name.endsWith('_empty'))fs.writeFileSync(path.join(res,'drawable-nodpi',id+'.png'),data);}
 for(const width of [220,672])for(const name of ['week','week_empty']){const data=await graph(name,t,width);images['widget_fixture_'+name+'_'+width+'_v190']='data:image/png;base64,'+data.toString('base64');}
 const specs=base.specs.map(source=>{const name=source.native?source.name:source.name.replace('_v189','_v190');let xml=themedXML(source.xml,key);if(source.width!==336)for(const graphName of ['week','week_empty'])xml=xml.replaceAll('widget_fixture_'+graphName+'_v189','widget_fixture_'+graphName+'_'+source.width+'_v190');const spec={...source,name,theme:key,xml,destination:key==='system'&&source.native?source.destination:path.join(target,name+'.png')};if(key==='system'&&source.native)fs.writeFileSync(path.join(res,'layout',name+'.xml'),'<?xml version="1.0" encoding="utf-8"?>\n'+spec.xml);return spec;});
 fs.writeFileSync(path.join(target,'fixtures.json'),JSON.stringify({manifest:{...base.manifest,version:190,theme:key},specs,drawables:base.drawables,images}));
 }console.log(JSON.stringify({count:base.specs.length*5,themes:Object.keys(themes),qa}));}
main().catch(error=>{console.error(error);process.exitCode=1;});
