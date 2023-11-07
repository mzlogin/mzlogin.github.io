---
layout: fragment
title: Mac 打开应用程序时出现「你不能打开应用程序」错误
tags: [mac]
description: Mac 打开应用程序时出现「你不能打开应用程序」错误，如何解决？
keywords: Mac, Microsoft Edge, sonoma
mermaid: false
sequence: false
flow: false
mathjax: false
mindmap: false
mindmap2: false
---

前一阵更新 macOS 到 Sonoma 14.0 版本，然后遇到一个问题，Microsoft Edge 浏览器每次自动更新后，都会出现「你不能打开应用程序，因为它可能已损坏或不完整」的错误，Docker 栏的应用图标也会发生变化，如下图所示：

![](/images/fragments/macos-sonoma-cannot-open.png)

这种情况是因为应用自升级时，安装被系统阻止了（猜想）。

需要将设置中的「安全性与隐私」中的「允许从以下位置下载的应用」中开启「任何来源」，开启方法是在终端执行：

```sh
sudo spctl --master-disable
```

开启成功的效果如下图：

![](/images/fragments/macos-install-location-permit.png)

此时重新下载安装 Microsoft Edge 浏览器，以后再遇到自动更新，就可以正常使用了。