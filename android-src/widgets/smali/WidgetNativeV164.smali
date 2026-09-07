.class public final Lcom/aiderlog/v22app/WidgetNativeV164;
.super Ljava/lang/Object;
.source "WidgetNativeV164.java"


# static fields
.field static final ACTION:Ljava/lang/String; = "com.aiderlog.v22app.WIDGET_NAV_V164"

.field static final DATE:Ljava/text/SimpleDateFormat;

.field static final INK:I = -0xe8e5c6

.field static final MUTED:I = -0xe8e5c6

.field static final PREF:Ljava/lang/String; = "aiderlog_native"

.field static final PRIMARY:I = -0x9daa18


# direct methods
.method static constructor <clinit>()V
    .locals 3

    .line 30
    new-instance v0, Ljava/text/SimpleDateFormat;

    sget-object v1, Ljava/util/Locale;->US:Ljava/util/Locale;

    const-string v2, "yyyy-MM-dd"

    invoke-direct {v0, v2, v1}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;Ljava/util/Locale;)V

    sput-object v0, Lcom/aiderlog/v22app/WidgetNativeV164;->DATE:Ljava/text/SimpleDateFormat;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 27
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static appearance(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;II)V
    .locals 6

    .line 49
    if-nez p3, :cond_0

    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object p3

    .line 50
    :cond_0
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_bg_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 51
    const-string v1, "system"

    invoke-virtual {v1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v2, "widget_bg_aurora"

    if-eqz v1, :cond_2

    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string v0, "widget_bg_midnight"

    goto :goto_0

    :cond_1
    move-object v0, v2

    .line 52
    :cond_2
    :goto_0
    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    if-nez v0, :cond_3

    invoke-static {p0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    .line 53
    :cond_3
    const-string v1, "widget_background"

    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-virtual {p1, v2, v0}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 54
    if-gez p4, :cond_4

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p4

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "widget_opacity_"

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const/16 v2, 0x64

    invoke-interface {p4, v0, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p4

    :cond_4
    int-to-float p4, p4

    const/high16 v0, 0x42c80000    # 100.0f

    div-float/2addr p4, v0

    .line 55
    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/high16 v1, 0x437f0000    # 255.0f

    const/4 v2, 0x0

    const/high16 v3, 0x3f800000    # 1.0f

    invoke-static {v3, p4}, Ljava/lang/Math;->min(FF)F

    move-result p4

    invoke-static {v2, p4}, Ljava/lang/Math;->max(FF)F

    move-result p4

    mul-float/2addr p4, v1

    invoke-static {p4}, Ljava/lang/Math;->round(F)I

    move-result p4

    const-string v1, "setImageAlpha"

    invoke-virtual {p1, v0, v1, p4}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 56
    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result p3

    .line 57
    const/4 p4, 0x6

    const-string v0, "widget_title"

    const-string v1, "widget_subtitle"

    const-string v2, "widget_empty"

    const-string v3, "widget_previous"

    const-string v4, "widget_next"

    const-string v5, "widget_add"

    filled-new-array/range {v0 .. v5}, [Ljava/lang/String;

    move-result-object v0

    const/4 v1, 0x0

    :goto_1
    if-lt v1, p4, :cond_6

    .line 58
    if-gez p5, :cond_5

    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->font(Landroid/content/Context;I)F

    move-result p2

    goto :goto_2

    :cond_5
    const/high16 p2, 0x41380000    # 11.5f

    const/4 p3, 0x5

    invoke-static {p3, p5}, Ljava/lang/Math;->min(II)I

    move-result p3

    const/4 p4, 0x1

    invoke-static {p4, p3}, Ljava/lang/Math;->max(II)I

    move-result p3

    int-to-float p3, p3

    const p4, 0x3f4ccccd    # 0.8f

    mul-float/2addr p3, p4

    add-float/2addr p2, p3

    .line 59
    :goto_2
    const-string p3, "widget_title"

    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p3

    const p4, 0x3f99999a    # 1.2f

    add-float/2addr p4, p2

    const/4 p5, 0x2

    invoke-virtual {p1, p3, p5, p4}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 60
    const-string p3, "widget_subtitle"

    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p3

    const/high16 p4, 0x41200000    # 10.0f

    const/high16 v0, 0x40000000    # 2.0f

    sub-float v0, p2, v0

    invoke-static {p4, v0}, Ljava/lang/Math;->max(FF)F

    move-result p4

    invoke-virtual {p1, p3, p5, p4}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 61
    const-string p3, "widget_empty"

    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    invoke-virtual {p1, p0, p5, p2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 62
    return-void

    .line 57
    :cond_6
    aget-object v2, v0, v1

    invoke-static {p0, p1, v2, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v1, v1, 0x1

    goto :goto_1
.end method

.method static calendar(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;IIZ)V
    .locals 33

    .line 141
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    move/from16 v2, p2

    move-object/from16 v3, p3

    move-object/from16 v4, p4

    move/from16 v5, p6

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v6

    const/4 v7, 0x5

    const/4 v8, 0x1

    invoke-virtual {v6, v7, v8}, Ljava/util/Calendar;->set(II)V

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v9

    new-instance v10, Ljava/lang/StringBuilder;

    const-string v11, "widget_month_"

    invoke-direct {v10, v11}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    const/4 v11, 0x0

    invoke-interface {v9, v10, v11}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v9

    const/4 v10, 0x2

    invoke-virtual {v6, v10, v9}, Ljava/util/Calendar;->add(II)V

    .line 142
    invoke-virtual {v6, v10}, Ljava/util/Calendar;->get(I)I

    const/4 v9, 0x7

    invoke-virtual {v6, v9}, Ljava/util/Calendar;->get(I)I

    move-result v12

    sub-int/2addr v12, v8

    invoke-virtual {v6, v7}, Ljava/util/Calendar;->getActualMaximum(I)I

    move-result v13

    add-int/2addr v12, v13

    add-int/lit8 v12, v12, 0x6

    div-int/2addr v12, v9

    const-string v13, "CalendarFortnight"

    invoke-virtual {v3, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    .line 143
    if-eqz v13, :cond_0

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v6

    .line 144
    :cond_0
    invoke-virtual {v6, v9}, Ljava/util/Calendar;->get(I)I

    move-result v14

    if-eqz v13, :cond_1

    add-int/2addr v14, v7

    neg-int v14, v14

    rem-int/2addr v14, v9

    goto :goto_0

    :cond_1
    rsub-int/lit8 v14, v14, 0x1

    :goto_0
    invoke-virtual {v6, v7, v14}, Ljava/util/Calendar;->add(II)V

    .line 145
    const-string v14, "widget_calendar_v164"

    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    invoke-virtual {v1, v15}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    .line 146
    if-nez p5, :cond_2

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v15

    goto :goto_1

    :cond_2
    move-object/from16 v15, p5

    .line 147
    :goto_1
    invoke-static {v0, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    if-gez v5, :cond_3

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->font(Landroid/content/Context;I)F

    move-result v5

    goto :goto_2

    :cond_3
    const/high16 v17, 0x41380000    # 11.5f

    int-to-float v5, v5

    const v18, 0x3f4ccccd    # 0.8f

    mul-float v5, v5, v18

    add-float v5, v5, v17

    .line 148
    :goto_2
    const-string v10, "widget_weekrow_v164"

    invoke-static {v0, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v10

    .line 149
    if-eqz v13, :cond_4

    const-string v18, "\ufffd\uc361"

    const-string v19, "\ufffd\uc195"

    const-string v20, "\ufffd\ub2d4"

    const-string v21, "\uf9cf\ufffd"

    const-string v22, "\u6e72\ufffd"

    const-string v23, "\ufffd\ub117"

    const-string v24, "\ufffd\uc52a"

    filled-new-array/range {v18 .. v24}, [Ljava/lang/String;

    move-result-object v18

    goto :goto_3

    :cond_4
    const-string v19, "\ufffd\uc52a"

    const-string v20, "\ufffd\uc361"

    const-string v21, "\ufffd\uc195"

    const-string v22, "\ufffd\ub2d4"

    const-string v23, "\uf9cf\ufffd"

    const-string v24, "\u6e72\ufffd"

    const-string v25, "\ufffd\ub117"

    filled-new-array/range {v19 .. v25}, [Ljava/lang/String;

    move-result-object v18

    .line 150
    :goto_3
    nop

    :goto_4
    if-lt v11, v9, :cond_21

    .line 151
    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v11

    invoke-virtual {v1, v11, v10}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 152
    const-string v10, "scheduleItems"

    invoke-virtual {v4, v10}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v10

    const-string v11, "holidays"

    invoke-virtual {v4, v11}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v4

    .line 153
    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v11

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v18

    invoke-static/range {v18 .. v18}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v7

    .line 154
    if-eqz v13, :cond_5

    const/4 v12, 0x2

    .line 155
    :cond_5
    invoke-static/range {p0 .. p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v9

    invoke-virtual {v9, v2}, Landroid/appwidget/AppWidgetManager;->getAppWidgetOptions(I)Landroid/os/Bundle;

    move-result-object v9

    .line 156
    const/16 v2, 0x104

    move-object/from16 p5, v7

    if-nez v9, :cond_6

    goto :goto_5

    :cond_6
    const-string v7, "appWidgetMinHeight"

    invoke-virtual {v9, v7, v2}, Landroid/os/Bundle;->getInt(Ljava/lang/String;I)I

    move-result v2

    .line 157
    :goto_5
    int-to-float v2, v2

    const/high16 v7, 0x42780000    # 62.0f

    sub-float/2addr v2, v7

    const-string v7, "CalendarMonth"

    invoke-virtual {v3, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v18

    move-object/from16 p6, v7

    const-string v7, "CalendarSplit"

    if-nez v18, :cond_8

    invoke-virtual {v3, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v18

    if-nez v18, :cond_8

    if-eqz p8, :cond_7

    goto :goto_6

    :cond_7
    const v18, 0x3f19999a    # 0.6f

    goto :goto_7

    :cond_8
    :goto_6
    const/high16 v18, 0x3f800000    # 1.0f

    :goto_7
    mul-float v2, v2, v18

    const/high16 v18, 0x41a00000    # 20.0f

    sub-float v2, v2, v18

    move/from16 v22, v5

    int-to-float v5, v12

    div-float/2addr v2, v5

    const/high16 v5, 0x40c00000    # 6.0f

    sub-float/2addr v2, v5

    .line 158
    const/4 v5, 0x0

    :goto_8
    if-lt v5, v12, :cond_9

    .line 192
    return-void

    .line 159
    :cond_9
    move/from16 v18, v12

    const-string v12, "widget_week_v164"

    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v12

    .line 160
    move-object/from16 v23, v15

    const/4 v15, 0x0

    :goto_9
    move/from16 v24, v8

    const/4 v8, 0x7

    if-lt v15, v8, :cond_a

    .line 190
    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    invoke-virtual {v1, v15, v12}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 158
    add-int/lit8 v5, v5, 0x1

    move/from16 v12, v18

    move-object/from16 v15, v23

    move/from16 v8, v24

    goto :goto_8

    .line 161
    :cond_a
    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v8

    const-string v1, "widget_day_v164"

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v1

    .line 162
    move/from16 v25, v5

    const/4 v5, 0x5

    invoke-virtual {v6, v5}, Ljava/util/Calendar;->get(I)I

    move-result v26

    invoke-static/range {v26 .. v26}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v5

    move-object/from16 v26, v14

    const-string v14, "widget_day_number_v164"

    invoke-static {v0, v1, v14, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 163
    const-string v5, ""

    if-nez v4, :cond_b

    move-object/from16 p4, v4

    move-object v4, v5

    goto :goto_a

    :cond_b
    invoke-virtual {v4, v8, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v27

    move-object/from16 p4, v4

    move-object/from16 v4, v27

    .line 164
    :goto_a
    move-object/from16 p8, v5

    const-string v5, "widget_day_label_v164"

    invoke-static {v0, v1, v5, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 165
    move/from16 v27, v15

    invoke-static {v10, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->eventsOn(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v15

    .line 166
    invoke-virtual {v3, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v28

    if-eqz v28, :cond_c

    if-eqz v9, :cond_c

    move-object/from16 v28, v10

    const/16 v10, 0x140

    move-object/from16 v29, v12

    const-string v12, "appWidgetMinWidth"

    invoke-virtual {v9, v12, v10}, Landroid/os/Bundle;->getInt(Ljava/lang/String;I)I

    move-result v10

    const/16 v12, 0x230

    if-lt v10, v12, :cond_d

    const/4 v10, 0x2

    goto :goto_b

    :cond_c
    move-object/from16 v28, v10

    move-object/from16 v29, v12

    :cond_d
    const/4 v10, 0x1

    .line 167
    :goto_b
    invoke-interface {v15}, Ljava/util/List;->isEmpty()Z

    move-result v12

    if-eqz v12, :cond_e

    move-object/from16 v30, p8

    goto :goto_c

    :cond_e
    const/4 v12, 0x0

    invoke-interface {v15, v12}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v30

    check-cast v30, Ljava/lang/String;

    :goto_c
    const/4 v12, 0x2

    if-ne v10, v12, :cond_f

    invoke-interface {v15}, Ljava/util/List;->size()I

    move-result v12

    move-object/from16 v31, v9

    const/4 v9, 0x1

    if-le v12, v9, :cond_10

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-static/range {v30 .. v30}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v9

    invoke-direct {v12, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v9, "\n"

    invoke-virtual {v12, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    const/4 v12, 0x1

    invoke-interface {v15, v12}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v30

    move-object/from16 v12, v30

    check-cast v12, Ljava/lang/String;

    invoke-virtual {v9, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v30

    move-object/from16 v9, v30

    goto :goto_d

    :cond_f
    move-object/from16 v31, v9

    .line 168
    :cond_10
    move-object/from16 v9, v30

    :goto_d
    const-string v12, "widget_day_events_v164"

    invoke-static {v0, v1, v12, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 169
    invoke-virtual {v3, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    if-eqz v9, :cond_11

    invoke-interface {v15}, Ljava/util/List;->size()I

    move-result v9

    if-le v9, v10, :cond_11

    new-instance v9, Ljava/lang/StringBuilder;

    move-object/from16 v30, v6

    const-string v6, "+"

    invoke-direct {v9, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-interface {v15}, Ljava/util/List;->size()I

    move-result v6

    sub-int/2addr v6, v10

    invoke-virtual {v9, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    goto :goto_e

    :cond_11
    move-object/from16 v30, v6

    invoke-interface {v15}, Ljava/util/List;->size()I

    move-result v6

    if-lez v6, :cond_12

    const-string v6, "\ufffd\ubfc8"

    goto :goto_e

    :cond_12
    move-object/from16 v6, p8

    :goto_e
    const-string v9, "widget_day_more_v164"

    invoke-static {v0, v1, v9, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 170
    const/high16 v6, 0x41c00000    # 24.0f

    cmpl-float v6, v2, v6

    if-ltz v6, :cond_13

    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v6

    if-nez v6, :cond_13

    const/4 v6, 0x1

    goto :goto_f

    :cond_13
    const/4 v6, 0x0

    .line 171
    :goto_f
    invoke-static {v0, v1, v5, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 172
    invoke-virtual {v3, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_14

    const/high16 v10, 0x42200000    # 40.0f

    cmpl-float v10, v2, v10

    if-ltz v10, :cond_14

    const/4 v10, 0x1

    goto :goto_10

    :cond_14
    const/4 v10, 0x0

    :goto_10
    invoke-static {v0, v1, v12, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 173
    if-eqz v6, :cond_15

    const/16 v10, 0x26

    goto :goto_11

    :cond_15
    const/16 v10, 0x1c

    :goto_11
    int-to-float v10, v10

    cmpl-float v10, v2, v10

    if-ltz v10, :cond_16

    const/4 v10, 0x1

    goto :goto_12

    :cond_16
    const/4 v10, 0x0

    :goto_12
    invoke-static {v0, v1, v9, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 174
    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v32

    invoke-virtual/range {v32 .. v32}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v3

    iget v3, v3, Landroid/util/DisplayMetrics;->density:F

    move-object/from16 v32, v7

    const/high16 v7, 0x41900000    # 18.0f

    if-eqz v6, :cond_17

    const/16 v6, 0xa

    goto :goto_13

    :cond_17
    const/4 v6, 0x0

    :goto_13
    int-to-float v6, v6

    sub-float v6, v2, v6

    invoke-static {v7, v6}, Ljava/lang/Math;->min(FF)F

    move-result v6

    const/high16 v7, 0x41400000    # 12.0f

    invoke-static {v7, v6}, Ljava/lang/Math;->max(FF)F

    move-result v6

    mul-float/2addr v3, v6

    invoke-static {v3}, Ljava/lang/Math;->round(F)I

    move-result v3

    const-string v6, "setHeight"

    invoke-virtual {v1, v10, v6, v3}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 175
    invoke-virtual {v8, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v13, :cond_18

    move-object/from16 v6, v30

    const/4 v7, 0x2

    invoke-virtual {v6, v7}, Ljava/util/Calendar;->get(I)I

    goto :goto_14

    :cond_18
    move-object/from16 v6, v30

    .line 176
    :goto_14
    move/from16 v7, v24

    invoke-static {v0, v1, v14, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 177
    invoke-static {v0, v1, v5, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 178
    invoke-static {v0, v1, v12, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v10, v23

    invoke-static {v0, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v23

    if-eqz v23, :cond_19

    const v23, -0x3e4501

    goto :goto_15

    :cond_19
    const v23, -0x9daa18

    :goto_15
    move/from16 v24, v2

    move/from16 v2, v23

    invoke-static {v0, v1, v9, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 179
    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const/high16 v9, 0x3fc00000    # 1.5f

    sub-float v9, v22, v9

    move-object/from16 v23, v11

    const/high16 v11, 0x41200000    # 10.0f

    invoke-static {v11, v9}, Ljava/lang/Math;->max(FF)F

    move-result v9

    const/4 v11, 0x2

    invoke-virtual {v1, v2, v11, v9}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 180
    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const/high16 v9, 0x41300000    # 11.0f

    const/high16 v12, 0x40400000    # 3.0f

    sub-float v12, v22, v12

    invoke-static {v9, v12}, Ljava/lang/Math;->max(FF)F

    move-result v9

    invoke-virtual {v1, v2, v11, v9}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 181
    invoke-static {v0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const/high16 v5, 0x40800000    # 4.0f

    sub-float v5, v22, v5

    const/high16 v9, 0x41200000    # 10.0f

    invoke-static {v9, v5}, Ljava/lang/Math;->max(FF)F

    move-result v5

    invoke-virtual {v1, v2, v11, v5}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 182
    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-eqz v3, :cond_1a

    const-string v3, "widget_day_selected_v164"

    goto :goto_16

    :cond_1a
    const-string v3, "widget_day_clear_v164"

    :goto_16
    invoke-static {v0, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const-string v5, "setBackgroundResource"

    invoke-virtual {v1, v2, v5, v3}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 183
    const-string v2, "widget_day_background_v164"

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    invoke-static {v0, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_1b

    const-string v5, "widget_day_dark_v164"

    move-object v9, v5

    move-object/from16 v5, p5

    goto :goto_17

    :cond_1b
    move-object/from16 v5, p5

    invoke-virtual {v8, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    if-eqz v9, :cond_1c

    const-string v9, "widget_day_today_v164"

    goto :goto_17

    :cond_1c
    const-string v9, "widget_day_bg_v164"

    :goto_17
    invoke-static {v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v9

    invoke-virtual {v1, v3, v9}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 184
    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const/16 v3, 0x64

    if-gez p7, :cond_1d

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v9

    new-instance v12, Ljava/lang/StringBuilder;

    const-string v14, "widget_opacity_"

    invoke-direct {v12, v14}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move/from16 v14, p2

    invoke-virtual {v12, v14}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-interface {v9, v12, v3}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v9

    goto :goto_18

    :cond_1d
    move/from16 v14, p2

    move/from16 v9, p7

    :goto_18
    invoke-static {v3, v9}, Ljava/lang/Math;->min(II)I

    move-result v3

    const/4 v9, 0x0

    invoke-static {v9, v3}, Ljava/lang/Math;->max(II)I

    move-result v3

    mul-int/lit16 v3, v3, 0xff

    int-to-float v3, v3

    const/high16 v12, 0x42c80000    # 100.0f

    div-float/2addr v3, v12

    invoke-static {v3}, Ljava/lang/Math;->round(F)I

    move-result v3

    const-string v12, "setImageAlpha"

    invoke-virtual {v1, v2, v12, v3}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 185
    const-string v2, "widget_day_cell_v164"

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-static {v8}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v9

    invoke-direct {v12, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v9

    if-eqz v9, :cond_1e

    move-object/from16 v4, p8

    goto :goto_19

    :cond_1e
    new-instance v9, Ljava/lang/StringBuilder;

    const-string v11, " "

    invoke-direct {v9, v11}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v9, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    :goto_19
    invoke-virtual {v12, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v9, " \ufffd\uc52a\ufffd\uc819 "

    invoke-virtual {v4, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-interface {v15}, Ljava/util/List;->size()I

    move-result v9

    invoke-virtual {v4, v9}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v9, "\u5a9b\ufffd"

    invoke-virtual {v4, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v1, v3, v4}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    .line 186
    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    move-object/from16 v3, p3

    move-object/from16 v9, v32

    invoke-virtual {v3, v9}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-nez v4, :cond_20

    move-object/from16 v11, p6

    invoke-virtual {v3, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_1f

    goto :goto_1a

    :cond_1f
    const-string v4, "date"

    invoke-static {v0, v14, v3, v4, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v4

    goto :goto_1b

    :cond_20
    move-object/from16 v11, p6

    :goto_1a
    new-instance v4, Ljava/lang/StringBuilder;

    const-string v12, "open-schedule-date-v168:"

    invoke-direct {v4, v12}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v0, v14, v3, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v4

    :goto_1b
    invoke-virtual {v1, v2, v4}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 187
    const-string v2, "widget_week_cells_v164"

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    move-object/from16 v4, v29

    invoke-virtual {v4, v2, v1}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 188
    const/4 v1, 0x5

    const/4 v2, 0x1

    invoke-virtual {v6, v1, v2}, Ljava/util/Calendar;->add(II)V

    .line 160
    add-int/lit8 v15, v27, 0x1

    move-object/from16 v1, p1

    move-object v12, v4

    move-object/from16 p5, v5

    move v8, v7

    move-object v7, v9

    move-object/from16 p6, v11

    move-object/from16 v11, v23

    move/from16 v2, v24

    move/from16 v5, v25

    move-object/from16 v14, v26

    move-object/from16 v9, v31

    move-object/from16 v4, p4

    move-object/from16 v23, v10

    move-object/from16 v10, v28

    goto/16 :goto_9

    .line 150
    :cond_21
    move/from16 v22, v5

    move v1, v7

    move v7, v8

    move v8, v11

    move-object/from16 v26, v14

    move v14, v2

    const/4 v2, 0x1

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v9, "widget_week_"

    invoke-direct {v5, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    aget-object v11, v18, v8

    invoke-static {v0, v10, v5, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {v0, v10, v5, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v11, v8, 0x1

    move v8, v7

    move v2, v14

    move/from16 v5, v22

    move-object/from16 v14, v26

    const/4 v9, 0x7

    move v7, v1

    move-object/from16 v1, p1

    goto/16 :goto_4
.end method

.method static collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;)V
    .locals 7
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/content/Context;",
            "Landroid/widget/RemoteViews;",
            "I",
            "Ljava/lang/String;",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;)V"
        }
    .end annotation

    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/RuntimeException;
        }
    .end annotation

    .line 229
    const-string v0, "widget_items_v164"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    move-object v1, p0

    move-object v2, p1

    move v3, p2

    move-object v4, p3

    move-object v5, p4

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;I)V

    .line 230
    return-void
.end method

.method static collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;I)V
    .locals 21
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/content/Context;",
            "Landroid/widget/RemoteViews;",
            "I",
            "Ljava/lang/String;",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;I)V"
        }
    .end annotation

    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/RuntimeException;
        }
    .end annotation

    .line 232
    move-object/from16 v8, p0

    move-object/from16 v9, p1

    move/from16 v10, p2

    move-object/from16 v11, p3

    move-object/from16 v0, p4

    move/from16 v12, p5

    const-string v1, "Calendar"

    invoke-virtual {v11, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_0

    const-string v2, "home"

    goto :goto_0

    :cond_0
    const-string v2, "Language"

    invoke-virtual {v11, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-eqz v2, :cond_1

    const-string v2, "language"

    goto :goto_0

    :cond_1
    const-string v2, "Routine"

    invoke-virtual {v11, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_2

    const-string v2, "private"

    goto :goto_0

    :cond_2
    const-string v2, "personal"

    .line 233
    :goto_0
    new-instance v3, Landroid/content/Intent;

    invoke-direct {v3}, Landroid/content/Intent;-><init>()V

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v5, ".MainActivity"

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v8, v4}, Landroid/content/Intent;->setClassName(Landroid/content/Context;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v3

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "aiderlog.widget.collection."

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v5, "."

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v3

    const-string v4, "target"

    invoke-virtual {v3, v4, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v2

    const/high16 v3, 0x14000000

    invoke-virtual {v2, v3}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object v2

    .line 234
    mul-int/lit8 v3, v10, 0x11

    invoke-virtual/range {p3 .. p3}, Ljava/lang/String;->hashCode()I

    move-result v4

    add-int/2addr v3, v4

    sget v4, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v5, 0x1f

    if-lt v4, v5, :cond_3

    const/high16 v4, 0xa000000

    goto :goto_1

    :cond_3
    const/high16 v4, 0x8000000

    :goto_1
    invoke-static {v8, v3, v2, v4}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v2

    invoke-virtual {v9, v12, v2}, Landroid/widget/RemoteViews;->setPendingIntentTemplate(ILandroid/app/PendingIntent;)V

    .line 235
    sget v2, Landroid/os/Build$VERSION;->SDK_INT:I

    const-string v13, "widget_service_"

    const/4 v14, 0x1

    if-lt v2, v5, :cond_5

    invoke-virtual {v11, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_5

    invoke-interface/range {p4 .. p4}, Ljava/util/List;->size()I

    move-result v1

    const/16 v2, 0x28

    if-gt v1, v2, :cond_5

    .line 236
    :try_start_0
    const-string v1, "android.widget.RemoteViews$RemoteCollectionItems$Builder"

    invoke-static {v1}, Ljava/lang/Class;->forName(Ljava/lang/String;)Ljava/lang/Class;

    move-result-object v15

    const/4 v7, 0x0

    new-array v1, v7, [Ljava/lang/Class;

    invoke-virtual {v15, v1}, Ljava/lang/Class;->getDeclaredConstructor([Ljava/lang/Class;)Ljava/lang/reflect/Constructor;

    move-result-object v1

    new-array v2, v7, [Ljava/lang/Object;

    invoke-virtual {v1, v2}, Ljava/lang/reflect/Constructor;->newInstance([Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v6

    .line 237
    const-string v1, "setHasStableIds"

    new-array v2, v14, [Ljava/lang/Class;

    sget-object v3, Ljava/lang/Boolean;->TYPE:Ljava/lang/Class;

    aput-object v3, v2, v7

    invoke-virtual {v15, v1, v2}, Ljava/lang/Class;->getMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v1

    new-array v2, v14, [Ljava/lang/Object;

    invoke-static {v14}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v3

    aput-object v3, v2, v7

    invoke-virtual {v1, v6, v2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    .line 238
    const-string v1, "setViewTypeCount"

    new-array v2, v14, [Ljava/lang/Class;

    sget-object v3, Ljava/lang/Integer;->TYPE:Ljava/lang/Class;

    aput-object v3, v2, v7

    invoke-virtual {v15, v1, v2}, Ljava/lang/Class;->getMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v1

    new-array v2, v14, [Ljava/lang/Object;

    const/16 v3, 0x10

    invoke-static {v3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v3

    aput-object v3, v2, v7

    invoke-virtual {v1, v6, v2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    .line 239
    move v5, v7

    :goto_2
    invoke-interface/range {p4 .. p4}, Ljava/util/List;->size()I

    move-result v1

    const/4 v2, 0x2

    if-lt v5, v1, :cond_4

    .line 240
    const-string v0, "build"

    new-array v1, v7, [Ljava/lang/Class;

    invoke-virtual {v15, v0, v1}, Ljava/lang/Class;->getMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v0

    new-array v1, v7, [Ljava/lang/Object;

    invoke-virtual {v0, v6, v1}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    .line 241
    const-class v1, Landroid/widget/RemoteViews;

    const-string v3, "setRemoteAdapter"

    new-array v4, v2, [Ljava/lang/Class;

    sget-object v5, Ljava/lang/Integer;->TYPE:Ljava/lang/Class;

    aput-object v5, v4, v7

    invoke-virtual {v0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v5

    aput-object v5, v4, v14

    invoke-virtual {v1, v3, v4}, Ljava/lang/Class;->getMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v1

    new-array v2, v2, [Ljava/lang/Object;

    invoke-static/range {p5 .. p5}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v3

    aput-object v3, v2, v7

    aput-object v0, v2, v14

    invoke-virtual {v1, v9, v2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-interface {v0, v1, v7}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    return-void

    .line 239
    :cond_4
    const-string v1, "addItem"

    new-array v3, v2, [Ljava/lang/Class;

    sget-object v4, Ljava/lang/Long;->TYPE:Ljava/lang/Class;

    aput-object v4, v3, v7

    const-class v4, Landroid/widget/RemoteViews;

    aput-object v4, v3, v14

    invoke-virtual {v15, v1, v3}, Ljava/lang/Class;->getMethod(Ljava/lang/String;[Ljava/lang/Class;)Ljava/lang/reflect/Method;

    move-result-object v4

    new-array v3, v2, [Ljava/lang/Object;

    invoke-interface {v0, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    invoke-virtual {v1}, Ljava/lang/String;->hashCode()I

    move-result v1

    int-to-long v1, v1

    const/16 v16, 0x20

    shl-long v1, v1, v16

    move-object/from16 v17, v15

    int-to-long v14, v5

    xor-long/2addr v1, v14

    invoke-static {v1, v2}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v1

    aput-object v1, v3, v7

    invoke-interface {v0, v5}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v1

    move-object v14, v1

    check-cast v14, Ljava/lang/String;

    const/4 v15, 0x0

    const/16 v18, -0x1

    move-object/from16 v1, p0

    move/from16 v2, p2

    move-object/from16 v19, v3

    move-object/from16 v3, p3

    move-object/from16 v20, v4

    move-object v4, v14

    move v14, v5

    move-object v0, v6

    move-object v6, v15

    move v15, v7

    move/from16 v7, v18

    invoke-static/range {v1 .. v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v1

    move-object/from16 v2, v19

    const/4 v3, 0x1

    aput-object v1, v2, v3

    move-object/from16 v1, v20

    invoke-virtual {v1, v0, v2}, Ljava/lang/reflect/Method;->invoke(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    add-int/lit8 v5, v14, 0x1

    move-object v6, v0

    move v7, v15

    move-object/from16 v15, v17

    const/4 v14, 0x1

    move-object/from16 v0, p4

    goto/16 :goto_2

    .line 242
    :catch_0
    move-exception v0

    const-string v1, "AiderLogWidget"

    const-string v2, "Collection API unavailable; using RemoteViewsService"

    invoke-static {v1, v2, v0}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    .line 243
    :cond_5
    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, ".WidgetRowsV164"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v8, v1}, Landroid/content/Intent;->setClassName(Landroid/content/Context;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    const-string v1, "appWidgetId"

    invoke-virtual {v0, v1, v10}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    move-result-object v0

    const-string v1, "kind"

    invoke-virtual {v0, v1, v11}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    .line 244
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "aiderlog-widget-rows://"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "/"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v11}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-static {v8, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    .line 245
    invoke-virtual {v9, v12, v0}, Landroid/widget/RemoteViews;->setRemoteAdapter(ILandroid/content/Intent;)V

    .line 246
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x1

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences$Editor;->putBoolean(Ljava/lang/String;Z)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 247
    return-void
.end method

.method static color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V
    .locals 0

    .line 47
    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    invoke-virtual {p1, p0, p3}, Landroid/widget/RemoteViews;->setTextColor(II)V

    return-void
.end method

.method static dark(Landroid/content/Context;Ljava/lang/String;)Z
    .locals 1

    .line 40
    const-string v0, "midnight"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "system"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_0

    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object p0

    invoke-virtual {p0}, Landroid/content/res/Resources;->getConfiguration()Landroid/content/res/Configuration;

    move-result-object p0

    iget p0, p0, Landroid/content/res/Configuration;->uiMode:I

    and-int/lit8 p0, p0, 0x30

    const/16 p1, 0x20

    if-eq p0, p1, :cond_1

    :cond_0
    const/4 p0, 0x0

    return p0

    :cond_1
    const/4 p0, 0x1

    return p0
.end method

.method static date(Ljava/lang/String;)Ljava/util/Calendar;
    .locals 3

    .line 38
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    :try_start_0
    sget-object v1, Lcom/aiderlog/v22app/WidgetNativeV164;->DATE:Ljava/text/SimpleDateFormat;

    monitor-enter v1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :try_start_1
    sget-object v2, Lcom/aiderlog/v22app/WidgetNativeV164;->DATE:Ljava/text/SimpleDateFormat;

    invoke-virtual {v2, p0}, Ljava/text/SimpleDateFormat;->parse(Ljava/lang/String;)Ljava/util/Date;

    move-result-object p0

    invoke-virtual {v0, p0}, Ljava/util/Calendar;->setTime(Ljava/util/Date;)V

    monitor-exit v1

    goto :goto_0

    :catchall_0
    move-exception p0

    monitor-exit v1
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    :try_start_2
    throw p0
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    :catch_0
    move-exception p0

    :goto_0
    return-object v0
.end method

.method static day(Ljava/util/Calendar;)Ljava/lang/String;
    .locals 2

    .line 37
    sget-object v0, Lcom/aiderlog/v22app/WidgetNativeV164;->DATE:Ljava/text/SimpleDateFormat;

    monitor-enter v0

    :try_start_0
    sget-object v1, Lcom/aiderlog/v22app/WidgetNativeV164;->DATE:Ljava/text/SimpleDateFormat;

    invoke-virtual {p0}, Ljava/util/Calendar;->getTime()Ljava/util/Date;

    move-result-object p0

    invoke-virtual {v1, p0}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object p0

    monitor-exit v0

    return-object p0

    :catchall_0
    move-exception p0

    monitor-exit v0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    throw p0
.end method

.method static drawable(Landroid/content/Context;Ljava/lang/String;)I
    .locals 2

    .line 33
    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object p0

    const-string v1, "drawable"

    invoke-virtual {v0, p1, v1, p0}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I

    move-result p0

    return p0
.end method

.method static eventsOn(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;
    .locals 6
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lorg/json/JSONArray;",
            "Ljava/lang/String;",
            ")",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 194
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    if-nez p0, :cond_0

    return-object v0

    .line 195
    :cond_0
    const/4 v1, 0x0

    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v1, v2, :cond_1

    .line 197
    invoke-static {v0}, Ljava/util/Collections;->sort(Ljava/util/List;)V

    return-object v0

    .line 195
    :cond_1
    invoke-virtual {p0, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    if-nez v2, :cond_2

    goto :goto_1

    :cond_2
    const-string v3, "date"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "endDate"

    invoke-virtual {v2, v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/String;->length()I

    move-result v5

    if-nez v5, :cond_3

    move-object v4, v3

    .line 196
    :cond_3
    invoke-virtual {p1, v3}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v3

    if-ltz v3, :cond_4

    invoke-virtual {p1, v4}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v3

    if-gtz v3, :cond_4

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "time"

    const-string v5, ""

    invoke-virtual {v2, v4, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "  "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "title"

    const-string v5, "\ufffd\uc52a\ufffd\uc819"

    invoke-virtual {v2, v4, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v0, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 195
    :cond_4
    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method

.method static font(Landroid/content/Context;I)F
    .locals 2

    .line 43
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_font_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 v0, 0x3

    invoke-interface {p0, p1, v0}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p0

    const/4 p1, 0x5

    invoke-static {p1, p0}, Ljava/lang/Math;->min(II)I

    move-result p0

    const/4 p1, 0x1

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    int-to-float p0, p0

    const p1, 0x3f4ccccd    # 0.8f

    mul-float/2addr p0, p1

    const/high16 p1, 0x41380000    # 11.5f

    add-float/2addr p0, p1

    return p0
.end method

.method static id(Landroid/content/Context;Ljava/lang/String;)I
    .locals 2

    .line 31
    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object p0

    const-string v1, "id"

    invoke-virtual {v0, p1, v1, p0}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I

    move-result p0

    return p0
.end method

.method static ink(Landroid/content/Context;Ljava/lang/String;)I
    .locals 0

    .line 41
    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_0

    const p0, -0x80901

    goto :goto_0

    :cond_0
    const p0, -0xe8e5c6

    :goto_0
    return p0
.end method

.method static layout(Landroid/content/Context;Ljava/lang/String;)I
    .locals 2

    .line 32
    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object p0

    const-string v1, "layout"

    invoke-virtual {v0, p1, v1, p0}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I

    move-result p0

    return p0
.end method

.method static mealPhotos(Landroid/content/Context;Landroid/widget/RemoteViews;Lorg/json/JSONObject;)V
    .locals 12

    .line 249
    const-string v0, "mealPhotos"

    invoke-virtual {p2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const-string v1, "mealTimes"

    invoke-virtual {p2, v1}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    const-string v2, "mealRatings"

    invoke-virtual {p2, v2}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p2

    .line 250
    const/4 v2, 0x0

    move v3, v2

    :goto_0
    const/4 v4, 0x4

    if-lt v3, v4, :cond_0

    .line 259
    return-void

    .line 253
    :cond_0
    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "widget_meal_photo_"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {p0, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {p1, v4, v2}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 254
    const-string v4, ""

    if-nez v1, :cond_1

    move-object v6, v4

    goto :goto_1

    :cond_1
    invoke-virtual {v1, v3, v4}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object v6

    :goto_1
    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, "widget_meal_time_"

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {p0, p1, v7, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v7, Ljava/lang/StringBuilder;

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6}, Ljava/lang/String;->isEmpty()Z

    move-result v6

    const/4 v8, 0x1

    xor-int/2addr v6, v8

    invoke-static {p0, p1, v7, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 255
    if-eqz p2, :cond_4

    invoke-virtual {p2, v3, v4}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/String;->isEmpty()Z

    move-result v6

    if-nez v6, :cond_4

    invoke-virtual {p2, v3, v2}, Lorg/json/JSONArray;->optInt(II)I

    move-result v6

    const/4 v7, 0x5

    invoke-static {v7, v6}, Ljava/lang/Math;->min(II)I

    move-result v6

    invoke-static {v2, v6}, Ljava/lang/Math;->max(II)I

    move-result v6

    move v9, v2

    move-object v10, v4

    :goto_2
    if-lt v9, v7, :cond_2

    goto :goto_4

    :cond_2
    new-instance v11, Ljava/lang/StringBuilder;

    invoke-static {v10}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    invoke-direct {v11, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    if-ge v9, v6, :cond_3

    const-string v10, "\ufffd\uc07e"

    goto :goto_3

    :cond_3
    const-string v10, "\ufffd\uc07f"

    :goto_3
    invoke-virtual {v11, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    add-int/lit8 v9, v9, 0x1

    goto :goto_2

    :cond_4
    move-object v10, v4

    :goto_4
    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "widget_meal_rating_"

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {p0, p1, v6, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 256
    if-nez v0, :cond_5

    goto :goto_5

    :cond_5
    invoke-virtual {v0, v3, v4}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object v4

    :goto_5
    const-string v6, "data:image/"

    invoke-virtual {v4, v6}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v6

    if-nez v6, :cond_6

    goto :goto_6

    .line 257
    :cond_6
    const/16 v6, 0x2c

    :try_start_0
    invoke-virtual {v4, v6}, Ljava/lang/String;->indexOf(I)I

    move-result v6

    add-int/2addr v6, v8

    invoke-virtual {v4, v6}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4, v2}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    move-result-object v4

    new-instance v6, Landroid/graphics/BitmapFactory$Options;

    invoke-direct {v6}, Landroid/graphics/BitmapFactory$Options;-><init>()V

    const/4 v7, 0x2

    iput v7, v6, Landroid/graphics/BitmapFactory$Options;->inSampleSize:I

    array-length v7, v4

    invoke-static {v4, v2, v7, v6}, Landroid/graphics/BitmapFactory;->decodeByteArray([BIILandroid/graphics/BitmapFactory$Options;)Landroid/graphics/Bitmap;

    move-result-object v4

    if-eqz v4, :cond_7

    const/16 v6, 0xc8

    const/16 v7, 0xa0

    invoke-static {v4, v6, v7, v8}, Landroid/graphics/Bitmap;->createScaledBitmap(Landroid/graphics/Bitmap;IIZ)Landroid/graphics/Bitmap;

    move-result-object v4

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-static {p0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    invoke-virtual {p1, v5, v4}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_6

    :catch_0
    move-exception v4

    .line 250
    :cond_7
    :goto_6
    add-int/lit8 v3, v3, 0x1

    goto/16 :goto_0
.end method

.method static monthTitle(Landroid/content/Context;ILjava/lang/String;)Ljava/lang/String;
    .locals 4

    .line 139
    const-string v0, "CalendarFortnight"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v1

    goto :goto_0

    :cond_0
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v1

    :goto_0
    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p2

    if-eqz p2, :cond_1

    const/4 p0, 0x7

    invoke-virtual {v1, p0}, Ljava/util/Calendar;->get(I)I

    move-result p1

    const/4 p2, 0x5

    add-int/2addr p1, p2

    neg-int p1, p1

    rem-int/2addr p1, p0

    invoke-virtual {v1, p2, p1}, Ljava/util/Calendar;->add(II)V

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p0

    const/16 p1, 0xd

    invoke-virtual {v1, p2, p1}, Ljava/util/Calendar;->add(II)V

    new-instance p1, Ljava/lang/StringBuilder;

    invoke-virtual {p0, p2}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p0

    invoke-direct {p1, p0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string p0, " \ufffd\ufffd "

    invoke-virtual {p1, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1, p2}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p1

    :goto_1
    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :cond_1
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance p2, Ljava/lang/StringBuilder;

    const-string v0, "widget_month_"

    invoke-direct {p2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 p2, 0x0

    invoke-interface {p0, p1, p2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p0

    const/4 p1, 0x2

    invoke-virtual {v1, p1, p0}, Ljava/util/Calendar;->add(II)V

    new-instance p0, Ljava/lang/StringBuilder;

    const/4 v0, 0x1

    invoke-virtual {v1, v0}, Ljava/util/Calendar;->get(I)I

    move-result v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v2

    invoke-direct {p0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, ". "

    invoke-virtual {p0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    sget-object v2, Ljava/util/Locale;->US:Ljava/util/Locale;

    new-array v3, v0, [Ljava/lang/Object;

    invoke-virtual {v1, p1}, Ljava/util/Calendar;->get(I)I

    move-result p1

    add-int/2addr p1, v0

    invoke-static {p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p1

    aput-object p1, v3, p2

    const-string p1, "%02d"

    invoke-static {v2, p1, v3}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    goto :goto_1
.end method

.method static navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;
    .locals 3

    .line 72
    new-instance v0, Landroid/content/Intent;

    const-string v1, "com.aiderlog.v22app.WIDGET_NAV_V164"

    invoke-direct {v0, v1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, ".WidgetNavV164"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, p0, v1}, Landroid/content/Intent;->setClassName(Landroid/content/Context;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    .line 73
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "aiderlog-widget://"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "/"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    .line 74
    const-string v1, "appWidgetId"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    move-result-object v1

    const-string v2, "kind"

    invoke-virtual {v1, v2, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p2

    const-string v1, "operation"

    invoke-virtual {p2, v1, p3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p2

    const-string v1, "value"

    invoke-virtual {p2, v1, p4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 75
    new-instance p2, Ljava/lang/StringBuilder;

    invoke-static {p1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object p1

    invoke-direct {p2, p1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result p1

    const/high16 p2, 0xc000000

    invoke-static {p0, p1, v0, p2}, Landroid/app/PendingIntent;->getBroadcast(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object p0

    return-object p0
.end method

.method static open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;
    .locals 4

    .line 64
    const-string v0, "Calendar"

    invoke-virtual {p2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    const-string v1, "language"

    const-string v2, "Language"

    if-eqz v0, :cond_0

    const-string v0, "home"

    goto :goto_0

    :cond_0
    const-string v0, "Routine"

    invoke-virtual {p2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string v0, "private"

    goto :goto_0

    :cond_1
    invoke-virtual {p2, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_2

    move-object v0, v1

    goto :goto_0

    :cond_2
    const-string v0, "Task"

    invoke-virtual {p2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string v0, "task"

    goto :goto_0

    :cond_3
    const-string v0, "personal"

    .line 65
    :goto_0
    invoke-virtual {p2, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-eqz v2, :cond_4

    goto :goto_1

    :cond_4
    move-object v1, v0

    .line 66
    :goto_1
    const-string v0, "add-schedule"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_5

    new-instance p3, Ljava/lang/StringBuilder;

    const-string v0, "add-schedule:"

    invoke-direct {p3, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p3

    invoke-virtual {p3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p3

    .line 67
    :cond_5
    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, ".MainActivity"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, p0, v2}, Landroid/content/Intent;->setClassName(Landroid/content/Context;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "aiderlog.widget."

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "."

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {v0, p2}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p2

    .line 68
    const-string v0, "target"

    invoke-virtual {p2, v0, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    const-string v1, "action"

    invoke-virtual {v0, v1, p3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    const/high16 v1, 0x14000000

    invoke-virtual {v0, v1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 69
    mul-int/lit8 p1, p1, 0x1f

    invoke-virtual {p3}, Ljava/lang/String;->hashCode()I

    move-result p3

    add-int/2addr p1, p3

    const/high16 p3, 0xc000000

    invoke-static {p0, p1, p2, p3}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object p0

    return-object p0
.end method

.method static prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;
    .locals 2

    .line 34
    const-string v0, "aiderlog_native"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object p0

    return-object p0
.end method

.method public static preview(Landroid/app/Activity;)V
    .locals 15

    .line 263
    :try_start_0
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v0

    const-string v1, "appWidgetId"

    invoke-virtual {v0, v1}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v1

    const-string v2, "providerClass"

    invoke-virtual {v0, v2}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v2

    const-string v3, "selectedTheme"

    invoke-virtual {v0, v3}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v3

    const-string v4, "selectedOpacity"

    invoke-virtual {v0, v4}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v4

    const-string v5, "selectedFont"

    invoke-virtual {v0, v5}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v5

    .line 264
    const/4 v6, 0x5

    new-array v7, v6, [Ljava/lang/reflect/Field;

    const/4 v8, 0x0

    aput-object v1, v7, v8

    const/4 v9, 0x1

    aput-object v2, v7, v9

    const/4 v10, 0x2

    aput-object v3, v7, v10

    const/4 v10, 0x3

    aput-object v4, v7, v10

    const/4 v10, 0x4

    aput-object v5, v7, v10

    :goto_0
    if-lt v8, v6, :cond_1

    .line 265
    const-string v6, "widget_config_preview_v164"

    invoke-static {p0, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    invoke-virtual {p0, v6}, Landroid/app/Activity;->findViewById(I)Landroid/view/View;

    move-result-object v6

    check-cast v6, Landroid/view/ViewGroup;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    if-nez v6, :cond_0

    .line 269
    sget-object p0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewContent:Ljava/lang/ThreadLocal;

    invoke-virtual {p0}, Ljava/lang/ThreadLocal;->remove()V

    sget-object p0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    invoke-virtual {p0}, Ljava/lang/ThreadLocal;->remove()V

    .line 265
    return-void

    .line 266
    :cond_0
    :try_start_1
    const-string v7, "selectedContent"

    invoke-virtual {v0, v7}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v0

    invoke-virtual {v0, v9}, Ljava/lang/reflect/Field;->setAccessible(Z)V

    sget-object v7, Lcom/aiderlog/v22app/WidgetDesignV165;->previewContent:Ljava/lang/ThreadLocal;

    invoke-virtual {v0, p0}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-virtual {v7, v0}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V

    sget-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    invoke-virtual {v4, p0}, Ljava/lang/reflect/Field;->getInt(Ljava/lang/Object;)I

    move-result v7

    invoke-static {v7}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v7

    invoke-virtual {v0, v7}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V

    .line 267
    invoke-virtual {v1, p0}, Ljava/lang/reflect/Field;->getInt(Ljava/lang/Object;)I

    move-result v9

    invoke-virtual {v2, p0}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->type(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v10

    const/4 v11, 0x1

    invoke-virtual {v3, p0}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    move-object v12, v0

    check-cast v12, Ljava/lang/String;

    invoke-virtual {v4, p0}, Ljava/lang/reflect/Field;->getInt(Ljava/lang/Object;)I

    move-result v13

    invoke-virtual {v5, p0}, Ljava/lang/reflect/Field;->getInt(Ljava/lang/Object;)I

    move-result v14

    move-object v8, p0

    invoke-static/range {v8 .. v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;

    move-result-object v0

    .line 268
    invoke-virtual {v6}, Landroid/view/ViewGroup;->removeAllViews()V

    invoke-virtual {v0, p0, v6}, Landroid/widget/RemoteViews;->apply(Landroid/content/Context;Landroid/view/ViewGroup;)Landroid/view/View;

    move-result-object p0

    invoke-virtual {v6, p0}, Landroid/view/ViewGroup;->addView(Landroid/view/View;)V

    .line 269
    goto :goto_1

    .line 264
    :cond_1
    aget-object v10, v7, v8

    invoke-virtual {v10, v9}, Ljava/lang/reflect/Field;->setAccessible(Z)V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    add-int/lit8 v8, v8, 0x1

    goto :goto_0

    .line 269
    :catchall_0
    move-exception p0

    :try_start_2
    const-string v0, "AiderLogWidget"

    const-string v1, "Settings preview unavailable"

    invoke-static {v0, v1, p0}, Landroid/util/Log;->w(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_1

    :goto_1
    sget-object p0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewContent:Ljava/lang/ThreadLocal;

    invoke-virtual {p0}, Ljava/lang/ThreadLocal;->remove()V

    sget-object p0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    invoke-virtual {p0}, Ljava/lang/ThreadLocal;->remove()V

    .line 270
    return-void

    .line 269
    :catchall_1
    move-exception p0

    sget-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewContent:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V

    sget-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V

    throw p0
.end method

.method public static render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;
    .locals 19

    .line 89
    move-object/from16 v9, p0

    move/from16 v10, p1

    move-object/from16 v11, p2

    const-string v0, "TaskClientLink"

    invoke-virtual {v11, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v6, "widget_root"

    const-string v7, "widget_title"

    const-string v8, "widget_subtitle"

    if-eqz v0, :cond_5

    .line 90
    const-string v0, "widget_client_link_v168"

    invoke-static {v9, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v0

    if-nez p4, :cond_0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v1

    goto :goto_0

    :cond_0
    move-object/from16 v1, p4

    .line 91
    :goto_0
    const-string v2, "widget_background"

    invoke-static {v9, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "widget_bg_"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v5, "system"

    invoke-virtual {v5, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_2

    invoke-static {v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_1

    const-string v5, "midnight"

    goto :goto_1

    :cond_1
    const-string v5, "aurora"

    goto :goto_1

    :cond_2
    move-object v5, v1

    :goto_1
    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v9, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v0, v3, v4}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 92
    invoke-static {v9, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-gez p5, :cond_3

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v3

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "widget_opacity_"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    const/16 v5, 0x64

    invoke-interface {v3, v4, v5}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v3

    goto :goto_2

    :cond_3
    move/from16 v3, p5

    :goto_2
    mul-int/lit16 v3, v3, 0xff

    int-to-float v3, v3

    const/high16 v4, 0x42c80000    # 100.0f

    div-float/2addr v3, v4

    invoke-static {v3}, Ljava/lang/Math;->round(F)I

    move-result v3

    const-string v4, "setImageAlpha"

    invoke-virtual {v0, v2, v4, v3}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 93
    invoke-static {v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v9, v0, v7, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-static {v9, v0, v8, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 94
    const/high16 v1, 0x41400000    # 12.0f

    const/4 v2, 0x3

    if-gez p6, :cond_4

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v3

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "widget_font_"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-interface {v3, v4, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v3

    goto :goto_3

    :cond_4
    move/from16 v3, p6

    :goto_3
    sub-int/2addr v3, v2

    int-to-float v2, v3

    const v3, 0x3f4ccccd    # 0.8f

    mul-float/2addr v2, v3

    add-float/2addr v2, v1

    .line 95
    invoke-static {v9, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v3, 0x2

    invoke-virtual {v0, v1, v3, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    invoke-static {v9, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/high16 v4, 0x3f800000    # 1.0f

    sub-float/2addr v2, v4

    invoke-virtual {v0, v1, v3, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 96
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "uid"

    invoke-virtual {v1, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v2, v3, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 97
    invoke-static {v9, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v3, "\ufffd\uae49 \u6028\uc889\ucefc\ufffd\uc819\u8e42\ufffd \ufffd\uc5ef\ufffd\uc830 \uf9cd\uacf9\uac95 \ufffd\uae6e\ufffd\uaf66 \u8adb\ufffd \u8e42\ub4ed\uad97"

    invoke-virtual {v0, v2, v3}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    .line 98
    invoke-static {v9, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "create-client-intake-v168:"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, ":"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v9, v10, v11, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v0, v2, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    return-object v0

    .line 100
    :cond_5
    const-string v0, "Calendar"

    invoke-virtual {v11, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_6

    invoke-static/range {p0 .. p6}, Lcom/aiderlog/v22app/WidgetDesignV165;->render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;

    move-result-object v0

    return-object v0

    .line 101
    :cond_6
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v12

    .line 102
    invoke-static/range {p0 .. p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v1

    invoke-virtual {v1, v10}, Landroid/appwidget/AppWidgetManager;->getAppWidgetOptions(I)Landroid/os/Bundle;

    move-result-object v1

    .line 103
    const/16 v2, 0x140

    if-nez v1, :cond_7

    goto :goto_4

    :cond_7
    const-string v3, "appWidgetMinWidth"

    invoke-virtual {v1, v3, v2}, Landroid/os/Bundle;->getInt(Ljava/lang/String;I)I

    .line 104
    :goto_4
    if-nez v1, :cond_8

    goto :goto_5

    :cond_8
    const-string v3, "appWidgetMinHeight"

    invoke-virtual {v1, v3, v2}, Landroid/os/Bundle;->getInt(Ljava/lang/String;I)I

    .line 105
    :goto_5
    invoke-virtual {v11, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v13

    const-string v0, "CalendarAgenda"

    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v14

    const-string v0, "CalendarMonth"

    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const/4 v5, 0x1

    if-nez v0, :cond_9

    const-string v0, "CalendarSplit"

    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_9

    const/16 v16, 0x0

    goto :goto_6

    :cond_9
    move/from16 v16, v5

    :goto_6
    const-string v0, "PersonalMeal"

    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    .line 106
    if-eqz v13, :cond_a

    if-nez v16, :cond_a

    if-nez v14, :cond_a

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->wide(Landroid/content/Context;I)Z

    move-result v0

    if-eqz v0, :cond_a

    move/from16 v17, v5

    goto :goto_7

    :cond_a
    const/16 v17, 0x0

    .line 107
    :goto_7
    if-eqz v17, :cond_b

    const-string v0, "widget_native_wide_v164"

    goto :goto_8

    :cond_b
    const-string v0, "widget_native_v164"

    :goto_8
    invoke-static {v9, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v3

    .line 108
    move-object/from16 v0, p0

    move-object v1, v3

    move/from16 v2, p1

    move-object v15, v3

    move-object/from16 v3, p4

    move/from16 v18, v4

    move/from16 v4, p5

    move/from16 v5, p6

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->appearance(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;II)V

    .line 109
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v1

    .line 110
    const-string v2, "\u5ac4\ufffd"

    const-string v3, "scheduleItems"

    const-string v4, " \uca0c "

    if-eqz v13, :cond_d

    if-eqz v14, :cond_c

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v0, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v5

    invoke-static {v5, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->eventsOn(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v5

    invoke-interface {v5}, Ljava/util/List;->size()I

    move-result v5

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_9

    :cond_c
    invoke-static/range {p0 .. p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->monthTitle(Landroid/content/Context;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_9

    :cond_d
    const-string v5, "today"

    invoke-virtual {v12, v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    :goto_9
    invoke-static {v9, v15, v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 111
    const-string v7, ""

    if-eqz v13, :cond_e

    if-nez v16, :cond_e

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v0, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v3

    invoke-static {v3, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->eventsOn(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v1

    invoke-interface {v1}, Ljava/util/List;->size()I

    move-result v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_a

    :cond_e
    move-object v0, v7

    :goto_a
    invoke-static {v9, v15, v8, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 112
    if-eqz v13, :cond_f

    if-nez v16, :cond_f

    if-nez v14, :cond_f

    const/4 v5, 0x1

    goto :goto_b

    :cond_f
    const/4 v5, 0x0

    :goto_b
    invoke-static {v9, v15, v8, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 113
    if-eqz v13, :cond_10

    if-nez v14, :cond_10

    const/4 v5, 0x1

    goto :goto_c

    :cond_10
    const/4 v5, 0x0

    :goto_c
    const-string v0, "widget_calendar_v164"

    invoke-static {v9, v15, v0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 114
    if-eqz v13, :cond_11

    if-nez v14, :cond_11

    const/4 v5, 0x1

    goto :goto_d

    :cond_11
    const/4 v5, 0x0

    :goto_d
    const-string v0, "widget_previous"

    invoke-static {v9, v15, v0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    if-eqz v13, :cond_12

    if-nez v14, :cond_12

    const/4 v5, 0x1

    goto :goto_e

    :cond_12
    const/4 v5, 0x0

    :goto_e
    const-string v1, "widget_next"

    invoke-static {v9, v15, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 115
    const-string v2, "PersonalTodo"

    if-nez v13, :cond_13

    const-string v3, "PersonalWorkflowOne"

    invoke-virtual {v11, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_13

    const-string v3, "PersonalWorkflowAll"

    invoke-virtual {v11, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_13

    invoke-virtual {v11, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_13

    const/4 v5, 0x0

    goto :goto_f

    :cond_13
    const/4 v5, 0x1

    .line 116
    :goto_f
    const-string v3, "widget_add"

    invoke-static {v9, v15, v3, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 117
    invoke-static {v9, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    const-string v5, "LanguageYoutube"

    invoke-virtual {v5, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_14

    const-string v5, "open-youtube"

    goto :goto_10

    :cond_14
    move-object v5, v7

    :goto_10
    invoke-static {v9, v10, v11, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v5

    invoke-virtual {v15, v4, v5}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 118
    invoke-static {v9, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    if-eqz v13, :cond_15

    const-string v2, "add-schedule"

    goto :goto_11

    :cond_15
    invoke-virtual {v11, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_16

    const-string v2, "add-todo"

    goto :goto_11

    :cond_16
    const-string v2, "add-memo"

    :goto_11
    invoke-static {v9, v10, v11, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v2

    invoke-virtual {v15, v3, v2}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 119
    invoke-static {v9, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v2, "month"

    const-string v3, "-1"

    invoke-static {v9, v10, v11, v2, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v2

    invoke-virtual {v15, v0, v2}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 120
    invoke-static {v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "month"

    const-string v2, "1"

    invoke-static {v9, v10, v11, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v15, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 121
    if-eqz v13, :cond_17

    if-nez v14, :cond_17

    move-object/from16 v0, p0

    move-object v1, v15

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object v4, v12

    move-object/from16 v5, p4

    move/from16 v6, p6

    move-object v14, v7

    move/from16 v7, p5

    move/from16 v8, v17

    invoke-static/range {v0 .. v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->calendar(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;IIZ)V

    goto :goto_12

    :cond_17
    move-object v14, v7

    .line 122
    :goto_12
    invoke-static {v9, v10, v11, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v7

    .line 123
    if-nez v16, :cond_18

    move/from16 v0, v18

    if-nez v0, :cond_19

    const/4 v5, 0x1

    goto :goto_13

    :cond_18
    move/from16 v0, v18

    :cond_19
    const/4 v5, 0x0

    :goto_13
    const-string v1, "widget_list_panel_v164"

    invoke-static {v9, v15, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 124
    const-string v1, "widget_meals_v164"

    invoke-static {v9, v15, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 125
    const-string v1, "widget_empty"

    if-eqz v0, :cond_1a

    invoke-static {v9, v15, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->mealPhotos(Landroid/content/Context;Landroid/widget/RemoteViews;Lorg/json/JSONObject;)V

    const/4 v0, 0x0

    invoke-static {v9, v15, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    goto/16 :goto_16

    .line 126
    :cond_1a
    if-nez v16, :cond_20

    .line 127
    const-string v0, "accessState"

    invoke-virtual {v12, v0, v14}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 128
    const-string v2, "needs-login"

    invoke-virtual {v2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_1b

    const-string v0, "\ufffd\ube4b\ufffd\ubfc9\ufffd\uaf4c \u6fe1\uc493\ub807\ufffd\uc524 \ufffd\uc351 \u6e72\uacd5\uc909\ufffd\uc4e3 \ufffd\ubff0\u5bc3\uace0\ube50\u4e8c\uc1f1\uaf6d\ufffd\uc282."

    goto :goto_14

    :cond_1b
    const-string v2, "sync-required"

    invoke-virtual {v2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1c

    const-string v0, "\ufffd\ube4b\ufffd\ubfc9\ufffd\uaf4c \u6028\uafa9\uc819 \u6e72\uacd5\uc909\ufffd\uc4e3 \ufffd\ub8de\u6e72\uace0\uc195\ufffd\ube50\u4e8c\uc1f1\uaf6d\ufffd\uc282."

    goto :goto_14

    :cond_1c
    if-eqz v13, :cond_1d

    const-string v0, "\ufffd\uaf51\ufffd\uae6e\ufffd\ube33 \ufffd\uad87\uf9de\uc496\ubfc9 \ufffd\uc52a\ufffd\uc819\ufffd\uc520 \ufffd\ubfbe\ufffd\ub4bf\ufffd\ub572\ufffd\ub58e."

    goto :goto_14

    :cond_1d
    const-string v0, "\ufffd\ufffd\ufffd\uc623\ufffd\ub9c2 \u6e72\uacd5\uc909\ufffd\uc520 \ufffd\ubfbe\ufffd\ub4bf\ufffd\ub572\ufffd\ub58e."

    :goto_14
    invoke-static {v9, v15, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 129
    const-string v0, "widget_items_v164"

    invoke-static {v9, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    invoke-virtual {v15, v2, v3}, Landroid/widget/RemoteViews;->setEmptyView(II)V

    .line 130
    invoke-interface {v7}, Ljava/util/List;->isEmpty()Z

    move-result v2

    invoke-static {v9, v15, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-interface {v7}, Ljava/util/List;->isEmpty()Z

    move-result v1

    const/4 v2, 0x1

    xor-int/2addr v1, v2

    invoke-static {v9, v15, v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 131
    if-eqz p3, :cond_1f

    .line 132
    const/4 v1, 0x0

    invoke-static {v9, v15, v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v8, "widget_preview_rows_v164"

    invoke-static {v9, v15, v8, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 133
    invoke-static {v9, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v15, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    .line 134
    move v12, v1

    :goto_15
    const/4 v0, 0x4

    invoke-interface {v7}, Ljava/util/List;->size()I

    move-result v1

    invoke-static {v0, v1}, Ljava/lang/Math;->min(II)I

    move-result v0

    if-lt v12, v0, :cond_1e

    .line 135
    goto :goto_16

    .line 134
    :cond_1e
    invoke-static {v9, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v13

    invoke-interface {v7, v12}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, Ljava/lang/String;

    move-object/from16 v0, p0

    move/from16 v1, p1

    move-object/from16 v2, p2

    move v4, v12

    move-object/from16 v5, p4

    move/from16 v6, p6

    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {v15, v13, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v12, v12, 0x1

    goto :goto_15

    .line 135
    :cond_1f
    invoke-static {v9, v15, v10, v11, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;)V

    .line 137
    :cond_20
    :goto_16
    return-object v15
.end method

.method static row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 7

    .line 216
    const-string v0, "title"

    const-string v1, "Calendar"

    invoke-virtual {p2, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_0

    invoke-static/range {p0 .. p6}, Lcom/aiderlog/v22app/WidgetDesignV165;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object p0

    return-object p0

    .line 217
    :cond_0
    :try_start_0
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2, p3}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v2

    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    invoke-static {v2, v0, p3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 218
    :goto_0
    const-string p3, "widget_item_v164"

    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object p3

    const-string v3, "time"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v5, "^[0-9]{2}:[0-9]{2}.*"

    invoke-virtual {v4, v5}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v4

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v5, "widget_item_text_v164"

    invoke-static {p0, p3, v5, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v4, :cond_1

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_1

    :cond_1
    const-string v0, ""

    :goto_1
    const-string v3, "widget_item_time_v165"

    invoke-static {p0, p3, v3, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const/4 v0, 0x1

    invoke-static {p0, p3, v3, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 219
    if-nez p5, :cond_2

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    :cond_2
    move-object v0, p5

    :goto_2
    const-string v3, "widget_item_background_v165"

    invoke-static {p0, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string v0, "widget_card_dark_v165"

    goto :goto_3

    :cond_3
    const-string v0, "widget_card_v165"

    :goto_3
    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {p3, v4, v0}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    sget-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->get()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/Integer;

    invoke-static {p0, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    if-nez v0, :cond_4

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v6, "widget_opacity_"

    invoke-direct {v4, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    const/16 v6, 0x64

    invoke-interface {v0, v4, v6}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v0

    goto :goto_4

    :cond_4
    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    :goto_4
    mul-int/lit16 v0, v0, 0xff

    int-to-float v0, v0

    const/high16 v4, 0x42c80000    # 100.0f

    div-float/2addr v0, v4

    invoke-static {v0}, Ljava/lang/Math;->round(F)I

    move-result v0

    const-string v4, "setImageAlpha"

    invoke-virtual {p3, v3, v4, v0}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 220
    if-nez p5, :cond_5

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object p5

    :cond_5
    invoke-static {p0, p5}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result p5

    invoke-static {p0, p3, v5, p5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 221
    if-gez p6, :cond_6

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->font(Landroid/content/Context;I)F

    move-result p5

    goto :goto_5

    :cond_6
    const/high16 p5, 0x41380000    # 11.5f

    int-to-float p6, p6

    const v0, 0x3f4ccccd    # 0.8f

    mul-float/2addr p6, v0

    add-float/2addr p5, p6

    .line 222
    :goto_5
    invoke-static {p0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p6

    const/4 v0, 0x2

    invoke-virtual {p3, p6, v0, p5}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 223
    invoke-virtual {p2, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result p2

    const-string p5, "widget_item_dot_v164"

    invoke-static {p0, p3, p5, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 224
    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object p1

    const-string p2, "selectedDate"

    invoke-static {v2, p2, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object p1

    const-string p2, "uid"

    invoke-virtual {p1, p2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-static {v2, p2, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 225
    const-string p1, "widget_item_row_v164"

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    new-instance p1, Landroid/content/Intent;

    invoke-direct {p1}, Landroid/content/Intent;-><init>()V

    const-string p2, "widgetRow"

    invoke-virtual {p1, p2, p4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    move-result-object p1

    new-instance p2, Ljava/lang/StringBuilder;

    const-string p4, "open-schedule-item-v168:"

    invoke-direct {p2, p4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p4

    invoke-static {p4}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p4

    invoke-virtual {p2, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    const-string p4, "action"

    invoke-virtual {p1, p4, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p1

    invoke-virtual {p3, p0, p1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 226
    return-object p3
.end method

.method static rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;
    .locals 7
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/content/Context;",
            "I",
            "Ljava/lang/String;",
            "Lorg/json/JSONObject;",
            ")",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 200
    const-string v0, "Calendar"

    invoke-virtual {p2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_0

    invoke-static {p0, p1, p2, p3}, Lcom/aiderlog/v22app/WidgetDesignV165;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object p0

    return-object p0

    .line 201
    :cond_0
    invoke-virtual {p2, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    const/4 v1, 0x0

    if-eqz v0, :cond_6

    .line 202
    new-instance p2, Ljava/util/ArrayList;

    invoke-direct {p2}, Ljava/util/ArrayList;-><init>()V

    const-string v0, "scheduleItems"

    invoke-virtual {p3, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p3

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->selected(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object p0

    .line 203
    nop

    :goto_0
    if-eqz p3, :cond_5

    invoke-virtual {p3}, Lorg/json/JSONArray;->length()I

    move-result p1

    if-lt v1, p1, :cond_1

    goto :goto_2

    :cond_1
    invoke-virtual {p3, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object p1

    if-nez p1, :cond_3

    :cond_2
    goto :goto_1

    :cond_3
    const-string v0, "date"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "endDate"

    invoke-virtual {p1, v2, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    if-eqz v3, :cond_4

    move-object v2, v0

    :cond_4
    invoke-virtual {p0, v0}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v0

    if-ltz v0, :cond_2

    invoke-virtual {p0, v2}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v0

    if-gtz v0, :cond_2

    invoke-virtual {p1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-interface {p2, p1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 204
    :cond_5
    :goto_2
    new-instance p0, Lcom/aiderlog/v22app/WidgetNativeV164$1;

    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetNativeV164$1;-><init>()V

    invoke-static {p2, p0}, Ljava/util/Collections;->sort(Ljava/util/List;Ljava/util/Comparator;)V

    return-object p2

    .line 206
    :cond_6
    const-string v0, "RoutineAll"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v2, "RoutineLanguage"

    const-string v3, "RoutineCards"

    if-nez v0, :cond_1b

    invoke-virtual {p2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_7

    goto/16 :goto_3

    :cond_7
    const-string v0, "RoutineStats"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_8

    const-string v0, "routineStats"

    goto/16 :goto_4

    :cond_8
    invoke-virtual {p2, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_9

    const-string v0, "languageRows"

    goto/16 :goto_4

    :cond_9
    const-string v0, "LanguageYoutube"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_a

    const-string v0, "youtubeNotes"

    goto/16 :goto_4

    :cond_a
    const-string v0, "PersonalWorkflowOne"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_b

    const-string v0, "memos"

    goto/16 :goto_4

    :cond_b
    const-string v0, "PersonalWorkflowAll"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_c

    const-string v0, "memoTodos"

    goto/16 :goto_4

    :cond_c
    const-string v0, "PersonalTodo"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_d

    const-string v0, "todos"

    goto/16 :goto_4

    :cond_d
    const-string v0, "PersonalReading"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_e

    const-string v0, "readingBooks"

    goto/16 :goto_4

    :cond_e
    const-string v0, "PersonalQuote"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_f

    const-string v0, "readingCurrent"

    goto/16 :goto_4

    :cond_f
    const-string v0, "PersonalWorkoutStatsInbody"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_10

    const-string v0, "workoutStatsInbody"

    goto/16 :goto_4

    :cond_10
    const-string v0, "PersonalWorkoutStats"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_11

    const-string v0, "workoutStats"

    goto/16 :goto_4

    :cond_11
    const-string v0, "PersonalWorkoutChallengeAll"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_12

    const-string v0, "challengeAll"

    goto :goto_4

    :cond_12
    const-string v0, "PersonalWorkoutChallengeCombined"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_13

    const-string v0, "challengeCombined"

    goto :goto_4

    :cond_13
    const-string v0, "PersonalWorkoutChallengeOnly"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_14

    const-string v0, "challengeSelected"

    goto :goto_4

    :cond_14
    const-string v0, "PersonalWorkoutChallenge"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_15

    const-string v0, "workoutChallenges"

    goto :goto_4

    :cond_15
    const-string v0, "PersonalWorkoutMeal"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_16

    const-string v0, "mealWorkouts"

    goto :goto_4

    :cond_16
    const-string v0, "PersonalWorkout"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_17

    const-string v0, "workouts"

    goto :goto_4

    :cond_17
    const-string v0, "PersonalBulletSeven"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_18

    const-string v0, "bullet7"

    goto :goto_4

    :cond_18
    const-string v0, "PersonalBulletSevenWorkflow"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_19

    const-string v0, "bullet7Workflow"

    goto :goto_4

    :cond_19
    const-string v0, "PersonalBulletThreeWorkflow"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1a

    const-string v0, "bullet3Workflow"

    goto :goto_4

    :cond_1a
    const-string v0, "bullet3"

    goto :goto_4

    :cond_1b
    :goto_3
    const-string v0, "routines"

    .line 207
    :goto_4
    invoke-virtual {p3, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p3

    new-instance v4, Ljava/util/ArrayList;

    invoke-direct {v4}, Ljava/util/ArrayList;-><init>()V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "widget_content_"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const-string v5, "\ufffd\uc7fe\uf9e3\ufffd \ufffd\uada1\ufffd\uc29c"

    invoke-interface {p0, p1, v5}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    .line 208
    const-string p1, "\ufffd\uc07a\ufffd\ubf31"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1c

    const-string p0, "English"

    :cond_1c
    const-string p1, "\ufffd\uc52a\u8e42\uba84\ubf31"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1d

    const-string p0, "Japanese"

    .line 209
    :cond_1d
    nop

    :goto_5
    if-eqz p3, :cond_24

    invoke-virtual {p3}, Lorg/json/JSONArray;->length()I

    move-result p1

    if-lt v1, p1, :cond_1e

    goto :goto_7

    :cond_1e
    const-string p1, ""

    invoke-virtual {p3, v1, p1}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v5

    if-nez v5, :cond_1f

    goto :goto_6

    .line 210
    :cond_1f
    const-string v5, "bullet"

    invoke-virtual {v0, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_21

    const-string v5, "\u5a9b\uba2f\uc819"

    invoke-virtual {p1, v5}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v5

    if-nez v5, :cond_20

    sget-object v5, Ljava/util/Locale;->US:Ljava/util/Locale;

    invoke-virtual {p1, v5}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v5

    const-string v6, "emotion"

    invoke-virtual {v5, v6}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v5

    if-eqz v5, :cond_21

    :cond_20
    goto :goto_6

    .line 211
    :cond_21
    invoke-virtual {p2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_22

    invoke-virtual {p2, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_23

    :cond_22
    const-string v5, "\ufffd\uc7fe\uf9e3\ufffd"

    invoke-virtual {p0, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v5

    if-nez v5, :cond_23

    invoke-virtual {p1, p0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v5

    if-nez v5, :cond_23

    goto :goto_6

    .line 212
    :cond_23
    invoke-interface {v4, p1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 209
    :goto_6
    add-int/lit8 v1, v1, 0x1

    goto :goto_5

    .line 213
    :cond_24
    :goto_7
    return-object v4
.end method

.method static selected(Landroid/content/Context;I)Ljava/lang/String;
    .locals 2

    .line 39
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_date_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v0

    invoke-interface {p0, p1, v0}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V
    .locals 0

    .line 46
    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    if-eqz p3, :cond_0

    const/4 p2, 0x0

    goto :goto_0

    :cond_0
    const/16 p2, 0x8

    :goto_0
    invoke-virtual {p1, p0, p2}, Landroid/widget/RemoteViews;->setViewVisibility(II)V

    return-void
.end method

.method static snapshot(Landroid/content/Context;)Lorg/json/JSONObject;
    .locals 3

    .line 36
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    const-string v1, "widget_snapshot"

    const-string v2, "{}"

    invoke-interface {p0, v1, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-direct {v0, p0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object v0

    :catch_0
    move-exception p0

    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0}, Lorg/json/JSONObject;-><init>()V

    return-object p0
.end method

.method static text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 45
    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    invoke-virtual {p1, p0, p3}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    return-void
.end method

.method static theme(Landroid/content/Context;I)Ljava/lang/String;
    .locals 2

    .line 42
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_theme_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const-string v0, "aurora"

    invoke-interface {p0, p1, v0}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static type(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 35
    if-nez p0, :cond_0

    const-string p0, ""

    goto :goto_0

    :cond_0
    const/16 v0, 0x24

    invoke-virtual {p0, v0}, Ljava/lang/String;->lastIndexOf(I)I

    move-result v0

    add-int/lit8 v0, v0, 0x1

    invoke-virtual {p0, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p0

    :goto_0
    return-object p0
.end method

.method public static update(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)Z
    .locals 8

    .line 78
    invoke-static {p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->type(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p3

    .line 79
    const-string v0, "Task"

    invoke-virtual {p3, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    const/4 v7, 0x0

    if-eqz v0, :cond_0

    const-string v0, "TaskClientLink"

    invoke-virtual {p3, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    return v7

    .line 81
    :cond_0
    const/4 v3, 0x0

    const/4 v4, 0x0

    const/4 v5, -0x1

    const/4 v6, -0x1

    move-object v0, p0

    move v1, p2

    move-object v2, p3

    :try_start_0
    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;

    move-result-object v0

    .line 82
    invoke-virtual {p1, p2, v0}, Landroid/appwidget/AppWidgetManager;->updateAppWidget(ILandroid/widget/RemoteViews;)V

    .line 83
    const-string v0, "widget_items_v164"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {p1, p2, v0}, Landroid/appwidget/AppWidgetManager;->notifyAppWidgetViewDataChanged(II)V

    .line 84
    const-string v0, "w165_secondary_list"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    invoke-virtual {p1, p2, p0}, Landroid/appwidget/AppWidgetManager;->notifyAppWidgetViewDataChanged(II)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    .line 85
    const/4 p0, 0x1

    return p0

    .line 86
    :catchall_0
    move-exception p0

    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "native-render failed type="

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p1, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    const-string p3, " id="

    invoke-virtual {p1, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const-string p2, "AiderLogWidget"

    invoke-static {p2, p1, p0}, Landroid/util/Log;->e(Ljava/lang/String;Ljava/lang/String;Ljava/lang/Throwable;)I

    return v7
.end method

.method static view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;
    .locals 2

    .line 44
    new-instance v0, Landroid/widget/RemoteViews;

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v1

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->layout(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    invoke-direct {v0, v1, p0}, Landroid/widget/RemoteViews;-><init>(Ljava/lang/String;I)V

    return-object v0
.end method
