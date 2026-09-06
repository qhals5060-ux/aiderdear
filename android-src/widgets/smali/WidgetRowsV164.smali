.class public final Lcom/aiderlog/v22app/WidgetRowsV164;
.super Landroid/widget/RemoteViewsService;
.source "WidgetRowsV164.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/aiderlog/v22app/WidgetRowsV164$Rows;
    }
.end annotation


# direct methods
.method public constructor <init>()V
    .locals 0

    .line 9
    invoke-direct {p0}, Landroid/widget/RemoteViewsService;-><init>()V

    return-void
.end method


# virtual methods
.method public onGetViewFactory(Landroid/content/Intent;)Landroid/widget/RemoteViewsService$RemoteViewsFactory;
    .locals 2

    .line 10
    new-instance v0, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;

    invoke-virtual {p0}, Lcom/aiderlog/v22app/WidgetRowsV164;->getApplicationContext()Landroid/content/Context;

    move-result-object v1

    invoke-direct {v0, v1, p1}, Lcom/aiderlog/v22app/WidgetRowsV164$Rows;-><init>(Landroid/content/Context;Landroid/content/Intent;)V

    return-object v0
.end method
