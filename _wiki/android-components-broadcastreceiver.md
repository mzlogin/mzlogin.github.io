---
layout: wiki
title: BroadcastReceiver
cate1: Android
cate2: Components
description: BroadcastReceiver
keywords: Android
---

一般情况下，onReceive 在 UI 线程执行，但也可以在 registerReceiver 时用 Handler 指定运行的线程。

## Manifest-declared receivers 与 Context-registered receivers 的区别

|          | Manifest-declared        | Context-registered                  |
|----------|--------------------------|-------------------------------------|
| 注册时机 | 应用安装时               | 调用 registerReceiver 时            |
| 生命周期 | onReceive 被调用期间有效 | 受注册时所用的 Context 生命周期影响 |

## 对进程状态的影响

在调用 onReceive 时，所在进程被当作 foreground process；onReceive 返回后，所在进程会被当作普通进程，如果进程里只有一个 manifest-declared receiver，它会被当作低优先级进程。

## 执行时间长一点的任务

1. 使用 goAsync 结合 AsyncTask 等；

    执行时间仍然不要超过 10 秒。

2. 使用 JobScheduler 调度 JobService。

## 发送广播

1. sendOrderedBroadcast

    发送有序广播，一次只有一个 receiver 接收到，接收的顺序由 intent-filter 的 `android:priority` 属性决定，相同优先级的则随机顺序接收；一个 receiver 接收到有序广播后可以选择中止传递，也可以继续传递，可以携带它处理的结果。

2. sendBroadcast

    发送无序广播，可以同时发送给所有 receiver，这更高效，但无法得到其它 receiver 处理的结果。

3. LocalBroadcastManager.sendBroadcast

    发送应用内广播。因为没有跨进程通信，这更高效更安全。

可以通过 Intent.setPackage 来限制发送广播给哪些应用。

## 权限

发送广播时添加权限，则只有已经被授予了对应权限的 receiver 可以接收到；

注册 receiver 时添加权限，则只有已经被授予了对应权限的应用可以发送广播给该 receiver。

## 安全考虑与最佳实践

* 如果只是应用内收发广播，使用 LocalBroadcastManager。

* 如果许多应用关注一个广播，那可能发出广播时造成许多应用启动，引起性能用用户体验的问题。这种情况下使用 context-registered receivers 会更好。比如 CONNECTIVEY_ACTION 广播只被分发给 context-registered receivers。

* 不要用隐式意图广播敏感信息。可以使用如下方法来限制接收者：

    * 发送广播时指定权限；

    * 在 Android 4.0 以上，可以使用 Intent.setPackage(String) 来限制接收的应用；

    * 使用 local broadcasts。

* 可能有恶意广播来触发你的 receivers。可以使用如下方法来限制收到到的广播：

    * 注册 receiver 时指定权限；

    * manifest-declared receivers 可以设置 android:exported 为 false 来屏蔽应用外的广播。

    * 使用 local broadcasts。

* broadcast 的 actions 命名空间是全局的，使用一个你独有的命名空间，像包名一样。

* onReceive 一般运行在主线程，所以要迅速返回。如果想执行稍长时间的任务，慎重启动后台服务，因为在 onReceive 返回后整个进程的存活时间无法保证。建议的方法是：

    * 在 onReceive 里调用 goAsync 然后将 BroadcastReceiver.PendingResult 传给后台线程，这将让该广播在 onReceive 返回后仍处于激活状态。这只是一个防止 UI 线程卡顿的方法，所有工作还是要在 10 秒内完成（普通 receiver 如果超过 10 秒还没返回会被系统认为阻塞了，会杀掉它）。

    * 使用 JobScheduler。

* 不要在 onReceive 里启动 Activity，用户体验很差，特别是有多个 receiver 都这么干的时候。可以考虑使用 notification。
