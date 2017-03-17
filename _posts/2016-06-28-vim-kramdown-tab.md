---
layout: post
title: 简化 kramdown 列表嵌套内容缩进的 Vim 插件
categories: Vim
description: kramdown 的列表嵌套内容缩进不是使用 Tab，而是有更「严格」更「奇葩」的规定，这个插件就是来拯救为此苦恼的 Vimer。
keywords: kramdown, Vim, indent
---

kramdown 的列表嵌套内容的缩进规则很「奇葩」，不是使用自然的 Tab 缩进。

## 问题

kramdown 的作者对列表嵌套内容的缩进规则的 [描述][0] 是：

> kramdown does not allow 4 space indent, ......
>
> Indentation for list items is **always** calculated based on the first non-space character after the list item marker.

在年初 GitHub 宣布 GitHub Pages 服务将只支持 kramdown 这个 Markdown 解析引擎时，我曾经总结过从 Redcarpet 迁移到 kramdown 需要做的一些更改，[将 GitHub Pages 从 Redcarpet 切换到 kramdown][1] 里有说到，嵌套在列表项里的代码块，如果不按如上规则做缩进的话，将会解析不正常。

比如：

```markdown
1. list item one

    ```python
    print 'hello, world'
    ```

2. list item two
```

解析后的结果是：

1. list item one

    ```python
    print 'hello, world'
    ```

2. list item two

这当然不是我们想要的，我们应该如何写呢？

```markdown
1. list item one

   ```python
   print 'hello, world'
   ```

2. list item two
```

解析后的结果是：

1. list item one

   ```python
   print 'hello, world'
   ```

2. list item two

看出来区别了吗？没错，这种情况下代码块必须缩进三个空格，因为除开列表记号后的第一个非空字符的缩进是三。

那么问题来了，有时候是有序列表，序号是个位数时需要缩进三个空格，序号是两位数时需要缩进四个空格，序号是三位数时（弄这么大的列表是闹哪样？）需要缩进五个空格……有时候是无序列表，只需要缩进两个空格。

当然这是最简单的一级嵌套的情况，如果是多级列表嵌套，那情况就更复杂了，每一次都去手打空格缩进吗？作为一名 Vimer，当然 say no！

所以为此我做了一个简单的小 Vim 插件专门用于解决此问题。

## 下载地址

* [vim-kramdown-tab][2]

## 使用方法

安装完此插件后，在你需要对列表嵌套内容进行缩进时，不用掰着手指头去数要打多少个空格了，只用按 <kbd>Leader</kbd><kbd>Tab</kbd> 就好了。

## 安装方法

推荐使用 [Vundle][3] 来管理你的 Vim 插件，这样你就可以简单三步完成安装：

1. 在你的 vimrc 文件中添加如下内容：

   ```markdown
   Plugin 'mzlogin/vim-kramdown-tab'
   ```

2. `:so $MYVIMRC`

3. `:PluginInstall`

## 屏幕截图

![vim-kramdown-tab screenshot][4]

[0]: https://github.com/gettalong/kramdown/issues/311#issuecomment-185040348
[1]: https://mazhuang.org/2016/02/04/switch-to-kramdown-from-redcarpet/
[2]: https://github.com/mzlogin/vim-kramdown-tab
[3]: http://github.com/VundleVim/Vundle.Vim
[4]: https://raw.githubusercontent.com/mzlogin/vim-kramdown-tab/master/screenshots/test.gif
