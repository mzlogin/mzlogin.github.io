---
layout: wiki
title: TextView
cate1: Android
cate2: View
description: TextView
keywords: Android
---

## 常见问题及解决方案

### 限制为单行

`android:lines="1"`

### 文字过长时省略或跑马灯

`android:ellipsize="end"`

取值可以有 start、middle、end 和 marquee。

### 添加边框

layout/layout_xxx.xml

```xml
<TextView
    ...
    android:background="@drawable/text_border"
    ... />
```

drawable/text_border.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="@android:color/transparent" />
    <stroke android:color="#cccccc" android:width="1px" />
</shape>
```

### 一个大的 TextView 里文字居中

```xml
<TextView
    ...
    android:gravity="center"
    ... />
```

### drawableRight 和 drawablePadding

drawableRight 就是在 View 的右边，它与文字的间距优先取决于 View 的宽度，也就是说，如果 View 很宽，drawableRight 与文字的间距大于 drawablePadding 的话，drawablePadding 看起来就没有效果。

这种情况下可以：

1. 将 View 宽度设为 wrap_content，这样文字与 drawableRight 就基本挨着了，然后再设置 drawablePadding；

2. 设置 View 的 paddingRight 将 drawable 挤过来，但这样很不灵活；

3. 修改 TextView 的绘制实现。

