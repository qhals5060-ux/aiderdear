.class Lcom/aiderlog/v22app/WidgetThemeV190$1;
.super Ljava/lang/Object;
.source "WidgetThemeV190.java"

# interfaces
.implements Landroid/content/DialogInterface$OnClickListener;


# annotations
.annotation system Ldalvik/annotation/EnclosingMethod;
    value = Lcom/aiderlog/v22app/WidgetThemeV190;->showDialog(Landroid/app/Activity;)V
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x0
    name = null
.end annotation


# instance fields
.field private final synthetic val$activity:Landroid/app/Activity;


# direct methods
.method constructor <init>(Landroid/app/Activity;)V
    .locals 0

    .line 60
    iput-object p1, p0, Lcom/aiderlog/v22app/WidgetThemeV190$1;->val$activity:Landroid/app/Activity;

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method


# virtual methods
.method public onClick(Landroid/content/DialogInterface;I)V
    .locals 0

    .line 60
    iget-object p1, p0, Lcom/aiderlog/v22app/WidgetThemeV190$1;->val$activity:Landroid/app/Activity;

    invoke-static {p1, p2}, Lcom/aiderlog/v22app/WidgetThemeV190;->choose(Landroid/app/Activity;I)V

    return-void
.end method
