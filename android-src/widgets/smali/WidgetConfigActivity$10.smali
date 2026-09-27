.class Lcom/aiderlog/v22app/WidgetConfigActivity$10;
.super Ljava/lang/Object;

# interfaces
.implements Landroid/view/View$OnClickListener;


# instance fields
.field final synthetic this$0:Lcom/aiderlog/v22app/WidgetConfigActivity;


# direct methods
.method constructor <init>(Lcom/aiderlog/v22app/WidgetConfigActivity;)V
    .locals 0

    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetConfigActivity$10;->this$0:Lcom/aiderlog/v22app/WidgetConfigActivity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/view/View;)V
    .locals 1

    iget-object v0, p0, Lcom/aiderlog/v22app/WidgetConfigActivity$10;->this$0:Lcom/aiderlog/v22app/WidgetConfigActivity;

    invoke-virtual {v0}, Lcom/aiderlog/v22app/WidgetConfigActivity;->showThemeDialog()V

    return-void
.end method
