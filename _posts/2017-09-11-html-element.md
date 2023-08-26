---
layout: post
title: HTML元素
categories: HTML
description: HTML元素
keywords: html，
---

# HTML元素

HTML文档由嵌套的HTML元素构成。它们用HTML标签表示，包含于尖括号中，如 `<p>`

在一般情况下，一个元素由一对标签表示：“开始标签” `<p>` 与“结束标签” `</p>` 。元素如果含有文本内容，就被放置在这些标签之间。

在开始与结束标签之间也可以封装另外的标签，包括标签与文本的混合。这些嵌套元素是父元素的子元素。

开始标签也可包含标签属性。这些属性有诸如标识文档区块、将样式信息绑定到文档演示和为一些如 `<img>` 等的标签嵌入图像、引用图像来源等作用。

一些元素如换行符 `<br>` ，不允许嵌入任何内容，无论是文字或其他标签。这些元素只需一个单一的空标签（类似于一个开始标签），无需结束标签。

许多标签是可选的，尤其是那些很常用的段落元素 `<p>` 的闭合端标签。HTML浏览器或其他介质可以从上下文识别出元素的闭合端以及由HTML标准所定义的结构规则。这些规则非常复杂，不是大多数HTML编码人员可以完全理解的。

因此，一个HTML元素的一般形式为：` <tag attribute1="value1" attribute2="value2">''content''</tag> `。一些HTML元素被定义为空元素，其形式为 `<tag attribute1="value1" attribute2="value2">` 。空元素不能封装任何内容。例如 `<br>` 标签或内联标签 `<img>` 。一个HTML元素的名称即为标签使用的名称。注意，结束标签的名称前面有一个斜杠 `“/”` ，空元素不需要也不允许结束标签。如果元素属性未标明，则使用其默认值。

例子：

HTML文档的页眉：`<head>...</head>` 。标题被包含在头部，例如：

```
`<head>
  <title>The Title</title>
</head>`
```

标题：HTML标题由<h1>到<h6>六个标签构成，字体由大到小递减：
```
`<h1>Heading level 1</h1>
<h2>Heading level 2</h2>
<h3>Heading level 3</h3>
<h4>Heading level 4</h4>
<h5>Heading level 5</h5>
<h6>Heading level 6</h6>`
```
