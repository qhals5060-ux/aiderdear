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
        }else if("date".equals(operation)&&value!=null&&value.matches("\\d{4}-\\d{2}-\\d{2}"))WidgetNativeV164.prefs(c).edit().putString("widget_date_"+id,value).apply();
        WidgetNativeV164.update(c,AppWidgetManager.getInstance(c),id,kind);
    }
}
