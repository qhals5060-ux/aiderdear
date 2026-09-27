package android.content;
import java.util.*;
/** Recording boundary: fillIn follows AOSP Intent.fillIn extras precedence (base wins). */
public class Intent {
 public final Map<String,Object> extras=new HashMap<String,Object>(); public String component,action; public android.net.Uri data; public int flags;
 public Intent(){} public Intent(Intent other){extras.putAll(other.extras);component=other.component;action=other.action;data=other.data;flags=other.flags;}
 public Intent setClassName(Context c,String name){component=name;return this;} public Intent setAction(String s){action=s;return this;} public Intent setData(android.net.Uri u){data=u;return this;}
 public Intent putExtra(String k,String v){extras.put(k,v);return this;} public Intent putExtra(String k,int v){extras.put(k,v);return this;} public Intent putExtra(String k,float v){extras.put(k,v);return this;} public Intent putExtra(String k,boolean v){extras.put(k,v);return this;}
 public Intent addFlags(int f){flags|=f;return this;} public boolean hasExtra(String k){return extras.containsKey(k);}
 public String getStringExtra(String k){Object v=extras.get(k);return v instanceof String?(String)v:null;}
 public int getIntExtra(String k,int d){Object v=extras.get(k);return v instanceof Number?((Number)v).intValue():d;} public float getFloatExtra(String k,float d){Object v=extras.get(k);return v instanceof Number?((Number)v).floatValue():d;}
 public android.net.Uri getData(){return data;} public String getAction(){return action;}
 public int fillIn(Intent incoming,int mask){Map<String,Object> combined=new HashMap<String,Object>(incoming.extras);combined.putAll(extras);extras.clear();extras.putAll(combined);if(action==null)action=incoming.action;if(data==null)data=incoming.data;if(component==null)component=incoming.component;return 0;}
}
