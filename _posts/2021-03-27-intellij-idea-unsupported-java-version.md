---
layout: post
title: 解决 IntelliJ IDEA 启动报 Unsupported Java Version 的问题
categories: Java
description: 解决 IntelliJ IDEA 启动报 Unsupported Java Version 的问题
keywords: IntelliJ IDEA, Unsupported Java Version
---

今天用我老掉牙的 MacBook Pro 2015 跑 IDEA 时，感觉略卡，于是在网上找了一些教程来优化它的启动和运行速度。

## 遇到问题

有不少网友提到的一个措施是修改 IDEA 自身运行的 Runtime，即 JDK 版本。也决定试一下看看效果，于是安装了 `Choose Runtime` 插件，然后将默认的 JetBrains Runtime 由 IDEA 自带 JDK 11 换成了我自己安装的 JDK1.8.0_271，然后……IDEA 就再也起不来了，启动就报如下这个错误：

![](/images/posts/java/idea-unsupported-java-version.png)

```
Unsupported Java Version

Java 11 or newer is required to run the IDE.
Please contact support at https://jb.gg/ide/critical-startup-errors

Your JRE: 1.8.0_271-b09 x86_64 (Oracle Corporation)
/Library/Java/JavaVirtualMachines/jdk1.8.0_271.jdk/Contents/Home/jre
```

## 解决方法

1. 想办法进设置 Runtime 的地方，将配置再改回来。

    但并没有找到办法进设置。失败

2. 想办法找到存储这个配置项的配置文件，手动修改回来。

    在网上搜、按经验找了 `~`、`~/Library/Preferences` 等文件夹，均未找到正在使用的 2020.3 版本的配置文件。失败

3. 此时留意到以上错误提醒里有个链接，打开链接寻找线索。

    - 打开 <https://jb.gg/ide/critical-startup-errors>，在该页面并未直接找到答案，但在侧边栏发现了线索链接。
    - 跳转到 [Selecting the JDK version the IDE will run under](https://intellij-support.jetbrains.com/hc/en-us/articles/206544879-Selecting-the-JDK-version-the-IDE-will-run-under)，在正文的 macOS 部分，提到了如果配置过 IDE JDK Version，会保存在配置文件目录下的 `<product>.jdk` 文件里，并提供了配置文件目录相关的链接。
    - 跳转到 [Directories used by the IDE to store settings, caches, plugins and logs](https://intellij-support.jetbrains.com/hc/en-us/articles/206544519)，可以找到 macOS 下 IDEA 2020.3 的配置文件路径 idea.config.path 为 `~/Library/Application Support/JetBrains/IntelliJIdea2020.3`，打开该目录，果然发现了 idea.jdk 文件。
    - 将 idea.jdk 文件删除，重新打开 IDEA，问题解决。

## 小结

当遇到问题时，最应该关注的是错误提示里的信息，很可能解决方案或线索就在里面。

如果以上解决不了问题，在官方文档/网站等渠道寻找解决方案会比盲目全网搜索更精准。如 [Configuration directory](https://www.jetbrains.com/help/idea/tuning-the-ide.html#config-directory) 这个链接里就清楚地描述了 IntelliJ IDEA 配置文件的存放位置。
