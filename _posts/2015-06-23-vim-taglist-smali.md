---
layout: post
title: 为 Vim 添加 Smali 语法高亮和 Taglist 支持
categories: Vim
description: 想使用 Vim 更加舒服地阅读 Smali 源码，那就为它添加上语法高亮，定义跳转和 Taglist 或 Tagbar 支持。
keywords: Vim, Smali, Taglist, Ctags, Tagbar
---

Smali 相当于 Dalvik 虚拟机的汇编语言，语法可以参考 [Dalvik opcodes](http://pallergabor.uw.hu/androidblog/dalvik_opcodes.html)。

本文介绍的是如何使用 Vim + Ctags + Taglist（或 Tagbar） 来实现如下需求：

**目录**

* TOC
{:toc}

最终效果图：

![](/images/posts/vim/smali-vim.png)

当然因为现在 Android 应用打包时都会做不同程度的混淆，最后配置完后在 Taglist 下看到的可能是一堆 a，b，c 之类的名字。:-P

我的最终配置托管在 GitHub 上可供参考：<https://github.com/mzlogin/config-files>。

*以下内容假设读者已经配置好 Vim + Ctags + Taglist（或 Tagbar） 环境，掌握了安装 Vim 插件的方法。*

### Smali 语法高亮

**方法：** 安装 Vim 插件 <https://github.com/mzlogin/vim-smali>。

如果你也跟我一样使用方便的 Vundle 管理插件，那你只需要在你的 \_vimrc 文件里添加 `Plugin 'mzlogin/vim-smali'`，然后 `so %` 重新加载配置文件，再 `:PluginInstall` 即安装完成。

如果是手动安装插件，那么可以点击插件链接页面右下角的「Download ZIP」按钮下载插件文件然后安装。

### 跳转到定义

**方法：** 为 Ctags 添加 Smali 语言支持。

新建文件 ~/.ctags 并将如下内容复制进去：

```
--langdef=smali
--langmap=smali:.smali
--regex-smali=/^\.field (public |private |protected )?(static )?(final )?(synthetic )?([^:]*):.*/\5/f,field/
--regex-smali=/^\.method (public |private |protected )?(static )?(final )?(varargs )?(bridge )?(synthetic )?(declared-synchronized )?(.*)\(.*/\8/m,method/
```

打开 Smali 文件后使用 `:!ctags -R .` 生成 tags 文件，对解析到的变量和方法等就可以 `Ctrl-]` 跳转到定义了。

注：~ 是指用户目录，Linux 和 Mac OS X 用户应该都明白，Windows 用户可以在 Vim 下 `:ec $HOME` 查看该目录所在，比如 Win7 下是 `C:\Users\用户名`。

Windows 下无法直接新建以 「.」 开头的文件名，可以先新建一个 txt 文件，然后在命令行下 `rename file.txt .ctags`。

### Taglist/Tagbar 支持

Taglist 和 Tagbar 是两个同类插件，任选其一即可，我以前使用 Taglist，最近切换到 Tagbar。

#### 使用 Taglist

**方法：** 为 Taglist 添加 Smali 语言支持。

在 \_vimrc 文件里添加一行即可：

```vim
let g:tlist_smali_settings = "smali;f:field;m:method" 
```

#### 使用 Tagbar

**方法：** 为 Tagbar 添加 Smali 语言支持。

在 \_vimrc 文件里添加如下内容即可：

```vim
let g:tagbar_type_smali = {
        \ 'ctagstype' : 'smali',
        \ 'kinds' : [
                \ 'f:field',
                \ 'm:method',
        \ ]
\ }
```

到此，我们要实现的三个目标就已经完成了。

### 后话

对于实现 Taglist 支持这一步，我在网上搜索良久未找到有效解决方案，最后是打开 taglist.vim 文件，看到有如下代码段后才知道能这么做的，所以以后遇到问题找不到方法而有源码的时候，读它吧！

切换到 Tagbar 之后的解决方案与此类似。

```vim
" ...

" php language
let s:tlist_def_php_settings = 'php;c:class;d:constant;v:variable;f:function'

" python language
let s:tlist_def_python_settings = 'python;c:class;m:member;f:function'

" ...

    " Skip files which are not supported by exuberant ctags
    " First check whether default settings for this filetype are available.
    " If it is not available, then check whether user specified settings are
    " available. If both are not available, then don't list the tags for this
    " filetype
    let var = 's:tlist_def_' . a:ftype . '_settings'
    if !exists(var)
        let var = 'g:tlist_' . a:ftype . '_settings'
        if !exists(var)
            return 1
        endif
    endif

" ...
```

当前解决方案 Ctags 只解析、Taglist/Tagbar 只显示了 field 和 method 两类 tag，我对此的原理不是很懂，但是猜想应该是上面 .ctags 文件里的 `--regex-smali` 里我们只告诉了 Ctags 如何解析这两种 tag，本来考虑后续有时间把 class 等更多内容做进来，但转念一想，一个 smali 文件里也就一个类，这种需求似乎不那么强烈，遂作罢。

### 参考链接

* [让Vim和Ctags支持smali语法](http://www.claudxiao.net/2012/07/adding-smali-syntax-for-vim-and-ctags/)
* [让tagbar支持markdown](http://howiefh.github.io/2013/05/17/make-tagbar-support-markdown/)
