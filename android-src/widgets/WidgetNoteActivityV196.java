package com.aiderlog.v22app;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Typeface;
import android.graphics.drawable.GradientDrawable;
import android.net.Uri;
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
import android.widget.Toast;
import org.json.JSONObject;
import org.json.JSONArray;
import java.util.Calendar;
import java.util.Locale;
import java.util.UUID;

/** Small native TODO/MEMO form. A confirmed local enqueue is its only write. */
public final class WidgetNoteActivityV196 extends Activity implements SharedPreferences.OnSharedPreferenceChangeListener {
    private String uid="",kind="CalendarMonth",type="todo",draftDate="",draftId="",recoveringKey="",chosen="system";private long createdAt;private int widget;private boolean saving=false,closed=false;private LinearLayout root,fields,actions;private TextView status;private EditText value;private CheckBox dated;private Button dateButton,save,recovery;private DatePickerDialog picker;private AlertDialog recoveryDialog,confirmation;
    static boolean supported(String type){return "todo".equals(type)||"memo".equals(type);}
    static Intent intent(Context c,int widget,String kind,String uid,String type,String date){Intent i=new Intent().setClassName(c,c.getPackageName()+".WidgetNoteActivityV196").setAction("aiderlog.widget.note."+widget+"."+type);i.setData(Uri.parse("aiderlog-widget-note://"+widget+"/"+Uri.encode(uid==null?"":uid)+"/"+Uri.encode(type)+"/"+Uri.encode(date==null?"":date)));return i.putExtra("appWidgetId",widget).putExtra("kind",kind).putExtra("uid",uid).putExtra("noteType",type).putExtra("date",date).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP);}
    static PendingIntent open(Context c,int widget,String kind,String uid,String type,String date){Intent i=intent(c,widget,kind,uid,type,date);return PendingIntent.getActivity(c,i.getData().toString().hashCode(),i,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);}
    // Collection bodies open the same form; only the checkbox has an action extra.
    static Intent addFill(String uid,String type,String date){return new Intent().putExtra("uid",uid).putExtra("noteType",type).putExtra("date",date);}
    static JSONObject command(String uid,String type,String text,String date,String id,long createdAt,String kind,int widget){if(uid==null||uid.isEmpty()||!supported(type)||text==null||text.trim().isEmpty()||text.trim().length()>180)throw new IllegalArgumentException("내용을 1~180자로 입력해주세요.");String due="todo".equals(type)&&date!=null?date:"";if(!due.isEmpty()&&(!WidgetCalendarV195.validDate(due)||due.compareTo("2000-01-01")<0||due.compareTo("2199-12-31")>0))throw new IllegalArgumentException("기한을 확인해주세요.");JSONObject row=new JSONObject();WidgetDesignV165.put(row,"schema",196);WidgetDesignV165.put(row,"uid",uid);WidgetDesignV165.put(row,"op","memo".equals(type)?"add-memo":"add-todo");WidgetDesignV165.put(row,"id",id);WidgetDesignV165.put(row,"key",id);WidgetDesignV165.put(row,"value",text.trim());WidgetDesignV165.put(row,"date",due);WidgetDesignV165.put(row,"kind",kind);WidgetDesignV165.put(row,"widgetId",widget);WidgetDesignV165.put(row,"createdAt",createdAt);return row;}
    int dp(float value){return Math.round(value*getResources().getDisplayMetrics().density);}
    TextView label(String text,float size){TextView v=new TextView(this);v.setText(text);v.setTextSize(size);v.setTextColor(WidgetThemeV190.color(chosen,4));v.setPadding(0,dp(4),0,dp(4));return v;}
    Button button(String text,View.OnClickListener listener){Button b=new Button(this);b.setText(text);b.setTextSize(14);b.setAllCaps(false);b.setTextColor(WidgetThemeV190.accent(chosen));b.setMinHeight(dp(44));b.setOnClickListener(listener);return b;}
    @Override public void onCreate(Bundle state){super.onCreate(state);requestWindowFeature(Window.FEATURE_NO_TITLE);if(WidgetActionReceiverV196.consume(this,getIntent())){closed=true;finish();return;}setFinishOnTouchOutside(false);Intent i=getIntent();uid=i.getStringExtra("uid");String bound=i.getStringExtra("boundUid");if(bound!=null&&!bound.equals(uid)){closed=true;finish();return;}type=i.getStringExtra("noteType");widget=i.getIntExtra("appWidgetId",0);kind=i.getStringExtra("kind");if(kind==null||!WidgetCompactCalendarV181.supports(kind))kind="CalendarMonth";if(!supported(type)){finish();return;}chosen=WidgetNativeV164.theme(this,widget);draftDate=i.getStringExtra("date");if(!WidgetCalendarV195.validDate(draftDate))draftDate=WidgetNativeV164.day(Calendar.getInstance());draftId="widget-private-"+UUID.randomUUID();createdAt=System.currentTimeMillis();boolean restoring=state!=null&&uid!=null&&uid.equals(state.getString("uid"));if(restoring){draftDate=state.getString("draftDate",draftDate);draftId=state.getString("draftId",draftId);recoveringKey=state.getString("recoveringKey","");if(supported(state.getString("noteType")))type=state.getString("noteType");createdAt=state.getLong("createdAt",createdAt);}build(restoring?state.getString("value",""):"",restoring&&state.getBoolean("dated"));current();}
    void build(String text,boolean hasDate){dated=null;dateButton=null;root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);root.setPadding(dp(18),dp(14),dp(18),dp(12));GradientDrawable bg=new GradientDrawable();bg.setColor(WidgetThemeV190.color(chosen,1));bg.setCornerRadius(dp(20));root.setBackground(bg);TextView heading=label("memo".equals(type)?"메모 추가":"투두 추가",20);heading.setTypeface(null,Typeface.BOLD);root.addView(heading);status=label(recoveringKey.isEmpty()?"기기에 저장 · 앱을 열면 현재 계정으로 동기화":"다시 저장하면 새 작업으로 동기화를 시도합니다. 기존 초안은 저장 성공 전까지 유지됩니다.",12);status.setTextColor(WidgetThemeV190.muted(chosen));root.addView(status);recovery=button("",v->showRecovery());root.addView(recovery,new LinearLayout.LayoutParams(-1,dp(44)));ScrollView scroll=new ScrollView(this);fields=new LinearLayout(this);fields.setOrientation(LinearLayout.VERTICAL);scroll.addView(fields);root.addView(scroll,new LinearLayout.LayoutParams(-1,0,1));value=new EditText(this);value.setMinLines(3);value.setTextSize(16);value.setTextColor(WidgetThemeV190.color(chosen,4));value.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_FLAG_MULTI_LINE|InputType.TYPE_TEXT_FLAG_CAP_SENTENCES);value.setFilters(new InputFilter[]{new InputFilter.LengthFilter(180)});value.setHint("memo".equals(type)?"기억할 내용을 적어주세요 (180자 이내)":"할 일을 적어주세요 (180자 이내)");value.setContentDescription("memo".equals(type)?"메모 내용":"투두 내용");value.setText(text);fields.addView(value,new LinearLayout.LayoutParams(-1,-2));
        if("todo".equals(type)){dated=new CheckBox(this);dated.setText("기한 설정 (선택)");dated.setTextColor(WidgetThemeV190.color(chosen,4));dated.setChecked(hasDate);fields.addView(dated);dateButton=button("기한  "+draftDate,v->pickDate());dateButton.setVisibility(hasDate?View.VISIBLE:View.GONE);fields.addView(dateButton);dated.setOnCheckedChangeListener((b,on)->dateButton.setVisibility(on?View.VISIBLE:View.GONE));}
        actions=new LinearLayout(this);actions.setOrientation(LinearLayout.HORIZONTAL);actions.addView(button("취소",v->{if(!saving)finish();}),new LinearLayout.LayoutParams(0,dp(48),1));save=button("기기에 저장",v->save());actions.addView(save,new LinearLayout.LayoutParams(0,dp(48),1));root.addView(actions);setContentView(root);getWindow().setBackgroundDrawableResource(android.R.color.transparent);getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);getWindow().setLayout(Math.min(getResources().getDisplayMetrics().widthPixels-dp(24),dp(500)),Math.min(getResources().getDisplayMetrics().heightPixels-dp(64),dp("todo".equals(type)?400:340)));updateRecovery();}
    boolean current(){if(!closed&&WidgetPrivateV196.owns(this,uid))return true;closed=true;dismissDialogs();if(fields!=null){value.setText("");fields.removeAllViews();actions.removeAllViews();recovery.setVisibility(View.GONE);status.setText("계정이 변경되었거나 동기화가 필요합니다. 위젯을 다시 열어주세요.");actions.addView(button("닫기",v->finish()),new LinearLayout.LayoutParams(-1,dp(48)));}return false;}
    @Override public void onResume(){super.onResume();WidgetNativeV164.prefs(this).registerOnSharedPreferenceChangeListener(this);if(current())updateRecovery();}
    @Override public void onPause(){WidgetNativeV164.prefs(this).unregisterOnSharedPreferenceChangeListener(this);super.onPause();}
    @Override public void onSharedPreferenceChanged(SharedPreferences prefs,String key){if("widget_snapshot".equals(key)||(WidgetPrivateV196.FAILURES_PREFIX+uid).equals(key))runOnUiThread(()->{if(current())updateRecovery();});}
    @Override protected void onSaveInstanceState(Bundle state){super.onSaveInstanceState(state);state.putString("uid",uid);if(!closed&&value!=null){state.putString("value",value.getText().toString());state.putBoolean("dated",dated!=null&&dated.isChecked());state.putString("draftDate",draftDate);state.putString("draftId",draftId);state.putString("recoveringKey",recoveringKey);state.putString("noteType",type);state.putLong("createdAt",createdAt);}}
    void pickDate(){if(!current())return;Calendar cal=WidgetNativeV164.date(draftDate);picker=new DatePickerDialog(this,(v,y,m,d)->{if(!current())return;draftDate=String.format(Locale.US,"%04d-%02d-%02d",y,m+1,d);dateButton.setText("기한  "+draftDate);},cal.get(Calendar.YEAR),cal.get(Calendar.MONTH),cal.get(Calendar.DAY_OF_MONTH));picker.getDatePicker().setMinDate(WidgetNativeV164.date("2000-01-01").getTimeInMillis());picker.getDatePicker().setMaxDate(WidgetNativeV164.date("2199-12-31").getTimeInMillis());picker.show();}
    void save(){if(saving||closed||!current())return;JSONObject row;try{row=command(uid,type,value.getText().toString(),dated!=null&&dated.isChecked()?draftDate:"",draftId,createdAt,kind,widget);}catch(IllegalArgumentException error){status.setText(error.getMessage());value.requestFocus();return;}saving=true;save.setEnabled(false);try{if(recoveringKey.isEmpty())WidgetPrivateV196.enqueue(this,uid,row);else WidgetPrivateV196.retryFailed(this,uid,recoveringKey,row);closed=true;View focus=getCurrentFocus();if(focus!=null)((InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(focus.getWindowToken(),0);Toast.makeText(this,"기기에 저장했습니다. 앱을 열면 동기화합니다.",Toast.LENGTH_LONG).show();finish();}catch(Exception error){if(current())status.setText(error.getMessage()==null?"저장하지 못했습니다. 입력을 유지했습니다.":error.getMessage());}finally{saving=false;if(!closed)save.setEnabled(true);}}

    void dismissDialogs(){if(picker!=null)picker.dismiss();if(recoveryDialog!=null)recoveryDialog.dismiss();if(confirmation!=null)confirmation.dismiss();}
    @Override public void onDestroy(){dismissDialogs();super.onDestroy();}
    void updateRecovery(){if(recovery==null||closed)return;int count=WidgetPrivateV196.failedAdds(this,uid).length();recovery.setText("동기화 확인할 초안 "+count+"개");recovery.setVisibility(count>0?View.VISIBLE:View.GONE);}
    void showRecovery(){
        if(!current()||saving)return;JSONArray drafts=WidgetPrivateV196.failedAdds(this,uid);if(drafts.length()==0){updateRecovery();return;}
        LinearLayout entries=new LinearLayout(this);entries.setOrientation(LinearLayout.VERTICAL);entries.setPadding(dp(16),dp(8),dp(16),dp(8));
        for(int n=0;n<drafts.length();n++){final JSONObject draft=drafts.optJSONObject(n);if(draft==null)continue;String category="add-memo".equals(draft.optString("op"))?"메모":"투두";TextView text=label(category+(draft.optString("date").isEmpty()?"":" · "+draft.optString("date"))+"\n"+draft.optString("value"),15);entries.addView(text);LinearLayout controls=new LinearLayout(this);controls.addView(button("다시 작성",v->chooseDraft(draft)),new LinearLayout.LayoutParams(0,dp(44),1));controls.addView(button("삭제",v->deleteDraft(draft)),new LinearLayout.LayoutParams(0,dp(44),1));entries.addView(controls);}
        ScrollView scroll=new ScrollView(this);scroll.addView(entries);recoveryDialog=new AlertDialog.Builder(this).setTitle("동기화 확인이 필요한 초안").setView(scroll).setNegativeButton("닫기",null).create();recoveryDialog.show();recoveryDialog.getWindow().setLayout(Math.min(getResources().getDisplayMetrics().widthPixels-dp(32),dp(480)),Math.min(getResources().getDisplayMetrics().heightPixels-dp(80),dp(460)));
    }
    void chooseDraft(JSONObject draft){if(!current())return;if(!value.getText().toString().trim().isEmpty()){confirmation=new AlertDialog.Builder(this).setTitle("입력 중인 내용이 있어요").setMessage("현재 입력 대신 저장된 초안을 열까요?").setNegativeButton("돌아가기",null).setPositiveButton("초안 열기",(dialog,which)->loadDraft(draft)).show();}else loadDraft(draft);}
    void loadDraft(JSONObject draft){if(!current())return;dismissDialogs();type="add-memo".equals(draft.optString("op"))?"memo":"todo";recoveringKey=draft.optString("key");draftId="widget-private-"+UUID.randomUUID();createdAt=System.currentTimeMillis();draftDate=draft.optString("date");boolean hasDate=WidgetCalendarV195.validDate(draftDate);if(!hasDate)draftDate=WidgetNativeV164.day(Calendar.getInstance());build(draft.optString("value"),hasDate);}
    void deleteDraft(JSONObject draft){
        if(!current())return;confirmation=new AlertDialog.Builder(this).setTitle("초안 삭제").setMessage(draft.optString("value")+"\n\n동기화되지 않은 이 기기의 초안을 삭제할까요?").setNegativeButton("취소",null).setPositiveButton("삭제",(dialog,which)->{if(!current())return;if(WidgetPrivateV196.discardFailed(this,uid,draft.optString("key"))){if(recoveringKey.equals(draft.optString("key")))recoveringKey="";if(recoveryDialog!=null)recoveryDialog.dismiss();updateRecovery();Toast.makeText(this,"초안을 삭제했습니다.",Toast.LENGTH_SHORT).show();}else Toast.makeText(this,"삭제하지 못했습니다. 초안을 유지했습니다.",Toast.LENGTH_LONG).show();}).show();
    }
    @Override public void onBackPressed(){if(!saving)super.onBackPressed();}
}
