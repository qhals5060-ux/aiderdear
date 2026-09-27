const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const source=process.env.AIDERLOG_TEST_WIDGET_SOURCE||__dirname,native=process.env.AIDERLOG_TEST_NATIVE_ROOT||path.join(__dirname,'..'),res=fs.existsSync(path.join(native,'widgets/res'))?path.join(native,'widgets/res'):path.join(native,'res');
let count=0;const check=(value,label)=>{assert(value,label);count++};
// ListView wrap_content receives AT_MOST from its bounded FrameLayout.
// Android measures rows up to that limit: short lists expose the clickable body,
// long lists scroll. No overlay is needed to intercept collection child taps.
// https://android.googlesource.com/platform/frameworks/base/+/refs/heads/master/core/java/android/widget/ListView.java
for(const [name,weight] of [['widget_calendar_notes_v194',67],['widget_fortnight_notes_v194',45]]){
 const xml=fs.readFileSync(path.join(res,'layout',name+'.xml'),'utf8');
 check(new RegExp('id="@\\+id/widget_calendar_v164"[^>]*layout_height="0dp"[^>]*layout_weight="'+weight+'"').test(xml),name+' preserves calendar allocation');
 for(const type of ['todo','memo']){
  const list=type==='todo'?'w165_secondary_list':'w194_notes_list';
  check(xml.includes('android:id="@+id/w197_'+type+'_pane"')&&xml.includes('android:id="@+id/w197_'+type+'_body"'),name+' area and unused body have direct tap IDs');
  const header=xml.match(new RegExp('<LinearLayout[^>]*w196_'+type+'_heading[^>]*>[\\s\\S]*?<\\/LinearLayout>'));
  check(header&&header[0].includes('android:orientation="horizontal"'),name+' unchanged heading layout');
  check(!xml.includes('w196_'+type+'_add')&&!header[0].includes('android:text="+"'),name+' no separate add button');
  check(new RegExp('<ListView[^>]*id="@\\+id/'+list+'"[^>]*layout_height="wrap_content"').test(xml),name+' short list exposes background and long list remains bounded');
 }
 check(!/<Space\b/.test(xml),name+' RemoteViews supported layout');
}
const note=fs.readFileSync(path.join(source,'WidgetNoteActivityV196.java'),'utf8'),day=fs.readFileSync(path.join(source,'WidgetDayActivityV195.java'),'utf8'),calendar=fs.readFileSync(path.join(source,'WidgetCompactCalendarV181.java'),'utf8');
check(!note.includes('MainActivity'),'new form never routes through main screen');check(note.includes('FLAG_IMMUTABLE')&&note.includes('.WidgetNoteActivityV196'),'heading actions are direct immutable native Activity intents');check(note.includes('WidgetPrivateV196.enqueue(this,uid,row)'),'existing owner-bound queue is sole save boundary');check(note.includes('new InputFilter.LengthFilter(180)')&&note.includes('기한 설정 (선택)'),'bounded text and optional TODO date are visible');check(note.includes('if(saving||closed||!current())return')&&note.includes('WidgetPrivateV196.owns(this,uid)'),'save guards current account and repeated taps');check(note.includes('registerOnSharedPreferenceChangeListener')&&note.includes('value.setText("");fields.removeAllViews()'),'account changes mask entered private text');check(note.includes('state.putString("draftId",draftId)')&&note.includes('state.getString("draftId",draftId)'),'rotation preserves retry identity');check(note.includes('finally{saving=false;if(!closed)save.setEnabled(true);}')&&note.includes('입력을 유지했습니다'),'failure keeps input and unlocks retry');check(note.includes('button("취소",v->{if(!saving)finish();})'),'cancel never enqueues');
check(day.includes('WidgetNoteActivityV196.intent(this,widget,sourceKind,uid,type,date)')&&day.includes('quickAdd("todo")')&&day.includes('quickAdd("memo")'),'all four day sheets expose both native quick adds');check(day.includes('WidgetCalendarV195.enqueue(this,uid,command)')&&day.includes('for(String json:rows)'),'schedule create and full day list preserved');
for(const type of ['todo','memo'])check(calendar.includes('"w197_'+type+'_pane"')&&calendar.includes('"w197_'+type+'_body"')&&calendar.includes('"w196_'+type+'_heading"')&&calendar.includes('WidgetNoteActivityV196.open(c,widget,kind,owner(data),"'+type+'",from)'),type+' header, body and pane use native add');
check(!calendar.includes('record,"open","todo"'),'TODO title/due no longer launch main editor');check(calendar.includes('pendingPrivateLabel(record)'),'new local records show pending status');
check(!calendar.includes('record,"open","note"'),'memo rows no longer open the main app note editor');
check(calendar.includes('new String[]{"w194_note_row","w194_note_title","w194_note_body"}')&&calendar.includes('WidgetNoteActivityV196.addFill(owner(data),"memo",selectedDay(c,widget,kind))'),'memo row and both consuming text children explicitly fill in native add');
check(calendar.includes('new String[]{"w184_row","w184_todo_title","w184_todo_due","w187_row_divider"}')&&calendar.includes('WidgetNoteActivityV196.addFill(owner(data),"todo",selectedDay(c,widget,kind))'),'TODO row, title, date and divider explicitly fill in add');
check(calendar.includes('new String[]{"w184_row","w184_todo_title"})empty.setOnClickFillInIntent')&&calendar.includes('눌러서 투두 추가')&&!calendar.includes('+ 버튼으로'),'empty collection placeholder is actionable and describes area tap');
check(calendar.includes('record.optBoolean("_emptyV189")&&kind.contains("@notes")')&&calendar.indexOf('record.optBoolean("_emptyV189")&&kind.contains("@notes")')<calendar.indexOf('WidgetApprovedV188.renderRow')&&calendar.includes('눌러서 메모 추가'),'even a defensive empty memo collection sentinel explicitly opens native add');
check(calendar.includes('new String[]{"w184_check_hit","w184_check"}){item.setOnClickFillInIntent(id(c,key),WidgetDesignV165.action(data,widget,kind,record,"todo","true"))'),'checkbox glyph and hit area both explicitly complete instead of inheriting row add');
check(calendar.indexOf('record.has("_widgetOwnerV181")')<calendar.indexOf('record.optBoolean("_emptyV189")&&kind.contains("@todos")'),'old-owner empty collection rows are masked before binding add');
check(note.includes('static Intent addFill(String uid,String type,String date){return new Intent().putExtra("uid",uid).putExtra("noteType",type).putExtra("date",date);}')&&!/static Intent addFill[^\n]*putExtra\("action"/.test(note),'add fill-in carries owner/type/date and no mutation action');
check(note.includes('if(WidgetActionReceiverV196.consume(this,getIntent())){closed=true;finish();return;}')&&note.indexOf('WidgetActionReceiverV196.consume(this,getIntent())')<note.indexOf('build(restoring?'),'completion Activity path exits before any form is displayed');
check(note.includes('if(bound!=null&&!bound.equals(uid)){closed=true;finish();return;}'),'collection add rejects mismatched template and child owner');
check(note.includes('WidgetPrivateV196.failedAdds(this,uid)')&&note.includes('동기화 확인할 초안 '),'failed drafts have a discoverable native recovery list');
check(note.includes('WidgetPrivateV196.retryFailed(this,uid,recoveringKey,row)')&&!note.includes('WidgetPrivateV196.discardFailed(this,uid,recoveringKey)'),'retry uses atomic replacement, never discard-then-save');
check(note.includes('recoveringKey=draft.optString("key");draftId="widget-private-"+UUID.randomUUID()')&&note.includes('state.putString("recoveringKey",recoveringKey)'),'retry gets a fresh identity and survives rotation');
check(note.includes('현재 입력 대신 저장된 초안을 열까요?')&&note.includes('.setNegativeButton("돌아가기",null)'),'opening an old draft protects unsaved form input');
check(note.includes('.setTitle("초안 삭제")')&&note.includes('동기화되지 않은 이 기기의 초안을 삭제할까요?')&&note.includes('WidgetPrivateV196.discardFailed(this,uid,draft.optString("key"))'),'discard is an explicit confirmed action');
check(note.includes('closed=true;dismissDialogs();if(fields!=null)')&&note.includes('if(recoveryDialog!=null)recoveryDialog.dismiss()')&&note.includes('if(confirmation!=null)confirmation.dismiss()')&&note.includes('if(picker!=null)picker.dismiss()'),'owner change removes every visible private draft dialog');
check(note.includes('(WidgetPrivateV196.FAILURES_PREFIX+uid).equals(key)')&&note.includes('if(current())updateRecovery()'),'snapshot and archive updates revalidate the owner before exposing failed text');
check(calendar.includes('"동기화 확인 필요 · 기기 저장됨"')&&calendar.includes('pendingPrivatePrefix(record)'),'failure warning starts before truncation in narrow memo rows');
check((calendar.match(/record,"todo","true"/g)||[]).length===1&&!calendar.includes('toggleTodo'),'only checkbox uses idempotent completion; row bodies add');
const manifest=fs.readFileSync(path.join(native,'AndroidManifest.xml'),'utf8');check(/<activity[^>]+android:exported="false"[^>]+\.WidgetNoteActivityV196[^>]+android:excludeFromRecents="true"[^>]+android:taskAffinity=""/.test(manifest),'quick add is private and separate from main task');
console.log('PASS '+count+' native area-add form/resource contracts');
