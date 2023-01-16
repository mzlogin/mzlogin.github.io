---
layout: fragment
title: Maven 项目只在某台机器上报找不到某个类
tags: [java, maven]
description: Maven 项目在其它机器上一切正常，但在某台机器上报找不到某个类。
keywords: Java, Maven
---

一个 Maven 项目在我的机器上能正常编译运行，但在一个同事那里不行，一直报找到不某个类。

试过 Reimport、mvn clean、重启 IDEA、重启机器，也还是一样。

确认该类所属的依赖包是正常引入的，包冲突已解决，版本也正确。

唯一异常的地方是在 IDEA 的 Project 视图里的 External Libraries 里，正常的依赖包是能够展开看里面的类的，但该类所属依赖包无法展开。

最后打开 Maven 的本地存储（比如我的是 ~/.m2 目录），才发现该依赖包对应的 jar 包是 0 字节，将它删除后 Reimport，问题解决。
