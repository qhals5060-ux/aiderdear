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
        public void onCreate(){onDataSetChanged();}
        public void onDataSetChanged(){WidgetSizeV169.active.set(bounds);try{org.json.JSONObject data=WidgetNativeV164.snapshot(context);owner="";items=WidgetNativeV164.rows(context,widget,kind,data);owner=WidgetCompactCalendarV181.owner(data);}finally{WidgetSizeV169.active.remove();}}
        public void onDestroy(){items.clear();owner="";}
        boolean currentOwner(){return WidgetCompactCalendarV181.sameOwner(owner,WidgetNativeV164.snapshot(context));}
        public int getCount(){return currentOwner()?items.size():0;}
        public RemoteViews getViewAt(int position){WidgetSizeV169.active.set(bounds);try{return !currentOwner()||position<0||position>=items.size()?null:WidgetNativeV164.row(context,widget,kind,items.get(position),position,null,-1);}finally{WidgetSizeV169.active.remove();}}
        public RemoteViews getLoadingView(){return null;}
        public int getViewTypeCount(){return 16;}
        public long getItemId(int position){return !currentOwner()||position<0||position>=items.size()?position:WidgetDesignV165.stableId(items.get(position),position);}
        public boolean hasStableIds(){return true;}
    }
}
