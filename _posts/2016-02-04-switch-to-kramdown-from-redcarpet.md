---
layout: post
title: 将 GitHub Pages 从 Redcarpet 切换到 kramdown
categories: Markdown
description: 从 Redcarpet 切换到 kramdown 会遇到一些问题，这里记录了它们的解决办法。
keywords: GitHub Pages, markdown, Redcarpet, kramdown
---

GitHub 前不久发布了 New Features 公告，[GitHub Pages now faster and simpler with Jekyll 3.0][1]，宣布从 2016 年 5 月 1 日起，GitHub Pages 将只支持 kramdown 作为唯一的 Markdown 引擎。

这其实也算得一件好事，之前支持 Rediscount、Redcarpet 和 kramdown 等多种引擎，而它们相互之间和与标准 Markdown 之间又有一些细微却也无法忽视的差异，这让需要在多个平台使用 Markdown 的我头疼不已，早就希望 GitHub Pages 能与 GitHub 的 Issues 和 comments 等地方统一语法，本次更新虽然做不到这一点，但也算是迈出了不小的一步。

我在此前是使用 Redcarpet，配置如下：

```yaml
markdown: redcarpet
redcarpet: 
    extensions: 
        - no_intra_emphasis
        - fenced_code_blocks
        - autolink
        - tables
        - with_toc_data
        - strikethrough

pygments: true
```

切换到 kramdown 之后的配置如下：

```yaml
markdown: kramdown
kramdown:
    input: GFM
highlighter: rouge
```

切换过程中有若干需要处理的差异问题，现将它们及解决方法记录如下。

## 列表项里嵌套的代码块

嵌套在列表项中的代码块在 Redcarpet 中使用 Tab 进行缩进即可，而在 kramdown 中需要根据列表项的内容开始位置决定缩进的字符数。

关于此问题的讨论见 [Embedding codeblocks in lists][2]。

in Redcarpet:

```markdown
1. list item one

    ```python
    print 'hello, world'
    ```

2. list item two


* unordered list item one

    ```python
    print 'hello, world'
    ```

* unordered list item two
```

in kramdown:

```markdown
1. list item one

   ```python
   print 'hello, world'
   ```

2. list item two


* unordered list item one

  ```python
  print 'hello, world'
  ```

* unordered list item two
```

## 遍历 Collections

我在本博客做了一个 wiki collection，在 Redcarpet 中用 `for doc in site.documents` 可遍历所有 wiki。

而切换到 kramdown 后这样的写法将遍历所有的 wiki 和 posts，需要使用 `for wiki in site.wiki` 来遍历 wiki。

不过这点其实严格说起来应该是我在使用 Redcarpet 时的写法没有遵循 Jekyll 的文档，参考 [Collections][3]。

## TOC 链接

在我之前的一篇文章 [GFM 与 Redcarpet 的不同点][4] 中，描述了 Redcarpet 与 GFM 自动生成的 TOC 链接的区别，而 kramdown 即使启用了 `input: GFM` 生成的链接与 GFM 也还是不同，处理 GFM 与 Redcarpet 生成的 TOC 链接的区别已经让我心累了，不想再多记一种。

不过谢天谢地，kramdown 支持自动生成 TOC，只需在想放置 TOC 的地方放置如下内容即可，非常方便。

```markdown
* TOC
{:toc}
```

## 删除线

在 Redcarpet 中使用如下语法能自动为文字加上删除线：

```markdown
~~hello world~~
```

但切换到 kramdown 后这种写法失效了，浏览了一下文档之后并没有找到 kramdown 对应的语法，这个用得也少，遂直接用 HTML 元素解决问题：

```markdown
<del>hello world</del>
```

<del>hello world</del>

**update 2016/03/02:** kramdown 主分支已经解决了这个问题，见 [gettalong/kramdown#304][7]，坐等 Release 后 GitHub Pages 更新就能用了。

**update 2016/03/29:** [pages-gem][8] 当前使用的 1.10.0 版本的 kramdown 已经包含了主分支对此的修复，已经可以愉快地使用 ``~~hello world~~`` 来表示 ~~hello world~~ 了。

## 表格

在 Redcarpet 中如下写法能直接显示你写的内容：

```markdown
READ|WRITE|SHARE
```

但在 kramdown 中会解析成表格：

READ|WRITE|SHARE

所以需要将 `|` 转义。

```markdown
READ\|WRITE\|SHARE
```

相关讨论见：[gettalong/kramdown#151][5]

## 高亮的语言名称

使用 Redcarpet + pygments 的组合时，`cpp`、`C++` 和 `c++` 都能对 C++ 代码片断进行语法高亮。

而改为 kramdown + rouge 的组合后，只能使用 `cpp`。

rouge 支持的语言列表可以参考如下链接：

* [List of supported languages and lexers][6]

## 图片上面空行

在 Redcarpet 中，如下写法的图片和文字之间会换行：

```markdown
Hello, world!
![](/img.png)
```

而 kramdown 中这种写法图片会直接接在文字后面显示，不换行。如果需要换行则应在图片上面空一行：

```markdown
Hello, world!

![](/img.png)
```

[1]: https://github.com/blog/2100-github-pages-now-faster-and-simpler-with-jekyll-3-0
[2]: https://github.com/gettalong/kramdown/issues/209
[3]: http://jekyllrb.com/docs/collections/
[4]: http://mazhuang.org/2015/12/05/diff-between-gfm-and-redcarpet/#section-1
[5]: https://github.com/gettalong/kramdown/issues/151
[6]: https://github.com/jneen/rouge/wiki/List-of-supported-languages-and-lexers
[7]: https://github.com/gettalong/kramdown/issues/304
[8]: https://github.com/github/pages-gem
