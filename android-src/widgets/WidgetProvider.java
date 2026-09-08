package com.aiderlog.v22app;

import android.appwidget.AppWidgetProvider;
import android.appwidget.AppWidgetProviderInfo;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;

/** One compiled update path for all retained provider component names.
 * No legacy text-only fallback, hard-coded resource numbers or 32-class register array. */
public class WidgetProvider extends AppWidgetProvider {
    public static void safeUpdateWidget(Context c,AppWidgetManager manager,int widget,String name){
        try{
            if(WidgetNativeV164.update(c,manager,widget,name))
                WidgetNativeV164.prefs(c).edit().putLong("widget_update_at_"+widget,System.currentTimeMillis()).putInt("widget_renderer_"+widget,169).apply();
        }catch(Throwable error){
            Log.e("AiderLogWidget","provider update failed "+WidgetNativeV164.type(name)+" #"+widget,error);
            WidgetNativeV164.prefs(c).edit().putString("widget_render_error_"+widget,error.getClass().getSimpleName()).apply();
        }
    }
    public static void updateWidget(Context c,AppWidgetManager manager,int widget,String name){WidgetNativeV164.update(c,manager,widget,name);}
    public static void updateAll(Context c){
        AppWidgetManager manager=AppWidgetManager.getInstance(c);
        for(AppWidgetProviderInfo info:manager.getInstalledProviders()){
            if(info.provider==null||!c.getPackageName().equals(info.provider.getPackageName())||!info.provider.getClassName().contains("WidgetProvider$"))continue;
            for(int widget:manager.getAppWidgetIds(info.provider))safeUpdateWidget(c,manager,widget,info.provider.getClassName());
        }
    }
    @Override public void onEnabled(Context c){updateAll(c);}
    @Override public void onUpdate(Context c,AppWidgetManager manager,int[] widgets){
        for(int widget:widgets){AppWidgetProviderInfo info=manager.getAppWidgetInfo(widget);
            safeUpdateWidget(c,manager,widget,info==null?getClass().getName():info.provider.getClassName());}
    }
    @Override public void onAppWidgetOptionsChanged(Context c,AppWidgetManager manager,int widget,Bundle options){
        AppWidgetProviderInfo info=manager.getAppWidgetInfo(widget);
        safeUpdateWidget(c,manager,widget,info==null?getClass().getName():info.provider.getClassName());
    }
    @Override public void onRestored(Context c,int[] oldIds,int[] newIds){
        // Android may change widget IDs during device restore; preserve per-widget settings.
        android.content.SharedPreferences p=WidgetNativeV164.prefs(c);
        android.content.SharedPreferences.Editor edit=p.edit();
        for(int n=0;n<Math.min(oldIds.length,newIds.length);n++)for(String key:new String[]{"theme","opacity","font","content","date","month","page","range","challenge_page"}){
            String old="widget_"+key+"_"+oldIds[n],target="widget_"+key+"_"+newIds[n];Object value=p.getAll().get(old);
            if(value instanceof String)edit.putString(target,(String)value);else if(value instanceof Integer)edit.putInt(target,(Integer)value);
        }
        edit.apply();onUpdate(c,AppWidgetManager.getInstance(c),newIds);
    }
}
