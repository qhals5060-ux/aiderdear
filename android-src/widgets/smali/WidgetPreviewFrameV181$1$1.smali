.class Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;
.super Ljava/lang/Object;
.source "WidgetPreviewFrameV181.java"

# interfaces
.implements Ljava/lang/Runnable;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->onLayoutChange(Landroid/view/View;IIIIIIII)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field final synthetic this$1:Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;

.field private final synthetic val$activity:Landroid/app/Activity;


# direct methods
.method constructor <init>(Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;Landroid/app/Activity;)V
    .locals 0

    .line 32
    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;->this$1:Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;

    iput-object p2, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;->val$activity:Landroid/app/Activity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public run()V
    .locals 1

    .line 32
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;->val$activity:Landroid/app/Activity;

    invoke-virtual {v0}, Landroid/app/Activity;->isFinishing()Z

    move-result v0

    if-nez v0, :cond_0

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;->val$activity:Landroid/app/Activity;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V

    :cond_0
    return-void
.end method
