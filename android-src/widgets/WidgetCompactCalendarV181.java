package com.aiderlog.v22app;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
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

/** Compact launcher collections, not bitmap previews. Both list panes scroll independently. */
public final class WidgetCompactCalendarV181 {
    static boolean supports(String kind) {
        String base=WidgetDesignV165.base(kind);
        return "CalendarAgenda".equals(base)||"CalendarFortnight".equals(base);
    }
    static JSONObject copy(JSONObject value) {
        try{return new JSONObject(value.toString());}catch(Exception ignored){return new JSONObject();}
    }
    static boolean dateKey(String value){return value!=null&&value.matches("\\d{4}-\\d{2}-\\d{2}");}
    static List<String> scheduleRows(JSONArray values,String selected) {
        List<String> out=new ArrayList<String>();
        for(int i=0;values!=null&&i<values.length();i++) {
            JSONObject value=values.optJSONObject(i);if(value==null||value.optString("title").trim().isEmpty())continue;
            String start=value.optString("date"),end=value.optString("endDate",start);if(end.isEmpty())end=start;
            if(!dateKey(start)||!dateKey(end)||selected.compareTo(start)<0||selected.compareTo(end)>0)continue;
            JSONObject row=copy(value);WidgetDesignV165.put(row,"kind","schedule");out.add(row.toString());
        }
        Collections.sort(out,new Comparator<String>(){public int compare(String a,String b){
            try{JSONObject left=new JSONObject(a),right=new JSONObject(b);String lt=time(left),rt=time(right);
                int result=lt.compareTo(rt);return result!=0?result:left.optString("title").compareTo(right.optString("title"));
            }catch(Exception ignored){return 0;}
        }});
        return out;
    }
    static String time(JSONObject row) {
        String value=row.optString("time");
        return row.optBoolean("allDay")||!value.matches("\\d{2}:\\d{2}.*")?"":value.substring(0,5);
    }
    static List<String> incompleteRows(JSONObject data,boolean pairs) {
        JSONObject model=WidgetDesignV165.model(data);JSONArray values=model.optJSONArray("incompleteTodos");
        if(values==null)values=model.optJSONArray("todos");
        List<String> out=new ArrayList<String>();Set<String> seen=new HashSet<String>();
        JSONArray pending=new JSONArray();
        for(int i=0;values!=null&&i<values.length();i++) {
            JSONObject value=values.optJSONObject(i);if(value==null||value.optBoolean("done")||value.optString("id").isEmpty()||value.optString("title").trim().isEmpty()||!seen.add(value.optString("id")))continue;
            JSONObject row=copy(value);WidgetDesignV165.put(row,"kind","todo");
            if(pairs)pending.put(row);else out.add(row.toString());
        }
        // Undated, overdue and future todos remain in the same complete collection.
        for(int i=0;pairs&&i<pending.length();i+=2) {
            JSONObject group=WidgetDesignV165.card("todoPair");JSONArray children=new JSONArray();children.put(pending.optJSONObject(i));
            if(i+1<pending.length())children.put(pending.optJSONObject(i+1));
            WidgetDesignV165.put(group,"children",children);out.add(group.toString());
        }
        return out;
    }
    static List<String> rows(Context c,int widget,String kind,JSONObject data) {
        List<String> values=kind.contains("@todos")?incompleteRows(data,"CalendarFortnight".equals(WidgetDesignV165.base(kind))):scheduleRows(data.optJSONArray("scheduleItems"),selectedDay(c,widget,kind));
        String owner=owner(data);List<String> bound=new ArrayList<String>();
        for(String value:values)try{JSONObject row=new JSONObject(value);WidgetDesignV165.put(row,"_widgetOwnerV181",owner);bound.add(row.toString());}catch(Exception ignored){}
        return bound;
    }
    static String owner(JSONObject data){return WidgetDesignV165.model(data).optString("uid",data.optString("uid"));}
    static boolean sameOwner(String captured,JSONObject data){return captured!=null&&captured.equals(owner(data));}
    static String fortnightStart(String today){Calendar start=date(today);start.add(Calendar.DAY_OF_MONTH,-(start.get(Calendar.DAY_OF_WEEK)+5)%7);return day(start);}
    static String fortnightSelected(String today,String stored){String start=fortnightStart(today);Calendar end=date(start);end.add(Calendar.DAY_OF_MONTH,13);return dateKey(stored)&&stored.compareTo(start)>=0&&stored.compareTo(day(end))<=0?stored:today;}
    static String selectedDay(Context c,int widget,String kind){String today=day(Calendar.getInstance());return "CalendarAgenda".equals(WidgetDesignV165.base(kind))?today:fortnightSelected(today,selected(c,widget));}
    static int opacity(Context c,int widget,int override) {
        return Math.max(0,Math.min(100,override<0?prefs(c).getInt("widget_opacity_"+widget,100):override));
    }
    static int eventColor(JSONObject row) {
        String value=row.optString("color");if(value.matches("#[0-9a-fA-F]{6}"))try{return Color.parseColor(value);}catch(Exception ignored){}
        int[] palette={0xff7561dc,0xff5d83d5,0xffbd75b8,0xff9080d1};return palette[(row.optString("id",row.optString("title")).hashCode()&0x7fffffff)%palette.length];
    }
    static RemoteViews render(Context c,int widget,String kind,boolean preview,String overrideTheme,int overrideOpacity,int selectedFont) {
        boolean agenda="CalendarAgenda".equals(kind);String chosen=overrideTheme==null?theme(c,widget):overrideTheme;
        RemoteViews result=view(c,agenda?"widget_agenda_compact_v181":"widget_fortnight_compact_v181");
        String background="widget_bg_"+("system".equals(chosen)?dark(c,chosen)?"midnight":"aurora":chosen);
        int resource=drawable(c,background);if(resource==0)resource=drawable(c,"widget_bg_aurora");
        result.setImageViewResource(id(c,"widget_background"),resource);
        result.setInt(id(c,"widget_background"),"setImageAlpha",Math.round(255*opacity(c,widget,overrideOpacity)/100f));
        JSONObject data=snapshot(c);String selected=selectedDay(c,widget,kind);
        result.setContentDescription(id(c,"widget_root"),agenda?selected+" 일정과 전체 미완료 할 일":"2주 캘린더와 전체 미완료 할 일");
        result.setOnClickPendingIntent(id(c,"widget_root"),open(c,widget,kind,""));
        if(agenda)bind(c,result,widget,kind,rows(c,widget,kind,data),"widget_items_v164","widget_preview_rows_v164",preview,overrideTheme,selectedFont,6);
        else calendar(c,result,widget,kind,data,chosen,overrideOpacity,selectedFont);
        String todoKind=kind+"@todos";
        bind(c,result,widget,todoKind,rows(c,widget,todoKind,data),"w165_secondary_list","w181_todo_preview",preview,overrideTheme,selectedFont,agenda?6:3);
        return result;
    }
    static void bind(Context c,RemoteViews result,int widget,String kind,List<String> values,String list,String previewHost,boolean preview,String chosen,int selectedFont,int visible) {
        show(c,result,list,!preview);show(c,result,previewHost,preview);
        if(preview) {
            result.removeAllViews(id(c,previewHost));
            for(int i=0;i<Math.min(visible,values.size());i++)result.addView(id(c,previewHost),row(c,widget,kind,values.get(i),i,chosen,selectedFont));
        }else collection(c,result,widget,kind,values,id(c,list));
    }
    static void calendar(Context c,RemoteViews result,int widget,String kind,JSONObject data,String chosen,int overrideOpacity,int selectedFont) {
        String today=day(Calendar.getInstance()),selected=fortnightSelected(today,selected(c,widget));Calendar start=date(fortnightStart(today));
        result.removeAllViews(id(c,"widget_calendar_v164"));
        RemoteViews weekdays=view(c,"widget_compact_weekday_v181");String[] labels={"월","화","수","목","금","토","일"};
        for(int i=0;i<7;i++){text(c,weekdays,"widget_week_"+i,labels[i]);color(c,weekdays,"widget_week_"+i,ink(c,chosen));}
        result.addView(id(c,"widget_calendar_v164"),weekdays);
        JSONArray events=data.optJSONArray("scheduleItems");JSONObject holidays=data.optJSONObject("holidays");
        for(int r=0;r<2;r++) {
            RemoteViews week=view(c,"widget_week_v164");
            for(int col=0;col<7;col++) {
                String key=day(start);List<String> dated=scheduleRows(events,key);JSONObject event=null;
                try{if(!dated.isEmpty())event=new JSONObject(dated.get(0));}catch(Exception ignored){}
                RemoteViews cell=view(c,"widget_compact_day_v181");text(c,cell,"w181_day",String.valueOf(start.get(Calendar.DAY_OF_MONTH)));
                String summary=event==null?"":(time(event).isEmpty()?"":time(event)+" ")+event.optString("title");
                text(c,cell,"w181_event",summary);show(c,cell,"w181_dot",event!=null);
                color(c,cell,"w181_day",ink(c,chosen));color(c,cell,"w181_event",ink(c,chosen));
                if(event!=null)color(c,cell,"w181_dot",eventColor(event));
                cell.setTextViewTextSize(id(c,"w181_day"),2,WidgetSizeV169.sp(c,widget,selectedFont,10));
                cell.setTextViewTextSize(id(c,"w181_event"),2,WidgetSizeV169.sp(c,widget,selectedFont,8));
                cell.setImageViewResource(id(c,"w181_cell_background"),drawable(c,key.equals(selected)?dark(c,chosen)?"widget_compact_selected_dark_v181":"widget_compact_selected_v181":dark(c,chosen)?"widget_compact_grid_dark_v181":"widget_compact_grid_v181"));
                cell.setInt(id(c,"w181_cell_background"),"setImageAlpha",Math.round(255*opacity(c,widget,overrideOpacity)/100f));
                String holiday=holidays==null?"":holidays.optString(key);
                cell.setContentDescription(id(c,"w181_cell"),key+(holiday.isEmpty()?"":" "+holiday)+(event==null?" 일정 없음":" "+summary)+(dated.size()>1?" 외 "+(dated.size()-1)+"개":""));
                // Open the complete day in the app, without shifting the fortnight window.
                cell.setOnClickPendingIntent(id(c,"w181_cell"),open(c,widget,kind,"open-schedule-date-v168:"+key));
                week.addView(id(c,"widget_week_cells_v164"),cell);start.add(Calendar.DAY_OF_MONTH,1);
            }
            result.addView(id(c,"widget_calendar_v164"),week);
        }
    }
    static RemoteViews row(Context c,int widget,String kind,String json,int index,String overrideTheme,int selectedFont) {
        JSONObject record;try{record=new JSONObject(json);}catch(Exception ignored){record=new JSONObject();}
        String chosen=overrideTheme==null?theme(c,widget):overrideTheme;JSONObject data=snapshot(c);
        if(record.has("_widgetOwnerV181")&&!sameOwner(record.optString("_widgetOwnerV181"),data)) {
            RemoteViews cleared=view(c,"widget_compact_event_v181");cleared.setViewVisibility(id(c,"w181_row"),View.INVISIBLE);return cleared;
        }
        if("todoPair".equals(record.optString("kind"))) {
            RemoteViews pair=view(c,"widget_compact_todo_group_v181");JSONArray children=record.optJSONArray("children");
            pair.removeAllViews(id(c,"w181_pair"));
            for(int i=0;children!=null&&i<2;i++) {
                JSONObject child=children.optJSONObject(i);RemoteViews item=todo(c,widget,kind,child==null?new JSONObject():child,data,chosen,selectedFont,true);
                if(child==null)item.setViewVisibility(id(c,"w181_row"),View.INVISIBLE);
                pair.addView(id(c,"w181_pair"),item);
            }
            return pair;
        }
        if(kind.contains("@todos"))return todo(c,widget,kind,record,data,chosen,selectedFont,false);
        RemoteViews item=view(c,"widget_compact_event_v181");text(c,item,"w181_title",record.optString("title"));text(c,item,"w181_time",time(record));
        color(c,item,"w181_title",ink(c,chosen));color(c,item,"w181_time",ink(c,chosen));color(c,item,"w181_dot",eventColor(record));
        item.setTextViewTextSize(id(c,"w181_title"),2,WidgetSizeV169.sp(c,widget,selectedFont,11.5f));
        item.setTextViewTextSize(id(c,"w181_time"),2,WidgetSizeV169.sp(c,widget,selectedFont,10.5f));
        WidgetDesignV165.put(record,"selectedDate",selectedDay(c,widget,kind));WidgetDesignV165.put(record,"uid",WidgetDesignV165.model(data).optString("uid",data.optString("uid")));
        item.setOnClickFillInIntent(id(c,"w181_row"),new Intent().putExtra("widgetRow",index).putExtra("action","open-schedule-item-v168:"+Uri.encode(record.toString())));
        item.setContentDescription(id(c,"w181_row"),record.optString("title")+(time(record).isEmpty()?"":" "+time(record)));
        return item;
    }
    static RemoteViews todo(Context c,int widget,String kind,JSONObject record,JSONObject data,String chosen,int selectedFont,boolean cell) {
        RemoteViews item=view(c,cell?"widget_compact_todo_cell_v181":"widget_compact_todo_v181");
        text(c,item,"w181_title",record.optString("title"));color(c,item,"w181_title",ink(c,chosen));
        item.setTextViewTextSize(id(c,"w181_title"),2,WidgetSizeV169.sp(c,widget,selectedFont,cell?10.5f:11.5f));
        item.setInt(id(c,"w181_check"),"setBackgroundResource",drawable(c,dark(c,chosen)?"widget_compact_check_dark_v181":"widget_compact_check_v181"));
        // The whole compact checkbox hit area marks completion; title opens the full manager.
        item.setOnClickFillInIntent(id(c,"w181_check_hit"),WidgetDesignV165.action(data,widget,kind,record,"todo","true"));
        item.setOnClickFillInIntent(id(c,"w181_title"),WidgetDesignV165.action(data,widget,kind,record,"open","todo"));
        item.setContentDescription(id(c,"w181_check_hit"),record.optString("title")+" 완료");
        return item;
    }
}
