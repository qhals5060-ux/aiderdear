'use strict';
// Explicit demo records for launcher artwork only. Never bundled into a live snapshot.
exports.render=function(kind,width,height,{read,el,fillContainer}){
 const mini=kind==='calendar_combined',agenda=kind==='calendar_agenda',fortnight=kind==='calendar_fortnight',todos=agenda||kind==='calendar_split';
 const ratio=mini?.76:agenda?.95:fortnight?.80:todos?1.44:1.20;height=height||Math.round(width*ratio);
 let xml=read('layout',mini?'widget_split_compact_v184':agenda?'widget_agenda_compact_v184':'widget_month_compact_v184');
 xml=el(xml,'widget_root',{contentDescription:'AiderLog 위젯 구성 · 예시 데이터'});
 xml=el(xml,'widget_title',{text:agenda?'일정 · 투두':fortnight?'9.20 — 10.3':'2026. 09'});
 xml=el(xml,'w184_caption',{text:agenda?'9.20부터':mini?'다가오는 일정':fortnight?'2주':todos?'일정 · 투두':'일정'});
 const demo=[['9.20','팀 미팅','09:30'],['9.20','자료 검토','11:00'],['9.21','병원 예약','14:00'],['9.22','운동','16:00'],['9.23','저녁 약속','18:30'],['9.24','가족 모임','12:00']];
 if(mini||agenda){
  xml=el(xml,'widget_items_v164',{visibility:'gone'});
  const visible=Math.max(1,Math.floor((height-42)*(agenda?.5:1)/27));
  xml=fillContainer(xml,'widget_preview_rows_v164',demo.slice(0,visible).map(([date,title,time],i)=>{
   let row=read('layout','widget_upcoming_inline_v186');row=el(row,'w184_event_date',{text:date});row=el(row,'w184_event_title',{text:title});row=el(row,'w184_event_time',{text:time});return el(row,'w184_event_mark',{background:['#7561DC','#5D83D5','#BD75B8'][i%3]});
  }));
 }
 if(!mini&&!agenda)xml=el(xml,'w184_todo_panel',{visibility:todos?'visible':'gone'});
 if(todos){
  xml=el(xml,'w165_secondary_list',{visibility:'gone'});
  const visible=Math.max(1,Math.floor(((height-42)*(agenda?.5:.25)-20)/29));
  xml=fillContainer(xml,'w181_todo_preview',['발표 자료 준비','메일 회신하기','전시회 티켓 예매','여행 짐 챙기기','책 20쪽 읽기'].slice(0,visible).map((title,i)=>{
   let row=el(read('layout','widget_todo_row_v184'),'w184_todo_title',{text:title});return el(row,'w184_todo_due',{text:i===2?'':'9.'+(21+i),visibility:i===2?'gone':'visible'});
  }));
 }
 if(!agenda){
  const dates=new Date(2026,fortnight?8:7,fortnight?20:30),weeks=fortnight?2:5,calendar=[read('layout','widget_weekdays_compact_v184')];
  const events={1:['월간 계획'],3:['자료 검토'],5:['운동'],7:['팀 미팅','병원 예약'],8:['자료 정리'],10:['기획 회의'],12:['독서 모임'],14:['주간 미팅'],15:['친구 약속'],17:['자료 검토'],19:['장보기'],20:['팀 미팅','자료 검토'],21:['병원 예약'],22:['운동','저녁 약속'],23:['최종 검토','자료 전달'],24:['가족 모임'],25:['추석','휴식'],26:['귀가'],28:['업무 시작'],30:['월말 정리']};
  const holidays={24:'추석연휴',25:'추석',26:'추석연휴'};
  const cellHeight=((height-42)*(todos?.75:1)-16)/weeks,size=width>=500?11.5:10;
  for(let w=0;w<weeks;w++){
   const cells=[];
   for(let c=0;c<7;c++){
    const n=dates.getDate(),inMonth=dates.getMonth()===8,entries=inMonth?events[n]||[]:[],holiday=inMonth?holidays[n]||'':dates.getMonth()===9&&n===3?'개천절':'';
    let cell=read('layout',mini?'widget_mini_day_v184':'widget_event_day_v184');
    cell=el(cell,'w184_day',{text:n,background:'@drawable/'+(inMonth&&n===20?'widget_today_compact_v184':'widget_day_clear_v164'),textColor:inMonth&&n===20?'#FFFFFF':!inMonth?'#A9A2B5':c===0||holiday?'#AA6077':c===6?'#6080BC':'#171A3A'});
    if(mini)cell=el(cell,'w184_dots',{text:entries.length>1?'••':entries.length?'•':'',textColor:'#6255E8'});
    else{
     cell=el(cell,'w184_holiday',{text:holiday,visibility:holiday&&cellHeight>=45?'visible':'gone'});
     const slots=Math.max(1,Math.min(6,Math.floor((cellHeight-22-(holiday&&cellHeight>=45?12:0))/Math.max(13,size*1.2+4))));
     const visible=Math.min(entries.length,entries.length>slots&&slots>1?slots-1:slots);
     cell=fillContainer(cell,'w184_events',entries.slice(0,visible).map((title,i)=>el(read('layout','widget_event_chip_v184'),'w184_event_title',{text:title,textSize:size+'sp',background:['#EAE3F7','#E4EBF8','#F2E3F0'][i%3]})));
     cell=el(cell,'w184_more',{text:entries.length>visible?'+'+(entries.length-visible):'',visibility:entries.length>visible&&slots>1?'visible':'gone'});
    }
    cells.push(cell);dates.setDate(n+1);
   }
   calendar.push(fillContainer(read('layout','widget_week_v164'),'widget_week_cells_v164',cells));
  }
  xml=fillContainer(xml,'widget_calendar_v164',calendar);
 }
 return xml;
};
