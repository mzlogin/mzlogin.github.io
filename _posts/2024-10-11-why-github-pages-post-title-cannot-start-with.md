---
layout: post
title: 为什么 GitHub Pages 的文章标题不能以 @ 开头？
categories: [GitHub]
description: 为什么 GitHub Pages 的文章标题不能以 @ 开头？追究原因，发现是 YAML 的语法规则。
keywords: GitHub, Pages 
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

本文记录了一个 GitHub Pages 博客网页上文章标题以 `@` 开头导致的问题，并分析了原因，提供了解决方法。

*TL;NR：因为 YAML 的语法规则，GitHub Pages 的文章标题不能直接以 `` ,[]{}#&*!|>'"%@` `` 或 `-?:加空格` 开头。可以用引号将标题括起来，或者修改标题，将这些字符不放在开头。*

## 接到问题

接网友提问：

> 有一篇文章在 GitHub Pages 博客网页上不显示，初步排查可能与 title 有关——替换成其它文章的 title 可以正常显示，并附上了原始文件的头部：

```yaml
---
layout: post
title: @EnableconfigurationProperties注解使用方式与作用
categories: [Java]
```

## 复现

乍一看看不出什么问题，我在本地启动 Jekyll 预览，以本文件作为测试，也复现了该现象。

使用 title「为什么 GitHub Pages 的文章标题不能以 @ 开头？」时，**正常**：

![](/images/posts/github/2024-10-11-11-12-30.png)

使用 title「@EnableconfigurationProperties注解使用方式与作用」时，**文章标题与摘要显示空白**：

![](/images/posts/github/2024-10-11-11-09-06.png)

并可以在控制台看到如下错误：

```sh
Error: YAML Exception reading /Users/mazhuang/github/mzlogin.github.io/_posts/2024-10-11-why-github-pages-post-title-cannot-start-with.md: (<unknown>): found character that cannot start any token while scanning for the next token at line 3 column 8
```

## 分析

报错信息里提到是 YAML Exception——Jekyll 的文章头部是 YAML Front Matter，是 Jekyll 用来定义文章元数据的部分。报错提示 line 3 column 8，即 title 的第一个字符 `@`，is character that cannot start any token。

根据这个信息，其实已经可以想办法规避这个问题——将 title 里的 `@` 去掉，或者换个位置，经验证可以正常显示了。

继续深究一下，为什么 YAML 里的 title 不能以 `@` 开头呢？

然后找到了如下链接：

- <https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html>
- <https://yaml.org/spec/1.2.2/#53-indicator-characters>

提炼一下要点：

- YAML 里有一些指示字符，具有特殊语义，如 `` -?:,[]{}#&*!|>'"%@` ``；
- 这些特殊（或保留）字符不能用作不带引号的标量的第一个字符：`` ,[]{}#&*!|>'"%@` ``；
- `?:-` 后面如果跟着非空格字符，可以放在字符串的开头，但 YAML 处理器的不同实现可能带来不同行为，稳妥起见最好也用引号括起来。

## 解决方法

- 将 title 用引号括起来，如 `title: "@EnableconfigurationProperties注解使用方式与作用"`；（推荐）
- 修改 title ，将上述不能直接放在开头的字符换个位置。