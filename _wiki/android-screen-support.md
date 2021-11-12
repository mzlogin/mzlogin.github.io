---
layout: wiki
title: 屏幕适配
cate1: Android
cate2:
description: 屏幕适配
keywords: Android
---

## 主要方法

1. 在 xml 文件里使用 `@dimen/xxx` 引用尺寸数值，针对不同分辨率提供多套 dimens 文件，尽量使用 dp/sp。

2. 利用 weight 进行百分比适配。

3. 使用 `com.android.support:percent` 库里的 PercentRelativeLayout 和 PercentFrameLayout 等。

4. 参考张鸿洋的一种实现思路（也是想实现百分比）：

    根据给定设计图的基准分辨率，将屏幕按分辨率纵横等分成多少份，计算出所有需要支持的分辨率里 n 份对应的像素值，然后写到对应的 dimens 文件里，编写 xml 时使用 `@dimen/xn` 这种写法。

    参考：[Android 屏幕适配方案](http://blog.csdn.net/lmj623565791/article/details/45460089)

## 可考虑采用的配合措施

1. 在代码里动态计算和调整。

2. 多套布局文件进行适配。

3. 使用 nine-patch 图。
