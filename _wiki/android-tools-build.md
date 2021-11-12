---
layout: wiki
title: 构建
cate1: Android
cate2:
description: 构建
keywords: Android
---

## 65K 方法数限制

简而言之：

编译器生成 classes.dex 文件时会给一个 dex 文件里的所有方法分配一个唯一 ID，而这个 ID 限于 Dalvik bytecode 操作数 16 bits 的限制，范围为 [0, 0xffff]。

## 在代码里区分 Debug 和 Release

使用 BuildConfig.DEBUG 并不总是准确，有几种方法来较为准确地区分当前是 Debug 版还是 Release 版，都是需要用 Gradle 脚本做一些配置。

方法一：

在 App 或者 Module 的 build.gradle 里添加配置：

```groovy
gradle.startParameter.getTaskNames().each { task ->
    println("task: " + task)
    // library里 BuildConfig.DEBUG 默认一直是 flase 所以需要自定义
    if (task.contains("Debug")) {
        android {
            defaultPublishConfig "debug"
        }

    } else if (task.contains("Release")) {
        android {
            defaultPublishConfig "release"
        }
    }
}
```

然后在代码里使用 BuildConfig.DEBUG 就准确了。

方法二：

```groovy
buildTypes {
    debug {
        resValue "string", "build_config_type", "debug"
    }
    release {
        resValue "string", "build_config_type", "release"
    }
}
```

然后在代码里使用 context.getString(R.string.build_config_type) 值是否为 debug 来判断。

## 参考

* [由Android 65K方法数限制引发的思考](https://jayfeng.com/2016/03/10/%E7%94%B1Android-65K%E6%96%B9%E6%B3%95%E6%95%B0%E9%99%90%E5%88%B6%E5%BC%95%E5%8F%91%E7%9A%84%E6%80%9D%E8%80%83/)
* [解决传说中的 Android 65k 问题](http://www.jianshu.com/p/245022d136e1)
* [Android如何区分debug和release两种状态](http://blog.csdn.net/qq_20230661/article/details/70146585)
* [Android打包的那些事](http://jayfeng.com/2015/11/07/Android%E6%89%93%E5%8C%85%E7%9A%84%E9%82%A3%E4%BA%9B%E4%BA%8B/)
