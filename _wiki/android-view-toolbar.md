---
layout: wiki
title: Toolbar
cate1: Android
cate2: View
description: Toolbar
keywords: Android
---

## 修改 Navigation Icon 的 Padding 值

styles.xml

```xml
<style name="AppTheme.Base" parent="Theme.AppCompat.Light">
    <item toolbarNavigationButtonStyle>@style/MyToolbarNavigationButtonStyle</item>
</style>

<style name="MyToolbarNavigationButtonStyle" parent="@style/Widget.AppCompat.Toolbar.Button.Navigation">
    <item name="android:paddingLeft">14dp</item>
    <item name="android:paddingTop">12dp</item>
    <item name="android:paddingBottom">12dp</item>
    <item name="android:minWidth">0dp</item>
    <item name="android:scaleType">centerInside</item>
</style>
```
