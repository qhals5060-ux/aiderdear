.class final Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;
.super Ljava/lang/Object;
.source "MainActivity.java"

# interfaces
.implements Landroid/webkit/DownloadListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/aiderlog/v22app/MainActivity;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x12
    name = "AiderLogDownloadListener"
.end annotation


# instance fields
.field final synthetic this$0:Lcom/aiderlog/v22app/MainActivity;


# direct methods
.method private constructor <init>(Lcom/aiderlog/v22app/MainActivity;)V
    .locals 0

    .line 257
    iput-object p1, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;->this$0:Lcom/aiderlog/v22app/MainActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method synthetic constructor <init>(Lcom/aiderlog/v22app/MainActivity;Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;)V
    .locals 0

    .line 257
    invoke-direct {p0, p1}, Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;-><init>(Lcom/aiderlog/v22app/MainActivity;)V

    return-void
.end method


# virtual methods
.method public onDownloadStart(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;J)V
    .locals 6
    iget-object v0, p0, Lcom/aiderlog/v22app/MainActivity$AiderLogDownloadListener;->this$0:Lcom/aiderlog/v22app/MainActivity;
    invoke-static {v0}, Lcom/aiderlog/v22app/MainActivity;->access$4(Lcom/aiderlog/v22app/MainActivity;)Landroid/webkit/WebView;
    move-result-object v1
    move-object v2, p1
    move-object v3, p2
    move-object v4, p3
    move-object v5, p4
    invoke-static/range {v0 .. v5}, Lcom/aiderlog/v22app/FileDownloads;->download(Landroid/app/Activity;Landroid/webkit/WebView;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V
    return-void
.end method
