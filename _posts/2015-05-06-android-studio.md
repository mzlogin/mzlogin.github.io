---
layout: post
title: Android Studio遇到问题集锦
categories: Android
description: Android Studio使用过程中遇到的一些问题和解决方案集合。
keywords: Android, Android Studio
---

1. 打开Android Studio卡在“Fetching Android SDK component information”界面。

    如图：

    ![](/images/posts/android/android-studio-check-sdk.png)

    Android Studio First Run检测Android SDK及更新，由于众所周知的原因，我们会“Unable to access Android SDK add-on list”，而且大家一般也已经提前配置好了Android SDK，真正需要更新的时候手动去SDK Manager更新就好了。

    解决方案：

    在Android Studio安装目录bin/idea.properties文件最后追加一句

    ```
    disable.android.first.run=true
    ```

    参考： <http://ask.android-studio.org/?/article/14>

2. 新建工程后构建时提示

    ```
    Error:Failed to find: com.android.support:appcompat-v7:22.+
    ```

    解决方案：
    1. 打开 SDK Manager，然后安装 Extras 下的 Android Support Repository：
        ![](/images/posts/android/android-support-repository.png)
    2. Rebuild 工程。
