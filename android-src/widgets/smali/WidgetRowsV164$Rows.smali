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
.field final bounds:Landroid/util/SizeF;

.field final context:Landroid/content/Context;

.field volatile items:Ljava/util/List;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/List<",
            "Ljava/lang/String;",
            ">;"
        }
    .end annotation
.end field

.field final kind:Ljava/lang/String;

.field volatile owner:Ljava/lang/String;

.field final widget:I


# direct methods
.method constructor <init>(Landroid/content/Context;Landroid/content/Intent;)V
    .locals 3

    .line 13
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 12
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;

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

    new-instance p1, Landroid/util/SizeF;

    const-string v0, "widthDp"

    const/high16 v1, 0x43a80000    # 336.0f

    invoke-virtual {p2, v0, v1}, Landroid/content/Intent;->getFloatExtra(Ljava/lang/String;F)F

    move-result v0

    const-string v1, "heightDp"

    const/high16 v2, 0x43a00000    # 320.0f

    invoke-virtual {p2, v1, v2}, Landroid/content/Intent;->getFloatExtra(Ljava/lang/String;F)F

    move-result p2

    invoke-direct {p1, v0, p2}, Landroid/util/SizeF;-><init>(FF)V

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->bounds:Landroid/util/SizeF;

    return-void
.end method


# virtual methods
.method currentOwner()Z
    .locals 2

    .line 17
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    invoke-static {v1}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v1

    invoke-static {v0, v1}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->sameOwner(Ljava/lang/String;Lorg/json/JSONObject;)Z

    move-result v0

    return v0
.end method

.method public declared-synchronized getCount()I
    .locals 1

    monitor-enter p0

    .line 20
    :try_start_0
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->refreshRows()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->currentOwner()Z

    move-result v0

    if-eqz v0, :cond_0

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->size()I

    move-result v0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_0

    :cond_0
    const/4 v0, 0x0

    :goto_0
    monitor-exit p0

    return v0

    .line 20
    :catchall_0
    move-exception v0

    monitor-exit p0

    throw v0
.end method

.method public declared-synchronized getItemId(I)J
    .locals 2

    monitor-enter p0

    .line 24
    :try_start_0
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->refreshRows()V

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->currentOwner()Z

    move-result v0

    if-eqz v0, :cond_1

    if-ltz p1, :cond_1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0}, Ljava/util/List;->size()I

    move-result v0

    if-lt p1, v0, :cond_0

    goto :goto_0

    :cond_0
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0, p1}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Ljava/lang/String;

    invoke-static {v0, p1}, Lcom/aiderlog/v22app/WidgetDesignV165;->stableId(Ljava/lang/String;I)J

    move-result-wide v0
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    goto :goto_1

    :cond_1
    :goto_0
    int-to-long v0, p1

    :goto_1
    monitor-exit p0

    return-wide v0

    .line 24
    :catchall_0
    move-exception p1

    monitor-exit p0

    throw p1
.end method

.method public getLoadingView()Landroid/widget/RemoteViews;
    .locals 1

    .line 22
    const/4 v0, 0x0

    return-object v0
.end method

.method public declared-synchronized getViewAt(I)Landroid/widget/RemoteViews;
    .locals 8

    monitor-enter p0

    .line 21
    :try_start_0
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->refreshRows()V

    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->bounds:Landroid/util/SizeF;

    invoke-virtual {v0, v1}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_1

    :try_start_1
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->currentOwner()Z

    move-result v0

    if-eqz v0, :cond_1

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
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    goto :goto_1

    :cond_1
    :goto_0
    const/4 p1, 0x0

    :goto_1
    :try_start_2
    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_1

    monitor-exit p0

    return-object p1

    :catchall_0
    move-exception p1

    :try_start_3
    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V

    throw p1
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    .line 21
    :catchall_1
    move-exception p1

    monitor-exit p0

    throw p1
.end method

.method public getViewTypeCount()I
    .locals 1

    .line 23
    const/16 v0, 0x10

    return v0
.end method

.method public hasStableIds()Z
    .locals 1

    .line 25
    const/4 v0, 0x1

    return v0
.end method

.method public declared-synchronized onCreate()V
    .locals 1

    monitor-enter p0

    .line 14
    :try_start_0
    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->onDataSetChanged()V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    monitor-exit p0

    return-void

    .line 14
    :catchall_0
    move-exception v0

    monitor-exit p0

    throw v0
.end method

.method public declared-synchronized onDataSetChanged()V
    .locals 4

    monitor-enter p0

    .line 15
    :try_start_0
    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->bounds:Landroid/util/SizeF;

    invoke-virtual {v0, v1}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_1

    :try_start_1
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v0

    const-string v1, ""

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    iget v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->widget:I

    iget-object v3, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->kind:Ljava/lang/String;

    invoke-static {v1, v2, v3, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v1

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v0

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    :try_start_2
    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_1

    monitor-exit p0

    return-void

    :catchall_0
    move-exception v0

    :try_start_3
    sget-object v1, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v1}, Ljava/lang/ThreadLocal;->remove()V

    throw v0
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    .line 15
    :catchall_1
    move-exception v0

    monitor-exit p0

    throw v0
.end method

.method public declared-synchronized onDestroy()V
    .locals 1

    monitor-enter p0

    .line 16
    :try_start_0
    new-instance v0, Ljava/util/ArrayList;

    invoke-direct {v0}, Ljava/util/ArrayList;-><init>()V

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    const-string v0, ""

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_0

    monitor-exit p0

    return-void

    .line 16
    :catchall_0
    move-exception v0

    monitor-exit p0

    throw v0
.end method

.method declared-synchronized refreshRows()V
    .locals 5

    monitor-enter p0

    .line 19
    :try_start_0
    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->bounds:Landroid/util/SizeF;

    invoke-virtual {v0, v1}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V
    :try_end_0
    .catchall {:try_start_0 .. :try_end_0} :catchall_1

    :try_start_1
    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->snapshot(Landroid/content/Context;)Lorg/json/JSONObject;

    move-result-object v0

    invoke-static {v0}, Lcom/aiderlog/v22app/WidgetCompactCalendarV181;->owner(Lorg/json/JSONObject;)Ljava/lang/String;

    move-result-object v1

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->context:Landroid/content/Context;

    iget v3, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->widget:I

    iget-object v4, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->kind:Ljava/lang/String;

    invoke-static {v2, v3, v4, v0}, Lcom/aiderlog/v22app/WidgetNativeV164;->rows(Landroid/content/Context;ILjava/lang/String;Lorg/json/JSONObject;)Ljava/util/List;

    move-result-object v0

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;

    invoke-virtual {v1, v2}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-eqz v2, :cond_0

    iget-object v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    invoke-interface {v0, v2}, Ljava/util/List;->equals(Ljava/lang/Object;)Z

    move-result v2

    if-nez v2, :cond_1

    :cond_0
    const-string v2, ""

    iput-object v2, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;

    iput-object v0, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->items:Ljava/util/List;

    iput-object v1, p0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;->owner:Ljava/lang/String;
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    :cond_1
    :try_start_2
    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V
    :try_end_2
    .catchall {:try_start_2 .. :try_end_2} :catchall_1

    monitor-exit p0

    return-void

    :catchall_0
    move-exception v0

    :try_start_3
    sget-object v1, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v1}, Ljava/lang/ThreadLocal;->remove()V

    throw v0
    :try_end_3
    .catchall {:try_start_3 .. :try_end_3} :catchall_1

    .line 19
    :catchall_1
    move-exception v0

    monitor-exit p0

    throw v0
.end method
