package com.aiderlog.v22app;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;
import android.widget.RemoteViewsService;
import java.util.ArrayList;
import java.util.List;
/** API 26–30 native scrollable collection; API 31+ uses inline RemoteCollectionItems. */
public final class WidgetRowsV164 extends RemoteViewsService {
    public RemoteViewsFactory onGetViewFactory(Intent intent){return new Rows(getApplicationContext(),intent);}
    static final class Rows implements RemoteViewsFactory {
        final Context context;final int widget;final String kind;final android.util.SizeF bounds;volatile List<String> items=new ArrayList<String>();volatile String owner="";
        Rows(Context c,Intent i){context=c;widget=i.getIntExtra("appWidgetId",0);kind=i.getStringExtra("kind");bounds=new android.util.SizeF(i.getFloatExtra("widthDp",336),i.getFloatExtra("heightDp",320));}
        public synchronized void onCreate(){onDataSetChanged();}
        public synchronized void onDataSetChanged(){WidgetSizeV169.active.set(bounds);try{org.json.JSONObject data=WidgetNativeV164.snapshot(context);owner="";items=WidgetNativeV164.rows(context,widget,kind,data);owner=WidgetCompactCalendarV181.owner(data);}finally{WidgetSizeV169.active.remove();}}
        public synchronized void onDestroy(){items=new ArrayList<String>();owner="";}
        boolean currentOwner(){return WidgetCompactCalendarV181.sameOwner(owner,WidgetNativeV164.snapshot(context));}
        /** Samsung/other hosts may ask for a cached factory row before dataset notification. */
        synchronized void refreshRows(){WidgetSizeV169.active.set(bounds);try{org.json.JSONObject data=WidgetNativeV164.snapshot(context);String nextOwner=WidgetCompactCalendarV181.owner(data);List<String> next=WidgetNativeV164.rows(context,widget,kind,data);if(!nextOwner.equals(owner)||!next.equals(items)){owner="";items=next;owner=nextOwner;}}finally{WidgetSizeV169.active.remove();}}
        public synchronized int getCount(){refreshRows();return currentOwner()?items.size():0;}
        public synchronized RemoteViews getViewAt(int position){refreshRows();WidgetSizeV169.active.set(bounds);try{return !currentOwner()||position<0||position>=items.size()?null:WidgetNativeV164.row(context,widget,kind,items.get(position),position,null,-1);}finally{WidgetSizeV169.active.remove();}}
        public RemoteViews getLoadingView(){return null;}
        public int getViewTypeCount(){return 16;}
        public synchronized long getItemId(int position){refreshRows();return !currentOwner()||position<0||position>=items.size()?position:WidgetDesignV165.stableId(items.get(position),position);}
        public boolean hasStableIds(){return true;}
    }
}
