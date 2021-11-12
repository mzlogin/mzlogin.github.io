---
layout: wiki
title: 软键盘
cate1: Android
cate2:
description: 软键盘
keywords: Android
---

## 常用方法

```java
InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE); 

// 获取软键盘的显示状态
boolean isOpen=imm.isActive();

// 如果软键盘已经显示，则隐藏，反之则显示 
imm.toggleSoftInput(0, InputMethodManager.HIDE_NOT_ALWAYS);

// 隐藏软键盘
imm.hideSoftInputFromWindow(view, InputMethodManager.HIDE_NOT_ALWAYS);

// 强制显示软键盘
imm.showSoftInput(view,InputMethodManager.SHOW_FORCED);   

// 强制隐藏软键盘
imm.hideSoftInputFromWindow(view.getWindowToken(), 0); 
```

参考：[Android : 隐藏软键盘](https://blog.csdn.net/doris_d/article/details/52536480)

## Activity 展示时控制软键盘

AndroidManifest.xml

```xml
<activity android:name=".TestActivity"
    android:windowSoftInputMode="stateHidden|adustUnspecified" />
<activity android:name=".DemoActivity"
    android:windowSoftInputMode="stateAlwaysVisible" />
```

参考：

* [Handle input method visibility](https://developer.android.com/training/keyboard-input/visibility)
* [manifest/activity-element](https://developer.android.com/guide/topics/manifest/activity-element)
