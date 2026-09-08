.class public final Lcom/aiderlog/v22app/MainActivity$NativeBridge;
.super Ljava/lang/Object;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/aiderlog/v22app/MainActivity;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x11
    name = "NativeBridge"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/aiderlog/v22app/MainActivity;


# direct methods
.method public constructor <init>(Lcom/aiderlog/v22app/MainActivity;)V
    .locals 0

    .line 283
    iput-object p1, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$0(Lcom/aiderlog/v22app/MainActivity$NativeBridge;)Lcom/aiderlog/v22app/MainActivity;
    .locals 0

    .line 283
    iget-object p0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    return-object p0
.end method


# virtual methods
.method public getSystemScheme()Ljava/lang/String;
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;
    invoke-virtual {v0}, Landroid/content/Context;->getResources()Landroid/content/res/Resources;
    move-result-object v0
    invoke-virtual {v0}, Landroid/content/res/Resources;->getConfiguration()Landroid/content/res/Configuration;
    move-result-object v0
    iget v0, v0, Landroid/content/res/Configuration;->uiMode:I
    and-int/lit8 v0, v0, 0x30
    const/16 v1, 0x20
    if-ne v0, v1, :scheme_light_v169
    const-string v0, "dark"
    return-object v0
    :scheme_light_v169
    const-string v0, "light"
    return-object v0
.end method

.method public cancelEventNotification(Ljava/lang/String;)V
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {v0, p1}, Lcom/aiderlog/v22app/ReminderReceiver;->cancel(Landroid/content/Context;Ljava/lang/String;)V

    return-void
.end method

.method public copyText(Ljava/lang/String;Ljava/lang/String;)V
    .locals 2
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 305
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    new-instance v1, Lcom/aiderlog/v22app/MainActivity$NativeBridge$1;

    invoke-direct {v1, p0, p1, p2}, Lcom/aiderlog/v22app/MainActivity$NativeBridge$1;-><init>(Lcom/aiderlog/v22app/MainActivity$NativeBridge;Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v0, v1}, Lcom/aiderlog/v22app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public fetchYouTubeCaption(Ljava/lang/String;Z)Ljava/lang/String;
    .locals 10
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    const-string v0, ""

    if-eqz p1, :cond_4

    const-string v1, "[-_A-Za-z0-9]{6,20}"

    invoke-virtual {p1, v1}, Ljava/lang/String;->matches(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_4

    :try_start_0
    new-instance v1, Ljava/lang/StringBuilder;

    const-string v2, "https://www.youtube.com/api/timedtext?v="

    invoke-direct {v1, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    invoke-virtual {v1, p1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v2, "&lang=en&fmt=json3"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    if-eqz p2, :cond_0

    const-string v2, "&kind=asr"

    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    :cond_0
    new-instance v2, Ljava/net/URL;

    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-direct {v2, v1}, Ljava/net/URL;-><init>(Ljava/lang/String;)V

    invoke-virtual {v2}, Ljava/net/URL;->openConnection()Ljava/net/URLConnection;

    move-result-object v1

    check-cast v1, Ljava/net/HttpURLConnection;

    const/16 v2, 0x2710

    invoke-virtual {v1, v2}, Ljava/net/HttpURLConnection;->setConnectTimeout(I)V

    const/16 v2, 0x2ee0

    invoke-virtual {v1, v2}, Ljava/net/HttpURLConnection;->setReadTimeout(I)V

    const/4 v2, 0x0

    invoke-virtual {v1, v2}, Ljava/net/HttpURLConnection;->setUseCaches(Z)V

    const-string v2, "User-Agent"

    const-string v3, "Mozilla/5.0 AiderLogAndroid/1.9.22"

    invoke-virtual {v1, v2, v3}, Ljava/net/HttpURLConnection;->setRequestProperty(Ljava/lang/String;Ljava/lang/String;)V

    invoke-virtual {v1}, Ljava/net/HttpURLConnection;->getResponseCode()I

    move-result v2

    const/16 v3, 0xc8

    if-lt v2, v3, :cond_3

    const/16 v3, 0x12c

    if-ge v2, v3, :cond_3

    invoke-virtual {v1}, Ljava/net/HttpURLConnection;->getInputStream()Ljava/io/InputStream;

    move-result-object v2

    new-instance v3, Ljava/io/InputStreamReader;

    const-string v4, "UTF-8"

    invoke-direct {v3, v2, v4}, Ljava/io/InputStreamReader;-><init>(Ljava/io/InputStream;Ljava/lang/String;)V

    new-instance v4, Ljava/io/BufferedReader;

    invoke-direct {v4, v3}, Ljava/io/BufferedReader;-><init>(Ljava/io/Reader;)V

    new-instance v5, Ljava/lang/StringBuilder;

    invoke-direct {v5}, Ljava/lang/StringBuilder;-><init>()V

    :cond_1
    invoke-virtual {v4}, Ljava/io/BufferedReader;->readLine()Ljava/lang/String;

    move-result-object v6

    if-eqz v6, :cond_2

    invoke-virtual {v5, v6}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->length()I

    move-result v7

    const v8, 0x1e8480

    if-le v7, v8, :cond_1

    :cond_2
    invoke-virtual {v4}, Ljava/io/BufferedReader;->close()V

    invoke-virtual {v1}, Ljava/net/HttpURLConnection;->disconnect()V

    invoke-virtual {v5}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    return-object v0

    :cond_3
    invoke-virtual {v1}, Ljava/net/HttpURLConnection;->disconnect()V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :catch_0
    :cond_4
    return-object v0
.end method

.method public getVersion()Ljava/lang/String;
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 285
    const-string v0, "1.9.47"

    return-object v0
.end method

.method public pinCalendarWidget(Ljava/lang/String;)Z
    .locals 5
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    sget v0, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v1, 0x1a

    if-ge v0, v1, :cond_0

    const/4 v0, 0x0

    return v0

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {v0}, Landroid/appwidget/AppWidgetManager;->getInstance(Landroid/content/Context;)Landroid/appwidget/AppWidgetManager;

    move-result-object v1

    invoke-virtual {v1}, Landroid/appwidget/AppWidgetManager;->isRequestPinAppWidgetSupported()Z

    move-result v2

    if-nez v2, :cond_1

    const/4 v0, 0x0

    return v0

    :cond_1
    const-string v2, "com.aiderlog.v22app.WidgetProvider$CalendarSplit"

    if-eqz p1, :cond_3

    const-string v3, "agenda"

    invoke-virtual {p1, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_2

    const-string v2, "com.aiderlog.v22app.WidgetProvider$CalendarAgenda"

    goto :goto_0

    :cond_2
    const-string v3, "month"

    invoke-virtual {p1, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_3

    const-string v2, "com.aiderlog.v22app.WidgetProvider$CalendarMonth"

    :cond_3
    :goto_0
    new-instance v3, Landroid/content/ComponentName;

    invoke-direct {v3, v0, v2}, Landroid/content/ComponentName;-><init>(Landroid/content/Context;Ljava/lang/String;)V

    const/4 v4, 0x0

    invoke-virtual {v1, v3, v4, v4}, Landroid/appwidget/AppWidgetManager;->requestPinAppWidget(Landroid/content/ComponentName;Landroid/os/Bundle;Landroid/app/PendingIntent;)Z

    move-result v0

    return v0
.end method

.method public scheduleEventNotification(Ljava/lang/String;)Z
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {v0, p1}, Lcom/aiderlog/v22app/ReminderReceiver;->schedule(Landroid/content/Context;Ljava/lang/String;)Z

    move-result v0

    return v0
.end method

.method public showMailNotification(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    .locals 1
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {v0, p1, p2, p3}, Lcom/aiderlog/v22app/ReminderReceiver;->show(Landroid/content/Context;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V

    return-void
.end method

.method public startGoogleLogin(Ljava/lang/String;)V
    .locals 3
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    if-eqz p1, :cond_0

    const-string v0, "https://aiderdear1.vercel.app/android-auth.html?"

    invoke-virtual {p1, v0}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_0

    :try_start_0
    new-instance v0, Landroid/content/Intent;

    const-string v1, "android.intent.action.VIEW"

    invoke-static {p1}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;

    move-result-object p1

    invoke-direct {v0, v1, p1}, Landroid/content/Intent;-><init>(Ljava/lang/String;Landroid/net/Uri;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-virtual {p1, v0}, Lcom/aiderlog/v22app/MainActivity;->startActivity(Landroid/content/Intent;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :catch_0
    :cond_0
    return-void
.end method

.method public syncWidgets(Ljava/lang/String;)V
    .locals 6
    .annotation runtime Landroid/webkit/JavascriptInterface;
    .end annotation

    .line 289
    const-string v0, "theme"

    if-eqz p1, :cond_1

    invoke-virtual {p1}, Ljava/lang/String;->length()I

    move-result v1

    const v2, 0x400000

    if-le v1, v2, :cond_0

    goto :goto_0

    .line 291
    :cond_0
    :try_start_0
    new-instance v1, Lorg/json/JSONObject;

    invoke-direct {v1, p1}, Lorg/json/JSONObject;-><init>(Ljava/lang/String;)V

    .line 292
    const-string p1, "email"

    const-string v2, ""

    invoke-virtual {v1, p1, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    invoke-virtual {p1}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object p1

    sget-object v2, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p1, v2}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object p1

    .line 293
    const-string v2, "aurora"

    invoke-virtual {v1, v0, v2}, Lorg/json/JSONObject;->optString(Ljava/lang/String;Ljava/lang/String;)Ljava/lang/String;

    move-result-object v2

    .line 294
    iget-object v3, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    const-string v4, "aiderlog_native"

    const/4 v5, 0x0

    invoke-virtual {v3, v4, v5}, Lcom/aiderlog/v22app/MainActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object v3

    invoke-interface {v3}, Landroid/content/SharedPreferences;->edit()Landroid/content/SharedPreferences$Editor;

    move-result-object v3

    .line 295
    const-string v4, "widget_snapshot"

    invoke-virtual {v1}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object v1

    invoke-interface {v3, v4, v1}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object v1

    .line 296
    const-string v3, "active_email"

    invoke-interface {v1, v3, p1}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object p1

    .line 297
    invoke-interface {p1, v0, v2}, Landroid/content/SharedPreferences$Editor;->putString(Ljava/lang/String;Ljava/lang/String;)Landroid/content/SharedPreferences$Editor;

    move-result-object p1

    .line 298
    invoke-interface {p1}, Landroid/content/SharedPreferences$Editor;->apply()V

    .line 299
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$NativeBridge;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetProvider;->updateAll(Landroid/content/Context;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    :catch_0
    :cond_1
    :goto_0
    return-void
.end method
