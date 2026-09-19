package com.aiderlog.v22app;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Paint;
import android.net.Uri;
import android.util.DisplayMetrics;
import android.util.TypedValue;
import android.view.View;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import static com.aiderlog.v22app.WidgetNativeV164.*;

/** Five compact, live RemoteViews calendars. Sample data exists only in picker fixtures. */
public final class WidgetCompactCalendarV181 {
    static boolean supports(String kind) {
        String base=WidgetDesignV165.base(kind);
        return "CalendarAgenda".equals(base)||"CalendarFortnight".equals(base)||"CalendarCombined".equals(base)||"CalendarMonth".equals(base)||"CalendarSplit".equals(base);
    }
    static JSONObject copy(JSONObject value) {try{return new JSONObject(value.toString());}catch(Exception ignored){return new JSONObject();}}
    static boolean dateKey(String value){return value!=null&&value.matches("\\d{4}-\\d{2}-\\d{2}");}
    static List<String> scheduleRows(JSONArray values,String selected) {return eventRows(values,selected,false);}
    static List<String> upcomingRows(JSONArray values,String from) {return eventRows(values,from,true);}
    static List<String> eventRows(JSONArray values,final String selected,boolean upcoming) {
        List<String> out=new ArrayList<String>();
        for(int i=0;values!=null&&i<values.length();i++) {
            JSONObject value=values.optJSONObject(i);if(value==null||value.optString("title").trim().isEmpty())continue;
            String start=value.optString("date"),end=value.optString("endDate",start);if(end.isEmpty())end=start;
            if(!dateKey(start)||!dateKey(end)||end.compareTo(start)<0||selected.compareTo(end)>0||(!upcoming&&selected.compareTo(start)<0))continue;
            JSONObject row=copy(value);WidgetDesignV165.put(row,"kind","schedule");
            WidgetDesignV165.put(row,"selectedDate",start.compareTo(selected)<0?selected:start);out.add(row.toString());
        }
        Collections.sort(out,new Comparator<String>(){public int compare(String a,String b){
            try{JSONObject left=new JSONObject(a),right=new JSONObject(b);
                int result=left.optString("selectedDate").compareTo(right.optString("selectedDate"));
                if(result==0)result=time(left).compareTo(time(right));
                return result!=0?result:left.optString("title").compareTo(right.optString("title"));
            }catch(Exception ignored){return 0;}
        }});
        return out;
    }
    static String time(JSONObject row) {String value=row.optString("time");return row.optBoolean("allDay")||!value.matches("\\d{2}:\\d{2}.*")?"":value.substring(0,5);}
    static String cellTime(JSONObject row){String value=time(row);return value.startsWith("0")?value.substring(1):value;}
    static String shortDate(String value){if(!dateKey(value))return "";return Integer.parseInt(value.substring(5,7))+"."+Integer.parseInt(value.substring(8,10));}
    static List<String> incompleteRows(JSONObject data,boolean pairs) {
        JSONObject model=WidgetDesignV165.model(data);JSONArray values=model.optJSONArray("incompleteTodos");if(values==null)values=model.optJSONArray("todos");
        List<String> out=new ArrayList<String>();Set<String> seen=new HashSet<String>();JSONArray pending=new JSONArray();
        for(int i=0;values!=null&&i<values.length();i++) {
            JSONObject value=values.optJSONObject(i);if(value==null||value.optBoolean("done")||value.optString("id").isEmpty()||value.optString("title").trim().isEmpty()||!seen.add(value.optString("id")))continue;
            JSONObject row=copy(value);WidgetDesignV165.put(row,"kind","todo");if(pairs)pending.put(row);else out.add(row.toString());
        }
        for(int i=0;pairs&&i<pending.length();i+=2) {
            JSONObject group=WidgetDesignV165.card("todoPair");JSONArray children=new JSONArray();children.put(pending.optJSONObject(i));if(i+1<pending.length())children.put(pending.optJSONObject(i+1));
            WidgetDesignV165.put(group,"children",children);out.add(group.toString());
        }
        return out;
    }
    static List<String> rows(Context c,int widget,String kind,JSONObject data) {
        List<String> values=kind.contains("@todos")?incompleteRows(data,false):upcomingRows(data.optJSONArray("scheduleItems"),selectedDay(c,widget,kind));
        String owner=owner(data);List<String> bound=new ArrayList<String>();
        for(String value:values)try{JSONObject row=new JSONObject(value);WidgetDesignV165.put(row,"_widgetOwnerV181",owner);bound.add(row.toString());}catch(Exception ignored){}
        return bound;
    }
    static String owner(JSONObject data){return WidgetDesignV165.model(data).optString("uid",data.optString("uid"));}
    static boolean sameOwner(String captured,JSONObject data){return captured!=null&&captured.equals(owner(data));}
    static String fortnightStart(String today){Calendar start=date(today);start.add(Calendar.DAY_OF_MONTH,1-start.get(Calendar.DAY_OF_WEEK));return day(start);}
    static String fortnightSelected(String today,String stored){String start=fortnightStart(today);Calendar end=date(start);end.add(Calendar.DAY_OF_MONTH,13);return dateKey(stored)&&stored.compareTo(start)>=0&&stored.compareTo(day(end))<=0?stored:today;}
    static String selectedDay(Context c,int widget,String kind){Calendar today=Calendar.getInstance();if("CalendarAgenda".equals(WidgetDesignV165.base(kind)))today.add(Calendar.DAY_OF_MONTH,prefs(c).getInt("widget_agenda_offset_"+widget,0));return day(today);}
    static int opacity(Context c,int widget,int override) {return Math.max(0,Math.min(100,override<0?prefs(c).getInt("widget_opacity_"+widget,100):override));}
    static int eventColor(JSONObject row) {
        String value=row.optString("color");if(value.matches("#[0-9a-fA-F]{6}"))try{return Color.parseColor(value);}catch(Exception ignored){}
        int[] palette={0xff7561dc,0xff5d83d5,0xffbd75b8,0xff9080d1};return palette[(row.optString("id",row.optString("title")).hashCode()&0x7fffffff)%palette.length];
    }
    static int softColor(int value,boolean night){return (night?0x50000000:0x22000000)|(value&0x00ffffff);}
    // Secondary labels stay opaque and readable when the widget background is transparent.
    static int secondaryInk(Context c,String chosen){return dark(c,chosen)?0xffc7bfd8:0xff716b80;}
    static int capacity(float cellHeight,float lineHeight,boolean holiday){return Math.max(0,Math.min(6,(int)((cellHeight-(cellHeight<32?13:22)-(holiday?12:0))/Math.max(13,lineHeight))));}
    static boolean small(float width,float height){return width<240||height<200;}
    static float cellHeight(String kind,float width,float height,int weeks){return Math.max(1,((height-(small(width,height)?32:42))*("CalendarSplit".equals(kind)?.75f:1)-(small(width,height)?12:16))/Math.max(1,weeks));}
    static boolean smallRows(String kind,float width,float height){float pane="CalendarCombined".equals(WidgetDesignV165.base(kind))?(width-17)*.52f:width-12;return pane<150||height<200;}
    static float eventPaneWidth(String kind,float width,float height){float inside=Math.max(0,width-(small(width,height)?8:12));return "CalendarCombined".equals(WidgetDesignV165.base(kind))?Math.max(0,(inside-.5f)*.52f-5):inside;}
    static boolean inlineEventRow(float pane,float dateWidth,float timeWidth,float titleSize,float fontScale){return pane>=16+dateWidth+timeWidth+Math.max(38,4*titleSize*Math.max(1,fontScale));}
    static String eventTimeLabel(JSONObject row){String value=time(row);return value.isEmpty()?"종일":value;}
    static float ratio(String kind){return "CalendarCombined".equals(kind)?.76f:"CalendarAgenda".equals(kind)?.95f:"CalendarFortnight".equals(kind)?.80f:"CalendarSplit".equals(kind)?1.44f:1.20f;}
    static Calendar calendarStart(Context c,int widget,String kind){
        Calendar start=Calendar.getInstance();
        if("CalendarFortnight".equals(kind)){start=date(fortnightStart(day(start)));start.add(Calendar.DAY_OF_MONTH,14*prefs(c).getInt("widget_fortnight_offset_"+widget,0));}
        else{start.set(Calendar.DAY_OF_MONTH,1);start.add(Calendar.MONTH,prefs(c).getInt("widget_month_"+widget,0));}
        return start;
    }
    static RemoteViews render(Context c,int widget,String kind,boolean preview,String overrideTheme,int overrideOpacity,int selectedFont) {
        boolean agenda="CalendarAgenda".equals(kind),mini="CalendarCombined".equals(kind),todos=agenda||"CalendarSplit".equals(kind);
        String chosen=overrideTheme==null?theme(c,widget):overrideTheme;
        float width=WidgetSizeV169.current(c,widget).getWidth(),height=WidgetSizeV169.current(c,widget).getHeight();boolean compact=small(width,height);
        RemoteViews result=view(c,"widget_"+(mini?"split":agenda?"agenda":"month")+(compact?"_small_v185":"_compact_v184"));
        String background="widget_bg_"+("system".equals(chosen)?dark(c,chosen)?"midnight":"aurora":chosen);
        int resource=drawable(c,background);if(resource==0)resource=drawable(c,"widget_bg_aurora");
        result.setImageViewResource(id(c,"widget_background"),resource);result.setInt(id(c,"widget_background"),"setImageAlpha",Math.round(255*opacity(c,widget,overrideOpacity)/100f));
        JSONObject data=snapshot(c);Calendar start=calendarStart(c,widget,kind);String from=selectedDay(c,widget,kind);
        String title=agenda?"일정 · 투두":(start.get(Calendar.YEAR)+". "+String.format(java.util.Locale.US,"%02d",start.get(Calendar.MONTH)+1));
        if("CalendarFortnight".equals(kind)){Calendar end=(Calendar)start.clone();end.add(Calendar.DAY_OF_MONTH,13);title=shortDate(day(start))+" — "+shortDate(day(end));}
        text(c,result,"widget_title",title);text(c,result,"w184_caption",agenda?shortDate(from)+"부터":mini?"다가오는 일정":"CalendarFortnight".equals(kind)?"2주":todos?"일정 · 투두":"일정");
        show(c,result,"w184_caption",width>=300);show(c,result,"widget_previous",width>=180);show(c,result,"widget_next",width>=180);
        for(String key:new String[]{"widget_title","w184_caption","widget_previous","widget_next","w184_today"})color(c,result,key,ink(c,chosen));
        color(c,result,"w184_caption",secondaryInk(c,chosen));
        result.setInt(id(c,"w184_today"),"setBackgroundResource",drawable(c,dark(c,chosen)?"widget_control_dark_v187":"widget_control_v187"));
        result.setInt(id(c,"w187_section_divider"),"setBackgroundColor",dark(c,chosen)?0xff4b455e:0xffe8e3f0);
        result.setTextViewTextSize(id(c,"widget_title"),2,WidgetSizeV169.sp(c,widget,selectedFont,compact?12:14));
        result.setTextViewTextSize(id(c,"w184_caption"),2,Math.max(8.5f,WidgetSizeV169.sp(c,widget,selectedFont,9)));
        result.setOnClickPendingIntent(id(c,"widget_root"),open(c,widget,kind,""));
        result.setOnClickPendingIntent(id(c,"widget_previous"),navigate(c,widget,kind,"month","-1"));result.setOnClickPendingIntent(id(c,"widget_next"),navigate(c,widget,kind,"month","1"));
        result.setOnClickPendingIntent(id(c,"w184_today"),navigate(c,widget,kind,"today","0"));
        result.setContentDescription(id(c,"widget_root"),title+" "+(mini?"왼쪽 월간 캘린더, 오른쪽 다가오는 일정":agenda?"다가오는 일정과 미완료 할 일":todos?"일정이 표시된 월간 캘린더와 미완료 할 일":"일정이 표시된 캘린더"));
        if(!agenda)calendar(c,result,widget,kind,data,chosen,overrideOpacity,selectedFont);
        if(mini||agenda)bind(c,result,widget,kind,rows(c,widget,kind,data),"widget_items_v164","widget_preview_rows_v164","w184_event_empty",preview,chosen,selectedFont,mini?5:6,data);
        if(!mini&&!agenda)show(c,result,"w184_todo_panel",todos);
        if(todos){
            show(c,result,"w184_todo_heading",height>=170);
            color(c,result,"w184_todo_heading",secondaryInk(c,chosen));
            bind(c,result,widget,kind+"@todos",rows(c,widget,kind+"@todos",data),"w165_secondary_list","w181_todo_preview","w184_todo_empty",preview,chosen,selectedFont,agenda?5:4,data);
        }
        return result;
    }
    static void bind(Context c,RemoteViews result,int widget,String kind,List<String> values,String list,String previewHost,String empty,boolean preview,String chosen,int selectedFont,int visible,JSONObject data) {
        show(c,result,list,!preview&&!values.isEmpty());show(c,result,previewHost,preview&&!values.isEmpty());show(c,result,empty,values.isEmpty());
        String access=data.optString("accessState");text(c,result,empty,"needs-login".equals(access)?"앱에서 로그인":"sync-required".equals(access)?"앱에서 동기화":kind.contains("@todos")?"남은 할 일이 없어요":"예정된 일정이 없어요");color(c,result,empty,ink(c,chosen));
        if(preview){result.removeAllViews(id(c,previewHost));for(int i=0;i<Math.min(visible,values.size());i++)result.addView(id(c,previewHost),row(c,widget,kind,values.get(i),i,chosen,selectedFont));}
        else collection(c,result,widget,kind,values,id(c,list));
    }
    static void calendar(Context c,RemoteViews result,int widget,String kind,JSONObject data,String chosen,int overrideOpacity,int selectedFont) {
        boolean mini="CalendarCombined".equals(kind),fortnight="CalendarFortnight".equals(kind),night=dark(c,chosen);
        Calendar start=calendarStart(c,widget,kind);int shownMonth=start.get(Calendar.MONTH),count=fortnight?2:(start.get(Calendar.DAY_OF_WEEK)-1+start.getActualMaximum(Calendar.DAY_OF_MONTH)+6)/7;
        if(!fortnight)start.add(Calendar.DAY_OF_MONTH,1-start.get(Calendar.DAY_OF_WEEK));
        float width=WidgetSizeV169.current(c,widget).getWidth(),height=WidgetSizeV169.current(c,widget).getHeight();boolean compact=small(width,height);
        result.removeAllViews(id(c,"widget_calendar_v164"));RemoteViews weekdays=view(c,compact?"widget_weekdays_small_v185":"widget_weekdays_compact_v184");String[] labels={"일","월","화","수","목","금","토"};
        for(int i=0;i<7;i++){text(c,weekdays,"widget_week_"+i,labels[i]);color(c,weekdays,"widget_week_"+i,i==0?night?0xffe3b4c5:0xffaa6077:i==6?night?0xffb2c4f1:0xff6080bc:secondaryInk(c,chosen));weekdays.setTextViewTextSize(id(c,"widget_week_"+i),2,Math.max(8.5f,WidgetSizeV169.sp(c,widget,selectedFont,9)));}
        result.addView(id(c,"widget_calendar_v164"),weekdays);
        float cellHeight=cellHeight(kind,width,height,count);
        float baseSize=width>=500?11.5f:compact?9:10f;
        float eventSize=Math.max(9,WidgetSizeV169.sp(c,widget,selectedFont,baseSize));
        float scaled=Math.max(1,c.getResources().getDisplayMetrics().scaledDensity/Math.max(.1f,c.getResources().getDisplayMetrics().density));
        JSONArray events=data.optJSONArray("scheduleItems");JSONObject holidays=data.optJSONObject("holidays");String today=day(Calendar.getInstance());
        for(int r=0;r<count;r++){
            RemoteViews week=view(c,"widget_week_v164");
            for(int col=0;col<7;col++){
                String key=day(start),holiday=holidays==null?"":holidays.optString(key);List<String> dated=scheduleRows(events,key);boolean outside=!fortnight&&start.get(Calendar.MONTH)!=shownMonth;
                RemoteViews cell=view(c,mini?(compact?"widget_mini_day_small_v185":"widget_mini_day_v184"):(compact?"widget_event_day_small_v185":"widget_event_day_v184"));text(c,cell,"w184_day",String.valueOf(start.get(Calendar.DAY_OF_MONTH)));
                int foreground=outside?night?0xff938ba8:0xffa9a2b5:!holiday.isEmpty()||col==0?night?0xffe3b4c5:0xffaa6077:col==6?night?0xffb2c4f1:0xff6080bc:ink(c,chosen);
                color(c,cell,"w184_day",key.equals(today)?0xffffffff:foreground);cell.setInt(id(c,"w184_day"),"setBackgroundResource",drawable(c,key.equals(today)?"widget_today_compact_v184":"widget_day_clear_v164"));
                cell.setTextViewTextSize(id(c,"w184_day"),2,WidgetSizeV169.sp(c,widget,selectedFont,compact?8.5f:mini?11.5f:11));
                if(mini){boolean dots=cellHeight>=19;text(c,cell,"w184_dots",dated.isEmpty()?"":dated.size()>1?"••":"•");show(c,cell,"w184_dots",dots);if(!dots&&!dated.isEmpty()&&!key.equals(today))color(c,cell,"w184_day",night?0xffc1baff:PRIMARY);color(c,cell,"w184_dots",night?0xffc1baff:PRIMARY);}
                else{
                    cell.setImageViewResource(id(c,"w184_cell_background"),drawable(c,night?"widget_compact_grid_dark_v181":"widget_compact_grid_v181"));
                    cell.setInt(id(c,"w184_cell_background"),"setImageAlpha",Math.round(255*opacity(c,widget,overrideOpacity)/100f));
                    text(c,cell,"w184_holiday",holiday);color(c,cell,"w184_holiday",foreground);show(c,cell,"w184_holiday",!holiday.isEmpty()&&cellHeight>=45);
                    cell.setTextViewTextSize(id(c,"w184_holiday"),2,Math.max(8,WidgetSizeV169.sp(c,widget,selectedFont,8.5f)));
                    cell.removeAllViews(id(c,"w184_events"));int slots=capacity(cellHeight,eventSize*scaled*1.2f+4,!holiday.isEmpty()&&cellHeight>=45);int visible=Math.min(slots,dated.size());
                    if(slots==0&&!dated.isEmpty())text(c,cell,"w184_day",start.get(Calendar.DAY_OF_MONTH)+"·");
                    // When there are hidden entries reserve the last line for a clear overflow count.
                    if(dated.size()>slots&&slots>1)visible=slots-1;
                    for(int i=0;i<visible;i++)try{
                        JSONObject event=new JSONObject(dated.get(i));RemoteViews chip=view(c,"widget_event_chip_v184");text(c,chip,"w184_event_title",event.optString("title"));color(c,chip,"w184_event_title",ink(c,chosen));
                        chip.setTextViewTextSize(id(c,"w184_event_title"),2,eventSize);chip.setInt(id(c,"w184_event_title"),"setBackgroundColor",softColor(eventColor(event),night));
                        WidgetDesignV165.put(event,"uid",owner(data));WidgetDesignV165.put(event,"selectedDate",key);
                        chip.setOnClickPendingIntent(id(c,"w184_event_title"),open(c,widget,kind,"open-schedule-item-v168:"+Uri.encode(event.toString())));
                        chip.setContentDescription(id(c,"w184_event_title"),key+" "+time(event)+" "+event.optString("title"));cell.addView(id(c,"w184_events"),chip);
                    }catch(Exception ignored){}
                    text(c,cell,"w184_more",dated.size()>visible?"+"+(dated.size()-visible):"");show(c,cell,"w184_more",dated.size()>visible&&slots>1);color(c,cell,"w184_more",foreground);
                }
                cell.setContentDescription(id(c,"w184_cell"),key+(holiday.isEmpty()?"":" "+holiday)+" 일정 "+dated.size()+"개");
                cell.setOnClickPendingIntent(id(c,"w184_cell"),open(c,widget,kind,"open-schedule-date-v168:"+key));week.addView(id(c,"widget_week_cells_v164"),cell);start.add(Calendar.DAY_OF_MONTH,1);
            }
            result.addView(id(c,"widget_calendar_v164"),week);
        }
    }
    static RemoteViews row(Context c,int widget,String kind,String json,int index,String overrideTheme,int selectedFont) {
        JSONObject record;try{record=new JSONObject(json);}catch(Exception ignored){record=new JSONObject();}
        String chosen=overrideTheme==null?theme(c,widget):overrideTheme;JSONObject data=snapshot(c);
        if(record.has("_widgetOwnerV181")&&!sameOwner(record.optString("_widgetOwnerV181"),data)){RemoteViews cleared=view(c,"widget_upcoming_row_v184");cleared.setViewVisibility(id(c,"w184_row"),View.INVISIBLE);return cleared;}
        if(kind.contains("@todos"))return todo(c,widget,kind,record,data,chosen,selectedFont,false);
        float width=WidgetSizeV169.current(c,widget).getWidth(),height=WidgetSizeV169.current(c,widget).getHeight();boolean compact=smallRows(kind,width,height);
        String date=record.optString("selectedDate",record.optString("date")),dateLabel=shortDate(date),timeLabel=eventTimeLabel(record);
        float titleSize=WidgetSizeV169.sp(c,widget,selectedFont,compact?11:12),metaSize=WidgetSizeV169.sp(c,widget,selectedFont,compact?8.5f:10);
        DisplayMetrics metrics=c.getResources().getDisplayMetrics();float density=Math.max(.1f,metrics.density);
        float fontScale=TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,titleSize,metrics)/density/titleSize;
        Paint measure=new Paint();measure.setTextSize(TypedValue.applyDimension(TypedValue.COMPLEX_UNIT_SP,metaSize,metrics));
        // Keep date and time intact, and leave at least four title glyphs before
        // choosing one line. A narrow pane or larger system font uses two lines.
        boolean inline=inlineEventRow(eventPaneWidth(kind,width,height),measure.measureText(dateLabel)/density,measure.measureText(timeLabel)/density,titleSize,fontScale);
        RemoteViews item=view(c,inline?"widget_upcoming_inline_v186":"widget_upcoming_small_v185");
        text(c,item,"w184_event_date",dateLabel);text(c,item,"w184_event_title",record.optString("title"));text(c,item,"w184_event_time",timeLabel);
        for(String key:new String[]{"w184_event_date","w184_event_title","w184_event_time"})color(c,item,key,ink(c,chosen));
        color(c,item,"w184_event_time",secondaryInk(c,chosen));
        item.setTextViewTextSize(id(c,"w184_event_title"),2,titleSize);
        item.setTextViewTextSize(id(c,"w184_event_date"),2,metaSize);item.setTextViewTextSize(id(c,"w184_event_time"),2,metaSize);
        item.setInt(id(c,"w184_event_mark"),"setBackgroundColor",eventColor(record));
        WidgetDesignV165.put(record,"uid",owner(data));item.setOnClickFillInIntent(id(c,"w184_row"),new Intent().putExtra("widgetRow",index).putExtra("action","open-schedule-item-v168:"+Uri.encode(record.toString())));
        item.setContentDescription(id(c,"w184_row"),date+" "+timeLabel+" "+record.optString("title"));return item;
    }
    static RemoteViews todo(Context c,int widget,String kind,JSONObject record,JSONObject data,String chosen,int selectedFont,boolean cell) {
        boolean compact=smallRows(kind,WidgetSizeV169.current(c,widget).getWidth(),WidgetSizeV169.current(c,widget).getHeight());
        RemoteViews item=view(c,compact?"widget_todo_small_v185":"widget_todo_row_v184");text(c,item,"w184_todo_title",record.optString("title"));color(c,item,"w184_todo_title",ink(c,chosen));
        item.setTextViewTextSize(id(c,"w184_todo_title"),2,WidgetSizeV169.sp(c,widget,selectedFont,compact?11:12));
        String due=record.optString("dueAt",record.optString("dueDate",record.optString("date")));if(due.length()>10)due=due.substring(0,10);
        text(c,item,"w184_todo_due",shortDate(due));color(c,item,"w184_todo_due",secondaryInk(c,chosen));show(c,item,"w184_todo_due",dateKey(due));
        item.setTextViewTextSize(id(c,"w184_todo_due"),2,WidgetSizeV169.sp(c,widget,selectedFont,10));
        item.setInt(id(c,"w184_check"),"setBackgroundResource",drawable(c,dark(c,chosen)?"widget_compact_check_dark_v181":"widget_compact_check_v181"));
        item.setInt(id(c,"w187_row_divider"),"setBackgroundColor",dark(c,chosen)?0xff4b455e:0xffe8e3f0);
        item.setOnClickFillInIntent(id(c,"w184_check_hit"),WidgetDesignV165.action(data,widget,kind,record,"todo","true"));item.setOnClickFillInIntent(id(c,"w184_todo_title"),WidgetDesignV165.action(data,widget,kind,record,"open","todo"));item.setOnClickFillInIntent(id(c,"w184_todo_due"),WidgetDesignV165.action(data,widget,kind,record,"open","todo"));
        item.setContentDescription(id(c,"w184_check_hit"),record.optString("title")+" 완료");return item;
    }
}
