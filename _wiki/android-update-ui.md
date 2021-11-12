---
layout: wiki
title: 更新 UI
cate1: Android
cate2:
description: 更新 UI
keywords: Android
---

一般要求在 UI 线程中更新 UI，但在子线程中直接操作 UI 也并非不可能，比如在 ViewRootImpl 初始化（Activity 的 onResume 里）之前，操作 UI 不会调用到 ViewRootImpl 的 checkThread。

## 在子线程中操作 UI 的方法

1. 通过 handler。

2. Activity 的 runOnUiThread 方法。

3. View 的 post / postDelayed / postOnAnimation / postOnAnimationDelayed 方法，可以传一个 Runnable（可能还有一个 delayMillis）作为参数。
