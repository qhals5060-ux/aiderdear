.class public Lcom/aiderlog/v22app/MainActivity;
.super Landroid/app/Activity;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;,
        Lcom/aiderlog/v22app/MainActivity$AiderLogClient;,
        Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;,
        Lcom/aiderlog/v22app/MainActivity$NativeBridge;
    }
.end annotation


# static fields
.field private static final APP_ORIGIN:Ljava/lang/String; = "aiderdear1.vercel.app"

.field private static final FILE_CHOOSER_REQUEST:I = 0x385

.field private static final PERMISSION_REQUEST:I = 0x386


# instance fields
.field private fileCallback:Landroid/webkit/ValueCallback;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;"
        }
    .end annotation
.end field

.field private pendingAction:Ljava/lang/String;

.field private pendingTarget:Ljava/lang/String;

.field private webView:Landroid/webkit/WebView;

.field private fileTransfer:Lcom/aiderlog/v22app/FileTransfer;


# direct methods
.method public constructor <init>()V
    .locals 1

    .line 37
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V

    .line 43
    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingTarget:Ljava/lang/String;

    .line 44
    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingAction:Ljava/lang/String;

    return-void
.end method

.method static synthetic access$0(Lcom/aiderlog/v22app/MainActivity;Ljava/lang/String;)Ljava/lang/String;
    .locals 0

    .line 273
    invoke-direct {p0, p1}, Lcom/aiderlog/v22app/MainActivity;->mimeType(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p0

    return-object p0
.end method

.method static synthetic access$1(Lcom/aiderlog/v22app/MainActivity;)V
    .locals 0

    .line 105
    invoke-direct {p0}, Lcom/aiderlog/v22app/MainActivity;->deliverIntentToWeb()V

    return-void
.end method

.method static synthetic access$2(Lcom/aiderlog/v22app/MainActivity;)Landroid/webkit/ValueCallback;
    .locals 0

    .line 42
    iget-object p0, p0, Lcom/aiderlog/v22app/MainActivity;->fileCallback:Landroid/webkit/ValueCallback;

    return-object p0
.end method

.method static synthetic access$3(Lcom/aiderlog/v22app/MainActivity;Landroid/webkit/ValueCallback;)V
    .locals 0

    .line 42
    iput-object p1, p0, Lcom/aiderlog/v22app/MainActivity;->fileCallback:Landroid/webkit/ValueCallback;

    return-void
.end method

.method static synthetic access$4(Lcom/aiderlog/v22app/MainActivity;)Landroid/webkit/WebView;
    .locals 0

    .line 41
    iget-object p0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    return-object p0
.end method

.method static synthetic access$5(Lcom/aiderlog/v22app/MainActivity;)V
    .locals 0

    .line 1
    invoke-super {p0}, Landroid/app/Activity;->onBackPressed()V

    return-void
.end method

.method private applyImmersiveMode()V
    .locals 3

    invoke-virtual {p0}, Lcom/aiderlog/v22app/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;

    move-result-object v1

    const/16 v2, 0x1706

    invoke-virtual {v1, v2}, Landroid/view/View;->setSystemUiVisibility(I)V

    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v2, 0x1e

    if-lt v1, v2, :cond_0

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/view/Window;->setDecorFitsSystemWindows(Z)V

    invoke-virtual {v0}, Landroid/view/Window;->getInsetsController()Landroid/view/WindowInsetsController;

    move-result-object v0

    if-eqz v0, :cond_0

    invoke-static {}, Landroid/view/WindowInsets$Type;->systemBars()I

    move-result v1

    invoke-interface {v0, v1}, Landroid/view/WindowInsetsController;->hide(I)V

    const/4 v1, 0x2

    invoke-interface {v0, v1}, Landroid/view/WindowInsetsController;->setSystemBarsBehavior(I)V

    :cond_0
    return-void
.end method

.method private configureWebView(Landroid/os/Bundle;)V
    .locals 5

    .line 60
    new-instance v0, Landroid/webkit/WebView;

    invoke-direct {v0, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    const/16 v1, 0xfa

    const/16 v2, 0xff

    .line 61
    invoke-static {v1, v1, v2}, Landroid/graphics/Color;->rgb(III)I

    move-result v1

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    .line 62
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {p0, v0}, Lcom/aiderlog/v22app/MainActivity;->setContentView(Landroid/view/View;)V

    .line 64
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v0}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;

    move-result-object v0

    const/4 v1, 0x1

    .line 65
    invoke-virtual {v0, v1}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V

    .line 66
    invoke-virtual {v0, v1}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V

    .line 67
    invoke-virtual {v0, v1}, Landroid/webkit/WebSettings;->setDatabaseEnabled(Z)V

    .line 68
    invoke-virtual {v0, v1}, Landroid/webkit/WebSettings;->setAllowContentAccess(Z)V

    const/4 v2, 0x0

    .line 69
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setAllowFileAccess(Z)V

    .line 70
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setSupportMultipleWindows(Z)V

    .line 71
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setJavaScriptCanOpenWindowsAutomatically(Z)V

    .line 72
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    .line 73
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setLoadWithOverviewMode(Z)V

    .line 74
    invoke-virtual {v0, v1}, Landroid/webkit/WebSettings;->setUseWideViewPort(Z)V

    const/16 v2, 0x64

    .line 75
    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setTextZoom(I)V

    .line 76
    invoke-virtual {v0}, Landroid/webkit/WebSettings;->getUserAgentString()Ljava/lang/String;

    move-result-object v2

    const-string v3, "; wv"

    const-string v4, ""

    invoke-virtual {v2, v3, v4}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    move-result-object v2

    const-string v3, " Version/4.0"

    invoke-virtual {v2, v3, v4}, Ljava/lang/String;->replace(Ljava/lang/CharSequence;Ljava/lang/CharSequence;)Ljava/lang/String;

    move-result-object v2

    .line 77
    new-instance v3, Ljava/lang/StringBuilder;

    invoke-static {v2}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object v2

    invoke-direct {v3, v2}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    const-string v2, " AiderLogAndroid/1.9.47"

    invoke-virtual {v3, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v3}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v2

    invoke-virtual {v0, v2}, Landroid/webkit/WebSettings;->setUserAgentString(Ljava/lang/String;)V

    .line 78
    invoke-virtual {v0, v1}, Landroid/webkit/WebSettings;->setMixedContentMode(I)V

    .line 79
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v0

    invoke-virtual {v0, v1}, Landroid/webkit/CookieManager;->setAcceptCookie(Z)V

    .line 80
    invoke-static {}, Landroid/webkit/CookieManager;->getInstance()Landroid/webkit/CookieManager;

    move-result-object v0

    iget-object v2, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v0, v2, v1}, Landroid/webkit/CookieManager;->setAcceptThirdPartyCookies(Landroid/webkit/WebView;Z)V

    .line 82
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    new-instance v1, Lcom/aiderlog/v22app/MainActivity$NativeBridge;

    invoke-direct {v1, p0}, Lcom/aiderlog/v22app/MainActivity$NativeBridge;-><init>(Lcom/aiderlog/v22app/MainActivity;)V

    const-string v2, "AiderLogNative"

    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    new-instance v1, Lcom/aiderlog/v22app/FileTransfer;
    invoke-direct {v1, p0}, Lcom/aiderlog/v22app/FileTransfer;-><init>(Landroid/app/Activity;)V
    iput-object v1, p0, Lcom/aiderlog/v22app/MainActivity;->fileTransfer:Lcom/aiderlog/v22app/FileTransfer;
    const-string v2, "AiderLogFiles"
    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->addJavascriptInterface(Ljava/lang/Object;Ljava/lang/String;)V

    .line 83
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    new-instance v1, Lcom/aiderlog/v22app/MainActivity$AiderLogClient;

    const/4 v2, 0x0

    invoke-direct {v1, p0, v2}, Lcom/aiderlog/v22app/MainActivity$AiderLogClient;-><init>(Lcom/aiderlog/v22app/MainActivity;Lcom/aiderlog/v22app/MainActivity$AiderLogClient;)V

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setWebViewClient(Landroid/webkit/WebViewClient;)V

    .line 84
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    new-instance v1, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;

    invoke-direct {v1, p0, v2}, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;-><init>(Lcom/aiderlog/v22app/MainActivity;Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;)V

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    .line 85
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    new-instance v1, Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;

    invoke-direct {v1, p0, v2}, Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;-><init>(Lcom/aiderlog/v22app/MainActivity;Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;)V

    invoke-virtual {v0, v1}, Landroid/webkit/WebView;->setDownloadListener(Landroid/webkit/DownloadListener;)V

    if-eqz p1, :cond_0

    .line 87
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    invoke-virtual {v0, p1}, Landroid/webkit/WebView;->restoreState(Landroid/os/Bundle;)Landroid/webkit/WebBackForwardList;

    goto :goto_0

    .line 88
    :cond_0
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    const-string v0, "https://aiderdear1.vercel.app/index.html"

    invoke-virtual {p1, v0}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V

    :goto_0
    return-void
.end method

.method private deliverIntentToWeb()V
    .locals 3

    .line 106
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    if-nez v0, :cond_0

    return-void

    .line 107
    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingTarget:Ljava/lang/String;

    if-eqz v0, :cond_v157_check_action

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-eqz v0, :cond_v157_deliver

    :cond_v157_check_action
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingAction:Ljava/lang/String;

    if-eqz v0, :cond_v157_empty

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v0

    if-nez v0, :cond_v157_empty

    :cond_v157_deliver
    new-instance v0, Ljava/lang/StringBuilder;

    const-string v1, "window.AiderLogAppShell&&window.AiderLogAppShell.openTarget("

    invoke-direct {v0, v1}, Ljava/lang/StringBuilder;-><init>(Ljava/lang/String;)V

    iget-object v1, p0, Lcom/aiderlog/v22app/MainActivity;->pendingTarget:Ljava/lang/String;

    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, ","

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    iget-object v1, p0, Lcom/aiderlog/v22app/MainActivity;->pendingAction:Ljava/lang/String;

    invoke-static {v1}, Lorg/json/JSONObject;->quote(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    const-string v1, ");"

    invoke-virtual {v0, v1}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;

    invoke-virtual {v0}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;

    move-result-object v0

    .line 108
    iget-object v1, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    const/4 v2, 0x0

    invoke-virtual {v1, v0, v2}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    .line 109
    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingAction:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingTarget:Ljava/lang/String;

    :cond_v157_empty

    return-void
.end method

.method private mimeType(Ljava/lang/String;)Ljava/lang/String;
    .locals 3

    .line 274
    invoke-static {p1}, Landroid/webkit/MimeTypeMap;->getFileExtensionFromUrl(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    .line 275
    invoke-static {}, Landroid/webkit/MimeTypeMap;->getSingleton()Landroid/webkit/MimeTypeMap;

    move-result-object v1

    if-nez v0, :cond_0

    const-string v0, ""

    goto :goto_0

    :cond_0
    sget-object v2, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v0, v2}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v0

    :goto_0
    invoke-virtual {v1, v0}, Landroid/webkit/MimeTypeMap;->getMimeTypeFromExtension(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    if-eqz v0, :cond_1

    return-object v0

    .line 277
    :cond_1
    const-string v0, ".js"

    invoke-virtual {p1, v0}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_2

    const-string p1, "application/javascript"

    return-object p1

    .line 278
    :cond_2
    const-string v0, ".webmanifest"

    invoke-virtual {p1, v0}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v0

    if-nez v0, :cond_5

    const-string v0, ".json"

    invoke-virtual {p1, v0}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v0

    if-eqz v0, :cond_3

    goto :goto_1

    .line 279
    :cond_3
    const-string v0, ".svg"

    invoke-virtual {p1, v0}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result p1

    if-eqz p1, :cond_4

    const-string p1, "image/svg+xml"

    return-object p1

    .line 280
    :cond_4
    const-string p1, "application/octet-stream"

    return-object p1

    .line 278
    :cond_5
    :goto_1
    const-string p1, "application/json"

    return-object p1
.end method

.method private readIntent(Landroid/content/Intent;)V
    .locals 3

    if-nez p1, :cond_0

    return-void

    :cond_0
    invoke-virtual {p1}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v0

    if-eqz v0, :cond_1

    invoke-virtual {v0}, Landroid/net/Uri;->getScheme()Ljava/lang/String;

    move-result-object v1

    const-string v2, "aiderlog"

    invoke-virtual {v2, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    invoke-virtual {v0}, Landroid/net/Uri;->getHost()Ljava/lang/String;

    move-result-object v1

    const-string v2, "auth"

    invoke-virtual {v2, v1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v1

    if-eqz v1, :cond_1

    const-string v1, "home"

    iput-object v1, p0, Lcom/aiderlog/v22app/MainActivity;->pendingTarget:Ljava/lang/String;

    invoke-virtual {v0}, Landroid/net/Uri;->toString()Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingAction:Ljava/lang/String;

    return-void

    .line 93
    :cond_1
    const-string v0, "target"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    if-eqz v0, :cond_v157_read_action

    invoke-virtual {v0}, Ljava/lang/String;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_v157_read_action

    invoke-direct {p0, v0}, Lcom/aiderlog/v22app/MainActivity;->safeTarget(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->pendingTarget:Ljava/lang/String;

    .line 94
    :cond_v157_read_action
    const-string v0, "action"

    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v1

    if-nez v1, :cond_2

    const-string p1, ""

    goto :goto_0

    :cond_2
    invoke-virtual {p1, v0}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    :goto_0
    invoke-static {p1}, Ljava/lang/String;->valueOf(Ljava/lang/Object;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/MainActivity;->pendingAction:Ljava/lang/String;

    return-void
.end method

.method private requestRuntimePermissions()V
    .locals 3

    .line 145
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    .line 146
    const-string v1, "android.permission.CAMERA"

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/MainActivity;->checkSelfPermission(Ljava/lang/String;)I

    move-result v2

    if-eqz v2, :cond_0

    invoke-virtual {v0, v1}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 147
    :cond_0
    const-string v1, "android.permission.RECORD_AUDIO"

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/MainActivity;->checkSelfPermission(Ljava/lang/String;)I

    move-result v2

    if-eqz v2, :cond_1

    invoke-virtual {v0, v1}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 148
    :cond_1
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v2, 0x21

    if-lt v1, v2, :cond_2

    const-string v1, "android.permission.POST_NOTIFICATIONS"

    invoke-virtual {p0, v1}, Lcom/aiderlog/v22app/MainActivity;->checkSelfPermission(Ljava/lang/String;)I

    move-result v2

    if-eqz v2, :cond_2

    invoke-virtual {v0, v1}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 149
    :cond_2
    invoke-virtual {v0}, Ljava/util/ArrayList;->isEmpty()Z

    move-result v1

    if-nez v1, :cond_3

    const/4 v1, 0x0

    new-array v1, v1, [Ljava/lang/String;

    invoke-virtual {v0, v1}, Ljava/util/ArrayList;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object v0

    check-cast v0, [Ljava/lang/String;

    const/16 v1, 0x386

    invoke-virtual {p0, v0, v1}, Lcom/aiderlog/v22app/MainActivity;->requestPermissions([Ljava/lang/String;I)V

    :cond_3
    return-void
.end method

.method private safeTarget(Ljava/lang/String;)Ljava/lang/String;
    .locals 2

    .line 98
    const-string v0, "schedule"

    if-nez p1, :cond_0

    return-object v0

    .line 99
    :cond_0
    const-string v1, "language"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-eqz v1, :not_language_target

    return-object p1

    :not_language_target
    invoke-virtual {p1}, Ljava/lang/String;->hashCode()I

    move-result v1

    sparse-switch v1, :sswitch_data_0

    goto :goto_0

    :sswitch_0
    const-string v1, "personal"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :sswitch_1
    const-string v1, "paper"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :sswitch_2
    const-string v1, "task"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :sswitch_3
    const-string v1, "private"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :sswitch_4
    invoke-virtual {p1, v0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :sswitch_5
    const-string v1, "record"

    invoke-virtual {p1, v1}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v1

    if-nez v1, :cond_1

    goto :goto_0

    :cond_1
    return-object p1

    :goto_0
    return-object v0

    nop

    :sswitch_data_0
    .sparse-switch
        -0x37b993af -> :sswitch_5
        -0x29996d69 -> :sswitch_4
        -0x12beda7d -> :sswitch_3
        0x363585 -> :sswitch_2
        0x658118c -> :sswitch_1
        0x1a6a2640 -> :sswitch_0
    .end sparse-switch
.end method


# virtual methods
.method protected onActivityResult(IILandroid/content/Intent;)V
    .locals 2

    const/16 v0, 0x387
    if-ne p1, v0, :upload_result_v163
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->fileTransfer:Lcom/aiderlog/v22app/FileTransfer;
    if-eqz v0, :save_result_done_v163
    invoke-virtual {v0, p2, p3}, Lcom/aiderlog/v22app/FileTransfer;->onResult(ILandroid/content/Intent;)V
    :save_result_done_v163
    return-void
    :upload_result_v163

    const/16 v0, 0x385

    if-ne p1, v0, :cond_4

    const/4 p1, -0x1

    const/4 v0, 0x0

    if-ne p2, p1, :cond_2

    if-eqz p3, :cond_2

    .line 157
    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object p1

    const/4 p2, 0x0

    if-eqz p1, :cond_1

    .line 158
    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object p1

    .line 159
    invoke-virtual {p1}, Landroid/content/ClipData;->getItemCount()I

    move-result p3

    new-array v1, p3, [Landroid/net/Uri;

    .line 160
    :goto_0
    invoke-virtual {p1}, Landroid/content/ClipData;->getItemCount()I

    move-result p3

    if-lt p2, p3, :cond_0

    goto :goto_1

    :cond_0
    invoke-virtual {p1, p2}, Landroid/content/ClipData;->getItemAt(I)Landroid/content/ClipData$Item;

    move-result-object p3

    invoke-virtual {p3}, Landroid/content/ClipData$Item;->getUri()Landroid/net/Uri;

    move-result-object p3

    aput-object p3, v1, p2

    add-int/lit8 p2, p2, 0x1

    goto :goto_0

    .line 161
    :cond_1
    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object p1

    if-eqz p1, :cond_2

    const/4 p1, 0x1

    new-array v1, p1, [Landroid/net/Uri;

    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object p1

    aput-object p1, v1, p2

    goto :goto_1

    :cond_2
    move-object v1, v0

    .line 163
    :goto_1
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity;->fileCallback:Landroid/webkit/ValueCallback;

    if-eqz p1, :cond_3

    invoke-interface {p1, v1}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    .line 164
    :cond_3
    iput-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->fileCallback:Landroid/webkit/ValueCallback;

    return-void

    .line 167
    :cond_4
    invoke-super {p0, p1, p2, p3}, Landroid/app/Activity;->onActivityResult(IILandroid/content/Intent;)V

    return-void
.end method

.method public onBackPressed()V
    .locals 3

    .line 134
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    if-nez v0, :cond_0

    invoke-super {p0}, Landroid/app/Activity;->onBackPressed()V

    return-void

    .line 135
    :cond_0
    new-instance v1, Lcom/aiderlog/v22app/MainActivity$1;

    invoke-direct {v1, p0}, Lcom/aiderlog/v22app/MainActivity$1;-><init>(Lcom/aiderlog/v22app/MainActivity;)V

    const-string v2, "String(!!(window.AiderLogAppShell&&window.AiderLogAppShell.handleBack()))"

    invoke-virtual {v0, v2, v1}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    return-void
.end method

.method public onConfigurationChanged(Landroid/content/res/Configuration;)V
    .locals 2

    .line 128
    invoke-super {p0, p1}, Landroid/app/Activity;->onConfigurationChanged(Landroid/content/res/Configuration;)V

    .line 129
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    if-eqz p1, :cond_0

    const-string v0, "window.dispatchEvent(new Event(\'resize\'));window.AiderLogAppShell&&window.AiderLogAppShell.deviceChanged();"

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    :cond_0
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 3

    .line 48
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    .line 49
    invoke-virtual {p0}, Lcom/aiderlog/v22app/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/view/Window;->setStatusBarColor(I)V

    .line 50
    invoke-virtual {p0}, Lcom/aiderlog/v22app/MainActivity;->getWindow()Landroid/view/Window;

    move-result-object v0

    const/4 v1, 0x0

    invoke-virtual {v0, v1}, Landroid/view/Window;->setNavigationBarColor(I)V

    .line 52
    invoke-direct {p0}, Lcom/aiderlog/v22app/MainActivity;->applyImmersiveMode()V

    .line 54
    invoke-virtual {p0}, Lcom/aiderlog/v22app/MainActivity;->getIntent()Landroid/content/Intent;

    move-result-object v0

    invoke-direct {p0, v0}, Lcom/aiderlog/v22app/MainActivity;->readIntent(Landroid/content/Intent;)V

    .line 55
    invoke-direct {p0, p1}, Lcom/aiderlog/v22app/MainActivity;->configureWebView(Landroid/os/Bundle;)V

    .line 56
    invoke-direct {p0}, Lcom/aiderlog/v22app/MainActivity;->requestRuntimePermissions()V

    return-void
.end method

.method protected onNewIntent(Landroid/content/Intent;)V
    .locals 0

    .line 114
    invoke-super {p0, p1}, Landroid/app/Activity;->onNewIntent(Landroid/content/Intent;)V

    .line 115
    invoke-virtual {p0, p1}, Lcom/aiderlog/v22app/MainActivity;->setIntent(Landroid/content/Intent;)V

    .line 116
    invoke-direct {p0, p1}, Lcom/aiderlog/v22app/MainActivity;->readIntent(Landroid/content/Intent;)V

    .line 117
    invoke-direct {p0}, Lcom/aiderlog/v22app/MainActivity;->deliverIntentToWeb()V

    return-void
.end method

.method protected onResume()V
    .locals 3

    invoke-super {p0}, Landroid/app/Activity;->onResume()V

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    if-eqz v0, :cond_v157_resume_done

    const-string v1, "window.dispatchEvent(new CustomEvent('aiderlog-native-resume'));"

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    const/4 v2, 0x0

    invoke-virtual {v0, v1, v2}, Landroid/webkit/WebView;->evaluateJavascript(Ljava/lang/String;Landroid/webkit/ValueCallback;)V

    :cond_v157_resume_done
    return-void
.end method

.method protected onSaveInstanceState(Landroid/os/Bundle;)V
    .locals 1

    .line 122
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity;->webView:Landroid/webkit/WebView;

    if-eqz v0, :cond_0

    invoke-virtual {v0, p1}, Landroid/webkit/WebView;->saveState(Landroid/os/Bundle;)Landroid/webkit/WebBackForwardList;

    .line 123
    :cond_0
    invoke-super {p0, p1}, Landroid/app/Activity;->onSaveInstanceState(Landroid/os/Bundle;)V

    return-void
.end method

.method public onWindowFocusChanged(Z)V
    .locals 2

    invoke-super {p0, p1}, Landroid/app/Activity;->onWindowFocusChanged(Z)V

    if-eqz p1, :cond_0

    invoke-direct {p0}, Lcom/aiderlog/v22app/MainActivity;->applyImmersiveMode()V

    :cond_0
    return-void
.end method
