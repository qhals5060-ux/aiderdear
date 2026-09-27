package com.aiderlog.v22app;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.widget.Toast;
import org.json.JSONObject;
import java.util.Calendar;
import static com.aiderlog.v22app.WidgetDesignV165.*;

/** Explicit widget actions never start an Activity. */
public final class WidgetActionReceiverV196 extends BroadcastReceiver {
    @Override public void onReceive(Context context,Intent intent){consume(context,intent);}
    /** Also used by the direct native note Activity template. No Activity trampoline. */
    public static boolean consume(Context context,Intent intent){
        if(intent==null||!intent.hasExtra("action"))return false;
        try{String encoded=intent.getStringExtra("action"),uid=intent.getStringExtra("boundUid");if(encoded==null||!encoded.startsWith("widget-v165:")||!WidgetPrivateV196.owns(context,uid))throw new IllegalArgumentException("계정이 변경되었습니다. 위젯을 다시 확인해주세요.");JSONObject command=new JSONObject(Uri.decode(encoded.substring("widget-v165:".length())));if(!uid.equals(command.optString("uid"))||intent.getIntExtra("appWidgetId",0)!=command.optInt("widgetId")||!base(intent.getStringExtra("kind")).equals(base(command.optString("kind"))))throw new IllegalArgumentException("위젯 연결을 새로 확인해주세요.");String op=command.optString("op");if(!op.equals("routine")&&!op.equals("todo"))throw new IllegalArgumentException("위젯 작업을 확인해주세요.");
            command=WidgetPrivateV196.gesture(command,WidgetNativeV164.snapshot(context),WidgetNativeV164.day(Calendar.getInstance()));WidgetPrivateV196.enqueue(context,uid,command);Toast.makeText(context,"기기에 반영됨 · 앱을 열면 동기화",Toast.LENGTH_SHORT).show();
        }catch(Exception error){Toast.makeText(context,error.getMessage()==null?"기록하지 못했습니다. 위젯을 다시 확인해주세요.":error.getMessage(),Toast.LENGTH_LONG).show();}
        finally{refreshClicked(context,intent);}
        return true;
    }
    static void refreshClicked(Context context,Intent intent){try{int widget=intent.getIntExtra("appWidgetId",0);android.appwidget.AppWidgetManager manager=android.appwidget.AppWidgetManager.getInstance(context);android.appwidget.AppWidgetProviderInfo info=manager.getAppWidgetInfo(widget);if(info!=null&&info.provider!=null&&context.getPackageName().equals(info.provider.getPackageName()))WidgetProvider.safeUpdateWidget(context,manager,widget,info.provider.getClassName());}catch(Exception error){android.util.Log.w("AiderLogWidget","Clicked widget refresh failed",error);}}
}
