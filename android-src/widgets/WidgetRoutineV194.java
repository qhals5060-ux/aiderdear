package com.aiderlog.v22app;
import android.content.Context;
import android.widget.RemoteViews;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.ArrayList;
import java.util.List;
import static com.aiderlog.v22app.WidgetNativeV164.*;
import static com.aiderlog.v22app.WidgetDesignV165.*;

/** Compact routines: one title, concise progress, four stable action targets. */
public final class WidgetRoutineV194 {
    static boolean supports(String kind){String k=base(kind);return k.equals("RoutineAll")||k.equals("RoutineCards")||k.equals("RoutineStats");}
    static float ratio(String kind){return "RoutineAll".equals(base(kind))?.64f:.48f;}
    static List<String> rows(String kind,JSONObject data,JSONObject options){
        JSONObject model=model(data);JSONArray routines=a(model,"routines");List<JSONObject> values=new ArrayList<JSONObject>();String k=base(kind);
        if(!supports(k))return new ArrayList<String>();
        if(model.optString("uid").isEmpty()){values.add(put(put(put(new JSONObject(),"id","empty-routine"),"kind","empty"),"title","앱에서 로그인하고 동기화해주세요"));}
        else
        if(k.equals("RoutineStats")){JSONObject stats=model.optJSONObject("routineStats");if(stats!=null&&stats.optInt("total")>0)values.add(put(put(copy(stats),"kind","stats"),"id","routine-stats"));}
        else if(k.equals("RoutineCards")){JSONObject selected=choose(routines,options.optString("id"));if(selected!=null)values.add(put(copy(selected),"detail",true));}
        else for(int i=0;i<routines.length();i++){JSONObject routine=routines.optJSONObject(i);if(routine!=null&&!routine.optString("id").isEmpty())values.add(copy(routine));}
        if(values.isEmpty())values.add(put(put(put(new JSONObject(),"id","empty-routine"),"kind","empty"),"title","루틴을 추가해주세요"));
        List<String> out=new ArrayList<String>();for(JSONObject row:values){put(row,"_owner",model.optString("uid"));put(row,"_date",model.optString("today"));out.add(row.toString());}return out;
    }
    static String progress(JSONObject row){String level=row.optString("level");String done=row.optInt("done")+"일";return level.isEmpty()?done:done+" · "+level;}
    static boolean validOwner(JSONObject row,JSONObject data){String current=WidgetCompactCalendarV181.owner(data);return !current.isEmpty()&&current.equals(row.optString("_owner"));}
    static int previewRows(float height,float titleSize){return Math.max(1,(int)Math.floor(Math.max(0,height-40)/(42+Math.ceil(titleSize*1.35f))));}
    static RemoteViews render(Context c,int widget,String kind,boolean preview,String override,int opacityOverride,int font){
        String chosen=override==null?theme(c,widget):override;RemoteViews result=view(c,"widget_routine_v194");JSONObject data=snapshot(c),model=model(data),stats=model.optString("uid").isEmpty()?null:model.optJSONObject("routineStats");
        result.setImageViewResource(id(c,"widget_background"),drawable(c,WidgetThemeV190.resource(chosen,"surface")));
        result.setInt(id(c,"widget_background"),"setImageAlpha",Math.round(255*WidgetCompactCalendarV181.opacity(c,widget,opacityOverride)/100f));
        text(c,result,"widget_title",kind.equals("RoutineCards")?"ROUTINE":kind.equals("RoutineStats")?"ROUTINE · 이번 주":"ROUTINE");
        text(c,result,"widget_subtitle",stats==null?"":stats.optInt("todayDone")+" / "+stats.optInt("total")+" 완료");
        color(c,result,"widget_title",ink(c,chosen));color(c,result,"widget_subtitle",WidgetThemeV190.muted(chosen));
        result.setOnClickPendingIntent(id(c,"widget_root"),open(c,widget,kind,""));
        if(model.optString("uid").isEmpty()){show(c,result,"widget_items_v164",false);show(c,result,"widget_preview_rows_v164",false);show(c,result,"widget_empty",true);text(c,result,"widget_empty","sync-required".equals(data.optString("accessState"))?"앱에서 계정 기록을 동기화해주세요":"앱에서 로그인해주세요");color(c,result,"widget_empty",WidgetThemeV190.muted(chosen));return result;}
        show(c,result,"widget_empty",false);
        List<String> values=rows(kind,data,options(c,widget));show(c,result,"widget_items_v164",!preview);show(c,result,"widget_preview_rows_v164",preview);
        if(preview){float scaled=Math.max(1,c.getResources().getDisplayMetrics().scaledDensity/Math.max(.1f,c.getResources().getDisplayMetrics().density));int limit=kind.equals("RoutineAll")?previewRows(WidgetSizeV169.current(c,widget).getHeight(),WidgetSizeV169.sp(c,widget,font,12)*scaled):1;result.removeAllViews(id(c,"widget_preview_rows_v164"));for(int i=0;i<Math.min(values.size(),limit);i++)result.addView(id(c,"widget_preview_rows_v164"),row(c,widget,kind,values.get(i),override,font));}
        else collection(c,result,widget,kind,values);
        return result;
    }
    static RemoteViews row(Context c,int widget,String kind,String json,String override,int font){
        JSONObject record;try{record=new JSONObject(json);}catch(Exception ignored){record=new JSONObject();}
        String chosen=override==null?theme(c,widget):override;boolean stats=record.optString("kind").equals("stats"),empty=record.optString("kind").equals("empty");
        RemoteViews row=WidgetThemeV190.rowView(c,stats?"widget_routine_stats_v194":"widget_routine_row_v194",chosen);
        JSONObject data=snapshot(c);if(!validOwner(record,data)){if(!empty){show(c,row,"w194_routine_row",false);return row;}text(c,row,"w194_routine_title","앱에서 로그인하고 동기화해주세요");text(c,row,"w194_routine_meta","");show(c,row,"w194_routine_actions",false);show(c,row,"w194_routine_progress",false);return row;}
        int fg=ink(c,chosen),muted=WidgetThemeV190.muted(chosen),accent=WidgetThemeV190.accent(chosen);
        text(c,row,"w194_routine_title",stats?(record.isNull("weekPercent")?"—":record.optInt("weekPercent")+"%") :record.optString("title"));color(c,row,"w194_routine_title",stats?accent:fg);
        row.setTextViewTextSize(id(c,"w194_routine_title"),2,WidgetSizeV169.sp(c,widget,font,stats?20:12));
        text(c,row,"w194_routine_meta",stats?"누적 "+record.optInt("cumulative")+"회 · "+record.optInt("streak")+"일 연속":empty?"앱에서 루틴 만들기":progress(record));color(c,row,"w194_routine_meta",muted);
        JSONObject bound=put(new JSONObject(),"v165",put(put(new JSONObject(),"uid",record.optString("_owner")),"today",record.optString("_date")));
        row.setOnClickFillInIntent(id(c,"w194_routine_row"),action(bound,widget,kind,record,"open","routine"));
        if(stats){JSONArray counts=a(record,"weekCounts");String[] labels={"월","화","수","목","금","토","일"};for(int i=0;i<7;i++){text(c,row,"w194_week_"+i,labels[i]+"\n"+counts.optInt(i));color(c,row,"w194_week_"+i,counts.optInt(i)>0?accent:muted);}row.setProgressBar(id(c,"w194_routine_progress"),100,record.optInt("weekPercent"),false);return row;}
        show(c,row,"w194_routine_actions",!empty);show(c,row,"w194_routine_progress",!empty&&record.optBoolean("detail")&&!record.isNull("percent"));row.setProgressBar(id(c,"w194_routine_progress"),100,record.optInt("percent"),false);
        for(int i=0;i<4;i++){String value=new String[]{"MINI","MORE","MAX","SKIP"}[i],key="w194_level_"+i;boolean active=value.equals(record.optString("level"));color(c,row,key,active?accent:muted);row.setInt(id(c,key),"setBackgroundResource",drawable(c,WidgetThemeV190.resource(chosen,active?"selected":"outline")));row.setOnClickFillInIntent(id(c,key),action(bound,widget,kind,record,"routine",value));row.setContentDescription(id(c,key),record.optString("title")+" "+value+(active?" 선택됨":""));}
        return row;
    }
}
