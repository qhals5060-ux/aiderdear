package com.aiderlog.v22app;

import android.app.Activity;
import android.app.DatePickerDialog;
import android.app.TimePickerDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.text.InputFilter;
import android.text.InputType;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import org.json.JSONObject;
import java.util.Calendar;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

/** Native widget day sheet. Its task never contains MainActivity. */
public final class WidgetDayActivityV195 extends Activity implements SharedPreferences.OnSharedPreferenceChangeListener {
    private String uid="",date="",sourceKind="CalendarMonth",chosen="system",draftDate="",draftTime="09:00";private int widget;private boolean editing=false;private LinearLayout root,content,footer;private TextView status,heading;private EditText title;private CheckBox allDay;private Button dateButton,timeButton;
    int dp(float value){return Math.round(value*getResources().getDisplayMetrics().density);}
    int ink(){return WidgetThemeV190.color(chosen,4);}
    TextView label(String value,float size){TextView v=new TextView(this);v.setText(value);v.setTextSize(size);v.setTextColor(ink());v.setPadding(0,dp(5),0,dp(5));return v;}
    Button button(String text,View.OnClickListener action){Button b=new Button(this);b.setText(text);b.setTextSize(14);b.setAllCaps(false);b.setTextColor(WidgetThemeV190.accent(chosen));b.setMinHeight(dp(44));b.setOnClickListener(action);return b;}
    void addAction(Button button){footer.addView(button,new LinearLayout.LayoutParams(0,dp(48),1));}
    void quickAdd(String type){if(current())startActivity(WidgetNoteActivityV196.intent(this,widget,sourceKind,uid,type,date));}
    void listActions(){footer.setOrientation(LinearLayout.VERTICAL);LinearLayout quick=new LinearLayout(this);quick.setOrientation(LinearLayout.HORIZONTAL);quick.addView(button("+ 투두",v->quickAdd("todo")),new LinearLayout.LayoutParams(0,dp(44),1));quick.addView(button("+ 메모",v->quickAdd("memo")),new LinearLayout.LayoutParams(0,dp(44),1));footer.addView(quick,new LinearLayout.LayoutParams(-1,-2));LinearLayout primary=new LinearLayout(this);primary.setOrientation(LinearLayout.HORIZONTAL);primary.addView(button("닫기",v->finish()),new LinearLayout.LayoutParams(0,dp(48),1));primary.addView(button("+ 일정 추가",v->{draftDate=date;draftTime="09:00";edit("",true);}),new LinearLayout.LayoutParams(0,dp(48),1));footer.addView(primary,new LinearLayout.LayoutParams(-1,-2));}
    @Override public void onCreate(Bundle state){super.onCreate(state);requestWindowFeature(Window.FEATURE_NO_TITLE);setFinishOnTouchOutside(false);Intent intent=getIntent();uid=intent.getStringExtra("uid");date=intent.getStringExtra("date");widget=intent.getIntExtra("appWidgetId",0);String requestedKind=intent.getStringExtra("kind");if(requestedKind!=null&&WidgetCompactCalendarV181.supports(requestedKind))sourceKind=WidgetDesignV165.base(requestedKind);if(!WidgetCalendarV195.validDate(date))date=WidgetNativeV164.day(Calendar.getInstance());chosen=WidgetNativeV164.theme(this,widget);build();if(!current())return;if(state!=null&&uid.equals(state.getString("uid"))&&state.getBoolean("editing")){editing=true;draftDate=state.getString("draftDate",date);draftTime=state.getString("draftTime","09:00");edit(state.getString("title",""),state.getBoolean("allDay",true));}else list();}
    void build(){root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(dp(18),dp(12),dp(18),dp(12));GradientDrawable bg=new GradientDrawable();bg.setColor(WidgetThemeV190.color(chosen,1));bg.setCornerRadius(dp(20));root.setBackground(bg);
        heading=label("",20);heading.setTypeface(null,Typeface.BOLD);root.addView(heading);status=label("",12);status.setTextColor(WidgetThemeV190.muted(chosen));root.addView(status);ScrollView scroll=new ScrollView(this);scroll.setFillViewport(false);content=new LinearLayout(this);content.setOrientation(LinearLayout.VERTICAL);scroll.addView(content);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));footer=new LinearLayout(this);footer.setOrientation(LinearLayout.HORIZONTAL);root.addView(footer);setContentView(root);getWindow().setBackgroundDrawableResource(android.R.color.transparent);getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);resize();}
    void resize(){getWindow().setLayout(Math.min(getResources().getDisplayMetrics().widthPixels-dp(24),dp(540)),Math.min(getResources().getDisplayMetrics().heightPixels-dp(64),dp(620)));}
    boolean current(){if(WidgetCalendarV195.owns(this,uid))return true;editing=false;if(content!=null){content.removeAllViews();footer.removeAllViews();footer.setOrientation(LinearLayout.HORIZONTAL);heading.setText("위젯 계정 확인");status.setText("계정이 변경되었거나 동기화가 필요합니다. 앱에서 로그인한 뒤 위젯을 다시 열어주세요.");addAction(button("닫기",v->finish()));}return false;}
    @Override public void onResume(){super.onResume();WidgetNativeV164.prefs(this).registerOnSharedPreferenceChangeListener(this);if(current()&&!editing)list();}
    @Override public void onPause(){WidgetNativeV164.prefs(this).unregisterOnSharedPreferenceChangeListener(this);super.onPause();}
    @Override public void onSharedPreferenceChanged(SharedPreferences prefs,String key){if("widget_snapshot".equals(key)||(WidgetCalendarV195.PREFIX+uid).equals(key))runOnUiThread(()->{if(current()&&!editing)list();});}
    @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);state.putString("uid",uid);state.putBoolean("editing",editing);if(editing){state.putString("title",title.getText().toString());state.putBoolean("allDay",allDay.isChecked());state.putString("draftDate",draftDate);state.putString("draftTime",draftTime);}}
    void list(){if(!current())return;editing=false;content.removeAllViews();footer.removeAllViews();JSONObject data=WidgetNativeV164.snapshot(this);JSONObject holidays=data.optJSONObject("holidays");String holiday=holidays==null?"":holidays.optString(date);heading.setText(date+" 일정");List<String> rows=WidgetCompactCalendarV181.scheduleRows(data.optJSONArray("scheduleItems"),date);status.setText(rows.size()+"개 일정"+(holiday.isEmpty()?"":" · "+holiday));
        if(!holiday.isEmpty()){TextView h=label(holiday,16);h.setTextColor(0xffaa6077);h.setTypeface(null,Typeface.BOLD);content.addView(h);}if(rows.isEmpty())content.addView(label("아직 일정이 없어요. 이 날짜에 일정을 추가할 수 있어요.",15));boolean pending=false;
        for(String json:rows)try{JSONObject row=new JSONObject(json);LinearLayout item=new LinearLayout(this);item.setOrientation(LinearLayout.VERTICAL);item.setPadding(dp(12),dp(9),dp(12),dp(9));GradientDrawable bg=new GradientDrawable();bg.setColor(WidgetCompactCalendarV181.dayCardColor(row));bg.setStroke(dp(1),WidgetCompactCalendarV181.eventColor(row));bg.setCornerRadius(dp(12));item.setBackground(bg);LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);lp.bottomMargin=dp(8);content.addView(item,lp);String time=WidgetCompactCalendarV181.eventTimeLabel(row);if(!row.optString("date").equals(row.optString("endDate",row.optString("date"))))time+=" · "+row.optString("date")+" ~ "+row.optString("endDate");TextView meta=label(time,12);meta.setTextColor(WidgetThemeV190.muted(chosen));item.addView(meta);TextView eventTitle=label(row.optString("title"),16);eventTitle.setTypeface(null,Typeface.BOLD);item.addView(eventTitle);if(row.optBoolean("_widgetPendingV195")){pending=true;item.addView(label("기기 저장됨 · 앱을 열면 동기화",12));}else if(row.optBoolean("readOnly"))item.addView(label("공유받은 일정",12));}catch(Exception ignored){}
        if(pending)content.addView(label("추가한 일정은 이 기기에 보관됩니다. 앱을 열면 현재 계정으로 동기화합니다.",12));listActions();}
    void edit(String value,boolean wholeDay){if(!current())return;editing=true;content.removeAllViews();footer.removeAllViews();footer.setOrientation(LinearLayout.HORIZONTAL);heading.setText("일정 추가");status.setText("개인 일정 · 기기에 저장 후 앱에서 동기화");content.addView(label("일정 이름",13));title=new EditText(this);title.setSingleLine(false);title.setMinLines(2);title.setTextSize(16);title.setTextColor(ink());title.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);title.setFilters(new InputFilter[]{new InputFilter.LengthFilter(180)});title.setHint("어떤 일정인가요?");title.setText(value);content.addView(title,new LinearLayout.LayoutParams(-1,-2));
        dateButton=button("날짜  "+draftDate,v->pickDate());content.addView(dateButton);allDay=new CheckBox(this);allDay.setText("종일");allDay.setTextSize(15);allDay.setTextColor(ink());allDay.setChecked(wholeDay);content.addView(allDay);timeButton=button("시작 시간  "+draftTime,v->pickTime());timeButton.setVisibility(wholeDay?View.GONE:View.VISIBLE);content.addView(timeButton);allDay.setOnCheckedChangeListener((b,checked)->timeButton.setVisibility(checked?View.GONE:View.VISIBLE));addAction(button("취소",v->{hideKeyboard();list();}));addAction(button("기기에 저장",v->save()));}
    void pickDate(){Calendar cal=WidgetNativeV164.date(draftDate);DatePickerDialog picker=new DatePickerDialog(this,(view,y,m,d)->{draftDate=String.format(Locale.US,"%04d-%02d-%02d",y,m+1,d);dateButton.setText("날짜  "+draftDate);},cal.get(Calendar.YEAR),cal.get(Calendar.MONTH),cal.get(Calendar.DAY_OF_MONTH));picker.getDatePicker().setMinDate(WidgetNativeV164.date("2000-01-01").getTimeInMillis());picker.getDatePicker().setMaxDate(WidgetNativeV164.date("2199-12-31").getTimeInMillis());picker.show();}
    void pickTime(){int hour=9,minute=0;try{hour=Integer.parseInt(draftTime.substring(0,2));minute=Integer.parseInt(draftTime.substring(3));}catch(Exception ignored){}new TimePickerDialog(this,(view,h,m)->{draftTime=String.format(Locale.US,"%02d:%02d",h,m);timeButton.setText("시작 시간  "+draftTime);},hour,minute,true).show();}
    void save(){if(!editing||!current())return;String text=title.getText().toString().trim();if(text.isEmpty()){title.setError("일정 이름을 입력해주세요.");title.requestFocus();return;}JSONObject command=new JSONObject();WidgetDesignV165.put(command,"schema",195);WidgetDesignV165.put(command,"op","add-schedule");WidgetDesignV165.put(command,"uid",uid);WidgetDesignV165.put(command,"id","widget-calendar-"+UUID.randomUUID());WidgetDesignV165.put(command,"title",text);WidgetDesignV165.put(command,"date",draftDate);WidgetDesignV165.put(command,"endDate",draftDate);WidgetDesignV165.put(command,"time",allDay.isChecked()?"":draftTime);WidgetDesignV165.put(command,"allDay",allDay.isChecked());WidgetDesignV165.put(command,"createdAt",System.currentTimeMillis());try{WidgetCalendarV195.enqueue(this,uid,command);date=draftDate;hideKeyboard();list();}catch(Exception error){status.setText(error.getMessage()==null?"저장하지 못했습니다. 입력을 유지했습니다.":error.getMessage());}}
    void hideKeyboard(){View focus=getCurrentFocus();if(focus!=null)((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(focus.getWindowToken(),0);}
    @Override public void onBackPressed(){if(editing){hideKeyboard();list();}else super.onBackPressed();}
}
