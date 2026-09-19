package com.aiderlog.v22app;

import android.app.Activity;
import android.util.SizeF;
import android.view.View;
import android.view.ViewGroup;
import java.util.WeakHashMap;

/** Settings-only measurement. The installed widget always uses launcher bounds. */
public final class WidgetPreviewFrameV181 {
    private static final WeakHashMap<ViewGroup,Boolean> awaiting=new WeakHashMap<ViewGroup,Boolean>();
    private static final ThreadLocal<SizeF> previous=new ThreadLocal<SizeF>();
    private static final ThreadLocal<Boolean> applied=new ThreadLocal<Boolean>();
    static boolean compact(String kind){return "CalendarAgenda".equals(kind)||"CalendarFortnight".equals(kind);}
    static int heightForWidth(int width,int left,int right,int top,int bottom){
        return Math.max(1,Math.round(Math.max(1,width-left-right)/2f))+top+bottom;
    }
    public static boolean prepare(final Activity activity,final ViewGroup host,String kind){
        if(!compact(kind))return true;
        int width=host.getWidth();
        if(width<=0){
            if(!awaiting.containsKey(host)){
                awaiting.put(host,Boolean.TRUE);
                host.addOnLayoutChangeListener(new View.OnLayoutChangeListener(){
                    public void onLayoutChange(View view,int left,int top,int right,int bottom,int oldLeft,int oldTop,int oldRight,int oldBottom){
                        if(right-left<=0)return;
                        host.removeOnLayoutChangeListener(this);awaiting.remove(host);
                        if(!activity.isFinishing())host.post(new Runnable(){public void run(){if(!activity.isFinishing())WidgetNativeV164.preview(activity);}});
                    }
                });
            }
            return false;
        }
        int height=heightForWidth(width,host.getPaddingLeft(),host.getPaddingRight(),host.getPaddingTop(),host.getPaddingBottom());
        ViewGroup.LayoutParams params=host.getLayoutParams();
        if(params!=null&&params.height!=height){params.height=height;host.setLayoutParams(params);}
        float density=Math.max(.1f,activity.getResources().getDisplayMetrics().density);
        float innerWidth=Math.max(1,width-host.getPaddingLeft()-host.getPaddingRight());
        previous.set(WidgetSizeV169.active.get());applied.set(Boolean.TRUE);
        WidgetSizeV169.active.set(new SizeF(innerWidth/density,innerWidth/2f/density));
        return true;
    }
    public static void restore(){
        if(Boolean.TRUE.equals(applied.get())){
            SizeF prior=previous.get();if(prior==null)WidgetSizeV169.active.remove();else WidgetSizeV169.active.set(prior);
        }
        previous.remove();applied.remove();
    }
}
