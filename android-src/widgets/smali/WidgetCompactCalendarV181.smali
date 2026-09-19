.class public final Lcom/aiderlog/v22app/WidgetCompactCalendarV181;
.super Ljava/lang/Object;
.source "WidgetCompactCalendarV181.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 21
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static bind(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;IILorg/json/JSONObject;)V
    .locals 16
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/content/Context;",
            "Landroid/widget/RemoteViews;",
            "I",
            "Ljava/lang/String;",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            "Ljava/lang/String;",
            "Z",
            "Ljava/lang/String;",
            "II",
            "Lorg/json/JSONObject;",
            ")V"
        }
    .end annotation

    .line 117
    move-object/from16 v7, p0

    move-object/from16 v8, p1

    move-object/from16 v0, p5

    move-object/from16 v9, p6

    move-object/from16 v1, p7

    const/4 v2, 0x1

    const/4 v3, 0x0

    if-nez p8, :cond_0

    invoke-interface/range {p4 .. p4}, Ljava/util/List;->isEmpty()Z

    move-result v4

    if-nez v4, :cond_0

    move v4, v2

    goto :goto_0

    :cond_0
    move v4, v3

    :goto_0
    invoke-static {v7, v8, v0, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    if-eqz p8, :cond_1

    invoke-interface/range {p4 .. p4}, Ljava/util/List;->isEmpty()Z

    move-result v4

    if-nez v4, :cond_1

    goto :goto_1

    :cond_1
    move v2, v3

    :goto_1
    invoke-static {v7, v8, v9, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-interface/range {p4 .. p4}, Ljava/util/List;->isEmpty()Z

    move-result v2

    invoke-static {v7, v8, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 118
    const-string v2, "accessState"

    move-object/from16 v4, p12

    invoke-virtual {v4, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v4, "needs-login"

    invoke-virtual {v4, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_2

    const-string v2, "\uc571\uc5d0\uc11c \ub85c\uadf8\uc778"

    :goto_2
    move-object/from16 v10, p3

    goto :goto_3

    :cond_2
    const-string v4, "sync-required"

    invoke-virtual {v4, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_3

    const-string v2, "\uc571\uc5d0\uc11c \ub3d9\uae30\ud654"

    goto :goto_2

    :cond_3
    const-string v2, "@todos"

    move-object/from16 v10, p3

    invoke-virtual {v10, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-eqz v2, :cond_4

    const-string v2, "\ub0a8\uc740 \ud560 \uc77c\uc774 \uc5c6\uc5b4\uc694"

    goto :goto_3

    :cond_4
    const-string v2, "\uc608\uc815\ub41c \uc77c\uc815\uc774 \uc5c6\uc5b4\uc694"

    :goto_3
    invoke-static {v7, v8, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v11, p9

    invoke-static {v7, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v7, v8, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 119
    if-eqz p8, :cond_6

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v8, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    move v12, v3

    :goto_4
    invoke-interface/range {p4 .. p4}, Ljava/util/List;->size()I

    move-result v0

    move/from16 v13, p11

    invoke-static {v13, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    if-lt v12, v0, :cond_5

    goto :goto_5

    :cond_5
    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v14

    move-object/from16 v15, p4

    invoke-interface {v15, v12}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, Ljava/lang/String;

    move-object/from16 v0, p0

    move/from16 v1, p2

    move-object/from16 v2, p3

    move v4, v12

    move-object/from16 v5, p9

    move/from16 v6, p10

    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {v8, v14, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v12, v12, 0x1

    goto :goto_4

    .line 120
    :cond_6
    move-object/from16 v15, p4

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    move-object/from16 p5, p0

    move-object/from16 p6, p1

    move/from16 p7, p2

    move-object/from16 p8, p3

    move-object/from16 p9, p4

    move/from16 p10, v0

    invoke-static/range {p5 .. p10}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;I)V

    .line 121
    :goto_5
    return-void
.end method

.method static calendar(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;II)V
    .locals 47

    .line 123
    move-object/from16 v1, p0

    move-object/from16 v2, p1

    move/from16 v3, p2

    move-object/from16 v4, p3

    move-object/from16 v5, p4

    move-object/from16 v6, p5

    move/from16 v7, p7

    const-string v8, "w184_event_title"

    const-string v0, "CalendarCombined"

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    const-string v0, "CalendarFortnight"

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    const-string v0, "CalendarSplit"

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v11

    .line 124
    invoke-static {v1, v3, v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->calendarStart(Landroid/content/Context;ILjava/lang/String;)Ljava/util/Calendar;

    move-result-object v12

    const/4 v13, 0x2

    invoke-virtual {v12, v13}, Ljava/util/Calendar;->get(I)I

    move-result v14

    const/4 v15, 0x7

    const/4 v13, 0x1

    if-eqz v10, :cond_0

    const/4 v13, 0x5

    const/16 v20, 0x2

    goto :goto_0

    :cond_0
    invoke-virtual {v12, v15}, Ljava/util/Calendar;->get(I)I

    move-result v18

    add-int/lit8 v18, v18, -0x1

    const/4 v13, 0x5

    invoke-virtual {v12, v13}, Ljava/util/Calendar;->getActualMaximum(I)I

    move-result v17

    add-int v18, v18, v17

    const/16 v16, 0x6

    add-int/lit8 v18, v18, 0x6

    div-int/lit8 v17, v18, 0x7

    move/from16 v20, v17

    .line 125
    :goto_0
    if-nez v10, :cond_1

    invoke-virtual {v12, v15}, Ljava/util/Calendar;->get(I)I

    move-result v17

    const/16 v18, 0x1

    rsub-int/lit8 v15, v17, 0x1

    invoke-virtual {v12, v13, v15}, Ljava/util/Calendar;->add(II)V

    .line 126
    :cond_1
    const-string v13, "widget_calendar_v164"

    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    invoke-virtual {v2, v15}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    const-string v15, "widget_weekdays_compact_v184"

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v15

    const-string v21, "\uc77c"

    const-string v22, "\uc6d4"

    const-string v23, "\ud654"

    const-string v24, "\uc218"

    const-string v25, "\ubaa9"

    const-string v26, "\uae08"

    const-string v27, "\ud1a0"

    filled-new-array/range {v21 .. v27}, [Ljava/lang/String;

    move-result-object v18

    .line 127
    const/16 v21, 0x0

    move-object/from16 v22, v8

    move/from16 v8, v21

    :goto_1
    const v23, -0x4d3b0f

    const v24, -0x9f7f44

    const v26, -0x1c4b3b

    const v27, -0x559f89

    const/4 v4, 0x7

    if-lt v8, v4, :cond_23

    .line 128
    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v2, v4, v15}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 129
    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v4

    invoke-virtual {v4}, Landroid/util/SizeF;->getHeight()F

    move-result v4

    const/high16 v8, 0x42280000    # 42.0f

    sub-float/2addr v4, v8

    if-eqz v0, :cond_2

    const/high16 v0, 0x3f400000    # 0.75f

    goto :goto_2

    :cond_2
    const/high16 v0, 0x3f800000    # 1.0f

    :goto_2
    mul-float/2addr v4, v0

    const/high16 v0, 0x41800000    # 16.0f

    sub-float/2addr v4, v0

    move/from16 v15, v20

    int-to-float v0, v15

    div-float/2addr v4, v0

    .line 130
    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v0

    invoke-virtual {v0}, Landroid/util/SizeF;->getWidth()F

    move-result v0

    const/high16 v18, 0x43fa0000    # 500.0f

    cmpl-float v0, v0, v18

    const/high16 v20, 0x41380000    # 11.5f

    if-ltz v0, :cond_3

    move/from16 v0, v20

    goto :goto_3

    :cond_3
    const/high16 v0, 0x41200000    # 10.0f

    .line 131
    :goto_3
    invoke-static {v1, v3, v7, v0}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v0

    const/high16 v8, 0x41100000    # 9.0f

    invoke-static {v8, v0}, Ljava/lang/Math;->max(FF)F

    move-result v8

    .line 132
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->scaledDensity:F

    move/from16 v25, v8

    const v8, 0x3dcccccd    # 0.1f

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v28

    move/from16 v29, v4

    invoke-virtual/range {v28 .. v28}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v4

    iget v4, v4, Landroid/util/DisplayMetrics;->density:F

    invoke-static {v8, v4}, Ljava/lang/Math;->max(FF)F

    move-result v4

    div-float/2addr v0, v4

    const/high16 v4, 0x3f800000    # 1.0f

    invoke-static {v4, v0}, Ljava/lang/Math;->max(FF)F

    move-result v4

    .line 133
    const-string v0, "scheduleItems"

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    const-string v0, "holidays"

    move/from16 v28, v4

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v4

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v5

    .line 134
    move/from16 v3, v21

    :goto_4
    if-lt v3, v15, :cond_4

    .line 166
    return-void

    .line 135
    :cond_4
    const-string v0, "widget_week_v164"

    move/from16 v18, v15

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v15

    .line 136
    move/from16 v7, v21

    :goto_5
    move-object/from16 v30, v5

    const/4 v5, 0x7

    if-lt v7, v5, :cond_5

    .line 164
    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v2, v0, v15}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 134
    add-int/lit8 v3, v3, 0x1

    move/from16 v7, p7

    move/from16 v15, v18

    move-object/from16 v5, v30

    goto :goto_4

    .line 137
    :cond_5
    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v5

    const-string v31, ""

    if-nez v4, :cond_6

    move-object/from16 v32, v31

    goto :goto_6

    :cond_6
    invoke-virtual {v4, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    move-object/from16 v32, v0

    :goto_6
    invoke-static {v8, v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->scheduleRows(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v2

    if-nez v10, :cond_7

    move/from16 v33, v3

    const/4 v3, 0x2

    invoke-virtual {v12, v3}, Ljava/util/Calendar;->get(I)I

    move-result v0

    if-eq v0, v14, :cond_8

    const/4 v0, 0x1

    goto :goto_7

    :cond_7
    move/from16 v33, v3

    :cond_8
    move/from16 v0, v21

    .line 138
    :goto_7
    if-eqz v9, :cond_9

    const-string v3, "widget_mini_day_v184"

    goto :goto_8

    :cond_9
    const-string v3, "widget_event_day_v184"

    :goto_8
    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v3

    move-object/from16 v34, v4

    const/4 v4, 0x5

    invoke-virtual {v12, v4}, Ljava/util/Calendar;->get(I)I

    move-result v35

    invoke-static/range {v35 .. v35}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v4

    move-object/from16 v35, v8

    const-string v8, "w184_day"

    invoke-static {v1, v3, v8, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 139
    if-eqz v0, :cond_b

    if-eqz v11, :cond_a

    const v0, -0x6c7458

    goto :goto_9

    :cond_a
    const v0, -0x565d4b

    :goto_9
    move v4, v0

    goto :goto_b

    :cond_b
    invoke-virtual/range {v32 .. v32}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_f

    if-nez v7, :cond_c

    goto :goto_a

    :cond_c
    const/4 v4, 0x6

    if-ne v7, v4, :cond_e

    if-eqz v11, :cond_d

    move/from16 v4, v23

    goto :goto_b

    :cond_d
    move/from16 v4, v24

    goto :goto_b

    :cond_e
    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    goto :goto_9

    :cond_f
    :goto_a
    if-eqz v11, :cond_10

    move/from16 v4, v26

    goto :goto_b

    :cond_10
    move/from16 v4, v27

    .line 140
    :goto_b
    move/from16 v36, v7

    move-object/from16 v7, v30

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_11

    const/4 v0, -0x1

    goto :goto_c

    :cond_11
    move v0, v4

    :goto_c
    invoke-static {v1, v3, v8, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v5, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v30

    if-eqz v30, :cond_12

    const-string v30, "widget_today_compact_v184"

    goto :goto_d

    :cond_12
    const-string v30, "widget_day_clear_v164"

    :goto_d
    move-object/from16 v37, v7

    move-object/from16 v7, v30

    invoke-static {v1, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v7

    move-object/from16 v30, v13

    const-string v13, "setBackgroundResource"

    invoke-virtual {v3, v0, v13, v7}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 141
    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    if-eqz v9, :cond_13

    move/from16 v7, v20

    goto :goto_e

    :cond_13
    const/high16 v7, 0x41300000    # 11.0f

    :goto_e
    move/from16 v13, p2

    move/from16 v8, p7

    invoke-static {v1, v13, v8, v7}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v7

    move/from16 v38, v14

    const/4 v14, 0x2

    invoke-virtual {v3, v0, v14, v7}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 142
    const-string v7, " "

    if-eqz v9, :cond_17

    invoke-interface {v2}, Ljava/util/List;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_14

    move-object/from16 v0, v31

    goto :goto_f

    :cond_14
    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    const/4 v4, 0x1

    if-le v0, v4, :cond_15

    const-string v0, "\u2022\u2022"

    goto :goto_f

    :cond_15
    const-string v0, "\u2022"

    :goto_f
    const-string v4, "w184_dots"

    invoke-static {v1, v3, v4, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v11, :cond_16

    const v0, -0x3e4501

    goto :goto_10

    :cond_16
    const v0, -0x9daa18

    :goto_10
    const-string v4, "w184_dots"

    invoke-static {v1, v3, v4, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move/from16 v39, v9

    move/from16 v14, v29

    move-object/from16 v9, v32

    move/from16 v29, v10

    move/from16 v32, v11

    goto/16 :goto_1a

    .line 144
    :cond_17
    const-string v0, "w184_cell_background"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    if-eqz v11, :cond_18

    const-string v14, "widget_compact_grid_dark_v181"

    goto :goto_11

    :cond_18
    const-string v14, "widget_compact_grid_v181"

    :goto_11
    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v14

    invoke-virtual {v3, v0, v14}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 145
    const-string v0, "w184_cell_background"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    move/from16 v14, p6

    move/from16 v39, v9

    invoke-static {v1, v13, v14}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->opacity(Landroid/content/Context;II)I

    move-result v9

    mul-int/lit16 v9, v9, 0xff

    int-to-float v9, v9

    const/high16 v40, 0x42c80000    # 100.0f

    div-float v9, v9, v40

    invoke-static {v9}, Ljava/lang/Math;->round(F)I

    move-result v9

    const-string v14, "setImageAlpha"

    invoke-virtual {v3, v0, v14, v9}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 146
    const-string v0, "w184_holiday"

    move-object/from16 v9, v32

    invoke-static {v1, v3, v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1, v3, v0, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-virtual {v9}, Ljava/lang/String;->isEmpty()Z

    move-result v14

    if-nez v14, :cond_19

    const/high16 v14, 0x42340000    # 45.0f

    cmpl-float v14, v29, v14

    if-ltz v14, :cond_19

    const/4 v14, 0x1

    goto :goto_12

    :cond_19
    move/from16 v14, v21

    :goto_12
    invoke-static {v1, v3, v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 147
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/high16 v14, 0x41000000    # 8.0f

    move/from16 v32, v11

    const/high16 v11, 0x41080000    # 8.5f

    invoke-static {v1, v13, v8, v11}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v6

    invoke-static {v14, v6}, Ljava/lang/Math;->max(FF)F

    move-result v6

    const/4 v11, 0x2

    invoke-virtual {v3, v0, v11, v6}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 148
    if-eqz v10, :cond_1a

    const/high16 v0, 0x42980000    # 76.0f

    cmpl-float v0, v29, v0

    if-ltz v0, :cond_1a

    const/4 v6, 0x1

    goto :goto_13

    :cond_1a
    move/from16 v6, v21

    .line 149
    :goto_13
    const-string v0, "w184_events"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v3, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    mul-float v0, v25, v28

    if-eqz v6, :cond_1b

    const v11, 0x4019999a    # 2.4f

    goto :goto_14

    :cond_1b
    const v11, 0x3f99999a    # 1.2f

    :goto_14
    mul-float/2addr v0, v11

    const/high16 v11, 0x40800000    # 4.0f

    add-float/2addr v0, v11

    invoke-virtual {v9}, Ljava/lang/String;->isEmpty()Z

    move-result v11

    if-nez v11, :cond_1c

    const/high16 v11, 0x42340000    # 45.0f

    cmpl-float v11, v29, v11

    if-ltz v11, :cond_1c

    const/4 v11, 0x1

    goto :goto_15

    :cond_1c
    move/from16 v11, v21

    :goto_15
    move/from16 v14, v29

    invoke-static {v14, v0, v11}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->capacity(FFZ)I

    move-result v11

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    invoke-static {v11, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    .line 151
    move/from16 v29, v0

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    if-le v0, v11, :cond_1d

    const/4 v8, 0x1

    if-le v11, v8, :cond_1d

    add-int/lit8 v0, v11, -0x1

    move v8, v0

    goto :goto_16

    .line 152
    :cond_1d
    move/from16 v8, v29

    :goto_16
    move/from16 v29, v10

    move/from16 v10, v21

    :goto_17
    if-lt v10, v8, :cond_21

    .line 159
    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    if-le v0, v8, :cond_1e

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v6, "+"

    invoke-direct {v0, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v6

    sub-int/2addr v6, v8

    invoke-virtual {v0, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_18

    :cond_1e
    move-object/from16 v0, v31

    :goto_18
    const-string v6, "w184_more"

    invoke-static {v1, v3, v6, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    if-le v0, v8, :cond_1f

    const/4 v8, 0x1

    if-le v11, v8, :cond_1f

    const/4 v0, 0x1

    goto :goto_19

    :cond_1f
    move/from16 v0, v21

    :goto_19
    invoke-static {v1, v3, v6, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v1, v3, v6, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 161
    :goto_1a
    const-string v0, "w184_cell"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v6

    invoke-direct {v4, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v9}, Ljava/lang/String;->isEmpty()Z

    move-result v6

    if-eqz v6, :cond_20

    goto :goto_1b

    :cond_20
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v31

    :goto_1b
    move-object/from16 v6, v31

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v6, " \uc77c\uc815 "

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v2

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v4, "\uac1c"

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v3, v0, v2}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    .line 162
    const-string v0, "w184_cell"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "open-schedule-date-v168:"

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    move-object/from16 v4, p3

    invoke-static {v1, v13, v4, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v2

    invoke-virtual {v3, v0, v2}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    const-string v0, "widget_week_cells_v164"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v15, v0, v3}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    const/4 v2, 0x5

    const/4 v3, 0x1

    invoke-virtual {v12, v2, v3}, Ljava/util/Calendar;->add(II)V

    .line 136
    add-int/lit8 v7, v36, 0x1

    move-object/from16 v2, p1

    move-object/from16 v6, p5

    move/from16 v10, v29

    move-object/from16 v13, v30

    move/from16 v11, v32

    move/from16 v3, v33

    move-object/from16 v4, v34

    move-object/from16 v8, v35

    move-object/from16 v5, v37

    move/from16 v9, v39

    move/from16 v29, v14

    move/from16 v14, v38

    goto/16 :goto_5

    .line 153
    :cond_21
    move/from16 v17, v4

    const/16 v19, 0x5

    const/16 v40, 0x1

    move-object/from16 v4, p3

    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    invoke-interface {v2, v10}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v41
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_7

    move-object/from16 v42, v2

    :try_start_1
    move-object/from16 v2, v41

    check-cast v2, Ljava/lang/String;

    invoke-direct {v0, v2}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    if-eqz v6, :cond_22

    const-string v2, "widget_event_chip_tall_v184"

    goto :goto_1c

    :cond_22
    const-string v2, "widget_event_chip_v184"

    :goto_1c
    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v2
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_6

    move/from16 v41, v6

    :try_start_2
    const-string v6, "title"

    invoke-virtual {v0, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_5

    move-object/from16 v43, v9

    move-object/from16 v9, v22

    :try_start_3
    invoke-static {v1, v2, v9, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_4

    move-object/from16 v6, p5

    move/from16 v22, v8

    :try_start_4
    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    invoke-static {v1, v2, v9, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 154
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_3

    move/from16 v44, v11

    move/from16 v11, v25

    move-object/from16 v25, v12

    const/4 v12, 0x2

    :try_start_5
    invoke-virtual {v2, v8, v12, v11}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    const-string v12, "setBackgroundColor"
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_2

    move/from16 v45, v11

    :try_start_6
    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventColor(Lorg/json/JSONObject;)I

    move-result v11
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_1

    move/from16 v46, v14

    move/from16 v14, v32

    :try_start_7
    invoke-static {v11, v14}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->softColor(IZ)I

    move-result v11

    invoke-virtual {v2, v8, v12, v11}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 155
    const-string v8, "uid"

    invoke-static/range {p4 .. p4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v11

    invoke-static {v0, v8, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v8, "selectedDate"

    invoke-static {v0, v8, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 156
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    new-instance v11, Ljava/lang/StringBuilder;

    const-string v12, "open-schedule-item-v168:"

    invoke-direct {v11, v12}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-static {v12}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    invoke-static {v1, v13, v4, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v11

    invoke-virtual {v2, v8, v11}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 157
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-direct {v11, v12}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v11, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, "title"

    invoke-virtual {v0, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v11, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v8, v0}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    const-string v0, "w184_events"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v3, v0, v2}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V
    :try_end_7
    .catch Ljava/lang/Exception; {:try_start_7 .. :try_end_7} :catch_0

    goto :goto_22

    .line 158
    :catch_0
    move-exception v0

    goto :goto_22

    :catch_1
    move-exception v0

    goto :goto_1d

    :catch_2
    move-exception v0

    move/from16 v45, v11

    :goto_1d
    move/from16 v46, v14

    move/from16 v14, v32

    goto :goto_22

    :catch_3
    move-exception v0

    goto :goto_1e

    :catch_4
    move-exception v0

    move-object/from16 v6, p5

    move/from16 v22, v8

    :goto_1e
    move/from16 v44, v11

    move/from16 v46, v14

    move/from16 v45, v25

    move/from16 v14, v32

    goto :goto_21

    :catch_5
    move-exception v0

    move-object/from16 v6, p5

    move-object/from16 v43, v9

    move/from16 v44, v11

    move/from16 v46, v14

    move-object/from16 v9, v22

    move/from16 v45, v25

    move/from16 v14, v32

    goto :goto_20

    :catch_6
    move-exception v0

    goto :goto_1f

    :catch_7
    move-exception v0

    move-object/from16 v42, v2

    :goto_1f
    move/from16 v41, v6

    move-object/from16 v43, v9

    move/from16 v44, v11

    move/from16 v46, v14

    move-object/from16 v9, v22

    move/from16 v45, v25

    move/from16 v14, v32

    move-object/from16 v6, p5

    :goto_20
    move/from16 v22, v8

    :goto_21
    move-object/from16 v25, v12

    :goto_22
    nop

    .line 152
    add-int/lit8 v10, v10, 0x1

    move/from16 v32, v14

    move/from16 v4, v17

    move/from16 v8, v22

    move-object/from16 v12, v25

    move/from16 v6, v41

    move-object/from16 v2, v42

    move/from16 v11, v44

    move/from16 v25, v45

    move/from16 v14, v46

    move-object/from16 v22, v9

    move-object/from16 v9, v43

    goto/16 :goto_17

    .line 127
    :cond_23
    move-object/from16 v4, p3

    move/from16 v35, v0

    move v2, v7

    move/from16 v39, v9

    move/from16 v29, v10

    move-object/from16 v25, v12

    move-object/from16 v30, v13

    move/from16 v38, v14

    move/from16 v10, v20

    move-object/from16 v9, v22

    const/high16 v0, 0x41100000    # 9.0f

    const/16 v19, 0x5

    const/16 v40, 0x1

    move v13, v3

    move v14, v11

    move-object v11, v15

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v5, "widget_week_"

    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    aget-object v7, v18, v8

    invoke-static {v1, v11, v3, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    if-nez v8, :cond_25

    if-eqz v14, :cond_24

    move/from16 v12, v26

    goto :goto_23

    :cond_24
    move/from16 v12, v27

    :goto_23
    const/4 v7, 0x6

    goto :goto_25

    :cond_25
    const/4 v7, 0x6

    if-ne v8, v7, :cond_27

    if-eqz v14, :cond_26

    goto :goto_24

    :cond_26
    move/from16 v12, v24

    goto :goto_25

    :cond_27
    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v23

    :goto_24
    move/from16 v12, v23

    :goto_25
    invoke-static {v1, v11, v3, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    invoke-static {v1, v13, v2, v0}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v0

    const/high16 v5, 0x41080000    # 8.5f

    invoke-static {v5, v0}, Ljava/lang/Math;->max(FF)F

    move-result v0

    const/4 v5, 0x2

    invoke-virtual {v11, v3, v5, v0}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    add-int/lit8 v8, v8, 0x1

    move-object/from16 v5, p4

    move v7, v2

    move-object/from16 v22, v9

    move/from16 v20, v10

    move-object v15, v11

    move v3, v13

    move v11, v14

    move-object/from16 v12, v25

    move/from16 v10, v29

    move-object/from16 v13, v30

    move/from16 v0, v35

    move/from16 v14, v38

    move/from16 v9, v39

    move-object/from16 v2, p1

    goto/16 :goto_1
.end method

.method static calendarStart(Landroid/content/Context;ILjava/lang/String;)Ljava/util/Calendar;
    .locals 4

    .line 84
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    .line 85
    const-string v1, "CalendarFortnight"

    invoke-virtual {v1, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p2

    const/4 v1, 0x0

    const/4 v2, 0x5

    if-eqz p2, :cond_0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p2

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->fortnightStart(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v0

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance p2, Ljava/lang/StringBuilder;

    const-string v3, "widget_fortnight_offset_"

    invoke-direct {p2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-interface {p0, p1, v1}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p0

    mul-int/lit8 p0, p0, 0xe

    invoke-virtual {v0, v2, p0}, Ljava/util/Calendar;->add(II)V

    goto :goto_0

    .line 86
    :cond_0
    const/4 p2, 0x1

    invoke-virtual {v0, v2, p2}, Ljava/util/Calendar;->set(II)V

    const/4 p2, 0x2

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "widget_month_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-interface {p0, p1, v1}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p0

    invoke-virtual {v0, p2, p0}, Ljava/util/Calendar;->add(II)V

    .line 87
    :goto_0
    return-object v0
.end method

.method static capacity(FFZ)I
    .locals 1

    .line 81
    const/high16 v0, 0x41b00000    # 22.0f

    sub-float/2addr p0, v0

    if-eqz p2, :cond_0

    const/16 p2, 0xc

    goto :goto_0

    :cond_0
    const/4 p2, 0x0

    :goto_0
    int-to-float p2, p2

    sub-float/2addr p0, p2

    const/high16 p2, 0x41500000    # 13.0f

    invoke-static {p2, p1}, Ljava/lang/Math;->max(FF)F

    move-result p1

    div-float/2addr p0, p1

    float-to-int p0, p0

    const/4 p1, 0x6

    invoke-static {p1, p0}, Ljava/lang/Math;->min(II)I

    move-result p0

    const/4 p1, 0x1

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    return p0
.end method

.method static cellTime(Lorg/json/JSONObject;)Ljava/lang/String;
    .locals 1

    .line 49
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object p0

    const-string v0, "0"

    invoke-virtual {p0, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p0

    :cond_0
    return-object p0
.end method

.method static copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;
    .locals 1

    .line 26
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    invoke-virtual {p0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

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

.method static dateKey(Ljava/lang/String;)Z
    .locals 1

    .line 27
    if-eqz p0, :cond_0

    const-string v0, "\\d{4}-\\d{2}-\\d{2}"

    invoke-virtual {p0, v0}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    const/4 p0, 0x0

    return p0
.end method

.method static eventColor(Lorg/json/JSONObject;)I
    .locals 4

    .line 77
    const-string v0, "color"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "#[0-9a-fA-F]{6}"

    invoke-virtual {v0, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    :try_start_0
    invoke-static {v0}, Landroid/graphics/Color;->parseColor(Ljava/lang/String;)I

    move-result p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return p0

    :catch_0
    move-exception v0

    .line 78
    :cond_0
    const/4 v0, 0x4

    new-array v1, v0, [I

    fill-array-data v1, :array_0

    const-string v2, "title"

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v3, "id"

    invoke-virtual {p0, v3, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->hashCode()I

    move-result p0

    const v2, 0x7fffffff

    and-int/2addr p0, v2

    rem-int/2addr p0, v0

    aget p0, v1, p0

    return p0

    :array_0
    .array-data 4
        -0x8a9e24
        -0xa27c2b
        -0x428a48
        -0x6f7f2f
    .end array-data
.end method

.method static eventRows(Lorg/json/JSONArray;Ljava/lang/String;Z)Ljava/util/List;
    .locals 6
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lorg/json/JSONArray;",
            "Ljava/lang/String;",
            "Z)",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 31
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 32
    const/4 v1, 0x0

    :goto_0
    if-eqz p0, :cond_6

    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v1, v2, :cond_0

    goto/16 :goto_2

    .line 33
    :cond_0
    invoke-virtual {p0, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    if-eqz v2, :cond_5

    const-string v3, "title"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    if-eqz v3, :cond_1

    goto :goto_1

    .line 34
    :cond_1
    const-string v3, "date"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "endDate"

    invoke-virtual {v2, v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v5

    if-eqz v5, :cond_2

    move-object v4, v3

    .line 35
    :cond_2
    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dateKey(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_5

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dateKey(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_5

    invoke-virtual {v4, v3}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v5

    if-ltz v5, :cond_5

    invoke-virtual {p1, v4}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v4

    if-gtz v4, :cond_5

    if-nez p2, :cond_3

    invoke-virtual {p1, v3}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v4

    if-gez v4, :cond_3

    goto :goto_1

    .line 36
    :cond_3
    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    const-string v4, "kind"

    const-string v5, "schedule"

    invoke-static {v2, v4, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 37
    invoke-virtual {v3, p1}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v4

    if-gez v4, :cond_4

    move-object v3, p1

    :cond_4
    const-string v4, "selectedDate"

    invoke-static {v2, v4, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-virtual {v2}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v0, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 32
    :cond_5
    :goto_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 39
    :cond_6
    :goto_2
    new-instance p0, Lcom/aiderlog/v22app/WidgetCompactCalendarV181$1;

    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181$1;-><init>()V

    invoke-static {v0, p0}, Ljava/util/Collections;->sort(Ljava/util/List;Ljava/util/Comparator;)V

    .line 46
    return-object v0
.end method

.method static fortnightSelected(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 4

    .line 73
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->fortnightStart(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v1

    const/4 v2, 0x5

    const/16 v3, 0xd

    invoke-virtual {v1, v2, v3}, Ljava/util/Calendar;->add(II)V

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dateKey(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_0

    invoke-virtual {p1, v0}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v0

    if-ltz v0, :cond_0

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p1, v0}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v0

    if-gtz v0, :cond_0

    move-object p0, p1

    :cond_0
    return-object p0
.end method

.method static fortnightStart(Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 72
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object p0

    const/4 v0, 0x7

    invoke-virtual {p0, v0}, Ljava/util/Calendar;->get(I)I

    move-result v0

    rsub-int/lit8 v0, v0, 0x1

    const/4 v1, 0x5

    invoke-virtual {p0, v1, v0}, Ljava/util/Calendar;->add(II)V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static incompleteRows(Lorg/json/JSONObject;Z)Ljava/util/List;
    .locals 8
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lorg/json/JSONObject;",
            "Z)",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 52
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object p0

    const-string v0, "incompleteTodos"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    if-nez v0, :cond_0

    const-string v0, "todos"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    .line 53
    :cond_0
    new-instance p0, Ljava/util/ArrayList;

    invoke-direct {p0}, Ljava/util/ArrayList;-><init>()V

    new-instance v1, Ljava/util/HashSet;

    invoke-direct {v1}, Ljava/util/HashSet;-><init>()V

    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    .line 54
    const/4 v3, 0x0

    move v4, v3

    :goto_0
    if-eqz v0, :cond_5

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v5

    if-lt v4, v5, :cond_1

    goto :goto_2

    .line 55
    :cond_1
    invoke-virtual {v0, v4}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v5

    if-eqz v5, :cond_4

    const-string v6, "done"

    invoke-virtual {v5, v6}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v6

    if-nez v6, :cond_4

    const-string v6, "id"

    invoke-virtual {v5, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    move-result v7

    if-nez v7, :cond_4

    const-string v7, "title"

    invoke-virtual {v5, v7}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    move-result v7

    if-nez v7, :cond_4

    invoke-virtual {v5, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-interface {v1, v6}, Ljava/util/Set;->add(Ljava/lang/Object;)Z

    move-result v6

    if-nez v6, :cond_2

    goto :goto_1

    .line 56
    :cond_2
    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v5

    const-string v6, "kind"

    const-string v7, "todo"

    invoke-static {v5, v6, v7}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    if-eqz p1, :cond_3

    invoke-virtual {v2, v5}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    goto :goto_1

    :cond_3
    invoke-virtual {v5}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-interface {p0, v5}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 54
    :cond_4
    :goto_1
    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    .line 58
    :cond_5
    :goto_2
    nop

    :goto_3
    if-eqz p1, :cond_8

    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-lt v3, v0, :cond_6

    goto :goto_4

    .line 59
    :cond_6
    const-string v0, "todoPair"

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    new-instance v1, Lorg/json/JSONArray;

    invoke-direct {v1}, Lorg/json/JSONArray;-><init>()V

    invoke-virtual {v2, v3}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v4

    invoke-virtual {v1, v4}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v4, v3, 0x1

    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v5

    if-ge v4, v5, :cond_7

    invoke-virtual {v2, v4}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v4

    invoke-virtual {v1, v4}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    .line 60
    :cond_7
    const-string v4, "children"

    invoke-static {v0, v4, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-interface {p0, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 58
    add-int/lit8 v3, v3, 0x2

    goto :goto_3

    .line 62
    :cond_8
    :goto_4
    return-object p0
.end method

.method static opacity(Landroid/content/Context;II)I
    .locals 2

    .line 75
    const/16 v0, 0x64

    if-gez p2, :cond_0

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance p2, Ljava/lang/StringBuilder;

    const-string v1, "widget_opacity_"

    invoke-direct {p2, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-interface {p0, p1, v0}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p2

    :cond_0
    invoke-static {v0, p2}, Ljava/lang/Math;->min(II)I

    move-result p0

    const/4 p1, 0x0

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    return p0
.end method

.method static owner(Lorg/json/JSONObject;)Ljava/lang/String;
    .locals 2

    .line 70
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v1, "uid"

    invoke-virtual {p0, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {v0, v1, p0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static ratio(Ljava/lang/String;)F
    .locals 1

    .line 82
    const-string v0, "CalendarCombined"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    const p0, 0x3f428f5c    # 0.76f

    goto :goto_0

    :cond_0
    const-string v0, "CalendarAgenda"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    const p0, 0x3f733333    # 0.95f

    goto :goto_0

    :cond_1
    const-string v0, "CalendarFortnight"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    const p0, 0x3f4ccccd    # 0.8f

    goto :goto_0

    :cond_2
    const-string v0, "CalendarSplit"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_3

    const p0, 0x3fb851ec    # 1.44f

    goto :goto_0

    :cond_3
    const p0, 0x3f99999a    # 1.2f

    :goto_0
    return p0
.end method

.method static render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;
    .locals 20

    .line 90
    move-object/from16 v13, p0

    move/from16 v14, p1

    move-object/from16 v15, p2

    move/from16 v12, p6

    const-string v0, "CalendarAgenda"

    invoke-virtual {v0, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v16

    const-string v0, "CalendarCombined"

    invoke-virtual {v0, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    const/4 v1, 0x1

    if-nez v16, :cond_0

    const-string v2, "CalendarSplit"

    invoke-virtual {v2, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_0

    const/4 v11, 0x0

    goto :goto_0

    :cond_0
    move v11, v1

    .line 91
    :goto_0
    if-nez p4, :cond_1

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v2

    move-object v10, v2

    goto :goto_1

    :cond_1
    move-object/from16 v10, p4

    .line 92
    :goto_1
    if-eqz v17, :cond_2

    const-string v2, "widget_split_compact_v184"

    goto :goto_2

    :cond_2
    if-eqz v16, :cond_3

    const-string v2, "widget_agenda_compact_v184"

    goto :goto_2

    :cond_3
    const-string v2, "widget_month_compact_v184"

    :goto_2
    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v9

    .line 93
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "widget_bg_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "system"

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_5

    invoke-static {v13, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_4

    const-string v3, "midnight"

    goto :goto_3

    :cond_4
    const-string v3, "aurora"

    goto :goto_3

    :cond_5
    move-object v3, v10

    :goto_3
    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    .line 94
    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-nez v2, :cond_6

    const-string v2, "widget_bg_aurora"

    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    .line 95
    :cond_6
    const-string v3, "widget_background"

    invoke-static {v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v9, v4, v2}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    invoke-static {v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    move/from16 v6, p5

    invoke-static {v13, v14, v6}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->opacity(Landroid/content/Context;II)I

    move-result v3

    mul-int/lit16 v3, v3, 0xff

    int-to-float v3, v3

    const/high16 v4, 0x42c80000    # 100.0f

    div-float/2addr v3, v4

    invoke-static {v3}, Ljava/lang/Math;->round(F)I

    move-result v3

    const-string v4, "setImageAlpha"

    invoke-virtual {v9, v2, v4, v3}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 96
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v8

    invoke-static/range {p0 .. p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->calendarStart(Landroid/content/Context;ILjava/lang/String;)Ljava/util/Calendar;

    move-result-object v2

    invoke-static/range {p0 .. p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->selectedDay(Landroid/content/Context;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 97
    const-string v4, "\uc77c\uc815 \u00b7 \ud22c\ub450"

    const/4 v5, 0x2

    if-eqz v16, :cond_7

    move-object/from16 p4, v4

    move-object/from16 v0, p4

    const/16 v18, 0x0

    goto :goto_4

    :cond_7
    new-instance v7, Ljava/lang/StringBuilder;

    invoke-virtual {v2, v1}, Ljava/util/Calendar;->get(I)I

    move-result v18

    invoke-static/range {v18 .. v18}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v0

    invoke-direct {v7, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v0, ". "

    invoke-virtual {v7, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    sget-object v7, Ljava/util/Locale;->US:Ljava/util/Locale;

    move-object/from16 p4, v4

    new-array v4, v1, [Ljava/lang/Object;

    invoke-virtual {v2, v5}, Ljava/util/Calendar;->get(I)I

    move-result v18

    add-int/lit8 v18, v18, 0x1

    invoke-static/range {v18 .. v18}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v1

    const/16 v18, 0x0

    aput-object v1, v4, v18

    const-string v1, "%02d"

    invoke-static {v7, v1, v4}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 98
    :goto_4
    const-string v1, "CalendarFortnight"

    invoke-virtual {v1, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    const/4 v7, 0x5

    if-eqz v4, :cond_8

    invoke-virtual {v2}, Ljava/util/Calendar;->clone()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/Calendar;

    const/16 v4, 0xd

    invoke-virtual {v0, v7, v4}, Ljava/util/Calendar;->add(II)V

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v4, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " \u2014 "

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 99
    :cond_8
    const-string v2, "widget_title"

    invoke-static {v13, v9, v2, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v16, :cond_9

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "\ubd80\ud130"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    goto :goto_5

    :cond_9
    if-eqz v17, :cond_a

    const-string v4, "\ub2e4\uac00\uc624\ub294 \uc77c\uc815"

    goto :goto_5

    :cond_a
    invoke-virtual {v1, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_b

    const-string v4, "2\uc8fc"

    goto :goto_5

    :cond_b
    if-eqz v11, :cond_c

    move-object/from16 v4, p4

    goto :goto_5

    :cond_c
    const-string v4, "\uc77c\uc815"

    :goto_5
    const-string v1, "w184_caption"

    invoke-static {v13, v9, v1, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 100
    const-string v3, "widget_previous"

    const-string v4, "widget_next"

    const-string v5, "w184_today"

    filled-new-array {v2, v1, v3, v4, v5}, [Ljava/lang/String;

    move-result-object v19

    move/from16 v6, v18

    :goto_6
    if-lt v6, v7, :cond_17

    .line 101
    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const/high16 v6, 0x41500000    # 13.0f

    invoke-static {v13, v14, v12, v6}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v6

    const/4 v7, 0x2

    invoke-virtual {v9, v2, v7, v6}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 102
    invoke-static {v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/high16 v2, 0x41080000    # 8.5f

    const/high16 v6, 0x41100000    # 9.0f

    invoke-static {v13, v14, v12, v6}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v6

    invoke-static {v2, v6}, Ljava/lang/Math;->max(FF)F

    move-result v2

    invoke-virtual {v9, v1, v7, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 103
    const-string v1, "widget_root"

    invoke-static {v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v6, ""

    invoke-static {v13, v14, v15, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v6

    invoke-virtual {v9, v2, v6}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 104
    invoke-static {v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v3, "month"

    const-string v6, "-1"

    invoke-static {v13, v14, v15, v3, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v6

    invoke-virtual {v9, v2, v6}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-static {v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v4, "1"

    invoke-static {v13, v14, v15, v3, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v3

    invoke-virtual {v9, v2, v3}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 105
    invoke-static {v13, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v3, "today"

    const-string v4, "0"

    invoke-static {v13, v14, v15, v3, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v3

    invoke-virtual {v9, v2, v3}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 106
    invoke-static {v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-static {v0}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {v2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v0, " "

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    if-eqz v17, :cond_d

    const-string v2, "\uc67c\ucabd \uc6d4\uac04 \uce98\ub9b0\ub354, \uc624\ub978\ucabd \ub2e4\uac00\uc624\ub294 \uc77c\uc815"

    goto :goto_7

    :cond_d
    if-eqz v16, :cond_e

    const-string v2, "\ub2e4\uac00\uc624\ub294 \uc77c\uc815\uacfc \ubbf8\uc644\ub8cc \ud560 \uc77c"

    goto :goto_7

    :cond_e
    if-eqz v11, :cond_f

    const-string v2, "\uc77c\uc815\uc774 \ud45c\uc2dc\ub41c \uc6d4\uac04 \uce98\ub9b0\ub354\uc640 \ubbf8\uc644\ub8cc \ud560 \uc77c"

    goto :goto_7

    :cond_f
    const-string v2, "\uc77c\uc815\uc774 \ud45c\uc2dc\ub41c \uce98\ub9b0\ub354"

    :goto_7
    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v9, v1, v0}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    .line 107
    if-nez v16, :cond_10

    move-object/from16 v0, p0

    move-object v1, v9

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object v4, v8

    move-object v5, v10

    move/from16 v6, p5

    const/16 v18, 0x5

    move/from16 v7, p6

    invoke-static/range {v0 .. v7}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->calendar(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;II)V

    goto :goto_8

    :cond_10
    const/16 v18, 0x5

    .line 108
    :goto_8
    if-nez v17, :cond_12

    if-eqz v16, :cond_11

    goto :goto_9

    :cond_11
    move-object/from16 p4, v8

    move-object v15, v9

    move-object/from16 p5, v10

    move v14, v11

    goto :goto_b

    :cond_12
    :goto_9
    invoke-static {v13, v14, v15, v8}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v4

    if-eqz v17, :cond_13

    move/from16 v19, v18

    goto :goto_a

    :cond_13
    const/4 v0, 0x6

    move/from16 v19, v0

    :goto_a
    const-string v5, "widget_items_v164"

    const-string v6, "widget_preview_rows_v164"

    const-string v7, "w184_event_empty"

    move-object/from16 v0, p0

    move-object v1, v9

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object/from16 p4, v8

    move/from16 v8, p3

    move-object v15, v9

    move-object v9, v10

    move-object v14, v10

    move/from16 v10, p6

    move-object/from16 p5, v14

    move v14, v11

    move/from16 v11, v19

    move-object/from16 v12, p4

    invoke-static/range {v0 .. v12}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->bind(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;IILorg/json/JSONObject;)V

    .line 109
    :goto_b
    if-nez v17, :cond_14

    if-nez v16, :cond_14

    const-string v0, "w184_todo_panel"

    invoke-static {v13, v15, v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 110
    :cond_14
    if-eqz v14, :cond_16

    .line 111
    move-object/from16 v2, p5

    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "w184_todo_heading"

    invoke-static {v13, v15, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 112
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static/range {p2 .. p2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "@todos"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static/range {p2 .. p2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v0, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    move/from16 v8, p1

    move-object/from16 v12, p4

    move-object v9, v2

    invoke-static {v13, v8, v0, v12}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v4

    if-eqz v16, :cond_15

    move/from16 v11, v18

    goto :goto_c

    :cond_15
    const/4 v0, 0x4

    move v11, v0

    :goto_c
    const-string v5, "w165_secondary_list"

    const-string v6, "w181_todo_preview"

    const-string v7, "w184_todo_empty"

    move-object/from16 v0, p0

    move-object v1, v15

    move/from16 v2, p1

    move/from16 v8, p3

    move/from16 v10, p6

    invoke-static/range {v0 .. v12}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->bind(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;IILorg/json/JSONObject;)V

    .line 114
    :cond_16
    return-object v15

    .line 100
    :cond_17
    move/from16 v18, v7

    move-object v12, v8

    move-object v15, v9

    move-object v9, v10

    move v8, v14

    const/4 v7, 0x2

    move v14, v11

    aget-object v10, v19, v6

    invoke-static {v13, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v11

    invoke-static {v13, v15, v10, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v6, v6, 0x1

    move-object v10, v9

    move v11, v14

    move-object v9, v15

    move/from16 v7, v18

    move-object/from16 v15, p2

    move v14, v8

    move-object v8, v12

    move/from16 v12, p6

    goto/16 :goto_6
.end method

.method static row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 16

    move-object/from16 v1, p0

    move/from16 v2, p1

    move/from16 v7, p6

    .line 168
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    move-object/from16 v3, p3

    invoke-direct {v0, v3}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    :goto_0
    move-object v4, v0

    .line 169
    if-nez p5, :cond_0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    move-object v6, v0

    goto :goto_1

    :cond_0
    move-object/from16 v6, p5

    :goto_1
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v5

    .line 170
    const-string v0, "_widgetOwnerV181"

    invoke-virtual {v4, v0}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v3

    const-string v8, "widget_upcoming_row_v184"

    const-string v9, "w184_row"

    if-eqz v3, :cond_1

    invoke-virtual {v4, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0, v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->sameOwner(Ljava/lang/String;Lorg/json/JSONObject;)Z

    move-result v0

    if-nez v0, :cond_1

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v2, 0x4

    invoke-virtual {v0, v1, v2}, Landroid/widget/RemoteViews;->setViewVisibility(II)V

    return-object v0

    .line 171
    :cond_1
    const-string v0, "@todos"

    move-object/from16 v3, p2

    invoke-virtual {v3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_2

    const/4 v8, 0x0

    move-object/from16 v1, p0

    move/from16 v2, p1

    move-object/from16 v3, p2

    move/from16 v7, p6

    invoke-static/range {v1 .. v8}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->todo(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;Lorg/json/JSONObject;Ljava/lang/String;IZ)Landroid/widget/RemoteViews;

    move-result-object v0

    return-object v0

    .line 172
    :cond_2
    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v0

    const-string v3, "date"

    invoke-virtual {v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v8, "selectedDate"

    invoke-virtual {v4, v8, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 173
    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    const-string v10, "w184_event_date"

    invoke-static {v1, v0, v10, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v8, "title"

    invoke-virtual {v4, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    const-string v12, "w184_event_title"

    invoke-static {v1, v0, v12, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/String;->isEmpty()Z

    move-result v11

    if-eqz v11, :cond_3

    const-string v11, "\uc885\uc77c"

    goto :goto_2

    :cond_3
    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v11

    :goto_2
    const-string v13, "w184_event_time"

    invoke-static {v1, v0, v13, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 174
    const/4 v11, 0x3

    filled-new-array {v10, v12, v13}, [Ljava/lang/String;

    move-result-object v14

    const/4 v15, 0x0

    :goto_3
    if-lt v15, v11, :cond_4

    .line 175
    invoke-static {v1, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    const/high16 v11, 0x41400000    # 12.0f

    invoke-static {v1, v2, v7, v11}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v11

    const/4 v12, 0x2

    invoke-virtual {v0, v6, v12, v11}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 176
    invoke-static {v1, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    const/high16 v10, 0x41200000    # 10.0f

    invoke-static {v1, v2, v7, v10}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v11

    invoke-virtual {v0, v6, v12, v11}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    invoke-static {v1, v2, v7, v10}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v2

    invoke-virtual {v0, v6, v12, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 177
    const-string v2, "w184_event_mark"

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventColor(Lorg/json/JSONObject;)I

    move-result v6

    const-string v7, "setBackgroundColor"

    invoke-virtual {v0, v2, v7, v6}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 178
    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v2

    const-string v5, "uid"

    invoke-static {v4, v5, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    new-instance v5, Landroid/content/Intent;

    invoke-direct {v5}, Landroid/content/Intent;-><init>()V

    const-string v6, "widgetRow"

    move/from16 v7, p4

    invoke-virtual {v5, v6, v7}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    move-result-object v5

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "open-schedule-item-v168:"

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-static {v7}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    const-string v7, "action"

    invoke-virtual {v5, v7, v6}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v5

    invoke-virtual {v0, v2, v5}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 179
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, " "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v4, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v1, v2}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    return-object v0

    .line 174
    :cond_4
    aget-object v11, v14, v15

    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v1, v0, v11, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v15, v15, 0x1

    move/from16 v2, p1

    const/4 v11, 0x3

    goto/16 :goto_3
.end method

.method static rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;
    .locals 1
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

    .line 65
    const-string v0, "@todos"

    invoke-virtual {p2, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_0

    const/4 p0, 0x0

    invoke-static {p3, p0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->incompleteRows(Lorg/json/JSONObject;Z)Ljava/util/List;

    move-result-object p0

    goto :goto_0

    :cond_0
    const-string v0, "scheduleItems"

    invoke-virtual {p3, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {p0, p1, p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->selectedDay(Landroid/content/Context;ILjava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-static {v0, p0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->upcomingRows(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object p0

    .line 66
    :goto_0
    invoke-static {p3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object p1

    new-instance p2, Ljava/util/ArrayList;

    invoke-direct {p2}, Ljava/util/ArrayList;-><init>()V

    .line 67
    invoke-interface {p0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object p0

    :goto_1
    invoke-interface {p0}, Ljava/util/Iterator;->hasNext()Z

    move-result p3

    if-nez p3, :cond_1

    .line 68
    return-object p2

    .line 67
    :cond_1
    invoke-interface {p0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object p3

    check-cast p3, Ljava/lang/String;

    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0, p3}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    const-string p3, "_widgetOwnerV181"

    invoke-static {v0, p3, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-virtual {v0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p3

    invoke-interface {p2, p3}, Ljava/util/List;->add(Ljava/lang/Object;)Z
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_2

    :catch_0
    move-exception p3

    :goto_2
    goto :goto_1
.end method

.method static sameOwner(Ljava/lang/String;Lorg/json/JSONObject;)Z
    .locals 0

    .line 71
    if-eqz p0, :cond_0

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    const/4 p0, 0x0

    return p0
.end method

.method static scheduleRows(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;
    .locals 1
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

    .line 28
    const/4 v0, 0x0

    invoke-static {p0, p1, v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventRows(Lorg/json/JSONArray;Ljava/lang/String;Z)Ljava/util/List;

    move-result-object p0

    return-object p0
.end method

.method static selectedDay(Landroid/content/Context;ILjava/lang/String;)Ljava/lang/String;
    .locals 3

    .line 74
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    const-string v1, "CalendarAgenda"

    invoke-virtual {v1, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p2

    if-eqz p2, :cond_0

    const/4 p2, 0x5

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_agenda_offset_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 v1, 0x0

    invoke-interface {p0, p1, v1}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p0

    invoke-virtual {v0, p2, p0}, Ljava/util/Calendar;->add(II)V

    :cond_0
    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static shortDate(Ljava/lang/String;)Ljava/lang/String;
    .locals 3

    .line 50
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dateKey(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string p0, ""

    return-object p0

    :cond_0
    new-instance v0, Ljava/lang/StringBuilder;

    const/4 v1, 0x5

    const/4 v2, 0x7

    invoke-virtual {p0, v1, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "."

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const/16 v1, 0x8

    const/16 v2, 0xa

    invoke-virtual {p0, v1, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result p0

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static softColor(IZ)I
    .locals 1

    .line 80
    if-eqz p1, :cond_0

    const/high16 p1, 0x50000000

    goto :goto_0

    :cond_0
    const/high16 p1, 0x22000000

    :goto_0
    const v0, 0xffffff

    and-int/2addr p0, v0

    or-int/2addr p0, p1

    return p0
.end method

.method static supports(Ljava/lang/String;)Z
    .locals 1

    .line 23
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    .line 24
    const-string v0, "CalendarAgenda"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "CalendarFortnight"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "CalendarCombined"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "CalendarMonth"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "CalendarSplit"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-nez p0, :cond_0

    const/4 p0, 0x0

    return p0

    :cond_0
    const/4 p0, 0x1

    return p0
.end method

.method static time(Lorg/json/JSONObject;)Ljava/lang/String;
    .locals 2

    .line 48
    const-string v0, "time"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "allDay"

    invoke-virtual {p0, v1}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result p0

    if-nez p0, :cond_1

    const-string p0, "\\d{2}:\\d{2}.*"

    invoke-virtual {v0, p0}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result p0

    if-nez p0, :cond_0

    goto :goto_0

    :cond_0
    const/4 p0, 0x0

    const/4 v1, 0x5

    invoke-virtual {v0, p0, v1}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object p0

    goto :goto_1

    :cond_1
    :goto_0
    const-string p0, ""

    :goto_1
    return-object p0
.end method

.method static todo(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;Lorg/json/JSONObject;Ljava/lang/String;IZ)Landroid/widget/RemoteViews;
    .locals 15

    .line 182
    move-object v0, p0

    move/from16 v7, p1

    move-object/from16 v8, p3

    move-object/from16 v1, p5

    move/from16 v2, p6

    const-string v3, "widget_todo_row_v184"

    invoke-static {p0, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v9

    const-string v10, "title"

    invoke-virtual {v8, v10}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v11, "w184_todo_title"

    invoke-static {p0, v9, v11, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    invoke-static {p0, v9, v11, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 183
    invoke-static {p0, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const/high16 v4, 0x41400000    # 12.0f

    invoke-static {p0, v7, v2, v4}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v4

    const/4 v5, 0x2

    invoke-virtual {v9, v3, v5, v4}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 184
    const-string v3, "date"

    invoke-virtual {v8, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "dueDate"

    invoke-virtual {v8, v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "dueAt"

    invoke-virtual {v8, v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v4

    const/16 v6, 0xa

    if-le v4, v6, :cond_0

    const/4 v4, 0x0

    invoke-virtual {v3, v4, v6}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v3

    .line 185
    :cond_0
    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v12, "w184_todo_due"

    invoke-static {p0, v9, v12, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-static {p0, v9, v12, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dateKey(Ljava/lang/String;)Z

    move-result v3

    invoke-static {p0, v9, v12, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 186
    invoke-static {p0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const/high16 v4, 0x41200000    # 10.0f

    invoke-static {p0, v7, v2, v4}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v2

    invoke-virtual {v9, v3, v5, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 187
    const-string v2, "w184_check"

    invoke-static {p0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    const-string v1, "widget_compact_check_dark_v181"

    goto :goto_0

    :cond_1
    const-string v1, "widget_compact_check_v181"

    :goto_0
    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v3, "setBackgroundResource"

    invoke-virtual {v9, v2, v3, v1}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 188
    const-string v13, "w184_check_hit"

    invoke-static {p0, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v14

    const-string v5, "todo"

    const-string v6, "true"

    move-object/from16 v1, p4

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object/from16 v4, p3

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v9, v14, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {p0, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v11

    const-string v5, "open"

    const-string v6, "todo"

    move-object/from16 v1, p4

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v9, v11, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {p0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v11

    const-string v5, "open"

    const-string v6, "todo"

    move-object/from16 v1, p4

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v9, v11, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 189
    invoke-static {p0, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual {v8, v10}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " \uc644\ub8cc"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v9, v0, v1}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    return-object v9
.end method

.method static upcomingRows(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;
    .locals 1
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

    .line 29
    const/4 v0, 0x1

    invoke-static {p0, p1, v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventRows(Lorg/json/JSONArray;Ljava/lang/String;Z)Ljava/util/List;

    move-result-object p0

    return-object p0
.end method
