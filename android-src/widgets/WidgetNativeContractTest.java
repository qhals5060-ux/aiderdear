package com.aiderlog.v22app;
import org.json.JSONArray;
import org.json.JSONObject;
import java.util.List;

/** Pure model tests only: these do not stand in for a Samsung launcher device test. */
public final class WidgetNativeContractTest {
    static int checks=0;
    static void require(boolean value,String reason){checks++;if(!value)throw new AssertionError(reason);}
    public static void main(String[] args)throws Exception{
        JSONArray events=new JSONArray();
        events.put(new JSONObject().put("id","trip").put("date","2026-09-04").put("endDate","2026-09-07").put("title","사용자 여행").put("time",""));
        events.put(new JSONObject().put("id","meeting").put("date","2026-09-06").put("time","09:30").put("title","사용자 미팅"));
        events.put(new JSONObject().put("id","visit").put("date","2026-09-06").put("endDate","").put("time","14:00").put("title","사용자 방문"));
        List<String> sameDay=WidgetNativeV164.eventsOn(events,"2026-09-06");
        require(sameDay.size()==3,"all same-day and multi-day events retained");
        require(sameDay.get(1).contains("09:30"),"time order before14:00");
        require(sameDay.get(2).contains("14:00"),"empty endDate defaults to start");
        require(WidgetNativeV164.eventsOn(events,"2026-09-07").size()==1,"end day inclusive");
        require(WidgetNativeV164.eventsOn(events,"2026-09-08").isEmpty(),"outside interval empty");
        require(WidgetNativeV164.eventsOn(null,"2026-09-06").isEmpty(),"first install no demo events");
        require("CalendarMonth".equals(WidgetNativeV164.type("com.aiderlog.v22app.WidgetProvider$CalendarMonth")),"provider resolution");
        require("".equals(WidgetNativeV164.type(null)),"missing type safe");
        require("2026-09-06".equals(WidgetNativeV164.day(WidgetNativeV164.date("2026-09-06"))),"date round trip");
        JSONObject model=new JSONObject("{\"today\":\"2026-09-06\",\"workouts\":[{\"date\":\"2026-09-01\",\"minutes\":30,\"exercises\":[{\"name\":\"Squat\",\"sets\":[{\"weight\":20,\"reps\":12}]}]},{\"date\":\"2026-09-06\",\"minutes\":60,\"exercises\":[{\"name\":\"Squat\",\"sets\":[{\"weight\":35,\"reps\":8}]}]},{\"date\":\"2026-07-01\",\"minutes\":90}]}");
        JSONObject stats=WidgetDesignV165.workoutStats(model,7);
        require(stats.optInt("count")==2&&stats.optInt("total")==90,"exercise period counts and measured minutes only");
        require(stats.optInt("average")==45&&stats.optInt("longest")==60,"actual average and longest minutes");
        List<JSONObject> trends=WidgetDesignV165.workoutTrends(model,7);
        require(trends.size()==1&&trends.get(0).optString("title").contains("35kg"),"maximum weight by actual exercise");
        require(trends.get(0).optJSONArray("values").length()==2,"per-date weight trend, no invented seconds from reps");
        long initial=WidgetDesignV165.stableId("{\"kind\":\"todo\",\"id\":\"A\",\"done\":false}",0);
        require(initial==WidgetDesignV165.stableId("{\"kind\":\"todo\",\"id\":\"A\",\"done\":true}",5),"stable collection ID survives update/reorder");
        require(initial!=WidgetDesignV165.stableId("{\"kind\":\"todo\",\"id\":\"B\"}",0),"different record IDs remain distinct");
        JSONObject workout=new JSONObject("{\"minutes\":42,\"exercises\":[{\"name\":\"스쿼트\",\"sets\":[{\"weight\":30,\"reps\":12},{\"weight\":30,\"reps\":12}]},{\"name\":\"플랭크\",\"sets\":[{\"seconds\":60},{\"seconds\":60}]},{\"name\":\"런지\",\"sets\":[{\"reps\":8},{\"reps\":10}]}]}");
        String summary=WidgetDesignV165.workoutSummary(workout);
        require(summary.contains("스쿼트 · 2세트 × 12회 · 30kg"),"identical repetitions compact without changing actual weight");
        require(summary.contains("플랭크 · 2세트 × 60초"),"timed sets keep seconds units");
        require(summary.contains("런지 · 8회 / 10회"),"different doses remain separate");
        require(!WidgetDesignV165.workoutSummary(new JSONObject()).contains("0분"),"missing minutes not invented");
        for(String kind:new String[]{"note","routineStats","workoutStats","workout","quote"}){
            require("widget_panel_v176".equals(WidgetDesignV165.surface(kind,false,false)),kind+" uses a lavender information panel, not the outer fill");
            require("widget_panel_dark_v176".equals(WidgetDesignV165.surface(kind,false,true)),kind+" preserves the dark colour preference");
        }
        for(String kind:new String[]{"routine","challenge","workflow","trend"}){
            require("widget_framed_v176".equals(WidgetDesignV165.surface(kind,false,false)),kind+" uses a separate white framed card");
            require("widget_card_dark_v165".equals(WidgetDesignV165.surface(kind,false,true)),kind+" remains readable in dark theme");
        }
        for(String kind:new String[]{"todo","book"})require("widget_card_v165".equals(WidgetDesignV165.surface(kind,false,false)),kind+" leaves the base visible");
        require("widget_panel_v176".equals(WidgetDesignV165.surface("book",true,false)),"selected reading detail uses a lavender panel");
        require("widget_bullet_card_v168".equals(WidgetDesignV165.surface("day",false,false)),"bullet days retain their own bordered surface");
        require(WidgetCompactCalendarV181.supports("CalendarAgenda@todos"),"agenda second adapter uses compact renderer");
        require(WidgetCompactCalendarV181.supports("CalendarFortnight@todos"),"fortnight second adapter uses compact renderer");
        require(!WidgetCompactCalendarV181.supports("CalendarMonth"),"other calendar provider layout unchanged");
        List<String> compactEvents=WidgetCompactCalendarV181.scheduleRows(events,"2026-09-06");
        require(compactEvents.size()==3,"compact agenda retains all same-day and spanning events");
        require(new JSONObject(compactEvents.get(0)).optString("id").equals("trip"),"untimed events precede timed events without a fake all-day label");
        require(new JSONObject(compactEvents.get(1)).optString("id").equals("meeting"),"compact event list is chronological");
        require(WidgetCompactCalendarV181.scheduleRows(events,"2026-09-08").isEmpty(),"compact agenda does not show another date");
        require(WidgetCompactCalendarV181.scheduleRows(null,"2026-09-06").isEmpty(),"compact first launch contains no sample schedules");
        require(WidgetCompactCalendarV181.time(new JSONObject().put("time","09:30")).equals("09:30"),"widget time keeps requested HH:mm column");
        require(WidgetCompactCalendarV181.time(new JSONObject().put("time","09:30").put("allDay",true)).isEmpty(),"all-day event has no timed prefix");
        require(WidgetCompactCalendarV181.time(new JSONObject().put("time","종일")).isEmpty(),"legacy all-day label hidden");
        JSONObject todoData=new JSONObject().put("v165",new JSONObject().put("today","2026-09-06").put("uid","A").put("todos",new JSONArray()
            .put(new JSONObject().put("id","old").put("title","지난 마감").put("dueAt","2026-01-01"))
            .put(new JSONObject().put("id","future").put("title","미래 마감").put("dueAt","2027-01-01"))
            .put(new JSONObject().put("id","undated").put("title","날짜 없는 할 일"))
            .put(new JSONObject().put("id","done").put("title","완료").put("done",true))
            .put(new JSONObject().put("id","old").put("title","중복"))
            .put(new JSONObject().put("title","식별자 없음"))));
        List<String> todos=WidgetCompactCalendarV181.incompleteRows(todoData,false);
        require(todos.size()==3,"all unfinished todos independent of date, without completed or duplicate IDs");
        require(new JSONObject(todos.get(0)).optString("id").equals("old"),"overdue todo remains visible");
        require(new JSONObject(todos.get(1)).optString("id").equals("future"),"future todo remains visible");
        require(new JSONObject(todos.get(2)).optString("id").equals("undated"),"undated todo remains visible");
        List<String> pairs=WidgetCompactCalendarV181.incompleteRows(todoData,true);
        require(pairs.size()==2,"odd number of todos becomes two rows");
        require(new JSONObject(pairs.get(0)).optJSONArray("children").length()==2,"paired first row contains two real todos");
        require(new JSONObject(pairs.get(1)).optJSONArray("children").length()==1,"odd last row adds no fake todo");
        require(WidgetDesignV165.stableId(pairs.get(0),0)==WidgetDesignV165.stableId(pairs.get(0),5),"paired collection ID independent of position");
        JSONObject changedPair=new JSONObject(pairs.get(0));changedPair.optJSONArray("children").optJSONObject(0).put("title","수정된 제목");
        require(WidgetDesignV165.stableId(pairs.get(0),0)==WidgetDesignV165.stableId(changedPair.toString(),0),"paired collection ID survives title edits");
        todoData.optJSONObject("v165").put("incompleteTodos",new JSONArray());
        require(WidgetCompactCalendarV181.incompleteRows(todoData,false).isEmpty(),"explicit empty account collection does not fall back to old todos");
        require(WidgetCompactCalendarV181.incompleteRows(new JSONObject(),true).isEmpty(),"signed-out snapshot clears todo rows");
        require(WidgetCompactCalendarV181.sameOwner("A",todoData),"snapshot rows keep originating account");
        require(!WidgetCompactCalendarV181.sameOwner("B",todoData),"old service rows blocked after another account signs in");
        require(!WidgetCompactCalendarV181.sameOwner("A",new JSONObject()),"old service rows blocked immediately on sign out");
        require(!WidgetCompactCalendarV181.sameOwner(null,todoData),"uncaptured rows cannot bind an account");
        JSONArray many=new JSONArray();for(int i=0;i<121;i++)many.put(new JSONObject().put("id","t"+i).put("title","할 일 "+i));
        todoData.optJSONObject("v165").put("incompleteTodos",many);
        require(WidgetCompactCalendarV181.incompleteRows(todoData,false).size()==121,"scroll collection is not truncated to visible six todos");
        require(WidgetCompactCalendarV181.incompleteRows(todoData,true).size()==61,"paired scroll collection retains every todo");
        require(WidgetPreviewFrameV181.heightForWidth(336,0,0,0,0)==168,"compact preview is exact 4x2");
        require(WidgetPreviewFrameV181.heightForWidth(360,12,12,12,12)==192,"preview excludes outer padding from its ratio");
        require(WidgetPreviewFrameV181.compact("CalendarAgenda")&&WidgetPreviewFrameV181.compact("CalendarFortnight"),"only both compact providers use the compact preview");
        require(!WidgetPreviewFrameV181.compact("RoutineAll"),"other previews preserve their size");
        require(WidgetCompactCalendarV181.fortnightStart("2026-09-19").equals("2026-09-14"),"fortnight follows this week's Monday rather than saved selection");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19","2026-09-04").equals("2026-09-19"),"old hidden selected day resets highlight to today");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19","2026-09-27").equals("2026-09-27"),"last day in current fortnight remains selected");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19","2026-09-28").equals("2026-09-19"),"future date outside fortnight resets highlight to today");
        require(WidgetCompactCalendarV181.fortnightStart("2026-10-01").equals("2026-09-28"),"fortnight rolls across month boundary");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-10-01","2026-10-11").equals("2026-10-11"),"month-boundary fortnight retains in-range selection");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19",null).equals("2026-09-19"),"missing selection safely uses today");
        System.out.println("PASS: "+checks+" native model assertions.");
    }
}
