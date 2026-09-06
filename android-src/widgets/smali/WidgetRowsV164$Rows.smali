.class final Lcom/aiderlog/v22app/WidgetRowsV164$Rows;
.super Ljava/lang/Object;
.source "WidgetRowsV164.java"

# interfaces
.implements Landroid/widget/RemoteViewsService$RemoteViewsFactory;


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/aiderlog/v22app/WidgetRowsV164;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x18
    name = "Rows"
.end annotation


# instance fields
.field final context:Landroid/content/Context;

.field items:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field final kind:Ljava/lang/String;

.field final widget:I


# direct methods
.method constructor <init>(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 1

    .line 13
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 12
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    .line 13
    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    const-string p1, "appWidgetId"

    const/4 v0, 0x0

    invoke-virtual {p2, p1, v0}, Landroid/content/Intent;->getIntExtra(Ljava/lang/String;I)I

    move-result p1

    iput p1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->widget:I

    const-string p1, "kind"

    invoke-virtual {p2, p1}, Landroid/content/Intent;->getStringExtra(Ljava/lang/String;)Ljava/lang/String;

    move-result-object p1

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->kind:Ljava/lang/String;

    return-void
.end method


# virtual methods
.method public getCount()I
    .locals 1

    .line 17
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->size()I

    move-result v0

    return v0
.end method

.method public getItemId(I)J
    .locals 4

    .line 21
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-virtual {v0}, Ljava/lang/String;->hashCode()I

    move-result v0

    int-to-long v0, v0

    const/16 v2, 0x20

    shl-long/2addr v0, v2

    int-to-long v2, p1

    xor-long/2addr v0, v2

    return-wide v0
.end method

.method public getLoadingView()Landroid/widget/RemoteViews;
    .locals 1

    .line 19
    const/4 v0, 0x0

    return-object v0
.end method

.method public getViewAt(I)Landroid/widget/RemoteViews;
    .locals 8

    .line 18
    if-ltz p1, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->size()I

    move-result v0

    if-lt p1, v0, :cond_0

    goto :goto_0

    :cond_0
    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    iget v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->widget:I

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->kind:Ljava/lang/String;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    move-object v4, v0

    check-cast v4, Ljava/lang/String;

    const/4 v6, 0x0

    const/4 v7, -0x1

    move v5, p1

    invoke-static/range {v1 .. v7}, Lcom/aiderlog/v22app/WidgetNativeV164;->row(Landroid/content/Context;ILjava/lang/String;Ljava/lang/String;ILjava/lang/String;I)Landroid/widget/RemoteViews;

    move-result-object p1

    goto :goto_1

    :cond_1
    :goto_0
    const/4 p1, 0x0

    :goto_1
    return-object p1
.end method

.method public getViewTypeCount()I
    .locals 1

    .line 20
    const/4 v0, 0x1

    return v0
.end method

.method public hasStableIds()Z
    .locals 1

    .line 22
    const/4 v0, 0x1

    return v0
.end method

.method public onCreate()V
    .locals 0

    .line 14
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->onDataSetChanged()V

    return-void
.end method

.method public onDataSetChanged()V
    .locals 4

    .line 15
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    iget v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->widget:I

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->kind:Ljava/lang/String;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v3

    invoke-static {v0, v1, v2, v3}, Lcom/aiderlog/v22app/WidgetNativeV164;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    return-void
.end method

.method public onDestroy()V
    .locals 1

    .line 16
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->clear()V

    return-void
.end method
