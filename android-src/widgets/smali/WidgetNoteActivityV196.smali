.class public final Lcom/aiderlog/v22app/WidgetNoteActivityV196;
.super Landroid/app/Activity;
.source "WidgetNoteActivityV196.java"

# interfaces
.implements Landroid/content/SharedPreferences$OnSharedPreferenceChangeListener;


# instance fields
.field private actions:Landroid/widget/LinearLayout;

.field private chosen:Ljava/lang/String;

.field private closed:Z

.field private confirmation:Landroid/app/AlertDialog;

.field private createdAt:J

.field private dateButton:Landroid/widget/Button;

.field private dated:Landroid/widget/CheckBox;

.field private draftDate:Ljava/lang/String;

.field private draftId:Ljava/lang/String;

.field private fields:Landroid/widget/LinearLayout;

.field private kind:Ljava/lang/String;

.field private picker:Landroid/app/DatePickerDialog;

.field private recoveringKey:Ljava/lang/String;

.field private recovery:Landroid/widget/Button;

.field private recoveryDialog:Landroid/app/AlertDialog;

.field private root:Landroid/widget/LinearLayout;

.field private save:Landroid/widget/Button;

.field private saving:Z

.field private status:Landroid/widget/TextView;

.field private type:Ljava/lang/String;

.field private uid:Ljava/lang/String;

.field private value:Landroid/widget/EditText;

.field private widget:I


# direct methods
.method public constructor <init>()V
    .locals 2

    .line 34
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    .line 35
    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    const-string v1, "CalendarMonth"

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->kind:Ljava/lang/String;

    const-string v1, "todo"

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    const-string v0, "system"

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    .line 34
    return-void
.end method

.method static addFill(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    .locals 2

    .line 40
    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    const-string v1, "uid"

    invoke-virtual {v0, v1, p0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    const-string v0, "noteType"

    invoke-virtual {p0, v0, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    const-string p1, "date"

    invoke-virtual {p0, p1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    return-object p0
.end method

.method static command(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;I)Lorg/json/JSONObject;
    .locals 3

    .line 41
    if-eqz p0, :cond_4

    invoke-virtual {p0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_4

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->supported(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_4

    if-eqz p2, :cond_4

    invoke-virtual {p2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_4

    invoke-virtual {p2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->length()I

    move-result v0

    const/16 v1, 0xb4

    if-gt v0, v1, :cond_4

    const-string v0, "todo"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_0

    if-eqz p3, :cond_0

    goto :goto_0

    :cond_0
    const-string p3, ""

    :goto_0
    invoke-virtual {p3}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_2

    invoke-static {p3}, Lcom/aiderlog/v22app/WidgetCalendarV195;->validDate(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string v0, "2000-01-01"

    invoke-virtual {p3, v0}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v0

    if-ltz v0, :cond_1

    const-string v0, "2199-12-31"

    invoke-virtual {p3, v0}, Ljava/lang/String;->compareTo(Ljava/lang/String;)I

    move-result v0

    if-gtz v0, :cond_1

    goto :goto_1

    :cond_1
    new-instance p0, Ljava/lang/IllegalArgumentException;

    const-string p1, "\uae30\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694."

    invoke-direct {p0, p1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    throw p0

    :cond_2
    :goto_1
    new-instance v0, Lorg/json/JSONObject;

    invoke-direct {v0}, Lorg/json/JSONObject;-><init>()V

    const/16 v1, 0xc4

    invoke-static {v1}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v1

    const-string v2, "schema"

    invoke-static {v0, v2, v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v1, "uid"

    invoke-static {v0, v1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string p0, "memo"

    invoke-virtual {p0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-eqz p0, :cond_3

    const-string p0, "add-memo"

    goto :goto_2

    :cond_3
    const-string p0, "add-todo"

    :goto_2
    const-string p1, "op"

    invoke-static {v0, p1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string p0, "id"

    invoke-static {v0, p0, p4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string p0, "key"

    invoke-static {v0, p0, p4}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-virtual {p2}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p0

    const-string p1, "value"

    invoke-static {v0, p1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string p0, "date"

    invoke-static {v0, p0, p3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string p0, "kind"

    invoke-static {v0, p0, p7}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {p8}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p0

    const-string p1, "widgetId"

    invoke-static {v0, p1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {p5, p6}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object p0

    const-string p1, "createdAt"

    invoke-static {v0, p1, p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    return-object v0

    :cond_4
    new-instance p0, Ljava/lang/IllegalArgumentException;

    const-string p1, "\ub0b4\uc6a9\uc744 1~180\uc790\ub85c \uc785\ub825\ud574\uc8fc\uc138\uc694."

    invoke-direct {p0, p1}, Ljava/lang/IllegalArgumentException;-><init>(Ljava/lang/String;)V

    throw p0
.end method

.method static intent(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    .locals 4

    .line 37
    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    new-instance v1, Ljava/lang/StringBuilder;

    invoke-virtual {p0}, Landroid/content/Context;->getPackageName()Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, ".WidgetNoteActivityV196"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, p0, v1}, Landroid/content/Intent;->setClassName(Landroid/content/Context;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "aiderlog.widget.note."

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "."

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, p4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {p0, v0}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "aiderlog-widget-note://"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v0, p1}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v1, "/"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    const-string v2, ""

    if-nez p3, :cond_0

    move-object v3, v2

    goto :goto_0

    :cond_0
    move-object v3, p3

    :goto_0
    invoke-static {v3}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-static {p4}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v0, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    if-nez p5, :cond_1

    goto :goto_1

    :cond_1
    move-object v2, p5

    :goto_1
    invoke-static {v2}, Landroid/net/Uri;->encode(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-static {v0}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object v0

    invoke-virtual {p0, v0}, Landroid/content/Intent;->setData(Landroid/net/Uri;)Landroid/content/Intent;

    const-string v0, "appWidgetId"

    invoke-virtual {p0, v0, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    move-result-object p0

    const-string p1, "kind"

    invoke-virtual {p0, p1, p2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    const-string p1, "uid"

    invoke-virtual {p0, p1, p3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    const-string p1, "noteType"

    invoke-virtual {p0, p1, p4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    const-string p1, "date"

    invoke-virtual {p0, p1, p5}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p0

    const/high16 p1, 0x14000000

    invoke-virtual {p0, p1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    move-result-object p0

    return-object p0
.end method

.method static open(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/app/PendingIntent;
    .locals 0

    .line 38
    invoke-static/range {p0 .. p5}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->intent(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p1

    invoke-virtual {p1}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object p2

    invoke-virtual {p2}, Landroid/net/Uri;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/String;->hashCode()I

    move-result p2

    const/high16 p3, 0xc000000

    invoke-static {p0, p2, p1, p3}, Landroid/app/PendingIntent;->getActivity(Landroid/content/Context;ILandroid/content/Intent;I)Landroid/app/PendingIntent;

    move-result-object p0

    return-object p0
.end method

.method static supported(Ljava/lang/String;)Z
    .locals 1

    .line 36
    const-string v0, "todo"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "memo"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-nez p0, :cond_0

    const/4 p0, 0x0

    return p0

    :cond_0
    const/4 p0, 0x1

    return p0
.end method


# virtual methods
.method build(Ljava/lang/String;Z)V
    .locals 9

    .line 46
    const/4 v0, 0x0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dateButton:Landroid/widget/Button;

    new-instance v1, Landroid/widget/LinearLayout;

    invoke-direct {v1, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    const/4 v2, 0x1

    invoke-virtual {v1, v2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    const/high16 v3, 0x41900000    # 18.0f

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v4

    const/high16 v5, 0x41600000    # 14.0f

    invoke-virtual {p0, v5}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v5

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v3

    const/high16 v6, 0x41400000    # 12.0f

    invoke-virtual {p0, v6}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v7

    invoke-virtual {v1, v4, v5, v3, v7}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    new-instance v1, Landroid/graphics/drawable/GradientDrawable;

    invoke-direct {v1}, Landroid/graphics/drawable/GradientDrawable;-><init>()V

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    invoke-static {v3, v2}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result v3

    invoke-virtual {v1, v3}, Landroid/graphics/drawable/GradientDrawable;->setColor(I)V

    const/high16 v3, 0x41a00000    # 20.0f

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v4

    int-to-float v4, v4

    invoke-virtual {v1, v4}, Landroid/graphics/drawable/GradientDrawable;->setCornerRadius(F)V

    iget-object v4, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    invoke-virtual {v4, v1}, Landroid/widget/LinearLayout;->setBackground(Landroid/graphics/drawable/Drawable;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    const-string v4, "memo"

    invoke-virtual {v4, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_0

    const-string v1, "\uba54\ubaa8 \ucd94\uac00"

    goto :goto_0

    :cond_0
    const-string v1, "\ud22c\ub450 \ucd94\uac00"

    :goto_0
    invoke-virtual {p0, v1, v3}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v1

    invoke-virtual {v1, v0, v2}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_1

    const-string v0, "\uae30\uae30\uc5d0 \uc800\uc7a5 \u00b7 \uc571\uc744 \uc5f4\uba74 \ud604\uc7ac \uacc4\uc815\uc73c\ub85c \ub3d9\uae30\ud654"

    goto :goto_1

    :cond_1
    const-string v0, "\ub2e4\uc2dc \uc800\uc7a5\ud558\uba74 \uc0c8 \uc791\uc5c5\uc73c\ub85c \ub3d9\uae30\ud654\ub97c \uc2dc\ub3c4\ud569\ub2c8\ub2e4. \uae30\uc874 \ucd08\uc548\uc740 \uc800\uc7a5 \uc131\uacf5 \uc804\uae4c\uc9c0 \uc720\uc9c0\ub429\ub2c8\ub2e4."

    :goto_1
    invoke-virtual {p0, v0, v6}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->status:Landroid/widget/TextView;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setTextColor(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->status:Landroid/widget/TextView;

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v0, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$FRwKRnH9foLFAKmHvBqNgQEfgto;

    invoke-direct {v0, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$FRwKRnH9foLFAKmHvBqNgQEfgto;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    const-string v1, ""

    invoke-virtual {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recovery:Landroid/widget/Button;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v5, 0x42300000    # 44.0f

    invoke-virtual {p0, v5}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v5

    const/4 v6, -0x1

    invoke-direct {v3, v6, v5}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {v1, v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v0, Landroid/widget/ScrollView;

    invoke-direct {v0, p0}, Landroid/widget/ScrollView;-><init>(Landroid/content/Context;)V

    new-instance v1, Landroid/widget/LinearLayout;

    invoke-direct {v1, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    invoke-virtual {v1, v2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v1}, Landroid/widget/ScrollView;->addView(Landroid/view/View;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v5, 0x0

    const/high16 v7, 0x3f800000    # 1.0f

    invoke-direct {v3, v6, v5, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v1, v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v0, Landroid/widget/EditText;

    invoke-direct {v0, p0}, Landroid/widget/EditText;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    const/4 v1, 0x3

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setMinLines(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    const/high16 v1, 0x41800000    # 16.0f

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setTextSize(F)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    const/4 v3, 0x4

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setTextColor(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    const v1, 0x24001

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setInputType(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    new-array v1, v2, [Landroid/text/InputFilter;

    new-instance v2, Landroid/text/InputFilter$LengthFilter;

    const/16 v8, 0xb4

    invoke-direct {v2, v8}, Landroid/text/InputFilter$LengthFilter;-><init>(I)V

    aput-object v2, v1, v5

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setFilters([Landroid/text/InputFilter;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    invoke-virtual {v4, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_2

    const-string v1, "\uae30\uc5b5\ud560 \ub0b4\uc6a9\uc744 \uc801\uc5b4\uc8fc\uc138\uc694 (180\uc790 \uc774\ub0b4)"

    goto :goto_2

    :cond_2
    const-string v1, "\ud560 \uc77c\uc744 \uc801\uc5b4\uc8fc\uc138\uc694 (180\uc790 \uc774\ub0b4)"

    :goto_2
    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setHint(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    invoke-virtual {v4, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_3

    const-string v1, "\uba54\ubaa8 \ub0b4\uc6a9"

    goto :goto_3

    :cond_3
    const-string v1, "\ud22c\ub450 \ub0b4\uc6a9"

    :goto_3
    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setContentDescription(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    invoke-virtual {v0, p1}, Landroid/widget/EditText;->setText(Ljava/lang/CharSequence;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    new-instance v1, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v2, -0x2

    invoke-direct {v1, v6, v2}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {p1, v0, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    .line 47
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    const-string v0, "todo"

    invoke-virtual {v0, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_5

    new-instance p1, Landroid/widget/CheckBox;

    invoke-direct {p1, p0}, Landroid/widget/CheckBox;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    const-string v1, "\uae30\ud55c \uc124\uc815 (\uc120\ud0dd)"

    invoke-virtual {p1, v1}, Landroid/widget/CheckBox;->setText(Ljava/lang/CharSequence;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    invoke-static {v1, v3}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result v1

    invoke-virtual {p1, v1}, Landroid/widget/CheckBox;->setTextColor(I)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    invoke-virtual {p1, p2}, Landroid/widget/CheckBox;->setChecked(Z)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    invoke-virtual {p1, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance p1, Ljava/lang/StringBuilder;

    const-string v1, "\uae30\ud55c  "

    invoke-direct {p1, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    invoke-virtual {p1, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    new-instance v1, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$yu9zJmKW0j9L4f0Pz0h5CNcT8h4;

    invoke-direct {v1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$yu9zJmKW0j9L4f0Pz0h5CNcT8h4;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    invoke-virtual {p0, p1, v1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dateButton:Landroid/widget/Button;

    if-eqz p2, :cond_4

    move p2, v5

    goto :goto_4

    :cond_4
    const/16 p2, 0x8

    :goto_4
    invoke-virtual {p1, p2}, Landroid/widget/Button;->setVisibility(I)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dateButton:Landroid/widget/Button;

    invoke-virtual {p1, p2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    new-instance p2, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$FhdmKuCM5HBDpl-VG2OG4S3paRw;

    invoke-direct {p2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$FhdmKuCM5HBDpl-VG2OG4S3paRw;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    invoke-virtual {p1, p2}, Landroid/widget/CheckBox;->setOnCheckedChangeListener(Landroid/widget/CompoundButton$OnCheckedChangeListener;)V

    .line 48
    :cond_5
    new-instance p1, Landroid/widget/LinearLayout;

    invoke-direct {p1, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->actions:Landroid/widget/LinearLayout;

    invoke-virtual {p1, v5}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->actions:Landroid/widget/LinearLayout;

    new-instance p2, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$u8UWf71LBT5HwFCBrcAI-OWb98Y;

    invoke-direct {p2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$u8UWf71LBT5HwFCBrcAI-OWb98Y;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    const-string v1, "\ucde8\uc18c"

    invoke-virtual {p0, v1, p2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p2

    new-instance v1, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v2, 0x42400000    # 48.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v3

    invoke-direct {v1, v5, v3, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {p1, p2, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance p1, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$vvXRQTdPFZWCDMTcJawJBoKau2Y;

    invoke-direct {p1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$vvXRQTdPFZWCDMTcJawJBoKau2Y;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    const-string p2, "\uae30\uae30\uc5d0 \uc800\uc7a5"

    invoke-virtual {p0, p2, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->save:Landroid/widget/Button;

    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->actions:Landroid/widget/LinearLayout;

    new-instance v1, Landroid/widget/LinearLayout$LayoutParams;

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v2

    invoke-direct {v1, v5, v2, v7}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {p2, p1, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->actions:Landroid/widget/LinearLayout;

    invoke-virtual {p1, p2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->root:Landroid/widget/LinearLayout;

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->setContentView(Landroid/view/View;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getWindow()Landroid/view/Window;

    move-result-object p1

    const p2, 0x106000d

    invoke-virtual {p1, p2}, Landroid/view/Window;->setBackgroundDrawableResource(I)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getWindow()Landroid/view/Window;

    move-result-object p1

    const/16 p2, 0x10

    invoke-virtual {p1, p2}, Landroid/view/Window;->setSoftInputMode(I)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getWindow()Landroid/view/Window;

    move-result-object p1

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getResources()Landroid/content/res/Resources;

    move-result-object p2

    invoke-virtual {p2}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object p2

    iget p2, p2, Landroid/util/DisplayMetrics;->widthPixels:I

    const/high16 v1, 0x41c00000    # 24.0f

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v1

    sub-int/2addr p2, v1

    const/high16 v1, 0x43fa0000    # 500.0f

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v1

    invoke-static {p2, v1}, Ljava/lang/Math;->min(II)I

    move-result p2

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getResources()Landroid/content/res/Resources;

    move-result-object v1

    invoke-virtual {v1}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v1

    iget v1, v1, Landroid/util/DisplayMetrics;->heightPixels:I

    const/high16 v2, 0x42800000    # 64.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v2

    sub-int/2addr v1, v2

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    invoke-virtual {v0, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_6

    const/16 v0, 0x190

    goto :goto_5

    :cond_6
    const/16 v0, 0x154

    :goto_5
    int-to-float v0, v0

    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v0

    invoke-static {v1, v0}, Ljava/lang/Math;->min(II)I

    move-result v0

    invoke-virtual {p1, p2, v0}, Landroid/view/Window;->setLayout(II)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->updateRecovery()V

    return-void
.end method

.method button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;
    .locals 1

    .line 44
    new-instance v0, Landroid/widget/Button;

    invoke-direct {v0, p0}, Landroid/widget/Button;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    const/high16 p1, 0x41600000    # 14.0f

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setTextSize(F)V

    const/4 p1, 0x0

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setAllCaps(Z)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetThemeV190;->accent(Ljava/lang/String;)I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setTextColor(I)V

    const/high16 p1, 0x42300000    # 44.0f

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setMinHeight(I)V

    invoke-virtual {v0, p2}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    return-object v0
.end method

.method chooseDraft(Lorg/json/JSONObject;)V
    .locals 3

    .line 66
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-nez v0, :cond_0

    return-void

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-interface {v0}, Landroid/text/Editable;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_1

    new-instance v0, Landroid/app/AlertDialog$Builder;

    invoke-direct {v0, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v1, "\uc785\ub825 \uc911\uc778 \ub0b4\uc6a9\uc774 \uc788\uc5b4\uc694"

    invoke-virtual {v0, v1}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    const-string v1, "\ud604\uc7ac \uc785\ub825 \ub300\uc2e0 \uc800\uc7a5\ub41c \ucd08\uc548\uc744 \uc5f4\uae4c\uc694?"

    invoke-virtual {v0, v1}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    const/4 v1, 0x0

    const-string v2, "\ub3cc\uc544\uac00\uae30"

    invoke-virtual {v0, v2, v1}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    new-instance v1, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$BFp-TaUpIS_ANZXNXuHA3i0_5G4;

    invoke-direct {v1, p0, p1}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$BFp-TaUpIS_ANZXNXuHA3i0_5G4;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;Lorg/json/JSONObject;)V

    const-string p1, "\ucd08\uc548 \uc5f4\uae30"

    invoke-virtual {v0, p1, v1}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    invoke-virtual {p1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->confirmation:Landroid/app/AlertDialog;

    goto :goto_0

    :cond_1
    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->loadDraft(Lorg/json/JSONObject;)V

    :goto_0
    return-void
.end method

.method current()Z
    .locals 5

    .line 49
    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    const/4 v1, 0x1

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->owns(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    return v1

    :cond_0
    iput-boolean v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dismissDialogs()V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    const-string v1, ""

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setText(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->fields:Landroid/widget/LinearLayout;

    invoke-virtual {v0}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->actions:Landroid/widget/LinearLayout;

    invoke-virtual {v0}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recovery:Landroid/widget/Button;

    const/16 v1, 0x8

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setVisibility(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->status:Landroid/widget/TextView;

    const-string v1, "\uacc4\uc815\uc774 \ubcc0\uacbd\ub418\uc5c8\uac70\ub098 \ub3d9\uae30\ud654\uac00 \ud544\uc694\ud569\ub2c8\ub2e4. \uc704\uc82f\uc744 \ub2e4\uc2dc \uc5f4\uc5b4\uc8fc\uc138\uc694."

    invoke-virtual {v0, v1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->actions:Landroid/widget/LinearLayout;

    new-instance v1, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$v0FP7wawdpp0T-T8r_eDCHbEscQ;

    invoke-direct {v1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$v0FP7wawdpp0T-T8r_eDCHbEscQ;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    const-string v2, "\ub2eb\uae30"

    invoke-virtual {p0, v2, v1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v1

    new-instance v2, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v3, -0x1

    const/high16 v4, 0x42400000    # 48.0f

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v4

    invoke-direct {v2, v3, v4}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {v0, v1, v2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    :cond_1
    const/4 v0, 0x0

    return v0
.end method

.method deleteDraft(Lorg/json/JSONObject;)V
    .locals 3

    .line 69
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-nez v0, :cond_0

    return-void

    :cond_0
    new-instance v0, Landroid/app/AlertDialog$Builder;

    invoke-direct {v0, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v1, "\ucd08\uc548 \uc0ad\uc81c"

    invoke-virtual {v0, v1}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "value"

    invoke-virtual {p1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, "\n\n\ub3d9\uae30\ud654\ub418\uc9c0 \uc54a\uc740 \uc774 \uae30\uae30\uc758 \ucd08\uc548\uc744 \uc0ad\uc81c\ud560\uae4c\uc694?"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v1

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/app/AlertDialog$Builder;->setMessage(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    const/4 v1, 0x0

    const-string v2, "\ucde8\uc18c"

    invoke-virtual {v0, v2, v1}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    new-instance v1, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$TP_qAzd-R3kLGitDg6uOwkJvRAc;

    invoke-direct {v1, p0, p1}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$TP_qAzd-R3kLGitDg6uOwkJvRAc;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;Lorg/json/JSONObject;)V

    const-string p1, "\uc0ad\uc81c"

    invoke-virtual {v0, p1, v1}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    invoke-virtual {p1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->confirmation:Landroid/app/AlertDialog;

    .line 70
    return-void
.end method

.method dismissDialogs()V
    .locals 1

    .line 57
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->picker:Landroid/app/DatePickerDialog;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Landroid/app/DatePickerDialog;->dismiss()V

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveryDialog:Landroid/app/AlertDialog;

    if-eqz v0, :cond_1

    invoke-virtual {v0}, Landroid/app/AlertDialog;->dismiss()V

    :cond_1
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->confirmation:Landroid/app/AlertDialog;

    if-eqz v0, :cond_2

    invoke-virtual {v0}, Landroid/app/AlertDialog;->dismiss()V

    :cond_2
    return-void
.end method

.method dp(F)I
    .locals 1

    .line 42
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->density:F

    mul-float/2addr p1, v0

    invoke-static {p1}, Ljava/lang/Math;->round(F)I

    move-result p1

    return p1
.end method

.method label(Ljava/lang/String;F)Landroid/widget/TextView;
    .locals 2

    .line 43
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    invoke-virtual {v0, p2}, Landroid/widget/TextView;->setTextSize(F)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    const/4 p2, 0x4

    invoke-static {p1, p2}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p1, 0x40800000    # 4.0f

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result p2

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result p1

    const/4 v1, 0x0

    invoke-virtual {v0, v1, p2, v1, p1}, Landroid/widget/TextView;->setPadding(IIII)V

    return-object v0
.end method

.method public synthetic lambda$0$WidgetNoteActivityV196(Landroid/view/View;)V
    .locals 0

    .line 46
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->showRecovery()V

    return-void
.end method

.method public synthetic lambda$1$WidgetNoteActivityV196(Landroid/view/View;)V
    .locals 0

    .line 47
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->pickDate()V

    return-void
.end method

.method public synthetic lambda$10$WidgetNoteActivityV196(Lorg/json/JSONObject;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 66
    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->loadDraft(Lorg/json/JSONObject;)V

    return-void
.end method

.method public synthetic lambda$11$WidgetNoteActivityV196(Lorg/json/JSONObject;Landroid/content/DialogInterface;I)V
    .locals 1

    .line 69
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result p2

    if-nez p2, :cond_0

    return-void

    :cond_0
    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    const-string p3, "key"

    invoke-virtual {p1, p3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    invoke-static {p0, p2, v0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->discardFailed(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;)Z

    move-result p2

    if-eqz p2, :cond_3

    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    invoke-virtual {p1, p3}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p2, p1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    const-string p1, ""

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    :cond_1
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveryDialog:Landroid/app/AlertDialog;

    if-eqz p1, :cond_2

    invoke-virtual {p1}, Landroid/app/AlertDialog;->dismiss()V

    :cond_2
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->updateRecovery()V

    const/4 p1, 0x0

    const-string p2, "\ucd08\uc548\uc744 \uc0ad\uc81c\ud588\uc2b5\ub2c8\ub2e4."

    goto :goto_0

    :cond_3
    const/4 p1, 0x1

    const-string p2, "\uc0ad\uc81c\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \ucd08\uc548\uc744 \uc720\uc9c0\ud588\uc2b5\ub2c8\ub2e4."

    :goto_0
    invoke-static {p0, p2, p1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return-void
.end method

.method public synthetic lambda$2$WidgetNoteActivityV196(Landroid/widget/CompoundButton;Z)V
    .locals 0

    .line 47
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dateButton:Landroid/widget/Button;

    if-eqz p2, :cond_0

    const/4 p2, 0x0

    goto :goto_0

    :cond_0
    const/16 p2, 0x8

    :goto_0
    invoke-virtual {p1, p2}, Landroid/widget/Button;->setVisibility(I)V

    return-void
.end method

.method public synthetic lambda$3$WidgetNoteActivityV196(Landroid/view/View;)V
    .locals 0

    .line 48
    iget-boolean p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    if-nez p1, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->finish()V

    :cond_0
    return-void
.end method

.method public synthetic lambda$4$WidgetNoteActivityV196(Landroid/view/View;)V
    .locals 0

    .line 48
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->save()V

    return-void
.end method

.method public synthetic lambda$5$WidgetNoteActivityV196(Landroid/view/View;)V
    .locals 0

    .line 49
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->finish()V

    return-void
.end method

.method public synthetic lambda$6$WidgetNoteActivityV196()V
    .locals 1

    .line 52
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-eqz v0, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->updateRecovery()V

    :cond_0
    return-void
.end method

.method public synthetic lambda$7$WidgetNoteActivityV196(Landroid/widget/DatePicker;III)V
    .locals 2

    .line 54
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result p1

    if-nez p1, :cond_0

    return-void

    :cond_0
    sget-object p1, Ljava/util/Locale;->US:Ljava/util/Locale;

    const/4 v0, 0x3

    new-array v0, v0, [Ljava/lang/Object;

    const/4 v1, 0x0

    invoke-static {p2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p2

    aput-object p2, v0, v1

    const/4 p2, 0x1

    add-int/2addr p3, p2

    invoke-static {p3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p3

    aput-object p3, v0, p2

    const/4 p2, 0x2

    invoke-static {p4}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p3

    aput-object p3, v0, p2

    const-string p2, "%04d-%02d-%02d"

    invoke-static {p1, p2, v0}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dateButton:Landroid/widget/Button;

    new-instance p2, Ljava/lang/StringBuilder;

    const-string p3, "\uae30\ud55c  "

    invoke-direct {p2, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object p3, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    return-void
.end method

.method public synthetic lambda$8$WidgetNoteActivityV196(Lorg/json/JSONObject;Landroid/view/View;)V
    .locals 0

    .line 63
    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chooseDraft(Lorg/json/JSONObject;)V

    return-void
.end method

.method public synthetic lambda$9$WidgetNoteActivityV196(Lorg/json/JSONObject;Landroid/view/View;)V
    .locals 0

    .line 63
    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->deleteDraft(Lorg/json/JSONObject;)V

    return-void
.end method

.method loadDraft(Lorg/json/JSONObject;)V
    .locals 2

    .line 67
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-nez v0, :cond_0

    return-void

    :cond_0
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dismissDialogs()V

    const-string v0, "op"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    const-string v1, "add-memo"

    invoke-virtual {v1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    const-string v0, "memo"

    goto :goto_0

    :cond_1
    const-string v0, "todo"

    :goto_0
    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    const-string v0, "key"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "widget-private-"

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Ljava/util/UUID;->randomUUID()Ljava/util/UUID;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v0

    iput-wide v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->createdAt:J

    const-string v0, "date"

    invoke-virtual {p1, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCalendarV195;->validDate(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_2

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    :cond_2
    const-string v1, "value"

    invoke-virtual {p1, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p0, p1, v0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->build(Ljava/lang/String;Z)V

    return-void
.end method

.method public onBackPressed()V
    .locals 1

    .line 71
    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    if-nez v0, :cond_0

    invoke-super {p0}, Landroid/app/Activity;->onBackPressed()V

    :cond_0
    return-void
.end method

.method public onCreate(Landroid/os/Bundle;)V
    .locals 7

    .line 45
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->requestWindowFeature(I)Z

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getIntent()Landroid/content/Intent;

    move-result-object v1

    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetActionReceiverV196;->consume(Landroid/content/Context;Landroid/content/Intent;)Z

    move-result v1

    if-eqz v1, :cond_0

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->finish()V

    return-void

    :cond_0
    const/4 v1, 0x0

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->setFinishOnTouchOutside(Z)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getIntent()Landroid/content/Intent;

    move-result-object v2

    const-string v3, "uid"

    invoke-virtual {v2, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    iput-object v4, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    const-string v4, "boundUid"

    invoke-virtual {v2, v4}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    if-eqz v4, :cond_1

    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    invoke-virtual {v4, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    if-nez v4, :cond_1

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->finish()V

    return-void

    :cond_1
    const-string v4, "noteType"

    invoke-virtual {v2, v4}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    const-string v5, "appWidgetId"

    invoke-virtual {v2, v5, v1}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    move-result v5

    iput v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->widget:I

    const-string v5, "kind"

    invoke-virtual {v2, v5}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->kind:Ljava/lang/String;

    if-eqz v5, :cond_2

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->supports(Ljava/lang/String;)Z

    move-result v5

    if-nez v5, :cond_3

    :cond_2
    const-string v5, "CalendarMonth"

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->kind:Ljava/lang/String;

    :cond_3
    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->supported(Ljava/lang/String;)Z

    move-result v5

    if-nez v5, :cond_4

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->finish()V

    return-void

    :cond_4
    iget v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->widget:I

    invoke-static {p0, v5}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->chosen:Ljava/lang/String;

    const-string v5, "date"

    invoke-virtual {v2, v5}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetCalendarV195;->validDate(Ljava/lang/String;)Z

    move-result v2

    if-nez v2, :cond_5

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v2

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    :cond_5
    new-instance v2, Ljava/lang/StringBuilder;

    const-string v5, "widget-private-"

    invoke-direct {v2, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Ljava/util/UUID;->randomUUID()Ljava/util/UUID;

    move-result-object v5

    invoke-virtual {v2, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    iput-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v5

    iput-wide v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->createdAt:J

    if-eqz p1, :cond_6

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    if-eqz v2, :cond_6

    invoke-virtual {p1, v3}, Landroid/os/Bundle;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_6

    move v2, v0

    goto :goto_0

    :cond_6
    move v2, v1

    :goto_0
    const-string v3, ""

    if-eqz v2, :cond_8

    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    const-string v6, "draftDate"

    invoke-virtual {p1, v6, v5}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    const-string v6, "draftId"

    invoke-virtual {p1, v6, v5}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    const-string v5, "recoveringKey"

    invoke-virtual {p1, v5, v3}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    iput-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    invoke-virtual {p1, v4}, Landroid/os/Bundle;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-static {v5}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->supported(Ljava/lang/String;)Z

    move-result v5

    if-eqz v5, :cond_7

    invoke-virtual {p1, v4}, Landroid/os/Bundle;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    iput-object v4, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    :cond_7
    iget-wide v4, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->createdAt:J

    const-string v6, "createdAt"

    invoke-virtual {p1, v6, v4, v5}, Landroid/os/Bundle;->getLong(Ljava/lang/String;J)J

    move-result-wide v4

    iput-wide v4, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->createdAt:J

    :cond_8
    if-eqz v2, :cond_9

    const-string v4, "value"

    invoke-virtual {p1, v4, v3}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v3

    :cond_9
    if-eqz v2, :cond_a

    const-string v2, "dated"

    invoke-virtual {p1, v2}, Landroid/os/Bundle;->getBoolean(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_a

    goto :goto_1

    :cond_a
    move v0, v1

    :goto_1
    invoke-virtual {p0, v3, v0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->build(Ljava/lang/String;Z)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    return-void
.end method

.method public onDestroy()V
    .locals 0

    .line 58
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dismissDialogs()V

    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V

    return-void
.end method

.method public onPause()V
    .locals 1

    .line 51
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0, p0}, Landroid/content/SharedPreferences;->unregisterOnSharedPreferenceChangeListener(Landroid/content/SharedPreferences$OnSharedPreferenceChangeListener;)V

    invoke-super {p0}, Landroid/app/Activity;->onPause()V

    return-void
.end method

.method public onResume()V
    .locals 1

    .line 50
    invoke-super {p0}, Landroid/app/Activity;->onResume()V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0, p0}, Landroid/content/SharedPreferences;->registerOnSharedPreferenceChangeListener(Landroid/content/SharedPreferences$OnSharedPreferenceChangeListener;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-eqz v0, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->updateRecovery()V

    :cond_0
    return-void
.end method

.method protected onSaveInstanceState(Landroid/os/Bundle;)V
    .locals 3

    .line 53
    invoke-super {p0, p1}, Landroid/app/Activity;->onSaveInstanceState(Landroid/os/Bundle;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    const-string v1, "uid"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    if-nez v0, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    if-eqz v0, :cond_1

    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-interface {v0}, Landroid/text/Editable;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "value"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    if-eqz v0, :cond_0

    invoke-virtual {v0}, Landroid/widget/CheckBox;->isChecked()Z

    move-result v0

    if-eqz v0, :cond_0

    const/4 v0, 0x1

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    :goto_0
    const-string v1, "dated"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    const-string v1, "draftDate"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    const-string v1, "draftId"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    const-string v1, "recoveringKey"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    const-string v1, "noteType"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-wide v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->createdAt:J

    const-string v2, "createdAt"

    invoke-virtual {p1, v2, v0, v1}, Landroid/os/Bundle;->putLong(Ljava/lang/String;J)V

    :cond_1
    return-void
.end method

.method public onSharedPreferenceChanged(Landroid/content/SharedPreferences;Ljava/lang/String;)V
    .locals 1

    .line 52
    const-string p1, "widget_snapshot"

    invoke-virtual {p1, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "widget_private_failed_v196:"

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    :cond_0
    new-instance p1, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$WhXXOTsTiZ_ooviGWu3Ibg8-jZ8;

    invoke-direct {p1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$WhXXOTsTiZ_ooviGWu3Ibg8-jZ8;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->runOnUiThread(Ljava/lang/Runnable;)V

    :cond_1
    return-void
.end method

.method pickDate()V
    .locals 8

    .line 54
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-nez v0, :cond_0

    return-void

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v0

    new-instance v7, Landroid/app/DatePickerDialog;

    new-instance v3, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$nV2QuKJQ0lTe88ehW5D22vJVpbg;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$nV2QuKJQ0lTe88ehW5D22vJVpbg;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;)V

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v4

    const/4 v1, 0x2

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v5

    const/4 v1, 0x5

    invoke-virtual {v0, v1}, Ljava/util/Calendar;->get(I)I

    move-result v6

    move-object v1, v7

    move-object v2, p0

    invoke-direct/range {v1 .. v6}, Landroid/app/DatePickerDialog;-><init>(Landroid/content/Context;Landroid/app/DatePickerDialog$OnDateSetListener;III)V

    iput-object v7, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->picker:Landroid/app/DatePickerDialog;

    invoke-virtual {v7}, Landroid/app/DatePickerDialog;->getDatePicker()Landroid/widget/DatePicker;

    move-result-object v0

    const-string v1, "2000-01-01"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v1

    invoke-virtual {v1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v1

    invoke-virtual {v0, v1, v2}, Landroid/widget/DatePicker;->setMinDate(J)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->picker:Landroid/app/DatePickerDialog;

    invoke-virtual {v0}, Landroid/app/DatePickerDialog;->getDatePicker()Landroid/widget/DatePicker;

    move-result-object v0

    const-string v1, "2199-12-31"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v1

    invoke-virtual {v1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v1

    invoke-virtual {v0, v1, v2}, Landroid/widget/DatePicker;->setMaxDate(J)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->picker:Landroid/app/DatePickerDialog;

    invoke-virtual {v0}, Landroid/app/DatePickerDialog;->show()V

    return-void
.end method

.method save()V
    .locals 10

    .line 55
    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    if-nez v0, :cond_8

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    if-nez v0, :cond_8

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-nez v0, :cond_0

    goto/16 :goto_5

    :cond_0
    :try_start_0
    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->type:Ljava/lang/String;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-interface {v0}, Landroid/text/Editable;->toString()Ljava/lang/String;

    move-result-object v3

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dated:Landroid/widget/CheckBox;

    invoke-virtual {v0}, Landroid/widget/CheckBox;->isChecked()Z

    move-result v0

    if-eqz v0, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftDate:Ljava/lang/String;

    goto :goto_0

    :cond_1
    const-string v0, ""

    :goto_0
    move-object v4, v0

    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->draftId:Ljava/lang/String;

    iget-wide v6, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->createdAt:J

    iget-object v8, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->kind:Ljava/lang/String;

    iget v9, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->widget:I

    invoke-static/range {v1 .. v9}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->command(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;JLjava/lang/String;I)Lorg/json/JSONObject;

    move-result-object v0
    :try_end_0
    .catch Ljava/lang/IllegalArgumentException; {:try_start_0 .. :try_end_0} :catch_1

    const/4 v1, 0x1

    iput-boolean v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->save:Landroid/widget/Button;

    const/4 v3, 0x0

    invoke-virtual {v2, v3}, Landroid/widget/Button;->setEnabled(Z)V

    :try_start_1
    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    invoke-virtual {v2}, Ljava/lang/String;->isEmpty()Z

    move-result v2

    if-eqz v2, :cond_2

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    invoke-static {p0, v2, v0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->enqueue(Landroid/content/Context;Ljava/lang/String;Lorg/json/JSONObject;)V

    goto :goto_1

    :cond_2
    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    iget-object v4, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveringKey:Ljava/lang/String;

    invoke-static {p0, v2, v4, v0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->retryFailed(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Lorg/json/JSONObject;)V

    :goto_1
    iput-boolean v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getCurrentFocus()Landroid/view/View;

    move-result-object v0

    if-eqz v0, :cond_3

    const-string v2, "input_method"

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v2

    check-cast v2, Landroid/view/inputmethod/InputMethodManager;

    invoke-virtual {v0}, Landroid/view/View;->getWindowToken()Landroid/os/IBinder;

    move-result-object v0

    invoke-virtual {v2, v0, v3}, Landroid/view/inputmethod/InputMethodManager;->hideSoftInputFromWindow(Landroid/os/IBinder;I)Z

    :cond_3
    const-string v0, "\uae30\uae30\uc5d0 \uc800\uc7a5\ud588\uc2b5\ub2c8\ub2e4. \uc571\uc744 \uc5f4\uba74 \ub3d9\uae30\ud654\ud569\ub2c8\ub2e4."

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->finish()V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    iput-boolean v3, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    if-nez v0, :cond_6

    goto :goto_3

    :catchall_0
    move-exception v0

    goto :goto_4

    :catch_0
    move-exception v0

    :try_start_2
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v2

    if-eqz v2, :cond_5

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->status:Landroid/widget/TextView;

    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v4

    if-nez v4, :cond_4

    const-string v0, "\uc800\uc7a5\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \uc785\ub825\uc744 \uc720\uc9c0\ud588\uc2b5\ub2c8\ub2e4."

    goto :goto_2

    :cond_4
    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v0

    :goto_2
    invoke-virtual {v2, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_0

    :cond_5
    iput-boolean v3, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    if-nez v0, :cond_6

    :goto_3
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->save:Landroid/widget/Button;

    invoke-virtual {v0, v1}, Landroid/widget/Button;->setEnabled(Z)V

    :cond_6
    return-void

    :goto_4
    iput-boolean v3, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    iget-boolean v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    if-nez v2, :cond_7

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->save:Landroid/widget/Button;

    invoke-virtual {v2, v1}, Landroid/widget/Button;->setEnabled(Z)V

    :cond_7
    throw v0

    :catch_1
    move-exception v0

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->status:Landroid/widget/TextView;

    invoke-virtual {v0}, Ljava/lang/IllegalArgumentException;->getMessage()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v1, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->value:Landroid/widget/EditText;

    invoke-virtual {v0}, Landroid/widget/EditText;->requestFocus()Z

    :cond_8
    :goto_5
    return-void
.end method

.method showRecovery()V
    .locals 11

    .line 61
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->current()Z

    move-result v0

    if-eqz v0, :cond_6

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->saving:Z

    if-eqz v0, :cond_0

    goto/16 :goto_4

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->failedAdds(Landroid/content/Context;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v1

    if-nez v1, :cond_1

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->updateRecovery()V

    return-void

    .line 62
    :cond_1
    new-instance v1, Landroid/widget/LinearLayout;

    invoke-direct {v1, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    const/4 v2, 0x1

    invoke-virtual {v1, v2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    const/high16 v2, 0x41800000    # 16.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v3

    const/high16 v4, 0x41000000    # 8.0f

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v5

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v2

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v4

    invoke-virtual {v1, v3, v5, v2, v4}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    .line 63
    const/4 v2, 0x0

    move v3, v2

    :goto_0
    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v4

    if-lt v3, v4, :cond_2

    .line 64
    new-instance v0, Landroid/widget/ScrollView;

    invoke-direct {v0, p0}, Landroid/widget/ScrollView;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0, v1}, Landroid/widget/ScrollView;->addView(Landroid/view/View;)V

    new-instance v1, Landroid/app/AlertDialog$Builder;

    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v2, "\ub3d9\uae30\ud654 \ud655\uc778\uc774 \ud544\uc694\ud55c \ucd08\uc548"

    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object v1

    invoke-virtual {v1, v0}, Landroid/app/AlertDialog$Builder;->setView(Landroid/view/View;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    const/4 v1, 0x0

    const-string v2, "\ub2eb\uae30"

    invoke-virtual {v0, v2, v1}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object v0

    invoke-virtual {v0}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveryDialog:Landroid/app/AlertDialog;

    invoke-virtual {v0}, Landroid/app/AlertDialog;->show()V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recoveryDialog:Landroid/app/AlertDialog;

    invoke-virtual {v0}, Landroid/app/AlertDialog;->getWindow()Landroid/view/Window;

    move-result-object v0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getResources()Landroid/content/res/Resources;

    move-result-object v1

    invoke-virtual {v1}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v1

    iget v1, v1, Landroid/util/DisplayMetrics;->widthPixels:I

    const/high16 v2, 0x42000000    # 32.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v2

    sub-int/2addr v1, v2

    const/high16 v2, 0x43f00000    # 480.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v2

    invoke-static {v1, v2}, Ljava/lang/Math;->min(II)I

    move-result v1

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->getResources()Landroid/content/res/Resources;

    move-result-object v2

    invoke-virtual {v2}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v2

    iget v2, v2, Landroid/util/DisplayMetrics;->heightPixels:I

    const/high16 v3, 0x42a00000    # 80.0f

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v3

    sub-int/2addr v2, v3

    const/high16 v3, 0x43e60000    # 460.0f

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v3

    invoke-static {v2, v3}, Ljava/lang/Math;->min(II)I

    move-result v2

    invoke-virtual {v0, v1, v2}, Landroid/view/Window;->setLayout(II)V

    .line 65
    return-void

    .line 63
    :cond_2
    invoke-virtual {v0, v3}, Lorg/json/JSONArray;->optJSONObject(I)Lorg/json/JSONObject;

    move-result-object v4

    if-nez v4, :cond_3

    goto/16 :goto_3

    :cond_3
    const-string v5, "op"

    invoke-virtual {v4, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    const-string v6, "add-memo"

    invoke-virtual {v6, v5}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v5

    if-eqz v5, :cond_4

    const-string v5, "\uba54\ubaa8"

    goto :goto_1

    :cond_4
    const-string v5, "\ud22c\ub450"

    :goto_1
    new-instance v6, Ljava/lang/StringBuilder;

    invoke-static {v5}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v5

    invoke-direct {v6, v5}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v5, "date"

    invoke-virtual {v4, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/String;->isEmpty()Z

    move-result v7

    if-eqz v7, :cond_5

    const-string v5, ""

    goto :goto_2

    :cond_5
    new-instance v7, Ljava/lang/StringBuilder;

    const-string v8, " \u00b7 "

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v4, v5}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v7, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    :goto_2
    invoke-virtual {v6, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "\n"

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    const-string v6, "value"

    invoke-virtual {v4, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v6

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    const/high16 v6, 0x41700000    # 15.0f

    invoke-virtual {p0, v5, v6}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v5

    invoke-virtual {v1, v5}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v5, Landroid/widget/LinearLayout;

    invoke-direct {v5, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    new-instance v6, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$4sY-1e5idAvB_lZv5KZOVbVnibE;

    invoke-direct {v6, p0, v4}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$4sY-1e5idAvB_lZv5KZOVbVnibE;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;Lorg/json/JSONObject;)V

    const-string v7, "\ub2e4\uc2dc \uc791\uc131"

    invoke-virtual {p0, v7, v6}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v6

    new-instance v7, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v8, 0x42300000    # 44.0f

    invoke-virtual {p0, v8}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v9

    const/high16 v10, 0x3f800000    # 1.0f

    invoke-direct {v7, v2, v9, v10}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v5, v6, v7}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v6, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$d0Wm8_nqV_rMnr3iIFDyRbWTiQI;

    invoke-direct {v6, p0, v4}, Lcom/aiderlog/v22app/-$$Lambda$WidgetNoteActivityV196$d0Wm8_nqV_rMnr3iIFDyRbWTiQI;-><init>(Lcom/aiderlog/v22app/WidgetNoteActivityV196;Lorg/json/JSONObject;)V

    const-string v4, "\uc0ad\uc81c"

    invoke-virtual {p0, v4, v6}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v4

    new-instance v6, Landroid/widget/LinearLayout$LayoutParams;

    invoke-virtual {p0, v8}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->dp(F)I

    move-result v7

    invoke-direct {v6, v2, v7, v10}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v5, v4, v6}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    invoke-virtual {v1, v5}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    :goto_3
    add-int/lit8 v3, v3, 0x1

    goto/16 :goto_0

    .line 61
    :cond_6
    :goto_4
    return-void
.end method

.method updateRecovery()V
    .locals 4

    .line 59
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recovery:Landroid/widget/Button;

    if-eqz v0, :cond_2

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->closed:Z

    if-eqz v0, :cond_0

    goto :goto_1

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->uid:Ljava/lang/String;

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetPrivateV196;->failedAdds(Landroid/content/Context;Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v0

    invoke-virtual {v0}, Lorg/json/JSONArray;->length()I

    move-result v0

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recovery:Landroid/widget/Button;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "\ub3d9\uae30\ud654 \ud655\uc778\ud560 \ucd08\uc548 "

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    move-result-object v2

    const-string v3, "\uac1c"

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->recovery:Landroid/widget/Button;

    if-lez v0, :cond_1

    const/4 v0, 0x0

    goto :goto_0

    :cond_1
    const/16 v0, 0x8

    :goto_0
    invoke-virtual {v1, v0}, Landroid/widget/Button;->setVisibility(I)V

    :cond_2
    :goto_1
    return-void
.end method
