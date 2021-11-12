---
layout: wiki
title: Button
cate1: Android
cate2: View
description: Button
keywords: Android
---

## 自定义外观

### 自绘圆形背景

layout/xxx.xml

```xml
<Button
    ...
    android:background="@drawable/button_background"
/>
```

drawable/button_background.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true" android:drawable="@drawable/shape_corners_pressed" />
    <item android:drawable="@drawable/shape_corners" />
</selector>
```

drawable/shape_corners_pressed.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners android:radius="20dp"/>
    <solid android:color="#22ffffff" />
    <stroke android:color="@android:color/white" android:width="1dp" />
</shape>
```

drawable/shape_corners.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <corners android:radius="20dp"/>
    <stroke android:color="@android:color/white" android:width="1dp" />
</shape> 
```

### 去掉自带阴影

默认的按钮是带阴影的，可以通过设置 `style="?android:attr/borderlessButtonStyle"` 解决。

参考：<https://developer.android.com/guide/topics/ui/controls/button.html#Borderless>
