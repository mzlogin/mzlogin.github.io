---
layout: post
title: 搭建大型源码阅读环境——使用 OpenGrok 
categories: Tools
description: RTFSC 是程序员打怪升级路上避不开的功课，那营造一个舒适的环境来提升上课的体验就很有必要了。
keywords: OpenGrok, RTFSC
---

RTFSC 是程序员打怪升级路上避不开的功课，那营造一个舒适的环境来提升上课的体验就很有必要了。

## 工具的选择

阅读源码的工具我尝试过以下几类：

1. IDE

    在看特定类型项目时这是我的首选。比如它原本就是一个 Visual Studio 工程，那当然用 Visual Studio 来打开阅读，看 Android App 或者 Library 源码当然用 Android Studio 体验更好。

2. 编辑器配合插件

    比如 Vim + Ctags + Cscope，再配合文件模糊查找插件 LeaderF 和神器 YouCompleteMe，在源码规模不大时很方便，打开也轻快，阅读一些小项目时我还是乐意使用它们。

3. 专门的源码阅读工具

    一类是商业软件，比如 Windows 下有著名的 Source Insight，跨平台的有 Understand，功能都很强大，都是不错的选择。当然它们都价格不菲。

    而我这里要讲的主角 OpenGrok 属于另一类，免费，开源，运行流畅，功能也毫不逊色。

如果你还在寻觅适合你自己的解决方案，大可以花一点时间将以上几种都尝试一遍，哪个称手用哪个。不愿意折腾的也可以直接看看一些使用 OpenGrok 的在线源码查看网站，看看它能否满足你的需求，其中的一些列在 [OpenGrok installations](https://github.com/OpenGrok/OpenGrok/wiki/OpenGrok-installations)。

## OpenGrok 特性

译自官方 [Wiki](https://github.com/OpenGrok/OpenGrok/wiki/Features)。

OpenGrok 提供如下特性：

1. 快速搜索代码的引擎

   * 搜索全文、定义、符号、文件路径和修改历史

   * 搜索任意指定子目录（分层搜索）

   * 增量更新索引文件

   * 支持类似 Google 的查询语法，比如 `path:Makefile defs:target`

   * 搜索日期范围内修改的文件

   * 支持使用通配符搜索，如 `*` 表示多个字符，`?` 表示单个字符

   * 在搜索结果中展示匹配行

2. 一个 Web 只读版的版本历史查看界面

   * 文件的修改日志

   * 文件在两个版本间的 diff

   * 文件夹的历史记录

3. 带语法高亮的交叉引用显示，可以使用 CSS 自定义样式

4. 可以开发插件支持新的语言和版本控制系统

    已经支持的语言： [Supported Languages and Formats](https://github.com/OpenGrok/OpenGrok/wiki/Supported-Languages-and-Formats)
    
    已经支持的版本控制系统：[Supported Revision Control Systems](https://github.com/OpenGrok/OpenGrok/wiki/Supported-Revision-Control-Systems)

## 配置 OpenGrok

### 安装

### 配置多项目

### 折腾狂魔：在 Vim 里使用

没错，还有人做了支持在 Vim 里使用 OpenGrok 的插件，如果你是 Vim 控+折腾狂魔，可以一试，这里仅给出插件地址：[asenac/vim-opengrok](https://github.com/asenac/vim-opengrok)。
