.class public final Lcom/aiderlog/v22app/WidgetPreviewFrameV181;
.super Ljava/lang/Object;
.source "WidgetPreviewFrameV181.java"


# static fields
.field private static final applied:Ljava/lang/ThreadLocal;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/lang/ThreadLocal<",
            "Ljava/lang/Boolean;",
            ">;"
        }
    .end annotation
.end field

.field private static final awaiting:Ljava/util/WeakHashMap;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/util/WeakHashMap<",
            "Landroid/view/ViewGroup;",
            "Ljava/lang/Boolean;",
            ">;"
        }
    .end annotation
.end field

.field private static final previous:Ljava/lang/ThreadLocal;
    .annotation system Ldalvik/annotation/Signature;
        value = {
            "Ljava/lang/ThreadLocal<",
            "Landroid/util/SizeF;",
            ">;"
        }
    .end annotation
.end field


# direct methods
.method static constructor <clinit>()V
    .locals 1

    .line 11
    new-instance v0, Ljava/util/WeakHashMap;

    invoke-direct {v0}, Ljava/util/WeakHashMap;-><init>()V

    sput-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->awaiting:Ljava/util/WeakHashMap;

    .line 12
    new-instance v0, Ljava/lang/ThreadLocal;

    invoke-direct {v0}, Ljava/lang/ThreadLocal;-><init>()V

    sput-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->previous:Ljava/lang/ThreadLocal;

    .line 13
    new-instance v0, Ljava/lang/ThreadLocal;

    invoke-direct {v0}, Ljava/lang/ThreadLocal;-><init>()V

    sput-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->applied:Ljava/lang/ThreadLocal;

    return-void
.end method

.method public constructor <init>()V
    .locals 0

    .line 10
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V

    return-void
.end method

.method static synthetic access$0()Ljava/util/WeakHashMap;
    .locals 1

    .line 11
    sget-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->awaiting:Ljava/util/WeakHashMap;

    return-object v0
.end method

.method static compact(Ljava/lang/String;)Z
    .locals 1

    .line 14
    const-string v0, "CalendarAgenda"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-nez v0, :cond_0

    const-string v0, "CalendarFortnight"

    invoke-virtual {v0, p0}, Ljava/lang/String;->equals(Ljava/lang/Object;)Z

    move-result p0

    if-nez p0, :cond_0

    const/4 p0, 0x0

    return p0

    :cond_0
    const/4 p0, 0x1

    return p0
.end method

.method static heightForWidth(IIIII)I
    .locals 0

    .line 16
    sub-int/2addr p0, p1

    sub-int/2addr p0, p2

    const/4 p1, 0x1

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    int-to-float p0, p0

    const/high16 p2, 0x40000000    # 2.0f

    div-float/2addr p0, p2

    invoke-static {p0}, Ljava/lang/Math;->round(F)I

    move-result p0

    invoke-static {p1, p0}, Ljava/lang/Math;->max(II)I

    move-result p0

    add-int/2addr p0, p3

    add-int/2addr p0, p4

    return p0
.end method

.method public static prepare(Landroid/app/Activity;Landroid/view/ViewGroup;Ljava/lang/String;)Z
    .locals 5

    .line 19
    invoke-static {p2}, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->compact(Ljava/lang/String;)Z

    move-result p2

    const/4 v0, 0x1

    if-nez p2, :cond_0

    return v0

    .line 20
    :cond_0
    invoke-virtual {p1}, Landroid/view/ViewGroup;->getWidth()I

    move-result p2

    .line 21
    if-gtz p2, :cond_2

    .line 22
    sget-object p2, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->awaiting:Ljava/util/WeakHashMap;

    invoke-virtual {p2, p1}, Ljava/util/WeakHashMap;->containsKey(Ljava/lang/Object;)Z

    move-result p2

    if-nez p2, :cond_1

    .line 23
    sget-object p2, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->awaiting:Ljava/util/WeakHashMap;

    sget-object v0, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    invoke-virtual {p2, p1, v0}, Ljava/util/WeakHashMap;->put(Ljava/lang/Object;Ljava/lang/Object;)Ljava/lang/Object;

    .line 24
    new-instance p2, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;

    invoke-direct {p2, p1, p0}, Lcom/aiderlog/v22app/WidgetPreviewFrameV181$1;-><init>(Landroid/view/ViewGroup;Landroid/app/Activity;)V

    invoke-virtual {p1, p2}, Landroid/view/ViewGroup;->addOnLayoutChangeListener(Landroid/view/View$OnLayoutChangeListener;)V

    .line 32
    :cond_1
    const/4 p0, 0x0

    return p0

    .line 34
    :cond_2
    invoke-virtual {p1}, Landroid/view/ViewGroup;->getPaddingLeft()I

    move-result v1

    invoke-virtual {p1}, Landroid/view/ViewGroup;->getPaddingRight()I

    move-result v2

    invoke-virtual {p1}, Landroid/view/ViewGroup;->getPaddingTop()I

    move-result v3

    invoke-virtual {p1}, Landroid/view/ViewGroup;->getPaddingBottom()I

    move-result v4

    invoke-static {p2, v1, v2, v3, v4}, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->heightForWidth(IIIII)I

    move-result v1

    .line 35
    invoke-virtual {p1}, Landroid/view/ViewGroup;->getLayoutParams()Landroid/view/ViewGroup$LayoutParams;

    move-result-object v2

    .line 36
    if-eqz v2, :cond_3

    iget v3, v2, Landroid/view/ViewGroup$LayoutParams;->height:I

    if-eq v3, v1, :cond_3

    iput v1, v2, Landroid/view/ViewGroup$LayoutParams;->height:I

    invoke-virtual {p1, v2}, Landroid/view/ViewGroup;->setLayoutParams(Landroid/view/ViewGroup$LayoutParams;)V

    .line 37
    :cond_3
    const v1, 0x3dcccccd    # 0.1f

    invoke-virtual {p0}, Landroid/app/Activity;->getResources()Landroid/content/res/Resources;

    move-result-object p0

    invoke-virtual {p0}, Landroid/content/res/Resources;->getDisplayMetrics()Landroid/util/DisplayMetrics;

    move-result-object p0

    iget p0, p0, Landroid/util/DisplayMetrics;->density:F

    invoke-static {v1, p0}, Ljava/lang/Math;->max(FF)F

    move-result p0

    .line 38
    invoke-virtual {p1}, Landroid/view/ViewGroup;->getPaddingLeft()I

    move-result v1

    sub-int/2addr p2, v1

    invoke-virtual {p1}, Landroid/view/ViewGroup;->getPaddingRight()I

    move-result p1

    sub-int/2addr p2, p1

    invoke-static {v0, p2}, Ljava/lang/Math;->max(II)I

    move-result p1

    int-to-float p1, p1

    .line 39
    sget-object p2, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->previous:Ljava/lang/ThreadLocal;

    sget-object v1, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v1}, Ljava/lang/ThreadLocal;->get()Ljava/lang/Object;

    move-result-object v1

    check-cast v1, Landroid/util/SizeF;

    invoke-virtual {p2, v1}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V

    sget-object p2, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->applied:Ljava/lang/ThreadLocal;

    sget-object v1, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    invoke-virtual {p2, v1}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V

    .line 40
    sget-object p2, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    new-instance v1, Landroid/util/SizeF;

    div-float v2, p1, p0

    const/high16 v3, 0x40000000    # 2.0f

    div-float/2addr p1, v3

    div-float/2addr p1, p0

    invoke-direct {v1, v2, p1}, Landroid/util/SizeF;-><init>(FF)V

    invoke-virtual {p2, v1}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V

    .line 41
    return v0
.end method

.method public static restore()V
    .locals 2

    .line 44
    sget-object v0, Ljava/lang/Boolean;->TRUE:Ljava/lang/Boolean;

    sget-object v1, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->applied:Ljava/lang/ThreadLocal;

    invoke-virtual {v1}, Ljava/lang/ThreadLocal;->get()Ljava/lang/Object;

    move-result-object v1

    invoke-virtual {v0, v1}, Ljava/lang/Boolean;->equals(Ljava/lang/Object;)Z

    move-result v0

    if-eqz v0, :cond_1

    .line 45
    sget-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->previous:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->get()Ljava/lang/Object;

    move-result-object v0

    check-cast v0, Landroid/util/SizeF;

    if-nez v0, :cond_0

    sget-object v0, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V

    goto :goto_0

    :cond_0
    sget-object v1, Lcom/aiderlog/v22app/WidgetSizeV169;->active:Ljava/lang/ThreadLocal;

    invoke-virtual {v1, v0}, Ljava/lang/ThreadLocal;->set(Ljava/lang/Object;)V

    .line 47
    :cond_1
    :goto_0
    sget-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->previous:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V

    sget-object v0, Lcom/aiderlog/v22app/WidgetPreviewFrameV181;->applied:Ljava/lang/ThreadLocal;

    invoke-virtual {v0}, Ljava/lang/ThreadLocal;->remove()V

    .line 48
    return-void
.end method
