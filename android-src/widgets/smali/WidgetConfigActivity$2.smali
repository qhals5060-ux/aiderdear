.class Lcom/aiderlog/v22app/WidgetConfigActivity$2;
.super Ljava/lang/Object;
.source "WidgetConfigActivity.java"

# interfaces
.implements Landroid/content/DialogInterface$OnClickListener;


# instance fields
.field final synthetic this$0:Lcom/aiderlog/v22app/WidgetConfigActivity;


# direct methods
.method constructor <init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    .locals 0

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetConfigActivity$2;->this$0:Lcom/aiderlog/v22app/WidgetConfigActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/content/DialogInterface;I)V
    .locals 1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity$2;->this$0:Lcom/aiderlog/v22app/WidgetConfigActivity;

    invoke-virtual {v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->showOpacityDialog()V

    return-void
.end method
