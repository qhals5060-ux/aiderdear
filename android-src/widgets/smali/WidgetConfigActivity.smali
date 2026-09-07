.class public Lcom/aiderlog/v22app/WidgetConfigActivity;
.super Landroid/app/Activity;
.source "WidgetConfigActivity.java"


# instance fields
.field private appWidgetId:I

.field private providerClass:Ljava/lang/String;

.field private selectedContent:Ljava/lang/String;

.field private selectedFont:I

.field private selectedOpacity:I

.field private selectedTheme:Ljava/lang/String;


# direct methods
.method public constructor <init>()V
    .locals 1

    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    const-string v0, "aurora"

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedTheme:Ljava/lang/String;

    const-string v0, "\uc804\uccb4 \ub0b4\uc6a9"

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedContent:Ljava/lang/String;

    const/16 v0, 0x64

    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedOpacity:I

    const/4 v0, 0x3

    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedFont:I

    return-void
.end method

.method private contentChoices()[Ljava/lang/CharSequence;
    .locals 5

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->providerClass:Ljava/lang/String;

    const-string v1, "RoutineLanguage"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_0

    const/4 v1, 0x2

    new-array v1, v1, [Ljava/lang/CharSequence;

    const-string v2, "\uc601\uc5b4"

    const/4 v3, 0x0

    aput-object v2, v1, v3

    const-string v2, "\uc77c\ubcf8\uc5b4"

    const/4 v3, 0x1

    aput-object v2, v1, v3

    return-object v1

    :cond_0
    const-string v1, "Routine"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_1

    const/4 v1, 0x5

    new-array v1, v1, [Ljava/lang/CharSequence;

    const-string v2, "\uc804\uccb4 \ub8e8\ud2f4"

    const/4 v3, 0x0

    aput-object v2, v1, v3

    const-string v2, "Morning Reset"

    const/4 v3, 0x1

    aput-object v2, v1, v3

    const-string v2, "\uc6b4\ub3d9 30\ubd84"

    const/4 v3, 0x2

    aput-object v2, v1, v3

    const-string v2, "\uc601\uc5b4 \uacf5\ubd80"

    const/4 v3, 0x3

    aput-object v2, v1, v3

    const-string v2, "\uc601\uc591\uc81c"

    const/4 v3, 0x4

    aput-object v2, v1, v3

    return-object v1

    :cond_1
    const-string v1, "PersonalMeal"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_2

    const/4 v1, 0x5

    new-array v1, v1, [Ljava/lang/CharSequence;

    const-string v2, "\uc624\ub298\uc758 \uc804\uccb4 \uc2dd\uc0ac"

    const/4 v3, 0x0

    aput-object v2, v1, v3

    const-string v2, "\uc544\uce68"

    const/4 v3, 0x1

    aput-object v2, v1, v3

    const-string v2, "\uc810\uc2ec"

    const/4 v3, 0x2

    aput-object v2, v1, v3

    const-string v2, "\uc800\ub141"

    const/4 v3, 0x3

    aput-object v2, v1, v3

    const-string v2, "\uac04\uc2dd"

    const/4 v3, 0x4

    aput-object v2, v1, v3

    return-object v1

    :cond_2
    const-string v1, "PersonalWorkout"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_3

    const/4 v1, 0x5

    new-array v1, v1, [Ljava/lang/CharSequence;

    const-string v2, "\uc804\uccb4 \uc6b4\ub3d9"

    const/4 v3, 0x0

    aput-object v2, v1, v3

    const-string v2, "\uadfc\ub825 \uc6b4\ub3d9"

    const/4 v3, 0x1

    aput-object v2, v1, v3

    const-string v2, "\uc720\uc0b0\uc18c \uc6b4\ub3d9"

    const/4 v3, 0x2

    aput-object v2, v1, v3

    const-string v2, "7\uc77c \ucf54\uc5b4 \ucc4c\ub9b0\uc9c0"

    const/4 v3, 0x3

    aput-object v2, v1, v3

    const-string v2, "\ucd5c\uadfc 4\uc8fc"

    const/4 v3, 0x4

    aput-object v2, v1, v3

    return-object v1

    :cond_3
    const-string v1, "PersonalToday"

    invoke-virtual {v0, v1}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v1

    if-eqz v1, :cond_4

    const/4 v1, 0x4

    new-array v1, v1, [Ljava/lang/CharSequence;

    const-string v2, "\uc804\uccb4 \uc694\uc57d"

    const/4 v3, 0x0

    aput-object v2, v1, v3

    const-string v2, "\uc77c\uc815"

    const/4 v3, 0x1

    aput-object v2, v1, v3

    const-string v2, "\ub8e8\ud2f4"

    const/4 v3, 0x2

    aput-object v2, v1, v3

    const-string v2, "\ud560 \uc77c"

    const/4 v3, 0x3

    aput-object v2, v1, v3

    return-object v1

    :cond_4
    const/4 v1, 0x4

    new-array v1, v1, [Ljava/lang/CharSequence;

    const-string v2, "\uc804\uccb4 \ub0b4\uc6a9"

    const/4 v3, 0x0

    aput-object v2, v1, v3

    const-string v2, "\uc624\ub298"

    const/4 v3, 0x1

    aput-object v2, v1, v3

    const-string v2, "\uc774\ubc88 \uc8fc"

    const/4 v3, 0x2

    aput-object v2, v1, v3

    const-string v2, "\uc990\uaca8\ucc3e\uae30"

    const/4 v3, 0x3

    aput-object v2, v1, v3

    return-object v1
.end method

.method private loadSavedAppearanceV150()V
    .locals 4

    const-string v0, "aiderlog_native"
    const/4 v1, 0x0
    invoke-virtual {p0, v0, v1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;
    const-string v2, "widget_theme_"
    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V
    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedTheme:Ljava/lang/String;
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedTheme:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;
    const-string v2, "widget_content_"
    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V
    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedContent:Ljava/lang/String;
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v1
    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedContent:Ljava/lang/String;

    new-instance v1, Ljava/lang/StringBuilder;
    const-string v2, "widget_opacity_"
    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V
    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedOpacity:I
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v1
    iput v1, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedOpacity:I

    new-instance v1, Ljava/lang/StringBuilder;
    const-string v2, "widget_font_"
    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V
    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v1
    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedFont:I
    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences;->getInt(Ljava/lang/String;I)I
    move-result v1
    iput v1, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedFont:I

    return-void
.end method

.method private finishWidgetInternalV143()V
    .locals 7

    const-string v0, "aiderlog_native"

    const/4 v1, 0x0

    invoke-virtual {p0, v0, v1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_theme_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedTheme:Ljava/lang/String;

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_content_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedContent:Ljava/lang/String;

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_opacity_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedOpacity:I

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "widget_font_"

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedFont:I

    invoke-interface {v0, v1, v2}, Landroid/content/SharedPreferences$Editor;->putInt(Ljava/lang/String;I)Landroid/content/SharedPreferences$Editor;

    move-result-object v0

    invoke-interface {v0}, Landroid/content/SharedPreferences$Editor;->apply()V

    invoke-static {p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v3

    iget v4, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    iget-object v5, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->providerClass:Ljava/lang/String;

    invoke-static {p0, v3, v4, v5}, Lcom/aiderlog/v22app/WidgetProvider;->safeUpdateWidget(Landroid/content/Context;Landroid/appwidget/AppWidgetManager;ILjava/lang/String;)V

    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    const-string v1, "appWidgetId"

    iget v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    const/4 v1, -0x1

    invoke-virtual {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->setResult(ILandroid/content/Intent;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V

    return-void
.end method

.method private onCreateInternalV143(Landroid/os/Bundle;)V
    .locals 12

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    new-instance v0, Landroid/content/Intent;

    invoke-direct {v0}, Landroid/content/Intent;-><init>()V

    const/4 v1, 0x0

    invoke-virtual {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->setResult(ILandroid/content/Intent;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getIntent()Landroid/content/Intent;

    move-result-object v2

    const-string v3, "appWidgetId"

    invoke-virtual {v2, v3, v1}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    move-result v2

    iput v2, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    if-nez v2, :cond_0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V

    return-void

    :cond_0
    invoke-static {p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v4

    invoke-virtual {v4, v2}, Landroid/appwidget/AppWidgetManager;->getAppWidgetInfo(I)Landroid/appwidget/AppWidgetProviderInfo;

    move-result-object v5

    const-string v6, ""

    if-eqz v5, :cond_1

    iget-object v5, v5, Landroid/appwidget/AppWidgetProviderInfo;->provider:Landroid/content/ComponentName;

    if-eqz v5, :cond_1

    invoke-virtual {v5}, Landroid/content/ComponentName;->getClassName()Ljava/lang/String;

    move-result-object v6

    :cond_1
    iput-object v6, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->providerClass:Ljava/lang/String;

    const-string v5, "$Task"

    invoke-virtual {v6, v5}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v5

    if-eqz v5, :cond_2

    const-string v5, "aiderlog_native"

    invoke-virtual {p0, v5, v1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v5

    const-string v7, "active_email"

    const-string v8, ""

    invoke-interface {v5, v7, v8}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v5

    const-string v7, "aidway55@gmail.com"

    invoke-virtual {v7, v5}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v8

    if-nez v8, :cond_2

    const-string v7, "qhals5060@gmail.com"

    invoke-virtual {v7, v5}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v8

    if-nez v8, :cond_2

    const-string v0, "Task \uc704\uc82f\uc740 \uc9c0\uc815\ub41c \uacc4\uc815\uc5d0\uc11c\ub9cc \uc0ac\uc6a9\ud560 \uc218 \uc788\uc5b4\uc694."

    const/4 v1, 0x1

    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object v0

    invoke-virtual {v0}, Landroid/widget/Toast;->show()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V

    return-void

    :cond_2
    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->loadSavedAppearanceV150()V

    const/16 v0, 0xb

    new-array v0, v0, [Ljava/lang/CharSequence;

    const-string v2, "\uc624\ub85c\ub77c \ud37c\ud50c"

    const/4 v3, 0x0

    aput-object v2, v0, v3

    const-string v2, "\ud0dc\uc591 \uace8\ub4dc"

    const/4 v3, 0x1

    aput-object v2, v0, v3

    const-string v2, "\uc218\uc131 \uc2e4\ubc84"

    const/4 v3, 0x2

    aput-object v2, v0, v3

    const-string v2, "\uae08\uc131 \ub85c\uc988"

    const/4 v3, 0x3

    aput-object v2, v0, v3

    const-string v2, "\uc9c0\uad6c \uc624\uc158"

    const/4 v3, 0x4

    aput-object v2, v0, v3

    const-string v2, "\ud654\uc131 \ucf54\ub784"

    const/4 v3, 0x5

    aput-object v2, v0, v3

    const-string v2, "\ucc9c\uc655\uc131 \ubbfc\ud2b8"

    const/4 v3, 0x6

    aput-object v2, v0, v3

    const-string v2, "\ud574\uc655\uc131 \ubbf8\ub4dc\ub098\uc774\ud2b8"

    const/4 v3, 0x7

    aput-object v2, v0, v3

    const-string v2, "\ubaa9\uc131 \uc0cc\ub4dc"

    const/16 v3, 0x8

    aput-object v2, v0, v3

    const-string v2, "\ud1a0\uc131 \ub8e8\ub098"

    const/16 v3, 0x9

    aput-object v2, v0, v3

    const-string v2, "\uba85\uc655\uc131 \uc774\ud074\ub9bd\uc2a4 \ub2e4\ud06c"

    const/16 v3, 0xa

    aput-object v2, v0, v3

    new-instance v2, Landroid/app/AlertDialog$Builder;

    invoke-direct {v2, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v3, "1/4 \u00b7 \uc704\uc82f \ud14c\ub9c8"

    invoke-virtual {v2, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$1;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$1;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V

    invoke-virtual {v2, v0, v1, v3}, Landroid/app/AlertDialog$Builder;->setSingleChoiceItems([Ljava/lang/CharSequence;ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    const-string v0, "\ub2e4\uc74c"

    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$2;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$2;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V

    invoke-virtual {v2, v0, v3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    const-string v0, "\ucde8\uc18c"

    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$3;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$3;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V

    invoke-virtual {v2, v0, v3}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    invoke-virtual {v2, v1}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;

    invoke-virtual {v2}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    return-void
.end method


# virtual methods
.method public chooseContent(I)V
    .locals 2

    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->contentChoices()[Ljava/lang/CharSequence;

    move-result-object v0

    if-ltz p1, :cond_0

    array-length v1, v0

    if-ge p1, v1, :cond_0

    aget-object v0, v0, p1

    invoke-interface {v0}, Ljava/lang/CharSequence;->toString()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedContent:Ljava/lang/String;

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void

    :cond_0
    const-string v0, "\uc804\uccb4 \ub0b4\uc6a9"

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedContent:Ljava/lang/String;

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void
.end method

.method public chooseTheme(I)V
    .locals 1

    packed-switch p1, :pswitch_data_0

    const-string v0, "aurora"

    goto :goto_0

    :pswitch_0
    const-string v0, "aurora"

    goto :goto_0

    :pswitch_1
    const-string v0, "sunset"

    goto :goto_0

    :pswitch_2
    const-string v0, "mono"

    goto :goto_0

    :pswitch_3
    const-string v0, "rose"

    goto :goto_0

    :pswitch_4
    const-string v0, "ocean"

    goto :goto_0

    :pswitch_5
    const-string v0, "lavender"

    goto :goto_0

    :pswitch_6
    const-string v0, "mint"

    goto :goto_0

    :pswitch_7
    const-string v0, "midnight"

    goto :goto_0

    :pswitch_8
    const-string v0, "lavender"

    goto :goto_0

    :pswitch_9
    const-string v0, "mono"

    goto :goto_0

    :pswitch_a
    const-string v0, "midnight"

    :goto_0
    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedTheme:Ljava/lang/String;

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void

    :pswitch_data_0
    .packed-switch 0x0
        :pswitch_0
        :pswitch_1
        :pswitch_2
        :pswitch_3
        :pswitch_4
        :pswitch_5
        :pswitch_6
        :pswitch_7
        :pswitch_8
        :pswitch_9
        :pswitch_a
    .end packed-switch
.end method

.method public finishWidget()V
    .locals 4

    :try_start_0
    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finishWidgetInternalV143()V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception v0

    new-instance v1, Landroid/content/Intent;

    invoke-direct {v1}, Landroid/content/Intent;-><init>()V

    const-string v2, "appWidgetId"

    iget v3, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    invoke-virtual {v1, v2, v3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    const/4 v2, -0x1

    invoke-virtual {p0, v2, v1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->setResult(ILandroid/content/Intent;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V

    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 5

    :try_start_0
    invoke-direct {p0, p1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->onCreateScreenV157(Landroid/os/Bundle;)V
    :try_end_0
    .catch Ljava/lang/Throwable; {:try_start_0 .. :try_end_0} :catch_0

    return-void

    :catch_0
    move-exception v0

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getIntent()Landroid/content/Intent;

    move-result-object v1

    const-string v2, "appWidgetId"

    const/4 v3, 0x0

    invoke-virtual {v1, v2, v3}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    move-result v3

    iput v3, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I

    new-instance v1, Landroid/content/Intent;

    invoke-direct {v1}, Landroid/content/Intent;-><init>()V

    invoke-virtual {v1, v2, v3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    const/4 v4, -0x1

    invoke-virtual {p0, v4, v1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->setResult(ILandroid/content/Intent;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V

    return-void
.end method

.method private onCreateScreenV157(Landroid/os/Bundle;)V
    .locals 8

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    new-instance v0, Landroid/content/Intent;
    invoke-direct {v0}, Landroid/content/Intent;-><init>()V
    const/4 v1, 0x0
    invoke-virtual {p0, v1, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->setResult(ILandroid/content/Intent;)V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getIntent()Landroid/content/Intent;
    move-result-object v0
    const-string v2, "appWidgetId"
    invoke-virtual {v0, v2, v1}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I
    move-result v0
    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->appWidgetId:I
    if-nez v0, :cond_v157_widget_id
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V
    return-void

    :cond_v157_widget_id
    invoke-static {p0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;
    move-result-object v2
    invoke-virtual {v2, v0}, Landroid/appwidget/AppWidgetManager;->getAppWidgetInfo(I)Landroid/appwidget/AppWidgetProviderInfo;
    move-result-object v2
    const-string v3, ""
    if-eqz v2, :cond_v157_provider_ready
    iget-object v2, v2, Landroid/appwidget/AppWidgetProviderInfo;->provider:Landroid/content/ComponentName;
    if-eqz v2, :cond_v157_provider_ready
    invoke-virtual {v2}, Landroid/content/ComponentName;->getClassName()Ljava/lang/String;
    move-result-object v3

    :cond_v157_provider_ready
    iput-object v3, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->providerClass:Ljava/lang/String;

    const-string v2, "$Task"
    invoke-virtual {v3, v2}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z
    move-result v2
    if-eqz v2, :cond_v157_access_ok
    const-string v2, "aiderlog_native"
    invoke-virtual {p0, v2, v1}, Lcom/aiderlog/v22app/WidgetConfigActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v2
    const-string v4, "active_email"
    const-string v5, ""
    invoke-interface {v2, v4, v5}, Landroid/content/SharedPreferences;->getString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;
    move-result-object v2
    const-string v4, "aidway55@gmail.com"
    invoke-virtual {v4, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z
    move-result v4
    if-nez v4, :cond_v157_access_ok
    const-string v4, "qhals5060@gmail.com"
    invoke-virtual {v4, v2}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z
    move-result v2
    if-nez v2, :cond_v157_access_ok
    const-string v0, "Consulting 위젯은 지정된 계정에서만 사용할 수 있어요."
    const/4 v1, 0x1
    invoke-static {p0, v0, v1}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;
    move-result-object v0
    invoke-virtual {v0}, Landroid/widget/Toast;->show()V
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->finish()V
    return-void

    :cond_v157_access_ok
    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->loadSavedAppearanceV150()V
    const v0, 0x7f04001a
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->setContentView(I)V

    const v0, 0x7f030009
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    new-instance v2, Lcom/aiderlog/v22app/WidgetConfigActivity$10;
    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$10;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v0, v2}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    const v0, 0x7f03000a
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    new-instance v2, Lcom/aiderlog/v22app/WidgetConfigActivity$11;
    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$11;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v0, v2}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    const v0, 0x7f03000b
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    new-instance v2, Lcom/aiderlog/v22app/WidgetConfigActivity$12;
    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$12;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v0, v2}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    const v0, 0x7f03000c
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    new-instance v2, Lcom/aiderlog/v22app/WidgetConfigActivity$13;
    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$13;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v0, v2}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    const v0, 0x7f03000d
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    new-instance v2, Lcom/aiderlog/v22app/WidgetConfigActivity$14;
    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$14;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v0, v2}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V

    const v0, 0x7f03000e
    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->findViewById(I)Landroid/view/View;
    move-result-object v0
    new-instance v2, Lcom/aiderlog/v22app/WidgetConfigActivity$15;
    invoke-direct {v2, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$15;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v0, v2}, Landroid/view/View;->setOnClickListener(Landroid/view/View$OnClickListener;)V
    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void
.end method

.method public chooseOpacity(I)V
    .locals 1

    if-ltz p1, :cond_default

    const/4 v0, 0x5

    if-gt p1, v0, :cond_default

    mul-int/lit8 v0, p1, 0x14

    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedOpacity:I

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void

    :cond_default
    const/16 v0, 0x64

    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedOpacity:I

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void
.end method

.method public chooseFont(I)V
    .locals 1

    if-ltz p1, :cond_default

    const/4 v0, 0x4

    if-gt p1, v0, :cond_default

    add-int/lit8 v0, p1, 0x1

    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedFont:I

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void

    :cond_default
    const/4 v0, 0x3

    iput v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity;->selectedFont:I

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    return-void
.end method

.method public showThemeDialog()V
    .locals 6

    const/16 v0, 0xb
    new-array v0, v0, [Ljava/lang/CharSequence;
    const/4 v2, 0x0
    const-string v1, "오로라 퍼플"
    aput-object v1, v0, v2
    const/4 v3, 0x1
    const-string v1, "태양 골드"
    aput-object v1, v0, v3
    const/4 v3, 0x2
    const-string v1, "수성 실버"
    aput-object v1, v0, v3
    const/4 v3, 0x3
    const-string v1, "금성 로즈"
    aput-object v1, v0, v3
    const/4 v3, 0x4
    const-string v1, "지구 오션"
    aput-object v1, v0, v3
    const/4 v3, 0x5
    const-string v1, "화성 코랄"
    aput-object v1, v0, v3
    const/4 v3, 0x6
    const-string v1, "천왕성 민트"
    aput-object v1, v0, v3
    const/4 v3, 0x7
    const-string v1, "해왕성 미드나이트"
    aput-object v1, v0, v3
    const/16 v3, 0x8
    const-string v1, "목성 샌드"
    aput-object v1, v0, v3
    const/16 v3, 0x9
    const-string v1, "토성 루나"
    aput-object v1, v0, v3
    const/16 v3, 0xa
    const-string v1, "명왕성 이클립스"
    aput-object v1, v0, v3

    new-instance v1, Landroid/app/AlertDialog$Builder;
    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V
    const-string v3, "색상과 테마"
    invoke-virtual {v1, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;
    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$1;
    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$1;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    invoke-virtual {v1, v0, v2, v3}, Landroid/app/AlertDialog$Builder;->setSingleChoiceItems([Ljava/lang/CharSequence;ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
    const-string v0, "완료"
    const/4 v3, 0x0
    invoke-virtual {v1, v0, v3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
    invoke-virtual {v1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;
    return-void
.end method

.method public showOpacityDialog()V
    .locals 6

    const/4 v0, 0x6

    new-array v0, v0, [Ljava/lang/CharSequence;

    const-string v1, "0% \u00b7 \uc644\uc804 \ud22c\uba85"
    const/4 v2, 0x0
    aput-object v1, v0, v2
    const-string v1, "20%"
    const/4 v3, 0x1
    aput-object v1, v0, v3
    const-string v1, "40%"
    const/4 v3, 0x2
    aput-object v1, v0, v3
    const-string v1, "60%"
    const/4 v3, 0x3
    aput-object v1, v0, v3
    const-string v1, "80%"
    const/4 v3, 0x4
    aput-object v1, v0, v3
    const-string v1, "100% \u00b7 \ubd88\ud22c\uba85"
    const/4 v3, 0x5
    aput-object v1, v0, v3

    new-instance v1, Landroid/app/AlertDialog$Builder;
    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V
    const-string v3, "2/4 \u00b7 \uc704\uc82f \ud22c\uba85\ub3c4"
    invoke-virtual {v1, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;
    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$6;
    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$6;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    const/4 v4, 0x5
    invoke-virtual {v1, v0, v4, v3}, Landroid/app/AlertDialog$Builder;->setSingleChoiceItems([Ljava/lang/CharSequence;ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
    const-string v0, "\uc644\ub8cc"
    const/4 v3, 0x0
    invoke-virtual {v1, v0, v3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;
    invoke-virtual {v1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;
    return-void
.end method

.method public showFontDialog()V
    .locals 6

    const/4 v0, 0x5
    new-array v0, v0, [Ljava/lang/CharSequence;
    const-string v1, "1 \u00b7 \uc544\uc8fc \uc791\uac8c"
    const/4 v2, 0x0
    aput-object v1, v0, v2
    const-string v1, "2 \u00b7 \uc791\uac8c"
    const/4 v3, 0x1
    aput-object v1, v0, v3
    const-string v1, "3 \u00b7 \ubcf4\ud1b5"
    const/4 v3, 0x2
    aput-object v1, v0, v3
    const-string v1, "4 \u00b7 \ud06c\uac8c"
    const/4 v3, 0x3
    aput-object v1, v0, v3
    const-string v1, "5 \u00b7 \uc544\uc8fc \ud06c\uac8c"
    const/4 v3, 0x4
    aput-object v1, v0, v3

    new-instance v1, Landroid/app/AlertDialog$Builder;
    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V
    const-string v3, "3/4 \u00b7 \uc704\uc82f \uae00\uc790 \ud06c\uae30"
    invoke-virtual {v1, v3}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;
    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$8;
    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$8;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    const/4 v4, 0x2
    invoke-virtual {v1, v0, v4, v3}, Landroid/app/AlertDialog$Builder;->setSingleChoiceItems([Ljava/lang/CharSequence;ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
    const-string v0, "\uc644\ub8cc"
    const/4 v3, 0x0
    invoke-virtual {v1, v0, v3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;
    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;
    invoke-virtual {v1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;
    return-void
.end method

.method public showContentDialog()V
    .locals 5

    invoke-static {p0}, Lcom/aiderlog/v22app/WidgetDesignV165;->showContentDialog(Landroid/app/Activity;)V

    return-void

    invoke-direct {p0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->contentChoices()[Ljava/lang/CharSequence;

    move-result-object v0

    new-instance v1, Landroid/app/AlertDialog$Builder;

    invoke-direct {v1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string v2, "4/4 \u00b7 \uc704\uc82f\uc5d0 \ud45c\uc2dc\ud560 \uc77c\uc815"

    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    const/4 v2, 0x0

    new-instance v3, Lcom/aiderlog/v22app/WidgetConfigActivity$4;

    invoke-direct {v3, p0}, Lcom/aiderlog/v22app/WidgetConfigActivity$4;-><init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V

    invoke-virtual {v1, v0, v2, v3}, Landroid/app/AlertDialog$Builder;->setSingleChoiceItems([Ljava/lang/CharSequence;ILandroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    const-string v0, "\uc644\ub8cc"

    const/4 v3, 0x0

    invoke-virtual {v1, v0, v3}, Landroid/app/AlertDialog$Builder;->setPositiveButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    invoke-virtual {v1, v2}, Landroid/app/AlertDialog$Builder;->setCancelable(Z)Landroid/app/AlertDialog$Builder;

    invoke-virtual {v1}, Landroid/app/AlertDialog$Builder;->show()Landroid/app/AlertDialog;

    return-void
.end method
