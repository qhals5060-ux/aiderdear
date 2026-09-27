package com.aiderlog.v22app;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.json.JSONObject;
import org.json.JSONArray;
public final class WidgetCoreContractV193 {
    static int assertions=0;
    static void require(boolean condition,String name){assertions++;if(!condition)throw new AssertionError(name);}
    public static void main(String[] args)throws Exception{
        JSONObject data=new JSONObject(new String(Files.readAllBytes(Paths.get(args[0])),StandardCharsets.UTF_8));
        JSONObject model=WidgetDesignV165.model(data);
        String[] kept={"CalendarMonth","CalendarCombined","CalendarSplit","CalendarFortnight","CalendarAgenda","RoutineAll","RoutineCards","RoutineStats"};
        for(String kind:kept){require(WidgetProvider.supports(kind),"retained provider "+kind);require(WidgetProvider.supports("com.aiderlog.v22app.WidgetProvider$"+kind),"component "+kind);}
        for(String kind:new String[]{"PersonalToday","PersonalTodo","PersonalWorkflowAll","PersonalMeal","PersonalQuote","TaskClientLink","TaskWeek","","Other",null}){
            require(!WidgetProvider.supports(kind),"removed provider "+kind);
            require(WidgetNativeV164.rows(null,1,kind,data).isEmpty(),"removed collection "+kind);
            require(WidgetNativeV164.row(null,1,kind,"{}",0,null,-1)==null,"removed row "+kind);
        }
        require(!WidgetApprovedV188.supports("PersonalToday"),"approved renderer limited to routine");
        require(model.optString("uid").equals("scope-user-a"),"model owner maintained");
        require(model.optJSONArray("routines").length()==2,"routine projection filters demo");
        require(!model.has("meals")&&!model.has("workflows")&&!model.has("books"),"unrelated data absent");
        List<String> routines=WidgetApprovedV188.buildRows("RoutineAll",false,model,data,new JSONObject());
        require(routines.size()==3,"summary and two real routine rows");
        require(new JSONObject(routines.get(0)).optInt("total")==2,"summary total");
        require(new JSONObject(routines.get(0)).optInt("todayDone")==1,"summary completion");
        for(String json:routines)require(WidgetApprovedV188.validOwner(new JSONObject(json),data),"routine row owner guard");
        List<String> selected=WidgetApprovedV188.buildRows("RoutineCards",false,model,data,new JSONObject().put("id","r2"));
        require(selected.size()==1&&new JSONObject(selected.get(0)).optString("id").equals("r2"),"configured routine selection survives");
        require(new JSONObject(selected.get(0)).optBoolean("detail"),"configured routine detail");
        List<String> stats=WidgetApprovedV188.buildRows("RoutineStats",false,model,data,new JSONObject());
        require(stats.size()==2&&new JSONObject(stats.get(0)).optString("kind").equals("stats"),"statistics contract");
        List<String> todos=WidgetCompactCalendarV181.incompleteRows(data,false);
        require(todos.size()==1&&new JSONObject(todos.get(0)).optString("id").equals("t1"),"calendar todo excludes done/memo/emotion");
        require(new JSONObject(todos.get(0)).optLong("updatedAt")==500,"todo mutation timestamp preserved");
        JSONArray schedules=data.optJSONArray("scheduleItems");
        List<String> day=WidgetCompactCalendarV181.scheduleRows(schedules,"2026-09-27");
        require(day.size()==2,"multi-day event and current event retained");
        List<String> upcoming=WidgetCompactCalendarV181.upcomingRows(schedules,"2026-09-27");
        require(upcoming.size()==3,"future schedule retained, expired removed");
        require(!WidgetCompactCalendarV181.sameOwner("scope-user-b",data),"stale owner rejected");
        System.out.println("PASS "+assertions+" core widget native/model assertions");
    }
}
