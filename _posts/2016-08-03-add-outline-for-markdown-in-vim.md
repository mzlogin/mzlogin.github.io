---
layout: post
title: 在 Vim 里为 Markdown 文档展示导航窗格
categories: Vim
description: 在一个很长的 Markdown 文档里要准确跳转到某标题并不容易，如果像 Word 那样有个导航窗格就好了。
keywords: Vim, Markdown, Outline
---

假设我们正在 Vim 里编辑一个很长的 Markdown 文档，这时想跳转到另一个章节去查看或编辑内容，可以怎么做？

1. 查找章节标题。
2. 上下翻页。
3. 记得行号，精确跳转（请收下我的膝盖）。
4. ...

不知你此时感受如何，反正我是无比想念 Word 的导航窗格，各种编程 IDE 的 Outline。

但等等，我们正在用编辑器之神 Vim 诶！无论想弄啥折腾折腾就有了。

## 最终效果

我的完整 Vim 配置托管在 GitHub，可供参考：[config-files](https://github.com/mzlogin/config-files)

![](/images/posts/vim/vim-markdown-outline.png)

## 实现步骤

### 安装 tagbar

这里我们借助于 tagbar 插件实现导航窗格。当然 tagbar 的功能远不限于此，可以为 C、C++、Python 和 Java 等很多语言提供类和方法列表视图等等，详见 [tagbar](https://github.com/majutsushi/tagbar)。

推荐使用 [Vundle](https://github.com/VundleVim/Vundle.vim) 管理 Vim 插件，这样就可以简单几步安装插件了。

1. 在 vimrc 文件里添加如下内容：

   ```viml
   Plugin 'majutsushi/tagbar'
   ```

2. 执行 `:so $MYVIMRC`

3. 执行 `:PluginInstall`

### 安装 Exuberant ctags

tagbar 正常工作依赖于 Vim 7.0+ 和 Exuberant ctags。

下载地址：<http://ctags.sourceforge.net/>。

下载后将 ctags 可执行文件放置到一个在 PATH 环境变量的文件夹里，或者 Vim 安装目录的 Vim74 文件夹下，比如我是将 ctags.exe 放在 `D:\Program Files (x86)\Vim\vim74` 文件夹下。

### 配置 tagbar 显示 Markdown 导航窗格

tagbar 默认并不支持 Markdown 文件，但配置一下就好了。

1. 创建 ~/.ctags.d/markdown.ctags 文件（Windows 下是 `C:\Users\<username>\.ctags.d\markdown.ctags`），将如下内容贴到文件里：

   ```viml
   --langdef=markdown
   --langmap=markdown:.md
   --regex-markdown=/^#{1}[ \t]*([^#]+.*)/. \1/h,headings/
   --regex-markdown=/^#{2}[ \t]*([^#]+.*)/.   \1/h,headings/
   --regex-markdown=/^#{3}[ \t]*([^#]+.*)/.     \1/h,headings/
   --regex-markdown=/^#{4}[ \t]*([^#]+.*)/.       \1/h,headings/
   --regex-markdown=/^#{5}[ \t]*([^#]+.*)/.         \1/h,headings/
   --regex-markdown=/^#{6}[ \t]*([^#]+.*)/.           \1/h,headings/
   ```

   这表示提取 Markdown 文件里的一到六级标题，并使用空格缩进表示层次。

2. 给你的 vimrc 文件里增加如下内容：

   ```viml
   let g:tagbar_type_markdown = {
           \ 'ctagstype' : 'markdown',
           \ 'kinds' : [
                   \ 'h:headings',
           \ ],
       \ 'sort' : 0
   \ }
   ```

   配置 tagbar 支持 Markdown。

### 更多自定义配置

1. 现在你可以使用 `:TagbarToggle<CR>` 来打开导航窗格了，但每次开关导航窗格都要敲这么长一串命令毕竟不够方便，配置快捷键来操作更顺手，在你的 vimrc 文件里增加一个映射：

   ```viml
   nnoremap <leader>tb :TagbarToggle<CR>
   ```

   现在你可以使用 `<leader>tb` 来随时开/关导航窗格了。

2. 导航窗格默认是在右边，如果你也像我一样喜欢它在左边，也想指定它的宽度，可以在你的 vimrc 文件里配置：

   ```viml
   let g:tagbar_width = 30
   let g:tagbar_left = 1
   ```

至此，大功告成了！

根据我的这个文章没有配置成功的同学，可以参考下我的配置 <https://github.com/mzlogin/config-files> 。

## 参考链接

* [majutsushi/tagbar#70](https://github.com/majutsushi/tagbar/issues/70)
* [Support for additional filetypes](https://github.com/majutsushi/tagbar/wiki)
* [Extending ctags with Regex parser (optlib) - Option files](http://docs.ctags.io/en/latest/optlib.html#option-files)
