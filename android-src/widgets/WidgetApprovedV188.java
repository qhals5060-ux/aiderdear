package com.aiderlog.v22app;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import static com.aiderlog.v22app.WidgetNativeV164.*;
import static com.aiderlog.v22app.WidgetDesignV165.*;

/** Revision 05 approved designs rendered as native, owner-scoped RemoteViews.
 * Existing providers, selected content and transactional actions remain intact. */
public final class WidgetApprovedV188 {
    static boolean supports(String kind){String k=base(kind);return k.equals("RoutineAll")||k.equals("RoutineCards")||k.equals("RoutineStats")||k.equals("PersonalWorkoutMeal")||k.equals("PersonalQuote")||k.equals("PersonalWorkflowAll")||k.equals("PersonalToday")||k.equals("PersonalWorkoutChallengeOnly");}
    static String label(String k){return k.equals("RoutineAll")?"루틴":k.equals("RoutineCards")?"하나의 루틴":k.equals("RoutineStats")?"루틴 통계":k.equals("PersonalWorkoutMeal")?"식사 · 운동":k.equals("PersonalQuote")?"독서":k.equals("PersonalWorkflowAll")?"투두 · 메모":k.equals("PersonalToday")?"오늘의 기록":"운동 챌린지";}
    static float ratio(String k){return k.equals("RoutineAll")?.64f:k.equals("RoutineCards")?.61f:k.equals("RoutineStats")?.68f:k.equals("PersonalWorkoutMeal")?.76f:k.equals("PersonalQuote")?.69f:k.equals("PersonalWorkflowAll")||k.equals("PersonalToday")?.58f:.67f;}
    static int accent(String theme){return "mint".equals(theme)?0xff547863:"rose".equals(theme)||"sunset".equals(theme)?0xffa56c82:"ocean".equals(theme)?0xff5d7e9f:"mono".equals(theme)?0xff65707a:"midnight".equals(theme)?0xffcbb5df:0xff80649a;}
    static JSONObject row(String kind,String id,String title){return put(put(put(new JSONObject(),"kind",kind),"id",id),"title",title);}
    static void bindOwner(JSONObject row,String uid,String date){put(row,"_widgetOwnerV188",uid);put(row,"_widgetDateV188",date);JSONArray children=a(row,"children");for(int i=0;i<children.length();i++){JSONObject child=children.optJSONObject(i);if(child!=null)bindOwner(child,uid,date);}}
    static boolean validOwner(JSONObject row,JSONObject snapshot){String captured=row.optString("_widgetOwnerV188");return !captured.isEmpty()&&WidgetCompactCalendarV181.sameOwner(captured,snapshot);}
    static JSONObject actionData(JSONObject row){return put(new JSONObject(),"v165",put(put(new JSONObject(),"uid",row.optString("_widgetOwnerV188")),"today",row.optString("_widgetDateV188")));}
    static String openType(JSONObject row){String type=row.optString("kind");return type.equals("stats")?"routine":type.equals("timeline")?row.optString("type","personal"):type;}
    static RemoteViews cleared(Context c){RemoteViews v=view(c,"widget_v188_quote");show(c,v,"w188_row",false);return v;}
    public static RemoteViews render(Context c,int w,String kind,boolean preview,String override,int opacity,int font){
        RemoteViews v=view(c,"widget_approved_v188");JSONObject data=snapshot(c),m=model(data);String selected=override==null?theme(c,w):override;
        appearance(c,v,w,override,opacity,font);text(c,v,"widget_title",label(kind));v.setTextViewTextSize(id(c,"widget_title"),2,WidgetSizeV169.sp(c,w,font,13));
        String subtitle=m.optString("today");if(subtitle.length()>5)subtitle=subtitle.substring(5).replace('-','.');JSONObject stats=m.optJSONObject("routineStats");if(kind.equals("RoutineAll")&&stats!=null)subtitle=stats.optInt("todayDone")+" / "+stats.optInt("total");text(c,v,"widget_subtitle",subtitle);color(c,v,"widget_subtitle",accent(selected));v.setTextViewTextSize(id(c,"widget_subtitle"),2,WidgetSizeV169.sp(c,w,font,9));
        v.setOnClickPendingIntent(id(c,"widget_root"),open(c,w,kind,""));List<String> main=rows(c,w,kind,data),right=rows(c,w,kind+"@right",data);boolean split=kind.equals("PersonalWorkflowAll");show(c,v,"w165_secondary",split);
        String access=data.optString("accessState");text(c,v,"widget_empty","needs-login".equals(access)?"로그인 필요":"sync-required".equals(access)?"동기화 필요":"기록 없음");show(c,v,"widget_empty",main.isEmpty()&&right.isEmpty());
        collection(c,v,w,kind,main,"widget_items_v164","widget_preview_rows_v164",preview,override,font);
        if(split)collection(c,v,w,kind+"@right",right,"w165_secondary_list","w165_secondary_preview",preview,override,font);return v;
    }
    static void collection(Context c,RemoteViews v,int w,String kind,List<String> rows,String list,String container,boolean preview,String theme,int font){
        if(!preview){WidgetNativeV164.collection(c,v,w,kind,rows,id(c,list));return;}
        show(c,v,list,false);show(c,v,container,true);v.removeAllViews(id(c,container));for(int i=0;i<Math.min(8,rows.size());i++)v.addView(id(c,container),renderRow(c,w,kind,rows.get(i),theme,font));
    }
    public static List<String> rows(Context c,int w,String fullKind,JSONObject data){return buildRows(base(fullKind),fullKind.contains("@right"),model(data),data,options(c,w));}
    /** Pure composition entry point: contract tests run this without Android UI. */
    static List<String> buildRows(String k,boolean right,JSONObject m,JSONObject data,JSONObject o){
        List<JSONObject> result=new ArrayList<JSONObject>();
        if(right&&!k.equals("PersonalWorkflowAll"))return new ArrayList<String>();
        if(k.equals("RoutineAll")){for(int i=0;i<a(m,"routines").length();i++)result.add(copy(a(m,"routines").optJSONObject(i)));}
        else if(k.equals("RoutineCards")){JSONObject r=choose(a(m,"routines"),o.optString("id"));if(r!=null)result.add(put(copy(r),"detail",true));}
        else if(k.equals("RoutineStats")){JSONObject r=m.optJSONObject("routineStats");if(r!=null)result.add(put(put(copy(r),"kind","stats"),"id","routine-stats"));}
        else if(k.equals("PersonalWorkoutMeal")){
            JSONArray meals=new JSONArray();for(int i=0;i<a(m,"meals").length();i++){JSONObject r=a(m,"meals").optJSONObject(i);if(r==null)continue;if(i<3||!r.optString("id").isEmpty())meals.put(put(copy(r),"kind","meal"));}if(meals.length()>0)result.add(put(row("meals","meals",""),"children",meals));
            for(int i=0;i<a(m,"workouts").length();i++){JSONObject r=a(m,"workouts").optJSONObject(i);if(r.optString("date").equals(m.optString("today")))result.add(copy(r));}
        }else if(k.equals("PersonalQuote")){
            String selected=o.optString("id",m.optString("currentBookId"));JSONObject book=choose(a(m,"books"),selected);if(book!=null){result.add(copy(book));if(!book.optString("quote").isEmpty())result.add(put(put(put(row("quote",book.optString("recordId"),"저장한 문장"),"body",book.optString("quote")),"recordId",book.optString("recordId")),"page",book.opt("quotePage")));}
        }else if(k.equals("PersonalWorkflowAll")){
            JSONArray rows=a(m,right?"notes":"incompleteTodos");for(int i=0;i<rows.length();i++)result.add(copy(rows.optJSONObject(i)));
        }else if(k.equals("PersonalToday")){
            String today=m.optString("today");if(today.matches("[0-9]{4}-[0-9]{2}-[0-9]{2}")){JSONObject dates=m.optJSONObject("dates");JSONArray entries=dates==null?new JSONArray():a(dates,today);List<JSONObject> timeline=new ArrayList<JSONObject>();for(int i=0;i<entries.length();i++){JSONObject r=entries.optJSONObject(i);if(r!=null&&!r.optString("type").equals("emotion"))timeline.add(put(copy(r),"kind","timeline"));}
                JSONArray schedules=a(data,"scheduleItems");for(int i=0;i<schedules.length();i++){JSONObject e=schedules.optJSONObject(i);if(e==null)continue;String end=e.optString("endDate",e.optString("date"));if(end.isEmpty())end=e.optString("date");if(today.compareTo(e.optString("date"))>=0&&today.compareTo(end)<=0){JSONObject r=copy(e);put(r,"kind","timeline");put(r,"schedule",true);timeline.add(r);}}
                Collections.sort(timeline,new Comparator<JSONObject>(){public int compare(JSONObject a,JSONObject b){String at=a.optString("time"),bt=b.optString("time");return (at.isEmpty()?"99:99":at).compareTo(bt.isEmpty()?"99:99":bt);}});
                result.add(put(put(row("today",today,today.substring(8)),"date",today),"count",timeline.size()));result.addAll(timeline);
            }
        }else if(k.equals("PersonalWorkoutChallengeOnly")){JSONObject r=choose(a(m,"challenges"),o.optString("id"));if(r!=null)result.add(copy(r));}
        List<String> strings=new ArrayList<String>();for(JSONObject r:result){bindOwner(r,m.optString("uid",WidgetCompactCalendarV181.owner(data)),m.optString("today"));strings.add(r.toString());}return strings;
    }
    static RemoteViews renderRow(Context c,int w,String fullKind,String json,String override,int font){try{
        JSONObject r=new JSONObject(json),captured=snapshot(c);if(!validOwner(r,captured))return cleared(c);JSONObject bound=actionData(r);String k=base(fullKind),type=r.optString("kind"),chosen=override==null?theme(c,w):override;int fg=ink(c,chosen),ac=accent(chosen),muted=dark(c,chosen)?0xffc6bfd0:0xff807386;
        if(type.equals("meals")){RemoteViews group=view(c,"widget_v188_group");JSONArray children=a(r,"children");for(int i=0;i<children.length();i++)group.addView(id(c,"w188_group"),renderRow(c,w,k,children.optJSONObject(i).toString(),override,font));return group;}
        String layout=type.equals("routine")?(r.optBoolean("detail")?"routine_detail":WidgetSizeV169.current(c,w).getWidth()<280?"routine_narrow":"routine"):type;RemoteViews v=view(c,"widget_v188_"+layout);
        text(c,v,"w188_title",r.optString("title"));color(c,v,"w188_title",fg);if(!type.equals("note")&&!type.equals("quote")&&(!type.equals("routine")||r.optBoolean("detail")))color(c,v,"w188_meta",muted);v.setTextViewTextSize(id(c,"w188_title"),2,WidgetSizeV169.sp(c,w,font,type.equals("stats")||type.equals("today")?30:type.equals("meal")?10:11));
        v.setOnClickFillInIntent(id(c,"w188_row"),action(bound,w,k,r,"open",openType(r)));
        if(type.equals("meal")){bitmap(c,v,"w188_photo",r.optString("image"));show(c,v,"w188_empty",r.optString("image").isEmpty());color(c,v,"w188_empty",muted);String slot=r.optString("slot");text(c,v,"w188_title",slot.equals("breakfast")?"아침":slot.equals("lunch")?"점심":slot.equals("dinner")?"저녁":"간식");text(c,v,"w188_meta",r.optString("time"));v.setContentDescription(id(c,"w188_row"),"식사 사진 · "+slot+" "+r.optString("time"));return v;}
        if(type.equals("routine")){for(int i=0;i<4;i++){String level=new String[]{"MINI","MORE","MAX","SKIP"}[i];String key="w188_level_"+i;boolean active=level.equals(r.optString("level"));color(c,v,key,active?ac:muted);v.setInt(id(c,key),"setBackgroundResource",drawable(c,dark(c,chosen)?"widget_v188_control_dark":"widget_v188_control"));v.setOnClickFillInIntent(id(c,key),action(bound,w,k,r,"routine",level));v.setContentDescription(id(c,key),r.optString("title")+" "+level+(active?" 선택됨":""));}
            if(r.optBoolean("detail")){text(c,v,"w188_meta",r.optInt("streak")+"일 연속");String level=r.optString("level").toLowerCase();String plan=r.optString(level+"Text");if(plan.isEmpty())plan=r.optString("miniText");text(c,v,"w188_body",plan);color(c,v,"w188_body",muted);v.setProgressBar(id(c,"w188_progress"),100,r.optInt("percent"),false);show(c,v,"w188_progress",r.has("percent")&&!r.isNull("percent"));v.setImageViewBitmap(id(c,"w188_graph"),chart("week",a(r,"week"),ac,muted,0));}return v;}
        if(type.equals("todo")){boolean done=r.optBoolean("done");text(c,v,"w188_check",done?"✓":"");color(c,v,"w188_check",ac);String due=r.optString("dueAt");text(c,v,"w188_meta",due.length()>5?due.substring(5).replace('-','.'):due);v.setTextViewTextSize(id(c,"w188_meta"),2,WidgetSizeV169.sp(c,w,font,8));v.setOnClickFillInIntent(id(c,"w188_check"),action(bound,w,k,r,"todo",done?"false":"true"));return v;}
        if(type.equals("timeline")){text(c,v,"w188_meta",r.optString("time").isEmpty()?"·":r.optString("time"));color(c,v,"w188_meta",ac);if(r.optBoolean("schedule")){JSONObject payload=copy(r);put(payload,"uid",r.optString("_widgetOwnerV188"));put(payload,"selectedDate",r.optString("_widgetDateV188"));android.content.Intent intent=new android.content.Intent().putExtra("action","open-schedule-item-v168:"+android.net.Uri.encode(payload.toString()));v.setOnClickFillInIntent(id(c,"w188_row"),intent);}return v;}
        if(type.equals("stats")){text(c,v,"w188_title",r.isNull("weekPercent")?"—":r.optInt("weekPercent")+"%");color(c,v,"w188_title",ac);text(c,v,"w188_meta",r.optInt("streak")+"일 연속");text(c,v,"w188_body","이번 주 실천");text(c,v,"w188_foot","누적 "+r.optInt("cumulative")+"회 · 루틴 "+r.optInt("total")+"개");v.setImageViewBitmap(id(c,"w188_graph"),chart("bars",a(r,"weekCounts"),ac,muted,0));}
        else if(type.equals("workout")){text(c,v,"w188_meta",r.isNull("minutes")?"":value(r,"minutes")+"분");text(c,v,"w188_body",workoutSummary(r).replace('\n',' '));}
        else if(type.equals("note")){v.setInt(id(c,"w188_row"),"setBackgroundResource",drawable(c,dark(c,chosen)?"widget_v188_control_dark":"widget_v188_control"));text(c,v,"w188_body",r.optString("preview"));text(c,v,"w188_foot","");show(c,v,"w188_foot",false);show(c,v,"w188_body",!r.optString("preview").isEmpty());}
        else if(type.equals("book")){bitmap(c,v,"w188_photo",r.optString("image"));text(c,v,"w188_cover_title",r.optString("title"));color(c,v,"w188_cover_title",0xff63506f);show(c,v,"w188_cover_title",r.optString("image").isEmpty());text(c,v,"w188_meta",r.optString("author"));text(c,v,"w188_body",r.optString("status").equals("finished")?"완독":r.optString("status").equals("want")?"읽고 싶은 책":r.isNull("totalPages")?"읽는 중":value(r,"currentPage")+" / "+value(r,"totalPages")+"쪽");v.setProgressBar(id(c,"w188_progress"),100,r.optInt("percent"),false);show(c,v,"w188_progress",r.has("percent")&&!r.isNull("percent"));}
        else if(type.equals("quote")){text(c,v,"w188_body","“"+r.optString("body")+"”");text(c,v,"w188_foot",r.isNull("page")?"":"p. "+value(r,"page"));}
        else if(type.equals("today")){text(c,v,"w188_meta",r.optInt("count")+"개 기록");text(c,v,"w188_body",r.optString("date"));}
        else if(type.equals("challenge")){text(c,v,"w188_meta",r.optInt("done")+" / "+r.optInt("goal"));text(c,v,"w188_body",r.optString("variant")+(r.isNull("target")?"":" · "+value(r,"target")+r.optString("unit")));v.setProgressBar(id(c,"w188_progress"),100,r.optInt("percent"),false);v.setImageViewBitmap(id(c,"w188_graph"),chart("challenge",a(r,"nodes"),ac,muted,0));text(c,v,"w188_foot",r.optInt("streak")+"일 연속 · "+r.optInt("percent")+"%");v.setContentDescription(id(c,"w188_graph"),"챌린지 "+r.optInt("done")+"일 완료 / "+r.optInt("goal")+"일");}
        color(c,v,"w188_body",fg);if(type.equals("stats")||type.equals("note")||type.equals("quote")||type.equals("challenge"))color(c,v,"w188_foot",muted);return v;
    }catch(Exception error){RemoteViews v=view(c,"widget_v188_quote");text(c,v,"w188_title","기록 다시 불러오기");return v;}}
    static Bitmap chart(String type,JSONArray values,int ac,int muted,int offset){
        int width=630,height=type.equals("challenge")?240:150;Bitmap bm=Bitmap.createBitmap(width,height,Bitmap.Config.ARGB_8888);Canvas canvas=new Canvas(bm);Paint p=new Paint(3);p.setTextAlign(Paint.Align.CENTER);p.setTextSize(20);int tint=(ac&0x00ffffff)|0x22000000;
        if(type.equals("bars")){double max=1;for(int i=0;i<values.length();i++)max=Math.max(max,values.optDouble(i));for(int i=0;i<7;i++){float x=i*90+45,h=(float)(values.optDouble(i)/max*106);p.setColor(tint);canvas.drawRoundRect(x-18,8,x+18,118,6,6,p);p.setColor(ac);canvas.drawRoundRect(x-18,118-h,x+18,118,6,6,p);p.setColor(muted);canvas.drawText(new String[]{"월","화","수","목","금","토","일"}[i],x,145,p);}}
        else if(type.equals("week")){for(int i=0;i<7;i++){float x=i*90+45;p.setColor(values.optBoolean(i)?ac:tint);canvas.drawCircle(x,50,24,p);p.setColor(values.optBoolean(i)?0xffffffff:muted);canvas.drawText(values.optBoolean(i)?"✓":"·",x,57,p);p.setColor(muted);canvas.drawText(new String[]{"월","화","수","목","금","토","일"}[i],x,104,p);}}
        else {int count=Math.min(values.length(),90),columns=count>35?15:10,rows=Math.max(1,(count+columns-1)/columns);float cw=width/(float)columns,ch=height/(float)rows;for(int i=0;i<count;i++){float x=(i%columns)*cw,y=(i/columns)*ch;boolean done=values.optBoolean(i);p.setColor(done?ac:tint);canvas.drawRoundRect(x+4,y+4,x+cw-4,y+ch-4,8,8,p);p.setTextSize(count>35?15:20);p.setColor(done?0xffffffff:muted);canvas.drawText(String.valueOf(i+1+offset),x+cw/2,y+ch/2+7,p);}}return bm;
    }
}
