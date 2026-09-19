.class public final Lcom/aiderlog/v22app/MediaChooserV178;
.super Ljava/lang/Object;
.source "MediaChooserV178.java"


# annotations
.annotation system Ldalvik/annotation/MemberClasses;
    value = {
        Lcom/aiderlog/v22app/MediaChooserV178$Pending;
    }
.end annotation


# static fields
.field private static nextRequest:I

.field private static final pending:Ljava/util/WeakHashMap;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/WeakHashMap<",
            "Landroid/app/Activity;",
            "Lcom/aiderlog/v22app/MediaChooserV178$Pending;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 21
    new-instance v0, Ljava/util/WeakHashMap;

    invoke-direct {v0}, Ljava/util/WeakHashMap;-><init>()V

    sput-object v0, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    .line 22
    const/16 v0, 0x2ee0

    sput v0, Lcom/aiderlog/v22app/MediaChooserV178;->nextRequest:I

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 20
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method private static accepted([Ljava/lang/String;Ljava/lang/String;)Z
    .locals 7

    .line 121
    array-length v0, p0

    const/4 v1, 0x0

    move v2, v1

    :goto_0
    if-lt v2, v0, :cond_0

    .line 123
    return v1

    .line 121
    :cond_0
    aget-object v3, p0, v2

    const-string v4, "*/*"

    invoke-virtual {v4, v3}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v4

    const/4 v5, 0x1

    if-nez v4, :cond_2

    invoke-virtual {v3, p1}, Ljava/lang/String;->equalsIgnoreCase(Ljava/lang/String;)Z

    move-result v4

    if-nez v4, :cond_2

    .line 122
    const-string v4, "/*"

    invoke-virtual {v3, v4}, Ljava/lang/String;->endsWith(Ljava/lang/String;)Z

    move-result v4

    if-eqz v4, :cond_1

    sget-object v4, Ljava/util/Locale;->ROOT:Ljava/util/Locale;

    invoke-virtual {p1, v4}, Ljava/lang/String;->toLowerCase(Ljava/util/Locale;)Ljava/lang/String;

    move-result-object v4

    invoke-virtual {v3}, Ljava/lang/String;->length()I

    move-result v6

    sub-int/2addr v6, v5

    invoke-virtual {v3, v1, v6}, Ljava/lang/String;->substring(II)Ljava/lang/String;

    move-result-object v3

    invoke-virtual {v4, v3}, Ljava/lang/String;->startsWith(Ljava/lang/String;)Z

    move-result v3

    if-eqz v3, :cond_1

    goto :goto_1

    .line 121
    :cond_1
    add-int/lit8 v2, v2, 0x1

    goto :goto_0

    .line 122
    :cond_2
    :goto_1
    return v5
.end method

.method static synthetic access$0()I
    .locals 1

    .line 22
    sget v0, Lcom/aiderlog/v22app/MediaChooserV178;->nextRequest:I

    return v0
.end method

.method static synthetic access$1(I)V
    .locals 0

    .line 22
    sput p0, Lcom/aiderlog/v22app/MediaChooserV178;->nextRequest:I

    return-void
.end method

.method public static cancel(Landroid/app/Activity;)V
    .locals 2

    .line 132
    sget-object v0, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    invoke-virtual {v0, p0}, Ljava/util/WeakHashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;

    .line 133
    if-eqz v0, :cond_0

    const/4 v1, 0x0

    invoke-static {p0, v0, v1}, Lcom/aiderlog/v22app/MediaChooserV178;->finish(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;[Landroid/net/Uri;)V

    .line 134
    :cond_0
    return-void
.end method

.method public static consume(Landroid/app/Activity;IILandroid/content/Intent;)Z
    .locals 9

    .line 92
    const/4 v0, 0x0

    const/16 v1, 0x2ee0

    if-lt p1, v1, :cond_12

    const v1, 0xea60

    if-le p1, v1, :cond_0

    goto/16 :goto_9

    .line 93
    :cond_0
    sget-object v1, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    invoke-virtual {v1, p0}, Ljava/util/WeakHashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;

    .line 95
    const/4 v2, 0x1

    if-eqz v1, :cond_11

    iget v3, v1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->request:I

    if-eq v3, p1, :cond_1

    goto/16 :goto_8

    .line 96
    :cond_1
    new-instance p1, Ljava/util/ArrayList;

    invoke-direct {p1}, Ljava/util/ArrayList;-><init>()V

    .line 97
    nop

    .line 98
    const/4 v3, -0x1

    if-ne p2, v3, :cond_e

    if-eqz p3, :cond_e

    .line 99
    invoke-virtual {p3}, Landroid/content/Intent;->getClipData()Landroid/content/ClipData;

    move-result-object p2

    .line 100
    if-nez p2, :cond_3

    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v3

    if-nez v3, :cond_2

    move v3, v0

    goto :goto_0

    :cond_2
    move v3, v2

    goto :goto_0

    :cond_3
    invoke-virtual {p2}, Landroid/content/ClipData;->getItemCount()I

    move-result v3

    .line 101
    :goto_0
    move v4, v0

    move v5, v4

    :goto_1
    if-lt v4, v3, :cond_4

    goto/16 :goto_6

    .line 102
    :cond_4
    if-nez p2, :cond_5

    invoke-virtual {p3}, Landroid/content/Intent;->getData()Landroid/net/Uri;

    move-result-object v6

    goto :goto_2

    :cond_5
    invoke-virtual {p2, v4}, Landroid/content/ClipData;->getItemAt(I)Landroid/content/ClipData$Item;

    move-result-object v6

    invoke-virtual {v6}, Landroid/content/ClipData$Item;->getUri()Landroid/net/Uri;

    move-result-object v6

    .line 103
    :goto_2
    if-eqz v6, :cond_c

    invoke-virtual {v6}, Landroid/net/Uri;->getScheme()Ljava/lang/String;

    move-result-object v7

    const-string v8, "content"

    invoke-virtual {v8, v7}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_6

    goto :goto_4

    .line 106
    :cond_6
    :try_start_0
    invoke-virtual {p0}, Landroid/app/Activity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v7

    invoke-virtual {v7, v6}, Landroid/content/ContentResolver;->getType(Landroid/net/Uri;)Ljava/lang/String;

    move-result-object v7

    .line 107
    if-eqz v7, :cond_7

    iget-object v8, v1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    invoke-static {v8, v7}, Lcom/aiderlog/v22app/MediaChooserV178;->accepted([Ljava/lang/String;Ljava/lang/String;)Z

    move-result v7
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_0

    if-nez v7, :cond_7

    move v5, v2

    goto :goto_5

    .line 108
    :cond_7
    :try_start_1
    invoke-virtual {p0}, Landroid/app/Activity;->getContentResolver()Landroid/content/ContentResolver;

    move-result-object v7

    const-string v8, "r"

    invoke-virtual {v7, v6, v8}, Landroid/content/ContentResolver;->openAssetFileDescriptor(Landroid/net/Uri;Ljava/lang/String;)Landroid/content/res/AssetFileDescriptor;

    move-result-object v7

    .line 109
    if-nez v7, :cond_9

    .line 110
    if-eqz v7, :cond_8

    invoke-virtual {v7}, Landroid/content/res/AssetFileDescriptor;->close()V

    .line 101
    :cond_8
    move v5, v2

    goto :goto_5

    .line 110
    :cond_9
    if-eqz v7, :cond_a

    invoke-virtual {v7}, Landroid/content/res/AssetFileDescriptor;->close()V
    :try_end_1
    .catchall {:try_start_1 .. :try_end_1} :catchall_0

    .line 111
    :cond_a
    :try_start_2
    invoke-virtual {p1, v6}, Ljava/util/ArrayList;->contains(Ljava/lang/Object;)Z

    move-result v7

    if-nez v7, :cond_b

    invoke-virtual {p1, v6}, Ljava/util/ArrayList;->add(Ljava/lang/Object;)Z

    .line 112
    goto :goto_3

    .line 110
    :catchall_0
    move-exception v5

    throw v5
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_0

    .line 112
    :catch_0
    move-exception v5

    move v5, v2

    .line 113
    :cond_b
    :goto_3
    iget-boolean v6, v1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->multiple:Z

    if-nez v6, :cond_d

    invoke-virtual {p1}, Ljava/util/ArrayList;->isEmpty()Z

    move-result v6

    if-nez v6, :cond_d

    goto :goto_6

    .line 103
    :cond_c
    :goto_4
    move v5, v2

    .line 101
    :cond_d
    :goto_5
    add-int/lit8 v4, v4, 0x1

    goto :goto_1

    .line 116
    :cond_e
    move v5, v0

    :goto_6
    invoke-virtual {p1}, Ljava/util/ArrayList;->isEmpty()Z

    move-result p2

    if-eqz p2, :cond_f

    const/4 p1, 0x0

    goto :goto_7

    :cond_f
    new-array p2, v0, [Landroid/net/Uri;

    invoke-virtual {p1, p2}, Ljava/util/ArrayList;->toArray([Ljava/lang/Object;)[Ljava/lang/Object;

    move-result-object p1

    check-cast p1, [Landroid/net/Uri;

    :goto_7
    invoke-static {p0, v1, p1}, Lcom/aiderlog/v22app/MediaChooserV178;->finish(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;[Landroid/net/Uri;)V

    .line 117
    if-eqz v5, :cond_10

    const-string p1, "\uc77d\uc744 \uc218 \uc5c6\uac70\ub098 \uc9c0\uc6d0\ud558\uc9c0 \uc54a\ub294 \ud30c\uc77c\uc740 \uc81c\uc678\ud588\uc2b5\ub2c8\ub2e4."

    invoke-static {p0, p1, v2}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p0

    invoke-virtual {p0}, Landroid/widget/Toast;->show()V

    .line 118
    :cond_10
    return v2

    .line 95
    :cond_11
    :goto_8
    return v2

    .line 92
    :cond_12
    :goto_9
    return v0
.end method

.method private static files(Lcom/aiderlog/v22app/MediaChooserV178$Pending;Z)Landroid/content/Intent;
    .locals 3

    .line 66
    new-instance v0, Landroid/content/Intent;

    if-eqz p1, :cond_0

    const-string p1, "android.intent.action.GET_CONTENT"

    goto :goto_0

    :cond_0
    const-string p1, "android.intent.action.OPEN_DOCUMENT"

    :goto_0
    invoke-direct {v0, p1}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 67
    const-string p1, "android.intent.category.OPENABLE"

    invoke-virtual {v0, p1}, Landroid/content/Intent;->addCategory(Ljava/lang/String;)Landroid/content/Intent;

    .line 68
    const/4 p1, 0x1

    invoke-virtual {v0, p1}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;

    .line 69
    iget-object v1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    array-length v1, v1

    if-ne v1, p1, :cond_1

    iget-object v1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    const/4 v2, 0x0

    aget-object v1, v1, v2

    goto :goto_1

    :cond_1
    const-string v1, "*/*"

    :goto_1
    invoke-virtual {v0, v1}, Landroid/content/Intent;->setType(Ljava/lang/String;)Landroid/content/Intent;

    .line 70
    iget-object v1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    array-length v1, v1

    if-le v1, p1, :cond_2

    iget-object p1, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    const-string v1, "android.intent.extra.MIME_TYPES"

    invoke-virtual {v0, v1, p1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;[Ljava/lang/String;)Landroid/content/Intent;

    .line 71
    :cond_2
    iget-boolean p0, p0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->multiple:Z

    const-string p1, "android.intent.extra.ALLOW_MULTIPLE"

    invoke-virtual {v0, p1, p0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;

    .line 72
    return-object v0
.end method

.method private static finish(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;[Landroid/net/Uri;)V
    .locals 1

    .line 126
    sget-object v0, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    invoke-virtual {v0, p0}, Ljava/util/WeakHashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    if-eq v0, p1, :cond_0

    return-void

    .line 127
    :cond_0
    sget-object v0, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    invoke-virtual {v0, p0}, Ljava/util/WeakHashMap;->remove(Ljava/lang/Object;)Ljava/lang/Object;

    .line 128
    iget-object p0, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->dialog:Landroid/app/AlertDialog;

    if-eqz p0, :cond_1

    iget-object p0, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->dialog:Landroid/app/AlertDialog;

    invoke-virtual {p0}, Landroid/app/AlertDialog;->dismiss()V

    .line 129
    :cond_1
    iget-object p0, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->callback:Landroid/webkit/ValueCallback;

    invoke-interface {p0, p2}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    .line 130
    return-void
.end method

.method static synthetic lambda$0(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 58
    if-nez p3, :cond_0

    const/4 p2, 0x1

    goto :goto_0

    :cond_0
    const/4 p2, 0x0

    :goto_0
    invoke-static {p0, p1, p2}, Lcom/aiderlog/v22app/MediaChooserV178;->launch(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Z)V

    return-void
.end method

.method static synthetic lambda$1(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Landroid/content/DialogInterface;I)V
    .locals 0

    .line 59
    const/4 p2, 0x0

    invoke-static {p0, p1, p2}, Lcom/aiderlog/v22app/MediaChooserV178;->finish(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;[Landroid/net/Uri;)V

    return-void
.end method

.method static synthetic lambda$2(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Landroid/content/DialogInterface;)V
    .locals 0

    .line 60
    const/4 p2, 0x0

    invoke-static {p0, p1, p2}, Lcom/aiderlog/v22app/MediaChooserV178;->finish(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;[Landroid/net/Uri;)V

    return-void
.end method

.method private static launch(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Z)V
    .locals 5

    .line 75
    sget-object v0, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    invoke-virtual {v0, p0}, Ljava/util/WeakHashMap;->get(Ljava/lang/Object;)Ljava/lang/Object;

    move-result-object v0

    if-eq v0, p1, :cond_0

    return-void

    .line 77
    :cond_0
    const/4 v0, 0x1

    if-eqz p2, :cond_3

    :try_start_0
    sget v1, Landroid/os/Build$VERSION;->SDK_INT:I

    const/16 v2, 0x21

    if-lt v1, v2, :cond_3

    .line 78
    new-instance v1, Landroid/content/Intent;

    const-string v2, "android.provider.action.PICK_IMAGES"

    invoke-direct {v1, v2}, Landroid/content/Intent;-><init>(Ljava/lang/String;)V

    .line 79
    iget-object v2, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    array-length v2, v2

    if-ne v2, v0, :cond_1

    iget-object v2, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->types:[Ljava/lang/String;

    const/4 v3, 0x0

    aget-object v2, v2, v3

    invoke-virtual {v1, v2}, Landroid/content/Intent;->setType(Ljava/lang/String;)Landroid/content/Intent;

    .line 80
    :cond_1
    iget-boolean v2, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->multiple:Z

    if-eqz v2, :cond_2

    const-string v2, "android.provider.extra.PICK_IMAGES_MAX"

    const/16 v3, 0xc

    invoke-static {}, Landroid/provider/MediaStore;->getPickImagesMaxLimit()I

    move-result v4

    invoke-static {v3, v4}, Ljava/lang/Math;->min(II)I

    move-result v3

    invoke-virtual {v1, v2, v3}, Landroid/content/Intent;->putExtra(Ljava/lang/String;I)Landroid/content/Intent;

    .line 81
    :cond_2
    invoke-virtual {v1, v0}, Landroid/content/Intent;->addFlags(I)Landroid/content/Intent;
    :try_end_0
    .catch Ljava/lang/Exception; {:try_start_0 .. :try_end_0} :catch_1

    .line 82
    :try_start_1
    iget v2, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->request:I

    invoke-virtual {p0, v1, v2}, Landroid/app/Activity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_1
    .catch Landroid/content/ActivityNotFoundException; {:try_start_1 .. :try_end_1} :catch_0
    .catch Ljava/lang/Exception; {:try_start_1 .. :try_end_1} :catch_1

    return-void

    .line 83
    :catch_0
    move-exception v1

    .line 85
    :cond_3
    :try_start_2
    invoke-static {p1, p2}, Lcom/aiderlog/v22app/MediaChooserV178;->files(Lcom/aiderlog/v22app/MediaChooserV178$Pending;Z)Landroid/content/Intent;

    move-result-object v1

    if-eqz p2, :cond_4

    const-string p2, "\uc568\ubc94\uc5d0\uc11c \uc120\ud0dd"

    goto :goto_0

    :cond_4
    const-string p2, "\ub0b4 \ud30c\uc77c\uc5d0\uc11c \uc120\ud0dd"

    :goto_0
    invoke-static {v1, p2}, Landroid/content/Intent;->createChooser(Landroid/content/Intent;Ljava/lang/CharSequence;)Landroid/content/Intent;

    move-result-object p2

    iget v1, p1, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->request:I

    invoke-virtual {p0, p2, v1}, Landroid/app/Activity;->startActivityForResult(Landroid/content/Intent;I)V
    :try_end_2
    .catch Ljava/lang/Exception; {:try_start_2 .. :try_end_2} :catch_1

    .line 86
    goto :goto_1

    :catch_1
    move-exception p2

    .line 87
    const/4 p2, 0x0

    invoke-static {p0, p1, p2}, Lcom/aiderlog/v22app/MediaChooserV178;->finish(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;[Landroid/net/Uri;)V

    .line 88
    const-string p1, "\uc120\ud0dd\uae30\ub97c \uc5f4\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. \ub2e4\uc2dc \ub20c\ub7ec \ub0b4 \ud30c\uc77c\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694."

    invoke-static {p0, p1, v0}, Landroid/widget/Toast;->makeText(Landroid/content/Context;Ljava/lang/CharSequence;I)Landroid/widget/Toast;

    move-result-object p0

    invoke-virtual {p0}, Landroid/widget/Toast;->show()V

    .line 90
    :goto_1
    return-void
.end method

.method public static show(Landroid/app/Activity;Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)Z
    .locals 3
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "(",
            "Landroid/app/Activity;",
            "Landroid/webkit/ValueCallback<",
            "[",
            "Landroid/net/Uri;",
            ">;",
            "Landroid/webkit/WebChromeClient$FileChooserParams;",
            ")Z"
        }
    .end annotation

    .line 52
    invoke-static {p0}, Lcom/aiderlog/v22app/MediaChooserV178;->cancel(Landroid/app/Activity;)V

    .line 53
    invoke-virtual {p0}, Landroid/app/Activity;->isFinishing()Z

    move-result v0

    const/4 v1, 0x1

    if-nez v0, :cond_2

    invoke-virtual {p0}, Landroid/app/Activity;->isDestroyed()Z

    move-result v0

    if-eqz v0, :cond_0

    goto :goto_1

    .line 54
    :cond_0
    new-instance v0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;

    invoke-direct {v0, p1, p2}, Lcom/aiderlog/v22app/MediaChooserV178$Pending;-><init>(Landroid/webkit/ValueCallback;Landroid/webkit/WebChromeClient$FileChooserParams;)V

    .line 55
    sget-object p1, Lcom/aiderlog/v22app/MediaChooserV178;->pending:Ljava/util/WeakHashMap;

    invoke-virtual {p1, p0, v0}, Ljava/util/WeakHashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 56
    invoke-virtual {v0}, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->mediaOnly()Z

    move-result p1

    if-eqz p1, :cond_1

    .line 57
    new-instance p1, Landroid/app/AlertDialog$Builder;

    invoke-direct {p1, p0}, Landroid/app/AlertDialog$Builder;-><init>(Landroid/content/Context;)V

    const-string p2, "\ucca8\ubd80\ud560 \uacf3 \uc120\ud0dd"

    invoke-virtual {p1, p2}, Landroid/app/AlertDialog$Builder;->setTitle(Ljava/lang/CharSequence;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    .line 58
    const-string p2, "\uc568\ubc94"

    const-string v2, "\ub0b4 \ud30c\uc77c"

    filled-new-array {p2, v2}, [Ljava/lang/String;

    move-result-object p2

    new-instance v2, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$728uemCkBQtiagNhAIT5nGVub4o;

    invoke-direct {v2, p0, v0}, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$728uemCkBQtiagNhAIT5nGVub4o;-><init>(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;)V

    invoke-virtual {p1, p2, v2}, Landroid/app/AlertDialog$Builder;->setItems([Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    .line 59
    new-instance p2, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$xUeUm0llNene0nhYLlcfTl56j_4;

    invoke-direct {p2, p0, v0}, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$xUeUm0llNene0nhYLlcfTl56j_4;-><init>(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;)V

    const-string v2, "\ucde8\uc18c"

    invoke-virtual {p1, v2, p2}, Landroid/app/AlertDialog$Builder;->setNegativeButton(Ljava/lang/CharSequence;Landroid/content/DialogInterface$OnClickListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p1

    .line 60
    new-instance p2, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;

    invoke-direct {p2, p0, v0}, Lcom/aiderlog/v22app/-$$Lambda$MediaChooserV178$qKnCAyb0_bnHYGTJP5p5EugX6vU;-><init>(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;)V

    invoke-virtual {p1, p2}, Landroid/app/AlertDialog$Builder;->setOnCancelListener(Landroid/content/DialogInterface$OnCancelListener;)Landroid/app/AlertDialog$Builder;

    move-result-object p0

    invoke-virtual {p0}, Landroid/app/AlertDialog$Builder;->create()Landroid/app/AlertDialog;

    move-result-object p0

    .line 57
    iput-object p0, v0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->dialog:Landroid/app/AlertDialog;

    .line 61
    iget-object p0, v0, Lcom/aiderlog/v22app/MediaChooserV178$Pending;->dialog:Landroid/app/AlertDialog;

    invoke-virtual {p0}, Landroid/app/AlertDialog;->show()V

    .line 62
    goto :goto_0

    :cond_1
    const/4 p1, 0x0

    invoke-static {p0, v0, p1}, Lcom/aiderlog/v22app/MediaChooserV178;->launch(Landroid/app/Activity;Lcom/aiderlog/v22app/MediaChooserV178$Pending;Z)V

    .line 63
    :goto_0
    return v1

    .line 53
    :cond_2
    :goto_1
    const/4 p0, 0x0

    invoke-interface {p1, p0}, Landroid/webkit/ValueCallback;->onReceiveValue(Ljava/lang/Object;)V

    return v1
.end method
