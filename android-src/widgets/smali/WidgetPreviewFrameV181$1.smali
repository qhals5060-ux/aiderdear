.class Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;
.super Ljava/lang/Object;
.source "WidgetPreviewFrameV181.java"

# interfaces
.implements Landroid/view/View$OnLayoutChangeListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->prepare(Landroid/app/Activity;Landroid/view/ViewGroup;Ljava/lang/String;)Z
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field private final synthetic val$activity:Landroid/app/Activity;

.field private final synthetic val$host:Landroid/view/ViewGroup;


# direct methods
.method constructor <init>(Landroid/view/ViewGroup;Landroid/app/Activity;)V
    .locals 0

    .line 24
    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$host:Landroid/view/ViewGroup;

    iput-object p2, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$activity:Landroid/app/Activity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onLayoutChange(Landroid/view/View;IIIIIIII)V
    .locals 0

    .line 26
    sub-int/2addr p4, p2

    if-gtz p4, :cond_0

    return-void

    .line 27
    :cond_0
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$host:Landroid/view/ViewGroup;

    invoke-virtual {p1, p0}, Landroid/view/ViewGroup;->removeOnLayoutChangeListener(Landroid/view/View$OnLayoutChangeListener;)V

    invoke-static {}, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->access$0()Ljava/util/WeakHashMap;

    move-result-object p1

    iget-object p2, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$host:Landroid/view/ViewGroup;

    invoke-virtual {p1, p2}, Ljava/util/WeakHashMap;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 28
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$activity:Landroid/app/Activity;

    invoke-virtual {p1}, Landroid/app/Activity;->isFinishing()Z

    move-result p1

    if-nez p1, :cond_1

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$host:Landroid/view/ViewGroup;

    new-instance p2, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;

    iget-object p3, p0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;->val$activity:Landroid/app/Activity;

    invoke-direct {p2, p0, p3}, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1$1;-><init>(Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;Landroid/app/Activity;)V

    invoke-virtual {p1, p2}, Landroid/view/ViewGroup;->post(Ljava/lang/Runnable;)Z

    .line 29
    :cond_1
    return-void
.end method
