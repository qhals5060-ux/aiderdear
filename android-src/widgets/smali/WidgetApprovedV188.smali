.class public final Lcom/aiderlog/v22app/WidgetApprovedV188;
.super Ljava/lang/Object;
.source "WidgetApprovedV188.java"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 20
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static accent(Ljava/lang/String;)I
    .locals 0

    .line 24
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->accent(Ljava/lang/String;)I

    move-result p0

    return p0
.end method

.method static actionData(Lorg/json/JSONObject;)Lorg/json/JSONObject;
    .locals 4

    .line 32
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    const-string v2, "_widgetOwnerV188"

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v3, "uid"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "_widgetDateV188"

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    const-string v2, "today"

    invoke-static {v1, v2, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string v1, "v165"

    invoke-static {v0, v1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    return-object p0
.end method

.method static allEmpty(Lorg/json/JSONArray;)Z
    .locals 4

    .line 35
    const/4 v0, 0x0

    move v1, v0

    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v1, v2, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    invoke-virtual {p0, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "_emptyV189"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_1

    return v0

    :cond_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method

.method static bindOwner(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2

    .line 30
    const-string v0, "_widgetOwnerV188"

    invoke-static {p0, v0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v0, "_widgetDateV188"

    invoke-static {p0, v0, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v0, "children"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p0

    const/4 v0, 0x0

    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v1

    if-lt v0, v1, :cond_0

    return-void

    :cond_0
    invoke-virtual {p0, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v1

    if-eqz v1, :cond_1

    invoke-static {v1, p1, p2}, Lcom/aiderlog/v22app/WidgetApprovedV188;->bindOwner(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)V

    :cond_1
    add-int/lit8 v0, v0, 0x1

    goto :goto_0
.end method

.method static buildRows(Ljava/lang/String;ZLorg/json/JSONObject;Lorg/json/JSONObject;Lorg/json/JSONObject;)Ljava/util/List;
    .locals 16
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/lang/String;",
            "Z",
            "Lorg/json/JSONObject;",
            "Lorg/json/JSONObject;",
            "Lorg/json/JSONObject;",
            ")",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation

    .line 80
    move-object/from16 v0, p0

    move-object/from16 v1, p2

    move-object/from16 v2, p4

    new-instance v3, Ljava/util/ArrayList;

    invoke-direct {v3}, Ljava/util/ArrayList;-><init>()V

    .line 81
    const-string v4, "PersonalWorkflowAll"

    if-eqz p1, :cond_0

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_0

    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    return-object v0

    .line 82
    :cond_0
    const-string v5, "RoutineAll"

    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    const-string v6, "routine"

    const-string v7, "routineStats"

    const-string v8, "routines"

    const-string v9, "today"

    const/4 v10, 0x3

    const-string v11, "kind"

    const-string v12, "id"

    const/4 v13, 0x0

    if-eqz v5, :cond_5

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v5

    invoke-virtual {v1, v7}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v5}, Lorg/json/JSONArray;->length()I

    move-result v2

    const-string v4, "routineSummary"

    if-lez v2, :cond_1

    if-eqz v0, :cond_1

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0, v11, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "routine-summary"

    invoke-static {v0, v12, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_0

    :cond_1
    invoke-static {v4, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    :goto_0
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    move v0, v13

    :goto_1
    invoke-virtual {v5}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v0, v2, :cond_4

    invoke-virtual {v5}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-nez v0, :cond_3

    :goto_2
    if-lt v13, v10, :cond_2

    goto :goto_3

    :cond_2
    invoke-static {v6, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v13, v13, 0x1

    goto :goto_2

    :cond_3
    :goto_3
    move-object/from16 v8, p3

    goto/16 :goto_1d

    :cond_4
    invoke-virtual {v5, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v3, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v0, v0, 0x1

    goto :goto_1

    .line 83
    :cond_5
    const-string v5, "RoutineCards"

    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    const/4 v14, 0x1

    if-eqz v5, :cond_7

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v2, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "detail"

    if-eqz v0, :cond_6

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_4

    :cond_6
    invoke-static {v6, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    :goto_4
    invoke-static {v14}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v4

    invoke-static {v0, v2, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    move-object/from16 v8, p3

    goto/16 :goto_1d

    .line 84
    :cond_7
    const-string v5, "RoutineStats"

    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    const-string v6, "_emptyV189"

    if-eqz v5, :cond_b

    invoke-virtual {v1, v7}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "stats"

    if-eqz v0, :cond_8

    const-string v4, "total"

    invoke-virtual {v0, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    if-lez v4, :cond_8

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0, v11, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "routine-stats"

    invoke-static {v0, v12, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_5

    :cond_8
    invoke-static {v2, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    :goto_5
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    new-instance v5, Lorg/json/JSONArray;

    invoke-direct {v5}, Lorg/json/JSONArray;-><init>()V

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v7

    move v0, v13

    :goto_6
    const/4 v2, 0x2

    invoke-virtual {v7}, Lorg/json/JSONArray;->length()I

    move-result v4

    invoke-static {v2, v4}, Ljava/lang/Math;->min(II)I

    move-result v2

    const-string v4, "routineMini"

    if-lt v0, v2, :cond_a

    invoke-virtual {v5}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-nez v0, :cond_9

    invoke-static {v4, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v5, v0}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    invoke-static {v4, v14}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v5, v0}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    :cond_9
    const-string v0, "miniRoutines"

    const-string v2, "routine-mini"

    const-string v4, ""

    invoke-static {v0, v2, v4}, Lcom/aiderlog/v22app/WidgetApprovedV188;->row(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "children"

    invoke-static {v0, v2, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetApprovedV188;->allEmpty(Lorg/json/JSONArray;)Z

    move-result v2

    invoke-static {v2}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v2

    invoke-static {v0, v6, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    move-object/from16 v8, p3

    goto/16 :goto_1d

    :cond_a
    invoke-virtual {v7, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v2, v11, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-virtual {v5, v2}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v0, v0, 0x1

    goto :goto_6

    .line 85
    :cond_b
    const-string v5, "PersonalWorkoutMeal"

    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    const-string v7, "date"

    if-eqz v5, :cond_15

    .line 86
    const-string v0, "inbody"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lez v2, :cond_c

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v2

    sub-int/2addr v2, v14

    invoke-virtual {v0, v2}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "healthMetrics"

    invoke-static {v0, v11, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "health-metrics"

    invoke-static {v0, v12, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_7

    :cond_c
    const-string v0, "healthMetrics"

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    :goto_7
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 87
    new-instance v5, Lorg/json/JSONArray;

    invoke-direct {v5}, Lorg/json/JSONArray;-><init>()V

    move v0, v13

    :goto_8
    const-string v2, "meal"

    const-string v4, "meals"

    if-lt v0, v10, :cond_12

    :goto_9
    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-lt v10, v0, :cond_10

    const-string v0, ""

    invoke-static {v4, v4, v0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->row(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "children"

    invoke-static {v0, v2, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetApprovedV188;->allEmpty(Lorg/json/JSONArray;)Z

    move-result v2

    invoke-static {v2}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v2

    invoke-static {v0, v6, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 88
    move v0, v13

    move v2, v0

    :goto_a
    const-string v4, "workouts"

    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-virtual {v4}, Lorg/json/JSONArray;->length()I

    move-result v4

    if-lt v0, v4, :cond_e

    if-nez v2, :cond_d

    const-string v0, "workout"

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 89
    move-object/from16 v8, p3

    goto/16 :goto_1d

    .line 88
    :cond_d
    move-object/from16 v8, p3

    goto/16 :goto_1d

    :cond_e
    const-string v4, "workouts"

    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-virtual {v4, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v4

    invoke-virtual {v4, v7}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v1, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_f

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v4

    invoke-interface {v3, v4}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v2, v2, 0x1

    :cond_f
    add-int/lit8 v0, v0, 0x1

    goto :goto_a

    .line 87
    :cond_10
    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0, v10}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v0

    if-eqz v0, :cond_11

    invoke-virtual {v0, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/String;->isEmpty()Z

    move-result v8

    if-nez v8, :cond_11

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0, v11, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v5, v0}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    :cond_11
    add-int/lit8 v10, v10, 0x1

    goto/16 :goto_9

    :cond_12
    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    invoke-virtual {v8}, Lorg/json/JSONArray;->length()I

    move-result v8

    if-ge v0, v8, :cond_13

    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-virtual {v4, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v4

    goto :goto_b

    :cond_13
    const/4 v4, 0x0

    :goto_b
    if-eqz v4, :cond_14

    invoke-virtual {v4, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/String;->isEmpty()Z

    move-result v8

    if-nez v8, :cond_14

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v4

    invoke-static {v4, v11, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    goto :goto_c

    :cond_14
    invoke-static {v2, v0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v2

    const-string v4, "breakfast"

    const-string v8, "lunch"

    const-string v14, "dinner"

    filled-new-array {v4, v8, v14}, [Ljava/lang/String;

    move-result-object v4

    aget-object v4, v4, v0

    const-string v8, "slot"

    invoke-static {v2, v8, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    :goto_c
    invoke-virtual {v5, v2}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v0, v0, 0x1

    goto/16 :goto_8

    .line 89
    :cond_15
    const-string v5, "PersonalQuote"

    invoke-virtual {v0, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_1c

    .line 90
    const-string v0, "currentBookId"

    invoke-virtual {v1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v12, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "books"

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-static {v4, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v5

    if-nez v5, :cond_16

    const-string v0, "book"

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_d

    :cond_16
    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    :goto_d
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    const-string v0, "quote"

    if-eqz v5, :cond_17

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v4

    if-nez v4, :cond_17

    const-string v4, "recordId"

    invoke-virtual {v5, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    const-string v7, "\uc800\uc7a5\ud55c \ubb38\uc7a5"

    invoke-static {v0, v6, v7}, Lcom/aiderlog/v22app/WidgetApprovedV188;->row(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v6

    invoke-virtual {v5, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v7, "body"

    invoke-static {v6, v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v5, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v0, v4, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v4, "quotePage"

    invoke-virtual {v5, v4}, Lorg/json/JSONObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v4

    const-string v6, "page"

    invoke-static {v0, v6, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_e

    :cond_17
    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    :goto_e
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    const/4 v8, 0x0

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v15

    move v0, v13

    :goto_f
    invoke-virtual {v15}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v0, v2, :cond_18

    goto :goto_10

    :cond_18
    invoke-virtual {v15, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    if-eqz v2, :cond_1b

    const-string v4, "status"

    invoke-virtual {v2, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    const-string v6, "want"

    invoke-virtual {v6, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_1b

    if-eqz v5, :cond_19

    invoke-virtual {v2, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v5, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v4, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-nez v4, :cond_1b

    :cond_19
    move-object v8, v2

    :goto_10
    if-nez v8, :cond_1a

    const-string v0, "bookNext"

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_11

    :cond_1a
    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "bookNext"

    invoke-static {v0, v11, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    :goto_11
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 91
    move-object/from16 v8, p3

    goto/16 :goto_1d

    .line 90
    :cond_1b
    add-int/lit8 v0, v0, 0x1

    goto :goto_f

    .line 91
    :cond_1c
    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_23

    .line 92
    if-eqz p1, :cond_1d

    const-string v0, "notes"

    goto :goto_12

    :cond_1d
    const-string v0, "incompleteTodos"

    :goto_12
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    move v0, v13

    :goto_13
    invoke-virtual {v4}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v0, v2, :cond_22

    invoke-virtual {v4}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-nez v0, :cond_21

    :goto_14
    if-eqz p1, :cond_1e

    move v0, v14

    goto :goto_15

    :cond_1e
    move v0, v10

    :goto_15
    if-lt v13, v0, :cond_1f

    .line 93
    move-object/from16 v8, p3

    goto/16 :goto_1d

    .line 92
    :cond_1f
    if-eqz p1, :cond_20

    const-string v0, "note"

    goto :goto_16

    :cond_20
    const-string v0, "todo"

    :goto_16
    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v13, v13, 0x1

    goto :goto_14

    :cond_21
    move-object/from16 v8, p3

    goto/16 :goto_1d

    :cond_22
    invoke-virtual {v4, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v3, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v0, v0, 0x1

    goto :goto_13

    .line 93
    :cond_23
    const-string v4, "PersonalToday"

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_2d

    .line 94
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v9, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "[0-9]{4}-[0-9]{2}-[0-9]{2}"

    invoke-virtual {v0, v2}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_2c

    const-string v2, "dates"

    invoke-virtual {v1, v2}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v2

    if-nez v2, :cond_24

    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    goto :goto_17

    :cond_24
    invoke-static {v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    :goto_17
    new-instance v4, Ljava/util/ArrayList;

    invoke-direct {v4}, Ljava/util/ArrayList;-><init>()V

    move v5, v13

    :goto_18
    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v8

    const-string v12, "timeline"

    if-lt v5, v8, :cond_2a

    .line 95
    const-string v2, "scheduleItems"

    move-object/from16 v8, p3

    invoke-static {v8, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v15

    move v2, v13

    :goto_19
    invoke-virtual {v15}, Lorg/json/JSONArray;->length()I

    move-result v5

    if-lt v2, v5, :cond_26

    .line 96
    new-instance v2, Lcom/aiderlog/v22app/WidgetApprovedV188$1;

    invoke-direct {v2}, Lcom/aiderlog/v22app/WidgetApprovedV188$1;-><init>()V

    invoke-static {v4, v2}, Ljava/util/Collections;->sort(Ljava/util/List;Ljava/util/Comparator;)V

    .line 97
    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->shortDay(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v9, v0, v2}, Lcom/aiderlog/v22app/WidgetApprovedV188;->row(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static {v2, v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v4}, Ljava/util/List;->size()I

    move-result v2

    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v2

    const-string v5, "count"

    invoke-static {v0, v5, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v4}, Ljava/util/List;->isEmpty()Z

    move-result v2

    invoke-static {v2}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v2

    invoke-static {v0, v6, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    invoke-interface {v3, v4}, Ljava/util/List;->addAll(Ljava/util/Collection;)Z

    invoke-interface {v4}, Ljava/util/List;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_2f

    :goto_1a
    if-lt v13, v10, :cond_25

    .line 99
    goto/16 :goto_1d

    .line 97
    :cond_25
    invoke-static {v12, v13}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v13, v13, 0x1

    goto :goto_1a

    .line 95
    :cond_26
    invoke-virtual {v15, v2}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v5

    if-nez v5, :cond_28

    :cond_27
    goto :goto_1b

    :cond_28
    invoke-virtual {v5, v7}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v10

    const-string v13, "endDate"

    invoke-virtual {v5, v13, v10}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/String;->isEmpty()Z

    move-result v13

    if-eqz v13, :cond_29

    invoke-virtual {v5, v7}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v10

    :cond_29
    invoke-virtual {v5, v7}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v0, v13}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v13

    if-ltz v13, :cond_27

    invoke-virtual {v0, v10}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v10

    if-gtz v10, :cond_27

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v5

    invoke-static {v5, v11, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {v14}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v10

    const-string v13, "schedule"

    invoke-static {v5, v13, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-interface {v4, v5}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :goto_1b
    add-int/lit8 v2, v2, 0x1

    const/4 v10, 0x3

    const/4 v13, 0x0

    goto/16 :goto_19

    .line 94
    :cond_2a
    move-object/from16 v8, p3

    invoke-virtual {v2, v5}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v10

    if-eqz v10, :cond_2b

    const-string v13, "type"

    invoke-virtual {v10, v13}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    const-string v15, "emotion"

    invoke-virtual {v13, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v13

    if-nez v13, :cond_2b

    invoke-static {v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v10

    invoke-static {v10, v11, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v10

    invoke-interface {v4, v10}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_2b
    add-int/lit8 v5, v5, 0x1

    const/4 v10, 0x3

    const/4 v13, 0x0

    goto/16 :goto_18

    :cond_2c
    move-object/from16 v8, p3

    goto :goto_1d

    .line 99
    :cond_2d
    move-object/from16 v8, p3

    const-string v4, "PersonalWorkoutChallengeOnly"

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2f

    const-string v0, "challenges"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v2, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    if-nez v0, :cond_2e

    const-string v0, "challenge"

    const/4 v2, 0x0

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0

    goto :goto_1c

    :cond_2e
    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    :goto_1c
    invoke-interface {v3, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 100
    :cond_2f
    :goto_1d
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    invoke-interface {v3}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v2

    :goto_1e
    invoke-interface {v2}, Ljava/util/Iterator;->hasNext()Z

    move-result v3

    if-nez v3, :cond_30

    return-object v0

    :cond_30
    invoke-interface {v2}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Lorg/json/JSONObject;

    invoke-static/range {p3 .. p3}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v4

    const-string v5, "uid"

    invoke-virtual {v1, v5, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v5

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v1, v9, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v3, v4, v5}, Lcom/aiderlog/v22app/WidgetApprovedV188;->bindOwner(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v3}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-interface {v0, v3}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_1e
.end method

.method static chart(Ljava/lang/String;Lorg/json/JSONArray;III)Landroid/graphics/Bitmap;
    .locals 31

    .line 128
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    move/from16 v2, p3

    const-string v3, "challenge"

    invoke-virtual {v0, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    const-string v4, "emptyChallenge"

    if-nez v3, :cond_1

    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_0

    goto :goto_0

    :cond_0
    const/16 v3, 0x96

    goto :goto_1

    :cond_1
    :goto_0
    const/16 v3, 0xf0

    :goto_1
    sget-object v5, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    const/16 v6, 0x276

    invoke-static {v6, v3, v5}, Landroid/graphics/Bitmap;->createBitmap(IILandroid/graphics/Bitmap$Config;)Landroid/graphics/Bitmap;

    move-result-object v5

    new-instance v15, Landroid/graphics/Canvas;

    invoke-direct {v15, v5}, Landroid/graphics/Canvas;-><init>(Landroid/graphics/Bitmap;)V

    new-instance v14, Landroid/graphics/Paint;

    const/4 v7, 0x3

    invoke-direct {v14, v7}, Landroid/graphics/Paint;-><init>(I)V

    sget-object v7, Landroid/graphics/Paint$Align;->CENTER:Landroid/graphics/Paint$Align;

    invoke-virtual {v14, v7}, Landroid/graphics/Paint;->setTextAlign(Landroid/graphics/Paint$Align;)V

    const/high16 v7, 0x41a00000    # 20.0f

    invoke-virtual {v14, v7}, Landroid/graphics/Paint;->setTextSize(F)V

    invoke-static/range {p2 .. p2}, Lcom/aiderlog/v22app/WidgetThemeV190;->soft(I)I

    move-result v13

    .line 129
    const-string v7, "bars"

    invoke-virtual {v0, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    const/4 v12, 0x7

    const-string v11, "emptyBars"

    const/16 v16, 0x0

    if-nez v7, :cond_11

    invoke-virtual {v0, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_2

    move/from16 v29, v13

    goto/16 :goto_e

    .line 130
    :cond_2
    const-string v7, "week"

    invoke-virtual {v0, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    const-string v17, "\u2713"

    const/16 v18, -0x1

    if-eqz v7, :cond_7

    move/from16 v0, v16

    :goto_2
    if-lt v0, v12, :cond_3

    goto/16 :goto_11

    :cond_3
    mul-int/lit8 v3, v0, 0x5a

    add-int/lit8 v3, v3, 0x2d

    int-to-float v3, v3

    invoke-virtual {v1, v0}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v4

    if-eqz v4, :cond_4

    move/from16 v4, p2

    goto :goto_3

    :cond_4
    move v4, v13

    :goto_3
    invoke-virtual {v14, v4}, Landroid/graphics/Paint;->setColor(I)V

    const/high16 v4, 0x42480000    # 50.0f

    const/high16 v6, 0x41c00000    # 24.0f

    invoke-virtual {v15, v3, v4, v6, v14}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    invoke-virtual {v1, v0}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v4

    if-eqz v4, :cond_5

    move/from16 v4, v18

    goto :goto_4

    :cond_5
    move v4, v2

    :goto_4
    invoke-virtual {v14, v4}, Landroid/graphics/Paint;->setColor(I)V

    invoke-virtual {v1, v0}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v4

    if-eqz v4, :cond_6

    move-object/from16 v4, v17

    goto :goto_5

    :cond_6
    const-string v4, "\u00b7"

    :goto_5
    const/high16 v6, 0x42640000    # 57.0f

    invoke-virtual {v15, v4, v3, v6, v14}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    invoke-virtual {v14, v2}, Landroid/graphics/Paint;->setColor(I)V

    const-string v19, "\uc6d4"

    const-string v20, "\ud654"

    const-string v21, "\uc218"

    const-string v22, "\ubaa9"

    const-string v23, "\uae08"

    const-string v24, "\ud1a0"

    const-string v25, "\uc77c"

    filled-new-array/range {v19 .. v25}, [Ljava/lang/String;

    move-result-object v4

    aget-object v4, v4, v0

    const/high16 v6, 0x42d00000    # 104.0f

    invoke-virtual {v15, v4, v3, v6, v14}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    add-int/lit8 v0, v0, 0x1

    goto :goto_2

    .line 131
    :cond_7
    invoke-virtual {v0, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_8

    const/16 v0, 0x1e

    goto :goto_6

    :cond_8
    invoke-virtual/range {p1 .. p1}, Lorg/json/JSONArray;->length()I

    move-result v0

    const/16 v7, 0x5a

    invoke-static {v0, v7}, Ljava/lang/Math;->min(II)I

    move-result v0

    :goto_6
    const/16 v19, 0xf

    const/16 v12, 0x23

    if-le v0, v12, :cond_9

    move/from16 v11, v19

    goto :goto_7

    :cond_9
    const/16 v7, 0xa

    move v11, v7

    :goto_7
    add-int v7, v0, v11

    const/4 v10, 0x1

    sub-int/2addr v7, v10

    div-int/2addr v7, v11

    invoke-static {v10, v7}, Ljava/lang/Math;->max(II)I

    move-result v7

    int-to-float v6, v6

    int-to-float v8, v11

    div-float/2addr v6, v8

    int-to-float v3, v3

    int-to-float v7, v7

    div-float/2addr v3, v7

    move/from16 v9, v16

    :goto_8
    if-lt v9, v0, :cond_a

    goto/16 :goto_11

    :cond_a
    rem-int v7, v9, v11

    int-to-float v7, v7

    mul-float v20, v7, v6

    div-int v7, v9, v11

    int-to-float v7, v7

    mul-float v21, v7, v3

    if-nez v4, :cond_b

    invoke-virtual {v1, v9}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v7

    if-eqz v7, :cond_b

    move/from16 v22, v10

    goto :goto_9

    :cond_b
    move/from16 v22, v16

    :goto_9
    if-eqz v22, :cond_c

    move/from16 v7, p2

    goto :goto_a

    :cond_c
    move v7, v13

    :goto_a
    invoke-virtual {v14, v7}, Landroid/graphics/Paint;->setColor(I)V

    const/high16 v7, 0x40800000    # 4.0f

    add-float v8, v20, v7

    add-float v23, v21, v7

    add-float v24, v20, v6

    sub-float v24, v24, v7

    add-float v25, v21, v3

    sub-float v25, v25, v7

    const/high16 v26, 0x41000000    # 8.0f

    const/high16 v27, 0x41000000    # 8.0f

    move-object v7, v15

    move/from16 v28, v9

    move/from16 v9, v23

    move/from16 v23, v10

    move/from16 v10, v24

    move/from16 v24, v11

    move/from16 v11, v25

    move v2, v12

    move/from16 v12, v26

    move/from16 v29, v13

    move/from16 v13, v27

    move-object/from16 v25, v14

    invoke-virtual/range {v7 .. v14}, Landroid/graphics/Canvas;->drawRoundRect(FFFFFFLandroid/graphics/Paint;)V

    if-le v0, v2, :cond_d

    move/from16 v7, v19

    goto :goto_b

    :cond_d
    const/16 v7, 0x14

    :goto_b
    int-to-float v7, v7

    move-object/from16 v14, v25

    invoke-virtual {v14, v7}, Landroid/graphics/Paint;->setTextSize(F)V

    if-eqz v22, :cond_e

    move/from16 v7, v18

    goto :goto_c

    :cond_e
    move/from16 v7, p3

    :goto_c
    invoke-virtual {v14, v7}, Landroid/graphics/Paint;->setColor(I)V

    if-nez v4, :cond_10

    if-eqz v22, :cond_f

    move-object/from16 v7, v17

    goto :goto_d

    :cond_f
    add-int/lit8 v9, v28, 0x1

    add-int v9, v9, p4

    invoke-static {v9}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v7

    :goto_d
    const/high16 v8, 0x40000000    # 2.0f

    div-float v9, v6, v8

    add-float v9, v20, v9

    div-float v8, v3, v8

    add-float v21, v21, v8

    const/high16 v8, 0x40e00000    # 7.0f

    add-float v8, v21, v8

    invoke-virtual {v15, v7, v9, v8, v14}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    :cond_10
    add-int/lit8 v9, v28, 0x1

    move v12, v2

    move/from16 v10, v23

    move/from16 v11, v24

    move/from16 v13, v29

    move/from16 v2, p3

    goto/16 :goto_8

    .line 129
    :cond_11
    move/from16 v29, v13

    :goto_e
    const-wide/high16 v2, 0x3ff0000000000000L    # 1.0

    move/from16 v4, v16

    :goto_f
    invoke-virtual/range {p1 .. p1}, Lorg/json/JSONArray;->length()I

    move-result v6

    if-lt v4, v6, :cond_14

    move/from16 v4, v16

    :goto_10
    if-lt v4, v12, :cond_12

    .line 131
    :goto_11
    return-object v5

    .line 129
    :cond_12
    mul-int/lit8 v6, v4, 0x5a

    add-int/lit8 v6, v6, 0x2d

    int-to-float v6, v6

    invoke-virtual {v1, v4}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v7

    div-double/2addr v7, v2

    const-wide v9, 0x405a800000000000L    # 106.0

    mul-double/2addr v7, v9

    double-to-float v13, v7

    move/from16 v10, v29

    invoke-virtual {v14, v10}, Landroid/graphics/Paint;->setColor(I)V

    const/high16 v7, 0x41500000    # 13.0f

    sub-float v16, v6, v7

    const/high16 v9, 0x41000000    # 8.0f

    add-float v17, v6, v7

    const/high16 v18, 0x42ec0000    # 118.0f

    const/high16 v19, 0x40c00000    # 6.0f

    const/high16 v20, 0x40c00000    # 6.0f

    move-object v7, v15

    move/from16 v8, v16

    move/from16 v21, v10

    move/from16 v10, v17

    move-object/from16 v30, v11

    move/from16 v11, v18

    move/from16 v18, v12

    move/from16 v12, v19

    move/from16 v19, v13

    move/from16 v13, v20

    move-object/from16 v25, v14

    invoke-virtual/range {v7 .. v14}, Landroid/graphics/Canvas;->drawRoundRect(FFFFFFLandroid/graphics/Paint;)V

    move-object/from16 v14, v30

    invoke-virtual {v0, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_13

    move/from16 v13, p2

    move-object/from16 v12, v25

    invoke-virtual {v12, v13}, Landroid/graphics/Paint;->setColor(I)V

    const/high16 v7, 0x42ec0000    # 118.0f

    sub-float v9, v7, v19

    const/high16 v11, 0x42ec0000    # 118.0f

    const/high16 v19, 0x40c00000    # 6.0f

    const/high16 v20, 0x40c00000    # 6.0f

    move-object v7, v15

    move/from16 v8, v16

    move/from16 v10, v17

    move/from16 v12, v19

    move/from16 v13, v20

    move-object/from16 v17, v14

    move-object/from16 v14, v25

    invoke-virtual/range {v7 .. v14}, Landroid/graphics/Canvas;->drawRoundRect(FFFFFFLandroid/graphics/Paint;)V

    goto :goto_12

    :cond_13
    move-object/from16 v17, v14

    :goto_12
    move/from16 v7, p3

    move-object/from16 v8, v25

    invoke-virtual {v8, v7}, Landroid/graphics/Paint;->setColor(I)V

    const-string v22, "\uc6d4"

    const-string v23, "\ud654"

    const-string v24, "\uc218"

    const-string v25, "\ubaa9"

    const-string v26, "\uae08"

    const-string v27, "\ud1a0"

    const-string v28, "\uc77c"

    filled-new-array/range {v22 .. v28}, [Ljava/lang/String;

    move-result-object v9

    aget-object v9, v9, v4

    const/high16 v10, 0x43110000    # 145.0f

    invoke-virtual {v15, v9, v6, v10, v8}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    add-int/lit8 v4, v4, 0x1

    move-object v14, v8

    move-object/from16 v11, v17

    move/from16 v12, v18

    move/from16 v29, v21

    goto/16 :goto_10

    :cond_14
    move/from16 v7, p3

    move-object/from16 v17, v11

    move/from16 v18, v12

    move-object v8, v14

    move/from16 v21, v29

    invoke-virtual {v1, v4}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v9

    invoke-static {v2, v3, v9, v10}, Ljava/lang/Math;->max(DD)D

    move-result-wide v2

    add-int/lit8 v4, v4, 0x1

    goto/16 :goto_f
.end method

.method static cleared(Landroid/content/Context;)Landroid/widget/RemoteViews;
    .locals 3

    .line 34
    const-string v0, "widget_v188_quote"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v0

    const-string v1, "w188_row"

    const/4 v2, 0x0

    invoke-static {p0, v0, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    return-object v0
.end method

.method static collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;I)V
    .locals 12
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
            "Z",
            "Ljava/lang/String;",
            "I)V"
        }
    .end annotation

    .line 74
    move-object v6, p0

    move-object v7, p1

    move-object/from16 v0, p5

    move-object/from16 v8, p6

    if-nez p7, :cond_0

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    move-object v0, p0

    move-object v1, p1

    move v2, p2

    move-object v3, p3

    move-object/from16 v4, p4

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;I)V

    return-void

    .line 75
    :cond_0
    const/4 v1, 0x0

    invoke-static {p0, p1, v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const/4 v0, 0x1

    invoke-static {p0, p1, v8, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {p0, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {p1, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    move v9, v1

    :goto_0
    const/16 v0, 0x8

    invoke-interface/range {p4 .. p4}, Ljava/util/List;->size()I

    move-result v1

    invoke-static {v0, v1}, Ljava/lang/Math;->min(II)I

    move-result v0

    if-lt v9, v0, :cond_1

    .line 76
    return-void

    .line 75
    :cond_1
    invoke-static {p0, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v10

    move-object/from16 v11, p4

    invoke-interface {v11, v9}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, Ljava/lang/String;

    move-object v0, p0

    move v1, p2

    move-object v2, p3

    move-object/from16 v4, p8

    move/from16 v5, p9

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetApprovedV188;->renderRow(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {p1, v10, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v9, v9, 0x1

    goto :goto_0
.end method

.method static emptyRow(Ljava/lang/String;I)Lorg/json/JSONObject;
    .locals 2

    .line 26
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "__empty_v189:"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, ":"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, ""

    invoke-static {p0, v0, v1}, Lcom/aiderlog/v22app/WidgetApprovedV188;->row(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    const/4 v0, 0x1

    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v0

    const-string v1, "_emptyV189"

    invoke-static {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    invoke-static {p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p1

    const-string v0, "_slotV189"

    invoke-static {p0, v0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    return-object p0
.end method

.method static emptyView(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 24

    .line 38
    move-object/from16 v0, p0

    move-object/from16 v4, p3

    move-object/from16 v1, p4

    const-string v2, "kind"

    invoke-virtual {v4, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v3

    invoke-virtual {v3}, Landroid/util/SizeF;->getWidth()F

    move-result v3

    invoke-static {v2, v4, v3}, Lcom/aiderlog/v22app/WidgetApprovedV188;->template(Ljava/lang/String;Lorg/json/JSONObject;F)Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v3, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->rowView(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v7

    invoke-static {v0, v7, v2, v4, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->rowStyle(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;)V

    invoke-static/range {p4 .. p4}, Lcom/aiderlog/v22app/WidgetApprovedV188;->accent(Ljava/lang/String;)I

    move-result v3

    invoke-static/range {p4 .. p4}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v5

    const-string v6, "_slotV189"

    invoke-virtual {v4, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v6

    .line 39
    const-string v8, "healthMetrics"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    const-string v9, "note"

    const-string v10, "todo"

    const-string v11, "calendarTodo"

    const-string v12, "_widgetDateV188"

    const-string v13, "routine"

    const-string v14, "\u2014"

    const-string v15, ""

    if-eqz v8, :cond_1

    const/4 v1, 0x0

    :goto_0
    const/4 v3, 0x3

    if-lt v1, v3, :cond_0

    move-object/from16 v20, v9

    move-object/from16 v17, v10

    move-object/from16 v16, v11

    move-object v11, v12

    move-object v10, v13

    goto/16 :goto_a

    :cond_0
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v6, "w189_metric_value_"

    invoke-direct {v3, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v7, v3, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-direct {v3, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v7, v3, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v6, "w189_metric_label_"

    invoke-direct {v3, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v7, v3, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v6, "w189_metric_unit_"

    invoke-direct {v3, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v7, v3, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    .line 40
    :cond_1
    const-string v8, "meal"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    move-object/from16 v16, v11

    const-string v11, "w188_photo"

    const-string v1, "w188_title"

    const-string v4, "w188_meta"

    if-eqz v8, :cond_4

    const/4 v3, 0x1

    if-nez v6, :cond_2

    const-string v6, "\uc544\uce68"

    goto :goto_1

    :cond_2
    if-ne v6, v3, :cond_3

    const-string v6, "\uc810\uc2ec"

    goto :goto_1

    :cond_3
    const-string v6, "\uc800\ub141"

    :goto_1
    invoke-static {v0, v7, v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "w188_empty"

    invoke-static {v0, v7, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v0, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v3, 0x0

    invoke-virtual {v7, v1, v3}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    move-object/from16 v4, p3

    move-object/from16 v20, v9

    move-object/from16 v17, v10

    move-object v11, v12

    move-object v10, v13

    goto/16 :goto_a

    .line 41
    :cond_4
    invoke-static {v0, v7, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 42
    const-string v8, "routineSummary"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    move-object/from16 v17, v12

    const-string v12, "w188_progress"

    if-eqz v8, :cond_5

    const-string v3, "\uc624\ub298"

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/16 v3, 0x64

    const/4 v4, 0x0

    invoke-virtual {v7, v1, v3, v4, v4}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    move-object/from16 v4, p3

    move-object/from16 v20, v9

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object v10, v13

    goto/16 :goto_a

    .line 43
    :cond_5
    invoke-virtual {v2, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    move-object/from16 v19, v13

    const-string v13, "w188_check"

    move-object/from16 v20, v9

    const-string v9, "w188_graph"

    move-object/from16 v21, v13

    const-string v13, "w188_body"

    if-nez v8, :cond_18

    const-string v8, "routineMini"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_6

    move-object v14, v1

    move-object v8, v4

    move/from16 v22, v6

    move-object/from16 v11, v17

    move-object/from16 v6, v21

    move-object/from16 v4, p3

    move-object/from16 v1, p4

    move-object/from16 v17, v10

    move-object/from16 v10, v16

    goto/16 :goto_7

    .line 44
    :cond_6
    const-string v8, "stats"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    move/from16 v22, v6

    const-string v6, "w188_foot"

    if-eqz v8, :cond_7

    invoke-static {v0, v7, v1, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "\uc774\ubc88 \uc8fc \ub2ec\uc131\ub960"

    invoke-static {v0, v7, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "\ub204\uc801 \u2014   \uc624\ub298 \u2014"

    invoke-static {v0, v7, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v13, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v7, v6, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v4, Lorg/json/JSONArray;

    invoke-direct {v4}, Lorg/json/JSONArray;-><init>()V

    const-string v6, "emptyBars"

    const/4 v8, 0x0

    invoke-static {v6, v4, v3, v5, v8}, Lcom/aiderlog/v22app/WidgetApprovedV188;->chart(Ljava/lang/String;Lorg/json/JSONArray;III)Landroid/graphics/Bitmap;

    move-result-object v3

    invoke-virtual {v7, v1, v3}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    move-object/from16 v4, p3

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 45
    :cond_7
    const-string v8, "workout"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_8

    const-string v6, "\uc6b4\ub3d9 \uae30\ub85d"

    invoke-static {v0, v7, v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v13, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "w189_workout_icon"

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v4, p3

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 46
    :cond_8
    const-string v8, "book"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_9

    const-string v3, "\uc77d\uace0 \uc788\ub294 \ucc45"

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "\u2014 / \u2014\ucabd"

    invoke-static {v0, v7, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w188_cover_title"

    const-string v3, "BOOK"

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v7, v13, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v3, 0x0

    invoke-virtual {v7, v1, v3}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/16 v4, 0x64

    invoke-virtual {v7, v1, v4, v3, v3}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    move-object/from16 v4, p3

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 47
    :cond_9
    const-string v8, "quote"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_a

    const-string v1, "\uae30\uc5b5\ud560 \ubb38\uc7a5"

    invoke-static {v0, v7, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v6, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v13, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v7, v6, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v4, p3

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 48
    :cond_a
    const-string v8, "bookNext"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_b

    const-string v3, "\ub2e4\uc74c\uc5d0 \uc77d\uc744 \ucc45"

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_book_icon"

    invoke-static {v0, v7, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v4, p3

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 49
    :cond_b
    invoke-virtual {v2, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_e

    if-nez v22, :cond_c

    const-string v3, "\ud560 \uc77c \ucd94\uac00"

    goto :goto_2

    :cond_c
    move-object v3, v15

    :goto_2
    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-nez v22, :cond_d

    const-string v1, "+"

    goto :goto_3

    :cond_d
    move-object v1, v15

    :goto_3
    move-object/from16 v6, v21

    invoke-static {v0, v7, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v4, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v6, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v4, p3

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 50
    :cond_e
    move-object/from16 v8, v20

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v11

    if-eqz v11, :cond_f

    const-string v3, "\uba54\ubaa8 \ucd94\uac00"

    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "\uff0b"

    invoke-static {v0, v7, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v6, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v13, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v3, 0x2

    const/high16 v4, 0x41b80000    # 23.0f

    invoke-virtual {v7, v1, v3, v4}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    move-object/from16 v4, p3

    move-object/from16 v20, v8

    move-object/from16 v11, v17

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 51
    :cond_f
    const-string v11, "today"

    invoke-virtual {v2, v11}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v11

    if-eqz v11, :cond_10

    move-object v3, v4

    move-object/from16 v11, v17

    move-object/from16 v4, p3

    invoke-virtual {v4, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->shortDay(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v0, v7, v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v4, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->weekday(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v0, v7, v3, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object v6, v1

    move-object/from16 v1, p4

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-static {v0, v7, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v7, v3, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v20, v8

    move-object/from16 v17, v10

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 52
    :cond_10
    move-object/from16 v20, v8

    move-object/from16 v11, v17

    move-object v8, v4

    move-object/from16 v4, p3

    move-object/from16 v17, v10

    const-string v10, "timeline"

    invoke-virtual {v2, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_12

    invoke-static {v0, v7, v8, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-nez v22, :cond_11

    const-string v3, "\uae30\ub85d \ucd94\uac00"

    goto :goto_4

    :cond_11
    move-object v3, v15

    :goto_4
    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_record_type"

    invoke-static {v0, v7, v1, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v8, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 53
    :cond_12
    const-string v10, "challenge"

    invoke-virtual {v2, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_13

    const-string v10, "\ucc4c\ub9b0\uc9c0 \uc120\ud0dd"

    invoke-static {v0, v7, v1, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v8, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v13, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v6, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v8, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/16 v6, 0x64

    const/4 v8, 0x0

    invoke-virtual {v7, v1, v6, v8, v8}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    invoke-static {v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v6, Lorg/json/JSONArray;

    invoke-direct {v6}, Lorg/json/JSONArray;-><init>()V

    const-string v9, "emptyChallenge"

    invoke-static {v9, v6, v3, v5, v8}, Lcom/aiderlog/v22app/WidgetApprovedV188;->chart(Ljava/lang/String;Lorg/json/JSONArray;III)Landroid/graphics/Bitmap;

    move-result-object v3

    invoke-virtual {v7, v1, v3}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 54
    :cond_13
    const-string v3, "calendar"

    invoke-virtual {v2, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_17

    if-nez v22, :cond_15

    move-object/from16 v10, v16

    invoke-virtual {v2, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_14

    const-string v3, "\ud560 \uc77c \ucd94\uac00"

    goto :goto_5

    :cond_14
    const-string v3, "\uc77c\uc815 \ucd94\uac00"

    goto :goto_5

    :cond_15
    move-object/from16 v10, v16

    move-object v3, v15

    :goto_5
    invoke-static {v0, v7, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v2, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_16

    const-string v14, "\u25a1"

    :cond_16
    invoke-static {v0, v7, v8, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v8, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v16, v10

    goto :goto_6

    :cond_17
    move-object/from16 v10, v16

    :goto_6
    move-object/from16 v10, v19

    goto/16 :goto_a

    .line 43
    :cond_18
    move-object v14, v1

    move-object v8, v4

    move/from16 v22, v6

    move-object/from16 v11, v17

    move-object/from16 v6, v21

    move-object/from16 v4, p3

    move-object/from16 v1, p4

    move-object/from16 v17, v10

    move-object/from16 v10, v16

    :goto_7
    if-nez v22, :cond_19

    const-string v16, "\ub8e8\ud2f4 \ucd94\uac00"

    move-object/from16 v23, v16

    move-object/from16 v16, v10

    move-object/from16 v10, v23

    goto :goto_8

    :cond_19
    move-object/from16 v16, v10

    move-object v10, v15

    :goto_8
    invoke-static {v0, v7, v14, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v10, v19

    invoke-virtual {v2, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v14

    if-eqz v14, :cond_1c

    const/4 v6, 0x0

    :goto_9
    const/4 v14, 0x4

    if-lt v6, v14, :cond_1b

    const-string v1, "detail"

    invoke-virtual {v4, v1}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1a

    invoke-static {v0, v7, v8, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v0, v7, v13, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_goal"

    const-string v6, "\ubaa9\ud45c \ub2ec\uc131 \u2014"

    invoke-static {v0, v7, v1, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_goal"

    invoke-static {v0, v7, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/4 v6, 0x0

    const/16 v14, 0x64

    invoke-virtual {v7, v1, v14, v6, v6}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    invoke-static {v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v6, Lorg/json/JSONArray;

    invoke-direct {v6}, Lorg/json/JSONArray;-><init>()V

    move/from16 v8, p1

    invoke-static {v0, v8, v6, v3, v5}, Lcom/aiderlog/v22app/WidgetApprovedV188;->weekChart(Landroid/content/Context;ILorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v3

    invoke-virtual {v7, v1, v3}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    goto :goto_a

    :cond_1a
    move/from16 v8, p1

    goto :goto_a

    :cond_1b
    const/16 v14, 0x64

    const/16 v18, 0x0

    new-instance v14, Ljava/lang/StringBuilder;

    move/from16 p5, v3

    const-string v3, "w188_level_"

    invoke-direct {v14, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v7, v3, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v14, "w188_level_"

    invoke-direct {v3, v14}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v0, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const-string v14, "outline"

    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v14

    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v14

    const-string v1, "setBackgroundResource"

    invoke-virtual {v7, v3, v1, v14}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    add-int/lit8 v6, v6, 0x1

    move-object/from16 v1, p4

    move/from16 v3, p5

    goto :goto_9

    :cond_1c
    invoke-static {v0, v7, v6, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 57
    :goto_a
    const-string v1, "_widgetOwnerV188"

    invoke-virtual {v4, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 58
    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    const-string v3, "action"

    if-eqz v1, :cond_1d

    new-instance v1, Landroid/content/Intent;

    invoke-direct {v1}, Landroid/content/Intent;-><init>()V

    invoke-virtual {v1, v3, v15}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    goto/16 :goto_e

    .line 59
    :cond_1d
    const-string v1, "calendarEvent"

    invoke-virtual {v2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_1e

    new-instance v1, Landroid/content/Intent;

    invoke-direct {v1}, Landroid/content/Intent;-><init>()V

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v5, "add-schedule:"

    invoke-direct {v2, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v3, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    goto :goto_e

    .line 60
    :cond_1e
    invoke-static/range {p3 .. p3}, Lcom/aiderlog/v22app/WidgetApprovedV188;->actionData(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    move-object/from16 v3, v17

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_21

    move-object/from16 v3, v16

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_1f

    goto :goto_b

    :cond_1f
    move-object/from16 v3, v20

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_20

    const-string v3, "add-memo"

    goto :goto_c

    :cond_20
    const-string v3, "open"

    goto :goto_c

    :cond_21
    :goto_b
    const-string v3, "add-todo"

    :goto_c
    move-object v5, v3

    const-string v3, "Routine"

    move-object/from16 v6, p2

    invoke-virtual {v6, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_22

    goto :goto_d

    :cond_22
    move-object v10, v2

    :goto_d
    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object/from16 v4, p3

    move-object v6, v10

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    .line 61
    :goto_e
    const-string v2, "w188_row"

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v7, v0, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    return-object v7
.end method

.method static label(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 22
    const-string v0, "RoutineAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    const-string p0, "\ub8e8\ud2f4"

    goto :goto_0

    :cond_0
    const-string v0, "RoutineCards"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string p0, "\ud558\ub098\uc758 \ub8e8\ud2f4"

    goto :goto_0

    :cond_1
    const-string v0, "RoutineStats"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    const-string p0, "\ub8e8\ud2f4 \ud1b5\uacc4"

    goto :goto_0

    :cond_2
    const-string v0, "PersonalWorkoutMeal"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string p0, "\uc2dd\uc0ac \u00b7 \uc6b4\ub3d9"

    goto :goto_0

    :cond_3
    const-string v0, "PersonalQuote"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4

    const-string p0, "\ub3c5\uc11c"

    goto :goto_0

    :cond_4
    const-string v0, "PersonalWorkflowAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_5

    const-string p0, "\ud22c\ub450 \u00b7 \uba54\ubaa8"

    goto :goto_0

    :cond_5
    const-string v0, "PersonalToday"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_6

    const-string p0, "\uc624\ub298\uc758 \uae30\ub85d"

    goto :goto_0

    :cond_6
    const-string p0, "\uc6b4\ub3d9 \ucc4c\ub9b0\uc9c0"

    :goto_0
    return-object p0
.end method

.method static openType(Lorg/json/JSONObject;)Ljava/lang/String;
    .locals 3

    .line 33
    const-string v0, "kind"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "stats"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v2, "routine"

    if-nez v1, :cond_1

    invoke-virtual {v0, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_0

    :cond_0
    const-string v1, "timeline"

    invoke-virtual {v0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    const-string v0, "type"

    const-string v1, "personal"

    invoke-virtual {p0, v0, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_1

    :cond_1
    :goto_0
    move-object v0, v2

    :cond_2
    :goto_1
    return-object v0
.end method

.method static ratio(Ljava/lang/String;)F
    .locals 1

    .line 23
    const-string v0, "RoutineAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    const p0, 0x3f23d70a    # 0.64f

    goto :goto_1

    :cond_0
    const-string v0, "RoutineCards"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    const p0, 0x3f1c28f6    # 0.61f

    goto :goto_1

    :cond_1
    const-string v0, "RoutineStats"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    const p0, 0x3f2e147b    # 0.68f

    goto :goto_1

    :cond_2
    const-string v0, "PersonalWorkoutMeal"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    const p0, 0x3f428f5c    # 0.76f

    goto :goto_1

    :cond_3
    const-string v0, "PersonalQuote"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4

    const p0, 0x3f30a3d7    # 0.69f

    goto :goto_1

    :cond_4
    const-string v0, "PersonalWorkflowAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_6

    const-string v0, "PersonalToday"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_5

    goto :goto_0

    :cond_5
    const p0, 0x3f2b851f    # 0.67f

    goto :goto_1

    :cond_6
    :goto_0
    const p0, 0x3f147ae1    # 0.58f

    :goto_1
    return p0
.end method

.method public static render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;
    .locals 18

    .line 64
    move-object/from16 v10, p0

    move/from16 v11, p1

    move-object/from16 v12, p2

    move/from16 v13, p6

    const-string v0, "widget_approved_v188"

    invoke-static {v10, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v14

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v6

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v7

    if-nez p4, :cond_0

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    move-object v8, v0

    goto :goto_0

    :cond_0
    move-object/from16 v8, p4

    .line 65
    :goto_0
    move-object/from16 v0, p0

    move-object v1, v14

    move/from16 v2, p1

    move-object/from16 v3, p4

    move/from16 v4, p5

    move/from16 v5, p6

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->appearance(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;II)V

    const-string v0, "Routine"

    invoke-virtual {v12, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    move-object v1, v0

    goto :goto_1

    :cond_1
    const-string v1, "DayLog"

    :goto_1
    const-string v2, "widget_title"

    invoke-static {v10, v14, v2, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/high16 v2, 0x41600000    # 14.0f

    invoke-static {v10, v11, v13, v2}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v2

    const/4 v3, 0x2

    invoke-virtual {v14, v1, v3, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 66
    invoke-virtual {v12, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "today"

    invoke-virtual {v7, v1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->shortDay(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_2

    :cond_2
    invoke-static/range {p2 .. p2}, Lcom/aiderlog/v22app/WidgetApprovedV188;->label(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    :goto_2
    const-string v1, "widget_subtitle"

    invoke-static {v10, v14, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v0

    invoke-static {v10, v14, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/high16 v1, 0x41100000    # 9.0f

    invoke-static {v10, v11, v13, v1}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v1

    invoke-virtual {v14, v0, v3, v1}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 67
    const-string v0, "widget_root"

    invoke-static {v10, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, ""

    invoke-static {v10, v11, v12, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v14, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-static {v10, v11, v12, v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v4

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static/range {p2 .. p2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v15, "@right"

    invoke-virtual {v0, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v10, v11, v0, v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v16

    const-string v0, "PersonalWorkflowAll"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    const-string v0, "w165_secondary"

    invoke-static {v10, v14, v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 68
    const-string v0, "w189_todo_heading"

    invoke-static {v10, v14, v0, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v1, "w189_memo_heading"

    invoke-static {v10, v14, v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetApprovedV188;->accent(Ljava/lang/String;)I

    move-result v2

    invoke-static {v10, v14, v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetApprovedV188;->accent(Ljava/lang/String;)I

    move-result v0

    invoke-static {v10, v14, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    .line 69
    const-string v0, "accessState"

    invoke-virtual {v6, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "needs-login"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_3

    const-string v0, "\ub85c\uadf8\uc778 \ud544\uc694"

    goto :goto_3

    :cond_3
    const-string v1, "sync-required"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4

    const-string v0, "\ub3d9\uae30\ud654 \ud544\uc694"

    goto :goto_3

    :cond_4
    const-string v0, "\uae30\ub85d \uc5c6\uc74c"

    :goto_3
    const-string v1, "widget_empty"

    invoke-static {v10, v14, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v4}, Ljava/util/List;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_5

    invoke-interface/range {v16 .. v16}, Ljava/util/List;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_5

    const/4 v0, 0x1

    goto :goto_4

    :cond_5
    const/4 v0, 0x0

    :goto_4
    invoke-static {v10, v14, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 70
    const-string v5, "widget_items_v164"

    const-string v6, "widget_preview_rows_v164"

    move-object/from16 v0, p0

    move-object v1, v14

    move/from16 v2, p1

    move-object/from16 v3, p2

    move/from16 v7, p3

    move-object/from16 v8, p4

    move/from16 v17, v9

    move/from16 v9, p6

    invoke-static/range {v0 .. v9}, Lcom/aiderlog/v22app/WidgetApprovedV188;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;I)V

    .line 71
    if-eqz v17, :cond_6

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static/range {p2 .. p2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    const-string v5, "w165_secondary_list"

    const-string v6, "w165_secondary_preview"

    move-object/from16 v0, p0

    move-object v1, v14

    move/from16 v2, p1

    move-object/from16 v4, v16

    move/from16 v7, p3

    move-object/from16 v8, p4

    move/from16 v9, p6

    invoke-static/range {v0 .. v9}, Lcom/aiderlog/v22app/WidgetApprovedV188;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;Ljava/lang/String;Ljava/lang/String;ZLjava/lang/String;I)V

    :cond_6
    return-object v14
.end method

.method static renderRow(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 40

    .line 103
    move-object/from16 v7, p0

    move/from16 v8, p1

    move/from16 v9, p5

    const-string v10, "minutes"

    const-string v11, "w188_title"

    :try_start_0
    new-instance v12, Lorg/json/JSONObject;

    move-object/from16 v1, p3

    invoke-direct {v12, v1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v12, v1}, Lcom/aiderlog/v22app/WidgetApprovedV188;->validOwner(Lorg/json/JSONObject;Lorg/json/JSONObject;)Z

    move-result v2

    if-nez v2, :cond_0

    invoke-static {v12, v1}, Lcom/aiderlog/v22app/WidgetApprovedV188;->structuralOwner(Lorg/json/JSONObject;Lorg/json/JSONObject;)Z

    move-result v1

    if-nez v1, :cond_0

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->cleared(Landroid/content/Context;)Landroid/widget/RemoteViews;

    move-result-object v1

    return-object v1

    :cond_0
    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetApprovedV188;->actionData(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v13

    invoke-static/range {p2 .. p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v14

    const-string v1, "kind"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v15

    if-nez p4, :cond_1

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v1

    move-object v6, v1

    goto :goto_0

    :cond_1
    move-object/from16 v6, p4

    :goto_0
    invoke-static {v7, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->accent(Ljava/lang/String;)I

    move-result v4

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v3

    .line 104
    const-string v1, "meals"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_40

    const-string v1, "miniRoutines"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    move-object v10, v11

    move-object/from16 v31, v14

    const/4 v15, 0x0

    goto/16 :goto_1f

    .line 105
    :cond_2
    const-string v1, "_emptyV189"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_3

    move-object/from16 v1, p0

    move/from16 v2, p1

    move-object v3, v14

    move-object v4, v12

    move-object v5, v6

    move/from16 v6, p5

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->emptyView(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v1

    return-object v1

    .line 106
    :cond_3
    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v1

    invoke-virtual {v1}, Landroid/util/SizeF;->getWidth()F

    move-result v1

    invoke-static {v15, v12, v1}, Lcom/aiderlog/v22app/WidgetApprovedV188;->template(Ljava/lang/String;Lorg/json/JSONObject;F)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v1, v6}, Lcom/aiderlog/v22app/WidgetThemeV190;->rowView(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v1

    invoke-static {v7, v1, v15, v12, v6}, Lcom/aiderlog/v22app/WidgetThemeV190;->rowStyle(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;)V

    .line 107
    const-string v2, "healthMetrics"

    invoke-virtual {v15, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_3

    const-string v16, "\u2014"

    move-object/from16 v17, v10

    const-string v10, "w188_row"

    if-eqz v2, :cond_7

    const/4 v2, 0x0

    :goto_1
    const/4 v4, 0x3

    if-lt v2, v4, :cond_4

    :try_start_1
    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v9

    const-string v5, "open"

    const-string v6, "health"

    move-object v15, v1

    move-object v1, v13

    move/from16 v2, p1

    move-object v3, v14

    move-object v4, v12

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v15, v9, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    return-object v15

    :cond_4
    move-object v15, v1

    const-string v1, "weight"

    const-string v4, "muscle"

    const-string v6, "fat"

    filled-new-array {v1, v4, v6}, [Ljava/lang/String;

    move-result-object v1

    aget-object v1, v1, v2

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v6, "w189_metric_value_"

    invoke-direct {v4, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v6

    if-nez v6, :cond_6

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v6

    if-nez v6, :cond_5

    goto :goto_2

    :cond_5
    invoke-static {v12, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    goto :goto_3

    :cond_6
    :goto_2
    move-object/from16 v1, v16

    :goto_3
    invoke-static {v7, v15, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v4, "w189_metric_value_"

    invoke-direct {v1, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v15, v1, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v4, "w189_metric_label_"

    invoke-direct {v1, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v15, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v4, "w189_metric_unit_"

    invoke-direct {v1, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v15, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    add-int/lit8 v2, v2, 0x1

    move-object v1, v15

    goto/16 :goto_1

    .line 108
    :cond_7
    move-object v2, v1

    const-string v1, "routineSummary"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_3

    move-object/from16 p3, v6

    const-string v6, "total"

    const-string v8, " / "

    const-string v9, "w188_progress"

    move/from16 v18, v4

    const-string v4, "w188_meta"

    if-eqz v1, :cond_9

    :try_start_2
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v15, "\uc624\ub298 "

    invoke-direct {v1, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v15, "todayDone"

    invoke-virtual {v12, v15}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v15

    invoke-virtual {v1, v15}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v2, v11, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v8

    invoke-virtual {v1, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v8, " \uc644\ub8cc"

    invoke-virtual {v1, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v2, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v2, v11, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v2, v4, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v12, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    if-lez v3, :cond_8

    const-string v3, "todayDone"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    int-to-float v3, v3

    const/high16 v4, 0x42c80000    # 100.0f

    mul-float/2addr v3, v4

    invoke-virtual {v12, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    int-to-float v4, v4

    div-float/2addr v3, v4

    invoke-static {v3}, Ljava/lang/Math;->round(F)I

    move-result v3

    goto :goto_4

    :cond_8
    const/4 v3, 0x0

    :goto_4
    const/16 v4, 0x64

    const/4 v5, 0x0

    invoke-virtual {v2, v1, v4, v3, v5}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    const-string v5, "open"

    const-string v6, "routine"

    move-object v1, v13

    move-object v9, v2

    move/from16 v2, p1

    move-object v3, v14

    move-object v4, v12

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v9, v8, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    return-object v9

    .line 109
    :cond_9
    const/16 v19, 0x64

    const/16 v20, 0x0

    const-string v1, "routineMini"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_3

    move-object/from16 p2, v8

    const-string v8, "title"

    move-object/from16 p4, v9

    const-string v9, "level"

    move-object/from16 v21, v15

    const-string v15, "w188_check"

    move-object/from16 v22, v6

    const-string v6, ""

    const/16 v23, 0x1

    if-eqz v1, :cond_d

    :try_start_3
    invoke-virtual {v12, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_a

    invoke-virtual {v12, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v3, "SKIP"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_a

    move/from16 v20, v23

    :cond_a
    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v2, v11, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    if-eqz v20, :cond_b

    const-string v1, "\u2713"

    goto :goto_5

    :cond_b
    move-object v1, v6

    :goto_5
    invoke-static {v7, v2, v15, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v2, v11, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move/from16 v1, v18

    invoke-static {v7, v2, v15, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    const-string v5, "open"

    const-string v9, "routine"

    move-object v1, v13

    move-object v10, v2

    move/from16 v2, p1

    move-object v3, v14

    move-object v4, v12

    move-object/from16 v24, v6

    move-object v6, v9

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v10, v8, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {v7, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v8

    const-string v5, "routine"

    if-eqz v20, :cond_c

    move-object/from16 v6, v24

    goto :goto_6

    :cond_c
    const-string v1, "MINI"

    move-object v6, v1

    :goto_6
    move-object v1, v13

    move/from16 v2, p1

    move-object v3, v14

    move-object v4, v12

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v10, v8, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    return-object v10

    .line 110
    :cond_d
    move-object/from16 v24, v6

    move/from16 v1, v18

    move-object v6, v2

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v7, v6, v11, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v6, v11, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v2, "note"

    move-object/from16 v18, v15

    move-object/from16 v15, v21

    invoke-virtual {v15, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_f

    const-string v2, "quote"

    invoke-virtual {v15, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_f

    const-string v2, "routine"

    invoke-virtual {v15, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_e

    const-string v2, "detail"

    invoke-virtual {v12, v2}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_f

    :cond_e
    invoke-static {v7, v6, v4, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    :cond_f
    invoke-static {v7, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    move/from16 v21, v1

    const-string v1, "stats"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_12

    const-string v1, "today"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_10

    goto :goto_7

    :cond_10
    const-string v1, "meal"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_11

    const/16 v1, 0xa

    goto :goto_8

    :cond_11
    const/16 v1, 0xb

    goto :goto_8

    :cond_12
    :goto_7
    const/16 v1, 0x1e

    :goto_8
    int-to-float v1, v1

    move-object/from16 v27, p2

    move-object/from16 v28, p4

    move-object/from16 v26, v8

    move-object/from16 p2, v9

    move/from16 v8, p1

    move/from16 v9, p5

    invoke-static {v7, v8, v9, v1}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v1

    move/from16 v29, v3

    const/4 v3, 0x2

    invoke-virtual {v6, v2, v3, v1}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 111
    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const-string v25, "open"

    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetApprovedV188;->openType(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v30

    move-object v1, v13

    move/from16 v9, v20

    move/from16 v2, p1

    move/from16 v9, v29

    move-object/from16 v29, v13

    move v13, v3

    move-object v3, v14

    move-object v8, v4

    move-object/from16 v31, v14

    move/from16 v14, v21

    move-object v4, v12

    move/from16 v32, v5

    move-object/from16 v5, v25

    move-object/from16 v33, p3

    move-object/from16 v34, v22

    move-object v14, v6

    move-object/from16 v6, v30

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v14, v13, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 112
    const-string v1, "meal"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1
    :try_end_3
    .catch Ljava/lang/Exception; {:try_start_3 .. :try_end_3} :catch_3

    const-string v2, "time"

    const-string v3, "image"

    if-eqz v1, :cond_16

    :try_start_4
    const-string v1, "w188_photo"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v7, v14, v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->bitmap(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w188_empty"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    invoke-static {v7, v14, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v1, "w188_empty"

    invoke-static {v7, v14, v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "slot"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v3, "breakfast"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_13

    const-string v3, "\uc544\uce68"

    goto :goto_9

    :cond_13
    const-string v3, "lunch"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_14

    const-string v3, "\uc810\uc2ec"

    goto :goto_9

    :cond_14
    const-string v3, "dinner"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_15

    const-string v3, "\uc800\ub141"

    goto :goto_9

    :cond_15
    const-string v3, "\uac04\uc2dd"

    :goto_9
    invoke-static {v7, v14, v11, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v12, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v7, v14, v8, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "\uc2dd\uc0ac \uc0ac\uc9c4 \u00b7 "

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, " "

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v12, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v14, v3, v1}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    return-object v14

    .line 113
    :cond_16
    const-string v1, "routine"

    invoke-virtual {v15, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1
    :try_end_4
    .catch Ljava/lang/Exception; {:try_start_4 .. :try_end_4} :catch_3

    const-string v13, "w188_graph"

    const-string v6, "done"

    const-string v5, "percent"

    const-string v4, "w188_body"

    if-eqz v1, :cond_1f

    const/4 v10, 0x0

    :goto_a
    const/4 v1, 0x4

    if-lt v10, v1, :cond_1b

    .line 114
    :try_start_5
    const-string v1, "detail"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1a

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "streak"

    invoke-virtual {v12, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "\uc77c \uc5f0\uc18d"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v8, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v8, p2

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object v1

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v2, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "Text"

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-eqz v2, :cond_17

    const-string v1, "miniText"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    :cond_17
    invoke-static {v7, v14, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v14, v4, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "w189_goal"

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "\ubaa9\ud45c \ub2ec\uc131  "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "\uc77c / "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "goalDays"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_18

    goto :goto_b

    :cond_18
    const-string v3, "goalDays"

    invoke-static {v12, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v16

    :goto_b
    move-object/from16 v3, v16

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "\uc77c"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v7, v14, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_goal"

    invoke-static {v7, v14, v1, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v15, v28

    invoke-static {v7, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v12, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    const/16 v3, 0x64

    const/4 v4, 0x0

    invoke-virtual {v14, v1, v3, v2, v4}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    invoke-virtual {v12, v5}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_19

    invoke-virtual {v12, v5}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_19

    move/from16 v2, v23

    goto :goto_c

    :cond_19
    move v2, v4

    :goto_c
    invoke-static {v7, v14, v15, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v2, "week"

    invoke-static {v12, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    move/from16 v3, p1

    move/from16 v4, v21

    invoke-static {v7, v3, v2, v4, v9}, Lcom/aiderlog/v22app/WidgetApprovedV188;->weekChart(Landroid/content/Context;ILorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v2

    invoke-virtual {v14, v1, v2}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    :cond_1a
    return-object v14

    .line 113
    :cond_1b
    move/from16 v2, p1

    move/from16 v1, v21

    move-object/from16 v15, v28

    const/16 v3, 0x64

    const/16 v19, 0x0

    move-object/from16 v39, v8

    move-object/from16 v8, p2

    move-object/from16 p2, v13

    move-object/from16 v13, v39

    const-string v3, "MINI"

    move/from16 v18, v1

    const-string v1, "MORE"

    const-string v2, "MAX"

    move-object/from16 p3, v4

    const-string v4, "SKIP"

    filled-new-array {v3, v1, v2, v4}, [Ljava/lang/String;

    move-result-object v1

    aget-object v4, v1, v10

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "w188_level_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v4, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    if-eqz v17, :cond_1c

    move/from16 v1, v18

    goto :goto_d

    :cond_1c
    move v1, v9

    :goto_d
    invoke-static {v7, v14, v3, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v2, "setBackgroundResource"

    if-eqz v17, :cond_1d

    const-string v20, "selected"

    goto :goto_e

    :cond_1d
    const-string v20, "outline"

    :goto_e
    move-object/from16 p4, v4

    move-object/from16 v4, v20

    move-object/from16 v20, v8

    move-object/from16 v8, v33

    invoke-static {v8, v4}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v7, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v14, v1, v2, v4}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    const-string v21, "routine"
    :try_end_5
    .catch Ljava/lang/Exception; {:try_start_5 .. :try_end_5} :catch_3

    move/from16 v2, v18

    move-object/from16 v1, v29

    move-object/from16 v33, v8

    move-object/from16 v22, v11

    move/from16 v8, p1

    move v11, v2

    move/from16 v2, p1

    move-object/from16 v28, v15

    move-object v15, v3

    move-object/from16 v3, v31

    move-object/from16 v35, p3

    move-object/from16 p5, p4

    move/from16 v25, v9

    move v9, v4

    move-object v4, v12

    move-object/from16 v36, v5

    move-object/from16 v5, v21

    move-object v8, v6

    move-object/from16 v6, p5

    :try_start_6
    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v14, v9, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    invoke-static {v7, v15}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v2, Ljava/lang/StringBuilder;

    move-object/from16 v4, v26

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, " "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    move-object/from16 v3, p5

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    if-eqz v17, :cond_1e

    const-string v6, " \uc120\ud0dd\ub428"

    goto :goto_f

    :cond_1e
    move-object/from16 v6, v24

    :goto_f
    invoke-virtual {v2, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v14, v1, v2}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    add-int/lit8 v10, v10, 0x1

    move-object/from16 v26, v4

    move-object v6, v8

    move/from16 v21, v11

    move-object v8, v13

    move-object/from16 v11, v22

    move/from16 v9, v25

    move-object/from16 v4, v35

    move-object/from16 v5, v36

    move-object/from16 v13, p2

    move-object/from16 p2, v20

    goto/16 :goto_a

    .line 115
    :cond_1f
    move-object/from16 v35, v4

    move-object/from16 v36, v5

    move/from16 v25, v9

    move-object/from16 v22, v11

    move-object/from16 p2, v13

    move/from16 v11, v21

    move-object/from16 v4, v26

    move-object/from16 v1, v28

    const/16 v19, 0x0

    move-object v13, v8

    move-object v8, v6

    const-string v5, "todo"

    invoke-virtual {v15, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_23

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_20

    const-string v6, "\u2713"

    goto :goto_10

    :cond_20
    move-object/from16 v6, v24

    :goto_10
    move-object/from16 v2, v18

    invoke-static {v7, v14, v2, v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v14, v2, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v3, "dueAt"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v4

    const/4 v5, 0x5

    if-le v4, v5, :cond_21

    const/4 v4, 0x5

    invoke-virtual {v3, v4}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    const/16 v4, 0x2d

    const/16 v5, 0x2e

    invoke-virtual {v3, v4, v5}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v3

    :cond_21
    invoke-static {v7, v14, v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const/4 v4, 0x2

    const/high16 v5, 0x41000000    # 8.0f

    move/from16 v8, p1

    move/from16 v9, p5

    invoke-static {v7, v8, v9, v5}, Lcom/aiderlog/v22app/WidgetSizeV169;->sp(Landroid/content/Context;IIF)F

    move-result v5

    invoke-virtual {v14, v3, v4, v5}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    invoke-static {v7, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v9

    const-string v5, "todo"

    if-eqz v1, :cond_22

    const-string v1, "false"

    goto :goto_11

    :cond_22
    const-string v1, "true"

    :goto_11
    move-object v6, v1

    move-object/from16 v1, v29

    move/from16 v2, p1

    move-object/from16 v3, v31

    move-object v4, v12

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-virtual {v14, v9, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    return-object v14

    .line 116
    :cond_23
    move-object v5, v8

    move/from16 v6, v19

    const-string v8, "timeline"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_2a

    invoke-virtual {v12, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_24

    const-string v1, "\u00b7"

    goto :goto_12

    :cond_24
    invoke-virtual {v12, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    :goto_12
    invoke-static {v7, v14, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v14, v13, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "type"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v2, "w189_record_type"

    const-string v3, "schedule"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_25

    const-string v1, "\uc77c\uc815"

    goto :goto_13

    :cond_25
    const-string v3, "reading"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_26

    const-string v1, "\ub3c5\uc11c"

    goto :goto_13

    :cond_26
    const-string v3, "health"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_27

    const-string v1, "\uac74\uac15"

    goto :goto_13

    :cond_27
    const-string v3, "routine"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_28

    const-string v1, "\ub8e8\ud2f4"

    goto :goto_13

    :cond_28
    const-string v1, "\uae30\ub85d"

    :goto_13
    invoke-static {v7, v14, v2, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_record_type"

    move/from16 v2, v25

    invoke-static {v7, v14, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "schedule"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_29

    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "uid"

    const-string v3, "_widgetOwnerV188"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v1, v2, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v2, "selectedDate"

    const-string v3, "_widgetDateV188"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v1, v2, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    new-instance v2, Landroid/content/Intent;

    invoke-direct {v2}, Landroid/content/Intent;-><init>()V

    const-string v3, "action"

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "open-schedule-item-v168:"

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v2, v3, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v1

    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v14, v2, v1}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    :cond_29
    return-object v14

    .line 117
    :cond_2a
    move/from16 v2, v25

    const-string v8, "stats"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8
    :try_end_6
    .catch Ljava/lang/Exception; {:try_start_6 .. :try_end_6} :catch_1

    const-string v9, "w188_foot"

    if-eqz v8, :cond_2c

    :try_start_7
    const-string v1, "weekPercent"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_2b

    :goto_14
    move-object/from16 v1, v16

    goto :goto_15

    :cond_2b
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "weekPercent"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "%"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16
    :try_end_7
    .catch Ljava/lang/Exception; {:try_start_7 .. :try_end_7} :catch_1

    goto :goto_14

    :goto_15
    move-object/from16 v8, v22

    :try_start_8
    invoke-static {v7, v14, v8, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v14, v8, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "streak"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "\uc77c \uc5f0\uc18d"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "\uc774\ubc88 \uc8fc \ub2ec\uc131\ub960"

    move-object/from16 v3, v35

    invoke-static {v7, v14, v3, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v4, "\ub204\uc801 "

    invoke-direct {v1, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "cumulative"

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, "\ud68c    \uc624\ub298 "

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v4, "todayDone"

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    move-object/from16 v4, v27

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    move-object/from16 v4, v34

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v1, p2

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v4, "bars"

    const-string v5, "weekCounts"

    invoke-static {v12, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v5

    invoke-static {v4, v5, v11, v2, v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->chart(Ljava/lang/String;Lorg/json/JSONArray;III)Landroid/graphics/Bitmap;

    move-result-object v4

    invoke-virtual {v14, v1, v4}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V
    :try_end_8
    .catch Ljava/lang/Exception; {:try_start_8 .. :try_end_8} :catch_0

    move-object v6, v3

    move-object/from16 v22, v8

    move-object/from16 v21, v15

    move/from16 v10, v32

    goto/16 :goto_1e

    .line 126
    :catch_0
    move-exception v0

    move-object v10, v8

    goto/16 :goto_21

    .line 118
    :cond_2c
    move-object/from16 v37, p2

    move-object/from16 v8, v22

    move-object/from16 v38, v27

    move-object/from16 v6, v35

    :try_start_9
    const-string v8, "workout"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_30

    move-object/from16 v1, v17

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_2d

    :goto_16
    move-object/from16 v3, v16

    goto :goto_17

    :cond_2d
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-static {v12, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "\ubd84"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v16

    goto :goto_16

    :goto_17
    invoke-static {v7, v14, v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->workoutSummary(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_2e

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-static {v12, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v4, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "\ubd84"

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v3, v1}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_2e

    invoke-virtual {v1}, Ljava/lang/String;->length()I

    move-result v1

    invoke-virtual {v3, v1}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v3

    :cond_2e
    const/16 v1, 0xa

    const/16 v4, 0x20

    invoke-virtual {v3, v1, v4}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_2f

    const/4 v1, 0x0

    goto :goto_18

    :cond_2f
    move/from16 v1, v23

    :goto_18
    invoke-static {v7, v14, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v1, "w189_workout_icon"

    invoke-static {v7, v14, v1, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    move-object/from16 v21, v15

    move/from16 v10, v32

    goto/16 :goto_1e

    .line 119
    :cond_30
    const-string v8, "note"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_32

    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v3, "setBackgroundResource"

    const-string v4, "control"

    move-object/from16 v5, v33

    invoke-static {v5, v4}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v7, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v14, v1, v3, v4}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    const-string v1, "preview"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v8, v24

    invoke-static {v7, v14, v9, v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const/4 v1, 0x0

    invoke-static {v7, v14, v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v1, "preview"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_31

    const/4 v1, 0x0

    goto :goto_19

    :cond_31
    move/from16 v1, v23

    :goto_19
    invoke-static {v7, v14, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    move-object/from16 v21, v15

    move/from16 v10, v32

    goto/16 :goto_1e

    .line 120
    :cond_32
    move-object/from16 v8, v24

    const-string v10, "book"

    invoke-virtual {v15, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_37

    const-string v5, "w188_photo"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    invoke-static {v7, v14, v5, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->bitmap(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v5, "w188_cover_title"

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v7, v14, v5, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v4, "w188_cover_title"

    move/from16 v10, v32

    invoke-static {v7, v14, v4, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v4, "w188_cover_title"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    invoke-static {v7, v14, v4, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v3, "author"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v7, v14, v13, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v3, "status"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "finished"

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_33

    const-string v3, "\uc644\ub3c5"

    goto :goto_1a

    :cond_33
    const-string v3, "status"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "want"

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_34

    const-string v3, "\uc77d\uace0 \uc2f6\uc740 \ucc45"

    goto :goto_1a

    :cond_34
    const-string v3, "totalPages"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_35

    const-string v3, "\uc77d\ub294 \uc911"

    goto :goto_1a

    :cond_35
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "currentPage"

    invoke-static {v12, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move-object/from16 v4, v38

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "totalPages"

    invoke-static {v12, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "\ucabd"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    :goto_1a
    invoke-static {v7, v14, v6, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    move-object/from16 v4, v36

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v5

    const/16 v8, 0x64

    const/4 v11, 0x0

    invoke-virtual {v14, v3, v8, v5, v11}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_36

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v3

    if-nez v3, :cond_36

    move/from16 v3, v23

    goto :goto_1b

    :cond_36
    const/4 v3, 0x0

    :goto_1b
    invoke-static {v7, v14, v1, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    move-object/from16 v21, v15

    goto/16 :goto_1e

    .line 121
    :cond_37
    move/from16 v10, v32

    move-object/from16 v3, v36

    move-object/from16 v4, v38

    move-object/from16 v24, v8

    const-string v8, "quote"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_39

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "\u201c"

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "body"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v3, "\u201d"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "page"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_38

    move-object/from16 v1, v24

    goto :goto_1c

    :cond_38
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v3, "p. "

    invoke-direct {v1, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "page"

    invoke-static {v12, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    :goto_1c
    invoke-static {v7, v14, v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v21, v15

    goto/16 :goto_1e

    .line 122
    :cond_39
    const-string v8, "bookNext"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_3a

    const-string v1, "\uc77d\uace0 \uc2f6\uc740 \ucc45"

    invoke-static {v7, v14, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "w189_book_icon"

    invoke-static {v7, v14, v1, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    return-object v14

    .line 123
    :cond_3a
    const-string v8, "today"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_3b

    const-string v1, "date"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetApprovedV188;->weekday(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "date"

    invoke-virtual {v12, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v14, v6, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v21, v15

    goto/16 :goto_1e

    .line 124
    :cond_3b
    const-string v8, "challenge"

    invoke-virtual {v15, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_3d

    new-instance v8, Ljava/lang/StringBuilder;

    invoke-virtual {v12, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v16

    move-object/from16 v21, v15

    invoke-static/range {v16 .. v16}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v15

    invoke-direct {v8, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v8, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    const-string v8, "goal"

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v8

    invoke-virtual {v4, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v7, v14, v13, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v8, "variant"

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v8

    invoke-static {v8}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v8

    invoke-direct {v4, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v8, "target"

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v8

    if-eqz v8, :cond_3c

    move-object/from16 v8, v24

    goto :goto_1d

    :cond_3c
    new-instance v8, Ljava/lang/StringBuilder;

    const-string v13, " \u00b7 "

    invoke-direct {v8, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v13, "target"

    invoke-static {v12, v13}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v8, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    const-string v13, "unit"

    invoke-virtual {v12, v13}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v8, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v8

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    :goto_1d
    invoke-virtual {v4, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-static {v7, v14, v6, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    const/16 v8, 0x64

    const/4 v13, 0x0

    invoke-virtual {v14, v1, v8, v4, v13}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    move-object/from16 v1, v37

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    const-string v8, "challenge"

    const-string v13, "nodes"

    invoke-static {v12, v13}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v13

    const/4 v15, 0x0

    invoke-static {v8, v13, v11, v2, v15}, Lcom/aiderlog/v22app/WidgetApprovedV188;->chart(Ljava/lang/String;Lorg/json/JSONArray;III)Landroid/graphics/Bitmap;

    move-result-object v8

    invoke-virtual {v14, v4, v8}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v8, "streak"

    invoke-virtual {v12, v8}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v8

    invoke-static {v8}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v8

    invoke-direct {v4, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v8, "\uc77c \uc5f0\uc18d \u00b7 "

    invoke-virtual {v4, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "%"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v7, v14, v9, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "\ucc4c\ub9b0\uc9c0 "

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "\uc77c \uc644\ub8cc / "

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "goal"

    invoke-virtual {v12, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v4, "\uc77c"

    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v14, v1, v3}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    goto :goto_1e

    :cond_3d
    move-object/from16 v21, v15

    .line 125
    :goto_1e
    invoke-static {v7, v14, v6, v10}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v1, "stats"

    move-object/from16 v3, v21

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3e

    const-string v1, "note"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3e

    const-string v1, "quote"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_3e

    const-string v1, "challenge"

    invoke-virtual {v3, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_3f

    :cond_3e
    invoke-static {v7, v14, v9, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V
    :try_end_9
    .catch Ljava/lang/Exception; {:try_start_9 .. :try_end_9} :catch_1

    :cond_3f
    return-object v14

    .line 126
    :catch_1
    move-exception v0

    move-object/from16 v10, v22

    goto :goto_21

    .line 104
    :cond_40
    move-object v10, v11

    move-object/from16 v31, v14

    const/4 v15, 0x0

    :goto_1f
    :try_start_a
    const-string v1, "widget_v188_group"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v11

    const-string v1, "children"

    invoke-static {v12, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v12

    :goto_20
    invoke-virtual {v12}, Lorg/json/JSONArray;->length()I

    move-result v1

    if-lt v15, v1, :cond_41

    return-object v11

    :cond_41
    const-string v1, "w188_group"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v13

    invoke-virtual {v12, v15}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v1

    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v4

    move-object/from16 v1, p0

    move/from16 v2, p1

    move-object/from16 v3, v31

    move-object/from16 v5, p4

    move/from16 v6, p5

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetApprovedV188;->renderRow(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v1

    invoke-virtual {v11, v13, v1}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V
    :try_end_a
    .catch Ljava/lang/Exception; {:try_start_a .. :try_end_a} :catch_2

    add-int/lit8 v15, v15, 0x1

    goto :goto_20

    .line 126
    :catch_2
    move-exception v0

    goto :goto_21

    :catch_3
    move-exception v0

    move-object v10, v11

    :goto_21
    const-string v1, "widget_v188_quote"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v1

    const-string v2, "\uae30\ub85d \ub2e4\uc2dc \ubd88\ub7ec\uc624\uae30"

    invoke-static {v7, v1, v10, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    return-object v1
.end method

.method static row(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Lorg/json/JSONObject;
    .locals 2

    .line 25
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    const-string v1, "kind"

    invoke-static {v0, v1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string v0, "id"

    invoke-static {p0, v0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string p1, "title"

    invoke-static {p0, p1, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    return-object p0
.end method

.method public static rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;
    .locals 2
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

    .line 77
    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "@right"

    invoke-virtual {p2, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p2

    invoke-static {p3}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object p0

    invoke-static {v0, p2, v1, p3, p0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->buildRows(Ljava/lang/String;ZLorg/json/JSONObject;Lorg/json/JSONObject;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object p0

    return-object p0
.end method

.method static shortDay(Ljava/lang/String;)Ljava/lang/String;
    .locals 3

    .line 28
    const-string v0, "[0-9]{4}-[0-9]{2}-[0-9]{2}"

    invoke-virtual {p0, v0}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

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

    invoke-virtual {p0, v1}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result p0

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    goto :goto_0

    :cond_0
    const-string p0, "\u2014"

    :goto_0
    return-object p0
.end method

.method static structuralOwner(Lorg/json/JSONObject;Lorg/json/JSONObject;)Z
    .locals 1

    .line 27
    const-string v0, "_emptyV189"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    const-string v0, "_widgetOwnerV188"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

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

.method static supports(Ljava/lang/String;)Z
    .locals 1

    .line 21
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

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "PersonalWorkoutMeal"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "PersonalQuote"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "PersonalWorkflowAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "PersonalToday"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "PersonalWorkoutChallengeOnly"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-nez p0, :cond_0

    const/4 p0, 0x0

    return p0

    :cond_0
    const/4 p0, 0x1

    return p0
.end method

.method static template(Ljava/lang/String;Lorg/json/JSONObject;F)Ljava/lang/String;
    .locals 3

    .line 36
    const-string v0, "routineSummary"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    const-string p0, "widget_v189_routine_summary"

    goto :goto_1

    :cond_0
    const-string v0, "healthMetrics"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string p0, "widget_v189_health_metrics"

    goto :goto_1

    :cond_1
    const-string v0, "bookNext"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    const-string p0, "widget_v189_book_next"

    goto :goto_1

    :cond_2
    const-string v0, "routineMini"

    invoke-virtual {p0, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string p0, "widget_v189_mini_routine"

    goto :goto_1

    :cond_3
    const-string v0, "calendar"

    invoke-virtual {p0, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4

    const-string p0, "widget_v189_empty_calendar"

    goto :goto_1

    :cond_4
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_v188_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "routine"

    invoke-virtual {p0, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_7

    const-string p0, "detail"

    invoke-virtual {p1, p0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_5

    const-string p0, "routine_detail"

    goto :goto_0

    :cond_5
    const/high16 p0, 0x438c0000    # 280.0f

    cmpg-float p0, p2, p0

    if-gez p0, :cond_6

    const-string p0, "routine_narrow"

    goto :goto_0

    :cond_6
    move-object p0, v1

    :cond_7
    :goto_0
    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    :goto_1
    return-object p0
.end method

.method static validOwner(Lorg/json/JSONObject;Lorg/json/JSONObject;)Z
    .locals 1

    .line 31
    const-string v0, "_widgetOwnerV188"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_0

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->sameOwner(Ljava/lang/String;Lorg/json/JSONObject;)Z

    move-result p0

    if-eqz p0, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    const/4 p0, 0x0

    return p0
.end method

.method static weekChart(Landroid/content/Context;ILorg/json/JSONArray;II)Landroid/graphics/Bitmap;
    .locals 16

    .line 135
    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetSizeV169;->current(Landroid/content/Context;I)Landroid/util/SizeF;

    move-result-object v0

    invoke-virtual {v0}, Landroid/util/SizeF;->getWidth()F

    move-result v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetApprovedV188;->weekWidth(F)I

    move-result v0

    sget-object v1, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    const/16 v2, 0x88

    invoke-static {v0, v2, v1}, Landroid/graphics/Bitmap;->createBitmap(IILandroid/graphics/Bitmap$Config;)Landroid/graphics/Bitmap;

    move-result-object v1

    new-instance v2, Landroid/graphics/Canvas;

    invoke-direct {v2, v1}, Landroid/graphics/Canvas;-><init>(Landroid/graphics/Bitmap;)V

    new-instance v3, Landroid/graphics/Paint;

    const/4 v4, 0x3

    invoke-direct {v3, v4}, Landroid/graphics/Paint;-><init>(I)V

    sget-object v4, Landroid/graphics/Paint$Align;->CENTER:Landroid/graphics/Paint$Align;

    invoke-virtual {v3, v4}, Landroid/graphics/Paint;->setTextAlign(Landroid/graphics/Paint$Align;)V

    const/high16 v4, 0x41a00000    # 20.0f

    invoke-virtual {v3, v4}, Landroid/graphics/Paint;->setTextSize(F)V

    int-to-float v0, v0

    const/high16 v4, 0x40e00000    # 7.0f

    div-float/2addr v0, v4

    const v4, 0x3ea3d70a    # 0.32f

    mul-float/2addr v4, v0

    const/high16 v5, 0x41c00000    # 24.0f

    invoke-static {v5, v4}, Ljava/lang/Math;->min(FF)F

    move-result v4

    .line 136
    const/4 v5, 0x0

    :goto_0
    const/4 v6, 0x7

    if-lt v5, v6, :cond_0

    return-object v1

    :cond_0
    int-to-float v6, v5

    const/high16 v7, 0x3f000000    # 0.5f

    add-float/2addr v6, v7

    mul-float/2addr v6, v0

    move-object/from16 v7, p2

    invoke-virtual {v7, v5}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v8

    if-eqz v8, :cond_1

    move/from16 v9, p3

    goto :goto_1

    :cond_1
    invoke-static/range {p3 .. p3}, Lcom/aiderlog/v22app/WidgetThemeV190;->soft(I)I

    move-result v9

    :goto_1
    invoke-virtual {v3, v9}, Landroid/graphics/Paint;->setColor(I)V

    const/high16 v9, 0x42280000    # 42.0f

    invoke-virtual {v2, v6, v9, v4, v3}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    if-eqz v8, :cond_2

    const/4 v9, -0x1

    goto :goto_2

    :cond_2
    move/from16 v9, p4

    :goto_2
    invoke-virtual {v3, v9}, Landroid/graphics/Paint;->setColor(I)V

    if-eqz v8, :cond_3

    const-string v8, "\u2713"

    goto :goto_3

    :cond_3
    const-string v8, "\u00b7"

    :goto_3
    const/high16 v9, 0x42440000    # 49.0f

    invoke-virtual {v2, v8, v6, v9, v3}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    move/from16 v8, p4

    invoke-virtual {v3, v8}, Landroid/graphics/Paint;->setColor(I)V

    const-string v9, "\uc6d4"

    const-string v10, "\ud654"

    const-string v11, "\uc218"

    const-string v12, "\ubaa9"

    const-string v13, "\uae08"

    const-string v14, "\ud1a0"

    const-string v15, "\uc77c"

    filled-new-array/range {v9 .. v15}, [Ljava/lang/String;

    move-result-object v9

    aget-object v9, v9, v5

    const/high16 v10, 0x42d80000    # 108.0f

    invoke-virtual {v2, v9, v6, v10, v3}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    add-int/lit8 v5, v5, 0x1

    goto :goto_0
.end method

.method static weekWidth(F)I
    .locals 1

    .line 133
    const/high16 v0, 0x41800000    # 16.0f

    sub-float/2addr p0, v0

    const/high16 v0, 0x45000000    # 2048.0f

    invoke-static {v0, p0}, Ljava/lang/Math;->min(FF)F

    move-result p0

    const/high16 v0, 0x42400000    # 48.0f

    invoke-static {v0, p0}, Ljava/lang/Math;->max(FF)F

    move-result p0

    const/high16 v0, 0x40000000    # 2.0f

    mul-float/2addr p0, v0

    invoke-static {p0}, Ljava/lang/Math;->round(F)I

    move-result p0

    return p0
.end method

.method static weekday(Ljava/lang/String;)Ljava/lang/String;
    .locals 7

    .line 29
    const-string v0, "[0-9]{4}-[0-9]{2}-[0-9]{2}"

    invoke-virtual {p0, v0}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string p0, ""

    return-object p0

    :cond_0
    const-string v0, "\uc77c\uc694\uc77c"

    const-string v1, "\uc6d4\uc694\uc77c"

    const-string v2, "\ud654\uc694\uc77c"

    const-string v3, "\uc218\uc694\uc77c"

    const-string v4, "\ubaa9\uc694\uc77c"

    const-string v5, "\uae08\uc694\uc77c"

    const-string v6, "\ud1a0\uc694\uc77c"

    filled-new-array/range {v0 .. v6}, [Ljava/lang/String;

    move-result-object v0

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object p0

    const/4 v1, 0x7

    invoke-virtual {p0, v1}, Ljava/util/Calendar;->get(I)I

    move-result p0

    add-int/lit8 p0, p0, -0x1

    aget-object p0, v0, p0

    return-object p0
.end method
