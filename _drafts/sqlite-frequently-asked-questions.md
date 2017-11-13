---
layout: post
title: SQLite 二十八问
categories: SQLite
description: SQLite 官方 FAQ 翻译
keywords: SQLite, FAQ
---

从业以来一直在做客户端开发，所以最常用到的数据库是 SQLite，但其实对它的一些概念、使用上的限制等有些模棱两可，并不明确，这天无意间翻到官方 FAQ，发现我疑惑的几个点在里面都能找到答案。网上也有这个 FAQ 的中译版，但是都相对较早，不太完整，于是决定试着将其翻译出来，一是备忘，二是分享给有相同困扰和学习需求的童鞋们。

原文链接：[SQLite Frequently Asked Questions][1]

**目录**

<!-- vim-markdown-toc GFM -->

* [如何创建自增字段](#如何创建自增字段)

<!-- vim-markdown-toc -->

## 如何创建自增字段

简而言之，被声明为 [INTEGER PRIMARY KEY][2] 的列会自增。

具体说来，就是当表的某一列被声明为 [INTEGER PRIMARY KEY][2]，那么每当你向该列插入 NULL 值时，NULL 会自动转换成比当前列最大值大 1 的值，当表为空时，则该列值为 1。

[1]: https://www.sqlite.org/faq.html
[2]: https://www.sqlite.org/lang_createtable.html#rowid
