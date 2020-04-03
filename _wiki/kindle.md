---
layout: wiki
title: Kindle
categories: [Tools]
description: 我爱 Kindle
keywords: Kindle
---

## 越狱资源

- [Kindle Paperwhite 1 代越狱教程](https://bookfere.com/post/512.html)
- [Kindle 越狱资源及插件下载详细步骤](https://bookfere.com/post/311.html)
- [用插件 BookFere Tools 清理无用 sdr 文件夹](https://bookfere.com/post/480.html)

## 问题解决

### 切换亚马逊账号导致 Kindle Launcher 无法打开

提示语类似「您的设备不再被授权为开发设备」之类的，但 KOReader、KPVBooklet 和 ScreenSaver 等插件工作正常，推测越狱没有失效，只是 KUAL 相关的这个 Kindle Launcher 打不开了。

解决方法：

1. 点击一个 PDF 文件打开 KOReader；
2. 进入文件浏览器，找到 /mnt/us/mkk/developer.keystore，长按复制；
3. 进到 /var/local/java/keystore 目录，长按粘贴；
4. 重启 Kindle。

### KPVBooklet 安装后无法在主页直接打开 PDF 和 EPUB 文件

KPVBooklet 最新版 v0.66 安装到 Kindle Paperwhite 1 代 5.6.1.1 固件会出现此问题，点击 PDF 文件提示「无法启动选定的应用程序」。

解决方法：

到官网仓库 <https://github.com/koreader/kpvbooklet/releases> 下载安装 v0.6.4 版本可正常工作。看 [Issue #46](https://github.com/koreader/kpvbooklet/issues/46) 里的讨论，是 v0.6.5 和 v0.6.6 换了打包的人员，有可能使用的 JDK 版本等有差异导致的。
