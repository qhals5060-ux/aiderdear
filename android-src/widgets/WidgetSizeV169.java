package com.aiderlog.v22app;

import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.SizeF;
import android.widget.RemoteViews;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;

/** Host dimensions are dp, not pixels and not always MIN_HEIGHT (portrait uses MAX_HEIGHT).
 * Android 12+ receives exact variants; collection factories are isolated by variant size. */
public final class WidgetSizeV169 {
    static final ThreadLocal<SizeF> active=new ThreadLocal<SizeF>();
    static SizeF current(Context c,int widget){
        SizeF supplied=active.get();if(supplied!=null)return supplied;
        Bundle b=AppWidgetManager.getInstance(c).getAppWidgetOptions(widget);
        if(b==null)b=new Bundle();
        boolean landscape=c.getResources().getConfiguration().orientation==Configuration.ORIENTATION_LANDSCAPE;
        return new SizeF(Math.max(48,b.getInt(landscape?"appWidgetMaxWidth":"appWidgetMinWidth",336)),
            Math.max(48,b.getInt(landscape?"appWidgetMinHeight":"appWidgetMaxHeight",b.getInt("appWidgetMinHeight",320))));
    }
    static RemoteViews render(Context c,int widget,String kind){
        if(android.os.Build.VERSION.SDK_INT>=31){
            Bundle b=AppWidgetManager.getInstance(c).getAppWidgetOptions(widget);
            ArrayList<SizeF> sizes=b==null?null:b.<SizeF>getParcelableArrayList("appWidgetSizes");
            if(sizes!=null&&!sizes.isEmpty())try{
                Map<SizeF,RemoteViews> variants=new LinkedHashMap<SizeF,RemoteViews>();
                for(SizeF size:sizes){if(size==null||size.getWidth()<48||size.getHeight()<48)continue;
                    active.set(size);variants.put(size,WidgetNativeV164.render(c,widget,kind,false,null,-1,-1));
                    if(variants.size()==16)break;
                }
                if(!variants.isEmpty())return RemoteViews.class.getConstructor(Map.class).newInstance(variants);
            }catch(ReflectiveOperationException error){android.util.Log.w("AiderLogWidget","Exact-size API unavailable",error);}
            finally{active.remove();}
        }
        return WidgetNativeV164.render(c,widget,kind,false,null,-1,-1);
    }
    static float sp(Context c,int widget,int override,float role){
        int level=override<0?WidgetNativeV164.prefs(c).getInt("widget_font_"+widget,3):override;
        return role+(Math.max(1,Math.min(5,level))-3)*.8f;
    }
}
