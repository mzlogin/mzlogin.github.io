---
layout: post
title: Java｜FreeMarker 复用 layout
categories: [Java]
description: FreeMarker 复用 layout
keywords: FreeMarker, layout, reuse
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

项目里的页面一多，重复的页面布局就不可避免地冒了出来，作为程序员，消除重复，义不容辞。那么，今天就来聊聊如何在 FreeMarker 中复用页面 layout，让代码更优雅、更易维护。

## 常规做法：include

FreeMarker 提供了 include 指令，可以把一些公共页面元素单独提取出来，然后在需要的地方通过 include 引入，例如：


```ftl
<#-- includes/header.ftl -->
<p>我来组成头部</p>
```

```ftl
<#-- includes/footer.ftl -->
<p>我来组成底部</p>
```

```ftl
<#-- somepage.ftl -->
<#include "./includes/header.ftl">

<p>我是页面内容</p>

<#include "./includes/footer.ftl">

<script>
// 这里是一些 JavaScript 代码
</script>
```

## 去除重复：抽象 layout

但是所有类似的页面都要手写这个结构也挺麻烦的，更糟糕的是，一旦这些页面的结构发生变化，得在 N 个页面里反复修改，想想都头大。

很多博客引擎（比如 Jekyll）都支持 layout 功能，允许我们定义统一的页面布局，具体页面只需专注于内容。

FreeMarker 虽然没有内置 layout，但我们可以用 macro 来实现类似的效果。

比如，抽象出一个 layout/page.ftl 文件，作为布局模板：

```ftl
<#-- layout/page.ftl -->
<#macro layout body js="">

<#include "../includes/header.ftl" />

${body}

<#include "../includes/footer.ftl" />

${js}

</#macro>
```

然后在需要的页面这样用：

```ftl
<#import "./layout/page.ftl" as base>

<#assign body>

<p>我是页面内容</p>
<p>当前时间：<span id="current-time">${.now?string("yyyy-MM-dd HH:mm:ss")}</span></p>

</#assign>

<#assign js>

<script>
// 每隔一秒刷新当前时间
setInterval(function() {
    document.getElementById("current-time").innerHTML = new Date().toLocaleString();
}, 1000);
</script>

</#assign>

<@base.layout body=body js=js />
```

页面效果如下：

![](/images/posts/java/freemarker-layout-page.png)

## 减少手工输入：code snippets

虽然布局复用问题解决了，但每次新建页面还得手写一遍结构，还是不够优雅。程序员的信条是：能自动化的绝不手动！

这时就轮到编辑器/IDE 的 code snippets 功能登场了。把上面的结构定义成代码片段，新建页面时只需输入一个触发词，基本结构就自动生成。

以 VSCode 为例，可以在项目的 `.vscode` 目录下新建 `layout.code-snippets` 文件，内容如下：

```json
{
    "page_layout": {
        "scope": "ftl",
        "prefix": "layout:page",
        "body": [
            "<#import \"./layout/page.ftl\" as base>",
            "",
            "<#assign body>",
            "",
            "",
            "",
            "</#assign>",
            "",
            "<#assign js>",
            "",
            "<script>",
            "",
            "</script>",
            "",
            "</#assign>",
            "",
            "<@base.layout body=body js=js />"
        ],
        "description": "Page layout template for FTL files"
    }
}
```

这样新建 .ftl 文件后，输入 `layout:page`，页面布局结构就自动生成了。

如图所示：

![](/images/posts/java/freemarker-layout-snippets.gif)

IntelliJ IDEA 也可以用 Live Templates 实现同样的效果。

本文相关代码和示例已上传至 GitHub，见 <https://github.com/mzlogin/learn-spring> 的 freemarker-test 目录。