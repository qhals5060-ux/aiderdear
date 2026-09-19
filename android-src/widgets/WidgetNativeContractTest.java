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
        for(String kind:new String[]{"CalendarCombined","CalendarMonth","CalendarSplit"})require(WidgetCompactCalendarV181.supports(kind),"all five calendar providers use approved compact compositions");
        require(!WidgetCompactCalendarV181.supports("RoutineAll"),"unrelated provider remains unchanged");
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
        require(WidgetPreviewFrameV181.compact("RoutineAll"),"approved routine preview now matches its compact installed composition");
        require(!WidgetPreviewFrameV181.compact("PersonalMeal"),"legacy compatibility previews preserve their size");
        require(WidgetCompactCalendarV181.fortnightStart("2026-09-19").equals("2026-09-13"),"fortnight starts on Sunday like the approved calendar");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19","2026-09-04").equals("2026-09-19"),"old hidden selected day resets highlight to today");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19","2026-09-26").equals("2026-09-26"),"last day in current fortnight remains selected");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19","2026-09-28").equals("2026-09-19"),"future date outside fortnight resets highlight to today");
        require(WidgetCompactCalendarV181.fortnightStart("2026-10-01").equals("2026-09-27"),"fortnight rolls across month boundary");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-10-01","2026-10-10").equals("2026-10-10"),"month-boundary fortnight retains in-range selection");
        require(WidgetCompactCalendarV181.fortnightSelected("2026-09-19",null).equals("2026-09-19"),"missing selection safely uses today");
        require(WidgetCompactCalendarV181.cellTime(new JSONObject().put("time","09:30")).equals("9:30"),"narrow B time omits leading zero while A preserves HH:mm");
        require(WidgetCompactCalendarV181.cellTime(new JSONObject().put("time","14:00")).equals("14:00"),"afternoon hour stays unambiguous");
        require(WidgetCompactCalendarV181.cellTime(new JSONObject().put("allDay",true)).isEmpty(),"all-day title receives full cell width");
        require(WidgetNativeV164.calendarEventCapacity(38)==1,"short month cell preserves one event");
        require(WidgetNativeV164.calendarEventCapacity(72)==2,"medium month cell shows two events");
        require(WidgetNativeV164.calendarEventCapacity(104)==3,"large month cell uses space for three events");
        require(WidgetNativeV164.calendarEventSp(38)==9,"short cell has compact text");
        require(WidgetNativeV164.calendarEventSp(104)==11.5f,"large month no longer keeps tiny event text");
        List<String> upcoming=WidgetCompactCalendarV181.upcomingRows(events,"2026-09-06");
        require(upcoming.size()==3,"upcoming includes an ongoing multi-day event once");
        require(new JSONObject(upcoming.get(0)).optString("selectedDate").equals("2026-09-06"),"ongoing event opens current day rather than past start");
        JSONArray futureEvents=new JSONArray(events.toString()).put(new JSONObject().put("id","future").put("date","2026-09-30").put("title","이달 말 일정").put("time","08:00"));
        require(WidgetCompactCalendarV181.upcomingRows(futureEvents,"2026-09-08").size()==1,"upcoming retains future days and omits finished events");
        require(new JSONObject(WidgetCompactCalendarV181.upcomingRows(futureEvents,"2026-09-06").get(3)).optString("id").equals("future"),"future morning time is sorted after today's evening");
        require(WidgetCompactCalendarV181.shortDate("2026-09-06").equals("9.6"),"upcoming date stamp is compact and explicit");
        require(WidgetCompactCalendarV181.shortDate("").isEmpty(),"undated todos do not invent a deadline");
        require(WidgetCompactCalendarV181.capacity(70,14,false)>WidgetCompactCalendarV181.capacity(40,14,false),"event titles use available cell height");
        require(WidgetCompactCalendarV181.capacity(70,22,true)<WidgetCompactCalendarV181.capacity(70,14,false),"holiday line and system font scaling reserve event space");
        require(WidgetPreviewFrameV181.heightForWidth("CalendarCombined",336,0,0,0,0)==255,"preview first style keeps approved split proportions");
        require(WidgetPreviewFrameV181.heightForWidth("CalendarSplit",336,0,0,0,0)==484,"preview fifth style has room for month and bottom todos");
        require(WidgetPreviewFrameV181.compact("CalendarMonth")&&WidgetPreviewFrameV181.compact("CalendarCombined")&&WidgetPreviewFrameV181.compact("CalendarSplit"),"all five settings previews use matching live composition sizes");
        require(WidgetCompactCalendarV181.small(180,110),"minimum launcher rectangle uses compact chrome");
        require(WidgetCompactCalendarV181.small(336,180),"short wide widget also reclaims header space");
        require(!WidgetCompactCalendarV181.small(336,255),"existing normal picker size retains regular design");
        require(WidgetCompactCalendarV181.smallRows("CalendarCombined",180,320),"narrow split pane stacks date and time under title");
        require(!WidgetCompactCalendarV181.smallRows("CalendarCombined",500,320),"expanded Fold pane uses normal date column");
        require(WidgetCompactCalendarV181.smallRows("CalendarAgenda",110,110),"two-column agenda uses compact scroll rows");
        require(Math.abs(WidgetCompactCalendarV181.eventPaneWidth("CalendarAgenda",336,255)-324)<.01,"agenda inline row receives the full inner width");
        require(Math.abs(WidgetCompactCalendarV181.eventPaneWidth("CalendarCombined",336,255)-163.22f)<.01,"combined inline row excludes divider and pane padding");
        require(Math.abs(WidgetCompactCalendarV181.eventPaneWidth("CalendarCombined",180,110)-84.18f)<.01,"minimum combined row measures its narrow right pane");
        require(!WidgetCompactCalendarV181.inlineEventRow(119.9f,28,28,12,1),"below required width preserves title on a second line");
        require(WidgetCompactCalendarV181.inlineEventRow(120,28,28,12,1),"exact boundary fits metadata and four title glyphs in one line");
        require(WidgetCompactCalendarV181.inlineEventRow(163.22f,28,28,12,1),"default combined width displays date time title on one row");
        require(!WidgetCompactCalendarV181.inlineEventRow(163.22f,42,42,12,1.5f),"large system text keeps two lines instead of squeezing metadata");
        require(WidgetCompactCalendarV181.inlineEventRow(324,42,42,12,1.5f),"wide agenda remains one row with large system text");
        require(WidgetCompactCalendarV181.inlineEventRow(100,20,17,11,1),"short all-day metadata uses one line when the actual text fits");
        require(!WidgetCompactCalendarV181.inlineEventRow(100,24,27,11,1),"longer date and timed metadata can require two lines in the same pane");
        require(WidgetCompactCalendarV181.eventTimeLabel(new JSONObject().put("time","09:30")).equals("09:30"),"inline time retains leading zero and minutes");
        require(WidgetCompactCalendarV181.eventTimeLabel(new JSONObject().put("time","09:30").put("allDay",true)).equals("종일"),"inline all-day event preserves its explicit label");
        require(WidgetCompactCalendarV181.eventTimeLabel(new JSONObject().put("time","종일")).equals("종일"),"legacy all-day metadata remains readable");
        require(WidgetCompactCalendarV181.capacity(14,15,false)==0,"shortest calendar cell never adds a clipped event line");
        require(WidgetCompactCalendarV181.capacity(30,15,false)==1,"compact fortnight cell can show a complete title line");
        for(String kind:new String[]{"CalendarCombined","CalendarFortnight","CalendarMonth","CalendarSplit"}){
            int weeks="CalendarFortnight".equals(kind)?2:6;float minimum="CalendarMonth".equals(kind)||"CalendarSplit".equals(kind)?180:110;
            float smallCell=WidgetCompactCalendarV181.cellHeight(kind,180,minimum,weeks),largeCell=WidgetCompactCalendarV181.cellHeight(kind,700,650,weeks);
            require(smallCell>=10,"six-week " +kind+" retains a visible date at minimum resize size");
            require(largeCell>smallCell,"expanded "+kind+" uses additional vertical space");
            require(WidgetCompactCalendarV181.capacity(largeCell,15,false)>WidgetCompactCalendarV181.capacity(smallCell,15,false),"expanded "+kind+" gains visible event titles");
        }
        JSONObject approved=new JSONObject("{\"today\":\"2026-09-20\",\"routines\":[{\"kind\":\"routine\",\"id\":\"r1\",\"title\":\"A\"},{\"kind\":\"routine\",\"id\":\"r2\",\"title\":\"B\"}],\"routineStats\":{\"total\":2,\"todayDone\":1},\"notes\":[{\"kind\":\"note\",\"id\":\"n1\",\"title\":\"memo\"}],\"incompleteTodos\":[{\"kind\":\"todo\",\"id\":\"t1\",\"dueAt\":\"2026-09-19\"}],\"meals\":[{\"slot\":\"breakfast\",\"id\":\"m1\",\"image\":\"data:image/png;base64,owner-photo\"},{\"slot\":\"lunch\"},{\"slot\":\"dinner\"},{\"slot\":\"snack\"}],\"workouts\":[{\"kind\":\"workout\",\"id\":\"old\",\"date\":\"2026-09-19\"},{\"kind\":\"workout\",\"id\":\"today\",\"date\":\"2026-09-20\"}],\"books\":[{\"kind\":\"book\",\"id\":\"b1\",\"recordId\":\"real-book\",\"quote\":\"actual quote\",\"quotePage\":22}],\"challenges\":[{\"kind\":\"challenge\",\"id\":\"ch1\",\"nodes\":[true,false]}],\"dates\":{\"2026-09-20\":[{\"id\":\"entry\",\"type\":\"reading\",\"title\":\"today reading\",\"time\":\"13:00\"}],\"2026-09-19\":[{\"id\":\"yesterday\",\"title\":\"past\"}]}} ");
        JSONObject approvedData=new JSONObject().put("scheduleItems",new JSONArray("[{\"id\":\"schedule\",\"date\":\"2026-09-20\",\"endDate\":\"2026-09-21\",\"time\":\"09:00\",\"title\":\"meeting\"}]"));
        JSONObject emptyOptions=new JSONObject();
        List<String> compactRoutine=WidgetApprovedV188.buildRows("RoutineCards",false,approved,approvedData,new JSONObject().put("id","r2"));
        require(compactRoutine.size()==1&&new JSONObject(compactRoutine.get(0)).optString("id").equals("r2"),"approved one-routine widget retains selected real record ID");
        require(new JSONObject(compactRoutine.get(0)).optBoolean("detail"),"one routine preserves detail fields and week history");
        require(WidgetApprovedV188.buildRows("RoutineStats",false,approved,approvedData,emptyOptions).size()==2,"statistics has its own compact chart and mini controls instead of repeating the full list");
        List<String> workflowLeft=WidgetApprovedV188.buildRows("PersonalWorkflowAll",false,approved,approvedData,emptyOptions),workflowRight=WidgetApprovedV188.buildRows("PersonalWorkflowAll",true,approved,approvedData,emptyOptions);
        require(new JSONObject(workflowLeft.get(0)).optString("id").equals("t1"),"Todo/Memo left collection is incomplete todos, including overdue");
        require(new JSONObject(workflowRight.get(0)).optString("id").equals("n1"),"Todo/Memo right collection is real notes");
        List<String> healthRows=WidgetApprovedV188.buildRows("PersonalWorkoutMeal",false,approved,approvedData,emptyOptions);
        require(healthRows.size()==3,"health combines measurements, one photo strip and today's actual workout");
        JSONArray mealStrip=new JSONObject(healthRows.get(1)).optJSONArray("children");
        require(mealStrip.length()==3,"empty snack does not waste photo strip space");
        require(mealStrip.getJSONObject(0).optString("image").contains("owner-photo"),"meal photo is carried from owner snapshot without sample fallback");
        require(new JSONObject(healthRows.get(2)).optString("id").equals("today"),"yesterday's exercise not represented as today's");
        List<String> readingRows=WidgetApprovedV188.buildRows("PersonalQuote",false,approved,approvedData,emptyOptions);
        require(readingRows.size()==3&&new JSONObject(readingRows.get(1)).optString("body").equals("actual quote"),"single reading widget contains actual book and quote with next-book form");
        List<String> todayRows=WidgetApprovedV188.buildRows("PersonalToday",false,approved,approvedData,emptyOptions);
        require(todayRows.size()==3&&new JSONObject(todayRows.get(0)).optInt("count")==2,"today widget contains today's real schedule and record only");
        require(new JSONObject(todayRows.get(1)).optString("id").equals("schedule"),"today timeline sorts actual time and preserves schedule identity");
        require(!todayRows.toString().contains("yesterday"),"today composition no longer embeds three-day bullet layouts");
        List<String> emptyReading=WidgetApprovedV188.buildRows("PersonalQuote",false,new JSONObject(),new JSONObject(),emptyOptions);
        require(emptyReading.size()==3&&new JSONObject(emptyReading.get(0)).optBoolean("_emptyV189"),"new install preserves an empty book form without an example book");
        List<String> emptyHealth=WidgetApprovedV188.buildRows("PersonalWorkoutMeal",false,new JSONObject(),new JSONObject(),emptyOptions);
        require(emptyHealth.size()==3&&new JSONObject(emptyHealth.get(0)).optBoolean("_emptyV189")&&new JSONObject(emptyHealth.get(2)).optBoolean("_emptyV189"),"new install preserves empty measure/meal/exercise forms without invented values");
        require(!WidgetApprovedV188.supports("PersonalBulletSeven"),"retired bullet provider remains isolated compatibility renderer");
        require(WidgetApprovedV188.supports("PersonalWorkflowAll@right"),"secondary collection routes into approved native renderer");
        require(approved.getJSONArray("routines").getJSONObject(1).optBoolean("detail")==false,"native composition does not mutate saved model");
        JSONObject accountA=new JSONObject().put("v165",new JSONObject().put("uid","account-A")),accountB=new JSONObject().put("v165",new JSONObject().put("uid","account-B"));
        JSONObject ownerBound=new JSONObject().put("id","same-row-id").put("children",new JSONArray().put(new JSONObject().put("kind","meal").put("id","meal-A")));
        WidgetApprovedV188.bindOwner(ownerBound,"account-A","2026-09-20");
        require(WidgetApprovedV188.validOwner(ownerBound,accountA),"row remains visible to its captured account");
        require(!WidgetApprovedV188.validOwner(ownerBound,accountB),"account change between service check and render clears the old row");
        require(!WidgetApprovedV188.validOwner(ownerBound,new JSONObject()),"logout clears a previously collected row");
        require(!WidgetApprovedV188.validOwner(new JSONObject(),new JSONObject()),"unbound or anonymous row cannot bypass owner validation");
        require(WidgetApprovedV188.validOwner(ownerBound.getJSONArray("children").getJSONObject(0),accountA),"meal child photo inherits source owner before recursive rendering");
        require(!WidgetApprovedV188.validOwner(ownerBound.getJSONArray("children").getJSONObject(0),accountB),"nested photo cannot be rebound to another account");
        require(WidgetDesignV165.model(WidgetApprovedV188.actionData(ownerBound)).optString("uid").equals("account-A"),"action UID is fixed to row source, never a fresh account snapshot");
        require(WidgetDesignV165.model(WidgetApprovedV188.actionData(ownerBound)).optString("today").equals("2026-09-20"),"action retains the row's captured date");
        require(WidgetApprovedV188.openType(new JSONObject().put("kind","stats")).equals("routine"),"routine statistics routes to routine instead of DayLog");
        require(WidgetApprovedV188.openType(new JSONObject().put("kind","timeline").put("type","reading")).equals("reading"),"DayLog timeline preserves its original category");
        for(String kind:new String[]{"RoutineAll","RoutineCards","RoutineStats","PersonalWorkoutMeal","PersonalQuote","PersonalWorkflowAll","PersonalToday","PersonalWorkoutChallengeOnly"}){
            JSONObject blankModel=new JSONObject().put("uid","account-A").put("today","2026-09-20");List<String> forms=WidgetApprovedV188.buildRows(kind,false,blankModel,accountA,new JSONObject());
            require(!forms.isEmpty(),kind+" preserves its empty form");
            for(String form:forms){JSONObject e=new JSONObject(form);require(e.optBoolean("_emptyV189"),kind+" missing records are explicit UI forms");require(WidgetApprovedV188.structuralOwner(e,accountA),kind+" form remains bound to original account");require(!WidgetApprovedV188.structuralOwner(e,accountB),kind+" old account form is cleared on account change");require(!e.has("percent")&&!e.has("goal")&&!e.has("weight")&&!e.has("currentPage"),kind+" no fabricated measured/completion data");}
        }
        JSONObject publicForm=WidgetApprovedV188.emptyRow("meal",0);WidgetApprovedV188.bindOwner(publicForm,"","2026-09-20");require(WidgetApprovedV188.structuralOwner(publicForm,new JSONObject()),"signed-out account may see generic empty structure only");require(!WidgetApprovedV188.validOwner(publicForm,new JSONObject()),"generic empty structure never satisfies actual record authorization");
        require(WidgetApprovedV188.shortDay("2026-09-20").equals("9.20"),"today preview uses compact month and day");
        require(WidgetApprovedV188.weekday("2026-09-20").equals("일요일"),"today weekday is actual date, not preview text");
        JSONObject partialHealth=WidgetDesignV165.copy(approved);partialHealth.put("inbody",new JSONArray().put(new JSONObject().put("weight",61.5).put("muscle",25.1)));List<String> partialHealthRows=WidgetApprovedV188.buildRows("PersonalWorkoutMeal",false,partialHealth,accountA,new JSONObject());require(new JSONObject(partialHealthRows.get(0)).optDouble("weight")==61.5&&!new JSONObject(partialHealthRows.get(0)).has("fat"),"health widget preserves missing measures while displaying actual latest values");
        for(int i=0;i<5;i++){
            String key=WidgetThemeV190.key(i);
            require(WidgetThemeV190.index(key)==i,"theme selection index round trip "+key);
            require(WidgetThemeV190.normalize(key).equals(key),"canonical theme key remains stable "+key);
            require(WidgetThemeV190.resource(key,"surface").equals("widget_theme_"+key+"_surface_v190"),"background resource follows selected palette "+key);
            require(WidgetThemeV190.color(key,1)!=WidgetThemeV190.color(key,2),"surface and compact inset remain distinct "+key);
            require((WidgetThemeV190.color(key,4)&0xff000000)==0xff000000,"readable opaque foreground "+key);
        }
        require(WidgetThemeV190.normalize("aurora").equals("system"),"old aurora maps to Lavender");
        require(WidgetThemeV190.normalize("lavender").equals("system"),"old lavender maps to Lavender");
        require(WidgetThemeV190.normalize("mint").equals("sage"),"old mint maps to Sage");
        require(WidgetThemeV190.normalize("ocean").equals("slate"),"old ocean maps to Slate");
        require(WidgetThemeV190.normalize("mono").equals("charcoal"),"old mono maps to Charcoal");
        require(WidgetThemeV190.normalize("midnight").equals("charcoal"),"old midnight maps to Charcoal");
        require(WidgetThemeV190.normalize("sunset").equals("rose"),"old sunset maps to Rose");
        require(WidgetThemeV190.label("system").equals("Lavender"),"system key is app Lavender, not Android night mode");
        require(WidgetThemeV190.normalize(null).equals("system"),"missing preference defaults to Lavender");
        require(WidgetApprovedV188.weekWidth(220)==408,"narrow routine week bitmap preserves circular marks");
        require(WidgetApprovedV188.weekWidth(336)==640,"normal routine week bitmap matches its actual content width");
        require(WidgetApprovedV188.weekWidth(672)==1312,"unfolded routine week bitmap does not stretch glyphs horizontally");
        System.out.println("PASS: "+checks+" native model assertions.");
    }
}
