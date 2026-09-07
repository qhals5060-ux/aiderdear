.class public final Lcom/aiderlog/v22app/WidgetDesignV165;
.super Ljava/lang/Object;
.source "WidgetDesignV165.java"


# static fields
.field public static final previewContent:Ljava/lang/ThreadLocal;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/lang/ThreadLocal<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field public static final previewOpacity:Ljava/lang/ThreadLocal;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/lang/ThreadLocal<",
            "Ljava/lang/Integer;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 30
    new-instance v0, Ljava/lang/ThreadLocal;

    invoke-direct {v0}, Ljava/lang/ThreadLocal;-><init>()V

    sput-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewContent:Ljava/lang/ThreadLocal;

    .line 31
    new-instance v0, Ljava/lang/ThreadLocal;

    invoke-direct {v0}, Ljava/lang/ThreadLocal;-><init>()V

    sput-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 29
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;
    .locals 0

    .line 36
    invoke-virtual {p0, p1}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p0

    if-nez p0, :cond_0

    new-instance p0, Lorg/json/JSONArray;

    invoke-direct {p0}, Lorg/json/JSONArray;-><init>()V

    :cond_0
    return-object p0
.end method

.method static action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    .locals 6

    .line 119
    const-string v0, "action"

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "uid"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v2

    const-string v4, "widgetId"

    invoke-static {v1, v4, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    const-string v2, "kind"

    invoke-static {v1, v2, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p2

    const-string v1, "op"

    invoke-static {p2, v1, p4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p2

    const-string v1, "id"

    invoke-virtual {p3, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {p2, v1, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p2

    const-string v2, "value"

    invoke-static {p2, v2, p5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p2

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object p0

    const-string v2, "today"

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    const-string v2, "date"

    invoke-static {p2, v2, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    const-string p2, "updatedAt"

    invoke-virtual {p3, p2}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;)J

    move-result-wide v4

    invoke-static {v4, v5}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v4

    const-string v5, "expectedUpdatedAt"

    invoke-static {p0, v5, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v4, "recordId"

    invoke-virtual {p3, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {p0, v4, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-virtual {p0, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v4, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, ":"

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p3, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p4

    invoke-virtual {p1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p4

    invoke-virtual {p1, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, p5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p3, p2}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;)J

    move-result-wide p2

    invoke-virtual {p1, p2, p3}, Ljava/lang/StringBuilder;->append(J)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const-string p2, "key"

    invoke-static {p0, p2, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    new-instance p1, Landroid/content/Intent;

    invoke-direct {p1}, Landroid/content/Intent;-><init>()V

    new-instance p2, Ljava/lang/StringBuilder;

    const-string p3, "widget-v165:"

    invoke-direct {p2, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {p0}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-static {p0}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p2, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p1, v0, p0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    return-object p0
.end method

.method static add(Ljava/util/List;Lorg/json/JSONArray;)V
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Lorg/json/JSONObject;",
            ">;",
            "Lorg/json/JSONArray;",
            ")V"
        }
    .end annotation

    .line 40
    const/4 v0, 0x0

    :goto_0
    invoke-virtual {p1}, Lorg/json/JSONArray;->length()I

    move-result v1

    if-lt v0, v1, :cond_0

    return-void

    :cond_0
    invoke-virtual {p1, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v1

    if-eqz v1, :cond_1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-interface {p0, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_1
    add-int/lit8 v0, v0, 0x1

    goto :goto_0
.end method

.method static base(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 32
    if-nez p0, :cond_0

    const-string p0, ""

    goto :goto_0

    :cond_0
    const-string v0, "@"

    invoke-virtual {p0, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object p0

    const/4 v0, 0x0

    aget-object p0, p0, v0

    :goto_0
    return-object p0
.end method

.method static bitmap(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V
    .locals 2

    .line 118
    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    if-eqz p3, :cond_1

    const-string v0, "data:image/"

    invoke-virtual {p3, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/16 v0, 0x2c

    :try_start_0
    invoke-virtual {p3, v0}, Ljava/lang/String;->indexOf(I)I

    move-result v0

    add-int/lit8 v0, v0, 0x1

    invoke-virtual {p3, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p3

    invoke-static {p3, v1}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    move-result-object p3

    array-length v0, p3

    invoke-static {p3, v1, v0}, Landroid/graphics/BitmapFactory;->decodeByteArray([BII)Landroid/graphics/Bitmap;

    move-result-object p3

    if-eqz p3, :cond_1

    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    invoke-virtual {p1, p0, p3}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p0

    :cond_1
    :goto_0
    return-void
.end method

.method static bulletRange(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/lang/String;
    .locals 1

    .line 74
    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object p0

    const-string p1, "Seven"

    invoke-virtual {p2, p1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result p1

    const/4 p2, 0x7

    if-eqz p1, :cond_0

    move p1, p2

    goto :goto_0

    :cond_0
    const/4 p1, 0x3

    :goto_0
    const-string v0, "rangeDays"

    invoke-virtual {p0, v0, p1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result p0

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object p1

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p1

    const-string v0, "today"

    invoke-virtual {p3, v0, p1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    if-ne p0, p2, :cond_1

    const-string p2, "weekDates"

    invoke-static {p3, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-lez v0, :cond_1

    invoke-static {p3, p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object p1

    const/4 p2, 0x0

    invoke-virtual {p1, p2}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object p1

    :cond_1
    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object p2

    add-int/lit8 p0, p0, -0x1

    const/4 p3, 0x5

    invoke-virtual {p2, p3, p0}, Ljava/util/Calendar;->add(II)V

    new-instance p0, Ljava/lang/StringBuilder;

    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v0

    invoke-static {p3, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    invoke-virtual {p1, v0}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p1

    invoke-static {p1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    invoke-direct {p0, p1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string p1, " \ufffd\ufffd "

    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1, p3}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static card(Ljava/lang/String;)Lorg/json/JSONObject;
    .locals 2

    .line 38
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    const-string v1, "kind"

    invoke-static {v0, v1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0

    return-object p0
.end method

.method static choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;
    .locals 4

    .line 44
    const/4 v0, 0x0

    move v1, v0

    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v1, v2, :cond_1

    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result p1

    if-lez p1, :cond_0

    invoke-virtual {p0, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object p0

    goto :goto_1

    :cond_0
    const/4 p0, 0x0

    :goto_1
    return-object p0

    :cond_1
    invoke-virtual {p0, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    if-eqz v2, :cond_2

    const-string v3, "id"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_2

    return-object v2

    :cond_2
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method

.method static component(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;ZLjava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 27

    .line 122
    move-object/from16 v7, p0

    move/from16 v8, p1

    move-object/from16 v9, p2

    move-object/from16 v10, p3

    move/from16 v11, p6

    const-string v0, "kind"

    const-string v6, "note"

    invoke-virtual {v10, v0, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    const-string v0, "group"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const/4 v14, 0x0

    if-nez v0, :cond_4e

    const-string v0, "stack"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    move v0, v14

    goto/16 :goto_37

    .line 123
    :cond_0
    const-string v0, "routineStats"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v15, "youtube"

    if-nez v0, :cond_4

    const-string v0, "workoutStats"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_4

    const-string v0, "trend"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    goto :goto_0

    :cond_1
    invoke-virtual {v12, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_2

    move-object v0, v6

    goto :goto_1

    :cond_2
    const-string v0, "meal"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string v0, "meal_slot"

    goto :goto_1

    :cond_3
    move-object v0, v12

    goto :goto_1

    :cond_4
    :goto_0
    const-string v0, "stats"

    .line 124
    :goto_1
    const-string v1, "book"

    invoke-virtual {v12, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v5, "detail"

    const-string v4, ""

    if-eqz v1, :cond_5

    invoke-virtual {v10, v5}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_5

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_book_detail_v168"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    if-eqz p4, :cond_6

    goto :goto_2

    :cond_5
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "_v165"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    if-eqz p4, :cond_6

    :goto_2
    const-string v1, "_cell"

    goto :goto_3

    :cond_6
    move-object v1, v4

    :goto_3
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v3

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v16

    if-nez p5, :cond_7

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    goto :goto_4

    :cond_7
    move-object/from16 v0, p5

    :goto_4
    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->ink(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-gez v11, :cond_8

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->font(Landroid/content/Context;I)F

    move-result v1

    goto :goto_5

    :cond_8
    const/high16 v1, 0x41380000    # 11.5f

    int-to-float v11, v11

    const v17, 0x3f4ccccd    # 0.8f

    mul-float v11, v11, v17

    add-float/2addr v1, v11

    :goto_5
    move v11, v1

    .line 125
    const-string v1, "meal"

    invoke-virtual {v12, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_c

    const-string v1, "w165_card_background"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->dark(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_9

    const-string v0, "widget_card_dark_v165"

    goto :goto_6

    :cond_9
    const-string v0, "day"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_a

    const-string v0, "widget_bullet_card_v168"

    goto :goto_6

    :cond_a
    const-string v0, "widget_card_v165"

    :goto_6
    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v3, v1, v0}, Landroid/widget/RemoteViews;->setImageViewResource(II)V

    sget-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewOpacity:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->get()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/Integer;

    if-nez v0, :cond_b

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v13, "widget_opacity_"

    invoke-direct {v1, v13}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const/16 v13, 0x64

    invoke-interface {v0, v1, v13}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v0

    goto :goto_7

    :cond_b
    invoke-virtual {v0}, Ljava/lang/Integer;->intValue()I

    move-result v0

    :goto_7
    const-string v1, "w165_card_background"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/16 v13, 0x64

    invoke-static {v13, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    invoke-static {v14, v0}, Ljava/lang/Math;->max(II)I

    move-result v0

    mul-int/lit16 v0, v0, 0xff

    int-to-float v0, v0

    const/high16 v13, 0x42c80000    # 100.0f

    div-float/2addr v0, v13

    invoke-static {v0}, Ljava/lang/Math;->round(F)I

    move-result v0

    const-string v13, "setImageAlpha"

    invoke-virtual {v3, v1, v13, v0}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 126
    :cond_c
    const-string v0, "w165_card"

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v13

    invoke-virtual {v12, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_d

    move-object/from16 v18, v15

    goto :goto_8

    :cond_d
    const-string v0, "open"

    move-object/from16 v18, v0

    :goto_8
    move-object/from16 v0, v16

    move/from16 v1, p1

    move v14, v2

    move-object/from16 v2, p2

    move-object v8, v3

    move-object/from16 v3, p3

    move-object/from16 v19, v4

    move-object/from16 v4, v18

    move-object/from16 v20, v5

    move-object v5, v12

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {v8, v13, v0}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    .line 127
    const-string v0, "meal"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_16

    const-string v0, "image"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "w165_photo"

    invoke-static {v7, v8, v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->bitmap(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "time"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v2, "w165_time"

    invoke-static {v7, v8, v2, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    const/4 v2, 0x1

    xor-int/2addr v1, v2

    const-string v2, "w165_time"

    invoke-static {v7, v8, v2, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v1, "rating"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v3

    move-object/from16 v4, v19

    if-nez v3, :cond_10

    const/4 v14, 0x0

    :goto_9
    const/4 v3, 0x5

    if-lt v14, v3, :cond_e

    goto :goto_b

    :cond_e
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    if-ge v14, v2, :cond_f

    const-string v4, "\ufffd\uc07e"

    goto :goto_a

    :cond_f
    const-string v4, "\ufffd\uc07f"

    :goto_a
    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    add-int/lit8 v14, v14, 0x1

    goto :goto_9

    :cond_10
    :goto_b
    const-string v2, "w165_rating"

    invoke-static {v7, v8, v2, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v2, "slot"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v3, "breakfast"

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_11

    const-string v2, "\ufffd\ube18\u79fb\ufffd"

    goto :goto_c

    :cond_11
    const-string v3, "lunch"

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_12

    const-string v2, "\ufffd\uc80f\ufffd\ub596"

    goto :goto_c

    :cond_12
    const-string v3, "dinner"

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_13

    const-string v2, "\ufffd\ufffd\ufffd\ub005"

    goto :goto_c

    :cond_13
    const-string v2, "\u5a9b\uafa9\ub587"

    :goto_c
    const-string v3, "w165_card"

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v4, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-eqz v2, :cond_14

    move-object/from16 v0, v19

    goto :goto_d

    :cond_14
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v5, " "

    invoke-direct {v2, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    :goto_d
    invoke-virtual {v4, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_15

    const-string v1, " \u8e42\uafa9\uc80f \u8a98\uba84\uc5ef\ufffd\uc830"

    goto :goto_e

    :cond_15
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, " \u8e42\uafa9\uc80f "

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    :goto_e
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, " \uca0c \u6e72\uacd5\uc909 \u8e42\ub2ff\ub9b0"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v8, v3, v0}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    return-object v8

    .line 128
    :cond_16
    const-string v0, "title"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v13, "w165_title"

    invoke-static {v7, v8, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v8, v13, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/high16 v1, 0x3f000000    # 0.5f

    add-float/2addr v1, v11

    const/4 v5, 0x2

    invoke-virtual {v8, v0, v5, v1}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 129
    const-string v0, "todo"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v4, "w165_body"

    if-nez v1, :cond_17

    const-string v1, "body"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v8, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v8, v4, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/high16 v2, 0x3f800000    # 1.0f

    sub-float v2, v11, v2

    invoke-virtual {v8, v1, v5, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 130
    :cond_17
    const-string v1, "workout"

    invoke-virtual {v12, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v3, "w165_meta"

    if-nez v1, :cond_18

    const-string v1, "day"

    invoke-virtual {v12, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_18

    invoke-static {v7, v8, v3, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const/high16 v2, 0x41200000    # 10.0f

    const/high16 v18, 0x40000000    # 2.0f

    sub-float v9, v11, v18

    invoke-static {v2, v9}, Ljava/lang/Math;->max(FF)F

    move-result v2

    invoke-virtual {v8, v1, v5, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    .line 131
    :cond_18
    invoke-virtual {v12, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_19

    invoke-virtual {v12, v15}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_1b

    :cond_19
    const-string v1, "preview"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v8, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "updatedAt"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;)J

    move-result-wide v1

    const-wide/16 v21, 0x0

    cmp-long v1, v1, v21

    if-lez v1, :cond_1a

    new-instance v1, Ljava/text/SimpleDateFormat;

    sget-object v2, Ljava/util/Locale;->KOREAN:Ljava/util/Locale;

    const-string v6, "MM.dd HH:mm"

    invoke-direct {v1, v6, v2}, Ljava/text/SimpleDateFormat;-><init>(Ljava/lang/String;Ljava/util/Locale;)V

    new-instance v2, Ljava/util/Date;

    const-string v6, "updatedAt"

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optLong(Ljava/lang/String;)J

    move-result-wide v5

    invoke-direct {v2, v5, v6}, Ljava/util/Date;-><init>(J)V

    invoke-virtual {v1, v2}, Ljava/text/SimpleDateFormat;->format(Ljava/util/Date;)Ljava/lang/String;

    move-result-object v1

    goto :goto_f

    :cond_1a
    move-object/from16 v1, v19

    :goto_f
    invoke-static {v7, v8, v3, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v1, "preview"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    const/4 v2, 0x1

    xor-int/2addr v1, v2

    invoke-static {v7, v8, v4, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 132
    :cond_1b
    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v6, "done"

    if-eqz v1, :cond_24

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1c

    const-string v2, "\ufffd\uc42f"

    goto :goto_10

    :cond_1c
    move-object/from16 v2, v19

    :goto_10
    const-string v5, "w165_check"

    invoke-static {v7, v8, v5, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-eqz v1, :cond_1d

    const-string v9, "widget_check_done_v165"

    goto :goto_11

    :cond_1d
    const-string v9, "widget_check_v165"

    :goto_11
    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v9

    const-string v15, "setBackgroundResource"

    invoke-virtual {v8, v2, v15, v9}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    if-eqz v1, :cond_1e

    const/16 v9, 0x11

    goto :goto_12

    :cond_1e
    const/4 v9, 0x1

    :goto_12
    const-string v15, "setPaintFlags"

    invoke-virtual {v8, v2, v15, v9}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    invoke-static {v7, v8, v13, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    invoke-static {v7, v8, v5, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    const-string v2, "dueAt"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v7, v8, v3, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v2, "dueAt"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    const/4 v9, 0x1

    xor-int/2addr v2, v9

    invoke-static {v7, v8, v3, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v7, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v9

    const-string v2, "PersonalBullet"

    move-object/from16 v15, p2

    invoke-virtual {v15, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_20

    const-string v2, "PersonalToday"

    invoke-virtual {v15, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_1f

    goto :goto_13

    :cond_1f
    move-object v5, v0

    goto :goto_14

    :cond_20
    :goto_13
    const-string v2, "open"

    move-object v5, v2

    :goto_14
    const-string v2, "PersonalBullet"

    invoke-virtual {v15, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_23

    const-string v2, "PersonalToday"

    invoke-virtual {v15, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_21

    goto :goto_15

    :cond_21
    if-eqz v1, :cond_22

    const-string v0, "false"

    goto :goto_15

    :cond_22
    const-string v0, "true"

    :cond_23
    :goto_15
    move-object/from16 v18, v0

    move-object/from16 v0, v16

    move/from16 v1, p1

    move-object/from16 v2, p2

    move-object v15, v3

    move-object/from16 v3, p3

    move/from16 p5, v11

    move-object v11, v4

    move-object v4, v5

    move-object/from16 v5, v18

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {v8, v9, v0}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    goto :goto_16

    :cond_24
    move-object v15, v3

    move/from16 p5, v11

    move-object v11, v4

    .line 133
    :goto_16
    const-string v0, "routine"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v9, "percent"

    if-nez v0, :cond_25

    const-string v0, "challenge"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_25

    const-string v0, "book"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_25

    const-string v0, "workflow"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_27

    :cond_25
    invoke-virtual {v10, v9}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_26

    invoke-virtual {v10, v9}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_26

    const/4 v0, 0x1

    goto :goto_17

    :cond_26
    const/4 v0, 0x0

    :goto_17
    const-string v1, "w165_progress"

    invoke-static {v7, v8, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v0, "w165_progress"

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/16 v1, 0x64

    invoke-virtual {v10, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    const/4 v3, 0x0

    invoke-virtual {v8, v0, v1, v2, v3}, Landroid/widget/RemoteViews;->setProgressBar(IIIZ)V

    .line 134
    :cond_27
    const-string v0, "routine"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-wide/16 v21, 0x0

    const-string v5, " / "

    const-string v4, "w165_graph"

    if-eqz v0, :cond_2d

    const-string v0, "goalDays"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_29

    const-string v0, "goalDays"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v0

    cmpg-double v0, v0, v21

    if-gtz v0, :cond_28

    goto :goto_18

    :cond_28
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "goalDays"

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "\ufffd\uc52a \uca0c "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v10, v9}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "%"

    goto :goto_19

    :cond_29
    :goto_18
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "\ufffd\uc52a \uca0c \uf9cf\u247a\ubab4 \ufffd\ubfbe\ufffd\uc4ec"

    :goto_19
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "level"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/String;->toLowerCase()Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "Text"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v3, v20

    invoke-virtual {v10, v3}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    invoke-static {v7, v8, v4, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-virtual {v10, v3}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2a

    invoke-static {v7, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "week"

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    const-string v2, "nodes"

    move-object/from16 v20, v3

    const/4 v3, 0x0

    invoke-static {v2, v1, v14, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v1

    invoke-virtual {v8, v0, v1}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    goto :goto_1a

    :cond_2a
    move-object/from16 v20, v3

    :goto_1a
    const/4 v3, 0x0

    :goto_1b
    const/4 v0, 0x4

    if-lt v3, v0, :cond_2b

    move-object/from16 v25, v5

    move-object/from16 p6, v6

    move-object/from16 v23, v9

    move-object/from16 p4, v20

    move-object v9, v4

    goto/16 :goto_1d

    :cond_2b
    const-string v0, "MINI"

    const-string v1, "MORE"

    const-string v2, "MAX"

    move-object/from16 p4, v4

    const-string v4, "SKIP"

    filled-new-array {v0, v1, v2, v4}, [Ljava/lang/String;

    move-result-object v0

    aget-object v4, v0, v3

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "w165_level_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->color(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;I)V

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "w165_level_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "level"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v4, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2c

    const-string v1, "widget_stage_selected_v168"

    goto :goto_1c

    :cond_2c
    const-string v1, "widget_stage_v168"

    :goto_1c
    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v2, "setBackgroundResource"

    invoke-virtual {v8, v0, v2, v1}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "w165_level_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v18, "routine"

    move-object/from16 v0, v16

    move/from16 v1, p1

    move-object/from16 p6, v6

    move v6, v2

    move-object/from16 v2, p2

    move-object/from16 v23, v9

    move-object/from16 v9, v20

    move/from16 v20, v3

    move-object/from16 v3, p3

    move-object/from16 v24, v4

    move-object/from16 v26, v9

    move-object/from16 v9, p4

    move-object/from16 p4, v26

    move-object/from16 v4, v18

    move-object/from16 v25, v5

    move-object/from16 v5, v24

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {v8, v6, v0}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    add-int/lit8 v3, v20, 0x1

    move-object/from16 v20, p4

    move-object/from16 v6, p6

    move-object v4, v9

    move-object/from16 v9, v23

    move-object/from16 v5, v25

    goto/16 :goto_1b

    :cond_2d
    move-object/from16 v25, v5

    move-object/from16 p6, v6

    move-object/from16 v23, v9

    move-object/from16 p4, v20

    move-object v9, v4

    .line 135
    :goto_1d
    const-string v0, "language"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v6, "minutes"

    const/4 v5, 0x7

    if-eqz v0, :cond_30

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "streak"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "\ufffd\uc52a \ufffd\ubff0\ufffd\ub0fd \uca0c \ufffd\uc520\u8e30\ufffd \u4e8c\ufffd "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "weekCount"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, " / 7"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "weekDates"

    invoke-static {v10, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-ne v2, v5, :cond_2e

    new-instance v2, Ljava/lang/StringBuilder;

    const/4 v3, 0x0

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, " \ufffd\ufffd "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const/4 v3, 0x6

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    goto :goto_1e

    :cond_2e
    move-object/from16 v4, v19

    :goto_1e
    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v0

    invoke-direct {v1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2f

    move-object/from16 v4, v19

    goto :goto_1f

    :cond_2f
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, " \uca0c "

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {v10, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\u907a\ufffd"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    :goto_1f
    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "week"

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    const-string v2, "stars"

    const/4 v3, 0x0

    invoke-static {v2, v1, v14, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v1

    invoke-virtual {v8, v0, v1}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "week"

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->weekDescription(Lorg/json/JSONArray;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v8, v0, v1}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    const-string v0, "w165_action"

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    const-string v0, "language"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v18

    const-string v20, "language"

    move-object/from16 v0, v16

    move/from16 v1, p1

    move-object/from16 v2, p2

    move-object/from16 v3, p3

    move-object/from16 v16, v6

    move v6, v4

    move-object/from16 v4, v20

    move/from16 v20, v14

    move v14, v5

    move-object/from16 v5, v18

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->action(Lorg/json/JSONObject;ILjava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object v0

    invoke-virtual {v8, v6, v0}, Landroid/widget/RemoteViews;->setOnClickFillInIntent(ILandroid/content/Intent;)V

    goto :goto_20

    :cond_30
    move-object/from16 v16, v6

    move/from16 v20, v14

    move v14, v5

    .line 136
    :goto_20
    const-string v0, "routineStats"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v1, "total"

    if-eqz v0, :cond_33

    const-string v0, "\ufffd\uc520\u8e30\ufffd \u4e8c\ufffd"

    invoke-static {v7, v8, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "weekPercent"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_31

    const-string v0, "\u6e72\uacd5\uc909 \ufffd\ubfbe\ufffd\uc4ec"

    goto :goto_21

    :cond_31
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "weekPercent"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "%"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    :goto_21
    invoke-static {v7, v8, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "streak"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "\ufffd\uc52a \ufffd\ubff0\ufffd\ub0fd\n\ufffd\ub2bb\ufffd\uc7fb "

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "cumulative"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\ufffd\uc276 \uca0c \uf9de\uafaa\ubefe "

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\u5a9b\ufffd"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "weekDates"

    invoke-static {v10, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-ne v2, v14, :cond_32

    new-instance v2, Ljava/lang/StringBuilder;

    const/4 v3, 0x0

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, " \ufffd\ufffd "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const/4 v3, 0x6

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    goto :goto_22

    :cond_32
    move-object/from16 v4, v19

    :goto_22
    const-string v0, "w165_foot"

    invoke-static {v7, v8, v0, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v2, "weekCounts"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    const-string v3, "bars"

    move/from16 v4, v20

    const/4 v5, 0x0

    invoke-static {v3, v2, v4, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v2

    invoke-virtual {v8, v0, v2}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    goto :goto_23

    :cond_33
    move/from16 v4, v20

    .line 137
    :goto_23
    const-string v0, "workoutStats"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_36

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "\uf9e4\uc493\ub810 "

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "period"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\ufffd\uc52a"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "\ufffd\uc2ab\ufffd\ub8de "

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "count"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\ufffd\uc276"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_34

    const-string v0, "\ufffd\uc2ab\ufffd\ub8de \ufffd\ub586\u5a9b\ufffd \u6e72\uacd5\uc909 \ufffd\ubfbe\ufffd\uc4ec"

    goto :goto_24

    :cond_34
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "\u73e5\ufffd "

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\u907a\ufffd \uca0c \ufffd\ub8ca\u6d39\ufffd "

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "average"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\u907a\ufffd\n\uf9e4\uc496\uc623 "

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "longest"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\u907a\ufffd"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    :goto_24
    invoke-static {v7, v8, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "w165_foot"

    const-string v2, "\ufffd\uc282\ufffd\uc52a\u8e42\ufffd \ufffd\uc2ab\ufffd\ub8de \ufffd\ub586\u5a9b\ufffd (\u907a\ufffd)"

    invoke-static {v7, v8, v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "summaryOnly"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    const/4 v2, 0x1

    xor-int/2addr v0, v2

    invoke-static {v7, v8, v9, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v0, "chartOnly"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_35

    const/4 v0, 0x0

    invoke-static {v7, v8, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v7, v8, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v7, v8, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    goto :goto_25

    :cond_35
    const/4 v0, 0x0

    :goto_25
    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    const-string v3, "values"

    invoke-static {v10, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v3

    const-string v5, "bars"

    invoke-static {v5, v3, v4, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v3

    invoke-virtual {v8, v2, v3}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    .line 138
    :cond_36
    const-string v0, "trend"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_38

    const-string v0, "values"

    invoke-static {v10, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lez v2, :cond_37

    new-instance v2, Ljava/lang/StringBuilder;

    const/4 v3, 0x0

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v5

    invoke-static {v5, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->fmt(D)Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, " \ufffd\ub102 "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v3

    const/4 v5, 0x1

    sub-int/2addr v3, v5

    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v5

    invoke-static {v5, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->fmt(D)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "unit"

    invoke-virtual {v10, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    goto :goto_26

    :cond_37
    const-string v2, "\u6e72\uacd5\uc909 \ufffd\ubfbe\ufffd\uc4ec"

    :goto_26
    invoke-static {v7, v8, v15, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v2, v19

    invoke-static {v7, v8, v11, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v3, Ljava/lang/StringBuilder;

    const-string v5, "\uf9e4\uc493\ub810 "

    invoke-direct {v3, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v5

    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v3

    const-string v5, "\ufffd\uc276 \uca0c \ufffd\ube46\uf9cf\ufffd \ufffd\uc604\uf9e3\ufffd \u8e30\ubdbf\uc41e"

    invoke-virtual {v3, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    const-string v5, "foot"

    invoke-virtual {v10, v5, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v5, "w165_foot"

    invoke-static {v7, v8, v5, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v3

    const-string v5, "dash"

    invoke-virtual {v10, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v5

    const-string v6, "trend"

    invoke-static {v6, v0, v4, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v0

    invoke-virtual {v8, v3, v0}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    goto :goto_27

    :cond_38
    move-object/from16 v2, v19

    .line 139
    :goto_27
    const-string v0, "challenge"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3c

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v3, "DAY "

    invoke-direct {v0, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "day"

    invoke-virtual {v10, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    move-object/from16 v3, v25

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v5, "goal"

    invoke-virtual {v10, v5}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v5

    invoke-virtual {v0, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    move-object/from16 v0, p4

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_39

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "variant"

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v6

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v6, " "

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "target"

    invoke-static {v10, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "unit"

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "\n"

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "streak"

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "\ufffd\uc52a \ufffd\ubff0\ufffd\ub0fd"

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    goto :goto_28

    :cond_39
    move-object v5, v2

    :goto_28
    invoke-static {v7, v8, v11, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v5

    invoke-static {v7, v8, v9, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_3b

    const-string v0, "nodes"

    invoke-static {v10, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    new-instance v5, Lorg/json/JSONArray;

    invoke-direct {v5}, Lorg/json/JSONArray;-><init>()V

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v6

    sub-int/2addr v6, v14

    const/4 v14, 0x0

    invoke-static {v14, v6}, Ljava/lang/Math;->max(II)I

    move-result v6

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v14

    move-object/from16 v19, v2

    new-instance v2, Ljava/lang/StringBuilder;

    move-object/from16 v18, v8

    const-string v8, "widget_challenge_page_"

    invoke-direct {v2, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move/from16 v8, p1

    move-object/from16 p2, v1

    move-object/from16 v1, v18

    invoke-virtual {v2, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const/4 v8, 0x0

    invoke-interface {v14, v2, v8}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v2

    invoke-static {v6, v2}, Ljava/lang/Math;->min(II)I

    move-result v2

    invoke-static {v8, v2}, Ljava/lang/Math;->max(II)I

    move-result v2

    move v6, v2

    :goto_29
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v14

    add-int/lit8 v8, v2, 0x7

    invoke-static {v14, v8}, Ljava/lang/Math;->min(II)I

    move-result v14

    if-lt v6, v14, :cond_3a

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v6

    const-string v14, "challengeNodes"

    invoke-static {v14, v5, v4, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;

    move-result-object v4

    invoke-virtual {v1, v6, v4}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    invoke-static {v7, v9}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v4

    new-instance v5, Ljava/lang/StringBuilder;

    const-string v6, "DAY "

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const/4 v6, 0x1

    add-int/2addr v2, v6

    invoke-virtual {v5, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v5, " \ufffd\ufffd "

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v5

    invoke-static {v5, v8}, Ljava/lang/Math;->min(II)I

    move-result v5

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v0

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v4, v0}, Landroid/widget/RemoteViews;->setContentDescription(ILjava/lang/CharSequence;)V

    goto :goto_2a

    :cond_3a
    invoke-virtual {v0, v6}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v8

    invoke-virtual {v5, v8}, Lorg/json/JSONArray;->put(Z)Lorg/json/JSONArray;

    add-int/lit8 v6, v6, 0x1

    const/4 v8, 0x0

    goto :goto_29

    :cond_3b
    move-object/from16 p2, v1

    move-object/from16 v19, v2

    move-object v1, v8

    goto :goto_2a

    :cond_3c
    move-object/from16 p2, v1

    move-object/from16 v19, v2

    move-object v1, v8

    move-object/from16 v3, v25

    .line 140
    :goto_2a
    const-string v0, "workout"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_42

    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    move-object/from16 v2, v16

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_3d

    new-instance v4, Ljava/lang/StringBuilder;

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v4, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "\u907a\ufffd"

    invoke-virtual {v4, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v0, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_3d
    const-string v2, "exercises"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    const/4 v4, 0x0

    :goto_2b
    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v5

    if-lt v4, v5, :cond_3e

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->join(Ljava/util/List;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v1, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    goto/16 :goto_2f

    :cond_3e
    invoke-virtual {v2, v4}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v5

    new-instance v6, Ljava/util/ArrayList;

    invoke-direct {v6}, Ljava/util/ArrayList;-><init>()V

    const-string v8, "sets"

    invoke-static {v5, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    const/4 v9, 0x0

    :goto_2c
    invoke-virtual {v8}, Lorg/json/JSONArray;->length()I

    move-result v14

    if-lt v9, v14, :cond_3f

    new-instance v8, Ljava/lang/StringBuilder;

    const-string v9, "name"

    invoke-virtual {v5, v9}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v8, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v5, " \uca0c "

    invoke-virtual {v8, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->join(Ljava/util/List;)Ljava/lang/String;

    move-result-object v6

    const/16 v8, 0xa

    const/16 v9, 0x2f

    invoke-virtual {v6, v8, v9}, Ljava/lang/String;->replace(CC)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-interface {v0, v5}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v4, v4, 0x1

    goto :goto_2b

    :cond_3f
    invoke-virtual {v8, v9}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v14

    move-object/from16 p1, v0

    new-instance v0, Ljava/lang/StringBuilder;

    move-object/from16 p4, v2

    const-string v2, "weight"

    invoke-virtual {v14, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v16

    cmpl-double v2, v16, v21

    if-lez v2, :cond_40

    new-instance v2, Ljava/lang/StringBuilder;

    move/from16 v16, v4

    const-string v4, "weight"

    invoke-static {v14, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "kg \ud69e "

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    goto :goto_2d

    :cond_40
    move/from16 v16, v4

    move-object/from16 v4, v19

    :goto_2d
    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "seconds"

    invoke-virtual {v14, v2}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v17

    cmpl-double v2, v17, v21

    if-lez v2, :cond_41

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "seconds"

    invoke-static {v14, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "\u73e5\ufffd"

    goto :goto_2e

    :cond_41
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "reps"

    invoke-static {v14, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "\ufffd\uc276"

    :goto_2e
    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-interface {v6, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v9, v9, 0x1

    move-object/from16 v0, p1

    move-object/from16 v2, p4

    move/from16 v4, v16

    goto/16 :goto_2c

    .line 141
    :cond_42
    :goto_2f
    const-string v0, "book"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_47

    const-string v0, "image"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "w165_cover"

    invoke-static {v7, v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->bitmap(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "author"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v1, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "status"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "finished"

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_43

    const-string v0, "\ufffd\uc17f\ufffd\ub8c6"

    goto :goto_31

    :cond_43
    const-string v0, "status"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v2, "want"

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_44

    const-string v0, "\ufffd\uc52b\u6028\ufffd \ufffd\ub5a2\ufffd\ufffd \uf9e2\ufffd"

    goto :goto_31

    :cond_44
    const-string v0, "totalPages"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_46

    const-string v0, "totalPages"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v4

    cmpg-double v0, v4, v21

    if-gtz v0, :cond_45

    goto :goto_30

    :cond_45
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "currentPage"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "totalPages"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "\uf9df\ufffd \uca0c "

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    move-object/from16 v2, v23

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, "%"

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_31

    :cond_46
    :goto_30
    const-string v0, "\ufffd\ub7f9\ufffd\uc520\uf9de\ufffd \u6e72\uacd5\uc909 \ufffd\ubfbe\ufffd\uc4ec"

    :goto_31
    invoke-static {v7, v1, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 142
    :cond_47
    const-string v0, "quote"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4a

    const-string v0, "\ufffd\ufffd\ufffd\uc623\ufffd\ube33 \u81fe\uba84\uc623"

    invoke-static {v7, v1, v13, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "body"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_48

    const-string v0, "\u6e72\uacd5\uc909 \ufffd\ubfbe\ufffd\uc4ec"

    goto :goto_32

    :cond_48
    const-string v0, "body"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    :goto_32
    invoke-static {v7, v1, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-static {v7, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const/high16 v2, 0x40800000    # 4.0f

    add-float v2, p5, v2

    const/4 v4, 0x2

    invoke-virtual {v1, v0, v4, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    const-string v0, "page"

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_49

    move-object/from16 v4, v19

    goto :goto_33

    :cond_49
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "p. "

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "page"

    invoke-static {v10, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    :goto_33
    invoke-static {v7, v1, v15, v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    .line 143
    :cond_4a
    const-string v0, "workflow"

    invoke-virtual {v12, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4d

    new-instance v0, Ljava/lang/StringBuilder;

    move-object/from16 v2, p6

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v4

    invoke-static {v4}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v0, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    move-object/from16 v3, p2

    invoke-virtual {v10, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v3

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v1, v15, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    const-string v3, "steps"

    invoke-static {v10, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v3

    const/4 v14, 0x0

    :goto_34
    invoke-virtual {v3}, Lorg/json/JSONArray;->length()I

    move-result v4

    if-lt v14, v4, :cond_4b

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->join(Ljava/util/List;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v1, v11, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    goto :goto_36

    :cond_4b
    invoke-virtual {v3, v14}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v4

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-virtual {v4, v2}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v6

    if-eqz v6, :cond_4c

    const-string v6, "\ufffd\uc42f "

    goto :goto_35

    :cond_4c
    const-string v6, "\ufffd\ubfc3 "

    :goto_35
    invoke-static {v6}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v6

    invoke-direct {v5, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v6, "text"

    invoke-virtual {v4, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    invoke-interface {v0, v4}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v14, v14, 0x1

    goto :goto_34

    .line 144
    :cond_4d
    :goto_36
    return-object v1

    .line 122
    :cond_4e
    move v0, v14

    :goto_37
    const-string v1, "stack"

    invoke-virtual {v12, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v9

    if-eqz v9, :cond_4f

    const-string v1, "widget_stack_v168"

    goto :goto_38

    :cond_4f
    const-string v1, "widget_group_v165"

    :goto_38
    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v12

    const-string v1, "children"

    invoke-static {v10, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v13

    const-string v1, "w165_group"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v12, v1}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    move v14, v0

    :goto_39
    invoke-virtual {v13}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-lt v14, v0, :cond_51

    invoke-virtual {v13}, Lorg/json/JSONArray;->length()I

    move-result v0

    :goto_3a
    const-string v1, "columns"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    if-lt v0, v1, :cond_50

    return-object v12

    :cond_50
    const-string v1, "w165_group"

    invoke-static {v7, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    const-string v2, "widget_empty_cell_v165"

    invoke-static {v7, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v2

    invoke-virtual {v12, v1, v2}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v0, v0, 0x1

    goto :goto_3a

    :cond_51
    const-string v0, "w165_group"

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v15

    invoke-virtual {v13, v14}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v3

    const/16 v16, 0x1

    xor-int/lit8 v4, v9, 0x1

    move-object/from16 v0, p0

    move/from16 v1, p1

    move-object/from16 v2, p2

    move-object/from16 v5, p5

    move/from16 v6, p6

    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->component(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;ZLjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {v12, v15, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v14, v14, 0x1

    goto :goto_39
.end method

.method static copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;
    .locals 1

    .line 39
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

.method static fmt(D)Ljava/lang/String;
    .locals 3

    .line 42
    invoke-static {p0, p1}, Ljava/lang/Math;->rint(D)D

    move-result-wide v0

    cmpl-double v0, p0, v0

    if-nez v0, :cond_0

    double-to-long p0, p0

    invoke-static {p0, p1}, Ljava/lang/String;->valueOf(J)Ljava/lang/String;

    move-result-object p0

    goto :goto_0

    :cond_0
    sget-object v0, Ljava/util/Locale;->US:Ljava/util/Locale;

    const/4 v1, 0x1

    new-array v1, v1, [Ljava/lang/Object;

    const/4 v2, 0x0

    invoke-static {p0, p1}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object p0

    aput-object p0, v1, v2

    const-string p0, "%.1f"

    invoke-static {v0, p0, v1}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p0

    :goto_0
    return-object p0
.end method

.method static graph(Ljava/lang/String;Lorg/json/JSONArray;II)Landroid/graphics/Bitmap;
    .locals 43

    .line 148
    move-object/from16 v0, p0

    move-object/from16 v1, p1

    move/from16 v2, p2

    move/from16 v3, p3

    sget-object v4, Landroid/graphics/Bitmap$Config;->ARGB_8888:Landroid/graphics/Bitmap$Config;

    const/16 v5, 0x2bc

    const/16 v6, 0xb4

    invoke-static {v5, v6, v4}, Landroid/graphics/Bitmap;->createBitmap(IILandroid/graphics/Bitmap$Config;)Landroid/graphics/Bitmap;

    move-result-object v4

    new-instance v12, Landroid/graphics/Canvas;

    invoke-direct {v12, v4}, Landroid/graphics/Canvas;-><init>(Landroid/graphics/Bitmap;)V

    new-instance v13, Landroid/graphics/Paint;

    const/4 v6, 0x3

    invoke-direct {v13, v6}, Landroid/graphics/Paint;-><init>(I)V

    const/high16 v14, 0x40400000    # 3.0f

    invoke-virtual {v13, v14}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    const/high16 v6, 0x41b80000    # 23.0f

    invoke-virtual {v13, v6}, Landroid/graphics/Paint;->setTextSize(F)V

    sget-object v6, Landroid/graphics/Paint$Align;->CENTER:Landroid/graphics/Paint$Align;

    invoke-virtual {v13, v6}, Landroid/graphics/Paint;->setTextAlign(Landroid/graphics/Paint$Align;)V

    const-wide/high16 v6, 0x3ff0000000000000L    # 1.0

    const-wide v8, 0x7fefffffffffffffL    # Double.MAX_VALUE

    move-wide v10, v6

    const/4 v6, 0x0

    :goto_0
    invoke-virtual/range {p1 .. p1}, Lorg/json/JSONArray;->length()I

    move-result v7

    if-lt v6, v7, :cond_15

    .line 149
    const-string v6, "bars"

    invoke-virtual {v0, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v6

    const/high16 v16, 0x40000000    # 2.0f

    const/high16 v17, 0x41b00000    # 22.0f

    const v7, -0x9daa18

    const/4 v15, 0x7

    if-eqz v6, :cond_1

    int-to-float v0, v5

    const/high16 v3, 0x40e00000    # 7.0f

    div-float v19, v0, v3

    const/4 v0, 0x0

    :goto_1
    if-lt v0, v15, :cond_0

    goto/16 :goto_7

    :cond_0
    int-to-float v3, v0

    mul-float v3, v3, v19

    div-float v5, v19, v16

    add-float/2addr v3, v5

    invoke-virtual {v1, v0}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v5

    div-double/2addr v5, v10

    const-wide/high16 v8, 0x405e000000000000L    # 120.0

    mul-double/2addr v5, v8

    double-to-float v5, v5

    const v6, -0x212601

    invoke-virtual {v13, v6}, Landroid/graphics/Paint;->setColor(I)V

    sub-float v14, v3, v17

    const/high16 v8, 0x41900000    # 18.0f

    add-float v18, v3, v17

    const/high16 v20, 0x430a0000    # 138.0f

    move-object v6, v12

    move v9, v7

    move v7, v14

    move v15, v9

    move/from16 v9, v18

    move-wide/from16 v21, v10

    move/from16 v10, v20

    move-object v11, v13

    invoke-virtual/range {v6 .. v11}, Landroid/graphics/Canvas;->drawRect(FFFFLandroid/graphics/Paint;)V

    invoke-virtual {v13, v15}, Landroid/graphics/Paint;->setColor(I)V

    const/high16 v6, 0x430a0000    # 138.0f

    sub-float v8, v6, v5

    const/high16 v10, 0x430a0000    # 138.0f

    move-object v6, v12

    invoke-virtual/range {v6 .. v11}, Landroid/graphics/Canvas;->drawRect(FFFFLandroid/graphics/Paint;)V

    invoke-virtual {v13, v2}, Landroid/graphics/Paint;->setColor(I)V

    invoke-virtual {v1, v0}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v6

    invoke-static {v6, v7}, Lcom/aiderlog/v22app/WidgetDesignV165;->fmt(D)Ljava/lang/String;

    move-result-object v6

    const/high16 v7, 0x41880000    # 17.0f

    const/high16 v8, 0x43040000    # 132.0f

    sub-float/2addr v8, v5

    invoke-static {v7, v8}, Ljava/lang/Math;->max(FF)F

    move-result v5

    invoke-virtual {v12, v6, v3, v5, v13}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    const-string v23, "\ufffd\uc361"

    const-string v24, "\ufffd\uc195"

    const-string v25, "\ufffd\ub2d4"

    const-string v26, "\uf9cf\ufffd"

    const-string v27, "\u6e72\ufffd"

    const-string v28, "\ufffd\ub117"

    const-string v29, "\ufffd\uc52a"

    filled-new-array/range {v23 .. v29}, [Ljava/lang/String;

    move-result-object v5

    aget-object v5, v5, v0

    const/high16 v6, 0x432a0000    # 170.0f

    invoke-virtual {v12, v5, v3, v6, v13}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    add-int/lit8 v0, v0, 0x1

    move v7, v15

    move-wide/from16 v10, v21

    const/4 v15, 0x7

    goto :goto_1

    .line 150
    :cond_1
    move v15, v7

    move-wide/from16 v21, v10

    const-string v6, "trend"

    invoke-virtual {v0, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v6

    const/4 v11, 0x0

    const/high16 v19, 0x41c80000    # 25.0f

    const/4 v10, 0x2

    const/4 v7, 0x1

    if-eqz v6, :cond_6

    invoke-virtual {v13, v15}, Landroid/graphics/Paint;->setColor(I)V

    sget-object v0, Landroid/graphics/Paint$Style;->STROKE:Landroid/graphics/Paint$Style;

    invoke-virtual {v13, v0}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    const/high16 v0, 0x40800000    # 4.0f

    invoke-virtual {v13, v0}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    if-lez v3, :cond_3

    new-instance v0, Landroid/graphics/DashPathEffect;

    new-array v2, v10, [F

    if-ne v3, v7, :cond_2

    fill-array-data v2, :array_0

    goto :goto_2

    :cond_2
    fill-array-data v2, :array_1

    :goto_2
    invoke-direct {v0, v2, v11}, Landroid/graphics/DashPathEffect;-><init>([FF)V

    invoke-virtual {v13, v0}, Landroid/graphics/Paint;->setPathEffect(Landroid/graphics/PathEffect;)Landroid/graphics/PathEffect;

    :cond_3
    new-instance v6, Landroid/graphics/Path;

    invoke-direct {v6}, Landroid/graphics/Path;-><init>()V

    const/4 v15, 0x0

    :goto_3
    invoke-virtual/range {p1 .. p1}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-lt v15, v0, :cond_4

    invoke-virtual {v12, v6, v13}, Landroid/graphics/Canvas;->drawPath(Landroid/graphics/Path;Landroid/graphics/Paint;)V

    goto/16 :goto_7

    :cond_4
    const/16 v0, 0x28a

    mul-int/2addr v0, v15

    int-to-float v0, v0

    invoke-virtual/range {p1 .. p1}, Lorg/json/JSONArray;->length()I

    move-result v2

    sub-int/2addr v2, v7

    invoke-static {v7, v2}, Ljava/lang/Math;->max(II)I

    move-result v2

    int-to-float v2, v2

    div-float/2addr v0, v2

    add-float v0, v0, v19

    invoke-virtual {v1, v15}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v10

    sub-double/2addr v10, v8

    const-wide v2, 0x3f847ae147ae147bL    # 0.01

    move-object/from16 v20, v6

    move-wide/from16 v5, v21

    move-object/from16 v21, v12

    move-object/from16 v22, v13

    sub-double v12, v5, v8

    invoke-static {v2, v3, v12, v13}, Ljava/lang/Math;->max(DD)D

    move-result-wide v2

    div-double/2addr v10, v2

    const-wide/high16 v2, 0x4059000000000000L    # 100.0

    mul-double/2addr v10, v2

    const-wide v2, 0x4061800000000000L    # 140.0

    sub-double/2addr v2, v10

    double-to-float v2, v2

    if-nez v15, :cond_5

    move-object/from16 v12, v20

    invoke-virtual {v12, v0, v2}, Landroid/graphics/Path;->moveTo(FF)V

    goto :goto_4

    :cond_5
    move-object/from16 v12, v20

    invoke-virtual {v12, v0, v2}, Landroid/graphics/Path;->lineTo(FF)V

    :goto_4
    add-int/lit8 v15, v15, 0x1

    move-object/from16 v13, v22

    move-wide/from16 v40, v5

    move-object v6, v12

    move-object/from16 v12, v21

    move-wide/from16 v21, v40

    goto :goto_3

    .line 151
    :cond_6
    move-object/from16 v21, v12

    move-object/from16 v22, v13

    move v13, v5

    invoke-virtual/range {p1 .. p1}, Lorg/json/JSONArray;->length()I

    move-result v12

    const/4 v6, 0x7

    if-le v12, v6, :cond_7

    const/16 v9, 0xa

    goto :goto_5

    :cond_7
    const/4 v9, 0x7

    :goto_5
    add-int v6, v12, v9

    sub-int/2addr v6, v7

    div-int v8, v6, v9

    int-to-float v6, v13

    int-to-float v13, v9

    div-float v20, v6, v13

    const/4 v13, 0x0

    :goto_6
    if-lt v13, v12, :cond_8

    .line 152
    :goto_7
    return-object v4

    .line 151
    :cond_8
    rem-int v6, v13, v9

    int-to-float v6, v6

    mul-float v6, v6, v20

    div-float v23, v20, v16

    add-float v6, v6, v23

    if-le v8, v7, :cond_9

    div-int v5, v13, v9

    int-to-float v5, v5

    const/high16 v24, 0x430c0000    # 140.0f

    add-int/lit8 v11, v8, -0x1

    invoke-static {v7, v11}, Ljava/lang/Math;->max(II)I

    move-result v11

    int-to-float v11, v11

    div-float v24, v24, v11

    mul-float v5, v5, v24

    add-float v5, v5, v17

    goto :goto_8

    :cond_9
    const/high16 v5, 0x42820000    # 65.0f

    :goto_8
    invoke-virtual {v1, v13}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v24

    move-object/from16 v11, v22

    invoke-virtual {v11, v15}, Landroid/graphics/Paint;->setColor(I)V

    invoke-virtual {v11, v14}, Landroid/graphics/Paint;->setStrokeWidth(F)V

    const-string v7, "stars"

    invoke-virtual {v0, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-eqz v7, :cond_10

    if-lez v13, :cond_b

    add-int/lit8 v7, v13, -0x1

    invoke-virtual {v1, v7}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v7

    if-eqz v7, :cond_a

    if-eqz v24, :cond_a

    const/4 v7, 0x0

    const/4 v15, 0x0

    goto :goto_9

    :cond_a
    new-instance v7, Landroid/graphics/DashPathEffect;

    new-array v14, v10, [F

    fill-array-data v14, :array_2

    const/4 v15, 0x0

    invoke-direct {v7, v14, v15}, Landroid/graphics/DashPathEffect;-><init>([FF)V

    :goto_9
    invoke-virtual {v11, v7}, Landroid/graphics/Paint;->setPathEffect(Landroid/graphics/PathEffect;)Landroid/graphics/PathEffect;

    sub-float v7, v6, v20

    add-float v7, v7, v19

    sub-float v14, v6, v19

    move v15, v6

    move-object/from16 v6, v21

    const/16 v22, 0x1

    move/from16 v30, v8

    move v8, v5

    move/from16 v31, v9

    move v9, v14

    move v14, v10

    move v10, v5

    move-object/from16 v32, v11

    const/16 v25, 0x0

    invoke-virtual/range {v6 .. v11}, Landroid/graphics/Canvas;->drawLine(FFFFLandroid/graphics/Paint;)V

    move-object/from16 v7, v32

    const/4 v6, 0x0

    invoke-virtual {v7, v6}, Landroid/graphics/Paint;->setPathEffect(Landroid/graphics/PathEffect;)Landroid/graphics/PathEffect;

    goto :goto_a

    :cond_b
    move v15, v6

    move/from16 v30, v8

    move/from16 v31, v9

    move v14, v10

    move-object v7, v11

    const/16 v22, 0x1

    const/16 v25, 0x0

    :goto_a
    new-instance v6, Landroid/graphics/Path;

    invoke-direct {v6}, Landroid/graphics/Path;-><init>()V

    const/4 v8, 0x0

    :goto_b
    const/16 v9, 0xa

    if-lt v8, v9, :cond_d

    invoke-virtual {v6}, Landroid/graphics/Path;->close()V

    if-eqz v24, :cond_c

    sget-object v5, Landroid/graphics/Paint$Style;->FILL:Landroid/graphics/Paint$Style;

    goto :goto_c

    :cond_c
    sget-object v5, Landroid/graphics/Paint$Style;->STROKE:Landroid/graphics/Paint$Style;

    :goto_c
    invoke-virtual {v7, v5}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    move-object/from16 v10, v21

    invoke-virtual {v10, v6, v7}, Landroid/graphics/Canvas;->drawPath(Landroid/graphics/Path;Landroid/graphics/Paint;)V

    sget-object v5, Landroid/graphics/Paint$Style;->FILL:Landroid/graphics/Paint$Style;

    invoke-virtual {v7, v5}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    invoke-virtual {v7, v2}, Landroid/graphics/Paint;->setColor(I)V

    const-string v32, "\ufffd\uc361"

    const-string v33, "\ufffd\uc195"

    const-string v34, "\ufffd\ub2d4"

    const-string v35, "\uf9cf\ufffd"

    const-string v36, "\u6e72\ufffd"

    const-string v37, "\ufffd\ub117"

    const-string v38, "\ufffd\uc52a"

    filled-new-array/range {v32 .. v38}, [Ljava/lang/String;

    move-result-object v5

    rem-int/lit8 v6, v13, 0x7

    aget-object v5, v5, v6

    const/high16 v11, 0x43110000    # 145.0f

    invoke-virtual {v10, v5, v15, v11, v7}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    const/4 v11, 0x7

    goto/16 :goto_13

    :cond_d
    move-object/from16 v10, v21

    const/high16 v11, 0x43110000    # 145.0f

    const-wide v28, -0x4006de04abbbd2e8L    # -1.5707963267948966

    int-to-double v9, v8

    const-wide v32, 0x400921fb54442d18L    # Math.PI

    mul-double v9, v9, v32

    const-wide/high16 v32, 0x4014000000000000L    # 5.0

    div-double v9, v9, v32

    add-double v9, v9, v28

    rem-int/lit8 v28, v8, 0x2

    if-nez v28, :cond_e

    const/16 v28, 0x1d

    goto :goto_d

    :cond_e
    const/16 v28, 0xd

    :goto_d
    move/from16 v11, v28

    int-to-float v11, v11

    move/from16 v28, v15

    invoke-static {v9, v10}, Ljava/lang/Math;->cos(D)D

    move-result-wide v14

    double-to-float v14, v14

    mul-float/2addr v14, v11

    add-float v14, v28, v14

    invoke-static {v9, v10}, Ljava/lang/Math;->sin(D)D

    move-result-wide v9

    double-to-float v9, v9

    mul-float/2addr v9, v11

    add-float/2addr v9, v5

    if-nez v8, :cond_f

    invoke-virtual {v6, v14, v9}, Landroid/graphics/Path;->moveTo(FF)V

    goto :goto_e

    :cond_f
    invoke-virtual {v6, v14, v9}, Landroid/graphics/Path;->lineTo(FF)V

    :goto_e
    add-int/lit8 v8, v8, 0x1

    move/from16 v15, v28

    const/4 v14, 0x2

    goto :goto_b

    :cond_10
    move/from16 v28, v6

    move/from16 v30, v8

    move/from16 v31, v9

    move-object v7, v11

    const/16 v22, 0x1

    const/16 v25, 0x0

    if-eqz v24, :cond_11

    sget-object v6, Landroid/graphics/Paint$Style;->FILL:Landroid/graphics/Paint$Style;

    goto :goto_f

    :cond_11
    sget-object v6, Landroid/graphics/Paint$Style;->STROKE:Landroid/graphics/Paint$Style;

    :goto_f
    invoke-virtual {v7, v6}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    const/4 v6, 0x7

    if-le v12, v6, :cond_12

    const/16 v6, 0xc

    goto :goto_10

    :cond_12
    const/16 v6, 0x1a

    :goto_10
    int-to-float v6, v6

    move-object/from16 v10, v21

    move/from16 v8, v28

    invoke-virtual {v10, v8, v5, v6, v7}, Landroid/graphics/Canvas;->drawCircle(FFFLandroid/graphics/Paint;)V

    sget-object v6, Landroid/graphics/Paint$Style;->FILL:Landroid/graphics/Paint$Style;

    invoke-virtual {v7, v6}, Landroid/graphics/Paint;->setStyle(Landroid/graphics/Paint$Style;)V

    invoke-virtual {v7, v2}, Landroid/graphics/Paint;->setColor(I)V

    const-string v6, "challengeNodes"

    invoke-virtual {v0, v6}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v6

    if-eqz v6, :cond_13

    add-int/lit8 v6, v13, 0x1

    add-int/2addr v6, v3

    invoke-static {v6}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v6

    goto :goto_11

    :cond_13
    const-string v33, "\ufffd\uc361"

    const-string v34, "\ufffd\uc195"

    const-string v35, "\ufffd\ub2d4"

    const-string v36, "\uf9cf\ufffd"

    const-string v37, "\u6e72\ufffd"

    const-string v38, "\ufffd\ub117"

    const-string v39, "\ufffd\uc52a"

    filled-new-array/range {v33 .. v39}, [Ljava/lang/String;

    move-result-object v6

    rem-int/lit8 v9, v13, 0x7

    aget-object v6, v6, v9

    :goto_11
    const/4 v11, 0x7

    if-le v12, v11, :cond_14

    const/high16 v9, 0x41800000    # 16.0f

    sub-float v14, v5, v9

    goto :goto_12

    :cond_14
    const/high16 v14, 0x43110000    # 145.0f

    :goto_12
    invoke-virtual {v10, v6, v8, v14, v7}, Landroid/graphics/Canvas;->drawText(Ljava/lang/String;FFLandroid/graphics/Paint;)V

    :goto_13
    add-int/lit8 v13, v13, 0x1

    move-object/from16 v21, v10

    move/from16 v11, v25

    move/from16 v8, v30

    move/from16 v9, v31

    const/4 v10, 0x2

    const/high16 v14, 0x40400000    # 3.0f

    const v15, -0x9daa18

    move/from16 v40, v22

    move-object/from16 v22, v7

    move/from16 v7, v40

    goto/16 :goto_6

    .line 148
    :cond_15
    move v15, v6

    move-object v7, v13

    move v13, v5

    move-wide v5, v10

    move-object v10, v12

    invoke-virtual {v1, v15}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v11

    invoke-static {v5, v6, v11, v12}, Ljava/lang/Math;->max(DD)D

    move-result-wide v5

    invoke-virtual {v1, v15}, Lorg/json/JSONArray;->optDouble(I)D

    move-result-wide v11

    invoke-static {v8, v9, v11, v12}, Ljava/lang/Math;->min(DD)D

    move-result-wide v8

    add-int/lit8 v11, v15, 0x1

    move-object v12, v10

    const/high16 v14, 0x40400000    # 3.0f

    move/from16 v40, v13

    move-object v13, v7

    move-wide/from16 v41, v5

    move v6, v11

    move-wide/from16 v10, v41

    move/from16 v5, v40

    goto/16 :goto_0

    nop

    :array_0
    .array-data 4
        0x41800000    # 16.0f
        0x41100000    # 9.0f
    .end array-data

    :array_1
    .array-data 4
        0x40800000    # 4.0f
        0x41100000    # 9.0f
    .end array-data

    :array_2
    .array-data 4
        0x40e00000    # 7.0f
        0x40e00000    # 7.0f
    .end array-data
.end method

.method static groups(Ljava/util/List;I)Ljava/util/List;
    .locals 6
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Lorg/json/JSONObject;",
            ">;I)",
            "Ljava/util/List<",
            "Lorg/json/JSONObject;",
            ">;"
        }
    .end annotation

    .line 41
    const/4 v0, 0x2

    if-ge p1, v0, :cond_0

    return-object p0

    :cond_0
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    const/4 v1, 0x0

    :goto_0
    invoke-interface {p0}, Ljava/util/List;->size()I

    move-result v2

    if-lt v1, v2, :cond_1

    return-object v0

    :cond_1
    new-instance v2, Lorg/json/JSONArray;

    invoke-direct {v2}, Lorg/json/JSONArray;-><init>()V

    move v3, v1

    :goto_1
    invoke-interface {p0}, Ljava/util/List;->size()I

    move-result v4

    add-int v5, v1, p1

    invoke-static {v4, v5}, Ljava/lang/Math;->min(II)I

    move-result v4

    if-lt v3, v4, :cond_2

    const-string v1, "group"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v3, "children"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v2

    const-string v3, "columns"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-interface {v0, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    move v1, v5

    goto :goto_0

    :cond_2
    invoke-interface {p0, v3}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v4

    invoke-virtual {v2, v4}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v3, v3, 0x1

    goto :goto_1
.end method

.method static join(Ljava/util/List;)Ljava/lang/String;
    .locals 3
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;)",
            "Ljava/lang/String;"
        }
    .end annotation

    .line 106
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    invoke-interface {p0}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object p0

    :goto_0
    invoke-interface {p0}, Ljava/util/Iterator;->hasNext()Z

    move-result v1

    if-nez v1, :cond_0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :cond_0
    invoke-interface {p0}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->length()I

    move-result v2

    if-lez v2, :cond_1

    const/16 v2, 0xa

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    :cond_1
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_0
.end method

.method static model(Lorg/json/JSONObject;)Lorg/json/JSONObject;
    .locals 1

    .line 34
    const-string v0, "v165"

    invoke-virtual {p0, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object p0

    if-nez p0, :cond_0

    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0}, Lorg/json/JSONObject;-><init>()V

    :cond_0
    return-object p0
.end method

.method static options(Landroid/content/Context;I)Lorg/json/JSONObject;
    .locals 2

    .line 35
    :try_start_0
    sget-object v0, Lcom/aiderlog/v22app/WidgetDesignV165;->previewContent:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->get()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    if-nez v0, :cond_0

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object p0

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_content_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const-string v0, ""

    invoke-interface {p0, p1, v0}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    :cond_0
    const-string p0, "{"

    invoke-virtual {v0, p0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result p0

    if-eqz p0, :cond_1

    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0, v0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    goto :goto_0

    :cond_1
    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0}, Lorg/json/JSONObject;-><init>()V

    const-string p1, "legacy"

    invoke-virtual {p0, p1, v0}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :goto_0
    return-object p0

    :catch_0
    move-exception p0

    new-instance p0, Lorg/json/JSONObject;

    invoke-direct {p0}, Lorg/json/JSONObject;-><init>()V

    return-object p0
.end method

.method static put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    .locals 0

    .line 37
    :try_start_0
    invoke-virtual {p0, p1, p2}, Lorg/json/JSONObject;->put(Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p1

    :goto_0
    return-object p0
.end method

.method public static render(Landroid/content/Context;ILjava/lang/String;ZLjava/lang/String;II)Landroid/widget/RemoteViews;
    .locals 28

    .line 47
    move-object/from16 v7, p0

    move/from16 v8, p1

    move-object/from16 v9, p2

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v10

    invoke-static {v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v6

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->wide(Landroid/content/Context;I)Z

    move-result v11

    invoke-static {v9, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->twoPanels(Ljava/lang/String;Z)Z

    move-result v12

    if-eqz v12, :cond_0

    const-string v0, "widget_design_v165_wide"

    goto :goto_0

    :cond_0
    const-string v0, "widget_design_v165"

    :goto_0
    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object v13

    .line 48
    move-object/from16 v0, p0

    move-object v1, v13

    move/from16 v2, p1

    move-object/from16 v3, p4

    move/from16 v4, p5

    move/from16 v5, p6

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->appearance(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;II)V

    const-string v0, "widget_subtitle"

    const/4 v14, 0x0

    invoke-static {v7, v13, v0, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v0, "w165_secondary"

    invoke-static {v7, v13, v0, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 49
    const-string v0, "PersonalBullet"

    invoke-virtual {v9, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_1

    const-string v0, "PersonalToday"

    invoke-virtual {v9, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    move v0, v14

    goto :goto_1

    :cond_1
    const/4 v0, 0x1

    :goto_1
    const-string v1, "PersonalWorkflowOne"

    invoke-virtual {v9, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    const-string v3, "PersonalWorkflowAll"

    const-string v4, "PersonalTodo"

    if-nez v2, :cond_2

    invoke-virtual {v9, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_2

    invoke-virtual {v9, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_2

    move v2, v14

    goto :goto_2

    :cond_2
    const/4 v2, 0x1

    .line 50
    :goto_2
    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object v5

    const-string v15, "Seven"

    invoke-virtual {v9, v15}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v15

    const/16 v16, 0x3

    if-eqz v15, :cond_3

    const/4 v15, 0x7

    goto :goto_3

    :cond_3
    move/from16 v15, v16

    :goto_3
    const-string v14, "rangeDays"

    invoke-virtual {v5, v14, v15}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v5

    if-eqz v0, :cond_5

    const/4 v14, 0x7

    if-ne v5, v14, :cond_4

    const/4 v5, 0x7

    goto :goto_4

    :cond_4
    move/from16 v5, v16

    :goto_4
    if-nez p3, :cond_5

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v14

    invoke-interface {v14}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v14

    new-instance v15, Ljava/lang/StringBuilder;

    move/from16 v19, v12

    const-string v12, "widget_range_"

    invoke-direct {v15, v12}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v15, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v12

    invoke-virtual {v12}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v12

    invoke-interface {v14, v12, v5}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    move-result-object v12

    invoke-interface {v12}, Landroid/content/SharedPreferences$Editor;->apply()V

    goto :goto_5

    :cond_5
    move/from16 v19, v12

    .line 51
    :goto_5
    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v12

    new-instance v14, Ljava/lang/StringBuilder;

    const-string v15, "widget_page_"

    invoke-direct {v14, v15}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v14, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v14

    invoke-virtual {v14}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v14

    const/4 v15, 0x0

    invoke-interface {v12, v14, v15}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v12

    if-eqz v0, :cond_6

    const/4 v14, 0x7

    if-ne v5, v14, :cond_6

    if-nez v11, :cond_6

    const/4 v5, 0x1

    goto :goto_6

    :cond_6
    const/4 v5, 0x0

    .line 52
    :goto_6
    const-string v11, "challenges"

    invoke-static {v6, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v11

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object v14

    const-string v15, "id"

    invoke-virtual {v14, v15}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v14

    invoke-static {v11, v14}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v11

    const-string v14, "PersonalWorkoutChallengeOnly"

    invoke-virtual {v9, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v14

    const-string v15, "nodes"

    if-nez v14, :cond_8

    const-string v14, "PersonalWorkoutChallengeCombined"

    invoke-virtual {v9, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v14

    if-eqz v14, :cond_7

    goto :goto_7

    :cond_7
    move/from16 v20, v5

    goto :goto_8

    :cond_8
    :goto_7
    if-eqz v11, :cond_9

    invoke-static {v11, v15}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v14

    invoke-virtual {v14}, Lorg/json/JSONArray;->length()I

    move-result v14

    move/from16 v20, v5

    const/4 v5, 0x7

    if-le v14, v5, :cond_a

    const/4 v5, 0x1

    goto :goto_9

    :cond_9
    move/from16 v20, v5

    :cond_a
    :goto_8
    const/4 v5, 0x0

    .line 53
    :goto_9
    if-eqz v5, :cond_b

    const/4 v14, 0x1

    goto :goto_a

    :cond_b
    move/from16 v14, v20

    .line 54
    :goto_a
    move-object/from16 v20, v10

    const-string v10, "widget_previous"

    invoke-static {v7, v13, v10, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    move-object/from16 v21, v10

    const-string v10, "widget_next"

    invoke-static {v7, v13, v10, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    move-object/from16 v22, v10

    const-string v10, "widget_add"

    invoke-static {v7, v13, v10, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 55
    move-object/from16 v23, v10

    const-string v10, "routineStats"

    invoke-virtual {v6, v10}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v10

    .line 56
    move-object/from16 v24, v13

    const-string v13, "Routine"

    invoke-virtual {v9, v13}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v13

    move/from16 v25, v2

    const-string v2, " \ufffd\uc17f\u7337\ufffd"

    move/from16 v26, v12

    const-string v12, " / "

    move/from16 v27, v14

    const-string v14, ""

    if-eqz v13, :cond_d

    const-string v13, "Language"

    invoke-virtual {v9, v13}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v13

    if-nez v13, :cond_d

    if-nez v10, :cond_c

    move-object v0, v14

    goto/16 :goto_11

    :cond_c
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "todayDone"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "total"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto/16 :goto_11

    .line 57
    :cond_d
    invoke-virtual {v9, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-nez v10, :cond_1a

    invoke-virtual {v9, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_e

    goto/16 :goto_f

    .line 58
    :cond_e
    invoke-virtual {v9, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_f

    const-string v0, "\uf9e4\uc493\ub810 \ufffd\ub2d4\ufffd\uc819\ufffd\ub2da"

    goto/16 :goto_11

    .line 59
    :cond_f
    if-eqz v5, :cond_10

    invoke-static {v11, v15}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v0

    add-int/lit8 v1, v0, -0x7

    const/4 v2, 0x0

    invoke-static {v2, v1}, Ljava/lang/Math;->max(II)I

    move-result v1

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v3

    new-instance v10, Ljava/lang/StringBuilder;

    const-string v11, "widget_challenge_page_"

    invoke-direct {v10, v11}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v8}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v10

    invoke-virtual {v10}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v10

    invoke-interface {v3, v10, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v3

    invoke-static {v1, v3}, Ljava/lang/Math;->min(II)I

    move-result v1

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "DAY "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    add-int/lit8 v3, v1, 0x1

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, " \ufffd\ufffd "

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const/4 v3, 0x7

    add-int/2addr v1, v3

    invoke-static {v0, v1}, Ljava/lang/Math;->min(II)I

    move-result v1

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto/16 :goto_11

    .line 60
    :cond_10
    if-eqz v0, :cond_12

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static {v7, v8, v9, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->bulletRange(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    if-eqz v27, :cond_11

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, " \uca0c "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const/4 v2, 0x4

    move/from16 v3, v26

    invoke-static {v2, v3}, Ljava/lang/Math;->min(II)I

    move-result v10

    const/4 v11, 0x1

    add-int/2addr v10, v11

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v10, "\ufffd\ufffd"

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-static {v2, v3}, Ljava/lang/Math;->min(II)I

    move-result v2

    add-int/lit8 v2, v2, 0x3

    const/4 v3, 0x7

    invoke-static {v3, v2}, Ljava/lang/Math;->min(II)I

    move-result v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, " / 7"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    goto :goto_b

    :cond_11
    move-object v1, v14

    :goto_b
    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto/16 :goto_11

    .line 61
    :cond_12
    const-string v0, "PersonalWorkoutStats"

    invoke-virtual {v9, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_13

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\uf9e4\uc493\ub810 "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "period"

    const/4 v3, 0x7

    invoke-virtual {v1, v2, v3}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "\ufffd\uc52a"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto/16 :goto_11

    .line 62
    :cond_13
    const-string v0, "PersonalMeal"

    invoke-virtual {v9, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_19

    const-string v0, "PersonalWorkoutMeal"

    invoke-virtual {v9, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_19

    const-string v0, "PersonalWorkout"

    invoke-virtual {v9, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_14

    goto :goto_e

    .line 63
    :cond_14
    const-string v0, "PersonalReading"

    invoke-virtual {v9, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_18

    const-string v0, "books"

    invoke-static {v6, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v1, 0x0

    const/4 v2, 0x0

    const/4 v3, 0x0

    const/4 v10, 0x0

    :goto_c
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v11

    if-lt v1, v11, :cond_15

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "\ufffd\uc52b\ufffd\ub497 \u4ee5\ufffd "

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, " \uca0c \ufffd\uc17f\ufffd\ub8c6 "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, " \uca0c \ufffd\uc52b\u6028\ufffd \ufffd\ub5a2\ufffd\ufffd \uf9e2\ufffd "

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    goto :goto_11

    :cond_15
    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v11

    const-string v12, "status"

    invoke-virtual {v11, v12}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    const-string v12, "reading"

    invoke-virtual {v11, v12}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v12

    if-eqz v12, :cond_16

    add-int/lit8 v2, v2, 0x1

    goto :goto_d

    :cond_16
    const-string v12, "finished"

    invoke-virtual {v11, v12}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v11

    if-eqz v11, :cond_17

    add-int/lit8 v3, v3, 0x1

    goto :goto_d

    :cond_17
    add-int/lit8 v10, v10, 0x1

    :goto_d
    add-int/lit8 v1, v1, 0x1

    goto :goto_c

    :cond_18
    move-object v0, v14

    goto :goto_11

    .line 62
    :cond_19
    :goto_e
    const-string v0, "today"

    invoke-virtual {v6, v0, v14}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    goto :goto_11

    .line 57
    :cond_1a
    :goto_f
    const-string v0, "todos"

    invoke-static {v6, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v1, 0x0

    const/4 v15, 0x0

    :goto_10
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v3

    if-lt v15, v3, :cond_25

    new-instance v3, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v3, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v0

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 64
    :goto_11
    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_1b

    if-nez v27, :cond_1b

    if-nez v25, :cond_1b

    const/4 v1, 0x0

    goto :goto_12

    :cond_1b
    const/4 v1, 0x1

    :goto_12
    const-string v2, "w165_header"

    move-object/from16 v10, v24

    invoke-static {v7, v10, v2, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v1, "widget_title"

    invoke-static {v7, v10, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    const-string v0, "widget_root"

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-static {v7, v8, v9, v14}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v10, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 65
    move-object/from16 v3, v21

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "bullet"

    const-string v2, "-1"

    invoke-static {v7, v8, v9, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v11

    invoke-virtual {v10, v0, v11}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    move-object/from16 v11, v22

    invoke-static {v7, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v12, "1"

    invoke-static {v7, v8, v9, v1, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v10, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 66
    if-eqz v5, :cond_1c

    invoke-static {v7, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "challenge"

    invoke-static {v7, v8, v9, v1, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v10, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-static {v7, v11}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    const-string v1, "challenge"

    invoke-static {v7, v8, v9, v1, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->navigate(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v10, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 67
    :cond_1c
    move-object/from16 v13, v23

    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget-v165:"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "action"

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-virtual {v9, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_1d

    const-string v3, "add-todo"

    goto :goto_13

    :cond_1d
    const-string v3, "add-memo"

    :goto_13
    const-string v4, "op"

    invoke-static {v2, v4, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "uid"

    invoke-virtual {v6, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "uid"

    invoke-static {v2, v4, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static/range {p1 .. p1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v3

    const-string v4, "widgetId"

    invoke-static {v2, v4, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-virtual {v2}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v7, v8, v9, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;

    move-result-object v1

    invoke-virtual {v10, v0, v1}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 68
    move-object/from16 v11, v20

    invoke-static {v7, v8, v9, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v12

    const-string v0, "accessState"

    invoke-virtual {v11, v0, v14}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "needs-login"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_1e

    const-string v0, "\u6fe1\uc493\ub807\ufffd\uc524 \ufffd\ube18\ufffd\uc282"

    goto :goto_14

    :cond_1e
    const-string v1, "sync-required"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1f

    const-string v0, "\ufffd\ub8de\u6e72\uace0\uc195 \ufffd\ube18\ufffd\uc282"

    goto :goto_14

    :cond_1f
    const-string v0, "\u6e72\uacd5\uc909 \ufffd\ubfbe\ufffd\uc4ec"

    :goto_14
    const-string v1, "widget_empty"

    invoke-static {v7, v10, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    invoke-interface {v12}, Ljava/util/List;->isEmpty()Z

    move-result v0

    const-string v1, "widget_empty"

    invoke-static {v7, v10, v1, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-interface {v12}, Ljava/util/List;->isEmpty()Z

    move-result v0

    const/4 v1, 0x1

    xor-int/2addr v0, v1

    const-string v2, "widget_items_v164"

    invoke-static {v7, v10, v2, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    .line 69
    if-eqz p3, :cond_21

    const/4 v0, 0x0

    invoke-static {v7, v10, v2, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v13, "widget_preview_rows_v164"

    invoke-static {v7, v10, v13, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {v10, v0}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    const/4 v15, 0x0

    :goto_15
    const/4 v0, 0x5

    invoke-interface {v12}, Ljava/util/List;->size()I

    move-result v1

    invoke-static {v0, v1}, Ljava/lang/Math;->min(II)I

    move-result v0

    if-lt v15, v0, :cond_20

    goto :goto_16

    :cond_20
    invoke-static {v7, v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v14

    invoke-interface {v12, v15}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, Ljava/lang/String;

    move-object/from16 v0, p0

    move/from16 v1, p1

    move-object/from16 v2, p2

    move v4, v15

    move-object/from16 v5, p4

    move/from16 v6, p6

    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {v10, v14, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v15, v15, 0x1

    goto :goto_15

    .line 70
    :cond_21
    invoke-static {v7, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    move-object/from16 v0, p0

    move-object v1, v10

    move/from16 v2, p1

    move-object/from16 v3, p2

    move-object v4, v12

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;I)V

    .line 71
    :goto_16
    if-eqz v19, :cond_24

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static/range {p2 .. p2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "@right"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v7, v8, v0, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v11

    invoke-interface {v11}, Ljava/util/List;->isEmpty()Z

    move-result v0

    const/4 v1, 0x1

    xor-int/2addr v0, v1

    const-string v2, "w165_secondary_list"

    invoke-static {v7, v10, v2, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    if-eqz p3, :cond_23

    const/4 v0, 0x0

    invoke-static {v7, v10, v2, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    const-string v12, "w165_secondary_preview"

    invoke-static {v7, v10, v12, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->show(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Z)V

    invoke-static {v7, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v10, v1}, Landroid/widget/RemoteViews;->removeAllViews(I)V

    move v14, v0

    :goto_17
    const/4 v0, 0x5

    invoke-interface {v11}, Ljava/util/List;->size()I

    move-result v1

    invoke-static {v0, v1}, Ljava/lang/Math;->min(II)I

    move-result v0

    if-lt v14, v0, :cond_22

    goto :goto_18

    :cond_22
    invoke-static {v7, v12}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v13

    invoke-interface {v11, v14}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v3, v0

    check-cast v3, Ljava/lang/String;

    move-object/from16 v0, p0

    move/from16 v1, p1

    move-object/from16 v2, p2

    move v4, v14

    move-object/from16 v5, p4

    move/from16 v6, p6

    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object v0

    invoke-virtual {v10, v13, v0}, Landroid/widget/RemoteViews;->addView(ILandroid/widget/RemoteViews;)V

    add-int/lit8 v14, v14, 0x1

    goto :goto_17

    :cond_23
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static/range {p2 .. p2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "@right"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-static {v7, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v5

    move-object/from16 v0, p0

    move-object v1, v10

    move/from16 v2, p1

    move-object v4, v11

    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->collection(Landroid/content/Context;Landroid/widget/RemoteViews;ILjava/lang/String;Ljava/util/List;I)V

    .line 72
    :cond_24
    :goto_18
    return-object v10

    .line 57
    :cond_25
    move-object/from16 v16, v20

    move-object/from16 v3, v21

    move-object/from16 v11, v22

    move-object/from16 v13, v23

    move-object/from16 v10, v24

    const/16 v17, 0x0

    const/16 v18, 0x1

    move-object/from16 p5, v2

    invoke-virtual {v0, v15}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    move-object/from16 v20, v0

    const-string v0, "done"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_26

    add-int/lit8 v1, v1, 0x1

    :cond_26
    add-int/lit8 v15, v15, 0x1

    move-object/from16 v2, p5

    move-object/from16 v21, v3

    move-object/from16 v24, v10

    move-object/from16 v22, v11

    move-object/from16 v23, v13

    move-object/from16 v0, v20

    move-object/from16 v20, v16

    goto/16 :goto_10
.end method

.method public static row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;
    .locals 7

    .line 120
    :try_start_0
    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3, p3}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    const/4 v4, 0x0

    move-object v0, p0

    move v1, p1

    move-object v2, p2

    move-object v5, p5

    move v6, p6

    invoke-static/range {v0 .. v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->component(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;ZLjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return-object p0

    :catch_0
    move-exception p1

    const-string p1, "widget_note_v165"

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object p1

    const-string p2, "w165_title"

    const-string p3, "\u6e72\uacd5\uc909\ufffd\uc4e3 \ufffd\ub58e\ufffd\ub586 \u907a\ub348\uc72d\ufffd\ufffd\u4e8c\uc1f1\uaf6d\ufffd\uc282."

    invoke-static {p0, p1, p2, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->text(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;)V

    return-object p1
.end method

.method public static rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;
    .locals 30
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

    .line 76
    move-object/from16 v0, p3

    invoke-static/range {p3 .. p3}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->options(Landroid/content/Context;I)Lorg/json/JSONObject;

    move-result-object v2

    invoke-static/range {p2 .. p2}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v4, "@right"

    move-object/from16 v5, p2

    invoke-virtual {v5, v4}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v4

    invoke-static/range {p0 .. p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->wide(Landroid/content/Context;I)Z

    move-result v5

    invoke-static {v3, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->twoPanels(Ljava/lang/String;Z)Z

    move-result v6

    new-instance v7, Ljava/util/ArrayList;

    invoke-direct {v7}, Ljava/util/ArrayList;-><init>()V

    .line 77
    const-string v8, "PersonalWorkflowOne"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    const-string v9, "notes"

    const/4 v11, 0x1

    .line 81
    invoke-static {v11}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v12

    .line 77
    if-eqz v8, :cond_1

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    if-eqz v5, :cond_0

    const/4 v10, 0x2

    goto :goto_0

    :cond_0
    move v10, v11

    :goto_0
    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->groups(Ljava/util/List;I)Ljava/util/List;

    move-result-object v7

    goto/16 :goto_24

    .line 78
    :cond_1
    const-string v8, "PersonalWorkflowAll"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    const-string v13, "todos"

    if-eqz v8, :cond_4

    if-nez v4, :cond_2

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    :cond_2
    if-eqz v6, :cond_3

    if-eqz v4, :cond_4a

    :cond_3
    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    goto/16 :goto_24

    .line 79
    :cond_4
    const-string v8, "PersonalTodo"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_5

    invoke-static {v1, v13}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    goto/16 :goto_24

    .line 80
    :cond_5
    const-string v8, "Routine"

    invoke-virtual {v3, v8}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v8

    const-string v14, "detail"

    const-string v15, "id"

    if-eqz v8, :cond_a

    const-string v8, "Language"

    invoke-virtual {v3, v8}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v8

    if-nez v8, :cond_a

    .line 81
    if-nez v4, :cond_8

    const-string v0, "RoutineCards"

    invoke-virtual {v3, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v8, "routines"

    if-eqz v0, :cond_6

    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v2, v15}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    if-eqz v0, :cond_8

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0, v14, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_2

    :cond_6
    invoke-static {v1, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    if-eqz v5, :cond_7

    if-nez v6, :cond_7

    const/4 v10, 0x2

    goto :goto_1

    :cond_7
    move v10, v11

    :goto_1
    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->groups(Ljava/util/List;I)Ljava/util/List;

    move-result-object v7

    .line 82
    :cond_8
    :goto_2
    const-string v0, "RoutineStats"

    invoke-virtual {v3, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4a

    if-eqz v6, :cond_9

    if-eqz v4, :cond_4a

    :cond_9
    const-string v0, "routineStats"

    invoke-virtual {v1, v0}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    if-eqz v0, :cond_4a

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v1, "kind"

    const-string v2, "routineStats"

    invoke-static {v0, v1, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v1, "routine-statistics"

    invoke-static {v0, v15, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    .line 83
    goto/16 :goto_24

    :cond_a
    const-string v8, "RoutineLanguage"

    invoke-virtual {v3, v8}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v16

    if-eqz v16, :cond_d

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v3, "language"

    if-eqz v0, :cond_c

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const-string v1, "legacy"

    invoke-virtual {v2, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v3, "\ufffd\uc52a\u8e42\uba84\ubf31"

    invoke-virtual {v1, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_b

    const-string v1, "ja"

    goto :goto_3

    :cond_b
    const-string v1, "en"

    :goto_3
    invoke-virtual {v2, v15, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    if-eqz v0, :cond_4a

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto/16 :goto_24

    :cond_c
    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    goto/16 :goto_24

    .line 84
    :cond_d
    const-string v8, "LanguageYoutube"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    const-string v11, "title"

    if-eqz v8, :cond_f

    const-string v1, "youtubeNotes"

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    const/4 v10, 0x0

    :goto_4
    invoke-virtual {v8}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-lt v10, v0, :cond_e

    goto/16 :goto_24

    :cond_e
    const-string v0, "youtube"

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-virtual {v8, v10}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v11, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "youtube-"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-static {v0, v15, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v10, v10, 0x1

    goto :goto_4

    .line 85
    :cond_f
    const-string v8, "PersonalMeal"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    const-string v10, "PersonalWorkoutMeal"

    move-object/from16 v18, v8

    const-string v8, "today"

    move-object/from16 v19, v13

    const-string v13, "workouts"

    if-nez v17, :cond_43

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v17

    if-eqz v17, :cond_10

    move-object v0, v13

    const/4 v9, 0x4

    const/4 v12, 0x0

    const/16 v16, 0x2

    goto/16 :goto_1f

    .line 86
    :cond_10
    const-string v10, "PersonalWorkoutStats"

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    move-object/from16 v17, v13

    const/4 v13, 0x7

    if-eqz v10, :cond_12

    const-string v0, "period"

    invoke-virtual {v2, v0, v13}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v0

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->workoutStats(Lorg/json/JSONObject;I)Lorg/json/JSONObject;

    move-result-object v0

    if-nez v4, :cond_11

    invoke-static {v6}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v3

    const-string v4, "summaryOnly"

    invoke-static {v0, v4, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    const-string v0, "period"

    invoke-virtual {v2, v0, v13}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v0

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->workoutTrends(Lorg/json/JSONObject;I)Ljava/util/List;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->addAll(Ljava/util/Collection;)Z

    goto/16 :goto_24

    :cond_11
    const-string v1, "chartOnly"

    invoke-static {v0, v1, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto/16 :goto_24

    .line 87
    :cond_12
    const-string v10, "PersonalWorkout"

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    const-string v13, "PersonalWorkoutChallenge"

    if-nez v10, :cond_40

    invoke-virtual {v3, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_13

    const/4 v12, 0x0

    goto/16 :goto_1d

    .line 88
    :cond_13
    invoke-virtual {v3, v13}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v10

    if-nez v10, :cond_31

    const-string v10, "PersonalWorkoutStatsInbody"

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_14

    const/16 v16, 0x2

    const/16 v24, 0x1

    goto/16 :goto_18

    .line 93
    :cond_14
    const-string v10, "PersonalReading"

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_19

    const-string v0, "books"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v10

    const-string v0, "filter"

    const-string v1, "all"

    invoke-virtual {v2, v0, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const/4 v1, 0x0

    :goto_5
    invoke-virtual {v10}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v1, v2, :cond_16

    if-eqz v5, :cond_15

    const/4 v10, 0x4

    goto :goto_6

    :cond_15
    const/4 v10, 0x2

    :goto_6
    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->groups(Ljava/util/List;I)Ljava/util/List;

    move-result-object v7

    goto/16 :goto_24

    :cond_16
    invoke-virtual {v10, v1}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "all"

    invoke-virtual {v0, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_17

    const-string v3, "status"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_18

    :cond_17
    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v7, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_18
    add-int/lit8 v1, v1, 0x1

    goto :goto_5

    .line 94
    :cond_19
    const-string v10, "PersonalQuote"

    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v10

    if-eqz v10, :cond_1d

    const-string v0, "currentBookId"

    invoke-virtual {v1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v15, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-eqz v2, :cond_1a

    const/4 v0, 0x0

    goto :goto_7

    :cond_1a
    const-string v2, "books"

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    :goto_7
    if-eqz v0, :cond_4a

    if-nez v4, :cond_1b

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v1, v14, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_1b
    if-eqz v6, :cond_1c

    if-eqz v4, :cond_4a

    :cond_1c
    const-string v1, "quote"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "quote"

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v3, "body"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "quotePage"

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->opt(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    const-string v3, "page"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "recordId"

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v1, v15, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-virtual {v0, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {v1, v11, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto/16 :goto_24

    .line 95
    :cond_1d
    const-string v4, "PersonalBullet"

    invoke-virtual {v3, v4}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_1e

    const-string v4, "PersonalToday"

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_4a

    .line 96
    :cond_1e
    const-string v4, "Seven"

    invoke-virtual {v3, v4}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v4

    if-eqz v4, :cond_1f

    const/4 v4, 0x7

    goto :goto_8

    :cond_1f
    const/4 v4, 0x3

    :goto_8
    const-string v6, "rangeDays"

    invoke-virtual {v2, v6, v4}, Lorg/json/JSONObject;->optInt(Ljava/lang/String;I)I

    move-result v2

    const/4 v4, 0x7

    if-ne v2, v4, :cond_20

    move v10, v4

    goto :goto_9

    :cond_20
    const/4 v10, 0x3

    :goto_9
    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v8, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    if-ne v10, v4, :cond_21

    const-string v4, "weekDates"

    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-virtual {v4}, Lorg/json/JSONArray;->length()I

    move-result v4

    if-lez v4, :cond_21

    const-string v2, "weekDates"

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    const/4 v4, 0x0

    invoke-virtual {v2, v4}, Lorg/json/JSONArray;->optString(I)Ljava/lang/String;

    move-result-object v2

    move-object v8, v2

    goto :goto_a

    .line 97
    :cond_21
    move-object v8, v2

    :goto_a
    const/4 v2, 0x7

    if-ne v10, v2, :cond_22

    if-nez v5, :cond_22

    invoke-static/range {p0 .. p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v2

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v6, "widget_page_"

    invoke-direct {v4, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    move/from16 v6, p1

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    const/4 v6, 0x0

    invoke-interface {v2, v4, v6}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v2

    const/4 v4, 0x4

    invoke-static {v4, v2}, Ljava/lang/Math;->min(II)I

    move-result v2

    invoke-static {v6, v2}, Ljava/lang/Math;->max(II)I

    move-result v4

    goto :goto_b

    :cond_22
    const/4 v4, 0x0

    :goto_b
    const/4 v2, 0x7

    if-ne v10, v2, :cond_23

    if-nez v5, :cond_23

    add-int/lit8 v2, v4, 0x3

    goto :goto_c

    :cond_23
    move v2, v10

    .line 98
    :goto_c
    new-instance v6, Ljava/util/ArrayList;

    invoke-direct {v6}, Ljava/util/ArrayList;-><init>()V

    const-string v12, "dates"

    invoke-virtual {v1, v12}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v12

    const-string v14, "scheduleItems"

    invoke-static {v0, v14}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    .line 99
    nop

    :goto_d
    if-lt v4, v2, :cond_2c

    .line 100
    if-eqz v5, :cond_24

    move v11, v10

    goto :goto_e

    :cond_24
    const/4 v0, 0x7

    if-ne v10, v0, :cond_25

    const/4 v11, 0x3

    goto :goto_e

    :cond_25
    const/4 v11, 0x1

    :goto_e
    invoke-static {v6, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->groups(Ljava/util/List;I)Ljava/util/List;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->addAll(Ljava/util/Collection;)Z

    .line 101
    const-string v0, "workflows"

    const-string v2, "Workflow"

    if-eqz v5, :cond_2b

    new-instance v4, Lorg/json/JSONArray;

    invoke-direct {v4}, Lorg/json/JSONArray;-><init>()V

    new-instance v5, Lorg/json/JSONArray;

    invoke-direct {v5}, Lorg/json/JSONArray;-><init>()V

    const/4 v6, 0x0

    :goto_f
    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    invoke-virtual {v8}, Lorg/json/JSONArray;->length()I

    move-result v8

    if-lt v6, v8, :cond_2a

    const/4 v6, 0x0

    :goto_10
    move-object/from16 v14, v19

    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    invoke-virtual {v8}, Lorg/json/JSONArray;->length()I

    move-result v8

    if-lt v6, v8, :cond_28

    invoke-virtual {v3, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-eqz v2, :cond_27

    const/4 v10, 0x0

    :goto_11
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v10, v2, :cond_26

    goto :goto_12

    :cond_26
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-virtual {v2, v10}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    invoke-virtual {v5, v2}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v10, v10, 0x1

    goto :goto_11

    :cond_27
    :goto_12
    new-instance v0, Lorg/json/JSONArray;

    invoke-direct {v0}, Lorg/json/JSONArray;-><init>()V

    const-string v1, "stack"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    const-string v2, "children"

    invoke-static {v1, v2, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    const-string v1, "stack"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v1, v2, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-virtual {v0, v1}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    const-string v1, "group"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const/16 v16, 0x2

    invoke-static/range {v16 .. v16}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v1

    const-string v2, "columns"

    invoke-static {v0, v2, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto/16 :goto_24

    :cond_28
    const/16 v16, 0x2

    invoke-virtual {v3, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v8

    if-eqz v8, :cond_29

    move-object v8, v4

    goto :goto_13

    :cond_29
    move-object v8, v5

    :goto_13
    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v9

    invoke-virtual {v9, v6}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v9

    invoke-virtual {v8, v9}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v6, v6, 0x1

    move-object/from16 v19, v14

    goto/16 :goto_10

    :cond_2a
    move-object/from16 v14, v19

    const/16 v16, 0x2

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    invoke-virtual {v8, v6}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v8

    invoke-virtual {v4, v8}, Lorg/json/JSONArray;->put(Ljava/lang/Object;)Lorg/json/JSONArray;

    add-int/lit8 v6, v6, 0x1

    goto/16 :goto_f

    .line 102
    :cond_2b
    move-object/from16 v14, v19

    invoke-static {v1, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-static {v7, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    invoke-static {v1, v14}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v4

    invoke-static {v7, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    invoke-virtual {v3, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v2

    if-eqz v2, :cond_4a

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    goto/16 :goto_24

    .line 99
    :cond_2c
    move-object/from16 v14, v19

    const/16 v16, 0x2

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v13

    move/from16 v19, v2

    const/4 v2, 0x5

    invoke-virtual {v13, v2, v4}, Ljava/util/Calendar;->add(II)V

    invoke-static {v13}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v2

    move-object/from16 v21, v8

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->eventsOn(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v8

    if-nez v12, :cond_2d

    new-instance v20, Lorg/json/JSONArray;

    invoke-direct/range {v20 .. v20}, Lorg/json/JSONArray;-><init>()V

    goto :goto_14

    :cond_2d
    invoke-static {v12, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v20

    :goto_14
    move-object/from16 p0, v20

    move-object/from16 p1, v0

    const/4 v0, 0x0

    :goto_15
    move-object/from16 v22, v9

    invoke-virtual/range {p0 .. p0}, Lorg/json/JSONArray;->length()I

    move-result v9

    if-lt v0, v9, :cond_2e

    new-instance v0, Lcom/aiderlog/v22app/WidgetDesignV165$1;

    invoke-direct {v0}, Lcom/aiderlog/v22app/WidgetDesignV165$1;-><init>()V

    invoke-static {v8, v0}, Ljava/util/Collections;->sort(Ljava/util/List;Ljava/util/Comparator;)V

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->join(Ljava/util/List;)Ljava/lang/String;

    move-result-object v0

    const-string v8, "day"

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v8

    new-instance v9, Ljava/lang/StringBuilder;

    const-string v23, "\ufffd\uc52a"

    const-string v24, "\ufffd\uc361"

    const-string v25, "\ufffd\uc195"

    const-string v26, "\ufffd\ub2d4"

    const-string v27, "\uf9cf\ufffd"

    const-string v28, "\u6e72\ufffd"

    const-string v29, "\ufffd\ub117"

    filled-new-array/range {v23 .. v29}, [Ljava/lang/String;

    move-result-object v20

    move/from16 v23, v10

    const/4 v10, 0x7

    invoke-virtual {v13, v10}, Ljava/util/Calendar;->get(I)I

    move-result v18

    const/16 v24, 0x1

    add-int/lit8 v18, v18, -0x1

    aget-object v18, v20, v18

    invoke-static/range {v18 .. v18}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    invoke-direct {v9, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v10, " "

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v9

    const/4 v10, 0x5

    invoke-virtual {v13, v10}, Ljava/util/Calendar;->get(I)I

    move-result v10

    invoke-virtual {v9, v10}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v9

    invoke-virtual {v9}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v9

    invoke-static {v8, v11, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v8

    const-string v9, "body"

    invoke-static {v8, v9, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0, v15, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v6, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v4, v4, 0x1

    move-object/from16 v0, p1

    move/from16 v2, v19

    move-object/from16 v8, v21

    move-object/from16 v9, v22

    move/from16 v10, v23

    move-object/from16 v19, v14

    goto/16 :goto_d

    :cond_2e
    move/from16 v23, v10

    const/16 v24, 0x1

    move-object/from16 v9, p0

    invoke-virtual {v9, v0}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v10

    move-object/from16 p0, v2

    const-string v2, "type"

    invoke-virtual {v10, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    move/from16 v18, v4

    const-string v4, "emotion"

    invoke-virtual {v4, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_30

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v4, "time"

    invoke-virtual {v10, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v4

    if-eqz v4, :cond_2f

    const-string v4, ""

    move-object/from16 p2, v6

    goto :goto_16

    :cond_2f
    new-instance v4, Ljava/lang/StringBuilder;

    move-object/from16 p2, v6

    const-string v6, "time"

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v6

    invoke-direct {v4, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v6, " "

    invoke-virtual {v4, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    :goto_16
    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v2, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v10, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v2, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v8, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_17

    :cond_30
    move-object/from16 p2, v6

    :goto_17
    add-int/lit8 v0, v0, 0x1

    move-object/from16 v2, p0

    move-object/from16 v6, p2

    move-object/from16 p0, v9

    move/from16 v4, v18

    move-object/from16 v9, v22

    move/from16 v10, v23

    goto/16 :goto_15

    .line 88
    :cond_31
    const/16 v16, 0x2

    const/16 v24, 0x1

    .line 89
    :goto_18
    const-string v0, "challenges"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v2, v15}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v0, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->choose(Lorg/json/JSONArray;Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v2

    .line 90
    const-string v8, "PersonalWorkoutChallengeOnly"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_32

    if-eqz v2, :cond_4a

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0, v14, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto/16 :goto_24

    .line 91
    :cond_32
    const-string v8, "PersonalWorkoutChallengeCombined"

    invoke-virtual {v3, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_38

    if-nez v4, :cond_33

    if-eqz v2, :cond_33

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v1, v14, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_33
    if-eqz v6, :cond_34

    if-eqz v4, :cond_4a

    :cond_34
    const/4 v10, 0x0

    :goto_19
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v1

    if-lt v10, v1, :cond_35

    goto/16 :goto_24

    :cond_35
    invoke-virtual {v0, v10}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v1

    if-eqz v2, :cond_36

    invoke-virtual {v1, v15}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v15}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_37

    :cond_36
    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_37
    add-int/lit8 v10, v10, 0x1

    goto :goto_19

    .line 92
    :cond_38
    if-nez v4, :cond_3a

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    if-eqz v5, :cond_39

    move/from16 v10, v16

    goto :goto_1a

    :cond_39
    move/from16 v10, v24

    :goto_1a
    invoke-static {v7, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->groups(Ljava/util/List;I)Ljava/util/List;

    move-result-object v7

    :cond_3a
    const-string v0, "PersonalWorkoutStatsInbody"

    invoke-virtual {v3, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4a

    if-eqz v6, :cond_3b

    if-eqz v4, :cond_4a

    :cond_3b
    const-string v0, "\uf9e3\ub301\uca37"

    const-string v2, "\u6028\u2463\uaebd\u6d39\uc1f0\uc6fe"

    const-string v3, "\uf9e3\ub301\ufffd\u8adb\u2478\ucaa7"

    filled-new-array {v0, v2, v3}, [Ljava/lang/String;

    move-result-object v0

    const-string v2, "weight"

    const-string v3, "muscle"

    const-string v4, "fat"

    filled-new-array {v2, v3, v4}, [Ljava/lang/String;

    move-result-object v2

    const-string v3, "kg"

    const-string v4, "kg"

    const-string v5, "%"

    filled-new-array {v3, v4, v5}, [Ljava/lang/String;

    move-result-object v3

    const-string v4, "inbody"

    invoke-static {v1, v4}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    const/4 v4, 0x0

    :goto_1b
    const/4 v5, 0x3

    if-lt v4, v5, :cond_3c

    .line 93
    goto/16 :goto_24

    .line 92
    :cond_3c
    new-instance v6, Lorg/json/JSONArray;

    invoke-direct {v6}, Lorg/json/JSONArray;-><init>()V

    invoke-virtual {v1}, Lorg/json/JSONArray;->length()I

    move-result v8

    const/4 v9, 0x4

    sub-int/2addr v8, v9

    const/4 v12, 0x0

    invoke-static {v12, v8}, Ljava/lang/Math;->max(II)I

    move-result v8

    :goto_1c
    invoke-virtual {v1}, Lorg/json/JSONArray;->length()I

    move-result v10

    if-lt v8, v10, :cond_3e

    invoke-virtual {v6}, Lorg/json/JSONArray;->length()I

    move-result v8

    if-lez v8, :cond_3d

    const-string v8, "trend"

    invoke-static {v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v8

    aget-object v10, v0, v4

    invoke-static {v8, v11, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v8

    const-string v10, "values"

    invoke-static {v8, v10, v6}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v6

    aget-object v8, v3, v4

    const-string v10, "unit"

    invoke-static {v6, v10, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v6

    invoke-static {v4}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v8

    const-string v10, "dash"

    invoke-static {v6, v10, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v6

    invoke-interface {v7, v6}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_3d
    add-int/lit8 v4, v4, 0x1

    goto :goto_1b

    :cond_3e
    invoke-virtual {v1, v8}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v10

    aget-object v13, v2, v4

    invoke-virtual {v10, v13}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v13

    if-nez v13, :cond_3f

    aget-object v13, v2, v4

    invoke-virtual {v10, v13}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v13

    invoke-virtual {v6, v13, v14}, Lorg/json/JSONArray;->put(D)Lorg/json/JSONArray;

    :cond_3f
    add-int/lit8 v8, v8, 0x1

    goto :goto_1c

    .line 87
    :cond_40
    const/4 v12, 0x0

    :goto_1d
    move v10, v12

    :goto_1e
    move-object/from16 v0, v17

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v10, v2, :cond_41

    invoke-virtual {v3, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_4a

    const-string v0, "challenges"

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v7, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->add(Ljava/util/List;Lorg/json/JSONArray;)V

    goto/16 :goto_24

    :cond_41
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-virtual {v2, v10}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    const-string v4, "date"

    invoke-virtual {v2, v4}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v1, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-eqz v4, :cond_42

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v7, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_42
    add-int/lit8 v10, v10, 0x1

    move-object/from16 v17, v0

    goto :goto_1e

    .line 85
    :cond_43
    move-object v0, v13

    const/4 v9, 0x4

    const/4 v12, 0x0

    const/16 v16, 0x2

    :goto_1f
    if-nez v4, :cond_46

    new-instance v2, Ljava/util/ArrayList;

    invoke-direct {v2}, Ljava/util/ArrayList;-><init>()V

    const-string v11, "meals"

    invoke-static {v1, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v11

    move v13, v12

    :goto_20
    invoke-virtual {v11}, Lorg/json/JSONArray;->length()I

    move-result v14

    if-lt v13, v14, :cond_45

    if-eqz v5, :cond_44

    move-object/from16 v14, v18

    invoke-virtual {v3, v14}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_44

    goto :goto_21

    :cond_44
    move/from16 v9, v16

    :goto_21
    invoke-static {v2, v9}, Lcom/aiderlog/v22app/WidgetDesignV165;->groups(Ljava/util/List;I)Ljava/util/List;

    move-result-object v2

    invoke-interface {v7, v2}, Ljava/util/List;->addAll(Ljava/util/Collection;)Z

    goto :goto_22

    :cond_45
    move-object/from16 v14, v18

    invoke-virtual {v11, v13}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v15

    invoke-static {v15}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v15

    const-string v9, "kind"

    const-string v12, "meal"

    invoke-static {v15, v9, v12}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v9

    invoke-interface {v2, v9}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v13, v13, 0x1

    const/4 v9, 0x4

    const/4 v12, 0x0

    goto :goto_20

    :cond_46
    :goto_22
    invoke-virtual {v3, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_4a

    if-eqz v6, :cond_47

    if-eqz v4, :cond_4a

    :cond_47
    const/4 v10, 0x0

    :goto_23
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-virtual {v2}, Lorg/json/JSONArray;->length()I

    move-result v2

    if-lt v10, v2, :cond_48

    goto :goto_24

    :cond_48
    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-virtual {v2, v10}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "date"

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v1, v8}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3, v4}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_49

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->copy(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v7, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_49
    add-int/lit8 v10, v10, 0x1

    goto :goto_23

    .line 104
    :cond_4a
    :goto_24
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    invoke-interface {v7}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v1

    :goto_25
    invoke-interface {v1}, Ljava/util/Iterator;->hasNext()Z

    move-result v2

    if-nez v2, :cond_4b

    return-object v0

    :cond_4b
    invoke-interface {v1}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Lorg/json/JSONObject;

    invoke-virtual {v2}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v0, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_25
.end method

.method public static showContentDialog(Landroid/app/Activity;)V
    .locals 13

    .line 156
    const-string v0, "id"

    const-string v1, "PersonalQuote"

    :try_start_0
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v2

    const-string v3, "appWidgetId"

    invoke-virtual {v2, v3}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v2

    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v3

    const-string v4, "providerClass"

    invoke-virtual {v3, v4}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v3

    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v4

    const-string v5, "selectedContent"

    invoke-virtual {v4, v5}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object v4

    const/4 v5, 0x1

    invoke-virtual {v2, v5}, Ljava/lang/reflect/Field;->setAccessible(Z)V

    invoke-virtual {v3, v5}, Ljava/lang/reflect/Field;->setAccessible(Z)V

    invoke-virtual {v4, v5}, Ljava/lang/reflect/Field;->setAccessible(Z)V

    invoke-virtual {v2, p0}, Ljava/lang/reflect/Field;->getInt(Ljava/lang/Object;)I

    invoke-virtual {v3, p0}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/String;

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->type(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v3

    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->model(Lorg/json/JSONObject;)Lorg/json/JSONObject;

    move-result-object v3

    new-instance v6, Ljava/util/ArrayList;

    invoke-direct {v6}, Ljava/util/ArrayList;-><init>()V

    new-instance v7, Ljava/util/ArrayList;

    invoke-direct {v7}, Ljava/util/ArrayList;-><init>()V

    .line 157
    const-string v8, "PersonalReading"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    const/4 v9, 0x0

    if-eqz v8, :cond_1

    const/4 v0, 0x4

    const-string v1, "all"

    const-string v2, "reading"

    const-string v3, "finished"

    const-string v5, "want"

    filled-new-array {v1, v2, v3, v5}, [Ljava/lang/String;

    move-result-object v1

    const-string v2, "\uf9cf\u2464\ubc7a \uf9e2\ufffd"

    const-string v3, "\ufffd\uc52b\ufffd\ub497 \u4ee5\ufffd"

    const-string v5, "\ufffd\uc17f\ufffd\ub8c6"

    const-string v8, "\ufffd\uc52b\u6028\ufffd \ufffd\ub5a2\ufffd\ufffd \uf9e2\ufffd"

    filled-new-array {v2, v3, v5, v8}, [Ljava/lang/String;

    move-result-object v2

    :goto_0
    if-lt v9, v0, :cond_0

    goto/16 :goto_7

    :cond_0
    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3}, Lorg/json/JSONObject;-><init>()V

    const-string v5, "filter"

    aget-object v8, v1, v9

    invoke-static {v3, v5, v8}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v3

    invoke-interface {v6, v3}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    aget-object v3, v2, v9

    invoke-interface {v7, v3}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v9, v9, 0x1

    goto :goto_0

    .line 158
    :cond_1
    const-string v8, "PersonalWorkoutStats"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    const/4 v10, 0x2

    const/4 v11, 0x7

    const/4 v12, 0x3

    if-eqz v8, :cond_3

    new-array v0, v12, [I

    aput v11, v0, v9

    const/16 v1, 0x1e

    aput v1, v0, v5

    const/16 v1, 0x5a

    aput v1, v0, v10

    :goto_1
    if-lt v9, v12, :cond_2

    goto/16 :goto_7

    :cond_2
    aget v1, v0, v9

    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    const-string v3, "period"

    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v5

    invoke-static {v2, v3, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v6, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "\uf9e4\uc493\ub810 "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v1

    const-string v2, "\ufffd\uc52a"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v9, v9, 0x1

    goto :goto_1

    .line 159
    :cond_3
    const-string v8, "PersonalBullet"

    invoke-virtual {v2, v8}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v8

    if-nez v8, :cond_c

    const-string v8, "PersonalToday"

    invoke-virtual {v2, v8}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v8

    if-eqz v8, :cond_4

    goto/16 :goto_5

    .line 160
    :cond_4
    invoke-virtual {v2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_5

    const-string v5, "books"

    goto :goto_3

    :cond_5
    const-string v5, "RoutineLanguage"

    invoke-virtual {v2, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_6

    const-string v5, "language"

    goto :goto_3

    :cond_6
    const-string v5, "RoutineCards"

    invoke-virtual {v2, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_7

    const-string v5, "routines"

    goto :goto_3

    :cond_7
    const-string v5, "PersonalWorkoutChallengeOnly"

    invoke-virtual {v2, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-nez v5, :cond_9

    const-string v5, "PersonalWorkoutChallengeCombined"

    invoke-virtual {v2, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_8

    goto :goto_2

    :cond_8
    const-string v5, ""

    goto :goto_3

    :cond_9
    :goto_2
    const-string v5, "challenges"

    :goto_3
    invoke-static {v3, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v3

    invoke-virtual {v2, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_a

    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    invoke-interface {v6, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    const-string v1, "\uf9e4\uc493\ub810 \ufffd\uc52b\ufffd\ub497 \uf9e2\ufffd \ufffd\uc604\ufffd\ub8de \ufffd\uaf51\ufffd\uae6e"

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    :cond_a
    :goto_4
    invoke-virtual {v3}, Lorg/json/JSONArray;->length()I

    move-result v1

    if-lt v9, v1, :cond_b

    invoke-interface {v6}, Ljava/util/List;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_d

    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    invoke-interface {v6, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    const-string v0, "\ufffd\uc7fe\uf9e3\ufffd \u6e72\uacd5\uc909"

    invoke-interface {v7, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto :goto_7

    :cond_b
    invoke-virtual {v3, v9}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v1

    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    invoke-virtual {v1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v2, v0, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v6, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    const-string v2, "title"

    invoke-virtual {v1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    add-int/lit8 v9, v9, 0x1

    goto :goto_4

    .line 159
    :cond_c
    :goto_5
    new-array v0, v10, [I

    aput v12, v0, v9

    aput v11, v0, v5

    :goto_6
    if-lt v9, v10, :cond_e

    .line 161
    :cond_d
    :goto_7
    new-instance v0, Landroid/app/AlertDialog$Builder;

    invoke-direct {v0, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v1, "\ufffd\ubab4\ufffd\ub586\ufffd\ube37 \ufffd\uada1\ufffd\uc29c"

    invoke-virtual {v0, v1}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    invoke-interface {v7}, Ljava/util/List;->size()I

    move-result v1

    new-array v1, v1, [Ljava/lang/CharSequence;

    invoke-interface {v7, v1}, Ljava/util/List;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v1

    check-cast v1, [Ljava/lang/CharSequence;

    new-instance v2, Lcom/aiderlog/v22app/WidgetDesignV165$2;

    invoke-direct {v2, v4, p0, v6}, Lcom/aiderlog/v22app/WidgetDesignV165$2;-><init>(Ljava/lang/reflect/Field;Landroid/app/Activity;Ljava/util/List;)V

    invoke-virtual {v0, v1, v2}, Landroid/app/AlertDialog$Builder;->setItems([Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p0

    const-string v0, "\u75cd\u2465\ub0fc"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p0

    invoke-virtual {p0}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    goto :goto_8

    .line 159
    :cond_e
    aget v1, v0, v9

    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    const-string v3, "rangeDays"

    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v5

    invoke-static {v2, v3, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    invoke-interface {v6, v2}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    new-instance v2, Ljava/lang/StringBuilder;

    invoke-static {v1}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v2, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "\ufffd\uc52a \u6e72\uacd5\uc909"

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-interface {v7, v1}, Ljava/util/List;->add(Ljava/lang/Object;)Z
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    add-int/lit8 v9, v9, 0x1

    goto :goto_6

    .line 162
    :catch_0
    move-exception p0

    :goto_8
    return-void
.end method

.method static stableId(Ljava/lang/String;I)J
    .locals 8

    .line 113
    const-string v0, "id"

    const-string v1, ":"

    const/16 v2, 0x20

    :try_start_0
    new-instance v3, Lorg/json/JSONObject;

    invoke-direct {v3, p0}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "kind"

    invoke-virtual {v3, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v3, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v4, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    const-string v5, "children"

    invoke-virtual {v3, v5}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v5

    if-eqz v5, :cond_1

    const/4 v6, 0x0

    :goto_0
    invoke-virtual {v5}, Lorg/json/JSONArray;->length()I

    move-result v7

    if-lt v6, v7, :cond_0

    goto :goto_1

    :cond_0
    new-instance v7, Ljava/lang/StringBuilder;

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v4

    invoke-direct {v7, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v4, "|"

    invoke-virtual {v7, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v5, v6}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v7

    invoke-virtual {v7, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v4, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v4

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    add-int/lit8 v6, v6, 0x1

    goto :goto_0

    :cond_1
    :goto_1
    invoke-virtual {v4, v1}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2

    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static {v4}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "title"

    invoke-virtual {v3, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v4

    :cond_2
    invoke-virtual {v4}, Ljava/lang/String;->hashCode()I

    move-result v0

    int-to-long v0, v0

    shl-long/2addr v0, v2

    invoke-virtual {v4}, Ljava/lang/String;->hashCode()I

    move-result v3

    const/16 v4, 0xd

    invoke-static {v3, v4}, Ljava/lang/Integer;->rotateLeft(II)I

    move-result p0
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    int-to-long p0, p0

    :goto_2
    xor-long/2addr p0, v0

    return-wide p0

    :catch_0
    move-exception v0

    invoke-virtual {p0}, Ljava/lang/String;->hashCode()I

    move-result p0

    int-to-long v0, p0

    shl-long/2addr v0, v2

    int-to-long p0, p1

    goto :goto_2
.end method

.method static twoPanels(Ljava/lang/String;Z)Z
    .locals 0

    .line 45
    if-eqz p1, :cond_1

    const-string p1, "PersonalWorkflowAll"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    const-string p1, "RoutineStats"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    const-string p1, "PersonalWorkoutStats"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    const-string p1, "PersonalWorkoutMeal"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    const-string p1, "PersonalWorkoutChallengeCombined"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    const-string p1, "PersonalWorkoutStatsInbody"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    const-string p1, "PersonalQuote"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_1

    :cond_0
    const/4 p0, 0x1

    return p0

    :cond_1
    const/4 p0, 0x0

    return p0
.end method

.method static value(Lorg/json/JSONObject;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 43
    invoke-virtual {p0, p1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_1

    invoke-virtual {p0, p1}, Lorg/json/JSONObject;->has(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    invoke-virtual {p0, p1}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide p0

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->fmt(D)Ljava/lang/String;

    move-result-object p0

    goto :goto_1

    :cond_1
    :goto_0
    const-string p0, ""

    :goto_1
    return-object p0
.end method

.method static weekDescription(Lorg/json/JSONArray;)Ljava/lang/String;
    .locals 7

    .line 146
    const-string v0, "\ufffd\uc361"

    const-string v1, "\ufffd\uc195"

    const-string v2, "\ufffd\ub2d4"

    const-string v3, "\uf9cf\ufffd"

    const-string v4, "\u6e72\ufffd"

    const-string v5, "\ufffd\ub117"

    const-string v6, "\ufffd\uc52a"

    filled-new-array/range {v0 .. v6}, [Ljava/lang/String;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V

    const/4 v2, 0x0

    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v3

    if-lt v2, v3, :cond_0

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0

    :cond_0
    rem-int/lit8 v3, v2, 0x7

    aget-object v3, v0, v3

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v3

    invoke-virtual {p0, v2}, Lorg/json/JSONArray;->optBoolean(I)Z

    move-result v4

    if-eqz v4, :cond_1

    const-string v4, " \ufffd\uc17f\u7337\ufffd "

    goto :goto_1

    :cond_1
    const-string v4, " \u8a98\uba84\uc17f\u7337\ufffd "

    :goto_1
    invoke-virtual {v3, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    add-int/lit8 v2, v2, 0x1

    goto :goto_0
.end method

.method static wide(Landroid/content/Context;I)Z
    .locals 4

    .line 33
    invoke-static {p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v0

    invoke-virtual {v0, p1}, Landroid/appwidget/AppWidgetManager;->getAppWidgetOptions(I)Landroid/os/Bundle;

    move-result-object v0

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v1

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "widget_font_"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    const/4 v2, 0x3

    invoke-interface {v1, p1, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result p1

    invoke-virtual {p0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;

    move-result-object p0

    invoke-virtual {p0}, Landroid/content/res/Resources;->getConfiguration()Landroid/content/res/Configuration;

    move-result-object p0

    iget p0, p0, Landroid/content/res/Configuration;->fontScale:F

    const/high16 v1, 0x3f800000    # 1.0f

    invoke-static {v1, p0}, Ljava/lang/Math;->max(FF)F

    move-result p0

    const-string v1, "appWidgetMinWidth"

    const/16 v3, 0x140

    invoke-virtual {v0, v1, v3}, Landroid/os/Bundle;->getInt(Ljava/lang/String;I)I

    move-result v0

    sub-int/2addr p1, v2

    const/4 v1, 0x0

    invoke-static {v1, p1}, Ljava/lang/Math;->max(II)I

    move-result p1

    mul-int/lit8 p1, p1, 0x28

    add-int/lit16 p1, p1, 0x230

    int-to-float p1, p1

    mul-float/2addr p1, p0

    invoke-static {p1}, Ljava/lang/Math;->round(F)I

    move-result p0

    if-lt v0, p0, :cond_0

    const/4 p0, 0x1

    return p0

    :cond_0
    return v1
.end method

.method static workoutStats(Lorg/json/JSONObject;I)Lorg/json/JSONObject;
    .locals 20

    .line 114
    move-object/from16 v0, p0

    move/from16 v1, p1

    const/4 v2, 0x7

    const/16 v3, 0x1e

    if-eq v1, v3, :cond_1

    const/16 v3, 0x5a

    if-ne v1, v3, :cond_0

    goto :goto_0

    :cond_0
    move v1, v2

    :cond_1
    :goto_0
    const-string v3, "today"

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v4

    rsub-int/lit8 v5, v1, 0x1

    const/4 v6, 0x5

    invoke-virtual {v4, v6, v5}, Ljava/util/Calendar;->add(II)V

    invoke-static {v4}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v4

    new-array v5, v2, [D

    new-instance v7, Ljava/util/ArrayList;

    invoke-direct {v7}, Ljava/util/ArrayList;-><init>()V

    .line 115
    const-string v7, "workouts"

    invoke-static {v0, v7}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v7

    const-wide/16 v8, 0x0

    move-wide v11, v8

    const/4 v13, 0x0

    const/4 v14, 0x0

    const/4 v15, 0x0

    :goto_1
    invoke-virtual {v7}, Lorg/json/JSONArray;->length()I

    move-result v10

    if-lt v13, v10, :cond_6

    .line 116
    new-instance v10, Lorg/json/JSONArray;

    invoke-direct {v10}, Lorg/json/JSONArray;-><init>()V

    const/4 v0, 0x0

    :goto_2
    if-lt v0, v2, :cond_5

    const-string v0, "workoutStats"

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v14}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v2

    const-string v3, "count"

    invoke-static {v0, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    if-lez v15, :cond_2

    invoke-static {v8, v9}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v2

    goto :goto_3

    :cond_2
    sget-object v2, Lorg/json/JSONObject;->NULL:Ljava/lang/Object;

    :goto_3
    const-string v3, "total"

    invoke-static {v0, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    if-lez v15, :cond_3

    int-to-double v2, v15

    div-double/2addr v8, v2

    invoke-static {v8, v9}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v2

    goto :goto_4

    :cond_3
    sget-object v2, Lorg/json/JSONObject;->NULL:Ljava/lang/Object;

    :goto_4
    const-string v3, "average"

    invoke-static {v0, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    if-lez v15, :cond_4

    invoke-static {v11, v12}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v2

    goto :goto_5

    :cond_4
    sget-object v2, Lorg/json/JSONObject;->NULL:Ljava/lang/Object;

    :goto_5
    const-string v3, "longest"

    invoke-static {v0, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "values"

    invoke-static {v0, v2, v10}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v1

    const-string v2, "period"

    invoke-static {v0, v2, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    return-object v0

    :cond_5
    aget-wide v3, v5, v0

    invoke-virtual {v10, v3, v4}, Lorg/json/JSONArray;->put(D)Lorg/json/JSONArray;

    add-int/lit8 v0, v0, 0x1

    goto :goto_2

    .line 115
    :cond_6
    invoke-virtual {v7, v13}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v10

    const-string v6, "date"

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2, v4}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v2

    if-ltz v2, :cond_9

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    move/from16 v17, v1

    invoke-virtual {v0, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v2, v1}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v1

    if-lez v1, :cond_7

    const/4 v10, 0x7

    const/16 v16, 0x5

    goto :goto_7

    :cond_7
    add-int/lit8 v14, v14, 0x1

    const-string v1, "minutes"

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_8

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v1

    add-double/2addr v8, v1

    invoke-static {v11, v12, v1, v2}, Ljava/lang/Math;->max(DD)D

    move-result-wide v11

    add-int/lit8 v15, v15, 0x1

    invoke-virtual {v10, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-static {v6}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v6

    const/4 v10, 0x7

    invoke-virtual {v6, v10}, Ljava/util/Calendar;->get(I)I

    move-result v6

    const/16 v16, 0x5

    add-int/lit8 v6, v6, 0x5

    rem-int/2addr v6, v10

    aget-wide v18, v5, v6

    add-double v18, v18, v1

    aput-wide v18, v5, v6

    goto :goto_7

    :cond_8
    :goto_6
    const/4 v10, 0x7

    const/16 v16, 0x5

    goto :goto_7

    :cond_9
    move/from16 v17, v1

    goto :goto_6

    :goto_7
    add-int/lit8 v13, v13, 0x1

    move v2, v10

    move/from16 v6, v16

    move/from16 v1, v17

    goto/16 :goto_1
.end method

.method static workoutTrends(Lorg/json/JSONObject;I)Ljava/util/List;
    .locals 26
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Lorg/json/JSONObject;",
            "I)",
            "Ljava/util/List<",
            "Lorg/json/JSONObject;",
            ">;"
        }
    .end annotation

    .line 108
    move-object/from16 v0, p0

    move/from16 v1, p1

    const/16 v2, 0x1e

    if-eq v1, v2, :cond_1

    const/16 v2, 0x5a

    if-ne v1, v2, :cond_0

    goto :goto_0

    :cond_0
    const/4 v1, 0x7

    :cond_1
    :goto_0
    const-string v2, "today"

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v3

    const/4 v4, 0x5

    rsub-int/lit8 v5, v1, 0x1

    invoke-virtual {v3, v4, v5}, Ljava/util/Calendar;->add(II)V

    invoke-static {v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v3

    .line 109
    new-instance v4, Ljava/util/LinkedHashMap;

    invoke-direct {v4}, Ljava/util/LinkedHashMap;-><init>()V

    .line 110
    const-string v5, "workouts"

    invoke-static {v0, v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v5

    const/4 v6, 0x0

    move v7, v6

    :goto_1
    invoke-virtual {v5}, Lorg/json/JSONArray;->length()I

    move-result v8

    const-string v9, "weight"

    if-lt v7, v8, :cond_5

    .line 111
    new-instance v8, Ljava/util/ArrayList;

    invoke-direct {v8}, Ljava/util/ArrayList;-><init>()V

    invoke-interface {v4}, Ljava/util/Map;->keySet()Ljava/util/Set;

    move-result-object v0

    invoke-interface {v0}, Ljava/util/Set;->iterator()Ljava/util/Iterator;

    move-result-object v12

    :goto_2
    invoke-interface {v12}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-nez v0, :cond_2

    return-object v8

    :cond_2
    invoke-interface {v12}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    move-object v13, v0

    check-cast v13, Ljava/lang/String;

    const-string v0, "\\|"

    invoke-virtual {v13, v0}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v14

    new-instance v15, Lorg/json/JSONArray;

    invoke-direct {v15}, Lorg/json/JSONArray;-><init>()V

    invoke-interface {v4, v13}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/util/TreeMap;

    invoke-virtual {v0}, Ljava/util/TreeMap;->values()Ljava/util/Collection;

    move-result-object v0

    invoke-interface {v0}, Ljava/util/Collection;->iterator()Ljava/util/Iterator;

    move-result-object v16

    const-wide/16 v2, 0x0

    :goto_3
    invoke-interface/range {v16 .. v16}, Ljava/util/Iterator;->hasNext()Z

    move-result v0

    if-nez v0, :cond_4

    const/4 v0, 0x1

    aget-object v0, v14, v0

    invoke-virtual {v0, v9}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string v0, "kg"

    goto :goto_4

    :cond_3
    const-string v0, "\u73e5\ufffd"

    :goto_4
    const-string v5, "trend"

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetDesignV165;->card(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v5

    new-instance v7, Ljava/lang/StringBuilder;

    const-string v10, "exercise:"

    invoke-direct {v7, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v7, v13}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    const-string v10, "id"

    invoke-static {v5, v10, v7}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v5

    new-instance v7, Ljava/lang/StringBuilder;

    aget-object v10, v14, v6

    invoke-static {v10}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v10

    invoke-direct {v7, v10}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v10, " \uca0c \uf9e4\uc493\ud02c "

    invoke-virtual {v7, v10}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-static {v2, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->fmt(D)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v7, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "title"

    invoke-static {v5, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v2

    const-string v3, "unit"

    invoke-static {v2, v3, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v2, "values"

    invoke-static {v0, v2, v15}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "\u6e72\uacd5\uc909 \ufffd\uad87\uf9de\uc495\ud00e \uf9e4\uc493\ud02c\u5a9b\ufffd \uca0c \uf9e4\uc493\ub810 "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "\ufffd\uc52a"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "foot"

    invoke-static {v0, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-interface {v8, v0}, Ljava/util/List;->add(Ljava/lang/Object;)Z

    goto/16 :goto_2

    :cond_4
    invoke-interface/range {v16 .. v16}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/Double;

    invoke-virtual {v0}, Ljava/lang/Double;->doubleValue()D

    move-result-wide v10

    invoke-virtual {v15, v10, v11}, Lorg/json/JSONArray;->put(D)Lorg/json/JSONArray;

    invoke-static {v2, v3, v10, v11}, Ljava/lang/Math;->max(DD)D

    move-result-wide v2

    goto/16 :goto_3

    .line 110
    :cond_5
    invoke-virtual {v5, v7}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v8

    const-string v10, "date"

    invoke-virtual {v8, v10}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v10

    invoke-virtual {v10, v3}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v11

    if-ltz v11, :cond_e

    invoke-virtual {v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-virtual {v10, v11}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v11

    if-lez v11, :cond_6

    :goto_5
    move/from16 v19, v1

    move-object/from16 v20, v2

    move-object/from16 v21, v3

    move-object/from16 v23, v4

    move-object/from16 v22, v5

    goto/16 :goto_b

    :cond_6
    const-string v11, "exercises"

    invoke-static {v8, v11}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v8

    move v11, v6

    :goto_6
    invoke-virtual {v8}, Lorg/json/JSONArray;->length()I

    move-result v12

    if-lt v11, v12, :cond_7

    goto :goto_5

    :cond_7
    invoke-virtual {v8, v11}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v12

    const-string v13, "sets"

    invoke-static {v12, v13}, Lcom/aiderlog/v22app/WidgetDesignV165;->a(Lorg/json/JSONObject;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v13

    move v14, v6

    :goto_7
    invoke-virtual {v13}, Lorg/json/JSONArray;->length()I

    move-result v15

    if-lt v14, v15, :cond_8

    add-int/lit8 v11, v11, 0x1

    goto :goto_6

    :cond_8
    const/4 v15, 0x2

    const-string v6, "seconds"

    filled-new-array {v9, v6}, [Ljava/lang/String;

    move-result-object v6

    const/4 v0, 0x0

    :goto_8
    if-lt v0, v15, :cond_9

    add-int/lit8 v14, v14, 0x1

    move-object/from16 v0, p0

    const/4 v6, 0x0

    goto :goto_7

    :cond_9
    aget-object v15, v6, v0

    move/from16 v19, v1

    invoke-virtual {v13, v14}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v1

    invoke-virtual {v1, v15}, Lorg/json/JSONObject;->isNull(Ljava/lang/String;)Z

    move-result v20

    if-nez v20, :cond_d

    invoke-virtual {v1, v15}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v20

    const-wide/16 v17, 0x0

    cmpg-double v20, v20, v17

    if-gtz v20, :cond_a

    move-object/from16 v20, v2

    move-object/from16 v21, v3

    move-object/from16 v23, v4

    move-object/from16 v22, v5

    goto/16 :goto_a

    :cond_a
    move-object/from16 v20, v2

    new-instance v2, Ljava/lang/StringBuilder;

    move-object/from16 v21, v3

    const-string v3, "name"

    invoke-virtual {v12, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-static {v3}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v3, "|"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2, v15}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-interface {v4, v2}, Ljava/util/Map;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v3

    check-cast v3, Ljava/util/TreeMap;

    if-nez v3, :cond_b

    new-instance v3, Ljava/util/TreeMap;

    invoke-direct {v3}, Ljava/util/TreeMap;-><init>()V

    invoke-interface {v4, v2, v3}, Ljava/util/Map;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    :cond_b
    invoke-virtual {v3, v10}, Ljava/util/TreeMap;->containsKey(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_c

    invoke-virtual {v3, v10}, Ljava/util/TreeMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Ljava/lang/Double;

    invoke-virtual {v2}, Ljava/lang/Double;->doubleValue()D

    move-result-wide v22

    move-object v2, v4

    move-wide/from16 v24, v22

    move-object/from16 v22, v5

    move-wide/from16 v4, v24

    goto :goto_9

    :cond_c
    move-object v2, v4

    move-object/from16 v22, v5

    move-wide/from16 v4, v17

    :goto_9
    move-object/from16 v23, v2

    invoke-virtual {v1, v15}, Lorg/json/JSONObject;->optDouble(Ljava/lang/String;)D

    move-result-wide v1

    invoke-static {v4, v5, v1, v2}, Ljava/lang/Math;->max(DD)D

    move-result-wide v1

    invoke-static {v1, v2}, Ljava/lang/Double;->valueOf(D)Ljava/lang/Double;

    move-result-object v1

    invoke-virtual {v3, v10, v1}, Ljava/util/TreeMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    goto :goto_a

    :cond_d
    move-object/from16 v20, v2

    move-object/from16 v21, v3

    move-object/from16 v23, v4

    move-object/from16 v22, v5

    const-wide/16 v17, 0x0

    :goto_a
    add-int/lit8 v0, v0, 0x1

    move/from16 v1, v19

    move-object/from16 v2, v20

    move-object/from16 v3, v21

    move-object/from16 v5, v22

    move-object/from16 v4, v23

    const/4 v15, 0x2

    goto/16 :goto_8

    :cond_e
    move/from16 v19, v1

    move-object/from16 v20, v2

    move-object/from16 v21, v3

    move-object/from16 v23, v4

    move-object/from16 v22, v5

    :goto_b
    add-int/lit8 v7, v7, 0x1

    move-object/from16 v0, p0

    move/from16 v1, v19

    move-object/from16 v2, v20

    move-object/from16 v3, v21

    move-object/from16 v5, v22

    move-object/from16 v4, v23

    const/4 v6, 0x0

    goto/16 :goto_1
.end method
