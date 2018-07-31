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

**解决方案：**

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

## 打开 uiautomatorviewer 报错

打开 uiautomatorviewer 报错，提示：

```
Unable to connect to adb. Check if adb is installed correctly.
```

实际 adb 命令是可正常使用的。

解决方法：

打开 uiautomatorviewer.bat 文件（Windows 下，其它系统可能是 .sh），找到下面这行（一般是最后一行）：

```sh
call "%java_exe%" "-Djava.ext.dirs=%javaextdirs%" "-Dcom.android.uiautomator.bindir=%prog_dir%" -jar %jarpath% %*
```

将其中的 `%prog_dir%` 改为 Android SDK 的 tools 目录路径，比如：

```sh
call "%java_exe%" "-Djava.ext.dirs=%javaextdirs%" "-Dcom.android.uiautomator.bindir=D:\Android\sdk\tools" -jar %jarpath% %*
```

参考：[In UI automator viewer Error Obtaining Device screenshot, Reason : Error Unable to connect to adb. Check if adb is installed correctly](https://stackoverflow.com/questions/42696158/in-ui-automator-viewer-error-obtaining-device-screenshot-reason-error-unable)

## is not translated in "zh"

报错信息：

```
Error: "app_name" is not translated in "zh" (Chinese) [MissingTranslation]
```

在引用了 Umeng 的 SDK 后编译报错，疑是 Umeng 包里的 values-zh 导致。

解决方案 1：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources
  xmlns:tools="http://schemas.android.com/tools"
  tools:ignore="MissingTranslation" >
```

解决方案 2：

在主项目的 build.gradle 里添加如下代码：

```groovy
android {
    lintOptions {
        checkReleaseBuilds false
        abortOnError false
    }
}
```

参考：

* <http://blog.csdn.net/cxc19890214/article/details/39120415>
* <https://segmentfault.com/a/1190000000599530>

## 一直卡在 Gradle:Resolve dependencies'app:debugCompile'

这种情况一般是 Gradle 去拉取某个 dependencies 的时候连不上导致。

一种方法是如果本地有能编译通过的其它工程，修改 compileSdkVersion 和 buildToolsVersion 及 dependencies 里的版本为能编译通过的工程的版本；另一种方法是将对应的依赖包 jar 下载到本地放到 libs 里面；还有一种思路是修改 jcenter() 为其它可用的源。

## 更新到 Android Studio 3.0 后报错

提示信息：

```
Unable to resolve dependency for ':internal@packagingOptions/compileClasspath': Could not resolve project :commonlib.

Could not resolve project :commonlib.
Required by:
    project :internal
 > Unable to find a matching configuration of project :commonlib:
     - Configuration 'debugApiElements':
         - Required com.android.build.api.attributes.BuildTypeAttr 'packagingOptions' and found incompatible value 'debug'.
         - Required com.android.build.gradle.internal.dependency.AndroidTypeAttr 'Aar' and found compatible value 'Aar'.
         - Found com.android.build.gradle.internal.dependency.VariantAttr 'debug' but wasn't required.
         - Required org.gradle.api.attributes.Usage 'java-api' and found compatible value 'java-api'.
     - Configuration 'debugRuntimeElements':
         - Required com.android.build.api.attributes.BuildTypeAttr 'packagingOptions' and found incompatible value 'debug'.
         - Required com.android.build.gradle.internal.dependency.AndroidTypeAttr 'Aar' and found compatible value 'Aar'.
         - Found com.android.build.gradle.internal.dependency.VariantAttr 'debug' but wasn't required.
         - Required org.gradle.api.attributes.Usage 'java-api' and found incompatible value 'java-runtime'.
     - Configuration 'releaseApiElements':
         - Required com.android.build.api.attributes.BuildTypeAttr 'packagingOptions' and found incompatible value 'release'.
         - Required com.android.build.gradle.internal.dependency.AndroidTypeAttr 'Aar' and found compatible value 'Aar'.
         - Found com.android.build.gradle.internal.dependency.VariantAttr 'release' but wasn't required.
         - Required org.gradle.api.attributes.Usage 'java-api' and found compatible value 'java-api'.
     - Configuration 'releaseRuntimeElements':
         - Required com.android.build.api.attributes.BuildTypeAttr 'packagingOptions' and found incompatible value 'release'.
         - Required com.android.build.gradle.internal.dependency.AndroidTypeAttr 'Aar' and found compatible value 'Aar'.
         - Found com.android.build.gradle.internal.dependency.VariantAttr 'release' but wasn't required.
         - Required org.gradle.api.attributes.Usage 'java-api' and found incompatible value 'java-runtime'.
```

情况是有一个叫 internal 的 project 依赖一个叫 commonlib 的 module，最后查到原因如下：

internal project 的 build.gradle 文件里写了这么一段：

```groovy
android {
    ...
    buildTypes {
        debug {
            signingConfig signingConfigs.release
        }
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
        packagingOptions {
            exclude 'META-INF/INDEX.LIST'
            exclude 'log4j.xml'
        }
    }
}
```

实际 packagingOptions 应该放到 buildTypes 之外，改成这样就 OK 了：

```groovy
android {
    ...
    packagingOptions {
        exclude 'META-INF/INDEX.LIST'
        exclude 'log4j.xml'
    }

    buildTypes {
        debug {
            signingConfig signingConfigs.release
        }
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}
```

以前曾经通过这样修改临时掩盖了问题，让编译能过：

```groovy
dependencies {
    ...
    implementation project(path: ':commonlib', configuration: 'default') // 临时方案
    // implementation project(':commonlib')  // 原来的样子
}
```

这样修改编译能通过，但是会有个问题，就是在 internal project 工程里调用 commonlib 的方法的地方，Ctrl + 鼠标左键，或者右键 Go To Declaration 时会跳到 ~/.gradle/caches/transforms-1/files-1.1/commonlib-release.aar 目录里的 .class 文件，而非 .java 源文件。

回答在 [StackOverflow 的一个问题][2] 下。

## 启动模拟器提示 Intel HAXM is required to run this AVD your CPU does not support VT-x

我使用 Win10 系统，换主板之后遇到的，之前模拟器是能正常运行的。

我遇到的原因是 Hyper-V 的影响，导致无法安装 HAXM，虽然在 msconfig 里查看我的 Hyper-V 服务都已经停止，我在 BIOS 里也已经 Enable 了 Virtualization Technology 相关的选项，仍然报相同的错误。

解决步骤参考 <http://blog.csdn.net/WangZuoChuan/article/details/54620016>：

1. 打开管理员权限的 CMD

2. 运行 `bcdedit /copy {current} /d “Windows10 no Hyper-V`

    这时会输出一个 UUID

3. 执行 `bcdedit /set {XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX} hypervisorlaunchtype OFF`

    将 XXX 部分换成步骤 2 里输出的 UUID

4. 在 msconfig 的「引导」里将 `Windows 10 no Hyper-V` 设为默认

5. 重启

## Android Studio 里对所有 Activity 显示警告

警告信息：

```
methods findViewById(int) from android.app.Activity and findViewById(int) from android.support.v7.app.AppCompatActivity are inherited with the same signature
```

解决方案：

项目里有几个模块，有的 compileSdkVersion 和 targetSdkVersion 是 25，有的是 26，全部改成 26 并把 appcompat-v7 等 dependencies 也改成 26 对应版本后问题消失。（但诡异的是我后来改回 25 想复现一下，问题却不再出现了）

## Plugin with id 'com.android.application' not found

导入一个别人做的工程的时候遇到报错：

```
Error:(1, 0) Plugin with id 'com.android.application' not found
```

怀疑是使用比较老的版本的 Android Studio 创建，该工程只有一个 build.gradle 文件——我们平时创建的工程应该是有两个，一个 Project 级别的，一个 Module 级别的。

它是只有一个 Project 级别的 gradle 文件，但是内容却是 Module 级别 gradle 文件的内容。

后来在 StackOverflow 上找到 [解决方案](https://stackoverflow.com/questions/24795079/error1-0-plugin-with-id-com-android-application-not-found)：

在 build.gradle 文件顶部添加如下代码（注意 Gradle 版本与 Gradle Plugin 的版本对应）：

```groovy
buildscript {
    repositories {
        jcenter()
        google()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:3.0.0'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
}

allprojects {
    repositories {
        jcenter()
        google()
    }
}
```

## 升级后 Gradle sync 出错

从 Android Studio 3.0.1 升级到 3.1 的时候，`Check for Updates...` 提示超时，于是挂了代理升级。但是升级完成之后，打开以前能顺利构建的工程，提示 `Cause: jcenter.bintray.com:443 failed to respond`，怀疑是代理的原因，于是在 Settings 里将 HTTP Proxy 选项改为以前的 `no proxy`，报错变成 `Connection refused: connect`，搜索了一番之后找到 [这个](https://stackoverflow.com/questions/36330895/gradle-sync-failed-connection-refused)，依提示打开 ~/.gradle/gradle.properties，发现里面果然还存在代理的设置信息，删除之后重启 Android Studio，问题解决。

## Generate JavaDoc 提示“错误: 编码GBK的不可映射字符”

所有相关文件的编码都是 UTF-8，在 Android Studio 里没有找到设置 JavaDoc 相关的编码设置项，于是在 `Generate JavaDoc` 时弹出的 `Specify Generate JavaDoc Scope` 对话框的 `Other command line arguments` 一项里填入 `-encoding utf-8 -charset utf-8`，问题解决。

![android-studio-javadoc](/images/posts/android/android-studio-javadoc.png)

## 升级 Gradle Plugin 版本后报错

```
The SourceSet 'instrumentTest' is not recognized by the Android Gradle Plugin. Perhaps you misspelled something?
```

将 `android { sourceSets { } }` 里的 `instrumentTest.setRoot(...)` 改为 `androidTest.setRoot(...)` 后问题解决。

## 编译报错 Error:Execution failed for task ':app:transformClassesWithDexForRelease'

我这里的原因是一个 APP 依赖一个 Module，这两个使用了相同的包名，将 APP 的包名改了之后问题解决。

## 升级到 3.1 后编辑 Gradle 文件卡顿

不止是卡顿……基本上就是整个 Android Studio 卡住几十秒没办法动的那种。在网上搜索之后发现遇到这种问题的网友还挺多，果然是垃圾软件毁我青春 :-P。

参考 <https://blog.csdn.net/wangluotianxi/article/details/79757558>，卡顿原因是编辑 Gradle 文件过程中一直在请求下面两个接口：

```
http://search.maven.org/solrsearch/select?q=g:%22com.google.android.support%22+AND+a:%22wearable%22&core=gav&rows=1&wt=json
http://search.maven.org/solrsearch/select?q=g:%22com.google.android.gms%22+AND+a:%22play-services%22&core=gav&rows=1&wt=json
```

而且，结果返回之前会卡住界面，而我们的网络访问这俩网址基本只能等到超时返回了，所以，临时解决方案是在 hosts 文件里添加如下内容，让这俩请求快速失败返回：

```
127.0.0.1 search.maven.org
```

暂未发现对正常功能有影响。

## 编译报错 You should manually set the same version via DependencyResolution

> Android dependency 'org.mazhuang:commonlib' has different version for the compile (0.0.4) and runtime (0.0.5) classpath. You should manually set the same version via DependencyResolution

Project A 使用了 Module B，A 依赖 commonlib(0.0.4)，而 Module B 里引用了 commonlib(0.0.5)，将 A 也改为依赖 commonlib(0.0.5) 即可。

## 编译报错 Please use JDK 8 or newer

Gradle Sync 的时候无法成功，报错

```
Gradle sync failed: Please use JDK 8 or newer
```

尝试 Rebuild 报错

```
Supplied javaHome is not a valid folder.
```

原因是我在 Project Settings 的 SDK Location 里手动指定了 JDK 的版本，但是后来升级了 JDK，所以原有路径失效了。

解决方法是将 Project Settings 的 SDK Location 里 JDK 的路径改为正确路径，或者省事起见可以直接勾选 Use embedded JDK 即可。

## 编译报错 Caused by: java.io.IOException: Cannot run program

提示找不到 NDK 工具链里的 `mips64el-linux-android-strip`，导致 `Caused by: java.io.IOException: error=2`。

原因是 NDK r17 移除了对 ARMv5(armeabi)、MIPS 和 MIPS64 的支持，所以对应的工具链也没有了。

解决办法有几种：

1. 检查 Gradle Plugin 的版本，即 project 级别的 build.gralde 文件里

    ```groovy
    dependencies {
        classpath 'com.android.tools.build:gradle:3.1.3'
        ...
    }
    ```

    `com.android.tools.build:gradle` 的版本改为 3.1  以上。

2. 将 NDK 版本退回 16b，或将 16b 以下的对应 mips 工具链的文件夹拷贝到 r17 的对应目录下。

[1]: http://developer.android.com/tools/publishing/app-signing.html
[2]: https://stackoverflow.com/questions/46949622/android-studio-3-0-unable-to-resolve-dependency-for-appdexoptions-compilecla#answer-47426050
