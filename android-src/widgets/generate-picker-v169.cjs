/* Build-only launcher preview fixtures. Never runs a browser or writes user data.
 * Native previewLayout embeds the SAME production row XML; previewImage is a CUA
 * capture of the XML measurement fixture, not an Android/launcher verification.
 * Run components first, then: node generate-picker-v169.cjs [res] --xml-only
 * Optional --serve [--port=8793] serves the isolated capture fixture and manifest.
 */
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),http=require('node:http');
const args=process.argv.slice(2),res=path.resolve(args.find(v=>!v.startsWith('--'))||path.join(__dirname,'res'));
const qaDir=path.resolve(process.env.WIDGET_V169_QA||'C:/AiderLogBuild/qa-widget-v169-picker');
const ns='xmlns:android="http://schemas.android.com/apk/res/android"';
const esc=v=>String(v??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\n','&#10;');
const read=(dir,name)=>fs.readFileSync(path.join(res,dir,name+'.xml'),'utf8').replace(/<\?xml[^>]+>/,'').trim();
const write=(dir,name,value)=>fs.writeFileSync(path.join(res,dir,name+'.xml'),'<?xml version="1.0" encoding="utf-8"?>\n'+value+'\n');
function attrs(tag,values){for(const[k,v]of Object.entries(values)){const rx=new RegExp('android:'+k+'="[^"]*"');tag=rx.test(tag)?tag.replace(rx,`android:${k}="${esc(v)}"`):tag.replace(/(\/?>)$/,` android:${k}="${esc(v)}"$1`);}return tag;}
function el(xml,id,values){return xml.replace(new RegExp('<[A-Za-z]+\\b[^>]*android:id="@\\+?id/'+id+'"[^>]*>'),tag=>attrs(tag,values));}
function text(value,size=13,extra=''){return `<TextView android:layout_width="match_parent" android:layout_height="wrap_content" android:text="${esc(value)}" android:textSize="${size}sp" android:textColor="#171A3A" ${extra}/>`;}
function stripNamespace(xml){return xml.replace(/\s+xmlns:android="[^"]*"/g,'');}
function horizontal(items,extra=''){return `<LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:baselineAligned="false" ${extra}>${items.map(stripNamespace).join('')}</LinearLayout>`;}
function cell(xml){return xml.replace(/<(?:FrameLayout|LinearLayout)\b[^>]*>/,tag=>attrs(tag,{layout_width:'0dp',layout_weight:'1'}));}
function stack(items){return `<LinearLayout android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content" android:orientation="vertical">${items.map(stripNamespace).join('')}</LinearLayout>`;}
const divider='<TextView android:layout_width="1dp" android:layout_height="match_parent" android:layout_marginLeft="11dp" android:layout_marginRight="11dp" android:background="#DED9FF"/>';
function split(left,right){return horizontal([stack(left),divider,stack(right)]);}

// Retain only the existing build-time DEMO constructors. Their old launch/write
// section is NEVER executed; no Playwright dependency and no runtime generator.
function legacyFixtureConstructors(){
  let source=fs.readFileSync(path.join(__dirname,'generate-picker-v165.cjs'),'utf8');
  const end=source.indexOf('for(const conf of Object.values(configs))');
  if(end<0)throw Error('Preview fixture boundary changed; review before regenerating.');
  source=source.slice(0,end).replace(/const \{chromium\}=require\([^\n]+\);\n/,'');
  source=source.replace(/function graphSvg\([\s\S]*?\nfunction component\(/,graphSvg.toString()+'\nfunction component(');
  source=source.replace("'widget_demo_graph_v165_'","'widget_demo_graph_v169_'");
  // Both inbody and exercise trend samples use the real compact native row.
  // Weekly/overall statistics retain their existing large chart component.
  const componentRead="let xml=read('layout',`widget_${type}_v165${cell?'_cell':''}`);";
  if(!source.includes(componentRead))throw Error('Review preview component resource routing before regenerating.');
  source=source.replace(componentRead,"const template=type==='stats'&&fields.graph?.[0]==='trend'?'trend_v169':type+'_v165';let xml=read('layout',`widget_${template}${cell?'_cell':''}`);");
  // Seven numbered nodes match the current native challengeNodes renderer.
  source=source.replace("meta:`DAY ${done} / 30`,percent:done/30*100,body:detail?'60초 · 4일 연속':'',...(detail?{graph:['nodes',Array.from({length:30},(_,i)=>i<done)]}:{})",
    "meta:`DAY ${done} / ${detail?7:30}`,percent:done/(detail?7:30)*100,body:detail?'오늘 목표 60초 · 4일 연속':'',...(detail?{graph:['challengeNodes',Array.from({length:7},(_,i)=>i<done)]}:{})");
  if(source.includes("Array.from({length:30},(_,i)=>i<done)"))throw Error('Challenge preview still has thirty nodes.');
  source+='\nmodule.exports={configs,component,routine,language,memo,todo,challenge,book,workout,meals,notes,todos,routines,languages,challenges,statistics,inbody,workflow,graphJobs};';
  const sandbox={require,__dirname,process:{argv:['node','generator',res]},module:{exports:{}}};
  vm.runInNewContext(source,sandbox,{filename:'build-only-existing-picker-fixtures'});return sandbox.module.exports;
}
// Only graphs are rasterized by Sharp. Text/layout/actions remain native XML.
function graphSvg(type,values,dash=0){
  const primary='#6255E8',soft='#DED9FF',ink='#171A3A';let body='';
  const width=700,height=180,max=Math.max(1,...values.map(Number)),min=Math.min(...values.map(Number));
  const txt=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Malgun Gothic,sans-serif" font-size="23" fill="${ink}">${t}</text>`;
  if(type==='bars')values.forEach((n,i)=>{const x=100*i+50,h=n/max*108;body+=`<rect x="${x-22}" y="30" width="44" height="108" fill="${soft}"/><rect x="${x-22}" y="${138-h}" width="44" height="${h}" fill="${primary}"/>`+txt(x,Math.max(24,130-h),n)+txt(x,170,['월','화','수','목','금','토','일'][i]);});
  else if(type==='trend'){body=`<polyline points="${values.map((n,i)=>`${25+650*i/Math.max(1,values.length-1)},${140-(n-min)/Math.max(.01,max-min)*100}`).join(' ')}" fill="none" stroke="${primary}" stroke-width="4" ${dash?`stroke-dasharray="${dash===1?'16 9':'4 9'}"`:''}/>`;}
  else values.slice(0,7).forEach((done,i)=>{const x=100*i+50,y=65;if(type==='stars'){if(i)body+=`<line x1="${x-75}" y1="${y}" x2="${x-25}" y2="${y}" stroke="${primary}" stroke-width="3" ${values[i-1]&&done?'':'stroke-dasharray="7 7"'}/>`;body+=`<polygon points="${Array.from({length:10},(_,j)=>{const r=j%2?13:29,a=-Math.PI/2+j*Math.PI/5;return `${x+Math.cos(a)*r},${y+Math.sin(a)*r}`;}).join(' ')}" fill="${done?primary:'none'}" stroke="${primary}" stroke-width="3"/>`+txt(x,145,['월','화','수','목','금','토','일'][i]);}else body+=`<circle cx="${x}" cy="${y}" r="26" fill="${done?primary:'none'}" stroke="${primary}" stroke-width="3"/>`+txt(x,145,type==='challengeNodes'?i+1+dash:['월','화','수','목','금','토','일'][i]);});
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}
function header(title,{add=false,pager=false}={}){
  if(!title&&!add&&!pager)return '';
  const button=(label,background=false)=>text(label,25,`android:layout_width="30dp" android:layout_height="30dp" android:gravity="center" ${background?'android:background="@drawable/widget_button_v165"':''}`)
    .replace('android:layout_width="match_parent" ','').replace('android:layout_height="wrap_content" ','');
  const heading=text(title,14,'android:layout_width="0dp" android:layout_weight="1" android:textStyle="bold"').replace('android:layout_width="match_parent" ','');
  return horizontal([heading,...(pager?[button('‹'),button('›')]:[]),...(add?[button('+',true)]:[])],'android:gravity="center_vertical" android:layout_marginBottom="14dp"');
}
function rootXml(conf){return `<FrameLayout ${ns} android:layout_width="match_parent" android:layout_height="match_parent" android:forceDarkAllowed="false" android:contentDescription="위젯 구성 미리보기 · 예시 데이터"><ImageView android:layout_width="match_parent" android:layout_height="match_parent" android:src="@drawable/widget_bg_aurora" android:scaleType="fitXY" android:contentDescription="@null"/><LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical" android:padding="18dp">${header(conf.title||'',conf)}${conf.rows.map(stripNamespace).join('')}</LinearLayout></FrameLayout>`;}

function calendarPreview(kind,width){
  const large=kind==='calendar_split',monthOnly=kind==='calendar_month',agenda=kind==='calendar_agenda',fortnight=kind==='calendar_fortnight',wide=width>=560;
  const only=large||monthOnly,title=agenda?'9월 6일 일요일 · 3건':fortnight?'08.31 – 09.13':'2026. 09';
  const rows=['09:30 팀 미팅','14:00 병원 예약','19:30 공부'].map(line=>el(el(read('layout','widget_item_v164'),'widget_item_time_v165',{text:line.slice(0,5)}),'widget_item_text_v164',{text:line.slice(6)}));
  if(agenda)return rootXml({title,add:true,rows}); // No duplicate selected-date subtitle.
  let weekday=read('layout','widget_weekrow_v164');
  if(fortnight)for(let i=0;i<7;i++)weekday=el(weekday,'widget_week_'+i,{text:['월','화','수','목','금','토','일'][i]});
  const dates=new Date(2026,7,fortnight?31:30),weeks=fortnight?2:5,calendar=[weekday];
  const events={'2026-09-06':['09:30 팀 미팅','14:00 병원 예약','19:30 공부'],'2026-09-08':['10:00 자료 검토'],'2026-09-11':['16:00 운동']};
  const holidays={'2026-09-24':'추석연휴','2026-09-25':'추석','2026-09-26':'추석연휴','2026-10-03':'개천절'};
  for(let week=0;week<weeks;week++){
    const cells=[];
    for(let day=0;day<7;day++){
      const key=`${dates.getFullYear()}-${String(dates.getMonth()+1).padStart(2,'0')}-${String(dates.getDate()).padStart(2,'0')}`,entries=events[key]||[],selected=key==='2026-09-06',visible=large?(wide?2:1):0;
      let xml=read('layout','widget_day_v164');
      xml=el(xml,'widget_day_number_v164',{text:dates.getDate(),textColor:'#171A3A',layout_height:'22dp',background:'@drawable/'+(selected?'widget_day_selected_v164':'widget_day_clear_v164')});
      xml=el(xml,'widget_day_label_v164',{text:holidays[key]||'',visibility:holidays[key]?'visible':'gone',layout_height:'14dp'});
      xml=el(xml,'widget_day_events_v164',{text:entries.slice(0,visible).join('\n'),visibility:large?'visible':'gone'});
      xml=el(xml,'widget_day_more_v164',{text:large&&entries.length>visible?'+'+(entries.length-visible):entries.length&&!large?'●':'',visibility:entries.length?'visible':'gone'});
      cells.push(xml);dates.setDate(dates.getDate()+1);
    }
    calendar.push(horizontal(cells,`android:layout_height="${large?92:44}dp"`).replace('android:layout_height="wrap_content" ',''));
  }
  const chosen=[text('9월 6일 일요일 · 3건',12,'android:layout_marginTop="10dp" android:layout_marginBottom="8dp"'),...rows];
  const body=only?calendar:wide?[split(calendar,chosen)]:[...calendar,...chosen];
  return rootXml({title,add:true,pager:!fortnight,rows:body});
}

async function generate(){
  fs.mkdirSync(qaDir,{recursive:true});
  const f=legacyFixtureConstructors(),{configs,component,routine,challenge,book,workout,meals,notes,todos,routines,challenges,statistics,inbody,workflow}=f;
  configs.personal_workflow_one.title='최근 수정순';
  configs.personal_workflow_all.title='1 / 3 완료';
  configs.routine_cards={rows:[routine('아침 스트레칭',12,true)],title:'9월 6일 일요일'};
  configs.personal_challenge={rows:[challenge('플랭크',4,true)]};
  configs.personal_workout_challenge_combined={rows:[challenge('플랭크',4,true),...challenges.filter((_,i)=>i!==2)]};
  configs.personal_quote.rows[0]=['title','meta','body'].reduce((xml,k)=>el(xml,'w165_'+k,{text:{title:'고요한 궤도',meta:'서윤',body:'184 / 296쪽 · 62%'}[k]}),read('layout','widget_book_detail_v168'));
  configs.personal_quote.rows[0]=el(configs.personal_quote.rows[0],'w165_progress',{progress:62});
  // Legacy minHeight is not a preview bitmap height. Keeping 275dp requested a
  // 4/5-row launcher cell even though targetCellHeight said 3 (ignored pre-31).
  // Use consistent legacy grid bounds (70*n-30) and explicit modern grid spans.
  const sizes={
    personal_workflow_one:[2,256],personal_workflow_all:[4,456],personal_todo:[2,272],
    routine_all:[4,460],routine_cards:[3,300],routine_stats:[5,600],
    routine_language:[3,280],routine_language_all:[5,460],language_youtube:[3,280],
    personal_meal:[4,372],personal_workout_meal:[5,500],personal_workout:[2,224],personal_workout_challenge:[4,430],
    personal_challenge:[2,224],personal_workout_challenge_all:[3,310],personal_workout_challenge_combined:[4,440],
    personal_workout_stats:[4,380],personal_workout_stats_inbody:[4,425],personal_reading:[5,520],personal_quote:[4,380],
    personal_today:[6,610],personal_bullet_three_workflow:[6,740],personal_bullet_seven:[5,530],personal_bullet_seven_workflow:[6,670],
    calendar_agenda:[2,238],calendar_combined:[5,520],calendar_fortnight:[4,388],calendar_month:[4,320],calendar_split:[6,570],
    task_client_link:[1,80]
  };
  // Preview images must contain complete sample rows, not clipped labels. This
  // affects only launcher samples: installed collection widgets remain scrollable
  // and use the actual host bounds, never these demonstration bitmap heights.
  const wideHeights={personal_todo:272,routine_cards:264,routine_stats:464,
    routine_language:240,routine_language_all:448,personal_workout_stats:300,personal_workout_stats_inbody:292,
    personal_bullet_seven:408,personal_bullet_seven_workflow:592};
  function wideRows(kind,conf){
    if(kind==='personal_workflow_one')return [horizontal(notes.map(cell))];
    if(kind==='personal_workflow_all')return [split(notes,todos)];
    if(kind==='routine_all')return [horizontal(routines.slice(0,2).map(cell)),horizontal(routines.slice(2).map(cell))];
    if(kind==='routine_stats')return [split(routines,[statistics])];
    if(kind==='personal_meal')return [horizontal(['08:10','12:20','18:30','15:10'].map(time=>component('meal_slot',{time,rating:'★★★★☆'},true)))];
    if(kind==='personal_workout_meal')return [split(meals(),[workout()])];
    if(kind==='personal_reading')return [horizontal([book('고요한 궤도','서윤',62,true),book('작은 기록들','한별',25,true),book('생각의 방식','지우',100,true),book('천천히 읽기','민서',40,true)])];
    if(kind==='personal_quote')return [split(conf.rows.slice(0,1),conf.rows.slice(1))];
    if(kind==='personal_workout_challenge_all')return [horizontal(challenges.slice(0,2).map(cell)),horizontal(challenges.slice(2).map(cell))];
    if(kind==='personal_workout_challenge_combined')return [split([challenge('플랭크',4,true)],challenges.filter((_,i)=>i!==2))];
    if(kind==='personal_workout_stats_inbody')return [split(challenges,inbody)];
    if(kind==='personal_workout_stats')return [split(conf.rows.slice(0,1),conf.rows.slice(1))];
    if(kind==='personal_today'||kind.startsWith('personal_bullet')){const seven=kind.includes('seven'),flow=kind.includes('workflow'),days=seven?['월 31','화 1','수 2','목 3','금 4','토 5','일 6']:['일 6','월 7','화 8'];return [horizontal(days.map((day,i)=>component('day',{title:day,body:i%2?'운동 42분':'09:30 팀 미팅\n독서 기록'},true))),split(flow?[...notes,...todos]:notes,flow?[workflow]:todos)];}
    return conf.rows;
  }
  const specs=[];
  for(const kind of Object.keys(sizes)){
    const [span,height]=sizes[kind],name=`widget_picker_${kind}_${kind==='task_client_link'?'v168':'v164'}`;
    if(kind==='task_client_link'){
      write('layout',name,read('layout','widget_client_link_v168'));
      specs.push({kind,name,width:80,height,xml:read('layout',name),native:true,destination:path.join(res,'drawable-nodpi',name+'.png')});
    }else{
      const calendar=kind.startsWith('calendar_'),conf=configs[kind];
      const xml=calendar?calendarPreview(kind,336):rootXml(conf);
      write('layout',name,xml);specs.push({kind,name,width:336,height,xml,native:true,destination:path.join(res,'drawable-nodpi',name+'.png')});
      const wideHeight=wideHeights[kind]||(kind==='calendar_month'?320:kind==='calendar_split'?570:kind==='calendar_combined'?370:kind==='calendar_fortnight'?270:Math.min(height,Math.max(224,height*.72)));
      const wideName=`widget_picker_${kind}_v169_wide`,wideXml=calendar?calendarPreview(kind,672):rootXml({...conf,pager:false,rows:wideRows(kind,conf)});
      specs.push({kind,name:wideName,width:672,height:Math.ceil(wideHeight),xml:wideXml,native:false,destination:path.join(qaDir,wideName+'.png')});
    }
    let meta=read('xml','widget_'+kind);
    const initial=meta.match(/android:initialLayout="([^"]+)"/)?.[1];
    meta=meta.replace(/<appwidget-provider\b[^>]*>/,tag=>attrs(tag,{minWidth:kind==='task_client_link'?'40dp':'250dp',minHeight:(Math.max(40,span*70-30))+'dp',targetCellWidth:kind==='task_client_link'?'1':'4',targetCellHeight:span,previewImage:'@drawable/'+name,previewLayout:'@layout/'+name}));
    if(meta.match(/android:initialLayout="([^"]+)"/)?.[1]!==initial)throw Error('Do not replace runtime initialLayout with sample data.');
    write('xml','widget_'+kind,meta);
  }
  const sharp=require(process.env.WIDGET_SHARP_MODULE||'C:/Users/김보민/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
  for(const graph of f.graphJobs)await sharp(Buffer.from(graph.svg)).png().toFile(path.join(res,'drawable-nodpi',graph.name+'.png'));
  const drawables={},images={};
  for(const file of fs.readdirSync(path.join(res,'drawable')).filter(n=>n.endsWith('.xml')))drawables[file.slice(0,-4)]=read('drawable',file.slice(0,-4));
  for(const graph of f.graphJobs)images[graph.name]='data:image/png;base64,'+fs.readFileSync(path.join(res,'drawable-nodpi',graph.name+'.png')).toString('base64');
  const manifest={version:169,demoOnly:true,renderer:'Native XML measurement fixture; PNG is not an Android screenshot',res,specs:specs.map(({xml,...s})=>s)};
  const bundle={manifest,specs,drawables,images};fs.writeFileSync(path.join(qaDir,'manifest.json'),JSON.stringify(manifest,null,2));fs.writeFileSync(path.join(qaDir,'fixtures.json'),JSON.stringify(bundle));
  console.log(JSON.stringify({native:specs.filter(s=>s.native).length,wide:specs.filter(s=>!s.native).length,graphs:f.graphJobs.length,manifest:path.join(qaDir,'manifest.json')}));
  return bundle;
}

// Tiny read-only local server. No writes, authentication, production data or
// browser automation; CUA navigates/captures the resulting DOM externally.
function serve(bundle){
  const port=Number(args.find(a=>a.startsWith('--port='))?.split('=')[1]||8793);
  const html=fs.readFileSync(path.join(__dirname,'picker-fixture-v169.html'));
  http.createServer((req,res)=>{const u=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');if(req.method!=='GET'){res.writeHead(405);return res.end();}if(u.pathname==='/fixtures.json'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(bundle));}if(u.pathname==='/manifest.json'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(bundle.manifest));}if(u.pathname!=='/'){res.writeHead(404);return res.end();}res.setHeader('Content-Type','text/html; charset=utf-8');res.end(html);}).listen(port,'127.0.0.1',()=>console.log('Picker fixture: http://127.0.0.1:'+port+'/?name=widget_picker_personal_challenge_v164'));
}
if(require.main===module)generate().then(bundle=>{if(args.includes('--serve'))serve(bundle);}).catch(error=>{console.error(error);process.exitCode=1;});
module.exports={generate,graphSvg,calendarPreview,rootXml,attrs};
