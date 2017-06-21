---
layout: post
title: Android Studio 遇到问题集锦
categories: Android
description: Android Studio 使用过程中遇到的一些问题和解决方案集合。
keywords: Android, Android Studio
---

## 打开 Android Studio 卡在「Fetching Android SDK component information」界面。

如图：

![](/images/posts/android/android-studio-check-sdk.png)

Android Studio First Run 检测 Android SDK 及更新，由于众所周知的原因，我们会「Unable to access Android SDK add-on list」，而且大家一般也已经提前配置好了 Android SDK，真正需要更新的时候手动去 SDK Manager 更新就好了。

解决方案：

在 Android Studio 安装目录 bin/idea.properties 文件最后追加一句

```
disable.android.first.run=true
```

参考： <http://ask.android-studio.org/?/article/14>

## 新建工程后构建时提示找不到 appcompat-v7

```
Error:Failed to find: com.android.support:appcompat-v7:22.+
```

解决方案：

1. 打开 SDK Manager，然后安装 Extras 下的 Android Support Repository：

   ![](/images/posts/android/android-support-repository.png)

2. Rebuild 工程。

## aidl 文件的放置

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

## 在 Android Studio 里编译通过之后，命令行使用 gradlew build 为什么还是会重新下载 Gradle？

Gradle 的版本在 Android Studio 工程里有三处：

一、gradle/wrapper/gradle-wrapper.properties 文件的 distributionUrl 字段里指定的。

```
#Wed Oct 21 11:34:03 PDT 2015
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-2.8-all.zip
```

比如这里指定的是 2.8 版本。

二、Android Studio 的 File > Project Structure > Project 里显示的。

这个实际上就是显示的「一」里的版本。

三、Android Studio 的 File > Settings > Build, Execution, Deployment > Build Tools > Gradle 里选择的是「Use default gradle wrapper (recommended)」还是「Use local gradle distribution」。

出现题目里的问题一般是由于「三」中选择的是「Use local gradle distribution」，这个选项下的「Gradle home」路径一般是指向 Android Studio 安装目录下的 Gradle 目录，比如 C:/Program Files/Android/Android Studio/gradle/gradle-2.8，而 gradlew 脚本是独立于 Android Studio 的，所以并不受其配置的影响，它是使用「一」里指定的版本，会到 ~/.gradle/wrapper/dists 目录下去寻找对应版本的 Gradle 是否已经存在，如果没有话就会去重新下载。

## 模拟器启动失败

```
PANIC: ANDROID_SDK_HOME is defined but could not find Nexus_5_API_23.ini file in $ANDROID_SDK_HOME/.android/avd
(Note: avd is searched in the order of $ANDROID_AVD_HOME,$ANDROID_SDK_HOME/.android/avd and $HOME/.android/avd)
```

实际上文件存在于 $HOME/.android/avd 目录下，但看样子如果设置了 $ANDROID_SDK_HOME 环境变量，Android Studio 在 $ANDROID_SDK_HOME/.android/avd 下找不到模拟器文件将直接报错，而不会再去找 $HOME 目录下的文件。

**解决方案：**

添加 $ANDROID_AVD_HOME 环境变量，值为 $HOME/.android/avd 的展开全路径。

## debug.keystore 的存放位置

在使用高德地图 SDK 时，需要 key 与 keystore 文件的 sha1 校验通过，而我将 debug.keystore 拷贝到 $HOME/.android 目录下后发现一直提示 key 校验失败，也就是没有使用我拷贝到 $HOME/.android 目录下的 debug.keystore 来做 debug 签名。

原因是 debug.keystore 的默认存储路径是 $HOME/.android，但是如果配置了 $ANDROID_SDK_HOME，则会将 debug.keystore $ANDROID_SDK_HOME/.android 目录下。

**解决方案：**

将 debug.keystore 文件拷贝到 $ANDROID_SDK_HOME/.android 目录下。

BTW:

关于给 App 签名的手动、自动方法参考 [Signing Your Applications][1]。

Android Studio 自动生成的 debug.keystore 的信息：

* Keystore password: android
* Key alias: androiddebugkey
* Key password: android

## 一直提示 Please configure Android SDK

这是在一次电脑断电后出现的，试了一些方法，更新 Android Studio，将 SDK Platforms 删除了重新下，都不行，后来发现 Build Tools 可以更新，更新完后就好了。

## More than one file was found with OS independent path

比如，在 netty-buffer-4.1.5.Final.jar 与 netty-common-4.1.5.Final.jar 中都有 META-INF/io.netty.version.properties，所以编译时报错：

```
More than one file was found with OS independent path 'META-INF/io.netty.versions.properties'
```

解决方法：

在 app/build.gradle 里添加如下内容：

```gradle
android {
    packagingOptions {
        pickFirst 'META-INF/*'
    }
}
```

表示只保留一份该文件。

参考：[Android Studio: Duplicate files copied in APK META-INF/DEPENDENCIES when compile](https://stackoverflow.com/questions/27977396/android-studio-duplicate-files-copied-in-apk-meta-inf-dependencies-when-compile)

[1]: http://developer.android.com/tools/publishing/app-signing.html
