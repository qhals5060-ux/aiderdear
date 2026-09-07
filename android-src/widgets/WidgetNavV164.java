package com.aiderlog.v22app;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.appwidget.AppWidgetManager;
import java.util.Calendar;
public final class WidgetNavV164 extends BroadcastReceiver {
    @Override public void onReceive(Context c,Intent intent){
        if(!WidgetNativeV164.ACTION.equals(intent.getAction()))return;
        int id=intent.getIntExtra("appWidgetId",-1);if(id<0)return;
        String kind=intent.getStringExtra("kind"),operation=intent.getStringExtra("operation"),value=intent.getStringExtra("value");
        if("month".equals(operation)){
            int delta="-1".equals(value)?-1:1;
            if("CalendarFortnight".equals(kind)){
                Calendar fortnight=WidgetNativeV164.date(WidgetNativeV164.selected(c,id));fortnight.add(Calendar.DAY_OF_MONTH,14*delta);
                WidgetNativeV164.prefs(c).edit().putString("widget_date_"+id,WidgetNativeV164.day(fortnight)).apply();
                WidgetNativeV164.update(c,AppWidgetManager.getInstance(c),id,kind);return;
            }
            int offset=WidgetNativeV164.prefs(c).getInt("widget_month_"+id,0)+delta;
            Calendar date=Calendar.getInstance();date.set(Calendar.DAY_OF_MONTH,1);date.add(Calendar.MONTH,offset);
            WidgetNativeV164.prefs(c).edit().putInt("widget_month_"+id,offset).putString("widget_date_"+id,WidgetNativeV164.day(date)).apply();
        }else if("bullet".equals(operation)){int current=WidgetNativeV164.prefs(c).getInt("widget_page_"+id,0),next="-1".equals(value)?(current>3?3:0):(current<3?3:4);WidgetNativeV164.prefs(c).edit().putInt("widget_page_"+id,next).apply();}
        else if("challenge".equals(operation)){org.json.JSONObject selected=WidgetDesignV165.choose(WidgetDesignV165.a(WidgetDesignV165.model(WidgetNativeV164.snapshot(c)),"challenges"),WidgetDesignV165.options(c,id).optString("id"));int max=selected==null?0:Math.max(0,WidgetDesignV165.a(selected,"nodes").length()-7),current=Math.min(max,WidgetNativeV164.prefs(c).getInt("widget_challenge_page_"+id,0)),next="-1".equals(value)?Math.max(0,current%7==0?current-7:current-current%7):Math.min(max,current+7);WidgetNativeV164.prefs(c).edit().putInt("widget_challenge_page_"+id,next).apply();}
        else if("date".equals(operation)&&value!=null&&value.matches("\\d{4}-\\d{2}-\\d{2}"))WidgetNativeV164.prefs(c).edit().putString("widget_date_"+id,value).apply();
        WidgetNativeV164.update(c,AppWidgetManager.getInstance(c),id,kind);
    }
}
