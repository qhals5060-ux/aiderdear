.class Lcom/aiderlog/v22app/WidgetDesignV165$2;
.super Ljava/lang/Object;
.source "WidgetDesignV165.java"

# interfaces
.implements Landroid/content/DialogInterface$OnClickListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/aiderlog/v22app/WidgetDesignV165;->showContentDialog(Landroid/app/Activity;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field private final synthetic val$activity:Landroid/app/Activity;

.field private final synthetic val$choices:Ljava/util/List;

.field private final synthetic val$selected:Ljava/lang/reflect/Field;


# direct methods
.method constructor <init>(Ljava/lang/reflect/Field;Landroid/app/Activity;Ljava/util/List;)V
    .locals 0

    .line 154
    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$selected:Ljava/lang/reflect/Field;

    iput-object p2, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$activity:Landroid/app/Activity;

    iput-object p3, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$choices:Ljava/util/List;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/content/DialogInterface;I)V
    .locals 2

    .line 154
    :try_start_0
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$selected:Ljava/lang/reflect/Field;

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$activity:Landroid/app/Activity;

    iget-object v1, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$choices:Ljava/util/List;

    invoke-interface {v1, p2}, Ljava/util/List;->get(I)Ljava/lang/Object;

    move-result-object p2

    check-cast p2, Lorg/json/JSONObject;

    invoke-virtual {p2}, Lorg/json/JSONObject;->toString()Ljava/lang/String;

    move-result-object p2

    invoke-virtual {p1, v0, p2}, Ljava/lang/reflect/Field;->set(Ljava/lang/Object;Ljava/lang/Object;)V

    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetDesignV165$2;->val$activity:Landroid/app/Activity;

    invoke-static {p1}, Lcom/aiderlog/v22app/WidgetNativeV164;->preview(Landroid/app/Activity;)V
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    goto :goto_0

    :catch_0
    move-exception p1

    :goto_0
    return-void
.end method
