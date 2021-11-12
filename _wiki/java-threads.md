---
layout: wiki
title: 多线程
cate1: Java
cate2:
description: 多线程
keywords: Android
---

## 线程同步机制

### synchronized 关键字

可以用于同步方法与同步代码块，是**可重入**的。

* 静态方法是使用 class 对象作为对象锁。

* 非静态方法是使用 this 对象作为对象锁。（所以多个对象的 synchronized 方法是可以同时执行的）

* synchronized 实现的锁是可重入锁。

### java.util.concurrent.lock 包中的 Lock 对象

ReetrantLock 提供了 synchronized 相关的并发性和内存主义，但是添加了类投票、定时锁等候和可中断锁等。激烈竞争下有更好的性能。

### CountDownLatch

## 线程池

### 使用线程池的好处

1. 重用线程，避免线程的频繁创建销毁带来的性能开销。

2. 能有效控制最大并发数，避免大量线程争抢资源而造成阻塞。

3. 能够对线程进行简单的管理，并提供定时执行及间隔循环执行等功能。

### 线程池的分类

1. FixedThreadPool

    只有核心线程，并且它们不会被回收。任务队列没有大小限制。

2. CachedThreadPool

    线程数量不固定，只有非核心线程，任何任务都会被立即执行。当线程池中的线程都处于活动状态时，线程池会创建新的线程来处理任务，否则就会利用空闲线程。线程闲置超过 60 秒就会被回收。

    适合执行大量的、耗时较少的任务。

3. ScheduledThreadPool

    核心线程数量固定，非核心线程数没有限制。非核心线程闲置即被回收。

    适合用于执行定时任务和具有固定周期的重复任务。

4. SingleThreadExecutor

    只有一个核心线程，它的意义在于统一所有的任务到一个线程。

## 获取线程堆栈

获取本进程内所有活动线程的堆栈：

```java
private String getAllStackTraces() {
    Map<Thread, StackTraceElement[]> stacks = Thread.getAllStackTraces();
    StringBuilder sb = new StringBuilder();
    for (Thread key : stacks.keySet()) {
        StackTraceElement[] stackTraceElements = stacks.get(key);
        sb.append("\nthread ").append(key.getName());
        for (StackTraceElement st : stackTraceElements) {
            sb.append("\n\t").append(st.toString());
        }
    }

    return sb.toString();
}
```
