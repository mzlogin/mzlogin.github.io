---
layout: fragment
title: Mac 卸载输入法
tags: [mac]
description: Mac 卸载输入法
keywords: Mac, 输入法
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

输入法这类 App 比较特殊，安装以后在应用程序里是看不到的，所以卸载也不是直接把它拖到废纸篓里就可以了。

参考清歌输入法的说明，这里可以总结一种简单的方法：

```sh
sudo rm -rf "/Library/Input Methods/{input-method-name}.app"
sudo rm -rf "~/Library/Application Support/{input-method-name}"
```

其中 `input-method-name` 的值，不同的法不一样，比如清歌输入法是 `Qingg`，微信输入法是 `WeType`。
