---
layout: wiki
title: ImageView
cate1: Android
cate2: View
description: ImageView
keywords: Android
---

## src 与 background 的区别

1. 图片拉伸

    background 会根据 ImageView 的长宽进行拉伸，src 默认使用原图大小，但可使用 scaleType 指定填充方式。

2. 设置透明度

    ImageView.setAlpha() 时调整的是 src 的透明度。

## scaleType

| 值           | 含义                                                               |
|--------------|--------------------------------------------------------------------|
| matrix       |                                                                    |
| fitXY        | 不按比例拉伸填满 View                                              |
| fitStart     | 按比例缩放至图片的宽高均小于等于 View 的宽高，停靠在左上           |
| fitCenter    | 按比例缩放至图片的宽高均小于等于 View 的宽高，停靠在中间           |
| fitEnd       | 按比例缩放至图片的宽高均小于等于 View 的宽高，停靠在右下           |
| center       | 不缩放，停靠在 View 中间                                           |
| centerCrop   | 按比例缩放至图片的宽高均大于等于 View 的宽高，停靠在中间           |
| centerInside | 不缩放，或按比例缩小至图片的宽高均小于等于 View 的宽高，停靠在中间 |
