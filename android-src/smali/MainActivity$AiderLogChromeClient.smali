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
.method public onPermissionRequestCanceled(Landroid/webkit/PermissionRequest;)V
    .locals 1
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;
    invoke-static {v0}, Lcom/aiderlog/v22app/MainActivity;->access$6(Lcom/aiderlog/v22app/MainActivity;)Lcom/aiderlog/v22app/PermissionFlow;
    move-result-object v0
    invoke-virtual {v0, p1}, Lcom/aiderlog/v22app/PermissionFlow;->cancelMedia(Ljava/lang/Object;)V
    return-void
.end method

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
    .locals 1
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;
    invoke-static {v0, p2, p3}, Lcom/aiderlog/v22app/MediaChooserV178;->show(Landroid/app/Activity;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)Z
    move-result v0
    return v0
.end method
