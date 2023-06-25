---
layout: fragment
title: VSCode 自定义 Markdown 预览样式
tags: [vscode, markdown]
description: VSCode 自定义 Markdown 预览样式
keywords: VSCode, Markdown
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

VSCode 里默认的 Markdown 预览样式不太好看，可以自定义样式。

方法是在 VSCode 的配置里，找到 Extensions > Markdown > Markdown: Styles，然后 Add Item，可以添加当前工作目录下的本地 css 文件，也可以添加 url 地址。

遇到过的问题：

1. 本地 css 文件不能是当前工作目录外的绝对路径，否则会报错；
2. url 地址对应的媒体类型不能是 text/plain 的，否则会报错 `Could not load 'markdown.styles'`，参考：<https://github.com/microsoft/vscode/issues/148677>。
