package com.aiderlog.v22app;

import android.app.Activity;
import android.app.AlertDialog;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.DashPathEffect;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.RemoteViews;
import android.widget.TextView;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import static com.aiderlog.v22app.WidgetNativeV164.*;

/** v12 content-specific native cards. Picker XML and runtime share component resources. */
public final class WidgetDesignV165 {
    public static final ThreadLocal<String> previewContent=new ThreadLocal<String>();
    public static final ThreadLocal<Integer> previewOpacity=new ThreadLocal<Integer>();
    static String base(String k){return k==null?"":k.split("@")[0];}
    static boolean wide(Context c,int w){Bundle b=AppWidgetManager.getInstance(c).getAppWidgetOptions(w);return b.getInt("appWidgetMinWidth",320)>=560;}
    static JSONObject model(JSONObject d){JSONObject m=d.optJSONObject("v165");return m==null?new JSONObject():m;}
    static JSONObject options(Context c,int w){try{String raw=previewContent.get();if(raw==null)raw=prefs(c).getString("widget_content_"+w,"");return raw.startsWith("{")?new JSONObject(raw):new JSONObject().put("legacy",raw);}catch(Exception e){return new JSONObject();}}
    static JSONArray a(JSONObject d,String key){JSONArray a=d.optJSONArray(key);return a==null?new JSONArray():a;}
    static JSONObject put(JSONObject o,String k,Object v){try{o.put(k,v);}catch(Exception ignored){}return o;}
    static JSONObject card(String type){return put(new JSONObject(),"kind",type);}
    static JSONObject copy(JSONObject o){try{return new JSONObject(o.toString());}catch(Exception e){return new JSONObject();}}
    static void add(List<JSONObject> out,JSONArray rows){for(int i=0;i<rows.length();i++){JSONObject r=rows.optJSONObject(i);if(r!=null)out.add(copy(r));}}
    static List<JSONObject> groups(List<JSONObject> rows,int columns){if(columns<2)return rows;List<JSONObject> out=new ArrayList<JSONObject>();for(int i=0;i<rows.size();i+=columns){JSONArray children=new JSONArray();for(int j=i;j<Math.min(rows.size(),i+columns);j++)children.put(rows.get(j));out.add(put(put(card("group"),"children",children),"columns",columns));}return out;}
    static String fmt(double n){return n==Math.rint(n)?String.valueOf((long)n):String.format(Locale.US,"%.1f",n);}
    static String value(JSONObject r,String k){return r.isNull(k)||!r.has(k)?"":fmt(r.optDouble(k));}
    static JSONObject choose(JSONArray rows,String id){for(int i=0;i<rows.length();i++){JSONObject r=rows.optJSONObject(i);if(r!=null&&r.optString("id").equals(id))return r;}return rows.length()>0?rows.optJSONObject(0):null;}
    static boolean twoPanels(String kind,boolean wide){return wide&&(kind.equals("PersonalWorkflowAll")||kind.equals("RoutineStats")||kind.equals("PersonalWorkoutMeal")||kind.equals("PersonalWorkoutChallengeCombined")||kind.equals("PersonalWorkoutStatsInbody")||kind.equals("PersonalQuote"));}
    public static RemoteViews render(Context c,int w,String kind,boolean preview,String chosenTheme,int opacity,int size){
        JSONObject data=snapshot(c),m=model(data);boolean landscape=wide(c,w),split=twoPanels(kind,landscape);RemoteViews v=view(c,split?"widget_design_v165_wide":"widget_design_v165");
        appearance(c,v,w,chosenTheme,opacity,size);show(c,v,"widget_subtitle",false);show(c,v,"w165_secondary",split);
        boolean bullet=kind.startsWith("PersonalBullet")||kind.equals("PersonalToday"),memo=kind.equals("PersonalWorkflowOne")||kind.equals("PersonalWorkflowAll")||kind.equals("PersonalTodo");
        int range=options(c,w).optInt("rangeDays",kind.contains("Seven")?7:3);if(bullet){range=range==7?7:3;if(!preview)prefs(c).edit().putInt("widget_range_"+w,range).apply();}
        int page=prefs(c).getInt("widget_page_"+w,0);boolean pager=bullet&&range==7&&!landscape;
        show(c,v,"widget_previous",pager);show(c,v,"widget_next",pager);show(c,v,"widget_add",memo);
        String title="";JSONObject rs=m.optJSONObject("routineStats");
        if(kind.startsWith("Routine")&&!kind.contains("Language"))title=rs==null?"":rs.optInt("todayDone")+" / "+rs.optInt("total")+" 완료";
        else if(kind.equals("PersonalTodo")){int done=0;JSONArray ts=a(m,"todos");for(int i=0;i<ts.length();i++)if(ts.optJSONObject(i).optBoolean("done"))done++;title=done+" / "+ts.length()+" 완료";}
        else if(bullet)title=bulletRange(c,w,kind,m)+(pager?" · "+(Math.min(4,page)+1)+"–"+Math.min(7,Math.min(4,page)+3)+" / 7":"");
        else if(kind.equals("PersonalWorkoutStats"))title="최근 "+options(c,w).optInt("period",7)+"일";
        else if(kind.equals("PersonalMeal")||kind.equals("PersonalWorkoutMeal")||kind.equals("PersonalWorkout"))title=m.optString("today","");
        else if(kind.equals("PersonalReading")){int reading=0;JSONArray bs=a(m,"books");for(int i=0;i<bs.length();i++)if(bs.optJSONObject(i).optString("status").equals("reading"))reading++;title="읽는 중 "+reading+"권";}
        show(c,v,"w165_header",!title.isEmpty()||pager||memo);text(c,v,"widget_title",title);v.setOnClickPendingIntent(id(c,"widget_root"),open(c,w,kind,""));
        v.setOnClickPendingIntent(id(c,"widget_previous"),navigate(c,w,kind,"bullet","-1"));v.setOnClickPendingIntent(id(c,"widget_next"),navigate(c,w,kind,"bullet","1"));
        v.setOnClickPendingIntent(id(c,"widget_add"),open(c,w,kind,"widget-v165:"+Uri.encode(put(put(put(card("action"),"op",kind.equals("PersonalTodo")?"add-todo":"add-memo"),"uid",m.optString("uid")),"widgetId",w).toString())));
        List<String> main=rows(c,w,kind,data);String access=data.optString("accessState","");text(c,v,"widget_empty","needs-login".equals(access)?"앱에서 로그인 후 기록을 연결해주세요.":"sync-required".equals(access)?"앱에서 계정 기록을 동기화해주세요.":"저장된 기록이 없습니다.");show(c,v,"widget_empty",main.isEmpty());show(c,v,"widget_items_v164",!main.isEmpty());
        if(preview){show(c,v,"widget_items_v164",false);show(c,v,"widget_preview_rows_v164",true);v.removeAllViews(id(c,"widget_preview_rows_v164"));for(int i=0;i<Math.min(5,main.size());i++)v.addView(id(c,"widget_preview_rows_v164"),row(c,w,kind,main.get(i),i,chosenTheme,size));}
        else WidgetNativeV164.collection(c,v,w,kind,main,id(c,"widget_items_v164"));
        if(split){List<String> right=rows(c,w,kind+"@right",data);show(c,v,"w165_secondary_list",!right.isEmpty());if(preview){show(c,v,"w165_secondary_list",false);show(c,v,"w165_secondary_preview",true);v.removeAllViews(id(c,"w165_secondary_preview"));for(int i=0;i<Math.min(5,right.size());i++)v.addView(id(c,"w165_secondary_preview"),row(c,w,kind,right.get(i),i,chosenTheme,size));}else WidgetNativeV164.collection(c,v,w,kind+"@right",right,id(c,"w165_secondary_list"));}
        return v;
    }
    static String bulletRange(Context c,int w,String kind,JSONObject m){int range=options(c,w).optInt("rangeDays",kind.contains("Seven")?7:3);String start=m.optString("today",day(Calendar.getInstance()));if(range==7&&a(m,"weekDates").length()>0)start=a(m,"weekDates").optString(0);Calendar end=date(start);end.add(Calendar.DAY_OF_MONTH,range-1);return start.substring(Math.min(5,start.length()))+" – "+day(end).substring(5);}
    public static List<String> rows(Context c,int w,String fullKind,JSONObject data){
        JSONObject m=model(data),o=options(c,w);String k=base(fullKind);boolean right=fullKind.contains("@right"),landscape=wide(c,w),split=twoPanels(k,landscape);List<JSONObject> out=new ArrayList<JSONObject>();
        if(k.equals("PersonalWorkflowOne")){add(out,a(m,"notes"));out=groups(out,landscape?2:1);}
        else if(k.equals("PersonalWorkflowAll")){if(!right)add(out,a(m,"notes"));if(!split||right)add(out,a(m,"todos"));}
        else if(k.equals("PersonalTodo"))add(out,a(m,"todos"));
        else if(k.startsWith("Routine")&&!k.contains("Language")){
            if(!right){if(k.equals("RoutineCards")){JSONObject selected=choose(a(m,"routines"),o.optString("id"));if(selected!=null)out.add(put(copy(selected),"detail",true));}else{add(out,a(m,"routines"));out=groups(out,landscape?2:1);}}
            if(k.equals("RoutineStats")&&(!split||right)){JSONObject stats=m.optJSONObject("routineStats");if(stats!=null)out.add(put(put(copy(stats),"kind","routineStats"),"id","routine-statistics"));}
        }else if(k.contains("RoutineLanguage")){if(k.equals("RoutineLanguage")){JSONObject r=choose(a(m,"language"),o.optString("id",o.optString("legacy").equals("일본어")?"ja":"en"));if(r!=null)out.add(copy(r));}else add(out,a(m,"language"));}
        else if(k.equals("LanguageYoutube")){JSONArray y=a(data,"youtubeNotes");for(int i=0;i<y.length();i++)out.add(put(put(card("youtube"),"title",y.optString(i)),"id","youtube-"+i));}
        else if(k.equals("PersonalMeal")||k.equals("PersonalWorkoutMeal")){if(!right){List<JSONObject> meals=new ArrayList<JSONObject>();JSONArray a=a(m,"meals");for(int i=0;i<a.length();i++)meals.add(put(copy(a.optJSONObject(i)),"kind","meal"));out.addAll(groups(meals,landscape?4:2));}if(k.equals("PersonalWorkoutMeal")&&(!split||right))for(int i=0;i<a(m,"workouts").length();i++){JSONObject r=a(m,"workouts").optJSONObject(i);if(r.optString("date").equals(m.optString("today")))out.add(copy(r));}}
        else if(k.equals("PersonalWorkoutStats")){out.add(workoutStats(m,o.optInt("period",7)));out.addAll(workoutTrends(m,o.optInt("period",7)));}
        else if(k.equals("PersonalWorkout")||k.equals("PersonalWorkoutChallenge")){for(int i=0;i<a(m,"workouts").length();i++){JSONObject r=a(m,"workouts").optJSONObject(i);if(r.optString("date").equals(m.optString("today")))out.add(copy(r));}if(k.equals("PersonalWorkoutChallenge"))add(out,a(m,"challenges"));}
        else if(k.startsWith("PersonalWorkoutChallenge")||k.equals("PersonalWorkoutStatsInbody")){
            JSONArray all=a(m,"challenges");JSONObject selected=choose(all,o.optString("id"));
            if(k.equals("PersonalWorkoutChallengeOnly")){if(selected!=null)out.add(put(copy(selected),"detail",true));}
            else if(k.equals("PersonalWorkoutChallengeCombined")){if(!right&&selected!=null)out.add(put(copy(selected),"detail",true));if(!split||right)for(int i=0;i<all.length();i++){JSONObject r=all.optJSONObject(i);if(selected==null||!r.optString("id").equals(selected.optString("id")))out.add(copy(r));}}
            else{if(!right){add(out,all);out=groups(out,landscape?2:1);}if(k.equals("PersonalWorkoutStatsInbody")&&(!split||right)){String[] names={"체중","골격근량","체지방률"},keys={"weight","muscle","fat"},units={"kg","kg","%"};JSONArray b=a(m,"inbody");for(int p=0;p<3;p++){JSONArray vals=new JSONArray();for(int n=Math.max(0,b.length()-4);n<b.length();n++){JSONObject item=b.optJSONObject(n);if(!item.isNull(keys[p]))vals.put(item.optDouble(keys[p]));}if(vals.length()>0)out.add(put(put(put(put(card("trend"),"title",names[p]),"values",vals),"unit",units[p]),"dash",p));}}}
        }else if(k.equals("PersonalReading")){JSONArray books=a(m,"books");String filter=o.optString("filter","all");for(int i=0;i<books.length();i++){JSONObject book=books.optJSONObject(i);if(filter.equals("all")||filter.equals(book.optString("status")))out.add(copy(book));}out=groups(out,landscape?4:2);}
        else if(k.equals("PersonalQuote")){JSONObject book=choose(a(m,"books"),o.optString("id",m.optString("currentBookId")));if(book!=null){if(!right)out.add(copy(book));if(!split||right)out.add(put(put(put(put(card("quote"),"body",book.optString("quote")),"page",book.opt("quotePage")),"id",book.optString("recordId")),"title",book.optString("title")));}}
        else if(k.startsWith("PersonalBullet")||k.equals("PersonalToday")){
            int range=o.optInt("rangeDays",k.contains("Seven")?7:3);range=range==7?7:3;String start=m.optString("today",day(Calendar.getInstance()));if(range==7&&a(m,"weekDates").length()>0)start=a(m,"weekDates").optString(0);
            int begin=range==7&&!landscape?Math.max(0,Math.min(4,prefs(c).getInt("widget_page_"+w,0))):0,end=range==7&&!landscape?begin+3:range;
            List<JSONObject> dateCards=new ArrayList<JSONObject>();JSONObject dates=m.optJSONObject("dates");JSONArray schedules=a(data,"scheduleItems");
            for(int i=begin;i<end;i++){Calendar d=date(start);d.add(Calendar.DAY_OF_MONTH,i);String dateKey=day(d);List<String> lines=eventsOn(schedules,dateKey);JSONArray entries=dates==null?new JSONArray():a(dates,dateKey);for(int n=0;n<entries.length();n++){JSONObject r=entries.optJSONObject(n);if(!"emotion".equals(r.optString("type")))lines.add((r.optString("time").isEmpty()?"":r.optString("time")+" ")+r.optString("title"));}java.util.Collections.sort(lines,new java.util.Comparator<String>(){public int compare(String a,String b){String at=a.matches("^[0-9]{2}:[0-9]{2}.*")?a.substring(0,5):"99:99",bt=b.matches("^[0-9]{2}:[0-9]{2}.*")?b.substring(0,5):"99:99";return at.compareTo(bt);}});String body=join(lines);dateCards.add(put(put(put(card("day"),"title",new String[]{"일","월","화","수","목","금","토"}[d.get(Calendar.DAY_OF_WEEK)-1]+" "+d.get(Calendar.DAY_OF_MONTH)),"body",body),"id",dateKey));}
            out.addAll(groups(dateCards,landscape?range:range==7?3:1));add(out,a(m,"notes"));add(out,a(m,"todos"));if(k.contains("Workflow"))add(out,a(m,"workflows"));
        }
        List<String> strings=new ArrayList<String>();for(JSONObject row:out)strings.add(row.toString());return strings;
    }
    static String join(List<String> list){StringBuilder s=new StringBuilder();for(String value:list){if(s.length()>0)s.append('\n');s.append(value);}return s.toString();}
    static List<JSONObject> workoutTrends(JSONObject m,int period){
        period=period==30||period==90?period:7;Calendar from=date(m.optString("today"));from.add(Calendar.DAY_OF_MONTH,1-period);String start=day(from);
        java.util.Map<String,java.util.TreeMap<String,Double>> metrics=new java.util.LinkedHashMap<String,java.util.TreeMap<String,Double>>();
        JSONArray workouts=a(m,"workouts");for(int i=0;i<workouts.length();i++){JSONObject r=workouts.optJSONObject(i);String d=r.optString("date");if(d.compareTo(start)<0||d.compareTo(m.optString("today"))>0)continue;JSONArray es=a(r,"exercises");for(int j=0;j<es.length();j++){JSONObject ex=es.optJSONObject(j);JSONArray sets=a(ex,"sets");for(int n=0;n<sets.length();n++)for(String metric:new String[]{"weight","seconds"}){JSONObject set=sets.optJSONObject(n);if(set.isNull(metric)||set.optDouble(metric)<=0)continue;String key=ex.optString("name")+"|"+metric;java.util.TreeMap<String,Double> dates=metrics.get(key);if(dates==null){dates=new java.util.TreeMap<String,Double>();metrics.put(key,dates);}dates.put(d,Math.max(dates.containsKey(d)?dates.get(d):0,set.optDouble(metric)));}}}
        List<JSONObject> cards=new ArrayList<JSONObject>();for(String key:metrics.keySet()){String[] parts=key.split("\\|");JSONArray values=new JSONArray();double max=0;for(double value:metrics.get(key).values()){values.put(value);max=Math.max(max,value);}String unit=parts[1].equals("weight")?"kg":"초";JSONObject r=put(put(put(put(put(card("trend"),"id","exercise:"+key),"title",parts[0]+" · 최고 "+fmt(max)+unit),"unit",unit),"values",values),"foot","기록 날짜별 최고값 · 최근 "+period+"일");cards.add(r);}return cards;
    }
    static long stableId(String json,int position){try{JSONObject row=new JSONObject(json);String value=row.optString("kind")+":"+row.optString("id");JSONArray children=row.optJSONArray("children");if(children!=null)for(int i=0;i<children.length();i++)value+="|"+children.optJSONObject(i).optString("id");if(value.endsWith(":"))value+=row.optString("title");return ((long)value.hashCode()<<32)^(long)Integer.rotateLeft(value.hashCode(),13);}catch(Exception e){return ((long)json.hashCode()<<32)^position;}}
    static JSONObject workoutStats(JSONObject m,int period){period=period==30||period==90?period:7;Calendar begin=date(m.optString("today"));begin.add(Calendar.DAY_OF_MONTH,1-period);String start=day(begin);double total=0,longest=0;int count=0,measured=0;double[] days=new double[7];List<String> best=new ArrayList<String>();
        JSONArray workouts=a(m,"workouts");for(int i=0;i<workouts.length();i++){JSONObject r=workouts.optJSONObject(i);if(r.optString("date").compareTo(start)<0||r.optString("date").compareTo(m.optString("today"))>0)continue;count++;if(!r.isNull("minutes")){double min=r.optDouble("minutes");total+=min;longest=Math.max(longest,min);measured++;days[(date(r.optString("date")).get(Calendar.DAY_OF_WEEK)+5)%7]+=min;}}
        JSONArray values=new JSONArray();for(double n:days)values.put(n);return put(put(put(put(put(put(card("workoutStats"),"count",count),"total",measured>0?total:JSONObject.NULL),"average",measured>0?total/measured:JSONObject.NULL),"longest",measured>0?longest:JSONObject.NULL),"values",values),"period",period);
    }
    static void bitmap(Context c,RemoteViews v,String id,String data){v.setImageViewResource(id(c,id),0);if(data==null||!data.startsWith("data:image/"))return;try{byte[] bytes=android.util.Base64.decode(data.substring(data.indexOf(',')+1),0);Bitmap bm=BitmapFactory.decodeByteArray(bytes,0,bytes.length);if(bm!=null)v.setImageViewBitmap(id(c,id),bm);}catch(Exception ignored){}}
    static Intent action(JSONObject data,int w,String kind,JSONObject row,String op,String value){JSONObject payload=put(put(put(put(put(put(put(card("action"),"uid",model(data).optString("uid")),"widgetId",w),"kind",base(kind)),"op",op),"id",row.optString("id")),"value",value),"date",model(data).optString("today"));put(payload,"expectedUpdatedAt",row.optLong("updatedAt"));put(payload,"recordId",row.optString("recordId"));put(payload,"key",payload.optString("uid")+":"+w+":"+op+":"+row.optString("id")+":"+payload.optString("date")+":"+value+":"+row.optLong("updatedAt"));return new Intent().putExtra("action","widget-v165:"+Uri.encode(payload.toString()));}
    public static RemoteViews row(Context c,int w,String kind,String json,int index,String selectedTheme,int selectedFont){try{return component(c,w,kind,new JSONObject(json),false,selectedTheme,selectedFont);}catch(Exception e){RemoteViews fallback=view(c,"widget_note_v165");text(c,fallback,"w165_title","기록을 다시 불러와주세요.");return fallback;}}
    static RemoteViews component(Context c,int w,String kind,JSONObject r,boolean cell,String overrideTheme,int selectedFont){
        String type=r.optString("kind","note");if(type.equals("group")){RemoteViews group=view(c,"widget_group_v165");JSONArray children=a(r,"children");group.removeAllViews(id(c,"w165_group"));for(int i=0;i<children.length();i++)group.addView(id(c,"w165_group"),component(c,w,kind,children.optJSONObject(i),true,overrideTheme,selectedFont));for(int i=children.length();i<r.optInt("columns");i++)group.addView(id(c,"w165_group"),view(c,"widget_empty_cell_v165"));return group;}
        String template=type.equals("routineStats")||type.equals("workoutStats")||type.equals("trend")?"stats":type.equals("youtube")?"note":type.equals("meal")?"meal_slot":type;
        RemoteViews v=view(c,"widget_"+template+"_v165"+(cell?"_cell":""));JSONObject data=snapshot(c);String chosen=overrideTheme==null?theme(c,w):overrideTheme;int fg=ink(c,chosen);float fs=selectedFont<0?font(c,w):11.5f+selectedFont*.8f;
        if(!type.equals("meal")){v.setImageViewResource(id(c,"w165_card_background"),drawable(c,dark(c,chosen)?"widget_card_dark_v165":"widget_card_v165"));Integer po=previewOpacity.get();int opacity=po==null?prefs(c).getInt("widget_opacity_"+w,100):po;v.setInt(id(c,"w165_card_background"),"setImageAlpha",Math.round(255*Math.max(0,Math.min(100,opacity))/100f));}
        v.setOnClickFillInIntent(id(c,"w165_card"),action(data,w,kind,r,type.equals("youtube")?"youtube":"open",type));
        if(type.equals("meal")){bitmap(c,v,"w165_photo",r.optString("image"));text(c,v,"w165_time",r.optString("time"));show(c,v,"w165_time",!r.optString("time").isEmpty());int stars=r.optInt("rating");String rating="";if(!r.isNull("rating"))for(int n=0;n<5;n++)rating+=n<stars?"★":"☆";text(c,v,"w165_rating",rating);return v;}
        text(c,v,"w165_title",r.optString("title"));color(c,v,"w165_title",fg);v.setTextViewTextSize(id(c,"w165_title"),2,fs+.5f);
        if(!type.equals("todo")){text(c,v,"w165_body",r.optString("body"));color(c,v,"w165_body",fg);v.setTextViewTextSize(id(c,"w165_body"),2,fs-1);}
        if(!type.equals("workout")&&!type.equals("day")){color(c,v,"w165_meta",fg);v.setTextViewTextSize(id(c,"w165_meta"),2,Math.max(10,fs-2));}
        if(type.equals("note")||type.equals("youtube")){text(c,v,"w165_body",r.optString("preview"));text(c,v,"w165_meta",r.optLong("updatedAt")>0?new java.text.SimpleDateFormat("MM.dd HH:mm",Locale.KOREAN).format(new java.util.Date(r.optLong("updatedAt"))):"");show(c,v,"w165_body",!r.optString("preview").isEmpty());}
        if(type.equals("todo")){boolean done=r.optBoolean("done");text(c,v,"w165_check",done?"✓":"");v.setInt(id(c,"w165_check"),"setBackgroundResource",drawable(c,done?"widget_check_done_v165":"widget_check_v165"));v.setInt(id(c,"w165_title"),"setPaintFlags",done?17:1);color(c,v,"w165_title",done?0xff8b8b9b:fg);text(c,v,"w165_meta",r.optString("dueAt"));show(c,v,"w165_meta",!r.optString("dueAt").isEmpty());v.setOnClickFillInIntent(id(c,"w165_check"),action(data,w,kind,r,"todo",done?"false":"true"));}
        if(type.equals("routine")||type.equals("challenge")||type.equals("book")||type.equals("workflow")){boolean valid=!r.isNull("percent")&&r.has("percent");show(c,v,"w165_progress",valid);v.setProgressBar(id(c,"w165_progress"),100,r.optInt("percent"),false);}
        if(type.equals("routine")){text(c,v,"w165_meta",r.optInt("done")+" / "+value(r,"goalDays")+"일 · "+r.optInt("streak")+"일 연속");text(c,v,"w165_body",r.optString(r.optString("level").toLowerCase()+"Text"));show(c,v,"w165_graph",r.optBoolean("detail"));if(r.optBoolean("detail"))v.setImageViewBitmap(id(c,"w165_graph"),graph("nodes",a(r,"week"),fg,0));for(int i=0;i<4;i++){String label=new String[]{"MINI","MORE","MAX","SKIP"}[i];color(c,v,"w165_level_"+i,label.equals(r.optString("level"))?PRIMARY:fg);v.setOnClickFillInIntent(id(c,"w165_level_"+i),action(data,w,kind,r,"routine",label));}}
        if(type.equals("language")){text(c,v,"w165_meta",r.optInt("streak")+"일 연속 · 이번 주 "+r.optInt("weekCount")+" / 7");text(c,v,"w165_body",r.isNull("minutes")?"학습 시간 기록 없음":"학습 "+value(r,"minutes")+"분");v.setImageViewBitmap(id(c,"w165_graph"),graph("stars",a(r,"week"),fg,0));v.setContentDescription(id(c,"w165_graph"),weekDescription(a(r,"week")));v.setOnClickFillInIntent(id(c,"w165_action"),action(data,w,kind,r,"language",r.optString("language")));}
        if(type.equals("routineStats")){text(c,v,"w165_title","이번 주");text(c,v,"w165_meta",r.isNull("weekPercent")?"기록 없음":r.optInt("weekPercent")+"%");text(c,v,"w165_body",r.optInt("streak")+"일 연속\n누적 "+r.optInt("cumulative")+"회");text(c,v,"w165_foot","월 – 일 완료 횟수");v.setImageViewBitmap(id(c,"w165_graph"),graph("bars",a(r,"weekCounts"),fg,0));}
        if(type.equals("workoutStats")){text(c,v,"w165_title","최근 "+r.optInt("period")+"일");text(c,v,"w165_meta","운동 "+r.optInt("count")+"회");text(c,v,"w165_body",r.isNull("total")?"운동 시간 기록 없음":"총 "+value(r,"total")+"분 · 평균 "+value(r,"average")+"분\n최장 "+value(r,"longest")+"분");text(c,v,"w165_foot","요일별 운동 시간");v.setImageViewBitmap(id(c,"w165_graph"),graph("bars",a(r,"values"),fg,0));}
        if(type.equals("trend")){JSONArray values=a(r,"values");text(c,v,"w165_meta",values.length()>0?fmt(values.optDouble(0))+" → "+fmt(values.optDouble(values.length()-1))+r.optString("unit"):"기록 없음");text(c,v,"w165_body","");text(c,v,"w165_foot",r.optString("foot","최근 "+values.length()+"회 · 항목 자체 범위"));v.setImageViewBitmap(id(c,"w165_graph"),graph("trend",values,fg,r.optInt("dash")));}
        if(type.equals("challenge")){text(c,v,"w165_meta","DAY "+r.optInt("day")+" / "+r.optInt("goal"));text(c,v,"w165_body",r.optBoolean("detail")?r.optString("variant")+" "+value(r,"target")+r.optString("unit")+"\n"+r.optInt("streak")+"일 연속":"");show(c,v,"w165_graph",r.optBoolean("detail"));if(r.optBoolean("detail"))v.setImageViewBitmap(id(c,"w165_graph"),graph("nodes",a(r,"nodes"),fg,0));}
        if(type.equals("workout")){List<String> lines=new ArrayList<String>();if(!r.isNull("minutes"))lines.add(value(r,"minutes")+"분");JSONArray es=a(r,"exercises");for(int i=0;i<es.length();i++){JSONObject e=es.optJSONObject(i);List<String> sets=new ArrayList<String>();JSONArray ss=a(e,"sets");for(int j=0;j<ss.length();j++){JSONObject st=ss.optJSONObject(j);sets.add((st.optDouble("weight")>0?value(st,"weight")+"kg × ":"")+(st.optDouble("seconds")>0?value(st,"seconds")+"초":value(st,"reps")+"회"));}lines.add(e.optString("name")+" · "+join(sets).replace('\n','/'));}text(c,v,"w165_body",join(lines));}
        if(type.equals("book")){bitmap(c,v,"w165_cover",r.optString("image"));text(c,v,"w165_meta",r.optString("author"));text(c,v,"w165_body",r.optString("status").equals("finished")?"완독":r.optString("status").equals("want")?"읽고 싶은 책":r.isNull("totalPages")||r.optDouble("totalPages")<=0?"페이지 기록 없음":value(r,"currentPage")+" / "+value(r,"totalPages")+"쪽 · "+r.optInt("percent")+"%");}
        if(type.equals("quote")){text(c,v,"w165_title","저장한 문장");text(c,v,"w165_body",r.optString("body").isEmpty()?"저장된 문장이 없습니다.":r.optString("body"));text(c,v,"w165_meta",r.isNull("page")?"":"p. "+value(r,"page"));}
        if(type.equals("workflow")){text(c,v,"w165_meta",r.optString("status"));List<String> steps=new ArrayList<String>();JSONArray ss=a(r,"steps");for(int n=0;n<ss.length();n++){JSONObject x=ss.optJSONObject(n);steps.add((x.optBoolean("done")?"✓ ":"○ ")+x.optString("text"));}text(c,v,"w165_body",join(steps));}
        return v;
    }
    static String weekDescription(JSONArray days){String[] labels={"월","화","수","목","금","토","일"};StringBuilder text=new StringBuilder();for(int i=0;i<days.length();i++)text.append(labels[i%7]).append(days.optBoolean(i)?" 완료 ":" 미완료 ");return text.toString();}
    static Bitmap graph(String type,JSONArray values,int fg,int dash){
        int width=700,height=180;Bitmap bitmap=Bitmap.createBitmap(width,height,Bitmap.Config.ARGB_8888);Canvas canvas=new Canvas(bitmap);Paint p=new Paint(3);p.setStrokeWidth(3);p.setTextSize(23);p.setTextAlign(Paint.Align.CENTER);double max=1,min=Double.MAX_VALUE;for(int i=0;i<values.length();i++){max=Math.max(max,values.optDouble(i));min=Math.min(min,values.optDouble(i));}
        if(type.equals("bars")){float step=width/7f;for(int i=0;i<7;i++){float x=step*i+step/2,h=(float)(values.optDouble(i)/max*120);p.setColor(0xffded9ff);canvas.drawRect(x-22,18,x+22,138,p);p.setColor(PRIMARY);canvas.drawRect(x-22,138-h,x+22,138,p);p.setColor(fg);canvas.drawText(new String[]{"월","화","수","목","금","토","일"}[i],x,170,p);}}
        else if(type.equals("trend")){p.setColor(PRIMARY);p.setStyle(Paint.Style.STROKE);p.setStrokeWidth(4);if(dash>0)p.setPathEffect(new DashPathEffect(dash==1?new float[]{16,9}:new float[]{4,9},0));Path line=new Path();for(int i=0;i<values.length();i++){float x=25+(width-50)*i/(float)Math.max(1,values.length()-1),y=(float)(140-(values.optDouble(i)-min)/Math.max(.01,max-min)*100);if(i==0)line.moveTo(x,y);else line.lineTo(x,y);}canvas.drawPath(line,p);}
        else {int count=values.length(),columns=count>7?10:7,rows=(count+columns-1)/columns;float step=width/(float)columns;for(int i=0;i<count;i++){float x=step*(i%columns)+step/2,y=rows>1?22+(i/columns)*(140f/Math.max(1,rows-1)):65;boolean done=values.optBoolean(i);p.setColor(PRIMARY);p.setStrokeWidth(3);if(type.equals("stars")){if(i>0){p.setPathEffect(values.optBoolean(i-1)&&done?null:new DashPathEffect(new float[]{7,7},0));canvas.drawLine(x-step+25,y,x-25,y,p);p.setPathEffect(null);}Path star=new Path();for(int j=0;j<10;j++){double angle=-Math.PI/2+j*Math.PI/5;float radius=j%2==0?25:11,xx=x+(float)Math.cos(angle)*radius,yy=y+(float)Math.sin(angle)*radius;if(j==0)star.moveTo(xx,yy);else star.lineTo(xx,yy);}star.close();p.setStyle(done?Paint.Style.FILL:Paint.Style.STROKE);canvas.drawPath(star,p);p.setStyle(Paint.Style.FILL);p.setColor(fg);canvas.drawText(new String[]{"월","화","수","목","금","토","일"}[i%7],x,145,p);}else{p.setStyle(done?Paint.Style.FILL:Paint.Style.STROKE);canvas.drawCircle(x,y,count>7?12:17,p);p.setStyle(Paint.Style.FILL);}}}
        return bitmap;
    }
    /** Stable-id choices replace example routine names; settings remain unsaved until Save. */
    public static void showContentDialog(final Activity activity){try{
        java.lang.reflect.Field wf=activity.getClass().getDeclaredField("appWidgetId"),kf=activity.getClass().getDeclaredField("providerClass"),sf=activity.getClass().getDeclaredField("selectedContent");wf.setAccessible(true);kf.setAccessible(true);sf.setAccessible(true);final int widget=wf.getInt(activity);String kind=base(type((String)kf.get(activity)));JSONObject m=model(snapshot(activity));final List<JSONObject> choices=new ArrayList<JSONObject>();List<String> labels=new ArrayList<String>();
        if(kind.equals("PersonalReading")){String[] ids={"all","reading","finished","want"},names={"모든 책","읽는 중","완독","읽고 싶은 책"};for(int i=0;i<ids.length;i++){choices.add(put(new JSONObject(),"filter",ids[i]));labels.add(names[i]);}}
        else if(kind.equals("PersonalWorkoutStats")){for(int n:new int[]{7,30,90}){choices.add(put(new JSONObject(),"period",n));labels.add("최근 "+n+"일");}}
        else if(kind.startsWith("PersonalBullet")||kind.equals("PersonalToday")){for(int n:new int[]{3,7}){choices.add(put(new JSONObject(),"rangeDays",n));labels.add(n+"일 기록");}}
        else {String key=kind.equals("PersonalQuote")?"books":kind.equals("RoutineLanguage")?"language":kind.equals("RoutineCards")?"routines":kind.equals("PersonalWorkoutChallengeOnly")||kind.equals("PersonalWorkoutChallengeCombined")?"challenges":"";JSONArray rows=a(m,key);if(kind.equals("PersonalQuote")){choices.add(new JSONObject());labels.add("최근 읽는 책 자동 선택");}for(int i=0;i<rows.length();i++){JSONObject r=rows.optJSONObject(i);choices.add(put(new JSONObject(),"id",r.optString("id")));labels.add(r.optString("title"));}if(choices.isEmpty()){choices.add(new JSONObject());labels.add("전체 기록");}}
        final java.lang.reflect.Field selected=sf;new AlertDialog.Builder(activity).setTitle("표시할 내용").setItems(labels.toArray(new CharSequence[labels.size()]),new DialogInterface.OnClickListener(){public void onClick(DialogInterface d,int which){try{selected.set(activity,choices.get(which).toString());WidgetNativeV164.preview(activity);}catch(Exception ignored){}}}).setNegativeButton("취소",null).show();
    }catch(Exception ignored){}}
}
