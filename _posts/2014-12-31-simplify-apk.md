---
layout: post
title: 如何让HelloWorld.apk体积最小
categories: Android
---

按照最新ADT的默认设置（如下图所示）创建一个最简单的HelloWorld程序，会发现最后生成的apk文件大小就已经达到了惊人的903KB。如果只是想做一个功能非常简单的APP，体积也这么大的话那太让人沮丧了，那我们就来探索一下如何让这个HelloWorld.apk体积最小。

![ADT new project default settings](/images/posts/android/new-project.png)

*（注：本文所述方法是以牺牲新的API和界面风格为代价的。）*
