---
layout: post
title: 用 Vim 编辑 Markdown 时直接粘贴图片
categories: Vim
description: 在使用 Vim 编辑 Markdown 时，粘贴图片很不方便，用插件 md-img-paste.vim 解决这个痛点。
keywords: Vim, Markdown, md-image-paste.vim
---

我习惯使用 Vim 编辑 Markdown 文件，一直存在一个痛点就是粘贴图片很不方便。

## 前后对比

我以前常用的操作流程：

1. 复制图片/截图；
2. 在保存图片对话框里一层层点选保存路径，输入文件名保存；
3. 回到 Vim 里，手动输入引用图片的表达式。

第 2 步和第 3 步是比较痛苦的，尤其是文件路径比较深的时候，可能要点选好几次。

最近偶然发现的一个外国小伙写的插件 md-img-paste.vim[^1]，能比较好地解决这个问题。现在的操作流程：

1. 复制图片/截图；
2. 在 Vim 里输入图片相对路径，自动保存图片并插入引用图片的表达式。

    *注：也可以直接回车，会按默认规则生成文件名。*

效果演示：

![](https://cdn.jsdelivr.net/gh/mzlogin/blog-assets/md-img-paste-example.gif)

## 使用方法

### 安装

这个插件没有其它依赖，使用自己习惯的插件管理方式安装就好。

比如我使用 Vundle[^2]，在 vimrc 里添加如下内容，然后 `:so $MYVIMRC` 再 `:PluginInstall` 就好了。

```viml
Plugin 'ferrine/md-img-paste.vim'
```

### 配置

插件没有给粘贴剪贴板里的图片的操作绑定默认快捷键，需要自己绑定一下，比如我是绑定到 <kbd>\<leader\>i</kbd>：

```viml
autocmd FileType markdown nmap <buffer><silent> <leader>i :call mdip#MarkdownClipboardImage()<CR>
```

另外还有两个可选配置项：

```viml
let g:mdip_imgdir = '.'
" let g:mdip_imgname = 'image'
```

1. `g:mdip_imgdir` 对应图片保存路径前缀。我设置为了 `.`，然后总是输入相对当前文件的路径；
2. `g:mdip_imgname` 对应图片保存时的缺省文件名前缀，即粘贴图片时，如果不输入文件名直接回车，将保存为 `<前缀>_日期-时间.png` 名称的文件。

我的完整 Vim 配置文件托管在 GitHub[^3]，供参考。

It's done, enjoy it.

[^1]: <https://github.com/ferrine/md-img-paste.vim>
[^2]: <https://github.com/VundleVim/Vundle.vim>
[^3]: <https://github.com/mzlogin/config-files/blob/master/_vimrc>
