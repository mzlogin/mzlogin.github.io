---
layout: wiki
title: 消息机制
cate1: Android
cate2:
description: 消息机制
keywords: Android
---

## 在工作线程里如何也能处理消息

方法一：

给线程关联一个 Looper.prepare()，然后调用 Looper.loop()。

方法二：

使用 HandlerThread。
