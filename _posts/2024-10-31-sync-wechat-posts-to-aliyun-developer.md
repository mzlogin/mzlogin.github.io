---
layout: post
title: 将微信公众号文章同步到阿里云开发者社区
categories: [Tools]
description: 本文介绍了一种通过自己拓展的浏览器插件，便捷地将微信公众号文章同步到阿里云开发者社区的方法。
keywords: 微信公众号, 阿里云开发者社区, 同步
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

本文介绍了一种通过自己拓展的浏览器插件，便捷地将微信公众号文章同步到阿里云开发者社区的方法。

先上效果图：

![](https://raw.githubusercontent.com/mzlogin/blog-assets/refs/heads/master/wechat-sync-to-aliyun.gif)

## 缘起

半个多月前接到 讨厌菠萝 同学的盛情邀请，入驻阿里云开发者社区，他也不时地监督我将以前的文章同步过来，奈何我懒癌晚期，一直没怎么动。

但心里其实一直记着这个事的，答应了人家，总得做点什么。

一篇一篇地手动复制粘贴实在太费劲了，也不是程序员做事的风格，于是就想着能不能找个什么工具，能帮我简化这个过程。

最后没有找到什么现成的，只好自己扩展了一个，下面就来介绍一下我的方案。

## 方案

一文多发的需求其实我一直都有，以前也陆续用过 OpenWrite、ArtiPub 等工具，后来因为种种原因，只留下了 Wechatsync 这个浏览器插件。

我现在发布文章一般是先在微信公众号发布，然后再通过 Wechatsync 同步到知乎、掘金等平台。

看了下 Wechatsync 插件的原始代码仓库，目前并不支持 阿里云开发者平台。源码的最后一次更新时间停留在 2023 年 9 月，Issues 里也有人反馈了一些问题，但是作者好像没怎么回复了。

那就自己动手，丰衣足食吧，扩展一下 Wechatsync，让它支持阿里云开发者社区。

## 实现

### 了解扩展 Wechatsync 的方法

这个在 Wechatsync 的官方 API 文档里有介绍：

<https://github.com/wechatsync/Wechatsync/blob/master/API.md>

简而言之，如果要新增一个平台的支持，需要添加一个适配器，适配器需实现以下方法来完成工作流程：

- getMetaData 获取平台用户信息
- preEditPost 对文本内容进行预处理
- addPost 向平台添加文章
- uploadFile 向平台上传文章里的图片（然后插件会进行内容替换）
- editPost 向平台更新替换图片后的文章内容

### 分析阿里云开发者社区的接口

打开阿里云开发者社区的网站 <https://developer.aliyun.com/> ，登录后，打开浏览器的开发者工具，尝试进行发布文章必要的操作，查看网络请求，找到了一些接口：

- 新建/保存草稿：/developer/api/articleDraft/putDraft
- 获取上传图片 URL：/developer/api/image/getImageUploadUrl
- 获取个人信息：/developer/api/my/user/getUser

有了这些，基本就够了。

### 实现适配器

作为一名前端初学者，对照着 Wechatsync 的源码里面其它的适配器，最终编写和调试完成了阿里云开发者社区的适配器。

就不把源码直接贴出来水篇幅了，有兴趣的可以去我的 GitHub 仓库查看，适配器源码直达链接：

- <https://github.com/mzlogin/Wechatsync/blob/master/packages/%40wechatsync/drivers/src/aliyun.js>

写完适配器之后，再在 packages/web-extension/src/drivers/driver.js 文件里作少量修改，将其集成，然后就可以正常使用了。

## 使用方法

### 安装

Wechatsync 的原始作者是在 Chrome 商店上架了该插件的，只是版本不是最新。我 fork 出来做的一些修改主要自己使用，所以只是在自己的 fork 仓库里发布了最新版本，如果想要使用的话，可以用开发者模式加载：

1. 下载并解压：https://github.com/mzlogin/Wechatsync/releases
2. 在浏览器打开 chrome://extensions（适用 Chrome、Edge 等）
3. 开启开发者模式
4. 拖入解压后的文件夹到浏览器插件页

### 使用

以我将微信公众号的文章同步到阿里云开发者社区为例：

1. 登录阿里云开发者社区
2. 打开微信公众号文章页
3. 点击 Wechatsync 插件图标
4. 勾选「阿里云开发者社区」，点击「同步」按钮
5. 点击「查看草稿」，确认无误后，发布文章

整个操作如文首的 gif 所示。

## 小结

这个方案虽然不算完美，但是对我来说已经足够了，省去了很多重复的劳动，也算是一种效率提升吧。

如果你也有类似的需求，可以参考我的方案，或者自己动手扩展 Wechatsync，让它支持更多的平台。

本文所述相关源码已经提交到了我 fork 出来的 GitHub 仓库，供参考：

- <https://github.com/mzlogin/Wechatsync>