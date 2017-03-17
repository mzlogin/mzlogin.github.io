---
layout: post
title: 为基于 xulrunner 的内嵌 Gecko 程序启用 Profile
categories: Gecko
description: 为基于 xulrunner 为内嵌 Gecko 程序启用 Profile
keywords: Gecko, Profile
---

Mozilla 自带的 Profile 支持实际上是非常给力的，看看 %appdata%/Mozilla/Firefox 下的文件就能知道，这里存放着许多的信息，它们提供了很多东西，例如：

1. 可以通过 Profiles/…default/chrome 下的 userchrome.css 文件来定制自己的 firefox 外观，比如用 #appmenu-button { display:none !important;} 这样一句就可以去掉 firefox 左上角难看的按钮菜单

2. 安装的 extensions，Addon 放在这里

3. 证书相关、组件列表、cookie、插件列表等等都可以在这里找到

等等等等。

合理利用这些文件和信息我们可以在自己内嵌 Gecko 的程序里方便地做一些事情而不用自己去操作和维护一些配置项和数据。

在自己编译完 xulrunner-1.9.2 后尚能找到编译好的 profdirserviceprovidersa_s.lib 来用于 WinEmbed 工程的移植，最近编译了 xulrunner-10.0.2 后发现就没这么幸运了，没有生成这个东东。在头疼了一番后决定自己做一个工程来生成它。根据 xulrunner 源码 mozilla-release/profile/dirserviceprovider 下的几个 makefile 来做就可以了。

直接讲过程吧。

一、编译出需要的 Lib 文件

新建一个 Win32 静态 Lib 空工程，将 mozilla-release/profile/dirserviceprovider 目录下的几个 .h 和 .cpp 文件都添加进工程，将 path/to/xulrunner-10.0.2-sdk/include 添加到工程的附加包含目录，为工程添加预处理器定义 XP_WIN 和 XPCOM_GLUE 这两项。如果一切顺利的话这时候你已经可以顺利地编译出这个 lib 文件了。在 <http://download.csdn.net/detail/mzlogin/4382847> 可以下载到我的 Demo 工程，如果想编译，需要将上面所讲的 path/to/xulrunner-10.0.2-sdk/include 修改成你本机上 xulrunner sdk 的相应路径。

二、将 Lib 链接进自己内嵌 Gecko 的程序

自写一个启用 profile 的函数，我这里直接使用 WinEmbed 例子里提供的 StartupProfile 函数：

```cpp
nsresult StartupProfile()
{
    nsCOMPtr<nsIFile> appDataDir;
    nsresult rv = NS_GetSpecialDirectory(NS_APP_APPLICATION_REGISTRY_DIR, getter_AddRefs(appDataDir));
    if (NS_FAILED(rv))
      return rv;

    appDataDir->AppendNative(nsCString("MozillaDemo"));
    nsCOMPtr<nsILocalFile> localAppDataDir(do_QueryInterface(appDataDir));

    nsCOMPtr<nsProfileDirServiceProvider> locProvider;
    NS_NewProfileDirServiceProvider(PR_TRUE, getter_AddRefs(locProvider));
    if (!locProvider)
      return NS_ERROR_FAILURE;

    rv = locProvider->Register();
    if (NS_FAILED(rv))
      return rv;

    return locProvider->SetProfileDir(localAppDataDir);
}
```

其中的”MozillaDemo”即是你的 profile 文件夹的名字，可以根据你的喜好改动，在这里会是 %appdata%/Mozilla/MozillaDemo

在初始化 Gecko 运行环境的过程里调用完 XRE_InitEmbedding2 之后，添加

```cpp
if (NS_FAILED(StartupProfile())) {
    result = 8;
}
else {
```

在此文件开始添加

```cpp
#include "nsAppDirectoryServiceDefs.h"
#include "nsDirectoryServiceDefs.h"
#include "nsProfileDirServiceProvider.h"
```

在合适的地方添加

```cpp
#pragma comment(lib, "编译出的 lib")
```

顺利的话，就大功告成了，运行一个你的内嵌 Gecko 程序然后去 %appdata%/Mozilla/MozillaDemo 看看吧~有图有真相哦。

<img src="/images/posts/gecko/geckouseprofile.png" width="80%" alt="Gecko Embed Program Use Profile"/>
