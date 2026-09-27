package com.aiderlog.v22app;

import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.Calendar;
import java.util.Iterator;
import java.util.UUID;
import static com.aiderlog.v22app.WidgetDesignV165.*;

/** Durable private actions. Only the authenticated app sends them to Firebase. */
public final class WidgetPrivateV196 {
    public static final String PREFIX="widget_private_pending_v196:";
    public static final String FAILURES_PREFIX="widget_private_failed_v196:";
    static final int LIMIT=100;
    static String owner(JSONObject data){return WidgetCalendarV195.owner(data);}
    static JSONObject raw(Context c){return WidgetCalendarV195.raw(c);}
    static boolean owns(Context c,String uid){return uid!=null&&!uid.isEmpty()&&uid.equals(owner(raw(c)));}
    static JSONArray read(Context c,String uid){try{return new JSONArray(WidgetNativeV164.prefs(c).getString(PREFIX+uid,"[]"));}catch(Exception error){return new JSONArray();}}
    static JSONArray errors(Context c,String uid){try{return new JSONArray(WidgetNativeV164.prefs(c).getString(FAILURES_PREFIX+uid,"[]"));}catch(Exception error){return new JSONArray();}}
    static JSONArray cloneRows(JSONArray rows){try{return new JSONArray(rows.toString());}catch(Exception error){return new JSONArray();}}
    static boolean adding(JSONObject row){return row.optString("op").startsWith("add-");}
    static String record(JSONObject row){return (row.optString("op").equals("routine")?"routine:":"checklist:")+row.optString("id");}
    static boolean sameRecord(JSONObject a,JSONObject b){return record(a).equals(record(b));}
    static boolean sameAction(JSONObject a,JSONObject b){return !adding(a)&&!adding(b)&&a.optString("op").equals(b.optString("op"))&&sameRecord(a,b)&&(!a.optString("op").equals("routine")||a.optString("date").equals(b.optString("date")));}
    static boolean goalLinked(JSONObject routine){JSONObject derived=routine.optJSONObject("goalDerivedDates"),tracking=routine.optJSONObject("goalTracking");if(derived!=null&&derived.length()>0)return true;if(tracking!=null){Iterator<String> keys=tracking.keys();while(keys.hasNext()){JSONObject days=tracking.optJSONObject(keys.next());if(days!=null&&days.length()>0)return true;}}return false;}
    static JSONObject normalize(JSONObject input,String uid){
        if(input==null||uid==null||uid.isEmpty()||!uid.equals(input.optString("uid")))throw new IllegalArgumentException("계정이 변경되었습니다. 위젯을 다시 열어주세요.");
        String op=input.optString("op"),id=input.optString("id"),key=input.optString("key"),value=input.optString("value").trim(),date=input.optString("date"),kind=base(input.optString("kind"));
        if(!WidgetProvider.supports(kind)||!(op.equals("routine")||op.equals("todo")||op.equals("add-todo")||op.equals("add-memo"))||id.isEmpty()||id.length()>180||!key.matches("widget-private-[A-Za-z0-9-]{16,80}"))throw new IllegalArgumentException("위젯 작업을 확인해주세요.");
        if(op.equals("routine")){value=value.toUpperCase(java.util.Locale.US);if(!(value.isEmpty()||value.equals("MINI")||value.equals("MORE")||value.equals("MAX")||value.equals("SKIP"))||!WidgetCalendarV195.validDate(date)||date.compareTo(WidgetNativeV164.day(Calendar.getInstance()))>0)throw new IllegalArgumentException("오늘까지의 루틴만 기록할 수 있어요.");}
        else if(op.equals("todo")){if(!value.equals("true")&&!value.equals("false"))throw new IllegalArgumentException("완료 상태를 확인해주세요.");date="";}
        else if(value.isEmpty()||value.length()>180||op.equals("add-todo")&&!date.isEmpty()&&!WidgetCalendarV195.validDate(date))throw new IllegalArgumentException("내용은 180자 이내로 입력해주세요.");
        if(op.equals("add-memo"))date="";
        if(!op.startsWith("add-")&&(!input.has("expectedUpdatedAt")||input.optLong("expectedUpdatedAt",-1)<0))throw new IllegalArgumentException("위젯 기록을 다시 동기화해주세요.");
        JSONObject out=new JSONObject();put(out,"schema",196);put(out,"uid",uid);put(out,"op",op);put(out,"id",id);put(out,"key",key);put(out,"value",value);put(out,"date",date);put(out,"kind",kind);put(out,"widgetId",input.optInt("widgetId"));put(out,"createdAt",input.optLong("createdAt",System.currentTimeMillis()));if(!op.startsWith("add-"))put(out,"expectedUpdatedAt",input.optLong("expectedUpdatedAt"));put(out,"state","pending");return out;
    }
    /** Replacing an unclaimed command always uses the incoming fresh key. */
    static JSONArray merge(JSONArray before,JSONObject command){
        JSONArray next=new JSONArray();String parent="";for(int i=0;i<before.length();i++){JSONObject row=before.optJSONObject(i);if(row==null)continue;if(adding(command)&&sameRecord(row,command)){boolean same=true;for(String field:new String[]{"uid","op","id","key","value","date"})same=same&&row.optString(field).equals(command.optString(field));if(same)return before;throw new IllegalArgumentException("같은 기록 식별자의 내용을 변경할 수 없습니다.");}if(row.optString("key").equals(command.optString("key")))throw new IllegalArgumentException("새 작업 식별자가 필요합니다.");if(sameRecord(row,command)&&row.optString("state").equals("claimed"))parent=row.optString("key");if(sameAction(row,command)&&!row.optString("state").equals("claimed"))continue;next.put(copy(row));}
        if(next.length()>=LIMIT)throw new IllegalArgumentException("대기 중인 작업이 많습니다. 앱을 열어 동기화한 뒤 다시 시도해주세요.");JSONObject out=copy(command);if(!parent.isEmpty())put(out,"parentKey",parent);next.put(out);return next;
    }
    /** One durable claim per owner prevents two in-flight writes to the same row. */
    static JSONArray claim(JSONArray before){
        JSONArray rows=cloneRows(before);JSONObject selected=null;for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&row.optString("state").equals("claimed"))return rows;}
        for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&row.optString("state").equals("pending")){selected=row;put(row,"state","claimed");break;}}
        if(selected!=null)for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=selected&&row!=null&&row.optString("state").equals("pending")&&sameRecord(row,selected))put(row,"parentKey",selected.optString("key"));}return rows;
    }
    static JSONObject claimed(JSONArray rows){for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&row.optString("state").equals("claimed"))return row;}return null;}
    static JSONObject find(JSONArray rows,String id){for(int i=0;rows!=null&&i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&id.equals(row.optString("id")))return row;}return null;}
    static JSONObject modelRow(JSONObject snapshot,JSONObject command){return find(model(snapshot).optJSONArray(command.optString("op").equals("routine")?"routines":command.optString("op").equals("add-memo")?"notes":"todos"),command.optString("id"));}
    static JSONObject gesture(JSONObject input,JSONObject snapshot,String today){
        String uid=owner(snapshot);if(uid.isEmpty()||!uid.equals(input.optString("uid")))throw new IllegalArgumentException("계정이 변경되었습니다. 위젯을 다시 열어주세요.");JSONObject command=copy(input),row=modelRow(snapshot,command);if(row==null)throw new IllegalArgumentException("삭제된 기록입니다. 위젯을 동기화해주세요.");
        if(command.optString("op").equals("routine")){if(goalLinked(row))throw new IllegalArgumentException("목표와 연결된 루틴은 앱에서 목표별 수행을 수정해주세요.");put(command,"date",today);if(command.optBoolean("toggleComplete")){String selected=row.optJSONObject("dailyLevels")==null?"":row.optJSONObject("dailyLevels").optString(today).toUpperCase(java.util.Locale.US);put(command,"value",selected.equals("MAX")?"":"MAX");}}return command;
    }
    static boolean proof(JSONObject snapshot,JSONObject command,JSONObject receipt){JSONObject verified=snapshot.optJSONObject("privateReceiptV196");if(verified==null||!command.optString("uid").equals(owner(snapshot)))return false;for(String field:new String[]{"uid","key","id","op"})if(!command.optString(field).equals(verified.optString(field)))return false;return receipt.has("revision")&&receipt.optLong("revision",-1)>=0&&verified.optLong("revision",-2)==receipt.optLong("revision")&&verified.optBoolean("rebase")==receipt.optBoolean("rebase");}
    static JSONArray acknowledge(JSONArray before,JSONObject snapshot,String uid,String key,JSONObject receipt){
        JSONObject command=claimed(before);if(command==null||!uid.equals(command.optString("uid"))||!key.equals(command.optString("key"))||!proof(snapshot,command,receipt))return before;
        JSONArray after=new JSONArray();for(int i=0;i<before.length();i++){JSONObject row=before.optJSONObject(i);if(row==null||key.equals(row.optString("key")))continue;JSONObject next=copy(row);if(next.optString("state").equals("pending")&&key.equals(next.optString("parentKey"))){if(receipt.optBoolean("rebase")&&!adding(next))put(next,"expectedUpdatedAt",receipt.optLong("revision"));next.remove("parentKey");}after.put(next);}return after;
    }
    static JSONArray failure(JSONArray before,String uid,String key,String code){JSONArray after=cloneRows(before);for(int i=0;i<after.length();i++){JSONObject row=after.optJSONObject(i);if(row!=null&&uid.equals(row.optString("uid"))&&key.equals(row.optString("key"))&&row.optString("state").equals("claimed")){put(row,"state","failed");put(row,"error",code.substring(0,Math.min(80,code.length())));}}return after;}
    static JSONArray together(JSONArray first,JSONArray last){JSONArray out=cloneRows(first);for(int i=0;i<last.length();i++)out.put(copy(last.optJSONObject(i)));return out;}
    static int addCount(JSONArray rows){int count=0;for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&adding(row))count++;}return count;}
    /** Add text is never evicted. Mutation failures retain the latest 20 records. */
    static JSONArray archive(JSONArray previous,JSONObject failed){JSONArray kept=new JSONArray();int mutations=adding(failed)?0:1;for(int i=0;i<previous.length();i++){JSONObject row=previous.optJSONObject(i);if(row==null||row.optString("key").equals(failed.optString("key"))||!adding(row)&&sameRecord(row,failed))continue;kept.put(copy(row));if(!adding(row))mutations++;}kept.put(copy(failed));JSONArray rows=new JSONArray();for(int i=0;i<kept.length();i++){JSONObject row=kept.optJSONObject(i);if(!adding(row)&&mutations>20){mutations--;continue;}rows.put(row);}return rows;}
    static JSONArray without(JSONArray rows,String key){JSONArray out=new JSONArray();for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&!key.equals(row.optString("key")))out.put(copy(row));}return out;}
    static JSONArray clearReplaced(JSONArray rows,JSONObject command,String replacement){JSONArray out=new JSONArray();for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row==null||!replacement.isEmpty()&&replacement.equals(row.optString("key"))||!adding(row)&&sameRecord(row,command))continue;out.put(copy(row));}return out;}
    static void store(Context c,String uid,JSONArray rows){if(!WidgetNativeV164.prefs(c).edit().putString(PREFIX+uid,rows.toString()).commit())throw new IllegalStateException("기기에 저장하지 못했습니다. 다시 시도해주세요.");}
    static void storeBoth(Context c,String uid,JSONArray rows,JSONArray failed){if(!WidgetNativeV164.prefs(c).edit().putString(PREFIX+uid,rows.toString()).putString(FAILURES_PREFIX+uid,failed.toString()).commit())throw new IllegalStateException("기기에 저장하지 못했습니다. 입력과 초안을 유지했습니다.");}
    static void refresh(Context c){try{WidgetProvider.updateAll(c);}catch(Exception error){android.util.Log.w("AiderLogWidget","Stored action; host refresh deferred",error);}}
    static synchronized void enqueue(Context c,String uid,JSONObject input){
        if(!owns(c,uid))throw new IllegalStateException("계정이 변경되었습니다. 위젯을 다시 열어주세요.");JSONObject value=copy(input);if(!adding(value)||value.optString("key").isEmpty())put(value,"key","widget-private-"+UUID.randomUUID());JSONObject command=normalize(value,uid);JSONArray queued=read(c,uid),failed=errors(c,uid);String replacement=input.optString("replacesFailedKey");if(!replacement.isEmpty()){JSONObject old=findByKey(failed,replacement);if(old==null||!adding(old)||!adding(command))throw new IllegalArgumentException("이미 처리된 초안입니다. 목록을 다시 확인해주세요.");}JSONArray remaining=clearReplaced(failed,command,replacement),next=merge(queued,command);if(adding(command)&&addCount(next)+addCount(remaining)>100)throw new IllegalArgumentException("저장 대기·실패 초안이 100개입니다. ‘동기화 확인할 초안’에서 다시 입력하거나 삭제해주세요.");JSONObject data=project(raw(c),together(failed,queued));
        if(!adding(command)){JSONObject row=modelRow(data,command);if(row==null)throw new IllegalArgumentException("삭제된 기록입니다. 위젯을 동기화해주세요.");if(command.optString("op").equals("routine")&&goalLinked(row))throw new IllegalArgumentException("목표와 연결된 루틴은 앱에서 목표별 수행을 수정해주세요.");if(row.optLong("updatedAt")!=command.optLong("expectedUpdatedAt"))throw new IllegalArgumentException("다른 곳에서 변경된 기록입니다. 위젯을 새로 확인해주세요.");}
        storeBoth(c,uid,next,remaining);refresh(c);
    }
    public static synchronized String pending(Context c,String uid){if(!owns(c,uid))return "[]";JSONArray before=read(c,uid),after=claim(before);if(!before.toString().equals(after.toString()))store(c,uid,after);JSONObject command=claimed(after);return command==null?"[]":new JSONArray().put(command).toString();}
    public static synchronized boolean ack(Context c,String uid,String key,String receiptJson){if(!owns(c,uid))return false;try{JSONArray before=read(c,uid),after=acknowledge(before,raw(c),uid,key,new JSONObject(receiptJson));if(after==before)return false;store(c,uid,after);refresh(c);return true;}catch(Exception error){return false;}}
    public static synchronized boolean fail(Context c,String uid,String key,String code){if(!owns(c,uid)||code==null||!code.startsWith("widget/"))return false;JSONArray before=read(c,uid),marked=failure(before,uid,key,code);if(before.toString().equals(marked.toString()))return false;JSONObject failed=findByKey(marked,key);try{storeBoth(c,uid,without(before,key),archive(errors(c,uid),failed));refresh(c);return true;}catch(Exception error){return false;}}
    static JSONObject findByKey(JSONArray rows,String key){for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&key.equals(row.optString("key")))return row;}return null;}
    static synchronized JSONArray failedAdds(Context c,String uid){JSONArray out=new JSONArray();if(!owns(c,uid))return out;JSONArray rows=errors(c,uid);for(int i=0;i<rows.length();i++){JSONObject row=rows.optJSONObject(i);if(row!=null&&uid.equals(row.optString("uid"))&&adding(row))out.put(copy(row));}return out;}
    static synchronized boolean discardFailed(Context c,String uid,String key){if(!owns(c,uid))return false;JSONArray failed=errors(c,uid);JSONObject row=findByKey(failed,key);if(row==null||!uid.equals(row.optString("uid"))||!adding(row))return false;try{storeBoth(c,uid,read(c,uid),without(failed,key));refresh(c);return true;}catch(Exception error){return false;}}
    static synchronized void retryFailed(Context c,String uid,String oldKey,JSONObject command){JSONObject retry=copy(command);put(retry,"replacesFailedKey",oldKey);enqueue(c,uid,retry);}
    /** Projection is a copy; raw cloud snapshots and their acknowledgement proof stay intact. */
    static JSONObject project(JSONObject raw,JSONArray queued){
        JSONObject out=copy(raw);String uid=owner(out);if(uid.isEmpty())return out;JSONObject m=model(out);JSONArray todos=cloneRows(a(m,"todos")),notes=cloneRows(a(m,"notes"));put(m,"todos",todos);put(m,"notes",notes);int failures=0;
        for(int i=0;i<queued.length();i++){JSONObject command=queued.optJSONObject(i);if(command==null||!uid.equals(command.optString("uid")))continue;String op=command.optString("op"),id=command.optString("id"),state=command.optString("state");boolean failed=state.equals("failed");JSONObject row=modelRow(out,command);
            if(adding(command)){if(row==null){row=put(put(put(put(put(new JSONObject(),"id",id),"title",command.optString("value")),"updatedAt",command.optLong("createdAt")),"kind",op.equals("add-memo")?"note":"todo"),"source","checklists");put(row,"done",false);put(row,"dueAt",command.optString("date"));JSONArray rows=op.equals("add-memo")?notes:todos;JSONArray first=new JSONArray().put(row);for(int n=0;n<rows.length();n++)first.put(rows.opt(n));if(op.equals("add-memo")){notes=first;put(m,"notes",notes);}else{todos=first;put(m,"todos",todos);}}}
            else if(row!=null&&!failed){if(op.equals("routine")&&!goalLinked(row)){JSONObject levels=row.optJSONObject("dailyLevels");if(levels==null)levels=new JSONObject();String value=command.optString("value"),date=command.optString("date");if(value.isEmpty())levels.remove(date);else put(levels,date,value);put(row,"dailyLevels",levels);JSONArray before=a(row,"doneDates"),after=new JSONArray();for(int n=0;n<before.length();n++)if(!date.equals(before.optString(n)))after.put(before.optString(n));if(!value.isEmpty()&&!value.equals("SKIP"))after.put(date);put(row,"doneDates",after);}else if(op.equals("todo"))put(row,"done",command.optString("value").equals("true"));}
            if(failed)failures++;if(row!=null){put(row,"_widgetPendingV196",!failed);if(failed)put(row,"_widgetFailedV196",command.optString("error"));else row.remove("_widgetFailedV196");}
        }
        JSONArray incomplete=new JSONArray();for(int i=0;i<todos.length();i++){JSONObject row=todos.optJSONObject(i);if(row!=null&&!row.optBoolean("done"))incomplete.put(row);}put(m,"incompleteTodos",incomplete);put(out,"privateFailureCountV196",failures);return WidgetRoutineV195.atDay(out,WidgetNativeV164.day(Calendar.getInstance()));
    }
    static synchronized JSONObject overlay(Context c,JSONObject data){String uid=owner(data);return uid.isEmpty()?data:project(data,together(errors(c,uid),read(c,uid)));}
    static Intent action(JSONObject data,int widget,String kind,JSONObject row,String value,boolean toggle){Intent result=WidgetDesignV165.action(data,widget,kind,row,"routine",value);try{JSONObject command=new JSONObject(Uri.decode(result.getStringExtra("action").substring("widget-v165:".length())));put(command,"toggleComplete",toggle);result.putExtra("action","widget-v165:"+Uri.encode(command.toString()));}catch(Exception ignored){}return result;}
    static PendingIntent collection(Context c,int widget,String kind,String uid){Intent intent=new Intent().setClassName(c,c.getPackageName()+".WidgetActionReceiverV196").setAction("aiderlog.widget.private."+widget+"."+kind).setData(Uri.parse("aiderlog-widget-private://"+widget+"/"+Uri.encode(kind)+"/"+Uri.encode(uid))).putExtra("boundUid",uid).putExtra("appWidgetId",widget).putExtra("kind",kind);return PendingIntent.getBroadcast(c,widget*31+kind.hashCode(),intent,PendingIntent.FLAG_UPDATE_CURRENT|(android.os.Build.VERSION.SDK_INT>=31?PendingIntent.FLAG_MUTABLE:0));}
    /** Each collection child supplies either an add form or a completion action. */
    static PendingIntent noteCollection(Context c,int widget,String kind,String uid){String type=kind.endsWith("@todos")?"todo":"memo";Intent intent=new Intent().setClassName(c,c.getPackageName()+".WidgetNoteActivityV196").setAction("aiderlog.widget.note.collection.v197."+widget+"."+kind).setData(Uri.parse("aiderlog-widget-note-collection://"+widget+"/"+Uri.encode(kind)+"/"+Uri.encode(uid))).putExtra("boundUid",uid).putExtra("uid",uid).putExtra("appWidgetId",widget).putExtra("kind",kind).putExtra("noteType",type);return PendingIntent.getActivity(c,widget*37+kind.hashCode(),intent,PendingIntent.FLAG_UPDATE_CURRENT|(android.os.Build.VERSION.SDK_INT>=31?PendingIntent.FLAG_MUTABLE:0));}
}
