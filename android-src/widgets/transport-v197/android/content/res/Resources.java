package android.content.res;import java.util.*;public class Resources {
 final Map<String,Integer> ids=new HashMap<String,Integer>();public final Map<Integer,String> names=new HashMap<Integer,String>();
 public int getIdentifier(String n,String t,String p){String key=t+":"+n;Integer id=ids.get(key);if(id==null){id=ids.size()+1;ids.put(key,id);names.put(id,key);}return id;}
 public android.util.DisplayMetrics getDisplayMetrics(){return new android.util.DisplayMetrics();}public Configuration getConfiguration(){return new Configuration();}
}
