---
layout: fragment
title: macOS 下提取 .dmg 文件的内容
tags: [mac]
description: macOS 下提取 dmg 文件里的内容
keywords: macOS, dmg 
---

有的场景下无法直接使用 .dmg 文件来挂载、安装应用，只能想办法提取 .dmg 文件里的 .pkg 或者 .app 来安装，此时可以借助 7-zip。

```
brew install 7-zip
7zz x x.dmg
```

解压出来如果是 .pkg 文件，可以直接双击安装；

如果是 .app 文件，可以复制粘贴到应用程序里。
