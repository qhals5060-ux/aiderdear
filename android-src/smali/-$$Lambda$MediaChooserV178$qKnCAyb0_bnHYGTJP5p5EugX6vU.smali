.class public final synthetic Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;
.super Ljava/lang/Object;
.source "lambda"

# interfaces
.implements Landroid/content/DialogInterface$OnCancelListener;


# instance fields
.field public final synthetic f$0:Landroid/app/Activity;

.field public final synthetic f$1:Lcom/aiderlog/v22app/MediaChooserV178$Pending;


# direct methods
.method public synthetic constructor <init>(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;)V
    .locals 0

    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    iput-object p1, p0, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;->f$0:Landroid/app/Activity;

    iput-object p2, p0, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;->f$1:Lcom/aiderlog/v22app/MediaChooserV178$Pending;

    return-void
.end method


# virtual methods
.method public final onCancel(Landroid/content/DialogInterface;)V
    .locals 2

    iget-object v0, p0, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;->f$0:Landroid/app/Activity;

    iget-object v1, p0, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;->f$1:Lcom/aiderlog/v22app/MediaChooserV178$Pending;

    invoke-static {v0, v1, p1}, Lcom/aiderlog/v22app/MediaChooserV178;->lambda$2(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Landroid/content/DialogInterface;)V

    return-void
.end method
