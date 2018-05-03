---
layout: post
title: Android 源码分析 —— 从 Toast 出发
categories: Android
description: Android 源码分析，深入解析 Toast。
keywords: RTFSC, Android, Toast
---

本系列文章在 <https://github.com/mzlogin/rtfsc-android> 持续更新中，欢迎有兴趣的童鞋们关注。

![](/images/posts/android/toast.png)

（图 from Android Developers）

Toast 是 Android 开发里较常用的一个类了，有时候用它给用户弹提示信息和界面反馈，有时候用它来作为辅助调试的手段。用得多了，自然想对其表层之下的运行机制有所了解，所以在此将它选为我的第一个 RTFSC Roots。

本篇采用的记录方式是先对它有个整体的了解，然后提出一些问题，再通过阅读源码，对问题进行一一解读而后得出答案。

本文使用的工具与源码为：Chrome、插件 insight.io、GitHub 项目 [aosp-mirror/platform_frameworks_base][3]

**目录**

<!-- vim-markdown-toc GFM -->

* [Toast 印象](#toast-印象)
* [提出问题](#提出问题)
* [解答问题](#解答问题)
    * [Toast 的超时时间](#toast-的超时时间)
    * [能不能弹一个时间超长的 Toast？](#能不能弹一个时间超长的-toast)
    * [Toast 能不能在非 UI 线程调用？](#toast-能不能在非-ui-线程调用)
    * [应用在后台时能不能 Toast？](#应用在后台时能不能-toast)
    * [Toast 数量有没有限制？](#toast-数量有没有限制)
    * [`Toast.makeText(…).show()` 具体都做了些什么？](#toastmaketextshow-具体都做了些什么)
* [总结](#总结)
    * [补充后的 Toast 知识点列表](#补充后的-toast-知识点列表)
    * [遗留知识点](#遗留知识点)
    * [本篇用到的源码分析方法](#本篇用到的源码分析方法)
* [后话](#后话)

<!-- vim-markdown-toc -->

## Toast 印象

首先我们从 Toast 类的 [官方文档](1) 和 [API 指南](2) 中可以得出它具备如下特性：

1. Toast 不是 View，它用于帮助创建并展示包含一条小消息的 View；

2. 它的设计理念是尽量不惹眼，但又能展示想让用户看到的信息；

3. 被展示时，浮在应用界面之上；

4. 永远不会获取到焦点；

5. 大小取决于消息的长度；

6. 超时后会自动消失；

7. 可以自定义显示在屏幕上的位置（默认左右居中显示在靠近屏幕底部的位置）；

8. 可以使用自定义布局，也只有在自定义布局的时候才需要直接调用 Toast 的构造方法，其它时候都是使用 makeText 方法来创建 Toast；

9. Toast 弹出后当前 Activity 会保持可见性和可交互性；

10. 使用 `cancel` 方法可以立即将已显示的 Toast 关闭，让未显示的 Toast 不再显示；

11. Toast 也算是一个「通知」，如果弹出状态消息后期望得到用户响应，应该使用 Notification。

不知道你看到这个列表，是否学到了新知识或者明确了以前不确定的东西，反正我在整理列表的时候是有的。

## 提出问题

根据以上特性，再结合平时对 Toast 的使用，提出如下问题来继续本次源码分析之旅（大致由易到难排列，后文用 小 demo 或者源码分析来解答）：

1. Toast 的超时时间具体是多少？

2. 能不能弹一个时间超长的 Toast？

3. Toast 能不能在非 UI 线程调用？

4. 应用在后台时能不能 Toast？

5. Toast 数量有没有限制？

6. `Toast.makeText(…).show()` 具体都做了些什么？

## 解答问题

### Toast 的超时时间

用这样的一个问题开始「Android 源码分析」，真的好怕被打死……大部分人都会嗤之以鼻：Are you kidding me? So easy. 各位大佬们稍安勿躁，阅读大型源码不是个容易的活，让我们从最简单的开始，一点一点建立自信，将这项伟大的事业进行下去。

面对这个问题，我的第一反应是去查 `Toast.LENGTH_LONG` 和 `Toast.LENGTH_SHORT` 的值，毕竟平时都是用这两个值来控制显示长/短 Toast 的。

文件 [platform_frameworks_base/core/java/android/widget/Toast.java][4] 中能看到它们俩的定义是这样的：

```java
/**
 * Show the view or text notification for a short period of time.  This time
 * could be user-definable.  This is the default.
 * @see #setDuration
 */
public static final int LENGTH_SHORT = 0;

/**
 * Show the view or text notification for a long period of time.  This time
 * could be user-definable.
 * @see #setDuration
 */
public static final int LENGTH_LONG = 1;
```

啊哦~原来它们只是两个 flag，并非确切的时间值。

既然是 flag，那自然就会有根据不同的 flag 来设置不同的具体值的地方，于是使用 insight.io 点击 `LENGTH_SHORT` 的定义搜索一波 `Toast.LENGTH_SHORT` 的引用，在 [aosp-mirror/platform_frameworks_base][3] 里一共有 50 处引用，但都是调用 `Toast.makeText(...)` 时出现的。

继续搜索 `Toast.LENGTH_LONG` 的引用，在 [aosp-mirror/platform_frameworks_base][3] 中共出现 42 次，其中有两处长得像是我们想找的：

第一处，文件 [platform_frameworks_base/core/java/android/widget/Toast.java][4]

```java
private static class TN extends ITransientNotification.Stub {
    ...
    static final long SHORT_DURATION_TIMEOUT = 4000;
    static final long LONG_DURATION_TIMEOUT = 7000; 
    ...

    public void handleShow(IBinder windowToken) {
        ...
        mParams.hideTimeoutMilliseconds = mDuration ==
            Toast.LENGTH_LONG ? LONG_DURATION_TIMEOUT : SHORT_DURATION_TIMEOUT;
        ...
    }
    ...
}
```

这个 hideTimeoutMilliseconds 是干嘛的呢？

文件 [platform_frameworks_base/core/java/android/view/WindowManager.java][8] 里能看到这个 

```java
/**
 * ...
 * ...                                        . Therefore, we do hide
 * such windows to prevent them from overlaying other apps.
 *
 * @hide
 */
public long hideTimeoutMilliseconds = -1;
```

在 GitHub 用 blame 查看到改动这一行的最近一次提交 [aa07653d][9]，它的 commit message 能表明它的用途：

```
Prevent apps to overlay other apps via toast windows

It was possible for apps to put toast type windows
that overlay other apps which toast winodws aren't
removed after a timeout.

Now for apps targeting SDK greater than N MR1 to add a
toast window one needs to have a special token. The token
is added by the notificatoion manager service only for
the lifetime of the shown toast and is then removed
including all windows associated with this token. This
prevents apps to add arbitrary toast windows.

Since legacy apps may rely on the ability to directly
add toasts we mitigate by allowing these apps to still
add such windows for unlimited duration if this app is
the currently focused one, i.e. the user interacts with
it then it can overlay itself, otherwise we make sure
these toast windows are removed after a timeout like
a toast would be.

We don't allow more that one toast window per UID being
added at a time which prevents 1) legacy apps to put the
same toast after a timeout to go around our new policy
of hiding toasts after a while; 2) modern apps to reuse
the passed token to add more than one window; Note that
the notification manager shows toasts one at a time.
```

它并不是用来控制 Toast 的显示时间的，只是为了防止有些应用的 toast 类型的窗口长期覆盖在别的应用上面，而超时自动隐藏这些窗口的时间，可以看作是一种防护措施。

第二处，文件 [platform_frameworks_base/services/core/java/com/android/server/notification/NotificationManagerService.java][5] 里

```java
long delay = r.duration == Toast.LENGTH_LONG ? LONG_DELAY : SHORT_DELAY;
```

在同一文件里能找到 `LONG_DELAY` 与 `SHORT_DELAY` 的定义：

```java
static final int LONG_DELAY = PhoneWindowManager.TOAST_WINDOW_TIMEOUT;
static final int SHORT_DELAY = 2000; // 2 seconds
```

点击查看 `PhoneWindowManager.TOAST_WINDOW_TIMEOUT` 的定义：

文件 [platform_frameworks_base/services/core/java/com/android/server/policy/PhoneWindowManager.java][6]

```java
/** Amount of time (in milliseconds) a toast window can be shown. */
public static final int TOAST_WINDOW_TIMEOUT = 3500; // 3.5 seconds
```
至此，我们可以得出 **结论：Toast 的长/短超时时间分别为 3.5 秒和 2 秒。**

*Tips: 也可以通过分析代码里的逻辑，一层一层追踪用到 `LENGTH_SHORT` 和 `LENGTH_LONG` 的地方，最终得出结论，而这里是根据一些合理推断来简化追踪过程，更快达到目标，这在一些场景下是可取和必要的。*

### 能不能弹一个时间超长的 Toast？

注：这里探讨的是能否直接通过 Toast 提供的公开 API 做到，网络上能搜索到的使用 Timer、反射、自定义等方式达到弹出一个超长时间 Toast 目的的方法不在讨论范围内。

我们在 Toast 类的源码里看一下跟设置时长相关的代码：

文件 [platform_frameworks_base/core/java/android/widget/Toast.java][4]

```java
...

    /** @hide */
    @IntDef({LENGTH_SHORT, LENGTH_LONG})
    @Retention(RetentionPolicy.SOURCE)
    public @interface Duration {}

...

    /**
     * Set how long to show the view for.
     * @see #LENGTH_SHORT
     * @see #LENGTH_LONG
     */
    public void setDuration(@Duration int duration) {
        mDuration = duration;
        mTN.mDuration = duration;
    }

...

    /**
     * Make a standard toast that just contains a text view.
     *
     * @param context  The context to use.  Usually your {@link android.app.Application}
     *                 or {@link android.app.Activity} object.
     * @param text     The text to show.  Can be formatted text.
     * @param duration How long to display the message.  Either {@link #LENGTH_SHORT} or
     *                 {@link #LENGTH_LONG}
     *
     */
    public static Toast makeText(Context context, CharSequence text, @Duration int duration) {
        return makeText(context, null, text, duration);
    }

...
```

其实从上面 `setDuration` 和 `makeText` 的注释已经可以看出，duration 只能取值 `LENGTH_SHORT` 和 `LENGTH_LONG`，除了注释之外，还使用了 `@Duration` 注解来保证此事。`Duration` 自身使用了 `@IntDef` 注解，它用于限制可以取的值。

文件 [platform_frameworks_base/core/java/android/annotation/IntDef.java][7]

```java
/**
 * Denotes that the annotated element of integer type, represents
 * a logical type and that its value should be one of the explicitly
 * named constants. If the {@link #flag()} attribute is set to true,
 * multiple constants can be combined.
 * ...
 */
```

不信邪的我们可以快速在一个 demo Android 工程里写一句这样的代码试试：

```java
Toast.makeText(this, "Hello", 2);
```

Android Studio 首先就不会同意，警告你 `Must be one of: Toast.LENGTH_SHORT, Toast.LENGTH_LONG`，但实际这段代码是可以通过编译的，因为 `Duration` 注解的 `Retention` 为 `RetentionPolicy.SOURCE`，我的理解是该注解主要能用于 IDE 的智能提示警告，编译期就被丢掉了。

但即使 duration 能传入 `LENGTH_SHORT` 和 `LENGTH_LONG` 以外的值，也并没有什么卵用，别忘了这里设置的只是一个 flag，真正计算的时候是 `long delay = r.duration == Toast.LENGTH_LONG ? LONG_DELAY : SHORT_DELAY;`，即 duration 为 `LENGTH_LONG` 时时长为 3.5 秒，其它情况都是 2 秒。

所以我们可以得出 **结论：无法通过 Toast 提供的公开 API 直接弹出超长时间的 Toast。**（如节首所述，可以通过一些其它方式实现类似的效果）

### Toast 能不能在非 UI 线程调用？

这个问题适合用一个 demo 来解答。

我们创建一个最简单的 App 工程，然后在启动 Activity 的 onCreate 方法里添加这样一段代码：

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        Toast.makeText(MainActivity.this, "Call toast on non-UI thread", Toast.LENGTH_SHORT)
                .show();
    }
}).start();
```

啊哦~很遗憾程序直接挂掉了。

```
11-07 13:35:33.980 2020-2035/org.mazhuang.androiduidemos E/AndroidRuntime: FATAL EXCEPTION: Thread-77
    java.lang.RuntimeException: Can't create handler inside thread that has not called Looper.prepare()
        at android.widget.Toast$TN.<init>(Toast.java:390)
        at android.widget.Toast.<init>(Toast.java:114)
        at android.widget.Toast.makeText(Toast.java:277)
        at android.widget.Toast.makeText(Toast.java:267)
        at org.mazhuang.androiduidemos.MainActivity$1.run(MainActivity.java:27)
        at java.lang.Thread.run(Thread.java:856)
```

顺着堆栈里显示的方法调用从下往上一路看过去，

文件 [platform_frameworks_base/core/java/android/widget/Toast.java][4] 

首先是两级 makeText 方法：

```java
// 我们的代码里调用的 makeText 方法
public static Toast makeText(Context context, CharSequence text, @Duration int duration) {
    return makeText(context, null, text, duration);
}

// 隐藏的 makeText 方法，不能手动调用
public static Toast makeText(@NonNull Context context, @Nullable Looper looper,
        @NonNull CharSequence text, @Duration int duration) {
    Toast result = new Toast(context, looper); // 这里的 looper 为 null
    ...
```

然后到了 Toast 的构造方法：

```java
public Toast(@NonNull Context context, @Nullable Looper looper) {
    mContext = context;
    mTN = new TN(context.getPackageName(), looper); // looper 为 null
    ...
}
```

到 Toast$TN 的构造方法：

```java
// looper = null
TN(String packageName, @Nullable Looper looper) {
    ...
    if (looper == null) {
        // Use Looper.myLooper() if looper is not specified.
        looper = Looper.myLooper();
        if (looper == null) {
            throw new RuntimeException(
                    "Can't toast on a thread that has not called Looper.prepare()");
        }
    }
    ...
}
```

至此，我们已经追踪到了我们的崩溃的 RuntimeException，即要避免进入抛出异常的逻辑，要么调用的时候传递一个 Looper 进来（无法直接实现，能传递 Looper 参数的构造方法与 makeText 方法是 hide 的），要么 `Looper.myLooper()` 返回不为 null，提示信息 `Can't create handler inside thread that has not called Looper.prepare()` 里给出了方法，那我们在 toast 前面加一句 `Looper.prepare()` 试试？这次不崩溃了，但依然不弹出 Toast，毕竟，这个线程在调用完 `show()` 方法后就直接结束了，没有调用 `Looper.loop()`，至于为什么调用 Toast 的线程结束与否会对 Toast 的显示隐藏等起影响，在本文的后面的章节里会进行分析。

从崩溃提示来看，Android 并没有限制在非 UI 线程里使用 Toast，只是线程得是一个有 Looper 的线程。于是我们尝试构造如下代码，发现可以成功从非 UI 线程弹出 toast 了：

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        final int MSG_TOAST = 101;
        final int MSG_QUIT = 102;

        Looper.prepare();

        final Handler handler = new Handler() {
            @Override
            public void handleMessage(Message msg) {

                switch (msg.what) {
                    case MSG_TOAST:
                        Toast.makeText(MainActivity.this, "Call toast on non-UI thread", Toast.LENGTH_SHORT)
                                .show();
                        sendEmptyMessageDelayed(MSG_QUIT, 4000);
                        return;

                    case MSG_QUIT:
                        Looper.myLooper().quit();
                        return;
                }

                super.handleMessage(msg);
            }
        };

        handler.sendEmptyMessage(MSG_TOAST);

        Looper.loop();
    }
}).start();
```

至于为什么 `sendEmptyMesageDelayed(MSG_QUIT, 4000)` 里的 delayMillis 我设成了 4000，这里卖个关子，感兴趣的同学可以把这个值调成 0、1000 等等看一下效果，会有一些意想不到的情况发生。

到此，我们可以得出 **结论：可以在非 UI 线程里调用 Toast，但是得是一个有 Looper 的线程。**

ps. 上面这一段演示代码让人感觉为了弹出一个 Toast 好麻烦，也可以采用 Activity.runOnUiThread、View.post 等方法从非 UI 线程将逻辑切换到 UI 线程里执行，直接从 UI 线程里弹出，UI 线程是有 Looper 的。

*知识点：这里如果对 Looper、Handler 和 MessageQueue 有所了解，就容易理解多了，预计下一篇对这三剑客进行讲解。*

### 应用在后台时能不能 Toast？

这个问题也比较适合用一个简单的 demo 来尝试回答。

在 MainActivity 的 onCreate 里加上这样一段代码：

```java
view.postDelayed(new Runnable() {
    @Override
    public void run() {
        Toast.makeText(MainActivity.this, "background toast", Toast.LENGTH_SHORT).show();
    }
}, 5000);
```

然后待应用启动后按 HOME 键，等几秒看是否能弹出该 Toast 即可。

**结论是：应用在后台时可以弹出 Toast。**

### Toast 数量有没有限制？

这个问题将在下一节中一并解答。

### `Toast.makeText(…).show()` 具体都做了些什么？

首先看一下 makeText 方法。

文件 [platform_frameworks_base/core/java/android/widget/Toast.java][4]

```java
/**
 * Make a standard toast to display using the specified looper.
 * If looper is null, Looper.myLooper() is used.
 * @hide
 */
public static Toast makeText(@NonNull Context context, @Nullable Looper looper,
        @NonNull CharSequence text, @Duration int duration) {
    Toast result = new Toast(context, looper);

    LayoutInflater inflate = (LayoutInflater)
            context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    View v = inflate.inflate(com.android.internal.R.layout.transient_notification, null);
    TextView tv = (TextView)v.findViewById(com.android.internal.R.id.message);
    tv.setText(text);

    result.mNextView = v;
    result.mDuration = duration;

    return result;
}
```

这个方法里就是构造了一个 Toast 对象，将需要展示的 View 准备好，设置好超时时长标记，我们可以看一下 `com.android.internal.R.layout.transient_notification` 这个布局的内容：

文件 [platform_frameworks_base/core/res/res/layout/transient_notification.xml][10]

```xml

<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:background="?android:attr/toastFrameBackground">

    <TextView
        android:id="@android:id/message"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_weight="1"
        android:layout_marginHorizontal="24dp"
        android:layout_marginVertical="15dp"
        android:layout_gravity="center_horizontal"
        android:textAppearance="@style/TextAppearance.Toast"
        android:textColor="@color/primary_text_default_material_light"
        />

</LinearLayout>
```

我们最常见的 Toast 就是从这个布局文件渲染出来的了。

我们继续看一下 makeText 里调用的 Toast 的构造方法里做了哪些事情：

```java
/**
 * Constructs an empty Toast object.  If looper is null, Looper.myLooper() is used.
 * @hide
 */
public Toast(@NonNull Context context, @Nullable Looper looper) {
    mContext = context;
    mTN = new TN(context.getPackageName(), looper);
    mTN.mY = context.getResources().getDimensionPixelSize(
            com.android.internal.R.dimen.toast_y_offset);
    mTN.mGravity = context.getResources().getInteger(
            com.android.internal.R.integer.config_toastDefaultGravity);
}
```

主要就是构造了一个 TN 对象，计算了位置。

TN 的构造方法：

```java
TN(String packageName, @Nullable Looper looper) {
    // XXX This should be changed to use a Dialog, with a Theme.Toast
    // defined that sets up the layout params appropriately.
    final WindowManager.LayoutParams params = mParams;
    params.height = WindowManager.LayoutParams.WRAP_CONTENT;
    params.width = WindowManager.LayoutParams.WRAP_CONTENT;
    params.format = PixelFormat.TRANSLUCENT;
    params.windowAnimations = com.android.internal.R.style.Animation_Toast;
    params.type = WindowManager.LayoutParams.TYPE_TOAST;
    params.setTitle("Toast");
    params.flags = WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
            | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE
            | WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE;

    mPackageName = packageName;

    if (looper == null) {
        // Use Looper.myLooper() if looper is not specified.
        looper = Looper.myLooper();
        if (looper == null) {
            throw new RuntimeException(
                    "Can't toast on a thread that has not called Looper.prepare()");
        }
    }
    mHandler = new Handler(looper, null) {
        ...
    };
}
```

设置了 LayoutParams 的初始值，在后面 show 的时候会用到，设置了包名和 Looper、Handler。

TN 是 App 中用于与 Notification Service 交互的对象，这里涉及到 Binder 和跨进程通信的知识，这块会在后面开新篇来讲解，这里可以简单地理解一下：Notification Service 是系统为了管理各种 App 的 Notification（包括 Toast）的服务，比如 Toast，由这个服务来统一维护一个待展示 Toast 队列，各 App 需要弹 Toast 的时候就将相关信息发送给这个服务，服务会将其加入队列，然后根据队列的情况，依次通知各 App 展示和隐藏 Toast。

接下来看看 show 方法：

```java
/**
 * Show the view for the specified duration.
 */
public void show() {
    if (mNextView == null) {
        throw new RuntimeException("setView must have been called");
    }

    INotificationManager service = getService();
    String pkg = mContext.getOpPackageName();
    TN tn = mTN;
    tn.mNextView = mNextView;

    try {
        service.enqueueToast(pkg, tn, mDuration);
    } catch (RemoteException e) {
        // Empty
    }
}
```

调用了 INotificationManager 的 enqueueToast 方法，INotificationManager 是一个接口，其实现类在 NotificationManagerService 里，我们来看 enqueueToast 方法的实现：

文件 [platform_frameworks_base/services/core/java/com/android/server/notification/NotificationManagerService.java][11]

```java
@Override
public void enqueueToast(String pkg, ITransientNotification callback, int duration)
{
    ...

    synchronized (mToastQueue) {
        ...
        try {
            ToastRecord record;
            int index = indexOfToastLocked(pkg, callback);
            // If it's already in the queue, we update it in place, we don't
            // move it to the end of the queue.
            if (index >= 0) {
                record = mToastQueue.get(index);
                record.update(duration);
            } else {
                // Limit the number of toasts that any given package except the android
                // package can enqueue.  Prevents DOS attacks and deals with leaks.
                if (!isSystemToast) {
                    int count = 0;
                    final int N = mToastQueue.size();
                    for (int i=0; i<N; i++) {
                         final ToastRecord r = mToastQueue.get(i);
                         if (r.pkg.equals(pkg)) {
                             count++;
                             if (count >= MAX_PACKAGE_NOTIFICATIONS) {
                                 Slog.e(TAG, "Package has already posted " + count
                                        + " toasts. Not showing more. Package=" + pkg);
                                 return;
                             }
                         }
                    }
                }

                Binder token = new Binder();
                mWindowManagerInternal.addWindowToken(token, TYPE_TOAST, DEFAULT_DISPLAY);
                record = new ToastRecord(callingPid, pkg, callback, duration, token);
                mToastQueue.add(record);
                index = mToastQueue.size() - 1;
                keepProcessAliveIfNeededLocked(callingPid);
            }
            // If it's at index 0, it's the current toast.  It doesn't matter if it's
            // new or just been updated.  Call back and tell it to show itself.
            // If the callback fails, this will remove it from the list, so don't
            // assume that it's valid after this.
            if (index == 0) {
                showNextToastLocked();
            }
        } finally {
            Binder.restoreCallingIdentity(callingId);
        }
    }
}
```

主要就是使用调用方传来的包名、callback 和 duration 构造一个 ToastRecord，然后添加到 mToastQueue 中。如果在 mToastQueue 中已经存在该包名和 callback 的 Toast，则只更新其 duration。

这段代码里有一段可以回答我们的上一个问题 `Toast 数量有没有限制` 了：

```java
// Limit the number of toasts that any given package except the android
// package can enqueue.  Prevents DOS attacks and deals with leaks.
if (!isSystemToast) {
    int count = 0;
    final int N = mToastQueue.size();
    for (int i=0; i<N; i++) {
         final ToastRecord r = mToastQueue.get(i);
         if (r.pkg.equals(pkg)) {
             count++;
             if (count >= MAX_PACKAGE_NOTIFICATIONS) {
                 Slog.e(TAG, "Package has already posted " + count
                        + " toasts. Not showing more. Package=" + pkg);
                 return;
             }
         }
    }
}
```

即会计算 mToastQueue 里该包名的 Toast 数量，如果超过 50，则将当前申请加入队列的 Toast 抛弃掉。所以上一个问题的 **结论是：Toast 队列里允许每个应用存在不超过 50 个 Toast。**

那么构造 ToastRecord 并加入 mToastQueue 之后是如何调度，控制显示和隐藏的呢？enqueueToast 方法里有个逻辑是如果当前列表里只有一个 ToastRecord，则调用 `showNextToastLocked`，看一下与该方法相关的代码：

```java
@GuardedBy("mToastQueue")
void showNextToastLocked() {
    ToastRecord record = mToastQueue.get(0);
    while (record != null) {
        ...
        try {
            record.callback.show(record.token);
            scheduleTimeoutLocked(record);
            return;
        } catch (RemoteException e) {
            ...
            if (index >= 0) {
                mToastQueue.remove(index);
            }
            ...
        }
    }
}

...

@GuardedBy("mToastQueue")
private void scheduleTimeoutLocked(ToastRecord r)
{
    mHandler.removeCallbacksAndMessages(r);
    Message m = Message.obtain(mHandler, MESSAGE_TIMEOUT, r);
    long delay = r.duration == Toast.LENGTH_LONG ? LONG_DELAY : SHORT_DELAY;
    mHandler.sendMessageDelayed(m, delay);
}

private void handleTimeout(ToastRecord record)
{
    if (DBG) Slog.d(TAG, "Timeout pkg=" + record.pkg + " callback=" + record.callback);
    synchronized (mToastQueue) {
        int index = indexOfToastLocked(record.pkg, record.callback);
        if (index >= 0) {
            cancelToastLocked(index);
        }
    }
}

...

@GuardedBy("mToastQueue")
void cancelToastLocked(int index) {
    ToastRecord record = mToastQueue.get(index);
    try {
        record.callback.hide();
    } catch (RemoteException e) {
        ...
    }

    ToastRecord lastToast = mToastQueue.remove(index);
    mWindowManagerInternal.removeWindowToken(lastToast.token, true, DEFAULT_DISPLAY);

    keepProcessAliveIfNeededLocked(record.pid);
    if (mToastQueue.size() > 0) {
        // Show the next one. If the callback fails, this will remove
        // it from the list, so don't assume that the list hasn't changed
        // after this point.
        showNextToastLocked(); // 继续显示队列里的下一个 Toast
    }
}

...

private final class WorkerHandler extends Handler
{
    ...
    @Override
    public void handleMessage(Message msg)
    {
        switch (msg.what)
        {
            case MESSAGE_TIMEOUT:
                handleTimeout((ToastRecord)msg.obj);
                break;
            ...
        }
    }
}
```

即首先调用 `record.callback.show(record.token)`，通知 App 展示该 Toast，然后根据 duration，延时发送一条超时消息 `MESSAGE_TIMEOUT`，WorkHandler 收到该消息后，调用 `cancelToastLocked` 通知应用隐藏该 Toast，并继续调用 `showNextToastLocked` 显示队列里的下一个 Toast。这样一个机制就保证了只要队列里有 ToastRecord，就能依次显示出来。

机制弄清楚了，再详细看一下应用接到通知 show 和 hide 一个 Toast 后是怎么做的：

文件 [platform_frameworks_base/core/java/android/widget/Toast.java][4]

```java
private static class TN extends ITransientNotification.Stub {
    ...
    TN(String packageName, @Nullable Looper looper) {
        ...
        mHandler = new Handler(looper, null) {
            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case SHOW: {
                        IBinder token = (IBinder) msg.obj;
                        handleShow(token);
                        break;
                    }
                    case HIDE: {
                        handleHide();
                        ...
                        break;
                    }
                    ...
                }
            }
        };
    }

    /**
     * schedule handleShow into the right thread
     */
    @Override
    public void show(IBinder windowToken) {
        if (localLOGV) Log.v(TAG, "SHOW: " + this);
        mHandler.obtainMessage(SHOW, windowToken).sendToTarget();
    }

    /**
     * schedule handleHide into the right thread
     */
    @Override
    public void hide() {
        if (localLOGV) Log.v(TAG, "HIDE: " + this);
        mHandler.obtainMessage(HIDE).sendToTarget();
    }

    ...

    public void handleShow(IBinder windowToken) {
        ...
                mWM.addView(mView, mParams);
        ...
    }

    ...

    public void handleHide() {
        ...
                mWM.removeViewImmediate(mView);
        ...
    }
}
```

显示过程：show 方法被远程调用后，先是发送了一个 SHOW 消息，接收到该消息后调用了 handleShow 方法，然后 `mWM.addView` 将该 View 添加到窗口。

隐藏过程：hide 方法被远程调用后，先是发送了一个 HIDE 消息，接收到该消息后调用了 handleHide 方法，然后 `mWM.removeViewImmediate` 将该 View 从窗口移除。

*这里插播一条结论，就是前文留下的为什么调用 Toast 的线程线束之后没弹出的 Toast 就无法弹出了的问题，因为 Notification Service 通知应用进程显示或隐藏 Toast 时，使用的是 `mHandler.obtainMessage(SHOW).sendToTarget()` 与 `mHandler.obtainMessage(HIDE).sendToTarget()`，这个消息发出去后，Handler 对应线程没有在 `Looper.loop()` 过程里的话，就没有办法进入到 Handler 的 handleMessage 方法里去，自然也就无法调用显示和隐藏 View 的流程了。`Looper.loop()` 相关的知识点将在下篇讲解。*

## 总结

### 补充后的 Toast 知识点列表

1. Toast 不是 View，它用于帮助创建并展示包含一条小消息的 View；

2. 它的设计理念是尽量不惹眼，但又能展示想让用户看到的信息；

3. 被展示时，浮在应用界面之上；

4. 永远不会获取到焦点；

5. 大小取决于消息的长度；

6. 超时后会自动消失；

7. 可以自定义显示在屏幕上的位置（默认左右居中显示在靠近屏幕底部的位置）；

8. 可以使用自定义布局，也只有在自定义布局的时候才需要直接调用 Toast 的构造方法，其它时候都是使用 makeText 方法来创建 Toast；

9. Toast 弹出后当前 Activity 会保持可见性和可交互性；

10. 使用 `cancel` 方法可以立即将已显示的 Toast 关闭，让未显示的 Toast 不再显示；

11. Toast 也算是一个「通知」，如果弹出状态消息后期望得到用户响应，应该使用 Notification；

12. Toast 的超时时间为 LENGTH_SHORT 对应 2 秒，LENGTH_LONG 对应 3.5 秒；

13. 不能通过 Toast 类的公开方法直接弹一个时间超长的 Toast；

14. 应用在后台时可以调用 Toast 并正常弹出；

15. Toast 队列里允许单个应用往里添加 50 个 Toast，超出的将被丢弃。

### 遗留知识点

本篇涉及到了一些需要进一步了解的知识点，在后续的篇章中会依次解读：

1. Handler、Looper 和 MessageQueue

2. WindowManager

3. Binder 与跨进程通信

### 本篇用到的源码分析方法

1. 查找关键变量被引用的地方；

2. 按方法调用堆栈一层层逻辑跟踪与分析；

3. 使用 git blame 查看关键代码行的变更日志；

## 后话

到此，上面提到的几个问题都已经解答完毕，对 Toast 源码的分析也告一段落。

写这篇文章花费的时间比较长，所以并不能按照预计的节奏更新，这里表示抱歉。另外，各位如果有耐心读到这里，觉得本文的思路是否清晰，是否能跟随文章的节奏理解一些东西？因为我也在摸索写这类文章的组织形式，所以也希望能收到反馈和建议，以作改进，先行谢过。

---

最后，照例要安利一下我的微信公众号「闷骚的程序员」，扫码关注，接收 rtfsc-android 的最近更新。

<div align="center"><img width="192px" height="192px" src="https://mazhuang.org/assets/images/qrcode.jpg"/></div>

[1]: https://developer.android.com/reference/android/widget/Toast.html
[2]: https://developer.android.com/guide/topics/ui/notifiers/toasts.html
[3]: https://github.com/aosp-mirror/platform_frameworks_base
[4]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/core/java/android/widget/Toast.java
[5]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/services/core/java/com/android/server/notification/NotificationManagerService.java
[6]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/services/core/java/com/android/server/policy/PhoneWindowManager.java
[7]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/core/java/android/annotation/IntDef.java
[8]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/core/java/android/view/WindowManager.java
[9]: https://github.com/aosp-mirror/platform_frameworks_base/commit/aa07653d2eea38a7a5bda5944c8a353586916ae9
[10]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/core/res/res/layout/transient_notification.xml
[11]: https://github.com/aosp-mirror/platform_frameworks_base/blob/master/services/core/java/com/android/server/notification/NotificationManagerService.java
