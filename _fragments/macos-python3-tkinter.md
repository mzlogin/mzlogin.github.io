---
layout: fragment
title: macOS 下 Python3 提示 No module named _tkinter
tags: [mac, python]
description: macOS 下 Python3 提示 No module named _tkinter，解决方法。
keywords: macOS, Python3, tkinter
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

在 macOS 下运行一个依赖 tkinter 的 Python3 脚本时，提示：

```
import _tkinter # If this fails your Python may not be configured for Tk
ModuleNotFoundError: No module named '_tkinter'
```

第一反应是需要安装 tk 包，于是执行：

```bash
$ brew install python-tk

Running `brew update --preinstall`...
Warning: python-tk@3.9 3.9.12 is already installed and up-to-date.
To reinstall 3.9.12, run:
  brew reinstall python-tk@3.9
```

但执行脚本还是报错，这里注意到提示的是 `python-tk@3.9`，而我执行 `python3` 命令跑的是 Python3.10，于是执行：

```bash
brew install python-tk@3.10
```

问题解决。

顺便记录一下寻找 site-packages 路径的方法：

```
python3 -m site
```
