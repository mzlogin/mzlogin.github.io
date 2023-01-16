---
layout: fragment
title: IDEA 无法 import 自己工程中的类
tags: [java, intellij-idea]
description: IDEA 一直提示无法找到自己工程中的类，最终通过清缓存解决。
keywords: Java, IDEA
---

使用 IntelliJ IDEA 开发一个工程一直好好的，结果有天突然提示有两个类找不到，但这两个类其实就在本工程里。

尝试过各种方法也没有解决：

- Maven Clean
- 删除 target 目录后重新编译
- 重启 IDEA
- 重启电脑
- ...

但都没有解决问题。

最后通过清缓存解决：

菜单项 File - Invalidate Caches。

![](/images/fragments/idea-cannot-import-local-class.jpg)
