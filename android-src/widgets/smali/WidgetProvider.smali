.class public Lcom/aiderlog/v22app/WidgetProvider;
.super Landroid/appwidget/AppWidgetProvider;
.source "WidgetProvider.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/aiderlog/v22app/WidgetProvider$CalendarAgenda;,
        Lcom/aiderlog/v22app/WidgetProvider$CalendarCombined;,
        Lcom/aiderlog/v22app/WidgetProvider$CalendarFortnight;,
        Lcom/aiderlog/v22app/WidgetProvider$CalendarMonth;,
        Lcom/aiderlog/v22app/WidgetProvider$CalendarSplit;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalMeal;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalQuote;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalToday;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallengeOnly;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkflowAll;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkflowOne;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkout;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallenge;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutStats;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutStatsInbody;,
        Lcom/aiderlog/v22app/WidgetProvider$RoutineAll;,
        Lcom/aiderlog/v22app/WidgetProvider$RoutineCards;,
        Lcom/aiderlog/v22app/WidgetProvider$RoutineLanguage;,
        Lcom/aiderlog/v22app/WidgetProvider$LanguageYoutube;,
        Lcom/aiderlog/v22app/WidgetProvider$TaskClientLink;,
        Lcom/aiderlog/v22app/WidgetProvider$TaskTwoWeeks;,
        Lcom/aiderlog/v22app/WidgetProvider$TaskWeek;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalTodo;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalReading;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalBulletSeven;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalBulletThreeWorkflow;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalBulletSevenWorkflow;,
        Lcom/aiderlog/v22app/WidgetProvider$RoutineStats;,
        Lcom/aiderlog/v22app/WidgetProvider$RoutineLanguageAll;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutMeal;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallengeAll;,
        Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallengeCombined;
    }
.end annotation


# static fields
.field public static final KEY_EMAIL:Ljava/lang/String; = "active_email"

.field public static final KEY_SNAPSHOT:Ljava/lang/String; = "widget_snapshot"

.field public static final KEY_THEME:Ljava/lang/String; = "theme"

.field public static final PREFS:Ljava/lang/String; = "aiderlog_native"


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 20
    invoke-direct {p0}, Landroid/appwidget/AppWidgetProvider;-><init>()V

    return-void
.end method

.method private static applyMealPhotos(Landroid/widget/RemoteViews;Lorg/json/JSONObject;)V
    .locals 8

    const-string v0, "mealPhotos"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    if-eqz v0, :cond_2

    const/4 v1, 0x3

    new-array v2, v1, [I

    const v3, 0x7f030005

    const/4 v4, 0x0

    aput v3, v2, v4

    const v3, 0x7f030006

    const/4 v5, 0x1

    aput v3, v2, v5

    const v3, 0x7f030007

    const/4 v5, 0x2

    aput v3, v2, v5

    :goto_0
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v3

    invoke-static {v1, v3}, Ljava/lang/Math;->min(II)I

    move-result v3

    if-lt v4, v3, :cond_0

    goto :goto_1

    :cond_0
    const-string v3, ""

    invoke-virtual {v0, v4, v3}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const/16 v5, 0x2c

    invoke-virtual {v3, v5}, Ljava/lang/String;->indexOf(I)I

    move-result v5

    if-ltz v5, :cond_1

    add-int/lit8 v5, v5, 0x1

    invoke-virtual {v3, v5}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v3

    const/4 v5, 0x0

    invoke-static {v3, v5}, Landroid/util/Base64;->decode(Ljava/lang/String;I)[B

    move-result-object v3

    array-length v6, v3

    invoke-static {v3, v5, v6}, Landroid/graphics/BitmapFactory;->decodeByteArray([BII)Landroid/graphics/Bitmap;

    move-result-object v3

    if-eqz v3, :cond_1

    aget v6, v2, v4

    invoke-virtual {p0, v6, v3}, Landroid/widget/RemoteViews;->setImageViewBitmap(ILandroid/graphics/Bitmap;)V

    :cond_1
    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    :cond_2
    :goto_1
    return-void
.end method

.method private static applyTheme(Landroid/widget/RemoteViews;Ljava/lang/String;)V
    .locals 5

    if-nez p1, :cond_0

    .line 234
    const-string p1, "aurora"

    goto :goto_0

    :cond_0
    sget-object v0, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p1, v0}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p1

    .line 236
    :goto_0
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v0

    const-string v1, "midnight"

    sparse-switch v0, :sswitch_data_0

    goto :goto_1

    :sswitch_0
    const-string v0, "ocean"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_1

    goto :goto_1

    :cond_1
    const v0, 0x7f020005

    goto :goto_2

    :sswitch_1
    const-string v0, "rose"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    goto :goto_1

    :cond_2
    const v0, 0x7f020006

    goto :goto_2

    :sswitch_2
    const-string v0, "mono"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_3

    goto :goto_1

    :cond_3
    const v0, 0x7f020004

    goto :goto_2

    :sswitch_3
    const-string v0, "mint"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_4

    goto :goto_1

    :cond_4
    const v0, 0x7f020003

    goto :goto_2

    :sswitch_4
    const-string v0, "sunset"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_5

    goto :goto_1

    :cond_5
    const v0, 0x7f020007

    goto :goto_2

    :sswitch_5
    const-string v0, "lavender"

    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_6

    goto :goto_1

    :cond_6
    const v0, 0x7f020001

    goto :goto_2

    :sswitch_6
    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_7

    goto :goto_1

    :cond_7
    const v0, 0x7f020002

    goto :goto_2

    :goto_1
    const/high16 v0, 0x7f020000

    :goto_2
    const v2, 0x7f030008

    .line 246
    const-string v3, "setBackgroundResource"

    invoke-virtual {p0, v2, v3, v0}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    .line 247
    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_8

    const/4 v0, -0x1

    goto :goto_3

    :cond_8
    const/16 v0, 0x1a

    const/16 v1, 0x45

    const/16 v2, 0x11

    .line 248
    invoke-static {v2, v0, v1}, Landroid/graphics/Color;->rgb(III)I

    move-result v0

    :goto_3
    const/16 v1, 0xff

    if-eqz p1, :cond_9

    const/16 v2, 0xde

    const/16 v3, 0xda

    .line 249
    invoke-static {v2, v3, v1}, Landroid/graphics/Color;->rgb(III)I

    move-result v2

    goto :goto_4

    :cond_9
    const/16 v2, 0x6f

    const/16 v3, 0x92

    const/16 v4, 0x66

    invoke-static {v4, v2, v3}, Landroid/graphics/Color;->rgb(III)I

    move-result v2

    :goto_4
    if-eqz p1, :cond_a

    const/16 p1, 0xcd

    const/16 v3, 0xc4

    goto :goto_5

    :cond_a
    const/16 p1, 0x5b

    const/16 v3, 0x4c

    .line 250
    :goto_5
    invoke-static {p1, v3, v1}, Landroid/graphics/Color;->rgb(III)I

    move-result p1

    const v1, 0x7f030004

    .line 251
    invoke-virtual {p0, v1, v0}, Landroid/widget/RemoteViews;->setTextColor(II)V

    const v1, 0x7f030003

    .line 252
    invoke-virtual {p0, v1, v2}, Landroid/widget/RemoteViews;->setTextColor(II)V

    const v1, 0x7f030001

    .line 253
    invoke-virtual {p0, v1, v0}, Landroid/widget/RemoteViews;->setTextColor(II)V

    const/high16 v0, 0x7f030000

    .line 254
    invoke-virtual {p0, v0, p1}, Landroid/widget/RemoteViews;->setTextColor(II)V

    return-void

    :sswitch_data_0
    .sparse-switch
        -0x61cd9530 -> :sswitch_6
        -0x52a5fa39 -> :sswitch_5
        -0x351e356a -> :sswitch_4
        0x332462 -> :sswitch_3
        0x333ae3 -> :sswitch_2
        0x35814f -> :sswitch_1
        0x64ab8fe -> :sswitch_0
    .end sparse-switch
.end method

.method private static applyUserAppearance(Landroid/widget/RemoteViews;Landroid/content/Context;I)V
    .locals 7

    const-string v0, "aiderlog_native"

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_opacity_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const/16 v2, 0x64

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v1

    mul-int/lit16 v1, v1, 0xff

    div-int/lit8 v1, v1, 0x64

    const v2, 0x7f030008

    const-string v3, "setImageAlpha"

    invoke-virtual {p0, v2, v3, v1}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_font_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const/4 v2, 0x3

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I

    move-result v0

    const/4 v1, 0x1

    if-ne v0, v1, :cond_font_2

    const/high16 v1, 0x41700000    # 15.0f

    const/high16 v2, 0x41300000    # 11.0f

    goto :goto_font_ready

    :cond_font_2
    const/4 v1, 0x2

    if-ne v0, v1, :cond_font_3

    const/high16 v1, 0x41840000    # 16.5f

    const/high16 v2, 0x41480000    # 12.5f

    goto :goto_font_ready

    :cond_font_3
    const/4 v1, 0x4

    if-ne v0, v1, :cond_font_5

    const/high16 v1, 0x41a00000    # 20.0f

    const/high16 v2, 0x41700000    # 15.0f

    goto :goto_font_ready

    :cond_font_5
    const/4 v1, 0x5

    if-ne v0, v1, :cond_font_default

    const/high16 v1, 0x41b00000    # 22.0f

    const/high16 v2, 0x41880000    # 17.0f

    goto :goto_font_ready

    :cond_font_default
    const/high16 v1, 0x41900000    # 18.0f

    const/high16 v2, 0x41600000    # 14.0f

    :goto_font_ready
    const/4 v0, 0x2

    const v3, 0x7f030004

    invoke-virtual {p0, v3, v0, v1}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    const v3, 0x7f030001

    invoke-virtual {p0, v3, v0, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    const v3, 0x7f030003

    invoke-virtual {p0, v3, v0, v2}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    const/high16 v3, 0x3f800000    # 1.0f

    sub-float v3, v2, v3

    const/high16 v4, 0x40e00000    # 7.0f

    invoke-static {v3, v4}, Ljava/lang/Math;->max(FF)F

    move-result v3

    const/high16 v4, 0x7f030000

    invoke-virtual {p0, v4, v0, v3}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    return-void
.end method

.method private static applyTypeScale(Landroid/widget/RemoteViews;Ljava/lang/String;)V
    .locals 4

    .line 222
    const-string v0, "Task"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    const/high16 v1, 0x41700000    # 15.0f

    if-eqz v0, :cond_0

    move v0, v1

    goto :goto_0

    :cond_0
    const/high16 v0, 0x41880000    # 17.0f

    .line 224
    :goto_0
    const-string v2, "CalendarAgenda"

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_1

    const/high16 v0, 0x41900000    # 18.0f

    const/high16 v1, 0x41600000    # 14.0f

    goto :goto_1

    :cond_1
    const-string v2, "Calendar"

    invoke-virtual {p1, v2}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_2

    const/high16 v0, 0x41a00000    # 20.0f

    const/high16 v1, 0x41180000    # 9.5f

    goto :goto_1

    const/high16 v3, 0x41600000    # 14.0f

    .line 227
    :cond_2
    const-string v2, "RoutineCards"

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_5

    const-string v2, "PersonalWorkflowOne"

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_5

    const-string v2, "PersonalQuote"

    invoke-virtual {v2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_3

    goto :goto_1

    .line 228
    :cond_3
    const-string v1, "TaskClientLink"

    invoke-virtual {v1, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_4

    move v1, v3

    goto :goto_1

    :cond_4
    const/high16 v1, 0x41480000    # 12.5f

    :cond_5
    :goto_1
    const p1, 0x7f030004

    const/4 v2, 0x2

    .line 229
    invoke-virtual {p0, p1, v2, v0}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    const p1, 0x7f030001

    .line 230
    invoke-virtual {p0, p1, v2, v1}, Landroid/widget/RemoteViews;->setTextViewTextSize(IIF)V

    return-void
.end method

.method private static compactMonthGrid()Ljava/lang/String;
    .locals 5

    .line 215
    sget-object v0, Ljava/util/Locale;->KOREA:Ljava/util/Locale;

    invoke-static {v0}, Ljava/util/Calendar;->getInstance(Ljava/util/Locale;)Ljava/util/Calendar;

    move-result-object v0

    const/4 v1, 0x5

    .line 216
    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    const/4 v2, 0x4

    .line 217
    invoke-virtual {v0, v2}, Ljava/util/Calendar;->get(I)I

    move-result v2

    .line 218
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v4, "\uc774\ubc88 \ub2ec "

    invoke-direct {v3, v4}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const/4 v4, 0x2

    invoke-virtual {v0, v4}, Ljava/util/Calendar;->get(I)I

    move-result v0

    add-int/lit8 v0, v0, 0x1

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v0, "\uc6d4  \u00b7  "

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v0, "\uc8fc\ucc28  \u00b7  \uc624\ub298 "

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3, v1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    const-string v0, "\uc77c"

    invoke-virtual {v3, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method private static configuredContent(Landroid/content/Context;I)Ljava/lang/String;
    .locals 4

    const-string v0, "aiderlog_native"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_content_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    const-string v2, "\uc804\uccb4 \ub0b4\uc6a9"

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method private static configuredLines(Landroid/content/Context;ILorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;
    .locals 6

    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetProvider;->configuredContent(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v0

    const-string v1, "\uc804\uccb4"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-nez v1, :cond_3

    if-eqz p2, :cond_2

    invoke-virtual {p2}, Lorg/json/JSONArray;->length()I

    move-result v1

    const/4 v2, 0x0

    :goto_0
    if-lt v2, v1, :cond_0

    goto :goto_1

    :cond_0
    const-string v3, ""

    invoke-virtual {p2, v2, v3}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v4

    if-eqz v4, :cond_1

    new-instance v4, Ljava/lang/StringBuilder;

    const-string v5, "\u2022 "

    invoke-direct {v4, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v4}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0

    :cond_1
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    :cond_2
    :goto_1
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "\u2022 "

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0

    :cond_3
    invoke-static {p2, p3, p4}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v0

    return-object v0
.end method

.method private static first(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    if-eqz p0, :cond_2

    .line 175
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-nez v0, :cond_0

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    .line 176
    const-string v1, ""

    invoke-virtual {p0, v0, v1}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    .line 177
    invoke-virtual {p0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_1

    goto :goto_0

    :cond_1
    move-object p1, p0

    :cond_2
    :goto_0
    return-object p1
.end method

.method private static lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;
    .locals 4

    if-eqz p0, :cond_5

    .line 181
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v0

    if-nez v0, :cond_0

    goto :goto_3

    .line 182
    :cond_0
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-direct {v0}, Ljava/lang/StringBuilder;-><init>()V

    const/4 v1, 0x0

    .line 183
    :goto_0
    invoke-virtual {p0}, Lorg/json/JSONArray;->length()I

    move-result v2

    invoke-static {p1, v2}, Ljava/lang/Math;->min(II)I

    move-result v2

    if-lt v1, v2, :cond_2

    .line 189
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->length()I

    move-result p0

    if-nez p0, :cond_1

    goto :goto_1

    :cond_1
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    :goto_1
    return-object p2

    .line 184
    :cond_2
    const-string v2, ""

    invoke-virtual {p0, v1, v2}, Lorg/json/JSONArray;->optString(ILjava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v2

    .line 185
    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v3

    if-eqz v3, :cond_3

    goto :goto_2

    .line 186
    :cond_3
    invoke-virtual {v0}, Ljava/lang/StringBuilder;->length()I

    move-result v3

    if-lez v3, :cond_4

    const/16 v3, 0xa

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 187
    :cond_4
    const-string v3, "\u2022 "

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    :goto_2
    add-int/lit8 v1, v1, 0x1

    goto :goto_0

    :cond_5
    :goto_3
    return-object p2
.end method

.method private static monthGrid()Ljava/lang/String;
    .locals 9

    .line 193
    sget-object v0, Ljava/util/Locale;->KOREA:Ljava/util/Locale;

    invoke-static {v0}, Ljava/util/Calendar;->getInstance(Ljava/util/Locale;)Ljava/util/Calendar;

    move-result-object v0

    const/4 v1, 0x5

    .line 194
    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v2

    const/4 v3, 0x2

    .line 195
    invoke-virtual {v0, v3}, Ljava/util/Calendar;->get(I)I

    move-result v3

    const/4 v4, 0x1

    .line 196
    invoke-virtual {v0, v4}, Ljava/util/Calendar;->get(I)I

    move-result v5

    .line 197
    invoke-virtual {v0, v5, v3, v4}, Ljava/util/Calendar;->set(III)V

    const/4 v3, 0x7

    .line 198
    invoke-virtual {v0, v3}, Ljava/util/Calendar;->get(I)I

    move-result v3

    sub-int/2addr v3, v4

    .line 199
    invoke-virtual {v0, v1}, Ljava/util/Calendar;->getActualMaximum(I)I

    move-result v0

    .line 200
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v5, "\uc77c  \uc6d4  \ud654  \uc218  \ubaa9  \uae08  \ud1a0\n"

    invoke-direct {v1, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const/4 v5, 0x0

    :goto_0
    add-int v6, v3, v0

    if-lt v5, v6, :cond_0

    .line 211
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    return-object v0

    :cond_0
    const/16 v6, 0xa

    if-ge v5, v3, :cond_1

    .line 202
    const-string v7, "   "

    invoke-virtual {v1, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_2

    :cond_1
    sub-int v7, v5, v3

    add-int/2addr v7, v4

    if-ne v7, v2, :cond_2

    .line 205
    const-string v8, "\u00b7"

    goto :goto_1

    :cond_2
    const-string v8, " "

    :goto_1
    invoke-virtual {v1, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    if-ge v7, v6, :cond_3

    const/16 v8, 0x30

    .line 206
    invoke-virtual {v1, v8}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    .line 207
    :cond_3
    invoke-virtual {v1, v7}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    .line 209
    :goto_2
    rem-int/lit8 v7, v5, 0x7

    const/4 v8, 0x6

    if-ne v7, v8, :cond_4

    goto :goto_3

    :cond_4
    const/16 v6, 0x20

    :goto_3
    invoke-virtual {v1, v6}, Ljava/lang/StringBuilder;->append(C)Ljava/lang/StringBuilder;

    add-int/lit8 v5, v5, 0x1

    goto :goto_0
.end method

.method public static safeUpdateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V
    .locals 7

    :try_start_0
    invoke-static {p0, p1, p2, p3}, Lcom/aiderlog/v22app/WidgetProvider;->updateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception v0

    :try_start_1
    new-instance v1, Landroid/widget/RemoteViews;

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v2

    const/high16 v3, 0x7f040000

    invoke-direct {v1, v2, v3}, Landroid/widget/RemoteViews;-><init>(Ljava/lang/String;I)V

    const v2, 0x7f030004

    const-string v3, "AiderLog"

    invoke-virtual {v1, v2, v3}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const v2, 0x7f030003

    const-string v3, "\uc704\uc82f \uc900\ube44 \uc644\ub8cc"

    invoke-virtual {v1, v2, v3}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const v2, 0x7f030001

    const-string v3, "\uc571\uc744 \uc5f4\uba74 \uc120\ud0dd\ud55c \ub0b4\uc6a9\uacfc \ud14c\ub9c8\uac00 \uc790\ub3d9\uc73c\ub85c \ub3d9\uae30\ud654\ub429\ub2c8\ub2e4."

    invoke-virtual {v1, v2, v3}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const/high16 v2, 0x7f030000

    const-string v3, "AiderLog \uc5f4\uae30  \u203a"

    invoke-virtual {v1, v2, v3}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    new-instance v3, Landroid/content/Intent;

    const-class v4, Lcom/aiderlog/v22app/MainActivity;

    invoke-direct {v3, p0, v4}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const-string v4, "aiderlog.widget.safe"

    invoke-virtual {v3, v4}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    const/high16 v4, 0x14000000

    invoke-virtual {v3, v4}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    const/high16 v4, 0xc000000

    invoke-static {p0, p2, v3, v4}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v5

    const v6, 0x7f030002

    invoke-virtual {v1, v6, v5}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-virtual {v1, v2, v5}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    invoke-virtual {p1, p2, v1}, Landroid/appwidget/AppWidgetManager;->updateAppWidget(ILandroid/widget/RemoteViews;)V
    :try_end_1
    .catch Ljava/lang/Throwable; {:try_start_1 .. :try_end_1} :catch_1

    return-void

    :catch_1
    move-exception v0

    return-void
.end method

.method private static twoWeekGrid()Ljava/lang/String;
    .locals 5

    sget-object v0, Ljava/util/Locale;->KOREA:Ljava/util/Locale;

    invoke-static {v0}, Ljava/util/Calendar;->getInstance(Ljava/util/Locale;)Ljava/util/Calendar;

    move-result-object v0

    const/4 v1, 0x7

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v1

    add-int/lit8 v1, v1, -0x1

    neg-int v1, v1

    const/4 v2, 0x5

    invoke-virtual {v0, v2, v1}, Ljava/util/Calendar;->add(II)V

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "\uc77c  \uc6d4  \ud654  \uc218  \ubaa9  \uae08  \ud1a0\n"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const/4 v2, 0x0

    :goto_0
    const/16 v3, 0xe

    if-lt v2, v3, :cond_0

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    return-object v0

    :cond_0
    const/4 v3, 0x5

    invoke-virtual {v0, v3}, Ljava/util/Calendar;->get(I)I

    move-result v3

    const/16 v4, 0xa

    if-ge v3, v4, :cond_1

    const-string v4, "0"

    invoke-virtual {v1, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    :cond_1
    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    add-int/lit8 v2, v2, 0x1

    const/16 v3, 0xe

    if-lt v2, v3, :cond_2

    goto :goto_1

    :cond_2
    rem-int/lit8 v3, v2, 0x7

    if-nez v3, :cond_3

    const-string v3, "\n"

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    goto :goto_1

    :cond_3
    const-string v3, "  "

    invoke-virtual {v1, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    :goto_1
    const/4 v3, 0x5

    const/4 v4, 0x1

    invoke-virtual {v0, v3, v4}, Ljava/util/Calendar;->add(II)V

    goto :goto_0
.end method

.method public static updateAll(Landroid/content/Context;)V
    .locals 34

    move-object/from16 v0, p0

    .line 33
    invoke-static/range {p0 .. p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v1

    .line 35
    const-class v2, Lcom/aiderlog/v22app/WidgetProvider$CalendarMonth;

    const-class v3, Lcom/aiderlog/v22app/WidgetProvider$CalendarSplit;

    const-class v4, Lcom/aiderlog/v22app/WidgetProvider$CalendarAgenda;

    .line 36
    const-class v5, Lcom/aiderlog/v22app/WidgetProvider$RoutineCards;

    const-class v6, Lcom/aiderlog/v22app/WidgetProvider$RoutineAll;

    const-class v7, Lcom/aiderlog/v22app/WidgetProvider$RoutineLanguage;

    .line 37
    const-class v8, Lcom/aiderlog/v22app/WidgetProvider$PersonalMeal;

    const-class v9, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkout;

    const-class v10, Lcom/aiderlog/v22app/WidgetProvider$PersonalToday;

    const-class v11, Lcom/aiderlog/v22app/WidgetProvider$PersonalQuote;

    const-class v12, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkflowOne;

    const-class v13, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkflowAll;

    .line 38
    const-class v14, Lcom/aiderlog/v22app/WidgetProvider$TaskWeek;

    const-class v15, Lcom/aiderlog/v22app/WidgetProvider$TaskTwoWeeks;

    const-class v16, Lcom/aiderlog/v22app/WidgetProvider$TaskClientLink;

    const-class v17, Lcom/aiderlog/v22app/WidgetProvider$CalendarCombined;

    const-class v18, Lcom/aiderlog/v22app/WidgetProvider$CalendarFortnight;

    const-class v19, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallenge;

    const-class v20, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallengeOnly;

    const-class v21, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutStats;

    const-class v22, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutStatsInbody;

    const-class v23, Lcom/aiderlog/v22app/WidgetProvider$LanguageYoutube;

    const-class v24, Lcom/aiderlog/v22app/WidgetProvider$PersonalTodo;

    const-class v25, Lcom/aiderlog/v22app/WidgetProvider$PersonalReading;

    const-class v26, Lcom/aiderlog/v22app/WidgetProvider$PersonalBulletSeven;

    const-class v27, Lcom/aiderlog/v22app/WidgetProvider$PersonalBulletThreeWorkflow;

    const-class v28, Lcom/aiderlog/v22app/WidgetProvider$PersonalBulletSevenWorkflow;

    const-class v29, Lcom/aiderlog/v22app/WidgetProvider$RoutineStats;

    const-class v30, Lcom/aiderlog/v22app/WidgetProvider$RoutineLanguageAll;

    const-class v31, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutMeal;

    const-class v32, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallengeAll;

    const-class v33, Lcom/aiderlog/v22app/WidgetProvider$PersonalWorkoutChallengeCombined;

    filled-new-array/range {v2 .. v33}, [Ljava/lang/Class;

    move-result-object v2

    const/4 v3, 0x0

    move v4, v3

    :goto_0
    const/16 v5, 0x20

    if-lt v4, v5, :cond_0

    return-void

    .line 40
    :cond_0
    aget-object v5, v2, v4

    .line 41
    new-instance v6, Landroid/content/ComponentName;

    invoke-direct {v6, v0, v5}, Landroid/content/ComponentName;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 42
    invoke-virtual {v1, v6}, Landroid/appwidget/AppWidgetManager;->getAppWidgetIds(Landroid/content/ComponentName;)[I

    move-result-object v6

    array-length v7, v6

    move v8, v3

    :goto_1
    if-lt v8, v7, :cond_1

    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    :cond_1
    aget v9, v6, v8

    invoke-virtual {v5}, Ljava/lang/Class;->getName()Ljava/lang/String;

    move-result-object v10

    invoke-static {v0, v1, v9, v10}, Lcom/aiderlog/v22app/WidgetProvider;->safeUpdateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V

    add-int/lit8 v8, v8, 0x1

    goto :goto_1
.end method

.method public static updateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V
    .locals 11

    invoke-static {p0, p1, p2, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->update(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)Z
    move-result v0
    if-eqz v0, :legacy_widget_v164
    return-void
    :legacy_widget_v164

    .line 47
    const-string v0, "aiderlog_native"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    .line 49
    :try_start_0
    new-instance v2, Lorg/json/JSONObject;

    const-string v3, "widget_snapshot"

    const-string v4, "{}"

    invoke-interface {v0, v3, v4}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-direct {v2, v3}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 50
    :catch_0
    new-instance v2, Lorg/json/JSONObject;

    invoke-direct {v2}, Lorg/json/JSONObject;-><init>()V

    .line 51
    :goto_0
    const-string v3, "active_email"

    const-string v4, ""

    invoke-interface {v0, v3, v4}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 52
    const-string v5, "aurora"

    const-string v6, "theme"

    invoke-interface {v0, v6, v5}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v2, v6, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v5, "aiderlog_native"

    const/4 v6, 0x0

    invoke-virtual {p0, v5, v6}, Landroid/content/Context;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v5

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "widget_theme_"

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v6, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-interface {v5, v6, v0}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const/4 v5, 0x1

    if-nez p3, :cond_0

    move-object p3, v4

    goto :goto_1

    :cond_0
    const/16 v6, 0x24

    .line 53
    invoke-virtual {p3, v6}, Ljava/lang/String;->lastIndexOf(I)I

    move-result v6

    add-int/2addr v6, v5

    invoke-virtual {p3, v6}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object p3

    .line 54
    :goto_1
    const-string v6, "Task"

    invoke-virtual {p3, v6}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v6

    if-eqz v6, :cond_1

    .line 55
    const-string v7, "aidway55@gmail.com"

    invoke-virtual {v7, v3}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v3

    if-nez v3, :cond_1

    goto :goto_2

    :cond_1
    move v1, v5

    :goto_2
    if-eqz v6, :cond_2

    const v3, 0x7f040003

    goto :goto_3

    .line 56
    :cond_2
    const-string v3, "RoutineCards"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_routine_all

    const v3, 0x7f04000b

    goto :goto_3

    :cond_v148_routine_all
    const-string v3, "RoutineAll"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_routine_language

    const v3, 0x7f04000a

    goto :goto_3

    :cond_v148_routine_language
    const-string v3, "LanguageYoutube"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v156_routine_language_streak

    const v3, 0x7f040019

    goto :goto_3

    :cond_v156_routine_language_streak
    const-string v3, "RoutineLanguage"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_routine_generic

    const v3, 0x7f040014

    goto :goto_3

    :cond_v148_routine_generic
    const-string v3, "Routine"

    invoke-virtual {p3, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_3

    const v3, 0x7f040002

    goto :goto_3

    :cond_3
    const-string v3, "PersonalWorkoutMeal"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v162_personal_meal

    const v3, 0x7f040013

    goto :goto_3

    :cond_v162_personal_meal
    const-string v3, "PersonalMeal"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_personal_today

    const v3, 0x7f040013

    goto :goto_3

    :cond_v148_personal_today
    const-string v3, "PersonalToday"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_workout_stats_inbody

    const v3, 0x7f040009

    goto :goto_3

    :cond_v148_workout_stats_inbody
    const-string v3, "PersonalWorkoutStatsInbody"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_workout_stats

    const v3, 0x7f040012

    goto :goto_3

    :cond_v148_workout_stats
    const-string v3, "PersonalWorkoutStats"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_workout_challenge_only

    const v3, 0x7f040011

    goto :goto_3

    :cond_v148_workout_challenge_only
    const-string v3, "PersonalWorkoutChallengeAll"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-nez v3, :cond_v162_workout_challenge_large

    const-string v3, "PersonalWorkoutChallengeCombined"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v162_workout_challenge_only_existing

    :cond_v162_workout_challenge_large
    const v3, 0x7f040017

    goto :goto_3

    :cond_v162_workout_challenge_only_existing
    const-string v3, "PersonalWorkoutChallengeOnly"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_workout_challenge

    const v3, 0x7f040018

    goto :goto_3

    :cond_v148_workout_challenge
    const-string v3, "PersonalWorkoutChallenge"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_v148_workout

    const v3, 0x7f040017

    goto :goto_3

    :cond_v148_workout
    const-string v3, "PersonalWorkout"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_4

    const v3, 0x7f040016

    goto :goto_3

    :cond_4
    const-string v3, "Personal"

    invoke-virtual {p3, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_5

    const v3, 0x7f040001

    goto :goto_3

    :cond_5
    const-string v3, "CalendarAgenda"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_6

    const v3, 0x7f04000c

    goto :goto_3

    :cond_6
    const-string v3, "CalendarCombined"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_7

    const v3, 0x7f04000d

    goto :goto_3

    :cond_7
    const-string v3, "CalendarSplit"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_8

    const v3, 0x7f04000e

    goto :goto_3

    :cond_8
    const-string v3, "CalendarMonth"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_9

    const v3, 0x7f04000f

    goto :goto_3

    :cond_9
    const-string v3, "CalendarFortnight"

    invoke-virtual {v3, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v3

    if-eqz v3, :cond_a

    const v3, 0x7f040010

    goto :goto_3

    :cond_a
    const/high16 v3, 0x7f040000

    .line 57
    :goto_3
    new-instance v5, Landroid/widget/RemoteViews;

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v6

    invoke-direct {v5, v6, v3}, Landroid/widget/RemoteViews;-><init>(Ljava/lang/String;I)V

    .line 58
    invoke-static {v5, v0}, Lcom/aiderlog/v22app/WidgetProvider;->applyTheme(Landroid/widget/RemoteViews;Ljava/lang/String;)V

    .line 67
    const-string v0, "schedule"

    if-nez v1, :cond_b

    .line 73
    const-string v1, "Task \uc704\uc82f"

    const-string v2, "aidway55@gmail.com \uc804\uc6a9"

    const-string v3, "AiderLog\uc5d0\uc11c \uc9c0\uc815 \uacc4\uc815\uc73c\ub85c \ub85c\uadf8\uc778\ud55c \ub4a4 \ub2e4\uc2dc \ucd94\uac00\ud574 \uc8fc\uc138\uc694."

    const-string v6, "\ub85c\uadf8\uc778 \uc5f4\uae30  \u203a"

    goto/16 :goto_8

    :cond_b
    const-string v1, "CalendarCombined"

    invoke-virtual {v1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v3, "\uc77c\uc815 \u2014"

    const/4 v6, 0x2

    const-string v7, "AiderLog Calendar"

    const-string v8, "month"

    if-eqz v1, :cond_c

    .line 74
    invoke-static {v2, v8, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 76
    new-instance v7, Ljava/lang/StringBuilder;

    invoke-static {}, Lcom/aiderlog/v22app/WidgetProvider;->monthGrid()Ljava/lang/String;

    move-result-object v8

    invoke-static {v8}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v8

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v8, "\n"

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    invoke-static {v2, v6, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v7, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    .line 78
    const-string v2, "\uc774\ub2ec \ub2ec\ub825 + \uc77c\uc815"

    const-string v6, "\uc6d4\uac04 \ub2ec\ub825 \uc5f4\uae30  \u203a"

    goto/16 :goto_8

    :cond_c
    const-string v1, "CalendarMonth"

    invoke-virtual {v1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_d

    invoke-static {v2, v8, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {}, Lcom/aiderlog/v22app/WidgetProvider;->monthGrid()Ljava/lang/String;

    move-result-object v3

    const-string v2, "\uc6d4\uac04 \uce98\ub9b0\ub354"

    const-string v6, "\uce98\ub9b0\ub354 \uc5f4\uae30  \u203a"

    goto/16 :goto_8

    :cond_d
    const-string v1, "CalendarSplit"

    invoke-virtual {v1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const/4 v9, 0x4

    if-eqz v1, :cond_e

    .line 79
    invoke-static {v2, v8, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {}, Lcom/aiderlog/v22app/WidgetProvider;->monthGrid()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v7

    const-string v6, "\uc77c\uc815 \u2014"

    invoke-static {v7, v9, v6}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 83
    const-string v6, "\uc77c\uc815 \uc5f4\uae30  \u203a"

    goto/16 :goto_8

    :cond_e
    const-string v1, "CalendarFortnight"

    invoke-virtual {v1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_f

    invoke-static {v2, v8, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-static {}, Lcom/aiderlog/v22app/WidgetProvider;->twoWeekGrid()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v7

    const/4 v9, 0x3

    const-string v6, "\uc77c\uc815 \u2014"

    invoke-static {v7, v9, v6}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v2

    const-string v6, "\uc77c\uc815 \ucd94\uac00  \uff0b"

    goto/16 :goto_8

    :cond_f
    const-string v1, "CalendarAgenda"

    invoke-virtual {v1, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    const-string v3, "today"

    if-eqz v1, :cond_10

    .line 85
    const-string v1, "TODAY"

    invoke-static {v2, v3, v1}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 86
    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    const-string v3, "\uc77c\uc815\uc744 \ucd94\uac00\ud574 \ubcf4\uc138\uc694."

    invoke-static {v2, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 88
    const-string v2, "\ub2e4\uac00\uc62c \uc77c\uc815"

    const-string v6, "\uc77c\uc815 \ucd94\uac00  \uff0b"

    move-object v10, v2

    move-object v2, v1

    move-object v1, v10

    goto/16 :goto_8

    :cond_10
    const-string v0, "RoutineCards"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v1, "\uc624\ub298\uc758 \ub8e8\ud2f4"

    const-string v7, "private"

    const-string v8, "routines"

    if-eqz v0, :cond_11

    .line 89
    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetProvider;->first(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    .line 91
    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const-string v2, "\uc0c8 \ub8e8\ud2f4\uc744 \ub9cc\ub4e4\uc5b4 \ubcf4\uc138\uc694."

    invoke-static {p0, p2, v0, v6, v2}, Lcom/aiderlog/v22app/WidgetProvider;->configuredLines(Landroid/content/Context;ILorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 93
    const-string v2, "\ub8e8\ud2f4 \uce74\ub4dc"

    const-string v6, "\uc644\ub8cc \uccb4\ud06c  \u2713"

    :goto_4
    move-object v0, v7

    goto/16 :goto_8

    :cond_11
    const-string v0, "RoutineAll"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v6, "\ub8e8\ud2f4\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."

    const/4 v9, 0x7

    if-eqz v0, :cond_12

    .line 96
    invoke-virtual {v2, v8}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-static {p0, p2, v0, v9, v6}, Lcom/aiderlog/v22app/WidgetProvider;->configuredLines(Landroid/content/Context;ILorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 98
    const-string v2, "\uc804\uccb4 \ubaa9\ub85d"

    const-string v6, "\ub8e8\ud2f4 \uc5f4\uae30  \u203a"

    goto :goto_4

    :cond_12
    const-string v0, "LanguageYoutube"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v156_language_streak

    const-string v0, "youtubeNotes"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v1, 0x3

    const-string v3, "저장한 문장이 없습니다.\n앱에서 YouTube 링크를 열고 문장을 저장하세요."

    invoke-static {v0, v1, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "YouTube 문장 복습"

    const-string v2, "YOUTUBE SENTENCE ORBIT"

    const-string v6, "문장 학습  ›"

    const-string v0, "language"

    const-string v4, "open-youtube"

    goto/16 :goto_8

    :cond_v156_language_streak
    const-string v0, "RoutineLanguage"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const/4 v1, 0x5

    if-eqz v0, :cond_13

    .line 100
    const-string v0, "language"

    const-string v3, "\uc5b4\ud559 \uc9c4\ub3c4\ub97c \ub3d9\uae30\ud654\ud558\uc138\uc694."

    invoke-static {v2, v0, v3}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    move-object v3, v0

    .line 103
    const-string v1, "\uc5f0\uc18d \ud559\uc2b5"

    const-string v2, "LANGUAGE CONSTELLATION"

    const-string v6, "\ud559\uc2b5 \uc2dc\uc791  \u203a"

    goto :goto_4

    :cond_13
    const-string v0, "RoutineLanguageAll"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_routine_stats_content

    const-string v0, "languageRows"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v9, 0x5

    const-string v3, "영어와 일본어 학습 기록을 확인해 주세요."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "최근 7일 어학"

    const-string v2, "ENGLISH · JAPANESE"

    const-string v6, "학습 열기  ›"

    goto/16 :goto_4

    :cond_v162_routine_stats_content
    const-string v0, "RoutineStats"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_meal_content

    const-string v0, "routineStats"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v9, 0x7

    const-string v3, "저장된 루틴이 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "오늘의 루틴 현황"

    const-string v2, "완료 기록"

    const-string v6, "루틴 열기  ›"

    goto/16 :goto_4

    :cond_v162_workout_meal_content
    const-string v0, "PersonalWorkoutMeal"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_personal_meal_content

    invoke-static {v5, v2}, Lcom/aiderlog/v22app/WidgetProvider;->applyMealPhotos(Landroid/widget/RemoteViews;Lorg/json/JSONObject;)V

    const-string v0, "mealWorkouts"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v9, 0x6

    const-string v3, "오늘의 식사와 운동 기록이 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "오늘의 식사와 운동"

    const-string v2, "DAYLOG"

    const-string v6, "건강 기록 열기  ›"

    const-string v8, "personal"

    goto/16 :goto_6

    :cond_v162_personal_meal_content
    const-string v0, "PersonalMeal"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v6, "meals"

    const-string v7, "DAYLOG"

    const-string v8, "personal"

    if-eqz v0, :cond_14

    .line 105
    invoke-static {v5, v2}, Lcom/aiderlog/v22app/WidgetProvider;->applyMealPhotos(Landroid/widget/RemoteViews;Lorg/json/JSONObject;)V

    invoke-static {v2, v3, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 106
    invoke-virtual {v2, v6}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    const-string v3, "\uc2dd\uc0ac \uae30\ub85d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."

    invoke-static {p0, p2, v2, v1, v3}, Lcom/aiderlog/v22app/WidgetProvider;->configuredLines(Landroid/content/Context;ILorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 108
    const-string v1, "\uc624\ub298\uc758 \uc2dd\uc0ac"

    const-string v6, "\uc2dd\uc0ac \ucd94\uac00  \uff0b"

    :goto_5
    move-object v2, v0

    :goto_6
    move-object v0, v8

    goto/16 :goto_8

    :cond_14
    const-string v0, "PersonalWorkout"

    invoke-virtual {p3, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_15

    .line 110
    invoke-static {v2, v3, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 111
    const-string v3, "workouts"

    const-string v0, "StatsInbody"

    invoke-virtual {p3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_stats_key

    const-string v3, "workoutStatsInbody"

    goto :goto_v162_workout_key

    :cond_v162_workout_stats_key
    const-string v0, "Stats"

    invoke-virtual {p3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_combined_key

    const-string v3, "workoutStats"

    goto :goto_v162_workout_key

    :cond_v162_workout_combined_key
    const-string v0, "ChallengeCombined"

    invoke-virtual {p3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_all_key

    const-string v3, "challengeCombined"

    goto :goto_v162_workout_key

    :cond_v162_workout_all_key
    const-string v0, "ChallengeAll"

    invoke-virtual {p3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_only_key

    const-string v3, "challengeAll"

    goto :goto_v162_workout_key

    :cond_v162_workout_only_key
    const-string v0, "ChallengeOnly"

    invoke-virtual {p3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_challenge_key

    const-string v3, "challengeSelected"

    goto :goto_v162_workout_key

    :cond_v162_workout_challenge_key
    const-string v0, "Challenge"

    invoke-virtual {p3, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :goto_v162_workout_key

    const-string v3, "workoutChallenges"

    :goto_v162_workout_key

    invoke-virtual {v2, v3}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v2

    const-string v3, "\uc6b4\ub3d9 \uae30\ub85d\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."

    invoke-static {p0, p2, v2, v1, v3}, Lcom/aiderlog/v22app/WidgetProvider;->configuredLines(Landroid/content/Context;ILorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 113
    invoke-static {p3}, Lcom/aiderlog/v22app/WidgetProvider;->workoutTitle(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v6, "\uc6b4\ub3d9 \uc5f4\uae30  \u203a"

    goto :goto_5

    :cond_15
    const-string v0, "PersonalToday"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_16

    .line 115
    invoke-static {v2, v3, v7}, Lcom/aiderlog/v22app/WidgetProvider;->value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "bullet3"

    invoke-virtual {v2, v1}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v1

    const/4 v3, 0x6

    const-string v6, "최근 3일 기록이 없습니다."

    invoke-static {p0, p2, v1, v3, v6}, Lcom/aiderlog/v22app/WidgetProvider;->configuredLines(Landroid/content/Context;ILorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "3일 불렛저널"

    const-string v6, "\uc800\ub110 \uc5f4\uae30  \u203a"

    goto :goto_5

    :cond_16
    const-string v0, "PersonalQuote"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_17

    .line 123
    const-string v0, "readingCurrent"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v9, 0x5

    const-string v1, "저장된 독서 기록이 없습니다."

    invoke-static {v0, v9, v1}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 125
    const-string v1, "읽는 책과 문장"

    const-string v2, "READING"

    const-string v6, "\ubb38\uc7a5 \ucd94\uac00  \uff0b"

    goto :goto_6

    :cond_17
    const-string v0, "PersonalWorkflowOne"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_18

    .line 128
    const-string v0, "memos"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const-string v1, "저장된 메모가 없습니다."

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetProvider;->first(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 130
    const-string v1, "최근 메모"

    const-string v2, "MEMO"

    const-string v6, "메모 열기  ›"

    goto/16 :goto_6

    :cond_18
    const-string v0, "PersonalWorkflowAll"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_19

    .line 133
    const-string v0, "memoTodos"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const-string v1, "저장된 메모와 할 일이 없습니다."

    invoke-static {v0, v9, v1}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 135
    const-string v1, "메모와 할 일"

    const-string v2, "MEMO · TODO"

    const-string v6, "메모 열기  ›"

    goto/16 :goto_6

    :cond_19
    const-string v8, "personal"

    const-string v0, "PersonalTodo"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_personal_reading_content

    const-string v0, "todos"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v9, 0x7

    const-string v3, "등록된 할 일이 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "할 일"

    const-string v2, "TODO"

    const-string v6, "할 일 열기  ›"

    goto/16 :goto_6

    :cond_v162_personal_reading_content
    const-string v0, "PersonalReading"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_bullet_seven_content

    const-string v0, "readingBooks"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/4 v9, 0x7

    const-string v3, "서재에 저장된 책이 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "내 서재"

    const-string v2, "READING"

    const-string v6, "독서 기록 열기  ›"

    goto/16 :goto_6

    :cond_v162_bullet_seven_content
    const-string v0, "PersonalBulletSeven"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_bullet_three_workflow_content

    const-string v0, "bullet7"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/16 v9, 0x9

    const-string v3, "최근 7일 기록이 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "7일 불렛저널"

    const-string v2, "최근 기록"

    const-string v6, "저널 열기  ›"

    goto/16 :goto_6

    :cond_v162_bullet_three_workflow_content
    const-string v0, "PersonalBulletThreeWorkflow"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_bullet_seven_workflow_content

    const-string v0, "bullet3Workflow"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/16 v9, 0x9

    const-string v3, "최근 기록과 워크플로우가 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "3일 기록과 워크플로우"

    const-string v2, "BULLET JOURNAL"

    const-string v6, "저널 열기  ›"

    goto/16 :goto_6

    :cond_v162_bullet_seven_workflow_content
    const-string v0, "PersonalBulletSevenWorkflow"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_v162_task_week_content

    const-string v0, "bullet7Workflow"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/16 v9, 0xa

    const-string v3, "최근 기록과 워크플로우가 없습니다."

    invoke-static {v0, v9, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    const-string v1, "7일 기록과 워크플로우"

    const-string v2, "BULLET JOURNAL"

    const-string v6, "저널 열기  ›"

    goto/16 :goto_6

    :cond_v162_task_week_content
    const-string v0, "TaskWeek"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v1, "task"

    if-eqz v0, :cond_1a

    .line 138
    const-string v0, "taskWeek"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const-string v2, "\uc608\uc815\ub41c \uc0c1\ub2f4\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."

    invoke-static {v0, v9, v2}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 140
    const-string v0, "CONSULTING SCHEDULE"

    const-string v2, "\uc55e\uc73c\ub85c 1\uc8fc"

    const-string v6, "Task \uc5f4\uae30  \u203a"

    :goto_7
    move-object v10, v1

    move-object v1, v0

    move-object v0, v10

    goto :goto_8

    :cond_1a
    const-string v0, "TaskTwoWeeks"

    invoke-virtual {v0, p3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1b

    .line 143
    const-string v0, "taskTwoWeeks"

    invoke-virtual {v2, v0}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    const/16 v2, 0xa

    const-string v3, "\uc608\uc815\ub41c \uc0c1\ub2f4\uc774 \uc5c6\uc2b5\ub2c8\ub2e4."

    invoke-static {v0, v2, v3}, Lcom/aiderlog/v22app/WidgetProvider;->lines(Lorg/json/JSONArray;ILjava/lang/String;)Ljava/lang/String;

    move-result-object v3

    .line 145
    const-string v0, "CONSULTING SCHEDULE"

    const-string v2, "\uc55e\uc73c\ub85c 2\uc8fc"

    const-string v6, "Task \uc5f4\uae30  \u203a"

    goto :goto_7

    .line 149
    :cond_1b
    const-string v0, "\uace0\uac1d \ub9c1\ud06c"

    const-string v2, "AIDWAY CLIENT INTAKE"

    const-string v3, "\uc704\uc82f\uc744 \ub204\ub974\uba74 \ucd5c\uc2e0 \uace0\uac1d \uc785\ub825 \ub9c1\ud06c\ub97c \uc790\ub3d9\uc73c\ub85c \ubcf5\uc0ac\ud569\ub2c8\ub2e4."

    const-string v6, "\ub9c1\ud06c \ubcf5\uc0ac  \u29c9"

    const-string v4, "copy-client-link"

    goto :goto_7

    :goto_8
    const-string v6, "\u2699"

    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetProvider;->configuredContent(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v10

    const-string v7, "\uc804\uccb4 \ub0b4\uc6a9"

    invoke-virtual {v7, v10}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_1c

    move-object v2, v10

    :cond_1c
    const v7, 0x7f030004

    .line 152
    invoke-virtual {v5, v7, v1}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const v1, 0x7f030003

    .line 153
    invoke-virtual {v5, v1, v2}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const v1, 0x7f030001

    .line 154
    invoke-virtual {v5, v1, v3}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const/high16 v1, 0x7f030000

    .line 155
    invoke-virtual {v5, v1, v6}, Landroid/widget/RemoteViews;->setTextViewText(ILjava/lang/CharSequence;)V

    const/16 v6, 0x8

    invoke-virtual {v5, v1, v6}, Landroid/widget/RemoteViews;->setViewVisibility(II)V

    .line 156
    invoke-static {v5, p3}, Lcom/aiderlog/v22app/WidgetProvider;->applyTypeScale(Landroid/widget/RemoteViews;Ljava/lang/String;)V

    invoke-static {v5, p0, p2}, Lcom/aiderlog/v22app/WidgetProvider;->applyUserAppearance(Landroid/widget/RemoteViews;Landroid/content/Context;I)V

    # The visible "꾸미기" chip reopens this widget's configuration after installation.
    new-instance v7, Landroid/content/Intent;

    const-class v8, Lcom/aiderlog/v22app/WidgetConfigActivity;

    invoke-direct {v7, p0, v8}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    const-string v8, "appWidgetId"

    invoke-virtual {v7, v8, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    new-instance v8, Ljava/lang/StringBuilder;

    const-string v9, "aiderlog.widget.configure."

    invoke-direct {v8, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v8, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v8}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v8

    invoke-virtual {v7, v8}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    const/high16 v8, 0x14000000

    invoke-virtual {v7, v8}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    const v8, 0x2a300

    add-int/2addr v8, p2

    const/high16 v9, 0xc000000

    invoke-static {p0, v8, v7, v9}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object v7

    const/high16 v8, 0x7f030000

    invoke-virtual {v5, v8, v7}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 158
    new-instance v2, Landroid/content/Intent;

    const-class v3, Lcom/aiderlog/v22app/MainActivity;

    invoke-direct {v2, p0, v3}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V

    .line 159
    new-instance v3, Ljava/lang/StringBuilder;

    const-string v6, "aiderlog.widget."

    invoke-direct {v3, v6}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v3, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v6, "."

    invoke-virtual {v3, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    .line 160
    const-string v3, "target"

    invoke-virtual {v2, v3, v0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    .line 161
    const-string v0, "action"

    invoke-virtual {v2, v0, v4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    const/high16 v0, 0x14000000

    .line 162
    invoke-virtual {v2, v0}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    mul-int/lit8 v0, p2, 0x1f

    .line 163
    invoke-virtual {p3}, Ljava/lang/String;->hashCode()I

    move-result p3

    add-int/2addr v0, p3

    const/high16 p3, 0xc000000

    invoke-static {p0, v0, v2, p3}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object p0

    const p3, 0x7f030002

    .line 164
    invoke-virtual {v5, p3, p0}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    .line 165
    invoke-virtual {v5, v1, p0}, Landroid/widget/RemoteViews;->setOnClickPendingIntent(ILandroid/app/PendingIntent;)V

    # Root/body open the matching AiderLog page. Only the visible settings action
    # and the launcher's long-press Settings command open WidgetConfigActivity.

    .line 166
    invoke-virtual {p1, p2, v5}, Landroid/appwidget/AppWidgetManager;->updateAppWidget(ILandroid/widget/RemoteViews;)V

    return-void
.end method

.method private static value(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 170
    const-string v0, ""

    invoke-virtual {p0, p1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    .line 171
    invoke-virtual {p0}, Ljava/lang/String;->isEmpty()Z

    move-result p1

    if-eqz p1, :cond_0

    goto :goto_0

    :cond_0
    move-object p2, p0

    :goto_0
    return-object p2
.end method

.method private static workoutBody(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    return-object p1
.end method

.method private static workoutTitle(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    const-string v0, "StatsInbody"

    invoke-virtual {p0, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_0

    const-string v0, "\uc6b4\ub3d9 \ud1b5\uacc4 \u00b7 InBody"

    return-object v0

    :cond_0
    const-string v0, "Stats"

    invoke-virtual {p0, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string v0, "\uc6b4\ub3d9 \ud1b5\uacc4"

    return-object v0

    :cond_1
    const-string v0, "ChallengeCombined"

    invoke-virtual {p0, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_title_all

    const-string v0, "선택 및 전체 챌린지"

    return-object v0

    :cond_v162_workout_title_all
    const-string v0, "ChallengeAll"

    invoke-virtual {p0, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_v162_workout_title_only

    const-string v0, "전체 챌린지"

    return-object v0

    :cond_v162_workout_title_only
    const-string v0, "ChallengeOnly"

    invoke-virtual {p0, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_2

    const-string v0, "7\uc77c \ucf54\uc5b4 \ucc4c\ub9b0\uc9c0"

    return-object v0

    :cond_2
    const-string v0, "Challenge"

    invoke-virtual {p0, v0}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v0

    if-eqz v0, :cond_3

    const-string v0, "\uc624\ub298\uc758 \uc6b4\ub3d9 \u00b7 \ucc4c\ub9b0\uc9c0"

    return-object v0

    :cond_3
    const-string v0, "\uc624\ub298\uc758 \uc6b4\ub3d9 \uae30\ub85d"

    return-object v0
.end method


# virtual methods
.method public onAppWidgetOptionsChanged(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILandroid/os/Bundle;)V
    .locals 1
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;
    move-result-object v0
    invoke-virtual {v0}, Ljava/lang/Class;->getName()Ljava/lang/String;
    move-result-object v0
    invoke-static {p1, p2, p3, v0}, Lcom/aiderlog/v22app/WidgetProvider;->safeUpdateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V
    return-void
.end method

.method public onUpdate(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;[I)V
    .locals 4

    .line 28
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/Class;->getName()Ljava/lang/String;

    move-result-object v0

    .line 29
    array-length v1, p3

    const/4 v2, 0x0

    :goto_0
    if-lt v2, v1, :cond_0

    return-void

    :cond_0
    aget v3, p3, v2

    invoke-static {p1, p2, v3, v0}, Lcom/aiderlog/v22app/WidgetProvider;->safeUpdateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V

    add-int/lit8 v2, v2, 0x1

    goto :goto_0
.end method
