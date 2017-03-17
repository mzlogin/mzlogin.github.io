---
layout: post
title: 如何让 HelloWorld.apk 体积最小
categories: Android
description: 一个默认生成的最简单的 HelloWorld.apk 体积都很大，探索如何让简单的 Android 程序体积最小。
keywords: Android
---

按照最新 ADT 的默认设置（如下图所示）创建一个最简单的 HelloWorld 程序，会发现最后生成的 apk 文件大小就已经达到了惊人的 903KB。如果只是想做一个功能非常简单的 APP，体积也这么大的话那太让人沮丧了，那我们就来探索一下如何让这个 HelloWorld.apk 体积最小。

![ADT new project default settings](/images/posts/android/new-project.png)

*（注：本文所述方法是以牺牲新的 API 为代价的。）*

默认生成的 apk 文件大小（903KB）：

![default apk size](/images/posts/android/default-size.png)

### 移除 appcompat\_v7 依赖

创建一个 Minimum Required SDK 低于 API level 11（对应 Android 3.0），Target SDK 高于 API Level 11 的工程，ADT 会自动生成一个名为 appcompat\_v7 的库工程并且使你的工程依赖于它。关于 appcompat\_v7 的作用，可以参见<http://developer.android.com/tools/support-library/features.html#v7>，大概就是说有一系列的 v7 xxx 库，比如 v7 appcompat library、v7 cardview library、v7 gridlayout library 等，都是用于为 Android 2.1（API level 7）或者更高的系统提供一些功能，其中 v7 appcompat library 是提供 Action Bar 相关的界面风格的支持，比如它里面包含了 ActionBar、ActionBarActivity 和 ShareActionProvider 等关键类。

所以如果纯出于精简 apk 体积的考虑，那就可以将 appcompat\_v7 依赖库移除。

移除步骤如下：

1. 从 HelloWorld 工程设置中移除库依赖

   右键 HelloWorld 工程 --> Properties --> Android

   在如下对话框的 Library 部分选中 appcompat\_v7，并点击 Remove。

   ![remove appcompat\_v7](/images/posts/android/remove-appcompat.png)

2. 解决由第 1 步操作带来的各种错误

   做完第 1 步以后，Eclipse 会报各种错，根据提示逐一解决即可。

   **错误提示**

   ```
   ActionBarActivity cannot be resolved to a type
   ```

   **解决方案**

   默认生成的 MainActivity 继承自 ActionBarActivity，将其改为 Activity，并将

   ```
   import android.support.v7.app.ActionBarActivity;
   ```

   移除，添加

   ```
   import android.app.Activity;
   ```

   **错误提示**

   ```
   R cannot be resolved to a variable
   ```

   **解决方案**

   出现这个提示一般是 xml 文件里出错导致无法自动生成 R.java 文件，根据 Eclipse 在 Package Explorer 里提示的小红叉，逐一排查修改。

   res/values/style.xml 文件里提示

   ```
   error: Error retrieving parent for item: No resource found that matches the given name 'Theme.AppCompat.Light'.
   ```

   将

   ```
   <style name="AppBaseTheme" parent="Theme.AppCompat.Light">
   ```

   改为

   ```
   <style name="AppBaseTheme" parent="android:Theme.Light">
   ```

   同理，将 res/values-v11/style.xml 和 res/values-v14/style.xml 里的`AppBaseTheme`分别改为`android:Theme.Holo.Light`和`android:Theme.Holo.Light.DarkActionBar`。

   res/menu/main.xml 文件里提示

   ```
   error: No resource identifier found for attribute 'showAsAction' in package 'org.mazhuang.android.helloworld'
   ```

   将该文件里的

   ```
   app:showAsAction="never"
   ```

   删除。

   至此，工程应该能重新编译过了。

此时编译生成的 apk 文件大小（380KB）：

![apk size without appcompat\_v7](/images/posts/android/size-without-v7.png)

### 不导出 android-support-v4.jar

相对一个 HelloWorld 程序而言，380KB 仍然是太大了。

在 Package Explorer 里能看到 Android Private Libraries 里有一个 android-support-v4.jar。这是一个庞大的包，关于它的作用可以参考<http://developer.android.com/tools/support-library/features.html#v4>。它提供了能用于 Android 1.6（API level 4）及以上系统的许多功能集，比如界面、数据处理和网络连接等。做一个复杂程序的时候它会很有用，但是如果只是一个非常简单功能的 apk，而且暂时并未用到里面的 API，可以不将其打包进 apk 以精简大小，有需要的时候再将其加进来。

不导出方法：

右键 HelloWorld 工程 --> Properties --> Java Build Path --> Order and Export

取消 Android Private Libraries 前面的勾。

![remove private libraries](/images/posts/android/private-library.png)

然后 Clean 和 Refresh 工程，再看生成的 HelloWorld.apk 的大小（45KB）：

![size without v4 library](/images/posts/android/size-without-v4.png)

这个大小大致可以接受啦！

*（注：如果关闭 workspace 后重新打开，这个取消导出会重新被勾选中，如果确定使用不导出方案，那么可在 Package Explorer 视图中该工程下 libs 里找到 android-support-v4.jar，右键删除之。）*

### 影响

当然程序精简带来的影响也是很明显的。

1. 大小

   |  原始 | 移除 appcompat\_v7 | 移除 android-support-v4.jar |
   |:-----:|:------------------:|:---------------------------:|
   | 903KB |        380KB       |             45KB            |

   可不可以只不导出 android-support-v4.jar 而继续依赖 appcompat\_v7 呢？答案是不可以，在<http://developer.android.com/tools/support-library/features.html#v7>的 Note 中显示 v7 appcompat library 是依赖 v4 support library 的。

1. API

   有大量实用的 API 用不了了，比如非常重要的 Fragment，要么将 minSdkVersion 改为 API level 11 以上使用`android.app.Fragment`，要么需要依赖 android-support-v4.jar 使用`android.support.v4.app.Fragment`。如果只使用`android.support.v4.app.Fragment`而不 Export android-support-v4.jar，那么程序在手机上将崩溃，提示

   ```
   java.lang.NoClassDefFoundError: android.support.v4.app.Fragment
   ```
