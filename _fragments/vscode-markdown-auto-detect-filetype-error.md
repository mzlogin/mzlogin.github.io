---
layout: fragment
title: VSCode 自动识别 Markdown 文件类型错误
tags: [vscode, markdown]
description: VSCode 自动识别 Markdown 文件类型错误
keywords: VSCode, Markdown, File Type
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

最近遇到一个奇怪的问题：我的文档项目里，所有文件都是 Markdown 格式，后缀名统一为 `.md`。但有一个文件在 VSCode 中打开后，右下角显示的文件类型是 Plain Text，完全没有 Markdown 的高亮效果。其它文件都能正常识别，唯独它“特立独行”。

尝试了 Auto Detect 和手动将文件类型改为 Markdown，依然无效。

后来在 Finder 里发现，这个文件的预览小图和其它文件不一样。点开文件属性一看，发现其它文件的类型是 Markdown，而这个文件没有识别出格式。难道是后缀名的问题？

果然，最终发现这个文件的后缀是 `.md `，最后多了一个空格！是的，一个空格让我折腾了半天。

## 小结

如果你也遇到类似问题，记得检查文件后缀有没有“隐形字符”。