package com.aiderlog.v22app;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.charset.StandardCharsets;
import java.util.List;
import org.json.JSONObject;
import org.json.JSONArray;
public final class WidgetCoreContractV194 {
    static int assertions=0;
    static void require(boolean condition,String name){assertions++;if(!condition)throw new AssertionError(name);}
    public static void main(String[] args)throws Exception{
        JSONObject data=new JSONObject(new String(Files.readAllBytes(Paths.get(args[0])),StandardCharsets.UTF_8));
        JSONObject model=WidgetDesignV165.model(data);
        String[] kept={"CalendarMonth","CalendarCombined","CalendarSplit","CalendarFortnight","RoutineAll","RoutineCards","RoutineStats"};
        for(String kind:kept){require(WidgetProvider.supports(kind),"retained provider "+kind);require(WidgetProvider.supports("com.aiderlog.v22app.WidgetProvider$"+kind),"component "+kind);}
        for(String kind:new String[]{"CalendarAgenda","PersonalToday","PersonalTodo","PersonalWorkflowAll","PersonalMeal","PersonalQuote","TaskClientLink","TaskWeek","","Other",null}){
            require(!WidgetProvider.supports(kind),"removed provider "+kind);
            require(WidgetNativeV164.rows(null,1,kind,data).isEmpty(),"removed collection "+kind);
            require(WidgetNativeV164.row(null,1,kind,"{}",0,null,-1)==null,"removed row "+kind);
        }
        require(!WidgetApprovedV188.supports("PersonalToday"),"approved renderer limited to routine");
        require(model.optString("uid").equals("scope-user-a"),"model owner maintained");
        require(model.optJSONArray("routines").length()==2,"routine projection filters demo");
        require(!model.has("meals")&&!model.has("workflows")&&!model.has("books"),"unrelated data absent");
        List<String> routines=WidgetRoutineV194.rows("RoutineAll",data,new JSONObject());
        require(routines.size()==2,"two compact routine rows without decorative summary");
        for(String json:routines)require(WidgetRoutineV194.validOwner(new JSONObject(json),data),"routine row owner guard");
        List<String> selected=WidgetRoutineV194.rows("RoutineCards",data,new JSONObject().put("id","r2"));
        require(selected.size()==1&&new JSONObject(selected.get(0)).optString("id").equals("r2"),"configured routine selection survives");
        require(new JSONObject(selected.get(0)).optBoolean("detail"),"configured routine detail");
        List<String> stats=WidgetRoutineV194.rows("RoutineStats",data,new JSONObject());
        require(stats.size()==1&&new JSONObject(stats.get(0)).optString("kind").equals("stats"),"statistics contract");
        List<String> todos=WidgetCompactCalendarV181.incompleteRows(data,false);
        require(todos.size()==1&&new JSONObject(todos.get(0)).optString("id").equals("t1"),"calendar todo excludes done/memo/emotion");
        require(new JSONObject(todos.get(0)).optLong("updatedAt")==500,"todo mutation timestamp preserved");
        JSONArray schedules=data.optJSONArray("scheduleItems");
        List<String> day=WidgetCompactCalendarV181.scheduleRows(schedules,"2026-09-27");
        require(day.size()==2,"multi-day event and current event retained");
        List<String> upcoming=WidgetCompactCalendarV181.upcomingRows(schedules,"2026-09-27");
        require(upcoming.size()==3,"future schedule retained, expired removed");
        require(!WidgetCompactCalendarV181.sameOwner("scope-user-b",data),"stale owner rejected");
        require(WidgetCompactCalendarV181.memoRows(data).size()==2,"real memos and legacy checklist memos retained");
        JSONObject first=new JSONObject(WidgetCompactCalendarV181.memoRows(data).get(0)),second=new JSONObject(WidgetCompactCalendarV181.memoRows(data).get(1));
        require(first.optString("id").equals(second.optString("id")),"fixture overlapping memo IDs");
        require(WidgetDesignV165.stableId(first.toString(),0)!=WidgetDesignV165.stableId(second.toString(),1),"source-qualified memo stable IDs distinct");
        JSONObject stale=new JSONObject(routines.get(0));require(!WidgetRoutineV194.validOwner(stale,new JSONObject().put("v165",new JSONObject().put("uid","other"))),"routine stale account owner hidden");
        JSONObject anonymous=new JSONObject(data.toString());anonymous.getJSONObject("v165").put("uid","");anonymous.put("uid","");
        require(!WidgetRoutineV194.validOwner(stale,anonymous),"routine row hidden after logout");
        require(!WidgetRoutineV194.validOwner(new JSONObject().put("_owner",""),anonymous),"empty owner never authorizes data");
        List<String> locked=WidgetRoutineV194.rows("RoutineAll",anonymous,new JSONObject());require(locked.size()==1&&new JSONObject(locked.get(0)).optString("kind").equals("empty"),"stale model with empty UID replaced login placeholder");
        require(!WidgetCompactCalendarV181.sameOwner("",anonymous),"empty calendar/memo owner rejected");
        require(new JSONObject(stats.get(0)).optInt("total")==2,"compact statistics denominator");
        require(new JSONObject(stats.get(0)).getJSONArray("weekCounts").length()==7,"compact statistics week");
        require(WidgetRoutineV194.previewRows(190,12)==2,"narrow routine preview keeps two complete control rows");
        require(WidgetRoutineV194.previewRows(230,12)==3,"normal routine preview shows three complete rows");
        require(WidgetRoutineV194.previewRows(230,24)<WidgetRoutineV194.previewRows(230,12),"large text reduces preview rows");
        require(WidgetCompactCalendarV181.previewRows("CalendarFortnight",280,1)==1,"narrow fortnight preview keeps complete schedule row");
        require(WidgetCompactCalendarV181.previewRows("CalendarFortnight@notes",280,1)==1,"narrow fortnight preview keeps complete memo row");
        require(WidgetCompactCalendarV181.previewRows("CalendarSplit@notes",340,1)==2,"month preview fits two memo rows");
        require(WidgetCompactCalendarV181.rows(null,1,"CalendarSplit@notes",anonymous).isEmpty(),"empty-owner stale notes never enter collection");
        require(WidgetCompactCalendarV181.rows(null,1,"CalendarFortnight@todos",anonymous).isEmpty(),"empty-owner stale todos never enter collection");
        System.out.println("PASS "+assertions+" core widget native/model assertions");
    }
}
