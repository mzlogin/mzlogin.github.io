---
layout: wiki
title: ART 与 Dalvik 的区别
cate1: Android
cate2: 
description: ART 与 Dalvik 的区别
keywords: Android
---

## Ahead-of-time(AOT) compilation

ART 里引入了提前编译，在安装应用时采用更严格的校验机制，使用 dex2oat 工具将 dex 文件编译成本地代码保存到磁盘上。

而 Dalvik 主要使用 JIT，在运行时即时编译字节码为本地代码。

所以 ART 在安装时更耗时，更占用磁盘空间，但是运行更快。

## 改善了垃圾回收机制

部分 GC 过程可以并行执行，改善了内存碎片化的问题。

## 开发和调试方面的提升

支持更多的调试特性，比如可以直接看到当前存在哪些锁，哪些线程持有了这些锁；异常和崩溃报告里给出了更多的诊断信息。

## 参考

* [ART and Dalvik](https://source.android.com/devices/tech/dalvik/)
* [Android 5.0 行为变更](https://developer.android.com/about/versions/android-5.0-changes.html)
