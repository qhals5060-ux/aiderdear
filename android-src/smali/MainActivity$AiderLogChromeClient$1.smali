.class Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->onPermissionRequest(Landroid/webkit/PermissionRequest;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;

.field private final synthetic val$request:Landroid/webkit/PermissionRequest;


# direct methods
.method constructor <init>(Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;Landroid/webkit/PermissionRequest;)V
    .locals 0

    .line 251
    iput-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;->this$1:Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;

    iput-object p2, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;->val$request:Landroid/webkit/PermissionRequest;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 2

    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;->this$1:Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;
    iget-object v0, v0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient;->this$0:Lcom/aiderlog/v22app/MainActivity;
    invoke-static {v0}, Lcom/aiderlog/v22app/MainActivity;->access$6(Lcom/aiderlog/v22app/MainActivity;)Lcom/aiderlog/v22app/PermissionFlow;
    move-result-object v0
    iget-object v1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogChromeClient$1;->val$request:Landroid/webkit/PermissionRequest;
    invoke-virtual {v0, v1}, Lcom/aiderlog/v22app/PermissionFlow;->requestMedia(Ljava/lang/Object;)V

    return-void
.end method
