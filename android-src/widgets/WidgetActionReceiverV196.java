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
    @Override public void onReceive(Context context,Intent intent){
        try{String encoded=intent.getStringExtra("action"),uid=intent.getStringExtra("boundUid");if(encoded==null||!encoded.startsWith("widget-v165:")||!WidgetPrivateV196.owns(context,uid))return;JSONObject command=new JSONObject(Uri.decode(encoded.substring("widget-v165:".length())));if(!uid.equals(command.optString("uid")))return;String op=command.optString("op");if(!op.equals("routine")&&!op.equals("todo"))return;
            command=WidgetPrivateV196.gesture(command,WidgetNativeV164.snapshot(context),WidgetNativeV164.day(Calendar.getInstance()));WidgetPrivateV196.enqueue(context,uid,command);Toast.makeText(context,"기기에 반영됨 · 앱을 열면 동기화",Toast.LENGTH_SHORT).show();
        }catch(Exception error){Toast.makeText(context,error.getMessage()==null?"기록하지 못했습니다. 위젯을 다시 확인해주세요.":error.getMessage(),Toast.LENGTH_LONG).show();}
    }
}
