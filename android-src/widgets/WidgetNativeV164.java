package com.aiderlog.v22app;

import android.app.Activity;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

/** Native launcher rendering. Never uses HTML, a screenshot, or example content as user data. */
public final class WidgetNativeV164 {
    static final int INK=0xff171a3a, MUTED=0xff171a3a, PRIMARY=0xff6255e8;
    static final String PREF="aiderlog_native", ACTION="com.aiderlog.v22app.WIDGET_NAV_V164";
    static final SimpleDateFormat DATE=new SimpleDateFormat("yyyy-MM-dd",Locale.US);
    static int id(Context c,String name){return c.getResources().getIdentifier(name,"id",c.getPackageName());}
    static int layout(Context c,String name){return c.getResources().getIdentifier(name,"layout",c.getPackageName());}
    static int drawable(Context c,String name){return c.getResources().getIdentifier(name,"drawable",c.getPackageName());}
    static SharedPreferences prefs(Context c){return c.getSharedPreferences(PREF,0);}
    static String type(String name){return name==null?"":name.substring(name.lastIndexOf('$')+1);}
    static JSONObject snapshot(Context c){try{return new JSONObject(prefs(c).getString("widget_snapshot","{}"));}catch(Exception e){return new JSONObject();}}
    static String day(Calendar value){synchronized(DATE){return DATE.format(value.getTime());}}
    static Calendar date(String key){Calendar value=Calendar.getInstance();try{synchronized(DATE){value.setTime(DATE.parse(key));}}catch(Exception ignored){}return value;}
    static String selected(Context c,int widget){return prefs(c).getString("widget_date_"+widget,day(Calendar.getInstance()));}
    static boolean dark(Context c,String theme){return "midnight".equals(theme)||("system".equals(theme)&&(c.getResources().getConfiguration().uiMode&48)==32);}
    static int ink(Context c,String theme){return dark(c,theme)?0xfff7f6ff:INK;}
    static String theme(Context c,int widget){return prefs(c).getString("widget_theme_"+widget,"aurora");}
    static float font(Context c,int widget){return 11.5f+Math.max(1,Math.min(5,prefs(c).getInt("widget_font_"+widget,3)))*.8f;}
    static RemoteViews view(Context c,String name){return new RemoteViews(c.getPackageName(),layout(c,name));}
    static void text(Context c,RemoteViews v,String key,String text){v.setTextViewText(id(c,key),text);}
    static void show(Context c,RemoteViews v,String key,boolean visible){v.setViewVisibility(id(c,key),visible?View.VISIBLE:View.GONE);}
    static void color(Context c,RemoteViews v,String key,int value){v.setTextColor(id(c,key),value);}
    static void appearance(Context c,RemoteViews v,int widget,String overrideTheme,int overrideOpacity,int overrideFont){
        String selectedTheme=overrideTheme==null?theme(c,widget):overrideTheme;
        String bg="widget_bg_"+selectedTheme;
        if("system".equals(selectedTheme))bg=dark(c,selectedTheme)?"widget_bg_midnight":"widget_bg_aurora";
        int background=drawable(c,bg);if(background==0)background=drawable(c,"widget_bg_aurora");
        v.setImageViewResource(id(c,"widget_background"),background);
        float opacity=(overrideOpacity<0?prefs(c).getInt("widget_opacity_"+widget,100):overrideOpacity)/100f;
        v.setInt(id(c,"widget_background"),"setImageAlpha",Math.round(255*Math.max(0,Math.min(1,opacity))));
        int foreground=ink(c,selectedTheme);
        for(String key:new String[]{"widget_title","widget_subtitle","widget_empty","widget_previous","widget_next","widget_add"})color(c,v,key,foreground);
        float size=overrideFont<0?font(c,widget):11.5f+Math.max(1,Math.min(5,overrideFont))*.8f;
        v.setTextViewTextSize(id(c,"widget_title"),2,size+1.2f);
        v.setTextViewTextSize(id(c,"widget_subtitle"),2,Math.max(10,size-2));
        v.setTextViewTextSize(id(c,"widget_empty"),2,size);
    }
    static PendingIntent open(Context c,int widget,String kind,String action){
        String target=kind.startsWith("Calendar")?"home":kind.startsWith("Routine")?"private":kind.contains("Language")?"language":kind.startsWith("Task")?"task":"personal";
        if(kind.contains("Language"))target="language";
        if("add-schedule".equals(action))action="add-schedule:"+selected(c,widget);
        Intent i=new Intent().setClassName(c,c.getPackageName()+".MainActivity").setAction("aiderlog.widget."+widget+"."+kind+"."+action);
        i.putExtra("target",target).putExtra("action",action).addFlags(0x14000000);
        return PendingIntent.getActivity(c,widget*31+action.hashCode(),i,0x0c000000);
    }
    static PendingIntent navigate(Context c,int widget,String kind,String action,String value){
        Intent i=new Intent(ACTION).setClassName(c,c.getPackageName()+".WidgetNavV164");
        i.setData(Uri.parse("aiderlog-widget://"+widget+"/"+action+"/"+value));
        i.putExtra("appWidgetId",widget).putExtra("kind",kind).putExtra("operation",action).putExtra("value",value);
        return PendingIntent.getBroadcast(c,(widget+action+value).hashCode(),i,0x0c000000);
    }
    public static boolean update(Context c,AppWidgetManager manager,int widget,String name){
        String kind=type(name);
        if(kind.startsWith("Task")&&!kind.equals("TaskClientLink"))return false;
        try{
            RemoteViews v=render(c,widget,kind,false,null,-1,-1);
            manager.updateAppWidget(widget,v);
            manager.notifyAppWidgetViewDataChanged(widget,id(c,"widget_items_v164"));
            manager.notifyAppWidgetViewDataChanged(widget,id(c,"w165_secondary_list"));
            return true;
        }catch(Throwable error){Log.e("AiderLogWidget","native-render failed type="+kind+" id="+widget,error);return false;}
    }
    public static RemoteViews render(Context c,int widget,String kind,boolean preview,String selectedTheme,int opacity,int selectedFont){
        if(kind.equals("TaskClientLink")){
            RemoteViews link=view(c,"widget_client_link_v168");String chosen=selectedTheme==null?theme(c,widget):selectedTheme;
            link.setImageViewResource(id(c,"widget_background"),drawable(c,"widget_bg_"+("system".equals(chosen)?dark(c,chosen)?"midnight":"aurora":chosen)));
            link.setInt(id(c,"widget_background"),"setImageAlpha",Math.round(255*(opacity<0?prefs(c).getInt("widget_opacity_"+widget,100):opacity)/100f));
            color(c,link,"widget_title",ink(c,chosen));color(c,link,"widget_subtitle",ink(c,chosen));
            float linkSize=12f+((selectedFont<0?prefs(c).getInt("widget_font_"+widget,3):selectedFont)-3)*.8f;
            link.setTextViewTextSize(id(c,"widget_title"),2,linkSize);link.setTextViewTextSize(id(c,"widget_subtitle"),2,linkSize-1);
            JSONObject data=snapshot(c);String uid=WidgetDesignV165.model(data).optString("uid",data.optString("uid"));
            link.setContentDescription(id(c,"widget_root"),"새 고객정보 입력 링크 생성 및 복사");
            link.setOnClickPendingIntent(id(c,"widget_root"),open(c,widget,kind,"create-client-intake-v168:"+widget+":"+uid));return link;
        }
        if(!kind.startsWith("Calendar"))return WidgetDesignV165.render(c,widget,kind,preview,selectedTheme,opacity,selectedFont);
        JSONObject data=snapshot(c);
        Bundle options=AppWidgetManager.getInstance(c).getAppWidgetOptions(widget);
        int width=options==null?320:options.getInt("appWidgetMinWidth",320);
        int height=options==null?320:options.getInt("appWidgetMinHeight",320);
        boolean calendar=kind.startsWith("Calendar"),agenda="CalendarAgenda".equals(kind),onlyMonth="CalendarMonth".equals(kind)||"CalendarSplit".equals(kind),meal="PersonalMeal".equals(kind);
        boolean split=calendar&&!onlyMonth&&!agenda&&WidgetDesignV165.wide(c,widget);
        RemoteViews v=view(c,split?"widget_native_wide_v164":"widget_native_v164");
        appearance(c,v,widget,selectedTheme,opacity,selectedFont);
        String now=day(Calendar.getInstance()),selected=selected(c,widget);
        text(c,v,"widget_title",calendar?(agenda?selected+" · "+eventsOn(data.optJSONArray("scheduleItems"),selected).size()+"건":monthTitle(c,widget,kind)):data.optString("today",now));
        text(c,v,"widget_subtitle",calendar&&!onlyMonth?selected+" · "+eventsOn(data.optJSONArray("scheduleItems"),selected).size()+"건":"");
        show(c,v,"widget_subtitle",calendar&&!onlyMonth&&!agenda);
        show(c,v,"widget_calendar_v164",calendar&&!agenda);
        show(c,v,"widget_previous",calendar&&!agenda);show(c,v,"widget_next",calendar&&!agenda);
        boolean add=calendar||kind.equals("PersonalWorkflowOne")||kind.equals("PersonalWorkflowAll")||kind.equals("PersonalTodo");
        show(c,v,"widget_add",add);
        v.setOnClickPendingIntent(id(c,"widget_root"),open(c,widget,kind,"LanguageYoutube".equals(kind)?"open-youtube":""));
        v.setOnClickPendingIntent(id(c,"widget_add"),open(c,widget,kind,calendar?"add-schedule":kind.equals("PersonalTodo")?"add-todo":"add-memo"));
        v.setOnClickPendingIntent(id(c,"widget_previous"),navigate(c,widget,kind,"month","-1"));
        v.setOnClickPendingIntent(id(c,"widget_next"),navigate(c,widget,kind,"month","1"));
        if(calendar&&!agenda)calendar(c,v,widget,kind,data,selectedTheme,selectedFont,opacity,split);
        List<String> rows=rows(c,widget,kind,data);
        show(c,v,"widget_list_panel_v164",!onlyMonth&&!meal);
        show(c,v,"widget_meals_v164",meal);
        if(meal){mealPhotos(c,v,data);show(c,v,"widget_empty",false);}
        else if(!onlyMonth){
            String access=data.optString("accessState","");
            text(c,v,"widget_empty","needs-login".equals(access)?"앱에서 로그인 후 기록을 연결해주세요.":"sync-required".equals(access)?"앱에서 계정 기록을 동기화해주세요.":calendar?"선택한 날짜에 일정이 없습니다.":"저장된 기록이 없습니다.");
            v.setEmptyView(id(c,"widget_items_v164"),id(c,"widget_empty"));
            show(c,v,"widget_empty",rows.isEmpty());show(c,v,"widget_items_v164",!rows.isEmpty());
            if(preview){
                show(c,v,"widget_items_v164",false);show(c,v,"widget_preview_rows_v164",true);
                v.removeAllViews(id(c,"widget_preview_rows_v164"));
                for(int n=0;n<Math.min(4,rows.size());n++)v.addView(id(c,"widget_preview_rows_v164"),row(c,widget,kind,rows.get(n),n,selectedTheme,selectedFont));
            }else collection(c,v,widget,kind,rows);
        }
        return v;
    }
    static String monthTitle(Context c,int widget,String kind){Calendar cal=kind.equals("CalendarFortnight")?date(selected(c,widget)):Calendar.getInstance();if(kind.equals("CalendarFortnight")){cal.add(Calendar.DAY_OF_MONTH,-(cal.get(Calendar.DAY_OF_WEEK)+5)%7);String start=day(cal);cal.add(Calendar.DAY_OF_MONTH,13);return start.substring(5)+" – "+day(cal).substring(5);}cal.add(Calendar.MONTH,prefs(c).getInt("widget_month_"+widget,0));return cal.get(Calendar.YEAR)+". "+String.format(Locale.US,"%02d",cal.get(Calendar.MONTH)+1);}
    static void calendar(Context c,RemoteViews v,int widget,String kind,JSONObject data,String overrideTheme,int selectedFont,int opacity,boolean split){
        Calendar start=Calendar.getInstance();start.set(Calendar.DAY_OF_MONTH,1);start.add(Calendar.MONTH,prefs(c).getInt("widget_month_"+widget,0));
        int shownMonth=start.get(Calendar.MONTH),monthRows=(start.get(Calendar.DAY_OF_WEEK)-1+start.getActualMaximum(Calendar.DAY_OF_MONTH)+6)/7;boolean fortnight=kind.equals("CalendarFortnight");
        if(fortnight){start=date(selected(c,widget));}
        start.add(Calendar.DAY_OF_MONTH,fortnight?-(start.get(Calendar.DAY_OF_WEEK)+5)%7:1-start.get(Calendar.DAY_OF_WEEK));
        v.removeAllViews(id(c,"widget_calendar_v164"));
        String chosenTheme=overrideTheme==null?theme(c,widget):overrideTheme;
        int foreground=ink(c,chosenTheme);float size=selectedFont<0?font(c,widget):11.5f+selectedFont*.8f;
        RemoteViews heading=view(c,"widget_weekrow_v164");
        String[] labels=fortnight?new String[]{"월","화","수","목","금","토","일"}:new String[]{"일","월","화","수","목","금","토"};
        for(int j=0;j<7;j++){text(c,heading,"widget_week_"+j,labels[j]);color(c,heading,"widget_week_"+j,foreground);}
        v.addView(id(c,"widget_calendar_v164"),heading);
        JSONArray events=data.optJSONArray("scheduleItems");JSONObject holidays=data.optJSONObject("holidays");
        String selected=selected(c,widget),today=day(Calendar.getInstance());
        int rowCount=fortnight?2:monthRows;
        Bundle dimensions=AppWidgetManager.getInstance(c).getAppWidgetOptions(widget);
        int available=dimensions==null?260:dimensions.getInt("appWidgetMinHeight",260);
        float cellHeight=((available-62f)*(kind.equals("CalendarMonth")||kind.equals("CalendarSplit")||split?1f:.6f)-20f)/rowCount-6f;
        for(int row=0;row<rowCount;row++){
            RemoteViews week=view(c,"widget_week_v164");
            for(int col=0;col<7;col++){
                String key=day(start);RemoteViews cell=view(c,"widget_day_v164");
                text(c,cell,"widget_day_number_v164",String.valueOf(start.get(Calendar.DAY_OF_MONTH)));
                String holiday=holidays==null?"":holidays.optString(key,"");
                text(c,cell,"widget_day_label_v164",holiday);
                List<String> dated=eventsOn(events,key);
                int visibleEvents=kind.equals("CalendarSplit")&&dimensions!=null&&dimensions.getInt("appWidgetMinWidth",320)>=560?2:1;
                String eventText=dated.isEmpty()?"":dated.get(0);if(visibleEvents==2&&dated.size()>1)eventText+="\n"+dated.get(1);
                text(c,cell,"widget_day_events_v164",eventText);
                text(c,cell,"widget_day_more_v164",kind.equals("CalendarSplit")&&dated.size()>visibleEvents?"+"+(dated.size()-visibleEvents):dated.size()>0?"●":"");
                boolean visibleHoliday=cellHeight>=24&&!holiday.isEmpty();
                show(c,cell,"widget_day_label_v164",visibleHoliday);
                show(c,cell,"widget_day_events_v164",kind.equals("CalendarSplit")&&cellHeight>=40);
                show(c,cell,"widget_day_more_v164",cellHeight>=(visibleHoliday?38:28));
                cell.setInt(id(c,"widget_day_number_v164"),"setHeight",Math.round(c.getResources().getDisplayMetrics().density*Math.max(12,Math.min(18,cellHeight-(visibleHoliday?10:0)))));
                boolean chosen=key.equals(selected),outside=!fortnight&&start.get(Calendar.MONTH)!=shownMonth;
                color(c,cell,"widget_day_number_v164",foreground);
                color(c,cell,"widget_day_label_v164",foreground);
                color(c,cell,"widget_day_events_v164",foreground);color(c,cell,"widget_day_more_v164",dark(c,chosenTheme)?0xffc1baff:PRIMARY);
                cell.setTextViewTextSize(id(c,"widget_day_number_v164"),2,Math.max(10,size-1.5f));
                cell.setTextViewTextSize(id(c,"widget_day_events_v164"),2,Math.max(11,size-3));
                cell.setTextViewTextSize(id(c,"widget_day_label_v164"),2,Math.max(10,size-4));
                cell.setInt(id(c,"widget_day_number_v164"),"setBackgroundResource",drawable(c,chosen?"widget_day_selected_v164":"widget_day_clear_v164"));
                cell.setImageViewResource(id(c,"widget_day_background_v164"),drawable(c,dark(c,chosenTheme)?"widget_day_dark_v164":key.equals(today)?"widget_day_today_v164":"widget_day_bg_v164"));
                cell.setInt(id(c,"widget_day_background_v164"),"setImageAlpha",Math.round(255*Math.max(0,Math.min(100,opacity<0?prefs(c).getInt("widget_opacity_"+widget,100):opacity))/100f));
                cell.setContentDescription(id(c,"widget_day_cell_v164"),key+(holiday.isEmpty()?"":" "+holiday)+" 일정 "+dated.size()+"개");
                cell.setOnClickPendingIntent(id(c,"widget_day_cell_v164"),kind.equals("CalendarSplit")||kind.equals("CalendarMonth")?open(c,widget,kind,"open-schedule-date-v168:"+key):navigate(c,widget,kind,"date",key));
                week.addView(id(c,"widget_week_cells_v164"),cell);
                start.add(Calendar.DAY_OF_MONTH,1);
            }
            v.addView(id(c,"widget_calendar_v164"),week);
        }
    }
    static List<String> eventsOn(JSONArray events,String day){
        List<String> out=new ArrayList<String>();if(events==null)return out;
        for(int i=0;i<events.length();i++){JSONObject event=events.optJSONObject(i);if(event==null)continue;String start=event.optString("date"),end=event.optString("endDate",start);if(end.length()==0)end=start;
            if(day.compareTo(start)>=0&&day.compareTo(end)<=0)out.add(event.optString("time","")+"  "+event.optString("title","일정"));}
        Collections.sort(out);return out;
    }
    static List<String> rows(Context c,int widget,String kind,JSONObject data){
        if(!kind.startsWith("Calendar"))return WidgetDesignV165.rows(c,widget,kind,data);
        if(kind.startsWith("Calendar")){
            List<String> records=new ArrayList<String>();JSONArray events=data.optJSONArray("scheduleItems");String chosen=selected(c,widget);
            for(int n=0;events!=null&&n<events.length();n++){JSONObject r=events.optJSONObject(n);if(r==null)continue;String start=r.optString("date"),end=r.optString("endDate",start);if(end.isEmpty())end=start;if(chosen.compareTo(start)>=0&&chosen.compareTo(end)<=0)records.add(r.toString());}
            Collections.sort(records,new java.util.Comparator<String>(){public int compare(String a,String b){try{return new JSONObject(a).optString("time").compareTo(new JSONObject(b).optString("time"));}catch(Exception e){return 0;}}});return records;
        }
        String key=kind.equals("RoutineAll")||kind.equals("RoutineCards")?"routines":kind.equals("RoutineStats")?"routineStats":kind.contains("RoutineLanguage")?"languageRows":kind.equals("LanguageYoutube")?"youtubeNotes":kind.equals("PersonalWorkflowOne")?"memos":kind.equals("PersonalWorkflowAll")?"memoTodos":kind.equals("PersonalTodo")?"todos":kind.equals("PersonalReading")?"readingBooks":kind.equals("PersonalQuote")?"readingCurrent":kind.equals("PersonalWorkoutStatsInbody")?"workoutStatsInbody":kind.equals("PersonalWorkoutStats")?"workoutStats":kind.equals("PersonalWorkoutChallengeAll")?"challengeAll":kind.equals("PersonalWorkoutChallengeCombined")?"challengeCombined":kind.equals("PersonalWorkoutChallengeOnly")?"challengeSelected":kind.equals("PersonalWorkoutChallenge")?"workoutChallenges":kind.equals("PersonalWorkoutMeal")?"mealWorkouts":kind.equals("PersonalWorkout")?"workouts":kind.equals("PersonalBulletSeven")?"bullet7":kind.equals("PersonalBulletSevenWorkflow")?"bullet7Workflow":kind.equals("PersonalBulletThreeWorkflow")?"bullet3Workflow":"bullet3";
        JSONArray list=data.optJSONArray(key);List<String> out=new ArrayList<String>();String selected=prefs(c).getString("widget_content_"+widget,"전체 내용");
        if(selected.equals("영어"))selected="English";if(selected.equals("일본어"))selected="Japanese";
        for(int i=0;list!=null&&i<list.length();i++){String line=list.optString(i,"").trim();if(line.length()==0)continue;
            if(key.startsWith("bullet")&&(line.contains("감정")||line.toLowerCase(Locale.US).contains("emotion")))continue;
            if((kind.equals("RoutineCards")||kind.equals("RoutineLanguage"))&&!selected.startsWith("전체")&&!line.contains(selected))continue;
            out.add(line);
        }return out;
    }
    static RemoteViews row(Context c,int widget,String kind,String line,int index,String overrideTheme,int selectedFont){
        if(!kind.startsWith("Calendar"))return WidgetDesignV165.row(c,widget,kind,line,index,overrideTheme,selectedFont);
        JSONObject record;try{record=new JSONObject(line);}catch(Exception e){record=new JSONObject();WidgetDesignV165.put(record,"title",line);}
        RemoteViews row=view(c,"widget_item_v164");boolean timed=record.optString("time").matches("^[0-9]{2}:[0-9]{2}.*");text(c,row,"widget_item_text_v164",record.optString("title"));text(c,row,"widget_item_time_v165",timed?record.optString("time"):"");show(c,row,"widget_item_time_v165",true);
        String rowTheme=overrideTheme==null?theme(c,widget):overrideTheme;row.setImageViewResource(id(c,"widget_item_background_v165"),drawable(c,dark(c,rowTheme)?"widget_card_dark_v165":"widget_card_v165"));Integer previewOpacity=WidgetDesignV165.previewOpacity.get();row.setInt(id(c,"widget_item_background_v165"),"setImageAlpha",Math.round(255*(previewOpacity==null?prefs(c).getInt("widget_opacity_"+widget,100):previewOpacity)/100f));
        color(c,row,"widget_item_text_v164",ink(c,overrideTheme==null?theme(c,widget):overrideTheme));
        float size=selectedFont<0?font(c,widget):11.5f+selectedFont*.8f;
        row.setTextViewTextSize(id(c,"widget_item_text_v164"),2,size);
        show(c,row,"widget_item_dot_v164",kind.startsWith("Calendar"));
        WidgetDesignV165.put(record,"selectedDate",selected(c,widget));WidgetDesignV165.put(record,"uid",snapshot(c).optString("uid"));
        row.setOnClickFillInIntent(id(c,"widget_item_row_v164"),new Intent().putExtra("widgetRow",index).putExtra("action","open-schedule-item-v168:"+Uri.encode(record.toString())));
        return row;
    }
    static void collection(Context c,RemoteViews v,int widget,String kind,List<String> rows)throws RuntimeException{
        collection(c,v,widget,kind,rows,id(c,"widget_items_v164"));
    }
    static void collection(Context c,RemoteViews v,int widget,String kind,List<String> rows,int list)throws RuntimeException{
        String target=kind.startsWith("Calendar")?"home":kind.contains("Language")?"language":kind.startsWith("Routine")?"private":"personal";
        Intent open=new Intent().setClassName(c,c.getPackageName()+".MainActivity").setAction("aiderlog.widget.collection."+widget+"."+kind).putExtra("target",target).addFlags(0x14000000);
        v.setPendingIntentTemplate(list,PendingIntent.getActivity(c,widget*17+kind.hashCode(),open,android.os.Build.VERSION.SDK_INT>=31?0x0a000000:0x08000000));
        if(android.os.Build.VERSION.SDK_INT>=31&&kind.startsWith("Calendar")&&rows.size()<=40){try{
            Class<?> builderClass=Class.forName("android.widget.RemoteViews$RemoteCollectionItems$Builder");Object builder=builderClass.getDeclaredConstructor().newInstance();
            builderClass.getMethod("setHasStableIds",boolean.class).invoke(builder,true);
            builderClass.getMethod("setViewTypeCount",int.class).invoke(builder,16);
            for(int i=0;i<rows.size();i++)builderClass.getMethod("addItem",long.class,RemoteViews.class).invoke(builder,((long)rows.get(i).hashCode()<<32)^i,row(c,widget,kind,rows.get(i),i,null,-1));
            Object items=builderClass.getMethod("build").invoke(builder);
            RemoteViews.class.getMethod("setRemoteAdapter",int.class,items.getClass()).invoke(v,list,items);prefs(c).edit().putBoolean("widget_service_"+widget,false).apply();return;
        }catch(Exception error){Log.w("AiderLogWidget","Collection API unavailable; using RemoteViewsService",error);}}
        Intent service=new Intent().setClassName(c,c.getPackageName()+".WidgetRowsV164").putExtra("appWidgetId",widget).putExtra("kind",kind);
        service.setData(Uri.parse("aiderlog-widget-rows://"+widget+"/"+kind+"/"+selected(c,widget)));
        v.setRemoteAdapter(list,service);
        prefs(c).edit().putBoolean("widget_service_"+widget,true).apply();
    }
    static void mealPhotos(Context c,RemoteViews v,JSONObject data){
        JSONArray photos=data.optJSONArray("mealPhotos"),times=data.optJSONArray("mealTimes"),ratings=data.optJSONArray("mealRatings");
        for(int i=0;i<4;i++){
            // RemoteViews can reapply onto an existing host: absent data must clear
            // any previously displayed user's bitmap, not leave it behind.
            v.setImageViewResource(id(c,"widget_meal_photo_"+i),0);
            String time=times==null?"":times.optString(i,"");text(c,v,"widget_meal_time_"+i,time);show(c,v,"widget_meal_time_"+i,!time.isEmpty());
            String rating="";if(ratings!=null&&!ratings.optString(i,"").isEmpty()){int stars=Math.max(0,Math.min(5,ratings.optInt(i,0)));for(int n=0;n<5;n++)rating+=n<stars?"★":"☆";}text(c,v,"widget_meal_rating_"+i,rating);
            String src=photos==null?"":photos.optString(i,"");if(!src.startsWith("data:image/"))continue;
            try{byte[] bytes=android.util.Base64.decode(src.substring(src.indexOf(',')+1),0);BitmapFactory.Options options=new BitmapFactory.Options();options.inSampleSize=2;Bitmap bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.length,options);if(bitmap!=null){Bitmap thumb=Bitmap.createScaledBitmap(bitmap,200,160,true);v.setImageViewBitmap(id(c,"widget_meal_photo_"+i),thumb);}}catch(Exception ignored){}
        }
    }
    /** Settings preview is the same RemoteViews tree, with unsaved appearance overrides only. */
    public static void preview(Activity activity){
        try{
            Class<?> cls=activity.getClass();java.lang.reflect.Field wf=cls.getDeclaredField("appWidgetId"),kf=cls.getDeclaredField("providerClass"),tf=cls.getDeclaredField("selectedTheme"),of=cls.getDeclaredField("selectedOpacity"),ff=cls.getDeclaredField("selectedFont");
            for(java.lang.reflect.Field f:new java.lang.reflect.Field[]{wf,kf,tf,of,ff})f.setAccessible(true);
            ViewGroup host=(ViewGroup)activity.findViewById(id(activity,"widget_config_preview_v164"));if(host==null)return;
            java.lang.reflect.Field content=cls.getDeclaredField("selectedContent");content.setAccessible(true);WidgetDesignV165.previewContent.set((String)content.get(activity));WidgetDesignV165.previewOpacity.set(of.getInt(activity));
            RemoteViews remote=render(activity,wf.getInt(activity),type((String)kf.get(activity)),true,(String)tf.get(activity),of.getInt(activity),ff.getInt(activity));
            host.removeAllViews();host.addView(remote.apply(activity,host));
        }catch(Throwable error){Log.w("AiderLogWidget","Settings preview unavailable",error);}finally{WidgetDesignV165.previewContent.remove();WidgetDesignV165.previewOpacity.remove();}
    }
}
