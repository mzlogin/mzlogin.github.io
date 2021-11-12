---
layout: wiki
title: 动画
cate1: Android
cate2:
description: 动画
keywords: Android
---

## Property Animation

### Interpolator

功能：根据已流逝时间百分比计算出当前属性值改变百分比。

Android 提供的插值器：

| Class/Interface                  | 特性                                           |
|----------------------------------|------------------------------------------------|
| AccelerateDecelerateInterpolator | 先加速后减速（余弦曲线）                       |
| AccelerateInterpolator           | 加速                                           |
| AnticipateInterpolator           | 先反向一段再正向加速                           |
| AnticipateOvershootInterpolator  | 先反向一段再正向加速超过最终值，最后回到最终值 |
| BounceInterpolator               | 弹跳                                           |
| CycleInterpolator                | 循环特定次数（正弦曲线）                       |
| DecelerateInterploator           | 减速                                           |
| LinearInterpolator               | 线性                                           |
| OvershootInterpolator            | 先超过最终值，最后回到最终值                   |
| TimeInterpolator                 | 自定义插值器接口                               |

### Evaluator

功能：根据属性值改变百分比计算当前属性值。

| Class/Interface | 特性                                   |
|-----------------|----------------------------------------|
| IntEvaluator    | 计算 int 属性值的默认 evaluator        |
| FloatEvaluator  | 计算 float 属性值的默认 evaluator      |
| ArgbEvaluator   | 计算十六进制颜色属性值的默认 evaluator |
| TypeEvaluator   | 自定义 evaluator 的接口                |

## 参考

* [Property Animation](https://developer.android.com/guide/topics/graphics/prop-animation.html)
