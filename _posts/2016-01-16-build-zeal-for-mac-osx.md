---
layout: post
title: Build Zeal for Mac OS X
categories: Mac
description: Build Zeal for Mac OS X
keywords: Mac OS X, Zeal
---

我承认，初次遇到 Dash 的时候，我是惊艳的。

怎么会有如此方便的文档查看工具？顿时觉得被各种加载奇慢的 API 文档坑苦了好多年！于是很开心地下载了我常用的 API 文档，并且找到了它在 Windows 下的替代品 Zeal 推荐给朋友们，感觉世界从此美好了许多。

可惜好景不长。

![](/images/posts/mac/dash-wait.png)

畅快地查询几次之后就经常看到这个等待的界面了，提示 `Please Purchase to Skip Waiting. The page will load in 8 seconds.`，用它就是为了提升查询效率的，年轻的生命禁不起这样的等待。

购买 Dash 是 $24.99，不能算贵，不过想起了它有个免费开源、界面锉一点但是够用的兄弟 Zeal，还是决定省下这些钱去吃顿好吃的。

## 下载地址

我在本机编译做的 dmg 文件我上传到了百度网盘，不想折腾的同学可以直接下载拿走。

下载地址：[Zeal-for-Mac-OSX.dmg][4]

打开后将 Zeal.app 拖到「应用程序」文件夹就行了。

## 编译 Zeal

Zeal 的源码在 [zealdocs/zeal][1]，编译方法在 README 的 [How to compile][2] 一节。

编译的步骤我参考了 [Compile Zeal on Mac OS X][3]，不过现在情况跟他那时候有了一些变化，至少从我这里编译的情况来看 Mac OS X 下可以不需要再安装 X11，而源码直接 qmake 和 make 编译通不过了。

如下是编译步骤：

1. 安装最新版 Qt，官方文档推荐的是 v5.2.0+，我安装的是 v5.5。

   下载地址：<http://www.qt.io/download-open-source/>

2. 安装 libarchive。

   ```
   brew install libarchive
   ```

3. 下载源码。

   ```
   git clone git@github.com:zealdocs/zeal.git
   ```

4. 编译。
   * 使用 Qt Creator 打开源码下的 zeal.pro 文件，点击「项目」标签，将构建设置里的「编辑构建配置」改为 Release。
   * 打开 src/core/core.pri 文件，在最后添加如下内容（需要将路径替换为你的机器上 libarchive 的对应完整路径）：

     ```
     macx: {
         INCLUDEPATH += /usr/local/Cellar/libarchive/3.1.2/include
         LIBS += -L/usr/local/Cellar/libarchive/3.1.2/lib -larchive
     }
     ```
   * Qt Creator 里的菜单项 「构建」——「构建所有项目」。

     如果编译不报错，在你的「项目」标签里的「构建目录」里填写的目录下的 bin 子目录里应该有 Zeal.app 了。

5. 生成安装包。

   使用 Terminal 进入 Zeal.app 所在目录，运行如下命令生成 Zeal.dmg 文件：

   ```
   macdeployqt Zeal.app -dmg
   ```

   macdeployqt 命令在 Qt 安装目录下能找到，比如我的这个命令在 /Users/mazhuang/Qt5.5.0/5.5/clang_64/bin 目录下。

## 使用截图

![zeal-for-mac](/images/posts/mac/zeal-for-mac.png)

## 遇到过的问题

### 编译时报错

编译过程中遇到过若干种报错，其实都是由于 libarchive 造成的，正确安装并配置 include 和 lib 目录即可。

报错 1：

```
zeal/src/core/extractor.cpp:27: error: 'archive.h' file not found
#include <archive.h>
         ^
```

报错 2：

```
Undefined symbols for architecture x86_64:
"_archive_entry_pathname", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_entry_set_pathname", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_error_string", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_filter_bytes", referenced from:
Zeal::Core::Extractor::progressCallback(void*) in extractor.o
"_archive_read_extract", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_extract_set_progress_callback", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_free", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_new", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_next_header", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_open_filename", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_support_filter_all", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
"_archive_read_support_format_all", referenced from:
Zeal::Core::Extractor::extract(QString const&, QString const&, QString const&) in extractor.o
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
make[1]: *** [../bin/Zeal.app/Contents/MacOS/Zeal] Error 1
make: *** [sub-src-make_first-ordered] Error 2
23:47:44: 进程"/usr/bin/make"退出，退出代码 2 。
Error while building/deploying project zeal (kit: Desktop Qt 5.5.0 clang 64bit)
When executing step "Make"
23:47:44: Elapsed time: 00:01.
```

**解决方法：** 安装 libarchive，将根据上面编译步骤 4 里的说明修改 src/core/core.pri 文件。

关于这个问题的讨论见 [zealdocs/zeal#372][5]。

### 打包时报错

在打包 dmg 文件的过程中会提示 ERROR，这个貌似不影响，直接忽略就好。

```
ERROR: no file at "/opt/local/lib/mysql55/mysql/libmysqlclient.18.dylib"
ERROR: no file at "/usr/local/lib/libpq.5.dylib"
```

**解决方法：** 忽略。

感谢 Dash，Dash 再见。

[1]: https://github.com/zealdocs/zeal
[2]: https://github.com/zealdocs/zeal#how-to-compile
[3]: http://www.hjue.me/post/compile-zear-on-mac-os-x
[4]: http://pan.baidu.com/s/1boqExRp
[5]: https://github.com/zealdocs/zeal/pull/372
