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
        for(String kind:new String[]{"note","youtube","routineStats","workoutStats","workout","quote"}){
            require("widget_panel_v176".equals(WidgetDesignV165.surface(kind,false,false)),kind+" uses a lavender information panel, not the outer fill");
            require("widget_panel_dark_v176".equals(WidgetDesignV165.surface(kind,false,true)),kind+" preserves the dark colour preference");
        }
        for(String kind:new String[]{"routine","challenge","workflow","trend"}){
            require("widget_framed_v176".equals(WidgetDesignV165.surface(kind,false,false)),kind+" uses a separate white framed card");
            require("widget_card_dark_v165".equals(WidgetDesignV165.surface(kind,false,true)),kind+" remains readable in dark theme");
        }
        for(String kind:new String[]{"todo","language","book"})require("widget_card_v165".equals(WidgetDesignV165.surface(kind,false,false)),kind+" leaves the base visible");
        require("widget_panel_v176".equals(WidgetDesignV165.surface("book",true,false)),"selected reading detail uses a lavender panel");
        require("widget_bullet_card_v168".equals(WidgetDesignV165.surface("day",false,false)),"bullet days retain their own bordered surface");
        System.out.println("PASS: "+checks+" native model assertions.");
    }
}
