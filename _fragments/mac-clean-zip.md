---
layout: fragment
title: Mac 下删除 zip 文件里的隐藏文件
tags: [mac]
description: Mac 下清除 zip 文件里的 .DS_Store 和 __MACOSX 文件夹的方法。
keywords: Mac, zip, DS_Store, MACOSX
---

使用 Mac 自带的压缩功能，打出来的 zip 包里面会打入像 .DS_Store 和 __MACOSX 这些东西，在有些场景下需要将它们清除。

这时，可以使用以下命令：

```sh
zip -d 归档.zip "__MACOSX*"
zip -d 归档.zip "*.DS_Store"
```

或者，创建一个如下内容的 cleanzip.sh 文件，放到 PATH 环境变量包含的路径里面，然后在需要时执行 `cleanzip 归档.zip` 即可：

```sh
zip -d "$1" "__MACOSX*"
zip -d "$1" "*.DS_Store"
```

参考：[如何取消macOS压缩时生成的「_MACOSX」的隐藏文件夹？ - 知乎](https://www.zhihu.com/question/475167014)
