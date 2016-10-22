---
layout: post
title: vim-markdown-toc 发布 v1.0 版
categories: Vim
description: 我写的第一款 Vim 插件的 Release 版本。
keywords: Vim, Markdown, Table of Contents
---

前几天，第一款由我独立开发的 Vim 插件 vim-markdown-toc 升级了功能，发布了 v1.0 版本。

它的主要功能是为 Markdown 文件生成 toc（Table of Contents）、更新已经存在的 toc 和在保存时自动更新 toc。

说它是当前使用 Vim 编辑 Markdown 文件时维护 Table of Contents 的最佳解决方案应该不为过。

## 下载地址

* [vim-markdown-toc](https://github.com/mzlogin/vim-markdown-toc)

## 主要更新

1. 支持使用 `:UpdateToc` 命令更新已经存在的 toc。

2. 支持保存时自动更新 toc。

## 功能演示

![vim-markdown-toc-screenshot](https://raw.githubusercontent.com/mzlogin/vim-markdown-toc/master/screenshots/english.gif)

## 一些体会

1. 相比于 [awesome-adb](https://github.com/mzlogin/awesome-adb) 的一千多个 Star，[vim-markdown-toc](https://github.com/mzlogin/vim-markdown-toc) 的三十多个 Star 在我心目中含金量更高。

2. 做能挣钱的东西，或者对自己有用的东西。

   有天和我们组去年来的小朋友聊天，他说了一个观点我觉得很有道理：做能给自己产生经济效益的东西，你才有动力持续下去。虽然听起来功利，但不无道理。

   这么一个插件显然不能挣钱，它属于第二种。本次更新的功能其实在半年前就有网友提过需求，见 [#6](https://github.com/mzlogin/vim-markdown-toc/issues/6)，但我却迟迟没有动手。半年后的某个夜里，突然就决定要把这些做出来，并且花了几个小时就做完了。究其原因，还是因为自己现在有了需求，我现在要维护几份比较长的 Markdown 文档，如果每次手动去删除已有 toc 然后再次生成，虽然比纯手工写 toc 要不知道方便和准确到哪里去了，但归根结底还是不够完美。果然最后用着自己做的功能替自己省下不少重复劳动时，那种感觉也是很爽的。

3. 酒香也怕巷子深。

   发布了个人的项目后，适当地在相关的社区进行推广，让更多的人享受到你的劳动成果，帮助验证和反馈，也能给自己带来更多的成就感和关注度。
