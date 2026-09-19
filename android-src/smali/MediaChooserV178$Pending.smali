.class final Lcom/aiderlog/v22app/MediaChooserV178$Pending;
.super Ljava/lang/Object;
.source "MediaChooserV178.java"


# annotations
.annotation system Ldalvik/annotation/EnclosingClass;
    value = Lcom/aiderlog/v22app/MediaChooserV178;
.end annotation

.annotation system Ldalvik/annotation/InnerClass;
    accessFlags = 0x1a
    name = "Pending"
.end annotation


# instance fields
.field final callback:Landroid/webkit/ValueCallback;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;"
        }
    .end annotation
.end field

.field dialog:Landroid/app/AlertDialog;

.field final multiple:Z

.field final request:I

.field final types:[Ljava/lang/String;


# direct methods
.method constructor <init>(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)V
    .locals 9
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;",
            "Landroid/webkit/WebChromeClient$FileChooserParams;",
            ")V"
        }
    .end annotation

    .line 30
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    .line 31
    iput-object p1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->callback:Landroid/webkit/ValueCallback;

    .line 32
    invoke-virtual {p2}, Landroid/webkit/WebChromeClient$FileChooserParams;->getMode()I

    move-result p1

    const/4 v0, 0x0

    const/4 v1, 0x1

    if-ne p1, v1, :cond_0

    move p1, v1

    goto :goto_0

    :cond_0
    move p1, v0

    :goto_0
    iput-boolean p1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->multiple:Z

    .line 33
    new-instance p1, Ljava/util/LinkedHashSet;

    invoke-direct {p1}, Ljava/util/LinkedHashSet;-><init>()V

    .line 34
    invoke-virtual {p2}, Landroid/webkit/WebChromeClient$FileChooserParams;->getAcceptTypes()[Ljava/lang/String;

    move-result-object p2

    array-length v2, p2

    move v3, v0

    :goto_1
    if-lt v3, v2, :cond_3

    .line 42
    invoke-virtual {p1}, Ljava/util/LinkedHashSet;->isEmpty()Z

    move-result p2

    if-eqz p2, :cond_1

    const-string p2, "*/*"

    invoke-virtual {p1, p2}, Ljava/util/LinkedHashSet;->add(Ljava/lang/Object;)Z

    .line 43
    :cond_1
    new-array p2, v0, [Ljava/lang/String;

    invoke-virtual {p1, p2}, Ljava/util/LinkedHashSet;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object p1

    check-cast p1, [Ljava/lang/String;

    iput-object p1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    .line 44
    invoke-static {}, Lcom/aiderlog/v22app/MediaChooserV178;->access$0()I

    move-result p1

    add-int/lit8 p2, p1, 0x1

    invoke-static {p2}, Lcom/aiderlog/v22app/MediaChooserV178;->access$1(I)V

    iput p1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->request:I

    .line 45
    invoke-static {}, Lcom/aiderlog/v22app/MediaChooserV178;->access$0()I

    move-result p1

    const p2, 0xea60

    if-le p1, p2, :cond_2

    const/16 p1, 0x2ee0

    invoke-static {p1}, Lcom/aiderlog/v22app/MediaChooserV178;->access$1(I)V

    .line 46
    :cond_2
    return-void

    .line 34
    :cond_3
    aget-object v4, p2, v3

    .line 35
    if-nez v4, :cond_4

    goto :goto_3

    .line 36
    :cond_4
    const-string v5, ","

    invoke-virtual {v4, v5}, Ljava/lang/String;->split(Ljava/lang/String;)[Ljava/lang/String;

    move-result-object v4

    array-length v5, v4

    move v6, v0

    :goto_2
    if-lt v6, v5, :cond_5

    .line 34
    :goto_3
    add-int/lit8 v3, v3, 0x1

    goto :goto_1

    .line 36
    :cond_5
    aget-object v7, v4, v6

    .line 37
    invoke-virtual {v7}, Ljava/lang/String;->trim()Ljava/lang/String;

    move-result-object v7

    sget-object v8, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {v7, v8}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v7

    .line 38
    const-string v8, "."

    invoke-virtual {v7, v8}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v8

    if-eqz v8, :cond_6

    invoke-static {}, Landroid/webkit/MimeTypeMap;->getSingleton()Landroid/webkit/MimeTypeMap;

    move-result-object v8

    invoke-virtual {v7, v1}, Ljava/lang/String;->substring(I)Ljava/lang/String;

    move-result-object v7

    invoke-virtual {v8, v7}, Landroid/webkit/MimeTypeMap;->getMimeTypeFromExtension(Ljava/lang/String;)Ljava/lang/String;

    move-result-object v7

    .line 39
    :cond_6
    if-eqz v7, :cond_7

    const-string v8, "/"

    invoke-virtual {v7, v8}, Ljava/lang/String;->contains(Ljava/lang/CharSequence;)Z

    move-result v8

    if-eqz v8, :cond_7

    invoke-virtual {p1, v7}, Ljava/util/LinkedHashSet;->add(Ljava/lang/Object;)Z

    .line 36
    :cond_7
    add-int/lit8 v6, v6, 0x1

    goto :goto_2
.end method


# virtual methods
.method mediaOnly()Z
    .locals 6

    .line 48
    iget-object v0, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    array-length v1, v0

    const/4 v2, 0x0

    move v3, v2

    :goto_0
    if-lt v3, v1, :cond_0

    .line 49
    const/4 v0, 0x1

    return v0

    .line 48
    :cond_0
    aget-object v4, v0, v3

    const-string v5, "image/"

    invoke-virtual {v4, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v5

    if-nez v5, :cond_1

    const-string v5, "video/"

    invoke-virtual {v4, v5}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_1

    return v2

    :cond_1
    add-int/lit8 v3, v3, 0x1

    goto :goto_0
.end method
