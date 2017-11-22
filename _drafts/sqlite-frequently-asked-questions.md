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
* [SQLite 支持哪些数据类型](#sqlite-支持哪些数据类型)

<!-- vim-markdown-toc -->

## 如何创建自增字段

简而言之，被声明为 [INTEGER PRIMARY KEY][2] 的列会自增。

具体说来，就是当表的某一列被声明为 [INTEGER PRIMARY KEY][2] 时，向该列插入的 NULL 值会自动转换成比当前列最大值大 + 1，当表中没有记录时，NULL 值会转换为 1。如果该列存在最大整型值 9223372036854775807，则会转换为一个随机挑选的未使用的值。例如，假设有这样一个表：

```sql
CREATE TABLE t1(
  a INTEGER PRIMARY KEY,
  b INTEGER
)
```

那么语句

```sql
INSERT INTO t1 VALUES(NULL, 123);
```

逻辑上等同于

```sql
INSERT INTO t1 VALUES ((SELECT max(a) FROM t1) + 1, 123);
```

有一个名为 [sqlite3_last_insert_rowid()][3] 的函数，它将返回最近一次插入操作的整型值。

需要注意的是插入的整数键为表中现存的最大键 + 1，这个新键在表里将是唯一的，但它有可能与以前删除的键重复。想要创建在表的整个生命周期中都唯一的键，需要给 [INTEGER PRIMARY KEY][2] 声明添加 [AUTOINCREMENT][4] 关键字，这样将会生成一个曾经存在过的最大键 + 1 的键。如果超出允许的取值范围，[INSERT][5] 操作将失败，返回 [SQLITE_FULL][6] 错误码。

## SQLite 支持哪些数据类型

SQLite 使用 [动态类型][7]。内容可以存储为 INTEGER，REAL，TEXT，BLOB 或 NULL。

[1]: https://www.sqlite.org/faq.html
[2]: https://www.sqlite.org/lang_createtable.html#rowid
[3]: https://www.sqlite.org/c3ref/last_insert_rowid.html
[4]: https://www.sqlite.org/autoinc.html
[5]: https://www.sqlite.org/lang_insert.html
[6]: https://www.sqlite.org/rescode.html#full
[7]: https://www.sqlite.org/datatype3.html
