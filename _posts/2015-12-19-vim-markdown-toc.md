---
layout: post
title: 为 Markdown 生成 TOC 的 Vim 插件
categories: Vim
description: 为 Markdown 自动生成 Table of Contents 的 Vim 插件
keywords: vim, markdown, toc
---

因为饱受 GFM 和 Redcarpet 两种 Markdown 引擎生成 TOC 链接的差异的折磨，而我又不得不同时使用它们——博客基于 Jekyll 使用 Redcarpet（*Update 2016/09/16: GitHub Pages 现在已经改为只支持 kramdown*），而其它放在 GitHub 仓库里的文档使用 GFM，我决定为我常用的 Markdown 编辑器 Vim 做一款同时支持 GFM 和 Redcarpet 两种 TOC 链接风格的 Table of Contents 自动生成插件。

这算是我真正意义上完全独立开发的第一款实用 Vim 插件，当然开发过程中也参考了别人的做法。

**目录**

* TOC
{:toc}

### 下载地址

* [vim-markdown-toc](https://github.com/mzlogin/vim-markdown-toc)

### 使用方法

1. `:GenTocGFM`

   生成 GFM 链接风格的 Table of Contents.

   适用于 GitHub 仓库里的 Markdown 文件。

2. `:GenTocRedcarpet`

   生成 Redcarpet 链接风格的 Table of Contents.

   适用于使用 Redcarpet 作为 Markdown 引擎的 Jekyll 项目或其它地方。

### 安装方法

推荐使用 [Vundle](http://github.com/VundleVim/Vundle.Vim) 来管理你的 Vim 插件，这样你就可以简单三步完成安装：

1. 在你的 vimrc 文件中添加如下内容：

   ```
   Plugin 'mzlogin/vim-markdown-toc'
   ```

2. `:so $MYVIMRC`

3. `:PluginInstall`

### 屏幕截图

[使用本插件生成 TOC 的英文文档在线示例](https://github.com/mzlogin/chinese-copywriting-guidelines/blob/Simplified/README.en.md)

![](https://github.com/mzlogin/vim-markdown-toc/raw/master/screenshots/english.gif)

[使用本插件生成 TOC 的中文文档在线示例](http://mazhuang.org/wiki/chinese-copywriting-guidelines/)

![](https://github.com/mzlogin/vim-markdown-toc/raw/master/screenshots/chinese.gif)

### 参考链接

* [GFM 与 Redcarpet 的不同点](http://mazhuang.org/2015/12/05/diff-between-gfm-and-redcarpet/)
* [ajorgensen/vim-markdown-toc](https://github.com/ajorgensen/vim-markdown-toc)
