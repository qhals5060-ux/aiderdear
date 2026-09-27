package android.content;
public class Context {
 public final android.content.res.Resources resources=new android.content.res.Resources();
 public SharedPreferences preferences;
 public String getPackageName(){return "com.aiderlog.v22app";}
 public Context getApplicationContext(){return this;}
 public android.content.res.Resources getResources(){return resources;}
 public SharedPreferences getSharedPreferences(String name,int mode){return preferences;}
}
