---
layout: post
title: 使用 gVim 的 Python 自动补全时遇到的问题
categories: Vim
description: 使用 gVim 的 Python 自动补全时遇到了错误提示。
keywords: gVim, Python
---

### 问题描述

环境：Win7 x64

从 gVim 7.4 的安装目录 /path/to/Vim/Vim74/autoload 下的 pythoncomplete.vim 看出，Vim 在这个版本已经默认内置了对 Python 的自动补全的支持。然而我在自己的笔记本上用得很好的配置，同样的、_vimrc 和插件平移到工作机上以后就出问题了，` <C-x><C-o> `的时候 gVim 底部提示：

```
Error: Required vim compiled with +python
E117: Unknown function: pythoncomplete#Complete
```

### 解决过程

1. 排查 Vim 版本编译时的 Python 支持

   根据上面的错误提示，首先想到的是 gVim 编译时未加入 +python 选项。

   `vim --version`

   ![Vim 的 Python 支持](/images/posts/vim/vim-without-python.png)

   `gvim --version`

   ![gVim 的 Python 支持](/images/posts/vim/gvim-with-python.png)

   由此看出，在 Vim.org 下载的 Windows 版 gVim 的 Vim 编译时倒确实未启用 Python 支持，但是 gVim 启用了。我明明使用的是 gVim，不是 Vim 呀！难道 gVim 其实只是一个调用 Vim 的壳？窃以为不太可能……上 Vim.org 找了半天，从描述上没看出来提供的几个 MS-Windows 安装包的 Python 支持的相关说明，下载了一个与之前下载的版本不同的版本安装了，结果还是与上面一样，笔记本上都可以做到，那应该不是 gVim 版本的问题。

2. 验证 gVim 的 Python 支持

   `:python print 'hello'`

   看到 gVim 下方的错误输出：

   ```
   E370: Could not load library python27.dll
   E263: Sorry, this command is disabled, the Python library could not be loaded.
   ```

   提示无法加载 python27.dll。使用 everything 小工具在磁盘里找了一下，发现能找到 C:\Windows\system32\python27.dll，这个路径应该是直接在系统环境变量里的，为何会无法加载呢？除非……gVim.exe 是 32 位程序，在任务管理器里看：

   ![gVim 是 32 位程序](/images/posts/vim/gvim-32bit.png)

   那看样子我安装的 Python 是 64 位版本的。在命令行里执行 Python.exe 看了一下果然如此：

   ```
   Python 2.7.9 (default, Dec 10 2014, 12:28:03) [MSC v.1500 64 bit (AMD64)] on win32
   Type "help", "copyright", "credits" or "license" for more information.
   >>>>>>
   ```

### 结论

Vim 官网下载的 Windows 版本 gVim 的 GUI 程序编译时启用了 Python 支持，但是由于 gVim.exe 是 32 位程序，需要加载 32 位的 python27.dll。

所以：

**如果在 Windows 下使用 gVim 写 Python 而且想要自动补全，那安装的 gVim 与 Python 的版本要对应，比如使用的官网下载的 32 位 gVim，就安装 32 位的 Python 吧！**

当然如果愿意折腾，使用 64 位 Python，然后自己编译一个 64 位的 gVim 应该也不是一个坏主意。

### 验证

卸载掉 64 位的 Python，安装 32 位的，可以看到 C:\Windows\SysWOW64 文件夹下有了之前没有的 python27.dll 文件。再执行 Python 的自动补全，已经能看到了：

![Python 自动补全](/images/posts/vim/vim-python-autocomplete.png)
