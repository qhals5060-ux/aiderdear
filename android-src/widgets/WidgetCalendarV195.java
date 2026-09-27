package com.aiderlog.v22app;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

/** Owner-bound native calendar outbox. Nothing here opens a WebView or calls a network. */
public final class WidgetCalendarV195 {
    static final int MAX_PENDING=100;
    static final String PREFIX="widget_calendar_pending_v195:";
    static JSONObject raw(Context c){try{return new JSONObject(WidgetNativeV164.prefs(c).getString("widget_snapshot","{}"));}catch(Exception e){return new JSONObject();}}
    static String owner(JSONObject data){String uid=data.optString("uid"),modelUid=WidgetDesignV165.model(data).optString("uid",uid);return !uid.isEmpty()&&uid.equals(modelUid)?uid:"";}
    static boolean owns(Context c,String uid){return uid!=null&&!uid.isEmpty()&&uid.equals(owner(raw(c)));}
    static JSONArray read(Context c,String uid){try{return new JSONArray(WidgetNativeV164.prefs(c).getString(PREFIX+uid,"[]"));}catch(Exception e){return new JSONArray();}}
    static boolean validDate(String value){if(value==null||!value.matches("\\d{4}-\\d{2}-\\d{2}"))return false;try{SimpleDateFormat f=new SimpleDateFormat("yyyy-MM-dd",Locale.US);f.setLenient(false);return f.format(f.parse(value)).equals(value);}catch(Exception e){return false;}}
    static JSONObject normalize(JSONObject value,String uid){
        if(value==null||uid==null||uid.isEmpty()||!uid.equals(value.optString("uid"))||value.optInt("schema")!=195||!"add-schedule".equals(value.optString("op")))throw new IllegalArgumentException("계정을 확인해주세요.");
        String id=value.optString("id"),title=value.optString("title").trim(),date=value.optString("date"),time=value.optString("time");boolean allDay=value.optBoolean("allDay");
        if(!id.matches("widget-calendar-[A-Za-z0-9-]{16,80}")||title.isEmpty()||title.length()>180||!validDate(date)||date.compareTo("2000-01-01")<0||date.compareTo("2199-12-31")>0||!date.equals(value.optString("endDate"))||!(value.opt("allDay") instanceof Boolean)||(!allDay&&!time.matches("(?:[01]\\d|2[0-3]):[0-5]\\d"))||value.optLong("createdAt")<946684800000L||value.optLong("createdAt")>System.currentTimeMillis()+86400000L)throw new IllegalArgumentException("일정 이름과 날짜·시간을 확인해주세요.");
        JSONObject result=new JSONObject();WidgetDesignV165.put(result,"schema",195);WidgetDesignV165.put(result,"op","add-schedule");WidgetDesignV165.put(result,"uid",uid);WidgetDesignV165.put(result,"id",id);WidgetDesignV165.put(result,"title",title);WidgetDesignV165.put(result,"date",date);WidgetDesignV165.put(result,"endDate",date);WidgetDesignV165.put(result,"time",allDay?"":time);WidgetDesignV165.put(result,"allDay",allDay);WidgetDesignV165.put(result,"createdAt",Math.max(0,value.optLong("createdAt")));return result;
    }
    static JSONArray merge(JSONArray before,JSONObject command){JSONArray next=new JSONArray();boolean found=false;for(int i=0;before!=null&&i<before.length();i++){JSONObject row=before.optJSONObject(i);if(row==null)continue;if(row.optString("id").equals(command.optString("id"))){if(!row.toString().equals(command.toString()))throw new IllegalArgumentException("같은 일정 식별자로 다른 내용을 저장할 수 없습니다.");found=true;}next.put(row);}if(!found){if(next.length()>=MAX_PENDING)throw new IllegalArgumentException("대기 중인 일정이 많습니다. 앱에서 동기화 후 추가해주세요.");next.put(command);}return next;}
    static boolean confirmed(JSONObject snapshot,JSONObject command){if(!command.optString("uid").equals(owner(snapshot)))return false;JSONArray rows=snapshot.optJSONArray("scheduleItems");for(int i=0;rows!=null&&i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row==null||row.optBoolean("_widgetPendingV195")||!row.optString("id").equals(command.optString("id")))continue;return row.optBoolean("widgetCreatedV195")&&command.optString("uid").equals(row.optString("authorUid"));}return false;}
    static JSONArray acknowledge(JSONArray before,JSONObject snapshot,String uid,String id){if(!uid.equals(owner(snapshot)))return before;JSONArray next=new JSONArray();for(int i=0;before!=null&&i<before.length();i++){JSONObject row=before.optJSONObject(i);if(row==null)continue;if(id.equals(row.optString("id"))&&uid.equals(row.optString("uid"))&&confirmed(snapshot,row))continue;next.put(row);}return next;}
    static synchronized void enqueue(Context c,String uid,JSONObject value){
        if(!owns(c,uid))throw new IllegalStateException("계정이 변경되었습니다. 위젯을 다시 열어주세요.");JSONObject command=normalize(value,uid);JSONArray next=merge(read(c,uid),command);
        if(!WidgetNativeV164.prefs(c).edit().putString(PREFIX+uid,next.toString()).commit())throw new IllegalStateException("기기에 저장하지 못했습니다. 입력을 유지했습니다.");
        WidgetProvider.updateAll(c);
    }
    /** Called only by the app's existing authenticated sync bridge. */
    public static synchronized String pending(Context c,String uid){return owns(c,uid)?read(c,uid).toString():"[]";}
    /** Acknowledgement follows a confirmed cloud write, never optimistic submission. */
    public static synchronized boolean ack(Context c,String uid,String id){if(!owns(c,uid)||id==null||id.isEmpty())return false;JSONArray before=read(c,uid),next=acknowledge(before,raw(c),uid,id);for(int i=0;i<next.length();i++)if(id.equals(next.optJSONObject(i).optString("id")))return false;boolean saved=WidgetNativeV164.prefs(c).edit().putString(PREFIX+uid,next.toString()).commit();if(saved)WidgetProvider.updateAll(c);return saved;}
    static JSONObject project(JSONObject raw,JSONArray queued){
        JSONObject data=WidgetCompactCalendarV181.copy(raw);String uid=owner(data);if(uid.isEmpty())return data;
        JSONArray rows=new JSONArray();Set<String> seen=new HashSet<String>();JSONArray existing=data.optJSONArray("scheduleItems");for(int i=0;existing!=null&&i<existing.length();i++){JSONObject row=existing.optJSONObject(i);if(row!=null){rows.put(row);seen.add(row.optString("id"));}}
        for(int i=0;queued!=null&&i<queued.length();i++)try{JSONObject row=normalize(queued.optJSONObject(i),uid);if(seen.add(row.optString("id"))){WidgetDesignV165.put(row,"_widgetPendingV195",true);WidgetDesignV165.put(row,"color","#76548F");rows.put(row);}}catch(Exception ignored){}
        WidgetDesignV165.put(data,"scheduleItems",rows);return data;
    }
    static synchronized JSONObject overlay(Context c,JSONObject raw){String uid=owner(raw);return uid.isEmpty()?raw:project(raw,read(c,uid));}
    static Intent dayIntent(Context c,int widget,String kind,String uid,String date){
        Intent intent=new Intent().setClassName(c,c.getPackageName()+".WidgetDayActivityV195").setAction("aiderlog.widget.day."+widget+"."+kind+"."+uid+"."+date);
        intent.setData(Uri.parse("aiderlog-widget-day://"+widget+"/"+Uri.encode(uid)+"/"+Uri.encode(date)));
        intent.putExtra("appWidgetId",widget).putExtra("kind",kind).putExtra("uid",uid);if(validDate(date))intent.putExtra("date",date);
        return intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);
    }
    static PendingIntent open(Context c,int widget,String kind,String uid,String date){Intent intent=dayIntent(c,widget,kind,uid,date);return PendingIntent.getActivity(c,intent.getData().toString().hashCode(),intent,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
    static PendingIntent collection(Context c,int widget,String kind,String uid){Intent intent=dayIntent(c,widget,kind,uid,"");int flags=PendingIntent.FLAG_UPDATE_CURRENT;if(android.os.Build.VERSION.SDK_INT>=31)flags|=PendingIntent.FLAG_MUTABLE;return PendingIntent.getActivity(c,intent.getData().toString().hashCode()+kind.hashCode(),intent,flags);}
    static Intent row(String uid,String date){return new Intent().putExtra("uid",uid).putExtra("date",date);}
}
