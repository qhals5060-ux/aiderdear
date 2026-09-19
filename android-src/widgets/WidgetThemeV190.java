package com.aiderlog.v22app;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import android.widget.RemoteViews;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import java.lang.reflect.Field;
import org.json.JSONObject;
import static com.aiderlog.v22app.WidgetNativeV164.*;

/** The same five palette families as the app. Legacy preference keys remain readable. */
public final class WidgetThemeV190 {
    static final String[] KEYS={"system","sage","rose","slate","charcoal"};
    static final String[] LABELS={"Lavender","Sage","Rose","Slate","Charcoal"};
    // accent, surface, control, border, ink, muted; app-design-v188.css is the contract.
    static final int[][] COLORS={
        {0xff76548f,0xfffaf7fc,0xffede5f4,0xffe1d5eb,0xff352c40,0xff72647e},
        {0xff486f5c,0xfff5faf6,0xffe2eee5,0xffccdfd2,0xff2d4236,0xff607568},
        {0xff93556f,0xfffff7fa,0xfff3e0e8,0xffe9cbd8,0xff4c2d3c,0xff856173},
        {0xff426d94,0xfff6faff,0xffe2edf7,0xffcaddec,0xff2c4055,0xff60758b},
        {0xff57616a,0xfffafafa,0xffe9ecee,0xffd2d8dc,0xff303840,0xff65707a}
    };
    static String normalize(String value){
        if("sage".equals(value)||"mint".equals(value))return "sage";
        if("rose".equals(value)||"sunset".equals(value))return "rose";
        if("slate".equals(value)||"ocean".equals(value))return "slate";
        if("charcoal".equals(value)||"mono".equals(value)||"midnight".equals(value))return "charcoal";
        return "system";
    }
    static int index(String value){String key=normalize(value);for(int i=0;i<KEYS.length;i++)if(KEYS[i].equals(key))return i;return 0;}
    static String key(int index){return KEYS[Math.max(0,Math.min(KEYS.length-1,index))];}
    static String label(String value){return LABELS[index(value)];}
    static int color(String value,int component){return COLORS[index(value)][component];}
    static int accent(String value){return color(value,0);}
    static int muted(String value){return color(value,5);}
    static int soft(int accent){for(int[] palette:COLORS)if(palette[0]==accent)return palette[2];return (accent&0x00ffffff)|0x22000000;}
    static String resource(String value,String part){return "widget_theme_"+normalize(value)+"_"+part+"_v190";}
    static RemoteViews rowView(Context c,String name,String chosen){
        String themed=name+"_"+normalize(chosen)+"_v190";
        return view(c,layout(c,themed)!=0?themed:name);
    }
    static void background(Context c,RemoteViews v,String id,String chosen,String part){v.setInt(WidgetNativeV164.id(c,id),"setBackgroundResource",drawable(c,resource(chosen,part)));}
    static void rowStyle(Context c,RemoteViews v,String type,JSONObject row,String chosen){
        if(type.equals("quote")||type.equals("workout")||type.equals("note"))background(c,v,"w188_row",chosen,"control");
        if(type.equals("book")||type.equals("meal"))background(c,v,"w188_photo",chosen,"control");
        if(type.equals("todo")||type.equals("routineMini"))background(c,v,"w188_check",chosen,"outline");
        if(type.equals("routine"))for(int i=0;i<4;i++)background(c,v,"w188_level_"+i,chosen,new String[]{"MINI","MORE","MAX","SKIP"}[i].equals(row.optString("level"))?"selected":"outline");
    }
    static Field selected(Activity activity)throws Exception{Field field=activity.getClass().getDeclaredField("selectedTheme");field.setAccessible(true);return field;}
    public static void choose(Activity activity,int choice){try{selected(activity).set(activity,key(choice));WidgetNativeV164.preview(activity);}catch(Exception ignored){}}
    public static void showDialog(final Activity activity){try{
        int checked=index((String)selected(activity).get(activity));
        CharSequence[] labels=new CharSequence[LABELS.length];for(int i=0;i<labels.length;i++){SpannableString text=new SpannableString("●  "+LABELS[i]);text.setSpan(new ForegroundColorSpan(accent(KEYS[i])),0,1,0);labels[i]=text;}
        new AlertDialog.Builder(activity).setTitle("색상 테마").setSingleChoiceItems(labels,checked,new DialogInterface.OnClickListener(){public void onClick(DialogInterface dialog,int which){choose(activity,which);}}).setPositiveButton("완료",null).show();
    }catch(Exception ignored){}}
    /** Updates only the draft controls. Existing Save is the sole preference write. */
    public static void refresh(Activity activity){try{
        Field field=selected(activity);String chosen=normalize((String)field.get(activity));field.set(activity,chosen);
        TextView theme=(TextView)activity.findViewById(id(activity,"widget_config_theme"));
        if(theme!=null){theme.setText("색상 테마   "+label(chosen)+"   ›");theme.setTextColor(accent(chosen));}
        View save=activity.findViewById(id(activity,"widget_config_save"));if(save!=null)save.setBackgroundResource(drawable(activity,resource(chosen,"button")));
        ViewGroup content=(ViewGroup)activity.findViewById(android.R.id.content);if(content!=null&&content.getChildCount()>0)content.getChildAt(0).setBackgroundColor(color(chosen,1));
    }catch(Exception ignored){}}
}
