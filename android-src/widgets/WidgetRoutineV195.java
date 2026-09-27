package com.aiderlog.v22app;

import android.content.Context;
import android.widget.RemoteViews;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.List;
import static com.aiderlog.v22app.WidgetNativeV164.*;
import static com.aiderlog.v22app.WidgetDesignV165.*;

/** One routine widget: scrolling daily actions above a named calendar-week grid. */
public final class WidgetRoutineV195 {
    static JSONObject o(JSONObject parent,String key){JSONObject value=parent.optJSONObject(key);return value==null?new JSONObject():value;}
    static boolean supports(String kind){return "RoutineAll".equals(base(kind));}
    static float ratio(String kind){return 1.0f;}
    static float listHeight(float height){return Math.max(0,height-40)*2f/3f;}
    static float weekHeight(float height){return Math.max(0,height-40)/3f;}
    static boolean practiced(JSONObject routine,String date,String today){
        if(!WidgetCompactCalendarV181.dateKey(date)||date.compareTo(today)>0)return false;
        String level=o(routine,"dailyLevels").optString(date).toUpperCase(java.util.Locale.US);
        if("SKIP".equals(level))return false;
        if("MINI".equals(level)||"MORE".equals(level)||"MAX".equals(level))return true;
        JSONArray done=a(routine,"doneDates");for(int i=0;i<done.length();i++)if(date.equals(done.optString(i)))return true;return false;
    }
    static JSONArray weekDates(JSONObject model){
        java.util.Calendar start=date(model.optString("today",day(java.util.Calendar.getInstance())));start.add(java.util.Calendar.DAY_OF_MONTH,-(start.get(java.util.Calendar.DAY_OF_WEEK)+5)%7);
        JSONArray out=new JSONArray();for(int i=0;i<7;i++){out.put(day(start));start.add(java.util.Calendar.DAY_OF_MONTH,1);}return out;
    }
    static JSONObject atDay(JSONObject data,String today){
        JSONObject result=copy(data),model=model(result);if(model.optString("uid").isEmpty())return result;put(model,"today",today);JSONArray dates=weekDates(model),routines=a(model,"routines");int completed=0,cumulative=0;int[] counts=new int[7];
        for(int i=0;i<routines.length();i++){JSONObject routine=routines.optJSONObject(i);if(routine==null)continue;java.util.TreeSet<String> candidates=new java.util.TreeSet<String>();JSONArray done=a(routine,"doneDates");for(int d=0;d<done.length();d++)candidates.add(done.optString(d));JSONObject levels=o(routine,"dailyLevels");java.util.Iterator<String> keys=levels.keys();while(keys.hasNext())candidates.add(keys.next());JSONArray valid=new JSONArray();for(String candidate:candidates)if(practiced(routine,candidate,today)&&day(date(candidate)).equals(candidate))valid.put(candidate);
            put(routine,"doneDates",valid);put(routine,"done",valid.length());cumulative+=valid.length();double goal=routine.optDouble("goalDays",0);put(routine,"percent",goal>0?Math.min(100,Math.round(valid.length()*100d/goal)):JSONObject.NULL);String level=levels.optString(today).toUpperCase(java.util.Locale.US);put(routine,"level","MINI".equals(level)||"MORE".equals(level)||"MAX".equals(level)||"SKIP".equals(level)?level:"");if(practiced(routine,today,today))completed++;JSONArray week=new JSONArray();for(int d=0;d<7;d++){boolean did=practiced(routine,dates.optString(d),today);week.put(did);if(did)counts[d]++;}put(routine,"week",week);put(routine,"weekDates",dates);
        }
        JSONObject stats=o(model,"routineStats");put(stats,"todayDone",completed);put(stats,"total",routines.length());put(stats,"cumulative",cumulative);JSONArray weekCounts=new JSONArray();int weekly=0;for(int count:counts){weekCounts.put(count);weekly+=count;}put(stats,"weekCounts",weekCounts);put(stats,"weekDates",dates);put(stats,"weekPercent",routines.length()>0?Math.round(weekly*100d/(routines.length()*7)):JSONObject.NULL);put(model,"routineStats",stats);put(model,"weekDates",dates);return result;
    }
    static List<String> rowsAt(String kind,JSONObject data,JSONObject options,String today){return rows(kind,atDay(data,today),options);}
    static List<String> rows(String kind,JSONObject data,JSONObject options){
        if(!supports(kind))return new ArrayList<String>();
        if(!kind.contains("@week"))return WidgetRoutineV194.rows("RoutineAll",data,options);
        JSONObject model=model(data);String uid=model.optString("uid"),today=model.optString("today");List<String> out=new ArrayList<String>();if(uid.isEmpty())return out;
        JSONArray routines=a(model,"routines"),dates=weekDates(model);
        for(int i=0;i<routines.length();i++){JSONObject routine=routines.optJSONObject(i);if(routine==null||routine.optString("id").isEmpty())continue;JSONArray marks=new JSONArray();int count=0;for(int d=0;d<7;d++){boolean done=practiced(routine,dates.optString(d),today);marks.put(done);if(done)count++;}if(count==0)continue;
            JSONObject row=put(put(put(put(put(put(put(copy(routine),"kind","routineWeek"),"week",marks),"weekCount",count),"weekDates",dates),"_owner",uid),"_date",today),"title",routine.optString("title"));out.add(row.toString());
        }return out;
    }
    static JSONObject summary(JSONObject data){
        JSONObject model=model(data);if(model.optString("uid").isEmpty())model=new JSONObject();List<String> weekly=rows("RoutineAll@week",data,new JSONObject());JSONArray counts=new JSONArray();int[] values=new int[7];int total=0;String names="";for(int i=0;i<weekly.size();i++)try{JSONObject routine=new JSONObject(weekly.get(i));JSONArray marks=a(routine,"week");for(int d=0;d<7;d++)if(marks.optBoolean(d)){values[d]++;total++;}if(i<2){String title=routine.optString("title");if(title.length()>12)title=title.substring(0,12)+"…";names+=(i>0?", ":"")+title;}}catch(Exception ignored){}for(int value:values)counts.put(value);if(weekly.size()>2)names+=" 외 "+(weekly.size()-2)+"개";if(names.isEmpty())names="이번 주 실천한 루틴이 없어요";
        return put(put(put(put(put(put(new JSONObject(),"dates",weekDates(model)),"counts",counts),"practiced",weekly.size()),"total",a(model,"routines").length()),"occurrences",total),"names",names);
    }
    static int previewRows(float height,float titleSize,boolean ignored){return Math.max(0,(int)Math.floor(listHeight(height)/(42+Math.ceil(titleSize*1.35f))));}
    static boolean compactStats(float height,float fontScale){return weekHeight(height)<69||(fontScale>1.3f&&weekHeight(height)<110);}
    static boolean showNames(float height,float fontScale){return !compactStats(height,fontScale)&&weekHeight(height)>=86&&fontScale<=1.3f;}
    static RemoteViews render(Context c,int widget,String kind,boolean preview,String override,int opacityOverride,int font){
        String chosen=override==null?theme(c,widget):override;RemoteViews result=WidgetThemeV190.rowView(c,"widget_routine_v195",chosen);JSONObject data=atDay(snapshot(c),day(java.util.Calendar.getInstance())),model=model(data),stats=o(model,"routineStats");String uid=model.optString("uid");
        result.setImageViewResource(id(c,"widget_background"),drawable(c,WidgetThemeV190.resource(chosen,"surface")));result.setInt(id(c,"widget_background"),"setImageAlpha",Math.round(255*WidgetCompactCalendarV181.opacity(c,widget,opacityOverride)/100f));text(c,result,"widget_title","ROUTINE");text(c,result,"widget_subtitle",uid.isEmpty()?"":stats.optInt("todayDone")+" / "+stats.optInt("total")+" 오늘 완료");color(c,result,"widget_title",ink(c,chosen));color(c,result,"widget_subtitle",WidgetThemeV190.muted(chosen));result.setOnClickPendingIntent(id(c,"widget_root"),open(c,widget,kind,""));
        boolean allowed=!uid.isEmpty();show(c,result,"w195_content",allowed);show(c,result,"widget_empty",!allowed);text(c,result,"widget_empty","sync-required".equals(data.optString("accessState"))?"앱에서 계정 기록을 동기화해주세요":"앱에서 로그인해주세요");color(c,result,"widget_empty",WidgetThemeV190.muted(chosen));if(!allowed)return result;
        List<String> daily=rows(kind,data,options(c,widget));JSONObject week=summary(data);JSONArray dates=a(week,"dates"),counts=a(week,"counts");float height=WidgetSizeV169.current(c,widget).getHeight(),scaled=Math.max(1,c.getResources().getDisplayMetrics().scaledDensity/Math.max(.1f,c.getResources().getDisplayMetrics().density));boolean compact=compactStats(height,scaled);String dateLabel=WidgetCompactCalendarV181.shortDate(dates.optString(0))+"–"+WidgetCompactCalendarV181.shortDate(dates.optString(6)),totals="실천 "+week.optInt("practiced")+"/"+week.optInt("total")+" · 총 "+week.optInt("occurrences")+"회";
        text(c,result,"w195_week_title",dateLabel+" · "+totals);color(c,result,"w195_week_title",ink(c,chosen));show(c,result,"w195_week_title",!compact);text(c,result,"w195_week_names",week.optString("names"));color(c,result,"w195_week_names",WidgetThemeV190.muted(chosen));show(c,result,"w195_week_names",showNames(height,scaled));if(compact)text(c,result,"widget_subtitle","주 "+week.optInt("practiced")+"/"+week.optInt("total")+" · "+week.optInt("occurrences")+"회");result.setInt(id(c,"w195_divider"),"setBackgroundColor",WidgetThemeV190.color(chosen,3));
        String[] labels={"월","화","수","목","금","토","일"};for(int i=0;i<7;i++){boolean future=dates.optString(i).compareTo(model.optString("today"))>0;int count=counts.optInt(i);text(c,result,"w195_day_"+i,labels[i]+(compact?"":"\n"+Integer.parseInt(dates.optString(i).substring(8))));color(c,result,"w195_day_"+i,WidgetThemeV190.muted(chosen));text(c,result,"w195_count_"+i,future?"—":String.valueOf(count));color(c,result,"w195_count_"+i,count>0?WidgetThemeV190.accent(chosen):WidgetThemeV190.muted(chosen));result.setProgressBar(id(c,"w195_bar_"+i),Math.max(1,week.optInt("total")),count,false);result.setViewVisibility(id(c,"w195_bar_"+i),compact?android.view.View.GONE:future?android.view.View.INVISIBLE:android.view.View.VISIBLE);result.setContentDescription(id(c,"w195_count_"+i),dates.optString(i)+(future?" 예정 날짜":" 실천한 루틴 "+count+"개"));}
        if(data.optInt("privateFailureCountV196")>0)text(c,result,"widget_subtitle","동기화 확인 필요");result.setContentDescription(id(c,"w195_week_panel"),"이번 주 "+dates.optString(0)+"부터 "+dates.optString(6)+" "+totals+". 탭하여 루틴 통계 보기");String action=WidgetDesignV165.action(data,widget,"RoutineAll",new JSONObject(),"open","routine-stats").getStringExtra("action");result.setOnClickPendingIntent(id(c,"w195_week_panel"),open(c,widget,"RoutineAll",action));
        show(c,result,"widget_items_v164",!preview);show(c,result,"widget_preview_rows_v164",preview);if(preview){int limit=previewRows(height,WidgetSizeV169.sp(c,widget,font,12)*scaled,false);result.removeAllViews(id(c,"widget_preview_rows_v164"));for(int i=0;i<Math.min(limit,daily.size());i++)result.addView(id(c,"widget_preview_rows_v164"),row(c,widget,kind,daily.get(i),chosen,font));}else collection(c,result,widget,kind,daily);return result;
    }
    static RemoteViews row(Context c,int widget,String kind,String json,String override,int font){return WidgetRoutineV194.row(c,widget,"RoutineAll",json,override,font);}
}
