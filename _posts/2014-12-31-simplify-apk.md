---
layout: post
title: 如何让HelloWorld.apk体积最小
categories: Android
---

按照最新ADT的默认设置（如下图所示）创建一个最简单的HelloWorld程序，会发现最后生成的apk文件大小就已经达到了惊人的903KB。如果只是想做一个功能非常简单的APP，体积也这么大的话那太让人沮丧了，那我们就来探索一下如何让这个HelloWorld.apk体积最小。

![ADT new project default settings](/images/posts/android/new-project.png)

*（注：本文所述方法是以牺牲新的API和界面风格为代价的。）*

默认生成的apk文件大小（903KB）：

![default apk size](/images/posts/android/default-size.png)

###移除appcompat\_v7依赖

创建一个Minimum Required SDK低于API level 11（对应Android 3.0），Target SDK高于API Level 11的工程，ADT会自动生成一个名为appcompat\_v7的库工程并且使你的工程依赖于它。关于appcompat\_v7的作用，可以参见<http://developer.android.com/tools/support-library/features.html#v7>，大概就是说有一系列的v7 xxx库，比如v7 appcompat library、v7 cardview library、v7 gridlayout library等，都是用于为Android 2.1（API level 7）或者更高的系统提供一些功能，其中v7 appcompat library是提供Action Bar相关的界面风格的支持，比如它里面包含了ActionBar、ActionBarActivity和ShareActionProvider等关键类。

所以如果纯出于精简apk体积的考虑，并且可以接受牺牲Action Bar界面风格为代价，那就可以将appcompat\_v7依赖库移除。

移除步骤如下：

1. 从HelloWorld工程设置中移除库依赖

    右键HelloWorld工程 --> Properties --> Android
    
    在如下对话框的Library部分选中appcompat\_v7，并点击Remove。

    ![remove appcompat\_v7](/images/posts/android/remove-appcompat.png)

2. 解决由第1步操作带来的各种错误

    做完第1步以后，Eclipse会报各种错，根据提示逐一解决即可。

    **错误提示**

    ```
    ActionBarActivity cannot be resolved to a type
    ```

    **解决方案**

    默认生成的MainActivity继承自ActionBarActivity，将其改为Activity，并将

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

    出现这个提示一般是xml文件里出错导致无法自动生成R.java文件，根据Eclipse在Package Explorer里提示的小红叉，逐一排查修改。

    res/values/style.xml和res/values-v11/style.xml文件里提示

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

    同理，将res/values-v14/style.xml里的

    ```
    Theme.AppCompat.Light.DarkActionBar
    ```

    改为

    ```
    android:Theme.Light
    ```

    res/menu/main.xml文件里提示

    ```
    error: No resource identifier found for attribute 'showAsAction' in package 'org.mazhuang.android.helloworld'
    ```

    将该文件里的

    ```
    app:showAsAction="never"
    ```

    删除。

    至此，工程应该能重新编译过了。

此时编译生成的apk文件大小（380KB）：

![apk size without appcompat\_v7](/images/posts/android/size-without-v7.png)

###不导出android-support-v4.jar

相对一个HelloWorld程序而言，380KB仍然是太大了。

在Package Explorer里能看到Android Private Libraries里有一个android-support-v4.jar。这是一个庞大的包，关于它的作用可以参考<http://developer.android.com/tools/support-library/features.html#v4>。它提供了能用于Android 1.6（API level 4）及以上系统的许多功能集，比如界面、数据处理和网络连接等。做一个复杂程序的时候它会很有用，但是如果只是一个非常简单功能的apk，而且暂时并未用到里面的API，可以不将其打包进apk以精简大小，有需要的时候再将其加进来。

不导出方法：

右键HelloWorld工程 --> Properties --> Java Build Path --> Order and Export

取消Android Private Libraries前面的勾。

![remove private libraries](/images/posts/android/private-library.png)

然后Clean和Refresh工程，再看生成的HelloWorld.apk的大小（45KB）：

![size without v4 library](/images/posts/android/size-without-v4.png)

这个大小大致可以接受啦！

###影响

当然程序精简带来的影响也是很明显的。

1. 大小

    |原始|移除appcompat\_v7|移除android-support-v4.jar|
    |:---:|:---:|:---:|
    |903KB|380KB|45KB|

1. 界面

    |移除appcompat\_v7前|移除appcompat\_v7后|
    |---|---|
    |![view with v7](/images/posts/android/view-with-v7.png)|![view without v7](/images/posts/android/view-without-v7.png)|
