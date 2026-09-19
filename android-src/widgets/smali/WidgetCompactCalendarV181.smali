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

    .line 123
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

    .line 124
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

    .line 125
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

    .line 126
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

    .line 127
    :goto_5
    return-void
.end method

.method static calendar(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;II)V
    .locals 50

    .line 129
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

    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v11

    .line 130
    invoke-static {v1, v3, v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->calendarStart(Landroid/content/Context;ILjava/lang/String;)Ljava/util/Calendar;

    move-result-object v12

    const/4 v13, 0x2

    invoke-virtual {v12, v13}, Ljava/util/Calendar;->get(I)I

    move-result v14

    const/4 v15, 0x7

    const/4 v13, 0x1

    if-eqz v10, :cond_0

    const/4 v13, 0x5

    const/16 v19, 0x2

    goto :goto_0

    :cond_0
    invoke-virtual {v12, v15}, Ljava/util/Calendar;->get(I)I

    move-result v0

    sub-int/2addr v0, v13

    const/4 v13, 0x5

    invoke-virtual {v12, v13}, Ljava/util/Calendar;->getActualMaximum(I)I

    move-result v17

    add-int v0, v0, v17

    const/16 v16, 0x6

    add-int/lit8 v0, v0, 0x6

    div-int/2addr v0, v15

    move/from16 v19, v0

    .line 131
    :goto_0
    if-nez v10, :cond_1

    invoke-virtual {v12, v15}, Ljava/util/Calendar;->get(I)I

    move-result v0

    const/16 v17, 0x1

    rsub-int/lit8 v0, v0, 0x1

    invoke-virtual {v12, v13, v0}, Ljava/util/Calendar;->add(II)V

    .line 132
    :cond_1
    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v0

    invoke-virtual {v0}, Landroid/util/SizeF;->getWidth()F

    move-result v0

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v13

    invoke-virtual {v13}, Landroid/util/SizeF;->getHeight()F

    move-result v13

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->small(FF)Z

    move-result v20

    .line 133
    const-string v15, "widget_calendar_v164"

    move-object/from16 v22, v8

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    invoke-virtual {v2, v8}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    if-eqz v20, :cond_2

    const-string v8, "widget_weekdays_small_v185"

    goto :goto_1

    :cond_2
    const-string v8, "widget_weekdays_compact_v184"

    :goto_1
    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v8

    const-string v23, "\uc77c"

    const-string v24, "\uc6d4"

    const-string v25, "\ud654"

    const-string v26, "\uc218"

    const-string v27, "\ubaa9"

    const-string v28, "\uae08"

    const-string v29, "\ud1a0"

    filled-new-array/range {v23 .. v29}, [Ljava/lang/String;

    move-result-object v23

    .line 134
    const/16 v24, 0x0

    move/from16 v6, v24

    :goto_2
    const v25, -0x4d3b0f

    const v26, -0x9f7f44

    const v27, -0x1c4b3b

    const v28, -0x559f89

    move/from16 v29, v11

    const/4 v11, 0x7

    if-lt v6, v11, :cond_2b

    .line 135
    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    invoke-virtual {v2, v6, v8}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 136
    move/from16 v6, v19

    invoke-static {v4, v0, v13, v6}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->cellHeight(Ljava/lang/String;FFI)F

    move-result v11

    .line 137
    const/high16 v8, 0x43fa0000    # 500.0f

    cmpl-float v0, v0, v8

    const/high16 v19, 0x41380000    # 11.5f

    if-ltz v0, :cond_3

    move/from16 v0, v19

    goto :goto_3

    :cond_3
    if-eqz v20, :cond_4

    const/high16 v0, 0x41100000    # 9.0f

    goto :goto_3

    :cond_4
    const/high16 v0, 0x41200000    # 10.0f

    .line 138
    :goto_3
    invoke-static {v1, v3, v7, v0}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v0

    const/high16 v8, 0x41100000    # 9.0f

    invoke-static {v8, v0}, Ljava/lang/Math;->max(FF)F

    move-result v8

    .line 139
    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v13

    invoke-virtual {v13}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v13

    iget v13, v13, Landroid/util/DisplayMetrics;->scaledDensity:F

    const v0, 0x3dcccccd    # 0.1f

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v30

    invoke-virtual/range {v30 .. v30}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v4

    iget v4, v4, Landroid/util/DisplayMetrics;->density:F

    invoke-static {v0, v4}, Ljava/lang/Math;->max(FF)F

    move-result v0

    div-float/2addr v13, v0

    const/high16 v0, 0x3f800000    # 1.0f

    invoke-static {v0, v13}, Ljava/lang/Math;->max(FF)F

    move-result v4

    .line 140
    const-string v0, "scheduleItems"

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v13

    const-string v0, "holidays"

    move/from16 v31, v4

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v4

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v5

    .line 141
    move/from16 v23, v8

    move/from16 v8, v24

    :goto_4
    if-lt v8, v6, :cond_5

    .line 174
    return-void

    .line 142
    :cond_5
    const-string v0, "widget_week_v164"

    move/from16 v32, v6

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v6

    .line 143
    move/from16 v33, v11

    move/from16 v11, v24

    :goto_5
    const/4 v3, 0x7

    if-lt v11, v3, :cond_6

    .line 172
    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v2, v0, v6}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    .line 141
    add-int/lit8 v8, v8, 0x1

    move/from16 v3, p2

    move/from16 v6, v32

    move/from16 v11, v33

    goto :goto_4

    .line 144
    :cond_6
    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v3

    const-string v34, ""

    if-nez v4, :cond_7

    move-object/from16 v35, v34

    goto :goto_6

    :cond_7
    invoke-virtual {v4, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    move-object/from16 v35, v0

    :goto_6
    invoke-static {v13, v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->scheduleRows(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v2

    if-nez v10, :cond_8

    move-object/from16 v36, v4

    const/4 v4, 0x2

    invoke-virtual {v12, v4}, Ljava/util/Calendar;->get(I)I

    move-result v0

    if-eq v0, v14, :cond_9

    const/4 v0, 0x1

    goto :goto_7

    :cond_8
    move-object/from16 v36, v4

    :cond_9
    move/from16 v0, v24

    .line 145
    :goto_7
    if-eqz v9, :cond_b

    if-eqz v20, :cond_a

    const-string v4, "widget_mini_day_small_v185"

    goto :goto_8

    :cond_a
    const-string v4, "widget_mini_day_v184"

    goto :goto_8

    :cond_b
    if-eqz v20, :cond_c

    const-string v4, "widget_event_day_small_v185"

    goto :goto_8

    :cond_c
    const-string v4, "widget_event_day_v184"

    :goto_8
    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v4

    move/from16 v37, v8

    const/4 v8, 0x5

    invoke-virtual {v12, v8}, Ljava/util/Calendar;->get(I)I

    move-result v30

    invoke-static/range {v30 .. v30}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v8

    move-object/from16 v30, v13

    const-string v13, "w184_day"

    invoke-static {v1, v4, v13, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 146
    if-eqz v0, :cond_e

    if-eqz v29, :cond_d

    const v0, -0x6c7458

    goto :goto_9

    :cond_d
    const v0, -0x565d4b

    :goto_9
    move-object/from16 v8, p5

    :goto_a
    move/from16 v38, v14

    move v14, v0

    goto :goto_c

    :cond_e
    invoke-virtual/range {v35 .. v35}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_12

    if-nez v11, :cond_f

    move-object/from16 v8, p5

    goto :goto_b

    :cond_f
    const/4 v8, 0x6

    if-ne v11, v8, :cond_11

    move-object/from16 v8, p5

    move/from16 v38, v14

    if-eqz v29, :cond_10

    move/from16 v14, v25

    goto :goto_c

    :cond_10
    move/from16 v14, v26

    goto :goto_c

    :cond_11
    move-object/from16 v8, p5

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    goto :goto_a

    :cond_12
    move-object/from16 v8, p5

    :goto_b
    move/from16 v38, v14

    if-eqz v29, :cond_13

    move/from16 v14, v27

    goto :goto_c

    :cond_13
    move/from16 v14, v28

    .line 147
    :goto_c
    invoke-virtual {v3, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_14

    const/4 v0, -0x1

    goto :goto_d

    :cond_14
    move v0, v14

    :goto_d
    invoke-static {v1, v4, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v3, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v39

    if-eqz v39, :cond_15

    const-string v39, "widget_today_compact_v184"

    goto :goto_e

    :cond_15
    const-string v39, "widget_day_clear_v164"

    :goto_e
    move-object/from16 v40, v15

    move-object/from16 v15, v39

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    const-string v8, "setBackgroundResource"

    invoke-virtual {v4, v0, v8, v15}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 148
    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    if-eqz v20, :cond_16

    const/high16 v8, 0x41080000    # 8.5f

    goto :goto_f

    :cond_16
    if-eqz v9, :cond_17

    move/from16 v8, v19

    goto :goto_f

    :cond_17
    const/high16 v8, 0x41300000    # 11.0f

    :goto_f
    move/from16 v15, p2

    const/16 v21, 0x7

    invoke-static {v1, v15, v7, v8}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v8

    move/from16 v39, v11

    const/4 v11, 0x2

    invoke-virtual {v4, v0, v11, v8}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 149
    const-string v8, " "

    if-eqz v9, :cond_1e

    const/high16 v0, 0x41980000    # 19.0f

    cmpl-float v0, v33, v0

    if-ltz v0, :cond_18

    const/4 v0, 0x1

    goto :goto_10

    :cond_18
    move/from16 v0, v24

    :goto_10
    invoke-interface {v2}, Ljava/util/List;->isEmpty()Z

    move-result v11

    if-eqz v11, :cond_19

    move-object/from16 v11, v34

    goto :goto_11

    :cond_19
    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v11

    const/4 v14, 0x1

    if-le v11, v14, :cond_1a

    const-string v11, "\u2022\u2022"

    goto :goto_11

    :cond_1a
    const-string v11, "\u2022"

    :goto_11
    const-string v14, "w184_dots"

    invoke-static {v1, v4, v14, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1, v4, v14, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    if-nez v0, :cond_1c

    invoke-interface {v2}, Ljava/util/List;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_1c

    invoke-virtual {v3, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1c

    if-eqz v29, :cond_1b

    const v0, -0x3e4501

    goto :goto_12

    :cond_1b
    const v0, -0x9daa18

    :goto_12
    invoke-static {v1, v4, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    :cond_1c
    if-eqz v29, :cond_1d

    const v0, -0x3e4501

    goto :goto_13

    :cond_1d
    const v0, -0x9daa18

    :goto_13
    invoke-static {v1, v4, v14, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v41, v5

    move/from16 v42, v9

    move/from16 v43, v10

    move/from16 v11, v33

    move-object/from16 v5, v35

    move-object/from16 v35, v6

    goto/16 :goto_1e

    .line 151
    :cond_1e
    const-string v0, "w184_cell_background"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    if-eqz v29, :cond_1f

    const-string v11, "widget_compact_grid_dark_v181"

    goto :goto_14

    :cond_1f
    const-string v11, "widget_compact_grid_v181"

    :goto_14
    invoke-static {v1, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v11

    invoke-virtual {v4, v0, v11}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 152
    const-string v0, "w184_cell_background"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    move/from16 v11, p6

    move-object/from16 v41, v5

    invoke-static {v1, v15, v11}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->opacity(Landroid/content/Context;II)I

    move-result v5

    mul-int/lit16 v5, v5, 0xff

    int-to-float v5, v5

    const/high16 v42, 0x42c80000    # 100.0f

    div-float v5, v5, v42

    invoke-static {v5}, Ljava/lang/Math;->round(F)I

    move-result v5

    move/from16 v42, v9

    const-string v9, "setImageAlpha"

    invoke-virtual {v4, v0, v9, v5}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 153
    const-string v0, "w184_holiday"

    move-object/from16 v5, v35

    invoke-static {v1, v4, v0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1, v4, v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-virtual {v5}, Ljava/lang/String;->isEmpty()Z

    move-result v9

    if-nez v9, :cond_20

    const/high16 v9, 0x42340000    # 45.0f

    cmpl-float v9, v33, v9

    if-ltz v9, :cond_20

    const/4 v9, 0x1

    goto :goto_15

    :cond_20
    move/from16 v9, v24

    :goto_15
    invoke-static {v1, v4, v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 154
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/high16 v9, 0x41000000    # 8.0f

    move-object/from16 v35, v6

    const/high16 v11, 0x41080000    # 8.5f

    invoke-static {v1, v15, v7, v11}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v6

    invoke-static {v9, v6}, Ljava/lang/Math;->max(FF)F

    move-result v6

    const/4 v9, 0x2

    invoke-virtual {v4, v0, v9, v6}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 155
    if-eqz v10, :cond_21

    const/high16 v0, 0x42980000    # 76.0f

    cmpl-float v0, v33, v0

    if-ltz v0, :cond_21

    const/4 v6, 0x1

    goto :goto_16

    :cond_21
    move/from16 v6, v24

    .line 156
    :goto_16
    const-string v0, "w184_events"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v4, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    mul-float v0, v23, v31

    if-eqz v6, :cond_22

    const v9, 0x4019999a    # 2.4f

    goto :goto_17

    :cond_22
    const v9, 0x3f99999a    # 1.2f

    :goto_17
    mul-float/2addr v0, v9

    const/high16 v9, 0x40800000    # 4.0f

    add-float/2addr v0, v9

    invoke-virtual {v5}, Ljava/lang/String;->isEmpty()Z

    move-result v9

    if-nez v9, :cond_23

    const/high16 v9, 0x42340000    # 45.0f

    cmpl-float v9, v33, v9

    if-ltz v9, :cond_23

    const/4 v9, 0x1

    goto :goto_18

    :cond_23
    move/from16 v9, v24

    :goto_18
    move/from16 v11, v33

    invoke-static {v11, v0, v9}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->capacity(FFZ)I

    move-result v9

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    invoke-static {v9, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    .line 157
    if-nez v9, :cond_24

    invoke-interface {v2}, Ljava/util/List;->isEmpty()Z

    move-result v33

    if-nez v33, :cond_24

    move/from16 v33, v0

    new-instance v0, Ljava/lang/StringBuilder;

    move/from16 v43, v10

    const/4 v10, 0x5

    invoke-virtual {v12, v10}, Ljava/util/Calendar;->get(I)I

    move-result v44

    invoke-static/range {v44 .. v44}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v10

    invoke-direct {v0, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v10, "\u00b7"

    invoke-virtual {v0, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v1, v4, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_19

    :cond_24
    move/from16 v33, v0

    move/from16 v43, v10

    .line 159
    :goto_19
    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    if-le v0, v9, :cond_25

    const/4 v10, 0x1

    if-le v9, v10, :cond_25

    add-int/lit8 v0, v9, -0x1

    move v10, v0

    goto :goto_1a

    .line 160
    :cond_25
    move/from16 v10, v33

    :goto_1a
    move/from16 v13, v24

    :goto_1b
    if-lt v13, v10, :cond_29

    .line 167
    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    if-le v0, v10, :cond_26

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v6, "+"

    invoke-direct {v0, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v6

    sub-int/2addr v6, v10

    invoke-virtual {v0, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_1c

    :cond_26
    move-object/from16 v0, v34

    :goto_1c
    const-string v6, "w184_more"

    invoke-static {v1, v4, v6, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v0

    if-le v0, v10, :cond_27

    const/4 v10, 0x1

    if-le v9, v10, :cond_27

    const/4 v0, 0x1

    goto :goto_1d

    :cond_27
    move/from16 v0, v24

    :goto_1d
    invoke-static {v1, v4, v6, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v1, v4, v6, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 169
    :goto_1e
    const-string v0, "w184_cell"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v9

    invoke-direct {v6, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5}, Ljava/lang/String;->isEmpty()Z

    move-result v9

    if-eqz v9, :cond_28

    goto :goto_1f

    :cond_28
    new-instance v9, Ljava/lang/StringBuilder;

    invoke-direct {v9, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v9, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v34

    :goto_1f
    move-object/from16 v5, v34

    invoke-virtual {v6, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, " \uc77c\uc815 "

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-interface {v2}, Ljava/util/List;->size()I

    move-result v2

    invoke-virtual {v5, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v5, "\uac1c"

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v4, v0, v2}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    .line 170
    const-string v0, "w184_cell"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v5, "open-schedule-date-v168:"

    invoke-direct {v2, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    move-object/from16 v3, p3

    invoke-static {v1, v15, v3, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v2

    invoke-virtual {v4, v0, v2}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    const-string v0, "widget_week_cells_v164"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    move-object/from16 v2, v35

    invoke-virtual {v2, v0, v4}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    const/4 v4, 0x5

    const/4 v5, 0x1

    invoke-virtual {v12, v4, v5}, Ljava/util/Calendar;->add(II)V

    .line 143
    add-int/lit8 v0, v39, 0x1

    move-object v6, v2

    move/from16 v33, v11

    move v3, v15

    move-object/from16 v13, v30

    move-object/from16 v4, v36

    move/from16 v8, v37

    move/from16 v14, v38

    move-object/from16 v15, v40

    move-object/from16 v5, v41

    move/from16 v9, v42

    move/from16 v10, v43

    move-object/from16 v2, p1

    move v11, v0

    goto/16 :goto_5

    .line 161
    :cond_29
    move-object/from16 v17, v5

    move-object/from16 v18, v35

    const/16 v33, 0x5

    const/16 v35, 0x1

    move-object/from16 v5, p3

    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    invoke-interface {v2, v13}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v44
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_7

    move-object/from16 v45, v2

    :try_start_1
    move-object/from16 v2, v44

    check-cast v2, Ljava/lang/String;

    invoke-direct {v0, v2}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    if-eqz v6, :cond_2a

    const-string v2, "widget_event_chip_tall_v184"

    goto :goto_20

    :cond_2a
    const-string v2, "widget_event_chip_v184"

    :goto_20
    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v2
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_6

    move/from16 v44, v6

    :try_start_2
    const-string v6, "title"

    invoke-virtual {v0, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_5

    move/from16 v46, v9

    move-object/from16 v9, v22

    :try_start_3
    invoke-static {v1, v2, v9, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_4

    move-object/from16 v6, p5

    move/from16 v22, v10

    :try_start_4
    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

    invoke-static {v1, v2, v9, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 162
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_3

    move/from16 v47, v11

    move-object/from16 v48, v12

    move/from16 v11, v23

    const/4 v12, 0x2

    :try_start_5
    invoke-virtual {v2, v10, v12, v11}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

    const-string v12, "setBackgroundColor"
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_2

    move/from16 v23, v11

    :try_start_6
    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventColor(Lorg/json/JSONObject;)I

    move-result v11
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_1

    move/from16 v49, v14

    move/from16 v14, v29

    :try_start_7
    invoke-static {v11, v14}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->softColor(IZ)I

    move-result v11

    invoke-virtual {v2, v10, v12, v11}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 163
    const-string v10, "uid"

    invoke-static/range {p4 .. p4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v11

    invoke-static {v0, v10, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v10, "selectedDate"

    invoke-static {v0, v10, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    .line 164
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

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

    invoke-static {v1, v15, v5, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v11

    invoke-virtual {v2, v10, v11}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 165
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

    new-instance v11, Ljava/lang/StringBuilder;

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v12

    invoke-direct {v11, v12}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v11, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, "title"

    invoke-virtual {v0, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v11, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v10, v0}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    const-string v0, "w184_events"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v4, v0, v2}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V
    :try_end_7
    .catch Ljava/lang/Exception; {:try_start_7 .. :try_end_7} :catch_0

    goto :goto_25

    .line 166
    :catch_0
    move-exception v0

    goto :goto_25

    :catch_1
    move-exception v0

    goto :goto_22

    :catch_2
    move-exception v0

    move/from16 v23, v11

    goto :goto_22

    :catch_3
    move-exception v0

    goto :goto_21

    :catch_4
    move-exception v0

    move-object/from16 v6, p5

    move/from16 v22, v10

    :goto_21
    move/from16 v47, v11

    move-object/from16 v48, v12

    :goto_22
    move/from16 v49, v14

    move/from16 v14, v29

    goto :goto_25

    :catch_5
    move-exception v0

    move-object/from16 v6, p5

    move/from16 v46, v9

    move/from16 v47, v11

    move-object/from16 v48, v12

    move/from16 v49, v14

    move-object/from16 v9, v22

    move/from16 v14, v29

    goto :goto_24

    :catch_6
    move-exception v0

    goto :goto_23

    :catch_7
    move-exception v0

    move-object/from16 v45, v2

    :goto_23
    move/from16 v44, v6

    move/from16 v46, v9

    move/from16 v47, v11

    move-object/from16 v48, v12

    move/from16 v49, v14

    move-object/from16 v9, v22

    move/from16 v14, v29

    move-object/from16 v6, p5

    :goto_24
    move/from16 v22, v10

    :goto_25
    nop

    .line 160
    add-int/lit8 v13, v13, 0x1

    move/from16 v29, v14

    move-object/from16 v5, v17

    move-object/from16 v35, v18

    move/from16 v10, v22

    move/from16 v6, v44

    move-object/from16 v2, v45

    move/from16 v11, v47

    move-object/from16 v12, v48

    move/from16 v14, v49

    move-object/from16 v22, v9

    move/from16 v9, v46

    goto/16 :goto_1b

    .line 134
    :cond_2b
    move-object v5, v4

    move-object v2, v8

    move/from16 v42, v9

    move/from16 v43, v10

    move/from16 v21, v11

    move-object/from16 v48, v12

    move/from16 v38, v14

    move-object/from16 v40, v15

    move/from16 v32, v19

    move-object/from16 v9, v22

    move/from16 v14, v29

    const/16 v33, 0x5

    const/16 v35, 0x1

    move v15, v3

    move v10, v6

    move-object/from16 v6, p5

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "widget_week_"

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    aget-object v8, v23, v10

    invoke-static {v1, v2, v3, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    if-nez v10, :cond_2d

    if-eqz v14, :cond_2c

    move/from16 v11, v27

    goto :goto_26

    :cond_2c
    move/from16 v11, v28

    :goto_26
    const/4 v8, 0x6

    goto :goto_28

    :cond_2d
    const/4 v8, 0x6

    if-ne v10, v8, :cond_2f

    if-eqz v14, :cond_2e

    goto :goto_27

    :cond_2e
    move/from16 v11, v26

    goto :goto_28

    :cond_2f
    invoke-static {v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v25

    :goto_27
    move/from16 v11, v25

    :goto_28
    invoke-static {v1, v2, v3, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const/high16 v4, 0x41100000    # 9.0f

    invoke-static {v1, v15, v7, v4}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v4

    const/high16 v11, 0x41080000    # 8.5f

    invoke-static {v11, v4}, Ljava/lang/Math;->max(FF)F

    move-result v4

    const/4 v11, 0x2

    invoke-virtual {v2, v3, v11, v4}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    add-int/lit8 v3, v10, 0x1

    move-object v8, v2

    move v6, v3

    move-object v4, v5

    move-object/from16 v22, v9

    move v11, v14

    move v3, v15

    move/from16 v19, v32

    move/from16 v14, v38

    move-object/from16 v15, v40

    move/from16 v9, v42

    move/from16 v10, v43

    move-object/from16 v12, v48

    move-object/from16 v2, p1

    move-object/from16 v5, p4

    goto/16 :goto_2
.end method

.method static calendarStart(Landroid/content/Context;ILjava/lang/String;)Ljava/util/Calendar;
    .locals 4

    .line 87
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    .line 88
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

    .line 89
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

    .line 90
    :goto_0
    return-object v0
.end method

.method static capacity(FFZ)I
    .locals 1

    .line 81
    const/high16 v0, 0x42000000    # 32.0f

    cmpg-float v0, p0, v0

    if-gez v0, :cond_0

    const/16 v0, 0xd

    goto :goto_0

    :cond_0
    const/16 v0, 0x16

    :goto_0
    int-to-float v0, v0

    sub-float/2addr p0, v0

    const/4 v0, 0x0

    if-eqz p2, :cond_1

    const/16 p2, 0xc

    goto :goto_1

    :cond_1
    move p2, v0

    :goto_1
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

    invoke-static {v0, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    return p0
.end method

.method static cellHeight(Ljava/lang/String;FFI)F
    .locals 2

    .line 83
    invoke-static {p1, p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->small(FF)Z

    move-result v0

    if-eqz v0, :cond_0

    const/16 v0, 0x20

    goto :goto_0

    :cond_0
    const/16 v0, 0x2a

    :goto_0
    int-to-float v0, v0

    sub-float v0, p2, v0

    const-string v1, "CalendarSplit"

    invoke-virtual {v1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    const/high16 v1, 0x3f800000    # 1.0f

    if-eqz p0, :cond_1

    const/high16 p0, 0x3f400000    # 0.75f

    goto :goto_1

    :cond_1
    move p0, v1

    :goto_1
    mul-float/2addr v0, p0

    invoke-static {p1, p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->small(FF)Z

    move-result p0

    if-eqz p0, :cond_2

    const/16 p0, 0xc

    goto :goto_2

    :cond_2
    const/16 p0, 0x10

    :goto_2
    int-to-float p0, p0

    sub-float/2addr v0, p0

    const/4 p0, 0x1

    invoke-static {p0, p3}, Ljava/lang/Math;->max(II)I

    move-result p0

    int-to-float p0, p0

    div-float/2addr v0, p0

    invoke-static {v1, v0}, Ljava/lang/Math;->max(FF)F

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

    .line 85
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
    .locals 26

    .line 93
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

    const/16 v18, 0x0

    if-nez v16, :cond_0

    const-string v0, "CalendarSplit"

    invoke-virtual {v0, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    move/from16 v10, v18

    goto :goto_0

    :cond_0
    const/4 v10, 0x1

    .line 94
    :goto_0
    if-nez p4, :cond_1

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    move-object v9, v0

    goto :goto_1

    :cond_1
    move-object/from16 v9, p4

    .line 95
    :goto_1
    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v0

    invoke-virtual {v0}, Landroid/util/SizeF;->getWidth()F

    move-result v0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v1

    invoke-virtual {v1}, Landroid/util/SizeF;->getHeight()F

    move-result v8

    invoke-static {v0, v8}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->small(FF)Z

    move-result v1

    .line 96
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "widget_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "month"

    if-eqz v17, :cond_2

    const-string v4, "split"

    goto :goto_2

    :cond_2
    if-eqz v16, :cond_3

    const-string v4, "agenda"

    goto :goto_2

    :cond_3
    move-object v4, v3

    :goto_2
    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    if-eqz v1, :cond_4

    const-string v4, "_small_v185"

    goto :goto_3

    :cond_4
    const-string v4, "_compact_v184"

    :goto_3
    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v7

    .line 97
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "widget_bg_"

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "system"

    invoke-virtual {v4, v9}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_6

    invoke-static {v13, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_5

    const-string v4, "midnight"

    goto :goto_4

    :cond_5
    const-string v4, "aurora"

    goto :goto_4

    :cond_6
    move-object v4, v9

    :goto_4
    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    .line 98
    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-nez v2, :cond_7

    const-string v2, "widget_bg_aurora"

    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    .line 99
    :cond_7
    const-string v4, "widget_background"

    invoke-static {v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    invoke-virtual {v7, v5, v2}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    invoke-static {v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    move/from16 v6, p5

    invoke-static {v13, v14, v6}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->opacity(Landroid/content/Context;II)I

    move-result v4

    mul-int/lit16 v4, v4, 0xff

    int-to-float v4, v4

    const/high16 v5, 0x42c80000    # 100.0f

    div-float/2addr v4, v5

    invoke-static {v4}, Ljava/lang/Math;->round(F)I

    move-result v4

    const-string v5, "setImageAlpha"

    invoke-virtual {v7, v2, v5, v4}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 100
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v5

    invoke-static/range {p0 .. p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->calendarStart(Landroid/content/Context;ILjava/lang/String;)Ljava/util/Calendar;

    move-result-object v2

    invoke-static/range {p0 .. p2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->selectedDay(Landroid/content/Context;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v4

    .line 101
    const-string v19, "\uc77c\uc815 \u00b7 \ud22c\ub450"

    if-eqz v16, :cond_8

    move-object/from16 v22, v5

    move/from16 v21, v8

    move-object/from16 v20, v9

    move-object/from16 v5, v19

    const/4 v6, 0x1

    goto :goto_5

    :cond_8
    new-instance v11, Ljava/lang/StringBuilder;

    move/from16 v21, v8

    const/4 v8, 0x1

    invoke-virtual {v2, v8}, Ljava/util/Calendar;->get(I)I

    move-result v20

    invoke-static/range {v20 .. v20}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v8

    invoke-direct {v11, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v8, ". "

    invoke-virtual {v11, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    sget-object v11, Ljava/util/Locale;->US:Ljava/util/Locale;

    move-object/from16 v20, v9

    const/4 v6, 0x1

    new-array v9, v6, [Ljava/lang/Object;

    move-object/from16 v22, v5

    const/4 v5, 0x2

    invoke-virtual {v2, v5}, Ljava/util/Calendar;->get(I)I

    move-result v23

    add-int/lit8 v23, v23, 0x1

    invoke-static/range {v23 .. v23}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v5

    aput-object v5, v9, v18

    const-string v5, "%02d"

    invoke-static {v11, v5, v9}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    .line 102
    :goto_5
    const-string v8, "CalendarFortnight"

    invoke-virtual {v8, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    const/4 v11, 0x5

    if-eqz v9, :cond_9

    invoke-virtual {v2}, Ljava/util/Calendar;->clone()Ljava/lang/Object;

    move-result-object v5

    check-cast v5, Ljava/util/Calendar;

    const/16 v9, 0xd

    invoke-virtual {v5, v11, v9}, Ljava/util/Calendar;->add(II)V

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v6, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " \u2014 "

    invoke-virtual {v6, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    goto :goto_6

    :cond_9
    const/16 v9, 0xd

    .line 103
    :goto_6
    const-string v2, "widget_title"

    invoke-static {v13, v7, v2, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v16, :cond_a

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v6, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "\ubd80\ud130"

    invoke-virtual {v6, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v19

    :goto_7
    move-object/from16 v4, v19

    goto :goto_8

    :cond_a
    if-eqz v17, :cond_b

    const-string v19, "\ub2e4\uac00\uc624\ub294 \uc77c\uc815"

    goto :goto_7

    :cond_b
    invoke-virtual {v8, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_c

    const-string v19, "2\uc8fc"

    goto :goto_7

    :cond_c
    if-eqz v10, :cond_d

    goto :goto_7

    :cond_d
    const-string v19, "\uc77c\uc815"

    goto :goto_7

    :goto_8
    const-string v6, "w184_caption"

    invoke-static {v13, v7, v6, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 104
    const/high16 v4, 0x43960000    # 300.0f

    cmpl-float v4, v0, v4

    if-ltz v4, :cond_e

    const/4 v4, 0x1

    goto :goto_9

    :cond_e
    move/from16 v4, v18

    :goto_9
    invoke-static {v13, v7, v6, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const/high16 v4, 0x43340000    # 180.0f

    cmpl-float v0, v0, v4

    if-ltz v0, :cond_f

    const/4 v4, 0x1

    goto :goto_a

    :cond_f
    move/from16 v4, v18

    :goto_a
    const-string v8, "widget_previous"

    invoke-static {v13, v7, v8, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    if-ltz v0, :cond_10

    const/4 v0, 0x1

    goto :goto_b

    :cond_10
    move/from16 v0, v18

    :goto_b
    const-string v4, "widget_next"

    invoke-static {v13, v7, v4, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 105
    const-string v0, "w184_today"

    filled-new-array {v2, v6, v8, v4, v0}, [Ljava/lang/String;

    move-result-object v19

    move/from16 v9, v18

    :goto_c
    if-lt v9, v11, :cond_1d

    .line 106
    invoke-static {v13, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-eqz v1, :cond_11

    const/16 v1, 0xb

    goto :goto_d

    :cond_11
    const/16 v1, 0xd

    :goto_d
    int-to-float v1, v1

    invoke-static {v13, v14, v12, v1}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v1

    const/4 v9, 0x2

    invoke-virtual {v7, v2, v9, v1}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 107
    invoke-static {v13, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/high16 v2, 0x41080000    # 8.5f

    const/high16 v6, 0x41100000    # 9.0f

    invoke-static {v13, v14, v12, v6}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v6

    invoke-static {v2, v6}, Ljava/lang/Math;->max(FF)F

    move-result v2

    invoke-virtual {v7, v1, v9, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 108
    const-string v1, "widget_root"

    invoke-static {v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v6, ""

    invoke-static {v13, v14, v15, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v6

    invoke-virtual {v7, v2, v6}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 109
    invoke-static {v13, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v6, "-1"

    invoke-static {v13, v14, v15, v3, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v6

    invoke-virtual {v7, v2, v6}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-static {v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v4, "1"

    invoke-static {v13, v14, v15, v3, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v3

    invoke-virtual {v7, v2, v3}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 110
    invoke-static {v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v2, "today"

    const-string v3, "0"

    invoke-static {v13, v14, v15, v2, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v2

    invoke-virtual {v7, v0, v2}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 111
    invoke-static {v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    if-eqz v17, :cond_12

    const-string v2, "\uc67c\ucabd \uc6d4\uac04 \uce98\ub9b0\ub354, \uc624\ub978\ucabd \ub2e4\uac00\uc624\ub294 \uc77c\uc815"

    goto :goto_e

    :cond_12
    if-eqz v16, :cond_13

    const-string v2, "\ub2e4\uac00\uc624\ub294 \uc77c\uc815\uacfc \ubbf8\uc644\ub8cc \ud560 \uc77c"

    goto :goto_e

    :cond_13
    if-eqz v10, :cond_14

    const-string v2, "\uc77c\uc815\uc774 \ud45c\uc2dc\ub41c \uc6d4\uac04 \uce98\ub9b0\ub354\uc640 \ubbf8\uc644\ub8cc \ud560 \uc77c"

    goto :goto_e

    :cond_14
    const-string v2, "\uc77c\uc815\uc774 \ud45c\uc2dc\ub41c \uce98\ub9b0\ub354"

    :goto_e
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v7, v0, v1}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    .line 112
    if-nez v16, :cond_15

    move-object/from16 v0, p0

    move-object v1, v7

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object/from16 v4, v22

    move-object/from16 v9, v22

    move-object/from16 v5, v20

    const/4 v8, 0x1

    move/from16 v6, p5

    move-object/from16 p4, v7

    move/from16 v7, p6

    invoke-static/range {v0 .. v7}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->calendar(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;II)V

    goto :goto_f

    :cond_15
    move-object/from16 p4, v7

    move-object/from16 v9, v22

    const/4 v8, 0x1

    .line 113
    :goto_f
    if-nez v17, :cond_17

    if-eqz v16, :cond_16

    goto :goto_10

    :cond_16
    move/from16 v24, v8

    move v15, v10

    move/from16 v22, v11

    move-object/from16 v23, v20

    move-object/from16 v20, v9

    goto :goto_12

    :cond_17
    :goto_10
    invoke-static {v13, v14, v15, v9}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v4

    if-eqz v17, :cond_18

    move/from16 v19, v11

    goto :goto_11

    :cond_18
    const/4 v0, 0x6

    move/from16 v19, v0

    :goto_11
    const-string v5, "widget_items_v164"

    const-string v6, "widget_preview_rows_v164"

    const-string v7, "w184_event_empty"

    move-object/from16 v0, p0

    move-object/from16 v1, p4

    move/from16 v2, p1

    move-object/from16 v3, p2

    move/from16 v22, v8

    move/from16 v8, p3

    move-object/from16 v23, v20

    move-object/from16 v20, v9

    move-object/from16 v9, v23

    move v15, v10

    move/from16 v10, p6

    move/from16 v24, v22

    move/from16 v22, v11

    move/from16 v11, v19

    move-object/from16 v12, v20

    invoke-static/range {v0 .. v12}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->bind(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;IILorg/json/JSONObject;)V

    .line 114
    :goto_12
    if-nez v17, :cond_19

    if-nez v16, :cond_19

    const-string v0, "w184_todo_panel"

    move-object/from16 v12, p4

    invoke-static {v13, v12, v0, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    goto :goto_13

    :cond_19
    move-object/from16 v12, p4

    .line 115
    :goto_13
    if-eqz v15, :cond_1c

    .line 116
    const/high16 v0, 0x432a0000    # 170.0f

    cmpl-float v0, v21, v0

    if-ltz v0, :cond_1a

    move/from16 v0, v24

    goto :goto_14

    :cond_1a
    move/from16 v0, v18

    :goto_14
    const-string v1, "w184_todo_heading"

    invoke-static {v13, v12, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 117
    move-object/from16 v10, v23

    invoke-static {v13, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-static {v13, v12, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 118
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

    move-result-object v2

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    move-object/from16 v15, v20

    invoke-static {v13, v14, v0, v15}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v4

    if-eqz v16, :cond_1b

    move/from16 v11, v22

    goto :goto_15

    :cond_1b
    const/4 v0, 0x4

    move v11, v0

    :goto_15
    const-string v5, "w165_secondary_list"

    const-string v6, "w181_todo_preview"

    const-string v7, "w184_todo_empty"

    move-object/from16 v0, p0

    move-object v1, v12

    move/from16 v2, p1

    move/from16 v8, p3

    move-object v9, v10

    move/from16 v10, p6

    move-object v13, v12

    move-object v12, v15

    invoke-static/range {v0 .. v12}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->bind(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;IILorg/json/JSONObject;)V

    goto :goto_16

    .line 115
    :cond_1c
    move-object v13, v12

    .line 120
    :goto_16
    return-object v13

    .line 105
    :cond_1d
    move v15, v10

    move-object/from16 v10, v20

    const/4 v12, 0x2

    const/16 v24, 0x1

    move-object/from16 v25, v22

    move/from16 v22, v11

    move-object/from16 v11, v25

    aget-object v12, v19, v9

    move-object/from16 v20, v0

    invoke-static {v13, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-static {v13, v7, v12, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v9, v9, 0x1

    move/from16 v12, p6

    move-object/from16 v0, v20

    move-object/from16 v20, v10

    move v10, v15

    move-object/from16 v15, p2

    move/from16 v25, v22

    move-object/from16 v22, v11

    move/from16 v11, v25

    goto/16 :goto_c
.end method

.method static row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 17

    move-object/from16 v1, p0

    move/from16 v2, p1

    move-object/from16 v3, p2

    move/from16 v7, p6

    .line 176
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    move-object/from16 v4, p3

    invoke-direct {v0, v4}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    :goto_0
    move-object v4, v0

    .line 177
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

    .line 178
    const-string v0, "_widgetOwnerV181"

    invoke-virtual {v4, v0}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v8

    const-string v9, "widget_upcoming_row_v184"

    const-string v10, "w184_row"

    if-eqz v8, :cond_1

    invoke-virtual {v4, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0, v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->sameOwner(Ljava/lang/String;Lorg/json/JSONObject;)Z

    move-result v0

    if-nez v0, :cond_1

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-static {v1, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v2, 0x4

    invoke-virtual {v0, v1, v2}, Landroid/widget/RemoteViews;->setViewVisibility(II)V

    return-object v0

    .line 179
    :cond_1
    const-string v0, "@todos"

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

    .line 180
    :cond_2
    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v0

    invoke-virtual {v0}, Landroid/util/SizeF;->getWidth()F

    move-result v0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v8

    invoke-virtual {v8}, Landroid/util/SizeF;->getHeight()F

    move-result v8

    invoke-static {v3, v0, v8}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->smallRows(Ljava/lang/String;FF)Z

    move-result v0

    .line 181
    if-eqz v0, :cond_3

    const-string v9, "widget_upcoming_small_v185"

    :cond_3
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v3

    const-string v8, "date"

    invoke-virtual {v4, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    const-string v9, "selectedDate"

    invoke-virtual {v4, v9, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    .line 182
    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v9

    const-string v11, "w184_event_date"

    invoke-static {v1, v3, v11, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v9, "title"

    invoke-virtual {v4, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    const-string v13, "w184_event_title"

    invoke-static {v1, v3, v13, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/String;->isEmpty()Z

    move-result v12

    if-eqz v12, :cond_4

    const-string v12, "\uc885\uc77c"

    goto :goto_2

    :cond_4
    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v12

    :goto_2
    const-string v14, "w184_event_time"

    invoke-static {v1, v3, v14, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 183
    const/4 v12, 0x3

    filled-new-array {v11, v13, v14}, [Ljava/lang/String;

    move-result-object v15

    const/16 v16, 0x0

    move-object/from16 p3, v6

    move/from16 v6, v16

    :goto_3
    if-lt v6, v12, :cond_8

    .line 184
    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    if-eqz v0, :cond_5

    const/16 v12, 0xb

    goto :goto_4

    :cond_5
    const/16 v12, 0xc

    :goto_4
    int-to-float v12, v12

    invoke-static {v1, v2, v7, v12}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v12

    const/4 v13, 0x2

    invoke-virtual {v3, v6, v13, v12}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 185
    invoke-static {v1, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    const/high16 v11, 0x41080000    # 8.5f

    const/high16 v12, 0x41200000    # 10.0f

    if-eqz v0, :cond_6

    move v15, v11

    goto :goto_5

    :cond_6
    move v15, v12

    :goto_5
    invoke-static {v1, v2, v7, v15}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v15

    invoke-virtual {v3, v6, v13, v15}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    if-eqz v0, :cond_7

    goto :goto_6

    :cond_7
    move v11, v12

    :goto_6
    invoke-static {v1, v2, v7, v11}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v0

    invoke-virtual {v3, v6, v13, v0}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 186
    const-string v0, "w184_event_mark"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventColor(Lorg/json/JSONObject;)I

    move-result v2

    const-string v6, "setBackgroundColor"

    invoke-virtual {v3, v0, v6, v2}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 187
    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "uid"

    invoke-static {v4, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {v1, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v2, Landroid/content/Intent;

    invoke-direct {v2}, Landroid/content/Intent;-><init>()V

    const-string v5, "widgetRow"

    move/from16 v6, p4

    invoke-virtual {v2, v5, v6}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    move-result-object v2

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "open-schedule-item-v168:"

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    const-string v6, "action"

    invoke-virtual {v2, v6, v5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v2

    invoke-virtual {v3, v0, v2}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 188
    invoke-static {v1, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-static {v8}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " "

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->time(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v1, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v4, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v3, v0, v1}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    return-object v3

    .line 183
    :cond_8
    aget-object v12, v15, v6

    move/from16 p5, v0

    move-object/from16 v0, p3

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v1, v3, v12, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v6, v6, 0x1

    move/from16 v2, p1

    const/4 v12, 0x3

    move/from16 v0, p5

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

.method static small(FF)Z
    .locals 1

    .line 82
    const/high16 v0, 0x43700000    # 240.0f

    cmpg-float p0, p0, v0

    if-ltz p0, :cond_0

    const/high16 p0, 0x43480000    # 200.0f

    cmpg-float p0, p1, p0

    if-ltz p0, :cond_0

    const/4 p0, 0x0

    return p0

    :cond_0
    const/4 p0, 0x1

    return p0
.end method

.method static smallRows(Ljava/lang/String;FF)Z
    .locals 1

    .line 84
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    const-string v0, "CalendarCombined"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_0

    const/high16 p0, 0x41880000    # 17.0f

    sub-float/2addr p1, p0

    const p0, 0x3f051eb8    # 0.52f

    mul-float/2addr p1, p0

    goto :goto_0

    :cond_0
    const/high16 p0, 0x41400000    # 12.0f

    sub-float/2addr p1, p0

    :goto_0
    const/high16 p0, 0x43160000    # 150.0f

    cmpg-float p0, p1, p0

    if-ltz p0, :cond_1

    const/high16 p0, 0x43480000    # 200.0f

    cmpg-float p0, p2, p0

    if-ltz p0, :cond_1

    const/4 p0, 0x0

    return p0

    :cond_1
    const/4 p0, 0x1

    return p0
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
    .locals 16

    .line 191
    move-object/from16 v0, p0

    move/from16 v7, p1

    move-object/from16 v8, p3

    move-object/from16 v1, p5

    move/from16 v2, p6

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v3

    invoke-virtual {v3}, Landroid/util/SizeF;->getWidth()F

    move-result v3

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v4

    invoke-virtual {v4}, Landroid/util/SizeF;->getHeight()F

    move-result v4

    move-object/from16 v9, p2

    invoke-static {v9, v3, v4}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->smallRows(Ljava/lang/String;FF)Z

    move-result v3

    .line 192
    if-eqz v3, :cond_0

    const-string v4, "widget_todo_small_v185"

    goto :goto_0

    :cond_0
    const-string v4, "widget_todo_row_v184"

    :goto_0
    invoke-static {v0, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v10

    const-string v11, "title"

    invoke-virtual {v8, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v12, "w184_todo_title"

    invoke-static {v0, v10, v12, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-static {v0, v10, v12, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 193
    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    if-eqz v3, :cond_1

    const/16 v3, 0xb

    goto :goto_1

    :cond_1
    const/16 v3, 0xc

    :goto_1
    int-to-float v3, v3

    invoke-static {v0, v7, v2, v3}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v3

    const/4 v5, 0x2

    invoke-virtual {v10, v4, v5, v3}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 194
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

    if-le v4, v6, :cond_2

    const/4 v4, 0x0

    invoke-virtual {v3, v4, v6}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v3

    .line 195
    :cond_2
    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->shortDate(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v13, "w184_todo_due"

    invoke-static {v0, v10, v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-static {v0, v10, v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dateKey(Ljava/lang/String;)Z

    move-result v3

    invoke-static {v0, v10, v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 196
    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const/high16 v4, 0x41200000    # 10.0f

    invoke-static {v0, v7, v2, v4}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v2

    invoke-virtual {v10, v3, v5, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 197
    const-string v2, "w184_check"

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_3

    const-string v1, "widget_compact_check_dark_v181"

    goto :goto_2

    :cond_3
    const-string v1, "widget_compact_check_v181"

    :goto_2
    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v3, "setBackgroundResource"

    invoke-virtual {v10, v2, v3, v1}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 198
    const-string v14, "w184_check_hit"

    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    const-string v5, "todo"

    const-string v6, "true"

    move-object/from16 v1, p4

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object/from16 v4, p3

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v10, v15, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v12

    const-string v5, "open"

    const-string v6, "todo"

    move-object/from16 v1, p4

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v10, v12, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v12

    const-string v5, "open"

    const-string v6, "todo"

    move-object/from16 v1, p4

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v10, v12, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 199
    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual {v8, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " \uc644\ub8cc"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v10, v0, v1}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    return-object v10
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
