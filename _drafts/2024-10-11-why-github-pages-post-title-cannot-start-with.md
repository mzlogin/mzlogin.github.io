---
layout: post
title: ,为什么 GitHub Pages 的文章标题不能以 @ 开头？
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

根据这个信息，其实已经可以想办法规避这个问题——将 title 里的 `@` 去掉，或者换个位置，经验证确实也可以正常显示。

继续深究一下，为什么 YAML 里的 title 不能以 `@` 开头呢？

然后我找到了如下链接和内容：

- <https://docs.ansible.com/ansible/latest/reference_appendices/YAMLSyntax.html>
- <https://yaml.org/spec/1.2.2/#53-indicator-characters>