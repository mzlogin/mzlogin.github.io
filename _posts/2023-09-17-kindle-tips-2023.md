---
layout: post
title: 读书｜通过 Git 管理 Kindle 屏保图片，一键自动同步
categories: [Kindle]
description: 通过 Git 管理 Kindle 屏保图片，一键自动同步。
keywords: Kindle, Git
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前面一篇文章 [读书｜程序员如何传书到 Kindle][1] 介绍了我最喜欢的通过 WiFi 向 Kindle 传书的方法，这篇文章介绍一下我是如何管理 Kindle 屏保图片的。

作为一个爱折腾的人，除了阅读，我也尝试过 Kindle 的各种玩法，其中一项就是自定义屏保图片。每次拿起设备时，都能看到自己喜欢的屏保图片，开始阅读的心情也会变得愉悦。

![](/images/posts/kindle/screensavers.png)

更换 Kindle 屏保常用的方式是使用 ScreenSavers Hack 插件，我也是用它，但管理屏保图片并不方便，每当想要更换图片时，需要通过 USB 或者其它方式拷贝图片到 Kindle 的特定目录下，并需要使用特定的连续数字命名规则才能生效，这对于想要经常更换图片的人来说，是一件很麻烦的事。

于是我设计了这样一个工作流来解决这个问题：

![](/images/posts/kindle/kindle-screensavers-workflow.drawio.png)

概括一下就是三步走：

一、在电脑上制作和整理好屏保图片；

二、使用 Git 提交到 GitHub；

三、在 Kindle 上用插件一键同步。

对应最后一步，我自制了一款 Kindle 插件，来实现在 Kindle 上一键从 GitHub 同步屏保图片的功能。

运行截图：

![](/images/posts/kindle/kual-screensaver-sync.png)

它的同步逻辑：

1. 删除本地有，GitHub 上没有的屏保图片；

2. 下载远程有，本地没有的屏保图片；

3. 如果一张屏保图片本地和远程的 md5 值不一样，本地文件将被远程文件覆盖。

插件项目地址：<https://github.com/mzlogin/kual-screensaver-sync>

我的屏保图片管理项目地址：<https://github.com/mzlogin/kindle-paperwhite-screensavers>

插件的详细安装、使用方法可以参考插件项目的 README，在此不做赘述。

以上管理方式的好处有：

- 通过 Git 管理，可以在需要的时候回溯历史；

- 整个过程无需使用 USB 线缆，Kindle 和电脑也不受地理位置和局域网限制；

- 增量按需更新；

- 甚至可以多人合作、相互很方便的分享屏保图片。

如果你也对这样一种管理 Kindle 屏保图片的方式感兴趣，可以参考我的项目，自己动手制作和使用起来。

[1]: https://mp.weixin.qq.com/s?__biz=MzIwMDA3ODQzNA==&amp;mid=2459863533&amp;idx=1&amp;sn=877a0ddeee256b3d20cb3823e16d16a0&amp;chksm=81e88ce0b69f05f6b685d8a37ee6a990a92c0622490d1b57bb002198fbd6e27715490d783c2d&token=1959625383&lang=zh_CN#rd
