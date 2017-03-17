---
layout: post
title: GFM 与 Redcarpet 的不同点
categories: Markdown
description: GFM 与 Redcarpet 有些许不同，在 GitHub Repository 与 GitHub Pages 里写作时应该注意这些区别，避免解析出来不是自己想要的效果。
keywords: markdown, GFM, Redcarpet
---

GFM 即 [GitHub Flavored Markdown][1]，是 GitHub 用在 Respository、Issues、Comments 和 Pull requests 里的一种 Markdown 引擎，它与标准 Markdown 有所区别，增加了一些 GitHub 自己扩展的功能。

[Redcarpet][2] 是另一种 Markdown 引擎，我的基于 GitHub Pages 的[博客][3]采用它来解析 md 文件，\_config.yml 文件里的配置如下：

```
markdown: redcarpet
redcarpet:
    extensions: 
        - no_intra_emphasis
        - fenced_code_blocks
        - autolink
        - tables
        - with_toc_data
        - strikethrough
```

在 [vmg/redcarpet#379][4] 的讨论中可以得知 GFM 其实是基于 Redcarpet 的一个非开源子集开发的，Redcarpet 也支持众多自定义的扩展，本文记录的是当前 GFM 与使用如上配置的 Redcarpet 的一些差异，以备在 GitHub 不同的地方写作时参考。

**目录**

* TOC
{:toc}

### 换行

```
第一行（后面没有空格）
第二行
```

在 GFM 里会显示成跟上面一样。

而在 Redcarpet 里会显示成

```
第一行（后面没有空格）第二行
```

在 Redcarpet 里如果需要换行，要么在行尾加两个空格，要么在下面空一行新开一个段落。

### 锚点链接

GFM 与 Redcarpet 支持对 `#`、`##` 和 `###` 这样的标题自动生成锚点链接，只不过在生成的链接 url 上会有少许差异。

**当然，强烈建议在标题中不要使用奇怪的符号。**

> 在这里做个小广告：如果你使用 Vim 编辑 Markdown，那可以试试我写的能自动生成 GFM 和 Redcarpet 这两种风格 TOC 的 Vim 插件 [vim-markdown-toc](https://github.com/mzlogin/vim-markdown-toc)。

*共同点：*

1. 反引号（即 1 左边那个符号）会直接忽略掉。

2. 字母要全小写。

3. 空格会转换成 `-`。

*不同点：*

下面的表格列举了一些我曾经遇到过的案例，并不全，完整的实现逻辑在表格下方有说明。

| 字符 | GFM  | Redcarpet                                  |
|------|------|--------------------------------------------|
| `"`  | 忽略 | 替换成 `quot`，如果前后有字符，用 `-` 连接 |
| `'`  | 忽略 | 替换成 `39`，如果前后有字符，用 `-` 连接   |
| `&`  | 忽略 | 替换成 `amp`，如果前后有字符，用 `-` 连接  |
| `/`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `@`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `#`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `$`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `%`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `^`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `+`  | 忽略 |                                            |
| `\*` | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `~`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `;`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `.`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `,`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `?`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `:`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| 竖线 | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `!`  | 忽略 | 首尾的忽略，中间的替换成 `-`               |
| `()` | 忽略 | 替换成 `-`                                 |
| `(`  | 忽略 | 忽略                                       |
| `)`  | 忽略 | 忽略                                       |
| `？` | 忽略 | 保留                                       |
| `，` | 忽略 | 保留                                       |
| `。` | 忽略 | 保留                                       |
| `、` | 忽略 | 保留                                       |
| `！` | 忽略 | 保留                                       |
| `：` | 忽略 | 保留                                       |
| `；` | 忽略 | 保留                                       |
| `“`  | 忽略 | 保留                                       |
| `”`  | 忽略 | 保留                                       |
| `《` | 忽略 | 保留                                       |
| `》` | 忽略 | 保留                                       |
| `「` | 忽略 | 保留                                       |
| `」` | 忽略 | 保留                                       |
| `『` | 忽略 | 保留                                       |
| `』` | 忽略 | 保留                                       |
| `——` | 忽略 | 保留                                       |

总的来说就是 GFM 遇到奇怪的字符就忽略，而 Redcarpet 应用了几种不同的规则来处理。

当然这只是表面上看起来的现象，这里简单说一下它们的实现逻辑：

**GFM 的 TOC 链接处理实现**

[参考链接（by Ruby）][9]

1. 使用 Ruby 的正则表达式 `/[^\p{Word}\- ]/u` 过滤掉所有中英文标点符号、特殊符号等。
2. 将空格替换为 `-`。
3. 如果相同的链接 id 已经存在了，那在链接 id 后面添加 `-{num}`，比如标题 `hello,world` 生成链接 `#helloworld`，而标题 `hello!world` 生成链接 `#helloworld-1`。

**Redcarpet 的 TOC 链接处理实现**

[参考链接（by C）][10]

1. 将 HTML 标签，即成对的 `<` 与 `>` 及它们之间的内容删除。
2. 进行 HTML Encode，即将 `&`、`"` 和 `'` 等转换为相应 HTML 实体。
3. 将字符 `` -&+$,/:;=?@"#{}|^~[]`\*()%.!`` 和空格替换为 `-`，有两个及以上 `-` 的地方修复成一个，将链接串首尾的 `-_` 删除。

### 列表下嵌套内容

在 Redcarpet 中有如下规则：

* 如果嵌套非列表，需要缩进并且空行。
* 如果嵌套列表，需要缩进，但不空行。

而 GFM 则没有。

### YML 解析

在 Redcarpet 中，解析头部 YML 里的内容有些需要转义：

```
---
keywords: C\+\+
---
```

而 GFM 则不需要。

### GFM 独有特性

GFM 自己添加的一些特性我甚是喜欢，可惜在 GitHub Pages 里使用 Redcarpet 享受不到了。

#### Task Lists

这货真是个好东西，用 `- [  ]` 和 `- [ x ]` 就能做出清单列表项的显示效果来，而且如果你有编辑权限的话点选后文本能自动更新。

![](https://camo.githubusercontent.com/09cbc14d7458e0e2c52f1a66fb8890152da978c9/68747470733a2f2f662e636c6f75642e6769746875622e636f6d2f6173736574732f3138322f35343631302f66326530656131382d356139612d313165322d383236642d6635663562663033663032652e676966)

用法参见 [Task Lists in GFM: Issues/Pulls, Comments][5]

#### 自动生成引用链接

*Update 2015-12-06 参见 [@Mentions on GitHub Pages][7]，GitHub Pages 现在也支持使用 `@username` 来 at 一个 GitHub 用户了，只是用户不会收到通知。我对此功能并无需求，而且貌似会对其它使用 `@` 号的地方产生非预期的解析，所以本博客当前并未启用。*

对于如下格式的文本，GFM 会自动创建到对应用户对应仓库的对应链接。

```
* SHA: a5c3785ed8d6a35868bc169f07e40e889087fd2e
* User@SHA: jlord@a5c3785ed8d6a35868bc169f07e40e889087fd2e
* User/Repository@SHA: jlord/sheetsee.js@a5c3785ed8d6a35868bc169f07e40e889087fd2e
* #Num: #26
* GH-Num: GH-26
* User#Num: jlord#26
* User/Repository#Num: jlord/sheetsee.js#26
```

#### Emoji

*Update 2015-12-06 参见 [Emoji on GitHub Pages][8], GitHub Pages 现在也支持使用 Emoji 表情啦！:+1::+1::+1:*

GitHub Pages 如果能使用这个，文章一定生动不少。

### 参考链接

* [GitHub Flavored Markdown][1]
* [Writing on GitHub][6]

[1]: https://help.github.com/articles/github-flavored-markdown/
[2]: https://github.com/vmg/redcarpet
[3]: http://mzlog.com
[4]: https://github.com/vmg/redcarpet/issues/379
[5]: https://github.com/blog/1375%0A-task-lists-in-gfm-issues-pulls-comments
[6]: https://help.github.com/articles/writing-on-github/
[7]: https://help.github.com/articles/mentions-on-github-pages
[8]: https://help.github.com/articles/emoji-on-github-pages
[9]: https://github.com/jch/html-pipeline/blob/master/lib/html/pipeline/toc_filter.rb
[10]: https://github.com/vmg/redcarpet/blob/master/ext/redcarpet/html.c#L274
