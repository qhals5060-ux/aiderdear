.class public final Lcom/aiderlog/v22app/WidgetThemeV190;
.super Ljava/lang/Object;
.source "WidgetThemeV190.java"


# static fields
.field static final COLORS:[[I

.field static final KEYS:[Ljava/lang/String;

.field static final LABELS:[Ljava/lang/String;


# direct methods
.method static constructor <clinit>()V
    .locals 5

    .line 19
    const-string v0, "system"

    const-string v1, "sage"

    const-string v2, "rose"

    const-string v3, "slate"

    const-string v4, "charcoal"

    filled-new-array {v0, v1, v2, v3, v4}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->KEYS:[Ljava/lang/String;

    .line 20
    const-string v0, "Lavender"

    const-string v1, "Sage"

    const-string v2, "Rose"

    const-string v3, "Slate"

    const-string v4, "Charcoal"

    filled-new-array {v0, v1, v2, v3, v4}, [Ljava/lang/String;

    move-result-object v0

    sput-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->LABELS:[Ljava/lang/String;

    .line 22
    const/4 v0, 0x5

    new-array v0, v0, [[I

    .line 23
    const/4 v1, 0x6

    new-array v2, v1, [I

    fill-array-data v2, :array_0

    const/4 v3, 0x0

    aput-object v2, v0, v3

    .line 24
    new-array v2, v1, [I

    fill-array-data v2, :array_1

    const/4 v3, 0x1

    aput-object v2, v0, v3

    .line 25
    new-array v2, v1, [I

    fill-array-data v2, :array_2

    const/4 v3, 0x2

    aput-object v2, v0, v3

    .line 26
    new-array v2, v1, [I

    fill-array-data v2, :array_3

    const/4 v3, 0x3

    aput-object v2, v0, v3

    .line 27
    new-array v1, v1, [I

    fill-array-data v1, :array_4

    const/4 v2, 0x4

    aput-object v1, v0, v2

    .line 22
    sput-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->COLORS:[[I

    .line 28
    return-void

    nop

    :array_0
    .array-data 4
        -0x89ab71
        -0x50804
        -0x121a0c
        -0x1e2a15
        -0xcad3c0
        -0x8d9b82
    .end array-data

    :array_1
    .array-data 4
        -0xb790a4
        -0xa050a
        -0x1d111b
        -0x33202e
        -0xd2bdca
        -0x9f8a98
    .end array-data

    :array_2
    .array-data 4
        -0x6caa91
        -0x806
        -0xc1f18
        -0x163428
        -0xb3d2c4
        -0x7a9e8d
    .end array-data

    :array_3
    .array-data 4
        -0xbd926c
        -0x90501
        -0x1d1209
        -0x352214
        -0xd3bfab
        -0x9f8a75
    .end array-data

    :array_4
    .array-data 4
        -0xa89e96
        -0x50506
        -0x161312
        -0x2d2724
        -0xcfc7c0
        -0x9a8f86
    .end array-data
.end method

.method public constructor <init>()V
    .locals 0

    .line 18
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static accent(Ljava/lang/String;)I
    .locals 1

    .line 40
    const/4 v0, 0x0

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result p0

    return p0
.end method

.method static background(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 0

    .line 48
    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result p2

    invoke-static {p3, p4}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p3

    invoke-static {p0, p3}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result p0

    const-string p3, "setBackgroundResource"

    invoke-virtual {p1, p2, p3, p0}, Landroid/widget/RemoteViews;->setInt(ILjava/lang/String;I)V

    return-void
.end method

.method public static choose(Landroid/app/Activity;I)V
    .locals 1

    .line 56
    :try_start_0
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->selected(Landroid/app/Activity;)Ljava/lang/reflect/Field;

    move-result-object v0

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetThemeV190;->key(I)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {v0, p0, p1}, Ljava/lang/reflect/Field;->set(Ljava/lang/Object;Ljava/lang/Object;)V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p0

    :goto_0
    return-void
.end method

.method static color(Ljava/lang/String;I)I
    .locals 1

    .line 39
    sget-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->COLORS:[[I

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->index(Ljava/lang/String;)I

    move-result p0

    aget-object p0, v0, p0

    aget p0, p0, p1

    return p0
.end method

.method static index(Ljava/lang/String;)I
    .locals 4

    .line 36
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->normalize(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    const/4 v0, 0x0

    move v1, v0

    :goto_0
    sget-object v2, Lcom/aiderlog/v22app/WidgetThemeV190;->KEYS:[Ljava/lang/String;

    array-length v3, v2

    if-lt v1, v3, :cond_0

    return v0

    :cond_0
    aget-object v2, v2, v1

    invoke-virtual {v2, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_1

    return v1

    :cond_1
    add-int/lit8 v1, v1, 0x1

    goto :goto_0
.end method

.method static key(I)Ljava/lang/String;
    .locals 2

    .line 37
    sget-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->KEYS:[Ljava/lang/String;

    array-length v1, v0

    add-int/lit8 v1, v1, -0x1

    invoke-static {v1, p0}, Ljava/lang/Math;->min(II)I

    move-result p0

    const/4 v1, 0x0

    invoke-static {v1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    aget-object p0, v0, p0

    return-object p0
.end method

.method static label(Ljava/lang/String;)Ljava/lang/String;
    .locals 1

    .line 38
    sget-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->LABELS:[Ljava/lang/String;

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->index(Ljava/lang/String;)I

    move-result p0

    aget-object p0, v0, p0

    return-object p0
.end method

.method static muted(Ljava/lang/String;)I
    .locals 1

    .line 41
    const/4 v0, 0x5

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result p0

    return p0
.end method

.method static normalize(Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 30
    const-string v0, "sage"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_7

    const-string v1, "mint"

    invoke-virtual {v1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    goto :goto_3

    .line 31
    :cond_0
    const-string v0, "rose"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_6

    const-string v1, "sunset"

    invoke-virtual {v1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_1

    goto :goto_2

    .line 32
    :cond_1
    const-string v0, "slate"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_5

    const-string v1, "ocean"

    invoke-virtual {v1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    goto :goto_1

    .line 33
    :cond_2
    const-string v0, "charcoal"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "mono"

    invoke-virtual {v1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_4

    const-string v1, "midnight"

    invoke-virtual {v1, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_3

    goto :goto_0

    .line 34
    :cond_3
    const-string p0, "system"

    return-object p0

    .line 33
    :cond_4
    :goto_0
    return-object v0

    .line 32
    :cond_5
    :goto_1
    return-object v0

    .line 31
    :cond_6
    :goto_2
    return-object v0

    .line 30
    :cond_7
    :goto_3
    return-object v0
.end method

.method public static refresh(Landroid/app/Activity;)V
    .locals 4

    .line 64
    :try_start_0
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->selected(Landroid/app/Activity;)Ljava/lang/reflect/Field;

    move-result-object v0

    invoke-virtual {v0, p0}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Ljava/lang/String;

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->normalize(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, p0, v1}, Ljava/lang/reflect/Field;->set(Ljava/lang/Object;Ljava/lang/Object;)V

    .line 65
    const-string v0, "widget_config_theme"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {p0, v0}, Landroid/app/Activity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    check-cast v0, Landroid/widget/TextView;

    .line 66
    if-eqz v0, :cond_0

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "\uc0c9\uc0c1 \ud14c\ub9c8   "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->label(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "   \u203a"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->accent(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setTextColor(I)V

    .line 67
    :cond_0
    const-string v0, "widget_config_save"

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->id(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    invoke-virtual {p0, v0}, Landroid/app/Activity;->findViewById(I)Landroid/view/View;

    move-result-object v0

    if-eqz v0, :cond_1

    const-string v2, "button"

    invoke-static {v1, v2}, Lcom/aiderlog/v22app/WidgetThemeV190;->resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {p0, v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->drawable(Landroid/content/Context;Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Landroid/view/View;->setBackgroundResource(I)V

    .line 68
    :cond_1
    const v0, 0x1020002

    invoke-virtual {p0, v0}, Landroid/app/Activity;->findViewById(I)Landroid/view/View;

    move-result-object p0

    check-cast p0, Landroid/view/ViewGroup;

    if-eqz p0, :cond_2

    invoke-virtual {p0}, Landroid/view/ViewGroup;->getChildCount()I

    move-result v0

    if-lez v0, :cond_2

    const/4 v0, 0x0

    invoke-virtual {p0, v0}, Landroid/view/ViewGroup;->getChildAt(I)Landroid/view/View;

    move-result-object p0

    const/4 v0, 0x1

    invoke-static {v1, v0}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result v0

    invoke-virtual {p0, v0}, Landroid/view/View;->setBackgroundColor(I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    .line 69
    :catch_0
    move-exception p0

    :goto_0
    nop

    :cond_2
    return-void
.end method

.method static resource(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 43
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget_theme_"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->normalize(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    invoke-virtual {v0, p0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    const-string v0, "_"

    invoke-virtual {p0, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    const-string p1, "_v190"

    invoke-virtual {p0, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p0

    invoke-virtual {p0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static rowStyle(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Lorg/json/JSONObject;Ljava/lang/String;)V
    .locals 6

    .line 50
    const-string v0, "quote"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v1, "control"

    if-nez v0, :cond_0

    const-string v0, "workout"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "note"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    :cond_0
    const-string v0, "w188_row"

    invoke-static {p0, p1, v0, p4, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->background(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 51
    :cond_1
    const-string v0, "book"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_2

    const-string v0, "meal"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_3

    :cond_2
    const-string v0, "w188_photo"

    invoke-static {p0, p1, v0, p4, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->background(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 52
    :cond_3
    const-string v0, "todo"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    const-string v1, "outline"

    if-nez v0, :cond_4

    const-string v0, "routineMini"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_5

    :cond_4
    const-string v0, "w188_check"

    invoke-static {p0, p1, v0, p4, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->background(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    .line 53
    :cond_5
    const-string v0, "routine"

    invoke-virtual {p2, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p2

    if-eqz p2, :cond_8

    const/4 p2, 0x0

    :goto_0
    const/4 v0, 0x4

    if-lt p2, v0, :cond_6

    goto :goto_2

    :cond_6
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v2, "w188_level_"

    invoke-direct {v0, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v2, "MINI"

    const-string v3, "MORE"

    const-string v4, "MAX"

    const-string v5, "SKIP"

    filled-new-array {v2, v3, v4, v5}, [Ljava/lang/String;

    move-result-object v2

    aget-object v2, v2, p2

    const-string v3, "level"

    invoke-virtual {p3, v3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_7

    const-string v2, "selected"

    goto :goto_1

    :cond_7
    move-object v2, v1

    :goto_1
    invoke-static {p0, p1, v0, p4, v2}, Lcom/aiderlog/v22app/WidgetThemeV190;->background(Landroid/content/Context;Landroid/widget/RemoteViews;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    add-int/lit8 p2, p2, 0x1

    goto :goto_0

    .line 54
    :cond_8
    :goto_2
    return-void
.end method

.method static rowView(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Landroid/widget/RemoteViews;
    .locals 2

    .line 45
    new-instance v0, Ljava/lang/StringBuilder;

    invoke-static {p1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v1

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v1, "_"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetThemeV190;->normalize(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p2

    invoke-virtual {v0, p2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    const-string v0, "_v190"

    invoke-virtual {p2, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    .line 46
    invoke-static {p0, p2}, Lcom/aiderlog/v22app/WidgetNativeV164;->layout(Landroid/content/Context;Ljava/lang/String;)I

    move-result v0

    if-eqz v0, :cond_0

    move-object p1, p2

    :cond_0
    invoke-static {p0, p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->view(Landroid/content/Context;Ljava/lang/String;)Landroid/widget/RemoteViews;

    move-result-object p0

    return-object p0
.end method

.method static selected(Landroid/app/Activity;)Ljava/lang/reflect/Field;
    .locals 1
    .annotation system Ldalvik/annotation/Throws;
        value = {
            Ljava/lang/Exception;
        }
    .end annotation

    .line 55
    invoke-virtual {p0}, Ljava/lang/Object;->getClass()Ljava/lang/Class;

    move-result-object p0

    const-string v0, "selectedTheme"

    invoke-virtual {p0, v0}, Ljava/lang/Class;->getDeclaredField(Ljava/lang/String;)Ljava/lang/reflect/Field;

    move-result-object p0

    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Ljava/lang/reflect/Field;->setAccessible(Z)V

    return-object p0
.end method

.method public static showDialog(Landroid/app/Activity;)V
    .locals 8

    .line 58
    :try_start_0
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetThemeV190;->selected(Landroid/app/Activity;)Ljava/lang/reflect/Field;

    move-result-object v0

    invoke-virtual {v0, p0}, Ljava/lang/reflect/Field;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetThemeV190;->index(Ljava/lang/String;)I

    move-result v0

    .line 59
    sget-object v1, Lcom/aiderlog/v22app/WidgetThemeV190;->LABELS:[Ljava/lang/String;

    array-length v1, v1

    new-array v2, v1, [Ljava/lang/CharSequence;

    const/4 v3, 0x0

    move v4, v3

    :goto_0
    if-lt v4, v1, :cond_0

    .line 60
    new-instance v1, Landroid/app/AlertDialog$Builder;

    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v3, "\uc0c9\uc0c1 \ud14c\ub9c8"

    invoke-virtual {v1, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    new-instance v3, Lcom/aiderlog/v22app/WidgetThemeV190$1;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetThemeV190$1;-><init>(Landroid/app/Activity;)V

    invoke-virtual {v1, v2, v0, v3}, Landroid/app/AlertDialog$Builder;->setSingleChoiceItems([Ljava/lang/CharSequence;ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p0

    const-string v0, "\uc644\ub8cc"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p0

    invoke-virtual {p0}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    goto :goto_1

    .line 59
    :cond_0
    new-instance v5, Landroid/text/SpannableString;

    new-instance v6, Ljava/lang/StringBuilder;

    const-string v7, "\u25cf  "

    invoke-direct {v6, v7}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    sget-object v7, Lcom/aiderlog/v22app/WidgetThemeV190;->LABELS:[Ljava/lang/String;

    aget-object v7, v7, v4

    invoke-virtual {v6, v7}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v6

    invoke-virtual {v6}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v6

    invoke-direct {v5, v6}, Landroid/text/SpannableString;-><init>(Ljava/lang/CharSequence;)V

    new-instance v6, Landroid/text/style/ForegroundColorSpan;

    sget-object v7, Lcom/aiderlog/v22app/WidgetThemeV190;->KEYS:[Ljava/lang/String;

    aget-object v7, v7, v4

    invoke-static {v7}, Lcom/aiderlog/v22app/WidgetThemeV190;->accent(Ljava/lang/String;)I

    move-result v7

    invoke-direct {v6, v7}, Landroid/text/style/ForegroundColorSpan;-><init>(I)V

    const/4 v7, 0x1

    invoke-virtual {v5, v6, v3, v7, v3}, Landroid/text/SpannableString;->setSpan(Ljava/lang/Object;III)V

    aput-object v5, v2, v4
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    add-int/lit8 v4, v4, 0x1

    goto :goto_0

    .line 61
    :catch_0
    move-exception p0

    :goto_1
    return-void
.end method

.method static soft(I)I
    .locals 6

    .line 42
    sget-object v0, Lcom/aiderlog/v22app/WidgetThemeV190;->COLORS:[[I

    array-length v1, v0

    const/4 v2, 0x0

    move v3, v2

    :goto_0
    if-lt v3, v1, :cond_0

    const v0, 0xffffff

    and-int/2addr p0, v0

    const/high16 v0, 0x22000000

    or-int/2addr p0, v0

    return p0

    :cond_0
    aget-object v4, v0, v3

    aget v5, v4, v2

    if-ne v5, p0, :cond_1

    const/4 p0, 0x2

    aget p0, v4, p0

    return p0

    :cond_1
    add-int/lit8 v3, v3, 0x1

    goto :goto_0
.end method
