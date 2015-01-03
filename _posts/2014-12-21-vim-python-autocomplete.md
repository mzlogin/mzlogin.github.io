---
layout: post
title: 使用gVim的Python自动补全时遇到的问题
categories: Vim
description: 使用gVim的Python自动补全时遇到了错误提示。
keywords: gVim, Python
---

###问题描述
环境：Win7 x64

从gVim 7.4的安装目录/path/to/Vim/Vim74/autoload下的pythoncomplete.vim看出，Vim在这个版本已经默认内置了对Python的自动补全的支持。然而我在自己的笔记本上用得很好的配置，同样的\_vimrc和插件平移到工作机上以后就出问题了，` <C-x><C-o> `的时候gVim底部提示：

```
Error: Required vim compiled with +python
E117: Unknown function: pythoncomplete#Complete
```

###解决过程

1. 排查Vim版本编译时的Python支持

    根据上面的错误提示，首先想到的是gVim编译时未加入+python选项。

    `vim --version`
    
    ![Vim的Python支持](/images/posts/vim/vim-without-python.png)

    `gvim --version`

    ![gVim的Python支持](/images/posts/vim/gvim-with-python.png)

    由此看出，在Vim.org下载的Windows版gVim的Vim编译时倒确实未启用Python支持，但是gVim启用了。我明明使用的是gVim，不是Vim呀！难道gVim其实只是一个调用Vim的壳？窃以为不太可能……上Vim.org找了半天，从描述上没看出来提供的几个MS-Windows安装包的Python支持的相关说明，下载了一个与之前下载的版本不同的版本安装了，结果还是与上面一样，笔记本上都可以做到，那应该不是gVim版本的问题。

2. 验证gVim的Python支持

    `:python print 'hello'`

    看到gVim下方的错误输出：

    ```
    E370: Could not load library python27.dll
    E263: Sorry, this command is disabled, the Python library could not be loaded.
    ```

    提示无法加载python27.dll。使用everything小工具在磁盘里找了一下，发现能找到C:\Windows\system32\python27.dll，这个路径应该是直接在系统环境变量里的，为何会无法加载呢？除非……gVim.exe是32位程序，在任务管理器里看：

    ![gVim是32位程序](/images/posts/vim/gvim-32bit.png)

    那看样子我安装的Python是64位版本的。在命令行里执行Python.exe看了一下果然如此：

    ```
    Python 2.7.9 (default, Dec 10 2014, 12:28:03) [MSC v.1500 64 bit (AMD64)] on win32
    Type "help", "copyright", "credits" or "license" for more information.
    >>>>>>
    ```

###结论
Vim官网下载的Windows版本gVim的GUI程序编译时启用了Python支持，但是由于gVim.exe是32位程序，需要加载32位的python27.dll。

所以：

**如果在Windows下使用gVim写Python而且想要自动补全，那安装的gVim与Python的版本要对应，比如使用的官网下载的32位gVim，就安装32位的Python吧！**

当然如果愿意折腾，使用64位Python，然后自己编译一个64位的gVim应该也不是一个坏主意。

###验证
卸载掉64位的Python，安装32位的，可以看到C:\Windows\SysWOW64文件夹下有了之前没有的python27.dll文件。再执行Python的自动补全，已经能看到了：

![Python自动补全](/images/posts/vim/vim-python-autocomplete.png)
