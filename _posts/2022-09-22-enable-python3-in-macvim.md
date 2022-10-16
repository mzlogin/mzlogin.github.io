---
layout: post
title: 修复 MacVim 9.0 的 Python3 支持
categories: Vim
description: 修复 MacVim 9.0 的 Python3 支持
keywords: MacVim, Python3
---

前两天刚刚升级到了 MacVim 9.0 的最新版本，日常编辑编辑文字没遇到过什么问题，直到今天动了一下插件。

## 发现问题

今早看到一个有意思的 Vim 插件，安装上试用了下，感觉对我来说不太实用，就删掉配置，打算运行 `:PlugClean` 清理掉它，结果 MacVim 提示我即将删掉的插件有两个——除了试用的这个以外，还有 LeaderF。

LeaderF 是我用得比较多的插件之一了，我并没有表明意图我要删掉它，是发生了什么让 vim-plug 这样以为呢？肯定是有什么误会。

我的 _vimrc 文件里，添加 LeaderF 插件是这样写的：

```vim
if has('python') || has('python3')
    Plug 'Yggdroot/LeaderF', { 'do': ':LeaderfInstallCExtension' }
endif
```

于是打开一个 MacVim 窗口，试了下 `:echo has('python')` 和 `:echo has('python3')`，输出竟然都是 0，那就难怪了……

## 分析问题

一开始主要想弄清楚两点：

1. 我使用的 MacVim 版本编译时究竟有没有启用 Python 支持？

    在 MacVim 窗口里运行 `:version`，可以看到 `+python/dyn` 和 `+python3/dyn`，那说明同时启用了 Python 和 Python3 支持。

2. 我本地有没有安装 Python？

    ```sh
    $ python
    zsh: command not found: python

    $ brew list | grep python
    python@3.10
    python@3.8
    python@3.9

    $ python3
    Python 3.9.12 (main, Mar 26 2022, 15:51:15)
    [Clang 13.1.6 (clang-1316.0.21.2)] on darwin
    Type "help", "copyright", "credits" or "license" for more information.
    >>>
    ```

    可以看到我本地安装了 Python3 的 3.8、3.9、3.10 三个版本，默认 3.9，没有安装 Python2。

这没什么问题，那继续找，尝试下在 MacVim 里执行 Python3 语句：

```
:py3 import sys;
```

结果输出了一堆报错：

```
E370: 无法加载库 /usr/local/Frameworks/Python.framework/Versions/3.10/Python：dlopen(/usr/local/Frameworks/Python.fram
ework/Versions/3.10/Python, 0x0009): tried: '/usr/local/Frameworks/Python.framework/Versions/3.10/Python' (no such fil
e), '/Library/Frameworks/Python.framework/Versions/3.10/Python' (no such file), '/System/Library/Frameworks/Python.fra
mework/Versions/3.10/Python' (no such file)
E263: 抱歉，此命令不可用，无法加载 Python 库。
```

它要找的这个文件路径确实不存在……毕竟我默认的是 3.9 版本，所以  /usr/local/Frameworks/Python.framework/Versions/ 下只有 3.9 和 current 目录，没有 3.10。

它为啥放着配置好的 3.9 版本不用，非得这么头铁去找 3.10 版本呢？这个问题先不回答，留待后面的刨根问底环节。现在先解决问题。

## 解决问题

在网上将以上错误信息搜索一番后，了解到了可以通过设置 `pythonthreedll` 来指定动态加载的 Python3 支持库。

另外，也了解了一下，通过 brew 安装的多个 Python 版本如何切换默认版本。

所以这个小问题找到了两种解决方法：

一、在 _vimrc 里添加配置，指定动态加载的 Python3 支持库路径，比如：

```vim
let &pythonthreedll='/usr/local/Frameworks/Python.framework/Versions/3.9/python'
```

二、切换系统默认 Python3 版本，比如这里 MacVim 寻找 3.10 版本，我就把默认的切换到 3.10 版本好了：

```sh
brew unlink python@3.9
brew link python@3.10
```

经验证以上两个方法都可以解决问题，我最终用了第二种。

## 刨根问底

上面我们遗留了一个问题，为什么 MacVim 那么头铁非要加载 3.10 版本的 Python 支持库呢？

首先看一下 `pythonthreedll` 的帮助文档说明：

```
:h pythonthreedll
```

可以看到：

```
'pythonthreedll'	string	(default depends on the build)
			global
			{only available when compiled with the |+python3/dyn|
			feature}
	Specifies the name of the Python 3 shared library. The default is
	DYNAMIC_PYTHON3_DLL, which was specified at compile time.
	Environment variables are expanded |:set_env|.
	This option cannot be set from a |modeline| or in the |sandbox|, for
	security reasons.
```

也就是说默认值是在编译时指定的 `DYNAMIC_PYTHON3_DLL` 值，按我理解那就是说如果没有在配置文件里人为指定，那它就是会按编译时指定的去加载。

那编译时的 `DYNAMIC_PYTHON3_DLL`，我们可以在 MacVim 的官方仓库 [.github/worflows/ci-macvim.yaml](https://github.com/macvim-dev/macvim/blob/master/.github/workflows/ci-macvim.yaml) 里找到，关键内容：

```yaml
...

  vi_cv_dll_name_python3: /usr/local/Frameworks/Python.framework/Versions/3.10/Python # Make sure to keep src/MacVim/vimrc synced with the Python version here for the Python DLL detection logic.

...

          grep -q -- "-DDYNAMIC_PYTHON3_DLL=\\\\\"${vi_cv_dll_name_python3}\\\\\"" src/auto/config.mk

...
```

至此破案了。

## 参考

- <https://www.jianshu.com/p/18f06d12348c>
