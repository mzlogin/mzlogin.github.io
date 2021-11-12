---
layout: wiki
title: Dialog
cate1: Android
cate2: View
description: Dialog
keywords: Android
---

## AlertDialog

### 创建一个只有进度条的对话框

xxx.java

```java
AlertDialog.Builder builder = new AlertDialog.Builder(context)
        .setView(R.layout.window_loading)
        .setCancelable(false); // 对话框外点击无法退出
dialog = builder.create();
Window window = dialog.getWindow();
if (window != null) {
    // 设置背景透明
    window.setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
}
dialog.show();
```

layout/window_loading.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<ProgressBar xmlns:android="http://schemas.android.com/apk/res/android"
    style="?android:attr/progressBarStyleLarge"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:indeterminate="true" />
```

### 修改按钮的文字颜色

values/styles.xml

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.DarkActionBar">
    <!-- ... -->
    <item name="buttonBarPositiveButtonStyle">@style/positiveButtonStyle</item>
    <item name="buttonBarNegativeButtonStyle">@style/negativeButtonStyle</item>
</style>

<style name="positiveButtonStyle" parent="Base.Widget.AppCompat.Button.ButtonBar.AlertDialog">
    <item name="android:textColor">@color/zkhRed</item>
</style>

<style name="negativeButtonStyle" parent="Base.Widget.AppCompat.Button.ButtonBar.AlertDialog">
    <item name="android:textColor">@color/textNormal</item>
</style>
```

参考：[Android-用style修改AlertDialog修改按钮文字颜色](https://blog.csdn.net/u011219729/article/details/78316264?locationNum=4&fps=1)

### 显示富文本

values/strings.xml

```xml
<string name="test_string"><![CDATA[中间是<font color=\'#ff0000\'>红字</font>哈]]></string>
```

xx.java

```java
new AlertDialog.Builder()
    .setMessage(Html.fromHtml(getString(R.string.test_string)))
    ...
```
