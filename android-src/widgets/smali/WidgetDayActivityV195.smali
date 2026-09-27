.class public final Lcom/aiderlog/v22app/WidgetDayActivityV195;
.super Landroid/app/Activity;
.source "WidgetDayActivityV195.java"

# interfaces
.implements Landroid/content/SharedPreferences$OnSharedPreferenceChangeListener;


# instance fields
.field private allDay:Landroid/widget/CheckBox;

.field private chosen:Ljava/lang/String;

.field private content:Landroid/widget/LinearLayout;

.field private date:Ljava/lang/String;

.field private dateButton:Landroid/widget/Button;

.field private draftDate:Ljava/lang/String;

.field private draftTime:Ljava/lang/String;

.field private editing:Z

.field private footer:Landroid/widget/LinearLayout;

.field private heading:Landroid/widget/TextView;

.field private root:Landroid/widget/LinearLayout;

.field private sourceKind:Ljava/lang/String;

.field private status:Landroid/widget/TextView;

.field private timeButton:Landroid/widget/Button;

.field private title:Landroid/widget/EditText;

.field private uid:Ljava/lang/String;

.field private widget:I


# direct methods
.method public constructor <init>()V
    .locals 2

    .line 30
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    .line 31
    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    const-string v1, "CalendarMonth"

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->sourceKind:Ljava/lang/String;

    const-string v1, "system"

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    const-string v0, "09:00"

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    .line 30
    return-void
.end method


# virtual methods
.method addAction(Landroid/widget/Button;)V
    .locals 5

    .line 36
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    new-instance v1, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v2, 0x42400000    # 48.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v2

    const/4 v3, 0x0

    const/high16 v4, 0x3f800000    # 1.0f

    invoke-direct {v1, v3, v2, v4}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v0, p1, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    return-void
.end method

.method build()V
    .locals 7

    .line 40
    new-instance v0, Landroid/widget/LinearLayout;

    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    const/high16 v2, 0x41900000    # 18.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v3

    const/high16 v4, 0x41400000    # 12.0f

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v5

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v2

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v6

    invoke-virtual {v0, v3, v5, v2, v6}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    new-instance v0, Landroid/graphics/drawable/GradientDrawable;

    invoke-direct {v0}, Landroid/graphics/drawable/GradientDrawable;-><init>()V

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    invoke-static {v2, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result v2

    invoke-virtual {v0, v2}, Landroid/graphics/drawable/GradientDrawable;->setColor(I)V

    const/high16 v2, 0x41a00000    # 20.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v3

    int-to-float v3, v3

    invoke-virtual {v0, v3}, Landroid/graphics/drawable/GradientDrawable;->setCornerRadius(F)V

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    invoke-virtual {v3, v0}, Landroid/widget/LinearLayout;->setBackground(Landroid/graphics/drawable/Drawable;)V

    .line 41
    const-string v0, ""

    invoke-virtual {p0, v0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v2

    iput-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->heading:Landroid/widget/TextView;

    const/4 v3, 0x0

    invoke-virtual {v2, v3, v1}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->heading:Landroid/widget/TextView;

    invoke-virtual {v2, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    invoke-virtual {p0, v0, v4}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->status:Landroid/widget/TextView;

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    invoke-static {v2}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v2

    invoke-virtual {v0, v2}, Landroid/widget/TextView;->setTextColor(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->status:Landroid/widget/TextView;

    invoke-virtual {v0, v2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v0, Landroid/widget/ScrollView;

    invoke-direct {v0, p0}, Landroid/widget/ScrollView;-><init>(Landroid/content/Context;)V

    const/4 v2, 0x0

    invoke-virtual {v0, v2}, Landroid/widget/ScrollView;->setFillViewport(Z)V

    new-instance v3, Landroid/widget/LinearLayout;

    invoke-direct {v3, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object v3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v3, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v1}, Landroid/widget/ScrollView;->addView(Landroid/view/View;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v4, -0x1

    const/high16 v5, 0x3f800000    # 1.0f

    invoke-direct {v3, v4, v2, v5}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v1, v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v0, Landroid/widget/LinearLayout;

    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->root:Landroid/widget/LinearLayout;

    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->setContentView(Landroid/view/View;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getWindow()Landroid/view/Window;

    move-result-object v0

    const v1, 0x106000d

    invoke-virtual {v0, v1}, Landroid/view/Window;->setBackgroundDrawableResource(I)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getWindow()Landroid/view/Window;

    move-result-object v0

    const/16 v1, 0x10

    invoke-virtual {v0, v1}, Landroid/view/Window;->setSoftInputMode(I)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->resize()V

    return-void
.end method

.method button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;
    .locals 1

    .line 35
    new-instance v0, Landroid/widget/Button;

    invoke-direct {v0, p0}, Landroid/widget/Button;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    const/high16 p1, 0x41600000    # 14.0f

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setTextSize(F)V

    const/4 p1, 0x0

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setAllCaps(Z)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetThemeV190;->accent(Ljava/lang/String;)I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setTextColor(I)V

    const/high16 p1, 0x42300000    # 44.0f

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/Button;->setMinHeight(I)V

    invoke-virtual {v0, p2}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    return-object v0
.end method

.method current()Z
    .locals 3

    .line 43
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    invoke-static {p0, v0}, Lcom/aiderlog/v22app/WidgetCalendarV195;->owns(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    const/4 v0, 0x1

    return v0

    :cond_0
    const/4 v0, 0x0

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    if-eqz v1, :cond_1

    invoke-virtual {v1}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    invoke-virtual {v1}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    invoke-virtual {v1, v0}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->heading:Landroid/widget/TextView;

    const-string v2, "\uc704\uc82f \uacc4\uc815 \ud655\uc778"

    invoke-virtual {v1, v2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->status:Landroid/widget/TextView;

    const-string v2, "\uacc4\uc815\uc774 \ubcc0\uacbd\ub418\uc5c8\uac70\ub098 \ub3d9\uae30\ud654\uac00 \ud544\uc694\ud569\ub2c8\ub2e4. \uc571\uc5d0\uc11c \ub85c\uadf8\uc778\ud55c \ub4a4 \uc704\uc82f\uc744 \ub2e4\uc2dc \uc5f4\uc5b4\uc8fc\uc138\uc694."

    invoke-virtual {v1, v2}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    new-instance v1, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$G2vNVfyRFh8uzOaIRM_4bjaYoMQ;

    invoke-direct {v1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$G2vNVfyRFh8uzOaIRM_4bjaYoMQ;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string v2, "\ub2eb\uae30"

    invoke-virtual {p0, v2, v1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v1

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->addAction(Landroid/widget/Button;)V

    :cond_1
    return v0
.end method

.method dp(F)I
    .locals 1

    .line 32
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getResources()Landroid/content/res/Resources;

    move-result-object v0

    invoke-virtual {v0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v0

    iget v0, v0, Landroid/util/DisplayMetrics;->density:F

    mul-float/2addr p1, v0

    invoke-static {p1}, Ljava/lang/Math;->round(F)I

    move-result p1

    return p1
.end method

.method edit(Ljava/lang/String;Z)V
    .locals 5

    .line 52
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v0

    if-nez v0, :cond_0

    return-void

    :cond_0
    const/4 v0, 0x1

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v1}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    invoke-virtual {v1}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    const/4 v2, 0x0

    invoke-virtual {v1, v2}, Landroid/widget/LinearLayout;->setOrientation(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->heading:Landroid/widget/TextView;

    const-string v3, "\uc77c\uc815 \ucd94\uac00"

    invoke-virtual {v1, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->status:Landroid/widget/TextView;

    const-string v3, "\uac1c\uc778 \uc77c\uc815 \u00b7 \uae30\uae30\uc5d0 \uc800\uc7a5 \ud6c4 \uc571\uc5d0\uc11c \ub3d9\uae30\ud654"

    invoke-virtual {v1, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    const/high16 v3, 0x41500000    # 13.0f

    const-string v4, "\uc77c\uc815 \uc774\ub984"

    invoke-virtual {p0, v4, v3}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v3

    invoke-virtual {v1, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v1, Landroid/widget/EditText;

    invoke-direct {v1, p0}, Landroid/widget/EditText;-><init>(Landroid/content/Context;)V

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    invoke-virtual {v1, v2}, Landroid/widget/EditText;->setSingleLine(Z)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    const/4 v3, 0x2

    invoke-virtual {v1, v3}, Landroid/widget/EditText;->setMinLines(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    const/high16 v3, 0x41800000    # 16.0f

    invoke-virtual {v1, v3}, Landroid/widget/EditText;->setTextSize(F)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->ink()I

    move-result v3

    invoke-virtual {v1, v3}, Landroid/widget/EditText;->setTextColor(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    const/16 v3, 0x4001

    invoke-virtual {v1, v3}, Landroid/widget/EditText;->setInputType(I)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    new-array v0, v0, [Landroid/text/InputFilter;

    new-instance v3, Landroid/text/InputFilter$LengthFilter;

    const/16 v4, 0xb4

    invoke-direct {v3, v4}, Landroid/text/InputFilter$LengthFilter;-><init>(I)V

    aput-object v3, v0, v2

    invoke-virtual {v1, v0}, Landroid/widget/EditText;->setFilters([Landroid/text/InputFilter;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    const-string v1, "\uc5b4\ub5a4 \uc77c\uc815\uc778\uac00\uc694?"

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setHint(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    invoke-virtual {v0, p1}, Landroid/widget/EditText;->setText(Ljava/lang/CharSequence;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    new-instance v1, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v3, -0x1

    const/4 v4, -0x2

    invoke-direct {v1, v3, v4}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {p1, v0, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    .line 53
    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "\ub0a0\uc9dc  "

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    new-instance v0, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$B8XnZugjGr_S4xMLrOPF5vW6xdc;

    invoke-direct {v0, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$B8XnZugjGr_S4xMLrOPF5vW6xdc;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    invoke-virtual {p0, p1, v0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dateButton:Landroid/widget/Button;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v0, p1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance p1, Landroid/widget/CheckBox;

    invoke-direct {p1, p0}, Landroid/widget/CheckBox;-><init>(Landroid/content/Context;)V

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    const-string v0, "\uc885\uc77c"

    invoke-virtual {p1, v0}, Landroid/widget/CheckBox;->setText(Ljava/lang/CharSequence;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    const/high16 v0, 0x41700000    # 15.0f

    invoke-virtual {p1, v0}, Landroid/widget/CheckBox;->setTextSize(F)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->ink()I

    move-result v0

    invoke-virtual {p1, v0}, Landroid/widget/CheckBox;->setTextColor(I)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    invoke-virtual {p1, p2}, Landroid/widget/CheckBox;->setChecked(Z)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    invoke-virtual {p1, v0}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "\uc2dc\uc791 \uc2dc\uac04  "

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    new-instance v0, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$7mSrTbFOu2NFlVD1r8KpStd3-b4;

    invoke-direct {v0, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$7mSrTbFOu2NFlVD1r8KpStd3-b4;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    invoke-virtual {p0, p1, v0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->timeButton:Landroid/widget/Button;

    if-eqz p2, :cond_1

    const/16 v2, 0x8

    :cond_1
    invoke-virtual {p1, v2}, Landroid/widget/Button;->setVisibility(I)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->timeButton:Landroid/widget/Button;

    invoke-virtual {p1, p2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    new-instance p2, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$uq7Z8wZhtEbrpkDQYOGM3gJiyRM;

    invoke-direct {p2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$uq7Z8wZhtEbrpkDQYOGM3gJiyRM;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    invoke-virtual {p1, p2}, Landroid/widget/CheckBox;->setOnCheckedChangeListener(Landroid/widget/CompoundButton$OnCheckedChangeListener;)V

    new-instance p1, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$7m1DrARCjUxnL0sd_bwP1mGjSxg;

    invoke-direct {p1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$7m1DrARCjUxnL0sd_bwP1mGjSxg;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string p2, "\ucde8\uc18c"

    invoke-virtual {p0, p2, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p1

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->addAction(Landroid/widget/Button;)V

    new-instance p1, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$PHT5P-8sXAqbmIQFwebnOMbcvEk;

    invoke-direct {p1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$PHT5P-8sXAqbmIQFwebnOMbcvEk;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string p2, "\uae30\uae30\uc5d0 \uc800\uc7a5"

    invoke-virtual {p0, p2, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object p1

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->addAction(Landroid/widget/Button;)V

    return-void
.end method

.method hideKeyboard()V
    .locals 3

    .line 57
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getCurrentFocus()Landroid/view/View;

    move-result-object v0

    if-eqz v0, :cond_0

    const-string v1, "input_method"

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getSystemService(Ljava/lang/String;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/view/inputmethod/InputMethodManager;

    invoke-virtual {v0}, Landroid/view/View;->getWindowToken()Landroid/os/IBinder;

    move-result-object v0

    const/4 v2, 0x0

    invoke-virtual {v1, v0, v2}, Landroid/view/inputmethod/InputMethodManager;->hideSoftInputFromWindow(Landroid/os/IBinder;I)Z

    :cond_0
    return-void
.end method

.method ink()I
    .locals 2

    .line 33
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    const/4 v1, 0x4

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetThemeV190;->color(Ljava/lang/String;I)I

    move-result v0

    return v0
.end method

.method label(Ljava/lang/String;F)Landroid/widget/TextView;
    .locals 2

    .line 34
    new-instance v0, Landroid/widget/TextView;

    invoke-direct {v0, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    invoke-virtual {v0, p2}, Landroid/widget/TextView;->setTextSize(F)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->ink()I

    move-result p1

    invoke-virtual {v0, p1}, Landroid/widget/TextView;->setTextColor(I)V

    const/high16 p1, 0x40a00000    # 5.0f

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result p2

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result p1

    const/4 v1, 0x0

    invoke-virtual {v0, v1, p2, v1, p1}, Landroid/widget/TextView;->setPadding(IIII)V

    return-object v0
.end method

.method public synthetic lambda$0$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 38
    const-string p1, "todo"

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->quickAdd(Ljava/lang/String;)V

    return-void
.end method

.method public synthetic lambda$1$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 38
    const-string p1, "memo"

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->quickAdd(Ljava/lang/String;)V

    return-void
.end method

.method public synthetic lambda$10$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 53
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->save()V

    return-void
.end method

.method public synthetic lambda$11$WidgetDayActivityV195(Landroid/widget/DatePicker;III)V
    .locals 2

    .line 54
    sget-object p1, Ljava/util/Locale;->US:Ljava/util/Locale;

    const/4 v0, 0x3

    new-array v0, v0, [Ljava/lang/Object;

    invoke-static {p2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p2

    const/4 v1, 0x0

    aput-object p2, v0, v1

    const/4 p2, 0x1

    add-int/2addr p3, p2

    invoke-static {p3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p3

    aput-object p3, v0, p2

    invoke-static {p4}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p2

    const/4 p3, 0x2

    aput-object p2, v0, p3

    const-string p2, "%04d-%02d-%02d"

    invoke-static {p1, p2, v0}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dateButton:Landroid/widget/Button;

    new-instance p2, Ljava/lang/StringBuilder;

    const-string p3, "\ub0a0\uc9dc  "

    invoke-direct {p2, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object p3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    return-void
.end method

.method public synthetic lambda$12$WidgetDayActivityV195(Landroid/widget/TimePicker;II)V
    .locals 2

    .line 55
    sget-object p1, Ljava/util/Locale;->US:Ljava/util/Locale;

    const/4 v0, 0x2

    new-array v0, v0, [Ljava/lang/Object;

    invoke-static {p2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p2

    const/4 v1, 0x0

    aput-object p2, v0, v1

    invoke-static {p3}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object p2

    const/4 p3, 0x1

    aput-object p2, v0, p3

    const-string p2, "%02d:%02d"

    invoke-static {p1, p2, v0}, Ljava/lang/String;->format(Ljava/util/Locale;Ljava/lang/String;[Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->timeButton:Landroid/widget/Button;

    new-instance p2, Ljava/lang/StringBuilder;

    const-string p3, "\uc2dc\uc791 \uc2dc\uac04  "

    invoke-direct {p2, p3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object p3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    invoke-virtual {p2, p3}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p2

    invoke-virtual {p2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, p2}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V

    return-void
.end method

.method public synthetic lambda$2$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 38
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->finish()V

    return-void
.end method

.method public synthetic lambda$3$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 1

    .line 38
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    const-string p1, "09:00"

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    const-string p1, ""

    const/4 v0, 0x1

    invoke-virtual {p0, p1, v0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->edit(Ljava/lang/String;Z)V

    return-void
.end method

.method public synthetic lambda$4$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 43
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->finish()V

    return-void
.end method

.method public synthetic lambda$5$WidgetDayActivityV195()V
    .locals 1

    .line 46
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    if-nez v0, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->list()V

    :cond_0
    return-void
.end method

.method public synthetic lambda$6$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 53
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->pickDate()V

    return-void
.end method

.method public synthetic lambda$7$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 53
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->pickTime()V

    return-void
.end method

.method public synthetic lambda$8$WidgetDayActivityV195(Landroid/widget/CompoundButton;Z)V
    .locals 0

    .line 53
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->timeButton:Landroid/widget/Button;

    if-eqz p2, :cond_0

    const/16 p2, 0x8

    goto :goto_0

    :cond_0
    const/4 p2, 0x0

    :goto_0
    invoke-virtual {p1, p2}, Landroid/widget/Button;->setVisibility(I)V

    return-void
.end method

.method public synthetic lambda$9$WidgetDayActivityV195(Landroid/view/View;)V
    .locals 0

    .line 53
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->hideKeyboard()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->list()V

    return-void
.end method

.method list()V
    .locals 15

    .line 48
    const-string v0, "endDate"

    const-string v1, "date"

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v2

    if-nez v2, :cond_0

    return-void

    :cond_0
    const/4 v2, 0x0

    iput-boolean v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v3}, Landroid/widget/LinearLayout;->removeAllViews()V

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    invoke-virtual {v3}, Landroid/widget/LinearLayout;->removeAllViews()V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v3

    const-string v4, "holidays"

    invoke-virtual {v3, v4}, Lorg/json/JSONObject;->optJSONObject(Ljava/lang/String;)Lorg/json/JSONObject;

    move-result-object v4

    const-string v5, ""

    if-nez v4, :cond_1

    move-object v4, v5

    goto :goto_0

    :cond_1
    iget-object v6, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    invoke-virtual {v4, v6}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    :goto_0
    iget-object v6, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->heading:Landroid/widget/TextView;

    new-instance v7, Ljava/lang/StringBuilder;

    iget-object v8, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    invoke-static {v8}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v8

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v8, " \uc77c\uc815"

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v7}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v6, v7}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    const-string v6, "scheduleItems"

    invoke-virtual {v3, v6}, Lorg/json/JSONObject;->optJSONArray(Ljava/lang/String;)Lorg/json/JSONArray;

    move-result-object v3

    iget-object v6, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    invoke-static {v3, v6}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->scheduleRows(Lorg/json/JSONArray;Ljava/lang/String;)Ljava/util/List;

    move-result-object v3

    iget-object v6, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->status:Landroid/widget/TextView;

    new-instance v7, Ljava/lang/StringBuilder;

    invoke-interface {v3}, Ljava/util/List;->size()I

    move-result v8

    invoke-static {v8}, Ljava/lang/String;->valueOf(I)Ljava/lang/String;

    move-result-object v8

    invoke-direct {v7, v8}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v8, "\uac1c \uc77c\uc815"

    invoke-virtual {v7, v8}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v7

    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v8

    const-string v9, " \u00b7 "

    if-eqz v8, :cond_2

    goto :goto_1

    :cond_2
    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5, v9}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v5, v4}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    :goto_1
    invoke-virtual {v7, v5}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v5

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v5

    invoke-virtual {v6, v5}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    .line 49
    invoke-virtual {v4}, Ljava/lang/String;->isEmpty()Z

    move-result v5

    const/4 v6, 0x0

    const/high16 v7, 0x41800000    # 16.0f

    const/4 v8, 0x1

    if-nez v5, :cond_3

    invoke-virtual {p0, v4, v7}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v4

    const v5, -0x559f89

    invoke-virtual {v4, v5}, Landroid/widget/TextView;->setTextColor(I)V

    invoke-virtual {v4, v6, v8}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v5, v4}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    :cond_3
    invoke-interface {v3}, Ljava/util/List;->isEmpty()Z

    move-result v4

    if-eqz v4, :cond_4

    iget-object v4, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    const/high16 v5, 0x41700000    # 15.0f

    const-string v10, "\uc544\uc9c1 \uc77c\uc815\uc774 \uc5c6\uc5b4\uc694. \uc774 \ub0a0\uc9dc\uc5d0 \uc77c\uc815\uc744 \ucd94\uac00\ud560 \uc218 \uc788\uc5b4\uc694."

    invoke-virtual {p0, v10, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v5

    invoke-virtual {v4, v5}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    .line 50
    :cond_4
    invoke-interface {v3}, Ljava/util/List;->iterator()Ljava/util/Iterator;

    move-result-object v3

    :goto_2
    invoke-interface {v3}, Ljava/util/Iterator;->hasNext()Z

    move-result v4

    const/high16 v5, 0x41400000    # 12.0f

    if-nez v4, :cond_6

    .line 51
    if-eqz v2, :cond_5

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    const-string v1, "\ucd94\uac00\ud55c \uc77c\uc815\uc740 \uc774 \uae30\uae30\uc5d0 \ubcf4\uad00\ub429\ub2c8\ub2e4. \uc571\uc744 \uc5f4\uba74 \ud604\uc7ac \uacc4\uc815\uc73c\ub85c \ub3d9\uae30\ud654\ud569\ub2c8\ub2e4."

    invoke-virtual {p0, v1, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    :cond_5
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->listActions()V

    return-void

    .line 50
    :cond_6
    invoke-interface {v3}, Ljava/util/Iterator;->next()Ljava/lang/Object;

    move-result-object v4

    check-cast v4, Ljava/lang/String;

    :try_start_0
    new-instance v10, Lorg/json/JSONObject;

    invoke-direct {v10, v4}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    new-instance v4, Landroid/widget/LinearLayout;

    invoke-direct {v4, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    invoke-virtual {v4, v8}, Landroid/widget/LinearLayout;->setOrientation(I)V

    invoke-virtual {p0, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v11

    const/high16 v12, 0x41100000    # 9.0f

    invoke-virtual {p0, v12}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v13

    invoke-virtual {p0, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v14

    invoke-virtual {p0, v12}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v12

    invoke-virtual {v4, v11, v13, v14, v12}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    new-instance v11, Landroid/graphics/drawable/GradientDrawable;

    invoke-direct {v11}, Landroid/graphics/drawable/GradientDrawable;-><init>()V

    invoke-static {v10}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->dayCardColor(Lorg/json/JSONObject;)I

    move-result v12

    invoke-virtual {v11, v12}, Landroid/graphics/drawable/GradientDrawable;->setColor(I)V

    const/high16 v12, 0x3f800000    # 1.0f

    invoke-virtual {p0, v12}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v12

    invoke-static {v10}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventColor(Lorg/json/JSONObject;)I

    move-result v13

    invoke-virtual {v11, v12, v13}, Landroid/graphics/drawable/GradientDrawable;->setStroke(II)V

    invoke-virtual {p0, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v12

    int-to-float v12, v12

    invoke-virtual {v11, v12}, Landroid/graphics/drawable/GradientDrawable;->setCornerRadius(F)V

    invoke-virtual {v4, v11}, Landroid/widget/LinearLayout;->setBackground(Landroid/graphics/drawable/Drawable;)V

    new-instance v11, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v12, -0x1

    const/4 v13, -0x2

    invoke-direct {v11, v12, v13}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    const/high16 v12, 0x41000000    # 8.0f

    invoke-virtual {p0, v12}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v12

    iput v12, v11, Landroid/widget/LinearLayout$LayoutParams;->bottomMargin:I

    iget-object v12, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->content:Landroid/widget/LinearLayout;

    invoke-virtual {v12, v4, v11}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    invoke-static {v10}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->eventTimeLabel(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v11

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v10, v0, v13}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v13

    invoke-virtual {v12, v13}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v12

    if-nez v12, :cond_7

    new-instance v12, Ljava/lang/StringBuilder;

    invoke-static {v11}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v11

    invoke-direct {v12, v11}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v12, v9}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v10, v1}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    const-string v12, " ~ "

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v10, v0}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v12

    invoke-virtual {v11, v12}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object v11

    invoke-virtual {v11}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v11

    :cond_7
    invoke-virtual {p0, v11, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v11

    iget-object v12, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    invoke-static {v12}, Lcom/aiderlog/v22app/WidgetThemeV190;->muted(Ljava/lang/String;)I

    move-result v12

    invoke-virtual {v11, v12}, Landroid/widget/TextView;->setTextColor(I)V

    invoke-virtual {v4, v11}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    const-string v11, "title"

    invoke-virtual {v10, v11}, Lorg/json/JSONObject;->optString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v11

    invoke-virtual {p0, v11, v7}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v11

    invoke-virtual {v11, v6, v8}, Landroid/widget/TextView;->setTypeface(Landroid/graphics/Typeface;I)V

    invoke-virtual {v4, v11}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    const-string v11, "_widgetPendingV195"

    invoke-virtual {v10, v11}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v11
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    if-eqz v11, :cond_8

    :try_start_1
    const-string v2, "\uae30\uae30 \uc800\uc7a5\ub428 \u00b7 \uc571\uc744 \uc5f4\uba74 \ub3d9\uae30\ud654"

    invoke-virtual {p0, v2, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v2

    invoke-virtual {v4, v2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    move v2, v8

    goto/16 :goto_2

    :catch_0
    move-exception v2

    move v2, v8

    goto :goto_3

    :cond_8
    :try_start_2
    const-string v11, "readOnly"

    invoke-virtual {v10, v11}, Lorg/json/JSONObject;->optBoolean(Ljava/lang/String;)Z

    move-result v10

    if-eqz v10, :cond_9

    const-string v10, "\uacf5\uc720\ubc1b\uc740 \uc77c\uc815"

    invoke-virtual {p0, v10, v5}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->label(Ljava/lang/String;F)Landroid/widget/TextView;

    move-result-object v5

    invoke-virtual {v4, v5}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_1

    goto :goto_3

    :catch_1
    move-exception v4

    :cond_9
    :goto_3
    goto/16 :goto_2
.end method

.method listActions()V
    .locals 9

    .line 38
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    const/4 v1, 0x1

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V

    new-instance v0, Landroid/widget/LinearLayout;

    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V

    new-instance v2, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$qoCOOTAbGIAIBIOTenDOr_fLTfM;

    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$qoCOOTAbGIAIBIOTenDOr_fLTfM;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string v3, "+ \ud22c\ub450"

    invoke-virtual {p0, v3, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v2

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v4, 0x42300000    # 44.0f

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v5

    const/high16 v6, 0x3f800000    # 1.0f

    invoke-direct {v3, v1, v5, v6}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v0, v2, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v2, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$uENqqBokKrH3u-vt9wg6ryXP4Ag;

    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$uENqqBokKrH3u-vt9wg6ryXP4Ag;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string v3, "+ \uba54\ubaa8"

    invoke-virtual {p0, v3, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v2

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    invoke-virtual {p0, v4}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v4

    invoke-direct {v3, v1, v4, v6}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v0, v2, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    const/4 v4, -0x1

    const/4 v5, -0x2

    invoke-direct {v3, v4, v5}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {v2, v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v0, Landroid/widget/LinearLayout;

    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V

    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V

    new-instance v2, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$shS_rvDfuJZwSL7unGsOBdj6jQI;

    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$shS_rvDfuJZwSL7unGsOBdj6jQI;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string v3, "\ub2eb\uae30"

    invoke-virtual {p0, v3, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v2

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    const/high16 v7, 0x42400000    # 48.0f

    invoke-virtual {p0, v7}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v8

    invoke-direct {v3, v1, v8, v6}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v0, v2, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    new-instance v2, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$xPgWokTgPRqTME0PHDdhC5xvNX4;

    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$xPgWokTgPRqTME0PHDdhC5xvNX4;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const-string v3, "+ \uc77c\uc815 \ucd94\uac00"

    invoke-virtual {p0, v3, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->button(Ljava/lang/String;Landroid/view/View$OnClickListener;)Landroid/widget/Button;

    move-result-object v2

    new-instance v3, Landroid/widget/LinearLayout$LayoutParams;

    invoke-virtual {p0, v7}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v7

    invoke-direct {v3, v1, v7, v6}, Landroid/widget/LinearLayout$LayoutParams;-><init>(IIF)V

    invoke-virtual {v0, v2, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->footer:Landroid/widget/LinearLayout;

    new-instance v2, Landroid/widget/LinearLayout$LayoutParams;

    invoke-direct {v2, v4, v5}, Landroid/widget/LinearLayout$LayoutParams;-><init>(II)V

    invoke-virtual {v1, v0, v2}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;Landroid/view/ViewGroup$LayoutParams;)V

    return-void
.end method

.method public onBackPressed()V
    .locals 1

    .line 58
    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    if-eqz v0, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->hideKeyboard()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->list()V

    goto :goto_0

    :cond_0
    invoke-super {p0}, Landroid/app/Activity;->onBackPressed()V

    :goto_0
    return-void
.end method

.method public onCreate(Landroid/os/Bundle;)V
    .locals 5

    .line 39
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    const/4 v0, 0x1

    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->requestWindowFeature(I)Z

    const/4 v1, 0x0

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->setFinishOnTouchOutside(Z)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getIntent()Landroid/content/Intent;

    move-result-object v2

    const-string v3, "uid"

    invoke-virtual {v2, v3}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    iput-object v4, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    const-string v4, "date"

    invoke-virtual {v2, v4}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v4

    iput-object v4, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    const-string v4, "appWidgetId"

    invoke-virtual {v2, v4, v1}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    move-result v1

    iput v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->widget:I

    const-string v1, "kind"

    invoke-virtual {v2, v1}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    if-eqz v1, :cond_0

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->supports(Ljava/lang/String;)Z

    move-result v2

    if-eqz v2, :cond_0

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetDesignV165;->base(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->sourceKind:Ljava/lang/String;

    :cond_0
    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetCalendarV195;->validDate(Ljava/lang/String;)Z

    move-result v1

    if-nez v1, :cond_1

    invoke-static {}, Ljava/util/Calendar;->getInstance()Ljava/util/Calendar;

    move-result-object v1

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->day(Ljava/util/Calendar;)Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    :cond_1
    iget v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->widget:I

    invoke-static {p0, v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->theme(Landroid/content/Context;I)Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->chosen:Ljava/lang/String;

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->build()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v1

    if-nez v1, :cond_2

    return-void

    :cond_2
    if-eqz p1, :cond_3

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    invoke-virtual {p1, v3}, Landroid/os/Bundle;->getString(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :cond_3

    const-string v1, "editing"

    invoke-virtual {p1, v1}, Landroid/os/Bundle;->getBoolean(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_3

    iput-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    const-string v2, "draftDate"

    invoke-virtual {p1, v2, v1}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    const-string v1, "draftTime"

    const-string v2, "09:00"

    invoke-virtual {p1, v1, v2}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    const-string v1, "title"

    const-string v2, ""

    invoke-virtual {p1, v1, v2}, Landroid/os/Bundle;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    const-string v2, "allDay"

    invoke-virtual {p1, v2, v0}, Landroid/os/Bundle;->getBoolean(Ljava/lang/String;Z)Z

    move-result p1

    invoke-virtual {p0, v1, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->edit(Ljava/lang/String;Z)V

    goto :goto_0

    :cond_3
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->list()V

    :goto_0
    return-void
.end method

.method public onPause()V
    .locals 1

    .line 45
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0, p0}, Landroid/content/SharedPreferences;->unregisterOnSharedPreferenceChangeListener(Landroid/content/SharedPreferences$OnSharedPreferenceChangeListener;)V

    invoke-super {p0}, Landroid/app/Activity;->onPause()V

    return-void
.end method

.method public onResume()V
    .locals 1

    .line 44
    invoke-super {p0}, Landroid/app/Activity;->onResume()V

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->prefs(Landroid/content/Context;)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0, p0}, Landroid/content/SharedPreferences;->registerOnSharedPreferenceChangeListener(Landroid/content/SharedPreferences$OnSharedPreferenceChangeListener;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    if-nez v0, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->list()V

    :cond_0
    return-void
.end method

.method protected onSaveInstanceState(Landroid/os/Bundle;)V
    .locals 2

    .line 47
    invoke-super {p0, p1}, Landroid/app/Activity;->onSaveInstanceState(Landroid/os/Bundle;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    const-string v1, "uid"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    const-string v1, "editing"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-interface {v0}, Landroid/text/Editable;->toString()Ljava/lang/String;

    move-result-object v0

    const-string v1, "title"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    invoke-virtual {v0}, Landroid/widget/CheckBox;->isChecked()Z

    move-result v0

    const-string v1, "allDay"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putBoolean(Ljava/lang/String;Z)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    const-string v1, "draftDate"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    const-string v1, "draftTime"

    invoke-virtual {p1, v1, v0}, Landroid/os/Bundle;->putString(Ljava/lang/String;Ljava/lang/String;)V

    :cond_0
    return-void
.end method

.method public onSharedPreferenceChanged(Landroid/content/SharedPreferences;Ljava/lang/String;)V
    .locals 1

    .line 46
    const-string p1, "widget_snapshot"

    invoke-virtual {p1, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-nez p1, :cond_0

    new-instance p1, Ljava/lang/StringBuilder;

    const-string v0, "widget_calendar_pending_v195:"

    invoke-direct {p1, v0}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    invoke-virtual {p1, v0}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1, p2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p1

    if-eqz p1, :cond_1

    :cond_0
    new-instance p1, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$rzm2m8uPlrK-7T0lik7gcWesoko;

    invoke-direct {p1, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$rzm2m8uPlrK-7T0lik7gcWesoko;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->runOnUiThread(Ljava/lang/Runnable;)V

    :cond_1
    return-void
.end method

.method pickDate()V
    .locals 8

    .line 54
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v0

    new-instance v7, Landroid/app/DatePickerDialog;

    new-instance v3, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$d310z-eN3Ku4WYDRWnIuFNh0VhQ;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$d310z-eN3Ku4WYDRWnIuFNh0VhQ;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

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

    invoke-virtual {v7}, Landroid/app/DatePickerDialog;->getDatePicker()Landroid/widget/DatePicker;

    move-result-object v0

    const-string v1, "2000-01-01"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v1

    invoke-virtual {v1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v1

    invoke-virtual {v0, v1, v2}, Landroid/widget/DatePicker;->setMinDate(J)V

    invoke-virtual {v7}, Landroid/app/DatePickerDialog;->getDatePicker()Landroid/widget/DatePicker;

    move-result-object v0

    const-string v1, "2199-12-31"

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->date(Ljava/lang/String;)Ljava/util/Calendar;

    move-result-object v1

    invoke-virtual {v1}, Ljava/util/Calendar;->getTimeInMillis()J

    move-result-wide v1

    invoke-virtual {v0, v1, v2}, Landroid/widget/DatePicker;->setMaxDate(J)V

    invoke-virtual {v7}, Landroid/app/DatePickerDialog;->show()V

    return-void
.end method

.method pickTime()V
    .locals 8

    .line 55
    const/4 v0, 0x0

    :try_start_0
    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    const/4 v2, 0x2

    invoke-virtual {v1, v0, v2}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v1

    invoke-static {v1}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v1
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    :try_start_1
    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    const/4 v3, 0x3

    invoke-virtual {v2, v3}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v2

    invoke-static {v2}, Ljava/lang/Integer;->parseInt(Ljava/lang/String;)I

    move-result v0
    :try_end_1
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_0

    goto :goto_0

    :catch_0
    move-exception v2

    goto :goto_0

    :catch_1
    move-exception v1

    const/16 v1, 0x9

    :goto_0
    move v6, v0

    move v5, v1

    new-instance v0, Landroid/app/TimePickerDialog;

    new-instance v4, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$wnlXPFTH7H1keF_szlCFLGqJoVM;

    invoke-direct {v4, p0}, Lcom/aiderlog/v22app/-$$Lambda$WidgetDayActivityV195$wnlXPFTH7H1keF_szlCFLGqJoVM;-><init>(Lcom/aiderlog/v22app/WidgetDayActivityV195;)V

    const/4 v7, 0x1

    move-object v2, v0

    move-object v3, p0

    invoke-direct/range {v2 .. v7}, Landroid/app/TimePickerDialog;-><init>(Landroid/content/Context;Landroid/app/TimePickerDialog$OnTimeSetListener;IIZ)V

    invoke-virtual {v0}, Landroid/app/TimePickerDialog;->show()V

    return-void
.end method

.method quickAdd(Ljava/lang/String;)V
    .locals 7

    .line 37
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v0

    if-eqz v0, :cond_0

    iget v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->widget:I

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->sourceKind:Ljava/lang/String;

    iget-object v4, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    iget-object v6, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    move-object v1, p0

    move-object v5, p1

    invoke-static/range {v1 .. v6}, Lcom/aiderlog/v22app/WidgetNoteActivityV196;->intent(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;

    move-result-object p1

    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->startActivity(Landroid/content/Intent;)V

    :cond_0
    return-void
.end method

.method resize()V
    .locals 4

    .line 42
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getWindow()Landroid/view/Window;

    move-result-object v0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getResources()Landroid/content/res/Resources;

    move-result-object v1

    invoke-virtual {v1}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v1

    iget v1, v1, Landroid/util/DisplayMetrics;->widthPixels:I

    const/high16 v2, 0x41c00000    # 24.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v2

    sub-int/2addr v1, v2

    const/high16 v2, 0x44070000    # 540.0f

    invoke-virtual {p0, v2}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v2

    invoke-static {v1, v2}, Ljava/lang/Math;->min(II)I

    move-result v1

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->getResources()Landroid/content/res/Resources;

    move-result-object v2

    invoke-virtual {v2}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object v2

    iget v2, v2, Landroid/util/DisplayMetrics;->heightPixels:I

    const/high16 v3, 0x42800000    # 64.0f

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v3

    sub-int/2addr v2, v3

    const/high16 v3, 0x441b0000    # 620.0f

    invoke-virtual {p0, v3}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->dp(F)I

    move-result v3

    invoke-static {v2, v3}, Ljava/lang/Math;->min(II)I

    move-result v2

    invoke-virtual {v0, v1, v2}, Landroid/view/Window;->setLayout(II)V

    return-void
.end method

.method save()V
    .locals 4

    .line 56
    iget-boolean v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->editing:Z

    if-eqz v0, :cond_4

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->current()Z

    move-result v0

    if-nez v0, :cond_0

    goto/16 :goto_2

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;

    move-result-object v0

    invoke-interface {v0}, Landroid/text/Editable;->toString()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v0

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-eqz v1, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    const-string v1, "\uc77c\uc815 \uc774\ub984\uc744 \uc785\ub825\ud574\uc8fc\uc138\uc694."

    invoke-virtual {v0, v1}, Landroid/widget/EditText;->setError(Ljava/lang/CharSequence;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->title:Landroid/widget/EditText;

    invoke-virtual {v0}, Landroid/widget/EditText;->requestFocus()Z

    return-void

    :cond_1
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1}, Lorg/json/JSONObject;-><init>()V

    const/16 v2, 0xc3

    invoke-static {v2}, Ljava/lang/Integer;->valueOf(I)Ljava/lang/Integer;

    move-result-object v2

    const-string v3, "schema"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v2, "op"

    const-string v3, "add-schedule"

    invoke-static {v1, v2, v3}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    const-string v3, "uid"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    new-instance v2, Ljava/lang/StringBuilder;

    const-string v3, "widget-calendar-"

    invoke-direct {v2, v3}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-static {}, Ljava/util/UUID;->randomUUID()Ljava/util/UUID;

    move-result-object v3

    invoke-virtual {v2, v3}, Ljava/lang/StringBuilder;->append(Ljava/lang/Object;)Ljava/lang/StringBuilder;

    move-result-object v2

    invoke-virtual {v2}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "id"

    invoke-static {v1, v3, v2}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    const-string v2, "title"

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    const-string v2, "date"

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    const-string v2, "endDate"

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    invoke-virtual {v0}, Landroid/widget/CheckBox;->isChecked()Z

    move-result v0

    if-eqz v0, :cond_2

    const-string v0, ""

    goto :goto_0

    :cond_2
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftTime:Ljava/lang/String;

    :goto_0
    const-string v2, "time"

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->allDay:Landroid/widget/CheckBox;

    invoke-virtual {v0}, Landroid/widget/CheckBox;->isChecked()Z

    move-result v0

    invoke-static {v0}, Ljava/lang/Boolean;->valueOf(Z)Ljava/lang/Boolean;

    move-result-object v0

    const-string v2, "allDay"

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    invoke-static {}, Ljava/lang/System;->currentTimeMillis()J

    move-result-wide v2

    invoke-static {v2, v3}, Ljava/lang/Long;->valueOf(J)Ljava/lang/Long;

    move-result-object v0

    const-string v2, "createdAt"

    invoke-static {v1, v2, v0}, Lcom/aiderlog/v22app/WidgetDesignV165;->put(Lorg/json/JSONObject;Ljava/lang/String;Ljava/lang/Object;)Lorg/json/JSONObject;

    :try_start_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->uid:Ljava/lang/String;

    invoke-static {p0, v0, v1}, Lcom/aiderlog/v22app/WidgetCalendarV195;->enqueue(Landroid/content/Context;Ljava/lang/String;Lorg/json/JSONObject;)V

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->draftDate:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->date:Ljava/lang/String;

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->hideKeyboard()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetDayActivityV195;->list()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_2

    :catch_0
    move-exception v0

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDayActivityV195;->status:Landroid/widget/TextView;

    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v2

    if-nez v2, :cond_3

    const-string v0, "\uc800\uc7a5\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \uc785\ub825\uc744 \uc720\uc9c0\ud588\uc2b5\ub2c8\ub2e4."

    goto :goto_1

    :cond_3
    invoke-virtual {v0}, Ljava/lang/Exception;->getMessage()Ljava/lang/String;

    move-result-object v0

    :goto_1
    invoke-virtual {v1, v0}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V

    :cond_4
    :goto_2
    return-void
.end method
