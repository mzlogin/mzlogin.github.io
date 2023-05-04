---
layout: fragment
title: 消除错误 Since Maven 3.8.1 http repositories are blocked
tags: [java, maven]
description: 消除错误 Since Maven 3.8.1 http repositories are blocked
keywords: maven
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

今天给一个老项目的 pom.xml 里加了一个依赖项后，IDEA 突然报错 `Since Maven 3.8.1 http repositories are blocked`。

在 IDEA 的设置里可以看到当前配置的 Maven 是使用的 `Bundled (Maven 3)`，版本确实是 3.8.1，忘了以前是用的什么版本了，可能前几天升级 Plugin 的时候也一起升级了 Maven 插件版本？

在网上搜了下，有几种解决方案：

1. 消除自定义的 settings.xml 里的 http repositories；——推荐
1. 降级到一个 3.8.1 以下版本的 Maven，比如 3.6.3 版本；
1. 找到 IDEA 自带的 Maven 里的配置文件，注释掉以下内容：

    比如我找到的配置文件路径是 /Applications/IntelliJ IDEA.app/Contents/plugin/maven/lib/maven3/conf/settings.xml

    ```xml
    <mirror>
      <id>maven-default-http-blocker</id>
      <mirrorOf>external:http:*</mirrorOf>
      <name>Pseudo repository to mirror external repositories initially using HTTP.</name>
      <url>http://0.0.0.0/</url>
      <blocked>true</blocked>
    </mirror>
    ```
