---
layout: fragment
title: Edge 浏览器本地安装 crx 插件
tags: [edge]
description: Edge 浏览器本地安装 crx 插件
keywords: crx
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

Microsoft Edge 浏览器较新的版本，如我正在使用的 114.0.1823.67，会自动删除通过浏览器下载的 crx 文件。

如果我们要本地安装一些比较老版本的插件，无法通过插件市场直接安装，而能下载到本地的只有 .crx 文件时怎么办呢？

我的办法是：

1. 通过命令行工具下载文件到本地，如 `axel -n 5 https://xxx.xxx/xxx.crx`；
2. 将下载的文件重命名为 .zip 文件；
3. 打开 Edge 浏览器的扩展管理页面 <edge://extensions/>，勾选「开发人员模式」，将 .zip 文件拖入页面中即可。
