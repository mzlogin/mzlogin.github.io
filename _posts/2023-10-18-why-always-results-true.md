---
layout: post
title: 代码审查｜这段代码，为什么复制文件夹总是“成功”？
categories: [Java]
description: 遇到一个 Bug，复制文件夹总是“成功”，实际结果并非如此，对应的代码比较典型，拿出来分析下。
keywords: Java, 代码审查, Android
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近开始一个人负责整个项目的全栈开发和维护，工作中没了和同事交叉 code review 的环节，所以就打算，如果工作中遇到一些比较典型的代码，包括好味道和坏味道，就拿出来分析下，与大家一起交流，作为另一种形式的「交叉 review」。

这天遇到这样一个问题：在 Android 手机上复制 assets 里的文件夹到手机里，实际并没有拷贝完成，但代码总是显示成功，看了下代码，使用的是阿里云播放器 Android SDK 的 Demo 里的一个工具类。

工具类里的相关代码经过简化后示意如下：

```java
public class Commen {
    private static Commen instance;
    private volatile boolean isSuccess;

    public static Commen getInstance(Context context) {
        // some code here，单例控制，返回 instance
        // ...
    }

    public void copyAssetsToDst(Context context, String srcPath, String dstPath) {
        try {
            String[] fileNames = context.getAssets().list(srcPath);
            if (fileNames.length > 0) {
                for (String fileName : fileNames) {
                    // 文件夹，递归调用
                    copyAssetsToDst(context, srcPath + File.separator + fileName,
                            dstPath + File.separator + fileName);
                }
            } else {
                // some code here，单个文件拷贝
                // ...
            }
            isSuccess = true;
        } catch (Exception e) {
            isSuccess = false;
        }
    }
}
```

这段代码使用起来若不谨慎，至少存在以下问题：

1. 线程安全问题：该类是一个单例类，代码中的 `isSuccess` 相当于是一个全局变量，如果多个线程同时调用 `copyAssetsToDst` 方法，会出现线程安全问题，导致 `isSuccess` 的值被交叉覆盖，不可预期；

2. 结果正确性：因为 Exception 全都被 catch 住了，这样如果 srcPath 是一个文件夹，递归调用方法自身后，最外层总是会将 `isSuccess` 设置为 true，导致最终结果总是显示成功，而实际结果未知。

如果由我来写这段代码，我会做这样的修改：

- 将类改为工具类，公开的方法都是静态方法，不需要单例控制；

- 方法执行是否成功，由返回值、是否抛出异常来表示，不使用成员变量记录；

- 拷贝过程中，记录拷贝成功的文件列表，如果最终失败，将中间生成的文件做清理。