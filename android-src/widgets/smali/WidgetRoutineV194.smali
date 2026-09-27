.class public final Lcom/aiderlog/v22app/WidgetRoutineV194;
.super Ljava/lang/Object;
.source "WidgetRoutineV194.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 12
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static previewRows(FF)I
    .locals 4

    .line 28
    const/high16 v0, 0x42200000    # 40.0f

    sub-float/2addr p0, v0

    const/4 v0, 0x0

    invoke-static {v0, p0}, Ljava/lang/Math;->max(FF)F

    move-result p0

    float-to-double v0, p0

    const p0, 0x3faccccd    # 1.35f

    mul-float/2addr p1, p0

    float-to-double p0, p1

    invoke-static {p0, p1}, Ljava/lang/Math;->ceil(D)D

    move-result-wide p0

    const-wide/high16 v2, 0x4045000000000000L    # 42.0

    add-double/2addr p0, v2

    div-double/2addr v0, p0

    invoke-static {v0, v1}, Ljava/lang/Math;->floor(D)D

    move-result-wide p0

    double-to-int p0, p0

    const/4 p1, 0x1

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    return p0
.end method

.method static progress(Lorg/json/JSONObject;)Ljava/lang/String;
    .locals 4

    .line 26
    const-string v0, "level"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "done"

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "\uc77c"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const-string v2, "_widgetFailedV196"

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-nez v2, :cond_0

    const-string p0, "\ub3d9\uae30\ud654 \ud655\uc778 \ud544\uc694 \u00b7 \uc571\uc5d0\uc11c \ud655\uc778"

    return-object p0

    :cond_0
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->goalLinked(Lorg/json/JSONObject;)Z

    move-result v2

    if-eqz v2, :cond_1

    new-instance p0, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {p0, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v0, " \u00b7 \ubaa9\ud45c \uc5f0\uacb0 \u00b7 \uc571\uc5d0\uc11c \ubcc0\uacbd"

    invoke-virtual {p0, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    :goto_0
    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :cond_1
    new-instance v2, Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    if-eqz v3, :cond_2

    goto :goto_1

    :cond_2
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v3, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, " \u00b7 "

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    :goto_1
    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {v2, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v0, "_widgetPendingV196"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_3

    const-string p0, " \u00b7 \uae30\uae30 \uc800\uc7a5\ub428"

    goto :goto_2

    :cond_3
    const-string p0, ""

    :goto_2
    invoke-virtual {v2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    goto :goto_0
.end method

.method static ratio(Ljava/lang/String;)F
    .locals 1

    .line 14
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    const-string v0, "RoutineAll"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_0

    const p0, 0x3f23d70a    # 0.64f

    goto :goto_0

    :cond_0
    const p0, 0x3ef5c28f    # 0.48f

    :goto_0
    return p0
.end method

.method static render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;
    .locals 16

    .line 30
    move-object/from16 v6, p0

    move/from16 v7, p1

    move-object/from16 v8, p2

    move/from16 v0, p3

    if-nez p4, :cond_0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v1

    goto :goto_0

    :cond_0
    move-object/from16 v1, p4

    :goto_0
    const-string v2, "widget_routine_v194"

    invoke-static {v6, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v9

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v3

    const-string v4, "uid"

    invoke-virtual {v3, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/String;->isEmpty()Z

    move-result v5

    if-eqz v5, :cond_1

    const/4 v5, 0x0

    goto :goto_1

    :cond_1
    const-string v5, "routineStats"

    invoke-virtual {v3, v5}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v5

    .line 31
    :goto_1
    const-string v10, "widget_background"

    invoke-static {v6, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v11

    const-string v12, "surface"

    invoke-static {v1, v12}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    invoke-static {v6, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v12

    invoke-virtual {v9, v11, v12}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    .line 32
    invoke-static {v6, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

    move/from16 v11, p5

    invoke-static {v6, v7, v11}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->opacity(Landroid/content/Context;II)I

    move-result v11

    mul-int/lit16 v11, v11, 0xff

    int-to-float v11, v11

    const/high16 v12, 0x42c80000    # 100.0f

    div-float/2addr v11, v12

    invoke-static {v11}, Ljava/lang/Math;->round(F)I

    move-result v11

    const-string v12, "setImageAlpha"

    invoke-virtual {v9, v10, v12, v11}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 33
    const-string v10, "RoutineCards"

    invoke-virtual {v8, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    const-string v11, "ROUTINE"

    if-eqz v10, :cond_3

    :cond_2
    goto :goto_2

    :cond_3
    const-string v10, "RoutineStats"

    invoke-virtual {v8, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_2

    const-string v11, "ROUTINE \u00b7 \uc774\ubc88 \uc8fc"

    :goto_2
    const-string v10, "widget_title"

    invoke-static {v6, v9, v10, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 34
    const-string v11, ""

    if-nez v5, :cond_4

    move-object v5, v11

    goto :goto_3

    :cond_4
    new-instance v12, Ljava/lang/StringBuilder;

    const-string v13, "todayDone"

    invoke-virtual {v5, v13}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v13

    invoke-static {v13}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v13

    invoke-direct {v12, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v13, " / "

    invoke-virtual {v12, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v12

    const-string v13, "total"

    invoke-virtual {v5, v13}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v5

    invoke-virtual {v12, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v12, " \uc644\ub8cc"

    invoke-virtual {v5, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    :goto_3
    const-string v12, "widget_subtitle"

    invoke-static {v6, v9, v12, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 35
    invoke-static {v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    invoke-static {v6, v9, v10, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v5

    invoke-static {v6, v9, v12, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 36
    const-string v5, "widget_root"

    invoke-static {v6, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    invoke-static {v6, v7, v8, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v10

    invoke-virtual {v9, v5, v10}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 37
    invoke-virtual {v3, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    const-string v4, "widget_items_v164"

    const/4 v5, 0x1

    const-string v10, "widget_preview_rows_v164"

    const/4 v11, 0x0

    const-string v12, "widget_empty"

    if-eqz v3, :cond_6

    invoke-static {v6, v9, v4, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v6, v9, v10, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v6, v9, v12, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v0, "accessState"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "sync-required"

    invoke-virtual {v2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_5

    const-string v0, "\uc571\uc5d0\uc11c \uacc4\uc815 \uae30\ub85d\uc744 \ub3d9\uae30\ud654\ud574\uc8fc\uc138\uc694"

    goto :goto_4

    :cond_5
    const-string v0, "\uc571\uc5d0\uc11c \ub85c\uadf8\uc778\ud574\uc8fc\uc138\uc694"

    :goto_4
    invoke-static {v6, v9, v12, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v0

    invoke-static {v6, v9, v12, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    return-object v9

    .line 38
    :cond_6
    invoke-static {v6, v9, v12, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 39
    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v8, v2, v1}, Lcom/aiderlog/v22app/WidgetRoutineV194;->rows(Ljava/lang/String;Lorg/json/JSONObject;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v12

    xor-int/lit8 v1, v0, 0x1

    invoke-static {v6, v9, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v6, v9, v10, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 40
    if-eqz v0, :cond_9

    const/high16 v0, 0x3f800000    # 1.0f

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v1

    invoke-virtual {v1}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v1

    iget v1, v1, Landroid/util/DisplayMetrics;->scaledDensity:F

    const v2, 0x3dcccccd    # 0.1f

    invoke-virtual/range {p0 .. p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object v3

    invoke-virtual {v3}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v3

    iget v3, v3, Landroid/util/DisplayMetrics;->density:F

    invoke-static {v2, v3}, Ljava/lang/Math;->max(FF)F

    move-result v2

    div-float/2addr v1, v2

    invoke-static {v0, v1}, Ljava/lang/Math;->max(FF)F

    move-result v0

    const-string v1, "RoutineAll"

    invoke-virtual {v8, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_7

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v1

    invoke-virtual {v1}, Landroid/util/SizeF;->getHeight()F

    move-result v1

    const/high16 v2, 0x41400000    # 12.0f

    move/from16 v13, p6

    invoke-static {v6, v7, v13, v2}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v2

    mul-float/2addr v2, v0

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetRoutineV194;->previewRows(FF)I

    move-result v5

    goto :goto_5

    :cond_7
    move/from16 v13, p6

    :goto_5
    move v14, v5

    invoke-static {v6, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v9, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    :goto_6
    invoke-interface {v12}, Ljava/util/List;->size()I

    move-result v0

    invoke-static {v0, v14}, Ljava/lang/Math;->min(II)I

    move-result v0

    if-lt v11, v0, :cond_8

    goto :goto_7

    :cond_8
    invoke-static {v6, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    invoke-interface {v12, v11}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, Ljava/lang/String;

    move-object/from16 v0, p0

    move/from16 v1, p1

    move-object/from16 v2, p2

    move-object/from16 v4, p4

    move/from16 v5, p6

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetRoutineV194;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {v9, v15, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v11, v11, 0x1

    goto :goto_6

    .line 41
    :cond_9
    invoke-static {v6, v9, v7, v8, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;)V

    .line 42
    :goto_7
    return-object v9
.end method

.method static row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 24

    move-object/from16 v1, p0

    .line 45
    :try_start_0
    new-instance v0, Lorg/json/JSONObject;

    move-object/from16 v2, p3

    invoke-direct {v0, v2}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception v0

    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    .line 46
    :goto_0
    if-nez p4, :cond_0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v2

    move-object v8, v2

    goto :goto_1

    :cond_0
    move-object/from16 v8, p4

    :goto_1
    const-string v2, "kind"

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "stats"

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v3, "empty"

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    .line 47
    if-eqz v9, :cond_1

    const-string v2, "widget_routine_stats_v194"

    goto :goto_2

    :cond_1
    const-string v2, "widget_routine_row_v194"

    :goto_2
    invoke-static {v1, v2, v8}, Lcom/aiderlog/v22app/WidgetThemeV190;->rowView(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v11

    .line 48
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetRoutineV194;->validOwner(Lorg/json/JSONObject;Lorg/json/JSONObject;)Z

    move-result v2

    const-string v12, "w194_routine_actions"

    const-string v13, ""

    const-string v14, "w194_routine_row"

    const-string v3, "w194_routine_meta"

    const-string v15, "w194_routine_progress"

    const-string v4, "w194_routine_title"

    const/4 v7, 0x0

    if-nez v2, :cond_3

    if-nez v10, :cond_2

    invoke-static {v1, v11, v14, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    return-object v11

    :cond_2
    const-string v0, "\uc571\uc5d0\uc11c \ub85c\uadf8\uc778\ud558\uace0 \ub3d9\uae30\ud654\ud574\uc8fc\uc138\uc694"

    invoke-static {v1, v11, v4, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1, v11, v3, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1, v11, v12, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v1, v11, v15, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    return-object v11

    .line 49
    :cond_3
    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v6

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetThemeV190;->accent(Ljava/lang/String;)I

    move-result v16

    .line 50
    const-string v5, "weekPercent"

    const-string v7, "title"

    if-eqz v9, :cond_5

    invoke-virtual {v0, v5}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v17

    if-eqz v17, :cond_4

    const-string v17, "\u2014"

    move/from16 p4, v2

    move-object/from16 v18, v5

    goto :goto_3

    :cond_4
    move/from16 p4, v2

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-virtual {v0, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v17

    move-object/from16 v18, v5

    invoke-static/range {v17 .. v17}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v2, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v5, "%"

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v17

    goto :goto_3

    :cond_5
    move/from16 p4, v2

    move-object/from16 v18, v5

    invoke-virtual {v0, v7}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v17

    :goto_3
    move-object/from16 v2, v17

    invoke-static {v1, v11, v4, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v9, :cond_6

    move/from16 v2, v16

    goto :goto_4

    :cond_6
    move/from16 v2, p4

    :goto_4
    invoke-static {v1, v11, v4, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 51
    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-eqz v9, :cond_7

    const/16 v4, 0x14

    goto :goto_5

    :cond_7
    const/16 v4, 0xc

    :goto_5
    int-to-float v4, v4

    move/from16 v5, p1

    move-object/from16 p4, v7

    move/from16 v7, p5

    invoke-static {v1, v5, v7, v4}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v4

    const/4 v7, 0x2

    invoke-virtual {v11, v2, v7, v4}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 52
    if-eqz v9, :cond_8

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "\ub204\uc801 "

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "cumulative"

    invoke-virtual {v0, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v4, "\ud68c \u00b7 "

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v4, "streak"

    invoke-virtual {v0, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v4, "\uc77c \uc5f0\uc18d"

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    goto :goto_6

    :cond_8
    if-eqz v10, :cond_9

    const-string v2, "\uc571\uc5d0\uc11c \ub8e8\ud2f4 \ub9cc\ub4e4\uae30"

    goto :goto_6

    :cond_9
    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetRoutineV194;->progress(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v2

    :goto_6
    invoke-static {v1, v11, v3, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v1, v11, v3, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 53
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3}, Lorg/json/JSONObject;-><init>()V

    const-string v4, "_owner"

    invoke-virtual {v0, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v7, "uid"

    invoke-static {v3, v7, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v3

    const-string v4, "_date"

    invoke-virtual {v0, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v7, "today"

    invoke-static {v3, v7, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v3

    const-string v4, "v165"

    invoke-static {v2, v4, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v17

    .line 54
    if-nez v10, :cond_a

    if-nez v9, :cond_a

    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v7

    const/16 v19, 0x1

    const-string v20, "MAX"

    move-object/from16 v2, v17

    move/from16 v3, p1

    move-object/from16 v4, p2

    move-object/from16 v21, v18

    move-object v5, v0

    move/from16 v18, v6

    move-object/from16 v6, v20

    move-object/from16 v20, v13

    move v13, v7

    move-object/from16 v23, v8

    move-object/from16 v8, p4

    move-object/from16 p4, v23

    move/from16 v7, v19

    invoke-static/range {v2 .. v7}, Lcom/aiderlog/v22app/WidgetPrivateV196;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Z)Landroid/content/Intent;

    move-result-object v2

    invoke-virtual {v11, v13, v2}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-virtual {v0, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, " \uc624\ub298 \uc644\ub8cc \ub610\ub294 \uc644\ub8cc \ucde8\uc18c"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v11, v2, v3}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    goto :goto_7

    :cond_a
    move-object/from16 v20, v13

    move-object/from16 v21, v18

    move/from16 v18, v6

    move-object/from16 v23, v8

    move-object/from16 v8, p4

    move-object/from16 p4, v23

    .line 55
    :goto_7
    const/16 v2, 0x64

    if-eqz v9, :cond_d

    const-string v3, "weekCounts"

    invoke-static {v0, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v3

    const-string v4, "\uc6d4"

    const-string v5, "\ud654"

    const-string v6, "\uc218"

    const-string v7, "\ubaa9"

    const-string v8, "\uae08"

    const-string v9, "\ud1a0"

    const-string v10, "\uc77c"

    filled-new-array/range {v4 .. v10}, [Ljava/lang/String;

    move-result-object v4

    const/4 v7, 0x0

    :goto_8
    const/4 v5, 0x7

    if-lt v7, v5, :cond_b

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    move-object/from16 v5, v21

    invoke-virtual {v0, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v0

    const/4 v3, 0x0

    invoke-virtual {v11, v1, v2, v0, v3}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    return-object v11

    :cond_b
    move-object/from16 v5, v21

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v8, "w194_week_"

    invoke-direct {v6, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    new-instance v9, Ljava/lang/StringBuilder;

    aget-object v10, v4, v7

    invoke-static {v10}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    invoke-direct {v9, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v10, "\n"

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v3, v7}, Lorg/json/JSONArray;->optInt(I)I

    move-result v10

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-static {v1, v11, v6, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v6, Ljava/lang/StringBuilder;

    invoke-direct {v6, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v3, v7}, Lorg/json/JSONArray;->optInt(I)I

    move-result v8

    if-lez v8, :cond_c

    move/from16 v8, v16

    goto :goto_9

    :cond_c
    move/from16 v8, v18

    :goto_9
    invoke-static {v1, v11, v6, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v7, v7, 0x1

    move-object/from16 v21, v5

    goto :goto_8

    .line 56
    :cond_d
    xor-int/lit8 v3, v10, 0x1

    invoke-static {v1, v11, v12, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v3, "percent"

    if-nez v10, :cond_e

    const-string v4, "detail"

    invoke-virtual {v0, v4}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_e

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_e

    const/4 v7, 0x1

    goto :goto_a

    :cond_e
    const/4 v7, 0x0

    :goto_a
    invoke-static {v1, v11, v15, v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    const/4 v10, 0x0

    invoke-virtual {v11, v4, v2, v3, v10}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    .line 57
    move v12, v10

    :goto_b
    const/4 v2, 0x4

    if-lt v12, v2, :cond_f

    .line 58
    return-object v11

    .line 57
    :cond_f
    const-string v2, "MINI"

    const-string v3, "MORE"

    const-string v13, "MAX"

    const-string v4, "SKIP"

    filled-new-array {v2, v3, v13, v4}, [Ljava/lang/String;

    move-result-object v2

    aget-object v14, v2, v12

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "w194_level_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v12}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v15

    const-string v2, "level"

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v14, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v19

    invoke-static {v1, v11, v15, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v19, :cond_10

    move/from16 v6, v16

    goto :goto_c

    :cond_10
    move/from16 v6, v18

    :goto_c
    invoke-static {v1, v11, v15, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-eqz v19, :cond_11

    const-string v3, "selected"

    goto :goto_d

    :cond_11
    const-string v3, "outline"

    :goto_d
    move-object/from16 v7, p4

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const-string v4, "setBackgroundResource"

    invoke-virtual {v11, v2, v4, v3}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    const/4 v5, 0x2

    if-ne v12, v5, :cond_12

    const/16 v21, 0x1

    goto :goto_e

    :cond_12
    move/from16 v21, v10

    :goto_e
    move-object/from16 v2, v17

    move/from16 v3, p1

    move-object/from16 v4, p2

    move v9, v5

    move-object v5, v0

    move v10, v6

    move-object v6, v14

    move-object/from16 v22, v7

    move/from16 v7, v21

    invoke-static/range {v2 .. v7}, Lcom/aiderlog/v22app/WidgetPrivateV196;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Z)Landroid/content/Intent;

    move-result-object v2

    invoke-virtual {v11, v10, v2}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-virtual {v0, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, " "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    if-ne v12, v9, :cond_13

    if-eqz v19, :cond_14

    const-string v13, "MAX \ucde8\uc18c"

    goto :goto_f

    :cond_13
    move-object v13, v14

    :cond_14
    :goto_f
    invoke-virtual {v3, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    if-eqz v19, :cond_15

    const-string v4, " \uc120\ud0dd\ub428"

    goto :goto_10

    :cond_15
    move-object/from16 v4, v20

    :goto_10
    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v11, v2, v3}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    add-int/lit8 v12, v12, 0x1

    move-object/from16 p4, v22

    const/4 v10, 0x0

    goto/16 :goto_b
.end method

.method static rows(Ljava/lang/String;Lorg/json/JSONObject;Lorg/json/JSONObject;)Ljava/util/List;
    .locals 9
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Lorg/json/JSONObject;",
            "Lorg/json/JSONObject;",
            ")",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 16
    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object p1

    const-string v0, "routines"

    invoke-static {p1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    new-instance v1, Ljava/util/ArrayList;

    invoke-direct {v1}, Ljava/util/ArrayList;-><init>()V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    .line 17
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetRoutineV194;->supports(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_0

    new-instance p0, Ljava/util/ArrayList;

    invoke-direct {p0}, Ljava/util/ArrayList;-><init>()V

    return-object p0

    .line 18
    :cond_0
    const-string v2, "uid"

    invoke-virtual {p1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    const-string v4, "title"

    const-string v5, "empty"

    const-string v6, "empty-routine"

    const-string v7, "kind"

    const-string v8, "id"

    if-eqz v3, :cond_1

    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0}, Lorg/json/JSONObject;-><init>()V

    invoke-static {p0, v8, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-static {p0, v7, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string p2, "\uc571\uc5d0\uc11c \ub85c\uadf8\uc778\ud558\uace0 \ub3d9\uae30\ud654\ud574\uc8fc\uc138\uc694"

    invoke-static {p0, v4, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-interface {v1, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 20
    :cond_1
    const-string v3, "RoutineStats"

    invoke-virtual {p0, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_2

    const-string p0, "routineStats"

    invoke-virtual {p1, p0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    if-eqz p0, :cond_4

    const-string p2, "total"

    invoke-virtual {p0, p2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result p2

    if-lez p2, :cond_4

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object p0

    const-string p2, "stats"

    invoke-static {p0, v7, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string p2, "routine-stats"

    invoke-static {p0, v8, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-interface {v1, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 21
    :cond_2
    const-string v3, "RoutineCards"

    invoke-virtual {p0, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_3

    invoke-virtual {p2, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-static {v0, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    if-eqz p0, :cond_4

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object p0

    const/4 p2, 0x1

    invoke-static {p2}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object p2

    const-string v0, "detail"

    invoke-static {p0, v0, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-interface {v1, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_1

    .line 22
    :cond_3
    const/4 p0, 0x0

    :goto_0
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result p2

    if-lt p0, p2, :cond_7

    .line 23
    :cond_4
    :goto_1
    invoke-interface {v1}, Ljava/util/List;->isEmpty()Z

    move-result p0

    if-eqz p0, :cond_5

    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0}, Lorg/json/JSONObject;-><init>()V

    invoke-static {p0, v8, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-static {p0, v7, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string p2, "\ub8e8\ud2f4\uc744 \ucd94\uac00\ud574\uc8fc\uc138\uc694"

    invoke-static {p0, v4, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-interface {v1, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 24
    :cond_5
    new-instance p2, Ljava/util/ArrayList;

    invoke-direct {p2}, Ljava/util/ArrayList;-><init>()V

    invoke-interface {v1}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :goto_2
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result p0

    if-nez p0, :cond_6

    return-object p2

    :cond_6
    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object p0

    check-cast p0, Lorg/json/JSONObject;

    invoke-virtual {p1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "_owner"

    invoke-static {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v0, "today"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "_date"

    invoke-static {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-virtual {p0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-interface {p2, p0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_2

    .line 22
    :cond_7
    invoke-virtual {v0, p0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object p2

    if-eqz p2, :cond_8

    invoke-virtual {p2, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    if-nez v3, :cond_8

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object p2

    invoke-interface {v1, p2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_8
    add-int/lit8 p0, p0, 0x1

    goto :goto_0
.end method

.method static supports(Ljava/lang/String;)Z
    .locals 1

    .line 13
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    const-string v0, "RoutineAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "RoutineCards"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "RoutineStats"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-nez p0, :cond_0

    const/4 p0, 0x0

    return p0

    :cond_0
    const/4 p0, 0x1

    return p0
.end method

.method static validOwner(Lorg/json/JSONObject;Lorg/json/JSONObject;)Z
    .locals 1

    .line 27
    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "_owner"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    const/4 p0, 0x0

    return p0
.end method
