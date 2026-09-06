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
        System.out.println("PASS: "+checks+" native model assertions.");
    }
}
