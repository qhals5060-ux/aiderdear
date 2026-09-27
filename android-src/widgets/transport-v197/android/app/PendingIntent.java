package android.app;
import android.content.*;
public class PendingIntent {
 public static final int FLAG_UPDATE_CURRENT=0x08000000,FLAG_MUTABLE=0x02000000,FLAG_IMMUTABLE=0x04000000;
 public Intent base; public String type; public int flags;private PendingIntent(Intent i,String t,int f){base=new Intent(i);type=t;flags=f;}
 public static PendingIntent getBroadcast(Context c,int r,Intent i,int f){return new PendingIntent(i,"broadcast",f);}public static PendingIntent getActivity(Context c,int r,Intent i,int f){return new PendingIntent(i,"activity",f);}
 public Intent deliver(Intent fill){Intent out=new Intent(base);if((flags&FLAG_IMMUTABLE)==0)out.fillIn(fill,0);return out;}
}
