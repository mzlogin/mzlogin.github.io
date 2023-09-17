---
layout: post
title: 读书｜程序员如何传书到 Kindle
categories: [Kindle]
description: 作为一名「极客」，如何传书到 Kindle？
keywords: Kindle 
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

我有一台 2013 年从日亚海淘的 Kindle Paperwhite，至今仍在服役。除了外观上的磨损，其它一切正常，甚至连续航都依旧给力。

![](/images/posts/kindle/kindle-ten-years.jpg)

从去年亚马逊宣布，将在今年六月停止中国区 Kindle 电子书店的运营后，我一直想写点什么，来记（ji）录（dian）一下这个陪伴我多年的老伙伴，却一直没有动笔。

一年多以后的今天终于开了个头，计划分几个小主题写一写我是如何使用 Kindle 的，包括传书、屏保图片管理、文件管理等等，作为自己的存档和回忆，也希望能帮到一些「后 Kindle 时代」仍然在继续使用它的人。

虽然被戏称泡面盖，但使用电纸书当然是为了阅读，在官方电子书店停止运营后，如何把自己找到的电子书传输到 Kindle 上就成了一个绕不过去的话题。相信一些比较喜欢折腾的老用户都已经熟知各种传书的方式了，比如邮箱推送、USB 传输、亚马逊公众号等，网上相关介绍也非常多，在此不赘述。

本篇记录一下我传书到 Kindle 的「独特」方式——WiFi 传书插件。

这是我自制的一款插件，可以直接通过 WiFi 传输电子书到 Kindle，不需要使用 USB 线，也不依赖其它服务，只要 Kindle 和手机/电脑在同一个局域网内，就可以通过浏览器直接上传电子书到 Kindle。

## 运行效果

Kindle 端插件运行效果：

![](/images/posts/kindle/kindle-extension.png)

手机端上传页面效果：

![](/images/posts/kindle/page-to-upload-mobile.png)

电脑端上传页面效果：

![](/images/posts/kindle/page-to-upload.png)

## 原理

这个插件的原理是，在 Kindle 上运行一个 HTTP Server，在 8000 端口提供服务，这样局域网内的电脑、手机等设备访问 `http://{Kindle 的局域网 IP}:8000`，就可以打开一个能上传电子书到 Kindle 的网页。

![](/images/posts/kindle/kindle-wifi-transfer.drawio.png)

## 安装方法

使用这个插件需要先在 Kindle 上安装 KUAL 和 Python3，请先确保已经正确安装它们。它们的安装方法可以参考 <https://bookfere.com/post/311.html>。

插件项目地址：<https://github.com/mzlogin/kual-wifi-transfer>

1. 下载项目代码，可以 `git clone https://github.com/mzlogin/kual-wifi-transfer.git`，也可以直接到项目的 [releases](https://github.com/mzlogin/kual-wifi-transfer/releases) 下载 zip 文件；

2. 将 Kindle 用数据线连接到电脑，把刚刚下载的代码里的 wifi-transfer 文件夹拷贝到 Kindle 的 extensions 目录下（完整路径 /mnt/us/extensions）。

## 使用方法

1. 在 Kindle 上开启服务器：

    在 Kindle 上打开 KUAL，就可以在插件列表里看到「WiFi Transfer」菜单项了，点击「Start Server」，Kindle 上将显示 `Starting server at <ip:port>`；

2. 在电脑或手机上访问第 1 步显示的 `<ip:port>`，选择电子书文件并上传；

3. 上传完成后，在 Kindle 上点击「Stop Server」关闭服务器。

## 小结

以上就是我最喜欢的一种传书方式，它的优点是：

- 不依赖于 USB 线缆；
- 不依赖于网络情况——有 WiFi 的时候用 WiFi，没有 WiFi 的时候，手机/电脑开个热点给 Kindle 连上去；
- 电子书格式不限，Kindle 上能打开的都能直接传输。

另一种我现在比较常用的做法是在 Kindle 的体验版浏览器里打开 r.qq.com，使用微信读书。

Kindle 注定渐行渐远，书籍则继续伴我们同行。
