package android.widget;
import java.util.*;import android.content.Intent;import android.app.PendingIntent;
/** Records public API calls made by production code; not a launcher or Android inflater. */
public class RemoteViews {
 public static boolean failInline=false;
 public int layout;public Map variants;
 public final Map<Integer,String> text=new HashMap<Integer,String>();public final Map<Integer,Integer> background=new HashMap<Integer,Integer>();
 public final Map<Integer,Intent> fills=new HashMap<Integer,Intent>(),services=new HashMap<Integer,Intent>();public final Map<Integer,PendingIntent> templates=new HashMap<Integer,PendingIntent>(),direct=new HashMap<Integer,PendingIntent>();public final Map<Integer,RemoteCollectionItems> collections=new HashMap<Integer,RemoteCollectionItems>();
 public RemoteViews(String p,int l){layout=l;}public RemoteViews(Map m){variants=m;}
 public void setTextViewText(int i,CharSequence s){text.put(i,s.toString());}public void setTextColor(int i,int c){}public void setTextViewTextSize(int i,int u,float s){}
 public void setImageViewResource(int i,int r){}public void setInt(int i,String name,int v){if(name.equals("setBackgroundResource"))background.put(i,v);}public void setViewVisibility(int i,int v){}public void setProgressBar(int i,int m,int p,boolean x){}public void setContentDescription(int i,CharSequence s){}
 public void setOnClickFillInIntent(int i,Intent f){fills.put(i,new Intent(f));}public void setPendingIntentTemplate(int i,PendingIntent p){templates.put(i,p);}public void setOnClickPendingIntent(int i,PendingIntent p){direct.put(i,p);}
 public void setRemoteAdapter(int i,Intent service){services.put(i,service);}public void setRemoteAdapter(int i,RemoteCollectionItems items){collections.put(i,items);}public void removeAllViews(int i){}public void addView(int i,RemoteViews r){}
 public static class RemoteCollectionItems {public final List<RemoteViews> rows=new ArrayList<RemoteViews>();public static class Builder {final RemoteCollectionItems result=new RemoteCollectionItems();public Builder(){if(failInline)throw new IllegalStateException("Simulated unsupported host collection API");}public Builder setHasStableIds(boolean b){return this;}public Builder setViewTypeCount(int n){return this;}public Builder addItem(long id,RemoteViews row){result.rows.add(row);return this;}public RemoteCollectionItems build(){return result;}}}
}
