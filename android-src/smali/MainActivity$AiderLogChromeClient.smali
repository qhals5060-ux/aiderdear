.class final Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;
.super Landroid/webkit/WebChromeClient;
.source "MainActivity.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/aiderlog/v22app/MainActivity;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x12
    name = "AiderLogChromeClient"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/aiderlog/v22app/MainActivity;


# direct methods
.method private constructor <init>(Lcom/aiderlog/v22app/MainActivity;)V
    .locals 0

    .line 232
    iput-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-direct {p0}, Landroid/webkit/WebChromeClient;-><init>()V

    return-void
.end method

.method synthetic constructor <init>(Lcom/aiderlog/v22app/MainActivity;Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;)V
    .locals 0

    .line 232
    invoke-direct {p0, p1}, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;-><init>(Lcom/aiderlog/v22app/MainActivity;)V

    return-void
.end method


# virtual methods
.method public onPermissionRequest(Landroid/webkit/PermissionRequest;)V
    .locals 2

    .line 251
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    new-instance v1, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;

    invoke-direct {v1, p0, p1}, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;-><init>(Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;Landroid/webkit/PermissionRequest;)V

    invoke-virtual {v0, v1}, Lcom/aiderlog/v22app/MainActivity;->runOnUiThread(Ljava/lang/Runnable;)V

    return-void
.end method

.method public onShowFileChooser(Landroid/webkit/WebView;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)Z
    .locals 2
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/WebView;",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;",
            "Landroid/webkit/WebChromeClient$FileChooserParams;",
            ")Z"
        }
    .end annotation

    .line 235
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {p1}, Lcom/aiderlog/v22app/MainActivity;->access$2(Lcom/aiderlog/v22app/MainActivity;)Landroid/webkit/ValueCallback;

    move-result-object p1

    const/4 v0, 0x0

    if-eqz p1, :cond_0

    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {p1}, Lcom/aiderlog/v22app/MainActivity;->access$2(Lcom/aiderlog/v22app/MainActivity;)Landroid/webkit/ValueCallback;

    move-result-object p1

    invoke-interface {p1, v0}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    .line 236
    :cond_0
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {p1, p2}, Lcom/aiderlog/v22app/MainActivity;->access$3(Lcom/aiderlog/v22app/MainActivity;Landroid/webkit/ValueCallback;)V

    .line 237
    invoke-virtual {p3}, Landroid/webkit/WebChromeClient$FileChooserParams;->createIntent()Landroid/content/Intent;

    move-result-object p1

    .line 238
    const-string p2, "android.intent.action.OPEN_DOCUMENT"
    invoke-virtual {p1, p2}, Landroid/content/Intent;->setAction(Ljava/lang/String;)Landroid/content/Intent;

    invoke-virtual {p3}, Landroid/webkit/WebChromeClient$FileChooserParams;->getMode()I
    move-result p3
    const/4 v1, 0x1
    if-eq p3, v1, :multiple_v163
    const/4 v1, 0x0
    :multiple_v163
    const-string p2, "android.intent.extra.ALLOW_MULTIPLE"
    invoke-virtual {p1, p2, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    const-string p2, "android.intent.category.OPENABLE"

    invoke-virtual {p1, p2}, Landroid/content/Intent;->addCategory(Ljava/lang/String;)Landroid/content/Intent;

    .line 239
    const/4 p3, 0x1

    .line 240
    :try_start_0
    iget-object p2, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    const/16 v1, 0x385

    invoke-virtual {p2, p1, v1}, Lcom/aiderlog/v22app/MainActivity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    return p3

    .line 242
    :catch_0
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-static {p1}, Lcom/aiderlog/v22app/MainActivity;->access$2(Lcom/aiderlog/v22app/MainActivity;)Landroid/webkit/ValueCallback;
    move-result-object p2
    if-eqz p2, :no_callback_v163
    invoke-interface {p2, v0}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V
    :no_callback_v163

    invoke-static {p1, v0}, Lcom/aiderlog/v22app/MainActivity;->access$3(Lcom/aiderlog/v22app/MainActivity;Landroid/webkit/ValueCallback;)V

    .line 243
    iget-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;

    const-string p2, "\ud30c\uc77c \uc120\ud0dd\uae30\ub97c \uc5f4 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4."

    const/4 p3, 0x0

    invoke-static {p1, p2, p3}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p1

    invoke-virtual {p1}, Landroid/widget/Toast;->show()V

    return p3
.end method
