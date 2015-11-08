---
layout: post
title: Android Studio 遇到问题集锦
categories: Android
description: Android Studio 使用过程中遇到的一些问题和解决方案集合。
keywords: Android, Android Studio
---

1. 打开 Android Studio 卡在「Fetching Android SDK component information」界面。

    如图：

    ![](/images/posts/android/android-studio-check-sdk.png)

    Android Studio First Run 检测 Android SDK 及更新，由于众所周知的原因，我们会「Unable to access Android SDK add-on list」，而且大家一般也已经提前配置好了 Android SDK，真正需要更新的时候手动去 SDK Manager 更新就好了。

    解决方案：

    在 Android Studio 安装目录 bin/idea.properties 文件最后追加一句

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

3. aidl 文件的放置

    按以前 Eclipse 的方式，将 aidl 及其包目录层级放置在与自己的顶级包同级的目录下，即如下的 android/content/pm：

    ```
    app/src/main
    ├─assets
    ├─java
    │  ├─android
    │  │  └─content
    │  │      └─pm
    │  └─org
    │      └─mazhuang
    │          └─easycleaner
    └─res
        ├─drawable
        ├─layout
        ├─menu
        ...
    ```

    然而这样在调用处一直报错：

    ```
    Cannot resolve symbol 'IPackageStatsObserver'
    ```

    解决方案：

    将 aidl 文件放置在与 app/src/main/java 目录同级的 app/src/main/aidl 文件夹下。

    ```
    app/src/main
    ├─aidl
    │  └─android
    │      └─content
    │          └─pm
    ├─assets
    ├─java
    │  └─org
    │      └─mazhuang
    │          └─easycleaner
    └─res
        ├─drawable
        ├─layout
        ├─menu
        ...
    ```
