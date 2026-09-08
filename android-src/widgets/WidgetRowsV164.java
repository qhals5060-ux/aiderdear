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
        final Context context;final int widget;final String kind;final android.util.SizeF bounds;List<String> items=new ArrayList<String>();
        Rows(Context c,Intent i){context=c;widget=i.getIntExtra("appWidgetId",0);kind=i.getStringExtra("kind");bounds=new android.util.SizeF(i.getFloatExtra("widthDp",336),i.getFloatExtra("heightDp",320));}
        public void onCreate(){onDataSetChanged();}
        public void onDataSetChanged(){WidgetSizeV169.active.set(bounds);try{items=WidgetNativeV164.rows(context,widget,kind,WidgetNativeV164.snapshot(context));}finally{WidgetSizeV169.active.remove();}}
        public void onDestroy(){items.clear();}
        public int getCount(){return items.size();}
        public RemoteViews getViewAt(int position){WidgetSizeV169.active.set(bounds);try{return position<0||position>=items.size()?null:WidgetNativeV164.row(context,widget,kind,items.get(position),position,null,-1);}finally{WidgetSizeV169.active.remove();}}
        public RemoteViews getLoadingView(){return null;}
        public int getViewTypeCount(){return 16;}
        public long getItemId(int position){return WidgetDesignV165.stableId(items.get(position),position);}
        public boolean hasStableIds(){return true;}
    }
}
