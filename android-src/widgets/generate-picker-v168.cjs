/* v13 picker/QA generation from production XML. These renders are NOT Android screenshots. */
const fs=require('node:fs'),path=require('node:path');
let source=fs.readFileSync(path.join(__dirname,'generate-picker-v165.cjs'),'utf8');
const replace=(from,to)=>{if(!source.includes(from))throw Error('Generator integration changed: '+from.slice(0,70));source=source.replace(from,to)};
replace("textColor:chosen?'#FFFFFF':days.getMonth()===8?'#171A3A':'#AAA9B7'","textColor:'#171A3A'");
replace("const days=new Date(2026,fortnight?8:7,fortnight?6:30)","const days=new Date(2026,fortnight?7:7,fortnight?31:30)");
replace("const visible=large?(width>=560?2:1):0;","const visible=large?(width>=560?2:1):0;");
replace("const specs=Object.entries(configs).map(([kind,conf])=>({kind,name:`widget_picker_${kind}_v164`,width:320,height:conf.height}));","const specs=Object.entries(configs).map(([kind,conf])=>({kind,name:`widget_picker_${kind}_v164`,width:336,height:conf.height}));");
replace("specs.push(...calendarSpecs.map(([kind,width,height])=>({kind,name:`widget_picker_${kind}_v164`,width,height})));",`specs.push(...calendarSpecs.map(([kind,width,height])=>({kind,name:\`widget_picker_\${kind}_v164\`,width:336,height})));
const qaDir=path.resolve(process.env.WIDGET_V168_QA||'C:/AiderLogBuild/qa-widget-v168');fs.mkdirSync(qaDir,{recursive:true});
function cell(xml){return xml.replace(/(<(?:FrameLayout|LinearLayout)\\b[^>]*?)android:layout_width="(?:match_parent|0dp)"/, '$1android:layout_width="0dp" android:layout_weight="1"').replace(/android:layout_weight="1"([^>]*?)android:layout_weight="1"/,'android:layout_weight="1"$1');}
const stack=items=>'<LinearLayout android:layout_width="0dp" android:layout_weight="1" android:layout_height="wrap_content" android:orientation="vertical" android:layout_margin="7dp">'+items.join('')+'</LinearLayout>';
function wideRows(kind,conf){
 if(kind==='personal_workflow_one')return [row(notes.map(cell))];
 if(kind==='personal_workflow_all')return [row([stack(notes),stack(todos)])];
 if(kind==='routine_all')return [row(routines.slice(0,2).map(cell)),row(routines.slice(2).map(cell))];
 if(kind==='routine_stats')return [row([stack(routines),stack([statistics])])];
 if(kind==='personal_meal')return [row(['08:10','12:20','18:30','15:10'].map(time=>component('meal_slot',{time,rating:'★★★★☆'},true)))];
 if(kind==='personal_workout_meal')return [row([stack(meals()),stack([workout()])])];
 if(kind==='personal_reading')return [row([book('고요한 궤도','서윤',62,true),book('작은 기록들','한별',25,true),book('생각의 방식','지우',100,true),book('천천히 읽기','민서',40,true)])];
 if(kind==='personal_quote')return [row(conf.rows.map(cell))];
 if(kind==='personal_workout_challenge_all')return [row(challenges.slice(0,2).map(cell)),row(challenges.slice(2).map(cell))];
 if(kind==='personal_workout_challenge_combined')return [row([stack([challenge('플랭크',7,true)]),stack(challenges.filter((_,i)=>i!==2))])];
 if(kind==='personal_workout_stats_inbody')return [row([stack(challenges),stack(inbody)])];
 if(kind==='personal_workout_stats')return [row(conf.rows.map(cell))];
 if(kind==='personal_today'||kind.startsWith('personal_bullet')){const seven=kind.includes('seven'),withFlow=kind.includes('workflow'),days=seven?['월 31','화 1','수 2','목 3','금 4','토 5','일 6']:['일 6','월 7','화 8'];return [row(days.map((day,i)=>component('day',{title:day,body:i%2?'운동 42분':'09:30 팀 미팅\\n독서 기록'},true))),row([stack(withFlow?[...notes,...todos]:notes),stack(withFlow?[workflow]:todos)])];}
 return conf.rows;
}
for(const [kind,conf] of Object.entries(configs)){const wide={...conf,rows:wideRows(kind,conf),pager:false};specs.push({kind,name:'widget_picker_'+kind+'_v168_wide',width:672,height:Math.min(600,Math.max(320,conf.height)),xml:rootXml(wide),qaOnly:true});}
for(const [kind,,height]of calendarSpecs)specs.push({kind,name:'widget_picker_'+kind+'_v168_wide',width:672,height:Math.max(320,height),xml:calendarPreview(kind,672,Math.max(320,height)),qaOnly:true});
write('layout','widget_picker_task_client_link_v168',read('layout','widget_client_link_v168'));
specs.push({kind:'task_client_link',name:'widget_picker_task_client_link_v168',width:80,height:80});
let linkMeta=read('xml','widget_task_client_link');linkMeta=linkMeta.replace('/>',' android:previewImage="@drawable/widget_picker_task_client_link_v168"/>');write('xml','widget_task_client_link',linkMeta);
`);
replace("const xml=read('layout',spec.name);","const xml=spec.xml||read('layout',spec.name);");
replace("path:path.join(res,'drawable-nodpi',spec.name+'.png')","path:path.join(spec.qaOnly?qaDir:path.join(res,'drawable-nodpi'),spec.name+'.png')");
replace("report.push({...spec,...result});","if(!spec.qaOnly)fs.copyFileSync(path.join(res,'drawable-nodpi',spec.name+'.png'),path.join(qaDir,spec.name+'.png'));report.push({...spec,xml:undefined,...result});");
replace("path.join(__dirname,'preview-report-v165.json')","path.join(qaDir,'report.json')");
new Function('require','__dirname','process',source)(require,__dirname,process);
