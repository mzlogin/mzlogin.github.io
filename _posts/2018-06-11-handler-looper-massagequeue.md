---
layout: post
title: Android 源码分析 —— Handler、Looper 和 MessageQueue
categories: Android
description: 分析 Android 消息机制的主要类
keywords: Android, Handler, Looper, Message, MessageQueue
---

本系列文章在 <https://github.com/mzlogin/rtfsc-android> 持(jing)续(chang)更(duan)新(geng)中，欢迎有兴趣的童鞋们关注。

书接上文，在分析 Toast 源码的过程中我们涉及到了 Handler，这个在 Android 开发里经常用到的类——线程切换、顺序执行、延时执行等等逻辑里往往少不了它的身影，跟它一起搭配使用的通常是 Runnable 和 Message，还有它身后的好基友 Looper 与 MessageQueue。Runnable 相信大家都很熟悉了，本文的主角就是标题里的三剑客——Handler、Looper 和 MessageQueue，当然少不了说到 Message。

本文使用的工具与源码为：Chrome、插件 insight.io、GitHub 项目 [aosp-mirror/platform_frameworks_base][1]

**目录**

* TOC
{:toc}

## 初步印象

按惯例，第一步还是从 Android 的官方 API 文档里来建立对这几个类的初步印象，文档开头的说明里往往有一些比较关键的知识点。

官方文档链接：

* [Handler](https://developer.android.google.cn/reference/android/os/Handler)
* [Looper](https://developer.android.google.cn/reference/android/os/Looper)
* [MessageQueue](https://developer.android.google.cn/reference/android/os/MessageQueue)
* [Message](https://developer.android.google.cn/reference/android/os/Message)

这几个类开头的说明本身也不长，为了避免断章取义误人子弟，就将其直译版完整地放在下面，当然更推荐的方式是自己去看原文。

### Handler

可以用 Handler 发送和处理与某线程的 MessageQueue 相关联的 Message/Runnable 对象。每个 Handler 实例只能与一个线程和它的消息队列相关联。当创建一个 Handler 时，它会绑定到当前线程和消息队列——从那时起，它将 Message 和 Runnable 传递给绑定的消息队列，并在它们从队列里被取出时执行对应逻辑。（*译注：此处描述不准确，创建 Handler 时并不一定是绑定到当前线程。*）

Handler 主要有两个用途：

1. 在未来某个时间点处理 Messages 或者执行 Runnables；

2. 将一段逻辑切换到另一个线程执行。

可以使用 Handler 的以下方法来调度 Messages 和 Runnables：

- post(Runnable)

- postAtTime(Runnable, long)

- postDelayed(Runnable, Object, long)

- sendEmptyMessage(int)

- sendMessage(Message)

- sendMessageAtTime(Message, long)

- sendMessageDelayed(Message, long)

其中 postXXX 系列用于将 Runnable 对象加入队列，sendXXX 系列用于将 Message 对象加入队列，Message 对象通常会携带一些数据，可以在 Handler 的 handlerMessage(Message) 方法中处理（需要实现一个 Handler 子类）。

在调用 Handler 的 postXXX 和 sendXXX 时，可以指定当队列准备好时立即处理它们，也可以指定延时一段时间后处理，或某个绝对时间点处理。后面这两种能实现超时、延时、周期循环及其它基于时间的行为。

为应用程序创建一个进程时，其主线程专用于运行消息队列，该消息队列负责管理顶层应用程序对象（activities，broadcast receivers 等）以及它们创建的窗口。我们可以创建自己的线程，然后通过 Handler 与主线程进行通信，方法是从新线程调用我们前面讲到的 postXXX 或 sendXXX 方法，传递的 Runnable 或 Message 将被加入 Handler 关联的消息队列中，并适时进行处理。

### Looper

用于为线程执行消息循环的类。线程默认没有关联的消息循环，如果要创建一个，可以在执行消息循环的线程里面调用 prepare() 方法，然后调用 loop() 处理消息，直到循环停止。

大多数与消息循环的交互都是通过 Handler 类。

下面是实现一个 Looper 线程的典型例子，在 prepare() 和 loop() 之间初始化 Handler 实例，用于与 Looper 通信：

```java
class LooperThread extends Thread {
    public Handler mHandler;

    public void run() {
        Looper.prepare();

        mHandler = new Handler() {
            public void handleMessage(Message msg) {
                // 在这里处理传入的消息
            }
        };

        Looper.loop();
    }
}
```

### MessageQueue

持有将被 Looper 分发的消息列表的底层类。消息都是通过与 Looper 关联的 Handler 添加到 MessageQueue，而不是直接操作 MessageQueue。

可以用 Looper.myQueue() 获取当前线程的 MessageQueue 实例。

### Message

定义一个可以发送给 Handler 的消息，包含描述和任意数据对象。消息对象有两个额外的 int 字段和一个 object 字段，这可以满足大部分场景的需求了。

> 虽然 Message 的构造方法是 public 的，但最推荐的得到一个消息对象的方式是调用 Message.obtain() 或者 Handler.obtainMessage() 系列方法，这些方法会从一个对象回收池里捡回能复用的对象。

## 提出问题

根据以上印象，及以前的使用经验，提出以下问题来继续本次源码分析之旅：

1. Thread 与 Looper，Looper 与 MessageQueue，Handler 与 Looper 之间的数量对应关系是怎样的？

2. 如果 Looper 能对应多个 Handler，那通过不同的 Handler 发送的 Message，那处理的时候代码是如何知道该分发到哪一个 Handler 的 handlerMessage 方法的？

3. Handler 能用于线程切换的原理是什么？

4. Runnable 对象也是被添加到 MessageQueue 里吗？

5. 可以在 A 线程创建 Handler 关联到 B 线程及其消息循环吗？

6. 如何退出消息循环？

7. 消息可以插队吗？

8. 消息可以撤回吗？

9. 上文提到，应用程序的主线程是运行一个消息循环，在代码里是如何反映的？

## 解答问题

### Thread 与 Looper

前文有提到，线程默认是没有消息循环的，需要调用 Looper.prepare() 来达到目的，那么我们对这个问题的探索就从 Looper.prepare() 开始。

```java
/** Initialize the current thread as a looper.
 * This gives you a chance to create handlers that then reference
 * this looper, before actually starting the loop. Be sure to call
 * {@link #loop()} after calling this method, and end it by calling
 * {@link #quit()}.
 */
public static void prepare() {
    prepare(true);
}

private static void prepare(boolean quitAllowed) {
    if (sThreadLocal.get() != null) {
        throw new RuntimeException("Only one Looper may be created per thread");
    }
    sThreadLocal.set(new Looper(quitAllowed));
}
```

在有参数版本的 prepare 方法里，我们可以得到两个信息：

1. 一个线程里调用多次 Looper.prepare() 会抛出异常，提示 `Only one Looper may be created per thread`，即 **一个线程只能创建一个 Looper**

2. prepare 里主要干的事就是 `sThreadLocal.set(new Looper(quitAllowed))`

源码里是怎么限制一个线程只能创建一个 Looper 的呢？调用多次 Looper.prepare() 并不会关联多个 Looper，还会抛出异常，那能不能直接 new 一个 Looper 关联上呢？答案是不可以，Looper 的构造方法是 private 的。

```java
private Looper(boolean quitAllowed) {
    mQueue = new MessageQueue(quitAllowed);
    mThread = Thread.currentThread();
}
```

在概览整个 Looper 的所有公开方法后，发现只有 prepare 和 prepareMainLooper 是做线程与 Looper 关联的工作的，而 prepareMainLooper 是 Android 环境调用的，不是用来给应用主动调用的。所以从 Looper 源码里掌握的信息来看，想给一个线程关联多个 Looper 的路不通。

另外我们从源码里能观察到，Looper 有一个 final 的 mThread 成员，在构造 Looper 对象的时候赋值为 `Thread.currentThread()`，源码里再无可以修改 mThread 值的地方，所以可知 **Looper 只能关联到一个线程，且关联之后不能改变**。

说了这么多，还记得 Looper.prepare() 里干的主要事情是 `sThreadLocal.set(new Looper(quitAllowed))` 吗？与之对应的，获取本线程关联的 Looper 对象是使用静态方法 Looper.myLooper()：

```java
// sThreadLocal.get() will return null unless you've called prepare().
static final ThreadLocal<Looper> sThreadLocal = new ThreadLocal<Looper>();

// ...

private static void prepare(boolean quitAllowed) {
    if (sThreadLocal.get() != null) {
        throw new RuntimeException("Only one Looper may be created per thread");
    }
    sThreadLocal.set(new Looper(quitAllowed));
}

// ...

/**
 * Return the Looper object associated with the current thread.  Returns
 * null if the calling thread is not associated with a Looper.
 */
public static @Nullable Looper myLooper() {
    return sThreadLocal.get();
}
```

使用了 ThreadLocal 来确保不同的线程调用静态方法 Looper.myLooper() 获取到的是与各自线程关联的 Looper 对象。关于 ThreadLocal，又可以另开一个小话题了。

**小结：** Thread 若与 Looper 关联，将会是一一对应的关系，且关联后关系无法改变。

### Looper 与 MessageQueue

直接来看源码：

```java
public final class Looper {
    // ...
    final MessageQueue mQueue;

    // ...

    private Looper(boolean quitAllowed) {
        mQueue = new MessageQueue(quitAllowed);
        // ...
    }
}
```

Looper 对象里有一个 MessageQueue 类型成员，在构造的时候 new 出的，并且它是一个 final，没有地方能修改它的指向。

**小结：** Looper 与 MessageQueue 是一一对应的关系。

### Handler 与 Looper

在前面略读 Looper 源码的过程中，我发现 Handler 基本没有出场，那么现在，从构造 Handler 的方法开始分析。

Handler 的构造方法有 7 个之多，不过有 3 个标记为 `@hide`，所以我们可以直接调用的有 4 个，这 4 个最终调用都到了其它的两个构造方法，捡出来我们要看的重点：

```java
public class Handler {
    // ...
    
    /**
     * ...
     * @hide
     */
    public Handler(Callback callback, boolean async) {
        // ...
        mLooper = Looper.myLooper();
        if (mLooper == null) {
            throw new RuntimeException(
                    "Can't create handler inside thread that has not called Looper.prepare()");
        }
        mQueue = mLooper.mQueue;
        // ...
    }

    /**
     * ...
     * @hide
     */
    public Handler(Looper looper, Callback callback, boolean async) {
        mLooper = looper;
        mQueue = mLooper.mQueue;
        // ...
    }

    // ...

    final Looper mLooper;
    final MessageQueue mQueue;
    // ...
}
```

Handler 对象里有 final Looper 成员，所以一个 Handler 只会对应一个固定的 Looper 对象。构造 Handler 对象的时候如果不传 Looper 参数，会默认使用当前线程关联的 Looper，如果当前线程没有关联 Looper，会抛出异常。

那么能不能绑定多个 Handler 到同一个 Looper 呢？答案是可以的。在源码里并没有找到相关的限制说明，所以这种适合用个小 Demo 来验证，例如以下例子，就绑定了两个 Handler 到主线程的 Looper 上，并都能正常使用（日志 `receive msg: 1` 和 `receive msg: 2` 能依次输出）。

```java
public class MainActivity extends AppCompatActivity {

    private static final String TAG = MainActivity.class.getSimpleName();

    private Handler mHandler1;
    private Handler mHandler2;

    private Handler.Callback mCallback = new Handler.Callback() {
        @Override
        public boolean handleMessage(Message msg) {
            Log.v(TAG, "receive msg: " + msg.what);
            return false;
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mHandler1 = new Handler(mCallback);
        mHandler2 = new Handler(mCallback);

        mHandler1.sendEmptyMessage(1);
        mHandler2.sendEmptyMessage(2);
    }
}
```

**小结：** Handler 与 Looper 是多对一的关系，创建 Handler 实例时要么提供一个 Looper 实例，要么当前线程有关联的 Looper。

### 消息如何分发到对应的 Handler

因为消息的分发在是 Looper.loop() 这个过程中，所以我们先来看这个方法：

```java
public static void loop() {
    // ...
    for (;;) {
        Message msg = queue.next(); // might block
        // ...
        try {
            msg.target.dispatchMessage(msg);
            // ...
        } finally {
            // ...
        }
        // ...
    }
}
```

这个方法里做的主要工作是从 MessageQueue 里依次取出 Message，然后调用 Message.target.dispatchMessage 方法，Message 对象的这个 target 成员是什么东东呢？它是一个 Handler，它最终会被设置成 sendMessage 的 Handler：

```java
public class Handler {
    // 其它 Handler.sendXXX 方法最终都会调用到这个方法
    public boolean sendMessageAtTime(Message msg, long uptimeMillis) {
        // ...
        return enqueueMessage(queue, msg, uptimeMillis);
    }

    // ...
    private boolean enqueueMessage(MessageQueue queue, Message msg, long uptimeMillis) {
        msg.target = this; // 就是这里了
        // ...
    }
    // ...
}
```

所以是用哪个 Handler.sendMessage，最终就会调用到它的 dispatchMessage 方法：

```java
private static void handleCallback(Message message) {
    message.callback.run();
}
// ...
/**
 * Handle system messages here.
 */
public void dispatchMessage(Message msg) {
    if (msg.callback != null) {
        handleCallback(msg);
    } else {
        if (mCallback != null) {
            if (mCallback.handleMessage(msg)) {
                return;
            }
        }
        handleMessage(msg);
    }
}
```

消息分发到这个方法以后，执行优先级分别是 Message.callback、Handler.mCallback，最后才是 Handler.handleMesage 方法。

**小结：** 在 Handler.sendMessage 时，会将 Message.target 设置为该 Handler 对象，这样从消息队列取出 Message 后，就能调用到该 Handler 的 dispatchMessage 方法来进行处理。

### Handler 能用于线程切换的原理

实际上一小节的结论已经近乎揭示了其中的原理，进一步解释一下就是：

**小结：** Handler 会对应一个 Looper 和 MessageQueue，而 Looper 与线程又一一对应，所以通过 Handler.sendXXX 和 Hanler.postXXX 添加到 MessageQueue 的 Message，会在这个对应的线程的 Looper.loop() 里取出来，并就地执行 Handler.dispatchMessage，这就可以完成线程切换了。

### Runnable 与 MessageQueue

Handler 的 postXXX 系列方法用于调度 Runnable 对象，那它最后也是和 Message 一样被加到 MessageQueue 的吗？可是 MessageQueue 是用一个元素类型为 Message 的链表来维护消息队列的，类型不匹配。

在 Handler 源码里能找到答案，这里就以 Handler.post(Runnable) 方法为例，其它几个 postXXX 方法情形与此类似。

```java
/**
 * Causes the Runnable r to be added to the message queue.
 * The runnable will be run on the thread to which this handler is 
 * attached. 
 *  
 * @param r The Runnable that will be executed.
 * 
 * @return Returns true if the Runnable was successfully placed in to the 
 *         message queue.  Returns false on failure, usually because the
 *         looper processing the message queue is exiting.
 */
public final boolean post(Runnable r)
{
    return  sendMessageDelayed(getPostMessage(r), 0);
}

// ...

private static Message getPostMessage(Runnable r) {
    Message m = Message.obtain();
    m.callback = r;
    return m;
}
```

可以看到，post 系列方法最终也是调用的 send 系列方法，Runnable 对象是被封装成 Message 对象后加入到消息队列的，Message.callback 被设置为 Runnable 本身，还记得前文 Handler.dispatchMessage 的执行顺序吗？如果 Message.callback 不为空，则执行 Message.callback.run() 后就返回。

**小结：** Runnable 被封装成 Message 之后添加到 MessageQueue。

### 能否创建关联到其它线程的 Handler

创建 Handler 时会关联到一个 Looper，而 Looper 是与线程一一绑定的，所以理论上讲，如果能得到要关联的线程的 Looper 实例，这是可以实现的。

在阅读 Looper 源码的过程中，我们有留意到（好吧，其实应该是平时写代码时有用到）：

```java
public final class Looper {
    // ...
    private static Looper sMainLooper;  // guarded by Looper.class
    // ...
    /**
     * Returns the application's main looper, which lives in the main thread of the application.
     */
    public static Looper getMainLooper() {
        synchronized (Looper.class) {
            return sMainLooper;
        }
    }
}
```

可见获取主线程的 Looper 是能实现的，平时写代码过程中，如果要从子线程向主线程添加一段执行逻辑，也经常这么干，这是可行的：

```java
// 从子线程创建关联到主线程 Looper 的 Handler
Handler mHandler = new Handler(Looper.getMainLooper());

mHandler.post(() -> {
        // ...
        });
```

从子线程创建关联到其它子线程的 Looper 是否可行呢？这个用 Demo 来验证：

```java
new Thread() {
    @Override
    public void run() {
        setName("thread-one");
        Looper.prepare();

        final Looper threadOneLooper = Looper.myLooper();

        new Thread() {
            @Override
            public void run() {
                setName("thread-two");
                Handler handler = new Handler(threadOneLooper);

                handler.post(() -> {
                        Log.v("test", Thread.currentThread().getName());
                        });
            }
        }.start();

        Looper.loop();
    }
}.start();
```

执行后日志输出为 `thread-one`。

**小结：** 可以从一个线程创建关联到另一个线程 Looper 的 Handler，只要能拿到对应线程的 Looper 实例。

### 消息可以插队吗

这个问题从API 文档、Handler 源码里都可以找到答案，答案是可以的，使用 Handler.sendMessageAtFrontOfQueue 和 Handler.postAtFrontOfQueue 这两个方法，它们会分别将 Message 和 Runnable（封装后）插入到消息队列的队首。

我目前尚未遇到过这种使用场景。

**小结：** 消息可以插队，使用 Handler.xxxAtFrontOfQueue 方法。

### 消息可以撤回吗

同上，可以从 Handler 的 API 文档中找到答案。

可以用 Handler.hasXXX 系列方法判断关联的消息队列里是否有等待中的符合条件的 Message 和 Runnable，用 Handler.removeXXX 系列方法从消息队列里移除等待中的符合条件的 Message 和 Runnable。

**小结：** 尚未分发的消息是可以撤回的，处理过的就没法了。

### 找到主线程消息循环源码

我们前面提到过一个小细节，就是 Looper.prepareMainLooper 是 Android 环境调用的，而从该方法的注释可知，调用它就是为了初始化主线程 Looper，所以我们要找到主线程消息循环这部分源码，搜索 prepareMainLooper 被哪些地方引用即可。

使用 insight.io 插件的功能，在 Looper.prepareMainLooper 上点一下即可看到引用处列表，一共两处：

![](/images/posts/android/prepare-main-looper.png)

从文件路径和文件名上猜测应该是第一处。

```java
public final class ActivityThread {
    public static void main(String[] args) {
        // ...
        Looper.prepareMainLooper();
        // ...
        Looper.loop();
        // ...
    }
}
```

就是我想象中的模样。这里只是简单找到这个位置，继续深入探索的话可以开启一个新的话题了，后续的篇章里再解决。

## 总结

### 结论汇总

- Thread 若与 Looper 关联，将会是一一对应的关系，且关联后关系无法改变。

- Looper 与 MessageQueue 是一一对应的关系。

- Handler 与 Looper 是多对一的关系，创建 Handler 实例时要么提供一个 Looper 实例，要么当前线程有关联的 Looper。

- 在 Handler.sendMessage 时，会将 Message.target 设置为该 Handler 对象，这样从消息队列取出 Message 后，就能调用到该 Handler 的 dispatchMessage 方法来进行处理。

- Handler 会对应一个 Looper 和 MessageQueue，而 Looper 与线程又一一对应，所以通过 Handler.sendXXX 和 Hanler.postXXX 添加到 MessageQueue 的 Message，会在这个对应的线程的 Looper.loop() 里取出来，并就地执行 Handler.dispatchMessage，这就可以完成线程切换了。

- Runnable 被封装成 Message 之后添加到 MessageQueue。

- 可以从一个线程创建关联到另一个线程 Looper 的 Handler，只要能拿到对应线程的 Looper 实例。

- 消息可以插队，使用 Handler.xxxAtFrontOfQueue 方法。

- 尚未分发的消息是可以撤回的，处理过的就没法了。

### 遗留知识点

1. ThreadLocal

2. 应用的启动流程

### 本篇用到的源码分析方法

1. 文档优先

## 后话

关于 Handler、Looper 和 MessageQueue 的分析在此先告一段落，这部分的内容比较容易分析，但里面细节挺多的，写得有点杂且不全，有点只见树木不见森林的感觉，想要配合画一些图，但找不到合适的画图形式。对此类主题的解析方式必须要再探索优化一下，大家有好的建议请一定告知。

---

最后，照例要安利一下我的微信公众号「闷骚的程序员」，扫码关注，接收 rtfsc-android 的最近更新。

<div align="center"><img width="192px" height="192px" src="https://mazhuang.org/assets/images/qrcode.jpg"/></div>

[1]: https://github.com/aosp-mirror/platform_frameworks_base
